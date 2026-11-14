import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiException implements Exception {
  ApiException(this.status, this.code);
  final int status;
  final String code;
  bool get isNetwork => status == 0;
  @override
  String toString() => 'ApiException($status, $code)';
}

/// Thin client for the Varchasv cloud API. The session token goes in a bearer header.
class ApiClient {
  ApiClient({required this.baseUrl, this.token, http.Client? client}) : _http = client ?? http.Client();
  final String baseUrl;
  String? token;
  final http.Client _http;

  Future<Map<String, dynamic>> _send(String method, String path, [Object? body]) async {
    final uri = Uri.parse('$baseUrl$path');
    final headers = {
      'accept': 'application/json',
      if (body != null) 'content-type': 'application/json',
      if (token != null) 'authorization': 'Bearer $token',
    };
    http.Response res;
    try {
      final req = http.Request(method, uri)..headers.addAll(headers);
      if (body != null) req.body = jsonEncode(body);
      res = await http.Response.fromStream(await _http.send(req)).timeout(const Duration(seconds: 60));
    } catch (_) {
      throw ApiException(0, 'offline');
    }
    final data = res.body.isEmpty ? <String, dynamic>{} : jsonDecode(res.body);
    if (res.statusCode >= 400) throw ApiException(res.statusCode, (data is Map ? data['error'] : null) as String? ?? 'error');
    return data is Map<String, dynamic> ? data : {'data': data};
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final r = await _send('POST', '/auth/login', {'email': email, 'password': password, 'client': 'app'});
    token = r['token'] as String?;
    return r;
  }

  Future<Map<String, dynamic>> registerDevice(String name, String platform) => _send('POST', '/devices', {'name': name, 'platform': platform});

  Future<Map<String, dynamic>> pull(String deviceId, String? cursor) =>
      _send('GET', '/sync/pull?deviceId=$deviceId${cursor == null ? '' : '&cursor=$cursor'}');

  Future<Map<String, dynamic>> push(String deviceId, List<Map<String, dynamic>> ops) => _send('POST', '/sync/push', {'deviceId': deviceId, 'ops': ops});

  /// Online-only requests (the dashboard, approvals).
  Future<Map<String, dynamic>> get(String path) => _send('GET', path);
  Future<Map<String, dynamic>> post(String path, [Object? body]) => _send('POST', path, body ?? <String, dynamic>{});

  Future<void> logout() async {
    try {
      await _send('POST', '/auth/logout');
    } catch (_) {}
  }
}
