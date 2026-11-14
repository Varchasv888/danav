import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/domain.dart';

/// Runs the shared spec/fixtures against the Dart port — the same cases the TypeScript
/// domain package runs, so the offline app and the cloud always agree.
Map<String, dynamic> fixture(String name) =>
    jsonDecode(File('../../spec/fixtures/$name').readAsStringSync()) as Map<String, dynamic>;

void main() {
  group('GST fixtures', () {
    for (final c in (fixture('gst.json')['cases'] as List).cast<Map<String, dynamic>>()) {
      test(c['name'], () {
        final lines = (c['lines'] as List).map((l) => LineInput.fromJson(l as Map<String, dynamic>)).toList();
        final result = computeInvoiceTax(lines, TaxContext.fromJson(c['ctx'] as Map<String, dynamic>));
        expect(result.toTotals(), Map<String, String>.from(c['expect'] as Map));
      });
    }
  });

  group('GSTIN fixtures', () {
    for (final c in (fixture('gstin.json')['cases'] as List).cast<Map<String, dynamic>>()) {
      test(c['gstin'], () => expect(gstinError(c['gstin'] as String) ?? 'valid', c['expect']));
    }
  });

  group('amount in words fixtures', () {
    final f = fixture('words.json');
    for (final w in (f['words'] as List).cast<Map<String, dynamic>>()) {
      test('${w['lang']} ${w['amount']}', () => expect(amountInWords(w['amount'] as String, w['lang'] as String), w['expect']));
    }
    for (final g in (f['grouping'] as List).cast<Map<String, dynamic>>()) {
      test('groups ${g['amount']}', () => expect(formatIndian(g['amount'] as String), g['expect']));
    }
  });

  group('fiscal year and numbering fixtures', () {
    final f = fixture('fiscal-numbering.json');
    for (final c in (f['fiscalYear'] as List).cast<Map<String, dynamic>>()) {
      test('FY of ${c['date']}', () {
        final fy = fiscalYearOf(c['date'] as String);
        final e = c['expect'] as Map<String, dynamic>;
        expect([fy.start, fy.end, fy.label, fy.short], [e['start'], e['end'], e['label'], e['short']]);
      });
    }
    for (final c in (f['format'] as List).cast<Map<String, dynamic>>()) {
      test('formats ${c['expect']}', () {
        final p = c['parts'] as Map<String, dynamic>;
        expect(
          formatDocumentNumber(c['pattern'] as String,
              fyShort: p['fyShort'] as String, fyLabel: p['fyLabel'] as String, seq: p['seq'] as int, device: p['device'] as String?),
          c['expect'],
        );
      });
    }
    for (final c in (f['seriesCheck'] as List).cast<Map<String, dynamic>>()) {
      test('checks ${c['pattern']}', () => expect(checkSeriesPattern(c['pattern'] as String), c['expect']));
    }
  });

  group('voucher fixtures', () {
    for (final c in (fixture('vouchers.json')['cases'] as List).cast<Map<String, dynamic>>()) {
      test(c['name'], () {
        final lines = (c['lines'] as List).map((l) => VoucherLine.fromJson(l as Map<String, dynamic>)).toList();
        expect(validateVoucher(c['type'] as String, lines), List<String>.from(c['expectErrors'] as List));
      });
    }
  });

  group('stock valuation fixtures', () {
    for (final c in (fixture('stock.json')['cases'] as List).cast<Map<String, dynamic>>()) {
      test(c['name'], () {
        final moves = (c['moves'] as List).map((m) => StockMove.fromJson(m as Map<String, dynamic>)).toList();
        final r = valueStock(moves, c['method'] as String);
        final e = c['expect'] as Map<String, dynamic>;
        expect([r.qty, r.value, r.moves.map((m) => m.valueChange).toList()], [e['qty'], e['value'], List<String>.from(e['valueChanges'] as List)]);
      });
    }
  });

  group('journal fixtures', () {
    for (final c in (fixture('journal.json')['cases'] as List).cast<Map<String, dynamic>>()) {
      test(c['name'], () {
        final lines = (c['lines'] as List).map((l) => JournalLine.fromJson(l as Map<String, dynamic>)).toList();
        expect(validateJournal(lines), List<String>.from(c['expectErrors'] as List));
      });
    }
  });
}
