import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart' show Value, driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:varchasv/data/audit.dart';
import 'package:varchasv/data/books.dart';
import 'package:varchasv/data/cashentry.dart';
import 'package:varchasv/data/customers.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/field.dart';
import 'package:varchasv/data/reports.dart';
import 'package:varchasv/data/tokens.dart';
import 'package:varchasv/sync/api_client.dart';
import 'package:varchasv/sync/sync_service.dart';

import 'books_sync_test.dart' show snapshot, cash, rent, companyId;

const bank = '00000000-0000-4000-8000-0000000000b1';

Map<String, dynamic> withBank() {
  final s = snapshot();
  s['accountGroups'] = [...(s['accountGroups'] as List), {'id': 'g-bank', 'companyId': companyId, 'key': 'bank_accounts', 'name': 'Bank Accounts', 'nature': 'asset', 'parentId': null}];
  s['accounts'] = [...(s['accounts'] as List), {'id': bank, 'companyId': companyId, 'groupId': 'g-bank', 'key': null, 'name': 'Current Account', 'openingBalance': '0.00', 'system': false}];
  s['numberSeries'] = [
    ...(s['numberSeries'] as List),
    {'docType': 'receipt', 'fiscalYearId': 'fy1', 'pattern': 'R{DEV}/{FY}/{SEQ:5}', 'nextSeq': 1},
    {'docType': 'contra', 'fiscalYearId': 'fy1', 'pattern': 'C{DEV}/{FY}/{SEQ:5}', 'nextSeq': 1},
  ];
  return s;
}

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late LocalDb db;
  late Books books;

  setUp(() async {
    db = LocalDb(NativeDatabase.memory());
    books = Books(db);
    await applyPull(db, withBank());
    await db.setMeta('cursor', '100');
    await db.setMeta('deviceCode', 'A1');
    await db.setMeta('deviceId', '00000000-0000-4000-8000-0000000000d1');
  });
  tearDown(() => db.close());

  group('cash and bank entry', () {
    test('makes the right voucher for money received, paid and moved', () async {
      final r = await postCashEntry(books, kind: CashKind.received, cashOrBankId: cash, otherId: rent, amount: '500', date: '2026-10-01');
      expect(r.type, 'receipt');
      final p = await postCashEntry(books, kind: CashKind.paid, cashOrBankId: cash, otherId: rent, amount: '200', date: '2026-10-02', narration: 'Tea');
      expect(p.type, 'payment');
      final c = await postCashEntry(books, kind: CashKind.transfer, cashOrBankId: cash, otherId: bank, amount: '1000', date: '2026-10-03');
      expect(c.type, 'contra');
      final lines = await books.linesOf(c.id);
      expect(lines.map((l) => (l.accountId, l.debit, l.credit)), [(bank, '1000.00', '0.00'), (cash, '0.00', '1000.00')]);
      expect((await db.select(db.outbox).get()).map((o) => o.kind), ['voucher.create', 'voucher.create', 'voucher.create']);
    });

    test('refuses the same account on both sides', () async {
      await expectLater(postCashEntry(books, kind: CashKind.transfer, cashOrBankId: cash, otherId: cash, amount: '10', date: '2026-10-01'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'same_account')));
    });
  });

  group('counting stock by scanning', () {
    Future<void> setUpItems() async {
      await db.setMeta('posStore', jsonEncode({'id': '00000000-0000-4000-8000-0000000000e1', 'name': 'Main store'}));
      await db.into(db.posItems).insert(PosItemsCompanion.insert(id: 'i1', name: 'Blue Shirt', barcode: const Value('8901234567890'), sku: const Value('BS-1'), kind: 'goods', gstRate: '5', saleRate: '1000.00', uom: 'PCS'));
      await db.into(db.posItems).insert(PosItemsCompanion.insert(id: 'i2', name: 'Delivery', kind: 'service', gstRate: '18', saleRate: '50.00', uom: 'NOS', sku: const Value('SV-1')));
    }

    test('counts what is scanned, adds repeat scans, and survives a restart of the app', () async {
      await setUpItems();
      final audit = StockAudit(db);
      await audit.start('Shelf 3');
      await audit.scan('8901234567890');
      await audit.scan('BS-1');
      await audit.scan('BS-1', qty: '3');
      final s = (await StockAudit(db).current())!;
      expect(s.store, 'Main store');
      expect(s.lines.single.qty, '5');
      expect(s.pieces, 5);
      await audit.setQty('i1', '4');
      expect((await audit.current())!.lines.single.qty, '4');
    });

    test('refuses codes it does not know, services, a second count, and starting with no store', () async {
      await setUpItems();
      final audit = StockAudit(db);
      await audit.start('Shelf 3');
      await expectLater(audit.scan('NOPE'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'unknown_code')));
      await expectLater(audit.scan('SV-1'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'not_goods')));
      await expectLater(audit.start('Again'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'audit_in_progress')));
      await audit.discard();
      expect(await audit.current(), isNull);

      final bare = LocalDb(NativeDatabase.memory());
      await expectLater(StockAudit(bare).start('x1'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'no_store')));
      await bare.close();
    });

    test('queues one stock.count for the server with just the items scanned, and clears the session', () async {
      await setUpItems();
      final audit = StockAudit(db);
      await expectLater(audit.submit(), throwsA(isA<BooksException>()));
      final s = await audit.start('Shelf 3');
      await audit.scan('BS-1', qty: '7');
      await audit.submit();
      expect(await audit.current(), isNull);
      final op = (await db.select(db.outbox).get()).single;
      expect(op.kind, 'stock.count');
      final payload = jsonDecode(op.payload) as Map<String, dynamic>;
      expect(payload, {'id': s.id, 'warehouseId': '00000000-0000-4000-8000-0000000000e1', 'name': 'Shelf 3', 'lines': [{'itemId': 'i1', 'counted': '7'}]});
    });
  });

  group('customers', () {
    Future<void> bill(String id, String phone, String name, String date, String total, List<Map<String, String>> lines) =>
        db.into(db.posBills).insert(PosBillsCompanion.insert(id: id, terminalId: 't1', number: 'POS/$id', date: date, createdAt: '${date}T10:00:00', customerPhone: Value(phone), customerName: Value(name), detail: jsonEncode({'lines': lines}), total: total));

    test('finds people by number or name and works out their history from this device', () async {
      await bill('1', '9822211100', 'Meena Rao', '2026-10-01', '1000.00', [{'name': 'Blue Shirt', 'qty': '2'}]);
      await bill('2', '9822211100', 'Meena Rao', '2026-10-05', '500.00', [{'name': 'Blue Shirt', 'qty': '1'}, {'name': 'Socks', 'qty': '3'}]);
      await bill('3', '9811122233', 'Anil', '2026-10-02', '200.00', [{'name': 'Socks', 'qty': '1'}]);
      final c = Customers(db);
      expect((await c.search('Meena')).map((x) => x.phone), ['9822211100']);
      expect((await c.search('98111')).single.name, 'Anil');
      expect(await c.search('  '), isEmpty);
      final p = await c.local('9822211100');
      expect(p, isA<CustomerProfile>().having((x) => x.visits, 'visits', 2).having((x) => x.spent, 'spent', '1500.00').having((x) => x.lastVisit, 'last', '2026-10-05'));
      expect(p.top.first, (name: 'Blue Shirt', qty: '3'));
      expect(p.recent.first.number, 'POS/2');
    });

    test('adds what the cloud knows when online, and falls back to the device when it cannot be reached', () async {
      await bill('1', '9822211100', 'Meena Rao', '2026-10-01', '1000.00', [{'name': 'Blue Shirt', 'qty': '2'}]);
      final online = ApiClient(baseUrl: 'http://x', client: MockClient((_) async => http.Response(jsonEncode({'name': 'Meena Rao', 'visits': 9, 'spent': '9000', 'points': 120, 'returned': '300.00', 'lastVisit': '2026-10-20', 'top': [{'name': 'Kurta', 'qty': 4}], 'recent': [{'number': 'X/1', 'date': '2026-10-20', 'total': '900.00'}]}), 200, headers: {'content-type': 'application/json'})));
      final p = await Customers(db).profile('9822211100', online);
      expect((p.fromCloud, p.visits, p.points, p.spent), (true, 9, 120, '9000.00'));
      final offline = ApiClient(baseUrl: 'http://x', client: MockClient((_) async => throw const SocketException('down')));
      final q = await Customers(db).profile('9822211100', offline);
      expect((q.fromCloud, q.visits), (false, 1));
    });
  });

  group('tokens and slips', () {
    test('count from 1 each day, and a slip carries the bill', () async {
      final t = Tokens(db);
      expect(await t.next('2026-10-01'), 'T001');
      expect(await t.next('2026-10-01'), 'T002');
      expect(await t.next('2026-10-02'), 'T001');
      final b = PosBill(id: '1', terminalId: 't', number: 'POS/1', date: '2026-10-01', createdAt: 'x', customerPhone: null, customerName: 'Meena', detail: jsonEncode({'lines': [{'name': 'Blue Shirt', 'qty': '2', 'rate': '500.00'}]}), total: '1000.00', change: '0.00', serverTotal: null, syncState: 'pending', syncError: null);
      expect(slipText(b, shop: 'Test Traders'), 'Test Traders\nBill POS/1   2026-10-01\nCustomer: Meena\nBlue Shirt  2 x 500.00\nTotal: Rs 1000.00');
    });

    test('is sent to the customer only with a valid mobile and a connection', () async {
      var calls = 0;
      final api = ApiClient(baseUrl: 'http://x', client: MockClient((r) async { calls++; return http.Response('{}', 200, headers: {'content-type': 'application/json'}); }));
      final t = Tokens(db);
      expect(await t.send(api, token: 'T001', phone: '12345'), isFalse);
      expect(await t.send(null, token: 'T001', phone: '9822211100'), isFalse);
      expect(calls, 0);
      expect(await t.send(api, token: 'T001', phone: '9822211100'), isTrue);
      expect(calls, 1);
    });
  });

  group('reports', () {
    test('are fetched and kept, and shown from the kept copy when the network is down', () async {
      final up = ApiClient(baseUrl: 'http://x', client: MockClient((_) async => http.Response(jsonEncode({'bills': 12, 'total': '34000.00'}), 200, headers: {'content-type': 'application/json'})));
      final reports = Reports(db);
      expect(await reports.cached('daySales'), isNull);
      final fresh = (await reports.load('daySales', up, '2026-10-01'))!;
      expect((fresh.fresh, fresh.data['bills']), (true, 12));
      final down = ApiClient(baseUrl: 'http://x', client: MockClient((_) async => throw const SocketException('down')));
      final old = (await reports.load('daySales', down, '2026-10-01'))!;
      expect((old.fresh, old.data['total']), (false, '34000.00'));
      expect(await reports.load('stockSummary', down, '2026-10-01'), isNull);
      await expectLater(() => reports.load('nope', up, '2026-10-01'), throwsArgumentError);
    });
  });

  group('receipt photos', () {
    test('go up before the claim, and the claim line carries the file id', () async {
      final dir = Directory.systemTemp.createTempSync('varchasv_photo_');
      addTearDown(() => dir.deleteSync(recursive: true));
      final photo = File('${dir.path}/bill.jpg')..writeAsBytesSync([1, 2, 3, 4]);
      final field = Field(db);
      await db.into(db.employees).insert(EmployeesCompanion.insert(id: 'e1', companyId: companyId, code: 'E1', name: 'Ravi', joinedOn: '2026-01-01', status: 'active'));
      await field.createClaim(employeeId: 'e1', title: 'Taxi to supplier', lines: [ClaimLineDraft(date: '2026-10-01', categoryId: 'c1', amount: '250', photoPath: photo.path)]);
      final seen = <String>[];
      final api = ApiClient(baseUrl: 'http://x', client: MockClient((r) async {
        seen.add('${r.method} ${r.url.path}');
        if (r.url.path == '/files') {
          final body = jsonDecode(r.body) as Map<String, dynamic>;
          expect(body['contentType'], 'image/jpeg');
          expect(base64Decode(body['base64'] as String), [1, 2, 3, 4]);
          return http.Response(jsonEncode({'id': 'file-9'}), 201, headers: {'content-type': 'application/json'});
        }
        return http.Response('{}', 200, headers: {'content-type': 'application/json'});
      }));
      final sync = SyncService(db, api);
      await sync.uploadPhotos(await db.select(db.outbox).get());
      expect(seen, ['POST /files']);
      final payload = jsonDecode((await db.select(db.outbox).getSingle()).payload) as Map<String, dynamic>;
      final line = (payload['lines'] as List).single as Map<String, dynamic>;
      expect(line['fileId'], 'file-9');
      expect(line.containsKey('photoPath'), isFalse);
      // A claim with nothing left to upload makes no more calls.
      await sync.uploadPhotos(await db.select(db.outbox).get());
      expect(seen, ['POST /files']);
    });
  });
}
