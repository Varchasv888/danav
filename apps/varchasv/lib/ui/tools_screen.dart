import 'package:flutter/material.dart';

import '../app_state.dart';
import '../domain/role_home.dart';
import '../l10n/gen/app_localizations.dart';
import 'audit_screen.dart';
import 'cash_entry_screen.dart';
import 'customers_screen.dart';
import 'reports_screen.dart';
import 'token_screen.dart';

/// The smaller jobs in one place: each tile opens a screen, and only the tiles the person's rights allow are shown.
class ToolsScreen extends StatelessWidget {
  const ToolsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final rights = AppScope.of(context).sync?.rights;
    final tools = rights == null ? Tool.values : visibleTools(rights);
    (IconData, String, Widget) face(Tool x) => switch (x) {
          Tool.cashEntry => (Icons.payments_outlined, t.toolCashEntry, const CashEntryScreen()),
          Tool.stockAudit => (Icons.qr_code_scanner, t.toolStockAudit, const AuditScreen()),
          Tool.customers => (Icons.person_search_outlined, t.toolCustomers, const CustomersScreen()),
          Tool.reports => (Icons.bar_chart_outlined, t.toolReports, const ReportsScreen()),
          Tool.token => (Icons.confirmation_number_outlined, t.toolToken, const TokenScreen()),
        };
    return GridView.count(
      padding: const EdgeInsets.all(16),
      crossAxisCount: MediaQuery.sizeOf(context).width >= 720 ? 4 : 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.3,
      children: [
        for (final x in tools)
          Card(
            child: InkWell(
              onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => face(x).$3)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Icon(face(x).$1, size: 36, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(height: 8),
                  Text(face(x).$2, textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleSmall),
                ]),
              ),
            ),
          ),
      ],
    );
  }
}
