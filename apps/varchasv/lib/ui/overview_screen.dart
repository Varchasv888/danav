import 'dart:convert';

import 'package:flutter/material.dart';

import '../app_state.dart';
import '../l10n/gen/app_localizations.dart';
import '../sync/api_client.dart';
import 'errors.dart';
import 'format.dart';
import 'gst_calculator.dart';

/// The owner's view: today's figures and alerts from the cloud (the last copy is kept for when the
/// device is offline), the approvals waiting, and the GST calculator.
class OverviewScreen extends StatefulWidget {
  const OverviewScreen({super.key});
  @override
  State<OverviewScreen> createState() => _OverviewScreenState();
}

class _OverviewScreenState extends State<OverviewScreen> {
  Map<String, dynamic>? _data;
  DateTime? _at;
  bool _online = false;
  bool _loading = false;
  List<Map<String, dynamic>> _claims = [];
  List<Map<String, dynamic>> _hours = [];
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_started) {
      _started = true;
      _load();
    }
  }

  Future<void> _load() async {
    final app = AppScope.of(context);
    final cached = await app.db.getMeta('overview');
    final cachedAt = await app.db.getMeta('overviewAt');
    if (cached != null && mounted) setState(() { _data = jsonDecode(cached) as Map<String, dynamic>; _at = DateTime.tryParse(cachedAt ?? ''); });
    final api = app.api;
    if (api == null) return;
    setState(() => _loading = true);
    try {
      final d = await api.get('/analytics/dashboard?date=${todayIso()}');
      await app.db.setMeta('overview', jsonEncode(d));
      await app.db.setMeta('overviewAt', DateTime.now().toIso8601String());
      List<Map<String, dynamic>> list(Map<String, dynamic> r) => ((r['data'] as List?) ?? const []).cast<Map<String, dynamic>>();
      final claims = d['approvals'] is Map && (d['approvals'] as Map).containsKey('claims') ? list(await api.get('/expenses/claims?status=submitted')) : <Map<String, dynamic>>[];
      final hours = d['approvals'] is Map && (d['approvals'] as Map).containsKey('timesheets') ? list(await api.get('/timesheets?status=submitted')) : <Map<String, dynamic>>[];
      if (mounted) setState(() { _data = d; _at = DateTime.now(); _online = true; _claims = claims; _hours = hours; });
    } on ApiException {
      if (mounted) setState(() => _online = false);
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _decide(Future<Map<String, dynamic>> Function(ApiClient api) call) async {
    final t = AppLocalizations.of(context);
    final api = AppScope.of(context).api;
    if (api == null) return;
    try {
      await call(api);
      await _load();
    } on ApiException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.isNetwork ? t.appApprovalsNeedOnline : errorText(t, e.code))));
    }
  }

  Future<String?> _reason() async {
    final t = AppLocalizations.of(context);
    final c = TextEditingController();
    final r = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(t.expensesDetailReject),
        content: TextField(controller: c, autofocus: true, decoration: InputDecoration(labelText: t.expensesDetailReason)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: Text(t.commonCancel)),
          FilledButton(onPressed: () => Navigator.pop(ctx, c.text.trim()), child: Text(t.expensesDetailReject)),
        ],
      ),
    );
    c.dispose();
    return r != null && r.length >= 3 ? r : null;
  }

  String _alert(AppLocalizations t, Map<String, dynamic> a) {
    final p = (a['params'] as Map).cast<String, dynamic>();
    String s(String k) => p[k]?.toString() ?? '';
    num n(String k) => num.tryParse(s(k)) ?? 0;
    return switch (a['key']) {
      'overdue60' => t.alertsOverdue60(n('count'), rupees(s('amount'))),
      'gstOverdue' => t.alertsGstOverdue(s('form'), s('period'), s('days')),
      'gstDue' => t.alertsGstDue(s('form'), s('period'), s('days')),
      'lowStock' => t.alertsLowStock(n('count')),
      'unmatchedBank' => t.alertsUnmatchedBank(s('count')),
      'claimsWaiting' => t.alertsClaimsWaiting(s('count')),
      'followUpsLate' => t.alertsFollowUpsLate(n('count')),
      'negativeCash' => t.alertsNegativeCash(s('name'), rupees(s('amount'))),
      _ => a['key'].toString(),
    };
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final text = Theme.of(context).textTheme;
    final d = _data;
    final sales = d?['sales'] as Map<String, dynamic>?;
    final money = d?['money'] as Map<String, dynamic>?;
    final profit = d?['profit'] as Map<String, dynamic>?;
    final alerts = ((d?['alerts'] as List?) ?? const []).cast<Map<String, dynamic>>();
    final time = _at == null ? '' : TimeOfDay.fromDateTime(_at!).format(context);
    Widget kpi(String label, String value, [String? sub]) => Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(label, style: text.bodySmall),
              Text(value, style: text.titleLarge?.copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
              if (sub != null) Text(sub, style: text.bodySmall),
            ]),
          ),
        );
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(children: [
            Expanded(child: Text(d == null ? t.appOverviewNever : _online ? t.appOverviewAsOf(time) : t.appOverviewOffline(time), style: text.bodySmall)),
            if (_loading) const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)) else IconButton(onPressed: _load, icon: const Icon(Icons.refresh), tooltip: t.appOverviewRefresh),
          ]),
          if (alerts.isNotEmpty)
            Card(
              child: Column(children: [
                for (final a in alerts)
                  ListTile(
                    dense: true,
                    leading: Icon(Icons.warning_amber_rounded, color: a['level'] == 'danger' ? Theme.of(context).colorScheme.error : Colors.amber.shade800),
                    title: Text(_alert(t, a)),
                  ),
              ]),
            ),
          Wrap(spacing: 8, runSpacing: 8, children: [
            if (sales != null) SizedBox(width: 220, child: kpi(t.dashboardKSalesToday, rupees(sales['today']), t.dashboardKVsYesterday(rupees(sales['yesterday'])))),
            if (sales != null) SizedBox(width: 220, child: kpi(t.dashboardKSalesMonth, rupees(sales['mtd']))),
            if (money != null) SizedBox(width: 220, child: kpi(t.dashboardKReceivables, rupees((money['receivables'] as Map)['total']), t.dashboardKOverdue(rupees((money['receivables'] as Map)['overdue'])))),
            if (money != null) SizedBox(width: 220, child: kpi(t.dashboardKPayables, rupees((money['payables'] as Map)['total']), t.dashboardKDueSoon(rupees((money['payables'] as Map)['dueIn7Days'])))),
            if (profit != null) SizedBox(width: 220, child: kpi(t.dashboardKProfit, rupees(profit['netProfit']))),
          ]),
          if (money != null) ...[
            const SizedBox(height: 8),
            Text(t.dashboardKCashBank, style: text.titleSmall),
            for (final c in (money['cashBank'] as List).cast<Map<String, dynamic>>())
              ListTile(dense: true, contentPadding: EdgeInsets.zero, title: Text(c['name'] as String), trailing: Text(rupees(c['balance']))),
          ],
          if (_claims.isNotEmpty || _hours.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(t.appApprovalsTitle, style: text.titleSmall),
            for (final c in _claims)
              Card(
                child: ListTile(
                  title: Text('${c['employee']}: ${c['title']}'),
                  subtitle: Text('${c['number']} · ${rupees(c['total'])}'),
                  trailing: Wrap(children: [
                    IconButton(tooltip: t.expensesDetailReject, icon: const Icon(Icons.close), onPressed: () async {
                      final r = await _reason();
                      if (r != null) await _decide((api) => api.post('/expenses/claims/${c['id']}/reject', {'reason': r}));
                    }),
                    IconButton(tooltip: t.expensesDetailApprove, icon: const Icon(Icons.check_circle_outline), onPressed: () => _decide((api) => api.post('/expenses/claims/${c['id']}/approve'))),
                  ]),
                ),
              ),
            for (final h in _hours)
              Card(
                child: ListTile(
                  title: Text('${h['employee']} · ${h['date']}'),
                  subtitle: Text(t.appApprovalsHours(h['project'].toString(), h['hours'].toString())),
                  trailing: Wrap(children: [
                    IconButton(tooltip: t.projectsTimeReject, icon: const Icon(Icons.close), onPressed: () => _decide((api) => api.post('/timesheets/decide', {'ids': [h['id']], 'decision': 'rejected'}))),
                    IconButton(tooltip: t.projectsTimeApprove, icon: const Icon(Icons.check_circle_outline), onPressed: () => _decide((api) => api.post('/timesheets/decide', {'ids': [h['id']], 'decision': 'approved'}))),
                  ]),
                ),
              ),
          ] else if (_online && d?['approvals'] is Map && (d!['approvals'] as Map).isNotEmpty)
            Padding(padding: const EdgeInsets.symmetric(vertical: 8), child: Text(t.appApprovalsNone, style: text.bodySmall)),
          const SizedBox(height: 16),
          Align(alignment: Alignment.topLeft, child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 560), child: const GstCalculatorCard())),
        ],
      ),
    );
  }
}
