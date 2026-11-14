import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../app_state.dart';
import '../data/database.dart';
import '../data/tokens.dart';
import '../l10n/gen/app_localizations.dart';
import 'format.dart';

/// A queue token for the customer waiting (and, if they give a mobile number, sent to them), and the day's bills as slips to hand over or share.
class TokenScreen extends StatefulWidget {
  const TokenScreen({super.key});

  @override
  State<TokenScreen> createState() => _TokenScreenState();
}

class _TokenScreenState extends State<TokenScreen> {
  String? _token;
  bool? _sent;
  final _phone = TextEditingController();

  @override
  void dispose() {
    _phone.dispose();
    super.dispose();
  }

  Future<void> _issue() async {
    final app = AppScope.of(context);
    final tokens = Tokens(app.db);
    final n = await tokens.next(todayIso());
    final phone = _phone.text.trim();
    final sent = phone.isEmpty ? null : await tokens.send(app.api, token: n, phone: phone);
    if (mounted) setState(() { _token = n; _sent = sent; _phone.clear(); });
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final app = AppScope.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(t.toolToken)),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        TextField(controller: _phone, decoration: InputDecoration(labelText: t.tokenPhone), keyboardType: TextInputType.phone, maxLength: 10, inputFormatters: [FilteringTextInputFormatter.digitsOnly]),
        FilledButton.icon(icon: const Icon(Icons.confirmation_number_outlined), onPressed: _issue, label: Text(t.tokenNext)),
        if (_token != null) ...[
          const SizedBox(height: 16),
          Center(child: Text(_token!, style: Theme.of(context).textTheme.displayLarge)),
          if (_sent != null) Center(child: Text(_sent! ? t.tokenSent : t.tokenNotSent)),
        ],
        const Divider(height: 32),
        Text(t.tokenSlips, style: Theme.of(context).textTheme.titleSmall),
        StreamBuilder<List<PosBill>>(
          stream: app.pos.watchBills(todayIso()),
          builder: (context, snap) => Column(children: [
            if ((snap.data ?? const []).isEmpty) Padding(padding: const EdgeInsets.all(8), child: Text(t.appFieldNone)),
            for (final b in snap.data ?? const <PosBill>[])
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(b.number),
                subtitle: Text(b.customerName ?? ''),
                trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                  Text(rupees(b.total)),
                  IconButton(
                    tooltip: t.tokenCopy,
                    icon: const Icon(Icons.copy),
                    onPressed: () async {
                      await Clipboard.setData(ClipboardData(text: slipText(b, shop: app.businessName)));
                      if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(t.tokenCopied)));
                    },
                  ),
                ]),
              ),
          ]),
        ),
      ]),
    );
  }
}
