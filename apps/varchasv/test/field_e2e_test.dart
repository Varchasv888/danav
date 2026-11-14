@Tags(['e2e'])
library;

import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:varchasv/app_state.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/field.dart';

/// Field work against a running API:
///   VARCHASV_E2E_API=http://localhost:4100 flutter test test/field_e2e_test.dart
void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  final api = Platform.environment['VARCHASV_E2E_API'];

  test('an order and a claim made offline reach the cloud, numbered there; the owner sees today\'s figures', () async {
    final run = DateTime.now().millisecondsSinceEpoch.toRadixString(36);
    final email = 'field-$run@test.varchasv.in';
    const password = 'offline-first-2026';
    final signup = await http.post(Uri.parse('$api/auth/signup'), headers: {'content-type': 'application/json'},
        body: jsonEncode({'name': 'Field Owner', 'email': email, 'password': password, 'businessName': 'E2E Distributors', 'stateCode': '27'}));
    expect(signup.statusCode, 201);
    final cookie = signup.headers['set-cookie']!.split(';').first;
    Future<dynamic> web(String method, String path, [Object? body]) async {
      final req = http.Request(method, Uri.parse('$api$path'))..headers.addAll({'cookie': cookie, 'content-type': 'application/json'});
      if (body != null) req.body = jsonEncode(body);
      return jsonDecode((await http.Response.fromStream(await req.send())).body);
    }

    final groups = (await web('GET', '/accounts/groups') as List).cast<Map<String, dynamic>>();
    final debtors = groups.firstWhere((g) => g['key'] == 'sundry_debtors')['id'];
    final customer = await web('POST', '/accounts', {'name': 'Gupta Stores', 'groupId': debtors, 'stateCode': '27'}) as Map<String, dynamic>;
    final setup = await web('GET', '/inventory/setup') as Map<String, dynamic>;
    final kgs = (setup['uoms'] as List).cast<Map<String, dynamic>>().firstWhere((u) => u['code'] == 'KGS')['id'];
    final rice = await web('POST', '/items', {'name': 'Basmati rice', 'uomId': kgs, 'gstRate': '5', 'hsn': '1006', 'saleRate': '100'}) as Map<String, dynamic>;
    final emp = await web('POST', '/employees', {'name': 'Meera Patil', 'gender': 'female', 'joinedOn': '2026-04-01', 'workState': '27'}) as Map<String, dynamic>;

    final db = LocalDb(NativeDatabase.memory());
    final app = AppState(db);
    await app.connect(server: api!, email: email, password: password);
    final s = AppState(db);
    await s.load();
    await s.sync!.syncNow();
    final hotel = (await s.field.categories()).firstWhere((c) => c.name == 'Hotel stay');
    final item = (await s.field.items()).firstWhere((i) => i.id == rice['id']);
    final today = DateTime.now().toIso8601String().substring(0, 10);
    final order = await s.field.createOrder(customerId: customer['id'] as String, lines: [OrderLineDraft(item, '3', '100')]);
    final claim = await s.field.createClaim(employeeId: emp['id'] as String, title: 'Market visit', lines: [ClaimLineDraft(date: today, categoryId: hotel.id, amount: '1200')]);
    await s.sync!.syncNow();
    s.sync!.dispose();
    expect(s.sync!.failed, 0);

    final o = await (db.select(db.fieldOrders)..where((x) => x.id.equals(order.id))).getSingle();
    expect([o.syncState, o.serverNumber, o.serverTotal], ['synced', startsWith('SO/'), '315.00']);
    final c = await (db.select(db.localClaims)..where((x) => x.id.equals(claim.id))).getSingle();
    expect([c.syncState, c.serverNumber], ['synced', startsWith('EXP/')]);
    final claims = (await web('GET', '/expenses/claims?status=submitted') as List).cast<Map<String, dynamic>>();
    expect(claims.single, containsPair('id', claim.id));

    // The owner's overview comes from the same API.
    final overview = await s.api!.get('/analytics/dashboard?date=$today');
    expect((overview['approvals'] as Map)['claims'], 1);
    await db.close();
  }, skip: api == null ? 'set VARCHASV_E2E_API to run against a live API' : false, timeout: const Timeout(Duration(minutes: 2)));
}
