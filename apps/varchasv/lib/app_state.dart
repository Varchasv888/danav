import 'dart:convert';
import 'dart:io';

import 'package:flutter/widgets.dart';

import 'data/books.dart';
import 'data/database.dart';
import 'data/field.dart';
import 'data/hr.dart';
import 'data/pos.dart';
import 'sync/api_client.dart';
import 'sync/sync_service.dart';

/// Default cloud address. Override on the connect screen (e.g. http://localhost:4100 in development).
const defaultServerUrl = String.fromEnvironment('VARCHASV_API', defaultValue: 'http://localhost:4100');

class ConnectException implements Exception {
  ConnectException(this.code);
  final String code;
}

/// Everything the UI needs: the local books, the sync engine and who is signed in.
class AppState extends ChangeNotifier {
  AppState(this.db)
      : books = Books(db),
        hr = Hr(db),
        pos = Pos(db),
        field = Field(db);
  final LocalDb db;
  final Books books;
  final Hr hr;
  final Pos pos;
  final Field field;

  /// For online-only calls (today's figures, approvals); null until the device is connected.
  ApiClient? get api => _api;
  ApiClient? _api;
  SyncService? sync;

  bool ready = false;
  bool connected = false;
  String? userName;
  String? businessName;
  String? deviceCode;
  String serverUrl = defaultServerUrl;

  Future<void> load() async {
    serverUrl = await db.getMeta('serverUrl') ?? defaultServerUrl;
    final token = await db.getMeta('token');
    final deviceId = await db.getMeta('deviceId');
    userName = await db.getMeta('userName');
    businessName = await db.getMeta('businessName');
    deviceCode = await db.getMeta('deviceCode');
    if (token != null && deviceId != null) {
      _startSync(ApiClient(baseUrl: serverUrl, token: token));
      connected = true;
    }
    ready = true;
    notifyListeners();
  }

  void _startSync(ApiClient api) {
    _api = api;
    sync?.dispose();
    sync = SyncService(db, api)..startAutoSync();
  }

  static String get platform {
    if (Platform.isWindows) return 'windows';
    if (Platform.isMacOS) return 'macos';
    if (Platform.isAndroid) return 'android';
    if (Platform.isIOS) return 'ios';
    return 'linux';
  }

  /// One-time online step: sign in, register this device, download the books.
  Future<void> connect({required String server, required String email, required String password}) async {
    final base = server.trim().replaceAll(RegExp(r'/+$'), '');
    final api = ApiClient(baseUrl: base);
    try {
      final login = await api.login(email.trim(), password);
      final tenants = (login['tenants'] as List).cast<Map<String, dynamic>>();
      if (login['tenantId'] == null || tenants.isEmpty) throw ConnectException('no_business');
      final device = await api.registerDevice(Platform.localHostname, platform);
      await db.wipe();
      await db.setMeta('serverUrl', base);
      try {
        final me = await api.get('/auth/me');
        if (me['permissions'] is List) await db.setMeta('permissions', jsonEncode(me['permissions']));
      } on ApiException {
        // the first sync fetches it again
      }
      await db.setMeta('token', api.token);
      await db.setMeta('deviceId', device['id'] as String);
      await db.setMeta('deviceCode', device['code'] as String);
      await db.setMeta('userName', (login['user'] as Map)['name'] as String);
      await db.setMeta('businessName', tenants.firstWhere((t) => t['tenantId'] == login['tenantId'])['name'] as String);
      final s = SyncService(db, api);
      await s.syncNow(); // first pull: the full snapshot
      if (await db.select(db.companies).getSingleOrNull() == null) throw ConnectException(s.lastError ?? 'offline');
      s.dispose();
    } on ApiException catch (e) {
      throw ConnectException(e.code);
    }
    await load();
  }

  Future<void> signOut() async {
    await _api?.logout();
    sync?.dispose();
    sync = null;
    await db.wipe();
    connected = false;
    userName = businessName = deviceCode = null;
    notifyListeners();
  }
}

class AppScope extends InheritedNotifier<AppState> {
  const AppScope({super.key, required AppState state, required super.child}) : super(notifier: state);
  static AppState of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<AppScope>()!.notifier!;
}
