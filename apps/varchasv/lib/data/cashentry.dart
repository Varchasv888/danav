import 'books.dart';
import 'database.dart';

/// The three things a person does at the cash drawer or with the bank: money received, money paid, and money moved between cash and a bank.
enum CashKind { received, paid, transfer }

/// Records a cash or bank entry as the right kind of voucher with the right sides, so nobody has to pick debit and credit:
/// received is a receipt (cash or bank in, the other account out), paid is a payment (the other account in, cash or bank out),
/// and a transfer is a contra from one cash or bank account to another.
Future<Voucher> postCashEntry(Books books, {required CashKind kind, required String cashOrBankId, required String otherId, required String amount, required String date, String? narration}) async {
  if (cashOrBankId == otherId) throw BooksException('same_account');
  return await switch (kind) {
    CashKind.received => books.postVoucher(type: 'receipt', date: date, narration: narration, lines: [LineDraft(accountId: cashOrBankId, debit: amount), LineDraft(accountId: otherId, credit: amount)]),
    CashKind.paid => books.postVoucher(type: 'payment', date: date, narration: narration, lines: [LineDraft(accountId: otherId, debit: amount), LineDraft(accountId: cashOrBankId, credit: amount)]),
    CashKind.transfer => books.postVoucher(type: 'contra', date: date, narration: narration, lines: [LineDraft(accountId: otherId, debit: amount), LineDraft(accountId: cashOrBankId, credit: amount)]),
  };
}
