import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_as.dart';
import 'app_localizations_bn.dart';
import 'app_localizations_en.dart';
import 'app_localizations_gu.dart';
import 'app_localizations_hi.dart';
import 'app_localizations_kn.dart';
import 'app_localizations_ml.dart';
import 'app_localizations_mr.dart';
import 'app_localizations_or.dart';
import 'app_localizations_pa.dart';
import 'app_localizations_ta.dart';
import 'app_localizations_te.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'gen/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('as'),
    Locale('bn'),
    Locale('en'),
    Locale('gu'),
    Locale('hi'),
    Locale('kn'),
    Locale('ml'),
    Locale('mr'),
    Locale('or'),
    Locale('pa'),
    Locale('ta'),
    Locale('te'),
  ];

  /// No description provided for @brandName.
  ///
  /// In en, this message translates to:
  /// **'Varchasv'**
  String get brandName;

  /// No description provided for @brandFull.
  ///
  /// In en, this message translates to:
  /// **'Varchasv ERP Systems'**
  String get brandFull;

  /// No description provided for @brandTagline.
  ///
  /// In en, this message translates to:
  /// **'Accounts, GST, stock and payroll, online and offline, in your language.'**
  String get brandTagline;

  /// No description provided for @commonSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get commonSave;

  /// No description provided for @commonSaving.
  ///
  /// In en, this message translates to:
  /// **'Saving…'**
  String get commonSaving;

  /// No description provided for @commonSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved'**
  String get commonSaved;

  /// No description provided for @commonCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get commonCancel;

  /// No description provided for @commonEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get commonEdit;

  /// No description provided for @commonAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get commonAdd;

  /// No description provided for @commonClose.
  ///
  /// In en, this message translates to:
  /// **'Close'**
  String get commonClose;

  /// No description provided for @commonLoading.
  ///
  /// In en, this message translates to:
  /// **'Loading…'**
  String get commonLoading;

  /// No description provided for @commonOptional.
  ///
  /// In en, this message translates to:
  /// **'optional'**
  String get commonOptional;

  /// No description provided for @commonLanguage.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get commonLanguage;

  /// No description provided for @commonTheme.
  ///
  /// In en, this message translates to:
  /// **'Theme'**
  String get commonTheme;

  /// No description provided for @commonLight.
  ///
  /// In en, this message translates to:
  /// **'Light'**
  String get commonLight;

  /// No description provided for @commonDark.
  ///
  /// In en, this message translates to:
  /// **'Dark'**
  String get commonDark;

  /// No description provided for @commonSystem.
  ///
  /// In en, this message translates to:
  /// **'System'**
  String get commonSystem;

  /// No description provided for @commonComingSoon.
  ///
  /// In en, this message translates to:
  /// **'Coming in phase {phase}'**
  String commonComingSoon(String phase);

  /// No description provided for @commonNone.
  ///
  /// In en, this message translates to:
  /// **'None'**
  String get commonNone;

  /// No description provided for @commonYes.
  ///
  /// In en, this message translates to:
  /// **'Yes'**
  String get commonYes;

  /// No description provided for @commonNo.
  ///
  /// In en, this message translates to:
  /// **'No'**
  String get commonNo;

  /// No description provided for @commonSearch.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get commonSearch;

  /// No description provided for @commonAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get commonAll;

  /// No description provided for @commonFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get commonFrom;

  /// No description provided for @commonTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get commonTo;

  /// No description provided for @commonAsOf.
  ///
  /// In en, this message translates to:
  /// **'As of'**
  String get commonAsOf;

  /// No description provided for @commonTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get commonTotal;

  /// No description provided for @commonDebit.
  ///
  /// In en, this message translates to:
  /// **'Debit'**
  String get commonDebit;

  /// No description provided for @commonCredit.
  ///
  /// In en, this message translates to:
  /// **'Credit'**
  String get commonCredit;

  /// No description provided for @commonBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get commonBalance;

  /// No description provided for @commonDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get commonDate;

  /// No description provided for @commonNarration.
  ///
  /// In en, this message translates to:
  /// **'Narration'**
  String get commonNarration;

  /// No description provided for @commonActions.
  ///
  /// In en, this message translates to:
  /// **'Actions'**
  String get commonActions;

  /// No description provided for @commonBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get commonBack;

  /// No description provided for @commonApply.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get commonApply;

  /// No description provided for @commonRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get commonRemove;

  /// No description provided for @commonCopy.
  ///
  /// In en, this message translates to:
  /// **'Copy'**
  String get commonCopy;

  /// No description provided for @commonCopied.
  ///
  /// In en, this message translates to:
  /// **'Copied'**
  String get commonCopied;

  /// No description provided for @commonDr.
  ///
  /// In en, this message translates to:
  /// **'Dr'**
  String get commonDr;

  /// No description provided for @commonCr.
  ///
  /// In en, this message translates to:
  /// **'Cr'**
  String get commonCr;

  /// No description provided for @commonView.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get commonView;

  /// No description provided for @commonArchived.
  ///
  /// In en, this message translates to:
  /// **'Archived'**
  String get commonArchived;

  /// No description provided for @commonPrint.
  ///
  /// In en, this message translates to:
  /// **'Print'**
  String get commonPrint;

  /// No description provided for @commonListCapped.
  ///
  /// In en, this message translates to:
  /// **'Showing the latest {count} documents. Choose dates to see older ones.'**
  String commonListCapped(String count);

  /// No description provided for @authLoginTitle.
  ///
  /// In en, this message translates to:
  /// **'Sign in to your business'**
  String get authLoginTitle;

  /// No description provided for @authLoginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome back.'**
  String get authLoginSubtitle;

  /// No description provided for @authSignupTitle.
  ///
  /// In en, this message translates to:
  /// **'Start your business on Varchasv'**
  String get authSignupTitle;

  /// No description provided for @authSignupSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Free for businesses under ₹40 lakh turnover. No card needed.'**
  String get authSignupSubtitle;

  /// No description provided for @authEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get authEmail;

  /// No description provided for @authPassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get authPassword;

  /// No description provided for @authPasswordHint.
  ///
  /// In en, this message translates to:
  /// **'At least 8 characters'**
  String get authPasswordHint;

  /// No description provided for @authName.
  ///
  /// In en, this message translates to:
  /// **'Your name'**
  String get authName;

  /// No description provided for @authBusinessName.
  ///
  /// In en, this message translates to:
  /// **'Business name'**
  String get authBusinessName;

  /// No description provided for @authState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get authState;

  /// No description provided for @authGstin.
  ///
  /// In en, this message translates to:
  /// **'GSTIN'**
  String get authGstin;

  /// No description provided for @authGstinHint.
  ///
  /// In en, this message translates to:
  /// **'Leave empty if you are not registered for GST'**
  String get authGstinHint;

  /// No description provided for @authIndustry.
  ///
  /// In en, this message translates to:
  /// **'Type of business'**
  String get authIndustry;

  /// No description provided for @authLogin.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get authLogin;

  /// No description provided for @authSignup.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get authSignup;

  /// No description provided for @authLogout.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get authLogout;

  /// No description provided for @authNoAccount.
  ///
  /// In en, this message translates to:
  /// **'New to Varchasv?'**
  String get authNoAccount;

  /// No description provided for @authHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account?'**
  String get authHaveAccount;

  /// No description provided for @authCreateOne.
  ///
  /// In en, this message translates to:
  /// **'Create an account'**
  String get authCreateOne;

  /// No description provided for @authSignInInstead.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get authSignInInstead;

  /// No description provided for @authErrorsInvalidCredentials.
  ///
  /// In en, this message translates to:
  /// **'That email and password don\'t match.'**
  String get authErrorsInvalidCredentials;

  /// No description provided for @authErrorsEmailTaken.
  ///
  /// In en, this message translates to:
  /// **'An account with this email already exists.'**
  String get authErrorsEmailTaken;

  /// No description provided for @authErrorsGstinLength.
  ///
  /// In en, this message translates to:
  /// **'A GSTIN has 15 characters.'**
  String get authErrorsGstinLength;

  /// No description provided for @authErrorsGstinFormat.
  ///
  /// In en, this message translates to:
  /// **'This doesn\'t look like a GSTIN.'**
  String get authErrorsGstinFormat;

  /// No description provided for @authErrorsGstinState.
  ///
  /// In en, this message translates to:
  /// **'The GSTIN starts with an unknown state code.'**
  String get authErrorsGstinState;

  /// No description provided for @authErrorsGstinChecksum.
  ///
  /// In en, this message translates to:
  /// **'This GSTIN has a typo: its last character doesn\'t match.'**
  String get authErrorsGstinChecksum;

  /// No description provided for @authErrorsGstinStateMismatch.
  ///
  /// In en, this message translates to:
  /// **'This GSTIN belongs to a different state than the one selected.'**
  String get authErrorsGstinStateMismatch;

  /// No description provided for @authErrorsValidation.
  ///
  /// In en, this message translates to:
  /// **'Please check the highlighted fields.'**
  String get authErrorsValidation;

  /// No description provided for @authErrorsGeneric.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Please try again.'**
  String get authErrorsGeneric;

  /// No description provided for @authErrorsInvalidOrExpiredLink.
  ///
  /// In en, this message translates to:
  /// **'This link has expired or was already used. Ask for a new one.'**
  String get authErrorsInvalidOrExpiredLink;

  /// No description provided for @authErrorsWrongPassword.
  ///
  /// In en, this message translates to:
  /// **'Your current password is wrong.'**
  String get authErrorsWrongPassword;

  /// No description provided for @authErrorsPasswordsDiffer.
  ///
  /// In en, this message translates to:
  /// **'The two passwords don\'t match.'**
  String get authErrorsPasswordsDiffer;

  /// No description provided for @authErrorsNeedsChangeDate.
  ///
  /// In en, this message translates to:
  /// **'You are not allowed to back-date a document. Use today\'s date, or ask the owner for the right.'**
  String get authErrorsNeedsChangeDate;

  /// No description provided for @authErrorsNeedsFutureDate.
  ///
  /// In en, this message translates to:
  /// **'You are not allowed to future-date a document. Use today\'s date, or ask the owner for the right.'**
  String get authErrorsNeedsFutureDate;

  /// No description provided for @authErrorsNeedsSellBelowCost.
  ///
  /// In en, this message translates to:
  /// **'A line is priced below its cost. You are not allowed to sell below cost; raise the rate or ask the owner.'**
  String get authErrorsNeedsSellBelowCost;

  /// No description provided for @authForgotLink.
  ///
  /// In en, this message translates to:
  /// **'Forgot password?'**
  String get authForgotLink;

  /// No description provided for @authForgotTitle.
  ///
  /// In en, this message translates to:
  /// **'Reset your password'**
  String get authForgotTitle;

  /// No description provided for @authForgotSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your account email and we\'ll send you a link to choose a new password.'**
  String get authForgotSubtitle;

  /// No description provided for @authSendLink.
  ///
  /// In en, this message translates to:
  /// **'Send reset link'**
  String get authSendLink;

  /// No description provided for @authForgotSent.
  ///
  /// In en, this message translates to:
  /// **'If an account exists for {email}, a reset link is on its way. It works once and expires in an hour.'**
  String authForgotSent(String email);

  /// No description provided for @authBackToLogin.
  ///
  /// In en, this message translates to:
  /// **'Back to sign in'**
  String get authBackToLogin;

  /// No description provided for @authResetTitle.
  ///
  /// In en, this message translates to:
  /// **'Choose a new password'**
  String get authResetTitle;

  /// No description provided for @authNewPassword.
  ///
  /// In en, this message translates to:
  /// **'New password'**
  String get authNewPassword;

  /// No description provided for @authConfirmPassword.
  ///
  /// In en, this message translates to:
  /// **'Repeat new password'**
  String get authConfirmPassword;

  /// No description provided for @authSetPassword.
  ///
  /// In en, this message translates to:
  /// **'Set password'**
  String get authSetPassword;

  /// No description provided for @authResetDone.
  ///
  /// In en, this message translates to:
  /// **'Your password has been changed and you have been signed out everywhere. Sign in with the new password.'**
  String get authResetDone;

  /// No description provided for @shellGoTo.
  ///
  /// In en, this message translates to:
  /// **'Go to…'**
  String get shellGoTo;

  /// No description provided for @shellGoToPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Go to a screen or start an entry'**
  String get shellGoToPlaceholder;

  /// No description provided for @shellNoMatch.
  ///
  /// In en, this message translates to:
  /// **'Nothing matches “{query}”.'**
  String shellNoMatch(String query);

  /// No description provided for @shellTallyKeys.
  ///
  /// In en, this message translates to:
  /// **'Tally keys work anywhere outside a text field: F4 contra, F5 payment, F6 receipt, F7 journal, F8 sales, F9 purchase.'**
  String get shellTallyKeys;

  /// No description provided for @shellCreate.
  ///
  /// In en, this message translates to:
  /// **'New'**
  String get shellCreate;

  /// No description provided for @shellEntries.
  ///
  /// In en, this message translates to:
  /// **'Start an entry'**
  String get shellEntries;

  /// No description provided for @shellScreens.
  ///
  /// In en, this message translates to:
  /// **'Screens'**
  String get shellScreens;

  /// No description provided for @shellMenu.
  ///
  /// In en, this message translates to:
  /// **'Menu'**
  String get shellMenu;

  /// No description provided for @shellFy.
  ///
  /// In en, this message translates to:
  /// **'FY {years}'**
  String shellFy(String years);

  /// No description provided for @shellNewVoucher.
  ///
  /// In en, this message translates to:
  /// **'{type} voucher'**
  String shellNewVoucher(String type);

  /// No description provided for @shellFold.
  ///
  /// In en, this message translates to:
  /// **'Fold the menu'**
  String get shellFold;

  /// No description provided for @shellUnfold.
  ///
  /// In en, this message translates to:
  /// **'Open the menu'**
  String get shellUnfold;

  /// No description provided for @accountTitle.
  ///
  /// In en, this message translates to:
  /// **'My account'**
  String get accountTitle;

  /// No description provided for @accountSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your name and password, used for every business you belong to.'**
  String get accountSubtitle;

  /// No description provided for @accountProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get accountProfile;

  /// No description provided for @accountSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get accountSave;

  /// No description provided for @accountSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved'**
  String get accountSaved;

  /// No description provided for @accountPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Change password'**
  String get accountPasswordTitle;

  /// No description provided for @accountCurrentPassword.
  ///
  /// In en, this message translates to:
  /// **'Current password'**
  String get accountCurrentPassword;

  /// No description provided for @accountPasswordChanged.
  ///
  /// In en, this message translates to:
  /// **'Password changed. Your other devices have been signed out.'**
  String get accountPasswordChanged;

  /// No description provided for @industryApparel.
  ///
  /// In en, this message translates to:
  /// **'Apparel and textiles'**
  String get industryApparel;

  /// No description provided for @industryGeneral.
  ///
  /// In en, this message translates to:
  /// **'General'**
  String get industryGeneral;

  /// No description provided for @industryTrading.
  ///
  /// In en, this message translates to:
  /// **'Trading / distribution'**
  String get industryTrading;

  /// No description provided for @industryManufacturing.
  ///
  /// In en, this message translates to:
  /// **'Manufacturing'**
  String get industryManufacturing;

  /// No description provided for @industryRetail.
  ///
  /// In en, this message translates to:
  /// **'Retail shop'**
  String get industryRetail;

  /// No description provided for @industryServices.
  ///
  /// In en, this message translates to:
  /// **'Services'**
  String get industryServices;

  /// No description provided for @navDashboard.
  ///
  /// In en, this message translates to:
  /// **'Dashboard'**
  String get navDashboard;

  /// No description provided for @navSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get navSales;

  /// No description provided for @navPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get navPurchase;

  /// No description provided for @navInventory.
  ///
  /// In en, this message translates to:
  /// **'Inventory'**
  String get navInventory;

  /// No description provided for @navAccounts.
  ///
  /// In en, this message translates to:
  /// **'Accounts'**
  String get navAccounts;

  /// No description provided for @navGst.
  ///
  /// In en, this message translates to:
  /// **'GST'**
  String get navGst;

  /// No description provided for @navHr.
  ///
  /// In en, this message translates to:
  /// **'HR & payroll'**
  String get navHr;

  /// No description provided for @navReports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get navReports;

  /// No description provided for @navSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get navSettings;

  /// No description provided for @navCompany.
  ///
  /// In en, this message translates to:
  /// **'Company & branches'**
  String get navCompany;

  /// No description provided for @navNumberSeries.
  ///
  /// In en, this message translates to:
  /// **'Number series'**
  String get navNumberSeries;

  /// No description provided for @navAuditLog.
  ///
  /// In en, this message translates to:
  /// **'Audit trail'**
  String get navAuditLog;

  /// No description provided for @navTools.
  ///
  /// In en, this message translates to:
  /// **'Tools'**
  String get navTools;

  /// No description provided for @navTeam.
  ///
  /// In en, this message translates to:
  /// **'Team & roles'**
  String get navTeam;

  /// No description provided for @navChart.
  ///
  /// In en, this message translates to:
  /// **'Chart of accounts'**
  String get navChart;

  /// No description provided for @navVouchers.
  ///
  /// In en, this message translates to:
  /// **'Vouchers and coupons'**
  String get navVouchers;

  /// No description provided for @navTrialBalance.
  ///
  /// In en, this message translates to:
  /// **'Trial balance'**
  String get navTrialBalance;

  /// No description provided for @navProfitLoss.
  ///
  /// In en, this message translates to:
  /// **'Profit & loss'**
  String get navProfitLoss;

  /// No description provided for @navBalanceSheet.
  ///
  /// In en, this message translates to:
  /// **'Balance sheet'**
  String get navBalanceSheet;

  /// No description provided for @navFinancialYears.
  ///
  /// In en, this message translates to:
  /// **'Financial years'**
  String get navFinancialYears;

  /// No description provided for @navItems.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get navItems;

  /// No description provided for @navStock.
  ///
  /// In en, this message translates to:
  /// **'Stock summary'**
  String get navStock;

  /// No description provided for @navStockJournals.
  ///
  /// In en, this message translates to:
  /// **'Stock journals'**
  String get navStockJournals;

  /// No description provided for @navReorder.
  ///
  /// In en, this message translates to:
  /// **'Reorder'**
  String get navReorder;

  /// No description provided for @navPurchaseOrders.
  ///
  /// In en, this message translates to:
  /// **'Purchase orders'**
  String get navPurchaseOrders;

  /// No description provided for @navGoodsReceipts.
  ///
  /// In en, this message translates to:
  /// **'Inward challans'**
  String get navGoodsReceipts;

  /// No description provided for @navPurchaseBills.
  ///
  /// In en, this message translates to:
  /// **'Purchase bills'**
  String get navPurchaseBills;

  /// No description provided for @navPurchaseReturns.
  ///
  /// In en, this message translates to:
  /// **'Purchase returns'**
  String get navPurchaseReturns;

  /// No description provided for @navSalesOrders.
  ///
  /// In en, this message translates to:
  /// **'Sales orders'**
  String get navSalesOrders;

  /// No description provided for @navDeliveryNotes.
  ///
  /// In en, this message translates to:
  /// **'Delivery challans'**
  String get navDeliveryNotes;

  /// No description provided for @navSalesInvoices.
  ///
  /// In en, this message translates to:
  /// **'Sales invoices'**
  String get navSalesInvoices;

  /// No description provided for @navCreditNotes.
  ///
  /// In en, this message translates to:
  /// **'Credit notes'**
  String get navCreditNotes;

  /// No description provided for @navReceivables.
  ///
  /// In en, this message translates to:
  /// **'Receivables'**
  String get navReceivables;

  /// No description provided for @navPayables.
  ///
  /// In en, this message translates to:
  /// **'Payables'**
  String get navPayables;

  /// No description provided for @navGstReturns.
  ///
  /// In en, this message translates to:
  /// **'GST returns'**
  String get navGstReturns;

  /// No description provided for @navGstSettings.
  ///
  /// In en, this message translates to:
  /// **'GST & invoicing'**
  String get navGstSettings;

  /// No description provided for @navImport.
  ///
  /// In en, this message translates to:
  /// **'Import data'**
  String get navImport;

  /// No description provided for @navQuotations.
  ///
  /// In en, this message translates to:
  /// **'Quotations'**
  String get navQuotations;

  /// No description provided for @navEmployees.
  ///
  /// In en, this message translates to:
  /// **'Employees'**
  String get navEmployees;

  /// No description provided for @navAttendance.
  ///
  /// In en, this message translates to:
  /// **'Attendance'**
  String get navAttendance;

  /// No description provided for @navLeave.
  ///
  /// In en, this message translates to:
  /// **'Leave'**
  String get navLeave;

  /// No description provided for @navPayroll.
  ///
  /// In en, this message translates to:
  /// **'Payroll'**
  String get navPayroll;

  /// No description provided for @navPayrollSettings.
  ///
  /// In en, this message translates to:
  /// **'Payroll'**
  String get navPayrollSettings;

  /// No description provided for @navStatutory.
  ///
  /// In en, this message translates to:
  /// **'Statutory & TDS'**
  String get navStatutory;

  /// No description provided for @navManufacturing.
  ///
  /// In en, this message translates to:
  /// **'Manufacturing'**
  String get navManufacturing;

  /// No description provided for @navBoms.
  ///
  /// In en, this message translates to:
  /// **'Bills of materials'**
  String get navBoms;

  /// No description provided for @navProduction.
  ///
  /// In en, this message translates to:
  /// **'Production orders'**
  String get navProduction;

  /// No description provided for @navMrp.
  ///
  /// In en, this message translates to:
  /// **'Material planning'**
  String get navMrp;

  /// No description provided for @navJobWork.
  ///
  /// In en, this message translates to:
  /// **'Job work'**
  String get navJobWork;

  /// No description provided for @navPos.
  ///
  /// In en, this message translates to:
  /// **'Point of sale'**
  String get navPos;

  /// No description provided for @navPosBilling.
  ///
  /// In en, this message translates to:
  /// **'Billing'**
  String get navPosBilling;

  /// No description provided for @navPosBills.
  ///
  /// In en, this message translates to:
  /// **'Bills'**
  String get navPosBills;

  /// No description provided for @navPosSettings.
  ///
  /// In en, this message translates to:
  /// **'Counter settings'**
  String get navPosSettings;

  /// No description provided for @navBanking.
  ///
  /// In en, this message translates to:
  /// **'Banking'**
  String get navBanking;

  /// No description provided for @navBankAccounts.
  ///
  /// In en, this message translates to:
  /// **'Bank reconciliation'**
  String get navBankAccounts;

  /// No description provided for @navBankRules.
  ///
  /// In en, this message translates to:
  /// **'Bank rules'**
  String get navBankRules;

  /// No description provided for @navSettlements.
  ///
  /// In en, this message translates to:
  /// **'Gateway settlements'**
  String get navSettlements;

  /// No description provided for @navAssets.
  ///
  /// In en, this message translates to:
  /// **'Fixed assets'**
  String get navAssets;

  /// No description provided for @navAssetRegister.
  ///
  /// In en, this message translates to:
  /// **'Asset register'**
  String get navAssetRegister;

  /// No description provided for @navDepreciation.
  ///
  /// In en, this message translates to:
  /// **'Depreciation'**
  String get navDepreciation;

  /// No description provided for @navItDepreciation.
  ///
  /// In en, this message translates to:
  /// **'Income-tax depreciation'**
  String get navItDepreciation;

  /// No description provided for @navExpenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get navExpenses;

  /// No description provided for @navExpenseClaims.
  ///
  /// In en, this message translates to:
  /// **'Expense claims'**
  String get navExpenseClaims;

  /// No description provided for @navExpenseCategories.
  ///
  /// In en, this message translates to:
  /// **'Expense categories'**
  String get navExpenseCategories;

  /// No description provided for @navProjects.
  ///
  /// In en, this message translates to:
  /// **'Projects'**
  String get navProjects;

  /// No description provided for @navProjectList.
  ///
  /// In en, this message translates to:
  /// **'Projects'**
  String get navProjectList;

  /// No description provided for @navTimesheets.
  ///
  /// In en, this message translates to:
  /// **'Timesheets'**
  String get navTimesheets;

  /// No description provided for @navAssistant.
  ///
  /// In en, this message translates to:
  /// **'Assistant'**
  String get navAssistant;

  /// No description provided for @navCrm.
  ///
  /// In en, this message translates to:
  /// **'CRM'**
  String get navCrm;

  /// No description provided for @navLeads.
  ///
  /// In en, this message translates to:
  /// **'Leads'**
  String get navLeads;

  /// No description provided for @navFollowUps.
  ///
  /// In en, this message translates to:
  /// **'Follow-ups'**
  String get navFollowUps;

  /// No description provided for @navMessageTemplates.
  ///
  /// In en, this message translates to:
  /// **'Message templates'**
  String get navMessageTemplates;

  /// No description provided for @navReportBuilder.
  ///
  /// In en, this message translates to:
  /// **'Report builder'**
  String get navReportBuilder;

  /// No description provided for @navSavedReports.
  ///
  /// In en, this message translates to:
  /// **'Saved reports'**
  String get navSavedReports;

  /// No description provided for @navChecks.
  ///
  /// In en, this message translates to:
  /// **'Checks'**
  String get navChecks;

  /// No description provided for @navStyles.
  ///
  /// In en, this message translates to:
  /// **'Styles'**
  String get navStyles;

  /// No description provided for @navProformas.
  ///
  /// In en, this message translates to:
  /// **'Proforma invoices'**
  String get navProformas;

  /// No description provided for @navApprovals.
  ///
  /// In en, this message translates to:
  /// **'Goods on approval'**
  String get navApprovals;

  /// No description provided for @navPriceLists.
  ///
  /// In en, this message translates to:
  /// **'Price lists'**
  String get navPriceLists;

  /// No description provided for @navInterest.
  ///
  /// In en, this message translates to:
  /// **'Interest on overdue'**
  String get navInterest;

  /// No description provided for @navAgents.
  ///
  /// In en, this message translates to:
  /// **'Agent commission'**
  String get navAgents;

  /// No description provided for @navTargets.
  ///
  /// In en, this message translates to:
  /// **'Salesman targets'**
  String get navTargets;

  /// No description provided for @navSchemes.
  ///
  /// In en, this message translates to:
  /// **'Schemes and offers'**
  String get navSchemes;

  /// No description provided for @navPosReturns.
  ///
  /// In en, this message translates to:
  /// **'Returns and exchanges'**
  String get navPosReturns;

  /// No description provided for @navAlterations.
  ///
  /// In en, this message translates to:
  /// **'Alterations'**
  String get navAlterations;

  /// No description provided for @navTailoring.
  ///
  /// In en, this message translates to:
  /// **'Tailoring'**
  String get navTailoring;

  /// No description provided for @navConsignment.
  ///
  /// In en, this message translates to:
  /// **'Consignment'**
  String get navConsignment;

  /// No description provided for @navCatalogue.
  ///
  /// In en, this message translates to:
  /// **'Image catalogue'**
  String get navCatalogue;

  /// No description provided for @navInsights.
  ///
  /// In en, this message translates to:
  /// **'Business insights'**
  String get navInsights;

  /// No description provided for @navSalesRegister.
  ///
  /// In en, this message translates to:
  /// **'Sales register'**
  String get navSalesRegister;

  /// No description provided for @navColourSize.
  ///
  /// In en, this message translates to:
  /// **'Colour-size report'**
  String get navColourSize;

  /// No description provided for @navStockAgeing.
  ///
  /// In en, this message translates to:
  /// **'Stock ageing'**
  String get navStockAgeing;

  /// No description provided for @navLabels.
  ///
  /// In en, this message translates to:
  /// **'Barcode labels'**
  String get navLabels;

  /// No description provided for @navMessageLog.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp log'**
  String get navMessageLog;

  /// No description provided for @navMyMenu.
  ///
  /// In en, this message translates to:
  /// **'My Menu'**
  String get navMyMenu;

  /// No description provided for @navAllActions.
  ///
  /// In en, this message translates to:
  /// **'All actions'**
  String get navAllActions;

  /// No description provided for @navStockCounts.
  ///
  /// In en, this message translates to:
  /// **'Stock counts'**
  String get navStockCounts;

  /// No description provided for @navWorkspace.
  ///
  /// In en, this message translates to:
  /// **'Workspace'**
  String get navWorkspace;

  /// No description provided for @navSalesPos.
  ///
  /// In en, this message translates to:
  /// **'Sales and counter'**
  String get navSalesPos;

  /// No description provided for @navPromotions.
  ///
  /// In en, this message translates to:
  /// **'Offers and pricing'**
  String get navPromotions;

  /// No description provided for @navFinance.
  ///
  /// In en, this message translates to:
  /// **'Accounts and banking'**
  String get navFinance;

  /// No description provided for @navOperations.
  ///
  /// In en, this message translates to:
  /// **'Expenses, projects and assets'**
  String get navOperations;

  /// No description provided for @navMasters.
  ///
  /// In en, this message translates to:
  /// **'Masters'**
  String get navMasters;

  /// No description provided for @navReportsHub.
  ///
  /// In en, this message translates to:
  /// **'All reports'**
  String get navReportsHub;

  /// No description provided for @navMastersHub.
  ///
  /// In en, this message translates to:
  /// **'All masters'**
  String get navMastersHub;

  /// No description provided for @navSizesColours.
  ///
  /// In en, this message translates to:
  /// **'Sizes and colours'**
  String get navSizesColours;

  /// No description provided for @navBandWorkspace.
  ///
  /// In en, this message translates to:
  /// **'Workspace'**
  String get navBandWorkspace;

  /// No description provided for @navBandCommerce.
  ///
  /// In en, this message translates to:
  /// **'Selling'**
  String get navBandCommerce;

  /// No description provided for @navBandSupply.
  ///
  /// In en, this message translates to:
  /// **'Buying and stock'**
  String get navBandSupply;

  /// No description provided for @navBandProduction.
  ///
  /// In en, this message translates to:
  /// **'Making and running'**
  String get navBandProduction;

  /// No description provided for @navBandMoney.
  ///
  /// In en, this message translates to:
  /// **'Money and people'**
  String get navBandMoney;

  /// No description provided for @navBandInsight.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get navBandInsight;

  /// No description provided for @navBandAdmin.
  ///
  /// In en, this message translates to:
  /// **'Set-up'**
  String get navBandAdmin;

  /// No description provided for @navIntegrity.
  ///
  /// In en, this message translates to:
  /// **'Integrity check'**
  String get navIntegrity;

  /// No description provided for @navCfoView.
  ///
  /// In en, this message translates to:
  /// **'Owner\'s view'**
  String get navCfoView;

  /// No description provided for @navStockMovement.
  ///
  /// In en, this message translates to:
  /// **'Fast and slow movers'**
  String get navStockMovement;

  /// No description provided for @dashboardGreeting.
  ///
  /// In en, this message translates to:
  /// **'Namaste, {name}'**
  String dashboardGreeting(String name);

  /// No description provided for @dashboardSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Here\'s where {business} stands today.'**
  String dashboardSubtitle(String business);

  /// No description provided for @dashboardSetupTitle.
  ///
  /// In en, this message translates to:
  /// **'Finish setting up'**
  String get dashboardSetupTitle;

  /// No description provided for @dashboardSetupCompany.
  ///
  /// In en, this message translates to:
  /// **'Add your company details and PAN'**
  String get dashboardSetupCompany;

  /// No description provided for @dashboardSetupBranch.
  ///
  /// In en, this message translates to:
  /// **'Add a GSTIN for each branch'**
  String get dashboardSetupBranch;

  /// No description provided for @dashboardSetupSeries.
  ///
  /// In en, this message translates to:
  /// **'Check your invoice number series'**
  String get dashboardSetupSeries;

  /// No description provided for @dashboardRoadmapTitle.
  ///
  /// In en, this message translates to:
  /// **'What\'s coming'**
  String get dashboardRoadmapTitle;

  /// No description provided for @dashboardCalcTitle.
  ///
  /// In en, this message translates to:
  /// **'Quick GST calculator'**
  String get dashboardCalcTitle;

  /// No description provided for @dashboardCalcSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Works out CGST/SGST or IGST from the place of supply.'**
  String get dashboardCalcSubtitle;

  /// No description provided for @dashboardKSalesToday.
  ///
  /// In en, this message translates to:
  /// **'Sales today'**
  String get dashboardKSalesToday;

  /// No description provided for @dashboardKVsYesterday.
  ///
  /// In en, this message translates to:
  /// **'Yesterday {amount}'**
  String dashboardKVsYesterday(String amount);

  /// No description provided for @dashboardKSalesMonth.
  ///
  /// In en, this message translates to:
  /// **'Sales this month'**
  String get dashboardKSalesMonth;

  /// No description provided for @dashboardKVsLastMonth.
  ///
  /// In en, this message translates to:
  /// **'Same days last month {amount}'**
  String dashboardKVsLastMonth(String amount);

  /// No description provided for @dashboardKReceivables.
  ///
  /// In en, this message translates to:
  /// **'Receivables'**
  String get dashboardKReceivables;

  /// No description provided for @dashboardKOverdue.
  ///
  /// In en, this message translates to:
  /// **'{amount} overdue'**
  String dashboardKOverdue(String amount);

  /// No description provided for @dashboardKPayables.
  ///
  /// In en, this message translates to:
  /// **'Payables'**
  String get dashboardKPayables;

  /// No description provided for @dashboardKDueSoon.
  ///
  /// In en, this message translates to:
  /// **'{amount} due in 7 days'**
  String dashboardKDueSoon(String amount);

  /// No description provided for @dashboardKProfit.
  ///
  /// In en, this message translates to:
  /// **'Profit this month'**
  String get dashboardKProfit;

  /// No description provided for @dashboardKGrossProfit.
  ///
  /// In en, this message translates to:
  /// **'Gross profit {amount}'**
  String dashboardKGrossProfit(String amount);

  /// No description provided for @dashboardKStockValue.
  ///
  /// In en, this message translates to:
  /// **'Stock value'**
  String get dashboardKStockValue;

  /// No description provided for @dashboardKLowStock.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} item} other {{count} items}} below reorder level'**
  String dashboardKLowStock(num count);

  /// No description provided for @dashboardKPipeline.
  ///
  /// In en, this message translates to:
  /// **'Sales pipeline'**
  String get dashboardKPipeline;

  /// No description provided for @dashboardKWeighted.
  ///
  /// In en, this message translates to:
  /// **'{count} open leads · weighted {amount}'**
  String dashboardKWeighted(String count, String amount);

  /// No description provided for @dashboardKApprovals.
  ///
  /// In en, this message translates to:
  /// **'Waiting for you'**
  String get dashboardKApprovals;

  /// No description provided for @dashboardKClaims.
  ///
  /// In en, this message translates to:
  /// **'expense claims'**
  String get dashboardKClaims;

  /// No description provided for @dashboardKTimesheets.
  ///
  /// In en, this message translates to:
  /// **'timesheets'**
  String get dashboardKTimesheets;

  /// No description provided for @dashboardKLeave.
  ///
  /// In en, this message translates to:
  /// **'leave requests'**
  String get dashboardKLeave;

  /// No description provided for @dashboardKNothingWaiting.
  ///
  /// In en, this message translates to:
  /// **'Nothing waiting.'**
  String get dashboardKNothingWaiting;

  /// No description provided for @dashboardKSalesTrend.
  ///
  /// In en, this message translates to:
  /// **'Sales, last 30 days'**
  String get dashboardKSalesTrend;

  /// No description provided for @dashboardKCashBank.
  ///
  /// In en, this message translates to:
  /// **'Cash and bank'**
  String get dashboardKCashBank;

  /// No description provided for @dashboardKTopCustomers.
  ///
  /// In en, this message translates to:
  /// **'Top customers this month'**
  String get dashboardKTopCustomers;

  /// No description provided for @dashboardKTopItems.
  ///
  /// In en, this message translates to:
  /// **'Best sellers this month'**
  String get dashboardKTopItems;

  /// No description provided for @dashboardKTopDebtors.
  ///
  /// In en, this message translates to:
  /// **'Largest amounts to collect'**
  String get dashboardKTopDebtors;

  /// No description provided for @dashboardKAlerts.
  ///
  /// In en, this message translates to:
  /// **'Needs attention'**
  String get dashboardKAlerts;

  /// No description provided for @dashboardKNoAlerts.
  ///
  /// In en, this message translates to:
  /// **'All clear.'**
  String get dashboardKNoAlerts;

  /// No description provided for @dashboardKAsk.
  ///
  /// In en, this message translates to:
  /// **'Ask the assistant'**
  String get dashboardKAsk;

  /// No description provided for @dashboardKYesterday.
  ///
  /// In en, this message translates to:
  /// **'Yesterday {amount}'**
  String dashboardKYesterday(String amount);

  /// No description provided for @dashboardPosition.
  ///
  /// In en, this message translates to:
  /// **'Money position'**
  String get dashboardPosition;

  /// No description provided for @dashboardAccounts.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} account} other {{count} accounts}}'**
  String dashboardAccounts(num count);

  /// No description provided for @insightsTitle.
  ///
  /// In en, this message translates to:
  /// **'Business insights'**
  String get insightsTitle;

  /// No description provided for @insightsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sales, profit, stock and money for any period, against the same period last year.'**
  String get insightsSubtitle;

  /// No description provided for @insightsNoLastYear.
  ///
  /// In en, this message translates to:
  /// **'new this year'**
  String get insightsNoLastYear;

  /// No description provided for @insightsPts.
  ///
  /// In en, this message translates to:
  /// **'pts'**
  String get insightsPts;

  /// No description provided for @insightsVsLastYear.
  ///
  /// In en, this message translates to:
  /// **'vs last year'**
  String get insightsVsLastYear;

  /// No description provided for @insightsNoSales.
  ///
  /// In en, this message translates to:
  /// **'No sales in this period.'**
  String get insightsNoSales;

  /// No description provided for @insightsHideTable.
  ///
  /// In en, this message translates to:
  /// **'Hide table'**
  String get insightsHideTable;

  /// No description provided for @insightsShowTable.
  ///
  /// In en, this message translates to:
  /// **'Show as a table'**
  String get insightsShowTable;

  /// No description provided for @insightsPresetsThisMonth.
  ///
  /// In en, this message translates to:
  /// **'This month'**
  String get insightsPresetsThisMonth;

  /// No description provided for @insightsPresetsLastMonth.
  ///
  /// In en, this message translates to:
  /// **'Last month'**
  String get insightsPresetsLastMonth;

  /// No description provided for @insightsPresetsThisFy.
  ///
  /// In en, this message translates to:
  /// **'This financial year'**
  String get insightsPresetsThisFy;

  /// No description provided for @insightsPresetsLastFy.
  ///
  /// In en, this message translates to:
  /// **'Last financial year'**
  String get insightsPresetsLastFy;

  /// No description provided for @insightsPresetsLast12.
  ///
  /// In en, this message translates to:
  /// **'Last 12 months'**
  String get insightsPresetsLast12;

  /// No description provided for @insightsFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get insightsFrom;

  /// No description provided for @insightsTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get insightsTo;

  /// No description provided for @insightsApply.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get insightsApply;

  /// No description provided for @insightsCompared.
  ///
  /// In en, this message translates to:
  /// **'Changes are against {from} to {to}.'**
  String insightsCompared(String from, String to);

  /// No description provided for @insightsKpiSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get insightsKpiSales;

  /// No description provided for @insightsKpiPieces.
  ///
  /// In en, this message translates to:
  /// **'Pieces sold'**
  String get insightsKpiPieces;

  /// No description provided for @insightsKpiAvgBill.
  ///
  /// In en, this message translates to:
  /// **'Average bill'**
  String get insightsKpiAvgBill;

  /// No description provided for @insightsKpiProfit.
  ///
  /// In en, this message translates to:
  /// **'Margin'**
  String get insightsKpiProfit;

  /// No description provided for @insightsKpiPurchases.
  ///
  /// In en, this message translates to:
  /// **'Purchases'**
  String get insightsKpiPurchases;

  /// No description provided for @insightsKpiStock.
  ///
  /// In en, this message translates to:
  /// **'Stock now'**
  String get insightsKpiStock;

  /// No description provided for @insightsKpiReceivable.
  ///
  /// In en, this message translates to:
  /// **'To collect'**
  String get insightsKpiReceivable;

  /// No description provided for @insightsKpiPayable.
  ///
  /// In en, this message translates to:
  /// **'To pay'**
  String get insightsKpiPayable;

  /// No description provided for @insightsBeforeTax.
  ///
  /// In en, this message translates to:
  /// **'before GST, after returns'**
  String get insightsBeforeTax;

  /// No description provided for @insightsBillsCount.
  ///
  /// In en, this message translates to:
  /// **'Bills: {n}'**
  String insightsBillsCount(String n);

  /// No description provided for @insightsAvgRate.
  ///
  /// In en, this message translates to:
  /// **'{v} a piece'**
  String insightsAvgRate(String v);

  /// No description provided for @insightsPiecesCount.
  ///
  /// In en, this message translates to:
  /// **'{n} pieces'**
  String insightsPiecesCount(String n);

  /// No description provided for @insightsOwedToUs.
  ///
  /// In en, this message translates to:
  /// **'owed by customers'**
  String get insightsOwedToUs;

  /// No description provided for @insightsWeOwe.
  ///
  /// In en, this message translates to:
  /// **'owed to suppliers'**
  String get insightsWeOwe;

  /// No description provided for @insightsTrend.
  ///
  /// In en, this message translates to:
  /// **'Sales trend'**
  String get insightsTrend;

  /// No description provided for @insightsByMonth.
  ///
  /// In en, this message translates to:
  /// **'By month, before GST'**
  String get insightsByMonth;

  /// No description provided for @insightsByDay.
  ///
  /// In en, this message translates to:
  /// **'By day, before GST'**
  String get insightsByDay;

  /// No description provided for @insightsWeekday.
  ///
  /// In en, this message translates to:
  /// **'Busy days'**
  String get insightsWeekday;

  /// No description provided for @insightsWeekdaySub.
  ///
  /// In en, this message translates to:
  /// **'Sales by day of the week'**
  String get insightsWeekdaySub;

  /// No description provided for @insightsDaysD1.
  ///
  /// In en, this message translates to:
  /// **'Mon'**
  String get insightsDaysD1;

  /// No description provided for @insightsDaysD2.
  ///
  /// In en, this message translates to:
  /// **'Tue'**
  String get insightsDaysD2;

  /// No description provided for @insightsDaysD3.
  ///
  /// In en, this message translates to:
  /// **'Wed'**
  String get insightsDaysD3;

  /// No description provided for @insightsDaysD4.
  ///
  /// In en, this message translates to:
  /// **'Thu'**
  String get insightsDaysD4;

  /// No description provided for @insightsDaysD5.
  ///
  /// In en, this message translates to:
  /// **'Fri'**
  String get insightsDaysD5;

  /// No description provided for @insightsDaysD6.
  ///
  /// In en, this message translates to:
  /// **'Sat'**
  String get insightsDaysD6;

  /// No description provided for @insightsDaysD7.
  ///
  /// In en, this message translates to:
  /// **'Sun'**
  String get insightsDaysD7;

  /// No description provided for @insightsDesigns.
  ///
  /// In en, this message translates to:
  /// **'Best designs'**
  String get insightsDesigns;

  /// No description provided for @insightsByValue.
  ///
  /// In en, this message translates to:
  /// **'By sales value'**
  String get insightsByValue;

  /// No description provided for @insightsSalesmen.
  ///
  /// In en, this message translates to:
  /// **'Top salesmen'**
  String get insightsSalesmen;

  /// No description provided for @insightsSalesmenSub.
  ///
  /// In en, this message translates to:
  /// **'Counter lines and invoices they sold'**
  String get insightsSalesmenSub;

  /// No description provided for @insightsNoSalesmen.
  ///
  /// In en, this message translates to:
  /// **'No sales name a salesman yet.'**
  String get insightsNoSalesmen;

  /// No description provided for @insightsCustomers.
  ///
  /// In en, this message translates to:
  /// **'Top customers'**
  String get insightsCustomers;

  /// No description provided for @insightsCustomersSub.
  ///
  /// In en, this message translates to:
  /// **'Invoiced customers, after returns'**
  String get insightsCustomersSub;

  /// No description provided for @insightsBrands.
  ///
  /// In en, this message translates to:
  /// **'Brands'**
  String get insightsBrands;

  /// No description provided for @insightsTenders.
  ///
  /// In en, this message translates to:
  /// **'How customers paid'**
  String get insightsTenders;

  /// No description provided for @insightsTendersSub.
  ///
  /// In en, this message translates to:
  /// **'With GST: counter payments and invoices on account'**
  String get insightsTendersSub;

  /// No description provided for @insightsModesCash.
  ///
  /// In en, this message translates to:
  /// **'Cash'**
  String get insightsModesCash;

  /// No description provided for @insightsModesUpi.
  ///
  /// In en, this message translates to:
  /// **'UPI'**
  String get insightsModesUpi;

  /// No description provided for @insightsModesCard.
  ///
  /// In en, this message translates to:
  /// **'Card'**
  String get insightsModesCard;

  /// No description provided for @insightsModesCredit.
  ///
  /// In en, this message translates to:
  /// **'Counter on account'**
  String get insightsModesCredit;

  /// No description provided for @insightsModesInvoice.
  ///
  /// In en, this message translates to:
  /// **'Invoices'**
  String get insightsModesInvoice;

  /// No description provided for @insightsAgeing.
  ///
  /// In en, this message translates to:
  /// **'Sales ageing'**
  String get insightsAgeing;

  /// No description provided for @insightsAgeingSub.
  ///
  /// In en, this message translates to:
  /// **'How long goods were with us before they sold'**
  String get insightsAgeingSub;

  /// No description provided for @insightsAge.
  ///
  /// In en, this message translates to:
  /// **'Age'**
  String get insightsAge;

  /// No description provided for @insightsPieces.
  ///
  /// In en, this message translates to:
  /// **'Pieces'**
  String get insightsPieces;

  /// No description provided for @insightsValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get insightsValue;

  /// No description provided for @insightsAgesD030.
  ///
  /// In en, this message translates to:
  /// **'0 to 30 days'**
  String get insightsAgesD030;

  /// No description provided for @insightsAgesD3160.
  ///
  /// In en, this message translates to:
  /// **'31 to 60 days'**
  String get insightsAgesD3160;

  /// No description provided for @insightsAgesD6190.
  ///
  /// In en, this message translates to:
  /// **'61 to 90 days'**
  String get insightsAgesD6190;

  /// No description provided for @insightsAgesD91180.
  ///
  /// In en, this message translates to:
  /// **'91 to 180 days'**
  String get insightsAgesD91180;

  /// No description provided for @insightsAgesD181365.
  ///
  /// In en, this message translates to:
  /// **'6 to 12 months'**
  String get insightsAgesD181365;

  /// No description provided for @insightsAgesY12.
  ///
  /// In en, this message translates to:
  /// **'1 to 2 years'**
  String get insightsAgesY12;

  /// No description provided for @insightsAgesY2plus.
  ///
  /// In en, this message translates to:
  /// **'Over 2 years'**
  String get insightsAgesY2plus;

  /// No description provided for @insightsErrorsInvalidPeriod.
  ///
  /// In en, this message translates to:
  /// **'The start date is after the end date.'**
  String get insightsErrorsInvalidPeriod;

  /// No description provided for @insightsOnCost.
  ///
  /// In en, this message translates to:
  /// **'{v} over standard cost'**
  String insightsOnCost(String v);

  /// No description provided for @calcFrom.
  ///
  /// In en, this message translates to:
  /// **'Supplier state'**
  String get calcFrom;

  /// No description provided for @calcTo.
  ///
  /// In en, this message translates to:
  /// **'Place of supply'**
  String get calcTo;

  /// No description provided for @calcQty.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get calcQty;

  /// No description provided for @calcRate.
  ///
  /// In en, this message translates to:
  /// **'Rate (₹)'**
  String get calcRate;

  /// No description provided for @calcGstRate.
  ///
  /// In en, this message translates to:
  /// **'GST %'**
  String get calcGstRate;

  /// No description provided for @calcTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable value'**
  String get calcTaxable;

  /// No description provided for @calcCgst.
  ///
  /// In en, this message translates to:
  /// **'CGST'**
  String get calcCgst;

  /// No description provided for @calcSgst.
  ///
  /// In en, this message translates to:
  /// **'SGST'**
  String get calcSgst;

  /// No description provided for @calcUtgst.
  ///
  /// In en, this message translates to:
  /// **'UTGST'**
  String get calcUtgst;

  /// No description provided for @calcIgst.
  ///
  /// In en, this message translates to:
  /// **'IGST'**
  String get calcIgst;

  /// No description provided for @calcRoundOff.
  ///
  /// In en, this message translates to:
  /// **'Round off'**
  String get calcRoundOff;

  /// No description provided for @calcTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get calcTotal;

  /// No description provided for @calcInWords.
  ///
  /// In en, this message translates to:
  /// **'In words'**
  String get calcInWords;

  /// No description provided for @calcCess.
  ///
  /// In en, this message translates to:
  /// **'Cess'**
  String get calcCess;

  /// No description provided for @companyTitle.
  ///
  /// In en, this message translates to:
  /// **'Company & branches'**
  String get companyTitle;

  /// No description provided for @companySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Legal details and one branch per GSTIN or location.'**
  String get companySubtitle;

  /// No description provided for @companyName.
  ///
  /// In en, this message translates to:
  /// **'Display name'**
  String get companyName;

  /// No description provided for @companyLegalName.
  ///
  /// In en, this message translates to:
  /// **'Legal name'**
  String get companyLegalName;

  /// No description provided for @companyPan.
  ///
  /// In en, this message translates to:
  /// **'PAN'**
  String get companyPan;

  /// No description provided for @companyBooksBegin.
  ///
  /// In en, this message translates to:
  /// **'Books begin on'**
  String get companyBooksBegin;

  /// No description provided for @companyBranches.
  ///
  /// In en, this message translates to:
  /// **'Branches'**
  String get companyBranches;

  /// No description provided for @companyAddBranch.
  ///
  /// In en, this message translates to:
  /// **'Add branch'**
  String get companyAddBranch;

  /// No description provided for @companyBranchName.
  ///
  /// In en, this message translates to:
  /// **'Branch name'**
  String get companyBranchName;

  /// No description provided for @companyHeadOffice.
  ///
  /// In en, this message translates to:
  /// **'Head office'**
  String get companyHeadOffice;

  /// No description provided for @companyUnregistered.
  ///
  /// In en, this message translates to:
  /// **'Not registered'**
  String get companyUnregistered;

  /// No description provided for @companyCity.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get companyCity;

  /// No description provided for @companyPincode.
  ///
  /// In en, this message translates to:
  /// **'PIN code'**
  String get companyPincode;

  /// No description provided for @seriesTitle.
  ///
  /// In en, this message translates to:
  /// **'Number series'**
  String get seriesTitle;

  /// No description provided for @seriesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'How invoices and vouchers are numbered. GST allows at most 16 characters: letters, digits, - and /.'**
  String get seriesSubtitle;

  /// No description provided for @seriesDocType.
  ///
  /// In en, this message translates to:
  /// **'Document'**
  String get seriesDocType;

  /// No description provided for @seriesPattern.
  ///
  /// In en, this message translates to:
  /// **'Pattern'**
  String get seriesPattern;

  /// No description provided for @seriesNext.
  ///
  /// In en, this message translates to:
  /// **'Next number'**
  String get seriesNext;

  /// No description provided for @seriesFy.
  ///
  /// In en, this message translates to:
  /// **'Financial year'**
  String get seriesFy;

  /// No description provided for @seriesTokens.
  ///
  /// In en, this message translates to:
  /// **'Tokens: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = device code (offline app)'**
  String get seriesTokens;

  /// No description provided for @seriesTypesSalesInvoice.
  ///
  /// In en, this message translates to:
  /// **'Sales invoice'**
  String get seriesTypesSalesInvoice;

  /// No description provided for @seriesTypesCreditNote.
  ///
  /// In en, this message translates to:
  /// **'Credit note'**
  String get seriesTypesCreditNote;

  /// No description provided for @seriesTypesDebitNote.
  ///
  /// In en, this message translates to:
  /// **'Debit note'**
  String get seriesTypesDebitNote;

  /// No description provided for @seriesTypesPurchaseBill.
  ///
  /// In en, this message translates to:
  /// **'Purchase bill'**
  String get seriesTypesPurchaseBill;

  /// No description provided for @seriesTypesReceipt.
  ///
  /// In en, this message translates to:
  /// **'Receipt'**
  String get seriesTypesReceipt;

  /// No description provided for @seriesTypesPayment.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get seriesTypesPayment;

  /// No description provided for @seriesTypesJournal.
  ///
  /// In en, this message translates to:
  /// **'Journal voucher'**
  String get seriesTypesJournal;

  /// No description provided for @seriesErrorsSeriesTooLong.
  ///
  /// In en, this message translates to:
  /// **'Numbers from this pattern would exceed 16 characters.'**
  String get seriesErrorsSeriesTooLong;

  /// No description provided for @seriesErrorsSeriesBadChars.
  ///
  /// In en, this message translates to:
  /// **'Only letters, digits, - and / are allowed.'**
  String get seriesErrorsSeriesBadChars;

  /// No description provided for @seriesErrorsSeriesEmpty.
  ///
  /// In en, this message translates to:
  /// **'The pattern must include a SEQ token.'**
  String get seriesErrorsSeriesEmpty;

  /// No description provided for @seriesErrorsSeriesCannotGoBack.
  ///
  /// In en, this message translates to:
  /// **'The next number can\'t be lower than numbers already issued.'**
  String get seriesErrorsSeriesCannotGoBack;

  /// No description provided for @auditTitle.
  ///
  /// In en, this message translates to:
  /// **'Audit trail'**
  String get auditTitle;

  /// No description provided for @auditSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every change, who made it and when. Entries can\'t be edited or deleted.'**
  String get auditSubtitle;

  /// No description provided for @auditWhen.
  ///
  /// In en, this message translates to:
  /// **'When'**
  String get auditWhen;

  /// No description provided for @auditWho.
  ///
  /// In en, this message translates to:
  /// **'Who'**
  String get auditWho;

  /// No description provided for @auditWhat.
  ///
  /// In en, this message translates to:
  /// **'What'**
  String get auditWhat;

  /// No description provided for @auditDetails.
  ///
  /// In en, this message translates to:
  /// **'Details'**
  String get auditDetails;

  /// No description provided for @auditLoadMore.
  ///
  /// In en, this message translates to:
  /// **'Load older entries'**
  String get auditLoadMore;

  /// No description provided for @auditActionsCreate.
  ///
  /// In en, this message translates to:
  /// **'created'**
  String get auditActionsCreate;

  /// No description provided for @auditActionsUpdate.
  ///
  /// In en, this message translates to:
  /// **'updated'**
  String get auditActionsUpdate;

  /// No description provided for @auditActionsLogin.
  ///
  /// In en, this message translates to:
  /// **'signed in'**
  String get auditActionsLogin;

  /// No description provided for @auditActionsDelete.
  ///
  /// In en, this message translates to:
  /// **'deleted'**
  String get auditActionsDelete;

  /// No description provided for @auditActionsCancel.
  ///
  /// In en, this message translates to:
  /// **'cancelled'**
  String get auditActionsCancel;

  /// No description provided for @auditVerify.
  ///
  /// In en, this message translates to:
  /// **'Check the audit trail'**
  String get auditVerify;

  /// No description provided for @auditVerifying.
  ///
  /// In en, this message translates to:
  /// **'Checking...'**
  String get auditVerifying;

  /// No description provided for @auditVerifyOk.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {All {n} entry is intact. Nothing has been changed or removed.} other {All {n} entries are intact. Nothing has been changed or removed.}}'**
  String auditVerifyOk(num n);

  /// No description provided for @auditVerifyBroken.
  ///
  /// In en, this message translates to:
  /// **'Entry number {seq} does not match the entries before it ({reason}). The audit trail has been altered or damaged. Keep a copy and contact support.'**
  String auditVerifyBroken(String seq, String reason);

  /// No description provided for @auditReasonGap.
  ///
  /// In en, this message translates to:
  /// **'an entry is missing'**
  String get auditReasonGap;

  /// No description provided for @auditReasonLink.
  ///
  /// In en, this message translates to:
  /// **'the order was broken'**
  String get auditReasonLink;

  /// No description provided for @auditReasonContent.
  ///
  /// In en, this message translates to:
  /// **'the entry was edited'**
  String get auditReasonContent;

  /// No description provided for @auditVerifyFailed.
  ///
  /// In en, this message translates to:
  /// **'The check could not run. Try again.'**
  String get auditVerifyFailed;

  /// No description provided for @backupTitle.
  ///
  /// In en, this message translates to:
  /// **'Backup and export'**
  String get backupTitle;

  /// No description provided for @backupSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your data is yours. Download all of it, any time, in files you can open without Varchasv.'**
  String get backupSubtitle;

  /// No description provided for @backupDownload.
  ///
  /// In en, this message translates to:
  /// **'Download everything (ZIP)'**
  String get backupDownload;

  /// No description provided for @backupWhat.
  ///
  /// In en, this message translates to:
  /// **'What you get'**
  String get backupWhat;

  /// No description provided for @backupItem1.
  ///
  /// In en, this message translates to:
  /// **'Every table as a CSV file for Excel and as a JSON file with exact values.'**
  String get backupItem1;

  /// No description provided for @backupItem2.
  ///
  /// In en, this message translates to:
  /// **'Every document you uploaded, as it was.'**
  String get backupItem2;

  /// No description provided for @backupItem3.
  ///
  /// In en, this message translates to:
  /// **'A README that explains each table, and a list of checksums so you can show later that nothing changed.'**
  String get backupItem3;

  /// No description provided for @backupLeftOut.
  ///
  /// In en, this message translates to:
  /// **'Passwords, login tokens and tax-portal sessions are left out.'**
  String get backupLeftOut;

  /// No description provided for @backupKeep.
  ///
  /// In en, this message translates to:
  /// **'Keep the file somewhere safe. It holds your customers, suppliers, prices and books.'**
  String get backupKeep;

  /// No description provided for @backupSlow.
  ///
  /// In en, this message translates to:
  /// **'A large business can take a minute to prepare.'**
  String get backupSlow;

  /// No description provided for @backupAuditLink.
  ///
  /// In en, this message translates to:
  /// **'Check that your audit trail is untouched'**
  String get backupAuditLink;

  /// No description provided for @roadmapAccounts.
  ///
  /// In en, this message translates to:
  /// **'Accounting & GST filing'**
  String get roadmapAccounts;

  /// No description provided for @roadmapInventory.
  ///
  /// In en, this message translates to:
  /// **'Inventory & purchasing'**
  String get roadmapInventory;

  /// No description provided for @roadmapSales.
  ///
  /// In en, this message translates to:
  /// **'Sales, e-invoice & e-way bill'**
  String get roadmapSales;

  /// No description provided for @roadmapOffline.
  ///
  /// In en, this message translates to:
  /// **'Offline app for Windows, Mac, Linux, Android & iOS'**
  String get roadmapOffline;

  /// No description provided for @roadmapPayroll.
  ///
  /// In en, this message translates to:
  /// **'HR & payroll'**
  String get roadmapPayroll;

  /// No description provided for @switcherTitle.
  ///
  /// In en, this message translates to:
  /// **'Your businesses'**
  String get switcherTitle;

  /// No description provided for @switcherAddBusiness.
  ///
  /// In en, this message translates to:
  /// **'Add a business'**
  String get switcherAddBusiness;

  /// No description provided for @switcherCreate.
  ///
  /// In en, this message translates to:
  /// **'Create business'**
  String get switcherCreate;

  /// No description provided for @teamTitle.
  ///
  /// In en, this message translates to:
  /// **'Team & roles'**
  String get teamTitle;

  /// No description provided for @teamSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Who can use this business and what each person can do.'**
  String get teamSubtitle;

  /// No description provided for @teamMembers.
  ///
  /// In en, this message translates to:
  /// **'Members'**
  String get teamMembers;

  /// No description provided for @teamInvite.
  ///
  /// In en, this message translates to:
  /// **'Invite'**
  String get teamInvite;

  /// No description provided for @teamInviteTitle.
  ///
  /// In en, this message translates to:
  /// **'Invite someone'**
  String get teamInviteTitle;

  /// No description provided for @teamEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get teamEmail;

  /// No description provided for @teamRole.
  ///
  /// In en, this message translates to:
  /// **'Role'**
  String get teamRole;

  /// No description provided for @teamStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get teamStatus;

  /// No description provided for @teamActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get teamActive;

  /// No description provided for @teamSuspended.
  ///
  /// In en, this message translates to:
  /// **'Suspended'**
  String get teamSuspended;

  /// No description provided for @teamYou.
  ///
  /// In en, this message translates to:
  /// **'you'**
  String get teamYou;

  /// No description provided for @teamPendingInvites.
  ///
  /// In en, this message translates to:
  /// **'Pending invitations'**
  String get teamPendingInvites;

  /// No description provided for @teamExpires.
  ///
  /// In en, this message translates to:
  /// **'Expires'**
  String get teamExpires;

  /// No description provided for @teamRevoke.
  ///
  /// In en, this message translates to:
  /// **'Revoke'**
  String get teamRevoke;

  /// No description provided for @teamSuspend.
  ///
  /// In en, this message translates to:
  /// **'Suspend'**
  String get teamSuspend;

  /// No description provided for @teamReactivate.
  ///
  /// In en, this message translates to:
  /// **'Reactivate'**
  String get teamReactivate;

  /// No description provided for @teamRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get teamRemove;

  /// No description provided for @teamInviteLink.
  ///
  /// In en, this message translates to:
  /// **'Invitation link'**
  String get teamInviteLink;

  /// No description provided for @teamInviteLinkHint.
  ///
  /// In en, this message translates to:
  /// **'We\'ve emailed it. You can also share it on WhatsApp: it works once and expires in 7 days.'**
  String get teamInviteLinkHint;

  /// No description provided for @teamRoles.
  ///
  /// In en, this message translates to:
  /// **'Roles'**
  String get teamRoles;

  /// No description provided for @teamNewRole.
  ///
  /// In en, this message translates to:
  /// **'New role'**
  String get teamNewRole;

  /// No description provided for @teamRoleName.
  ///
  /// In en, this message translates to:
  /// **'Role name'**
  String get teamRoleName;

  /// No description provided for @teamPermissions.
  ///
  /// In en, this message translates to:
  /// **'Permissions'**
  String get teamPermissions;

  /// No description provided for @teamSystemRole.
  ///
  /// In en, this message translates to:
  /// **'Built-in'**
  String get teamSystemRole;

  /// No description provided for @teamMembersCount.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} member} other {{count} members}}'**
  String teamMembersCount(num count);

  /// No description provided for @teamModulesCompany.
  ///
  /// In en, this message translates to:
  /// **'Company'**
  String get teamModulesCompany;

  /// No description provided for @teamModulesUsers.
  ///
  /// In en, this message translates to:
  /// **'Team'**
  String get teamModulesUsers;

  /// No description provided for @teamModulesAccounts.
  ///
  /// In en, this message translates to:
  /// **'Accounts'**
  String get teamModulesAccounts;

  /// No description provided for @teamModulesSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get teamModulesSales;

  /// No description provided for @teamModulesPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get teamModulesPurchase;

  /// No description provided for @teamModulesInventory.
  ///
  /// In en, this message translates to:
  /// **'Inventory'**
  String get teamModulesInventory;

  /// No description provided for @teamModulesGst.
  ///
  /// In en, this message translates to:
  /// **'GST'**
  String get teamModulesGst;

  /// No description provided for @teamModulesHr.
  ///
  /// In en, this message translates to:
  /// **'HR'**
  String get teamModulesHr;

  /// No description provided for @teamModulesPayroll.
  ///
  /// In en, this message translates to:
  /// **'Payroll'**
  String get teamModulesPayroll;

  /// No description provided for @teamModulesReports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get teamModulesReports;

  /// No description provided for @teamModulesSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get teamModulesSettings;

  /// No description provided for @teamModulesBanking.
  ///
  /// In en, this message translates to:
  /// **'Banking'**
  String get teamModulesBanking;

  /// No description provided for @teamModulesAssets.
  ///
  /// In en, this message translates to:
  /// **'Fixed assets'**
  String get teamModulesAssets;

  /// No description provided for @teamModulesExpenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get teamModulesExpenses;

  /// No description provided for @teamModulesProjects.
  ///
  /// In en, this message translates to:
  /// **'Projects'**
  String get teamModulesProjects;

  /// No description provided for @teamModulesCrm.
  ///
  /// In en, this message translates to:
  /// **'CRM'**
  String get teamModulesCrm;

  /// No description provided for @teamPermView.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get teamPermView;

  /// No description provided for @teamPermCreate.
  ///
  /// In en, this message translates to:
  /// **'Create'**
  String get teamPermCreate;

  /// No description provided for @teamPermEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get teamPermEdit;

  /// No description provided for @teamPermSubmit.
  ///
  /// In en, this message translates to:
  /// **'Submit'**
  String get teamPermSubmit;

  /// No description provided for @teamPermCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get teamPermCancel;

  /// No description provided for @teamPermDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get teamPermDelete;

  /// No description provided for @teamPermExport.
  ///
  /// In en, this message translates to:
  /// **'Export'**
  String get teamPermExport;

  /// No description provided for @teamPermApprove.
  ///
  /// In en, this message translates to:
  /// **'Approve'**
  String get teamPermApprove;

  /// No description provided for @teamErrorsCannotChangeSelf.
  ///
  /// In en, this message translates to:
  /// **'You can\'t change your own access.'**
  String get teamErrorsCannotChangeSelf;

  /// No description provided for @teamErrorsLastOwner.
  ///
  /// In en, this message translates to:
  /// **'A business needs at least one active owner.'**
  String get teamErrorsLastOwner;

  /// No description provided for @teamErrorsOwnerOnly.
  ///
  /// In en, this message translates to:
  /// **'Only an owner can do this.'**
  String get teamErrorsOwnerOnly;

  /// No description provided for @teamErrorsAlreadyMember.
  ///
  /// In en, this message translates to:
  /// **'This person is already a member.'**
  String get teamErrorsAlreadyMember;

  /// No description provided for @teamErrorsPermissionEscalation.
  ///
  /// In en, this message translates to:
  /// **'You can\'t give permissions you don\'t have yourself.'**
  String get teamErrorsPermissionEscalation;

  /// No description provided for @teamErrorsSystemRole.
  ///
  /// In en, this message translates to:
  /// **'Built-in roles can\'t be changed.'**
  String get teamErrorsSystemRole;

  /// No description provided for @teamErrorsRoleInUse.
  ///
  /// In en, this message translates to:
  /// **'Move members off this role before deleting it.'**
  String get teamErrorsRoleInUse;

  /// No description provided for @teamErrorsUnknownRole.
  ///
  /// In en, this message translates to:
  /// **'That role no longer exists.'**
  String get teamErrorsUnknownRole;

  /// No description provided for @teamSpecialTitle.
  ///
  /// In en, this message translates to:
  /// **'Special rights'**
  String get teamSpecialTitle;

  /// No description provided for @teamSpecialHelp.
  ///
  /// In en, this message translates to:
  /// **'Single powers beyond the grid above. Someone can enter bills without being allowed to back-date them or sell below cost.'**
  String get teamSpecialHelp;

  /// No description provided for @teamSpecialChangeDate.
  ///
  /// In en, this message translates to:
  /// **'Back-date documents'**
  String get teamSpecialChangeDate;

  /// No description provided for @teamSpecialFutureDate.
  ///
  /// In en, this message translates to:
  /// **'Future-date documents'**
  String get teamSpecialFutureDate;

  /// No description provided for @teamSpecialSellBelowCost.
  ///
  /// In en, this message translates to:
  /// **'Sell below cost'**
  String get teamSpecialSellBelowCost;

  /// No description provided for @teamSpecialSeeAgentCommission.
  ///
  /// In en, this message translates to:
  /// **'See agent commission'**
  String get teamSpecialSeeAgentCommission;

  /// No description provided for @teamSpecialImportData.
  ///
  /// In en, this message translates to:
  /// **'Import data'**
  String get teamSpecialImportData;

  /// No description provided for @inviteTitle.
  ///
  /// In en, this message translates to:
  /// **'Join {business}'**
  String inviteTitle(String business);

  /// No description provided for @inviteSubtitle.
  ///
  /// In en, this message translates to:
  /// **'{email} has been invited as {role}.'**
  String inviteSubtitle(String email, String role);

  /// No description provided for @inviteCreateAccount.
  ///
  /// In en, this message translates to:
  /// **'Create your account to accept.'**
  String get inviteCreateAccount;

  /// No description provided for @inviteSignInToAccept.
  ///
  /// In en, this message translates to:
  /// **'Enter your Varchasv password to accept.'**
  String get inviteSignInToAccept;

  /// No description provided for @inviteAccept.
  ///
  /// In en, this message translates to:
  /// **'Accept invitation'**
  String get inviteAccept;

  /// No description provided for @inviteInvalid.
  ///
  /// In en, this message translates to:
  /// **'This invitation link is invalid, already used or expired. Ask for a new one.'**
  String get inviteInvalid;

  /// No description provided for @accountsTitle.
  ///
  /// In en, this message translates to:
  /// **'Chart of accounts'**
  String get accountsTitle;

  /// No description provided for @accountsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors.'**
  String get accountsSubtitle;

  /// No description provided for @accountsNewAccount.
  ///
  /// In en, this message translates to:
  /// **'New account'**
  String get accountsNewAccount;

  /// No description provided for @accountsName.
  ///
  /// In en, this message translates to:
  /// **'Account name'**
  String get accountsName;

  /// No description provided for @accountsNameHi.
  ///
  /// In en, this message translates to:
  /// **'Name in Hindi'**
  String get accountsNameHi;

  /// No description provided for @accountsGroup.
  ///
  /// In en, this message translates to:
  /// **'Group'**
  String get accountsGroup;

  /// No description provided for @accountsBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get accountsBalance;

  /// No description provided for @accountsOpeningBalance.
  ///
  /// In en, this message translates to:
  /// **'Opening balance'**
  String get accountsOpeningBalance;

  /// No description provided for @accountsOpeningHint.
  ///
  /// In en, this message translates to:
  /// **'Positive for debit (cash, bank, debtors); negative for credit (capital, loans, creditors).'**
  String get accountsOpeningHint;

  /// No description provided for @accountsCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get accountsCode;

  /// No description provided for @accountsParty.
  ///
  /// In en, this message translates to:
  /// **'Party details'**
  String get accountsParty;

  /// No description provided for @accountsPhone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get accountsPhone;

  /// No description provided for @accountsIfsc.
  ///
  /// In en, this message translates to:
  /// **'IFSC'**
  String get accountsIfsc;

  /// No description provided for @accountsAccountNumber.
  ///
  /// In en, this message translates to:
  /// **'Account number'**
  String get accountsAccountNumber;

  /// No description provided for @accountsAllGroups.
  ///
  /// In en, this message translates to:
  /// **'All groups'**
  String get accountsAllGroups;

  /// No description provided for @accountsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No accounts match.'**
  String get accountsEmpty;

  /// No description provided for @accountsErrorsAccountNameTaken.
  ///
  /// In en, this message translates to:
  /// **'An account with this name already exists.'**
  String get accountsErrorsAccountNameTaken;

  /// No description provided for @accountsErrorsUnknownGroup.
  ///
  /// In en, this message translates to:
  /// **'Choose a group.'**
  String get accountsErrorsUnknownGroup;

  /// No description provided for @accountsErrorsInvalidIfsc.
  ///
  /// In en, this message translates to:
  /// **'An IFSC looks like HDFC0001234.'**
  String get accountsErrorsInvalidIfsc;

  /// No description provided for @accountsErrorsInvalidPan.
  ///
  /// In en, this message translates to:
  /// **'A PAN looks like ABCDE1234F.'**
  String get accountsErrorsInvalidPan;

  /// No description provided for @accountsErrorsSystemAccountGroup.
  ///
  /// In en, this message translates to:
  /// **'Built-in accounts stay in their group.'**
  String get accountsErrorsSystemAccountGroup;

  /// No description provided for @accountsErrorsNotAnAgent.
  ///
  /// In en, this message translates to:
  /// **'Choose a ledger marked as a broker or agent.'**
  String get accountsErrorsNotAnAgent;

  /// No description provided for @accountsErrorsUnknownSalesman.
  ///
  /// In en, this message translates to:
  /// **'Choose a salesman from your employees.'**
  String get accountsErrorsUnknownSalesman;

  /// No description provided for @accountsCreditLimit.
  ///
  /// In en, this message translates to:
  /// **'Credit limit (₹)'**
  String get accountsCreditLimit;

  /// No description provided for @accountsCreditDays.
  ///
  /// In en, this message translates to:
  /// **'Credit days'**
  String get accountsCreditDays;

  /// No description provided for @accountsCreditControl.
  ///
  /// In en, this message translates to:
  /// **'Over the limit or overdue'**
  String get accountsCreditControl;

  /// No description provided for @accountsCreditControlHint.
  ///
  /// In en, this message translates to:
  /// **'Block stops new sales until an owner or admin overrides.'**
  String get accountsCreditControlHint;

  /// No description provided for @accountsCreditWarn.
  ///
  /// In en, this message translates to:
  /// **'Warn and allow'**
  String get accountsCreditWarn;

  /// No description provided for @accountsCreditBlock.
  ///
  /// In en, this message translates to:
  /// **'Block'**
  String get accountsCreditBlock;

  /// No description provided for @accountsBlockOverdueDays.
  ///
  /// In en, this message translates to:
  /// **'Overdue days allowed'**
  String get accountsBlockOverdueDays;

  /// No description provided for @accountsInterestRate.
  ///
  /// In en, this message translates to:
  /// **'Interest on overdue (% a year)'**
  String get accountsInterestRate;

  /// No description provided for @vouchersTitle.
  ///
  /// In en, this message translates to:
  /// **'Vouchers'**
  String get vouchersTitle;

  /// No description provided for @vouchersSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every entry in your books. Posted vouchers are never edited: cancel and re-enter instead.'**
  String get vouchersSubtitle;

  /// No description provided for @vouchersNew.
  ///
  /// In en, this message translates to:
  /// **'New voucher'**
  String get vouchersNew;

  /// No description provided for @vouchersTypesJournal.
  ///
  /// In en, this message translates to:
  /// **'Journal'**
  String get vouchersTypesJournal;

  /// No description provided for @vouchersTypesPayment.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get vouchersTypesPayment;

  /// No description provided for @vouchersTypesReceipt.
  ///
  /// In en, this message translates to:
  /// **'Receipt'**
  String get vouchersTypesReceipt;

  /// No description provided for @vouchersTypesContra.
  ///
  /// In en, this message translates to:
  /// **'Contra'**
  String get vouchersTypesContra;

  /// No description provided for @vouchersTypesPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get vouchersTypesPurchase;

  /// No description provided for @vouchersTypesDebitNote.
  ///
  /// In en, this message translates to:
  /// **'Debit note'**
  String get vouchersTypesDebitNote;

  /// No description provided for @vouchersTypesSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get vouchersTypesSales;

  /// No description provided for @vouchersTypesCreditNote.
  ///
  /// In en, this message translates to:
  /// **'Credit note'**
  String get vouchersTypesCreditNote;

  /// No description provided for @vouchersTypesGatewaySettlement.
  ///
  /// In en, this message translates to:
  /// **'Gateway settlement'**
  String get vouchersTypesGatewaySettlement;

  /// No description provided for @vouchersTypesAssetPurchase.
  ///
  /// In en, this message translates to:
  /// **'Asset purchase'**
  String get vouchersTypesAssetPurchase;

  /// No description provided for @vouchersTypesDepreciation.
  ///
  /// In en, this message translates to:
  /// **'Depreciation'**
  String get vouchersTypesDepreciation;

  /// No description provided for @vouchersTypesAssetDisposal.
  ///
  /// In en, this message translates to:
  /// **'Asset sale'**
  String get vouchersTypesAssetDisposal;

  /// No description provided for @vouchersTypesExpenseClaim.
  ///
  /// In en, this message translates to:
  /// **'Expense claim'**
  String get vouchersTypesExpenseClaim;

  /// No description provided for @vouchersTypesBrokerage.
  ///
  /// In en, this message translates to:
  /// **'Brokerage bill'**
  String get vouchersTypesBrokerage;

  /// No description provided for @vouchersTypeHintsJournal.
  ///
  /// In en, this message translates to:
  /// **'Adjustments, credit sales and purchases, provisions.'**
  String get vouchersTypeHintsJournal;

  /// No description provided for @vouchersTypeHintsPayment.
  ///
  /// In en, this message translates to:
  /// **'Money going out of cash or bank.'**
  String get vouchersTypeHintsPayment;

  /// No description provided for @vouchersTypeHintsReceipt.
  ///
  /// In en, this message translates to:
  /// **'Money coming into cash or bank.'**
  String get vouchersTypeHintsReceipt;

  /// No description provided for @vouchersTypeHintsContra.
  ///
  /// In en, this message translates to:
  /// **'Between cash and bank accounts only.'**
  String get vouchersTypeHintsContra;

  /// No description provided for @vouchersNumber.
  ///
  /// In en, this message translates to:
  /// **'Number'**
  String get vouchersNumber;

  /// No description provided for @vouchersReference.
  ///
  /// In en, this message translates to:
  /// **'Reference'**
  String get vouchersReference;

  /// No description provided for @vouchersAccount.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get vouchersAccount;

  /// No description provided for @vouchersAccounts.
  ///
  /// In en, this message translates to:
  /// **'Accounts'**
  String get vouchersAccounts;

  /// No description provided for @vouchersAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get vouchersAmount;

  /// No description provided for @vouchersAddLine.
  ///
  /// In en, this message translates to:
  /// **'Add line'**
  String get vouchersAddLine;

  /// No description provided for @vouchersDifference.
  ///
  /// In en, this message translates to:
  /// **'Difference'**
  String get vouchersDifference;

  /// No description provided for @vouchersPost.
  ///
  /// In en, this message translates to:
  /// **'Post voucher'**
  String get vouchersPost;

  /// No description provided for @vouchersCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel voucher'**
  String get vouchersCancel;

  /// No description provided for @vouchersCancelReason.
  ///
  /// In en, this message translates to:
  /// **'Reason for cancelling'**
  String get vouchersCancelReason;

  /// No description provided for @vouchersCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get vouchersCancelled;

  /// No description provided for @vouchersPosted.
  ///
  /// In en, this message translates to:
  /// **'Posted'**
  String get vouchersPosted;

  /// No description provided for @vouchersStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get vouchersStatus;

  /// No description provided for @vouchersEmpty.
  ///
  /// In en, this message translates to:
  /// **'No vouchers in this period.'**
  String get vouchersEmpty;

  /// No description provided for @vouchersChooseAccount.
  ///
  /// In en, this message translates to:
  /// **'Choose account…'**
  String get vouchersChooseAccount;

  /// No description provided for @vouchersErrorsUnbalanced.
  ///
  /// In en, this message translates to:
  /// **'Debits and credits must be equal.'**
  String get vouchersErrorsUnbalanced;

  /// No description provided for @vouchersErrorsTooFewLines.
  ///
  /// In en, this message translates to:
  /// **'A voucher needs at least two lines.'**
  String get vouchersErrorsTooFewLines;

  /// No description provided for @vouchersErrorsZeroLine.
  ///
  /// In en, this message translates to:
  /// **'Every line needs an amount.'**
  String get vouchersErrorsZeroLine;

  /// No description provided for @vouchersErrorsBothSides.
  ///
  /// In en, this message translates to:
  /// **'A line can be a debit or a credit, not both.'**
  String get vouchersErrorsBothSides;

  /// No description provided for @vouchersErrorsNegativeAmount.
  ///
  /// In en, this message translates to:
  /// **'Amounts can\'t be negative.'**
  String get vouchersErrorsNegativeAmount;

  /// No description provided for @vouchersErrorsPaymentNeedsCashBankCredit.
  ///
  /// In en, this message translates to:
  /// **'A payment must credit a cash or bank account.'**
  String get vouchersErrorsPaymentNeedsCashBankCredit;

  /// No description provided for @vouchersErrorsReceiptNeedsCashBankDebit.
  ///
  /// In en, this message translates to:
  /// **'A receipt must debit a cash or bank account.'**
  String get vouchersErrorsReceiptNeedsCashBankDebit;

  /// No description provided for @vouchersErrorsContraOnlyCashBank.
  ///
  /// In en, this message translates to:
  /// **'A contra voucher can only use cash and bank accounts.'**
  String get vouchersErrorsContraOnlyCashBank;

  /// No description provided for @vouchersErrorsPeriodLocked.
  ///
  /// In en, this message translates to:
  /// **'This date is in a locked period.'**
  String get vouchersErrorsPeriodLocked;

  /// No description provided for @vouchersErrorsPeriodClosed.
  ///
  /// In en, this message translates to:
  /// **'This financial year is closed.'**
  String get vouchersErrorsPeriodClosed;

  /// No description provided for @vouchersErrorsBeforeBooksBegin.
  ///
  /// In en, this message translates to:
  /// **'This date is before your books begin.'**
  String get vouchersErrorsBeforeBooksBegin;

  /// No description provided for @vouchersErrorsAlreadyCancelled.
  ///
  /// In en, this message translates to:
  /// **'This voucher is already cancelled.'**
  String get vouchersErrorsAlreadyCancelled;

  /// No description provided for @vouchersErrorsUnknownAccount.
  ///
  /// In en, this message translates to:
  /// **'One of the accounts no longer exists.'**
  String get vouchersErrorsUnknownAccount;

  /// No description provided for @vouchersErrorsAccountArchived.
  ///
  /// In en, this message translates to:
  /// **'One of the accounts is archived.'**
  String get vouchersErrorsAccountArchived;

  /// No description provided for @vouchersNegativeWarning.
  ///
  /// In en, this message translates to:
  /// **'{account} will go below zero: {amount}. You can still post it.'**
  String vouchersNegativeWarning(String account, String amount);

  /// No description provided for @promosTitle.
  ///
  /// In en, this message translates to:
  /// **'Vouchers and coupons'**
  String get promosTitle;

  /// No description provided for @promosSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Gift vouchers, coupon codes, discount cards and lucky draws for the counter.'**
  String get promosSubtitle;

  /// No description provided for @promosStatusesActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get promosStatusesActive;

  /// No description provided for @promosStatusesUsed.
  ///
  /// In en, this message translates to:
  /// **'Used up'**
  String get promosStatusesUsed;

  /// No description provided for @promosStatusesExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get promosStatusesExpired;

  /// No description provided for @promosGiftTitle.
  ///
  /// In en, this message translates to:
  /// **'Gift vouchers'**
  String get promosGiftTitle;

  /// No description provided for @promosGiftHint.
  ///
  /// In en, this message translates to:
  /// **'{amount} is still owed on active vouchers. GST is charged on the goods when a voucher is spent, not when it is sold.'**
  String promosGiftHint(String amount);

  /// No description provided for @promosGiftCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get promosGiftCode;

  /// No description provided for @promosGiftFor.
  ///
  /// In en, this message translates to:
  /// **'For'**
  String get promosGiftFor;

  /// No description provided for @promosGiftValue.
  ///
  /// In en, this message translates to:
  /// **'Value (₹)'**
  String get promosGiftValue;

  /// No description provided for @promosGiftBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get promosGiftBalance;

  /// No description provided for @promosGiftExpires.
  ///
  /// In en, this message translates to:
  /// **'Expires on'**
  String get promosGiftExpires;

  /// No description provided for @promosGiftEmpty.
  ///
  /// In en, this message translates to:
  /// **'No gift vouchers sold yet.'**
  String get promosGiftEmpty;

  /// No description provided for @promosGiftCount.
  ///
  /// In en, this message translates to:
  /// **'How many'**
  String get promosGiftCount;

  /// No description provided for @promosGiftPaidBy.
  ///
  /// In en, this message translates to:
  /// **'Paid by'**
  String get promosGiftPaidBy;

  /// No description provided for @promosGiftSell.
  ///
  /// In en, this message translates to:
  /// **'Sell vouchers'**
  String get promosGiftSell;

  /// No description provided for @promosGiftIssued.
  ///
  /// In en, this message translates to:
  /// **'Sold. Codes:'**
  String get promosGiftIssued;

  /// No description provided for @promosGiftExpire.
  ///
  /// In en, this message translates to:
  /// **'Write back expired vouchers'**
  String get promosGiftExpire;

  /// No description provided for @promosGiftExpireHint.
  ///
  /// In en, this message translates to:
  /// **'What is left on vouchers past their date becomes income.'**
  String get promosGiftExpireHint;

  /// No description provided for @promosGiftExpiredDone.
  ///
  /// In en, this message translates to:
  /// **'{n} vouchers expired, {amount} written back.'**
  String promosGiftExpiredDone(String n, String amount);

  /// No description provided for @promosCouponsTitle.
  ///
  /// In en, this message translates to:
  /// **'Coupon codes'**
  String get promosCouponsTitle;

  /// No description provided for @promosCouponsNew.
  ///
  /// In en, this message translates to:
  /// **'New coupon'**
  String get promosCouponsNew;

  /// No description provided for @promosCouponsCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get promosCouponsCode;

  /// No description provided for @promosCouponsOff.
  ///
  /// In en, this message translates to:
  /// **'Discount'**
  String get promosCouponsOff;

  /// No description provided for @promosCouponsValid.
  ///
  /// In en, this message translates to:
  /// **'Valid'**
  String get promosCouponsValid;

  /// No description provided for @promosCouponsUsed.
  ///
  /// In en, this message translates to:
  /// **'Used'**
  String get promosCouponsUsed;

  /// No description provided for @promosCouponsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No coupons yet.'**
  String get promosCouponsEmpty;

  /// No description provided for @promosCouponsUpTo.
  ///
  /// In en, this message translates to:
  /// **'up to {amount}'**
  String promosCouponsUpTo(String amount);

  /// No description provided for @promosCouponsMaxDiscount.
  ///
  /// In en, this message translates to:
  /// **'Most it can take off (₹)'**
  String get promosCouponsMaxDiscount;

  /// No description provided for @promosCouponsMinBill.
  ///
  /// In en, this message translates to:
  /// **'Minimum bill (₹)'**
  String get promosCouponsMinBill;

  /// No description provided for @promosCouponsMaxUses.
  ///
  /// In en, this message translates to:
  /// **'Uses allowed'**
  String get promosCouponsMaxUses;

  /// No description provided for @promosCouponsMaxUsesHint.
  ///
  /// In en, this message translates to:
  /// **'Blank for no limit'**
  String get promosCouponsMaxUsesHint;

  /// No description provided for @promosCardsTitle.
  ///
  /// In en, this message translates to:
  /// **'Discount cards'**
  String get promosCardsTitle;

  /// No description provided for @promosCardsNew.
  ///
  /// In en, this message translates to:
  /// **'New card'**
  String get promosCardsNew;

  /// No description provided for @promosCardsNumber.
  ///
  /// In en, this message translates to:
  /// **'Card number'**
  String get promosCardsNumber;

  /// No description provided for @promosCardsHolder.
  ///
  /// In en, this message translates to:
  /// **'Holder'**
  String get promosCardsHolder;

  /// No description provided for @promosCardsValidUntil.
  ///
  /// In en, this message translates to:
  /// **'Valid until'**
  String get promosCardsValidUntil;

  /// No description provided for @promosCardsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No discount cards yet.'**
  String get promosCardsEmpty;

  /// No description provided for @promosDrawTitle.
  ///
  /// In en, this message translates to:
  /// **'Lucky draw'**
  String get promosDrawTitle;

  /// No description provided for @promosDrawSummary.
  ///
  /// In en, this message translates to:
  /// **'{from} to {to} · {entries} entries'**
  String promosDrawSummary(String from, String to, String entries);

  /// No description provided for @promosDrawEmpty.
  ///
  /// In en, this message translates to:
  /// **'No draws yet.'**
  String get promosDrawEmpty;

  /// No description provided for @promosDrawWinners.
  ///
  /// In en, this message translates to:
  /// **'Winners'**
  String get promosDrawWinners;

  /// No description provided for @promosDrawHint.
  ///
  /// In en, this message translates to:
  /// **'Every bill with a customer mobile in the period is one entry; each mobile can win once.'**
  String get promosDrawHint;

  /// No description provided for @promosDrawRun.
  ///
  /// In en, this message translates to:
  /// **'Pick winners'**
  String get promosDrawRun;

  /// No description provided for @promosStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get promosStatus;

  /// No description provided for @promosErrorsInvalidAmount.
  ///
  /// In en, this message translates to:
  /// **'Enter an amount in rupees.'**
  String get promosErrorsInvalidAmount;

  /// No description provided for @promosErrorsInvalidPercent.
  ///
  /// In en, this message translates to:
  /// **'Enter a percent from 0 to 100.'**
  String get promosErrorsInvalidPercent;

  /// No description provided for @promosErrorsCodeTaken.
  ///
  /// In en, this message translates to:
  /// **'That code is already in use.'**
  String get promosErrorsCodeTaken;

  /// No description provided for @promosErrorsExpiryBeforeIssue.
  ///
  /// In en, this message translates to:
  /// **'The expiry date must be after today.'**
  String get promosErrorsExpiryBeforeIssue;

  /// No description provided for @promosErrorsEndsBeforeStart.
  ///
  /// In en, this message translates to:
  /// **'The end date is before the start date.'**
  String get promosErrorsEndsBeforeStart;

  /// No description provided for @promosErrorsNoEntries.
  ///
  /// In en, this message translates to:
  /// **'No bills with a customer mobile in that period.'**
  String get promosErrorsNoEntries;

  /// No description provided for @promosErrorsInvalidCode.
  ///
  /// In en, this message translates to:
  /// **'Use letters, digits and hyphens only.'**
  String get promosErrorsInvalidCode;

  /// No description provided for @promosErrorsInvalidPhone.
  ///
  /// In en, this message translates to:
  /// **'Enter a 10 digit mobile number.'**
  String get promosErrorsInvalidPhone;

  /// No description provided for @posReturnsTitle.
  ///
  /// In en, this message translates to:
  /// **'Returns and exchanges'**
  String get posReturnsTitle;

  /// No description provided for @posReturnsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Take goods back against a bill. For a size or colour swap, give store credit and bill the new piece with it.'**
  String get posReturnsSubtitle;

  /// No description provided for @posReturnsReturn.
  ///
  /// In en, this message translates to:
  /// **'Return'**
  String get posReturnsReturn;

  /// No description provided for @posReturnsSaved.
  ///
  /// In en, this message translates to:
  /// **'Return {number} saved'**
  String posReturnsSaved(String number);

  /// No description provided for @posReturnsCreditCode.
  ///
  /// In en, this message translates to:
  /// **'Store credit code:'**
  String get posReturnsCreditCode;

  /// No description provided for @posReturnsExchangeNow.
  ///
  /// In en, this message translates to:
  /// **'Bill the exchange now'**
  String get posReturnsExchangeNow;

  /// No description provided for @posReturnsRefunded.
  ///
  /// In en, this message translates to:
  /// **'Refunded by {mode}.'**
  String posReturnsRefunded(String mode);

  /// No description provided for @posReturnsAgainst.
  ///
  /// In en, this message translates to:
  /// **'Return against {number}'**
  String posReturnsAgainst(String number);

  /// No description provided for @posReturnsCanReturn.
  ///
  /// In en, this message translates to:
  /// **'Can return'**
  String get posReturnsCanReturn;

  /// No description provided for @posReturnsQty.
  ///
  /// In en, this message translates to:
  /// **'Qty back'**
  String get posReturnsQty;

  /// No description provided for @posReturnsReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get posReturnsReason;

  /// No description provided for @posReturnsCondition.
  ///
  /// In en, this message translates to:
  /// **'Condition'**
  String get posReturnsCondition;

  /// No description provided for @posReturnsCounter.
  ///
  /// In en, this message translates to:
  /// **'Counter'**
  String get posReturnsCounter;

  /// No description provided for @posReturnsNoShift.
  ///
  /// In en, this message translates to:
  /// **'Open a shift at a counter first.'**
  String get posReturnsNoShift;

  /// No description provided for @posReturnsGive.
  ///
  /// In en, this message translates to:
  /// **'Give back as'**
  String get posReturnsGive;

  /// No description provided for @posReturnsVoucherHint.
  ///
  /// In en, this message translates to:
  /// **'A voucher code to pay for the exchange now or later'**
  String get posReturnsVoucherHint;

  /// No description provided for @posReturnsStoreCredit.
  ///
  /// In en, this message translates to:
  /// **'Store credit (exchange)'**
  String get posReturnsStoreCredit;

  /// No description provided for @posReturnsAbout.
  ///
  /// In en, this message translates to:
  /// **'About {amount}'**
  String posReturnsAbout(String amount);

  /// No description provided for @posReturnsTake.
  ///
  /// In en, this message translates to:
  /// **'Take back'**
  String get posReturnsTake;

  /// No description provided for @posReturnsNumber.
  ///
  /// In en, this message translates to:
  /// **'Return'**
  String get posReturnsNumber;

  /// No description provided for @posReturnsBill.
  ///
  /// In en, this message translates to:
  /// **'Bill'**
  String get posReturnsBill;

  /// No description provided for @posReturnsWhat.
  ///
  /// In en, this message translates to:
  /// **'What came back'**
  String get posReturnsWhat;

  /// No description provided for @posReturnsNone.
  ///
  /// In en, this message translates to:
  /// **'No returns on this day.'**
  String get posReturnsNone;

  /// No description provided for @posReturnsByReason.
  ///
  /// In en, this message translates to:
  /// **'By reason'**
  String get posReturnsByReason;

  /// No description provided for @posReturnsByCondition.
  ///
  /// In en, this message translates to:
  /// **'By condition'**
  String get posReturnsByCondition;

  /// No description provided for @posReturnsBillNumber.
  ///
  /// In en, this message translates to:
  /// **'Bill number'**
  String get posReturnsBillNumber;

  /// No description provided for @posReturnsFind.
  ///
  /// In en, this message translates to:
  /// **'Find bill'**
  String get posReturnsFind;

  /// No description provided for @posReturnsNotFound.
  ///
  /// In en, this message translates to:
  /// **'No bill with that number.'**
  String get posReturnsNotFound;

  /// No description provided for @posReturnsDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get posReturnsDate;

  /// No description provided for @posReturnsShow.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get posReturnsShow;

  /// No description provided for @posReturnsReasonsSize.
  ///
  /// In en, this message translates to:
  /// **'Size'**
  String get posReturnsReasonsSize;

  /// No description provided for @posReturnsReasonsColour.
  ///
  /// In en, this message translates to:
  /// **'Colour'**
  String get posReturnsReasonsColour;

  /// No description provided for @posReturnsReasonsDefect.
  ///
  /// In en, this message translates to:
  /// **'Manufacturing defect'**
  String get posReturnsReasonsDefect;

  /// No description provided for @posReturnsReasonsDamaged.
  ///
  /// In en, this message translates to:
  /// **'Damaged'**
  String get posReturnsReasonsDamaged;

  /// No description provided for @posReturnsReasonsNotLiked.
  ///
  /// In en, this message translates to:
  /// **'Did not like it'**
  String get posReturnsReasonsNotLiked;

  /// No description provided for @posReturnsReasonsOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get posReturnsReasonsOther;

  /// No description provided for @posReturnsGradesA.
  ///
  /// In en, this message translates to:
  /// **'A: as new, back on the shelf'**
  String get posReturnsGradesA;

  /// No description provided for @posReturnsGradesB.
  ///
  /// In en, this message translates to:
  /// **'B: minor fault, sell as second'**
  String get posReturnsGradesB;

  /// No description provided for @posReturnsGradesC.
  ///
  /// In en, this message translates to:
  /// **'C: cannot be sold'**
  String get posReturnsGradesC;

  /// No description provided for @posReturnsErrorsBillVoid.
  ///
  /// In en, this message translates to:
  /// **'This bill was voided; nothing can be returned against it.'**
  String get posReturnsErrorsBillVoid;

  /// No description provided for @posReturnsErrorsOverReturn.
  ///
  /// In en, this message translates to:
  /// **'That is more than is left to return on the line.'**
  String get posReturnsErrorsOverReturn;

  /// No description provided for @posReturnsErrorsSessionNotOpen.
  ///
  /// In en, this message translates to:
  /// **'Open a shift at this counter first.'**
  String get posReturnsErrorsSessionNotOpen;

  /// No description provided for @posReturnsErrorsDuplicateLine.
  ///
  /// In en, this message translates to:
  /// **'A line is listed twice.'**
  String get posReturnsErrorsDuplicateLine;

  /// No description provided for @alterationsTitle.
  ///
  /// In en, this message translates to:
  /// **'Alterations and repairs'**
  String get alterationsTitle;

  /// No description provided for @alterationsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Take garments in for fitting, give them to a karigar, and hand them back on the promised day.'**
  String get alterationsSubtitle;

  /// No description provided for @alterationsNewSlip.
  ///
  /// In en, this message translates to:
  /// **'New alteration slip'**
  String get alterationsNewSlip;

  /// No description provided for @alterationsSetUpFirst.
  ///
  /// In en, this message translates to:
  /// **'Add the kinds of alteration you do (below) to start taking slips.'**
  String get alterationsSetUpFirst;

  /// No description provided for @alterationsStatusReceived.
  ///
  /// In en, this message translates to:
  /// **'Taken in'**
  String get alterationsStatusReceived;

  /// No description provided for @alterationsStatusWithKarigar.
  ///
  /// In en, this message translates to:
  /// **'With the karigar'**
  String get alterationsStatusWithKarigar;

  /// No description provided for @alterationsStatusReady.
  ///
  /// In en, this message translates to:
  /// **'Ready for the customer'**
  String get alterationsStatusReady;

  /// No description provided for @alterationsNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing here.'**
  String get alterationsNone;

  /// No description provided for @alterationsLabour.
  ///
  /// In en, this message translates to:
  /// **'Karigar labour, {from} to {to}'**
  String alterationsLabour(String from, String to);

  /// No description provided for @alterationsKarigar.
  ///
  /// In en, this message translates to:
  /// **'Karigar'**
  String get alterationsKarigar;

  /// No description provided for @alterationsKarigars.
  ///
  /// In en, this message translates to:
  /// **'Karigars'**
  String get alterationsKarigars;

  /// No description provided for @alterationsKarigarHint.
  ///
  /// In en, this message translates to:
  /// **'Outside karigars get their own ledger; their labour is credited when the work comes back. In-house karigars are paid through salary.'**
  String get alterationsKarigarHint;

  /// No description provided for @alterationsNoKarigars.
  ///
  /// In en, this message translates to:
  /// **'No karigars yet.'**
  String get alterationsNoKarigars;

  /// No description provided for @alterationsOutside.
  ///
  /// In en, this message translates to:
  /// **'Outside karigar'**
  String get alterationsOutside;

  /// No description provided for @alterationsInHouse.
  ///
  /// In en, this message translates to:
  /// **'In-house'**
  String get alterationsInHouse;

  /// No description provided for @alterationsPhone.
  ///
  /// In en, this message translates to:
  /// **'Mobile'**
  String get alterationsPhone;

  /// No description provided for @alterationsSlips.
  ///
  /// In en, this message translates to:
  /// **'Slips'**
  String get alterationsSlips;

  /// No description provided for @alterationsPieces.
  ///
  /// In en, this message translates to:
  /// **'Pieces'**
  String get alterationsPieces;

  /// No description provided for @alterationsLabourCol.
  ///
  /// In en, this message translates to:
  /// **'Labour'**
  String get alterationsLabourCol;

  /// No description provided for @alterationsNoLabour.
  ///
  /// In en, this message translates to:
  /// **'Nothing came back from karigars this month.'**
  String get alterationsNoLabour;

  /// No description provided for @alterationsOverdue.
  ///
  /// In en, this message translates to:
  /// **'Overdue'**
  String get alterationsOverdue;

  /// No description provided for @alterationsDue.
  ///
  /// In en, this message translates to:
  /// **'Due {date}'**
  String alterationsDue(String date);

  /// No description provided for @alterationsTrial.
  ///
  /// In en, this message translates to:
  /// **'Trial {date}'**
  String alterationsTrial(String date);

  /// No description provided for @alterationsWith.
  ///
  /// In en, this message translates to:
  /// **'With {name}'**
  String alterationsWith(String name);

  /// No description provided for @alterationsFree.
  ///
  /// In en, this message translates to:
  /// **'Free'**
  String get alterationsFree;

  /// No description provided for @alterationsGive.
  ///
  /// In en, this message translates to:
  /// **'Give'**
  String get alterationsGive;

  /// No description provided for @alterationsBack.
  ///
  /// In en, this message translates to:
  /// **'Back from karigar'**
  String get alterationsBack;

  /// No description provided for @alterationsDeliver.
  ///
  /// In en, this message translates to:
  /// **'Hand over'**
  String get alterationsDeliver;

  /// No description provided for @alterationsDeliverCollect.
  ///
  /// In en, this message translates to:
  /// **'Hand over and collect {amount}'**
  String alterationsDeliverCollect(String amount);

  /// No description provided for @alterationsCancelSlip.
  ///
  /// In en, this message translates to:
  /// **'Cancel slip'**
  String get alterationsCancelSlip;

  /// No description provided for @alterationsAgainstBill.
  ///
  /// In en, this message translates to:
  /// **'Against bill'**
  String get alterationsAgainstBill;

  /// No description provided for @alterationsTrialOn.
  ///
  /// In en, this message translates to:
  /// **'Trial on'**
  String get alterationsTrialOn;

  /// No description provided for @alterationsDeliveryOn.
  ///
  /// In en, this message translates to:
  /// **'Deliver on'**
  String get alterationsDeliveryOn;

  /// No description provided for @alterationsComplimentary.
  ///
  /// In en, this message translates to:
  /// **'Free with the purchase'**
  String get alterationsComplimentary;

  /// No description provided for @alterationsGarment.
  ///
  /// In en, this message translates to:
  /// **'Garment'**
  String get alterationsGarment;

  /// No description provided for @alterationsWork.
  ///
  /// In en, this message translates to:
  /// **'Work'**
  String get alterationsWork;

  /// No description provided for @alterationsNotes.
  ///
  /// In en, this message translates to:
  /// **'Measurements and notes'**
  String get alterationsNotes;

  /// No description provided for @alterationsAddWork.
  ///
  /// In en, this message translates to:
  /// **'Add work'**
  String get alterationsAddWork;

  /// No description provided for @alterationsTakeIn.
  ///
  /// In en, this message translates to:
  /// **'Take in'**
  String get alterationsTakeIn;

  /// No description provided for @alterationsCharge.
  ///
  /// In en, this message translates to:
  /// **'Charge {amount}'**
  String alterationsCharge(String amount);

  /// No description provided for @alterationsTypes.
  ///
  /// In en, this message translates to:
  /// **'Alterations and repairs offered'**
  String get alterationsTypes;

  /// No description provided for @alterationsCustomerCharge.
  ///
  /// In en, this message translates to:
  /// **'Customer pays'**
  String get alterationsCustomerCharge;

  /// No description provided for @alterationsKindsAlteration.
  ///
  /// In en, this message translates to:
  /// **'Alteration'**
  String get alterationsKindsAlteration;

  /// No description provided for @alterationsKindsRepair.
  ///
  /// In en, this message translates to:
  /// **'Repair'**
  String get alterationsKindsRepair;

  /// No description provided for @alterationsErrorsNameTaken.
  ///
  /// In en, this message translates to:
  /// **'That name is already in use.'**
  String get alterationsErrorsNameTaken;

  /// No description provided for @alterationsErrorsNotReceived.
  ///
  /// In en, this message translates to:
  /// **'This slip has already gone to a karigar.'**
  String get alterationsErrorsNotReceived;

  /// No description provided for @alterationsErrorsNotWithKarigar.
  ///
  /// In en, this message translates to:
  /// **'This slip is not with a karigar.'**
  String get alterationsErrorsNotWithKarigar;

  /// No description provided for @alterationsErrorsNotReady.
  ///
  /// In en, this message translates to:
  /// **'This slip is not ready yet.'**
  String get alterationsErrorsNotReady;

  /// No description provided for @alterationsErrorsTerminalRequired.
  ///
  /// In en, this message translates to:
  /// **'Choose the counter to collect the charge at.'**
  String get alterationsErrorsTerminalRequired;

  /// No description provided for @alterationsErrorsDeliveryBeforeDate.
  ///
  /// In en, this message translates to:
  /// **'The delivery date is before the slip date.'**
  String get alterationsErrorsDeliveryBeforeDate;

  /// No description provided for @alterationsErrorsTrialOutOfRange.
  ///
  /// In en, this message translates to:
  /// **'The trial must fall between the slip date and delivery.'**
  String get alterationsErrorsTrialOutOfRange;

  /// No description provided for @alterationsErrorsCannotCancel.
  ///
  /// In en, this message translates to:
  /// **'A delivered or cancelled slip can\'t be cancelled.'**
  String get alterationsErrorsCannotCancel;

  /// No description provided for @tailoringTitle.
  ///
  /// In en, this message translates to:
  /// **'Made-to-order tailoring'**
  String get tailoringTitle;

  /// No description provided for @tailoringSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Measurements, an advance, each process through a karigar, and the tailoring bill at delivery.'**
  String get tailoringSubtitle;

  /// No description provided for @tailoringNewOrder.
  ///
  /// In en, this message translates to:
  /// **'New tailoring order'**
  String get tailoringNewOrder;

  /// No description provided for @tailoringTakeMeasurements.
  ///
  /// In en, this message translates to:
  /// **'Take measurements'**
  String get tailoringTakeMeasurements;

  /// No description provided for @tailoringStatusBooked.
  ///
  /// In en, this message translates to:
  /// **'Booked'**
  String get tailoringStatusBooked;

  /// No description provided for @tailoringStatusInWork.
  ///
  /// In en, this message translates to:
  /// **'In the workroom'**
  String get tailoringStatusInWork;

  /// No description provided for @tailoringStatusReady.
  ///
  /// In en, this message translates to:
  /// **'Ready for delivery'**
  String get tailoringStatusReady;

  /// No description provided for @tailoringTrialDue.
  ///
  /// In en, this message translates to:
  /// **'Trial due'**
  String get tailoringTrialDue;

  /// No description provided for @tailoringToday.
  ///
  /// In en, this message translates to:
  /// **'Due today'**
  String get tailoringToday;

  /// No description provided for @tailoringMarkDone.
  ///
  /// In en, this message translates to:
  /// **'Done'**
  String get tailoringMarkDone;

  /// No description provided for @tailoringMarkReady.
  ///
  /// In en, this message translates to:
  /// **'Mark ready'**
  String get tailoringMarkReady;

  /// No description provided for @tailoringTotalAdvance.
  ///
  /// In en, this message translates to:
  /// **'Total {total}, advance {advance}'**
  String tailoringTotalAdvance(String total, String advance);

  /// No description provided for @tailoringDeliver.
  ///
  /// In en, this message translates to:
  /// **'Deliver and collect {amount}'**
  String tailoringDeliver(String amount);

  /// No description provided for @tailoringCancelOrder.
  ///
  /// In en, this message translates to:
  /// **'Cancel order'**
  String get tailoringCancelOrder;

  /// No description provided for @tailoringCardsFound.
  ///
  /// In en, this message translates to:
  /// **'{n} measurement cards on file'**
  String tailoringCardsFound(String n);

  /// No description provided for @tailoringStitchingPrice.
  ///
  /// In en, this message translates to:
  /// **'Stitching price'**
  String get tailoringStitchingPrice;

  /// No description provided for @tailoringMeasurements.
  ///
  /// In en, this message translates to:
  /// **'Measurement card'**
  String get tailoringMeasurements;

  /// No description provided for @tailoringNoCard.
  ///
  /// In en, this message translates to:
  /// **'No card'**
  String get tailoringNoCard;

  /// No description provided for @tailoringFabric.
  ///
  /// In en, this message translates to:
  /// **'Fabric'**
  String get tailoringFabric;

  /// No description provided for @tailoringOwnFabric.
  ///
  /// In en, this message translates to:
  /// **'Customer\'s own fabric'**
  String get tailoringOwnFabric;

  /// No description provided for @tailoringMetres.
  ///
  /// In en, this message translates to:
  /// **'Metres'**
  String get tailoringMetres;

  /// No description provided for @tailoringStyleNotes.
  ///
  /// In en, this message translates to:
  /// **'Style notes (collar, pockets, fit, lining...)'**
  String get tailoringStyleNotes;

  /// No description provided for @tailoringAddGarment.
  ///
  /// In en, this message translates to:
  /// **'Add garment'**
  String get tailoringAddGarment;

  /// No description provided for @tailoringAdvance.
  ///
  /// In en, this message translates to:
  /// **'Advance (₹)'**
  String get tailoringAdvance;

  /// No description provided for @tailoringAdvanceHint.
  ///
  /// In en, this message translates to:
  /// **'Kept as credit for this order; it comes off the bill at delivery'**
  String get tailoringAdvanceHint;

  /// No description provided for @tailoringBook.
  ///
  /// In en, this message translates to:
  /// **'Book order'**
  String get tailoringBook;

  /// No description provided for @tailoringEstimate.
  ///
  /// In en, this message translates to:
  /// **'Estimate {amount}'**
  String tailoringEstimate(String amount);

  /// No description provided for @tailoringInches.
  ///
  /// In en, this message translates to:
  /// **'Measurements in inches. Leave blank what you don\'t need.'**
  String get tailoringInches;

  /// No description provided for @tailoringOtherMeasure.
  ///
  /// In en, this message translates to:
  /// **'Other measurement'**
  String get tailoringOtherMeasure;

  /// No description provided for @tailoringValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get tailoringValue;

  /// No description provided for @tailoringPhoto.
  ///
  /// In en, this message translates to:
  /// **'Add a photo'**
  String get tailoringPhoto;

  /// No description provided for @tailoringRates.
  ///
  /// In en, this message translates to:
  /// **'Karigar rates by process'**
  String get tailoringRates;

  /// No description provided for @tailoringRatesHint.
  ///
  /// In en, this message translates to:
  /// **'Labour per piece for each process of a garment, in the order they are done. New orders take these processes.'**
  String get tailoringRatesHint;

  /// No description provided for @tailoringProcess.
  ///
  /// In en, this message translates to:
  /// **'Process'**
  String get tailoringProcess;

  /// No description provided for @tailoringNoRates.
  ///
  /// In en, this message translates to:
  /// **'No rates yet: orders will have no processes until you add them.'**
  String get tailoringNoRates;

  /// No description provided for @tailoringAddRate.
  ///
  /// In en, this message translates to:
  /// **'Add process'**
  String get tailoringAddRate;

  /// No description provided for @tailoringKeysChest.
  ///
  /// In en, this message translates to:
  /// **'Chest'**
  String get tailoringKeysChest;

  /// No description provided for @tailoringKeysWaist.
  ///
  /// In en, this message translates to:
  /// **'Waist'**
  String get tailoringKeysWaist;

  /// No description provided for @tailoringKeysHip.
  ///
  /// In en, this message translates to:
  /// **'Hip'**
  String get tailoringKeysHip;

  /// No description provided for @tailoringKeysShoulder.
  ///
  /// In en, this message translates to:
  /// **'Shoulder'**
  String get tailoringKeysShoulder;

  /// No description provided for @tailoringKeysLength.
  ///
  /// In en, this message translates to:
  /// **'Length'**
  String get tailoringKeysLength;

  /// No description provided for @tailoringKeysSleeve.
  ///
  /// In en, this message translates to:
  /// **'Sleeve'**
  String get tailoringKeysSleeve;

  /// No description provided for @tailoringKeysNeck.
  ///
  /// In en, this message translates to:
  /// **'Neck'**
  String get tailoringKeysNeck;

  /// No description provided for @tailoringKeysInseam.
  ///
  /// In en, this message translates to:
  /// **'Inseam'**
  String get tailoringKeysInseam;

  /// No description provided for @tailoringErrorsPhotoTooBig.
  ///
  /// In en, this message translates to:
  /// **'The photo is too large (6 MB at most).'**
  String get tailoringErrorsPhotoTooBig;

  /// No description provided for @tailoringErrorsAdvanceMoreThanTotal.
  ///
  /// In en, this message translates to:
  /// **'The advance is more than the order total.'**
  String get tailoringErrorsAdvanceMoreThanTotal;

  /// No description provided for @tailoringErrorsAssignFirst.
  ///
  /// In en, this message translates to:
  /// **'Give the process to a karigar first.'**
  String get tailoringErrorsAssignFirst;

  /// No description provided for @tailoringErrorsProcessDone.
  ///
  /// In en, this message translates to:
  /// **'That process is already done.'**
  String get tailoringErrorsProcessDone;

  /// No description provided for @tailoringErrorsProcessesPending.
  ///
  /// In en, this message translates to:
  /// **'Some processes are not done yet.'**
  String get tailoringErrorsProcessesPending;

  /// No description provided for @tailoringErrorsNotReady.
  ///
  /// In en, this message translates to:
  /// **'This order is not ready yet.'**
  String get tailoringErrorsNotReady;

  /// No description provided for @tailoringErrorsOrderClosed.
  ///
  /// In en, this message translates to:
  /// **'This order is already delivered or cancelled.'**
  String get tailoringErrorsOrderClosed;

  /// No description provided for @tailoringErrorsFabricQtyRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter how many metres of fabric.'**
  String get tailoringErrorsFabricQtyRequired;

  /// No description provided for @tailoringErrorsNoMeasurements.
  ///
  /// In en, this message translates to:
  /// **'Enter at least one measurement.'**
  String get tailoringErrorsNoMeasurements;

  /// No description provided for @tailoringErrorsDuplicateRate.
  ///
  /// In en, this message translates to:
  /// **'The same garment and process is listed twice.'**
  String get tailoringErrorsDuplicateRate;

  /// No description provided for @consignmentTitle.
  ///
  /// In en, this message translates to:
  /// **'Consignment and shop-in-shop'**
  String get consignmentTitle;

  /// No description provided for @consignmentSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods kept at other stores stay yours until they sell. Send stock, take it back, and bill what their sales report says was sold.'**
  String get consignmentSubtitle;

  /// No description provided for @consignmentSend.
  ///
  /// In en, this message translates to:
  /// **'Send goods'**
  String get consignmentSend;

  /// No description provided for @consignmentBillSales.
  ///
  /// In en, this message translates to:
  /// **'Bill their sales'**
  String get consignmentBillSales;

  /// No description provided for @consignmentTakeBack.
  ///
  /// In en, this message translates to:
  /// **'Take goods back'**
  String get consignmentTakeBack;

  /// No description provided for @consignmentConsignee.
  ///
  /// In en, this message translates to:
  /// **'Consignee'**
  String get consignmentConsignee;

  /// No description provided for @consignmentHeld.
  ///
  /// In en, this message translates to:
  /// **'With them'**
  String get consignmentHeld;

  /// No description provided for @consignmentValueAtCost.
  ///
  /// In en, this message translates to:
  /// **'Value at cost'**
  String get consignmentValueAtCost;

  /// No description provided for @consignmentSold.
  ///
  /// In en, this message translates to:
  /// **'Sold'**
  String get consignmentSold;

  /// No description provided for @consignmentAgeing.
  ///
  /// In en, this message translates to:
  /// **'Ageing'**
  String get consignmentAgeing;

  /// No description provided for @consignmentItemsAgeing.
  ///
  /// In en, this message translates to:
  /// **'Items past 150 days: {n}'**
  String consignmentItemsAgeing(String n);

  /// No description provided for @consignmentFine.
  ///
  /// In en, this message translates to:
  /// **'All fresh'**
  String get consignmentFine;

  /// No description provided for @consignmentNone.
  ///
  /// In en, this message translates to:
  /// **'No goods are out on consignment yet.'**
  String get consignmentNone;

  /// No description provided for @consignmentReconcileTitle.
  ///
  /// In en, this message translates to:
  /// **'Reconciliation: {name}'**
  String consignmentReconcileTitle(String name);

  /// No description provided for @consignmentReconcileHint.
  ///
  /// In en, this message translates to:
  /// **'Enter what you counted at their store. Pieces short are billed to them as sold. Goods must be billed within six months of going out.'**
  String get consignmentReconcileHint;

  /// No description provided for @consignmentSent.
  ///
  /// In en, this message translates to:
  /// **'Sent'**
  String get consignmentSent;

  /// No description provided for @consignmentReturned.
  ///
  /// In en, this message translates to:
  /// **'Taken back'**
  String get consignmentReturned;

  /// No description provided for @consignmentCounted.
  ///
  /// In en, this message translates to:
  /// **'Counted'**
  String get consignmentCounted;

  /// No description provided for @consignmentInvoiceBy.
  ///
  /// In en, this message translates to:
  /// **'Bill by'**
  String get consignmentInvoiceBy;

  /// No description provided for @consignmentMismatch.
  ///
  /// In en, this message translates to:
  /// **'off by {n}'**
  String consignmentMismatch(String n);

  /// No description provided for @consignmentShortage.
  ///
  /// In en, this message translates to:
  /// **'Pieces short in the count: {n}'**
  String consignmentShortage(String n);

  /// No description provided for @consignmentShortageNarration.
  ///
  /// In en, this message translates to:
  /// **'Sold, as found in the stock count'**
  String get consignmentShortageNarration;

  /// No description provided for @consignmentBillShortage.
  ///
  /// In en, this message translates to:
  /// **'Bill the shortage as sold'**
  String get consignmentBillShortage;

  /// No description provided for @consignmentRegister.
  ///
  /// In en, this message translates to:
  /// **'Movements'**
  String get consignmentRegister;

  /// No description provided for @consignmentKindsSend.
  ///
  /// In en, this message translates to:
  /// **'Sent'**
  String get consignmentKindsSend;

  /// No description provided for @consignmentKindsReturn.
  ///
  /// In en, this message translates to:
  /// **'Taken back'**
  String get consignmentKindsReturn;

  /// No description provided for @consignmentKindsSale.
  ///
  /// In en, this message translates to:
  /// **'Sold and billed'**
  String get consignmentKindsSale;

  /// No description provided for @consignmentFormsSend.
  ///
  /// In en, this message translates to:
  /// **'Send goods on consignment'**
  String get consignmentFormsSend;

  /// No description provided for @consignmentFormsReturn.
  ///
  /// In en, this message translates to:
  /// **'Take goods back'**
  String get consignmentFormsReturn;

  /// No description provided for @consignmentFormsSales.
  ///
  /// In en, this message translates to:
  /// **'Their sales report'**
  String get consignmentFormsSales;

  /// No description provided for @consignmentFormHintsSend.
  ///
  /// In en, this message translates to:
  /// **'Stock moves to their store and stays in your books. Leave the rate blank to use their price list or the item\'s sale rate.'**
  String get consignmentFormHintsSend;

  /// No description provided for @consignmentFormHintsReturn.
  ///
  /// In en, this message translates to:
  /// **'Unsold pieces come back to your main store.'**
  String get consignmentFormHintsReturn;

  /// No description provided for @consignmentFormHintsSales.
  ///
  /// In en, this message translates to:
  /// **'Each sales report becomes a tax invoice to them, from the stock at their store. It goes through even over their credit limit, with a warning.'**
  String get consignmentFormHintsSales;

  /// No description provided for @consignmentAgreedRate.
  ///
  /// In en, this message translates to:
  /// **'Agreed rate'**
  String get consignmentAgreedRate;

  /// No description provided for @consignmentAddLine.
  ///
  /// In en, this message translates to:
  /// **'Add item'**
  String get consignmentAddLine;

  /// No description provided for @consignmentSaveSend.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get consignmentSaveSend;

  /// No description provided for @consignmentSaveReturn.
  ///
  /// In en, this message translates to:
  /// **'Take back'**
  String get consignmentSaveReturn;

  /// No description provided for @consignmentSaveSales.
  ///
  /// In en, this message translates to:
  /// **'Make the invoice'**
  String get consignmentSaveSales;

  /// No description provided for @consignmentErrorsMoreThanHeld.
  ///
  /// In en, this message translates to:
  /// **'That is more than they hold.'**
  String get consignmentErrorsMoreThanHeld;

  /// No description provided for @consignmentErrorsNotACustomer.
  ///
  /// In en, this message translates to:
  /// **'Pick a customer account.'**
  String get consignmentErrorsNotACustomer;

  /// No description provided for @consignmentErrorsDuplicateItem.
  ///
  /// In en, this message translates to:
  /// **'The same item is listed twice.'**
  String get consignmentErrorsDuplicateItem;

  /// No description provided for @consignmentErrorsUnknownItem.
  ///
  /// In en, this message translates to:
  /// **'One of the items no longer exists.'**
  String get consignmentErrorsUnknownItem;

  /// No description provided for @reportsParticulars.
  ///
  /// In en, this message translates to:
  /// **'Particulars'**
  String get reportsParticulars;

  /// No description provided for @reportsTradingIncome.
  ///
  /// In en, this message translates to:
  /// **'Sales & direct income'**
  String get reportsTradingIncome;

  /// No description provided for @reportsTradingExpense.
  ///
  /// In en, this message translates to:
  /// **'Purchases & direct expenses'**
  String get reportsTradingExpense;

  /// No description provided for @reportsGrossProfit.
  ///
  /// In en, this message translates to:
  /// **'Gross profit'**
  String get reportsGrossProfit;

  /// No description provided for @reportsOtherIncome.
  ///
  /// In en, this message translates to:
  /// **'Indirect income'**
  String get reportsOtherIncome;

  /// No description provided for @reportsOtherExpense.
  ///
  /// In en, this message translates to:
  /// **'Indirect expenses'**
  String get reportsOtherExpense;

  /// No description provided for @reportsNetProfit.
  ///
  /// In en, this message translates to:
  /// **'Net profit'**
  String get reportsNetProfit;

  /// No description provided for @reportsNetLoss.
  ///
  /// In en, this message translates to:
  /// **'Net loss'**
  String get reportsNetLoss;

  /// No description provided for @reportsAssets.
  ///
  /// In en, this message translates to:
  /// **'Assets'**
  String get reportsAssets;

  /// No description provided for @reportsLiabilities.
  ///
  /// In en, this message translates to:
  /// **'Liabilities & capital'**
  String get reportsLiabilities;

  /// No description provided for @reportsProfitAndLoss.
  ///
  /// In en, this message translates to:
  /// **'Profit & loss account'**
  String get reportsProfitAndLoss;

  /// No description provided for @reportsDifference.
  ///
  /// In en, this message translates to:
  /// **'Difference'**
  String get reportsDifference;

  /// No description provided for @reportsOpeningDifference.
  ///
  /// In en, this message translates to:
  /// **'Difference in opening balances'**
  String get reportsOpeningDifference;

  /// No description provided for @reportsOpening.
  ///
  /// In en, this message translates to:
  /// **'Opening balance'**
  String get reportsOpening;

  /// No description provided for @reportsClosing.
  ///
  /// In en, this message translates to:
  /// **'Closing balance'**
  String get reportsClosing;

  /// No description provided for @reportsNoData.
  ///
  /// In en, this message translates to:
  /// **'Nothing to show for this period.'**
  String get reportsNoData;

  /// No description provided for @reportsLedgerTitle.
  ///
  /// In en, this message translates to:
  /// **'Ledger: {account}'**
  String reportsLedgerTitle(String account);

  /// No description provided for @reportsStockNote.
  ///
  /// In en, this message translates to:
  /// **'Closing stock is added once inventory arrives in phase 3.'**
  String get reportsStockNote;

  /// No description provided for @reportsOpeningStock.
  ///
  /// In en, this message translates to:
  /// **'Opening stock'**
  String get reportsOpeningStock;

  /// No description provided for @reportsClosingStock.
  ///
  /// In en, this message translates to:
  /// **'Closing stock'**
  String get reportsClosingStock;

  /// No description provided for @reportsBuilderTitle.
  ///
  /// In en, this message translates to:
  /// **'Report builder'**
  String get reportsBuilderTitle;

  /// No description provided for @reportsBuilderSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it emailed.'**
  String get reportsBuilderSubtitle;

  /// No description provided for @reportsBuilderDataset.
  ///
  /// In en, this message translates to:
  /// **'Data'**
  String get reportsBuilderDataset;

  /// No description provided for @reportsBuilderDatasetsSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get reportsBuilderDatasetsSales;

  /// No description provided for @reportsBuilderDatasetsPurchases.
  ///
  /// In en, this message translates to:
  /// **'Purchases'**
  String get reportsBuilderDatasetsPurchases;

  /// No description provided for @reportsBuilderDatasetsExpenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get reportsBuilderDatasetsExpenses;

  /// No description provided for @reportsBuilderDatasetsLedger.
  ///
  /// In en, this message translates to:
  /// **'Ledger entries'**
  String get reportsBuilderDatasetsLedger;

  /// No description provided for @reportsBuilderDatasetsTime.
  ///
  /// In en, this message translates to:
  /// **'Timesheets'**
  String get reportsBuilderDatasetsTime;

  /// No description provided for @reportsBuilderGroupBy.
  ///
  /// In en, this message translates to:
  /// **'Group by (up to 3)'**
  String get reportsBuilderGroupBy;

  /// No description provided for @reportsBuilderMeasures.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get reportsBuilderMeasures;

  /// No description provided for @reportsBuilderDimsMonth.
  ///
  /// In en, this message translates to:
  /// **'Month'**
  String get reportsBuilderDimsMonth;

  /// No description provided for @reportsBuilderDimsDay.
  ///
  /// In en, this message translates to:
  /// **'Day'**
  String get reportsBuilderDimsDay;

  /// No description provided for @reportsBuilderDimsCustomer.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get reportsBuilderDimsCustomer;

  /// No description provided for @reportsBuilderDimsItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get reportsBuilderDimsItem;

  /// No description provided for @reportsBuilderDimsHsn.
  ///
  /// In en, this message translates to:
  /// **'HSN'**
  String get reportsBuilderDimsHsn;

  /// No description provided for @reportsBuilderDimsState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get reportsBuilderDimsState;

  /// No description provided for @reportsBuilderDimsSupplier.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get reportsBuilderDimsSupplier;

  /// No description provided for @reportsBuilderDimsCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get reportsBuilderDimsCategory;

  /// No description provided for @reportsBuilderDimsEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get reportsBuilderDimsEmployee;

  /// No description provided for @reportsBuilderDimsProject.
  ///
  /// In en, this message translates to:
  /// **'Project'**
  String get reportsBuilderDimsProject;

  /// No description provided for @reportsBuilderDimsAccount.
  ///
  /// In en, this message translates to:
  /// **'Ledger'**
  String get reportsBuilderDimsAccount;

  /// No description provided for @reportsBuilderDimsGroup.
  ///
  /// In en, this message translates to:
  /// **'Group'**
  String get reportsBuilderDimsGroup;

  /// No description provided for @reportsBuilderDimsType.
  ///
  /// In en, this message translates to:
  /// **'Voucher type'**
  String get reportsBuilderDimsType;

  /// No description provided for @reportsBuilderMeasureNamesQty.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get reportsBuilderMeasureNamesQty;

  /// No description provided for @reportsBuilderMeasureNamesTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable value'**
  String get reportsBuilderMeasureNamesTaxable;

  /// No description provided for @reportsBuilderMeasureNamesTax.
  ///
  /// In en, this message translates to:
  /// **'GST'**
  String get reportsBuilderMeasureNamesTax;

  /// No description provided for @reportsBuilderMeasureNamesTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get reportsBuilderMeasureNamesTotal;

  /// No description provided for @reportsBuilderMeasureNamesDocuments.
  ///
  /// In en, this message translates to:
  /// **'Documents'**
  String get reportsBuilderMeasureNamesDocuments;

  /// No description provided for @reportsBuilderMeasureNamesAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get reportsBuilderMeasureNamesAmount;

  /// No description provided for @reportsBuilderMeasureNamesItc.
  ///
  /// In en, this message translates to:
  /// **'GST credit'**
  String get reportsBuilderMeasureNamesItc;

  /// No description provided for @reportsBuilderMeasureNamesDebit.
  ///
  /// In en, this message translates to:
  /// **'Debit'**
  String get reportsBuilderMeasureNamesDebit;

  /// No description provided for @reportsBuilderMeasureNamesCredit.
  ///
  /// In en, this message translates to:
  /// **'Credit'**
  String get reportsBuilderMeasureNamesCredit;

  /// No description provided for @reportsBuilderMeasureNamesNet.
  ///
  /// In en, this message translates to:
  /// **'Net'**
  String get reportsBuilderMeasureNamesNet;

  /// No description provided for @reportsBuilderMeasureNamesHours.
  ///
  /// In en, this message translates to:
  /// **'Hours'**
  String get reportsBuilderMeasureNamesHours;

  /// No description provided for @reportsBuilderMeasureNamesCost.
  ///
  /// In en, this message translates to:
  /// **'Cost'**
  String get reportsBuilderMeasureNamesCost;

  /// No description provided for @reportsBuilderMeasureNamesBillableValue.
  ///
  /// In en, this message translates to:
  /// **'Billable value'**
  String get reportsBuilderMeasureNamesBillableValue;

  /// No description provided for @reportsBuilderPeriod.
  ///
  /// In en, this message translates to:
  /// **'Period'**
  String get reportsBuilderPeriod;

  /// No description provided for @reportsBuilderPresetsToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get reportsBuilderPresetsToday;

  /// No description provided for @reportsBuilderPresetsYesterday.
  ///
  /// In en, this message translates to:
  /// **'Yesterday'**
  String get reportsBuilderPresetsYesterday;

  /// No description provided for @reportsBuilderPresetsThisMonth.
  ///
  /// In en, this message translates to:
  /// **'This month'**
  String get reportsBuilderPresetsThisMonth;

  /// No description provided for @reportsBuilderPresetsLastMonth.
  ///
  /// In en, this message translates to:
  /// **'Last month'**
  String get reportsBuilderPresetsLastMonth;

  /// No description provided for @reportsBuilderPresetsThisQuarter.
  ///
  /// In en, this message translates to:
  /// **'This quarter'**
  String get reportsBuilderPresetsThisQuarter;

  /// No description provided for @reportsBuilderPresetsLastQuarter.
  ///
  /// In en, this message translates to:
  /// **'Last quarter'**
  String get reportsBuilderPresetsLastQuarter;

  /// No description provided for @reportsBuilderPresetsThisFy.
  ///
  /// In en, this message translates to:
  /// **'This financial year'**
  String get reportsBuilderPresetsThisFy;

  /// No description provided for @reportsBuilderPresetsLastFy.
  ///
  /// In en, this message translates to:
  /// **'Last financial year'**
  String get reportsBuilderPresetsLastFy;

  /// No description provided for @reportsBuilderPresetsCustom.
  ///
  /// In en, this message translates to:
  /// **'Choose dates'**
  String get reportsBuilderPresetsCustom;

  /// No description provided for @reportsBuilderRun.
  ///
  /// In en, this message translates to:
  /// **'Run'**
  String get reportsBuilderRun;

  /// No description provided for @reportsBuilderCsv.
  ///
  /// In en, this message translates to:
  /// **'Download CSV'**
  String get reportsBuilderCsv;

  /// No description provided for @reportsBuilderSave.
  ///
  /// In en, this message translates to:
  /// **'Save report'**
  String get reportsBuilderSave;

  /// No description provided for @reportsBuilderName.
  ///
  /// In en, this message translates to:
  /// **'Report name'**
  String get reportsBuilderName;

  /// No description provided for @reportsBuilderSchedule.
  ///
  /// In en, this message translates to:
  /// **'Email it'**
  String get reportsBuilderSchedule;

  /// No description provided for @reportsBuilderFrequenciesNone.
  ///
  /// In en, this message translates to:
  /// **'Don\'t email'**
  String get reportsBuilderFrequenciesNone;

  /// No description provided for @reportsBuilderFrequenciesDaily.
  ///
  /// In en, this message translates to:
  /// **'Every day (yesterday\'s figures)'**
  String get reportsBuilderFrequenciesDaily;

  /// No description provided for @reportsBuilderFrequenciesWeekly.
  ///
  /// In en, this message translates to:
  /// **'Every week (last Monday to Sunday)'**
  String get reportsBuilderFrequenciesWeekly;

  /// No description provided for @reportsBuilderFrequenciesMonthly.
  ///
  /// In en, this message translates to:
  /// **'Every month (last month)'**
  String get reportsBuilderFrequenciesMonthly;

  /// No description provided for @reportsBuilderHour.
  ///
  /// In en, this message translates to:
  /// **'At'**
  String get reportsBuilderHour;

  /// No description provided for @reportsBuilderWeekday.
  ///
  /// In en, this message translates to:
  /// **'On'**
  String get reportsBuilderWeekday;

  /// No description provided for @reportsBuilderWeekdays0.
  ///
  /// In en, this message translates to:
  /// **'Sunday'**
  String get reportsBuilderWeekdays0;

  /// No description provided for @reportsBuilderWeekdays1.
  ///
  /// In en, this message translates to:
  /// **'Monday'**
  String get reportsBuilderWeekdays1;

  /// No description provided for @reportsBuilderWeekdays2.
  ///
  /// In en, this message translates to:
  /// **'Tuesday'**
  String get reportsBuilderWeekdays2;

  /// No description provided for @reportsBuilderWeekdays3.
  ///
  /// In en, this message translates to:
  /// **'Wednesday'**
  String get reportsBuilderWeekdays3;

  /// No description provided for @reportsBuilderWeekdays4.
  ///
  /// In en, this message translates to:
  /// **'Thursday'**
  String get reportsBuilderWeekdays4;

  /// No description provided for @reportsBuilderWeekdays5.
  ///
  /// In en, this message translates to:
  /// **'Friday'**
  String get reportsBuilderWeekdays5;

  /// No description provided for @reportsBuilderWeekdays6.
  ///
  /// In en, this message translates to:
  /// **'Saturday'**
  String get reportsBuilderWeekdays6;

  /// No description provided for @reportsBuilderDay.
  ///
  /// In en, this message translates to:
  /// **'On day (1–28)'**
  String get reportsBuilderDay;

  /// No description provided for @reportsBuilderRecipients.
  ///
  /// In en, this message translates to:
  /// **'Email to (separate with commas)'**
  String get reportsBuilderRecipients;

  /// No description provided for @reportsBuilderSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved.'**
  String get reportsBuilderSaved;

  /// No description provided for @reportsBuilderTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get reportsBuilderTotal;

  /// No description provided for @reportsBuilderNoRows.
  ///
  /// In en, this message translates to:
  /// **'No data for this period.'**
  String get reportsBuilderNoRows;

  /// No description provided for @reportsBuilderSavedTitle.
  ///
  /// In en, this message translates to:
  /// **'Saved reports'**
  String get reportsBuilderSavedTitle;

  /// No description provided for @reportsBuilderNextRun.
  ///
  /// In en, this message translates to:
  /// **'Next email: {date}'**
  String reportsBuilderNextRun(String date);

  /// No description provided for @reportsBuilderLastError.
  ///
  /// In en, this message translates to:
  /// **'Last run failed: {error}'**
  String reportsBuilderLastError(String error);

  /// No description provided for @reportsBuilderDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get reportsBuilderDelete;

  /// No description provided for @reportsBuilderNone.
  ///
  /// In en, this message translates to:
  /// **'No saved reports yet.'**
  String get reportsBuilderNone;

  /// No description provided for @reportsErrorsUnknownDataset.
  ///
  /// In en, this message translates to:
  /// **'Choose what to report on.'**
  String get reportsErrorsUnknownDataset;

  /// No description provided for @reportsErrorsUnknownMeasure.
  ///
  /// In en, this message translates to:
  /// **'Choose at least one figure to show.'**
  String get reportsErrorsUnknownMeasure;

  /// No description provided for @reportsErrorsUnknownDimension.
  ///
  /// In en, this message translates to:
  /// **'That grouping isn\'t available here.'**
  String get reportsErrorsUnknownDimension;

  /// No description provided for @reportsErrorsInvalidPeriod.
  ///
  /// In en, this message translates to:
  /// **'Check the dates.'**
  String get reportsErrorsInvalidPeriod;

  /// No description provided for @reportsErrorsRecipientsRequired.
  ///
  /// In en, this message translates to:
  /// **'Add at least one email address.'**
  String get reportsErrorsRecipientsRequired;

  /// No description provided for @reportsErrorsInvalidHour.
  ///
  /// In en, this message translates to:
  /// **'Choose a time.'**
  String get reportsErrorsInvalidHour;

  /// No description provided for @reportsErrorsInvalidWeekday.
  ///
  /// In en, this message translates to:
  /// **'Choose a day of the week.'**
  String get reportsErrorsInvalidWeekday;

  /// No description provided for @reportsErrorsInvalidDay.
  ///
  /// In en, this message translates to:
  /// **'Choose a day from 1 to 28.'**
  String get reportsErrorsInvalidDay;

  /// No description provided for @reportsErrorsUnknownFilter.
  ///
  /// In en, this message translates to:
  /// **'That filter isn\'t available here.'**
  String get reportsErrorsUnknownFilter;

  /// No description provided for @ownerReportsColourSizeTitle.
  ///
  /// In en, this message translates to:
  /// **'Colour and size report'**
  String get ownerReportsColourSizeTitle;

  /// No description provided for @ownerReportsColourSizeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Each design as a grid of colours and sizes, with stock or pieces sold.'**
  String get ownerReportsColourSizeSubtitle;

  /// No description provided for @ownerReportsAgeingTitle.
  ///
  /// In en, this message translates to:
  /// **'Stock ageing and dead stock'**
  String get ownerReportsAgeingTitle;

  /// No description provided for @ownerReportsAgeingSubtitle.
  ///
  /// In en, this message translates to:
  /// **'How long today\'s stock has been with you (oldest received sells first), and what has stopped selling.'**
  String get ownerReportsAgeingSubtitle;

  /// No description provided for @ownerReportsRegisterTitle.
  ///
  /// In en, this message translates to:
  /// **'Sales register'**
  String get ownerReportsRegisterTitle;

  /// No description provided for @ownerReportsRegisterSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every invoice, counter bill and return in the period, with how each was paid.'**
  String get ownerReportsRegisterSubtitle;

  /// No description provided for @ownerReportsDesign.
  ///
  /// In en, this message translates to:
  /// **'Design'**
  String get ownerReportsDesign;

  /// No description provided for @ownerReportsName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get ownerReportsName;

  /// No description provided for @ownerReportsBrand.
  ///
  /// In en, this message translates to:
  /// **'Brand'**
  String get ownerReportsBrand;

  /// No description provided for @ownerReportsColour.
  ///
  /// In en, this message translates to:
  /// **'Colour'**
  String get ownerReportsColour;

  /// No description provided for @ownerReportsSize.
  ///
  /// In en, this message translates to:
  /// **'Size'**
  String get ownerReportsSize;

  /// No description provided for @ownerReportsSold.
  ///
  /// In en, this message translates to:
  /// **'Sold'**
  String get ownerReportsSold;

  /// No description provided for @ownerReportsStock.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get ownerReportsStock;

  /// No description provided for @ownerReportsSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get ownerReportsSales;

  /// No description provided for @ownerReportsReportType.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get ownerReportsReportType;

  /// No description provided for @ownerReportsFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get ownerReportsFrom;

  /// No description provided for @ownerReportsTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get ownerReportsTo;

  /// No description provided for @ownerReportsAsOf.
  ///
  /// In en, this message translates to:
  /// **'As of'**
  String get ownerReportsAsOf;

  /// No description provided for @ownerReportsStore.
  ///
  /// In en, this message translates to:
  /// **'Store'**
  String get ownerReportsStore;

  /// No description provided for @ownerReportsAllStores.
  ///
  /// In en, this message translates to:
  /// **'All our stores'**
  String get ownerReportsAllStores;

  /// No description provided for @ownerReportsAllBrands.
  ///
  /// In en, this message translates to:
  /// **'All brands'**
  String get ownerReportsAllBrands;

  /// No description provided for @ownerReportsCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get ownerReportsCategory;

  /// No description provided for @ownerReportsAllCategories.
  ///
  /// In en, this message translates to:
  /// **'All categories'**
  String get ownerReportsAllCategories;

  /// No description provided for @ownerReportsSearchDesign.
  ///
  /// In en, this message translates to:
  /// **'Design no. or name'**
  String get ownerReportsSearchDesign;

  /// No description provided for @ownerReportsTotalSold.
  ///
  /// In en, this message translates to:
  /// **'Pieces sold: {n}'**
  String ownerReportsTotalSold(String n);

  /// No description provided for @ownerReportsTotalStock.
  ///
  /// In en, this message translates to:
  /// **'Pieces in stock: {n}'**
  String ownerReportsTotalStock(String n);

  /// No description provided for @ownerReportsExcel.
  ///
  /// In en, this message translates to:
  /// **'Excel'**
  String get ownerReportsExcel;

  /// No description provided for @ownerReportsMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP {v}'**
  String ownerReportsMrp(String v);

  /// No description provided for @ownerReportsTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get ownerReportsTotal;

  /// No description provided for @ownerReportsNoPhoto.
  ///
  /// In en, this message translates to:
  /// **'No photo'**
  String get ownerReportsNoPhoto;

  /// No description provided for @ownerReportsNothing.
  ///
  /// In en, this message translates to:
  /// **'Nothing to show for these choices.'**
  String get ownerReportsNothing;

  /// No description provided for @ownerReportsItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get ownerReportsItem;

  /// No description provided for @ownerReportsValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get ownerReportsValue;

  /// No description provided for @ownerReportsDeadAfter.
  ///
  /// In en, this message translates to:
  /// **'Dead after'**
  String get ownerReportsDeadAfter;

  /// No description provided for @ownerReportsDeadAfterDays.
  ///
  /// In en, this message translates to:
  /// **'Dead: no sale for {n} days'**
  String ownerReportsDeadAfterDays(String n);

  /// No description provided for @ownerReportsOnlyDead.
  ///
  /// In en, this message translates to:
  /// **'Only dead stock'**
  String get ownerReportsOnlyDead;

  /// No description provided for @ownerReportsByAge.
  ///
  /// In en, this message translates to:
  /// **'Stock by age: {v}, {n} pieces'**
  String ownerReportsByAge(String v, String n);

  /// No description provided for @ownerReportsDeadTitle.
  ///
  /// In en, this message translates to:
  /// **'Dead stock (no sale for {n} days)'**
  String ownerReportsDeadTitle(String n);

  /// No description provided for @ownerReportsDeadDetail.
  ///
  /// In en, this message translates to:
  /// **'Items: {items}, pieces: {qty}'**
  String ownerReportsDeadDetail(String items, String qty);

  /// No description provided for @ownerReportsDeadHint.
  ///
  /// In en, this message translates to:
  /// **'Candidates for a markdown, a return to the supplier or a transfer to another store.'**
  String get ownerReportsDeadHint;

  /// No description provided for @ownerReportsDead.
  ///
  /// In en, this message translates to:
  /// **'dead'**
  String get ownerReportsDead;

  /// No description provided for @ownerReportsLastSold.
  ///
  /// In en, this message translates to:
  /// **'Last sold'**
  String get ownerReportsLastSold;

  /// No description provided for @ownerReportsIdleDays.
  ///
  /// In en, this message translates to:
  /// **'Days without a sale'**
  String get ownerReportsIdleDays;

  /// No description provided for @ownerReportsIdle.
  ///
  /// In en, this message translates to:
  /// **'{date} ({n} days ago)'**
  String ownerReportsIdle(String date, String n);

  /// No description provided for @ownerReportsNeverSold.
  ///
  /// In en, this message translates to:
  /// **'Never sold'**
  String get ownerReportsNeverSold;

  /// No description provided for @ownerReportsDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get ownerReportsDate;

  /// No description provided for @ownerReportsNumber.
  ///
  /// In en, this message translates to:
  /// **'No.'**
  String get ownerReportsNumber;

  /// No description provided for @ownerReportsKind.
  ///
  /// In en, this message translates to:
  /// **'Document'**
  String get ownerReportsKind;

  /// No description provided for @ownerReportsParty.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get ownerReportsParty;

  /// No description provided for @ownerReportsColsPieces.
  ///
  /// In en, this message translates to:
  /// **'Pcs'**
  String get ownerReportsColsPieces;

  /// No description provided for @ownerReportsColsGross.
  ///
  /// In en, this message translates to:
  /// **'Gross'**
  String get ownerReportsColsGross;

  /// No description provided for @ownerReportsColsDiscount.
  ///
  /// In en, this message translates to:
  /// **'Discount'**
  String get ownerReportsColsDiscount;

  /// No description provided for @ownerReportsColsTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable'**
  String get ownerReportsColsTaxable;

  /// No description provided for @ownerReportsColsTax.
  ///
  /// In en, this message translates to:
  /// **'GST'**
  String get ownerReportsColsTax;

  /// No description provided for @ownerReportsColsTotal.
  ///
  /// In en, this message translates to:
  /// **'Bill amount'**
  String get ownerReportsColsTotal;

  /// No description provided for @ownerReportsColsCash.
  ///
  /// In en, this message translates to:
  /// **'Cash'**
  String get ownerReportsColsCash;

  /// No description provided for @ownerReportsColsUpi.
  ///
  /// In en, this message translates to:
  /// **'UPI'**
  String get ownerReportsColsUpi;

  /// No description provided for @ownerReportsColsCard.
  ///
  /// In en, this message translates to:
  /// **'Card'**
  String get ownerReportsColsCard;

  /// No description provided for @ownerReportsColsCredit.
  ///
  /// In en, this message translates to:
  /// **'On account'**
  String get ownerReportsColsCredit;

  /// No description provided for @ownerReportsKindsInvoice.
  ///
  /// In en, this message translates to:
  /// **'Invoice'**
  String get ownerReportsKindsInvoice;

  /// No description provided for @ownerReportsKindsBill.
  ///
  /// In en, this message translates to:
  /// **'Counter bill'**
  String get ownerReportsKindsBill;

  /// No description provided for @ownerReportsKindsCreditNote.
  ///
  /// In en, this message translates to:
  /// **'Credit note'**
  String get ownerReportsKindsCreditNote;

  /// No description provided for @ownerReportsKindsCounterReturn.
  ///
  /// In en, this message translates to:
  /// **'Counter return'**
  String get ownerReportsKindsCounterReturn;

  /// No description provided for @ownerReportsSearchRegister.
  ///
  /// In en, this message translates to:
  /// **'Number or customer'**
  String get ownerReportsSearchRegister;

  /// No description provided for @ownerReportsAllKinds.
  ///
  /// In en, this message translates to:
  /// **'All documents'**
  String get ownerReportsAllKinds;

  /// No description provided for @ownerReportsDocuments.
  ///
  /// In en, this message translates to:
  /// **'Documents: {n}'**
  String ownerReportsDocuments(String n);

  /// No description provided for @ownerReportsRegisterHint.
  ///
  /// In en, this message translates to:
  /// **'Returns show as minus rows. Shaded rows had a discount; struck-through rows were cancelled and are left out of the totals.'**
  String get ownerReportsRegisterHint;

  /// No description provided for @ownerReportsCompareLastYear.
  ///
  /// In en, this message translates to:
  /// **'Compare to last year'**
  String get ownerReportsCompareLastYear;

  /// No description provided for @ownerReportsThisPeriod.
  ///
  /// In en, this message translates to:
  /// **'This period'**
  String get ownerReportsThisPeriod;

  /// No description provided for @ownerReportsSameLastYear.
  ///
  /// In en, this message translates to:
  /// **'Same period last year'**
  String get ownerReportsSameLastYear;

  /// No description provided for @ownerReportsChange.
  ///
  /// In en, this message translates to:
  /// **'Change'**
  String get ownerReportsChange;

  /// No description provided for @ownerReportsErrorsInvalidPeriod.
  ///
  /// In en, this message translates to:
  /// **'The start date is after the end date.'**
  String get ownerReportsErrorsInvalidPeriod;

  /// No description provided for @ownerReportsWithMaterials.
  ///
  /// In en, this message translates to:
  /// **'Include fabric and trims'**
  String get ownerReportsWithMaterials;

  /// No description provided for @ownerReportsAvgBill.
  ///
  /// In en, this message translates to:
  /// **'Average bill'**
  String get ownerReportsAvgBill;

  /// No description provided for @fyTitle.
  ///
  /// In en, this message translates to:
  /// **'Financial years'**
  String get fyTitle;

  /// No description provided for @fySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Lock a period once its books are final: for example after filing GST returns. Nobody can post or cancel entries on or before the lock date.'**
  String get fySubtitle;

  /// No description provided for @fyYear.
  ///
  /// In en, this message translates to:
  /// **'Year'**
  String get fyYear;

  /// No description provided for @fyPeriod.
  ///
  /// In en, this message translates to:
  /// **'Period'**
  String get fyPeriod;

  /// No description provided for @fyLockedUpTo.
  ///
  /// In en, this message translates to:
  /// **'Locked up to'**
  String get fyLockedUpTo;

  /// No description provided for @fyOpen.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get fyOpen;

  /// No description provided for @fyLock.
  ///
  /// In en, this message translates to:
  /// **'Lock'**
  String get fyLock;

  /// No description provided for @fyUnlock.
  ///
  /// In en, this message translates to:
  /// **'Remove lock'**
  String get fyUnlock;

  /// No description provided for @fyErrorsLockOutsideYear.
  ///
  /// In en, this message translates to:
  /// **'The lock date must fall inside this financial year.'**
  String get fyErrorsLockOutsideYear;

  /// No description provided for @appConnectTitle.
  ///
  /// In en, this message translates to:
  /// **'Connect this device'**
  String get appConnectTitle;

  /// No description provided for @appConnectSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sign in once with your Varchasv account. After that the app works without internet and syncs whenever you\'re online.'**
  String get appConnectSubtitle;

  /// No description provided for @appServer.
  ///
  /// In en, this message translates to:
  /// **'Server address'**
  String get appServer;

  /// No description provided for @appConnect.
  ///
  /// In en, this message translates to:
  /// **'Connect'**
  String get appConnect;

  /// No description provided for @appConnecting.
  ///
  /// In en, this message translates to:
  /// **'Connecting…'**
  String get appConnecting;

  /// No description provided for @appNoBusiness.
  ///
  /// In en, this message translates to:
  /// **'This account isn\'t part of any business yet. Create one on the website first.'**
  String get appNoBusiness;

  /// No description provided for @appCantReach.
  ///
  /// In en, this message translates to:
  /// **'Can\'t reach the server. Check the address and your internet connection.'**
  String get appCantReach;

  /// No description provided for @appSyncTitle.
  ///
  /// In en, this message translates to:
  /// **'Sync'**
  String get appSyncTitle;

  /// No description provided for @appSyncNow.
  ///
  /// In en, this message translates to:
  /// **'Sync now'**
  String get appSyncNow;

  /// No description provided for @appLastSync.
  ///
  /// In en, this message translates to:
  /// **'Last synced {time}'**
  String appLastSync(String time);

  /// No description provided for @appNeverSynced.
  ///
  /// In en, this message translates to:
  /// **'Not synced yet'**
  String get appNeverSynced;

  /// No description provided for @appPending.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =0 {Everything is uploaded} one {{count} change waiting to upload} other {{count} changes waiting to upload}}'**
  String appPending(num count);

  /// No description provided for @appRefused.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} change was refused by the server} other {{count} changes were refused by the server}}'**
  String appRefused(num count);

  /// No description provided for @appRetry.
  ///
  /// In en, this message translates to:
  /// **'Try refused changes again'**
  String get appRetry;

  /// No description provided for @appOffline.
  ///
  /// In en, this message translates to:
  /// **'Offline: your work is saved on this device and will upload later.'**
  String get appOffline;

  /// No description provided for @appSyncing.
  ///
  /// In en, this message translates to:
  /// **'Syncing…'**
  String get appSyncing;

  /// No description provided for @appDevice.
  ///
  /// In en, this message translates to:
  /// **'This device'**
  String get appDevice;

  /// No description provided for @appDeviceCode.
  ///
  /// In en, this message translates to:
  /// **'Device code {code}'**
  String appDeviceCode(String code);

  /// No description provided for @appBusiness.
  ///
  /// In en, this message translates to:
  /// **'Business'**
  String get appBusiness;

  /// No description provided for @appSignOut.
  ///
  /// In en, this message translates to:
  /// **'Sign out of this device'**
  String get appSignOut;

  /// No description provided for @appSignOutWarning.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =0 {This removes the local copy of your books from this device.} one {{count} change hasn\'t uploaded yet and will be lost.} other {{count} changes haven\'t uploaded yet and will be lost.}}'**
  String appSignOutWarning(num count);

  /// No description provided for @appBadgePending.
  ///
  /// In en, this message translates to:
  /// **'Waiting to upload'**
  String get appBadgePending;

  /// No description provided for @appBadgeFailed.
  ///
  /// In en, this message translates to:
  /// **'Refused'**
  String get appBadgeFailed;

  /// No description provided for @appBadgeSynced.
  ///
  /// In en, this message translates to:
  /// **'Uploaded'**
  String get appBadgeSynced;

  /// No description provided for @appNoVouchers.
  ///
  /// In en, this message translates to:
  /// **'No vouchers yet. Tap + to add one.'**
  String get appNoVouchers;

  /// No description provided for @appAddAccount.
  ///
  /// In en, this message translates to:
  /// **'Add account'**
  String get appAddAccount;

  /// No description provided for @appNoPermission.
  ///
  /// In en, this message translates to:
  /// **'You don\'t have permission to do this.'**
  String get appNoPermission;

  /// No description provided for @appToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get appToday;

  /// No description provided for @appPreviousDay.
  ///
  /// In en, this message translates to:
  /// **'Previous day'**
  String get appPreviousDay;

  /// No description provided for @appNextDay.
  ///
  /// In en, this message translates to:
  /// **'Next day'**
  String get appNextDay;

  /// No description provided for @appNotSyncedYet.
  ///
  /// In en, this message translates to:
  /// **'Waiting to sync'**
  String get appNotSyncedYet;

  /// No description provided for @appFieldTitle.
  ///
  /// In en, this message translates to:
  /// **'Field work'**
  String get appFieldTitle;

  /// No description provided for @appFieldNewOrder.
  ///
  /// In en, this message translates to:
  /// **'New order'**
  String get appFieldNewOrder;

  /// No description provided for @appFieldNewClaim.
  ///
  /// In en, this message translates to:
  /// **'New expense claim'**
  String get appFieldNewClaim;

  /// No description provided for @appFieldOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders from this device'**
  String get appFieldOrders;

  /// No description provided for @appFieldClaims.
  ///
  /// In en, this message translates to:
  /// **'Claims from this device'**
  String get appFieldClaims;

  /// No description provided for @appFieldSentAs.
  ///
  /// In en, this message translates to:
  /// **'Uploaded as {number}'**
  String appFieldSentAs(String number);

  /// No description provided for @appFieldApprox.
  ///
  /// In en, this message translates to:
  /// **'About ₹{amount} with GST; the final amount is worked out on upload'**
  String appFieldApprox(String amount);

  /// No description provided for @appFieldAddItem.
  ///
  /// In en, this message translates to:
  /// **'Add item'**
  String get appFieldAddItem;

  /// No description provided for @appFieldQty.
  ///
  /// In en, this message translates to:
  /// **'Qty'**
  String get appFieldQty;

  /// No description provided for @appFieldRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get appFieldRate;

  /// No description provided for @appFieldSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get appFieldSave;

  /// No description provided for @appFieldSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved on this device; it uploads when you\'re online.'**
  String get appFieldSaved;

  /// No description provided for @appFieldNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing yet.'**
  String get appFieldNone;

  /// No description provided for @appOverviewTitle.
  ///
  /// In en, this message translates to:
  /// **'Overview'**
  String get appOverviewTitle;

  /// No description provided for @appOverviewAsOf.
  ///
  /// In en, this message translates to:
  /// **'Figures as of {time}'**
  String appOverviewAsOf(String time);

  /// No description provided for @appOverviewOffline.
  ///
  /// In en, this message translates to:
  /// **'Showing the figures from {time}. Connect to the internet to refresh.'**
  String appOverviewOffline(String time);

  /// No description provided for @appOverviewNever.
  ///
  /// In en, this message translates to:
  /// **'Connect to the internet to see today\'s figures.'**
  String get appOverviewNever;

  /// No description provided for @appOverviewRefresh.
  ///
  /// In en, this message translates to:
  /// **'Refresh'**
  String get appOverviewRefresh;

  /// No description provided for @appApprovalsTitle.
  ///
  /// In en, this message translates to:
  /// **'Approvals'**
  String get appApprovalsTitle;

  /// No description provided for @appApprovalsNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing waiting for you.'**
  String get appApprovalsNone;

  /// No description provided for @appApprovalsHours.
  ///
  /// In en, this message translates to:
  /// **'{project} · {hours} h'**
  String appApprovalsHours(String project, String hours);

  /// No description provided for @appApprovalsNeedOnline.
  ///
  /// In en, this message translates to:
  /// **'Approvals need the internet.'**
  String get appApprovalsNeedOnline;

  /// No description provided for @itemsTitle.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get itemsTitle;

  /// No description provided for @itemsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods you stock and services you buy or sell, with HSN/SAC and GST rate.'**
  String get itemsSubtitle;

  /// No description provided for @itemsNew.
  ///
  /// In en, this message translates to:
  /// **'New item'**
  String get itemsNew;

  /// No description provided for @itemsName.
  ///
  /// In en, this message translates to:
  /// **'Item name'**
  String get itemsName;

  /// No description provided for @itemsKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get itemsKind;

  /// No description provided for @itemsGoods.
  ///
  /// In en, this message translates to:
  /// **'Goods'**
  String get itemsGoods;

  /// No description provided for @itemsService.
  ///
  /// In en, this message translates to:
  /// **'Service'**
  String get itemsService;

  /// No description provided for @itemsSku.
  ///
  /// In en, this message translates to:
  /// **'SKU / code'**
  String get itemsSku;

  /// No description provided for @itemsBarcode.
  ///
  /// In en, this message translates to:
  /// **'Barcode'**
  String get itemsBarcode;

  /// No description provided for @itemsHsn.
  ///
  /// In en, this message translates to:
  /// **'HSN / SAC'**
  String get itemsHsn;

  /// No description provided for @itemsGstRate.
  ///
  /// In en, this message translates to:
  /// **'GST rate'**
  String get itemsGstRate;

  /// No description provided for @itemsUom.
  ///
  /// In en, this message translates to:
  /// **'Unit'**
  String get itemsUom;

  /// No description provided for @itemsPurchaseRate.
  ///
  /// In en, this message translates to:
  /// **'Purchase rate'**
  String get itemsPurchaseRate;

  /// No description provided for @itemsSaleRate.
  ///
  /// In en, this message translates to:
  /// **'Sale rate'**
  String get itemsSaleRate;

  /// No description provided for @itemsMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP'**
  String get itemsMrp;

  /// No description provided for @itemsReorderLevel.
  ///
  /// In en, this message translates to:
  /// **'Reorder level'**
  String get itemsReorderLevel;

  /// No description provided for @itemsReorderQty.
  ///
  /// In en, this message translates to:
  /// **'Reorder quantity'**
  String get itemsReorderQty;

  /// No description provided for @itemsTrackBatches.
  ///
  /// In en, this message translates to:
  /// **'Track batch numbers and expiry'**
  String get itemsTrackBatches;

  /// No description provided for @itemsInStock.
  ///
  /// In en, this message translates to:
  /// **'In stock'**
  String get itemsInStock;

  /// No description provided for @itemsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No items yet.'**
  String get itemsEmpty;

  /// No description provided for @itemsErrorsInvalidHsn.
  ///
  /// In en, this message translates to:
  /// **'An HSN code has 4, 6 or 8 digits.'**
  String get itemsErrorsInvalidHsn;

  /// No description provided for @itemsErrorsInvalidSac.
  ///
  /// In en, this message translates to:
  /// **'A SAC code has 6 digits starting with 99.'**
  String get itemsErrorsInvalidSac;

  /// No description provided for @itemsErrorsItemNameTaken.
  ///
  /// In en, this message translates to:
  /// **'An item with this name already exists.'**
  String get itemsErrorsItemNameTaken;

  /// No description provided for @itemsErrorsSkuTaken.
  ///
  /// In en, this message translates to:
  /// **'Another item already uses this code.'**
  String get itemsErrorsSkuTaken;

  /// No description provided for @itemsErrorsUnknownUom.
  ///
  /// In en, this message translates to:
  /// **'Choose a unit.'**
  String get itemsErrorsUnknownUom;

  /// No description provided for @itemsErrorsSameAsBaseUnit.
  ///
  /// In en, this message translates to:
  /// **'This is already the item\'s own unit.'**
  String get itemsErrorsSameAsBaseUnit;

  /// No description provided for @itemsErrorsDuplicateUnit.
  ///
  /// In en, this message translates to:
  /// **'Each unit can be added once.'**
  String get itemsErrorsDuplicateUnit;

  /// No description provided for @itemsErrorsInvalidFactor.
  ///
  /// In en, this message translates to:
  /// **'Enter how many base units it holds, more than 0.'**
  String get itemsErrorsInvalidFactor;

  /// No description provided for @itemsLeadTimeDays.
  ///
  /// In en, this message translates to:
  /// **'Lead time (days)'**
  String get itemsLeadTimeDays;

  /// No description provided for @itemsGstSlab.
  ///
  /// In en, this message translates to:
  /// **'GST rate'**
  String get itemsGstSlab;

  /// No description provided for @itemsSlabNone.
  ///
  /// In en, this message translates to:
  /// **'Fixed rate'**
  String get itemsSlabNone;

  /// No description provided for @itemsSlabApparel.
  ///
  /// In en, this message translates to:
  /// **'5% up to ₹2,500 a piece after discount, 18% above (from 22 Sep 2025)'**
  String get itemsSlabApparel;

  /// No description provided for @itemsSlabFootwear.
  ///
  /// In en, this message translates to:
  /// **'5% up to ₹2,500 a pair after discount, 18% above (from 22 Sep 2025)'**
  String get itemsSlabFootwear;

  /// No description provided for @itemsSlabPieces.
  ///
  /// In en, this message translates to:
  /// **'Pieces in one unit'**
  String get itemsSlabPieces;

  /// No description provided for @itemsSlabPiecesHint.
  ///
  /// In en, this message translates to:
  /// **'For a set sold as one unit, its price is split across this many pieces for the GST test. Enter 1 to treat the set as one piece.'**
  String get itemsSlabPiecesHint;

  /// No description provided for @itemsByPrice.
  ///
  /// In en, this message translates to:
  /// **'By price'**
  String get itemsByPrice;

  /// No description provided for @itemsOtherUnits.
  ///
  /// In en, this message translates to:
  /// **'Other units'**
  String get itemsOtherUnits;

  /// No description provided for @itemsUnitFactor.
  ///
  /// In en, this message translates to:
  /// **'How many in the base unit'**
  String get itemsUnitFactor;

  /// No description provided for @itemsOfBaseUnit.
  ///
  /// In en, this message translates to:
  /// **'of the base unit'**
  String get itemsOfBaseUnit;

  /// No description provided for @itemsAddUnit.
  ///
  /// In en, this message translates to:
  /// **'Add a unit'**
  String get itemsAddUnit;

  /// No description provided for @stylesTitle.
  ///
  /// In en, this message translates to:
  /// **'Styles'**
  String get stylesTitle;

  /// No description provided for @stylesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock.'**
  String get stylesSubtitle;

  /// No description provided for @stylesSizesAndColors.
  ///
  /// In en, this message translates to:
  /// **'Sizes and colours'**
  String get stylesSizesAndColors;

  /// No description provided for @stylesSizesAndColorsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'The size scales and colours you pick from when you add a style.'**
  String get stylesSizesAndColorsSubtitle;

  /// No description provided for @stylesNew.
  ///
  /// In en, this message translates to:
  /// **'New style'**
  String get stylesNew;

  /// No description provided for @stylesCreate.
  ///
  /// In en, this message translates to:
  /// **'Create style'**
  String get stylesCreate;

  /// No description provided for @stylesCode.
  ///
  /// In en, this message translates to:
  /// **'Design no.'**
  String get stylesCode;

  /// No description provided for @stylesCodeHint.
  ///
  /// In en, this message translates to:
  /// **'Used in every SKU, for example KT-101-NVY-M.'**
  String get stylesCodeHint;

  /// No description provided for @stylesName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get stylesName;

  /// No description provided for @stylesBrand.
  ///
  /// In en, this message translates to:
  /// **'Brand'**
  String get stylesBrand;

  /// No description provided for @stylesCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get stylesCategory;

  /// No description provided for @stylesSeason.
  ///
  /// In en, this message translates to:
  /// **'Season'**
  String get stylesSeason;

  /// No description provided for @stylesSeasonExample.
  ///
  /// In en, this message translates to:
  /// **'Festive 2026'**
  String get stylesSeasonExample;

  /// No description provided for @stylesCollection.
  ///
  /// In en, this message translates to:
  /// **'Collection'**
  String get stylesCollection;

  /// No description provided for @stylesSizeScale.
  ///
  /// In en, this message translates to:
  /// **'Size scale'**
  String get stylesSizeScale;

  /// No description provided for @stylesSizes.
  ///
  /// In en, this message translates to:
  /// **'Sizes'**
  String get stylesSizes;

  /// No description provided for @stylesSizesExample.
  ///
  /// In en, this message translates to:
  /// **'S, M, L, XL'**
  String get stylesSizesExample;

  /// No description provided for @stylesColors.
  ///
  /// In en, this message translates to:
  /// **'Colours'**
  String get stylesColors;

  /// No description provided for @stylesColor.
  ///
  /// In en, this message translates to:
  /// **'Colour'**
  String get stylesColor;

  /// No description provided for @stylesFits.
  ///
  /// In en, this message translates to:
  /// **'Fits'**
  String get stylesFits;

  /// No description provided for @stylesFitsHint.
  ///
  /// In en, this message translates to:
  /// **'A third choice besides colour and size, separated by commas.'**
  String get stylesFitsHint;

  /// No description provided for @stylesFitsExample.
  ///
  /// In en, this message translates to:
  /// **'Slim, Regular'**
  String get stylesFitsExample;

  /// No description provided for @stylesVariants.
  ///
  /// In en, this message translates to:
  /// **'Variants'**
  String get stylesVariants;

  /// No description provided for @stylesSaleRate.
  ///
  /// In en, this message translates to:
  /// **'Sale rate'**
  String get stylesSaleRate;

  /// No description provided for @stylesWillCreate.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, =0 {Pick sizes and colours.} one {This creates {count} item.} other {This creates {count} items, one for each colour and size.}}'**
  String stylesWillCreate(num count);

  /// No description provided for @stylesEmpty.
  ///
  /// In en, this message translates to:
  /// **'No styles yet. Add one to create its colours and sizes in one go.'**
  String get stylesEmpty;

  /// No description provided for @stylesNoMatch.
  ///
  /// In en, this message translates to:
  /// **'No style matches your search.'**
  String get stylesNoMatch;

  /// No description provided for @stylesSearchStyles.
  ///
  /// In en, this message translates to:
  /// **'Search by design no., name or brand'**
  String get stylesSearchStyles;

  /// No description provided for @stylesNoStyles.
  ///
  /// In en, this message translates to:
  /// **'No styles found.'**
  String get stylesNoStyles;

  /// No description provided for @stylesChooseStyle.
  ///
  /// In en, this message translates to:
  /// **'Choose a style'**
  String get stylesChooseStyle;

  /// No description provided for @stylesOtherStyle.
  ///
  /// In en, this message translates to:
  /// **'Another style'**
  String get stylesOtherStyle;

  /// No description provided for @stylesAddBySize.
  ///
  /// In en, this message translates to:
  /// **'Add by size'**
  String get stylesAddBySize;

  /// No description provided for @stylesAddPieces.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {Add {count} piece} other {Add {count} pieces}}'**
  String stylesAddPieces(num count);

  /// No description provided for @stylesStockUnder.
  ///
  /// In en, this message translates to:
  /// **'The small number under each box is the stock in hand.'**
  String get stylesStockUnder;

  /// No description provided for @stylesStockGrid.
  ///
  /// In en, this message translates to:
  /// **'Stock by colour and size'**
  String get stylesStockGrid;

  /// No description provided for @stylesAllWarehouses.
  ///
  /// In en, this message translates to:
  /// **'All warehouses'**
  String get stylesAllWarehouses;

  /// No description provided for @stylesDetails.
  ///
  /// In en, this message translates to:
  /// **'Style details'**
  String get stylesDetails;

  /// No description provided for @stylesApplyPrices.
  ///
  /// In en, this message translates to:
  /// **'Apply these prices to every size'**
  String get stylesApplyPrices;

  /// No description provided for @stylesAddVariants.
  ///
  /// In en, this message translates to:
  /// **'Add colours or sizes'**
  String get stylesAddVariants;

  /// No description provided for @stylesAddVariantsHint.
  ///
  /// In en, this message translates to:
  /// **'Pick new colours, sizes, or both. Variants the style already has are left as they are.'**
  String get stylesAddVariantsHint;

  /// No description provided for @stylesSets.
  ///
  /// In en, this message translates to:
  /// **'Sets'**
  String get stylesSets;

  /// No description provided for @stylesNoSets.
  ///
  /// In en, this message translates to:
  /// **'No sets yet.'**
  String get stylesNoSets;

  /// No description provided for @stylesNewSet.
  ///
  /// In en, this message translates to:
  /// **'New set'**
  String get stylesNewSet;

  /// No description provided for @stylesNewSetHint.
  ///
  /// In en, this message translates to:
  /// **'A set of one colour in a size ratio, sold as one unit. Stock moves as its pieces.'**
  String get stylesNewSetHint;

  /// No description provided for @stylesRatio.
  ///
  /// In en, this message translates to:
  /// **'Pieces of size'**
  String get stylesRatio;

  /// No description provided for @stylesSetAsOnePiece.
  ///
  /// In en, this message translates to:
  /// **'Count the whole set as one piece for GST'**
  String get stylesSetAsOnePiece;

  /// No description provided for @stylesCreateSet.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {Create set of {count} piece} other {Create set of {count} pieces}}'**
  String stylesCreateSet(num count);

  /// No description provided for @stylesSizeScales.
  ///
  /// In en, this message translates to:
  /// **'Size scales'**
  String get stylesSizeScales;

  /// No description provided for @stylesScaleName.
  ///
  /// In en, this message translates to:
  /// **'Scale name'**
  String get stylesScaleName;

  /// No description provided for @stylesColorName.
  ///
  /// In en, this message translates to:
  /// **'Colour name'**
  String get stylesColorName;

  /// No description provided for @stylesColorCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get stylesColorCode;

  /// No description provided for @stylesSwatch.
  ///
  /// In en, this message translates to:
  /// **'Swatch'**
  String get stylesSwatch;

  /// No description provided for @stylesArchive.
  ///
  /// In en, this message translates to:
  /// **'Archive'**
  String get stylesArchive;

  /// No description provided for @stylesRestore.
  ///
  /// In en, this message translates to:
  /// **'Restore'**
  String get stylesRestore;

  /// No description provided for @stylesErrorsStyleCodeTaken.
  ///
  /// In en, this message translates to:
  /// **'Another style already uses this design no.'**
  String get stylesErrorsStyleCodeTaken;

  /// No description provided for @stylesErrorsColorsAndSizesRequired.
  ///
  /// In en, this message translates to:
  /// **'Pick at least one colour and one size.'**
  String get stylesErrorsColorsAndSizesRequired;

  /// No description provided for @stylesErrorsUnknownColor.
  ///
  /// In en, this message translates to:
  /// **'That colour is not in your list.'**
  String get stylesErrorsUnknownColor;

  /// No description provided for @stylesErrorsVariantMissing.
  ///
  /// In en, this message translates to:
  /// **'This style has no item for one of those sizes in that colour. Add it first.'**
  String get stylesErrorsVariantMissing;

  /// No description provided for @stylesErrorsRatioRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter how many pieces of at least one size go in the set.'**
  String get stylesErrorsRatioRequired;

  /// No description provided for @stylesErrorsPackExists.
  ///
  /// In en, this message translates to:
  /// **'This set already exists.'**
  String get stylesErrorsPackExists;

  /// No description provided for @stylesErrorsScaleNameTaken.
  ///
  /// In en, this message translates to:
  /// **'Another size scale already has this name.'**
  String get stylesErrorsScaleNameTaken;

  /// No description provided for @stylesErrorsColorTaken.
  ///
  /// In en, this message translates to:
  /// **'Another colour already has this name or code.'**
  String get stylesErrorsColorTaken;

  /// No description provided for @stylesErrorsSizesRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter at least one size.'**
  String get stylesErrorsSizesRequired;

  /// No description provided for @stylesErrorsColorCodeRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter a code for the colour.'**
  String get stylesErrorsColorCodeRequired;

  /// No description provided for @stylesSummaryTaxonomy.
  ///
  /// In en, this message translates to:
  /// **'Design'**
  String get stylesSummaryTaxonomy;

  /// No description provided for @stylesSummaryCode.
  ///
  /// In en, this message translates to:
  /// **'Design no.'**
  String get stylesSummaryCode;

  /// No description provided for @stylesSummaryName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get stylesSummaryName;

  /// No description provided for @stylesSummaryBrand.
  ///
  /// In en, this message translates to:
  /// **'Brand'**
  String get stylesSummaryBrand;

  /// No description provided for @stylesSummaryCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get stylesSummaryCategory;

  /// No description provided for @stylesSummarySeason.
  ///
  /// In en, this message translates to:
  /// **'Season'**
  String get stylesSummarySeason;

  /// No description provided for @stylesSummaryCollection.
  ///
  /// In en, this message translates to:
  /// **'Collection'**
  String get stylesSummaryCollection;

  /// No description provided for @stylesSummarySizes.
  ///
  /// In en, this message translates to:
  /// **'Sizes'**
  String get stylesSummarySizes;

  /// No description provided for @stylesSummaryColours.
  ///
  /// In en, this message translates to:
  /// **'Colours'**
  String get stylesSummaryColours;

  /// No description provided for @stylesSummaryPricing.
  ///
  /// In en, this message translates to:
  /// **'Price and cost'**
  String get stylesSummaryPricing;

  /// No description provided for @stylesSummaryMarkup.
  ///
  /// In en, this message translates to:
  /// **'Mark-up {pct}%'**
  String stylesSummaryMarkup(String pct);

  /// No description provided for @stylesSummaryCost.
  ///
  /// In en, this message translates to:
  /// **'Purchase rate'**
  String get stylesSummaryCost;

  /// No description provided for @stylesSummarySaleRate.
  ///
  /// In en, this message translates to:
  /// **'Sale rate'**
  String get stylesSummarySaleRate;

  /// No description provided for @stylesSummaryRange.
  ///
  /// In en, this message translates to:
  /// **'{from} to {to}'**
  String stylesSummaryRange(String from, String to);

  /// No description provided for @stylesSummaryPieces.
  ///
  /// In en, this message translates to:
  /// **'Pieces in stock'**
  String get stylesSummaryPieces;

  /// No description provided for @stylesSummarySkus.
  ///
  /// In en, this message translates to:
  /// **'Colour and size pieces'**
  String get stylesSummarySkus;

  /// No description provided for @stylesSummaryValueAtCost.
  ///
  /// In en, this message translates to:
  /// **'Stock at cost'**
  String get stylesSummaryValueAtCost;

  /// No description provided for @stylesSummaryMedia.
  ///
  /// In en, this message translates to:
  /// **'Photos'**
  String get stylesSummaryMedia;

  /// No description provided for @stylesSummaryPhotos.
  ///
  /// In en, this message translates to:
  /// **'{n} on file'**
  String stylesSummaryPhotos(String n);

  /// No description provided for @stylesSummaryNoPhotos.
  ///
  /// In en, this message translates to:
  /// **'No photos yet.'**
  String get stylesSummaryNoPhotos;

  /// No description provided for @stylesSummaryManagePhotos.
  ///
  /// In en, this message translates to:
  /// **'Add or change photos'**
  String get stylesSummaryManagePhotos;

  /// No description provided for @stylesAttributes.
  ///
  /// In en, this message translates to:
  /// **'Describe the style (from your lists)'**
  String get stylesAttributes;

  /// No description provided for @catalogueTitle.
  ///
  /// In en, this message translates to:
  /// **'Image catalogue'**
  String get catalogueTitle;

  /// No description provided for @catalogueSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them.'**
  String get catalogueSubtitle;

  /// No description provided for @catalogueAllColours.
  ///
  /// In en, this message translates to:
  /// **'All colours'**
  String get catalogueAllColours;

  /// No description provided for @cataloguePhotos.
  ///
  /// In en, this message translates to:
  /// **'Photos'**
  String get cataloguePhotos;

  /// No description provided for @catalogueView.
  ///
  /// In en, this message translates to:
  /// **'View'**
  String get catalogueView;

  /// No description provided for @catalogueViewsFront.
  ///
  /// In en, this message translates to:
  /// **'Front'**
  String get catalogueViewsFront;

  /// No description provided for @catalogueViewsBack.
  ///
  /// In en, this message translates to:
  /// **'Back'**
  String get catalogueViewsBack;

  /// No description provided for @catalogueViewsDetail.
  ///
  /// In en, this message translates to:
  /// **'Detail'**
  String get catalogueViewsDetail;

  /// No description provided for @catalogueViewsModel.
  ///
  /// In en, this message translates to:
  /// **'On model'**
  String get catalogueViewsModel;

  /// No description provided for @catalogueViewsOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get catalogueViewsOther;

  /// No description provided for @catalogueUploading.
  ///
  /// In en, this message translates to:
  /// **'Uploading…'**
  String get catalogueUploading;

  /// No description provided for @catalogueAddPhotos.
  ///
  /// In en, this message translates to:
  /// **'Add photos'**
  String get catalogueAddPhotos;

  /// No description provided for @cataloguePhotoHint.
  ///
  /// In en, this message translates to:
  /// **'Photos are made smaller on this device before upload. On a phone you can take them with the camera.'**
  String get cataloguePhotoHint;

  /// No description provided for @catalogueShownFirst.
  ///
  /// In en, this message translates to:
  /// **'Shown first'**
  String get catalogueShownFirst;

  /// No description provided for @catalogueShowFirst.
  ///
  /// In en, this message translates to:
  /// **'Show first'**
  String get catalogueShowFirst;

  /// No description provided for @catalogueNoPhotos.
  ///
  /// In en, this message translates to:
  /// **'No photos yet.'**
  String get catalogueNoPhotos;

  /// No description provided for @catalogueRecords.
  ///
  /// In en, this message translates to:
  /// **'Designs shown: {n}'**
  String catalogueRecords(String n);

  /// No description provided for @catalogueTileSize.
  ///
  /// In en, this message translates to:
  /// **'Tile size'**
  String get catalogueTileSize;

  /// No description provided for @catalogueSort.
  ///
  /// In en, this message translates to:
  /// **'Sort'**
  String get catalogueSort;

  /// No description provided for @catalogueSortsCode.
  ///
  /// In en, this message translates to:
  /// **'By design no.'**
  String get catalogueSortsCode;

  /// No description provided for @catalogueSortsNewest.
  ///
  /// In en, this message translates to:
  /// **'Newest first'**
  String get catalogueSortsNewest;

  /// No description provided for @catalogueSortsBest.
  ///
  /// In en, this message translates to:
  /// **'Best sellers'**
  String get catalogueSortsBest;

  /// No description provided for @catalogueSortsPriceLow.
  ///
  /// In en, this message translates to:
  /// **'Price: low to high'**
  String get catalogueSortsPriceLow;

  /// No description provided for @catalogueSortsPriceHigh.
  ///
  /// In en, this message translates to:
  /// **'Price: high to low'**
  String get catalogueSortsPriceHigh;

  /// No description provided for @catalogueSortsStock.
  ///
  /// In en, this message translates to:
  /// **'Most stock'**
  String get catalogueSortsStock;

  /// No description provided for @catalogueCart.
  ///
  /// In en, this message translates to:
  /// **'Cart ({n})'**
  String catalogueCart(String n);

  /// No description provided for @catalogueNoPhoto.
  ///
  /// In en, this message translates to:
  /// **'No photo'**
  String get catalogueNoPhoto;

  /// No description provided for @catalogueStock.
  ///
  /// In en, this message translates to:
  /// **'Stock: {n}'**
  String catalogueStock(String n);

  /// No description provided for @catalogueSold.
  ///
  /// In en, this message translates to:
  /// **'Sold in 90 days: {n}'**
  String catalogueSold(String n);

  /// No description provided for @catalogueAdded.
  ///
  /// In en, this message translates to:
  /// **'In cart'**
  String get catalogueAdded;

  /// No description provided for @catalogueAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get catalogueAdd;

  /// No description provided for @catalogueNone.
  ///
  /// In en, this message translates to:
  /// **'No designs match these filters.'**
  String get catalogueNone;

  /// No description provided for @cataloguePrevious.
  ///
  /// In en, this message translates to:
  /// **'Previous'**
  String get cataloguePrevious;

  /// No description provided for @catalogueNext.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get catalogueNext;

  /// No description provided for @catalogueShowing.
  ///
  /// In en, this message translates to:
  /// **'{from} to {to} of {total}'**
  String catalogueShowing(String from, String to, String total);

  /// No description provided for @catalogueSelections.
  ///
  /// In en, this message translates to:
  /// **'Saved selections'**
  String get catalogueSelections;

  /// No description provided for @catalogueDesigns.
  ///
  /// In en, this message translates to:
  /// **'Designs: {n}'**
  String catalogueDesigns(String n);

  /// No description provided for @catalogueSharedBadge.
  ///
  /// In en, this message translates to:
  /// **'link live'**
  String get catalogueSharedBadge;

  /// No description provided for @catalogueNoSelections.
  ///
  /// In en, this message translates to:
  /// **'No selections yet. Add designs to the cart and save them.'**
  String get catalogueNoSelections;

  /// No description provided for @catalogueSearch.
  ///
  /// In en, this message translates to:
  /// **'Barcode, design or name'**
  String get catalogueSearch;

  /// No description provided for @cataloguePriceFor.
  ///
  /// In en, this message translates to:
  /// **'Prices for'**
  String get cataloguePriceFor;

  /// No description provided for @catalogueSaleRate.
  ///
  /// In en, this message translates to:
  /// **'Sale rate'**
  String get catalogueSaleRate;

  /// No description provided for @catalogueInStockOnly.
  ///
  /// In en, this message translates to:
  /// **'In stock only'**
  String get catalogueInStockOnly;

  /// No description provided for @catalogueWithPhotoOnly.
  ///
  /// In en, this message translates to:
  /// **'With photo only'**
  String get catalogueWithPhotoOnly;

  /// No description provided for @catalogueRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get catalogueRate;

  /// No description provided for @catalogueRateFrom.
  ///
  /// In en, this message translates to:
  /// **'Rate from'**
  String get catalogueRateFrom;

  /// No description provided for @catalogueRateTo.
  ///
  /// In en, this message translates to:
  /// **'Rate up to'**
  String get catalogueRateTo;

  /// No description provided for @catalogueReceived.
  ///
  /// In en, this message translates to:
  /// **'Received between'**
  String get catalogueReceived;

  /// No description provided for @catalogueReceivedFrom.
  ///
  /// In en, this message translates to:
  /// **'Received from'**
  String get catalogueReceivedFrom;

  /// No description provided for @catalogueReceivedTo.
  ///
  /// In en, this message translates to:
  /// **'Received up to'**
  String get catalogueReceivedTo;

  /// No description provided for @catalogueApply.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get catalogueApply;

  /// No description provided for @catalogueBrand.
  ///
  /// In en, this message translates to:
  /// **'Brand'**
  String get catalogueBrand;

  /// No description provided for @catalogueCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get catalogueCategory;

  /// No description provided for @catalogueSeason.
  ///
  /// In en, this message translates to:
  /// **'Season'**
  String get catalogueSeason;

  /// No description provided for @catalogueClear.
  ///
  /// In en, this message translates to:
  /// **'Clear filters'**
  String get catalogueClear;

  /// No description provided for @catalogueDefaultName.
  ///
  /// In en, this message translates to:
  /// **'For {party}'**
  String catalogueDefaultName(String party);

  /// No description provided for @catalogueUntitled.
  ///
  /// In en, this message translates to:
  /// **'New selection'**
  String get catalogueUntitled;

  /// No description provided for @catalogueCartTitle.
  ///
  /// In en, this message translates to:
  /// **'Cart'**
  String get catalogueCartTitle;

  /// No description provided for @catalogueCartEmpty.
  ///
  /// In en, this message translates to:
  /// **'The cart is empty. Press Add on a design.'**
  String get catalogueCartEmpty;

  /// No description provided for @catalogueSelectionName.
  ///
  /// In en, this message translates to:
  /// **'Selection name'**
  String get catalogueSelectionName;

  /// No description provided for @catalogueForParty.
  ///
  /// In en, this message translates to:
  /// **'For party'**
  String get catalogueForParty;

  /// No description provided for @catalogueAnyone.
  ///
  /// In en, this message translates to:
  /// **'Anyone'**
  String get catalogueAnyone;

  /// No description provided for @catalogueSaveSelection.
  ///
  /// In en, this message translates to:
  /// **'Save selection'**
  String get catalogueSaveSelection;

  /// No description provided for @catalogueEmptyCart.
  ///
  /// In en, this message translates to:
  /// **'Empty cart'**
  String get catalogueEmptyCart;

  /// No description provided for @catalogueColsCode.
  ///
  /// In en, this message translates to:
  /// **'Design no.'**
  String get catalogueColsCode;

  /// No description provided for @catalogueColsName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get catalogueColsName;

  /// No description provided for @catalogueColsSize.
  ///
  /// In en, this message translates to:
  /// **'Size'**
  String get catalogueColsSize;

  /// No description provided for @catalogueColsRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get catalogueColsRate;

  /// No description provided for @catalogueColsMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP'**
  String get catalogueColsMrp;

  /// No description provided for @catalogueColsStock.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get catalogueColsStock;

  /// No description provided for @cataloguePrintPdf.
  ///
  /// In en, this message translates to:
  /// **'Print or PDF'**
  String get cataloguePrintPdf;

  /// No description provided for @catalogueExportExcel.
  ///
  /// In en, this message translates to:
  /// **'Export to Excel'**
  String get catalogueExportExcel;

  /// No description provided for @catalogueShowPrices.
  ///
  /// In en, this message translates to:
  /// **'Show prices'**
  String get catalogueShowPrices;

  /// No description provided for @catalogueShowStock.
  ///
  /// In en, this message translates to:
  /// **'Show sizes in stock'**
  String get catalogueShowStock;

  /// No description provided for @catalogueDeleteConfirm.
  ///
  /// In en, this message translates to:
  /// **'Delete this selection? A shared link stops working.'**
  String get catalogueDeleteConfirm;

  /// No description provided for @catalogueDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete selection'**
  String get catalogueDelete;

  /// No description provided for @catalogueShareTitle.
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get catalogueShareTitle;

  /// No description provided for @catalogueSharedUntil.
  ///
  /// In en, this message translates to:
  /// **'A link is live until {date}. Making a new one stops the old one.'**
  String catalogueSharedUntil(String date);

  /// No description provided for @catalogueShareHint.
  ///
  /// In en, this message translates to:
  /// **'Make a link that opens this catalogue without signing in, then copy it or send it on WhatsApp.'**
  String get catalogueShareHint;

  /// No description provided for @catalogueLinkWorksFor.
  ///
  /// In en, this message translates to:
  /// **'Link works for'**
  String get catalogueLinkWorksFor;

  /// No description provided for @catalogueDays.
  ///
  /// In en, this message translates to:
  /// **'{n} days'**
  String catalogueDays(String n);

  /// No description provided for @catalogueNewLink.
  ///
  /// In en, this message translates to:
  /// **'Make a new link'**
  String get catalogueNewLink;

  /// No description provided for @catalogueMakeLink.
  ///
  /// In en, this message translates to:
  /// **'Make a link'**
  String get catalogueMakeLink;

  /// No description provided for @catalogueStopSharing.
  ///
  /// In en, this message translates to:
  /// **'Stop sharing'**
  String get catalogueStopSharing;

  /// No description provided for @catalogueLink.
  ///
  /// In en, this message translates to:
  /// **'Link'**
  String get catalogueLink;

  /// No description provided for @catalogueCopied.
  ///
  /// In en, this message translates to:
  /// **'Link copied.'**
  String get catalogueCopied;

  /// No description provided for @catalogueCopy.
  ///
  /// In en, this message translates to:
  /// **'Copy'**
  String get catalogueCopy;

  /// No description provided for @catalogueWhatsappTo.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp number'**
  String get catalogueWhatsappTo;

  /// No description provided for @catalogueSentDemo.
  ///
  /// In en, this message translates to:
  /// **'Recorded as sent to {to} (demo: no WhatsApp provider is set up yet).'**
  String catalogueSentDemo(String to);

  /// No description provided for @catalogueSent.
  ///
  /// In en, this message translates to:
  /// **'Sent to {to} on WhatsApp.'**
  String catalogueSent(String to);

  /// No description provided for @catalogueSendWhatsapp.
  ///
  /// In en, this message translates to:
  /// **'Send on WhatsApp'**
  String get catalogueSendWhatsapp;

  /// No description provided for @catalogueOrderHint.
  ///
  /// In en, this message translates to:
  /// **'Type quantities by size to make a sales order for {party}.'**
  String catalogueOrderHint(String party);

  /// No description provided for @catalogueMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP {v}'**
  String catalogueMrp(String v);

  /// No description provided for @catalogueOrderTotal.
  ///
  /// In en, this message translates to:
  /// **'Pieces: {pieces}, value {value} before tax'**
  String catalogueOrderTotal(String pieces, String value);

  /// No description provided for @catalogueOrderNarration.
  ///
  /// In en, this message translates to:
  /// **'From catalogue selection {name}'**
  String catalogueOrderNarration(String name);

  /// No description provided for @catalogueMakeOrder.
  ///
  /// In en, this message translates to:
  /// **'Make sales order'**
  String get catalogueMakeOrder;

  /// No description provided for @catalogueForPartyLine.
  ///
  /// In en, this message translates to:
  /// **'For {party}'**
  String catalogueForPartyLine(String party);

  /// No description provided for @catalogueSelectionSubtitle.
  ///
  /// In en, this message translates to:
  /// **'A catalogue selection'**
  String get catalogueSelectionSubtitle;

  /// No description provided for @catalogueLinkExpiredTitle.
  ///
  /// In en, this message translates to:
  /// **'This catalogue is no longer shared'**
  String get catalogueLinkExpiredTitle;

  /// No description provided for @catalogueLinkExpired.
  ///
  /// In en, this message translates to:
  /// **'The link has expired or was replaced. Ask the sender for a new one.'**
  String get catalogueLinkExpired;

  /// No description provided for @catalogueErrorsUnknownStyle.
  ///
  /// In en, this message translates to:
  /// **'That design no longer exists.'**
  String get catalogueErrorsUnknownStyle;

  /// No description provided for @catalogueErrorsUnknownColor.
  ///
  /// In en, this message translates to:
  /// **'This design has no such colour.'**
  String get catalogueErrorsUnknownColor;

  /// No description provided for @catalogueErrorsUnknownFile.
  ///
  /// In en, this message translates to:
  /// **'The photo did not upload. Try again.'**
  String get catalogueErrorsUnknownFile;

  /// No description provided for @catalogueErrorsFileType.
  ///
  /// In en, this message translates to:
  /// **'Use a JPEG, PNG or WebP photo.'**
  String get catalogueErrorsFileType;

  /// No description provided for @catalogueErrorsFileTooLarge.
  ///
  /// In en, this message translates to:
  /// **'The photo is too large.'**
  String get catalogueErrorsFileTooLarge;

  /// No description provided for @catalogueErrorsFileEmpty.
  ///
  /// In en, this message translates to:
  /// **'The photo is empty.'**
  String get catalogueErrorsFileEmpty;

  /// No description provided for @catalogueErrorsDuplicateImage.
  ///
  /// In en, this message translates to:
  /// **'This photo is already on this design and colour.'**
  String get catalogueErrorsDuplicateImage;

  /// No description provided for @catalogueErrorsNoLines.
  ///
  /// In en, this message translates to:
  /// **'Add at least one design.'**
  String get catalogueErrorsNoLines;

  /// No description provided for @catalogueErrorsDuplicateLine.
  ///
  /// In en, this message translates to:
  /// **'A design and colour is in the list twice.'**
  String get catalogueErrorsDuplicateLine;

  /// No description provided for @catalogueErrorsUnknownAccount.
  ///
  /// In en, this message translates to:
  /// **'Pick a party from the list.'**
  String get catalogueErrorsUnknownAccount;

  /// No description provided for @catalogueErrorsInvalidDays.
  ///
  /// In en, this message translates to:
  /// **'A link can last 1 to 90 days.'**
  String get catalogueErrorsInvalidDays;

  /// No description provided for @catalogueErrorsShareLinkStale.
  ///
  /// In en, this message translates to:
  /// **'That link is no longer live. Make a new link first.'**
  String get catalogueErrorsShareLinkStale;

  /// No description provided for @catalogueErrorsInvalidPhone.
  ///
  /// In en, this message translates to:
  /// **'Enter a 10-digit Indian mobile number.'**
  String get catalogueErrorsInvalidPhone;

  /// No description provided for @catalogueErrorsSendFailed.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp did not accept the message. Try again later.'**
  String get catalogueErrorsSendFailed;

  /// No description provided for @labelsTitle.
  ///
  /// In en, this message translates to:
  /// **'Barcode and price labels'**
  String get labelsTitle;

  /// No description provided for @labelsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Print tags with the barcode, MRP and size on label rolls, A4 sheets or hang tags.'**
  String get labelsSubtitle;

  /// No description provided for @labelsSearch.
  ///
  /// In en, this message translates to:
  /// **'Scan a barcode or type a name'**
  String get labelsSearch;

  /// No description provided for @labelsWholeDesign.
  ///
  /// In en, this message translates to:
  /// **'A whole design'**
  String get labelsWholeDesign;

  /// No description provided for @labelsAddOneEach.
  ///
  /// In en, this message translates to:
  /// **'One of each size'**
  String get labelsAddOneEach;

  /// No description provided for @labelsAddStock.
  ///
  /// In en, this message translates to:
  /// **'One per piece in stock'**
  String get labelsAddStock;

  /// No description provided for @labelsItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get labelsItem;

  /// No description provided for @labelsBarcode.
  ///
  /// In en, this message translates to:
  /// **'Barcode'**
  String get labelsBarcode;

  /// No description provided for @labelsMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP'**
  String get labelsMrp;

  /// No description provided for @labelsPrice.
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get labelsPrice;

  /// No description provided for @labelsLabels.
  ///
  /// In en, this message translates to:
  /// **'Labels'**
  String get labelsLabels;

  /// No description provided for @labelsNoBarcode.
  ///
  /// In en, this message translates to:
  /// **'none'**
  String get labelsNoBarcode;

  /// No description provided for @labelsRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get labelsRemove;

  /// No description provided for @labelsEmpty.
  ///
  /// In en, this message translates to:
  /// **'Scan or search items, or pick a design, to add labels.'**
  String get labelsEmpty;

  /// No description provided for @labelsStock.
  ///
  /// In en, this message translates to:
  /// **'Label stock'**
  String get labelsStock;

  /// No description provided for @labelsTemplatesRoll50x25.
  ///
  /// In en, this message translates to:
  /// **'Roll, 50 x 25 mm, one across'**
  String get labelsTemplatesRoll50x25;

  /// No description provided for @labelsTemplatesRoll38x25x2.
  ///
  /// In en, this message translates to:
  /// **'Roll, 38 x 25 mm, two across'**
  String get labelsTemplatesRoll38x25x2;

  /// No description provided for @labelsTemplatesA4x65.
  ///
  /// In en, this message translates to:
  /// **'A4 sheet, 65 labels (38.1 x 21.2 mm)'**
  String get labelsTemplatesA4x65;

  /// No description provided for @labelsTemplatesTag50x75.
  ///
  /// In en, this message translates to:
  /// **'Hang tag, 50 x 75 mm'**
  String get labelsTemplatesTag50x75;

  /// No description provided for @labelsFieldsBusiness.
  ///
  /// In en, this message translates to:
  /// **'Business name'**
  String get labelsFieldsBusiness;

  /// No description provided for @labelsFieldsName.
  ///
  /// In en, this message translates to:
  /// **'Item name'**
  String get labelsFieldsName;

  /// No description provided for @labelsFieldsDesign.
  ///
  /// In en, this message translates to:
  /// **'Design no.'**
  String get labelsFieldsDesign;

  /// No description provided for @labelsFieldsColourSize.
  ///
  /// In en, this message translates to:
  /// **'Colour and size'**
  String get labelsFieldsColourSize;

  /// No description provided for @labelsFieldsMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP'**
  String get labelsFieldsMrp;

  /// No description provided for @labelsFieldsPrice.
  ///
  /// In en, this message translates to:
  /// **'Selling price'**
  String get labelsFieldsPrice;

  /// No description provided for @labelsFieldsExtra.
  ///
  /// In en, this message translates to:
  /// **'Extra line'**
  String get labelsFieldsExtra;

  /// No description provided for @labelsExtraText.
  ///
  /// In en, this message translates to:
  /// **'Extra line text'**
  String get labelsExtraText;

  /// No description provided for @labelsExtraHint.
  ///
  /// In en, this message translates to:
  /// **'For example the month of manufacture or the maker\'s address.'**
  String get labelsExtraHint;

  /// No description provided for @labelsPreview.
  ///
  /// In en, this message translates to:
  /// **'Preview at actual size'**
  String get labelsPreview;

  /// No description provided for @labelsPreviewEmpty.
  ///
  /// In en, this message translates to:
  /// **'Add an item to see a label.'**
  String get labelsPreviewEmpty;

  /// No description provided for @labelsPrint.
  ///
  /// In en, this message translates to:
  /// **'Print {n} labels'**
  String labelsPrint(String n);

  /// No description provided for @labelsPrintHint.
  ///
  /// In en, this message translates to:
  /// **'The print window opens at the label size; choose the label printer and set margins to none.'**
  String get labelsPrintHint;

  /// No description provided for @labelsNothingToPrint.
  ///
  /// In en, this message translates to:
  /// **'Nothing to print. Choose the labels in Inventory, then press Print.'**
  String get labelsNothingToPrint;

  /// No description provided for @labelsForBill.
  ///
  /// In en, this message translates to:
  /// **'Print labels for these goods'**
  String get labelsForBill;

  /// No description provided for @labelsPrintLabels.
  ///
  /// In en, this message translates to:
  /// **'Print labels'**
  String get labelsPrintLabels;

  /// No description provided for @shareSendWhatsApp.
  ///
  /// In en, this message translates to:
  /// **'Send on WhatsApp'**
  String get shareSendWhatsApp;

  /// No description provided for @shareSend.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get shareSend;

  /// No description provided for @shareMobile.
  ///
  /// In en, this message translates to:
  /// **'Mobile number'**
  String get shareMobile;

  /// No description provided for @shareSentTo.
  ///
  /// In en, this message translates to:
  /// **'Sent on WhatsApp to {to}'**
  String shareSentTo(String to);

  /// No description provided for @shareAgain.
  ///
  /// In en, this message translates to:
  /// **'Send again'**
  String get shareAgain;

  /// No description provided for @shareFailed.
  ///
  /// In en, this message translates to:
  /// **'Not sent. Check the number and try again.'**
  String get shareFailed;

  /// No description provided for @shareAutoFailed.
  ///
  /// In en, this message translates to:
  /// **'The bill could not go on WhatsApp by itself. Send it again.'**
  String get shareAutoFailed;

  /// No description provided for @shareRemind.
  ///
  /// In en, this message translates to:
  /// **'Remind'**
  String get shareRemind;

  /// No description provided for @shareRemindAll.
  ///
  /// In en, this message translates to:
  /// **'Remind everyone overdue'**
  String get shareRemindAll;

  /// No description provided for @shareRemindAllConfirm.
  ///
  /// In en, this message translates to:
  /// **'Send a payment reminder on WhatsApp to every customer with overdue bills?'**
  String get shareRemindAllConfirm;

  /// No description provided for @shareReminded.
  ///
  /// In en, this message translates to:
  /// **'Reminder sent'**
  String get shareReminded;

  /// No description provided for @shareRemindedAll.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, =0 {No reminders sent} one {{n} reminder sent} other {{n} reminders sent}}'**
  String shareRemindedAll(num n);

  /// No description provided for @shareNoPhone.
  ///
  /// In en, this message translates to:
  /// **'No mobile number, call them: {names}'**
  String shareNoPhone(String names);

  /// No description provided for @shareLogTitle.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp log'**
  String get shareLogTitle;

  /// No description provided for @shareLogSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every bill, invoice, reminder and message sent to customers, newest first.'**
  String get shareLogSubtitle;

  /// No description provided for @shareFilterAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get shareFilterAll;

  /// No description provided for @shareFilterSent.
  ///
  /// In en, this message translates to:
  /// **'Sent'**
  String get shareFilterSent;

  /// No description provided for @shareFilterFailed.
  ///
  /// In en, this message translates to:
  /// **'Failed'**
  String get shareFilterFailed;

  /// No description provided for @shareThisMonth.
  ///
  /// In en, this message translates to:
  /// **'Counts are for this month'**
  String get shareThisMonth;

  /// No description provided for @shareWhen.
  ///
  /// In en, this message translates to:
  /// **'When'**
  String get shareWhen;

  /// No description provided for @shareToCol.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get shareToCol;

  /// No description provided for @shareKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get shareKind;

  /// No description provided for @shareMessage.
  ///
  /// In en, this message translates to:
  /// **'Message'**
  String get shareMessage;

  /// No description provided for @shareStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get shareStatus;

  /// No description provided for @shareBy.
  ///
  /// In en, this message translates to:
  /// **'by {name}'**
  String shareBy(String name);

  /// No description provided for @shareNone.
  ///
  /// In en, this message translates to:
  /// **'No messages yet. Bills, invoices and reminders you send on WhatsApp will show here.'**
  String get shareNone;

  /// No description provided for @shareKindsBillShare.
  ///
  /// In en, this message translates to:
  /// **'Counter bill'**
  String get shareKindsBillShare;

  /// No description provided for @shareKindsInvoiceShare.
  ///
  /// In en, this message translates to:
  /// **'Invoice'**
  String get shareKindsInvoiceShare;

  /// No description provided for @shareKindsPaymentReminderLink.
  ///
  /// In en, this message translates to:
  /// **'Payment reminder'**
  String get shareKindsPaymentReminderLink;

  /// No description provided for @shareKindsPaymentReminder.
  ///
  /// In en, this message translates to:
  /// **'Payment reminder'**
  String get shareKindsPaymentReminder;

  /// No description provided for @shareKindsOrderConfirmation.
  ///
  /// In en, this message translates to:
  /// **'Order confirmation'**
  String get shareKindsOrderConfirmation;

  /// No description provided for @shareKindsFollowUp.
  ///
  /// In en, this message translates to:
  /// **'Follow-up'**
  String get shareKindsFollowUp;

  /// No description provided for @shareExpiredTitle.
  ///
  /// In en, this message translates to:
  /// **'This link is no longer active'**
  String get shareExpiredTitle;

  /// No description provided for @shareExpired.
  ///
  /// In en, this message translates to:
  /// **'The link has expired. Ask the shop to send it again.'**
  String get shareExpired;

  /// No description provided for @shareStatement.
  ///
  /// In en, this message translates to:
  /// **'Statement'**
  String get shareStatement;

  /// No description provided for @shareStatementFor.
  ///
  /// In en, this message translates to:
  /// **'Statement for {name}'**
  String shareStatementFor(String name);

  /// No description provided for @shareAsOf.
  ///
  /// In en, this message translates to:
  /// **'As on {date}'**
  String shareAsOf(String date);

  /// No description provided for @shareBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance due'**
  String get shareBalance;

  /// No description provided for @shareOverdue.
  ///
  /// In en, this message translates to:
  /// **'₹{amount} overdue'**
  String shareOverdue(String amount);

  /// No description provided for @shareBill.
  ///
  /// In en, this message translates to:
  /// **'Bill'**
  String get shareBill;

  /// No description provided for @shareDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get shareDate;

  /// No description provided for @shareDue.
  ///
  /// In en, this message translates to:
  /// **'Due on'**
  String get shareDue;

  /// No description provided for @shareLate.
  ///
  /// In en, this message translates to:
  /// **'Late by'**
  String get shareLate;

  /// No description provided for @shareAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get shareAmount;

  /// No description provided for @shareDays.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day} other {{n} days}}'**
  String shareDays(num n);

  /// No description provided for @shareNotDue.
  ///
  /// In en, this message translates to:
  /// **'Not due'**
  String get shareNotDue;

  /// No description provided for @shareNothingOpen.
  ///
  /// In en, this message translates to:
  /// **'Nothing is due. Thank you.'**
  String get shareNothingOpen;

  /// No description provided for @shareAdvance.
  ///
  /// In en, this message translates to:
  /// **'Less advance paid: ₹{amount}'**
  String shareAdvance(String amount);

  /// No description provided for @sharePayTo.
  ///
  /// In en, this message translates to:
  /// **'Pay to'**
  String get sharePayTo;

  /// No description provided for @shareStatementNote.
  ///
  /// In en, this message translates to:
  /// **'If you have already paid, please ignore this statement or share the payment details with us.'**
  String get shareStatementNote;

  /// No description provided for @shareErrorsInvalidPhone.
  ///
  /// In en, this message translates to:
  /// **'Enter a 10-digit mobile number.'**
  String get shareErrorsInvalidPhone;

  /// No description provided for @shareErrorsNothingOutstanding.
  ///
  /// In en, this message translates to:
  /// **'Nothing is outstanding.'**
  String get shareErrorsNothingOutstanding;

  /// No description provided for @shareErrorsSendFailed.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp did not accept the message. Try again.'**
  String get shareErrorsSendFailed;

  /// No description provided for @shareErrorsOutside24hWindow.
  ///
  /// In en, this message translates to:
  /// **'This customer has not messaged in 24 hours, so WhatsApp needs an approved template. Add its approved name under Message templates.'**
  String get shareErrorsOutside24hWindow;

  /// No description provided for @shareErrorsBillVoid.
  ///
  /// In en, this message translates to:
  /// **'This bill was cancelled.'**
  String get shareErrorsBillVoid;

  /// No description provided for @shareErrorsInvoiceCancelled.
  ///
  /// In en, this message translates to:
  /// **'This invoice was cancelled.'**
  String get shareErrorsInvoiceCancelled;

  /// No description provided for @shareErrorsUnknownTemplate.
  ///
  /// In en, this message translates to:
  /// **'The message template was archived. Restore it under Message templates.'**
  String get shareErrorsUnknownTemplate;

  /// No description provided for @launcherTitle.
  ///
  /// In en, this message translates to:
  /// **'All actions'**
  String get launcherTitle;

  /// No description provided for @launcherSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every entry, screen and report in one place. The star pins a tile to My Menu.'**
  String get launcherSubtitle;

  /// No description provided for @launcherFilter.
  ///
  /// In en, this message translates to:
  /// **'Type to find an action'**
  String get launcherFilter;

  /// No description provided for @launcherPin.
  ///
  /// In en, this message translates to:
  /// **'Add to My Menu'**
  String get launcherPin;

  /// No description provided for @launcherUnpin.
  ///
  /// In en, this message translates to:
  /// **'Remove from My Menu'**
  String get launcherUnpin;

  /// No description provided for @launcherSaveFailed.
  ///
  /// In en, this message translates to:
  /// **'Could not save My Menu. Try again.'**
  String get launcherSaveFailed;

  /// No description provided for @launcherNoMatch.
  ///
  /// In en, this message translates to:
  /// **'Nothing matches that.'**
  String get launcherNoMatch;

  /// No description provided for @launcherDone.
  ///
  /// In en, this message translates to:
  /// **'Done'**
  String get launcherDone;

  /// No description provided for @launcherEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit tiles'**
  String get launcherEdit;

  /// No description provided for @launcherAddTiles.
  ///
  /// In en, this message translates to:
  /// **'Add tiles'**
  String get launcherAddTiles;

  /// No description provided for @launcherReset.
  ///
  /// In en, this message translates to:
  /// **'Back to the default tiles'**
  String get launcherReset;

  /// No description provided for @launcherMoveLeft.
  ///
  /// In en, this message translates to:
  /// **'Move earlier'**
  String get launcherMoveLeft;

  /// No description provided for @launcherMoveRight.
  ///
  /// In en, this message translates to:
  /// **'Move later'**
  String get launcherMoveRight;

  /// No description provided for @launcherEmpty.
  ///
  /// In en, this message translates to:
  /// **'No tiles yet. Add some from All actions.'**
  String get launcherEmpty;

  /// No description provided for @launcherMyMenu.
  ///
  /// In en, this message translates to:
  /// **'My Menu'**
  String get launcherMyMenu;

  /// No description provided for @launcherMyMenuSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Hello {name}. Your own tiles; change them with Edit tiles.'**
  String launcherMyMenuSubtitle(String name);

  /// No description provided for @launcherWaiting.
  ///
  /// In en, this message translates to:
  /// **'Waiting for you'**
  String get launcherWaiting;

  /// No description provided for @launcherSalesToday.
  ///
  /// In en, this message translates to:
  /// **'Sales today'**
  String get launcherSalesToday;

  /// No description provided for @launcherToCollect.
  ///
  /// In en, this message translates to:
  /// **'To collect'**
  String get launcherToCollect;

  /// No description provided for @launcherToPay.
  ///
  /// In en, this message translates to:
  /// **'To pay'**
  String get launcherToPay;

  /// No description provided for @launcherOverdue.
  ///
  /// In en, this message translates to:
  /// **'{amount} overdue'**
  String launcherOverdue(String amount);

  /// No description provided for @launcherFullDashboard.
  ///
  /// In en, this message translates to:
  /// **'Full dashboard'**
  String get launcherFullDashboard;

  /// No description provided for @launcherGroupsEntries.
  ///
  /// In en, this message translates to:
  /// **'New entry'**
  String get launcherGroupsEntries;

  /// No description provided for @launcherGroupsPos.
  ///
  /// In en, this message translates to:
  /// **'Showroom counter'**
  String get launcherGroupsPos;

  /// No description provided for @launcherGroupsSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get launcherGroupsSales;

  /// No description provided for @launcherGroupsPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get launcherGroupsPurchase;

  /// No description provided for @launcherGroupsInventory.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get launcherGroupsInventory;

  /// No description provided for @launcherGroupsManufacturing.
  ///
  /// In en, this message translates to:
  /// **'Production and job work'**
  String get launcherGroupsManufacturing;

  /// No description provided for @launcherGroupsAccounts.
  ///
  /// In en, this message translates to:
  /// **'Accounts and GST'**
  String get launcherGroupsAccounts;

  /// No description provided for @launcherGroupsBanking.
  ///
  /// In en, this message translates to:
  /// **'Banking'**
  String get launcherGroupsBanking;

  /// No description provided for @launcherGroupsReports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get launcherGroupsReports;

  /// No description provided for @launcherGroupsCrm.
  ///
  /// In en, this message translates to:
  /// **'Customers and WhatsApp'**
  String get launcherGroupsCrm;

  /// No description provided for @launcherGroupsHr.
  ///
  /// In en, this message translates to:
  /// **'Staff and payroll'**
  String get launcherGroupsHr;

  /// No description provided for @launcherGroupsExpenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get launcherGroupsExpenses;

  /// No description provided for @launcherGroupsAssets.
  ///
  /// In en, this message translates to:
  /// **'Fixed assets'**
  String get launcherGroupsAssets;

  /// No description provided for @launcherGroupsProjects.
  ///
  /// In en, this message translates to:
  /// **'Projects'**
  String get launcherGroupsProjects;

  /// No description provided for @launcherGroupsHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get launcherGroupsHome;

  /// No description provided for @launcherGroupsSettings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get launcherGroupsSettings;

  /// No description provided for @launcherLaunchpad.
  ///
  /// In en, this message translates to:
  /// **'Launchpad'**
  String get launcherLaunchpad;

  /// No description provided for @launcherPinned.
  ///
  /// In en, this message translates to:
  /// **'{n} pinned'**
  String launcherPinned(String n);

  /// No description provided for @launcherRecent.
  ///
  /// In en, this message translates to:
  /// **'Recently opened'**
  String get launcherRecent;

  /// No description provided for @launcherMoney.
  ///
  /// In en, this message translates to:
  /// **'Today\'s money'**
  String get launcherMoney;

  /// No description provided for @launcherVsYesterday.
  ///
  /// In en, this message translates to:
  /// **'{pct}% on yesterday'**
  String launcherVsYesterday(String pct);

  /// No description provided for @launcherCounterBills.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} counter bill} other {{n} counter bills}}'**
  String launcherCounterBills(num n);

  /// No description provided for @launcherCashToday.
  ///
  /// In en, this message translates to:
  /// **'Cash at the counters'**
  String get launcherCashToday;

  /// No description provided for @launcherUpiToday.
  ///
  /// In en, this message translates to:
  /// **'UPI at the counters'**
  String get launcherUpiToday;

  /// No description provided for @launcherCardToday.
  ///
  /// In en, this message translates to:
  /// **'Card at the counters'**
  String get launcherCardToday;

  /// No description provided for @launcherOverdueToCollect.
  ///
  /// In en, this message translates to:
  /// **'Overdue to collect'**
  String get launcherOverdueToCollect;

  /// No description provided for @launcherAllTab.
  ///
  /// In en, this message translates to:
  /// **'Everything'**
  String get launcherAllTab;

  /// No description provided for @launcherGridView.
  ///
  /// In en, this message translates to:
  /// **'Tiles'**
  String get launcherGridView;

  /// No description provided for @launcherListView.
  ///
  /// In en, this message translates to:
  /// **'List'**
  String get launcherListView;

  /// No description provided for @launcherOpen.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get launcherOpen;

  /// No description provided for @launcherCount.
  ///
  /// In en, this message translates to:
  /// **'{n} screens and entries you can open'**
  String launcherCount(String n);

  /// No description provided for @menuHMasters.
  ///
  /// In en, this message translates to:
  /// **'Masters'**
  String get menuHMasters;

  /// No description provided for @menuHTransaction.
  ///
  /// In en, this message translates to:
  /// **'Transaction'**
  String get menuHTransaction;

  /// No description provided for @menuHReports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get menuHReports;

  /// No description provided for @menuHAccountReports.
  ///
  /// In en, this message translates to:
  /// **'Account Reports'**
  String get menuHAccountReports;

  /// No description provided for @menuHPayroll.
  ///
  /// In en, this message translates to:
  /// **'Payroll'**
  String get menuHPayroll;

  /// No description provided for @menuHUtility.
  ///
  /// In en, this message translates to:
  /// **'Utility'**
  String get menuHUtility;

  /// No description provided for @menuHChat.
  ///
  /// In en, this message translates to:
  /// **'Chat'**
  String get menuHChat;

  /// No description provided for @menuHExit.
  ///
  /// In en, this message translates to:
  /// **'Exit'**
  String get menuHExit;

  /// No description provided for @menuSoon.
  ///
  /// In en, this message translates to:
  /// **'Soon'**
  String get menuSoon;

  /// No description provided for @menuNotBuilt.
  ///
  /// In en, this message translates to:
  /// **'Not built yet; on the build list.'**
  String get menuNotBuilt;

  /// No description provided for @menuFilter.
  ///
  /// In en, this message translates to:
  /// **'Filter'**
  String get menuFilter;

  /// No description provided for @menuHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get menuHome;

  /// No description provided for @menuOpenScreens.
  ///
  /// In en, this message translates to:
  /// **'Open screens'**
  String get menuOpenScreens;

  /// No description provided for @menuGAccount.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get menuGAccount;

  /// No description provided for @menuGStock.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get menuGStock;

  /// No description provided for @menuGParameters.
  ///
  /// In en, this message translates to:
  /// **'Parameters'**
  String get menuGParameters;

  /// No description provided for @menuGPromotion.
  ///
  /// In en, this message translates to:
  /// **'Promotion Master'**
  String get menuGPromotion;

  /// No description provided for @menuGSales.
  ///
  /// In en, this message translates to:
  /// **'Sales Transaction'**
  String get menuGSales;

  /// No description provided for @menuGAccounting.
  ///
  /// In en, this message translates to:
  /// **'Accounting Transaction'**
  String get menuGAccounting;

  /// No description provided for @menuGPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase Transaction'**
  String get menuGPurchase;

  /// No description provided for @menuGJobwork.
  ///
  /// In en, this message translates to:
  /// **'Jobwork Transaction'**
  String get menuGJobwork;

  /// No description provided for @menuGOther.
  ///
  /// In en, this message translates to:
  /// **'Other Transaction'**
  String get menuGOther;

  /// No description provided for @menuGSalesReports.
  ///
  /// In en, this message translates to:
  /// **'Sales Reports'**
  String get menuGSalesReports;

  /// No description provided for @menuGStockReports.
  ///
  /// In en, this message translates to:
  /// **'Stock Reports'**
  String get menuGStockReports;

  /// No description provided for @menuGCustomReports.
  ///
  /// In en, this message translates to:
  /// **'Custom Reports and Checks'**
  String get menuGCustomReports;

  /// No description provided for @menuGAccountReportsGroup.
  ///
  /// In en, this message translates to:
  /// **'Account Reports Group'**
  String get menuGAccountReportsGroup;

  /// No description provided for @menuGFinalReportGroup.
  ///
  /// In en, this message translates to:
  /// **'Final Report Group'**
  String get menuGFinalReportGroup;

  /// No description provided for @menuGMasterGroup.
  ///
  /// In en, this message translates to:
  /// **'Master Group'**
  String get menuGMasterGroup;

  /// No description provided for @menuGPayrollTransactionGroup.
  ///
  /// In en, this message translates to:
  /// **'Payroll Transaction Group'**
  String get menuGPayrollTransactionGroup;

  /// No description provided for @menuGReportGroup.
  ///
  /// In en, this message translates to:
  /// **'Report Group'**
  String get menuGReportGroup;

  /// No description provided for @menuGUtilityGroup.
  ///
  /// In en, this message translates to:
  /// **'Utility Group'**
  String get menuGUtilityGroup;

  /// No description provided for @menuGBarcodeGroup.
  ///
  /// In en, this message translates to:
  /// **'Barcode Group'**
  String get menuGBarcodeGroup;

  /// No description provided for @menuGExtraUtility.
  ///
  /// In en, this message translates to:
  /// **'Extra Utility'**
  String get menuGExtraUtility;

  /// No description provided for @menuGUserManagement.
  ///
  /// In en, this message translates to:
  /// **'User Management'**
  String get menuGUserManagement;

  /// No description provided for @menuGSoftwareUtility.
  ///
  /// In en, this message translates to:
  /// **'Software Utility'**
  String get menuGSoftwareUtility;

  /// No description provided for @menuGChatGroup.
  ///
  /// In en, this message translates to:
  /// **'Chat and Customers'**
  String get menuGChatGroup;

  /// No description provided for @menuIAccountMaster.
  ///
  /// In en, this message translates to:
  /// **'Account Master'**
  String get menuIAccountMaster;

  /// No description provided for @menuIBankMaster.
  ///
  /// In en, this message translates to:
  /// **'Bank Master'**
  String get menuIBankMaster;

  /// No description provided for @menuIOpeningBalance.
  ///
  /// In en, this message translates to:
  /// **'Opening Balance'**
  String get menuIOpeningBalance;

  /// No description provided for @menuIBalanceSheetGroup.
  ///
  /// In en, this message translates to:
  /// **'Balance Sheet Group'**
  String get menuIBalanceSheetGroup;

  /// No description provided for @menuIAccountGroup.
  ///
  /// In en, this message translates to:
  /// **'Account Group'**
  String get menuIAccountGroup;

  /// No description provided for @menuIAccountCategory.
  ///
  /// In en, this message translates to:
  /// **'Account Category'**
  String get menuIAccountCategory;

  /// No description provided for @menuIRegionMaster.
  ///
  /// In en, this message translates to:
  /// **'Region Master'**
  String get menuIRegionMaster;

  /// No description provided for @menuICustomerSubCategory.
  ///
  /// In en, this message translates to:
  /// **'Customer Sub Category'**
  String get menuICustomerSubCategory;

  /// No description provided for @menuIRemarksMaster.
  ///
  /// In en, this message translates to:
  /// **'Remarks Master'**
  String get menuIRemarksMaster;

  /// No description provided for @menuICompanyMaster.
  ///
  /// In en, this message translates to:
  /// **'Company Master'**
  String get menuICompanyMaster;

  /// No description provided for @menuICountryMaster.
  ///
  /// In en, this message translates to:
  /// **'Country Master'**
  String get menuICountryMaster;

  /// No description provided for @menuIDepartmentMaster.
  ///
  /// In en, this message translates to:
  /// **'Department Master'**
  String get menuIDepartmentMaster;

  /// No description provided for @menuIManufactureCompany.
  ///
  /// In en, this message translates to:
  /// **'Manufacture Company'**
  String get menuIManufactureCompany;

  /// No description provided for @menuIBrandMaster.
  ///
  /// In en, this message translates to:
  /// **'Brand Master'**
  String get menuIBrandMaster;

  /// No description provided for @menuIProductMaster.
  ///
  /// In en, this message translates to:
  /// **'Product Master'**
  String get menuIProductMaster;

  /// No description provided for @menuIStyleMaster.
  ///
  /// In en, this message translates to:
  /// **'Style Master'**
  String get menuIStyleMaster;

  /// No description provided for @menuIItemGroup.
  ///
  /// In en, this message translates to:
  /// **'Item Group'**
  String get menuIItemGroup;

  /// No description provided for @menuIItemMaster.
  ///
  /// In en, this message translates to:
  /// **'Item Master'**
  String get menuIItemMaster;

  /// No description provided for @menuIDesignMaster.
  ///
  /// In en, this message translates to:
  /// **'Design Master'**
  String get menuIDesignMaster;

  /// No description provided for @menuIColorMaster.
  ///
  /// In en, this message translates to:
  /// **'Color Master'**
  String get menuIColorMaster;

  /// No description provided for @menuISizeGroupMaster.
  ///
  /// In en, this message translates to:
  /// **'Size Group Master'**
  String get menuISizeGroupMaster;

  /// No description provided for @menuISizeMaster.
  ///
  /// In en, this message translates to:
  /// **'Size Master'**
  String get menuISizeMaster;

  /// No description provided for @menuIFabric.
  ///
  /// In en, this message translates to:
  /// **'Fabric'**
  String get menuIFabric;

  /// No description provided for @menuISleeves.
  ///
  /// In en, this message translates to:
  /// **'Sleeves'**
  String get menuISleeves;

  /// No description provided for @menuINeck.
  ///
  /// In en, this message translates to:
  /// **'Neck'**
  String get menuINeck;

  /// No description provided for @menuIFit.
  ///
  /// In en, this message translates to:
  /// **'Fit'**
  String get menuIFit;

  /// No description provided for @menuISeason.
  ///
  /// In en, this message translates to:
  /// **'Season'**
  String get menuISeason;

  /// No description provided for @menuIStyleAttr.
  ///
  /// In en, this message translates to:
  /// **'Style'**
  String get menuIStyleAttr;

  /// No description provided for @menuIGender.
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get menuIGender;

  /// No description provided for @menuITypeMaster.
  ///
  /// In en, this message translates to:
  /// **'Type Master'**
  String get menuITypeMaster;

  /// No description provided for @menuISubCategory9.
  ///
  /// In en, this message translates to:
  /// **'Sub Category 9'**
  String get menuISubCategory9;

  /// No description provided for @menuISubCategory10.
  ///
  /// In en, this message translates to:
  /// **'Sub Category 10'**
  String get menuISubCategory10;

  /// No description provided for @menuIMaterialMaster.
  ///
  /// In en, this message translates to:
  /// **'Material Master'**
  String get menuIMaterialMaster;

  /// No description provided for @menuIFixedBarcode.
  ///
  /// In en, this message translates to:
  /// **'Fixed Barcode'**
  String get menuIFixedBarcode;

  /// No description provided for @menuIMinMaxStock.
  ///
  /// In en, this message translates to:
  /// **'Min Max Stock Define'**
  String get menuIMinMaxStock;

  /// No description provided for @menuIOpeningStock.
  ///
  /// In en, this message translates to:
  /// **'Opening Stock'**
  String get menuIOpeningStock;

  /// No description provided for @menuISeasonMaster.
  ///
  /// In en, this message translates to:
  /// **'Season Master'**
  String get menuISeasonMaster;

  /// No description provided for @menuIProcessMaster.
  ///
  /// In en, this message translates to:
  /// **'Process Master'**
  String get menuIProcessMaster;

  /// No description provided for @menuIOrderType.
  ///
  /// In en, this message translates to:
  /// **'Order Type'**
  String get menuIOrderType;

  /// No description provided for @menuIWarehouses.
  ///
  /// In en, this message translates to:
  /// **'Godowns and Stores'**
  String get menuIWarehouses;

  /// No description provided for @menuIDayBookMaster.
  ///
  /// In en, this message translates to:
  /// **'DayBook Master'**
  String get menuIDayBookMaster;

  /// No description provided for @menuILedgerParameter.
  ///
  /// In en, this message translates to:
  /// **'Ledger Parameter'**
  String get menuILedgerParameter;

  /// No description provided for @menuISalesmanMaster.
  ///
  /// In en, this message translates to:
  /// **'Salesman Master'**
  String get menuISalesmanMaster;

  /// No description provided for @menuITaxMaster.
  ///
  /// In en, this message translates to:
  /// **'Tax Master'**
  String get menuITaxMaster;

  /// No description provided for @menuITdsMaster.
  ///
  /// In en, this message translates to:
  /// **'TDS Master'**
  String get menuITdsMaster;

  /// No description provided for @menuITcsTaxMaster.
  ///
  /// In en, this message translates to:
  /// **'TCS Tax Master'**
  String get menuITcsTaxMaster;

  /// No description provided for @menuIFinanceYearMaster.
  ///
  /// In en, this message translates to:
  /// **'Finance Year Master'**
  String get menuIFinanceYearMaster;

  /// No description provided for @menuIHsnCodeMaster.
  ///
  /// In en, this message translates to:
  /// **'HSN Code Master'**
  String get menuIHsnCodeMaster;

  /// No description provided for @menuISalesReturnReason.
  ///
  /// In en, this message translates to:
  /// **'Sales Return Reason'**
  String get menuISalesReturnReason;

  /// No description provided for @menuISalesmanCommTarget.
  ///
  /// In en, this message translates to:
  /// **'Salesman Comm Target'**
  String get menuISalesmanCommTarget;

  /// No description provided for @menuIItemDiscountSetup.
  ///
  /// In en, this message translates to:
  /// **'Item Discount SetUp'**
  String get menuIItemDiscountSetup;

  /// No description provided for @menuIPromoMaster.
  ///
  /// In en, this message translates to:
  /// **'Promo Master'**
  String get menuIPromoMaster;

  /// No description provided for @menuISisSetup.
  ///
  /// In en, this message translates to:
  /// **'SIS Setup'**
  String get menuISisSetup;

  /// No description provided for @menuIItemCommissionSetup.
  ///
  /// In en, this message translates to:
  /// **'Item Commission SetUp'**
  String get menuIItemCommissionSetup;

  /// No description provided for @menuISourceMaster.
  ///
  /// In en, this message translates to:
  /// **'Source Master'**
  String get menuISourceMaster;

  /// No description provided for @menuISalesOrderWh.
  ///
  /// In en, this message translates to:
  /// **'Sales Order (Wh)'**
  String get menuISalesOrderWh;

  /// No description provided for @menuIWhSalesOrderCancel.
  ///
  /// In en, this message translates to:
  /// **'WhSales Order Cancel'**
  String get menuIWhSalesOrderCancel;

  /// No description provided for @menuIDeliveryOrder.
  ///
  /// In en, this message translates to:
  /// **'Delivery Order (D.O)'**
  String get menuIDeliveryOrder;

  /// No description provided for @menuIDeliveryChallan.
  ///
  /// In en, this message translates to:
  /// **'Delivery Challan'**
  String get menuIDeliveryChallan;

  /// No description provided for @menuISalesBillWh.
  ///
  /// In en, this message translates to:
  /// **'Sales Bill (Wh)'**
  String get menuISalesBillWh;

  /// No description provided for @menuIDeliveryChallanReturnWh.
  ///
  /// In en, this message translates to:
  /// **'Delivery Challan Return (Wh)'**
  String get menuIDeliveryChallanReturnWh;

  /// No description provided for @menuICreditNoteWh.
  ///
  /// In en, this message translates to:
  /// **'Credit Note (Wh)'**
  String get menuICreditNoteWh;

  /// No description provided for @menuIAdvanceReceipt.
  ///
  /// In en, this message translates to:
  /// **'Advance Receipt'**
  String get menuIAdvanceReceipt;

  /// No description provided for @menuICashPayRec.
  ///
  /// In en, this message translates to:
  /// **'Cash Pay/Rec'**
  String get menuICashPayRec;

  /// No description provided for @menuIBankPayRec.
  ///
  /// In en, this message translates to:
  /// **'Bank Pay/Rec'**
  String get menuIBankPayRec;

  /// No description provided for @menuIBillWiseReceipt.
  ///
  /// In en, this message translates to:
  /// **'Bill Wise Receipt'**
  String get menuIBillWiseReceipt;

  /// No description provided for @menuICardReceipt.
  ///
  /// In en, this message translates to:
  /// **'Card Receipt'**
  String get menuICardReceipt;

  /// No description provided for @menuIJournalVoucher.
  ///
  /// In en, this message translates to:
  /// **'Journal Voucher'**
  String get menuIJournalVoucher;

  /// No description provided for @menuIContraVoucher.
  ///
  /// In en, this message translates to:
  /// **'Contra Voucher'**
  String get menuIContraVoucher;

  /// No description provided for @menuIPurchaseOrder.
  ///
  /// In en, this message translates to:
  /// **'Purchase Order'**
  String get menuIPurchaseOrder;

  /// No description provided for @menuIInwardChallan.
  ///
  /// In en, this message translates to:
  /// **'Inward Challan'**
  String get menuIInwardChallan;

  /// No description provided for @menuIPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase'**
  String get menuIPurchase;

  /// No description provided for @menuIGoodsReturn.
  ///
  /// In en, this message translates to:
  /// **'Goods Return'**
  String get menuIGoodsReturn;

  /// No description provided for @menuIDebitNote.
  ///
  /// In en, this message translates to:
  /// **'Debit Note'**
  String get menuIDebitNote;

  /// No description provided for @menuIGstJv.
  ///
  /// In en, this message translates to:
  /// **'GST JV'**
  String get menuIGstJv;

  /// No description provided for @menuIJobIssue.
  ///
  /// In en, this message translates to:
  /// **'Job Issue'**
  String get menuIJobIssue;

  /// No description provided for @menuIJobReceipt.
  ///
  /// In en, this message translates to:
  /// **'Job Receipt'**
  String get menuIJobReceipt;

  /// No description provided for @menuIJobWorkIssue.
  ///
  /// In en, this message translates to:
  /// **'JobWork Issue'**
  String get menuIJobWorkIssue;

  /// No description provided for @menuIJobWorkReceipt.
  ///
  /// In en, this message translates to:
  /// **'JobWork Receipt'**
  String get menuIJobWorkReceipt;

  /// No description provided for @menuIStockAdjustment.
  ///
  /// In en, this message translates to:
  /// **'Stock Adjustment'**
  String get menuIStockAdjustment;

  /// No description provided for @menuISampleIssue.
  ///
  /// In en, this message translates to:
  /// **'Sample Issue'**
  String get menuISampleIssue;

  /// No description provided for @menuISampleReceive.
  ///
  /// In en, this message translates to:
  /// **'Sample Receive'**
  String get menuISampleReceive;

  /// No description provided for @menuIQuotation.
  ///
  /// In en, this message translates to:
  /// **'Quotation'**
  String get menuIQuotation;

  /// No description provided for @menuILrTransportEntry.
  ///
  /// In en, this message translates to:
  /// **'LR/Transport Entry'**
  String get menuILrTransportEntry;

  /// No description provided for @menuIEWayBill.
  ///
  /// In en, this message translates to:
  /// **'E-Way Bill'**
  String get menuIEWayBill;

  /// No description provided for @menuIRePackingBox.
  ///
  /// In en, this message translates to:
  /// **'RePacking Box'**
  String get menuIRePackingBox;

  /// No description provided for @menuIReOpenBox.
  ///
  /// In en, this message translates to:
  /// **'ReOpen Box'**
  String get menuIReOpenBox;

  /// No description provided for @menuILedgerReport.
  ///
  /// In en, this message translates to:
  /// **'Ledger Report'**
  String get menuILedgerReport;

  /// No description provided for @menuICashBookReport.
  ///
  /// In en, this message translates to:
  /// **'Cash Book Report'**
  String get menuICashBookReport;

  /// No description provided for @menuIBankReport.
  ///
  /// In en, this message translates to:
  /// **'Bank Report'**
  String get menuIBankReport;

  /// No description provided for @menuIBankReconciliation.
  ///
  /// In en, this message translates to:
  /// **'Bank Reconciliation'**
  String get menuIBankReconciliation;

  /// No description provided for @menuIGroupMonthSummary.
  ///
  /// In en, this message translates to:
  /// **'Group/Month Summary'**
  String get menuIGroupMonthSummary;

  /// No description provided for @menuICashBankExpense.
  ///
  /// In en, this message translates to:
  /// **'Cash Bank Expense'**
  String get menuICashBankExpense;

  /// No description provided for @menuICashFlowReportGroup.
  ///
  /// In en, this message translates to:
  /// **'Cash Flow Report Group'**
  String get menuICashFlowReportGroup;

  /// No description provided for @menuIBillToBillAdjustment.
  ///
  /// In en, this message translates to:
  /// **'Bill To Bill Adjustment'**
  String get menuIBillToBillAdjustment;

  /// No description provided for @menuIMsmeReport.
  ///
  /// In en, this message translates to:
  /// **'MSME Report'**
  String get menuIMsmeReport;

  /// No description provided for @menuIOutstandingPayable.
  ///
  /// In en, this message translates to:
  /// **'OutStanding Payable'**
  String get menuIOutstandingPayable;

  /// No description provided for @menuIOutstandingReceivable.
  ///
  /// In en, this message translates to:
  /// **'OutStanding Receivable'**
  String get menuIOutstandingReceivable;

  /// No description provided for @menuIDebtorsList.
  ///
  /// In en, this message translates to:
  /// **'Debtors List'**
  String get menuIDebtorsList;

  /// No description provided for @menuICreditorList.
  ///
  /// In en, this message translates to:
  /// **'Creditor List'**
  String get menuICreditorList;

  /// No description provided for @menuIInterestReport.
  ///
  /// In en, this message translates to:
  /// **'Interest Report'**
  String get menuIInterestReport;

  /// No description provided for @menuIDepreciationAssetReport.
  ///
  /// In en, this message translates to:
  /// **'Depreciation Asset Report'**
  String get menuIDepreciationAssetReport;

  /// No description provided for @menuIJournalVoucherReport.
  ///
  /// In en, this message translates to:
  /// **'Journal Voucher Report'**
  String get menuIJournalVoucherReport;

  /// No description provided for @menuIGstReport.
  ///
  /// In en, this message translates to:
  /// **'GST Report'**
  String get menuIGstReport;

  /// No description provided for @menuITdsReport.
  ///
  /// In en, this message translates to:
  /// **'TDS Report'**
  String get menuITdsReport;

  /// No description provided for @menuITdsForm26q.
  ///
  /// In en, this message translates to:
  /// **'TDS Form26Q'**
  String get menuITdsForm26q;

  /// No description provided for @menuIFinalReport.
  ///
  /// In en, this message translates to:
  /// **'Final Report'**
  String get menuIFinalReport;

  /// No description provided for @menuIRcmRegister.
  ///
  /// In en, this message translates to:
  /// **'RCM Register'**
  String get menuIRcmRegister;

  /// No description provided for @menuITcsReport.
  ///
  /// In en, this message translates to:
  /// **'TCS Report'**
  String get menuITcsReport;

  /// No description provided for @menuIEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get menuIEmployee;

  /// No description provided for @menuIEmployeeKyc.
  ///
  /// In en, this message translates to:
  /// **'Employee KYC Update'**
  String get menuIEmployeeKyc;

  /// No description provided for @menuISalaryDeduction.
  ///
  /// In en, this message translates to:
  /// **'Salary Deduction'**
  String get menuISalaryDeduction;

  /// No description provided for @menuIWeekOff.
  ///
  /// In en, this message translates to:
  /// **'Week Off'**
  String get menuIWeekOff;

  /// No description provided for @menuIWeekOffCancel.
  ///
  /// In en, this message translates to:
  /// **'Week Off Cancel'**
  String get menuIWeekOffCancel;

  /// No description provided for @menuIHolidays.
  ///
  /// In en, this message translates to:
  /// **'Holidays'**
  String get menuIHolidays;

  /// No description provided for @menuIDesignation.
  ///
  /// In en, this message translates to:
  /// **'Designation'**
  String get menuIDesignation;

  /// No description provided for @menuIDepartment.
  ///
  /// In en, this message translates to:
  /// **'Department'**
  String get menuIDepartment;

  /// No description provided for @menuIShiftMaster.
  ///
  /// In en, this message translates to:
  /// **'Shift Master'**
  String get menuIShiftMaster;

  /// No description provided for @menuIDailyAttendance.
  ///
  /// In en, this message translates to:
  /// **'Daily Attendance'**
  String get menuIDailyAttendance;

  /// No description provided for @menuILeaveApplication.
  ///
  /// In en, this message translates to:
  /// **'Leave Application'**
  String get menuILeaveApplication;

  /// No description provided for @menuIAdvanceSalary.
  ///
  /// In en, this message translates to:
  /// **'Advance Salary (Upad)'**
  String get menuIAdvanceSalary;

  /// No description provided for @menuILoanIssue.
  ///
  /// In en, this message translates to:
  /// **'Loan Issue'**
  String get menuILoanIssue;

  /// No description provided for @menuILoanReceipt.
  ///
  /// In en, this message translates to:
  /// **'Loan Receipt'**
  String get menuILoanReceipt;

  /// No description provided for @menuIMonthlySalary.
  ///
  /// In en, this message translates to:
  /// **'Monthly Salary'**
  String get menuIMonthlySalary;

  /// No description provided for @menuIStipend.
  ///
  /// In en, this message translates to:
  /// **'Stipend'**
  String get menuIStipend;

  /// No description provided for @menuISalaryPayment.
  ///
  /// In en, this message translates to:
  /// **'Salary Payment'**
  String get menuISalaryPayment;

  /// No description provided for @menuIStipendPayment.
  ///
  /// In en, this message translates to:
  /// **'Stipend Payment'**
  String get menuIStipendPayment;

  /// No description provided for @menuIIncentive.
  ///
  /// In en, this message translates to:
  /// **'Incentive'**
  String get menuIIncentive;

  /// No description provided for @menuIOtherDeduction.
  ///
  /// In en, this message translates to:
  /// **'Other Deduction'**
  String get menuIOtherDeduction;

  /// No description provided for @menuIAdvanceLoanRequest.
  ///
  /// In en, this message translates to:
  /// **'Advance And Loan Request'**
  String get menuIAdvanceLoanRequest;

  /// No description provided for @menuIMonthlyAttendanceRegister.
  ///
  /// In en, this message translates to:
  /// **'Monthly Attendance Register'**
  String get menuIMonthlyAttendanceRegister;

  /// No description provided for @menuIDayWiseAttendanceRegister.
  ///
  /// In en, this message translates to:
  /// **'Day Wise Attendance Register'**
  String get menuIDayWiseAttendanceRegister;

  /// No description provided for @menuISalarySlipRegister.
  ///
  /// In en, this message translates to:
  /// **'SalarySlip Register Report'**
  String get menuISalarySlipRegister;

  /// No description provided for @menuIPtReport.
  ///
  /// In en, this message translates to:
  /// **'PT Report'**
  String get menuIPtReport;

  /// No description provided for @menuILeaveReport.
  ///
  /// In en, this message translates to:
  /// **'Leave Report'**
  String get menuILeaveReport;

  /// No description provided for @menuIMenuLogSessionReport.
  ///
  /// In en, this message translates to:
  /// **'Menu Log Session Report'**
  String get menuIMenuLogSessionReport;

  /// No description provided for @menuIPayrollParameter.
  ///
  /// In en, this message translates to:
  /// **'PayRoll Parameter'**
  String get menuIPayrollParameter;

  /// No description provided for @menuIDeviceSettings.
  ///
  /// In en, this message translates to:
  /// **'Device Settings'**
  String get menuIDeviceSettings;

  /// No description provided for @menuIBarcodePrint.
  ///
  /// In en, this message translates to:
  /// **'Barcode Print'**
  String get menuIBarcodePrint;

  /// No description provided for @menuIBarcodeSearch.
  ///
  /// In en, this message translates to:
  /// **'Barcode Search'**
  String get menuIBarcodeSearch;

  /// No description provided for @menuIBarcodeDesignImage.
  ///
  /// In en, this message translates to:
  /// **'Barcode/Design Image'**
  String get menuIBarcodeDesignImage;

  /// No description provided for @menuIRateUpdation.
  ///
  /// In en, this message translates to:
  /// **'Rate Updation'**
  String get menuIRateUpdation;

  /// No description provided for @menuIImageCatalogue.
  ///
  /// In en, this message translates to:
  /// **'Image Catalogue'**
  String get menuIImageCatalogue;

  /// No description provided for @menuISalesDiscountMaster.
  ///
  /// In en, this message translates to:
  /// **'Sales Discount Master'**
  String get menuISalesDiscountMaster;

  /// No description provided for @menuISalesDiscountDesignWise.
  ///
  /// In en, this message translates to:
  /// **'Sales Discount Design Wise'**
  String get menuISalesDiscountDesignWise;

  /// No description provided for @menuISalesmanCommission.
  ///
  /// In en, this message translates to:
  /// **'Salesman Commission'**
  String get menuISalesmanCommission;

  /// No description provided for @menuIDayClose.
  ///
  /// In en, this message translates to:
  /// **'Day Close'**
  String get menuIDayClose;

  /// No description provided for @menuISms.
  ///
  /// In en, this message translates to:
  /// **'SMS'**
  String get menuISms;

  /// No description provided for @menuIEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get menuIEmail;

  /// No description provided for @menuIBulkMessenger.
  ///
  /// In en, this message translates to:
  /// **'Bulk Messenger'**
  String get menuIBulkMessenger;

  /// No description provided for @menuILogHistoryReport.
  ///
  /// In en, this message translates to:
  /// **'Log History Report'**
  String get menuILogHistoryReport;

  /// No description provided for @menuIOutstandingAdj.
  ///
  /// In en, this message translates to:
  /// **'Out Standing Adj'**
  String get menuIOutstandingAdj;

  /// No description provided for @menuIResetPhysicalStock.
  ///
  /// In en, this message translates to:
  /// **'Reset Physical Stock'**
  String get menuIResetPhysicalStock;

  /// No description provided for @menuIPhysicalStockVerification.
  ///
  /// In en, this message translates to:
  /// **'Physical Stock Verification'**
  String get menuIPhysicalStockVerification;

  /// No description provided for @menuIMerge.
  ///
  /// In en, this message translates to:
  /// **'Merge'**
  String get menuIMerge;

  /// No description provided for @menuISalesStockLedgerDiff.
  ///
  /// In en, this message translates to:
  /// **'Sales Stock Ledger Diff'**
  String get menuISalesStockLedgerDiff;

  /// No description provided for @menuINoteReport.
  ///
  /// In en, this message translates to:
  /// **'Note Report'**
  String get menuINoteReport;

  /// No description provided for @menuIEInvoiceUpload.
  ///
  /// In en, this message translates to:
  /// **'E-Invoice Upload'**
  String get menuIEInvoiceUpload;

  /// No description provided for @menuIEWayBillUpload.
  ///
  /// In en, this message translates to:
  /// **'E-WayBill Upload'**
  String get menuIEWayBillUpload;

  /// No description provided for @menuIAutoOutstandingReminder.
  ///
  /// In en, this message translates to:
  /// **'Auto Outstanding Reminder'**
  String get menuIAutoOutstandingReminder;

  /// No description provided for @menuIUsers.
  ///
  /// In en, this message translates to:
  /// **'Users'**
  String get menuIUsers;

  /// No description provided for @menuIUserGroup.
  ///
  /// In en, this message translates to:
  /// **'User Group'**
  String get menuIUserGroup;

  /// No description provided for @menuICurrentDateSetting.
  ///
  /// In en, this message translates to:
  /// **'Current Date Setting'**
  String get menuICurrentDateSetting;

  /// No description provided for @menuIDataLockTillDate.
  ///
  /// In en, this message translates to:
  /// **'Data Lock Till Date'**
  String get menuIDataLockTillDate;

  /// No description provided for @menuIMyDevices.
  ///
  /// In en, this message translates to:
  /// **'My Devices'**
  String get menuIMyDevices;

  /// No description provided for @menuILedgerStockPosting.
  ///
  /// In en, this message translates to:
  /// **'Ledger And Stock Posting'**
  String get menuILedgerStockPosting;

  /// No description provided for @menuIReportType.
  ///
  /// In en, this message translates to:
  /// **'Report Type'**
  String get menuIReportType;

  /// No description provided for @menuIUserParameter.
  ///
  /// In en, this message translates to:
  /// **'User Parameter'**
  String get menuIUserParameter;

  /// No description provided for @menuIBalanceTransfer.
  ///
  /// In en, this message translates to:
  /// **'Balance Transfer'**
  String get menuIBalanceTransfer;

  /// No description provided for @menuIDatabaseBackup.
  ///
  /// In en, this message translates to:
  /// **'Database Backup'**
  String get menuIDatabaseBackup;

  /// No description provided for @menuISoftwareUpdate.
  ///
  /// In en, this message translates to:
  /// **'Software Update'**
  String get menuISoftwareUpdate;

  /// No description provided for @menuIDbUpdates.
  ///
  /// In en, this message translates to:
  /// **'DB Updates'**
  String get menuIDbUpdates;

  /// No description provided for @menuIScheduleBackup.
  ///
  /// In en, this message translates to:
  /// **'Schedule Backup'**
  String get menuIScheduleBackup;

  /// No description provided for @menuIExportVouchersPdf.
  ///
  /// In en, this message translates to:
  /// **'Export Vouchers to PDF'**
  String get menuIExportVouchersPdf;

  /// No description provided for @menuIEmployeeDepartment.
  ///
  /// In en, this message translates to:
  /// **'Department'**
  String get menuIEmployeeDepartment;

  /// No description provided for @menuISensitiveChanges.
  ///
  /// In en, this message translates to:
  /// **'Sensitive changes'**
  String get menuISensitiveChanges;

  /// No description provided for @menuITransporterMaster.
  ///
  /// In en, this message translates to:
  /// **'Transporter Master'**
  String get menuITransporterMaster;

  /// No description provided for @listsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'A list kept for this business. Archive an entry instead of deleting it, so old documents keep their value.'**
  String get listsSubtitle;

  /// No description provided for @listsName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get listsName;

  /// No description provided for @listsCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get listsCode;

  /// No description provided for @listsNote.
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get listsNote;

  /// No description provided for @listsNewEntry.
  ///
  /// In en, this message translates to:
  /// **'New entry'**
  String get listsNewEntry;

  /// No description provided for @listsShowArchived.
  ///
  /// In en, this message translates to:
  /// **'Show archived ({n})'**
  String listsShowArchived(String n);

  /// No description provided for @listsEntries.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} entry} other {{n} entries}}'**
  String listsEntries(num n);

  /// No description provided for @listsArchive.
  ///
  /// In en, this message translates to:
  /// **'Archive'**
  String get listsArchive;

  /// No description provided for @listsRestore.
  ///
  /// In en, this message translates to:
  /// **'Restore'**
  String get listsRestore;

  /// No description provided for @listsNoMatch.
  ///
  /// In en, this message translates to:
  /// **'No entries match the search.'**
  String get listsNoMatch;

  /// No description provided for @listsEmpty.
  ///
  /// In en, this message translates to:
  /// **'Nothing in this list yet. Type the first entry on the top line.'**
  String get listsEmpty;

  /// No description provided for @listsEmptyReadOnly.
  ///
  /// In en, this message translates to:
  /// **'Nothing in this list yet.'**
  String get listsEmptyReadOnly;

  /// No description provided for @listsOtherLists.
  ///
  /// In en, this message translates to:
  /// **'Lists'**
  String get listsOtherLists;

  /// No description provided for @listsErrorsLookupTaken.
  ///
  /// In en, this message translates to:
  /// **'This list already has an entry with that name.'**
  String get listsErrorsLookupTaken;

  /// No description provided for @listsErrorsEndBeforeStart.
  ///
  /// In en, this message translates to:
  /// **'The end date is before the start date.'**
  String get listsErrorsEndBeforeStart;

  /// No description provided for @limitsTitle.
  ///
  /// In en, this message translates to:
  /// **'Minimum and maximum stock'**
  String get limitsTitle;

  /// No description provided for @limitsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Set how little and how much of each item a warehouse should hold. Items under their minimum are flagged so you know what to order.'**
  String get limitsSubtitle;

  /// No description provided for @limitsWarehouse.
  ///
  /// In en, this message translates to:
  /// **'Warehouse'**
  String get limitsWarehouse;

  /// No description provided for @limitsOnlyBelow.
  ///
  /// In en, this message translates to:
  /// **'Only below minimum ({n})'**
  String limitsOnlyBelow(String n);

  /// No description provided for @limitsSaved.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {Saved {n} row} other {Saved {n} rows}}'**
  String limitsSaved(num n);

  /// No description provided for @limitsSaveN.
  ///
  /// In en, this message translates to:
  /// **'Save {n} changed'**
  String limitsSaveN(String n);

  /// No description provided for @limitsItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get limitsItem;

  /// No description provided for @limitsInStock.
  ///
  /// In en, this message translates to:
  /// **'In stock'**
  String get limitsInStock;

  /// No description provided for @limitsMin.
  ///
  /// In en, this message translates to:
  /// **'Minimum'**
  String get limitsMin;

  /// No description provided for @limitsMax.
  ///
  /// In en, this message translates to:
  /// **'Maximum'**
  String get limitsMax;

  /// No description provided for @limitsToOrder.
  ///
  /// In en, this message translates to:
  /// **'To order'**
  String get limitsToOrder;

  /// No description provided for @limitsBelow.
  ///
  /// In en, this message translates to:
  /// **'Below minimum'**
  String get limitsBelow;

  /// No description provided for @limitsNoMatch.
  ///
  /// In en, this message translates to:
  /// **'No items match.'**
  String get limitsNoMatch;

  /// No description provided for @limitsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No items yet. Add items or styles first, then set their limits here.'**
  String get limitsEmpty;

  /// No description provided for @limitsErrorsMaxBelowMin.
  ///
  /// In en, this message translates to:
  /// **'The maximum cannot be less than the minimum.'**
  String get limitsErrorsMaxBelowMin;

  /// No description provided for @billReceiptTitleReceivable.
  ///
  /// In en, this message translates to:
  /// **'Bill wise receipt'**
  String get billReceiptTitleReceivable;

  /// No description provided for @billReceiptTitlePayable.
  ///
  /// In en, this message translates to:
  /// **'Bill wise payment'**
  String get billReceiptTitlePayable;

  /// No description provided for @billReceiptSubtitleReceivable.
  ///
  /// In en, this message translates to:
  /// **'Record money received and choose the bills it pays. Anything left over stays on account and clears the oldest bills.'**
  String get billReceiptSubtitleReceivable;

  /// No description provided for @billReceiptSubtitlePayable.
  ///
  /// In en, this message translates to:
  /// **'Record a payment to a supplier and choose the bills it pays. Anything left over stays on account and clears the oldest bills.'**
  String get billReceiptSubtitlePayable;

  /// No description provided for @billReceiptTabReceipt.
  ///
  /// In en, this message translates to:
  /// **'Receipt'**
  String get billReceiptTabReceipt;

  /// No description provided for @billReceiptTabPayment.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get billReceiptTabPayment;

  /// No description provided for @billReceiptCustomer.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get billReceiptCustomer;

  /// No description provided for @billReceiptSupplier.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get billReceiptSupplier;

  /// No description provided for @billReceiptChoose.
  ///
  /// In en, this message translates to:
  /// **'Choose a party'**
  String get billReceiptChoose;

  /// No description provided for @billReceiptAccount.
  ///
  /// In en, this message translates to:
  /// **'Cash or bank account'**
  String get billReceiptAccount;

  /// No description provided for @billReceiptAmountReceived.
  ///
  /// In en, this message translates to:
  /// **'Amount received'**
  String get billReceiptAmountReceived;

  /// No description provided for @billReceiptAmountPaid.
  ///
  /// In en, this message translates to:
  /// **'Amount paid'**
  String get billReceiptAmountPaid;

  /// No description provided for @billReceiptReference.
  ///
  /// In en, this message translates to:
  /// **'Reference (cheque, UPI id)'**
  String get billReceiptReference;

  /// No description provided for @billReceiptOpenBills.
  ///
  /// In en, this message translates to:
  /// **'Open bills'**
  String get billReceiptOpenBills;

  /// No description provided for @billReceiptAdvance.
  ///
  /// In en, this message translates to:
  /// **'Already on account: {amount}'**
  String billReceiptAdvance(String amount);

  /// No description provided for @billReceiptFillOldest.
  ///
  /// In en, this message translates to:
  /// **'Fill oldest first'**
  String get billReceiptFillOldest;

  /// No description provided for @billReceiptClear.
  ///
  /// In en, this message translates to:
  /// **'Clear'**
  String get billReceiptClear;

  /// No description provided for @billReceiptBill.
  ///
  /// In en, this message translates to:
  /// **'Bill'**
  String get billReceiptBill;

  /// No description provided for @billReceiptDueOn.
  ///
  /// In en, this message translates to:
  /// **'Due'**
  String get billReceiptDueOn;

  /// No description provided for @billReceiptPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get billReceiptPending;

  /// No description provided for @billReceiptPayNow.
  ///
  /// In en, this message translates to:
  /// **'Pay now'**
  String get billReceiptPayNow;

  /// No description provided for @billReceiptLate.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day late} other {{n} days late}}'**
  String billReceiptLate(num n);

  /// No description provided for @billReceiptNoBills.
  ///
  /// In en, this message translates to:
  /// **'No open bills for this party.'**
  String get billReceiptNoBills;

  /// No description provided for @billReceiptOnBills.
  ///
  /// In en, this message translates to:
  /// **'On bills'**
  String get billReceiptOnBills;

  /// No description provided for @billReceiptOnAccount.
  ///
  /// In en, this message translates to:
  /// **'On account'**
  String get billReceiptOnAccount;

  /// No description provided for @billReceiptSaveReceipt.
  ///
  /// In en, this message translates to:
  /// **'Save receipt'**
  String get billReceiptSaveReceipt;

  /// No description provided for @billReceiptSavePayment.
  ///
  /// In en, this message translates to:
  /// **'Save payment'**
  String get billReceiptSavePayment;

  /// No description provided for @billReceiptSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved as {number}'**
  String billReceiptSaved(String number);

  /// No description provided for @billReceiptErrorsOverAllocated.
  ///
  /// In en, this message translates to:
  /// **'The bills add up to more than the amount.'**
  String get billReceiptErrorsOverAllocated;

  /// No description provided for @billReceiptErrorsBillNotOpen.
  ///
  /// In en, this message translates to:
  /// **'One of the bills is no longer open. Reload and try again.'**
  String get billReceiptErrorsBillNotOpen;

  /// No description provided for @billReceiptErrorsOverBill.
  ///
  /// In en, this message translates to:
  /// **'An amount is more than the bill still owes.'**
  String get billReceiptErrorsOverBill;

  /// No description provided for @billReceiptErrorsAmountRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter the amount.'**
  String get billReceiptErrorsAmountRequired;

  /// No description provided for @billReceiptErrorsBillTwice.
  ///
  /// In en, this message translates to:
  /// **'The same bill is listed twice.'**
  String get billReceiptErrorsBillTwice;

  /// No description provided for @booksTitle.
  ///
  /// In en, this message translates to:
  /// **'Account books'**
  String get booksTitle;

  /// No description provided for @booksSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went.'**
  String get booksSubtitle;

  /// No description provided for @booksCash.
  ///
  /// In en, this message translates to:
  /// **'Cash book'**
  String get booksCash;

  /// No description provided for @booksBank.
  ///
  /// In en, this message translates to:
  /// **'Bank book'**
  String get booksBank;

  /// No description provided for @booksGroup.
  ///
  /// In en, this message translates to:
  /// **'Group by month'**
  String get booksGroup;

  /// No description provided for @booksExpense.
  ///
  /// In en, this message translates to:
  /// **'Cash and bank expense'**
  String get booksExpense;

  /// No description provided for @booksFlow.
  ///
  /// In en, this message translates to:
  /// **'Cash flow'**
  String get booksFlow;

  /// No description provided for @booksShow.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get booksShow;

  /// No description provided for @booksPickGroup.
  ///
  /// In en, this message translates to:
  /// **'Account group'**
  String get booksPickGroup;

  /// No description provided for @booksOpening.
  ///
  /// In en, this message translates to:
  /// **'Opening'**
  String get booksOpening;

  /// No description provided for @booksReceipts.
  ///
  /// In en, this message translates to:
  /// **'Receipts'**
  String get booksReceipts;

  /// No description provided for @booksPayments.
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get booksPayments;

  /// No description provided for @booksClosing.
  ///
  /// In en, this message translates to:
  /// **'Closing'**
  String get booksClosing;

  /// No description provided for @booksAccounts.
  ///
  /// In en, this message translates to:
  /// **'Accounts'**
  String get booksAccounts;

  /// No description provided for @booksByDay.
  ///
  /// In en, this message translates to:
  /// **'By day'**
  String get booksByDay;

  /// No description provided for @booksMonth.
  ///
  /// In en, this message translates to:
  /// **'Month'**
  String get booksMonth;

  /// No description provided for @booksDebit.
  ///
  /// In en, this message translates to:
  /// **'Debit'**
  String get booksDebit;

  /// No description provided for @booksCredit.
  ///
  /// In en, this message translates to:
  /// **'Credit'**
  String get booksCredit;

  /// No description provided for @booksExpenseAccount.
  ///
  /// In en, this message translates to:
  /// **'Expense account'**
  String get booksExpenseAccount;

  /// No description provided for @booksVouchers.
  ///
  /// In en, this message translates to:
  /// **'Vouchers'**
  String get booksVouchers;

  /// No description provided for @booksOtherSide.
  ///
  /// In en, this message translates to:
  /// **'Other side of the entry'**
  String get booksOtherSide;

  /// No description provided for @booksMoneyIn.
  ///
  /// In en, this message translates to:
  /// **'Money in'**
  String get booksMoneyIn;

  /// No description provided for @booksMoneyOut.
  ///
  /// In en, this message translates to:
  /// **'Money out'**
  String get booksMoneyOut;

  /// No description provided for @booksNet.
  ///
  /// In en, this message translates to:
  /// **'Net'**
  String get booksNet;

  /// No description provided for @booksTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get booksTotal;

  /// No description provided for @booksEmpty.
  ///
  /// In en, this message translates to:
  /// **'Nothing in this period.'**
  String get booksEmpty;

  /// No description provided for @booksNoAccounts.
  ///
  /// In en, this message translates to:
  /// **'No accounts in this group yet.'**
  String get booksNoAccounts;

  /// No description provided for @booksRcm.
  ///
  /// In en, this message translates to:
  /// **'RCM register'**
  String get booksRcm;

  /// No description provided for @booksAdjust.
  ///
  /// In en, this message translates to:
  /// **'Bill to bill adjustment'**
  String get booksAdjust;

  /// No description provided for @booksVoucher.
  ///
  /// In en, this message translates to:
  /// **'Voucher'**
  String get booksVoucher;

  /// No description provided for @booksBill.
  ///
  /// In en, this message translates to:
  /// **'Bill settled'**
  String get booksBill;

  /// No description provided for @booksParty.
  ///
  /// In en, this message translates to:
  /// **'Party'**
  String get booksParty;

  /// No description provided for @booksAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get booksAmount;

  /// No description provided for @booksSupplier.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get booksSupplier;

  /// No description provided for @booksInvoice.
  ///
  /// In en, this message translates to:
  /// **'Supplier invoice'**
  String get booksInvoice;

  /// No description provided for @booksTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable'**
  String get booksTaxable;

  /// No description provided for @booksCgst.
  ///
  /// In en, this message translates to:
  /// **'CGST'**
  String get booksCgst;

  /// No description provided for @booksSgst.
  ///
  /// In en, this message translates to:
  /// **'SGST / UTGST'**
  String get booksSgst;

  /// No description provided for @booksIgst.
  ///
  /// In en, this message translates to:
  /// **'IGST'**
  String get booksIgst;

  /// No description provided for @booksCess.
  ///
  /// In en, this message translates to:
  /// **'Cess'**
  String get booksCess;

  /// No description provided for @hubReportsTitle.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get hubReportsTitle;

  /// No description provided for @hubReportsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Every report in one place, grouped by the question it answers.'**
  String get hubReportsSubtitle;

  /// No description provided for @hubMastersTitle.
  ///
  /// In en, this message translates to:
  /// **'Masters'**
  String get hubMastersTitle;

  /// No description provided for @hubMastersSubtitle.
  ///
  /// In en, this message translates to:
  /// **'The records every bill and voucher draws on: what you sell, who you deal with, prices and rules, stores and counters.'**
  String get hubMastersSubtitle;

  /// No description provided for @hubGroupsMerchandise.
  ///
  /// In en, this message translates to:
  /// **'Merchandise'**
  String get hubGroupsMerchandise;

  /// No description provided for @hubGroupsParties.
  ///
  /// In en, this message translates to:
  /// **'Parties and people'**
  String get hubGroupsParties;

  /// No description provided for @hubGroupsCommercial.
  ///
  /// In en, this message translates to:
  /// **'Prices, offers and tax'**
  String get hubGroupsCommercial;

  /// No description provided for @hubGroupsOperational.
  ///
  /// In en, this message translates to:
  /// **'Stores, counters and rules'**
  String get hubGroupsOperational;

  /// No description provided for @hubGroupsSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get hubGroupsSales;

  /// No description provided for @hubGroupsStock.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get hubGroupsStock;

  /// No description provided for @hubGroupsAccounts.
  ///
  /// In en, this message translates to:
  /// **'Account reports'**
  String get hubGroupsAccounts;

  /// No description provided for @hubGroupsTax.
  ///
  /// In en, this message translates to:
  /// **'Tax and statutory'**
  String get hubGroupsTax;

  /// No description provided for @hubGroupsAudit.
  ///
  /// In en, this message translates to:
  /// **'Checks and audit'**
  String get hubGroupsAudit;

  /// No description provided for @hubGroupsCustom.
  ///
  /// In en, this message translates to:
  /// **'Your own reports'**
  String get hubGroupsCustom;

  /// No description provided for @hubAboutMerchandise.
  ///
  /// In en, this message translates to:
  /// **'Designs, sizes, colours and photos'**
  String get hubAboutMerchandise;

  /// No description provided for @hubAboutParties.
  ///
  /// In en, this message translates to:
  /// **'Customers, suppliers and every ledger; staff'**
  String get hubAboutParties;

  /// No description provided for @hubAboutCommercial.
  ///
  /// In en, this message translates to:
  /// **'What things sell for and the GST that applies'**
  String get hubAboutCommercial;

  /// No description provided for @hubAboutOperational.
  ///
  /// In en, this message translates to:
  /// **'Where stock sits and how counters and numbers behave'**
  String get hubAboutOperational;

  /// No description provided for @hubAboutSales.
  ///
  /// In en, this message translates to:
  /// **'What sold, where and to whom'**
  String get hubAboutSales;

  /// No description provided for @hubAboutStock.
  ///
  /// In en, this message translates to:
  /// **'What is on the shelves and how long it has sat'**
  String get hubAboutStock;

  /// No description provided for @hubAboutAccounts.
  ///
  /// In en, this message translates to:
  /// **'Who owes what, profit and the books'**
  String get hubAboutAccounts;

  /// No description provided for @hubAboutTax.
  ///
  /// In en, this message translates to:
  /// **'GST returns, payroll statutory and tax depreciation'**
  String get hubAboutTax;

  /// No description provided for @hubAboutAudit.
  ///
  /// In en, this message translates to:
  /// **'Exceptions to look at and who changed what'**
  String get hubAboutAudit;

  /// No description provided for @hubAboutCustom.
  ///
  /// In en, this message translates to:
  /// **'Build, save and schedule your own'**
  String get hubAboutCustom;

  /// No description provided for @exchangeOpen.
  ///
  /// In en, this message translates to:
  /// **'Return or exchange'**
  String get exchangeOpen;

  /// No description provided for @exchangeTitle.
  ///
  /// In en, this message translates to:
  /// **'Goods coming back on this bill'**
  String get exchangeTitle;

  /// No description provided for @exchangeTaking.
  ///
  /// In en, this message translates to:
  /// **'{pieces, plural, one {{pieces} piece} other {{pieces} pieces}} back from {number}'**
  String exchangeTaking(num pieces, String number);

  /// No description provided for @exchangeCredit.
  ///
  /// In en, this message translates to:
  /// **'Credit'**
  String get exchangeCredit;

  /// No description provided for @exchangeAdd.
  ///
  /// In en, this message translates to:
  /// **'Take back on this bill'**
  String get exchangeAdd;

  /// No description provided for @exchangeCreditUsed.
  ///
  /// In en, this message translates to:
  /// **'Return against {number}'**
  String exchangeCreditUsed(String number);

  /// No description provided for @exchangeCreditLeft.
  ///
  /// In en, this message translates to:
  /// **'{amount} of credit is left; it stays as store credit.'**
  String exchangeCreditLeft(String amount);

  /// No description provided for @exchangeDone.
  ///
  /// In en, this message translates to:
  /// **'Return {number} took {amount} off this bill.'**
  String exchangeDone(String number, String amount);

  /// No description provided for @exchangeLeftCode.
  ///
  /// In en, this message translates to:
  /// **'Store credit of {amount} left, code:'**
  String exchangeLeftCode(String amount);

  /// No description provided for @exchangeReceiptReturned.
  ///
  /// In en, this message translates to:
  /// **'Returned (bill {number})'**
  String exchangeReceiptReturned(String number);

  /// No description provided for @exchangeReceiptCredit.
  ///
  /// In en, this message translates to:
  /// **'Store credit {amount}, code {code}'**
  String exchangeReceiptCredit(String amount, String code);

  /// No description provided for @inwardTransporter.
  ///
  /// In en, this message translates to:
  /// **'Transporter'**
  String get inwardTransporter;

  /// No description provided for @inwardLrNumber.
  ///
  /// In en, this message translates to:
  /// **'LR no.'**
  String get inwardLrNumber;

  /// No description provided for @inwardLrDate.
  ///
  /// In en, this message translates to:
  /// **'LR date'**
  String get inwardLrDate;

  /// No description provided for @inwardMarkup.
  ///
  /// In en, this message translates to:
  /// **'Mark-up %'**
  String get inwardMarkup;

  /// No description provided for @inwardMarkupHint.
  ///
  /// In en, this message translates to:
  /// **'Fills MRP from cost'**
  String get inwardMarkupHint;

  /// No description provided for @inwardRounding.
  ///
  /// In en, this message translates to:
  /// **'Round MRP to'**
  String get inwardRounding;

  /// No description provided for @inwardRound1.
  ///
  /// In en, this message translates to:
  /// **'nearest rupee'**
  String get inwardRound1;

  /// No description provided for @inwardRound9.
  ///
  /// In en, this message translates to:
  /// **'ends in 9 (1,299)'**
  String get inwardRound9;

  /// No description provided for @inwardRound10.
  ///
  /// In en, this message translates to:
  /// **'next 10'**
  String get inwardRound10;

  /// No description provided for @inwardRound50.
  ///
  /// In en, this message translates to:
  /// **'next 50'**
  String get inwardRound50;

  /// No description provided for @inwardCost.
  ///
  /// In en, this message translates to:
  /// **'Cost'**
  String get inwardCost;

  /// No description provided for @inwardMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP'**
  String get inwardMrp;

  /// No description provided for @inwardMarkupCol.
  ///
  /// In en, this message translates to:
  /// **'Mark-up'**
  String get inwardMarkupCol;

  /// No description provided for @inwardMarkupTitle.
  ///
  /// In en, this message translates to:
  /// **'MRP over cost, as % of cost'**
  String get inwardMarkupTitle;

  /// No description provided for @inwardMarginCol.
  ///
  /// In en, this message translates to:
  /// **'Margin'**
  String get inwardMarginCol;

  /// No description provided for @inwardMarginTitle.
  ///
  /// In en, this message translates to:
  /// **'Mark-down from MRP to cost, as % of MRP'**
  String get inwardMarginTitle;

  /// No description provided for @inwardTotals.
  ///
  /// In en, this message translates to:
  /// **'{pieces} pieces, cost {value}'**
  String inwardTotals(String pieces, String value);

  /// No description provided for @inwardLastPurchases.
  ///
  /// In en, this message translates to:
  /// **'Last purchases'**
  String get inwardLastPurchases;

  /// No description provided for @inwardPickLine.
  ///
  /// In en, this message translates to:
  /// **'Pick a line to see what this item cost before.'**
  String get inwardPickLine;

  /// No description provided for @inwardCurrentMrp.
  ///
  /// In en, this message translates to:
  /// **'MRP now'**
  String get inwardCurrentMrp;

  /// No description provided for @inwardInStock.
  ///
  /// In en, this message translates to:
  /// **'In stock'**
  String get inwardInStock;

  /// No description provided for @inwardDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get inwardDate;

  /// No description provided for @inwardNeverBought.
  ///
  /// In en, this message translates to:
  /// **'Not bought before.'**
  String get inwardNeverBought;

  /// No description provided for @inwardPrintLabels.
  ///
  /// In en, this message translates to:
  /// **'Print labels for these pieces'**
  String get inwardPrintLabels;

  /// No description provided for @inwardDocument.
  ///
  /// In en, this message translates to:
  /// **'Challan'**
  String get inwardDocument;

  /// No description provided for @inwardState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get inwardState;

  /// No description provided for @inwardTransport.
  ///
  /// In en, this message translates to:
  /// **'Transport'**
  String get inwardTransport;

  /// No description provided for @inwardSizeCurve.
  ///
  /// In en, this message translates to:
  /// **'Pieces by size'**
  String get inwardSizeCurve;

  /// No description provided for @inwardTotalQty.
  ///
  /// In en, this message translates to:
  /// **'Pieces'**
  String get inwardTotalQty;

  /// No description provided for @inwardAtCost.
  ///
  /// In en, this message translates to:
  /// **'At cost'**
  String get inwardAtCost;

  /// No description provided for @inwardAvgMarkup.
  ///
  /// In en, this message translates to:
  /// **'Mark-up'**
  String get inwardAvgMarkup;

  /// No description provided for @countsTitle.
  ///
  /// In en, this message translates to:
  /// **'Stock counts'**
  String get countsTitle;

  /// No description provided for @countsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Count a store by scanning barcodes. An approver sees the differences and their value, and approving puts the books right.'**
  String get countsSubtitle;

  /// No description provided for @countsWholeStore.
  ///
  /// In en, this message translates to:
  /// **'Whole store'**
  String get countsWholeStore;

  /// No description provided for @countsWhat.
  ///
  /// In en, this message translates to:
  /// **'What to count'**
  String get countsWhat;

  /// No description provided for @countsByAll.
  ///
  /// In en, this message translates to:
  /// **'All goods in the store'**
  String get countsByAll;

  /// No description provided for @countsByBrand.
  ///
  /// In en, this message translates to:
  /// **'One brand'**
  String get countsByBrand;

  /// No description provided for @countsByCategory.
  ///
  /// In en, this message translates to:
  /// **'One category'**
  String get countsByCategory;

  /// No description provided for @countsByStyleId.
  ///
  /// In en, this message translates to:
  /// **'One design'**
  String get countsByStyleId;

  /// No description provided for @countsName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get countsName;

  /// No description provided for @countsNamePlaceholder.
  ///
  /// In en, this message translates to:
  /// **'e.g. Kurta wall'**
  String get countsNamePlaceholder;

  /// No description provided for @countsBlind.
  ///
  /// In en, this message translates to:
  /// **'Blind count (counters do not see the book figures)'**
  String get countsBlind;

  /// No description provided for @countsBlindShort.
  ///
  /// In en, this message translates to:
  /// **'blind count'**
  String get countsBlindShort;

  /// No description provided for @countsStart.
  ///
  /// In en, this message translates to:
  /// **'Start counting'**
  String get countsStart;

  /// No description provided for @countsScanHere.
  ///
  /// In en, this message translates to:
  /// **'Scan a barcode'**
  String get countsScanHere;

  /// No description provided for @countsAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get countsAdd;

  /// No description provided for @countsScanHint.
  ///
  /// In en, this message translates to:
  /// **'Each scan adds one piece. Type 5*barcode for five, or type the count in the table below.'**
  String get countsScanHint;

  /// No description provided for @countsOutOfScope.
  ///
  /// In en, this message translates to:
  /// **'not in this count, added'**
  String get countsOutOfScope;

  /// No description provided for @countsStatusCounting.
  ///
  /// In en, this message translates to:
  /// **'Counting'**
  String get countsStatusCounting;

  /// No description provided for @countsStatusSubmitted.
  ///
  /// In en, this message translates to:
  /// **'Waiting for approval'**
  String get countsStatusSubmitted;

  /// No description provided for @countsStatusApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved, books adjusted'**
  String get countsStatusApproved;

  /// No description provided for @countsStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get countsStatusCancelled;

  /// No description provided for @countsJournal.
  ///
  /// In en, this message translates to:
  /// **'See the stock adjustment'**
  String get countsJournal;

  /// No description provided for @countsPiecesCounted.
  ///
  /// In en, this message translates to:
  /// **'Pieces counted'**
  String get countsPiecesCounted;

  /// No description provided for @countsItemsCounted.
  ///
  /// In en, this message translates to:
  /// **'Items counted'**
  String get countsItemsCounted;

  /// No description provided for @countsInBooks.
  ///
  /// In en, this message translates to:
  /// **'In the books'**
  String get countsInBooks;

  /// No description provided for @countsShort.
  ///
  /// In en, this message translates to:
  /// **'Short (value)'**
  String get countsShort;

  /// No description provided for @countsExcess.
  ///
  /// In en, this message translates to:
  /// **'Extra (value)'**
  String get countsExcess;

  /// No description provided for @countsNet.
  ///
  /// In en, this message translates to:
  /// **'Net difference'**
  String get countsNet;

  /// No description provided for @countsBlindNote.
  ///
  /// In en, this message translates to:
  /// **'Blind count: the book figures show after you submit.'**
  String get countsBlindNote;

  /// No description provided for @countsSubmit.
  ///
  /// In en, this message translates to:
  /// **'Finish counting'**
  String get countsSubmit;

  /// No description provided for @countsReason.
  ///
  /// In en, this message translates to:
  /// **'Reason for the differences'**
  String get countsReason;

  /// No description provided for @countsApproveAdjust.
  ///
  /// In en, this message translates to:
  /// **'Approve and adjust {n, plural, one {{n} item} other {{n} items}}'**
  String countsApproveAdjust(num n);

  /// No description provided for @countsApproveNone.
  ///
  /// In en, this message translates to:
  /// **'Approve (no differences)'**
  String get countsApproveNone;

  /// No description provided for @countsRecount.
  ///
  /// In en, this message translates to:
  /// **'Send back to count again'**
  String get countsRecount;

  /// No description provided for @countsWaitingApproval.
  ///
  /// In en, this message translates to:
  /// **'An owner or admin approves the differences.'**
  String get countsWaitingApproval;

  /// No description provided for @countsCancelConfirm.
  ///
  /// In en, this message translates to:
  /// **'Cancel this count? Nothing in the books changes.'**
  String get countsCancelConfirm;

  /// No description provided for @countsCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel count'**
  String get countsCancel;

  /// No description provided for @countsOnlyDiff.
  ///
  /// In en, this message translates to:
  /// **'Show only items that differ'**
  String get countsOnlyDiff;

  /// No description provided for @countsItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get countsItem;

  /// No description provided for @countsCounted.
  ///
  /// In en, this message translates to:
  /// **'Counted'**
  String get countsCounted;

  /// No description provided for @countsDiff.
  ///
  /// In en, this message translates to:
  /// **'Difference'**
  String get countsDiff;

  /// No description provided for @countsValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get countsValue;

  /// No description provided for @countsNoDiff.
  ///
  /// In en, this message translates to:
  /// **'Nothing differs from the books.'**
  String get countsNoDiff;

  /// No description provided for @countsNumber.
  ///
  /// In en, this message translates to:
  /// **'Count'**
  String get countsNumber;

  /// No description provided for @countsStarted.
  ///
  /// In en, this message translates to:
  /// **'Started'**
  String get countsStarted;

  /// No description provided for @countsState.
  ///
  /// In en, this message translates to:
  /// **'Stage'**
  String get countsState;

  /// No description provided for @countsNone.
  ///
  /// In en, this message translates to:
  /// **'No counts yet.'**
  String get countsNone;

  /// No description provided for @countsErrorsCountClosed.
  ///
  /// In en, this message translates to:
  /// **'This count is no longer open for counting.'**
  String get countsErrorsCountClosed;

  /// No description provided for @countsErrorsCountNotSubmitted.
  ///
  /// In en, this message translates to:
  /// **'Finish counting first.'**
  String get countsErrorsCountNotSubmitted;

  /// No description provided for @countsErrorsReasonRequired.
  ///
  /// In en, this message translates to:
  /// **'Give a reason for the differences.'**
  String get countsErrorsReasonRequired;

  /// No description provided for @countsErrorsUnknownBarcode.
  ///
  /// In en, this message translates to:
  /// **'No item has this barcode.'**
  String get countsErrorsUnknownBarcode;

  /// No description provided for @countsErrorsNothingToCount.
  ///
  /// In en, this message translates to:
  /// **'No goods match that choice.'**
  String get countsErrorsNothingToCount;

  /// No description provided for @countsErrorsUnknownWarehouse.
  ///
  /// In en, this message translates to:
  /// **'Choose a store.'**
  String get countsErrorsUnknownWarehouse;

  /// No description provided for @countsErrorsTooManyCodes.
  ///
  /// In en, this message translates to:
  /// **'The file has more than 5,000 different barcodes. Split it and import in parts.'**
  String get countsErrorsTooManyCodes;

  /// No description provided for @countsImportTitle.
  ///
  /// In en, this message translates to:
  /// **'Import a scanner file'**
  String get countsImportTitle;

  /// No description provided for @countsImportHelp.
  ///
  /// In en, this message translates to:
  /// **'A text file from a handheld scanner: one barcode per line, or a barcode and a quantity (\"8901234567890,3\"). Repeated barcodes add up.'**
  String get countsImportHelp;

  /// No description provided for @countsImportMode.
  ///
  /// In en, this message translates to:
  /// **'What to do with the numbers'**
  String get countsImportMode;

  /// No description provided for @countsImportAdd.
  ///
  /// In en, this message translates to:
  /// **'Add to what is already counted'**
  String get countsImportAdd;

  /// No description provided for @countsImportReplace.
  ///
  /// In en, this message translates to:
  /// **'Replace the count for these barcodes'**
  String get countsImportReplace;

  /// No description provided for @countsImportChoose.
  ///
  /// In en, this message translates to:
  /// **'Choose file'**
  String get countsImportChoose;

  /// No description provided for @countsImportReading.
  ///
  /// In en, this message translates to:
  /// **'Reading...'**
  String get countsImportReading;

  /// No description provided for @countsImportTooBig.
  ///
  /// In en, this message translates to:
  /// **'That file is too large (over 2 MB).'**
  String get countsImportTooBig;

  /// No description provided for @countsImportDone.
  ///
  /// In en, this message translates to:
  /// **'{matched, plural, one {{matched} item counted} other {{matched} items counted}}, {pieces} pieces'**
  String countsImportDone(num matched, String pieces);

  /// No description provided for @countsImportExtra.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} item was not on this count\'s list and was added.} other {{n} items were not on this count\'s list and were added.}}'**
  String countsImportExtra(num n);

  /// No description provided for @countsImportUnknown.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} code is not an item: {list}} other {{n} codes are not items: {list}}}'**
  String countsImportUnknown(num n, String list);

  /// No description provided for @countsImportSkipped.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} line could not be read (line {list})} other {{n} lines could not be read (lines {list})}}'**
  String countsImportSkipped(num n, String list);

  /// No description provided for @stockTitle.
  ///
  /// In en, this message translates to:
  /// **'Stock summary'**
  String get stockTitle;

  /// No description provided for @stockSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Quantity and value of every item. Valued by {method}.'**
  String stockSubtitle(String method);

  /// No description provided for @stockMethodAverage.
  ///
  /// In en, this message translates to:
  /// **'moving average'**
  String get stockMethodAverage;

  /// No description provided for @stockMethodFifo.
  ///
  /// In en, this message translates to:
  /// **'FIFO (first in, first out)'**
  String get stockMethodFifo;

  /// No description provided for @stockWarehouse.
  ///
  /// In en, this message translates to:
  /// **'Warehouse'**
  String get stockWarehouse;

  /// No description provided for @stockAllWarehouses.
  ///
  /// In en, this message translates to:
  /// **'All warehouses'**
  String get stockAllWarehouses;

  /// No description provided for @stockQty.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get stockQty;

  /// No description provided for @stockRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get stockRate;

  /// No description provided for @stockValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get stockValue;

  /// No description provided for @stockTotalValue.
  ///
  /// In en, this message translates to:
  /// **'Total stock value'**
  String get stockTotalValue;

  /// No description provided for @stockBelowReorder.
  ///
  /// In en, this message translates to:
  /// **'Below reorder level'**
  String get stockBelowReorder;

  /// No description provided for @stockReorderTitle.
  ///
  /// In en, this message translates to:
  /// **'Items to reorder'**
  String get stockReorderTitle;

  /// No description provided for @stockReorderEmpty.
  ///
  /// In en, this message translates to:
  /// **'Nothing is below its reorder level.'**
  String get stockReorderEmpty;

  /// No description provided for @stockSuggested.
  ///
  /// In en, this message translates to:
  /// **'Suggested order'**
  String get stockSuggested;

  /// No description provided for @stockLedgerTitle.
  ///
  /// In en, this message translates to:
  /// **'Stock ledger: {item}'**
  String stockLedgerTitle(String item);

  /// No description provided for @stockIn.
  ///
  /// In en, this message translates to:
  /// **'In'**
  String get stockIn;

  /// No description provided for @stockOut.
  ///
  /// In en, this message translates to:
  /// **'Out'**
  String get stockOut;

  /// No description provided for @stockSourceStockJournal.
  ///
  /// In en, this message translates to:
  /// **'Stock journal'**
  String get stockSourceStockJournal;

  /// No description provided for @stockSourceGrn.
  ///
  /// In en, this message translates to:
  /// **'Goods receipt'**
  String get stockSourceGrn;

  /// No description provided for @stockSourcePurchaseBill.
  ///
  /// In en, this message translates to:
  /// **'Purchase bill'**
  String get stockSourcePurchaseBill;

  /// No description provided for @stockSourcePurchaseReturn.
  ///
  /// In en, this message translates to:
  /// **'Purchase return'**
  String get stockSourcePurchaseReturn;

  /// No description provided for @stockNegativeWarning.
  ///
  /// In en, this message translates to:
  /// **'Stock of an item went below zero. Check for a missing purchase entry.'**
  String get stockNegativeWarning;

  /// No description provided for @sjTitle.
  ///
  /// In en, this message translates to:
  /// **'Stock journals'**
  String get sjTitle;

  /// No description provided for @sjSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Opening stock, physical-count adjustments, transfers between warehouses, and consumption.'**
  String get sjSubtitle;

  /// No description provided for @sjNew.
  ///
  /// In en, this message translates to:
  /// **'New stock journal'**
  String get sjNew;

  /// No description provided for @sjKindsOpening.
  ///
  /// In en, this message translates to:
  /// **'Opening stock'**
  String get sjKindsOpening;

  /// No description provided for @sjKindsAdjustment.
  ///
  /// In en, this message translates to:
  /// **'Adjustment'**
  String get sjKindsAdjustment;

  /// No description provided for @sjKindsTransfer.
  ///
  /// In en, this message translates to:
  /// **'Transfer'**
  String get sjKindsTransfer;

  /// No description provided for @sjKindsIssue.
  ///
  /// In en, this message translates to:
  /// **'Issue / consumption'**
  String get sjKindsIssue;

  /// No description provided for @sjKindHintsOpening.
  ///
  /// In en, this message translates to:
  /// **'Stock you had when your books began. Enter the quantity and cost.'**
  String get sjKindHintsOpening;

  /// No description provided for @sjKindHintsAdjustment.
  ///
  /// In en, this message translates to:
  /// **'Correct stock after a physical count: add or remove quantity.'**
  String get sjKindHintsAdjustment;

  /// No description provided for @sjKindHintsTransfer.
  ///
  /// In en, this message translates to:
  /// **'Move goods between warehouses at their current cost.'**
  String get sjKindHintsTransfer;

  /// No description provided for @sjKindHintsIssue.
  ///
  /// In en, this message translates to:
  /// **'Goods used up in the business (samples, own use, production).'**
  String get sjKindHintsIssue;

  /// No description provided for @sjDirection.
  ///
  /// In en, this message translates to:
  /// **'Add / remove'**
  String get sjDirection;

  /// No description provided for @sjAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get sjAdd;

  /// No description provided for @sjRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get sjRemove;

  /// No description provided for @sjToWarehouse.
  ///
  /// In en, this message translates to:
  /// **'To warehouse'**
  String get sjToWarehouse;

  /// No description provided for @sjBatch.
  ///
  /// In en, this message translates to:
  /// **'Batch'**
  String get sjBatch;

  /// No description provided for @sjExpiry.
  ///
  /// In en, this message translates to:
  /// **'Expiry'**
  String get sjExpiry;

  /// No description provided for @sjPost.
  ///
  /// In en, this message translates to:
  /// **'Post stock journal'**
  String get sjPost;

  /// No description provided for @sjErrorsRateRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter the cost rate for opening stock.'**
  String get sjErrorsRateRequired;

  /// No description provided for @sjErrorsServiceHasNoStock.
  ///
  /// In en, this message translates to:
  /// **'Services don\'t have stock.'**
  String get sjErrorsServiceHasNoStock;

  /// No description provided for @sjErrorsTransferNeedsTwoWarehouses.
  ///
  /// In en, this message translates to:
  /// **'Choose two different warehouses.'**
  String get sjErrorsTransferNeedsTwoWarehouses;

  /// No description provided for @sjErrorsBatchRequired.
  ///
  /// In en, this message translates to:
  /// **'This item tracks batches: enter a batch number.'**
  String get sjErrorsBatchRequired;

  /// No description provided for @sjErrorsQtyMustBePositive.
  ///
  /// In en, this message translates to:
  /// **'Quantities must be more than zero.'**
  String get sjErrorsQtyMustBePositive;

  /// No description provided for @purchaseSupplier.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get purchaseSupplier;

  /// No description provided for @purchaseChooseSupplier.
  ///
  /// In en, this message translates to:
  /// **'Choose supplier…'**
  String get purchaseChooseSupplier;

  /// No description provided for @purchaseItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get purchaseItem;

  /// No description provided for @purchaseChooseItem.
  ///
  /// In en, this message translates to:
  /// **'Choose item…'**
  String get purchaseChooseItem;

  /// No description provided for @purchaseQty.
  ///
  /// In en, this message translates to:
  /// **'Qty'**
  String get purchaseQty;

  /// No description provided for @purchaseRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get purchaseRate;

  /// No description provided for @purchaseDiscount.
  ///
  /// In en, this message translates to:
  /// **'Discount'**
  String get purchaseDiscount;

  /// No description provided for @purchaseGst.
  ///
  /// In en, this message translates to:
  /// **'GST %'**
  String get purchaseGst;

  /// No description provided for @purchaseAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get purchaseAmount;

  /// No description provided for @purchaseTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable value'**
  String get purchaseTaxable;

  /// No description provided for @purchaseTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get purchaseTotal;

  /// No description provided for @purchaseStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get purchaseStatus;

  /// No description provided for @purchaseStatusesOpen.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get purchaseStatusesOpen;

  /// No description provided for @purchaseStatusesPartial.
  ///
  /// In en, this message translates to:
  /// **'Partly received'**
  String get purchaseStatusesPartial;

  /// No description provided for @purchaseStatusesReceived.
  ///
  /// In en, this message translates to:
  /// **'Received'**
  String get purchaseStatusesReceived;

  /// No description provided for @purchaseStatusesClosed.
  ///
  /// In en, this message translates to:
  /// **'Closed'**
  String get purchaseStatusesClosed;

  /// No description provided for @purchaseStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get purchaseStatusesCancelled;

  /// No description provided for @purchaseStatusesPosted.
  ///
  /// In en, this message translates to:
  /// **'Posted'**
  String get purchaseStatusesPosted;

  /// No description provided for @purchaseStatusesBilled.
  ///
  /// In en, this message translates to:
  /// **'Billed'**
  String get purchaseStatusesBilled;

  /// No description provided for @purchaseOrdersTitle.
  ///
  /// In en, this message translates to:
  /// **'Purchase orders'**
  String get purchaseOrdersTitle;

  /// No description provided for @purchaseOrdersSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What you\'ve ordered from suppliers and how much has arrived.'**
  String get purchaseOrdersSubtitle;

  /// No description provided for @purchaseOrdersNew.
  ///
  /// In en, this message translates to:
  /// **'New purchase order'**
  String get purchaseOrdersNew;

  /// No description provided for @purchaseOrdersExpectedOn.
  ///
  /// In en, this message translates to:
  /// **'Expected by'**
  String get purchaseOrdersExpectedOn;

  /// No description provided for @purchaseOrdersOrdered.
  ///
  /// In en, this message translates to:
  /// **'Ordered'**
  String get purchaseOrdersOrdered;

  /// No description provided for @purchaseOrdersReceived.
  ///
  /// In en, this message translates to:
  /// **'Received'**
  String get purchaseOrdersReceived;

  /// No description provided for @purchaseOrdersBilled.
  ///
  /// In en, this message translates to:
  /// **'Billed'**
  String get purchaseOrdersBilled;

  /// No description provided for @purchaseOrdersReceive.
  ///
  /// In en, this message translates to:
  /// **'Receive goods'**
  String get purchaseOrdersReceive;

  /// No description provided for @purchaseOrdersBill.
  ///
  /// In en, this message translates to:
  /// **'Record bill'**
  String get purchaseOrdersBill;

  /// No description provided for @purchaseOrdersClose.
  ///
  /// In en, this message translates to:
  /// **'Close order'**
  String get purchaseOrdersClose;

  /// No description provided for @purchaseReceiptsTitle.
  ///
  /// In en, this message translates to:
  /// **'Inward challans'**
  String get purchaseReceiptsTitle;

  /// No description provided for @purchaseReceiptsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods that arrived (GRN). Stock goes up on receipt; the bill comes later.'**
  String get purchaseReceiptsSubtitle;

  /// No description provided for @purchaseReceiptsNew.
  ///
  /// In en, this message translates to:
  /// **'New inward challan'**
  String get purchaseReceiptsNew;

  /// No description provided for @purchaseReceiptsChallan.
  ///
  /// In en, this message translates to:
  /// **'Supplier challan no.'**
  String get purchaseReceiptsChallan;

  /// No description provided for @purchaseReceiptsBill.
  ///
  /// In en, this message translates to:
  /// **'Record bill'**
  String get purchaseReceiptsBill;

  /// No description provided for @purchaseReceiptsFromOrder.
  ///
  /// In en, this message translates to:
  /// **'Against order {number}'**
  String purchaseReceiptsFromOrder(String number);

  /// No description provided for @purchaseBillsTitle.
  ///
  /// In en, this message translates to:
  /// **'Purchase bills'**
  String get purchaseBillsTitle;

  /// No description provided for @purchaseBillsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Supplier invoices. Each one posts to purchases, input GST and the supplier\'s account.'**
  String get purchaseBillsSubtitle;

  /// No description provided for @purchaseBillsNew.
  ///
  /// In en, this message translates to:
  /// **'New purchase bill'**
  String get purchaseBillsNew;

  /// No description provided for @purchaseBillsInvoiceNo.
  ///
  /// In en, this message translates to:
  /// **'Supplier invoice no.'**
  String get purchaseBillsInvoiceNo;

  /// No description provided for @purchaseBillsInvoiceDate.
  ///
  /// In en, this message translates to:
  /// **'Supplier invoice date'**
  String get purchaseBillsInvoiceDate;

  /// No description provided for @purchaseBillsPostingDate.
  ///
  /// In en, this message translates to:
  /// **'Posting date'**
  String get purchaseBillsPostingDate;

  /// No description provided for @purchaseBillsDueOn.
  ///
  /// In en, this message translates to:
  /// **'Due on'**
  String get purchaseBillsDueOn;

  /// No description provided for @purchaseBillsReverseCharge.
  ///
  /// In en, this message translates to:
  /// **'Reverse charge (tax paid by us)'**
  String get purchaseBillsReverseCharge;

  /// No description provided for @purchaseBillsReturn.
  ///
  /// In en, this message translates to:
  /// **'Return goods'**
  String get purchaseBillsReturn;

  /// No description provided for @purchaseBillsReturned.
  ///
  /// In en, this message translates to:
  /// **'Returned'**
  String get purchaseBillsReturned;

  /// No description provided for @purchaseBillsPost.
  ///
  /// In en, this message translates to:
  /// **'Post bill'**
  String get purchaseBillsPost;

  /// No description provided for @purchaseBillsRateWarning.
  ///
  /// In en, this message translates to:
  /// **'The bill rate differs from the goods receipt on line {line}. Stock stays at the receipt rate.'**
  String purchaseBillsRateWarning(String line);

  /// No description provided for @purchaseReturnsTitle.
  ///
  /// In en, this message translates to:
  /// **'Purchase returns'**
  String get purchaseReturnsTitle;

  /// No description provided for @purchaseReturnsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods sent back to suppliers (debit notes).'**
  String get purchaseReturnsSubtitle;

  /// No description provided for @purchaseReturnsNew.
  ///
  /// In en, this message translates to:
  /// **'Return goods'**
  String get purchaseReturnsNew;

  /// No description provided for @purchaseReturnsReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get purchaseReturnsReason;

  /// No description provided for @purchaseReturnsPost.
  ///
  /// In en, this message translates to:
  /// **'Post debit note'**
  String get purchaseReturnsPost;

  /// No description provided for @purchaseReturnsBillNo.
  ///
  /// In en, this message translates to:
  /// **'Against bill {number}'**
  String purchaseReturnsBillNo(String number);

  /// No description provided for @purchaseErrorsNotASupplier.
  ///
  /// In en, this message translates to:
  /// **'Choose an account under Sundry Creditors.'**
  String get purchaseErrorsNotASupplier;

  /// No description provided for @purchaseErrorsUnknownSupplier.
  ///
  /// In en, this message translates to:
  /// **'Choose a supplier.'**
  String get purchaseErrorsUnknownSupplier;

  /// No description provided for @purchaseErrorsOverReceipt.
  ///
  /// In en, this message translates to:
  /// **'That\'s more than is still due on the order.'**
  String get purchaseErrorsOverReceipt;

  /// No description provided for @purchaseErrorsOverBilling.
  ///
  /// In en, this message translates to:
  /// **'That\'s more than was received and not yet billed.'**
  String get purchaseErrorsOverBilling;

  /// No description provided for @purchaseErrorsOverReturn.
  ///
  /// In en, this message translates to:
  /// **'That\'s more than was billed and not yet returned.'**
  String get purchaseErrorsOverReturn;

  /// No description provided for @purchaseErrorsDuplicateSupplierInvoice.
  ///
  /// In en, this message translates to:
  /// **'This supplier invoice has already been booked.'**
  String get purchaseErrorsDuplicateSupplierInvoice;

  /// No description provided for @purchaseErrorsBillHasReturns.
  ///
  /// In en, this message translates to:
  /// **'Cancel the returns against this bill first.'**
  String get purchaseErrorsBillHasReturns;

  /// No description provided for @purchaseErrorsReceiptIsBilled.
  ///
  /// In en, this message translates to:
  /// **'This receipt has been billed; cancel the bill first.'**
  String get purchaseErrorsReceiptIsBilled;

  /// No description provided for @purchaseErrorsOrderHasReceipts.
  ///
  /// In en, this message translates to:
  /// **'Goods were received against this order; close it instead.'**
  String get purchaseErrorsOrderHasReceipts;

  /// No description provided for @purchaseErrorsOrderNotOpen.
  ///
  /// In en, this message translates to:
  /// **'This order is closed.'**
  String get purchaseErrorsOrderNotOpen;

  /// No description provided for @purchaseErrorsInvoiceAfterPostingDate.
  ///
  /// In en, this message translates to:
  /// **'The supplier\'s invoice date can\'t be after the posting date.'**
  String get purchaseErrorsInvoiceAfterPostingDate;

  /// No description provided for @purchaseErrorsNoLines.
  ///
  /// In en, this message translates to:
  /// **'Add at least one line.'**
  String get purchaseErrorsNoLines;

  /// No description provided for @purchaseErrorsItemArchived.
  ///
  /// In en, this message translates to:
  /// **'One of the items is archived.'**
  String get purchaseErrorsItemArchived;

  /// No description provided for @purchaseReadButton.
  ///
  /// In en, this message translates to:
  /// **'Read bill'**
  String get purchaseReadButton;

  /// No description provided for @purchaseReadHint.
  ///
  /// In en, this message translates to:
  /// **'Photo or PDF of the supplier\'s bill: the form is filled in for you to check.'**
  String get purchaseReadHint;

  /// No description provided for @purchaseReadReading.
  ///
  /// In en, this message translates to:
  /// **'Reading the bill…'**
  String get purchaseReadReading;

  /// No description provided for @purchaseReadDone.
  ///
  /// In en, this message translates to:
  /// **'Filled in from the bill. Please check every line before saving.'**
  String get purchaseReadDone;

  /// No description provided for @purchaseReadUnmatched.
  ///
  /// In en, this message translates to:
  /// **'Choose the item for: {items}.'**
  String purchaseReadUnmatched(String items);

  /// No description provided for @purchaseReadDemo.
  ///
  /// In en, this message translates to:
  /// **'Automatic reading isn\'t set up; please type the bill.'**
  String get purchaseReadDemo;

  /// No description provided for @purchaseReadNone.
  ///
  /// In en, this message translates to:
  /// **'Couldn\'t read this bill; please type it.'**
  String get purchaseReadNone;

  /// No description provided for @inventorySettingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Inventory settings'**
  String get inventorySettingsTitle;

  /// No description provided for @inventorySettingsValuation.
  ///
  /// In en, this message translates to:
  /// **'Stock valuation method'**
  String get inventorySettingsValuation;

  /// No description provided for @inventorySettingsValuationHint.
  ///
  /// In en, this message translates to:
  /// **'How issued and remaining stock is valued. Changing it revalues all stock from the beginning.'**
  String get inventorySettingsValuationHint;

  /// No description provided for @inventorySettingsWarehouses.
  ///
  /// In en, this message translates to:
  /// **'Warehouses'**
  String get inventorySettingsWarehouses;

  /// No description provided for @inventorySettingsAddWarehouse.
  ///
  /// In en, this message translates to:
  /// **'Add warehouse'**
  String get inventorySettingsAddWarehouse;

  /// No description provided for @inventorySettingsWarehouseName.
  ///
  /// In en, this message translates to:
  /// **'Warehouse name'**
  String get inventorySettingsWarehouseName;

  /// No description provided for @inventorySettingsDefault.
  ///
  /// In en, this message translates to:
  /// **'Default'**
  String get inventorySettingsDefault;

  /// No description provided for @inventorySettingsNameTaken.
  ///
  /// In en, this message translates to:
  /// **'A warehouse with this name already exists.'**
  String get inventorySettingsNameTaken;

  /// No description provided for @salesCustomer.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get salesCustomer;

  /// No description provided for @salesChooseCustomer.
  ///
  /// In en, this message translates to:
  /// **'Choose customer…'**
  String get salesChooseCustomer;

  /// No description provided for @salesPlaceOfSupply.
  ///
  /// In en, this message translates to:
  /// **'Place of supply'**
  String get salesPlaceOfSupply;

  /// No description provided for @salesExport.
  ///
  /// In en, this message translates to:
  /// **'Export'**
  String get salesExport;

  /// No description provided for @salesSez.
  ///
  /// In en, this message translates to:
  /// **'SEZ customer'**
  String get salesSez;

  /// No description provided for @salesLut.
  ///
  /// In en, this message translates to:
  /// **'Under LUT (without tax)'**
  String get salesLut;

  /// No description provided for @salesStatusesDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get salesStatusesDelivered;

  /// No description provided for @salesStatusesInvoiced.
  ///
  /// In en, this message translates to:
  /// **'Invoiced'**
  String get salesStatusesInvoiced;

  /// No description provided for @salesStatusesAccepted.
  ///
  /// In en, this message translates to:
  /// **'Accepted'**
  String get salesStatusesAccepted;

  /// No description provided for @salesStatusesDeclined.
  ///
  /// In en, this message translates to:
  /// **'Declined'**
  String get salesStatusesDeclined;

  /// No description provided for @salesStatusesConverted.
  ///
  /// In en, this message translates to:
  /// **'Converted'**
  String get salesStatusesConverted;

  /// No description provided for @salesStatusesExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get salesStatusesExpired;

  /// No description provided for @salesOrdersTitle.
  ///
  /// In en, this message translates to:
  /// **'Sales orders'**
  String get salesOrdersTitle;

  /// No description provided for @salesOrdersSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What customers have ordered and how much has gone out.'**
  String get salesOrdersSubtitle;

  /// No description provided for @salesOrdersNew.
  ///
  /// In en, this message translates to:
  /// **'New sales order'**
  String get salesOrdersNew;

  /// No description provided for @salesOrdersDeliverBy.
  ///
  /// In en, this message translates to:
  /// **'Deliver by'**
  String get salesOrdersDeliverBy;

  /// No description provided for @salesOrdersCustomerRef.
  ///
  /// In en, this message translates to:
  /// **'Customer\'s PO no.'**
  String get salesOrdersCustomerRef;

  /// No description provided for @salesOrdersOrdered.
  ///
  /// In en, this message translates to:
  /// **'Ordered'**
  String get salesOrdersOrdered;

  /// No description provided for @salesOrdersDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get salesOrdersDelivered;

  /// No description provided for @salesOrdersInvoiced.
  ///
  /// In en, this message translates to:
  /// **'Invoiced'**
  String get salesOrdersInvoiced;

  /// No description provided for @salesOrdersDeliver.
  ///
  /// In en, this message translates to:
  /// **'Deliver goods'**
  String get salesOrdersDeliver;

  /// No description provided for @salesOrdersInvoice.
  ///
  /// In en, this message translates to:
  /// **'Create invoice'**
  String get salesOrdersInvoice;

  /// No description provided for @salesOrdersClose.
  ///
  /// In en, this message translates to:
  /// **'Close order'**
  String get salesOrdersClose;

  /// No description provided for @salesDeliveriesTitle.
  ///
  /// In en, this message translates to:
  /// **'Delivery challans'**
  String get salesDeliveriesTitle;

  /// No description provided for @salesDeliveriesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods sent out before (or without) an invoice. Stock goes down on delivery.'**
  String get salesDeliveriesSubtitle;

  /// No description provided for @salesDeliveriesNew.
  ///
  /// In en, this message translates to:
  /// **'New delivery challan'**
  String get salesDeliveriesNew;

  /// No description provided for @salesDeliveriesInvoice.
  ///
  /// In en, this message translates to:
  /// **'Create invoice'**
  String get salesDeliveriesInvoice;

  /// No description provided for @salesDeliveriesFromOrder.
  ///
  /// In en, this message translates to:
  /// **'Against order {number}'**
  String salesDeliveriesFromOrder(String number);

  /// No description provided for @salesDeliveriesReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get salesDeliveriesReason;

  /// No description provided for @salesDeliveriesValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get salesDeliveriesValue;

  /// No description provided for @salesDeliveriesTransporter.
  ///
  /// In en, this message translates to:
  /// **'Transporter'**
  String get salesDeliveriesTransporter;

  /// No description provided for @salesDeliveriesVehicleNo.
  ///
  /// In en, this message translates to:
  /// **'Vehicle no.'**
  String get salesDeliveriesVehicleNo;

  /// No description provided for @salesDeliveriesPrint.
  ///
  /// In en, this message translates to:
  /// **'Print challan (3 copies)'**
  String get salesDeliveriesPrint;

  /// No description provided for @salesDeliveriesInvoiceBy.
  ///
  /// In en, this message translates to:
  /// **'invoice by {date}'**
  String salesDeliveriesInvoiceBy(String date);

  /// No description provided for @salesDeliveriesReturnsMade.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {Goods came back once} other {Goods came back {count} times}}: {dates}'**
  String salesDeliveriesReturnsMade(num count, String dates);

  /// No description provided for @salesDeliveriesTakeBack.
  ///
  /// In en, this message translates to:
  /// **'Take goods back'**
  String get salesDeliveriesTakeBack;

  /// No description provided for @salesDeliveriesStillOut.
  ///
  /// In en, this message translates to:
  /// **'Still out'**
  String get salesDeliveriesStillOut;

  /// No description provided for @salesDeliveriesCameBack.
  ///
  /// In en, this message translates to:
  /// **'Came back'**
  String get salesDeliveriesCameBack;

  /// No description provided for @salesDeliveriesSaveReturn.
  ///
  /// In en, this message translates to:
  /// **'Save return'**
  String get salesDeliveriesSaveReturn;

  /// No description provided for @salesDeliveriesNewApproval.
  ///
  /// In en, this message translates to:
  /// **'New approval memo'**
  String get salesDeliveriesNewApproval;

  /// No description provided for @salesDeliveriesReasonsSupply.
  ///
  /// In en, this message translates to:
  /// **'Supply, invoice to follow'**
  String get salesDeliveriesReasonsSupply;

  /// No description provided for @salesDeliveriesReasonsApproval.
  ///
  /// In en, this message translates to:
  /// **'Sale on approval'**
  String get salesDeliveriesReasonsApproval;

  /// No description provided for @salesDeliveriesReasonsJobWork.
  ///
  /// In en, this message translates to:
  /// **'Job work'**
  String get salesDeliveriesReasonsJobWork;

  /// No description provided for @salesDeliveriesReasonsNotSupply.
  ///
  /// In en, this message translates to:
  /// **'Not a supply (own use, repair)'**
  String get salesDeliveriesReasonsNotSupply;

  /// No description provided for @salesDeliveriesReasonsLots.
  ///
  /// In en, this message translates to:
  /// **'Supply in lots'**
  String get salesDeliveriesReasonsLots;

  /// No description provided for @salesDeliveriesReasonsExhibition.
  ///
  /// In en, this message translates to:
  /// **'Exhibition or fair'**
  String get salesDeliveriesReasonsExhibition;

  /// No description provided for @salesDeliveriesReasonsOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get salesDeliveriesReasonsOther;

  /// No description provided for @salesDeliveriesReasonsSample.
  ///
  /// In en, this message translates to:
  /// **'Samples'**
  String get salesDeliveriesReasonsSample;

  /// No description provided for @salesDeliveriesReasonHintsSupply.
  ///
  /// In en, this message translates to:
  /// **'Goods sold; the tax invoice follows.'**
  String get salesDeliveriesReasonHintsSupply;

  /// No description provided for @salesDeliveriesReasonHintsApproval.
  ///
  /// In en, this message translates to:
  /// **'The customer keeps what sells. Invoice within six months or take the goods back.'**
  String get salesDeliveriesReasonHintsApproval;

  /// No description provided for @salesDeliveriesReasonHintsJobWork.
  ///
  /// In en, this message translates to:
  /// **'Sent for processing; the goods come back.'**
  String get salesDeliveriesReasonHintsJobWork;

  /// No description provided for @salesDeliveriesReasonHintsNotSupply.
  ///
  /// In en, this message translates to:
  /// **'Goods move without a sale, so no tax is shown.'**
  String get salesDeliveriesReasonHintsNotSupply;

  /// No description provided for @salesDeliveriesReasonHintsLots.
  ///
  /// In en, this message translates to:
  /// **'One supply sent in several lots.'**
  String get salesDeliveriesReasonHintsLots;

  /// No description provided for @salesDeliveriesReasonHintsExhibition.
  ///
  /// In en, this message translates to:
  /// **'Shown at an exhibition; unsold goods come back.'**
  String get salesDeliveriesReasonHintsExhibition;

  /// No description provided for @salesDeliveriesReasonHintsOther.
  ///
  /// In en, this message translates to:
  /// **'Any other movement of goods.'**
  String get salesDeliveriesReasonHintsOther;

  /// No description provided for @salesDeliveriesReasonHintsSample.
  ///
  /// In en, this message translates to:
  /// **'Sent to show or try; not a sale, so no tax is shown. Unkept pieces come back on a return.'**
  String get salesDeliveriesReasonHintsSample;

  /// No description provided for @salesInvoicesTitle.
  ///
  /// In en, this message translates to:
  /// **'Sales invoices'**
  String get salesInvoicesTitle;

  /// No description provided for @salesInvoicesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Tax invoices. Each one posts to sales, output GST and the customer\'s account.'**
  String get salesInvoicesSubtitle;

  /// No description provided for @salesInvoicesNew.
  ///
  /// In en, this message translates to:
  /// **'New invoice'**
  String get salesInvoicesNew;

  /// No description provided for @salesInvoicesDueOn.
  ///
  /// In en, this message translates to:
  /// **'Due on'**
  String get salesInvoicesDueOn;

  /// No description provided for @salesInvoicesPost.
  ///
  /// In en, this message translates to:
  /// **'Save invoice'**
  String get salesInvoicesPost;

  /// No description provided for @salesInvoicesPrint.
  ///
  /// In en, this message translates to:
  /// **'Print'**
  String get salesInvoicesPrint;

  /// No description provided for @salesInvoicesCreditNote.
  ///
  /// In en, this message translates to:
  /// **'Credit note / return'**
  String get salesInvoicesCreditNote;

  /// No description provided for @salesInvoicesReturned.
  ///
  /// In en, this message translates to:
  /// **'Returned'**
  String get salesInvoicesReturned;

  /// No description provided for @salesInvoicesWarningsCreditLimitExceeded.
  ///
  /// In en, this message translates to:
  /// **'This takes the customer over their credit limit ({detail} outstanding).'**
  String salesInvoicesWarningsCreditLimitExceeded(String detail);

  /// No description provided for @salesInvoicesWarningsEwayBillRequired.
  ///
  /// In en, this message translates to:
  /// **'Goods worth {detail}: an e-way bill is needed before they move.'**
  String salesInvoicesWarningsEwayBillRequired(String detail);

  /// No description provided for @salesInvoicesWarningsMissingHsn.
  ///
  /// In en, this message translates to:
  /// **'Line {lineNo} has no HSN code; it\'s required on tax invoices.'**
  String salesInvoicesWarningsMissingHsn(String lineNo);

  /// No description provided for @salesInvoicesWarningsNegativeStock.
  ///
  /// In en, this message translates to:
  /// **'Some stock went below zero. Check for a missing purchase entry.'**
  String get salesInvoicesWarningsNegativeStock;

  /// No description provided for @salesInvoicesWarningsOverdueBills.
  ///
  /// In en, this message translates to:
  /// **'This customer has a bill {days} days overdue.'**
  String salesInvoicesWarningsOverdueBills(String days);

  /// No description provided for @salesCreditNotesTitle.
  ///
  /// In en, this message translates to:
  /// **'Credit notes'**
  String get salesCreditNotesTitle;

  /// No description provided for @salesCreditNotesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sales returns and price reductions after sale.'**
  String get salesCreditNotesSubtitle;

  /// No description provided for @salesCreditNotesNew.
  ///
  /// In en, this message translates to:
  /// **'Credit note'**
  String get salesCreditNotesNew;

  /// No description provided for @salesCreditNotesReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get salesCreditNotesReason;

  /// No description provided for @salesCreditNotesGoodsReturned.
  ///
  /// In en, this message translates to:
  /// **'Goods returned to stock'**
  String get salesCreditNotesGoodsReturned;

  /// No description provided for @salesCreditNotesPriceReduction.
  ///
  /// In en, this message translates to:
  /// **'Price reduction only (no goods back)'**
  String get salesCreditNotesPriceReduction;

  /// No description provided for @salesCreditNotesCreditRate.
  ///
  /// In en, this message translates to:
  /// **'Credit per unit'**
  String get salesCreditNotesCreditRate;

  /// No description provided for @salesCreditNotesPost.
  ///
  /// In en, this message translates to:
  /// **'Post credit note'**
  String get salesCreditNotesPost;

  /// No description provided for @salesCreditNotesAgainstInvoice.
  ///
  /// In en, this message translates to:
  /// **'Against invoice {number}'**
  String salesCreditNotesAgainstInvoice(String number);

  /// No description provided for @salesErrorsNotACustomer.
  ///
  /// In en, this message translates to:
  /// **'Choose an account under Sundry Debtors.'**
  String get salesErrorsNotACustomer;

  /// No description provided for @salesErrorsUnknownCustomer.
  ///
  /// In en, this message translates to:
  /// **'Choose a customer.'**
  String get salesErrorsUnknownCustomer;

  /// No description provided for @salesErrorsOverDelivery.
  ///
  /// In en, this message translates to:
  /// **'That\'s more than is still due on the order.'**
  String get salesErrorsOverDelivery;

  /// No description provided for @salesErrorsOverInvoicing.
  ///
  /// In en, this message translates to:
  /// **'That\'s more than was delivered and not yet invoiced.'**
  String get salesErrorsOverInvoicing;

  /// No description provided for @salesErrorsOverReturn.
  ///
  /// In en, this message translates to:
  /// **'More is coming back than is still out.'**
  String get salesErrorsOverReturn;

  /// No description provided for @salesErrorsInvoiceHasCreditNotes.
  ///
  /// In en, this message translates to:
  /// **'Cancel the credit notes against this invoice first.'**
  String get salesErrorsInvoiceHasCreditNotes;

  /// No description provided for @salesErrorsDeliveryIsInvoiced.
  ///
  /// In en, this message translates to:
  /// **'This challan has been invoiced; cancel the invoice first.'**
  String get salesErrorsDeliveryIsInvoiced;

  /// No description provided for @salesErrorsOrderHasDeliveries.
  ///
  /// In en, this message translates to:
  /// **'Goods went out against this order; close it instead.'**
  String get salesErrorsOrderHasDeliveries;

  /// No description provided for @salesErrorsCancelIrnFirst.
  ///
  /// In en, this message translates to:
  /// **'Cancel the e-invoice (IRN) first.'**
  String get salesErrorsCancelIrnFirst;

  /// No description provided for @salesErrorsCreditAboveInvoiceRate.
  ///
  /// In en, this message translates to:
  /// **'The credit can\'t be more than the invoiced rate.'**
  String get salesErrorsCreditAboveInvoiceRate;

  /// No description provided for @salesErrorsRateRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter the credit per unit.'**
  String get salesErrorsRateRequired;

  /// No description provided for @salesErrorsQuotationNotOpen.
  ///
  /// In en, this message translates to:
  /// **'This quotation has already been converted or closed.'**
  String get salesErrorsQuotationNotOpen;

  /// No description provided for @salesErrorsQuotationConverted.
  ///
  /// In en, this message translates to:
  /// **'This quotation has been converted; cancel the order or invoice made from it first.'**
  String get salesErrorsQuotationConverted;

  /// No description provided for @salesErrorsQuotationCustomerMismatch.
  ///
  /// In en, this message translates to:
  /// **'The quotation is for a different customer.'**
  String get salesErrorsQuotationCustomerMismatch;

  /// No description provided for @salesErrorsValidUntilBeforeDate.
  ///
  /// In en, this message translates to:
  /// **'“Valid until” can\'t be before the quotation date.'**
  String get salesErrorsValidUntilBeforeDate;

  /// No description provided for @salesErrorsCancelEwbFirst.
  ///
  /// In en, this message translates to:
  /// **'Cancel the e-way bill first.'**
  String get salesErrorsCancelEwbFirst;

  /// No description provided for @salesErrorsGstr1FiledForPeriod.
  ///
  /// In en, this message translates to:
  /// **'GSTR-1 for this month is already filed. Date it in the current month, or amend on the GST portal.'**
  String get salesErrorsGstr1FiledForPeriod;

  /// No description provided for @salesErrorsAdvanceMoreThanTotal.
  ///
  /// In en, this message translates to:
  /// **'The advance can\'t be more than the total.'**
  String get salesErrorsAdvanceMoreThanTotal;

  /// No description provided for @salesErrorsDeliveryHasReturns.
  ///
  /// In en, this message translates to:
  /// **'Goods have come back on this challan, so it can\'t be cancelled.'**
  String get salesErrorsDeliveryHasReturns;

  /// No description provided for @salesErrorsReturnBeforeChallan.
  ///
  /// In en, this message translates to:
  /// **'The return date is before the challan date.'**
  String get salesErrorsReturnBeforeChallan;

  /// No description provided for @salesErrorsDeliveryCancelled.
  ///
  /// In en, this message translates to:
  /// **'This challan is cancelled.'**
  String get salesErrorsDeliveryCancelled;

  /// No description provided for @salesErrorsUnknownDeliveryLine.
  ///
  /// In en, this message translates to:
  /// **'That line is not on this challan.'**
  String get salesErrorsUnknownDeliveryLine;

  /// No description provided for @salesErrorsCreditBlocked.
  ///
  /// In en, this message translates to:
  /// **'This sale takes the customer over their credit limit, and their account is set to block.'**
  String get salesErrorsCreditBlocked;

  /// No description provided for @salesErrorsOverdueBlocked.
  ///
  /// In en, this message translates to:
  /// **'This customer has a bill overdue longer than allowed, and their account is set to block.'**
  String get salesErrorsOverdueBlocked;

  /// No description provided for @salesErrorsOverrideNotAllowed.
  ///
  /// In en, this message translates to:
  /// **'Only an owner or admin can override a credit block.'**
  String get salesErrorsOverrideNotAllowed;

  /// No description provided for @salesErrorsNotAnAgent.
  ///
  /// In en, this message translates to:
  /// **'Choose a ledger marked as a broker or agent.'**
  String get salesErrorsNotAnAgent;

  /// No description provided for @salesErrorsUnknownSalesman.
  ///
  /// In en, this message translates to:
  /// **'Choose a salesman from your employees.'**
  String get salesErrorsUnknownSalesman;

  /// No description provided for @salesErrorsUnknownOrder.
  ///
  /// In en, this message translates to:
  /// **'That order was not found.'**
  String get salesErrorsUnknownOrder;

  /// No description provided for @salesQuotationsTitle.
  ///
  /// In en, this message translates to:
  /// **'Quotations'**
  String get salesQuotationsTitle;

  /// No description provided for @salesQuotationsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Price quotes for customers. No stock or accounts effect until converted.'**
  String get salesQuotationsSubtitle;

  /// No description provided for @salesQuotationsNew.
  ///
  /// In en, this message translates to:
  /// **'New quotation'**
  String get salesQuotationsNew;

  /// No description provided for @salesQuotationsSave.
  ///
  /// In en, this message translates to:
  /// **'Save quotation'**
  String get salesQuotationsSave;

  /// No description provided for @salesQuotationsValidUntil.
  ///
  /// In en, this message translates to:
  /// **'Valid until'**
  String get salesQuotationsValidUntil;

  /// No description provided for @salesQuotationsToOrder.
  ///
  /// In en, this message translates to:
  /// **'Convert to order'**
  String get salesQuotationsToOrder;

  /// No description provided for @salesQuotationsToInvoice.
  ///
  /// In en, this message translates to:
  /// **'Convert to invoice'**
  String get salesQuotationsToInvoice;

  /// No description provided for @salesQuotationsAccept.
  ///
  /// In en, this message translates to:
  /// **'Mark accepted'**
  String get salesQuotationsAccept;

  /// No description provided for @salesQuotationsDecline.
  ///
  /// In en, this message translates to:
  /// **'Mark declined'**
  String get salesQuotationsDecline;

  /// No description provided for @salesQuotationsPrint.
  ///
  /// In en, this message translates to:
  /// **'Print / PDF'**
  String get salesQuotationsPrint;

  /// No description provided for @salesQuotationsConvertedTo.
  ///
  /// In en, this message translates to:
  /// **'Converted to {kind, select, order {order} other {invoice}}'**
  String salesQuotationsConvertedTo(String order, String invoice, String kind);

  /// No description provided for @salesQuotationsFromQuotation.
  ///
  /// In en, this message translates to:
  /// **'From quotation {number}'**
  String salesQuotationsFromQuotation(String number);

  /// No description provided for @salesQuotationsTerms.
  ///
  /// In en, this message translates to:
  /// **'Terms'**
  String get salesQuotationsTerms;

  /// No description provided for @salesProformasTitle.
  ///
  /// In en, this message translates to:
  /// **'Proforma invoices'**
  String get salesProformasTitle;

  /// No description provided for @salesProformasSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Ask for payment or an advance before the goods go. No tax or stock effect until the invoice.'**
  String get salesProformasSubtitle;

  /// No description provided for @salesProformasNew.
  ///
  /// In en, this message translates to:
  /// **'New proforma invoice'**
  String get salesProformasNew;

  /// No description provided for @salesProformasSave.
  ///
  /// In en, this message translates to:
  /// **'Save proforma'**
  String get salesProformasSave;

  /// No description provided for @salesProformasAdvanceDue.
  ///
  /// In en, this message translates to:
  /// **'Advance requested'**
  String get salesProformasAdvanceDue;

  /// No description provided for @salesProformasAdvanceHint.
  ///
  /// In en, this message translates to:
  /// **'Leave empty to ask for the full amount'**
  String get salesProformasAdvanceHint;

  /// No description provided for @salesApprovalsTitle.
  ///
  /// In en, this message translates to:
  /// **'Goods on approval'**
  String get salesApprovalsTitle;

  /// No description provided for @salesApprovalsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Approval memos with goods still with the customer. Take back what didn\'t sell; invoice the rest within six months.'**
  String get salesApprovalsSubtitle;

  /// No description provided for @salesApprovalsSummary.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} memo} other {{count} memos}} open, worth {value}'**
  String salesApprovalsSummary(num count, String value);

  /// No description provided for @salesApprovalsDaysOut.
  ///
  /// In en, this message translates to:
  /// **'Days out'**
  String get salesApprovalsDaysOut;

  /// No description provided for @salesApprovalsDaysLeft.
  ///
  /// In en, this message translates to:
  /// **'{days, plural, one {{days} day left} other {{days} days left}}'**
  String salesApprovalsDaysLeft(num days);

  /// No description provided for @salesApprovalsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No goods out on approval.'**
  String get salesApprovalsEmpty;

  /// No description provided for @salesOverrideCredit.
  ///
  /// In en, this message translates to:
  /// **'Override and save'**
  String get salesOverrideCredit;

  /// No description provided for @salesSamplesTitle.
  ///
  /// In en, this message translates to:
  /// **'Samples out'**
  String get salesSamplesTitle;

  /// No description provided for @salesSamplesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Samples sent to parties and not yet back. They are not a sale and carry no tax. Take back what is not kept.'**
  String get salesSamplesSubtitle;

  /// No description provided for @salesSamplesSummary.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} challan} other {{count} challans}} with {pieces} pieces still out'**
  String salesSamplesSummary(num count, String pieces);

  /// No description provided for @salesSamplesNew.
  ///
  /// In en, this message translates to:
  /// **'New sample challan'**
  String get salesSamplesNew;

  /// No description provided for @salesSamplesEmpty.
  ///
  /// In en, this message translates to:
  /// **'No samples are out.'**
  String get salesSamplesEmpty;

  /// No description provided for @einvoiceTitle.
  ///
  /// In en, this message translates to:
  /// **'e-Invoice'**
  String get einvoiceTitle;

  /// No description provided for @einvoiceStatusNotRequired.
  ///
  /// In en, this message translates to:
  /// **'Not required'**
  String get einvoiceStatusNotRequired;

  /// No description provided for @einvoiceStatusPending.
  ///
  /// In en, this message translates to:
  /// **'IRN pending'**
  String get einvoiceStatusPending;

  /// No description provided for @einvoiceStatusGenerated.
  ///
  /// In en, this message translates to:
  /// **'IRN generated'**
  String get einvoiceStatusGenerated;

  /// No description provided for @einvoiceStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'IRN cancelled'**
  String get einvoiceStatusCancelled;

  /// No description provided for @einvoiceStatusFailed.
  ///
  /// In en, this message translates to:
  /// **'IRN failed'**
  String get einvoiceStatusFailed;

  /// No description provided for @einvoiceGenerate.
  ///
  /// In en, this message translates to:
  /// **'Generate IRN'**
  String get einvoiceGenerate;

  /// No description provided for @einvoiceCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel IRN'**
  String get einvoiceCancel;

  /// No description provided for @einvoiceCancelHint.
  ///
  /// In en, this message translates to:
  /// **'An IRN can only be cancelled within 24 hours of generation.'**
  String get einvoiceCancelHint;

  /// No description provided for @einvoiceReasons1.
  ///
  /// In en, this message translates to:
  /// **'Duplicate'**
  String get einvoiceReasons1;

  /// No description provided for @einvoiceReasons2.
  ///
  /// In en, this message translates to:
  /// **'Data entry mistake'**
  String get einvoiceReasons2;

  /// No description provided for @einvoiceReasons3.
  ///
  /// In en, this message translates to:
  /// **'Order cancelled'**
  String get einvoiceReasons3;

  /// No description provided for @einvoiceReasons4.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get einvoiceReasons4;

  /// No description provided for @einvoiceRemark.
  ///
  /// In en, this message translates to:
  /// **'Remark'**
  String get einvoiceRemark;

  /// No description provided for @einvoiceIrn.
  ///
  /// In en, this message translates to:
  /// **'IRN'**
  String get einvoiceIrn;

  /// No description provided for @einvoiceAckNo.
  ///
  /// In en, this message translates to:
  /// **'Ack. no.'**
  String get einvoiceAckNo;

  /// No description provided for @einvoiceAckDate.
  ///
  /// In en, this message translates to:
  /// **'Ack. date'**
  String get einvoiceAckDate;

  /// No description provided for @einvoiceSimulator.
  ///
  /// In en, this message translates to:
  /// **'Test mode: IRNs come from the built-in simulator until a GST provider is connected.'**
  String get einvoiceSimulator;

  /// No description provided for @einvoiceErrorsEinvoiceBuyerGstinRequired.
  ///
  /// In en, this message translates to:
  /// **'The customer has no GSTIN; e-invoices are only for registered buyers and exports.'**
  String get einvoiceErrorsEinvoiceBuyerGstinRequired;

  /// No description provided for @einvoiceErrorsEinvoiceInvalidDocNumber.
  ///
  /// In en, this message translates to:
  /// **'The invoice number isn\'t valid for the IRP.'**
  String get einvoiceErrorsEinvoiceInvalidDocNumber;

  /// No description provided for @einvoiceErrorsEinvoiceInvalidPincode.
  ///
  /// In en, this message translates to:
  /// **'Add a valid PIN code for the customer and your branch.'**
  String get einvoiceErrorsEinvoiceInvalidPincode;

  /// No description provided for @einvoiceErrorsEinvoiceAddressRequired.
  ///
  /// In en, this message translates to:
  /// **'Add addresses for the customer and your branch.'**
  String get einvoiceErrorsEinvoiceAddressRequired;

  /// No description provided for @einvoiceErrorsEinvoiceInvalidHsn.
  ///
  /// In en, this message translates to:
  /// **'Every item needs an HSN code.'**
  String get einvoiceErrorsEinvoiceInvalidHsn;

  /// No description provided for @einvoiceErrorsEinvoiceTotalsMismatch.
  ///
  /// In en, this message translates to:
  /// **'The totals don\'t add up.'**
  String get einvoiceErrorsEinvoiceTotalsMismatch;

  /// No description provided for @einvoiceErrorsBranchGstinRequired.
  ///
  /// In en, this message translates to:
  /// **'Add your branch\'s GSTIN first.'**
  String get einvoiceErrorsBranchGstinRequired;

  /// No description provided for @einvoiceErrorsDuplicateIrn.
  ///
  /// In en, this message translates to:
  /// **'The IRP already has this invoice.'**
  String get einvoiceErrorsDuplicateIrn;

  /// No description provided for @einvoiceErrorsIrnCancelWindowPassed.
  ///
  /// In en, this message translates to:
  /// **'The 24 hours for cancelling this IRN have passed. Issue a credit note instead.'**
  String get einvoiceErrorsIrnCancelWindowPassed;

  /// No description provided for @einvoiceErrorsIrnAlreadyGenerated.
  ///
  /// In en, this message translates to:
  /// **'The IRN has already been generated.'**
  String get einvoiceErrorsIrnAlreadyGenerated;

  /// No description provided for @einvoiceErrorsCancelEwbFirst.
  ///
  /// In en, this message translates to:
  /// **'Cancel the e-way bill first.'**
  String get einvoiceErrorsCancelEwbFirst;

  /// No description provided for @ewbTitle.
  ///
  /// In en, this message translates to:
  /// **'e-Way bill'**
  String get ewbTitle;

  /// No description provided for @ewbGenerate.
  ///
  /// In en, this message translates to:
  /// **'Generate e-way bill'**
  String get ewbGenerate;

  /// No description provided for @ewbVehicleNo.
  ///
  /// In en, this message translates to:
  /// **'Vehicle no.'**
  String get ewbVehicleNo;

  /// No description provided for @ewbDistance.
  ///
  /// In en, this message translates to:
  /// **'Distance (km)'**
  String get ewbDistance;

  /// No description provided for @ewbNumber.
  ///
  /// In en, this message translates to:
  /// **'EWB no.'**
  String get ewbNumber;

  /// No description provided for @ewbValidUpto.
  ///
  /// In en, this message translates to:
  /// **'Valid until'**
  String get ewbValidUpto;

  /// No description provided for @ewbErrorsInvalidVehicleNo.
  ///
  /// In en, this message translates to:
  /// **'That doesn\'t look like a vehicle number (e.g. MH12AB1234).'**
  String get ewbErrorsInvalidVehicleNo;

  /// No description provided for @ewbErrorsInvalidDistance.
  ///
  /// In en, this message translates to:
  /// **'Enter the distance in km.'**
  String get ewbErrorsInvalidDistance;

  /// No description provided for @ewbErrorsEwbExtensionWindow.
  ///
  /// In en, this message translates to:
  /// **'An e-way bill can only be extended from 8 hours before to 8 hours after it expires.'**
  String get ewbErrorsEwbExtensionWindow;

  /// No description provided for @ewbErrorsEwbCancelWindowPassed.
  ///
  /// In en, this message translates to:
  /// **'The 24 hours for cancelling this e-way bill have passed.'**
  String get ewbErrorsEwbCancelWindowPassed;

  /// No description provided for @ewbErrorsEwbExpired.
  ///
  /// In en, this message translates to:
  /// **'This e-way bill has expired; extend it instead.'**
  String get ewbErrorsEwbExpired;

  /// No description provided for @ewbErrorsNoActiveEwb.
  ///
  /// In en, this message translates to:
  /// **'There\'s no active e-way bill on this invoice.'**
  String get ewbErrorsNoActiveEwb;

  /// No description provided for @ewbErrorsEwbAlreadyGenerated.
  ///
  /// In en, this message translates to:
  /// **'An e-way bill is already active on this invoice.'**
  String get ewbErrorsEwbAlreadyGenerated;

  /// No description provided for @ewbErrorsInvalidPincode.
  ///
  /// In en, this message translates to:
  /// **'Enter a 6-digit PIN code.'**
  String get ewbErrorsInvalidPincode;

  /// No description provided for @ewbStatusActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get ewbStatusActive;

  /// No description provided for @ewbStatusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get ewbStatusCancelled;

  /// No description provided for @ewbChangeVehicle.
  ///
  /// In en, this message translates to:
  /// **'Change vehicle'**
  String get ewbChangeVehicle;

  /// No description provided for @ewbExtend.
  ///
  /// In en, this message translates to:
  /// **'Extend validity'**
  String get ewbExtend;

  /// No description provided for @ewbCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel e-way bill'**
  String get ewbCancel;

  /// No description provided for @ewbNewVehicle.
  ///
  /// In en, this message translates to:
  /// **'New vehicle no.'**
  String get ewbNewVehicle;

  /// No description provided for @ewbCurrentPlace.
  ///
  /// In en, this message translates to:
  /// **'Current place'**
  String get ewbCurrentPlace;

  /// No description provided for @ewbCurrentPincode.
  ///
  /// In en, this message translates to:
  /// **'Current PIN code'**
  String get ewbCurrentPincode;

  /// No description provided for @ewbRemainingKm.
  ///
  /// In en, this message translates to:
  /// **'Distance left (km)'**
  String get ewbRemainingKm;

  /// No description provided for @ewbReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get ewbReason;

  /// No description provided for @ewbRemark.
  ///
  /// In en, this message translates to:
  /// **'Remark'**
  String get ewbRemark;

  /// No description provided for @ewbSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get ewbSave;

  /// No description provided for @ewbExtendHint.
  ///
  /// In en, this message translates to:
  /// **'Allowed from 8 hours before to 8 hours after the e-way bill expires.'**
  String get ewbExtendHint;

  /// No description provided for @ewbCancelHint.
  ///
  /// In en, this message translates to:
  /// **'Allowed within 24 hours of generation, if the goods haven\'t moved.'**
  String get ewbCancelHint;

  /// No description provided for @ewbCancelledNote.
  ///
  /// In en, this message translates to:
  /// **'E-way bill {number} was cancelled. You can generate a new one.'**
  String ewbCancelledNote(String number);

  /// No description provided for @ewbVehicleReasons1.
  ///
  /// In en, this message translates to:
  /// **'Vehicle breakdown'**
  String get ewbVehicleReasons1;

  /// No description provided for @ewbVehicleReasons2.
  ///
  /// In en, this message translates to:
  /// **'Transshipment'**
  String get ewbVehicleReasons2;

  /// No description provided for @ewbVehicleReasons3.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get ewbVehicleReasons3;

  /// No description provided for @ewbVehicleReasons4.
  ///
  /// In en, this message translates to:
  /// **'First time'**
  String get ewbVehicleReasons4;

  /// No description provided for @ewbExtendReasons1.
  ///
  /// In en, this message translates to:
  /// **'Natural calamity'**
  String get ewbExtendReasons1;

  /// No description provided for @ewbExtendReasons2.
  ///
  /// In en, this message translates to:
  /// **'Law and order'**
  String get ewbExtendReasons2;

  /// No description provided for @ewbExtendReasons4.
  ///
  /// In en, this message translates to:
  /// **'Transshipment'**
  String get ewbExtendReasons4;

  /// No description provided for @ewbExtendReasons5.
  ///
  /// In en, this message translates to:
  /// **'Accident'**
  String get ewbExtendReasons5;

  /// No description provided for @ewbExtendReasons99.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get ewbExtendReasons99;

  /// No description provided for @ewbCancelReasons1.
  ///
  /// In en, this message translates to:
  /// **'Duplicate'**
  String get ewbCancelReasons1;

  /// No description provided for @ewbCancelReasons2.
  ///
  /// In en, this message translates to:
  /// **'Order cancelled'**
  String get ewbCancelReasons2;

  /// No description provided for @ewbCancelReasons3.
  ///
  /// In en, this message translates to:
  /// **'Data entry mistake'**
  String get ewbCancelReasons3;

  /// No description provided for @ewbCancelReasons4.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get ewbCancelReasons4;

  /// No description provided for @printTaxInvoice.
  ///
  /// In en, this message translates to:
  /// **'Tax Invoice'**
  String get printTaxInvoice;

  /// No description provided for @printCreditNote.
  ///
  /// In en, this message translates to:
  /// **'Credit Note'**
  String get printCreditNote;

  /// No description provided for @printOriginal.
  ///
  /// In en, this message translates to:
  /// **'Original for recipient'**
  String get printOriginal;

  /// No description provided for @printBillTo.
  ///
  /// In en, this message translates to:
  /// **'Bill to'**
  String get printBillTo;

  /// No description provided for @printShipTo.
  ///
  /// In en, this message translates to:
  /// **'Ship to'**
  String get printShipTo;

  /// No description provided for @printInvoiceNo.
  ///
  /// In en, this message translates to:
  /// **'Invoice no.'**
  String get printInvoiceNo;

  /// No description provided for @printInvoiceDate.
  ///
  /// In en, this message translates to:
  /// **'Invoice date'**
  String get printInvoiceDate;

  /// No description provided for @printSno.
  ///
  /// In en, this message translates to:
  /// **'#'**
  String get printSno;

  /// No description provided for @printHsn.
  ///
  /// In en, this message translates to:
  /// **'HSN/SAC'**
  String get printHsn;

  /// No description provided for @printTaxSummary.
  ///
  /// In en, this message translates to:
  /// **'Tax summary'**
  String get printTaxSummary;

  /// No description provided for @printRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get printRate;

  /// No description provided for @printAmountInWords.
  ///
  /// In en, this message translates to:
  /// **'Amount in words'**
  String get printAmountInWords;

  /// No description provided for @printBank.
  ///
  /// In en, this message translates to:
  /// **'Bank details'**
  String get printBank;

  /// No description provided for @printTerms.
  ///
  /// In en, this message translates to:
  /// **'Terms & conditions'**
  String get printTerms;

  /// No description provided for @printForCompany.
  ///
  /// In en, this message translates to:
  /// **'For {company}'**
  String printForCompany(String company);

  /// No description provided for @printSignatory.
  ///
  /// In en, this message translates to:
  /// **'Authorised signatory'**
  String get printSignatory;

  /// No description provided for @printComputerGenerated.
  ///
  /// In en, this message translates to:
  /// **'This is a computer-generated invoice.'**
  String get printComputerGenerated;

  /// No description provided for @printReverseCharge.
  ///
  /// In en, this message translates to:
  /// **'Tax payable on reverse charge'**
  String get printReverseCharge;

  /// No description provided for @printExportLut.
  ///
  /// In en, this message translates to:
  /// **'Supply meant for export under LUT without payment of IGST'**
  String get printExportLut;

  /// No description provided for @printQuotation.
  ///
  /// In en, this message translates to:
  /// **'Quotation'**
  String get printQuotation;

  /// No description provided for @printQuotationNo.
  ///
  /// In en, this message translates to:
  /// **'Quotation no.'**
  String get printQuotationNo;

  /// No description provided for @printQuotationDate.
  ///
  /// In en, this message translates to:
  /// **'Quotation date'**
  String get printQuotationDate;

  /// No description provided for @printQuotedTo.
  ///
  /// In en, this message translates to:
  /// **'Quoted to'**
  String get printQuotedTo;

  /// No description provided for @printComputerGeneratedQuote.
  ///
  /// In en, this message translates to:
  /// **'This is a computer-generated quotation. Prices are valid until the date shown.'**
  String get printComputerGeneratedQuote;

  /// No description provided for @printProforma.
  ///
  /// In en, this message translates to:
  /// **'Proforma invoice'**
  String get printProforma;

  /// No description provided for @printProformaNo.
  ///
  /// In en, this message translates to:
  /// **'Proforma no.'**
  String get printProformaNo;

  /// No description provided for @printProformaDate.
  ///
  /// In en, this message translates to:
  /// **'Proforma date'**
  String get printProformaDate;

  /// No description provided for @printComputerGeneratedProforma.
  ///
  /// In en, this message translates to:
  /// **'This is a proforma invoice, not a tax invoice. The tax invoice will be issued on supply.'**
  String get printComputerGeneratedProforma;

  /// No description provided for @printDeliveryChallan.
  ///
  /// In en, this message translates to:
  /// **'Delivery challan'**
  String get printDeliveryChallan;

  /// No description provided for @printApprovalMemo.
  ///
  /// In en, this message translates to:
  /// **'Approval memo'**
  String get printApprovalMemo;

  /// No description provided for @printCopyConsignee.
  ///
  /// In en, this message translates to:
  /// **'Original for consignee'**
  String get printCopyConsignee;

  /// No description provided for @printCopyTransporter.
  ///
  /// In en, this message translates to:
  /// **'Duplicate for transporter'**
  String get printCopyTransporter;

  /// No description provided for @printCopyConsignor.
  ///
  /// In en, this message translates to:
  /// **'Triplicate for consignor'**
  String get printCopyConsignor;

  /// No description provided for @printConsignee.
  ///
  /// In en, this message translates to:
  /// **'Consignee'**
  String get printConsignee;

  /// No description provided for @printChallanNo.
  ///
  /// In en, this message translates to:
  /// **'Challan no.'**
  String get printChallanNo;

  /// No description provided for @printChallanDate.
  ///
  /// In en, this message translates to:
  /// **'Challan date'**
  String get printChallanDate;

  /// No description provided for @printInvoiceBy.
  ///
  /// In en, this message translates to:
  /// **'Invoice by'**
  String get printInvoiceBy;

  /// No description provided for @printValue.
  ///
  /// In en, this message translates to:
  /// **'Value'**
  String get printValue;

  /// No description provided for @printNotASupply.
  ///
  /// In en, this message translates to:
  /// **'Goods moved for a reason other than a supply. No tax is charged on this challan.'**
  String get printNotASupply;

  /// No description provided for @printReceivedBy.
  ///
  /// In en, this message translates to:
  /// **'Received by'**
  String get printReceivedBy;

  /// No description provided for @printSignatureAndDate.
  ///
  /// In en, this message translates to:
  /// **'Signature and date'**
  String get printSignatureAndDate;

  /// No description provided for @outstandingReceivablesTitle.
  ///
  /// In en, this message translates to:
  /// **'Receivables'**
  String get outstandingReceivablesTitle;

  /// No description provided for @outstandingReceivablesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What customers owe you, by age. Receipts settle the oldest bills first.'**
  String get outstandingReceivablesSubtitle;

  /// No description provided for @outstandingPayablesTitle.
  ///
  /// In en, this message translates to:
  /// **'Payables'**
  String get outstandingPayablesTitle;

  /// No description provided for @outstandingPayablesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What you owe suppliers, by age. Payments settle the oldest bills first.'**
  String get outstandingPayablesSubtitle;

  /// No description provided for @outstandingParty.
  ///
  /// In en, this message translates to:
  /// **'Party'**
  String get outstandingParty;

  /// No description provided for @outstandingBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get outstandingBalance;

  /// No description provided for @outstandingNotDue.
  ///
  /// In en, this message translates to:
  /// **'Not yet due'**
  String get outstandingNotDue;

  /// No description provided for @outstandingD030.
  ///
  /// In en, this message translates to:
  /// **'1 to 30 days'**
  String get outstandingD030;

  /// No description provided for @outstandingD3160.
  ///
  /// In en, this message translates to:
  /// **'31 to 60 days'**
  String get outstandingD3160;

  /// No description provided for @outstandingD6190.
  ///
  /// In en, this message translates to:
  /// **'61 to 90 days'**
  String get outstandingD6190;

  /// No description provided for @outstandingAdvance.
  ///
  /// In en, this message translates to:
  /// **'Advance'**
  String get outstandingAdvance;

  /// No description provided for @outstandingOpenItems.
  ///
  /// In en, this message translates to:
  /// **'Open bills'**
  String get outstandingOpenItems;

  /// No description provided for @outstandingOverdue.
  ///
  /// In en, this message translates to:
  /// **'{days, plural, =0 {due} one {{days} day overdue} other {{days} days overdue}}'**
  String outstandingOverdue(String due, num days);

  /// No description provided for @outstandingNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing outstanding.'**
  String get outstandingNone;

  /// No description provided for @outstandingD91180.
  ///
  /// In en, this message translates to:
  /// **'91 to 180 days'**
  String get outstandingD91180;

  /// No description provided for @outstandingD180plus.
  ///
  /// In en, this message translates to:
  /// **'Over 180 days'**
  String get outstandingD180plus;

  /// No description provided for @returnsTitle.
  ///
  /// In en, this message translates to:
  /// **'GST returns'**
  String get returnsTitle;

  /// No description provided for @returnsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal\'s offline tool.'**
  String get returnsSubtitle;

  /// No description provided for @returnsPeriod.
  ///
  /// In en, this message translates to:
  /// **'Tax period'**
  String get returnsPeriod;

  /// No description provided for @returnsGstr1.
  ///
  /// In en, this message translates to:
  /// **'GSTR-1'**
  String get returnsGstr1;

  /// No description provided for @returnsGstr3b.
  ///
  /// In en, this message translates to:
  /// **'GSTR-3B'**
  String get returnsGstr3b;

  /// No description provided for @returnsDownload.
  ///
  /// In en, this message translates to:
  /// **'Download JSON'**
  String get returnsDownload;

  /// No description provided for @returnsSection.
  ///
  /// In en, this message translates to:
  /// **'Section'**
  String get returnsSection;

  /// No description provided for @returnsCount.
  ///
  /// In en, this message translates to:
  /// **'Invoices'**
  String get returnsCount;

  /// No description provided for @returnsTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable value'**
  String get returnsTaxable;

  /// No description provided for @returnsTax.
  ///
  /// In en, this message translates to:
  /// **'Tax'**
  String get returnsTax;

  /// No description provided for @returnsB2b.
  ///
  /// In en, this message translates to:
  /// **'B2B: registered customers'**
  String get returnsB2b;

  /// No description provided for @returnsB2cl.
  ///
  /// In en, this message translates to:
  /// **'B2C large: other state, over ₹1 lakh'**
  String get returnsB2cl;

  /// No description provided for @returnsB2cs.
  ///
  /// In en, this message translates to:
  /// **'B2C small'**
  String get returnsB2cs;

  /// No description provided for @returnsExp.
  ///
  /// In en, this message translates to:
  /// **'Exports'**
  String get returnsExp;

  /// No description provided for @returnsCdn.
  ///
  /// In en, this message translates to:
  /// **'Credit notes'**
  String get returnsCdn;

  /// No description provided for @returnsCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled invoices (in document summary)'**
  String get returnsCancelled;

  /// No description provided for @returnsOutward.
  ///
  /// In en, this message translates to:
  /// **'3.1(a) Outward taxable supplies'**
  String get returnsOutward;

  /// No description provided for @returnsZeroRated.
  ///
  /// In en, this message translates to:
  /// **'3.1(b) Zero-rated (exports, SEZ)'**
  String get returnsZeroRated;

  /// No description provided for @returnsNil.
  ///
  /// In en, this message translates to:
  /// **'3.1(c) Nil-rated / exempt'**
  String get returnsNil;

  /// No description provided for @returnsRcm.
  ///
  /// In en, this message translates to:
  /// **'3.1(d) Inward supplies on reverse charge'**
  String get returnsRcm;

  /// No description provided for @returnsItc.
  ///
  /// In en, this message translates to:
  /// **'4. Input tax credit'**
  String get returnsItc;

  /// No description provided for @returnsSetOff.
  ///
  /// In en, this message translates to:
  /// **'6.1 Payment of tax'**
  String get returnsSetOff;

  /// No description provided for @returnsHead.
  ///
  /// In en, this message translates to:
  /// **'Tax head'**
  String get returnsHead;

  /// No description provided for @returnsLiability.
  ///
  /// In en, this message translates to:
  /// **'Tax due'**
  String get returnsLiability;

  /// No description provided for @returnsPaidByCredit.
  ///
  /// In en, this message translates to:
  /// **'Paid by credit'**
  String get returnsPaidByCredit;

  /// No description provided for @returnsCash.
  ///
  /// In en, this message translates to:
  /// **'Pay in cash'**
  String get returnsCash;

  /// No description provided for @returnsCarryForward.
  ///
  /// In en, this message translates to:
  /// **'Credit carried forward'**
  String get returnsCarryForward;

  /// No description provided for @returnsFilingNote.
  ///
  /// In en, this message translates to:
  /// **'Filing goes through your GST provider. Test mode uses the built-in simulator until a provider is connected.'**
  String get returnsFilingNote;

  /// No description provided for @gstSettingsTitle.
  ///
  /// In en, this message translates to:
  /// **'GST & invoicing'**
  String get gstSettingsTitle;

  /// No description provided for @gstSettingsEinvoice.
  ///
  /// In en, this message translates to:
  /// **'Generate e-invoices (IRN)'**
  String get gstSettingsEinvoice;

  /// No description provided for @gstSettingsEinvoiceHint.
  ///
  /// In en, this message translates to:
  /// **'Compulsory once your turnover has crossed ₹5 crore in any year since 2017-18.'**
  String get gstSettingsEinvoiceHint;

  /// No description provided for @gstSettingsEwbThreshold.
  ///
  /// In en, this message translates to:
  /// **'E-way bill needed above (₹)'**
  String get gstSettingsEwbThreshold;

  /// No description provided for @gstSettingsBilingual.
  ///
  /// In en, this message translates to:
  /// **'Print invoices, payslips and Form 16 in two languages'**
  String get gstSettingsBilingual;

  /// No description provided for @gstSettingsPrintLanguage.
  ///
  /// In en, this message translates to:
  /// **'Second language on prints'**
  String get gstSettingsPrintLanguage;

  /// No description provided for @gstSettingsTerms.
  ///
  /// In en, this message translates to:
  /// **'Invoice terms & conditions'**
  String get gstSettingsTerms;

  /// No description provided for @gstSettingsBank.
  ///
  /// In en, this message translates to:
  /// **'Bank details on invoices'**
  String get gstSettingsBank;

  /// No description provided for @importTitle.
  ///
  /// In en, this message translates to:
  /// **'Import data'**
  String get importTitle;

  /// No description provided for @importSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Bring customers, suppliers and items across from a spreadsheet or from Tally.'**
  String get importSubtitle;

  /// No description provided for @importParties.
  ///
  /// In en, this message translates to:
  /// **'Customers & suppliers (CSV)'**
  String get importParties;

  /// No description provided for @importItems.
  ///
  /// In en, this message translates to:
  /// **'Items (CSV)'**
  String get importItems;

  /// No description provided for @importTally.
  ///
  /// In en, this message translates to:
  /// **'Tally XML'**
  String get importTally;

  /// No description provided for @importTemplate.
  ///
  /// In en, this message translates to:
  /// **'Download sample CSV'**
  String get importTemplate;

  /// No description provided for @importTallyHint.
  ///
  /// In en, this message translates to:
  /// **'In Tally: Display → List of Accounts → Alt+E (Export), format XML. Include stock items.'**
  String get importTallyHint;

  /// No description provided for @importChoose.
  ///
  /// In en, this message translates to:
  /// **'Choose file'**
  String get importChoose;

  /// No description provided for @importPreview.
  ///
  /// In en, this message translates to:
  /// **'Check file'**
  String get importPreview;

  /// No description provided for @importCommit.
  ///
  /// In en, this message translates to:
  /// **'Import {count, plural, one {{count} row} other {{count} rows}}'**
  String importCommit(num count);

  /// No description provided for @importRow.
  ///
  /// In en, this message translates to:
  /// **'Row'**
  String get importRow;

  /// No description provided for @importStatus.
  ///
  /// In en, this message translates to:
  /// **'Result'**
  String get importStatus;

  /// No description provided for @importCreate.
  ///
  /// In en, this message translates to:
  /// **'Will be created'**
  String get importCreate;

  /// No description provided for @importExists.
  ///
  /// In en, this message translates to:
  /// **'Already exists: skipped'**
  String get importExists;

  /// No description provided for @importDone.
  ///
  /// In en, this message translates to:
  /// **'Imported.'**
  String get importDone;

  /// No description provided for @filingTitle.
  ///
  /// In en, this message translates to:
  /// **'File on the GST portal'**
  String get filingTitle;

  /// No description provided for @filingPortal.
  ///
  /// In en, this message translates to:
  /// **'GST portal connection'**
  String get filingPortal;

  /// No description provided for @filingPortalHint.
  ///
  /// In en, this message translates to:
  /// **'Turn on “API access” in your GST portal profile first. The session lasts about 6 hours.'**
  String get filingPortalHint;

  /// No description provided for @filingUsername.
  ///
  /// In en, this message translates to:
  /// **'GST portal username'**
  String get filingUsername;

  /// No description provided for @filingSendOtp.
  ///
  /// In en, this message translates to:
  /// **'Send OTP'**
  String get filingSendOtp;

  /// No description provided for @filingOtp.
  ///
  /// In en, this message translates to:
  /// **'OTP'**
  String get filingOtp;

  /// No description provided for @filingConnect.
  ///
  /// In en, this message translates to:
  /// **'Connect'**
  String get filingConnect;

  /// No description provided for @filingConnected.
  ///
  /// In en, this message translates to:
  /// **'Connected as {username} until {time}'**
  String filingConnected(String username, String time);

  /// No description provided for @filingDisconnect.
  ///
  /// In en, this message translates to:
  /// **'Disconnect'**
  String get filingDisconnect;

  /// No description provided for @filingSimulatorOtp.
  ///
  /// In en, this message translates to:
  /// **'Test mode: the OTP is {otp}.'**
  String filingSimulatorOtp(String otp);

  /// No description provided for @filingUpload.
  ///
  /// In en, this message translates to:
  /// **'Upload'**
  String get filingUpload;

  /// No description provided for @filingUploadAgain.
  ///
  /// In en, this message translates to:
  /// **'Upload again'**
  String get filingUploadAgain;

  /// No description provided for @filingUploaded.
  ///
  /// In en, this message translates to:
  /// **'Uploaded {time}'**
  String filingUploaded(String time);

  /// No description provided for @filingGetOtp.
  ///
  /// In en, this message translates to:
  /// **'Send EVC OTP'**
  String get filingGetOtp;

  /// No description provided for @filingEvcHint.
  ///
  /// In en, this message translates to:
  /// **'The OTP goes to your authorised signatory\'s mobile.'**
  String get filingEvcHint;

  /// No description provided for @filingFile.
  ///
  /// In en, this message translates to:
  /// **'File with EVC'**
  String get filingFile;

  /// No description provided for @filingFiled.
  ///
  /// In en, this message translates to:
  /// **'Filed {time}'**
  String filingFiled(String time);

  /// No description provided for @filingArn.
  ///
  /// In en, this message translates to:
  /// **'ARN'**
  String get filingArn;

  /// No description provided for @filingNotUploaded.
  ///
  /// In en, this message translates to:
  /// **'Not uploaded'**
  String get filingNotUploaded;

  /// No description provided for @filingLocked.
  ///
  /// In en, this message translates to:
  /// **'Invoices and credit notes for a month are locked once its GSTR-1 is filed.'**
  String get filingLocked;

  /// No description provided for @filingCashNote.
  ///
  /// In en, this message translates to:
  /// **'Keep {amount} in your electronic cash ledger before filing (challan on the GST portal).'**
  String filingCashNote(String amount);

  /// No description provided for @filingErrorsGstSessionRequired.
  ///
  /// In en, this message translates to:
  /// **'Connect to the GST portal first.'**
  String get filingErrorsGstSessionRequired;

  /// No description provided for @filingErrorsGstSessionExpired.
  ///
  /// In en, this message translates to:
  /// **'The GST portal session expired. Connect again.'**
  String get filingErrorsGstSessionExpired;

  /// No description provided for @filingErrorsInvalidOtp.
  ///
  /// In en, this message translates to:
  /// **'That OTP isn\'t right.'**
  String get filingErrorsInvalidOtp;

  /// No description provided for @filingErrorsInvalidPortalUsername.
  ///
  /// In en, this message translates to:
  /// **'Enter your GST portal username.'**
  String get filingErrorsInvalidPortalUsername;

  /// No description provided for @filingErrorsUploadFirst.
  ///
  /// In en, this message translates to:
  /// **'Upload the return first.'**
  String get filingErrorsUploadFirst;

  /// No description provided for @filingErrorsBooksChangedSinceUpload.
  ///
  /// In en, this message translates to:
  /// **'Your books changed after the upload. Upload again, then file.'**
  String get filingErrorsBooksChangedSinceUpload;

  /// No description provided for @filingErrorsReturnAlreadyFiled.
  ///
  /// In en, this message translates to:
  /// **'This return is already filed.'**
  String get filingErrorsReturnAlreadyFiled;

  /// No description provided for @filingErrorsCompanyPanRequired.
  ///
  /// In en, this message translates to:
  /// **'Add your business PAN under Company & branches.'**
  String get filingErrorsCompanyPanRequired;

  /// No description provided for @filingErrorsInvalidPan.
  ///
  /// In en, this message translates to:
  /// **'The business PAN isn\'t valid.'**
  String get filingErrorsInvalidPan;

  /// No description provided for @filingErrorsBranchGstinRequired.
  ///
  /// In en, this message translates to:
  /// **'Add your head office\'s GSTIN first.'**
  String get filingErrorsBranchGstinRequired;

  /// No description provided for @hrEmployeesTitle.
  ///
  /// In en, this message translates to:
  /// **'Employees'**
  String get hrEmployeesTitle;

  /// No description provided for @hrEmployeesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Your team, their pay and statutory details.'**
  String get hrEmployeesSubtitle;

  /// No description provided for @hrEmployeesNew.
  ///
  /// In en, this message translates to:
  /// **'Add employee'**
  String get hrEmployeesNew;

  /// No description provided for @hrEmployeesNone.
  ///
  /// In en, this message translates to:
  /// **'No employees yet.'**
  String get hrEmployeesNone;

  /// No description provided for @hrSectionsPersonal.
  ///
  /// In en, this message translates to:
  /// **'Personal'**
  String get hrSectionsPersonal;

  /// No description provided for @hrSectionsJob.
  ///
  /// In en, this message translates to:
  /// **'Job'**
  String get hrSectionsJob;

  /// No description provided for @hrSectionsStatutory.
  ///
  /// In en, this message translates to:
  /// **'PF, ESI and tax'**
  String get hrSectionsStatutory;

  /// No description provided for @hrSectionsBank.
  ///
  /// In en, this message translates to:
  /// **'Salary payment'**
  String get hrSectionsBank;

  /// No description provided for @hrSectionsSalary.
  ///
  /// In en, this message translates to:
  /// **'Salary structure'**
  String get hrSectionsSalary;

  /// No description provided for @hrCode.
  ///
  /// In en, this message translates to:
  /// **'Employee code'**
  String get hrCode;

  /// No description provided for @hrCodeHint.
  ///
  /// In en, this message translates to:
  /// **'Leave blank to number automatically'**
  String get hrCodeHint;

  /// No description provided for @hrName.
  ///
  /// In en, this message translates to:
  /// **'Full name'**
  String get hrName;

  /// No description provided for @hrNameHi.
  ///
  /// In en, this message translates to:
  /// **'Name in Hindi (optional)'**
  String get hrNameHi;

  /// No description provided for @hrGender.
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get hrGender;

  /// No description provided for @hrGendersMale.
  ///
  /// In en, this message translates to:
  /// **'Male'**
  String get hrGendersMale;

  /// No description provided for @hrGendersFemale.
  ///
  /// In en, this message translates to:
  /// **'Female'**
  String get hrGendersFemale;

  /// No description provided for @hrGendersOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get hrGendersOther;

  /// No description provided for @hrDob.
  ///
  /// In en, this message translates to:
  /// **'Date of birth'**
  String get hrDob;

  /// No description provided for @hrJoinedOn.
  ///
  /// In en, this message translates to:
  /// **'Joined on'**
  String get hrJoinedOn;

  /// No description provided for @hrLeftOn.
  ///
  /// In en, this message translates to:
  /// **'Left on'**
  String get hrLeftOn;

  /// No description provided for @hrFixedTerm.
  ///
  /// In en, this message translates to:
  /// **'Fixed-term employee'**
  String get hrFixedTerm;

  /// No description provided for @hrDepartment.
  ///
  /// In en, this message translates to:
  /// **'Department'**
  String get hrDepartment;

  /// No description provided for @hrDesignation.
  ///
  /// In en, this message translates to:
  /// **'Designation'**
  String get hrDesignation;

  /// No description provided for @hrWorkState.
  ///
  /// In en, this message translates to:
  /// **'Works in (state)'**
  String get hrWorkState;

  /// No description provided for @hrWorkStateHint.
  ///
  /// In en, this message translates to:
  /// **'Decides professional tax'**
  String get hrWorkStateHint;

  /// No description provided for @hrPhone.
  ///
  /// In en, this message translates to:
  /// **'Mobile'**
  String get hrPhone;

  /// No description provided for @hrEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get hrEmail;

  /// No description provided for @hrAddress.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get hrAddress;

  /// No description provided for @hrCity.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get hrCity;

  /// No description provided for @hrPincode.
  ///
  /// In en, this message translates to:
  /// **'PIN code'**
  String get hrPincode;

  /// No description provided for @hrPan.
  ///
  /// In en, this message translates to:
  /// **'PAN'**
  String get hrPan;

  /// No description provided for @hrAadhaarLast4.
  ///
  /// In en, this message translates to:
  /// **'Aadhaar (last 4 digits only)'**
  String get hrAadhaarLast4;

  /// No description provided for @hrUan.
  ///
  /// In en, this message translates to:
  /// **'UAN'**
  String get hrUan;

  /// No description provided for @hrEsiNumber.
  ///
  /// In en, this message translates to:
  /// **'ESI IP number'**
  String get hrEsiNumber;

  /// No description provided for @hrPfMember.
  ///
  /// In en, this message translates to:
  /// **'PF member'**
  String get hrPfMember;

  /// No description provided for @hrEpsEligible.
  ///
  /// In en, this message translates to:
  /// **'In the pension scheme (EPS)'**
  String get hrEpsEligible;

  /// No description provided for @hrPfOnActual.
  ///
  /// In en, this message translates to:
  /// **'PF on full wages (above ₹15,000)'**
  String get hrPfOnActual;

  /// No description provided for @hrDisabled.
  ///
  /// In en, this message translates to:
  /// **'Person with disability (ESI up to ₹25,000)'**
  String get hrDisabled;

  /// No description provided for @hrTaxRegime.
  ///
  /// In en, this message translates to:
  /// **'Tax regime'**
  String get hrTaxRegime;

  /// No description provided for @hrRegimesNew.
  ///
  /// In en, this message translates to:
  /// **'New regime'**
  String get hrRegimesNew;

  /// No description provided for @hrRegimesOld.
  ///
  /// In en, this message translates to:
  /// **'Old regime'**
  String get hrRegimesOld;

  /// No description provided for @hrMetro.
  ///
  /// In en, this message translates to:
  /// **'Lives in a metro city (for HRA)'**
  String get hrMetro;

  /// No description provided for @hrPaymentMode.
  ///
  /// In en, this message translates to:
  /// **'Paid by'**
  String get hrPaymentMode;

  /// No description provided for @hrPaymentModesBank.
  ///
  /// In en, this message translates to:
  /// **'Bank transfer'**
  String get hrPaymentModesBank;

  /// No description provided for @hrPaymentModesCash.
  ///
  /// In en, this message translates to:
  /// **'Cash'**
  String get hrPaymentModesCash;

  /// No description provided for @hrPaymentModesCheque.
  ///
  /// In en, this message translates to:
  /// **'Cheque'**
  String get hrPaymentModesCheque;

  /// No description provided for @hrBankName.
  ///
  /// In en, this message translates to:
  /// **'Bank'**
  String get hrBankName;

  /// No description provided for @hrBankIfsc.
  ///
  /// In en, this message translates to:
  /// **'IFSC'**
  String get hrBankIfsc;

  /// No description provided for @hrBankAccount.
  ///
  /// In en, this message translates to:
  /// **'Account number'**
  String get hrBankAccount;

  /// No description provided for @hrBankAccountHint.
  ///
  /// In en, this message translates to:
  /// **'Stored encrypted. On file: ending {last4}'**
  String hrBankAccountHint(String last4);

  /// No description provided for @hrMonthlyGross.
  ///
  /// In en, this message translates to:
  /// **'Monthly gross'**
  String get hrMonthlyGross;

  /// No description provided for @hrStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get hrStatus;

  /// No description provided for @hrStatusesActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get hrStatusesActive;

  /// No description provided for @hrStatusesLeft.
  ///
  /// In en, this message translates to:
  /// **'Left'**
  String get hrStatusesLeft;

  /// No description provided for @hrSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get hrSave;

  /// No description provided for @hrSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved'**
  String get hrSaved;

  /// No description provided for @hrCreate.
  ///
  /// In en, this message translates to:
  /// **'Add employee'**
  String get hrCreate;

  /// No description provided for @hrSalaryTitle.
  ///
  /// In en, this message translates to:
  /// **'Salary structure'**
  String get hrSalaryTitle;

  /// No description provided for @hrSalaryEffectiveFrom.
  ///
  /// In en, this message translates to:
  /// **'Effective from'**
  String get hrSalaryEffectiveFrom;

  /// No description provided for @hrSalaryComponent.
  ///
  /// In en, this message translates to:
  /// **'Component'**
  String get hrSalaryComponent;

  /// No description provided for @hrSalaryMonthly.
  ///
  /// In en, this message translates to:
  /// **'Monthly (₹)'**
  String get hrSalaryMonthly;

  /// No description provided for @hrSalaryPfWage.
  ///
  /// In en, this message translates to:
  /// **'Basic/DA (PF wage)'**
  String get hrSalaryPfWage;

  /// No description provided for @hrSalaryHra.
  ///
  /// In en, this message translates to:
  /// **'HRA'**
  String get hrSalaryHra;

  /// No description provided for @hrSalaryEsiExcluded.
  ///
  /// In en, this message translates to:
  /// **'Not ESI wages'**
  String get hrSalaryEsiExcluded;

  /// No description provided for @hrSalaryAdd.
  ///
  /// In en, this message translates to:
  /// **'Add component'**
  String get hrSalaryAdd;

  /// No description provided for @hrSalaryRevise.
  ///
  /// In en, this message translates to:
  /// **'Save revision'**
  String get hrSalaryRevise;

  /// No description provided for @hrSalaryHistory.
  ///
  /// In en, this message translates to:
  /// **'Earlier structures'**
  String get hrSalaryHistory;

  /// No description provided for @hrSalaryGross.
  ///
  /// In en, this message translates to:
  /// **'Monthly gross'**
  String get hrSalaryGross;

  /// No description provided for @hrSalaryAnnual.
  ///
  /// In en, this message translates to:
  /// **'Yearly'**
  String get hrSalaryAnnual;

  /// No description provided for @hrSalaryDefaultsBasic.
  ///
  /// In en, this message translates to:
  /// **'Basic'**
  String get hrSalaryDefaultsBasic;

  /// No description provided for @hrSalaryDefaultsHra.
  ///
  /// In en, this message translates to:
  /// **'HRA'**
  String get hrSalaryDefaultsHra;

  /// No description provided for @hrSalaryDefaultsSpecial.
  ///
  /// In en, this message translates to:
  /// **'Special allowance'**
  String get hrSalaryDefaultsSpecial;

  /// No description provided for @hrDeclarationTitle.
  ///
  /// In en, this message translates to:
  /// **'Tax declaration'**
  String get hrDeclarationTitle;

  /// No description provided for @hrDeclarationHint.
  ///
  /// In en, this message translates to:
  /// **'Used for TDS. Deductions other than the standard deduction apply only in the old regime.'**
  String get hrDeclarationHint;

  /// No description provided for @hrDeclarationFy.
  ///
  /// In en, this message translates to:
  /// **'Financial year'**
  String get hrDeclarationFy;

  /// No description provided for @hrDeclarationRentPaid.
  ///
  /// In en, this message translates to:
  /// **'Rent paid in the year'**
  String get hrDeclarationRentPaid;

  /// No description provided for @hrDeclarationC80.
  ///
  /// In en, this message translates to:
  /// **'80C investments (PF is added automatically)'**
  String get hrDeclarationC80;

  /// No description provided for @hrDeclarationCcd1b.
  ///
  /// In en, this message translates to:
  /// **'80CCD(1B) NPS'**
  String get hrDeclarationCcd1b;

  /// No description provided for @hrDeclarationD80.
  ///
  /// In en, this message translates to:
  /// **'80D health insurance'**
  String get hrDeclarationD80;

  /// No description provided for @hrDeclarationHomeLoanInterest.
  ///
  /// In en, this message translates to:
  /// **'Home loan interest'**
  String get hrDeclarationHomeLoanInterest;

  /// No description provided for @hrDeclarationOtherDeductions.
  ///
  /// In en, this message translates to:
  /// **'Other deductions (80E, 80G…)'**
  String get hrDeclarationOtherDeductions;

  /// No description provided for @hrDeclarationOtherIncome.
  ///
  /// In en, this message translates to:
  /// **'Other income'**
  String get hrDeclarationOtherIncome;

  /// No description provided for @hrDeclarationPreviousEmployerSalary.
  ///
  /// In en, this message translates to:
  /// **'Salary from previous employer this year'**
  String get hrDeclarationPreviousEmployerSalary;

  /// No description provided for @hrDeclarationPreviousEmployerTds.
  ///
  /// In en, this message translates to:
  /// **'TDS already deducted this year (previous employer, or before Varchasv)'**
  String get hrDeclarationPreviousEmployerTds;

  /// No description provided for @hrDeclarationSave.
  ///
  /// In en, this message translates to:
  /// **'Save declaration'**
  String get hrDeclarationSave;

  /// No description provided for @hrAttendanceTitle.
  ///
  /// In en, this message translates to:
  /// **'Attendance'**
  String get hrAttendanceTitle;

  /// No description provided for @hrAttendanceSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Unmarked working days count as present. Click a day to mark it absent, then half day, then present again.'**
  String get hrAttendanceSubtitle;

  /// No description provided for @hrAttendanceLegendPresent.
  ///
  /// In en, this message translates to:
  /// **'Present'**
  String get hrAttendanceLegendPresent;

  /// No description provided for @hrAttendanceLegendAbsent.
  ///
  /// In en, this message translates to:
  /// **'Absent'**
  String get hrAttendanceLegendAbsent;

  /// No description provided for @hrAttendanceLegendHalfDay.
  ///
  /// In en, this message translates to:
  /// **'Half day'**
  String get hrAttendanceLegendHalfDay;

  /// No description provided for @hrAttendanceLegendLeave.
  ///
  /// In en, this message translates to:
  /// **'On leave'**
  String get hrAttendanceLegendLeave;

  /// No description provided for @hrAttendanceLegendWeekOff.
  ///
  /// In en, this message translates to:
  /// **'Weekly off'**
  String get hrAttendanceLegendWeekOff;

  /// No description provided for @hrAttendanceLegendHoliday.
  ///
  /// In en, this message translates to:
  /// **'Holiday'**
  String get hrAttendanceLegendHoliday;

  /// No description provided for @hrAttendanceLegendLate.
  ///
  /// In en, this message translates to:
  /// **'Late'**
  String get hrAttendanceLegendLate;

  /// No description provided for @hrAttendanceLop.
  ///
  /// In en, this message translates to:
  /// **'Loss of pay'**
  String get hrAttendanceLop;

  /// No description provided for @hrAttendanceLocked.
  ///
  /// In en, this message translates to:
  /// **'Payroll for this month is final, so attendance can\'t change.'**
  String get hrAttendanceLocked;

  /// No description provided for @hrAttendanceHolidays.
  ///
  /// In en, this message translates to:
  /// **'Holidays'**
  String get hrAttendanceHolidays;

  /// No description provided for @hrAttendanceAddHoliday.
  ///
  /// In en, this message translates to:
  /// **'Add holiday'**
  String get hrAttendanceAddHoliday;

  /// No description provided for @hrAttendanceHolidayName.
  ///
  /// In en, this message translates to:
  /// **'Holiday'**
  String get hrAttendanceHolidayName;

  /// No description provided for @hrAttendanceNoEmployees.
  ///
  /// In en, this message translates to:
  /// **'No one was employed this month.'**
  String get hrAttendanceNoEmployees;

  /// No description provided for @hrAttendanceSaving.
  ///
  /// In en, this message translates to:
  /// **'Saving…'**
  String get hrAttendanceSaving;

  /// No description provided for @hrLeaveTitle.
  ///
  /// In en, this message translates to:
  /// **'Leave'**
  String get hrLeaveTitle;

  /// No description provided for @hrLeaveSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Requests, approvals and balances.'**
  String get hrLeaveSubtitle;

  /// No description provided for @hrLeaveNew.
  ///
  /// In en, this message translates to:
  /// **'Apply for leave'**
  String get hrLeaveNew;

  /// No description provided for @hrLeaveEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get hrLeaveEmployee;

  /// No description provided for @hrLeaveType.
  ///
  /// In en, this message translates to:
  /// **'Leave type'**
  String get hrLeaveType;

  /// No description provided for @hrLeaveFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get hrLeaveFrom;

  /// No description provided for @hrLeaveTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get hrLeaveTo;

  /// No description provided for @hrLeaveHalfDay.
  ///
  /// In en, this message translates to:
  /// **'Half day'**
  String get hrLeaveHalfDay;

  /// No description provided for @hrLeaveReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get hrLeaveReason;

  /// No description provided for @hrLeaveDays.
  ///
  /// In en, this message translates to:
  /// **'Days'**
  String get hrLeaveDays;

  /// No description provided for @hrLeaveSubmit.
  ///
  /// In en, this message translates to:
  /// **'Submit request'**
  String get hrLeaveSubmit;

  /// No description provided for @hrLeaveApprove.
  ///
  /// In en, this message translates to:
  /// **'Approve'**
  String get hrLeaveApprove;

  /// No description provided for @hrLeaveReject.
  ///
  /// In en, this message translates to:
  /// **'Reject'**
  String get hrLeaveReject;

  /// No description provided for @hrLeaveCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get hrLeaveCancel;

  /// No description provided for @hrLeavePending.
  ///
  /// In en, this message translates to:
  /// **'Waiting for approval'**
  String get hrLeavePending;

  /// No description provided for @hrLeaveAll.
  ///
  /// In en, this message translates to:
  /// **'All requests'**
  String get hrLeaveAll;

  /// No description provided for @hrLeaveBalances.
  ///
  /// In en, this message translates to:
  /// **'Leave balances'**
  String get hrLeaveBalances;

  /// No description provided for @hrLeaveOpening.
  ///
  /// In en, this message translates to:
  /// **'Brought forward'**
  String get hrLeaveOpening;

  /// No description provided for @hrLeaveQuota.
  ///
  /// In en, this message translates to:
  /// **'This year'**
  String get hrLeaveQuota;

  /// No description provided for @hrLeaveTaken.
  ///
  /// In en, this message translates to:
  /// **'Taken'**
  String get hrLeaveTaken;

  /// No description provided for @hrLeaveBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get hrLeaveBalance;

  /// No description provided for @hrLeaveNone.
  ///
  /// In en, this message translates to:
  /// **'No leave requests.'**
  String get hrLeaveNone;

  /// No description provided for @hrLeaveStatusesPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get hrLeaveStatusesPending;

  /// No description provided for @hrLeaveStatusesApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get hrLeaveStatusesApproved;

  /// No description provided for @hrLeaveStatusesRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get hrLeaveStatusesRejected;

  /// No description provided for @hrLeaveStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get hrLeaveStatusesCancelled;

  /// No description provided for @hrSettleTitle.
  ///
  /// In en, this message translates to:
  /// **'Full and final settlement'**
  String get hrSettleTitle;

  /// No description provided for @hrSettleHint.
  ///
  /// In en, this message translates to:
  /// **'Marks the employee as left, and pays gratuity and leave encashment. The last month\'s salary comes through payroll.'**
  String get hrSettleHint;

  /// No description provided for @hrSettleLeftOn.
  ///
  /// In en, this message translates to:
  /// **'Last working day'**
  String get hrSettleLeftOn;

  /// No description provided for @hrSettleServiceYears.
  ///
  /// In en, this message translates to:
  /// **'Service (years)'**
  String get hrSettleServiceYears;

  /// No description provided for @hrSettleGratuity.
  ///
  /// In en, this message translates to:
  /// **'Gratuity'**
  String get hrSettleGratuity;

  /// No description provided for @hrSettleNotEligible.
  ///
  /// In en, this message translates to:
  /// **'Not due (under 5 years)'**
  String get hrSettleNotEligible;

  /// No description provided for @hrSettleLeaveDays.
  ///
  /// In en, this message translates to:
  /// **'Leave to encash (days)'**
  String get hrSettleLeaveDays;

  /// No description provided for @hrSettleEncashment.
  ///
  /// In en, this message translates to:
  /// **'Leave encashment'**
  String get hrSettleEncashment;

  /// No description provided for @hrSettleOtherEarnings.
  ///
  /// In en, this message translates to:
  /// **'Other dues (bonus, notice pay)'**
  String get hrSettleOtherEarnings;

  /// No description provided for @hrSettleRecoveries.
  ///
  /// In en, this message translates to:
  /// **'Recoveries (advances)'**
  String get hrSettleRecoveries;

  /// No description provided for @hrSettleRemarks.
  ///
  /// In en, this message translates to:
  /// **'Remarks'**
  String get hrSettleRemarks;

  /// No description provided for @hrSettleTotal.
  ///
  /// In en, this message translates to:
  /// **'Net payable'**
  String get hrSettleTotal;

  /// No description provided for @hrSettleConfirm.
  ///
  /// In en, this message translates to:
  /// **'Settle and mark as left'**
  String get hrSettleConfirm;

  /// No description provided for @hrSettleDone.
  ///
  /// In en, this message translates to:
  /// **'Settled on {date}: {amount}'**
  String hrSettleDone(String date, String amount);

  /// No description provided for @hrPayslips.
  ///
  /// In en, this message translates to:
  /// **'Payslips'**
  String get hrPayslips;

  /// No description provided for @hrErrorsInvalidPan.
  ///
  /// In en, this message translates to:
  /// **'That PAN isn\'t valid (e.g. ABCDE1234F).'**
  String get hrErrorsInvalidPan;

  /// No description provided for @hrErrorsInvalidIfsc.
  ///
  /// In en, this message translates to:
  /// **'That IFSC isn\'t valid (e.g. HDFC0001234).'**
  String get hrErrorsInvalidIfsc;

  /// No description provided for @hrErrorsInvalidBankAccount.
  ///
  /// In en, this message translates to:
  /// **'Enter 6 to 18 digits.'**
  String get hrErrorsInvalidBankAccount;

  /// No description provided for @hrErrorsBasicRequired.
  ///
  /// In en, this message translates to:
  /// **'Mark at least one component as Basic/DA.'**
  String get hrErrorsBasicRequired;

  /// No description provided for @hrErrorsNoComponents.
  ///
  /// In en, this message translates to:
  /// **'Add at least one salary component.'**
  String get hrErrorsNoComponents;

  /// No description provided for @hrErrorsDuplicateComponent.
  ///
  /// In en, this message translates to:
  /// **'Two components have the same code.'**
  String get hrErrorsDuplicateComponent;

  /// No description provided for @hrErrorsEmployeeCodeTaken.
  ///
  /// In en, this message translates to:
  /// **'Another employee already has that code.'**
  String get hrErrorsEmployeeCodeTaken;

  /// No description provided for @hrErrorsDobAfterJoining.
  ///
  /// In en, this message translates to:
  /// **'Date of birth must be before joining.'**
  String get hrErrorsDobAfterJoining;

  /// No description provided for @hrErrorsBeforeJoining.
  ///
  /// In en, this message translates to:
  /// **'That\'s before the joining date.'**
  String get hrErrorsBeforeJoining;

  /// No description provided for @hrErrorsLeaveOverlap.
  ///
  /// In en, this message translates to:
  /// **'This overlaps another leave request.'**
  String get hrErrorsLeaveOverlap;

  /// No description provided for @hrErrorsInsufficientLeaveBalance.
  ///
  /// In en, this message translates to:
  /// **'Not enough leave balance.'**
  String get hrErrorsInsufficientLeaveBalance;

  /// No description provided for @hrErrorsNoWorkingDays.
  ///
  /// In en, this message translates to:
  /// **'Those dates are all holidays or weekly offs.'**
  String get hrErrorsNoWorkingDays;

  /// No description provided for @hrErrorsHalfDaySingleDate.
  ///
  /// In en, this message translates to:
  /// **'A half day must be a single date.'**
  String get hrErrorsHalfDaySingleDate;

  /// No description provided for @hrErrorsLeaveCrossesYear.
  ///
  /// In en, this message translates to:
  /// **'Split leave that runs past 31 March.'**
  String get hrErrorsLeaveCrossesYear;

  /// No description provided for @hrErrorsNotEmployedOnDate.
  ///
  /// In en, this message translates to:
  /// **'Not employed on that date.'**
  String get hrErrorsNotEmployedOnDate;

  /// No description provided for @hrErrorsDayOnLeave.
  ///
  /// In en, this message translates to:
  /// **'That day is on approved leave; cancel the leave first.'**
  String get hrErrorsDayOnLeave;

  /// No description provided for @hrErrorsPayrollFinalized.
  ///
  /// In en, this message translates to:
  /// **'Payroll for that month is already final.'**
  String get hrErrorsPayrollFinalized;

  /// No description provided for @hrErrorsLeaveNotPending.
  ///
  /// In en, this message translates to:
  /// **'This request has already been decided.'**
  String get hrErrorsLeaveNotPending;

  /// No description provided for @hrErrorsLeaveNotOpen.
  ///
  /// In en, this message translates to:
  /// **'This request is already closed.'**
  String get hrErrorsLeaveNotOpen;

  /// No description provided for @hrErrorsLeftBeforeJoining.
  ///
  /// In en, this message translates to:
  /// **'That\'s before the joining date.'**
  String get hrErrorsLeftBeforeJoining;

  /// No description provided for @hrErrorsNoSalaryStructure.
  ///
  /// In en, this message translates to:
  /// **'Add a salary structure first.'**
  String get hrErrorsNoSalaryStructure;

  /// No description provided for @hrErrorsAlreadyLeft.
  ///
  /// In en, this message translates to:
  /// **'This employee has already been settled.'**
  String get hrErrorsAlreadyLeft;

  /// No description provided for @hrErrorsRecoveriesExceedDues.
  ///
  /// In en, this message translates to:
  /// **'Recoveries can\'t be more than the dues.'**
  String get hrErrorsRecoveriesExceedDues;

  /// No description provided for @hrErrorsInvalidUan.
  ///
  /// In en, this message translates to:
  /// **'UAN has 12 digits.'**
  String get hrErrorsInvalidUan;

  /// No description provided for @hrErrorsInvalidEsiNumber.
  ///
  /// In en, this message translates to:
  /// **'ESI IP number has 10 to 17 digits.'**
  String get hrErrorsInvalidEsiNumber;

  /// No description provided for @hrErrorsInvalidAadhaarLast4.
  ///
  /// In en, this message translates to:
  /// **'Enter only the last 4 digits.'**
  String get hrErrorsInvalidAadhaarLast4;

  /// No description provided for @hrErrorsInvalidPhone.
  ///
  /// In en, this message translates to:
  /// **'Enter a 10-digit mobile number.'**
  String get hrErrorsInvalidPhone;

  /// No description provided for @hrErrorsToBeforeFrom.
  ///
  /// In en, this message translates to:
  /// **'“To” can\'t be before “From”.'**
  String get hrErrorsToBeforeFrom;

  /// No description provided for @hrErrorsUnknownLeaveType.
  ///
  /// In en, this message translates to:
  /// **'Choose a leave type.'**
  String get hrErrorsUnknownLeaveType;

  /// No description provided for @hrErrorsUnknownEmployee.
  ///
  /// In en, this message translates to:
  /// **'Choose an employee.'**
  String get hrErrorsUnknownEmployee;

  /// No description provided for @hrErrorsLoanNotActive.
  ///
  /// In en, this message translates to:
  /// **'This loan is already fully paid back or cancelled.'**
  String get hrErrorsLoanNotActive;

  /// No description provided for @hrErrorsOverRecovery.
  ///
  /// In en, this message translates to:
  /// **'The amount is more than what is still owed on this loan.'**
  String get hrErrorsOverRecovery;

  /// No description provided for @hrErrorsReceiptBeforeLoan.
  ///
  /// In en, this message translates to:
  /// **'The repayment date is before the date the loan was given.'**
  String get hrErrorsReceiptBeforeLoan;

  /// No description provided for @hrErrorsExpiryBeforeIssue.
  ///
  /// In en, this message translates to:
  /// **'The expiry date is before the issue date.'**
  String get hrErrorsExpiryBeforeIssue;

  /// No description provided for @hrLoansTitle.
  ///
  /// In en, this message translates to:
  /// **'Advances and loans'**
  String get hrLoansTitle;

  /// No description provided for @hrLoansNew.
  ///
  /// In en, this message translates to:
  /// **'Give an advance or loan'**
  String get hrLoansNew;

  /// No description provided for @hrLoansKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get hrLoansKind;

  /// No description provided for @hrLoansKindsAdvance.
  ///
  /// In en, this message translates to:
  /// **'Salary advance'**
  String get hrLoansKindsAdvance;

  /// No description provided for @hrLoansKindsLoan.
  ///
  /// In en, this message translates to:
  /// **'Loan'**
  String get hrLoansKindsLoan;

  /// No description provided for @hrLoansDate.
  ///
  /// In en, this message translates to:
  /// **'Paid on'**
  String get hrLoansDate;

  /// No description provided for @hrLoansAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get hrLoansAmount;

  /// No description provided for @hrLoansInstalment.
  ///
  /// In en, this message translates to:
  /// **'Monthly instalment'**
  String get hrLoansInstalment;

  /// No description provided for @hrLoansStartPeriod.
  ///
  /// In en, this message translates to:
  /// **'Recover from'**
  String get hrLoansStartPeriod;

  /// No description provided for @hrLoansPaidFrom.
  ///
  /// In en, this message translates to:
  /// **'Paid from'**
  String get hrLoansPaidFrom;

  /// No description provided for @hrLoansRemarks.
  ///
  /// In en, this message translates to:
  /// **'Remarks'**
  String get hrLoansRemarks;

  /// No description provided for @hrLoansRecovered.
  ///
  /// In en, this message translates to:
  /// **'Recovered'**
  String get hrLoansRecovered;

  /// No description provided for @hrLoansBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get hrLoansBalance;

  /// No description provided for @hrLoansStatusesActive.
  ///
  /// In en, this message translates to:
  /// **'Recovering'**
  String get hrLoansStatusesActive;

  /// No description provided for @hrLoansStatusesClosed.
  ///
  /// In en, this message translates to:
  /// **'Recovered'**
  String get hrLoansStatusesClosed;

  /// No description provided for @hrLoansStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get hrLoansStatusesCancelled;

  /// No description provided for @hrLoansNone.
  ///
  /// In en, this message translates to:
  /// **'No advances or loans.'**
  String get hrLoansNone;

  /// No description provided for @hrLoansCreate.
  ///
  /// In en, this message translates to:
  /// **'Pay out'**
  String get hrLoansCreate;

  /// No description provided for @hrLoansCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get hrLoansCancel;

  /// No description provided for @hrLoansReceive.
  ///
  /// In en, this message translates to:
  /// **'Receive repayment'**
  String get hrLoansReceive;

  /// No description provided for @hrLoansReceiveAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount received'**
  String get hrLoansReceiveAmount;

  /// No description provided for @hrLoansReceivedInto.
  ///
  /// In en, this message translates to:
  /// **'Received into'**
  String get hrLoansReceivedInto;

  /// No description provided for @hrLoansReceiveSave.
  ///
  /// In en, this message translates to:
  /// **'Save repayment'**
  String get hrLoansReceiveSave;

  /// No description provided for @hrShiftsTitle.
  ///
  /// In en, this message translates to:
  /// **'Shifts'**
  String get hrShiftsTitle;

  /// No description provided for @hrShiftsName.
  ///
  /// In en, this message translates to:
  /// **'Shift'**
  String get hrShiftsName;

  /// No description provided for @hrShiftsStart.
  ///
  /// In en, this message translates to:
  /// **'Starts'**
  String get hrShiftsStart;

  /// No description provided for @hrShiftsEnd.
  ///
  /// In en, this message translates to:
  /// **'Ends'**
  String get hrShiftsEnd;

  /// No description provided for @hrShiftsGrace.
  ///
  /// In en, this message translates to:
  /// **'Grace (min)'**
  String get hrShiftsGrace;

  /// No description provided for @hrShiftsFullDay.
  ///
  /// In en, this message translates to:
  /// **'Full day (min)'**
  String get hrShiftsFullDay;

  /// No description provided for @hrShiftsHalfDay.
  ///
  /// In en, this message translates to:
  /// **'Half day (min)'**
  String get hrShiftsHalfDay;

  /// No description provided for @hrShiftsIsDefault.
  ///
  /// In en, this message translates to:
  /// **'Default'**
  String get hrShiftsIsDefault;

  /// No description provided for @hrShiftsAdd.
  ///
  /// In en, this message translates to:
  /// **'Add shift'**
  String get hrShiftsAdd;

  /// No description provided for @hrShiftsSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get hrShiftsSave;

  /// No description provided for @hrShiftsNone.
  ///
  /// In en, this message translates to:
  /// **'No shifts yet. Punches are read against 09:30–18:30.'**
  String get hrShiftsNone;

  /// No description provided for @hrShiftsShift.
  ///
  /// In en, this message translates to:
  /// **'Shift'**
  String get hrShiftsShift;

  /// No description provided for @hrShiftsNoShift.
  ///
  /// In en, this message translates to:
  /// **'Company default'**
  String get hrShiftsNoShift;

  /// No description provided for @hrPunchesTitle.
  ///
  /// In en, this message translates to:
  /// **'Import punches'**
  String get hrPunchesTitle;

  /// No description provided for @hrPunchesHint.
  ///
  /// In en, this message translates to:
  /// **'A CSV from the biometric machine with columns: code, date (YYYY-MM-DD), in, out (24-hour HH:MM). Each day is read against the employee\'s shift.'**
  String get hrPunchesHint;

  /// No description provided for @hrPunchesTemplate.
  ///
  /// In en, this message translates to:
  /// **'Download sample CSV'**
  String get hrPunchesTemplate;

  /// No description provided for @hrPunchesChoose.
  ///
  /// In en, this message translates to:
  /// **'Choose CSV file'**
  String get hrPunchesChoose;

  /// No description provided for @hrPunchesImport.
  ///
  /// In en, this message translates to:
  /// **'Import {count, plural, one {{count} day} other {{count} days}}'**
  String hrPunchesImport(num count);

  /// No description provided for @hrPunchesDone.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} day} other {{count} days}} imported.'**
  String hrPunchesDone(num count);

  /// No description provided for @hrPunchesRow.
  ///
  /// In en, this message translates to:
  /// **'Row'**
  String get hrPunchesRow;

  /// No description provided for @hrPunchesCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get hrPunchesCode;

  /// No description provided for @hrPunchesDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get hrPunchesDate;

  /// No description provided for @hrPunchesWorked.
  ///
  /// In en, this message translates to:
  /// **'Worked'**
  String get hrPunchesWorked;

  /// No description provided for @hrPunchesStatus.
  ///
  /// In en, this message translates to:
  /// **'Result'**
  String get hrPunchesStatus;

  /// No description provided for @hrPunchesLate.
  ///
  /// In en, this message translates to:
  /// **'late'**
  String get hrPunchesLate;

  /// No description provided for @hrDocumentsTitle.
  ///
  /// In en, this message translates to:
  /// **'Documents and KYC'**
  String get hrDocumentsTitle;

  /// No description provided for @hrDocumentsHelp.
  ///
  /// In en, this message translates to:
  /// **'Identity and compliance documents. Only the last four characters of a number are shown. Add an expiry to be reminded before it lapses.'**
  String get hrDocumentsHelp;

  /// No description provided for @hrDocumentsNone.
  ///
  /// In en, this message translates to:
  /// **'No documents on file yet.'**
  String get hrDocumentsNone;

  /// No description provided for @hrDocumentsExpires.
  ///
  /// In en, this message translates to:
  /// **'Expires {date}'**
  String hrDocumentsExpires(String date);

  /// No description provided for @hrDocumentsNoExpiry.
  ///
  /// In en, this message translates to:
  /// **'No expiry'**
  String get hrDocumentsNoExpiry;

  /// No description provided for @hrDocumentsExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get hrDocumentsExpired;

  /// No description provided for @hrDocumentsDaysLeft.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day left} other {{n} days left}}'**
  String hrDocumentsDaysLeft(num n);

  /// No description provided for @hrDocumentsRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get hrDocumentsRemove;

  /// No description provided for @hrDocumentsKind.
  ///
  /// In en, this message translates to:
  /// **'Document'**
  String get hrDocumentsKind;

  /// No description provided for @hrDocumentsNumber.
  ///
  /// In en, this message translates to:
  /// **'Number'**
  String get hrDocumentsNumber;

  /// No description provided for @hrDocumentsIssuedOn.
  ///
  /// In en, this message translates to:
  /// **'Issued on'**
  String get hrDocumentsIssuedOn;

  /// No description provided for @hrDocumentsExpiresOnLabel.
  ///
  /// In en, this message translates to:
  /// **'Expires on'**
  String get hrDocumentsExpiresOnLabel;

  /// No description provided for @hrDocumentsAdd.
  ///
  /// In en, this message translates to:
  /// **'Add document'**
  String get hrDocumentsAdd;

  /// No description provided for @hrDocumentsKindsAadhaar.
  ///
  /// In en, this message translates to:
  /// **'Aadhaar'**
  String get hrDocumentsKindsAadhaar;

  /// No description provided for @hrDocumentsKindsPan.
  ///
  /// In en, this message translates to:
  /// **'PAN'**
  String get hrDocumentsKindsPan;

  /// No description provided for @hrDocumentsKindsPassport.
  ///
  /// In en, this message translates to:
  /// **'Passport'**
  String get hrDocumentsKindsPassport;

  /// No description provided for @hrDocumentsKindsDrivingLicence.
  ///
  /// In en, this message translates to:
  /// **'Driving licence'**
  String get hrDocumentsKindsDrivingLicence;

  /// No description provided for @hrDocumentsKindsVoterId.
  ///
  /// In en, this message translates to:
  /// **'Voter ID'**
  String get hrDocumentsKindsVoterId;

  /// No description provided for @hrDocumentsKindsBankProof.
  ///
  /// In en, this message translates to:
  /// **'Bank proof'**
  String get hrDocumentsKindsBankProof;

  /// No description provided for @hrDocumentsKindsPoliceVerification.
  ///
  /// In en, this message translates to:
  /// **'Police verification'**
  String get hrDocumentsKindsPoliceVerification;

  /// No description provided for @hrDocumentsKindsMedicalFitness.
  ///
  /// In en, this message translates to:
  /// **'Medical fitness'**
  String get hrDocumentsKindsMedicalFitness;

  /// No description provided for @hrDocumentsKindsContract.
  ///
  /// In en, this message translates to:
  /// **'Contract'**
  String get hrDocumentsKindsContract;

  /// No description provided for @hrDocumentsKindsOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get hrDocumentsKindsOther;

  /// No description provided for @hrDocumentsExpiringTitle.
  ///
  /// In en, this message translates to:
  /// **'Documents expiring'**
  String get hrDocumentsExpiringTitle;

  /// No description provided for @hrDocumentsExpiringSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Documents of working employees that have lapsed or will lapse soon, soonest first.'**
  String get hrDocumentsExpiringSubtitle;

  /// No description provided for @hrDocumentsWithin.
  ///
  /// In en, this message translates to:
  /// **'Expiring within'**
  String get hrDocumentsWithin;

  /// No description provided for @hrDocumentsWindowDays.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day} other {{n} days}}'**
  String hrDocumentsWindowDays(num n);

  /// No description provided for @hrDocumentsShow.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get hrDocumentsShow;

  /// No description provided for @hrDocumentsEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get hrDocumentsEmployee;

  /// No description provided for @hrDocumentsNoneExpiring.
  ///
  /// In en, this message translates to:
  /// **'Nothing expires in this window.'**
  String get hrDocumentsNoneExpiring;

  /// No description provided for @payrollTitle.
  ///
  /// In en, this message translates to:
  /// **'Payroll'**
  String get payrollTitle;

  /// No description provided for @payrollSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Monthly salary with PF, ESI, professional tax and TDS worked out, posted to your books.'**
  String get payrollSubtitle;

  /// No description provided for @payrollRun.
  ///
  /// In en, this message translates to:
  /// **'Run payroll'**
  String get payrollRun;

  /// No description provided for @payrollMonth.
  ///
  /// In en, this message translates to:
  /// **'Month'**
  String get payrollMonth;

  /// No description provided for @payrollNone.
  ///
  /// In en, this message translates to:
  /// **'No payroll runs yet.'**
  String get payrollNone;

  /// No description provided for @payrollEmployees.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} employee} other {{count} employees}}'**
  String payrollEmployees(num count);

  /// No description provided for @payrollStatusesDraft.
  ///
  /// In en, this message translates to:
  /// **'Draft'**
  String get payrollStatusesDraft;

  /// No description provided for @payrollStatusesFinalized.
  ///
  /// In en, this message translates to:
  /// **'Final'**
  String get payrollStatusesFinalized;

  /// No description provided for @payrollStatusesPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get payrollStatusesPaid;

  /// No description provided for @payrollStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get payrollStatusesCancelled;

  /// No description provided for @payrollColsEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get payrollColsEmployee;

  /// No description provided for @payrollColsPaidDays.
  ///
  /// In en, this message translates to:
  /// **'Paid days'**
  String get payrollColsPaidDays;

  /// No description provided for @payrollColsLop.
  ///
  /// In en, this message translates to:
  /// **'LOP days'**
  String get payrollColsLop;

  /// No description provided for @payrollColsGross.
  ///
  /// In en, this message translates to:
  /// **'Gross'**
  String get payrollColsGross;

  /// No description provided for @payrollColsPf.
  ///
  /// In en, this message translates to:
  /// **'PF'**
  String get payrollColsPf;

  /// No description provided for @payrollColsEsi.
  ///
  /// In en, this message translates to:
  /// **'ESI'**
  String get payrollColsEsi;

  /// No description provided for @payrollColsPt.
  ///
  /// In en, this message translates to:
  /// **'PT'**
  String get payrollColsPt;

  /// No description provided for @payrollColsLwf.
  ///
  /// In en, this message translates to:
  /// **'LWF'**
  String get payrollColsLwf;

  /// No description provided for @payrollColsTds.
  ///
  /// In en, this message translates to:
  /// **'TDS'**
  String get payrollColsTds;

  /// No description provided for @payrollColsOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get payrollColsOther;

  /// No description provided for @payrollColsNet.
  ///
  /// In en, this message translates to:
  /// **'Net pay'**
  String get payrollColsNet;

  /// No description provided for @payrollRefresh.
  ///
  /// In en, this message translates to:
  /// **'Refresh from attendance'**
  String get payrollRefresh;

  /// No description provided for @payrollFinalize.
  ///
  /// In en, this message translates to:
  /// **'Finalize and post'**
  String get payrollFinalize;

  /// No description provided for @payrollFinalizeHint.
  ///
  /// In en, this message translates to:
  /// **'Posts salary, PF, ESI, PT and TDS payable to your books. Attendance for the month is then locked.'**
  String get payrollFinalizeHint;

  /// No description provided for @payrollPay.
  ///
  /// In en, this message translates to:
  /// **'Record payment'**
  String get payrollPay;

  /// No description provided for @payrollPayFrom.
  ///
  /// In en, this message translates to:
  /// **'Paid from'**
  String get payrollPayFrom;

  /// No description provided for @payrollPayDate.
  ///
  /// In en, this message translates to:
  /// **'Payment date'**
  String get payrollPayDate;

  /// No description provided for @payrollCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel run'**
  String get payrollCancel;

  /// No description provided for @payrollFilesTitle.
  ///
  /// In en, this message translates to:
  /// **'Files for filing and payment'**
  String get payrollFilesTitle;

  /// No description provided for @payrollFilesEcr.
  ///
  /// In en, this message translates to:
  /// **'EPF ECR'**
  String get payrollFilesEcr;

  /// No description provided for @payrollFilesEsi.
  ///
  /// In en, this message translates to:
  /// **'ESI contribution'**
  String get payrollFilesEsi;

  /// No description provided for @payrollFilesBank.
  ///
  /// In en, this message translates to:
  /// **'Bank transfer'**
  String get payrollFilesBank;

  /// No description provided for @payrollFilesMissing.
  ///
  /// In en, this message translates to:
  /// **'Left out (details missing): {codes}'**
  String payrollFilesMissing(String codes);

  /// No description provided for @payrollTotalsGross.
  ///
  /// In en, this message translates to:
  /// **'Gross pay'**
  String get payrollTotalsGross;

  /// No description provided for @payrollTotalsDeductions.
  ///
  /// In en, this message translates to:
  /// **'Deductions'**
  String get payrollTotalsDeductions;

  /// No description provided for @payrollTotalsNet.
  ///
  /// In en, this message translates to:
  /// **'Net pay'**
  String get payrollTotalsNet;

  /// No description provided for @payrollTotalsEmployer.
  ///
  /// In en, this message translates to:
  /// **'Employer PF/ESI/LWF'**
  String get payrollTotalsEmployer;

  /// No description provided for @payrollLopEdited.
  ///
  /// In en, this message translates to:
  /// **'typed in'**
  String get payrollLopEdited;

  /// No description provided for @payrollLopReset.
  ///
  /// In en, this message translates to:
  /// **'Use attendance'**
  String get payrollLopReset;

  /// No description provided for @payrollAddDeduction.
  ///
  /// In en, this message translates to:
  /// **'Add deduction'**
  String get payrollAddDeduction;

  /// No description provided for @payrollDeductionName.
  ///
  /// In en, this message translates to:
  /// **'Deduction'**
  String get payrollDeductionName;

  /// No description provided for @payrollDeductionAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get payrollDeductionAmount;

  /// No description provided for @payrollEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get payrollEdit;

  /// No description provided for @payrollView.
  ///
  /// In en, this message translates to:
  /// **'Payslip'**
  String get payrollView;

  /// No description provided for @payrollErrorsRunExists.
  ///
  /// In en, this message translates to:
  /// **'Payroll for that month already exists.'**
  String get payrollErrorsRunExists;

  /// No description provided for @payrollErrorsEarlierRunOpen.
  ///
  /// In en, this message translates to:
  /// **'Finalize or cancel the earlier month\'s draft first.'**
  String get payrollErrorsEarlierRunOpen;

  /// No description provided for @payrollErrorsRunNotDraft.
  ///
  /// In en, this message translates to:
  /// **'Only a draft can be changed.'**
  String get payrollErrorsRunNotDraft;

  /// No description provided for @payrollErrorsRunEmpty.
  ///
  /// In en, this message translates to:
  /// **'No payslips to finalize.'**
  String get payrollErrorsRunEmpty;

  /// No description provided for @payrollErrorsRunNotFinalized.
  ///
  /// In en, this message translates to:
  /// **'Finalize the run first.'**
  String get payrollErrorsRunNotFinalized;

  /// No description provided for @payrollErrorsRunPaid.
  ///
  /// In en, this message translates to:
  /// **'A paid run can\'t be cancelled.'**
  String get payrollErrorsRunPaid;

  /// No description provided for @payrollErrorsLaterRunFinal.
  ///
  /// In en, this message translates to:
  /// **'A later month is already final; cancel that first.'**
  String get payrollErrorsLaterRunFinal;

  /// No description provided for @payrollErrorsLopExceedsDays.
  ///
  /// In en, this message translates to:
  /// **'More loss-of-pay days than days in the month.'**
  String get payrollErrorsLopExceedsDays;

  /// No description provided for @payrollErrorsDeductionsExceedPay.
  ///
  /// In en, this message translates to:
  /// **'Deductions are more than the pay.'**
  String get payrollErrorsDeductionsExceedPay;

  /// No description provided for @payrollErrorsInvalidPeriod.
  ///
  /// In en, this message translates to:
  /// **'Choose a month.'**
  String get payrollErrorsInvalidPeriod;

  /// No description provided for @payrollErrorsInvalidSettings.
  ///
  /// In en, this message translates to:
  /// **'Check the settings.'**
  String get payrollErrorsInvalidSettings;

  /// No description provided for @payrollErrorsReservedCode.
  ///
  /// In en, this message translates to:
  /// **'That code is kept for arrears worked out automatically.'**
  String get payrollErrorsReservedCode;

  /// No description provided for @payrollErrorsInvalidInstalment.
  ///
  /// In en, this message translates to:
  /// **'The instalment must be more than 0 and not more than the amount.'**
  String get payrollErrorsInvalidInstalment;

  /// No description provided for @payrollErrorsRecoveryBeforeLoan.
  ///
  /// In en, this message translates to:
  /// **'Recovery can\'t start before the loan is paid.'**
  String get payrollErrorsRecoveryBeforeLoan;

  /// No description provided for @payrollErrorsEmployeeNotActive.
  ///
  /// In en, this message translates to:
  /// **'This employee has left.'**
  String get payrollErrorsEmployeeNotActive;

  /// No description provided for @payrollErrorsLoanPartlyRecovered.
  ///
  /// In en, this message translates to:
  /// **'Part of this has been recovered already; it can\'t be cancelled.'**
  String get payrollErrorsLoanPartlyRecovered;

  /// No description provided for @payrollErrorsChallanDetailsRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter the BSR code and challan serial number.'**
  String get payrollErrorsChallanDetailsRequired;

  /// No description provided for @payrollErrorsInvalidBsrCode.
  ///
  /// In en, this message translates to:
  /// **'The BSR code has 7 digits.'**
  String get payrollErrorsInvalidBsrCode;

  /// No description provided for @payrollErrorsInvalidChallanSerial.
  ///
  /// In en, this message translates to:
  /// **'The challan serial has up to 5 digits.'**
  String get payrollErrorsInvalidChallanSerial;

  /// No description provided for @payrollErrorsInvalidTan.
  ///
  /// In en, this message translates to:
  /// **'That TAN isn\'t valid (e.g. MUMA12345B).'**
  String get payrollErrorsInvalidTan;

  /// No description provided for @payrollErrorsNoFinalPayslips.
  ///
  /// In en, this message translates to:
  /// **'No final payslips for that year.'**
  String get payrollErrorsNoFinalPayslips;

  /// No description provided for @payrollErrorsInvalidTime.
  ///
  /// In en, this message translates to:
  /// **'Use 24-hour time like 09:30.'**
  String get payrollErrorsInvalidTime;

  /// No description provided for @payrollErrorsHalfDayLongerThanFull.
  ///
  /// In en, this message translates to:
  /// **'A half day can\'t be longer than a full day.'**
  String get payrollErrorsHalfDayLongerThanFull;

  /// No description provided for @payrollErrorsInvalidAmount.
  ///
  /// In en, this message translates to:
  /// **'Enter an amount.'**
  String get payrollErrorsInvalidAmount;

  /// No description provided for @payrollSettingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Payroll settings'**
  String get payrollSettingsTitle;

  /// No description provided for @payrollSettingsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Registration codes, weekly offs and state levies.'**
  String get payrollSettingsSubtitle;

  /// No description provided for @payrollSettingsPfCode.
  ///
  /// In en, this message translates to:
  /// **'EPF establishment code'**
  String get payrollSettingsPfCode;

  /// No description provided for @payrollSettingsEsiCode.
  ///
  /// In en, this message translates to:
  /// **'ESI employer code'**
  String get payrollSettingsEsiCode;

  /// No description provided for @payrollSettingsLabourCode.
  ///
  /// In en, this message translates to:
  /// **'Apply the labour codes\' 50% wage rule'**
  String get payrollSettingsLabourCode;

  /// No description provided for @payrollSettingsLabourCodeHint.
  ///
  /// In en, this message translates to:
  /// **'Under the Code on Social Security (from 21 Nov 2025), if allowances are more than half of pay, the excess counts as PF wages.'**
  String get payrollSettingsLabourCodeHint;

  /// No description provided for @payrollSettingsWeeklyOffs.
  ///
  /// In en, this message translates to:
  /// **'Weekly offs'**
  String get payrollSettingsWeeklyOffs;

  /// No description provided for @payrollSettingsLwf.
  ///
  /// In en, this message translates to:
  /// **'Labour welfare fund'**
  String get payrollSettingsLwf;

  /// No description provided for @payrollSettingsLwfEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee share (₹)'**
  String get payrollSettingsLwfEmployee;

  /// No description provided for @payrollSettingsLwfEmployer.
  ///
  /// In en, this message translates to:
  /// **'Employer share (₹)'**
  String get payrollSettingsLwfEmployer;

  /// No description provided for @payrollSettingsLwfMonths.
  ///
  /// In en, this message translates to:
  /// **'Deducted in'**
  String get payrollSettingsLwfMonths;

  /// No description provided for @payrollSettingsEncashment.
  ///
  /// In en, this message translates to:
  /// **'Leave encashment per day'**
  String get payrollSettingsEncashment;

  /// No description provided for @payrollSettingsDivisor.
  ///
  /// In en, this message translates to:
  /// **'Monthly wages ÷ {n}'**
  String payrollSettingsDivisor(String n);

  /// No description provided for @payrollSettingsSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get payrollSettingsSave;

  /// No description provided for @payrollSettingsTan.
  ///
  /// In en, this message translates to:
  /// **'TAN (tax deduction account number)'**
  String get payrollSettingsTan;

  /// No description provided for @payrollSlipTitle.
  ///
  /// In en, this message translates to:
  /// **'Payslip'**
  String get payrollSlipTitle;

  /// No description provided for @payrollSlipFor.
  ///
  /// In en, this message translates to:
  /// **'Payslip for {month}'**
  String payrollSlipFor(String month);

  /// No description provided for @payrollSlipEarnings.
  ///
  /// In en, this message translates to:
  /// **'Earnings'**
  String get payrollSlipEarnings;

  /// No description provided for @payrollSlipDeductions.
  ///
  /// In en, this message translates to:
  /// **'Deductions'**
  String get payrollSlipDeductions;

  /// No description provided for @payrollSlipNetPay.
  ///
  /// In en, this message translates to:
  /// **'Net pay'**
  String get payrollSlipNetPay;

  /// No description provided for @payrollSlipInWords.
  ///
  /// In en, this message translates to:
  /// **'In words'**
  String get payrollSlipInWords;

  /// No description provided for @payrollSlipEmployer.
  ///
  /// In en, this message translates to:
  /// **'Employer contributions (not deducted)'**
  String get payrollSlipEmployer;

  /// No description provided for @payrollSlipTax.
  ///
  /// In en, this message translates to:
  /// **'Income tax working'**
  String get payrollSlipTax;

  /// No description provided for @payrollSlipAnnualSalary.
  ///
  /// In en, this message translates to:
  /// **'Estimated salary for the year'**
  String get payrollSlipAnnualSalary;

  /// No description provided for @payrollSlipTaxableIncome.
  ///
  /// In en, this message translates to:
  /// **'Taxable income'**
  String get payrollSlipTaxableIncome;

  /// No description provided for @payrollSlipAnnualTax.
  ///
  /// In en, this message translates to:
  /// **'Tax for the year'**
  String get payrollSlipAnnualTax;

  /// No description provided for @payrollSlipDeductedSoFar.
  ///
  /// In en, this message translates to:
  /// **'Deducted so far'**
  String get payrollSlipDeductedSoFar;

  /// No description provided for @payrollSlipPfEmployee.
  ///
  /// In en, this message translates to:
  /// **'Provident fund'**
  String get payrollSlipPfEmployee;

  /// No description provided for @payrollSlipEsiEmployee.
  ///
  /// In en, this message translates to:
  /// **'ESI'**
  String get payrollSlipEsiEmployee;

  /// No description provided for @payrollSlipPt.
  ///
  /// In en, this message translates to:
  /// **'Professional tax'**
  String get payrollSlipPt;

  /// No description provided for @payrollSlipLwf.
  ///
  /// In en, this message translates to:
  /// **'Labour welfare fund'**
  String get payrollSlipLwf;

  /// No description provided for @payrollSlipTds.
  ///
  /// In en, this message translates to:
  /// **'Income tax (TDS)'**
  String get payrollSlipTds;

  /// No description provided for @payrollSlipEps.
  ///
  /// In en, this message translates to:
  /// **'Pension (EPS)'**
  String get payrollSlipEps;

  /// No description provided for @payrollSlipEpf.
  ///
  /// In en, this message translates to:
  /// **'PF (employer)'**
  String get payrollSlipEpf;

  /// No description provided for @payrollSlipEdli.
  ///
  /// In en, this message translates to:
  /// **'EDLI'**
  String get payrollSlipEdli;

  /// No description provided for @payrollSlipAdmin.
  ///
  /// In en, this message translates to:
  /// **'PF admin'**
  String get payrollSlipAdmin;

  /// No description provided for @payrollSlipEsiEmployer.
  ///
  /// In en, this message translates to:
  /// **'ESI (employer)'**
  String get payrollSlipEsiEmployer;

  /// No description provided for @payrollSlipComputerGenerated.
  ///
  /// In en, this message translates to:
  /// **'This is a computer-generated payslip and needs no signature.'**
  String get payrollSlipComputerGenerated;

  /// No description provided for @payrollSlipEstimated.
  ///
  /// In en, this message translates to:
  /// **'Includes {count, plural, one {{count} earlier month} other {{count} earlier months}} estimated from the salary structure (paid before Varchasv).'**
  String payrollSlipEstimated(num count);

  /// No description provided for @payrollExtraTitle.
  ///
  /// In en, this message translates to:
  /// **'Extra earnings (this month only)'**
  String get payrollExtraTitle;

  /// No description provided for @payrollExtraName.
  ///
  /// In en, this message translates to:
  /// **'Earning'**
  String get payrollExtraName;

  /// No description provided for @payrollExtraAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get payrollExtraAmount;

  /// No description provided for @payrollExtraAdd.
  ///
  /// In en, this message translates to:
  /// **'Add earning'**
  String get payrollExtraAdd;

  /// No description provided for @payrollExtraEsiExcluded.
  ///
  /// In en, this message translates to:
  /// **'Not ESI wages (e.g. bonus)'**
  String get payrollExtraEsiExcluded;

  /// No description provided for @payrollLoanRecoveryTitle.
  ///
  /// In en, this message translates to:
  /// **'Loan and advance instalments'**
  String get payrollLoanRecoveryTitle;

  /// No description provided for @payrollLoanRecoveryHint.
  ///
  /// In en, this message translates to:
  /// **'Type 0 to skip this month; clear to use the instalment.'**
  String get payrollLoanRecoveryHint;

  /// No description provided for @payrollRegister.
  ///
  /// In en, this message translates to:
  /// **'Salary register'**
  String get payrollRegister;

  /// No description provided for @payrollEmail.
  ///
  /// In en, this message translates to:
  /// **'Email payslips'**
  String get payrollEmail;

  /// No description provided for @payrollEmailed.
  ///
  /// In en, this message translates to:
  /// **'Emailed {sent}.'**
  String payrollEmailed(String sent);

  /// No description provided for @payrollNoEmail.
  ///
  /// In en, this message translates to:
  /// **'No email address: {codes}'**
  String payrollNoEmail(String codes);

  /// No description provided for @statutoryTitle.
  ///
  /// In en, this message translates to:
  /// **'Statutory dues & TDS'**
  String get statutoryTitle;

  /// No description provided for @statutorySubtitle.
  ///
  /// In en, this message translates to:
  /// **'PF, ESI, professional tax, LWF and TDS from final payroll, what\'s been paid, the quarterly TDS return and Form 16.'**
  String get statutorySubtitle;

  /// No description provided for @statutoryFy.
  ///
  /// In en, this message translates to:
  /// **'Financial year'**
  String get statutoryFy;

  /// No description provided for @statutoryDues.
  ///
  /// In en, this message translates to:
  /// **'Dues and payments'**
  String get statutoryDues;

  /// No description provided for @statutoryKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get statutoryKind;

  /// No description provided for @statutoryKindsPf.
  ///
  /// In en, this message translates to:
  /// **'PF'**
  String get statutoryKindsPf;

  /// No description provided for @statutoryKindsEsi.
  ///
  /// In en, this message translates to:
  /// **'ESI'**
  String get statutoryKindsEsi;

  /// No description provided for @statutoryKindsPt.
  ///
  /// In en, this message translates to:
  /// **'Professional tax'**
  String get statutoryKindsPt;

  /// No description provided for @statutoryKindsLwf.
  ///
  /// In en, this message translates to:
  /// **'LWF'**
  String get statutoryKindsLwf;

  /// No description provided for @statutoryKindsTds.
  ///
  /// In en, this message translates to:
  /// **'TDS'**
  String get statutoryKindsTds;

  /// No description provided for @statutoryPeriod.
  ///
  /// In en, this message translates to:
  /// **'Wage month'**
  String get statutoryPeriod;

  /// No description provided for @statutoryDue.
  ///
  /// In en, this message translates to:
  /// **'Due'**
  String get statutoryDue;

  /// No description provided for @statutoryPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get statutoryPaid;

  /// No description provided for @statutoryBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get statutoryBalance;

  /// No description provided for @statutoryDueDate.
  ///
  /// In en, this message translates to:
  /// **'Pay by'**
  String get statutoryDueDate;

  /// No description provided for @statutoryPay.
  ///
  /// In en, this message translates to:
  /// **'Record payment'**
  String get statutoryPay;

  /// No description provided for @statutoryPaidOn.
  ///
  /// In en, this message translates to:
  /// **'Paid on'**
  String get statutoryPaidOn;

  /// No description provided for @statutoryAccount.
  ///
  /// In en, this message translates to:
  /// **'Paid from'**
  String get statutoryAccount;

  /// No description provided for @statutoryReference.
  ///
  /// In en, this message translates to:
  /// **'Challan / TRRN no.'**
  String get statutoryReference;

  /// No description provided for @statutoryBsrCode.
  ///
  /// In en, this message translates to:
  /// **'BSR code'**
  String get statutoryBsrCode;

  /// No description provided for @statutoryChallanSerial.
  ///
  /// In en, this message translates to:
  /// **'Challan serial no.'**
  String get statutoryChallanSerial;

  /// No description provided for @statutoryRecord.
  ///
  /// In en, this message translates to:
  /// **'Save payment'**
  String get statutoryRecord;

  /// No description provided for @statutoryNone.
  ///
  /// In en, this message translates to:
  /// **'No final payroll in this year yet.'**
  String get statutoryNone;

  /// No description provided for @statutoryOverdue.
  ///
  /// In en, this message translates to:
  /// **'overdue'**
  String get statutoryOverdue;

  /// No description provided for @statutoryQ24Title.
  ///
  /// In en, this message translates to:
  /// **'Quarterly TDS return (Form 24Q)'**
  String get statutoryQ24Title;

  /// No description provided for @statutoryQ24Quarter.
  ///
  /// In en, this message translates to:
  /// **'Quarter'**
  String get statutoryQ24Quarter;

  /// No description provided for @statutoryQ24Quarters1.
  ///
  /// In en, this message translates to:
  /// **'Q1 · Apr–Jun'**
  String get statutoryQ24Quarters1;

  /// No description provided for @statutoryQ24Quarters2.
  ///
  /// In en, this message translates to:
  /// **'Q2 · Jul–Sep'**
  String get statutoryQ24Quarters2;

  /// No description provided for @statutoryQ24Quarters3.
  ///
  /// In en, this message translates to:
  /// **'Q3 · Oct–Dec'**
  String get statutoryQ24Quarters3;

  /// No description provided for @statutoryQ24Quarters4.
  ///
  /// In en, this message translates to:
  /// **'Q4 · Jan–Mar'**
  String get statutoryQ24Quarters4;

  /// No description provided for @statutoryQ24Deductees.
  ///
  /// In en, this message translates to:
  /// **'Deductee rows'**
  String get statutoryQ24Deductees;

  /// No description provided for @statutoryQ24Challans.
  ///
  /// In en, this message translates to:
  /// **'Challans'**
  String get statutoryQ24Challans;

  /// No description provided for @statutoryQ24TotalTds.
  ///
  /// In en, this message translates to:
  /// **'TDS'**
  String get statutoryQ24TotalTds;

  /// No description provided for @statutoryQ24Download.
  ///
  /// In en, this message translates to:
  /// **'Deductee rows (CSV)'**
  String get statutoryQ24Download;

  /// No description provided for @statutoryQ24DownloadAnnex2.
  ///
  /// In en, this message translates to:
  /// **'Annexure II (CSV)'**
  String get statutoryQ24DownloadAnnex2;

  /// No description provided for @statutoryQ24RpuHint.
  ///
  /// In en, this message translates to:
  /// **'Import these into the NSDL Return Preparation Utility (RPU), check the file with the FVU, then upload it on TIN-NSDL.'**
  String get statutoryQ24RpuHint;

  /// No description provided for @statutoryQ24WarningsTanMissing.
  ///
  /// In en, this message translates to:
  /// **'Add the TAN in Payroll settings.'**
  String get statutoryQ24WarningsTanMissing;

  /// No description provided for @statutoryQ24WarningsPanMissing.
  ///
  /// In en, this message translates to:
  /// **'No PAN for {detail}: tax should be deducted at 20% without it.'**
  String statutoryQ24WarningsPanMissing(String detail);

  /// No description provided for @statutoryQ24WarningsDepositMismatch.
  ///
  /// In en, this message translates to:
  /// **'Deducted and deposited don\'t match for {detail}.'**
  String statutoryQ24WarningsDepositMismatch(String detail);

  /// No description provided for @statutoryForm16Title.
  ///
  /// In en, this message translates to:
  /// **'Form 16'**
  String get statutoryForm16Title;

  /// No description provided for @statutoryForm16Hint.
  ///
  /// In en, this message translates to:
  /// **'Part B from payroll. Download Part A from TRACES and attach it; both are signed by the employer.'**
  String get statutoryForm16Hint;

  /// No description provided for @statutoryForm16View.
  ///
  /// In en, this message translates to:
  /// **'Part B'**
  String get statutoryForm16View;

  /// No description provided for @form16Title.
  ///
  /// In en, this message translates to:
  /// **'Form 16 · Part B'**
  String get form16Title;

  /// No description provided for @form16Subtitle.
  ///
  /// In en, this message translates to:
  /// **'Certificate under section 203 for tax deducted at source on salary'**
  String get form16Subtitle;

  /// No description provided for @form16Employer.
  ///
  /// In en, this message translates to:
  /// **'Employer'**
  String get form16Employer;

  /// No description provided for @form16Employee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get form16Employee;

  /// No description provided for @form16Tan.
  ///
  /// In en, this message translates to:
  /// **'TAN'**
  String get form16Tan;

  /// No description provided for @form16Pan.
  ///
  /// In en, this message translates to:
  /// **'PAN'**
  String get form16Pan;

  /// No description provided for @form16Ay.
  ///
  /// In en, this message translates to:
  /// **'Assessment year'**
  String get form16Ay;

  /// No description provided for @form16Period.
  ///
  /// In en, this message translates to:
  /// **'Period of employment'**
  String get form16Period;

  /// No description provided for @form16Salary.
  ///
  /// In en, this message translates to:
  /// **'Salary paid'**
  String get form16Salary;

  /// No description provided for @form16Gross.
  ///
  /// In en, this message translates to:
  /// **'Gross salary'**
  String get form16Gross;

  /// No description provided for @form16Previous.
  ///
  /// In en, this message translates to:
  /// **'Salary from previous employer'**
  String get form16Previous;

  /// No description provided for @form16Exemptions.
  ///
  /// In en, this message translates to:
  /// **'Less exemptions and deductions under section 16'**
  String get form16Exemptions;

  /// No description provided for @form16HraExempt.
  ///
  /// In en, this message translates to:
  /// **'House rent allowance exempt'**
  String get form16HraExempt;

  /// No description provided for @form16StandardDeduction.
  ///
  /// In en, this message translates to:
  /// **'Standard deduction'**
  String get form16StandardDeduction;

  /// No description provided for @form16Pt.
  ///
  /// In en, this message translates to:
  /// **'Professional tax'**
  String get form16Pt;

  /// No description provided for @form16HouseProperty.
  ///
  /// In en, this message translates to:
  /// **'Income from house property (home loan interest)'**
  String get form16HouseProperty;

  /// No description provided for @form16ChapterVIA.
  ///
  /// In en, this message translates to:
  /// **'Deductions under Chapter VI-A'**
  String get form16ChapterVIA;

  /// No description provided for @form16TaxableIncome.
  ///
  /// In en, this message translates to:
  /// **'Total taxable income'**
  String get form16TaxableIncome;

  /// No description provided for @form16Tax.
  ///
  /// In en, this message translates to:
  /// **'Tax on total income'**
  String get form16Tax;

  /// No description provided for @form16Rebate.
  ///
  /// In en, this message translates to:
  /// **'Rebate under section 87A'**
  String get form16Rebate;

  /// No description provided for @form16Surcharge.
  ///
  /// In en, this message translates to:
  /// **'Surcharge'**
  String get form16Surcharge;

  /// No description provided for @form16Cess.
  ///
  /// In en, this message translates to:
  /// **'Health and education cess'**
  String get form16Cess;

  /// No description provided for @form16Total.
  ///
  /// In en, this message translates to:
  /// **'Tax payable'**
  String get form16Total;

  /// No description provided for @form16Regime.
  ///
  /// In en, this message translates to:
  /// **'Tax regime'**
  String get form16Regime;

  /// No description provided for @form16TdsQuarterly.
  ///
  /// In en, this message translates to:
  /// **'Tax deducted and deposited'**
  String get form16TdsQuarterly;

  /// No description provided for @form16Quarter.
  ///
  /// In en, this message translates to:
  /// **'Quarter'**
  String get form16Quarter;

  /// No description provided for @form16Challans.
  ///
  /// In en, this message translates to:
  /// **'Challans (BSR code · date · serial)'**
  String get form16Challans;

  /// No description provided for @form16TdsDeducted.
  ///
  /// In en, this message translates to:
  /// **'Total tax deducted'**
  String get form16TdsDeducted;

  /// No description provided for @form16Balance.
  ///
  /// In en, this message translates to:
  /// **'Tax payable (refundable)'**
  String get form16Balance;

  /// No description provided for @form16Verification.
  ///
  /// In en, this message translates to:
  /// **'Certified that the information above is true and correct, based on the books of account, documents and records available.'**
  String get form16Verification;

  /// No description provided for @form16Signature.
  ///
  /// In en, this message translates to:
  /// **'Signature of the person responsible for deducting tax'**
  String get form16Signature;

  /// No description provided for @form16PartA.
  ///
  /// In en, this message translates to:
  /// **'Part A (from TRACES) to be attached.'**
  String get form16PartA;

  /// No description provided for @form16Missing.
  ///
  /// In en, this message translates to:
  /// **'No payslips here for {months} (paid before Varchasv). Add that salary and tax before signing.'**
  String form16Missing(String months);

  /// No description provided for @mfgBomsTitle.
  ///
  /// In en, this message translates to:
  /// **'Bills of materials'**
  String get mfgBomsTitle;

  /// No description provided for @mfgBomsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What goes into each item you make, with wastage, work-centre time and overheads.'**
  String get mfgBomsSubtitle;

  /// No description provided for @mfgBomsNew.
  ///
  /// In en, this message translates to:
  /// **'New BOM'**
  String get mfgBomsNew;

  /// No description provided for @mfgBomsItem.
  ///
  /// In en, this message translates to:
  /// **'Item made'**
  String get mfgBomsItem;

  /// No description provided for @mfgBomsVersion.
  ///
  /// In en, this message translates to:
  /// **'Version'**
  String get mfgBomsVersion;

  /// No description provided for @mfgBomsOutputQty.
  ///
  /// In en, this message translates to:
  /// **'Makes (quantity)'**
  String get mfgBomsOutputQty;

  /// No description provided for @mfgBomsOverhead.
  ///
  /// In en, this message translates to:
  /// **'Fixed overhead per batch (₹)'**
  String get mfgBomsOverhead;

  /// No description provided for @mfgBomsComponent.
  ///
  /// In en, this message translates to:
  /// **'Material'**
  String get mfgBomsComponent;

  /// No description provided for @mfgBomsQty.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get mfgBomsQty;

  /// No description provided for @mfgBomsWastage.
  ///
  /// In en, this message translates to:
  /// **'Wastage %'**
  String get mfgBomsWastage;

  /// No description provided for @mfgBomsOperations.
  ///
  /// In en, this message translates to:
  /// **'Operations'**
  String get mfgBomsOperations;

  /// No description provided for @mfgBomsOperation.
  ///
  /// In en, this message translates to:
  /// **'Operation'**
  String get mfgBomsOperation;

  /// No description provided for @mfgBomsWorkCentre.
  ///
  /// In en, this message translates to:
  /// **'Work centre'**
  String get mfgBomsWorkCentre;

  /// No description provided for @mfgBomsMinutes.
  ///
  /// In en, this message translates to:
  /// **'Minutes'**
  String get mfgBomsMinutes;

  /// No description provided for @mfgBomsAddLine.
  ///
  /// In en, this message translates to:
  /// **'Add material'**
  String get mfgBomsAddLine;

  /// No description provided for @mfgBomsAddOperation.
  ///
  /// In en, this message translates to:
  /// **'Add operation'**
  String get mfgBomsAddOperation;

  /// No description provided for @mfgBomsSave.
  ///
  /// In en, this message translates to:
  /// **'Save BOM'**
  String get mfgBomsSave;

  /// No description provided for @mfgBomsMakeDefault.
  ///
  /// In en, this message translates to:
  /// **'Use as default'**
  String get mfgBomsMakeDefault;

  /// No description provided for @mfgBomsDefault.
  ///
  /// In en, this message translates to:
  /// **'Default'**
  String get mfgBomsDefault;

  /// No description provided for @mfgBomsArchive.
  ///
  /// In en, this message translates to:
  /// **'Archive'**
  String get mfgBomsArchive;

  /// No description provided for @mfgBomsArchived.
  ///
  /// In en, this message translates to:
  /// **'Archived'**
  String get mfgBomsArchived;

  /// No description provided for @mfgBomsUnitCost.
  ///
  /// In en, this message translates to:
  /// **'Cost per unit'**
  String get mfgBomsUnitCost;

  /// No description provided for @mfgBomsOverheadPerUnit.
  ///
  /// In en, this message translates to:
  /// **'Overheads per unit'**
  String get mfgBomsOverheadPerUnit;

  /// No description provided for @mfgBomsRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get mfgBomsRate;

  /// No description provided for @mfgBomsCost.
  ///
  /// In en, this message translates to:
  /// **'Cost'**
  String get mfgBomsCost;

  /// No description provided for @mfgBomsNone.
  ///
  /// In en, this message translates to:
  /// **'No BOMs yet.'**
  String get mfgBomsNone;

  /// No description provided for @mfgBomsNotes.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get mfgBomsNotes;

  /// No description provided for @mfgBomsLines.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} material} other {{count} materials}}'**
  String mfgBomsLines(num count);

  /// No description provided for @mfgWorkCentresTitle.
  ///
  /// In en, this message translates to:
  /// **'Work centres'**
  String get mfgWorkCentresTitle;

  /// No description provided for @mfgWorkCentresName.
  ///
  /// In en, this message translates to:
  /// **'Work centre'**
  String get mfgWorkCentresName;

  /// No description provided for @mfgWorkCentresCostPerHour.
  ///
  /// In en, this message translates to:
  /// **'Cost per hour (₹)'**
  String get mfgWorkCentresCostPerHour;

  /// No description provided for @mfgWorkCentresAdd.
  ///
  /// In en, this message translates to:
  /// **'Add work centre'**
  String get mfgWorkCentresAdd;

  /// No description provided for @mfgWorkCentresSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get mfgWorkCentresSave;

  /// No description provided for @mfgOrdersTitle.
  ///
  /// In en, this message translates to:
  /// **'Production orders'**
  String get mfgOrdersTitle;

  /// No description provided for @mfgOrdersSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Plan, release and complete production. Materials leave stock and output comes in at cost.'**
  String get mfgOrdersSubtitle;

  /// No description provided for @mfgOrdersNew.
  ///
  /// In en, this message translates to:
  /// **'New production order'**
  String get mfgOrdersNew;

  /// No description provided for @mfgOrdersItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get mfgOrdersItem;

  /// No description provided for @mfgOrdersQty.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get mfgOrdersQty;

  /// No description provided for @mfgOrdersDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get mfgOrdersDate;

  /// No description provided for @mfgOrdersStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get mfgOrdersStatus;

  /// No description provided for @mfgOrdersStatusesPlanned.
  ///
  /// In en, this message translates to:
  /// **'Planned'**
  String get mfgOrdersStatusesPlanned;

  /// No description provided for @mfgOrdersStatusesReleased.
  ///
  /// In en, this message translates to:
  /// **'Released'**
  String get mfgOrdersStatusesReleased;

  /// No description provided for @mfgOrdersStatusesCompleted.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get mfgOrdersStatusesCompleted;

  /// No description provided for @mfgOrdersStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get mfgOrdersStatusesCancelled;

  /// No description provided for @mfgOrdersProduced.
  ///
  /// In en, this message translates to:
  /// **'Produced'**
  String get mfgOrdersProduced;

  /// No description provided for @mfgOrdersRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get mfgOrdersRejected;

  /// No description provided for @mfgOrdersRelease.
  ///
  /// In en, this message translates to:
  /// **'Release'**
  String get mfgOrdersRelease;

  /// No description provided for @mfgOrdersIssue.
  ///
  /// In en, this message translates to:
  /// **'Issue extra material'**
  String get mfgOrdersIssue;

  /// No description provided for @mfgOrdersComplete.
  ///
  /// In en, this message translates to:
  /// **'Record output'**
  String get mfgOrdersComplete;

  /// No description provided for @mfgOrdersGoodQty.
  ///
  /// In en, this message translates to:
  /// **'Good quantity'**
  String get mfgOrdersGoodQty;

  /// No description provided for @mfgOrdersRejectedQty.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get mfgOrdersRejectedQty;

  /// No description provided for @mfgOrdersClose.
  ///
  /// In en, this message translates to:
  /// **'Close the order after this'**
  String get mfgOrdersClose;

  /// No description provided for @mfgOrdersRemaining.
  ///
  /// In en, this message translates to:
  /// **'Still to make'**
  String get mfgOrdersRemaining;

  /// No description provided for @mfgOrdersMaterials.
  ///
  /// In en, this message translates to:
  /// **'Materials for what\'s left'**
  String get mfgOrdersMaterials;

  /// No description provided for @mfgOrdersEntries.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get mfgOrdersEntries;

  /// No description provided for @mfgOrdersUnitCost.
  ///
  /// In en, this message translates to:
  /// **'Unit cost'**
  String get mfgOrdersUnitCost;

  /// No description provided for @mfgOrdersMaterialCost.
  ///
  /// In en, this message translates to:
  /// **'Material cost'**
  String get mfgOrdersMaterialCost;

  /// No description provided for @mfgOrdersOverheadCost.
  ///
  /// In en, this message translates to:
  /// **'Overheads'**
  String get mfgOrdersOverheadCost;

  /// No description provided for @mfgOrdersKindsIssue.
  ///
  /// In en, this message translates to:
  /// **'Extra issue'**
  String get mfgOrdersKindsIssue;

  /// No description provided for @mfgOrdersKindsComplete.
  ///
  /// In en, this message translates to:
  /// **'Output'**
  String get mfgOrdersKindsComplete;

  /// No description provided for @mfgOrdersReleaseNow.
  ///
  /// In en, this message translates to:
  /// **'Release straight away'**
  String get mfgOrdersReleaseNow;

  /// No description provided for @mfgOrdersNone.
  ///
  /// In en, this message translates to:
  /// **'No production orders yet.'**
  String get mfgOrdersNone;

  /// No description provided for @mfgOrdersSave.
  ///
  /// In en, this message translates to:
  /// **'Create order'**
  String get mfgOrdersSave;

  /// No description provided for @mfgOrdersCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel order'**
  String get mfgOrdersCancel;

  /// No description provided for @mfgMrpTitle.
  ///
  /// In en, this message translates to:
  /// **'Material planning (MRP)'**
  String get mfgMrpTitle;

  /// No description provided for @mfgMrpSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What to make and buy to meet open sales orders and reorder levels, net of stock and what\'s already on order.'**
  String get mfgMrpSubtitle;

  /// No description provided for @mfgMrpAsOf.
  ///
  /// In en, this message translates to:
  /// **'Plan as of'**
  String get mfgMrpAsOf;

  /// No description provided for @mfgMrpAction.
  ///
  /// In en, this message translates to:
  /// **'Action'**
  String get mfgMrpAction;

  /// No description provided for @mfgMrpActionsMake.
  ///
  /// In en, this message translates to:
  /// **'Make'**
  String get mfgMrpActionsMake;

  /// No description provided for @mfgMrpActionsBuy.
  ///
  /// In en, this message translates to:
  /// **'Buy'**
  String get mfgMrpActionsBuy;

  /// No description provided for @mfgMrpQty.
  ///
  /// In en, this message translates to:
  /// **'Quantity'**
  String get mfgMrpQty;

  /// No description provided for @mfgMrpNeedBy.
  ///
  /// In en, this message translates to:
  /// **'Needed by'**
  String get mfgMrpNeedBy;

  /// No description provided for @mfgMrpReleaseBy.
  ///
  /// In en, this message translates to:
  /// **'Start / order by'**
  String get mfgMrpReleaseBy;

  /// No description provided for @mfgMrpOnHand.
  ///
  /// In en, this message translates to:
  /// **'On hand'**
  String get mfgMrpOnHand;

  /// No description provided for @mfgMrpOnOrder.
  ///
  /// In en, this message translates to:
  /// **'On order'**
  String get mfgMrpOnOrder;

  /// No description provided for @mfgMrpSupplier.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get mfgMrpSupplier;

  /// No description provided for @mfgMrpConvert.
  ///
  /// In en, this message translates to:
  /// **'Create orders for selected'**
  String get mfgMrpConvert;

  /// No description provided for @mfgMrpCreated.
  ///
  /// In en, this message translates to:
  /// **'Created {orders}.'**
  String mfgMrpCreated(String orders);

  /// No description provided for @mfgMrpNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing to plan: stock and orders cover the demand.'**
  String get mfgMrpNone;

  /// No description provided for @mfgJobWorkTitle.
  ///
  /// In en, this message translates to:
  /// **'Job work'**
  String get mfgJobWorkTitle;

  /// No description provided for @mfgJobWorkSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods sent to job workers on a challan and received back processed. Inputs must return within a year (capital goods three).'**
  String get mfgJobWorkSubtitle;

  /// No description provided for @mfgJobWorkSend.
  ///
  /// In en, this message translates to:
  /// **'Send for job work'**
  String get mfgJobWorkSend;

  /// No description provided for @mfgJobWorkReceive.
  ///
  /// In en, this message translates to:
  /// **'Receive back'**
  String get mfgJobWorkReceive;

  /// No description provided for @mfgJobWorkJobWorker.
  ///
  /// In en, this message translates to:
  /// **'Job worker'**
  String get mfgJobWorkJobWorker;

  /// No description provided for @mfgJobWorkProcess.
  ///
  /// In en, this message translates to:
  /// **'Process'**
  String get mfgJobWorkProcess;

  /// No description provided for @mfgJobWorkSent.
  ///
  /// In en, this message translates to:
  /// **'Sent'**
  String get mfgJobWorkSent;

  /// No description provided for @mfgJobWorkPending.
  ///
  /// In en, this message translates to:
  /// **'Still with job worker'**
  String get mfgJobWorkPending;

  /// No description provided for @mfgJobWorkReturnBy.
  ///
  /// In en, this message translates to:
  /// **'Return by'**
  String get mfgJobWorkReturnBy;

  /// No description provided for @mfgJobWorkOverdue.
  ///
  /// In en, this message translates to:
  /// **'overdue'**
  String get mfgJobWorkOverdue;

  /// No description provided for @mfgJobWorkReceived.
  ///
  /// In en, this message translates to:
  /// **'Received item'**
  String get mfgJobWorkReceived;

  /// No description provided for @mfgJobWorkConsumed.
  ///
  /// In en, this message translates to:
  /// **'Inputs used'**
  String get mfgJobWorkConsumed;

  /// No description provided for @mfgJobWorkCharges.
  ///
  /// In en, this message translates to:
  /// **'Job charges (₹)'**
  String get mfgJobWorkCharges;

  /// No description provided for @mfgJobWorkFrom.
  ///
  /// In en, this message translates to:
  /// **'From challan'**
  String get mfgJobWorkFrom;

  /// No description provided for @mfgJobWorkItc04.
  ///
  /// In en, this message translates to:
  /// **'ITC-04 (half-yearly)'**
  String get mfgJobWorkItc04;

  /// No description provided for @mfgJobWorkHalf.
  ///
  /// In en, this message translates to:
  /// **'Half-year'**
  String get mfgJobWorkHalf;

  /// No description provided for @mfgJobWorkHalvesH1.
  ///
  /// In en, this message translates to:
  /// **'April–September'**
  String get mfgJobWorkHalvesH1;

  /// No description provided for @mfgJobWorkHalvesH2.
  ///
  /// In en, this message translates to:
  /// **'October–March'**
  String get mfgJobWorkHalvesH2;

  /// No description provided for @mfgJobWorkSentTable.
  ///
  /// In en, this message translates to:
  /// **'Goods sent'**
  String get mfgJobWorkSentTable;

  /// No description provided for @mfgJobWorkReceivedTable.
  ///
  /// In en, this message translates to:
  /// **'Goods received back'**
  String get mfgJobWorkReceivedTable;

  /// No description provided for @mfgJobWorkPendingTable.
  ///
  /// In en, this message translates to:
  /// **'Pending with job workers'**
  String get mfgJobWorkPendingTable;

  /// No description provided for @mfgJobWorkNone.
  ///
  /// In en, this message translates to:
  /// **'No job work yet.'**
  String get mfgJobWorkNone;

  /// No description provided for @mfgJobWorkCapitalGoods.
  ///
  /// In en, this message translates to:
  /// **'Capital goods'**
  String get mfgJobWorkCapitalGoods;

  /// No description provided for @mfgErrorsBomCycle.
  ///
  /// In en, this message translates to:
  /// **'This makes a loop: an item would need itself.'**
  String get mfgErrorsBomCycle;

  /// No description provided for @mfgErrorsBomEmpty.
  ///
  /// In en, this message translates to:
  /// **'Add at least one material.'**
  String get mfgErrorsBomEmpty;

  /// No description provided for @mfgErrorsInvalidOutputQty.
  ///
  /// In en, this message translates to:
  /// **'Enter how much a batch makes.'**
  String get mfgErrorsInvalidOutputQty;

  /// No description provided for @mfgErrorsDuplicateComponent.
  ///
  /// In en, this message translates to:
  /// **'A material appears twice.'**
  String get mfgErrorsDuplicateComponent;

  /// No description provided for @mfgErrorsUnknownWorkCentre.
  ///
  /// In en, this message translates to:
  /// **'Choose a work centre.'**
  String get mfgErrorsUnknownWorkCentre;

  /// No description provided for @mfgErrorsNoBom.
  ///
  /// In en, this message translates to:
  /// **'This item has no active BOM.'**
  String get mfgErrorsNoBom;

  /// No description provided for @mfgErrorsBomArchived.
  ///
  /// In en, this message translates to:
  /// **'That BOM is archived.'**
  String get mfgErrorsBomArchived;

  /// No description provided for @mfgErrorsOrderNotPlanned.
  ///
  /// In en, this message translates to:
  /// **'Only a planned order can be released.'**
  String get mfgErrorsOrderNotPlanned;

  /// No description provided for @mfgErrorsOrderNotReleased.
  ///
  /// In en, this message translates to:
  /// **'Release the order first.'**
  String get mfgErrorsOrderNotReleased;

  /// No description provided for @mfgErrorsSupplierRequired.
  ///
  /// In en, this message translates to:
  /// **'Choose a supplier for the items to buy.'**
  String get mfgErrorsSupplierRequired;

  /// No description provided for @mfgErrorsUnknownJobWorker.
  ///
  /// In en, this message translates to:
  /// **'Choose a supplier or customer as the job worker.'**
  String get mfgErrorsUnknownJobWorker;

  /// No description provided for @mfgErrorsUnknownChallan.
  ///
  /// In en, this message translates to:
  /// **'Choose a sent challan.'**
  String get mfgErrorsUnknownChallan;

  /// No description provided for @mfgErrorsChallanCancelled.
  ///
  /// In en, this message translates to:
  /// **'That challan is cancelled.'**
  String get mfgErrorsChallanCancelled;

  /// No description provided for @mfgErrorsItemNotSent.
  ///
  /// In en, this message translates to:
  /// **'That item wasn\'t sent on this challan.'**
  String get mfgErrorsItemNotSent;

  /// No description provided for @mfgErrorsMoreThanSent.
  ///
  /// In en, this message translates to:
  /// **'More than is still with the job worker.'**
  String get mfgErrorsMoreThanSent;

  /// No description provided for @mfgErrorsChallanHasReceipts.
  ///
  /// In en, this message translates to:
  /// **'Goods have come back on this challan; cancel those first.'**
  String get mfgErrorsChallanHasReceipts;

  /// No description provided for @posBillingTitle.
  ///
  /// In en, this message translates to:
  /// **'Billing'**
  String get posBillingTitle;

  /// No description provided for @posBillingTerminal.
  ///
  /// In en, this message translates to:
  /// **'Counter'**
  String get posBillingTerminal;

  /// No description provided for @posBillingChooseTerminal.
  ///
  /// In en, this message translates to:
  /// **'Choose a counter'**
  String get posBillingChooseTerminal;

  /// No description provided for @posBillingOpenShift.
  ///
  /// In en, this message translates to:
  /// **'Open shift'**
  String get posBillingOpenShift;

  /// No description provided for @posBillingOpeningCash.
  ///
  /// In en, this message translates to:
  /// **'Opening cash (₹)'**
  String get posBillingOpeningCash;

  /// No description provided for @posBillingCloseShift.
  ///
  /// In en, this message translates to:
  /// **'Close shift'**
  String get posBillingCloseShift;

  /// No description provided for @posBillingCountedCash.
  ///
  /// In en, this message translates to:
  /// **'Cash counted (₹)'**
  String get posBillingCountedCash;

  /// No description provided for @posBillingExpected.
  ///
  /// In en, this message translates to:
  /// **'Expected'**
  String get posBillingExpected;

  /// No description provided for @posBillingDifference.
  ///
  /// In en, this message translates to:
  /// **'Difference'**
  String get posBillingDifference;

  /// No description provided for @posBillingSearch.
  ///
  /// In en, this message translates to:
  /// **'Scan barcode or search items'**
  String get posBillingSearch;

  /// No description provided for @posBillingCart.
  ///
  /// In en, this message translates to:
  /// **'Bill'**
  String get posBillingCart;

  /// No description provided for @posBillingEmpty.
  ///
  /// In en, this message translates to:
  /// **'Add items to start a bill.'**
  String get posBillingEmpty;

  /// No description provided for @posBillingQty.
  ///
  /// In en, this message translates to:
  /// **'Qty'**
  String get posBillingQty;

  /// No description provided for @posBillingPrice.
  ///
  /// In en, this message translates to:
  /// **'Price'**
  String get posBillingPrice;

  /// No description provided for @posBillingAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get posBillingAmount;

  /// No description provided for @posBillingDiscount.
  ///
  /// In en, this message translates to:
  /// **'Bill discount (₹)'**
  String get posBillingDiscount;

  /// No description provided for @posBillingCustomer.
  ///
  /// In en, this message translates to:
  /// **'Customer mobile (for points)'**
  String get posBillingCustomer;

  /// No description provided for @posBillingCustomerName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get posBillingCustomerName;

  /// No description provided for @posBillingPoints.
  ///
  /// In en, this message translates to:
  /// **'{points} points'**
  String posBillingPoints(String points);

  /// No description provided for @posBillingRedeem.
  ///
  /// In en, this message translates to:
  /// **'Redeem points'**
  String get posBillingRedeem;

  /// No description provided for @posBillingRedeemable.
  ///
  /// In en, this message translates to:
  /// **'Up to {points} points (₹{value})'**
  String posBillingRedeemable(String points, String value);

  /// No description provided for @posBillingPayments.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get posBillingPayments;

  /// No description provided for @posBillingModesCash.
  ///
  /// In en, this message translates to:
  /// **'Cash'**
  String get posBillingModesCash;

  /// No description provided for @posBillingModesUpi.
  ///
  /// In en, this message translates to:
  /// **'UPI'**
  String get posBillingModesUpi;

  /// No description provided for @posBillingModesCard.
  ///
  /// In en, this message translates to:
  /// **'Card'**
  String get posBillingModesCard;

  /// No description provided for @posBillingModesCredit.
  ///
  /// In en, this message translates to:
  /// **'On account'**
  String get posBillingModesCredit;

  /// No description provided for @posBillingReference.
  ///
  /// In en, this message translates to:
  /// **'Ref.'**
  String get posBillingReference;

  /// No description provided for @posBillingAddPayment.
  ///
  /// In en, this message translates to:
  /// **'Split payment'**
  String get posBillingAddPayment;

  /// No description provided for @posBillingPay.
  ///
  /// In en, this message translates to:
  /// **'Complete bill'**
  String get posBillingPay;

  /// No description provided for @posBillingTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get posBillingTotal;

  /// No description provided for @posBillingChange.
  ///
  /// In en, this message translates to:
  /// **'Change to return'**
  String get posBillingChange;

  /// No description provided for @posBillingDue.
  ///
  /// In en, this message translates to:
  /// **'Still due'**
  String get posBillingDue;

  /// No description provided for @posBillingTaxable.
  ///
  /// In en, this message translates to:
  /// **'Taxable'**
  String get posBillingTaxable;

  /// No description provided for @posBillingTax.
  ///
  /// In en, this message translates to:
  /// **'GST'**
  String get posBillingTax;

  /// No description provided for @posBillingRoundOff.
  ///
  /// In en, this message translates to:
  /// **'Round off'**
  String get posBillingRoundOff;

  /// No description provided for @posBillingDone.
  ///
  /// In en, this message translates to:
  /// **'Bill {number} saved'**
  String posBillingDone(String number);

  /// No description provided for @posBillingPrint.
  ///
  /// In en, this message translates to:
  /// **'Print receipt'**
  String get posBillingPrint;

  /// No description provided for @posBillingNewBill.
  ///
  /// In en, this message translates to:
  /// **'New bill'**
  String get posBillingNewBill;

  /// No description provided for @posBillingShiftTotals.
  ///
  /// In en, this message translates to:
  /// **'This shift'**
  String get posBillingShiftTotals;

  /// No description provided for @posBillingBills.
  ///
  /// In en, this message translates to:
  /// **'Bills'**
  String get posBillingBills;

  /// No description provided for @posBillingDeviceTerminal.
  ///
  /// In en, this message translates to:
  /// **'This counter bills from its device (offline app).'**
  String get posBillingDeviceTerminal;

  /// No description provided for @posBillsTitle.
  ///
  /// In en, this message translates to:
  /// **'POS bills'**
  String get posBillsTitle;

  /// No description provided for @posBillsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Bills from all counters for a day.'**
  String get posBillsSubtitle;

  /// No description provided for @posBillsDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get posBillsDate;

  /// No description provided for @posBillsNumber.
  ///
  /// In en, this message translates to:
  /// **'Bill no.'**
  String get posBillsNumber;

  /// No description provided for @posBillsTime.
  ///
  /// In en, this message translates to:
  /// **'Time'**
  String get posBillsTime;

  /// No description provided for @posBillsMode.
  ///
  /// In en, this message translates to:
  /// **'Paid by'**
  String get posBillsMode;

  /// No description provided for @posBillsVoid.
  ///
  /// In en, this message translates to:
  /// **'Void'**
  String get posBillsVoid;

  /// No description provided for @posBillsVoided.
  ///
  /// In en, this message translates to:
  /// **'Void'**
  String get posBillsVoided;

  /// No description provided for @posBillsReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get posBillsReason;

  /// No description provided for @posBillsSummary.
  ///
  /// In en, this message translates to:
  /// **'Day summary'**
  String get posBillsSummary;

  /// No description provided for @posBillsTopItems.
  ///
  /// In en, this message translates to:
  /// **'Best sellers'**
  String get posBillsTopItems;

  /// No description provided for @posBillsMismatch.
  ///
  /// In en, this message translates to:
  /// **'Device total differed'**
  String get posBillsMismatch;

  /// No description provided for @posBillsNone.
  ///
  /// In en, this message translates to:
  /// **'No bills on this day.'**
  String get posBillsNone;

  /// No description provided for @posSettingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Counter settings'**
  String get posSettingsTitle;

  /// No description provided for @posSettingsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Pricing, loyalty points, discount limits and counters.'**
  String get posSettingsSubtitle;

  /// No description provided for @posSettingsPricesIncludeTax.
  ///
  /// In en, this message translates to:
  /// **'Prices include GST'**
  String get posSettingsPricesIncludeTax;

  /// No description provided for @posSettingsLoyalty.
  ///
  /// In en, this message translates to:
  /// **'Loyalty points'**
  String get posSettingsLoyalty;

  /// No description provided for @posSettingsLoyaltyEnabled.
  ///
  /// In en, this message translates to:
  /// **'Give loyalty points'**
  String get posSettingsLoyaltyEnabled;

  /// No description provided for @posSettingsPointsPer100.
  ///
  /// In en, this message translates to:
  /// **'Points per ₹100'**
  String get posSettingsPointsPer100;

  /// No description provided for @posSettingsPointValue.
  ///
  /// In en, this message translates to:
  /// **'Value of a point (₹)'**
  String get posSettingsPointValue;

  /// No description provided for @posSettingsMaxRedeem.
  ///
  /// In en, this message translates to:
  /// **'Most of a bill payable by points (%)'**
  String get posSettingsMaxRedeem;

  /// No description provided for @posSettingsFooter.
  ///
  /// In en, this message translates to:
  /// **'Receipt footer'**
  String get posSettingsFooter;

  /// No description provided for @posSettingsTerminals.
  ///
  /// In en, this message translates to:
  /// **'Counters'**
  String get posSettingsTerminals;

  /// No description provided for @posSettingsTerminalName.
  ///
  /// In en, this message translates to:
  /// **'Counter name'**
  String get posSettingsTerminalName;

  /// No description provided for @posSettingsWarehouse.
  ///
  /// In en, this message translates to:
  /// **'Sells from'**
  String get posSettingsWarehouse;

  /// No description provided for @posSettingsDevice.
  ///
  /// In en, this message translates to:
  /// **'Offline device'**
  String get posSettingsDevice;

  /// No description provided for @posSettingsNoDevice.
  ///
  /// In en, this message translates to:
  /// **'None (web billing)'**
  String get posSettingsNoDevice;

  /// No description provided for @posSettingsAddTerminal.
  ///
  /// In en, this message translates to:
  /// **'Add counter'**
  String get posSettingsAddTerminal;

  /// No description provided for @posSettingsSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get posSettingsSave;

  /// No description provided for @posReceiptTaxInvoice.
  ///
  /// In en, this message translates to:
  /// **'Tax invoice'**
  String get posReceiptTaxInvoice;

  /// No description provided for @posReceiptBillOfSupply.
  ///
  /// In en, this message translates to:
  /// **'Cash memo'**
  String get posReceiptBillOfSupply;

  /// No description provided for @posReceiptThanks.
  ///
  /// In en, this message translates to:
  /// **'Thank you! Visit again.'**
  String get posReceiptThanks;

  /// No description provided for @posReceiptPointsEarned.
  ///
  /// In en, this message translates to:
  /// **'Points earned: {points} · Balance {balance}'**
  String posReceiptPointsEarned(String points, String balance);

  /// No description provided for @posErrorsSessionNotOpen.
  ///
  /// In en, this message translates to:
  /// **'Open a shift on this counter first.'**
  String get posErrorsSessionNotOpen;

  /// No description provided for @posErrorsSessionAlreadyOpen.
  ///
  /// In en, this message translates to:
  /// **'A shift is already open on this counter.'**
  String get posErrorsSessionAlreadyOpen;

  /// No description provided for @posErrorsSessionClosed.
  ///
  /// In en, this message translates to:
  /// **'That shift is closed.'**
  String get posErrorsSessionClosed;

  /// No description provided for @posErrorsDeviceTerminal.
  ///
  /// In en, this message translates to:
  /// **'This counter bills from its device.'**
  String get posErrorsDeviceTerminal;

  /// No description provided for @posErrorsTerminalOnOtherDevice.
  ///
  /// In en, this message translates to:
  /// **'This counter belongs to another device.'**
  String get posErrorsTerminalOnOtherDevice;

  /// No description provided for @posErrorsTooManyPoints.
  ///
  /// In en, this message translates to:
  /// **'More points than can be used on this bill.'**
  String get posErrorsTooManyPoints;

  /// No description provided for @posErrorsLoyaltyNotAvailable.
  ///
  /// In en, this message translates to:
  /// **'Enter the customer\'s mobile number first.'**
  String get posErrorsLoyaltyNotAvailable;

  /// No description provided for @posErrorsOverpaidNonCash.
  ///
  /// In en, this message translates to:
  /// **'UPI and card can\'t be more than the amount due.'**
  String get posErrorsOverpaidNonCash;

  /// No description provided for @posErrorsUnderpaid.
  ///
  /// In en, this message translates to:
  /// **'The bill isn\'t fully paid.'**
  String get posErrorsUnderpaid;

  /// No description provided for @posErrorsInvalidPayment.
  ///
  /// In en, this message translates to:
  /// **'Enter a payment amount.'**
  String get posErrorsInvalidPayment;

  /// No description provided for @posErrorsCustomerRequiredForCredit.
  ///
  /// In en, this message translates to:
  /// **'Choose a customer for an on-account sale.'**
  String get posErrorsCustomerRequiredForCredit;

  /// No description provided for @posErrorsDiscountExceedsAmount.
  ///
  /// In en, this message translates to:
  /// **'The discount is more than the bill.'**
  String get posErrorsDiscountExceedsAmount;

  /// No description provided for @posErrorsVoidSameDayOnly.
  ///
  /// In en, this message translates to:
  /// **'Only today\'s bills can be voided.'**
  String get posErrorsVoidSameDayOnly;

  /// No description provided for @posErrorsOrderNotOpen.
  ///
  /// In en, this message translates to:
  /// **'That order is closed.'**
  String get posErrorsOrderNotOpen;

  /// No description provided for @posErrorsBillNumberTaken.
  ///
  /// In en, this message translates to:
  /// **'That bill number is already used.'**
  String get posErrorsBillNumberTaken;

  /// No description provided for @posErrorsInvalidPhone.
  ///
  /// In en, this message translates to:
  /// **'Enter a 10-digit mobile number.'**
  String get posErrorsInvalidPhone;

  /// No description provided for @posErrorsNoLines.
  ///
  /// In en, this message translates to:
  /// **'Add at least one item.'**
  String get posErrorsNoLines;

  /// No description provided for @posDeviceNoTerminal.
  ///
  /// In en, this message translates to:
  /// **'This device has no billing counter. On the web, open POS settings and link a counter to this device, then sync.'**
  String get posDeviceNoTerminal;

  /// No description provided for @posDeviceTodayBills.
  ///
  /// In en, this message translates to:
  /// **'Today\'s bills on this device'**
  String get posDeviceTodayBills;

  /// No description provided for @posDeviceWaiting.
  ///
  /// In en, this message translates to:
  /// **'Waiting to upload'**
  String get posDeviceWaiting;

  /// No description provided for @posDeviceUploaded.
  ///
  /// In en, this message translates to:
  /// **'Uploaded'**
  String get posDeviceUploaded;

  /// No description provided for @posDeviceFailed.
  ///
  /// In en, this message translates to:
  /// **'Not accepted: {error}'**
  String posDeviceFailed(String error);

  /// No description provided for @posDeviceMismatch.
  ///
  /// In en, this message translates to:
  /// **'Server total {total}'**
  String posDeviceMismatch(String total);

  /// No description provided for @posDeviceOfflineNote.
  ///
  /// In en, this message translates to:
  /// **'Bills are numbered on this device and upload when online.'**
  String get posDeviceOfflineNote;

  /// No description provided for @posDeviceNoFiscalYear.
  ///
  /// In en, this message translates to:
  /// **'No financial year covers today. Sync with the cloud first.'**
  String get posDeviceNoFiscalYear;

  /// No description provided for @posPromoReferredBy.
  ///
  /// In en, this message translates to:
  /// **'Referred by (mobile)'**
  String get posPromoReferredBy;

  /// No description provided for @posPromoReferredHint.
  ///
  /// In en, this message translates to:
  /// **'They get {points} points'**
  String posPromoReferredHint(String points);

  /// No description provided for @posPromoCoupon.
  ///
  /// In en, this message translates to:
  /// **'Coupon code'**
  String get posPromoCoupon;

  /// No description provided for @posPromoCouponOk.
  ///
  /// In en, this message translates to:
  /// **'{off} off'**
  String posPromoCouponOk(String off);

  /// No description provided for @posPromoCard.
  ///
  /// In en, this message translates to:
  /// **'Discount card'**
  String get posPromoCard;

  /// No description provided for @posPromoCardOff.
  ///
  /// In en, this message translates to:
  /// **'Discount card'**
  String get posPromoCardOff;

  /// No description provided for @posPromoCouponOff.
  ///
  /// In en, this message translates to:
  /// **'Coupon {code}'**
  String posPromoCouponOff(String code);

  /// No description provided for @posPromoVoucher.
  ///
  /// In en, this message translates to:
  /// **'Gift voucher {code}'**
  String posPromoVoucher(String code);

  /// No description provided for @posPromoToPay.
  ///
  /// In en, this message translates to:
  /// **'To pay'**
  String get posPromoToPay;

  /// No description provided for @posPromoVoucherCode.
  ///
  /// In en, this message translates to:
  /// **'Gift voucher code'**
  String get posPromoVoucherCode;

  /// No description provided for @posPromoUseVoucher.
  ///
  /// In en, this message translates to:
  /// **'Use voucher'**
  String get posPromoUseVoucher;

  /// No description provided for @posPromoReferralPoints.
  ///
  /// In en, this message translates to:
  /// **'Referral points'**
  String get posPromoReferralPoints;

  /// No description provided for @posPromoReferralPointsHint.
  ///
  /// In en, this message translates to:
  /// **'For a member whose referral joins and buys (0 = off)'**
  String get posPromoReferralPointsHint;

  /// No description provided for @posPromoErrorsCouponNotFound.
  ///
  /// In en, this message translates to:
  /// **'No such coupon, or it is switched off.'**
  String get posPromoErrorsCouponNotFound;

  /// No description provided for @posPromoErrorsCouponNotValidToday.
  ///
  /// In en, this message translates to:
  /// **'This coupon is not valid today.'**
  String get posPromoErrorsCouponNotValidToday;

  /// No description provided for @posPromoErrorsCouponUsedUp.
  ///
  /// In en, this message translates to:
  /// **'This coupon has been used up.'**
  String get posPromoErrorsCouponUsedUp;

  /// No description provided for @posPromoErrorsCouponMinBill.
  ///
  /// In en, this message translates to:
  /// **'The bill is below this coupon\'s minimum.'**
  String get posPromoErrorsCouponMinBill;

  /// No description provided for @posPromoErrorsCardNotFound.
  ///
  /// In en, this message translates to:
  /// **'No such discount card, or it is switched off.'**
  String get posPromoErrorsCardNotFound;

  /// No description provided for @posPromoErrorsCardExpired.
  ///
  /// In en, this message translates to:
  /// **'This discount card has expired.'**
  String get posPromoErrorsCardExpired;

  /// No description provided for @posPromoErrorsVoucherNotFound.
  ///
  /// In en, this message translates to:
  /// **'No gift voucher with that code.'**
  String get posPromoErrorsVoucherNotFound;

  /// No description provided for @posPromoErrorsVoucherNotUsable.
  ///
  /// In en, this message translates to:
  /// **'This gift voucher is used up or expired.'**
  String get posPromoErrorsVoucherNotUsable;

  /// No description provided for @posPromoErrorsVoucherBalanceLow.
  ///
  /// In en, this message translates to:
  /// **'The voucher does not have that much left.'**
  String get posPromoErrorsVoucherBalanceLow;

  /// No description provided for @posPromoErrorsVoucherMoreThanBill.
  ///
  /// In en, this message translates to:
  /// **'Vouchers come to more than the bill.'**
  String get posPromoErrorsVoucherMoreThanBill;

  /// No description provided for @posPromoErrorsVoucherTwice.
  ///
  /// In en, this message translates to:
  /// **'The same voucher is entered twice.'**
  String get posPromoErrorsVoucherTwice;

  /// No description provided for @posPromoErrorsOnlineOnly.
  ///
  /// In en, this message translates to:
  /// **'Coupons, cards and gift vouchers need the online counter.'**
  String get posPromoErrorsOnlineOnly;

  /// No description provided for @posCounterControls.
  ///
  /// In en, this message translates to:
  /// **'Counter controls'**
  String get posCounterControls;

  /// No description provided for @posCounterAllowRateChange.
  ///
  /// In en, this message translates to:
  /// **'Cashiers may change a rate'**
  String get posCounterAllowRateChange;

  /// No description provided for @posCounterRequireSalesman.
  ///
  /// In en, this message translates to:
  /// **'Every line needs a salesman'**
  String get posCounterRequireSalesman;

  /// No description provided for @posCounterMaxLineDiscount.
  ///
  /// In en, this message translates to:
  /// **'Largest line discount, %'**
  String get posCounterMaxLineDiscount;

  /// No description provided for @posCounterMaxBillDiscount.
  ///
  /// In en, this message translates to:
  /// **'Largest bill discount, %'**
  String get posCounterMaxBillDiscount;

  /// No description provided for @posCounterLimitHint.
  ///
  /// In en, this message translates to:
  /// **'Blank: no limit. More needs an approver\'s reason.'**
  String get posCounterLimitHint;

  /// No description provided for @posCounterSalesman.
  ///
  /// In en, this message translates to:
  /// **'Salesman'**
  String get posCounterSalesman;

  /// No description provided for @posCounterNoSalesman.
  ///
  /// In en, this message translates to:
  /// **'No salesman'**
  String get posCounterNoSalesman;

  /// No description provided for @posCounterBillSalesman.
  ///
  /// In en, this message translates to:
  /// **'Salesman for the bill'**
  String get posCounterBillSalesman;

  /// No description provided for @posCounterRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get posCounterRate;

  /// No description provided for @posCounterRateLocked.
  ///
  /// In en, this message translates to:
  /// **'Rate locked'**
  String get posCounterRateLocked;

  /// No description provided for @posCounterDisc.
  ///
  /// In en, this message translates to:
  /// **'Disc ₹'**
  String get posCounterDisc;

  /// No description provided for @posCounterLineDiscount.
  ///
  /// In en, this message translates to:
  /// **'Line discount in rupees'**
  String get posCounterLineDiscount;

  /// No description provided for @posCounterVisits.
  ///
  /// In en, this message translates to:
  /// **'Visits: {n}'**
  String posCounterVisits(String n);

  /// No description provided for @posCounterSpent.
  ///
  /// In en, this message translates to:
  /// **'Spent {v}'**
  String posCounterSpent(String v);

  /// No description provided for @posCounterReturned.
  ///
  /// In en, this message translates to:
  /// **'returned {v}'**
  String posCounterReturned(String v);

  /// No description provided for @posCounterLastVisit.
  ///
  /// In en, this message translates to:
  /// **'last on {date}'**
  String posCounterLastVisit(String date);

  /// No description provided for @posCounterBuys.
  ///
  /// In en, this message translates to:
  /// **'Usually buys'**
  String get posCounterBuys;

  /// No description provided for @posCounterNewCustomer.
  ///
  /// In en, this message translates to:
  /// **'New customer: they join on this bill.'**
  String get posCounterNewCustomer;

  /// No description provided for @posCounterApprovalReason.
  ///
  /// In en, this message translates to:
  /// **'Reason for approving'**
  String get posCounterApprovalReason;

  /// No description provided for @posCounterBrokenRate.
  ///
  /// In en, this message translates to:
  /// **'rate changed'**
  String get posCounterBrokenRate;

  /// No description provided for @posCounterBrokenLineDiscount.
  ///
  /// In en, this message translates to:
  /// **'line discount over the limit'**
  String get posCounterBrokenLineDiscount;

  /// No description provided for @posCounterBrokenBillDiscount.
  ///
  /// In en, this message translates to:
  /// **'bill discount over the limit'**
  String get posCounterBrokenBillDiscount;

  /// No description provided for @posCounterNeedsApprover.
  ///
  /// In en, this message translates to:
  /// **'Needs a manager to approve'**
  String get posCounterNeedsApprover;

  /// No description provided for @posCounterHold.
  ///
  /// In en, this message translates to:
  /// **'Hold bill'**
  String get posCounterHold;

  /// No description provided for @posCounterHeldBills.
  ///
  /// In en, this message translates to:
  /// **'Held bills ({n})'**
  String posCounterHeldBills(String n);

  /// No description provided for @posCounterHoldLabel.
  ///
  /// In en, this message translates to:
  /// **'Who is it for? (optional)'**
  String get posCounterHoldLabel;

  /// No description provided for @posCounterHoldNow.
  ///
  /// In en, this message translates to:
  /// **'Hold'**
  String get posCounterHoldNow;

  /// No description provided for @posCounterUnnamed.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get posCounterUnnamed;

  /// No description provided for @posCounterPieces.
  ///
  /// In en, this message translates to:
  /// **'pieces: {n}'**
  String posCounterPieces(String n);

  /// No description provided for @posCounterResume.
  ///
  /// In en, this message translates to:
  /// **'Bill this'**
  String get posCounterResume;

  /// No description provided for @posCounterNoneHeld.
  ///
  /// In en, this message translates to:
  /// **'No held bills.'**
  String get posCounterNoneHeld;

  /// No description provided for @posCounterHoldFirst.
  ///
  /// In en, this message translates to:
  /// **'Hold or finish the current bill before picking another.'**
  String get posCounterHoldFirst;

  /// No description provided for @posCounterSizeStock.
  ///
  /// In en, this message translates to:
  /// **'stock by size here'**
  String get posCounterSizeStock;

  /// No description provided for @posCounterAddSize.
  ///
  /// In en, this message translates to:
  /// **'Add this colour and size'**
  String get posCounterAddSize;

  /// No description provided for @posCounterKeysSearch.
  ///
  /// In en, this message translates to:
  /// **'scan or search'**
  String get posCounterKeysSearch;

  /// No description provided for @posCounterKeysHold.
  ///
  /// In en, this message translates to:
  /// **'hold bill'**
  String get posCounterKeysHold;

  /// No description provided for @posCounterKeysHeld.
  ///
  /// In en, this message translates to:
  /// **'held bills'**
  String get posCounterKeysHeld;

  /// No description provided for @posCounterKeysCustomer.
  ///
  /// In en, this message translates to:
  /// **'customer'**
  String get posCounterKeysCustomer;

  /// No description provided for @posCounterKeysDiscount.
  ///
  /// In en, this message translates to:
  /// **'discount'**
  String get posCounterKeysDiscount;

  /// No description provided for @posCounterKeysCash.
  ///
  /// In en, this message translates to:
  /// **'all cash'**
  String get posCounterKeysCash;

  /// No description provided for @posCounterKeysUpi.
  ///
  /// In en, this message translates to:
  /// **'all UPI'**
  String get posCounterKeysUpi;

  /// No description provided for @posCounterKeysCard.
  ///
  /// In en, this message translates to:
  /// **'all card'**
  String get posCounterKeysCard;

  /// No description provided for @posCounterKeysPay.
  ///
  /// In en, this message translates to:
  /// **'finish bill'**
  String get posCounterKeysPay;

  /// No description provided for @posCounterKeysExchange.
  ///
  /// In en, this message translates to:
  /// **'return or exchange'**
  String get posCounterKeysExchange;

  /// No description provided for @posCounterErrorsRateLocked.
  ///
  /// In en, this message translates to:
  /// **'The rate is locked. A manager can allow it with a reason.'**
  String get posCounterErrorsRateLocked;

  /// No description provided for @posCounterErrorsDiscountOverLimit.
  ///
  /// In en, this message translates to:
  /// **'A line discount is over the counter limit. A manager can allow it with a reason.'**
  String get posCounterErrorsDiscountOverLimit;

  /// No description provided for @posCounterErrorsBillDiscountOverLimit.
  ///
  /// In en, this message translates to:
  /// **'The bill discount is over the counter limit. A manager can allow it with a reason.'**
  String get posCounterErrorsBillDiscountOverLimit;

  /// No description provided for @posCounterErrorsSalesmanRequired.
  ///
  /// In en, this message translates to:
  /// **'Choose the salesman for every line.'**
  String get posCounterErrorsSalesmanRequired;

  /// No description provided for @posCounterErrorsUnknownSalesman.
  ///
  /// In en, this message translates to:
  /// **'That salesman is not on the staff list.'**
  String get posCounterErrorsUnknownSalesman;

  /// No description provided for @posCounterErrorsHeldBillGone.
  ///
  /// In en, this message translates to:
  /// **'That held bill was already picked up.'**
  String get posCounterErrorsHeldBillGone;

  /// No description provided for @posCounterAutoSendBill.
  ///
  /// In en, this message translates to:
  /// **'Send the bill on WhatsApp by itself when the customer gives a mobile'**
  String get posCounterAutoSendBill;

  /// No description provided for @posCounterBrowse.
  ///
  /// In en, this message translates to:
  /// **'Browse items'**
  String get posCounterBrowse;

  /// No description provided for @posCounterItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get posCounterItem;

  /// No description provided for @posCounterPiecesInBill.
  ///
  /// In en, this message translates to:
  /// **'{n} pieces on the bill'**
  String posCounterPiecesInBill(String n);

  /// No description provided for @posCounterGrossAtRate.
  ///
  /// In en, this message translates to:
  /// **'Gross at rate {v}'**
  String posCounterGrossAtRate(String v);

  /// No description provided for @posCounterOffers.
  ///
  /// In en, this message translates to:
  /// **'Discount and offers'**
  String get posCounterOffers;

  /// No description provided for @posCounterBreakdown.
  ///
  /// In en, this message translates to:
  /// **'Bill breakdown'**
  String get posCounterBreakdown;

  /// No description provided for @posCounterInclGst.
  ///
  /// In en, this message translates to:
  /// **'including GST'**
  String get posCounterInclGst;

  /// No description provided for @posCounterBillItems.
  ///
  /// In en, this message translates to:
  /// **'Bill items'**
  String get posCounterBillItems;

  /// No description provided for @posCounterScanToStart.
  ///
  /// In en, this message translates to:
  /// **'Scan a barcode or search to start a bill. Press F4 to pick up a held bill.'**
  String get posCounterScanToStart;

  /// No description provided for @bankingAccountsTitle.
  ///
  /// In en, this message translates to:
  /// **'Banks'**
  String get bankingAccountsTitle;

  /// No description provided for @bankingAccountsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Match your bank statements with the books.'**
  String get bankingAccountsSubtitle;

  /// No description provided for @bankingAccountsBookBalance.
  ///
  /// In en, this message translates to:
  /// **'As per books'**
  String get bankingAccountsBookBalance;

  /// No description provided for @bankingAccountsStatementBalance.
  ///
  /// In en, this message translates to:
  /// **'As per bank'**
  String get bankingAccountsStatementBalance;

  /// No description provided for @bankingAccountsAsOf.
  ///
  /// In en, this message translates to:
  /// **'on {date}'**
  String bankingAccountsAsOf(String date);

  /// No description provided for @bankingAccountsUnmatched.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} line to match} other {{count} lines to match}}'**
  String bankingAccountsUnmatched(num count);

  /// No description provided for @bankingAccountsAllMatched.
  ///
  /// In en, this message translates to:
  /// **'All matched'**
  String get bankingAccountsAllMatched;

  /// No description provided for @bankingAccountsNone.
  ///
  /// In en, this message translates to:
  /// **'No bank accounts yet. Add a ledger under Bank Accounts in the chart of accounts.'**
  String get bankingAccountsNone;

  /// No description provided for @bankingAccountsReconcile.
  ///
  /// In en, this message translates to:
  /// **'Reconcile'**
  String get bankingAccountsReconcile;

  /// No description provided for @bankingAccountsNoStatement.
  ///
  /// In en, this message translates to:
  /// **'No statement yet'**
  String get bankingAccountsNoStatement;

  /// No description provided for @bankingProfileTitle.
  ///
  /// In en, this message translates to:
  /// **'Bank details'**
  String get bankingProfileTitle;

  /// No description provided for @bankingProfileBankName.
  ///
  /// In en, this message translates to:
  /// **'Bank'**
  String get bankingProfileBankName;

  /// No description provided for @bankingProfileLast4.
  ///
  /// In en, this message translates to:
  /// **'Account (last 4 digits)'**
  String get bankingProfileLast4;

  /// No description provided for @bankingProfileIfsc.
  ///
  /// In en, this message translates to:
  /// **'IFSC'**
  String get bankingProfileIfsc;

  /// No description provided for @bankingProfileSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get bankingProfileSave;

  /// No description provided for @bankingImportTitle.
  ///
  /// In en, this message translates to:
  /// **'Import statement'**
  String get bankingImportTitle;

  /// No description provided for @bankingImportHint.
  ///
  /// In en, this message translates to:
  /// **'Download the statement from net banking as CSV (from Excel: Save As → CSV). Columns are found by their headings, so most Indian banks work.'**
  String get bankingImportHint;

  /// No description provided for @bankingImportFile.
  ///
  /// In en, this message translates to:
  /// **'Statement file (CSV)'**
  String get bankingImportFile;

  /// No description provided for @bankingImportButton.
  ///
  /// In en, this message translates to:
  /// **'Import'**
  String get bankingImportButton;

  /// No description provided for @bankingImportDone.
  ///
  /// In en, this message translates to:
  /// **'{added} lines added, {duplicates} already there, {matched} matched automatically.'**
  String bankingImportDone(String added, String duplicates, String matched);

  /// No description provided for @bankingFeedTitle.
  ///
  /// In en, this message translates to:
  /// **'Bank feed'**
  String get bankingFeedTitle;

  /// No description provided for @bankingFeedHint.
  ///
  /// In en, this message translates to:
  /// **'Transactions come through the RBI Account Aggregator framework once you approve a consent. Until a provider is signed up, a simulator stands in.'**
  String get bankingFeedHint;

  /// No description provided for @bankingFeedConnect.
  ///
  /// In en, this message translates to:
  /// **'Connect'**
  String get bankingFeedConnect;

  /// No description provided for @bankingFeedFetch.
  ///
  /// In en, this message translates to:
  /// **'Fetch now'**
  String get bankingFeedFetch;

  /// No description provided for @bankingFeedDisconnect.
  ///
  /// In en, this message translates to:
  /// **'Disconnect'**
  String get bankingFeedDisconnect;

  /// No description provided for @bankingFeedStatusesActive.
  ///
  /// In en, this message translates to:
  /// **'Connected'**
  String get bankingFeedStatusesActive;

  /// No description provided for @bankingFeedStatusesPending.
  ///
  /// In en, this message translates to:
  /// **'Waiting for consent'**
  String get bankingFeedStatusesPending;

  /// No description provided for @bankingFeedStatusesRevoked.
  ///
  /// In en, this message translates to:
  /// **'Disconnected'**
  String get bankingFeedStatusesRevoked;

  /// No description provided for @bankingFeedFetched.
  ///
  /// In en, this message translates to:
  /// **'Fetched up to {date}'**
  String bankingFeedFetched(String date);

  /// No description provided for @bankingFeedDone.
  ///
  /// In en, this message translates to:
  /// **'{added} new transactions, {matched} matched.'**
  String bankingFeedDone(String added, String matched);

  /// No description provided for @bankingTabsOpen.
  ///
  /// In en, this message translates to:
  /// **'To match'**
  String get bankingTabsOpen;

  /// No description provided for @bankingTabsMatched.
  ///
  /// In en, this message translates to:
  /// **'Matched'**
  String get bankingTabsMatched;

  /// No description provided for @bankingTabsIgnored.
  ///
  /// In en, this message translates to:
  /// **'Ignored'**
  String get bankingTabsIgnored;

  /// No description provided for @bankingTabsBrs.
  ///
  /// In en, this message translates to:
  /// **'Reconciliation statement'**
  String get bankingTabsBrs;

  /// No description provided for @bankingLinesDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get bankingLinesDate;

  /// No description provided for @bankingLinesDescription.
  ///
  /// In en, this message translates to:
  /// **'Narration'**
  String get bankingLinesDescription;

  /// No description provided for @bankingLinesWithdrawal.
  ///
  /// In en, this message translates to:
  /// **'Withdrawal'**
  String get bankingLinesWithdrawal;

  /// No description provided for @bankingLinesDeposit.
  ///
  /// In en, this message translates to:
  /// **'Deposit'**
  String get bankingLinesDeposit;

  /// No description provided for @bankingLinesBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get bankingLinesBalance;

  /// No description provided for @bankingLinesSuggestion.
  ///
  /// In en, this message translates to:
  /// **'Looks like'**
  String get bankingLinesSuggestion;

  /// No description provided for @bankingLinesAccept.
  ///
  /// In en, this message translates to:
  /// **'Match'**
  String get bankingLinesAccept;

  /// No description provided for @bankingLinesCreate.
  ///
  /// In en, this message translates to:
  /// **'Post entry'**
  String get bankingLinesCreate;

  /// No description provided for @bankingLinesIgnore.
  ///
  /// In en, this message translates to:
  /// **'Ignore'**
  String get bankingLinesIgnore;

  /// No description provided for @bankingLinesByHand.
  ///
  /// In en, this message translates to:
  /// **'Find entry'**
  String get bankingLinesByHand;

  /// No description provided for @bankingLinesUnmatch.
  ///
  /// In en, this message translates to:
  /// **'Unmatch'**
  String get bankingLinesUnmatch;

  /// No description provided for @bankingLinesRestore.
  ///
  /// In en, this message translates to:
  /// **'Restore'**
  String get bankingLinesRestore;

  /// No description provided for @bankingLinesAccount.
  ///
  /// In en, this message translates to:
  /// **'Post to ledger'**
  String get bankingLinesAccount;

  /// No description provided for @bankingLinesNarration.
  ///
  /// In en, this message translates to:
  /// **'Narration'**
  String get bankingLinesNarration;

  /// No description provided for @bankingLinesRule.
  ///
  /// In en, this message translates to:
  /// **'Rule: {account}'**
  String bankingLinesRule(String account);

  /// No description provided for @bankingLinesApplyRules.
  ///
  /// In en, this message translates to:
  /// **'Post all rule matches'**
  String get bankingLinesApplyRules;

  /// No description provided for @bankingLinesRulesDone.
  ///
  /// In en, this message translates to:
  /// **'{count} entries posted.'**
  String bankingLinesRulesDone(String count);

  /// No description provided for @bankingLinesNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing here.'**
  String get bankingLinesNone;

  /// No description provided for @bankingLinesEntries.
  ///
  /// In en, this message translates to:
  /// **'Unmatched entries from {from} to {to}'**
  String bankingLinesEntries(String from, String to);

  /// No description provided for @bankingLinesMatchSelected.
  ///
  /// In en, this message translates to:
  /// **'Match selected'**
  String get bankingLinesMatchSelected;

  /// No description provided for @bankingLinesSelectedTotal.
  ///
  /// In en, this message translates to:
  /// **'Selected {total} of {amount}'**
  String bankingLinesSelectedTotal(String total, String amount);

  /// No description provided for @bankingLinesReasonsAmount.
  ///
  /// In en, this message translates to:
  /// **'same amount'**
  String get bankingLinesReasonsAmount;

  /// No description provided for @bankingLinesReasonsSameDay.
  ///
  /// In en, this message translates to:
  /// **'same day'**
  String get bankingLinesReasonsSameDay;

  /// No description provided for @bankingLinesReasonsReference.
  ///
  /// In en, this message translates to:
  /// **'same reference'**
  String get bankingLinesReasonsReference;

  /// No description provided for @bankingLinesReasonsParty.
  ///
  /// In en, this message translates to:
  /// **'party named'**
  String get bankingLinesReasonsParty;

  /// No description provided for @bankingBrsAsOf.
  ///
  /// In en, this message translates to:
  /// **'As on'**
  String get bankingBrsAsOf;

  /// No description provided for @bankingBrsPerBooks.
  ///
  /// In en, this message translates to:
  /// **'Balance as per books'**
  String get bankingBrsPerBooks;

  /// No description provided for @bankingBrsNotPresented.
  ///
  /// In en, this message translates to:
  /// **'Add: cheques issued but not yet presented'**
  String get bankingBrsNotPresented;

  /// No description provided for @bankingBrsNotCredited.
  ///
  /// In en, this message translates to:
  /// **'Less: deposits not yet credited by the bank'**
  String get bankingBrsNotCredited;

  /// No description provided for @bankingBrsBankDebits.
  ///
  /// In en, this message translates to:
  /// **'Less: bank debits not in the books'**
  String get bankingBrsBankDebits;

  /// No description provided for @bankingBrsBankCredits.
  ///
  /// In en, this message translates to:
  /// **'Add: bank credits not in the books'**
  String get bankingBrsBankCredits;

  /// No description provided for @bankingBrsPerBank.
  ///
  /// In en, this message translates to:
  /// **'Balance as per bank'**
  String get bankingBrsPerBank;

  /// No description provided for @bankingBrsStatement.
  ///
  /// In en, this message translates to:
  /// **'Statement balance on {date}'**
  String bankingBrsStatement(String date);

  /// No description provided for @bankingBrsDifference.
  ///
  /// In en, this message translates to:
  /// **'Difference'**
  String get bankingBrsDifference;

  /// No description provided for @bankingBrsBalanced.
  ///
  /// In en, this message translates to:
  /// **'Reconciled'**
  String get bankingBrsBalanced;

  /// No description provided for @bankingRulesTitle.
  ///
  /// In en, this message translates to:
  /// **'Bank rules'**
  String get bankingRulesTitle;

  /// No description provided for @bankingRulesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Statement lines with these words are posted to a ledger in one click (bank charges, interest, standing orders).'**
  String get bankingRulesSubtitle;

  /// No description provided for @bankingRulesContains.
  ///
  /// In en, this message translates to:
  /// **'Narration contains'**
  String get bankingRulesContains;

  /// No description provided for @bankingRulesDirection.
  ///
  /// In en, this message translates to:
  /// **'Money'**
  String get bankingRulesDirection;

  /// No description provided for @bankingRulesDirectionsIn.
  ///
  /// In en, this message translates to:
  /// **'In'**
  String get bankingRulesDirectionsIn;

  /// No description provided for @bankingRulesDirectionsOut.
  ///
  /// In en, this message translates to:
  /// **'Out'**
  String get bankingRulesDirectionsOut;

  /// No description provided for @bankingRulesDirectionsAny.
  ///
  /// In en, this message translates to:
  /// **'In or out'**
  String get bankingRulesDirectionsAny;

  /// No description provided for @bankingRulesAccount.
  ///
  /// In en, this message translates to:
  /// **'Post to'**
  String get bankingRulesAccount;

  /// No description provided for @bankingRulesNarration.
  ///
  /// In en, this message translates to:
  /// **'Narration'**
  String get bankingRulesNarration;

  /// No description provided for @bankingRulesPriority.
  ///
  /// In en, this message translates to:
  /// **'Priority'**
  String get bankingRulesPriority;

  /// No description provided for @bankingRulesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add rule'**
  String get bankingRulesAdd;

  /// No description provided for @bankingRulesSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get bankingRulesSave;

  /// No description provided for @bankingSettlementsTitle.
  ///
  /// In en, this message translates to:
  /// **'Gateway settlements'**
  String get bankingSettlementsTitle;

  /// No description provided for @bankingSettlementsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Payouts from Razorpay, PhonePe, Paytm and others: collections less refunds, fees and GST on fees, landing in the bank as one credit.'**
  String get bankingSettlementsSubtitle;

  /// No description provided for @bankingSettlementsProvider.
  ///
  /// In en, this message translates to:
  /// **'Gateway'**
  String get bankingSettlementsProvider;

  /// No description provided for @bankingSettlementsBank.
  ///
  /// In en, this message translates to:
  /// **'Paid into'**
  String get bankingSettlementsBank;

  /// No description provided for @bankingSettlementsClearing.
  ///
  /// In en, this message translates to:
  /// **'Collections were booked to'**
  String get bankingSettlementsClearing;

  /// No description provided for @bankingSettlementsFile.
  ///
  /// In en, this message translates to:
  /// **'Settlement report (CSV)'**
  String get bankingSettlementsFile;

  /// No description provided for @bankingSettlementsImport.
  ///
  /// In en, this message translates to:
  /// **'Import'**
  String get bankingSettlementsImport;

  /// No description provided for @bankingSettlementsDone.
  ///
  /// In en, this message translates to:
  /// **'{posted} payouts posted, {skipped} already done, {matched} matched with the bank.'**
  String bankingSettlementsDone(String posted, String skipped, String matched);

  /// No description provided for @bankingSettlementsSettlementId.
  ///
  /// In en, this message translates to:
  /// **'Settlement'**
  String get bankingSettlementsSettlementId;

  /// No description provided for @bankingSettlementsSettledOn.
  ///
  /// In en, this message translates to:
  /// **'Settled'**
  String get bankingSettlementsSettledOn;

  /// No description provided for @bankingSettlementsPayments.
  ///
  /// In en, this message translates to:
  /// **'Payments'**
  String get bankingSettlementsPayments;

  /// No description provided for @bankingSettlementsGross.
  ///
  /// In en, this message translates to:
  /// **'Collected'**
  String get bankingSettlementsGross;

  /// No description provided for @bankingSettlementsRefunds.
  ///
  /// In en, this message translates to:
  /// **'Refunds'**
  String get bankingSettlementsRefunds;

  /// No description provided for @bankingSettlementsFees.
  ///
  /// In en, this message translates to:
  /// **'Fees'**
  String get bankingSettlementsFees;

  /// No description provided for @bankingSettlementsTax.
  ///
  /// In en, this message translates to:
  /// **'GST on fees'**
  String get bankingSettlementsTax;

  /// No description provided for @bankingSettlementsNet.
  ///
  /// In en, this message translates to:
  /// **'Paid out'**
  String get bankingSettlementsNet;

  /// No description provided for @bankingSettlementsMatched.
  ///
  /// In en, this message translates to:
  /// **'In bank'**
  String get bankingSettlementsMatched;

  /// No description provided for @bankingSettlementsNone.
  ///
  /// In en, this message translates to:
  /// **'No settlements yet.'**
  String get bankingSettlementsNone;

  /// No description provided for @bankingErrorsNoHeader.
  ///
  /// In en, this message translates to:
  /// **'Couldn\'t find the heading row. Save the statement as CSV with its column headings.'**
  String get bankingErrorsNoHeader;

  /// No description provided for @bankingErrorsNoRows.
  ///
  /// In en, this message translates to:
  /// **'No transactions found in the file.'**
  String get bankingErrorsNoRows;

  /// No description provided for @bankingErrorsBadAmount.
  ///
  /// In en, this message translates to:
  /// **'An amount in the file couldn\'t be read.'**
  String get bankingErrorsBadAmount;

  /// No description provided for @bankingErrorsUnknownFormat.
  ///
  /// In en, this message translates to:
  /// **'This doesn\'t look like a settlement report (it needs settlement id, amount and fee columns).'**
  String get bankingErrorsUnknownFormat;

  /// No description provided for @bankingErrorsInvalidFile.
  ///
  /// In en, this message translates to:
  /// **'The file couldn\'t be read.'**
  String get bankingErrorsInvalidFile;

  /// No description provided for @bankingErrorsNotABankAccount.
  ///
  /// In en, this message translates to:
  /// **'Choose a ledger under Bank Accounts.'**
  String get bankingErrorsNotABankAccount;

  /// No description provided for @bankingErrorsFeedNotConnected.
  ///
  /// In en, this message translates to:
  /// **'Connect the bank feed first.'**
  String get bankingErrorsFeedNotConnected;

  /// No description provided for @bankingErrorsLineAlreadyMatched.
  ///
  /// In en, this message translates to:
  /// **'That line is already matched.'**
  String get bankingErrorsLineAlreadyMatched;

  /// No description provided for @bankingErrorsVoucherNotOpen.
  ///
  /// In en, this message translates to:
  /// **'That entry is already matched or cancelled.'**
  String get bankingErrorsVoucherNotOpen;

  /// No description provided for @bankingErrorsWrongDirection.
  ///
  /// In en, this message translates to:
  /// **'Money in can only match receipts, money out only payments.'**
  String get bankingErrorsWrongDirection;

  /// No description provided for @bankingErrorsAmountsDiffer.
  ///
  /// In en, this message translates to:
  /// **'The entries don\'t add up to the line\'s amount.'**
  String get bankingErrorsAmountsDiffer;

  /// No description provided for @bankingErrorsSameAccount.
  ///
  /// In en, this message translates to:
  /// **'Choose a different ledger.'**
  String get bankingErrorsSameAccount;

  /// No description provided for @bankingErrorsInvalidIfsc.
  ///
  /// In en, this message translates to:
  /// **'Enter a valid IFSC.'**
  String get bankingErrorsInvalidIfsc;

  /// No description provided for @assetsRegisterTitle.
  ///
  /// In en, this message translates to:
  /// **'Fixed assets'**
  String get assetsRegisterTitle;

  /// No description provided for @assetsRegisterSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Register, depreciation as per the Companies Act, and the income-tax block schedule.'**
  String get assetsRegisterSubtitle;

  /// No description provided for @assetsRegisterNew.
  ///
  /// In en, this message translates to:
  /// **'Add asset'**
  String get assetsRegisterNew;

  /// No description provided for @assetsRegisterCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get assetsRegisterCode;

  /// No description provided for @assetsRegisterName.
  ///
  /// In en, this message translates to:
  /// **'Asset'**
  String get assetsRegisterName;

  /// No description provided for @assetsRegisterClass.
  ///
  /// In en, this message translates to:
  /// **'Class'**
  String get assetsRegisterClass;

  /// No description provided for @assetsRegisterPurchased.
  ///
  /// In en, this message translates to:
  /// **'Bought'**
  String get assetsRegisterPurchased;

  /// No description provided for @assetsRegisterPutToUse.
  ///
  /// In en, this message translates to:
  /// **'In use from'**
  String get assetsRegisterPutToUse;

  /// No description provided for @assetsRegisterCost.
  ///
  /// In en, this message translates to:
  /// **'Cost'**
  String get assetsRegisterCost;

  /// No description provided for @assetsRegisterAccumulated.
  ///
  /// In en, this message translates to:
  /// **'Depreciation to date'**
  String get assetsRegisterAccumulated;

  /// No description provided for @assetsRegisterBookValue.
  ///
  /// In en, this message translates to:
  /// **'Book value'**
  String get assetsRegisterBookValue;

  /// No description provided for @assetsRegisterStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get assetsRegisterStatus;

  /// No description provided for @assetsRegisterStatusesActive.
  ///
  /// In en, this message translates to:
  /// **'In use'**
  String get assetsRegisterStatusesActive;

  /// No description provided for @assetsRegisterStatusesDisposed.
  ///
  /// In en, this message translates to:
  /// **'Sold / scrapped'**
  String get assetsRegisterStatusesDisposed;

  /// No description provided for @assetsRegisterLocation.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get assetsRegisterLocation;

  /// No description provided for @assetsRegisterSerialNo.
  ///
  /// In en, this message translates to:
  /// **'Serial no.'**
  String get assetsRegisterSerialNo;

  /// No description provided for @assetsRegisterCustodian.
  ///
  /// In en, this message translates to:
  /// **'With'**
  String get assetsRegisterCustodian;

  /// No description provided for @assetsRegisterNone.
  ///
  /// In en, this message translates to:
  /// **'No assets yet.'**
  String get assetsRegisterNone;

  /// No description provided for @assetsClassesTitle.
  ///
  /// In en, this message translates to:
  /// **'Asset classes'**
  String get assetsClassesTitle;

  /// No description provided for @assetsClassesPresets.
  ///
  /// In en, this message translates to:
  /// **'Add a standard class'**
  String get assetsClassesPresets;

  /// No description provided for @assetsClassesPreset.
  ///
  /// In en, this message translates to:
  /// **'Class'**
  String get assetsClassesPreset;

  /// No description provided for @assetsClassesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get assetsClassesAdd;

  /// No description provided for @assetsClassesCustom.
  ///
  /// In en, this message translates to:
  /// **'Or define your own'**
  String get assetsClassesCustom;

  /// No description provided for @assetsClassesName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get assetsClassesName;

  /// No description provided for @assetsClassesMethod.
  ///
  /// In en, this message translates to:
  /// **'Method'**
  String get assetsClassesMethod;

  /// No description provided for @assetsClassesMethodsSlm.
  ///
  /// In en, this message translates to:
  /// **'Straight line'**
  String get assetsClassesMethodsSlm;

  /// No description provided for @assetsClassesMethodsWdv.
  ///
  /// In en, this message translates to:
  /// **'Written down value'**
  String get assetsClassesMethodsWdv;

  /// No description provided for @assetsClassesLife.
  ///
  /// In en, this message translates to:
  /// **'Useful life (years)'**
  String get assetsClassesLife;

  /// No description provided for @assetsClassesResidual.
  ///
  /// In en, this message translates to:
  /// **'Residual value %'**
  String get assetsClassesResidual;

  /// No description provided for @assetsClassesItBlock.
  ///
  /// In en, this message translates to:
  /// **'Income-tax block'**
  String get assetsClassesItBlock;

  /// No description provided for @assetsClassesItRate.
  ///
  /// In en, this message translates to:
  /// **'Tax rate %'**
  String get assetsClassesItRate;

  /// No description provided for @assetsClassesBlocksBuilding.
  ///
  /// In en, this message translates to:
  /// **'Buildings'**
  String get assetsClassesBlocksBuilding;

  /// No description provided for @assetsClassesBlocksPlantMachinery.
  ///
  /// In en, this message translates to:
  /// **'Plant & machinery'**
  String get assetsClassesBlocksPlantMachinery;

  /// No description provided for @assetsClassesBlocksFurniture.
  ///
  /// In en, this message translates to:
  /// **'Furniture & fittings'**
  String get assetsClassesBlocksFurniture;

  /// No description provided for @assetsClassesBlocksComputers.
  ///
  /// In en, this message translates to:
  /// **'Computers & software'**
  String get assetsClassesBlocksComputers;

  /// No description provided for @assetsClassesBlocksIntangibles.
  ///
  /// In en, this message translates to:
  /// **'Intangible assets'**
  String get assetsClassesBlocksIntangibles;

  /// No description provided for @assetsFormAcquisition.
  ///
  /// In en, this message translates to:
  /// **'How it came in'**
  String get assetsFormAcquisition;

  /// No description provided for @assetsFormAcquisitionsSupplier.
  ///
  /// In en, this message translates to:
  /// **'Bought on credit'**
  String get assetsFormAcquisitionsSupplier;

  /// No description provided for @assetsFormAcquisitionsPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid from cash or bank'**
  String get assetsFormAcquisitionsPaid;

  /// No description provided for @assetsFormAcquisitionsOpening.
  ///
  /// In en, this message translates to:
  /// **'Already in the books (brought forward)'**
  String get assetsFormAcquisitionsOpening;

  /// No description provided for @assetsFormSupplier.
  ///
  /// In en, this message translates to:
  /// **'Supplier'**
  String get assetsFormSupplier;

  /// No description provided for @assetsFormPaidFrom.
  ///
  /// In en, this message translates to:
  /// **'Paid from'**
  String get assetsFormPaidFrom;

  /// No description provided for @assetsFormGstRate.
  ///
  /// In en, this message translates to:
  /// **'GST rate % (input credit taken)'**
  String get assetsFormGstRate;

  /// No description provided for @assetsFormSupplierGstin.
  ///
  /// In en, this message translates to:
  /// **'Supplier GSTIN'**
  String get assetsFormSupplierGstin;

  /// No description provided for @assetsFormInvoiceRef.
  ///
  /// In en, this message translates to:
  /// **'Bill no.'**
  String get assetsFormInvoiceRef;

  /// No description provided for @assetsFormOpeningAccumulated.
  ///
  /// In en, this message translates to:
  /// **'Depreciation charged before'**
  String get assetsFormOpeningAccumulated;

  /// No description provided for @assetsFormNotes.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get assetsFormNotes;

  /// No description provided for @assetsFormSave.
  ///
  /// In en, this message translates to:
  /// **'Add asset'**
  String get assetsFormSave;

  /// No description provided for @assetsDetailHistory.
  ///
  /// In en, this message translates to:
  /// **'Depreciation charged'**
  String get assetsDetailHistory;

  /// No description provided for @assetsDetailPeriod.
  ///
  /// In en, this message translates to:
  /// **'Period'**
  String get assetsDetailPeriod;

  /// No description provided for @assetsDetailDays.
  ///
  /// In en, this message translates to:
  /// **'Days'**
  String get assetsDetailDays;

  /// No description provided for @assetsDetailVoucher.
  ///
  /// In en, this message translates to:
  /// **'Entry'**
  String get assetsDetailVoucher;

  /// No description provided for @assetsDetailDispose.
  ///
  /// In en, this message translates to:
  /// **'Sell or scrap'**
  String get assetsDetailDispose;

  /// No description provided for @assetsDetailDisposeDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get assetsDetailDisposeDate;

  /// No description provided for @assetsDetailSaleValue.
  ///
  /// In en, this message translates to:
  /// **'Sale value (₹, 0 if scrapped)'**
  String get assetsDetailSaleValue;

  /// No description provided for @assetsDetailReceivedIn.
  ///
  /// In en, this message translates to:
  /// **'Received in'**
  String get assetsDetailReceivedIn;

  /// No description provided for @assetsDetailSaleGst.
  ///
  /// In en, this message translates to:
  /// **'GST on sale %'**
  String get assetsDetailSaleGst;

  /// No description provided for @assetsDetailBuyerState.
  ///
  /// In en, this message translates to:
  /// **'Buyer\'s state (if outside yours)'**
  String get assetsDetailBuyerState;

  /// No description provided for @assetsDetailDisposeButton.
  ///
  /// In en, this message translates to:
  /// **'Record sale'**
  String get assetsDetailDisposeButton;

  /// No description provided for @assetsDetailDisposed.
  ///
  /// In en, this message translates to:
  /// **'Sold on {date} for {value}'**
  String assetsDetailDisposed(String date, String value);

  /// No description provided for @assetsDetailProfit.
  ///
  /// In en, this message translates to:
  /// **'Profit on sale'**
  String get assetsDetailProfit;

  /// No description provided for @assetsDetailLoss.
  ///
  /// In en, this message translates to:
  /// **'Loss on sale'**
  String get assetsDetailLoss;

  /// No description provided for @assetsDetailPurchase.
  ///
  /// In en, this message translates to:
  /// **'Purchase entry'**
  String get assetsDetailPurchase;

  /// No description provided for @assetsDepreciationTitle.
  ///
  /// In en, this message translates to:
  /// **'Depreciation'**
  String get assetsDepreciationTitle;

  /// No description provided for @assetsDepreciationSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Charge depreciation for a month, quarter or year. Each asset continues from where it was last charged.'**
  String get assetsDepreciationSubtitle;

  /// No description provided for @assetsDepreciationFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get assetsDepreciationFrom;

  /// No description provided for @assetsDepreciationTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get assetsDepreciationTo;

  /// No description provided for @assetsDepreciationPreview.
  ///
  /// In en, this message translates to:
  /// **'Work it out'**
  String get assetsDepreciationPreview;

  /// No description provided for @assetsDepreciationPost.
  ///
  /// In en, this message translates to:
  /// **'Post depreciation'**
  String get assetsDepreciationPost;

  /// No description provided for @assetsDepreciationTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get assetsDepreciationTotal;

  /// No description provided for @assetsDepreciationRuns.
  ///
  /// In en, this message translates to:
  /// **'Runs'**
  String get assetsDepreciationRuns;

  /// No description provided for @assetsDepreciationNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing to charge for this period.'**
  String get assetsDepreciationNone;

  /// No description provided for @assetsDepreciationCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel run'**
  String get assetsDepreciationCancel;

  /// No description provided for @assetsDepreciationAssets.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} asset} other {{count} assets}}'**
  String assetsDepreciationAssets(num count);

  /// No description provided for @assetsItTitle.
  ///
  /// In en, this message translates to:
  /// **'Income-tax depreciation'**
  String get assetsItTitle;

  /// No description provided for @assetsItSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Block-wise, as for the tax audit report (Form 3CD, clause 18). Additions used for under 180 days get half the rate.'**
  String get assetsItSubtitle;

  /// No description provided for @assetsItFy.
  ///
  /// In en, this message translates to:
  /// **'Year'**
  String get assetsItFy;

  /// No description provided for @assetsItBlock.
  ///
  /// In en, this message translates to:
  /// **'Block'**
  String get assetsItBlock;

  /// No description provided for @assetsItRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get assetsItRate;

  /// No description provided for @assetsItOpening.
  ///
  /// In en, this message translates to:
  /// **'Opening WDV'**
  String get assetsItOpening;

  /// No description provided for @assetsItAddFull.
  ///
  /// In en, this message translates to:
  /// **'Additions (180 days or more)'**
  String get assetsItAddFull;

  /// No description provided for @assetsItAddHalf.
  ///
  /// In en, this message translates to:
  /// **'Additions (under 180 days)'**
  String get assetsItAddHalf;

  /// No description provided for @assetsItSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get assetsItSales;

  /// No description provided for @assetsItDepreciation.
  ///
  /// In en, this message translates to:
  /// **'Depreciation'**
  String get assetsItDepreciation;

  /// No description provided for @assetsItClosing.
  ///
  /// In en, this message translates to:
  /// **'Closing WDV'**
  String get assetsItClosing;

  /// No description provided for @assetsItGain.
  ///
  /// In en, this message translates to:
  /// **'Short-term gain'**
  String get assetsItGain;

  /// No description provided for @assetsItLoss.
  ///
  /// In en, this message translates to:
  /// **'Short-term loss'**
  String get assetsItLoss;

  /// No description provided for @assetsItOpeningTitle.
  ///
  /// In en, this message translates to:
  /// **'Opening written down value'**
  String get assetsItOpeningTitle;

  /// No description provided for @assetsItOpeningHint.
  ///
  /// In en, this message translates to:
  /// **'Enter each block\'s WDV at the start of the first year from your last tax return; later years carry forward.'**
  String get assetsItOpeningHint;

  /// No description provided for @assetsItSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get assetsItSave;

  /// No description provided for @assetsItTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get assetsItTotal;

  /// No description provided for @assetsItNone.
  ///
  /// In en, this message translates to:
  /// **'No assets in this year.'**
  String get assetsItNone;

  /// No description provided for @assetsErrorsClassExists.
  ///
  /// In en, this message translates to:
  /// **'That class already exists.'**
  String get assetsErrorsClassExists;

  /// No description provided for @assetsErrorsClassIncomplete.
  ///
  /// In en, this message translates to:
  /// **'Fill in the name, life and tax block.'**
  String get assetsErrorsClassIncomplete;

  /// No description provided for @assetsErrorsUnknownPreset.
  ///
  /// In en, this message translates to:
  /// **'Choose a class.'**
  String get assetsErrorsUnknownPreset;

  /// No description provided for @assetsErrorsInvalidLife.
  ///
  /// In en, this message translates to:
  /// **'Enter the useful life in years.'**
  String get assetsErrorsInvalidLife;

  /// No description provided for @assetsErrorsInvalidResidual.
  ///
  /// In en, this message translates to:
  /// **'Written down value needs a residual value above 0%.'**
  String get assetsErrorsInvalidResidual;

  /// No description provided for @assetsErrorsUnknownClass.
  ///
  /// In en, this message translates to:
  /// **'Choose a class.'**
  String get assetsErrorsUnknownClass;

  /// No description provided for @assetsErrorsClassArchived.
  ///
  /// In en, this message translates to:
  /// **'That class is archived.'**
  String get assetsErrorsClassArchived;

  /// No description provided for @assetsErrorsInvalidCost.
  ///
  /// In en, this message translates to:
  /// **'Enter the cost.'**
  String get assetsErrorsInvalidCost;

  /// No description provided for @assetsErrorsUsedBeforeBought.
  ///
  /// In en, this message translates to:
  /// **'It can\'t be in use before it was bought.'**
  String get assetsErrorsUsedBeforeBought;

  /// No description provided for @assetsErrorsAccountRequired.
  ///
  /// In en, this message translates to:
  /// **'Choose the ledger.'**
  String get assetsErrorsAccountRequired;

  /// No description provided for @assetsErrorsNotASupplier.
  ///
  /// In en, this message translates to:
  /// **'Choose a supplier.'**
  String get assetsErrorsNotASupplier;

  /// No description provided for @assetsErrorsNotCashOrBank.
  ///
  /// In en, this message translates to:
  /// **'Choose a cash or bank ledger.'**
  String get assetsErrorsNotCashOrBank;

  /// No description provided for @assetsErrorsSupplierGstinRequired.
  ///
  /// In en, this message translates to:
  /// **'Enter the supplier\'s GSTIN to take input credit.'**
  String get assetsErrorsSupplierGstinRequired;

  /// No description provided for @assetsErrorsPeriodCrossesYear.
  ///
  /// In en, this message translates to:
  /// **'The period must be within one financial year.'**
  String get assetsErrorsPeriodCrossesYear;

  /// No description provided for @assetsErrorsNothingToDepreciate.
  ///
  /// In en, this message translates to:
  /// **'Nothing to charge for this period.'**
  String get assetsErrorsNothingToDepreciate;

  /// No description provided for @assetsErrorsLaterRunExists.
  ///
  /// In en, this message translates to:
  /// **'A later run charges these assets; cancel that first.'**
  String get assetsErrorsLaterRunExists;

  /// No description provided for @assetsErrorsAssetDisposed.
  ///
  /// In en, this message translates to:
  /// **'An asset in this run has been sold.'**
  String get assetsErrorsAssetDisposed;

  /// No description provided for @assetsErrorsAlreadyDisposed.
  ///
  /// In en, this message translates to:
  /// **'This asset is already sold.'**
  String get assetsErrorsAlreadyDisposed;

  /// No description provided for @assetsErrorsSoldBeforeUse.
  ///
  /// In en, this message translates to:
  /// **'The sale date is before it was put to use.'**
  String get assetsErrorsSoldBeforeUse;

  /// No description provided for @assetsErrorsDepreciatedPastSale.
  ///
  /// In en, this message translates to:
  /// **'Depreciation has been charged beyond the sale date; cancel that run first.'**
  String get assetsErrorsDepreciatedPastSale;

  /// No description provided for @assetsErrorsInvalidDepreciation.
  ///
  /// In en, this message translates to:
  /// **'Depreciation couldn\'t be worked out.'**
  String get assetsErrorsInvalidDepreciation;

  /// No description provided for @assetsErrorsInvalidFy.
  ///
  /// In en, this message translates to:
  /// **'Choose a year.'**
  String get assetsErrorsInvalidFy;

  /// No description provided for @expensesClaimsTitle.
  ///
  /// In en, this message translates to:
  /// **'Expense claims'**
  String get expensesClaimsTitle;

  /// No description provided for @expensesClaimsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Staff claim what they spent; approving books it (with GST credit where allowed) and paying settles it.'**
  String get expensesClaimsSubtitle;

  /// No description provided for @expensesClaimsNew.
  ///
  /// In en, this message translates to:
  /// **'New claim'**
  String get expensesClaimsNew;

  /// No description provided for @expensesClaimsNumber.
  ///
  /// In en, this message translates to:
  /// **'Claim'**
  String get expensesClaimsNumber;

  /// No description provided for @expensesClaimsEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get expensesClaimsEmployee;

  /// No description provided for @expensesClaimsDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get expensesClaimsDate;

  /// No description provided for @expensesClaimsClaimTitle.
  ///
  /// In en, this message translates to:
  /// **'Purpose'**
  String get expensesClaimsClaimTitle;

  /// No description provided for @expensesClaimsTotal.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get expensesClaimsTotal;

  /// No description provided for @expensesClaimsItc.
  ///
  /// In en, this message translates to:
  /// **'GST credit'**
  String get expensesClaimsItc;

  /// No description provided for @expensesClaimsStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get expensesClaimsStatus;

  /// No description provided for @expensesClaimsStatusesDraft.
  ///
  /// In en, this message translates to:
  /// **'Draft'**
  String get expensesClaimsStatusesDraft;

  /// No description provided for @expensesClaimsStatusesSubmitted.
  ///
  /// In en, this message translates to:
  /// **'Waiting for approval'**
  String get expensesClaimsStatusesSubmitted;

  /// No description provided for @expensesClaimsStatusesApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get expensesClaimsStatusesApproved;

  /// No description provided for @expensesClaimsStatusesRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get expensesClaimsStatusesRejected;

  /// No description provided for @expensesClaimsStatusesPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get expensesClaimsStatusesPaid;

  /// No description provided for @expensesClaimsStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get expensesClaimsStatusesCancelled;

  /// No description provided for @expensesClaimsWaiting.
  ///
  /// In en, this message translates to:
  /// **'Waiting for approval'**
  String get expensesClaimsWaiting;

  /// No description provided for @expensesClaimsToPay.
  ///
  /// In en, this message translates to:
  /// **'Approved, to pay'**
  String get expensesClaimsToPay;

  /// No description provided for @expensesClaimsNone.
  ///
  /// In en, this message translates to:
  /// **'No claims yet.'**
  String get expensesClaimsNone;

  /// No description provided for @expensesClaimsAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get expensesClaimsAll;

  /// No description provided for @expensesFormTitle.
  ///
  /// In en, this message translates to:
  /// **'Expense claim'**
  String get expensesFormTitle;

  /// No description provided for @expensesFormProject.
  ///
  /// In en, this message translates to:
  /// **'Project'**
  String get expensesFormProject;

  /// No description provided for @expensesFormLines.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get expensesFormLines;

  /// No description provided for @expensesFormCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get expensesFormCategory;

  /// No description provided for @expensesFormDescription.
  ///
  /// In en, this message translates to:
  /// **'Details'**
  String get expensesFormDescription;

  /// No description provided for @expensesFormAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount (₹)'**
  String get expensesFormAmount;

  /// No description provided for @expensesFormGstRate.
  ///
  /// In en, this message translates to:
  /// **'GST %'**
  String get expensesFormGstRate;

  /// No description provided for @expensesFormVendor.
  ///
  /// In en, this message translates to:
  /// **'Vendor'**
  String get expensesFormVendor;

  /// No description provided for @expensesFormVendorGstin.
  ///
  /// In en, this message translates to:
  /// **'Vendor GSTIN'**
  String get expensesFormVendorGstin;

  /// No description provided for @expensesFormInvoiceNo.
  ///
  /// In en, this message translates to:
  /// **'Bill no.'**
  String get expensesFormInvoiceNo;

  /// No description provided for @expensesFormReceipt.
  ///
  /// In en, this message translates to:
  /// **'Receipt'**
  String get expensesFormReceipt;

  /// No description provided for @expensesFormUpload.
  ///
  /// In en, this message translates to:
  /// **'Attach'**
  String get expensesFormUpload;

  /// No description provided for @expensesFormRead.
  ///
  /// In en, this message translates to:
  /// **'Read receipt'**
  String get expensesFormRead;

  /// No description provided for @expensesFormReading.
  ///
  /// In en, this message translates to:
  /// **'Reading…'**
  String get expensesFormReading;

  /// No description provided for @expensesFormReadDone.
  ///
  /// In en, this message translates to:
  /// **'Filled in from the receipt. Please check it.'**
  String get expensesFormReadDone;

  /// No description provided for @expensesFormReadNone.
  ///
  /// In en, this message translates to:
  /// **'Couldn\'t read this receipt; please type the details.'**
  String get expensesFormReadNone;

  /// No description provided for @expensesFormReadDemo.
  ///
  /// In en, this message translates to:
  /// **'Automatic reading isn\'t set up; please type the details.'**
  String get expensesFormReadDemo;

  /// No description provided for @expensesFormAddLine.
  ///
  /// In en, this message translates to:
  /// **'Add expense'**
  String get expensesFormAddLine;

  /// No description provided for @expensesFormSaveDraft.
  ///
  /// In en, this message translates to:
  /// **'Save draft'**
  String get expensesFormSaveDraft;

  /// No description provided for @expensesFormSubmit.
  ///
  /// In en, this message translates to:
  /// **'Submit for approval'**
  String get expensesFormSubmit;

  /// No description provided for @expensesFormItcHint.
  ///
  /// In en, this message translates to:
  /// **'GST credit is taken when the bill is a tax invoice with the vendor\'s GSTIN in the company\'s name, and the category allows it.'**
  String get expensesFormItcHint;

  /// No description provided for @expensesDetailApprove.
  ///
  /// In en, this message translates to:
  /// **'Approve'**
  String get expensesDetailApprove;

  /// No description provided for @expensesDetailReject.
  ///
  /// In en, this message translates to:
  /// **'Reject'**
  String get expensesDetailReject;

  /// No description provided for @expensesDetailReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get expensesDetailReason;

  /// No description provided for @expensesDetailPay.
  ///
  /// In en, this message translates to:
  /// **'Pay'**
  String get expensesDetailPay;

  /// No description provided for @expensesDetailPayFrom.
  ///
  /// In en, this message translates to:
  /// **'Pay from'**
  String get expensesDetailPayFrom;

  /// No description provided for @expensesDetailPaidOn.
  ///
  /// In en, this message translates to:
  /// **'Payment date'**
  String get expensesDetailPaidOn;

  /// No description provided for @expensesDetailEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get expensesDetailEdit;

  /// No description provided for @expensesDetailSubmit.
  ///
  /// In en, this message translates to:
  /// **'Submit'**
  String get expensesDetailSubmit;

  /// No description provided for @expensesDetailCancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel claim'**
  String get expensesDetailCancel;

  /// No description provided for @expensesDetailVoucher.
  ///
  /// In en, this message translates to:
  /// **'Expense entry'**
  String get expensesDetailVoucher;

  /// No description provided for @expensesDetailPaymentVoucher.
  ///
  /// In en, this message translates to:
  /// **'Payment'**
  String get expensesDetailPaymentVoucher;

  /// No description provided for @expensesDetailRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected: {reason}'**
  String expensesDetailRejected(String reason);

  /// No description provided for @expensesDetailReceipt.
  ///
  /// In en, this message translates to:
  /// **'View receipt'**
  String get expensesDetailReceipt;

  /// No description provided for @expensesCategoriesTitle.
  ///
  /// In en, this message translates to:
  /// **'Expense categories'**
  String get expensesCategoriesTitle;

  /// No description provided for @expensesCategoriesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Which ledger each kind of expense goes to, limits, and whether GST credit is blocked (section 17(5)).'**
  String get expensesCategoriesSubtitle;

  /// No description provided for @expensesCategoriesName.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get expensesCategoriesName;

  /// No description provided for @expensesCategoriesAccount.
  ///
  /// In en, this message translates to:
  /// **'Ledger'**
  String get expensesCategoriesAccount;

  /// No description provided for @expensesCategoriesBlocked.
  ///
  /// In en, this message translates to:
  /// **'No GST credit'**
  String get expensesCategoriesBlocked;

  /// No description provided for @expensesCategoriesLimit.
  ///
  /// In en, this message translates to:
  /// **'Limit per claim (₹)'**
  String get expensesCategoriesLimit;

  /// No description provided for @expensesCategoriesReceiptAbove.
  ///
  /// In en, this message translates to:
  /// **'Receipt needed above (₹)'**
  String get expensesCategoriesReceiptAbove;

  /// No description provided for @expensesCategoriesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add category'**
  String get expensesCategoriesAdd;

  /// No description provided for @expensesCategoriesSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get expensesCategoriesSave;

  /// No description provided for @expensesErrorsNoLines.
  ///
  /// In en, this message translates to:
  /// **'Add at least one expense.'**
  String get expensesErrorsNoLines;

  /// No description provided for @expensesErrorsUnknownCategory.
  ///
  /// In en, this message translates to:
  /// **'Choose a category.'**
  String get expensesErrorsUnknownCategory;

  /// No description provided for @expensesErrorsCategoryArchived.
  ///
  /// In en, this message translates to:
  /// **'That category is archived.'**
  String get expensesErrorsCategoryArchived;

  /// No description provided for @expensesErrorsInvalidAmount.
  ///
  /// In en, this message translates to:
  /// **'Enter an amount.'**
  String get expensesErrorsInvalidAmount;

  /// No description provided for @expensesErrorsReceiptRequired.
  ///
  /// In en, this message translates to:
  /// **'Attach the receipt for this expense.'**
  String get expensesErrorsReceiptRequired;

  /// No description provided for @expensesErrorsOverLimit.
  ///
  /// In en, this message translates to:
  /// **'This is more than the category\'s limit per claim.'**
  String get expensesErrorsOverLimit;

  /// No description provided for @expensesErrorsInvalidGstin.
  ///
  /// In en, this message translates to:
  /// **'The vendor GSTIN isn\'t valid.'**
  String get expensesErrorsInvalidGstin;

  /// No description provided for @expensesErrorsUnknownEmployee.
  ///
  /// In en, this message translates to:
  /// **'Choose an employee.'**
  String get expensesErrorsUnknownEmployee;

  /// No description provided for @expensesErrorsUnknownProject.
  ///
  /// In en, this message translates to:
  /// **'Choose a project.'**
  String get expensesErrorsUnknownProject;

  /// No description provided for @expensesErrorsClaimLocked.
  ///
  /// In en, this message translates to:
  /// **'Only a draft or rejected claim can be changed.'**
  String get expensesErrorsClaimLocked;

  /// No description provided for @expensesErrorsClaimNotSubmitted.
  ///
  /// In en, this message translates to:
  /// **'The claim isn\'t waiting for approval.'**
  String get expensesErrorsClaimNotSubmitted;

  /// No description provided for @expensesErrorsClaimNotApproved.
  ///
  /// In en, this message translates to:
  /// **'Approve the claim first.'**
  String get expensesErrorsClaimNotApproved;

  /// No description provided for @expensesErrorsClaimPaid.
  ///
  /// In en, this message translates to:
  /// **'A paid claim can\'t be cancelled; cancel the payment first.'**
  String get expensesErrorsClaimPaid;

  /// No description provided for @expensesErrorsPaidBeforeClaim.
  ///
  /// In en, this message translates to:
  /// **'The payment date is before the claim.'**
  String get expensesErrorsPaidBeforeClaim;

  /// No description provided for @expensesErrorsCategoryExists.
  ///
  /// In en, this message translates to:
  /// **'That category already exists.'**
  String get expensesErrorsCategoryExists;

  /// No description provided for @expensesErrorsNotAnExpenseAccount.
  ///
  /// In en, this message translates to:
  /// **'Choose an expense ledger.'**
  String get expensesErrorsNotAnExpenseAccount;

  /// No description provided for @expensesErrorsFileType.
  ///
  /// In en, this message translates to:
  /// **'Attach a photo (JPG, PNG, WebP) or a PDF.'**
  String get expensesErrorsFileType;

  /// No description provided for @expensesErrorsFileTooLarge.
  ///
  /// In en, this message translates to:
  /// **'The file is over 5 MB.'**
  String get expensesErrorsFileTooLarge;

  /// No description provided for @expensesErrorsFileEmpty.
  ///
  /// In en, this message translates to:
  /// **'The file is empty.'**
  String get expensesErrorsFileEmpty;

  /// No description provided for @projectsListTitle.
  ///
  /// In en, this message translates to:
  /// **'Projects'**
  String get projectsListTitle;

  /// No description provided for @projectsListSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Tasks, time, costs and billing for each job.'**
  String get projectsListSubtitle;

  /// No description provided for @projectsListNew.
  ///
  /// In en, this message translates to:
  /// **'New project'**
  String get projectsListNew;

  /// No description provided for @projectsListCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get projectsListCode;

  /// No description provided for @projectsListName.
  ///
  /// In en, this message translates to:
  /// **'Project'**
  String get projectsListName;

  /// No description provided for @projectsListCustomer.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get projectsListCustomer;

  /// No description provided for @projectsListBilling.
  ///
  /// In en, this message translates to:
  /// **'Billing'**
  String get projectsListBilling;

  /// No description provided for @projectsListBillingsFixed.
  ///
  /// In en, this message translates to:
  /// **'Fixed price'**
  String get projectsListBillingsFixed;

  /// No description provided for @projectsListBillingsTimeMaterial.
  ///
  /// In en, this message translates to:
  /// **'Time & material'**
  String get projectsListBillingsTimeMaterial;

  /// No description provided for @projectsListBillingsNonBillable.
  ///
  /// In en, this message translates to:
  /// **'Internal'**
  String get projectsListBillingsNonBillable;

  /// No description provided for @projectsListStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get projectsListStatus;

  /// No description provided for @projectsListStatusesActive.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get projectsListStatusesActive;

  /// No description provided for @projectsListStatusesOnHold.
  ///
  /// In en, this message translates to:
  /// **'On hold'**
  String get projectsListStatusesOnHold;

  /// No description provided for @projectsListStatusesCompleted.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get projectsListStatusesCompleted;

  /// No description provided for @projectsListStatusesCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get projectsListStatusesCancelled;

  /// No description provided for @projectsListRevenue.
  ///
  /// In en, this message translates to:
  /// **'Billed'**
  String get projectsListRevenue;

  /// No description provided for @projectsListCost.
  ///
  /// In en, this message translates to:
  /// **'Cost'**
  String get projectsListCost;

  /// No description provided for @projectsListMargin.
  ///
  /// In en, this message translates to:
  /// **'Margin'**
  String get projectsListMargin;

  /// No description provided for @projectsListHours.
  ///
  /// In en, this message translates to:
  /// **'Hours'**
  String get projectsListHours;

  /// No description provided for @projectsListNone.
  ///
  /// In en, this message translates to:
  /// **'No projects yet.'**
  String get projectsListNone;

  /// No description provided for @projectsFormContractValue.
  ///
  /// In en, this message translates to:
  /// **'Contract value (₹)'**
  String get projectsFormContractValue;

  /// No description provided for @projectsFormBudgetCost.
  ///
  /// In en, this message translates to:
  /// **'Budget cost (₹)'**
  String get projectsFormBudgetCost;

  /// No description provided for @projectsFormBudgetHours.
  ///
  /// In en, this message translates to:
  /// **'Budget hours'**
  String get projectsFormBudgetHours;

  /// No description provided for @projectsFormBillRate.
  ///
  /// In en, this message translates to:
  /// **'Bill rate per hour (₹)'**
  String get projectsFormBillRate;

  /// No description provided for @projectsFormBillingItem.
  ///
  /// In en, this message translates to:
  /// **'Invoice as (service item)'**
  String get projectsFormBillingItem;

  /// No description provided for @projectsFormStartOn.
  ///
  /// In en, this message translates to:
  /// **'Start'**
  String get projectsFormStartOn;

  /// No description provided for @projectsFormEndOn.
  ///
  /// In en, this message translates to:
  /// **'End'**
  String get projectsFormEndOn;

  /// No description provided for @projectsFormNotes.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get projectsFormNotes;

  /// No description provided for @projectsFormSave.
  ///
  /// In en, this message translates to:
  /// **'Save project'**
  String get projectsFormSave;

  /// No description provided for @projectsDetailLabour.
  ///
  /// In en, this message translates to:
  /// **'Labour'**
  String get projectsDetailLabour;

  /// No description provided for @projectsDetailExpenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get projectsDetailExpenses;

  /// No description provided for @projectsDetailPurchases.
  ///
  /// In en, this message translates to:
  /// **'Purchases'**
  String get projectsDetailPurchases;

  /// No description provided for @projectsDetailUnbilled.
  ///
  /// In en, this message translates to:
  /// **'Unbilled time'**
  String get projectsDetailUnbilled;

  /// No description provided for @projectsDetailBudgetUsed.
  ///
  /// In en, this message translates to:
  /// **'{pct}% of budget'**
  String projectsDetailBudgetUsed(String pct);

  /// No description provided for @projectsDetailHoursUsed.
  ///
  /// In en, this message translates to:
  /// **'{pct}% of hours'**
  String projectsDetailHoursUsed(String pct);

  /// No description provided for @projectsDetailMarginPct.
  ///
  /// In en, this message translates to:
  /// **'{pct}% margin'**
  String projectsDetailMarginPct(String pct);

  /// No description provided for @projectsDetailTasks.
  ///
  /// In en, this message translates to:
  /// **'Tasks'**
  String get projectsDetailTasks;

  /// No description provided for @projectsDetailTask.
  ///
  /// In en, this message translates to:
  /// **'Task'**
  String get projectsDetailTask;

  /// No description provided for @projectsDetailAssignee.
  ///
  /// In en, this message translates to:
  /// **'Assigned to'**
  String get projectsDetailAssignee;

  /// No description provided for @projectsDetailEstimate.
  ///
  /// In en, this message translates to:
  /// **'Estimate (h)'**
  String get projectsDetailEstimate;

  /// No description provided for @projectsDetailLogged.
  ///
  /// In en, this message translates to:
  /// **'Logged (h)'**
  String get projectsDetailLogged;

  /// No description provided for @projectsDetailDue.
  ///
  /// In en, this message translates to:
  /// **'Due'**
  String get projectsDetailDue;

  /// No description provided for @projectsDetailTaskStatusesTodo.
  ///
  /// In en, this message translates to:
  /// **'To do'**
  String get projectsDetailTaskStatusesTodo;

  /// No description provided for @projectsDetailTaskStatusesDoing.
  ///
  /// In en, this message translates to:
  /// **'In progress'**
  String get projectsDetailTaskStatusesDoing;

  /// No description provided for @projectsDetailTaskStatusesDone.
  ///
  /// In en, this message translates to:
  /// **'Done'**
  String get projectsDetailTaskStatusesDone;

  /// No description provided for @projectsDetailAddTask.
  ///
  /// In en, this message translates to:
  /// **'Add task'**
  String get projectsDetailAddTask;

  /// No description provided for @projectsDetailMembers.
  ///
  /// In en, this message translates to:
  /// **'Team and rates'**
  String get projectsDetailMembers;

  /// No description provided for @projectsDetailMember.
  ///
  /// In en, this message translates to:
  /// **'Person'**
  String get projectsDetailMember;

  /// No description provided for @projectsDetailMemberRate.
  ///
  /// In en, this message translates to:
  /// **'Bill rate (₹/h)'**
  String get projectsDetailMemberRate;

  /// No description provided for @projectsDetailAddMember.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get projectsDetailAddMember;

  /// No description provided for @projectsDetailMilestones.
  ///
  /// In en, this message translates to:
  /// **'Milestones'**
  String get projectsDetailMilestones;

  /// No description provided for @projectsDetailMilestone.
  ///
  /// In en, this message translates to:
  /// **'Milestone'**
  String get projectsDetailMilestone;

  /// No description provided for @projectsDetailAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount (₹)'**
  String get projectsDetailAmount;

  /// No description provided for @projectsDetailAddMilestone.
  ///
  /// In en, this message translates to:
  /// **'Add milestone'**
  String get projectsDetailAddMilestone;

  /// No description provided for @projectsDetailBill.
  ///
  /// In en, this message translates to:
  /// **'Invoice'**
  String get projectsDetailBill;

  /// No description provided for @projectsDetailBilled.
  ///
  /// In en, this message translates to:
  /// **'Invoiced {number}'**
  String projectsDetailBilled(String number);

  /// No description provided for @projectsDetailTime.
  ///
  /// In en, this message translates to:
  /// **'Time'**
  String get projectsDetailTime;

  /// No description provided for @projectsDetailBillTime.
  ///
  /// In en, this message translates to:
  /// **'Invoice approved hours'**
  String get projectsDetailBillTime;

  /// No description provided for @projectsDetailBillUpTo.
  ///
  /// In en, this message translates to:
  /// **'Up to'**
  String get projectsDetailBillUpTo;

  /// No description provided for @projectsDetailInvoices.
  ///
  /// In en, this message translates to:
  /// **'Invoices'**
  String get projectsDetailInvoices;

  /// No description provided for @projectsDetailEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit project'**
  String get projectsDetailEdit;

  /// No description provided for @projectsDetailRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove'**
  String get projectsDetailRemove;

  /// No description provided for @projectsDetailInvoiced.
  ///
  /// In en, this message translates to:
  /// **'Invoice {number} raised.'**
  String projectsDetailInvoiced(String number);

  /// No description provided for @projectsTimeTitle.
  ///
  /// In en, this message translates to:
  /// **'Timesheets'**
  String get projectsTimeTitle;

  /// No description provided for @projectsTimeSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Log hours against projects; approved billable hours can be invoiced.'**
  String get projectsTimeSubtitle;

  /// No description provided for @projectsTimeLog.
  ///
  /// In en, this message translates to:
  /// **'Log time'**
  String get projectsTimeLog;

  /// No description provided for @projectsTimeEmployee.
  ///
  /// In en, this message translates to:
  /// **'Employee'**
  String get projectsTimeEmployee;

  /// No description provided for @projectsTimeProject.
  ///
  /// In en, this message translates to:
  /// **'Project'**
  String get projectsTimeProject;

  /// No description provided for @projectsTimeTask.
  ///
  /// In en, this message translates to:
  /// **'Task'**
  String get projectsTimeTask;

  /// No description provided for @projectsTimeDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get projectsTimeDate;

  /// No description provided for @projectsTimeHours.
  ///
  /// In en, this message translates to:
  /// **'Hours'**
  String get projectsTimeHours;

  /// No description provided for @projectsTimeBillable.
  ///
  /// In en, this message translates to:
  /// **'Billable'**
  String get projectsTimeBillable;

  /// No description provided for @projectsTimeNote.
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get projectsTimeNote;

  /// No description provided for @projectsTimeSave.
  ///
  /// In en, this message translates to:
  /// **'Log'**
  String get projectsTimeSave;

  /// No description provided for @projectsTimeApprove.
  ///
  /// In en, this message translates to:
  /// **'Approve'**
  String get projectsTimeApprove;

  /// No description provided for @projectsTimeReject.
  ///
  /// In en, this message translates to:
  /// **'Reject'**
  String get projectsTimeReject;

  /// No description provided for @projectsTimeSelected.
  ///
  /// In en, this message translates to:
  /// **'{count} selected'**
  String projectsTimeSelected(String count);

  /// No description provided for @projectsTimeStatusesSubmitted.
  ///
  /// In en, this message translates to:
  /// **'Submitted'**
  String get projectsTimeStatusesSubmitted;

  /// No description provided for @projectsTimeStatusesApproved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get projectsTimeStatusesApproved;

  /// No description provided for @projectsTimeStatusesRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get projectsTimeStatusesRejected;

  /// No description provided for @projectsTimeStatusesBilled.
  ///
  /// In en, this message translates to:
  /// **'Invoiced'**
  String get projectsTimeStatusesBilled;

  /// No description provided for @projectsTimeTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get projectsTimeTotal;

  /// No description provided for @projectsTimeNone.
  ///
  /// In en, this message translates to:
  /// **'No time logged.'**
  String get projectsTimeNone;

  /// No description provided for @projectsTimeCostRate.
  ///
  /// In en, this message translates to:
  /// **'Cost/h'**
  String get projectsTimeCostRate;

  /// No description provided for @projectsTimeBillRate.
  ///
  /// In en, this message translates to:
  /// **'Bill/h'**
  String get projectsTimeBillRate;

  /// No description provided for @projectsTimeDelete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get projectsTimeDelete;

  /// No description provided for @projectsErrorsNotACustomer.
  ///
  /// In en, this message translates to:
  /// **'Choose a customer.'**
  String get projectsErrorsNotACustomer;

  /// No description provided for @projectsErrorsUnknownItem.
  ///
  /// In en, this message translates to:
  /// **'Choose a service item.'**
  String get projectsErrorsUnknownItem;

  /// No description provided for @projectsErrorsEndsBeforeStart.
  ///
  /// In en, this message translates to:
  /// **'The end date is before the start.'**
  String get projectsErrorsEndsBeforeStart;

  /// No description provided for @projectsErrorsProjectCustomerRequired.
  ///
  /// In en, this message translates to:
  /// **'Set the project\'s customer first.'**
  String get projectsErrorsProjectCustomerRequired;

  /// No description provided for @projectsErrorsBillingItemRequired.
  ///
  /// In en, this message translates to:
  /// **'Choose the item to invoice as in the project.'**
  String get projectsErrorsBillingItemRequired;

  /// No description provided for @projectsErrorsMilestoneBilled.
  ///
  /// In en, this message translates to:
  /// **'That milestone is already invoiced.'**
  String get projectsErrorsMilestoneBilled;

  /// No description provided for @projectsErrorsProjectNotActive.
  ///
  /// In en, this message translates to:
  /// **'The project isn\'t active.'**
  String get projectsErrorsProjectNotActive;

  /// No description provided for @projectsErrorsInvalidHours.
  ///
  /// In en, this message translates to:
  /// **'Enter hours between 0 and 24.'**
  String get projectsErrorsInvalidHours;

  /// No description provided for @projectsErrorsTooManyHours.
  ///
  /// In en, this message translates to:
  /// **'More than 24 hours on one day.'**
  String get projectsErrorsTooManyHours;

  /// No description provided for @projectsErrorsUnknownTask.
  ///
  /// In en, this message translates to:
  /// **'Choose a task on this project.'**
  String get projectsErrorsUnknownTask;

  /// No description provided for @projectsErrorsTimesheetLocked.
  ///
  /// In en, this message translates to:
  /// **'Approved or invoiced time can\'t be changed.'**
  String get projectsErrorsTimesheetLocked;

  /// No description provided for @projectsErrorsNothingToBill.
  ///
  /// In en, this message translates to:
  /// **'No approved billable hours to invoice.'**
  String get projectsErrorsNothingToBill;

  /// No description provided for @projectsErrorsNotTimeAndMaterial.
  ///
  /// In en, this message translates to:
  /// **'Only time-and-material projects bill by the hour.'**
  String get projectsErrorsNotTimeAndMaterial;

  /// No description provided for @projectsErrorsNotEmployedOnDate.
  ///
  /// In en, this message translates to:
  /// **'The employee wasn\'t employed on that date.'**
  String get projectsErrorsNotEmployedOnDate;

  /// No description provided for @projectsErrorsUnknownEmployee.
  ///
  /// In en, this message translates to:
  /// **'Choose an employee.'**
  String get projectsErrorsUnknownEmployee;

  /// No description provided for @alertsOverdue60.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} customer is} other {{count} customers are}} more than 60 days late paying: {amount}'**
  String alertsOverdue60(num count, String amount);

  /// No description provided for @alertsGstOverdue.
  ///
  /// In en, this message translates to:
  /// **'{form} for {period} is {days} days late'**
  String alertsGstOverdue(String form, String period, String days);

  /// No description provided for @alertsGstDue.
  ///
  /// In en, this message translates to:
  /// **'{form} for {period} is due in {days} days'**
  String alertsGstDue(String form, String period, String days);

  /// No description provided for @alertsLowStock.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} item is} other {{count} items are}} below reorder level'**
  String alertsLowStock(num count);

  /// No description provided for @alertsUnmatchedBank.
  ///
  /// In en, this message translates to:
  /// **'{count} bank statement lines have waited over a week to be matched'**
  String alertsUnmatchedBank(String count);

  /// No description provided for @alertsClaimsWaiting.
  ///
  /// In en, this message translates to:
  /// **'{count} expense claims have waited over 3 days for approval'**
  String alertsClaimsWaiting(String count);

  /// No description provided for @alertsFollowUpsLate.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} follow-up is} other {{count} follow-ups are}} late'**
  String alertsFollowUpsLate(num count);

  /// No description provided for @alertsNegativeCash.
  ///
  /// In en, this message translates to:
  /// **'{name} shows a negative balance ({amount}): an entry is missing or wrong'**
  String alertsNegativeCash(String name, String amount);

  /// No description provided for @alertsApprovalInvoiceDue.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} approval memo is} other {{count} approval memos are}} near the six-month invoicing limit'**
  String alertsApprovalInvoiceDue(num count);

  /// No description provided for @alertsApprovalsOut.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} approval memo has} other {{count} approval memos have}} had goods out for over 30 days'**
  String alertsApprovalsOut(num count);

  /// No description provided for @alertsSensitiveChanges.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} sensitive change} other {{count} sensitive changes}} in the last 7 days (bank details, credit terms, tax settings or permissions)'**
  String alertsSensitiveChanges(num count);

  /// No description provided for @alertsKycExpiring.
  ///
  /// In en, this message translates to:
  /// **'{count, plural, one {{count} employee document has} other {{count} employee documents have}} lapsed or lapse within 30 days'**
  String alertsKycExpiring(num count);

  /// No description provided for @checksTitle.
  ///
  /// In en, this message translates to:
  /// **'Checks'**
  String get checksTitle;

  /// No description provided for @checksSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Entries worth a second look before your CA sees them: cash limits under the Income-tax Act, possible duplicate bills, sales below cost, stock below zero.'**
  String get checksSubtitle;

  /// No description provided for @checksNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing unusual found.'**
  String get checksNone;

  /// No description provided for @checksKindsCash40A3.
  ///
  /// In en, this message translates to:
  /// **'Cash paid to {party}: {amount} in one day. Cash expenses over ₹10,000 to one person in a day aren\'t allowed (section 40A(3)); pay by bank.'**
  String checksKindsCash40A3(String party, String amount);

  /// No description provided for @checksKindsCash269ST.
  ///
  /// In en, this message translates to:
  /// **'Cash received from {party}: {amount} in one day. Receiving ₹2 lakh or more in cash isn\'t allowed (section 269ST); the penalty equals the amount.'**
  String checksKindsCash269ST(String party, String amount);

  /// No description provided for @checksKindsDuplicateBill.
  ///
  /// In en, this message translates to:
  /// **'{supplier} billed {amount} twice within a week ({first} and {second}). Is one a duplicate?'**
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  );

  /// No description provided for @checksKindsBelowCost.
  ///
  /// In en, this message translates to:
  /// **'{number}: {item} sold at {rate}, below its purchase rate of {cost}.'**
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  );

  /// No description provided for @checksKindsNegativeStock.
  ///
  /// In en, this message translates to:
  /// **'{item} is at {qty} {uom}: more was sold or issued than was in stock.'**
  String checksKindsNegativeStock(String item, String qty, String uom);

  /// No description provided for @assistantTitle.
  ///
  /// In en, this message translates to:
  /// **'Assistant'**
  String get assistantTitle;

  /// No description provided for @assistantSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Ask about sales, dues, profit, stock or GST. It reads your books; it never changes them.'**
  String get assistantSubtitle;

  /// No description provided for @assistantPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Ask a question…'**
  String get assistantPlaceholder;

  /// No description provided for @assistantSend.
  ///
  /// In en, this message translates to:
  /// **'Ask'**
  String get assistantSend;

  /// No description provided for @assistantThinking.
  ///
  /// In en, this message translates to:
  /// **'Looking it up…'**
  String get assistantThinking;

  /// No description provided for @assistantClear.
  ///
  /// In en, this message translates to:
  /// **'New conversation'**
  String get assistantClear;

  /// No description provided for @assistantDemo.
  ///
  /// In en, this message translates to:
  /// **'Built-in assistant: it answers common questions. Connect the AI service to ask anything.'**
  String get assistantDemo;

  /// No description provided for @assistantClaude.
  ///
  /// In en, this message translates to:
  /// **'Answered by Claude from your books, with your access rights.'**
  String get assistantClaude;

  /// No description provided for @assistantSuggestionsS1.
  ///
  /// In en, this message translates to:
  /// **'Who owes us the most?'**
  String get assistantSuggestionsS1;

  /// No description provided for @assistantSuggestionsS2.
  ///
  /// In en, this message translates to:
  /// **'How are sales this month?'**
  String get assistantSuggestionsS2;

  /// No description provided for @assistantSuggestionsS3.
  ///
  /// In en, this message translates to:
  /// **'What is our profit this month?'**
  String get assistantSuggestionsS3;

  /// No description provided for @assistantSuggestionsS4.
  ///
  /// In en, this message translates to:
  /// **'Which items are below reorder level?'**
  String get assistantSuggestionsS4;

  /// No description provided for @assistantSuggestionsS5.
  ///
  /// In en, this message translates to:
  /// **'Any entries I should check?'**
  String get assistantSuggestionsS5;

  /// No description provided for @assistantTools.
  ///
  /// In en, this message translates to:
  /// **'Looked at: {tools}'**
  String assistantTools(String tools);

  /// No description provided for @assistantErrorsAssistantBusy.
  ///
  /// In en, this message translates to:
  /// **'The assistant is busy; try again in a minute.'**
  String get assistantErrorsAssistantBusy;

  /// No description provided for @assistantErrorsAssistantFailed.
  ///
  /// In en, this message translates to:
  /// **'The assistant couldn\'t answer just now.'**
  String get assistantErrorsAssistantFailed;

  /// No description provided for @assistantErrorsEmptyQuestion.
  ///
  /// In en, this message translates to:
  /// **'Type a question.'**
  String get assistantErrorsEmptyQuestion;

  /// No description provided for @crmLeadsTitle.
  ///
  /// In en, this message translates to:
  /// **'Leads'**
  String get crmLeadsTitle;

  /// No description provided for @crmLeadsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Prospects from first enquiry to order.'**
  String get crmLeadsSubtitle;

  /// No description provided for @crmLeadsNew.
  ///
  /// In en, this message translates to:
  /// **'New lead'**
  String get crmLeadsNew;

  /// No description provided for @crmLeadsName.
  ///
  /// In en, this message translates to:
  /// **'Contact person'**
  String get crmLeadsName;

  /// No description provided for @crmLeadsOrganisation.
  ///
  /// In en, this message translates to:
  /// **'Business'**
  String get crmLeadsOrganisation;

  /// No description provided for @crmLeadsPhone.
  ///
  /// In en, this message translates to:
  /// **'Mobile'**
  String get crmLeadsPhone;

  /// No description provided for @crmLeadsEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get crmLeadsEmail;

  /// No description provided for @crmLeadsGstin.
  ///
  /// In en, this message translates to:
  /// **'GSTIN'**
  String get crmLeadsGstin;

  /// No description provided for @crmLeadsState.
  ///
  /// In en, this message translates to:
  /// **'State'**
  String get crmLeadsState;

  /// No description provided for @crmLeadsCity.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get crmLeadsCity;

  /// No description provided for @crmLeadsSource.
  ///
  /// In en, this message translates to:
  /// **'Source'**
  String get crmLeadsSource;

  /// No description provided for @crmLeadsSourcesWalkIn.
  ///
  /// In en, this message translates to:
  /// **'Walk-in'**
  String get crmLeadsSourcesWalkIn;

  /// No description provided for @crmLeadsSourcesReferral.
  ///
  /// In en, this message translates to:
  /// **'Referral'**
  String get crmLeadsSourcesReferral;

  /// No description provided for @crmLeadsSourcesWebsite.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get crmLeadsSourcesWebsite;

  /// No description provided for @crmLeadsSourcesIndiamart.
  ///
  /// In en, this message translates to:
  /// **'IndiaMART'**
  String get crmLeadsSourcesIndiamart;

  /// No description provided for @crmLeadsSourcesJustdial.
  ///
  /// In en, this message translates to:
  /// **'Justdial'**
  String get crmLeadsSourcesJustdial;

  /// No description provided for @crmLeadsSourcesWhatsapp.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp'**
  String get crmLeadsSourcesWhatsapp;

  /// No description provided for @crmLeadsSourcesTradeFair.
  ///
  /// In en, this message translates to:
  /// **'Trade fair'**
  String get crmLeadsSourcesTradeFair;

  /// No description provided for @crmLeadsSourcesOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get crmLeadsSourcesOther;

  /// No description provided for @crmLeadsStage.
  ///
  /// In en, this message translates to:
  /// **'Stage'**
  String get crmLeadsStage;

  /// No description provided for @crmLeadsStagesNew.
  ///
  /// In en, this message translates to:
  /// **'New'**
  String get crmLeadsStagesNew;

  /// No description provided for @crmLeadsStagesContacted.
  ///
  /// In en, this message translates to:
  /// **'Contacted'**
  String get crmLeadsStagesContacted;

  /// No description provided for @crmLeadsStagesQualified.
  ///
  /// In en, this message translates to:
  /// **'Qualified'**
  String get crmLeadsStagesQualified;

  /// No description provided for @crmLeadsStagesProposal.
  ///
  /// In en, this message translates to:
  /// **'Proposal sent'**
  String get crmLeadsStagesProposal;

  /// No description provided for @crmLeadsStagesWon.
  ///
  /// In en, this message translates to:
  /// **'Won'**
  String get crmLeadsStagesWon;

  /// No description provided for @crmLeadsStagesLost.
  ///
  /// In en, this message translates to:
  /// **'Lost'**
  String get crmLeadsStagesLost;

  /// No description provided for @crmLeadsValue.
  ///
  /// In en, this message translates to:
  /// **'Expected value (₹)'**
  String get crmLeadsValue;

  /// No description provided for @crmLeadsExpectedClose.
  ///
  /// In en, this message translates to:
  /// **'Expected to close'**
  String get crmLeadsExpectedClose;

  /// No description provided for @crmLeadsOwner.
  ///
  /// In en, this message translates to:
  /// **'Owner'**
  String get crmLeadsOwner;

  /// No description provided for @crmLeadsNotes.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get crmLeadsNotes;

  /// No description provided for @crmLeadsNextFollowUp.
  ///
  /// In en, this message translates to:
  /// **'Next follow-up'**
  String get crmLeadsNextFollowUp;

  /// No description provided for @crmLeadsSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get crmLeadsSave;

  /// No description provided for @crmLeadsNone.
  ///
  /// In en, this message translates to:
  /// **'No leads yet.'**
  String get crmLeadsNone;

  /// No description provided for @crmLeadsSearch.
  ///
  /// In en, this message translates to:
  /// **'Search name, business, mobile or city'**
  String get crmLeadsSearch;

  /// No description provided for @crmLeadsWeighted.
  ///
  /// In en, this message translates to:
  /// **'Weighted {amount}'**
  String crmLeadsWeighted(String amount);

  /// No description provided for @crmLeadsConvert.
  ///
  /// In en, this message translates to:
  /// **'Won: make a customer'**
  String get crmLeadsConvert;

  /// No description provided for @crmLeadsLost.
  ///
  /// In en, this message translates to:
  /// **'Mark lost'**
  String get crmLeadsLost;

  /// No description provided for @crmLeadsLostReason.
  ///
  /// In en, this message translates to:
  /// **'Why was it lost?'**
  String get crmLeadsLostReason;

  /// No description provided for @crmLeadsEdit.
  ///
  /// In en, this message translates to:
  /// **'Edit lead'**
  String get crmLeadsEdit;

  /// No description provided for @crmActivitiesTitle.
  ///
  /// In en, this message translates to:
  /// **'Follow-ups'**
  String get crmActivitiesTitle;

  /// No description provided for @crmActivitiesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Calls, meetings and tasks, the earliest due first.'**
  String get crmActivitiesSubtitle;

  /// No description provided for @crmActivitiesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get crmActivitiesAdd;

  /// No description provided for @crmActivitiesKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get crmActivitiesKind;

  /// No description provided for @crmActivitiesKindsCall.
  ///
  /// In en, this message translates to:
  /// **'Call'**
  String get crmActivitiesKindsCall;

  /// No description provided for @crmActivitiesKindsMeeting.
  ///
  /// In en, this message translates to:
  /// **'Meeting'**
  String get crmActivitiesKindsMeeting;

  /// No description provided for @crmActivitiesKindsTask.
  ///
  /// In en, this message translates to:
  /// **'Task'**
  String get crmActivitiesKindsTask;

  /// No description provided for @crmActivitiesKindsNote.
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get crmActivitiesKindsNote;

  /// No description provided for @crmActivitiesKindsWhatsapp.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp'**
  String get crmActivitiesKindsWhatsapp;

  /// No description provided for @crmActivitiesKindsEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get crmActivitiesKindsEmail;

  /// No description provided for @crmActivitiesSubject.
  ///
  /// In en, this message translates to:
  /// **'What to do or what happened'**
  String get crmActivitiesSubject;

  /// No description provided for @crmActivitiesDue.
  ///
  /// In en, this message translates to:
  /// **'When'**
  String get crmActivitiesDue;

  /// No description provided for @crmActivitiesDone.
  ///
  /// In en, this message translates to:
  /// **'Mark done'**
  String get crmActivitiesDone;

  /// No description provided for @crmActivitiesReopen.
  ///
  /// In en, this message translates to:
  /// **'Mark not done'**
  String get crmActivitiesReopen;

  /// No description provided for @crmActivitiesNotes.
  ///
  /// In en, this message translates to:
  /// **'Notes'**
  String get crmActivitiesNotes;

  /// No description provided for @crmActivitiesNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing here.'**
  String get crmActivitiesNone;

  /// No description provided for @crmActivitiesOpen.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get crmActivitiesOpen;

  /// No description provided for @crmActivitiesAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get crmActivitiesAll;

  /// No description provided for @crmActivitiesLate.
  ///
  /// In en, this message translates to:
  /// **'Late'**
  String get crmActivitiesLate;

  /// No description provided for @crmMessagesSend.
  ///
  /// In en, this message translates to:
  /// **'Send WhatsApp'**
  String get crmMessagesSend;

  /// No description provided for @crmMessagesTemplate.
  ///
  /// In en, this message translates to:
  /// **'Template'**
  String get crmMessagesTemplate;

  /// No description provided for @crmMessagesSent.
  ///
  /// In en, this message translates to:
  /// **'Sent to {to}.'**
  String crmMessagesSent(String to);

  /// No description provided for @crmMessagesFailed.
  ///
  /// In en, this message translates to:
  /// **'Not sent: {error}'**
  String crmMessagesFailed(String error);

  /// No description provided for @crmMessagesDemo.
  ///
  /// In en, this message translates to:
  /// **'Demo mode: messages are recorded but not delivered until WhatsApp Business is connected.'**
  String get crmMessagesDemo;

  /// No description provided for @crmMessagesRemind.
  ///
  /// In en, this message translates to:
  /// **'Send payment reminder'**
  String get crmMessagesRemind;

  /// No description provided for @crmTemplatesTitle.
  ///
  /// In en, this message translates to:
  /// **'Message templates'**
  String get crmTemplatesTitle;

  /// No description provided for @crmTemplatesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp messages with numbered blanks for names, amounts and dates. To message a customer first, the template must be approved by Meta; enter its approved name.'**
  String get crmTemplatesSubtitle;

  /// No description provided for @crmTemplatesName.
  ///
  /// In en, this message translates to:
  /// **'Name (a–z, 0–9, _)'**
  String get crmTemplatesName;

  /// No description provided for @crmTemplatesBody.
  ///
  /// In en, this message translates to:
  /// **'Text'**
  String get crmTemplatesBody;

  /// No description provided for @crmTemplatesCategory.
  ///
  /// In en, this message translates to:
  /// **'Category'**
  String get crmTemplatesCategory;

  /// No description provided for @crmTemplatesCategoriesUtility.
  ///
  /// In en, this message translates to:
  /// **'Updates (bills, reminders)'**
  String get crmTemplatesCategoriesUtility;

  /// No description provided for @crmTemplatesCategoriesMarketing.
  ///
  /// In en, this message translates to:
  /// **'Marketing'**
  String get crmTemplatesCategoriesMarketing;

  /// No description provided for @crmTemplatesProviderName.
  ///
  /// In en, this message translates to:
  /// **'Approved name at Meta'**
  String get crmTemplatesProviderName;

  /// No description provided for @crmTemplatesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add template'**
  String get crmTemplatesAdd;

  /// No description provided for @crmTemplatesSave.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get crmTemplatesSave;

  /// No description provided for @crmCustomerTitle.
  ///
  /// In en, this message translates to:
  /// **'Customer'**
  String get crmCustomerTitle;

  /// No description provided for @crmCustomerBalance.
  ///
  /// In en, this message translates to:
  /// **'Balance'**
  String get crmCustomerBalance;

  /// No description provided for @crmCustomerSalesThisYear.
  ///
  /// In en, this message translates to:
  /// **'Sales this year'**
  String get crmCustomerSalesThisYear;

  /// No description provided for @crmCustomerSalesLastYear.
  ///
  /// In en, this message translates to:
  /// **'Last year'**
  String get crmCustomerSalesLastYear;

  /// No description provided for @crmCustomerOpenItems.
  ///
  /// In en, this message translates to:
  /// **'Open bills'**
  String get crmCustomerOpenItems;

  /// No description provided for @crmCustomerInvoices.
  ///
  /// In en, this message translates to:
  /// **'Recent invoices'**
  String get crmCustomerInvoices;

  /// No description provided for @crmCustomerReceipts.
  ///
  /// In en, this message translates to:
  /// **'Recent payments received'**
  String get crmCustomerReceipts;

  /// No description provided for @crmCustomerOrders.
  ///
  /// In en, this message translates to:
  /// **'Open quotations and orders'**
  String get crmCustomerOrders;

  /// No description provided for @crmCustomerActivities.
  ///
  /// In en, this message translates to:
  /// **'Activity'**
  String get crmCustomerActivities;

  /// No description provided for @crmCustomerFromLead.
  ///
  /// In en, this message translates to:
  /// **'From lead {code} ({source})'**
  String crmCustomerFromLead(String code, String source);

  /// No description provided for @crmCustomerLedger.
  ///
  /// In en, this message translates to:
  /// **'Ledger statement'**
  String get crmCustomerLedger;

  /// No description provided for @crmErrorsInvalidPhone.
  ///
  /// In en, this message translates to:
  /// **'Enter a 10-digit Indian mobile number.'**
  String get crmErrorsInvalidPhone;

  /// No description provided for @crmErrorsInvalidGstin.
  ///
  /// In en, this message translates to:
  /// **'The GSTIN isn\'t valid.'**
  String get crmErrorsInvalidGstin;

  /// No description provided for @crmErrorsConvertToWin.
  ///
  /// In en, this message translates to:
  /// **'Use “Won: make a customer” to win a lead.'**
  String get crmErrorsConvertToWin;

  /// No description provided for @crmErrorsLostReasonRequired.
  ///
  /// In en, this message translates to:
  /// **'Say why it was lost.'**
  String get crmErrorsLostReasonRequired;

  /// No description provided for @crmErrorsAlreadyConverted.
  ///
  /// In en, this message translates to:
  /// **'This lead is already a customer.'**
  String get crmErrorsAlreadyConverted;

  /// No description provided for @crmErrorsLeadOrCustomerRequired.
  ///
  /// In en, this message translates to:
  /// **'Choose a lead or customer.'**
  String get crmErrorsLeadOrCustomerRequired;

  /// No description provided for @crmErrorsUnknownTemplate.
  ///
  /// In en, this message translates to:
  /// **'Choose a template.'**
  String get crmErrorsUnknownTemplate;

  /// No description provided for @crmErrorsMissingParam.
  ///
  /// In en, this message translates to:
  /// **'Fill in every blank in the template.'**
  String get crmErrorsMissingParam;

  /// No description provided for @crmErrorsTemplateTooLong.
  ///
  /// In en, this message translates to:
  /// **'The template is too long.'**
  String get crmErrorsTemplateTooLong;

  /// No description provided for @crmErrorsTemplateExists.
  ///
  /// In en, this message translates to:
  /// **'A template with this name already exists.'**
  String get crmErrorsTemplateExists;

  /// No description provided for @crmErrorsNothingOutstanding.
  ///
  /// In en, this message translates to:
  /// **'Nothing is outstanding from this customer.'**
  String get crmErrorsNothingOutstanding;

  /// No description provided for @crmErrorsInvalidTemplateName.
  ///
  /// In en, this message translates to:
  /// **'Use lowercase letters, digits and _ only.'**
  String get crmErrorsInvalidTemplateName;

  /// No description provided for @crmErrorsUnknownAccount.
  ///
  /// In en, this message translates to:
  /// **'Choose a customer.'**
  String get crmErrorsUnknownAccount;

  /// No description provided for @crmErrorsInvalidStage.
  ///
  /// In en, this message translates to:
  /// **'Choose a stage.'**
  String get crmErrorsInvalidStage;

  /// No description provided for @priceListsTitle.
  ///
  /// In en, this message translates to:
  /// **'Price lists'**
  String get priceListsTitle;

  /// No description provided for @priceListsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Wholesale, distributor or retailer rates. A customer on a list gets its rates on new orders and invoices.'**
  String get priceListsSubtitle;

  /// No description provided for @priceListsOne.
  ///
  /// In en, this message translates to:
  /// **'Price list'**
  String get priceListsOne;

  /// No description provided for @priceListsNone.
  ///
  /// In en, this message translates to:
  /// **'None (sale rate)'**
  String get priceListsNone;

  /// No description provided for @priceListsNew.
  ///
  /// In en, this message translates to:
  /// **'New price list'**
  String get priceListsNew;

  /// No description provided for @priceListsName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get priceListsName;

  /// No description provided for @priceListsDiscountPct.
  ///
  /// In en, this message translates to:
  /// **'Discount off sale rate (%)'**
  String get priceListsDiscountPct;

  /// No description provided for @priceListsDiscountHint.
  ///
  /// In en, this message translates to:
  /// **'Applies to every item without a fixed rate'**
  String get priceListsDiscountHint;

  /// No description provided for @priceListsFixedRates.
  ///
  /// In en, this message translates to:
  /// **'Fixed rates'**
  String get priceListsFixedRates;

  /// No description provided for @priceListsCustomers.
  ///
  /// In en, this message translates to:
  /// **'Customers'**
  String get priceListsCustomers;

  /// No description provided for @priceListsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No price lists yet.'**
  String get priceListsEmpty;

  /// No description provided for @priceListsAddRate.
  ///
  /// In en, this message translates to:
  /// **'Add a fixed rate'**
  String get priceListsAddRate;

  /// No description provided for @priceListsErrorsPriceListNameTaken.
  ///
  /// In en, this message translates to:
  /// **'A price list with this name already exists.'**
  String get priceListsErrorsPriceListNameTaken;

  /// No description provided for @priceListsErrorsDuplicateItem.
  ///
  /// In en, this message translates to:
  /// **'An item is listed twice.'**
  String get priceListsErrorsDuplicateItem;

  /// No description provided for @agentsTitle.
  ///
  /// In en, this message translates to:
  /// **'Brokers and agents'**
  String get agentsTitle;

  /// No description provided for @agentsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Commission on money received from the customers each agent brought. Goods returned take it back.'**
  String get agentsSubtitle;

  /// No description provided for @agentsIsAgent.
  ///
  /// In en, this message translates to:
  /// **'Broker or agent (earns commission)'**
  String get agentsIsAgent;

  /// No description provided for @agentsCommissionPct.
  ///
  /// In en, this message translates to:
  /// **'Commission (%)'**
  String get agentsCommissionPct;

  /// No description provided for @agentsCommissionHint.
  ///
  /// In en, this message translates to:
  /// **'On the taxable value, as the customer pays'**
  String get agentsCommissionHint;

  /// No description provided for @agentsAgent.
  ///
  /// In en, this message translates to:
  /// **'Agent'**
  String get agentsAgent;

  /// No description provided for @agentsNoAgent.
  ///
  /// In en, this message translates to:
  /// **'No agent'**
  String get agentsNoAgent;

  /// No description provided for @agentsSalesman.
  ///
  /// In en, this message translates to:
  /// **'Salesman'**
  String get agentsSalesman;

  /// No description provided for @agentsNoSalesman.
  ///
  /// In en, this message translates to:
  /// **'No salesman'**
  String get agentsNoSalesman;

  /// No description provided for @agentsEarned.
  ///
  /// In en, this message translates to:
  /// **'Earned'**
  String get agentsEarned;

  /// No description provided for @agentsBilled.
  ///
  /// In en, this message translates to:
  /// **'Billed'**
  String get agentsBilled;

  /// No description provided for @agentsDue.
  ///
  /// In en, this message translates to:
  /// **'Due'**
  String get agentsDue;

  /// No description provided for @agentsInvoice.
  ///
  /// In en, this message translates to:
  /// **'Invoice'**
  String get agentsInvoice;

  /// No description provided for @agentsBase.
  ///
  /// In en, this message translates to:
  /// **'Taxable value'**
  String get agentsBase;

  /// No description provided for @agentsReceived.
  ///
  /// In en, this message translates to:
  /// **'Received'**
  String get agentsReceived;

  /// No description provided for @agentsNoInvoices.
  ///
  /// In en, this message translates to:
  /// **'No invoices yet.'**
  String get agentsNoInvoices;

  /// No description provided for @agentsMakeBill.
  ///
  /// In en, this message translates to:
  /// **'Make brokerage bill'**
  String get agentsMakeBill;

  /// No description provided for @agentsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No agents yet. Mark a ledger as a broker or agent in the chart of accounts.'**
  String get agentsEmpty;

  /// No description provided for @agentsBills.
  ///
  /// In en, this message translates to:
  /// **'Brokerage bills'**
  String get agentsBills;

  /// No description provided for @agentsNumber.
  ///
  /// In en, this message translates to:
  /// **'Number'**
  String get agentsNumber;

  /// No description provided for @agentsCommission.
  ///
  /// In en, this message translates to:
  /// **'Commission'**
  String get agentsCommission;

  /// No description provided for @agentsTds.
  ///
  /// In en, this message translates to:
  /// **'TDS'**
  String get agentsTds;

  /// No description provided for @agentsNet.
  ///
  /// In en, this message translates to:
  /// **'Net payable'**
  String get agentsNet;

  /// No description provided for @agentsNoBills.
  ///
  /// In en, this message translates to:
  /// **'No brokerage bills yet.'**
  String get agentsNoBills;

  /// No description provided for @agentsBillFor.
  ///
  /// In en, this message translates to:
  /// **'Bill {name} for the {amount} of commission due.'**
  String agentsBillFor(String name, String amount);

  /// No description provided for @agentsTdsRate.
  ///
  /// In en, this message translates to:
  /// **'TDS rate (%)'**
  String get agentsTdsRate;

  /// No description provided for @agentsTdsHint.
  ///
  /// In en, this message translates to:
  /// **'Blank: 2% under 194H once the year\'s commission passes ₹20,000'**
  String get agentsTdsHint;

  /// No description provided for @agentsPost.
  ///
  /// In en, this message translates to:
  /// **'Post bill'**
  String get agentsPost;

  /// No description provided for @agentsCancelBill.
  ///
  /// In en, this message translates to:
  /// **'Cancel bill'**
  String get agentsCancelBill;

  /// No description provided for @agentsErrorsNothingToBill.
  ///
  /// In en, this message translates to:
  /// **'Nothing is due to this agent on that date.'**
  String get agentsErrorsNothingToBill;

  /// No description provided for @agentsErrorsNotAnAgent.
  ///
  /// In en, this message translates to:
  /// **'Choose a ledger marked as a broker or agent.'**
  String get agentsErrorsNotAnAgent;

  /// No description provided for @targetsTitle.
  ///
  /// In en, this message translates to:
  /// **'Salesman targets'**
  String get targetsTitle;

  /// No description provided for @targetsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Monthly targets with commission slabs, against each salesman\'s invoiced sales less returns.'**
  String get targetsSubtitle;

  /// No description provided for @targetsPrevious.
  ///
  /// In en, this message translates to:
  /// **'Previous month'**
  String get targetsPrevious;

  /// No description provided for @targetsNext.
  ///
  /// In en, this message translates to:
  /// **'Next month'**
  String get targetsNext;

  /// No description provided for @targetsEdit.
  ///
  /// In en, this message translates to:
  /// **'Set targets'**
  String get targetsEdit;

  /// No description provided for @targetsChooseSalesman.
  ///
  /// In en, this message translates to:
  /// **'Choose salesman'**
  String get targetsChooseSalesman;

  /// No description provided for @targetsTarget.
  ///
  /// In en, this message translates to:
  /// **'Target'**
  String get targetsTarget;

  /// No description provided for @targetsSlabs.
  ///
  /// In en, this message translates to:
  /// **'Slabs'**
  String get targetsSlabs;

  /// No description provided for @targetsSlabsHint.
  ///
  /// In en, this message translates to:
  /// **'Slabs are percent of target reached : commission percent. For example 0:1, 100:2 pays 1% below target and 2% at or above it.'**
  String get targetsSlabsHint;

  /// No description provided for @targetsAdd.
  ///
  /// In en, this message translates to:
  /// **'Add salesman'**
  String get targetsAdd;

  /// No description provided for @targetsCopyLast.
  ///
  /// In en, this message translates to:
  /// **'Copy last month'**
  String get targetsCopyLast;

  /// No description provided for @targetsAchieved.
  ///
  /// In en, this message translates to:
  /// **'Achieved'**
  String get targetsAchieved;

  /// No description provided for @targetsProgress.
  ///
  /// In en, this message translates to:
  /// **'Of target'**
  String get targetsProgress;

  /// No description provided for @targetsRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get targetsRate;

  /// No description provided for @targetsInvoices.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} invoice} other {{n} invoices}}'**
  String targetsInvoices(num n);

  /// No description provided for @targetsReturns.
  ///
  /// In en, this message translates to:
  /// **'returns {amount}'**
  String targetsReturns(String amount);

  /// No description provided for @targetsNoTarget.
  ///
  /// In en, this message translates to:
  /// **'No target'**
  String get targetsNoTarget;

  /// No description provided for @targetsEmpty.
  ///
  /// In en, this message translates to:
  /// **'No targets or salesman sales this month.'**
  String get targetsEmpty;

  /// No description provided for @targetsNote.
  ///
  /// In en, this message translates to:
  /// **'Sales are the taxable value of invoices tagged with the salesman, less credit notes issued in the month on those invoices.'**
  String get targetsNote;

  /// No description provided for @targetsErrorsInvalid.
  ///
  /// In en, this message translates to:
  /// **'Each row needs a salesman, a target in rupees and slabs written like 0:1, 100:2.'**
  String get targetsErrorsInvalid;

  /// No description provided for @targetsErrorsDuplicateSalesman.
  ///
  /// In en, this message translates to:
  /// **'A salesman is listed twice.'**
  String get targetsErrorsDuplicateSalesman;

  /// No description provided for @targetsErrorsDuplicateSlab.
  ///
  /// In en, this message translates to:
  /// **'Two slabs start at the same percent.'**
  String get targetsErrorsDuplicateSlab;

  /// No description provided for @targetsErrorsUnknownEmployee.
  ///
  /// In en, this message translates to:
  /// **'Choose a salesman from your employees.'**
  String get targetsErrorsUnknownEmployee;

  /// No description provided for @schemesTitle.
  ///
  /// In en, this message translates to:
  /// **'Schemes and offers'**
  String get schemesTitle;

  /// No description provided for @schemesSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Offers the counter applies on its own: percent off, amount off, buy X get Y, slabs and combos.'**
  String get schemesSubtitle;

  /// No description provided for @schemesNew.
  ///
  /// In en, this message translates to:
  /// **'New scheme'**
  String get schemesNew;

  /// No description provided for @schemesName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get schemesName;

  /// No description provided for @schemesOffer.
  ///
  /// In en, this message translates to:
  /// **'Offer'**
  String get schemesOffer;

  /// No description provided for @schemesOn.
  ///
  /// In en, this message translates to:
  /// **'On'**
  String get schemesOn;

  /// No description provided for @schemesDates.
  ///
  /// In en, this message translates to:
  /// **'Dates'**
  String get schemesDates;

  /// No description provided for @schemesOff.
  ///
  /// In en, this message translates to:
  /// **'switched off'**
  String get schemesOff;

  /// No description provided for @schemesEmpty.
  ///
  /// In en, this message translates to:
  /// **'No schemes yet.'**
  String get schemesEmpty;

  /// No description provided for @schemesRules.
  ///
  /// In en, this message translates to:
  /// **'Each line gets one scheme at most, and the bill gets the mix of schemes that saves the customer most. A line with its own discount takes no scheme.'**
  String get schemesRules;

  /// No description provided for @schemesEverything.
  ///
  /// In en, this message translates to:
  /// **'Everything'**
  String get schemesEverything;

  /// No description provided for @schemesAlways.
  ///
  /// In en, this message translates to:
  /// **'Always'**
  String get schemesAlways;

  /// No description provided for @schemesNow.
  ///
  /// In en, this message translates to:
  /// **'now'**
  String get schemesNow;

  /// No description provided for @schemesNoEnd.
  ///
  /// In en, this message translates to:
  /// **'no end date'**
  String get schemesNoEnd;

  /// No description provided for @schemesRange.
  ///
  /// In en, this message translates to:
  /// **'{from} to {to}'**
  String schemesRange(String from, String to);

  /// No description provided for @schemesKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get schemesKind;

  /// No description provided for @schemesStartsOn.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get schemesStartsOn;

  /// No description provided for @schemesEndsOn.
  ///
  /// In en, this message translates to:
  /// **'Until'**
  String get schemesEndsOn;

  /// No description provided for @schemesPct.
  ///
  /// In en, this message translates to:
  /// **'Discount (%)'**
  String get schemesPct;

  /// No description provided for @schemesOffPct.
  ///
  /// In en, this message translates to:
  /// **'Discount on the extra pieces (%)'**
  String get schemesOffPct;

  /// No description provided for @schemesOffPctHint.
  ///
  /// In en, this message translates to:
  /// **'100 makes them free'**
  String get schemesOffPctHint;

  /// No description provided for @schemesAmount.
  ///
  /// In en, this message translates to:
  /// **'Amount off (₹)'**
  String get schemesAmount;

  /// No description provided for @schemesMinValue.
  ///
  /// In en, this message translates to:
  /// **'Minimum on these items (₹)'**
  String get schemesMinValue;

  /// No description provided for @schemesBuy.
  ///
  /// In en, this message translates to:
  /// **'Buy'**
  String get schemesBuy;

  /// No description provided for @schemesGet.
  ///
  /// In en, this message translates to:
  /// **'Get'**
  String get schemesGet;

  /// No description provided for @schemesSlabs.
  ///
  /// In en, this message translates to:
  /// **'Slabs'**
  String get schemesSlabs;

  /// No description provided for @schemesQtySlabsHint.
  ///
  /// In en, this message translates to:
  /// **'Pieces : percent off, e.g. 3:10, 5:20'**
  String get schemesQtySlabsHint;

  /// No description provided for @schemesValueSlabsHint.
  ///
  /// In en, this message translates to:
  /// **'Rupees : percent off, e.g. 2000:5, 5000:10'**
  String get schemesValueSlabsHint;

  /// No description provided for @schemesComboPrice.
  ///
  /// In en, this message translates to:
  /// **'Combo price (₹)'**
  String get schemesComboPrice;

  /// No description provided for @schemesComboItems.
  ///
  /// In en, this message translates to:
  /// **'Items in the combo'**
  String get schemesComboItems;

  /// No description provided for @schemesItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get schemesItem;

  /// No description provided for @schemesQty.
  ///
  /// In en, this message translates to:
  /// **'Qty'**
  String get schemesQty;

  /// No description provided for @schemesAddItem.
  ///
  /// In en, this message translates to:
  /// **'Add item'**
  String get schemesAddItem;

  /// No description provided for @schemesAddStyle.
  ///
  /// In en, this message translates to:
  /// **'Add style'**
  String get schemesAddStyle;

  /// No description provided for @schemesScopeHint.
  ///
  /// In en, this message translates to:
  /// **'Leave all of these empty to cover every item; otherwise an item matching any of them counts.'**
  String get schemesScopeHint;

  /// No description provided for @schemesBrands.
  ///
  /// In en, this message translates to:
  /// **'Brands'**
  String get schemesBrands;

  /// No description provided for @schemesCategories.
  ///
  /// In en, this message translates to:
  /// **'Categories'**
  String get schemesCategories;

  /// No description provided for @schemesStyles.
  ///
  /// In en, this message translates to:
  /// **'Styles'**
  String get schemesStyles;

  /// No description provided for @schemesItems.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get schemesItems;

  /// No description provided for @schemesCommaHint.
  ///
  /// In en, this message translates to:
  /// **'Separate with commas'**
  String get schemesCommaHint;

  /// No description provided for @schemesActive.
  ///
  /// In en, this message translates to:
  /// **'Switched on'**
  String get schemesActive;

  /// No description provided for @schemesKindsPercent.
  ///
  /// In en, this message translates to:
  /// **'Percent off'**
  String get schemesKindsPercent;

  /// No description provided for @schemesKindsAmountOff.
  ///
  /// In en, this message translates to:
  /// **'Amount off'**
  String get schemesKindsAmountOff;

  /// No description provided for @schemesKindsQtySlab.
  ///
  /// In en, this message translates to:
  /// **'Quantity slabs'**
  String get schemesKindsQtySlab;

  /// No description provided for @schemesKindsValueSlab.
  ///
  /// In en, this message translates to:
  /// **'Value slabs'**
  String get schemesKindsValueSlab;

  /// No description provided for @schemesKindsBuyGet.
  ///
  /// In en, this message translates to:
  /// **'Buy X get Y'**
  String get schemesKindsBuyGet;

  /// No description provided for @schemesKindsCombo.
  ///
  /// In en, this message translates to:
  /// **'Combo or hamper'**
  String get schemesKindsCombo;

  /// No description provided for @schemesKindHintPercent.
  ///
  /// In en, this message translates to:
  /// **'Same percent off every covered item'**
  String get schemesKindHintPercent;

  /// No description provided for @schemesKindHintAmountOff.
  ///
  /// In en, this message translates to:
  /// **'A fixed amount off, spread by value'**
  String get schemesKindHintAmountOff;

  /// No description provided for @schemesKindHintQtySlab.
  ///
  /// In en, this message translates to:
  /// **'More pieces, bigger percent'**
  String get schemesKindHintQtySlab;

  /// No description provided for @schemesKindHintValueSlab.
  ///
  /// In en, this message translates to:
  /// **'Bigger bill, bigger percent'**
  String get schemesKindHintValueSlab;

  /// No description provided for @schemesKindHintBuyGet.
  ///
  /// In en, this message translates to:
  /// **'The cheapest of each group are free or discounted'**
  String get schemesKindHintBuyGet;

  /// No description provided for @schemesKindHintCombo.
  ///
  /// In en, this message translates to:
  /// **'A set of items at one price'**
  String get schemesKindHintCombo;

  /// No description provided for @schemesSumPercent.
  ///
  /// In en, this message translates to:
  /// **'{pct}% off'**
  String schemesSumPercent(String pct);

  /// No description provided for @schemesSumMin.
  ///
  /// In en, this message translates to:
  /// **'on {amount} or more'**
  String schemesSumMin(String amount);

  /// No description provided for @schemesSumAmountOff.
  ///
  /// In en, this message translates to:
  /// **'{amount} off'**
  String schemesSumAmountOff(String amount);

  /// No description provided for @schemesSumQtySlab.
  ///
  /// In en, this message translates to:
  /// **'{from}+ pcs {pct}%'**
  String schemesSumQtySlab(String from, String pct);

  /// No description provided for @schemesSumValueSlab.
  ///
  /// In en, this message translates to:
  /// **'{from}+ {pct}%'**
  String schemesSumValueSlab(String from, String pct);

  /// No description provided for @schemesSumBuyGetFree.
  ///
  /// In en, this message translates to:
  /// **'Buy {buy} get {get} free'**
  String schemesSumBuyGetFree(String buy, String get);

  /// No description provided for @schemesSumBuyGetOff.
  ///
  /// In en, this message translates to:
  /// **'Buy {buy} get {get} at {pct}% off'**
  String schemesSumBuyGetOff(String buy, String get, String pct);

  /// No description provided for @schemesSumCombo.
  ///
  /// In en, this message translates to:
  /// **'{n} items for {price}'**
  String schemesSumCombo(String n, String price);

  /// No description provided for @schemesErrorsSchemeIncomplete.
  ///
  /// In en, this message translates to:
  /// **'Fill in what this type of scheme needs.'**
  String get schemesErrorsSchemeIncomplete;

  /// No description provided for @schemesErrorsSchemeNameTaken.
  ///
  /// In en, this message translates to:
  /// **'A scheme with this name already exists.'**
  String get schemesErrorsSchemeNameTaken;

  /// No description provided for @schemesErrorsEndsBeforeStart.
  ///
  /// In en, this message translates to:
  /// **'The end date is before the start date.'**
  String get schemesErrorsEndsBeforeStart;

  /// No description provided for @schemesErrorsDuplicateSlab.
  ///
  /// In en, this message translates to:
  /// **'Two slabs start at the same point.'**
  String get schemesErrorsDuplicateSlab;

  /// No description provided for @schemesErrorsUnknownItem.
  ///
  /// In en, this message translates to:
  /// **'Choose items from your list.'**
  String get schemesErrorsUnknownItem;

  /// No description provided for @schemesErrorsUnknownStyle.
  ///
  /// In en, this message translates to:
  /// **'Choose styles from your list.'**
  String get schemesErrorsUnknownStyle;

  /// No description provided for @schemesErrorsSlabs.
  ///
  /// In en, this message translates to:
  /// **'Write slabs like 3:10, 5:20.'**
  String get schemesErrorsSlabs;

  /// No description provided for @schemesErrorsNumber.
  ///
  /// In en, this message translates to:
  /// **'Amounts and percents must be numbers.'**
  String get schemesErrorsNumber;

  /// No description provided for @interestTitle.
  ///
  /// In en, this message translates to:
  /// **'Interest on overdue'**
  String get interestTitle;

  /// No description provided for @interestSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Simple interest on each bill for the days it is past due, at the customer\'s rate.'**
  String get interestSubtitle;

  /// No description provided for @interestPartyRates.
  ///
  /// In en, this message translates to:
  /// **'Customers with an interest rate set.'**
  String get interestPartyRates;

  /// No description provided for @interestUsingRate.
  ///
  /// In en, this message translates to:
  /// **'Customers without their own rate are worked out at {rate}%.'**
  String interestUsingRate(String rate);

  /// No description provided for @interestPartyRatesOnly.
  ///
  /// In en, this message translates to:
  /// **'Only customers with a rate'**
  String get interestPartyRatesOnly;

  /// No description provided for @interestTryRate.
  ///
  /// In en, this message translates to:
  /// **'Work out everyone at {rate}%'**
  String interestTryRate(String rate);

  /// No description provided for @interestRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get interestRate;

  /// No description provided for @interestOverdue.
  ///
  /// In en, this message translates to:
  /// **'Overdue'**
  String get interestOverdue;

  /// No description provided for @interestInterest.
  ///
  /// In en, this message translates to:
  /// **'Interest'**
  String get interestInterest;

  /// No description provided for @interestDueOn.
  ///
  /// In en, this message translates to:
  /// **'due {date}'**
  String interestDueOn(String date);

  /// No description provided for @interestNone.
  ///
  /// In en, this message translates to:
  /// **'No overdue bills to charge interest on.'**
  String get interestNone;

  /// No description provided for @interestGstNote.
  ///
  /// In en, this message translates to:
  /// **'Interest charged for late payment is part of the value of the supply (CGST Act s. 15(2)(d)); bill it with GST at the rate of the goods.'**
  String get interestGstNote;

  /// No description provided for @integrityTitle.
  ///
  /// In en, this message translates to:
  /// **'Integrity check'**
  String get integrityTitle;

  /// No description provided for @integritySubtitle.
  ///
  /// In en, this message translates to:
  /// **'Do your books agree with themselves? Each check compares two things that must match and lists any difference with the records behind it.'**
  String get integritySubtitle;

  /// No description provided for @integrityAllGood.
  ///
  /// In en, this message translates to:
  /// **'All checks pass. Your books agree with themselves.'**
  String get integrityAllGood;

  /// No description provided for @integrityProblems.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} check needs attention} other {{n} checks need attention}}'**
  String integrityProblems(num n);

  /// No description provided for @integrityPass.
  ///
  /// In en, this message translates to:
  /// **'Passes'**
  String get integrityPass;

  /// No description provided for @integrityFail.
  ///
  /// In en, this message translates to:
  /// **'Difference'**
  String get integrityFail;

  /// No description provided for @integrityWarn.
  ///
  /// In en, this message translates to:
  /// **'Look at this'**
  String get integrityWarn;

  /// No description provided for @integrityRecords.
  ///
  /// In en, this message translates to:
  /// **'Records'**
  String get integrityRecords;

  /// No description provided for @integrityFirstTwenty.
  ///
  /// In en, this message translates to:
  /// **'Showing the first 20.'**
  String get integrityFirstTwenty;

  /// No description provided for @integrityVouchersBalanceTitle.
  ///
  /// In en, this message translates to:
  /// **'Every voucher balances'**
  String get integrityVouchersBalanceTitle;

  /// No description provided for @integrityVouchersBalanceHelp.
  ///
  /// In en, this message translates to:
  /// **'Debits equal credits in each voucher. A voucher that does not is listed.'**
  String get integrityVouchersBalanceHelp;

  /// No description provided for @integrityTrialBalanceTitle.
  ///
  /// In en, this message translates to:
  /// **'Trial balance balances'**
  String get integrityTrialBalanceTitle;

  /// No description provided for @integrityTrialBalanceHelp.
  ///
  /// In en, this message translates to:
  /// **'Opening balances plus every posted entry add up to zero. A difference usually means an opening balance was entered without its other side, such as the owner\'s capital.'**
  String get integrityTrialBalanceHelp;

  /// No description provided for @integrityInvoicesMatchLedgerTitle.
  ///
  /// In en, this message translates to:
  /// **'Sales invoices match the ledger'**
  String get integrityInvoicesMatchLedgerTitle;

  /// No description provided for @integrityInvoicesMatchLedgerHelp.
  ///
  /// In en, this message translates to:
  /// **'Each posted invoice put its total into the customer\'s account.'**
  String get integrityInvoicesMatchLedgerHelp;

  /// No description provided for @integrityBillsMatchLedgerTitle.
  ///
  /// In en, this message translates to:
  /// **'Purchase bills match the ledger'**
  String get integrityBillsMatchLedgerTitle;

  /// No description provided for @integrityBillsMatchLedgerHelp.
  ///
  /// In en, this message translates to:
  /// **'Each posted bill, except those under reverse charge, put its total into the supplier\'s account.'**
  String get integrityBillsMatchLedgerHelp;

  /// No description provided for @integrityDocumentsPostedTitle.
  ///
  /// In en, this message translates to:
  /// **'Posted documents have their ledger entries'**
  String get integrityDocumentsPostedTitle;

  /// No description provided for @integrityDocumentsPostedHelp.
  ///
  /// In en, this message translates to:
  /// **'A posted invoice or bill with no voucher behind it is listed.'**
  String get integrityDocumentsPostedHelp;

  /// No description provided for @integrityCancelledReversedTitle.
  ///
  /// In en, this message translates to:
  /// **'Cancelled vouchers net to zero'**
  String get integrityCancelledReversedTitle;

  /// No description provided for @integrityCancelledReversedHelp.
  ///
  /// In en, this message translates to:
  /// **'Cancelling a voucher must reverse every account it touched.'**
  String get integrityCancelledReversedHelp;

  /// No description provided for @integrityReceivablesMatchTitle.
  ///
  /// In en, this message translates to:
  /// **'Money owed by customers matches the ledger'**
  String get integrityReceivablesMatchTitle;

  /// No description provided for @integrityReceivablesMatchHelp.
  ///
  /// In en, this message translates to:
  /// **'The outstanding list adds up to the customers\' ledger balances.'**
  String get integrityReceivablesMatchHelp;

  /// No description provided for @integrityPayablesMatchTitle.
  ///
  /// In en, this message translates to:
  /// **'Money owed to suppliers matches the ledger'**
  String get integrityPayablesMatchTitle;

  /// No description provided for @integrityPayablesMatchHelp.
  ///
  /// In en, this message translates to:
  /// **'The outstanding list adds up to the suppliers\' ledger balances.'**
  String get integrityPayablesMatchHelp;

  /// No description provided for @integrityGiftVoucherLiabilityTitle.
  ///
  /// In en, this message translates to:
  /// **'Gift voucher liability matches unspent vouchers'**
  String get integrityGiftVoucherLiabilityTitle;

  /// No description provided for @integrityGiftVoucherLiabilityHelp.
  ///
  /// In en, this message translates to:
  /// **'The ledger account for gift vouchers equals the balance left on vouchers still active.'**
  String get integrityGiftVoucherLiabilityHelp;

  /// No description provided for @integrityNegativeStockTitle.
  ///
  /// In en, this message translates to:
  /// **'No stock below zero'**
  String get integrityNegativeStockTitle;

  /// No description provided for @integrityNegativeStockHelp.
  ///
  /// In en, this message translates to:
  /// **'Items sold or issued beyond what the books show in stock. It can be a real timing gap; record the missing receipt to fix it.'**
  String get integrityNegativeStockHelp;

  /// No description provided for @sensitiveTitle.
  ///
  /// In en, this message translates to:
  /// **'Sensitive changes'**
  String get sensitiveTitle;

  /// No description provided for @sensitiveSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Changes that can move money or open a door: bank details, credit terms, tax settings, who may do what, period locks and payroll settings. Newest first.'**
  String get sensitiveSubtitle;

  /// No description provided for @sensitiveKindBank.
  ///
  /// In en, this message translates to:
  /// **'Bank details'**
  String get sensitiveKindBank;

  /// No description provided for @sensitiveKindCredit.
  ///
  /// In en, this message translates to:
  /// **'Credit terms'**
  String get sensitiveKindCredit;

  /// No description provided for @sensitiveKindTax.
  ///
  /// In en, this message translates to:
  /// **'Tax and company settings'**
  String get sensitiveKindTax;

  /// No description provided for @sensitiveKindPermissions.
  ///
  /// In en, this message translates to:
  /// **'Who may do what'**
  String get sensitiveKindPermissions;

  /// No description provided for @sensitiveKindPeriod.
  ///
  /// In en, this message translates to:
  /// **'Period locks and numbering'**
  String get sensitiveKindPeriod;

  /// No description provided for @sensitiveKindPayroll.
  ///
  /// In en, this message translates to:
  /// **'Payroll settings'**
  String get sensitiveKindPayroll;

  /// No description provided for @sensitiveKindOverride.
  ///
  /// In en, this message translates to:
  /// **'Credit override'**
  String get sensitiveKindOverride;

  /// No description provided for @sensitiveKindDevice.
  ///
  /// In en, this message translates to:
  /// **'Devices'**
  String get sensitiveKindDevice;

  /// No description provided for @sensitiveAll.
  ///
  /// In en, this message translates to:
  /// **'All kinds'**
  String get sensitiveAll;

  /// No description provided for @sensitiveNone.
  ///
  /// In en, this message translates to:
  /// **'No sensitive changes in this period.'**
  String get sensitiveNone;

  /// No description provided for @sensitiveShow.
  ///
  /// In en, this message translates to:
  /// **'Show'**
  String get sensitiveShow;

  /// No description provided for @cfoTitle.
  ///
  /// In en, this message translates to:
  /// **'Owner\'s view'**
  String get cfoTitle;

  /// No description provided for @cfoSubtitle.
  ///
  /// In en, this message translates to:
  /// **'From sales to profit for the period, against the same period last year. Profit before and after tax are the same here unless your books record income tax.'**
  String get cfoSubtitle;

  /// No description provided for @cfoThisPeriod.
  ///
  /// In en, this message translates to:
  /// **'This period'**
  String get cfoThisPeriod;

  /// No description provided for @cfoLastYear.
  ///
  /// In en, this message translates to:
  /// **'Same period last year'**
  String get cfoLastYear;

  /// No description provided for @cfoGrowth.
  ///
  /// In en, this message translates to:
  /// **'Growth'**
  String get cfoGrowth;

  /// No description provided for @cfoRevenue.
  ///
  /// In en, this message translates to:
  /// **'Revenue'**
  String get cfoRevenue;

  /// No description provided for @cfoCostOfGoods.
  ///
  /// In en, this message translates to:
  /// **'Cost of goods sold'**
  String get cfoCostOfGoods;

  /// No description provided for @cfoGrossProfit.
  ///
  /// In en, this message translates to:
  /// **'Gross profit'**
  String get cfoGrossProfit;

  /// No description provided for @cfoGrossMargin.
  ///
  /// In en, this message translates to:
  /// **'Gross margin'**
  String get cfoGrossMargin;

  /// No description provided for @cfoOperatingExpenses.
  ///
  /// In en, this message translates to:
  /// **'Operating expenses'**
  String get cfoOperatingExpenses;

  /// No description provided for @cfoOtherIncome.
  ///
  /// In en, this message translates to:
  /// **'Other income'**
  String get cfoOtherIncome;

  /// No description provided for @cfoDepreciation.
  ///
  /// In en, this message translates to:
  /// **'Depreciation'**
  String get cfoDepreciation;

  /// No description provided for @cfoEbitda.
  ///
  /// In en, this message translates to:
  /// **'EBITDA (profit before depreciation)'**
  String get cfoEbitda;

  /// No description provided for @cfoNetProfit.
  ///
  /// In en, this message translates to:
  /// **'Net profit'**
  String get cfoNetProfit;

  /// No description provided for @cfoMonthly.
  ///
  /// In en, this message translates to:
  /// **'Gross margin by month'**
  String get cfoMonthly;

  /// No description provided for @lrTitle.
  ///
  /// In en, this message translates to:
  /// **'LR and transport entry'**
  String get lrTitle;

  /// No description provided for @lrSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Goods sent through a transporter: the LR number, the invoice, freight, and whether it has reached the customer.'**
  String get lrSubtitle;

  /// No description provided for @lrTransporter.
  ///
  /// In en, this message translates to:
  /// **'Transporter'**
  String get lrTransporter;

  /// No description provided for @lrLrNumber.
  ///
  /// In en, this message translates to:
  /// **'LR number'**
  String get lrLrNumber;

  /// No description provided for @lrInvoice.
  ///
  /// In en, this message translates to:
  /// **'Invoice'**
  String get lrInvoice;

  /// No description provided for @lrNoInvoice.
  ///
  /// In en, this message translates to:
  /// **'No invoice'**
  String get lrNoInvoice;

  /// No description provided for @lrDestination.
  ///
  /// In en, this message translates to:
  /// **'Destination'**
  String get lrDestination;

  /// No description provided for @lrPackages.
  ///
  /// In en, this message translates to:
  /// **'Packages'**
  String get lrPackages;

  /// No description provided for @lrWeight.
  ///
  /// In en, this message translates to:
  /// **'Weight (kg)'**
  String get lrWeight;

  /// No description provided for @lrFreight.
  ///
  /// In en, this message translates to:
  /// **'Freight'**
  String get lrFreight;

  /// No description provided for @lrFreightBy.
  ///
  /// In en, this message translates to:
  /// **'Who pays the freight'**
  String get lrFreightBy;

  /// No description provided for @lrPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid by us'**
  String get lrPaid;

  /// No description provided for @lrToPay.
  ///
  /// In en, this message translates to:
  /// **'To pay by customer'**
  String get lrToPay;

  /// No description provided for @lrAdd.
  ///
  /// In en, this message translates to:
  /// **'Add consignment'**
  String get lrAdd;

  /// No description provided for @lrStatus.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get lrStatus;

  /// No description provided for @lrAllStatuses.
  ///
  /// In en, this message translates to:
  /// **'All statuses'**
  String get lrAllStatuses;

  /// No description provided for @lrStatusesBooked.
  ///
  /// In en, this message translates to:
  /// **'Booked'**
  String get lrStatusesBooked;

  /// No description provided for @lrStatusesInTransit.
  ///
  /// In en, this message translates to:
  /// **'In transit'**
  String get lrStatusesInTransit;

  /// No description provided for @lrStatusesDelivered.
  ///
  /// In en, this message translates to:
  /// **'Delivered'**
  String get lrStatusesDelivered;

  /// No description provided for @lrDeliveredOn.
  ///
  /// In en, this message translates to:
  /// **'Delivered on {date}'**
  String lrDeliveredOn(String date);

  /// No description provided for @lrDaysOut.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day since it was sent} other {{n} days since it was sent}}'**
  String lrDaysOut(num n);

  /// No description provided for @lrEmpty.
  ///
  /// In en, this message translates to:
  /// **'No consignments yet. Add the first one above.'**
  String get lrEmpty;

  /// No description provided for @lrErrorsLrTaken.
  ///
  /// In en, this message translates to:
  /// **'This transporter already has an entry with that LR number.'**
  String get lrErrorsLrTaken;

  /// No description provided for @lrErrorsUnknownInvoice.
  ///
  /// In en, this message translates to:
  /// **'That invoice was not found.'**
  String get lrErrorsUnknownInvoice;

  /// No description provided for @lrErrorsDeliveredBeforeSent.
  ///
  /// In en, this message translates to:
  /// **'The delivery date is before the date it was sent.'**
  String get lrErrorsDeliveredBeforeSent;

  /// No description provided for @hsnTitle.
  ///
  /// In en, this message translates to:
  /// **'HSN and SAC codes'**
  String get hsnTitle;

  /// No description provided for @hsnSubtitle.
  ///
  /// In en, this message translates to:
  /// **'The codes your business uses, with plain descriptions. Item and style forms suggest from this list. A rate here is only a convenience: apparel and footwear are taxed by price slab.'**
  String get hsnSubtitle;

  /// No description provided for @hsnCode.
  ///
  /// In en, this message translates to:
  /// **'Code'**
  String get hsnCode;

  /// No description provided for @hsnDescription.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get hsnDescription;

  /// No description provided for @hsnKind.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get hsnKind;

  /// No description provided for @hsnGoods.
  ///
  /// In en, this message translates to:
  /// **'Goods (HSN)'**
  String get hsnGoods;

  /// No description provided for @hsnService.
  ///
  /// In en, this message translates to:
  /// **'Service (SAC)'**
  String get hsnService;

  /// No description provided for @hsnRate.
  ///
  /// In en, this message translates to:
  /// **'Rate'**
  String get hsnRate;

  /// No description provided for @hsnAddStandard.
  ///
  /// In en, this message translates to:
  /// **'Add standard apparel codes'**
  String get hsnAddStandard;

  /// No description provided for @hsnStandardAdded.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {Added {n} code. Codes you already had were left alone.} other {Added {n} codes. Codes you already had were left alone.}}'**
  String hsnStandardAdded(num n);

  /// No description provided for @hsnShowArchived.
  ///
  /// In en, this message translates to:
  /// **'Show archived'**
  String get hsnShowArchived;

  /// No description provided for @hsnEmpty.
  ///
  /// In en, this message translates to:
  /// **'No codes yet. Add one above, or add the standard apparel codes.'**
  String get hsnEmpty;

  /// No description provided for @hsnErrorsHsnTaken.
  ///
  /// In en, this message translates to:
  /// **'This code is already in the list.'**
  String get hsnErrorsHsnTaken;

  /// No description provided for @hsnErrorsInvalidHsn.
  ///
  /// In en, this message translates to:
  /// **'An HSN code has 4, 6 or 8 digits (a SAC code 6).'**
  String get hsnErrorsInvalidHsn;

  /// No description provided for @notesTitle.
  ///
  /// In en, this message translates to:
  /// **'My notes'**
  String get notesTitle;

  /// No description provided for @notesPrivate.
  ///
  /// In en, this message translates to:
  /// **'Only you can see these.'**
  String get notesPrivate;

  /// No description provided for @notesNone.
  ///
  /// In en, this message translates to:
  /// **'Nothing noted. Write a reminder below.'**
  String get notesNone;

  /// No description provided for @notesPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Write a note or reminder'**
  String get notesPlaceholder;

  /// No description provided for @notesRemindOn.
  ///
  /// In en, this message translates to:
  /// **'Remind me on'**
  String get notesRemindOn;

  /// No description provided for @notesAdd.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get notesAdd;

  /// No description provided for @notesToday.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get notesToday;

  /// No description provided for @notesOverdue.
  ///
  /// In en, this message translates to:
  /// **'Was due {date}'**
  String notesOverdue(String date);

  /// No description provided for @notesMarkDone.
  ///
  /// In en, this message translates to:
  /// **'Mark done: {note}'**
  String notesMarkDone(String note);

  /// No description provided for @notesRemove.
  ///
  /// In en, this message translates to:
  /// **'Delete note'**
  String get notesRemove;

  /// No description provided for @movementTitle.
  ///
  /// In en, this message translates to:
  /// **'Fast and slow movers'**
  String get movementTitle;

  /// No description provided for @movementSubtitle.
  ///
  /// In en, this message translates to:
  /// **'What sold in the last {days} days. Fast means {fastMin} or more pieces; slow means some sold, fewer than that; non-moving means none. Non-moving stock is listed first.'**
  String movementSubtitle(String days, String fastMin);

  /// No description provided for @movementWindow.
  ///
  /// In en, this message translates to:
  /// **'Look back'**
  String get movementWindow;

  /// No description provided for @movementWindowDays.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day} other {{n} days}}'**
  String movementWindowDays(num n);

  /// No description provided for @movementFastFrom.
  ///
  /// In en, this message translates to:
  /// **'Fast from (pieces)'**
  String get movementFastFrom;

  /// No description provided for @movementIncludeFabric.
  ///
  /// In en, this message translates to:
  /// **'Include fabric and trims'**
  String get movementIncludeFabric;

  /// No description provided for @movementClassFast.
  ///
  /// In en, this message translates to:
  /// **'Fast'**
  String get movementClassFast;

  /// No description provided for @movementClassSlow.
  ///
  /// In en, this message translates to:
  /// **'Slow'**
  String get movementClassSlow;

  /// No description provided for @movementClassNone.
  ///
  /// In en, this message translates to:
  /// **'Non-moving'**
  String get movementClassNone;

  /// No description provided for @movementItems.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} item} other {{n} items}}'**
  String movementItems(num n);

  /// No description provided for @movementPiecesInStock.
  ///
  /// In en, this message translates to:
  /// **'{n} pieces in stock'**
  String movementPiecesInStock(String n);

  /// No description provided for @movementItem.
  ///
  /// In en, this message translates to:
  /// **'Item'**
  String get movementItem;

  /// No description provided for @movementStatus.
  ///
  /// In en, this message translates to:
  /// **'Movement'**
  String get movementStatus;

  /// No description provided for @movementSold.
  ///
  /// In en, this message translates to:
  /// **'Sold in {days} days'**
  String movementSold(String days);

  /// No description provided for @movementInStock.
  ///
  /// In en, this message translates to:
  /// **'In stock'**
  String get movementInStock;

  /// No description provided for @movementStockValue.
  ///
  /// In en, this message translates to:
  /// **'Stock value'**
  String get movementStockValue;

  /// No description provided for @movementLastSold.
  ///
  /// In en, this message translates to:
  /// **'Last sold'**
  String get movementLastSold;

  /// No description provided for @movementDaysAgo.
  ///
  /// In en, this message translates to:
  /// **'{n, plural, one {{n} day ago} other {{n} days ago}}'**
  String movementDaysAgo(num n);

  /// No description provided for @movementNever.
  ///
  /// In en, this message translates to:
  /// **'Never'**
  String get movementNever;

  /// No description provided for @movementEmpty.
  ///
  /// In en, this message translates to:
  /// **'No stock to show.'**
  String get movementEmpty;

  /// No description provided for @movementFirstRows.
  ///
  /// In en, this message translates to:
  /// **'Showing the first 500 items.'**
  String get movementFirstRows;

  /// Sync screen
  ///
  /// In en, this message translates to:
  /// **'This device was revoked by the business owner. It can no longer sync. Sign out and ask for access again.'**
  String get appDeviceRevoked;

  /// Sync screen
  ///
  /// In en, this message translates to:
  /// **'What works without internet'**
  String get appOfflineRulesTitle;

  /// Refused changes screen
  ///
  /// In en, this message translates to:
  /// **'Refused changes'**
  String get conflictsTitle;

  /// No description provided for @conflictsHelp.
  ///
  /// In en, this message translates to:
  /// **'The server did not accept these changes made on this device. Put the cause right and try again, or set the change aside.'**
  String get conflictsHelp;

  /// No description provided for @conflictsEmpty.
  ///
  /// In en, this message translates to:
  /// **'Nothing was refused.'**
  String get conflictsEmpty;

  /// No description provided for @conflictsReview.
  ///
  /// In en, this message translates to:
  /// **'Review refused changes'**
  String get conflictsReview;

  /// No description provided for @conflictKindVoucher.
  ///
  /// In en, this message translates to:
  /// **'Voucher'**
  String get conflictKindVoucher;

  /// No description provided for @conflictKindCancelVoucher.
  ///
  /// In en, this message translates to:
  /// **'Cancelling a voucher'**
  String get conflictKindCancelVoucher;

  /// No description provided for @conflictKindBill.
  ///
  /// In en, this message translates to:
  /// **'Counter bill'**
  String get conflictKindBill;

  /// No description provided for @conflictKindLeave.
  ///
  /// In en, this message translates to:
  /// **'Leave request'**
  String get conflictKindLeave;

  /// No description provided for @conflictKindAttendance.
  ///
  /// In en, this message translates to:
  /// **'Attendance'**
  String get conflictKindAttendance;

  /// No description provided for @conflictKindClaim.
  ///
  /// In en, this message translates to:
  /// **'Expense claim'**
  String get conflictKindClaim;

  /// No description provided for @conflictKindOrder.
  ///
  /// In en, this message translates to:
  /// **'Customer order'**
  String get conflictKindOrder;

  /// No description provided for @conflictKindOther.
  ///
  /// In en, this message translates to:
  /// **'Change'**
  String get conflictKindOther;

  /// No description provided for @conflictWhy.
  ///
  /// In en, this message translates to:
  /// **'Why: {reason}'**
  String conflictWhy(String reason);

  /// No description provided for @conflictReasonPeriodLocked.
  ///
  /// In en, this message translates to:
  /// **'The books for that date are closed.'**
  String get conflictReasonPeriodLocked;

  /// No description provided for @conflictReasonGstFiled.
  ///
  /// In en, this message translates to:
  /// **'The GST return for that month is already filed.'**
  String get conflictReasonGstFiled;

  /// No description provided for @conflictReasonUnknownAccount.
  ///
  /// In en, this message translates to:
  /// **'An account used here no longer exists.'**
  String get conflictReasonUnknownAccount;

  /// No description provided for @conflictReasonUnknownItem.
  ///
  /// In en, this message translates to:
  /// **'An item used here no longer exists.'**
  String get conflictReasonUnknownItem;

  /// No description provided for @conflictReasonSessionClosed.
  ///
  /// In en, this message translates to:
  /// **'The shift for that counter was closed.'**
  String get conflictReasonSessionClosed;

  /// No description provided for @conflictReasonForbidden.
  ///
  /// In en, this message translates to:
  /// **'You no longer have the right to do this.'**
  String get conflictReasonForbidden;

  /// No description provided for @conflictReasonDeviceRevoked.
  ///
  /// In en, this message translates to:
  /// **'This device was revoked by the owner.'**
  String get conflictReasonDeviceRevoked;

  /// No description provided for @conflictReasonOther.
  ///
  /// In en, this message translates to:
  /// **'The server refused it ({code}).'**
  String conflictReasonOther(String code);

  /// No description provided for @conflictRetry.
  ///
  /// In en, this message translates to:
  /// **'Try again'**
  String get conflictRetry;

  /// No description provided for @conflictDiscard.
  ///
  /// In en, this message translates to:
  /// **'Set aside'**
  String get conflictDiscard;

  /// No description provided for @conflictDiscardAsk.
  ///
  /// In en, this message translates to:
  /// **'Set this change aside?'**
  String get conflictDiscardAsk;

  /// No description provided for @conflictDiscardBody.
  ///
  /// In en, this message translates to:
  /// **'It will be removed from this device and will never reach the books.'**
  String get conflictDiscardBody;

  /// No description provided for @conflictBillNote.
  ///
  /// In en, this message translates to:
  /// **'This bill was already given to the customer. Ask the owner to put it right on the server.'**
  String get conflictBillNote;

  /// No description provided for @conflictAmount.
  ///
  /// In en, this message translates to:
  /// **'{amount}'**
  String conflictAmount(String amount);

  /// No description provided for @toolsTitle.
  ///
  /// In en, this message translates to:
  /// **'Tools'**
  String get toolsTitle;

  /// No description provided for @toolCashEntry.
  ///
  /// In en, this message translates to:
  /// **'Cash and bank entry'**
  String get toolCashEntry;

  /// No description provided for @toolStockAudit.
  ///
  /// In en, this message translates to:
  /// **'Count stock by scanning'**
  String get toolStockAudit;

  /// No description provided for @toolCustomers.
  ///
  /// In en, this message translates to:
  /// **'Customers'**
  String get toolCustomers;

  /// No description provided for @toolReports.
  ///
  /// In en, this message translates to:
  /// **'Reports'**
  String get toolReports;

  /// No description provided for @toolToken.
  ///
  /// In en, this message translates to:
  /// **'Token and slips'**
  String get toolToken;

  /// No description provided for @cashReceived.
  ///
  /// In en, this message translates to:
  /// **'Received'**
  String get cashReceived;

  /// No description provided for @cashPaid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get cashPaid;

  /// No description provided for @cashTransfer.
  ///
  /// In en, this message translates to:
  /// **'Transfer'**
  String get cashTransfer;

  /// No description provided for @cashAccount.
  ///
  /// In en, this message translates to:
  /// **'Cash or bank'**
  String get cashAccount;

  /// No description provided for @cashFrom.
  ///
  /// In en, this message translates to:
  /// **'From'**
  String get cashFrom;

  /// No description provided for @cashTo.
  ///
  /// In en, this message translates to:
  /// **'To'**
  String get cashTo;

  /// No description provided for @cashOther.
  ///
  /// In en, this message translates to:
  /// **'From or to account'**
  String get cashOther;

  /// No description provided for @cashNarration.
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get cashNarration;

  /// No description provided for @cashSave.
  ///
  /// In en, this message translates to:
  /// **'Save entry'**
  String get cashSave;

  /// No description provided for @cashSaved.
  ///
  /// In en, this message translates to:
  /// **'Entry saved.'**
  String get cashSaved;

  /// No description provided for @cashSameAccount.
  ///
  /// In en, this message translates to:
  /// **'Choose two different accounts.'**
  String get cashSameAccount;

  /// No description provided for @auditStore.
  ///
  /// In en, this message translates to:
  /// **'Store: {store}'**
  String auditStore(String store);

  /// No description provided for @auditNoStore.
  ///
  /// In en, this message translates to:
  /// **'This device has not been told which store it counts for. Sync once while online.'**
  String get auditNoStore;

  /// No description provided for @auditNameHint.
  ///
  /// In en, this message translates to:
  /// **'Name of this count (for example Shelf 3)'**
  String get auditNameHint;

  /// No description provided for @auditStart.
  ///
  /// In en, this message translates to:
  /// **'Start counting'**
  String get auditStart;

  /// No description provided for @auditScanHint.
  ///
  /// In en, this message translates to:
  /// **'Scan or type a barcode or SKU'**
  String get auditScanHint;

  /// No description provided for @auditLastScan.
  ///
  /// In en, this message translates to:
  /// **'Counted: {name}'**
  String auditLastScan(String name);

  /// No description provided for @auditCounted.
  ///
  /// In en, this message translates to:
  /// **'{items} items, {pieces} pieces'**
  String auditCounted(int items, int pieces);

  /// No description provided for @auditSubmit.
  ///
  /// In en, this message translates to:
  /// **'Send the count'**
  String get auditSubmit;

  /// No description provided for @auditSent.
  ///
  /// In en, this message translates to:
  /// **'Count saved. It goes to the books at the next sync.'**
  String get auditSent;

  /// No description provided for @auditDiscard.
  ///
  /// In en, this message translates to:
  /// **'Discard'**
  String get auditDiscard;

  /// No description provided for @auditDiscardAsk.
  ///
  /// In en, this message translates to:
  /// **'Throw away this count?'**
  String get auditDiscardAsk;

  /// No description provided for @auditUnknownCode.
  ///
  /// In en, this message translates to:
  /// **'That code matches no item.'**
  String get auditUnknownCode;

  /// No description provided for @auditNothing.
  ///
  /// In en, this message translates to:
  /// **'Nothing has been counted yet.'**
  String get auditNothing;

  /// No description provided for @auditInProgress.
  ///
  /// In en, this message translates to:
  /// **'A count is already in progress.'**
  String get auditInProgress;

  /// No description provided for @auditNotGoods.
  ///
  /// In en, this message translates to:
  /// **'That is not a stocked item.'**
  String get auditNotGoods;

  /// No description provided for @custSearchHint.
  ///
  /// In en, this message translates to:
  /// **'Mobile number or name'**
  String get custSearchHint;

  /// No description provided for @custNone.
  ///
  /// In en, this message translates to:
  /// **'Nobody matches. Enter the full mobile number to look them up online.'**
  String get custNone;

  /// No description provided for @custVisits.
  ///
  /// In en, this message translates to:
  /// **'Visits'**
  String get custVisits;

  /// No description provided for @custSpent.
  ///
  /// In en, this message translates to:
  /// **'Spent'**
  String get custSpent;

  /// No description provided for @custLastLabel.
  ///
  /// In en, this message translates to:
  /// **'Last visit'**
  String get custLastLabel;

  /// No description provided for @custLast.
  ///
  /// In en, this message translates to:
  /// **'last visit {date}'**
  String custLast(String date);

  /// No description provided for @custPoints.
  ///
  /// In en, this message translates to:
  /// **'Points'**
  String get custPoints;

  /// No description provided for @custReturned.
  ///
  /// In en, this message translates to:
  /// **'Returned'**
  String get custReturned;

  /// No description provided for @custTop.
  ///
  /// In en, this message translates to:
  /// **'Buys most'**
  String get custTop;

  /// No description provided for @custRecent.
  ///
  /// In en, this message translates to:
  /// **'Latest bills'**
  String get custRecent;

  /// No description provided for @custCloud.
  ///
  /// In en, this message translates to:
  /// **'From all counters'**
  String get custCloud;

  /// No description provided for @custLocalOnly.
  ///
  /// In en, this message translates to:
  /// **'From this device\'s bills only'**
  String get custLocalOnly;

  /// No description provided for @custBack.
  ///
  /// In en, this message translates to:
  /// **'Back to the list'**
  String get custBack;

  /// No description provided for @reportDaySales.
  ///
  /// In en, this message translates to:
  /// **'Today\'s sales'**
  String get reportDaySales;

  /// No description provided for @reportStock.
  ///
  /// In en, this message translates to:
  /// **'Stock'**
  String get reportStock;

  /// No description provided for @reportReceivables.
  ///
  /// In en, this message translates to:
  /// **'Owed to us'**
  String get reportReceivables;

  /// No description provided for @reportBills.
  ///
  /// In en, this message translates to:
  /// **'Bills'**
  String get reportBills;

  /// No description provided for @reportSales.
  ///
  /// In en, this message translates to:
  /// **'Sales'**
  String get reportSales;

  /// No description provided for @reportItems.
  ///
  /// In en, this message translates to:
  /// **'Items'**
  String get reportItems;

  /// No description provided for @reportParties.
  ///
  /// In en, this message translates to:
  /// **'Parties'**
  String get reportParties;

  /// No description provided for @reportNone.
  ///
  /// In en, this message translates to:
  /// **'No report yet. Connect once to fetch it.'**
  String get reportNone;

  /// No description provided for @reportFetched.
  ///
  /// In en, this message translates to:
  /// **'Fetched at {time}'**
  String reportFetched(String time);

  /// No description provided for @reportOld.
  ///
  /// In en, this message translates to:
  /// **'Old copy from {time}. Connect to refresh.'**
  String reportOld(String time);

  /// No description provided for @tokenPhone.
  ///
  /// In en, this message translates to:
  /// **'Customer\'s mobile (optional)'**
  String get tokenPhone;

  /// No description provided for @tokenNext.
  ///
  /// In en, this message translates to:
  /// **'Give the next token'**
  String get tokenNext;

  /// No description provided for @tokenSent.
  ///
  /// In en, this message translates to:
  /// **'Sent to the customer.'**
  String get tokenSent;

  /// No description provided for @tokenNotSent.
  ///
  /// In en, this message translates to:
  /// **'Not sent. Give the number to the customer.'**
  String get tokenNotSent;

  /// No description provided for @tokenSlips.
  ///
  /// In en, this message translates to:
  /// **'Today\'s bills'**
  String get tokenSlips;

  /// No description provided for @tokenCopy.
  ///
  /// In en, this message translates to:
  /// **'Copy slip'**
  String get tokenCopy;

  /// No description provided for @tokenCopied.
  ///
  /// In en, this message translates to:
  /// **'Slip copied.'**
  String get tokenCopied;

  /// No description provided for @photoTake.
  ///
  /// In en, this message translates to:
  /// **'Photo of the receipt'**
  String get photoTake;

  /// No description provided for @photoRetake.
  ///
  /// In en, this message translates to:
  /// **'Take it again'**
  String get photoRetake;

  /// No description provided for @photoAttached.
  ///
  /// In en, this message translates to:
  /// **'Photo attached. It goes up with the claim.'**
  String get photoAttached;

  /// No description provided for @photoRemove.
  ///
  /// In en, this message translates to:
  /// **'Remove photo'**
  String get photoRemove;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>[
    'as',
    'bn',
    'en',
    'gu',
    'hi',
    'kn',
    'ml',
    'mr',
    'or',
    'pa',
    'ta',
    'te',
  ].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'as':
      return AppLocalizationsAs();
    case 'bn':
      return AppLocalizationsBn();
    case 'en':
      return AppLocalizationsEn();
    case 'gu':
      return AppLocalizationsGu();
    case 'hi':
      return AppLocalizationsHi();
    case 'kn':
      return AppLocalizationsKn();
    case 'ml':
      return AppLocalizationsMl();
    case 'mr':
      return AppLocalizationsMr();
    case 'or':
      return AppLocalizationsOr();
    case 'pa':
      return AppLocalizationsPa();
    case 'ta':
      return AppLocalizationsTa();
    case 'te':
      return AppLocalizationsTe();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
