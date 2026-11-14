import 'dart:io';

import 'package:crypto/crypto.dart';

import 'integrity.dart';

/// Only on Windows: the installed folder holds installed_files.sha256, one "hexhash *filename" line per file (the format `sha256sum` writes and reads), written by
/// the installer right after it places the files. Android has no equivalent step here; this is a no-op there.
Future<IntegrityResult> checkIntegrity({String? dir}) async {
  if (dir == null && !Platform.isWindows)
    return const IntegrityResult(IntegrityStatus.notApplicable, []);
  final folder = dir ?? File(Platform.resolvedExecutable).parent.path;
  final manifest = File(
    '$folder${Platform.pathSeparator}installed_files.sha256',
  );
  if (!await manifest.exists())
    return const IntegrityResult(IntegrityStatus.manifestMissing, []);
  final changed = <String>[];
  try {
    for (final line in await manifest.readAsLines()) {
      final m = RegExp(r'^([0-9a-f]{64}) \*(.+)$').firstMatch(line.trim());
      if (m == null) continue;
      final want = m.group(1)!, name = m.group(2)!;
      final f = File('$folder${Platform.pathSeparator}$name');
      if (!await f.exists()) {
        changed.add(name);
        continue;
      }
      final got = sha256.convert(await f.readAsBytes()).toString();
      if (got != want) changed.add(name);
    }
  } on FileSystemException {
    return const IntegrityResult(IntegrityStatus.manifestMissing, []);
  }
  return changed.isEmpty
      ? const IntegrityResult(IntegrityStatus.ok, [])
      : IntegrityResult(IntegrityStatus.mismatch, changed);
}
