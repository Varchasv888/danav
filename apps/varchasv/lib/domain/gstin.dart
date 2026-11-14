import 'states.dart';

/// Port of packages/domain/src/gstin.ts.
const _charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
final _shape = RegExp(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][A-Z0-9][0-9A-Z]$');

String gstinCheckChar(String first14) {
  var total = 0;
  for (var i = 0; i < 14; i++) {
    final value = _charset.indexOf(first14[i]);
    if (value < 0) throw ArgumentError('invalid GSTIN character: ${first14[i]}');
    final product = value * (i.isEven ? 1 : 2);
    total += product ~/ 36 + product % 36;
  }
  return _charset[(36 - total % 36) % 36];
}

/// Returns null when valid, otherwise "length" | "format" | "state" | "checksum".
String? gstinError(String raw) {
  final g = raw.trim().toUpperCase();
  if (g.length != 15) return 'length';
  if (!_shape.hasMatch(g)) return 'format';
  if (!isValidStateCode(g.substring(0, 2))) return 'state';
  if (gstinCheckChar(g.substring(0, 14)) != g[14]) return 'checksum';
  return null;
}
