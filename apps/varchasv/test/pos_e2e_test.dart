@Tags(['e2e'])
library;

import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart' show OrderingTerm, driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:varchasv/app_state.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/pos.dart';
import 'package:varchasv/domain/domain.dart';

/// Offline counter billing against a running API:
///   VARCHASV_E2E_API=http://localhost:4100 flutter test test/pos_e2e_test.dart
void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  final api = Platform.environment['VARCHASV_E2E_API'];

  test('a counter linked to this device bills offline, and the bills land in the cloud', () async {
    final run = DateTime.now().millisecondsSinceEpoch.toRadixString(36);
    final email = 'pos-$run@test.varchasv.in';
    const password = 'offline-first-2026';
    final signup = await http.post(Uri.parse('$api/auth/signup'),
        headers: {'content-type': 'application/json'},
        body: jsonEncode({'name': 'POS Owner', 'email': email, 'password': password, 'businessName': 'E2E Cafe', 'stateCode': '27'}));
    expect(signup.statusCode, 201);
    final cookie = signup.headers['set-cookie']!.split(';').first;
    Future<dynamic> web(String method, String path, [Object? body]) async {
      final req = http.Request(method, Uri.parse('$api$path'))..headers.addAll({'cookie': cookie, 'content-type': 'application/json'});
      if (body != null) req.body = jsonEncode(body);
      return jsonDecode((await http.Response.fromStream(await req.send())).body);
    }

    final setup = await web('GET', '/inventory/setup') as Map<String, dynamic>;
    final pcs = (setup['uoms'] as List).cast<Map<String, dynamic>>().firstWhere((u) => u['code'] == 'PCS')['id'];
    final tea = await web('POST', '/items', {'name': 'Masala chai', 'uomId': pcs, 'gstRate': '5', 'hsn': '996331', 'saleRate': '25', 'barcode': '4000001'}) as Map<String, dynamic>;

    final db = LocalDb(NativeDatabase.memory());
    final state = AppState(db);
    await state.connect(server: api!, email: email, password: password);
    state.sync!.dispose();
    final deviceId = await db.getMeta('deviceId');
    final counter = await web('POST', '/pos/terminals', {'name': 'Tablet', 'deviceId': deviceId}) as Map<String, dynamic>;

    final app = AppState(db);
    await app.load();
    await app.sync!.syncNow(); // pulls the counter and the item
    final item = await app.pos.byCode('4000001');
    expect(item?.id, tea['id']);
    final today = DateTime.now();
    final b1 = await app.pos.createBill(terminalId: counter['id'] as String, cart: [CartItem(item!, '3')], payments: const [PosPayment('cash', '100')], now: today);
    final b2 = await app.pos.createBill(terminalId: counter['id'] as String, cart: [CartItem(item)], payments: const [PosPayment('upi', '25')], now: today);
    expect(b1.number, '${counter['code']}/${fiscalYearOf(b1.date).short}/00001');
    await app.sync!.syncNow();
    app.sync!.dispose();
    expect(app.sync!.failed, 0);
    final uploaded = await (db.select(db.posBills)..orderBy([(b) => OrderingTerm.asc(b.number)])).get();
    expect(uploaded.map((b) => b.syncState), ['synced', 'synced']);

    final cloud = (await web('GET', '/pos/bills?date=${b1.date}') as List).cast<Map<String, dynamic>>();
    expect({for (final b in cloud) b['number']: b['total']}, {b1.number: '75.00', b2.number: '25.00'});
    expect(cloud.every((b) => b['source'] == 'device' && b['mismatch'] == null), isTrue);
    await db.close();
  }, skip: api == null ? 'set VARCHASV_E2E_API to run against a live API' : false, timeout: const Timeout(Duration(minutes: 2)));
}
