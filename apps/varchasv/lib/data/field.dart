import 'dart:convert';

import 'package:decimal/decimal.dart';
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import '../domain/domain.dart';
import 'books.dart';
import 'database.dart';

class ClaimLineDraft {
  ClaimLineDraft({required this.date, required this.categoryId, required this.amount, this.description, this.gstRate, this.vendorName, this.vendorGstin, this.invoiceNo, this.photoPath});
  final String date;
  final String categoryId;
  final String amount;
  final String? description;
  final String? gstRate;
  final String? vendorName;
  final String? vendorGstin;
  final String? invoiceNo;

  /// A photo of the receipt taken on this device; it is uploaded at the next sync and replaced by the file's id.
  final String? photoPath;
  Map<String, dynamic> toJson() => {
        if (photoPath != null && photoPath!.isNotEmpty) 'photoPath': photoPath,
        'date': date, 'categoryId': categoryId, 'amount': money(amount),
        if (description != null && description!.isNotEmpty) 'description': description,
        if (gstRate != null && gstRate != '0') 'gstRate': gstRate,
        if (vendorName != null && vendorName!.isNotEmpty) 'vendorName': vendorName,
        if (vendorGstin != null && vendorGstin!.isNotEmpty) 'vendorGstin': vendorGstin!.toUpperCase(),
        if (invoiceNo != null && invoiceNo!.isNotEmpty) 'invoiceNo': invoiceNo,
      };
}

class OrderLineDraft {
  OrderLineDraft(this.item, this.qty, this.rate);
  final PosItem item;
  String qty;
  String rate;
}

/// Field work that is done away from the office and synced later: expense claims (submitted for
/// approval on upload) and customer orders. The server numbers both and works out their tax; the
/// device keeps what it sent and shows the server's number once it is back.
class Field {
  Field(this.db);
  final LocalDb db;
  final _uuid = const Uuid();

  Future<List<ExpenseCategory>> categories() => (db.select(db.expenseCategories)..where((c) => c.archived.equals(false))..orderBy([(c) => OrderingTerm.asc(c.name)])).get();

  Future<List<Employee>> claimants() => (db.select(db.employees)..where((e) => e.status.equals('active'))..orderBy([(e) => OrderingTerm.asc(e.code)])).get();

  /// Customers: ledgers under Sundry Debtors or one of its sub-groups.
  Future<List<Account>> customers() async {
    final groups = await db.select(db.accountGroups).get();
    final debtors = groups.where((g) => g.key == 'sundry_debtors').map((g) => g.id).toSet();
    final ids = groups.where((g) => debtors.contains(g.id) || debtors.contains(g.parentId)).map((g) => g.id).toSet();
    return (db.select(db.accounts)..where((a) => a.groupId.isIn(ids) & a.archived.equals(false))..orderBy([(a) => OrderingTerm.asc(a.name)])).get();
  }

  Future<List<PosItem>> items() => (db.select(db.posItems)..where((i) => i.archived.equals(false))..orderBy([(i) => OrderingTerm.asc(i.name)])).get();

  Future<void> _enqueue(String kind, Map<String, dynamic> payload) =>
      db.into(db.outbox).insert(OutboxCompanion.insert(opId: _uuid.v4(), kind: kind, payload: jsonEncode(payload)));

  String _today(DateTime now) => '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';

  Future<LocalClaim> createClaim({required String employeeId, required String title, required List<ClaimLineDraft> lines, String? date, DateTime? now}) async {
    if (title.trim().length < 3) throw BooksException('title_too_short');
    if (lines.isEmpty) throw BooksException('no_lines');
    for (final l in lines) {
      if (!(dec(l.amount) > zero)) throw BooksException('invalid_amount');
      if (l.vendorGstin != null && l.vendorGstin!.isNotEmpty && gstinError(l.vendorGstin!) != null) throw BooksException('invalid_gstin');
    }
    final at = now ?? DateTime.now();
    final id = _uuid.v4();
    final day = date ?? _today(at);
    final total = money(lines.fold<Decimal>(zero, (s, l) => s + dec(l.amount)).toString());
    final payload = {'id': id, 'employeeId': employeeId, 'date': day, 'title': title.trim(), 'lines': [for (final l in lines) l.toJson()]};
    return db.transaction(() async {
      await db.into(db.localClaims).insert(LocalClaimsCompanion.insert(
            id: id, employeeId: employeeId, date: day, title: title.trim(), lines: jsonEncode(payload['lines']), total: total, createdAt: at.toIso8601String(),
          ));
      await _enqueue('expense.claim', payload);
      return (db.select(db.localClaims)..where((c) => c.id.equals(id))).getSingle();
    });
  }

  /// A rough total with GST for the screen; the server's figure replaces it on upload.
  String estimate(List<OrderLineDraft> lines) => money(lines.fold<Decimal>(zero, (s, l) {
        final amt = (Decimal.tryParse(l.qty) ?? zero) * (Decimal.tryParse(l.rate) ?? zero);
        return s + amt + (amt * dec(l.item.gstRate) / dec(100)).toDecimal(scaleOnInfinitePrecision: 4);
      }).toString());

  Future<FieldOrder> createOrder({required String customerId, required List<OrderLineDraft> lines, String? deliverBy, String? date, DateTime? now}) async {
    if (lines.isEmpty) throw BooksException('no_lines');
    for (final l in lines) {
      if (!((Decimal.tryParse(l.qty) ?? zero) > zero)) throw BooksException('qty_must_be_positive');
      if ((Decimal.tryParse(l.rate) ?? Decimal.parse('-1')) < zero) throw BooksException('invalid_amount');
    }
    final at = now ?? DateTime.now();
    final id = _uuid.v4();
    final day = date ?? _today(at);
    final payloadLines = [for (final l in lines) {'itemId': l.item.id, 'qty': l.qty, 'rate': money(l.rate)}];
    return db.transaction(() async {
      await db.into(db.fieldOrders).insert(FieldOrdersCompanion.insert(
            id: id, customerId: customerId, date: day, deliverBy: Value(deliverBy), lines: jsonEncode(payloadLines), estimate: estimate(lines), createdAt: at.toIso8601String(),
          ));
      await _enqueue('sales.order', {'id': id, 'customerId': customerId, 'date': day, 'deliverBy': ?deliverBy, 'lines': payloadLines});
      return (db.select(db.fieldOrders)..where((o) => o.id.equals(id))).getSingle();
    });
  }

  Stream<List<LocalClaim>> watchClaims() => (db.select(db.localClaims)..orderBy([(c) => OrderingTerm.desc(c.createdAt)])..limit(50)).watch();
  Stream<List<FieldOrder>> watchOrders() => (db.select(db.fieldOrders)..orderBy([(o) => OrderingTerm.desc(o.createdAt)])..limit(50)).watch();
}

/// After a push: the server's number (and total) for an uploaded claim or order, or why it was refused.
Future<void> settleFieldOp(LocalDb db, String kind, Map<String, dynamic> payload, {Map<String, dynamic>? result, String? error}) async {
  final state = Value(error == null ? 'synced' : 'failed');
  if (kind == 'expense.claim') {
    await (db.update(db.localClaims)..where((c) => c.id.equals(payload['id'] as String)))
        .write(LocalClaimsCompanion(syncState: state, syncError: Value(error), serverNumber: Value(result?['number'] as String?)));
  } else if (kind == 'sales.order') {
    await (db.update(db.fieldOrders)..where((o) => o.id.equals(payload['id'] as String))).write(FieldOrdersCompanion(
          syncState: state, syncError: Value(error), serverNumber: Value(result?['number'] as String?), serverTotal: Value(result?['total']?.toString()),
        ));
  }
}

/// Stores the expense categories from a pull (they come in full each time).
Future<void> applyFieldPull(LocalDb db, Map<String, dynamic> data) async {
  final cats = (data['expenseCategories'] as List?)?.cast<Map<String, dynamic>>();
  if (cats == null) return;
  await (db.delete(db.expenseCategories)..where((c) => c.id.isNotIn([for (final c in cats) c['id'] as String]))).go();
  for (final c in cats) {
    await db.into(db.expenseCategories).insertOnConflictUpdate(ExpenseCategoriesCompanion.insert(
          id: c['id'], name: c['name'], nameHi: Value(c['nameHi'] as String?), blockedCredit: Value(c['blockedCredit'] as bool? ?? false), archived: Value(c['archived'] as bool? ?? false),
        ));
  }
}
