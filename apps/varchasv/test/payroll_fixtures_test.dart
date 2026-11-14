import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/domain.dart';

/// spec/fixtures/payroll.json against the Dart port — the same cases packages/domain runs.
void main() {
  final f = jsonDecode(File('../../spec/fixtures/payroll.json').readAsStringSync()) as Map<String, dynamic>;
  List<Map<String, dynamic>> cases(String k) => (f[k] as List).cast<Map<String, dynamic>>();

  group('payroll fixtures', () {
    for (final c in cases('pfWages')) {
      test('PF wages: ${c['name']}', () => expect(pfWages(c['wageComponents'] as String, c['gross'] as String, c['labourCode'] as bool), c['expect']));
    }
    for (final c in cases('pf')) {
      test('PF: ${c['name']}', () => expect(pfContribution(c['wages'] as String, PfSetup.fromJson(c['setup'] as Map<String, dynamic>)), c['expect']));
    }
    for (final c in cases('esi')) {
      test('ESI: ${c['name']}', () => expect(esiContribution(c['wages'] as String, c['paidDays'] as int, c['covered'] as bool), c['expect']));
    }
    test('ESI periods and coverage', () {
      for (final c in cases('esiPeriods')) {
        expect(esiPeriodStart(c['date'] as String), c['expect']);
      }
      for (final c in cases('esiCoverage')) {
        expect(esiCovered(c['gross'] as String, disabled: c['disabled'] as bool), c['expect']);
      }
    });
    for (final c in cases('pt')) {
      test('PT: ${c['state']} ${c['gender']} ${c['gross']} m${c['month']}',
          () => expect(professionalTax(c['state'] as String, c['gender'] as String, c['gross'] as String, c['month'] as int), c['expect']));
    }
    for (final c in cases('incomeTax')) {
      test('income tax: ${c['name']}',
          () => expect(incomeTax(c['fy'] as String, c['regime'] as String, c['income'] as String, age: c['age'] as int), c['expect']));
    }
    for (final c in cases('salaryTax')) {
      test('salary tax: ${c['name']}', () {
        final r = salaryTax(c['input'] as Map<String, dynamic>);
        (c['expect'] as Map<String, dynamic>).forEach((k, v) => expect(r[k], v, reason: k));
      });
    }
    test('monthly TDS', () {
      for (final c in cases('monthlyTds')) {
        expect(monthlyTds(c['annualTax'] as String, c['deductedSoFar'] as String, monthsLeftInFy(c['month'] as int)), c['expect']);
      }
      expect([4, 9, 12, 1, 3].map(monthsLeftInFy).toList(), [12, 7, 4, 3, 1]);
    });
    for (final c in cases('payslips')) {
      test('payslip: ${c['name']}', () {
        final p = computePayslip(c['input'] as Map<String, dynamic>);
        final pf = p['pf'] as Map<String, String>;
        expect({
          'paidDays': p['paidDays'],
          'earned': (p['earnings'] as List).map((e) => (e as Map)['earned']).toList(),
          'gross': p['gross'],
          'pfWages': p['pfWages'],
          'pfEmployee': pf['employee'],
          'eps': pf['eps'],
          'employerEpf': pf['employerEpf'],
          'esiEmployee': (p['esi'] as Map)['employee'],
          'pt': p['pt'],
          'lwfEmployee': (p['lwf'] as Map)['employee'],
          'totalDeductions': p['totalDeductions'],
          'netPay': p['netPay'],
          'employerContributions': p['employerContributions'],
          'costToCompany': p['costToCompany'],
        }, c['expect']);
      });
    }
    for (final c in cases('gratuity')) {
      test('gratuity: ${c['name']}', () => expect(
          gratuity(c['wages'] as String, c['joined'] as String, c['left'] as String, fixedTerm: c['fixedTerm'] as bool), c['expect']));
    }
    for (final c in cases('arrears')) {
      test('arrears: ${c['name']}', () => expect(
          arrearsFor((c['paid'] as List).cast<Map<String, dynamic>>(), (c['revised'] as List).cast<Map<String, dynamic>>(), c['paidDays'] as String, c['daysInMonth'] as int), c['expect']));
    }
    test('leave encashment', () {
      for (final c in cases('leaveEncashment')) {
        expect(leaveEncashment(c['days'] as String, c['wages'] as String, divisor: c['divisor'] as int), c['expect']);
      }
    });
  });
}
