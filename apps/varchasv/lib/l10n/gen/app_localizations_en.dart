// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get brandName => 'Varchasv';

  @override
  String get brandFull => 'Varchasv ERP Systems';

  @override
  String get brandTagline =>
      'Accounts, GST, stock and payroll, online and offline, in your language.';

  @override
  String get commonSave => 'Save';

  @override
  String get commonSaving => 'Saving…';

  @override
  String get commonSaved => 'Saved';

  @override
  String get commonCancel => 'Cancel';

  @override
  String get commonEdit => 'Edit';

  @override
  String get commonAdd => 'Add';

  @override
  String get commonClose => 'Close';

  @override
  String get commonLoading => 'Loading…';

  @override
  String get commonOptional => 'optional';

  @override
  String get commonLanguage => 'Language';

  @override
  String get commonTheme => 'Theme';

  @override
  String get commonLight => 'Light';

  @override
  String get commonDark => 'Dark';

  @override
  String get commonSystem => 'System';

  @override
  String commonComingSoon(String phase) {
    return 'Coming in phase $phase';
  }

  @override
  String get commonNone => 'None';

  @override
  String get commonYes => 'Yes';

  @override
  String get commonNo => 'No';

  @override
  String get commonSearch => 'Search';

  @override
  String get commonAll => 'All';

  @override
  String get commonFrom => 'From';

  @override
  String get commonTo => 'To';

  @override
  String get commonAsOf => 'As of';

  @override
  String get commonTotal => 'Total';

  @override
  String get commonDebit => 'Debit';

  @override
  String get commonCredit => 'Credit';

  @override
  String get commonBalance => 'Balance';

  @override
  String get commonDate => 'Date';

  @override
  String get commonNarration => 'Narration';

  @override
  String get commonActions => 'Actions';

  @override
  String get commonBack => 'Back';

  @override
  String get commonApply => 'Show';

  @override
  String get commonRemove => 'Remove';

  @override
  String get commonCopy => 'Copy';

  @override
  String get commonCopied => 'Copied';

  @override
  String get commonDr => 'Dr';

  @override
  String get commonCr => 'Cr';

  @override
  String get commonView => 'View';

  @override
  String get commonArchived => 'Archived';

  @override
  String get commonPrint => 'Print';

  @override
  String commonListCapped(String count) {
    return 'Showing the latest $count documents. Choose dates to see older ones.';
  }

  @override
  String get authLoginTitle => 'Sign in to your business';

  @override
  String get authLoginSubtitle => 'Welcome back.';

  @override
  String get authSignupTitle => 'Start your business on Varchasv';

  @override
  String get authSignupSubtitle =>
      'Free for businesses under ₹40 lakh turnover. No card needed.';

  @override
  String get authEmail => 'Email';

  @override
  String get authPassword => 'Password';

  @override
  String get authPasswordHint => 'At least 8 characters';

  @override
  String get authName => 'Your name';

  @override
  String get authBusinessName => 'Business name';

  @override
  String get authState => 'State';

  @override
  String get authGstin => 'GSTIN';

  @override
  String get authGstinHint => 'Leave empty if you are not registered for GST';

  @override
  String get authIndustry => 'Type of business';

  @override
  String get authLogin => 'Sign in';

  @override
  String get authSignup => 'Create account';

  @override
  String get authLogout => 'Sign out';

  @override
  String get authNoAccount => 'New to Varchasv?';

  @override
  String get authHaveAccount => 'Already have an account?';

  @override
  String get authCreateOne => 'Create an account';

  @override
  String get authSignInInstead => 'Sign in';

  @override
  String get authErrorsInvalidCredentials =>
      'That email and password don\'t match.';

  @override
  String get authErrorsEmailTaken =>
      'An account with this email already exists.';

  @override
  String get authErrorsGstinLength => 'A GSTIN has 15 characters.';

  @override
  String get authErrorsGstinFormat => 'This doesn\'t look like a GSTIN.';

  @override
  String get authErrorsGstinState =>
      'The GSTIN starts with an unknown state code.';

  @override
  String get authErrorsGstinChecksum =>
      'This GSTIN has a typo: its last character doesn\'t match.';

  @override
  String get authErrorsGstinStateMismatch =>
      'This GSTIN belongs to a different state than the one selected.';

  @override
  String get authErrorsValidation => 'Please check the highlighted fields.';

  @override
  String get authErrorsGeneric => 'Something went wrong. Please try again.';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'This link has expired or was already used. Ask for a new one.';

  @override
  String get authErrorsWrongPassword => 'Your current password is wrong.';

  @override
  String get authErrorsPasswordsDiffer => 'The two passwords don\'t match.';

  @override
  String get authErrorsNeedsChangeDate =>
      'You are not allowed to back-date a document. Use today\'s date, or ask the owner for the right.';

  @override
  String get authErrorsNeedsFutureDate =>
      'You are not allowed to future-date a document. Use today\'s date, or ask the owner for the right.';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'A line is priced below its cost. You are not allowed to sell below cost; raise the rate or ask the owner.';

  @override
  String get authForgotLink => 'Forgot password?';

  @override
  String get authForgotTitle => 'Reset your password';

  @override
  String get authForgotSubtitle =>
      'Enter your account email and we\'ll send you a link to choose a new password.';

  @override
  String get authSendLink => 'Send reset link';

  @override
  String authForgotSent(String email) {
    return 'If an account exists for $email, a reset link is on its way. It works once and expires in an hour.';
  }

  @override
  String get authBackToLogin => 'Back to sign in';

  @override
  String get authResetTitle => 'Choose a new password';

  @override
  String get authNewPassword => 'New password';

  @override
  String get authConfirmPassword => 'Repeat new password';

  @override
  String get authSetPassword => 'Set password';

  @override
  String get authResetDone =>
      'Your password has been changed and you have been signed out everywhere. Sign in with the new password.';

  @override
  String get shellGoTo => 'Go to…';

  @override
  String get shellGoToPlaceholder => 'Go to a screen or start an entry';

  @override
  String shellNoMatch(String query) {
    return 'Nothing matches “$query”.';
  }

  @override
  String get shellTallyKeys =>
      'Tally keys work anywhere outside a text field: F4 contra, F5 payment, F6 receipt, F7 journal, F8 sales, F9 purchase.';

  @override
  String get shellCreate => 'New';

  @override
  String get shellEntries => 'Start an entry';

  @override
  String get shellScreens => 'Screens';

  @override
  String get shellMenu => 'Menu';

  @override
  String shellFy(String years) {
    return 'FY $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type voucher';
  }

  @override
  String get shellFold => 'Fold the menu';

  @override
  String get shellUnfold => 'Open the menu';

  @override
  String get accountTitle => 'My account';

  @override
  String get accountSubtitle =>
      'Your name and password, used for every business you belong to.';

  @override
  String get accountProfile => 'Profile';

  @override
  String get accountSave => 'Save';

  @override
  String get accountSaved => 'Saved';

  @override
  String get accountPasswordTitle => 'Change password';

  @override
  String get accountCurrentPassword => 'Current password';

  @override
  String get accountPasswordChanged =>
      'Password changed. Your other devices have been signed out.';

  @override
  String get industryApparel => 'Apparel and textiles';

  @override
  String get industryGeneral => 'General';

  @override
  String get industryTrading => 'Trading / distribution';

  @override
  String get industryManufacturing => 'Manufacturing';

  @override
  String get industryRetail => 'Retail shop';

  @override
  String get industryServices => 'Services';

  @override
  String get navDashboard => 'Dashboard';

  @override
  String get navSales => 'Sales';

  @override
  String get navPurchase => 'Purchase';

  @override
  String get navInventory => 'Inventory';

  @override
  String get navAccounts => 'Accounts';

  @override
  String get navGst => 'GST';

  @override
  String get navHr => 'HR & payroll';

  @override
  String get navReports => 'Reports';

  @override
  String get navSettings => 'Settings';

  @override
  String get navCompany => 'Company & branches';

  @override
  String get navNumberSeries => 'Number series';

  @override
  String get navAuditLog => 'Audit trail';

  @override
  String get navTools => 'Tools';

  @override
  String get navTeam => 'Team & roles';

  @override
  String get navChart => 'Chart of accounts';

  @override
  String get navVouchers => 'Vouchers and coupons';

  @override
  String get navTrialBalance => 'Trial balance';

  @override
  String get navProfitLoss => 'Profit & loss';

  @override
  String get navBalanceSheet => 'Balance sheet';

  @override
  String get navFinancialYears => 'Financial years';

  @override
  String get navItems => 'Items';

  @override
  String get navStock => 'Stock summary';

  @override
  String get navStockJournals => 'Stock journals';

  @override
  String get navReorder => 'Reorder';

  @override
  String get navPurchaseOrders => 'Purchase orders';

  @override
  String get navGoodsReceipts => 'Inward challans';

  @override
  String get navPurchaseBills => 'Purchase bills';

  @override
  String get navPurchaseReturns => 'Purchase returns';

  @override
  String get navSalesOrders => 'Sales orders';

  @override
  String get navDeliveryNotes => 'Delivery challans';

  @override
  String get navSalesInvoices => 'Sales invoices';

  @override
  String get navCreditNotes => 'Credit notes';

  @override
  String get navReceivables => 'Receivables';

  @override
  String get navPayables => 'Payables';

  @override
  String get navGstReturns => 'GST returns';

  @override
  String get navGstSettings => 'GST & invoicing';

  @override
  String get navImport => 'Import data';

  @override
  String get navQuotations => 'Quotations';

  @override
  String get navEmployees => 'Employees';

  @override
  String get navAttendance => 'Attendance';

  @override
  String get navLeave => 'Leave';

  @override
  String get navPayroll => 'Payroll';

  @override
  String get navPayrollSettings => 'Payroll';

  @override
  String get navStatutory => 'Statutory & TDS';

  @override
  String get navManufacturing => 'Manufacturing';

  @override
  String get navBoms => 'Bills of materials';

  @override
  String get navProduction => 'Production orders';

  @override
  String get navMrp => 'Material planning';

  @override
  String get navJobWork => 'Job work';

  @override
  String get navPos => 'Point of sale';

  @override
  String get navPosBilling => 'Billing';

  @override
  String get navPosBills => 'Bills';

  @override
  String get navPosSettings => 'Counter settings';

  @override
  String get navBanking => 'Banking';

  @override
  String get navBankAccounts => 'Bank reconciliation';

  @override
  String get navBankRules => 'Bank rules';

  @override
  String get navSettlements => 'Gateway settlements';

  @override
  String get navAssets => 'Fixed assets';

  @override
  String get navAssetRegister => 'Asset register';

  @override
  String get navDepreciation => 'Depreciation';

  @override
  String get navItDepreciation => 'Income-tax depreciation';

  @override
  String get navExpenses => 'Expenses';

  @override
  String get navExpenseClaims => 'Expense claims';

  @override
  String get navExpenseCategories => 'Expense categories';

  @override
  String get navProjects => 'Projects';

  @override
  String get navProjectList => 'Projects';

  @override
  String get navTimesheets => 'Timesheets';

  @override
  String get navAssistant => 'Assistant';

  @override
  String get navCrm => 'CRM';

  @override
  String get navLeads => 'Leads';

  @override
  String get navFollowUps => 'Follow-ups';

  @override
  String get navMessageTemplates => 'Message templates';

  @override
  String get navReportBuilder => 'Report builder';

  @override
  String get navSavedReports => 'Saved reports';

  @override
  String get navChecks => 'Checks';

  @override
  String get navStyles => 'Styles';

  @override
  String get navProformas => 'Proforma invoices';

  @override
  String get navApprovals => 'Goods on approval';

  @override
  String get navPriceLists => 'Price lists';

  @override
  String get navInterest => 'Interest on overdue';

  @override
  String get navAgents => 'Agent commission';

  @override
  String get navTargets => 'Salesman targets';

  @override
  String get navSchemes => 'Schemes and offers';

  @override
  String get navPosReturns => 'Returns and exchanges';

  @override
  String get navAlterations => 'Alterations';

  @override
  String get navTailoring => 'Tailoring';

  @override
  String get navConsignment => 'Consignment';

  @override
  String get navCatalogue => 'Image catalogue';

  @override
  String get navInsights => 'Business insights';

  @override
  String get navSalesRegister => 'Sales register';

  @override
  String get navColourSize => 'Colour-size report';

  @override
  String get navStockAgeing => 'Stock ageing';

  @override
  String get navLabels => 'Barcode labels';

  @override
  String get navMessageLog => 'WhatsApp log';

  @override
  String get navMyMenu => 'My Menu';

  @override
  String get navAllActions => 'All actions';

  @override
  String get navStockCounts => 'Stock counts';

  @override
  String get navWorkspace => 'Workspace';

  @override
  String get navSalesPos => 'Sales and counter';

  @override
  String get navPromotions => 'Offers and pricing';

  @override
  String get navFinance => 'Accounts and banking';

  @override
  String get navOperations => 'Expenses, projects and assets';

  @override
  String get navMasters => 'Masters';

  @override
  String get navReportsHub => 'All reports';

  @override
  String get navMastersHub => 'All masters';

  @override
  String get navSizesColours => 'Sizes and colours';

  @override
  String get navBandWorkspace => 'Workspace';

  @override
  String get navBandCommerce => 'Selling';

  @override
  String get navBandSupply => 'Buying and stock';

  @override
  String get navBandProduction => 'Making and running';

  @override
  String get navBandMoney => 'Money and people';

  @override
  String get navBandInsight => 'Reports';

  @override
  String get navBandAdmin => 'Set-up';

  @override
  String get navIntegrity => 'Integrity check';

  @override
  String get navCfoView => 'Owner\'s view';

  @override
  String get navStockMovement => 'Fast and slow movers';

  @override
  String dashboardGreeting(String name) {
    return 'Namaste, $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return 'Here\'s where $business stands today.';
  }

  @override
  String get dashboardSetupTitle => 'Finish setting up';

  @override
  String get dashboardSetupCompany => 'Add your company details and PAN';

  @override
  String get dashboardSetupBranch => 'Add a GSTIN for each branch';

  @override
  String get dashboardSetupSeries => 'Check your invoice number series';

  @override
  String get dashboardRoadmapTitle => 'What\'s coming';

  @override
  String get dashboardCalcTitle => 'Quick GST calculator';

  @override
  String get dashboardCalcSubtitle =>
      'Works out CGST/SGST or IGST from the place of supply.';

  @override
  String get dashboardKSalesToday => 'Sales today';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'Yesterday $amount';
  }

  @override
  String get dashboardKSalesMonth => 'Sales this month';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'Same days last month $amount';
  }

  @override
  String get dashboardKReceivables => 'Receivables';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount overdue';
  }

  @override
  String get dashboardKPayables => 'Payables';

  @override
  String dashboardKDueSoon(String amount) {
    return '$amount due in 7 days';
  }

  @override
  String get dashboardKProfit => 'Profit this month';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'Gross profit $amount';
  }

  @override
  String get dashboardKStockValue => 'Stock value';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count items',
      one: '$count item',
    );
    return '$_temp0 below reorder level';
  }

  @override
  String get dashboardKPipeline => 'Sales pipeline';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$count open leads · weighted $amount';
  }

  @override
  String get dashboardKApprovals => 'Waiting for you';

  @override
  String get dashboardKClaims => 'expense claims';

  @override
  String get dashboardKTimesheets => 'timesheets';

  @override
  String get dashboardKLeave => 'leave requests';

  @override
  String get dashboardKNothingWaiting => 'Nothing waiting.';

  @override
  String get dashboardKSalesTrend => 'Sales, last 30 days';

  @override
  String get dashboardKCashBank => 'Cash and bank';

  @override
  String get dashboardKTopCustomers => 'Top customers this month';

  @override
  String get dashboardKTopItems => 'Best sellers this month';

  @override
  String get dashboardKTopDebtors => 'Largest amounts to collect';

  @override
  String get dashboardKAlerts => 'Needs attention';

  @override
  String get dashboardKNoAlerts => 'All clear.';

  @override
  String get dashboardKAsk => 'Ask the assistant';

  @override
  String dashboardKYesterday(String amount) {
    return 'Yesterday $amount';
  }

  @override
  String get dashboardPosition => 'Money position';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count accounts',
      one: '$count account',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'Business insights';

  @override
  String get insightsSubtitle =>
      'Sales, profit, stock and money for any period, against the same period last year.';

  @override
  String get insightsNoLastYear => 'new this year';

  @override
  String get insightsPts => 'pts';

  @override
  String get insightsVsLastYear => 'vs last year';

  @override
  String get insightsNoSales => 'No sales in this period.';

  @override
  String get insightsHideTable => 'Hide table';

  @override
  String get insightsShowTable => 'Show as a table';

  @override
  String get insightsPresetsThisMonth => 'This month';

  @override
  String get insightsPresetsLastMonth => 'Last month';

  @override
  String get insightsPresetsThisFy => 'This financial year';

  @override
  String get insightsPresetsLastFy => 'Last financial year';

  @override
  String get insightsPresetsLast12 => 'Last 12 months';

  @override
  String get insightsFrom => 'From';

  @override
  String get insightsTo => 'To';

  @override
  String get insightsApply => 'Show';

  @override
  String insightsCompared(String from, String to) {
    return 'Changes are against $from to $to.';
  }

  @override
  String get insightsKpiSales => 'Sales';

  @override
  String get insightsKpiPieces => 'Pieces sold';

  @override
  String get insightsKpiAvgBill => 'Average bill';

  @override
  String get insightsKpiProfit => 'Margin';

  @override
  String get insightsKpiPurchases => 'Purchases';

  @override
  String get insightsKpiStock => 'Stock now';

  @override
  String get insightsKpiReceivable => 'To collect';

  @override
  String get insightsKpiPayable => 'To pay';

  @override
  String get insightsBeforeTax => 'before GST, after returns';

  @override
  String insightsBillsCount(String n) {
    return 'Bills: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return '$v a piece';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n pieces';
  }

  @override
  String get insightsOwedToUs => 'owed by customers';

  @override
  String get insightsWeOwe => 'owed to suppliers';

  @override
  String get insightsTrend => 'Sales trend';

  @override
  String get insightsByMonth => 'By month, before GST';

  @override
  String get insightsByDay => 'By day, before GST';

  @override
  String get insightsWeekday => 'Busy days';

  @override
  String get insightsWeekdaySub => 'Sales by day of the week';

  @override
  String get insightsDaysD1 => 'Mon';

  @override
  String get insightsDaysD2 => 'Tue';

  @override
  String get insightsDaysD3 => 'Wed';

  @override
  String get insightsDaysD4 => 'Thu';

  @override
  String get insightsDaysD5 => 'Fri';

  @override
  String get insightsDaysD6 => 'Sat';

  @override
  String get insightsDaysD7 => 'Sun';

  @override
  String get insightsDesigns => 'Best designs';

  @override
  String get insightsByValue => 'By sales value';

  @override
  String get insightsSalesmen => 'Top salesmen';

  @override
  String get insightsSalesmenSub => 'Counter lines and invoices they sold';

  @override
  String get insightsNoSalesmen => 'No sales name a salesman yet.';

  @override
  String get insightsCustomers => 'Top customers';

  @override
  String get insightsCustomersSub => 'Invoiced customers, after returns';

  @override
  String get insightsBrands => 'Brands';

  @override
  String get insightsTenders => 'How customers paid';

  @override
  String get insightsTendersSub =>
      'With GST: counter payments and invoices on account';

  @override
  String get insightsModesCash => 'Cash';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'Card';

  @override
  String get insightsModesCredit => 'Counter on account';

  @override
  String get insightsModesInvoice => 'Invoices';

  @override
  String get insightsAgeing => 'Sales ageing';

  @override
  String get insightsAgeingSub =>
      'How long goods were with us before they sold';

  @override
  String get insightsAge => 'Age';

  @override
  String get insightsPieces => 'Pieces';

  @override
  String get insightsValue => 'Value';

  @override
  String get insightsAgesD030 => '0 to 30 days';

  @override
  String get insightsAgesD3160 => '31 to 60 days';

  @override
  String get insightsAgesD6190 => '61 to 90 days';

  @override
  String get insightsAgesD91180 => '91 to 180 days';

  @override
  String get insightsAgesD181365 => '6 to 12 months';

  @override
  String get insightsAgesY12 => '1 to 2 years';

  @override
  String get insightsAgesY2plus => 'Over 2 years';

  @override
  String get insightsErrorsInvalidPeriod =>
      'The start date is after the end date.';

  @override
  String insightsOnCost(String v) {
    return '$v over standard cost';
  }

  @override
  String get calcFrom => 'Supplier state';

  @override
  String get calcTo => 'Place of supply';

  @override
  String get calcQty => 'Quantity';

  @override
  String get calcRate => 'Rate (₹)';

  @override
  String get calcGstRate => 'GST %';

  @override
  String get calcTaxable => 'Taxable value';

  @override
  String get calcCgst => 'CGST';

  @override
  String get calcSgst => 'SGST';

  @override
  String get calcUtgst => 'UTGST';

  @override
  String get calcIgst => 'IGST';

  @override
  String get calcRoundOff => 'Round off';

  @override
  String get calcTotal => 'Total';

  @override
  String get calcInWords => 'In words';

  @override
  String get calcCess => 'Cess';

  @override
  String get companyTitle => 'Company & branches';

  @override
  String get companySubtitle =>
      'Legal details and one branch per GSTIN or location.';

  @override
  String get companyName => 'Display name';

  @override
  String get companyLegalName => 'Legal name';

  @override
  String get companyPan => 'PAN';

  @override
  String get companyBooksBegin => 'Books begin on';

  @override
  String get companyBranches => 'Branches';

  @override
  String get companyAddBranch => 'Add branch';

  @override
  String get companyBranchName => 'Branch name';

  @override
  String get companyHeadOffice => 'Head office';

  @override
  String get companyUnregistered => 'Not registered';

  @override
  String get companyCity => 'City';

  @override
  String get companyPincode => 'PIN code';

  @override
  String get seriesTitle => 'Number series';

  @override
  String get seriesSubtitle =>
      'How invoices and vouchers are numbered. GST allows at most 16 characters: letters, digits, - and /.';

  @override
  String get seriesDocType => 'Document';

  @override
  String get seriesPattern => 'Pattern';

  @override
  String get seriesNext => 'Next number';

  @override
  String get seriesFy => 'Financial year';

  @override
  String get seriesTokens =>
      'Tokens: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = device code (offline app)';

  @override
  String get seriesTypesSalesInvoice => 'Sales invoice';

  @override
  String get seriesTypesCreditNote => 'Credit note';

  @override
  String get seriesTypesDebitNote => 'Debit note';

  @override
  String get seriesTypesPurchaseBill => 'Purchase bill';

  @override
  String get seriesTypesReceipt => 'Receipt';

  @override
  String get seriesTypesPayment => 'Payment';

  @override
  String get seriesTypesJournal => 'Journal voucher';

  @override
  String get seriesErrorsSeriesTooLong =>
      'Numbers from this pattern would exceed 16 characters.';

  @override
  String get seriesErrorsSeriesBadChars =>
      'Only letters, digits, - and / are allowed.';

  @override
  String get seriesErrorsSeriesEmpty => 'The pattern must include a SEQ token.';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'The next number can\'t be lower than numbers already issued.';

  @override
  String get auditTitle => 'Audit trail';

  @override
  String get auditSubtitle =>
      'Every change, who made it and when. Entries can\'t be edited or deleted.';

  @override
  String get auditWhen => 'When';

  @override
  String get auditWho => 'Who';

  @override
  String get auditWhat => 'What';

  @override
  String get auditDetails => 'Details';

  @override
  String get auditLoadMore => 'Load older entries';

  @override
  String get auditActionsCreate => 'created';

  @override
  String get auditActionsUpdate => 'updated';

  @override
  String get auditActionsLogin => 'signed in';

  @override
  String get auditActionsDelete => 'deleted';

  @override
  String get auditActionsCancel => 'cancelled';

  @override
  String get auditVerify => 'Check the audit trail';

  @override
  String get auditVerifying => 'Checking...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'All $n entries are intact. Nothing has been changed or removed.',
      one: 'All $n entry is intact. Nothing has been changed or removed.',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'Entry number $seq does not match the entries before it ($reason). The audit trail has been altered or damaged. Keep a copy and contact support.';
  }

  @override
  String get auditReasonGap => 'an entry is missing';

  @override
  String get auditReasonLink => 'the order was broken';

  @override
  String get auditReasonContent => 'the entry was edited';

  @override
  String get auditVerifyFailed => 'The check could not run. Try again.';

  @override
  String get backupTitle => 'Backup and export';

  @override
  String get backupSubtitle =>
      'Your data is yours. Download all of it, any time, in files you can open without Varchasv.';

  @override
  String get backupDownload => 'Download everything (ZIP)';

  @override
  String get backupWhat => 'What you get';

  @override
  String get backupItem1 =>
      'Every table as a CSV file for Excel and as a JSON file with exact values.';

  @override
  String get backupItem2 => 'Every document you uploaded, as it was.';

  @override
  String get backupItem3 =>
      'A README that explains each table, and a list of checksums so you can show later that nothing changed.';

  @override
  String get backupLeftOut =>
      'Passwords, login tokens and tax-portal sessions are left out.';

  @override
  String get backupKeep =>
      'Keep the file somewhere safe. It holds your customers, suppliers, prices and books.';

  @override
  String get backupSlow => 'A large business can take a minute to prepare.';

  @override
  String get backupAuditLink => 'Check that your audit trail is untouched';

  @override
  String get roadmapAccounts => 'Accounting & GST filing';

  @override
  String get roadmapInventory => 'Inventory & purchasing';

  @override
  String get roadmapSales => 'Sales, e-invoice & e-way bill';

  @override
  String get roadmapOffline =>
      'Offline app for Windows, Mac, Linux, Android & iOS';

  @override
  String get roadmapPayroll => 'HR & payroll';

  @override
  String get switcherTitle => 'Your businesses';

  @override
  String get switcherAddBusiness => 'Add a business';

  @override
  String get switcherCreate => 'Create business';

  @override
  String get teamTitle => 'Team & roles';

  @override
  String get teamSubtitle =>
      'Who can use this business and what each person can do.';

  @override
  String get teamMembers => 'Members';

  @override
  String get teamInvite => 'Invite';

  @override
  String get teamInviteTitle => 'Invite someone';

  @override
  String get teamEmail => 'Email';

  @override
  String get teamRole => 'Role';

  @override
  String get teamStatus => 'Status';

  @override
  String get teamActive => 'Active';

  @override
  String get teamSuspended => 'Suspended';

  @override
  String get teamYou => 'you';

  @override
  String get teamPendingInvites => 'Pending invitations';

  @override
  String get teamExpires => 'Expires';

  @override
  String get teamRevoke => 'Revoke';

  @override
  String get teamSuspend => 'Suspend';

  @override
  String get teamReactivate => 'Reactivate';

  @override
  String get teamRemove => 'Remove';

  @override
  String get teamInviteLink => 'Invitation link';

  @override
  String get teamInviteLinkHint =>
      'We\'ve emailed it. You can also share it on WhatsApp: it works once and expires in 7 days.';

  @override
  String get teamRoles => 'Roles';

  @override
  String get teamNewRole => 'New role';

  @override
  String get teamRoleName => 'Role name';

  @override
  String get teamPermissions => 'Permissions';

  @override
  String get teamSystemRole => 'Built-in';

  @override
  String teamMembersCount(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count members',
      one: '$count member',
    );
    return '$_temp0';
  }

  @override
  String get teamModulesCompany => 'Company';

  @override
  String get teamModulesUsers => 'Team';

  @override
  String get teamModulesAccounts => 'Accounts';

  @override
  String get teamModulesSales => 'Sales';

  @override
  String get teamModulesPurchase => 'Purchase';

  @override
  String get teamModulesInventory => 'Inventory';

  @override
  String get teamModulesGst => 'GST';

  @override
  String get teamModulesHr => 'HR';

  @override
  String get teamModulesPayroll => 'Payroll';

  @override
  String get teamModulesReports => 'Reports';

  @override
  String get teamModulesSettings => 'Settings';

  @override
  String get teamModulesBanking => 'Banking';

  @override
  String get teamModulesAssets => 'Fixed assets';

  @override
  String get teamModulesExpenses => 'Expenses';

  @override
  String get teamModulesProjects => 'Projects';

  @override
  String get teamModulesCrm => 'CRM';

  @override
  String get teamPermView => 'View';

  @override
  String get teamPermCreate => 'Create';

  @override
  String get teamPermEdit => 'Edit';

  @override
  String get teamPermSubmit => 'Submit';

  @override
  String get teamPermCancel => 'Cancel';

  @override
  String get teamPermDelete => 'Delete';

  @override
  String get teamPermExport => 'Export';

  @override
  String get teamPermApprove => 'Approve';

  @override
  String get teamErrorsCannotChangeSelf => 'You can\'t change your own access.';

  @override
  String get teamErrorsLastOwner =>
      'A business needs at least one active owner.';

  @override
  String get teamErrorsOwnerOnly => 'Only an owner can do this.';

  @override
  String get teamErrorsAlreadyMember => 'This person is already a member.';

  @override
  String get teamErrorsPermissionEscalation =>
      'You can\'t give permissions you don\'t have yourself.';

  @override
  String get teamErrorsSystemRole => 'Built-in roles can\'t be changed.';

  @override
  String get teamErrorsRoleInUse =>
      'Move members off this role before deleting it.';

  @override
  String get teamErrorsUnknownRole => 'That role no longer exists.';

  @override
  String get teamSpecialTitle => 'Special rights';

  @override
  String get teamSpecialHelp =>
      'Single powers beyond the grid above. Someone can enter bills without being allowed to back-date them or sell below cost.';

  @override
  String get teamSpecialChangeDate => 'Back-date documents';

  @override
  String get teamSpecialFutureDate => 'Future-date documents';

  @override
  String get teamSpecialSellBelowCost => 'Sell below cost';

  @override
  String get teamSpecialSeeAgentCommission => 'See agent commission';

  @override
  String get teamSpecialImportData => 'Import data';

  @override
  String inviteTitle(String business) {
    return 'Join $business';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$email has been invited as $role.';
  }

  @override
  String get inviteCreateAccount => 'Create your account to accept.';

  @override
  String get inviteSignInToAccept => 'Enter your Varchasv password to accept.';

  @override
  String get inviteAccept => 'Accept invitation';

  @override
  String get inviteInvalid =>
      'This invitation link is invalid, already used or expired. Ask for a new one.';

  @override
  String get accountsTitle => 'Chart of accounts';

  @override
  String get accountsSubtitle =>
      'Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors.';

  @override
  String get accountsNewAccount => 'New account';

  @override
  String get accountsName => 'Account name';

  @override
  String get accountsNameHi => 'Name in Hindi';

  @override
  String get accountsGroup => 'Group';

  @override
  String get accountsBalance => 'Balance';

  @override
  String get accountsOpeningBalance => 'Opening balance';

  @override
  String get accountsOpeningHint =>
      'Positive for debit (cash, bank, debtors); negative for credit (capital, loans, creditors).';

  @override
  String get accountsCode => 'Code';

  @override
  String get accountsParty => 'Party details';

  @override
  String get accountsPhone => 'Phone';

  @override
  String get accountsIfsc => 'IFSC';

  @override
  String get accountsAccountNumber => 'Account number';

  @override
  String get accountsAllGroups => 'All groups';

  @override
  String get accountsEmpty => 'No accounts match.';

  @override
  String get accountsErrorsAccountNameTaken =>
      'An account with this name already exists.';

  @override
  String get accountsErrorsUnknownGroup => 'Choose a group.';

  @override
  String get accountsErrorsInvalidIfsc => 'An IFSC looks like HDFC0001234.';

  @override
  String get accountsErrorsInvalidPan => 'A PAN looks like ABCDE1234F.';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'Built-in accounts stay in their group.';

  @override
  String get accountsErrorsNotAnAgent =>
      'Choose a ledger marked as a broker or agent.';

  @override
  String get accountsErrorsUnknownSalesman =>
      'Choose a salesman from your employees.';

  @override
  String get accountsCreditLimit => 'Credit limit (₹)';

  @override
  String get accountsCreditDays => 'Credit days';

  @override
  String get accountsCreditControl => 'Over the limit or overdue';

  @override
  String get accountsCreditControlHint =>
      'Block stops new sales until an owner or admin overrides.';

  @override
  String get accountsCreditWarn => 'Warn and allow';

  @override
  String get accountsCreditBlock => 'Block';

  @override
  String get accountsBlockOverdueDays => 'Overdue days allowed';

  @override
  String get accountsInterestRate => 'Interest on overdue (% a year)';

  @override
  String get vouchersTitle => 'Vouchers';

  @override
  String get vouchersSubtitle =>
      'Every entry in your books. Posted vouchers are never edited: cancel and re-enter instead.';

  @override
  String get vouchersNew => 'New voucher';

  @override
  String get vouchersTypesJournal => 'Journal';

  @override
  String get vouchersTypesPayment => 'Payment';

  @override
  String get vouchersTypesReceipt => 'Receipt';

  @override
  String get vouchersTypesContra => 'Contra';

  @override
  String get vouchersTypesPurchase => 'Purchase';

  @override
  String get vouchersTypesDebitNote => 'Debit note';

  @override
  String get vouchersTypesSales => 'Sales';

  @override
  String get vouchersTypesCreditNote => 'Credit note';

  @override
  String get vouchersTypesGatewaySettlement => 'Gateway settlement';

  @override
  String get vouchersTypesAssetPurchase => 'Asset purchase';

  @override
  String get vouchersTypesDepreciation => 'Depreciation';

  @override
  String get vouchersTypesAssetDisposal => 'Asset sale';

  @override
  String get vouchersTypesExpenseClaim => 'Expense claim';

  @override
  String get vouchersTypesBrokerage => 'Brokerage bill';

  @override
  String get vouchersTypeHintsJournal =>
      'Adjustments, credit sales and purchases, provisions.';

  @override
  String get vouchersTypeHintsPayment => 'Money going out of cash or bank.';

  @override
  String get vouchersTypeHintsReceipt => 'Money coming into cash or bank.';

  @override
  String get vouchersTypeHintsContra => 'Between cash and bank accounts only.';

  @override
  String get vouchersNumber => 'Number';

  @override
  String get vouchersReference => 'Reference';

  @override
  String get vouchersAccount => 'Account';

  @override
  String get vouchersAccounts => 'Accounts';

  @override
  String get vouchersAmount => 'Amount';

  @override
  String get vouchersAddLine => 'Add line';

  @override
  String get vouchersDifference => 'Difference';

  @override
  String get vouchersPost => 'Post voucher';

  @override
  String get vouchersCancel => 'Cancel voucher';

  @override
  String get vouchersCancelReason => 'Reason for cancelling';

  @override
  String get vouchersCancelled => 'Cancelled';

  @override
  String get vouchersPosted => 'Posted';

  @override
  String get vouchersStatus => 'Status';

  @override
  String get vouchersEmpty => 'No vouchers in this period.';

  @override
  String get vouchersChooseAccount => 'Choose account…';

  @override
  String get vouchersErrorsUnbalanced => 'Debits and credits must be equal.';

  @override
  String get vouchersErrorsTooFewLines => 'A voucher needs at least two lines.';

  @override
  String get vouchersErrorsZeroLine => 'Every line needs an amount.';

  @override
  String get vouchersErrorsBothSides =>
      'A line can be a debit or a credit, not both.';

  @override
  String get vouchersErrorsNegativeAmount => 'Amounts can\'t be negative.';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'A payment must credit a cash or bank account.';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'A receipt must debit a cash or bank account.';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'A contra voucher can only use cash and bank accounts.';

  @override
  String get vouchersErrorsPeriodLocked => 'This date is in a locked period.';

  @override
  String get vouchersErrorsPeriodClosed => 'This financial year is closed.';

  @override
  String get vouchersErrorsBeforeBooksBegin =>
      'This date is before your books begin.';

  @override
  String get vouchersErrorsAlreadyCancelled =>
      'This voucher is already cancelled.';

  @override
  String get vouchersErrorsUnknownAccount =>
      'One of the accounts no longer exists.';

  @override
  String get vouchersErrorsAccountArchived =>
      'One of the accounts is archived.';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account will go below zero: $amount. You can still post it.';
  }

  @override
  String get promosTitle => 'Vouchers and coupons';

  @override
  String get promosSubtitle =>
      'Gift vouchers, coupon codes, discount cards and lucky draws for the counter.';

  @override
  String get promosStatusesActive => 'Active';

  @override
  String get promosStatusesUsed => 'Used up';

  @override
  String get promosStatusesExpired => 'Expired';

  @override
  String get promosGiftTitle => 'Gift vouchers';

  @override
  String promosGiftHint(String amount) {
    return '$amount is still owed on active vouchers. GST is charged on the goods when a voucher is spent, not when it is sold.';
  }

  @override
  String get promosGiftCode => 'Code';

  @override
  String get promosGiftFor => 'For';

  @override
  String get promosGiftValue => 'Value (₹)';

  @override
  String get promosGiftBalance => 'Balance';

  @override
  String get promosGiftExpires => 'Expires on';

  @override
  String get promosGiftEmpty => 'No gift vouchers sold yet.';

  @override
  String get promosGiftCount => 'How many';

  @override
  String get promosGiftPaidBy => 'Paid by';

  @override
  String get promosGiftSell => 'Sell vouchers';

  @override
  String get promosGiftIssued => 'Sold. Codes:';

  @override
  String get promosGiftExpire => 'Write back expired vouchers';

  @override
  String get promosGiftExpireHint =>
      'What is left on vouchers past their date becomes income.';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$n vouchers expired, $amount written back.';
  }

  @override
  String get promosCouponsTitle => 'Coupon codes';

  @override
  String get promosCouponsNew => 'New coupon';

  @override
  String get promosCouponsCode => 'Code';

  @override
  String get promosCouponsOff => 'Discount';

  @override
  String get promosCouponsValid => 'Valid';

  @override
  String get promosCouponsUsed => 'Used';

  @override
  String get promosCouponsEmpty => 'No coupons yet.';

  @override
  String promosCouponsUpTo(String amount) {
    return 'up to $amount';
  }

  @override
  String get promosCouponsMaxDiscount => 'Most it can take off (₹)';

  @override
  String get promosCouponsMinBill => 'Minimum bill (₹)';

  @override
  String get promosCouponsMaxUses => 'Uses allowed';

  @override
  String get promosCouponsMaxUsesHint => 'Blank for no limit';

  @override
  String get promosCardsTitle => 'Discount cards';

  @override
  String get promosCardsNew => 'New card';

  @override
  String get promosCardsNumber => 'Card number';

  @override
  String get promosCardsHolder => 'Holder';

  @override
  String get promosCardsValidUntil => 'Valid until';

  @override
  String get promosCardsEmpty => 'No discount cards yet.';

  @override
  String get promosDrawTitle => 'Lucky draw';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from to $to · $entries entries';
  }

  @override
  String get promosDrawEmpty => 'No draws yet.';

  @override
  String get promosDrawWinners => 'Winners';

  @override
  String get promosDrawHint =>
      'Every bill with a customer mobile in the period is one entry; each mobile can win once.';

  @override
  String get promosDrawRun => 'Pick winners';

  @override
  String get promosStatus => 'Status';

  @override
  String get promosErrorsInvalidAmount => 'Enter an amount in rupees.';

  @override
  String get promosErrorsInvalidPercent => 'Enter a percent from 0 to 100.';

  @override
  String get promosErrorsCodeTaken => 'That code is already in use.';

  @override
  String get promosErrorsExpiryBeforeIssue =>
      'The expiry date must be after today.';

  @override
  String get promosErrorsEndsBeforeStart =>
      'The end date is before the start date.';

  @override
  String get promosErrorsNoEntries =>
      'No bills with a customer mobile in that period.';

  @override
  String get promosErrorsInvalidCode => 'Use letters, digits and hyphens only.';

  @override
  String get promosErrorsInvalidPhone => 'Enter a 10 digit mobile number.';

  @override
  String get posReturnsTitle => 'Returns and exchanges';

  @override
  String get posReturnsSubtitle =>
      'Take goods back against a bill. For a size or colour swap, give store credit and bill the new piece with it.';

  @override
  String get posReturnsReturn => 'Return';

  @override
  String posReturnsSaved(String number) {
    return 'Return $number saved';
  }

  @override
  String get posReturnsCreditCode => 'Store credit code:';

  @override
  String get posReturnsExchangeNow => 'Bill the exchange now';

  @override
  String posReturnsRefunded(String mode) {
    return 'Refunded by $mode.';
  }

  @override
  String posReturnsAgainst(String number) {
    return 'Return against $number';
  }

  @override
  String get posReturnsCanReturn => 'Can return';

  @override
  String get posReturnsQty => 'Qty back';

  @override
  String get posReturnsReason => 'Reason';

  @override
  String get posReturnsCondition => 'Condition';

  @override
  String get posReturnsCounter => 'Counter';

  @override
  String get posReturnsNoShift => 'Open a shift at a counter first.';

  @override
  String get posReturnsGive => 'Give back as';

  @override
  String get posReturnsVoucherHint =>
      'A voucher code to pay for the exchange now or later';

  @override
  String get posReturnsStoreCredit => 'Store credit (exchange)';

  @override
  String posReturnsAbout(String amount) {
    return 'About $amount';
  }

  @override
  String get posReturnsTake => 'Take back';

  @override
  String get posReturnsNumber => 'Return';

  @override
  String get posReturnsBill => 'Bill';

  @override
  String get posReturnsWhat => 'What came back';

  @override
  String get posReturnsNone => 'No returns on this day.';

  @override
  String get posReturnsByReason => 'By reason';

  @override
  String get posReturnsByCondition => 'By condition';

  @override
  String get posReturnsBillNumber => 'Bill number';

  @override
  String get posReturnsFind => 'Find bill';

  @override
  String get posReturnsNotFound => 'No bill with that number.';

  @override
  String get posReturnsDate => 'Date';

  @override
  String get posReturnsShow => 'Show';

  @override
  String get posReturnsReasonsSize => 'Size';

  @override
  String get posReturnsReasonsColour => 'Colour';

  @override
  String get posReturnsReasonsDefect => 'Manufacturing defect';

  @override
  String get posReturnsReasonsDamaged => 'Damaged';

  @override
  String get posReturnsReasonsNotLiked => 'Did not like it';

  @override
  String get posReturnsReasonsOther => 'Other';

  @override
  String get posReturnsGradesA => 'A: as new, back on the shelf';

  @override
  String get posReturnsGradesB => 'B: minor fault, sell as second';

  @override
  String get posReturnsGradesC => 'C: cannot be sold';

  @override
  String get posReturnsErrorsBillVoid =>
      'This bill was voided; nothing can be returned against it.';

  @override
  String get posReturnsErrorsOverReturn =>
      'That is more than is left to return on the line.';

  @override
  String get posReturnsErrorsSessionNotOpen =>
      'Open a shift at this counter first.';

  @override
  String get posReturnsErrorsDuplicateLine => 'A line is listed twice.';

  @override
  String get alterationsTitle => 'Alterations and repairs';

  @override
  String get alterationsSubtitle =>
      'Take garments in for fitting, give them to a karigar, and hand them back on the promised day.';

  @override
  String get alterationsNewSlip => 'New alteration slip';

  @override
  String get alterationsSetUpFirst =>
      'Add the kinds of alteration you do (below) to start taking slips.';

  @override
  String get alterationsStatusReceived => 'Taken in';

  @override
  String get alterationsStatusWithKarigar => 'With the karigar';

  @override
  String get alterationsStatusReady => 'Ready for the customer';

  @override
  String get alterationsNone => 'Nothing here.';

  @override
  String alterationsLabour(String from, String to) {
    return 'Karigar labour, $from to $to';
  }

  @override
  String get alterationsKarigar => 'Karigar';

  @override
  String get alterationsKarigars => 'Karigars';

  @override
  String get alterationsKarigarHint =>
      'Outside karigars get their own ledger; their labour is credited when the work comes back. In-house karigars are paid through salary.';

  @override
  String get alterationsNoKarigars => 'No karigars yet.';

  @override
  String get alterationsOutside => 'Outside karigar';

  @override
  String get alterationsInHouse => 'In-house';

  @override
  String get alterationsPhone => 'Mobile';

  @override
  String get alterationsSlips => 'Slips';

  @override
  String get alterationsPieces => 'Pieces';

  @override
  String get alterationsLabourCol => 'Labour';

  @override
  String get alterationsNoLabour =>
      'Nothing came back from karigars this month.';

  @override
  String get alterationsOverdue => 'Overdue';

  @override
  String alterationsDue(String date) {
    return 'Due $date';
  }

  @override
  String alterationsTrial(String date) {
    return 'Trial $date';
  }

  @override
  String alterationsWith(String name) {
    return 'With $name';
  }

  @override
  String get alterationsFree => 'Free';

  @override
  String get alterationsGive => 'Give';

  @override
  String get alterationsBack => 'Back from karigar';

  @override
  String get alterationsDeliver => 'Hand over';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'Hand over and collect $amount';
  }

  @override
  String get alterationsCancelSlip => 'Cancel slip';

  @override
  String get alterationsAgainstBill => 'Against bill';

  @override
  String get alterationsTrialOn => 'Trial on';

  @override
  String get alterationsDeliveryOn => 'Deliver on';

  @override
  String get alterationsComplimentary => 'Free with the purchase';

  @override
  String get alterationsGarment => 'Garment';

  @override
  String get alterationsWork => 'Work';

  @override
  String get alterationsNotes => 'Measurements and notes';

  @override
  String get alterationsAddWork => 'Add work';

  @override
  String get alterationsTakeIn => 'Take in';

  @override
  String alterationsCharge(String amount) {
    return 'Charge $amount';
  }

  @override
  String get alterationsTypes => 'Alterations and repairs offered';

  @override
  String get alterationsCustomerCharge => 'Customer pays';

  @override
  String get alterationsKindsAlteration => 'Alteration';

  @override
  String get alterationsKindsRepair => 'Repair';

  @override
  String get alterationsErrorsNameTaken => 'That name is already in use.';

  @override
  String get alterationsErrorsNotReceived =>
      'This slip has already gone to a karigar.';

  @override
  String get alterationsErrorsNotWithKarigar =>
      'This slip is not with a karigar.';

  @override
  String get alterationsErrorsNotReady => 'This slip is not ready yet.';

  @override
  String get alterationsErrorsTerminalRequired =>
      'Choose the counter to collect the charge at.';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'The delivery date is before the slip date.';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'The trial must fall between the slip date and delivery.';

  @override
  String get alterationsErrorsCannotCancel =>
      'A delivered or cancelled slip can\'t be cancelled.';

  @override
  String get tailoringTitle => 'Made-to-order tailoring';

  @override
  String get tailoringSubtitle =>
      'Measurements, an advance, each process through a karigar, and the tailoring bill at delivery.';

  @override
  String get tailoringNewOrder => 'New tailoring order';

  @override
  String get tailoringTakeMeasurements => 'Take measurements';

  @override
  String get tailoringStatusBooked => 'Booked';

  @override
  String get tailoringStatusInWork => 'In the workroom';

  @override
  String get tailoringStatusReady => 'Ready for delivery';

  @override
  String get tailoringTrialDue => 'Trial due';

  @override
  String get tailoringToday => 'Due today';

  @override
  String get tailoringMarkDone => 'Done';

  @override
  String get tailoringMarkReady => 'Mark ready';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'Total $total, advance $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'Deliver and collect $amount';
  }

  @override
  String get tailoringCancelOrder => 'Cancel order';

  @override
  String tailoringCardsFound(String n) {
    return '$n measurement cards on file';
  }

  @override
  String get tailoringStitchingPrice => 'Stitching price';

  @override
  String get tailoringMeasurements => 'Measurement card';

  @override
  String get tailoringNoCard => 'No card';

  @override
  String get tailoringFabric => 'Fabric';

  @override
  String get tailoringOwnFabric => 'Customer\'s own fabric';

  @override
  String get tailoringMetres => 'Metres';

  @override
  String get tailoringStyleNotes =>
      'Style notes (collar, pockets, fit, lining...)';

  @override
  String get tailoringAddGarment => 'Add garment';

  @override
  String get tailoringAdvance => 'Advance (₹)';

  @override
  String get tailoringAdvanceHint =>
      'Kept as credit for this order; it comes off the bill at delivery';

  @override
  String get tailoringBook => 'Book order';

  @override
  String tailoringEstimate(String amount) {
    return 'Estimate $amount';
  }

  @override
  String get tailoringInches =>
      'Measurements in inches. Leave blank what you don\'t need.';

  @override
  String get tailoringOtherMeasure => 'Other measurement';

  @override
  String get tailoringValue => 'Value';

  @override
  String get tailoringPhoto => 'Add a photo';

  @override
  String get tailoringRates => 'Karigar rates by process';

  @override
  String get tailoringRatesHint =>
      'Labour per piece for each process of a garment, in the order they are done. New orders take these processes.';

  @override
  String get tailoringProcess => 'Process';

  @override
  String get tailoringNoRates =>
      'No rates yet: orders will have no processes until you add them.';

  @override
  String get tailoringAddRate => 'Add process';

  @override
  String get tailoringKeysChest => 'Chest';

  @override
  String get tailoringKeysWaist => 'Waist';

  @override
  String get tailoringKeysHip => 'Hip';

  @override
  String get tailoringKeysShoulder => 'Shoulder';

  @override
  String get tailoringKeysLength => 'Length';

  @override
  String get tailoringKeysSleeve => 'Sleeve';

  @override
  String get tailoringKeysNeck => 'Neck';

  @override
  String get tailoringKeysInseam => 'Inseam';

  @override
  String get tailoringErrorsPhotoTooBig =>
      'The photo is too large (6 MB at most).';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'The advance is more than the order total.';

  @override
  String get tailoringErrorsAssignFirst =>
      'Give the process to a karigar first.';

  @override
  String get tailoringErrorsProcessDone => 'That process is already done.';

  @override
  String get tailoringErrorsProcessesPending =>
      'Some processes are not done yet.';

  @override
  String get tailoringErrorsNotReady => 'This order is not ready yet.';

  @override
  String get tailoringErrorsOrderClosed =>
      'This order is already delivered or cancelled.';

  @override
  String get tailoringErrorsFabricQtyRequired =>
      'Enter how many metres of fabric.';

  @override
  String get tailoringErrorsNoMeasurements => 'Enter at least one measurement.';

  @override
  String get tailoringErrorsDuplicateRate =>
      'The same garment and process is listed twice.';

  @override
  String get consignmentTitle => 'Consignment and shop-in-shop';

  @override
  String get consignmentSubtitle =>
      'Goods kept at other stores stay yours until they sell. Send stock, take it back, and bill what their sales report says was sold.';

  @override
  String get consignmentSend => 'Send goods';

  @override
  String get consignmentBillSales => 'Bill their sales';

  @override
  String get consignmentTakeBack => 'Take goods back';

  @override
  String get consignmentConsignee => 'Consignee';

  @override
  String get consignmentHeld => 'With them';

  @override
  String get consignmentValueAtCost => 'Value at cost';

  @override
  String get consignmentSold => 'Sold';

  @override
  String get consignmentAgeing => 'Ageing';

  @override
  String consignmentItemsAgeing(String n) {
    return 'Items past 150 days: $n';
  }

  @override
  String get consignmentFine => 'All fresh';

  @override
  String get consignmentNone => 'No goods are out on consignment yet.';

  @override
  String consignmentReconcileTitle(String name) {
    return 'Reconciliation: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'Enter what you counted at their store. Pieces short are billed to them as sold. Goods must be billed within six months of going out.';

  @override
  String get consignmentSent => 'Sent';

  @override
  String get consignmentReturned => 'Taken back';

  @override
  String get consignmentCounted => 'Counted';

  @override
  String get consignmentInvoiceBy => 'Bill by';

  @override
  String consignmentMismatch(String n) {
    return 'off by $n';
  }

  @override
  String consignmentShortage(String n) {
    return 'Pieces short in the count: $n';
  }

  @override
  String get consignmentShortageNarration =>
      'Sold, as found in the stock count';

  @override
  String get consignmentBillShortage => 'Bill the shortage as sold';

  @override
  String get consignmentRegister => 'Movements';

  @override
  String get consignmentKindsSend => 'Sent';

  @override
  String get consignmentKindsReturn => 'Taken back';

  @override
  String get consignmentKindsSale => 'Sold and billed';

  @override
  String get consignmentFormsSend => 'Send goods on consignment';

  @override
  String get consignmentFormsReturn => 'Take goods back';

  @override
  String get consignmentFormsSales => 'Their sales report';

  @override
  String get consignmentFormHintsSend =>
      'Stock moves to their store and stays in your books. Leave the rate blank to use their price list or the item\'s sale rate.';

  @override
  String get consignmentFormHintsReturn =>
      'Unsold pieces come back to your main store.';

  @override
  String get consignmentFormHintsSales =>
      'Each sales report becomes a tax invoice to them, from the stock at their store. It goes through even over their credit limit, with a warning.';

  @override
  String get consignmentAgreedRate => 'Agreed rate';

  @override
  String get consignmentAddLine => 'Add item';

  @override
  String get consignmentSaveSend => 'Send';

  @override
  String get consignmentSaveReturn => 'Take back';

  @override
  String get consignmentSaveSales => 'Make the invoice';

  @override
  String get consignmentErrorsMoreThanHeld => 'That is more than they hold.';

  @override
  String get consignmentErrorsNotACustomer => 'Pick a customer account.';

  @override
  String get consignmentErrorsDuplicateItem => 'The same item is listed twice.';

  @override
  String get consignmentErrorsUnknownItem =>
      'One of the items no longer exists.';

  @override
  String get reportsParticulars => 'Particulars';

  @override
  String get reportsTradingIncome => 'Sales & direct income';

  @override
  String get reportsTradingExpense => 'Purchases & direct expenses';

  @override
  String get reportsGrossProfit => 'Gross profit';

  @override
  String get reportsOtherIncome => 'Indirect income';

  @override
  String get reportsOtherExpense => 'Indirect expenses';

  @override
  String get reportsNetProfit => 'Net profit';

  @override
  String get reportsNetLoss => 'Net loss';

  @override
  String get reportsAssets => 'Assets';

  @override
  String get reportsLiabilities => 'Liabilities & capital';

  @override
  String get reportsProfitAndLoss => 'Profit & loss account';

  @override
  String get reportsDifference => 'Difference';

  @override
  String get reportsOpeningDifference => 'Difference in opening balances';

  @override
  String get reportsOpening => 'Opening balance';

  @override
  String get reportsClosing => 'Closing balance';

  @override
  String get reportsNoData => 'Nothing to show for this period.';

  @override
  String reportsLedgerTitle(String account) {
    return 'Ledger: $account';
  }

  @override
  String get reportsStockNote =>
      'Closing stock is added once inventory arrives in phase 3.';

  @override
  String get reportsOpeningStock => 'Opening stock';

  @override
  String get reportsClosingStock => 'Closing stock';

  @override
  String get reportsBuilderTitle => 'Report builder';

  @override
  String get reportsBuilderSubtitle =>
      'Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it emailed.';

  @override
  String get reportsBuilderDataset => 'Data';

  @override
  String get reportsBuilderDatasetsSales => 'Sales';

  @override
  String get reportsBuilderDatasetsPurchases => 'Purchases';

  @override
  String get reportsBuilderDatasetsExpenses => 'Expenses';

  @override
  String get reportsBuilderDatasetsLedger => 'Ledger entries';

  @override
  String get reportsBuilderDatasetsTime => 'Timesheets';

  @override
  String get reportsBuilderGroupBy => 'Group by (up to 3)';

  @override
  String get reportsBuilderMeasures => 'Show';

  @override
  String get reportsBuilderDimsMonth => 'Month';

  @override
  String get reportsBuilderDimsDay => 'Day';

  @override
  String get reportsBuilderDimsCustomer => 'Customer';

  @override
  String get reportsBuilderDimsItem => 'Item';

  @override
  String get reportsBuilderDimsHsn => 'HSN';

  @override
  String get reportsBuilderDimsState => 'State';

  @override
  String get reportsBuilderDimsSupplier => 'Supplier';

  @override
  String get reportsBuilderDimsCategory => 'Category';

  @override
  String get reportsBuilderDimsEmployee => 'Employee';

  @override
  String get reportsBuilderDimsProject => 'Project';

  @override
  String get reportsBuilderDimsAccount => 'Ledger';

  @override
  String get reportsBuilderDimsGroup => 'Group';

  @override
  String get reportsBuilderDimsType => 'Voucher type';

  @override
  String get reportsBuilderMeasureNamesQty => 'Quantity';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'Taxable value';

  @override
  String get reportsBuilderMeasureNamesTax => 'GST';

  @override
  String get reportsBuilderMeasureNamesTotal => 'Total';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'Documents';

  @override
  String get reportsBuilderMeasureNamesAmount => 'Amount';

  @override
  String get reportsBuilderMeasureNamesItc => 'GST credit';

  @override
  String get reportsBuilderMeasureNamesDebit => 'Debit';

  @override
  String get reportsBuilderMeasureNamesCredit => 'Credit';

  @override
  String get reportsBuilderMeasureNamesNet => 'Net';

  @override
  String get reportsBuilderMeasureNamesHours => 'Hours';

  @override
  String get reportsBuilderMeasureNamesCost => 'Cost';

  @override
  String get reportsBuilderMeasureNamesBillableValue => 'Billable value';

  @override
  String get reportsBuilderPeriod => 'Period';

  @override
  String get reportsBuilderPresetsToday => 'Today';

  @override
  String get reportsBuilderPresetsYesterday => 'Yesterday';

  @override
  String get reportsBuilderPresetsThisMonth => 'This month';

  @override
  String get reportsBuilderPresetsLastMonth => 'Last month';

  @override
  String get reportsBuilderPresetsThisQuarter => 'This quarter';

  @override
  String get reportsBuilderPresetsLastQuarter => 'Last quarter';

  @override
  String get reportsBuilderPresetsThisFy => 'This financial year';

  @override
  String get reportsBuilderPresetsLastFy => 'Last financial year';

  @override
  String get reportsBuilderPresetsCustom => 'Choose dates';

  @override
  String get reportsBuilderRun => 'Run';

  @override
  String get reportsBuilderCsv => 'Download CSV';

  @override
  String get reportsBuilderSave => 'Save report';

  @override
  String get reportsBuilderName => 'Report name';

  @override
  String get reportsBuilderSchedule => 'Email it';

  @override
  String get reportsBuilderFrequenciesNone => 'Don\'t email';

  @override
  String get reportsBuilderFrequenciesDaily =>
      'Every day (yesterday\'s figures)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'Every week (last Monday to Sunday)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'Every month (last month)';

  @override
  String get reportsBuilderHour => 'At';

  @override
  String get reportsBuilderWeekday => 'On';

  @override
  String get reportsBuilderWeekdays0 => 'Sunday';

  @override
  String get reportsBuilderWeekdays1 => 'Monday';

  @override
  String get reportsBuilderWeekdays2 => 'Tuesday';

  @override
  String get reportsBuilderWeekdays3 => 'Wednesday';

  @override
  String get reportsBuilderWeekdays4 => 'Thursday';

  @override
  String get reportsBuilderWeekdays5 => 'Friday';

  @override
  String get reportsBuilderWeekdays6 => 'Saturday';

  @override
  String get reportsBuilderDay => 'On day (1–28)';

  @override
  String get reportsBuilderRecipients => 'Email to (separate with commas)';

  @override
  String get reportsBuilderSaved => 'Saved.';

  @override
  String get reportsBuilderTotal => 'Total';

  @override
  String get reportsBuilderNoRows => 'No data for this period.';

  @override
  String get reportsBuilderSavedTitle => 'Saved reports';

  @override
  String reportsBuilderNextRun(String date) {
    return 'Next email: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'Last run failed: $error';
  }

  @override
  String get reportsBuilderDelete => 'Delete';

  @override
  String get reportsBuilderNone => 'No saved reports yet.';

  @override
  String get reportsErrorsUnknownDataset => 'Choose what to report on.';

  @override
  String get reportsErrorsUnknownMeasure =>
      'Choose at least one figure to show.';

  @override
  String get reportsErrorsUnknownDimension =>
      'That grouping isn\'t available here.';

  @override
  String get reportsErrorsInvalidPeriod => 'Check the dates.';

  @override
  String get reportsErrorsRecipientsRequired =>
      'Add at least one email address.';

  @override
  String get reportsErrorsInvalidHour => 'Choose a time.';

  @override
  String get reportsErrorsInvalidWeekday => 'Choose a day of the week.';

  @override
  String get reportsErrorsInvalidDay => 'Choose a day from 1 to 28.';

  @override
  String get reportsErrorsUnknownFilter => 'That filter isn\'t available here.';

  @override
  String get ownerReportsColourSizeTitle => 'Colour and size report';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'Each design as a grid of colours and sizes, with stock or pieces sold.';

  @override
  String get ownerReportsAgeingTitle => 'Stock ageing and dead stock';

  @override
  String get ownerReportsAgeingSubtitle =>
      'How long today\'s stock has been with you (oldest received sells first), and what has stopped selling.';

  @override
  String get ownerReportsRegisterTitle => 'Sales register';

  @override
  String get ownerReportsRegisterSubtitle =>
      'Every invoice, counter bill and return in the period, with how each was paid.';

  @override
  String get ownerReportsDesign => 'Design';

  @override
  String get ownerReportsName => 'Name';

  @override
  String get ownerReportsBrand => 'Brand';

  @override
  String get ownerReportsColour => 'Colour';

  @override
  String get ownerReportsSize => 'Size';

  @override
  String get ownerReportsSold => 'Sold';

  @override
  String get ownerReportsStock => 'Stock';

  @override
  String get ownerReportsSales => 'Sales';

  @override
  String get ownerReportsReportType => 'Show';

  @override
  String get ownerReportsFrom => 'From';

  @override
  String get ownerReportsTo => 'To';

  @override
  String get ownerReportsAsOf => 'As of';

  @override
  String get ownerReportsStore => 'Store';

  @override
  String get ownerReportsAllStores => 'All our stores';

  @override
  String get ownerReportsAllBrands => 'All brands';

  @override
  String get ownerReportsCategory => 'Category';

  @override
  String get ownerReportsAllCategories => 'All categories';

  @override
  String get ownerReportsSearchDesign => 'Design no. or name';

  @override
  String ownerReportsTotalSold(String n) {
    return 'Pieces sold: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'Pieces in stock: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'MRP $v';
  }

  @override
  String get ownerReportsTotal => 'Total';

  @override
  String get ownerReportsNoPhoto => 'No photo';

  @override
  String get ownerReportsNothing => 'Nothing to show for these choices.';

  @override
  String get ownerReportsItem => 'Item';

  @override
  String get ownerReportsValue => 'Value';

  @override
  String get ownerReportsDeadAfter => 'Dead after';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'Dead: no sale for $n days';
  }

  @override
  String get ownerReportsOnlyDead => 'Only dead stock';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'Stock by age: $v, $n pieces';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'Dead stock (no sale for $n days)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'Items: $items, pieces: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'Candidates for a markdown, a return to the supplier or a transfer to another store.';

  @override
  String get ownerReportsDead => 'dead';

  @override
  String get ownerReportsLastSold => 'Last sold';

  @override
  String get ownerReportsIdleDays => 'Days without a sale';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n days ago)';
  }

  @override
  String get ownerReportsNeverSold => 'Never sold';

  @override
  String get ownerReportsDate => 'Date';

  @override
  String get ownerReportsNumber => 'No.';

  @override
  String get ownerReportsKind => 'Document';

  @override
  String get ownerReportsParty => 'Customer';

  @override
  String get ownerReportsColsPieces => 'Pcs';

  @override
  String get ownerReportsColsGross => 'Gross';

  @override
  String get ownerReportsColsDiscount => 'Discount';

  @override
  String get ownerReportsColsTaxable => 'Taxable';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'Bill amount';

  @override
  String get ownerReportsColsCash => 'Cash';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'Card';

  @override
  String get ownerReportsColsCredit => 'On account';

  @override
  String get ownerReportsKindsInvoice => 'Invoice';

  @override
  String get ownerReportsKindsBill => 'Counter bill';

  @override
  String get ownerReportsKindsCreditNote => 'Credit note';

  @override
  String get ownerReportsKindsCounterReturn => 'Counter return';

  @override
  String get ownerReportsSearchRegister => 'Number or customer';

  @override
  String get ownerReportsAllKinds => 'All documents';

  @override
  String ownerReportsDocuments(String n) {
    return 'Documents: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'Returns show as minus rows. Shaded rows had a discount; struck-through rows were cancelled and are left out of the totals.';

  @override
  String get ownerReportsCompareLastYear => 'Compare to last year';

  @override
  String get ownerReportsThisPeriod => 'This period';

  @override
  String get ownerReportsSameLastYear => 'Same period last year';

  @override
  String get ownerReportsChange => 'Change';

  @override
  String get ownerReportsErrorsInvalidPeriod =>
      'The start date is after the end date.';

  @override
  String get ownerReportsWithMaterials => 'Include fabric and trims';

  @override
  String get ownerReportsAvgBill => 'Average bill';

  @override
  String get fyTitle => 'Financial years';

  @override
  String get fySubtitle =>
      'Lock a period once its books are final: for example after filing GST returns. Nobody can post or cancel entries on or before the lock date.';

  @override
  String get fyYear => 'Year';

  @override
  String get fyPeriod => 'Period';

  @override
  String get fyLockedUpTo => 'Locked up to';

  @override
  String get fyOpen => 'Open';

  @override
  String get fyLock => 'Lock';

  @override
  String get fyUnlock => 'Remove lock';

  @override
  String get fyErrorsLockOutsideYear =>
      'The lock date must fall inside this financial year.';

  @override
  String get appConnectTitle => 'Connect this device';

  @override
  String get appConnectSubtitle =>
      'Sign in once with your Varchasv account. After that the app works without internet and syncs whenever you\'re online.';

  @override
  String get appServer => 'Server address';

  @override
  String get appConnect => 'Connect';

  @override
  String get appConnecting => 'Connecting…';

  @override
  String get appNoBusiness =>
      'This account isn\'t part of any business yet. Create one on the website first.';

  @override
  String get appCantReach =>
      'Can\'t reach the server. Check the address and your internet connection.';

  @override
  String get appSyncTitle => 'Sync';

  @override
  String get appSyncNow => 'Sync now';

  @override
  String appLastSync(String time) {
    return 'Last synced $time';
  }

  @override
  String get appNeverSynced => 'Not synced yet';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count changes waiting to upload',
      one: '$count change waiting to upload',
      zero: 'Everything is uploaded',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count changes were refused by the server',
      one: '$count change was refused by the server',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'Try refused changes again';

  @override
  String get appOffline =>
      'Offline: your work is saved on this device and will upload later.';

  @override
  String get appSyncing => 'Syncing…';

  @override
  String get appDevice => 'This device';

  @override
  String appDeviceCode(String code) {
    return 'Device code $code';
  }

  @override
  String get appBusiness => 'Business';

  @override
  String get appSignOut => 'Sign out of this device';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count changes haven\'t uploaded yet and will be lost.',
      one: '$count change hasn\'t uploaded yet and will be lost.',
      zero: 'This removes the local copy of your books from this device.',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'Waiting to upload';

  @override
  String get appBadgeFailed => 'Refused';

  @override
  String get appBadgeSynced => 'Uploaded';

  @override
  String get appNoVouchers => 'No vouchers yet. Tap + to add one.';

  @override
  String get appAddAccount => 'Add account';

  @override
  String get appNoPermission => 'You don\'t have permission to do this.';

  @override
  String get appToday => 'Today';

  @override
  String get appPreviousDay => 'Previous day';

  @override
  String get appNextDay => 'Next day';

  @override
  String get appNotSyncedYet => 'Waiting to sync';

  @override
  String get appFieldTitle => 'Field work';

  @override
  String get appFieldNewOrder => 'New order';

  @override
  String get appFieldNewClaim => 'New expense claim';

  @override
  String get appFieldOrders => 'Orders from this device';

  @override
  String get appFieldClaims => 'Claims from this device';

  @override
  String appFieldSentAs(String number) {
    return 'Uploaded as $number';
  }

  @override
  String appFieldApprox(String amount) {
    return 'About ₹$amount with GST; the final amount is worked out on upload';
  }

  @override
  String get appFieldAddItem => 'Add item';

  @override
  String get appFieldQty => 'Qty';

  @override
  String get appFieldRate => 'Rate';

  @override
  String get appFieldSave => 'Save';

  @override
  String get appFieldSaved =>
      'Saved on this device; it uploads when you\'re online.';

  @override
  String get appFieldNone => 'Nothing yet.';

  @override
  String get appOverviewTitle => 'Overview';

  @override
  String appOverviewAsOf(String time) {
    return 'Figures as of $time';
  }

  @override
  String appOverviewOffline(String time) {
    return 'Showing the figures from $time. Connect to the internet to refresh.';
  }

  @override
  String get appOverviewNever =>
      'Connect to the internet to see today\'s figures.';

  @override
  String get appOverviewRefresh => 'Refresh';

  @override
  String get appApprovalsTitle => 'Approvals';

  @override
  String get appApprovalsNone => 'Nothing waiting for you.';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours h';
  }

  @override
  String get appApprovalsNeedOnline => 'Approvals need the internet.';

  @override
  String get itemsTitle => 'Items';

  @override
  String get itemsSubtitle =>
      'Goods you stock and services you buy or sell, with HSN/SAC and GST rate.';

  @override
  String get itemsNew => 'New item';

  @override
  String get itemsName => 'Item name';

  @override
  String get itemsKind => 'Type';

  @override
  String get itemsGoods => 'Goods';

  @override
  String get itemsService => 'Service';

  @override
  String get itemsSku => 'SKU / code';

  @override
  String get itemsBarcode => 'Barcode';

  @override
  String get itemsHsn => 'HSN / SAC';

  @override
  String get itemsGstRate => 'GST rate';

  @override
  String get itemsUom => 'Unit';

  @override
  String get itemsPurchaseRate => 'Purchase rate';

  @override
  String get itemsSaleRate => 'Sale rate';

  @override
  String get itemsMrp => 'MRP';

  @override
  String get itemsReorderLevel => 'Reorder level';

  @override
  String get itemsReorderQty => 'Reorder quantity';

  @override
  String get itemsTrackBatches => 'Track batch numbers and expiry';

  @override
  String get itemsInStock => 'In stock';

  @override
  String get itemsEmpty => 'No items yet.';

  @override
  String get itemsErrorsInvalidHsn => 'An HSN code has 4, 6 or 8 digits.';

  @override
  String get itemsErrorsInvalidSac =>
      'A SAC code has 6 digits starting with 99.';

  @override
  String get itemsErrorsItemNameTaken =>
      'An item with this name already exists.';

  @override
  String get itemsErrorsSkuTaken => 'Another item already uses this code.';

  @override
  String get itemsErrorsUnknownUom => 'Choose a unit.';

  @override
  String get itemsErrorsSameAsBaseUnit =>
      'This is already the item\'s own unit.';

  @override
  String get itemsErrorsDuplicateUnit => 'Each unit can be added once.';

  @override
  String get itemsErrorsInvalidFactor =>
      'Enter how many base units it holds, more than 0.';

  @override
  String get itemsLeadTimeDays => 'Lead time (days)';

  @override
  String get itemsGstSlab => 'GST rate';

  @override
  String get itemsSlabNone => 'Fixed rate';

  @override
  String get itemsSlabApparel =>
      '5% up to ₹2,500 a piece after discount, 18% above (from 22 Sep 2025)';

  @override
  String get itemsSlabFootwear =>
      '5% up to ₹2,500 a pair after discount, 18% above (from 22 Sep 2025)';

  @override
  String get itemsSlabPieces => 'Pieces in one unit';

  @override
  String get itemsSlabPiecesHint =>
      'For a set sold as one unit, its price is split across this many pieces for the GST test. Enter 1 to treat the set as one piece.';

  @override
  String get itemsByPrice => 'By price';

  @override
  String get itemsOtherUnits => 'Other units';

  @override
  String get itemsUnitFactor => 'How many in the base unit';

  @override
  String get itemsOfBaseUnit => 'of the base unit';

  @override
  String get itemsAddUnit => 'Add a unit';

  @override
  String get stylesTitle => 'Styles';

  @override
  String get stylesSubtitle =>
      'Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock.';

  @override
  String get stylesSizesAndColors => 'Sizes and colours';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'The size scales and colours you pick from when you add a style.';

  @override
  String get stylesNew => 'New style';

  @override
  String get stylesCreate => 'Create style';

  @override
  String get stylesCode => 'Design no.';

  @override
  String get stylesCodeHint => 'Used in every SKU, for example KT-101-NVY-M.';

  @override
  String get stylesName => 'Name';

  @override
  String get stylesBrand => 'Brand';

  @override
  String get stylesCategory => 'Category';

  @override
  String get stylesSeason => 'Season';

  @override
  String get stylesSeasonExample => 'Festive 2026';

  @override
  String get stylesCollection => 'Collection';

  @override
  String get stylesSizeScale => 'Size scale';

  @override
  String get stylesSizes => 'Sizes';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'Colours';

  @override
  String get stylesColor => 'Colour';

  @override
  String get stylesFits => 'Fits';

  @override
  String get stylesFitsHint =>
      'A third choice besides colour and size, separated by commas.';

  @override
  String get stylesFitsExample => 'Slim, Regular';

  @override
  String get stylesVariants => 'Variants';

  @override
  String get stylesSaleRate => 'Sale rate';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'This creates $count items, one for each colour and size.',
      one: 'This creates $count item.',
      zero: 'Pick sizes and colours.',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'No styles yet. Add one to create its colours and sizes in one go.';

  @override
  String get stylesNoMatch => 'No style matches your search.';

  @override
  String get stylesSearchStyles => 'Search by design no., name or brand';

  @override
  String get stylesNoStyles => 'No styles found.';

  @override
  String get stylesChooseStyle => 'Choose a style';

  @override
  String get stylesOtherStyle => 'Another style';

  @override
  String get stylesAddBySize => 'Add by size';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'Add $count pieces',
      one: 'Add $count piece',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'The small number under each box is the stock in hand.';

  @override
  String get stylesStockGrid => 'Stock by colour and size';

  @override
  String get stylesAllWarehouses => 'All warehouses';

  @override
  String get stylesDetails => 'Style details';

  @override
  String get stylesApplyPrices => 'Apply these prices to every size';

  @override
  String get stylesAddVariants => 'Add colours or sizes';

  @override
  String get stylesAddVariantsHint =>
      'Pick new colours, sizes, or both. Variants the style already has are left as they are.';

  @override
  String get stylesSets => 'Sets';

  @override
  String get stylesNoSets => 'No sets yet.';

  @override
  String get stylesNewSet => 'New set';

  @override
  String get stylesNewSetHint =>
      'A set of one colour in a size ratio, sold as one unit. Stock moves as its pieces.';

  @override
  String get stylesRatio => 'Pieces of size';

  @override
  String get stylesSetAsOnePiece => 'Count the whole set as one piece for GST';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'Create set of $count pieces',
      one: 'Create set of $count piece',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'Size scales';

  @override
  String get stylesScaleName => 'Scale name';

  @override
  String get stylesColorName => 'Colour name';

  @override
  String get stylesColorCode => 'Code';

  @override
  String get stylesSwatch => 'Swatch';

  @override
  String get stylesArchive => 'Archive';

  @override
  String get stylesRestore => 'Restore';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'Another style already uses this design no.';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'Pick at least one colour and one size.';

  @override
  String get stylesErrorsUnknownColor => 'That colour is not in your list.';

  @override
  String get stylesErrorsVariantMissing =>
      'This style has no item for one of those sizes in that colour. Add it first.';

  @override
  String get stylesErrorsRatioRequired =>
      'Enter how many pieces of at least one size go in the set.';

  @override
  String get stylesErrorsPackExists => 'This set already exists.';

  @override
  String get stylesErrorsScaleNameTaken =>
      'Another size scale already has this name.';

  @override
  String get stylesErrorsColorTaken =>
      'Another colour already has this name or code.';

  @override
  String get stylesErrorsSizesRequired => 'Enter at least one size.';

  @override
  String get stylesErrorsColorCodeRequired => 'Enter a code for the colour.';

  @override
  String get stylesSummaryTaxonomy => 'Design';

  @override
  String get stylesSummaryCode => 'Design no.';

  @override
  String get stylesSummaryName => 'Name';

  @override
  String get stylesSummaryBrand => 'Brand';

  @override
  String get stylesSummaryCategory => 'Category';

  @override
  String get stylesSummarySeason => 'Season';

  @override
  String get stylesSummaryCollection => 'Collection';

  @override
  String get stylesSummarySizes => 'Sizes';

  @override
  String get stylesSummaryColours => 'Colours';

  @override
  String get stylesSummaryPricing => 'Price and cost';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'Mark-up $pct%';
  }

  @override
  String get stylesSummaryCost => 'Purchase rate';

  @override
  String get stylesSummarySaleRate => 'Sale rate';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from to $to';
  }

  @override
  String get stylesSummaryPieces => 'Pieces in stock';

  @override
  String get stylesSummarySkus => 'Colour and size pieces';

  @override
  String get stylesSummaryValueAtCost => 'Stock at cost';

  @override
  String get stylesSummaryMedia => 'Photos';

  @override
  String stylesSummaryPhotos(String n) {
    return '$n on file';
  }

  @override
  String get stylesSummaryNoPhotos => 'No photos yet.';

  @override
  String get stylesSummaryManagePhotos => 'Add or change photos';

  @override
  String get stylesAttributes => 'Describe the style (from your lists)';

  @override
  String get catalogueTitle => 'Image catalogue';

  @override
  String get catalogueSubtitle =>
      'Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them.';

  @override
  String get catalogueAllColours => 'All colours';

  @override
  String get cataloguePhotos => 'Photos';

  @override
  String get catalogueView => 'View';

  @override
  String get catalogueViewsFront => 'Front';

  @override
  String get catalogueViewsBack => 'Back';

  @override
  String get catalogueViewsDetail => 'Detail';

  @override
  String get catalogueViewsModel => 'On model';

  @override
  String get catalogueViewsOther => 'Other';

  @override
  String get catalogueUploading => 'Uploading…';

  @override
  String get catalogueAddPhotos => 'Add photos';

  @override
  String get cataloguePhotoHint =>
      'Photos are made smaller on this device before upload. On a phone you can take them with the camera.';

  @override
  String get catalogueShownFirst => 'Shown first';

  @override
  String get catalogueShowFirst => 'Show first';

  @override
  String get catalogueNoPhotos => 'No photos yet.';

  @override
  String catalogueRecords(String n) {
    return 'Designs shown: $n';
  }

  @override
  String get catalogueTileSize => 'Tile size';

  @override
  String get catalogueSort => 'Sort';

  @override
  String get catalogueSortsCode => 'By design no.';

  @override
  String get catalogueSortsNewest => 'Newest first';

  @override
  String get catalogueSortsBest => 'Best sellers';

  @override
  String get catalogueSortsPriceLow => 'Price: low to high';

  @override
  String get catalogueSortsPriceHigh => 'Price: high to low';

  @override
  String get catalogueSortsStock => 'Most stock';

  @override
  String catalogueCart(String n) {
    return 'Cart ($n)';
  }

  @override
  String get catalogueNoPhoto => 'No photo';

  @override
  String catalogueStock(String n) {
    return 'Stock: $n';
  }

  @override
  String catalogueSold(String n) {
    return 'Sold in 90 days: $n';
  }

  @override
  String get catalogueAdded => 'In cart';

  @override
  String get catalogueAdd => 'Add';

  @override
  String get catalogueNone => 'No designs match these filters.';

  @override
  String get cataloguePrevious => 'Previous';

  @override
  String get catalogueNext => 'Next';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$from to $to of $total';
  }

  @override
  String get catalogueSelections => 'Saved selections';

  @override
  String catalogueDesigns(String n) {
    return 'Designs: $n';
  }

  @override
  String get catalogueSharedBadge => 'link live';

  @override
  String get catalogueNoSelections =>
      'No selections yet. Add designs to the cart and save them.';

  @override
  String get catalogueSearch => 'Barcode, design or name';

  @override
  String get cataloguePriceFor => 'Prices for';

  @override
  String get catalogueSaleRate => 'Sale rate';

  @override
  String get catalogueInStockOnly => 'In stock only';

  @override
  String get catalogueWithPhotoOnly => 'With photo only';

  @override
  String get catalogueRate => 'Rate';

  @override
  String get catalogueRateFrom => 'Rate from';

  @override
  String get catalogueRateTo => 'Rate up to';

  @override
  String get catalogueReceived => 'Received between';

  @override
  String get catalogueReceivedFrom => 'Received from';

  @override
  String get catalogueReceivedTo => 'Received up to';

  @override
  String get catalogueApply => 'Apply';

  @override
  String get catalogueBrand => 'Brand';

  @override
  String get catalogueCategory => 'Category';

  @override
  String get catalogueSeason => 'Season';

  @override
  String get catalogueClear => 'Clear filters';

  @override
  String catalogueDefaultName(String party) {
    return 'For $party';
  }

  @override
  String get catalogueUntitled => 'New selection';

  @override
  String get catalogueCartTitle => 'Cart';

  @override
  String get catalogueCartEmpty => 'The cart is empty. Press Add on a design.';

  @override
  String get catalogueSelectionName => 'Selection name';

  @override
  String get catalogueForParty => 'For party';

  @override
  String get catalogueAnyone => 'Anyone';

  @override
  String get catalogueSaveSelection => 'Save selection';

  @override
  String get catalogueEmptyCart => 'Empty cart';

  @override
  String get catalogueColsCode => 'Design no.';

  @override
  String get catalogueColsName => 'Name';

  @override
  String get catalogueColsSize => 'Size';

  @override
  String get catalogueColsRate => 'Rate';

  @override
  String get catalogueColsMrp => 'MRP';

  @override
  String get catalogueColsStock => 'Stock';

  @override
  String get cataloguePrintPdf => 'Print or PDF';

  @override
  String get catalogueExportExcel => 'Export to Excel';

  @override
  String get catalogueShowPrices => 'Show prices';

  @override
  String get catalogueShowStock => 'Show sizes in stock';

  @override
  String get catalogueDeleteConfirm =>
      'Delete this selection? A shared link stops working.';

  @override
  String get catalogueDelete => 'Delete selection';

  @override
  String get catalogueShareTitle => 'Share';

  @override
  String catalogueSharedUntil(String date) {
    return 'A link is live until $date. Making a new one stops the old one.';
  }

  @override
  String get catalogueShareHint =>
      'Make a link that opens this catalogue without signing in, then copy it or send it on WhatsApp.';

  @override
  String get catalogueLinkWorksFor => 'Link works for';

  @override
  String catalogueDays(String n) {
    return '$n days';
  }

  @override
  String get catalogueNewLink => 'Make a new link';

  @override
  String get catalogueMakeLink => 'Make a link';

  @override
  String get catalogueStopSharing => 'Stop sharing';

  @override
  String get catalogueLink => 'Link';

  @override
  String get catalogueCopied => 'Link copied.';

  @override
  String get catalogueCopy => 'Copy';

  @override
  String get catalogueWhatsappTo => 'WhatsApp number';

  @override
  String catalogueSentDemo(String to) {
    return 'Recorded as sent to $to (demo: no WhatsApp provider is set up yet).';
  }

  @override
  String catalogueSent(String to) {
    return 'Sent to $to on WhatsApp.';
  }

  @override
  String get catalogueSendWhatsapp => 'Send on WhatsApp';

  @override
  String catalogueOrderHint(String party) {
    return 'Type quantities by size to make a sales order for $party.';
  }

  @override
  String catalogueMrp(String v) {
    return 'MRP $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'Pieces: $pieces, value $value before tax';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'From catalogue selection $name';
  }

  @override
  String get catalogueMakeOrder => 'Make sales order';

  @override
  String catalogueForPartyLine(String party) {
    return 'For $party';
  }

  @override
  String get catalogueSelectionSubtitle => 'A catalogue selection';

  @override
  String get catalogueLinkExpiredTitle => 'This catalogue is no longer shared';

  @override
  String get catalogueLinkExpired =>
      'The link has expired or was replaced. Ask the sender for a new one.';

  @override
  String get catalogueErrorsUnknownStyle => 'That design no longer exists.';

  @override
  String get catalogueErrorsUnknownColor => 'This design has no such colour.';

  @override
  String get catalogueErrorsUnknownFile =>
      'The photo did not upload. Try again.';

  @override
  String get catalogueErrorsFileType => 'Use a JPEG, PNG or WebP photo.';

  @override
  String get catalogueErrorsFileTooLarge => 'The photo is too large.';

  @override
  String get catalogueErrorsFileEmpty => 'The photo is empty.';

  @override
  String get catalogueErrorsDuplicateImage =>
      'This photo is already on this design and colour.';

  @override
  String get catalogueErrorsNoLines => 'Add at least one design.';

  @override
  String get catalogueErrorsDuplicateLine =>
      'A design and colour is in the list twice.';

  @override
  String get catalogueErrorsUnknownAccount => 'Pick a party from the list.';

  @override
  String get catalogueErrorsInvalidDays => 'A link can last 1 to 90 days.';

  @override
  String get catalogueErrorsShareLinkStale =>
      'That link is no longer live. Make a new link first.';

  @override
  String get catalogueErrorsInvalidPhone =>
      'Enter a 10-digit Indian mobile number.';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp did not accept the message. Try again later.';

  @override
  String get labelsTitle => 'Barcode and price labels';

  @override
  String get labelsSubtitle =>
      'Print tags with the barcode, MRP and size on label rolls, A4 sheets or hang tags.';

  @override
  String get labelsSearch => 'Scan a barcode or type a name';

  @override
  String get labelsWholeDesign => 'A whole design';

  @override
  String get labelsAddOneEach => 'One of each size';

  @override
  String get labelsAddStock => 'One per piece in stock';

  @override
  String get labelsItem => 'Item';

  @override
  String get labelsBarcode => 'Barcode';

  @override
  String get labelsMrp => 'MRP';

  @override
  String get labelsPrice => 'Price';

  @override
  String get labelsLabels => 'Labels';

  @override
  String get labelsNoBarcode => 'none';

  @override
  String get labelsRemove => 'Remove';

  @override
  String get labelsEmpty =>
      'Scan or search items, or pick a design, to add labels.';

  @override
  String get labelsStock => 'Label stock';

  @override
  String get labelsTemplatesRoll50x25 => 'Roll, 50 x 25 mm, one across';

  @override
  String get labelsTemplatesRoll38x25x2 => 'Roll, 38 x 25 mm, two across';

  @override
  String get labelsTemplatesA4x65 => 'A4 sheet, 65 labels (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'Hang tag, 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'Business name';

  @override
  String get labelsFieldsName => 'Item name';

  @override
  String get labelsFieldsDesign => 'Design no.';

  @override
  String get labelsFieldsColourSize => 'Colour and size';

  @override
  String get labelsFieldsMrp => 'MRP';

  @override
  String get labelsFieldsPrice => 'Selling price';

  @override
  String get labelsFieldsExtra => 'Extra line';

  @override
  String get labelsExtraText => 'Extra line text';

  @override
  String get labelsExtraHint =>
      'For example the month of manufacture or the maker\'s address.';

  @override
  String get labelsPreview => 'Preview at actual size';

  @override
  String get labelsPreviewEmpty => 'Add an item to see a label.';

  @override
  String labelsPrint(String n) {
    return 'Print $n labels';
  }

  @override
  String get labelsPrintHint =>
      'The print window opens at the label size; choose the label printer and set margins to none.';

  @override
  String get labelsNothingToPrint =>
      'Nothing to print. Choose the labels in Inventory, then press Print.';

  @override
  String get labelsForBill => 'Print labels for these goods';

  @override
  String get labelsPrintLabels => 'Print labels';

  @override
  String get shareSendWhatsApp => 'Send on WhatsApp';

  @override
  String get shareSend => 'Send';

  @override
  String get shareMobile => 'Mobile number';

  @override
  String shareSentTo(String to) {
    return 'Sent on WhatsApp to $to';
  }

  @override
  String get shareAgain => 'Send again';

  @override
  String get shareFailed => 'Not sent. Check the number and try again.';

  @override
  String get shareAutoFailed =>
      'The bill could not go on WhatsApp by itself. Send it again.';

  @override
  String get shareRemind => 'Remind';

  @override
  String get shareRemindAll => 'Remind everyone overdue';

  @override
  String get shareRemindAllConfirm =>
      'Send a payment reminder on WhatsApp to every customer with overdue bills?';

  @override
  String get shareReminded => 'Reminder sent';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n reminders sent',
      one: '$n reminder sent',
      zero: 'No reminders sent',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'No mobile number, call them: $names';
  }

  @override
  String get shareLogTitle => 'WhatsApp log';

  @override
  String get shareLogSubtitle =>
      'Every bill, invoice, reminder and message sent to customers, newest first.';

  @override
  String get shareFilterAll => 'All';

  @override
  String get shareFilterSent => 'Sent';

  @override
  String get shareFilterFailed => 'Failed';

  @override
  String get shareThisMonth => 'Counts are for this month';

  @override
  String get shareWhen => 'When';

  @override
  String get shareToCol => 'To';

  @override
  String get shareKind => 'Type';

  @override
  String get shareMessage => 'Message';

  @override
  String get shareStatus => 'Status';

  @override
  String shareBy(String name) {
    return 'by $name';
  }

  @override
  String get shareNone =>
      'No messages yet. Bills, invoices and reminders you send on WhatsApp will show here.';

  @override
  String get shareKindsBillShare => 'Counter bill';

  @override
  String get shareKindsInvoiceShare => 'Invoice';

  @override
  String get shareKindsPaymentReminderLink => 'Payment reminder';

  @override
  String get shareKindsPaymentReminder => 'Payment reminder';

  @override
  String get shareKindsOrderConfirmation => 'Order confirmation';

  @override
  String get shareKindsFollowUp => 'Follow-up';

  @override
  String get shareExpiredTitle => 'This link is no longer active';

  @override
  String get shareExpired =>
      'The link has expired. Ask the shop to send it again.';

  @override
  String get shareStatement => 'Statement';

  @override
  String shareStatementFor(String name) {
    return 'Statement for $name';
  }

  @override
  String shareAsOf(String date) {
    return 'As on $date';
  }

  @override
  String get shareBalance => 'Balance due';

  @override
  String shareOverdue(String amount) {
    return '₹$amount overdue';
  }

  @override
  String get shareBill => 'Bill';

  @override
  String get shareDate => 'Date';

  @override
  String get shareDue => 'Due on';

  @override
  String get shareLate => 'Late by';

  @override
  String get shareAmount => 'Amount';

  @override
  String shareDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days',
      one: '$n day',
    );
    return '$_temp0';
  }

  @override
  String get shareNotDue => 'Not due';

  @override
  String get shareNothingOpen => 'Nothing is due. Thank you.';

  @override
  String shareAdvance(String amount) {
    return 'Less advance paid: ₹$amount';
  }

  @override
  String get sharePayTo => 'Pay to';

  @override
  String get shareStatementNote =>
      'If you have already paid, please ignore this statement or share the payment details with us.';

  @override
  String get shareErrorsInvalidPhone => 'Enter a 10-digit mobile number.';

  @override
  String get shareErrorsNothingOutstanding => 'Nothing is outstanding.';

  @override
  String get shareErrorsSendFailed =>
      'WhatsApp did not accept the message. Try again.';

  @override
  String get shareErrorsOutside24hWindow =>
      'This customer has not messaged in 24 hours, so WhatsApp needs an approved template. Add its approved name under Message templates.';

  @override
  String get shareErrorsBillVoid => 'This bill was cancelled.';

  @override
  String get shareErrorsInvoiceCancelled => 'This invoice was cancelled.';

  @override
  String get shareErrorsUnknownTemplate =>
      'The message template was archived. Restore it under Message templates.';

  @override
  String get launcherTitle => 'All actions';

  @override
  String get launcherSubtitle =>
      'Every entry, screen and report in one place. The star pins a tile to My Menu.';

  @override
  String get launcherFilter => 'Type to find an action';

  @override
  String get launcherPin => 'Add to My Menu';

  @override
  String get launcherUnpin => 'Remove from My Menu';

  @override
  String get launcherSaveFailed => 'Could not save My Menu. Try again.';

  @override
  String get launcherNoMatch => 'Nothing matches that.';

  @override
  String get launcherDone => 'Done';

  @override
  String get launcherEdit => 'Edit tiles';

  @override
  String get launcherAddTiles => 'Add tiles';

  @override
  String get launcherReset => 'Back to the default tiles';

  @override
  String get launcherMoveLeft => 'Move earlier';

  @override
  String get launcherMoveRight => 'Move later';

  @override
  String get launcherEmpty => 'No tiles yet. Add some from All actions.';

  @override
  String get launcherMyMenu => 'My Menu';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'Hello $name. Your own tiles; change them with Edit tiles.';
  }

  @override
  String get launcherWaiting => 'Waiting for you';

  @override
  String get launcherSalesToday => 'Sales today';

  @override
  String get launcherToCollect => 'To collect';

  @override
  String get launcherToPay => 'To pay';

  @override
  String launcherOverdue(String amount) {
    return '$amount overdue';
  }

  @override
  String get launcherFullDashboard => 'Full dashboard';

  @override
  String get launcherGroupsEntries => 'New entry';

  @override
  String get launcherGroupsPos => 'Showroom counter';

  @override
  String get launcherGroupsSales => 'Sales';

  @override
  String get launcherGroupsPurchase => 'Purchase';

  @override
  String get launcherGroupsInventory => 'Stock';

  @override
  String get launcherGroupsManufacturing => 'Production and job work';

  @override
  String get launcherGroupsAccounts => 'Accounts and GST';

  @override
  String get launcherGroupsBanking => 'Banking';

  @override
  String get launcherGroupsReports => 'Reports';

  @override
  String get launcherGroupsCrm => 'Customers and WhatsApp';

  @override
  String get launcherGroupsHr => 'Staff and payroll';

  @override
  String get launcherGroupsExpenses => 'Expenses';

  @override
  String get launcherGroupsAssets => 'Fixed assets';

  @override
  String get launcherGroupsProjects => 'Projects';

  @override
  String get launcherGroupsHome => 'Home';

  @override
  String get launcherGroupsSettings => 'Settings';

  @override
  String get launcherLaunchpad => 'Launchpad';

  @override
  String launcherPinned(String n) {
    return '$n pinned';
  }

  @override
  String get launcherRecent => 'Recently opened';

  @override
  String get launcherMoney => 'Today\'s money';

  @override
  String launcherVsYesterday(String pct) {
    return '$pct% on yesterday';
  }

  @override
  String launcherCounterBills(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n counter bills',
      one: '$n counter bill',
    );
    return '$_temp0';
  }

  @override
  String get launcherCashToday => 'Cash at the counters';

  @override
  String get launcherUpiToday => 'UPI at the counters';

  @override
  String get launcherCardToday => 'Card at the counters';

  @override
  String get launcherOverdueToCollect => 'Overdue to collect';

  @override
  String get launcherAllTab => 'Everything';

  @override
  String get launcherGridView => 'Tiles';

  @override
  String get launcherListView => 'List';

  @override
  String get launcherOpen => 'Open';

  @override
  String launcherCount(String n) {
    return '$n screens and entries you can open';
  }

  @override
  String get menuHMasters => 'Masters';

  @override
  String get menuHTransaction => 'Transaction';

  @override
  String get menuHReports => 'Reports';

  @override
  String get menuHAccountReports => 'Account Reports';

  @override
  String get menuHPayroll => 'Payroll';

  @override
  String get menuHUtility => 'Utility';

  @override
  String get menuHChat => 'Chat';

  @override
  String get menuHExit => 'Exit';

  @override
  String get menuSoon => 'Soon';

  @override
  String get menuNotBuilt => 'Not built yet; on the build list.';

  @override
  String get menuFilter => 'Filter';

  @override
  String get menuHome => 'Home';

  @override
  String get menuOpenScreens => 'Open screens';

  @override
  String get menuGAccount => 'Account';

  @override
  String get menuGStock => 'Stock';

  @override
  String get menuGParameters => 'Parameters';

  @override
  String get menuGPromotion => 'Promotion Master';

  @override
  String get menuGSales => 'Sales Transaction';

  @override
  String get menuGAccounting => 'Accounting Transaction';

  @override
  String get menuGPurchase => 'Purchase Transaction';

  @override
  String get menuGJobwork => 'Jobwork Transaction';

  @override
  String get menuGOther => 'Other Transaction';

  @override
  String get menuGSalesReports => 'Sales Reports';

  @override
  String get menuGStockReports => 'Stock Reports';

  @override
  String get menuGCustomReports => 'Custom Reports and Checks';

  @override
  String get menuGAccountReportsGroup => 'Account Reports Group';

  @override
  String get menuGFinalReportGroup => 'Final Report Group';

  @override
  String get menuGMasterGroup => 'Master Group';

  @override
  String get menuGPayrollTransactionGroup => 'Payroll Transaction Group';

  @override
  String get menuGReportGroup => 'Report Group';

  @override
  String get menuGUtilityGroup => 'Utility Group';

  @override
  String get menuGBarcodeGroup => 'Barcode Group';

  @override
  String get menuGExtraUtility => 'Extra Utility';

  @override
  String get menuGUserManagement => 'User Management';

  @override
  String get menuGSoftwareUtility => 'Software Utility';

  @override
  String get menuGChatGroup => 'Chat and Customers';

  @override
  String get menuIAccountMaster => 'Account Master';

  @override
  String get menuIBankMaster => 'Bank Master';

  @override
  String get menuIOpeningBalance => 'Opening Balance';

  @override
  String get menuIBalanceSheetGroup => 'Balance Sheet Group';

  @override
  String get menuIAccountGroup => 'Account Group';

  @override
  String get menuIAccountCategory => 'Account Category';

  @override
  String get menuIRegionMaster => 'Region Master';

  @override
  String get menuICustomerSubCategory => 'Customer Sub Category';

  @override
  String get menuIRemarksMaster => 'Remarks Master';

  @override
  String get menuICompanyMaster => 'Company Master';

  @override
  String get menuICountryMaster => 'Country Master';

  @override
  String get menuIDepartmentMaster => 'Department Master';

  @override
  String get menuIManufactureCompany => 'Manufacture Company';

  @override
  String get menuIBrandMaster => 'Brand Master';

  @override
  String get menuIProductMaster => 'Product Master';

  @override
  String get menuIStyleMaster => 'Style Master';

  @override
  String get menuIItemGroup => 'Item Group';

  @override
  String get menuIItemMaster => 'Item Master';

  @override
  String get menuIDesignMaster => 'Design Master';

  @override
  String get menuIColorMaster => 'Color Master';

  @override
  String get menuISizeGroupMaster => 'Size Group Master';

  @override
  String get menuISizeMaster => 'Size Master';

  @override
  String get menuIFabric => 'Fabric';

  @override
  String get menuISleeves => 'Sleeves';

  @override
  String get menuINeck => 'Neck';

  @override
  String get menuIFit => 'Fit';

  @override
  String get menuISeason => 'Season';

  @override
  String get menuIStyleAttr => 'Style';

  @override
  String get menuIGender => 'Gender';

  @override
  String get menuITypeMaster => 'Type Master';

  @override
  String get menuISubCategory9 => 'Sub Category 9';

  @override
  String get menuISubCategory10 => 'Sub Category 10';

  @override
  String get menuIMaterialMaster => 'Material Master';

  @override
  String get menuIFixedBarcode => 'Fixed Barcode';

  @override
  String get menuIMinMaxStock => 'Min Max Stock Define';

  @override
  String get menuIOpeningStock => 'Opening Stock';

  @override
  String get menuISeasonMaster => 'Season Master';

  @override
  String get menuIProcessMaster => 'Process Master';

  @override
  String get menuIOrderType => 'Order Type';

  @override
  String get menuIWarehouses => 'Godowns and Stores';

  @override
  String get menuIDayBookMaster => 'DayBook Master';

  @override
  String get menuILedgerParameter => 'Ledger Parameter';

  @override
  String get menuISalesmanMaster => 'Salesman Master';

  @override
  String get menuITaxMaster => 'Tax Master';

  @override
  String get menuITdsMaster => 'TDS Master';

  @override
  String get menuITcsTaxMaster => 'TCS Tax Master';

  @override
  String get menuIFinanceYearMaster => 'Finance Year Master';

  @override
  String get menuIHsnCodeMaster => 'HSN Code Master';

  @override
  String get menuISalesReturnReason => 'Sales Return Reason';

  @override
  String get menuISalesmanCommTarget => 'Salesman Comm Target';

  @override
  String get menuIItemDiscountSetup => 'Item Discount SetUp';

  @override
  String get menuIPromoMaster => 'Promo Master';

  @override
  String get menuISisSetup => 'SIS Setup';

  @override
  String get menuIItemCommissionSetup => 'Item Commission SetUp';

  @override
  String get menuISourceMaster => 'Source Master';

  @override
  String get menuISalesOrderWh => 'Sales Order (Wh)';

  @override
  String get menuIWhSalesOrderCancel => 'WhSales Order Cancel';

  @override
  String get menuIDeliveryOrder => 'Delivery Order (D.O)';

  @override
  String get menuIDeliveryChallan => 'Delivery Challan';

  @override
  String get menuISalesBillWh => 'Sales Bill (Wh)';

  @override
  String get menuIDeliveryChallanReturnWh => 'Delivery Challan Return (Wh)';

  @override
  String get menuICreditNoteWh => 'Credit Note (Wh)';

  @override
  String get menuIAdvanceReceipt => 'Advance Receipt';

  @override
  String get menuICashPayRec => 'Cash Pay/Rec';

  @override
  String get menuIBankPayRec => 'Bank Pay/Rec';

  @override
  String get menuIBillWiseReceipt => 'Bill Wise Receipt';

  @override
  String get menuICardReceipt => 'Card Receipt';

  @override
  String get menuIJournalVoucher => 'Journal Voucher';

  @override
  String get menuIContraVoucher => 'Contra Voucher';

  @override
  String get menuIPurchaseOrder => 'Purchase Order';

  @override
  String get menuIInwardChallan => 'Inward Challan';

  @override
  String get menuIPurchase => 'Purchase';

  @override
  String get menuIGoodsReturn => 'Goods Return';

  @override
  String get menuIDebitNote => 'Debit Note';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'Job Issue';

  @override
  String get menuIJobReceipt => 'Job Receipt';

  @override
  String get menuIJobWorkIssue => 'JobWork Issue';

  @override
  String get menuIJobWorkReceipt => 'JobWork Receipt';

  @override
  String get menuIStockAdjustment => 'Stock Adjustment';

  @override
  String get menuISampleIssue => 'Sample Issue';

  @override
  String get menuISampleReceive => 'Sample Receive';

  @override
  String get menuIQuotation => 'Quotation';

  @override
  String get menuILrTransportEntry => 'LR/Transport Entry';

  @override
  String get menuIEWayBill => 'E-Way Bill';

  @override
  String get menuIRePackingBox => 'RePacking Box';

  @override
  String get menuIReOpenBox => 'ReOpen Box';

  @override
  String get menuILedgerReport => 'Ledger Report';

  @override
  String get menuICashBookReport => 'Cash Book Report';

  @override
  String get menuIBankReport => 'Bank Report';

  @override
  String get menuIBankReconciliation => 'Bank Reconciliation';

  @override
  String get menuIGroupMonthSummary => 'Group/Month Summary';

  @override
  String get menuICashBankExpense => 'Cash Bank Expense';

  @override
  String get menuICashFlowReportGroup => 'Cash Flow Report Group';

  @override
  String get menuIBillToBillAdjustment => 'Bill To Bill Adjustment';

  @override
  String get menuIMsmeReport => 'MSME Report';

  @override
  String get menuIOutstandingPayable => 'OutStanding Payable';

  @override
  String get menuIOutstandingReceivable => 'OutStanding Receivable';

  @override
  String get menuIDebtorsList => 'Debtors List';

  @override
  String get menuICreditorList => 'Creditor List';

  @override
  String get menuIInterestReport => 'Interest Report';

  @override
  String get menuIDepreciationAssetReport => 'Depreciation Asset Report';

  @override
  String get menuIJournalVoucherReport => 'Journal Voucher Report';

  @override
  String get menuIGstReport => 'GST Report';

  @override
  String get menuITdsReport => 'TDS Report';

  @override
  String get menuITdsForm26q => 'TDS Form26Q';

  @override
  String get menuIFinalReport => 'Final Report';

  @override
  String get menuIRcmRegister => 'RCM Register';

  @override
  String get menuITcsReport => 'TCS Report';

  @override
  String get menuIEmployee => 'Employee';

  @override
  String get menuIEmployeeKyc => 'Employee KYC Update';

  @override
  String get menuISalaryDeduction => 'Salary Deduction';

  @override
  String get menuIWeekOff => 'Week Off';

  @override
  String get menuIWeekOffCancel => 'Week Off Cancel';

  @override
  String get menuIHolidays => 'Holidays';

  @override
  String get menuIDesignation => 'Designation';

  @override
  String get menuIDepartment => 'Department';

  @override
  String get menuIShiftMaster => 'Shift Master';

  @override
  String get menuIDailyAttendance => 'Daily Attendance';

  @override
  String get menuILeaveApplication => 'Leave Application';

  @override
  String get menuIAdvanceSalary => 'Advance Salary (Upad)';

  @override
  String get menuILoanIssue => 'Loan Issue';

  @override
  String get menuILoanReceipt => 'Loan Receipt';

  @override
  String get menuIMonthlySalary => 'Monthly Salary';

  @override
  String get menuIStipend => 'Stipend';

  @override
  String get menuISalaryPayment => 'Salary Payment';

  @override
  String get menuIStipendPayment => 'Stipend Payment';

  @override
  String get menuIIncentive => 'Incentive';

  @override
  String get menuIOtherDeduction => 'Other Deduction';

  @override
  String get menuIAdvanceLoanRequest => 'Advance And Loan Request';

  @override
  String get menuIMonthlyAttendanceRegister => 'Monthly Attendance Register';

  @override
  String get menuIDayWiseAttendanceRegister => 'Day Wise Attendance Register';

  @override
  String get menuISalarySlipRegister => 'SalarySlip Register Report';

  @override
  String get menuIPtReport => 'PT Report';

  @override
  String get menuILeaveReport => 'Leave Report';

  @override
  String get menuIMenuLogSessionReport => 'Menu Log Session Report';

  @override
  String get menuIPayrollParameter => 'PayRoll Parameter';

  @override
  String get menuIDeviceSettings => 'Device Settings';

  @override
  String get menuIBarcodePrint => 'Barcode Print';

  @override
  String get menuIBarcodeSearch => 'Barcode Search';

  @override
  String get menuIBarcodeDesignImage => 'Barcode/Design Image';

  @override
  String get menuIRateUpdation => 'Rate Updation';

  @override
  String get menuIImageCatalogue => 'Image Catalogue';

  @override
  String get menuISalesDiscountMaster => 'Sales Discount Master';

  @override
  String get menuISalesDiscountDesignWise => 'Sales Discount Design Wise';

  @override
  String get menuISalesmanCommission => 'Salesman Commission';

  @override
  String get menuIDayClose => 'Day Close';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'Email';

  @override
  String get menuIBulkMessenger => 'Bulk Messenger';

  @override
  String get menuILogHistoryReport => 'Log History Report';

  @override
  String get menuIOutstandingAdj => 'Out Standing Adj';

  @override
  String get menuIResetPhysicalStock => 'Reset Physical Stock';

  @override
  String get menuIPhysicalStockVerification => 'Physical Stock Verification';

  @override
  String get menuIMerge => 'Merge';

  @override
  String get menuISalesStockLedgerDiff => 'Sales Stock Ledger Diff';

  @override
  String get menuINoteReport => 'Note Report';

  @override
  String get menuIEInvoiceUpload => 'E-Invoice Upload';

  @override
  String get menuIEWayBillUpload => 'E-WayBill Upload';

  @override
  String get menuIAutoOutstandingReminder => 'Auto Outstanding Reminder';

  @override
  String get menuIUsers => 'Users';

  @override
  String get menuIUserGroup => 'User Group';

  @override
  String get menuICurrentDateSetting => 'Current Date Setting';

  @override
  String get menuIDataLockTillDate => 'Data Lock Till Date';

  @override
  String get menuIMyDevices => 'My Devices';

  @override
  String get menuILedgerStockPosting => 'Ledger And Stock Posting';

  @override
  String get menuIReportType => 'Report Type';

  @override
  String get menuIUserParameter => 'User Parameter';

  @override
  String get menuIBalanceTransfer => 'Balance Transfer';

  @override
  String get menuIDatabaseBackup => 'Database Backup';

  @override
  String get menuISoftwareUpdate => 'Software Update';

  @override
  String get menuIDbUpdates => 'DB Updates';

  @override
  String get menuIScheduleBackup => 'Schedule Backup';

  @override
  String get menuIExportVouchersPdf => 'Export Vouchers to PDF';

  @override
  String get menuIEmployeeDepartment => 'Department';

  @override
  String get menuISensitiveChanges => 'Sensitive changes';

  @override
  String get menuITransporterMaster => 'Transporter Master';

  @override
  String get listsSubtitle =>
      'A list kept for this business. Archive an entry instead of deleting it, so old documents keep their value.';

  @override
  String get listsName => 'Name';

  @override
  String get listsCode => 'Code';

  @override
  String get listsNote => 'Note';

  @override
  String get listsNewEntry => 'New entry';

  @override
  String listsShowArchived(String n) {
    return 'Show archived ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n entries',
      one: '$n entry',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'Archive';

  @override
  String get listsRestore => 'Restore';

  @override
  String get listsNoMatch => 'No entries match the search.';

  @override
  String get listsEmpty =>
      'Nothing in this list yet. Type the first entry on the top line.';

  @override
  String get listsEmptyReadOnly => 'Nothing in this list yet.';

  @override
  String get listsOtherLists => 'Lists';

  @override
  String get listsErrorsLookupTaken =>
      'This list already has an entry with that name.';

  @override
  String get listsErrorsEndBeforeStart =>
      'The end date is before the start date.';

  @override
  String get limitsTitle => 'Minimum and maximum stock';

  @override
  String get limitsSubtitle =>
      'Set how little and how much of each item a warehouse should hold. Items under their minimum are flagged so you know what to order.';

  @override
  String get limitsWarehouse => 'Warehouse';

  @override
  String limitsOnlyBelow(String n) {
    return 'Only below minimum ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'Saved $n rows',
      one: 'Saved $n row',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return 'Save $n changed';
  }

  @override
  String get limitsItem => 'Item';

  @override
  String get limitsInStock => 'In stock';

  @override
  String get limitsMin => 'Minimum';

  @override
  String get limitsMax => 'Maximum';

  @override
  String get limitsToOrder => 'To order';

  @override
  String get limitsBelow => 'Below minimum';

  @override
  String get limitsNoMatch => 'No items match.';

  @override
  String get limitsEmpty =>
      'No items yet. Add items or styles first, then set their limits here.';

  @override
  String get limitsErrorsMaxBelowMin =>
      'The maximum cannot be less than the minimum.';

  @override
  String get billReceiptTitleReceivable => 'Bill wise receipt';

  @override
  String get billReceiptTitlePayable => 'Bill wise payment';

  @override
  String get billReceiptSubtitleReceivable =>
      'Record money received and choose the bills it pays. Anything left over stays on account and clears the oldest bills.';

  @override
  String get billReceiptSubtitlePayable =>
      'Record a payment to a supplier and choose the bills it pays. Anything left over stays on account and clears the oldest bills.';

  @override
  String get billReceiptTabReceipt => 'Receipt';

  @override
  String get billReceiptTabPayment => 'Payment';

  @override
  String get billReceiptCustomer => 'Customer';

  @override
  String get billReceiptSupplier => 'Supplier';

  @override
  String get billReceiptChoose => 'Choose a party';

  @override
  String get billReceiptAccount => 'Cash or bank account';

  @override
  String get billReceiptAmountReceived => 'Amount received';

  @override
  String get billReceiptAmountPaid => 'Amount paid';

  @override
  String get billReceiptReference => 'Reference (cheque, UPI id)';

  @override
  String get billReceiptOpenBills => 'Open bills';

  @override
  String billReceiptAdvance(String amount) {
    return 'Already on account: $amount';
  }

  @override
  String get billReceiptFillOldest => 'Fill oldest first';

  @override
  String get billReceiptClear => 'Clear';

  @override
  String get billReceiptBill => 'Bill';

  @override
  String get billReceiptDueOn => 'Due';

  @override
  String get billReceiptPending => 'Pending';

  @override
  String get billReceiptPayNow => 'Pay now';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days late',
      one: '$n day late',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'No open bills for this party.';

  @override
  String get billReceiptOnBills => 'On bills';

  @override
  String get billReceiptOnAccount => 'On account';

  @override
  String get billReceiptSaveReceipt => 'Save receipt';

  @override
  String get billReceiptSavePayment => 'Save payment';

  @override
  String billReceiptSaved(String number) {
    return 'Saved as $number';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'The bills add up to more than the amount.';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'One of the bills is no longer open. Reload and try again.';

  @override
  String get billReceiptErrorsOverBill =>
      'An amount is more than the bill still owes.';

  @override
  String get billReceiptErrorsAmountRequired => 'Enter the amount.';

  @override
  String get billReceiptErrorsBillTwice => 'The same bill is listed twice.';

  @override
  String get booksTitle => 'Account books';

  @override
  String get booksSubtitle =>
      'Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went.';

  @override
  String get booksCash => 'Cash book';

  @override
  String get booksBank => 'Bank book';

  @override
  String get booksGroup => 'Group by month';

  @override
  String get booksExpense => 'Cash and bank expense';

  @override
  String get booksFlow => 'Cash flow';

  @override
  String get booksShow => 'Show';

  @override
  String get booksPickGroup => 'Account group';

  @override
  String get booksOpening => 'Opening';

  @override
  String get booksReceipts => 'Receipts';

  @override
  String get booksPayments => 'Payments';

  @override
  String get booksClosing => 'Closing';

  @override
  String get booksAccounts => 'Accounts';

  @override
  String get booksByDay => 'By day';

  @override
  String get booksMonth => 'Month';

  @override
  String get booksDebit => 'Debit';

  @override
  String get booksCredit => 'Credit';

  @override
  String get booksExpenseAccount => 'Expense account';

  @override
  String get booksVouchers => 'Vouchers';

  @override
  String get booksOtherSide => 'Other side of the entry';

  @override
  String get booksMoneyIn => 'Money in';

  @override
  String get booksMoneyOut => 'Money out';

  @override
  String get booksNet => 'Net';

  @override
  String get booksTotal => 'Total';

  @override
  String get booksEmpty => 'Nothing in this period.';

  @override
  String get booksNoAccounts => 'No accounts in this group yet.';

  @override
  String get booksRcm => 'RCM register';

  @override
  String get booksAdjust => 'Bill to bill adjustment';

  @override
  String get booksVoucher => 'Voucher';

  @override
  String get booksBill => 'Bill settled';

  @override
  String get booksParty => 'Party';

  @override
  String get booksAmount => 'Amount';

  @override
  String get booksSupplier => 'Supplier';

  @override
  String get booksInvoice => 'Supplier invoice';

  @override
  String get booksTaxable => 'Taxable';

  @override
  String get booksCgst => 'CGST';

  @override
  String get booksSgst => 'SGST / UTGST';

  @override
  String get booksIgst => 'IGST';

  @override
  String get booksCess => 'Cess';

  @override
  String get hubReportsTitle => 'Reports';

  @override
  String get hubReportsSubtitle =>
      'Every report in one place, grouped by the question it answers.';

  @override
  String get hubMastersTitle => 'Masters';

  @override
  String get hubMastersSubtitle =>
      'The records every bill and voucher draws on: what you sell, who you deal with, prices and rules, stores and counters.';

  @override
  String get hubGroupsMerchandise => 'Merchandise';

  @override
  String get hubGroupsParties => 'Parties and people';

  @override
  String get hubGroupsCommercial => 'Prices, offers and tax';

  @override
  String get hubGroupsOperational => 'Stores, counters and rules';

  @override
  String get hubGroupsSales => 'Sales';

  @override
  String get hubGroupsStock => 'Stock';

  @override
  String get hubGroupsAccounts => 'Account reports';

  @override
  String get hubGroupsTax => 'Tax and statutory';

  @override
  String get hubGroupsAudit => 'Checks and audit';

  @override
  String get hubGroupsCustom => 'Your own reports';

  @override
  String get hubAboutMerchandise => 'Designs, sizes, colours and photos';

  @override
  String get hubAboutParties => 'Customers, suppliers and every ledger; staff';

  @override
  String get hubAboutCommercial =>
      'What things sell for and the GST that applies';

  @override
  String get hubAboutOperational =>
      'Where stock sits and how counters and numbers behave';

  @override
  String get hubAboutSales => 'What sold, where and to whom';

  @override
  String get hubAboutStock => 'What is on the shelves and how long it has sat';

  @override
  String get hubAboutAccounts => 'Who owes what, profit and the books';

  @override
  String get hubAboutTax =>
      'GST returns, payroll statutory and tax depreciation';

  @override
  String get hubAboutAudit => 'Exceptions to look at and who changed what';

  @override
  String get hubAboutCustom => 'Build, save and schedule your own';

  @override
  String get exchangeOpen => 'Return or exchange';

  @override
  String get exchangeTitle => 'Goods coming back on this bill';

  @override
  String exchangeTaking(num pieces, String number) {
    String _temp0 = intl.Intl.pluralLogic(
      pieces,
      locale: localeName,
      other: '$pieces pieces',
      one: '$pieces piece',
    );
    return '$_temp0 back from $number';
  }

  @override
  String get exchangeCredit => 'Credit';

  @override
  String get exchangeAdd => 'Take back on this bill';

  @override
  String exchangeCreditUsed(String number) {
    return 'Return against $number';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount of credit is left; it stays as store credit.';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'Return $number took $amount off this bill.';
  }

  @override
  String exchangeLeftCode(String amount) {
    return 'Store credit of $amount left, code:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'Returned (bill $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'Store credit $amount, code $code';
  }

  @override
  String get inwardTransporter => 'Transporter';

  @override
  String get inwardLrNumber => 'LR no.';

  @override
  String get inwardLrDate => 'LR date';

  @override
  String get inwardMarkup => 'Mark-up %';

  @override
  String get inwardMarkupHint => 'Fills MRP from cost';

  @override
  String get inwardRounding => 'Round MRP to';

  @override
  String get inwardRound1 => 'nearest rupee';

  @override
  String get inwardRound9 => 'ends in 9 (1,299)';

  @override
  String get inwardRound10 => 'next 10';

  @override
  String get inwardRound50 => 'next 50';

  @override
  String get inwardCost => 'Cost';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'Mark-up';

  @override
  String get inwardMarkupTitle => 'MRP over cost, as % of cost';

  @override
  String get inwardMarginCol => 'Margin';

  @override
  String get inwardMarginTitle => 'Mark-down from MRP to cost, as % of MRP';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces pieces, cost $value';
  }

  @override
  String get inwardLastPurchases => 'Last purchases';

  @override
  String get inwardPickLine => 'Pick a line to see what this item cost before.';

  @override
  String get inwardCurrentMrp => 'MRP now';

  @override
  String get inwardInStock => 'In stock';

  @override
  String get inwardDate => 'Date';

  @override
  String get inwardNeverBought => 'Not bought before.';

  @override
  String get inwardPrintLabels => 'Print labels for these pieces';

  @override
  String get inwardDocument => 'Challan';

  @override
  String get inwardState => 'State';

  @override
  String get inwardTransport => 'Transport';

  @override
  String get inwardSizeCurve => 'Pieces by size';

  @override
  String get inwardTotalQty => 'Pieces';

  @override
  String get inwardAtCost => 'At cost';

  @override
  String get inwardAvgMarkup => 'Mark-up';

  @override
  String get countsTitle => 'Stock counts';

  @override
  String get countsSubtitle =>
      'Count a store by scanning barcodes. An approver sees the differences and their value, and approving puts the books right.';

  @override
  String get countsWholeStore => 'Whole store';

  @override
  String get countsWhat => 'What to count';

  @override
  String get countsByAll => 'All goods in the store';

  @override
  String get countsByBrand => 'One brand';

  @override
  String get countsByCategory => 'One category';

  @override
  String get countsByStyleId => 'One design';

  @override
  String get countsName => 'Name';

  @override
  String get countsNamePlaceholder => 'e.g. Kurta wall';

  @override
  String get countsBlind =>
      'Blind count (counters do not see the book figures)';

  @override
  String get countsBlindShort => 'blind count';

  @override
  String get countsStart => 'Start counting';

  @override
  String get countsScanHere => 'Scan a barcode';

  @override
  String get countsAdd => 'Add';

  @override
  String get countsScanHint =>
      'Each scan adds one piece. Type 5*barcode for five, or type the count in the table below.';

  @override
  String get countsOutOfScope => 'not in this count, added';

  @override
  String get countsStatusCounting => 'Counting';

  @override
  String get countsStatusSubmitted => 'Waiting for approval';

  @override
  String get countsStatusApproved => 'Approved, books adjusted';

  @override
  String get countsStatusCancelled => 'Cancelled';

  @override
  String get countsJournal => 'See the stock adjustment';

  @override
  String get countsPiecesCounted => 'Pieces counted';

  @override
  String get countsItemsCounted => 'Items counted';

  @override
  String get countsInBooks => 'In the books';

  @override
  String get countsShort => 'Short (value)';

  @override
  String get countsExcess => 'Extra (value)';

  @override
  String get countsNet => 'Net difference';

  @override
  String get countsBlindNote =>
      'Blind count: the book figures show after you submit.';

  @override
  String get countsSubmit => 'Finish counting';

  @override
  String get countsReason => 'Reason for the differences';

  @override
  String countsApproveAdjust(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n items',
      one: '$n item',
    );
    return 'Approve and adjust $_temp0';
  }

  @override
  String get countsApproveNone => 'Approve (no differences)';

  @override
  String get countsRecount => 'Send back to count again';

  @override
  String get countsWaitingApproval =>
      'An owner or admin approves the differences.';

  @override
  String get countsCancelConfirm =>
      'Cancel this count? Nothing in the books changes.';

  @override
  String get countsCancel => 'Cancel count';

  @override
  String get countsOnlyDiff => 'Show only items that differ';

  @override
  String get countsItem => 'Item';

  @override
  String get countsCounted => 'Counted';

  @override
  String get countsDiff => 'Difference';

  @override
  String get countsValue => 'Value';

  @override
  String get countsNoDiff => 'Nothing differs from the books.';

  @override
  String get countsNumber => 'Count';

  @override
  String get countsStarted => 'Started';

  @override
  String get countsState => 'Stage';

  @override
  String get countsNone => 'No counts yet.';

  @override
  String get countsErrorsCountClosed =>
      'This count is no longer open for counting.';

  @override
  String get countsErrorsCountNotSubmitted => 'Finish counting first.';

  @override
  String get countsErrorsReasonRequired => 'Give a reason for the differences.';

  @override
  String get countsErrorsUnknownBarcode => 'No item has this barcode.';

  @override
  String get countsErrorsNothingToCount => 'No goods match that choice.';

  @override
  String get countsErrorsUnknownWarehouse => 'Choose a store.';

  @override
  String get countsErrorsTooManyCodes =>
      'The file has more than 5,000 different barcodes. Split it and import in parts.';

  @override
  String get countsImportTitle => 'Import a scanner file';

  @override
  String get countsImportHelp =>
      'A text file from a handheld scanner: one barcode per line, or a barcode and a quantity (\"8901234567890,3\"). Repeated barcodes add up.';

  @override
  String get countsImportMode => 'What to do with the numbers';

  @override
  String get countsImportAdd => 'Add to what is already counted';

  @override
  String get countsImportReplace => 'Replace the count for these barcodes';

  @override
  String get countsImportChoose => 'Choose file';

  @override
  String get countsImportReading => 'Reading...';

  @override
  String get countsImportTooBig => 'That file is too large (over 2 MB).';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matched items counted',
      one: '$matched item counted',
    );
    return '$_temp0, $pieces pieces';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n items were not on this count\'s list and were added.',
      one: '$n item was not on this count\'s list and was added.',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n codes are not items: $list',
      one: '$n code is not an item: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n lines could not be read (lines $list)',
      one: '$n line could not be read (line $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'Stock summary';

  @override
  String stockSubtitle(String method) {
    return 'Quantity and value of every item. Valued by $method.';
  }

  @override
  String get stockMethodAverage => 'moving average';

  @override
  String get stockMethodFifo => 'FIFO (first in, first out)';

  @override
  String get stockWarehouse => 'Warehouse';

  @override
  String get stockAllWarehouses => 'All warehouses';

  @override
  String get stockQty => 'Quantity';

  @override
  String get stockRate => 'Rate';

  @override
  String get stockValue => 'Value';

  @override
  String get stockTotalValue => 'Total stock value';

  @override
  String get stockBelowReorder => 'Below reorder level';

  @override
  String get stockReorderTitle => 'Items to reorder';

  @override
  String get stockReorderEmpty => 'Nothing is below its reorder level.';

  @override
  String get stockSuggested => 'Suggested order';

  @override
  String stockLedgerTitle(String item) {
    return 'Stock ledger: $item';
  }

  @override
  String get stockIn => 'In';

  @override
  String get stockOut => 'Out';

  @override
  String get stockSourceStockJournal => 'Stock journal';

  @override
  String get stockSourceGrn => 'Goods receipt';

  @override
  String get stockSourcePurchaseBill => 'Purchase bill';

  @override
  String get stockSourcePurchaseReturn => 'Purchase return';

  @override
  String get stockNegativeWarning =>
      'Stock of an item went below zero. Check for a missing purchase entry.';

  @override
  String get sjTitle => 'Stock journals';

  @override
  String get sjSubtitle =>
      'Opening stock, physical-count adjustments, transfers between warehouses, and consumption.';

  @override
  String get sjNew => 'New stock journal';

  @override
  String get sjKindsOpening => 'Opening stock';

  @override
  String get sjKindsAdjustment => 'Adjustment';

  @override
  String get sjKindsTransfer => 'Transfer';

  @override
  String get sjKindsIssue => 'Issue / consumption';

  @override
  String get sjKindHintsOpening =>
      'Stock you had when your books began. Enter the quantity and cost.';

  @override
  String get sjKindHintsAdjustment =>
      'Correct stock after a physical count: add or remove quantity.';

  @override
  String get sjKindHintsTransfer =>
      'Move goods between warehouses at their current cost.';

  @override
  String get sjKindHintsIssue =>
      'Goods used up in the business (samples, own use, production).';

  @override
  String get sjDirection => 'Add / remove';

  @override
  String get sjAdd => 'Add';

  @override
  String get sjRemove => 'Remove';

  @override
  String get sjToWarehouse => 'To warehouse';

  @override
  String get sjBatch => 'Batch';

  @override
  String get sjExpiry => 'Expiry';

  @override
  String get sjPost => 'Post stock journal';

  @override
  String get sjErrorsRateRequired => 'Enter the cost rate for opening stock.';

  @override
  String get sjErrorsServiceHasNoStock => 'Services don\'t have stock.';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses =>
      'Choose two different warehouses.';

  @override
  String get sjErrorsBatchRequired =>
      'This item tracks batches: enter a batch number.';

  @override
  String get sjErrorsQtyMustBePositive => 'Quantities must be more than zero.';

  @override
  String get purchaseSupplier => 'Supplier';

  @override
  String get purchaseChooseSupplier => 'Choose supplier…';

  @override
  String get purchaseItem => 'Item';

  @override
  String get purchaseChooseItem => 'Choose item…';

  @override
  String get purchaseQty => 'Qty';

  @override
  String get purchaseRate => 'Rate';

  @override
  String get purchaseDiscount => 'Discount';

  @override
  String get purchaseGst => 'GST %';

  @override
  String get purchaseAmount => 'Amount';

  @override
  String get purchaseTaxable => 'Taxable value';

  @override
  String get purchaseTotal => 'Total';

  @override
  String get purchaseStatus => 'Status';

  @override
  String get purchaseStatusesOpen => 'Open';

  @override
  String get purchaseStatusesPartial => 'Partly received';

  @override
  String get purchaseStatusesReceived => 'Received';

  @override
  String get purchaseStatusesClosed => 'Closed';

  @override
  String get purchaseStatusesCancelled => 'Cancelled';

  @override
  String get purchaseStatusesPosted => 'Posted';

  @override
  String get purchaseStatusesBilled => 'Billed';

  @override
  String get purchaseOrdersTitle => 'Purchase orders';

  @override
  String get purchaseOrdersSubtitle =>
      'What you\'ve ordered from suppliers and how much has arrived.';

  @override
  String get purchaseOrdersNew => 'New purchase order';

  @override
  String get purchaseOrdersExpectedOn => 'Expected by';

  @override
  String get purchaseOrdersOrdered => 'Ordered';

  @override
  String get purchaseOrdersReceived => 'Received';

  @override
  String get purchaseOrdersBilled => 'Billed';

  @override
  String get purchaseOrdersReceive => 'Receive goods';

  @override
  String get purchaseOrdersBill => 'Record bill';

  @override
  String get purchaseOrdersClose => 'Close order';

  @override
  String get purchaseReceiptsTitle => 'Inward challans';

  @override
  String get purchaseReceiptsSubtitle =>
      'Goods that arrived (GRN). Stock goes up on receipt; the bill comes later.';

  @override
  String get purchaseReceiptsNew => 'New inward challan';

  @override
  String get purchaseReceiptsChallan => 'Supplier challan no.';

  @override
  String get purchaseReceiptsBill => 'Record bill';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'Against order $number';
  }

  @override
  String get purchaseBillsTitle => 'Purchase bills';

  @override
  String get purchaseBillsSubtitle =>
      'Supplier invoices. Each one posts to purchases, input GST and the supplier\'s account.';

  @override
  String get purchaseBillsNew => 'New purchase bill';

  @override
  String get purchaseBillsInvoiceNo => 'Supplier invoice no.';

  @override
  String get purchaseBillsInvoiceDate => 'Supplier invoice date';

  @override
  String get purchaseBillsPostingDate => 'Posting date';

  @override
  String get purchaseBillsDueOn => 'Due on';

  @override
  String get purchaseBillsReverseCharge => 'Reverse charge (tax paid by us)';

  @override
  String get purchaseBillsReturn => 'Return goods';

  @override
  String get purchaseBillsReturned => 'Returned';

  @override
  String get purchaseBillsPost => 'Post bill';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'The bill rate differs from the goods receipt on line $line. Stock stays at the receipt rate.';
  }

  @override
  String get purchaseReturnsTitle => 'Purchase returns';

  @override
  String get purchaseReturnsSubtitle =>
      'Goods sent back to suppliers (debit notes).';

  @override
  String get purchaseReturnsNew => 'Return goods';

  @override
  String get purchaseReturnsReason => 'Reason';

  @override
  String get purchaseReturnsPost => 'Post debit note';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'Against bill $number';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'Choose an account under Sundry Creditors.';

  @override
  String get purchaseErrorsUnknownSupplier => 'Choose a supplier.';

  @override
  String get purchaseErrorsOverReceipt =>
      'That\'s more than is still due on the order.';

  @override
  String get purchaseErrorsOverBilling =>
      'That\'s more than was received and not yet billed.';

  @override
  String get purchaseErrorsOverReturn =>
      'That\'s more than was billed and not yet returned.';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'This supplier invoice has already been booked.';

  @override
  String get purchaseErrorsBillHasReturns =>
      'Cancel the returns against this bill first.';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'This receipt has been billed; cancel the bill first.';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'Goods were received against this order; close it instead.';

  @override
  String get purchaseErrorsOrderNotOpen => 'This order is closed.';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'The supplier\'s invoice date can\'t be after the posting date.';

  @override
  String get purchaseErrorsNoLines => 'Add at least one line.';

  @override
  String get purchaseErrorsItemArchived => 'One of the items is archived.';

  @override
  String get purchaseReadButton => 'Read bill';

  @override
  String get purchaseReadHint =>
      'Photo or PDF of the supplier\'s bill: the form is filled in for you to check.';

  @override
  String get purchaseReadReading => 'Reading the bill…';

  @override
  String get purchaseReadDone =>
      'Filled in from the bill. Please check every line before saving.';

  @override
  String purchaseReadUnmatched(String items) {
    return 'Choose the item for: $items.';
  }

  @override
  String get purchaseReadDemo =>
      'Automatic reading isn\'t set up; please type the bill.';

  @override
  String get purchaseReadNone => 'Couldn\'t read this bill; please type it.';

  @override
  String get inventorySettingsTitle => 'Inventory settings';

  @override
  String get inventorySettingsValuation => 'Stock valuation method';

  @override
  String get inventorySettingsValuationHint =>
      'How issued and remaining stock is valued. Changing it revalues all stock from the beginning.';

  @override
  String get inventorySettingsWarehouses => 'Warehouses';

  @override
  String get inventorySettingsAddWarehouse => 'Add warehouse';

  @override
  String get inventorySettingsWarehouseName => 'Warehouse name';

  @override
  String get inventorySettingsDefault => 'Default';

  @override
  String get inventorySettingsNameTaken =>
      'A warehouse with this name already exists.';

  @override
  String get salesCustomer => 'Customer';

  @override
  String get salesChooseCustomer => 'Choose customer…';

  @override
  String get salesPlaceOfSupply => 'Place of supply';

  @override
  String get salesExport => 'Export';

  @override
  String get salesSez => 'SEZ customer';

  @override
  String get salesLut => 'Under LUT (without tax)';

  @override
  String get salesStatusesDelivered => 'Delivered';

  @override
  String get salesStatusesInvoiced => 'Invoiced';

  @override
  String get salesStatusesAccepted => 'Accepted';

  @override
  String get salesStatusesDeclined => 'Declined';

  @override
  String get salesStatusesConverted => 'Converted';

  @override
  String get salesStatusesExpired => 'Expired';

  @override
  String get salesOrdersTitle => 'Sales orders';

  @override
  String get salesOrdersSubtitle =>
      'What customers have ordered and how much has gone out.';

  @override
  String get salesOrdersNew => 'New sales order';

  @override
  String get salesOrdersDeliverBy => 'Deliver by';

  @override
  String get salesOrdersCustomerRef => 'Customer\'s PO no.';

  @override
  String get salesOrdersOrdered => 'Ordered';

  @override
  String get salesOrdersDelivered => 'Delivered';

  @override
  String get salesOrdersInvoiced => 'Invoiced';

  @override
  String get salesOrdersDeliver => 'Deliver goods';

  @override
  String get salesOrdersInvoice => 'Create invoice';

  @override
  String get salesOrdersClose => 'Close order';

  @override
  String get salesDeliveriesTitle => 'Delivery challans';

  @override
  String get salesDeliveriesSubtitle =>
      'Goods sent out before (or without) an invoice. Stock goes down on delivery.';

  @override
  String get salesDeliveriesNew => 'New delivery challan';

  @override
  String get salesDeliveriesInvoice => 'Create invoice';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'Against order $number';
  }

  @override
  String get salesDeliveriesReason => 'Reason';

  @override
  String get salesDeliveriesValue => 'Value';

  @override
  String get salesDeliveriesTransporter => 'Transporter';

  @override
  String get salesDeliveriesVehicleNo => 'Vehicle no.';

  @override
  String get salesDeliveriesPrint => 'Print challan (3 copies)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return 'invoice by $date';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'Goods came back $count times',
      one: 'Goods came back once',
    );
    return '$_temp0: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'Take goods back';

  @override
  String get salesDeliveriesStillOut => 'Still out';

  @override
  String get salesDeliveriesCameBack => 'Came back';

  @override
  String get salesDeliveriesSaveReturn => 'Save return';

  @override
  String get salesDeliveriesNewApproval => 'New approval memo';

  @override
  String get salesDeliveriesReasonsSupply => 'Supply, invoice to follow';

  @override
  String get salesDeliveriesReasonsApproval => 'Sale on approval';

  @override
  String get salesDeliveriesReasonsJobWork => 'Job work';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'Not a supply (own use, repair)';

  @override
  String get salesDeliveriesReasonsLots => 'Supply in lots';

  @override
  String get salesDeliveriesReasonsExhibition => 'Exhibition or fair';

  @override
  String get salesDeliveriesReasonsOther => 'Other';

  @override
  String get salesDeliveriesReasonsSample => 'Samples';

  @override
  String get salesDeliveriesReasonHintsSupply =>
      'Goods sold; the tax invoice follows.';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'The customer keeps what sells. Invoice within six months or take the goods back.';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'Sent for processing; the goods come back.';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'Goods move without a sale, so no tax is shown.';

  @override
  String get salesDeliveriesReasonHintsLots =>
      'One supply sent in several lots.';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'Shown at an exhibition; unsold goods come back.';

  @override
  String get salesDeliveriesReasonHintsOther => 'Any other movement of goods.';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'Sent to show or try; not a sale, so no tax is shown. Unkept pieces come back on a return.';

  @override
  String get salesInvoicesTitle => 'Sales invoices';

  @override
  String get salesInvoicesSubtitle =>
      'Tax invoices. Each one posts to sales, output GST and the customer\'s account.';

  @override
  String get salesInvoicesNew => 'New invoice';

  @override
  String get salesInvoicesDueOn => 'Due on';

  @override
  String get salesInvoicesPost => 'Save invoice';

  @override
  String get salesInvoicesPrint => 'Print';

  @override
  String get salesInvoicesCreditNote => 'Credit note / return';

  @override
  String get salesInvoicesReturned => 'Returned';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'This takes the customer over their credit limit ($detail outstanding).';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return 'Goods worth $detail: an e-way bill is needed before they move.';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'Line $lineNo has no HSN code; it\'s required on tax invoices.';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'Some stock went below zero. Check for a missing purchase entry.';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'This customer has a bill $days days overdue.';
  }

  @override
  String get salesCreditNotesTitle => 'Credit notes';

  @override
  String get salesCreditNotesSubtitle =>
      'Sales returns and price reductions after sale.';

  @override
  String get salesCreditNotesNew => 'Credit note';

  @override
  String get salesCreditNotesReason => 'Reason';

  @override
  String get salesCreditNotesGoodsReturned => 'Goods returned to stock';

  @override
  String get salesCreditNotesPriceReduction =>
      'Price reduction only (no goods back)';

  @override
  String get salesCreditNotesCreditRate => 'Credit per unit';

  @override
  String get salesCreditNotesPost => 'Post credit note';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'Against invoice $number';
  }

  @override
  String get salesErrorsNotACustomer =>
      'Choose an account under Sundry Debtors.';

  @override
  String get salesErrorsUnknownCustomer => 'Choose a customer.';

  @override
  String get salesErrorsOverDelivery =>
      'That\'s more than is still due on the order.';

  @override
  String get salesErrorsOverInvoicing =>
      'That\'s more than was delivered and not yet invoiced.';

  @override
  String get salesErrorsOverReturn => 'More is coming back than is still out.';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'Cancel the credit notes against this invoice first.';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'This challan has been invoiced; cancel the invoice first.';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'Goods went out against this order; close it instead.';

  @override
  String get salesErrorsCancelIrnFirst => 'Cancel the e-invoice (IRN) first.';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'The credit can\'t be more than the invoiced rate.';

  @override
  String get salesErrorsRateRequired => 'Enter the credit per unit.';

  @override
  String get salesErrorsQuotationNotOpen =>
      'This quotation has already been converted or closed.';

  @override
  String get salesErrorsQuotationConverted =>
      'This quotation has been converted; cancel the order or invoice made from it first.';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'The quotation is for a different customer.';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“Valid until” can\'t be before the quotation date.';

  @override
  String get salesErrorsCancelEwbFirst => 'Cancel the e-way bill first.';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'GSTR-1 for this month is already filed. Date it in the current month, or amend on the GST portal.';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'The advance can\'t be more than the total.';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'Goods have come back on this challan, so it can\'t be cancelled.';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'The return date is before the challan date.';

  @override
  String get salesErrorsDeliveryCancelled => 'This challan is cancelled.';

  @override
  String get salesErrorsUnknownDeliveryLine =>
      'That line is not on this challan.';

  @override
  String get salesErrorsCreditBlocked =>
      'This sale takes the customer over their credit limit, and their account is set to block.';

  @override
  String get salesErrorsOverdueBlocked =>
      'This customer has a bill overdue longer than allowed, and their account is set to block.';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'Only an owner or admin can override a credit block.';

  @override
  String get salesErrorsNotAnAgent =>
      'Choose a ledger marked as a broker or agent.';

  @override
  String get salesErrorsUnknownSalesman =>
      'Choose a salesman from your employees.';

  @override
  String get salesErrorsUnknownOrder => 'That order was not found.';

  @override
  String get salesQuotationsTitle => 'Quotations';

  @override
  String get salesQuotationsSubtitle =>
      'Price quotes for customers. No stock or accounts effect until converted.';

  @override
  String get salesQuotationsNew => 'New quotation';

  @override
  String get salesQuotationsSave => 'Save quotation';

  @override
  String get salesQuotationsValidUntil => 'Valid until';

  @override
  String get salesQuotationsToOrder => 'Convert to order';

  @override
  String get salesQuotationsToInvoice => 'Convert to invoice';

  @override
  String get salesQuotationsAccept => 'Mark accepted';

  @override
  String get salesQuotationsDecline => 'Mark declined';

  @override
  String get salesQuotationsPrint => 'Print / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'order',
      'other': 'invoice',
    });
    return 'Converted to $_temp0';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'From quotation $number';
  }

  @override
  String get salesQuotationsTerms => 'Terms';

  @override
  String get salesProformasTitle => 'Proforma invoices';

  @override
  String get salesProformasSubtitle =>
      'Ask for payment or an advance before the goods go. No tax or stock effect until the invoice.';

  @override
  String get salesProformasNew => 'New proforma invoice';

  @override
  String get salesProformasSave => 'Save proforma';

  @override
  String get salesProformasAdvanceDue => 'Advance requested';

  @override
  String get salesProformasAdvanceHint =>
      'Leave empty to ask for the full amount';

  @override
  String get salesApprovalsTitle => 'Goods on approval';

  @override
  String get salesApprovalsSubtitle =>
      'Approval memos with goods still with the customer. Take back what didn\'t sell; invoice the rest within six months.';

  @override
  String salesApprovalsSummary(num count, String value) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count memos',
      one: '$count memo',
    );
    return '$_temp0 open, worth $value';
  }

  @override
  String get salesApprovalsDaysOut => 'Days out';

  @override
  String salesApprovalsDaysLeft(num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days days left',
      one: '$days day left',
    );
    return '$_temp0';
  }

  @override
  String get salesApprovalsEmpty => 'No goods out on approval.';

  @override
  String get salesOverrideCredit => 'Override and save';

  @override
  String get salesSamplesTitle => 'Samples out';

  @override
  String get salesSamplesSubtitle =>
      'Samples sent to parties and not yet back. They are not a sale and carry no tax. Take back what is not kept.';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count challans',
      one: '$count challan',
    );
    return '$_temp0 with $pieces pieces still out';
  }

  @override
  String get salesSamplesNew => 'New sample challan';

  @override
  String get salesSamplesEmpty => 'No samples are out.';

  @override
  String get einvoiceTitle => 'e-Invoice';

  @override
  String get einvoiceStatusNotRequired => 'Not required';

  @override
  String get einvoiceStatusPending => 'IRN pending';

  @override
  String get einvoiceStatusGenerated => 'IRN generated';

  @override
  String get einvoiceStatusCancelled => 'IRN cancelled';

  @override
  String get einvoiceStatusFailed => 'IRN failed';

  @override
  String get einvoiceGenerate => 'Generate IRN';

  @override
  String get einvoiceCancel => 'Cancel IRN';

  @override
  String get einvoiceCancelHint =>
      'An IRN can only be cancelled within 24 hours of generation.';

  @override
  String get einvoiceReasons1 => 'Duplicate';

  @override
  String get einvoiceReasons2 => 'Data entry mistake';

  @override
  String get einvoiceReasons3 => 'Order cancelled';

  @override
  String get einvoiceReasons4 => 'Other';

  @override
  String get einvoiceRemark => 'Remark';

  @override
  String get einvoiceIrn => 'IRN';

  @override
  String get einvoiceAckNo => 'Ack. no.';

  @override
  String get einvoiceAckDate => 'Ack. date';

  @override
  String get einvoiceSimulator =>
      'Test mode: IRNs come from the built-in simulator until a GST provider is connected.';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'The customer has no GSTIN; e-invoices are only for registered buyers and exports.';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'The invoice number isn\'t valid for the IRP.';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'Add a valid PIN code for the customer and your branch.';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'Add addresses for the customer and your branch.';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn =>
      'Every item needs an HSN code.';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch =>
      'The totals don\'t add up.';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'Add your branch\'s GSTIN first.';

  @override
  String get einvoiceErrorsDuplicateIrn => 'The IRP already has this invoice.';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'The 24 hours for cancelling this IRN have passed. Issue a credit note instead.';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated =>
      'The IRN has already been generated.';

  @override
  String get einvoiceErrorsCancelEwbFirst => 'Cancel the e-way bill first.';

  @override
  String get ewbTitle => 'e-Way bill';

  @override
  String get ewbGenerate => 'Generate e-way bill';

  @override
  String get ewbVehicleNo => 'Vehicle no.';

  @override
  String get ewbDistance => 'Distance (km)';

  @override
  String get ewbNumber => 'EWB no.';

  @override
  String get ewbValidUpto => 'Valid until';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'That doesn\'t look like a vehicle number (e.g. MH12AB1234).';

  @override
  String get ewbErrorsInvalidDistance => 'Enter the distance in km.';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'An e-way bill can only be extended from 8 hours before to 8 hours after it expires.';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'The 24 hours for cancelling this e-way bill have passed.';

  @override
  String get ewbErrorsEwbExpired =>
      'This e-way bill has expired; extend it instead.';

  @override
  String get ewbErrorsNoActiveEwb =>
      'There\'s no active e-way bill on this invoice.';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'An e-way bill is already active on this invoice.';

  @override
  String get ewbErrorsInvalidPincode => 'Enter a 6-digit PIN code.';

  @override
  String get ewbStatusActive => 'Active';

  @override
  String get ewbStatusCancelled => 'Cancelled';

  @override
  String get ewbChangeVehicle => 'Change vehicle';

  @override
  String get ewbExtend => 'Extend validity';

  @override
  String get ewbCancel => 'Cancel e-way bill';

  @override
  String get ewbNewVehicle => 'New vehicle no.';

  @override
  String get ewbCurrentPlace => 'Current place';

  @override
  String get ewbCurrentPincode => 'Current PIN code';

  @override
  String get ewbRemainingKm => 'Distance left (km)';

  @override
  String get ewbReason => 'Reason';

  @override
  String get ewbRemark => 'Remark';

  @override
  String get ewbSave => 'Save';

  @override
  String get ewbExtendHint =>
      'Allowed from 8 hours before to 8 hours after the e-way bill expires.';

  @override
  String get ewbCancelHint =>
      'Allowed within 24 hours of generation, if the goods haven\'t moved.';

  @override
  String ewbCancelledNote(String number) {
    return 'E-way bill $number was cancelled. You can generate a new one.';
  }

  @override
  String get ewbVehicleReasons1 => 'Vehicle breakdown';

  @override
  String get ewbVehicleReasons2 => 'Transshipment';

  @override
  String get ewbVehicleReasons3 => 'Other';

  @override
  String get ewbVehicleReasons4 => 'First time';

  @override
  String get ewbExtendReasons1 => 'Natural calamity';

  @override
  String get ewbExtendReasons2 => 'Law and order';

  @override
  String get ewbExtendReasons4 => 'Transshipment';

  @override
  String get ewbExtendReasons5 => 'Accident';

  @override
  String get ewbExtendReasons99 => 'Other';

  @override
  String get ewbCancelReasons1 => 'Duplicate';

  @override
  String get ewbCancelReasons2 => 'Order cancelled';

  @override
  String get ewbCancelReasons3 => 'Data entry mistake';

  @override
  String get ewbCancelReasons4 => 'Other';

  @override
  String get printTaxInvoice => 'Tax Invoice';

  @override
  String get printCreditNote => 'Credit Note';

  @override
  String get printOriginal => 'Original for recipient';

  @override
  String get printBillTo => 'Bill to';

  @override
  String get printShipTo => 'Ship to';

  @override
  String get printInvoiceNo => 'Invoice no.';

  @override
  String get printInvoiceDate => 'Invoice date';

  @override
  String get printSno => '#';

  @override
  String get printHsn => 'HSN/SAC';

  @override
  String get printTaxSummary => 'Tax summary';

  @override
  String get printRate => 'Rate';

  @override
  String get printAmountInWords => 'Amount in words';

  @override
  String get printBank => 'Bank details';

  @override
  String get printTerms => 'Terms & conditions';

  @override
  String printForCompany(String company) {
    return 'For $company';
  }

  @override
  String get printSignatory => 'Authorised signatory';

  @override
  String get printComputerGenerated => 'This is a computer-generated invoice.';

  @override
  String get printReverseCharge => 'Tax payable on reverse charge';

  @override
  String get printExportLut =>
      'Supply meant for export under LUT without payment of IGST';

  @override
  String get printQuotation => 'Quotation';

  @override
  String get printQuotationNo => 'Quotation no.';

  @override
  String get printQuotationDate => 'Quotation date';

  @override
  String get printQuotedTo => 'Quoted to';

  @override
  String get printComputerGeneratedQuote =>
      'This is a computer-generated quotation. Prices are valid until the date shown.';

  @override
  String get printProforma => 'Proforma invoice';

  @override
  String get printProformaNo => 'Proforma no.';

  @override
  String get printProformaDate => 'Proforma date';

  @override
  String get printComputerGeneratedProforma =>
      'This is a proforma invoice, not a tax invoice. The tax invoice will be issued on supply.';

  @override
  String get printDeliveryChallan => 'Delivery challan';

  @override
  String get printApprovalMemo => 'Approval memo';

  @override
  String get printCopyConsignee => 'Original for consignee';

  @override
  String get printCopyTransporter => 'Duplicate for transporter';

  @override
  String get printCopyConsignor => 'Triplicate for consignor';

  @override
  String get printConsignee => 'Consignee';

  @override
  String get printChallanNo => 'Challan no.';

  @override
  String get printChallanDate => 'Challan date';

  @override
  String get printInvoiceBy => 'Invoice by';

  @override
  String get printValue => 'Value';

  @override
  String get printNotASupply =>
      'Goods moved for a reason other than a supply. No tax is charged on this challan.';

  @override
  String get printReceivedBy => 'Received by';

  @override
  String get printSignatureAndDate => 'Signature and date';

  @override
  String get outstandingReceivablesTitle => 'Receivables';

  @override
  String get outstandingReceivablesSubtitle =>
      'What customers owe you, by age. Receipts settle the oldest bills first.';

  @override
  String get outstandingPayablesTitle => 'Payables';

  @override
  String get outstandingPayablesSubtitle =>
      'What you owe suppliers, by age. Payments settle the oldest bills first.';

  @override
  String get outstandingParty => 'Party';

  @override
  String get outstandingBalance => 'Balance';

  @override
  String get outstandingNotDue => 'Not yet due';

  @override
  String get outstandingD030 => '1 to 30 days';

  @override
  String get outstandingD3160 => '31 to 60 days';

  @override
  String get outstandingD6190 => '61 to 90 days';

  @override
  String get outstandingAdvance => 'Advance';

  @override
  String get outstandingOpenItems => 'Open bills';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days days overdue',
      one: '$days day overdue',
      zero: 'due',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'Nothing outstanding.';

  @override
  String get outstandingD91180 => '91 to 180 days';

  @override
  String get outstandingD180plus => 'Over 180 days';

  @override
  String get returnsTitle => 'GST returns';

  @override
  String get returnsSubtitle =>
      'GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal\'s offline tool.';

  @override
  String get returnsPeriod => 'Tax period';

  @override
  String get returnsGstr1 => 'GSTR-1';

  @override
  String get returnsGstr3b => 'GSTR-3B';

  @override
  String get returnsDownload => 'Download JSON';

  @override
  String get returnsSection => 'Section';

  @override
  String get returnsCount => 'Invoices';

  @override
  String get returnsTaxable => 'Taxable value';

  @override
  String get returnsTax => 'Tax';

  @override
  String get returnsB2b => 'B2B: registered customers';

  @override
  String get returnsB2cl => 'B2C large: other state, over ₹1 lakh';

  @override
  String get returnsB2cs => 'B2C small';

  @override
  String get returnsExp => 'Exports';

  @override
  String get returnsCdn => 'Credit notes';

  @override
  String get returnsCancelled => 'Cancelled invoices (in document summary)';

  @override
  String get returnsOutward => '3.1(a) Outward taxable supplies';

  @override
  String get returnsZeroRated => '3.1(b) Zero-rated (exports, SEZ)';

  @override
  String get returnsNil => '3.1(c) Nil-rated / exempt';

  @override
  String get returnsRcm => '3.1(d) Inward supplies on reverse charge';

  @override
  String get returnsItc => '4. Input tax credit';

  @override
  String get returnsSetOff => '6.1 Payment of tax';

  @override
  String get returnsHead => 'Tax head';

  @override
  String get returnsLiability => 'Tax due';

  @override
  String get returnsPaidByCredit => 'Paid by credit';

  @override
  String get returnsCash => 'Pay in cash';

  @override
  String get returnsCarryForward => 'Credit carried forward';

  @override
  String get returnsFilingNote =>
      'Filing goes through your GST provider. Test mode uses the built-in simulator until a provider is connected.';

  @override
  String get gstSettingsTitle => 'GST & invoicing';

  @override
  String get gstSettingsEinvoice => 'Generate e-invoices (IRN)';

  @override
  String get gstSettingsEinvoiceHint =>
      'Compulsory once your turnover has crossed ₹5 crore in any year since 2017-18.';

  @override
  String get gstSettingsEwbThreshold => 'E-way bill needed above (₹)';

  @override
  String get gstSettingsBilingual =>
      'Print invoices, payslips and Form 16 in two languages';

  @override
  String get gstSettingsPrintLanguage => 'Second language on prints';

  @override
  String get gstSettingsTerms => 'Invoice terms & conditions';

  @override
  String get gstSettingsBank => 'Bank details on invoices';

  @override
  String get importTitle => 'Import data';

  @override
  String get importSubtitle =>
      'Bring customers, suppliers and items across from a spreadsheet or from Tally.';

  @override
  String get importParties => 'Customers & suppliers (CSV)';

  @override
  String get importItems => 'Items (CSV)';

  @override
  String get importTally => 'Tally XML';

  @override
  String get importTemplate => 'Download sample CSV';

  @override
  String get importTallyHint =>
      'In Tally: Display → List of Accounts → Alt+E (Export), format XML. Include stock items.';

  @override
  String get importChoose => 'Choose file';

  @override
  String get importPreview => 'Check file';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count rows',
      one: '$count row',
    );
    return 'Import $_temp0';
  }

  @override
  String get importRow => 'Row';

  @override
  String get importStatus => 'Result';

  @override
  String get importCreate => 'Will be created';

  @override
  String get importExists => 'Already exists: skipped';

  @override
  String get importDone => 'Imported.';

  @override
  String get filingTitle => 'File on the GST portal';

  @override
  String get filingPortal => 'GST portal connection';

  @override
  String get filingPortalHint =>
      'Turn on “API access” in your GST portal profile first. The session lasts about 6 hours.';

  @override
  String get filingUsername => 'GST portal username';

  @override
  String get filingSendOtp => 'Send OTP';

  @override
  String get filingOtp => 'OTP';

  @override
  String get filingConnect => 'Connect';

  @override
  String filingConnected(String username, String time) {
    return 'Connected as $username until $time';
  }

  @override
  String get filingDisconnect => 'Disconnect';

  @override
  String filingSimulatorOtp(String otp) {
    return 'Test mode: the OTP is $otp.';
  }

  @override
  String get filingUpload => 'Upload';

  @override
  String get filingUploadAgain => 'Upload again';

  @override
  String filingUploaded(String time) {
    return 'Uploaded $time';
  }

  @override
  String get filingGetOtp => 'Send EVC OTP';

  @override
  String get filingEvcHint =>
      'The OTP goes to your authorised signatory\'s mobile.';

  @override
  String get filingFile => 'File with EVC';

  @override
  String filingFiled(String time) {
    return 'Filed $time';
  }

  @override
  String get filingArn => 'ARN';

  @override
  String get filingNotUploaded => 'Not uploaded';

  @override
  String get filingLocked =>
      'Invoices and credit notes for a month are locked once its GSTR-1 is filed.';

  @override
  String filingCashNote(String amount) {
    return 'Keep $amount in your electronic cash ledger before filing (challan on the GST portal).';
  }

  @override
  String get filingErrorsGstSessionRequired =>
      'Connect to the GST portal first.';

  @override
  String get filingErrorsGstSessionExpired =>
      'The GST portal session expired. Connect again.';

  @override
  String get filingErrorsInvalidOtp => 'That OTP isn\'t right.';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'Enter your GST portal username.';

  @override
  String get filingErrorsUploadFirst => 'Upload the return first.';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'Your books changed after the upload. Upload again, then file.';

  @override
  String get filingErrorsReturnAlreadyFiled => 'This return is already filed.';

  @override
  String get filingErrorsCompanyPanRequired =>
      'Add your business PAN under Company & branches.';

  @override
  String get filingErrorsInvalidPan => 'The business PAN isn\'t valid.';

  @override
  String get filingErrorsBranchGstinRequired =>
      'Add your head office\'s GSTIN first.';

  @override
  String get hrEmployeesTitle => 'Employees';

  @override
  String get hrEmployeesSubtitle =>
      'Your team, their pay and statutory details.';

  @override
  String get hrEmployeesNew => 'Add employee';

  @override
  String get hrEmployeesNone => 'No employees yet.';

  @override
  String get hrSectionsPersonal => 'Personal';

  @override
  String get hrSectionsJob => 'Job';

  @override
  String get hrSectionsStatutory => 'PF, ESI and tax';

  @override
  String get hrSectionsBank => 'Salary payment';

  @override
  String get hrSectionsSalary => 'Salary structure';

  @override
  String get hrCode => 'Employee code';

  @override
  String get hrCodeHint => 'Leave blank to number automatically';

  @override
  String get hrName => 'Full name';

  @override
  String get hrNameHi => 'Name in Hindi (optional)';

  @override
  String get hrGender => 'Gender';

  @override
  String get hrGendersMale => 'Male';

  @override
  String get hrGendersFemale => 'Female';

  @override
  String get hrGendersOther => 'Other';

  @override
  String get hrDob => 'Date of birth';

  @override
  String get hrJoinedOn => 'Joined on';

  @override
  String get hrLeftOn => 'Left on';

  @override
  String get hrFixedTerm => 'Fixed-term employee';

  @override
  String get hrDepartment => 'Department';

  @override
  String get hrDesignation => 'Designation';

  @override
  String get hrWorkState => 'Works in (state)';

  @override
  String get hrWorkStateHint => 'Decides professional tax';

  @override
  String get hrPhone => 'Mobile';

  @override
  String get hrEmail => 'Email';

  @override
  String get hrAddress => 'Address';

  @override
  String get hrCity => 'City';

  @override
  String get hrPincode => 'PIN code';

  @override
  String get hrPan => 'PAN';

  @override
  String get hrAadhaarLast4 => 'Aadhaar (last 4 digits only)';

  @override
  String get hrUan => 'UAN';

  @override
  String get hrEsiNumber => 'ESI IP number';

  @override
  String get hrPfMember => 'PF member';

  @override
  String get hrEpsEligible => 'In the pension scheme (EPS)';

  @override
  String get hrPfOnActual => 'PF on full wages (above ₹15,000)';

  @override
  String get hrDisabled => 'Person with disability (ESI up to ₹25,000)';

  @override
  String get hrTaxRegime => 'Tax regime';

  @override
  String get hrRegimesNew => 'New regime';

  @override
  String get hrRegimesOld => 'Old regime';

  @override
  String get hrMetro => 'Lives in a metro city (for HRA)';

  @override
  String get hrPaymentMode => 'Paid by';

  @override
  String get hrPaymentModesBank => 'Bank transfer';

  @override
  String get hrPaymentModesCash => 'Cash';

  @override
  String get hrPaymentModesCheque => 'Cheque';

  @override
  String get hrBankName => 'Bank';

  @override
  String get hrBankIfsc => 'IFSC';

  @override
  String get hrBankAccount => 'Account number';

  @override
  String hrBankAccountHint(String last4) {
    return 'Stored encrypted. On file: ending $last4';
  }

  @override
  String get hrMonthlyGross => 'Monthly gross';

  @override
  String get hrStatus => 'Status';

  @override
  String get hrStatusesActive => 'Active';

  @override
  String get hrStatusesLeft => 'Left';

  @override
  String get hrSave => 'Save';

  @override
  String get hrSaved => 'Saved';

  @override
  String get hrCreate => 'Add employee';

  @override
  String get hrSalaryTitle => 'Salary structure';

  @override
  String get hrSalaryEffectiveFrom => 'Effective from';

  @override
  String get hrSalaryComponent => 'Component';

  @override
  String get hrSalaryMonthly => 'Monthly (₹)';

  @override
  String get hrSalaryPfWage => 'Basic/DA (PF wage)';

  @override
  String get hrSalaryHra => 'HRA';

  @override
  String get hrSalaryEsiExcluded => 'Not ESI wages';

  @override
  String get hrSalaryAdd => 'Add component';

  @override
  String get hrSalaryRevise => 'Save revision';

  @override
  String get hrSalaryHistory => 'Earlier structures';

  @override
  String get hrSalaryGross => 'Monthly gross';

  @override
  String get hrSalaryAnnual => 'Yearly';

  @override
  String get hrSalaryDefaultsBasic => 'Basic';

  @override
  String get hrSalaryDefaultsHra => 'HRA';

  @override
  String get hrSalaryDefaultsSpecial => 'Special allowance';

  @override
  String get hrDeclarationTitle => 'Tax declaration';

  @override
  String get hrDeclarationHint =>
      'Used for TDS. Deductions other than the standard deduction apply only in the old regime.';

  @override
  String get hrDeclarationFy => 'Financial year';

  @override
  String get hrDeclarationRentPaid => 'Rent paid in the year';

  @override
  String get hrDeclarationC80 => '80C investments (PF is added automatically)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) NPS';

  @override
  String get hrDeclarationD80 => '80D health insurance';

  @override
  String get hrDeclarationHomeLoanInterest => 'Home loan interest';

  @override
  String get hrDeclarationOtherDeductions => 'Other deductions (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'Other income';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'Salary from previous employer this year';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'TDS already deducted this year (previous employer, or before Varchasv)';

  @override
  String get hrDeclarationSave => 'Save declaration';

  @override
  String get hrAttendanceTitle => 'Attendance';

  @override
  String get hrAttendanceSubtitle =>
      'Unmarked working days count as present. Click a day to mark it absent, then half day, then present again.';

  @override
  String get hrAttendanceLegendPresent => 'Present';

  @override
  String get hrAttendanceLegendAbsent => 'Absent';

  @override
  String get hrAttendanceLegendHalfDay => 'Half day';

  @override
  String get hrAttendanceLegendLeave => 'On leave';

  @override
  String get hrAttendanceLegendWeekOff => 'Weekly off';

  @override
  String get hrAttendanceLegendHoliday => 'Holiday';

  @override
  String get hrAttendanceLegendLate => 'Late';

  @override
  String get hrAttendanceLop => 'Loss of pay';

  @override
  String get hrAttendanceLocked =>
      'Payroll for this month is final, so attendance can\'t change.';

  @override
  String get hrAttendanceHolidays => 'Holidays';

  @override
  String get hrAttendanceAddHoliday => 'Add holiday';

  @override
  String get hrAttendanceHolidayName => 'Holiday';

  @override
  String get hrAttendanceNoEmployees => 'No one was employed this month.';

  @override
  String get hrAttendanceSaving => 'Saving…';

  @override
  String get hrLeaveTitle => 'Leave';

  @override
  String get hrLeaveSubtitle => 'Requests, approvals and balances.';

  @override
  String get hrLeaveNew => 'Apply for leave';

  @override
  String get hrLeaveEmployee => 'Employee';

  @override
  String get hrLeaveType => 'Leave type';

  @override
  String get hrLeaveFrom => 'From';

  @override
  String get hrLeaveTo => 'To';

  @override
  String get hrLeaveHalfDay => 'Half day';

  @override
  String get hrLeaveReason => 'Reason';

  @override
  String get hrLeaveDays => 'Days';

  @override
  String get hrLeaveSubmit => 'Submit request';

  @override
  String get hrLeaveApprove => 'Approve';

  @override
  String get hrLeaveReject => 'Reject';

  @override
  String get hrLeaveCancel => 'Cancel';

  @override
  String get hrLeavePending => 'Waiting for approval';

  @override
  String get hrLeaveAll => 'All requests';

  @override
  String get hrLeaveBalances => 'Leave balances';

  @override
  String get hrLeaveOpening => 'Brought forward';

  @override
  String get hrLeaveQuota => 'This year';

  @override
  String get hrLeaveTaken => 'Taken';

  @override
  String get hrLeaveBalance => 'Balance';

  @override
  String get hrLeaveNone => 'No leave requests.';

  @override
  String get hrLeaveStatusesPending => 'Pending';

  @override
  String get hrLeaveStatusesApproved => 'Approved';

  @override
  String get hrLeaveStatusesRejected => 'Rejected';

  @override
  String get hrLeaveStatusesCancelled => 'Cancelled';

  @override
  String get hrSettleTitle => 'Full and final settlement';

  @override
  String get hrSettleHint =>
      'Marks the employee as left, and pays gratuity and leave encashment. The last month\'s salary comes through payroll.';

  @override
  String get hrSettleLeftOn => 'Last working day';

  @override
  String get hrSettleServiceYears => 'Service (years)';

  @override
  String get hrSettleGratuity => 'Gratuity';

  @override
  String get hrSettleNotEligible => 'Not due (under 5 years)';

  @override
  String get hrSettleLeaveDays => 'Leave to encash (days)';

  @override
  String get hrSettleEncashment => 'Leave encashment';

  @override
  String get hrSettleOtherEarnings => 'Other dues (bonus, notice pay)';

  @override
  String get hrSettleRecoveries => 'Recoveries (advances)';

  @override
  String get hrSettleRemarks => 'Remarks';

  @override
  String get hrSettleTotal => 'Net payable';

  @override
  String get hrSettleConfirm => 'Settle and mark as left';

  @override
  String hrSettleDone(String date, String amount) {
    return 'Settled on $date: $amount';
  }

  @override
  String get hrPayslips => 'Payslips';

  @override
  String get hrErrorsInvalidPan => 'That PAN isn\'t valid (e.g. ABCDE1234F).';

  @override
  String get hrErrorsInvalidIfsc =>
      'That IFSC isn\'t valid (e.g. HDFC0001234).';

  @override
  String get hrErrorsInvalidBankAccount => 'Enter 6 to 18 digits.';

  @override
  String get hrErrorsBasicRequired =>
      'Mark at least one component as Basic/DA.';

  @override
  String get hrErrorsNoComponents => 'Add at least one salary component.';

  @override
  String get hrErrorsDuplicateComponent => 'Two components have the same code.';

  @override
  String get hrErrorsEmployeeCodeTaken =>
      'Another employee already has that code.';

  @override
  String get hrErrorsDobAfterJoining => 'Date of birth must be before joining.';

  @override
  String get hrErrorsBeforeJoining => 'That\'s before the joining date.';

  @override
  String get hrErrorsLeaveOverlap => 'This overlaps another leave request.';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'Not enough leave balance.';

  @override
  String get hrErrorsNoWorkingDays =>
      'Those dates are all holidays or weekly offs.';

  @override
  String get hrErrorsHalfDaySingleDate => 'A half day must be a single date.';

  @override
  String get hrErrorsLeaveCrossesYear => 'Split leave that runs past 31 March.';

  @override
  String get hrErrorsNotEmployedOnDate => 'Not employed on that date.';

  @override
  String get hrErrorsDayOnLeave =>
      'That day is on approved leave; cancel the leave first.';

  @override
  String get hrErrorsPayrollFinalized =>
      'Payroll for that month is already final.';

  @override
  String get hrErrorsLeaveNotPending =>
      'This request has already been decided.';

  @override
  String get hrErrorsLeaveNotOpen => 'This request is already closed.';

  @override
  String get hrErrorsLeftBeforeJoining => 'That\'s before the joining date.';

  @override
  String get hrErrorsNoSalaryStructure => 'Add a salary structure first.';

  @override
  String get hrErrorsAlreadyLeft => 'This employee has already been settled.';

  @override
  String get hrErrorsRecoveriesExceedDues =>
      'Recoveries can\'t be more than the dues.';

  @override
  String get hrErrorsInvalidUan => 'UAN has 12 digits.';

  @override
  String get hrErrorsInvalidEsiNumber => 'ESI IP number has 10 to 17 digits.';

  @override
  String get hrErrorsInvalidAadhaarLast4 => 'Enter only the last 4 digits.';

  @override
  String get hrErrorsInvalidPhone => 'Enter a 10-digit mobile number.';

  @override
  String get hrErrorsToBeforeFrom => '“To” can\'t be before “From”.';

  @override
  String get hrErrorsUnknownLeaveType => 'Choose a leave type.';

  @override
  String get hrErrorsUnknownEmployee => 'Choose an employee.';

  @override
  String get hrErrorsLoanNotActive =>
      'This loan is already fully paid back or cancelled.';

  @override
  String get hrErrorsOverRecovery =>
      'The amount is more than what is still owed on this loan.';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'The repayment date is before the date the loan was given.';

  @override
  String get hrErrorsExpiryBeforeIssue =>
      'The expiry date is before the issue date.';

  @override
  String get hrLoansTitle => 'Advances and loans';

  @override
  String get hrLoansNew => 'Give an advance or loan';

  @override
  String get hrLoansKind => 'Type';

  @override
  String get hrLoansKindsAdvance => 'Salary advance';

  @override
  String get hrLoansKindsLoan => 'Loan';

  @override
  String get hrLoansDate => 'Paid on';

  @override
  String get hrLoansAmount => 'Amount';

  @override
  String get hrLoansInstalment => 'Monthly instalment';

  @override
  String get hrLoansStartPeriod => 'Recover from';

  @override
  String get hrLoansPaidFrom => 'Paid from';

  @override
  String get hrLoansRemarks => 'Remarks';

  @override
  String get hrLoansRecovered => 'Recovered';

  @override
  String get hrLoansBalance => 'Balance';

  @override
  String get hrLoansStatusesActive => 'Recovering';

  @override
  String get hrLoansStatusesClosed => 'Recovered';

  @override
  String get hrLoansStatusesCancelled => 'Cancelled';

  @override
  String get hrLoansNone => 'No advances or loans.';

  @override
  String get hrLoansCreate => 'Pay out';

  @override
  String get hrLoansCancel => 'Cancel';

  @override
  String get hrLoansReceive => 'Receive repayment';

  @override
  String get hrLoansReceiveAmount => 'Amount received';

  @override
  String get hrLoansReceivedInto => 'Received into';

  @override
  String get hrLoansReceiveSave => 'Save repayment';

  @override
  String get hrShiftsTitle => 'Shifts';

  @override
  String get hrShiftsName => 'Shift';

  @override
  String get hrShiftsStart => 'Starts';

  @override
  String get hrShiftsEnd => 'Ends';

  @override
  String get hrShiftsGrace => 'Grace (min)';

  @override
  String get hrShiftsFullDay => 'Full day (min)';

  @override
  String get hrShiftsHalfDay => 'Half day (min)';

  @override
  String get hrShiftsIsDefault => 'Default';

  @override
  String get hrShiftsAdd => 'Add shift';

  @override
  String get hrShiftsSave => 'Save';

  @override
  String get hrShiftsNone =>
      'No shifts yet. Punches are read against 09:30–18:30.';

  @override
  String get hrShiftsShift => 'Shift';

  @override
  String get hrShiftsNoShift => 'Company default';

  @override
  String get hrPunchesTitle => 'Import punches';

  @override
  String get hrPunchesHint =>
      'A CSV from the biometric machine with columns: code, date (YYYY-MM-DD), in, out (24-hour HH:MM). Each day is read against the employee\'s shift.';

  @override
  String get hrPunchesTemplate => 'Download sample CSV';

  @override
  String get hrPunchesChoose => 'Choose CSV file';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count days',
      one: '$count day',
    );
    return 'Import $_temp0';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count days',
      one: '$count day',
    );
    return '$_temp0 imported.';
  }

  @override
  String get hrPunchesRow => 'Row';

  @override
  String get hrPunchesCode => 'Code';

  @override
  String get hrPunchesDate => 'Date';

  @override
  String get hrPunchesWorked => 'Worked';

  @override
  String get hrPunchesStatus => 'Result';

  @override
  String get hrPunchesLate => 'late';

  @override
  String get hrDocumentsTitle => 'Documents and KYC';

  @override
  String get hrDocumentsHelp =>
      'Identity and compliance documents. Only the last four characters of a number are shown. Add an expiry to be reminded before it lapses.';

  @override
  String get hrDocumentsNone => 'No documents on file yet.';

  @override
  String hrDocumentsExpires(String date) {
    return 'Expires $date';
  }

  @override
  String get hrDocumentsNoExpiry => 'No expiry';

  @override
  String get hrDocumentsExpired => 'Expired';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days left',
      one: '$n day left',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'Remove';

  @override
  String get hrDocumentsKind => 'Document';

  @override
  String get hrDocumentsNumber => 'Number';

  @override
  String get hrDocumentsIssuedOn => 'Issued on';

  @override
  String get hrDocumentsExpiresOnLabel => 'Expires on';

  @override
  String get hrDocumentsAdd => 'Add document';

  @override
  String get hrDocumentsKindsAadhaar => 'Aadhaar';

  @override
  String get hrDocumentsKindsPan => 'PAN';

  @override
  String get hrDocumentsKindsPassport => 'Passport';

  @override
  String get hrDocumentsKindsDrivingLicence => 'Driving licence';

  @override
  String get hrDocumentsKindsVoterId => 'Voter ID';

  @override
  String get hrDocumentsKindsBankProof => 'Bank proof';

  @override
  String get hrDocumentsKindsPoliceVerification => 'Police verification';

  @override
  String get hrDocumentsKindsMedicalFitness => 'Medical fitness';

  @override
  String get hrDocumentsKindsContract => 'Contract';

  @override
  String get hrDocumentsKindsOther => 'Other';

  @override
  String get hrDocumentsExpiringTitle => 'Documents expiring';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'Documents of working employees that have lapsed or will lapse soon, soonest first.';

  @override
  String get hrDocumentsWithin => 'Expiring within';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days',
      one: '$n day',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'Show';

  @override
  String get hrDocumentsEmployee => 'Employee';

  @override
  String get hrDocumentsNoneExpiring => 'Nothing expires in this window.';

  @override
  String get payrollTitle => 'Payroll';

  @override
  String get payrollSubtitle =>
      'Monthly salary with PF, ESI, professional tax and TDS worked out, posted to your books.';

  @override
  String get payrollRun => 'Run payroll';

  @override
  String get payrollMonth => 'Month';

  @override
  String get payrollNone => 'No payroll runs yet.';

  @override
  String payrollEmployees(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count employees',
      one: '$count employee',
    );
    return '$_temp0';
  }

  @override
  String get payrollStatusesDraft => 'Draft';

  @override
  String get payrollStatusesFinalized => 'Final';

  @override
  String get payrollStatusesPaid => 'Paid';

  @override
  String get payrollStatusesCancelled => 'Cancelled';

  @override
  String get payrollColsEmployee => 'Employee';

  @override
  String get payrollColsPaidDays => 'Paid days';

  @override
  String get payrollColsLop => 'LOP days';

  @override
  String get payrollColsGross => 'Gross';

  @override
  String get payrollColsPf => 'PF';

  @override
  String get payrollColsEsi => 'ESI';

  @override
  String get payrollColsPt => 'PT';

  @override
  String get payrollColsLwf => 'LWF';

  @override
  String get payrollColsTds => 'TDS';

  @override
  String get payrollColsOther => 'Other';

  @override
  String get payrollColsNet => 'Net pay';

  @override
  String get payrollRefresh => 'Refresh from attendance';

  @override
  String get payrollFinalize => 'Finalize and post';

  @override
  String get payrollFinalizeHint =>
      'Posts salary, PF, ESI, PT and TDS payable to your books. Attendance for the month is then locked.';

  @override
  String get payrollPay => 'Record payment';

  @override
  String get payrollPayFrom => 'Paid from';

  @override
  String get payrollPayDate => 'Payment date';

  @override
  String get payrollCancel => 'Cancel run';

  @override
  String get payrollFilesTitle => 'Files for filing and payment';

  @override
  String get payrollFilesEcr => 'EPF ECR';

  @override
  String get payrollFilesEsi => 'ESI contribution';

  @override
  String get payrollFilesBank => 'Bank transfer';

  @override
  String payrollFilesMissing(String codes) {
    return 'Left out (details missing): $codes';
  }

  @override
  String get payrollTotalsGross => 'Gross pay';

  @override
  String get payrollTotalsDeductions => 'Deductions';

  @override
  String get payrollTotalsNet => 'Net pay';

  @override
  String get payrollTotalsEmployer => 'Employer PF/ESI/LWF';

  @override
  String get payrollLopEdited => 'typed in';

  @override
  String get payrollLopReset => 'Use attendance';

  @override
  String get payrollAddDeduction => 'Add deduction';

  @override
  String get payrollDeductionName => 'Deduction';

  @override
  String get payrollDeductionAmount => 'Amount';

  @override
  String get payrollEdit => 'Edit';

  @override
  String get payrollView => 'Payslip';

  @override
  String get payrollErrorsRunExists => 'Payroll for that month already exists.';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'Finalize or cancel the earlier month\'s draft first.';

  @override
  String get payrollErrorsRunNotDraft => 'Only a draft can be changed.';

  @override
  String get payrollErrorsRunEmpty => 'No payslips to finalize.';

  @override
  String get payrollErrorsRunNotFinalized => 'Finalize the run first.';

  @override
  String get payrollErrorsRunPaid => 'A paid run can\'t be cancelled.';

  @override
  String get payrollErrorsLaterRunFinal =>
      'A later month is already final; cancel that first.';

  @override
  String get payrollErrorsLopExceedsDays =>
      'More loss-of-pay days than days in the month.';

  @override
  String get payrollErrorsDeductionsExceedPay =>
      'Deductions are more than the pay.';

  @override
  String get payrollErrorsInvalidPeriod => 'Choose a month.';

  @override
  String get payrollErrorsInvalidSettings => 'Check the settings.';

  @override
  String get payrollErrorsReservedCode =>
      'That code is kept for arrears worked out automatically.';

  @override
  String get payrollErrorsInvalidInstalment =>
      'The instalment must be more than 0 and not more than the amount.';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'Recovery can\'t start before the loan is paid.';

  @override
  String get payrollErrorsEmployeeNotActive => 'This employee has left.';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'Part of this has been recovered already; it can\'t be cancelled.';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'Enter the BSR code and challan serial number.';

  @override
  String get payrollErrorsInvalidBsrCode => 'The BSR code has 7 digits.';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'The challan serial has up to 5 digits.';

  @override
  String get payrollErrorsInvalidTan =>
      'That TAN isn\'t valid (e.g. MUMA12345B).';

  @override
  String get payrollErrorsNoFinalPayslips => 'No final payslips for that year.';

  @override
  String get payrollErrorsInvalidTime => 'Use 24-hour time like 09:30.';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'A half day can\'t be longer than a full day.';

  @override
  String get payrollErrorsInvalidAmount => 'Enter an amount.';

  @override
  String get payrollSettingsTitle => 'Payroll settings';

  @override
  String get payrollSettingsSubtitle =>
      'Registration codes, weekly offs and state levies.';

  @override
  String get payrollSettingsPfCode => 'EPF establishment code';

  @override
  String get payrollSettingsEsiCode => 'ESI employer code';

  @override
  String get payrollSettingsLabourCode =>
      'Apply the labour codes\' 50% wage rule';

  @override
  String get payrollSettingsLabourCodeHint =>
      'Under the Code on Social Security (from 21 Nov 2025), if allowances are more than half of pay, the excess counts as PF wages.';

  @override
  String get payrollSettingsWeeklyOffs => 'Weekly offs';

  @override
  String get payrollSettingsLwf => 'Labour welfare fund';

  @override
  String get payrollSettingsLwfEmployee => 'Employee share (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'Employer share (₹)';

  @override
  String get payrollSettingsLwfMonths => 'Deducted in';

  @override
  String get payrollSettingsEncashment => 'Leave encashment per day';

  @override
  String payrollSettingsDivisor(String n) {
    return 'Monthly wages ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'Save';

  @override
  String get payrollSettingsTan => 'TAN (tax deduction account number)';

  @override
  String get payrollSlipTitle => 'Payslip';

  @override
  String payrollSlipFor(String month) {
    return 'Payslip for $month';
  }

  @override
  String get payrollSlipEarnings => 'Earnings';

  @override
  String get payrollSlipDeductions => 'Deductions';

  @override
  String get payrollSlipNetPay => 'Net pay';

  @override
  String get payrollSlipInWords => 'In words';

  @override
  String get payrollSlipEmployer => 'Employer contributions (not deducted)';

  @override
  String get payrollSlipTax => 'Income tax working';

  @override
  String get payrollSlipAnnualSalary => 'Estimated salary for the year';

  @override
  String get payrollSlipTaxableIncome => 'Taxable income';

  @override
  String get payrollSlipAnnualTax => 'Tax for the year';

  @override
  String get payrollSlipDeductedSoFar => 'Deducted so far';

  @override
  String get payrollSlipPfEmployee => 'Provident fund';

  @override
  String get payrollSlipEsiEmployee => 'ESI';

  @override
  String get payrollSlipPt => 'Professional tax';

  @override
  String get payrollSlipLwf => 'Labour welfare fund';

  @override
  String get payrollSlipTds => 'Income tax (TDS)';

  @override
  String get payrollSlipEps => 'Pension (EPS)';

  @override
  String get payrollSlipEpf => 'PF (employer)';

  @override
  String get payrollSlipEdli => 'EDLI';

  @override
  String get payrollSlipAdmin => 'PF admin';

  @override
  String get payrollSlipEsiEmployer => 'ESI (employer)';

  @override
  String get payrollSlipComputerGenerated =>
      'This is a computer-generated payslip and needs no signature.';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count earlier months',
      one: '$count earlier month',
    );
    return 'Includes $_temp0 estimated from the salary structure (paid before Varchasv).';
  }

  @override
  String get payrollExtraTitle => 'Extra earnings (this month only)';

  @override
  String get payrollExtraName => 'Earning';

  @override
  String get payrollExtraAmount => 'Amount';

  @override
  String get payrollExtraAdd => 'Add earning';

  @override
  String get payrollExtraEsiExcluded => 'Not ESI wages (e.g. bonus)';

  @override
  String get payrollLoanRecoveryTitle => 'Loan and advance instalments';

  @override
  String get payrollLoanRecoveryHint =>
      'Type 0 to skip this month; clear to use the instalment.';

  @override
  String get payrollRegister => 'Salary register';

  @override
  String get payrollEmail => 'Email payslips';

  @override
  String payrollEmailed(String sent) {
    return 'Emailed $sent.';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'No email address: $codes';
  }

  @override
  String get statutoryTitle => 'Statutory dues & TDS';

  @override
  String get statutorySubtitle =>
      'PF, ESI, professional tax, LWF and TDS from final payroll, what\'s been paid, the quarterly TDS return and Form 16.';

  @override
  String get statutoryFy => 'Financial year';

  @override
  String get statutoryDues => 'Dues and payments';

  @override
  String get statutoryKind => 'Type';

  @override
  String get statutoryKindsPf => 'PF';

  @override
  String get statutoryKindsEsi => 'ESI';

  @override
  String get statutoryKindsPt => 'Professional tax';

  @override
  String get statutoryKindsLwf => 'LWF';

  @override
  String get statutoryKindsTds => 'TDS';

  @override
  String get statutoryPeriod => 'Wage month';

  @override
  String get statutoryDue => 'Due';

  @override
  String get statutoryPaid => 'Paid';

  @override
  String get statutoryBalance => 'Balance';

  @override
  String get statutoryDueDate => 'Pay by';

  @override
  String get statutoryPay => 'Record payment';

  @override
  String get statutoryPaidOn => 'Paid on';

  @override
  String get statutoryAccount => 'Paid from';

  @override
  String get statutoryReference => 'Challan / TRRN no.';

  @override
  String get statutoryBsrCode => 'BSR code';

  @override
  String get statutoryChallanSerial => 'Challan serial no.';

  @override
  String get statutoryRecord => 'Save payment';

  @override
  String get statutoryNone => 'No final payroll in this year yet.';

  @override
  String get statutoryOverdue => 'overdue';

  @override
  String get statutoryQ24Title => 'Quarterly TDS return (Form 24Q)';

  @override
  String get statutoryQ24Quarter => 'Quarter';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · Apr–Jun';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · Jul–Sep';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · Oct–Dec';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · Jan–Mar';

  @override
  String get statutoryQ24Deductees => 'Deductee rows';

  @override
  String get statutoryQ24Challans => 'Challans';

  @override
  String get statutoryQ24TotalTds => 'TDS';

  @override
  String get statutoryQ24Download => 'Deductee rows (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'Annexure II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'Import these into the NSDL Return Preparation Utility (RPU), check the file with the FVU, then upload it on TIN-NSDL.';

  @override
  String get statutoryQ24WarningsTanMissing =>
      'Add the TAN in Payroll settings.';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return 'No PAN for $detail: tax should be deducted at 20% without it.';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return 'Deducted and deposited don\'t match for $detail.';
  }

  @override
  String get statutoryForm16Title => 'Form 16';

  @override
  String get statutoryForm16Hint =>
      'Part B from payroll. Download Part A from TRACES and attach it; both are signed by the employer.';

  @override
  String get statutoryForm16View => 'Part B';

  @override
  String get form16Title => 'Form 16 · Part B';

  @override
  String get form16Subtitle =>
      'Certificate under section 203 for tax deducted at source on salary';

  @override
  String get form16Employer => 'Employer';

  @override
  String get form16Employee => 'Employee';

  @override
  String get form16Tan => 'TAN';

  @override
  String get form16Pan => 'PAN';

  @override
  String get form16Ay => 'Assessment year';

  @override
  String get form16Period => 'Period of employment';

  @override
  String get form16Salary => 'Salary paid';

  @override
  String get form16Gross => 'Gross salary';

  @override
  String get form16Previous => 'Salary from previous employer';

  @override
  String get form16Exemptions =>
      'Less exemptions and deductions under section 16';

  @override
  String get form16HraExempt => 'House rent allowance exempt';

  @override
  String get form16StandardDeduction => 'Standard deduction';

  @override
  String get form16Pt => 'Professional tax';

  @override
  String get form16HouseProperty =>
      'Income from house property (home loan interest)';

  @override
  String get form16ChapterVIA => 'Deductions under Chapter VI-A';

  @override
  String get form16TaxableIncome => 'Total taxable income';

  @override
  String get form16Tax => 'Tax on total income';

  @override
  String get form16Rebate => 'Rebate under section 87A';

  @override
  String get form16Surcharge => 'Surcharge';

  @override
  String get form16Cess => 'Health and education cess';

  @override
  String get form16Total => 'Tax payable';

  @override
  String get form16Regime => 'Tax regime';

  @override
  String get form16TdsQuarterly => 'Tax deducted and deposited';

  @override
  String get form16Quarter => 'Quarter';

  @override
  String get form16Challans => 'Challans (BSR code · date · serial)';

  @override
  String get form16TdsDeducted => 'Total tax deducted';

  @override
  String get form16Balance => 'Tax payable (refundable)';

  @override
  String get form16Verification =>
      'Certified that the information above is true and correct, based on the books of account, documents and records available.';

  @override
  String get form16Signature =>
      'Signature of the person responsible for deducting tax';

  @override
  String get form16PartA => 'Part A (from TRACES) to be attached.';

  @override
  String form16Missing(String months) {
    return 'No payslips here for $months (paid before Varchasv). Add that salary and tax before signing.';
  }

  @override
  String get mfgBomsTitle => 'Bills of materials';

  @override
  String get mfgBomsSubtitle =>
      'What goes into each item you make, with wastage, work-centre time and overheads.';

  @override
  String get mfgBomsNew => 'New BOM';

  @override
  String get mfgBomsItem => 'Item made';

  @override
  String get mfgBomsVersion => 'Version';

  @override
  String get mfgBomsOutputQty => 'Makes (quantity)';

  @override
  String get mfgBomsOverhead => 'Fixed overhead per batch (₹)';

  @override
  String get mfgBomsComponent => 'Material';

  @override
  String get mfgBomsQty => 'Quantity';

  @override
  String get mfgBomsWastage => 'Wastage %';

  @override
  String get mfgBomsOperations => 'Operations';

  @override
  String get mfgBomsOperation => 'Operation';

  @override
  String get mfgBomsWorkCentre => 'Work centre';

  @override
  String get mfgBomsMinutes => 'Minutes';

  @override
  String get mfgBomsAddLine => 'Add material';

  @override
  String get mfgBomsAddOperation => 'Add operation';

  @override
  String get mfgBomsSave => 'Save BOM';

  @override
  String get mfgBomsMakeDefault => 'Use as default';

  @override
  String get mfgBomsDefault => 'Default';

  @override
  String get mfgBomsArchive => 'Archive';

  @override
  String get mfgBomsArchived => 'Archived';

  @override
  String get mfgBomsUnitCost => 'Cost per unit';

  @override
  String get mfgBomsOverheadPerUnit => 'Overheads per unit';

  @override
  String get mfgBomsRate => 'Rate';

  @override
  String get mfgBomsCost => 'Cost';

  @override
  String get mfgBomsNone => 'No BOMs yet.';

  @override
  String get mfgBomsNotes => 'Notes';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count materials',
      one: '$count material',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'Work centres';

  @override
  String get mfgWorkCentresName => 'Work centre';

  @override
  String get mfgWorkCentresCostPerHour => 'Cost per hour (₹)';

  @override
  String get mfgWorkCentresAdd => 'Add work centre';

  @override
  String get mfgWorkCentresSave => 'Save';

  @override
  String get mfgOrdersTitle => 'Production orders';

  @override
  String get mfgOrdersSubtitle =>
      'Plan, release and complete production. Materials leave stock and output comes in at cost.';

  @override
  String get mfgOrdersNew => 'New production order';

  @override
  String get mfgOrdersItem => 'Item';

  @override
  String get mfgOrdersQty => 'Quantity';

  @override
  String get mfgOrdersDate => 'Date';

  @override
  String get mfgOrdersStatus => 'Status';

  @override
  String get mfgOrdersStatusesPlanned => 'Planned';

  @override
  String get mfgOrdersStatusesReleased => 'Released';

  @override
  String get mfgOrdersStatusesCompleted => 'Completed';

  @override
  String get mfgOrdersStatusesCancelled => 'Cancelled';

  @override
  String get mfgOrdersProduced => 'Produced';

  @override
  String get mfgOrdersRejected => 'Rejected';

  @override
  String get mfgOrdersRelease => 'Release';

  @override
  String get mfgOrdersIssue => 'Issue extra material';

  @override
  String get mfgOrdersComplete => 'Record output';

  @override
  String get mfgOrdersGoodQty => 'Good quantity';

  @override
  String get mfgOrdersRejectedQty => 'Rejected';

  @override
  String get mfgOrdersClose => 'Close the order after this';

  @override
  String get mfgOrdersRemaining => 'Still to make';

  @override
  String get mfgOrdersMaterials => 'Materials for what\'s left';

  @override
  String get mfgOrdersEntries => 'History';

  @override
  String get mfgOrdersUnitCost => 'Unit cost';

  @override
  String get mfgOrdersMaterialCost => 'Material cost';

  @override
  String get mfgOrdersOverheadCost => 'Overheads';

  @override
  String get mfgOrdersKindsIssue => 'Extra issue';

  @override
  String get mfgOrdersKindsComplete => 'Output';

  @override
  String get mfgOrdersReleaseNow => 'Release straight away';

  @override
  String get mfgOrdersNone => 'No production orders yet.';

  @override
  String get mfgOrdersSave => 'Create order';

  @override
  String get mfgOrdersCancel => 'Cancel order';

  @override
  String get mfgMrpTitle => 'Material planning (MRP)';

  @override
  String get mfgMrpSubtitle =>
      'What to make and buy to meet open sales orders and reorder levels, net of stock and what\'s already on order.';

  @override
  String get mfgMrpAsOf => 'Plan as of';

  @override
  String get mfgMrpAction => 'Action';

  @override
  String get mfgMrpActionsMake => 'Make';

  @override
  String get mfgMrpActionsBuy => 'Buy';

  @override
  String get mfgMrpQty => 'Quantity';

  @override
  String get mfgMrpNeedBy => 'Needed by';

  @override
  String get mfgMrpReleaseBy => 'Start / order by';

  @override
  String get mfgMrpOnHand => 'On hand';

  @override
  String get mfgMrpOnOrder => 'On order';

  @override
  String get mfgMrpSupplier => 'Supplier';

  @override
  String get mfgMrpConvert => 'Create orders for selected';

  @override
  String mfgMrpCreated(String orders) {
    return 'Created $orders.';
  }

  @override
  String get mfgMrpNone =>
      'Nothing to plan: stock and orders cover the demand.';

  @override
  String get mfgJobWorkTitle => 'Job work';

  @override
  String get mfgJobWorkSubtitle =>
      'Goods sent to job workers on a challan and received back processed. Inputs must return within a year (capital goods three).';

  @override
  String get mfgJobWorkSend => 'Send for job work';

  @override
  String get mfgJobWorkReceive => 'Receive back';

  @override
  String get mfgJobWorkJobWorker => 'Job worker';

  @override
  String get mfgJobWorkProcess => 'Process';

  @override
  String get mfgJobWorkSent => 'Sent';

  @override
  String get mfgJobWorkPending => 'Still with job worker';

  @override
  String get mfgJobWorkReturnBy => 'Return by';

  @override
  String get mfgJobWorkOverdue => 'overdue';

  @override
  String get mfgJobWorkReceived => 'Received item';

  @override
  String get mfgJobWorkConsumed => 'Inputs used';

  @override
  String get mfgJobWorkCharges => 'Job charges (₹)';

  @override
  String get mfgJobWorkFrom => 'From challan';

  @override
  String get mfgJobWorkItc04 => 'ITC-04 (half-yearly)';

  @override
  String get mfgJobWorkHalf => 'Half-year';

  @override
  String get mfgJobWorkHalvesH1 => 'April–September';

  @override
  String get mfgJobWorkHalvesH2 => 'October–March';

  @override
  String get mfgJobWorkSentTable => 'Goods sent';

  @override
  String get mfgJobWorkReceivedTable => 'Goods received back';

  @override
  String get mfgJobWorkPendingTable => 'Pending with job workers';

  @override
  String get mfgJobWorkNone => 'No job work yet.';

  @override
  String get mfgJobWorkCapitalGoods => 'Capital goods';

  @override
  String get mfgErrorsBomCycle =>
      'This makes a loop: an item would need itself.';

  @override
  String get mfgErrorsBomEmpty => 'Add at least one material.';

  @override
  String get mfgErrorsInvalidOutputQty => 'Enter how much a batch makes.';

  @override
  String get mfgErrorsDuplicateComponent => 'A material appears twice.';

  @override
  String get mfgErrorsUnknownWorkCentre => 'Choose a work centre.';

  @override
  String get mfgErrorsNoBom => 'This item has no active BOM.';

  @override
  String get mfgErrorsBomArchived => 'That BOM is archived.';

  @override
  String get mfgErrorsOrderNotPlanned =>
      'Only a planned order can be released.';

  @override
  String get mfgErrorsOrderNotReleased => 'Release the order first.';

  @override
  String get mfgErrorsSupplierRequired =>
      'Choose a supplier for the items to buy.';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'Choose a supplier or customer as the job worker.';

  @override
  String get mfgErrorsUnknownChallan => 'Choose a sent challan.';

  @override
  String get mfgErrorsChallanCancelled => 'That challan is cancelled.';

  @override
  String get mfgErrorsItemNotSent => 'That item wasn\'t sent on this challan.';

  @override
  String get mfgErrorsMoreThanSent => 'More than is still with the job worker.';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'Goods have come back on this challan; cancel those first.';

  @override
  String get posBillingTitle => 'Billing';

  @override
  String get posBillingTerminal => 'Counter';

  @override
  String get posBillingChooseTerminal => 'Choose a counter';

  @override
  String get posBillingOpenShift => 'Open shift';

  @override
  String get posBillingOpeningCash => 'Opening cash (₹)';

  @override
  String get posBillingCloseShift => 'Close shift';

  @override
  String get posBillingCountedCash => 'Cash counted (₹)';

  @override
  String get posBillingExpected => 'Expected';

  @override
  String get posBillingDifference => 'Difference';

  @override
  String get posBillingSearch => 'Scan barcode or search items';

  @override
  String get posBillingCart => 'Bill';

  @override
  String get posBillingEmpty => 'Add items to start a bill.';

  @override
  String get posBillingQty => 'Qty';

  @override
  String get posBillingPrice => 'Price';

  @override
  String get posBillingAmount => 'Amount';

  @override
  String get posBillingDiscount => 'Bill discount (₹)';

  @override
  String get posBillingCustomer => 'Customer mobile (for points)';

  @override
  String get posBillingCustomerName => 'Name';

  @override
  String posBillingPoints(String points) {
    return '$points points';
  }

  @override
  String get posBillingRedeem => 'Redeem points';

  @override
  String posBillingRedeemable(String points, String value) {
    return 'Up to $points points (₹$value)';
  }

  @override
  String get posBillingPayments => 'Payment';

  @override
  String get posBillingModesCash => 'Cash';

  @override
  String get posBillingModesUpi => 'UPI';

  @override
  String get posBillingModesCard => 'Card';

  @override
  String get posBillingModesCredit => 'On account';

  @override
  String get posBillingReference => 'Ref.';

  @override
  String get posBillingAddPayment => 'Split payment';

  @override
  String get posBillingPay => 'Complete bill';

  @override
  String get posBillingTotal => 'Total';

  @override
  String get posBillingChange => 'Change to return';

  @override
  String get posBillingDue => 'Still due';

  @override
  String get posBillingTaxable => 'Taxable';

  @override
  String get posBillingTax => 'GST';

  @override
  String get posBillingRoundOff => 'Round off';

  @override
  String posBillingDone(String number) {
    return 'Bill $number saved';
  }

  @override
  String get posBillingPrint => 'Print receipt';

  @override
  String get posBillingNewBill => 'New bill';

  @override
  String get posBillingShiftTotals => 'This shift';

  @override
  String get posBillingBills => 'Bills';

  @override
  String get posBillingDeviceTerminal =>
      'This counter bills from its device (offline app).';

  @override
  String get posBillsTitle => 'POS bills';

  @override
  String get posBillsSubtitle => 'Bills from all counters for a day.';

  @override
  String get posBillsDate => 'Date';

  @override
  String get posBillsNumber => 'Bill no.';

  @override
  String get posBillsTime => 'Time';

  @override
  String get posBillsMode => 'Paid by';

  @override
  String get posBillsVoid => 'Void';

  @override
  String get posBillsVoided => 'Void';

  @override
  String get posBillsReason => 'Reason';

  @override
  String get posBillsSummary => 'Day summary';

  @override
  String get posBillsTopItems => 'Best sellers';

  @override
  String get posBillsMismatch => 'Device total differed';

  @override
  String get posBillsNone => 'No bills on this day.';

  @override
  String get posSettingsTitle => 'Counter settings';

  @override
  String get posSettingsSubtitle =>
      'Pricing, loyalty points, discount limits and counters.';

  @override
  String get posSettingsPricesIncludeTax => 'Prices include GST';

  @override
  String get posSettingsLoyalty => 'Loyalty points';

  @override
  String get posSettingsLoyaltyEnabled => 'Give loyalty points';

  @override
  String get posSettingsPointsPer100 => 'Points per ₹100';

  @override
  String get posSettingsPointValue => 'Value of a point (₹)';

  @override
  String get posSettingsMaxRedeem => 'Most of a bill payable by points (%)';

  @override
  String get posSettingsFooter => 'Receipt footer';

  @override
  String get posSettingsTerminals => 'Counters';

  @override
  String get posSettingsTerminalName => 'Counter name';

  @override
  String get posSettingsWarehouse => 'Sells from';

  @override
  String get posSettingsDevice => 'Offline device';

  @override
  String get posSettingsNoDevice => 'None (web billing)';

  @override
  String get posSettingsAddTerminal => 'Add counter';

  @override
  String get posSettingsSave => 'Save';

  @override
  String get posReceiptTaxInvoice => 'Tax invoice';

  @override
  String get posReceiptBillOfSupply => 'Cash memo';

  @override
  String get posReceiptThanks => 'Thank you! Visit again.';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'Points earned: $points · Balance $balance';
  }

  @override
  String get posErrorsSessionNotOpen => 'Open a shift on this counter first.';

  @override
  String get posErrorsSessionAlreadyOpen =>
      'A shift is already open on this counter.';

  @override
  String get posErrorsSessionClosed => 'That shift is closed.';

  @override
  String get posErrorsDeviceTerminal => 'This counter bills from its device.';

  @override
  String get posErrorsTerminalOnOtherDevice =>
      'This counter belongs to another device.';

  @override
  String get posErrorsTooManyPoints =>
      'More points than can be used on this bill.';

  @override
  String get posErrorsLoyaltyNotAvailable =>
      'Enter the customer\'s mobile number first.';

  @override
  String get posErrorsOverpaidNonCash =>
      'UPI and card can\'t be more than the amount due.';

  @override
  String get posErrorsUnderpaid => 'The bill isn\'t fully paid.';

  @override
  String get posErrorsInvalidPayment => 'Enter a payment amount.';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'Choose a customer for an on-account sale.';

  @override
  String get posErrorsDiscountExceedsAmount =>
      'The discount is more than the bill.';

  @override
  String get posErrorsVoidSameDayOnly => 'Only today\'s bills can be voided.';

  @override
  String get posErrorsOrderNotOpen => 'That order is closed.';

  @override
  String get posErrorsBillNumberTaken => 'That bill number is already used.';

  @override
  String get posErrorsInvalidPhone => 'Enter a 10-digit mobile number.';

  @override
  String get posErrorsNoLines => 'Add at least one item.';

  @override
  String get posDeviceNoTerminal =>
      'This device has no billing counter. On the web, open POS settings and link a counter to this device, then sync.';

  @override
  String get posDeviceTodayBills => 'Today\'s bills on this device';

  @override
  String get posDeviceWaiting => 'Waiting to upload';

  @override
  String get posDeviceUploaded => 'Uploaded';

  @override
  String posDeviceFailed(String error) {
    return 'Not accepted: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'Server total $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'Bills are numbered on this device and upload when online.';

  @override
  String get posDeviceNoFiscalYear =>
      'No financial year covers today. Sync with the cloud first.';

  @override
  String get posPromoReferredBy => 'Referred by (mobile)';

  @override
  String posPromoReferredHint(String points) {
    return 'They get $points points';
  }

  @override
  String get posPromoCoupon => 'Coupon code';

  @override
  String posPromoCouponOk(String off) {
    return '$off off';
  }

  @override
  String get posPromoCard => 'Discount card';

  @override
  String get posPromoCardOff => 'Discount card';

  @override
  String posPromoCouponOff(String code) {
    return 'Coupon $code';
  }

  @override
  String posPromoVoucher(String code) {
    return 'Gift voucher $code';
  }

  @override
  String get posPromoToPay => 'To pay';

  @override
  String get posPromoVoucherCode => 'Gift voucher code';

  @override
  String get posPromoUseVoucher => 'Use voucher';

  @override
  String get posPromoReferralPoints => 'Referral points';

  @override
  String get posPromoReferralPointsHint =>
      'For a member whose referral joins and buys (0 = off)';

  @override
  String get posPromoErrorsCouponNotFound =>
      'No such coupon, or it is switched off.';

  @override
  String get posPromoErrorsCouponNotValidToday =>
      'This coupon is not valid today.';

  @override
  String get posPromoErrorsCouponUsedUp => 'This coupon has been used up.';

  @override
  String get posPromoErrorsCouponMinBill =>
      'The bill is below this coupon\'s minimum.';

  @override
  String get posPromoErrorsCardNotFound =>
      'No such discount card, or it is switched off.';

  @override
  String get posPromoErrorsCardExpired => 'This discount card has expired.';

  @override
  String get posPromoErrorsVoucherNotFound => 'No gift voucher with that code.';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'This gift voucher is used up or expired.';

  @override
  String get posPromoErrorsVoucherBalanceLow =>
      'The voucher does not have that much left.';

  @override
  String get posPromoErrorsVoucherMoreThanBill =>
      'Vouchers come to more than the bill.';

  @override
  String get posPromoErrorsVoucherTwice => 'The same voucher is entered twice.';

  @override
  String get posPromoErrorsOnlineOnly =>
      'Coupons, cards and gift vouchers need the online counter.';

  @override
  String get posCounterControls => 'Counter controls';

  @override
  String get posCounterAllowRateChange => 'Cashiers may change a rate';

  @override
  String get posCounterRequireSalesman => 'Every line needs a salesman';

  @override
  String get posCounterMaxLineDiscount => 'Largest line discount, %';

  @override
  String get posCounterMaxBillDiscount => 'Largest bill discount, %';

  @override
  String get posCounterLimitHint =>
      'Blank: no limit. More needs an approver\'s reason.';

  @override
  String get posCounterSalesman => 'Salesman';

  @override
  String get posCounterNoSalesman => 'No salesman';

  @override
  String get posCounterBillSalesman => 'Salesman for the bill';

  @override
  String get posCounterRate => 'Rate';

  @override
  String get posCounterRateLocked => 'Rate locked';

  @override
  String get posCounterDisc => 'Disc ₹';

  @override
  String get posCounterLineDiscount => 'Line discount in rupees';

  @override
  String posCounterVisits(String n) {
    return 'Visits: $n';
  }

  @override
  String posCounterSpent(String v) {
    return 'Spent $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'returned $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'last on $date';
  }

  @override
  String get posCounterBuys => 'Usually buys';

  @override
  String get posCounterNewCustomer => 'New customer: they join on this bill.';

  @override
  String get posCounterApprovalReason => 'Reason for approving';

  @override
  String get posCounterBrokenRate => 'rate changed';

  @override
  String get posCounterBrokenLineDiscount => 'line discount over the limit';

  @override
  String get posCounterBrokenBillDiscount => 'bill discount over the limit';

  @override
  String get posCounterNeedsApprover => 'Needs a manager to approve';

  @override
  String get posCounterHold => 'Hold bill';

  @override
  String posCounterHeldBills(String n) {
    return 'Held bills ($n)';
  }

  @override
  String get posCounterHoldLabel => 'Who is it for? (optional)';

  @override
  String get posCounterHoldNow => 'Hold';

  @override
  String get posCounterUnnamed => 'Customer';

  @override
  String posCounterPieces(String n) {
    return 'pieces: $n';
  }

  @override
  String get posCounterResume => 'Bill this';

  @override
  String get posCounterNoneHeld => 'No held bills.';

  @override
  String get posCounterHoldFirst =>
      'Hold or finish the current bill before picking another.';

  @override
  String get posCounterSizeStock => 'stock by size here';

  @override
  String get posCounterAddSize => 'Add this colour and size';

  @override
  String get posCounterKeysSearch => 'scan or search';

  @override
  String get posCounterKeysHold => 'hold bill';

  @override
  String get posCounterKeysHeld => 'held bills';

  @override
  String get posCounterKeysCustomer => 'customer';

  @override
  String get posCounterKeysDiscount => 'discount';

  @override
  String get posCounterKeysCash => 'all cash';

  @override
  String get posCounterKeysUpi => 'all UPI';

  @override
  String get posCounterKeysCard => 'all card';

  @override
  String get posCounterKeysPay => 'finish bill';

  @override
  String get posCounterKeysExchange => 'return or exchange';

  @override
  String get posCounterErrorsRateLocked =>
      'The rate is locked. A manager can allow it with a reason.';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'A line discount is over the counter limit. A manager can allow it with a reason.';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'The bill discount is over the counter limit. A manager can allow it with a reason.';

  @override
  String get posCounterErrorsSalesmanRequired =>
      'Choose the salesman for every line.';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'That salesman is not on the staff list.';

  @override
  String get posCounterErrorsHeldBillGone =>
      'That held bill was already picked up.';

  @override
  String get posCounterAutoSendBill =>
      'Send the bill on WhatsApp by itself when the customer gives a mobile';

  @override
  String get posCounterBrowse => 'Browse items';

  @override
  String get posCounterItem => 'Item';

  @override
  String posCounterPiecesInBill(String n) {
    return '$n pieces on the bill';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'Gross at rate $v';
  }

  @override
  String get posCounterOffers => 'Discount and offers';

  @override
  String get posCounterBreakdown => 'Bill breakdown';

  @override
  String get posCounterInclGst => 'including GST';

  @override
  String get posCounterBillItems => 'Bill items';

  @override
  String get posCounterScanToStart =>
      'Scan a barcode or search to start a bill. Press F4 to pick up a held bill.';

  @override
  String get bankingAccountsTitle => 'Banks';

  @override
  String get bankingAccountsSubtitle =>
      'Match your bank statements with the books.';

  @override
  String get bankingAccountsBookBalance => 'As per books';

  @override
  String get bankingAccountsStatementBalance => 'As per bank';

  @override
  String bankingAccountsAsOf(String date) {
    return 'on $date';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count lines to match',
      one: '$count line to match',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'All matched';

  @override
  String get bankingAccountsNone =>
      'No bank accounts yet. Add a ledger under Bank Accounts in the chart of accounts.';

  @override
  String get bankingAccountsReconcile => 'Reconcile';

  @override
  String get bankingAccountsNoStatement => 'No statement yet';

  @override
  String get bankingProfileTitle => 'Bank details';

  @override
  String get bankingProfileBankName => 'Bank';

  @override
  String get bankingProfileLast4 => 'Account (last 4 digits)';

  @override
  String get bankingProfileIfsc => 'IFSC';

  @override
  String get bankingProfileSave => 'Save';

  @override
  String get bankingImportTitle => 'Import statement';

  @override
  String get bankingImportHint =>
      'Download the statement from net banking as CSV (from Excel: Save As → CSV). Columns are found by their headings, so most Indian banks work.';

  @override
  String get bankingImportFile => 'Statement file (CSV)';

  @override
  String get bankingImportButton => 'Import';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$added lines added, $duplicates already there, $matched matched automatically.';
  }

  @override
  String get bankingFeedTitle => 'Bank feed';

  @override
  String get bankingFeedHint =>
      'Transactions come through the RBI Account Aggregator framework once you approve a consent. Until a provider is signed up, a simulator stands in.';

  @override
  String get bankingFeedConnect => 'Connect';

  @override
  String get bankingFeedFetch => 'Fetch now';

  @override
  String get bankingFeedDisconnect => 'Disconnect';

  @override
  String get bankingFeedStatusesActive => 'Connected';

  @override
  String get bankingFeedStatusesPending => 'Waiting for consent';

  @override
  String get bankingFeedStatusesRevoked => 'Disconnected';

  @override
  String bankingFeedFetched(String date) {
    return 'Fetched up to $date';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$added new transactions, $matched matched.';
  }

  @override
  String get bankingTabsOpen => 'To match';

  @override
  String get bankingTabsMatched => 'Matched';

  @override
  String get bankingTabsIgnored => 'Ignored';

  @override
  String get bankingTabsBrs => 'Reconciliation statement';

  @override
  String get bankingLinesDate => 'Date';

  @override
  String get bankingLinesDescription => 'Narration';

  @override
  String get bankingLinesWithdrawal => 'Withdrawal';

  @override
  String get bankingLinesDeposit => 'Deposit';

  @override
  String get bankingLinesBalance => 'Balance';

  @override
  String get bankingLinesSuggestion => 'Looks like';

  @override
  String get bankingLinesAccept => 'Match';

  @override
  String get bankingLinesCreate => 'Post entry';

  @override
  String get bankingLinesIgnore => 'Ignore';

  @override
  String get bankingLinesByHand => 'Find entry';

  @override
  String get bankingLinesUnmatch => 'Unmatch';

  @override
  String get bankingLinesRestore => 'Restore';

  @override
  String get bankingLinesAccount => 'Post to ledger';

  @override
  String get bankingLinesNarration => 'Narration';

  @override
  String bankingLinesRule(String account) {
    return 'Rule: $account';
  }

  @override
  String get bankingLinesApplyRules => 'Post all rule matches';

  @override
  String bankingLinesRulesDone(String count) {
    return '$count entries posted.';
  }

  @override
  String get bankingLinesNone => 'Nothing here.';

  @override
  String bankingLinesEntries(String from, String to) {
    return 'Unmatched entries from $from to $to';
  }

  @override
  String get bankingLinesMatchSelected => 'Match selected';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return 'Selected $total of $amount';
  }

  @override
  String get bankingLinesReasonsAmount => 'same amount';

  @override
  String get bankingLinesReasonsSameDay => 'same day';

  @override
  String get bankingLinesReasonsReference => 'same reference';

  @override
  String get bankingLinesReasonsParty => 'party named';

  @override
  String get bankingBrsAsOf => 'As on';

  @override
  String get bankingBrsPerBooks => 'Balance as per books';

  @override
  String get bankingBrsNotPresented =>
      'Add: cheques issued but not yet presented';

  @override
  String get bankingBrsNotCredited =>
      'Less: deposits not yet credited by the bank';

  @override
  String get bankingBrsBankDebits => 'Less: bank debits not in the books';

  @override
  String get bankingBrsBankCredits => 'Add: bank credits not in the books';

  @override
  String get bankingBrsPerBank => 'Balance as per bank';

  @override
  String bankingBrsStatement(String date) {
    return 'Statement balance on $date';
  }

  @override
  String get bankingBrsDifference => 'Difference';

  @override
  String get bankingBrsBalanced => 'Reconciled';

  @override
  String get bankingRulesTitle => 'Bank rules';

  @override
  String get bankingRulesSubtitle =>
      'Statement lines with these words are posted to a ledger in one click (bank charges, interest, standing orders).';

  @override
  String get bankingRulesContains => 'Narration contains';

  @override
  String get bankingRulesDirection => 'Money';

  @override
  String get bankingRulesDirectionsIn => 'In';

  @override
  String get bankingRulesDirectionsOut => 'Out';

  @override
  String get bankingRulesDirectionsAny => 'In or out';

  @override
  String get bankingRulesAccount => 'Post to';

  @override
  String get bankingRulesNarration => 'Narration';

  @override
  String get bankingRulesPriority => 'Priority';

  @override
  String get bankingRulesAdd => 'Add rule';

  @override
  String get bankingRulesSave => 'Save';

  @override
  String get bankingSettlementsTitle => 'Gateway settlements';

  @override
  String get bankingSettlementsSubtitle =>
      'Payouts from Razorpay, PhonePe, Paytm and others: collections less refunds, fees and GST on fees, landing in the bank as one credit.';

  @override
  String get bankingSettlementsProvider => 'Gateway';

  @override
  String get bankingSettlementsBank => 'Paid into';

  @override
  String get bankingSettlementsClearing => 'Collections were booked to';

  @override
  String get bankingSettlementsFile => 'Settlement report (CSV)';

  @override
  String get bankingSettlementsImport => 'Import';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$posted payouts posted, $skipped already done, $matched matched with the bank.';
  }

  @override
  String get bankingSettlementsSettlementId => 'Settlement';

  @override
  String get bankingSettlementsSettledOn => 'Settled';

  @override
  String get bankingSettlementsPayments => 'Payments';

  @override
  String get bankingSettlementsGross => 'Collected';

  @override
  String get bankingSettlementsRefunds => 'Refunds';

  @override
  String get bankingSettlementsFees => 'Fees';

  @override
  String get bankingSettlementsTax => 'GST on fees';

  @override
  String get bankingSettlementsNet => 'Paid out';

  @override
  String get bankingSettlementsMatched => 'In bank';

  @override
  String get bankingSettlementsNone => 'No settlements yet.';

  @override
  String get bankingErrorsNoHeader =>
      'Couldn\'t find the heading row. Save the statement as CSV with its column headings.';

  @override
  String get bankingErrorsNoRows => 'No transactions found in the file.';

  @override
  String get bankingErrorsBadAmount =>
      'An amount in the file couldn\'t be read.';

  @override
  String get bankingErrorsUnknownFormat =>
      'This doesn\'t look like a settlement report (it needs settlement id, amount and fee columns).';

  @override
  String get bankingErrorsInvalidFile => 'The file couldn\'t be read.';

  @override
  String get bankingErrorsNotABankAccount =>
      'Choose a ledger under Bank Accounts.';

  @override
  String get bankingErrorsFeedNotConnected => 'Connect the bank feed first.';

  @override
  String get bankingErrorsLineAlreadyMatched => 'That line is already matched.';

  @override
  String get bankingErrorsVoucherNotOpen =>
      'That entry is already matched or cancelled.';

  @override
  String get bankingErrorsWrongDirection =>
      'Money in can only match receipts, money out only payments.';

  @override
  String get bankingErrorsAmountsDiffer =>
      'The entries don\'t add up to the line\'s amount.';

  @override
  String get bankingErrorsSameAccount => 'Choose a different ledger.';

  @override
  String get bankingErrorsInvalidIfsc => 'Enter a valid IFSC.';

  @override
  String get assetsRegisterTitle => 'Fixed assets';

  @override
  String get assetsRegisterSubtitle =>
      'Register, depreciation as per the Companies Act, and the income-tax block schedule.';

  @override
  String get assetsRegisterNew => 'Add asset';

  @override
  String get assetsRegisterCode => 'Code';

  @override
  String get assetsRegisterName => 'Asset';

  @override
  String get assetsRegisterClass => 'Class';

  @override
  String get assetsRegisterPurchased => 'Bought';

  @override
  String get assetsRegisterPutToUse => 'In use from';

  @override
  String get assetsRegisterCost => 'Cost';

  @override
  String get assetsRegisterAccumulated => 'Depreciation to date';

  @override
  String get assetsRegisterBookValue => 'Book value';

  @override
  String get assetsRegisterStatus => 'Status';

  @override
  String get assetsRegisterStatusesActive => 'In use';

  @override
  String get assetsRegisterStatusesDisposed => 'Sold / scrapped';

  @override
  String get assetsRegisterLocation => 'Location';

  @override
  String get assetsRegisterSerialNo => 'Serial no.';

  @override
  String get assetsRegisterCustodian => 'With';

  @override
  String get assetsRegisterNone => 'No assets yet.';

  @override
  String get assetsClassesTitle => 'Asset classes';

  @override
  String get assetsClassesPresets => 'Add a standard class';

  @override
  String get assetsClassesPreset => 'Class';

  @override
  String get assetsClassesAdd => 'Add';

  @override
  String get assetsClassesCustom => 'Or define your own';

  @override
  String get assetsClassesName => 'Name';

  @override
  String get assetsClassesMethod => 'Method';

  @override
  String get assetsClassesMethodsSlm => 'Straight line';

  @override
  String get assetsClassesMethodsWdv => 'Written down value';

  @override
  String get assetsClassesLife => 'Useful life (years)';

  @override
  String get assetsClassesResidual => 'Residual value %';

  @override
  String get assetsClassesItBlock => 'Income-tax block';

  @override
  String get assetsClassesItRate => 'Tax rate %';

  @override
  String get assetsClassesBlocksBuilding => 'Buildings';

  @override
  String get assetsClassesBlocksPlantMachinery => 'Plant & machinery';

  @override
  String get assetsClassesBlocksFurniture => 'Furniture & fittings';

  @override
  String get assetsClassesBlocksComputers => 'Computers & software';

  @override
  String get assetsClassesBlocksIntangibles => 'Intangible assets';

  @override
  String get assetsFormAcquisition => 'How it came in';

  @override
  String get assetsFormAcquisitionsSupplier => 'Bought on credit';

  @override
  String get assetsFormAcquisitionsPaid => 'Paid from cash or bank';

  @override
  String get assetsFormAcquisitionsOpening =>
      'Already in the books (brought forward)';

  @override
  String get assetsFormSupplier => 'Supplier';

  @override
  String get assetsFormPaidFrom => 'Paid from';

  @override
  String get assetsFormGstRate => 'GST rate % (input credit taken)';

  @override
  String get assetsFormSupplierGstin => 'Supplier GSTIN';

  @override
  String get assetsFormInvoiceRef => 'Bill no.';

  @override
  String get assetsFormOpeningAccumulated => 'Depreciation charged before';

  @override
  String get assetsFormNotes => 'Notes';

  @override
  String get assetsFormSave => 'Add asset';

  @override
  String get assetsDetailHistory => 'Depreciation charged';

  @override
  String get assetsDetailPeriod => 'Period';

  @override
  String get assetsDetailDays => 'Days';

  @override
  String get assetsDetailVoucher => 'Entry';

  @override
  String get assetsDetailDispose => 'Sell or scrap';

  @override
  String get assetsDetailDisposeDate => 'Date';

  @override
  String get assetsDetailSaleValue => 'Sale value (₹, 0 if scrapped)';

  @override
  String get assetsDetailReceivedIn => 'Received in';

  @override
  String get assetsDetailSaleGst => 'GST on sale %';

  @override
  String get assetsDetailBuyerState => 'Buyer\'s state (if outside yours)';

  @override
  String get assetsDetailDisposeButton => 'Record sale';

  @override
  String assetsDetailDisposed(String date, String value) {
    return 'Sold on $date for $value';
  }

  @override
  String get assetsDetailProfit => 'Profit on sale';

  @override
  String get assetsDetailLoss => 'Loss on sale';

  @override
  String get assetsDetailPurchase => 'Purchase entry';

  @override
  String get assetsDepreciationTitle => 'Depreciation';

  @override
  String get assetsDepreciationSubtitle =>
      'Charge depreciation for a month, quarter or year. Each asset continues from where it was last charged.';

  @override
  String get assetsDepreciationFrom => 'From';

  @override
  String get assetsDepreciationTo => 'To';

  @override
  String get assetsDepreciationPreview => 'Work it out';

  @override
  String get assetsDepreciationPost => 'Post depreciation';

  @override
  String get assetsDepreciationTotal => 'Total';

  @override
  String get assetsDepreciationRuns => 'Runs';

  @override
  String get assetsDepreciationNone => 'Nothing to charge for this period.';

  @override
  String get assetsDepreciationCancel => 'Cancel run';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count assets',
      one: '$count asset',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'Income-tax depreciation';

  @override
  String get assetsItSubtitle =>
      'Block-wise, as for the tax audit report (Form 3CD, clause 18). Additions used for under 180 days get half the rate.';

  @override
  String get assetsItFy => 'Year';

  @override
  String get assetsItBlock => 'Block';

  @override
  String get assetsItRate => 'Rate';

  @override
  String get assetsItOpening => 'Opening WDV';

  @override
  String get assetsItAddFull => 'Additions (180 days or more)';

  @override
  String get assetsItAddHalf => 'Additions (under 180 days)';

  @override
  String get assetsItSales => 'Sales';

  @override
  String get assetsItDepreciation => 'Depreciation';

  @override
  String get assetsItClosing => 'Closing WDV';

  @override
  String get assetsItGain => 'Short-term gain';

  @override
  String get assetsItLoss => 'Short-term loss';

  @override
  String get assetsItOpeningTitle => 'Opening written down value';

  @override
  String get assetsItOpeningHint =>
      'Enter each block\'s WDV at the start of the first year from your last tax return; later years carry forward.';

  @override
  String get assetsItSave => 'Save';

  @override
  String get assetsItTotal => 'Total';

  @override
  String get assetsItNone => 'No assets in this year.';

  @override
  String get assetsErrorsClassExists => 'That class already exists.';

  @override
  String get assetsErrorsClassIncomplete =>
      'Fill in the name, life and tax block.';

  @override
  String get assetsErrorsUnknownPreset => 'Choose a class.';

  @override
  String get assetsErrorsInvalidLife => 'Enter the useful life in years.';

  @override
  String get assetsErrorsInvalidResidual =>
      'Written down value needs a residual value above 0%.';

  @override
  String get assetsErrorsUnknownClass => 'Choose a class.';

  @override
  String get assetsErrorsClassArchived => 'That class is archived.';

  @override
  String get assetsErrorsInvalidCost => 'Enter the cost.';

  @override
  String get assetsErrorsUsedBeforeBought =>
      'It can\'t be in use before it was bought.';

  @override
  String get assetsErrorsAccountRequired => 'Choose the ledger.';

  @override
  String get assetsErrorsNotASupplier => 'Choose a supplier.';

  @override
  String get assetsErrorsNotCashOrBank => 'Choose a cash or bank ledger.';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'Enter the supplier\'s GSTIN to take input credit.';

  @override
  String get assetsErrorsPeriodCrossesYear =>
      'The period must be within one financial year.';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'Nothing to charge for this period.';

  @override
  String get assetsErrorsLaterRunExists =>
      'A later run charges these assets; cancel that first.';

  @override
  String get assetsErrorsAssetDisposed => 'An asset in this run has been sold.';

  @override
  String get assetsErrorsAlreadyDisposed => 'This asset is already sold.';

  @override
  String get assetsErrorsSoldBeforeUse =>
      'The sale date is before it was put to use.';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'Depreciation has been charged beyond the sale date; cancel that run first.';

  @override
  String get assetsErrorsInvalidDepreciation =>
      'Depreciation couldn\'t be worked out.';

  @override
  String get assetsErrorsInvalidFy => 'Choose a year.';

  @override
  String get expensesClaimsTitle => 'Expense claims';

  @override
  String get expensesClaimsSubtitle =>
      'Staff claim what they spent; approving books it (with GST credit where allowed) and paying settles it.';

  @override
  String get expensesClaimsNew => 'New claim';

  @override
  String get expensesClaimsNumber => 'Claim';

  @override
  String get expensesClaimsEmployee => 'Employee';

  @override
  String get expensesClaimsDate => 'Date';

  @override
  String get expensesClaimsClaimTitle => 'Purpose';

  @override
  String get expensesClaimsTotal => 'Amount';

  @override
  String get expensesClaimsItc => 'GST credit';

  @override
  String get expensesClaimsStatus => 'Status';

  @override
  String get expensesClaimsStatusesDraft => 'Draft';

  @override
  String get expensesClaimsStatusesSubmitted => 'Waiting for approval';

  @override
  String get expensesClaimsStatusesApproved => 'Approved';

  @override
  String get expensesClaimsStatusesRejected => 'Rejected';

  @override
  String get expensesClaimsStatusesPaid => 'Paid';

  @override
  String get expensesClaimsStatusesCancelled => 'Cancelled';

  @override
  String get expensesClaimsWaiting => 'Waiting for approval';

  @override
  String get expensesClaimsToPay => 'Approved, to pay';

  @override
  String get expensesClaimsNone => 'No claims yet.';

  @override
  String get expensesClaimsAll => 'All';

  @override
  String get expensesFormTitle => 'Expense claim';

  @override
  String get expensesFormProject => 'Project';

  @override
  String get expensesFormLines => 'Expenses';

  @override
  String get expensesFormCategory => 'Category';

  @override
  String get expensesFormDescription => 'Details';

  @override
  String get expensesFormAmount => 'Amount (₹)';

  @override
  String get expensesFormGstRate => 'GST %';

  @override
  String get expensesFormVendor => 'Vendor';

  @override
  String get expensesFormVendorGstin => 'Vendor GSTIN';

  @override
  String get expensesFormInvoiceNo => 'Bill no.';

  @override
  String get expensesFormReceipt => 'Receipt';

  @override
  String get expensesFormUpload => 'Attach';

  @override
  String get expensesFormRead => 'Read receipt';

  @override
  String get expensesFormReading => 'Reading…';

  @override
  String get expensesFormReadDone =>
      'Filled in from the receipt. Please check it.';

  @override
  String get expensesFormReadNone =>
      'Couldn\'t read this receipt; please type the details.';

  @override
  String get expensesFormReadDemo =>
      'Automatic reading isn\'t set up; please type the details.';

  @override
  String get expensesFormAddLine => 'Add expense';

  @override
  String get expensesFormSaveDraft => 'Save draft';

  @override
  String get expensesFormSubmit => 'Submit for approval';

  @override
  String get expensesFormItcHint =>
      'GST credit is taken when the bill is a tax invoice with the vendor\'s GSTIN in the company\'s name, and the category allows it.';

  @override
  String get expensesDetailApprove => 'Approve';

  @override
  String get expensesDetailReject => 'Reject';

  @override
  String get expensesDetailReason => 'Reason';

  @override
  String get expensesDetailPay => 'Pay';

  @override
  String get expensesDetailPayFrom => 'Pay from';

  @override
  String get expensesDetailPaidOn => 'Payment date';

  @override
  String get expensesDetailEdit => 'Edit';

  @override
  String get expensesDetailSubmit => 'Submit';

  @override
  String get expensesDetailCancel => 'Cancel claim';

  @override
  String get expensesDetailVoucher => 'Expense entry';

  @override
  String get expensesDetailPaymentVoucher => 'Payment';

  @override
  String expensesDetailRejected(String reason) {
    return 'Rejected: $reason';
  }

  @override
  String get expensesDetailReceipt => 'View receipt';

  @override
  String get expensesCategoriesTitle => 'Expense categories';

  @override
  String get expensesCategoriesSubtitle =>
      'Which ledger each kind of expense goes to, limits, and whether GST credit is blocked (section 17(5)).';

  @override
  String get expensesCategoriesName => 'Category';

  @override
  String get expensesCategoriesAccount => 'Ledger';

  @override
  String get expensesCategoriesBlocked => 'No GST credit';

  @override
  String get expensesCategoriesLimit => 'Limit per claim (₹)';

  @override
  String get expensesCategoriesReceiptAbove => 'Receipt needed above (₹)';

  @override
  String get expensesCategoriesAdd => 'Add category';

  @override
  String get expensesCategoriesSave => 'Save';

  @override
  String get expensesErrorsNoLines => 'Add at least one expense.';

  @override
  String get expensesErrorsUnknownCategory => 'Choose a category.';

  @override
  String get expensesErrorsCategoryArchived => 'That category is archived.';

  @override
  String get expensesErrorsInvalidAmount => 'Enter an amount.';

  @override
  String get expensesErrorsReceiptRequired =>
      'Attach the receipt for this expense.';

  @override
  String get expensesErrorsOverLimit =>
      'This is more than the category\'s limit per claim.';

  @override
  String get expensesErrorsInvalidGstin => 'The vendor GSTIN isn\'t valid.';

  @override
  String get expensesErrorsUnknownEmployee => 'Choose an employee.';

  @override
  String get expensesErrorsUnknownProject => 'Choose a project.';

  @override
  String get expensesErrorsClaimLocked =>
      'Only a draft or rejected claim can be changed.';

  @override
  String get expensesErrorsClaimNotSubmitted =>
      'The claim isn\'t waiting for approval.';

  @override
  String get expensesErrorsClaimNotApproved => 'Approve the claim first.';

  @override
  String get expensesErrorsClaimPaid =>
      'A paid claim can\'t be cancelled; cancel the payment first.';

  @override
  String get expensesErrorsPaidBeforeClaim =>
      'The payment date is before the claim.';

  @override
  String get expensesErrorsCategoryExists => 'That category already exists.';

  @override
  String get expensesErrorsNotAnExpenseAccount => 'Choose an expense ledger.';

  @override
  String get expensesErrorsFileType =>
      'Attach a photo (JPG, PNG, WebP) or a PDF.';

  @override
  String get expensesErrorsFileTooLarge => 'The file is over 5 MB.';

  @override
  String get expensesErrorsFileEmpty => 'The file is empty.';

  @override
  String get projectsListTitle => 'Projects';

  @override
  String get projectsListSubtitle =>
      'Tasks, time, costs and billing for each job.';

  @override
  String get projectsListNew => 'New project';

  @override
  String get projectsListCode => 'Code';

  @override
  String get projectsListName => 'Project';

  @override
  String get projectsListCustomer => 'Customer';

  @override
  String get projectsListBilling => 'Billing';

  @override
  String get projectsListBillingsFixed => 'Fixed price';

  @override
  String get projectsListBillingsTimeMaterial => 'Time & material';

  @override
  String get projectsListBillingsNonBillable => 'Internal';

  @override
  String get projectsListStatus => 'Status';

  @override
  String get projectsListStatusesActive => 'Active';

  @override
  String get projectsListStatusesOnHold => 'On hold';

  @override
  String get projectsListStatusesCompleted => 'Completed';

  @override
  String get projectsListStatusesCancelled => 'Cancelled';

  @override
  String get projectsListRevenue => 'Billed';

  @override
  String get projectsListCost => 'Cost';

  @override
  String get projectsListMargin => 'Margin';

  @override
  String get projectsListHours => 'Hours';

  @override
  String get projectsListNone => 'No projects yet.';

  @override
  String get projectsFormContractValue => 'Contract value (₹)';

  @override
  String get projectsFormBudgetCost => 'Budget cost (₹)';

  @override
  String get projectsFormBudgetHours => 'Budget hours';

  @override
  String get projectsFormBillRate => 'Bill rate per hour (₹)';

  @override
  String get projectsFormBillingItem => 'Invoice as (service item)';

  @override
  String get projectsFormStartOn => 'Start';

  @override
  String get projectsFormEndOn => 'End';

  @override
  String get projectsFormNotes => 'Notes';

  @override
  String get projectsFormSave => 'Save project';

  @override
  String get projectsDetailLabour => 'Labour';

  @override
  String get projectsDetailExpenses => 'Expenses';

  @override
  String get projectsDetailPurchases => 'Purchases';

  @override
  String get projectsDetailUnbilled => 'Unbilled time';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return '$pct% of budget';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return '$pct% of hours';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% margin';
  }

  @override
  String get projectsDetailTasks => 'Tasks';

  @override
  String get projectsDetailTask => 'Task';

  @override
  String get projectsDetailAssignee => 'Assigned to';

  @override
  String get projectsDetailEstimate => 'Estimate (h)';

  @override
  String get projectsDetailLogged => 'Logged (h)';

  @override
  String get projectsDetailDue => 'Due';

  @override
  String get projectsDetailTaskStatusesTodo => 'To do';

  @override
  String get projectsDetailTaskStatusesDoing => 'In progress';

  @override
  String get projectsDetailTaskStatusesDone => 'Done';

  @override
  String get projectsDetailAddTask => 'Add task';

  @override
  String get projectsDetailMembers => 'Team and rates';

  @override
  String get projectsDetailMember => 'Person';

  @override
  String get projectsDetailMemberRate => 'Bill rate (₹/h)';

  @override
  String get projectsDetailAddMember => 'Add';

  @override
  String get projectsDetailMilestones => 'Milestones';

  @override
  String get projectsDetailMilestone => 'Milestone';

  @override
  String get projectsDetailAmount => 'Amount (₹)';

  @override
  String get projectsDetailAddMilestone => 'Add milestone';

  @override
  String get projectsDetailBill => 'Invoice';

  @override
  String projectsDetailBilled(String number) {
    return 'Invoiced $number';
  }

  @override
  String get projectsDetailTime => 'Time';

  @override
  String get projectsDetailBillTime => 'Invoice approved hours';

  @override
  String get projectsDetailBillUpTo => 'Up to';

  @override
  String get projectsDetailInvoices => 'Invoices';

  @override
  String get projectsDetailEdit => 'Edit project';

  @override
  String get projectsDetailRemove => 'Remove';

  @override
  String projectsDetailInvoiced(String number) {
    return 'Invoice $number raised.';
  }

  @override
  String get projectsTimeTitle => 'Timesheets';

  @override
  String get projectsTimeSubtitle =>
      'Log hours against projects; approved billable hours can be invoiced.';

  @override
  String get projectsTimeLog => 'Log time';

  @override
  String get projectsTimeEmployee => 'Employee';

  @override
  String get projectsTimeProject => 'Project';

  @override
  String get projectsTimeTask => 'Task';

  @override
  String get projectsTimeDate => 'Date';

  @override
  String get projectsTimeHours => 'Hours';

  @override
  String get projectsTimeBillable => 'Billable';

  @override
  String get projectsTimeNote => 'Note';

  @override
  String get projectsTimeSave => 'Log';

  @override
  String get projectsTimeApprove => 'Approve';

  @override
  String get projectsTimeReject => 'Reject';

  @override
  String projectsTimeSelected(String count) {
    return '$count selected';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'Submitted';

  @override
  String get projectsTimeStatusesApproved => 'Approved';

  @override
  String get projectsTimeStatusesRejected => 'Rejected';

  @override
  String get projectsTimeStatusesBilled => 'Invoiced';

  @override
  String get projectsTimeTotal => 'Total';

  @override
  String get projectsTimeNone => 'No time logged.';

  @override
  String get projectsTimeCostRate => 'Cost/h';

  @override
  String get projectsTimeBillRate => 'Bill/h';

  @override
  String get projectsTimeDelete => 'Delete';

  @override
  String get projectsErrorsNotACustomer => 'Choose a customer.';

  @override
  String get projectsErrorsUnknownItem => 'Choose a service item.';

  @override
  String get projectsErrorsEndsBeforeStart =>
      'The end date is before the start.';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'Set the project\'s customer first.';

  @override
  String get projectsErrorsBillingItemRequired =>
      'Choose the item to invoice as in the project.';

  @override
  String get projectsErrorsMilestoneBilled =>
      'That milestone is already invoiced.';

  @override
  String get projectsErrorsProjectNotActive => 'The project isn\'t active.';

  @override
  String get projectsErrorsInvalidHours => 'Enter hours between 0 and 24.';

  @override
  String get projectsErrorsTooManyHours => 'More than 24 hours on one day.';

  @override
  String get projectsErrorsUnknownTask => 'Choose a task on this project.';

  @override
  String get projectsErrorsTimesheetLocked =>
      'Approved or invoiced time can\'t be changed.';

  @override
  String get projectsErrorsNothingToBill =>
      'No approved billable hours to invoice.';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'Only time-and-material projects bill by the hour.';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'The employee wasn\'t employed on that date.';

  @override
  String get projectsErrorsUnknownEmployee => 'Choose an employee.';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count customers are',
      one: '$count customer is',
    );
    return '$_temp0 more than 60 days late paying: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$form for $period is $days days late';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$form for $period is due in $days days';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count items are',
      one: '$count item is',
    );
    return '$_temp0 below reorder level';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$count bank statement lines have waited over a week to be matched';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$count expense claims have waited over 3 days for approval';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count follow-ups are',
      one: '$count follow-up is',
    );
    return '$_temp0 late';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$name shows a negative balance ($amount): an entry is missing or wrong';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count approval memos are',
      one: '$count approval memo is',
    );
    return '$_temp0 near the six-month invoicing limit';
  }

  @override
  String alertsApprovalsOut(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count approval memos have',
      one: '$count approval memo has',
    );
    return '$_temp0 had goods out for over 30 days';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count sensitive changes',
      one: '$count sensitive change',
    );
    return '$_temp0 in the last 7 days (bank details, credit terms, tax settings or permissions)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count employee documents have',
      one: '$count employee document has',
    );
    return '$_temp0 lapsed or lapse within 30 days';
  }

  @override
  String get checksTitle => 'Checks';

  @override
  String get checksSubtitle =>
      'Entries worth a second look before your CA sees them: cash limits under the Income-tax Act, possible duplicate bills, sales below cost, stock below zero.';

  @override
  String get checksNone => 'Nothing unusual found.';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return 'Cash paid to $party: $amount in one day. Cash expenses over ₹10,000 to one person in a day aren\'t allowed (section 40A(3)); pay by bank.';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return 'Cash received from $party: $amount in one day. Receiving ₹2 lakh or more in cash isn\'t allowed (section 269ST); the penalty equals the amount.';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplier billed $amount twice within a week ($first and $second). Is one a duplicate?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item sold at $rate, below its purchase rate of $cost.';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item is at $qty $uom: more was sold or issued than was in stock.';
  }

  @override
  String get assistantTitle => 'Assistant';

  @override
  String get assistantSubtitle =>
      'Ask about sales, dues, profit, stock or GST. It reads your books; it never changes them.';

  @override
  String get assistantPlaceholder => 'Ask a question…';

  @override
  String get assistantSend => 'Ask';

  @override
  String get assistantThinking => 'Looking it up…';

  @override
  String get assistantClear => 'New conversation';

  @override
  String get assistantDemo =>
      'Built-in assistant: it answers common questions. Connect the AI service to ask anything.';

  @override
  String get assistantClaude =>
      'Answered by Claude from your books, with your access rights.';

  @override
  String get assistantSuggestionsS1 => 'Who owes us the most?';

  @override
  String get assistantSuggestionsS2 => 'How are sales this month?';

  @override
  String get assistantSuggestionsS3 => 'What is our profit this month?';

  @override
  String get assistantSuggestionsS4 => 'Which items are below reorder level?';

  @override
  String get assistantSuggestionsS5 => 'Any entries I should check?';

  @override
  String assistantTools(String tools) {
    return 'Looked at: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'The assistant is busy; try again in a minute.';

  @override
  String get assistantErrorsAssistantFailed =>
      'The assistant couldn\'t answer just now.';

  @override
  String get assistantErrorsEmptyQuestion => 'Type a question.';

  @override
  String get crmLeadsTitle => 'Leads';

  @override
  String get crmLeadsSubtitle => 'Prospects from first enquiry to order.';

  @override
  String get crmLeadsNew => 'New lead';

  @override
  String get crmLeadsName => 'Contact person';

  @override
  String get crmLeadsOrganisation => 'Business';

  @override
  String get crmLeadsPhone => 'Mobile';

  @override
  String get crmLeadsEmail => 'Email';

  @override
  String get crmLeadsGstin => 'GSTIN';

  @override
  String get crmLeadsState => 'State';

  @override
  String get crmLeadsCity => 'City';

  @override
  String get crmLeadsSource => 'Source';

  @override
  String get crmLeadsSourcesWalkIn => 'Walk-in';

  @override
  String get crmLeadsSourcesReferral => 'Referral';

  @override
  String get crmLeadsSourcesWebsite => 'Website';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'Trade fair';

  @override
  String get crmLeadsSourcesOther => 'Other';

  @override
  String get crmLeadsStage => 'Stage';

  @override
  String get crmLeadsStagesNew => 'New';

  @override
  String get crmLeadsStagesContacted => 'Contacted';

  @override
  String get crmLeadsStagesQualified => 'Qualified';

  @override
  String get crmLeadsStagesProposal => 'Proposal sent';

  @override
  String get crmLeadsStagesWon => 'Won';

  @override
  String get crmLeadsStagesLost => 'Lost';

  @override
  String get crmLeadsValue => 'Expected value (₹)';

  @override
  String get crmLeadsExpectedClose => 'Expected to close';

  @override
  String get crmLeadsOwner => 'Owner';

  @override
  String get crmLeadsNotes => 'Notes';

  @override
  String get crmLeadsNextFollowUp => 'Next follow-up';

  @override
  String get crmLeadsSave => 'Save';

  @override
  String get crmLeadsNone => 'No leads yet.';

  @override
  String get crmLeadsSearch => 'Search name, business, mobile or city';

  @override
  String crmLeadsWeighted(String amount) {
    return 'Weighted $amount';
  }

  @override
  String get crmLeadsConvert => 'Won: make a customer';

  @override
  String get crmLeadsLost => 'Mark lost';

  @override
  String get crmLeadsLostReason => 'Why was it lost?';

  @override
  String get crmLeadsEdit => 'Edit lead';

  @override
  String get crmActivitiesTitle => 'Follow-ups';

  @override
  String get crmActivitiesSubtitle =>
      'Calls, meetings and tasks, the earliest due first.';

  @override
  String get crmActivitiesAdd => 'Add';

  @override
  String get crmActivitiesKind => 'Type';

  @override
  String get crmActivitiesKindsCall => 'Call';

  @override
  String get crmActivitiesKindsMeeting => 'Meeting';

  @override
  String get crmActivitiesKindsTask => 'Task';

  @override
  String get crmActivitiesKindsNote => 'Note';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'Email';

  @override
  String get crmActivitiesSubject => 'What to do or what happened';

  @override
  String get crmActivitiesDue => 'When';

  @override
  String get crmActivitiesDone => 'Mark done';

  @override
  String get crmActivitiesReopen => 'Mark not done';

  @override
  String get crmActivitiesNotes => 'Notes';

  @override
  String get crmActivitiesNone => 'Nothing here.';

  @override
  String get crmActivitiesOpen => 'Open';

  @override
  String get crmActivitiesAll => 'All';

  @override
  String get crmActivitiesLate => 'Late';

  @override
  String get crmMessagesSend => 'Send WhatsApp';

  @override
  String get crmMessagesTemplate => 'Template';

  @override
  String crmMessagesSent(String to) {
    return 'Sent to $to.';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'Not sent: $error';
  }

  @override
  String get crmMessagesDemo =>
      'Demo mode: messages are recorded but not delivered until WhatsApp Business is connected.';

  @override
  String get crmMessagesRemind => 'Send payment reminder';

  @override
  String get crmTemplatesTitle => 'Message templates';

  @override
  String get crmTemplatesSubtitle =>
      'WhatsApp messages with numbered blanks for names, amounts and dates. To message a customer first, the template must be approved by Meta; enter its approved name.';

  @override
  String get crmTemplatesName => 'Name (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'Text';

  @override
  String get crmTemplatesCategory => 'Category';

  @override
  String get crmTemplatesCategoriesUtility => 'Updates (bills, reminders)';

  @override
  String get crmTemplatesCategoriesMarketing => 'Marketing';

  @override
  String get crmTemplatesProviderName => 'Approved name at Meta';

  @override
  String get crmTemplatesAdd => 'Add template';

  @override
  String get crmTemplatesSave => 'Save';

  @override
  String get crmCustomerTitle => 'Customer';

  @override
  String get crmCustomerBalance => 'Balance';

  @override
  String get crmCustomerSalesThisYear => 'Sales this year';

  @override
  String get crmCustomerSalesLastYear => 'Last year';

  @override
  String get crmCustomerOpenItems => 'Open bills';

  @override
  String get crmCustomerInvoices => 'Recent invoices';

  @override
  String get crmCustomerReceipts => 'Recent payments received';

  @override
  String get crmCustomerOrders => 'Open quotations and orders';

  @override
  String get crmCustomerActivities => 'Activity';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'From lead $code ($source)';
  }

  @override
  String get crmCustomerLedger => 'Ledger statement';

  @override
  String get crmErrorsInvalidPhone => 'Enter a 10-digit Indian mobile number.';

  @override
  String get crmErrorsInvalidGstin => 'The GSTIN isn\'t valid.';

  @override
  String get crmErrorsConvertToWin =>
      'Use “Won: make a customer” to win a lead.';

  @override
  String get crmErrorsLostReasonRequired => 'Say why it was lost.';

  @override
  String get crmErrorsAlreadyConverted => 'This lead is already a customer.';

  @override
  String get crmErrorsLeadOrCustomerRequired => 'Choose a lead or customer.';

  @override
  String get crmErrorsUnknownTemplate => 'Choose a template.';

  @override
  String get crmErrorsMissingParam => 'Fill in every blank in the template.';

  @override
  String get crmErrorsTemplateTooLong => 'The template is too long.';

  @override
  String get crmErrorsTemplateExists =>
      'A template with this name already exists.';

  @override
  String get crmErrorsNothingOutstanding =>
      'Nothing is outstanding from this customer.';

  @override
  String get crmErrorsInvalidTemplateName =>
      'Use lowercase letters, digits and _ only.';

  @override
  String get crmErrorsUnknownAccount => 'Choose a customer.';

  @override
  String get crmErrorsInvalidStage => 'Choose a stage.';

  @override
  String get priceListsTitle => 'Price lists';

  @override
  String get priceListsSubtitle =>
      'Wholesale, distributor or retailer rates. A customer on a list gets its rates on new orders and invoices.';

  @override
  String get priceListsOne => 'Price list';

  @override
  String get priceListsNone => 'None (sale rate)';

  @override
  String get priceListsNew => 'New price list';

  @override
  String get priceListsName => 'Name';

  @override
  String get priceListsDiscountPct => 'Discount off sale rate (%)';

  @override
  String get priceListsDiscountHint =>
      'Applies to every item without a fixed rate';

  @override
  String get priceListsFixedRates => 'Fixed rates';

  @override
  String get priceListsCustomers => 'Customers';

  @override
  String get priceListsEmpty => 'No price lists yet.';

  @override
  String get priceListsAddRate => 'Add a fixed rate';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'A price list with this name already exists.';

  @override
  String get priceListsErrorsDuplicateItem => 'An item is listed twice.';

  @override
  String get agentsTitle => 'Brokers and agents';

  @override
  String get agentsSubtitle =>
      'Commission on money received from the customers each agent brought. Goods returned take it back.';

  @override
  String get agentsIsAgent => 'Broker or agent (earns commission)';

  @override
  String get agentsCommissionPct => 'Commission (%)';

  @override
  String get agentsCommissionHint =>
      'On the taxable value, as the customer pays';

  @override
  String get agentsAgent => 'Agent';

  @override
  String get agentsNoAgent => 'No agent';

  @override
  String get agentsSalesman => 'Salesman';

  @override
  String get agentsNoSalesman => 'No salesman';

  @override
  String get agentsEarned => 'Earned';

  @override
  String get agentsBilled => 'Billed';

  @override
  String get agentsDue => 'Due';

  @override
  String get agentsInvoice => 'Invoice';

  @override
  String get agentsBase => 'Taxable value';

  @override
  String get agentsReceived => 'Received';

  @override
  String get agentsNoInvoices => 'No invoices yet.';

  @override
  String get agentsMakeBill => 'Make brokerage bill';

  @override
  String get agentsEmpty =>
      'No agents yet. Mark a ledger as a broker or agent in the chart of accounts.';

  @override
  String get agentsBills => 'Brokerage bills';

  @override
  String get agentsNumber => 'Number';

  @override
  String get agentsCommission => 'Commission';

  @override
  String get agentsTds => 'TDS';

  @override
  String get agentsNet => 'Net payable';

  @override
  String get agentsNoBills => 'No brokerage bills yet.';

  @override
  String agentsBillFor(String name, String amount) {
    return 'Bill $name for the $amount of commission due.';
  }

  @override
  String get agentsTdsRate => 'TDS rate (%)';

  @override
  String get agentsTdsHint =>
      'Blank: 2% under 194H once the year\'s commission passes ₹20,000';

  @override
  String get agentsPost => 'Post bill';

  @override
  String get agentsCancelBill => 'Cancel bill';

  @override
  String get agentsErrorsNothingToBill =>
      'Nothing is due to this agent on that date.';

  @override
  String get agentsErrorsNotAnAgent =>
      'Choose a ledger marked as a broker or agent.';

  @override
  String get targetsTitle => 'Salesman targets';

  @override
  String get targetsSubtitle =>
      'Monthly targets with commission slabs, against each salesman\'s invoiced sales less returns.';

  @override
  String get targetsPrevious => 'Previous month';

  @override
  String get targetsNext => 'Next month';

  @override
  String get targetsEdit => 'Set targets';

  @override
  String get targetsChooseSalesman => 'Choose salesman';

  @override
  String get targetsTarget => 'Target';

  @override
  String get targetsSlabs => 'Slabs';

  @override
  String get targetsSlabsHint =>
      'Slabs are percent of target reached : commission percent. For example 0:1, 100:2 pays 1% below target and 2% at or above it.';

  @override
  String get targetsAdd => 'Add salesman';

  @override
  String get targetsCopyLast => 'Copy last month';

  @override
  String get targetsAchieved => 'Achieved';

  @override
  String get targetsProgress => 'Of target';

  @override
  String get targetsRate => 'Rate';

  @override
  String targetsInvoices(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n invoices',
      one: '$n invoice',
    );
    return '$_temp0';
  }

  @override
  String targetsReturns(String amount) {
    return 'returns $amount';
  }

  @override
  String get targetsNoTarget => 'No target';

  @override
  String get targetsEmpty => 'No targets or salesman sales this month.';

  @override
  String get targetsNote =>
      'Sales are the taxable value of invoices tagged with the salesman, less credit notes issued in the month on those invoices.';

  @override
  String get targetsErrorsInvalid =>
      'Each row needs a salesman, a target in rupees and slabs written like 0:1, 100:2.';

  @override
  String get targetsErrorsDuplicateSalesman => 'A salesman is listed twice.';

  @override
  String get targetsErrorsDuplicateSlab =>
      'Two slabs start at the same percent.';

  @override
  String get targetsErrorsUnknownEmployee =>
      'Choose a salesman from your employees.';

  @override
  String get schemesTitle => 'Schemes and offers';

  @override
  String get schemesSubtitle =>
      'Offers the counter applies on its own: percent off, amount off, buy X get Y, slabs and combos.';

  @override
  String get schemesNew => 'New scheme';

  @override
  String get schemesName => 'Name';

  @override
  String get schemesOffer => 'Offer';

  @override
  String get schemesOn => 'On';

  @override
  String get schemesDates => 'Dates';

  @override
  String get schemesOff => 'switched off';

  @override
  String get schemesEmpty => 'No schemes yet.';

  @override
  String get schemesRules =>
      'Each line gets one scheme at most, and the bill gets the mix of schemes that saves the customer most. A line with its own discount takes no scheme.';

  @override
  String get schemesEverything => 'Everything';

  @override
  String get schemesAlways => 'Always';

  @override
  String get schemesNow => 'now';

  @override
  String get schemesNoEnd => 'no end date';

  @override
  String schemesRange(String from, String to) {
    return '$from to $to';
  }

  @override
  String get schemesKind => 'Type';

  @override
  String get schemesStartsOn => 'From';

  @override
  String get schemesEndsOn => 'Until';

  @override
  String get schemesPct => 'Discount (%)';

  @override
  String get schemesOffPct => 'Discount on the extra pieces (%)';

  @override
  String get schemesOffPctHint => '100 makes them free';

  @override
  String get schemesAmount => 'Amount off (₹)';

  @override
  String get schemesMinValue => 'Minimum on these items (₹)';

  @override
  String get schemesBuy => 'Buy';

  @override
  String get schemesGet => 'Get';

  @override
  String get schemesSlabs => 'Slabs';

  @override
  String get schemesQtySlabsHint => 'Pieces : percent off, e.g. 3:10, 5:20';

  @override
  String get schemesValueSlabsHint =>
      'Rupees : percent off, e.g. 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'Combo price (₹)';

  @override
  String get schemesComboItems => 'Items in the combo';

  @override
  String get schemesItem => 'Item';

  @override
  String get schemesQty => 'Qty';

  @override
  String get schemesAddItem => 'Add item';

  @override
  String get schemesAddStyle => 'Add style';

  @override
  String get schemesScopeHint =>
      'Leave all of these empty to cover every item; otherwise an item matching any of them counts.';

  @override
  String get schemesBrands => 'Brands';

  @override
  String get schemesCategories => 'Categories';

  @override
  String get schemesStyles => 'Styles';

  @override
  String get schemesItems => 'Items';

  @override
  String get schemesCommaHint => 'Separate with commas';

  @override
  String get schemesActive => 'Switched on';

  @override
  String get schemesKindsPercent => 'Percent off';

  @override
  String get schemesKindsAmountOff => 'Amount off';

  @override
  String get schemesKindsQtySlab => 'Quantity slabs';

  @override
  String get schemesKindsValueSlab => 'Value slabs';

  @override
  String get schemesKindsBuyGet => 'Buy X get Y';

  @override
  String get schemesKindsCombo => 'Combo or hamper';

  @override
  String get schemesKindHintPercent => 'Same percent off every covered item';

  @override
  String get schemesKindHintAmountOff => 'A fixed amount off, spread by value';

  @override
  String get schemesKindHintQtySlab => 'More pieces, bigger percent';

  @override
  String get schemesKindHintValueSlab => 'Bigger bill, bigger percent';

  @override
  String get schemesKindHintBuyGet =>
      'The cheapest of each group are free or discounted';

  @override
  String get schemesKindHintCombo => 'A set of items at one price';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% off';
  }

  @override
  String schemesSumMin(String amount) {
    return 'on $amount or more';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount off';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ pcs $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return 'Buy $buy get $get free';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return 'Buy $buy get $get at $pct% off';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$n items for $price';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'Fill in what this type of scheme needs.';

  @override
  String get schemesErrorsSchemeNameTaken =>
      'A scheme with this name already exists.';

  @override
  String get schemesErrorsEndsBeforeStart =>
      'The end date is before the start date.';

  @override
  String get schemesErrorsDuplicateSlab => 'Two slabs start at the same point.';

  @override
  String get schemesErrorsUnknownItem => 'Choose items from your list.';

  @override
  String get schemesErrorsUnknownStyle => 'Choose styles from your list.';

  @override
  String get schemesErrorsSlabs => 'Write slabs like 3:10, 5:20.';

  @override
  String get schemesErrorsNumber => 'Amounts and percents must be numbers.';

  @override
  String get interestTitle => 'Interest on overdue';

  @override
  String get interestSubtitle =>
      'Simple interest on each bill for the days it is past due, at the customer\'s rate.';

  @override
  String get interestPartyRates => 'Customers with an interest rate set.';

  @override
  String interestUsingRate(String rate) {
    return 'Customers without their own rate are worked out at $rate%.';
  }

  @override
  String get interestPartyRatesOnly => 'Only customers with a rate';

  @override
  String interestTryRate(String rate) {
    return 'Work out everyone at $rate%';
  }

  @override
  String get interestRate => 'Rate';

  @override
  String get interestOverdue => 'Overdue';

  @override
  String get interestInterest => 'Interest';

  @override
  String interestDueOn(String date) {
    return 'due $date';
  }

  @override
  String get interestNone => 'No overdue bills to charge interest on.';

  @override
  String get interestGstNote =>
      'Interest charged for late payment is part of the value of the supply (CGST Act s. 15(2)(d)); bill it with GST at the rate of the goods.';

  @override
  String get integrityTitle => 'Integrity check';

  @override
  String get integritySubtitle =>
      'Do your books agree with themselves? Each check compares two things that must match and lists any difference with the records behind it.';

  @override
  String get integrityAllGood =>
      'All checks pass. Your books agree with themselves.';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n checks need attention',
      one: '$n check needs attention',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'Passes';

  @override
  String get integrityFail => 'Difference';

  @override
  String get integrityWarn => 'Look at this';

  @override
  String get integrityRecords => 'Records';

  @override
  String get integrityFirstTwenty => 'Showing the first 20.';

  @override
  String get integrityVouchersBalanceTitle => 'Every voucher balances';

  @override
  String get integrityVouchersBalanceHelp =>
      'Debits equal credits in each voucher. A voucher that does not is listed.';

  @override
  String get integrityTrialBalanceTitle => 'Trial balance balances';

  @override
  String get integrityTrialBalanceHelp =>
      'Opening balances plus every posted entry add up to zero. A difference usually means an opening balance was entered without its other side, such as the owner\'s capital.';

  @override
  String get integrityInvoicesMatchLedgerTitle =>
      'Sales invoices match the ledger';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'Each posted invoice put its total into the customer\'s account.';

  @override
  String get integrityBillsMatchLedgerTitle =>
      'Purchase bills match the ledger';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'Each posted bill, except those under reverse charge, put its total into the supplier\'s account.';

  @override
  String get integrityDocumentsPostedTitle =>
      'Posted documents have their ledger entries';

  @override
  String get integrityDocumentsPostedHelp =>
      'A posted invoice or bill with no voucher behind it is listed.';

  @override
  String get integrityCancelledReversedTitle =>
      'Cancelled vouchers net to zero';

  @override
  String get integrityCancelledReversedHelp =>
      'Cancelling a voucher must reverse every account it touched.';

  @override
  String get integrityReceivablesMatchTitle =>
      'Money owed by customers matches the ledger';

  @override
  String get integrityReceivablesMatchHelp =>
      'The outstanding list adds up to the customers\' ledger balances.';

  @override
  String get integrityPayablesMatchTitle =>
      'Money owed to suppliers matches the ledger';

  @override
  String get integrityPayablesMatchHelp =>
      'The outstanding list adds up to the suppliers\' ledger balances.';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'Gift voucher liability matches unspent vouchers';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'The ledger account for gift vouchers equals the balance left on vouchers still active.';

  @override
  String get integrityNegativeStockTitle => 'No stock below zero';

  @override
  String get integrityNegativeStockHelp =>
      'Items sold or issued beyond what the books show in stock. It can be a real timing gap; record the missing receipt to fix it.';

  @override
  String get sensitiveTitle => 'Sensitive changes';

  @override
  String get sensitiveSubtitle =>
      'Changes that can move money or open a door: bank details, credit terms, tax settings, who may do what, period locks and payroll settings. Newest first.';

  @override
  String get sensitiveKindBank => 'Bank details';

  @override
  String get sensitiveKindCredit => 'Credit terms';

  @override
  String get sensitiveKindTax => 'Tax and company settings';

  @override
  String get sensitiveKindPermissions => 'Who may do what';

  @override
  String get sensitiveKindPeriod => 'Period locks and numbering';

  @override
  String get sensitiveKindPayroll => 'Payroll settings';

  @override
  String get sensitiveKindOverride => 'Credit override';

  @override
  String get sensitiveKindDevice => 'Devices';

  @override
  String get sensitiveAll => 'All kinds';

  @override
  String get sensitiveNone => 'No sensitive changes in this period.';

  @override
  String get sensitiveShow => 'Show';

  @override
  String get cfoTitle => 'Owner\'s view';

  @override
  String get cfoSubtitle =>
      'From sales to profit for the period, against the same period last year. Profit before and after tax are the same here unless your books record income tax.';

  @override
  String get cfoThisPeriod => 'This period';

  @override
  String get cfoLastYear => 'Same period last year';

  @override
  String get cfoGrowth => 'Growth';

  @override
  String get cfoRevenue => 'Revenue';

  @override
  String get cfoCostOfGoods => 'Cost of goods sold';

  @override
  String get cfoGrossProfit => 'Gross profit';

  @override
  String get cfoGrossMargin => 'Gross margin';

  @override
  String get cfoOperatingExpenses => 'Operating expenses';

  @override
  String get cfoOtherIncome => 'Other income';

  @override
  String get cfoDepreciation => 'Depreciation';

  @override
  String get cfoEbitda => 'EBITDA (profit before depreciation)';

  @override
  String get cfoNetProfit => 'Net profit';

  @override
  String get cfoMonthly => 'Gross margin by month';

  @override
  String get lrTitle => 'LR and transport entry';

  @override
  String get lrSubtitle =>
      'Goods sent through a transporter: the LR number, the invoice, freight, and whether it has reached the customer.';

  @override
  String get lrTransporter => 'Transporter';

  @override
  String get lrLrNumber => 'LR number';

  @override
  String get lrInvoice => 'Invoice';

  @override
  String get lrNoInvoice => 'No invoice';

  @override
  String get lrDestination => 'Destination';

  @override
  String get lrPackages => 'Packages';

  @override
  String get lrWeight => 'Weight (kg)';

  @override
  String get lrFreight => 'Freight';

  @override
  String get lrFreightBy => 'Who pays the freight';

  @override
  String get lrPaid => 'Paid by us';

  @override
  String get lrToPay => 'To pay by customer';

  @override
  String get lrAdd => 'Add consignment';

  @override
  String get lrStatus => 'Status';

  @override
  String get lrAllStatuses => 'All statuses';

  @override
  String get lrStatusesBooked => 'Booked';

  @override
  String get lrStatusesInTransit => 'In transit';

  @override
  String get lrStatusesDelivered => 'Delivered';

  @override
  String lrDeliveredOn(String date) {
    return 'Delivered on $date';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days since it was sent',
      one: '$n day since it was sent',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty => 'No consignments yet. Add the first one above.';

  @override
  String get lrErrorsLrTaken =>
      'This transporter already has an entry with that LR number.';

  @override
  String get lrErrorsUnknownInvoice => 'That invoice was not found.';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'The delivery date is before the date it was sent.';

  @override
  String get hsnTitle => 'HSN and SAC codes';

  @override
  String get hsnSubtitle =>
      'The codes your business uses, with plain descriptions. Item and style forms suggest from this list. A rate here is only a convenience: apparel and footwear are taxed by price slab.';

  @override
  String get hsnCode => 'Code';

  @override
  String get hsnDescription => 'Description';

  @override
  String get hsnKind => 'Type';

  @override
  String get hsnGoods => 'Goods (HSN)';

  @override
  String get hsnService => 'Service (SAC)';

  @override
  String get hsnRate => 'Rate';

  @override
  String get hsnAddStandard => 'Add standard apparel codes';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'Added $n codes. Codes you already had were left alone.',
      one: 'Added $n code. Codes you already had were left alone.',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'Show archived';

  @override
  String get hsnEmpty =>
      'No codes yet. Add one above, or add the standard apparel codes.';

  @override
  String get hsnErrorsHsnTaken => 'This code is already in the list.';

  @override
  String get hsnErrorsInvalidHsn =>
      'An HSN code has 4, 6 or 8 digits (a SAC code 6).';

  @override
  String get notesTitle => 'My notes';

  @override
  String get notesPrivate => 'Only you can see these.';

  @override
  String get notesNone => 'Nothing noted. Write a reminder below.';

  @override
  String get notesPlaceholder => 'Write a note or reminder';

  @override
  String get notesRemindOn => 'Remind me on';

  @override
  String get notesAdd => 'Add';

  @override
  String get notesToday => 'Today';

  @override
  String notesOverdue(String date) {
    return 'Was due $date';
  }

  @override
  String notesMarkDone(String note) {
    return 'Mark done: $note';
  }

  @override
  String get notesRemove => 'Delete note';

  @override
  String get movementTitle => 'Fast and slow movers';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'What sold in the last $days days. Fast means $fastMin or more pieces; slow means some sold, fewer than that; non-moving means none. Non-moving stock is listed first.';
  }

  @override
  String get movementWindow => 'Look back';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days',
      one: '$n day',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'Fast from (pieces)';

  @override
  String get movementIncludeFabric => 'Include fabric and trims';

  @override
  String get movementClassFast => 'Fast';

  @override
  String get movementClassSlow => 'Slow';

  @override
  String get movementClassNone => 'Non-moving';

  @override
  String movementItems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n items',
      one: '$n item',
    );
    return '$_temp0';
  }

  @override
  String movementPiecesInStock(String n) {
    return '$n pieces in stock';
  }

  @override
  String get movementItem => 'Item';

  @override
  String get movementStatus => 'Movement';

  @override
  String movementSold(String days) {
    return 'Sold in $days days';
  }

  @override
  String get movementInStock => 'In stock';

  @override
  String get movementStockValue => 'Stock value';

  @override
  String get movementLastSold => 'Last sold';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n days ago',
      one: '$n day ago',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'Never';

  @override
  String get movementEmpty => 'No stock to show.';

  @override
  String get movementFirstRows => 'Showing the first 500 items.';

  @override
  String get appDeviceRevoked =>
      'This device was revoked by the business owner. It can no longer sync. Sign out and ask for access again.';

  @override
  String get appOfflineRulesTitle => 'What works without internet';

  @override
  String get conflictsTitle => 'Refused changes';

  @override
  String get conflictsHelp =>
      'The server did not accept these changes made on this device. Put the cause right and try again, or set the change aside.';

  @override
  String get conflictsEmpty => 'Nothing was refused.';

  @override
  String get conflictsReview => 'Review refused changes';

  @override
  String get conflictKindVoucher => 'Voucher';

  @override
  String get conflictKindCancelVoucher => 'Cancelling a voucher';

  @override
  String get conflictKindBill => 'Counter bill';

  @override
  String get conflictKindLeave => 'Leave request';

  @override
  String get conflictKindAttendance => 'Attendance';

  @override
  String get conflictKindClaim => 'Expense claim';

  @override
  String get conflictKindOrder => 'Customer order';

  @override
  String get conflictKindOther => 'Change';

  @override
  String conflictWhy(String reason) {
    return 'Why: $reason';
  }

  @override
  String get conflictReasonPeriodLocked =>
      'The books for that date are closed.';

  @override
  String get conflictReasonGstFiled =>
      'The GST return for that month is already filed.';

  @override
  String get conflictReasonUnknownAccount =>
      'An account used here no longer exists.';

  @override
  String get conflictReasonUnknownItem => 'An item used here no longer exists.';

  @override
  String get conflictReasonSessionClosed =>
      'The shift for that counter was closed.';

  @override
  String get conflictReasonForbidden =>
      'You no longer have the right to do this.';

  @override
  String get conflictReasonDeviceRevoked =>
      'This device was revoked by the owner.';

  @override
  String conflictReasonOther(String code) {
    return 'The server refused it ($code).';
  }

  @override
  String get conflictRetry => 'Try again';

  @override
  String get conflictDiscard => 'Set aside';

  @override
  String get conflictDiscardAsk => 'Set this change aside?';

  @override
  String get conflictDiscardBody =>
      'It will be removed from this device and will never reach the books.';

  @override
  String get conflictBillNote =>
      'This bill was already given to the customer. Ask the owner to put it right on the server.';

  @override
  String conflictAmount(String amount) {
    return '$amount';
  }

  @override
  String get toolsTitle => 'Tools';

  @override
  String get toolCashEntry => 'Cash and bank entry';

  @override
  String get toolStockAudit => 'Count stock by scanning';

  @override
  String get toolCustomers => 'Customers';

  @override
  String get toolReports => 'Reports';

  @override
  String get toolToken => 'Token and slips';

  @override
  String get cashReceived => 'Received';

  @override
  String get cashPaid => 'Paid';

  @override
  String get cashTransfer => 'Transfer';

  @override
  String get cashAccount => 'Cash or bank';

  @override
  String get cashFrom => 'From';

  @override
  String get cashTo => 'To';

  @override
  String get cashOther => 'From or to account';

  @override
  String get cashNarration => 'Note';

  @override
  String get cashSave => 'Save entry';

  @override
  String get cashSaved => 'Entry saved.';

  @override
  String get cashSameAccount => 'Choose two different accounts.';

  @override
  String auditStore(String store) {
    return 'Store: $store';
  }

  @override
  String get auditNoStore =>
      'This device has not been told which store it counts for. Sync once while online.';

  @override
  String get auditNameHint => 'Name of this count (for example Shelf 3)';

  @override
  String get auditStart => 'Start counting';

  @override
  String get auditScanHint => 'Scan or type a barcode or SKU';

  @override
  String auditLastScan(String name) {
    return 'Counted: $name';
  }

  @override
  String auditCounted(int items, int pieces) {
    return '$items items, $pieces pieces';
  }

  @override
  String get auditSubmit => 'Send the count';

  @override
  String get auditSent => 'Count saved. It goes to the books at the next sync.';

  @override
  String get auditDiscard => 'Discard';

  @override
  String get auditDiscardAsk => 'Throw away this count?';

  @override
  String get auditUnknownCode => 'That code matches no item.';

  @override
  String get auditNothing => 'Nothing has been counted yet.';

  @override
  String get auditInProgress => 'A count is already in progress.';

  @override
  String get auditNotGoods => 'That is not a stocked item.';

  @override
  String get custSearchHint => 'Mobile number or name';

  @override
  String get custNone =>
      'Nobody matches. Enter the full mobile number to look them up online.';

  @override
  String get custVisits => 'Visits';

  @override
  String get custSpent => 'Spent';

  @override
  String get custLastLabel => 'Last visit';

  @override
  String custLast(String date) {
    return 'last visit $date';
  }

  @override
  String get custPoints => 'Points';

  @override
  String get custReturned => 'Returned';

  @override
  String get custTop => 'Buys most';

  @override
  String get custRecent => 'Latest bills';

  @override
  String get custCloud => 'From all counters';

  @override
  String get custLocalOnly => 'From this device\'s bills only';

  @override
  String get custBack => 'Back to the list';

  @override
  String get reportDaySales => 'Today\'s sales';

  @override
  String get reportStock => 'Stock';

  @override
  String get reportReceivables => 'Owed to us';

  @override
  String get reportBills => 'Bills';

  @override
  String get reportSales => 'Sales';

  @override
  String get reportItems => 'Items';

  @override
  String get reportParties => 'Parties';

  @override
  String get reportNone => 'No report yet. Connect once to fetch it.';

  @override
  String reportFetched(String time) {
    return 'Fetched at $time';
  }

  @override
  String reportOld(String time) {
    return 'Old copy from $time. Connect to refresh.';
  }

  @override
  String get tokenPhone => 'Customer\'s mobile (optional)';

  @override
  String get tokenNext => 'Give the next token';

  @override
  String get tokenSent => 'Sent to the customer.';

  @override
  String get tokenNotSent => 'Not sent. Give the number to the customer.';

  @override
  String get tokenSlips => 'Today\'s bills';

  @override
  String get tokenCopy => 'Copy slip';

  @override
  String get tokenCopied => 'Slip copied.';

  @override
  String get photoTake => 'Photo of the receipt';

  @override
  String get photoRetake => 'Take it again';

  @override
  String get photoAttached => 'Photo attached. It goes up with the claim.';

  @override
  String get photoRemove => 'Remove photo';
}
