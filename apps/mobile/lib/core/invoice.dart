/// An invoice being typed: the lines, the customer and the place of supply, with the totals worked out on the device on every keystroke.
library;

import 'gst.dart';
import 'models.dart';
import 'money.dart';
import 'slab.dart';

/// Quantity and rate up to nine whole digits: far beyond any real sale, and well inside what the server stores.
final RegExp _qtyRe = RegExp(r'^\d{1,9}(\.\d{1,4})?$');
final RegExp _pctRe = RegExp(r'^\d{1,3}(\.\d{1,2})?$');
final BigInt _e14 = pow10(14);

/// The largest invoice the app will take: ₹ 1,000 crore.
final BigInt maxInvoicePaise = BigInt.parse('10000000000000');

class DraftLine {
  Item? item;
  String qty, rate, discPct;

  /// A rate the person chose by hand instead of the item's own or its slab rate.
  String? gstOverride;

  DraftLine({
    this.item,
    this.qty = '',
    this.rate = '',
    this.discPct = '',
    this.gstOverride,
  });

  bool get isValid =>
      item != null &&
      _qtyRe.hasMatch(qty) &&
      double.parse(qty) > 0 &&
      _qtyRe.hasMatch(rate) &&
      (discPct.isEmpty || _pctRe.hasMatch(discPct));

  /// The discount in rupees: the typed percentage of the line's value, to paise.
  String discountAmount() {
    if (discPct.isEmpty ||
        !_pctRe.hasMatch(discPct) ||
        !_qtyRe.hasMatch(qty) ||
        !_qtyRe.hasMatch(rate))
      return '0';
    final v = divRound(
      parseScaled(qty, 6) * parseScaled(rate, 6) * parseScaled(discPct, 2),
      _e14,
    );
    return paiseToString(v);
  }

  String gstRate(String date) =>
      gstOverride ??
      lineGstRate(
        item!,
        qty: qty,
        rate: rate,
        discount: discountAmount(),
        date: date,
      );
}

class InvoiceResult {
  final InvoiceTax? tax;

  /// For each line of the draft: the index of its row in [tax], or null when the line is not complete yet.
  final List<int?> rowOf;
  final String? error;
  const InvoiceResult(this.tax, this.rowOf, this.error);
}

class InvoiceDraft {
  Customer? customer;
  String date;
  String? placeOfSupplyOverride;
  String narration = '';
  final List<DraftLine> lines;

  InvoiceDraft({required this.date, List<DraftLine>? lines})
    : lines = lines ?? [DraftLine()];

  String placeOfSupply(String homeState) =>
      placeOfSupplyOverride ?? customer?.stateCode ?? homeState;

  final Map<String, LineTax> _memo = {};

  InvoiceResult compute(String homeState) {
    final rows = <LineInput>[];
    final rowOf = <int?>[];
    for (final l in lines) {
      if (!l.isValid) {
        rowOf.add(null);
        continue;
      }
      rowOf.add(rows.length);
      rows.add(
        LineInput(
          qty: l.qty,
          rate: l.rate,
          discount: l.discountAmount(),
          gstRate: l.gstRate(date),
          cessRate: l.item!.cessRate,
        ),
      );
    }
    if (rows.isEmpty) return InvoiceResult(null, rowOf, null);
    try {
      final r = computeInvoiceTax(
        rows,
        TaxContext(
          supplierState: homeState,
          placeOfSupply: placeOfSupply(homeState),
        ),
        memo: _memo,
      );
      if (r.grandTotal > maxInvoicePaise)
        return InvoiceResult(
          null,
          rowOf,
          'The invoice total is too large. Check the quantities and rates.',
        );
      return InvoiceResult(r, rowOf, null);
    } on FormatException catch (e) {
      return InvoiceResult(null, rowOf, e.message);
    }
  }

  bool get canSave => customer != null && lines.any((l) => l.isValid);

  /// The body the server's POST /sales-invoices takes. The GST rate is left to the server unless it was set by hand (the server works out the same slab rate).
  Map<String, dynamic> payload() => {
    'customerId': customer!.id,
    'date': date,
    'supply': {
      if (placeOfSupplyOverride != null) 'placeOfSupply': placeOfSupplyOverride,
    },
    if (narration.trim().isNotEmpty) 'narration': narration.trim(),
    'lines': [
      for (final l in lines.where((l) => l.isValid))
        {
          'itemId': l.item!.id,
          'qty': l.qty,
          'rate': l.rate,
          if (l.discountAmount() != '0.00' && l.discountAmount() != '0')
            'discount': l.discountAmount(),
          if (l.gstOverride != null) 'gstRate': l.gstOverride,
        },
    ],
  };
}
