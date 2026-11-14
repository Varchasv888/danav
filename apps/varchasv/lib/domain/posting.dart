import 'money.dart';

/// Journal validation. Port of packages/domain/src/posting.ts.
class JournalLine {
  const JournalLine({required this.accountId, this.debit, this.credit});
  final String accountId;
  final String? debit;
  final String? credit;

  factory JournalLine.fromJson(Map<String, dynamic> j) =>
      JournalLine(accountId: j['accountId'] as String, debit: j['debit'] as String?, credit: j['credit'] as String?);

  JournalLine reversed() => JournalLine(accountId: accountId, debit: credit, credit: debit);
}

/// Error codes in the same order the TypeScript implementation reports them.
List<String> validateJournal(List<JournalLine> lines) {
  final errors = <String>[];
  if (lines.length < 2) errors.add('too_few_lines');
  for (final l in lines) {
    final dr = dec(l.debit ?? '0');
    final cr = dec(l.credit ?? '0');
    if (dr < zero || cr < zero) {
      errors.add('negative_amount');
    } else if (dr != zero && cr != zero) {
      errors.add('both_sides');
    } else if (dr == zero && cr == zero) {
      errors.add('zero_line');
    }
  }
  final debit = sumOf(lines.map((l) => l.debit ?? '0'));
  final credit = sumOf(lines.map((l) => l.credit ?? '0'));
  if (debit != credit) errors.add('unbalanced');
  return errors;
}
