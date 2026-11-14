/// GST rates that depend on the price of each piece (garments and footwear), as in packages/domain/src/slab.ts, worked out exactly with whole numbers.
library;

import 'money.dart';
import 'models.dart';

class _Period {
  final String from, threshold, below, above;
  const _Period(this.from, this.threshold, this.below, this.above);
}

const Map<String, List<_Period>> _periods = {
  'apparel': [
    _Period('2017-07-01', '1000', '5', '12'),
    _Period('2025-09-22', '2500', '5', '18'),
  ],
  'footwear': [
    _Period('2022-01-01', '1000', '12', '18'),
    _Period('2025-09-22', '2500', '5', '18'),
  ],
};

/// The rate for an invoice line: the item's own, or the slab rate for its value per piece after the line discount.
String lineGstRate(
  Item item, {
  required String qty,
  required String rate,
  String discount = '0',
  required String date,
}) {
  final slab = item.gstSlab;
  final list = slab == null ? null : _periods[slab];
  if (list == null) return _trim(item.gstRate);
  var p = list.first;
  for (final x in list) {
    if (x.from.compareTo(date) <= 0) p = x;
  }
  final pieces = BigInt.from(item.slabPieces < 1 ? 1 : item.slabPieces);
  final q = parseScaled(qty, 6),
      r = parseScaled(rate, 6),
      d = parseScaled(discount, 2);
  final limit = parseScaled(p.threshold, 0) * pow10(6) * pieces;
  // per piece = (q * r - d * 10^10) / q / pieces, in rupees * 10^6; compared with the threshold without dividing.
  final below = q == BigInt.zero
      ? r <= limit
      : (q * r - d * pow10(10)) <= limit * q;
  return below ? p.below : p.above;
}

String _trim(String v) {
  if (!v.contains('.')) return v;
  return v.replaceFirst(RegExp(r'0+$'), '').replaceFirst(RegExp(r'\.$'), '');
}
