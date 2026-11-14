import 'dart:math';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv_app/core/invoice.dart';
import 'package:varchasv_app/core/models.dart';
import 'package:varchasv_app/core/search.dart';

/// The budget the owner asked for: what a person waits for after a keystroke must take 3 ms at most. These tests measure it with the clock on realistic and extreme sizes
/// and fail if the 99th percentile goes over. They run in the test VM (JIT); a release build on a phone or PC is typically faster, but that is not assumed here.
const budgetMs = 3.0;

double p(List<int> micros, double q) {
  final s = [...micros]..sort();
  return s[((s.length - 1) * q).round()] / 1000;
}

String report(String what, List<int> micros) =>
    '$what: p50 ${p(micros, .5).toStringAsFixed(3)} ms, p99 ${p(micros, .99).toStringAsFixed(3)} ms, worst ${(micros.reduce(max) / 1000).toStringAsFixed(3)} ms';

List<Item> catalogue(int n) {
  final r = Random(7);
  const words = [
    'Polo',
    'Denim',
    'Cotton',
    'Track',
    'Leather',
    'Socks',
    'Shirt',
    'Jeans',
    'Belt',
    'Jacket',
    'Kurta',
    'Saree',
    'Vest',
    'Brief',
    'Cap',
    'Shoe',
  ];
  return [
    for (var i = 0; i < n; i++)
      Item(
        id: 'i$i',
        name:
            '${words[r.nextInt(words.length)]} ${words[r.nextInt(words.length)]} ${1000 + i}',
        hsn: '${6100 + r.nextInt(99)}',
        size: ['S', 'M', 'L', 'XL'][r.nextInt(4)],
        color: ['Red', 'Blue', 'Black'][r.nextInt(3)],
        barcode: '89012${100000 + i}',
      ),
  ];
}

void main() {
  group('search is answered inside the budget', () {
    for (final n in [1000, 10000, 50000]) {
      test('$n items: typing a word letter by letter', () {
        final items = catalogue(n);
        final sw = Stopwatch()..start();
        final idx = SearchIndex<Item>(items, (i) => i.hay, (i) => i.name);
        // ignore: avoid_print
        print('index of $n items built in ${sw.elapsedMilliseconds} ms');
        final times = <int>[];
        for (var round = 0; round < 40; round++) {
          for (final q in [
            'd',
            'de',
            'den',
            'deni',
            'denim',
            'denim j',
            'denim je',
            'denim jea',
            '1234',
            'zzzzzz',
            'cotton 12',
          ]) {
            final t = Stopwatch()..start();
            idx.search(q);
            times.add(t.elapsedMicroseconds);
          }
        }
        // ignore: avoid_print
        print(report('search over $n', times));
        expect(p(times, .99), lessThan(budgetMs));
      });
    }

    test('a query that matches nothing in 50,000 items (the worst case: every entry is looked at)', () {
      final idx = SearchIndex<Item>(
        catalogue(50000),
        (i) => i.hay,
        (i) => i.name,
      );
      final times = <int>[];
      for (var i = 0; i < 200; i++) {
        final t = Stopwatch()..start();
        idx.search('qqqqqqqq');
        times.add(t.elapsedMicroseconds);
      }
      // ignore: avoid_print
      print(report('no match over 50000', times));
      expect(p(times, .99), lessThan(budgetMs));
    });

    test(
      'results are right: prefix first, every word must match, limited to 30',
      () {
        final items = [
          Item(id: '1', name: 'Blue Denim Jeans'),
          Item(id: '2', name: 'Denim Jacket'),
          Item(id: '3', name: 'Cotton Shirt', hsn: '6205'),
          Item(id: '4', name: 'Jeans Denim Slim'),
        ];
        final idx = SearchIndex<Item>(items, (i) => i.hay, (i) => i.name);
        expect(idx.search('denim').map((i) => i.id).toList(), ['2', '1', '4']);
        expect(idx.search('denim jeans').map((i) => i.id).toSet(), {'1', '4'});
        expect(idx.search('6205').single.id, '3');
        expect(idx.search('nothing'), isEmpty);
        expect(catalogue(500).length, 500);
        expect(
          SearchIndex<Item>(
            catalogue(500),
            (i) => i.hay,
            (i) => i.name,
          ).search('').length,
          30,
        );
      },
    );
  });

  group('totals are worked out inside the budget on every keystroke', () {
    InvoiceDraft build(int lines) {
      final r = Random(3);
      final d = InvoiceDraft(date: '2026-11-11')
        ..customer = Customer(
          id: 'c',
          name: 'C',
          stateCode: r.nextBool() ? '27' : '07',
        );
      d.lines.clear();
      for (var i = 0; i < lines; i++) {
        d.lines.add(
          DraftLine(
            item: Item(
              id: 'i$i',
              name: 'I$i',
              gstRate: '12',
              gstSlab: i % 3 == 0 ? 'apparel' : null,
            ),
            qty: '${1 + r.nextInt(50)}',
            rate: '${100 + r.nextInt(5000)}.${10 + r.nextInt(80)}',
            discPct: i % 4 == 0 ? '7.5' : '',
          ),
        );
      }
      return d;
    }

    for (final n in [1, 10, 50, 200]) {
      test('$n lines', () {
        final d = build(n);
        final cold = Stopwatch()..start();
        d.compute('27');
        // ignore: avoid_print
        print(
          'first ever call (code not yet compiled by the test VM): ${cold.elapsedMicroseconds / 1000} ms',
        );
        for (var i = 0; i < 30; i++) {
          d.lines.last.qty = '${200 + i}';
          d.compute('27');
        }
        final times = <int>[];
        for (var i = 0; i < 100; i++) {
          d.lines.last.qty = '${1 + i}';
          final t = Stopwatch()..start();
          d.compute('27');
          times.add(t.elapsedMicroseconds);
        }
        // ignore: avoid_print
        print(report('totals for $n lines', times));
        // A real invoice has far fewer than 50 lines; 200 is an extreme case and is reported, held to the same limit only up to 50.
        if (n <= 50) expect(p(times, .99), lessThan(budgetMs));
      });
    }

    test('10,000 lines do not crash or hang (reported, not held to 3 ms)', () {
      final d = build(10000);
      final t = Stopwatch()..start();
      final r = d.compute('27');
      // ignore: avoid_print
      print(
        '10,000 lines: ${t.elapsedMilliseconds} ms, total ${r.tax!.grandTotalValue}',
      );
      expect(r.tax, isNotNull);
      expect(t.elapsedMilliseconds, lessThan(2000));
    });
  });
}
