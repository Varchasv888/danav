import 'package:flutter/material.dart';

import '../app_state.dart';
import '../l10n/gen/app_localizations.dart';
import '../sync/conflicts.dart';
import '../sync/sync_service.dart';
import 'format.dart';

/// Changes made on this device that the server refused: what each was, why it was refused, and whether to try it again or set it aside.
class ConflictsScreen extends StatefulWidget {
  const ConflictsScreen({super.key});

  @override
  State<ConflictsScreen> createState() => _ConflictsScreenState();
}

class _ConflictsScreenState extends State<ConflictsScreen> {
  Future<List<Conflict>>? _future;

  void _reload(SyncService sync) {
    setState(() => _future = loadConflicts(sync.db));
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final sync = AppScope.of(context).sync;
    if (sync == null) return const SizedBox.shrink();
    _future ??= loadConflicts(sync.db);
    return Scaffold(
      appBar: AppBar(title: Text(t.conflictsTitle)),
      body: FutureBuilder<List<Conflict>>(
        future: _future,
        builder: (context, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator());
          final items = snap.data!;
          if (items.isEmpty) return Center(child: Text(t.conflictsEmpty));
          return ListView(padding: const EdgeInsets.all(16), children: [
            Text(t.conflictsHelp, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 12),
            for (final c in items) _tile(context, t, sync, c),
          ]);
        },
      ),
    );
  }

  Widget _tile(BuildContext context, AppLocalizations t, SyncService sync, Conflict c) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text(kindLabel(t, c.kind), style: Theme.of(context).textTheme.titleSmall)),
            if (c.amount != null) Text(rupees(c.amount!), style: Theme.of(context).textTheme.titleSmall),
          ]),
          if (c.subject.isNotEmpty || c.date != null) Text([c.subject, c.date].where((x) => x != null && x.isNotEmpty).join('  ')),
          const SizedBox(height: 6),
          Text(t.conflictWhy(reasonText(t, c.code)), style: TextStyle(color: scheme.error)),
          if (!c.canDiscard) ...[
            const SizedBox(height: 6),
            Text(t.conflictBillNote, style: Theme.of(context).textTheme.bodySmall),
          ],
          const SizedBox(height: 8),
          Row(mainAxisAlignment: MainAxisAlignment.end, children: [
            if (c.canDiscard)
              TextButton(
                onPressed: () async {
                  final ok = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: Text(t.conflictDiscardAsk),
                      content: Text(t.conflictDiscardBody),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text(t.commonCancel)),
                        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: Text(t.conflictDiscard)),
                      ],
                    ),
                  );
                  if (ok == true) {
                    await discardOne(sync.db, c.seq);
                    await sync.refreshCounts();
                    _reload(sync);
                  }
                },
                child: Text(t.conflictDiscard),
              ),
            const SizedBox(width: 8),
            FilledButton(
              onPressed: () async {
                await retryOne(sync.db, c.seq);
                await sync.syncNow();
                _reload(sync);
              },
              child: Text(t.conflictRetry),
            ),
          ]),
        ]),
      ),
    );
  }
}

String kindLabel(AppLocalizations t, String kind) => switch (kindLabelKey(kind)) {
      'voucher' => t.conflictKindVoucher,
      'cancelVoucher' => t.conflictKindCancelVoucher,
      'bill' => t.conflictKindBill,
      'leave' => t.conflictKindLeave,
      'attendance' => t.conflictKindAttendance,
      'claim' => t.conflictKindClaim,
      'order' => t.conflictKindOrder,
      _ => t.conflictKindOther,
    };

String reasonText(AppLocalizations t, String code) => switch (code) {
      'period_locked' => t.conflictReasonPeriodLocked,
      'gstr1_filed_for_period' => t.conflictReasonGstFiled,
      'unknown_account' => t.conflictReasonUnknownAccount,
      'unknown_item' => t.conflictReasonUnknownItem,
      'session_closed' => t.conflictReasonSessionClosed,
      'forbidden' || 'missing_permission' => t.conflictReasonForbidden,
      'device_revoked' => t.conflictReasonDeviceRevoked,
      _ => t.conflictReasonOther(code),
    };
