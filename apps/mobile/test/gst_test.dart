import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv_app/core/format.dart';
import 'package:varchasv_app/core/gst.dart';
import 'package:varchasv_app/core/money.dart';

void main() {
  group('GST arithmetic agrees with the server to the paisa', () {
    final cases = jsonDecode(
      File('test/fixtures/tax_vectors.json').readAsStringSync(),
    ) as List<dynamic>;

    test('1,500 random invoices (all supply kinds, union territories, LUT, reverse charge, round off on and off)', () {
      var checked = 0;
      for (final raw in cases) {
        final c = raw as Map<String, dynamic>;
        final ctx = c['ctx'] as Map<String, dynamic>;
        final tax = computeInvoiceTax(
          [
            for (final l in c['lines'] as List<dynamic>)
              LineInput(
                qty: l['qty'],
                rate: l['rate'],
                discount: l['discount'],
                gstRate: l['gstRate'],
                cessRate: l['cessRate'],
              ),
          ],
          TaxContext(
            supplierState: ctx['supplierState'],
            placeOfSupply: ctx['placeOfSupply'],
            sez: ctx['sez'],
            lut: ctx['lut'],
            reverseCharge: ctx['reverseCharge'],
            roundOff: ctx['roundOff'],
          ),
        );
        final e = c['expected'] as Map<String, dynamic>;
        final where = jsonEncode(c);
        expect(paiseToString(tax.taxable), e['taxableValue'], reason: where);
        expect(paiseToString(tax.cgst), e['cgst'], reason: where);
        expect(paiseToString(tax.sgst), e['sgst'], reason: where);
        expect(paiseToString(tax.utgst), e['utgst'], reason: where);
        expect(paiseToString(tax.igst), e['igst'], reason: where);
        expect(paiseToString(tax.cess), e['cess'], reason: where);
        expect(paiseToString(tax.taxCharged), e['taxCharged'], reason: where);
        expect(paiseToString(tax.roundOff), e['roundOff'], reason: where);
        expect(paiseToString(tax.grandTotal), e['grandTotal'], reason: where);
        final lines = e['lines'] as List<dynamic>;
        for (var i = 0; i < lines.length; i++) {
          expect(
            paiseToString(tax.lines[i].taxable),
            lines[i]['taxableValue'],
            reason: where,
          );
          expect(
            paiseToString(tax.lines[i].total),
            lines[i]['total'],
            reason: where,
          );
        }
        checked++;
      }
      expect(checked, cases.length);
    });

    test('a discount larger than the line is refused, as on the server', () {
      expect(
        () => computeLineTax(
          const LineInput(qty: '1', rate: '10', discount: '11', gstRate: '18'),
          const TaxContext(supplierState: '27', placeOfSupply: '27'),
        ),
        throwsFormatException,
      );
    });
  });

  group('numbers and words agree with the server', () {
    final v = jsonDecode(
      File('test/fixtures/format_vectors.json').readAsStringSync(),
    ) as Map<String, dynamic>;
    test('Indian digit grouping', () {
      for (final f in v['fmt'] as List<dynamic>) {
        expect(
          formatIndian(f['amount'], f['decimals']),
          f['expected'],
          reason: '${f['amount']} / ${f['decimals']}',
        );
      }
    });
    test('amount in words', () {
      for (final w in v['words'] as List<dynamic>) {
        expect(amountInWords(w['amount']), w['expected'], reason: w['amount']);
      }
    });
  });

  group('money parsing', () {
    test('rounds half up and refuses text', () {
      expect(parseScaled('1.005', 2), BigInt.from(101));
      expect(parseScaled('-1.005', 2), BigInt.from(-101));
      expect(parseScaled('12', 2), BigInt.from(1200));
      expect(parseScaled('1,234.5', 2), BigInt.from(123450));
      expect(() => parseScaled('abc', 2), throwsFormatException);
      expect(() => parseScaled('', 2), throwsFormatException);
    });
  });
}
