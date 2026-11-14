import 'dart:convert';

import 'package:decimal/decimal.dart';
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import '../domain/domain.dart';
import 'database.dart';

/// Device number-series patterns; must match DEVICE_SERIES in apps/api/src/services/accounting.ts.
const deviceSeriesPatterns = {
  'journal': 'J{DEV}/{FY}/{SEQ:5}',
  'payment': 'P{DEV}/{FY}/{SEQ:5}',
  'receipt': 'R{DEV}/{FY}/{SEQ:5}',
  'contra': 'C{DEV}/{FY}/{SEQ:5}',
};
const cashBankGroupKeys = {'cash_in_hand', 'bank_accounts', 'bank_od'};

class BooksException implements Exception {
  BooksException(this.code);
  final String code;
  @override
  String toString() => 'BooksException($code)';
}

class LineDraft {
  LineDraft({required this.accountId, this.debit = '', this.credit = ''});
  String accountId;
  String debit;
  String credit;
}

class AccountBalance {
  AccountBalance(this.account, this.groupName, this.groupNameHi, this.balance);
  final Account account;
  final String groupName;
  final String? groupNameHi;
  final Decimal balance; // positive = debit
}

/// Everything the offline app does to the books. Each change is written locally and queued in the
/// outbox in the same transaction, so nothing entered offline can be lost or sent twice.
class Books {
  Books(this.db);
  final LocalDb db;
  final _uuid = const Uuid();

  Future<String> _companyId() async {
    final c = await db.select(db.companies).getSingleOrNull();
    if (c == null) throw BooksException('not_set_up');
    return c.id;
  }

  Future<Company?> company() => (db.select(db.companies)..limit(1)).getSingleOrNull();

  Future<void> _enqueue(String kind, Map<String, dynamic> payload) =>
      db.into(db.outbox).insert(OutboxCompanion.insert(opId: _uuid.v4(), kind: kind, payload: jsonEncode(payload)));

  /// Group ids whose accounts count as cash or bank (the group itself or its parent is Cash-in-Hand/Bank).
  Future<Set<String>> cashBankGroupIds() async {
    final groups = await db.select(db.accountGroups).get();
    final byId = {for (final g in groups) g.id: g};
    return {
      for (final g in groups)
        if (cashBankGroupKeys.contains(g.key) || cashBankGroupKeys.contains(byId[g.parentId]?.key)) g.id,
    };
  }

  // ---- vouchers ---------------------------------------------------------------------------------

  Future<Voucher> postVoucher({
    required String type,
    required String date,
    required List<LineDraft> lines,
    String? narration,
    String? reference,
  }) async {
    final amount = RegExp(r'^\d+(\.\d{1,2})?$');
    final filled = lines.where((l) => l.accountId.isNotEmpty && (amount.hasMatch(l.debit) || amount.hasMatch(l.credit))).toList();
    final accounts = {for (final a in await db.select(db.accounts).get()) a.id: a};
    final cashBank = await cashBankGroupIds();
    for (final l in filled) {
      final a = accounts[l.accountId];
      if (a == null) throw BooksException('unknown_account');
      if (a.archived) throw BooksException('account_archived');
    }
    final vLines = [
      for (final l in filled)
        VoucherLine(
          accountId: l.accountId,
          debit: amount.hasMatch(l.debit) ? money(l.debit) : null,
          credit: amount.hasMatch(l.credit) ? money(l.credit) : null,
          cashOrBank: cashBank.contains(accounts[l.accountId]!.groupId),
        ),
    ];
    final errors = validateVoucher(type, vLines);
    if (errors.isNotEmpty) throw BooksException(errors.first);

    final company = (await db.select(db.companies).getSingle());
    if (date.compareTo(company.booksBeginOn) < 0) throw BooksException('before_books_begin');
    final fy = fiscalYearOf(date);
    final fyRow = await (db.select(db.fiscalYears)..where((f) => f.label.equals(fy.label))).getSingleOrNull();
    if (fyRow != null) {
      if (fyRow.closed) throw BooksException('period_closed');
      if (fyRow.lockedUpTo != null && date.compareTo(fyRow.lockedUpTo!) <= 0) throw BooksException('period_locked');
    }
    final deviceCode = await db.getMeta('deviceCode');
    if (deviceCode == null) throw BooksException('not_set_up');

    return db.transaction(() async {
      // Take the next number from this device's own series (created on first use in a new year).
      var series = await (db.select(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fy.label))).getSingleOrNull();
      if (series == null) {
        await db.into(db.deviceSeries).insert(DeviceSeriesCompanion.insert(docType: type, fyLabel: fy.label, pattern: deviceSeriesPatterns[type]!));
        series = await (db.select(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fy.label))).getSingle();
      }
      final seq = series.nextSeq;
      final number = formatDocumentNumber(series.pattern, fyShort: fy.short, fyLabel: fy.label, seq: seq, device: deviceCode);
      await (db.update(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fy.label)))
          .write(DeviceSeriesCompanion(nextSeq: Value(seq + 1)));

      final id = _uuid.v4();
      final total = money(sumOf(vLines.map((l) => l.debit ?? '0')));
      final companyId = company.id;
      await db.into(db.vouchers).insert(VouchersCompanion.insert(
            id: id, companyId: companyId, type: type, number: number, date: date, total: total,
            narration: Value(narration), reference: Value(reference), syncState: const Value('pending'),
          ));
      for (var i = 0; i < vLines.length; i++) {
        await db.into(db.voucherLines).insert(VoucherLinesCompanion.insert(
              voucherId: id, lineNo: i + 1, accountId: vLines[i].accountId,
              debit: Value(vLines[i].debit ?? '0.00'), credit: Value(vLines[i].credit ?? '0.00'),
            ));
      }
      await _enqueue('voucher.create', {
        'id': id, 'companyId': companyId, 'type': type, 'date': date, 'number': number, 'seq': seq,
        'narration': narration, 'reference': reference,
        'lines': [for (final l in vLines) {'accountId': l.accountId, if (l.debit != null) 'debit': l.debit, if (l.credit != null) 'credit': l.credit}],
      });
      return (db.select(db.vouchers)..where((v) => v.id.equals(id))).getSingle();
    });
  }

  Future<void> cancelVoucher(String id, String reason) => db.transaction(() async {
        final v = await (db.select(db.vouchers)..where((x) => x.id.equals(id))).getSingleOrNull();
        if (v == null) throw BooksException('not_found');
        if (v.status == 'cancelled') throw BooksException('already_cancelled');
        final fy = await (db.select(db.fiscalYears)..where((f) => f.label.equals(fiscalYearOf(v.date).label))).getSingleOrNull();
        if (fy?.lockedUpTo != null && v.date.compareTo(fy!.lockedUpTo!) <= 0) throw BooksException('period_locked');
        await (db.update(db.vouchers)..where((x) => x.id.equals(id))).write(const VouchersCompanion(status: Value('cancelled'), syncState: Value('pending')));
        await _enqueue('voucher.cancel', {'id': id, 'reason': reason});
      });

  Stream<List<Voucher>> watchVouchers() =>
      (db.select(db.vouchers)..orderBy([(v) => OrderingTerm.desc(v.date), (v) => OrderingTerm.desc(v.number)])).watch();

  Future<List<VoucherLine>> linesOf(String voucherId) async {
    final rows = await (db.select(db.voucherLines)..where((l) => l.voucherId.equals(voucherId))..orderBy([(l) => OrderingTerm.asc(l.lineNo)])).get();
    return [for (final r in rows) VoucherLine(accountId: r.accountId, debit: r.debit, credit: r.credit, cashOrBank: false)];
  }

  // ---- accounts ---------------------------------------------------------------------------------

  Future<Account> createAccount({required String name, required String groupId, String? nameHi, String openingBalance = '0', String? gstin, String? phone}) async {
    final trimmed = name.trim();
    if (trimmed.isEmpty) throw BooksException('name_required');
    final clash = await (db.select(db.accounts)..where((a) => a.name.lower().equals(trimmed.toLowerCase()))).getSingleOrNull();
    if (clash != null) throw BooksException('account_name_taken');
    String? state;
    if (gstin != null && gstin.trim().isNotEmpty) {
      final err = gstinError(gstin);
      if (err != null) throw BooksException('gstin_$err');
      gstin = gstin.trim().toUpperCase();
      state = gstin.substring(0, 2);
    } else {
      gstin = null;
    }
    final companyId = await _companyId();
    final id = _uuid.v4();
    final ob = money(openingBalance.trim().isEmpty ? '0' : openingBalance.trim());
    return db.transaction(() async {
      await db.into(db.accounts).insert(AccountsCompanion.insert(
            id: id, companyId: companyId, groupId: groupId, name: trimmed,
            nameHi: Value(nameHi), openingBalance: Value(ob), gstin: Value(gstin), stateCode: Value(state), phone: Value(phone),
          ));
      await _enqueue('account.upsert', {
        'id': id, 'companyId': companyId, 'groupId': groupId, 'name': trimmed, 'nameHi': nameHi, 'openingBalance': ob,
        'gstin': gstin, 'stateCode': state, 'phone': phone,
      });
      return (db.select(db.accounts)..where((a) => a.id.equals(id))).getSingle();
    });
  }

  Future<List<AccountGroup>> groups() => (db.select(db.accountGroups)..orderBy([(g) => OrderingTerm.asc(g.name)])).get();

  /// Opening balance plus every posted voucher line up to `asOf`. Cancelled vouchers don't count.
  Future<List<AccountBalance>> balances({String asOf = '9999-12-31'}) async {
    final rows = await db.customSelect(
      '''
      select a.id, coalesce(sum(case when v.id is not null
               then cast(round(cast(l.debit as real) * 100) as integer) - cast(round(cast(l.credit as real) * 100) as integer) end), 0) as paise
      from accounts a
      left join voucher_lines l on l.account_id = a.id
      left join vouchers v on v.id = l.voucher_id and v.status = 'posted' and v.date <= ?
      group by a.id
      ''',
      variables: [Variable.withString(asOf)],
      readsFrom: {db.accounts, db.voucherLines, db.vouchers},
    ).get();
    // Amounts are TEXT with 2 decimals; each is converted to whole paise before summing, so the
    // integer sum is exact (no floating-point drift across thousands of lines).
    final movement = {for (final r in rows) r.read<String>('id'): divInt(Decimal.fromInt(r.read<int>('paise')), 100)};
    final groups = {for (final g in await db.select(db.accountGroups).get()) g.id: g};
    final accounts = await (db.select(db.accounts)..orderBy([(a) => OrderingTerm.asc(a.name)])).get();
    return [
      for (final a in accounts)
        AccountBalance(a, groups[a.groupId]?.name ?? '', groups[a.groupId]?.nameHi, dec(a.openingBalance) + (movement[a.id] ?? zero)),
    ];
  }

  Future<int> pendingCount() async => (await (db.select(db.outbox)..where((o) => o.state.equals('pending'))).get()).length;
}
