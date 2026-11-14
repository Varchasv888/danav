import 'dart:io';
import 'dart:math';

import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sqlite3/sqlite3.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/data/device_key.dart';
import 'package:varchasv/data/secure_db.dart';

void main() {
  late Directory dir;
  setUp(() => dir = Directory.systemTemp.createTempSync('varchasv_db_'));
  tearDown(() => dir.deleteSync(recursive: true));

  group('the database key', () {
    test('is 256 random bits, made once and read back every time', () async {
      final store = MemoryKeyStore();
      final a = await deviceDbKey(store);
      expect(a, matches(RegExp(r'^[0-9a-f]{64}$')));
      expect(await deviceDbKey(store), a);
      expect(await deviceDbKey(MemoryKeyStore()), isNot(a));
    });

    test('is never silently replaced when the stored one is damaged', () async {
      final store = MemoryKeyStore();
      await store.write('not a key');
      await expectLater(deviceDbKey(store), throwsStateError);
      final fresh = await deviceDbKey(store, replaceBroken: true, random: Random(1));
      expect(fresh, matches(RegExp(r'^[0-9a-f]{64}$')));
    });
  });

  group('an encrypted file', () {
    test('this build links SQLCipher, so a key really encrypts', () {
      final db = sqlite3.openInMemory();
      expect(hasCipher(db), isTrue);
      db.close();
    });

    test('cannot be read without the key or with another, and keeps its data and schema version', () {
      final f = File('${dir.path}/plain.sqlite');
      final plain = sqlite3.open(f.path);
      plain.execute('CREATE TABLE notes (t TEXT);');
      plain.execute("INSERT INTO notes VALUES ('SECRET-MARKER-12345');");
      plain.execute('PRAGMA user_version = 5;');
      plain.close();
      expect(isPlainDatabase(f), isTrue);
      expect(String.fromCharCodes(f.readAsBytesSync()), contains('SECRET-MARKER-12345'));

      const key = 'aa11bb22cc33dd44ee55ff6600770088aa11bb22cc33dd44ee55ff6600770088';
      encryptInPlace(f, key);

      expect(isPlainDatabase(f), isFalse);
      expect(String.fromCharCodes(f.readAsBytesSync()), isNot(contains('SECRET-MARKER-12345')));
      final bare = sqlite3.open(f.path);
      expect(() => bare.select('SELECT count(*) FROM sqlite_master;'), throwsA(isA<SqliteException>()));
      bare.close();

      final wrong = sqlite3.open(f.path);
      expect(() => unlock(wrong, '00' * 32), throwsA(isA<DeviceDbException>().having((e) => e.code, 'code', 'wrong_key')));
      wrong.close();

      final right = sqlite3.open(f.path);
      unlock(right, key);
      expect(right.select('SELECT t FROM notes;').first['t'], 'SECRET-MARKER-12345');
      expect(right.select('PRAGMA user_version;').first.values.first, 5);
      right.close();
      expect(File('${f.path}.enc').existsSync(), isFalse);
    });
  });

  group('the device database', () {
    test('is made encrypted, keeps what is saved across a restart, and upgrades an older plain file in place', () async {
      final f = File('${dir.path}/varchasv.sqlite');
      final store = MemoryKeyStore();

      var db = LocalDb(openEncrypted(() async => f, store));
      await db.setMeta('deviceId', 'SECRET-DEVICE-777');
      await db.close();
      expect(String.fromCharCodes(f.readAsBytesSync()), isNot(contains('SECRET-DEVICE-777')));

      db = LocalDb(openEncrypted(() async => f, store));
      expect(await db.getMeta('deviceId'), 'SECRET-DEVICE-777');
      await db.close();

      // Another key (a reinstalled app that lost its secure store) cannot open it.
      final stranger = LocalDb(openEncrypted(() async => f, MemoryKeyStore()));
      await expectLater(stranger.getMeta('deviceId'), throwsA(anything));
      await stranger.close().catchError((_) {});

      // A database made before encryption existed is encrypted on first open, with its data.
      final old = File('${dir.path}/old.sqlite');
      final legacy = LocalDb(NativeDatabase(old));
      await legacy.setMeta('deviceId', 'LEGACY-DEVICE-1');
      await legacy.close();
      expect(isPlainDatabase(old), isTrue);
      final upgraded = LocalDb(openEncrypted(() async => old, store));
      expect(await upgraded.getMeta('deviceId'), 'LEGACY-DEVICE-1');
      await upgraded.close();
      expect(isPlainDatabase(old), isFalse);
    });
  });
}
