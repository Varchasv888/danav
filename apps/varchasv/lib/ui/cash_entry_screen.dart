import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../data/cashentry.dart';
import '../data/database.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';

/// Money in, money out, or a move between cash and a bank: three buttons and four boxes, and the right voucher is made.
class CashEntryScreen extends StatefulWidget {
  const CashEntryScreen({super.key});

  @override
  State<CashEntryScreen> createState() => _CashEntryScreenState();
}

class _CashEntryScreenState extends State<CashEntryScreen> {
  CashKind _kind = CashKind.received;
  List<Account> _cashBank = [];
  List<Account> _all = [];
  String? _cashId;
  String? _otherId;
  final _amount = TextEditingController();
  final _narration = TextEditingController();
  bool _loaded = false;
  bool _busy = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loaded) return;
    _loaded = true;
    () async {
      final books = AppScope.of(context).books;
      final accounts = (await books.balances()).map((b) => b.account).where((a) => !a.archived).toList();
      final cb = await books.cashBankGroupIds();
      if (!mounted) return;
      setState(() {
        _all = accounts;
        _cashBank = accounts.where((a) => cb.contains(a.groupId)).toList();
        _cashId = _cashBank.firstOrNull?.id;
      });
    }();
  }

  @override
  void dispose() {
    _amount.dispose();
    _narration.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    setState(() => _busy = true);
    try {
      await postCashEntry(app.books, kind: _kind, cashOrBankId: _cashId!, otherId: _otherId!, amount: _amount.text, date: todayIso(), narration: _narration.text.trim().isEmpty ? null : _narration.text.trim());
      app.sync?.syncNow();
      _amount.clear();
      _narration.clear();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.cashSaved)));
    } on BooksException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.code == 'same_account' ? t.cashSameAccount : errorText(t, e.code))));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final others = _kind == CashKind.transfer ? _cashBank.where((a) => a.id != _cashId).toList() : _all.where((a) => !_cashBank.any((c) => c.id == a.id)).toList();
    if (_otherId != null && !others.any((a) => a.id == _otherId)) _otherId = null;
    final ready = _cashId != null && _otherId != null && RegExp(r'^\d+(\.\d{1,2})?$').hasMatch(_amount.text) && (double.tryParse(_amount.text) ?? 0) > 0;
    return Scaffold(
      appBar: AppBar(title: Text(t.toolCashEntry)),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        SegmentedButton<CashKind>(
          segments: [
            ButtonSegment(value: CashKind.received, label: Text(t.cashReceived), icon: const Icon(Icons.south_west)),
            ButtonSegment(value: CashKind.paid, label: Text(t.cashPaid), icon: const Icon(Icons.north_east)),
            ButtonSegment(value: CashKind.transfer, label: Text(t.cashTransfer), icon: const Icon(Icons.swap_horiz)),
          ],
          selected: {_kind},
          onSelectionChanged: (s) => setState(() => _kind = s.first),
        ),
        const SizedBox(height: 12),
        DropdownButtonFormField<String>(
          initialValue: _cashId,
          decoration: InputDecoration(labelText: _kind == CashKind.transfer ? t.cashFrom : t.cashAccount),
          items: [for (final a in _cashBank) DropdownMenuItem(value: a.id, child: Text(localName(context, a.name, a.nameHi)))],
          onChanged: (v) => setState(() => _cashId = v),
        ),
        DropdownButtonFormField<String>(
          key: ValueKey('$_kind-${others.length}'),
          initialValue: _otherId,
          decoration: InputDecoration(labelText: _kind == CashKind.transfer ? t.cashTo : t.cashOther),
          items: [for (final a in others) DropdownMenuItem(value: a.id, child: Text(localName(context, a.name, a.nameHi)))],
          onChanged: (v) => setState(() => _otherId = v),
        ),
        TextField(
          controller: _amount,
          decoration: InputDecoration(labelText: t.expensesFormAmount),
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}'))],
          onChanged: (_) => setState(() {}),
        ),
        TextField(controller: _narration, decoration: InputDecoration(labelText: t.cashNarration)),
        const SizedBox(height: 16),
        FilledButton(onPressed: ready && !_busy ? _save : null, child: Text(t.cashSave)),
      ]),
    );
  }
}
