import 'package:decimal/decimal.dart';

import 'money.dart';

/// Stock valuation. Port of valueStock in packages/domain/src/inventory.ts; shared cases in
/// spec/fixtures/stock.json. See the TypeScript file for the rules.

class StockMove {
  const StockMove({this.qtyIn, this.qtyOut, this.rate});
  final String? qtyIn;
  final String? qtyOut;
  final String? rate;

  factory StockMove.fromJson(Map<String, dynamic> j) =>
      StockMove(qtyIn: j['qtyIn'] as String?, qtyOut: j['qtyOut'] as String?, rate: j['rate'] as String?);
}

class ValuedMove {
  const ValuedMove(this.valueChange, this.rate, this.balanceQty, this.balanceValue);
  final String valueChange;
  final String rate;
  final String balanceQty;
  final String balanceValue;
}

class StockValuation {
  const StockValuation(this.moves, this.qty, this.value);
  final List<ValuedMove> moves;
  final String qty;
  final String value;
}

class _Layer {
  _Layer(this.qty, this.rate);
  Decimal qty;
  final Decimal rate;
}

Decimal _qty4(String? v) => dec(v ?? '0').round(scale: 4);
String _q(Decimal v) => v.toStringAsFixed(4);
Decimal _div(Decimal a, Decimal b) => (a / b).toDecimal(scaleOnInfinitePrecision: 20);

StockValuation valueStock(List<StockMove> moves, String method) {
  var balQty = zero;
  var balValue = zero;
  var lastRate = zero;
  var layers = <_Layer>[];
  final out = <ValuedMove>[];

  for (final m in moves) {
    final inQ = _qty4(m.qtyIn);
    final outQ = _qty4(m.qtyOut);
    if (inQ < zero || outQ < zero) throw ArgumentError('quantities must not be negative');
    if (inQ != zero && outQ != zero) throw ArgumentError('an entry is either incoming or outgoing');

    if (inQ != zero) {
      final rate = dec(m.rate ?? '0');
      final before = balValue;
      if (balQty <= zero) {
        final newQty = balQty + inQ;
        balValue = newQty > zero ? round2(newQty * rate) : zero;
        layers = newQty > zero ? [_Layer(newQty, rate)] : [];
        balQty = newQty;
      } else {
        balQty += inQ;
        balValue += round2(inQ * rate);
        layers.add(_Layer(inQ, rate));
      }
      lastRate = rate;
      out.add(ValuedMove(money(balValue - before), money(rate), _q(balQty), money(balValue)));
      continue;
    }

    final available = balQty > zero ? balQty : zero;
    final fromStock = outQ <= available ? outQ : available;
    final shortfall = outQ - fromStock;
    Decimal removed;
    if (fromStock == available && available > zero) {
      removed = balValue;
      layers = [];
    } else if (method == 'average') {
      removed = available == zero ? zero : round2(_div(balValue, balQty) * fromStock);
    } else {
      removed = zero;
      var need = fromStock;
      while (need > zero && layers.isNotEmpty) {
        final layer = layers.first;
        final take = layer.qty <= need ? layer.qty : need;
        removed += take * layer.rate;
        layer.qty -= take;
        need -= take;
        if (layer.qty == zero) layers.removeAt(0);
      }
      removed = round2(removed);
    }
    if (available > zero) lastRate = _div(balValue, balQty);
    removed += round2(shortfall * lastRate);

    balQty -= outQ;
    balValue -= removed;
    final rate = outQ == zero ? zero : _div(removed, outQ);
    out.add(ValuedMove(money(-removed), money(rate), _q(balQty), money(balValue)));
  }
  return StockValuation(out, _q(balQty), money(balValue));
}
