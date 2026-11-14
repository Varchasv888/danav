import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/domain.dart';

/// spec/fixtures/gst-slab.json against the Dart port.
void main() {
  final f = jsonDecode(File('../../spec/fixtures/gst-slab.json').readAsStringSync()) as Map<String, dynamic>;
  List<Map<String, dynamic>> cases(String k) => (f[k] as List).cast<Map<String, dynamic>>();

  group('price-based GST', () {
    for (final c in cases('slabRate')) {
      test('rate ${c['slab']} ${c['date']} ${c['value']}', () => expect(slabRate(c['slab'] as String, c['date'] as String, c['value'] as String), c['expect']));
    }
    for (final c in cases('inclusive')) {
      test('inclusive ${c['slab']} ${c['date']} ${c['price']}', () => expect(slabRateInclusive(c['slab'] as String, c['date'] as String, c['price'] as String), c['expect']));
    }
    for (final c in cases('ambiguous')) {
      test('ambiguous ${c['price']}', () => expect(slabAmbiguous(c['slab'] as String, c['date'] as String, c['price'] as String), c['expect']));
    }
    for (final c in cases('lineRate')) {
      test(c['name'] as String, () {
        final item = c['item'] as Map<String, dynamic>;
        final line = c['line'] as Map<String, dynamic>;
        expect(
          lineGstRate(
            gstRate: item['gstRate'] as String, gstSlab: item['gstSlab'] as String?, slabPieces: item['slabPieces'] as int?,
            qty: line['qty'] as String, rate: line['rate'] as String, discount: (line['discount'] ?? '0') as String,
            date: c['date'] as String, inclusive: c['inclusive'] as bool? ?? false,
          ),
          c['expect'],
        );
      });
    }
    for (final c in cases('posBill')) {
      test(c['name'] as String, () {
        final b = posBill([for (final l in c['lines'] as List) PosLineInput.fromJson(l as Map<String, dynamic>)], PosOptions.fromJson(c['options'] as Map<String, dynamic>));
        expect([for (final l in b['lines'] as List<Map<String, String>>) l['gstRate']], c['expectRates']);
      });
    }
  });
}
