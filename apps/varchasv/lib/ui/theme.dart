import 'package:flutter/material.dart';

/// Brand colours shared with the web app (apps/web/app/globals.css).
const brandIndigo = Color(0xFF2B3A8F);
const brandSaffron = Color(0xFFE8891C);

ThemeData buildTheme(Brightness brightness) {
  final scheme = ColorScheme.fromSeed(
    seedColor: brandIndigo,
    brightness: brightness,
    secondary: brandSaffron,
  );
  return ThemeData(
    colorScheme: scheme,
    useMaterial3: true,
    visualDensity: VisualDensity.standard,
    inputDecorationTheme: const InputDecorationTheme(border: OutlineInputBorder(), isDense: true),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: scheme.outlineVariant),
      ),
    ),
  );
}
