/// Which parts of the app a person sees and where they land, from the rights their role gives them on the server.
/// A cashier opens straight onto the counter, an accountant onto the day's figures, HR onto people, and nobody is shown a
/// screen the server would refuse them.
library;

enum AppSection { overview, vouchers, chart, trialBalance, pos, field, hr, more, sync }

/// The smaller jobs gathered under one place so the navigation stays short. Each needs its own right; the place itself shows when any one does.
enum Tool { cashEntry, stockAudit, customers, reports, token }

/// The right needed to see each section. All of them in the list are needed; sync needs nothing.
const sectionRights = <AppSection, List<String>>{
  AppSection.overview: ['reports.view'],
  AppSection.vouchers: ['accounts.view'],
  AppSection.chart: ['accounts.view'],
  AppSection.trialBalance: ['accounts.view'],
  AppSection.pos: ['sales.create'],
  AppSection.field: ['crm.view'],
  AppSection.hr: ['hr.view'],
  AppSection.more: [],
  AppSection.sync: [],
};

const toolRights = <Tool, List<String>>{
  Tool.cashEntry: ['accounts.create'],
  Tool.stockAudit: ['inventory.create'],
  Tool.customers: ['sales.view'],
  Tool.reports: ['reports.view'],
  Tool.token: ['sales.create'],
};

List<Tool> visibleTools(Set<String> rights) => [
      for (final t in Tool.values)
        if (toolRights[t]!.every(rights.contains)) t,
    ];

/// Sections in the order the navigation shows them.
List<AppSection> visibleSections(Set<String> rights) => [
      for (final s in AppSection.values)
        if (sectionRights[s]!.every(rights.contains) && (s != AppSection.more || visibleTools(rights).isNotEmpty)) s,
    ];

/// The section to open first. Someone who mainly serves the counter, runs the field or looks after staff opens there;
/// everyone else (owner, accountant, manager) opens on the figures, or on the first section they can see.
AppSection landingSection(Set<String> rights) {
  final visible = visibleSections(rights);
  final books = rights.contains('accounts.view');
  if (!books) {
    for (final s in [AppSection.pos, AppSection.hr, AppSection.field, AppSection.more]) {
      if (visible.contains(s)) return s;
    }
  }
  if (visible.contains(AppSection.overview)) return AppSection.overview;
  return visible.firstWhere((s) => s != AppSection.sync && s != AppSection.more, orElse: () => AppSection.sync);
}
