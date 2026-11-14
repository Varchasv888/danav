import 'package:shared_preferences/shared_preferences.dart';

import 'store.dart';

/// In a browser the browser's own storage keeps the data.
class PrefsKv implements KeyValue {
  @override
  Future<String?> read(String key) async =>
      (await SharedPreferences.getInstance()).getString('varchasv_$key');

  @override
  Future<void> write(String key, String value) async =>
      (await SharedPreferences.getInstance()).setString('varchasv_$key', value);
}

KeyValue platformKv() => PrefsKv();
