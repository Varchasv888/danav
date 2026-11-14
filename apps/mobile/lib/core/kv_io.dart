import 'dart:io';

import 'package:path_provider/path_provider.dart';

import 'store.dart';

/// Keeps the catalogue and the outbox as files in the app's own folder, so a large catalogue is read and written in one go and nothing is lost if the app is closed.
class FileKv implements KeyValue {
  Directory? _dir;

  Future<File> _file(String key) async {
    _dir ??= await getApplicationSupportDirectory();
    return File('${_dir!.path}${Platform.pathSeparator}varchasv_$key.json');
  }

  @override
  Future<String?> read(String key) async {
    final f = await _file(key);
    return await f.exists() ? f.readAsString() : null;
  }

  @override
  Future<void> write(String key, String value) async {
    final f = await _file(key);
    final tmp = File('${f.path}.tmp');
    await tmp.writeAsString(value, flush: true);
    await tmp.rename(f.path);
  }
}

KeyValue platformKv() => FileKv();
