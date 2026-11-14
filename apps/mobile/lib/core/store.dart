/// The app's data: the catalogue kept in memory (so searches and totals never wait for the network), the invoices saved on this device waiting to reach the server,
/// and the sync between them. Saving an invoice returns as soon as it is written to memory; the server hears about it a moment later.
library;

import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'api.dart';
import 'invoice.dart';
import 'models.dart';
import 'perf.dart';
import 'search.dart';

abstract class KeyValue {
  Future<String?> read(String key);
  Future<void> write(String key, String value);
}

class MemoryKv implements KeyValue {
  final Map<String, String> data = {};
  @override
  Future<String?> read(String key) async => data[key];
  @override
  Future<void> write(String key, String value) async => data[key] = value;
}

final OutboxEntry _none = OutboxEntry(
  localId: '',
  createdAt: DateTime.fromMillisecondsSinceEpoch(0),
  customerName: '',
  total: '0',
  payload: const {},
);

class AppStore extends ChangeNotifier {
  final ApiPort api;
  final KeyValue kv;
  AppStore(this.api, this.kv);

  List<Item> items = [];
  List<Customer> customers = [];
  List<({String id, String name})> warehouses = [];
  String homeState = '27';
  String business = '';
  SearchIndex<Item> itemIndex = SearchIndex<Item>(
    [],
    (i) => i.hay,
    (i) => i.name,
  );
  SearchIndex<Customer> customerIndex = SearchIndex<Customer>(
    [],
    (c) => c.hay,
    (c) => c.name,
  );
  final List<OutboxEntry> outbox = [];
  bool refreshing = false;
  bool syncing = false;
  String? refreshError;
  DateTime? lastRefresh;
  int _local = 0;
  Timer? _retry;

  // ---- start-up: what was kept from last time --------------------------------------------------------------------------------

  Future<void> init() async {
    final cat = await kv.read('catalogue');
    if (cat != null) {
      try {
        _apply(jsonDecode(cat) as Map<String, dynamic>);
      } catch (_) {
        /* a damaged cache is simply refreshed */
      }
    }
    final box = await kv.read('outbox');
    if (box != null) {
      try {
        outbox.addAll([
          for (final e in jsonDecode(box) as List<dynamic>)
            OutboxEntry.fromJson(e as Map<String, dynamic>),
        ]);
        for (final e in outbox) {
          if (e.state == SyncState.syncing) e.state = SyncState.unsure;
        }
        _local = outbox.length;
      } catch (_) {}
    }
    notifyListeners();
  }

  void _apply(Map<String, dynamic> j) {
    items = [
      for (final i in j['items'] as List<dynamic>)
        Item.fromJson(i as Map<String, dynamic>),
    ];
    customers = [
      for (final c in j['customers'] as List<dynamic>)
        Customer.fromJson(c as Map<String, dynamic>),
    ];
    warehouses = [
      for (final w in j['warehouses'] as List<dynamic>)
        (id: w['id'] as String, name: w['name'] as String),
    ];
    homeState = (j['homeState'] ?? '27') as String;
    business = (j['business'] ?? '') as String;
    lastRefresh = j['at'] == null ? null : DateTime.tryParse(j['at'] as String);
    _reindex();
  }

  void _reindex() {
    itemIndex = SearchIndex<Item>(items, (i) => i.hay, (i) => i.name);
    customerIndex = SearchIndex<Customer>(
      customers,
      (c) => c.hay,
      (c) => c.name,
    );
  }

  // ---- the catalogue from the server ------------------------------------------------------------------------------------------

  Future<void> refresh() async {
    if (refreshing) return;
    refreshing = true;
    refreshError = null;
    notifyListeners();
    try {
      final r = await Future.wait<dynamic>([
        api.get('/items'),
        api.get('/accounts'),
        api.get('/accounts/groups'),
        api.get('/companies'),
        api.get('/inventory/setup'),
      ]);
      final groups = [
        for (final g in r[2] as List<dynamic>) g as Map<String, dynamic>,
      ];
      final debtors = {
        for (final g in groups)
          if (g['key'] == 'sundry_debtors' ||
              groups.any(
                (p) => p['id'] == g['parentId'] && p['key'] == 'sundry_debtors',
              ))
            g['id'],
      };
      final custs = [
        for (final a in r[1] as List<dynamic>)
          if (debtors.contains((a as Map)['groupId']) && a['archived'] != true)
            a,
      ];
      final company = (r[3] as List<dynamic>).isNotEmpty
          ? (r[3] as List<dynamic>).first as Map<String, dynamic>
          : <String, dynamic>{};
      final branches = [
        for (final b in (company['branches'] as List<dynamic>? ?? const []))
          b as Map<String, dynamic>,
      ];
      final home =
          branches.firstWhere(
            (b) => b['isHeadOffice'] == true,
            orElse: () =>
                branches.isNotEmpty ? branches.first : <String, dynamic>{},
          )['stateCode'] ??
          '27';
      final wh = [
        for (final w in ((r[4] as Map)['warehouses'] as List<dynamic>))
          if ((w as Map)['archived'] != true)
            {'id': w['id'], 'name': w['name']},
      ];
      final snapshot = {
        'items': [
          for (final i in r[0] as List<dynamic>)
            if ((i as Map)['archived'] != true) i,
        ],
        'customers': custs,
        'warehouses': wh,
        'homeState': home,
        'business': company['name'] ?? '',
        'at': DateTime.now().toIso8601String(),
      };
      _apply(snapshot);
      unawaited(kv.write('catalogue', jsonEncode(snapshot)));
    } on Object catch (e) {
      refreshError = e is ApiException ? e.code : 'offline';
    } finally {
      refreshing = false;
      notifyListeners();
    }
  }

  // ---- saving an invoice ---------------------------------------------------------------------------------------------------------

  /// Puts the invoice in the outbox and returns at once. The time this takes is the time the person waits (recorded as "save").
  OutboxEntry saveInvoice(InvoiceDraft draft) {
    final sw = Stopwatch()..start();
    final calc = draft.compute(homeState);
    final e = OutboxEntry(
      localId: 'L${DateTime.now().microsecondsSinceEpoch}-${_local++}',
      createdAt: DateTime.now(),
      customerName: draft.customer!.name,
      total: calc.tax?.grandTotalValue ?? '0.00',
      payload: draft.payload(),
    );
    outbox.insert(0, e);
    notifyListeners();
    Perf.record('save', sw.elapsedMicroseconds);
    unawaited(_persistOutbox());
    unawaited(syncOutbox());
    return e;
  }

  /// Each entry remembers its own encoded form, so saving one more invoice does not re-encode the hundreds already waiting.
  Future<void> _persistOutbox() =>
      kv.write('outbox', '[${outbox.map((e) => e.encoded()).join(',')}]');

  /// Sends what is waiting, oldest first. A request that never left the device is tried again later; one that may have reached the server is marked "unsure" and
  /// left for the person to check, because sending it again could make a second invoice.
  Future<void> syncOutbox() async {
    if (syncing) return;
    syncing = true;
    try {
      // Look again after each send: an invoice saved while this one was going out is picked up in the same run, oldest first.
      while (true) {
        final e = outbox.lastWhere(
          (x) => x.state == SyncState.pending,
          orElse: () => _none,
        );
        if (identical(e, _none)) break;
        e.state = SyncState.syncing;
        notifyListeners();
        try {
          final doc = await api.post(
            '/sales-invoices',
            e.payload,
          ) as Map<String, dynamic>;
          e.state = SyncState.synced;
          e.serverId = doc['id'] as String?;
          e.number = doc['number'] as String?;
          e.error = null;
        } on ApiException catch (x) {
          e.state = SyncState.failed;
          e.error = x.code;
        } on NetworkException catch (x) {
          if (x.sent) {
            e.state = SyncState.unsure;
            e.error = 'unsure';
          } else {
            e.state = SyncState.pending;
            _retry?.cancel();
            _retry = Timer(
              const Duration(seconds: 15),
              () => unawaited(syncOutbox()),
            );
            break;
          }
        }
        await _persistOutbox();
        notifyListeners();
      }
    } finally {
      syncing = false;
      notifyListeners();
    }
  }

  /// The person has checked the server and wants the unsure invoice sent again, or dropped.
  void retry(OutboxEntry e) {
    e.state = SyncState.pending;
    e.error = null;
    notifyListeners();
    unawaited(syncOutbox());
  }

  void discard(OutboxEntry e) {
    outbox.remove(e);
    unawaited(_persistOutbox());
    notifyListeners();
  }

  int get waiting => outbox
      .where(
        (e) =>
            e.state == SyncState.pending ||
            e.state == SyncState.syncing ||
            e.state == SyncState.unsure,
      )
      .length;

  @override
  void dispose() {
    _retry?.cancel();
    super.dispose();
  }
}
