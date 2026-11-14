/// A check that the running program is the file the installer put down, not one that has been patched afterwards. It is not a defence against every kind of attack
/// (memory patching and API hooking leave no trace here), but it catches the common case: someone edits the installed exe or its engine DLL to remove a check or
/// change behaviour. The installer writes the SHA-256 of each file it places next to it, in installed_files.sha256; this reads that file back and recomputes the
/// hashes. A browser build has nothing to check (there is no installed file) and always passes.
library;

import 'integrity_stub.dart' if (dart.library.io) 'integrity_io.dart' as impl;

enum IntegrityStatus { notApplicable, ok, manifestMissing, mismatch }

class IntegrityResult {
  final IntegrityStatus status;
  final List<String> changed;
  const IntegrityResult(this.status, this.changed);
}

/// [dir] overrides the folder to check (tests only); production always checks the folder the running executable lives in.
Future<IntegrityResult> checkIntegrity({String? dir}) =>
    impl.checkIntegrity(dir: dir);
