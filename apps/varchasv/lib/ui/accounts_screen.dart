import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../domain/domain.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';

/// Chart of accounts with live balances, and the trial balance built from the same numbers.
class AccountsScreen extends StatefulWidget {
  const AccountsScreen({super.key, this.trialBalance = false});
  final bool trialBalance;

  @override
  State<AccountsScreen> createState() => _AccountsScreenState();
}

class _AccountsScreenState extends State<AccountsScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return Scaffold(
      floatingActionButton: widget.trialBalance
          ? null
          : FloatingActionButton.extended(onPressed: () => _addAccount(context), icon: const Icon(Icons.add), label: Text(t.appAddAccount)),
      body: StreamBuilder(
        // Recompute whenever vouchers change (posting, cancelling, a sync).
        stream: app.books.watchVouchers(),
        builder: (context, _) => FutureBuilder<List<AccountBalance>>(
          future: app.books.balances(),
          builder: (context, snap) {
            var rows = snap.data ?? const <AccountBalance>[];
            if (widget.trialBalance) rows = rows.where((r) => r.balance != zero).toList();
            final q = _query.toLowerCase();
            if (q.isNotEmpty) rows = rows.where((r) => r.account.name.toLowerCase().contains(q) || (r.account.nameHi ?? '').contains(q)).toList();
            rows.sort((a, b) => widget.trialBalance
                ? a.groupName.compareTo(b.groupName)
                : localName(context, a.account.name, a.account.nameHi).compareTo(localName(context, b.account.name, b.account.nameHi)));
            final totalDr = sumOf(rows.where((r) => r.balance > zero).map((r) => r.balance));
            final totalCr = sumOf(rows.where((r) => r.balance < zero).map((r) => -r.balance));

            return Column(children: [
              if (!widget.trialBalance)
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: TextField(decoration: InputDecoration(prefixIcon: const Icon(Icons.search), hintText: t.commonSearch), onChanged: (v) => setState(() => _query = v)),
                ),
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.only(bottom: 96),
                  itemCount: rows.length,
                  separatorBuilder: (_, _) => const Divider(height: 1),
                  itemBuilder: (context, i) {
                    final r = rows[i];
                    return ListTile(
                      dense: true,
                      title: Text(localName(context, r.account.name, r.account.nameHi)),
                      subtitle: Text(localName(context, r.groupName, r.groupNameHi)),
                      trailing: Text(drCr(r.balance, dr: t.commonDr, cr: t.commonCr), style: const TextStyle(fontFeatures: [FontFeature.tabularFigures()])),
                    );
                  },
                ),
              ),
              if (widget.trialBalance)
                Material(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(children: [
                      Text(t.commonTotal, style: const TextStyle(fontWeight: FontWeight.bold)),
                      const Spacer(),
                      Text('${t.commonDr} ${rupees(totalDr)}   ${t.commonCr} ${rupees(totalCr)}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ]),
                  ),
                ),
            ]);
          },
        ),
      ),
    );
  }

  Future<void> _addAccount(BuildContext context) async {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    final groups = await app.books.groups();
    if (!context.mounted) return;
    final name = TextEditingController(), opening = TextEditingController(), gstin = TextEditingController();
    String? groupId;
    String? error;
    await showDialog<void>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) => AlertDialog(
          title: Text(t.appAddAccount),
          content: SizedBox(
            width: 420,
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              TextField(controller: name, decoration: InputDecoration(labelText: t.accountsName), autofocus: true),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                isExpanded: true,
                initialValue: groupId,
                decoration: InputDecoration(labelText: t.accountsGroup),
                items: [for (final g in groups) DropdownMenuItem(value: g.id, child: Text(localName(ctx, g.name, g.nameHi)))],
                onChanged: (v) => setLocal(() => groupId = v),
              ),
              const SizedBox(height: 12),
              TextField(controller: opening, decoration: InputDecoration(labelText: t.accountsOpeningBalance, helperText: t.accountsOpeningHint, helperMaxLines: 2), keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true)),
              const SizedBox(height: 12),
              TextField(controller: gstin, decoration: InputDecoration(labelText: '${t.authGstin} (${t.commonOptional})'), textCapitalization: TextCapitalization.characters),
              if (error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(error!, style: TextStyle(color: Theme.of(ctx).colorScheme.error))),
            ]),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: Text(t.commonCancel)),
            FilledButton(
              onPressed: () async {
                if (groupId == null) return setLocal(() => error = t.accountsErrorsUnknownGroup);
                try {
                  await app.books.createAccount(name: name.text, groupId: groupId!, openingBalance: opening.text, gstin: gstin.text);
                  app.sync?.syncNow();
                  if (ctx.mounted) Navigator.pop(ctx);
                  setState(() {});
                } on BooksException catch (e) {
                  setLocal(() => error = errorText(t, e.code));
                } on FormatException {
                  setLocal(() => error = t.accountsOpeningHint);
                }
              },
              child: Text(t.commonSave),
            ),
          ],
        ),
      ),
    );
  }
}
