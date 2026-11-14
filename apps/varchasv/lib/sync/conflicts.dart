import 'dart:convert';

import 'package:drift/drift.dart';

import '../data/database.dart';

/// One change this device made that the server refused, with what it was and why, so a person can decide what to do about it.
class Conflict {
  const Conflict({required this.seq, required this.opId, required this.kind, required this.code, required this.subject, required this.amount, required this.date, required this.canDiscard});
  final int seq;
  final String opId;
  final String kind;

  /// The server's reason, as its code (period_locked, number_clash and so on).
  final String code;

  /// What it was: a document number, a name.
  final String subject;
  final String? amount;
  final String? date;

  /// Whether setting it aside is allowed. A counter bill has already been handed to the customer, so it can only be retried or sent to the owner.
  final bool canDiscard;
}

/// What each kind of change is called, for the screen. Unknown kinds show their own name.
String kindLabelKey(String kind) => switch (kind) {
      'voucher.create' => 'voucher',
      'voucher.cancel' => 'cancelVoucher',
      'pos.bill' => 'bill',
      'leave.request' => 'leave',
      'attendance.mark' => 'attendance',
      'expense.claim' => 'claim',
      'sales.order' => 'order',
      _ => 'other',
    };

/// Reasons the server gives that a person can fix, with the hint that goes with each. Anything else gets the general wording.
const fixableCodes = {'period_locked', 'gstr1_filed_for_period', 'unknown_account', 'unknown_item', 'session_closed', 'device_revoked', 'permission', 'forbidden'};

bool canDiscardKind(String kind) => kind != 'pos.bill';

Conflict toConflict(OutboxData o) {
  Map<String, dynamic> p;
  try {
    p = jsonDecode(o.payload) as Map<String, dynamic>;
  } catch (_) {
    p = const {};
  }
  final subject = (p['number'] ?? p['name'] ?? p['employeeId'] ?? p['id'] ?? '').toString();
  final amount = (p['total'] ?? p['amount'])?.toString();
  final date = (p['date'] ?? p['fromDate'])?.toString();
  return Conflict(seq: o.seq, opId: o.opId, kind: o.kind, code: o.error ?? 'error', subject: subject, amount: amount, date: date, canDiscard: canDiscardKind(o.kind));
}

/// Everything the server has refused, oldest first.
Future<List<Conflict>> loadConflicts(LocalDb db) async {
  final rows = await (db.select(db.outbox)..where((o) => o.state.equals('failed'))..orderBy([(o) => OrderingTerm.asc(o.seq)])).get();
  return [for (final o in rows) toConflict(o)];
}

/// Puts one refused change back in the queue to be sent again (after its cause was put right).
Future<void> retryOne(LocalDb db, int seq) async {
  final o = await (db.select(db.outbox)..where((x) => x.seq.equals(seq))).getSingleOrNull();
  if (o == null || o.state != 'failed') return;
  await db.transaction(() async {
    await (db.update(db.outbox)..where((x) => x.seq.equals(seq))).write(const OutboxCompanion(state: Value('pending'), error: Value(null)));
    await _markLocal(db, o, state: 'pending', error: null);
  });
}

/// Sets a refused change aside for good: it leaves the queue and the thing it made on this device goes with it, so the screens stop showing it.
/// Counter bills cannot be set aside (the customer has the bill); the call is refused.
Future<void> discardOne(LocalDb db, int seq) async {
  final o = await (db.select(db.outbox)..where((x) => x.seq.equals(seq))).getSingleOrNull();
  if (o == null) return;
  if (!canDiscardKind(o.kind)) throw StateError('cannot_discard');
  final p = jsonDecode(o.payload) as Map<String, dynamic>;
  await db.transaction(() async {
    switch (o.kind) {
      case 'voucher.create':
        await (db.delete(db.voucherLines)..where((l) => l.voucherId.equals(p['id'] as String))).go();
        await (db.delete(db.vouchers)..where((v) => v.id.equals(p['id'] as String))).go();
      case 'voucher.cancel':
        // The cancel never reached the books, so the voucher stands as it was.
        await (db.update(db.vouchers)..where((v) => v.id.equals(p['id'] as String))).write(const VouchersCompanion(status: Value('posted'), syncState: Value('synced'), syncError: Value(null)));
      case 'leave.request':
        await (db.delete(db.leaveRequests)..where((l) => l.id.equals(p['id'] as String))).go();
      case 'attendance.mark':
        await (db.delete(db.attendanceDays)..where((a) => a.employeeId.equals(p['employeeId'] as String) & a.date.equals(p['date'] as String))).go();
      case 'expense.claim':
        await (db.delete(db.localClaims)..where((c) => c.id.equals(p['id'] as String))).go();
      case 'sales.order':
        await (db.delete(db.fieldOrders)..where((c) => c.id.equals(p['id'] as String))).go();
    }
    await (db.delete(db.outbox)..where((x) => x.seq.equals(seq))).go();
  });
}

Future<void> _markLocal(LocalDb db, OutboxData o, {required String state, required String? error}) async {
  final p = jsonDecode(o.payload) as Map<String, dynamic>;
  switch (o.kind) {
    case 'voucher.create' || 'voucher.cancel':
      await (db.update(db.vouchers)..where((v) => v.id.equals(p['id'] as String))).write(VouchersCompanion(syncState: Value(state), syncError: Value(error)));
    case 'leave.request':
      await (db.update(db.leaveRequests)..where((l) => l.id.equals(p['id'] as String))).write(LeaveRequestsCompanion(syncState: Value(state), syncError: Value(error)));
    case 'expense.claim':
      await (db.update(db.localClaims)..where((c) => c.id.equals(p['id'] as String))).write(LocalClaimsCompanion(syncState: Value(state), syncError: Value(error)));
    case 'sales.order':
      await (db.update(db.fieldOrders)..where((c) => c.id.equals(p['id'] as String))).write(FieldOrdersCompanion(syncState: Value(state), syncError: Value(error)));
  }
}
