import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/offline.dart';

void main() {
  final fixture = jsonDecode(File('../../spec/fixtures/offline_rules.json').readAsStringSync()) as Map<String, dynamic>;
  final rules = (fixture['rules'] as List).cast<Map<String, dynamic>>();

  test('the built-in rules are the table the server serves', () {
    expect(defaultOfflineRules.length, rules.length);
    for (var i = 0; i < rules.length; i++) {
      expect(defaultOfflineRules[i].action, rules[i]['action']);
      expect(OfflineMode.parse(rules[i]['mode'] as String), defaultOfflineRules[i].mode, reason: rules[i]['action'] as String);
      expect(defaultOfflineRules[i].note, rules[i]['note']);
    }
  });

  test('an action is queued only when allowed, and an unknown one is online only', () {
    final r = OfflineRules();
    expect(r.canQueue('pos.bill'), isTrue);
    expect(r.canQueue('masters.items'), isFalse);
    expect(r.modeOf('masters.items'), OfflineMode.readOnly);
    expect(r.modeOf('gst.einvoice'), OfflineMode.onlineOnly);
    expect(r.modeOf('something.new'), OfflineMode.onlineOnly);
  });

  test('what the server sends replaces the built-in rules, and rubbish leaves them alone', () {
    final fromServer = OfflineRules.fromServer([
      {'action': 'pos.bill', 'mode': 'online_only', 'note': 'Paused'},
      {'action': 'attendance.mark', 'mode': 'allowed', 'note': ''},
      {'action': 'broken', 'mode': 'sideways'},
      'not a rule',
    ]);
    expect(fromServer.canQueue('pos.bill'), isFalse);
    expect(fromServer.canQueue('attendance.mark'), isTrue);
    expect(fromServer.all.length, 2);
    expect(OfflineRules.fromServer(null).all.length, rules.length);
    expect(OfflineRules.fromServer(const []).all.length, rules.length);
  });
}
