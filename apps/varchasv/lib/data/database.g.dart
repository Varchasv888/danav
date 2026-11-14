// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// ignore_for_file: type=lint
class $MetaTable extends Meta with TableInfo<$MetaTable, MetaData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MetaTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _keyMeta = const VerificationMeta('key');
  @override
  late final GeneratedColumn<String> key = GeneratedColumn<String>(
    'key',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _valueMeta = const VerificationMeta('value');
  @override
  late final GeneratedColumn<String> value = GeneratedColumn<String>(
    'value',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [key, value];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'meta';
  @override
  VerificationContext validateIntegrity(
    Insertable<MetaData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('key')) {
      context.handle(
        _keyMeta,
        key.isAcceptableOrUnknown(data['key']!, _keyMeta),
      );
    } else if (isInserting) {
      context.missing(_keyMeta);
    }
    if (data.containsKey('value')) {
      context.handle(
        _valueMeta,
        value.isAcceptableOrUnknown(data['value']!, _valueMeta),
      );
    } else if (isInserting) {
      context.missing(_valueMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {key};
  @override
  MetaData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MetaData(
      key: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}key'],
      )!,
      value: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}value'],
      )!,
    );
  }

  @override
  $MetaTable createAlias(String alias) {
    return $MetaTable(attachedDatabase, alias);
  }
}

class MetaData extends DataClass implements Insertable<MetaData> {
  final String key;
  final String value;
  const MetaData({required this.key, required this.value});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['key'] = Variable<String>(key);
    map['value'] = Variable<String>(value);
    return map;
  }

  MetaCompanion toCompanion(bool nullToAbsent) {
    return MetaCompanion(key: Value(key), value: Value(value));
  }

  factory MetaData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MetaData(
      key: serializer.fromJson<String>(json['key']),
      value: serializer.fromJson<String>(json['value']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'key': serializer.toJson<String>(key),
      'value': serializer.toJson<String>(value),
    };
  }

  MetaData copyWith({String? key, String? value}) =>
      MetaData(key: key ?? this.key, value: value ?? this.value);
  MetaData copyWithCompanion(MetaCompanion data) {
    return MetaData(
      key: data.key.present ? data.key.value : this.key,
      value: data.value.present ? data.value.value : this.value,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MetaData(')
          ..write('key: $key, ')
          ..write('value: $value')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(key, value);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MetaData && other.key == this.key && other.value == this.value);
}

class MetaCompanion extends UpdateCompanion<MetaData> {
  final Value<String> key;
  final Value<String> value;
  final Value<int> rowid;
  const MetaCompanion({
    this.key = const Value.absent(),
    this.value = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MetaCompanion.insert({
    required String key,
    required String value,
    this.rowid = const Value.absent(),
  }) : key = Value(key),
       value = Value(value);
  static Insertable<MetaData> custom({
    Expression<String>? key,
    Expression<String>? value,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (key != null) 'key': key,
      if (value != null) 'value': value,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MetaCompanion copyWith({
    Value<String>? key,
    Value<String>? value,
    Value<int>? rowid,
  }) {
    return MetaCompanion(
      key: key ?? this.key,
      value: value ?? this.value,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (key.present) {
      map['key'] = Variable<String>(key.value);
    }
    if (value.present) {
      map['value'] = Variable<String>(value.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MetaCompanion(')
          ..write('key: $key, ')
          ..write('value: $value, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CompaniesTable extends Companies
    with TableInfo<$CompaniesTable, Company> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CompaniesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _booksBeginOnMeta = const VerificationMeta(
    'booksBeginOn',
  );
  @override
  late final GeneratedColumn<String> booksBeginOn = GeneratedColumn<String>(
    'books_begin_on',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, name, booksBeginOn];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'companies';
  @override
  VerificationContext validateIntegrity(
    Insertable<Company> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('books_begin_on')) {
      context.handle(
        _booksBeginOnMeta,
        booksBeginOn.isAcceptableOrUnknown(
          data['books_begin_on']!,
          _booksBeginOnMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_booksBeginOnMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Company map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Company(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      booksBeginOn: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}books_begin_on'],
      )!,
    );
  }

  @override
  $CompaniesTable createAlias(String alias) {
    return $CompaniesTable(attachedDatabase, alias);
  }
}

class Company extends DataClass implements Insertable<Company> {
  final String id;
  final String name;
  final String booksBeginOn;
  const Company({
    required this.id,
    required this.name,
    required this.booksBeginOn,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['books_begin_on'] = Variable<String>(booksBeginOn);
    return map;
  }

  CompaniesCompanion toCompanion(bool nullToAbsent) {
    return CompaniesCompanion(
      id: Value(id),
      name: Value(name),
      booksBeginOn: Value(booksBeginOn),
    );
  }

  factory Company.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Company(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      booksBeginOn: serializer.fromJson<String>(json['booksBeginOn']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'booksBeginOn': serializer.toJson<String>(booksBeginOn),
    };
  }

  Company copyWith({String? id, String? name, String? booksBeginOn}) => Company(
    id: id ?? this.id,
    name: name ?? this.name,
    booksBeginOn: booksBeginOn ?? this.booksBeginOn,
  );
  Company copyWithCompanion(CompaniesCompanion data) {
    return Company(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      booksBeginOn: data.booksBeginOn.present
          ? data.booksBeginOn.value
          : this.booksBeginOn,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Company(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('booksBeginOn: $booksBeginOn')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, booksBeginOn);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Company &&
          other.id == this.id &&
          other.name == this.name &&
          other.booksBeginOn == this.booksBeginOn);
}

class CompaniesCompanion extends UpdateCompanion<Company> {
  final Value<String> id;
  final Value<String> name;
  final Value<String> booksBeginOn;
  final Value<int> rowid;
  const CompaniesCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.booksBeginOn = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CompaniesCompanion.insert({
    required String id,
    required String name,
    required String booksBeginOn,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       booksBeginOn = Value(booksBeginOn);
  static Insertable<Company> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? booksBeginOn,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (booksBeginOn != null) 'books_begin_on': booksBeginOn,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CompaniesCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<String>? booksBeginOn,
    Value<int>? rowid,
  }) {
    return CompaniesCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      booksBeginOn: booksBeginOn ?? this.booksBeginOn,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (booksBeginOn.present) {
      map['books_begin_on'] = Variable<String>(booksBeginOn.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CompaniesCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('booksBeginOn: $booksBeginOn, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $FiscalYearsTable extends FiscalYears
    with TableInfo<$FiscalYearsTable, FiscalYear> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $FiscalYearsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _companyIdMeta = const VerificationMeta(
    'companyId',
  );
  @override
  late final GeneratedColumn<String> companyId = GeneratedColumn<String>(
    'company_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _labelMeta = const VerificationMeta('label');
  @override
  late final GeneratedColumn<String> label = GeneratedColumn<String>(
    'label',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _startsOnMeta = const VerificationMeta(
    'startsOn',
  );
  @override
  late final GeneratedColumn<String> startsOn = GeneratedColumn<String>(
    'starts_on',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _endsOnMeta = const VerificationMeta('endsOn');
  @override
  late final GeneratedColumn<String> endsOn = GeneratedColumn<String>(
    'ends_on',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _lockedUpToMeta = const VerificationMeta(
    'lockedUpTo',
  );
  @override
  late final GeneratedColumn<String> lockedUpTo = GeneratedColumn<String>(
    'locked_up_to',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _closedMeta = const VerificationMeta('closed');
  @override
  late final GeneratedColumn<bool> closed = GeneratedColumn<bool>(
    'closed',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("closed" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    companyId,
    label,
    startsOn,
    endsOn,
    lockedUpTo,
    closed,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'fiscal_years';
  @override
  VerificationContext validateIntegrity(
    Insertable<FiscalYear> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('company_id')) {
      context.handle(
        _companyIdMeta,
        companyId.isAcceptableOrUnknown(data['company_id']!, _companyIdMeta),
      );
    } else if (isInserting) {
      context.missing(_companyIdMeta);
    }
    if (data.containsKey('label')) {
      context.handle(
        _labelMeta,
        label.isAcceptableOrUnknown(data['label']!, _labelMeta),
      );
    } else if (isInserting) {
      context.missing(_labelMeta);
    }
    if (data.containsKey('starts_on')) {
      context.handle(
        _startsOnMeta,
        startsOn.isAcceptableOrUnknown(data['starts_on']!, _startsOnMeta),
      );
    } else if (isInserting) {
      context.missing(_startsOnMeta);
    }
    if (data.containsKey('ends_on')) {
      context.handle(
        _endsOnMeta,
        endsOn.isAcceptableOrUnknown(data['ends_on']!, _endsOnMeta),
      );
    } else if (isInserting) {
      context.missing(_endsOnMeta);
    }
    if (data.containsKey('locked_up_to')) {
      context.handle(
        _lockedUpToMeta,
        lockedUpTo.isAcceptableOrUnknown(
          data['locked_up_to']!,
          _lockedUpToMeta,
        ),
      );
    }
    if (data.containsKey('closed')) {
      context.handle(
        _closedMeta,
        closed.isAcceptableOrUnknown(data['closed']!, _closedMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  FiscalYear map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return FiscalYear(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      companyId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}company_id'],
      )!,
      label: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}label'],
      )!,
      startsOn: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}starts_on'],
      )!,
      endsOn: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}ends_on'],
      )!,
      lockedUpTo: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}locked_up_to'],
      ),
      closed: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}closed'],
      )!,
    );
  }

  @override
  $FiscalYearsTable createAlias(String alias) {
    return $FiscalYearsTable(attachedDatabase, alias);
  }
}

class FiscalYear extends DataClass implements Insertable<FiscalYear> {
  final String id;
  final String companyId;
  final String label;
  final String startsOn;
  final String endsOn;
  final String? lockedUpTo;
  final bool closed;
  const FiscalYear({
    required this.id,
    required this.companyId,
    required this.label,
    required this.startsOn,
    required this.endsOn,
    this.lockedUpTo,
    required this.closed,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['company_id'] = Variable<String>(companyId);
    map['label'] = Variable<String>(label);
    map['starts_on'] = Variable<String>(startsOn);
    map['ends_on'] = Variable<String>(endsOn);
    if (!nullToAbsent || lockedUpTo != null) {
      map['locked_up_to'] = Variable<String>(lockedUpTo);
    }
    map['closed'] = Variable<bool>(closed);
    return map;
  }

  FiscalYearsCompanion toCompanion(bool nullToAbsent) {
    return FiscalYearsCompanion(
      id: Value(id),
      companyId: Value(companyId),
      label: Value(label),
      startsOn: Value(startsOn),
      endsOn: Value(endsOn),
      lockedUpTo: lockedUpTo == null && nullToAbsent
          ? const Value.absent()
          : Value(lockedUpTo),
      closed: Value(closed),
    );
  }

  factory FiscalYear.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return FiscalYear(
      id: serializer.fromJson<String>(json['id']),
      companyId: serializer.fromJson<String>(json['companyId']),
      label: serializer.fromJson<String>(json['label']),
      startsOn: serializer.fromJson<String>(json['startsOn']),
      endsOn: serializer.fromJson<String>(json['endsOn']),
      lockedUpTo: serializer.fromJson<String?>(json['lockedUpTo']),
      closed: serializer.fromJson<bool>(json['closed']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'companyId': serializer.toJson<String>(companyId),
      'label': serializer.toJson<String>(label),
      'startsOn': serializer.toJson<String>(startsOn),
      'endsOn': serializer.toJson<String>(endsOn),
      'lockedUpTo': serializer.toJson<String?>(lockedUpTo),
      'closed': serializer.toJson<bool>(closed),
    };
  }

  FiscalYear copyWith({
    String? id,
    String? companyId,
    String? label,
    String? startsOn,
    String? endsOn,
    Value<String?> lockedUpTo = const Value.absent(),
    bool? closed,
  }) => FiscalYear(
    id: id ?? this.id,
    companyId: companyId ?? this.companyId,
    label: label ?? this.label,
    startsOn: startsOn ?? this.startsOn,
    endsOn: endsOn ?? this.endsOn,
    lockedUpTo: lockedUpTo.present ? lockedUpTo.value : this.lockedUpTo,
    closed: closed ?? this.closed,
  );
  FiscalYear copyWithCompanion(FiscalYearsCompanion data) {
    return FiscalYear(
      id: data.id.present ? data.id.value : this.id,
      companyId: data.companyId.present ? data.companyId.value : this.companyId,
      label: data.label.present ? data.label.value : this.label,
      startsOn: data.startsOn.present ? data.startsOn.value : this.startsOn,
      endsOn: data.endsOn.present ? data.endsOn.value : this.endsOn,
      lockedUpTo: data.lockedUpTo.present
          ? data.lockedUpTo.value
          : this.lockedUpTo,
      closed: data.closed.present ? data.closed.value : this.closed,
    );
  }

  @override
  String toString() {
    return (StringBuffer('FiscalYear(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('label: $label, ')
          ..write('startsOn: $startsOn, ')
          ..write('endsOn: $endsOn, ')
          ..write('lockedUpTo: $lockedUpTo, ')
          ..write('closed: $closed')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, companyId, label, startsOn, endsOn, lockedUpTo, closed);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is FiscalYear &&
          other.id == this.id &&
          other.companyId == this.companyId &&
          other.label == this.label &&
          other.startsOn == this.startsOn &&
          other.endsOn == this.endsOn &&
          other.lockedUpTo == this.lockedUpTo &&
          other.closed == this.closed);
}

class FiscalYearsCompanion extends UpdateCompanion<FiscalYear> {
  final Value<String> id;
  final Value<String> companyId;
  final Value<String> label;
  final Value<String> startsOn;
  final Value<String> endsOn;
  final Value<String?> lockedUpTo;
  final Value<bool> closed;
  final Value<int> rowid;
  const FiscalYearsCompanion({
    this.id = const Value.absent(),
    this.companyId = const Value.absent(),
    this.label = const Value.absent(),
    this.startsOn = const Value.absent(),
    this.endsOn = const Value.absent(),
    this.lockedUpTo = const Value.absent(),
    this.closed = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  FiscalYearsCompanion.insert({
    required String id,
    required String companyId,
    required String label,
    required String startsOn,
    required String endsOn,
    this.lockedUpTo = const Value.absent(),
    this.closed = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       companyId = Value(companyId),
       label = Value(label),
       startsOn = Value(startsOn),
       endsOn = Value(endsOn);
  static Insertable<FiscalYear> custom({
    Expression<String>? id,
    Expression<String>? companyId,
    Expression<String>? label,
    Expression<String>? startsOn,
    Expression<String>? endsOn,
    Expression<String>? lockedUpTo,
    Expression<bool>? closed,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (companyId != null) 'company_id': companyId,
      if (label != null) 'label': label,
      if (startsOn != null) 'starts_on': startsOn,
      if (endsOn != null) 'ends_on': endsOn,
      if (lockedUpTo != null) 'locked_up_to': lockedUpTo,
      if (closed != null) 'closed': closed,
      if (rowid != null) 'rowid': rowid,
    });
  }

  FiscalYearsCompanion copyWith({
    Value<String>? id,
    Value<String>? companyId,
    Value<String>? label,
    Value<String>? startsOn,
    Value<String>? endsOn,
    Value<String?>? lockedUpTo,
    Value<bool>? closed,
    Value<int>? rowid,
  }) {
    return FiscalYearsCompanion(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      label: label ?? this.label,
      startsOn: startsOn ?? this.startsOn,
      endsOn: endsOn ?? this.endsOn,
      lockedUpTo: lockedUpTo ?? this.lockedUpTo,
      closed: closed ?? this.closed,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (companyId.present) {
      map['company_id'] = Variable<String>(companyId.value);
    }
    if (label.present) {
      map['label'] = Variable<String>(label.value);
    }
    if (startsOn.present) {
      map['starts_on'] = Variable<String>(startsOn.value);
    }
    if (endsOn.present) {
      map['ends_on'] = Variable<String>(endsOn.value);
    }
    if (lockedUpTo.present) {
      map['locked_up_to'] = Variable<String>(lockedUpTo.value);
    }
    if (closed.present) {
      map['closed'] = Variable<bool>(closed.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('FiscalYearsCompanion(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('label: $label, ')
          ..write('startsOn: $startsOn, ')
          ..write('endsOn: $endsOn, ')
          ..write('lockedUpTo: $lockedUpTo, ')
          ..write('closed: $closed, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $AccountGroupsTable extends AccountGroups
    with TableInfo<$AccountGroupsTable, AccountGroup> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AccountGroupsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _companyIdMeta = const VerificationMeta(
    'companyId',
  );
  @override
  late final GeneratedColumn<String> companyId = GeneratedColumn<String>(
    'company_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _parentIdMeta = const VerificationMeta(
    'parentId',
  );
  @override
  late final GeneratedColumn<String> parentId = GeneratedColumn<String>(
    'parent_id',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _keyMeta = const VerificationMeta('key');
  @override
  late final GeneratedColumn<String> key = GeneratedColumn<String>(
    'key',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameHiMeta = const VerificationMeta('nameHi');
  @override
  late final GeneratedColumn<String> nameHi = GeneratedColumn<String>(
    'name_hi',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _natureMeta = const VerificationMeta('nature');
  @override
  late final GeneratedColumn<String> nature = GeneratedColumn<String>(
    'nature',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    companyId,
    parentId,
    key,
    name,
    nameHi,
    nature,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'account_groups';
  @override
  VerificationContext validateIntegrity(
    Insertable<AccountGroup> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('company_id')) {
      context.handle(
        _companyIdMeta,
        companyId.isAcceptableOrUnknown(data['company_id']!, _companyIdMeta),
      );
    } else if (isInserting) {
      context.missing(_companyIdMeta);
    }
    if (data.containsKey('parent_id')) {
      context.handle(
        _parentIdMeta,
        parentId.isAcceptableOrUnknown(data['parent_id']!, _parentIdMeta),
      );
    }
    if (data.containsKey('key')) {
      context.handle(
        _keyMeta,
        key.isAcceptableOrUnknown(data['key']!, _keyMeta),
      );
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('name_hi')) {
      context.handle(
        _nameHiMeta,
        nameHi.isAcceptableOrUnknown(data['name_hi']!, _nameHiMeta),
      );
    }
    if (data.containsKey('nature')) {
      context.handle(
        _natureMeta,
        nature.isAcceptableOrUnknown(data['nature']!, _natureMeta),
      );
    } else if (isInserting) {
      context.missing(_natureMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  AccountGroup map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return AccountGroup(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      companyId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}company_id'],
      )!,
      parentId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}parent_id'],
      ),
      key: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}key'],
      ),
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      nameHi: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name_hi'],
      ),
      nature: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}nature'],
      )!,
    );
  }

  @override
  $AccountGroupsTable createAlias(String alias) {
    return $AccountGroupsTable(attachedDatabase, alias);
  }
}

class AccountGroup extends DataClass implements Insertable<AccountGroup> {
  final String id;
  final String companyId;
  final String? parentId;
  final String? key;
  final String name;
  final String? nameHi;
  final String nature;
  const AccountGroup({
    required this.id,
    required this.companyId,
    this.parentId,
    this.key,
    required this.name,
    this.nameHi,
    required this.nature,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['company_id'] = Variable<String>(companyId);
    if (!nullToAbsent || parentId != null) {
      map['parent_id'] = Variable<String>(parentId);
    }
    if (!nullToAbsent || key != null) {
      map['key'] = Variable<String>(key);
    }
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || nameHi != null) {
      map['name_hi'] = Variable<String>(nameHi);
    }
    map['nature'] = Variable<String>(nature);
    return map;
  }

  AccountGroupsCompanion toCompanion(bool nullToAbsent) {
    return AccountGroupsCompanion(
      id: Value(id),
      companyId: Value(companyId),
      parentId: parentId == null && nullToAbsent
          ? const Value.absent()
          : Value(parentId),
      key: key == null && nullToAbsent ? const Value.absent() : Value(key),
      name: Value(name),
      nameHi: nameHi == null && nullToAbsent
          ? const Value.absent()
          : Value(nameHi),
      nature: Value(nature),
    );
  }

  factory AccountGroup.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return AccountGroup(
      id: serializer.fromJson<String>(json['id']),
      companyId: serializer.fromJson<String>(json['companyId']),
      parentId: serializer.fromJson<String?>(json['parentId']),
      key: serializer.fromJson<String?>(json['key']),
      name: serializer.fromJson<String>(json['name']),
      nameHi: serializer.fromJson<String?>(json['nameHi']),
      nature: serializer.fromJson<String>(json['nature']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'companyId': serializer.toJson<String>(companyId),
      'parentId': serializer.toJson<String?>(parentId),
      'key': serializer.toJson<String?>(key),
      'name': serializer.toJson<String>(name),
      'nameHi': serializer.toJson<String?>(nameHi),
      'nature': serializer.toJson<String>(nature),
    };
  }

  AccountGroup copyWith({
    String? id,
    String? companyId,
    Value<String?> parentId = const Value.absent(),
    Value<String?> key = const Value.absent(),
    String? name,
    Value<String?> nameHi = const Value.absent(),
    String? nature,
  }) => AccountGroup(
    id: id ?? this.id,
    companyId: companyId ?? this.companyId,
    parentId: parentId.present ? parentId.value : this.parentId,
    key: key.present ? key.value : this.key,
    name: name ?? this.name,
    nameHi: nameHi.present ? nameHi.value : this.nameHi,
    nature: nature ?? this.nature,
  );
  AccountGroup copyWithCompanion(AccountGroupsCompanion data) {
    return AccountGroup(
      id: data.id.present ? data.id.value : this.id,
      companyId: data.companyId.present ? data.companyId.value : this.companyId,
      parentId: data.parentId.present ? data.parentId.value : this.parentId,
      key: data.key.present ? data.key.value : this.key,
      name: data.name.present ? data.name.value : this.name,
      nameHi: data.nameHi.present ? data.nameHi.value : this.nameHi,
      nature: data.nature.present ? data.nature.value : this.nature,
    );
  }

  @override
  String toString() {
    return (StringBuffer('AccountGroup(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('parentId: $parentId, ')
          ..write('key: $key, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('nature: $nature')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, companyId, parentId, key, name, nameHi, nature);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is AccountGroup &&
          other.id == this.id &&
          other.companyId == this.companyId &&
          other.parentId == this.parentId &&
          other.key == this.key &&
          other.name == this.name &&
          other.nameHi == this.nameHi &&
          other.nature == this.nature);
}

class AccountGroupsCompanion extends UpdateCompanion<AccountGroup> {
  final Value<String> id;
  final Value<String> companyId;
  final Value<String?> parentId;
  final Value<String?> key;
  final Value<String> name;
  final Value<String?> nameHi;
  final Value<String> nature;
  final Value<int> rowid;
  const AccountGroupsCompanion({
    this.id = const Value.absent(),
    this.companyId = const Value.absent(),
    this.parentId = const Value.absent(),
    this.key = const Value.absent(),
    this.name = const Value.absent(),
    this.nameHi = const Value.absent(),
    this.nature = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AccountGroupsCompanion.insert({
    required String id,
    required String companyId,
    this.parentId = const Value.absent(),
    this.key = const Value.absent(),
    required String name,
    this.nameHi = const Value.absent(),
    required String nature,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       companyId = Value(companyId),
       name = Value(name),
       nature = Value(nature);
  static Insertable<AccountGroup> custom({
    Expression<String>? id,
    Expression<String>? companyId,
    Expression<String>? parentId,
    Expression<String>? key,
    Expression<String>? name,
    Expression<String>? nameHi,
    Expression<String>? nature,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (companyId != null) 'company_id': companyId,
      if (parentId != null) 'parent_id': parentId,
      if (key != null) 'key': key,
      if (name != null) 'name': name,
      if (nameHi != null) 'name_hi': nameHi,
      if (nature != null) 'nature': nature,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AccountGroupsCompanion copyWith({
    Value<String>? id,
    Value<String>? companyId,
    Value<String?>? parentId,
    Value<String?>? key,
    Value<String>? name,
    Value<String?>? nameHi,
    Value<String>? nature,
    Value<int>? rowid,
  }) {
    return AccountGroupsCompanion(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      parentId: parentId ?? this.parentId,
      key: key ?? this.key,
      name: name ?? this.name,
      nameHi: nameHi ?? this.nameHi,
      nature: nature ?? this.nature,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (companyId.present) {
      map['company_id'] = Variable<String>(companyId.value);
    }
    if (parentId.present) {
      map['parent_id'] = Variable<String>(parentId.value);
    }
    if (key.present) {
      map['key'] = Variable<String>(key.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (nameHi.present) {
      map['name_hi'] = Variable<String>(nameHi.value);
    }
    if (nature.present) {
      map['nature'] = Variable<String>(nature.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AccountGroupsCompanion(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('parentId: $parentId, ')
          ..write('key: $key, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('nature: $nature, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $AccountsTable extends Accounts with TableInfo<$AccountsTable, Account> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AccountsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _companyIdMeta = const VerificationMeta(
    'companyId',
  );
  @override
  late final GeneratedColumn<String> companyId = GeneratedColumn<String>(
    'company_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _groupIdMeta = const VerificationMeta(
    'groupId',
  );
  @override
  late final GeneratedColumn<String> groupId = GeneratedColumn<String>(
    'group_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _keyMeta = const VerificationMeta('key');
  @override
  late final GeneratedColumn<String> key = GeneratedColumn<String>(
    'key',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameHiMeta = const VerificationMeta('nameHi');
  @override
  late final GeneratedColumn<String> nameHi = GeneratedColumn<String>(
    'name_hi',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _openingBalanceMeta = const VerificationMeta(
    'openingBalance',
  );
  @override
  late final GeneratedColumn<String> openingBalance = GeneratedColumn<String>(
    'opening_balance',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('0.00'),
  );
  static const VerificationMeta _gstinMeta = const VerificationMeta('gstin');
  @override
  late final GeneratedColumn<String> gstin = GeneratedColumn<String>(
    'gstin',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _stateCodeMeta = const VerificationMeta(
    'stateCode',
  );
  @override
  late final GeneratedColumn<String> stateCode = GeneratedColumn<String>(
    'state_code',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _phoneMeta = const VerificationMeta('phone');
  @override
  late final GeneratedColumn<String> phone = GeneratedColumn<String>(
    'phone',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _archivedMeta = const VerificationMeta(
    'archived',
  );
  @override
  late final GeneratedColumn<bool> archived = GeneratedColumn<bool>(
    'archived',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("archived" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _systemMeta = const VerificationMeta('system');
  @override
  late final GeneratedColumn<bool> system = GeneratedColumn<bool>(
    'system',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("system" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    companyId,
    groupId,
    key,
    name,
    nameHi,
    openingBalance,
    gstin,
    stateCode,
    phone,
    archived,
    system,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'accounts';
  @override
  VerificationContext validateIntegrity(
    Insertable<Account> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('company_id')) {
      context.handle(
        _companyIdMeta,
        companyId.isAcceptableOrUnknown(data['company_id']!, _companyIdMeta),
      );
    } else if (isInserting) {
      context.missing(_companyIdMeta);
    }
    if (data.containsKey('group_id')) {
      context.handle(
        _groupIdMeta,
        groupId.isAcceptableOrUnknown(data['group_id']!, _groupIdMeta),
      );
    } else if (isInserting) {
      context.missing(_groupIdMeta);
    }
    if (data.containsKey('key')) {
      context.handle(
        _keyMeta,
        key.isAcceptableOrUnknown(data['key']!, _keyMeta),
      );
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('name_hi')) {
      context.handle(
        _nameHiMeta,
        nameHi.isAcceptableOrUnknown(data['name_hi']!, _nameHiMeta),
      );
    }
    if (data.containsKey('opening_balance')) {
      context.handle(
        _openingBalanceMeta,
        openingBalance.isAcceptableOrUnknown(
          data['opening_balance']!,
          _openingBalanceMeta,
        ),
      );
    }
    if (data.containsKey('gstin')) {
      context.handle(
        _gstinMeta,
        gstin.isAcceptableOrUnknown(data['gstin']!, _gstinMeta),
      );
    }
    if (data.containsKey('state_code')) {
      context.handle(
        _stateCodeMeta,
        stateCode.isAcceptableOrUnknown(data['state_code']!, _stateCodeMeta),
      );
    }
    if (data.containsKey('phone')) {
      context.handle(
        _phoneMeta,
        phone.isAcceptableOrUnknown(data['phone']!, _phoneMeta),
      );
    }
    if (data.containsKey('archived')) {
      context.handle(
        _archivedMeta,
        archived.isAcceptableOrUnknown(data['archived']!, _archivedMeta),
      );
    }
    if (data.containsKey('system')) {
      context.handle(
        _systemMeta,
        system.isAcceptableOrUnknown(data['system']!, _systemMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Account map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Account(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      companyId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}company_id'],
      )!,
      groupId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}group_id'],
      )!,
      key: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}key'],
      ),
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      nameHi: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name_hi'],
      ),
      openingBalance: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}opening_balance'],
      )!,
      gstin: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}gstin'],
      ),
      stateCode: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}state_code'],
      ),
      phone: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}phone'],
      ),
      archived: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}archived'],
      )!,
      system: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}system'],
      )!,
    );
  }

  @override
  $AccountsTable createAlias(String alias) {
    return $AccountsTable(attachedDatabase, alias);
  }
}

class Account extends DataClass implements Insertable<Account> {
  final String id;
  final String companyId;
  final String groupId;
  final String? key;
  final String name;
  final String? nameHi;
  final String openingBalance;
  final String? gstin;
  final String? stateCode;
  final String? phone;
  final bool archived;
  final bool system;
  const Account({
    required this.id,
    required this.companyId,
    required this.groupId,
    this.key,
    required this.name,
    this.nameHi,
    required this.openingBalance,
    this.gstin,
    this.stateCode,
    this.phone,
    required this.archived,
    required this.system,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['company_id'] = Variable<String>(companyId);
    map['group_id'] = Variable<String>(groupId);
    if (!nullToAbsent || key != null) {
      map['key'] = Variable<String>(key);
    }
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || nameHi != null) {
      map['name_hi'] = Variable<String>(nameHi);
    }
    map['opening_balance'] = Variable<String>(openingBalance);
    if (!nullToAbsent || gstin != null) {
      map['gstin'] = Variable<String>(gstin);
    }
    if (!nullToAbsent || stateCode != null) {
      map['state_code'] = Variable<String>(stateCode);
    }
    if (!nullToAbsent || phone != null) {
      map['phone'] = Variable<String>(phone);
    }
    map['archived'] = Variable<bool>(archived);
    map['system'] = Variable<bool>(system);
    return map;
  }

  AccountsCompanion toCompanion(bool nullToAbsent) {
    return AccountsCompanion(
      id: Value(id),
      companyId: Value(companyId),
      groupId: Value(groupId),
      key: key == null && nullToAbsent ? const Value.absent() : Value(key),
      name: Value(name),
      nameHi: nameHi == null && nullToAbsent
          ? const Value.absent()
          : Value(nameHi),
      openingBalance: Value(openingBalance),
      gstin: gstin == null && nullToAbsent
          ? const Value.absent()
          : Value(gstin),
      stateCode: stateCode == null && nullToAbsent
          ? const Value.absent()
          : Value(stateCode),
      phone: phone == null && nullToAbsent
          ? const Value.absent()
          : Value(phone),
      archived: Value(archived),
      system: Value(system),
    );
  }

  factory Account.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Account(
      id: serializer.fromJson<String>(json['id']),
      companyId: serializer.fromJson<String>(json['companyId']),
      groupId: serializer.fromJson<String>(json['groupId']),
      key: serializer.fromJson<String?>(json['key']),
      name: serializer.fromJson<String>(json['name']),
      nameHi: serializer.fromJson<String?>(json['nameHi']),
      openingBalance: serializer.fromJson<String>(json['openingBalance']),
      gstin: serializer.fromJson<String?>(json['gstin']),
      stateCode: serializer.fromJson<String?>(json['stateCode']),
      phone: serializer.fromJson<String?>(json['phone']),
      archived: serializer.fromJson<bool>(json['archived']),
      system: serializer.fromJson<bool>(json['system']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'companyId': serializer.toJson<String>(companyId),
      'groupId': serializer.toJson<String>(groupId),
      'key': serializer.toJson<String?>(key),
      'name': serializer.toJson<String>(name),
      'nameHi': serializer.toJson<String?>(nameHi),
      'openingBalance': serializer.toJson<String>(openingBalance),
      'gstin': serializer.toJson<String?>(gstin),
      'stateCode': serializer.toJson<String?>(stateCode),
      'phone': serializer.toJson<String?>(phone),
      'archived': serializer.toJson<bool>(archived),
      'system': serializer.toJson<bool>(system),
    };
  }

  Account copyWith({
    String? id,
    String? companyId,
    String? groupId,
    Value<String?> key = const Value.absent(),
    String? name,
    Value<String?> nameHi = const Value.absent(),
    String? openingBalance,
    Value<String?> gstin = const Value.absent(),
    Value<String?> stateCode = const Value.absent(),
    Value<String?> phone = const Value.absent(),
    bool? archived,
    bool? system,
  }) => Account(
    id: id ?? this.id,
    companyId: companyId ?? this.companyId,
    groupId: groupId ?? this.groupId,
    key: key.present ? key.value : this.key,
    name: name ?? this.name,
    nameHi: nameHi.present ? nameHi.value : this.nameHi,
    openingBalance: openingBalance ?? this.openingBalance,
    gstin: gstin.present ? gstin.value : this.gstin,
    stateCode: stateCode.present ? stateCode.value : this.stateCode,
    phone: phone.present ? phone.value : this.phone,
    archived: archived ?? this.archived,
    system: system ?? this.system,
  );
  Account copyWithCompanion(AccountsCompanion data) {
    return Account(
      id: data.id.present ? data.id.value : this.id,
      companyId: data.companyId.present ? data.companyId.value : this.companyId,
      groupId: data.groupId.present ? data.groupId.value : this.groupId,
      key: data.key.present ? data.key.value : this.key,
      name: data.name.present ? data.name.value : this.name,
      nameHi: data.nameHi.present ? data.nameHi.value : this.nameHi,
      openingBalance: data.openingBalance.present
          ? data.openingBalance.value
          : this.openingBalance,
      gstin: data.gstin.present ? data.gstin.value : this.gstin,
      stateCode: data.stateCode.present ? data.stateCode.value : this.stateCode,
      phone: data.phone.present ? data.phone.value : this.phone,
      archived: data.archived.present ? data.archived.value : this.archived,
      system: data.system.present ? data.system.value : this.system,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Account(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('groupId: $groupId, ')
          ..write('key: $key, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('openingBalance: $openingBalance, ')
          ..write('gstin: $gstin, ')
          ..write('stateCode: $stateCode, ')
          ..write('phone: $phone, ')
          ..write('archived: $archived, ')
          ..write('system: $system')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    companyId,
    groupId,
    key,
    name,
    nameHi,
    openingBalance,
    gstin,
    stateCode,
    phone,
    archived,
    system,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Account &&
          other.id == this.id &&
          other.companyId == this.companyId &&
          other.groupId == this.groupId &&
          other.key == this.key &&
          other.name == this.name &&
          other.nameHi == this.nameHi &&
          other.openingBalance == this.openingBalance &&
          other.gstin == this.gstin &&
          other.stateCode == this.stateCode &&
          other.phone == this.phone &&
          other.archived == this.archived &&
          other.system == this.system);
}

class AccountsCompanion extends UpdateCompanion<Account> {
  final Value<String> id;
  final Value<String> companyId;
  final Value<String> groupId;
  final Value<String?> key;
  final Value<String> name;
  final Value<String?> nameHi;
  final Value<String> openingBalance;
  final Value<String?> gstin;
  final Value<String?> stateCode;
  final Value<String?> phone;
  final Value<bool> archived;
  final Value<bool> system;
  final Value<int> rowid;
  const AccountsCompanion({
    this.id = const Value.absent(),
    this.companyId = const Value.absent(),
    this.groupId = const Value.absent(),
    this.key = const Value.absent(),
    this.name = const Value.absent(),
    this.nameHi = const Value.absent(),
    this.openingBalance = const Value.absent(),
    this.gstin = const Value.absent(),
    this.stateCode = const Value.absent(),
    this.phone = const Value.absent(),
    this.archived = const Value.absent(),
    this.system = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AccountsCompanion.insert({
    required String id,
    required String companyId,
    required String groupId,
    this.key = const Value.absent(),
    required String name,
    this.nameHi = const Value.absent(),
    this.openingBalance = const Value.absent(),
    this.gstin = const Value.absent(),
    this.stateCode = const Value.absent(),
    this.phone = const Value.absent(),
    this.archived = const Value.absent(),
    this.system = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       companyId = Value(companyId),
       groupId = Value(groupId),
       name = Value(name);
  static Insertable<Account> custom({
    Expression<String>? id,
    Expression<String>? companyId,
    Expression<String>? groupId,
    Expression<String>? key,
    Expression<String>? name,
    Expression<String>? nameHi,
    Expression<String>? openingBalance,
    Expression<String>? gstin,
    Expression<String>? stateCode,
    Expression<String>? phone,
    Expression<bool>? archived,
    Expression<bool>? system,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (companyId != null) 'company_id': companyId,
      if (groupId != null) 'group_id': groupId,
      if (key != null) 'key': key,
      if (name != null) 'name': name,
      if (nameHi != null) 'name_hi': nameHi,
      if (openingBalance != null) 'opening_balance': openingBalance,
      if (gstin != null) 'gstin': gstin,
      if (stateCode != null) 'state_code': stateCode,
      if (phone != null) 'phone': phone,
      if (archived != null) 'archived': archived,
      if (system != null) 'system': system,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AccountsCompanion copyWith({
    Value<String>? id,
    Value<String>? companyId,
    Value<String>? groupId,
    Value<String?>? key,
    Value<String>? name,
    Value<String?>? nameHi,
    Value<String>? openingBalance,
    Value<String?>? gstin,
    Value<String?>? stateCode,
    Value<String?>? phone,
    Value<bool>? archived,
    Value<bool>? system,
    Value<int>? rowid,
  }) {
    return AccountsCompanion(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      groupId: groupId ?? this.groupId,
      key: key ?? this.key,
      name: name ?? this.name,
      nameHi: nameHi ?? this.nameHi,
      openingBalance: openingBalance ?? this.openingBalance,
      gstin: gstin ?? this.gstin,
      stateCode: stateCode ?? this.stateCode,
      phone: phone ?? this.phone,
      archived: archived ?? this.archived,
      system: system ?? this.system,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (companyId.present) {
      map['company_id'] = Variable<String>(companyId.value);
    }
    if (groupId.present) {
      map['group_id'] = Variable<String>(groupId.value);
    }
    if (key.present) {
      map['key'] = Variable<String>(key.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (nameHi.present) {
      map['name_hi'] = Variable<String>(nameHi.value);
    }
    if (openingBalance.present) {
      map['opening_balance'] = Variable<String>(openingBalance.value);
    }
    if (gstin.present) {
      map['gstin'] = Variable<String>(gstin.value);
    }
    if (stateCode.present) {
      map['state_code'] = Variable<String>(stateCode.value);
    }
    if (phone.present) {
      map['phone'] = Variable<String>(phone.value);
    }
    if (archived.present) {
      map['archived'] = Variable<bool>(archived.value);
    }
    if (system.present) {
      map['system'] = Variable<bool>(system.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AccountsCompanion(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('groupId: $groupId, ')
          ..write('key: $key, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('openingBalance: $openingBalance, ')
          ..write('gstin: $gstin, ')
          ..write('stateCode: $stateCode, ')
          ..write('phone: $phone, ')
          ..write('archived: $archived, ')
          ..write('system: $system, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $VouchersTable extends Vouchers with TableInfo<$VouchersTable, Voucher> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $VouchersTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _companyIdMeta = const VerificationMeta(
    'companyId',
  );
  @override
  late final GeneratedColumn<String> companyId = GeneratedColumn<String>(
    'company_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
    'type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _numberMeta = const VerificationMeta('number');
  @override
  late final GeneratedColumn<String> number = GeneratedColumn<String>(
    'number',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<String> date = GeneratedColumn<String>(
    'date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _narrationMeta = const VerificationMeta(
    'narration',
  );
  @override
  late final GeneratedColumn<String> narration = GeneratedColumn<String>(
    'narration',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _referenceMeta = const VerificationMeta(
    'reference',
  );
  @override
  late final GeneratedColumn<String> reference = GeneratedColumn<String>(
    'reference',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _totalMeta = const VerificationMeta('total');
  @override
  late final GeneratedColumn<String> total = GeneratedColumn<String>(
    'total',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('posted'),
  );
  static const VerificationMeta _syncStateMeta = const VerificationMeta(
    'syncState',
  );
  @override
  late final GeneratedColumn<String> syncState = GeneratedColumn<String>(
    'sync_state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('synced'),
  );
  static const VerificationMeta _syncErrorMeta = const VerificationMeta(
    'syncError',
  );
  @override
  late final GeneratedColumn<String> syncError = GeneratedColumn<String>(
    'sync_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    companyId,
    type,
    number,
    date,
    narration,
    reference,
    total,
    status,
    syncState,
    syncError,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'vouchers';
  @override
  VerificationContext validateIntegrity(
    Insertable<Voucher> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('company_id')) {
      context.handle(
        _companyIdMeta,
        companyId.isAcceptableOrUnknown(data['company_id']!, _companyIdMeta),
      );
    } else if (isInserting) {
      context.missing(_companyIdMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
        _typeMeta,
        type.isAcceptableOrUnknown(data['type']!, _typeMeta),
      );
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('number')) {
      context.handle(
        _numberMeta,
        number.isAcceptableOrUnknown(data['number']!, _numberMeta),
      );
    } else if (isInserting) {
      context.missing(_numberMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
        _dateMeta,
        date.isAcceptableOrUnknown(data['date']!, _dateMeta),
      );
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('narration')) {
      context.handle(
        _narrationMeta,
        narration.isAcceptableOrUnknown(data['narration']!, _narrationMeta),
      );
    }
    if (data.containsKey('reference')) {
      context.handle(
        _referenceMeta,
        reference.isAcceptableOrUnknown(data['reference']!, _referenceMeta),
      );
    }
    if (data.containsKey('total')) {
      context.handle(
        _totalMeta,
        total.isAcceptableOrUnknown(data['total']!, _totalMeta),
      );
    } else if (isInserting) {
      context.missing(_totalMeta);
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    }
    if (data.containsKey('sync_state')) {
      context.handle(
        _syncStateMeta,
        syncState.isAcceptableOrUnknown(data['sync_state']!, _syncStateMeta),
      );
    }
    if (data.containsKey('sync_error')) {
      context.handle(
        _syncErrorMeta,
        syncError.isAcceptableOrUnknown(data['sync_error']!, _syncErrorMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Voucher map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Voucher(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      companyId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}company_id'],
      )!,
      type: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type'],
      )!,
      number: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}number'],
      )!,
      date: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}date'],
      )!,
      narration: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}narration'],
      ),
      reference: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}reference'],
      ),
      total: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}total'],
      )!,
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
      syncState: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_state'],
      )!,
      syncError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_error'],
      ),
    );
  }

  @override
  $VouchersTable createAlias(String alias) {
    return $VouchersTable(attachedDatabase, alias);
  }
}

class Voucher extends DataClass implements Insertable<Voucher> {
  final String id;
  final String companyId;
  final String type;
  final String number;
  final String date;
  final String? narration;
  final String? reference;
  final String total;
  final String status;

  /// synced | pending (waiting to upload) | failed (server refused; see syncError)
  final String syncState;
  final String? syncError;
  const Voucher({
    required this.id,
    required this.companyId,
    required this.type,
    required this.number,
    required this.date,
    this.narration,
    this.reference,
    required this.total,
    required this.status,
    required this.syncState,
    this.syncError,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['company_id'] = Variable<String>(companyId);
    map['type'] = Variable<String>(type);
    map['number'] = Variable<String>(number);
    map['date'] = Variable<String>(date);
    if (!nullToAbsent || narration != null) {
      map['narration'] = Variable<String>(narration);
    }
    if (!nullToAbsent || reference != null) {
      map['reference'] = Variable<String>(reference);
    }
    map['total'] = Variable<String>(total);
    map['status'] = Variable<String>(status);
    map['sync_state'] = Variable<String>(syncState);
    if (!nullToAbsent || syncError != null) {
      map['sync_error'] = Variable<String>(syncError);
    }
    return map;
  }

  VouchersCompanion toCompanion(bool nullToAbsent) {
    return VouchersCompanion(
      id: Value(id),
      companyId: Value(companyId),
      type: Value(type),
      number: Value(number),
      date: Value(date),
      narration: narration == null && nullToAbsent
          ? const Value.absent()
          : Value(narration),
      reference: reference == null && nullToAbsent
          ? const Value.absent()
          : Value(reference),
      total: Value(total),
      status: Value(status),
      syncState: Value(syncState),
      syncError: syncError == null && nullToAbsent
          ? const Value.absent()
          : Value(syncError),
    );
  }

  factory Voucher.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Voucher(
      id: serializer.fromJson<String>(json['id']),
      companyId: serializer.fromJson<String>(json['companyId']),
      type: serializer.fromJson<String>(json['type']),
      number: serializer.fromJson<String>(json['number']),
      date: serializer.fromJson<String>(json['date']),
      narration: serializer.fromJson<String?>(json['narration']),
      reference: serializer.fromJson<String?>(json['reference']),
      total: serializer.fromJson<String>(json['total']),
      status: serializer.fromJson<String>(json['status']),
      syncState: serializer.fromJson<String>(json['syncState']),
      syncError: serializer.fromJson<String?>(json['syncError']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'companyId': serializer.toJson<String>(companyId),
      'type': serializer.toJson<String>(type),
      'number': serializer.toJson<String>(number),
      'date': serializer.toJson<String>(date),
      'narration': serializer.toJson<String?>(narration),
      'reference': serializer.toJson<String?>(reference),
      'total': serializer.toJson<String>(total),
      'status': serializer.toJson<String>(status),
      'syncState': serializer.toJson<String>(syncState),
      'syncError': serializer.toJson<String?>(syncError),
    };
  }

  Voucher copyWith({
    String? id,
    String? companyId,
    String? type,
    String? number,
    String? date,
    Value<String?> narration = const Value.absent(),
    Value<String?> reference = const Value.absent(),
    String? total,
    String? status,
    String? syncState,
    Value<String?> syncError = const Value.absent(),
  }) => Voucher(
    id: id ?? this.id,
    companyId: companyId ?? this.companyId,
    type: type ?? this.type,
    number: number ?? this.number,
    date: date ?? this.date,
    narration: narration.present ? narration.value : this.narration,
    reference: reference.present ? reference.value : this.reference,
    total: total ?? this.total,
    status: status ?? this.status,
    syncState: syncState ?? this.syncState,
    syncError: syncError.present ? syncError.value : this.syncError,
  );
  Voucher copyWithCompanion(VouchersCompanion data) {
    return Voucher(
      id: data.id.present ? data.id.value : this.id,
      companyId: data.companyId.present ? data.companyId.value : this.companyId,
      type: data.type.present ? data.type.value : this.type,
      number: data.number.present ? data.number.value : this.number,
      date: data.date.present ? data.date.value : this.date,
      narration: data.narration.present ? data.narration.value : this.narration,
      reference: data.reference.present ? data.reference.value : this.reference,
      total: data.total.present ? data.total.value : this.total,
      status: data.status.present ? data.status.value : this.status,
      syncState: data.syncState.present ? data.syncState.value : this.syncState,
      syncError: data.syncError.present ? data.syncError.value : this.syncError,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Voucher(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('type: $type, ')
          ..write('number: $number, ')
          ..write('date: $date, ')
          ..write('narration: $narration, ')
          ..write('reference: $reference, ')
          ..write('total: $total, ')
          ..write('status: $status, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    companyId,
    type,
    number,
    date,
    narration,
    reference,
    total,
    status,
    syncState,
    syncError,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Voucher &&
          other.id == this.id &&
          other.companyId == this.companyId &&
          other.type == this.type &&
          other.number == this.number &&
          other.date == this.date &&
          other.narration == this.narration &&
          other.reference == this.reference &&
          other.total == this.total &&
          other.status == this.status &&
          other.syncState == this.syncState &&
          other.syncError == this.syncError);
}

class VouchersCompanion extends UpdateCompanion<Voucher> {
  final Value<String> id;
  final Value<String> companyId;
  final Value<String> type;
  final Value<String> number;
  final Value<String> date;
  final Value<String?> narration;
  final Value<String?> reference;
  final Value<String> total;
  final Value<String> status;
  final Value<String> syncState;
  final Value<String?> syncError;
  final Value<int> rowid;
  const VouchersCompanion({
    this.id = const Value.absent(),
    this.companyId = const Value.absent(),
    this.type = const Value.absent(),
    this.number = const Value.absent(),
    this.date = const Value.absent(),
    this.narration = const Value.absent(),
    this.reference = const Value.absent(),
    this.total = const Value.absent(),
    this.status = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  VouchersCompanion.insert({
    required String id,
    required String companyId,
    required String type,
    required String number,
    required String date,
    this.narration = const Value.absent(),
    this.reference = const Value.absent(),
    required String total,
    this.status = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       companyId = Value(companyId),
       type = Value(type),
       number = Value(number),
       date = Value(date),
       total = Value(total);
  static Insertable<Voucher> custom({
    Expression<String>? id,
    Expression<String>? companyId,
    Expression<String>? type,
    Expression<String>? number,
    Expression<String>? date,
    Expression<String>? narration,
    Expression<String>? reference,
    Expression<String>? total,
    Expression<String>? status,
    Expression<String>? syncState,
    Expression<String>? syncError,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (companyId != null) 'company_id': companyId,
      if (type != null) 'type': type,
      if (number != null) 'number': number,
      if (date != null) 'date': date,
      if (narration != null) 'narration': narration,
      if (reference != null) 'reference': reference,
      if (total != null) 'total': total,
      if (status != null) 'status': status,
      if (syncState != null) 'sync_state': syncState,
      if (syncError != null) 'sync_error': syncError,
      if (rowid != null) 'rowid': rowid,
    });
  }

  VouchersCompanion copyWith({
    Value<String>? id,
    Value<String>? companyId,
    Value<String>? type,
    Value<String>? number,
    Value<String>? date,
    Value<String?>? narration,
    Value<String?>? reference,
    Value<String>? total,
    Value<String>? status,
    Value<String>? syncState,
    Value<String?>? syncError,
    Value<int>? rowid,
  }) {
    return VouchersCompanion(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      type: type ?? this.type,
      number: number ?? this.number,
      date: date ?? this.date,
      narration: narration ?? this.narration,
      reference: reference ?? this.reference,
      total: total ?? this.total,
      status: status ?? this.status,
      syncState: syncState ?? this.syncState,
      syncError: syncError ?? this.syncError,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (companyId.present) {
      map['company_id'] = Variable<String>(companyId.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (number.present) {
      map['number'] = Variable<String>(number.value);
    }
    if (date.present) {
      map['date'] = Variable<String>(date.value);
    }
    if (narration.present) {
      map['narration'] = Variable<String>(narration.value);
    }
    if (reference.present) {
      map['reference'] = Variable<String>(reference.value);
    }
    if (total.present) {
      map['total'] = Variable<String>(total.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncState.present) {
      map['sync_state'] = Variable<String>(syncState.value);
    }
    if (syncError.present) {
      map['sync_error'] = Variable<String>(syncError.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('VouchersCompanion(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('type: $type, ')
          ..write('number: $number, ')
          ..write('date: $date, ')
          ..write('narration: $narration, ')
          ..write('reference: $reference, ')
          ..write('total: $total, ')
          ..write('status: $status, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $VoucherLinesTable extends VoucherLines
    with TableInfo<$VoucherLinesTable, VoucherLineRow> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $VoucherLinesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _voucherIdMeta = const VerificationMeta(
    'voucherId',
  );
  @override
  late final GeneratedColumn<String> voucherId = GeneratedColumn<String>(
    'voucher_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _lineNoMeta = const VerificationMeta('lineNo');
  @override
  late final GeneratedColumn<int> lineNo = GeneratedColumn<int>(
    'line_no',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _accountIdMeta = const VerificationMeta(
    'accountId',
  );
  @override
  late final GeneratedColumn<String> accountId = GeneratedColumn<String>(
    'account_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _debitMeta = const VerificationMeta('debit');
  @override
  late final GeneratedColumn<String> debit = GeneratedColumn<String>(
    'debit',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('0.00'),
  );
  static const VerificationMeta _creditMeta = const VerificationMeta('credit');
  @override
  late final GeneratedColumn<String> credit = GeneratedColumn<String>(
    'credit',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('0.00'),
  );
  @override
  List<GeneratedColumn> get $columns => [
    voucherId,
    lineNo,
    accountId,
    debit,
    credit,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'voucher_lines';
  @override
  VerificationContext validateIntegrity(
    Insertable<VoucherLineRow> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('voucher_id')) {
      context.handle(
        _voucherIdMeta,
        voucherId.isAcceptableOrUnknown(data['voucher_id']!, _voucherIdMeta),
      );
    } else if (isInserting) {
      context.missing(_voucherIdMeta);
    }
    if (data.containsKey('line_no')) {
      context.handle(
        _lineNoMeta,
        lineNo.isAcceptableOrUnknown(data['line_no']!, _lineNoMeta),
      );
    } else if (isInserting) {
      context.missing(_lineNoMeta);
    }
    if (data.containsKey('account_id')) {
      context.handle(
        _accountIdMeta,
        accountId.isAcceptableOrUnknown(data['account_id']!, _accountIdMeta),
      );
    } else if (isInserting) {
      context.missing(_accountIdMeta);
    }
    if (data.containsKey('debit')) {
      context.handle(
        _debitMeta,
        debit.isAcceptableOrUnknown(data['debit']!, _debitMeta),
      );
    }
    if (data.containsKey('credit')) {
      context.handle(
        _creditMeta,
        credit.isAcceptableOrUnknown(data['credit']!, _creditMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {voucherId, lineNo};
  @override
  VoucherLineRow map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return VoucherLineRow(
      voucherId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}voucher_id'],
      )!,
      lineNo: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}line_no'],
      )!,
      accountId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}account_id'],
      )!,
      debit: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}debit'],
      )!,
      credit: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}credit'],
      )!,
    );
  }

  @override
  $VoucherLinesTable createAlias(String alias) {
    return $VoucherLinesTable(attachedDatabase, alias);
  }
}

class VoucherLineRow extends DataClass implements Insertable<VoucherLineRow> {
  final String voucherId;
  final int lineNo;
  final String accountId;
  final String debit;
  final String credit;
  const VoucherLineRow({
    required this.voucherId,
    required this.lineNo,
    required this.accountId,
    required this.debit,
    required this.credit,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['voucher_id'] = Variable<String>(voucherId);
    map['line_no'] = Variable<int>(lineNo);
    map['account_id'] = Variable<String>(accountId);
    map['debit'] = Variable<String>(debit);
    map['credit'] = Variable<String>(credit);
    return map;
  }

  VoucherLinesCompanion toCompanion(bool nullToAbsent) {
    return VoucherLinesCompanion(
      voucherId: Value(voucherId),
      lineNo: Value(lineNo),
      accountId: Value(accountId),
      debit: Value(debit),
      credit: Value(credit),
    );
  }

  factory VoucherLineRow.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return VoucherLineRow(
      voucherId: serializer.fromJson<String>(json['voucherId']),
      lineNo: serializer.fromJson<int>(json['lineNo']),
      accountId: serializer.fromJson<String>(json['accountId']),
      debit: serializer.fromJson<String>(json['debit']),
      credit: serializer.fromJson<String>(json['credit']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'voucherId': serializer.toJson<String>(voucherId),
      'lineNo': serializer.toJson<int>(lineNo),
      'accountId': serializer.toJson<String>(accountId),
      'debit': serializer.toJson<String>(debit),
      'credit': serializer.toJson<String>(credit),
    };
  }

  VoucherLineRow copyWith({
    String? voucherId,
    int? lineNo,
    String? accountId,
    String? debit,
    String? credit,
  }) => VoucherLineRow(
    voucherId: voucherId ?? this.voucherId,
    lineNo: lineNo ?? this.lineNo,
    accountId: accountId ?? this.accountId,
    debit: debit ?? this.debit,
    credit: credit ?? this.credit,
  );
  VoucherLineRow copyWithCompanion(VoucherLinesCompanion data) {
    return VoucherLineRow(
      voucherId: data.voucherId.present ? data.voucherId.value : this.voucherId,
      lineNo: data.lineNo.present ? data.lineNo.value : this.lineNo,
      accountId: data.accountId.present ? data.accountId.value : this.accountId,
      debit: data.debit.present ? data.debit.value : this.debit,
      credit: data.credit.present ? data.credit.value : this.credit,
    );
  }

  @override
  String toString() {
    return (StringBuffer('VoucherLineRow(')
          ..write('voucherId: $voucherId, ')
          ..write('lineNo: $lineNo, ')
          ..write('accountId: $accountId, ')
          ..write('debit: $debit, ')
          ..write('credit: $credit')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(voucherId, lineNo, accountId, debit, credit);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is VoucherLineRow &&
          other.voucherId == this.voucherId &&
          other.lineNo == this.lineNo &&
          other.accountId == this.accountId &&
          other.debit == this.debit &&
          other.credit == this.credit);
}

class VoucherLinesCompanion extends UpdateCompanion<VoucherLineRow> {
  final Value<String> voucherId;
  final Value<int> lineNo;
  final Value<String> accountId;
  final Value<String> debit;
  final Value<String> credit;
  final Value<int> rowid;
  const VoucherLinesCompanion({
    this.voucherId = const Value.absent(),
    this.lineNo = const Value.absent(),
    this.accountId = const Value.absent(),
    this.debit = const Value.absent(),
    this.credit = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  VoucherLinesCompanion.insert({
    required String voucherId,
    required int lineNo,
    required String accountId,
    this.debit = const Value.absent(),
    this.credit = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : voucherId = Value(voucherId),
       lineNo = Value(lineNo),
       accountId = Value(accountId);
  static Insertable<VoucherLineRow> custom({
    Expression<String>? voucherId,
    Expression<int>? lineNo,
    Expression<String>? accountId,
    Expression<String>? debit,
    Expression<String>? credit,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (voucherId != null) 'voucher_id': voucherId,
      if (lineNo != null) 'line_no': lineNo,
      if (accountId != null) 'account_id': accountId,
      if (debit != null) 'debit': debit,
      if (credit != null) 'credit': credit,
      if (rowid != null) 'rowid': rowid,
    });
  }

  VoucherLinesCompanion copyWith({
    Value<String>? voucherId,
    Value<int>? lineNo,
    Value<String>? accountId,
    Value<String>? debit,
    Value<String>? credit,
    Value<int>? rowid,
  }) {
    return VoucherLinesCompanion(
      voucherId: voucherId ?? this.voucherId,
      lineNo: lineNo ?? this.lineNo,
      accountId: accountId ?? this.accountId,
      debit: debit ?? this.debit,
      credit: credit ?? this.credit,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (voucherId.present) {
      map['voucher_id'] = Variable<String>(voucherId.value);
    }
    if (lineNo.present) {
      map['line_no'] = Variable<int>(lineNo.value);
    }
    if (accountId.present) {
      map['account_id'] = Variable<String>(accountId.value);
    }
    if (debit.present) {
      map['debit'] = Variable<String>(debit.value);
    }
    if (credit.present) {
      map['credit'] = Variable<String>(credit.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('VoucherLinesCompanion(')
          ..write('voucherId: $voucherId, ')
          ..write('lineNo: $lineNo, ')
          ..write('accountId: $accountId, ')
          ..write('debit: $debit, ')
          ..write('credit: $credit, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DeviceSeriesTable extends DeviceSeries
    with TableInfo<$DeviceSeriesTable, DeviceSery> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DeviceSeriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _docTypeMeta = const VerificationMeta(
    'docType',
  );
  @override
  late final GeneratedColumn<String> docType = GeneratedColumn<String>(
    'doc_type',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _fyLabelMeta = const VerificationMeta(
    'fyLabel',
  );
  @override
  late final GeneratedColumn<String> fyLabel = GeneratedColumn<String>(
    'fy_label',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _patternMeta = const VerificationMeta(
    'pattern',
  );
  @override
  late final GeneratedColumn<String> pattern = GeneratedColumn<String>(
    'pattern',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nextSeqMeta = const VerificationMeta(
    'nextSeq',
  );
  @override
  late final GeneratedColumn<int> nextSeq = GeneratedColumn<int>(
    'next_seq',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(1),
  );
  @override
  List<GeneratedColumn> get $columns => [docType, fyLabel, pattern, nextSeq];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'device_series';
  @override
  VerificationContext validateIntegrity(
    Insertable<DeviceSery> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('doc_type')) {
      context.handle(
        _docTypeMeta,
        docType.isAcceptableOrUnknown(data['doc_type']!, _docTypeMeta),
      );
    } else if (isInserting) {
      context.missing(_docTypeMeta);
    }
    if (data.containsKey('fy_label')) {
      context.handle(
        _fyLabelMeta,
        fyLabel.isAcceptableOrUnknown(data['fy_label']!, _fyLabelMeta),
      );
    } else if (isInserting) {
      context.missing(_fyLabelMeta);
    }
    if (data.containsKey('pattern')) {
      context.handle(
        _patternMeta,
        pattern.isAcceptableOrUnknown(data['pattern']!, _patternMeta),
      );
    } else if (isInserting) {
      context.missing(_patternMeta);
    }
    if (data.containsKey('next_seq')) {
      context.handle(
        _nextSeqMeta,
        nextSeq.isAcceptableOrUnknown(data['next_seq']!, _nextSeqMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {docType, fyLabel};
  @override
  DeviceSery map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DeviceSery(
      docType: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}doc_type'],
      )!,
      fyLabel: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}fy_label'],
      )!,
      pattern: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}pattern'],
      )!,
      nextSeq: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}next_seq'],
      )!,
    );
  }

  @override
  $DeviceSeriesTable createAlias(String alias) {
    return $DeviceSeriesTable(attachedDatabase, alias);
  }
}

class DeviceSery extends DataClass implements Insertable<DeviceSery> {
  final String docType;
  final String fyLabel;
  final String pattern;
  final int nextSeq;
  const DeviceSery({
    required this.docType,
    required this.fyLabel,
    required this.pattern,
    required this.nextSeq,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['doc_type'] = Variable<String>(docType);
    map['fy_label'] = Variable<String>(fyLabel);
    map['pattern'] = Variable<String>(pattern);
    map['next_seq'] = Variable<int>(nextSeq);
    return map;
  }

  DeviceSeriesCompanion toCompanion(bool nullToAbsent) {
    return DeviceSeriesCompanion(
      docType: Value(docType),
      fyLabel: Value(fyLabel),
      pattern: Value(pattern),
      nextSeq: Value(nextSeq),
    );
  }

  factory DeviceSery.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DeviceSery(
      docType: serializer.fromJson<String>(json['docType']),
      fyLabel: serializer.fromJson<String>(json['fyLabel']),
      pattern: serializer.fromJson<String>(json['pattern']),
      nextSeq: serializer.fromJson<int>(json['nextSeq']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'docType': serializer.toJson<String>(docType),
      'fyLabel': serializer.toJson<String>(fyLabel),
      'pattern': serializer.toJson<String>(pattern),
      'nextSeq': serializer.toJson<int>(nextSeq),
    };
  }

  DeviceSery copyWith({
    String? docType,
    String? fyLabel,
    String? pattern,
    int? nextSeq,
  }) => DeviceSery(
    docType: docType ?? this.docType,
    fyLabel: fyLabel ?? this.fyLabel,
    pattern: pattern ?? this.pattern,
    nextSeq: nextSeq ?? this.nextSeq,
  );
  DeviceSery copyWithCompanion(DeviceSeriesCompanion data) {
    return DeviceSery(
      docType: data.docType.present ? data.docType.value : this.docType,
      fyLabel: data.fyLabel.present ? data.fyLabel.value : this.fyLabel,
      pattern: data.pattern.present ? data.pattern.value : this.pattern,
      nextSeq: data.nextSeq.present ? data.nextSeq.value : this.nextSeq,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DeviceSery(')
          ..write('docType: $docType, ')
          ..write('fyLabel: $fyLabel, ')
          ..write('pattern: $pattern, ')
          ..write('nextSeq: $nextSeq')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(docType, fyLabel, pattern, nextSeq);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DeviceSery &&
          other.docType == this.docType &&
          other.fyLabel == this.fyLabel &&
          other.pattern == this.pattern &&
          other.nextSeq == this.nextSeq);
}

class DeviceSeriesCompanion extends UpdateCompanion<DeviceSery> {
  final Value<String> docType;
  final Value<String> fyLabel;
  final Value<String> pattern;
  final Value<int> nextSeq;
  final Value<int> rowid;
  const DeviceSeriesCompanion({
    this.docType = const Value.absent(),
    this.fyLabel = const Value.absent(),
    this.pattern = const Value.absent(),
    this.nextSeq = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DeviceSeriesCompanion.insert({
    required String docType,
    required String fyLabel,
    required String pattern,
    this.nextSeq = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : docType = Value(docType),
       fyLabel = Value(fyLabel),
       pattern = Value(pattern);
  static Insertable<DeviceSery> custom({
    Expression<String>? docType,
    Expression<String>? fyLabel,
    Expression<String>? pattern,
    Expression<int>? nextSeq,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (docType != null) 'doc_type': docType,
      if (fyLabel != null) 'fy_label': fyLabel,
      if (pattern != null) 'pattern': pattern,
      if (nextSeq != null) 'next_seq': nextSeq,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DeviceSeriesCompanion copyWith({
    Value<String>? docType,
    Value<String>? fyLabel,
    Value<String>? pattern,
    Value<int>? nextSeq,
    Value<int>? rowid,
  }) {
    return DeviceSeriesCompanion(
      docType: docType ?? this.docType,
      fyLabel: fyLabel ?? this.fyLabel,
      pattern: pattern ?? this.pattern,
      nextSeq: nextSeq ?? this.nextSeq,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (docType.present) {
      map['doc_type'] = Variable<String>(docType.value);
    }
    if (fyLabel.present) {
      map['fy_label'] = Variable<String>(fyLabel.value);
    }
    if (pattern.present) {
      map['pattern'] = Variable<String>(pattern.value);
    }
    if (nextSeq.present) {
      map['next_seq'] = Variable<int>(nextSeq.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DeviceSeriesCompanion(')
          ..write('docType: $docType, ')
          ..write('fyLabel: $fyLabel, ')
          ..write('pattern: $pattern, ')
          ..write('nextSeq: $nextSeq, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $OutboxTable extends Outbox with TableInfo<$OutboxTable, OutboxData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $OutboxTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _seqMeta = const VerificationMeta('seq');
  @override
  late final GeneratedColumn<int> seq = GeneratedColumn<int>(
    'seq',
    aliasedName,
    false,
    hasAutoIncrement: true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'PRIMARY KEY AUTOINCREMENT',
    ),
  );
  static const VerificationMeta _opIdMeta = const VerificationMeta('opId');
  @override
  late final GeneratedColumn<String> opId = GeneratedColumn<String>(
    'op_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _kindMeta = const VerificationMeta('kind');
  @override
  late final GeneratedColumn<String> kind = GeneratedColumn<String>(
    'kind',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _payloadMeta = const VerificationMeta(
    'payload',
  );
  @override
  late final GeneratedColumn<String> payload = GeneratedColumn<String>(
    'payload',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _stateMeta = const VerificationMeta('state');
  @override
  late final GeneratedColumn<String> state = GeneratedColumn<String>(
    'state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  static const VerificationMeta _errorMeta = const VerificationMeta('error');
  @override
  late final GeneratedColumn<String> error = GeneratedColumn<String>(
    'error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    seq,
    opId,
    kind,
    payload,
    state,
    error,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'outbox';
  @override
  VerificationContext validateIntegrity(
    Insertable<OutboxData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('seq')) {
      context.handle(
        _seqMeta,
        seq.isAcceptableOrUnknown(data['seq']!, _seqMeta),
      );
    }
    if (data.containsKey('op_id')) {
      context.handle(
        _opIdMeta,
        opId.isAcceptableOrUnknown(data['op_id']!, _opIdMeta),
      );
    } else if (isInserting) {
      context.missing(_opIdMeta);
    }
    if (data.containsKey('kind')) {
      context.handle(
        _kindMeta,
        kind.isAcceptableOrUnknown(data['kind']!, _kindMeta),
      );
    } else if (isInserting) {
      context.missing(_kindMeta);
    }
    if (data.containsKey('payload')) {
      context.handle(
        _payloadMeta,
        payload.isAcceptableOrUnknown(data['payload']!, _payloadMeta),
      );
    } else if (isInserting) {
      context.missing(_payloadMeta);
    }
    if (data.containsKey('state')) {
      context.handle(
        _stateMeta,
        state.isAcceptableOrUnknown(data['state']!, _stateMeta),
      );
    }
    if (data.containsKey('error')) {
      context.handle(
        _errorMeta,
        error.isAcceptableOrUnknown(data['error']!, _errorMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {seq};
  @override
  OutboxData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return OutboxData(
      seq: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}seq'],
      )!,
      opId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}op_id'],
      )!,
      kind: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}kind'],
      )!,
      payload: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}payload'],
      )!,
      state: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}state'],
      )!,
      error: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}error'],
      ),
    );
  }

  @override
  $OutboxTable createAlias(String alias) {
    return $OutboxTable(attachedDatabase, alias);
  }
}

class OutboxData extends DataClass implements Insertable<OutboxData> {
  final int seq;
  final String opId;
  final String kind;
  final String payload;
  final String state;
  final String? error;
  const OutboxData({
    required this.seq,
    required this.opId,
    required this.kind,
    required this.payload,
    required this.state,
    this.error,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['seq'] = Variable<int>(seq);
    map['op_id'] = Variable<String>(opId);
    map['kind'] = Variable<String>(kind);
    map['payload'] = Variable<String>(payload);
    map['state'] = Variable<String>(state);
    if (!nullToAbsent || error != null) {
      map['error'] = Variable<String>(error);
    }
    return map;
  }

  OutboxCompanion toCompanion(bool nullToAbsent) {
    return OutboxCompanion(
      seq: Value(seq),
      opId: Value(opId),
      kind: Value(kind),
      payload: Value(payload),
      state: Value(state),
      error: error == null && nullToAbsent
          ? const Value.absent()
          : Value(error),
    );
  }

  factory OutboxData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return OutboxData(
      seq: serializer.fromJson<int>(json['seq']),
      opId: serializer.fromJson<String>(json['opId']),
      kind: serializer.fromJson<String>(json['kind']),
      payload: serializer.fromJson<String>(json['payload']),
      state: serializer.fromJson<String>(json['state']),
      error: serializer.fromJson<String?>(json['error']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'seq': serializer.toJson<int>(seq),
      'opId': serializer.toJson<String>(opId),
      'kind': serializer.toJson<String>(kind),
      'payload': serializer.toJson<String>(payload),
      'state': serializer.toJson<String>(state),
      'error': serializer.toJson<String?>(error),
    };
  }

  OutboxData copyWith({
    int? seq,
    String? opId,
    String? kind,
    String? payload,
    String? state,
    Value<String?> error = const Value.absent(),
  }) => OutboxData(
    seq: seq ?? this.seq,
    opId: opId ?? this.opId,
    kind: kind ?? this.kind,
    payload: payload ?? this.payload,
    state: state ?? this.state,
    error: error.present ? error.value : this.error,
  );
  OutboxData copyWithCompanion(OutboxCompanion data) {
    return OutboxData(
      seq: data.seq.present ? data.seq.value : this.seq,
      opId: data.opId.present ? data.opId.value : this.opId,
      kind: data.kind.present ? data.kind.value : this.kind,
      payload: data.payload.present ? data.payload.value : this.payload,
      state: data.state.present ? data.state.value : this.state,
      error: data.error.present ? data.error.value : this.error,
    );
  }

  @override
  String toString() {
    return (StringBuffer('OutboxData(')
          ..write('seq: $seq, ')
          ..write('opId: $opId, ')
          ..write('kind: $kind, ')
          ..write('payload: $payload, ')
          ..write('state: $state, ')
          ..write('error: $error')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(seq, opId, kind, payload, state, error);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is OutboxData &&
          other.seq == this.seq &&
          other.opId == this.opId &&
          other.kind == this.kind &&
          other.payload == this.payload &&
          other.state == this.state &&
          other.error == this.error);
}

class OutboxCompanion extends UpdateCompanion<OutboxData> {
  final Value<int> seq;
  final Value<String> opId;
  final Value<String> kind;
  final Value<String> payload;
  final Value<String> state;
  final Value<String?> error;
  const OutboxCompanion({
    this.seq = const Value.absent(),
    this.opId = const Value.absent(),
    this.kind = const Value.absent(),
    this.payload = const Value.absent(),
    this.state = const Value.absent(),
    this.error = const Value.absent(),
  });
  OutboxCompanion.insert({
    this.seq = const Value.absent(),
    required String opId,
    required String kind,
    required String payload,
    this.state = const Value.absent(),
    this.error = const Value.absent(),
  }) : opId = Value(opId),
       kind = Value(kind),
       payload = Value(payload);
  static Insertable<OutboxData> custom({
    Expression<int>? seq,
    Expression<String>? opId,
    Expression<String>? kind,
    Expression<String>? payload,
    Expression<String>? state,
    Expression<String>? error,
  }) {
    return RawValuesInsertable({
      if (seq != null) 'seq': seq,
      if (opId != null) 'op_id': opId,
      if (kind != null) 'kind': kind,
      if (payload != null) 'payload': payload,
      if (state != null) 'state': state,
      if (error != null) 'error': error,
    });
  }

  OutboxCompanion copyWith({
    Value<int>? seq,
    Value<String>? opId,
    Value<String>? kind,
    Value<String>? payload,
    Value<String>? state,
    Value<String?>? error,
  }) {
    return OutboxCompanion(
      seq: seq ?? this.seq,
      opId: opId ?? this.opId,
      kind: kind ?? this.kind,
      payload: payload ?? this.payload,
      state: state ?? this.state,
      error: error ?? this.error,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (seq.present) {
      map['seq'] = Variable<int>(seq.value);
    }
    if (opId.present) {
      map['op_id'] = Variable<String>(opId.value);
    }
    if (kind.present) {
      map['kind'] = Variable<String>(kind.value);
    }
    if (payload.present) {
      map['payload'] = Variable<String>(payload.value);
    }
    if (state.present) {
      map['state'] = Variable<String>(state.value);
    }
    if (error.present) {
      map['error'] = Variable<String>(error.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('OutboxCompanion(')
          ..write('seq: $seq, ')
          ..write('opId: $opId, ')
          ..write('kind: $kind, ')
          ..write('payload: $payload, ')
          ..write('state: $state, ')
          ..write('error: $error')
          ..write(')'))
        .toString();
  }
}

class $EmployeesTable extends Employees
    with TableInfo<$EmployeesTable, Employee> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $EmployeesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _companyIdMeta = const VerificationMeta(
    'companyId',
  );
  @override
  late final GeneratedColumn<String> companyId = GeneratedColumn<String>(
    'company_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _codeMeta = const VerificationMeta('code');
  @override
  late final GeneratedColumn<String> code = GeneratedColumn<String>(
    'code',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameHiMeta = const VerificationMeta('nameHi');
  @override
  late final GeneratedColumn<String> nameHi = GeneratedColumn<String>(
    'name_hi',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _designationMeta = const VerificationMeta(
    'designation',
  );
  @override
  late final GeneratedColumn<String> designation = GeneratedColumn<String>(
    'designation',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _departmentMeta = const VerificationMeta(
    'department',
  );
  @override
  late final GeneratedColumn<String> department = GeneratedColumn<String>(
    'department',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _joinedOnMeta = const VerificationMeta(
    'joinedOn',
  );
  @override
  late final GeneratedColumn<String> joinedOn = GeneratedColumn<String>(
    'joined_on',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _leftOnMeta = const VerificationMeta('leftOn');
  @override
  late final GeneratedColumn<String> leftOn = GeneratedColumn<String>(
    'left_on',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _phoneMeta = const VerificationMeta('phone');
  @override
  late final GeneratedColumn<String> phone = GeneratedColumn<String>(
    'phone',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    companyId,
    code,
    name,
    nameHi,
    designation,
    department,
    joinedOn,
    leftOn,
    status,
    phone,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'employees';
  @override
  VerificationContext validateIntegrity(
    Insertable<Employee> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('company_id')) {
      context.handle(
        _companyIdMeta,
        companyId.isAcceptableOrUnknown(data['company_id']!, _companyIdMeta),
      );
    } else if (isInserting) {
      context.missing(_companyIdMeta);
    }
    if (data.containsKey('code')) {
      context.handle(
        _codeMeta,
        code.isAcceptableOrUnknown(data['code']!, _codeMeta),
      );
    } else if (isInserting) {
      context.missing(_codeMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('name_hi')) {
      context.handle(
        _nameHiMeta,
        nameHi.isAcceptableOrUnknown(data['name_hi']!, _nameHiMeta),
      );
    }
    if (data.containsKey('designation')) {
      context.handle(
        _designationMeta,
        designation.isAcceptableOrUnknown(
          data['designation']!,
          _designationMeta,
        ),
      );
    }
    if (data.containsKey('department')) {
      context.handle(
        _departmentMeta,
        department.isAcceptableOrUnknown(data['department']!, _departmentMeta),
      );
    }
    if (data.containsKey('joined_on')) {
      context.handle(
        _joinedOnMeta,
        joinedOn.isAcceptableOrUnknown(data['joined_on']!, _joinedOnMeta),
      );
    } else if (isInserting) {
      context.missing(_joinedOnMeta);
    }
    if (data.containsKey('left_on')) {
      context.handle(
        _leftOnMeta,
        leftOn.isAcceptableOrUnknown(data['left_on']!, _leftOnMeta),
      );
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    } else if (isInserting) {
      context.missing(_statusMeta);
    }
    if (data.containsKey('phone')) {
      context.handle(
        _phoneMeta,
        phone.isAcceptableOrUnknown(data['phone']!, _phoneMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Employee map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Employee(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      companyId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}company_id'],
      )!,
      code: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}code'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      nameHi: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name_hi'],
      ),
      designation: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}designation'],
      ),
      department: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}department'],
      ),
      joinedOn: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}joined_on'],
      )!,
      leftOn: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}left_on'],
      ),
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
      phone: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}phone'],
      ),
    );
  }

  @override
  $EmployeesTable createAlias(String alias) {
    return $EmployeesTable(attachedDatabase, alias);
  }
}

class Employee extends DataClass implements Insertable<Employee> {
  final String id;
  final String companyId;
  final String code;
  final String name;
  final String? nameHi;
  final String? designation;
  final String? department;
  final String joinedOn;
  final String? leftOn;
  final String status;
  final String? phone;
  const Employee({
    required this.id,
    required this.companyId,
    required this.code,
    required this.name,
    this.nameHi,
    this.designation,
    this.department,
    required this.joinedOn,
    this.leftOn,
    required this.status,
    this.phone,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['company_id'] = Variable<String>(companyId);
    map['code'] = Variable<String>(code);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || nameHi != null) {
      map['name_hi'] = Variable<String>(nameHi);
    }
    if (!nullToAbsent || designation != null) {
      map['designation'] = Variable<String>(designation);
    }
    if (!nullToAbsent || department != null) {
      map['department'] = Variable<String>(department);
    }
    map['joined_on'] = Variable<String>(joinedOn);
    if (!nullToAbsent || leftOn != null) {
      map['left_on'] = Variable<String>(leftOn);
    }
    map['status'] = Variable<String>(status);
    if (!nullToAbsent || phone != null) {
      map['phone'] = Variable<String>(phone);
    }
    return map;
  }

  EmployeesCompanion toCompanion(bool nullToAbsent) {
    return EmployeesCompanion(
      id: Value(id),
      companyId: Value(companyId),
      code: Value(code),
      name: Value(name),
      nameHi: nameHi == null && nullToAbsent
          ? const Value.absent()
          : Value(nameHi),
      designation: designation == null && nullToAbsent
          ? const Value.absent()
          : Value(designation),
      department: department == null && nullToAbsent
          ? const Value.absent()
          : Value(department),
      joinedOn: Value(joinedOn),
      leftOn: leftOn == null && nullToAbsent
          ? const Value.absent()
          : Value(leftOn),
      status: Value(status),
      phone: phone == null && nullToAbsent
          ? const Value.absent()
          : Value(phone),
    );
  }

  factory Employee.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Employee(
      id: serializer.fromJson<String>(json['id']),
      companyId: serializer.fromJson<String>(json['companyId']),
      code: serializer.fromJson<String>(json['code']),
      name: serializer.fromJson<String>(json['name']),
      nameHi: serializer.fromJson<String?>(json['nameHi']),
      designation: serializer.fromJson<String?>(json['designation']),
      department: serializer.fromJson<String?>(json['department']),
      joinedOn: serializer.fromJson<String>(json['joinedOn']),
      leftOn: serializer.fromJson<String?>(json['leftOn']),
      status: serializer.fromJson<String>(json['status']),
      phone: serializer.fromJson<String?>(json['phone']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'companyId': serializer.toJson<String>(companyId),
      'code': serializer.toJson<String>(code),
      'name': serializer.toJson<String>(name),
      'nameHi': serializer.toJson<String?>(nameHi),
      'designation': serializer.toJson<String?>(designation),
      'department': serializer.toJson<String?>(department),
      'joinedOn': serializer.toJson<String>(joinedOn),
      'leftOn': serializer.toJson<String?>(leftOn),
      'status': serializer.toJson<String>(status),
      'phone': serializer.toJson<String?>(phone),
    };
  }

  Employee copyWith({
    String? id,
    String? companyId,
    String? code,
    String? name,
    Value<String?> nameHi = const Value.absent(),
    Value<String?> designation = const Value.absent(),
    Value<String?> department = const Value.absent(),
    String? joinedOn,
    Value<String?> leftOn = const Value.absent(),
    String? status,
    Value<String?> phone = const Value.absent(),
  }) => Employee(
    id: id ?? this.id,
    companyId: companyId ?? this.companyId,
    code: code ?? this.code,
    name: name ?? this.name,
    nameHi: nameHi.present ? nameHi.value : this.nameHi,
    designation: designation.present ? designation.value : this.designation,
    department: department.present ? department.value : this.department,
    joinedOn: joinedOn ?? this.joinedOn,
    leftOn: leftOn.present ? leftOn.value : this.leftOn,
    status: status ?? this.status,
    phone: phone.present ? phone.value : this.phone,
  );
  Employee copyWithCompanion(EmployeesCompanion data) {
    return Employee(
      id: data.id.present ? data.id.value : this.id,
      companyId: data.companyId.present ? data.companyId.value : this.companyId,
      code: data.code.present ? data.code.value : this.code,
      name: data.name.present ? data.name.value : this.name,
      nameHi: data.nameHi.present ? data.nameHi.value : this.nameHi,
      designation: data.designation.present
          ? data.designation.value
          : this.designation,
      department: data.department.present
          ? data.department.value
          : this.department,
      joinedOn: data.joinedOn.present ? data.joinedOn.value : this.joinedOn,
      leftOn: data.leftOn.present ? data.leftOn.value : this.leftOn,
      status: data.status.present ? data.status.value : this.status,
      phone: data.phone.present ? data.phone.value : this.phone,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Employee(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('designation: $designation, ')
          ..write('department: $department, ')
          ..write('joinedOn: $joinedOn, ')
          ..write('leftOn: $leftOn, ')
          ..write('status: $status, ')
          ..write('phone: $phone')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    companyId,
    code,
    name,
    nameHi,
    designation,
    department,
    joinedOn,
    leftOn,
    status,
    phone,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Employee &&
          other.id == this.id &&
          other.companyId == this.companyId &&
          other.code == this.code &&
          other.name == this.name &&
          other.nameHi == this.nameHi &&
          other.designation == this.designation &&
          other.department == this.department &&
          other.joinedOn == this.joinedOn &&
          other.leftOn == this.leftOn &&
          other.status == this.status &&
          other.phone == this.phone);
}

class EmployeesCompanion extends UpdateCompanion<Employee> {
  final Value<String> id;
  final Value<String> companyId;
  final Value<String> code;
  final Value<String> name;
  final Value<String?> nameHi;
  final Value<String?> designation;
  final Value<String?> department;
  final Value<String> joinedOn;
  final Value<String?> leftOn;
  final Value<String> status;
  final Value<String?> phone;
  final Value<int> rowid;
  const EmployeesCompanion({
    this.id = const Value.absent(),
    this.companyId = const Value.absent(),
    this.code = const Value.absent(),
    this.name = const Value.absent(),
    this.nameHi = const Value.absent(),
    this.designation = const Value.absent(),
    this.department = const Value.absent(),
    this.joinedOn = const Value.absent(),
    this.leftOn = const Value.absent(),
    this.status = const Value.absent(),
    this.phone = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  EmployeesCompanion.insert({
    required String id,
    required String companyId,
    required String code,
    required String name,
    this.nameHi = const Value.absent(),
    this.designation = const Value.absent(),
    this.department = const Value.absent(),
    required String joinedOn,
    this.leftOn = const Value.absent(),
    required String status,
    this.phone = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       companyId = Value(companyId),
       code = Value(code),
       name = Value(name),
       joinedOn = Value(joinedOn),
       status = Value(status);
  static Insertable<Employee> custom({
    Expression<String>? id,
    Expression<String>? companyId,
    Expression<String>? code,
    Expression<String>? name,
    Expression<String>? nameHi,
    Expression<String>? designation,
    Expression<String>? department,
    Expression<String>? joinedOn,
    Expression<String>? leftOn,
    Expression<String>? status,
    Expression<String>? phone,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (companyId != null) 'company_id': companyId,
      if (code != null) 'code': code,
      if (name != null) 'name': name,
      if (nameHi != null) 'name_hi': nameHi,
      if (designation != null) 'designation': designation,
      if (department != null) 'department': department,
      if (joinedOn != null) 'joined_on': joinedOn,
      if (leftOn != null) 'left_on': leftOn,
      if (status != null) 'status': status,
      if (phone != null) 'phone': phone,
      if (rowid != null) 'rowid': rowid,
    });
  }

  EmployeesCompanion copyWith({
    Value<String>? id,
    Value<String>? companyId,
    Value<String>? code,
    Value<String>? name,
    Value<String?>? nameHi,
    Value<String?>? designation,
    Value<String?>? department,
    Value<String>? joinedOn,
    Value<String?>? leftOn,
    Value<String>? status,
    Value<String?>? phone,
    Value<int>? rowid,
  }) {
    return EmployeesCompanion(
      id: id ?? this.id,
      companyId: companyId ?? this.companyId,
      code: code ?? this.code,
      name: name ?? this.name,
      nameHi: nameHi ?? this.nameHi,
      designation: designation ?? this.designation,
      department: department ?? this.department,
      joinedOn: joinedOn ?? this.joinedOn,
      leftOn: leftOn ?? this.leftOn,
      status: status ?? this.status,
      phone: phone ?? this.phone,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (companyId.present) {
      map['company_id'] = Variable<String>(companyId.value);
    }
    if (code.present) {
      map['code'] = Variable<String>(code.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (nameHi.present) {
      map['name_hi'] = Variable<String>(nameHi.value);
    }
    if (designation.present) {
      map['designation'] = Variable<String>(designation.value);
    }
    if (department.present) {
      map['department'] = Variable<String>(department.value);
    }
    if (joinedOn.present) {
      map['joined_on'] = Variable<String>(joinedOn.value);
    }
    if (leftOn.present) {
      map['left_on'] = Variable<String>(leftOn.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (phone.present) {
      map['phone'] = Variable<String>(phone.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('EmployeesCompanion(')
          ..write('id: $id, ')
          ..write('companyId: $companyId, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('designation: $designation, ')
          ..write('department: $department, ')
          ..write('joinedOn: $joinedOn, ')
          ..write('leftOn: $leftOn, ')
          ..write('status: $status, ')
          ..write('phone: $phone, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $LeaveTypesTable extends LeaveTypes
    with TableInfo<$LeaveTypesTable, LeaveType> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LeaveTypesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _codeMeta = const VerificationMeta('code');
  @override
  late final GeneratedColumn<String> code = GeneratedColumn<String>(
    'code',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameHiMeta = const VerificationMeta('nameHi');
  @override
  late final GeneratedColumn<String> nameHi = GeneratedColumn<String>(
    'name_hi',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _paidMeta = const VerificationMeta('paid');
  @override
  late final GeneratedColumn<bool> paid = GeneratedColumn<bool>(
    'paid',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("paid" IN (0, 1))',
    ),
    defaultValue: const Constant(true),
  );
  static const VerificationMeta _archivedMeta = const VerificationMeta(
    'archived',
  );
  @override
  late final GeneratedColumn<bool> archived = GeneratedColumn<bool>(
    'archived',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("archived" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    code,
    name,
    nameHi,
    paid,
    archived,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'leave_types';
  @override
  VerificationContext validateIntegrity(
    Insertable<LeaveType> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('code')) {
      context.handle(
        _codeMeta,
        code.isAcceptableOrUnknown(data['code']!, _codeMeta),
      );
    } else if (isInserting) {
      context.missing(_codeMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('name_hi')) {
      context.handle(
        _nameHiMeta,
        nameHi.isAcceptableOrUnknown(data['name_hi']!, _nameHiMeta),
      );
    }
    if (data.containsKey('paid')) {
      context.handle(
        _paidMeta,
        paid.isAcceptableOrUnknown(data['paid']!, _paidMeta),
      );
    }
    if (data.containsKey('archived')) {
      context.handle(
        _archivedMeta,
        archived.isAcceptableOrUnknown(data['archived']!, _archivedMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LeaveType map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LeaveType(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      code: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}code'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      nameHi: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name_hi'],
      ),
      paid: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}paid'],
      )!,
      archived: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}archived'],
      )!,
    );
  }

  @override
  $LeaveTypesTable createAlias(String alias) {
    return $LeaveTypesTable(attachedDatabase, alias);
  }
}

class LeaveType extends DataClass implements Insertable<LeaveType> {
  final String id;
  final String code;
  final String name;
  final String? nameHi;
  final bool paid;
  final bool archived;
  const LeaveType({
    required this.id,
    required this.code,
    required this.name,
    this.nameHi,
    required this.paid,
    required this.archived,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['code'] = Variable<String>(code);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || nameHi != null) {
      map['name_hi'] = Variable<String>(nameHi);
    }
    map['paid'] = Variable<bool>(paid);
    map['archived'] = Variable<bool>(archived);
    return map;
  }

  LeaveTypesCompanion toCompanion(bool nullToAbsent) {
    return LeaveTypesCompanion(
      id: Value(id),
      code: Value(code),
      name: Value(name),
      nameHi: nameHi == null && nullToAbsent
          ? const Value.absent()
          : Value(nameHi),
      paid: Value(paid),
      archived: Value(archived),
    );
  }

  factory LeaveType.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LeaveType(
      id: serializer.fromJson<String>(json['id']),
      code: serializer.fromJson<String>(json['code']),
      name: serializer.fromJson<String>(json['name']),
      nameHi: serializer.fromJson<String?>(json['nameHi']),
      paid: serializer.fromJson<bool>(json['paid']),
      archived: serializer.fromJson<bool>(json['archived']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'code': serializer.toJson<String>(code),
      'name': serializer.toJson<String>(name),
      'nameHi': serializer.toJson<String?>(nameHi),
      'paid': serializer.toJson<bool>(paid),
      'archived': serializer.toJson<bool>(archived),
    };
  }

  LeaveType copyWith({
    String? id,
    String? code,
    String? name,
    Value<String?> nameHi = const Value.absent(),
    bool? paid,
    bool? archived,
  }) => LeaveType(
    id: id ?? this.id,
    code: code ?? this.code,
    name: name ?? this.name,
    nameHi: nameHi.present ? nameHi.value : this.nameHi,
    paid: paid ?? this.paid,
    archived: archived ?? this.archived,
  );
  LeaveType copyWithCompanion(LeaveTypesCompanion data) {
    return LeaveType(
      id: data.id.present ? data.id.value : this.id,
      code: data.code.present ? data.code.value : this.code,
      name: data.name.present ? data.name.value : this.name,
      nameHi: data.nameHi.present ? data.nameHi.value : this.nameHi,
      paid: data.paid.present ? data.paid.value : this.paid,
      archived: data.archived.present ? data.archived.value : this.archived,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LeaveType(')
          ..write('id: $id, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('paid: $paid, ')
          ..write('archived: $archived')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, code, name, nameHi, paid, archived);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LeaveType &&
          other.id == this.id &&
          other.code == this.code &&
          other.name == this.name &&
          other.nameHi == this.nameHi &&
          other.paid == this.paid &&
          other.archived == this.archived);
}

class LeaveTypesCompanion extends UpdateCompanion<LeaveType> {
  final Value<String> id;
  final Value<String> code;
  final Value<String> name;
  final Value<String?> nameHi;
  final Value<bool> paid;
  final Value<bool> archived;
  final Value<int> rowid;
  const LeaveTypesCompanion({
    this.id = const Value.absent(),
    this.code = const Value.absent(),
    this.name = const Value.absent(),
    this.nameHi = const Value.absent(),
    this.paid = const Value.absent(),
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  LeaveTypesCompanion.insert({
    required String id,
    required String code,
    required String name,
    this.nameHi = const Value.absent(),
    this.paid = const Value.absent(),
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       code = Value(code),
       name = Value(name);
  static Insertable<LeaveType> custom({
    Expression<String>? id,
    Expression<String>? code,
    Expression<String>? name,
    Expression<String>? nameHi,
    Expression<bool>? paid,
    Expression<bool>? archived,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (code != null) 'code': code,
      if (name != null) 'name': name,
      if (nameHi != null) 'name_hi': nameHi,
      if (paid != null) 'paid': paid,
      if (archived != null) 'archived': archived,
      if (rowid != null) 'rowid': rowid,
    });
  }

  LeaveTypesCompanion copyWith({
    Value<String>? id,
    Value<String>? code,
    Value<String>? name,
    Value<String?>? nameHi,
    Value<bool>? paid,
    Value<bool>? archived,
    Value<int>? rowid,
  }) {
    return LeaveTypesCompanion(
      id: id ?? this.id,
      code: code ?? this.code,
      name: name ?? this.name,
      nameHi: nameHi ?? this.nameHi,
      paid: paid ?? this.paid,
      archived: archived ?? this.archived,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (code.present) {
      map['code'] = Variable<String>(code.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (nameHi.present) {
      map['name_hi'] = Variable<String>(nameHi.value);
    }
    if (paid.present) {
      map['paid'] = Variable<bool>(paid.value);
    }
    if (archived.present) {
      map['archived'] = Variable<bool>(archived.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LeaveTypesCompanion(')
          ..write('id: $id, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('paid: $paid, ')
          ..write('archived: $archived, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $LeaveRequestsTable extends LeaveRequests
    with TableInfo<$LeaveRequestsTable, LeaveRequest> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LeaveRequestsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _employeeIdMeta = const VerificationMeta(
    'employeeId',
  );
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
    'employee_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _leaveTypeIdMeta = const VerificationMeta(
    'leaveTypeId',
  );
  @override
  late final GeneratedColumn<String> leaveTypeId = GeneratedColumn<String>(
    'leave_type_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _fromDateMeta = const VerificationMeta(
    'fromDate',
  );
  @override
  late final GeneratedColumn<String> fromDate = GeneratedColumn<String>(
    'from_date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _toDateMeta = const VerificationMeta('toDate');
  @override
  late final GeneratedColumn<String> toDate = GeneratedColumn<String>(
    'to_date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _halfDayMeta = const VerificationMeta(
    'halfDay',
  );
  @override
  late final GeneratedColumn<bool> halfDay = GeneratedColumn<bool>(
    'half_day',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("half_day" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _daysMeta = const VerificationMeta('days');
  @override
  late final GeneratedColumn<String> days = GeneratedColumn<String>(
    'days',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _reasonMeta = const VerificationMeta('reason');
  @override
  late final GeneratedColumn<String> reason = GeneratedColumn<String>(
    'reason',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  static const VerificationMeta _syncStateMeta = const VerificationMeta(
    'syncState',
  );
  @override
  late final GeneratedColumn<String> syncState = GeneratedColumn<String>(
    'sync_state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('synced'),
  );
  static const VerificationMeta _syncErrorMeta = const VerificationMeta(
    'syncError',
  );
  @override
  late final GeneratedColumn<String> syncError = GeneratedColumn<String>(
    'sync_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    employeeId,
    leaveTypeId,
    fromDate,
    toDate,
    halfDay,
    days,
    reason,
    status,
    syncState,
    syncError,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'leave_requests';
  @override
  VerificationContext validateIntegrity(
    Insertable<LeaveRequest> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('employee_id')) {
      context.handle(
        _employeeIdMeta,
        employeeId.isAcceptableOrUnknown(data['employee_id']!, _employeeIdMeta),
      );
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('leave_type_id')) {
      context.handle(
        _leaveTypeIdMeta,
        leaveTypeId.isAcceptableOrUnknown(
          data['leave_type_id']!,
          _leaveTypeIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_leaveTypeIdMeta);
    }
    if (data.containsKey('from_date')) {
      context.handle(
        _fromDateMeta,
        fromDate.isAcceptableOrUnknown(data['from_date']!, _fromDateMeta),
      );
    } else if (isInserting) {
      context.missing(_fromDateMeta);
    }
    if (data.containsKey('to_date')) {
      context.handle(
        _toDateMeta,
        toDate.isAcceptableOrUnknown(data['to_date']!, _toDateMeta),
      );
    } else if (isInserting) {
      context.missing(_toDateMeta);
    }
    if (data.containsKey('half_day')) {
      context.handle(
        _halfDayMeta,
        halfDay.isAcceptableOrUnknown(data['half_day']!, _halfDayMeta),
      );
    }
    if (data.containsKey('days')) {
      context.handle(
        _daysMeta,
        days.isAcceptableOrUnknown(data['days']!, _daysMeta),
      );
    }
    if (data.containsKey('reason')) {
      context.handle(
        _reasonMeta,
        reason.isAcceptableOrUnknown(data['reason']!, _reasonMeta),
      );
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    }
    if (data.containsKey('sync_state')) {
      context.handle(
        _syncStateMeta,
        syncState.isAcceptableOrUnknown(data['sync_state']!, _syncStateMeta),
      );
    }
    if (data.containsKey('sync_error')) {
      context.handle(
        _syncErrorMeta,
        syncError.isAcceptableOrUnknown(data['sync_error']!, _syncErrorMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LeaveRequest map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LeaveRequest(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      employeeId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}employee_id'],
      )!,
      leaveTypeId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}leave_type_id'],
      )!,
      fromDate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}from_date'],
      )!,
      toDate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}to_date'],
      )!,
      halfDay: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}half_day'],
      )!,
      days: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}days'],
      ),
      reason: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}reason'],
      ),
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
      syncState: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_state'],
      )!,
      syncError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_error'],
      ),
    );
  }

  @override
  $LeaveRequestsTable createAlias(String alias) {
    return $LeaveRequestsTable(attachedDatabase, alias);
  }
}

class LeaveRequest extends DataClass implements Insertable<LeaveRequest> {
  final String id;
  final String employeeId;
  final String leaveTypeId;
  final String fromDate;
  final String toDate;
  final bool halfDay;
  final String? days;
  final String? reason;
  final String status;
  final String syncState;
  final String? syncError;
  const LeaveRequest({
    required this.id,
    required this.employeeId,
    required this.leaveTypeId,
    required this.fromDate,
    required this.toDate,
    required this.halfDay,
    this.days,
    this.reason,
    required this.status,
    required this.syncState,
    this.syncError,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['leave_type_id'] = Variable<String>(leaveTypeId);
    map['from_date'] = Variable<String>(fromDate);
    map['to_date'] = Variable<String>(toDate);
    map['half_day'] = Variable<bool>(halfDay);
    if (!nullToAbsent || days != null) {
      map['days'] = Variable<String>(days);
    }
    if (!nullToAbsent || reason != null) {
      map['reason'] = Variable<String>(reason);
    }
    map['status'] = Variable<String>(status);
    map['sync_state'] = Variable<String>(syncState);
    if (!nullToAbsent || syncError != null) {
      map['sync_error'] = Variable<String>(syncError);
    }
    return map;
  }

  LeaveRequestsCompanion toCompanion(bool nullToAbsent) {
    return LeaveRequestsCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      leaveTypeId: Value(leaveTypeId),
      fromDate: Value(fromDate),
      toDate: Value(toDate),
      halfDay: Value(halfDay),
      days: days == null && nullToAbsent ? const Value.absent() : Value(days),
      reason: reason == null && nullToAbsent
          ? const Value.absent()
          : Value(reason),
      status: Value(status),
      syncState: Value(syncState),
      syncError: syncError == null && nullToAbsent
          ? const Value.absent()
          : Value(syncError),
    );
  }

  factory LeaveRequest.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LeaveRequest(
      id: serializer.fromJson<String>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      leaveTypeId: serializer.fromJson<String>(json['leaveTypeId']),
      fromDate: serializer.fromJson<String>(json['fromDate']),
      toDate: serializer.fromJson<String>(json['toDate']),
      halfDay: serializer.fromJson<bool>(json['halfDay']),
      days: serializer.fromJson<String?>(json['days']),
      reason: serializer.fromJson<String?>(json['reason']),
      status: serializer.fromJson<String>(json['status']),
      syncState: serializer.fromJson<String>(json['syncState']),
      syncError: serializer.fromJson<String?>(json['syncError']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'leaveTypeId': serializer.toJson<String>(leaveTypeId),
      'fromDate': serializer.toJson<String>(fromDate),
      'toDate': serializer.toJson<String>(toDate),
      'halfDay': serializer.toJson<bool>(halfDay),
      'days': serializer.toJson<String?>(days),
      'reason': serializer.toJson<String?>(reason),
      'status': serializer.toJson<String>(status),
      'syncState': serializer.toJson<String>(syncState),
      'syncError': serializer.toJson<String?>(syncError),
    };
  }

  LeaveRequest copyWith({
    String? id,
    String? employeeId,
    String? leaveTypeId,
    String? fromDate,
    String? toDate,
    bool? halfDay,
    Value<String?> days = const Value.absent(),
    Value<String?> reason = const Value.absent(),
    String? status,
    String? syncState,
    Value<String?> syncError = const Value.absent(),
  }) => LeaveRequest(
    id: id ?? this.id,
    employeeId: employeeId ?? this.employeeId,
    leaveTypeId: leaveTypeId ?? this.leaveTypeId,
    fromDate: fromDate ?? this.fromDate,
    toDate: toDate ?? this.toDate,
    halfDay: halfDay ?? this.halfDay,
    days: days.present ? days.value : this.days,
    reason: reason.present ? reason.value : this.reason,
    status: status ?? this.status,
    syncState: syncState ?? this.syncState,
    syncError: syncError.present ? syncError.value : this.syncError,
  );
  LeaveRequest copyWithCompanion(LeaveRequestsCompanion data) {
    return LeaveRequest(
      id: data.id.present ? data.id.value : this.id,
      employeeId: data.employeeId.present
          ? data.employeeId.value
          : this.employeeId,
      leaveTypeId: data.leaveTypeId.present
          ? data.leaveTypeId.value
          : this.leaveTypeId,
      fromDate: data.fromDate.present ? data.fromDate.value : this.fromDate,
      toDate: data.toDate.present ? data.toDate.value : this.toDate,
      halfDay: data.halfDay.present ? data.halfDay.value : this.halfDay,
      days: data.days.present ? data.days.value : this.days,
      reason: data.reason.present ? data.reason.value : this.reason,
      status: data.status.present ? data.status.value : this.status,
      syncState: data.syncState.present ? data.syncState.value : this.syncState,
      syncError: data.syncError.present ? data.syncError.value : this.syncError,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LeaveRequest(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('leaveTypeId: $leaveTypeId, ')
          ..write('fromDate: $fromDate, ')
          ..write('toDate: $toDate, ')
          ..write('halfDay: $halfDay, ')
          ..write('days: $days, ')
          ..write('reason: $reason, ')
          ..write('status: $status, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    employeeId,
    leaveTypeId,
    fromDate,
    toDate,
    halfDay,
    days,
    reason,
    status,
    syncState,
    syncError,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LeaveRequest &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.leaveTypeId == this.leaveTypeId &&
          other.fromDate == this.fromDate &&
          other.toDate == this.toDate &&
          other.halfDay == this.halfDay &&
          other.days == this.days &&
          other.reason == this.reason &&
          other.status == this.status &&
          other.syncState == this.syncState &&
          other.syncError == this.syncError);
}

class LeaveRequestsCompanion extends UpdateCompanion<LeaveRequest> {
  final Value<String> id;
  final Value<String> employeeId;
  final Value<String> leaveTypeId;
  final Value<String> fromDate;
  final Value<String> toDate;
  final Value<bool> halfDay;
  final Value<String?> days;
  final Value<String?> reason;
  final Value<String> status;
  final Value<String> syncState;
  final Value<String?> syncError;
  final Value<int> rowid;
  const LeaveRequestsCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.leaveTypeId = const Value.absent(),
    this.fromDate = const Value.absent(),
    this.toDate = const Value.absent(),
    this.halfDay = const Value.absent(),
    this.days = const Value.absent(),
    this.reason = const Value.absent(),
    this.status = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  LeaveRequestsCompanion.insert({
    required String id,
    required String employeeId,
    required String leaveTypeId,
    required String fromDate,
    required String toDate,
    this.halfDay = const Value.absent(),
    this.days = const Value.absent(),
    this.reason = const Value.absent(),
    this.status = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       employeeId = Value(employeeId),
       leaveTypeId = Value(leaveTypeId),
       fromDate = Value(fromDate),
       toDate = Value(toDate);
  static Insertable<LeaveRequest> custom({
    Expression<String>? id,
    Expression<String>? employeeId,
    Expression<String>? leaveTypeId,
    Expression<String>? fromDate,
    Expression<String>? toDate,
    Expression<bool>? halfDay,
    Expression<String>? days,
    Expression<String>? reason,
    Expression<String>? status,
    Expression<String>? syncState,
    Expression<String>? syncError,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (leaveTypeId != null) 'leave_type_id': leaveTypeId,
      if (fromDate != null) 'from_date': fromDate,
      if (toDate != null) 'to_date': toDate,
      if (halfDay != null) 'half_day': halfDay,
      if (days != null) 'days': days,
      if (reason != null) 'reason': reason,
      if (status != null) 'status': status,
      if (syncState != null) 'sync_state': syncState,
      if (syncError != null) 'sync_error': syncError,
      if (rowid != null) 'rowid': rowid,
    });
  }

  LeaveRequestsCompanion copyWith({
    Value<String>? id,
    Value<String>? employeeId,
    Value<String>? leaveTypeId,
    Value<String>? fromDate,
    Value<String>? toDate,
    Value<bool>? halfDay,
    Value<String?>? days,
    Value<String?>? reason,
    Value<String>? status,
    Value<String>? syncState,
    Value<String?>? syncError,
    Value<int>? rowid,
  }) {
    return LeaveRequestsCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      leaveTypeId: leaveTypeId ?? this.leaveTypeId,
      fromDate: fromDate ?? this.fromDate,
      toDate: toDate ?? this.toDate,
      halfDay: halfDay ?? this.halfDay,
      days: days ?? this.days,
      reason: reason ?? this.reason,
      status: status ?? this.status,
      syncState: syncState ?? this.syncState,
      syncError: syncError ?? this.syncError,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (leaveTypeId.present) {
      map['leave_type_id'] = Variable<String>(leaveTypeId.value);
    }
    if (fromDate.present) {
      map['from_date'] = Variable<String>(fromDate.value);
    }
    if (toDate.present) {
      map['to_date'] = Variable<String>(toDate.value);
    }
    if (halfDay.present) {
      map['half_day'] = Variable<bool>(halfDay.value);
    }
    if (days.present) {
      map['days'] = Variable<String>(days.value);
    }
    if (reason.present) {
      map['reason'] = Variable<String>(reason.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncState.present) {
      map['sync_state'] = Variable<String>(syncState.value);
    }
    if (syncError.present) {
      map['sync_error'] = Variable<String>(syncError.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LeaveRequestsCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('leaveTypeId: $leaveTypeId, ')
          ..write('fromDate: $fromDate, ')
          ..write('toDate: $toDate, ')
          ..write('halfDay: $halfDay, ')
          ..write('days: $days, ')
          ..write('reason: $reason, ')
          ..write('status: $status, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $AttendanceDaysTable extends AttendanceDays
    with TableInfo<$AttendanceDaysTable, AttendanceDay> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AttendanceDaysTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _employeeIdMeta = const VerificationMeta(
    'employeeId',
  );
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
    'employee_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<String> date = GeneratedColumn<String>(
    'date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
    'status',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _leaveCodeMeta = const VerificationMeta(
    'leaveCode',
  );
  @override
  late final GeneratedColumn<String> leaveCode = GeneratedColumn<String>(
    'leave_code',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _inTimeMeta = const VerificationMeta('inTime');
  @override
  late final GeneratedColumn<String> inTime = GeneratedColumn<String>(
    'in_time',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _outTimeMeta = const VerificationMeta(
    'outTime',
  );
  @override
  late final GeneratedColumn<String> outTime = GeneratedColumn<String>(
    'out_time',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _lateMeta = const VerificationMeta('late');
  @override
  late final GeneratedColumn<bool> late = GeneratedColumn<bool>(
    'late',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("late" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _syncStateMeta = const VerificationMeta(
    'syncState',
  );
  @override
  late final GeneratedColumn<String> syncState = GeneratedColumn<String>(
    'sync_state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('synced'),
  );
  static const VerificationMeta _syncErrorMeta = const VerificationMeta(
    'syncError',
  );
  @override
  late final GeneratedColumn<String> syncError = GeneratedColumn<String>(
    'sync_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    employeeId,
    date,
    status,
    leaveCode,
    inTime,
    outTime,
    late,
    syncState,
    syncError,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'attendance_days';
  @override
  VerificationContext validateIntegrity(
    Insertable<AttendanceDay> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('employee_id')) {
      context.handle(
        _employeeIdMeta,
        employeeId.isAcceptableOrUnknown(data['employee_id']!, _employeeIdMeta),
      );
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
        _dateMeta,
        date.isAcceptableOrUnknown(data['date']!, _dateMeta),
      );
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('status')) {
      context.handle(
        _statusMeta,
        status.isAcceptableOrUnknown(data['status']!, _statusMeta),
      );
    } else if (isInserting) {
      context.missing(_statusMeta);
    }
    if (data.containsKey('leave_code')) {
      context.handle(
        _leaveCodeMeta,
        leaveCode.isAcceptableOrUnknown(data['leave_code']!, _leaveCodeMeta),
      );
    }
    if (data.containsKey('in_time')) {
      context.handle(
        _inTimeMeta,
        inTime.isAcceptableOrUnknown(data['in_time']!, _inTimeMeta),
      );
    }
    if (data.containsKey('out_time')) {
      context.handle(
        _outTimeMeta,
        outTime.isAcceptableOrUnknown(data['out_time']!, _outTimeMeta),
      );
    }
    if (data.containsKey('late')) {
      context.handle(
        _lateMeta,
        late.isAcceptableOrUnknown(data['late']!, _lateMeta),
      );
    }
    if (data.containsKey('sync_state')) {
      context.handle(
        _syncStateMeta,
        syncState.isAcceptableOrUnknown(data['sync_state']!, _syncStateMeta),
      );
    }
    if (data.containsKey('sync_error')) {
      context.handle(
        _syncErrorMeta,
        syncError.isAcceptableOrUnknown(data['sync_error']!, _syncErrorMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {employeeId, date};
  @override
  AttendanceDay map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return AttendanceDay(
      employeeId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}employee_id'],
      )!,
      date: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}date'],
      )!,
      status: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}status'],
      )!,
      leaveCode: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}leave_code'],
      ),
      inTime: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}in_time'],
      ),
      outTime: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}out_time'],
      ),
      late: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}late'],
      )!,
      syncState: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_state'],
      )!,
      syncError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_error'],
      ),
    );
  }

  @override
  $AttendanceDaysTable createAlias(String alias) {
    return $AttendanceDaysTable(attachedDatabase, alias);
  }
}

class AttendanceDay extends DataClass implements Insertable<AttendanceDay> {
  final String employeeId;
  final String date;
  final String status;
  final String? leaveCode;
  final String? inTime;
  final String? outTime;
  final bool late;
  final String syncState;
  final String? syncError;
  const AttendanceDay({
    required this.employeeId,
    required this.date,
    required this.status,
    this.leaveCode,
    this.inTime,
    this.outTime,
    required this.late,
    required this.syncState,
    this.syncError,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['employee_id'] = Variable<String>(employeeId);
    map['date'] = Variable<String>(date);
    map['status'] = Variable<String>(status);
    if (!nullToAbsent || leaveCode != null) {
      map['leave_code'] = Variable<String>(leaveCode);
    }
    if (!nullToAbsent || inTime != null) {
      map['in_time'] = Variable<String>(inTime);
    }
    if (!nullToAbsent || outTime != null) {
      map['out_time'] = Variable<String>(outTime);
    }
    map['late'] = Variable<bool>(late);
    map['sync_state'] = Variable<String>(syncState);
    if (!nullToAbsent || syncError != null) {
      map['sync_error'] = Variable<String>(syncError);
    }
    return map;
  }

  AttendanceDaysCompanion toCompanion(bool nullToAbsent) {
    return AttendanceDaysCompanion(
      employeeId: Value(employeeId),
      date: Value(date),
      status: Value(status),
      leaveCode: leaveCode == null && nullToAbsent
          ? const Value.absent()
          : Value(leaveCode),
      inTime: inTime == null && nullToAbsent
          ? const Value.absent()
          : Value(inTime),
      outTime: outTime == null && nullToAbsent
          ? const Value.absent()
          : Value(outTime),
      late: Value(late),
      syncState: Value(syncState),
      syncError: syncError == null && nullToAbsent
          ? const Value.absent()
          : Value(syncError),
    );
  }

  factory AttendanceDay.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return AttendanceDay(
      employeeId: serializer.fromJson<String>(json['employeeId']),
      date: serializer.fromJson<String>(json['date']),
      status: serializer.fromJson<String>(json['status']),
      leaveCode: serializer.fromJson<String?>(json['leaveCode']),
      inTime: serializer.fromJson<String?>(json['inTime']),
      outTime: serializer.fromJson<String?>(json['outTime']),
      late: serializer.fromJson<bool>(json['late']),
      syncState: serializer.fromJson<String>(json['syncState']),
      syncError: serializer.fromJson<String?>(json['syncError']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'employeeId': serializer.toJson<String>(employeeId),
      'date': serializer.toJson<String>(date),
      'status': serializer.toJson<String>(status),
      'leaveCode': serializer.toJson<String?>(leaveCode),
      'inTime': serializer.toJson<String?>(inTime),
      'outTime': serializer.toJson<String?>(outTime),
      'late': serializer.toJson<bool>(late),
      'syncState': serializer.toJson<String>(syncState),
      'syncError': serializer.toJson<String?>(syncError),
    };
  }

  AttendanceDay copyWith({
    String? employeeId,
    String? date,
    String? status,
    Value<String?> leaveCode = const Value.absent(),
    Value<String?> inTime = const Value.absent(),
    Value<String?> outTime = const Value.absent(),
    bool? late,
    String? syncState,
    Value<String?> syncError = const Value.absent(),
  }) => AttendanceDay(
    employeeId: employeeId ?? this.employeeId,
    date: date ?? this.date,
    status: status ?? this.status,
    leaveCode: leaveCode.present ? leaveCode.value : this.leaveCode,
    inTime: inTime.present ? inTime.value : this.inTime,
    outTime: outTime.present ? outTime.value : this.outTime,
    late: late ?? this.late,
    syncState: syncState ?? this.syncState,
    syncError: syncError.present ? syncError.value : this.syncError,
  );
  AttendanceDay copyWithCompanion(AttendanceDaysCompanion data) {
    return AttendanceDay(
      employeeId: data.employeeId.present
          ? data.employeeId.value
          : this.employeeId,
      date: data.date.present ? data.date.value : this.date,
      status: data.status.present ? data.status.value : this.status,
      leaveCode: data.leaveCode.present ? data.leaveCode.value : this.leaveCode,
      inTime: data.inTime.present ? data.inTime.value : this.inTime,
      outTime: data.outTime.present ? data.outTime.value : this.outTime,
      late: data.late.present ? data.late.value : this.late,
      syncState: data.syncState.present ? data.syncState.value : this.syncState,
      syncError: data.syncError.present ? data.syncError.value : this.syncError,
    );
  }

  @override
  String toString() {
    return (StringBuffer('AttendanceDay(')
          ..write('employeeId: $employeeId, ')
          ..write('date: $date, ')
          ..write('status: $status, ')
          ..write('leaveCode: $leaveCode, ')
          ..write('inTime: $inTime, ')
          ..write('outTime: $outTime, ')
          ..write('late: $late, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    employeeId,
    date,
    status,
    leaveCode,
    inTime,
    outTime,
    late,
    syncState,
    syncError,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is AttendanceDay &&
          other.employeeId == this.employeeId &&
          other.date == this.date &&
          other.status == this.status &&
          other.leaveCode == this.leaveCode &&
          other.inTime == this.inTime &&
          other.outTime == this.outTime &&
          other.late == this.late &&
          other.syncState == this.syncState &&
          other.syncError == this.syncError);
}

class AttendanceDaysCompanion extends UpdateCompanion<AttendanceDay> {
  final Value<String> employeeId;
  final Value<String> date;
  final Value<String> status;
  final Value<String?> leaveCode;
  final Value<String?> inTime;
  final Value<String?> outTime;
  final Value<bool> late;
  final Value<String> syncState;
  final Value<String?> syncError;
  final Value<int> rowid;
  const AttendanceDaysCompanion({
    this.employeeId = const Value.absent(),
    this.date = const Value.absent(),
    this.status = const Value.absent(),
    this.leaveCode = const Value.absent(),
    this.inTime = const Value.absent(),
    this.outTime = const Value.absent(),
    this.late = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AttendanceDaysCompanion.insert({
    required String employeeId,
    required String date,
    required String status,
    this.leaveCode = const Value.absent(),
    this.inTime = const Value.absent(),
    this.outTime = const Value.absent(),
    this.late = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : employeeId = Value(employeeId),
       date = Value(date),
       status = Value(status);
  static Insertable<AttendanceDay> custom({
    Expression<String>? employeeId,
    Expression<String>? date,
    Expression<String>? status,
    Expression<String>? leaveCode,
    Expression<String>? inTime,
    Expression<String>? outTime,
    Expression<bool>? late,
    Expression<String>? syncState,
    Expression<String>? syncError,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (employeeId != null) 'employee_id': employeeId,
      if (date != null) 'date': date,
      if (status != null) 'status': status,
      if (leaveCode != null) 'leave_code': leaveCode,
      if (inTime != null) 'in_time': inTime,
      if (outTime != null) 'out_time': outTime,
      if (late != null) 'late': late,
      if (syncState != null) 'sync_state': syncState,
      if (syncError != null) 'sync_error': syncError,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AttendanceDaysCompanion copyWith({
    Value<String>? employeeId,
    Value<String>? date,
    Value<String>? status,
    Value<String?>? leaveCode,
    Value<String?>? inTime,
    Value<String?>? outTime,
    Value<bool>? late,
    Value<String>? syncState,
    Value<String?>? syncError,
    Value<int>? rowid,
  }) {
    return AttendanceDaysCompanion(
      employeeId: employeeId ?? this.employeeId,
      date: date ?? this.date,
      status: status ?? this.status,
      leaveCode: leaveCode ?? this.leaveCode,
      inTime: inTime ?? this.inTime,
      outTime: outTime ?? this.outTime,
      late: late ?? this.late,
      syncState: syncState ?? this.syncState,
      syncError: syncError ?? this.syncError,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (date.present) {
      map['date'] = Variable<String>(date.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (leaveCode.present) {
      map['leave_code'] = Variable<String>(leaveCode.value);
    }
    if (inTime.present) {
      map['in_time'] = Variable<String>(inTime.value);
    }
    if (outTime.present) {
      map['out_time'] = Variable<String>(outTime.value);
    }
    if (late.present) {
      map['late'] = Variable<bool>(late.value);
    }
    if (syncState.present) {
      map['sync_state'] = Variable<String>(syncState.value);
    }
    if (syncError.present) {
      map['sync_error'] = Variable<String>(syncError.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AttendanceDaysCompanion(')
          ..write('employeeId: $employeeId, ')
          ..write('date: $date, ')
          ..write('status: $status, ')
          ..write('leaveCode: $leaveCode, ')
          ..write('inTime: $inTime, ')
          ..write('outTime: $outTime, ')
          ..write('late: $late, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $PayslipsTable extends Payslips with TableInfo<$PayslipsTable, Payslip> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PayslipsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _runIdMeta = const VerificationMeta('runId');
  @override
  late final GeneratedColumn<String> runId = GeneratedColumn<String>(
    'run_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _periodMeta = const VerificationMeta('period');
  @override
  late final GeneratedColumn<String> period = GeneratedColumn<String>(
    'period',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _employeeIdMeta = const VerificationMeta(
    'employeeId',
  );
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
    'employee_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _paidDaysMeta = const VerificationMeta(
    'paidDays',
  );
  @override
  late final GeneratedColumn<String> paidDays = GeneratedColumn<String>(
    'paid_days',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _grossMeta = const VerificationMeta('gross');
  @override
  late final GeneratedColumn<String> gross = GeneratedColumn<String>(
    'gross',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalDeductionsMeta = const VerificationMeta(
    'totalDeductions',
  );
  @override
  late final GeneratedColumn<String> totalDeductions = GeneratedColumn<String>(
    'total_deductions',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _netPayMeta = const VerificationMeta('netPay');
  @override
  late final GeneratedColumn<String> netPay = GeneratedColumn<String>(
    'net_pay',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _tdsMeta = const VerificationMeta('tds');
  @override
  late final GeneratedColumn<String> tds = GeneratedColumn<String>(
    'tds',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _detailMeta = const VerificationMeta('detail');
  @override
  late final GeneratedColumn<String> detail = GeneratedColumn<String>(
    'detail',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    runId,
    period,
    employeeId,
    paidDays,
    gross,
    totalDeductions,
    netPay,
    tds,
    detail,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'payslips';
  @override
  VerificationContext validateIntegrity(
    Insertable<Payslip> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('run_id')) {
      context.handle(
        _runIdMeta,
        runId.isAcceptableOrUnknown(data['run_id']!, _runIdMeta),
      );
    } else if (isInserting) {
      context.missing(_runIdMeta);
    }
    if (data.containsKey('period')) {
      context.handle(
        _periodMeta,
        period.isAcceptableOrUnknown(data['period']!, _periodMeta),
      );
    } else if (isInserting) {
      context.missing(_periodMeta);
    }
    if (data.containsKey('employee_id')) {
      context.handle(
        _employeeIdMeta,
        employeeId.isAcceptableOrUnknown(data['employee_id']!, _employeeIdMeta),
      );
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('paid_days')) {
      context.handle(
        _paidDaysMeta,
        paidDays.isAcceptableOrUnknown(data['paid_days']!, _paidDaysMeta),
      );
    } else if (isInserting) {
      context.missing(_paidDaysMeta);
    }
    if (data.containsKey('gross')) {
      context.handle(
        _grossMeta,
        gross.isAcceptableOrUnknown(data['gross']!, _grossMeta),
      );
    } else if (isInserting) {
      context.missing(_grossMeta);
    }
    if (data.containsKey('total_deductions')) {
      context.handle(
        _totalDeductionsMeta,
        totalDeductions.isAcceptableOrUnknown(
          data['total_deductions']!,
          _totalDeductionsMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_totalDeductionsMeta);
    }
    if (data.containsKey('net_pay')) {
      context.handle(
        _netPayMeta,
        netPay.isAcceptableOrUnknown(data['net_pay']!, _netPayMeta),
      );
    } else if (isInserting) {
      context.missing(_netPayMeta);
    }
    if (data.containsKey('tds')) {
      context.handle(
        _tdsMeta,
        tds.isAcceptableOrUnknown(data['tds']!, _tdsMeta),
      );
    } else if (isInserting) {
      context.missing(_tdsMeta);
    }
    if (data.containsKey('detail')) {
      context.handle(
        _detailMeta,
        detail.isAcceptableOrUnknown(data['detail']!, _detailMeta),
      );
    } else if (isInserting) {
      context.missing(_detailMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Payslip map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Payslip(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      runId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}run_id'],
      )!,
      period: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}period'],
      )!,
      employeeId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}employee_id'],
      )!,
      paidDays: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}paid_days'],
      )!,
      gross: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}gross'],
      )!,
      totalDeductions: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}total_deductions'],
      )!,
      netPay: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}net_pay'],
      )!,
      tds: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}tds'],
      )!,
      detail: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}detail'],
      )!,
    );
  }

  @override
  $PayslipsTable createAlias(String alias) {
    return $PayslipsTable(attachedDatabase, alias);
  }
}

class Payslip extends DataClass implements Insertable<Payslip> {
  final String id;
  final String runId;
  final String period;
  final String employeeId;
  final String paidDays;
  final String gross;
  final String totalDeductions;
  final String netPay;
  final String tds;
  final String detail;
  const Payslip({
    required this.id,
    required this.runId,
    required this.period,
    required this.employeeId,
    required this.paidDays,
    required this.gross,
    required this.totalDeductions,
    required this.netPay,
    required this.tds,
    required this.detail,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['run_id'] = Variable<String>(runId);
    map['period'] = Variable<String>(period);
    map['employee_id'] = Variable<String>(employeeId);
    map['paid_days'] = Variable<String>(paidDays);
    map['gross'] = Variable<String>(gross);
    map['total_deductions'] = Variable<String>(totalDeductions);
    map['net_pay'] = Variable<String>(netPay);
    map['tds'] = Variable<String>(tds);
    map['detail'] = Variable<String>(detail);
    return map;
  }

  PayslipsCompanion toCompanion(bool nullToAbsent) {
    return PayslipsCompanion(
      id: Value(id),
      runId: Value(runId),
      period: Value(period),
      employeeId: Value(employeeId),
      paidDays: Value(paidDays),
      gross: Value(gross),
      totalDeductions: Value(totalDeductions),
      netPay: Value(netPay),
      tds: Value(tds),
      detail: Value(detail),
    );
  }

  factory Payslip.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Payslip(
      id: serializer.fromJson<String>(json['id']),
      runId: serializer.fromJson<String>(json['runId']),
      period: serializer.fromJson<String>(json['period']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      paidDays: serializer.fromJson<String>(json['paidDays']),
      gross: serializer.fromJson<String>(json['gross']),
      totalDeductions: serializer.fromJson<String>(json['totalDeductions']),
      netPay: serializer.fromJson<String>(json['netPay']),
      tds: serializer.fromJson<String>(json['tds']),
      detail: serializer.fromJson<String>(json['detail']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'runId': serializer.toJson<String>(runId),
      'period': serializer.toJson<String>(period),
      'employeeId': serializer.toJson<String>(employeeId),
      'paidDays': serializer.toJson<String>(paidDays),
      'gross': serializer.toJson<String>(gross),
      'totalDeductions': serializer.toJson<String>(totalDeductions),
      'netPay': serializer.toJson<String>(netPay),
      'tds': serializer.toJson<String>(tds),
      'detail': serializer.toJson<String>(detail),
    };
  }

  Payslip copyWith({
    String? id,
    String? runId,
    String? period,
    String? employeeId,
    String? paidDays,
    String? gross,
    String? totalDeductions,
    String? netPay,
    String? tds,
    String? detail,
  }) => Payslip(
    id: id ?? this.id,
    runId: runId ?? this.runId,
    period: period ?? this.period,
    employeeId: employeeId ?? this.employeeId,
    paidDays: paidDays ?? this.paidDays,
    gross: gross ?? this.gross,
    totalDeductions: totalDeductions ?? this.totalDeductions,
    netPay: netPay ?? this.netPay,
    tds: tds ?? this.tds,
    detail: detail ?? this.detail,
  );
  Payslip copyWithCompanion(PayslipsCompanion data) {
    return Payslip(
      id: data.id.present ? data.id.value : this.id,
      runId: data.runId.present ? data.runId.value : this.runId,
      period: data.period.present ? data.period.value : this.period,
      employeeId: data.employeeId.present
          ? data.employeeId.value
          : this.employeeId,
      paidDays: data.paidDays.present ? data.paidDays.value : this.paidDays,
      gross: data.gross.present ? data.gross.value : this.gross,
      totalDeductions: data.totalDeductions.present
          ? data.totalDeductions.value
          : this.totalDeductions,
      netPay: data.netPay.present ? data.netPay.value : this.netPay,
      tds: data.tds.present ? data.tds.value : this.tds,
      detail: data.detail.present ? data.detail.value : this.detail,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Payslip(')
          ..write('id: $id, ')
          ..write('runId: $runId, ')
          ..write('period: $period, ')
          ..write('employeeId: $employeeId, ')
          ..write('paidDays: $paidDays, ')
          ..write('gross: $gross, ')
          ..write('totalDeductions: $totalDeductions, ')
          ..write('netPay: $netPay, ')
          ..write('tds: $tds, ')
          ..write('detail: $detail')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    runId,
    period,
    employeeId,
    paidDays,
    gross,
    totalDeductions,
    netPay,
    tds,
    detail,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Payslip &&
          other.id == this.id &&
          other.runId == this.runId &&
          other.period == this.period &&
          other.employeeId == this.employeeId &&
          other.paidDays == this.paidDays &&
          other.gross == this.gross &&
          other.totalDeductions == this.totalDeductions &&
          other.netPay == this.netPay &&
          other.tds == this.tds &&
          other.detail == this.detail);
}

class PayslipsCompanion extends UpdateCompanion<Payslip> {
  final Value<String> id;
  final Value<String> runId;
  final Value<String> period;
  final Value<String> employeeId;
  final Value<String> paidDays;
  final Value<String> gross;
  final Value<String> totalDeductions;
  final Value<String> netPay;
  final Value<String> tds;
  final Value<String> detail;
  final Value<int> rowid;
  const PayslipsCompanion({
    this.id = const Value.absent(),
    this.runId = const Value.absent(),
    this.period = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.paidDays = const Value.absent(),
    this.gross = const Value.absent(),
    this.totalDeductions = const Value.absent(),
    this.netPay = const Value.absent(),
    this.tds = const Value.absent(),
    this.detail = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PayslipsCompanion.insert({
    required String id,
    required String runId,
    required String period,
    required String employeeId,
    required String paidDays,
    required String gross,
    required String totalDeductions,
    required String netPay,
    required String tds,
    required String detail,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       runId = Value(runId),
       period = Value(period),
       employeeId = Value(employeeId),
       paidDays = Value(paidDays),
       gross = Value(gross),
       totalDeductions = Value(totalDeductions),
       netPay = Value(netPay),
       tds = Value(tds),
       detail = Value(detail);
  static Insertable<Payslip> custom({
    Expression<String>? id,
    Expression<String>? runId,
    Expression<String>? period,
    Expression<String>? employeeId,
    Expression<String>? paidDays,
    Expression<String>? gross,
    Expression<String>? totalDeductions,
    Expression<String>? netPay,
    Expression<String>? tds,
    Expression<String>? detail,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (runId != null) 'run_id': runId,
      if (period != null) 'period': period,
      if (employeeId != null) 'employee_id': employeeId,
      if (paidDays != null) 'paid_days': paidDays,
      if (gross != null) 'gross': gross,
      if (totalDeductions != null) 'total_deductions': totalDeductions,
      if (netPay != null) 'net_pay': netPay,
      if (tds != null) 'tds': tds,
      if (detail != null) 'detail': detail,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PayslipsCompanion copyWith({
    Value<String>? id,
    Value<String>? runId,
    Value<String>? period,
    Value<String>? employeeId,
    Value<String>? paidDays,
    Value<String>? gross,
    Value<String>? totalDeductions,
    Value<String>? netPay,
    Value<String>? tds,
    Value<String>? detail,
    Value<int>? rowid,
  }) {
    return PayslipsCompanion(
      id: id ?? this.id,
      runId: runId ?? this.runId,
      period: period ?? this.period,
      employeeId: employeeId ?? this.employeeId,
      paidDays: paidDays ?? this.paidDays,
      gross: gross ?? this.gross,
      totalDeductions: totalDeductions ?? this.totalDeductions,
      netPay: netPay ?? this.netPay,
      tds: tds ?? this.tds,
      detail: detail ?? this.detail,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (runId.present) {
      map['run_id'] = Variable<String>(runId.value);
    }
    if (period.present) {
      map['period'] = Variable<String>(period.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (paidDays.present) {
      map['paid_days'] = Variable<String>(paidDays.value);
    }
    if (gross.present) {
      map['gross'] = Variable<String>(gross.value);
    }
    if (totalDeductions.present) {
      map['total_deductions'] = Variable<String>(totalDeductions.value);
    }
    if (netPay.present) {
      map['net_pay'] = Variable<String>(netPay.value);
    }
    if (tds.present) {
      map['tds'] = Variable<String>(tds.value);
    }
    if (detail.present) {
      map['detail'] = Variable<String>(detail.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PayslipsCompanion(')
          ..write('id: $id, ')
          ..write('runId: $runId, ')
          ..write('period: $period, ')
          ..write('employeeId: $employeeId, ')
          ..write('paidDays: $paidDays, ')
          ..write('gross: $gross, ')
          ..write('totalDeductions: $totalDeductions, ')
          ..write('netPay: $netPay, ')
          ..write('tds: $tds, ')
          ..write('detail: $detail, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $PosItemsTable extends PosItems with TableInfo<$PosItemsTable, PosItem> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PosItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameHiMeta = const VerificationMeta('nameHi');
  @override
  late final GeneratedColumn<String> nameHi = GeneratedColumn<String>(
    'name_hi',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _skuMeta = const VerificationMeta('sku');
  @override
  late final GeneratedColumn<String> sku = GeneratedColumn<String>(
    'sku',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _barcodeMeta = const VerificationMeta(
    'barcode',
  );
  @override
  late final GeneratedColumn<String> barcode = GeneratedColumn<String>(
    'barcode',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _kindMeta = const VerificationMeta('kind');
  @override
  late final GeneratedColumn<String> kind = GeneratedColumn<String>(
    'kind',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _hsnMeta = const VerificationMeta('hsn');
  @override
  late final GeneratedColumn<String> hsn = GeneratedColumn<String>(
    'hsn',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _gstRateMeta = const VerificationMeta(
    'gstRate',
  );
  @override
  late final GeneratedColumn<String> gstRate = GeneratedColumn<String>(
    'gst_rate',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _gstSlabMeta = const VerificationMeta(
    'gstSlab',
  );
  @override
  late final GeneratedColumn<String> gstSlab = GeneratedColumn<String>(
    'gst_slab',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _slabPiecesMeta = const VerificationMeta(
    'slabPieces',
  );
  @override
  late final GeneratedColumn<int> slabPieces = GeneratedColumn<int>(
    'slab_pieces',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(1),
  );
  static const VerificationMeta _cessRateMeta = const VerificationMeta(
    'cessRate',
  );
  @override
  late final GeneratedColumn<String> cessRate = GeneratedColumn<String>(
    'cess_rate',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('0'),
  );
  static const VerificationMeta _saleRateMeta = const VerificationMeta(
    'saleRate',
  );
  @override
  late final GeneratedColumn<String> saleRate = GeneratedColumn<String>(
    'sale_rate',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _uomMeta = const VerificationMeta('uom');
  @override
  late final GeneratedColumn<String> uom = GeneratedColumn<String>(
    'uom',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _archivedMeta = const VerificationMeta(
    'archived',
  );
  @override
  late final GeneratedColumn<bool> archived = GeneratedColumn<bool>(
    'archived',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("archived" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    nameHi,
    sku,
    barcode,
    kind,
    hsn,
    gstRate,
    gstSlab,
    slabPieces,
    cessRate,
    saleRate,
    uom,
    archived,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'pos_items';
  @override
  VerificationContext validateIntegrity(
    Insertable<PosItem> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('name_hi')) {
      context.handle(
        _nameHiMeta,
        nameHi.isAcceptableOrUnknown(data['name_hi']!, _nameHiMeta),
      );
    }
    if (data.containsKey('sku')) {
      context.handle(
        _skuMeta,
        sku.isAcceptableOrUnknown(data['sku']!, _skuMeta),
      );
    }
    if (data.containsKey('barcode')) {
      context.handle(
        _barcodeMeta,
        barcode.isAcceptableOrUnknown(data['barcode']!, _barcodeMeta),
      );
    }
    if (data.containsKey('kind')) {
      context.handle(
        _kindMeta,
        kind.isAcceptableOrUnknown(data['kind']!, _kindMeta),
      );
    } else if (isInserting) {
      context.missing(_kindMeta);
    }
    if (data.containsKey('hsn')) {
      context.handle(
        _hsnMeta,
        hsn.isAcceptableOrUnknown(data['hsn']!, _hsnMeta),
      );
    }
    if (data.containsKey('gst_rate')) {
      context.handle(
        _gstRateMeta,
        gstRate.isAcceptableOrUnknown(data['gst_rate']!, _gstRateMeta),
      );
    } else if (isInserting) {
      context.missing(_gstRateMeta);
    }
    if (data.containsKey('gst_slab')) {
      context.handle(
        _gstSlabMeta,
        gstSlab.isAcceptableOrUnknown(data['gst_slab']!, _gstSlabMeta),
      );
    }
    if (data.containsKey('slab_pieces')) {
      context.handle(
        _slabPiecesMeta,
        slabPieces.isAcceptableOrUnknown(data['slab_pieces']!, _slabPiecesMeta),
      );
    }
    if (data.containsKey('cess_rate')) {
      context.handle(
        _cessRateMeta,
        cessRate.isAcceptableOrUnknown(data['cess_rate']!, _cessRateMeta),
      );
    }
    if (data.containsKey('sale_rate')) {
      context.handle(
        _saleRateMeta,
        saleRate.isAcceptableOrUnknown(data['sale_rate']!, _saleRateMeta),
      );
    } else if (isInserting) {
      context.missing(_saleRateMeta);
    }
    if (data.containsKey('uom')) {
      context.handle(
        _uomMeta,
        uom.isAcceptableOrUnknown(data['uom']!, _uomMeta),
      );
    } else if (isInserting) {
      context.missing(_uomMeta);
    }
    if (data.containsKey('archived')) {
      context.handle(
        _archivedMeta,
        archived.isAcceptableOrUnknown(data['archived']!, _archivedMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PosItem map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PosItem(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      nameHi: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name_hi'],
      ),
      sku: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sku'],
      ),
      barcode: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}barcode'],
      ),
      kind: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}kind'],
      )!,
      hsn: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}hsn'],
      ),
      gstRate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}gst_rate'],
      )!,
      gstSlab: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}gst_slab'],
      ),
      slabPieces: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}slab_pieces'],
      )!,
      cessRate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}cess_rate'],
      )!,
      saleRate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sale_rate'],
      )!,
      uom: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}uom'],
      )!,
      archived: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}archived'],
      )!,
    );
  }

  @override
  $PosItemsTable createAlias(String alias) {
    return $PosItemsTable(attachedDatabase, alias);
  }
}

class PosItem extends DataClass implements Insertable<PosItem> {
  final String id;
  final String name;
  final String? nameHi;
  final String? sku;
  final String? barcode;
  final String kind;
  final String? hsn;
  final String gstRate;

  /// GST by price per piece (apparel, footwear); gstRate is then only the fallback.
  final String? gstSlab;
  final int slabPieces;
  final String cessRate;
  final String saleRate;
  final String uom;
  final bool archived;
  const PosItem({
    required this.id,
    required this.name,
    this.nameHi,
    this.sku,
    this.barcode,
    required this.kind,
    this.hsn,
    required this.gstRate,
    this.gstSlab,
    required this.slabPieces,
    required this.cessRate,
    required this.saleRate,
    required this.uom,
    required this.archived,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || nameHi != null) {
      map['name_hi'] = Variable<String>(nameHi);
    }
    if (!nullToAbsent || sku != null) {
      map['sku'] = Variable<String>(sku);
    }
    if (!nullToAbsent || barcode != null) {
      map['barcode'] = Variable<String>(barcode);
    }
    map['kind'] = Variable<String>(kind);
    if (!nullToAbsent || hsn != null) {
      map['hsn'] = Variable<String>(hsn);
    }
    map['gst_rate'] = Variable<String>(gstRate);
    if (!nullToAbsent || gstSlab != null) {
      map['gst_slab'] = Variable<String>(gstSlab);
    }
    map['slab_pieces'] = Variable<int>(slabPieces);
    map['cess_rate'] = Variable<String>(cessRate);
    map['sale_rate'] = Variable<String>(saleRate);
    map['uom'] = Variable<String>(uom);
    map['archived'] = Variable<bool>(archived);
    return map;
  }

  PosItemsCompanion toCompanion(bool nullToAbsent) {
    return PosItemsCompanion(
      id: Value(id),
      name: Value(name),
      nameHi: nameHi == null && nullToAbsent
          ? const Value.absent()
          : Value(nameHi),
      sku: sku == null && nullToAbsent ? const Value.absent() : Value(sku),
      barcode: barcode == null && nullToAbsent
          ? const Value.absent()
          : Value(barcode),
      kind: Value(kind),
      hsn: hsn == null && nullToAbsent ? const Value.absent() : Value(hsn),
      gstRate: Value(gstRate),
      gstSlab: gstSlab == null && nullToAbsent
          ? const Value.absent()
          : Value(gstSlab),
      slabPieces: Value(slabPieces),
      cessRate: Value(cessRate),
      saleRate: Value(saleRate),
      uom: Value(uom),
      archived: Value(archived),
    );
  }

  factory PosItem.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PosItem(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      nameHi: serializer.fromJson<String?>(json['nameHi']),
      sku: serializer.fromJson<String?>(json['sku']),
      barcode: serializer.fromJson<String?>(json['barcode']),
      kind: serializer.fromJson<String>(json['kind']),
      hsn: serializer.fromJson<String?>(json['hsn']),
      gstRate: serializer.fromJson<String>(json['gstRate']),
      gstSlab: serializer.fromJson<String?>(json['gstSlab']),
      slabPieces: serializer.fromJson<int>(json['slabPieces']),
      cessRate: serializer.fromJson<String>(json['cessRate']),
      saleRate: serializer.fromJson<String>(json['saleRate']),
      uom: serializer.fromJson<String>(json['uom']),
      archived: serializer.fromJson<bool>(json['archived']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'nameHi': serializer.toJson<String?>(nameHi),
      'sku': serializer.toJson<String?>(sku),
      'barcode': serializer.toJson<String?>(barcode),
      'kind': serializer.toJson<String>(kind),
      'hsn': serializer.toJson<String?>(hsn),
      'gstRate': serializer.toJson<String>(gstRate),
      'gstSlab': serializer.toJson<String?>(gstSlab),
      'slabPieces': serializer.toJson<int>(slabPieces),
      'cessRate': serializer.toJson<String>(cessRate),
      'saleRate': serializer.toJson<String>(saleRate),
      'uom': serializer.toJson<String>(uom),
      'archived': serializer.toJson<bool>(archived),
    };
  }

  PosItem copyWith({
    String? id,
    String? name,
    Value<String?> nameHi = const Value.absent(),
    Value<String?> sku = const Value.absent(),
    Value<String?> barcode = const Value.absent(),
    String? kind,
    Value<String?> hsn = const Value.absent(),
    String? gstRate,
    Value<String?> gstSlab = const Value.absent(),
    int? slabPieces,
    String? cessRate,
    String? saleRate,
    String? uom,
    bool? archived,
  }) => PosItem(
    id: id ?? this.id,
    name: name ?? this.name,
    nameHi: nameHi.present ? nameHi.value : this.nameHi,
    sku: sku.present ? sku.value : this.sku,
    barcode: barcode.present ? barcode.value : this.barcode,
    kind: kind ?? this.kind,
    hsn: hsn.present ? hsn.value : this.hsn,
    gstRate: gstRate ?? this.gstRate,
    gstSlab: gstSlab.present ? gstSlab.value : this.gstSlab,
    slabPieces: slabPieces ?? this.slabPieces,
    cessRate: cessRate ?? this.cessRate,
    saleRate: saleRate ?? this.saleRate,
    uom: uom ?? this.uom,
    archived: archived ?? this.archived,
  );
  PosItem copyWithCompanion(PosItemsCompanion data) {
    return PosItem(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      nameHi: data.nameHi.present ? data.nameHi.value : this.nameHi,
      sku: data.sku.present ? data.sku.value : this.sku,
      barcode: data.barcode.present ? data.barcode.value : this.barcode,
      kind: data.kind.present ? data.kind.value : this.kind,
      hsn: data.hsn.present ? data.hsn.value : this.hsn,
      gstRate: data.gstRate.present ? data.gstRate.value : this.gstRate,
      gstSlab: data.gstSlab.present ? data.gstSlab.value : this.gstSlab,
      slabPieces: data.slabPieces.present
          ? data.slabPieces.value
          : this.slabPieces,
      cessRate: data.cessRate.present ? data.cessRate.value : this.cessRate,
      saleRate: data.saleRate.present ? data.saleRate.value : this.saleRate,
      uom: data.uom.present ? data.uom.value : this.uom,
      archived: data.archived.present ? data.archived.value : this.archived,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PosItem(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('sku: $sku, ')
          ..write('barcode: $barcode, ')
          ..write('kind: $kind, ')
          ..write('hsn: $hsn, ')
          ..write('gstRate: $gstRate, ')
          ..write('gstSlab: $gstSlab, ')
          ..write('slabPieces: $slabPieces, ')
          ..write('cessRate: $cessRate, ')
          ..write('saleRate: $saleRate, ')
          ..write('uom: $uom, ')
          ..write('archived: $archived')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    name,
    nameHi,
    sku,
    barcode,
    kind,
    hsn,
    gstRate,
    gstSlab,
    slabPieces,
    cessRate,
    saleRate,
    uom,
    archived,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PosItem &&
          other.id == this.id &&
          other.name == this.name &&
          other.nameHi == this.nameHi &&
          other.sku == this.sku &&
          other.barcode == this.barcode &&
          other.kind == this.kind &&
          other.hsn == this.hsn &&
          other.gstRate == this.gstRate &&
          other.gstSlab == this.gstSlab &&
          other.slabPieces == this.slabPieces &&
          other.cessRate == this.cessRate &&
          other.saleRate == this.saleRate &&
          other.uom == this.uom &&
          other.archived == this.archived);
}

class PosItemsCompanion extends UpdateCompanion<PosItem> {
  final Value<String> id;
  final Value<String> name;
  final Value<String?> nameHi;
  final Value<String?> sku;
  final Value<String?> barcode;
  final Value<String> kind;
  final Value<String?> hsn;
  final Value<String> gstRate;
  final Value<String?> gstSlab;
  final Value<int> slabPieces;
  final Value<String> cessRate;
  final Value<String> saleRate;
  final Value<String> uom;
  final Value<bool> archived;
  final Value<int> rowid;
  const PosItemsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.nameHi = const Value.absent(),
    this.sku = const Value.absent(),
    this.barcode = const Value.absent(),
    this.kind = const Value.absent(),
    this.hsn = const Value.absent(),
    this.gstRate = const Value.absent(),
    this.gstSlab = const Value.absent(),
    this.slabPieces = const Value.absent(),
    this.cessRate = const Value.absent(),
    this.saleRate = const Value.absent(),
    this.uom = const Value.absent(),
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PosItemsCompanion.insert({
    required String id,
    required String name,
    this.nameHi = const Value.absent(),
    this.sku = const Value.absent(),
    this.barcode = const Value.absent(),
    required String kind,
    this.hsn = const Value.absent(),
    required String gstRate,
    this.gstSlab = const Value.absent(),
    this.slabPieces = const Value.absent(),
    this.cessRate = const Value.absent(),
    required String saleRate,
    required String uom,
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name),
       kind = Value(kind),
       gstRate = Value(gstRate),
       saleRate = Value(saleRate),
       uom = Value(uom);
  static Insertable<PosItem> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? nameHi,
    Expression<String>? sku,
    Expression<String>? barcode,
    Expression<String>? kind,
    Expression<String>? hsn,
    Expression<String>? gstRate,
    Expression<String>? gstSlab,
    Expression<int>? slabPieces,
    Expression<String>? cessRate,
    Expression<String>? saleRate,
    Expression<String>? uom,
    Expression<bool>? archived,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (nameHi != null) 'name_hi': nameHi,
      if (sku != null) 'sku': sku,
      if (barcode != null) 'barcode': barcode,
      if (kind != null) 'kind': kind,
      if (hsn != null) 'hsn': hsn,
      if (gstRate != null) 'gst_rate': gstRate,
      if (gstSlab != null) 'gst_slab': gstSlab,
      if (slabPieces != null) 'slab_pieces': slabPieces,
      if (cessRate != null) 'cess_rate': cessRate,
      if (saleRate != null) 'sale_rate': saleRate,
      if (uom != null) 'uom': uom,
      if (archived != null) 'archived': archived,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PosItemsCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<String?>? nameHi,
    Value<String?>? sku,
    Value<String?>? barcode,
    Value<String>? kind,
    Value<String?>? hsn,
    Value<String>? gstRate,
    Value<String?>? gstSlab,
    Value<int>? slabPieces,
    Value<String>? cessRate,
    Value<String>? saleRate,
    Value<String>? uom,
    Value<bool>? archived,
    Value<int>? rowid,
  }) {
    return PosItemsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      nameHi: nameHi ?? this.nameHi,
      sku: sku ?? this.sku,
      barcode: barcode ?? this.barcode,
      kind: kind ?? this.kind,
      hsn: hsn ?? this.hsn,
      gstRate: gstRate ?? this.gstRate,
      gstSlab: gstSlab ?? this.gstSlab,
      slabPieces: slabPieces ?? this.slabPieces,
      cessRate: cessRate ?? this.cessRate,
      saleRate: saleRate ?? this.saleRate,
      uom: uom ?? this.uom,
      archived: archived ?? this.archived,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (nameHi.present) {
      map['name_hi'] = Variable<String>(nameHi.value);
    }
    if (sku.present) {
      map['sku'] = Variable<String>(sku.value);
    }
    if (barcode.present) {
      map['barcode'] = Variable<String>(barcode.value);
    }
    if (kind.present) {
      map['kind'] = Variable<String>(kind.value);
    }
    if (hsn.present) {
      map['hsn'] = Variable<String>(hsn.value);
    }
    if (gstRate.present) {
      map['gst_rate'] = Variable<String>(gstRate.value);
    }
    if (gstSlab.present) {
      map['gst_slab'] = Variable<String>(gstSlab.value);
    }
    if (slabPieces.present) {
      map['slab_pieces'] = Variable<int>(slabPieces.value);
    }
    if (cessRate.present) {
      map['cess_rate'] = Variable<String>(cessRate.value);
    }
    if (saleRate.present) {
      map['sale_rate'] = Variable<String>(saleRate.value);
    }
    if (uom.present) {
      map['uom'] = Variable<String>(uom.value);
    }
    if (archived.present) {
      map['archived'] = Variable<bool>(archived.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PosItemsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('sku: $sku, ')
          ..write('barcode: $barcode, ')
          ..write('kind: $kind, ')
          ..write('hsn: $hsn, ')
          ..write('gstRate: $gstRate, ')
          ..write('gstSlab: $gstSlab, ')
          ..write('slabPieces: $slabPieces, ')
          ..write('cessRate: $cessRate, ')
          ..write('saleRate: $saleRate, ')
          ..write('uom: $uom, ')
          ..write('archived: $archived, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $PosTerminalsTable extends PosTerminals
    with TableInfo<$PosTerminalsTable, PosTerminal> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PosTerminalsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _codeMeta = const VerificationMeta('code');
  @override
  late final GeneratedColumn<String> code = GeneratedColumn<String>(
    'code',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _archivedMeta = const VerificationMeta(
    'archived',
  );
  @override
  late final GeneratedColumn<bool> archived = GeneratedColumn<bool>(
    'archived',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("archived" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [id, code, name, archived];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'pos_terminals';
  @override
  VerificationContext validateIntegrity(
    Insertable<PosTerminal> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('code')) {
      context.handle(
        _codeMeta,
        code.isAcceptableOrUnknown(data['code']!, _codeMeta),
      );
    } else if (isInserting) {
      context.missing(_codeMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('archived')) {
      context.handle(
        _archivedMeta,
        archived.isAcceptableOrUnknown(data['archived']!, _archivedMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PosTerminal map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PosTerminal(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      code: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}code'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      archived: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}archived'],
      )!,
    );
  }

  @override
  $PosTerminalsTable createAlias(String alias) {
    return $PosTerminalsTable(attachedDatabase, alias);
  }
}

class PosTerminal extends DataClass implements Insertable<PosTerminal> {
  final String id;
  final String code;
  final String name;
  final bool archived;
  const PosTerminal({
    required this.id,
    required this.code,
    required this.name,
    required this.archived,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['code'] = Variable<String>(code);
    map['name'] = Variable<String>(name);
    map['archived'] = Variable<bool>(archived);
    return map;
  }

  PosTerminalsCompanion toCompanion(bool nullToAbsent) {
    return PosTerminalsCompanion(
      id: Value(id),
      code: Value(code),
      name: Value(name),
      archived: Value(archived),
    );
  }

  factory PosTerminal.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PosTerminal(
      id: serializer.fromJson<String>(json['id']),
      code: serializer.fromJson<String>(json['code']),
      name: serializer.fromJson<String>(json['name']),
      archived: serializer.fromJson<bool>(json['archived']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'code': serializer.toJson<String>(code),
      'name': serializer.toJson<String>(name),
      'archived': serializer.toJson<bool>(archived),
    };
  }

  PosTerminal copyWith({
    String? id,
    String? code,
    String? name,
    bool? archived,
  }) => PosTerminal(
    id: id ?? this.id,
    code: code ?? this.code,
    name: name ?? this.name,
    archived: archived ?? this.archived,
  );
  PosTerminal copyWithCompanion(PosTerminalsCompanion data) {
    return PosTerminal(
      id: data.id.present ? data.id.value : this.id,
      code: data.code.present ? data.code.value : this.code,
      name: data.name.present ? data.name.value : this.name,
      archived: data.archived.present ? data.archived.value : this.archived,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PosTerminal(')
          ..write('id: $id, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('archived: $archived')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, code, name, archived);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PosTerminal &&
          other.id == this.id &&
          other.code == this.code &&
          other.name == this.name &&
          other.archived == this.archived);
}

class PosTerminalsCompanion extends UpdateCompanion<PosTerminal> {
  final Value<String> id;
  final Value<String> code;
  final Value<String> name;
  final Value<bool> archived;
  final Value<int> rowid;
  const PosTerminalsCompanion({
    this.id = const Value.absent(),
    this.code = const Value.absent(),
    this.name = const Value.absent(),
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PosTerminalsCompanion.insert({
    required String id,
    required String code,
    required String name,
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       code = Value(code),
       name = Value(name);
  static Insertable<PosTerminal> custom({
    Expression<String>? id,
    Expression<String>? code,
    Expression<String>? name,
    Expression<bool>? archived,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (code != null) 'code': code,
      if (name != null) 'name': name,
      if (archived != null) 'archived': archived,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PosTerminalsCompanion copyWith({
    Value<String>? id,
    Value<String>? code,
    Value<String>? name,
    Value<bool>? archived,
    Value<int>? rowid,
  }) {
    return PosTerminalsCompanion(
      id: id ?? this.id,
      code: code ?? this.code,
      name: name ?? this.name,
      archived: archived ?? this.archived,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (code.present) {
      map['code'] = Variable<String>(code.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (archived.present) {
      map['archived'] = Variable<bool>(archived.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PosTerminalsCompanion(')
          ..write('id: $id, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('archived: $archived, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $PosBillsTable extends PosBills with TableInfo<$PosBillsTable, PosBill> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PosBillsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _terminalIdMeta = const VerificationMeta(
    'terminalId',
  );
  @override
  late final GeneratedColumn<String> terminalId = GeneratedColumn<String>(
    'terminal_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _numberMeta = const VerificationMeta('number');
  @override
  late final GeneratedColumn<String> number = GeneratedColumn<String>(
    'number',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<String> date = GeneratedColumn<String>(
    'date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<String> createdAt = GeneratedColumn<String>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _customerPhoneMeta = const VerificationMeta(
    'customerPhone',
  );
  @override
  late final GeneratedColumn<String> customerPhone = GeneratedColumn<String>(
    'customer_phone',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _customerNameMeta = const VerificationMeta(
    'customerName',
  );
  @override
  late final GeneratedColumn<String> customerName = GeneratedColumn<String>(
    'customer_name',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _detailMeta = const VerificationMeta('detail');
  @override
  late final GeneratedColumn<String> detail = GeneratedColumn<String>(
    'detail',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalMeta = const VerificationMeta('total');
  @override
  late final GeneratedColumn<String> total = GeneratedColumn<String>(
    'total',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _changeMeta = const VerificationMeta('change');
  @override
  late final GeneratedColumn<String> change = GeneratedColumn<String>(
    'change',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('0.00'),
  );
  static const VerificationMeta _serverTotalMeta = const VerificationMeta(
    'serverTotal',
  );
  @override
  late final GeneratedColumn<String> serverTotal = GeneratedColumn<String>(
    'server_total',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _syncStateMeta = const VerificationMeta(
    'syncState',
  );
  @override
  late final GeneratedColumn<String> syncState = GeneratedColumn<String>(
    'sync_state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  static const VerificationMeta _syncErrorMeta = const VerificationMeta(
    'syncError',
  );
  @override
  late final GeneratedColumn<String> syncError = GeneratedColumn<String>(
    'sync_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    terminalId,
    number,
    date,
    createdAt,
    customerPhone,
    customerName,
    detail,
    total,
    change,
    serverTotal,
    syncState,
    syncError,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'pos_bills';
  @override
  VerificationContext validateIntegrity(
    Insertable<PosBill> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('terminal_id')) {
      context.handle(
        _terminalIdMeta,
        terminalId.isAcceptableOrUnknown(data['terminal_id']!, _terminalIdMeta),
      );
    } else if (isInserting) {
      context.missing(_terminalIdMeta);
    }
    if (data.containsKey('number')) {
      context.handle(
        _numberMeta,
        number.isAcceptableOrUnknown(data['number']!, _numberMeta),
      );
    } else if (isInserting) {
      context.missing(_numberMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
        _dateMeta,
        date.isAcceptableOrUnknown(data['date']!, _dateMeta),
      );
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('customer_phone')) {
      context.handle(
        _customerPhoneMeta,
        customerPhone.isAcceptableOrUnknown(
          data['customer_phone']!,
          _customerPhoneMeta,
        ),
      );
    }
    if (data.containsKey('customer_name')) {
      context.handle(
        _customerNameMeta,
        customerName.isAcceptableOrUnknown(
          data['customer_name']!,
          _customerNameMeta,
        ),
      );
    }
    if (data.containsKey('detail')) {
      context.handle(
        _detailMeta,
        detail.isAcceptableOrUnknown(data['detail']!, _detailMeta),
      );
    } else if (isInserting) {
      context.missing(_detailMeta);
    }
    if (data.containsKey('total')) {
      context.handle(
        _totalMeta,
        total.isAcceptableOrUnknown(data['total']!, _totalMeta),
      );
    } else if (isInserting) {
      context.missing(_totalMeta);
    }
    if (data.containsKey('change')) {
      context.handle(
        _changeMeta,
        change.isAcceptableOrUnknown(data['change']!, _changeMeta),
      );
    }
    if (data.containsKey('server_total')) {
      context.handle(
        _serverTotalMeta,
        serverTotal.isAcceptableOrUnknown(
          data['server_total']!,
          _serverTotalMeta,
        ),
      );
    }
    if (data.containsKey('sync_state')) {
      context.handle(
        _syncStateMeta,
        syncState.isAcceptableOrUnknown(data['sync_state']!, _syncStateMeta),
      );
    }
    if (data.containsKey('sync_error')) {
      context.handle(
        _syncErrorMeta,
        syncError.isAcceptableOrUnknown(data['sync_error']!, _syncErrorMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PosBill map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PosBill(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      terminalId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}terminal_id'],
      )!,
      number: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}number'],
      )!,
      date: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}date'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}created_at'],
      )!,
      customerPhone: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}customer_phone'],
      ),
      customerName: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}customer_name'],
      ),
      detail: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}detail'],
      )!,
      total: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}total'],
      )!,
      change: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}change'],
      )!,
      serverTotal: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}server_total'],
      ),
      syncState: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_state'],
      )!,
      syncError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_error'],
      ),
    );
  }

  @override
  $PosBillsTable createAlias(String alias) {
    return $PosBillsTable(attachedDatabase, alias);
  }
}

class PosBill extends DataClass implements Insertable<PosBill> {
  final String id;
  final String terminalId;
  final String number;
  final String date;
  final String createdAt;
  final String? customerPhone;
  final String? customerName;
  final String detail;
  final String total;
  final String change;
  final String? serverTotal;
  final String syncState;
  final String? syncError;
  const PosBill({
    required this.id,
    required this.terminalId,
    required this.number,
    required this.date,
    required this.createdAt,
    this.customerPhone,
    this.customerName,
    required this.detail,
    required this.total,
    required this.change,
    this.serverTotal,
    required this.syncState,
    this.syncError,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['terminal_id'] = Variable<String>(terminalId);
    map['number'] = Variable<String>(number);
    map['date'] = Variable<String>(date);
    map['created_at'] = Variable<String>(createdAt);
    if (!nullToAbsent || customerPhone != null) {
      map['customer_phone'] = Variable<String>(customerPhone);
    }
    if (!nullToAbsent || customerName != null) {
      map['customer_name'] = Variable<String>(customerName);
    }
    map['detail'] = Variable<String>(detail);
    map['total'] = Variable<String>(total);
    map['change'] = Variable<String>(change);
    if (!nullToAbsent || serverTotal != null) {
      map['server_total'] = Variable<String>(serverTotal);
    }
    map['sync_state'] = Variable<String>(syncState);
    if (!nullToAbsent || syncError != null) {
      map['sync_error'] = Variable<String>(syncError);
    }
    return map;
  }

  PosBillsCompanion toCompanion(bool nullToAbsent) {
    return PosBillsCompanion(
      id: Value(id),
      terminalId: Value(terminalId),
      number: Value(number),
      date: Value(date),
      createdAt: Value(createdAt),
      customerPhone: customerPhone == null && nullToAbsent
          ? const Value.absent()
          : Value(customerPhone),
      customerName: customerName == null && nullToAbsent
          ? const Value.absent()
          : Value(customerName),
      detail: Value(detail),
      total: Value(total),
      change: Value(change),
      serverTotal: serverTotal == null && nullToAbsent
          ? const Value.absent()
          : Value(serverTotal),
      syncState: Value(syncState),
      syncError: syncError == null && nullToAbsent
          ? const Value.absent()
          : Value(syncError),
    );
  }

  factory PosBill.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PosBill(
      id: serializer.fromJson<String>(json['id']),
      terminalId: serializer.fromJson<String>(json['terminalId']),
      number: serializer.fromJson<String>(json['number']),
      date: serializer.fromJson<String>(json['date']),
      createdAt: serializer.fromJson<String>(json['createdAt']),
      customerPhone: serializer.fromJson<String?>(json['customerPhone']),
      customerName: serializer.fromJson<String?>(json['customerName']),
      detail: serializer.fromJson<String>(json['detail']),
      total: serializer.fromJson<String>(json['total']),
      change: serializer.fromJson<String>(json['change']),
      serverTotal: serializer.fromJson<String?>(json['serverTotal']),
      syncState: serializer.fromJson<String>(json['syncState']),
      syncError: serializer.fromJson<String?>(json['syncError']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'terminalId': serializer.toJson<String>(terminalId),
      'number': serializer.toJson<String>(number),
      'date': serializer.toJson<String>(date),
      'createdAt': serializer.toJson<String>(createdAt),
      'customerPhone': serializer.toJson<String?>(customerPhone),
      'customerName': serializer.toJson<String?>(customerName),
      'detail': serializer.toJson<String>(detail),
      'total': serializer.toJson<String>(total),
      'change': serializer.toJson<String>(change),
      'serverTotal': serializer.toJson<String?>(serverTotal),
      'syncState': serializer.toJson<String>(syncState),
      'syncError': serializer.toJson<String?>(syncError),
    };
  }

  PosBill copyWith({
    String? id,
    String? terminalId,
    String? number,
    String? date,
    String? createdAt,
    Value<String?> customerPhone = const Value.absent(),
    Value<String?> customerName = const Value.absent(),
    String? detail,
    String? total,
    String? change,
    Value<String?> serverTotal = const Value.absent(),
    String? syncState,
    Value<String?> syncError = const Value.absent(),
  }) => PosBill(
    id: id ?? this.id,
    terminalId: terminalId ?? this.terminalId,
    number: number ?? this.number,
    date: date ?? this.date,
    createdAt: createdAt ?? this.createdAt,
    customerPhone: customerPhone.present
        ? customerPhone.value
        : this.customerPhone,
    customerName: customerName.present ? customerName.value : this.customerName,
    detail: detail ?? this.detail,
    total: total ?? this.total,
    change: change ?? this.change,
    serverTotal: serverTotal.present ? serverTotal.value : this.serverTotal,
    syncState: syncState ?? this.syncState,
    syncError: syncError.present ? syncError.value : this.syncError,
  );
  PosBill copyWithCompanion(PosBillsCompanion data) {
    return PosBill(
      id: data.id.present ? data.id.value : this.id,
      terminalId: data.terminalId.present
          ? data.terminalId.value
          : this.terminalId,
      number: data.number.present ? data.number.value : this.number,
      date: data.date.present ? data.date.value : this.date,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      customerPhone: data.customerPhone.present
          ? data.customerPhone.value
          : this.customerPhone,
      customerName: data.customerName.present
          ? data.customerName.value
          : this.customerName,
      detail: data.detail.present ? data.detail.value : this.detail,
      total: data.total.present ? data.total.value : this.total,
      change: data.change.present ? data.change.value : this.change,
      serverTotal: data.serverTotal.present
          ? data.serverTotal.value
          : this.serverTotal,
      syncState: data.syncState.present ? data.syncState.value : this.syncState,
      syncError: data.syncError.present ? data.syncError.value : this.syncError,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PosBill(')
          ..write('id: $id, ')
          ..write('terminalId: $terminalId, ')
          ..write('number: $number, ')
          ..write('date: $date, ')
          ..write('createdAt: $createdAt, ')
          ..write('customerPhone: $customerPhone, ')
          ..write('customerName: $customerName, ')
          ..write('detail: $detail, ')
          ..write('total: $total, ')
          ..write('change: $change, ')
          ..write('serverTotal: $serverTotal, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    terminalId,
    number,
    date,
    createdAt,
    customerPhone,
    customerName,
    detail,
    total,
    change,
    serverTotal,
    syncState,
    syncError,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PosBill &&
          other.id == this.id &&
          other.terminalId == this.terminalId &&
          other.number == this.number &&
          other.date == this.date &&
          other.createdAt == this.createdAt &&
          other.customerPhone == this.customerPhone &&
          other.customerName == this.customerName &&
          other.detail == this.detail &&
          other.total == this.total &&
          other.change == this.change &&
          other.serverTotal == this.serverTotal &&
          other.syncState == this.syncState &&
          other.syncError == this.syncError);
}

class PosBillsCompanion extends UpdateCompanion<PosBill> {
  final Value<String> id;
  final Value<String> terminalId;
  final Value<String> number;
  final Value<String> date;
  final Value<String> createdAt;
  final Value<String?> customerPhone;
  final Value<String?> customerName;
  final Value<String> detail;
  final Value<String> total;
  final Value<String> change;
  final Value<String?> serverTotal;
  final Value<String> syncState;
  final Value<String?> syncError;
  final Value<int> rowid;
  const PosBillsCompanion({
    this.id = const Value.absent(),
    this.terminalId = const Value.absent(),
    this.number = const Value.absent(),
    this.date = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.customerPhone = const Value.absent(),
    this.customerName = const Value.absent(),
    this.detail = const Value.absent(),
    this.total = const Value.absent(),
    this.change = const Value.absent(),
    this.serverTotal = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PosBillsCompanion.insert({
    required String id,
    required String terminalId,
    required String number,
    required String date,
    required String createdAt,
    this.customerPhone = const Value.absent(),
    this.customerName = const Value.absent(),
    required String detail,
    required String total,
    this.change = const Value.absent(),
    this.serverTotal = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       terminalId = Value(terminalId),
       number = Value(number),
       date = Value(date),
       createdAt = Value(createdAt),
       detail = Value(detail),
       total = Value(total);
  static Insertable<PosBill> custom({
    Expression<String>? id,
    Expression<String>? terminalId,
    Expression<String>? number,
    Expression<String>? date,
    Expression<String>? createdAt,
    Expression<String>? customerPhone,
    Expression<String>? customerName,
    Expression<String>? detail,
    Expression<String>? total,
    Expression<String>? change,
    Expression<String>? serverTotal,
    Expression<String>? syncState,
    Expression<String>? syncError,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (terminalId != null) 'terminal_id': terminalId,
      if (number != null) 'number': number,
      if (date != null) 'date': date,
      if (createdAt != null) 'created_at': createdAt,
      if (customerPhone != null) 'customer_phone': customerPhone,
      if (customerName != null) 'customer_name': customerName,
      if (detail != null) 'detail': detail,
      if (total != null) 'total': total,
      if (change != null) 'change': change,
      if (serverTotal != null) 'server_total': serverTotal,
      if (syncState != null) 'sync_state': syncState,
      if (syncError != null) 'sync_error': syncError,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PosBillsCompanion copyWith({
    Value<String>? id,
    Value<String>? terminalId,
    Value<String>? number,
    Value<String>? date,
    Value<String>? createdAt,
    Value<String?>? customerPhone,
    Value<String?>? customerName,
    Value<String>? detail,
    Value<String>? total,
    Value<String>? change,
    Value<String?>? serverTotal,
    Value<String>? syncState,
    Value<String?>? syncError,
    Value<int>? rowid,
  }) {
    return PosBillsCompanion(
      id: id ?? this.id,
      terminalId: terminalId ?? this.terminalId,
      number: number ?? this.number,
      date: date ?? this.date,
      createdAt: createdAt ?? this.createdAt,
      customerPhone: customerPhone ?? this.customerPhone,
      customerName: customerName ?? this.customerName,
      detail: detail ?? this.detail,
      total: total ?? this.total,
      change: change ?? this.change,
      serverTotal: serverTotal ?? this.serverTotal,
      syncState: syncState ?? this.syncState,
      syncError: syncError ?? this.syncError,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (terminalId.present) {
      map['terminal_id'] = Variable<String>(terminalId.value);
    }
    if (number.present) {
      map['number'] = Variable<String>(number.value);
    }
    if (date.present) {
      map['date'] = Variable<String>(date.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<String>(createdAt.value);
    }
    if (customerPhone.present) {
      map['customer_phone'] = Variable<String>(customerPhone.value);
    }
    if (customerName.present) {
      map['customer_name'] = Variable<String>(customerName.value);
    }
    if (detail.present) {
      map['detail'] = Variable<String>(detail.value);
    }
    if (total.present) {
      map['total'] = Variable<String>(total.value);
    }
    if (change.present) {
      map['change'] = Variable<String>(change.value);
    }
    if (serverTotal.present) {
      map['server_total'] = Variable<String>(serverTotal.value);
    }
    if (syncState.present) {
      map['sync_state'] = Variable<String>(syncState.value);
    }
    if (syncError.present) {
      map['sync_error'] = Variable<String>(syncError.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PosBillsCompanion(')
          ..write('id: $id, ')
          ..write('terminalId: $terminalId, ')
          ..write('number: $number, ')
          ..write('date: $date, ')
          ..write('createdAt: $createdAt, ')
          ..write('customerPhone: $customerPhone, ')
          ..write('customerName: $customerName, ')
          ..write('detail: $detail, ')
          ..write('total: $total, ')
          ..write('change: $change, ')
          ..write('serverTotal: $serverTotal, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ExpenseCategoriesTable extends ExpenseCategories
    with TableInfo<$ExpenseCategoriesTable, ExpenseCategory> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ExpenseCategoriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameHiMeta = const VerificationMeta('nameHi');
  @override
  late final GeneratedColumn<String> nameHi = GeneratedColumn<String>(
    'name_hi',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _blockedCreditMeta = const VerificationMeta(
    'blockedCredit',
  );
  @override
  late final GeneratedColumn<bool> blockedCredit = GeneratedColumn<bool>(
    'blocked_credit',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("blocked_credit" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  static const VerificationMeta _archivedMeta = const VerificationMeta(
    'archived',
  );
  @override
  late final GeneratedColumn<bool> archived = GeneratedColumn<bool>(
    'archived',
    aliasedName,
    false,
    type: DriftSqlType.bool,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'CHECK ("archived" IN (0, 1))',
    ),
    defaultValue: const Constant(false),
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    nameHi,
    blockedCredit,
    archived,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'expense_categories';
  @override
  VerificationContext validateIntegrity(
    Insertable<ExpenseCategory> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('name_hi')) {
      context.handle(
        _nameHiMeta,
        nameHi.isAcceptableOrUnknown(data['name_hi']!, _nameHiMeta),
      );
    }
    if (data.containsKey('blocked_credit')) {
      context.handle(
        _blockedCreditMeta,
        blockedCredit.isAcceptableOrUnknown(
          data['blocked_credit']!,
          _blockedCreditMeta,
        ),
      );
    }
    if (data.containsKey('archived')) {
      context.handle(
        _archivedMeta,
        archived.isAcceptableOrUnknown(data['archived']!, _archivedMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ExpenseCategory map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ExpenseCategory(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      nameHi: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name_hi'],
      ),
      blockedCredit: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}blocked_credit'],
      )!,
      archived: attachedDatabase.typeMapping.read(
        DriftSqlType.bool,
        data['${effectivePrefix}archived'],
      )!,
    );
  }

  @override
  $ExpenseCategoriesTable createAlias(String alias) {
    return $ExpenseCategoriesTable(attachedDatabase, alias);
  }
}

class ExpenseCategory extends DataClass implements Insertable<ExpenseCategory> {
  final String id;
  final String name;
  final String? nameHi;
  final bool blockedCredit;
  final bool archived;
  const ExpenseCategory({
    required this.id,
    required this.name,
    this.nameHi,
    required this.blockedCredit,
    required this.archived,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || nameHi != null) {
      map['name_hi'] = Variable<String>(nameHi);
    }
    map['blocked_credit'] = Variable<bool>(blockedCredit);
    map['archived'] = Variable<bool>(archived);
    return map;
  }

  ExpenseCategoriesCompanion toCompanion(bool nullToAbsent) {
    return ExpenseCategoriesCompanion(
      id: Value(id),
      name: Value(name),
      nameHi: nameHi == null && nullToAbsent
          ? const Value.absent()
          : Value(nameHi),
      blockedCredit: Value(blockedCredit),
      archived: Value(archived),
    );
  }

  factory ExpenseCategory.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ExpenseCategory(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      nameHi: serializer.fromJson<String?>(json['nameHi']),
      blockedCredit: serializer.fromJson<bool>(json['blockedCredit']),
      archived: serializer.fromJson<bool>(json['archived']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'nameHi': serializer.toJson<String?>(nameHi),
      'blockedCredit': serializer.toJson<bool>(blockedCredit),
      'archived': serializer.toJson<bool>(archived),
    };
  }

  ExpenseCategory copyWith({
    String? id,
    String? name,
    Value<String?> nameHi = const Value.absent(),
    bool? blockedCredit,
    bool? archived,
  }) => ExpenseCategory(
    id: id ?? this.id,
    name: name ?? this.name,
    nameHi: nameHi.present ? nameHi.value : this.nameHi,
    blockedCredit: blockedCredit ?? this.blockedCredit,
    archived: archived ?? this.archived,
  );
  ExpenseCategory copyWithCompanion(ExpenseCategoriesCompanion data) {
    return ExpenseCategory(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      nameHi: data.nameHi.present ? data.nameHi.value : this.nameHi,
      blockedCredit: data.blockedCredit.present
          ? data.blockedCredit.value
          : this.blockedCredit,
      archived: data.archived.present ? data.archived.value : this.archived,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseCategory(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('blockedCredit: $blockedCredit, ')
          ..write('archived: $archived')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, nameHi, blockedCredit, archived);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ExpenseCategory &&
          other.id == this.id &&
          other.name == this.name &&
          other.nameHi == this.nameHi &&
          other.blockedCredit == this.blockedCredit &&
          other.archived == this.archived);
}

class ExpenseCategoriesCompanion extends UpdateCompanion<ExpenseCategory> {
  final Value<String> id;
  final Value<String> name;
  final Value<String?> nameHi;
  final Value<bool> blockedCredit;
  final Value<bool> archived;
  final Value<int> rowid;
  const ExpenseCategoriesCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.nameHi = const Value.absent(),
    this.blockedCredit = const Value.absent(),
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ExpenseCategoriesCompanion.insert({
    required String id,
    required String name,
    this.nameHi = const Value.absent(),
    this.blockedCredit = const Value.absent(),
    this.archived = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       name = Value(name);
  static Insertable<ExpenseCategory> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? nameHi,
    Expression<bool>? blockedCredit,
    Expression<bool>? archived,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (nameHi != null) 'name_hi': nameHi,
      if (blockedCredit != null) 'blocked_credit': blockedCredit,
      if (archived != null) 'archived': archived,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ExpenseCategoriesCompanion copyWith({
    Value<String>? id,
    Value<String>? name,
    Value<String?>? nameHi,
    Value<bool>? blockedCredit,
    Value<bool>? archived,
    Value<int>? rowid,
  }) {
    return ExpenseCategoriesCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      nameHi: nameHi ?? this.nameHi,
      blockedCredit: blockedCredit ?? this.blockedCredit,
      archived: archived ?? this.archived,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (nameHi.present) {
      map['name_hi'] = Variable<String>(nameHi.value);
    }
    if (blockedCredit.present) {
      map['blocked_credit'] = Variable<bool>(blockedCredit.value);
    }
    if (archived.present) {
      map['archived'] = Variable<bool>(archived.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseCategoriesCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('nameHi: $nameHi, ')
          ..write('blockedCredit: $blockedCredit, ')
          ..write('archived: $archived, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $LocalClaimsTable extends LocalClaims
    with TableInfo<$LocalClaimsTable, LocalClaim> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalClaimsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _employeeIdMeta = const VerificationMeta(
    'employeeId',
  );
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
    'employee_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<String> date = GeneratedColumn<String>(
    'date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _linesMeta = const VerificationMeta('lines');
  @override
  late final GeneratedColumn<String> lines = GeneratedColumn<String>(
    'lines',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _totalMeta = const VerificationMeta('total');
  @override
  late final GeneratedColumn<String> total = GeneratedColumn<String>(
    'total',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _serverNumberMeta = const VerificationMeta(
    'serverNumber',
  );
  @override
  late final GeneratedColumn<String> serverNumber = GeneratedColumn<String>(
    'server_number',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _syncStateMeta = const VerificationMeta(
    'syncState',
  );
  @override
  late final GeneratedColumn<String> syncState = GeneratedColumn<String>(
    'sync_state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  static const VerificationMeta _syncErrorMeta = const VerificationMeta(
    'syncError',
  );
  @override
  late final GeneratedColumn<String> syncError = GeneratedColumn<String>(
    'sync_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<String> createdAt = GeneratedColumn<String>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    employeeId,
    date,
    title,
    lines,
    total,
    serverNumber,
    syncState,
    syncError,
    createdAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_claims';
  @override
  VerificationContext validateIntegrity(
    Insertable<LocalClaim> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('employee_id')) {
      context.handle(
        _employeeIdMeta,
        employeeId.isAcceptableOrUnknown(data['employee_id']!, _employeeIdMeta),
      );
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
        _dateMeta,
        date.isAcceptableOrUnknown(data['date']!, _dateMeta),
      );
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('lines')) {
      context.handle(
        _linesMeta,
        lines.isAcceptableOrUnknown(data['lines']!, _linesMeta),
      );
    } else if (isInserting) {
      context.missing(_linesMeta);
    }
    if (data.containsKey('total')) {
      context.handle(
        _totalMeta,
        total.isAcceptableOrUnknown(data['total']!, _totalMeta),
      );
    } else if (isInserting) {
      context.missing(_totalMeta);
    }
    if (data.containsKey('server_number')) {
      context.handle(
        _serverNumberMeta,
        serverNumber.isAcceptableOrUnknown(
          data['server_number']!,
          _serverNumberMeta,
        ),
      );
    }
    if (data.containsKey('sync_state')) {
      context.handle(
        _syncStateMeta,
        syncState.isAcceptableOrUnknown(data['sync_state']!, _syncStateMeta),
      );
    }
    if (data.containsKey('sync_error')) {
      context.handle(
        _syncErrorMeta,
        syncError.isAcceptableOrUnknown(data['sync_error']!, _syncErrorMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalClaim map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalClaim(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      employeeId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}employee_id'],
      )!,
      date: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}date'],
      )!,
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      )!,
      lines: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}lines'],
      )!,
      total: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}total'],
      )!,
      serverNumber: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}server_number'],
      ),
      syncState: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_state'],
      )!,
      syncError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_error'],
      ),
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}created_at'],
      )!,
    );
  }

  @override
  $LocalClaimsTable createAlias(String alias) {
    return $LocalClaimsTable(attachedDatabase, alias);
  }
}

class LocalClaim extends DataClass implements Insertable<LocalClaim> {
  final String id;
  final String employeeId;
  final String date;
  final String title;
  final String lines;
  final String total;
  final String? serverNumber;
  final String syncState;
  final String? syncError;
  final String createdAt;
  const LocalClaim({
    required this.id,
    required this.employeeId,
    required this.date,
    required this.title,
    required this.lines,
    required this.total,
    this.serverNumber,
    required this.syncState,
    this.syncError,
    required this.createdAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['date'] = Variable<String>(date);
    map['title'] = Variable<String>(title);
    map['lines'] = Variable<String>(lines);
    map['total'] = Variable<String>(total);
    if (!nullToAbsent || serverNumber != null) {
      map['server_number'] = Variable<String>(serverNumber);
    }
    map['sync_state'] = Variable<String>(syncState);
    if (!nullToAbsent || syncError != null) {
      map['sync_error'] = Variable<String>(syncError);
    }
    map['created_at'] = Variable<String>(createdAt);
    return map;
  }

  LocalClaimsCompanion toCompanion(bool nullToAbsent) {
    return LocalClaimsCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      date: Value(date),
      title: Value(title),
      lines: Value(lines),
      total: Value(total),
      serverNumber: serverNumber == null && nullToAbsent
          ? const Value.absent()
          : Value(serverNumber),
      syncState: Value(syncState),
      syncError: syncError == null && nullToAbsent
          ? const Value.absent()
          : Value(syncError),
      createdAt: Value(createdAt),
    );
  }

  factory LocalClaim.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalClaim(
      id: serializer.fromJson<String>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      date: serializer.fromJson<String>(json['date']),
      title: serializer.fromJson<String>(json['title']),
      lines: serializer.fromJson<String>(json['lines']),
      total: serializer.fromJson<String>(json['total']),
      serverNumber: serializer.fromJson<String?>(json['serverNumber']),
      syncState: serializer.fromJson<String>(json['syncState']),
      syncError: serializer.fromJson<String?>(json['syncError']),
      createdAt: serializer.fromJson<String>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'date': serializer.toJson<String>(date),
      'title': serializer.toJson<String>(title),
      'lines': serializer.toJson<String>(lines),
      'total': serializer.toJson<String>(total),
      'serverNumber': serializer.toJson<String?>(serverNumber),
      'syncState': serializer.toJson<String>(syncState),
      'syncError': serializer.toJson<String?>(syncError),
      'createdAt': serializer.toJson<String>(createdAt),
    };
  }

  LocalClaim copyWith({
    String? id,
    String? employeeId,
    String? date,
    String? title,
    String? lines,
    String? total,
    Value<String?> serverNumber = const Value.absent(),
    String? syncState,
    Value<String?> syncError = const Value.absent(),
    String? createdAt,
  }) => LocalClaim(
    id: id ?? this.id,
    employeeId: employeeId ?? this.employeeId,
    date: date ?? this.date,
    title: title ?? this.title,
    lines: lines ?? this.lines,
    total: total ?? this.total,
    serverNumber: serverNumber.present ? serverNumber.value : this.serverNumber,
    syncState: syncState ?? this.syncState,
    syncError: syncError.present ? syncError.value : this.syncError,
    createdAt: createdAt ?? this.createdAt,
  );
  LocalClaim copyWithCompanion(LocalClaimsCompanion data) {
    return LocalClaim(
      id: data.id.present ? data.id.value : this.id,
      employeeId: data.employeeId.present
          ? data.employeeId.value
          : this.employeeId,
      date: data.date.present ? data.date.value : this.date,
      title: data.title.present ? data.title.value : this.title,
      lines: data.lines.present ? data.lines.value : this.lines,
      total: data.total.present ? data.total.value : this.total,
      serverNumber: data.serverNumber.present
          ? data.serverNumber.value
          : this.serverNumber,
      syncState: data.syncState.present ? data.syncState.value : this.syncState,
      syncError: data.syncError.present ? data.syncError.value : this.syncError,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalClaim(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('date: $date, ')
          ..write('title: $title, ')
          ..write('lines: $lines, ')
          ..write('total: $total, ')
          ..write('serverNumber: $serverNumber, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    employeeId,
    date,
    title,
    lines,
    total,
    serverNumber,
    syncState,
    syncError,
    createdAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalClaim &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.date == this.date &&
          other.title == this.title &&
          other.lines == this.lines &&
          other.total == this.total &&
          other.serverNumber == this.serverNumber &&
          other.syncState == this.syncState &&
          other.syncError == this.syncError &&
          other.createdAt == this.createdAt);
}

class LocalClaimsCompanion extends UpdateCompanion<LocalClaim> {
  final Value<String> id;
  final Value<String> employeeId;
  final Value<String> date;
  final Value<String> title;
  final Value<String> lines;
  final Value<String> total;
  final Value<String?> serverNumber;
  final Value<String> syncState;
  final Value<String?> syncError;
  final Value<String> createdAt;
  final Value<int> rowid;
  const LocalClaimsCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.date = const Value.absent(),
    this.title = const Value.absent(),
    this.lines = const Value.absent(),
    this.total = const Value.absent(),
    this.serverNumber = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  LocalClaimsCompanion.insert({
    required String id,
    required String employeeId,
    required String date,
    required String title,
    required String lines,
    required String total,
    this.serverNumber = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    required String createdAt,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       employeeId = Value(employeeId),
       date = Value(date),
       title = Value(title),
       lines = Value(lines),
       total = Value(total),
       createdAt = Value(createdAt);
  static Insertable<LocalClaim> custom({
    Expression<String>? id,
    Expression<String>? employeeId,
    Expression<String>? date,
    Expression<String>? title,
    Expression<String>? lines,
    Expression<String>? total,
    Expression<String>? serverNumber,
    Expression<String>? syncState,
    Expression<String>? syncError,
    Expression<String>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (date != null) 'date': date,
      if (title != null) 'title': title,
      if (lines != null) 'lines': lines,
      if (total != null) 'total': total,
      if (serverNumber != null) 'server_number': serverNumber,
      if (syncState != null) 'sync_state': syncState,
      if (syncError != null) 'sync_error': syncError,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  LocalClaimsCompanion copyWith({
    Value<String>? id,
    Value<String>? employeeId,
    Value<String>? date,
    Value<String>? title,
    Value<String>? lines,
    Value<String>? total,
    Value<String?>? serverNumber,
    Value<String>? syncState,
    Value<String?>? syncError,
    Value<String>? createdAt,
    Value<int>? rowid,
  }) {
    return LocalClaimsCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      date: date ?? this.date,
      title: title ?? this.title,
      lines: lines ?? this.lines,
      total: total ?? this.total,
      serverNumber: serverNumber ?? this.serverNumber,
      syncState: syncState ?? this.syncState,
      syncError: syncError ?? this.syncError,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (date.present) {
      map['date'] = Variable<String>(date.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (lines.present) {
      map['lines'] = Variable<String>(lines.value);
    }
    if (total.present) {
      map['total'] = Variable<String>(total.value);
    }
    if (serverNumber.present) {
      map['server_number'] = Variable<String>(serverNumber.value);
    }
    if (syncState.present) {
      map['sync_state'] = Variable<String>(syncState.value);
    }
    if (syncError.present) {
      map['sync_error'] = Variable<String>(syncError.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<String>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalClaimsCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('date: $date, ')
          ..write('title: $title, ')
          ..write('lines: $lines, ')
          ..write('total: $total, ')
          ..write('serverNumber: $serverNumber, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $FieldOrdersTable extends FieldOrders
    with TableInfo<$FieldOrdersTable, FieldOrder> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $FieldOrdersTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _customerIdMeta = const VerificationMeta(
    'customerId',
  );
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
    'customer_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<String> date = GeneratedColumn<String>(
    'date',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _deliverByMeta = const VerificationMeta(
    'deliverBy',
  );
  @override
  late final GeneratedColumn<String> deliverBy = GeneratedColumn<String>(
    'deliver_by',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _linesMeta = const VerificationMeta('lines');
  @override
  late final GeneratedColumn<String> lines = GeneratedColumn<String>(
    'lines',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _estimateMeta = const VerificationMeta(
    'estimate',
  );
  @override
  late final GeneratedColumn<String> estimate = GeneratedColumn<String>(
    'estimate',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _serverNumberMeta = const VerificationMeta(
    'serverNumber',
  );
  @override
  late final GeneratedColumn<String> serverNumber = GeneratedColumn<String>(
    'server_number',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _serverTotalMeta = const VerificationMeta(
    'serverTotal',
  );
  @override
  late final GeneratedColumn<String> serverTotal = GeneratedColumn<String>(
    'server_total',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _syncStateMeta = const VerificationMeta(
    'syncState',
  );
  @override
  late final GeneratedColumn<String> syncState = GeneratedColumn<String>(
    'sync_state',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('pending'),
  );
  static const VerificationMeta _syncErrorMeta = const VerificationMeta(
    'syncError',
  );
  @override
  late final GeneratedColumn<String> syncError = GeneratedColumn<String>(
    'sync_error',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<String> createdAt = GeneratedColumn<String>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    customerId,
    date,
    deliverBy,
    lines,
    estimate,
    serverNumber,
    serverTotal,
    syncState,
    syncError,
    createdAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'field_orders';
  @override
  VerificationContext validateIntegrity(
    Insertable<FieldOrder> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
        _customerIdMeta,
        customerId.isAcceptableOrUnknown(data['customer_id']!, _customerIdMeta),
      );
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
        _dateMeta,
        date.isAcceptableOrUnknown(data['date']!, _dateMeta),
      );
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('deliver_by')) {
      context.handle(
        _deliverByMeta,
        deliverBy.isAcceptableOrUnknown(data['deliver_by']!, _deliverByMeta),
      );
    }
    if (data.containsKey('lines')) {
      context.handle(
        _linesMeta,
        lines.isAcceptableOrUnknown(data['lines']!, _linesMeta),
      );
    } else if (isInserting) {
      context.missing(_linesMeta);
    }
    if (data.containsKey('estimate')) {
      context.handle(
        _estimateMeta,
        estimate.isAcceptableOrUnknown(data['estimate']!, _estimateMeta),
      );
    } else if (isInserting) {
      context.missing(_estimateMeta);
    }
    if (data.containsKey('server_number')) {
      context.handle(
        _serverNumberMeta,
        serverNumber.isAcceptableOrUnknown(
          data['server_number']!,
          _serverNumberMeta,
        ),
      );
    }
    if (data.containsKey('server_total')) {
      context.handle(
        _serverTotalMeta,
        serverTotal.isAcceptableOrUnknown(
          data['server_total']!,
          _serverTotalMeta,
        ),
      );
    }
    if (data.containsKey('sync_state')) {
      context.handle(
        _syncStateMeta,
        syncState.isAcceptableOrUnknown(data['sync_state']!, _syncStateMeta),
      );
    }
    if (data.containsKey('sync_error')) {
      context.handle(
        _syncErrorMeta,
        syncError.isAcceptableOrUnknown(data['sync_error']!, _syncErrorMeta),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  FieldOrder map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return FieldOrder(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      customerId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}customer_id'],
      )!,
      date: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}date'],
      )!,
      deliverBy: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}deliver_by'],
      ),
      lines: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}lines'],
      )!,
      estimate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}estimate'],
      )!,
      serverNumber: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}server_number'],
      ),
      serverTotal: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}server_total'],
      ),
      syncState: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_state'],
      )!,
      syncError: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}sync_error'],
      ),
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}created_at'],
      )!,
    );
  }

  @override
  $FieldOrdersTable createAlias(String alias) {
    return $FieldOrdersTable(attachedDatabase, alias);
  }
}

class FieldOrder extends DataClass implements Insertable<FieldOrder> {
  final String id;
  final String customerId;
  final String date;
  final String? deliverBy;
  final String lines;
  final String estimate;
  final String? serverNumber;
  final String? serverTotal;
  final String syncState;
  final String? syncError;
  final String createdAt;
  const FieldOrder({
    required this.id,
    required this.customerId,
    required this.date,
    this.deliverBy,
    required this.lines,
    required this.estimate,
    this.serverNumber,
    this.serverTotal,
    required this.syncState,
    this.syncError,
    required this.createdAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['customer_id'] = Variable<String>(customerId);
    map['date'] = Variable<String>(date);
    if (!nullToAbsent || deliverBy != null) {
      map['deliver_by'] = Variable<String>(deliverBy);
    }
    map['lines'] = Variable<String>(lines);
    map['estimate'] = Variable<String>(estimate);
    if (!nullToAbsent || serverNumber != null) {
      map['server_number'] = Variable<String>(serverNumber);
    }
    if (!nullToAbsent || serverTotal != null) {
      map['server_total'] = Variable<String>(serverTotal);
    }
    map['sync_state'] = Variable<String>(syncState);
    if (!nullToAbsent || syncError != null) {
      map['sync_error'] = Variable<String>(syncError);
    }
    map['created_at'] = Variable<String>(createdAt);
    return map;
  }

  FieldOrdersCompanion toCompanion(bool nullToAbsent) {
    return FieldOrdersCompanion(
      id: Value(id),
      customerId: Value(customerId),
      date: Value(date),
      deliverBy: deliverBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deliverBy),
      lines: Value(lines),
      estimate: Value(estimate),
      serverNumber: serverNumber == null && nullToAbsent
          ? const Value.absent()
          : Value(serverNumber),
      serverTotal: serverTotal == null && nullToAbsent
          ? const Value.absent()
          : Value(serverTotal),
      syncState: Value(syncState),
      syncError: syncError == null && nullToAbsent
          ? const Value.absent()
          : Value(syncError),
      createdAt: Value(createdAt),
    );
  }

  factory FieldOrder.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return FieldOrder(
      id: serializer.fromJson<String>(json['id']),
      customerId: serializer.fromJson<String>(json['customerId']),
      date: serializer.fromJson<String>(json['date']),
      deliverBy: serializer.fromJson<String?>(json['deliverBy']),
      lines: serializer.fromJson<String>(json['lines']),
      estimate: serializer.fromJson<String>(json['estimate']),
      serverNumber: serializer.fromJson<String?>(json['serverNumber']),
      serverTotal: serializer.fromJson<String?>(json['serverTotal']),
      syncState: serializer.fromJson<String>(json['syncState']),
      syncError: serializer.fromJson<String?>(json['syncError']),
      createdAt: serializer.fromJson<String>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'customerId': serializer.toJson<String>(customerId),
      'date': serializer.toJson<String>(date),
      'deliverBy': serializer.toJson<String?>(deliverBy),
      'lines': serializer.toJson<String>(lines),
      'estimate': serializer.toJson<String>(estimate),
      'serverNumber': serializer.toJson<String?>(serverNumber),
      'serverTotal': serializer.toJson<String?>(serverTotal),
      'syncState': serializer.toJson<String>(syncState),
      'syncError': serializer.toJson<String?>(syncError),
      'createdAt': serializer.toJson<String>(createdAt),
    };
  }

  FieldOrder copyWith({
    String? id,
    String? customerId,
    String? date,
    Value<String?> deliverBy = const Value.absent(),
    String? lines,
    String? estimate,
    Value<String?> serverNumber = const Value.absent(),
    Value<String?> serverTotal = const Value.absent(),
    String? syncState,
    Value<String?> syncError = const Value.absent(),
    String? createdAt,
  }) => FieldOrder(
    id: id ?? this.id,
    customerId: customerId ?? this.customerId,
    date: date ?? this.date,
    deliverBy: deliverBy.present ? deliverBy.value : this.deliverBy,
    lines: lines ?? this.lines,
    estimate: estimate ?? this.estimate,
    serverNumber: serverNumber.present ? serverNumber.value : this.serverNumber,
    serverTotal: serverTotal.present ? serverTotal.value : this.serverTotal,
    syncState: syncState ?? this.syncState,
    syncError: syncError.present ? syncError.value : this.syncError,
    createdAt: createdAt ?? this.createdAt,
  );
  FieldOrder copyWithCompanion(FieldOrdersCompanion data) {
    return FieldOrder(
      id: data.id.present ? data.id.value : this.id,
      customerId: data.customerId.present
          ? data.customerId.value
          : this.customerId,
      date: data.date.present ? data.date.value : this.date,
      deliverBy: data.deliverBy.present ? data.deliverBy.value : this.deliverBy,
      lines: data.lines.present ? data.lines.value : this.lines,
      estimate: data.estimate.present ? data.estimate.value : this.estimate,
      serverNumber: data.serverNumber.present
          ? data.serverNumber.value
          : this.serverNumber,
      serverTotal: data.serverTotal.present
          ? data.serverTotal.value
          : this.serverTotal,
      syncState: data.syncState.present ? data.syncState.value : this.syncState,
      syncError: data.syncError.present ? data.syncError.value : this.syncError,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('FieldOrder(')
          ..write('id: $id, ')
          ..write('customerId: $customerId, ')
          ..write('date: $date, ')
          ..write('deliverBy: $deliverBy, ')
          ..write('lines: $lines, ')
          ..write('estimate: $estimate, ')
          ..write('serverNumber: $serverNumber, ')
          ..write('serverTotal: $serverTotal, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    customerId,
    date,
    deliverBy,
    lines,
    estimate,
    serverNumber,
    serverTotal,
    syncState,
    syncError,
    createdAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is FieldOrder &&
          other.id == this.id &&
          other.customerId == this.customerId &&
          other.date == this.date &&
          other.deliverBy == this.deliverBy &&
          other.lines == this.lines &&
          other.estimate == this.estimate &&
          other.serverNumber == this.serverNumber &&
          other.serverTotal == this.serverTotal &&
          other.syncState == this.syncState &&
          other.syncError == this.syncError &&
          other.createdAt == this.createdAt);
}

class FieldOrdersCompanion extends UpdateCompanion<FieldOrder> {
  final Value<String> id;
  final Value<String> customerId;
  final Value<String> date;
  final Value<String?> deliverBy;
  final Value<String> lines;
  final Value<String> estimate;
  final Value<String?> serverNumber;
  final Value<String?> serverTotal;
  final Value<String> syncState;
  final Value<String?> syncError;
  final Value<String> createdAt;
  final Value<int> rowid;
  const FieldOrdersCompanion({
    this.id = const Value.absent(),
    this.customerId = const Value.absent(),
    this.date = const Value.absent(),
    this.deliverBy = const Value.absent(),
    this.lines = const Value.absent(),
    this.estimate = const Value.absent(),
    this.serverNumber = const Value.absent(),
    this.serverTotal = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  FieldOrdersCompanion.insert({
    required String id,
    required String customerId,
    required String date,
    this.deliverBy = const Value.absent(),
    required String lines,
    required String estimate,
    this.serverNumber = const Value.absent(),
    this.serverTotal = const Value.absent(),
    this.syncState = const Value.absent(),
    this.syncError = const Value.absent(),
    required String createdAt,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       customerId = Value(customerId),
       date = Value(date),
       lines = Value(lines),
       estimate = Value(estimate),
       createdAt = Value(createdAt);
  static Insertable<FieldOrder> custom({
    Expression<String>? id,
    Expression<String>? customerId,
    Expression<String>? date,
    Expression<String>? deliverBy,
    Expression<String>? lines,
    Expression<String>? estimate,
    Expression<String>? serverNumber,
    Expression<String>? serverTotal,
    Expression<String>? syncState,
    Expression<String>? syncError,
    Expression<String>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (customerId != null) 'customer_id': customerId,
      if (date != null) 'date': date,
      if (deliverBy != null) 'deliver_by': deliverBy,
      if (lines != null) 'lines': lines,
      if (estimate != null) 'estimate': estimate,
      if (serverNumber != null) 'server_number': serverNumber,
      if (serverTotal != null) 'server_total': serverTotal,
      if (syncState != null) 'sync_state': syncState,
      if (syncError != null) 'sync_error': syncError,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  FieldOrdersCompanion copyWith({
    Value<String>? id,
    Value<String>? customerId,
    Value<String>? date,
    Value<String?>? deliverBy,
    Value<String>? lines,
    Value<String>? estimate,
    Value<String?>? serverNumber,
    Value<String?>? serverTotal,
    Value<String>? syncState,
    Value<String?>? syncError,
    Value<String>? createdAt,
    Value<int>? rowid,
  }) {
    return FieldOrdersCompanion(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      date: date ?? this.date,
      deliverBy: deliverBy ?? this.deliverBy,
      lines: lines ?? this.lines,
      estimate: estimate ?? this.estimate,
      serverNumber: serverNumber ?? this.serverNumber,
      serverTotal: serverTotal ?? this.serverTotal,
      syncState: syncState ?? this.syncState,
      syncError: syncError ?? this.syncError,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (date.present) {
      map['date'] = Variable<String>(date.value);
    }
    if (deliverBy.present) {
      map['deliver_by'] = Variable<String>(deliverBy.value);
    }
    if (lines.present) {
      map['lines'] = Variable<String>(lines.value);
    }
    if (estimate.present) {
      map['estimate'] = Variable<String>(estimate.value);
    }
    if (serverNumber.present) {
      map['server_number'] = Variable<String>(serverNumber.value);
    }
    if (serverTotal.present) {
      map['server_total'] = Variable<String>(serverTotal.value);
    }
    if (syncState.present) {
      map['sync_state'] = Variable<String>(syncState.value);
    }
    if (syncError.present) {
      map['sync_error'] = Variable<String>(syncError.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<String>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('FieldOrdersCompanion(')
          ..write('id: $id, ')
          ..write('customerId: $customerId, ')
          ..write('date: $date, ')
          ..write('deliverBy: $deliverBy, ')
          ..write('lines: $lines, ')
          ..write('estimate: $estimate, ')
          ..write('serverNumber: $serverNumber, ')
          ..write('serverTotal: $serverTotal, ')
          ..write('syncState: $syncState, ')
          ..write('syncError: $syncError, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$LocalDb extends GeneratedDatabase {
  _$LocalDb(QueryExecutor e) : super(e);
  $LocalDbManager get managers => $LocalDbManager(this);
  late final $MetaTable meta = $MetaTable(this);
  late final $CompaniesTable companies = $CompaniesTable(this);
  late final $FiscalYearsTable fiscalYears = $FiscalYearsTable(this);
  late final $AccountGroupsTable accountGroups = $AccountGroupsTable(this);
  late final $AccountsTable accounts = $AccountsTable(this);
  late final $VouchersTable vouchers = $VouchersTable(this);
  late final $VoucherLinesTable voucherLines = $VoucherLinesTable(this);
  late final $DeviceSeriesTable deviceSeries = $DeviceSeriesTable(this);
  late final $OutboxTable outbox = $OutboxTable(this);
  late final $EmployeesTable employees = $EmployeesTable(this);
  late final $LeaveTypesTable leaveTypes = $LeaveTypesTable(this);
  late final $LeaveRequestsTable leaveRequests = $LeaveRequestsTable(this);
  late final $AttendanceDaysTable attendanceDays = $AttendanceDaysTable(this);
  late final $PayslipsTable payslips = $PayslipsTable(this);
  late final $PosItemsTable posItems = $PosItemsTable(this);
  late final $PosTerminalsTable posTerminals = $PosTerminalsTable(this);
  late final $PosBillsTable posBills = $PosBillsTable(this);
  late final $ExpenseCategoriesTable expenseCategories =
      $ExpenseCategoriesTable(this);
  late final $LocalClaimsTable localClaims = $LocalClaimsTable(this);
  late final $FieldOrdersTable fieldOrders = $FieldOrdersTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    meta,
    companies,
    fiscalYears,
    accountGroups,
    accounts,
    vouchers,
    voucherLines,
    deviceSeries,
    outbox,
    employees,
    leaveTypes,
    leaveRequests,
    attendanceDays,
    payslips,
    posItems,
    posTerminals,
    posBills,
    expenseCategories,
    localClaims,
    fieldOrders,
  ];
}

typedef $$MetaTableCreateCompanionBuilder = MetaCompanion Function({
  required String key,
  required String value,
  Value<int> rowid,
});
typedef $$MetaTableUpdateCompanionBuilder = MetaCompanion Function({
  Value<String> key,
  Value<String> value,
  Value<int> rowid,
});

class $$MetaTableFilterComposer extends Composer<_$LocalDb, $MetaTable> {
  $$MetaTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get key => $composableBuilder(
    column: $table.key,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get value => $composableBuilder(
    column: $table.value,
    builder: (column) => ColumnFilters(column),
  );
}

class $$MetaTableOrderingComposer extends Composer<_$LocalDb, $MetaTable> {
  $$MetaTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get key => $composableBuilder(
    column: $table.key,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get value => $composableBuilder(
    column: $table.value,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$MetaTableAnnotationComposer extends Composer<_$LocalDb, $MetaTable> {
  $$MetaTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get key =>
      $composableBuilder(column: $table.key, builder: (column) => column);

  GeneratedColumn<String> get value =>
      $composableBuilder(column: $table.value, builder: (column) => column);
}

class $$MetaTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $MetaTable,
          MetaData,
          $$MetaTableFilterComposer,
          $$MetaTableOrderingComposer,
          $$MetaTableAnnotationComposer,
          $$MetaTableCreateCompanionBuilder,
          $$MetaTableUpdateCompanionBuilder,
          (MetaData, BaseReferences<_$LocalDb, $MetaTable, MetaData>),
          MetaData,
          PrefetchHooks Function()
        > {
  $$MetaTableTableManager(_$LocalDb db, $MetaTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MetaTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MetaTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MetaTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> key = const Value.absent(),
            Value<String> value = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) => MetaCompanion(key: key, value: value, rowid: rowid),
          createCompanionCallback: ({
            required String key,
            required String value,
            Value<int> rowid = const Value.absent(),
          }) => MetaCompanion.insert(key: key, value: value, rowid: rowid),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$MetaTable, MetaData>(table),
                  BaseReferences<_$LocalDb, $MetaTable, MetaData>(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$MetaTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $MetaTable,
      MetaData,
      $$MetaTableFilterComposer,
      $$MetaTableOrderingComposer,
      $$MetaTableAnnotationComposer,
      $$MetaTableCreateCompanionBuilder,
      $$MetaTableUpdateCompanionBuilder,
      (MetaData, BaseReferences<_$LocalDb, $MetaTable, MetaData>),
      MetaData,
      PrefetchHooks Function()
    >;
typedef $$CompaniesTableCreateCompanionBuilder = CompaniesCompanion Function({
  required String id,
  required String name,
  required String booksBeginOn,
  Value<int> rowid,
});
typedef $$CompaniesTableUpdateCompanionBuilder = CompaniesCompanion Function({
  Value<String> id,
  Value<String> name,
  Value<String> booksBeginOn,
  Value<int> rowid,
});

class $$CompaniesTableFilterComposer
    extends Composer<_$LocalDb, $CompaniesTable> {
  $$CompaniesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get booksBeginOn => $composableBuilder(
    column: $table.booksBeginOn,
    builder: (column) => ColumnFilters(column),
  );
}

class $$CompaniesTableOrderingComposer
    extends Composer<_$LocalDb, $CompaniesTable> {
  $$CompaniesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get booksBeginOn => $composableBuilder(
    column: $table.booksBeginOn,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$CompaniesTableAnnotationComposer
    extends Composer<_$LocalDb, $CompaniesTable> {
  $$CompaniesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get booksBeginOn => $composableBuilder(
    column: $table.booksBeginOn,
    builder: (column) => column,
  );
}

class $$CompaniesTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $CompaniesTable,
          Company,
          $$CompaniesTableFilterComposer,
          $$CompaniesTableOrderingComposer,
          $$CompaniesTableAnnotationComposer,
          $$CompaniesTableCreateCompanionBuilder,
          $$CompaniesTableUpdateCompanionBuilder,
          (Company, BaseReferences<_$LocalDb, $CompaniesTable, Company>),
          Company,
          PrefetchHooks Function()
        > {
  $$CompaniesTableTableManager(_$LocalDb db, $CompaniesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CompaniesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CompaniesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CompaniesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String> booksBeginOn = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => CompaniesCompanion(
                id: id,
                name: name,
                booksBeginOn: booksBeginOn,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                required String booksBeginOn,
                Value<int> rowid = const Value.absent(),
              }) => CompaniesCompanion.insert(
                id: id,
                name: name,
                booksBeginOn: booksBeginOn,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$CompaniesTable, Company>(table),
                  BaseReferences<_$LocalDb, $CompaniesTable, Company>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$CompaniesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $CompaniesTable,
      Company,
      $$CompaniesTableFilterComposer,
      $$CompaniesTableOrderingComposer,
      $$CompaniesTableAnnotationComposer,
      $$CompaniesTableCreateCompanionBuilder,
      $$CompaniesTableUpdateCompanionBuilder,
      (Company, BaseReferences<_$LocalDb, $CompaniesTable, Company>),
      Company,
      PrefetchHooks Function()
    >;
typedef $$FiscalYearsTableCreateCompanionBuilder =
    FiscalYearsCompanion Function({
      required String id,
      required String companyId,
      required String label,
      required String startsOn,
      required String endsOn,
      Value<String?> lockedUpTo,
      Value<bool> closed,
      Value<int> rowid,
    });
typedef $$FiscalYearsTableUpdateCompanionBuilder =
    FiscalYearsCompanion Function({
      Value<String> id,
      Value<String> companyId,
      Value<String> label,
      Value<String> startsOn,
      Value<String> endsOn,
      Value<String?> lockedUpTo,
      Value<bool> closed,
      Value<int> rowid,
    });

class $$FiscalYearsTableFilterComposer
    extends Composer<_$LocalDb, $FiscalYearsTable> {
  $$FiscalYearsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get label => $composableBuilder(
    column: $table.label,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get startsOn => $composableBuilder(
    column: $table.startsOn,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get endsOn => $composableBuilder(
    column: $table.endsOn,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get lockedUpTo => $composableBuilder(
    column: $table.lockedUpTo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get closed => $composableBuilder(
    column: $table.closed,
    builder: (column) => ColumnFilters(column),
  );
}

class $$FiscalYearsTableOrderingComposer
    extends Composer<_$LocalDb, $FiscalYearsTable> {
  $$FiscalYearsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get label => $composableBuilder(
    column: $table.label,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get startsOn => $composableBuilder(
    column: $table.startsOn,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get endsOn => $composableBuilder(
    column: $table.endsOn,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get lockedUpTo => $composableBuilder(
    column: $table.lockedUpTo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get closed => $composableBuilder(
    column: $table.closed,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$FiscalYearsTableAnnotationComposer
    extends Composer<_$LocalDb, $FiscalYearsTable> {
  $$FiscalYearsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get companyId =>
      $composableBuilder(column: $table.companyId, builder: (column) => column);

  GeneratedColumn<String> get label =>
      $composableBuilder(column: $table.label, builder: (column) => column);

  GeneratedColumn<String> get startsOn =>
      $composableBuilder(column: $table.startsOn, builder: (column) => column);

  GeneratedColumn<String> get endsOn =>
      $composableBuilder(column: $table.endsOn, builder: (column) => column);

  GeneratedColumn<String> get lockedUpTo => $composableBuilder(
    column: $table.lockedUpTo,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get closed =>
      $composableBuilder(column: $table.closed, builder: (column) => column);
}

class $$FiscalYearsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $FiscalYearsTable,
          FiscalYear,
          $$FiscalYearsTableFilterComposer,
          $$FiscalYearsTableOrderingComposer,
          $$FiscalYearsTableAnnotationComposer,
          $$FiscalYearsTableCreateCompanionBuilder,
          $$FiscalYearsTableUpdateCompanionBuilder,
          (
            FiscalYear,
            BaseReferences<_$LocalDb, $FiscalYearsTable, FiscalYear>,
          ),
          FiscalYear,
          PrefetchHooks Function()
        > {
  $$FiscalYearsTableTableManager(_$LocalDb db, $FiscalYearsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$FiscalYearsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$FiscalYearsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$FiscalYearsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> companyId = const Value.absent(),
                Value<String> label = const Value.absent(),
                Value<String> startsOn = const Value.absent(),
                Value<String> endsOn = const Value.absent(),
                Value<String?> lockedUpTo = const Value.absent(),
                Value<bool> closed = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => FiscalYearsCompanion(
                id: id,
                companyId: companyId,
                label: label,
                startsOn: startsOn,
                endsOn: endsOn,
                lockedUpTo: lockedUpTo,
                closed: closed,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String companyId,
                required String label,
                required String startsOn,
                required String endsOn,
                Value<String?> lockedUpTo = const Value.absent(),
                Value<bool> closed = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => FiscalYearsCompanion.insert(
                id: id,
                companyId: companyId,
                label: label,
                startsOn: startsOn,
                endsOn: endsOn,
                lockedUpTo: lockedUpTo,
                closed: closed,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$FiscalYearsTable, FiscalYear>(table),
                  BaseReferences<_$LocalDb, $FiscalYearsTable, FiscalYear>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$FiscalYearsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $FiscalYearsTable,
      FiscalYear,
      $$FiscalYearsTableFilterComposer,
      $$FiscalYearsTableOrderingComposer,
      $$FiscalYearsTableAnnotationComposer,
      $$FiscalYearsTableCreateCompanionBuilder,
      $$FiscalYearsTableUpdateCompanionBuilder,
      (FiscalYear, BaseReferences<_$LocalDb, $FiscalYearsTable, FiscalYear>),
      FiscalYear,
      PrefetchHooks Function()
    >;
typedef $$AccountGroupsTableCreateCompanionBuilder =
    AccountGroupsCompanion Function({
      required String id,
      required String companyId,
      Value<String?> parentId,
      Value<String?> key,
      required String name,
      Value<String?> nameHi,
      required String nature,
      Value<int> rowid,
    });
typedef $$AccountGroupsTableUpdateCompanionBuilder =
    AccountGroupsCompanion Function({
      Value<String> id,
      Value<String> companyId,
      Value<String?> parentId,
      Value<String?> key,
      Value<String> name,
      Value<String?> nameHi,
      Value<String> nature,
      Value<int> rowid,
    });

class $$AccountGroupsTableFilterComposer
    extends Composer<_$LocalDb, $AccountGroupsTable> {
  $$AccountGroupsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get parentId => $composableBuilder(
    column: $table.parentId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get key => $composableBuilder(
    column: $table.key,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nature => $composableBuilder(
    column: $table.nature,
    builder: (column) => ColumnFilters(column),
  );
}

class $$AccountGroupsTableOrderingComposer
    extends Composer<_$LocalDb, $AccountGroupsTable> {
  $$AccountGroupsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get parentId => $composableBuilder(
    column: $table.parentId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get key => $composableBuilder(
    column: $table.key,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nature => $composableBuilder(
    column: $table.nature,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$AccountGroupsTableAnnotationComposer
    extends Composer<_$LocalDb, $AccountGroupsTable> {
  $$AccountGroupsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get companyId =>
      $composableBuilder(column: $table.companyId, builder: (column) => column);

  GeneratedColumn<String> get parentId =>
      $composableBuilder(column: $table.parentId, builder: (column) => column);

  GeneratedColumn<String> get key =>
      $composableBuilder(column: $table.key, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get nameHi =>
      $composableBuilder(column: $table.nameHi, builder: (column) => column);

  GeneratedColumn<String> get nature =>
      $composableBuilder(column: $table.nature, builder: (column) => column);
}

class $$AccountGroupsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $AccountGroupsTable,
          AccountGroup,
          $$AccountGroupsTableFilterComposer,
          $$AccountGroupsTableOrderingComposer,
          $$AccountGroupsTableAnnotationComposer,
          $$AccountGroupsTableCreateCompanionBuilder,
          $$AccountGroupsTableUpdateCompanionBuilder,
          (
            AccountGroup,
            BaseReferences<_$LocalDb, $AccountGroupsTable, AccountGroup>,
          ),
          AccountGroup,
          PrefetchHooks Function()
        > {
  $$AccountGroupsTableTableManager(_$LocalDb db, $AccountGroupsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AccountGroupsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AccountGroupsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AccountGroupsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> companyId = const Value.absent(),
                Value<String?> parentId = const Value.absent(),
                Value<String?> key = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> nameHi = const Value.absent(),
                Value<String> nature = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AccountGroupsCompanion(
                id: id,
                companyId: companyId,
                parentId: parentId,
                key: key,
                name: name,
                nameHi: nameHi,
                nature: nature,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String companyId,
                Value<String?> parentId = const Value.absent(),
                Value<String?> key = const Value.absent(),
                required String name,
                Value<String?> nameHi = const Value.absent(),
                required String nature,
                Value<int> rowid = const Value.absent(),
              }) => AccountGroupsCompanion.insert(
                id: id,
                companyId: companyId,
                parentId: parentId,
                key: key,
                name: name,
                nameHi: nameHi,
                nature: nature,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$AccountGroupsTable, AccountGroup>(table),
                  BaseReferences<_$LocalDb, $AccountGroupsTable, AccountGroup>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$AccountGroupsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $AccountGroupsTable,
      AccountGroup,
      $$AccountGroupsTableFilterComposer,
      $$AccountGroupsTableOrderingComposer,
      $$AccountGroupsTableAnnotationComposer,
      $$AccountGroupsTableCreateCompanionBuilder,
      $$AccountGroupsTableUpdateCompanionBuilder,
      (
        AccountGroup,
        BaseReferences<_$LocalDb, $AccountGroupsTable, AccountGroup>,
      ),
      AccountGroup,
      PrefetchHooks Function()
    >;
typedef $$AccountsTableCreateCompanionBuilder = AccountsCompanion Function({
  required String id,
  required String companyId,
  required String groupId,
  Value<String?> key,
  required String name,
  Value<String?> nameHi,
  Value<String> openingBalance,
  Value<String?> gstin,
  Value<String?> stateCode,
  Value<String?> phone,
  Value<bool> archived,
  Value<bool> system,
  Value<int> rowid,
});
typedef $$AccountsTableUpdateCompanionBuilder = AccountsCompanion Function({
  Value<String> id,
  Value<String> companyId,
  Value<String> groupId,
  Value<String?> key,
  Value<String> name,
  Value<String?> nameHi,
  Value<String> openingBalance,
  Value<String?> gstin,
  Value<String?> stateCode,
  Value<String?> phone,
  Value<bool> archived,
  Value<bool> system,
  Value<int> rowid,
});

class $$AccountsTableFilterComposer
    extends Composer<_$LocalDb, $AccountsTable> {
  $$AccountsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get groupId => $composableBuilder(
    column: $table.groupId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get key => $composableBuilder(
    column: $table.key,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get openingBalance => $composableBuilder(
    column: $table.openingBalance,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get gstin => $composableBuilder(
    column: $table.gstin,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get stateCode => $composableBuilder(
    column: $table.stateCode,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get phone => $composableBuilder(
    column: $table.phone,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get system => $composableBuilder(
    column: $table.system,
    builder: (column) => ColumnFilters(column),
  );
}

class $$AccountsTableOrderingComposer
    extends Composer<_$LocalDb, $AccountsTable> {
  $$AccountsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get groupId => $composableBuilder(
    column: $table.groupId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get key => $composableBuilder(
    column: $table.key,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get openingBalance => $composableBuilder(
    column: $table.openingBalance,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get gstin => $composableBuilder(
    column: $table.gstin,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get stateCode => $composableBuilder(
    column: $table.stateCode,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get phone => $composableBuilder(
    column: $table.phone,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get system => $composableBuilder(
    column: $table.system,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$AccountsTableAnnotationComposer
    extends Composer<_$LocalDb, $AccountsTable> {
  $$AccountsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get companyId =>
      $composableBuilder(column: $table.companyId, builder: (column) => column);

  GeneratedColumn<String> get groupId =>
      $composableBuilder(column: $table.groupId, builder: (column) => column);

  GeneratedColumn<String> get key =>
      $composableBuilder(column: $table.key, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get nameHi =>
      $composableBuilder(column: $table.nameHi, builder: (column) => column);

  GeneratedColumn<String> get openingBalance => $composableBuilder(
    column: $table.openingBalance,
    builder: (column) => column,
  );

  GeneratedColumn<String> get gstin =>
      $composableBuilder(column: $table.gstin, builder: (column) => column);

  GeneratedColumn<String> get stateCode =>
      $composableBuilder(column: $table.stateCode, builder: (column) => column);

  GeneratedColumn<String> get phone =>
      $composableBuilder(column: $table.phone, builder: (column) => column);

  GeneratedColumn<bool> get archived =>
      $composableBuilder(column: $table.archived, builder: (column) => column);

  GeneratedColumn<bool> get system =>
      $composableBuilder(column: $table.system, builder: (column) => column);
}

class $$AccountsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $AccountsTable,
          Account,
          $$AccountsTableFilterComposer,
          $$AccountsTableOrderingComposer,
          $$AccountsTableAnnotationComposer,
          $$AccountsTableCreateCompanionBuilder,
          $$AccountsTableUpdateCompanionBuilder,
          (Account, BaseReferences<_$LocalDb, $AccountsTable, Account>),
          Account,
          PrefetchHooks Function()
        > {
  $$AccountsTableTableManager(_$LocalDb db, $AccountsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AccountsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AccountsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AccountsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> companyId = const Value.absent(),
                Value<String> groupId = const Value.absent(),
                Value<String?> key = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> nameHi = const Value.absent(),
                Value<String> openingBalance = const Value.absent(),
                Value<String?> gstin = const Value.absent(),
                Value<String?> stateCode = const Value.absent(),
                Value<String?> phone = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<bool> system = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AccountsCompanion(
                id: id,
                companyId: companyId,
                groupId: groupId,
                key: key,
                name: name,
                nameHi: nameHi,
                openingBalance: openingBalance,
                gstin: gstin,
                stateCode: stateCode,
                phone: phone,
                archived: archived,
                system: system,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String companyId,
                required String groupId,
                Value<String?> key = const Value.absent(),
                required String name,
                Value<String?> nameHi = const Value.absent(),
                Value<String> openingBalance = const Value.absent(),
                Value<String?> gstin = const Value.absent(),
                Value<String?> stateCode = const Value.absent(),
                Value<String?> phone = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<bool> system = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AccountsCompanion.insert(
                id: id,
                companyId: companyId,
                groupId: groupId,
                key: key,
                name: name,
                nameHi: nameHi,
                openingBalance: openingBalance,
                gstin: gstin,
                stateCode: stateCode,
                phone: phone,
                archived: archived,
                system: system,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$AccountsTable, Account>(table),
                  BaseReferences<_$LocalDb, $AccountsTable, Account>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$AccountsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $AccountsTable,
      Account,
      $$AccountsTableFilterComposer,
      $$AccountsTableOrderingComposer,
      $$AccountsTableAnnotationComposer,
      $$AccountsTableCreateCompanionBuilder,
      $$AccountsTableUpdateCompanionBuilder,
      (Account, BaseReferences<_$LocalDb, $AccountsTable, Account>),
      Account,
      PrefetchHooks Function()
    >;
typedef $$VouchersTableCreateCompanionBuilder = VouchersCompanion Function({
  required String id,
  required String companyId,
  required String type,
  required String number,
  required String date,
  Value<String?> narration,
  Value<String?> reference,
  required String total,
  Value<String> status,
  Value<String> syncState,
  Value<String?> syncError,
  Value<int> rowid,
});
typedef $$VouchersTableUpdateCompanionBuilder = VouchersCompanion Function({
  Value<String> id,
  Value<String> companyId,
  Value<String> type,
  Value<String> number,
  Value<String> date,
  Value<String?> narration,
  Value<String?> reference,
  Value<String> total,
  Value<String> status,
  Value<String> syncState,
  Value<String?> syncError,
  Value<int> rowid,
});

class $$VouchersTableFilterComposer
    extends Composer<_$LocalDb, $VouchersTable> {
  $$VouchersTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get number => $composableBuilder(
    column: $table.number,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get narration => $composableBuilder(
    column: $table.narration,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get reference => $composableBuilder(
    column: $table.reference,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get total => $composableBuilder(
    column: $table.total,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnFilters(column),
  );
}

class $$VouchersTableOrderingComposer
    extends Composer<_$LocalDb, $VouchersTable> {
  $$VouchersTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get type => $composableBuilder(
    column: $table.type,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get number => $composableBuilder(
    column: $table.number,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get narration => $composableBuilder(
    column: $table.narration,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get reference => $composableBuilder(
    column: $table.reference,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get total => $composableBuilder(
    column: $table.total,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$VouchersTableAnnotationComposer
    extends Composer<_$LocalDb, $VouchersTable> {
  $$VouchersTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get companyId =>
      $composableBuilder(column: $table.companyId, builder: (column) => column);

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get number =>
      $composableBuilder(column: $table.number, builder: (column) => column);

  GeneratedColumn<String> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get narration =>
      $composableBuilder(column: $table.narration, builder: (column) => column);

  GeneratedColumn<String> get reference =>
      $composableBuilder(column: $table.reference, builder: (column) => column);

  GeneratedColumn<String> get total =>
      $composableBuilder(column: $table.total, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<String> get syncState =>
      $composableBuilder(column: $table.syncState, builder: (column) => column);

  GeneratedColumn<String> get syncError =>
      $composableBuilder(column: $table.syncError, builder: (column) => column);
}

class $$VouchersTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $VouchersTable,
          Voucher,
          $$VouchersTableFilterComposer,
          $$VouchersTableOrderingComposer,
          $$VouchersTableAnnotationComposer,
          $$VouchersTableCreateCompanionBuilder,
          $$VouchersTableUpdateCompanionBuilder,
          (Voucher, BaseReferences<_$LocalDb, $VouchersTable, Voucher>),
          Voucher,
          PrefetchHooks Function()
        > {
  $$VouchersTableTableManager(_$LocalDb db, $VouchersTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$VouchersTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$VouchersTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$VouchersTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> companyId = const Value.absent(),
                Value<String> type = const Value.absent(),
                Value<String> number = const Value.absent(),
                Value<String> date = const Value.absent(),
                Value<String?> narration = const Value.absent(),
                Value<String?> reference = const Value.absent(),
                Value<String> total = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => VouchersCompanion(
                id: id,
                companyId: companyId,
                type: type,
                number: number,
                date: date,
                narration: narration,
                reference: reference,
                total: total,
                status: status,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String companyId,
                required String type,
                required String number,
                required String date,
                Value<String?> narration = const Value.absent(),
                Value<String?> reference = const Value.absent(),
                required String total,
                Value<String> status = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => VouchersCompanion.insert(
                id: id,
                companyId: companyId,
                type: type,
                number: number,
                date: date,
                narration: narration,
                reference: reference,
                total: total,
                status: status,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$VouchersTable, Voucher>(table),
                  BaseReferences<_$LocalDb, $VouchersTable, Voucher>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$VouchersTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $VouchersTable,
      Voucher,
      $$VouchersTableFilterComposer,
      $$VouchersTableOrderingComposer,
      $$VouchersTableAnnotationComposer,
      $$VouchersTableCreateCompanionBuilder,
      $$VouchersTableUpdateCompanionBuilder,
      (Voucher, BaseReferences<_$LocalDb, $VouchersTable, Voucher>),
      Voucher,
      PrefetchHooks Function()
    >;
typedef $$VoucherLinesTableCreateCompanionBuilder =
    VoucherLinesCompanion Function({
      required String voucherId,
      required int lineNo,
      required String accountId,
      Value<String> debit,
      Value<String> credit,
      Value<int> rowid,
    });
typedef $$VoucherLinesTableUpdateCompanionBuilder =
    VoucherLinesCompanion Function({
      Value<String> voucherId,
      Value<int> lineNo,
      Value<String> accountId,
      Value<String> debit,
      Value<String> credit,
      Value<int> rowid,
    });

class $$VoucherLinesTableFilterComposer
    extends Composer<_$LocalDb, $VoucherLinesTable> {
  $$VoucherLinesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get voucherId => $composableBuilder(
    column: $table.voucherId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get lineNo => $composableBuilder(
    column: $table.lineNo,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get accountId => $composableBuilder(
    column: $table.accountId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get debit => $composableBuilder(
    column: $table.debit,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get credit => $composableBuilder(
    column: $table.credit,
    builder: (column) => ColumnFilters(column),
  );
}

class $$VoucherLinesTableOrderingComposer
    extends Composer<_$LocalDb, $VoucherLinesTable> {
  $$VoucherLinesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get voucherId => $composableBuilder(
    column: $table.voucherId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get lineNo => $composableBuilder(
    column: $table.lineNo,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get accountId => $composableBuilder(
    column: $table.accountId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get debit => $composableBuilder(
    column: $table.debit,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get credit => $composableBuilder(
    column: $table.credit,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$VoucherLinesTableAnnotationComposer
    extends Composer<_$LocalDb, $VoucherLinesTable> {
  $$VoucherLinesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get voucherId =>
      $composableBuilder(column: $table.voucherId, builder: (column) => column);

  GeneratedColumn<int> get lineNo =>
      $composableBuilder(column: $table.lineNo, builder: (column) => column);

  GeneratedColumn<String> get accountId =>
      $composableBuilder(column: $table.accountId, builder: (column) => column);

  GeneratedColumn<String> get debit =>
      $composableBuilder(column: $table.debit, builder: (column) => column);

  GeneratedColumn<String> get credit =>
      $composableBuilder(column: $table.credit, builder: (column) => column);
}

class $$VoucherLinesTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $VoucherLinesTable,
          VoucherLineRow,
          $$VoucherLinesTableFilterComposer,
          $$VoucherLinesTableOrderingComposer,
          $$VoucherLinesTableAnnotationComposer,
          $$VoucherLinesTableCreateCompanionBuilder,
          $$VoucherLinesTableUpdateCompanionBuilder,
          (
            VoucherLineRow,
            BaseReferences<_$LocalDb, $VoucherLinesTable, VoucherLineRow>,
          ),
          VoucherLineRow,
          PrefetchHooks Function()
        > {
  $$VoucherLinesTableTableManager(_$LocalDb db, $VoucherLinesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$VoucherLinesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$VoucherLinesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$VoucherLinesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> voucherId = const Value.absent(),
                Value<int> lineNo = const Value.absent(),
                Value<String> accountId = const Value.absent(),
                Value<String> debit = const Value.absent(),
                Value<String> credit = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => VoucherLinesCompanion(
                voucherId: voucherId,
                lineNo: lineNo,
                accountId: accountId,
                debit: debit,
                credit: credit,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String voucherId,
                required int lineNo,
                required String accountId,
                Value<String> debit = const Value.absent(),
                Value<String> credit = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => VoucherLinesCompanion.insert(
                voucherId: voucherId,
                lineNo: lineNo,
                accountId: accountId,
                debit: debit,
                credit: credit,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$VoucherLinesTable, VoucherLineRow>(table),
                  BaseReferences<_$LocalDb, $VoucherLinesTable, VoucherLineRow>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$VoucherLinesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $VoucherLinesTable,
      VoucherLineRow,
      $$VoucherLinesTableFilterComposer,
      $$VoucherLinesTableOrderingComposer,
      $$VoucherLinesTableAnnotationComposer,
      $$VoucherLinesTableCreateCompanionBuilder,
      $$VoucherLinesTableUpdateCompanionBuilder,
      (
        VoucherLineRow,
        BaseReferences<_$LocalDb, $VoucherLinesTable, VoucherLineRow>,
      ),
      VoucherLineRow,
      PrefetchHooks Function()
    >;
typedef $$DeviceSeriesTableCreateCompanionBuilder =
    DeviceSeriesCompanion Function({
      required String docType,
      required String fyLabel,
      required String pattern,
      Value<int> nextSeq,
      Value<int> rowid,
    });
typedef $$DeviceSeriesTableUpdateCompanionBuilder =
    DeviceSeriesCompanion Function({
      Value<String> docType,
      Value<String> fyLabel,
      Value<String> pattern,
      Value<int> nextSeq,
      Value<int> rowid,
    });

class $$DeviceSeriesTableFilterComposer
    extends Composer<_$LocalDb, $DeviceSeriesTable> {
  $$DeviceSeriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get docType => $composableBuilder(
    column: $table.docType,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get fyLabel => $composableBuilder(
    column: $table.fyLabel,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get pattern => $composableBuilder(
    column: $table.pattern,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get nextSeq => $composableBuilder(
    column: $table.nextSeq,
    builder: (column) => ColumnFilters(column),
  );
}

class $$DeviceSeriesTableOrderingComposer
    extends Composer<_$LocalDb, $DeviceSeriesTable> {
  $$DeviceSeriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get docType => $composableBuilder(
    column: $table.docType,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get fyLabel => $composableBuilder(
    column: $table.fyLabel,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get pattern => $composableBuilder(
    column: $table.pattern,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get nextSeq => $composableBuilder(
    column: $table.nextSeq,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$DeviceSeriesTableAnnotationComposer
    extends Composer<_$LocalDb, $DeviceSeriesTable> {
  $$DeviceSeriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get docType =>
      $composableBuilder(column: $table.docType, builder: (column) => column);

  GeneratedColumn<String> get fyLabel =>
      $composableBuilder(column: $table.fyLabel, builder: (column) => column);

  GeneratedColumn<String> get pattern =>
      $composableBuilder(column: $table.pattern, builder: (column) => column);

  GeneratedColumn<int> get nextSeq =>
      $composableBuilder(column: $table.nextSeq, builder: (column) => column);
}

class $$DeviceSeriesTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $DeviceSeriesTable,
          DeviceSery,
          $$DeviceSeriesTableFilterComposer,
          $$DeviceSeriesTableOrderingComposer,
          $$DeviceSeriesTableAnnotationComposer,
          $$DeviceSeriesTableCreateCompanionBuilder,
          $$DeviceSeriesTableUpdateCompanionBuilder,
          (
            DeviceSery,
            BaseReferences<_$LocalDb, $DeviceSeriesTable, DeviceSery>,
          ),
          DeviceSery,
          PrefetchHooks Function()
        > {
  $$DeviceSeriesTableTableManager(_$LocalDb db, $DeviceSeriesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DeviceSeriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DeviceSeriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DeviceSeriesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> docType = const Value.absent(),
                Value<String> fyLabel = const Value.absent(),
                Value<String> pattern = const Value.absent(),
                Value<int> nextSeq = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DeviceSeriesCompanion(
                docType: docType,
                fyLabel: fyLabel,
                pattern: pattern,
                nextSeq: nextSeq,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String docType,
                required String fyLabel,
                required String pattern,
                Value<int> nextSeq = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => DeviceSeriesCompanion.insert(
                docType: docType,
                fyLabel: fyLabel,
                pattern: pattern,
                nextSeq: nextSeq,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$DeviceSeriesTable, DeviceSery>(table),
                  BaseReferences<_$LocalDb, $DeviceSeriesTable, DeviceSery>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$DeviceSeriesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $DeviceSeriesTable,
      DeviceSery,
      $$DeviceSeriesTableFilterComposer,
      $$DeviceSeriesTableOrderingComposer,
      $$DeviceSeriesTableAnnotationComposer,
      $$DeviceSeriesTableCreateCompanionBuilder,
      $$DeviceSeriesTableUpdateCompanionBuilder,
      (DeviceSery, BaseReferences<_$LocalDb, $DeviceSeriesTable, DeviceSery>),
      DeviceSery,
      PrefetchHooks Function()
    >;
typedef $$OutboxTableCreateCompanionBuilder = OutboxCompanion Function({
  Value<int> seq,
  required String opId,
  required String kind,
  required String payload,
  Value<String> state,
  Value<String?> error,
});
typedef $$OutboxTableUpdateCompanionBuilder = OutboxCompanion Function({
  Value<int> seq,
  Value<String> opId,
  Value<String> kind,
  Value<String> payload,
  Value<String> state,
  Value<String?> error,
});

class $$OutboxTableFilterComposer extends Composer<_$LocalDb, $OutboxTable> {
  $$OutboxTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get seq => $composableBuilder(
    column: $table.seq,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get opId => $composableBuilder(
    column: $table.opId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get kind => $composableBuilder(
    column: $table.kind,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get payload => $composableBuilder(
    column: $table.payload,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get state => $composableBuilder(
    column: $table.state,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get error => $composableBuilder(
    column: $table.error,
    builder: (column) => ColumnFilters(column),
  );
}

class $$OutboxTableOrderingComposer extends Composer<_$LocalDb, $OutboxTable> {
  $$OutboxTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get seq => $composableBuilder(
    column: $table.seq,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get opId => $composableBuilder(
    column: $table.opId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get kind => $composableBuilder(
    column: $table.kind,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get payload => $composableBuilder(
    column: $table.payload,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get state => $composableBuilder(
    column: $table.state,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get error => $composableBuilder(
    column: $table.error,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$OutboxTableAnnotationComposer
    extends Composer<_$LocalDb, $OutboxTable> {
  $$OutboxTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get seq =>
      $composableBuilder(column: $table.seq, builder: (column) => column);

  GeneratedColumn<String> get opId =>
      $composableBuilder(column: $table.opId, builder: (column) => column);

  GeneratedColumn<String> get kind =>
      $composableBuilder(column: $table.kind, builder: (column) => column);

  GeneratedColumn<String> get payload =>
      $composableBuilder(column: $table.payload, builder: (column) => column);

  GeneratedColumn<String> get state =>
      $composableBuilder(column: $table.state, builder: (column) => column);

  GeneratedColumn<String> get error =>
      $composableBuilder(column: $table.error, builder: (column) => column);
}

class $$OutboxTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $OutboxTable,
          OutboxData,
          $$OutboxTableFilterComposer,
          $$OutboxTableOrderingComposer,
          $$OutboxTableAnnotationComposer,
          $$OutboxTableCreateCompanionBuilder,
          $$OutboxTableUpdateCompanionBuilder,
          (OutboxData, BaseReferences<_$LocalDb, $OutboxTable, OutboxData>),
          OutboxData,
          PrefetchHooks Function()
        > {
  $$OutboxTableTableManager(_$LocalDb db, $OutboxTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$OutboxTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$OutboxTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$OutboxTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> seq = const Value.absent(),
                Value<String> opId = const Value.absent(),
                Value<String> kind = const Value.absent(),
                Value<String> payload = const Value.absent(),
                Value<String> state = const Value.absent(),
                Value<String?> error = const Value.absent(),
              }) => OutboxCompanion(
                seq: seq,
                opId: opId,
                kind: kind,
                payload: payload,
                state: state,
                error: error,
              ),
          createCompanionCallback:
              ({
                Value<int> seq = const Value.absent(),
                required String opId,
                required String kind,
                required String payload,
                Value<String> state = const Value.absent(),
                Value<String?> error = const Value.absent(),
              }) => OutboxCompanion.insert(
                seq: seq,
                opId: opId,
                kind: kind,
                payload: payload,
                state: state,
                error: error,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$OutboxTable, OutboxData>(table),
                  BaseReferences<_$LocalDb, $OutboxTable, OutboxData>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$OutboxTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $OutboxTable,
      OutboxData,
      $$OutboxTableFilterComposer,
      $$OutboxTableOrderingComposer,
      $$OutboxTableAnnotationComposer,
      $$OutboxTableCreateCompanionBuilder,
      $$OutboxTableUpdateCompanionBuilder,
      (OutboxData, BaseReferences<_$LocalDb, $OutboxTable, OutboxData>),
      OutboxData,
      PrefetchHooks Function()
    >;
typedef $$EmployeesTableCreateCompanionBuilder = EmployeesCompanion Function({
  required String id,
  required String companyId,
  required String code,
  required String name,
  Value<String?> nameHi,
  Value<String?> designation,
  Value<String?> department,
  required String joinedOn,
  Value<String?> leftOn,
  required String status,
  Value<String?> phone,
  Value<int> rowid,
});
typedef $$EmployeesTableUpdateCompanionBuilder = EmployeesCompanion Function({
  Value<String> id,
  Value<String> companyId,
  Value<String> code,
  Value<String> name,
  Value<String?> nameHi,
  Value<String?> designation,
  Value<String?> department,
  Value<String> joinedOn,
  Value<String?> leftOn,
  Value<String> status,
  Value<String?> phone,
  Value<int> rowid,
});

class $$EmployeesTableFilterComposer
    extends Composer<_$LocalDb, $EmployeesTable> {
  $$EmployeesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get code => $composableBuilder(
    column: $table.code,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get designation => $composableBuilder(
    column: $table.designation,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get department => $composableBuilder(
    column: $table.department,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get joinedOn => $composableBuilder(
    column: $table.joinedOn,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get leftOn => $composableBuilder(
    column: $table.leftOn,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get phone => $composableBuilder(
    column: $table.phone,
    builder: (column) => ColumnFilters(column),
  );
}

class $$EmployeesTableOrderingComposer
    extends Composer<_$LocalDb, $EmployeesTable> {
  $$EmployeesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get companyId => $composableBuilder(
    column: $table.companyId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get code => $composableBuilder(
    column: $table.code,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get designation => $composableBuilder(
    column: $table.designation,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get department => $composableBuilder(
    column: $table.department,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get joinedOn => $composableBuilder(
    column: $table.joinedOn,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get leftOn => $composableBuilder(
    column: $table.leftOn,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get phone => $composableBuilder(
    column: $table.phone,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$EmployeesTableAnnotationComposer
    extends Composer<_$LocalDb, $EmployeesTable> {
  $$EmployeesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get companyId =>
      $composableBuilder(column: $table.companyId, builder: (column) => column);

  GeneratedColumn<String> get code =>
      $composableBuilder(column: $table.code, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get nameHi =>
      $composableBuilder(column: $table.nameHi, builder: (column) => column);

  GeneratedColumn<String> get designation => $composableBuilder(
    column: $table.designation,
    builder: (column) => column,
  );

  GeneratedColumn<String> get department => $composableBuilder(
    column: $table.department,
    builder: (column) => column,
  );

  GeneratedColumn<String> get joinedOn =>
      $composableBuilder(column: $table.joinedOn, builder: (column) => column);

  GeneratedColumn<String> get leftOn =>
      $composableBuilder(column: $table.leftOn, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<String> get phone =>
      $composableBuilder(column: $table.phone, builder: (column) => column);
}

class $$EmployeesTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $EmployeesTable,
          Employee,
          $$EmployeesTableFilterComposer,
          $$EmployeesTableOrderingComposer,
          $$EmployeesTableAnnotationComposer,
          $$EmployeesTableCreateCompanionBuilder,
          $$EmployeesTableUpdateCompanionBuilder,
          (Employee, BaseReferences<_$LocalDb, $EmployeesTable, Employee>),
          Employee,
          PrefetchHooks Function()
        > {
  $$EmployeesTableTableManager(_$LocalDb db, $EmployeesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$EmployeesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$EmployeesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$EmployeesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> companyId = const Value.absent(),
                Value<String> code = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> nameHi = const Value.absent(),
                Value<String?> designation = const Value.absent(),
                Value<String?> department = const Value.absent(),
                Value<String> joinedOn = const Value.absent(),
                Value<String?> leftOn = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<String?> phone = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EmployeesCompanion(
                id: id,
                companyId: companyId,
                code: code,
                name: name,
                nameHi: nameHi,
                designation: designation,
                department: department,
                joinedOn: joinedOn,
                leftOn: leftOn,
                status: status,
                phone: phone,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String companyId,
                required String code,
                required String name,
                Value<String?> nameHi = const Value.absent(),
                Value<String?> designation = const Value.absent(),
                Value<String?> department = const Value.absent(),
                required String joinedOn,
                Value<String?> leftOn = const Value.absent(),
                required String status,
                Value<String?> phone = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => EmployeesCompanion.insert(
                id: id,
                companyId: companyId,
                code: code,
                name: name,
                nameHi: nameHi,
                designation: designation,
                department: department,
                joinedOn: joinedOn,
                leftOn: leftOn,
                status: status,
                phone: phone,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$EmployeesTable, Employee>(table),
                  BaseReferences<_$LocalDb, $EmployeesTable, Employee>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$EmployeesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $EmployeesTable,
      Employee,
      $$EmployeesTableFilterComposer,
      $$EmployeesTableOrderingComposer,
      $$EmployeesTableAnnotationComposer,
      $$EmployeesTableCreateCompanionBuilder,
      $$EmployeesTableUpdateCompanionBuilder,
      (Employee, BaseReferences<_$LocalDb, $EmployeesTable, Employee>),
      Employee,
      PrefetchHooks Function()
    >;
typedef $$LeaveTypesTableCreateCompanionBuilder = LeaveTypesCompanion Function({
  required String id,
  required String code,
  required String name,
  Value<String?> nameHi,
  Value<bool> paid,
  Value<bool> archived,
  Value<int> rowid,
});
typedef $$LeaveTypesTableUpdateCompanionBuilder = LeaveTypesCompanion Function({
  Value<String> id,
  Value<String> code,
  Value<String> name,
  Value<String?> nameHi,
  Value<bool> paid,
  Value<bool> archived,
  Value<int> rowid,
});

class $$LeaveTypesTableFilterComposer
    extends Composer<_$LocalDb, $LeaveTypesTable> {
  $$LeaveTypesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get code => $composableBuilder(
    column: $table.code,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get paid => $composableBuilder(
    column: $table.paid,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LeaveTypesTableOrderingComposer
    extends Composer<_$LocalDb, $LeaveTypesTable> {
  $$LeaveTypesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get code => $composableBuilder(
    column: $table.code,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get paid => $composableBuilder(
    column: $table.paid,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LeaveTypesTableAnnotationComposer
    extends Composer<_$LocalDb, $LeaveTypesTable> {
  $$LeaveTypesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get code =>
      $composableBuilder(column: $table.code, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get nameHi =>
      $composableBuilder(column: $table.nameHi, builder: (column) => column);

  GeneratedColumn<bool> get paid =>
      $composableBuilder(column: $table.paid, builder: (column) => column);

  GeneratedColumn<bool> get archived =>
      $composableBuilder(column: $table.archived, builder: (column) => column);
}

class $$LeaveTypesTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $LeaveTypesTable,
          LeaveType,
          $$LeaveTypesTableFilterComposer,
          $$LeaveTypesTableOrderingComposer,
          $$LeaveTypesTableAnnotationComposer,
          $$LeaveTypesTableCreateCompanionBuilder,
          $$LeaveTypesTableUpdateCompanionBuilder,
          (LeaveType, BaseReferences<_$LocalDb, $LeaveTypesTable, LeaveType>),
          LeaveType,
          PrefetchHooks Function()
        > {
  $$LeaveTypesTableTableManager(_$LocalDb db, $LeaveTypesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LeaveTypesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LeaveTypesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LeaveTypesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> code = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> nameHi = const Value.absent(),
                Value<bool> paid = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LeaveTypesCompanion(
                id: id,
                code: code,
                name: name,
                nameHi: nameHi,
                paid: paid,
                archived: archived,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String code,
                required String name,
                Value<String?> nameHi = const Value.absent(),
                Value<bool> paid = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LeaveTypesCompanion.insert(
                id: id,
                code: code,
                name: name,
                nameHi: nameHi,
                paid: paid,
                archived: archived,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$LeaveTypesTable, LeaveType>(table),
                  BaseReferences<_$LocalDb, $LeaveTypesTable, LeaveType>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LeaveTypesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $LeaveTypesTable,
      LeaveType,
      $$LeaveTypesTableFilterComposer,
      $$LeaveTypesTableOrderingComposer,
      $$LeaveTypesTableAnnotationComposer,
      $$LeaveTypesTableCreateCompanionBuilder,
      $$LeaveTypesTableUpdateCompanionBuilder,
      (LeaveType, BaseReferences<_$LocalDb, $LeaveTypesTable, LeaveType>),
      LeaveType,
      PrefetchHooks Function()
    >;
typedef $$LeaveRequestsTableCreateCompanionBuilder =
    LeaveRequestsCompanion Function({
      required String id,
      required String employeeId,
      required String leaveTypeId,
      required String fromDate,
      required String toDate,
      Value<bool> halfDay,
      Value<String?> days,
      Value<String?> reason,
      Value<String> status,
      Value<String> syncState,
      Value<String?> syncError,
      Value<int> rowid,
    });
typedef $$LeaveRequestsTableUpdateCompanionBuilder =
    LeaveRequestsCompanion Function({
      Value<String> id,
      Value<String> employeeId,
      Value<String> leaveTypeId,
      Value<String> fromDate,
      Value<String> toDate,
      Value<bool> halfDay,
      Value<String?> days,
      Value<String?> reason,
      Value<String> status,
      Value<String> syncState,
      Value<String?> syncError,
      Value<int> rowid,
    });

class $$LeaveRequestsTableFilterComposer
    extends Composer<_$LocalDb, $LeaveRequestsTable> {
  $$LeaveRequestsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get leaveTypeId => $composableBuilder(
    column: $table.leaveTypeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get fromDate => $composableBuilder(
    column: $table.fromDate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get toDate => $composableBuilder(
    column: $table.toDate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get halfDay => $composableBuilder(
    column: $table.halfDay,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get days => $composableBuilder(
    column: $table.days,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get reason => $composableBuilder(
    column: $table.reason,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LeaveRequestsTableOrderingComposer
    extends Composer<_$LocalDb, $LeaveRequestsTable> {
  $$LeaveRequestsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get leaveTypeId => $composableBuilder(
    column: $table.leaveTypeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get fromDate => $composableBuilder(
    column: $table.fromDate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get toDate => $composableBuilder(
    column: $table.toDate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get halfDay => $composableBuilder(
    column: $table.halfDay,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get days => $composableBuilder(
    column: $table.days,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get reason => $composableBuilder(
    column: $table.reason,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LeaveRequestsTableAnnotationComposer
    extends Composer<_$LocalDb, $LeaveRequestsTable> {
  $$LeaveRequestsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get leaveTypeId => $composableBuilder(
    column: $table.leaveTypeId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get fromDate =>
      $composableBuilder(column: $table.fromDate, builder: (column) => column);

  GeneratedColumn<String> get toDate =>
      $composableBuilder(column: $table.toDate, builder: (column) => column);

  GeneratedColumn<bool> get halfDay =>
      $composableBuilder(column: $table.halfDay, builder: (column) => column);

  GeneratedColumn<String> get days =>
      $composableBuilder(column: $table.days, builder: (column) => column);

  GeneratedColumn<String> get reason =>
      $composableBuilder(column: $table.reason, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<String> get syncState =>
      $composableBuilder(column: $table.syncState, builder: (column) => column);

  GeneratedColumn<String> get syncError =>
      $composableBuilder(column: $table.syncError, builder: (column) => column);
}

class $$LeaveRequestsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $LeaveRequestsTable,
          LeaveRequest,
          $$LeaveRequestsTableFilterComposer,
          $$LeaveRequestsTableOrderingComposer,
          $$LeaveRequestsTableAnnotationComposer,
          $$LeaveRequestsTableCreateCompanionBuilder,
          $$LeaveRequestsTableUpdateCompanionBuilder,
          (
            LeaveRequest,
            BaseReferences<_$LocalDb, $LeaveRequestsTable, LeaveRequest>,
          ),
          LeaveRequest,
          PrefetchHooks Function()
        > {
  $$LeaveRequestsTableTableManager(_$LocalDb db, $LeaveRequestsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LeaveRequestsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LeaveRequestsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LeaveRequestsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> employeeId = const Value.absent(),
                Value<String> leaveTypeId = const Value.absent(),
                Value<String> fromDate = const Value.absent(),
                Value<String> toDate = const Value.absent(),
                Value<bool> halfDay = const Value.absent(),
                Value<String?> days = const Value.absent(),
                Value<String?> reason = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LeaveRequestsCompanion(
                id: id,
                employeeId: employeeId,
                leaveTypeId: leaveTypeId,
                fromDate: fromDate,
                toDate: toDate,
                halfDay: halfDay,
                days: days,
                reason: reason,
                status: status,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String employeeId,
                required String leaveTypeId,
                required String fromDate,
                required String toDate,
                Value<bool> halfDay = const Value.absent(),
                Value<String?> days = const Value.absent(),
                Value<String?> reason = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LeaveRequestsCompanion.insert(
                id: id,
                employeeId: employeeId,
                leaveTypeId: leaveTypeId,
                fromDate: fromDate,
                toDate: toDate,
                halfDay: halfDay,
                days: days,
                reason: reason,
                status: status,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$LeaveRequestsTable, LeaveRequest>(table),
                  BaseReferences<_$LocalDb, $LeaveRequestsTable, LeaveRequest>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LeaveRequestsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $LeaveRequestsTable,
      LeaveRequest,
      $$LeaveRequestsTableFilterComposer,
      $$LeaveRequestsTableOrderingComposer,
      $$LeaveRequestsTableAnnotationComposer,
      $$LeaveRequestsTableCreateCompanionBuilder,
      $$LeaveRequestsTableUpdateCompanionBuilder,
      (
        LeaveRequest,
        BaseReferences<_$LocalDb, $LeaveRequestsTable, LeaveRequest>,
      ),
      LeaveRequest,
      PrefetchHooks Function()
    >;
typedef $$AttendanceDaysTableCreateCompanionBuilder =
    AttendanceDaysCompanion Function({
      required String employeeId,
      required String date,
      required String status,
      Value<String?> leaveCode,
      Value<String?> inTime,
      Value<String?> outTime,
      Value<bool> late,
      Value<String> syncState,
      Value<String?> syncError,
      Value<int> rowid,
    });
typedef $$AttendanceDaysTableUpdateCompanionBuilder =
    AttendanceDaysCompanion Function({
      Value<String> employeeId,
      Value<String> date,
      Value<String> status,
      Value<String?> leaveCode,
      Value<String?> inTime,
      Value<String?> outTime,
      Value<bool> late,
      Value<String> syncState,
      Value<String?> syncError,
      Value<int> rowid,
    });

class $$AttendanceDaysTableFilterComposer
    extends Composer<_$LocalDb, $AttendanceDaysTable> {
  $$AttendanceDaysTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get leaveCode => $composableBuilder(
    column: $table.leaveCode,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get inTime => $composableBuilder(
    column: $table.inTime,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get outTime => $composableBuilder(
    column: $table.outTime,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get late => $composableBuilder(
    column: $table.late,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnFilters(column),
  );
}

class $$AttendanceDaysTableOrderingComposer
    extends Composer<_$LocalDb, $AttendanceDaysTable> {
  $$AttendanceDaysTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get status => $composableBuilder(
    column: $table.status,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get leaveCode => $composableBuilder(
    column: $table.leaveCode,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get inTime => $composableBuilder(
    column: $table.inTime,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get outTime => $composableBuilder(
    column: $table.outTime,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get late => $composableBuilder(
    column: $table.late,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$AttendanceDaysTableAnnotationComposer
    extends Composer<_$LocalDb, $AttendanceDaysTable> {
  $$AttendanceDaysTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<String> get leaveCode =>
      $composableBuilder(column: $table.leaveCode, builder: (column) => column);

  GeneratedColumn<String> get inTime =>
      $composableBuilder(column: $table.inTime, builder: (column) => column);

  GeneratedColumn<String> get outTime =>
      $composableBuilder(column: $table.outTime, builder: (column) => column);

  GeneratedColumn<bool> get late =>
      $composableBuilder(column: $table.late, builder: (column) => column);

  GeneratedColumn<String> get syncState =>
      $composableBuilder(column: $table.syncState, builder: (column) => column);

  GeneratedColumn<String> get syncError =>
      $composableBuilder(column: $table.syncError, builder: (column) => column);
}

class $$AttendanceDaysTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $AttendanceDaysTable,
          AttendanceDay,
          $$AttendanceDaysTableFilterComposer,
          $$AttendanceDaysTableOrderingComposer,
          $$AttendanceDaysTableAnnotationComposer,
          $$AttendanceDaysTableCreateCompanionBuilder,
          $$AttendanceDaysTableUpdateCompanionBuilder,
          (
            AttendanceDay,
            BaseReferences<_$LocalDb, $AttendanceDaysTable, AttendanceDay>,
          ),
          AttendanceDay,
          PrefetchHooks Function()
        > {
  $$AttendanceDaysTableTableManager(_$LocalDb db, $AttendanceDaysTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AttendanceDaysTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AttendanceDaysTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AttendanceDaysTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> employeeId = const Value.absent(),
                Value<String> date = const Value.absent(),
                Value<String> status = const Value.absent(),
                Value<String?> leaveCode = const Value.absent(),
                Value<String?> inTime = const Value.absent(),
                Value<String?> outTime = const Value.absent(),
                Value<bool> late = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AttendanceDaysCompanion(
                employeeId: employeeId,
                date: date,
                status: status,
                leaveCode: leaveCode,
                inTime: inTime,
                outTime: outTime,
                late: late,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String employeeId,
                required String date,
                required String status,
                Value<String?> leaveCode = const Value.absent(),
                Value<String?> inTime = const Value.absent(),
                Value<String?> outTime = const Value.absent(),
                Value<bool> late = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => AttendanceDaysCompanion.insert(
                employeeId: employeeId,
                date: date,
                status: status,
                leaveCode: leaveCode,
                inTime: inTime,
                outTime: outTime,
                late: late,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$AttendanceDaysTable, AttendanceDay>(table),
                  BaseReferences<
                    _$LocalDb,
                    $AttendanceDaysTable,
                    AttendanceDay
                  >(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$AttendanceDaysTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $AttendanceDaysTable,
      AttendanceDay,
      $$AttendanceDaysTableFilterComposer,
      $$AttendanceDaysTableOrderingComposer,
      $$AttendanceDaysTableAnnotationComposer,
      $$AttendanceDaysTableCreateCompanionBuilder,
      $$AttendanceDaysTableUpdateCompanionBuilder,
      (
        AttendanceDay,
        BaseReferences<_$LocalDb, $AttendanceDaysTable, AttendanceDay>,
      ),
      AttendanceDay,
      PrefetchHooks Function()
    >;
typedef $$PayslipsTableCreateCompanionBuilder = PayslipsCompanion Function({
  required String id,
  required String runId,
  required String period,
  required String employeeId,
  required String paidDays,
  required String gross,
  required String totalDeductions,
  required String netPay,
  required String tds,
  required String detail,
  Value<int> rowid,
});
typedef $$PayslipsTableUpdateCompanionBuilder = PayslipsCompanion Function({
  Value<String> id,
  Value<String> runId,
  Value<String> period,
  Value<String> employeeId,
  Value<String> paidDays,
  Value<String> gross,
  Value<String> totalDeductions,
  Value<String> netPay,
  Value<String> tds,
  Value<String> detail,
  Value<int> rowid,
});

class $$PayslipsTableFilterComposer
    extends Composer<_$LocalDb, $PayslipsTable> {
  $$PayslipsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get runId => $composableBuilder(
    column: $table.runId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get period => $composableBuilder(
    column: $table.period,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get paidDays => $composableBuilder(
    column: $table.paidDays,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get gross => $composableBuilder(
    column: $table.gross,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get totalDeductions => $composableBuilder(
    column: $table.totalDeductions,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get netPay => $composableBuilder(
    column: $table.netPay,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get tds => $composableBuilder(
    column: $table.tds,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get detail => $composableBuilder(
    column: $table.detail,
    builder: (column) => ColumnFilters(column),
  );
}

class $$PayslipsTableOrderingComposer
    extends Composer<_$LocalDb, $PayslipsTable> {
  $$PayslipsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get runId => $composableBuilder(
    column: $table.runId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get period => $composableBuilder(
    column: $table.period,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get paidDays => $composableBuilder(
    column: $table.paidDays,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get gross => $composableBuilder(
    column: $table.gross,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get totalDeductions => $composableBuilder(
    column: $table.totalDeductions,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get netPay => $composableBuilder(
    column: $table.netPay,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get tds => $composableBuilder(
    column: $table.tds,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get detail => $composableBuilder(
    column: $table.detail,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$PayslipsTableAnnotationComposer
    extends Composer<_$LocalDb, $PayslipsTable> {
  $$PayslipsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get runId =>
      $composableBuilder(column: $table.runId, builder: (column) => column);

  GeneratedColumn<String> get period =>
      $composableBuilder(column: $table.period, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get paidDays =>
      $composableBuilder(column: $table.paidDays, builder: (column) => column);

  GeneratedColumn<String> get gross =>
      $composableBuilder(column: $table.gross, builder: (column) => column);

  GeneratedColumn<String> get totalDeductions => $composableBuilder(
    column: $table.totalDeductions,
    builder: (column) => column,
  );

  GeneratedColumn<String> get netPay =>
      $composableBuilder(column: $table.netPay, builder: (column) => column);

  GeneratedColumn<String> get tds =>
      $composableBuilder(column: $table.tds, builder: (column) => column);

  GeneratedColumn<String> get detail =>
      $composableBuilder(column: $table.detail, builder: (column) => column);
}

class $$PayslipsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $PayslipsTable,
          Payslip,
          $$PayslipsTableFilterComposer,
          $$PayslipsTableOrderingComposer,
          $$PayslipsTableAnnotationComposer,
          $$PayslipsTableCreateCompanionBuilder,
          $$PayslipsTableUpdateCompanionBuilder,
          (Payslip, BaseReferences<_$LocalDb, $PayslipsTable, Payslip>),
          Payslip,
          PrefetchHooks Function()
        > {
  $$PayslipsTableTableManager(_$LocalDb db, $PayslipsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PayslipsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PayslipsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PayslipsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> runId = const Value.absent(),
                Value<String> period = const Value.absent(),
                Value<String> employeeId = const Value.absent(),
                Value<String> paidDays = const Value.absent(),
                Value<String> gross = const Value.absent(),
                Value<String> totalDeductions = const Value.absent(),
                Value<String> netPay = const Value.absent(),
                Value<String> tds = const Value.absent(),
                Value<String> detail = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PayslipsCompanion(
                id: id,
                runId: runId,
                period: period,
                employeeId: employeeId,
                paidDays: paidDays,
                gross: gross,
                totalDeductions: totalDeductions,
                netPay: netPay,
                tds: tds,
                detail: detail,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String runId,
                required String period,
                required String employeeId,
                required String paidDays,
                required String gross,
                required String totalDeductions,
                required String netPay,
                required String tds,
                required String detail,
                Value<int> rowid = const Value.absent(),
              }) => PayslipsCompanion.insert(
                id: id,
                runId: runId,
                period: period,
                employeeId: employeeId,
                paidDays: paidDays,
                gross: gross,
                totalDeductions: totalDeductions,
                netPay: netPay,
                tds: tds,
                detail: detail,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$PayslipsTable, Payslip>(table),
                  BaseReferences<_$LocalDb, $PayslipsTable, Payslip>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$PayslipsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $PayslipsTable,
      Payslip,
      $$PayslipsTableFilterComposer,
      $$PayslipsTableOrderingComposer,
      $$PayslipsTableAnnotationComposer,
      $$PayslipsTableCreateCompanionBuilder,
      $$PayslipsTableUpdateCompanionBuilder,
      (Payslip, BaseReferences<_$LocalDb, $PayslipsTable, Payslip>),
      Payslip,
      PrefetchHooks Function()
    >;
typedef $$PosItemsTableCreateCompanionBuilder = PosItemsCompanion Function({
  required String id,
  required String name,
  Value<String?> nameHi,
  Value<String?> sku,
  Value<String?> barcode,
  required String kind,
  Value<String?> hsn,
  required String gstRate,
  Value<String?> gstSlab,
  Value<int> slabPieces,
  Value<String> cessRate,
  required String saleRate,
  required String uom,
  Value<bool> archived,
  Value<int> rowid,
});
typedef $$PosItemsTableUpdateCompanionBuilder = PosItemsCompanion Function({
  Value<String> id,
  Value<String> name,
  Value<String?> nameHi,
  Value<String?> sku,
  Value<String?> barcode,
  Value<String> kind,
  Value<String?> hsn,
  Value<String> gstRate,
  Value<String?> gstSlab,
  Value<int> slabPieces,
  Value<String> cessRate,
  Value<String> saleRate,
  Value<String> uom,
  Value<bool> archived,
  Value<int> rowid,
});

class $$PosItemsTableFilterComposer
    extends Composer<_$LocalDb, $PosItemsTable> {
  $$PosItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get sku => $composableBuilder(
    column: $table.sku,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get barcode => $composableBuilder(
    column: $table.barcode,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get kind => $composableBuilder(
    column: $table.kind,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get hsn => $composableBuilder(
    column: $table.hsn,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get gstRate => $composableBuilder(
    column: $table.gstRate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get gstSlab => $composableBuilder(
    column: $table.gstSlab,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get slabPieces => $composableBuilder(
    column: $table.slabPieces,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get cessRate => $composableBuilder(
    column: $table.cessRate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get saleRate => $composableBuilder(
    column: $table.saleRate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get uom => $composableBuilder(
    column: $table.uom,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnFilters(column),
  );
}

class $$PosItemsTableOrderingComposer
    extends Composer<_$LocalDb, $PosItemsTable> {
  $$PosItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get sku => $composableBuilder(
    column: $table.sku,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get barcode => $composableBuilder(
    column: $table.barcode,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get kind => $composableBuilder(
    column: $table.kind,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get hsn => $composableBuilder(
    column: $table.hsn,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get gstRate => $composableBuilder(
    column: $table.gstRate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get gstSlab => $composableBuilder(
    column: $table.gstSlab,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get slabPieces => $composableBuilder(
    column: $table.slabPieces,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get cessRate => $composableBuilder(
    column: $table.cessRate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get saleRate => $composableBuilder(
    column: $table.saleRate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get uom => $composableBuilder(
    column: $table.uom,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$PosItemsTableAnnotationComposer
    extends Composer<_$LocalDb, $PosItemsTable> {
  $$PosItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get nameHi =>
      $composableBuilder(column: $table.nameHi, builder: (column) => column);

  GeneratedColumn<String> get sku =>
      $composableBuilder(column: $table.sku, builder: (column) => column);

  GeneratedColumn<String> get barcode =>
      $composableBuilder(column: $table.barcode, builder: (column) => column);

  GeneratedColumn<String> get kind =>
      $composableBuilder(column: $table.kind, builder: (column) => column);

  GeneratedColumn<String> get hsn =>
      $composableBuilder(column: $table.hsn, builder: (column) => column);

  GeneratedColumn<String> get gstRate =>
      $composableBuilder(column: $table.gstRate, builder: (column) => column);

  GeneratedColumn<String> get gstSlab =>
      $composableBuilder(column: $table.gstSlab, builder: (column) => column);

  GeneratedColumn<int> get slabPieces => $composableBuilder(
    column: $table.slabPieces,
    builder: (column) => column,
  );

  GeneratedColumn<String> get cessRate =>
      $composableBuilder(column: $table.cessRate, builder: (column) => column);

  GeneratedColumn<String> get saleRate =>
      $composableBuilder(column: $table.saleRate, builder: (column) => column);

  GeneratedColumn<String> get uom =>
      $composableBuilder(column: $table.uom, builder: (column) => column);

  GeneratedColumn<bool> get archived =>
      $composableBuilder(column: $table.archived, builder: (column) => column);
}

class $$PosItemsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $PosItemsTable,
          PosItem,
          $$PosItemsTableFilterComposer,
          $$PosItemsTableOrderingComposer,
          $$PosItemsTableAnnotationComposer,
          $$PosItemsTableCreateCompanionBuilder,
          $$PosItemsTableUpdateCompanionBuilder,
          (PosItem, BaseReferences<_$LocalDb, $PosItemsTable, PosItem>),
          PosItem,
          PrefetchHooks Function()
        > {
  $$PosItemsTableTableManager(_$LocalDb db, $PosItemsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PosItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PosItemsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PosItemsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> nameHi = const Value.absent(),
                Value<String?> sku = const Value.absent(),
                Value<String?> barcode = const Value.absent(),
                Value<String> kind = const Value.absent(),
                Value<String?> hsn = const Value.absent(),
                Value<String> gstRate = const Value.absent(),
                Value<String?> gstSlab = const Value.absent(),
                Value<int> slabPieces = const Value.absent(),
                Value<String> cessRate = const Value.absent(),
                Value<String> saleRate = const Value.absent(),
                Value<String> uom = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PosItemsCompanion(
                id: id,
                name: name,
                nameHi: nameHi,
                sku: sku,
                barcode: barcode,
                kind: kind,
                hsn: hsn,
                gstRate: gstRate,
                gstSlab: gstSlab,
                slabPieces: slabPieces,
                cessRate: cessRate,
                saleRate: saleRate,
                uom: uom,
                archived: archived,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                Value<String?> nameHi = const Value.absent(),
                Value<String?> sku = const Value.absent(),
                Value<String?> barcode = const Value.absent(),
                required String kind,
                Value<String?> hsn = const Value.absent(),
                required String gstRate,
                Value<String?> gstSlab = const Value.absent(),
                Value<int> slabPieces = const Value.absent(),
                Value<String> cessRate = const Value.absent(),
                required String saleRate,
                required String uom,
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PosItemsCompanion.insert(
                id: id,
                name: name,
                nameHi: nameHi,
                sku: sku,
                barcode: barcode,
                kind: kind,
                hsn: hsn,
                gstRate: gstRate,
                gstSlab: gstSlab,
                slabPieces: slabPieces,
                cessRate: cessRate,
                saleRate: saleRate,
                uom: uom,
                archived: archived,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$PosItemsTable, PosItem>(table),
                  BaseReferences<_$LocalDb, $PosItemsTable, PosItem>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$PosItemsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $PosItemsTable,
      PosItem,
      $$PosItemsTableFilterComposer,
      $$PosItemsTableOrderingComposer,
      $$PosItemsTableAnnotationComposer,
      $$PosItemsTableCreateCompanionBuilder,
      $$PosItemsTableUpdateCompanionBuilder,
      (PosItem, BaseReferences<_$LocalDb, $PosItemsTable, PosItem>),
      PosItem,
      PrefetchHooks Function()
    >;
typedef $$PosTerminalsTableCreateCompanionBuilder =
    PosTerminalsCompanion Function({
      required String id,
      required String code,
      required String name,
      Value<bool> archived,
      Value<int> rowid,
    });
typedef $$PosTerminalsTableUpdateCompanionBuilder =
    PosTerminalsCompanion Function({
      Value<String> id,
      Value<String> code,
      Value<String> name,
      Value<bool> archived,
      Value<int> rowid,
    });

class $$PosTerminalsTableFilterComposer
    extends Composer<_$LocalDb, $PosTerminalsTable> {
  $$PosTerminalsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get code => $composableBuilder(
    column: $table.code,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnFilters(column),
  );
}

class $$PosTerminalsTableOrderingComposer
    extends Composer<_$LocalDb, $PosTerminalsTable> {
  $$PosTerminalsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get code => $composableBuilder(
    column: $table.code,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$PosTerminalsTableAnnotationComposer
    extends Composer<_$LocalDb, $PosTerminalsTable> {
  $$PosTerminalsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get code =>
      $composableBuilder(column: $table.code, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<bool> get archived =>
      $composableBuilder(column: $table.archived, builder: (column) => column);
}

class $$PosTerminalsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $PosTerminalsTable,
          PosTerminal,
          $$PosTerminalsTableFilterComposer,
          $$PosTerminalsTableOrderingComposer,
          $$PosTerminalsTableAnnotationComposer,
          $$PosTerminalsTableCreateCompanionBuilder,
          $$PosTerminalsTableUpdateCompanionBuilder,
          (
            PosTerminal,
            BaseReferences<_$LocalDb, $PosTerminalsTable, PosTerminal>,
          ),
          PosTerminal,
          PrefetchHooks Function()
        > {
  $$PosTerminalsTableTableManager(_$LocalDb db, $PosTerminalsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PosTerminalsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PosTerminalsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PosTerminalsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> code = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PosTerminalsCompanion(
                id: id,
                code: code,
                name: name,
                archived: archived,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String code,
                required String name,
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PosTerminalsCompanion.insert(
                id: id,
                code: code,
                name: name,
                archived: archived,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$PosTerminalsTable, PosTerminal>(table),
                  BaseReferences<_$LocalDb, $PosTerminalsTable, PosTerminal>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$PosTerminalsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $PosTerminalsTable,
      PosTerminal,
      $$PosTerminalsTableFilterComposer,
      $$PosTerminalsTableOrderingComposer,
      $$PosTerminalsTableAnnotationComposer,
      $$PosTerminalsTableCreateCompanionBuilder,
      $$PosTerminalsTableUpdateCompanionBuilder,
      (PosTerminal, BaseReferences<_$LocalDb, $PosTerminalsTable, PosTerminal>),
      PosTerminal,
      PrefetchHooks Function()
    >;
typedef $$PosBillsTableCreateCompanionBuilder = PosBillsCompanion Function({
  required String id,
  required String terminalId,
  required String number,
  required String date,
  required String createdAt,
  Value<String?> customerPhone,
  Value<String?> customerName,
  required String detail,
  required String total,
  Value<String> change,
  Value<String?> serverTotal,
  Value<String> syncState,
  Value<String?> syncError,
  Value<int> rowid,
});
typedef $$PosBillsTableUpdateCompanionBuilder = PosBillsCompanion Function({
  Value<String> id,
  Value<String> terminalId,
  Value<String> number,
  Value<String> date,
  Value<String> createdAt,
  Value<String?> customerPhone,
  Value<String?> customerName,
  Value<String> detail,
  Value<String> total,
  Value<String> change,
  Value<String?> serverTotal,
  Value<String> syncState,
  Value<String?> syncError,
  Value<int> rowid,
});

class $$PosBillsTableFilterComposer
    extends Composer<_$LocalDb, $PosBillsTable> {
  $$PosBillsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get terminalId => $composableBuilder(
    column: $table.terminalId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get number => $composableBuilder(
    column: $table.number,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get customerPhone => $composableBuilder(
    column: $table.customerPhone,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get customerName => $composableBuilder(
    column: $table.customerName,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get detail => $composableBuilder(
    column: $table.detail,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get total => $composableBuilder(
    column: $table.total,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get change => $composableBuilder(
    column: $table.change,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get serverTotal => $composableBuilder(
    column: $table.serverTotal,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnFilters(column),
  );
}

class $$PosBillsTableOrderingComposer
    extends Composer<_$LocalDb, $PosBillsTable> {
  $$PosBillsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get terminalId => $composableBuilder(
    column: $table.terminalId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get number => $composableBuilder(
    column: $table.number,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get customerPhone => $composableBuilder(
    column: $table.customerPhone,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get customerName => $composableBuilder(
    column: $table.customerName,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get detail => $composableBuilder(
    column: $table.detail,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get total => $composableBuilder(
    column: $table.total,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get change => $composableBuilder(
    column: $table.change,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get serverTotal => $composableBuilder(
    column: $table.serverTotal,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$PosBillsTableAnnotationComposer
    extends Composer<_$LocalDb, $PosBillsTable> {
  $$PosBillsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get terminalId => $composableBuilder(
    column: $table.terminalId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get number =>
      $composableBuilder(column: $table.number, builder: (column) => column);

  GeneratedColumn<String> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<String> get customerPhone => $composableBuilder(
    column: $table.customerPhone,
    builder: (column) => column,
  );

  GeneratedColumn<String> get customerName => $composableBuilder(
    column: $table.customerName,
    builder: (column) => column,
  );

  GeneratedColumn<String> get detail =>
      $composableBuilder(column: $table.detail, builder: (column) => column);

  GeneratedColumn<String> get total =>
      $composableBuilder(column: $table.total, builder: (column) => column);

  GeneratedColumn<String> get change =>
      $composableBuilder(column: $table.change, builder: (column) => column);

  GeneratedColumn<String> get serverTotal => $composableBuilder(
    column: $table.serverTotal,
    builder: (column) => column,
  );

  GeneratedColumn<String> get syncState =>
      $composableBuilder(column: $table.syncState, builder: (column) => column);

  GeneratedColumn<String> get syncError =>
      $composableBuilder(column: $table.syncError, builder: (column) => column);
}

class $$PosBillsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $PosBillsTable,
          PosBill,
          $$PosBillsTableFilterComposer,
          $$PosBillsTableOrderingComposer,
          $$PosBillsTableAnnotationComposer,
          $$PosBillsTableCreateCompanionBuilder,
          $$PosBillsTableUpdateCompanionBuilder,
          (PosBill, BaseReferences<_$LocalDb, $PosBillsTable, PosBill>),
          PosBill,
          PrefetchHooks Function()
        > {
  $$PosBillsTableTableManager(_$LocalDb db, $PosBillsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PosBillsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PosBillsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PosBillsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> terminalId = const Value.absent(),
                Value<String> number = const Value.absent(),
                Value<String> date = const Value.absent(),
                Value<String> createdAt = const Value.absent(),
                Value<String?> customerPhone = const Value.absent(),
                Value<String?> customerName = const Value.absent(),
                Value<String> detail = const Value.absent(),
                Value<String> total = const Value.absent(),
                Value<String> change = const Value.absent(),
                Value<String?> serverTotal = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PosBillsCompanion(
                id: id,
                terminalId: terminalId,
                number: number,
                date: date,
                createdAt: createdAt,
                customerPhone: customerPhone,
                customerName: customerName,
                detail: detail,
                total: total,
                change: change,
                serverTotal: serverTotal,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String terminalId,
                required String number,
                required String date,
                required String createdAt,
                Value<String?> customerPhone = const Value.absent(),
                Value<String?> customerName = const Value.absent(),
                required String detail,
                required String total,
                Value<String> change = const Value.absent(),
                Value<String?> serverTotal = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PosBillsCompanion.insert(
                id: id,
                terminalId: terminalId,
                number: number,
                date: date,
                createdAt: createdAt,
                customerPhone: customerPhone,
                customerName: customerName,
                detail: detail,
                total: total,
                change: change,
                serverTotal: serverTotal,
                syncState: syncState,
                syncError: syncError,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$PosBillsTable, PosBill>(table),
                  BaseReferences<_$LocalDb, $PosBillsTable, PosBill>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$PosBillsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $PosBillsTable,
      PosBill,
      $$PosBillsTableFilterComposer,
      $$PosBillsTableOrderingComposer,
      $$PosBillsTableAnnotationComposer,
      $$PosBillsTableCreateCompanionBuilder,
      $$PosBillsTableUpdateCompanionBuilder,
      (PosBill, BaseReferences<_$LocalDb, $PosBillsTable, PosBill>),
      PosBill,
      PrefetchHooks Function()
    >;
typedef $$ExpenseCategoriesTableCreateCompanionBuilder =
    ExpenseCategoriesCompanion Function({
      required String id,
      required String name,
      Value<String?> nameHi,
      Value<bool> blockedCredit,
      Value<bool> archived,
      Value<int> rowid,
    });
typedef $$ExpenseCategoriesTableUpdateCompanionBuilder =
    ExpenseCategoriesCompanion Function({
      Value<String> id,
      Value<String> name,
      Value<String?> nameHi,
      Value<bool> blockedCredit,
      Value<bool> archived,
      Value<int> rowid,
    });

class $$ExpenseCategoriesTableFilterComposer
    extends Composer<_$LocalDb, $ExpenseCategoriesTable> {
  $$ExpenseCategoriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get blockedCredit => $composableBuilder(
    column: $table.blockedCredit,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnFilters(column),
  );
}

class $$ExpenseCategoriesTableOrderingComposer
    extends Composer<_$LocalDb, $ExpenseCategoriesTable> {
  $$ExpenseCategoriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get nameHi => $composableBuilder(
    column: $table.nameHi,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get blockedCredit => $composableBuilder(
    column: $table.blockedCredit,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<bool> get archived => $composableBuilder(
    column: $table.archived,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$ExpenseCategoriesTableAnnotationComposer
    extends Composer<_$LocalDb, $ExpenseCategoriesTable> {
  $$ExpenseCategoriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get nameHi =>
      $composableBuilder(column: $table.nameHi, builder: (column) => column);

  GeneratedColumn<bool> get blockedCredit => $composableBuilder(
    column: $table.blockedCredit,
    builder: (column) => column,
  );

  GeneratedColumn<bool> get archived =>
      $composableBuilder(column: $table.archived, builder: (column) => column);
}

class $$ExpenseCategoriesTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $ExpenseCategoriesTable,
          ExpenseCategory,
          $$ExpenseCategoriesTableFilterComposer,
          $$ExpenseCategoriesTableOrderingComposer,
          $$ExpenseCategoriesTableAnnotationComposer,
          $$ExpenseCategoriesTableCreateCompanionBuilder,
          $$ExpenseCategoriesTableUpdateCompanionBuilder,
          (
            ExpenseCategory,
            BaseReferences<_$LocalDb, $ExpenseCategoriesTable, ExpenseCategory>,
          ),
          ExpenseCategory,
          PrefetchHooks Function()
        > {
  $$ExpenseCategoriesTableTableManager(
    _$LocalDb db,
    $ExpenseCategoriesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ExpenseCategoriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ExpenseCategoriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ExpenseCategoriesTableAnnotationComposer(
                $db: db,
                $table: table,
              ),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> nameHi = const Value.absent(),
                Value<bool> blockedCredit = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ExpenseCategoriesCompanion(
                id: id,
                name: name,
                nameHi: nameHi,
                blockedCredit: blockedCredit,
                archived: archived,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String name,
                Value<String?> nameHi = const Value.absent(),
                Value<bool> blockedCredit = const Value.absent(),
                Value<bool> archived = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => ExpenseCategoriesCompanion.insert(
                id: id,
                name: name,
                nameHi: nameHi,
                blockedCredit: blockedCredit,
                archived: archived,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$ExpenseCategoriesTable, ExpenseCategory>(table),
                  BaseReferences<
                    _$LocalDb,
                    $ExpenseCategoriesTable,
                    ExpenseCategory
                  >(db, table, e),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$ExpenseCategoriesTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $ExpenseCategoriesTable,
      ExpenseCategory,
      $$ExpenseCategoriesTableFilterComposer,
      $$ExpenseCategoriesTableOrderingComposer,
      $$ExpenseCategoriesTableAnnotationComposer,
      $$ExpenseCategoriesTableCreateCompanionBuilder,
      $$ExpenseCategoriesTableUpdateCompanionBuilder,
      (
        ExpenseCategory,
        BaseReferences<_$LocalDb, $ExpenseCategoriesTable, ExpenseCategory>,
      ),
      ExpenseCategory,
      PrefetchHooks Function()
    >;
typedef $$LocalClaimsTableCreateCompanionBuilder =
    LocalClaimsCompanion Function({
      required String id,
      required String employeeId,
      required String date,
      required String title,
      required String lines,
      required String total,
      Value<String?> serverNumber,
      Value<String> syncState,
      Value<String?> syncError,
      required String createdAt,
      Value<int> rowid,
    });
typedef $$LocalClaimsTableUpdateCompanionBuilder =
    LocalClaimsCompanion Function({
      Value<String> id,
      Value<String> employeeId,
      Value<String> date,
      Value<String> title,
      Value<String> lines,
      Value<String> total,
      Value<String?> serverNumber,
      Value<String> syncState,
      Value<String?> syncError,
      Value<String> createdAt,
      Value<int> rowid,
    });

class $$LocalClaimsTableFilterComposer
    extends Composer<_$LocalDb, $LocalClaimsTable> {
  $$LocalClaimsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get lines => $composableBuilder(
    column: $table.lines,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get total => $composableBuilder(
    column: $table.total,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get serverNumber => $composableBuilder(
    column: $table.serverNumber,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LocalClaimsTableOrderingComposer
    extends Composer<_$LocalDb, $LocalClaimsTable> {
  $$LocalClaimsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get lines => $composableBuilder(
    column: $table.lines,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get total => $composableBuilder(
    column: $table.total,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get serverNumber => $composableBuilder(
    column: $table.serverNumber,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LocalClaimsTableAnnotationComposer
    extends Composer<_$LocalDb, $LocalClaimsTable> {
  $$LocalClaimsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
    column: $table.employeeId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get lines =>
      $composableBuilder(column: $table.lines, builder: (column) => column);

  GeneratedColumn<String> get total =>
      $composableBuilder(column: $table.total, builder: (column) => column);

  GeneratedColumn<String> get serverNumber => $composableBuilder(
    column: $table.serverNumber,
    builder: (column) => column,
  );

  GeneratedColumn<String> get syncState =>
      $composableBuilder(column: $table.syncState, builder: (column) => column);

  GeneratedColumn<String> get syncError =>
      $composableBuilder(column: $table.syncError, builder: (column) => column);

  GeneratedColumn<String> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$LocalClaimsTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $LocalClaimsTable,
          LocalClaim,
          $$LocalClaimsTableFilterComposer,
          $$LocalClaimsTableOrderingComposer,
          $$LocalClaimsTableAnnotationComposer,
          $$LocalClaimsTableCreateCompanionBuilder,
          $$LocalClaimsTableUpdateCompanionBuilder,
          (
            LocalClaim,
            BaseReferences<_$LocalDb, $LocalClaimsTable, LocalClaim>,
          ),
          LocalClaim,
          PrefetchHooks Function()
        > {
  $$LocalClaimsTableTableManager(_$LocalDb db, $LocalClaimsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalClaimsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalClaimsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalClaimsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> employeeId = const Value.absent(),
                Value<String> date = const Value.absent(),
                Value<String> title = const Value.absent(),
                Value<String> lines = const Value.absent(),
                Value<String> total = const Value.absent(),
                Value<String?> serverNumber = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<String> createdAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => LocalClaimsCompanion(
                id: id,
                employeeId: employeeId,
                date: date,
                title: title,
                lines: lines,
                total: total,
                serverNumber: serverNumber,
                syncState: syncState,
                syncError: syncError,
                createdAt: createdAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String employeeId,
                required String date,
                required String title,
                required String lines,
                required String total,
                Value<String?> serverNumber = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                required String createdAt,
                Value<int> rowid = const Value.absent(),
              }) => LocalClaimsCompanion.insert(
                id: id,
                employeeId: employeeId,
                date: date,
                title: title,
                lines: lines,
                total: total,
                serverNumber: serverNumber,
                syncState: syncState,
                syncError: syncError,
                createdAt: createdAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$LocalClaimsTable, LocalClaim>(table),
                  BaseReferences<_$LocalDb, $LocalClaimsTable, LocalClaim>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LocalClaimsTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $LocalClaimsTable,
      LocalClaim,
      $$LocalClaimsTableFilterComposer,
      $$LocalClaimsTableOrderingComposer,
      $$LocalClaimsTableAnnotationComposer,
      $$LocalClaimsTableCreateCompanionBuilder,
      $$LocalClaimsTableUpdateCompanionBuilder,
      (LocalClaim, BaseReferences<_$LocalDb, $LocalClaimsTable, LocalClaim>),
      LocalClaim,
      PrefetchHooks Function()
    >;
typedef $$FieldOrdersTableCreateCompanionBuilder =
    FieldOrdersCompanion Function({
      required String id,
      required String customerId,
      required String date,
      Value<String?> deliverBy,
      required String lines,
      required String estimate,
      Value<String?> serverNumber,
      Value<String?> serverTotal,
      Value<String> syncState,
      Value<String?> syncError,
      required String createdAt,
      Value<int> rowid,
    });
typedef $$FieldOrdersTableUpdateCompanionBuilder =
    FieldOrdersCompanion Function({
      Value<String> id,
      Value<String> customerId,
      Value<String> date,
      Value<String?> deliverBy,
      Value<String> lines,
      Value<String> estimate,
      Value<String?> serverNumber,
      Value<String?> serverTotal,
      Value<String> syncState,
      Value<String?> syncError,
      Value<String> createdAt,
      Value<int> rowid,
    });

class $$FieldOrdersTableFilterComposer
    extends Composer<_$LocalDb, $FieldOrdersTable> {
  $$FieldOrdersTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get customerId => $composableBuilder(
    column: $table.customerId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get deliverBy => $composableBuilder(
    column: $table.deliverBy,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get lines => $composableBuilder(
    column: $table.lines,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get estimate => $composableBuilder(
    column: $table.estimate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get serverNumber => $composableBuilder(
    column: $table.serverNumber,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get serverTotal => $composableBuilder(
    column: $table.serverTotal,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$FieldOrdersTableOrderingComposer
    extends Composer<_$LocalDb, $FieldOrdersTable> {
  $$FieldOrdersTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get customerId => $composableBuilder(
    column: $table.customerId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get date => $composableBuilder(
    column: $table.date,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get deliverBy => $composableBuilder(
    column: $table.deliverBy,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get lines => $composableBuilder(
    column: $table.lines,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get estimate => $composableBuilder(
    column: $table.estimate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get serverNumber => $composableBuilder(
    column: $table.serverNumber,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get serverTotal => $composableBuilder(
    column: $table.serverTotal,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncState => $composableBuilder(
    column: $table.syncState,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get syncError => $composableBuilder(
    column: $table.syncError,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$FieldOrdersTableAnnotationComposer
    extends Composer<_$LocalDb, $FieldOrdersTable> {
  $$FieldOrdersTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
    column: $table.customerId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get deliverBy =>
      $composableBuilder(column: $table.deliverBy, builder: (column) => column);

  GeneratedColumn<String> get lines =>
      $composableBuilder(column: $table.lines, builder: (column) => column);

  GeneratedColumn<String> get estimate =>
      $composableBuilder(column: $table.estimate, builder: (column) => column);

  GeneratedColumn<String> get serverNumber => $composableBuilder(
    column: $table.serverNumber,
    builder: (column) => column,
  );

  GeneratedColumn<String> get serverTotal => $composableBuilder(
    column: $table.serverTotal,
    builder: (column) => column,
  );

  GeneratedColumn<String> get syncState =>
      $composableBuilder(column: $table.syncState, builder: (column) => column);

  GeneratedColumn<String> get syncError =>
      $composableBuilder(column: $table.syncError, builder: (column) => column);

  GeneratedColumn<String> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$FieldOrdersTableTableManager
    extends
        RootTableManager<
          _$LocalDb,
          $FieldOrdersTable,
          FieldOrder,
          $$FieldOrdersTableFilterComposer,
          $$FieldOrdersTableOrderingComposer,
          $$FieldOrdersTableAnnotationComposer,
          $$FieldOrdersTableCreateCompanionBuilder,
          $$FieldOrdersTableUpdateCompanionBuilder,
          (
            FieldOrder,
            BaseReferences<_$LocalDb, $FieldOrdersTable, FieldOrder>,
          ),
          FieldOrder,
          PrefetchHooks Function()
        > {
  $$FieldOrdersTableTableManager(_$LocalDb db, $FieldOrdersTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$FieldOrdersTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$FieldOrdersTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$FieldOrdersTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> customerId = const Value.absent(),
                Value<String> date = const Value.absent(),
                Value<String?> deliverBy = const Value.absent(),
                Value<String> lines = const Value.absent(),
                Value<String> estimate = const Value.absent(),
                Value<String?> serverNumber = const Value.absent(),
                Value<String?> serverTotal = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                Value<String> createdAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => FieldOrdersCompanion(
                id: id,
                customerId: customerId,
                date: date,
                deliverBy: deliverBy,
                lines: lines,
                estimate: estimate,
                serverNumber: serverNumber,
                serverTotal: serverTotal,
                syncState: syncState,
                syncError: syncError,
                createdAt: createdAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String customerId,
                required String date,
                Value<String?> deliverBy = const Value.absent(),
                required String lines,
                required String estimate,
                Value<String?> serverNumber = const Value.absent(),
                Value<String?> serverTotal = const Value.absent(),
                Value<String> syncState = const Value.absent(),
                Value<String?> syncError = const Value.absent(),
                required String createdAt,
                Value<int> rowid = const Value.absent(),
              }) => FieldOrdersCompanion.insert(
                id: id,
                customerId: customerId,
                date: date,
                deliverBy: deliverBy,
                lines: lines,
                estimate: estimate,
                serverNumber: serverNumber,
                serverTotal: serverTotal,
                syncState: syncState,
                syncError: syncError,
                createdAt: createdAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map(
                (e) => (
                  e.readTable<$FieldOrdersTable, FieldOrder>(table),
                  BaseReferences<_$LocalDb, $FieldOrdersTable, FieldOrder>(
                    db,
                    table,
                    e,
                  ),
                ),
              )
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$FieldOrdersTableProcessedTableManager =
    ProcessedTableManager<
      _$LocalDb,
      $FieldOrdersTable,
      FieldOrder,
      $$FieldOrdersTableFilterComposer,
      $$FieldOrdersTableOrderingComposer,
      $$FieldOrdersTableAnnotationComposer,
      $$FieldOrdersTableCreateCompanionBuilder,
      $$FieldOrdersTableUpdateCompanionBuilder,
      (FieldOrder, BaseReferences<_$LocalDb, $FieldOrdersTable, FieldOrder>),
      FieldOrder,
      PrefetchHooks Function()
    >;

class $LocalDbManager {
  final _$LocalDb _db;
  $LocalDbManager(this._db);
  $$MetaTableTableManager get meta => $$MetaTableTableManager(_db, _db.meta);
  $$CompaniesTableTableManager get companies =>
      $$CompaniesTableTableManager(_db, _db.companies);
  $$FiscalYearsTableTableManager get fiscalYears =>
      $$FiscalYearsTableTableManager(_db, _db.fiscalYears);
  $$AccountGroupsTableTableManager get accountGroups =>
      $$AccountGroupsTableTableManager(_db, _db.accountGroups);
  $$AccountsTableTableManager get accounts =>
      $$AccountsTableTableManager(_db, _db.accounts);
  $$VouchersTableTableManager get vouchers =>
      $$VouchersTableTableManager(_db, _db.vouchers);
  $$VoucherLinesTableTableManager get voucherLines =>
      $$VoucherLinesTableTableManager(_db, _db.voucherLines);
  $$DeviceSeriesTableTableManager get deviceSeries =>
      $$DeviceSeriesTableTableManager(_db, _db.deviceSeries);
  $$OutboxTableTableManager get outbox =>
      $$OutboxTableTableManager(_db, _db.outbox);
  $$EmployeesTableTableManager get employees =>
      $$EmployeesTableTableManager(_db, _db.employees);
  $$LeaveTypesTableTableManager get leaveTypes =>
      $$LeaveTypesTableTableManager(_db, _db.leaveTypes);
  $$LeaveRequestsTableTableManager get leaveRequests =>
      $$LeaveRequestsTableTableManager(_db, _db.leaveRequests);
  $$AttendanceDaysTableTableManager get attendanceDays =>
      $$AttendanceDaysTableTableManager(_db, _db.attendanceDays);
  $$PayslipsTableTableManager get payslips =>
      $$PayslipsTableTableManager(_db, _db.payslips);
  $$PosItemsTableTableManager get posItems =>
      $$PosItemsTableTableManager(_db, _db.posItems);
  $$PosTerminalsTableTableManager get posTerminals =>
      $$PosTerminalsTableTableManager(_db, _db.posTerminals);
  $$PosBillsTableTableManager get posBills =>
      $$PosBillsTableTableManager(_db, _db.posBills);
  $$ExpenseCategoriesTableTableManager get expenseCategories =>
      $$ExpenseCategoriesTableTableManager(_db, _db.expenseCategories);
  $$LocalClaimsTableTableManager get localClaims =>
      $$LocalClaimsTableTableManager(_db, _db.localClaims);
  $$FieldOrdersTableTableManager get fieldOrders =>
      $$FieldOrdersTableTableManager(_db, _db.fieldOrders);
}
