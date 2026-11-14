import 'dart:convert';

import 'package:decimal/decimal.dart';
import 'package:drift/drift.dart';

import '../domain/domain.dart';
import '../sync/api_client.dart';
import 'database.dart';

/// What the device knows about a customer from the bills it made, and, when online, what the cloud adds (all counters, points).
class CustomerProfile {
  CustomerProfile({required this.phone, this.name, required this.visits, required this.spent, this.lastVisit, this.points, this.returned, required this.top, required this.recent, required this.fromCloud});
  final String phone;
  final String? name;
  final int visits;
  final String spent;
  final String? lastVisit;
  final int? points;
  final String? returned;

  /// Most-bought items: name and pieces.
  final List<({String name, String qty})> top;

  /// Latest bills: number, date, total.
  final List<({String number, String date, String total})> recent;
  final bool fromCloud;
}

class Customers {
  Customers(this.db);
  final LocalDb db;

  /// People whose bills this device holds, matched by mobile number or part of a name, most recent first.
  Future<List<({String phone, String? name, String lastVisit})>> search(String q) async {
    final term = q.trim();
    if (term.isEmpty) return const [];
    final rows = await (db.select(db.posBills)
          ..where((b) => b.customerPhone.isNotNull() & (b.customerPhone.like('%$term%') | b.customerName.like('%$term%')))
          ..orderBy([(b) => OrderingTerm.desc(b.date)]))
        .get();
    final seen = <String>{};
    return [
      for (final b in rows)
        if (seen.add(b.customerPhone!)) (phone: b.customerPhone!, name: b.customerName, lastVisit: b.date),
    ];
  }

  /// From this device's own bills.
  Future<CustomerProfile> local(String phone) async {
    final bills = await (db.select(db.posBills)..where((b) => b.customerPhone.equals(phone))..orderBy([(b) => OrderingTerm.desc(b.date), (b) => OrderingTerm.desc(b.createdAt)])).get();
    var spent = zero;
    final byItem = <String, Decimal>{};
    for (final b in bills) {
      spent += dec(b.total);
      try {
        final detail = jsonDecode(b.detail) as Map<String, dynamic>;
        for (final l in ((detail['lines'] as List?) ?? const []).cast<Map<String, dynamic>>()) {
          final name = (l['name'] ?? l['itemId']).toString();
          byItem[name] = (byItem[name] ?? zero) + dec(l['qty'].toString());
        }
      } catch (_) {}
    }
    final top = byItem.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    return CustomerProfile(
      phone: phone, name: bills.map((b) => b.customerName).whereType<String>().firstOrNull, visits: bills.length, spent: money(spent.toString()), lastVisit: bills.firstOrNull?.date,
      top: [for (final e in top.take(5)) (name: e.key, qty: e.value.toString())],
      recent: [for (final b in bills.take(10)) (number: b.number, date: b.date, total: b.total)], fromCloud: false,
    );
  }

  /// The cloud's view across all counters. Falls back to this device's own when offline.
  Future<CustomerProfile> profile(String phone, ApiClient? api) async {
    final mine = await local(phone);
    if (api == null) return mine;
    try {
      final r = await api.get('/pos/customers/$phone');
      List<Map<String, dynamic>> list(String k) => ((r[k] as List?) ?? const []).cast<Map<String, dynamic>>();
      return CustomerProfile(
        phone: phone, name: (r['name'] as String?) ?? mine.name, visits: (r['visits'] as num?)?.toInt() ?? mine.visits, spent: money((r['spent'] ?? mine.spent).toString()), lastVisit: (r['lastVisit'] as String?) ?? mine.lastVisit,
        points: (r['points'] as num?)?.toInt(), returned: r['returned']?.toString(),
        top: [for (final t in list('top')) (name: (t['name'] ?? '').toString(), qty: (t['qty'] ?? t['pieces'] ?? '').toString())],
        recent: [for (final b in list('recent')) (number: (b['number'] ?? '').toString(), date: (b['date'] ?? '').toString(), total: (b['total'] ?? '').toString())], fromCloud: true,
      );
    } on ApiException {
      return mine;
    }
  }
}
