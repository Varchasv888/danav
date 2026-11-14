import 'package:flutter/material.dart';

import '../app_state.dart';
import '../data/audit.dart';
import '../data/books.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';

/// A spot check by scanning: start a count for the store, scan or type codes (a scanner that types works as it is), fix a quantity, and send it.
class AuditScreen extends StatefulWidget {
  const AuditScreen({super.key});

  @override
  State<AuditScreen> createState() => _AuditScreenState();
}

class _AuditScreenState extends State<AuditScreen> {
  AuditSession? _session;
  String? _store;
  bool _loaded = false;
  final _name = TextEditingController();
  final _code = TextEditingController();
  final _focus = FocusNode();
  String? _lastScan;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loaded) return;
    _loaded = true;
    _reload();
  }

  Future<void> _reload() async {
    final audit = StockAudit(AppScope.of(context).db);
    final s = await audit.current();
    final store = await audit.store();
    if (mounted) setState(() { _session = s; _store = store?.name; });
  }

  void _say(String text) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  String _why(AppLocalizations t, String code) => switch (code) {
        'unknown_code' => t.auditUnknownCode,
        'no_store' => t.auditNoStore,
        'nothing_counted' => t.auditNothing,
        'audit_in_progress' => t.auditInProgress,
        'not_goods' => t.auditNotGoods,
        _ => errorText(t, code),
      };

  Future<void> _run(Future<void> Function(StockAudit a) fn) async {
    final t = AppLocalizations.of(context);
    try {
      await fn(StockAudit(AppScope.of(context).db));
      await _reload();
    } on BooksException catch (e) {
      if (mounted) _say(_why(t, e.code));
    }
  }

  @override
  void dispose() {
    _name.dispose();
    _code.dispose();
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final s = _session;
    return Scaffold(
      appBar: AppBar(title: Text(t.toolStockAudit)),
      body: s == null
          ? ListView(padding: const EdgeInsets.all(16), children: [
              Text(_store == null ? t.auditNoStore : t.auditStore(_store!)),
              TextField(controller: _name, decoration: InputDecoration(labelText: t.auditNameHint)),
              const SizedBox(height: 12),
              FilledButton(onPressed: _store == null ? null : () => _run((a) async { await a.start(_name.text); _name.clear(); }), child: Text(t.auditStart)),
            ])
          : Column(children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(children: [
                  Expanded(
                    child: TextField(
                      controller: _code,
                      focusNode: _focus,
                      autofocus: true,
                      decoration: InputDecoration(labelText: t.auditScanHint, prefixIcon: const Icon(Icons.qr_code_scanner)),
                      onSubmitted: (v) async {
                        final code = v;
                        _code.clear();
                        _focus.requestFocus();
                        await _run((a) async { _lastScan = (await a.scan(code)).name; });
                      },
                    ),
                  ),
                ]),
              ),
              if (_lastScan != null) Padding(padding: const EdgeInsets.symmetric(horizontal: 16), child: Align(alignment: Alignment.centerLeft, child: Text(t.auditLastScan(_lastScan!)))),
              Padding(padding: const EdgeInsets.all(16), child: Align(alignment: Alignment.centerLeft, child: Text('${s.name} · ${s.store} · ${t.auditCounted(s.lines.length, s.pieces)}', style: Theme.of(context).textTheme.titleSmall))),
              Expanded(
                child: ListView(children: [
                  for (final l in s.lines.reversed)
                    ListTile(
                      title: Text(l.name),
                      subtitle: Text(l.code ?? ''),
                      trailing: SizedBox(
                        width: 90,
                        child: TextFormField(
                          key: ValueKey('${l.itemId}-${l.qty}'),
                          initialValue: l.qty,
                          textAlign: TextAlign.right,
                          keyboardType: TextInputType.number,
                          onFieldSubmitted: (v) => _run((a) => a.setQty(l.itemId, v)),
                        ),
                      ),
                    ),
                ]),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(children: [
                  TextButton(
                    onPressed: () async {
                      final ok = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: Text(t.auditDiscardAsk),
                          actions: [TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text(t.commonCancel)), FilledButton(onPressed: () => Navigator.pop(ctx, true), child: Text(t.auditDiscard))],
                        ),
                      );
                      if (ok == true) await _run((a) => a.discard());
                    },
                    child: Text(t.auditDiscard),
                  ),
                  const Spacer(),
                  FilledButton(
                    onPressed: s.lines.isEmpty
                        ? null
                        : () async {
                            final sync = AppScope.of(context).sync;
                            await _run((a) => a.submit());
                            sync?.syncNow();
                            if (mounted) _say(t.auditSent);
                          },
                    child: Text(t.auditSubmit),
                  ),
                ]),
              ),
            ]),
    );
  }
}
