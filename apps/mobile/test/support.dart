import 'package:varchasv_app/core/api.dart';
import 'package:varchasv_app/core/models.dart';

/// A server in memory for tests: answers the catalogue calls, takes invoices, and can be told to fail in the ways a real network does.
class FakeApi implements ApiPort {
  final List<Map<String, dynamic>> items;
  final List<Map<String, dynamic>> accounts;
  final List<Map<String, dynamic>> posted = [];
  int posts = 0;
  int gets = 0;

  /// Called before each invoice post; may throw to simulate a failure.
  void Function(int n, Map<String, dynamic> body)? onPost;
  Duration latency = Duration.zero;
  bool offline = false;

  FakeApi({
    List<Map<String, dynamic>>? items,
    List<Map<String, dynamic>>? accounts,
  }) : items = items ?? defaultItems(),
       accounts = accounts ?? defaultCustomers();

  static List<Map<String, dynamic>> defaultItems() => [
    for (var i = 0; i < 6; i++)
      {
        'id': 'i$i',
        'name': [
          'Polo T-Shirt',
          'Denim Jeans',
          'Cotton Shirt',
          'Track Pant',
          'Leather Belt',
          'Socks Pack',
        ][i],
        'hsn': '6109',
        'gstRate': '12',
        'gstSlab': i == 0 ? 'apparel' : null,
        'saleRate': '${(i + 1) * 500}',
        'stockQty': '${100 + i}',
        'size': i.isEven ? 'M' : 'L',
        'color': 'Blue',
      },
  ];

  static List<Map<String, dynamic>> defaultCustomers() => [
    {
      'id': 'c1',
      'name': 'Shree Traders',
      'groupId': 'g-deb',
      'gstin': '27AAAAA0000A1Z5',
      'stateCode': '27',
    },
    {
      'id': 'c2',
      'name': 'Delhi Garments',
      'groupId': 'g-deb',
      'gstin': '07BBBBB0000B1Z5',
      'stateCode': '07',
    },
    {
      'id': 'c3',
      'name': 'Some Supplier',
      'groupId': 'g-cred',
      'stateCode': '27',
    },
  ];

  Future<void> _wait() async {
    if (offline) throw NetworkException('offline');
    if (latency > Duration.zero) await Future<void>.delayed(latency);
  }

  @override
  Future<dynamic> get(String path) async {
    gets++;
    await _wait();
    switch (path) {
      case '/items':
        return items;
      case '/accounts':
        return accounts;
      case '/accounts/groups':
        return [
          {'id': 'g-deb', 'key': 'sundry_debtors', 'parentId': null},
          {'id': 'g-cred', 'key': 'sundry_creditors', 'parentId': null},
        ];
      case '/companies':
        return [
          {
            'name': 'Test Distributors',
            'branches': [
              {'isHeadOffice': true, 'stateCode': '27'},
            ],
          },
        ];
      case '/inventory/setup':
        return {
          'warehouses': [
            {'id': 'w1', 'name': 'Main', 'archived': false},
          ],
        };
    }
    if (path.startsWith('/customers/'))
      return {'balance': '1500.00', 'overdue': '0'};
    throw ApiException(404, 'not_found');
  }

  @override
  Future<dynamic> post(String path, Object body) async {
    await _wait();
    posts++;
    final b = body as Map<String, dynamic>;
    onPost?.call(posts, b);
    posted.add(b);
    return {
      'id': 'srv-${posted.length}',
      'number': 'INV/${posted.length.toString().padLeft(4, '0')}',
    };
  }

  @override
  Future<List<int>> getBytes(String path) async => [];
}

Item item(
  String id,
  String name, {
  String gstRate = '12',
  String? slab,
  String saleRate = '0',
}) => Item(
  id: id,
  name: name,
  gstRate: gstRate,
  gstSlab: slab,
  saleRate: saleRate,
);
