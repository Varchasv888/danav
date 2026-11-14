import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/reports.dart';
import '../l10n/gen/app_localizations.dart';
import 'format.dart';

/// The owner's few reports on the phone: read from the cloud when there is a connection, and the last copy shown (marked as old) when there is not.
class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _name = 'daySales';
  ReportCopy? _copy;
  bool _busy = false;
  bool _loaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loaded) return;
    _loaded = true;
    _load();
  }

  Future<void> _load() async {
    final app = AppScope.of(context);
    setState(() => _busy = true);
    ReportCopy? c;
    try {
      c = await Reports(app.db).load(_name, app.api, todayIso());
    } catch (_) {
      c = await Reports(app.db).cached(_name);
    }
    if (mounted) setState(() { _copy = c; _busy = false; });
  }

  String _label(AppLocalizations t, String name) => switch (name) { 'daySales' => t.reportDaySales, 'stockSummary' => t.reportStock, _ => t.reportReceivables };

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final c = _copy;
    return Scaffold(
      appBar: AppBar(title: Text(t.toolReports), actions: [IconButton(tooltip: t.appSyncNow, icon: const Icon(Icons.refresh), onPressed: _busy ? null : _load)]),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        SegmentedButton<String>(
          segments: [for (final n in Reports.catalog.keys) ButtonSegment(value: n, label: Text(_label(t, n)))],
          selected: {_name},
          onSelectionChanged: (s) { setState(() { _name = s.first; _copy = null; }); _load(); },
        ),
        const SizedBox(height: 12),
        if (_busy) const LinearProgressIndicator(),
        if (c == null && !_busy) Text(t.reportNone),
        if (c != null) ...[
          Text(c.fresh ? t.reportFetched(TimeOfDay.fromDateTime(c.at).format(context)) : t.reportOld(c.at.toIso8601String().substring(0, 16).replaceFirst('T', ' ')), style: TextStyle(color: c.fresh ? null : Theme.of(context).colorScheme.error)),
          const SizedBox(height: 8),
          ..._body(context, t, c),
        ],
      ]),
    );
  }

  List<Widget> _body(BuildContext context, AppLocalizations t, ReportCopy c) {
    final d = c.data;
    List<Map<String, dynamic>> list(Object? v) => ((v as List?) ?? const []).whereType<Map<String, dynamic>>().toList();
    Widget row(String left, String right) => ListTile(dense: true, title: Text(left), trailing: Text(right));
    switch (c.name) {
      case 'daySales':
        final modes = d['byMode'] is Map ? (d['byMode'] as Map).cast<String, dynamic>() : <String, dynamic>{};
        return [
          row(t.reportBills, '${d['bills'] ?? 0}'),
          row(t.reportSales, rupees(d['total'] ?? d['sales'] ?? '0')),
          for (final e in modes.entries) row(e.key, rupees(e.value.toString())),
          for (final b in list(d['best']).take(5)) row('${b['name']}', '${b['qty']}'),
        ];
      case 'stockSummary':
        final rows = list(d['rows']);
        return [row(t.reportItems, '${rows.length}'), for (final r in rows.take(30)) row('${r['name'] ?? r['itemId']}', '${r['qty']}')];
      default:
        final rows = list(d['rows']);
        return [row(t.reportParties, '${rows.length}'), for (final r in rows.take(30)) row('${r['name'] ?? r['party'] ?? ''}', rupees((r['total'] ?? r['balance'] ?? r['amount'] ?? '0').toString()))];
    }
  }
}
