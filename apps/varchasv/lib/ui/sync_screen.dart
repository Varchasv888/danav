import 'package:flutter/material.dart';

import '../app_state.dart';
import '../domain/offline.dart';
import '../l10n/gen/app_localizations.dart';
import '../sync/sync_service.dart';
import 'conflicts_screen.dart';

class SyncScreen extends StatelessWidget {
  const SyncScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    final sync = app.sync;
    if (sync == null) return const SizedBox.shrink();
    return ListenableBuilder(
      listenable: sync,
      builder: (context, _) {
        final scheme = Theme.of(context).colorScheme;
        final last = sync.lastSyncAt;
        return ListView(padding: const EdgeInsets.all(20), children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Icon(switch (sync.status) {
                    SyncStatus.syncing => Icons.sync,
                    SyncStatus.offline => Icons.cloud_off,
                    SyncStatus.error => Icons.error_outline,
                    SyncStatus.idle => Icons.cloud_done,
                  }, color: sync.status == SyncStatus.idle ? scheme.primary : scheme.error),
                  const SizedBox(width: 12),
                  Expanded(child: Text(t.appSyncTitle, style: Theme.of(context).textTheme.titleMedium)),
                  FilledButton.icon(
                    onPressed: sync.status == SyncStatus.syncing ? null : sync.syncNow,
                    icon: const Icon(Icons.sync),
                    label: Text(sync.status == SyncStatus.syncing ? t.appSyncing : t.appSyncNow),
                  ),
                ]),
                const SizedBox(height: 12),
                if (sync.status == SyncStatus.offline) Text(t.appOffline, style: TextStyle(color: scheme.error)),
                if (sync.revoked) Text(t.appDeviceRevoked, style: TextStyle(color: scheme.error)),
                Text(last == null ? t.appNeverSynced : t.appLastSync(TimeOfDay.fromDateTime(last).format(context))),
                Text(t.appPending(sync.pending)),
                if (sync.failed > 0) ...[
                  Text(t.appRefused(sync.failed), style: TextStyle(color: scheme.error)),
                  TextButton(onPressed: sync.retryFailed, child: Text(t.appRetry)),
                  TextButton(onPressed: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ConflictsScreen())), child: Text(t.conflictsReview)),
                ],
              ]),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Column(children: [
              ListTile(leading: const Icon(Icons.store_outlined), title: Text(app.businessName ?? ''), subtitle: Text(t.appBusiness)),
              ListTile(leading: const Icon(Icons.computer), title: Text(t.appDevice), subtitle: Text(t.appDeviceCode(app.deviceCode ?? '-'))),
              ListTile(leading: const Icon(Icons.person_outline), title: Text(app.userName ?? '')),
            ]),
          ),
          const SizedBox(height: 12),
          Card(
            child: ExpansionTile(
              title: Text(t.appOfflineRulesTitle),
              children: [
                for (final r in sync.rules.all)
                  ListTile(
                    dense: true,
                    leading: Icon(switch (r.mode) {
                      OfflineMode.allowed => Icons.check_circle_outline,
                      OfflineMode.readOnly => Icons.visibility_outlined,
                      OfflineMode.onlineOnly => Icons.cloud_outlined,
                    }),
                    title: Text(r.note),
                    subtitle: Text(r.action),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(foregroundColor: scheme.error),
            icon: const Icon(Icons.logout),
            label: Text(t.appSignOut),
            onPressed: () async {
              final ok = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: Text(t.appSignOut),
                  content: Text(t.appSignOutWarning(sync.pending + sync.failed)),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text(t.commonCancel)),
                    FilledButton(onPressed: () => Navigator.pop(ctx, true), child: Text(t.appSignOut)),
                  ],
                ),
              );
              if (ok == true) await app.signOut();
            },
          ),
        ]);
      },
    );
  }
}
