// A benchmark build of the app: the real screens on a large generated catalogue and a server that answers instantly, so what is measured is the app and not the network.
// Run:  flutter run -d windows --profile -t tool/bench_main.dart      (or build web / apk with -t tool/bench_main.dart)
// Then bill as usual and read Settings > "How fast it is on this device".
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:varchasv_app/core/api.dart';
import 'package:varchasv_app/core/store.dart';
import 'package:varchasv_app/main.dart';
import 'package:varchasv_app/ui/home.dart';

class _InstantServer implements ApiPort {
  final List<Map<String, dynamic>> items, customers;
  int posted = 0;
  _InstantServer(this.items, this.customers);

  @override
  Future<dynamic> get(String path) async {
    switch (path) {
      case '/items':
        return items;
      case '/accounts':
        return customers;
      case '/accounts/groups':
        return [
          {'id': 'g', 'key': 'sundry_debtors', 'parentId': null},
        ];
      case '/companies':
        return [
          {
            'name': 'Benchmark Traders',
            'branches': [
              {'isHeadOffice': true, 'stateCode': '27'},
            ],
          },
        ];
      case '/inventory/setup':
        return {'warehouses': []};
    }
    return {'balance': '0', 'overdue': '0'};
  }

  @override
  Future<dynamic> post(String path, Object body) async => {
    'id': 's${++posted}',
    'number': 'B/${posted.toString().padLeft(5, '0')}',
  };

  @override
  Future<List<int>> getBytes(String path) async => [];
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  watchFrames();
  const n = int.fromEnvironment('ITEMS', defaultValue: 50000);
  final r = Random(1);
  const words = [
    'Polo',
    'Denim',
    'Cotton',
    'Track',
    'Leather',
    'Socks',
    'Shirt',
    'Jeans',
    'Belt',
    'Jacket',
    'Kurta',
    'Saree',
    'Vest',
    'Brief',
    'Cap',
    'Shoe',
  ];
  final items = [
    for (var i = 0; i < n; i++)
      {
        'id': 'i$i',
        'name': '${words[r.nextInt(16)]} ${words[r.nextInt(16)]} ${1000 + i}',
        'hsn': '${6100 + r.nextInt(99)}',
        'gstRate': '12',
        'gstSlab': i % 3 == 0 ? 'apparel' : null,
        'saleRate': '${300 + r.nextInt(4000)}',
        'stockQty': '${r.nextInt(500)}',
        'size': ['S', 'M', 'L', 'XL'][r.nextInt(4)],
        'color': ['Red', 'Blue', 'Black'][r.nextInt(3)],
        'barcode': '89012${100000 + i}',
      },
  ];
  final customers = [
    for (var i = 0; i < 2000; i++)
      {
        'id': 'c$i',
        'name': 'Customer ${words[r.nextInt(16)]} $i',
        'groupId': 'g',
        'gstin': '27AAAAA${1000 + i}A1Z5',
        'stateCode': i % 5 == 0 ? '07' : '27',
      },
  ];
  final store = AppStore(_InstantServer(items, customers), MemoryKv());
  final sw = Stopwatch()..start();
  await store.refresh();
  // ignore: avoid_print
  print(
    'catalogue of $n items loaded and indexed in ${sw.elapsedMilliseconds} ms',
  );
  runApp(
    MaterialApp(
      title: 'Varchasv benchmark',
      theme: appTheme(),
      debugShowCheckedModeBanner: false,
      home: HomeShell(
        store: store,
        settings: AppSettings(),
        onSaveSettings: () async {},
        onSignOut: () {},
      ),
    ),
  );
}
