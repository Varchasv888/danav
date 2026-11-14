import 'package:decimal/decimal.dart';

import 'money.dart';
import 'states.dart';

/// Port of packages/domain/src/gst.ts. Must produce identical results; see spec/fixtures/gst.json.

class TaxContext {
  const TaxContext({
    required this.supplierState,
    required this.placeOfSupply,
    this.sez = false,
    this.lut = false,
    this.reverseCharge = false,
    this.roundOff = true,
  });
  final String supplierState;
  final String placeOfSupply;
  final bool sez;
  final bool lut;
  final bool reverseCharge;
  final bool roundOff;

  factory TaxContext.fromJson(Map<String, dynamic> j) => TaxContext(
        supplierState: j['supplierState'] as String,
        placeOfSupply: j['placeOfSupply'] as String,
        sez: j['sez'] as bool? ?? false,
        lut: j['lut'] as bool? ?? false,
        reverseCharge: j['reverseCharge'] as bool? ?? false,
        roundOff: j['roundOff'] as bool? ?? true,
      );
}

class LineInput {
  const LineInput({required this.qty, required this.rate, required this.gstRate, this.discount = '0', this.cessRate = '0'});
  final String qty;
  final String rate;
  final String gstRate;
  final String discount;
  final String cessRate;

  factory LineInput.fromJson(Map<String, dynamic> j) => LineInput(
        qty: j['qty'] as String,
        rate: j['rate'] as String,
        gstRate: j['gstRate'] as String,
        discount: j['discount'] as String? ?? '0',
        cessRate: j['cessRate'] as String? ?? '0',
      );
}

class LineTax {
  const LineTax(this.taxableValue, this.cgst, this.sgst, this.utgst, this.igst, this.cess);
  final Decimal taxableValue, cgst, sgst, utgst, igst, cess;
  Decimal get total => taxableValue + cgst + sgst + utgst + igst + cess;
}

class InvoiceTax {
  InvoiceTax(this.supplyKind, this.lines, this.taxCharged, this.roundOff, this.grandTotal);
  final String supplyKind;
  final List<LineTax> lines;
  final String taxCharged;
  final String roundOff;
  final String grandTotal;

  String _sum(Decimal Function(LineTax) f) => money(sumOf(lines.map(f)));
  String get taxableValue => _sum((l) => l.taxableValue);
  String get cgst => _sum((l) => l.cgst);
  String get sgst => _sum((l) => l.sgst);
  String get utgst => _sum((l) => l.utgst);
  String get igst => _sum((l) => l.igst);
  String get cess => _sum((l) => l.cess);

  Map<String, String> toTotals() => {
        'supplyKind': supplyKind,
        'taxableValue': taxableValue,
        'cgst': cgst,
        'sgst': sgst,
        'utgst': utgst,
        'igst': igst,
        'cess': cess,
        'taxCharged': taxCharged,
        'roundOff': roundOff,
        'grandTotal': grandTotal,
      };
}

String supplyKind(TaxContext ctx) {
  if (ctx.placeOfSupply == '96') return 'export';
  if (ctx.sez) return 'sez';
  return ctx.supplierState == ctx.placeOfSupply ? 'intra' : 'inter';
}

LineTax computeLineTax(LineInput line, TaxContext ctx) {
  final taxable = round2(dec(line.qty) * dec(line.rate) - dec(line.discount));
  if (taxable < zero) throw ArgumentError('line discount exceeds line value');
  final rate = dec(line.gstRate);
  final kind = supplyKind(ctx);
  final zeroRated = (kind == 'export' || kind == 'sez') && ctx.lut;

  var cgst = zero, sgst = zero, utgst = zero, igst = zero;
  final cess = zeroRated ? zero : round2(divInt(taxable * dec(line.cessRate), 100));
  if (!zeroRated) {
    if (kind == 'intra') {
      final half = round2(divInt(taxable * rate, 200));
      cgst = half;
      if (findState(ctx.supplierState)?.ut ?? false) {
        utgst = half;
      } else {
        sgst = half;
      }
    } else {
      igst = round2(divInt(taxable * rate, 100));
    }
  }
  return LineTax(taxable, cgst, sgst, utgst, igst, cess);
}

InvoiceTax computeInvoiceTax(List<LineInput> lines, TaxContext ctx) {
  final taxes = lines.map((l) => computeLineTax(l, ctx)).toList();
  final taxable = sumOf(taxes.map((t) => t.taxableValue));
  final tax = sumOf(taxes.map((t) => t.cgst + t.sgst + t.utgst + t.igst + t.cess));
  final charged = ctx.reverseCharge ? zero : tax;
  final before = taxable + charged;
  final r = ctx.roundOff ? roundOffToRupee(before) : (rounded: money(before), roundOff: '0.00');
  return InvoiceTax(supplyKind(ctx), taxes, money(charged), r.roundOff, r.rounded);
}
