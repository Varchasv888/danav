/// What the offline app may do for each action. A Dart port of packages/domain/src/offline.ts; both must match
/// spec/fixtures/offline_rules.json. The server serves the same table at /sync/offline-rules, and the app keeps the copy it
/// last received, so a rule changed on the server reaches devices without a new release.
library;

enum OfflineMode {
  /// Done on the device and sent later.
  allowed,

  /// The device shows its last copy but cannot change it.
  readOnly,

  /// Needs the server at the time; refused while offline.
  onlineOnly;

  static OfflineMode? parse(String? v) => switch (v) {
        'allowed' => OfflineMode.allowed,
        'read_only' => OfflineMode.readOnly,
        'online_only' => OfflineMode.onlineOnly,
        _ => null,
      };
}

class OfflineRule {
  const OfflineRule(this.action, this.mode, this.note);
  final String action;
  final OfflineMode mode;
  final String note;
}

/// The rules every build starts with.
const defaultOfflineRules = <OfflineRule>[
  OfflineRule('account.upsert', OfflineMode.allowed, 'Add or edit a customer or supplier.'),
  OfflineRule('voucher.create', OfflineMode.allowed, 'Receipts, payments, journals and contras.'),
  OfflineRule('voucher.cancel', OfflineMode.allowed, 'Cancel a voucher; the server reverses it once.'),
  OfflineRule('attendance.mark', OfflineMode.allowed, 'Mark attendance.'),
  OfflineRule('leave.request', OfflineMode.allowed, 'Ask for leave.'),
  OfflineRule('pos.bill', OfflineMode.allowed, 'Counter bills, with the numbers the device was given.'),
  OfflineRule('expense.claim', OfflineMode.allowed, 'Submit an expense claim.'),
  OfflineRule('sales.order', OfflineMode.allowed, 'Take a sales order.'),
  OfflineRule('stock.count', OfflineMode.allowed, 'Count stock by scanning, as a spot check.'),
  OfflineRule('masters.items', OfflineMode.readOnly, 'Items, prices and stock as of the last sync.'),
  OfflineRule('masters.parties', OfflineMode.readOnly, 'Customers and their balances as of the last sync.'),
  OfflineRule('pos.coupon', OfflineMode.onlineOnly, 'Discount cards and coupons are checked against the server.'),
  OfflineRule('pos.giftVoucher', OfflineMode.onlineOnly, 'Gift voucher balances must be checked and spent on the server.'),
  OfflineRule('gst.einvoice', OfflineMode.onlineOnly, 'E-invoice and e-way bill calls go to the tax portal.'),
  OfflineRule('team.admin', OfflineMode.onlineOnly, 'Inviting people and changing roles.'),
  OfflineRule('settings.locks', OfflineMode.onlineOnly, 'Period locks and numbering.'),
  OfflineRule('settings.backup', OfflineMode.onlineOnly, 'Exporting or restoring the business\'s data.'),
];

/// The table the app consults: the built-in rules, replaced by whatever the server last sent.
class OfflineRules {
  OfflineRules([Iterable<OfflineRule> rules = defaultOfflineRules]) : _byAction = {for (final r in rules) r.action: r};

  final Map<String, OfflineRule> _byAction;

  /// Reads the server's list (`[{action, mode, note}, ...]`). Entries it cannot understand are skipped, and
  /// an empty or broken list leaves the built-in rules in place.
  factory OfflineRules.fromServer(Object? data) {
    if (data is! List) return OfflineRules();
    final rules = <OfflineRule>[];
    for (final e in data) {
      if (e is! Map) continue;
      final mode = OfflineMode.parse(e['mode'] as String?);
      final action = e['action'];
      if (mode == null || action is! String) continue;
      rules.add(OfflineRule(action, mode, (e['note'] as String?) ?? ''));
    }
    return rules.isEmpty ? OfflineRules() : OfflineRules(rules);
  }

  List<OfflineRule> get all => _byAction.values.toList();

  /// An action nobody declared is treated as online only: the safe side.
  OfflineMode modeOf(String action) => _byAction[action]?.mode ?? OfflineMode.onlineOnly;

  bool canQueue(String action) => modeOf(action) == OfflineMode.allowed;
}
