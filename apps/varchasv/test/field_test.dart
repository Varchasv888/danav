import 'dart:convert';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/data/books.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/field.dart';
import 'package:varchasv/sync/sync_service.dart';

const emp = '00000000-0000-4000-8000-0000000000e1';
const hotel = '00000000-0000-4000-8000-0000000000c1';
const debtors = '00000000-0000-4000-8000-0000000000g1';
const customer = '00000000-0000-4000-8000-0000000000a1';
const rice = '00000000-0000-4000-8000-0000000000i1';

Map<String, dynamic> pull({bool withCategories = true}) => {
      'cursor': '10',
      'companies': [{'id': 'c1', 'name': 'Shree Traders', 'booksBeginOn': '2026-04-01'}],
      'accountGroups': [{'id': debtors, 'companyId': 'c1', 'parentId': null, 'key': 'sundry_debtors', 'name': 'Sundry Debtors', 'nameHi': null, 'nature': 'asset'}],
      'accounts': [{'id': customer, 'companyId': 'c1', 'groupId': debtors, 'key': null, 'name': 'Gupta Stores', 'nameHi': null, 'openingBalance': '0', 'archived': false, 'system': false}],
      'employees': [{'id': emp, 'companyId': 'c1', 'code': 'E0001', 'name': 'Meera Patil', 'nameHi': null, 'designation': null, 'department': null, 'joinedOn': '2026-04-01', 'leftOn': null, 'status': 'active', 'phone': null}],
      'items': [{'id': rice, 'name': 'Basmati rice', 'nameHi': null, 'sku': null, 'barcode': null, 'kind': 'goods', 'hsn': '1006', 'gstRate': '5.00', 'cessRate': '0', 'saleRate': '100.0000', 'uom': 'KGS', 'archived': false}],
      if (withCategories) 'expenseCategories': [{'id': hotel, 'name': 'Hotel stay', 'nameHi': null, 'blockedCredit': false, 'archived': false}],
    };

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late LocalDb db;
  late Field field;
  setUp(() async {
    db = LocalDb(NativeDatabase.memory());
    field = Field(db);
    await applyPull(db, pull());
  });
  tearDown(() => db.close());

  test('a claim made offline is kept and queued for approval upload', () async {
    expect((await field.categories()).single.name, 'Hotel stay');
    expect((await field.claimants()).single.code, 'E0001');
    final c = await field.createClaim(employeeId: emp, title: 'Client visit', date: '2026-10-08', lines: [
      ClaimLineDraft(date: '2026-10-08', categoryId: hotel, amount: '5600', gstRate: '12', vendorName: 'Hotel Panchavati', vendorGstin: '27aapfu0939f1zv', invoiceNo: 'HP/1123'),
    ]);
    expect([c.total, c.syncState], ['5600.00', 'pending']);
    final op = (await db.select(db.outbox).get()).single;
    expect(op.kind, 'expense.claim');
    expect(jsonDecode(op.payload), {
      'id': c.id, 'employeeId': emp, 'date': '2026-10-08', 'title': 'Client visit',
      'lines': [{'date': '2026-10-08', 'categoryId': hotel, 'amount': '5600.00', 'gstRate': '12', 'vendorName': 'Hotel Panchavati', 'vendorGstin': '27AAPFU0939F1ZV', 'invoiceNo': 'HP/1123'}],
    });
    expect(() => field.createClaim(employeeId: emp, title: 'x', lines: []), throwsA(isA<BooksException>()));
    expect(() => field.createClaim(employeeId: emp, title: 'Lunch', lines: [ClaimLineDraft(date: '2026-10-08', categoryId: hotel, amount: '100', vendorGstin: 'BADGSTIN')]),
        throwsA(isA<BooksException>().having((e) => e.code, 'code', 'invalid_gstin')));
  });

  test('an order taken in the field gets its number when it uploads', () async {
    final customers = await field.customers();
    expect(customers.single.name, 'Gupta Stores');
    final item = (await field.items()).single;
    final lines = [OrderLineDraft(item, '3', '100')];
    expect(field.estimate(lines), '315.00'); // 300 + 5% GST
    final o = await field.createOrder(customerId: customer, lines: lines, date: '2026-10-09');
    final payload = jsonDecode((await db.select(db.outbox).get()).single.payload) as Map<String, dynamic>;
    expect(payload, {'id': o.id, 'customerId': customer, 'date': '2026-10-09', 'lines': [{'itemId': rice, 'qty': '3', 'rate': '100.00'}]});
    await settleFieldOp(db, 'sales.order', payload, result: {'id': o.id, 'number': 'SO/26-27/00007', 'total': '315.00'});
    final after = await (db.select(db.fieldOrders)..where((x) => x.id.equals(o.id))).getSingle();
    expect([after.syncState, after.serverNumber, after.serverTotal], ['synced', 'SO/26-27/00007', '315.00']);
    expect(() => field.createOrder(customerId: customer, lines: [OrderLineDraft(item, '0', '100')]), throwsA(isA<BooksException>()));
  });

  test('categories removed in the cloud disappear from the device', () async {
    await applyPull(db, {...pull(withCategories: false), 'expenseCategories': <Map<String, dynamic>>[]});
    expect(await field.categories(), isEmpty);
  });
}
