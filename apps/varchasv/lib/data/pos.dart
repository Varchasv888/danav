import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import '../domain/domain.dart';
import 'books.dart';
import 'database.dart';

/// Series for a counter's bills; must match terminalSeries in apps/api/src/services/pos.ts.
const posSeriesPattern = '{CODE}/{FY}/{SEQ:5}';
String posDocType(String code) => 'pos_$code';

class PosSettingsData {
  const PosSettingsData({this.pricesIncludeTax = true, this.loyaltyEnabled = false, this.receiptFooter});
  final bool pricesIncludeTax;
  final bool loyaltyEnabled;
  final String? receiptFooter;
  factory PosSettingsData.fromJson(Map<String, dynamic> j) => PosSettingsData(
        pricesIncludeTax: j['pricesIncludeTax'] as bool? ?? true, loyaltyEnabled: j['loyaltyEnabled'] as bool? ?? false,
        receiptFooter: j['receiptFooter'] as String?,
      );
}

class CartItem {
  CartItem(this.item, [this.qty = '1']);
  final PosItem item;
  String qty;
}

/// Offline counter billing. A bill is worked out with the same rules as the server (domain/pos.dart),
/// numbered from this device's own series for the counter, stored, and queued for upload in one
/// transaction. The server re-computes it and flags any difference; the bill stays as charged.
class Pos {
  Pos(this.db);
  final LocalDb db;
  final _uuid = const Uuid();

  Future<List<PosTerminal>> terminals() => (db.select(db.posTerminals)..where((t) => t.archived.equals(false))..orderBy([(t) => OrderingTerm.asc(t.code)])).get();

  Future<List<PosItem>> items() => (db.select(db.posItems)..where((i) => i.archived.equals(false))..orderBy([(i) => OrderingTerm.asc(i.name)])).get();

  Future<PosSettingsData> settings() async {
    final raw = await db.getMeta('posSettings');
    return raw == null ? const PosSettingsData() : PosSettingsData.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  /// Store schemes from the last pull (already resolved to item ids by the server).
  Future<List<Scheme>> schemes() async {
    final raw = await db.getMeta('posSchemes');
    return raw == null ? const [] : [for (final s in jsonDecode(raw) as List) Scheme.fromJson(s as Map<String, dynamic>)];
  }

  /// Exact barcode or SKU match (for a scanner), else null.
  Future<PosItem?> byCode(String code) async {
    final c = code.trim();
    if (c.isEmpty) return null;
    return (db.select(db.posItems)..where((i) => i.archived.equals(false) & (i.barcode.equals(c) | i.sku.equals(c)))..limit(1)).getSingleOrNull();
  }

  /// The bill's figures before saving (for the screen), with any store schemes taken off the lines.
  Map<String, dynamic> preview(List<CartItem> cart, PosSettingsData s, {String billDiscount = '0', String? date, String? time, List<Scheme> schemes = const []}) {
    final day = date ?? _today();
    final offers = applySchemes([for (final c in cart) SchemeLine(itemId: c.item.id, qty: c.qty, price: c.item.saleRate, taxRate: c.item.gstRate)], schemes, day, time ?? _now(), s.pricesIncludeTax);
    final bill = posBill(
      [
        for (final (i, c) in cart.indexed)
          PosLineInput(qty: c.qty, price: c.item.saleRate, gstRate: c.item.gstRate, cessRate: c.item.cessRate, gstSlab: c.item.gstSlab, slabPieces: c.item.slabPieces,
              discount: offers.discounts[i]),
      ],
      PosOptions(inclusive: s.pricesIncludeTax, billDiscount: billDiscount.isEmpty ? '0' : billDiscount, date: day),
    );
    return {...bill, 'schemes': offers.applied, 'schemeDiscounts': offers.discounts};
  }

  /// The device clock as HH:MM, for offers that run between certain hours.
  static String _now() {
    final at = DateTime.now();
    return '${at.hour.toString().padLeft(2, '0')}:${at.minute.toString().padLeft(2, '0')}';
  }

  static String _today() {
    final at = DateTime.now();
    return '${at.year.toString().padLeft(4, '0')}-${at.month.toString().padLeft(2, '0')}-${at.day.toString().padLeft(2, '0')}';
  }

  Future<PosBill> createBill({
    required String terminalId, required List<CartItem> cart, required List<PosPayment> payments,
    String billDiscount = '0', String? customerPhone, String? customerName, DateTime? now,
  }) async {
    final at = now ?? DateTime.now();
    final date = '${at.year.toString().padLeft(4, '0')}-${at.month.toString().padLeft(2, '0')}-${at.day.toString().padLeft(2, '0')}';
    if (cart.isEmpty) throw BooksException('no_lines');
    for (final c in cart) {
      if (!(dec(c.qty) > zero)) throw BooksException('qty_must_be_positive');
    }
    if (customerPhone != null && customerPhone.isNotEmpty && !RegExp(r'^[6-9]\d{9}$').hasMatch(customerPhone)) throw BooksException('invalid_phone');
    if (payments.any((p) => p.mode == 'credit')) throw BooksException('customer_required_for_credit'); // on-account sales need the web
    final s = await settings();
    final offers = await schemes();
    final Map<String, dynamic> bill;
    final Map<String, String> paid;
    try {
      bill = preview(cart, s, billDiscount: billDiscount, date: date, time: '${at.hour.toString().padLeft(2, '0')}:${at.minute.toString().padLeft(2, '0')}', schemes: offers);
      paid = settlePayments(bill['total'], payments);
    } on PosError catch (e) {
      throw BooksException(e.code);
    }
    final id = _uuid.v4();
    return db.transaction(() async {
      final terminal = await (db.select(db.posTerminals)..where((t) => t.id.equals(terminalId))).getSingleOrNull();
      if (terminal == null) throw BooksException('unknown_terminal');
      final fy = fiscalYearOf(date);
      if (await (db.select(db.fiscalYears)..where((f) => f.label.equals(fy.label))).getSingleOrNull() == null) throw BooksException('no_fiscal_year');
      final number = await _nextNumber(terminal, fy.label, fy.short);
      final lines = [
        for (final (i, c) in cart.indexed)
          {'itemId': c.item.id, 'name': c.item.name, 'qty': c.qty, 'price': money(c.item.saleRate), ...(bill['lines'] as List)[i] as Map<String, dynamic>},
      ];
      final detail = {
        'lines': lines, 'taxable': bill['taxable'], 'cgst': bill['cgst'], 'sgst': bill['sgst'], 'cess': bill['cess'], 'discount': bill['discount'],
        'roundOff': bill['roundOff'], 'taxByRate': bill['taxByRate'], 'payments': [for (final p in payments) p.toJson()], 'schemes': bill['schemes'],
      };
      final row = PosBillsCompanion.insert(
        id: id, terminalId: terminalId, number: number, date: date, createdAt: at.toIso8601String(),
        customerPhone: Value(customerPhone?.isEmpty ?? true ? null : customerPhone), customerName: Value(customerName?.trim().isEmpty ?? true ? null : customerName!.trim()),
        detail: jsonEncode(detail), total: bill['total'] as String, change: Value(paid['change']!),
      );
      await db.into(db.posBills).insert(row);
      await db.into(db.outbox).insert(OutboxCompanion.insert(opId: _uuid.v4(), kind: 'pos.bill', payload: jsonEncode({
        'id': id, 'terminalId': terminalId, 'number': number, 'date': date, 'total': bill['total'], 'billedAt': at.toUtc().toIso8601String(),
        'lines': [
          for (final (i, c) in cart.indexed)
            {
              'itemId': c.item.id, 'qty': c.qty, 'price': money(c.item.saleRate),
              if (dec((bill['schemeDiscounts'] as List<String>)[i]) > zero) 'discount': (bill['schemeDiscounts'] as List<String>)[i],
            },
        ],
        if ((bill['schemes'] as List).isNotEmpty) 'schemes': bill['schemes'],
        if (dec(billDiscount.isEmpty ? '0' : billDiscount) > zero) 'billDiscount': money(billDiscount),
        if (row.customerPhone.value != null) 'customerPhone': row.customerPhone.value,
        if (row.customerName.value != null) 'customerName': row.customerName.value,
        'payments': [for (final p in payments) p.toJson()],
      })));
      return (db.select(db.posBills)..where((b) => b.id.equals(id))).getSingle();
    });
  }

  Future<String> _nextNumber(PosTerminal t, String fyLabel, String fyShort) async {
    final type = posDocType(t.code);
    var series = await (db.select(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fyLabel))).getSingleOrNull();
    if (series == null) {
      await db.into(db.deviceSeries).insert(DeviceSeriesCompanion.insert(docType: type, fyLabel: fyLabel, pattern: posSeriesPattern));
      series = await (db.select(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fyLabel))).getSingle();
    }
    final number = formatDocumentNumber(series.pattern.replaceAll('{CODE}', t.code), fyShort: fyShort, fyLabel: fyLabel, seq: series.nextSeq);
    await (db.update(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fyLabel))).write(DeviceSeriesCompanion(nextSeq: Value(series.nextSeq + 1)));
    return number;
  }

  Stream<List<PosBill>> watchBills(String date) => (db.select(db.posBills)..where((b) => b.date.equals(date))..orderBy([(b) => OrderingTerm.desc(b.createdAt)])).watch();
}

/// After a push: the bill is marked uploaded (with the server's total if it differed) or refused.
Future<void> settlePosOp(LocalDb db, String kind, Map<String, dynamic> payload, {Map<String, dynamic>? result, String? error}) async {
  if (kind != 'pos.bill') return;
  final mismatch = result?['mismatch'] as Map<String, dynamic>?;
  await (db.update(db.posBills)..where((b) => b.id.equals(payload['id'] as String))).write(PosBillsCompanion(
        syncState: Value(error == null ? 'synced' : 'failed'), syncError: Value(error),
        serverTotal: Value(mismatch == null ? null : mismatch['serverTotal']?.toString()),
      ));
}

/// Stores the POS part of a pull: items, this device's counters and settings. A counter's series moves
/// past the last bill number the server has seen (e.g. after reinstalling the app on this device).
Future<void> applyPosPull(LocalDb db, Map<String, dynamic> data) async {
  List<Map<String, dynamic>> list(String k) => ((data[k] as List?) ?? const []).cast<Map<String, dynamic>>();
  for (final i in list('items')) {
    await db.into(db.posItems).insertOnConflictUpdate(PosItemsCompanion.insert(
          id: i['id'], name: i['name'], nameHi: Value(i['nameHi'] as String?), sku: Value(i['sku'] as String?), barcode: Value(i['barcode'] as String?),
          kind: i['kind'], hsn: Value(i['hsn'] as String?), gstRate: dec(i['gstRate'].toString()).toString(), cessRate: Value(dec((i['cessRate'] ?? '0').toString()).toString()),
          saleRate: money(i['saleRate'].toString()), uom: (i['uom'] ?? '').toString(), archived: Value(i['archived'] as bool? ?? false),
          gstSlab: Value(i['gstSlab'] as String?), slabPieces: Value((i['slabPieces'] as int?) ?? 1),
        ));
  }
  if (data.containsKey('posTerminals')) {
    final terminals = list('posTerminals');
    // Counters unlinked from this device disappear from it.
    await (db.delete(db.posTerminals)..where((t) => t.id.isNotIn([for (final t in terminals) t['id'] as String]))).go();
    for (final t in terminals) {
      await db.into(db.posTerminals).insertOnConflictUpdate(PosTerminalsCompanion.insert(
            id: t['id'], code: t['code'], name: t['name'], archived: Value(t['archived'] as bool? ?? false),
          ));
      final last = t['lastNumber'] as String?;
      final m = last == null ? null : RegExp(r'^[^/]+/(\d{2})-(\d{2})/(\d+)$').firstMatch(last);
      if (m == null) continue;
      final fyLabel = '20${m.group(1)}-${m.group(2)}';
      final next = int.parse(m.group(3)!) + 1;
      final type = posDocType(t['code'] as String);
      final existing = await (db.select(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fyLabel))).getSingleOrNull();
      if (existing == null) {
        await db.into(db.deviceSeries).insert(DeviceSeriesCompanion.insert(docType: type, fyLabel: fyLabel, pattern: posSeriesPattern, nextSeq: Value(next)));
      } else if (next > existing.nextSeq) {
        await (db.update(db.deviceSeries)..where((s) => s.docType.equals(type) & s.fyLabel.equals(fyLabel))).write(DeviceSeriesCompanion(nextSeq: Value(next)));
      }
    }
  }
  if (data['posSettings'] != null) await db.setMeta('posSettings', jsonEncode(data['posSettings']));
  if (data['posStore'] != null) await db.setMeta('posStore', jsonEncode(data['posStore']));
  if (data['posSchemes'] != null) await db.setMeta('posSchemes', jsonEncode(data['posSchemes']));
}
