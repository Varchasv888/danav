import 'dart:convert';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/data/books.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/hr.dart';
import 'package:varchasv/sync/sync_service.dart';

const emp = '00000000-0000-4000-8000-0000000000e1';
const cl = '00000000-0000-4000-8000-0000000000f1';

Map<String, dynamic> pull({List<Map<String, dynamic>> attendance = const [], List<Map<String, dynamic>> payslips = const [], List<String> removedRuns = const []}) => {
      'cursor': '200',
      'employees': [
        {'id': emp, 'companyId': 'c1', 'code': 'E0001', 'name': 'Meera Patil', 'nameHi': 'मीरा पाटिल', 'designation': 'Cashier', 'department': null,
          'joinedOn': '2026-04-01', 'leftOn': null, 'status': 'active', 'phone': null},
      ],
      'leaveTypes': [{'id': cl, 'code': 'CL', 'name': 'Casual leave', 'nameHi': null, 'paid': true, 'archived': false}],
      'leaveRequests': const [],
      'attendance': attendance,
      'attendanceWindow': {'from': '2026-08-01', 'employeeIds': [emp]},
      'payslips': payslips,
      'removedRuns': removedRuns,
    };

void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  late LocalDb db;
  late Hr hr;
  setUp(() async {
    db = LocalDb(NativeDatabase.memory());
    hr = Hr(db);
    await applyPull(db, pull(attendance: [
      {'employeeId': emp, 'date': '2026-09-14', 'status': 'leave', 'leaveCode': 'CL', 'inTime': null, 'outTime': null, 'late': false},
      {'employeeId': emp, 'date': '2026-09-22', 'status': 'absent', 'leaveCode': null, 'inTime': null, 'outTime': null, 'late': false},
    ]));
  });
  tearDown(() => db.close());

  test('marks attendance offline and queues it', () async {
    await hr.mark(emp, '2026-09-23', 'half_day');
    final day = await (db.select(db.attendanceDays)..where((a) => a.date.equals('2026-09-23'))).getSingle();
    expect(day.status, 'half_day');
    expect(day.syncState, 'pending');
    final ops = await db.select(db.outbox).get();
    expect(ops.single.kind, 'attendance.mark');
    expect(jsonDecode(ops.single.payload), {'employeeId': emp, 'date': '2026-09-23', 'status': 'half_day'});
  });

  test('present clears the day; leave days and dates before joining are refused', () async {
    await hr.mark(emp, '2026-09-22', 'present');
    expect(await (db.select(db.attendanceDays)..where((a) => a.date.equals('2026-09-22'))).getSingleOrNull(), isNull);
    expect(() => hr.mark(emp, '2026-09-14', 'absent'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'day_on_leave')));
    expect(() => hr.mark(emp, '2026-03-31', 'absent'), throwsA(isA<BooksException>().having((e) => e.code, 'code', 'not_employed_on_date')));
  });

  test('a pull replaces recent days but keeps ones still waiting to upload', () async {
    await hr.mark(emp, '2026-09-25', 'absent');
    // The server no longer has the 22nd (someone set it back to present) and hasn't seen the 25th yet.
    await applyPull(db, pull(attendance: [
      {'employeeId': emp, 'date': '2026-09-14', 'status': 'leave', 'leaveCode': 'CL', 'inTime': null, 'outTime': null, 'late': false},
    ]));
    final days = {for (final d in await db.select(db.attendanceDays).get()) d.date: d.status};
    expect(days, {'2026-09-14': 'leave', '2026-09-25': 'absent'});
  });

  test('leave requested offline is marked synced or refused after the push', () async {
    await hr.requestLeave(employeeId: emp, leaveTypeId: cl, from: '2026-10-05', to: '2026-10-06', reason: 'Wedding');
    final op = (await db.select(db.outbox).get()).single;
    final payload = jsonDecode(op.payload) as Map<String, dynamic>;
    await settleHrOp(db, op.kind, payload, error: 'insufficient_leave_balance');
    final r = await db.select(db.leaveRequests).getSingle();
    expect((r.syncState, r.syncError), ('failed', 'insufficient_leave_balance'));
    expect(() => hr.requestLeave(employeeId: emp, leaveTypeId: cl, from: '2026-10-06', to: '2026-10-05'), throwsA(isA<BooksException>()));
  });

  test('payslips of a cancelled run are removed', () async {
    final slip = {'id': 'p1', 'runId': 'r1', 'period': '2026-09', 'employeeId': emp, 'paidDays': '30.0', 'gross': '16000.00', 'totalDeductions': '1440.00',
      'netPay': '14560.00', 'tds': '0.00', 'detail': {'earnings': const []}};
    await applyPull(db, pull(payslips: [slip]));
    expect((await hr.payslipsOf(emp)).single.netPay, '14560.00');
    await applyPull(db, pull(removedRuns: ['r1']));
    expect(await hr.payslipsOf(emp), isEmpty);
  });
}
