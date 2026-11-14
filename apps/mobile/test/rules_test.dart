import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv_app/core/dates.dart';
import 'package:varchasv_app/core/invoice.dart';
import 'package:varchasv_app/core/models.dart';
import 'package:varchasv_app/core/slab.dart';

import 'support.dart';

void main() {
  group('slab rate agrees with the server', () {
    test(
      '3,000 random lines around the thresholds, before and after 22 Sep 2025',
      () {
        final cases = jsonDecode(
          File('test/fixtures/slab_vectors.json').readAsStringSync(),
        ) as List<dynamic>;
        for (final raw in cases) {
          final c = raw as Map<String, dynamic>;
          final it = c['item'] as Map<String, dynamic>;
          final l = c['line'] as Map<String, dynamic>;
          final got = lineGstRate(
            Item(
              id: 'x',
              name: 'x',
              gstRate: '${it['gstRate']}',
              gstSlab: it['gstSlab'] as String?,
              slabPieces: it['slabPieces'] as int,
            ),
            qty: l['qty'],
            rate: l['rate'],
            discount: l['discount'],
            date: c['date'],
          );
          expect(
            num.parse(got),
            num.parse(c['expected'] as String),
            reason: jsonEncode(c),
          );
        }
      },
    );
  });

  group('date typing matches the web app', () {
    const today = '2026-11-11';
    String? p(String s) => parseDateText(s, today);
    test('shortcuts', () {
      expect(p('t'), '2026-11-11');
      expect(p('y'), '2026-11-10');
      expect(p('+3'), '2026-11-14');
      expect(p('-11'), '2026-10-31');
      expect(p('e'), '2026-11-30');
    });
    test('digits and month names', () {
      expect(p('05'), '2026-11-05');
      expect(p('0512'), '2026-12-05');
      expect(p('05/12'), '2026-12-05');
      expect(p('051226'), '2026-12-05');
      expect(p('5-12-25'), '2025-12-05');
      expect(p('05122027'), '2027-12-05');
      expect(p('5 dec'), '2026-12-05');
      expect(p('5 Dec 2027'), '2027-12-05');
      expect(p('2026-02-28'), '2026-02-28');
    });
    test('what is not a date', () {
      expect(p('31/02'), isNull);
      expect(p('hello'), isNull);
      expect(p(''), isNull);
      expect(p('1313'), isNull);
    });
    test('display and zero text', () {
      expect(showDate('2026-11-01'), '1 Nov 2026');
      expect(isZeroText('0'), isTrue);
      expect(isZeroText('0.00'), isTrue);
      expect(isZeroText('₹ 0'), isTrue);
      expect(isZeroText('10'), isFalse);
      expect(isZeroText(''), isFalse);
    });
  });

  group('invoice draft', () {
    test('a half typed line is ignored, a complete one is counted', () {
      final d = InvoiceDraft(date: '2026-11-11')
        ..customer = Customer(id: 'c', name: 'C', stateCode: '27');
      d.lines.first
        ..item = item('a', 'A')
        ..qty = '2';
      expect(d.compute('27').tax, isNull);
      expect(d.canSave, isFalse);
      d.lines.first.rate = '100';
      final r = d.compute('27');
      expect(r.tax!.taxable.toInt(), 20000);
      expect(r.tax!.cgst.toInt(), 1200);
      expect(r.tax!.grandTotalValue, '224.00');
      expect(d.canSave, isTrue);
    });

    test('another state means IGST, same state means CGST and SGST', () {
      final d = InvoiceDraft(date: '2026-11-11')
        ..customer = Customer(id: 'c', name: 'C', stateCode: '07');
      d.lines.first
        ..item = item('a', 'A')
        ..qty = '1'
        ..rate = '1000';
      final t = d.compute('27').tax!;
      expect(t.igst.toInt(), 12000);
      expect(t.cgst.toInt(), 0);
    });

    test('percent discount is turned into rupees to the paisa', () {
      final l = DraftLine(
        item: item('a', 'A'),
        qty: '3',
        rate: '333.33',
        discPct: '12.5',
      );
      expect(l.discountAmount(), '125.00');
    });

    test('the slab rate follows the price per piece', () {
      final apparel = item('a', 'A', slab: 'apparel');
      expect(
        DraftLine(item: apparel, qty: '1', rate: '2400').gstRate('2026-11-11'),
        '5',
      );
      expect(
        DraftLine(item: apparel, qty: '1', rate: '2600').gstRate('2026-11-11'),
        '18',
      );
      expect(
        DraftLine(
          item: apparel,
          qty: '1',
          rate: '2600',
          gstOverride: '12',
        ).gstRate('2026-11-11'),
        '12',
      );
    });

    test('the payload carries only complete lines', () {
      final d = InvoiceDraft(date: '2026-11-11')
        ..customer = Customer(id: 'c9', name: 'C');
      d.lines.first
        ..item = item('a', 'A')
        ..qty = '2'
        ..rate = '50';
      d.lines.add(DraftLine(item: item('b', 'B')));
      final p = d.payload();
      expect((p['lines'] as List).length, 1);
      expect(p['customerId'], 'c9');
      expect(p['date'], '2026-11-11');
    });

    test('absurd sizes are refused: ten digit quantities and totals beyond 1,000 crore', () {
      final d = InvoiceDraft(date: '2026-11-11')
        ..customer = Customer(id: 'c', name: 'C', stateCode: '27');
      d.lines.first
        ..item = item('a', 'A')
        ..qty = '12345678901'
        ..rate = '10';
      expect(d.lines.first.isValid, isFalse);
      d.lines.first
        ..qty = '999999999'
        ..rate = '999999999';
      final r = d.compute('27');
      expect(r.tax, isNull);
      expect(r.error, contains('too large'));
      d.lines.first
        ..qty = '10'
        ..rate = '999999999';
      expect(d.compute('27').error, isNull);
    });

    test(
      'a discount larger than the line is refused with a message, not a crash',
      () {
        final d = InvoiceDraft(date: '2026-11-11')
          ..customer = Customer(id: 'c', name: 'C', stateCode: '27');
        d.lines.first
          ..item = item('a', 'A')
          ..qty = '1'
          ..rate = '10'
          ..discPct = '150';
        final r = d.compute('27');
        expect(r.tax, isNull);
        expect(r.error, isNotNull);
      },
    );
  });
}
