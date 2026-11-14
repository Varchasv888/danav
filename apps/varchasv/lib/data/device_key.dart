import 'dart:math';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Where the device keeps the key to its own database: in the phone's secure store (Keystore on Android, Keychain on iOS and macOS), never in
/// the database or in the app's files, so copying the database file off the device gives nothing readable.
abstract class KeyStore {
  Future<String?> read();
  Future<void> write(String hex);
}

class SecureKeyStore implements KeyStore {
  SecureKeyStore([FlutterSecureStorage? storage]) : _storage = storage ?? const FlutterSecureStorage(aOptions: AndroidOptions(encryptedSharedPreferences: true));
  final FlutterSecureStorage _storage;
  static const _name = 'varchasv.dbkey';

  @override
  Future<String?> read() => _storage.read(key: _name);

  @override
  Future<void> write(String hex) => _storage.write(key: _name, value: hex);
}

/// For tests and tools: the key lives only as long as the object.
class MemoryKeyStore implements KeyStore {
  String? _hex;

  @override
  Future<String?> read() async => _hex;

  @override
  Future<void> write(String hex) async => _hex = hex;
}

final _hex64 = RegExp(r'^[0-9a-f]{64}$');

/// The device's database key: 256 random bits as hex, made the first time and then read back every time. A stored value that does not look like a key
/// is replaced only by [replaceBroken]; otherwise it is an error, because a new key would lock the device out of its own data.
Future<String> deviceDbKey(KeyStore store, {Random? random, bool replaceBroken = false}) async {
  final have = await store.read();
  if (have != null) {
    if (_hex64.hasMatch(have)) return have;
    if (!replaceBroken) throw StateError('The stored database key is damaged.');
  }
  final r = random ?? Random.secure();
  final hex = [for (var i = 0; i < 32; i++) r.nextInt(256).toRadixString(16).padLeft(2, '0')].join();
  await store.write(hex);
  return hex;
}
