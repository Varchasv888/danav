import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/domain.dart';

/// The POS part of spec/fixtures/manufacturing-pos.json against the Dart port.
void main() {
  final f = jsonDecode(File('../../spec/fixtures/manufacturing-pos.json').readAsStringSync()) as Map<String, dynamic>;

  group('POS fixtures', () {
    for (final c in (f['posBills'] as List).cast<Map<String, dynamic>>()) {
      test('bill: ${c['name']}', () {
        final b = posBill([for (final l in c['lines'] as List) PosLineInput.fromJson(l as Map<String, dynamic>)], PosOptions.fromJson(c['options'] as Map<String, dynamic>));
        final e = Map<String, dynamic>.from(c['expect'] as Map);
        final lines = e.remove('lines') as List;
        e.forEach((k, v) => expect(b[k], v, reason: k));
        expect([
          for (final l in b['lines'] as List<Map<String, String>>) {'discount': l['discount'], 'taxable': l['taxable'], 'cgst': l['cgst'], 'total': l['total']},
        ], lines);
      });
    }
    for (final c in (f['payments'] as List).cast<Map<String, dynamic>>()) {
      test('payments: ${c['name']}', () {
        final ps = [for (final p in c['payments'] as List) PosPayment.fromJson(p as Map<String, dynamic>)];
        if (c['error'] != null) {
          expect(() => settlePayments(c['total'] as String, ps), throwsA(isA<PosError>().having((e) => e.code, 'code', c['error'])));
        } else {
          expect(settlePayments(c['total'] as String, ps), c['expect']);
        }
      });
    }
    test('loyalty', () {
      final l = f['loyalty'] as Map<String, dynamic>;
      final rule = LoyaltyRule.fromJson(l['rule'] as Map<String, dynamic>);
      for (final e in (l['earned'] as List).cast<Map<String, dynamic>>()) {
        expect(loyaltyEarned(e['paid'] as String, rule), e['expect']);
      }
      for (final r in (l['redeem'] as List).cast<Map<String, dynamic>>()) {
        expect(loyaltyRedeemable(r['balance'] as int, r['bill'] as String, rule), r['expect']);
      }
    });
    test('loyalty slabs and the minimum to redeem', () {
      final l = f['loyalty'] as Map<String, dynamic>;
      final rule = LoyaltyRule.fromJson(l['slabRule'] as Map<String, dynamic>);
      for (final e in (l['slabEarned'] as List).cast<Map<String, dynamic>>()) {
        expect(loyaltyEarned(e['paid'] as String, rule), e['expect']);
      }
      for (final r in (l['slabRedeem'] as List).cast<Map<String, dynamic>>()) {
        expect(loyaltyRedeemable(r['balance'] as int, r['bill'] as String, rule), r['expect']);
      }
    });
  });
}
