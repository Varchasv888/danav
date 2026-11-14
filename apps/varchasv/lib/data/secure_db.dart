import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqlite3/sqlite3.dart';

import 'device_key.dart';

/// Why the device database could not be opened.
class DeviceDbException implements Exception {
  DeviceDbException(this.code);

  /// not_encrypted: the SQLite linked into the app has no encryption, so nothing would be protected. wrong_key: the file is encrypted with another key.
  final String code;
  @override
  String toString() => 'DeviceDbException($code)';
}

/// The SQLCipher statement that unlocks a file with a raw 256-bit key.
String keyPragma(String hex) => 'PRAGMA key = "x\'$hex\'";';

/// True when the linked SQLite is SQLCipher (it answers `cipher_version`; plain SQLite answers nothing).
bool hasCipher(Database db) => db.select('PRAGMA cipher_version;').isNotEmpty;

/// Unlocks an opened database and proves it worked. Refuses to carry on without encryption, or with the wrong key.
void unlock(Database raw, String hex) {
  raw.execute(keyPragma(hex));
  if (!hasCipher(raw)) throw DeviceDbException('not_encrypted');
  try {
    raw.select('SELECT count(*) FROM sqlite_master;');
  } on SqliteException {
    throw DeviceDbException('wrong_key');
  }
}

/// A file that opens with no key and has tables: a database from before encryption was switched on. An empty or missing file is not one.
bool isPlainDatabase(File f) {
  if (!f.existsSync() || f.lengthSync() == 0) return false;
  final db = sqlite3.open(f.path);
  try {
    db.select('SELECT count(*) FROM sqlite_master;');
    return true;
  } on SqliteException {
    return false;
  } finally {
    db.close();
  }
}

/// Rewrites a plain database file as an encrypted one with the same contents and schema version, replacing the original only when the copy is complete.
void encryptInPlace(File f, String hex) {
  final tmp = File('${f.path}.enc');
  if (tmp.existsSync()) tmp.deleteSync();
  final plain = sqlite3.open(f.path);
  try {
    if (!hasCipher(plain)) throw DeviceDbException('not_encrypted');
    final version = plain.select('PRAGMA user_version;').first.values.first as int;
    plain.execute('ATTACH DATABASE \'${tmp.path.replaceAll("'", "''")}\' AS encrypted KEY "x\'$hex\'";');
    plain.select("SELECT sqlcipher_export('encrypted');");
    plain.execute('PRAGMA encrypted.user_version = $version;');
    plain.execute('DETACH DATABASE encrypted;');
  } on Object {
    if (tmp.existsSync()) tmp.deleteSync();
    rethrow;
  } finally {
    plain.close();
  }
  for (final suffix in ['', '-wal', '-shm', '-journal']) {
    final old = File('${f.path}$suffix');
    if (old.existsSync()) old.deleteSync();
  }
  tmp.renameSync(f.path);
}

/// The device database: encrypted with the key from [store], made the first time and upgraded in place if an older plain file is found. Opens in a
/// background isolate; never falls back to an unencrypted file.
QueryExecutor openEncrypted(Future<File> Function() file, KeyStore store) => LazyDatabase(() async {
      final f = await file();
      final key = await deviceDbKey(store);
      if (isPlainDatabase(f)) encryptInPlace(f, key);
      return NativeDatabase.createInBackground(f, setup: (raw) => unlock(raw, key));
    });

/// The app's own database file, where it has always been (the documents folder), now encrypted with a key held in the secure store.
QueryExecutor openDeviceExecutor([KeyStore? store]) => openEncrypted(() async => File(p.join((await getApplicationDocumentsDirectory()).path, 'varchasv.sqlite')), store ?? SecureKeyStore());
