import 'package:flutter_test/flutter_test.dart';
import 'package:varchasv/domain/role_home.dart';

void main() {
  test('an owner sees everything and lands on the figures', () {
    final all = {for (final r in [...sectionRights.values, ...toolRights.values]) ...r};
    expect(visibleSections(all), AppSection.values);
    expect(landingSection(all), AppSection.overview);
  });

  test('a cashier sees the counter and the sync screen, and opens on the counter', () {
    const cashier = {'sales.view', 'sales.create'};
    expect(visibleSections(cashier), [AppSection.pos, AppSection.more, AppSection.sync]);
    expect(visibleTools(cashier), [Tool.customers, Tool.token]);
    expect(landingSection(cashier), AppSection.pos);
  });

  test('an accountant sees the books and opens on the figures', () {
    const accountant = {'accounts.view', 'accounts.create', 'reports.view'};
    expect(visibleSections(accountant), [AppSection.overview, AppSection.vouchers, AppSection.chart, AppSection.trialBalance, AppSection.more, AppSection.sync]);
    expect(landingSection(accountant), AppSection.overview);
    expect(visibleTools(accountant), [Tool.cashEntry, Tool.reports]);
  });

  test('HR and field staff open on their own screen', () {
    expect(landingSection({'hr.view'}), AppSection.hr);
    expect(landingSection({'crm.view'}), AppSection.field);
    // With the books as well, the books win.
    expect(landingSection({'hr.view', 'accounts.view'}), AppSection.vouchers);
  });

  test('someone with no rights at all still gets the sync screen', () {
    expect(visibleSections(const {}), [AppSection.sync]);
    expect(landingSection(const {}), AppSection.sync);
  });
}
