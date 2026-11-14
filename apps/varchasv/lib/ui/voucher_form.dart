import 'package:decimal/decimal.dart';
import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../data/database.dart';
import '../domain/domain.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';
import 'vouchers_screen.dart';

class VoucherFormScreen extends StatefulWidget {
  const VoucherFormScreen({super.key});

  @override
  State<VoucherFormScreen> createState() => _VoucherFormScreenState();
}

class _VoucherFormScreenState extends State<VoucherFormScreen> {
  String _type = 'payment';
  String _date = todayIso();
  final _narration = TextEditingController();
  final _lines = [LineDraft(accountId: ''), LineDraft(accountId: '')];
  List<Account> _accounts = [];
  Set<String> _cashBankGroups = {};
  String? _error;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    () async {
      final books = AppScope.of(context).books;
      final accounts = (await books.balances()).map((b) => b.account).where((a) => !a.archived).toList();
      final cb = await books.cashBankGroupIds();
      if (mounted) {
        setState(() {
          _accounts = accounts;
          _cashBankGroups = cb;
        });
      }
    }();
  }

  @override
  void dispose() {
    _narration.dispose();
    super.dispose();
  }

  static final _amount = RegExp(r'^\d+(\.\d{1,2})?$');
  Decimal _sum(String Function(LineDraft) side) => sumOf(_lines.map((l) => _amount.hasMatch(side(l)) ? side(l) : '0'));

  Future<void> _post() async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await app.books.postVoucher(type: _type, date: _date, lines: _lines, narration: _narration.text.trim().isEmpty ? null : _narration.text.trim());
      app.sync?.syncNow(); // uploads now if online; otherwise it stays queued
      if (mounted) Navigator.pop(context);
    } on BooksException catch (e) {
      setState(() => _error = errorText(t, e.code));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final dr = _sum((l) => l.debit), cr = _sum((l) => l.credit);
    final sorted = [..._accounts]..sort((a, b) => localName(context, a.name, a.nameHi).compareTo(localName(context, b.name, b.nameHi)));

    return Scaffold(
      appBar: AppBar(title: Text(t.vouchersNew)),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        SegmentedButton<String>(
          segments: [for (final x in const ['payment', 'receipt', 'contra', 'journal']) ButtonSegment(value: x, label: Text(voucherTypeLabel(t, x)))],
          selected: {_type},
          onSelectionChanged: (s) => setState(() => _type = s.first),
        ),
        const SizedBox(height: 16),
        Row(children: [
          Expanded(
            child: InkWell(
              onTap: () async {
                final picked = await showDatePicker(context: context, initialDate: DateTime.parse(_date), firstDate: DateTime(2000), lastDate: DateTime(2100));
                if (picked != null) setState(() => _date = picked.toIso8601String().substring(0, 10));
              },
              child: InputDecorator(decoration: InputDecoration(labelText: t.commonDate), child: Text(_date)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(flex: 2, child: TextField(controller: _narration, decoration: InputDecoration(labelText: t.commonNarration))),
        ]),
        const SizedBox(height: 16),
        for (final (i, line) in _lines.indexed)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(children: [
              Expanded(
                flex: 3,
                child: DropdownButtonFormField<String>(
                  isExpanded: true,
                  initialValue: line.accountId.isEmpty ? null : line.accountId,
                  hint: Text(t.vouchersChooseAccount),
                  items: [
                    for (final a in sorted)
                      DropdownMenuItem(value: a.id, child: Text(localName(context, a.name, a.nameHi) + (_cashBankGroups.contains(a.groupId) ? '  ₹' : ''), overflow: TextOverflow.ellipsis)),
                  ],
                  onChanged: (v) => setState(() => line.accountId = v ?? ''),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextFormField(
                  key: ValueKey('dr-$i-${line.debit.isEmpty}'),
                  initialValue: line.debit,
                  decoration: InputDecoration(labelText: t.commonDr),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  textAlign: TextAlign.right,
                  onChanged: (v) => setState(() {
                    line.debit = v;
                    if (v.isNotEmpty) line.credit = '';
                  }),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextFormField(
                  key: ValueKey('cr-$i-${line.credit.isEmpty}'),
                  initialValue: line.credit,
                  decoration: InputDecoration(labelText: t.commonCr),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  textAlign: TextAlign.right,
                  onChanged: (v) => setState(() {
                    line.credit = v;
                    if (v.isNotEmpty) line.debit = '';
                  }),
                ),
              ),
              IconButton(
                onPressed: _lines.length > 2 ? () => setState(() => _lines.removeAt(i)) : null,
                icon: const Icon(Icons.close),
                tooltip: t.commonRemove,
              ),
            ]),
          ),
        Row(children: [
          TextButton.icon(
            onPressed: () => setState(() {
              // Pre-fill the balancing amount on the new line.
              final diff = dr - cr;
              _lines.add(LineDraft(accountId: '', debit: diff < zero ? (-diff).toStringAsFixed(2) : '', credit: diff > zero ? diff.toStringAsFixed(2) : ''));
            }),
            icon: const Icon(Icons.add),
            label: Text(t.vouchersAddLine),
          ),
          const Spacer(),
          Text('${rupees(dr)}   ${rupees(cr)}', style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(width: 48),
        ]),
        if (dr != cr) Align(alignment: Alignment.centerRight, child: Text('${t.vouchersDifference}: ${rupees((dr - cr).abs())}', style: TextStyle(color: Theme.of(context).colorScheme.error))),
        if (_error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
        const SizedBox(height: 20),
        FilledButton(onPressed: _busy ? null : _post, child: Text(t.vouchersPost)),
      ]),
    );
  }
}
