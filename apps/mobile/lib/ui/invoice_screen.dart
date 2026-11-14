import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/dates.dart';
import '../core/format.dart';
import '../core/gst.dart';
import '../core/invoice.dart';
import '../core/models.dart';
import '../core/money.dart';
import '../core/perf.dart';
import '../core/store.dart';
import 'widgets.dart';

/// One line being typed: its boxes and what they hold.
class _LineCtl {
  final DraftLine line;
  final item = TextEditingController();
  final qty = TextEditingController();
  final rate = TextEditingController();
  final disc = TextEditingController();
  final itemFocus = FocusNode();
  final qtyFocus = FocusNode();
  _LineCtl(this.line);

  void dispose() {
    for (final c in [item, qty, rate, disc]) {
      c.dispose();
    }
    itemFocus.dispose();
    qtyFocus.dispose();
  }
}

/// The sales invoice: customer, lines and totals on one screen. Totals are worked out on the device on every keystroke, and only the changed line and the totals are
/// redrawn, so typing stays quick on a long invoice. Save puts the invoice in the outbox and the screen is ready for the next one while the server is told in the background.
class InvoiceScreen extends StatefulWidget {
  final AppStore store;
  final String Function()? today;
  const InvoiceScreen({super.key, required this.store, this.today});

  @override
  State<InvoiceScreen> createState() => _InvoiceScreenState();
}

class _InvoiceScreenState extends State<InvoiceScreen> {
  late InvoiceDraft draft;
  final List<_LineCtl> ctl = [];
  final customerCtl = TextEditingController();
  final customerFocus = FocusNode();
  final dateCtl = TextEditingController();
  final calc = ValueNotifier<InvoiceResult>(
    const InvoiceResult(null, [], null),
  );
  String? dateError;
  String? message;
  Map<String, dynamic>? balance;

  AppStore get store => widget.store;
  String get today => widget.today?.call() ?? isoOf(DateTime.now());

  @override
  void initState() {
    super.initState();
    _reset();
  }

  void _reset() {
    // The old boxes are let go after the next frame, once nothing on screen refers to them.
    final old = List<_LineCtl>.of(ctl);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      for (final c in old) {
        c.dispose();
      }
    });
    ctl.clear();
    draft = InvoiceDraft(date: today);
    ctl.add(_LineCtl(draft.lines.first));
    customerCtl.clear();
    dateCtl.text = showDate(draft.date);
    balance = null;
    dateError = null;
    calc.value = const InvoiceResult(null, [], null);
  }

  @override
  void dispose() {
    for (final c in ctl) {
      c.dispose();
    }
    customerCtl.dispose();
    customerFocus.dispose();
    dateCtl.dispose();
    calc.dispose();
    super.dispose();
  }

  void _recalc() =>
      calc.value = Perf.time('totals', () => draft.compute(store.homeState));

  void _addLine({bool focus = true}) {
    final l = DraftLine();
    draft.lines.add(l);
    final c = _LineCtl(l);
    ctl.add(c);
    setState(() {});
    if (focus)
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => c.itemFocus.requestFocus(),
      );
  }

  void _removeLine(_LineCtl c) {
    if (draft.lines.length == 1) return;
    draft.lines.remove(c.line);
    ctl.remove(c);
    WidgetsBinding.instance.addPostFrameCallback((_) => c.dispose());
    setState(() {});
    _recalc();
  }

  void _pickItem(_LineCtl c, Item item) {
    final l = c.line;
    l.item = item;
    l.gstOverride = null;
    final sale = item.saleRate;
    if (l.rate.isEmpty && sale != '0' && sale != '0.00' && sale.isNotEmpty) {
      l.rate = sale.contains('.')
          ? sale
                .replaceFirst(RegExp(r'0+$'), '')
                .replaceFirst(RegExp(r'\.$'), '')
          : sale;
      c.rate.text = l.rate;
    }
    _recalc();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => c.qtyFocus.requestFocus(),
    );
  }

  Future<void> _pickCustomer(Customer c) async {
    setState(() => draft.customer = c);
    _recalc();
    try {
      final b = await store.api.get('/customers/${c.id}/balance');
      if (mounted && draft.customer?.id == c.id)
        setState(() => balance = (b as Map).cast<String, dynamic>());
    } catch (_) {
      /* offline: the chip is simply not shown */
    }
  }

  void _date(String text) {
    final iso = parseDateText(text, today);
    final err = iso == null && text.trim().isNotEmpty ? 'Not a date' : null;
    if (err != dateError) setState(() => dateError = err);
    if (iso != null) {
      draft.date = iso;
      _recalc();
    }
  }

  void _save() {
    if (!draft.canSave) {
      setState(
        () => message = draft.customer == null
            ? 'Choose a customer first.'
            : 'Add at least one complete line.',
      );
      return;
    }
    if (calc.value.error != null) {
      setState(() => message = calc.value.error);
      return;
    }
    final sw = Stopwatch()..start();
    final e = store.saveInvoice(draft);
    final ms = sw.elapsedMicroseconds / 1000;
    setState(() {
      _reset();
      message =
          'Saved ${e.customerName}. ${ms.toStringAsFixed(2)} ms. Sending to the server.';
    });
    customerFocus.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 840;
    return CallbackShortcuts(
      bindings: {
        const SingleActivator(LogicalKeyboardKey.keyS, control: true): _save,
        const SingleActivator(LogicalKeyboardKey.f3): () => _addLine(),
      },
      child: FocusScope(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(12),
                children: [
                  _header(wide),
                  const SizedBox(height: 12),
                  for (var i = 0; i < ctl.length; i++)
                    _LineRow(
                      key: ObjectKey(ctl[i]),
                      ctl: ctl[i],
                      index: i,
                      wide: wide,
                      store: store,
                      calc: calc,
                      dateOf: () => draft.date,
                      canRemove: ctl.length > 1,
                      onChanged: _recalc,
                      onPick: (x) => _pickItem(ctl[i], x),
                      onRemove: () => _removeLine(ctl[i]),
                      onLastSubmit: () {
                        if (i == ctl.length - 1) _addLine();
                      },
                    ),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: TextButton.icon(
                      key: const Key('add-line'),
                      onPressed: _addLine,
                      icon: const Icon(Icons.add),
                      label: const Text('Add line  F3'),
                    ),
                  ),
                  const SizedBox(height: 8),
                  _Totals(calc: calc),
                ],
              ),
            ),
            _actionBar(),
          ],
        ),
      ),
    );
  }

  Widget _header(bool wide) {
    final c = draft.customer;
    final overdue =
        balance != null && (double.tryParse('${balance!['overdue']}') ?? 0) > 0;
    final owes = balance == null
        ? null
        : (double.tryParse('${balance!['balance']}') ?? 0);
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        SizedBox(
          width: wide ? 340 : double.infinity,
          child: LocalPicker<Customer>(
            key: const Key('customer'),
            index: store.customerIndex,
            label: (c) => c.name,
            sub: (c) => c.gstin,
            controller: customerCtl,
            focusNode: customerFocus,
            hint: 'Customer',
            perfName: 'search customer',
            onSelected: _pickCustomer,
            onCleared: () {
              setState(() {
                draft.customer = null;
                balance = null;
              });
              _recalc();
            },
          ),
        ),
        SizedBox(
          width: 150,
          child: TextField(
            key: const Key('date'),
            controller: dateCtl,
            decoration: InputDecoration(
              labelText: 'Date',
              isDense: true,
              errorText: dateError,
            ),
            onChanged: _date,
            onSubmitted: (_) {
              if (dateError == null) dateCtl.text = showDate(draft.date);
            },
          ),
        ),
        if (c != null)
          Chip(
            label: Text(
              'Place of supply ${draft.placeOfSupply(store.homeState)}',
            ),
          ),
        if (owes != null)
          Chip(
            key: const Key('balance'),
            avatar: overdue
                ? const Icon(Icons.warning_amber, size: 16, color: Colors.red)
                : null,
            label: Text(
              owes > 0
                  ? 'Owes ₹ ${formatIndian('${balance!['balance']}')}${overdue ? ' (₹ ${formatIndian('${balance!['overdue']}')} overdue)' : ''}'
                  : 'Nothing due',
            ),
          ),
        if (c?.gstin != null) Chip(label: Text(c!.gstin!)),
      ],
    );
  }

  Widget _actionBar() => Material(
    elevation: 6,
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              message ?? '',
              key: const Key('message'),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: Colors.black54),
            ),
          ),
          FilledButton(
            key: const Key('save'),
            onPressed: _save,
            child: const Text('Save invoice  Ctrl+S'),
          ),
        ],
      ),
    ),
  );
}

/// One line of the invoice. The boxes are built once; only the rate and amount beside them follow the totals.
class _LineRow extends StatelessWidget {
  final _LineCtl ctl;
  final int index;
  final bool wide, canRemove;
  final AppStore store;
  final ValueNotifier<InvoiceResult> calc;
  final String Function() dateOf;
  final VoidCallback onChanged, onRemove, onLastSubmit;
  final ValueChanged<Item> onPick;

  const _LineRow({
    super.key,
    required this.ctl,
    required this.index,
    required this.wide,
    required this.store,
    required this.calc,
    required this.dateOf,
    required this.canRemove,
    required this.onChanged,
    required this.onPick,
    required this.onRemove,
    required this.onLastSubmit,
  });

  @override
  Widget build(BuildContext context) {
    final l = ctl.line;
    final i = index;
    final picker = LocalPicker<Item>(
      key: Key('item-$i'),
      index: store.itemIndex,
      label: (x) => x.label,
      sub: (x) => '${x.hsn ?? ''}  stock ${x.stockQty}  ₹ ${x.saleRate}',
      controller: ctl.item,
      focusNode: ctl.itemFocus,
      hint: 'Item',
      onSelected: onPick,
      onCleared: () {
        l.item = null;
        onChanged();
      },
    );
    final qty = NumField(
      key: Key('qty-$i'),
      controller: ctl.qty,
      focusNode: ctl.qtyFocus,
      label: 'Qty',
      onChanged: (v) {
        l.qty = v;
        onChanged();
      },
    );
    final rate = NumField(
      key: Key('rate-$i'),
      controller: ctl.rate,
      label: 'Rate',
      onChanged: (v) {
        l.rate = v;
        onChanged();
      },
    );
    final disc = NumField(
      key: Key('disc-$i'),
      controller: ctl.disc,
      label: 'Disc %',
      onChanged: (v) {
        l.discPct = v;
        onChanged();
      },
      onSubmitted: (_) => onLastSubmit(),
    );
    final remove = IconButton(
      tooltip: 'Remove line',
      onPressed: canRemove ? onRemove : null,
      icon: const Icon(Icons.delete_outline),
    );

    // What follows the totals: the GST rate and the line amount.
    Widget gst({TextAlign align = TextAlign.center}) =>
        ValueListenableBuilder<InvoiceResult>(
          valueListenable: calc,
          builder: (_, __, ___) => Text(
            l.item == null ? '' : '${l.gstRate(dateOf())}%',
            textAlign: align,
          ),
        );
    Widget amount({TextAlign align = TextAlign.end}) =>
        ValueListenableBuilder<InvoiceResult>(
          valueListenable: calc,
          builder: (_, r, __) {
            final row = r.rowOf.length > i ? r.rowOf[i] : null;
            final lt = row == null ? null : r.tax!.lines[row];
            return Text(
              lt == null ? '' : '₹ ${formatIndian(lt.totalValue)}',
              key: Key('amount-$i'),
              textAlign: align,
              style: const TextStyle(fontWeight: FontWeight.w600),
            );
          },
        );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: wide
          ? Row(
              children: [
                SizedBox(width: 28, child: Text('${i + 1}')),
                Expanded(flex: 4, child: picker),
                const SizedBox(width: 8),
                SizedBox(width: 90, child: qty),
                const SizedBox(width: 8),
                SizedBox(width: 110, child: rate),
                const SizedBox(width: 8),
                SizedBox(width: 80, child: disc),
                SizedBox(width: 56, child: gst()),
                SizedBox(width: 130, child: amount()),
                remove,
              ],
            )
          : Card(
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  children: [
                    picker,
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(child: qty),
                        const SizedBox(width: 8),
                        Expanded(child: rate),
                        const SizedBox(width: 8),
                        Expanded(child: disc),
                      ],
                    ),
                    Row(
                      children: [
                        gst(align: TextAlign.start),
                        const Spacer(),
                        amount(),
                        remove,
                      ],
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class _Totals extends StatelessWidget {
  final ValueNotifier<InvoiceResult> calc;
  const _Totals({required this.calc});

  @override
  Widget build(BuildContext context) => ValueListenableBuilder<InvoiceResult>(
    valueListenable: calc,
    builder: (context, r, _) {
      final t = r.tax;
      Widget row(String k, String v) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Text(k, style: const TextStyle(color: Colors.black54)),
            const SizedBox(width: 24),
            SizedBox(
              width: 150,
              child: Text(
                v,
                textAlign: TextAlign.end,
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        ),
      );
      String rs(BigInt p) => '₹ ${formatIndian(paiseToString(p))}';
      return Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (r.error != null)
            Text(r.error!, style: const TextStyle(color: Colors.red)),
          if (t != null) ...[
            row('Taxable value', rs(t.taxable)),
            if (t.kind == SupplyKind.intra) ...[
              row('CGST', rs(t.cgst)),
              if (t.sgst != BigInt.zero) row('SGST', rs(t.sgst)),
              if (t.utgst != BigInt.zero) row('UTGST', rs(t.utgst)),
            ] else
              row('IGST', rs(t.igst)),
            if (t.cess != BigInt.zero) row('Cess', rs(t.cess)),
            if (t.roundOff != BigInt.zero) row('Round off', rs(t.roundOff)),
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const Text(
                    'Total',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
                  ),
                  const SizedBox(width: 24),
                  Flexible(
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerRight,
                      child: Text(
                        rs(t.grandTotal),
                        key: const Key('total'),
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 28,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Text(
              amountInWords(t.grandTotalValue),
              style: const TextStyle(color: Colors.black54),
            ),
          ] else
            const Text(
              'Add an item, a quantity and a rate to see the totals.',
              style: TextStyle(color: Colors.black54),
            ),
        ],
      );
    },
  );
}
