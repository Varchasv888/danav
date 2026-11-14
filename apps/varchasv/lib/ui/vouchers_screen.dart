import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/books.dart';
import '../data/database.dart';
import '../domain/domain.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';
import 'format.dart';
import 'voucher_form.dart';

String voucherTypeLabel(AppLocalizations t, String type) => switch (type) {
      'payment' => t.vouchersTypesPayment,
      'receipt' => t.vouchersTypesReceipt,
      'contra' => t.vouchersTypesContra,
      'purchase' => t.vouchersTypesPurchase,
      'debit_note' => t.vouchersTypesDebitNote,
      'sales' => t.vouchersTypesSales,
      'credit_note' => t.vouchersTypesCreditNote,
      _ => t.vouchersTypesJournal,
    };

class VouchersScreen extends StatelessWidget {
  const VouchersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const VoucherFormScreen())),
        icon: const Icon(Icons.add),
        label: Text(t.vouchersNew),
      ),
      body: StreamBuilder<List<Voucher>>(
        stream: app.books.watchVouchers(),
        builder: (context, snap) {
          final vouchers = snap.data ?? const [];
          if (vouchers.isEmpty) return Center(child: Text(t.appNoVouchers));
          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 96),
            itemCount: vouchers.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, i) => _VoucherTile(v: vouchers[i]),
          );
        },
      ),
    );
  }
}

class _VoucherTile extends StatelessWidget {
  const _VoucherTile({required this.v});
  final Voucher v;

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final scheme = Theme.of(context).colorScheme;
    final cancelled = v.status == 'cancelled';
    final (badge, color) = switch (v.syncState) {
      'pending' => (t.appBadgePending, scheme.tertiary),
      'failed' => (t.appBadgeFailed, scheme.error),
      _ => (t.appBadgeSynced, scheme.outline),
    };
    return ListTile(
      onTap: () => showModalBottomSheet(context: context, isScrollControlled: true, builder: (_) => VoucherDetail(v: v)),
      title: Text(v.number, style: TextStyle(fontFamily: 'monospace', decoration: cancelled ? TextDecoration.lineThrough : null)),
      subtitle: Text([voucherTypeLabel(t, v.type), v.date, if (v.narration != null) v.narration!].join(' · '), maxLines: 1, overflow: TextOverflow.ellipsis),
      trailing: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.end, children: [
        Text(rupees(v.total), style: const TextStyle(fontWeight: FontWeight.w600, fontFeatures: [FontFeature.tabularFigures()])),
        Text(cancelled ? t.vouchersCancelled : badge, style: TextStyle(fontSize: 12, color: cancelled ? scheme.error : color)),
      ]),
    );
  }
}

class VoucherDetail extends StatefulWidget {
  const VoucherDetail({super.key, required this.v});
  final Voucher v;

  @override
  State<VoucherDetail> createState() => _VoucherDetailState();
}

class _VoucherDetailState extends State<VoucherDetail> {
  List<VoucherLine>? _lines;
  Map<String, Account> _accounts = {};
  final _reason = TextEditingController();
  String? _error;

  @override
  void initState() {
    super.initState();
    () async {
      final app = AppScope.of(context);
      final lines = await app.books.linesOf(widget.v.id);
      final accts = {for (final a in await app.db.select(app.db.accounts).get()) a.id: a};
      if (mounted) {
        setState(() {
          _lines = lines;
          _accounts = accts;
        });
      }
    }();
  }

  @override
  void dispose() {
    _reason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final v = widget.v;
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 20, 20, 20 + MediaQuery.viewInsetsOf(context).bottom),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text(v.number, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontFamily: 'monospace')),
        Text('${voucherTypeLabel(t, v.type)} · ${v.date}'),
        if (v.syncError != null) Text(errorText(t, v.syncError!), style: TextStyle(color: Theme.of(context).colorScheme.error)),
        const Divider(),
        for (final l in _lines ?? const <VoucherLine>[])
          Row(children: [
            Expanded(child: Text(_accounts[l.accountId] == null ? '…' : localName(context, _accounts[l.accountId]!.name, _accounts[l.accountId]!.nameHi))),
            SizedBox(width: 110, child: Text(dec(l.debit!) > zero ? rupees(l.debit!) : '', textAlign: TextAlign.right)),
            SizedBox(width: 110, child: Text(dec(l.credit!) > zero ? rupees(l.credit!) : '', textAlign: TextAlign.right)),
          ]),
        const Divider(),
        Text(wordsFor(context, v.total), style: Theme.of(context).textTheme.bodySmall),
        if (v.narration != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text('${t.commonNarration}: ${v.narration}')),
        if (v.status == 'posted') ...[
          const SizedBox(height: 16),
          TextField(controller: _reason, decoration: InputDecoration(labelText: t.vouchersCancelReason)),
          if (_error != null) Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
          const SizedBox(height: 8),
          OutlinedButton(
            style: OutlinedButton.styleFrom(foregroundColor: Theme.of(context).colorScheme.error),
            onPressed: () async {
              if (_reason.text.trim().length < 3) return setState(() => _error = t.vouchersCancelReason);
              try {
                final app = AppScope.of(context);
                await app.books.cancelVoucher(v.id, _reason.text.trim());
                app.sync?.syncNow();
                if (context.mounted) Navigator.pop(context);
              } on BooksException catch (e) {
                setState(() => _error = errorText(t, e.code));
              }
            },
            child: Text(t.vouchersCancel),
          ),
        ],
      ]),
    );
  }
}
