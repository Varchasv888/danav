import 'package:decimal/decimal.dart';

/// Dart port of packages/domain/src/money.ts. Money never touches `double`.
/// Rounding is half away from zero, matching decimal.js ROUND_HALF_UP on the server.

Decimal dec(Object v) => switch (v) {
      Decimal d => d,
      int i => Decimal.fromInt(i),
      String s => Decimal.parse(s.trim()),
      _ => throw ArgumentError('unsupported decimal input: $v'),
    };

final Decimal zero = Decimal.zero;

/// Exact division by an integer (GST divisors are 100 or 200, so results always terminate).
Decimal divInt(Decimal a, int b) => (a / Decimal.fromInt(b)).toDecimal(scaleOnInfinitePrecision: 20);

Decimal round2(Object v) => dec(v).round(scale: 2);

/// Canonical string form: always two decimals ("1180.00").
String money(Object v) => round2(v).toStringAsFixed(2);

Decimal sumOf(Iterable<Object> values) => values.fold(zero, (acc, v) => acc + dec(v));

({String rounded, String roundOff}) roundOffToRupee(Object total) {
  final t = round2(total);
  final r = t.round();
  return (rounded: r.toStringAsFixed(2), roundOff: (r - t).toStringAsFixed(2));
}
