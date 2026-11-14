import 'dart:convert';

import 'package:drift/drift.dart' show Value;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/sync/conflicts.dart';

void main() {
  late LocalDb db;
  setUp(() => db = LocalDb(NativeDatabase.memory()));
  tearDown(() => db.close());

  Future<void> queue(String kind, Map<String, dynamic> payload, {String state = 'failed', String? error = 'period_locked'}) =>
      db.into(db.outbox).insert(OutboxCompanion.insert(opId: 'op-$kind-${payload['id']}', kind: kind, payload: jsonEncode(payload), state: Value(state), error: Value(error)));

  Future<void> voucher(String id) async {
    await db.into(db.vouchers).insert(VouchersCompanion.insert(id: id, companyId: 'c1', type: 'journal', number: 'J-$id', date: '2026-10-01', total: '100.00', syncState: const Value('failed')));
    await db.into(db.voucherLines).insert(VoucherLinesCompanion.insert(voucherId: id, lineNo: 1, accountId: 'a1', debit: const Value('100.00')));
  }

  test('lists only what the server refused, with what it was and why', () async {
    await voucher('v1');
    await queue('voucher.create', {'id': 'v1', 'number': 'J-v1', 'date': '2026-10-01', 'total': '100.00'});
    await queue('voucher.create', {'id': 'v2', 'number': 'J-v2'}, state: 'pending', error: null);
    await queue('pos.bill', {'id': 'b1', 'number': 'POS/1', 'total': '500.00', 'date': '2026-10-02'}, error: 'session_closed');
    final list = await loadConflicts(db);
    expect(list.map((c) => c.kind), ['voucher.create', 'pos.bill']);
    expect(list[0], isA<Conflict>().having((c) => c.code, 'code', 'period_locked').having((c) => c.subject, 'subject', 'J-v1').having((c) => c.canDiscard, 'canDiscard', true));
    expect(list[1].amount, '500.00');
    expect(list[1].canDiscard, isFalse);
  });

  test('trying again puts the change back in the queue and clears the mark on what it made', () async {
    await voucher('v1');
    await queue('voucher.create', {'id': 'v1'});
    final seq = (await loadConflicts(db)).single.seq;
    await retryOne(db, seq);
    final o = await db.select(db.outbox).getSingle();
    expect(o.state, 'pending');
    expect(o.error, isNull);
    expect((await db.select(db.vouchers).getSingle()).syncState, 'pending');
    expect(await loadConflicts(db), isEmpty);
  });

  test('setting a change aside removes it and the voucher it made, and a cancel that was refused leaves the voucher standing', () async {
    await voucher('v1');
    await queue('voucher.create', {'id': 'v1'});
    await discardOne(db, (await loadConflicts(db)).single.seq);
    expect(await db.select(db.outbox).get(), isEmpty);
    expect(await db.select(db.vouchers).get(), isEmpty);
    expect(await db.select(db.voucherLines).get(), isEmpty);

    await db.into(db.vouchers).insert(VouchersCompanion.insert(id: 'v9', companyId: 'c1', type: 'journal', number: 'J-9', date: '2026-10-01', total: '10.00', status: const Value('cancelled'), syncState: const Value('failed')));
    await queue('voucher.cancel', {'id': 'v9', 'reason': 'typo'});
    await discardOne(db, (await loadConflicts(db)).single.seq);
    final v = await db.select(db.vouchers).getSingle();
    expect(v.status, 'posted');
    expect(v.syncState, 'synced');
  });

  test('a counter bill cannot be set aside: the customer already has it', () async {
    await queue('pos.bill', {'id': 'b1', 'number': 'POS/1', 'total': '500.00'});
    final seq = (await loadConflicts(db)).single.seq;
    await expectLater(discardOne(db, seq), throwsStateError);
    expect(await db.select(db.outbox).get(), hasLength(1));
  });
}
