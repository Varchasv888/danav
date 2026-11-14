@TestOn('windows')
library;

import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:path/path.dart' as p;
import 'package:varchasv_app/core/integrity.dart';

/// Only runs on Windows (everywhere else the check is a no-op, see integrity_stub.dart). A temporary folder stands in for the installed folder, so the manifest
/// format and the comparison logic are proved without touching the real install or the test runner's own files.
void main() {
  late Directory dir;

  setUp(() async {
    dir = await Directory.systemTemp.createTemp('integrity_test_');
    await File(p.join(dir.path, 'app.exe')).writeAsString('one');
    await File(p.join(dir.path, 'engine.dll')).writeAsString('two');
  });
  tearDown(() => dir.delete(recursive: true));

  Future<String> hashOf(String name) async => sha256
      .convert(await File(p.join(dir.path, name)).readAsBytes())
      .toString();

  test('no manifest in the folder (a dev run, not an installed copy): nothing is checked, nothing is blocked', () async {
    final r = await checkIntegrity(dir: dir.path);
    expect(r.status, IntegrityStatus.manifestMissing);
  });

  test('every file matches its recorded hash: passes', () async {
    await File(p.join(dir.path, 'installed_files.sha256')).writeAsString(
      '${await hashOf('app.exe')} *app.exe\n${await hashOf('engine.dll')} *engine.dll\n',
    );
    final r = await checkIntegrity(dir: dir.path);
    expect(r.status, IntegrityStatus.ok);
    expect(r.changed, isEmpty);
  });

  test('a file edited after install is caught by name, the untouched one is not', () async {
    await File(p.join(dir.path, 'installed_files.sha256')).writeAsString(
      '${await hashOf('app.exe')} *app.exe\n${await hashOf('engine.dll')} *engine.dll\n',
    );
    await File(p.join(dir.path, 'engine.dll')).writeAsString('patched');
    final r = await checkIntegrity(dir: dir.path);
    expect(r.status, IntegrityStatus.mismatch);
    expect(r.changed, ['engine.dll']);
  });

  test('a file removed after install is also caught', () async {
    await File(p.join(dir.path, 'installed_files.sha256')).writeAsString(
      '${await hashOf('app.exe')} *app.exe\n${await hashOf('engine.dll')} *engine.dll\n',
    );
    await File(p.join(dir.path, 'engine.dll')).delete();
    final r = await checkIntegrity(dir: dir.path);
    expect(r.status, IntegrityStatus.mismatch);
    expect(r.changed, ['engine.dll']);
  });
}
