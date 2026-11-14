/// Indian financial year (1 April – 31 March). Port of packages/domain/src/fiscal.ts.
class FiscalYear {
  FiscalYear(this.startYear);
  final int startYear;

  static String _yy(int n) => (n % 100).toString().padLeft(2, '0');
  String get start => '$startYear-04-01';
  String get end => '${startYear + 1}-03-31';
  String get label => '$startYear-${_yy(startYear + 1)}';
  String get short => '${_yy(startYear)}-${_yy(startYear + 1)}';

  bool contains(String isoDate) => isoDate.compareTo(start) >= 0 && isoDate.compareTo(end) <= 0;
}

final _isoDate = RegExp(r'^(\d{4})-(\d{2})-(\d{2})$');

FiscalYear fiscalYearOf(String isoDate) {
  final m = _isoDate.firstMatch(isoDate);
  if (m == null) throw ArgumentError('expected YYYY-MM-DD, got $isoDate');
  final year = int.parse(m.group(1)!);
  final month = int.parse(m.group(2)!);
  return FiscalYear(month >= 4 ? year : year - 1);
}
