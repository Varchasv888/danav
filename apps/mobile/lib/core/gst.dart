/// The same GST arithmetic as the server (packages/domain/src/gst.ts), worked out on the device so an invoice's totals appear as the person types,
/// with no network. A fixture of 1,500 random invoices worked out by the server's own code proves every paisa agrees (test/gst_test.dart).
library;

import 'money.dart';
import 'states.dart';

enum SupplyKind { intra, inter, export, sez }

class TaxContext {
  final String supplierState;
  final String placeOfSupply;
  final bool sez;
  final bool lut;
  final bool reverseCharge;
  final bool roundOff;
  const TaxContext({
    required this.supplierState,
    required this.placeOfSupply,
    this.sez = false,
    this.lut = false,
    this.reverseCharge = false,
    this.roundOff = true,
  });
}

class LineInput {
  final String qty;
  final String rate;
  final String discount;
  final String gstRate;
  final String cessRate;
  const LineInput({
    required this.qty,
    required this.rate,
    this.discount = '0',
    required this.gstRate,
    this.cessRate = '0',
  });
}

class LineTax {
  final BigInt taxable, cgst, sgst, utgst, igst, cess, total;
  const LineTax(
    this.taxable,
    this.cgst,
    this.sgst,
    this.utgst,
    this.igst,
    this.cess,
    this.total,
  );
  String get taxableValue => paiseToString(taxable);
  String get totalValue => paiseToString(total);
}

class InvoiceTax {
  final SupplyKind kind;
  final List<LineTax> lines;
  final BigInt taxable,
      cgst,
      sgst,
      utgst,
      igst,
      cess,
      taxCharged,
      roundOff,
      grandTotal;
  const InvoiceTax(
    this.kind,
    this.lines,
    this.taxable,
    this.cgst,
    this.sgst,
    this.utgst,
    this.igst,
    this.cess,
    this.taxCharged,
    this.roundOff,
    this.grandTotal,
  );
  String get grandTotalValue => paiseToString(grandTotal);
}

SupplyKind supplyKind(TaxContext c) {
  if (c.placeOfSupply == '96') return SupplyKind.export;
  if (c.sez) return SupplyKind.sez;
  return c.supplierState == c.placeOfSupply
      ? SupplyKind.intra
      : SupplyKind.inter;
}

final BigInt _e10 = pow10(10),
    _e4 = BigInt.from(10000),
    _e5 = BigInt.from(20000);

/// One line. Quantity and rate are taken to six decimals, discount to paise, GST and cess rates to hundredths of a percent.
LineTax computeLineTax(LineInput l, TaxContext c) {
  final q = parseScaled(l.qty, 6),
      p = parseScaled(l.rate, 6),
      d = parseScaled(l.discount, 2);
  // gross in paise = q * p / 10^10, less the discount, rounded to paise half up.
  final taxable = divRound(q * p - d * _e10, _e10);
  if (taxable.isNegative)
    throw const FormatException('line discount exceeds line value');
  final rate = parseScaled(l.gstRate, 2);
  final kind = supplyKind(c);
  final zeroRated =
      (kind == SupplyKind.export || kind == SupplyKind.sez) && c.lut;
  var cgst = BigInt.zero,
      sgst = BigInt.zero,
      utgst = BigInt.zero,
      igst = BigInt.zero;
  final cess = zeroRated
      ? BigInt.zero
      : divRound(taxable * parseScaled(l.cessRate, 2), _e4);
  if (!zeroRated) {
    if (kind == SupplyKind.intra) {
      final half = divRound(taxable * rate, _e5);
      cgst = half;
      if (findState(c.supplierState)?.ut ?? false) {
        utgst = half;
      } else {
        sgst = half;
      }
    } else {
      igst = divRound(taxable * rate, _e4);
    }
  }
  return LineTax(
    taxable,
    cgst,
    sgst,
    utgst,
    igst,
    cess,
    taxable + cgst + sgst + utgst + igst + cess,
  );
}

/// [memo] remembers each line's tax by its inputs, so a keystroke in one line does not re-do the arithmetic of the others (the result is identical, only quicker).
InvoiceTax computeInvoiceTax(
  List<LineInput> lines,
  TaxContext c, {
  Map<String, LineTax>? memo,
}) {
  final kind = supplyKind(c);
  final List<LineTax> lt;
  if (memo == null) {
    lt = [for (final l in lines) computeLineTax(l, c)];
  } else {
    if (memo.length > 2000) memo.clear();
    final ctx = '${kind.index}|${c.supplierState}|${c.lut}';
    lt = [
      for (final l in lines)
        memo['${l.qty}|${l.rate}|${l.discount}|${l.gstRate}|${l.cessRate}|$ctx'] ??=
            computeLineTax(l, c),
    ];
  }
  BigInt sum(BigInt Function(LineTax) f) =>
      lt.fold(BigInt.zero, (a, b) => a + f(b));
  final taxable = sum((l) => l.taxable),
      cgst = sum((l) => l.cgst),
      sgst = sum((l) => l.sgst),
      utgst = sum((l) => l.utgst),
      igst = sum((l) => l.igst),
      cess = sum((l) => l.cess);
  final tax = cgst + sgst + utgst + igst + cess;
  final charged = c.reverseCharge ? BigInt.zero : tax;
  final before = taxable + charged;
  final BigInt rounded, off;
  if (c.roundOff) {
    final rupees = divRound(before, BigInt.from(100));
    rounded = rupees * BigInt.from(100);
    off = rounded - before;
  } else {
    rounded = before;
    off = BigInt.zero;
  }
  return InvoiceTax(
    kind,
    lt,
    taxable,
    cgst,
    sgst,
    utgst,
    igst,
    cess,
    charged,
    off,
    rounded,
  );
}
