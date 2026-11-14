import 'package:decimal/decimal.dart';

import 'money.dart';

/// Port of packages/domain/src/schemes.ts. Must match spec/fixtures/schemes.json exactly.
///
/// Store schemes at billing. The server has already turned each scheme's items, styles, brands and
/// categories into item ids (`itemIds == null` covers every item). A line with its own discount takes
/// no scheme; each line gets at most one; schemes are tried in every order (up to six that touch the
/// bill) and the order saving the customer most wins, else the biggest discount goes first.

class Scheme {
  const Scheme({
    required this.id, required this.name, required this.kind, this.startsOn, this.endsOn, this.weekdays, this.fromTime, this.toTime, this.priority, this.itemIds,
    this.pct, this.amount, this.minValue, this.buy, this.get, this.slabs = const [], this.comboPrice, this.comboItems = const [],
    this.applyOnDiscounted = false, this.inclusiveOfTax = false,
  });
  final String id;
  final String name;
  final String kind;
  final String? startsOn;
  final String? endsOn;

  /// Days of the week it runs on, 0 Sunday to 6 Saturday; none means every day.
  final List<int>? weekdays;

  /// Hours it runs between ("HH:MM"; from inclusive, to exclusive, from later than to runs overnight).
  final String? fromTime;
  final String? toTime;

  /// Manual order: ranked schemes go first, lowest number first, then the rest in whatever order saves the customer most.
  final int? priority;
  final List<String>? itemIds;
  final String? pct;
  final String? amount;
  final String? minValue;
  final int? buy;
  final int? get;
  final List<({String from, String pct})> slabs;
  final String? comboPrice;
  final List<({String itemId, int qty})> comboItems;

  /// Also applies to lines that already carry a discount of their own, on what is left after it.
  final bool applyOnDiscounted;

  /// Thresholds, amount and combo price are stated with tax in them: with tax-exclusive prices, line values are grossed up by their tax rate to compare.
  final bool inclusiveOfTax;

  factory Scheme.fromJson(Map<String, dynamic> j) => Scheme(
        id: j['id'] as String, name: j['name'] as String, kind: j['kind'] as String,
        startsOn: j['startsOn'] as String?, endsOn: j['endsOn'] as String?,
        weekdays: (j['weekdays'] as List?)?.cast<int>(), fromTime: j['fromTime'] as String?, toTime: j['toTime'] as String?, priority: j['priority'] as int?,
        itemIds: (j['itemIds'] as List?)?.cast<String>(),
        pct: j['pct']?.toString(), amount: j['amount']?.toString(), minValue: j['minValue']?.toString(),
        buy: j['buy'] as int?, get: j['get'] as int?,
        slabs: [for (final s in (j['slabs'] as List? ?? const [])) (from: (s as Map)['from'].toString(), pct: s['pct'].toString())],
        comboPrice: j['comboPrice']?.toString(),
        comboItems: [for (final c in (j['comboItems'] as List? ?? const [])) (itemId: (c as Map)['itemId'] as String, qty: c['qty'] as int)],
        applyOnDiscounted: j['applyOnDiscounted'] == true, inclusiveOfTax: j['inclusiveOfTax'] == true,
      );

  /// Is the scheme running on this date and at this time of day? A scheme with hours needs the time of the bill:
  /// with none given it is not applied, rather than guessed at (same rule as schemeActive in the TypeScript domain).
  bool activeOn(String date, [String? time]) {
    if ((startsOn != null && startsOn!.compareTo(date) > 0) || (endsOn != null && date.compareTo(endsOn!) > 0)) return false;
    if (weekdays != null && weekdays!.isNotEmpty) {
      final d = DateTime.parse('${date}T00:00:00Z').weekday % 7; // Dart: Monday 1 to Sunday 7; here Sunday 0
      if (!weekdays!.contains(d)) return false;
    }
    if (fromTime != null && toTime != null) {
      if (time == null || time.isEmpty) return false;
      return fromTime!.compareTo(toTime!) <= 0
          ? time.compareTo(fromTime!) >= 0 && time.compareTo(toTime!) < 0
          : time.compareTo(fromTime!) >= 0 || time.compareTo(toTime!) < 0;
    }
    return true;
  }
}

class SchemeLine {
  const SchemeLine({required this.itemId, required this.qty, required this.price, this.discount = '0', this.taxRate = '0'});
  final String itemId;
  final String qty;
  final String price;
  final String discount;

  /// GST % on the line, for offers stated with tax in them.
  final String taxRate;
  factory SchemeLine.fromJson(Map<String, dynamic> j) =>
      SchemeLine(itemId: j['itemId'] as String, qty: j['qty'].toString(), price: j['price'].toString(), discount: (j['discount'] ?? '0').toString(), taxRate: (j['taxRate'] ?? '0').toString());
}

class _Candidate {
  _Candidate(this.total, this.perLine, this.uses);
  final Decimal total;
  final Map<int, Decimal> perLine;
  final List<int> uses;
}

Decimal _div(Decimal a, Decimal b) => (a / b).toDecimal(scaleOnInfinitePrecision: 20);
bool _whole(String qty) => dec(qty) == dec(qty).floor();
int _floor(String qty) => dec(qty).floor().toBigInt().toInt();

Map<int, Decimal> _spread(Decimal total, List<int> idx, Decimal Function(int) value) {
  final out = <int, Decimal>{};
  final all = idx.fold(zero, (Decimal s, i) => s + value(i));
  var left = round2(total);
  for (var k = 0; k < idx.length; k++) {
    final i = idx[k];
    final share = k == idx.length - 1 ? left : round2(_div(round2(total) * value(i), all));
    out[i] = share;
    left -= share;
  }
  return out;
}

_Candidate? _evaluate(Scheme s, List<SchemeLine> lines, List<int> all, bool pricesIncludeTax) {
  // Lines with a discount of their own join only if the offer says so; they are then worked on what is left after it.
  final free = [for (final i in all) if (s.applyOnDiscounted || dec(lines[i].discount) == zero) i];
  Decimal unit(int i) => dec(lines[i].qty) > zero ? dec(lines[i].price) - _div(dec(lines[i].discount), dec(lines[i].qty)) : dec(lines[i].price);
  Decimal value(int i) => dec(lines[i].qty) * dec(lines[i].price) - dec(lines[i].discount);
  // Tax-inclusive offers on tax-exclusive prices: compare in tax-inclusive terms, then bring the discount back to the price unit.
  Decimal gross(int i) => s.inclusiveOfTax && !pricesIncludeTax ? Decimal.one + _div(dec(lines[i].taxRate), Decimal.fromInt(100)) : Decimal.one;
  if (s.kind == 'combo') {
    if (s.comboItems.isEmpty || s.comboPrice == null) return null;
    int? sets;
    for (final p in s.comboItems) {
      final have = free.where((i) => lines[i].itemId == p.itemId && _whole(lines[i].qty)).fold(0, (int n, i) => n + _floor(lines[i].qty));
      final n = have ~/ p.qty;
      sets = sets == null || n < sets ? n : sets;
    }
    if (sets == null || sets == 0) return null;
    final used = <int, int>{};
    for (final p in s.comboItems) {
      var need = p.qty * sets;
      for (final i in free) {
        if (need == 0) break;
        if (lines[i].itemId != p.itemId || !_whole(lines[i].qty)) continue;
        final room = _floor(lines[i].qty) - (used[i] ?? 0);
        final take = need < room ? need : room;
        if (take <= 0) continue;
        used[i] = (used[i] ?? 0) + take;
        need -= take;
      }
    }
    final idx = used.keys.toList()..sort();
    Decimal usedValue(int i) => Decimal.fromInt(used[i]!) * unit(i);
    final listValue = idx.fold(zero, (Decimal t, i) => t + usedValue(i));
    final listTerms = idx.fold(zero, (Decimal t, i) => t + usedValue(i) * gross(i));
    final total = listTerms > zero ? round2(_div((listTerms - dec(s.comboPrice!) * Decimal.fromInt(sets)) * listValue, listTerms)) : zero;
    if (total <= zero) return null;
    return _Candidate(total, _spread(total, idx, usedValue), idx);
  }

  final idx = free.where((i) => s.itemIds == null || s.itemIds!.contains(lines[i].itemId)).toList();
  if (idx.isEmpty) return null;
  final covered = idx.fold(zero, (Decimal t, i) => t + value(i));
  final coveredTerms = idx.fold(zero, (Decimal t, i) => t + value(i) * gross(i));
  _Candidate byPct(Decimal pct) {
    final perLine = {for (final i in idx) i: round2(_div(value(i) * pct, Decimal.fromInt(100)))};
    return _Candidate(perLine.values.fold(zero, (Decimal t, v) => t + v), perLine, idx);
  }

  switch (s.kind) {
    case 'percent':
      if (s.minValue != null && coveredTerms < dec(s.minValue!)) return null;
      return byPct(dec(s.pct ?? '0'));
    case 'amount_off':
      if (s.minValue != null && coveredTerms < dec(s.minValue!)) return null;
      final wanted = coveredTerms > zero ? _div(dec(s.amount ?? '0') * covered, coveredTerms) : zero;
      final total = round2(wanted > covered ? covered : wanted);
      return _Candidate(total, _spread(total, idx, value), idx);
    case 'qty_slab':
    case 'value_slab':
      final reached = s.kind == 'qty_slab' ? idx.fold(zero, (Decimal t, i) => t + dec(lines[i].qty)) : coveredTerms;
      var pct = zero;
      final sorted = [...s.slabs]..sort((a, b) => dec(a.from).compareTo(dec(b.from)));
      for (final sl in sorted) {
        if (reached >= dec(sl.from)) pct = dec(sl.pct);
      }
      return byPct(pct);
    case 'buy_get':
      final buy = s.buy ?? 0, get = s.get ?? 0;
      if (buy < 1 || get < 1) return null;
      final pieces = <({int line, Decimal price})>[];
      for (final i in idx.where((x) => _whole(lines[x].qty))) {
        for (var n = 0; n < _floor(lines[i].qty); n++) {
          pieces.add((line: i, price: unit(i)));
        }
      }
      pieces.sort((a, b) {
        final c = b.price.compareTo(a.price);
        return c != 0 ? c : a.line - b.line;
      });
      final size = buy + get;
      final raw = <int, Decimal>{};
      final pct = dec(s.pct ?? '100');
      for (var g = 0; g + size <= pieces.length; g += size) {
        for (final p in pieces.sublist(g + buy, g + size)) {
          raw[p.line] = (raw[p.line] ?? zero) + _div(p.price * pct, Decimal.fromInt(100));
        }
      }
      final perLine = {for (final e in raw.entries) e.key: round2(e.value)};
      return _Candidate(perLine.values.fold(zero, (Decimal t, v) => t + v), perLine, idx);
  }
  return null;
}

class _Run {
  _Run(this.total, this.discounts, this.applied);
  final Decimal total;
  final List<Decimal> discounts;
  final List<Map<String, String>> applied;
}

_Run _run(List<SchemeLine> lines, List<Scheme> order, List<int> start, bool pricesIncludeTax) {
  final discounts = [for (final _ in lines) zero];
  final applied = <Map<String, String>>[];
  var free = start;
  var total = zero;
  for (final s in order) {
    final c = _evaluate(s, lines, free, pricesIncludeTax);
    if (c == null || c.total <= zero) continue;
    c.perLine.forEach((i, v) => discounts[i] += v);
    applied.add({'schemeId': s.id, 'name': s.name, 'discount': money(c.total)});
    total += c.total;
    free = free.where((i) => !c.uses.contains(i)).toList();
  }
  return _Run(total, discounts, applied);
}

/// Discount per line (money strings, in order) and the schemes applied.
({List<String> discounts, List<Map<String, String>> applied}) applySchemes(List<SchemeLine> lines, List<Scheme> schemes, String date, [String? time, bool pricesIncludeTax = false]) {
  final start = [for (var i = 0; i < lines.length; i++) if (dec(lines[i].qty) > zero) i];
  final touching = schemes.where((s) => s.activeOn(date, time) && _evaluate(s, lines, start, pricesIncludeTax) != null).toList();
  // Ranked schemes go first (a tie keeps the order given: List.sort is not stable, so ties are broken by position).
  final ranked = [for (var i = 0; i < touching.length; i++) if (touching[i].priority != null) (i, touching[i])]
    ..sort((a, b) => a.$2.priority != b.$2.priority ? a.$2.priority!.compareTo(b.$2.priority!) : a.$1.compareTo(b.$1));
  final rankedSchemes = [for (final r in ranked) r.$2];
  final unranked = touching.where((s) => s.priority == null).toList();
  late _Run best;
  if (touching.length <= 6) {
    best = _run(lines, rankedSchemes, start, pricesIncludeTax);
    void permute(List<Scheme> chosen, List<Scheme> rest) {
      if (rest.isEmpty) {
        final r = _run(lines, chosen, start, pricesIncludeTax);
        if (r.total > best.total) best = r;
        return;
      }
      for (var k = 0; k < rest.length; k++) {
        permute([...chosen, rest[k]], [...rest.sublist(0, k), ...rest.sublist(k + 1)]);
      }
    }

    permute(rankedSchemes, unranked);
  } else {
    final order = <Scheme>[...rankedSchemes];
    var free = start;
    for (final s in rankedSchemes) {
      final c = _evaluate(s, lines, free, pricesIncludeTax);
      if (c != null && c.total > zero) free = free.where((i) => !c.uses.contains(i)).toList();
    }
    var left = unranked;
    while (true) {
      Scheme? pick;
      _Candidate? pc;
      for (final s in left) {
        final c = _evaluate(s, lines, free, pricesIncludeTax);
        if (c != null && c.total > zero && (pc == null || c.total > pc.total)) {
          pick = s;
          pc = c;
        }
      }
      if (pick == null) break;
      order.add(pick);
      free = free.where((i) => !pc!.uses.contains(i)).toList();
      left = left.where((s) => s != pick).toList();
    }
    best = _run(lines, order, start, pricesIncludeTax);
  }
  return (discounts: [for (final d in best.discounts) money(d)], applied: best.applied);
}
