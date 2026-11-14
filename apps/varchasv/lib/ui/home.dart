import 'package:flutter/material.dart';

import '../app_state.dart';
import '../domain/role_home.dart';
import '../l10n/gen/app_localizations.dart';
import '../l10n/languages.dart';
import 'accounts_screen.dart';
import 'field_screen.dart';
import 'overview_screen.dart';
import 'hr_screen.dart';
import 'pos_screen.dart';
import 'sync_screen.dart';
import 'tools_screen.dart';
import 'vouchers_screen.dart';

/// Navigation shell: a side rail on wide screens (desktop, tablet) and a bottom bar on phones.
class HomeShell extends StatefulWidget {
  const HomeShell({super.key, required this.locale, required this.themeMode, required this.onLocale, required this.onThemeMode});
  final Locale locale;
  final ThemeMode themeMode;
  final ValueChanged<Locale> onLocale;
  final ValueChanged<ThemeMode> onThemeMode;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  AppSection? _section;

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final sync = AppScope.of(context).sync;
    return ListenableBuilder(listenable: sync ?? ValueNotifier(0), builder: (context, _) => _frame(context, t, sync?.rights));
  }

  Widget _frame(BuildContext context, AppLocalizations t, Set<String>? rights) {
    // Until the server has said what this person may do, every section shows (as in older versions).
    final sections = rights == null ? AppSection.values : visibleSections(rights);
    final landing = rights == null ? AppSection.overview : landingSection(rights);
    final current = sections.contains(_section) ? _section! : (sections.contains(landing) ? landing : sections.first);
    final index = sections.indexOf(current);
    (IconData, String) face(AppSection s) => switch (s) {
          AppSection.overview => (Icons.dashboard_outlined, t.navDashboard),
          AppSection.vouchers => (Icons.receipt_long_outlined, t.navVouchers),
          AppSection.chart => (Icons.account_tree_outlined, t.navChart),
          AppSection.trialBalance => (Icons.balance_outlined, t.navTrialBalance),
          AppSection.pos => (Icons.point_of_sale_outlined, t.navPos),
          AppSection.field => (Icons.work_outline, t.appFieldTitle),
          AppSection.hr => (Icons.badge_outlined, t.navHr),
          AppSection.more => (Icons.apps_outlined, t.toolsTitle),
          AppSection.sync => (Icons.sync, t.appSyncTitle),
        };
    final destinations = [for (final s in sections) face(s)];
    final body = switch (current) {
      AppSection.vouchers => const VouchersScreen(),
      AppSection.chart => const AccountsScreen(),
      AppSection.trialBalance => const AccountsScreen(key: ValueKey('tb'), trialBalance: true),
      AppSection.pos => const PosScreen(),
      AppSection.field => const FieldScreen(),
      AppSection.hr => const HrScreen(),
      AppSection.more => const ToolsScreen(),
      AppSection.sync => const SyncScreen(),
      AppSection.overview => const OverviewScreen(),
    };
    void pick(int i) => setState(() => _section = sections[i]);
    final wide = MediaQuery.sizeOf(context).width >= 720;

    final actions = [
      PopupMenuButton<Locale>(
        tooltip: t.commonLanguage,
        icon: const Icon(Icons.translate),
        initialValue: widget.locale,
        onSelected: widget.onLocale,
        itemBuilder: (_) => [for (final l in appLanguages) PopupMenuItem(value: Locale(l.code), child: Text(l.native))],
      ),
      PopupMenuButton<ThemeMode>(
        tooltip: t.commonTheme,
        icon: const Icon(Icons.contrast),
        initialValue: widget.themeMode,
        onSelected: widget.onThemeMode,
        itemBuilder: (_) => [
          PopupMenuItem(value: ThemeMode.system, child: Text(t.commonSystem)),
          PopupMenuItem(value: ThemeMode.light, child: Text(t.commonLight)),
          PopupMenuItem(value: ThemeMode.dark, child: Text(t.commonDark)),
        ],
      ),
      const SizedBox(width: 8),
    ];

    return Scaffold(
      appBar: AppBar(title: Text(t.brandFull), actions: actions),
      body: wide
          ? Row(children: [
              NavigationRail(
                selectedIndex: index,
                onDestinationSelected: pick,
                labelType: NavigationRailLabelType.all,
                destinations: [for (final d in destinations) NavigationRailDestination(icon: Icon(d.$1), label: Text(d.$2))],
              ),
              const VerticalDivider(width: 1),
              Expanded(child: body),
            ])
          : body,
      bottomNavigationBar: wide
          ? null
          : NavigationBar(
              selectedIndex: index,
              onDestinationSelected: pick,
              destinations: [for (final d in destinations) NavigationDestination(icon: Icon(d.$1), label: d.$2)],
            ),
    );
  }
}
