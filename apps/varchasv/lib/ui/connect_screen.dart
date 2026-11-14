import 'package:flutter/material.dart';

import '../app_state.dart';
import '../l10n/gen/app_localizations.dart';
import 'errors.dart';

class ConnectScreen extends StatefulWidget {
  const ConnectScreen({super.key});

  @override
  State<ConnectScreen> createState() => _ConnectScreenState();
}

class _ConnectScreenState extends State<ConnectScreen> {
  final _form = GlobalKey<FormState>();
  late final _server = TextEditingController(text: defaultServerUrl);
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _server.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _connect() async {
    if (!_form.currentState!.validate()) return;
    final t = AppLocalizations.of(context);
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await AppScope.of(context).connect(server: _server.text, email: _email.text, password: _password.text);
    } on ConnectException catch (e) {
      setState(() => _error = errorText(t, e.code));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final text = Theme.of(context).textTheme;
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Form(
              key: _form,
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                Row(children: [
                  Container(
                    width: 40, height: 40, alignment: Alignment.center,
                    decoration: BoxDecoration(color: Theme.of(context).colorScheme.secondary, borderRadius: BorderRadius.circular(10)),
                    child: const Text('व', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 12),
                  Text(t.brandFull, style: text.titleMedium),
                ]),
                const SizedBox(height: 32),
                Text(t.appConnectTitle, style: text.headlineSmall),
                const SizedBox(height: 8),
                Text(t.appConnectSubtitle, style: text.bodyMedium),
                const SizedBox(height: 24),
                if (_error != null) ...[
                  Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  const SizedBox(height: 12),
                ],
                TextFormField(controller: _email, decoration: InputDecoration(labelText: t.authEmail), keyboardType: TextInputType.emailAddress, autofillHints: const [AutofillHints.email],
                    validator: (v) => (v ?? '').contains('@') ? null : t.authEmail),
                const SizedBox(height: 12),
                TextFormField(controller: _password, decoration: InputDecoration(labelText: t.authPassword), obscureText: true, autofillHints: const [AutofillHints.password],
                    onFieldSubmitted: (_) => _connect(), validator: (v) => (v ?? '').isEmpty ? t.authPassword : null),
                const SizedBox(height: 12),
                TextFormField(controller: _server, decoration: InputDecoration(labelText: t.appServer), keyboardType: TextInputType.url),
                const SizedBox(height: 24),
                FilledButton(onPressed: _busy ? null : _connect, child: Text(_busy ? t.appConnecting : t.appConnect)),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}
