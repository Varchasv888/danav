import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'app_state.dart';
import 'data/database.dart';
import 'l10n/gen/app_localizations.dart';
import 'ui/connect_screen.dart';
import 'ui/home.dart';
import 'ui/theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final state = AppState(LocalDb())..load();
  runApp(VarchasvApp(state: state));
}

/// Offline Varchasv app (Windows, macOS, Linux, Android, iOS). The books live in a local database;
/// the cloud is reached only to connect once and to sync.
class VarchasvApp extends StatefulWidget {
  const VarchasvApp({super.key, required this.state});
  final AppState state;

  @override
  State<VarchasvApp> createState() => _VarchasvAppState();
}

class _VarchasvAppState extends State<VarchasvApp> {
  Locale _locale = const Locale('en');
  ThemeMode _themeMode = ThemeMode.system;

  @override
  Widget build(BuildContext context) {
    return AppScope(
      state: widget.state,
      child: MaterialApp(
        onGenerateTitle: (c) => AppLocalizations.of(c).brandFull,
        debugShowCheckedModeBanner: false,
        locale: _locale,
        supportedLocales: AppLocalizations.supportedLocales,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        theme: buildTheme(Brightness.light),
        darkTheme: buildTheme(Brightness.dark),
        themeMode: _themeMode,
        home: ListenableBuilder(
          listenable: widget.state,
          builder: (context, _) {
            if (!widget.state.ready) return const Scaffold(body: Center(child: CircularProgressIndicator()));
            if (!widget.state.connected) return const ConnectScreen();
            return HomeShell(
              locale: _locale,
              themeMode: _themeMode,
              onLocale: (l) => setState(() => _locale = l),
              onThemeMode: (m) => setState(() => _themeMode = m),
            );
          },
        ),
      ),
    );
  }
}
