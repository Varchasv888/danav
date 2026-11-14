import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import 'books.dart';
import 'database.dart';

/// HR on the device: attendance and leave requests are written locally and queued for the cloud
/// in one transaction (the server applies the same checks when they arrive); employees, leave types
/// and final payslips come down with each sync.
class Hr {
  Hr(this.db);
  final LocalDb db;
  final _uuid = const Uuid();

  Future<void> _enqueue(String kind, Map<String, dynamic> payload) =>
      db.into(db.outbox).insert(OutboxCompanion.insert(opId: _uuid.v4(), kind: kind, payload: jsonEncode(payload)));

  Stream<List<Employee>> watchEmployees({bool activeOnly = false}) {
    final q = db.select(db.employees)..orderBy([(e) => OrderingTerm.asc(e.code)]);
    if (activeOnly) q.where((e) => e.status.equals('active'));
    return q.watch();
  }

  Stream<List<AttendanceDay>> watchDay(String date) => (db.select(db.attendanceDays)..where((a) => a.date.equals(date))).watch();

  bool _employedOn(Employee e, String date) => date.compareTo(e.joinedOn) >= 0 && (e.leftOn == null || date.compareTo(e.leftOn!) <= 0);

  /// Present clears the day (no row = present); absent and half day are stored.
  Future<void> mark(String employeeId, String date, String status) => db.transaction(() async {
        final e = await (db.select(db.employees)..where((x) => x.id.equals(employeeId))).getSingleOrNull();
        if (e == null) throw BooksException('unknown_employee');
        if (!_employedOn(e, date)) throw BooksException('not_employed_on_date');
        final existing = await (db.select(db.attendanceDays)..where((a) => a.employeeId.equals(employeeId) & a.date.equals(date))).getSingleOrNull();
        if (existing?.status == 'leave') throw BooksException('day_on_leave');
        if (status == 'present') {
          await (db.delete(db.attendanceDays)..where((a) => a.employeeId.equals(employeeId) & a.date.equals(date))).go();
        } else {
          await db.into(db.attendanceDays).insertOnConflictUpdate(
              AttendanceDaysCompanion.insert(employeeId: employeeId, date: date, status: status, syncState: const Value('pending'), syncError: const Value(null)));
        }
        await _enqueue('attendance.mark', {'employeeId': employeeId, 'date': date, 'status': status});
      });

  Future<List<LeaveType>> leaveTypes() => (db.select(db.leaveTypes)..where((l) => l.archived.equals(false))..orderBy([(l) => OrderingTerm.asc(l.code)])).get();

  Stream<List<LeaveRequest>> watchLeave() => (db.select(db.leaveRequests)..orderBy([(l) => OrderingTerm.desc(l.fromDate)])).watch();

  Future<void> requestLeave({required String employeeId, required String leaveTypeId, required String from, required String to, bool halfDay = false, String? reason}) async {
    if (to.compareTo(from) < 0) throw BooksException('to_before_from');
    if (halfDay && to != from) throw BooksException('half_day_single_date');
    final id = _uuid.v4();
    await db.transaction(() async {
      await db.into(db.leaveRequests).insert(LeaveRequestsCompanion.insert(
            id: id, employeeId: employeeId, leaveTypeId: leaveTypeId, fromDate: from, toDate: halfDay ? from : to,
            halfDay: Value(halfDay), reason: Value(reason), syncState: const Value('pending'),
          ));
      await _enqueue('leave.request', {
        'id': id, 'employeeId': employeeId, 'leaveTypeId': leaveTypeId, 'fromDate': from, 'toDate': halfDay ? from : to, 'halfDay': halfDay, 'reason': reason,
      });
    });
  }

  Future<List<Payslip>> payslipsOf(String employeeId) =>
      (db.select(db.payslips)..where((p) => p.employeeId.equals(employeeId))..orderBy([(p) => OrderingTerm.desc(p.period)])).get();
}

/// After a push: an accepted or refused HR op updates the local row it came from.
Future<void> settleHrOp(LocalDb db, String kind, Map<String, dynamic> payload, {String? error}) async {
  final state = error == null ? 'synced' : 'failed';
  if (kind == 'attendance.mark') {
    await (db.update(db.attendanceDays)..where((a) => a.employeeId.equals(payload['employeeId'] as String) & a.date.equals(payload['date'] as String)))
        .write(AttendanceDaysCompanion(syncState: Value(state), syncError: Value(error)));
  } else if (kind == 'leave.request') {
    await (db.update(db.leaveRequests)..where((l) => l.id.equals(payload['id'] as String)))
        .write(LeaveRequestsCompanion(syncState: Value(state), syncError: Value(error)));
  }
}

/// Stores the HR part of a pull. Rows this device still has queued are left alone.
Future<void> applyHrPull(LocalDb db, Map<String, dynamic> data) async {
  List<Map<String, dynamic>> list(String k) => ((data[k] as List?) ?? const []).cast<Map<String, dynamic>>();
  final queued = [for (final o in await db.select(db.outbox).get()) (o.kind, jsonDecode(o.payload) as Map<String, dynamic>)];
  final queuedLeave = {for (final q in queued) if (q.$1 == 'leave.request') q.$2['id'] as String};
  final queuedDays = {for (final q in queued) if (q.$1 == 'attendance.mark') '${q.$2['employeeId']}|${q.$2['date']}'};

  for (final e in list('employees')) {
    await db.into(db.employees).insertOnConflictUpdate(EmployeesCompanion.insert(
          id: e['id'], companyId: e['companyId'], code: e['code'], name: e['name'], nameHi: Value(e['nameHi'] as String?),
          designation: Value(e['designation'] as String?), department: Value(e['department'] as String?), joinedOn: e['joinedOn'],
          leftOn: Value(e['leftOn'] as String?), status: e['status'], phone: Value(e['phone'] as String?),
        ));
  }
  for (final l in list('leaveTypes')) {
    await db.into(db.leaveTypes).insertOnConflictUpdate(LeaveTypesCompanion.insert(
          id: l['id'], code: l['code'], name: l['name'], nameHi: Value(l['nameHi'] as String?), paid: Value(l['paid'] as bool? ?? true), archived: Value(l['archived'] as bool? ?? false),
        ));
  }
  for (final r in list('leaveRequests')) {
    if (queuedLeave.contains(r['id'])) continue;
    await db.into(db.leaveRequests).insertOnConflictUpdate(LeaveRequestsCompanion.insert(
          id: r['id'], employeeId: r['employeeId'], leaveTypeId: r['leaveTypeId'], fromDate: r['fromDate'], toDate: r['toDate'],
          halfDay: Value(r['halfDay'] as bool? ?? false), days: Value(r['days'] as String?), reason: Value(r['reason'] as String?),
          status: Value(r['status'] as String), syncState: const Value('synced'), syncError: const Value(null),
        ));
  }
  final window = data['attendanceWindow'] as Map<String, dynamic>?;
  if (window != null) {
    final from = window['from'] as String;
    for (final employeeId in (window['employeeIds'] as List).cast<String>()) {
      // Replace this employee's recent days with the server's, keeping days still waiting to upload.
      final local = await (db.select(db.attendanceDays)..where((a) => a.employeeId.equals(employeeId) & a.date.isBiggerOrEqualValue(from))).get();
      for (final a in local) {
        if (queuedDays.contains('$employeeId|${a.date}')) continue;
        await (db.delete(db.attendanceDays)..where((x) => x.employeeId.equals(employeeId) & x.date.equals(a.date))).go();
      }
    }
    for (final a in list('attendance')) {
      if (queuedDays.contains('${a['employeeId']}|${a['date']}')) continue;
      await db.into(db.attendanceDays).insertOnConflictUpdate(AttendanceDaysCompanion.insert(
            employeeId: a['employeeId'], date: a['date'], status: a['status'], leaveCode: Value(a['leaveCode'] as String?),
            inTime: Value(a['inTime'] as String?), outTime: Value(a['outTime'] as String?), late: Value(a['late'] as bool? ?? false),
          ));
    }
  }
  for (final runId in ((data['removedRuns'] as List?) ?? const []).cast<String>()) {
    await (db.delete(db.payslips)..where((p) => p.runId.equals(runId))).go();
  }
  for (final p in list('payslips')) {
    await db.into(db.payslips).insertOnConflictUpdate(PayslipsCompanion.insert(
          id: p['id'], runId: p['runId'], period: p['period'], employeeId: p['employeeId'], paidDays: p['paidDays'].toString(),
          gross: p['gross'].toString(), totalDeductions: p['totalDeductions'].toString(), netPay: p['netPay'].toString(), tds: p['tds'].toString(),
          detail: jsonEncode(p['detail']),
        ));
  }
}
