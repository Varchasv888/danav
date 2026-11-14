import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart';
import 'package:flutter/foundation.dart';

import '../data/database.dart';
import '../data/field.dart';
import '../data/hr.dart';
import '../data/pos.dart';
import '../domain/domain.dart';
import 'api_client.dart';

/// Server errors that mean "this operation will never succeed as sent": the op is parked as failed
/// and shown to the user. Anything else (offline, server error) is retried on the next sync.
bool _permanent(String code) => code != 'internal' && code != 'offline' && code != 'error';

enum SyncStatus { idle, syncing, offline, error }

/// Two-step sync: push the outbox in order, then pull what changed elsewhere.
class SyncService extends ChangeNotifier {
  SyncService(this.db, this.api);
  final LocalDb db;
  final ApiClient api;

  SyncStatus status = SyncStatus.idle;
  DateTime? lastSyncAt;
  String? lastError;
  int pending = 0;
  int failed = 0;

  /// What the offline app may do per action: the built-in table until the server's copy arrives.
  OfflineRules rules = OfflineRules();

  /// What the signed-in person may do, as the server last said; null until known (then every section shows, as before).
  Set<String>? rights;

  /// Set when the server says this device was revoked: it stops syncing and the screen says why.
  bool revoked = false;
  Timer? _timer;
  Future<void>? _running;

  void startAutoSync({Duration every = const Duration(seconds: 60)}) {
    _timer?.cancel();
    _timer = Timer.periodic(every, (_) => syncNow());
    loadRules();
    syncNow();
  }

  bool _disposed = false;

  @override
  void dispose() {
    _disposed = true;
    _timer?.cancel();
    super.dispose();
  }

  /// A sync already in flight may finish after dispose (e.g. signing out mid-sync); it must not notify.
  @override
  void notifyListeners() {
    if (!_disposed) super.notifyListeners();
  }

  /// Runs one sync; concurrent callers share the same run.
  Future<void> syncNow() => _running ??= _run().whenComplete(() => _running = null);

  Future<void> _run() async {
    final deviceId = await db.getMeta('deviceId');
    if (deviceId == null) return;
    status = SyncStatus.syncing;
    notifyListeners();
    try {
      await _push(deviceId);
      await _pull(deviceId);
      await _refreshRules();
      lastSyncAt = DateTime.now();
      await db.setMeta('lastSyncAt', lastSyncAt!.toIso8601String());
      status = SyncStatus.idle;
      lastError = null;
    } on ApiException catch (e) {
      status = e.isNetwork ? SyncStatus.offline : SyncStatus.error;
      lastError = e.code;
      if (e.code == 'device_revoked') revoked = true;
    }
    await refreshCounts();
  }

  /// Loads the rules saved last time, so they apply from the first screen even offline.
  Future<void> loadRules() async {
    try {
      final granted = await db.getMeta('permissions');
      if (granted != null) rights = (jsonDecode(granted) as List).cast<String>().toSet();
      final saved = await db.getMeta('offlineRules');
      if (saved != null) rules = OfflineRules.fromServer(jsonDecode(saved));
      notifyListeners();
    } catch (_) {}
  }

  /// Asks the server for the current rules and keeps them. A failure here never fails the sync.
  Future<void> _refreshRules() async {
    try {
      final r = await api.get('/sync/offline-rules');
      final list = r['data'];
      if (list is List && list.isNotEmpty) {
        rules = OfflineRules.fromServer(list);
        await db.setMeta('offlineRules', jsonEncode(list));
      }
      final me = await api.get('/auth/me');
      final granted = me['permissions'];
      if (granted is List) {
        rights = granted.cast<String>().toSet();
        await db.setMeta('permissions', jsonEncode(granted));
      }
    } on ApiException {
      // keep what we have
    }
  }

  Future<void> refreshCounts() async {
    final ops = await db.select(db.outbox).get();
    pending = ops.where((o) => o.state == 'pending').length;
    failed = ops.where((o) => o.state == 'failed').length;
    lastSyncAt ??= DateTime.tryParse(await db.getMeta('lastSyncAt') ?? '');
    notifyListeners();
  }

  Future<void> _push(String deviceId) async {
    while (true) {
      final batch = await (db.select(db.outbox)
            ..where((o) => o.state.equals('pending'))
            ..orderBy([(o) => OrderingTerm.asc(o.seq)])
            ..limit(100))
          .get();
      if (batch.isEmpty) return;
      await uploadPhotos(batch);
      final res = await api.push(deviceId, [
        for (final o in batch) {'opId': o.opId, 'kind': o.kind, 'payload': jsonDecode(o.payload)},
      ]);
      final results = {for (final r in (res['results'] as List).cast<Map<String, dynamic>>()) r['opId']: r};
      var retryLater = false;
      await db.transaction(() async {
        for (final o in batch) {
          final r = results[o.opId];
          final payload = jsonDecode(o.payload) as Map<String, dynamic>;
          if (r != null && r['ok'] == true) {
            await (db.delete(db.outbox)..where((x) => x.seq.equals(o.seq))).go();
            if (o.kind.startsWith('voucher.')) {
              await (db.update(db.vouchers)..where((v) => v.id.equals(payload['id'] as String)))
                  .write(const VouchersCompanion(syncState: Value('synced'), syncError: Value(null)));
            }
            await settleHrOp(db, o.kind, payload);
            await settlePosOp(db, o.kind, payload, result: r['result'] as Map<String, dynamic>?);
            await settleFieldOp(db, o.kind, payload, result: r['result'] as Map<String, dynamic>?);
          } else {
            final code = (r?['error'] as String?) ?? 'internal';
            if (!_permanent(code)) {
              retryLater = true;
              continue;
            }
            await (db.update(db.outbox)..where((x) => x.seq.equals(o.seq))).write(OutboxCompanion(state: const Value('failed'), error: Value(code)));
            if (o.kind.startsWith('voucher.')) {
              await (db.update(db.vouchers)..where((v) => v.id.equals(payload['id'] as String)))
                  .write(VouchersCompanion(syncState: const Value('failed'), syncError: Value(code)));
            }
            await settleHrOp(db, o.kind, payload, error: code);
            await settlePosOp(db, o.kind, payload, error: code);
            await settleFieldOp(db, o.kind, payload, error: code);
          }
        }
      });
      if (retryLater) return;
    }
  }

  /// Receipt photos taken offline go up first and each claim line then carries the file's id. A missing file is dropped (the claim still goes);
  /// a failed upload (no network) stops the sync so it is tried again.
  Future<void> uploadPhotos(List<OutboxData> batch) async {
    for (final o in batch.where((x) => x.kind == 'expense.claim')) {
      final p = jsonDecode(o.payload) as Map<String, dynamic>;
      final lines = (p['lines'] as List).cast<Map<String, dynamic>>();
      var changed = false;
      for (final l in lines) {
        final path = l['photoPath'] as String?;
        if (path == null) continue;
        final f = File(path);
        if (f.existsSync()) {
          final lower = path.toLowerCase();
          final type = lower.endsWith('.png') ? 'image/png' : lower.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
          final up = await api.post('/files', {'name': path.split(RegExp(r'[/\\]')).last, 'contentType': type, 'base64': base64Encode(await f.readAsBytes())});
          final id = (up['id'] ?? (up['data'] is Map ? up['data']['id'] : null)) as String?;
          if (id != null) l['fileId'] = id;
        }
        l.remove('photoPath');
        changed = true;
      }
      if (changed) await (db.update(db.outbox)..where((x) => x.seq.equals(o.seq))).write(OutboxCompanion(payload: Value(jsonEncode(p))));
    }
  }

  Future<void> _pull(String deviceId) async {
    final cursor = await db.getMeta('cursor');
    final data = await api.pull(deviceId, cursor);
    await applyPull(db, data);
    await db.setMeta('cursor', data['cursor'] as String);
  }

  /// Parks a failed op back into the queue (after the user fixed the cause, e.g. unlocked a period).
  Future<void> retryFailed() async {
    await (db.update(db.outbox)..where((o) => o.state.equals('failed'))).write(const OutboxCompanion(state: Value('pending'), error: Value(null)));
    await syncNow();
  }
}

String _s(Object? v) => v == null ? '0.00' : money(v.toString());

/// Stores a pull response. Server rows win, except vouchers this device still has queued for upload.
Future<void> applyPull(LocalDb db, Map<String, dynamic> data) => db.transaction(() async {
      List<Map<String, dynamic>> list(String k) => ((data[k] as List?) ?? const []).cast<Map<String, dynamic>>();

      for (final c in list('companies')) {
        await db.into(db.companies).insertOnConflictUpdate(CompaniesCompanion.insert(id: c['id'], name: c['name'], booksBeginOn: c['booksBeginOn']));
      }
      for (final f in list('fiscalYears')) {
        await db.into(db.fiscalYears).insertOnConflictUpdate(FiscalYearsCompanion.insert(
              id: f['id'], companyId: f['companyId'], label: f['label'], startsOn: f['startsOn'], endsOn: f['endsOn'],
              lockedUpTo: Value(f['lockedUpTo'] as String?), closed: Value(f['closed'] as bool? ?? false),
            ));
      }
      for (final g in list('accountGroups')) {
        await db.into(db.accountGroups).insertOnConflictUpdate(AccountGroupsCompanion.insert(
              id: g['id'], companyId: g['companyId'], parentId: Value(g['parentId'] as String?), key: Value(g['key'] as String?),
              name: g['name'], nameHi: Value(g['nameHi'] as String?), nature: g['nature'],
            ));
      }
      for (final a in list('accounts')) {
        await db.into(db.accounts).insertOnConflictUpdate(AccountsCompanion.insert(
              id: a['id'], companyId: a['companyId'], groupId: a['groupId'], key: Value(a['key'] as String?), name: a['name'],
              nameHi: Value(a['nameHi'] as String?), openingBalance: Value(_s(a['openingBalance'])), gstin: Value(a['gstin'] as String?),
              stateCode: Value(a['stateCode'] as String?), phone: Value(a['phone'] as String?),
              archived: Value(a['archived'] as bool? ?? false), system: Value(a['system'] as bool? ?? false),
            ));
      }
      final queued = {
        for (final o in await db.select(db.outbox).get())
          if (o.kind.startsWith('voucher.')) (jsonDecode(o.payload) as Map<String, dynamic>)['id'] as String,
      };
      for (final v in list('vouchers')) {
        final id = v['id'] as String;
        if (queued.contains(id)) continue; // our newer local change hasn't been uploaded yet
        await db.into(db.vouchers).insertOnConflictUpdate(VouchersCompanion.insert(
              id: id, companyId: v['companyId'], type: v['type'], number: v['number'], date: v['date'], total: _s(v['total']),
              narration: Value(v['narration'] as String?), reference: Value(v['reference'] as String?),
              status: Value(v['status'] as String), syncState: const Value('synced'), syncError: const Value(null),
            ));
        await (db.delete(db.voucherLines)..where((l) => l.voucherId.equals(id))).go();
        for (final l in (v['lines'] as List).cast<Map<String, dynamic>>()) {
          await db.into(db.voucherLines).insert(VoucherLinesCompanion.insert(
                voucherId: id, lineNo: l['lineNo'] as int, accountId: l['accountId'], debit: Value(_s(l['debit'])), credit: Value(_s(l['credit'])),
              ));
        }
      }
      // The device's series: keep whichever counter is further ahead.
      final fyLabels = {for (final f in await db.select(db.fiscalYears).get()) f.id: f.label};
      for (final s in list('numberSeries')) {
        final label = fyLabels[s['fiscalYearId']];
        if (label == null) continue;
        final existing = await (db.select(db.deviceSeries)..where((x) => x.docType.equals(s['docType']) & x.fyLabel.equals(label))).getSingleOrNull();
        final next = s['nextSeq'] as int;
        if (existing == null) {
          await db.into(db.deviceSeries).insert(DeviceSeriesCompanion.insert(docType: s['docType'], fyLabel: label, pattern: s['pattern'], nextSeq: Value(next)));
        } else if (next > existing.nextSeq) {
          await (db.update(db.deviceSeries)..where((x) => x.docType.equals(s['docType']) & x.fyLabel.equals(label))).write(DeviceSeriesCompanion(nextSeq: Value(next)));
        }
      }
      await applyHrPull(db, data);
      await applyPosPull(db, data);
      await applyFieldPull(db, data);
    });
