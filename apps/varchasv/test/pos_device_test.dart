import 'dart:convert';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/data/books.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/pos.dart';
import 'package:varchasv/domain/domain.dart';
import 'package:varchasv/sync/sync_service.dart';

const dosa = '00000000-0000-4000-8000-0000000000d1';
const cola = '00000000-0000-4000-8000-0000000000d2';
const counter = '00000000-0000-4000-8000-0000000000a2';
final day = DateTime(2026, 10, 5, 13, 30);

Map<String, dynamic> pull({String? lastNumber, List<Map<String, dynamic>>? terminals}) => {
      'cursor': '300',
      'companies': [{'id': 'c1', 'name': 'Udupi Cafe', 'booksBeginOn': '2026-04-01'}],
      'fiscalYears': [{'id': 'fy1', 'companyId': 'c1', 'label': '2026-27', 'startsOn': '2026-04-01', 'endsOn': '2027-03-31', 'lockedUpTo': null, 'closed': false}],
      'items': [
        {'id': dosa, 'name': 'Masala dosa', 'nameHi': 'मसाला डोसा', 'sku': 'MD', 'barcode': null, 'kind': 'goods', 'hsn': '996331', 'gstRate': '5.00', 'cessRate': '0.00', 'saleRate': '110.0000', 'uom': 'PCS', 'archived': false},
        {'id': cola, 'name': 'Cola 300ml', 'nameHi': null, 'sku': null, 'barcode': '8901234567890', 'kind': 'goods', 'hsn': '2202', 'gstRate': '18.00', 'cessRate': '0.00', 'saleRate': '40.0000', 'uom': 'PCS', 'archived': false},
      ],
      'posTerminals': terminals ?? [{'id': counter, 'code': 'T2', 'name': 'Tablet counter', 'archived': false, 'lastNumber': lastNumber}],
      'posSettings': {'pricesIncludeTax': true, 'loyaltyEnabled': true, 'receiptFooter': 'Pure veg'},
    };

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late LocalDb db;
  late Pos pos;
  setUp(() async {
    db = LocalDb(NativeDatabase.memory());
    pos = Pos(db);
    await applyPull(db, pull(lastNumber: 'T2/26-27/00004'));
  });
  tearDown(() => db.close());

  test('bills offline at menu prices, numbered after the last bill the cloud has, and queues it', () async {
    final items = {for (final i in await pos.items()) i.id: i};
    expect((await pos.byCode('8901234567890'))?.id, cola);
    final bill = await pos.createBill(
      terminalId: counter, now: day, customerPhone: '9876543210',
      cart: [CartItem(items[dosa]!, '2'), CartItem(items[cola]!)], payments: const [PosPayment('cash', '300')],
    );
    // Same figures as the server (apps/api/test/pos.test.ts): dosa 220 + cola 40, GST inside the price.
    expect(bill.number, 'T2/26-27/00005');
    expect(bill.total, '260.00');
    expect(bill.change, '40.00');
    expect(bill.syncState, 'pending');
    final detail = jsonDecode(bill.detail) as Map<String, dynamic>;
    expect([detail['taxable'], detail['cgst'], detail['sgst']], ['243.42', '8.29', '8.29']);
    final op = (await db.select(db.outbox).get()).single;
    expect(op.kind, 'pos.bill');
    final sent = jsonDecode(op.payload) as Map<String, dynamic>;
    // The device stamps the moment it billed the customer; the server uses it for the busy-hours chart.
    expect(DateTime.parse(sent.remove('billedAt') as String).isUtc, isTrue);
    expect(sent, {
      'id': bill.id, 'terminalId': counter, 'number': 'T2/26-27/00005', 'date': '2026-10-05', 'total': '260.00',
      'lines': [{'itemId': dosa, 'qty': '2', 'price': '110.00'}, {'itemId': cola, 'qty': '1', 'price': '40.00'}],
      'customerPhone': '9876543210', 'payments': [{'mode': 'cash', 'amount': '300'}],
    });
    final next = await pos.createBill(terminalId: counter, now: day, cart: [CartItem(items[cola]!)], payments: const [PosPayment('upi', '40', reference: 'UPI9')]);
    expect(next.number, 'T2/26-27/00006');
  });

  test('refuses what the counter cannot settle offline', () async {
    final cola1 = [CartItem((await pos.byCode('8901234567890'))!)];
    Future<void> expectCode(Future<void> f, String code) => expectLater(f, throwsA(isA<BooksException>().having((e) => e.code, 'code', code)));
    await expectCode(pos.createBill(terminalId: counter, now: day, cart: cola1, payments: const [PosPayment('card', '50')]), 'overpaid_non_cash');
    await expectCode(pos.createBill(terminalId: counter, now: day, cart: cola1, payments: const [PosPayment('cash', '30')]), 'underpaid');
    await expectCode(pos.createBill(terminalId: counter, now: day, cart: cola1, payments: const [PosPayment('credit', '40')]), 'customer_required_for_credit');
    await expectCode(pos.createBill(terminalId: counter, now: day, cart: cola1, customerPhone: '12345', payments: const [PosPayment('cash', '40')]), 'invalid_phone');
    await expectCode(pos.createBill(terminalId: counter, now: DateTime(2027, 5, 1), cart: cola1, payments: const [PosPayment('cash', '40')]), 'no_fiscal_year');
    expect(await db.select(db.outbox).get(), isEmpty);
  });

  test('after upload the bill is marked, with the server total when it differed; unlinked counters go', () async {
    final bill = await pos.createBill(terminalId: counter, now: day, cart: [CartItem((await pos.byCode('8901234567890'))!)], payments: const [PosPayment('cash', '40')]);
    final payload = jsonDecode((await db.select(db.outbox).get()).single.payload) as Map<String, dynamic>;
    await settlePosOp(db, 'pos.bill', payload, result: {'id': bill.id, 'mismatch': {'deviceTotal': '40.00', 'serverTotal': '42.00'}});
    final row = await (db.select(db.posBills)..where((b) => b.id.equals(bill.id))).getSingle();
    expect([row.syncState, row.serverTotal], ['synced', '42.00']);
    await applyPull(db, pull(terminals: const []));
    expect(await pos.terminals(), isEmpty);
    expect((await pos.settings()).receiptFooter, 'Pure veg');
  });

  test('the cloud moving a counter further ahead (e.g. a reinstall) moves the device series too', () async {
    await applyPull(db, pull(lastNumber: 'T2/26-27/00010'));
    final bill = await pos.createBill(terminalId: counter, now: day, cart: [CartItem((await pos.byCode('MD'))!)], payments: const [PosPayment('cash', '110')]);
    expect(bill.number, 'T2/26-27/00011');
    expect(checkGstDocumentNumber(bill.number), isNull);
  });
}
