import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/domain.dart';

/// spec/fixtures/schemes.json against the Dart port.
void main() {
  final f = jsonDecode(File('../../spec/fixtures/schemes.json').readAsStringSync()) as Map<String, dynamic>;
  group('store schemes', () {
    for (final c in (f['cases'] as List).cast<Map<String, dynamic>>()) {
      test(c['name'] as String, () {
        final r = applySchemes(
          [for (final l in c['lines'] as List) SchemeLine.fromJson(l as Map<String, dynamic>)],
          [for (final s in c['schemes'] as List) Scheme.fromJson(s as Map<String, dynamic>)],
          c['date'] as String,
          c['time'] as String?,
        );
        final e = c['expect'] as Map<String, dynamic>;
        expect(r.discounts, (e['discounts'] as List).cast<String>());
        expect(r.applied, [for (final a in e['applied'] as List) (a as Map).cast<String, String>()]);
      });
    }
  });
}
