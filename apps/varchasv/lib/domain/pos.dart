import 'package:decimal/decimal.dart';

import 'money.dart';
import 'slab.dart';

/// Port of packages/domain/src/pos.ts. Must match spec/fixtures/manufacturing-pos.json exactly.

Decimal _div(Decimal a, Object b) => (a / dec(b)).toDecimal(scaleOnInfinitePrecision: 20);
Decimal _r2(Decimal v) => v.round(scale: 2);
String _num(Decimal d) {
  // Same text as decimal.js toString(): no trailing zeros.
  var s = d.toString();
  if (s.contains('.')) s = s.replaceFirst(RegExp(r'0+$'), '').replaceFirst(RegExp(r'\.$'), '');
  return s;
}

class PosLineInput {
  const PosLineInput({required this.qty, required this.price, required this.gstRate, this.cessRate = '0', this.discount = '0', this.gstSlab, this.slabPieces});
  final String qty;
  final String price;
  final String gstRate;
  final String cessRate;
  final String discount;
  /// Price-based GST (apparel, footwear): the rate is picked per piece after discounts.
  final String? gstSlab;
  final int? slabPieces;
  factory PosLineInput.fromJson(Map<String, dynamic> j) => PosLineInput(
        qty: j['qty'].toString(), price: j['price'].toString(), gstRate: j['gstRate'].toString(),
        cessRate: (j['cessRate'] ?? '0').toString(), discount: (j['discount'] ?? '0').toString(),
        gstSlab: j['gstSlab'] as String?, slabPieces: j['slabPieces'] as int?,
      );
}

class PosOptions {
  const PosOptions({required this.inclusive, this.billDiscount = '0', this.roundOff = true, this.date});
  final bool inclusive;
  /// Bill date (YYYY-MM-DD) for price-based GST; null means the rule in force now.
  final String? date;
  final String billDiscount;
  final bool roundOff;
  factory PosOptions.fromJson(Map<String, dynamic> j) => PosOptions(
        inclusive: j['inclusive'] as bool, billDiscount: (j['billDiscount'] ?? '0').toString(),
        roundOff: j['roundOff'] as bool? ?? true, date: j['date'] as String?,
      );
}

class PosError implements Exception {
  PosError(this.code);
  final String code;
  @override
  String toString() => 'PosError($code)';
}

/// The line's rate: its own, or the slab rate for its price per piece after every discount.
String _slabbed(PosLineInput l, Decimal amount, PosOptions o) {
  if (!isGstSlab(l.gstSlab) || dec(l.qty) == zero) return l.gstRate;
  final pieces = (l.slabPieces ?? 1) < 1 ? 1 : (l.slabPieces ?? 1);
  final perPiece = _div(_div(amount, dec(l.qty)), Decimal.fromInt(pieces));
  final date = o.date ?? '9999-12-31';
  return o.inclusive ? slabRateInclusive(l.gstSlab!, date, perPiece) : slabRate(l.gstSlab!, date, perPiece);
}

Map<String, dynamic> posBill(List<PosLineInput> lines, PosOptions o) {
  if (lines.isEmpty) throw PosError('no_lines');
  final amounts = [
    for (final l in lines)
      () {
        final a = dec(l.qty) * dec(l.price) - dec(l.discount);
        if (a < zero) throw PosError('discount_exceeds_amount');
        return _r2(a);
      }(),
  ];
  final before = amounts.fold<Decimal>(zero, (s, a) => s + a);
  final billDiscount = _r2(dec(o.billDiscount));
  if (billDiscount > before) throw PosError('discount_exceeds_amount');
  var left = billDiscount;
  final shares = <Decimal>[];
  for (var i = 0; i < amounts.length; i++) {
    final share = i == amounts.length - 1 ? left : (before == zero ? zero : _r2(_div(billDiscount * amounts[i], before)));
    left -= share;
    shares.add(share);
  }
  final out = <Map<String, String>>[];
  for (var i = 0; i < lines.length; i++) {
    final l = lines[i];
    final amount = amounts[i] - shares[i];
    final rate = dec(_slabbed(l, amount, o));
    final cessRate = dec(l.cessRate);
    Decimal taxable, half, cess;
    Decimal total;
    if (o.inclusive) {
      final base = _r2(_div(amount * Decimal.fromInt(100), Decimal.fromInt(100) + rate + cessRate));
      half = _r2(_div(base * rate, 200));
      cess = _r2(_div(base * cessRate, 100));
      taxable = amount - half * Decimal.fromInt(2) - cess;
      total = amount;
    } else {
      taxable = amount;
      half = _r2(_div(taxable * rate, 200));
      cess = _r2(_div(taxable * cessRate, 100));
      total = taxable + half * Decimal.fromInt(2) + cess;
    }
    out.add({
      'qty': _num(dec(l.qty)), 'price': money(l.price), 'gstRate': _num(rate), 'discount': money(dec(l.discount) + shares[i]),
      'taxable': money(taxable), 'cgst': money(half), 'sgst': money(half), 'cess': money(cess), 'total': money(total),
    });
  }
  Decimal sum(String k) => out.fold<Decimal>(zero, (s, l) => s + dec(l[k]!));
  final exact = sum('total');
  final total = o.roundOff ? exact.round() : exact;
  final byRate = <String, List<Decimal>>{};
  void addRate(String rate, Decimal t, Decimal c, Decimal s, Decimal x) {
    final cur = byRate[rate] ?? [zero, zero, zero, zero];
    byRate[rate] = [cur[0] + t, cur[1] + c, cur[2] + s, cur[3] + x];
  }

  for (final l in out) {
    addRate(l['gstRate']!, dec(l['taxable']!), dec(l['cgst']!), dec(l['sgst']!), dec(l['cess']!));
  }
  final rates = byRate.keys.toList()..sort((a, b) => dec(a).compareTo(dec(b)));
  return {
    'lines': out,
    'discount': money(billDiscount),
    'taxable': money(sum('taxable')),
    'cgst': money(sum('cgst')),
    'sgst': money(sum('sgst')),
    'cess': money(sum('cess')),
    'roundOff': money(total - exact),
    'total': money(total),
    'taxByRate': [
      for (final r in rates) {'rate': r, 'taxable': money(byRate[r]![0]), 'cgst': money(byRate[r]![1]), 'sgst': money(byRate[r]![2]), 'cess': money(byRate[r]![3])},
    ],
  };
}

class PosPayment {
  const PosPayment(this.mode, this.amount, {this.reference});
  final String mode; // cash | upi | card | credit
  final String amount;
  final String? reference;
  factory PosPayment.fromJson(Map<String, dynamic> j) => PosPayment(j['mode'] as String, j['amount'].toString(), reference: j['reference'] as String?);
  Map<String, dynamic> toJson() => {'mode': mode, 'amount': amount, if (reference != null) 'reference': reference};
}

Map<String, String> settlePayments(Object total, List<PosPayment> payments) {
  var due = dec(total.toString());
  var change = zero;
  final ordered = [...payments.where((p) => p.mode != 'cash'), ...payments.where((p) => p.mode == 'cash')];
  for (final p in ordered) {
    final amt = dec(p.amount);
    if (amt <= zero) throw PosError('invalid_payment');
    if (p.mode != 'cash' && amt > due) throw PosError('overpaid_non_cash');
    if (amt > due) {
      change += amt - due;
      due = zero;
    } else {
      due -= amt;
    }
  }
  if (due > zero) throw PosError('underpaid');
  String byMode(String m) => money(payments.where((p) => p.mode == m).fold<Decimal>(zero, (s, p) => s + dec(p.amount)));
  return {'change': money(change), 'cash': money(dec(byMode('cash')) - change), 'upi': byMode('upi'), 'card': byMode('card'), 'credit': byMode('credit')};
}

class LoyaltyRule {
  const LoyaltyRule({required this.pointsPer100, required this.pointValue, required this.maxRedeemPct, this.slabs = const [], this.minRedeem = 0});
  final int pointsPer100;
  final String pointValue;
  final String maxRedeemPct;

  /// Richer bills earn more: the highest slab whose `from` the amount reaches sets points per 100.
  final List<({String from, int per100})> slabs;

  /// Fewest points that can be redeemed on one bill.
  final int minRedeem;
  factory LoyaltyRule.fromJson(Map<String, dynamic> j) =>
      LoyaltyRule(
        pointsPer100: j['pointsPer100'] as int, pointValue: j['pointValue'].toString(), maxRedeemPct: j['maxRedeemPct'].toString(),
        slabs: [for (final s in (j['slabs'] as List? ?? const [])) (from: (s as Map)['from'].toString(), per100: s['per100'] as int)],
        minRedeem: (j['minRedeem'] as int?) ?? 0,
      );
}

int loyaltyEarned(Object paid, LoyaltyRule rule) {
  var per100 = rule.pointsPer100;
  Decimal? reached;
  for (final s in rule.slabs) {
    final from = dec(s.from);
    if (dec(paid.toString()) >= from && (reached == null || from > reached)) {
      per100 = s.per100;
      reached = from;
    }
  }
  return _div(dec(paid.toString()), 100).floor().toBigInt().toInt() * per100;
}

Map<String, dynamic> loyaltyRedeemable(int balance, Object bill, LoyaltyRule rule) {
  final value = dec(rule.pointValue);
  if (value <= zero || balance <= 0 || balance < rule.minRedeem) return {'points': 0, 'value': '0.00'};
  final cap = _div(dec(bill.toString()) * dec(rule.maxRedeemPct), 100);
  final byCap = _div(cap, value).floor().toBigInt().toInt();
  final points = balance < byCap ? balance : byCap;
  return {'points': points, 'value': money(value * Decimal.fromInt(points))};
}
