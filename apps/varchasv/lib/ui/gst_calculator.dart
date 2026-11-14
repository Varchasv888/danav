import 'package:flutter/material.dart';

import '../domain/domain.dart';
import '../l10n/gen/app_localizations.dart';
import 'format.dart';

/// Offline GST calculator, runs entirely on the device using the Dart domain port.
class GstCalculatorCard extends StatefulWidget {
  const GstCalculatorCard({super.key});

  @override
  State<GstCalculatorCard> createState() => _GstCalculatorCardState();
}

class _GstCalculatorCardState extends State<GstCalculatorCard> {
  String _from = '27';
  String _to = '27';
  String _rate = '18';
  final _qty = TextEditingController(text: '1');
  final _price = TextEditingController(text: '1000');

  @override
  void dispose() {
    _qty.dispose();
    _price.dispose();
    super.dispose();
  }

  InvoiceTax? _compute() {
    try {
      return computeInvoiceTax(
        [LineInput(qty: _qty.text, rate: _price.text, gstRate: _rate)],
        TaxContext(supplierState: _from, placeOfSupply: _to),
      );
    } catch (_) {
      return null; // incomplete input while typing
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final hindi = showsHindiNames(context);
    final result = _compute();
    final stateItems = [
      for (final s in gstStates) DropdownMenuItem(value: s.code, child: Text('${s.code} · ${hindi ? s.nameHi : s.name}', overflow: TextOverflow.ellipsis)),
    ];

    Widget row(String label, String value, {bool strong = false}) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 2),
          child: Row(children: [
            Expanded(child: Text(label)),
            Text('₹ ${formatIndian(value)}', style: strong ? const TextStyle(fontWeight: FontWeight.w700) : null),
          ]),
        );

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(t.dashboardCalcTitle, style: Theme.of(context).textTheme.titleMedium),
          Text(t.dashboardCalcSubtitle, style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(height: 16),
          DropdownButtonFormField(isExpanded: true, initialValue: _from, items: stateItems, decoration: InputDecoration(labelText: t.calcFrom), onChanged: (v) => setState(() => _from = v!)),
          const SizedBox(height: 12),
          DropdownButtonFormField(isExpanded: true, initialValue: _to, items: stateItems, decoration: InputDecoration(labelText: t.calcTo), onChanged: (v) => setState(() => _to = v!)),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: TextField(controller: _qty, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: InputDecoration(labelText: t.calcQty), onChanged: (_) => setState(() {}))),
            const SizedBox(width: 12),
            Expanded(child: TextField(controller: _price, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: InputDecoration(labelText: t.calcRate), onChanged: (_) => setState(() {}))),
            const SizedBox(width: 12),
            SizedBox(
              width: 112,
              child: DropdownButtonFormField(
                isExpanded: true,
                initialValue: _rate,
                decoration: InputDecoration(labelText: t.calcGstRate),
                items: [for (final r in ['0', '3', '5', '18', '40']) DropdownMenuItem(value: r, child: Text('$r%'))],
                onChanged: (v) => setState(() => _rate = v!),
              ),
            ),
          ]),
          const Divider(height: 28),
          if (result != null) ...[
            row(t.calcTaxable, result.taxableValue),
            if (result.supplyKind == 'intra') ...[
              row(t.calcCgst, result.cgst),
              if (result.utgst != '0.00') row(t.calcUtgst, result.utgst) else row(t.calcSgst, result.sgst),
            ] else
              row(t.calcIgst, result.igst),
            if (result.roundOff != '0.00') row(t.calcRoundOff, result.roundOff),
            row(t.calcTotal, result.grandTotal, strong: true),
            const SizedBox(height: 8),
            Text('${t.calcInWords}: ${wordsFor(context, result.grandTotal)}', style: Theme.of(context).textTheme.bodySmall),
          ],
        ]),
      ),
    );
  }
}
