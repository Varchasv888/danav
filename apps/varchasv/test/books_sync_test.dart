import 'dart:convert';

import 'package:decimal/decimal.dart';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:varchasv/data/books.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/sync/api_client.dart';
import 'package:varchasv/sync/sync_service.dart';

const companyId = '00000000-0000-4000-8000-00000000c001';
const cash = '00000000-0000-4000-8000-0000000000a1';
const rent = '00000000-0000-4000-8000-0000000000a2';
const sales = '00000000-0000-4000-8000-0000000000a3';

Map<String, dynamic> snapshot() => {
      'cursor': '100',
      'full': true,
      'companies': [{'id': companyId, 'name': 'Test Traders', 'booksBeginOn': '2026-04-01'}],
      'fiscalYears': [{'id': 'fy1', 'companyId': companyId, 'label': '2026-27', 'startsOn': '2026-04-01', 'endsOn': '2027-03-31', 'lockedUpTo': null, 'closed': false}],
      'accountGroups': [
        {'id': 'g-cash', 'companyId': companyId, 'key': 'cash_in_hand', 'name': 'Cash-in-Hand', 'nature': 'asset', 'parentId': null},
        {'id': 'g-exp', 'companyId': companyId, 'key': 'indirect_expenses', 'name': 'Indirect Expenses', 'nature': 'expense', 'parentId': null},
        {'id': 'g-sales', 'companyId': companyId, 'key': 'sales_accounts', 'name': 'Sales Accounts', 'nature': 'income', 'parentId': null},
        {'id': 'g-debtors', 'companyId': companyId, 'key': 'sundry_debtors', 'name': 'Sundry Debtors', 'nature': 'asset', 'parentId': null},
      ],
      'accounts': [
        {'id': cash, 'companyId': companyId, 'groupId': 'g-cash', 'key': 'cash', 'name': 'Cash', 'openingBalance': '10000.00', 'system': true},
        {'id': rent, 'companyId': companyId, 'groupId': 'g-exp', 'key': 'rent', 'name': 'Rent', 'openingBalance': '0.00', 'system': true},
        {'id': sales, 'companyId': companyId, 'groupId': 'g-sales', 'key': 'sales', 'name': 'Sales', 'openingBalance': '0.00', 'system': true},
      ],
      'vouchers': [],
      'numberSeries': [
        {'docType': 'payment', 'fiscalYearId': 'fy1', 'pattern': 'P{DEV}/{FY}/{SEQ:5}', 'nextSeq': 1},
      ],
    };

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late LocalDb db;
  late Books books;

  setUp(() async {
    db = LocalDb(NativeDatabase.memory());
    books = Books(db);
    await applyPull(db, snapshot());
    await db.setMeta('cursor', '100'); // as the first (full) pull would leave it
    await db.setMeta('deviceCode', 'A1');
    await db.setMeta('deviceId', '00000000-0000-4000-8000-0000000000d1');
  });
  tearDown(() => db.close());

  Future<Voucher> rentPayment(String amount, {String date = '2026-09-10'}) => books.postVoucher(
        type: 'payment', date: date,
        lines: [LineDraft(accountId: rent, debit: amount), LineDraft(accountId: cash, credit: amount)],
      );

  group('offline books', () {
    test('posts with the device number series and queues the operation', () async {
      final v1 = await rentPayment('1500');
      final v2 = await rentPayment('250.50');
      expect(v1.number, 'PA1/26-27/00001');
      expect(v2.number, 'PA1/26-27/00002');
      expect(v1.syncState, 'pending');
      final ops = await db.select(db.outbox).get();
      expect(ops.map((o) => o.kind), ['voucher.create', 'voucher.create']);
      final payload = jsonDecode(ops.first.payload) as Map<String, dynamic>;
      expect(payload['number'], 'PA1/26-27/00001');
      expect(payload['seq'], 1);
      expect(payload['lines'], [{'accountId': rent, 'debit': '1500.00'}, {'accountId': cash, 'credit': '1500.00'}]);
    });

    test('refuses invalid vouchers without using up a number', () async {
      await expectLater(
        books.postVoucher(type: 'payment', date: '2026-09-10', lines: [LineDraft(accountId: rent, debit: '100'), LineDraft(accountId: sales, credit: '100')]),
        throwsA(isA<BooksException>().having((e) => e.code, 'code', 'payment_needs_cash_bank_credit')),
      );
      await expectLater(rentPayment('100', date: '2026-03-31'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'before_books_begin')));
      expect((await rentPayment('100')).number, 'PA1/26-27/00001');
    });

    test('opens a new device series in a new financial year', () async {
      expect((await rentPayment('100', date: '2027-04-02')).number, 'PA1/27-28/00001');
    });

    test('balances count posted vouchers only, exactly to the paisa', () async {
      for (var i = 0; i < 300; i++) {
        await rentPayment('0.29');
      }
      final v = await rentPayment('1000');
      Decimal bal(String id, List<AccountBalance> bs) => bs.firstWhere((b) => b.account.id == id).balance;
      var bs = await books.balances();
      expect(bal(rent, bs), Decimal.parse('1087')); // 300 × 0.29 + 1000, no floating-point drift
      expect(bal(cash, bs), Decimal.parse('8913'));
      await books.cancelVoucher(v.id, 'duplicate');
      bs = await books.balances();
      expect(bal(rent, bs), Decimal.parse('87'));
    });

    test('creates accounts offline and validates the GSTIN', () async {
      final a = await books.createAccount(name: 'Ramesh Stores', groupId: 'g-debtors', gstin: '27aapfu0939f1zv');
      expect(a.gstin, '27AAPFU0939F1ZV');
      expect(a.stateCode, '27');
      await expectLater(books.createAccount(name: 'ramesh stores', groupId: 'g-debtors'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'account_name_taken')));
      await expectLater(books.createAccount(name: 'Bad', groupId: 'g-debtors', gstin: '27AAPFU0939F1ZW'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'gstin_checksum')));
    });
  });

  group('sync', () {
    test('pushes in order, marks results, parks permanent failures and keeps retryable ones', () async {
      final ok = await rentPayment('100');
      final locked = await rentPayment('200');
      final flaky = await rentPayment('300');
      final ops = await db.select(db.outbox).get();
      final pulls = <String?>[];

      final client = MockClient((req) async {
        if (req.url.path == '/sync/push') {
          final body = jsonDecode(req.body) as Map<String, dynamic>;
          final sent = (body['ops'] as List).cast<Map<String, dynamic>>();
          expect(sent.map((o) => o['opId']), ops.map((o) => o.opId)); // in queue order
          return http.Response(jsonEncode({
            'results': [
              {'opId': sent[0]['opId'], 'ok': true, 'result': {'id': ok.id}},
              {'opId': sent[1]['opId'], 'ok': false, 'error': 'period_locked'},
              {'opId': sent[2]['opId'], 'ok': false, 'error': 'internal'},
            ],
          }), 200);
        }
        if (req.url.path == '/auth/me') {
          return http.Response(jsonEncode({'permissions': ['sales.view', 'sales.create']}), 200);
        }
        if (req.url.path == '/sync/offline-rules') {
          return http.Response(jsonEncode([{'action': 'pos.bill', 'mode': 'online_only', 'note': 'Paused'}]), 200);
        }
        pulls.add(req.url.queryParameters['cursor']);
        return http.Response(jsonEncode({'cursor': '205', 'full': false, 'vouchers': [], 'accounts': []}), 200);
      });
      final sync = SyncService(db, ApiClient(baseUrl: 'http://api.test', token: 't', client: client));
      await sync.syncNow();

      Future<Voucher> get(String id) => (db.select(db.vouchers)..where((v) => v.id.equals(id))).getSingle();
      expect((await get(ok.id)).syncState, 'synced');
      expect((await get(locked.id)).syncState, 'failed');
      expect((await get(locked.id)).syncError, 'period_locked');
      expect((await get(flaky.id)).syncState, 'pending');
      expect(sync.pending, 1);
      expect(sync.failed, 1);
      // A retryable failure stops the push, but the pull still happens.
      expect(pulls, ['100']);
      expect(await db.getMeta('cursor'), '205');
      // The rules the server sent are kept, and are what the app uses next time it starts.
      expect(sync.rules.canQueue('pos.bill'), isFalse);
      final again = SyncService(db, ApiClient(baseUrl: 'http://api.test', token: 't', client: client));
      await again.loadRules();
      expect(again.rules.canQueue('pos.bill'), isFalse);
      expect(again.rules.all.length, 1);
      // So are the person's rights: a cashier's device offers the counter, not the books.
      expect(sync.rights, {'sales.view', 'sales.create'});
      expect(again.rights, {'sales.view', 'sales.create'});
    });

    test('a pull never overwrites a voucher still waiting to upload', () async {
      final v = await rentPayment('100');
      await books.cancelVoucher(v.id, 'mistake'); // local change, queued
      await applyPull(db, {
        'vouchers': [
          {'id': v.id, 'companyId': companyId, 'type': 'payment', 'number': v.number, 'date': v.date, 'total': '100.00', 'status': 'posted', 'lines': []},
        ],
      });
      final after = await (db.select(db.vouchers)..where((x) => x.id.equals(v.id))).getSingle();
      expect(after.status, 'cancelled');
    });

    test('stopping sync while a run is in flight (e.g. signing out) does not crash', () async {
      await rentPayment('100');
      final sync = SyncService(db, ApiClient(baseUrl: 'http://api.test', token: 't', client: MockClient((_) async {
        await Future<void>.delayed(const Duration(milliseconds: 50));
        return http.Response('{"results":[],"cursor":"1"}', 200);
      })));
      final run = sync.syncNow();
      sync.dispose();
      await run; // must complete without "used after being disposed"
    });

    test('offline: nothing is lost and status says offline', () async {
      await rentPayment('100');
      final sync = SyncService(db, ApiClient(baseUrl: 'http://api.test', token: 't', client: MockClient((_) async => throw Exception('no network'))));
      await sync.syncNow();
      expect(sync.status, SyncStatus.offline);
      expect(sync.pending, 1);
    });
  });
}
