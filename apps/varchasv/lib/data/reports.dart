import 'dart:convert';

import '../sync/api_client.dart';
import 'database.dart';

/// A report fetched from the cloud, with when it was fetched. Reports are read when online and the last copy is kept, so the device can still show
/// yesterday's figures with no network (marked as old).
class ReportCopy {
  ReportCopy({required this.name, required this.at, required this.data, required this.fresh});
  final String name;
  final DateTime at;
  final Map<String, dynamic> data;

  /// True when this call fetched it; false for the kept copy.
  final bool fresh;
}

class Reports {
  Reports(this.db);
  final LocalDb db;

  /// The reports the device offers, each with its path.
  static const catalog = <String, String Function(String today)>{
    'daySales': _daySales,
    'stockSummary': _stock,
    'receivables': _receivables,
  };

  static String _daySales(String today) => '/pos/summary?date=$today';
  static String _stock(String today) => '/reports/stock-summary?asOf=$today';
  static String _receivables(String today) => '/reports/receivables?asOf=$today';

  Future<ReportCopy?> cached(String name) async {
    final raw = await db.getMeta('report.$name');
    if (raw == null || raw.isEmpty) return null;
    final j = jsonDecode(raw) as Map<String, dynamic>;
    return ReportCopy(name: name, at: DateTime.parse(j['at'] as String), data: (j['data'] as Map).cast<String, dynamic>(), fresh: false);
  }

  /// Fetches the report; on a network failure returns the kept copy, or null when there is none.
  Future<ReportCopy?> load(String name, ApiClient? api, String today) async {
    final path = catalog[name]?.call(today);
    if (path == null) throw ArgumentError('unknown report $name');
    if (api == null) return cached(name);
    try {
      final data = await api.get(path);
      final at = DateTime.now();
      await db.setMeta('report.$name', jsonEncode({'at': at.toIso8601String(), 'data': data}));
      return ReportCopy(name: name, at: at, data: data, fresh: true);
    } on ApiException catch (e) {
      if (e.isNetwork) return cached(name);
      rethrow;
    }
  }
}
