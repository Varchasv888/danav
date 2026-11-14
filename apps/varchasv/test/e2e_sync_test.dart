@Tags(['e2e'])
library;

import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart' show driftRuntimeOptions;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:varchasv/app_state.dart';
import 'package:varchasv/data/books.dart';
import 'package:varchasv/data/database.dart';

/// Full round trip against a running API:
///   VARCHASV_E2E_API=http://localhost:4100 flutter test test/e2e_sync_test.dart
/// Skipped when the variable is not set (e.g. in CI without a server).
void main() {
  driftRuntimeOptions.dontWarnAboutMultipleDatabases = true;
  final api = Platform.environment['VARCHASV_E2E_API'];

  test('connect, post offline, sync both ways, and the cloud books agree', () async {
    final run = DateTime.now().millisecondsSinceEpoch.toRadixString(36);
    final email = 'e2e-$run@test.varchasv.in';
    const password = 'offline-first-2026';

    // A business created on the web.
    final signup = await http.post(Uri.parse('$api/auth/signup'),
        headers: {'content-type': 'application/json'},
        body: jsonEncode({'name': 'E2E Owner', 'email': email, 'password': password, 'businessName': 'E2E Kirana', 'stateCode': '27'}));
    expect(signup.statusCode, 201);
    final cookie = signup.headers['set-cookie']!.split(';').first;
    Future<Map<String, dynamic>> web(String method, String path, [Object? body]) async {
      final req = http.Request(method, Uri.parse('$api$path'))..headers.addAll({'cookie': cookie, 'content-type': 'application/json'});
      if (body != null) req.body = jsonEncode(body);
      final res = await http.Response.fromStream(await req.send());
      return jsonDecode(res.body) as Map<String, dynamic>;
    }

    // The desktop app connects once.
    final db = LocalDb(NativeDatabase.memory());
    final state = AppState(db);
    await state.connect(server: api!, email: email, password: password);
    expect(state.connected, isTrue);
    expect(state.deviceCode, 'A1');
    final accounts = {for (final a in await db.select(db.accounts).get()) if (a.key != null) a.key!: a.id};
    state.sync!.dispose(); // take control of when sync happens

    // Offline work: a new customer, a receipt from them, a rent payment.
    final groups = {for (final g in await db.select(db.accountGroups).get()) if (g.key != null) g.key!: g.id};
    final customer = await state.books.createAccount(name: 'Sharma General Store', groupId: groups['sundry_debtors']!, openingBalance: '5000');
    final today = DateTime.now().toIso8601String().substring(0, 10);
    final receipt = await state.books.postVoucher(type: 'receipt', date: today, lines: [
      LineDraft(accountId: accounts['cash']!, debit: '3000'),
      LineDraft(accountId: customer.id, credit: '3000'),
    ]);
    await state.books.postVoucher(type: 'payment', date: today, narration: 'Shop rent', lines: [
      LineDraft(accountId: accounts['rent']!, debit: '1200'),
      LineDraft(accountId: accounts['cash']!, credit: '1200'),
    ]);
    expect(receipt.number, startsWith('RA1/'));
    expect(await state.books.pendingCount(), 3);

    // Meanwhile someone posts on the web.
    final webVoucher = await web('POST', '/vouchers', {
      'type': 'journal', 'date': today, 'narration': 'Salary provision',
      'lines': [{'accountId': accounts['salaries'], 'debit': '800'}, {'accountId': accounts['cash'], 'credit': '800'}],
    });

    // Back online.
    final sync = AppState(db); // fresh state, as after an app restart
    await sync.load();
    await sync.sync!.syncNow();
    sync.sync!.dispose();
    expect(sync.sync!.pending, 0);
    expect(sync.sync!.failed, 0);

    // The web entry arrived on the device…
    final local = await (db.select(db.vouchers)..where((v) => v.id.equals(webVoucher['id'] as String))).getSingleOrNull();
    expect(local?.number, webVoucher['number']);

    // …and the cloud's trial balance matches the device's to the paisa.
    final tb = await web('GET', '/reports/trial-balance?asOf=$today');
    final device = await state.books.balances(asOf: today);
    final deviceDr = device.where((b) => b.balance.sign > 0).fold(0.0, (s, b) => s + b.balance.toDouble());
    expect(tb['totalDebit'], deviceDr.toStringAsFixed(2));
    final cloudCash = (tb['rows'] as List).cast<Map<String, dynamic>>().firstWhere((r) => r['accountId'] == accounts['cash']);
    expect(cloudCash['dr'], '1000.00'); // 3000 − 1200 − 800
    await db.close();
  }, skip: api == null ? 'set VARCHASV_E2E_API to run against a live API' : false, timeout: const Timeout(Duration(minutes: 2)));
}
