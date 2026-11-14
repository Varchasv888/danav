import 'dart:convert';

import 'package:decimal/decimal.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../data/database.dart';
import '../data/pos.dart';
import '../domain/domain.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';

String _name(PosItem i, BuildContext context) => localName(context, i.name, i.nameHi);

/// Counter billing that works offline: scan or tap items, take cash/UPI/card (split if needed) and
/// hand over the change. Bills are numbered on this device and upload with the next sync.
class PosScreen extends StatelessWidget {
  const PosScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    return DefaultTabController(
      length: 2,
      child: Column(children: [
        TabBar(tabs: [Tab(text: t.posBillingTitle), Tab(text: t.posDeviceTodayBills)]),
        const Expanded(child: TabBarView(children: [_BillingTab(), _BillsTab()])),
      ]),
    );
  }
}

class _Payment {
  _Payment(this.mode);
  String mode;
  final amount = TextEditingController();
  final reference = TextEditingController();
}

class _BillingTab extends StatefulWidget {
  const _BillingTab();
  @override
  State<_BillingTab> createState() => _BillingTabState();
}

class _BillingTabState extends State<_BillingTab> {
  List<PosTerminal> _terminals = [];
  List<PosItem> _items = [];
  PosSettingsData _settings = const PosSettingsData();
  List<Scheme> _schemes = const [];
  String? _terminalId;
  bool _loaded = false;
  final _cart = <CartItem>[];
  final _search = TextEditingController();
  final _searchFocus = FocusNode();
  final _discount = TextEditingController();
  final _phone = TextEditingController();
  final _customer = TextEditingController();
  List<_Payment> _payments = [_Payment('cash')];
  Listenable? _syncListenable;
  DateTime? _seenSync;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final sync = AppScope.of(context).sync;
    if (sync != _syncListenable) {
      _syncListenable?.removeListener(_onSync);
      _syncListenable = sync?..addListener(_onSync);
    }
    if (!_loaded) _load();
  }

  @override
  void dispose() {
    _syncListenable?.removeListener(_onSync);
    for (final c in [_search, _discount, _phone, _customer]) {
      c.dispose();
    }
    _searchFocus.dispose();
    super.dispose();
  }

  void _onSync() {
    final at = AppScope.of(context).sync?.lastSyncAt;
    if (at != null && at != _seenSync) {
      _seenSync = at;
      _load();
    }
  }

  Future<void> _load() async {
    final pos = AppScope.of(context).pos;
    final terminals = await pos.terminals();
    final items = await pos.items();
    final settings = await pos.settings();
    final schemes = await pos.schemes();
    if (!mounted) return;
    setState(() {
      _loaded = true;
      _terminals = terminals;
      _items = items;
      _settings = settings;
      _schemes = schemes;
      if (_terminalId == null || !terminals.any((x) => x.id == _terminalId)) _terminalId = terminals.isEmpty ? null : terminals.first.id;
    });
  }

  void _add(PosItem item) {
    setState(() {
      final existing = _cart.where((c) => c.item.id == item.id).firstOrNull;
      if (existing != null) {
        existing.qty = (dec(existing.qty) + dec('1')).toString();
      } else {
        _cart.add(CartItem(item));
      }
    });
  }

  Future<void> _scan(String code) async {
    final hit = await AppScope.of(context).pos.byCode(code);
    final q = code.trim().toLowerCase();
    final match = hit ?? _items.where((i) => i.name.toLowerCase().contains(q) || (i.nameHi ?? '').contains(q)).firstOrNull;
    if (match != null) _add(match);
    _search.clear();
    _searchFocus.requestFocus();
    setState(() {});
  }

  Map<String, dynamic>? get _bill {
    if (_cart.isEmpty) return null;
    try {
      return AppScope.of(context).pos.preview(_cart, _settings, billDiscount: _discount.text.trim(), schemes: _schemes);
    } on PosError {
      return null;
    } on FormatException {
      return null;
    }
  }

  Future<void> _complete() async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    final bill = _bill;
    if (bill == null || _terminalId == null) return;
    final filled = _payments.where((p) => p.amount.text.trim().isNotEmpty).toList();
    final payments = filled.isEmpty
        ? [PosPayment(_payments.first.mode, bill['total'] as String)]
        : [for (final p in filled) PosPayment(p.mode, p.amount.text.trim(), reference: p.reference.text.trim().isEmpty ? null : p.reference.text.trim())];
    try {
      final saved = await app.pos.createBill(
        terminalId: _terminalId!, cart: List.of(_cart), payments: payments, billDiscount: _discount.text.trim(),
        customerPhone: _phone.text.trim(), customerName: _customer.text.trim(),
      );
      app.sync?.syncNow();
      setState(() {
        _cart.clear();
        for (final c in [_discount, _phone, _customer]) {
          c.clear();
        }
        _payments = [_Payment('cash')];
      });
      if (mounted) await showReceipt(context, saved, _terminals.firstWhere((x) => x.id == saved.terminalId).name, _settings.receiptFooter);
      _searchFocus.requestFocus();
    } on BooksException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(t, e.code))));
    } on FormatException {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.posErrorsInvalidPayment)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    if (!_loaded) return const Center(child: CircularProgressIndicator());
    if (_terminals.isEmpty) return Center(child: Padding(padding: const EdgeInsets.all(24), child: Text(t.posDeviceNoTerminal, textAlign: TextAlign.center)));
    final wide = MediaQuery.sizeOf(context).width >= 900;
    final picker = _picker(context);
    final cart = _cartPanel(context);
    return wide
        ? Row(crossAxisAlignment: CrossAxisAlignment.start, children: [Expanded(child: picker), const VerticalDivider(width: 1), SizedBox(width: 420, child: cart)])
        : ListView(children: [SizedBox(height: 360, child: picker), const Divider(height: 1), cart]);
  }

  Widget _picker(BuildContext context) {
    final t = AppLocalizations.of(context);
    final q = _search.text.trim().toLowerCase();
    final shown = q.isEmpty ? _items : _items.where((i) => i.name.toLowerCase().contains(q) || (i.nameHi ?? '').contains(q) || i.barcode == q || (i.sku ?? '').toLowerCase() == q).toList();
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(children: [
        Row(children: [
          if (_terminals.length > 1)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: DropdownButton<String>(
                value: _terminalId,
                items: [for (final x in _terminals) DropdownMenuItem(value: x.id, child: Text('${x.code} · ${x.name}'))],
                onChanged: (v) => setState(() => _terminalId = v),
              ),
            )
          else
            Padding(padding: const EdgeInsets.only(right: 12), child: Text('${_terminals.first.code} · ${_terminals.first.name}')),
          Expanded(
            child: TextField(
              controller: _search,
              focusNode: _searchFocus,
              autofocus: true,
              decoration: InputDecoration(prefixIcon: const Icon(Icons.qr_code_scanner), hintText: t.posBillingSearch, isDense: true, border: const OutlineInputBorder()),
              onChanged: (_) => setState(() {}),
              onSubmitted: _scan,
            ),
          ),
        ]),
        const SizedBox(height: 8),
        Text(t.posDeviceOfflineNote, style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 8),
        Expanded(
          child: GridView.extent(
            maxCrossAxisExtent: 180,
            childAspectRatio: 1.8,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            children: [
              for (final i in shown.take(120))
                OutlinedButton(
                  style: OutlinedButton.styleFrom(alignment: Alignment.topLeft, padding: const EdgeInsets.all(10), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                  onPressed: () => _add(i),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text(_name(i, context), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text('₹ ${formatIndian(i.saleRate)}'),
                  ]),
                ),
            ],
          ),
        ),
      ]),
    );
  }

  Widget _cartPanel(BuildContext context) {
    final t = AppLocalizations.of(context);
    final text = Theme.of(context).textTheme;
    final bill = _bill;
    final total = bill == null ? zero : dec(bill['total'] as String);
    final paid = _payments.fold<Decimal>(zero, (s, p) => s + (Decimal.tryParse(p.amount.text.trim()) ?? zero));
    Widget row(String label, String value, {bool strong = false}) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 2),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text(label, style: strong ? text.titleLarge : text.bodyMedium),
            Text(value, style: (strong ? text.titleLarge : text.bodyMedium)?.copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
          ]),
        );
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text(t.posBillingCart, style: text.titleMedium),
        if (_cart.isEmpty) Padding(padding: const EdgeInsets.symmetric(vertical: 24), child: Text(t.posBillingEmpty, textAlign: TextAlign.center)),
        for (final c in _cart)
          ListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            title: Text(_name(c.item, context)),
            subtitle: Text('₹ ${formatIndian(c.item.saleRate)} · ${dec(c.item.gstRate)}%'),
            trailing: Row(mainAxisSize: MainAxisSize.min, children: [
              IconButton(
                icon: const Icon(Icons.remove_circle_outline),
                onPressed: () => setState(() => dec(c.qty) <= dec('1') ? _cart.remove(c) : c.qty = (dec(c.qty) - dec('1')).toString()),
              ),
              Text(c.qty, style: text.titleMedium),
              IconButton(icon: const Icon(Icons.add_circle_outline), onPressed: () => setState(() => c.qty = (dec(c.qty) + dec('1')).toString())),
            ]),
          ),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(
            child: TextField(
              controller: _discount,
              decoration: InputDecoration(labelText: t.posBillingDiscount, isDense: true),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}'))],
              onChanged: (_) => setState(() {}),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: _phone,
              decoration: InputDecoration(labelText: t.posBillingCustomer, isDense: true),
              keyboardType: TextInputType.phone,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly, LengthLimitingTextInputFormatter(10)],
              onChanged: (_) => setState(() {}),
            ),
          ),
        ]),
        if (_phone.text.length == 10) TextField(controller: _customer, decoration: InputDecoration(labelText: t.posBillingCustomerName, isDense: true)),
        const SizedBox(height: 12),
        if (bill != null) ...[
          row(t.posBillingTaxable, '₹ ${formatIndian(bill['taxable'] as String)}'),
          row(t.posBillingTax, '₹ ${formatIndian((dec(bill['cgst'] as String) + dec(bill['sgst'] as String) + dec(bill['cess'] as String)).toString())}'),
          for (final s in (bill['schemes'] as List).cast<Map<String, String>>()) row(s['name']!, '− ₹ ${formatIndian(s['discount']!)}'),
          if (dec(bill['discount'] as String) > zero) row(t.posBillingDiscount, '− ₹ ${formatIndian(bill['discount'] as String)}'),
          if (dec(bill['roundOff'] as String) != zero) row(t.posBillingRoundOff, bill['roundOff'] as String),
          row(t.posBillingTotal, '₹ ${formatIndian(bill['total'] as String)}', strong: true),
          const SizedBox(height: 12),
          Text(t.posBillingPayments, style: text.titleSmall),
          for (final p in _payments)
            Row(children: [
              DropdownButton<String>(
                value: p.mode,
                items: [
                  DropdownMenuItem(value: 'cash', child: Text(t.posBillingModesCash)),
                  DropdownMenuItem(value: 'upi', child: Text(t.posBillingModesUpi)),
                  DropdownMenuItem(value: 'card', child: Text(t.posBillingModesCard)),
                ],
                onChanged: (v) => setState(() => p.mode = v!),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: p.amount,
                  decoration: InputDecoration(hintText: formatIndian((total - paid + (Decimal.tryParse(p.amount.text) ?? zero)).toString()), isDense: true),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}'))],
                  onChanged: (_) => setState(() {}),
                ),
              ),
              if (p.mode != 'cash') ...[
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: p.reference, decoration: InputDecoration(hintText: t.posBillingReference, isDense: true))),
              ],
              if (_payments.length > 1) IconButton(icon: const Icon(Icons.close), onPressed: () => setState(() => _payments.remove(p))),
            ]),
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(onPressed: () => setState(() => _payments.add(_Payment('upi'))), icon: const Icon(Icons.add), label: Text(t.posBillingAddPayment)),
          ),
          if (paid > total) row(t.posBillingChange, '₹ ${formatIndian((paid - total).toString())}', strong: true),
          if (paid > zero && paid < total) Text('${t.posBillingDue}: ₹ ${formatIndian((total - paid).toString())}', style: TextStyle(color: Theme.of(context).colorScheme.error)),
          const SizedBox(height: 12),
          FilledButton(
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)),
            onPressed: _complete,
            child: Text('${t.posBillingPay} · ₹ ${formatIndian(bill['total'] as String)}'),
          ),
        ],
      ]),
    );
  }
}

class _BillsTab extends StatelessWidget {
  const _BillsTab();

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return StreamBuilder<List<PosBill>>(
      stream: app.pos.watchBills(todayIso()),
      builder: (context, snap) {
        final bills = snap.data ?? const [];
        if (bills.isEmpty) return Center(child: Text(t.posBillsNone));
        final sum = bills.fold<Decimal>(zero, (s, b) => s + dec(b.total));
        return ListView(children: [
          ListTile(title: Text(t.posBillingTotal), trailing: Text('₹ ${formatIndian(sum.toString())}', style: Theme.of(context).textTheme.titleMedium)),
          const Divider(height: 1),
          for (final b in bills)
            ListTile(
              title: Text(b.number),
              subtitle: Text([
                TimeOfDay.fromDateTime(DateTime.parse(b.createdAt)).format(context),
                if (b.customerPhone != null) b.customerPhone!,
                switch (b.syncState) { 'synced' => t.posDeviceUploaded, 'failed' => t.posDeviceFailed(errorText(t, b.syncError ?? '')), _ => t.posDeviceWaiting },
                if (b.serverTotal != null) t.posDeviceMismatch(b.serverTotal!),
              ].join(' · ')),
              leading: Icon(b.syncState == 'synced' ? Icons.cloud_done_outlined : b.syncState == 'failed' ? Icons.error_outline : Icons.cloud_upload_outlined,
                  color: b.syncState == 'failed' ? Theme.of(context).colorScheme.error : null),
              trailing: Text('₹ ${formatIndian(b.total)}'),
              onTap: () async {
                final terminals = await app.pos.terminals();
                final settings = await app.pos.settings();
                if (context.mounted) await showReceipt(context, b, terminals.where((x) => x.id == b.terminalId).firstOrNull?.name ?? '', settings.receiptFooter);
              },
            ),
        ]);
      },
    );
  }
}

/// The receipt as the device worked it out (the printed copy comes from the web or a thermal printer).
Future<void> showReceipt(BuildContext context, PosBill b, String terminal, String? footer) {
  final t = AppLocalizations.of(context);
  final d = jsonDecode(b.detail) as Map<String, dynamic>;
  final mono = Theme.of(context).textTheme.bodyMedium?.copyWith(fontFamily: 'monospace', fontFeatures: const [FontFeature.tabularFigures()]);
  Widget line(String a, String v, {bool bold = false}) => Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Flexible(child: Text(a, style: bold ? mono?.copyWith(fontWeight: FontWeight.bold) : mono)),
        Text(v, style: bold ? mono?.copyWith(fontWeight: FontWeight.bold) : mono),
      ]);
  return showDialog<void>(
    context: context,
    builder: (_) => AlertDialog(
      title: Text(t.posBillingDone(b.number)),
      content: SizedBox(
        width: 320,
        child: SingleChildScrollView(
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [
            Text('$terminal · ${DateTime.parse(b.createdAt).toLocal().toString().substring(0, 16)}', style: mono),
            const Divider(),
            for (final l in (d['lines'] as List).cast<Map<String, dynamic>>()) ...[
              Text(l['name'] as String, style: mono),
              line('  ${dec(l['qty'].toString())} × ${formatIndian(l['price'].toString())}', formatIndian(l['total'].toString())),
            ],
            const Divider(),
            if (dec(d['discount'].toString()) > zero) line(t.posBillingDiscount, '-${formatIndian(d['discount'].toString())}'),
            if (dec(d['roundOff'].toString()) != zero) line(t.posBillingRoundOff, d['roundOff'].toString()),
            line(t.posBillingTotal, '₹ ${formatIndian(b.total)}', bold: true),
            for (final p in (d['payments'] as List).cast<Map<String, dynamic>>())
              line(switch (p['mode']) { 'upi' => t.posBillingModesUpi, 'card' => t.posBillingModesCard, _ => t.posBillingModesCash }, formatIndian(p['amount'].toString())),
            if (dec(b.change) > zero) line(t.posBillingChange, formatIndian(b.change), bold: true),
            const Divider(),
            for (final r in (d['taxByRate'] as List).cast<Map<String, dynamic>>())
              line('GST ${dec(r['rate'].toString())}% · ${formatIndian(r['taxable'].toString())}', formatIndian((dec(r['cgst'].toString()) + dec(r['sgst'].toString())).toString())),
            if (footer != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(footer, textAlign: TextAlign.center, style: mono)),
            Padding(padding: const EdgeInsets.only(top: 4), child: Text(t.posReceiptThanks, textAlign: TextAlign.center, style: mono)),
          ]),
        ),
      ),
      actions: [FilledButton(onPressed: () => Navigator.pop(context), child: Text(t.posBillingNewBill))],
    ),
  );
}
