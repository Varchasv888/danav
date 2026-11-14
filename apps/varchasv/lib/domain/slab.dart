import 'package:decimal/decimal.dart';

import 'money.dart';

/// Port of packages/domain/src/slab.ts. Must match spec/fixtures/gst-slab.json exactly.
///
/// GST rates that depend on the price of each piece: garments and made-ups pay a lower rate up to a
/// sale value per piece and a higher one above it; footwear does the same per pair. The test uses the
/// value after any discount and before GST.

const gstSlabs = ['apparel', 'footwear'];

class SlabPeriod {
  const SlabPeriod(this.from, this.threshold, this.below, this.above);
  final String from;
  final String threshold;
  final String below;
  final String above;
}

const _periods = <String, List<SlabPeriod>>{
  'apparel': [SlabPeriod('2017-07-01', '1000', '5', '12'), SlabPeriod('2025-09-22', '2500', '5', '18')],
  'footwear': [SlabPeriod('2022-01-01', '1000', '12', '18'), SlabPeriod('2025-09-22', '2500', '5', '18')],
};

bool isGstSlab(String? v) => v != null && gstSlabs.contains(v);

Decimal _div(Decimal a, Decimal b) => (a / b).toDecimal(scaleOnInfinitePrecision: 20);

SlabPeriod slabPeriod(String slab, String date) {
  final list = _periods[slab]!;
  var found = list.first;
  for (final p in list) {
    if (p.from.compareTo(date) <= 0) found = p;
  }
  return found;
}

String slabRate(String slab, String date, Object pieceValue) {
  final p = slabPeriod(slab, date);
  return dec(pieceValue) <= dec(p.threshold) ? p.below : p.above;
}

String slabRateInclusive(String slab, String date, Object piecePrice) {
  final p = slabPeriod(slab, date);
  final value = _div(dec(piecePrice) * Decimal.fromInt(100), Decimal.fromInt(100) + dec(p.below));
  return value <= dec(p.threshold) ? p.below : p.above;
}

bool slabAmbiguous(String slab, String date, Object piecePrice) {
  final p = slabPeriod(slab, date);
  final price = dec(piecePrice);
  final t = dec(p.threshold);
  final hundred = Decimal.fromInt(100);
  return price > _div(t * (hundred + dec(p.below)), hundred) && price <= _div(t * (hundred + dec(p.above)), hundred);
}

/// The GST rate for an invoice line: the item's own rate, or the slab rate for its value per piece.
String lineGstRate({required String gstRate, String? gstSlab, int? slabPieces, required String qty, required String rate, String discount = '0', required String date, bool inclusive = false}) {
  if (!isGstSlab(gstSlab)) return _plain(dec(gstRate));
  final pieces = (slabPieces ?? 1) < 1 ? 1 : (slabPieces ?? 1);
  final q = dec(qty);
  final perUnit = q == zero ? dec(rate) : _div(q * dec(rate) - dec(discount), q);
  final perPiece = _div(perUnit, Decimal.fromInt(pieces));
  return inclusive ? slabRateInclusive(gstSlab!, date, perPiece) : slabRate(gstSlab!, date, perPiece);
}

String _plain(Decimal d) {
  var s = d.toString();
  if (s.contains('.')) s = s.replaceFirst(RegExp(r'0+$'), '').replaceFirst(RegExp(r'\.$'), '');
  return s;
}
