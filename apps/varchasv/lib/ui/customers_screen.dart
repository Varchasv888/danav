import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/customers.dart';
import '../l10n/gen/app_localizations.dart';
import 'format.dart';

/// Find a customer by mobile number or name and see how they shop: visits, spend, favourite items, latest bills, and (online) their points.
class CustomersScreen extends StatefulWidget {
  const CustomersScreen({super.key});

  @override
  State<CustomersScreen> createState() => _CustomersScreenState();
}

class _CustomersScreenState extends State<CustomersScreen> {
  final _q = TextEditingController();
  List<({String phone, String? name, String lastVisit})> _found = [];
  CustomerProfile? _profile;
  bool _busy = false;

  @override
  void dispose() {
    _q.dispose();
    super.dispose();
  }

  Future<void> _search() async {
    final app = AppScope.of(context);
    final text = _q.text.trim();
    final results = await Customers(app.db).search(text);
    if (!mounted) return;
    setState(() { _found = results; _profile = null; });
    // A full number opens straight away, even if this device has not billed them.
    if (RegExp(r'^[6-9]\d{9}$').hasMatch(text)) await _open(text);
  }

  Future<void> _open(String phone) async {
    final app = AppScope.of(context);
    setState(() => _busy = true);
    final p = await Customers(app.db).profile(phone, app.api);
    if (mounted) setState(() { _profile = p; _busy = false; });
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final p = _profile;
    return Scaffold(
      appBar: AppBar(title: Text(t.toolCustomers)),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        TextField(controller: _q, decoration: InputDecoration(labelText: t.custSearchHint, suffixIcon: IconButton(icon: const Icon(Icons.search), onPressed: _search)), onSubmitted: (_) => _search()),
        const SizedBox(height: 12),
        if (_busy) const LinearProgressIndicator(),
        if (p == null)
          for (final f in _found) ListTile(title: Text(f.name ?? f.phone), subtitle: Text('${f.phone} · ${t.custLast(f.lastVisit)}'), onTap: () => _open(f.phone))
        else ...[
          Text(p.name ?? p.phone, style: Theme.of(context).textTheme.titleLarge),
          Text(p.phone),
          const SizedBox(height: 8),
          Wrap(spacing: 24, runSpacing: 8, children: [
            _stat(context, t.custVisits, '${p.visits}'),
            _stat(context, t.custSpent, rupees(p.spent)),
            if (p.lastVisit != null) _stat(context, t.custLastLabel, p.lastVisit!),
            if (p.points != null) _stat(context, t.custPoints, '${p.points}'),
            if (p.returned != null && p.returned != '0.00') _stat(context, t.custReturned, rupees(p.returned!)),
          ]),
          Padding(padding: const EdgeInsets.only(top: 8), child: Text(p.fromCloud ? t.custCloud : t.custLocalOnly, style: Theme.of(context).textTheme.bodySmall)),
          if (p.top.isNotEmpty) ...[const Divider(height: 24), Text(t.custTop, style: Theme.of(context).textTheme.titleSmall), for (final x in p.top) ListTile(dense: true, title: Text(x.name), trailing: Text(x.qty))],
          if (p.recent.isNotEmpty) ...[const Divider(height: 24), Text(t.custRecent, style: Theme.of(context).textTheme.titleSmall), for (final b in p.recent) ListTile(dense: true, title: Text(b.number), subtitle: Text(b.date), trailing: Text(rupees(b.total)))],
          TextButton(onPressed: () => setState(() => _profile = null), child: Text(t.custBack)),
        ],
        if (p == null && _found.isEmpty && _q.text.isNotEmpty && !_busy) Padding(padding: const EdgeInsets.all(8), child: Text(t.custNone)),
      ]),
    );
  }

  Widget _stat(BuildContext context, String label, String value) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: Theme.of(context).textTheme.bodySmall), Text(value, style: Theme.of(context).textTheme.titleMedium)]);
}
