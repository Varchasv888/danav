import 'dart:convert';

import '../domain/domain.dart';
import '../sync/api_client.dart';
import 'database.dart';

/// Queue tokens for the counter (a customer waiting for a trial room, alterations or billing): a number for the day that starts again at 1 each morning.
class Tokens {
  Tokens(this.db);
  final LocalDb db;

  String format(int n) => 'T${n.toString().padLeft(3, '0')}';

  /// The next token for [date] (the day's own count, kept on the device).
  Future<String> next(String date) async {
    final key = 'token.$date';
    final n = (int.tryParse(await db.getMeta(key) ?? '') ?? 0) + 1;
    await db.setMeta(key, '$n');
    return format(n);
  }

  /// Sends the token to the customer's mobile through the cloud when online. Returns false when it could not (offline, no number): the token stands anyway.
  Future<bool> send(ApiClient? api, {required String token, required String phone}) async {
    if (api == null || !RegExp(r'^[6-9]\d{9}$').hasMatch(phone)) return false;
    try {
      await api.post('/comms/send', {'event': 'token', 'phone': phone, 'params': {'token': token, 'shop': ''}, 'dedupeKey': 'token:$phone:$token:${DateTime.now().toIso8601String().substring(0, 10)}', 'channels': ['sms']});
      return true;
    } on ApiException {
      return false;
    }
  }
}

/// A counter bill as plain text to hand over or share: shop, number, lines and total, in the order a till slip carries them.
String slipText(PosBill b, {String? shop}) {
  final out = StringBuffer();
  if (shop != null && shop.isNotEmpty) out.writeln(shop);
  out.writeln('Bill ${b.number}   ${b.date}');
  if (b.customerName != null && b.customerName!.isNotEmpty) out.writeln('Customer: ${b.customerName}');
  Map<String, dynamic>? detail;
  try {
    final v = jsonDecode(b.detail);
    if (v is Map<String, dynamic>) detail = v;
  } catch (_) {}
  for (final l in ((detail?['lines'] as List?) ?? const []).cast<Map<String, dynamic>>()) {
    out.writeln('${l['name'] ?? ''}  ${l['qty']} x ${l['rate'] ?? l['price'] ?? ''}');
  }
  out.writeln('Total: Rs ${money(b.total)}');
  return out.toString().trimRight();
}
