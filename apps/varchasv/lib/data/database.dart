import 'package:drift/drift.dart';
import 'secure_db.dart';

part 'database.g.dart';

/// The offline app's local copy of the books (SQLite via drift). Money is stored as TEXT decimal
/// strings ("1180.00") so it round-trips exactly with the server's numeric columns.

class Meta extends Table {
  TextColumn get key => text()();
  TextColumn get value => text()();
  @override
  Set<Column> get primaryKey => {key};
}

class Companies extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get booksBeginOn => text()();
  @override
  Set<Column> get primaryKey => {id};
}

class FiscalYears extends Table {
  TextColumn get id => text()();
  TextColumn get companyId => text()();
  TextColumn get label => text()();
  TextColumn get startsOn => text()();
  TextColumn get endsOn => text()();
  TextColumn get lockedUpTo => text().nullable()();
  BoolColumn get closed => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

class AccountGroups extends Table {
  TextColumn get id => text()();
  TextColumn get companyId => text()();
  TextColumn get parentId => text().nullable()();
  TextColumn get key => text().nullable()();
  TextColumn get name => text()();
  TextColumn get nameHi => text().nullable()();
  TextColumn get nature => text()();
  @override
  Set<Column> get primaryKey => {id};
}

class Accounts extends Table {
  TextColumn get id => text()();
  TextColumn get companyId => text()();
  TextColumn get groupId => text()();
  TextColumn get key => text().nullable()();
  TextColumn get name => text()();
  TextColumn get nameHi => text().nullable()();
  TextColumn get openingBalance => text().withDefault(const Constant('0.00'))();
  TextColumn get gstin => text().nullable()();
  TextColumn get stateCode => text().nullable()();
  TextColumn get phone => text().nullable()();
  BoolColumn get archived => boolean().withDefault(const Constant(false))();
  BoolColumn get system => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

class Vouchers extends Table {
  TextColumn get id => text()();
  TextColumn get companyId => text()();
  TextColumn get type => text()();
  TextColumn get number => text()();
  TextColumn get date => text()();
  TextColumn get narration => text().nullable()();
  TextColumn get reference => text().nullable()();
  TextColumn get total => text()();
  TextColumn get status => text().withDefault(const Constant('posted'))(); // posted | cancelled
  /// synced | pending (waiting to upload) | failed (server refused; see syncError)
  TextColumn get syncState => text().withDefault(const Constant('synced'))();
  TextColumn get syncError => text().nullable()();
  @override
  Set<Column> get primaryKey => {id};
}

@DataClassName('VoucherLineRow') // `VoucherLine` is the domain type used for validation
class VoucherLines extends Table {
  TextColumn get voucherId => text()();
  IntColumn get lineNo => integer()();
  TextColumn get accountId => text()();
  TextColumn get debit => text().withDefault(const Constant('0.00'))();
  TextColumn get credit => text().withDefault(const Constant('0.00'))();
  @override
  Set<Column> get primaryKey => {voucherId, lineNo};
}

/// This device's own number series, one per voucher type and financial year.
class DeviceSeries extends Table {
  TextColumn get docType => text()();
  TextColumn get fyLabel => text()();
  TextColumn get pattern => text()();
  IntColumn get nextSeq => integer().withDefault(const Constant(1))();
  @override
  Set<Column> get primaryKey => {docType, fyLabel};
}

/// Operations waiting to be sent to the cloud, in the order they happened.
class Outbox extends Table {
  IntColumn get seq => integer().autoIncrement()();
  TextColumn get opId => text()();
  TextColumn get kind => text()();
  TextColumn get payload => text()(); // JSON
  TextColumn get state => text().withDefault(const Constant('pending'))(); // pending | failed
  TextColumn get error => text().nullable()();
}

// ---- HR (read-mostly; attendance and leave requests can be made offline) ------------------------

class Employees extends Table {
  TextColumn get id => text()();
  TextColumn get companyId => text()();
  TextColumn get code => text()();
  TextColumn get name => text()();
  TextColumn get nameHi => text().nullable()();
  TextColumn get designation => text().nullable()();
  TextColumn get department => text().nullable()();
  TextColumn get joinedOn => text()();
  TextColumn get leftOn => text().nullable()();
  TextColumn get status => text()();
  TextColumn get phone => text().nullable()();
  @override
  Set<Column> get primaryKey => {id};
}

class LeaveTypes extends Table {
  TextColumn get id => text()();
  TextColumn get code => text()();
  TextColumn get name => text()();
  TextColumn get nameHi => text().nullable()();
  BoolColumn get paid => boolean().withDefault(const Constant(true))();
  BoolColumn get archived => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

class LeaveRequests extends Table {
  TextColumn get id => text()();
  TextColumn get employeeId => text()();
  TextColumn get leaveTypeId => text()();
  TextColumn get fromDate => text()();
  TextColumn get toDate => text()();
  BoolColumn get halfDay => boolean().withDefault(const Constant(false))();
  TextColumn get days => text().nullable()(); // worked out by the server (skips holidays)
  TextColumn get reason => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('pending'))();
  TextColumn get syncState => text().withDefault(const Constant('synced'))();
  TextColumn get syncError => text().nullable()();
  @override
  Set<Column> get primaryKey => {id};
}

/// Marked days only (no row = present), as on the server.
class AttendanceDays extends Table {
  TextColumn get employeeId => text()();
  TextColumn get date => text()();
  TextColumn get status => text()(); // absent | half_day | leave | present (with punches)
  TextColumn get leaveCode => text().nullable()();
  TextColumn get inTime => text().nullable()();
  TextColumn get outTime => text().nullable()();
  BoolColumn get late => boolean().withDefault(const Constant(false))();
  TextColumn get syncState => text().withDefault(const Constant('synced'))();
  TextColumn get syncError => text().nullable()();
  @override
  Set<Column> get primaryKey => {employeeId, date};
}

/// Payslips of final payroll runs; `detail` is the server's computation as JSON.
class Payslips extends Table {
  TextColumn get id => text()();
  TextColumn get runId => text()();
  TextColumn get period => text()();
  TextColumn get employeeId => text()();
  TextColumn get paidDays => text()();
  TextColumn get gross => text()();
  TextColumn get totalDeductions => text()();
  TextColumn get netPay => text()();
  TextColumn get tds => text()();
  TextColumn get detail => text()();
  @override
  Set<Column> get primaryKey => {id};
}

// ---- POS (offline billing) ------------------------------------------------------------------------

/// Items as the counter sells them (price, tax, barcode). Stock isn't tracked on the device.
class PosItems extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get nameHi => text().nullable()();
  TextColumn get sku => text().nullable()();
  TextColumn get barcode => text().nullable()();
  TextColumn get kind => text()();
  TextColumn get hsn => text().nullable()();
  TextColumn get gstRate => text()();
  /// GST by price per piece (apparel, footwear); gstRate is then only the fallback.
  TextColumn get gstSlab => text().nullable()();
  IntColumn get slabPieces => integer().withDefault(const Constant(1))();
  TextColumn get cessRate => text().withDefault(const Constant('0'))();
  TextColumn get saleRate => text()();
  TextColumn get uom => text()();
  BoolColumn get archived => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

/// Counters linked to this device: it numbers their bills itself.
class PosTerminals extends Table {
  TextColumn get id => text()();
  TextColumn get code => text()();
  TextColumn get name => text()();
  BoolColumn get archived => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

/// Bills made on this device (kept for receipts and the day's list; the cloud has the books).
class PosBills extends Table {
  TextColumn get id => text()();
  TextColumn get terminalId => text()();
  TextColumn get number => text()();
  TextColumn get date => text()();
  TextColumn get createdAt => text()();
  TextColumn get customerPhone => text().nullable()();
  TextColumn get customerName => text().nullable()();
  TextColumn get detail => text()(); // JSON: lines, taxes, payments as worked out on the device
  TextColumn get total => text()();
  TextColumn get change => text().withDefault(const Constant('0.00'))();
  TextColumn get serverTotal => text().nullable()(); // set when the server worked the bill out differently
  TextColumn get syncState => text().withDefault(const Constant('pending'))();
  TextColumn get syncError => text().nullable()();
  @override
  Set<Column> get primaryKey => {id};
}

// ---- Field work: expense claims and sales orders made on the device ------------------------------

class ExpenseCategories extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get nameHi => text().nullable()();
  BoolColumn get blockedCredit => boolean().withDefault(const Constant(false))();
  BoolColumn get archived => boolean().withDefault(const Constant(false))();
  @override
  Set<Column> get primaryKey => {id};
}

/// A claim made here; the server numbers and prices it when it uploads.
class LocalClaims extends Table {
  TextColumn get id => text()();
  TextColumn get employeeId => text()();
  TextColumn get date => text()();
  TextColumn get title => text()();
  TextColumn get lines => text()(); // JSON
  TextColumn get total => text()();
  TextColumn get serverNumber => text().nullable()();
  TextColumn get syncState => text().withDefault(const Constant('pending'))();
  TextColumn get syncError => text().nullable()();
  TextColumn get createdAt => text()();
  @override
  Set<Column> get primaryKey => {id};
}

/// A sales order taken in the field; the server numbers it and works out its tax when it uploads.
class FieldOrders extends Table {
  TextColumn get id => text()();
  TextColumn get customerId => text()();
  TextColumn get date => text()();
  TextColumn get deliverBy => text().nullable()();
  TextColumn get lines => text()(); // JSON
  TextColumn get estimate => text()();
  TextColumn get serverNumber => text().nullable()();
  TextColumn get serverTotal => text().nullable()();
  TextColumn get syncState => text().withDefault(const Constant('pending'))();
  TextColumn get syncError => text().nullable()();
  TextColumn get createdAt => text()();
  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(tables: [
  Meta, Companies, FiscalYears, AccountGroups, Accounts, Vouchers, VoucherLines, DeviceSeries, Outbox,
  Employees, LeaveTypes, LeaveRequests, AttendanceDays, Payslips, PosItems, PosTerminals, PosBills,
  ExpenseCategories, LocalClaims, FieldOrders,
])
class LocalDb extends _$LocalDb {
  LocalDb([QueryExecutor? executor]) : super(executor ?? openDeviceExecutor());

  @override
  int get schemaVersion => 5;

  @override
  MigrationStrategy get migration => MigrationStrategy(
        onCreate: (m) => m.createAll(),
        onUpgrade: (m, from, to) async {
          if (from < 2) {
            // Version 2 added HR.
            for (final TableInfo t in [employees, leaveTypes, leaveRequests, attendanceDays, payslips]) {
              await m.createTable(t);
            }
          }
          if (from < 3) {
            // Version 3 added offline POS.
            for (final TableInfo t in [posItems, posTerminals, posBills]) {
              await m.createTable(t);
            }
          }
          if (from < 4) {
            // Version 4 added field work (claims and orders).
            for (final TableInfo t in [expenseCategories, localClaims, fieldOrders]) {
              await m.createTable(t);
            }
          }
          if (from < 5) {
            // Version 5 added GST by price per piece on POS items.
            await m.addColumn(posItems, posItems.gstSlab);
            await m.addColumn(posItems, posItems.slabPieces);
          }
        },
      );

  Future<String?> getMeta(String key) async => (await (select(meta)..where((m) => m.key.equals(key))).getSingleOrNull())?.value;

  Future<void> setMeta(String key, String? value) async {
    if (value == null) {
      await (delete(meta)..where((m) => m.key.equals(key))).go();
    } else {
      await into(meta).insertOnConflictUpdate(MetaCompanion.insert(key: key, value: value));
    }
  }

  /// Signing out of this device wipes the local books; the cloud copy is the source of truth.
  Future<void> wipe() => transaction(() async {
        for (final t in allTables) {
          await delete(t).go();
        }
      });
}
