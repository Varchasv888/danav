import 'package:flutter/material.dart';

import '../core/api.dart';

/// Server address, email and password. The session cookie is kept so the next start goes straight in.
class LoginScreen extends StatefulWidget {
  final HttpApi api;
  final String initialUrl;
  final bool canWorkOffline;
  final Future<void> Function(String url) onLoggedIn;
  final VoidCallback onOffline;
  const LoginScreen({
    super.key,
    required this.api,
    required this.initialUrl,
    required this.canWorkOffline,
    required this.onLoggedIn,
    required this.onOffline,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late final url = TextEditingController(text: widget.initialUrl);
  final email = TextEditingController();
  final password = TextEditingController();
  bool busy = false;
  String? error;

  Future<void> _go() async {
    setState(() {
      busy = true;
      error = null;
    });
    try {
      widget.api.baseUrl = url.text.trim();
      await widget.api.login(email.text.trim(), password.text);
      await widget.onLoggedIn(url.text.trim());
    } on ApiException catch (e) {
      error = switch (e.status) {
        401 => 'Email or password is not right.',
        429 => 'Too many attempts. Wait a few minutes and try again.',
        _ => 'The server refused the sign in (${e.code}).',
      };
    } on NetworkException {
      error =
          'Cannot reach the server at ${url.text.trim()}. Check the address and your connection.';
    }
    if (mounted) setState(() => busy = false);
  }

  @override
  void dispose() {
    url.dispose();
    email.dispose();
    password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 400),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: AutofillGroup(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Varchasv',
                  style: Theme.of(context).textTheme.headlineMedium
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 4),
                const Text('Sign in to start billing.'),
                const SizedBox(height: 20),
                TextField(
                  key: const Key('server'),
                  controller: url,
                  keyboardType: TextInputType.url,
                  decoration: const InputDecoration(
                    labelText: 'Server address',
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  key: const Key('email'),
                  controller: email,
                  keyboardType: TextInputType.emailAddress,
                  autofillHints: const [AutofillHints.username],
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                const SizedBox(height: 12),
                TextField(
                  key: const Key('password'),
                  controller: password,
                  obscureText: true,
                  autofillHints: const [AutofillHints.password],
                  onSubmitted: (_) => _go(),
                  decoration: const InputDecoration(labelText: 'Password'),
                ),
                if (error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 12),
                    child: Text(
                      error!,
                      key: const Key('login-error'),
                      style: const TextStyle(color: Colors.red),
                    ),
                  ),
                const SizedBox(height: 20),
                FilledButton(
                  key: const Key('sign-in'),
                  onPressed: busy ? null : _go,
                  child: Text(busy ? 'Signing in' : 'Sign in'),
                ),
                if (widget.canWorkOffline)
                  TextButton(
                    onPressed: widget.onOffline,
                    child: const Text('Work offline with the saved catalogue'),
                  ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}
