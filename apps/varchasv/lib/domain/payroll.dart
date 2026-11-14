import 'package:decimal/decimal.dart';

import 'money.dart';

/// Port of packages/domain/src/payroll.ts: PF, ESI, professional tax, LWF, income tax on salary,
/// payslips, gratuity and leave encashment. Must match spec/fixtures/payroll.json exactly.

Decimal _div(Decimal a, Object b) => (a / dec(b)).toDecimal(scaleOnInfinitePrecision: 20);
Decimal _pct(Object v, String rate) => _div(dec(v) * dec(rate), 100);
Decimal _rupee(Object v) => dec(v).round();
Decimal _rupeeUp(Object v) => dec(v).ceil();
Decimal _min(Decimal a, Object b) => a < dec(b) ? a : dec(b);
Decimal _max0(Decimal a) => a > zero ? a : zero;
String _r(Object v) => money(_rupee(v));

const pfWageCeiling = '15000';
const esiWageCeiling = '21000';

class PfSetup {
  const PfSetup({required this.member, required this.epsEligible, required this.onActualWages});
  final bool member;
  final bool epsEligible;
  final bool onActualWages;
  factory PfSetup.fromJson(Map<String, dynamic> j) =>
      PfSetup(member: j['member'] as bool, epsEligible: j['epsEligible'] as bool, onActualWages: j['onActualWages'] as bool);
}

/// PF wages under the Code on Social Security: at least half of gross when the labour codes apply.
String pfWages(Object wageComponents, Object gross, bool labourCode) {
  final w = dec(wageComponents);
  final half = _div(dec(gross), 2);
  return money(_rupee(labourCode && w < half ? half : w));
}

Map<String, String> pfContribution(Object wages, PfSetup s) {
  if (!s.member) {
    return {for (final k in ['epfWages', 'epsWages', 'edliWages', 'employee', 'eps', 'employerEpf', 'edli', 'admin']) k: '0.00'};
  }
  final w = dec(wages);
  final capped = _min(w, pfWageCeiling);
  final base = s.onActualWages ? w : capped;
  final employee = _rupee(_pct(base, '12'));
  final employerTotal = _rupee(_pct(base, '12'));
  final eps = s.epsEligible ? _rupee(_pct(capped, '8.33')) : zero;
  return {
    'epfWages': money(base),
    'epsWages': money(s.epsEligible ? capped : zero),
    'edliWages': money(capped),
    'employee': money(employee),
    'eps': money(eps),
    'employerEpf': money(employerTotal - eps),
    'edli': _r(_pct(capped, '0.5')),
    'admin': _r(_pct(base, '0.5')),
  };
}

String esiPeriodStart(String isoDate) {
  final y = int.parse(isoDate.substring(0, 4));
  final m = int.parse(isoDate.substring(5, 7));
  if (m >= 4 && m <= 9) return '$y-04-01';
  return m >= 10 ? '$y-10-01' : '${y - 1}-10-01';
}

bool esiCovered(Object monthlyGross, {bool disabled = false}) => dec(monthlyGross) <= dec(disabled ? '25000' : esiWageCeiling);

Map<String, String> esiContribution(Object wages, num paidDays, bool covered) {
  final w = dec(wages);
  if (!covered || w <= zero) return {'wages': '0.00', 'employee': '0.00', 'employer': '0.00'};
  final lowWage = paidDays > 0 && _div(w, paidDays.toString()) <= dec('176');
  return {
    'wages': money(w),
    'employee': money(lowWage ? zero : _rupeeUp(_pct(w, '0.75'))),
    'employer': money(_rupeeUp(_pct(w, '3.25'))),
  };
}

typedef _Slab = (int?, int);

class _PtRule {
  const _PtRule(this.slabs, {this.femaleSlabs, this.february});
  final List<_Slab> slabs;
  final List<_Slab>? femaleSlabs;
  final int? february;
}

const Map<String, _PtRule> _ptRules = {
  '27': _PtRule([(7500, 0), (10000, 175), (null, 200)], femaleSlabs: [(25000, 0), (null, 200)], february: 300),
  '29': _PtRule([(24999, 0), (null, 200)], february: 300),
  '19': _PtRule([(10000, 0), (15000, 110), (25000, 130), (40000, 150), (null, 200)]),
  '24': _PtRule([(11999, 0), (null, 200)]),
  '36': _PtRule([(15000, 0), (20000, 150), (null, 200)]),
  '37': _PtRule([(15000, 0), (20000, 150), (null, 200)]),
};

String professionalTax(String stateCode, String gender, Object monthlyGross, int month) {
  final rule = _ptRules[stateCode];
  if (rule == null) return '0.00';
  final slabs = gender == 'female' && rule.femaleSlabs != null ? rule.femaleSlabs! : rule.slabs;
  final g = dec(monthlyGross);
  final amount = slabs.firstWhere((s) => s.$1 == null || g <= Decimal.fromInt(s.$1!)).$2;
  return money(Decimal.fromInt(amount > 0 && month == 2 && rule.february != null ? rule.february! : amount));
}

class LwfSetup {
  const LwfSetup({required this.employee, required this.employer, required this.months});
  final String employee;
  final String employer;
  final List<int> months;
  factory LwfSetup.fromJson(Map<String, dynamic> j) =>
      LwfSetup(employee: j['employee'] as String, employer: j['employer'] as String, months: (j['months'] as List).cast<int>());
}

Map<String, String> lwfFor(LwfSetup? s, int month) => s != null && s.months.contains(month)
    ? {'employee': money(s.employee), 'employer': money(s.employer)}
    : {'employee': '0.00', 'employer': '0.00'};

// ---- income tax ---------------------------------------------------------------------------------

class _Regime {
  const _Regime(this.slabs, this.standardDeduction, this.rebateUpTo, this.rebateMax, this.marginalRebate, this.surcharge);
  final List<_Slab> slabs;
  final int standardDeduction;
  final int rebateUpTo;
  final int rebateMax;
  final bool marginalRebate;
  final List<(int, int)> surcharge;
}

const _newRegime = _Regime([(400000, 0), (800000, 5), (1200000, 10), (1600000, 15), (2000000, 20), (2400000, 25), (null, 30)], 75000, 1200000, 60000, true,
    [(5000000, 10), (10000000, 15), (20000000, 25)]);
const _oldRegime = _Regime([(250000, 0), (500000, 5), (1000000, 20), (null, 30)], 50000, 500000, 12500, false,
    [(5000000, 10), (10000000, 15), (20000000, 25), (50000000, 37)]);
// FY 2024-25: the 7 lakh rebate, and the 75,000 standard deduction for the whole year.
const _newRegime2024 = _Regime([(300000, 0), (700000, 5), (1000000, 10), (1200000, 15), (1500000, 20), (null, 30)], 75000, 700000, 25000, true,
    [(5000000, 10), (10000000, 15), (20000000, 25)]);
const Map<String, Map<String, _Regime>> _taxTables = {
  '2024-25': {'new': _newRegime2024, 'old': _oldRegime},
  '2025-26': {'new': _newRegime, 'old': _oldRegime},
  '2026-27': {'new': _newRegime, 'old': _oldRegime},
};

_Regime _table(String fy, String regime) => _taxTables[fy]?[regime] ?? (throw ArgumentError('no tax table for FY $fy'));
Decimal _nearest10(Decimal v) => _div(v, 10).round() * Decimal.fromInt(10);

Decimal _slabTax(Decimal income, List<_Slab> slabs) {
  var tax = zero;
  var lower = 0;
  for (final (upTo, rate) in slabs) {
    final top = upTo == null ? income : _min(income, upTo);
    if (top > Decimal.fromInt(lower)) tax += _pct(top - Decimal.fromInt(lower), '$rate');
    if (upTo == null || income <= Decimal.fromInt(upTo)) break;
    lower = upTo;
  }
  return tax;
}

List<_Slab> _slabsFor(String regime, _Regime t, int age) {
  if (regime != 'old' || age < 60) return t.slabs;
  final basic = age >= 80 ? 500000 : 300000;
  return [(basic, 0), ...t.slabs.skip(1).where((s) => s.$1 == null || s.$1! > basic)];
}

Map<String, String> incomeTax(String fy, String regime, Object taxableIncome, {int age = 30}) {
  final t = _table(fy, regime);
  final income = _nearest10(_max0(dec(taxableIncome)));
  final slabs = _slabsFor(regime, t, age);
  final base = _slabTax(income, slabs);
  var rebate = zero;
  if (income <= Decimal.fromInt(t.rebateUpTo)) {
    rebate = _min(base, t.rebateMax);
  } else if (t.marginalRebate && base > income - Decimal.fromInt(t.rebateUpTo)) {
    rebate = base - (income - Decimal.fromInt(t.rebateUpTo));
  }
  final tax = base - rebate;
  var surcharge = zero;
  final bands = t.surcharge.where((b) => income > Decimal.fromInt(b.$1)).toList();
  if (bands.isNotEmpty) {
    final (over, rate) = bands.last;
    surcharge = _pct(tax, '$rate');
    final lowerBands = t.surcharge.where((b) => b.$1 < over).toList();
    final prevRate = lowerBands.isEmpty ? 0 : lowerBands.last.$2;
    final atThreshold = _div(_slabTax(Decimal.fromInt(over), slabs) * Decimal.fromInt(100 + prevRate), 100);
    final cap = atThreshold + (income - Decimal.fromInt(over));
    if (tax + surcharge > cap) surcharge = _max0(cap - tax);
  }
  final cess = _pct(tax + surcharge, '4');
  return {
    'taxableIncome': money(income),
    'tax': money(base),
    'rebate': money(rebate),
    'surcharge': money(surcharge),
    'cess': money(cess),
    'total': money(_nearest10(tax + surcharge + cess)),
  };
}

/// Taxable salary income as the employer computes it for TDS. Keys match salaryTax() in TypeScript.
Map<String, String> salaryTax(Map<String, dynamic> i) {
  String s(String k) => (i[k] ?? '0').toString();
  final d = (i['deductions'] as Map<String, dynamic>?) ?? const {};
  String dd(String k) => (d[k] ?? '0').toString();
  final regime = i['regime'] as String;
  final t = _table(i['fy'] as String, regime);
  final old = regime == 'old';
  final salary = dec(s('annualSalary')) + dec(s('previousEmployerSalary'));
  final basicDa = dec(s('annualBasicDa'));
  final hraExempt = old
      ? _max0(_min(_min(dec(s('annualHra')), _max0(dec(s('rentPaid')) - _pct(basicDa, '10'))), _pct(basicDa, (i['metro'] as bool) ? '50' : '40')))
      : zero;
  final standard = _min(salary, t.standardDeduction);
  final pt = old ? _min(dec(s('professionalTax')), 2500) : zero;
  final netSalary = _max0(salary - hraExempt - standard - pt);
  final homeLoan = old ? _min(dec(dd('homeLoanInterest')), 200000) : zero;
  final grossTotal = _max0(netSalary + dec(s('otherIncome')) - homeLoan);
  final chapterVIA = old
      ? _min(dec(dd('c80')) + dec(s('employeePf')), 150000) + _min(dec(dd('ccd1b')), 50000) + _min(dec(dd('d80')), 100000) + dec(dd('other'))
      : zero;
  final taxable = _max0(grossTotal - chapterVIA);
  final tax = incomeTax(i['fy'] as String, regime, taxable, age: i['age'] as int)..remove('taxableIncome');
  return {
    'salary': money(salary),
    'hraExempt': money(hraExempt),
    'standardDeduction': money(standard),
    'professionalTax': money(pt),
    'houseProperty': money(-homeLoan),
    'chapterVIA': money(chapterVIA),
    'taxableIncome': money(taxable),
    ...tax,
  };
}

String monthlyTds(Object annualTax, Object deductedSoFar, int monthsLeft) {
  if (monthsLeft < 1) throw ArgumentError('monthsLeft must be at least 1');
  return _r(_div(_max0(dec(annualTax) - dec(deductedSoFar)), monthsLeft));
}

int monthsLeftInFy(int month) => month >= 4 ? 16 - month : 4 - month;

// ---- payslip ------------------------------------------------------------------------------------------

/// One month's pay. `input` has the same shape as PayslipInput in TypeScript.
Map<String, dynamic> computePayslip(Map<String, dynamic> p) {
  final days = p['daysInMonth'] as int;
  final lop = dec(p['lopDays'].toString());
  if (lop < zero || lop > Decimal.fromInt(days)) throw ArgumentError('lopDays out of range');
  final paidDays = Decimal.fromInt(days) - lop;
  final month = p['month'] as int;
  final earnings = (p['components'] as List).cast<Map<String, dynamic>>().map((c) => {
        'code': c['code'],
        'name': c['name'],
        'monthly': money(c['monthly'] as String),
        'earned': _r(_div(dec(c['monthly'] as String) * paidDays, days)),
        'pfWage': c['pfWage'] == true,
        'esiExcluded': c['esiExcluded'] == true,
        'hra': c['hra'] == true,
        'extra': false,
      }).toList();
  for (final x in ((p['extraEarnings'] as List?) ?? const []).cast<Map<String, dynamic>>()) {
    earnings.add({
      'code': x['code'],
      'name': x['name'],
      'monthly': '0.00',
      'earned': _r(x['amount'].toString()),
      'pfWage': x['pfWage'] == true,
      'esiExcluded': x['esiExcluded'] == true,
      'hra': false,
      'extra': true,
    });
  }
  Decimal total(bool Function(Map<String, dynamic>) f) => earnings.where(f).fold(zero, (s, e) => s + dec(e['earned'] as String));
  final gross = total((_) => true);
  final pfW = pfWages(total((e) => e['pfWage'] as bool), gross, p['labourCodeWages'] as bool);
  final pf = pfContribution(pfW, PfSetup.fromJson(p['pf'] as Map<String, dynamic>));
  final esi = esiContribution(total((e) => !(e['esiExcluded'] as bool)), paidDays.toDouble(), p['esiCovered'] as bool);
  final ptIn = p['pt'] as Map<String, dynamic>;
  final pt = professionalTax(ptIn['stateCode'] as String, ptIn['gender'] as String, gross, month);
  final lwf = lwfFor(p['lwf'] == null ? null : LwfSetup.fromJson(p['lwf'] as Map<String, dynamic>), month);
  final tds = _r(p['tds'].toString());
  final others = ((p['otherDeductions'] as List?) ?? const [])
      .cast<Map<String, dynamic>>()
      .map((o) => {'name': o['name'], 'amount': _r(o['amount'].toString())})
      .toList();
  final deductions = sumOf([pf['employee']!, esi['employee']!, pt, lwf['employee']!, tds, ...others.map((o) => o['amount'] as String)]);
  final employer = sumOf([pf['eps']!, pf['employerEpf']!, pf['edli']!, pf['admin']!, esi['employer']!, lwf['employer']!]);
  return {
    'paidDays': paidDays.toString(),
    'earnings': earnings,
    'gross': money(gross),
    'pfWages': pfW,
    'pf': pf,
    'esi': esi,
    'pt': pt,
    'lwf': lwf,
    'tds': tds,
    'otherDeductions': others,
    'totalDeductions': money(deductions),
    'netPay': money(gross - deductions),
    'employerContributions': money(employer),
    'costToCompany': money(gross + employer),
  };
}

// ---- leaving ------------------------------------------------------------------------------------------

int serviceYears(String joined, String left) {
  final a = joined.split('-').map(int.parse).toList();
  final b = left.split('-').map(int.parse).toList();
  var months = (b[0] - a[0]) * 12 + (b[1] - a[1]) - (b[2] < a[2] ? 1 : 0);
  if (months < 0) months = 0;
  final years = months ~/ 12;
  final rest = months % 12;
  return rest > 6 || (rest == 6 && b[2] >= a[2] && b[2] - a[2] > 0) ? years + 1 : years;
}

Map<String, dynamic> gratuity(Object monthlyWages, String joined, String left, {bool fixedTerm = false}) {
  final years = serviceYears(joined, left);
  final eligible = fixedTerm ? years >= 1 : years >= 5;
  final amount = eligible ? _min(_rupee(_div(dec(monthlyWages) * Decimal.fromInt(15), 26) * Decimal.fromInt(years)), '2000000') : zero;
  return {'years': years, 'eligible': eligible, 'amount': money(amount)};
}

String leaveEncashment(Object days, Object monthlyWages, {int divisor = 30}) => _r(_div(dec(monthlyWages), divisor) * dec(days));

// ---- arrears ------------------------------------------------------------------------------------------

/// Arrears for a paid month when a revision takes effect back to it (see arrearsFor in TypeScript).
Map<String, String> arrearsFor(List<Map<String, dynamic>> paid, List<Map<String, dynamic>> revised, Object paidDays, int daysInMonth) {
  final codes = {...paid.map((c) => c['code'] as String), ...revised.map((c) => c['code'] as String)};
  var pfPart = zero;
  var other = zero;
  for (final code in codes) {
    final o = paid.where((c) => c['code'] == code).firstOrNull;
    final n = revised.where((c) => c['code'] == code).firstOrNull;
    final diff = _div((dec((n?['monthly'] ?? '0').toString()) - dec((o?['monthly'] ?? '0').toString())) * dec(paidDays.toString()), daysInMonth);
    if ((n ?? o)!['pfWage'] == true) {
      pfPart += diff;
    } else {
      other += diff;
    }
  }
  final total = _rupee(pfPart + other);
  if (total <= zero) return {'pfWage': '0.00', 'other': '0.00', 'total': '0.00'};
  final pf = _rupee(pfPart > zero ? pfPart : zero);
  return {'pfWage': money(pf), 'other': money(total - pf), 'total': money(total)};
}
