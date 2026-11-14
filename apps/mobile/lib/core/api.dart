/// Talking to the Varchasv server. The server keeps the books; the app only asks for data and hands over finished documents.
library;

import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

/// The server refused or failed the request (a 4xx or 5xx): [code] is its error code (for example "credit_blocked").
class ApiException implements Exception {
  final int status;
  final String code;
  ApiException(this.status, this.code);
  @override
  String toString() => 'ApiException($status, $code)';
}

/// The request never reached the server, or its answer did not come back. [sent] says whether the server may have received it (a timeout), which matters for a
/// document: a request that was never sent can be tried again, one that may have been sent must be checked first.
class NetworkException implements Exception {
  final bool sent;
  final String message;
  NetworkException(this.message, {this.sent = false});
  @override
  String toString() => 'NetworkException($message, sent: $sent)';
}

abstract class ApiPort {
  Future<dynamic> get(String path);
  Future<dynamic> post(String path, Object body);
  Future<List<int>> getBytes(String path);
}

class HttpApi implements ApiPort {
  String baseUrl;
  String? cookie;
  final http.Client _client;
  final Duration timeout;

  HttpApi(
    this.baseUrl, {
    this.cookie,
    http.Client? client,
    this.timeout = const Duration(seconds: 12),
  }) : _client = client ?? http.Client();

  Uri _uri(String path) =>
      Uri.parse('${baseUrl.replaceAll(RegExp(r'/+$'), '')}$path');
  Map<String, String> get _headers => {
    'content-type': 'application/json',
    'cookie': ?cookie,
  };

  void _keepCookie(http.BaseResponse r) {
    final set = r.headers['set-cookie'];
    if (set == null) return;
    final m = RegExp(r'([^=;,\s]+=[^;]+)').firstMatch(set);
    if (m != null) cookie = m.group(1);
  }

  Future<http.Response> _run(
    Future<http.Response> Function() send, {
    required bool body,
  }) async {
    try {
      final r = await send().timeout(timeout);
      _keepCookie(r);
      return r;
    } on TimeoutException {
      throw NetworkException('The server did not answer in time.', sent: body);
    } on http.ClientException catch (e) {
      throw NetworkException(e.message);
    } on FormatException catch (e) {
      throw NetworkException(e.message);
    }
  }

  dynamic _decode(http.Response r) {
    if (r.statusCode >= 200 && r.statusCode < 300)
      return r.body.isEmpty ? null : jsonDecode(utf8.decode(r.bodyBytes));
    var code = 'http_${r.statusCode}';
    try {
      final j = jsonDecode(r.body);
      if (j is Map && j['error'] is String) code = j['error'] as String;
    } catch (_) {}
    throw ApiException(r.statusCode, code);
  }

  @override
  Future<dynamic> get(String path) async => _decode(
    await _run(() => _client.get(_uri(path), headers: _headers), body: false),
  );

  @override
  Future<dynamic> post(String path, Object body) async => _decode(
    await _run(
      () => _client.post(_uri(path), headers: _headers, body: jsonEncode(body)),
      body: true,
    ),
  );

  @override
  Future<List<int>> getBytes(String path) async {
    final r = await _run(
      () => _client.get(_uri(path), headers: _headers),
      body: false,
    );
    if (r.statusCode >= 300)
      throw ApiException(r.statusCode, 'http_${r.statusCode}');
    return r.bodyBytes;
  }

  Future<void> login(String email, String password) async {
    cookie = null;
    await post('/auth/login', {'email': email, 'password': password});
  }
}
