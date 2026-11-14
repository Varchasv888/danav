import 'package:drift/native.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/app_state.dart';
import 'package:varchasv/data/database.dart';
import 'package:varchasv/l10n/gen/app_localizations.dart';
import 'package:varchasv/main.dart';
import 'package:varchasv/ui/gst_calculator.dart';

Widget localized(Widget child, Locale locale) => MaterialApp(
      locale: locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [AppLocalizations.delegate, GlobalMaterialLocalizations.delegate, GlobalWidgetsLocalizations.delegate, GlobalCupertinoLocalizations.delegate],
      home: Scaffold(body: SingleChildScrollView(child: child)),
    );

void main() {
  setUp(() {
    // Large desktop-like window.
    final view = TestWidgetsFlutterBinding.instance.platformDispatcher.views.first;
    view.physicalSize = const Size(1280, 900);
    view.devicePixelRatio = 1;
  });

  testWidgets('a device that has never connected shows the connect screen', (tester) async {
    final db = LocalDb(NativeDatabase.memory());
    addTearDown(db.close);
    final state = AppState(db);
    await tester.runAsync(state.load);
    await tester.pumpWidget(VarchasvApp(state: state));
    await tester.pumpAndSettle();
    expect(find.text('Connect this device'), findsOneWidget);
    expect(find.text('Connect'), findsOneWidget);
  });

  testWidgets('the GST calculator works offline in English and Hindi', (tester) async {
    await tester.pumpWidget(localized(const GstCalculatorCard(), const Locale('en')));
    await tester.pumpAndSettle();
    // Defaults: 1 × ₹1000 at 18% within Maharashtra.
    expect(find.text('₹ 1,180.00'), findsOneWidget);
    expect(find.textContaining('Rupees One Thousand One Hundred Eighty Only'), findsOneWidget);

    await tester.pumpWidget(localized(const GstCalculatorCard(), const Locale('hi')));
    await tester.pumpAndSettle();
    expect(find.text('झटपट जीएसटी कैलकुलेटर'), findsOneWidget);
    expect(find.textContaining('एक हज़ार एक सौ अस्सी रुपये मात्र'), findsOneWidget);
  });
}
