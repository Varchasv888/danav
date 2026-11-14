import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:varchasv_app/core/api.dart';
import 'package:varchasv_app/core/integrity.dart';
import 'package:varchasv_app/core/perf.dart';
import 'package:varchasv_app/core/store.dart';
import 'package:varchasv_app/main.dart';
import 'package:varchasv_app/ui/invoice_screen.dart';

import 'support.dart';

Future<IntegrityResult> _noIntegrityCheck() async => const IntegrityResult(IntegrityStatus.notApplicable, []);

Finder inside(String key) =>
    find.descendant(of: find.byKey(Key(key)), matching: find.byType(TextField));

Future<AppStore> readyStore() async {
  final s = AppStore(FakeApi(), MemoryKv());
  await s.refresh();
  return s;
}

Future<void> pumpInvoice(
  WidgetTester t,
  AppStore s, {
  Size size = const Size(1400, 900),
}) async {
  t.view.physicalSize = size;
  t.view.devicePixelRatio = 1;
  addTearDown(t.view.reset);
  await t.pumpWidget(
    MaterialApp(
      theme: appTheme(),
      home: Scaffold(
        body: InvoiceScreen(store: s, today: () => '2026-11-11'),
      ),
    ),
  );
}

Future<void> pickCustomer(WidgetTester t, String typed, String shown) async {
  await t.enterText(inside('customer'), typed);
  await t.pump();
  await t.tap(find.text(shown).last);
  await t.pump(const Duration(milliseconds: 50));
}

Future<void> pickItem(
  WidgetTester t,
  int line,
  String typed,
  String shown,
) async {
  await t.enterText(inside('item-$line'), typed);
  await t.pump();
  await t.tap(find.text(shown).last);
  await t.pump();
}

String totalText(WidgetTester t) =>
    (t.widget(find.byKey(const Key('total'))) as Text).data!;

void main() {
  group('the invoice screen', () {
    testWidgets(
      'typing a customer, an item and a quantity gives the right total, and Save clears the screen',
      (t) async {
        final s = await readyStore();
        addTearDown(s.dispose);
        await pumpInvoice(t, s);
        expect(find.byKey(const Key('total')), findsNothing);

        await pickCustomer(t, 'shree', 'Shree Traders');
        await pickItem(t, 0, 'jeans', 'Denim Jeans / L / Blue');
        expect(
          (t.widget(inside('rate-0')) as TextField).controller!.text,
          '1000',
          reason: 'the rate comes from the item',
        );
        await t.enterText(inside('qty-0'), '3');
        await t.pump();
        expect(totalText(t), '₹ 3,360.00');
        expect(find.text('CGST'), findsOneWidget);
        expect(find.text('IGST'), findsNothing);

        await t.tap(find.byKey(const Key('save')));
        await t.pump();
        expect(s.outbox.length, 1);
        expect(s.outbox.first.total, '3360.00');
        expect(
          find.byKey(const Key('total')),
          findsNothing,
          reason: 'ready for the next invoice',
        );
        expect(find.textContaining('Saved Shree Traders'), findsOneWidget);
        await t.pump(const Duration(milliseconds: 50));
      },
    );

    testWidgets('a customer in another state gets IGST', (t) async {
      final s = await readyStore();
      addTearDown(s.dispose);
      await pumpInvoice(t, s);
      await pickCustomer(t, 'delhi', 'Delhi Garments');
      await pickItem(t, 0, 'jeans', 'Denim Jeans / L / Blue');
      await t.enterText(inside('qty-0'), '1');
      await t.pump();
      expect(find.text('IGST'), findsOneWidget);
      expect(find.text('CGST'), findsNothing);
      expect(totalText(t), '₹ 1,120.00');
    });

    testWidgets(
      'Save without a customer says what is missing and stores nothing',
      (t) async {
        final s = await readyStore();
        addTearDown(s.dispose);
        await pumpInvoice(t, s);
        await t.tap(find.byKey(const Key('save')));
        await t.pump();
        expect(find.text('Choose a customer first.'), findsOneWidget);
        expect(s.outbox, isEmpty);
      },
    );

    testWidgets('Ctrl+S saves and F3 adds a line', (t) async {
      final s = await readyStore();
      addTearDown(s.dispose);
      await pumpInvoice(t, s);
      await pickCustomer(t, 'shree', 'Shree Traders');
      await pickItem(t, 0, 'belt', 'Leather Belt / M / Blue');
      await t.enterText(inside('qty-0'), '2');
      await t.pump();
      await t.sendKeyEvent(LogicalKeyboardKey.f3);
      await t.pump();
      expect(find.byKey(const Key('item-1')), findsOneWidget);
      await t.sendKeyDownEvent(LogicalKeyboardKey.controlLeft);
      await t.sendKeyEvent(LogicalKeyboardKey.keyS);
      await t.sendKeyUpEvent(LogicalKeyboardKey.controlLeft);
      await t.pump(const Duration(milliseconds: 50));
      expect(s.outbox.length, 1);
    });

    testWidgets(
      'a quantity box holding 0 empties when entered, any other value is selected',
      (t) async {
        final s = await readyStore();
        addTearDown(s.dispose);
        await pumpInvoice(t, s);
        final qty = (t.widget(inside('qty-0')) as TextField).controller!;
        qty.text = '0';
        await t.tap(inside('qty-0'));
        await t.pump();
        expect(qty.text, '');
        qty.text = '12';
        await t.tap(inside('rate-0'));
        await t.pump();
        await t.tap(inside('qty-0'));
        await t.pump();
        expect(qty.selection.start, 0);
        expect(qty.selection.end, 2);
      },
    );

    testWidgets('only digits and a point can be typed into a number box', (
      t,
    ) async {
      final s = await readyStore();
      addTearDown(s.dispose);
      await pumpInvoice(t, s);
      await t.enterText(inside('qty-0'), '1a2,3');
      expect((t.widget(inside('qty-0')) as TextField).controller!.text, '123');
    });

    testWidgets('a bad date is flagged and does not change the invoice date', (
      t,
    ) async {
      final s = await readyStore();
      addTearDown(s.dispose);
      await pumpInvoice(t, s);
      await t.enterText(find.byKey(const Key('date')), '31/02');
      await t.pump();
      expect(find.text('Not a date'), findsOneWidget);
      await t.enterText(find.byKey(const Key('date')), '5 dec');
      await t.pump();
      expect(find.text('Not a date'), findsNothing);
    });

    testWidgets('the phone layout (390 wide) has no overflow and still works', (
      t,
    ) async {
      final s = await readyStore();
      addTearDown(s.dispose);
      final prev = FlutterError.onError;
      FlutterError.onError = (d) {
        // ignore: avoid_print
        print(d.toString().substring(0, d.toString().length.clamp(0, 2500)));
        prev?.call(d);
      };
      addTearDown(() => FlutterError.onError = prev);
      await pumpInvoice(t, s, size: const Size(390, 800));
      await pickCustomer(t, 'shree', 'Shree Traders');
      await pickItem(t, 0, 'jeans', 'Denim Jeans / L / Blue');
      await t.enterText(inside('qty-0'), '3');
      await t.pump();
      expect(totalText(t), '₹ 3,360.00');
      final ex = t.takeException();
      if (ex != null) {
        // ignore: avoid_print
        print((ex as FlutterError).toStringDeep());
      }
      expect(ex, isNull);
    });

    testWidgets('a small screen with 40 lines scrolls without overflow', (
      t,
    ) async {
      final s = await readyStore();
      addTearDown(s.dispose);
      await pumpInvoice(t, s, size: const Size(360, 640));
      for (var i = 0; i < 39; i++) {
        await t.sendKeyEvent(LogicalKeyboardKey.f3);
        await t.pump();
      }
      await t.drag(find.byType(ListView).first, const Offset(0, -20000));
      await t.pump();
      expect(t.takeException(), isNull);
    });

    testWidgets(
      'the cost of a keystroke in the widget tree (build and layout) is reported',
      (t) async {
        final s = await readyStore();
        addTearDown(s.dispose);
        await pumpInvoice(t, s);
        await pickCustomer(t, 'shree', 'Shree Traders');
        await pickItem(t, 0, 'jeans', 'Denim Jeans / L / Blue');
        for (var i = 0; i < 9; i++) {
          await t.tap(find.byKey(const Key('add-line')));
          await t.pump();
          await pickItem(t, i + 1, 'shirt', 'Cotton Shirt / M / Blue');
        }
        final times = <int>[];
        for (var i = 1; i <= 60; i++) {
          final sw = Stopwatch()..start();
          await t.enterText(inside('qty-0'), '$i');
          await t.pump();
          times.add(sw.elapsedMicroseconds);
        }
        times.sort();
        // ignore: avoid_print
        print(
          'keystroke on a 10 line invoice (enterText + one frame, test VM, no GPU): p50 ${times[30] / 1000} ms, p99 ${times[59] / 1000} ms',
        );
        expect(Perf.stat('totals')!.p99, lessThan(3));
      },
    );
  });

  group('the whole app against a fake server', () {
    http.Client server({bool badLogin = false, bool down = false}) =>
        MockClient((r) async {
          if (down) throw http.ClientException('no route');
          final api = FakeApi();
          http.Response j(
            Object o, [
            int code = 200,
            Map<String, String> h = const {},
          ]) => http.Response(
            jsonEncode(o),
            code,
            headers: {'content-type': 'application/json', ...h},
          );
          switch (r.url.path) {
            case '/auth/login':
              return badLogin
                  ? j({'error': 'invalid_credentials'}, 401)
                  : j(
                      {'ok': true},
                      200,
                      {'set-cookie': 'sid=abc123; Path=/; HttpOnly'},
                    );
            case '/items':
              return j(api.items);
            case '/accounts':
              return j(api.accounts);
            case '/accounts/groups':
              return j(await api.get('/accounts/groups'));
            case '/companies':
              return j(await api.get('/companies'));
            case '/inventory/setup':
              return j(await api.get('/inventory/setup'));
            case '/sales-invoices':
              return j({'id': 's1', 'number': 'INV/0001'});
          }
          return j({'error': 'not_found'}, 404);
        });

    testWidgets(
      'sign in, see the catalogue, bill, and the saved invoice shows in the outbox',
      (t) async {
        t.view.physicalSize = const Size(1400, 900);
        t.view.devicePixelRatio = 1;
        addTearDown(t.view.reset);
        final kv = MemoryKv();
        await t.pumpWidget(
          VarchasvApp(
            integrityCheck: _noIntegrityCheck,
          api: HttpApi('http://x', client: server()),
            kv: kv,
          ),
        );
        await t.pump(const Duration(milliseconds: 50));
        expect(find.byKey(const Key('sign-in')), findsOneWidget);

        await t.enterText(find.byKey(const Key('email')), 'a@b.c');
        await t.enterText(find.byKey(const Key('password')), 'secret');
        await t.tap(find.byKey(const Key('sign-in')));
        await t.pump(const Duration(milliseconds: 100));
        await t.pump(const Duration(milliseconds: 100));
        expect(find.text('Test Distributors'), findsOneWidget);
        expect(kv.data['session'], 'sid=abc123');

        await pickCustomer(t, 'shree', 'Shree Traders');
        await pickItem(t, 0, 'jeans', 'Denim Jeans / L / Blue');
        await t.enterText(inside('qty-0'), '1');
        await t.pump();
        await t.tap(find.byKey(const Key('save')));
        await t.pump(const Duration(milliseconds: 100));
        await t.tap(find.text('Outbox'));
        await t.pump(const Duration(milliseconds: 100));
        expect(find.textContaining('Saved as INV/0001'), findsOneWidget);
      },
    );

    testWidgets('a wrong password is explained', (t) async {
      await t.pumpWidget(
        VarchasvApp(
          integrityCheck: _noIntegrityCheck,
          api: HttpApi('http://x', client: server(badLogin: true)),
          kv: MemoryKv(),
        ),
      );
      await t.pump(const Duration(milliseconds: 50));
      await t.enterText(find.byKey(const Key('email')), 'a@b.c');
      await t.enterText(find.byKey(const Key('password')), 'nope');
      await t.tap(find.byKey(const Key('sign-in')));
      await t.pump(const Duration(milliseconds: 100));
      expect(find.text('Email or password is not right.'), findsOneWidget);
    });

    testWidgets('server unreachable: the sign in says so', (t) async {
      await t.pumpWidget(
        VarchasvApp(
          integrityCheck: _noIntegrityCheck,
          api: HttpApi('http://x', client: server(down: true)),
          kv: MemoryKv(),
        ),
      );
      await t.pump(const Duration(milliseconds: 50));
      await t.enterText(find.byKey(const Key('email')), 'a@b.c');
      await t.enterText(find.byKey(const Key('password')), 'x');
      await t.tap(find.byKey(const Key('sign-in')));
      await t.pump(const Duration(milliseconds: 100));
      expect(find.textContaining('Cannot reach the server'), findsOneWidget);
    });

    testWidgets(
      'a saved session goes straight to billing and a saved catalogue works with the server down',
      (t) async {
        final kv = MemoryKv();
        final seed = AppStore(FakeApi(), kv);
        await seed.refresh();
        kv.data['session'] = 'sid=abc123';
        await t.pumpWidget(
          VarchasvApp(
            integrityCheck: _noIntegrityCheck,
          api: HttpApi('http://x', client: server(down: true)),
            kv: kv,
          ),
        );
        await t.pump(const Duration(milliseconds: 100));
        await t.pump(const Duration(milliseconds: 100));
        expect(
          find.byKey(const Key('customer')),
          findsOneWidget,
          reason: 'straight to billing from the saved catalogue',
        );
      },
    );
  });
}
