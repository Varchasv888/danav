import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../data/database.dart';
import '../data/field.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';
import 'photo.dart';

/// Work done away from the office, saved on the device and uploaded later: customer orders and
/// expense claims (submitted for approval when they reach the cloud).
class FieldScreen extends StatelessWidget {
  const FieldScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    return DefaultTabController(
      length: 2,
      child: Column(children: [
        TabBar(tabs: [Tab(text: t.appFieldNewOrder), Tab(text: t.appFieldNewClaim)]),
        const Expanded(child: TabBarView(children: [_OrderTab(), _ClaimTab()])),
      ]),
    );
  }
}

Widget _syncChip(BuildContext context, String state, String? error, String? number) {
  final t = AppLocalizations.of(context);
  return switch (state) {
    'synced' => Text(number == null ? t.appBadgeSynced : t.appFieldSentAs(number), style: const TextStyle(fontSize: 12)),
    'failed' => Text('${t.appBadgeFailed}: ${errorText(t, error ?? '')}', style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.error)),
    _ => Text(t.appBadgePending, style: const TextStyle(fontSize: 12)),
  };
}

class _OrderTab extends StatefulWidget {
  const _OrderTab();
  @override
  State<_OrderTab> createState() => _OrderTabState();
}

class _OrderTabState extends State<_OrderTab> {
  List<Account> _customers = [];
  List<PosItem> _items = [];
  String? _customerId;
  final _lines = <OrderLineDraft>[];
  bool _loaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loaded) return;
    _loaded = true;
    final field = AppScope.of(context).field;
    Future.wait([field.customers(), field.items()]).then((r) {
      if (mounted) setState(() { _customers = r[0] as List<Account>; _items = r[1] as List<PosItem>; });
    });
  }

  Future<void> _save() async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    try {
      await app.field.createOrder(customerId: _customerId!, lines: List.of(_lines));
      app.sync?.syncNow();
      setState(() { _lines.clear(); _customerId = null; });
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.appFieldSaved)));
    } on BooksException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(t, e.code))));
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final field = AppScope.of(context).field;
    final customers = {for (final c in _customers) c.id: c};
    return ListView(padding: const EdgeInsets.all(16), children: [
      DropdownButtonFormField<String>(
        initialValue: _customerId,
        decoration: InputDecoration(labelText: t.salesCustomer),
        items: [for (final c in _customers) DropdownMenuItem(value: c.id, child: Text(localName(context, c.name, c.nameHi)))],
        onChanged: (v) => setState(() => _customerId = v),
      ),
      const SizedBox(height: 8),
      for (final l in _lines)
        Row(children: [
          Expanded(flex: 3, child: Text(localName(context, l.item.name, l.item.nameHi))),
          SizedBox(width: 70, child: TextFormField(initialValue: l.qty, decoration: InputDecoration(labelText: t.appFieldQty), keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,4}'))], onChanged: (v) => setState(() => l.qty = v))),
          const SizedBox(width: 8),
          SizedBox(width: 90, child: TextFormField(initialValue: l.rate, decoration: InputDecoration(labelText: t.appFieldRate), keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}'))], onChanged: (v) => setState(() => l.rate = v))),
          IconButton(icon: const Icon(Icons.close), onPressed: () => setState(() => _lines.remove(l))),
        ]),
      Align(
        alignment: Alignment.centerLeft,
        child: TextButton.icon(
          icon: const Icon(Icons.add),
          label: Text(t.appFieldAddItem),
          onPressed: _items.isEmpty ? null : () async {
            final item = await showDialog<PosItem>(context: context, builder: (ctx) => SimpleDialog(
              children: [for (final i in _items) SimpleDialogOption(onPressed: () => Navigator.pop(ctx, i), child: Text('${localName(ctx, i.name, i.nameHi)} · ${rupees(i.saleRate)}'))],
            ));
            if (item != null) setState(() => _lines.add(OrderLineDraft(item, '1', item.saleRate)));
          },
        ),
      ),
      if (_lines.isNotEmpty) Text(t.appFieldApprox(field.estimate(_lines)), style: Theme.of(context).textTheme.bodySmall),
      const SizedBox(height: 8),
      FilledButton(onPressed: _customerId != null && _lines.isNotEmpty ? _save : null, child: Text(t.appFieldSave)),
      const Divider(height: 32),
      Text(t.appFieldOrders, style: Theme.of(context).textTheme.titleSmall),
      StreamBuilder<List<FieldOrder>>(
        stream: field.watchOrders(),
        builder: (context, snap) => Column(children: [
          if ((snap.data ?? const []).isEmpty) Padding(padding: const EdgeInsets.all(8), child: Text(t.appFieldNone)),
          for (final o in snap.data ?? const <FieldOrder>[])
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(customers[o.customerId]?.name ?? ''),
              subtitle: _syncChip(context, o.syncState, o.syncError, o.serverNumber),
              trailing: Text(rupees(o.serverTotal ?? o.estimate)),
            ),
        ]),
      ),
    ]);
  }
}

class _ClaimTab extends StatefulWidget {
  const _ClaimTab();
  @override
  State<_ClaimTab> createState() => _ClaimTabState();
}

class _ClaimTabState extends State<_ClaimTab> {
  List<Employee> _people = [];
  List<ExpenseCategory> _cats = [];
  String? _employeeId;
  String? _categoryId;
  final _title = TextEditingController();
  final _amount = TextEditingController();
  final _details = TextEditingController();
  final _vendor = TextEditingController();
  final _gstin = TextEditingController();
  final _invoice = TextEditingController();
  String _gst = '0';
  String? _photo;
  bool _loaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loaded) return;
    _loaded = true;
    final field = AppScope.of(context).field;
    Future.wait([field.claimants(), field.categories()]).then((r) {
      if (mounted) setState(() { _people = r[0] as List<Employee>; _cats = r[1] as List<ExpenseCategory>; });
    });
  }

  @override
  void dispose() {
    for (final c in [_title, _amount, _details, _vendor, _gstin, _invoice]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _save() async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    try {
      await app.field.createClaim(employeeId: _employeeId!, title: _title.text, lines: [
        ClaimLineDraft(date: todayIso(), categoryId: _categoryId!, amount: _amount.text, description: _details.text.trim(), gstRate: _gst,
            vendorName: _vendor.text.trim(), vendorGstin: _gstin.text.trim(), invoiceNo: _invoice.text.trim(), photoPath: _photo),
      ]);
      app.sync?.syncNow();
      for (final c in [_title, _amount, _details, _vendor, _gstin, _invoice]) {
        c.clear();
      }
      setState(() => _photo = null);
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.appFieldSaved)));
    } on BooksException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(t, e.code))));
    } on FormatException {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.expensesErrorsInvalidAmount)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final field = AppScope.of(context).field;
    final ready = _employeeId != null && _categoryId != null && _title.text.trim().length >= 3 && _amount.text.isNotEmpty;
    return ListView(padding: const EdgeInsets.all(16), children: [
      DropdownButtonFormField<String>(
        initialValue: _employeeId, decoration: InputDecoration(labelText: t.expensesClaimsEmployee),
        items: [for (final e in _people) DropdownMenuItem(value: e.id, child: Text('${e.code} ${localName(context, e.name, e.nameHi)}'))],
        onChanged: (v) => setState(() => _employeeId = v),
      ),
      TextField(controller: _title, decoration: InputDecoration(labelText: t.expensesClaimsClaimTitle), onChanged: (_) => setState(() {})),
      DropdownButtonFormField<String>(
        initialValue: _categoryId, decoration: InputDecoration(labelText: t.expensesFormCategory),
        items: [for (final c in _cats) DropdownMenuItem(value: c.id, child: Text(localName(context, c.name, c.nameHi)))],
        onChanged: (v) => setState(() => _categoryId = v),
      ),
      Row(children: [
        Expanded(child: TextField(controller: _amount, decoration: InputDecoration(labelText: t.expensesFormAmount), keyboardType: const TextInputType.numberWithOptions(decimal: true),
            inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}'))], onChanged: (_) => setState(() {}))),
        const SizedBox(width: 12),
        DropdownButton<String>(value: _gst, items: [for (final r in ['0', '5', '12', '18', '28']) DropdownMenuItem(value: r, child: Text('$r%'))], onChanged: (v) => setState(() => _gst = v!)),
      ]),
      TextField(controller: _details, decoration: InputDecoration(labelText: t.expensesFormDescription)),
      TextField(controller: _vendor, decoration: InputDecoration(labelText: t.expensesFormVendor)),
      TextField(controller: _gstin, decoration: InputDecoration(labelText: t.expensesFormVendorGstin), textCapitalization: TextCapitalization.characters, maxLength: 15),
      TextField(controller: _invoice, decoration: InputDecoration(labelText: t.expensesFormInvoiceNo)),
      Row(children: [
        OutlinedButton.icon(icon: const Icon(Icons.photo_camera_outlined), label: Text(_photo == null ? t.photoTake : t.photoRetake), onPressed: () async { final p = await takePhoto(); if (p != null && mounted) setState(() => _photo = p); }),
        if (_photo != null) ...[const SizedBox(width: 8), Expanded(child: Text(t.photoAttached, style: Theme.of(context).textTheme.bodySmall)), IconButton(tooltip: t.photoRemove, icon: const Icon(Icons.close), onPressed: () => setState(() => _photo = null))],
      ]),
      Text(t.expensesFormItcHint, style: Theme.of(context).textTheme.bodySmall),
      const SizedBox(height: 8),
      FilledButton(onPressed: ready ? _save : null, child: Text(t.expensesFormSubmit)),
      const Divider(height: 32),
      Text(t.appFieldClaims, style: Theme.of(context).textTheme.titleSmall),
      StreamBuilder<List<LocalClaim>>(
        stream: field.watchClaims(),
        builder: (context, snap) => Column(children: [
          if ((snap.data ?? const []).isEmpty) Padding(padding: const EdgeInsets.all(8), child: Text(t.appFieldNone)),
          for (final c in snap.data ?? const <LocalClaim>[])
            ListTile(contentPadding: EdgeInsets.zero, title: Text(c.title), subtitle: _syncChip(context, c.syncState, c.syncError, c.serverNumber), trailing: Text(rupees(c.total))),
        ]),
      ),
    ]);
  }
}
