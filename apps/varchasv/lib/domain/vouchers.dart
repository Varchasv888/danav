import 'money.dart';
import 'posting.dart';

/// Voucher-type rules. Port of validateVoucher in packages/domain/src/accounts.ts;
/// shared cases live in spec/fixtures/vouchers.json.
const voucherTypes = ['journal', 'payment', 'receipt', 'contra'];

class VoucherLine extends JournalLine {
  const VoucherLine({required super.accountId, super.debit, super.credit, required this.cashOrBank});
  final bool cashOrBank;

  factory VoucherLine.fromJson(Map<String, dynamic> j) => VoucherLine(
        accountId: j['accountId'] as String,
        debit: j['debit'] as String?,
        credit: j['credit'] as String?,
        cashOrBank: j['cashOrBank'] as bool? ?? false,
      );
}

bool _positive(String? v) => v != null && dec(v) > zero;

List<String> validateVoucher(String type, List<VoucherLine> lines) {
  final errors = validateJournal(lines);
  if (type == 'payment' && !lines.any((l) => l.cashOrBank && _positive(l.credit))) errors.add('payment_needs_cash_bank_credit');
  if (type == 'receipt' && !lines.any((l) => l.cashOrBank && _positive(l.debit))) errors.add('receipt_needs_cash_bank_debit');
  if (type == 'contra' && lines.any((l) => !l.cashOrBank)) errors.add('contra_only_cash_bank');
  return errors;
}
