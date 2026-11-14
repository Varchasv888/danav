import 'dart:async';
import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv_app/core/api.dart';
import 'package:varchasv_app/core/invoice.dart';
import 'package:varchasv_app/core/models.dart';
import 'package:varchasv_app/core/store.dart';

import 'support.dart';

InvoiceDraft draft(
  AppStore s, {
  String qty = '2',
  String rate = '100',
  int cust = 0,
}) {
  final d = InvoiceDraft(date: '2026-11-11')..customer = s.customers[cust];
  d.lines.first
    ..item = s.items.first
    ..qty = qty
    ..rate = rate;
  return d;
}

Future<void> settle() => Future<void>.delayed(const Duration(milliseconds: 20));

void main() {
  late FakeApi api;
  late MemoryKv kv;
  late AppStore store;

  setUp(() async {
    api = FakeApi();
    kv = MemoryKv();
    store = AppStore(api, kv);
    await store.refresh();
  });

  tearDown(() => store.dispose());

  test('the catalogue keeps only debtors as customers, takes the head office state, and is cached', () {
    expect(store.items.length, 6);
    expect(store.customers.map((c) => c.id), ['c1', 'c2']);
    expect(store.homeState, '27');
    expect(store.warehouses.single.name, 'Main');
    expect(kv.data['catalogue'], isNotNull);
  });

  test('a fresh start reads the saved catalogue without the network', () async {
    final s2 = AppStore(FakeApi()..offline = true, kv);
    await s2.init();
    expect(s2.items.length, 6);
    expect(s2.itemIndex.search('jeans').single.name, 'Denim Jeans');
    s2.dispose();
  });

  test('refresh while offline keeps what was loaded and says so', () async {
    api.offline = true;
    await store.refresh();
    expect(store.items.length, 6);
    expect(store.refreshError, 'offline');
  });

  test(
    'a good save reaches the server once, with the number written back',
    () async {
      final e = store.saveInvoice(draft(store));
      expect(e.state, anyOf(SyncState.pending, SyncState.syncing));
      await settle();
      expect(e.state, SyncState.synced);
      expect(e.number, 'INV/0001');
      expect(api.posts, 1);
      expect(store.waiting, 0);
    },
  );

  test('offline: the invoice waits, nothing is lost, and it goes when the network is back', () async {
    api.offline = true;
    final e = store.saveInvoice(draft(store));
    await settle();
    expect(e.state, SyncState.pending);
    expect(store.waiting, 1);
    api.offline = false;
    await store.syncOutbox();
    expect(e.state, SyncState.synced);
    expect(api.posts, 1);
  });

  test(
    'a timeout after sending is marked unsure and is NOT sent again by itself',
    () async {
      api.onPost = (n, b) => throw NetworkException('timeout', sent: true);
      final e = store.saveInvoice(draft(store));
      await settle();
      expect(e.state, SyncState.unsure);
      await store.syncOutbox();
      await store.syncOutbox();
      expect(api.posts, 1, reason: 'sending again could make a second invoice');
      api.onPost = null;
      store.retry(e);
      await settle();
      expect(e.state, SyncState.synced);
      expect(api.posts, 2);
    },
  );

  test('a refusal (4xx) is shown as failed with the reason and does not block the ones behind it', () async {
    api.onPost = (n, b) {
      if (n == 1) throw ApiException(409, 'credit_blocked');
    };
    final first = store.saveInvoice(draft(store));
    final second = store.saveInvoice(draft(store, cust: 1));
    await settle();
    await settle();
    expect(first.state, SyncState.failed);
    expect(first.error, 'credit_blocked');
    expect(second.state, SyncState.synced);
  });

  test('invoices are sent oldest first', () async {
    api.offline = true;
    for (var i = 1; i <= 5; i++) {
      store.saveInvoice(draft(store, qty: '$i'));
    }
    await settle();
    api.offline = false;
    await store.syncOutbox();
    final qtys = [
      for (final b in api.posted) (b['lines'] as List).first['qty'],
    ];
    expect(qtys, ['1', '2', '3', '4', '5']);
  });

  test('closing the app mid-send: the outbox comes back and a sending entry becomes unsure', () async {
    api.offline = true;
    store.saveInvoice(draft(store));
    await settle();
    // Pretend the app died while the send was in flight.
    final saved = jsonDecode(kv.data['outbox']!) as List<dynamic>;
    (saved.first as Map<String, dynamic>)['state'] = 'syncing';
    kv.data['outbox'] = jsonEncode(saved);
    final s2 = AppStore(FakeApi(), kv);
    await s2.init();
    expect(s2.outbox.single.state, SyncState.unsure);
    s2.dispose();
  });

  test('saving returns in well under 3 ms, even with 500 invoices already waiting', () async {
    api.offline = true;
    for (var i = 0; i < 500; i++) {
      store.saveInvoice(draft(store));
    }
    final times = <int>[];
    for (var i = 0; i < 50; i++) {
      final sw = Stopwatch()..start();
      store.saveInvoice(draft(store));
      times.add(sw.elapsedMicroseconds);
    }
    times.sort();
    // ignore: avoid_print
    print(
      'save with 500 waiting: p50 ${times[25] / 1000} ms, p99 ${times[49] / 1000} ms, worst ${times.last / 1000} ms',
    );
    expect(times[(times.length * 0.99).floor() - 1] / 1000, lessThan(3));
  });

  test('discarding drops an entry and persists it', () async {
    api.offline = true;
    final e = store.saveInvoice(draft(store));
    await settle();
    store.discard(e);
    await settle();
    expect(store.outbox, isEmpty);
    expect(jsonDecode(kv.data['outbox']!), isEmpty);
  });

  test('two syncs at once do not send an invoice twice', () async {
    api.latency = const Duration(milliseconds: 30);
    store.saveInvoice(draft(store));
    unawaited(store.syncOutbox());
    unawaited(store.syncOutbox());
    await Future<void>.delayed(const Duration(milliseconds: 120));
    expect(api.posts, 1);
  });
}
