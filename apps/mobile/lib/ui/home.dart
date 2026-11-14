import 'dart:convert';

import 'package:flutter/material.dart';

import '../core/format.dart';
import '../core/models.dart';
import '../core/perf.dart';
import '../core/printer.dart';
import '../core/store.dart';
import 'invoice_screen.dart';

class AppSettings {
  String serverUrl;
  String printer;
  AppSettings({this.serverUrl = 'http://localhost:4100', this.printer = ''});
  Map<String, dynamic> toJson() => {'serverUrl': serverUrl, 'printer': printer};
  factory AppSettings.fromJson(Map<String, dynamic> j) => AppSettings(
    serverUrl: (j['serverUrl'] ?? 'http://localhost:4100') as String,
    printer: (j['printer'] ?? '') as String,
  );
}

/// The shell: billing, the outbox of saved invoices, and settings. A rail on wide screens (PC, tablet), a bottom bar on a phone.
class HomeShell extends StatefulWidget {
  final AppStore store;
  final AppSettings settings;
  final Future<void> Function() onSaveSettings;
  final VoidCallback onSignOut;
  const HomeShell({
    super.key,
    required this.store,
    required this.settings,
    required this.onSaveSettings,
    required this.onSignOut,
  });

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int tab = 0;

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 840;
    return ListenableBuilder(
      listenable: widget.store,
      builder: (context, _) {
        final waiting = widget.store.waiting;
        final pages = [
          InvoiceScreen(store: widget.store),
          OutboxScreen(store: widget.store, printer: widget.settings.printer),
          SettingsScreen(
            store: widget.store,
            settings: widget.settings,
            onSave: widget.onSaveSettings,
            onSignOut: widget.onSignOut,
          ),
        ];
        final dests = [
          const NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long),
            label: 'Bill',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: waiting > 0,
              label: Text('$waiting'),
              child: const Icon(Icons.outbox_outlined),
            ),
            selectedIcon: const Icon(Icons.outbox),
            label: 'Outbox',
          ),
          const NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ];
        final body = IndexedStack(index: tab, children: pages);
        return Scaffold(
          appBar: AppBar(
            title: Text(
              widget.store.business.isEmpty
                  ? 'Varchasv'
                  : widget.store.business,
            ),
            actions: [
              if (widget.store.refreshing)
                const Padding(
                  padding: EdgeInsets.all(14),
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ),
              if (widget.store.refreshError != null)
                const Tooltip(
                  message: 'Working from the saved catalogue',
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Icon(Icons.cloud_off),
                  ),
                ),
            ],
          ),
          body: wide
              ? Row(
                  children: [
                    NavigationRail(
                      selectedIndex: tab,
                      onDestinationSelected: (i) => setState(() => tab = i),
                      labelType: NavigationRailLabelType.all,
                      destinations: [
                        for (final d in dests)
                          NavigationRailDestination(
                            icon: d.icon,
                            selectedIcon: d.selectedIcon,
                            label: Text(d.label),
                          ),
                      ],
                    ),
                    const VerticalDivider(width: 1),
                    Expanded(child: body),
                  ],
                )
              : body,
          bottomNavigationBar: wide
              ? null
              : NavigationBar(
                  selectedIndex: tab,
                  onDestinationSelected: (i) => setState(() => tab = i),
                  destinations: dests,
                ),
        );
      },
    );
  }
}

class OutboxScreen extends StatelessWidget {
  final AppStore store;
  final String printer;
  const OutboxScreen({super.key, required this.store, required this.printer});

  (String, Color) _badge(OutboxEntry e) => switch (e.state) {
    SyncState.pending => ('Waiting to send', Colors.orange),
    SyncState.syncing => ('Sending', Colors.blue),
    SyncState.synced => (
      e.number == null ? 'Saved' : 'Saved as ${e.number}',
      Colors.green,
    ),
    SyncState.failed => ('Refused: ${e.error}', Colors.red),
    SyncState.unsure => (
      'Not sure it arrived. Check the server before sending again.',
      Colors.deepOrange,
    ),
  };

  Future<void> _print(BuildContext context, OutboxEntry e) async {
    final m = ScaffoldMessenger.of(context);
    try {
      if (printer.isEmpty)
        throw StateError('Set the printer address in Settings first.');
      final r = await store.api.get(
        '/sales-invoices/${e.serverId}/escpos',
      ) as Map<String, dynamic>;
      await sendToPrinter(printer, base64Decode(r['base64'] as String));
      m.showSnackBar(const SnackBar(content: Text('Sent to the printer.')));
    } catch (x) {
      m.showSnackBar(
        SnackBar(
          content: Text('Could not print: ${x is StateError ? x.message : x}'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (store.outbox.isEmpty)
      return const Center(
        child: Text('Invoices you save appear here until the server has them.'),
      );
    return ListView.separated(
      key: const Key('outbox'),
      itemCount: store.outbox.length,
      separatorBuilder: (_, _) => const Divider(height: 1),
      itemBuilder: (context, i) {
        final e = store.outbox[i];
        final (text, colour) = _badge(e);
        return ListTile(
          title: Text(e.customerName),
          subtitle: Text(text, style: TextStyle(color: colour)),
          trailing: Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 4,
            children: [
              Text(
                '₹ ${formatIndian(e.total)}',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              if (e.state == SyncState.synced && e.serverId != null)
                IconButton(
                  tooltip: 'Print',
                  icon: const Icon(Icons.print_outlined),
                  onPressed: () => _print(context, e),
                ),
              if (e.state == SyncState.failed || e.state == SyncState.unsure)
                IconButton(
                  tooltip: 'Send again',
                  icon: const Icon(Icons.refresh),
                  onPressed: () => store.retry(e),
                ),
              if (e.state == SyncState.failed || e.state == SyncState.unsure)
                IconButton(
                  tooltip: 'Drop',
                  icon: const Icon(Icons.delete_outline),
                  onPressed: () => store.discard(e),
                ),
            ],
          ),
        );
      },
    );
  }
}

class SettingsScreen extends StatefulWidget {
  final AppStore store;
  final AppSettings settings;
  final Future<void> Function() onSave;
  final VoidCallback onSignOut;
  const SettingsScreen({
    super.key,
    required this.store,
    required this.settings,
    required this.onSave,
    required this.onSignOut,
  });

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late final printer = TextEditingController(text: widget.settings.printer);

  @override
  void dispose() {
    printer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.store;
    final stats = Perf.all();
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Catalogue', style: Theme.of(context).textTheme.titleMedium),
        Text(
          '${s.items.length} items, ${s.customers.length} customers${s.lastRefresh == null ? '' : ', updated ${s.lastRefresh!.toLocal().toString().substring(0, 16)}'}',
        ),
        if (s.refreshError != null)
          Text(
            'Last update failed (${s.refreshError}). Working from the saved catalogue.',
            style: const TextStyle(color: Colors.red),
          ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerLeft,
          child: OutlinedButton.icon(
            key: const Key('refresh'),
            onPressed: s.refreshing ? null : () => s.refresh(),
            icon: const Icon(Icons.sync),
            label: const Text('Update catalogue'),
          ),
        ),
        const Divider(height: 32),
        Text('Receipt printer', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        TextField(
          key: const Key('printer'),
          controller: printer,
          decoration: const InputDecoration(
            labelText: 'Address, for example 192.168.1.50:9100',
            helperText:
                'The Android and Windows apps print straight to the printer.',
          ),
          onChanged: (v) => widget.settings.printer = v.trim(),
          onSubmitted: (_) => widget.onSave(),
        ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerLeft,
          child: OutlinedButton(
            onPressed: widget.onSave,
            child: const Text('Save printer'),
          ),
        ),
        const Divider(height: 32),
        Text(
          'How fast it is on this device',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 4),
        const Text(
          'Times for the things you wait for, measured as you use the app. Milliseconds.',
          style: TextStyle(color: Colors.black54),
        ),
        const SizedBox(height: 8),
        if (stats.isEmpty)
          const Text('Nothing measured yet.')
        else
          Table(
            columnWidths: const {0: FlexColumnWidth(2)},
            children: [
              const TableRow(
                children: [
                  Text('Action'),
                  Text('Count'),
                  Text('p50'),
                  Text('p95'),
                  Text('p99'),
                  Text('Worst'),
                ],
              ),
              for (final p in stats)
                TableRow(
                  children: [
                    Text(p.name),
                    Text('${p.count}'),
                    Text(p.p50.toStringAsFixed(2)),
                    Text(p.p95.toStringAsFixed(2)),
                    Text(p.p99.toStringAsFixed(2)),
                    Text(p.max.toStringAsFixed(2)),
                  ],
                ),
            ],
          ),
        Align(
          alignment: Alignment.centerLeft,
          child: TextButton(
            onPressed: () => setState(() {}),
            child: const Text('Refresh numbers'),
          ),
        ),
        Align(
          alignment: Alignment.centerLeft,
          child: TextButton(
            key: const Key('reset-numbers'),
            onPressed: () => setState(Perf.reset),
            child: const Text('Start measuring again'),
          ),
        ),
        const Divider(height: 32),
        Align(
          alignment: Alignment.centerLeft,
          child: OutlinedButton.icon(
            key: const Key('sign-out'),
            onPressed: widget.onSignOut,
            icon: const Icon(Icons.logout),
            label: const Text('Sign out'),
          ),
        ),
      ],
    );
  }
}
