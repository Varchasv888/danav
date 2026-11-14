import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import 'core/api.dart';
import 'core/integrity.dart';
import 'core/kv_io.dart' if (dart.library.js_interop) 'core/kv_web.dart';
import 'core/perf.dart';
import 'core/store.dart';
import 'ui/home.dart';
import 'ui/login.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  watchFrames();
  runApp(const VarchasvApp());
}

/// Records how long the engine itself takes for every frame (building the widgets, and drawing them), so the settings screen shows real figures from this device.
void watchFrames() {
  SchedulerBinding.instance.addTimingsCallback((timings) {
    for (final t in timings) {
      Perf.record('frame build', t.buildDuration.inMicroseconds);
      Perf.record('frame draw', t.rasterDuration.inMicroseconds);
    }
  });
}

ThemeData appTheme() {
  const navy = Color(0xFF14284B);
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: navy, primary: navy),
    visualDensity: VisualDensity.compact,
    inputDecorationTheme: const InputDecorationTheme(
      border: OutlineInputBorder(),
      isDense: true,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: navy,
      foregroundColor: Colors.white,
    ),
  );
}

class VarchasvApp extends StatefulWidget {
  /// Tests pass their own pieces; the real app builds them from the device.
  final HttpApi? api;
  final KeyValue? kv;
  final Future<IntegrityResult> Function()? integrityCheck;
  const VarchasvApp({super.key, this.api, this.kv, this.integrityCheck});

  @override
  State<VarchasvApp> createState() => _VarchasvAppState();
}

enum _Stage { loading, login, home, tampered }

class _VarchasvAppState extends State<VarchasvApp> {
  late final KeyValue kv = widget.kv ?? platformKv();
  late final HttpApi api = widget.api ?? HttpApi('http://localhost:4100');
  late final AppStore store = AppStore(api, kv);
  AppSettings settings = AppSettings();
  _Stage stage = _Stage.loading;
  List<String> tamperedFiles = const [];

  @override
  void initState() {
    super.initState();
    unawaited(_start());
  }

  Future<void> _start() async {
    // Before anything else: is this the file the installer put down? A browser build, or one not run from an install, has nothing to check and passes straight through.
    final integrity = await (widget.integrityCheck ?? checkIntegrity)();
    if (integrity.status == IntegrityStatus.mismatch) {
      if (mounted)
        setState(() {
          stage = _Stage.tampered;
          tamperedFiles = integrity.changed;
        });
      return;
    }
    final raw = await kv.read('settings');
    if (raw != null) {
      try {
        settings = AppSettings.fromJson(
          jsonDecode(raw) as Map<String, dynamic>,
        );
      } catch (_) {}
    }
    api.baseUrl = settings.serverUrl;
    final saved = await kv.read('session');
    api.cookie = (saved == null || saved.isEmpty) ? null : saved;
    await store.init();
    // A saved session that the server still accepts goes straight in.
    var ok = false;
    if (api.cookie != null) {
      try {
        await api.get('/companies');
        ok = true;
      } on ApiException {
        ok = false;
      } on NetworkException {
        ok = store.items.isNotEmpty;
      }
    }
    if (!mounted) return;
    setState(() => stage = ok ? _Stage.home : _Stage.login);
    if (ok) unawaited(store.refresh());
  }

  Future<void> _loggedIn(String url) async {
    settings.serverUrl = url;
    await _saveSettings();
    if (api.cookie != null) await kv.write('session', api.cookie!);
    if (!mounted) return;
    setState(() => stage = _Stage.home);
    unawaited(store.refresh());
    unawaited(store.syncOutbox());
  }

  Future<void> _saveSettings() =>
      kv.write('settings', jsonEncode(settings.toJson()));

  Future<void> _signOut() async {
    api.cookie = null;
    await kv.write('session', '');
    if (mounted) setState(() => stage = _Stage.login);
  }

  @override
  void dispose() {
    store.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Varchasv',
    theme: appTheme(),
    debugShowCheckedModeBanner: false,
    home: switch (stage) {
      _Stage.loading => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      _Stage.tampered => Scaffold(
        body: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.gpp_bad_outlined,
                    size: 48,
                    color: Colors.red,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'This installation has been changed',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'One or more of the installed program files no longer match what the installer put down, so the app will not start. This can happen if a file was edited, replaced, or damaged after installation.',
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Changed files:',
                    style: TextStyle(fontWeight: FontWeight.w600),
                  ),
                  for (final f in tamperedFiles)
                    Text('  $f', key: const Key('tampered-file')),
                  const SizedBox(height: 16),
                  const Text(
                    'Reinstall from the official installer to fix this.',
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      _Stage.login => LoginScreen(
        api: api,
        initialUrl: settings.serverUrl,
        canWorkOffline: store.items.isNotEmpty,
        onLoggedIn: _loggedIn,
        onOffline: () => setState(() => stage = _Stage.home),
      ),
      _Stage.home => HomeShell(
        store: store,
        settings: settings,
        onSaveSettings: _saveSettings,
        onSignOut: _signOut,
      ),
    },
  );
}
