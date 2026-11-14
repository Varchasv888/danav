import 'dart:convert';

import 'package:decimal/decimal.dart';
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import '../domain/domain.dart';
import 'books.dart';
import 'database.dart';

/// One item counted in a spot check.
class AuditLine {
  AuditLine({required this.itemId, required this.name, required this.code, required this.qty});
  final String itemId;
  final String name;
  final String? code;
  String qty;

  Map<String, dynamic> toJson() => {'itemId': itemId, 'name': name, 'code': code, 'qty': qty};
  factory AuditLine.fromJson(Map<String, dynamic> j) => AuditLine(itemId: j['itemId'] as String, name: j['name'] as String, code: j['code'] as String?, qty: j['qty'].toString());
}

/// A spot check in progress on this device: the store, a name and what has been scanned so far. It is kept in the device's own store so an
/// interrupted count is still there when the app is opened again.
class AuditSession {
  AuditSession({required this.id, required this.warehouseId, required this.store, required this.name, required this.lines});
  final String id;
  final String warehouseId;
  final String store;
  final String name;
  final List<AuditLine> lines;

  int get pieces => lines.fold(0, (n, l) => n + (Decimal.tryParse(l.qty)?.toBigInt().toInt() ?? 0));

  Map<String, dynamic> toJson() => {'id': id, 'warehouseId': warehouseId, 'store': store, 'name': name, 'lines': [for (final l in lines) l.toJson()]};
  factory AuditSession.fromJson(Map<String, dynamic> j) => AuditSession(
        id: j['id'] as String, warehouseId: j['warehouseId'] as String, store: j['store'] as String, name: j['name'] as String,
        lines: [for (final l in (j['lines'] as List).cast<Map<String, dynamic>>()) AuditLine.fromJson(l)],
      );
}

/// Counting stock by scanning (or typing) barcodes and SKUs. Only the items scanned are compared with the books; nothing is adjusted. The result is
/// queued like any other change and reaches the server as a verify-only count.
class StockAudit {
  StockAudit(this.db);
  final LocalDb db;
  final _uuid = const Uuid();
  static const _key = 'audit.current';

  Future<AuditSession?> current() async {
    final raw = await db.getMeta(_key);
    if (raw == null || raw.isEmpty) return null;
    return AuditSession.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  Future<void> _save(AuditSession s) => db.setMeta(_key, jsonEncode(s.toJson()));

  /// The store this device sells from, learned at the last sync.
  Future<({String id, String name})?> store() async {
    final raw = await db.getMeta('posStore');
    if (raw == null) return null;
    final j = jsonDecode(raw) as Map<String, dynamic>;
    return (id: j['id'] as String, name: j['name'] as String);
  }

  Future<AuditSession> start(String name) async {
    if (name.trim().length < 2) throw BooksException('name_too_short');
    final store = await this.store();
    if (store == null) throw BooksException('no_store');
    if (await current() != null) throw BooksException('audit_in_progress');
    final s = AuditSession(id: _uuid.v4(), warehouseId: store.id, store: store.name, name: name.trim(), lines: []);
    await _save(s);
    return s;
  }

  /// One scan or typed code: adds to what was counted for that item. An unknown code is refused, not guessed at.
  Future<AuditLine> scan(String code, {String qty = '1'}) async {
    final s = await current();
    if (s == null) throw BooksException('no_audit');
    final c = code.trim();
    if (c.isEmpty) throw BooksException('code_required');
    final n = Decimal.tryParse(qty);
    if (n == null || n <= zero) throw BooksException('qty_must_be_positive');
    final item = await (db.select(db.posItems)..where((i) => i.archived.equals(false) & (i.barcode.equals(c) | i.sku.equals(c)))..limit(1)).getSingleOrNull();
    if (item == null) throw BooksException('unknown_code');
    if (item.kind != 'goods') throw BooksException('not_goods');
    final have = s.lines.where((l) => l.itemId == item.id).firstOrNull;
    if (have != null) {
      have.qty = (Decimal.parse(have.qty) + n).toString();
      await _save(s);
      return have;
    }
    final line = AuditLine(itemId: item.id, name: item.name, code: item.barcode ?? item.sku, qty: n.toString());
    s.lines.add(line);
    await _save(s);
    return line;
  }

  Future<void> setQty(String itemId, String qty) async {
    final s = await current();
    if (s == null) throw BooksException('no_audit');
    final n = Decimal.tryParse(qty);
    if (n == null || n < zero) throw BooksException('invalid_amount');
    final l = s.lines.where((x) => x.itemId == itemId).firstOrNull;
    if (l == null) return;
    if (n == zero) {
      s.lines.remove(l);
    } else {
      l.qty = n.toString();
    }
    await _save(s);
  }

  /// Queues the count to go to the server and clears the session.
  Future<void> submit() async {
    final s = await current();
    if (s == null) throw BooksException('no_audit');
    if (s.lines.isEmpty) throw BooksException('nothing_counted');
    await db.transaction(() async {
      await db.into(db.outbox).insert(OutboxCompanion.insert(opId: _uuid.v4(), kind: 'stock.count', payload: jsonEncode({
        'id': s.id, 'warehouseId': s.warehouseId, 'name': s.name, 'lines': [for (final l in s.lines) {'itemId': l.itemId, 'counted': l.qty}],
      })));
      await db.setMeta(_key, '');
    });
  }

  Future<void> discard() => db.setMeta(_key, '');
}
