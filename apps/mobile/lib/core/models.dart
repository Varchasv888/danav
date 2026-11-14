/// What the app keeps from the server: just the fields an invoice needs, so the whole catalogue sits in memory and every search is local.
library;

import 'dart:convert';

class Item {
  final String id, name, kind, uom;
  final String? hsn, gstSlab, size, color, barcode;
  final String gstRate, cessRate, saleRate, mrp, stockQty;
  final int slabPieces;
  final List<String> aliases;
  final String hay;

  Item({
    required this.id,
    required this.name,
    this.kind = 'goods',
    this.uom = 'PCS',
    this.hsn,
    this.gstSlab,
    this.size,
    this.color,
    this.barcode,
    this.gstRate = '0',
    this.cessRate = '0',
    this.saleRate = '0',
    this.mrp = '0',
    this.stockQty = '0',
    this.slabPieces = 1,
    this.aliases = const [],
  }) : hay = [
         name,
         hsn ?? '',
         size ?? '',
         color ?? '',
         barcode ?? '',
         ...aliases,
       ].join(' ').toLowerCase();

  factory Item.fromJson(Map<String, dynamic> j) => Item(
    id: j['id'] as String,
    name: (j['name'] ?? '') as String,
    kind: (j['kind'] ?? 'goods') as String,
    uom: (j['uom'] ?? 'PCS') as String,
    hsn: j['hsn'] as String?,
    gstSlab: j['gstSlab'] as String?,
    size: j['size'] as String?,
    color: j['color'] as String?,
    barcode: j['barcode'] as String?,
    gstRate: _s(j['gstRate'], '0'),
    cessRate: _s(j['cessRate'], '0'),
    saleRate: _s(j['saleRate'], '0'),
    mrp: _s(j['mrp'], '0'),
    stockQty: _s(j['stockQty'], '0'),
    slabPieces: (j['slabPieces'] as num?)?.toInt() ?? 1,
    aliases: [
      for (final a in (j['aliases'] as List<dynamic>? ?? const [])) '$a',
    ],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'kind': kind,
    'uom': uom,
    'hsn': hsn,
    'gstSlab': gstSlab,
    'size': size,
    'color': color,
    'barcode': barcode,
    'gstRate': gstRate,
    'cessRate': cessRate,
    'saleRate': saleRate,
    'mrp': mrp,
    'stockQty': stockQty,
    'slabPieces': slabPieces,
    'aliases': aliases,
  };

  String get label => [
    name,
    if (size != null && size!.isNotEmpty) size,
    if (color != null && color!.isNotEmpty) color,
  ].join(' / ');
}

class Customer {
  final String id, name;
  final String? gstin, stateCode, address;
  final int? creditDays;
  final String hay;

  Customer({
    required this.id,
    required this.name,
    this.gstin,
    this.stateCode,
    this.creditDays,
    this.address,
  }) : hay = '$name ${gstin ?? ''}'.toLowerCase();

  factory Customer.fromJson(Map<String, dynamic> j) {
    final a = j['address'];
    final addr = a is Map
        ? [
            a['line1'],
            a['line2'],
            a['city'],
            a['pincode'],
          ].where((x) => x != null && '$x'.isNotEmpty).join(', ')
        : null;
    return Customer(
      id: j['id'] as String,
      name: (j['name'] ?? '') as String,
      gstin: j['gstin'] as String?,
      stateCode: j['stateCode'] as String?,
      creditDays: (j['creditDays'] as num?)?.toInt(),
      address: addr,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'gstin': gstin,
    'stateCode': stateCode,
    'creditDays': creditDays,
    'address': address == null ? null : {'line1': address},
  };
}

String _s(Object? v, String d) => v == null ? d : '$v';

/// An invoice saved on this device, waiting to reach the server (or already there).
enum SyncState { pending, syncing, synced, failed, unsure }

class OutboxEntry {
  final String localId;
  final DateTime createdAt;
  final String customerName;
  final String total;
  final Map<String, dynamic> payload;
  SyncState state;
  String? error, serverId, number;

  OutboxEntry({
    required this.localId,
    required this.createdAt,
    required this.customerName,
    required this.total,
    required this.payload,
    this.state = SyncState.pending,
    this.error,
    this.serverId,
    this.number,
  });

  String? _enc;
  String? _encFor;

  /// The entry as JSON text, kept until something about it changes.
  String encoded() {
    final sig = '${state.index}|$error|$serverId|$number';
    if (_enc == null || _encFor != sig) {
      _enc = jsonEncode(toJson());
      _encFor = sig;
    }
    return _enc!;
  }

  Map<String, dynamic> toJson() => {
    'localId': localId,
    'createdAt': createdAt.toIso8601String(),
    'customerName': customerName,
    'total': total,
    'payload': payload,
    'state': state.name,
    'error': error,
    'serverId': serverId,
    'number': number,
  };

  factory OutboxEntry.fromJson(Map<String, dynamic> j) => OutboxEntry(
    localId: j['localId'] as String,
    createdAt: DateTime.parse(j['createdAt'] as String),
    customerName: j['customerName'] as String,
    total: j['total'] as String,
    payload: Map<String, dynamic>.from(j['payload'] as Map),
    state: SyncState.values.byName(j['state'] as String),
    error: j['error'] as String?,
    serverId: j['serverId'] as String?,
    number: j['number'] as String?,
  );
}
