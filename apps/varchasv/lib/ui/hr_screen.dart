import 'dart:convert';

import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../data/database.dart';
import '../domain/domain.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';

String _iso(DateTime d) => '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

/// HR on the device: mark today's attendance, see employees and their payslips, and request leave.
/// Everything works offline and syncs when the device is online.
class HrScreen extends StatelessWidget {
  const HrScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    return DefaultTabController(
      length: 3,
      child: Column(children: [
        TabBar(tabs: [Tab(text: t.hrAttendanceTitle), Tab(text: t.navEmployees), Tab(text: t.hrLeaveTitle)]),
        const Expanded(child: TabBarView(children: [_AttendanceTab(), _EmployeesTab(), _LeaveTab()])),
      ]),
    );
  }
}

class _AttendanceTab extends StatefulWidget {
  const _AttendanceTab();
  @override
  State<_AttendanceTab> createState() => _AttendanceTabState();
}

class _AttendanceTabState extends State<_AttendanceTab> {
  DateTime _day = DateTime.now();

  Future<void> _mark(String employeeId, String status) async {
    final app = AppScope.of(context);
    final t = AppLocalizations.of(context);
    try {
      await app.hr.mark(employeeId, _iso(_day), status);
      app.sync?.syncNow();
    } on BooksException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(t, e.code))));
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    final date = _iso(_day);
    final label = MaterialLocalizations.of(context).formatFullDate(_day);
    return Column(children: [
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Row(children: [
          IconButton(tooltip: t.appPreviousDay, icon: const Icon(Icons.chevron_left), onPressed: () => setState(() => _day = _day.subtract(const Duration(days: 1)))),
          Expanded(
            child: TextButton(
              onPressed: () async {
                final picked = await showDatePicker(context: context, initialDate: _day, firstDate: DateTime(2020), lastDate: DateTime.now().add(const Duration(days: 60)));
                if (picked != null) setState(() => _day = picked);
              },
              child: Text(label, textAlign: TextAlign.center),
            ),
          ),
          IconButton(tooltip: t.appNextDay, icon: const Icon(Icons.chevron_right), onPressed: () => setState(() => _day = _day.add(const Duration(days: 1)))),
          TextButton(onPressed: () => setState(() => _day = DateTime.now()), child: Text(t.appToday)),
        ]),
      ),
      const Divider(height: 1),
      Expanded(
        child: StreamBuilder<List<Employee>>(
          stream: app.hr.watchEmployees(activeOnly: true),
          builder: (context, emps) => StreamBuilder<List<AttendanceDay>>(
            stream: app.hr.watchDay(date),
            builder: (context, days) {
              final marks = {for (final d in days.data ?? const <AttendanceDay>[]) d.employeeId: d};
              final list = (emps.data ?? const <Employee>[]).where((e) => date.compareTo(e.joinedOn) >= 0 && (e.leftOn == null || date.compareTo(e.leftOn!) <= 0)).toList();
              if (list.isEmpty) return Center(child: Text(t.hrAttendanceNoEmployees));
              return ListView.separated(
                padding: const EdgeInsets.only(bottom: 24),
                itemCount: list.length,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, i) {
                  final e = list[i];
                  final m = marks[e.id];
                  final onLeave = m?.status == 'leave';
                  final status = m == null || m.status == 'present' ? 'present' : m.status;
                  return ListTile(
                    title: Text(localName(context, e.name, e.nameHi)),
                    subtitle: Text([
                      e.code,
                      if (m?.inTime != null) '${m!.inTime}–${m.outTime ?? ''}',
                      if (m?.late ?? false) t.hrAttendanceLegendLate,
                      if (m?.syncState == 'pending') t.appNotSyncedYet,
                      if (m?.syncState == 'failed') errorText(t, m!.syncError ?? ''),
                    ].join(' · ')),
                    trailing: onLeave
                        ? Chip(label: Text('${t.hrAttendanceLegendLeave} ${m?.leaveCode ?? ''}'))
                        : SegmentedButton<String>(
                            showSelectedIcon: false,
                            segments: [
                              ButtonSegment(value: 'present', label: Text(t.hrAttendanceLegendPresent), tooltip: t.hrAttendanceLegendPresent),
                              ButtonSegment(value: 'half_day', label: const Text('½'), tooltip: t.hrAttendanceLegendHalfDay),
                              ButtonSegment(value: 'absent', label: Text(t.hrAttendanceLegendAbsent), tooltip: t.hrAttendanceLegendAbsent),
                            ],
                            selected: {status},
                            onSelectionChanged: (s) => _mark(e.id, s.first),
                          ),
                  );
                },
              );
            },
          ),
        ),
      ),
    ]);
  }
}

class _EmployeesTab extends StatelessWidget {
  const _EmployeesTab();

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return StreamBuilder<List<Employee>>(
      stream: app.hr.watchEmployees(),
      builder: (context, snap) {
        final list = snap.data ?? const <Employee>[];
        if (list.isEmpty) return Center(child: Text(t.hrEmployeesNone));
        return ListView.separated(
          itemCount: list.length,
          separatorBuilder: (_, _) => const Divider(height: 1),
          itemBuilder: (context, i) {
            final e = list[i];
            return ListTile(
              leading: CircleAvatar(child: Text(e.name.characters.first.toUpperCase())),
              title: Text(localName(context, e.name, e.nameHi)),
              subtitle: Text([e.code, e.designation, e.status == 'left' ? t.hrStatusesLeft : null].whereType<String>().join(' · ')),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _PayslipsPage(employee: e))),
            );
          },
        );
      },
    );
  }
}

class _PayslipsPage extends StatelessWidget {
  const _PayslipsPage({required this.employee});
  final Employee employee;

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return Scaffold(
      appBar: AppBar(title: Text('${localName(context, employee.name, employee.nameHi)} · ${t.hrPayslips}')),
      body: FutureBuilder<List<Payslip>>(
        future: app.hr.payslipsOf(employee.id),
        builder: (context, snap) {
          final slips = snap.data ?? const <Payslip>[];
          if (slips.isEmpty) return Center(child: Text(t.commonNone));
          return ListView.separated(
            itemCount: slips.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, i) {
              final p = slips[i];
              return ListTile(
                title: Text(_monthLabel(context, p.period)),
                subtitle: Text('${t.payrollColsGross} ${rupees(p.gross)} · ${t.payrollColsTds} ${rupees(p.tds)}'),
                trailing: Text(rupees(p.netPay), style: const TextStyle(fontWeight: FontWeight.bold)),
                onTap: () => showModalBottomSheet<void>(context: context, isScrollControlled: true, builder: (_) => _PayslipSheet(slip: p)),
              );
            },
          );
        },
      ),
    );
  }
}

String _monthLabel(BuildContext context, String period) =>
    MaterialLocalizations.of(context).formatMonthYear(DateTime(int.parse(period.substring(0, 4)), int.parse(period.substring(5, 7))));

class _PayslipSheet extends StatelessWidget {
  const _PayslipSheet({required this.slip});
  final Payslip slip;

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final d = jsonDecode(slip.detail) as Map<String, dynamic>;
    final earnings = (d['earnings'] as List).cast<Map<String, dynamic>>();
    final pf = d['pf'] as Map<String, dynamic>;
    final esi = d['esi'] as Map<String, dynamic>;
    final lwf = d['lwf'] as Map<String, dynamic>;
    final others = ((d['otherDeductions'] as List?) ?? const []).cast<Map<String, dynamic>>();
    final deductions = [
      (t.payrollSlipPfEmployee, pf['employee'] as String),
      (t.payrollSlipEsiEmployee, esi['employee'] as String),
      (t.payrollSlipPt, d['pt'] as String),
      (t.payrollSlipLwf, lwf['employee'] as String),
      (t.payrollSlipTds, d['tds'] as String),
      for (final o in others) (o['name'] as String, o['amount'] as String),
    ].where((x) => dec(x.$2) != zero);
    Widget line(String label, String amount, {bool bold = false}) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 3),
          child: Row(children: [
            Expanded(child: Text(label, style: bold ? const TextStyle(fontWeight: FontWeight.bold) : null)),
            Text(rupees(amount), style: TextStyle(fontFeatures: const [FontFeature.tabularFigures()], fontWeight: bold ? FontWeight.bold : null)),
          ]),
        );
    final text = Theme.of(context).textTheme;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
        child: SingleChildScrollView(
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [
            Text(t.payrollSlipFor(_monthLabel(context, slip.period)), style: text.titleLarge),
            Text('${t.payrollColsPaidDays}: ${dec(slip.paidDays)}', style: text.bodySmall),
            const SizedBox(height: 12),
            Text(t.payrollSlipEarnings, style: text.titleSmall),
            for (final e in earnings) line(e['name'] as String, e['earned'] as String),
            line(t.payrollColsGross, slip.gross, bold: true),
            const SizedBox(height: 12),
            Text(t.payrollSlipDeductions, style: text.titleSmall),
            for (final x in deductions) line(x.$1, x.$2),
            line(t.commonTotal, slip.totalDeductions, bold: true),
            const Divider(height: 24),
            line(t.payrollSlipNetPay, slip.netPay, bold: true),
            Text(wordsFor(context, slip.netPay), style: text.bodySmall),
          ]),
        ),
      ),
    );
  }
}

class _LeaveTab extends StatelessWidget {
  const _LeaveTab();

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(onPressed: () => _request(context), icon: const Icon(Icons.add), label: Text(t.hrLeaveNew)),
      body: StreamBuilder<List<LeaveRequest>>(
        stream: app.hr.watchLeave(),
        builder: (context, snap) => FutureBuilder<(Map<String, Employee>, Map<String, LeaveType>)>(
          future: () async {
            final emps = await app.db.select(app.db.employees).get();
            final types = await app.db.select(app.db.leaveTypes).get();
            return ({for (final e in emps) e.id: e}, {for (final l in types) l.id: l});
          }(),
          builder: (context, lookup) {
            final rows = snap.data ?? const <LeaveRequest>[];
            if (rows.isEmpty) return Center(child: Text(t.hrLeaveNone));
            final emps = lookup.data?.$1 ?? const {};
            final types = lookup.data?.$2 ?? const {};
            return ListView.separated(
              padding: const EdgeInsets.only(bottom: 96),
              itemCount: rows.length,
              separatorBuilder: (_, _) => const Divider(height: 1),
              itemBuilder: (context, i) {
                final r = rows[i];
                final e = emps[r.employeeId];
                final ty = types[r.leaveTypeId];
                final status = switch (r.status) {
                  'approved' => t.hrLeaveStatusesApproved,
                  'rejected' => t.hrLeaveStatusesRejected,
                  'cancelled' => t.hrLeaveStatusesCancelled,
                  _ => t.hrLeaveStatusesPending,
                };
                return ListTile(
                  title: Text('${e == null ? '' : localName(context, e.name, e.nameHi)} · ${ty == null ? '' : localName(context, ty.name, ty.nameHi)}'),
                  subtitle: Text([
                    r.fromDate == r.toDate ? r.fromDate : '${r.fromDate} – ${r.toDate}',
                    if (r.halfDay) t.hrLeaveHalfDay,
                    if (r.days != null) '${dec(r.days!)} ${t.hrLeaveDays}',
                    if (r.reason != null && r.reason!.isNotEmpty) r.reason!,
                    if (r.syncState == 'pending') t.appNotSyncedYet,
                    if (r.syncState == 'failed') errorText(t, r.syncError ?? ''),
                  ].join(' · ')),
                  trailing: Text(status),
                );
              },
            );
          },
        ),
      ),
    );
  }

  Future<void> _request(BuildContext context) async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    final emps = await (app.db.select(app.db.employees)..where((e) => e.status.equals('active'))).get();
    final types = await app.hr.leaveTypes();
    if (!context.mounted || emps.isEmpty || types.isEmpty) return;
    String employeeId = emps.first.id;
    String typeId = types.first.id;
    var from = DateTime.now();
    var to = DateTime.now();
    var half = false;
    final reason = TextEditingController();
    String? error;
    await showDialog<void>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) {
          Future<void> pick(bool isFrom) async {
            final d = await showDatePicker(context: ctx, initialDate: isFrom ? from : to, firstDate: DateTime(2020), lastDate: DateTime.now().add(const Duration(days: 365)));
            if (d != null) setLocal(() => isFrom ? (from = d, to = to.isBefore(d) ? d : to) : to = d);
          }

          return AlertDialog(
            title: Text(t.hrLeaveNew),
            content: SizedBox(
              width: 420,
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  initialValue: employeeId,
                  decoration: InputDecoration(labelText: t.hrLeaveEmployee),
                  items: [for (final e in emps) DropdownMenuItem(value: e.id, child: Text('${e.code} · ${localName(ctx, e.name, e.nameHi)}'))],
                  onChanged: (v) => setLocal(() => employeeId = v!),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  initialValue: typeId,
                  decoration: InputDecoration(labelText: t.hrLeaveType),
                  items: [for (final l in types) DropdownMenuItem(value: l.id, child: Text(localName(ctx, l.name, l.nameHi)))],
                  onChanged: (v) => setLocal(() => typeId = v!),
                ),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(child: OutlinedButton(onPressed: () => pick(true), child: Text('${t.hrLeaveFrom}: ${_iso(from)}'))),
                  const SizedBox(width: 8),
                  Expanded(child: OutlinedButton(onPressed: half ? null : () => pick(false), child: Text('${t.hrLeaveTo}: ${_iso(half ? from : to)}'))),
                ]),
                CheckboxListTile(contentPadding: EdgeInsets.zero, value: half, title: Text(t.hrLeaveHalfDay), onChanged: (v) => setLocal(() => half = v ?? false)),
                TextField(controller: reason, decoration: InputDecoration(labelText: t.hrLeaveReason), maxLength: 300),
                if (error != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(error!, style: TextStyle(color: Theme.of(ctx).colorScheme.error))),
              ]),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: Text(t.commonCancel)),
              FilledButton(
                onPressed: () async {
                  try {
                    await app.hr.requestLeave(employeeId: employeeId, leaveTypeId: typeId, from: _iso(from), to: _iso(to), halfDay: half, reason: reason.text.trim().isEmpty ? null : reason.text.trim());
                    app.sync?.syncNow();
                    if (ctx.mounted) Navigator.pop(ctx);
                  } on BooksException catch (e) {
                    setLocal(() => error = errorText(t, e.code));
                  }
                },
                child: Text(t.hrLeaveSubmit),
              ),
            ],
          );
        },
      ),
    );
  }
}
