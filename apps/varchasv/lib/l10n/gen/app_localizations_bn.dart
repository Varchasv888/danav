// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Bengali Bangla (`bn`).
class AppLocalizationsBn extends AppLocalizations {
  AppLocalizationsBn([String locale = 'bn']) : super(locale);

  @override
  String get brandName => 'Varchasv';

  @override
  String get brandFull => 'Varchasv ERP Systems';

  @override
  String get brandTagline =>
      'হিসাব, জিএসটি, স্টক আর বেতন, অনলাইনে ও অফলাইনে, আপনার ভাষায়।';

  @override
  String get commonSave => 'সংরক্ষণ করুন';

  @override
  String get commonSaving => 'সংরক্ষণ হচ্ছে…';

  @override
  String get commonSaved => 'সংরক্ষিত';

  @override
  String get commonCancel => 'বাতিল';

  @override
  String get commonEdit => 'সম্পাদনা';

  @override
  String get commonAdd => 'যোগ করুন';

  @override
  String get commonClose => 'বন্ধ করুন';

  @override
  String get commonLoading => 'লোড হচ্ছে…';

  @override
  String get commonOptional => 'ঐচ্ছিক';

  @override
  String get commonLanguage => 'ভাষা';

  @override
  String get commonTheme => 'থিম';

  @override
  String get commonLight => 'লাইট';

  @override
  String get commonDark => 'ডার্ক';

  @override
  String get commonSystem => 'সিস্টেম';

  @override
  String commonComingSoon(String phase) {
    return 'পর্ব $phase-এ আসছে';
  }

  @override
  String get commonNone => 'কিছু নেই';

  @override
  String get commonYes => 'হ্যাঁ';

  @override
  String get commonNo => 'না';

  @override
  String get commonSearch => 'খুঁজুন';

  @override
  String get commonAll => 'সব';

  @override
  String get commonFrom => 'থেকে';

  @override
  String get commonTo => 'পর্যন্ত';

  @override
  String get commonAsOf => 'তারিখ অনুযায়ী';

  @override
  String get commonTotal => 'মোট';

  @override
  String get commonDebit => 'ডেবিট';

  @override
  String get commonCredit => 'ক্রেডিট';

  @override
  String get commonBalance => 'ব্যালান্স';

  @override
  String get commonDate => 'তারিখ';

  @override
  String get commonNarration => 'বিবরণ';

  @override
  String get commonActions => 'কাজ';

  @override
  String get commonBack => 'ফিরে যান';

  @override
  String get commonApply => 'দেখান';

  @override
  String get commonRemove => 'সরান';

  @override
  String get commonCopy => 'কপি';

  @override
  String get commonCopied => 'কপি হয়েছে';

  @override
  String get commonDr => 'ডে';

  @override
  String get commonCr => 'ক্রে';

  @override
  String get commonView => 'দেখুন';

  @override
  String get commonArchived => 'আর্কাইভ';

  @override
  String get commonPrint => 'প্রিন্ট';

  @override
  String commonListCapped(String count) {
    return 'সর্বশেষ $countটি নথি দেখানো হচ্ছে। পুরনোগুলো দেখতে তারিখ বেছে নিন।';
  }

  @override
  String get authLoginTitle => 'আপনার ব্যবসায় সাইন ইন করুন';

  @override
  String get authLoginSubtitle => 'আবার স্বাগত।';

  @override
  String get authSignupTitle => 'Varchasv-এ আপনার ব্যবসা শুরু করুন';

  @override
  String get authSignupSubtitle =>
      '₹40 লাখের কম টার্নওভারের ব্যবসার জন্য বিনামূল্যে। কার্ড লাগবে না।';

  @override
  String get authEmail => 'ইমেল';

  @override
  String get authPassword => 'পাসওয়ার্ড';

  @override
  String get authPasswordHint => 'অন্তত 8 অক্ষর';

  @override
  String get authName => 'আপনার নাম';

  @override
  String get authBusinessName => 'ব্যবসার নাম';

  @override
  String get authState => 'রাজ্য';

  @override
  String get authGstin => 'জিএসটিআইএন';

  @override
  String get authGstinHint => 'জিএসটি নিবন্ধন না থাকলে খালি রাখুন';

  @override
  String get authIndustry => 'ব্যবসার ধরন';

  @override
  String get authLogin => 'সাইন ইন';

  @override
  String get authSignup => 'অ্যাকাউন্ট তৈরি করুন';

  @override
  String get authLogout => 'সাইন আউট';

  @override
  String get authNoAccount => 'Varchasv-এ নতুন?';

  @override
  String get authHaveAccount => 'আগে থেকেই অ্যাকাউন্ট আছে?';

  @override
  String get authCreateOne => 'অ্যাকাউন্ট তৈরি করুন';

  @override
  String get authSignInInstead => 'সাইন ইন';

  @override
  String get authErrorsInvalidCredentials => 'এই ইমেল আর পাসওয়ার্ড মেলে না।';

  @override
  String get authErrorsEmailTaken => 'এই ইমেলের অ্যাকাউন্ট আগে থেকেই আছে।';

  @override
  String get authErrorsGstinLength => 'জিএসটিআইএন-এ 15টি অক্ষর থাকে।';

  @override
  String get authErrorsGstinFormat => 'এটি জিএসটিআইএন বলে মনে হচ্ছে না।';

  @override
  String get authErrorsGstinState =>
      'জিএসটিআইএন অজানা রাজ্য কোড দিয়ে শুরু হয়েছে।';

  @override
  String get authErrorsGstinChecksum =>
      'এই জিএসটিআইএন-এ টাইপের ভুল আছে: শেষ অক্ষর মিলছে না।';

  @override
  String get authErrorsGstinStateMismatch =>
      'এই জিএসটিআইএন বেছে নেওয়া রাজ্যের নয়, অন্য রাজ্যের।';

  @override
  String get authErrorsValidation => 'চিহ্নিত ঘরগুলো দেখে নিন।';

  @override
  String get authErrorsGeneric => 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'এই লিঙ্কের মেয়াদ শেষ হয়েছে বা আগেই ব্যবহার করা হয়েছে। নতুন লিঙ্ক চান।';

  @override
  String get authErrorsWrongPassword => 'আপনার বর্তমান পাসওয়ার্ড ভুল।';

  @override
  String get authErrorsPasswordsDiffer => 'দুটি পাসওয়ার্ড মিলছে না।';

  @override
  String get authErrorsNeedsChangeDate =>
      'আপনার নথিতে পিছনের তারিখ দেওয়ার অধিকার নেই। আজকের তারিখ দিন, বা মালিকের কাছে অধিকার চান।';

  @override
  String get authErrorsNeedsFutureDate =>
      'আপনার নথিতে ভবিষ্যতের তারিখ দেওয়ার অধিকার নেই। আজকের তারিখ দিন, বা মালিকের কাছে অধিকার চান।';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'একটি লাইনের দাম কেনা দামের চেয়ে কম। আপনার কেনা দামের নিচে বিক্রির অধিকার নেই; দাম বাড়ান বা মালিককে বলুন।';

  @override
  String get authForgotLink => 'পাসওয়ার্ড ভুলে গেছেন?';

  @override
  String get authForgotTitle => 'আপনার পাসওয়ার্ড রিসেট করুন';

  @override
  String get authForgotSubtitle =>
      'আপনার অ্যাকাউন্টের ইমেল দিন, নতুন পাসওয়ার্ড বেছে নেওয়ার জন্য আমরা একটি লিঙ্ক পাঠাব।';

  @override
  String get authSendLink => 'রিসেট লিঙ্ক পাঠান';

  @override
  String authForgotSent(String email) {
    return '$email-এর অ্যাকাউন্ট থাকলে একটি রিসেট লিঙ্ক পাঠানো হচ্ছে। এটি একবারই কাজ করে এবং এক ঘণ্টায় মেয়াদ শেষ হয়।';
  }

  @override
  String get authBackToLogin => 'সাইন ইনে ফিরে যান';

  @override
  String get authResetTitle => 'নতুন পাসওয়ার্ড বেছে নিন';

  @override
  String get authNewPassword => 'নতুন পাসওয়ার্ড';

  @override
  String get authConfirmPassword => 'নতুন পাসওয়ার্ড আবার লিখুন';

  @override
  String get authSetPassword => 'পাসওয়ার্ড সেট করুন';

  @override
  String get authResetDone =>
      'আপনার পাসওয়ার্ড বদলানো হয়েছে এবং সব জায়গা থেকে আপনাকে সাইন আউট করা হয়েছে। নতুন পাসওয়ার্ড দিয়ে সাইন ইন করুন।';

  @override
  String get shellGoTo => 'এখানে যান…';

  @override
  String get shellGoToPlaceholder =>
      'কোনো স্ক্রিন খুলুন বা নতুন এন্ট্রি শুরু করুন';

  @override
  String shellNoMatch(String query) {
    return '“$query”-এর সঙ্গে কিছু মেলেনি।';
  }

  @override
  String get shellTallyKeys =>
      'ট্যালির কী টেক্সট ফিল্ডের বাইরে যেকোনো জায়গায় কাজ করে: F4 কন্ট্রা, F5 পেমেন্ট, F6 রসিদ, F7 জার্নাল, F8 বিক্রি, F9 ক্রয়।';

  @override
  String get shellCreate => 'নতুন';

  @override
  String get shellEntries => 'নতুন এন্ট্রি';

  @override
  String get shellScreens => 'স্ক্রিন';

  @override
  String get shellMenu => 'মেনু';

  @override
  String shellFy(String years) {
    return 'অর্থবর্ষ $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type ভাউচার';
  }

  @override
  String get shellFold => 'মেনু ছোট করুন';

  @override
  String get shellUnfold => 'মেনু খুলুন';

  @override
  String get accountTitle => 'আমার অ্যাকাউন্ট';

  @override
  String get accountSubtitle =>
      'আপনার নাম ও পাসওয়ার্ড, আপনার প্রতিটি ব্যবসার জন্য ব্যবহৃত হয়।';

  @override
  String get accountProfile => 'প্রোফাইল';

  @override
  String get accountSave => 'সংরক্ষণ করুন';

  @override
  String get accountSaved => 'সংরক্ষিত';

  @override
  String get accountPasswordTitle => 'পাসওয়ার্ড বদলান';

  @override
  String get accountCurrentPassword => 'বর্তমান পাসওয়ার্ড';

  @override
  String get accountPasswordChanged =>
      'পাসওয়ার্ড বদলানো হয়েছে। আপনার অন্য ডিভাইসগুলি সাইন আউট করা হয়েছে।';

  @override
  String get industryApparel => 'পোশাক ও বস্ত্র';

  @override
  String get industryGeneral => 'সাধারণ';

  @override
  String get industryTrading => 'ব্যবসা / বিতরণ';

  @override
  String get industryManufacturing => 'উৎপাদন';

  @override
  String get industryRetail => 'খুচরো দোকান';

  @override
  String get industryServices => 'পরিষেবা';

  @override
  String get navDashboard => 'ড্যাশবোর্ড';

  @override
  String get navSales => 'বিক্রি';

  @override
  String get navPurchase => 'কেনা';

  @override
  String get navInventory => 'মাল';

  @override
  String get navAccounts => 'হিসাব';

  @override
  String get navGst => 'জিএসটি';

  @override
  String get navHr => 'এইচআর ও বেতন';

  @override
  String get navReports => 'রিপোর্ট';

  @override
  String get navSettings => 'সেটিংস';

  @override
  String get navCompany => 'কোম্পানি ও শাখা';

  @override
  String get navNumberSeries => 'নম্বর সিরিজ';

  @override
  String get navAuditLog => 'অডিট ট্রেল';

  @override
  String get navTools => 'সরঞ্জাম';

  @override
  String get navTeam => 'দল ও ভূমিকা';

  @override
  String get navChart => 'খাতার তালিকা';

  @override
  String get navVouchers => 'ভাউচার ও কুপন';

  @override
  String get navTrialBalance => 'রেওয়ামিল';

  @override
  String get navProfitLoss => 'লাভ-ক্ষতি';

  @override
  String get navBalanceSheet => 'উদ্বৃত্তপত্র';

  @override
  String get navFinancialYears => 'আর্থিক বছর';

  @override
  String get navItems => 'পণ্য';

  @override
  String get navStock => 'স্টক সারাংশ';

  @override
  String get navStockJournals => 'স্টক জার্নাল';

  @override
  String get navReorder => 'পুনরায় অর্ডার';

  @override
  String get navPurchaseOrders => 'ক্রয় অর্ডার';

  @override
  String get navGoodsReceipts => 'ইনওয়ার্ড চালান';

  @override
  String get navPurchaseBills => 'ক্রয় বিল';

  @override
  String get navPurchaseReturns => 'ক্রয় ফেরত';

  @override
  String get navSalesOrders => 'বিক্রয় অর্ডার';

  @override
  String get navDeliveryNotes => 'ডেলিভারি চালান';

  @override
  String get navSalesInvoices => 'বিক্রয় ইনভয়েস';

  @override
  String get navCreditNotes => 'ক্রেডিট নোট';

  @override
  String get navReceivables => 'পাওনা';

  @override
  String get navPayables => 'দেনা';

  @override
  String get navGstReturns => 'জিএসটি রিটার্ন';

  @override
  String get navGstSettings => 'জিএসটি ও ইনভয়েস';

  @override
  String get navImport => 'ডেটা আমদানি';

  @override
  String get navQuotations => 'কোটেশন';

  @override
  String get navEmployees => 'কর্মচারী';

  @override
  String get navAttendance => 'হাজিরা';

  @override
  String get navLeave => 'ছুটি';

  @override
  String get navPayroll => 'বেতন';

  @override
  String get navPayrollSettings => 'বেতন';

  @override
  String get navStatutory => 'বিধিবদ্ধ ও টিডিএস';

  @override
  String get navManufacturing => 'উৎপাদন';

  @override
  String get navBoms => 'উপকরণ তালিকা (BOM)';

  @override
  String get navProduction => 'উৎপাদন অর্ডার';

  @override
  String get navMrp => 'মাল পরিকল্পনা';

  @override
  String get navJobWork => 'জব ওয়ার্ক';

  @override
  String get navPos => 'পয়েন্ট অফ সেল';

  @override
  String get navPosBilling => 'বিলিং';

  @override
  String get navPosBills => 'বিল';

  @override
  String get navPosSettings => 'কাউন্টার সেটিং';

  @override
  String get navBanking => 'ব্যাংকিং';

  @override
  String get navBankAccounts => 'ব্যাংক মিলন';

  @override
  String get navBankRules => 'ব্যাংক নিয়ম';

  @override
  String get navSettlements => 'গেটওয়ে সেটলমেন্ট';

  @override
  String get navAssets => 'স্থায়ী সম্পদ';

  @override
  String get navAssetRegister => 'সম্পদ রেজিস্টার';

  @override
  String get navDepreciation => 'অবচয়';

  @override
  String get navItDepreciation => 'আয়কর অবচয়';

  @override
  String get navExpenses => 'খরচ';

  @override
  String get navExpenseClaims => 'খরচের দাবি';

  @override
  String get navExpenseCategories => 'খরচের ধরন';

  @override
  String get navProjects => 'প্রকল্প';

  @override
  String get navProjectList => 'প্রকল্প';

  @override
  String get navTimesheets => 'টাইমশিট';

  @override
  String get navAssistant => 'সহকারী';

  @override
  String get navCrm => 'সিআরএম';

  @override
  String get navLeads => 'লিড';

  @override
  String get navFollowUps => 'ফলো-আপ';

  @override
  String get navMessageTemplates => 'বার্তার টেমপ্লেট';

  @override
  String get navReportBuilder => 'রিপোর্ট বিল্ডার';

  @override
  String get navSavedReports => 'সংরক্ষিত রিপোর্ট';

  @override
  String get navChecks => 'যাচাই';

  @override
  String get navStyles => 'স্টাইল';

  @override
  String get navProformas => 'প্রোফর্মা ইনভয়েস';

  @override
  String get navApprovals => 'অনুমোদনে পাঠানো মাল';

  @override
  String get navPriceLists => 'মূল্য তালিকা';

  @override
  String get navInterest => 'বকেয়ার উপর সুদ';

  @override
  String get navAgents => 'এজেন্ট কমিশন';

  @override
  String get navTargets => 'সেলসম্যান লক্ষ্য';

  @override
  String get navSchemes => 'স্কিম ও অফার';

  @override
  String get navPosReturns => 'ফেরত ও বদল';

  @override
  String get navAlterations => 'অল্টারেশন';

  @override
  String get navTailoring => 'দর্জির কাজ';

  @override
  String get navConsignment => 'কনসাইনমেন্ট';

  @override
  String get navCatalogue => 'ছবির ক্যাটালগ';

  @override
  String get navInsights => 'ব্যবসার বিশ্লেষণ';

  @override
  String get navSalesRegister => 'বিক্রির রেজিস্টার';

  @override
  String get navColourSize => 'রং-সাইজ রিপোর্ট';

  @override
  String get navStockAgeing => 'স্টকের বয়স';

  @override
  String get navLabels => 'বারকোড লেবেল';

  @override
  String get navMessageLog => 'হোয়াটসঅ্যাপ লগ';

  @override
  String get navMyMenu => 'আমার মেনু';

  @override
  String get navAllActions => 'সব কাজ';

  @override
  String get navStockCounts => 'স্টক গণনা';

  @override
  String get navWorkspace => 'কর্মক্ষেত্র';

  @override
  String get navSalesPos => 'বিক্রি ও কাউন্টার';

  @override
  String get navPromotions => 'অফার ও দাম';

  @override
  String get navFinance => 'হিসাব ও ব্যাংকিং';

  @override
  String get navOperations => 'খরচ, প্রকল্প ও সম্পদ';

  @override
  String get navMasters => 'মাস্টার';

  @override
  String get navReportsHub => 'সব রিপোর্ট';

  @override
  String get navMastersHub => 'সব মাস্টার';

  @override
  String get navSizesColours => 'সাইজ ও রং';

  @override
  String get navBandWorkspace => 'কর্মক্ষেত্র';

  @override
  String get navBandCommerce => 'বিক্রি';

  @override
  String get navBandSupply => 'ক্রয় ও স্টক';

  @override
  String get navBandProduction => 'উৎপাদন ও পরিচালনা';

  @override
  String get navBandMoney => 'অর্থ ও মানুষ';

  @override
  String get navBandInsight => 'রিপোর্ট';

  @override
  String get navBandAdmin => 'সেটআপ';

  @override
  String get navIntegrity => 'সামঞ্জস্য যাচাই';

  @override
  String get navCfoView => 'মালিকের দৃষ্টি';

  @override
  String get navStockMovement => 'দ্রুত ও ধীরে বিক্রি হওয়া পণ্য';

  @override
  String dashboardGreeting(String name) {
    return 'নমস্কার, $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return 'আজ $business কোথায় দাঁড়িয়ে আছে দেখুন।';
  }

  @override
  String get dashboardSetupTitle => 'সেটআপ শেষ করুন';

  @override
  String get dashboardSetupCompany => 'কোম্পানির তথ্য ও প্যান যোগ করুন';

  @override
  String get dashboardSetupBranch => 'প্রতিটি শাখার জিএসটিআইএন যোগ করুন';

  @override
  String get dashboardSetupSeries => 'আপনার ইনভয়েস নম্বর সিরিজ দেখে নিন';

  @override
  String get dashboardRoadmapTitle => 'কী আসছে';

  @override
  String get dashboardCalcTitle => 'দ্রুত জিএসটি ক্যালকুলেটর';

  @override
  String get dashboardCalcSubtitle =>
      'সরবরাহের স্থান থেকে CGST/SGST বা IGST হিসাব করে।';

  @override
  String get dashboardKSalesToday => 'আজকের বিক্রি';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'গতকাল $amount';
  }

  @override
  String get dashboardKSalesMonth => 'এই মাসের বিক্রি';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'গত মাসের একই দিন পর্যন্ত $amount';
  }

  @override
  String get dashboardKReceivables => 'পাওনা';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount মেয়াদোত্তীর্ণ';
  }

  @override
  String get dashboardKPayables => 'দেনা';

  @override
  String dashboardKDueSoon(String amount) {
    return '7 দিনের মধ্যে $amount দিতে হবে';
  }

  @override
  String get dashboardKProfit => 'এই মাসের লাভ';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'মোট লাভ $amount';
  }

  @override
  String get dashboardKStockValue => 'স্টকের মূল্য';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি পণ্য',
      one: '$countটি পণ্য',
    );
    return '$_temp0 পুনরায় অর্ডার স্তরের নিচে';
  }

  @override
  String get dashboardKPipeline => 'বিক্রির পাইপলাইন';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$countটি খোলা লিড · ওজনযুক্ত $amount';
  }

  @override
  String get dashboardKApprovals => 'আপনার অপেক্ষায়';

  @override
  String get dashboardKClaims => 'খরচের দাবি';

  @override
  String get dashboardKTimesheets => 'টাইমশিট';

  @override
  String get dashboardKLeave => 'ছুটির আবেদন';

  @override
  String get dashboardKNothingWaiting => 'কিছু অপেক্ষায় নেই।';

  @override
  String get dashboardKSalesTrend => 'বিক্রি, গত 30 দিন';

  @override
  String get dashboardKCashBank => 'নগদ ও ব্যাংক';

  @override
  String get dashboardKTopCustomers => 'এই মাসের প্রধান গ্রাহক';

  @override
  String get dashboardKTopItems => 'এই মাসে সবচেয়ে বেশি বিক্রি';

  @override
  String get dashboardKTopDebtors => 'আদায়ের সবচেয়ে বড় অঙ্ক';

  @override
  String get dashboardKAlerts => 'নজর দিন';

  @override
  String get dashboardKNoAlerts => 'সব ঠিক আছে।';

  @override
  String get dashboardKAsk => 'সহকারীকে জিজ্ঞাসা করুন';

  @override
  String dashboardKYesterday(String amount) {
    return 'গতকাল $amount';
  }

  @override
  String get dashboardPosition => 'টাকার অবস্থা';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি অ্যাকাউন্ট',
      one: '$countটি অ্যাকাউন্ট',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'ব্যবসার বিশ্লেষণ';

  @override
  String get insightsSubtitle =>
      'যেকোনো সময়ের বিক্রি, লাভ, স্টক ও টাকা, গত বছরের একই সময়ের সঙ্গে তুলনা।';

  @override
  String get insightsNoLastYear => 'এ বছর নতুন';

  @override
  String get insightsPts => 'পয়েন্ট';

  @override
  String get insightsVsLastYear => 'গত বছরের তুলনায়';

  @override
  String get insightsNoSales => 'এই সময়ে কোনো বিক্রি নেই।';

  @override
  String get insightsHideTable => 'সারণি লুকান';

  @override
  String get insightsShowTable => 'সারণিতে দেখুন';

  @override
  String get insightsPresetsThisMonth => 'এই মাস';

  @override
  String get insightsPresetsLastMonth => 'গত মাস';

  @override
  String get insightsPresetsThisFy => 'এই অর্থবছর';

  @override
  String get insightsPresetsLastFy => 'গত অর্থবছর';

  @override
  String get insightsPresetsLast12 => 'গত 12 মাস';

  @override
  String get insightsFrom => 'থেকে';

  @override
  String get insightsTo => 'পর্যন্ত';

  @override
  String get insightsApply => 'দেখান';

  @override
  String insightsCompared(String from, String to) {
    return 'পরিবর্তন $from থেকে $to-এর তুলনায়।';
  }

  @override
  String get insightsKpiSales => 'বিক্রি';

  @override
  String get insightsKpiPieces => 'বিক্রি পিস';

  @override
  String get insightsKpiAvgBill => 'গড় বিল';

  @override
  String get insightsKpiProfit => 'মার্জিন';

  @override
  String get insightsKpiPurchases => 'ক্রয়';

  @override
  String get insightsKpiStock => 'এখনকার স্টক';

  @override
  String get insightsKpiReceivable => 'আদায় বাকি';

  @override
  String get insightsKpiPayable => 'দেওয়া বাকি';

  @override
  String get insightsBeforeTax => 'GST-এর আগে, ফেরত বাদে';

  @override
  String insightsBillsCount(String n) {
    return 'বিল: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return 'পিস প্রতি $v';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n পিস';
  }

  @override
  String get insightsOwedToUs => 'গ্রাহকদের কাছে';

  @override
  String get insightsWeOwe => 'সরবরাহকারীদের';

  @override
  String get insightsTrend => 'বিক্রির প্রবণতা';

  @override
  String get insightsByMonth => 'মাস অনুযায়ী, GST-এর আগে';

  @override
  String get insightsByDay => 'দিন অনুযায়ী, GST-এর আগে';

  @override
  String get insightsWeekday => 'ব্যস্ত দিন';

  @override
  String get insightsWeekdaySub => 'সপ্তাহের দিন অনুযায়ী বিক্রি';

  @override
  String get insightsDaysD1 => 'সোম';

  @override
  String get insightsDaysD2 => 'মঙ্গল';

  @override
  String get insightsDaysD3 => 'বুধ';

  @override
  String get insightsDaysD4 => 'বৃহঃ';

  @override
  String get insightsDaysD5 => 'শুক্র';

  @override
  String get insightsDaysD6 => 'শনি';

  @override
  String get insightsDaysD7 => 'রবি';

  @override
  String get insightsDesigns => 'সেরা ডিজাইন';

  @override
  String get insightsByValue => 'বিক্রির মূল্য অনুযায়ী';

  @override
  String get insightsSalesmen => 'সেরা সেলসম্যান';

  @override
  String get insightsSalesmenSub => 'তাদের বিক্রি করা কাউন্টার লাইন ও ইনভয়েস';

  @override
  String get insightsNoSalesmen => 'এখনও কোনো বিক্রিতে সেলসম্যান নেই।';

  @override
  String get insightsCustomers => 'বড় গ্রাহক';

  @override
  String get insightsCustomersSub => 'ইনভয়েস করা গ্রাহক, ফেরত বাদে';

  @override
  String get insightsBrands => 'ব্র্যান্ড';

  @override
  String get insightsTenders => 'গ্রাহকরা কীভাবে দিলেন';

  @override
  String get insightsTendersSub => 'GST সহ: কাউন্টারের পেমেন্ট ও বাকির ইনভয়েস';

  @override
  String get insightsModesCash => 'নগদ';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'কার্ড';

  @override
  String get insightsModesCredit => 'কাউন্টার বাকি';

  @override
  String get insightsModesInvoice => 'ইনভয়েস';

  @override
  String get insightsAgeing => 'বিক্রির বয়স';

  @override
  String get insightsAgeingSub => 'বিক্রির আগে মাল কতদিন ছিল';

  @override
  String get insightsAge => 'বয়স';

  @override
  String get insightsPieces => 'পিস';

  @override
  String get insightsValue => 'মূল্য';

  @override
  String get insightsAgesD030 => '0 থেকে 30 দিন';

  @override
  String get insightsAgesD3160 => '31 থেকে 60 দিন';

  @override
  String get insightsAgesD6190 => '61 থেকে 90 দিন';

  @override
  String get insightsAgesD91180 => '91 থেকে 180 দিন';

  @override
  String get insightsAgesD181365 => '6 থেকে 12 মাস';

  @override
  String get insightsAgesY12 => '1 থেকে 2 বছর';

  @override
  String get insightsAgesY2plus => '2 বছরের বেশি';

  @override
  String get insightsErrorsInvalidPeriod => 'শুরুর তারিখ শেষের পরে।';

  @override
  String insightsOnCost(String v) {
    return 'মানক খরচের চেয়ে $v বেশি';
  }

  @override
  String get calcFrom => 'সরবরাহকারীর রাজ্য';

  @override
  String get calcTo => 'সরবরাহের স্থান';

  @override
  String get calcQty => 'পরিমাণ';

  @override
  String get calcRate => 'দর (₹)';

  @override
  String get calcGstRate => 'জিএসটি %';

  @override
  String get calcTaxable => 'করযোগ্য মূল্য';

  @override
  String get calcCgst => 'CGST';

  @override
  String get calcSgst => 'SGST';

  @override
  String get calcUtgst => 'UTGST';

  @override
  String get calcIgst => 'IGST';

  @override
  String get calcRoundOff => 'রাউন্ড অফ';

  @override
  String get calcTotal => 'মোট';

  @override
  String get calcInWords => 'কথায়';

  @override
  String get calcCess => 'সেস';

  @override
  String get companyTitle => 'কোম্পানি ও শাখা';

  @override
  String get companySubtitle =>
      'আইনি তথ্য এবং প্রতিটি জিএসটিআইএন বা স্থানের জন্য একটি শাখা।';

  @override
  String get companyName => 'প্রদর্শিত নাম';

  @override
  String get companyLegalName => 'আইনি নাম';

  @override
  String get companyPan => 'প্যান';

  @override
  String get companyBooksBegin => 'হিসাব শুরুর তারিখ';

  @override
  String get companyBranches => 'শাখা';

  @override
  String get companyAddBranch => 'শাখা যোগ করুন';

  @override
  String get companyBranchName => 'শাখার নাম';

  @override
  String get companyHeadOffice => 'প্রধান কার্যালয়';

  @override
  String get companyUnregistered => 'নিবন্ধিত নয়';

  @override
  String get companyCity => 'শহর';

  @override
  String get companyPincode => 'পিন কোড';

  @override
  String get seriesTitle => 'নম্বর সিরিজ';

  @override
  String get seriesSubtitle =>
      'ইনভয়েস ও ভাউচারের নম্বর কীভাবে হয়। জিএসটি সর্বোচ্চ 16 অক্ষর অনুমোদন করে: অক্ষর, অঙ্ক, - এবং /।';

  @override
  String get seriesDocType => 'নথি';

  @override
  String get seriesPattern => 'প্যাটার্ন';

  @override
  String get seriesNext => 'পরের নম্বর';

  @override
  String get seriesFy => 'আর্থিক বছর';

  @override
  String get seriesTokens =>
      'টোকেন: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = ডিভাইস কোড (অফলাইন অ্যাপ)';

  @override
  String get seriesTypesSalesInvoice => 'বিক্রয় ইনভয়েস';

  @override
  String get seriesTypesCreditNote => 'ক্রেডিট নোট';

  @override
  String get seriesTypesDebitNote => 'ডেবিট নোট';

  @override
  String get seriesTypesPurchaseBill => 'ক্রয় বিল';

  @override
  String get seriesTypesReceipt => 'প্রাপ্তি';

  @override
  String get seriesTypesPayment => 'প্রদান';

  @override
  String get seriesTypesJournal => 'জার্নাল ভাউচার';

  @override
  String get seriesErrorsSeriesTooLong =>
      'এই প্যাটার্নের নম্বর 16 অক্ষর ছাড়িয়ে যাবে।';

  @override
  String get seriesErrorsSeriesBadChars => 'শুধু অক্ষর, অঙ্ক, - এবং / চলবে।';

  @override
  String get seriesErrorsSeriesEmpty => 'প্যাটার্নে SEQ টোকেন থাকতে হবে।';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'পরের নম্বর ইতিমধ্যে দেওয়া নম্বরের চেয়ে কম হতে পারে না।';

  @override
  String get auditTitle => 'অডিট ট্রেল';

  @override
  String get auditSubtitle =>
      'প্রতিটি পরিবর্তন, কে করেছে এবং কখন। এন্ট্রি বদলানো বা মোছা যায় না।';

  @override
  String get auditWhen => 'কখন';

  @override
  String get auditWho => 'কে';

  @override
  String get auditWhat => 'কী';

  @override
  String get auditDetails => 'বিস্তারিত';

  @override
  String get auditLoadMore => 'পুরোনো এন্ট্রি দেখুন';

  @override
  String get auditActionsCreate => 'তৈরি করেছেন';

  @override
  String get auditActionsUpdate => 'বদলেছেন';

  @override
  String get auditActionsLogin => 'সাইন ইন করেছেন';

  @override
  String get auditActionsDelete => 'মুছেছেন';

  @override
  String get auditActionsCancel => 'বাতিল করেছেন';

  @override
  String get auditVerify => 'অডিট ট্রেইল যাচাই করুন';

  @override
  String get auditVerifying => 'যাচাই হচ্ছে...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'সব $nটি এন্ট্রি অক্ষত আছে। কিছু বদলানো বা সরানো হয়নি।',
      one: 'সব $nটি এন্ট্রি অক্ষত আছে। কিছু বদলানো বা সরানো হয়নি।',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'এন্ট্রি নম্বর $seq আগের এন্ট্রির সঙ্গে মেলে না ($reason)। অডিট ট্রেইল বদলানো বা নষ্ট হয়েছে। একটি কপি রাখুন এবং সহায়তার সঙ্গে যোগাযোগ করুন।';
  }

  @override
  String get auditReasonGap => 'একটি এন্ট্রি নেই';

  @override
  String get auditReasonLink => 'ক্রম ভেঙে গেছে';

  @override
  String get auditReasonContent => 'এন্ট্রি বদলানো হয়েছে';

  @override
  String get auditVerifyFailed => 'যাচাই করা যায়নি। আবার চেষ্টা করুন।';

  @override
  String get backupTitle => 'ব্যাকআপ ও এক্সপোর্ট';

  @override
  String get backupSubtitle =>
      'আপনার ডেটা আপনারই। যখন খুশি পুরোটা ডাউনলোড করুন, Varchasv ছাড়াও খোলা যায় এমন ফাইলে।';

  @override
  String get backupDownload => 'সব ডাউনলোড করুন (ZIP)';

  @override
  String get backupWhat => 'আপনি কী পাবেন';

  @override
  String get backupItem1 =>
      'প্রতিটি টেবিল Excel-এর জন্য CSV ফাইলে এবং সঠিক মান সহ JSON ফাইলে।';

  @override
  String get backupItem2 => 'আপনার আপলোড করা প্রতিটি নথি যেমন ছিল তেমনই।';

  @override
  String get backupItem3 =>
      'প্রতিটি টেবিল ব্যাখ্যা করা README, আর চেকসামের তালিকা যাতে পরে দেখানো যায় কিছু বদলায়নি।';

  @override
  String get backupLeftOut =>
      'পাসওয়ার্ড, লগইন টোকেন ও কর-পোর্টালের সেশন বাদ দেওয়া হয়েছে।';

  @override
  String get backupKeep =>
      'ফাইলটি নিরাপদ জায়গায় রাখুন। এতে আপনার গ্রাহক, সরবরাহকারী, দাম ও হিসাব আছে।';

  @override
  String get backupSlow => 'বড় ব্যবসার ক্ষেত্রে তৈরি হতে এক মিনিট লাগতে পারে।';

  @override
  String get backupAuditLink => 'আপনার অডিট ট্রেইল অক্ষত কিনা যাচাই করুন';

  @override
  String get roadmapAccounts => 'হিসাব ও জিএসটি ফাইলিং';

  @override
  String get roadmapInventory => 'মাল ও ক্রয়';

  @override
  String get roadmapSales => 'বিক্রি, ই-ইনভয়েস ও ই-ওয়ে বিল';

  @override
  String get roadmapOffline =>
      'Windows, Mac, Linux, Android ও iOS-এর জন্য অফলাইন অ্যাপ';

  @override
  String get roadmapPayroll => 'এইচআর ও বেতন';

  @override
  String get switcherTitle => 'আপনার ব্যবসা';

  @override
  String get switcherAddBusiness => 'ব্যবসা যোগ করুন';

  @override
  String get switcherCreate => 'ব্যবসা তৈরি করুন';

  @override
  String get teamTitle => 'দল ও ভূমিকা';

  @override
  String get teamSubtitle =>
      'কে এই ব্যবসা ব্যবহার করতে পারে এবং প্রত্যেকে কী করতে পারে।';

  @override
  String get teamMembers => 'সদস্য';

  @override
  String get teamInvite => 'আমন্ত্রণ';

  @override
  String get teamInviteTitle => 'কাউকে আমন্ত্রণ জানান';

  @override
  String get teamEmail => 'ইমেল';

  @override
  String get teamRole => 'ভূমিকা';

  @override
  String get teamStatus => 'অবস্থা';

  @override
  String get teamActive => 'সক্রিয়';

  @override
  String get teamSuspended => 'স্থগিত';

  @override
  String get teamYou => 'আপনি';

  @override
  String get teamPendingInvites => 'বাকি আমন্ত্রণ';

  @override
  String get teamExpires => 'মেয়াদ শেষ';

  @override
  String get teamRevoke => 'প্রত্যাহার';

  @override
  String get teamSuspend => 'স্থগিত করুন';

  @override
  String get teamReactivate => 'আবার সক্রিয় করুন';

  @override
  String get teamRemove => 'সরান';

  @override
  String get teamInviteLink => 'আমন্ত্রণ লিংক';

  @override
  String get teamInviteLinkHint =>
      'আমরা ইমেল করে দিয়েছি। WhatsApp-এও পাঠাতে পারেন: এটি একবারই কাজ করে এবং 7 দিনে মেয়াদ শেষ হয়।';

  @override
  String get teamRoles => 'ভূমিকা';

  @override
  String get teamNewRole => 'নতুন ভূমিকা';

  @override
  String get teamRoleName => 'ভূমিকার নাম';

  @override
  String get teamPermissions => 'অনুমতি';

  @override
  String get teamSystemRole => 'বিল্ট-ইন';

  @override
  String teamMembersCount(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count জন সদস্য',
      one: '$count জন সদস্য',
    );
    return '$_temp0';
  }

  @override
  String get teamModulesCompany => 'কোম্পানি';

  @override
  String get teamModulesUsers => 'দল';

  @override
  String get teamModulesAccounts => 'হিসাব';

  @override
  String get teamModulesSales => 'বিক্রি';

  @override
  String get teamModulesPurchase => 'কেনা';

  @override
  String get teamModulesInventory => 'মাল';

  @override
  String get teamModulesGst => 'জিএসটি';

  @override
  String get teamModulesHr => 'এইচআর';

  @override
  String get teamModulesPayroll => 'বেতন';

  @override
  String get teamModulesReports => 'রিপোর্ট';

  @override
  String get teamModulesSettings => 'সেটিংস';

  @override
  String get teamModulesBanking => 'ব্যাংকিং';

  @override
  String get teamModulesAssets => 'স্থায়ী সম্পদ';

  @override
  String get teamModulesExpenses => 'খরচ';

  @override
  String get teamModulesProjects => 'প্রকল্প';

  @override
  String get teamModulesCrm => 'সিআরএম';

  @override
  String get teamPermView => 'দেখা';

  @override
  String get teamPermCreate => 'তৈরি';

  @override
  String get teamPermEdit => 'সম্পাদনা';

  @override
  String get teamPermSubmit => 'জমা';

  @override
  String get teamPermCancel => 'বাতিল';

  @override
  String get teamPermDelete => 'মোছা';

  @override
  String get teamPermExport => 'রপ্তানি';

  @override
  String get teamPermApprove => 'অনুমোদন';

  @override
  String get teamErrorsCannotChangeSelf =>
      'আপনি নিজের অ্যাক্সেস বদলাতে পারবেন না।';

  @override
  String get teamErrorsLastOwner =>
      'ব্যবসায় অন্তত একজন সক্রিয় মালিক থাকতে হবে।';

  @override
  String get teamErrorsOwnerOnly => 'শুধু মালিক এটি করতে পারেন।';

  @override
  String get teamErrorsAlreadyMember => 'এই ব্যক্তি আগে থেকেই সদস্য।';

  @override
  String get teamErrorsPermissionEscalation =>
      'যে অনুমতি আপনার নিজের নেই তা দিতে পারবেন না।';

  @override
  String get teamErrorsSystemRole => 'বিল্ট-ইন ভূমিকা বদলানো যায় না।';

  @override
  String get teamErrorsRoleInUse =>
      'এই ভূমিকা মোছার আগে সদস্যদের অন্য ভূমিকায় সরান।';

  @override
  String get teamErrorsUnknownRole => 'সেই ভূমিকা আর নেই।';

  @override
  String get teamSpecialTitle => 'বিশেষ অধিকার';

  @override
  String get teamSpecialHelp =>
      'উপরের ছকের বাইরে এক-একটি অধিকার। কেউ বিল করতে পারে কিন্তু পিছনের তারিখ বা কেনা দামের নিচে বিক্রি করতে পারে না।';

  @override
  String get teamSpecialChangeDate => 'নথিতে পিছনের তারিখ দেওয়া';

  @override
  String get teamSpecialFutureDate => 'নথিতে ভবিষ্যতের তারিখ দেওয়া';

  @override
  String get teamSpecialSellBelowCost => 'কেনা দামের নিচে বিক্রি';

  @override
  String get teamSpecialSeeAgentCommission => 'এজেন্ট কমিশন দেখা';

  @override
  String get teamSpecialImportData => 'ডেটা আমদানি';

  @override
  String inviteTitle(String business) {
    return '$business-এ যোগ দিন';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$email-কে $role হিসেবে আমন্ত্রণ জানানো হয়েছে।';
  }

  @override
  String get inviteCreateAccount => 'গ্রহণ করতে আপনার অ্যাকাউন্ট তৈরি করুন।';

  @override
  String get inviteSignInToAccept =>
      'গ্রহণ করতে আপনার Varchasv পাসওয়ার্ড দিন।';

  @override
  String get inviteAccept => 'আমন্ত্রণ গ্রহণ করুন';

  @override
  String get inviteInvalid =>
      'এই আমন্ত্রণ লিংক অবৈধ, ব্যবহৃত বা মেয়াদোত্তীর্ণ। নতুন একটি চেয়ে নিন।';

  @override
  String get accountsTitle => 'খাতার তালিকা';

  @override
  String get accountsSubtitle =>
      'আপনার হিসাবরক্ষক যেভাবে চান সেভাবে সাজানো খাতা। গ্রাহকরা Sundry Debtors-এর অধীনে, সরবরাহকারীরা Sundry Creditors-এর অধীনে।';

  @override
  String get accountsNewAccount => 'নতুন খাতা';

  @override
  String get accountsName => 'খাতার নাম';

  @override
  String get accountsNameHi => 'হিন্দিতে নাম';

  @override
  String get accountsGroup => 'গ্রুপ';

  @override
  String get accountsBalance => 'ব্যালান্স';

  @override
  String get accountsOpeningBalance => 'প্রারম্ভিক ব্যালান্স';

  @override
  String get accountsOpeningHint =>
      'ডেবিটের জন্য ধনাত্মক (নগদ, ব্যাংক, দেনাদার); ক্রেডিটের জন্য ঋণাত্মক (মূলধন, ঋণ, পাওনাদার)।';

  @override
  String get accountsCode => 'কোড';

  @override
  String get accountsParty => 'পক্ষের তথ্য';

  @override
  String get accountsPhone => 'ফোন';

  @override
  String get accountsIfsc => 'IFSC';

  @override
  String get accountsAccountNumber => 'অ্যাকাউন্ট নম্বর';

  @override
  String get accountsAllGroups => 'সব গ্রুপ';

  @override
  String get accountsEmpty => 'কোনো খাতা মেলেনি।';

  @override
  String get accountsErrorsAccountNameTaken => 'এই নামের খাতা আগে থেকেই আছে।';

  @override
  String get accountsErrorsUnknownGroup => 'একটি গ্রুপ বেছে নিন।';

  @override
  String get accountsErrorsInvalidIfsc => 'IFSC দেখতে এরকম: HDFC0001234।';

  @override
  String get accountsErrorsInvalidPan => 'প্যান দেখতে এরকম: ABCDE1234F।';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'বিল্ট-ইন খাতা নিজের গ্রুপেই থাকে।';

  @override
  String get accountsErrorsNotAnAgent =>
      'দালাল বা এজেন্ট হিসেবে চিহ্নিত খাতা বাছুন।';

  @override
  String get accountsErrorsUnknownSalesman =>
      'আপনার কর্মীদের মধ্যে থেকে সেলসম্যান বাছুন।';

  @override
  String get accountsCreditLimit => 'ধারের সীমা (₹)';

  @override
  String get accountsCreditDays => 'ধারের দিন';

  @override
  String get accountsCreditControl => 'সীমা ছাড়ালে বা বকেয়া থাকলে';

  @override
  String get accountsCreditControlHint =>
      'ব্লক করলে মালিক বা অ্যাডমিন অনুমতি না দেওয়া পর্যন্ত নতুন বিক্রি বন্ধ থাকে।';

  @override
  String get accountsCreditWarn => 'সতর্ক করে অনুমতি';

  @override
  String get accountsCreditBlock => 'ব্লক';

  @override
  String get accountsBlockOverdueDays => 'অনুমোদিত বকেয়া দিন';

  @override
  String get accountsInterestRate => 'বকেয়ার উপর সুদ (% বার্ষিক)';

  @override
  String get vouchersTitle => 'ভাউচার';

  @override
  String get vouchersSubtitle =>
      'আপনার হিসাবের প্রতিটি এন্ট্রি। পোস্ট করা ভাউচার কখনো বদলায় না: বাতিল করে আবার লিখুন।';

  @override
  String get vouchersNew => 'নতুন ভাউচার';

  @override
  String get vouchersTypesJournal => 'জার্নাল';

  @override
  String get vouchersTypesPayment => 'প্রদান';

  @override
  String get vouchersTypesReceipt => 'প্রাপ্তি';

  @override
  String get vouchersTypesContra => 'কন্ট্রা';

  @override
  String get vouchersTypesPurchase => 'ক্রয়';

  @override
  String get vouchersTypesDebitNote => 'ডেবিট নোট';

  @override
  String get vouchersTypesSales => 'বিক্রয়';

  @override
  String get vouchersTypesCreditNote => 'ক্রেডিট নোট';

  @override
  String get vouchersTypesGatewaySettlement => 'গেটওয়ে সেটলমেন্ট';

  @override
  String get vouchersTypesAssetPurchase => 'সম্পদ ক্রয়';

  @override
  String get vouchersTypesDepreciation => 'অবচয়';

  @override
  String get vouchersTypesAssetDisposal => 'সম্পদ বিক্রি';

  @override
  String get vouchersTypesExpenseClaim => 'খরচের দাবি';

  @override
  String get vouchersTypesBrokerage => 'দালালি বিল';

  @override
  String get vouchersTypeHintsJournal =>
      'সমন্বয়, ধারে বিক্রি ও কেনা, সংস্থান।';

  @override
  String get vouchersTypeHintsPayment =>
      'নগদ বা ব্যাংক থেকে বেরিয়ে যাওয়া টাকা।';

  @override
  String get vouchersTypeHintsReceipt => 'নগদ বা ব্যাংকে আসা টাকা।';

  @override
  String get vouchersTypeHintsContra => 'শুধু নগদ ও ব্যাংক খাতার মধ্যে।';

  @override
  String get vouchersNumber => 'নম্বর';

  @override
  String get vouchersReference => 'রেফারেন্স';

  @override
  String get vouchersAccount => 'খাতা';

  @override
  String get vouchersAccounts => 'খাতা';

  @override
  String get vouchersAmount => 'অঙ্ক';

  @override
  String get vouchersAddLine => 'লাইন যোগ করুন';

  @override
  String get vouchersDifference => 'পার্থক্য';

  @override
  String get vouchersPost => 'ভাউচার পোস্ট করুন';

  @override
  String get vouchersCancel => 'ভাউচার বাতিল করুন';

  @override
  String get vouchersCancelReason => 'বাতিলের কারণ';

  @override
  String get vouchersCancelled => 'বাতিল';

  @override
  String get vouchersPosted => 'পোস্ট হয়েছে';

  @override
  String get vouchersStatus => 'অবস্থা';

  @override
  String get vouchersEmpty => 'এই সময়ে কোনো ভাউচার নেই।';

  @override
  String get vouchersChooseAccount => 'খাতা বেছে নিন…';

  @override
  String get vouchersErrorsUnbalanced => 'ডেবিট ও ক্রেডিট সমান হতে হবে।';

  @override
  String get vouchersErrorsTooFewLines => 'ভাউচারে অন্তত দুটি লাইন লাগে।';

  @override
  String get vouchersErrorsZeroLine => 'প্রতিটি লাইনে অঙ্ক দিন।';

  @override
  String get vouchersErrorsBothSides =>
      'একটি লাইন ডেবিট বা ক্রেডিট হতে পারে, দুটোই নয়।';

  @override
  String get vouchersErrorsNegativeAmount => 'অঙ্ক ঋণাত্মক হতে পারে না।';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'প্রদানে নগদ বা ব্যাংক খাতা ক্রেডিট হতে হবে।';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'প্রাপ্তিতে নগদ বা ব্যাংক খাতা ডেবিট হতে হবে।';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'কন্ট্রা ভাউচারে শুধু নগদ ও ব্যাংক খাতা চলে।';

  @override
  String get vouchersErrorsPeriodLocked => 'এই তারিখ লক করা সময়ের মধ্যে।';

  @override
  String get vouchersErrorsPeriodClosed => 'এই আর্থিক বছর বন্ধ।';

  @override
  String get vouchersErrorsBeforeBooksBegin => 'এই তারিখ হিসাব শুরুর আগের।';

  @override
  String get vouchersErrorsAlreadyCancelled => 'এই ভাউচার আগেই বাতিল।';

  @override
  String get vouchersErrorsUnknownAccount => 'একটি খাতা আর নেই।';

  @override
  String get vouchersErrorsAccountArchived => 'একটি খাতা আর্কাইভ করা।';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account শূন্যের নিচে যাবে: $amount। তবুও পোস্ট করতে পারেন।';
  }

  @override
  String get promosTitle => 'ভাউচার ও কুপন';

  @override
  String get promosSubtitle =>
      'কাউন্টারের জন্য গিফট ভাউচার, কুপন কোড, ডিসকাউন্ট কার্ড ও লাকি ড্র।';

  @override
  String get promosStatusesActive => 'চালু';

  @override
  String get promosStatusesUsed => 'পুরো ব্যবহৃত';

  @override
  String get promosStatusesExpired => 'মেয়াদ শেষ';

  @override
  String get promosGiftTitle => 'গিফট ভাউচার';

  @override
  String promosGiftHint(String amount) {
    return 'চালু ভাউচারে এখনও $amount বাকি। GST ভাউচার বিক্রির সময় নয়, তা দিয়ে পণ্য কেনার সময় লাগে।';
  }

  @override
  String get promosGiftCode => 'কোড';

  @override
  String get promosGiftFor => 'কার জন্য';

  @override
  String get promosGiftValue => 'মূল্য (₹)';

  @override
  String get promosGiftBalance => 'ব্যালেন্স';

  @override
  String get promosGiftExpires => 'মেয়াদ শেষের তারিখ';

  @override
  String get promosGiftEmpty => 'এখনও কোনো গিফট ভাউচার বিক্রি হয়নি।';

  @override
  String get promosGiftCount => 'কয়টি';

  @override
  String get promosGiftPaidBy => 'পেমেন্টের মাধ্যম';

  @override
  String get promosGiftSell => 'ভাউচার বিক্রি করুন';

  @override
  String get promosGiftIssued => 'বিক্রি হয়েছে। কোড:';

  @override
  String get promosGiftExpire => 'মেয়াদোত্তীর্ণ ভাউচারের টাকা ফেরত লিখুন';

  @override
  String get promosGiftExpireHint =>
      'তারিখ পেরোনো ভাউচারের বাকি টাকা আয় হয়ে যায়।';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$nটি ভাউচারের মেয়াদ শেষ, $amount ফেরত লেখা হয়েছে।';
  }

  @override
  String get promosCouponsTitle => 'কুপন কোড';

  @override
  String get promosCouponsNew => 'নতুন কুপন';

  @override
  String get promosCouponsCode => 'কোড';

  @override
  String get promosCouponsOff => 'ছাড়';

  @override
  String get promosCouponsValid => 'বৈধ';

  @override
  String get promosCouponsUsed => 'ব্যবহার';

  @override
  String get promosCouponsEmpty => 'এখনও কোনো কুপন নেই।';

  @override
  String promosCouponsUpTo(String amount) {
    return '$amount পর্যন্ত';
  }

  @override
  String get promosCouponsMaxDiscount => 'সর্বোচ্চ ছাড় (₹)';

  @override
  String get promosCouponsMinBill => 'ন্যূনতম বিল (₹)';

  @override
  String get promosCouponsMaxUses => 'কতবার';

  @override
  String get promosCouponsMaxUsesHint => 'ফাঁকা = সীমা নেই';

  @override
  String get promosCardsTitle => 'ডিসকাউন্ট কার্ড';

  @override
  String get promosCardsNew => 'নতুন কার্ড';

  @override
  String get promosCardsNumber => 'কার্ড নম্বর';

  @override
  String get promosCardsHolder => 'ধারক';

  @override
  String get promosCardsValidUntil => 'বৈধ পর্যন্ত';

  @override
  String get promosCardsEmpty => 'এখনও কোনো ডিসকাউন্ট কার্ড নেই।';

  @override
  String get promosDrawTitle => 'লাকি ড্র';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from থেকে $to · $entriesটি এন্ট্রি';
  }

  @override
  String get promosDrawEmpty => 'এখনও কোনো ড্র হয়নি।';

  @override
  String get promosDrawWinners => 'বিজয়ী';

  @override
  String get promosDrawHint =>
      'এই সময়ে গ্রাহকের মোবাইলসহ প্রতিটি বিল একটি এন্ট্রি; প্রতিটি মোবাইল একবারই জিততে পারে।';

  @override
  String get promosDrawRun => 'বিজয়ী বাছুন';

  @override
  String get promosStatus => 'অবস্থা';

  @override
  String get promosErrorsInvalidAmount => 'টাকায় পরিমাণ লিখুন।';

  @override
  String get promosErrorsInvalidPercent => '0 থেকে 100-এর মধ্যে শতাংশ দিন।';

  @override
  String get promosErrorsCodeTaken => 'এই কোড আগে থেকেই ব্যবহৃত।';

  @override
  String get promosErrorsExpiryBeforeIssue =>
      'মেয়াদ শেষের তারিখ আজকের পরে হতে হবে।';

  @override
  String get promosErrorsEndsBeforeStart => 'শেষ তারিখ শুরুর তারিখের আগে।';

  @override
  String get promosErrorsNoEntries =>
      'সেই সময়ে গ্রাহকের মোবাইলসহ কোনো বিল নেই।';

  @override
  String get promosErrorsInvalidCode => 'শুধু অক্ষর, সংখ্যা ও হাইফেন।';

  @override
  String get promosErrorsInvalidPhone => '10 সংখ্যার মোবাইল নম্বর দিন।';

  @override
  String get posReturnsTitle => 'ফেরত ও বদল';

  @override
  String get posReturnsSubtitle =>
      'বিলের বিপরীতে পণ্য ফেরত নিন। সাইজ বা রং বদলাতে স্টোর ক্রেডিট দিন আর তা দিয়ে নতুন পিস বিল করুন।';

  @override
  String get posReturnsReturn => 'ফেরত';

  @override
  String posReturnsSaved(String number) {
    return 'ফেরত $number সংরক্ষিত';
  }

  @override
  String get posReturnsCreditCode => 'স্টোর ক্রেডিট কোড:';

  @override
  String get posReturnsExchangeNow => 'এখনই বদলের বিল করুন';

  @override
  String posReturnsRefunded(String mode) {
    return '$mode-এ ফেরত দেওয়া হয়েছে।';
  }

  @override
  String posReturnsAgainst(String number) {
    return '$number-এর বিপরীতে ফেরত';
  }

  @override
  String get posReturnsCanReturn => 'ফেরত দেওয়া যায়';

  @override
  String get posReturnsQty => 'ফেরত পরিমাণ';

  @override
  String get posReturnsReason => 'কারণ';

  @override
  String get posReturnsCondition => 'অবস্থা';

  @override
  String get posReturnsCounter => 'কাউন্টার';

  @override
  String get posReturnsNoShift => 'আগে কোনো কাউন্টারে শিফট খুলুন।';

  @override
  String get posReturnsGive => 'কীভাবে ফেরত দেবেন';

  @override
  String get posReturnsVoucherHint => 'এখন বা পরে বদলের দাম দিতে ভাউচার কোড';

  @override
  String get posReturnsStoreCredit => 'স্টোর ক্রেডিট (বদল)';

  @override
  String posReturnsAbout(String amount) {
    return 'প্রায় $amount';
  }

  @override
  String get posReturnsTake => 'ফেরত নিন';

  @override
  String get posReturnsNumber => 'ফেরত';

  @override
  String get posReturnsBill => 'বিল';

  @override
  String get posReturnsWhat => 'কী ফেরত এল';

  @override
  String get posReturnsNone => 'এই দিনে কোনো ফেরত নেই।';

  @override
  String get posReturnsByReason => 'কারণ অনুযায়ী';

  @override
  String get posReturnsByCondition => 'অবস্থা অনুযায়ী';

  @override
  String get posReturnsBillNumber => 'বিল নম্বর';

  @override
  String get posReturnsFind => 'বিল খুঁজুন';

  @override
  String get posReturnsNotFound => 'ওই নম্বরের কোনো বিল নেই।';

  @override
  String get posReturnsDate => 'তারিখ';

  @override
  String get posReturnsShow => 'দেখান';

  @override
  String get posReturnsReasonsSize => 'সাইজ';

  @override
  String get posReturnsReasonsColour => 'রং';

  @override
  String get posReturnsReasonsDefect => 'উৎপাদন ত্রুটি';

  @override
  String get posReturnsReasonsDamaged => 'ক্ষতিগ্রস্ত';

  @override
  String get posReturnsReasonsNotLiked => 'পছন্দ হয়নি';

  @override
  String get posReturnsReasonsOther => 'অন্য';

  @override
  String get posReturnsGradesA => 'A: নতুনের মতো, তাকে ফেরত';

  @override
  String get posReturnsGradesB => 'B: সামান্য ত্রুটি, সেকেন্ড হিসেবে বিক্রি';

  @override
  String get posReturnsGradesC => 'C: বিক্রি করা যাবে না';

  @override
  String get posReturnsErrorsBillVoid =>
      'এই বিল বাতিল; এর বিপরীতে ফেরত হবে না।';

  @override
  String get posReturnsErrorsOverReturn => 'এটা সারিতে বাকির চেয়ে বেশি।';

  @override
  String get posReturnsErrorsSessionNotOpen => 'আগে এই কাউন্টারে শিফট খুলুন।';

  @override
  String get posReturnsErrorsDuplicateLine => 'একটি সারি দুবার আছে।';

  @override
  String get alterationsTitle => 'অল্টারেশন ও মেরামত';

  @override
  String get alterationsSubtitle =>
      'ফিটিংয়ের জন্য পোশাক নিন, কারিগরকে দিন, প্রতিশ্রুত দিনে ফেরত দিন।';

  @override
  String get alterationsNewSlip => 'নতুন অল্টারেশন স্লিপ';

  @override
  String get alterationsSetUpFirst =>
      'স্লিপ নিতে আগে নিচে অল্টারেশনের ধরন যোগ করুন।';

  @override
  String get alterationsStatusReceived => 'নেওয়া হয়েছে';

  @override
  String get alterationsStatusWithKarigar => 'কারিগরের কাছে';

  @override
  String get alterationsStatusReady => 'গ্রাহকের জন্য তৈরি';

  @override
  String get alterationsNone => 'এখানে কিছু নেই।';

  @override
  String alterationsLabour(String from, String to) {
    return 'কারিগরের মজুরি, $from থেকে $to';
  }

  @override
  String get alterationsKarigar => 'কারিগর';

  @override
  String get alterationsKarigars => 'কারিগর';

  @override
  String get alterationsKarigarHint =>
      'বাইরের কারিগরের নিজস্ব খাতা হয়; কাজ ফিরলে মজুরি জমা হয়। ভেতরের কারিগর বেতন পান।';

  @override
  String get alterationsNoKarigars => 'এখনও কোনো কারিগর নেই।';

  @override
  String get alterationsOutside => 'বাইরের কারিগর';

  @override
  String get alterationsInHouse => 'নিজস্ব';

  @override
  String get alterationsPhone => 'মোবাইল';

  @override
  String get alterationsSlips => 'স্লিপ';

  @override
  String get alterationsPieces => 'পিস';

  @override
  String get alterationsLabourCol => 'মজুরি';

  @override
  String get alterationsNoLabour => 'এই মাসে কারিগরদের কাছ থেকে কিছু ফেরেনি।';

  @override
  String get alterationsOverdue => 'দেরি';

  @override
  String alterationsDue(String date) {
    return '$date-এর মধ্যে';
  }

  @override
  String alterationsTrial(String date) {
    return 'ট্রায়াল $date';
  }

  @override
  String alterationsWith(String name) {
    return '$name-এর কাছে';
  }

  @override
  String get alterationsFree => 'বিনামূল্যে';

  @override
  String get alterationsGive => 'দিন';

  @override
  String get alterationsBack => 'কারিগরের কাছ থেকে ফিরেছে';

  @override
  String get alterationsDeliver => 'হস্তান্তর করুন';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'হস্তান্তর করে $amount নিন';
  }

  @override
  String get alterationsCancelSlip => 'স্লিপ বাতিল করুন';

  @override
  String get alterationsAgainstBill => 'বিলের বিপরীতে';

  @override
  String get alterationsTrialOn => 'ট্রায়ালের তারিখ';

  @override
  String get alterationsDeliveryOn => 'ডেলিভারির তারিখ';

  @override
  String get alterationsComplimentary => 'কেনার সঙ্গে বিনামূল্যে';

  @override
  String get alterationsGarment => 'পোশাক';

  @override
  String get alterationsWork => 'কাজ';

  @override
  String get alterationsNotes => 'মাপ ও নোট';

  @override
  String get alterationsAddWork => 'কাজ যোগ করুন';

  @override
  String get alterationsTakeIn => 'স্লিপ করুন';

  @override
  String alterationsCharge(String amount) {
    return 'চার্জ $amount';
  }

  @override
  String get alterationsTypes => 'যে অল্টারেশন ও মেরামত হয়';

  @override
  String get alterationsCustomerCharge => 'গ্রাহক দেবেন';

  @override
  String get alterationsKindsAlteration => 'অল্টারেশন';

  @override
  String get alterationsKindsRepair => 'মেরামত';

  @override
  String get alterationsErrorsNameTaken => 'এই নাম আগে থেকেই ব্যবহৃত।';

  @override
  String get alterationsErrorsNotReceived =>
      'এই স্লিপ আগেই কারিগরের কাছে গেছে।';

  @override
  String get alterationsErrorsNotWithKarigar =>
      'এই স্লিপ কোনো কারিগরের কাছে নেই।';

  @override
  String get alterationsErrorsNotReady => 'এই স্লিপ এখনও তৈরি নয়।';

  @override
  String get alterationsErrorsTerminalRequired => 'চার্জ নিতে কাউন্টার বাছুন।';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'ডেলিভারির তারিখ স্লিপের তারিখের আগে।';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'ট্রায়াল স্লিপ ও ডেলিভারির তারিখের মধ্যে হতে হবে।';

  @override
  String get alterationsErrorsCannotCancel =>
      'হস্তান্তরিত বা বাতিল স্লিপ বাতিল করা যায় না।';

  @override
  String get tailoringTitle => 'অর্ডার অনুযায়ী দর্জির কাজ';

  @override
  String get tailoringSubtitle =>
      'মাপ, অগ্রিম, প্রতিটি কাজ কারিগরের হাতে, আর ডেলিভারিতে দর্জির বিল।';

  @override
  String get tailoringNewOrder => 'নতুন দর্জির অর্ডার';

  @override
  String get tailoringTakeMeasurements => 'মাপ নিন';

  @override
  String get tailoringStatusBooked => 'বুক করা';

  @override
  String get tailoringStatusInWork => 'কাজ চলছে';

  @override
  String get tailoringStatusReady => 'ডেলিভারির জন্য তৈরি';

  @override
  String get tailoringTrialDue => 'ট্রায়াল বাকি';

  @override
  String get tailoringToday => 'আজ দেওয়ার কথা';

  @override
  String get tailoringMarkDone => 'হয়ে গেছে';

  @override
  String get tailoringMarkReady => 'তৈরি চিহ্নিত করুন';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'মোট $total, অগ্রিম $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'দিয়ে $amount নিন';
  }

  @override
  String get tailoringCancelOrder => 'অর্ডার বাতিল করুন';

  @override
  String tailoringCardsFound(String n) {
    return '$nটি মাপ কার্ড আছে';
  }

  @override
  String get tailoringStitchingPrice => 'সেলাইয়ের দাম';

  @override
  String get tailoringMeasurements => 'মাপ কার্ড';

  @override
  String get tailoringNoCard => 'কার্ড নেই';

  @override
  String get tailoringFabric => 'কাপড়';

  @override
  String get tailoringOwnFabric => 'গ্রাহকের নিজের কাপড়';

  @override
  String get tailoringMetres => 'মিটার';

  @override
  String get tailoringStyleNotes => 'স্টাইল নোট (কলার, পকেট, ফিটিং, লাইনিং...)';

  @override
  String get tailoringAddGarment => 'পোশাক যোগ করুন';

  @override
  String get tailoringAdvance => 'অগ্রিম (₹)';

  @override
  String get tailoringAdvanceHint =>
      'এই অর্ডারের জন্য জমা থাকে; ডেলিভারিতে বিল থেকে বাদ যায়';

  @override
  String get tailoringBook => 'অর্ডার বুক করুন';

  @override
  String tailoringEstimate(String amount) {
    return 'আনুমানিক $amount';
  }

  @override
  String get tailoringInches => 'মাপ ইঞ্চিতে। যা দরকার নেই ফাঁকা রাখুন।';

  @override
  String get tailoringOtherMeasure => 'অন্য মাপ';

  @override
  String get tailoringValue => 'মান';

  @override
  String get tailoringPhoto => 'ছবি যোগ করুন';

  @override
  String get tailoringRates => 'কাজ অনুযায়ী কারিগরের হার';

  @override
  String get tailoringRatesHint =>
      'প্রতিটি পোশাকের প্রতিটি কাজের প্রতি পিস মজুরি, যে ক্রমে হয়। নতুন অর্ডার এই কাজগুলো নেয়।';

  @override
  String get tailoringProcess => 'কাজ';

  @override
  String get tailoringNoRates =>
      'এখনও হার নেই: যোগ না করা পর্যন্ত অর্ডারে কাজ থাকবে না।';

  @override
  String get tailoringAddRate => 'কাজ যোগ করুন';

  @override
  String get tailoringKeysChest => 'বুক';

  @override
  String get tailoringKeysWaist => 'কোমর';

  @override
  String get tailoringKeysHip => 'নিতম্ব';

  @override
  String get tailoringKeysShoulder => 'কাঁধ';

  @override
  String get tailoringKeysLength => 'দৈর্ঘ্য';

  @override
  String get tailoringKeysSleeve => 'হাতা';

  @override
  String get tailoringKeysNeck => 'গলা';

  @override
  String get tailoringKeysInseam => 'ভেতরের দৈর্ঘ্য';

  @override
  String get tailoringErrorsPhotoTooBig => 'ছবিটি খুব বড় (সর্বোচ্চ 6 MB)।';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'অগ্রিম অর্ডারের মোটের চেয়ে বেশি।';

  @override
  String get tailoringErrorsAssignFirst => 'আগে কাজটি কোনো কারিগরকে দিন।';

  @override
  String get tailoringErrorsProcessDone => 'সেই কাজ আগেই হয়ে গেছে।';

  @override
  String get tailoringErrorsProcessesPending => 'কিছু কাজ এখনও বাকি।';

  @override
  String get tailoringErrorsNotReady => 'এই অর্ডার এখনও তৈরি নয়।';

  @override
  String get tailoringErrorsOrderClosed =>
      'এই অর্ডার আগেই দেওয়া বা বাতিল হয়েছে।';

  @override
  String get tailoringErrorsFabricQtyRequired => 'কত মিটার কাপড় লিখুন।';

  @override
  String get tailoringErrorsNoMeasurements => 'অন্তত একটি মাপ দিন।';

  @override
  String get tailoringErrorsDuplicateRate => 'একই পোশাক ও কাজ দুবার আছে।';

  @override
  String get consignmentTitle => 'কনসাইনমেন্ট ও শপ-ইন-শপ';

  @override
  String get consignmentSubtitle =>
      'অন্য দোকানে রাখা মাল বিক্রি না হওয়া পর্যন্ত আপনার থাকে। মাল পাঠান, ফেরত নিন এবং তাদের বিক্রির রিপোর্ট অনুযায়ী বিল করুন।';

  @override
  String get consignmentSend => 'মাল পাঠান';

  @override
  String get consignmentBillSales => 'তাদের বিক্রির বিল';

  @override
  String get consignmentTakeBack => 'মাল ফেরত নিন';

  @override
  String get consignmentConsignee => 'কনসাইনি';

  @override
  String get consignmentHeld => 'তাদের কাছে';

  @override
  String get consignmentValueAtCost => 'খরচ অনুযায়ী মূল্য';

  @override
  String get consignmentSold => 'বিক্রি';

  @override
  String get consignmentAgeing => 'পুরনো মাল';

  @override
  String consignmentItemsAgeing(String n) {
    return '150 দিনের বেশি পুরনো আইটেম: $n';
  }

  @override
  String get consignmentFine => 'সব নতুন';

  @override
  String get consignmentNone => 'এখনও কোনো মাল কনসাইনমেন্টে নেই।';

  @override
  String consignmentReconcileTitle(String name) {
    return 'মিলান: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'তাদের দোকানে গোনা সংখ্যা লিখুন। কম পড়া পিস বিক্রি ধরে তাদের বিল করা হবে। মাল পাঠানোর ছয় মাসের মধ্যে বিল করতে হবে।';

  @override
  String get consignmentSent => 'পাঠানো';

  @override
  String get consignmentReturned => 'ফেরত এসেছে';

  @override
  String get consignmentCounted => 'গোনা';

  @override
  String get consignmentInvoiceBy => 'বিলের শেষ তারিখ';

  @override
  String consignmentMismatch(String n) {
    return '$n পার্থক্য';
  }

  @override
  String consignmentShortage(String n) {
    return 'গোনায় কম পিস: $n';
  }

  @override
  String get consignmentShortageNarration => 'স্টক গোনায় বিক্রি পাওয়া গেছে';

  @override
  String get consignmentBillShortage => 'ঘাটতি বিক্রি ধরে বিল করুন';

  @override
  String get consignmentRegister => 'চলাচল';

  @override
  String get consignmentKindsSend => 'পাঠানো';

  @override
  String get consignmentKindsReturn => 'ফেরত এসেছে';

  @override
  String get consignmentKindsSale => 'বিক্রি ও বিল হয়েছে';

  @override
  String get consignmentFormsSend => 'কনসাইনমেন্টে মাল পাঠান';

  @override
  String get consignmentFormsReturn => 'মাল ফেরত নিন';

  @override
  String get consignmentFormsSales => 'তাদের বিক্রির রিপোর্ট';

  @override
  String get consignmentFormHintsSend =>
      'মাল তাদের দোকানে যায় এবং আপনার হিসাবে থাকে। দর ফাঁকা রাখলে তাদের মূল্য তালিকা বা আইটেমের বিক্রয় দর লাগবে।';

  @override
  String get consignmentFormHintsReturn =>
      'অবিক্রীত পিস আপনার মূল গুদামে ফেরে।';

  @override
  String get consignmentFormHintsSales =>
      'প্রতিটি বিক্রির রিপোর্ট তাদের দোকানের মাল থেকে তাদের নামে ট্যাক্স ইনভয়েস হয়। ক্রেডিট সীমা ছাড়ালেও সতর্কতাসহ হয়।';

  @override
  String get consignmentAgreedRate => 'নির্ধারিত দর';

  @override
  String get consignmentAddLine => 'আইটেম যোগ করুন';

  @override
  String get consignmentSaveSend => 'পাঠান';

  @override
  String get consignmentSaveReturn => 'ফেরত নিন';

  @override
  String get consignmentSaveSales => 'ইনভয়েস তৈরি করুন';

  @override
  String get consignmentErrorsMoreThanHeld =>
      'এটি তাদের কাছে থাকা মালের চেয়ে বেশি।';

  @override
  String get consignmentErrorsNotACustomer => 'একটি গ্রাহক অ্যাকাউন্ট বাছুন।';

  @override
  String get consignmentErrorsDuplicateItem => 'একই আইটেম দুবার আছে।';

  @override
  String get consignmentErrorsUnknownItem => 'একটি আইটেম আর নেই।';

  @override
  String get reportsParticulars => 'বিবরণ';

  @override
  String get reportsTradingIncome => 'বিক্রি ও প্রত্যক্ষ আয়';

  @override
  String get reportsTradingExpense => 'কেনা ও প্রত্যক্ষ খরচ';

  @override
  String get reportsGrossProfit => 'মোট লাভ';

  @override
  String get reportsOtherIncome => 'পরোক্ষ আয়';

  @override
  String get reportsOtherExpense => 'পরোক্ষ খরচ';

  @override
  String get reportsNetProfit => 'নিট লাভ';

  @override
  String get reportsNetLoss => 'নিট ক্ষতি';

  @override
  String get reportsAssets => 'সম্পদ';

  @override
  String get reportsLiabilities => 'দায় ও মূলধন';

  @override
  String get reportsProfitAndLoss => 'লাভ-ক্ষতি হিসাব';

  @override
  String get reportsDifference => 'পার্থক্য';

  @override
  String get reportsOpeningDifference => 'প্রারম্ভিক ব্যালান্সে পার্থক্য';

  @override
  String get reportsOpening => 'প্রারম্ভিক ব্যালান্স';

  @override
  String get reportsClosing => 'সমাপনী ব্যালান্স';

  @override
  String get reportsNoData => 'এই সময়ে দেখানোর কিছু নেই।';

  @override
  String reportsLedgerTitle(String account) {
    return 'খতিয়ান: $account';
  }

  @override
  String get reportsStockNote => 'পর্ব 3-এ মাল আসার পর সমাপনী স্টক যোগ হবে।';

  @override
  String get reportsOpeningStock => 'প্রারম্ভিক স্টক';

  @override
  String get reportsClosingStock => 'সমাপনী স্টক';

  @override
  String get reportsBuilderTitle => 'রিপোর্ট বিল্ডার';

  @override
  String get reportsBuilderSubtitle =>
      'বিক্রি, কেনা, খরচ, খতিয়ানের এন্ট্রি বা সময় যেভাবে দরকার সাজিয়ে যোগফল করুন; সংরক্ষণ করুন বা ইমেলে পান।';

  @override
  String get reportsBuilderDataset => 'ডেটা';

  @override
  String get reportsBuilderDatasetsSales => 'বিক্রি';

  @override
  String get reportsBuilderDatasetsPurchases => 'কেনা';

  @override
  String get reportsBuilderDatasetsExpenses => 'খরচ';

  @override
  String get reportsBuilderDatasetsLedger => 'খতিয়ানের এন্ট্রি';

  @override
  String get reportsBuilderDatasetsTime => 'টাইমশিট';

  @override
  String get reportsBuilderGroupBy => 'অনুযায়ী সাজান (3টি পর্যন্ত)';

  @override
  String get reportsBuilderMeasures => 'দেখান';

  @override
  String get reportsBuilderDimsMonth => 'মাস';

  @override
  String get reportsBuilderDimsDay => 'দিন';

  @override
  String get reportsBuilderDimsCustomer => 'গ্রাহক';

  @override
  String get reportsBuilderDimsItem => 'পণ্য';

  @override
  String get reportsBuilderDimsHsn => 'HSN';

  @override
  String get reportsBuilderDimsState => 'রাজ্য';

  @override
  String get reportsBuilderDimsSupplier => 'সরবরাহকারী';

  @override
  String get reportsBuilderDimsCategory => 'ধরন';

  @override
  String get reportsBuilderDimsEmployee => 'কর্মচারী';

  @override
  String get reportsBuilderDimsProject => 'প্রকল্প';

  @override
  String get reportsBuilderDimsAccount => 'খাতা';

  @override
  String get reportsBuilderDimsGroup => 'গ্রুপ';

  @override
  String get reportsBuilderDimsType => 'ভাউচারের ধরন';

  @override
  String get reportsBuilderMeasureNamesQty => 'পরিমাণ';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'করযোগ্য মূল্য';

  @override
  String get reportsBuilderMeasureNamesTax => 'জিএসটি';

  @override
  String get reportsBuilderMeasureNamesTotal => 'মোট';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'নথি';

  @override
  String get reportsBuilderMeasureNamesAmount => 'অঙ্ক';

  @override
  String get reportsBuilderMeasureNamesItc => 'জিএসটি ক্রেডিট';

  @override
  String get reportsBuilderMeasureNamesDebit => 'ডেবিট';

  @override
  String get reportsBuilderMeasureNamesCredit => 'ক্রেডিট';

  @override
  String get reportsBuilderMeasureNamesNet => 'নিট';

  @override
  String get reportsBuilderMeasureNamesHours => 'ঘণ্টা';

  @override
  String get reportsBuilderMeasureNamesCost => 'খরচ';

  @override
  String get reportsBuilderMeasureNamesBillableValue => 'বিলযোগ্য মূল্য';

  @override
  String get reportsBuilderPeriod => 'সময়কাল';

  @override
  String get reportsBuilderPresetsToday => 'আজ';

  @override
  String get reportsBuilderPresetsYesterday => 'গতকাল';

  @override
  String get reportsBuilderPresetsThisMonth => 'এই মাস';

  @override
  String get reportsBuilderPresetsLastMonth => 'গত মাস';

  @override
  String get reportsBuilderPresetsThisQuarter => 'এই ত্রৈমাসিক';

  @override
  String get reportsBuilderPresetsLastQuarter => 'গত ত্রৈমাসিক';

  @override
  String get reportsBuilderPresetsThisFy => 'এই আর্থিক বছর';

  @override
  String get reportsBuilderPresetsLastFy => 'গত আর্থিক বছর';

  @override
  String get reportsBuilderPresetsCustom => 'তারিখ বেছে নিন';

  @override
  String get reportsBuilderRun => 'চালান';

  @override
  String get reportsBuilderCsv => 'CSV ডাউনলোড';

  @override
  String get reportsBuilderSave => 'রিপোর্ট সংরক্ষণ';

  @override
  String get reportsBuilderName => 'রিপোর্টের নাম';

  @override
  String get reportsBuilderSchedule => 'ইমেল করুন';

  @override
  String get reportsBuilderFrequenciesNone => 'ইমেল করবেন না';

  @override
  String get reportsBuilderFrequenciesDaily => 'প্রতিদিন (গতকালের হিসাব)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'প্রতি সপ্তাহে (গত সোমবার থেকে রবিবার)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'প্রতি মাসে (গত মাস)';

  @override
  String get reportsBuilderHour => 'সময়';

  @override
  String get reportsBuilderWeekday => 'বার';

  @override
  String get reportsBuilderWeekdays0 => 'রবিবার';

  @override
  String get reportsBuilderWeekdays1 => 'সোমবার';

  @override
  String get reportsBuilderWeekdays2 => 'মঙ্গলবার';

  @override
  String get reportsBuilderWeekdays3 => 'বুধবার';

  @override
  String get reportsBuilderWeekdays4 => 'বৃহস্পতিবার';

  @override
  String get reportsBuilderWeekdays5 => 'শুক্রবার';

  @override
  String get reportsBuilderWeekdays6 => 'শনিবার';

  @override
  String get reportsBuilderDay => 'তারিখে (1–28)';

  @override
  String get reportsBuilderRecipients => 'যাঁদের ইমেল করবেন (কমা দিয়ে আলাদা)';

  @override
  String get reportsBuilderSaved => 'সংরক্ষিত।';

  @override
  String get reportsBuilderTotal => 'মোট';

  @override
  String get reportsBuilderNoRows => 'এই সময়ের কোনো ডেটা নেই।';

  @override
  String get reportsBuilderSavedTitle => 'সংরক্ষিত রিপোর্ট';

  @override
  String reportsBuilderNextRun(String date) {
    return 'পরের ইমেল: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'শেষবার ব্যর্থ: $error';
  }

  @override
  String get reportsBuilderDelete => 'মুছুন';

  @override
  String get reportsBuilderNone => 'এখনো কোনো রিপোর্ট সংরক্ষিত নেই।';

  @override
  String get reportsErrorsUnknownDataset => 'কিসের রিপোর্ট চান বেছে নিন।';

  @override
  String get reportsErrorsUnknownMeasure =>
      'দেখানোর জন্য অন্তত একটি সংখ্যা বেছে নিন।';

  @override
  String get reportsErrorsUnknownDimension => 'এখানে সেই সাজানো চলে না।';

  @override
  String get reportsErrorsInvalidPeriod => 'তারিখগুলো দেখে নিন।';

  @override
  String get reportsErrorsRecipientsRequired => 'অন্তত একটি ইমেল ঠিকানা দিন।';

  @override
  String get reportsErrorsInvalidHour => 'সময় বেছে নিন।';

  @override
  String get reportsErrorsInvalidWeekday => 'সপ্তাহের দিন বেছে নিন।';

  @override
  String get reportsErrorsInvalidDay => '1 থেকে 28-এর মধ্যে তারিখ বেছে নিন।';

  @override
  String get reportsErrorsUnknownFilter => 'এখানে সেই ফিল্টার চলে না।';

  @override
  String get ownerReportsColourSizeTitle => 'রং ও সাইজ রিপোর্ট';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'প্রতিটি ডিজাইন রং ও সাইজের গ্রিডে, স্টক বা বিক্রি পিস সহ।';

  @override
  String get ownerReportsAgeingTitle => 'স্টকের বয়স ও অচল স্টক';

  @override
  String get ownerReportsAgeingSubtitle =>
      'আজকের স্টক কতদিন আছে (আগে আসা আগে বিক্রি), আর কী বিক্রি বন্ধ হয়েছে।';

  @override
  String get ownerReportsRegisterTitle => 'বিক্রির রেজিস্টার';

  @override
  String get ownerReportsRegisterSubtitle =>
      'সময়ের প্রতিটি ইনভয়েস, কাউন্টার বিল ও ফেরত, কীভাবে দেওয়া হয়েছে সহ।';

  @override
  String get ownerReportsDesign => 'ডিজাইন';

  @override
  String get ownerReportsName => 'নাম';

  @override
  String get ownerReportsBrand => 'ব্র্যান্ড';

  @override
  String get ownerReportsColour => 'রং';

  @override
  String get ownerReportsSize => 'সাইজ';

  @override
  String get ownerReportsSold => 'বিক্রি';

  @override
  String get ownerReportsStock => 'স্টক';

  @override
  String get ownerReportsSales => 'বিক্রি';

  @override
  String get ownerReportsReportType => 'দেখান';

  @override
  String get ownerReportsFrom => 'থেকে';

  @override
  String get ownerReportsTo => 'পর্যন্ত';

  @override
  String get ownerReportsAsOf => 'এই তারিখে';

  @override
  String get ownerReportsStore => 'গুদাম';

  @override
  String get ownerReportsAllStores => 'আমাদের সব গুদাম';

  @override
  String get ownerReportsAllBrands => 'সব ব্র্যান্ড';

  @override
  String get ownerReportsCategory => 'বিভাগ';

  @override
  String get ownerReportsAllCategories => 'সব বিভাগ';

  @override
  String get ownerReportsSearchDesign => 'ডিজাইন নং বা নাম';

  @override
  String ownerReportsTotalSold(String n) {
    return 'বিক্রি পিস: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'স্টকে পিস: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'MRP $v';
  }

  @override
  String get ownerReportsTotal => 'মোট';

  @override
  String get ownerReportsNoPhoto => 'ছবি নেই';

  @override
  String get ownerReportsNothing => 'এই বাছাইয়ে কিছু নেই।';

  @override
  String get ownerReportsItem => 'আইটেম';

  @override
  String get ownerReportsValue => 'মূল্য';

  @override
  String get ownerReportsDeadAfter => 'অচল কখন';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'অচল: $n দিন বিক্রি নেই';
  }

  @override
  String get ownerReportsOnlyDead => 'শুধু অচল স্টক';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'বয়স অনুযায়ী স্টক: $v, $n পিস';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'অচল স্টক ($n দিন বিক্রি নেই)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'আইটেম: $items, পিস: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'ছাড়, সরবরাহকারীকে ফেরত বা অন্য গুদামে পাঠানোর যোগ্য।';

  @override
  String get ownerReportsDead => 'অচল';

  @override
  String get ownerReportsLastSold => 'শেষ বিক্রি';

  @override
  String get ownerReportsIdleDays => 'বিক্রিহীন দিন';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n দিন আগে)';
  }

  @override
  String get ownerReportsNeverSold => 'কখনো বিক্রি হয়নি';

  @override
  String get ownerReportsDate => 'তারিখ';

  @override
  String get ownerReportsNumber => 'নং';

  @override
  String get ownerReportsKind => 'নথি';

  @override
  String get ownerReportsParty => 'গ্রাহক';

  @override
  String get ownerReportsColsPieces => 'পিস';

  @override
  String get ownerReportsColsGross => 'মোট অঙ্ক';

  @override
  String get ownerReportsColsDiscount => 'ছাড়';

  @override
  String get ownerReportsColsTaxable => 'করযোগ্য';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'বিলের অঙ্ক';

  @override
  String get ownerReportsColsCash => 'নগদ';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'কার্ড';

  @override
  String get ownerReportsColsCredit => 'বাকি';

  @override
  String get ownerReportsKindsInvoice => 'ইনভয়েস';

  @override
  String get ownerReportsKindsBill => 'কাউন্টার বিল';

  @override
  String get ownerReportsKindsCreditNote => 'ক্রেডিট নোট';

  @override
  String get ownerReportsKindsCounterReturn => 'কাউন্টার ফেরত';

  @override
  String get ownerReportsSearchRegister => 'নম্বর বা গ্রাহক';

  @override
  String get ownerReportsAllKinds => 'সব নথি';

  @override
  String ownerReportsDocuments(String n) {
    return 'নথি: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'ফেরত মাইনাস সারিতে। রঙিন সারিতে ছাড় ছিল; কাটা সারি বাতিল, মোটে ধরা হয়নি।';

  @override
  String get ownerReportsCompareLastYear => 'গত বছরের সঙ্গে তুলনা';

  @override
  String get ownerReportsThisPeriod => 'এই সময়';

  @override
  String get ownerReportsSameLastYear => 'গত বছরের একই সময়';

  @override
  String get ownerReportsChange => 'পরিবর্তন';

  @override
  String get ownerReportsErrorsInvalidPeriod => 'শুরুর তারিখ শেষের পরে।';

  @override
  String get ownerReportsWithMaterials => 'কাপড় ও ট্রিম সহ';

  @override
  String get ownerReportsAvgBill => 'গড় বিল';

  @override
  String get fyTitle => 'আর্থিক বছর';

  @override
  String get fySubtitle =>
      'হিসাব চূড়ান্ত হলে সময়কাল লক করুন: যেমন জিএসটি রিটার্ন দাখিলের পর। লক তারিখ পর্যন্ত কেউ এন্ট্রি পোস্ট বা বাতিল করতে পারবে না।';

  @override
  String get fyYear => 'বছর';

  @override
  String get fyPeriod => 'সময়কাল';

  @override
  String get fyLockedUpTo => 'পর্যন্ত লক';

  @override
  String get fyOpen => 'খোলা';

  @override
  String get fyLock => 'লক করুন';

  @override
  String get fyUnlock => 'লক সরান';

  @override
  String get fyErrorsLockOutsideYear =>
      'লক তারিখ এই আর্থিক বছরের মধ্যে হতে হবে।';

  @override
  String get appConnectTitle => 'এই ডিভাইস যুক্ত করুন';

  @override
  String get appConnectSubtitle =>
      'আপনার Varchasv অ্যাকাউন্ট দিয়ে একবার সাইন ইন করুন। তারপর অ্যাপ ইন্টারনেট ছাড়াই চলে এবং অনলাইনে থাকলে সিঙ্ক হয়।';

  @override
  String get appServer => 'সার্ভারের ঠিকানা';

  @override
  String get appConnect => 'যুক্ত করুন';

  @override
  String get appConnecting => 'যুক্ত হচ্ছে…';

  @override
  String get appNoBusiness =>
      'এই অ্যাকাউন্ট এখনো কোনো ব্যবসার অংশ নয়। আগে ওয়েবসাইটে একটি তৈরি করুন।';

  @override
  String get appCantReach =>
      'সার্ভারে পৌঁছানো যাচ্ছে না। ঠিকানা আর ইন্টারনেট সংযোগ দেখে নিন।';

  @override
  String get appSyncTitle => 'সিঙ্ক';

  @override
  String get appSyncNow => 'এখন সিঙ্ক করুন';

  @override
  String appLastSync(String time) {
    return 'শেষ সিঙ্ক $time';
  }

  @override
  String get appNeverSynced => 'এখনো সিঙ্ক হয়নি';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি পরিবর্তন আপলোডের অপেক্ষায়',
      one: '$countটি পরিবর্তন আপলোডের অপেক্ষায়',
      zero: 'সব আপলোড হয়ে গেছে',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'সার্ভার $countটি পরিবর্তন ফিরিয়ে দিয়েছে',
      one: 'সার্ভার $countটি পরিবর্তন ফিরিয়ে দিয়েছে',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'ফিরিয়ে দেওয়া পরিবর্তন আবার চেষ্টা করুন';

  @override
  String get appOffline =>
      'অফলাইন: আপনার কাজ এই ডিভাইসে সংরক্ষিত, পরে আপলোড হবে।';

  @override
  String get appSyncing => 'সিঙ্ক হচ্ছে…';

  @override
  String get appDevice => 'এই ডিভাইস';

  @override
  String appDeviceCode(String code) {
    return 'ডিভাইস কোড $code';
  }

  @override
  String get appBusiness => 'ব্যবসা';

  @override
  String get appSignOut => 'এই ডিভাইস থেকে সাইন আউট করুন';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি পরিবর্তন এখনো আপলোড হয়নি, হারিয়ে যাবে।',
      one: '$countটি পরিবর্তন এখনো আপলোড হয়নি, হারিয়ে যাবে।',
      zero: 'এতে এই ডিভাইস থেকে আপনার হিসাবের স্থানীয় কপি মুছে যাবে।',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'আপলোডের অপেক্ষায়';

  @override
  String get appBadgeFailed => 'ফিরিয়ে দেওয়া';

  @override
  String get appBadgeSynced => 'আপলোড হয়েছে';

  @override
  String get appNoVouchers => 'এখনো কোনো ভাউচার নেই। যোগ করতে + চাপুন।';

  @override
  String get appAddAccount => 'খাতা যোগ করুন';

  @override
  String get appNoPermission => 'আপনার এটি করার অনুমতি নেই।';

  @override
  String get appToday => 'আজ';

  @override
  String get appPreviousDay => 'আগের দিন';

  @override
  String get appNextDay => 'পরের দিন';

  @override
  String get appNotSyncedYet => 'সিঙ্কের অপেক্ষায়';

  @override
  String get appFieldTitle => 'মাঠের কাজ';

  @override
  String get appFieldNewOrder => 'নতুন অর্ডার';

  @override
  String get appFieldNewClaim => 'নতুন খরচের দাবি';

  @override
  String get appFieldOrders => 'এই ডিভাইসের অর্ডার';

  @override
  String get appFieldClaims => 'এই ডিভাইসের দাবি';

  @override
  String appFieldSentAs(String number) {
    return '$number হিসেবে আপলোড হয়েছে';
  }

  @override
  String appFieldApprox(String amount) {
    return 'জিএসটি সহ প্রায় ₹$amount; চূড়ান্ত অঙ্ক আপলোডের সময় হিসাব হয়';
  }

  @override
  String get appFieldAddItem => 'পণ্য যোগ করুন';

  @override
  String get appFieldQty => 'পরিমাণ';

  @override
  String get appFieldRate => 'দর';

  @override
  String get appFieldSave => 'সংরক্ষণ করুন';

  @override
  String get appFieldSaved => 'এই ডিভাইসে সংরক্ষিত; অনলাইনে এলে আপলোড হবে।';

  @override
  String get appFieldNone => 'এখনো কিছু নেই।';

  @override
  String get appOverviewTitle => 'সংক্ষিপ্ত চিত্র';

  @override
  String appOverviewAsOf(String time) {
    return '$time অনুযায়ী হিসাব';
  }

  @override
  String appOverviewOffline(String time) {
    return '$time-এর হিসাব দেখানো হচ্ছে। নতুন করতে ইন্টারনেটে যুক্ত হন।';
  }

  @override
  String get appOverviewNever => 'আজকের হিসাব দেখতে ইন্টারনেটে যুক্ত হন।';

  @override
  String get appOverviewRefresh => 'রিফ্রেশ';

  @override
  String get appApprovalsTitle => 'অনুমোদন';

  @override
  String get appApprovalsNone => 'আপনার অপেক্ষায় কিছু নেই।';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours ঘণ্টা';
  }

  @override
  String get appApprovalsNeedOnline => 'অনুমোদনের জন্য ইন্টারনেট লাগে।';

  @override
  String get itemsTitle => 'পণ্য';

  @override
  String get itemsSubtitle =>
      'আপনার মজুত মাল এবং কেনা-বেচার পরিষেবা, HSN/SAC ও জিএসটি হার সহ।';

  @override
  String get itemsNew => 'নতুন পণ্য';

  @override
  String get itemsName => 'পণ্যের নাম';

  @override
  String get itemsKind => 'ধরন';

  @override
  String get itemsGoods => 'মাল';

  @override
  String get itemsService => 'পরিষেবা';

  @override
  String get itemsSku => 'SKU / কোড';

  @override
  String get itemsBarcode => 'বারকোড';

  @override
  String get itemsHsn => 'HSN / SAC';

  @override
  String get itemsGstRate => 'জিএসটি হার';

  @override
  String get itemsUom => 'একক';

  @override
  String get itemsPurchaseRate => 'ক্রয় দর';

  @override
  String get itemsSaleRate => 'বিক্রয় দর';

  @override
  String get itemsMrp => 'MRP';

  @override
  String get itemsReorderLevel => 'পুনরায় অর্ডার স্তর';

  @override
  String get itemsReorderQty => 'পুনরায় অর্ডার পরিমাণ';

  @override
  String get itemsTrackBatches => 'ব্যাচ নম্বর ও মেয়াদ রাখুন';

  @override
  String get itemsInStock => 'স্টকে';

  @override
  String get itemsEmpty => 'এখনো কোনো পণ্য নেই।';

  @override
  String get itemsErrorsInvalidHsn => 'HSN কোডে 4, 6 বা 8 অঙ্ক থাকে।';

  @override
  String get itemsErrorsInvalidSac => 'SAC কোডে 99 দিয়ে শুরু 6 অঙ্ক থাকে।';

  @override
  String get itemsErrorsItemNameTaken => 'এই নামের পণ্য আগে থেকেই আছে।';

  @override
  String get itemsErrorsSkuTaken => 'অন্য একটি পণ্য এই কোড ব্যবহার করছে।';

  @override
  String get itemsErrorsUnknownUom => 'একক বেছে নিন।';

  @override
  String get itemsErrorsSameAsBaseUnit => 'এটি ইতিমধ্যে আইটেমের নিজের একক।';

  @override
  String get itemsErrorsDuplicateUnit => 'প্রতিটি একক একবারই যোগ করা যায়।';

  @override
  String get itemsErrorsInvalidFactor =>
      'এতে মূল এককের কতগুলি আছে, 0-এর বেশি লিখুন।';

  @override
  String get itemsLeadTimeDays => 'লিড টাইম (দিন)';

  @override
  String get itemsGstSlab => 'জিএসটি হার';

  @override
  String get itemsSlabNone => 'নির্দিষ্ট হার';

  @override
  String get itemsSlabApparel =>
      'ছাড়ের পরে প্রতি পিস ₹2,500 পর্যন্ত 5%, তার বেশি 18% (22 সেপ্টেম্বর 2025 থেকে)';

  @override
  String get itemsSlabFootwear =>
      'ছাড়ের পরে প্রতি জোড়া ₹2,500 পর্যন্ত 5%, তার বেশি 18% (22 সেপ্টেম্বর 2025 থেকে)';

  @override
  String get itemsSlabPieces => 'এক এককে পিস';

  @override
  String get itemsSlabPiecesHint =>
      'এক একক হিসেবে বিক্রি হওয়া সেটের দাম জিএসটি যাচাইয়ের জন্য এতগুলি পিসে ভাগ করা হয়। সেটকে এক পিস ধরতে 1 লিখুন।';

  @override
  String get itemsByPrice => 'দাম অনুযায়ী';

  @override
  String get itemsOtherUnits => 'অন্যান্য একক';

  @override
  String get itemsUnitFactor => 'মূল এককে কতগুলি';

  @override
  String get itemsOfBaseUnit => 'মূল একক';

  @override
  String get itemsAddUnit => 'একক যোগ করুন';

  @override
  String get stylesTitle => 'স্টাইল';

  @override
  String get stylesSubtitle =>
      'রং ও সাইজে বিক্রি হওয়া ডিজাইন। প্রতিটি রং ও সাইজ আলাদা আইটেম, যার নিজস্ব বারকোড ও স্টক আছে।';

  @override
  String get stylesSizesAndColors => 'সাইজ ও রং';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'স্টাইল যোগ করার সময় যে সাইজ স্কেল ও রং থেকে বেছে নেন।';

  @override
  String get stylesNew => 'নতুন স্টাইল';

  @override
  String get stylesCreate => 'স্টাইল তৈরি করুন';

  @override
  String get stylesCode => 'ডিজাইন নং';

  @override
  String get stylesCodeHint => 'প্রতিটি SKU-তে ব্যবহার হয়, যেমন KT-101-NVY-M।';

  @override
  String get stylesName => 'নাম';

  @override
  String get stylesBrand => 'ব্র্যান্ড';

  @override
  String get stylesCategory => 'বিভাগ';

  @override
  String get stylesSeason => 'সিজন';

  @override
  String get stylesSeasonExample => 'উৎসব 2026';

  @override
  String get stylesCollection => 'কালেকশন';

  @override
  String get stylesSizeScale => 'সাইজ স্কেল';

  @override
  String get stylesSizes => 'সাইজ';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'রং';

  @override
  String get stylesColor => 'রং';

  @override
  String get stylesFits => 'ফিট';

  @override
  String get stylesFitsHint =>
      'রং ও সাইজ ছাড়া তৃতীয় বিকল্প, কমা দিয়ে আলাদা।';

  @override
  String get stylesFitsExample => 'স্লিম, রেগুলার';

  @override
  String get stylesVariants => 'ভ্যারিয়েন্ট';

  @override
  String get stylesSaleRate => 'বিক্রয় দর';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'এতে $countটি আইটেম তৈরি হবে, প্রতিটি রং ও সাইজের জন্য একটি।',
      one: 'এতে $countটি আইটেম তৈরি হবে।',
      zero: 'সাইজ ও রং বেছে নিন।',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'এখনও কোনো স্টাইল নেই। একটি যোগ করুন, তার সব রং ও সাইজ একসাথে তৈরি হবে।';

  @override
  String get stylesNoMatch => 'আপনার খোঁজের সঙ্গে কোনো স্টাইল মেলেনি।';

  @override
  String get stylesSearchStyles => 'ডিজাইন নং, নাম বা ব্র্যান্ড দিয়ে খুঁজুন';

  @override
  String get stylesNoStyles => 'কোনো স্টাইল পাওয়া যায়নি।';

  @override
  String get stylesChooseStyle => 'স্টাইল বেছে নিন';

  @override
  String get stylesOtherStyle => 'অন্য স্টাইল';

  @override
  String get stylesAddBySize => 'সাইজ অনুযায়ী যোগ করুন';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি পিস যোগ করুন',
      one: '$countটি পিস যোগ করুন',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'প্রতিটি ঘরের নিচের ছোট সংখ্যাটি হাতে থাকা স্টক।';

  @override
  String get stylesStockGrid => 'রং ও সাইজ অনুযায়ী স্টক';

  @override
  String get stylesAllWarehouses => 'সব গুদাম';

  @override
  String get stylesDetails => 'স্টাইলের বিবরণ';

  @override
  String get stylesApplyPrices => 'এই দর প্রতিটি সাইজে প্রয়োগ করুন';

  @override
  String get stylesAddVariants => 'রং বা সাইজ যোগ করুন';

  @override
  String get stylesAddVariantsHint =>
      'নতুন রং, সাইজ বা দুটোই বেছে নিন। স্টাইলে আগে থেকে থাকা ভ্যারিয়েন্ট যেমন আছে থাকবে।';

  @override
  String get stylesSets => 'সেট';

  @override
  String get stylesNoSets => 'এখনও কোনো সেট নেই।';

  @override
  String get stylesNewSet => 'নতুন সেট';

  @override
  String get stylesNewSetHint =>
      'এক রঙের সাইজ অনুপাতের সেট, এক একক হিসেবে বিক্রি হয়। স্টক তার পিস হিসেবে চলে।';

  @override
  String get stylesRatio => 'সাইজের পিস';

  @override
  String get stylesSetAsOnePiece => 'জিএসটির জন্য পুরো সেটকে এক পিস ধরুন';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি পিসের সেট তৈরি করুন',
      one: '$countটি পিসের সেট তৈরি করুন',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'সাইজ স্কেল';

  @override
  String get stylesScaleName => 'স্কেলের নাম';

  @override
  String get stylesColorName => 'রঙের নাম';

  @override
  String get stylesColorCode => 'কোড';

  @override
  String get stylesSwatch => 'রঙের নমুনা';

  @override
  String get stylesArchive => 'আর্কাইভ করুন';

  @override
  String get stylesRestore => 'ফিরিয়ে আনুন';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'এই ডিজাইন নং অন্য একটি স্টাইলে আগে থেকেই আছে।';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'অন্তত একটি রং ও একটি সাইজ বেছে নিন।';

  @override
  String get stylesErrorsUnknownColor => 'এই রংটি আপনার তালিকায় নেই।';

  @override
  String get stylesErrorsVariantMissing =>
      'এই স্টাইলে ওই রঙের ওই সাইজ নেই। আগে সেটি যোগ করুন।';

  @override
  String get stylesErrorsRatioRequired => 'সেটে অন্তত একটি সাইজের পিস লিখুন।';

  @override
  String get stylesErrorsPackExists => 'এই সেটটি আগে থেকেই আছে।';

  @override
  String get stylesErrorsScaleNameTaken =>
      'এই নামে একটি সাইজ স্কেল আগে থেকেই আছে।';

  @override
  String get stylesErrorsColorTaken => 'এই নাম বা কোডে একটি রং আগে থেকেই আছে।';

  @override
  String get stylesErrorsSizesRequired => 'অন্তত একটি সাইজ লিখুন।';

  @override
  String get stylesErrorsColorCodeRequired => 'রঙের কোড লিখুন।';

  @override
  String get stylesSummaryTaxonomy => 'ডিজাইন';

  @override
  String get stylesSummaryCode => 'ডিজাইন নং';

  @override
  String get stylesSummaryName => 'নাম';

  @override
  String get stylesSummaryBrand => 'ব্র্যান্ড';

  @override
  String get stylesSummaryCategory => 'শ্রেণি';

  @override
  String get stylesSummarySeason => 'মরসুম';

  @override
  String get stylesSummaryCollection => 'কালেকশন';

  @override
  String get stylesSummarySizes => 'সাইজ';

  @override
  String get stylesSummaryColours => 'রং';

  @override
  String get stylesSummaryPricing => 'দাম ও খরচ';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'মার্ক-আপ $pct%';
  }

  @override
  String get stylesSummaryCost => 'ক্রয় দর';

  @override
  String get stylesSummarySaleRate => 'বিক্রয় দর';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from থেকে $to';
  }

  @override
  String get stylesSummaryPieces => 'স্টকে পিস';

  @override
  String get stylesSummarySkus => 'রং ও সাইজের আইটেম';

  @override
  String get stylesSummaryValueAtCost => 'খরচে স্টক';

  @override
  String get stylesSummaryMedia => 'ছবি';

  @override
  String stylesSummaryPhotos(String n) {
    return '$nটি আছে';
  }

  @override
  String get stylesSummaryNoPhotos => 'এখনও কোনো ছবি নেই।';

  @override
  String get stylesSummaryManagePhotos => 'ছবি যোগ বা বদল করুন';

  @override
  String get stylesAttributes => 'স্টাইলের বর্ণনা (আপনার তালিকা থেকে)';

  @override
  String get catalogueTitle => 'ছবির ক্যাটালগ';

  @override
  String get catalogueSubtitle =>
      'প্রতিটি ডিজাইন ও রং ছবি, দর, স্টক ও বিক্রি সহ। পার্টির জন্য ডিজাইন বাছুন, তারপর প্রিন্ট, এক্সপোর্ট বা শেয়ার করুন।';

  @override
  String get catalogueAllColours => 'সব রং';

  @override
  String get cataloguePhotos => 'ছবি';

  @override
  String get catalogueView => 'দিক';

  @override
  String get catalogueViewsFront => 'সামনে';

  @override
  String get catalogueViewsBack => 'পিছনে';

  @override
  String get catalogueViewsDetail => 'খুঁটিনাটি';

  @override
  String get catalogueViewsModel => 'মডেলে';

  @override
  String get catalogueViewsOther => 'অন্য';

  @override
  String get catalogueUploading => 'আপলোড হচ্ছে…';

  @override
  String get catalogueAddPhotos => 'ছবি যোগ করুন';

  @override
  String get cataloguePhotoHint =>
      'আপলোডের আগে ছবি এই ডিভাইসেই ছোট করা হয়। ফোনে ক্যামেরা দিয়ে তোলা যায়।';

  @override
  String get catalogueShownFirst => 'প্রথমে দেখায়';

  @override
  String get catalogueShowFirst => 'প্রথমে দেখান';

  @override
  String get catalogueNoPhotos => 'এখনও কোনো ছবি নেই।';

  @override
  String catalogueRecords(String n) {
    return 'দেখানো ডিজাইন: $n';
  }

  @override
  String get catalogueTileSize => 'টাইলের আকার';

  @override
  String get catalogueSort => 'সাজানো';

  @override
  String get catalogueSortsCode => 'ডিজাইন নং অনুযায়ী';

  @override
  String get catalogueSortsNewest => 'নতুন আগে';

  @override
  String get catalogueSortsBest => 'সবচেয়ে বেশি বিক্রি';

  @override
  String get catalogueSortsPriceLow => 'দাম: কম থেকে বেশি';

  @override
  String get catalogueSortsPriceHigh => 'দাম: বেশি থেকে কম';

  @override
  String get catalogueSortsStock => 'সবচেয়ে বেশি স্টক';

  @override
  String catalogueCart(String n) {
    return 'কার্ট ($n)';
  }

  @override
  String get catalogueNoPhoto => 'ছবি নেই';

  @override
  String catalogueStock(String n) {
    return 'স্টক: $n';
  }

  @override
  String catalogueSold(String n) {
    return '90 দিনে বিক্রি: $n';
  }

  @override
  String get catalogueAdded => 'কার্টে';

  @override
  String get catalogueAdd => 'যোগ';

  @override
  String get catalogueNone => 'এই ফিল্টারে কোনো ডিজাইন মেলেনি।';

  @override
  String get cataloguePrevious => 'আগের';

  @override
  String get catalogueNext => 'পরের';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$total-এর মধ্যে $from থেকে $to';
  }

  @override
  String get catalogueSelections => 'সংরক্ষিত বাছাই';

  @override
  String catalogueDesigns(String n) {
    return 'ডিজাইন: $n';
  }

  @override
  String get catalogueSharedBadge => 'লিংক চালু';

  @override
  String get catalogueNoSelections =>
      'এখনও কোনো বাছাই নেই। ডিজাইন কার্টে যোগ করে সংরক্ষণ করুন।';

  @override
  String get catalogueSearch => 'বারকোড, ডিজাইন বা নাম';

  @override
  String get cataloguePriceFor => 'দাম কার জন্য';

  @override
  String get catalogueSaleRate => 'বিক্রয় দর';

  @override
  String get catalogueInStockOnly => 'শুধু স্টকে থাকা';

  @override
  String get catalogueWithPhotoOnly => 'শুধু ছবি সহ';

  @override
  String get catalogueRate => 'দর';

  @override
  String get catalogueRateFrom => 'দর থেকে';

  @override
  String get catalogueRateTo => 'দর পর্যন্ত';

  @override
  String get catalogueReceived => 'এর মধ্যে এসেছে';

  @override
  String get catalogueReceivedFrom => 'থেকে এসেছে';

  @override
  String get catalogueReceivedTo => 'পর্যন্ত এসেছে';

  @override
  String get catalogueApply => 'প্রয়োগ করুন';

  @override
  String get catalogueBrand => 'ব্র্যান্ড';

  @override
  String get catalogueCategory => 'বিভাগ';

  @override
  String get catalogueSeason => 'মরসুম';

  @override
  String get catalogueClear => 'ফিল্টার মুছুন';

  @override
  String catalogueDefaultName(String party) {
    return '$party-এর জন্য';
  }

  @override
  String get catalogueUntitled => 'নতুন বাছাই';

  @override
  String get catalogueCartTitle => 'কার্ট';

  @override
  String get catalogueCartEmpty => 'কার্ট খালি। কোনো ডিজাইনে যোগ চাপুন।';

  @override
  String get catalogueSelectionName => 'বাছাইয়ের নাম';

  @override
  String get catalogueForParty => 'পার্টির জন্য';

  @override
  String get catalogueAnyone => 'যে কেউ';

  @override
  String get catalogueSaveSelection => 'বাছাই সংরক্ষণ';

  @override
  String get catalogueEmptyCart => 'কার্ট খালি করুন';

  @override
  String get catalogueColsCode => 'ডিজাইন নং';

  @override
  String get catalogueColsName => 'নাম';

  @override
  String get catalogueColsSize => 'সাইজ';

  @override
  String get catalogueColsRate => 'দর';

  @override
  String get catalogueColsMrp => 'MRP';

  @override
  String get catalogueColsStock => 'স্টক';

  @override
  String get cataloguePrintPdf => 'প্রিন্ট বা PDF';

  @override
  String get catalogueExportExcel => 'Excel-এ এক্সপোর্ট';

  @override
  String get catalogueShowPrices => 'দাম দেখান';

  @override
  String get catalogueShowStock => 'স্টকে থাকা সাইজ দেখান';

  @override
  String get catalogueDeleteConfirm =>
      'এই বাছাই মুছবেন? শেয়ার করা লিংক বন্ধ হবে।';

  @override
  String get catalogueDelete => 'বাছাই মুছুন';

  @override
  String get catalogueShareTitle => 'শেয়ার করুন';

  @override
  String catalogueSharedUntil(String date) {
    return 'একটি লিংক $date পর্যন্ত চালু। নতুন বানালে পুরনোটি বন্ধ হবে।';
  }

  @override
  String get catalogueShareHint =>
      'লগইন ছাড়াই এই ক্যাটালগ খোলে এমন লিংক বানান, তারপর কপি করুন বা WhatsApp-এ পাঠান।';

  @override
  String get catalogueLinkWorksFor => 'লিংক চলবে';

  @override
  String catalogueDays(String n) {
    return '$n দিন';
  }

  @override
  String get catalogueNewLink => 'নতুন লিংক বানান';

  @override
  String get catalogueMakeLink => 'লিংক বানান';

  @override
  String get catalogueStopSharing => 'শেয়ার বন্ধ করুন';

  @override
  String get catalogueLink => 'লিংক';

  @override
  String get catalogueCopied => 'লিংক কপি হয়েছে।';

  @override
  String get catalogueCopy => 'কপি';

  @override
  String get catalogueWhatsappTo => 'WhatsApp নম্বর';

  @override
  String catalogueSentDemo(String to) {
    return '$to-তে পাঠানো হিসেবে রেকর্ড হয়েছে (ডেমো: এখনও WhatsApp প্রদানকারী সেট নেই)।';
  }

  @override
  String catalogueSent(String to) {
    return '$to-তে WhatsApp-এ পাঠানো হয়েছে।';
  }

  @override
  String get catalogueSendWhatsapp => 'WhatsApp-এ পাঠান';

  @override
  String catalogueOrderHint(String party) {
    return '$party-এর জন্য সেলস অর্ডার বানাতে সাইজ অনুযায়ী পরিমাণ লিখুন।';
  }

  @override
  String catalogueMrp(String v) {
    return 'MRP $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'পিস: $pieces, কর ছাড়া $value';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'ক্যাটালগ বাছাই $name থেকে';
  }

  @override
  String get catalogueMakeOrder => 'সেলস অর্ডার বানান';

  @override
  String catalogueForPartyLine(String party) {
    return '$party-এর জন্য';
  }

  @override
  String get catalogueSelectionSubtitle => 'একটি ক্যাটালগ বাছাই';

  @override
  String get catalogueLinkExpiredTitle => 'এই ক্যাটালগ আর শেয়ার করা নেই';

  @override
  String get catalogueLinkExpired =>
      'লিংকের মেয়াদ শেষ বা বদলানো হয়েছে। প্রেরকের কাছে নতুন লিংক চান।';

  @override
  String get catalogueErrorsUnknownStyle => 'সেই ডিজাইন আর নেই।';

  @override
  String get catalogueErrorsUnknownColor => 'এই ডিজাইনে এই রং নেই।';

  @override
  String get catalogueErrorsUnknownFile => 'ছবি আপলোড হয়নি। আবার চেষ্টা করুন।';

  @override
  String get catalogueErrorsFileType => 'JPEG, PNG বা WebP ছবি দিন।';

  @override
  String get catalogueErrorsFileTooLarge => 'ছবিটি খুব বড়।';

  @override
  String get catalogueErrorsFileEmpty => 'ছবিটি খালি।';

  @override
  String get catalogueErrorsDuplicateImage =>
      'এই ছবি এই ডিজাইন ও রঙে আগেই আছে।';

  @override
  String get catalogueErrorsNoLines => 'অন্তত একটি ডিজাইন যোগ করুন।';

  @override
  String get catalogueErrorsDuplicateLine =>
      'একটি ডিজাইন ও রং তালিকায় দুবার আছে।';

  @override
  String get catalogueErrorsUnknownAccount => 'তালিকা থেকে পার্টি বাছুন।';

  @override
  String get catalogueErrorsInvalidDays => 'লিংক 1 থেকে 90 দিন চলতে পারে।';

  @override
  String get catalogueErrorsShareLinkStale =>
      'সেই লিংক আর চালু নেই। আগে নতুন লিংক বানান।';

  @override
  String get catalogueErrorsInvalidPhone =>
      '10 সংখ্যার ভারতীয় মোবাইল নম্বর লিখুন।';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp বার্তাটি নেয়নি। পরে চেষ্টা করুন।';

  @override
  String get labelsTitle => 'বারকোড ও দামের লেবেল';

  @override
  String get labelsSubtitle =>
      'লেবেল রোল, A4 শিট বা হ্যাং ট্যাগে বারকোড, MRP ও সাইজসহ ট্যাগ ছাপুন।';

  @override
  String get labelsSearch => 'বারকোড স্ক্যান করুন বা নাম লিখুন';

  @override
  String get labelsWholeDesign => 'পুরো ডিজাইন';

  @override
  String get labelsAddOneEach => 'প্রতি সাইজের একটি';

  @override
  String get labelsAddStock => 'স্টকের প্রতি পিসে একটি';

  @override
  String get labelsItem => 'আইটেম';

  @override
  String get labelsBarcode => 'বারকোড';

  @override
  String get labelsMrp => 'MRP';

  @override
  String get labelsPrice => 'দাম';

  @override
  String get labelsLabels => 'লেবেল';

  @override
  String get labelsNoBarcode => 'নেই';

  @override
  String get labelsRemove => 'সরান';

  @override
  String get labelsEmpty =>
      'লেবেল যোগ করতে আইটেম স্ক্যান বা খুঁজুন, অথবা ডিজাইন বাছুন।';

  @override
  String get labelsStock => 'লেবেলের ধরন';

  @override
  String get labelsTemplatesRoll50x25 => 'রোল, 50 x 25 mm, এক সারি';

  @override
  String get labelsTemplatesRoll38x25x2 => 'রোল, 38 x 25 mm, দুই সারি';

  @override
  String get labelsTemplatesA4x65 => 'A4 শিট, 65 লেবেল (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'হ্যাং ট্যাগ, 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'ব্যবসার নাম';

  @override
  String get labelsFieldsName => 'আইটেমের নাম';

  @override
  String get labelsFieldsDesign => 'ডিজাইন নং';

  @override
  String get labelsFieldsColourSize => 'রং ও সাইজ';

  @override
  String get labelsFieldsMrp => 'MRP';

  @override
  String get labelsFieldsPrice => 'বিক্রয় দাম';

  @override
  String get labelsFieldsExtra => 'অতিরিক্ত লাইন';

  @override
  String get labelsExtraText => 'অতিরিক্ত লাইনের লেখা';

  @override
  String get labelsExtraHint => 'যেমন তৈরির মাস বা প্রস্তুতকারকের ঠিকানা।';

  @override
  String get labelsPreview => 'আসল মাপে প্রিভিউ';

  @override
  String get labelsPreviewEmpty => 'লেবেল দেখতে আইটেম যোগ করুন।';

  @override
  String labelsPrint(String n) {
    return '$nটি লেবেল ছাপুন';
  }

  @override
  String get labelsPrintHint =>
      'প্রিন্ট উইন্ডো লেবেলের মাপে খোলে; লেবেল প্রিন্টার বাছুন ও মার্জিন শূন্য রাখুন।';

  @override
  String get labelsNothingToPrint =>
      'ছাপার কিছু নেই। ইনভেন্টরিতে লেবেল বাছুন, তারপর প্রিন্ট চাপুন।';

  @override
  String get labelsForBill => 'এই মালের লেবেল ছাপুন';

  @override
  String get labelsPrintLabels => 'লেবেল ছাপুন';

  @override
  String get shareSendWhatsApp => 'হোয়াটসঅ্যাপে পাঠান';

  @override
  String get shareSend => 'পাঠান';

  @override
  String get shareMobile => 'মোবাইল নম্বর';

  @override
  String shareSentTo(String to) {
    return '$to নম্বরে হোয়াটসঅ্যাপ পাঠানো হয়েছে';
  }

  @override
  String get shareAgain => 'আবার পাঠান';

  @override
  String get shareFailed => 'পাঠানো যায়নি। নম্বর দেখে আবার চেষ্টা করুন।';

  @override
  String get shareAutoFailed =>
      'বিল নিজে থেকে হোয়াটসঅ্যাপে যায়নি। আবার পাঠান।';

  @override
  String get shareRemind => 'মনে করান';

  @override
  String get shareRemindAll => 'সব বকেয়াদারকে মনে করান';

  @override
  String get shareRemindAllConfirm =>
      'বকেয়া বিল থাকা প্রত্যেক গ্রাহককে হোয়াটসঅ্যাপে পেমেন্টের রিমাইন্ডার পাঠাবেন?';

  @override
  String get shareReminded => 'রিমাইন্ডার পাঠানো হয়েছে';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি রিমাইন্ডার পাঠানো হয়েছে',
      zero: 'কোনো রিমাইন্ডার পাঠানো হয়নি',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'মোবাইল নম্বর নেই, ফোন করুন: $names';
  }

  @override
  String get shareLogTitle => 'হোয়াটসঅ্যাপ লগ';

  @override
  String get shareLogSubtitle =>
      'গ্রাহকদের পাঠানো সব বিল, ইনভয়েস, রিমাইন্ডার ও বার্তা, নতুনগুলো আগে।';

  @override
  String get shareFilterAll => 'সব';

  @override
  String get shareFilterSent => 'পাঠানো';

  @override
  String get shareFilterFailed => 'ব্যর্থ';

  @override
  String get shareThisMonth => 'সংখ্যা এই মাসের';

  @override
  String get shareWhen => 'কখন';

  @override
  String get shareToCol => 'কাকে';

  @override
  String get shareKind => 'ধরন';

  @override
  String get shareMessage => 'বার্তা';

  @override
  String get shareStatus => 'অবস্থা';

  @override
  String shareBy(String name) {
    return '$name পাঠিয়েছেন';
  }

  @override
  String get shareNone =>
      'এখনও কোনো বার্তা নেই। হোয়াটসঅ্যাপে পাঠানো বিল, ইনভয়েস ও রিমাইন্ডার এখানে দেখা যাবে।';

  @override
  String get shareKindsBillShare => 'কাউন্টার বিল';

  @override
  String get shareKindsInvoiceShare => 'ইনভয়েস';

  @override
  String get shareKindsPaymentReminderLink => 'পেমেন্ট রিমাইন্ডার';

  @override
  String get shareKindsPaymentReminder => 'পেমেন্ট রিমাইন্ডার';

  @override
  String get shareKindsOrderConfirmation => 'অর্ডার নিশ্চিতকরণ';

  @override
  String get shareKindsFollowUp => 'ফলো-আপ';

  @override
  String get shareExpiredTitle => 'এই লিংকটি আর চালু নেই';

  @override
  String get shareExpired => 'লিংকের মেয়াদ শেষ। দোকানকে আবার পাঠাতে বলুন।';

  @override
  String get shareStatement => 'হিসাব বিবরণী';

  @override
  String shareStatementFor(String name) {
    return '$name-এর হিসাব বিবরণী';
  }

  @override
  String shareAsOf(String date) {
    return '$date পর্যন্ত';
  }

  @override
  String get shareBalance => 'বকেয়া টাকা';

  @override
  String shareOverdue(String amount) {
    return '₹$amount মেয়াদোত্তীর্ণ';
  }

  @override
  String get shareBill => 'বিল';

  @override
  String get shareDate => 'তারিখ';

  @override
  String get shareDue => 'দেয় তারিখ';

  @override
  String get shareLate => 'দেরি';

  @override
  String get shareAmount => 'টাকা';

  @override
  String shareDays(num n) {
    return '$n দিন';
  }

  @override
  String get shareNotDue => 'এখনও দেয় নয়';

  @override
  String get shareNothingOpen => 'কিছুই বকেয়া নেই। ধন্যবাদ।';

  @override
  String shareAdvance(String amount) {
    return 'বাদ, অগ্রিম দেওয়া: ₹$amount';
  }

  @override
  String get sharePayTo => 'এখানে টাকা দিন';

  @override
  String get shareStatementNote =>
      'আপনি টাকা দিয়ে থাকলে এই বিবরণী উপেক্ষা করুন বা পেমেন্টের তথ্য আমাদের পাঠান।';

  @override
  String get shareErrorsInvalidPhone => '10 সংখ্যার মোবাইল নম্বর দিন।';

  @override
  String get shareErrorsNothingOutstanding => 'কিছুই বকেয়া নেই।';

  @override
  String get shareErrorsSendFailed =>
      'হোয়াটসঅ্যাপ বার্তাটি নেয়নি। আবার চেষ্টা করুন।';

  @override
  String get shareErrorsOutside24hWindow =>
      'এই গ্রাহক 24 ঘণ্টায় বার্তা দেননি, তাই হোয়াটসঅ্যাপের অনুমোদিত টেমপ্লেট লাগবে। মেসেজ টেমপ্লেটে তার অনুমোদিত নাম দিন।';

  @override
  String get shareErrorsBillVoid => 'এই বিলটি বাতিল হয়েছে।';

  @override
  String get shareErrorsInvoiceCancelled => 'এই ইনভয়েসটি বাতিল হয়েছে।';

  @override
  String get shareErrorsUnknownTemplate =>
      'মেসেজ টেমপ্লেট আর্কাইভ হয়েছে। মেসেজ টেমপ্লেটে তা ফিরিয়ে আনুন।';

  @override
  String get launcherTitle => 'সব কাজ';

  @override
  String get launcherSubtitle =>
      'প্রতিটি এন্ট্রি, স্ক্রিন ও রিপোর্ট এক জায়গায়। তারা চেপে টাইল আমার মেনুতে যোগ করুন।';

  @override
  String get launcherFilter => 'কাজ খুঁজতে লিখুন';

  @override
  String get launcherPin => 'আমার মেনুতে যোগ করুন';

  @override
  String get launcherUnpin => 'আমার মেনু থেকে সরান';

  @override
  String get launcherSaveFailed => 'আমার মেনু সংরক্ষণ হয়নি। আবার চেষ্টা করুন।';

  @override
  String get launcherNoMatch => 'এর সঙ্গে কিছু মেলে না।';

  @override
  String get launcherDone => 'হয়ে গেছে';

  @override
  String get launcherEdit => 'টাইল বদলান';

  @override
  String get launcherAddTiles => 'টাইল যোগ করুন';

  @override
  String get launcherReset => 'আগের টাইলে ফিরুন';

  @override
  String get launcherMoveLeft => 'আগে সরান';

  @override
  String get launcherMoveRight => 'পরে সরান';

  @override
  String get launcherEmpty => 'এখনও কোনো টাইল নেই। সব কাজ থেকে যোগ করুন।';

  @override
  String get launcherMyMenu => 'আমার মেনু';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'নমস্কার $name। আপনার নিজের টাইল; টাইল বদলান দিয়ে বদলান।';
  }

  @override
  String get launcherWaiting => 'আপনার অপেক্ষায়';

  @override
  String get launcherSalesToday => 'আজকের বিক্রি';

  @override
  String get launcherToCollect => 'আদায় করতে হবে';

  @override
  String get launcherToPay => 'দিতে হবে';

  @override
  String launcherOverdue(String amount) {
    return '$amount মেয়াদোত্তীর্ণ';
  }

  @override
  String get launcherFullDashboard => 'পুরো ড্যাশবোর্ড';

  @override
  String get launcherGroupsEntries => 'নতুন এন্ট্রি';

  @override
  String get launcherGroupsPos => 'শোরুম কাউন্টার';

  @override
  String get launcherGroupsSales => 'বিক্রি';

  @override
  String get launcherGroupsPurchase => 'ক্রয়';

  @override
  String get launcherGroupsInventory => 'স্টক';

  @override
  String get launcherGroupsManufacturing => 'উৎপাদন ও জব ওয়ার্ক';

  @override
  String get launcherGroupsAccounts => 'হিসাব ও GST';

  @override
  String get launcherGroupsBanking => 'ব্যাংকিং';

  @override
  String get launcherGroupsReports => 'রিপোর্ট';

  @override
  String get launcherGroupsCrm => 'গ্রাহক ও হোয়াটসঅ্যাপ';

  @override
  String get launcherGroupsHr => 'কর্মী ও বেতন';

  @override
  String get launcherGroupsExpenses => 'খরচ';

  @override
  String get launcherGroupsAssets => 'স্থায়ী সম্পদ';

  @override
  String get launcherGroupsProjects => 'প্রকল্প';

  @override
  String get launcherGroupsHome => 'হোম';

  @override
  String get launcherGroupsSettings => 'সেটিং';

  @override
  String get launcherLaunchpad => 'লঞ্চপ্যাড';

  @override
  String launcherPinned(String n) {
    return '$nটি পিন করা';
  }

  @override
  String get launcherRecent => 'সম্প্রতি খোলা';

  @override
  String get launcherMoney => 'আজকের টাকা';

  @override
  String launcherVsYesterday(String pct) {
    return 'গতকালের তুলনায় $pct%';
  }

  @override
  String launcherCounterBills(num n) {
    return '$nটি কাউন্টার বিল';
  }

  @override
  String get launcherCashToday => 'কাউন্টারে নগদ';

  @override
  String get launcherUpiToday => 'কাউন্টারে UPI';

  @override
  String get launcherCardToday => 'কাউন্টারে কার্ড';

  @override
  String get launcherOverdueToCollect => 'মেয়াদোত্তীর্ণ আদায়';

  @override
  String get launcherAllTab => 'সবকিছু';

  @override
  String get launcherGridView => 'টাইল';

  @override
  String get launcherListView => 'তালিকা';

  @override
  String get launcherOpen => 'খুলুন';

  @override
  String launcherCount(String n) {
    return '$nটি স্ক্রিন ও এন্ট্রি যা আপনি খুলতে পারেন';
  }

  @override
  String get menuHMasters => 'মাস্টার';

  @override
  String get menuHTransaction => 'লেনদেন';

  @override
  String get menuHReports => 'রিপোর্ট';

  @override
  String get menuHAccountReports => 'হিসাব রিপোর্ট';

  @override
  String get menuHPayroll => 'বেতন';

  @override
  String get menuHUtility => 'ইউটিলিটি';

  @override
  String get menuHChat => 'চ্যাট';

  @override
  String get menuHExit => 'প্রস্থান';

  @override
  String get menuSoon => 'শীঘ্রই';

  @override
  String get menuNotBuilt => 'এখনও তৈরি হয়নি; তালিকায় আছে।';

  @override
  String get menuFilter => 'ফিল্টার';

  @override
  String get menuHome => 'হোম';

  @override
  String get menuOpenScreens => 'খোলা স্ক্রিন';

  @override
  String get menuGAccount => 'হিসাব';

  @override
  String get menuGStock => 'স্টক';

  @override
  String get menuGParameters => 'প্যারামিটার';

  @override
  String get menuGPromotion => 'প্রোমোশন মাস্টার';

  @override
  String get menuGSales => 'বিক্রয় লেনদেন';

  @override
  String get menuGAccounting => 'হিসাব লেনদেন';

  @override
  String get menuGPurchase => 'ক্রয় লেনদেন';

  @override
  String get menuGJobwork => 'জবওয়ার্ক লেনদেন';

  @override
  String get menuGOther => 'অন্যান্য লেনদেন';

  @override
  String get menuGSalesReports => 'বিক্রয় রিপোর্ট';

  @override
  String get menuGStockReports => 'স্টক রিপোর্ট';

  @override
  String get menuGCustomReports => 'নিজস্ব রিপোর্ট ও যাচাই';

  @override
  String get menuGAccountReportsGroup => 'হিসাব রিপোর্ট গ্রুপ';

  @override
  String get menuGFinalReportGroup => 'চূড়ান্ত রিপোর্ট গ্রুপ';

  @override
  String get menuGMasterGroup => 'মাস্টার গ্রুপ';

  @override
  String get menuGPayrollTransactionGroup => 'বেতন লেনদেন গ্রুপ';

  @override
  String get menuGReportGroup => 'রিপোর্ট গ্রুপ';

  @override
  String get menuGUtilityGroup => 'ইউটিলিটি গ্রুপ';

  @override
  String get menuGBarcodeGroup => 'বারকোড গ্রুপ';

  @override
  String get menuGExtraUtility => 'অতিরিক্ত ইউটিলিটি';

  @override
  String get menuGUserManagement => 'ব্যবহারকারী ব্যবস্থাপনা';

  @override
  String get menuGSoftwareUtility => 'সফটওয়্যার ইউটিলিটি';

  @override
  String get menuGChatGroup => 'চ্যাট ও গ্রাহক';

  @override
  String get menuIAccountMaster => 'খাতা মাস্টার';

  @override
  String get menuIBankMaster => 'ব্যাংক মাস্টার';

  @override
  String get menuIOpeningBalance => 'প্রারম্ভিক জের';

  @override
  String get menuIBalanceSheetGroup => 'ব্যালেন্স শিট গ্রুপ';

  @override
  String get menuIAccountGroup => 'খাতা গ্রুপ';

  @override
  String get menuIAccountCategory => 'খাতা শ্রেণি';

  @override
  String get menuIRegionMaster => 'অঞ্চল মাস্টার';

  @override
  String get menuICustomerSubCategory => 'গ্রাহক উপ-শ্রেণি';

  @override
  String get menuIRemarksMaster => 'মন্তব্য মাস্টার';

  @override
  String get menuICompanyMaster => 'কোম্পানি মাস্টার';

  @override
  String get menuICountryMaster => 'দেশ মাস্টার';

  @override
  String get menuIDepartmentMaster => 'বিভাগ মাস্টার';

  @override
  String get menuIManufactureCompany => 'প্রস্তুতকারক কোম্পানি';

  @override
  String get menuIBrandMaster => 'ব্র্যান্ড মাস্টার';

  @override
  String get menuIProductMaster => 'পণ্য মাস্টার';

  @override
  String get menuIStyleMaster => 'স্টাইল মাস্টার';

  @override
  String get menuIItemGroup => 'আইটেম গ্রুপ';

  @override
  String get menuIItemMaster => 'আইটেম মাস্টার';

  @override
  String get menuIDesignMaster => 'ডিজাইন মাস্টার';

  @override
  String get menuIColorMaster => 'রং মাস্টার';

  @override
  String get menuISizeGroupMaster => 'সাইজ গ্রুপ মাস্টার';

  @override
  String get menuISizeMaster => 'সাইজ মাস্টার';

  @override
  String get menuIFabric => 'কাপড়';

  @override
  String get menuISleeves => 'হাতা';

  @override
  String get menuINeck => 'গলা';

  @override
  String get menuIFit => 'ফিট';

  @override
  String get menuISeason => 'মরসুম';

  @override
  String get menuIStyleAttr => 'স্টাইল';

  @override
  String get menuIGender => 'লিঙ্গ';

  @override
  String get menuITypeMaster => 'ধরন মাস্টার';

  @override
  String get menuISubCategory9 => 'উপ-শ্রেণি 9';

  @override
  String get menuISubCategory10 => 'উপ-শ্রেণি 10';

  @override
  String get menuIMaterialMaster => 'উপাদান মাস্টার';

  @override
  String get menuIFixedBarcode => 'স্থির বারকোড';

  @override
  String get menuIMinMaxStock => 'ন্যূনতম সর্বোচ্চ স্টক';

  @override
  String get menuIOpeningStock => 'প্রারম্ভিক স্টক';

  @override
  String get menuISeasonMaster => 'মরসুম মাস্টার';

  @override
  String get menuIProcessMaster => 'প্রক্রিয়া মাস্টার';

  @override
  String get menuIOrderType => 'অর্ডারের ধরন';

  @override
  String get menuIWarehouses => 'গুদাম ও স্টোর';

  @override
  String get menuIDayBookMaster => 'ডেবুক মাস্টার';

  @override
  String get menuILedgerParameter => 'খাতা প্যারামিটার';

  @override
  String get menuISalesmanMaster => 'বিক্রয়কর্মী মাস্টার';

  @override
  String get menuITaxMaster => 'কর মাস্টার';

  @override
  String get menuITdsMaster => 'TDS মাস্টার';

  @override
  String get menuITcsTaxMaster => 'TCS কর মাস্টার';

  @override
  String get menuIFinanceYearMaster => 'অর্থবর্ষ মাস্টার';

  @override
  String get menuIHsnCodeMaster => 'HSN কোড মাস্টার';

  @override
  String get menuISalesReturnReason => 'বিক্রয় ফেরতের কারণ';

  @override
  String get menuISalesmanCommTarget => 'বিক্রয়কর্মী কমিশন লক্ষ্য';

  @override
  String get menuIItemDiscountSetup => 'আইটেম ছাড় সেটআপ';

  @override
  String get menuIPromoMaster => 'প্রোমো মাস্টার';

  @override
  String get menuISisSetup => 'SIS সেটআপ';

  @override
  String get menuIItemCommissionSetup => 'আইটেম কমিশন সেটআপ';

  @override
  String get menuISourceMaster => 'উৎস মাস্টার';

  @override
  String get menuISalesOrderWh => 'বিক্রয় অর্ডার (পাইকারি)';

  @override
  String get menuIWhSalesOrderCancel => 'পাইকারি অর্ডার বাতিল';

  @override
  String get menuIDeliveryOrder => 'ডেলিভারি অর্ডার (D.O)';

  @override
  String get menuIDeliveryChallan => 'ডেলিভারি চালান';

  @override
  String get menuISalesBillWh => 'বিক্রয় বিল (পাইকারি)';

  @override
  String get menuIDeliveryChallanReturnWh => 'ডেলিভারি চালান ফেরত (পাইকারি)';

  @override
  String get menuICreditNoteWh => 'ক্রেডিট নোট (পাইকারি)';

  @override
  String get menuIAdvanceReceipt => 'অগ্রিম রসিদ';

  @override
  String get menuICashPayRec => 'নগদ প্রদান/প্রাপ্তি';

  @override
  String get menuIBankPayRec => 'ব্যাংক প্রদান/প্রাপ্তি';

  @override
  String get menuIBillWiseReceipt => 'বিল অনুযায়ী রসিদ';

  @override
  String get menuICardReceipt => 'কার্ড রসিদ';

  @override
  String get menuIJournalVoucher => 'জার্নাল ভাউচার';

  @override
  String get menuIContraVoucher => 'কনট্রা ভাউচার';

  @override
  String get menuIPurchaseOrder => 'ক্রয় অর্ডার';

  @override
  String get menuIInwardChallan => 'ইনওয়ার্ড চালান';

  @override
  String get menuIPurchase => 'ক্রয়';

  @override
  String get menuIGoodsReturn => 'মাল ফেরত';

  @override
  String get menuIDebitNote => 'ডেবিট নোট';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'জব ইস্যু';

  @override
  String get menuIJobReceipt => 'জব রসিদ';

  @override
  String get menuIJobWorkIssue => 'জবওয়ার্ক ইস্যু';

  @override
  String get menuIJobWorkReceipt => 'জবওয়ার্ক রসিদ';

  @override
  String get menuIStockAdjustment => 'স্টক সমন্বয়';

  @override
  String get menuISampleIssue => 'নমুনা ইস্যু';

  @override
  String get menuISampleReceive => 'নমুনা প্রাপ্তি';

  @override
  String get menuIQuotation => 'কোটেশন';

  @override
  String get menuILrTransportEntry => 'LR/পরিবহন এন্ট্রি';

  @override
  String get menuIEWayBill => 'ই-ওয়ে বিল';

  @override
  String get menuIRePackingBox => 'রিপ্যাকিং বাক্স';

  @override
  String get menuIReOpenBox => 'বাক্স আবার খুলুন';

  @override
  String get menuILedgerReport => 'খতিয়ান রিপোর্ট';

  @override
  String get menuICashBookReport => 'নগদ খাতা রিপোর্ট';

  @override
  String get menuIBankReport => 'ব্যাংক রিপোর্ট';

  @override
  String get menuIBankReconciliation => 'ব্যাংক মিলকরণ';

  @override
  String get menuIGroupMonthSummary => 'গ্রুপ/মাস সারাংশ';

  @override
  String get menuICashBankExpense => 'নগদ ব্যাংক খরচ';

  @override
  String get menuICashFlowReportGroup => 'নগদ প্রবাহ রিপোর্ট';

  @override
  String get menuIBillToBillAdjustment => 'বিল থেকে বিল সমন্বয়';

  @override
  String get menuIMsmeReport => 'MSME রিপোর্ট';

  @override
  String get menuIOutstandingPayable => 'বকেয়া প্রদেয়';

  @override
  String get menuIOutstandingReceivable => 'বকেয়া প্রাপ্য';

  @override
  String get menuIDebtorsList => 'দেনাদার তালিকা';

  @override
  String get menuICreditorList => 'পাওনাদার তালিকা';

  @override
  String get menuIInterestReport => 'সুদ রিপোর্ট';

  @override
  String get menuIDepreciationAssetReport => 'অবচয় সম্পদ রিপোর্ট';

  @override
  String get menuIJournalVoucherReport => 'জার্নাল ভাউচার রিপোর্ট';

  @override
  String get menuIGstReport => 'GST রিপোর্ট';

  @override
  String get menuITdsReport => 'TDS রিপোর্ট';

  @override
  String get menuITdsForm26q => 'TDS ফর্ম 26Q';

  @override
  String get menuIFinalReport => 'চূড়ান্ত রিপোর্ট';

  @override
  String get menuIRcmRegister => 'RCM রেজিস্টার';

  @override
  String get menuITcsReport => 'TCS রিপোর্ট';

  @override
  String get menuIEmployee => 'কর্মী';

  @override
  String get menuIEmployeeKyc => 'কর্মী KYC আপডেট';

  @override
  String get menuISalaryDeduction => 'বেতন কর্তন';

  @override
  String get menuIWeekOff => 'সাপ্তাহিক ছুটি';

  @override
  String get menuIWeekOffCancel => 'সাপ্তাহিক ছুটি বাতিল';

  @override
  String get menuIHolidays => 'ছুটির দিন';

  @override
  String get menuIDesignation => 'পদবি';

  @override
  String get menuIDepartment => 'বিভাগ';

  @override
  String get menuIShiftMaster => 'শিফট মাস্টার';

  @override
  String get menuIDailyAttendance => 'দৈনিক উপস্থিতি';

  @override
  String get menuILeaveApplication => 'ছুটির আবেদন';

  @override
  String get menuIAdvanceSalary => 'অগ্রিম বেতন (উপাড়)';

  @override
  String get menuILoanIssue => 'ঋণ প্রদান';

  @override
  String get menuILoanReceipt => 'ঋণ আদায়';

  @override
  String get menuIMonthlySalary => 'মাসিক বেতন';

  @override
  String get menuIStipend => 'বৃত্তি';

  @override
  String get menuISalaryPayment => 'বেতন প্রদান';

  @override
  String get menuIStipendPayment => 'বৃত্তি প্রদান';

  @override
  String get menuIIncentive => 'প্রণোদনা';

  @override
  String get menuIOtherDeduction => 'অন্যান্য কর্তন';

  @override
  String get menuIAdvanceLoanRequest => 'অগ্রিম ও ঋণ অনুরোধ';

  @override
  String get menuIMonthlyAttendanceRegister => 'মাসিক উপস্থিতি রেজিস্টার';

  @override
  String get menuIDayWiseAttendanceRegister => 'দিনভিত্তিক উপস্থিতি রেজিস্টার';

  @override
  String get menuISalarySlipRegister => 'বেতন স্লিপ রেজিস্টার';

  @override
  String get menuIPtReport => 'PT রিপোর্ট';

  @override
  String get menuILeaveReport => 'ছুটির রিপোর্ট';

  @override
  String get menuIMenuLogSessionReport => 'মেনু লগ সেশন রিপোর্ট';

  @override
  String get menuIPayrollParameter => 'বেতন প্যারামিটার';

  @override
  String get menuIDeviceSettings => 'ডিভাইস সেটিং';

  @override
  String get menuIBarcodePrint => 'বারকোড প্রিন্ট';

  @override
  String get menuIBarcodeSearch => 'বারকোড অনুসন্ধান';

  @override
  String get menuIBarcodeDesignImage => 'বারকোড/ডিজাইন ছবি';

  @override
  String get menuIRateUpdation => 'দর হালনাগাদ';

  @override
  String get menuIImageCatalogue => 'ছবি ক্যাটালগ';

  @override
  String get menuISalesDiscountMaster => 'বিক্রয় ছাড় মাস্টার';

  @override
  String get menuISalesDiscountDesignWise => 'ডিজাইন অনুযায়ী বিক্রয় ছাড়';

  @override
  String get menuISalesmanCommission => 'বিক্রয়কর্মী কমিশন';

  @override
  String get menuIDayClose => 'দিন বন্ধ';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'ইমেল';

  @override
  String get menuIBulkMessenger => 'বাল্ক মেসেঞ্জার';

  @override
  String get menuILogHistoryReport => 'লগ ইতিহাস রিপোর্ট';

  @override
  String get menuIOutstandingAdj => 'বকেয়া সমন্বয়';

  @override
  String get menuIResetPhysicalStock => 'প্রকৃত স্টক রিসেট';

  @override
  String get menuIPhysicalStockVerification => 'প্রকৃত স্টক যাচাই';

  @override
  String get menuIMerge => 'একত্রীকরণ';

  @override
  String get menuISalesStockLedgerDiff => 'বিক্রয় স্টক খতিয়ান পার্থক্য';

  @override
  String get menuINoteReport => 'নোট রিপোর্ট';

  @override
  String get menuIEInvoiceUpload => 'ই-ইনভয়েস আপলোড';

  @override
  String get menuIEWayBillUpload => 'ই-ওয়ে বিল আপলোড';

  @override
  String get menuIAutoOutstandingReminder => 'স্বয়ংক্রিয় বকেয়া রিমাইন্ডার';

  @override
  String get menuIUsers => 'ব্যবহারকারী';

  @override
  String get menuIUserGroup => 'ব্যবহারকারী গ্রুপ';

  @override
  String get menuICurrentDateSetting => 'বর্তমান তারিখ সেটিং';

  @override
  String get menuIDataLockTillDate => 'তারিখ পর্যন্ত ডেটা লক';

  @override
  String get menuIMyDevices => 'আমার ডিভাইস';

  @override
  String get menuILedgerStockPosting => 'খতিয়ান ও স্টক পোস্টিং';

  @override
  String get menuIReportType => 'রিপোর্টের ধরন';

  @override
  String get menuIUserParameter => 'ব্যবহারকারী প্যারামিটার';

  @override
  String get menuIBalanceTransfer => 'জের স্থানান্তর';

  @override
  String get menuIDatabaseBackup => 'ডেটাবেস ব্যাকআপ';

  @override
  String get menuISoftwareUpdate => 'সফটওয়্যার আপডেট';

  @override
  String get menuIDbUpdates => 'DB আপডেট';

  @override
  String get menuIScheduleBackup => 'ব্যাকআপ সময়সূচি';

  @override
  String get menuIExportVouchersPdf => 'ভাউচার PDF-এ রপ্তানি';

  @override
  String get menuIEmployeeDepartment => 'বিভাগ';

  @override
  String get menuISensitiveChanges => 'সংবেদনশীল পরিবর্তন';

  @override
  String get menuITransporterMaster => 'ট্রান্সপোর্টার মাস্টার';

  @override
  String get listsSubtitle =>
      'এই ব্যবসার নিজস্ব তালিকা। এন্ট্রি মুছে না দিয়ে আর্কাইভ করুন, যাতে পুরনো নথিতে তার মান থেকে যায়।';

  @override
  String get listsName => 'নাম';

  @override
  String get listsCode => 'কোড';

  @override
  String get listsNote => 'নোট';

  @override
  String get listsNewEntry => 'নতুন এন্ট্রি';

  @override
  String listsShowArchived(String n) {
    return 'আর্কাইভ করা দেখান ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি এন্ট্রি',
      one: '$nটি এন্ট্রি',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'আর্কাইভ করুন';

  @override
  String get listsRestore => 'ফিরিয়ে আনুন';

  @override
  String get listsNoMatch => 'খোঁজের সঙ্গে কোনো এন্ট্রি মেলেনি।';

  @override
  String get listsEmpty =>
      'এই তালিকায় এখনও কিছু নেই। প্রথম এন্ট্রি উপরের লাইনে লিখুন।';

  @override
  String get listsEmptyReadOnly => 'এই তালিকায় এখনও কিছু নেই।';

  @override
  String get listsOtherLists => 'তালিকা';

  @override
  String get listsErrorsLookupTaken =>
      'এই তালিকায় এই নামের এন্ট্রি আগে থেকেই আছে।';

  @override
  String get listsErrorsEndBeforeStart => 'শেষের তারিখ শুরুর তারিখের আগে।';

  @override
  String get limitsTitle => 'সর্বনিম্ন ও সর্বোচ্চ স্টক';

  @override
  String get limitsSubtitle =>
      'প্রতিটি পণ্যের স্টক গুদামে সর্বনিম্ন ও সর্বোচ্চ কত থাকবে তা ঠিক করুন। সর্বনিম্নের নিচে থাকা পণ্যে চিহ্ন পড়ে, যাতে বোঝা যায় কী অর্ডার করতে হবে।';

  @override
  String get limitsWarehouse => 'গুদাম';

  @override
  String limitsOnlyBelow(String n) {
    return 'শুধু সর্বনিম্নের নিচে ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি সারি সংরক্ষিত',
      one: '$nটি সারি সংরক্ষিত',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return '$nটি পরিবর্তিত সারি সংরক্ষণ করুন';
  }

  @override
  String get limitsItem => 'পণ্য';

  @override
  String get limitsInStock => 'স্টকে আছে';

  @override
  String get limitsMin => 'সর্বনিম্ন';

  @override
  String get limitsMax => 'সর্বোচ্চ';

  @override
  String get limitsToOrder => 'অর্ডার করতে হবে';

  @override
  String get limitsBelow => 'সর্বনিম্নের নিচে';

  @override
  String get limitsNoMatch => 'কোনো পণ্য মেলেনি।';

  @override
  String get limitsEmpty =>
      'এখনও কোনো পণ্য নেই। আগে পণ্য বা স্টাইল যোগ করুন, তারপর এখানে সীমা ঠিক করুন।';

  @override
  String get limitsErrorsMaxBelowMin =>
      'সর্বোচ্চ সর্বনিম্নের চেয়ে কম হতে পারে না।';

  @override
  String get billReceiptTitleReceivable => 'বিল অনুযায়ী রসিদ';

  @override
  String get billReceiptTitlePayable => 'বিল অনুযায়ী পেমেন্ট';

  @override
  String get billReceiptSubtitleReceivable =>
      'পাওয়া টাকা লিখুন এবং কোন বিলগুলোর জন্য তা বেছে নিন। বাকি টাকা অ্যাকাউন্টে থাকে এবং সবচেয়ে পুরনো বিল মেটায়।';

  @override
  String get billReceiptSubtitlePayable =>
      'সরবরাহকারীকে দেওয়া পেমেন্ট লিখুন এবং কোন বিলগুলোর জন্য তা বেছে নিন। বাকি টাকা অ্যাকাউন্টে থাকে এবং সবচেয়ে পুরনো বিল মেটায়।';

  @override
  String get billReceiptTabReceipt => 'রসিদ';

  @override
  String get billReceiptTabPayment => 'পেমেন্ট';

  @override
  String get billReceiptCustomer => 'গ্রাহক';

  @override
  String get billReceiptSupplier => 'সরবরাহকারী';

  @override
  String get billReceiptChoose => 'পক্ষ বেছে নিন';

  @override
  String get billReceiptAccount => 'নগদ বা ব্যাংক অ্যাকাউন্ট';

  @override
  String get billReceiptAmountReceived => 'প্রাপ্ত টাকা';

  @override
  String get billReceiptAmountPaid => 'দেওয়া টাকা';

  @override
  String get billReceiptReference => 'রেফারেন্স (চেক, UPI আইডি)';

  @override
  String get billReceiptOpenBills => 'বকেয়া বিল';

  @override
  String billReceiptAdvance(String amount) {
    return 'আগে থেকেই অ্যাকাউন্টে: $amount';
  }

  @override
  String get billReceiptFillOldest => 'সবচেয়ে পুরনো থেকে ভরুন';

  @override
  String get billReceiptClear => 'মুছুন';

  @override
  String get billReceiptBill => 'বিল';

  @override
  String get billReceiptDueOn => 'দেয় তারিখ';

  @override
  String get billReceiptPending => 'বাকি';

  @override
  String get billReceiptPayNow => 'এখন মেটান';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n দিন দেরি',
      one: '$n দিন দেরি',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'এই পক্ষের কোনো বকেয়া বিল নেই।';

  @override
  String get billReceiptOnBills => 'বিলে';

  @override
  String get billReceiptOnAccount => 'অ্যাকাউন্টে';

  @override
  String get billReceiptSaveReceipt => 'রসিদ সংরক্ষণ করুন';

  @override
  String get billReceiptSavePayment => 'পেমেন্ট সংরক্ষণ করুন';

  @override
  String billReceiptSaved(String number) {
    return '$number হিসেবে সংরক্ষিত';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'বিলগুলোর মোট টাকা দেওয়া টাকার চেয়ে বেশি।';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'এর মধ্যে একটি বিল আর বকেয়া নেই। পেজ রিলোড করে আবার চেষ্টা করুন।';

  @override
  String get billReceiptErrorsOverBill =>
      'একটি টাকার অঙ্ক বিলের বকেয়ার চেয়ে বেশি।';

  @override
  String get billReceiptErrorsAmountRequired => 'টাকার অঙ্ক লিখুন।';

  @override
  String get billReceiptErrorsBillTwice => 'একই বিল দুবার আছে।';

  @override
  String get booksTitle => 'হিসাবের বই';

  @override
  String get booksSubtitle =>
      'নগদ ও ব্যাংকের লেনদেন, কোনো গ্রুপের মাসওয়ারি হিসাব, নগদ ও ব্যাংক থেকে খরচ, আর টাকা কোথা থেকে এল ও কোথায় গেল।';

  @override
  String get booksCash => 'নগদ বই';

  @override
  String get booksBank => 'ব্যাংক বই';

  @override
  String get booksGroup => 'গ্রুপ মাসওয়ারি';

  @override
  String get booksExpense => 'নগদ ও ব্যাংক খরচ';

  @override
  String get booksFlow => 'নগদ প্রবাহ';

  @override
  String get booksShow => 'দেখান';

  @override
  String get booksPickGroup => 'অ্যাকাউন্ট গ্রুপ';

  @override
  String get booksOpening => 'প্রারম্ভিক জের';

  @override
  String get booksReceipts => 'প্রাপ্তি';

  @override
  String get booksPayments => 'প্রদান';

  @override
  String get booksClosing => 'সমাপনী জের';

  @override
  String get booksAccounts => 'অ্যাকাউন্ট';

  @override
  String get booksByDay => 'দিনওয়ারি';

  @override
  String get booksMonth => 'মাস';

  @override
  String get booksDebit => 'ডেবিট';

  @override
  String get booksCredit => 'ক্রেডিট';

  @override
  String get booksExpenseAccount => 'খরচের অ্যাকাউন্ট';

  @override
  String get booksVouchers => 'ভাউচার';

  @override
  String get booksOtherSide => 'এন্ট্রির অপর পাশ';

  @override
  String get booksMoneyIn => 'আসা টাকা';

  @override
  String get booksMoneyOut => 'যাওয়া টাকা';

  @override
  String get booksNet => 'নিট';

  @override
  String get booksTotal => 'মোট';

  @override
  String get booksEmpty => 'এই সময়ে কিছু নেই।';

  @override
  String get booksNoAccounts => 'এই গ্রুপে এখনও কোনো অ্যাকাউন্ট নেই।';

  @override
  String get booksRcm => 'আরসিএম রেজিস্টার';

  @override
  String get booksAdjust => 'বিল থেকে বিল সমন্বয়';

  @override
  String get booksVoucher => 'ভাউচার';

  @override
  String get booksBill => 'মেটানো বিল';

  @override
  String get booksParty => 'পক্ষ';

  @override
  String get booksAmount => 'টাকা';

  @override
  String get booksSupplier => 'সরবরাহকারী';

  @override
  String get booksInvoice => 'সরবরাহকারীর বিল';

  @override
  String get booksTaxable => 'করযোগ্য';

  @override
  String get booksCgst => 'সিজিএসটি';

  @override
  String get booksSgst => 'এসজিএসটি / ইউটিজিএসটি';

  @override
  String get booksIgst => 'আইজিএসটি';

  @override
  String get booksCess => 'সেস';

  @override
  String get hubReportsTitle => 'রিপোর্ট';

  @override
  String get hubReportsSubtitle =>
      'প্রতিটি রিপোর্ট এক জায়গায়, কোন প্রশ্নের উত্তর দেয় সেই অনুযায়ী।';

  @override
  String get hubMastersTitle => 'মাস্টার';

  @override
  String get hubMastersSubtitle =>
      'যে রেকর্ডের উপর প্রতিটি বিল ও ভাউচার নির্ভর করে: কী বিক্রি করেন, কার সঙ্গে লেনদেন, দাম ও নিয়ম, স্টোর ও কাউন্টার।';

  @override
  String get hubGroupsMerchandise => 'পণ্য';

  @override
  String get hubGroupsParties => 'পার্টি ও মানুষ';

  @override
  String get hubGroupsCommercial => 'দাম, অফার ও কর';

  @override
  String get hubGroupsOperational => 'স্টোর, কাউন্টার ও নিয়ম';

  @override
  String get hubGroupsSales => 'বিক্রি';

  @override
  String get hubGroupsStock => 'স্টক';

  @override
  String get hubGroupsAccounts => 'হিসাব রিপোর্ট';

  @override
  String get hubGroupsTax => 'কর ও বিধিবদ্ধ';

  @override
  String get hubGroupsAudit => 'যাচাই ও অডিট';

  @override
  String get hubGroupsCustom => 'আপনার নিজের রিপোর্ট';

  @override
  String get hubAboutMerchandise => 'ডিজাইন, সাইজ, রং ও ছবি';

  @override
  String get hubAboutParties => 'গ্রাহক, সরবরাহকারী ও সব খাতা; কর্মী';

  @override
  String get hubAboutCommercial => 'জিনিস কত দামে বিক্রি হয় ও কোন GST লাগে';

  @override
  String get hubAboutOperational =>
      'স্টক কোথায় থাকে এবং কাউন্টার ও নম্বর কীভাবে চলে';

  @override
  String get hubAboutSales => 'কী বিক্রি হলো, কোথায়, কাকে';

  @override
  String get hubAboutStock => 'তাকে কী আছে ও কতদিন পড়ে আছে';

  @override
  String get hubAboutAccounts => 'কার কত পাওনা, লাভ ও খাতা';

  @override
  String get hubAboutTax => 'GST রিটার্ন, বেতন বিধিবদ্ধ ও কর অবচয়';

  @override
  String get hubAboutAudit => 'দেখার মতো ব্যতিক্রম ও কে কী বদলেছে';

  @override
  String get hubAboutCustom => 'নিজের রিপোর্ট বানান, সংরক্ষণ ও সময় ঠিক করুন';

  @override
  String get exchangeOpen => 'ফেরত বা বদল';

  @override
  String get exchangeTitle => 'এই বিলে ফেরত আসা মাল';

  @override
  String exchangeTaking(num pieces, String number) {
    return '$number থেকে $pieces পিস ফেরত';
  }

  @override
  String get exchangeCredit => 'ক্রেডিট';

  @override
  String get exchangeAdd => 'এই বিলে ফেরত নিন';

  @override
  String exchangeCreditUsed(String number) {
    return '$number-এর বিপরীতে ফেরত';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount ক্রেডিট বাকি; এটি স্টোর ক্রেডিট থাকবে।';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'ফেরত $number এই বিল থেকে $amount কমিয়েছে।';
  }

  @override
  String exchangeLeftCode(String amount) {
    return '$amount স্টোর ক্রেডিট বাকি, কোড:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'ফেরত (বিল $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'স্টোর ক্রেডিট $amount, কোড $code';
  }

  @override
  String get inwardTransporter => 'ট্রান্সপোর্টার';

  @override
  String get inwardLrNumber => 'LR নম্বর';

  @override
  String get inwardLrDate => 'LR তারিখ';

  @override
  String get inwardMarkup => 'মার্ক-আপ %';

  @override
  String get inwardMarkupHint => 'খরচ থেকে MRP বসায়';

  @override
  String get inwardRounding => 'MRP গোল করুন';

  @override
  String get inwardRound1 => 'নিকটতম টাকা';

  @override
  String get inwardRound9 => 'শেষে 9 (1,299)';

  @override
  String get inwardRound10 => 'পরের 10';

  @override
  String get inwardRound50 => 'পরের 50';

  @override
  String get inwardCost => 'খরচ';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'মার্ক-আপ';

  @override
  String get inwardMarkupTitle => 'খরচের উপর MRP, খরচের %';

  @override
  String get inwardMarginCol => 'মার্জিন';

  @override
  String get inwardMarginTitle => 'MRP থেকে খরচ পর্যন্ত কম, MRP-র %';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces পিস, খরচ $value';
  }

  @override
  String get inwardLastPurchases => 'শেষ ক্রয়';

  @override
  String get inwardPickLine => 'আগের খরচ দেখতে একটি লাইন বাছুন।';

  @override
  String get inwardCurrentMrp => 'বর্তমান MRP';

  @override
  String get inwardInStock => 'স্টকে';

  @override
  String get inwardDate => 'তারিখ';

  @override
  String get inwardNeverBought => 'আগে কেনা হয়নি।';

  @override
  String get inwardPrintLabels => 'এই পিসগুলোর লেবেল ছাপুন';

  @override
  String get inwardDocument => 'চালান';

  @override
  String get inwardState => 'রাজ্য';

  @override
  String get inwardTransport => 'পরিবহন';

  @override
  String get inwardSizeCurve => 'সাইজ অনুযায়ী পিস';

  @override
  String get inwardTotalQty => 'পিস';

  @override
  String get inwardAtCost => 'খরচে';

  @override
  String get inwardAvgMarkup => 'মার্ক-আপ';

  @override
  String get countsTitle => 'স্টক গণনা';

  @override
  String get countsSubtitle =>
      'বারকোড স্ক্যান করে স্টোর গুনুন। অনুমোদনকারী পার্থক্য ও তার মূল্য দেখেন, অনুমোদনে খাতা ঠিক হয়।';

  @override
  String get countsWholeStore => 'পুরো স্টোর';

  @override
  String get countsWhat => 'কী গুনবেন';

  @override
  String get countsByAll => 'স্টোরের সব মাল';

  @override
  String get countsByBrand => 'একটি ব্র্যান্ড';

  @override
  String get countsByCategory => 'একটি শ্রেণি';

  @override
  String get countsByStyleId => 'একটি ডিজাইন';

  @override
  String get countsName => 'নাম';

  @override
  String get countsNamePlaceholder => 'যেমন কুর্তার দেয়াল';

  @override
  String get countsBlind => 'ব্লাইন্ড গণনা (গণনাকারী খাতার সংখ্যা দেখেন না)';

  @override
  String get countsBlindShort => 'ব্লাইন্ড গণনা';

  @override
  String get countsStart => 'গণনা শুরু করুন';

  @override
  String get countsScanHere => 'বারকোড স্ক্যান করুন';

  @override
  String get countsAdd => 'যোগ করুন';

  @override
  String get countsScanHint =>
      'প্রতিটি স্ক্যানে একটি পিস যোগ হয়। পাঁচটির জন্য 5*বারকোড লিখুন, বা নিচের তালিকায় সংখ্যা লিখুন।';

  @override
  String get countsOutOfScope => 'এই গণনায় ছিল না, যোগ হলো';

  @override
  String get countsStatusCounting => 'গণনা চলছে';

  @override
  String get countsStatusSubmitted => 'অনুমোদনের অপেক্ষায়';

  @override
  String get countsStatusApproved => 'অনুমোদিত, খাতা ঠিক করা হয়েছে';

  @override
  String get countsStatusCancelled => 'বাতিল';

  @override
  String get countsJournal => 'স্টক সমন্বয় দেখুন';

  @override
  String get countsPiecesCounted => 'গোনা পিস';

  @override
  String get countsItemsCounted => 'গোনা আইটেম';

  @override
  String get countsInBooks => 'খাতায়';

  @override
  String get countsShort => 'কম (মূল্য)';

  @override
  String get countsExcess => 'বেশি (মূল্য)';

  @override
  String get countsNet => 'নিট পার্থক্য';

  @override
  String get countsBlindNote =>
      'ব্লাইন্ড গণনা: জমা দেওয়ার পর খাতার সংখ্যা দেখা যাবে।';

  @override
  String get countsSubmit => 'গণনা শেষ করুন';

  @override
  String get countsReason => 'পার্থক্যের কারণ';

  @override
  String countsApproveAdjust(num n) {
    return 'অনুমোদন করুন ও $nটি আইটেম ঠিক করুন';
  }

  @override
  String get countsApproveNone => 'অনুমোদন করুন (কোনো পার্থক্য নেই)';

  @override
  String get countsRecount => 'আবার গুনতে ফেরত পাঠান';

  @override
  String get countsWaitingApproval =>
      'মালিক বা অ্যাডমিন পার্থক্য অনুমোদন করেন।';

  @override
  String get countsCancelConfirm =>
      'এই গণনা বাতিল করবেন? খাতায় কিছু বদলাবে না।';

  @override
  String get countsCancel => 'গণনা বাতিল করুন';

  @override
  String get countsOnlyDiff => 'শুধু পার্থক্য থাকা আইটেম দেখান';

  @override
  String get countsItem => 'আইটেম';

  @override
  String get countsCounted => 'গোনা';

  @override
  String get countsDiff => 'পার্থক্য';

  @override
  String get countsValue => 'মূল্য';

  @override
  String get countsNoDiff => 'খাতা থেকে কিছু আলাদা নয়।';

  @override
  String get countsNumber => 'গণনা';

  @override
  String get countsStarted => 'শুরু';

  @override
  String get countsState => 'অবস্থা';

  @override
  String get countsNone => 'এখনও কোনো গণনা নেই।';

  @override
  String get countsErrorsCountClosed => 'এই গণনা আর খোলা নেই।';

  @override
  String get countsErrorsCountNotSubmitted => 'আগে গণনা শেষ করুন।';

  @override
  String get countsErrorsReasonRequired => 'পার্থক্যের কারণ লিখুন।';

  @override
  String get countsErrorsUnknownBarcode => 'এই বারকোডের কোনো আইটেম নেই।';

  @override
  String get countsErrorsNothingToCount =>
      'সেই বাছাইয়ের সঙ্গে কোনো মাল মেলে না।';

  @override
  String get countsErrorsUnknownWarehouse => 'স্টোর বাছুন।';

  @override
  String get countsErrorsTooManyCodes =>
      'ফাইলে ৫,০০০-এর বেশি আলাদা বারকোড আছে। ভাগ করে অংশে আমদানি করুন।';

  @override
  String get countsImportTitle => 'স্ক্যানার ফাইল আমদানি করুন';

  @override
  String get countsImportHelp =>
      'হ্যান্ডহেল্ড স্ক্যানারের টেক্সট ফাইল: প্রতি লাইনে একটি বারকোড, বা বারকোড ও পরিমাণ (\"8901234567890,3\")। একই বারকোড যোগ হয়ে যায়।';

  @override
  String get countsImportMode => 'সংখ্যাগুলো নিয়ে কী করবেন';

  @override
  String get countsImportAdd => 'যা গোনা হয়েছে তাতে যোগ করুন';

  @override
  String get countsImportReplace => 'এই বারকোডগুলোর গণনা বদলান';

  @override
  String get countsImportChoose => 'ফাইল বেছে নিন';

  @override
  String get countsImportReading => 'পড়ছে...';

  @override
  String get countsImportTooBig => 'এই ফাইল খুব বড় (২ এমবির বেশি)।';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matchedটি পণ্য গোনা হয়েছে',
      one: '$matchedটি পণ্য গোনা হয়েছে',
    );
    return '$_temp0, $pieces পিস';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি পণ্য এই গণনার তালিকায় ছিল না, যোগ করা হয়েছে।',
      one: '$nটি পণ্য এই গণনার তালিকায় ছিল না, যোগ করা হয়েছে।',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি কোড কোনো পণ্য নয়: $list',
      one: '$nটি কোড কোনো পণ্য নয়: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি লাইন পড়া যায়নি (লাইন $list)',
      one: '$nটি লাইন পড়া যায়নি (লাইন $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'স্টক সারাংশ';

  @override
  String stockSubtitle(String method) {
    return 'প্রতিটি পণ্যের পরিমাণ ও মূল্য। $method পদ্ধতিতে মূল্যায়ন।';
  }

  @override
  String get stockMethodAverage => 'চলমান গড়';

  @override
  String get stockMethodFifo => 'FIFO (আগে এলে আগে যায়)';

  @override
  String get stockWarehouse => 'গুদাম';

  @override
  String get stockAllWarehouses => 'সব গুদাম';

  @override
  String get stockQty => 'পরিমাণ';

  @override
  String get stockRate => 'দর';

  @override
  String get stockValue => 'মূল্য';

  @override
  String get stockTotalValue => 'মোট স্টকের মূল্য';

  @override
  String get stockBelowReorder => 'পুনরায় অর্ডার স্তরের নিচে';

  @override
  String get stockReorderTitle => 'পুনরায় অর্ডারের পণ্য';

  @override
  String get stockReorderEmpty => 'কোনো পণ্য পুনরায় অর্ডার স্তরের নিচে নেই।';

  @override
  String get stockSuggested => 'প্রস্তাবিত অর্ডার';

  @override
  String stockLedgerTitle(String item) {
    return 'স্টক খতিয়ান: $item';
  }

  @override
  String get stockIn => 'আগত';

  @override
  String get stockOut => 'নির্গত';

  @override
  String get stockSourceStockJournal => 'স্টক জার্নাল';

  @override
  String get stockSourceGrn => 'মাল প্রাপ্তি';

  @override
  String get stockSourcePurchaseBill => 'ক্রয় বিল';

  @override
  String get stockSourcePurchaseReturn => 'ক্রয় ফেরত';

  @override
  String get stockNegativeWarning =>
      'একটি পণ্যের স্টক শূন্যের নিচে গেছে। কোনো ক্রয় এন্ট্রি বাদ পড়েছে কিনা দেখুন।';

  @override
  String get sjTitle => 'স্টক জার্নাল';

  @override
  String get sjSubtitle =>
      'প্রারম্ভিক স্টক, গণনার পর সমন্বয়, গুদামের মধ্যে স্থানান্তর এবং খরচ।';

  @override
  String get sjNew => 'নতুন স্টক জার্নাল';

  @override
  String get sjKindsOpening => 'প্রারম্ভিক স্টক';

  @override
  String get sjKindsAdjustment => 'সমন্বয়';

  @override
  String get sjKindsTransfer => 'স্থানান্তর';

  @override
  String get sjKindsIssue => 'খরচ / ব্যবহার';

  @override
  String get sjKindHintsOpening =>
      'হিসাব শুরুর সময় আপনার কাছে থাকা স্টক। পরিমাণ ও দাম দিন।';

  @override
  String get sjKindHintsAdjustment =>
      'গণনার পর স্টক ঠিক করুন: পরিমাণ যোগ বা বাদ দিন।';

  @override
  String get sjKindHintsTransfer => 'গুদামের মধ্যে মাল বর্তমান দামে সরান।';

  @override
  String get sjKindHintsIssue =>
      'ব্যবসায় খরচ হওয়া মাল (নমুনা, নিজের ব্যবহার, উৎপাদন)।';

  @override
  String get sjDirection => 'যোগ / বাদ';

  @override
  String get sjAdd => 'যোগ';

  @override
  String get sjRemove => 'বাদ';

  @override
  String get sjToWarehouse => 'এই গুদামে';

  @override
  String get sjBatch => 'ব্যাচ';

  @override
  String get sjExpiry => 'মেয়াদ';

  @override
  String get sjPost => 'স্টক জার্নাল পোস্ট করুন';

  @override
  String get sjErrorsRateRequired => 'প্রারম্ভিক স্টকের দাম দিন।';

  @override
  String get sjErrorsServiceHasNoStock => 'পরিষেবার স্টক হয় না।';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses => 'দুটি আলাদা গুদাম বেছে নিন।';

  @override
  String get sjErrorsBatchRequired => 'এই পণ্য ব্যাচ রাখে: ব্যাচ নম্বর দিন।';

  @override
  String get sjErrorsQtyMustBePositive => 'পরিমাণ শূন্যের বেশি হতে হবে।';

  @override
  String get purchaseSupplier => 'সরবরাহকারী';

  @override
  String get purchaseChooseSupplier => 'সরবরাহকারী বেছে নিন…';

  @override
  String get purchaseItem => 'পণ্য';

  @override
  String get purchaseChooseItem => 'পণ্য বেছে নিন…';

  @override
  String get purchaseQty => 'পরিমাণ';

  @override
  String get purchaseRate => 'দর';

  @override
  String get purchaseDiscount => 'ছাড়';

  @override
  String get purchaseGst => 'জিএসটি %';

  @override
  String get purchaseAmount => 'অঙ্ক';

  @override
  String get purchaseTaxable => 'করযোগ্য মূল্য';

  @override
  String get purchaseTotal => 'মোট';

  @override
  String get purchaseStatus => 'অবস্থা';

  @override
  String get purchaseStatusesOpen => 'খোলা';

  @override
  String get purchaseStatusesPartial => 'আংশিক এসেছে';

  @override
  String get purchaseStatusesReceived => 'এসেছে';

  @override
  String get purchaseStatusesClosed => 'বন্ধ';

  @override
  String get purchaseStatusesCancelled => 'বাতিল';

  @override
  String get purchaseStatusesPosted => 'পোস্ট হয়েছে';

  @override
  String get purchaseStatusesBilled => 'বিল হয়েছে';

  @override
  String get purchaseOrdersTitle => 'ক্রয় অর্ডার';

  @override
  String get purchaseOrdersSubtitle =>
      'সরবরাহকারীর কাছে কী অর্ডার দিয়েছেন আর কতটা এসেছে।';

  @override
  String get purchaseOrdersNew => 'নতুন ক্রয় অর্ডার';

  @override
  String get purchaseOrdersExpectedOn => 'প্রত্যাশিত তারিখ';

  @override
  String get purchaseOrdersOrdered => 'অর্ডার';

  @override
  String get purchaseOrdersReceived => 'এসেছে';

  @override
  String get purchaseOrdersBilled => 'বিল হয়েছে';

  @override
  String get purchaseOrdersReceive => 'মাল গ্রহণ করুন';

  @override
  String get purchaseOrdersBill => 'বিল লিখুন';

  @override
  String get purchaseOrdersClose => 'অর্ডার বন্ধ করুন';

  @override
  String get purchaseReceiptsTitle => 'ইনওয়ার্ড চালান';

  @override
  String get purchaseReceiptsSubtitle =>
      'আসা মাল (GRN)। প্রাপ্তিতে স্টক বাড়ে; বিল পরে আসে।';

  @override
  String get purchaseReceiptsNew => 'নতুন ইনওয়ার্ড চালান';

  @override
  String get purchaseReceiptsChallan => 'সরবরাহকারীর চালান নং';

  @override
  String get purchaseReceiptsBill => 'বিল লিখুন';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'অর্ডার $number-এর বিপরীতে';
  }

  @override
  String get purchaseBillsTitle => 'ক্রয় বিল';

  @override
  String get purchaseBillsSubtitle =>
      'সরবরাহকারীর ইনভয়েস। প্রতিটি বিল ক্রয়, ইনপুট জিএসটি এবং সরবরাহকারীর খাতায় পোস্ট হয়।';

  @override
  String get purchaseBillsNew => 'নতুন ক্রয় বিল';

  @override
  String get purchaseBillsInvoiceNo => 'সরবরাহকারীর ইনভয়েস নং';

  @override
  String get purchaseBillsInvoiceDate => 'সরবরাহকারীর ইনভয়েসের তারিখ';

  @override
  String get purchaseBillsPostingDate => 'পোস্টিংয়ের তারিখ';

  @override
  String get purchaseBillsDueOn => 'পরিশোধের তারিখ';

  @override
  String get purchaseBillsReverseCharge => 'রিভার্স চার্জ (কর আমরা দিই)';

  @override
  String get purchaseBillsReturn => 'মাল ফেরত দিন';

  @override
  String get purchaseBillsReturned => 'ফেরত দেওয়া';

  @override
  String get purchaseBillsPost => 'বিল পোস্ট করুন';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'লাইন $line-এ বিলের দর মাল প্রাপ্তি থেকে আলাদা। স্টক প্রাপ্তির দরেই থাকে।';
  }

  @override
  String get purchaseReturnsTitle => 'ক্রয় ফেরত';

  @override
  String get purchaseReturnsSubtitle =>
      'সরবরাহকারীকে ফেরত পাঠানো মাল (ডেবিট নোট)।';

  @override
  String get purchaseReturnsNew => 'মাল ফেরত দিন';

  @override
  String get purchaseReturnsReason => 'কারণ';

  @override
  String get purchaseReturnsPost => 'ডেবিট নোট পোস্ট করুন';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'বিল $number-এর বিপরীতে';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'Sundry Creditors-এর অধীনের খাতা বেছে নিন।';

  @override
  String get purchaseErrorsUnknownSupplier => 'সরবরাহকারী বেছে নিন।';

  @override
  String get purchaseErrorsOverReceipt => 'এটি অর্ডারে বাকির চেয়ে বেশি।';

  @override
  String get purchaseErrorsOverBilling =>
      'এটি এসে পৌঁছানো ও এখনো বিল না হওয়া মালের চেয়ে বেশি।';

  @override
  String get purchaseErrorsOverReturn =>
      'এটি বিল হওয়া ও এখনো ফেরত না দেওয়া মালের চেয়ে বেশি।';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'এই সরবরাহকারীর ইনভয়েস আগেই লেখা হয়েছে।';

  @override
  String get purchaseErrorsBillHasReturns =>
      'আগে এই বিলের বিপরীতে ফেরতগুলো বাতিল করুন।';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'এই প্রাপ্তির বিল হয়ে গেছে; আগে বিল বাতিল করুন।';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'এই অর্ডারে মাল এসেছে; এটি বন্ধ করুন।';

  @override
  String get purchaseErrorsOrderNotOpen => 'এই অর্ডার বন্ধ।';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'সরবরাহকারীর ইনভয়েসের তারিখ পোস্টিংয়ের তারিখের পরে হতে পারে না।';

  @override
  String get purchaseErrorsNoLines => 'অন্তত একটি লাইন যোগ করুন।';

  @override
  String get purchaseErrorsItemArchived => 'একটি পণ্য আর্কাইভ করা।';

  @override
  String get purchaseReadButton => 'বিল পড়ুন';

  @override
  String get purchaseReadHint =>
      'সরবরাহকারীর বিলের ছবি বা PDF: ফর্ম পূরণ হয়ে যাবে, আপনি যাচাই করুন।';

  @override
  String get purchaseReadReading => 'বিল পড়া হচ্ছে…';

  @override
  String get purchaseReadDone =>
      'বিল থেকে পূরণ হয়েছে। সংরক্ষণের আগে প্রতিটি লাইন দেখে নিন।';

  @override
  String purchaseReadUnmatched(String items) {
    return 'এগুলোর জন্য পণ্য বেছে নিন: $items।';
  }

  @override
  String get purchaseReadDemo =>
      'স্বয়ংক্রিয় পড়া চালু নেই; বিলটি নিজে লিখুন।';

  @override
  String get purchaseReadNone => 'এই বিলটি পড়া গেল না; নিজে লিখুন।';

  @override
  String get inventorySettingsTitle => 'মালের সেটিংস';

  @override
  String get inventorySettingsValuation => 'স্টক মূল্যায়ন পদ্ধতি';

  @override
  String get inventorySettingsValuationHint =>
      'ব্যবহৃত ও অবশিষ্ট স্টকের মূল্য কীভাবে হিসাব হবে। বদলালে শুরু থেকে সব স্টকের মূল্য আবার হিসাব হয়।';

  @override
  String get inventorySettingsWarehouses => 'গুদাম';

  @override
  String get inventorySettingsAddWarehouse => 'গুদাম যোগ করুন';

  @override
  String get inventorySettingsWarehouseName => 'গুদামের নাম';

  @override
  String get inventorySettingsDefault => 'প্রধান';

  @override
  String get inventorySettingsNameTaken => 'এই নামের গুদাম আগে থেকেই আছে।';

  @override
  String get salesCustomer => 'গ্রাহক';

  @override
  String get salesChooseCustomer => 'গ্রাহক বেছে নিন…';

  @override
  String get salesPlaceOfSupply => 'সরবরাহের স্থান';

  @override
  String get salesExport => 'রপ্তানি';

  @override
  String get salesSez => 'SEZ গ্রাহক';

  @override
  String get salesLut => 'LUT-এর অধীনে (কর ছাড়া)';

  @override
  String get salesStatusesDelivered => 'পৌঁছে দেওয়া';

  @override
  String get salesStatusesInvoiced => 'ইনভয়েস হয়েছে';

  @override
  String get salesStatusesAccepted => 'গৃহীত';

  @override
  String get salesStatusesDeclined => 'প্রত্যাখ্যাত';

  @override
  String get salesStatusesConverted => 'রূপান্তরিত';

  @override
  String get salesStatusesExpired => 'মেয়াদোত্তীর্ণ';

  @override
  String get salesOrdersTitle => 'বিক্রয় অর্ডার';

  @override
  String get salesOrdersSubtitle => 'গ্রাহকরা কী অর্ডার দিয়েছেন আর কতটা গেছে।';

  @override
  String get salesOrdersNew => 'নতুন বিক্রয় অর্ডার';

  @override
  String get salesOrdersDeliverBy => 'পৌঁছানোর তারিখ';

  @override
  String get salesOrdersCustomerRef => 'গ্রাহকের PO নং';

  @override
  String get salesOrdersOrdered => 'অর্ডার';

  @override
  String get salesOrdersDelivered => 'পৌঁছে দেওয়া';

  @override
  String get salesOrdersInvoiced => 'ইনভয়েস হয়েছে';

  @override
  String get salesOrdersDeliver => 'মাল পাঠান';

  @override
  String get salesOrdersInvoice => 'ইনভয়েস তৈরি করুন';

  @override
  String get salesOrdersClose => 'অর্ডার বন্ধ করুন';

  @override
  String get salesDeliveriesTitle => 'ডেলিভারি চালান';

  @override
  String get salesDeliveriesSubtitle =>
      'ইনভয়েসের আগে (বা ছাড়া) পাঠানো মাল। ডেলিভারিতে স্টক কমে।';

  @override
  String get salesDeliveriesNew => 'নতুন ডেলিভারি চালান';

  @override
  String get salesDeliveriesInvoice => 'ইনভয়েস তৈরি করুন';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'অর্ডার $number-এর বিপরীতে';
  }

  @override
  String get salesDeliveriesReason => 'কারণ';

  @override
  String get salesDeliveriesValue => 'মূল্য';

  @override
  String get salesDeliveriesTransporter => 'পরিবহনকারী';

  @override
  String get salesDeliveriesVehicleNo => 'গাড়ির নং';

  @override
  String get salesDeliveriesPrint => 'চালান প্রিন্ট (3 কপি)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return '$date-এর মধ্যে ইনভয়েস';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    return 'মাল $count বার ফেরত এসেছে: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'মাল ফেরত নিন';

  @override
  String get salesDeliveriesStillOut => 'এখনও বাইরে';

  @override
  String get salesDeliveriesCameBack => 'ফেরত এসেছে';

  @override
  String get salesDeliveriesSaveReturn => 'ফেরত সংরক্ষণ করুন';

  @override
  String get salesDeliveriesNewApproval => 'নতুন অনুমোদন মেমো';

  @override
  String get salesDeliveriesReasonsSupply => 'সরবরাহ, ইনভয়েস পরে';

  @override
  String get salesDeliveriesReasonsApproval => 'অনুমোদনে বিক্রি';

  @override
  String get salesDeliveriesReasonsJobWork => 'জব ওয়ার্ক';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'সরবরাহ নয় (নিজের ব্যবহার, মেরামত)';

  @override
  String get salesDeliveriesReasonsLots => 'কিস্তিতে সরবরাহ';

  @override
  String get salesDeliveriesReasonsExhibition => 'প্রদর্শনী বা মেলা';

  @override
  String get salesDeliveriesReasonsOther => 'অন্যান্য';

  @override
  String get salesDeliveriesReasonsSample => 'স্যাম্পল';

  @override
  String get salesDeliveriesReasonHintsSupply =>
      'মাল বিক্রি হয়েছে; ট্যাক্স ইনভয়েস পরে।';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'গ্রাহক যা বিকোয় তা রাখেন। ছয় মাসের মধ্যে ইনভয়েস করুন বা মাল ফেরত নিন।';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'প্রক্রিয়াকরণের জন্য পাঠানো; মাল ফেরত আসবে।';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'বিক্রি ছাড়া মাল যায়, তাই ট্যাক্স দেখানো হয় না।';

  @override
  String get salesDeliveriesReasonHintsLots => 'একটি সরবরাহ কয়েক কিস্তিতে।';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'প্রদর্শনীতে দেখানো; না বিকোনো মাল ফেরত আসবে।';

  @override
  String get salesDeliveriesReasonHintsOther => 'মালের অন্য কোনো চলাচল।';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'দেখানো বা পরখ করার জন্য পাঠানো; বিক্রি নয়, তাই কর দেখানো হয় না। না রাখা পিস ফেরতে ফিরে আসে।';

  @override
  String get salesInvoicesTitle => 'বিক্রয় ইনভয়েস';

  @override
  String get salesInvoicesSubtitle =>
      'কর ইনভয়েস। প্রতিটি ইনভয়েস বিক্রয়, আউটপুট জিএসটি এবং গ্রাহকের খাতায় পোস্ট হয়।';

  @override
  String get salesInvoicesNew => 'নতুন ইনভয়েস';

  @override
  String get salesInvoicesDueOn => 'পরিশোধের তারিখ';

  @override
  String get salesInvoicesPost => 'ইনভয়েস সংরক্ষণ করুন';

  @override
  String get salesInvoicesPrint => 'প্রিন্ট';

  @override
  String get salesInvoicesCreditNote => 'ক্রেডিট নোট / ফেরত';

  @override
  String get salesInvoicesReturned => 'ফেরত এসেছে';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'এতে গ্রাহক ধারের সীমা ছাড়িয়ে যান ($detail বাকি)।';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return '$detail-এর মাল: সরানোর আগে ই-ওয়ে বিল লাগবে।';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'লাইন $lineNo-এ HSN কোড নেই; কর ইনভয়েসে এটি লাগে।';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'কিছু স্টক শূন্যের নিচে গেছে। কোনো ক্রয় এন্ট্রি বাদ পড়েছে কিনা দেখুন।';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'এই গ্রাহকের একটি বিল $days দিন বকেয়া।';
  }

  @override
  String get salesCreditNotesTitle => 'ক্রেডিট নোট';

  @override
  String get salesCreditNotesSubtitle => 'বিক্রয় ফেরত ও বিক্রির পর দাম কমানো।';

  @override
  String get salesCreditNotesNew => 'ক্রেডিট নোট';

  @override
  String get salesCreditNotesReason => 'কারণ';

  @override
  String get salesCreditNotesGoodsReturned => 'মাল স্টকে ফিরে এসেছে';

  @override
  String get salesCreditNotesPriceReduction => 'শুধু দাম কমানো (মাল ফেরত নয়)';

  @override
  String get salesCreditNotesCreditRate => 'প্রতি একক ক্রেডিট';

  @override
  String get salesCreditNotesPost => 'ক্রেডিট নোট পোস্ট করুন';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'ইনভয়েস $number-এর বিপরীতে';
  }

  @override
  String get salesErrorsNotACustomer =>
      'Sundry Debtors-এর অধীনের খাতা বেছে নিন।';

  @override
  String get salesErrorsUnknownCustomer => 'গ্রাহক বেছে নিন।';

  @override
  String get salesErrorsOverDelivery => 'এটি অর্ডারে বাকির চেয়ে বেশি।';

  @override
  String get salesErrorsOverInvoicing =>
      'এটি পাঠানো ও এখনো ইনভয়েস না হওয়া মালের চেয়ে বেশি।';

  @override
  String get salesErrorsOverReturn => 'যা বাইরে আছে তার চেয়ে বেশি ফেরত আসছে।';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'আগে এই ইনভয়েসের বিপরীতে ক্রেডিট নোট বাতিল করুন।';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'এই চালানের ইনভয়েস হয়ে গেছে; আগে ইনভয়েস বাতিল করুন।';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'এই অর্ডারে মাল গেছে; এটি বন্ধ করুন।';

  @override
  String get salesErrorsCancelIrnFirst => 'আগে ই-ইনভয়েস (IRN) বাতিল করুন।';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'ক্রেডিট ইনভয়েসের দরের বেশি হতে পারে না।';

  @override
  String get salesErrorsRateRequired => 'প্রতি একক ক্রেডিট দিন।';

  @override
  String get salesErrorsQuotationNotOpen =>
      'এই কোটেশন আগেই রূপান্তরিত বা বন্ধ।';

  @override
  String get salesErrorsQuotationConverted =>
      'এই কোটেশন রূপান্তরিত হয়েছে; আগে এর থেকে তৈরি অর্ডার বা ইনভয়েস বাতিল করুন।';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'এই কোটেশন অন্য গ্রাহকের জন্য।';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“পর্যন্ত বৈধ” কোটেশনের তারিখের আগে হতে পারে না।';

  @override
  String get salesErrorsCancelEwbFirst => 'আগে ই-ওয়ে বিল বাতিল করুন।';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'এই মাসের GSTR-1 আগেই দাখিল হয়েছে। চলতি মাসের তারিখ দিন, বা জিএসটি পোর্টালে সংশোধন করুন।';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'অগ্রিম মোট টাকার বেশি হতে পারে না।';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'এই চালানে মাল ফেরত এসেছে, তাই বাতিল করা যাবে না।';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'ফেরতের তারিখ চালানের তারিখের আগে।';

  @override
  String get salesErrorsDeliveryCancelled => 'এই চালান বাতিল।';

  @override
  String get salesErrorsUnknownDeliveryLine => 'এই লাইনটি এই চালানে নেই।';

  @override
  String get salesErrorsCreditBlocked =>
      'এই বিক্রি গ্রাহককে ক্রেডিট সীমার উপরে নিয়ে যায়, এবং তাদের অ্যাকাউন্ট ব্লকে রাখা।';

  @override
  String get salesErrorsOverdueBlocked =>
      'এই গ্রাহকের একটি বিল অনুমোদিত সময়ের বেশি বকেয়া, এবং তাদের অ্যাকাউন্ট ব্লকে রাখা।';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'শুধু মালিক বা অ্যাডমিন ক্রেডিট ব্লক ওভাররাইড করতে পারেন।';

  @override
  String get salesErrorsNotAnAgent =>
      'দালাল বা এজেন্ট হিসেবে চিহ্নিত খাতা বাছুন।';

  @override
  String get salesErrorsUnknownSalesman =>
      'আপনার কর্মীদের মধ্যে থেকে সেলসম্যান বাছুন।';

  @override
  String get salesErrorsUnknownOrder => 'সেই অর্ডার পাওয়া যায়নি।';

  @override
  String get salesQuotationsTitle => 'কোটেশন';

  @override
  String get salesQuotationsSubtitle =>
      'গ্রাহকদের জন্য দামের প্রস্তাব। রূপান্তরের আগে স্টক বা হিসাবে প্রভাব নেই।';

  @override
  String get salesQuotationsNew => 'নতুন কোটেশন';

  @override
  String get salesQuotationsSave => 'কোটেশন সংরক্ষণ';

  @override
  String get salesQuotationsValidUntil => 'পর্যন্ত বৈধ';

  @override
  String get salesQuotationsToOrder => 'অর্ডারে রূপান্তর';

  @override
  String get salesQuotationsToInvoice => 'ইনভয়েসে রূপান্তর';

  @override
  String get salesQuotationsAccept => 'গৃহীত হিসেবে চিহ্নিত করুন';

  @override
  String get salesQuotationsDecline => 'প্রত্যাখ্যাত হিসেবে চিহ্নিত করুন';

  @override
  String get salesQuotationsPrint => 'প্রিন্ট / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'অর্ডারে',
      'other': 'ইনভয়েসে',
    });
    return '$_temp0 রূপান্তরিত';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'কোটেশন $number থেকে';
  }

  @override
  String get salesQuotationsTerms => 'শর্তাবলি';

  @override
  String get salesProformasTitle => 'প্রোফর্মা ইনভয়েস';

  @override
  String get salesProformasSubtitle =>
      'মাল পাঠানোর আগে পেমেন্ট বা অগ্রিম চান। ইনভয়েস পর্যন্ত ট্যাক্স বা স্টকে প্রভাব নেই।';

  @override
  String get salesProformasNew => 'নতুন প্রোফর্মা ইনভয়েস';

  @override
  String get salesProformasSave => 'প্রোফর্মা সংরক্ষণ করুন';

  @override
  String get salesProformasAdvanceDue => 'চাওয়া অগ্রিম';

  @override
  String get salesProformasAdvanceHint => 'পুরো টাকা চাইতে খালি রাখুন';

  @override
  String get salesApprovalsTitle => 'অনুমোদনে পাঠানো মাল';

  @override
  String get salesApprovalsSubtitle =>
      'যে অনুমোদন মেমোর মাল এখনও গ্রাহকের কাছে। না বিকোনো মাল ফেরত নিন; বাকিটা ছয় মাসের মধ্যে ইনভয়েস করুন।';

  @override
  String salesApprovalsSummary(num count, String value) {
    return '$countটি মেমো খোলা, মূল্য $value';
  }

  @override
  String get salesApprovalsDaysOut => 'বাইরে দিন';

  @override
  String salesApprovalsDaysLeft(num days) {
    return '$days দিন বাকি';
  }

  @override
  String get salesApprovalsEmpty => 'অনুমোদনে কোনো মাল বাইরে নেই।';

  @override
  String get salesOverrideCredit => 'অনুমতি দিয়ে সংরক্ষণ করুন';

  @override
  String get salesSamplesTitle => 'বাইরে থাকা স্যাম্পল';

  @override
  String get salesSamplesSubtitle =>
      'পক্ষগুলোকে পাঠানো কিন্তু এখনও ফেরত না আসা স্যাম্পল। এগুলো বিক্রি নয়, কর লাগে না। যা রাখা হবে না তা ফেরত নিন।';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি চালান',
      one: '$countটি চালান',
    );
    return '$_temp0 এ $pieces পিস এখনও বাইরে';
  }

  @override
  String get salesSamplesNew => 'নতুন স্যাম্পল চালান';

  @override
  String get salesSamplesEmpty => 'কোনো স্যাম্পল বাইরে নেই।';

  @override
  String get einvoiceTitle => 'ই-ইনভয়েস';

  @override
  String get einvoiceStatusNotRequired => 'প্রয়োজন নেই';

  @override
  String get einvoiceStatusPending => 'IRN বাকি';

  @override
  String get einvoiceStatusGenerated => 'IRN তৈরি';

  @override
  String get einvoiceStatusCancelled => 'IRN বাতিল';

  @override
  String get einvoiceStatusFailed => 'IRN ব্যর্থ';

  @override
  String get einvoiceGenerate => 'IRN তৈরি করুন';

  @override
  String get einvoiceCancel => 'IRN বাতিল করুন';

  @override
  String get einvoiceCancelHint => 'IRN তৈরির 24 ঘণ্টার মধ্যেই বাতিল করা যায়।';

  @override
  String get einvoiceReasons1 => 'ডুপ্লিকেট';

  @override
  String get einvoiceReasons2 => 'ডেটা এন্ট্রির ভুল';

  @override
  String get einvoiceReasons3 => 'অর্ডার বাতিল';

  @override
  String get einvoiceReasons4 => 'অন্যান্য';

  @override
  String get einvoiceRemark => 'মন্তব্য';

  @override
  String get einvoiceIrn => 'IRN';

  @override
  String get einvoiceAckNo => 'প্রাপ্তিস্বীকার নং';

  @override
  String get einvoiceAckDate => 'প্রাপ্তিস্বীকার তারিখ';

  @override
  String get einvoiceSimulator =>
      'টেস্ট মোড: জিএসটি প্রদানকারী যুক্ত না হওয়া পর্যন্ত IRN বিল্ট-ইন সিমুলেটর থেকে আসে।';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'গ্রাহকের জিএসটিআইএন নেই; ই-ইনভয়েস শুধু নিবন্ধিত ক্রেতা ও রপ্তানির জন্য।';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'এই ইনভয়েস নম্বর IRP-এর জন্য বৈধ নয়।';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'গ্রাহক ও আপনার শাখার বৈধ পিন কোড দিন।';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'গ্রাহক ও আপনার শাখার ঠিকানা দিন।';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn =>
      'প্রতিটি পণ্যের HSN কোড লাগবে।';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch => 'যোগফল মিলছে না।';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'আগে আপনার শাখার জিএসটিআইএন দিন।';

  @override
  String get einvoiceErrorsDuplicateIrn => 'IRP-এ এই ইনভয়েস আগে থেকেই আছে।';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'এই IRN বাতিলের 24 ঘণ্টা পেরিয়ে গেছে। এর বদলে ক্রেডিট নোট দিন।';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated => 'IRN আগেই তৈরি হয়েছে।';

  @override
  String get einvoiceErrorsCancelEwbFirst => 'আগে ই-ওয়ে বিল বাতিল করুন।';

  @override
  String get ewbTitle => 'ই-ওয়ে বিল';

  @override
  String get ewbGenerate => 'ই-ওয়ে বিল তৈরি করুন';

  @override
  String get ewbVehicleNo => 'গাড়ির নং';

  @override
  String get ewbDistance => 'দূরত্ব (কিমি)';

  @override
  String get ewbNumber => 'EWB নং';

  @override
  String get ewbValidUpto => 'পর্যন্ত বৈধ';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'এটি গাড়ির নম্বর মনে হচ্ছে না (যেমন WB02AB1234)।';

  @override
  String get ewbErrorsInvalidDistance => 'দূরত্ব কিমিতে দিন।';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'ই-ওয়ে বিলের মেয়াদ শেষের 8 ঘণ্টা আগে থেকে 8 ঘণ্টা পর পর্যন্তই বাড়ানো যায়।';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'এই ই-ওয়ে বিল বাতিলের 24 ঘণ্টা পেরিয়ে গেছে।';

  @override
  String get ewbErrorsEwbExpired =>
      'এই ই-ওয়ে বিলের মেয়াদ শেষ; মেয়াদ বাড়ান।';

  @override
  String get ewbErrorsNoActiveEwb => 'এই ইনভয়েসে কোনো সক্রিয় ই-ওয়ে বিল নেই।';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'এই ইনভয়েসে ই-ওয়ে বিল আগে থেকেই সক্রিয়।';

  @override
  String get ewbErrorsInvalidPincode => '6 অঙ্কের পিন কোড দিন।';

  @override
  String get ewbStatusActive => 'সক্রিয়';

  @override
  String get ewbStatusCancelled => 'বাতিল';

  @override
  String get ewbChangeVehicle => 'গাড়ি বদলান';

  @override
  String get ewbExtend => 'মেয়াদ বাড়ান';

  @override
  String get ewbCancel => 'ই-ওয়ে বিল বাতিল করুন';

  @override
  String get ewbNewVehicle => 'নতুন গাড়ির নং';

  @override
  String get ewbCurrentPlace => 'বর্তমান স্থান';

  @override
  String get ewbCurrentPincode => 'বর্তমান পিন কোড';

  @override
  String get ewbRemainingKm => 'বাকি দূরত্ব (কিমি)';

  @override
  String get ewbReason => 'কারণ';

  @override
  String get ewbRemark => 'মন্তব্য';

  @override
  String get ewbSave => 'সংরক্ষণ করুন';

  @override
  String get ewbExtendHint =>
      'ই-ওয়ে বিলের মেয়াদ শেষের 8 ঘণ্টা আগে থেকে 8 ঘণ্টা পর পর্যন্ত অনুমোদিত।';

  @override
  String get ewbCancelHint => 'তৈরির 24 ঘণ্টার মধ্যে, মাল না সরলে অনুমোদিত।';

  @override
  String ewbCancelledNote(String number) {
    return 'ই-ওয়ে বিল $number বাতিল হয়েছে। নতুন তৈরি করতে পারেন।';
  }

  @override
  String get ewbVehicleReasons1 => 'গাড়ি খারাপ';

  @override
  String get ewbVehicleReasons2 => 'ট্রান্সশিপমেন্ট';

  @override
  String get ewbVehicleReasons3 => 'অন্যান্য';

  @override
  String get ewbVehicleReasons4 => 'প্রথমবার';

  @override
  String get ewbExtendReasons1 => 'প্রাকৃতিক দুর্যোগ';

  @override
  String get ewbExtendReasons2 => 'আইনশৃঙ্খলা';

  @override
  String get ewbExtendReasons4 => 'ট্রান্সশিপমেন্ট';

  @override
  String get ewbExtendReasons5 => 'দুর্ঘটনা';

  @override
  String get ewbExtendReasons99 => 'অন্যান্য';

  @override
  String get ewbCancelReasons1 => 'ডুপ্লিকেট';

  @override
  String get ewbCancelReasons2 => 'অর্ডার বাতিল';

  @override
  String get ewbCancelReasons3 => 'ডেটা এন্ট্রির ভুল';

  @override
  String get ewbCancelReasons4 => 'অন্যান্য';

  @override
  String get printTaxInvoice => 'কর ইনভয়েস';

  @override
  String get printCreditNote => 'ক্রেডিট নোট';

  @override
  String get printOriginal => 'প্রাপকের জন্য মূল কপি';

  @override
  String get printBillTo => 'বিল প্রাপক';

  @override
  String get printShipTo => 'মাল প্রাপক';

  @override
  String get printInvoiceNo => 'ইনভয়েস নং';

  @override
  String get printInvoiceDate => 'ইনভয়েসের তারিখ';

  @override
  String get printSno => '#';

  @override
  String get printHsn => 'HSN/SAC';

  @override
  String get printTaxSummary => 'কর সারাংশ';

  @override
  String get printRate => 'হার';

  @override
  String get printAmountInWords => 'কথায় অঙ্ক';

  @override
  String get printBank => 'ব্যাংকের তথ্য';

  @override
  String get printTerms => 'শর্তাবলি';

  @override
  String printForCompany(String company) {
    return '$company-এর পক্ষে';
  }

  @override
  String get printSignatory => 'অনুমোদিত স্বাক্ষরকারী';

  @override
  String get printComputerGenerated => 'এটি কম্পিউটারে তৈরি ইনভয়েস।';

  @override
  String get printReverseCharge => 'রিভার্স চার্জে প্রদেয় কর';

  @override
  String get printExportLut =>
      'IGST না দিয়ে LUT-এর অধীনে রপ্তানির জন্য সরবরাহ';

  @override
  String get printQuotation => 'কোটেশন';

  @override
  String get printQuotationNo => 'কোটেশন নং';

  @override
  String get printQuotationDate => 'কোটেশনের তারিখ';

  @override
  String get printQuotedTo => 'কোটেশন প্রাপক';

  @override
  String get printComputerGeneratedQuote =>
      'এটি কম্পিউটারে তৈরি কোটেশন। দেওয়া তারিখ পর্যন্ত দাম বৈধ।';

  @override
  String get printProforma => 'প্রোফর্মা ইনভয়েস';

  @override
  String get printProformaNo => 'প্রোফর্মা নং';

  @override
  String get printProformaDate => 'প্রোফর্মা তারিখ';

  @override
  String get printComputerGeneratedProforma =>
      'এটি প্রোফর্মা ইনভয়েস, ট্যাক্স ইনভয়েস নয়। সরবরাহের সময় ট্যাক্স ইনভয়েস দেওয়া হবে।';

  @override
  String get printDeliveryChallan => 'ডেলিভারি চালান';

  @override
  String get printApprovalMemo => 'অনুমোদন মেমো';

  @override
  String get printCopyConsignee => 'মূল কপি প্রাপকের জন্য';

  @override
  String get printCopyTransporter => 'দ্বিতীয় কপি পরিবহনকারীর জন্য';

  @override
  String get printCopyConsignor => 'তৃতীয় কপি প্রেরকের জন্য';

  @override
  String get printConsignee => 'প্রাপক';

  @override
  String get printChallanNo => 'চালান নং';

  @override
  String get printChallanDate => 'চালানের তারিখ';

  @override
  String get printInvoiceBy => 'ইনভয়েসের শেষ তারিখ';

  @override
  String get printValue => 'মূল্য';

  @override
  String get printNotASupply =>
      'সরবরাহ ছাড়া অন্য কারণে মাল পাঠানো হয়েছে। এই চালানে কোনো ট্যাক্স নেই।';

  @override
  String get printReceivedBy => 'গ্রহণকারী';

  @override
  String get printSignatureAndDate => 'স্বাক্ষর ও তারিখ';

  @override
  String get outstandingReceivablesTitle => 'পাওনা';

  @override
  String get outstandingReceivablesSubtitle =>
      'গ্রাহকদের কাছ থেকে পাওনা, সময় অনুযায়ী। প্রাপ্তি আগে সবচেয়ে পুরোনো বিল মেটায়।';

  @override
  String get outstandingPayablesTitle => 'দেনা';

  @override
  String get outstandingPayablesSubtitle =>
      'সরবরাহকারীদের দেনা, সময় অনুযায়ী। প্রদান আগে সবচেয়ে পুরোনো বিল মেটায়।';

  @override
  String get outstandingParty => 'পক্ষ';

  @override
  String get outstandingBalance => 'ব্যালান্স';

  @override
  String get outstandingNotDue => 'এখনো দেয় নয়';

  @override
  String get outstandingD030 => '1-30 দিন';

  @override
  String get outstandingD3160 => '31-60 দিন';

  @override
  String get outstandingD6190 => '61-90 দিন';

  @override
  String get outstandingAdvance => 'অগ্রিম';

  @override
  String get outstandingOpenItems => 'খোলা বিল';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days দিন মেয়াদোত্তীর্ণ',
      one: '$days দিন মেয়াদোত্তীর্ণ',
      zero: 'দেয়',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'কিছু বাকি নেই।';

  @override
  String get outstandingD91180 => '91 থেকে 180 দিন';

  @override
  String get outstandingD180plus => '180 দিনের বেশি';

  @override
  String get returnsTitle => 'জিএসটি রিটার্ন';

  @override
  String get returnsSubtitle =>
      'আপনার ইনভয়েস ও বিল থেকে GSTR-1 ও GSTR-3B। এখানে দাখিল করুন, বা জিএসটি পোর্টালের অফলাইন টুলের জন্য JSON ডাউনলোড করুন।';

  @override
  String get returnsPeriod => 'কর সময়কাল';

  @override
  String get returnsGstr1 => 'GSTR-1';

  @override
  String get returnsGstr3b => 'GSTR-3B';

  @override
  String get returnsDownload => 'JSON ডাউনলোড';

  @override
  String get returnsSection => 'বিভাগ';

  @override
  String get returnsCount => 'ইনভয়েস';

  @override
  String get returnsTaxable => 'করযোগ্য মূল্য';

  @override
  String get returnsTax => 'কর';

  @override
  String get returnsB2b => 'B2B: নিবন্ধিত গ্রাহক';

  @override
  String get returnsB2cl => 'B2C বড়: অন্য রাজ্য, ₹1 লাখের বেশি';

  @override
  String get returnsB2cs => 'B2C ছোট';

  @override
  String get returnsExp => 'রপ্তানি';

  @override
  String get returnsCdn => 'ক্রেডিট নোট';

  @override
  String get returnsCancelled => 'বাতিল ইনভয়েস (নথি সারাংশে)';

  @override
  String get returnsOutward => '3.1(a) বহির্গামী করযোগ্য সরবরাহ';

  @override
  String get returnsZeroRated => '3.1(b) শূন্য হার (রপ্তানি, SEZ)';

  @override
  String get returnsNil => '3.1(c) শূন্য হার / ছাড়প্রাপ্ত';

  @override
  String get returnsRcm => '3.1(d) রিভার্স চার্জে অন্তর্গামী সরবরাহ';

  @override
  String get returnsItc => '4. ইনপুট ট্যাক্স ক্রেডিট';

  @override
  String get returnsSetOff => '6.1 করের পরিশোধ';

  @override
  String get returnsHead => 'করের ধরন';

  @override
  String get returnsLiability => 'প্রদেয় কর';

  @override
  String get returnsPaidByCredit => 'ক্রেডিট দিয়ে দেওয়া';

  @override
  String get returnsCash => 'নগদে দিন';

  @override
  String get returnsCarryForward => 'পরবর্তীতে নেওয়া ক্রেডিট';

  @override
  String get returnsFilingNote =>
      'রিটার্ন আপনার জিএসটি প্রদানকারীর মাধ্যমে দাখিল হয়। প্রদানকারী যুক্ত না হওয়া পর্যন্ত টেস্ট মোড বিল্ট-ইন সিমুলেটর ব্যবহার করে।';

  @override
  String get gstSettingsTitle => 'জিএসটি ও ইনভয়েস';

  @override
  String get gstSettingsEinvoice => 'ই-ইনভয়েস (IRN) তৈরি করুন';

  @override
  String get gstSettingsEinvoiceHint =>
      '2017-18 থেকে যেকোনো বছরে টার্নওভার ₹5 কোটি ছাড়ালে বাধ্যতামূলক।';

  @override
  String get gstSettingsEwbThreshold => 'এর বেশি মূল্যে ই-ওয়ে বিল (₹)';

  @override
  String get gstSettingsBilingual =>
      'ইনভয়েস, বেতন স্লিপ ও ফর্ম 16 দুই ভাষায় প্রিন্ট করুন';

  @override
  String get gstSettingsPrintLanguage => 'প্রিন্টের দ্বিতীয় ভাষা';

  @override
  String get gstSettingsTerms => 'ইনভয়েসের শর্তাবলি';

  @override
  String get gstSettingsBank => 'ইনভয়েসে ব্যাংকের তথ্য';

  @override
  String get importTitle => 'ডেটা আমদানি';

  @override
  String get importSubtitle =>
      'স্প্রেডশিট বা Tally থেকে গ্রাহক, সরবরাহকারী ও পণ্য আনুন।';

  @override
  String get importParties => 'গ্রাহক ও সরবরাহকারী (CSV)';

  @override
  String get importItems => 'পণ্য (CSV)';

  @override
  String get importTally => 'Tally XML';

  @override
  String get importTemplate => 'নমুনা CSV ডাউনলোড';

  @override
  String get importTallyHint =>
      'Tally-তে: Display → List of Accounts → Alt+E (Export), XML ফরম্যাট। স্টক আইটেমও রাখুন।';

  @override
  String get importChoose => 'ফাইল বেছে নিন';

  @override
  String get importPreview => 'ফাইল যাচাই করুন';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি সারি',
      one: '$countটি সারি',
    );
    return '$_temp0 আমদানি করুন';
  }

  @override
  String get importRow => 'সারি';

  @override
  String get importStatus => 'ফলাফল';

  @override
  String get importCreate => 'তৈরি হবে';

  @override
  String get importExists => 'আগে থেকেই আছে: বাদ দেওয়া হয়েছে';

  @override
  String get importDone => 'আমদানি হয়েছে।';

  @override
  String get filingTitle => 'জিএসটি পোর্টালে দাখিল';

  @override
  String get filingPortal => 'জিএসটি পোর্টাল সংযোগ';

  @override
  String get filingPortalHint =>
      'আগে আপনার জিএসটি পোর্টাল প্রোফাইলে “API access” চালু করুন। সেশন প্রায় 6 ঘণ্টা চলে।';

  @override
  String get filingUsername => 'জিএসটি পোর্টালের ইউজারনেম';

  @override
  String get filingSendOtp => 'OTP পাঠান';

  @override
  String get filingOtp => 'OTP';

  @override
  String get filingConnect => 'যুক্ত করুন';

  @override
  String filingConnected(String username, String time) {
    return '$username হিসেবে $time পর্যন্ত যুক্ত';
  }

  @override
  String get filingDisconnect => 'সংযোগ বিচ্ছিন্ন করুন';

  @override
  String filingSimulatorOtp(String otp) {
    return 'টেস্ট মোড: OTP হল $otp।';
  }

  @override
  String get filingUpload => 'আপলোড';

  @override
  String get filingUploadAgain => 'আবার আপলোড';

  @override
  String filingUploaded(String time) {
    return '$time-এ আপলোড হয়েছে';
  }

  @override
  String get filingGetOtp => 'EVC OTP পাঠান';

  @override
  String get filingEvcHint => 'OTP আপনার অনুমোদিত স্বাক্ষরকারীর মোবাইলে যায়।';

  @override
  String get filingFile => 'EVC দিয়ে দাখিল করুন';

  @override
  String filingFiled(String time) {
    return '$time-এ দাখিল হয়েছে';
  }

  @override
  String get filingArn => 'ARN';

  @override
  String get filingNotUploaded => 'আপলোড হয়নি';

  @override
  String get filingLocked =>
      'কোনো মাসের GSTR-1 দাখিলের পর সেই মাসের ইনভয়েস ও ক্রেডিট নোট লক হয়ে যায়।';

  @override
  String filingCashNote(String amount) {
    return 'দাখিলের আগে আপনার ইলেকট্রনিক নগদ খতিয়ানে $amount রাখুন (জিএসটি পোর্টালে চালান)।';
  }

  @override
  String get filingErrorsGstSessionRequired => 'আগে জিএসটি পোর্টালে যুক্ত হন।';

  @override
  String get filingErrorsGstSessionExpired =>
      'জিএসটি পোর্টালের সেশন শেষ। আবার যুক্ত হন।';

  @override
  String get filingErrorsInvalidOtp => 'এই OTP ঠিক নয়।';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'আপনার জিএসটি পোর্টালের ইউজারনেম দিন।';

  @override
  String get filingErrorsUploadFirst => 'আগে রিটার্ন আপলোড করুন।';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'আপলোডের পর আপনার হিসাব বদলেছে। আবার আপলোড করে দাখিল করুন।';

  @override
  String get filingErrorsReturnAlreadyFiled => 'এই রিটার্ন আগেই দাখিল হয়েছে।';

  @override
  String get filingErrorsCompanyPanRequired =>
      'কোম্পানি ও শাখায় ব্যবসার প্যান দিন।';

  @override
  String get filingErrorsInvalidPan => 'ব্যবসার প্যান বৈধ নয়।';

  @override
  String get filingErrorsBranchGstinRequired =>
      'আগে প্রধান কার্যালয়ের জিএসটিআইএন দিন।';

  @override
  String get hrEmployeesTitle => 'কর্মচারী';

  @override
  String get hrEmployeesSubtitle => 'আপনার দল, তাঁদের বেতন ও বিধিবদ্ধ তথ্য।';

  @override
  String get hrEmployeesNew => 'কর্মচারী যোগ করুন';

  @override
  String get hrEmployeesNone => 'এখনো কোনো কর্মচারী নেই।';

  @override
  String get hrSectionsPersonal => 'ব্যক্তিগত';

  @override
  String get hrSectionsJob => 'চাকরি';

  @override
  String get hrSectionsStatutory => 'PF, ESI ও কর';

  @override
  String get hrSectionsBank => 'বেতন প্রদান';

  @override
  String get hrSectionsSalary => 'বেতন কাঠামো';

  @override
  String get hrCode => 'কর্মচারী কোড';

  @override
  String get hrCodeHint => 'স্বয়ংক্রিয় নম্বরের জন্য খালি রাখুন';

  @override
  String get hrName => 'পুরো নাম';

  @override
  String get hrNameHi => 'হিন্দিতে নাম (ঐচ্ছিক)';

  @override
  String get hrGender => 'লিঙ্গ';

  @override
  String get hrGendersMale => 'পুরুষ';

  @override
  String get hrGendersFemale => 'মহিলা';

  @override
  String get hrGendersOther => 'অন্যান্য';

  @override
  String get hrDob => 'জন্মতারিখ';

  @override
  String get hrJoinedOn => 'যোগদানের তারিখ';

  @override
  String get hrLeftOn => 'ছেড়ে যাওয়ার তারিখ';

  @override
  String get hrFixedTerm => 'নির্দিষ্ট মেয়াদের কর্মচারী';

  @override
  String get hrDepartment => 'বিভাগ';

  @override
  String get hrDesignation => 'পদ';

  @override
  String get hrWorkState => 'কাজের রাজ্য';

  @override
  String get hrWorkStateHint => 'এতে বৃত্তি কর ঠিক হয়';

  @override
  String get hrPhone => 'মোবাইল';

  @override
  String get hrEmail => 'ইমেল';

  @override
  String get hrAddress => 'ঠিকানা';

  @override
  String get hrCity => 'শহর';

  @override
  String get hrPincode => 'পিন কোড';

  @override
  String get hrPan => 'প্যান';

  @override
  String get hrAadhaarLast4 => 'আধার (শুধু শেষ 4 অঙ্ক)';

  @override
  String get hrUan => 'UAN';

  @override
  String get hrEsiNumber => 'ESI IP নম্বর';

  @override
  String get hrPfMember => 'PF সদস্য';

  @override
  String get hrEpsEligible => 'পেনশন প্রকল্পে (EPS)';

  @override
  String get hrPfOnActual => 'পুরো বেতনে PF (₹15,000-এর বেশি)';

  @override
  String get hrDisabled => 'প্রতিবন্ধী ব্যক্তি (₹25,000 পর্যন্ত ESI)';

  @override
  String get hrTaxRegime => 'কর ব্যবস্থা';

  @override
  String get hrRegimesNew => 'নতুন ব্যবস্থা';

  @override
  String get hrRegimesOld => 'পুরোনো ব্যবস্থা';

  @override
  String get hrMetro => 'মেট্রো শহরে থাকেন (HRA-র জন্য)';

  @override
  String get hrPaymentMode => 'প্রদানের পদ্ধতি';

  @override
  String get hrPaymentModesBank => 'ব্যাংক ট্রান্সফার';

  @override
  String get hrPaymentModesCash => 'নগদ';

  @override
  String get hrPaymentModesCheque => 'চেক';

  @override
  String get hrBankName => 'ব্যাংক';

  @override
  String get hrBankIfsc => 'IFSC';

  @override
  String get hrBankAccount => 'অ্যাকাউন্ট নম্বর';

  @override
  String hrBankAccountHint(String last4) {
    return 'এনক্রিপ্ট করে রাখা। নথিতে: শেষে $last4';
  }

  @override
  String get hrMonthlyGross => 'মাসিক মোট বেতন';

  @override
  String get hrStatus => 'অবস্থা';

  @override
  String get hrStatusesActive => 'সক্রিয়';

  @override
  String get hrStatusesLeft => 'ছেড়ে গেছেন';

  @override
  String get hrSave => 'সংরক্ষণ করুন';

  @override
  String get hrSaved => 'সংরক্ষিত';

  @override
  String get hrCreate => 'কর্মচারী যোগ করুন';

  @override
  String get hrSalaryTitle => 'বেতন কাঠামো';

  @override
  String get hrSalaryEffectiveFrom => 'থেকে কার্যকর';

  @override
  String get hrSalaryComponent => 'উপাদান';

  @override
  String get hrSalaryMonthly => 'মাসিক (₹)';

  @override
  String get hrSalaryPfWage => 'বেসিক/DA (PF বেতন)';

  @override
  String get hrSalaryHra => 'HRA';

  @override
  String get hrSalaryEsiExcluded => 'ESI বেতনে নয়';

  @override
  String get hrSalaryAdd => 'উপাদান যোগ করুন';

  @override
  String get hrSalaryRevise => 'সংশোধন সংরক্ষণ';

  @override
  String get hrSalaryHistory => 'আগের কাঠামো';

  @override
  String get hrSalaryGross => 'মাসিক মোট';

  @override
  String get hrSalaryAnnual => 'বার্ষিক';

  @override
  String get hrSalaryDefaultsBasic => 'বেসিক';

  @override
  String get hrSalaryDefaultsHra => 'HRA';

  @override
  String get hrSalaryDefaultsSpecial => 'বিশেষ ভাতা';

  @override
  String get hrDeclarationTitle => 'কর ঘোষণা';

  @override
  String get hrDeclarationHint =>
      'TDS-এর জন্য ব্যবহৃত। স্ট্যান্ডার্ড ডিডাকশন ছাড়া অন্য ছাড় শুধু পুরোনো ব্যবস্থায়।';

  @override
  String get hrDeclarationFy => 'আর্থিক বছর';

  @override
  String get hrDeclarationRentPaid => 'বছরে দেওয়া ভাড়া';

  @override
  String get hrDeclarationC80 => '80C বিনিয়োগ (PF স্বয়ংক্রিয়ভাবে যোগ হয়)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) NPS';

  @override
  String get hrDeclarationD80 => '80D স্বাস্থ্য বিমা';

  @override
  String get hrDeclarationHomeLoanInterest => 'গৃহঋণের সুদ';

  @override
  String get hrDeclarationOtherDeductions => 'অন্য ছাড় (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'অন্য আয়';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'এই বছরে আগের নিয়োগকর্তার বেতন';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'এই বছরে আগেই কাটা TDS (আগের নিয়োগকর্তা, বা Varchasv-এর আগে)';

  @override
  String get hrDeclarationSave => 'ঘোষণা সংরক্ষণ';

  @override
  String get hrAttendanceTitle => 'হাজিরা';

  @override
  String get hrAttendanceSubtitle =>
      'চিহ্নিত না করা কাজের দিন উপস্থিত ধরা হয়। অনুপস্থিত করতে দিনে ক্লিক করুন, তারপর অর্ধদিবস, তারপর আবার উপস্থিত।';

  @override
  String get hrAttendanceLegendPresent => 'উপস্থিত';

  @override
  String get hrAttendanceLegendAbsent => 'অনুপস্থিত';

  @override
  String get hrAttendanceLegendHalfDay => 'অর্ধদিবস';

  @override
  String get hrAttendanceLegendLeave => 'ছুটিতে';

  @override
  String get hrAttendanceLegendWeekOff => 'সাপ্তাহিক ছুটি';

  @override
  String get hrAttendanceLegendHoliday => 'ছুটির দিন';

  @override
  String get hrAttendanceLegendLate => 'দেরি';

  @override
  String get hrAttendanceLop => 'বেতন কাটা';

  @override
  String get hrAttendanceLocked =>
      'এই মাসের বেতন চূড়ান্ত, তাই হাজিরা বদলানো যাবে না।';

  @override
  String get hrAttendanceHolidays => 'ছুটির দিন';

  @override
  String get hrAttendanceAddHoliday => 'ছুটি যোগ করুন';

  @override
  String get hrAttendanceHolidayName => 'ছুটি';

  @override
  String get hrAttendanceNoEmployees => 'এই মাসে কেউ চাকরিতে ছিলেন না।';

  @override
  String get hrAttendanceSaving => 'সংরক্ষণ হচ্ছে…';

  @override
  String get hrLeaveTitle => 'ছুটি';

  @override
  String get hrLeaveSubtitle => 'আবেদন, অনুমোদন ও বাকি ছুটি।';

  @override
  String get hrLeaveNew => 'ছুটির আবেদন করুন';

  @override
  String get hrLeaveEmployee => 'কর্মচারী';

  @override
  String get hrLeaveType => 'ছুটির ধরন';

  @override
  String get hrLeaveFrom => 'থেকে';

  @override
  String get hrLeaveTo => 'পর্যন্ত';

  @override
  String get hrLeaveHalfDay => 'অর্ধদিবস';

  @override
  String get hrLeaveReason => 'কারণ';

  @override
  String get hrLeaveDays => 'দিন';

  @override
  String get hrLeaveSubmit => 'আবেদন জমা দিন';

  @override
  String get hrLeaveApprove => 'অনুমোদন';

  @override
  String get hrLeaveReject => 'প্রত্যাখ্যান';

  @override
  String get hrLeaveCancel => 'বাতিল';

  @override
  String get hrLeavePending => 'অনুমোদনের অপেক্ষায়';

  @override
  String get hrLeaveAll => 'সব আবেদন';

  @override
  String get hrLeaveBalances => 'বাকি ছুটি';

  @override
  String get hrLeaveOpening => 'আগের জের';

  @override
  String get hrLeaveQuota => 'এই বছর';

  @override
  String get hrLeaveTaken => 'নেওয়া';

  @override
  String get hrLeaveBalance => 'বাকি';

  @override
  String get hrLeaveNone => 'ছুটির কোনো আবেদন নেই।';

  @override
  String get hrLeaveStatusesPending => 'বাকি';

  @override
  String get hrLeaveStatusesApproved => 'অনুমোদিত';

  @override
  String get hrLeaveStatusesRejected => 'প্রত্যাখ্যাত';

  @override
  String get hrLeaveStatusesCancelled => 'বাতিল';

  @override
  String get hrSettleTitle => 'পূর্ণ ও চূড়ান্ত নিষ্পত্তি';

  @override
  String get hrSettleHint =>
      'কর্মচারীকে ছেড়ে যাওয়া হিসেবে চিহ্নিত করে এবং গ্র্যাচুইটি ও ছুটির নগদায়ন দেয়। শেষ মাসের বেতন পেরোল থেকে আসে।';

  @override
  String get hrSettleLeftOn => 'শেষ কাজের দিন';

  @override
  String get hrSettleServiceYears => 'চাকরির মেয়াদ (বছর)';

  @override
  String get hrSettleGratuity => 'গ্র্যাচুইটি';

  @override
  String get hrSettleNotEligible => 'প্রাপ্য নয় (5 বছরের কম)';

  @override
  String get hrSettleLeaveDays => 'নগদায়নের ছুটি (দিন)';

  @override
  String get hrSettleEncashment => 'ছুটির নগদায়ন';

  @override
  String get hrSettleOtherEarnings => 'অন্য পাওনা (বোনাস, নোটিশ বেতন)';

  @override
  String get hrSettleRecoveries => 'আদায় (অগ্রিম)';

  @override
  String get hrSettleRemarks => 'মন্তব্য';

  @override
  String get hrSettleTotal => 'নিট প্রদেয়';

  @override
  String get hrSettleConfirm =>
      'নিষ্পত্তি করে ছেড়ে যাওয়া হিসেবে চিহ্নিত করুন';

  @override
  String hrSettleDone(String date, String amount) {
    return '$date-এ নিষ্পত্তি: $amount';
  }

  @override
  String get hrPayslips => 'বেতন স্লিপ';

  @override
  String get hrErrorsInvalidPan => 'এই প্যান বৈধ নয় (যেমন ABCDE1234F)।';

  @override
  String get hrErrorsInvalidIfsc => 'এই IFSC বৈধ নয় (যেমন HDFC0001234)।';

  @override
  String get hrErrorsInvalidBankAccount => '6 থেকে 18 অঙ্ক দিন।';

  @override
  String get hrErrorsBasicRequired =>
      'অন্তত একটি উপাদানকে বেসিক/DA হিসেবে চিহ্নিত করুন।';

  @override
  String get hrErrorsNoComponents => 'অন্তত একটি বেতন উপাদান যোগ করুন।';

  @override
  String get hrErrorsDuplicateComponent => 'দুটি উপাদানের কোড একই।';

  @override
  String get hrErrorsEmployeeCodeTaken => 'এই কোড অন্য কর্মচারীর।';

  @override
  String get hrErrorsDobAfterJoining => 'জন্মতারিখ যোগদানের আগে হতে হবে।';

  @override
  String get hrErrorsBeforeJoining => 'এটি যোগদানের তারিখের আগে।';

  @override
  String get hrErrorsLeaveOverlap =>
      'এটি অন্য ছুটির আবেদনের সঙ্গে মিলে যাচ্ছে।';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'যথেষ্ট ছুটি বাকি নেই।';

  @override
  String get hrErrorsNoWorkingDays => 'এই সব তারিখ ছুটি বা সাপ্তাহিক ছুটি।';

  @override
  String get hrErrorsHalfDaySingleDate => 'অর্ধদিবস একটি তারিখেরই হতে হবে।';

  @override
  String get hrErrorsLeaveCrossesYear => '31 মার্চ পেরোনো ছুটি ভাগ করে দিন।';

  @override
  String get hrErrorsNotEmployedOnDate => 'সেই তারিখে চাকরিতে ছিলেন না।';

  @override
  String get hrErrorsDayOnLeave =>
      'সেই দিন অনুমোদিত ছুটি আছে; আগে ছুটি বাতিল করুন।';

  @override
  String get hrErrorsPayrollFinalized => 'সেই মাসের বেতন আগেই চূড়ান্ত।';

  @override
  String get hrErrorsLeaveNotPending => 'এই আবেদনে আগেই সিদ্ধান্ত হয়েছে।';

  @override
  String get hrErrorsLeaveNotOpen => 'এই আবেদন আগেই বন্ধ।';

  @override
  String get hrErrorsLeftBeforeJoining => 'এটি যোগদানের তারিখের আগে।';

  @override
  String get hrErrorsNoSalaryStructure => 'আগে বেতন কাঠামো যোগ করুন।';

  @override
  String get hrErrorsAlreadyLeft => 'এই কর্মচারীর নিষ্পত্তি আগেই হয়েছে।';

  @override
  String get hrErrorsRecoveriesExceedDues =>
      'আদায় পাওনার চেয়ে বেশি হতে পারে না।';

  @override
  String get hrErrorsInvalidUan => 'UAN-এ 12 অঙ্ক থাকে।';

  @override
  String get hrErrorsInvalidEsiNumber => 'ESI IP নম্বরে 10 থেকে 17 অঙ্ক থাকে।';

  @override
  String get hrErrorsInvalidAadhaarLast4 => 'শুধু শেষ 4 অঙ্ক দিন।';

  @override
  String get hrErrorsInvalidPhone => '10 অঙ্কের মোবাইল নম্বর দিন।';

  @override
  String get hrErrorsToBeforeFrom => '“পর্যন্ত” “থেকে”-র আগে হতে পারে না।';

  @override
  String get hrErrorsUnknownLeaveType => 'ছুটির ধরন বেছে নিন।';

  @override
  String get hrErrorsUnknownEmployee => 'কর্মচারী বেছে নিন।';

  @override
  String get hrErrorsLoanNotActive => 'এই ঋণ সম্পূর্ণ শোধ হয়েছে বা বাতিল।';

  @override
  String get hrErrorsOverRecovery => 'এই টাকা ঋণে বাকি টাকার চেয়ে বেশি।';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'পরিশোধের তারিখ ঋণ দেওয়ার তারিখের আগে।';

  @override
  String get hrErrorsExpiryBeforeIssue =>
      'মেয়াদ শেষের তারিখ ইস্যুর তারিখের আগে।';

  @override
  String get hrLoansTitle => 'অগ্রিম ও ঋণ';

  @override
  String get hrLoansNew => 'অগ্রিম বা ঋণ দিন';

  @override
  String get hrLoansKind => 'ধরন';

  @override
  String get hrLoansKindsAdvance => 'বেতন অগ্রিম';

  @override
  String get hrLoansKindsLoan => 'ঋণ';

  @override
  String get hrLoansDate => 'দেওয়ার তারিখ';

  @override
  String get hrLoansAmount => 'অঙ্ক';

  @override
  String get hrLoansInstalment => 'মাসিক কিস্তি';

  @override
  String get hrLoansStartPeriod => 'আদায় শুরু';

  @override
  String get hrLoansPaidFrom => 'থেকে দেওয়া';

  @override
  String get hrLoansRemarks => 'মন্তব্য';

  @override
  String get hrLoansRecovered => 'আদায়';

  @override
  String get hrLoansBalance => 'বাকি';

  @override
  String get hrLoansStatusesActive => 'আদায় চলছে';

  @override
  String get hrLoansStatusesClosed => 'আদায় সম্পূর্ণ';

  @override
  String get hrLoansStatusesCancelled => 'বাতিল';

  @override
  String get hrLoansNone => 'কোনো অগ্রিম বা ঋণ নেই।';

  @override
  String get hrLoansCreate => 'দিন';

  @override
  String get hrLoansCancel => 'বাতিল';

  @override
  String get hrLoansReceive => 'পরিশোধ নিন';

  @override
  String get hrLoansReceiveAmount => 'প্রাপ্ত টাকা';

  @override
  String get hrLoansReceivedInto => 'কোন অ্যাকাউন্টে পাওয়া গেল';

  @override
  String get hrLoansReceiveSave => 'পরিশোধ সংরক্ষণ করুন';

  @override
  String get hrShiftsTitle => 'শিফট';

  @override
  String get hrShiftsName => 'শিফট';

  @override
  String get hrShiftsStart => 'শুরু';

  @override
  String get hrShiftsEnd => 'শেষ';

  @override
  String get hrShiftsGrace => 'ছাড় (মিনিট)';

  @override
  String get hrShiftsFullDay => 'পূর্ণদিবস (মিনিট)';

  @override
  String get hrShiftsHalfDay => 'অর্ধদিবস (মিনিট)';

  @override
  String get hrShiftsIsDefault => 'প্রধান';

  @override
  String get hrShiftsAdd => 'শিফট যোগ করুন';

  @override
  String get hrShiftsSave => 'সংরক্ষণ করুন';

  @override
  String get hrShiftsNone =>
      'এখনো কোনো শিফট নেই। পাঞ্চ 09:30–18:30 অনুযায়ী পড়া হয়।';

  @override
  String get hrShiftsShift => 'শিফট';

  @override
  String get hrShiftsNoShift => 'কোম্পানির প্রধান';

  @override
  String get hrPunchesTitle => 'পাঞ্চ আমদানি';

  @override
  String get hrPunchesHint =>
      'বায়োমেট্রিক মেশিনের CSV, কলাম: code, date (YYYY-MM-DD), in, out (24 ঘণ্টা HH:MM)। প্রতিটি দিন কর্মচারীর শিফট অনুযায়ী পড়া হয়।';

  @override
  String get hrPunchesTemplate => 'নমুনা CSV ডাউনলোড';

  @override
  String get hrPunchesChoose => 'CSV ফাইল বেছে নিন';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count দিন',
      one: '$count দিন',
    );
    return '$_temp0 আমদানি করুন';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count দিন',
      one: '$count দিন',
    );
    return '$_temp0 আমদানি হয়েছে।';
  }

  @override
  String get hrPunchesRow => 'সারি';

  @override
  String get hrPunchesCode => 'কোড';

  @override
  String get hrPunchesDate => 'তারিখ';

  @override
  String get hrPunchesWorked => 'কাজ করেছেন';

  @override
  String get hrPunchesStatus => 'ফলাফল';

  @override
  String get hrPunchesLate => 'দেরি';

  @override
  String get hrDocumentsTitle => 'নথি ও কেওয়াইসি';

  @override
  String get hrDocumentsHelp =>
      'পরিচয় ও নিয়মমাফিক নথি। নম্বরের শুধু শেষ চারটি অক্ষর দেখা যায়। মেয়াদ শেষের আগে মনে করাতে মেয়াদ যোগ করুন।';

  @override
  String get hrDocumentsNone => 'এখনও কোনো নথি নেই।';

  @override
  String hrDocumentsExpires(String date) {
    return '$date তারিখে মেয়াদ শেষ';
  }

  @override
  String get hrDocumentsNoExpiry => 'মেয়াদ নেই';

  @override
  String get hrDocumentsExpired => 'মেয়াদ শেষ';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n দিন বাকি',
      one: '$n দিন বাকি',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'সরান';

  @override
  String get hrDocumentsKind => 'নথি';

  @override
  String get hrDocumentsNumber => 'নম্বর';

  @override
  String get hrDocumentsIssuedOn => 'ইস্যুর তারিখ';

  @override
  String get hrDocumentsExpiresOnLabel => 'মেয়াদ শেষের তারিখ';

  @override
  String get hrDocumentsAdd => 'নথি যোগ করুন';

  @override
  String get hrDocumentsKindsAadhaar => 'আধার';

  @override
  String get hrDocumentsKindsPan => 'প্যান';

  @override
  String get hrDocumentsKindsPassport => 'পাসপোর্ট';

  @override
  String get hrDocumentsKindsDrivingLicence => 'ড্রাইভিং লাইসেন্স';

  @override
  String get hrDocumentsKindsVoterId => 'ভোটার আইডি';

  @override
  String get hrDocumentsKindsBankProof => 'ব্যাংক প্রমাণ';

  @override
  String get hrDocumentsKindsPoliceVerification => 'পুলিশ যাচাই';

  @override
  String get hrDocumentsKindsMedicalFitness => 'চিকিৎসা ফিটনেস';

  @override
  String get hrDocumentsKindsContract => 'চুক্তি';

  @override
  String get hrDocumentsKindsOther => 'অন্যান্য';

  @override
  String get hrDocumentsExpiringTitle => 'মেয়াদ শেষ হতে চলা নথি';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'কর্মরত কর্মীদের যে নথির মেয়াদ শেষ বা শীঘ্রই শেষ হবে, সবচেয়ে আগে যেটি সেটি ওপরে।';

  @override
  String get hrDocumentsWithin => 'এর মধ্যে মেয়াদ শেষ';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n দিন',
      one: '$n দিন',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'দেখান';

  @override
  String get hrDocumentsEmployee => 'কর্মী';

  @override
  String get hrDocumentsNoneExpiring => 'এই সময়ে কিছুর মেয়াদ শেষ হচ্ছে না।';

  @override
  String get payrollTitle => 'বেতন';

  @override
  String get payrollSubtitle =>
      'PF, ESI, বৃত্তি কর ও TDS হিসাব করে মাসিক বেতন, আপনার হিসাবে পোস্ট করা।';

  @override
  String get payrollRun => 'বেতন হিসাব করুন';

  @override
  String get payrollMonth => 'মাস';

  @override
  String get payrollNone => 'এখনো বেতন হিসাব হয়নি।';

  @override
  String payrollEmployees(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count জন কর্মচারী',
      one: '$count জন কর্মচারী',
    );
    return '$_temp0';
  }

  @override
  String get payrollStatusesDraft => 'খসড়া';

  @override
  String get payrollStatusesFinalized => 'চূড়ান্ত';

  @override
  String get payrollStatusesPaid => 'দেওয়া হয়েছে';

  @override
  String get payrollStatusesCancelled => 'বাতিল';

  @override
  String get payrollColsEmployee => 'কর্মচারী';

  @override
  String get payrollColsPaidDays => 'বেতনের দিন';

  @override
  String get payrollColsLop => 'বেতন কাটার দিন';

  @override
  String get payrollColsGross => 'মোট';

  @override
  String get payrollColsPf => 'PF';

  @override
  String get payrollColsEsi => 'ESI';

  @override
  String get payrollColsPt => 'বৃত্তি কর';

  @override
  String get payrollColsLwf => 'LWF';

  @override
  String get payrollColsTds => 'TDS';

  @override
  String get payrollColsOther => 'অন্যান্য';

  @override
  String get payrollColsNet => 'নিট বেতন';

  @override
  String get payrollRefresh => 'হাজিরা থেকে হালনাগাদ';

  @override
  String get payrollFinalize => 'চূড়ান্ত করে পোস্ট করুন';

  @override
  String get payrollFinalizeHint =>
      'বেতন, PF, ESI, বৃত্তি কর ও TDS প্রদেয় আপনার হিসাবে পোস্ট করে। তারপর মাসের হাজিরা লক হয়।';

  @override
  String get payrollPay => 'প্রদান লিখুন';

  @override
  String get payrollPayFrom => 'থেকে দেওয়া';

  @override
  String get payrollPayDate => 'প্রদানের তারিখ';

  @override
  String get payrollCancel => 'বেতন বাতিল';

  @override
  String get payrollFilesTitle => 'দাখিল ও প্রদানের ফাইল';

  @override
  String get payrollFilesEcr => 'EPF ECR';

  @override
  String get payrollFilesEsi => 'ESI অবদান';

  @override
  String get payrollFilesBank => 'ব্যাংক ট্রান্সফার';

  @override
  String payrollFilesMissing(String codes) {
    return 'বাদ পড়েছে (তথ্য নেই): $codes';
  }

  @override
  String get payrollTotalsGross => 'মোট বেতন';

  @override
  String get payrollTotalsDeductions => 'কাটা';

  @override
  String get payrollTotalsNet => 'নিট বেতন';

  @override
  String get payrollTotalsEmployer => 'নিয়োগকর্তার PF/ESI/LWF';

  @override
  String get payrollLopEdited => 'হাতে লেখা';

  @override
  String get payrollLopReset => 'হাজিরা ব্যবহার করুন';

  @override
  String get payrollAddDeduction => 'কাটা যোগ করুন';

  @override
  String get payrollDeductionName => 'কাটা';

  @override
  String get payrollDeductionAmount => 'অঙ্ক';

  @override
  String get payrollEdit => 'সম্পাদনা';

  @override
  String get payrollView => 'বেতন স্লিপ';

  @override
  String get payrollErrorsRunExists => 'সেই মাসের বেতন আগে থেকেই আছে।';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'আগে আগের মাসের খসড়া চূড়ান্ত বা বাতিল করুন।';

  @override
  String get payrollErrorsRunNotDraft => 'শুধু খসড়া বদলানো যায়।';

  @override
  String get payrollErrorsRunEmpty => 'চূড়ান্ত করার মতো কোনো বেতন স্লিপ নেই।';

  @override
  String get payrollErrorsRunNotFinalized => 'আগে বেতন চূড়ান্ত করুন।';

  @override
  String get payrollErrorsRunPaid => 'দেওয়া বেতন বাতিল করা যায় না।';

  @override
  String get payrollErrorsLaterRunFinal =>
      'পরের মাস আগেই চূড়ান্ত; আগে সেটি বাতিল করুন।';

  @override
  String get payrollErrorsLopExceedsDays =>
      'বেতন কাটার দিন মাসের দিনের চেয়ে বেশি।';

  @override
  String get payrollErrorsDeductionsExceedPay => 'কাটা বেতনের চেয়ে বেশি।';

  @override
  String get payrollErrorsInvalidPeriod => 'মাস বেছে নিন।';

  @override
  String get payrollErrorsInvalidSettings => 'সেটিংস দেখে নিন।';

  @override
  String get payrollErrorsReservedCode =>
      'এই কোড স্বয়ংক্রিয় বকেয়ার জন্য সংরক্ষিত।';

  @override
  String get payrollErrorsInvalidInstalment =>
      'কিস্তি 0-এর বেশি এবং অঙ্কের বেশি নয় হতে হবে।';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'ঋণ দেওয়ার আগে আদায় শুরু হতে পারে না।';

  @override
  String get payrollErrorsEmployeeNotActive => 'এই কর্মচারী ছেড়ে গেছেন।';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'এর কিছু অংশ আগেই আদায় হয়েছে; বাতিল করা যাবে না।';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'BSR কোড ও চালানের ক্রমিক নম্বর দিন।';

  @override
  String get payrollErrorsInvalidBsrCode => 'BSR কোডে 7 অঙ্ক থাকে।';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'চালানের ক্রমিক নম্বরে 5 অঙ্ক পর্যন্ত থাকে।';

  @override
  String get payrollErrorsInvalidTan => 'এই TAN বৈধ নয় (যেমন MUMA12345B)।';

  @override
  String get payrollErrorsNoFinalPayslips =>
      'সেই বছরের কোনো চূড়ান্ত বেতন স্লিপ নেই।';

  @override
  String get payrollErrorsInvalidTime => '09:30-এর মতো 24 ঘণ্টার সময় দিন।';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'অর্ধদিবস পূর্ণদিবসের চেয়ে লম্বা হতে পারে না।';

  @override
  String get payrollErrorsInvalidAmount => 'অঙ্ক দিন।';

  @override
  String get payrollSettingsTitle => 'বেতনের সেটিংস';

  @override
  String get payrollSettingsSubtitle =>
      'নিবন্ধন কোড, সাপ্তাহিক ছুটি ও রাজ্যের কর।';

  @override
  String get payrollSettingsPfCode => 'EPF প্রতিষ্ঠান কোড';

  @override
  String get payrollSettingsEsiCode => 'ESI নিয়োগকর্তা কোড';

  @override
  String get payrollSettingsLabourCode =>
      'শ্রম কোডের 50% বেতন নিয়ম প্রয়োগ করুন';

  @override
  String get payrollSettingsLabourCodeHint =>
      'সামাজিক সুরক্ষা কোড অনুযায়ী (21 নভে 2025 থেকে), ভাতা বেতনের অর্ধেকের বেশি হলে অতিরিক্ত অংশ PF বেতন ধরা হয়।';

  @override
  String get payrollSettingsWeeklyOffs => 'সাপ্তাহিক ছুটি';

  @override
  String get payrollSettingsLwf => 'শ্রমিক কল্যাণ তহবিল';

  @override
  String get payrollSettingsLwfEmployee => 'কর্মচারীর অংশ (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'নিয়োগকর্তার অংশ (₹)';

  @override
  String get payrollSettingsLwfMonths => 'যে মাসে কাটা হয়';

  @override
  String get payrollSettingsEncashment => 'দৈনিক ছুটির নগদায়ন';

  @override
  String payrollSettingsDivisor(String n) {
    return 'মাসিক বেতন ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'সংরক্ষণ করুন';

  @override
  String get payrollSettingsTan => 'TAN (কর কর্তন অ্যাকাউন্ট নম্বর)';

  @override
  String get payrollSlipTitle => 'বেতন স্লিপ';

  @override
  String payrollSlipFor(String month) {
    return '$month-এর বেতন স্লিপ';
  }

  @override
  String get payrollSlipEarnings => 'আয়';

  @override
  String get payrollSlipDeductions => 'কাটা';

  @override
  String get payrollSlipNetPay => 'নিট বেতন';

  @override
  String get payrollSlipInWords => 'কথায়';

  @override
  String get payrollSlipEmployer => 'নিয়োগকর্তার অবদান (কাটা নয়)';

  @override
  String get payrollSlipTax => 'আয়করের হিসাব';

  @override
  String get payrollSlipAnnualSalary => 'বছরের আনুমানিক বেতন';

  @override
  String get payrollSlipTaxableIncome => 'করযোগ্য আয়';

  @override
  String get payrollSlipAnnualTax => 'বছরের কর';

  @override
  String get payrollSlipDeductedSoFar => 'এখন পর্যন্ত কাটা';

  @override
  String get payrollSlipPfEmployee => 'প্রভিডেন্ট ফান্ড';

  @override
  String get payrollSlipEsiEmployee => 'ESI';

  @override
  String get payrollSlipPt => 'বৃত্তি কর';

  @override
  String get payrollSlipLwf => 'শ্রমিক কল্যাণ তহবিল';

  @override
  String get payrollSlipTds => 'আয়কর (TDS)';

  @override
  String get payrollSlipEps => 'পেনশন (EPS)';

  @override
  String get payrollSlipEpf => 'PF (নিয়োগকর্তা)';

  @override
  String get payrollSlipEdli => 'EDLI';

  @override
  String get payrollSlipAdmin => 'PF প্রশাসন';

  @override
  String get payrollSlipEsiEmployer => 'ESI (নিয়োগকর্তা)';

  @override
  String get payrollSlipComputerGenerated =>
      'এটি কম্পিউটারে তৈরি বেতন স্লিপ, স্বাক্ষর লাগে না।';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি আগের মাস',
      one: '$countটি আগের মাস',
    );
    return 'বেতন কাঠামো থেকে অনুমিত $_temp0 অন্তর্ভুক্ত (Varchasv-এর আগে দেওয়া)।';
  }

  @override
  String get payrollExtraTitle => 'অতিরিক্ত আয় (শুধু এই মাস)';

  @override
  String get payrollExtraName => 'আয়';

  @override
  String get payrollExtraAmount => 'অঙ্ক';

  @override
  String get payrollExtraAdd => 'আয় যোগ করুন';

  @override
  String get payrollExtraEsiExcluded => 'ESI বেতনে নয় (যেমন বোনাস)';

  @override
  String get payrollLoanRecoveryTitle => 'ঋণ ও অগ্রিমের কিস্তি';

  @override
  String get payrollLoanRecoveryHint =>
      'এই মাসে বাদ দিতে 0 লিখুন; কিস্তি ব্যবহার করতে খালি করুন।';

  @override
  String get payrollRegister => 'বেতন রেজিস্টার';

  @override
  String get payrollEmail => 'বেতন স্লিপ ইমেল করুন';

  @override
  String payrollEmailed(String sent) {
    return '$sent ইমেল করা হয়েছে।';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'ইমেল ঠিকানা নেই: $codes';
  }

  @override
  String get statutoryTitle => 'বিধিবদ্ধ দেনা ও TDS';

  @override
  String get statutorySubtitle =>
      'চূড়ান্ত বেতন থেকে PF, ESI, বৃত্তি কর, LWF ও TDS, কী দেওয়া হয়েছে, ত্রৈমাসিক TDS রিটার্ন ও ফর্ম 16।';

  @override
  String get statutoryFy => 'আর্থিক বছর';

  @override
  String get statutoryDues => 'দেনা ও প্রদান';

  @override
  String get statutoryKind => 'ধরন';

  @override
  String get statutoryKindsPf => 'PF';

  @override
  String get statutoryKindsEsi => 'ESI';

  @override
  String get statutoryKindsPt => 'বৃত্তি কর';

  @override
  String get statutoryKindsLwf => 'LWF';

  @override
  String get statutoryKindsTds => 'TDS';

  @override
  String get statutoryPeriod => 'বেতনের মাস';

  @override
  String get statutoryDue => 'দেয়';

  @override
  String get statutoryPaid => 'দেওয়া';

  @override
  String get statutoryBalance => 'বাকি';

  @override
  String get statutoryDueDate => 'শেষ তারিখ';

  @override
  String get statutoryPay => 'প্রদান লিখুন';

  @override
  String get statutoryPaidOn => 'দেওয়ার তারিখ';

  @override
  String get statutoryAccount => 'থেকে দেওয়া';

  @override
  String get statutoryReference => 'চালান / TRRN নং';

  @override
  String get statutoryBsrCode => 'BSR কোড';

  @override
  String get statutoryChallanSerial => 'চালানের ক্রমিক নং';

  @override
  String get statutoryRecord => 'প্রদান সংরক্ষণ';

  @override
  String get statutoryNone => 'এই বছরে এখনো চূড়ান্ত বেতন নেই।';

  @override
  String get statutoryOverdue => 'মেয়াদোত্তীর্ণ';

  @override
  String get statutoryQ24Title => 'ত্রৈমাসিক TDS রিটার্ন (ফর্ম 24Q)';

  @override
  String get statutoryQ24Quarter => 'ত্রৈমাসিক';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · এপ্রিল–জুন';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · জুলাই–সেপ্টে';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · অক্টো–ডিসে';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · জানু–মার্চ';

  @override
  String get statutoryQ24Deductees => 'কর্তিত ব্যক্তির সারি';

  @override
  String get statutoryQ24Challans => 'চালান';

  @override
  String get statutoryQ24TotalTds => 'TDS';

  @override
  String get statutoryQ24Download => 'কর্তিত ব্যক্তির সারি (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'পরিশিষ্ট II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'এগুলো NSDL রিটার্ন প্রিপারেশন ইউটিলিটি (RPU)-তে আমদানি করুন, FVU দিয়ে ফাইল যাচাই করুন, তারপর TIN-NSDL-এ আপলোড করুন।';

  @override
  String get statutoryQ24WarningsTanMissing => 'বেতনের সেটিংসে TAN দিন।';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return '$detail-এর প্যান নেই: প্যান ছাড়া 20% হারে কর কাটতে হবে।';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return '$detail-এর জন্য কাটা ও জমা দেওয়া কর মিলছে না।';
  }

  @override
  String get statutoryForm16Title => 'ফর্ম 16';

  @override
  String get statutoryForm16Hint =>
      'পার্ট B বেতন থেকে। পার্ট A TRACES থেকে ডাউনলোড করে জুড়ুন; দুটিতেই নিয়োগকর্তার স্বাক্ষর।';

  @override
  String get statutoryForm16View => 'পার্ট B';

  @override
  String get form16Title => 'ফর্ম 16 · পার্ট B';

  @override
  String get form16Subtitle =>
      'বেতনের উৎসে কাটা করের জন্য ধারা 203 অনুযায়ী শংসাপত্র';

  @override
  String get form16Employer => 'নিয়োগকর্তা';

  @override
  String get form16Employee => 'কর্মচারী';

  @override
  String get form16Tan => 'TAN';

  @override
  String get form16Pan => 'প্যান';

  @override
  String get form16Ay => 'মূল্যায়ন বছর';

  @override
  String get form16Period => 'চাকরির সময়কাল';

  @override
  String get form16Salary => 'দেওয়া বেতন';

  @override
  String get form16Gross => 'মোট বেতন';

  @override
  String get form16Previous => 'আগের নিয়োগকর্তার বেতন';

  @override
  String get form16Exemptions => 'বাদ: ধারা 16 অনুযায়ী ছাড় ও কর্তন';

  @override
  String get form16HraExempt => 'বাড়িভাড়া ভাতা ছাড়';

  @override
  String get form16StandardDeduction => 'স্ট্যান্ডার্ড ডিডাকশন';

  @override
  String get form16Pt => 'বৃত্তি কর';

  @override
  String get form16HouseProperty => 'বাড়ি সম্পত্তি থেকে আয় (গৃহঋণের সুদ)';

  @override
  String get form16ChapterVIA => 'অধ্যায় VI-A অনুযায়ী ছাড়';

  @override
  String get form16TaxableIncome => 'মোট করযোগ্য আয়';

  @override
  String get form16Tax => 'মোট আয়ের উপর কর';

  @override
  String get form16Rebate => 'ধারা 87A অনুযায়ী রিবেট';

  @override
  String get form16Surcharge => 'সারচার্জ';

  @override
  String get form16Cess => 'স্বাস্থ্য ও শিক্ষা সেস';

  @override
  String get form16Total => 'প্রদেয় কর';

  @override
  String get form16Regime => 'কর ব্যবস্থা';

  @override
  String get form16TdsQuarterly => 'কাটা ও জমা দেওয়া কর';

  @override
  String get form16Quarter => 'ত্রৈমাসিক';

  @override
  String get form16Challans => 'চালান (BSR কোড · তারিখ · ক্রমিক নং)';

  @override
  String get form16TdsDeducted => 'মোট কাটা কর';

  @override
  String get form16Balance => 'প্রদেয় কর (ফেরতযোগ্য)';

  @override
  String get form16Verification =>
      'উপলব্ধ হিসাবের খাতা, নথি ও রেকর্ডের ভিত্তিতে উপরের তথ্য সত্য ও সঠিক বলে প্রত্যয়িত করা হচ্ছে।';

  @override
  String get form16Signature => 'কর কাটার দায়িত্বপ্রাপ্ত ব্যক্তির স্বাক্ষর';

  @override
  String get form16PartA => 'পার্ট A (TRACES থেকে) জুড়তে হবে।';

  @override
  String form16Missing(String months) {
    return '$months-এর বেতন স্লিপ এখানে নেই (Varchasv-এর আগে দেওয়া)। স্বাক্ষরের আগে সেই বেতন ও কর যোগ করুন।';
  }

  @override
  String get mfgBomsTitle => 'উপকরণ তালিকা (BOM)';

  @override
  String get mfgBomsSubtitle =>
      'আপনি যা তৈরি করেন তার প্রতিটিতে কী লাগে, অপচয়, কাজের কেন্দ্রের সময় ও ওভারহেড সহ।';

  @override
  String get mfgBomsNew => 'নতুন বিওএম';

  @override
  String get mfgBomsItem => 'তৈরি পণ্য';

  @override
  String get mfgBomsVersion => 'সংস্করণ';

  @override
  String get mfgBomsOutputQty => 'উৎপাদন (পরিমাণ)';

  @override
  String get mfgBomsOverhead => 'প্রতি ব্যাচে স্থির ওভারহেড (₹)';

  @override
  String get mfgBomsComponent => 'উপকরণ';

  @override
  String get mfgBomsQty => 'পরিমাণ';

  @override
  String get mfgBomsWastage => 'অপচয় %';

  @override
  String get mfgBomsOperations => 'প্রক্রিয়া';

  @override
  String get mfgBomsOperation => 'প্রক্রিয়া';

  @override
  String get mfgBomsWorkCentre => 'কাজের কেন্দ্র';

  @override
  String get mfgBomsMinutes => 'মিনিট';

  @override
  String get mfgBomsAddLine => 'উপকরণ যোগ করুন';

  @override
  String get mfgBomsAddOperation => 'প্রক্রিয়া যোগ করুন';

  @override
  String get mfgBomsSave => 'বিওএম সংরক্ষণ';

  @override
  String get mfgBomsMakeDefault => 'প্রধান হিসেবে ব্যবহার করুন';

  @override
  String get mfgBomsDefault => 'প্রধান';

  @override
  String get mfgBomsArchive => 'আর্কাইভ করুন';

  @override
  String get mfgBomsArchived => 'আর্কাইভ';

  @override
  String get mfgBomsUnitCost => 'প্রতি এককের খরচ';

  @override
  String get mfgBomsOverheadPerUnit => 'প্রতি এককের ওভারহেড';

  @override
  String get mfgBomsRate => 'দর';

  @override
  String get mfgBomsCost => 'খরচ';

  @override
  String get mfgBomsNone => 'এখনো কোনো বিওএম নেই।';

  @override
  String get mfgBomsNotes => 'নোট';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি উপকরণ',
      one: '$countটি উপকরণ',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'কাজের কেন্দ্র';

  @override
  String get mfgWorkCentresName => 'কাজের কেন্দ্র';

  @override
  String get mfgWorkCentresCostPerHour => 'প্রতি ঘণ্টার খরচ (₹)';

  @override
  String get mfgWorkCentresAdd => 'কাজের কেন্দ্র যোগ করুন';

  @override
  String get mfgWorkCentresSave => 'সংরক্ষণ করুন';

  @override
  String get mfgOrdersTitle => 'উৎপাদন অর্ডার';

  @override
  String get mfgOrdersSubtitle =>
      'উৎপাদনের পরিকল্পনা, শুরু ও সমাপ্তি। উপকরণ স্টক থেকে যায় আর উৎপাদন খরচে আসে।';

  @override
  String get mfgOrdersNew => 'নতুন উৎপাদন অর্ডার';

  @override
  String get mfgOrdersItem => 'পণ্য';

  @override
  String get mfgOrdersQty => 'পরিমাণ';

  @override
  String get mfgOrdersDate => 'তারিখ';

  @override
  String get mfgOrdersStatus => 'অবস্থা';

  @override
  String get mfgOrdersStatusesPlanned => 'পরিকল্পিত';

  @override
  String get mfgOrdersStatusesReleased => 'শুরু হয়েছে';

  @override
  String get mfgOrdersStatusesCompleted => 'সম্পূর্ণ';

  @override
  String get mfgOrdersStatusesCancelled => 'বাতিল';

  @override
  String get mfgOrdersProduced => 'উৎপাদিত';

  @override
  String get mfgOrdersRejected => 'বাতিল মাল';

  @override
  String get mfgOrdersRelease => 'শুরু করুন';

  @override
  String get mfgOrdersIssue => 'অতিরিক্ত উপকরণ দিন';

  @override
  String get mfgOrdersComplete => 'উৎপাদন লিখুন';

  @override
  String get mfgOrdersGoodQty => 'ভালো পরিমাণ';

  @override
  String get mfgOrdersRejectedQty => 'বাতিল';

  @override
  String get mfgOrdersClose => 'এরপর অর্ডার বন্ধ করুন';

  @override
  String get mfgOrdersRemaining => 'এখনো বানাতে হবে';

  @override
  String get mfgOrdersMaterials => 'বাকির জন্য উপকরণ';

  @override
  String get mfgOrdersEntries => 'ইতিহাস';

  @override
  String get mfgOrdersUnitCost => 'একক খরচ';

  @override
  String get mfgOrdersMaterialCost => 'উপকরণ খরচ';

  @override
  String get mfgOrdersOverheadCost => 'ওভারহেড';

  @override
  String get mfgOrdersKindsIssue => 'অতিরিক্ত উপকরণ';

  @override
  String get mfgOrdersKindsComplete => 'উৎপাদন';

  @override
  String get mfgOrdersReleaseNow => 'এখনই শুরু করুন';

  @override
  String get mfgOrdersNone => 'এখনো কোনো উৎপাদন অর্ডার নেই।';

  @override
  String get mfgOrdersSave => 'অর্ডার তৈরি করুন';

  @override
  String get mfgOrdersCancel => 'অর্ডার বাতিল করুন';

  @override
  String get mfgMrpTitle => 'মাল পরিকল্পনা (MRP)';

  @override
  String get mfgMrpSubtitle =>
      'খোলা বিক্রয় অর্ডার ও পুনরায় অর্ডার স্তর পূরণে কী বানাবেন আর কী কিনবেন, স্টক ও আগেই অর্ডার দেওয়া বাদ দিয়ে।';

  @override
  String get mfgMrpAsOf => 'এই তারিখ অনুযায়ী পরিকল্পনা';

  @override
  String get mfgMrpAction => 'কাজ';

  @override
  String get mfgMrpActionsMake => 'বানান';

  @override
  String get mfgMrpActionsBuy => 'কিনুন';

  @override
  String get mfgMrpQty => 'পরিমাণ';

  @override
  String get mfgMrpNeedBy => 'যে তারিখে লাগবে';

  @override
  String get mfgMrpReleaseBy => 'শুরু / অর্ডারের শেষ তারিখ';

  @override
  String get mfgMrpOnHand => 'হাতে';

  @override
  String get mfgMrpOnOrder => 'অর্ডারে';

  @override
  String get mfgMrpSupplier => 'সরবরাহকারী';

  @override
  String get mfgMrpConvert => 'বাছাই করাগুলোর অর্ডার তৈরি করুন';

  @override
  String mfgMrpCreated(String orders) {
    return '$orders তৈরি হয়েছে।';
  }

  @override
  String get mfgMrpNone => 'পরিকল্পনার দরকার নেই: স্টক ও অর্ডার চাহিদা মেটায়।';

  @override
  String get mfgJobWorkTitle => 'জব ওয়ার্ক';

  @override
  String get mfgJobWorkSubtitle =>
      'চালানে জব ওয়ার্কারের কাছে পাঠানো ও প্রক্রিয়ার পর ফেরত আসা মাল। কাঁচামাল এক বছরের মধ্যে ফেরত আসতে হবে (মূলধনী মাল তিন বছরে)।';

  @override
  String get mfgJobWorkSend => 'জব ওয়ার্কে পাঠান';

  @override
  String get mfgJobWorkReceive => 'ফেরত নিন';

  @override
  String get mfgJobWorkJobWorker => 'জব ওয়ার্কার';

  @override
  String get mfgJobWorkProcess => 'প্রক্রিয়া';

  @override
  String get mfgJobWorkSent => 'পাঠানো';

  @override
  String get mfgJobWorkPending => 'এখনো জব ওয়ার্কারের কাছে';

  @override
  String get mfgJobWorkReturnBy => 'ফেরতের শেষ তারিখ';

  @override
  String get mfgJobWorkOverdue => 'মেয়াদোত্তীর্ণ';

  @override
  String get mfgJobWorkReceived => 'ফেরত পাওয়া পণ্য';

  @override
  String get mfgJobWorkConsumed => 'ব্যবহৃত কাঁচামাল';

  @override
  String get mfgJobWorkCharges => 'জব চার্জ (₹)';

  @override
  String get mfgJobWorkFrom => 'চালান থেকে';

  @override
  String get mfgJobWorkItc04 => 'ITC-04 (ষাণ্মাসিক)';

  @override
  String get mfgJobWorkHalf => 'অর্ধবর্ষ';

  @override
  String get mfgJobWorkHalvesH1 => 'এপ্রিল–সেপ্টেম্বর';

  @override
  String get mfgJobWorkHalvesH2 => 'অক্টোবর–মার্চ';

  @override
  String get mfgJobWorkSentTable => 'পাঠানো মাল';

  @override
  String get mfgJobWorkReceivedTable => 'ফেরত আসা মাল';

  @override
  String get mfgJobWorkPendingTable => 'জব ওয়ার্কারের কাছে বাকি';

  @override
  String get mfgJobWorkNone => 'এখনো কোনো জব ওয়ার্ক নেই।';

  @override
  String get mfgJobWorkCapitalGoods => 'মূলধনী মাল';

  @override
  String get mfgErrorsBomCycle =>
      'এতে চক্র তৈরি হয়: পণ্যটির নিজেকেই দরকার হবে।';

  @override
  String get mfgErrorsBomEmpty => 'অন্তত একটি উপকরণ যোগ করুন।';

  @override
  String get mfgErrorsInvalidOutputQty => 'এক ব্যাচে কতটা তৈরি হয় দিন।';

  @override
  String get mfgErrorsDuplicateComponent => 'একটি উপকরণ দুবার আছে।';

  @override
  String get mfgErrorsUnknownWorkCentre => 'কাজের কেন্দ্র বেছে নিন।';

  @override
  String get mfgErrorsNoBom => 'এই পণ্যের কোনো সক্রিয় বিওএম নেই।';

  @override
  String get mfgErrorsBomArchived => 'সেই বিওএম আর্কাইভ করা।';

  @override
  String get mfgErrorsOrderNotPlanned => 'শুধু পরিকল্পিত অর্ডার শুরু করা যায়।';

  @override
  String get mfgErrorsOrderNotReleased => 'আগে অর্ডার শুরু করুন।';

  @override
  String get mfgErrorsSupplierRequired =>
      'কেনার পণ্যের জন্য সরবরাহকারী বেছে নিন।';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'জব ওয়ার্কার হিসেবে সরবরাহকারী বা গ্রাহক বেছে নিন।';

  @override
  String get mfgErrorsUnknownChallan => 'পাঠানো চালান বেছে নিন।';

  @override
  String get mfgErrorsChallanCancelled => 'সেই চালান বাতিল।';

  @override
  String get mfgErrorsItemNotSent => 'এই পণ্য এই চালানে পাঠানো হয়নি।';

  @override
  String get mfgErrorsMoreThanSent =>
      'এটি জব ওয়ার্কারের কাছে বাকির চেয়ে বেশি।';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'এই চালানে মাল ফেরত এসেছে; আগে সেগুলো বাতিল করুন।';

  @override
  String get posBillingTitle => 'বিলিং';

  @override
  String get posBillingTerminal => 'কাউন্টার';

  @override
  String get posBillingChooseTerminal => 'কাউন্টার বেছে নিন';

  @override
  String get posBillingOpenShift => 'শিফট শুরু করুন';

  @override
  String get posBillingOpeningCash => 'শুরুর নগদ (₹)';

  @override
  String get posBillingCloseShift => 'শিফট বন্ধ করুন';

  @override
  String get posBillingCountedCash => 'গোনা নগদ (₹)';

  @override
  String get posBillingExpected => 'প্রত্যাশিত';

  @override
  String get posBillingDifference => 'পার্থক্য';

  @override
  String get posBillingSearch => 'বারকোড স্ক্যান করুন বা পণ্য খুঁজুন';

  @override
  String get posBillingCart => 'বিল';

  @override
  String get posBillingEmpty => 'বিল শুরু করতে পণ্য যোগ করুন।';

  @override
  String get posBillingQty => 'পরিমাণ';

  @override
  String get posBillingPrice => 'দাম';

  @override
  String get posBillingAmount => 'অঙ্ক';

  @override
  String get posBillingDiscount => 'বিলে ছাড় (₹)';

  @override
  String get posBillingCustomer => 'গ্রাহকের মোবাইল (পয়েন্টের জন্য)';

  @override
  String get posBillingCustomerName => 'নাম';

  @override
  String posBillingPoints(String points) {
    return '$points পয়েন্ট';
  }

  @override
  String get posBillingRedeem => 'পয়েন্ট ব্যবহার করুন';

  @override
  String posBillingRedeemable(String points, String value) {
    return '$points পয়েন্ট পর্যন্ত (₹$value)';
  }

  @override
  String get posBillingPayments => 'প্রদান';

  @override
  String get posBillingModesCash => 'নগদ';

  @override
  String get posBillingModesUpi => 'UPI';

  @override
  String get posBillingModesCard => 'কার্ড';

  @override
  String get posBillingModesCredit => 'ধারে';

  @override
  String get posBillingReference => 'রেফারেন্স';

  @override
  String get posBillingAddPayment => 'ভাগ করে প্রদান';

  @override
  String get posBillingPay => 'বিল সম্পূর্ণ করুন';

  @override
  String get posBillingTotal => 'মোট';

  @override
  String get posBillingChange => 'ফেরত দিতে হবে';

  @override
  String get posBillingDue => 'এখনো বাকি';

  @override
  String get posBillingTaxable => 'করযোগ্য';

  @override
  String get posBillingTax => 'জিএসটি';

  @override
  String get posBillingRoundOff => 'রাউন্ড অফ';

  @override
  String posBillingDone(String number) {
    return 'বিল $number সংরক্ষিত';
  }

  @override
  String get posBillingPrint => 'রসিদ প্রিন্ট';

  @override
  String get posBillingNewBill => 'নতুন বিল';

  @override
  String get posBillingShiftTotals => 'এই শিফট';

  @override
  String get posBillingBills => 'বিল';

  @override
  String get posBillingDeviceTerminal =>
      'এই কাউন্টার নিজের ডিভাইস থেকে বিল করে (অফলাইন অ্যাপ)।';

  @override
  String get posBillsTitle => 'পিওএস বিল';

  @override
  String get posBillsSubtitle => 'একদিনের সব কাউন্টারের বিল।';

  @override
  String get posBillsDate => 'তারিখ';

  @override
  String get posBillsNumber => 'বিল নং';

  @override
  String get posBillsTime => 'সময়';

  @override
  String get posBillsMode => 'প্রদানের পদ্ধতি';

  @override
  String get posBillsVoid => 'বাতিল করুন';

  @override
  String get posBillsVoided => 'বাতিল';

  @override
  String get posBillsReason => 'কারণ';

  @override
  String get posBillsSummary => 'দিনের সারাংশ';

  @override
  String get posBillsTopItems => 'সবচেয়ে বেশি বিক্রি';

  @override
  String get posBillsMismatch => 'ডিভাইসের মোট আলাদা ছিল';

  @override
  String get posBillsNone => 'এই দিনে কোনো বিল নেই।';

  @override
  String get posSettingsTitle => 'কাউন্টার সেটিং';

  @override
  String get posSettingsSubtitle =>
      'দাম, লয়্যালটি পয়েন্ট, ছাড়ের সীমা ও কাউন্টার।';

  @override
  String get posSettingsPricesIncludeTax => 'দামে জিএসটি অন্তর্ভুক্ত';

  @override
  String get posSettingsLoyalty => 'লয়্যালটি পয়েন্ট';

  @override
  String get posSettingsLoyaltyEnabled => 'লয়্যালটি পয়েন্ট দিন';

  @override
  String get posSettingsPointsPer100 => 'প্রতি ₹100-এ পয়েন্ট';

  @override
  String get posSettingsPointValue => 'এক পয়েন্টের মূল্য (₹)';

  @override
  String get posSettingsMaxRedeem =>
      'পয়েন্টে দেওয়া যায় বিলের সর্বোচ্চ অংশ (%)';

  @override
  String get posSettingsFooter => 'রসিদের নিচের লেখা';

  @override
  String get posSettingsTerminals => 'কাউন্টার';

  @override
  String get posSettingsTerminalName => 'কাউন্টারের নাম';

  @override
  String get posSettingsWarehouse => 'থেকে বিক্রি';

  @override
  String get posSettingsDevice => 'অফলাইন ডিভাইস';

  @override
  String get posSettingsNoDevice => 'কোনোটি নয় (ওয়েব বিলিং)';

  @override
  String get posSettingsAddTerminal => 'কাউন্টার যোগ করুন';

  @override
  String get posSettingsSave => 'সংরক্ষণ করুন';

  @override
  String get posReceiptTaxInvoice => 'কর ইনভয়েস';

  @override
  String get posReceiptBillOfSupply => 'নগদ মেমো';

  @override
  String get posReceiptThanks => 'ধন্যবাদ! আবার আসবেন।';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'অর্জিত পয়েন্ট: $points · বাকি $balance';
  }

  @override
  String get posErrorsSessionNotOpen => 'আগে এই কাউন্টারে শিফট শুরু করুন।';

  @override
  String get posErrorsSessionAlreadyOpen => 'এই কাউন্টারে শিফট আগে থেকেই চলছে।';

  @override
  String get posErrorsSessionClosed => 'সেই শিফট বন্ধ।';

  @override
  String get posErrorsDeviceTerminal =>
      'এই কাউন্টার নিজের ডিভাইস থেকে বিল করে।';

  @override
  String get posErrorsTerminalOnOtherDevice => 'এই কাউন্টার অন্য ডিভাইসের।';

  @override
  String get posErrorsTooManyPoints =>
      'এই বিলে যত পয়েন্ট ব্যবহার করা যায় তার চেয়ে বেশি।';

  @override
  String get posErrorsLoyaltyNotAvailable => 'আগে গ্রাহকের মোবাইল নম্বর দিন।';

  @override
  String get posErrorsOverpaidNonCash =>
      'UPI ও কার্ড বাকি অঙ্কের বেশি হতে পারে না।';

  @override
  String get posErrorsUnderpaid => 'বিল পুরো মেটানো হয়নি।';

  @override
  String get posErrorsInvalidPayment => 'প্রদানের অঙ্ক দিন।';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'ধারে বিক্রির জন্য গ্রাহক বেছে নিন।';

  @override
  String get posErrorsDiscountExceedsAmount => 'ছাড় বিলের চেয়ে বেশি।';

  @override
  String get posErrorsVoidSameDayOnly => 'শুধু আজকের বিল বাতিল করা যায়।';

  @override
  String get posErrorsOrderNotOpen => 'সেই অর্ডার বন্ধ।';

  @override
  String get posErrorsBillNumberTaken => 'সেই বিল নম্বর আগেই ব্যবহৃত।';

  @override
  String get posErrorsInvalidPhone => '10 অঙ্কের মোবাইল নম্বর দিন।';

  @override
  String get posErrorsNoLines => 'অন্তত একটি পণ্য যোগ করুন।';

  @override
  String get posDeviceNoTerminal =>
      'এই ডিভাইসে কোনো বিলিং কাউন্টার নেই। ওয়েবে পিওএস সেটিংস খুলে এই ডিভাইসে একটি কাউন্টার যুক্ত করুন, তারপর সিঙ্ক করুন।';

  @override
  String get posDeviceTodayBills => 'এই ডিভাইসে আজকের বিল';

  @override
  String get posDeviceWaiting => 'আপলোডের অপেক্ষায়';

  @override
  String get posDeviceUploaded => 'আপলোড হয়েছে';

  @override
  String posDeviceFailed(String error) {
    return 'গৃহীত হয়নি: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'সার্ভারের মোট $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'বিলের নম্বর এই ডিভাইসে হয় এবং অনলাইনে এলে আপলোড হয়।';

  @override
  String get posDeviceNoFiscalYear =>
      'আজকের তারিখ কোনো আর্থিক বছরে নেই। আগে ক্লাউডের সঙ্গে সিঙ্ক করুন।';

  @override
  String get posPromoReferredBy => 'কে পাঠিয়েছেন (মোবাইল)';

  @override
  String posPromoReferredHint(String points) {
    return 'তিনি $points পয়েন্ট পাবেন';
  }

  @override
  String get posPromoCoupon => 'কুপন কোড';

  @override
  String posPromoCouponOk(String off) {
    return '$off ছাড়';
  }

  @override
  String get posPromoCard => 'ডিসকাউন্ট কার্ড';

  @override
  String get posPromoCardOff => 'ডিসকাউন্ট কার্ড';

  @override
  String posPromoCouponOff(String code) {
    return 'কুপন $code';
  }

  @override
  String posPromoVoucher(String code) {
    return 'গিফট ভাউচার $code';
  }

  @override
  String get posPromoToPay => 'দিতে হবে';

  @override
  String get posPromoVoucherCode => 'গিফট ভাউচার কোড';

  @override
  String get posPromoUseVoucher => 'ভাউচার ব্যবহার করুন';

  @override
  String get posPromoReferralPoints => 'রেফারেল পয়েন্ট';

  @override
  String get posPromoReferralPointsHint =>
      'যে সদস্যের পাঠানো গ্রাহক যোগ দিয়ে কেনেন (0 = বন্ধ)';

  @override
  String get posPromoErrorsCouponNotFound => 'এমন কুপন নেই, বা বন্ধ।';

  @override
  String get posPromoErrorsCouponNotValidToday => 'এই কুপন আজ বৈধ নয়।';

  @override
  String get posPromoErrorsCouponUsedUp => 'এই কুপন পুরো ব্যবহৃত।';

  @override
  String get posPromoErrorsCouponMinBill => 'বিল এই কুপনের ন্যূনতমের চেয়ে কম।';

  @override
  String get posPromoErrorsCardNotFound => 'এমন ডিসকাউন্ট কার্ড নেই, বা বন্ধ।';

  @override
  String get posPromoErrorsCardExpired => 'এই ডিসকাউন্ট কার্ডের মেয়াদ শেষ।';

  @override
  String get posPromoErrorsVoucherNotFound => 'ওই কোডের কোনো গিফট ভাউচার নেই।';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'এই গিফট ভাউচার পুরো ব্যবহৃত বা মেয়াদোত্তীর্ণ।';

  @override
  String get posPromoErrorsVoucherBalanceLow => 'ভাউচারে এত টাকা বাকি নেই।';

  @override
  String get posPromoErrorsVoucherMoreThanBill =>
      'ভাউচারের টাকা বিলের চেয়ে বেশি।';

  @override
  String get posPromoErrorsVoucherTwice => 'একই ভাউচার দুবার দেওয়া হয়েছে।';

  @override
  String get posPromoErrorsOnlineOnly =>
      'কুপন, কার্ড ও গিফট ভাউচারের জন্য অনলাইন কাউন্টার দরকার।';

  @override
  String get posCounterControls => 'কাউন্টার নিয়ন্ত্রণ';

  @override
  String get posCounterAllowRateChange => 'ক্যাশিয়ার দর বদলাতে পারেন';

  @override
  String get posCounterRequireSalesman => 'প্রতি লাইনে সেলসম্যান লাগবে';

  @override
  String get posCounterMaxLineDiscount => 'সর্বোচ্চ লাইন ছাড়, %';

  @override
  String get posCounterMaxBillDiscount => 'সর্বোচ্চ বিল ছাড়, %';

  @override
  String get posCounterLimitHint =>
      'ফাঁকা: সীমা নেই। বেশি হলে অনুমোদকের কারণ লাগবে।';

  @override
  String get posCounterSalesman => 'সেলসম্যান';

  @override
  String get posCounterNoSalesman => 'সেলসম্যান নেই';

  @override
  String get posCounterBillSalesman => 'বিলের সেলসম্যান';

  @override
  String get posCounterRate => 'দর';

  @override
  String get posCounterRateLocked => 'দর লক করা';

  @override
  String get posCounterDisc => 'ছাড় ₹';

  @override
  String get posCounterLineDiscount => 'লাইন ছাড় টাকায়';

  @override
  String posCounterVisits(String n) {
    return 'আসা: $n বার';
  }

  @override
  String posCounterSpent(String v) {
    return 'খরচ $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'ফেরত $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'শেষবার $date';
  }

  @override
  String get posCounterBuys => 'সাধারণত কেনেন';

  @override
  String get posCounterNewCustomer => 'নতুন গ্রাহক: এই বিলে যোগ দেবেন।';

  @override
  String get posCounterApprovalReason => 'অনুমোদনের কারণ';

  @override
  String get posCounterBrokenRate => 'দর বদলানো';

  @override
  String get posCounterBrokenLineDiscount => 'লাইন ছাড় সীমার বেশি';

  @override
  String get posCounterBrokenBillDiscount => 'বিল ছাড় সীমার বেশি';

  @override
  String get posCounterNeedsApprover => 'ম্যানেজারের অনুমোদন লাগবে';

  @override
  String get posCounterHold => 'বিল আটকে রাখুন';

  @override
  String posCounterHeldBills(String n) {
    return 'আটকানো বিল ($n)';
  }

  @override
  String get posCounterHoldLabel => 'কার জন্য? (ঐচ্ছিক)';

  @override
  String get posCounterHoldNow => 'রাখুন';

  @override
  String get posCounterUnnamed => 'গ্রাহক';

  @override
  String posCounterPieces(String n) {
    return 'পিস: $n';
  }

  @override
  String get posCounterResume => 'এটির বিল করুন';

  @override
  String get posCounterNoneHeld => 'কোনো আটকানো বিল নেই।';

  @override
  String get posCounterHoldFirst =>
      'অন্যটি নেওয়ার আগে চলতি বিল রাখুন বা শেষ করুন।';

  @override
  String get posCounterSizeStock => 'এখানে সাইজ অনুযায়ী স্টক';

  @override
  String get posCounterAddSize => 'এই রং ও সাইজ যোগ করুন';

  @override
  String get posCounterKeysSearch => 'স্ক্যান বা খোঁজ';

  @override
  String get posCounterKeysHold => 'বিল রাখুন';

  @override
  String get posCounterKeysHeld => 'আটকানো বিল';

  @override
  String get posCounterKeysCustomer => 'গ্রাহক';

  @override
  String get posCounterKeysDiscount => 'ছাড়';

  @override
  String get posCounterKeysCash => 'পুরো নগদ';

  @override
  String get posCounterKeysUpi => 'পুরো UPI';

  @override
  String get posCounterKeysCard => 'পুরো কার্ড';

  @override
  String get posCounterKeysPay => 'বিল শেষ';

  @override
  String get posCounterKeysExchange => 'ফেরত বা বদল';

  @override
  String get posCounterErrorsRateLocked =>
      'দর লক করা। ম্যানেজার কারণ দিয়ে অনুমতি দিতে পারেন।';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'লাইন ছাড় সীমার বেশি। ম্যানেজার কারণ দিয়ে অনুমতি দিতে পারেন।';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'বিল ছাড় সীমার বেশি। ম্যানেজার কারণ দিয়ে অনুমতি দিতে পারেন।';

  @override
  String get posCounterErrorsSalesmanRequired =>
      'প্রতিটি লাইনের সেলসম্যান বাছুন।';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'সেই সেলসম্যান কর্মী তালিকায় নেই।';

  @override
  String get posCounterErrorsHeldBillGone =>
      'সেই আটকানো বিল আগেই নেওয়া হয়েছে।';

  @override
  String get posCounterAutoSendBill =>
      'গ্রাহক মোবাইল দিলে বিল নিজে থেকেই হোয়াটসঅ্যাপে পাঠান';

  @override
  String get posCounterBrowse => 'আইটেম দেখুন';

  @override
  String get posCounterItem => 'আইটেম';

  @override
  String posCounterPiecesInBill(String n) {
    return 'বিলে $n পিস';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'দরে মোট $v';
  }

  @override
  String get posCounterOffers => 'ছাড় ও অফার';

  @override
  String get posCounterBreakdown => 'বিলের বিবরণ';

  @override
  String get posCounterInclGst => 'GST সহ';

  @override
  String get posCounterBillItems => 'বিলের আইটেম';

  @override
  String get posCounterScanToStart =>
      'বিল শুরু করতে বারকোড স্ক্যান করুন বা খুঁজুন। হোল্ড বিল নিতে F4 চাপুন।';

  @override
  String get bankingAccountsTitle => 'ব্যাংক';

  @override
  String get bankingAccountsSubtitle =>
      'আপনার ব্যাংক স্টেটমেন্ট হিসাবের সঙ্গে মেলান।';

  @override
  String get bankingAccountsBookBalance => 'হিসাব অনুযায়ী';

  @override
  String get bankingAccountsStatementBalance => 'ব্যাংক অনুযায়ী';

  @override
  String bankingAccountsAsOf(String date) {
    return '$date তারিখে';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'মেলানোর $countটি লাইন',
      one: 'মেলানোর $countটি লাইন',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'সব মিলেছে';

  @override
  String get bankingAccountsNone =>
      'এখনো কোনো ব্যাংক অ্যাকাউন্ট নেই। খাতার তালিকায় Bank Accounts-এর অধীনে খাতা যোগ করুন।';

  @override
  String get bankingAccountsReconcile => 'মেলান';

  @override
  String get bankingAccountsNoStatement => 'এখনো স্টেটমেন্ট নেই';

  @override
  String get bankingProfileTitle => 'ব্যাংকের তথ্য';

  @override
  String get bankingProfileBankName => 'ব্যাংক';

  @override
  String get bankingProfileLast4 => 'অ্যাকাউন্ট (শেষ 4 অঙ্ক)';

  @override
  String get bankingProfileIfsc => 'IFSC';

  @override
  String get bankingProfileSave => 'সংরক্ষণ করুন';

  @override
  String get bankingImportTitle => 'স্টেটমেন্ট আমদানি';

  @override
  String get bankingImportHint =>
      'নেট ব্যাংকিং থেকে স্টেটমেন্ট CSV-তে ডাউনলোড করুন (Excel থেকে: Save As → CSV)। কলাম শিরোনাম দেখে চেনা হয়, তাই বেশিরভাগ ভারতীয় ব্যাংক চলে।';

  @override
  String get bankingImportFile => 'স্টেটমেন্ট ফাইল (CSV)';

  @override
  String get bankingImportButton => 'আমদানি করুন';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$addedটি লাইন যোগ হয়েছে, $duplicatesটি আগে থেকেই ছিল, $matchedটি নিজে থেকেই মিলেছে।';
  }

  @override
  String get bankingFeedTitle => 'ব্যাংক ফিড';

  @override
  String get bankingFeedHint =>
      'আপনি সম্মতি দিলে লেনদেন RBI অ্যাকাউন্ট অ্যাগ্রিগেটর ব্যবস্থার মাধ্যমে আসে। প্রদানকারী যুক্ত না হওয়া পর্যন্ত সিমুলেটর কাজ করে।';

  @override
  String get bankingFeedConnect => 'যুক্ত করুন';

  @override
  String get bankingFeedFetch => 'এখন আনুন';

  @override
  String get bankingFeedDisconnect => 'সংযোগ বিচ্ছিন্ন করুন';

  @override
  String get bankingFeedStatusesActive => 'যুক্ত';

  @override
  String get bankingFeedStatusesPending => 'সম্মতির অপেক্ষায়';

  @override
  String get bankingFeedStatusesRevoked => 'বিচ্ছিন্ন';

  @override
  String bankingFeedFetched(String date) {
    return '$date পর্যন্ত আনা হয়েছে';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$addedটি নতুন লেনদেন, $matchedটি মিলেছে।';
  }

  @override
  String get bankingTabsOpen => 'মেলাতে হবে';

  @override
  String get bankingTabsMatched => 'মিলেছে';

  @override
  String get bankingTabsIgnored => 'উপেক্ষিত';

  @override
  String get bankingTabsBrs => 'মিলন বিবরণী';

  @override
  String get bankingLinesDate => 'তারিখ';

  @override
  String get bankingLinesDescription => 'বিবরণ';

  @override
  String get bankingLinesWithdrawal => 'উত্তোলন';

  @override
  String get bankingLinesDeposit => 'জমা';

  @override
  String get bankingLinesBalance => 'ব্যালান্স';

  @override
  String get bankingLinesSuggestion => 'মনে হচ্ছে';

  @override
  String get bankingLinesAccept => 'মেলান';

  @override
  String get bankingLinesCreate => 'এন্ট্রি করুন';

  @override
  String get bankingLinesIgnore => 'উপেক্ষা করুন';

  @override
  String get bankingLinesByHand => 'এন্ট্রি খুঁজুন';

  @override
  String get bankingLinesUnmatch => 'মিল সরান';

  @override
  String get bankingLinesRestore => 'ফিরিয়ে আনুন';

  @override
  String get bankingLinesAccount => 'এই খাতায় পোস্ট করুন';

  @override
  String get bankingLinesNarration => 'বিবরণ';

  @override
  String bankingLinesRule(String account) {
    return 'নিয়ম: $account';
  }

  @override
  String get bankingLinesApplyRules => 'নিয়ম অনুযায়ী সব পোস্ট করুন';

  @override
  String bankingLinesRulesDone(String count) {
    return '$countটি এন্ট্রি পোস্ট হয়েছে।';
  }

  @override
  String get bankingLinesNone => 'এখানে কিছু নেই।';

  @override
  String bankingLinesEntries(String from, String to) {
    return '$from থেকে $to পর্যন্ত না মেলা এন্ট্রি';
  }

  @override
  String get bankingLinesMatchSelected => 'বাছাই করা মেলান';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return '$amount-এর মধ্যে $total বাছাই';
  }

  @override
  String get bankingLinesReasonsAmount => 'একই অঙ্ক';

  @override
  String get bankingLinesReasonsSameDay => 'একই দিন';

  @override
  String get bankingLinesReasonsReference => 'একই রেফারেন্স';

  @override
  String get bankingLinesReasonsParty => 'পক্ষের নাম';

  @override
  String get bankingBrsAsOf => 'এই তারিখে';

  @override
  String get bankingBrsPerBooks => 'হিসাব অনুযায়ী ব্যালান্স';

  @override
  String get bankingBrsNotPresented =>
      'যোগ: দেওয়া কিন্তু এখনো জমা না পড়া চেক';

  @override
  String get bankingBrsNotCredited => 'বাদ: ব্যাংক এখনো জমা করেনি এমন জমা';

  @override
  String get bankingBrsBankDebits => 'বাদ: হিসাবে নেই এমন ব্যাংক ডেবিট';

  @override
  String get bankingBrsBankCredits => 'যোগ: হিসাবে নেই এমন ব্যাংক ক্রেডিট';

  @override
  String get bankingBrsPerBank => 'ব্যাংক অনুযায়ী ব্যালান্স';

  @override
  String bankingBrsStatement(String date) {
    return '$date-এ স্টেটমেন্ট ব্যালান্স';
  }

  @override
  String get bankingBrsDifference => 'পার্থক্য';

  @override
  String get bankingBrsBalanced => 'মিলেছে';

  @override
  String get bankingRulesTitle => 'ব্যাংক নিয়ম';

  @override
  String get bankingRulesSubtitle =>
      'এই শব্দগুলো থাকা স্টেটমেন্ট লাইন এক ক্লিকে খাতায় পোস্ট হয় (ব্যাংক চার্জ, সুদ, স্থায়ী নির্দেশ)।';

  @override
  String get bankingRulesContains => 'বিবরণে আছে';

  @override
  String get bankingRulesDirection => 'টাকা';

  @override
  String get bankingRulesDirectionsIn => 'এসেছে';

  @override
  String get bankingRulesDirectionsOut => 'গেছে';

  @override
  String get bankingRulesDirectionsAny => 'এসেছে বা গেছে';

  @override
  String get bankingRulesAccount => 'এখানে পোস্ট করুন';

  @override
  String get bankingRulesNarration => 'বিবরণ';

  @override
  String get bankingRulesPriority => 'অগ্রাধিকার';

  @override
  String get bankingRulesAdd => 'নিয়ম যোগ করুন';

  @override
  String get bankingRulesSave => 'সংরক্ষণ করুন';

  @override
  String get bankingSettlementsTitle => 'গেটওয়ে সেটলমেন্ট';

  @override
  String get bankingSettlementsSubtitle =>
      'Razorpay, PhonePe, Paytm ইত্যাদির প্রদান: সংগ্রহ বাদ ফেরত, ফি ও ফি-র উপর জিএসটি, ব্যাংকে একটি জমা হিসেবে।';

  @override
  String get bankingSettlementsProvider => 'গেটওয়ে';

  @override
  String get bankingSettlementsBank => 'যেখানে জমা';

  @override
  String get bankingSettlementsClearing => 'সংগ্রহ এখানে লেখা হয়েছিল';

  @override
  String get bankingSettlementsFile => 'সেটলমেন্ট রিপোর্ট (CSV)';

  @override
  String get bankingSettlementsImport => 'আমদানি করুন';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$postedটি প্রদান পোস্ট হয়েছে, $skippedটি আগেই হয়েছিল, $matchedটি ব্যাংকের সঙ্গে মিলেছে।';
  }

  @override
  String get bankingSettlementsSettlementId => 'সেটলমেন্ট';

  @override
  String get bankingSettlementsSettledOn => 'সেটলের তারিখ';

  @override
  String get bankingSettlementsPayments => 'প্রদান';

  @override
  String get bankingSettlementsGross => 'সংগৃহীত';

  @override
  String get bankingSettlementsRefunds => 'ফেরত';

  @override
  String get bankingSettlementsFees => 'ফি';

  @override
  String get bankingSettlementsTax => 'ফি-র উপর জিএসটি';

  @override
  String get bankingSettlementsNet => 'প্রদত্ত';

  @override
  String get bankingSettlementsMatched => 'ব্যাংকে';

  @override
  String get bankingSettlementsNone => 'এখনো কোনো সেটলমেন্ট নেই।';

  @override
  String get bankingErrorsNoHeader =>
      'শিরোনামের সারি পাওয়া যায়নি। কলাম শিরোনাম সহ স্টেটমেন্ট CSV হিসেবে সংরক্ষণ করুন।';

  @override
  String get bankingErrorsNoRows => 'ফাইলে কোনো লেনদেন পাওয়া যায়নি।';

  @override
  String get bankingErrorsBadAmount => 'ফাইলের একটি অঙ্ক পড়া যায়নি।';

  @override
  String get bankingErrorsUnknownFormat =>
      'এটি সেটলমেন্ট রিপোর্ট মনে হচ্ছে না (settlement id, amount ও fee কলাম লাগে)।';

  @override
  String get bankingErrorsInvalidFile => 'ফাইল পড়া যায়নি।';

  @override
  String get bankingErrorsNotABankAccount =>
      'Bank Accounts-এর অধীনের খাতা বেছে নিন।';

  @override
  String get bankingErrorsFeedNotConnected => 'আগে ব্যাংক ফিড যুক্ত করুন।';

  @override
  String get bankingErrorsLineAlreadyMatched => 'সেই লাইন আগেই মিলেছে।';

  @override
  String get bankingErrorsVoucherNotOpen => 'সেই এন্ট্রি আগেই মিলেছে বা বাতিল।';

  @override
  String get bankingErrorsWrongDirection =>
      'আসা টাকা শুধু প্রাপ্তির সঙ্গে, যাওয়া টাকা শুধু প্রদানের সঙ্গে মেলে।';

  @override
  String get bankingErrorsAmountsDiffer =>
      'এন্ট্রিগুলোর যোগফল লাইনের অঙ্কের সমান নয়।';

  @override
  String get bankingErrorsSameAccount => 'অন্য খাতা বেছে নিন।';

  @override
  String get bankingErrorsInvalidIfsc => 'বৈধ IFSC দিন।';

  @override
  String get assetsRegisterTitle => 'স্থায়ী সম্পদ';

  @override
  String get assetsRegisterSubtitle =>
      'রেজিস্টার, কোম্পানি আইন অনুযায়ী অবচয় ও আয়কর ব্লক তালিকা।';

  @override
  String get assetsRegisterNew => 'সম্পদ যোগ করুন';

  @override
  String get assetsRegisterCode => 'কোড';

  @override
  String get assetsRegisterName => 'সম্পদ';

  @override
  String get assetsRegisterClass => 'শ্রেণি';

  @override
  String get assetsRegisterPurchased => 'কেনা';

  @override
  String get assetsRegisterPutToUse => 'থেকে ব্যবহারে';

  @override
  String get assetsRegisterCost => 'দাম';

  @override
  String get assetsRegisterAccumulated => 'আজ পর্যন্ত অবচয়';

  @override
  String get assetsRegisterBookValue => 'বই মূল্য';

  @override
  String get assetsRegisterStatus => 'অবস্থা';

  @override
  String get assetsRegisterStatusesActive => 'ব্যবহারে';

  @override
  String get assetsRegisterStatusesDisposed => 'বিক্রি / বাতিল';

  @override
  String get assetsRegisterLocation => 'স্থান';

  @override
  String get assetsRegisterSerialNo => 'ক্রমিক নং';

  @override
  String get assetsRegisterCustodian => 'যাঁর কাছে';

  @override
  String get assetsRegisterNone => 'এখনো কোনো সম্পদ নেই।';

  @override
  String get assetsClassesTitle => 'সম্পদের শ্রেণি';

  @override
  String get assetsClassesPresets => 'প্রমিত শ্রেণি যোগ করুন';

  @override
  String get assetsClassesPreset => 'শ্রেণি';

  @override
  String get assetsClassesAdd => 'যোগ করুন';

  @override
  String get assetsClassesCustom => 'অথবা নিজে তৈরি করুন';

  @override
  String get assetsClassesName => 'নাম';

  @override
  String get assetsClassesMethod => 'পদ্ধতি';

  @override
  String get assetsClassesMethodsSlm => 'সরলরেখা';

  @override
  String get assetsClassesMethodsWdv => 'ক্রমহ্রাসমান মূল্য (WDV)';

  @override
  String get assetsClassesLife => 'ব্যবহারযোগ্য আয়ু (বছর)';

  @override
  String get assetsClassesResidual => 'অবশিষ্ট মূল্য %';

  @override
  String get assetsClassesItBlock => 'আয়কর ব্লক';

  @override
  String get assetsClassesItRate => 'করের হার %';

  @override
  String get assetsClassesBlocksBuilding => 'ভবন';

  @override
  String get assetsClassesBlocksPlantMachinery => 'প্ল্যান্ট ও যন্ত্রপাতি';

  @override
  String get assetsClassesBlocksFurniture => 'আসবাব ও ফিটিংস';

  @override
  String get assetsClassesBlocksComputers => 'কম্পিউটার ও সফটওয়্যার';

  @override
  String get assetsClassesBlocksIntangibles => 'অস্পৃশ্য সম্পদ';

  @override
  String get assetsFormAcquisition => 'কীভাবে এসেছে';

  @override
  String get assetsFormAcquisitionsSupplier => 'ধারে কেনা';

  @override
  String get assetsFormAcquisitionsPaid => 'নগদ বা ব্যাংক থেকে দেওয়া';

  @override
  String get assetsFormAcquisitionsOpening => 'আগে থেকেই হিসাবে (জের)';

  @override
  String get assetsFormSupplier => 'সরবরাহকারী';

  @override
  String get assetsFormPaidFrom => 'থেকে দেওয়া';

  @override
  String get assetsFormGstRate => 'জিএসটি হার % (ইনপুট ক্রেডিট নেওয়া)';

  @override
  String get assetsFormSupplierGstin => 'সরবরাহকারীর জিএসটিআইএন';

  @override
  String get assetsFormInvoiceRef => 'বিল নং';

  @override
  String get assetsFormOpeningAccumulated => 'আগে নেওয়া অবচয়';

  @override
  String get assetsFormNotes => 'নোট';

  @override
  String get assetsFormSave => 'সম্পদ যোগ করুন';

  @override
  String get assetsDetailHistory => 'নেওয়া অবচয়';

  @override
  String get assetsDetailPeriod => 'সময়কাল';

  @override
  String get assetsDetailDays => 'দিন';

  @override
  String get assetsDetailVoucher => 'এন্ট্রি';

  @override
  String get assetsDetailDispose => 'বিক্রি বা বাতিল করুন';

  @override
  String get assetsDetailDisposeDate => 'তারিখ';

  @override
  String get assetsDetailSaleValue => 'বিক্রয় মূল্য (₹, বাতিল হলে 0)';

  @override
  String get assetsDetailReceivedIn => 'যেখানে পাওয়া';

  @override
  String get assetsDetailSaleGst => 'বিক্রিতে জিএসটি %';

  @override
  String get assetsDetailBuyerState =>
      'ক্রেতার রাজ্য (আপনার রাজ্যের বাইরে হলে)';

  @override
  String get assetsDetailDisposeButton => 'বিক্রি লিখুন';

  @override
  String assetsDetailDisposed(String date, String value) {
    return '$date-এ $value-তে বিক্রি';
  }

  @override
  String get assetsDetailProfit => 'বিক্রিতে লাভ';

  @override
  String get assetsDetailLoss => 'বিক্রিতে ক্ষতি';

  @override
  String get assetsDetailPurchase => 'ক্রয় এন্ট্রি';

  @override
  String get assetsDepreciationTitle => 'অবচয়';

  @override
  String get assetsDepreciationSubtitle =>
      'মাস, ত্রৈমাসিক বা বছরের অবচয় নিন। প্রতিটি সম্পদ শেষবার যেখানে থেমেছিল সেখান থেকে চলে।';

  @override
  String get assetsDepreciationFrom => 'থেকে';

  @override
  String get assetsDepreciationTo => 'পর্যন্ত';

  @override
  String get assetsDepreciationPreview => 'হিসাব করুন';

  @override
  String get assetsDepreciationPost => 'অবচয় পোস্ট করুন';

  @override
  String get assetsDepreciationTotal => 'মোট';

  @override
  String get assetsDepreciationRuns => 'এন্ট্রি';

  @override
  String get assetsDepreciationNone => 'এই সময়ে নেওয়ার মতো কিছু নেই।';

  @override
  String get assetsDepreciationCancel => 'এন্ট্রি বাতিল';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি সম্পদ',
      one: '$countটি সম্পদ',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'আয়কর অবচয়';

  @override
  String get assetsItSubtitle =>
      'ব্লক অনুযায়ী, কর অডিট রিপোর্টের মতো (ফর্ম 3CD, ধারা 18)। 180 দিনের কম ব্যবহৃত সংযোজনে অর্ধেক হার।';

  @override
  String get assetsItFy => 'বছর';

  @override
  String get assetsItBlock => 'ব্লক';

  @override
  String get assetsItRate => 'হার';

  @override
  String get assetsItOpening => 'প্রারম্ভিক WDV';

  @override
  String get assetsItAddFull => 'সংযোজন (180 দিন বা বেশি)';

  @override
  String get assetsItAddHalf => 'সংযোজন (180 দিনের কম)';

  @override
  String get assetsItSales => 'বিক্রি';

  @override
  String get assetsItDepreciation => 'অবচয়';

  @override
  String get assetsItClosing => 'সমাপনী WDV';

  @override
  String get assetsItGain => 'স্বল্পমেয়াদি লাভ';

  @override
  String get assetsItLoss => 'স্বল্পমেয়াদি ক্ষতি';

  @override
  String get assetsItOpeningTitle => 'প্রারম্ভিক ক্রমহ্রাসমান মূল্য';

  @override
  String get assetsItOpeningHint =>
      'আপনার শেষ কর রিটার্ন থেকে প্রথম বছরের শুরুর প্রতিটি ব্লকের WDV দিন; পরের বছরগুলো নিজে থেকেই চলবে।';

  @override
  String get assetsItSave => 'সংরক্ষণ করুন';

  @override
  String get assetsItTotal => 'মোট';

  @override
  String get assetsItNone => 'এই বছরে কোনো সম্পদ নেই।';

  @override
  String get assetsErrorsClassExists => 'সেই শ্রেণি আগে থেকেই আছে।';

  @override
  String get assetsErrorsClassIncomplete => 'নাম, আয়ু ও কর ব্লক পূরণ করুন।';

  @override
  String get assetsErrorsUnknownPreset => 'শ্রেণি বেছে নিন।';

  @override
  String get assetsErrorsInvalidLife => 'ব্যবহারযোগ্য আয়ু বছরে দিন।';

  @override
  String get assetsErrorsInvalidResidual =>
      'ক্রমহ্রাসমান পদ্ধতিতে অবশিষ্ট মূল্য 0%-এর বেশি লাগবে।';

  @override
  String get assetsErrorsUnknownClass => 'শ্রেণি বেছে নিন।';

  @override
  String get assetsErrorsClassArchived => 'সেই শ্রেণি আর্কাইভ করা।';

  @override
  String get assetsErrorsInvalidCost => 'দাম দিন।';

  @override
  String get assetsErrorsUsedBeforeBought =>
      'কেনার আগে ব্যবহারে থাকতে পারে না।';

  @override
  String get assetsErrorsAccountRequired => 'খাতা বেছে নিন।';

  @override
  String get assetsErrorsNotASupplier => 'সরবরাহকারী বেছে নিন।';

  @override
  String get assetsErrorsNotCashOrBank => 'নগদ বা ব্যাংক খাতা বেছে নিন।';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'ইনপুট ক্রেডিট নিতে সরবরাহকারীর জিএসটিআইএন দিন।';

  @override
  String get assetsErrorsPeriodCrossesYear =>
      'সময়কাল একটি আর্থিক বছরের মধ্যে হতে হবে।';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'এই সময়ে নেওয়ার মতো কিছু নেই।';

  @override
  String get assetsErrorsLaterRunExists =>
      'পরের এন্ট্রিতে এই সম্পদের অবচয় আছে; আগে সেটি বাতিল করুন।';

  @override
  String get assetsErrorsAssetDisposed =>
      'এই এন্ট্রির একটি সম্পদ বিক্রি হয়ে গেছে।';

  @override
  String get assetsErrorsAlreadyDisposed => 'এই সম্পদ আগেই বিক্রি হয়েছে।';

  @override
  String get assetsErrorsSoldBeforeUse => 'বিক্রির তারিখ ব্যবহার শুরুর আগে।';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'বিক্রির তারিখের পরের অবচয় নেওয়া হয়েছে; আগে সেই এন্ট্রি বাতিল করুন।';

  @override
  String get assetsErrorsInvalidDepreciation => 'অবচয় হিসাব করা যায়নি।';

  @override
  String get assetsErrorsInvalidFy => 'বছর বেছে নিন।';

  @override
  String get expensesClaimsTitle => 'খরচের দাবি';

  @override
  String get expensesClaimsSubtitle =>
      'কর্মীরা খরচের দাবি করেন; অনুমোদনে তা হিসাবে ওঠে (যেখানে চলে সেখানে জিএসটি ক্রেডিট সহ) এবং প্রদানে নিষ্পত্তি হয়।';

  @override
  String get expensesClaimsNew => 'নতুন দাবি';

  @override
  String get expensesClaimsNumber => 'দাবি';

  @override
  String get expensesClaimsEmployee => 'কর্মচারী';

  @override
  String get expensesClaimsDate => 'তারিখ';

  @override
  String get expensesClaimsClaimTitle => 'উদ্দেশ্য';

  @override
  String get expensesClaimsTotal => 'অঙ্ক';

  @override
  String get expensesClaimsItc => 'জিএসটি ক্রেডিট';

  @override
  String get expensesClaimsStatus => 'অবস্থা';

  @override
  String get expensesClaimsStatusesDraft => 'খসড়া';

  @override
  String get expensesClaimsStatusesSubmitted => 'অনুমোদনের অপেক্ষায়';

  @override
  String get expensesClaimsStatusesApproved => 'অনুমোদিত';

  @override
  String get expensesClaimsStatusesRejected => 'প্রত্যাখ্যাত';

  @override
  String get expensesClaimsStatusesPaid => 'দেওয়া হয়েছে';

  @override
  String get expensesClaimsStatusesCancelled => 'বাতিল';

  @override
  String get expensesClaimsWaiting => 'অনুমোদনের অপেক্ষায়';

  @override
  String get expensesClaimsToPay => 'অনুমোদিত, দিতে হবে';

  @override
  String get expensesClaimsNone => 'এখনো কোনো দাবি নেই।';

  @override
  String get expensesClaimsAll => 'সব';

  @override
  String get expensesFormTitle => 'খরচের দাবি';

  @override
  String get expensesFormProject => 'প্রকল্প';

  @override
  String get expensesFormLines => 'খরচ';

  @override
  String get expensesFormCategory => 'ধরন';

  @override
  String get expensesFormDescription => 'বিবরণ';

  @override
  String get expensesFormAmount => 'অঙ্ক (₹)';

  @override
  String get expensesFormGstRate => 'জিএসটি %';

  @override
  String get expensesFormVendor => 'বিক্রেতা';

  @override
  String get expensesFormVendorGstin => 'বিক্রেতার জিএসটিআইএন';

  @override
  String get expensesFormInvoiceNo => 'বিল নং';

  @override
  String get expensesFormReceipt => 'রসিদ';

  @override
  String get expensesFormUpload => 'জুড়ুন';

  @override
  String get expensesFormRead => 'রসিদ পড়ুন';

  @override
  String get expensesFormReading => 'পড়া হচ্ছে…';

  @override
  String get expensesFormReadDone => 'রসিদ থেকে পূরণ হয়েছে। দেখে নিন।';

  @override
  String get expensesFormReadNone => 'এই রসিদ পড়া গেল না; নিজে তথ্য দিন।';

  @override
  String get expensesFormReadDemo =>
      'স্বয়ংক্রিয় পড়া চালু নেই; নিজে তথ্য দিন।';

  @override
  String get expensesFormAddLine => 'খরচ যোগ করুন';

  @override
  String get expensesFormSaveDraft => 'খসড়া সংরক্ষণ';

  @override
  String get expensesFormSubmit => 'অনুমোদনের জন্য পাঠান';

  @override
  String get expensesFormItcHint =>
      'বিল কোম্পানির নামে বিক্রেতার জিএসটিআইএন সহ কর ইনভয়েস হলে এবং ধরন অনুমতি দিলে জিএসটি ক্রেডিট নেওয়া হয়।';

  @override
  String get expensesDetailApprove => 'অনুমোদন';

  @override
  String get expensesDetailReject => 'প্রত্যাখ্যান';

  @override
  String get expensesDetailReason => 'কারণ';

  @override
  String get expensesDetailPay => 'দিন';

  @override
  String get expensesDetailPayFrom => 'থেকে দিন';

  @override
  String get expensesDetailPaidOn => 'প্রদানের তারিখ';

  @override
  String get expensesDetailEdit => 'সম্পাদনা';

  @override
  String get expensesDetailSubmit => 'পাঠান';

  @override
  String get expensesDetailCancel => 'দাবি বাতিল';

  @override
  String get expensesDetailVoucher => 'খরচের এন্ট্রি';

  @override
  String get expensesDetailPaymentVoucher => 'প্রদান';

  @override
  String expensesDetailRejected(String reason) {
    return 'প্রত্যাখ্যাত: $reason';
  }

  @override
  String get expensesDetailReceipt => 'রসিদ দেখুন';

  @override
  String get expensesCategoriesTitle => 'খরচের ধরন';

  @override
  String get expensesCategoriesSubtitle =>
      'কোন খরচ কোন খাতায় যায়, সীমা, এবং জিএসটি ক্রেডিট আটকানো কিনা (ধারা 17(5))।';

  @override
  String get expensesCategoriesName => 'ধরন';

  @override
  String get expensesCategoriesAccount => 'খাতা';

  @override
  String get expensesCategoriesBlocked => 'জিএসটি ক্রেডিট নেই';

  @override
  String get expensesCategoriesLimit => 'প্রতি দাবির সীমা (₹)';

  @override
  String get expensesCategoriesReceiptAbove => 'এর বেশি হলে রসিদ লাগবে (₹)';

  @override
  String get expensesCategoriesAdd => 'ধরন যোগ করুন';

  @override
  String get expensesCategoriesSave => 'সংরক্ষণ করুন';

  @override
  String get expensesErrorsNoLines => 'অন্তত একটি খরচ যোগ করুন।';

  @override
  String get expensesErrorsUnknownCategory => 'ধরন বেছে নিন।';

  @override
  String get expensesErrorsCategoryArchived => 'সেই ধরন আর্কাইভ করা।';

  @override
  String get expensesErrorsInvalidAmount => 'অঙ্ক দিন।';

  @override
  String get expensesErrorsReceiptRequired => 'এই খরচের রসিদ জুড়ুন।';

  @override
  String get expensesErrorsOverLimit => 'এটি ধরনের প্রতি দাবির সীমার বেশি।';

  @override
  String get expensesErrorsInvalidGstin => 'বিক্রেতার জিএসটিআইএন বৈধ নয়।';

  @override
  String get expensesErrorsUnknownEmployee => 'কর্মচারী বেছে নিন।';

  @override
  String get expensesErrorsUnknownProject => 'প্রকল্প বেছে নিন।';

  @override
  String get expensesErrorsClaimLocked =>
      'শুধু খসড়া বা প্রত্যাখ্যাত দাবি বদলানো যায়।';

  @override
  String get expensesErrorsClaimNotSubmitted =>
      'দাবিটি অনুমোদনের অপেক্ষায় নেই।';

  @override
  String get expensesErrorsClaimNotApproved => 'আগে দাবি অনুমোদন করুন।';

  @override
  String get expensesErrorsClaimPaid =>
      'দেওয়া দাবি বাতিল করা যায় না; আগে প্রদান বাতিল করুন।';

  @override
  String get expensesErrorsPaidBeforeClaim => 'প্রদানের তারিখ দাবির আগে।';

  @override
  String get expensesErrorsCategoryExists => 'সেই ধরন আগে থেকেই আছে।';

  @override
  String get expensesErrorsNotAnExpenseAccount => 'খরচের খাতা বেছে নিন।';

  @override
  String get expensesErrorsFileType => 'ছবি (JPG, PNG, WebP) বা PDF জুড়ুন।';

  @override
  String get expensesErrorsFileTooLarge => 'ফাইল 5 MB-এর বেশি।';

  @override
  String get expensesErrorsFileEmpty => 'ফাইল খালি।';

  @override
  String get projectsListTitle => 'প্রকল্প';

  @override
  String get projectsListSubtitle => 'প্রতিটি কাজের টাস্ক, সময়, খরচ ও বিলিং।';

  @override
  String get projectsListNew => 'নতুন প্রকল্প';

  @override
  String get projectsListCode => 'কোড';

  @override
  String get projectsListName => 'প্রকল্প';

  @override
  String get projectsListCustomer => 'গ্রাহক';

  @override
  String get projectsListBilling => 'বিলিং';

  @override
  String get projectsListBillingsFixed => 'নির্দিষ্ট দাম';

  @override
  String get projectsListBillingsTimeMaterial => 'সময় ও উপকরণ';

  @override
  String get projectsListBillingsNonBillable => 'অভ্যন্তরীণ';

  @override
  String get projectsListStatus => 'অবস্থা';

  @override
  String get projectsListStatusesActive => 'সক্রিয়';

  @override
  String get projectsListStatusesOnHold => 'স্থগিত';

  @override
  String get projectsListStatusesCompleted => 'সম্পূর্ণ';

  @override
  String get projectsListStatusesCancelled => 'বাতিল';

  @override
  String get projectsListRevenue => 'বিল হয়েছে';

  @override
  String get projectsListCost => 'খরচ';

  @override
  String get projectsListMargin => 'মার্জিন';

  @override
  String get projectsListHours => 'ঘণ্টা';

  @override
  String get projectsListNone => 'এখনো কোনো প্রকল্প নেই।';

  @override
  String get projectsFormContractValue => 'চুক্তির মূল্য (₹)';

  @override
  String get projectsFormBudgetCost => 'বাজেট খরচ (₹)';

  @override
  String get projectsFormBudgetHours => 'বাজেট ঘণ্টা';

  @override
  String get projectsFormBillRate => 'প্রতি ঘণ্টার বিল দর (₹)';

  @override
  String get projectsFormBillingItem => 'ইনভয়েসে (পরিষেবা পণ্য)';

  @override
  String get projectsFormStartOn => 'শুরু';

  @override
  String get projectsFormEndOn => 'শেষ';

  @override
  String get projectsFormNotes => 'নোট';

  @override
  String get projectsFormSave => 'প্রকল্প সংরক্ষণ';

  @override
  String get projectsDetailLabour => 'শ্রম';

  @override
  String get projectsDetailExpenses => 'খরচ';

  @override
  String get projectsDetailPurchases => 'কেনা';

  @override
  String get projectsDetailUnbilled => 'বিল না হওয়া সময়';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return 'বাজেটের $pct%';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return 'ঘণ্টার $pct%';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% মার্জিন';
  }

  @override
  String get projectsDetailTasks => 'টাস্ক';

  @override
  String get projectsDetailTask => 'টাস্ক';

  @override
  String get projectsDetailAssignee => 'দায়িত্বপ্রাপ্ত';

  @override
  String get projectsDetailEstimate => 'অনুমান (ঘণ্টা)';

  @override
  String get projectsDetailLogged => 'লেখা (ঘণ্টা)';

  @override
  String get projectsDetailDue => 'শেষ তারিখ';

  @override
  String get projectsDetailTaskStatusesTodo => 'করতে হবে';

  @override
  String get projectsDetailTaskStatusesDoing => 'চলছে';

  @override
  String get projectsDetailTaskStatusesDone => 'সম্পূর্ণ';

  @override
  String get projectsDetailAddTask => 'টাস্ক যোগ করুন';

  @override
  String get projectsDetailMembers => 'দল ও দর';

  @override
  String get projectsDetailMember => 'ব্যক্তি';

  @override
  String get projectsDetailMemberRate => 'বিল দর (₹/ঘণ্টা)';

  @override
  String get projectsDetailAddMember => 'যোগ করুন';

  @override
  String get projectsDetailMilestones => 'মাইলস্টোন';

  @override
  String get projectsDetailMilestone => 'মাইলস্টোন';

  @override
  String get projectsDetailAmount => 'অঙ্ক (₹)';

  @override
  String get projectsDetailAddMilestone => 'মাইলস্টোন যোগ করুন';

  @override
  String get projectsDetailBill => 'ইনভয়েস করুন';

  @override
  String projectsDetailBilled(String number) {
    return 'ইনভয়েস $number';
  }

  @override
  String get projectsDetailTime => 'সময়';

  @override
  String get projectsDetailBillTime => 'অনুমোদিত ঘণ্টার ইনভয়েস করুন';

  @override
  String get projectsDetailBillUpTo => 'পর্যন্ত';

  @override
  String get projectsDetailInvoices => 'ইনভয়েস';

  @override
  String get projectsDetailEdit => 'প্রকল্প সম্পাদনা';

  @override
  String get projectsDetailRemove => 'সরান';

  @override
  String projectsDetailInvoiced(String number) {
    return 'ইনভয়েস $number তৈরি হয়েছে।';
  }

  @override
  String get projectsTimeTitle => 'টাইমশিট';

  @override
  String get projectsTimeSubtitle =>
      'প্রকল্পে ঘণ্টা লিখুন; অনুমোদিত বিলযোগ্য ঘণ্টার ইনভয়েস করা যায়।';

  @override
  String get projectsTimeLog => 'সময় লিখুন';

  @override
  String get projectsTimeEmployee => 'কর্মচারী';

  @override
  String get projectsTimeProject => 'প্রকল্প';

  @override
  String get projectsTimeTask => 'টাস্ক';

  @override
  String get projectsTimeDate => 'তারিখ';

  @override
  String get projectsTimeHours => 'ঘণ্টা';

  @override
  String get projectsTimeBillable => 'বিলযোগ্য';

  @override
  String get projectsTimeNote => 'নোট';

  @override
  String get projectsTimeSave => 'লিখুন';

  @override
  String get projectsTimeApprove => 'অনুমোদন';

  @override
  String get projectsTimeReject => 'প্রত্যাখ্যান';

  @override
  String projectsTimeSelected(String count) {
    return '$countটি বাছাই';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'জমা দেওয়া';

  @override
  String get projectsTimeStatusesApproved => 'অনুমোদিত';

  @override
  String get projectsTimeStatusesRejected => 'প্রত্যাখ্যাত';

  @override
  String get projectsTimeStatusesBilled => 'ইনভয়েস হয়েছে';

  @override
  String get projectsTimeTotal => 'মোট';

  @override
  String get projectsTimeNone => 'কোনো সময় লেখা নেই।';

  @override
  String get projectsTimeCostRate => 'খরচ/ঘণ্টা';

  @override
  String get projectsTimeBillRate => 'বিল/ঘণ্টা';

  @override
  String get projectsTimeDelete => 'মুছুন';

  @override
  String get projectsErrorsNotACustomer => 'গ্রাহক বেছে নিন।';

  @override
  String get projectsErrorsUnknownItem => 'পরিষেবা পণ্য বেছে নিন।';

  @override
  String get projectsErrorsEndsBeforeStart => 'শেষের তারিখ শুরুর আগে।';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'আগে প্রকল্পের গ্রাহক ঠিক করুন।';

  @override
  String get projectsErrorsBillingItemRequired =>
      'প্রকল্পে ইনভয়েসের পণ্য বেছে নিন।';

  @override
  String get projectsErrorsMilestoneBilled =>
      'সেই মাইলস্টোনের ইনভয়েস আগেই হয়েছে।';

  @override
  String get projectsErrorsProjectNotActive => 'প্রকল্পটি সক্রিয় নয়।';

  @override
  String get projectsErrorsInvalidHours => '0 থেকে 24-এর মধ্যে ঘণ্টা দিন।';

  @override
  String get projectsErrorsTooManyHours => 'এক দিনে 24 ঘণ্টার বেশি।';

  @override
  String get projectsErrorsUnknownTask => 'এই প্রকল্পের টাস্ক বেছে নিন।';

  @override
  String get projectsErrorsTimesheetLocked =>
      'অনুমোদিত বা ইনভয়েস হওয়া সময় বদলানো যায় না।';

  @override
  String get projectsErrorsNothingToBill =>
      'ইনভয়েসের মতো কোনো অনুমোদিত বিলযোগ্য ঘণ্টা নেই।';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'শুধু সময়-ও-উপকরণ প্রকল্পে ঘণ্টা অনুযায়ী বিল হয়।';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'সেই তারিখে কর্মচারী চাকরিতে ছিলেন না।';

  @override
  String get projectsErrorsUnknownEmployee => 'কর্মচারী বেছে নিন।';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count জন গ্রাহকের',
      one: '$count জন গ্রাহকের',
    );
    return '$_temp0 পরিশোধ 60 দিনের বেশি দেরি: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$period-এর $form $days দিন দেরিতে';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$period-এর $form $days দিনের মধ্যে দাখিল করতে হবে';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি পণ্য',
      one: '$countটি পণ্য',
    );
    return '$_temp0 পুনরায় অর্ডার স্তরের নিচে';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$countটি ব্যাংক স্টেটমেন্ট লাইন এক সপ্তাহের বেশি মেলানোর অপেক্ষায়';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$countটি খরচের দাবি 3 দিনের বেশি অনুমোদনের অপেক্ষায়';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি ফলো-আপ দেরিতে',
      one: '$countটি ফলো-আপ দেরিতে',
    );
    return '$_temp0';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$name-এ ঋণাত্মক ব্যালান্স ($amount): কোনো এন্ট্রি বাদ পড়েছে বা ভুল';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    return '$countটি অনুমোদন মেমো ছয় মাসের ইনভয়েস সীমার কাছে';
  }

  @override
  String alertsApprovalsOut(num count) {
    return '$countটি অনুমোদন মেমোর মাল 30 দিনের বেশি বাইরে';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি সংবেদনশীল পরিবর্তন',
      one: '$countটি সংবেদনশীল পরিবর্তন',
    );
    return 'গত ৭ দিনে $_temp0 (ব্যাংক বিবরণ, ধারের শর্ত, কর সেটিং বা অধিকার)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$countটি কর্মী নথি',
      one: '$countটি কর্মী নথি',
    );
    return '$_temp0 মেয়াদ শেষ বা ৩০ দিনের মধ্যে শেষ হবে';
  }

  @override
  String get checksTitle => 'যাচাই';

  @override
  String get checksSubtitle =>
      'আপনার সিএ দেখার আগে আবার দেখার মতো এন্ট্রি: আয়কর আইনের নগদ সীমা, সম্ভাব্য ডুপ্লিকেট বিল, খরচের চেয়ে কম দামে বিক্রি, শূন্যের নিচে স্টক।';

  @override
  String get checksNone => 'অস্বাভাবিক কিছু পাওয়া যায়নি।';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return '$party-কে নগদ দেওয়া: এক দিনে $amount। এক ব্যক্তিকে এক দিনে ₹10,000-এর বেশি নগদ খরচ মেনে নেওয়া হয় না (ধারা 40A(3)); ব্যাংকে দিন।';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return '$party-এর কাছ থেকে নগদ পাওয়া: এক দিনে $amount। ₹2 লাখ বা বেশি নগদ নেওয়া নিষেধ (ধারা 269ST); জরিমানা সেই অঙ্কের সমান।';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplier এক সপ্তাহে দুবার $amount-এর বিল দিয়েছে ($first ও $second)। একটি কি ডুপ্লিকেট?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item $rate-এ বিক্রি, ক্রয় দর $cost-এর কম।';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item এখন $qty $uom: স্টকের চেয়ে বেশি বিক্রি বা দেওয়া হয়েছে।';
  }

  @override
  String get assistantTitle => 'সহকারী';

  @override
  String get assistantSubtitle =>
      'বিক্রি, পাওনা-দেনা, লাভ, স্টক বা জিএসটি নিয়ে জিজ্ঞাসা করুন। এটি আপনার হিসাব পড়ে; কখনো বদলায় না।';

  @override
  String get assistantPlaceholder => 'প্রশ্ন করুন…';

  @override
  String get assistantSend => 'জিজ্ঞাসা';

  @override
  String get assistantThinking => 'খোঁজা হচ্ছে…';

  @override
  String get assistantClear => 'নতুন কথোপকথন';

  @override
  String get assistantDemo =>
      'বিল্ট-ইন সহকারী: সাধারণ প্রশ্নের উত্তর দেয়। যেকোনো প্রশ্নের জন্য AI পরিষেবা যুক্ত করুন।';

  @override
  String get assistantClaude =>
      'আপনার হিসাব থেকে, আপনার অ্যাক্সেস অনুযায়ী Claude উত্তর দিয়েছে।';

  @override
  String get assistantSuggestionsS1 => 'কার কাছে আমাদের সবচেয়ে বেশি পাওনা?';

  @override
  String get assistantSuggestionsS2 => 'এই মাসে বিক্রি কেমন?';

  @override
  String get assistantSuggestionsS3 => 'এই মাসে আমাদের লাভ কত?';

  @override
  String get assistantSuggestionsS4 => 'কোন পণ্য পুনরায় অর্ডার স্তরের নিচে?';

  @override
  String get assistantSuggestionsS5 => 'আমার দেখা উচিত এমন কোনো এন্ট্রি আছে?';

  @override
  String assistantTools(String tools) {
    return 'দেখা হয়েছে: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'সহকারী ব্যস্ত; এক মিনিট পরে আবার চেষ্টা করুন।';

  @override
  String get assistantErrorsAssistantFailed => 'সহকারী এখন উত্তর দিতে পারল না।';

  @override
  String get assistantErrorsEmptyQuestion => 'একটি প্রশ্ন লিখুন।';

  @override
  String get crmLeadsTitle => 'লিড';

  @override
  String get crmLeadsSubtitle =>
      'প্রথম জিজ্ঞাসা থেকে অর্ডার পর্যন্ত সম্ভাব্য গ্রাহক।';

  @override
  String get crmLeadsNew => 'নতুন লিড';

  @override
  String get crmLeadsName => 'যোগাযোগের ব্যক্তি';

  @override
  String get crmLeadsOrganisation => 'ব্যবসা';

  @override
  String get crmLeadsPhone => 'মোবাইল';

  @override
  String get crmLeadsEmail => 'ইমেল';

  @override
  String get crmLeadsGstin => 'জিএসটিআইএন';

  @override
  String get crmLeadsState => 'রাজ্য';

  @override
  String get crmLeadsCity => 'শহর';

  @override
  String get crmLeadsSource => 'উৎস';

  @override
  String get crmLeadsSourcesWalkIn => 'সরাসরি এসেছেন';

  @override
  String get crmLeadsSourcesReferral => 'সুপারিশ';

  @override
  String get crmLeadsSourcesWebsite => 'ওয়েবসাইট';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'বাণিজ্য মেলা';

  @override
  String get crmLeadsSourcesOther => 'অন্যান্য';

  @override
  String get crmLeadsStage => 'পর্যায়';

  @override
  String get crmLeadsStagesNew => 'নতুন';

  @override
  String get crmLeadsStagesContacted => 'যোগাযোগ হয়েছে';

  @override
  String get crmLeadsStagesQualified => 'যোগ্য';

  @override
  String get crmLeadsStagesProposal => 'প্রস্তাব পাঠানো';

  @override
  String get crmLeadsStagesWon => 'পাওয়া গেছে';

  @override
  String get crmLeadsStagesLost => 'হাতছাড়া';

  @override
  String get crmLeadsValue => 'প্রত্যাশিত মূল্য (₹)';

  @override
  String get crmLeadsExpectedClose => 'প্রত্যাশিত সমাপ্তি';

  @override
  String get crmLeadsOwner => 'দায়িত্বপ্রাপ্ত';

  @override
  String get crmLeadsNotes => 'নোট';

  @override
  String get crmLeadsNextFollowUp => 'পরের ফলো-আপ';

  @override
  String get crmLeadsSave => 'সংরক্ষণ করুন';

  @override
  String get crmLeadsNone => 'এখনো কোনো লিড নেই।';

  @override
  String get crmLeadsSearch => 'নাম, ব্যবসা, মোবাইল বা শহর খুঁজুন';

  @override
  String crmLeadsWeighted(String amount) {
    return 'ওজনযুক্ত $amount';
  }

  @override
  String get crmLeadsConvert => 'পাওয়া গেছে: গ্রাহক বানান';

  @override
  String get crmLeadsLost => 'হাতছাড়া হিসেবে চিহ্নিত করুন';

  @override
  String get crmLeadsLostReason => 'কেন হাতছাড়া হল?';

  @override
  String get crmLeadsEdit => 'লিড সম্পাদনা';

  @override
  String get crmActivitiesTitle => 'ফলো-আপ';

  @override
  String get crmActivitiesSubtitle =>
      'কল, মিটিং ও কাজ, যেটি আগে দেয় সেটি আগে।';

  @override
  String get crmActivitiesAdd => 'যোগ করুন';

  @override
  String get crmActivitiesKind => 'ধরন';

  @override
  String get crmActivitiesKindsCall => 'কল';

  @override
  String get crmActivitiesKindsMeeting => 'মিটিং';

  @override
  String get crmActivitiesKindsTask => 'কাজ';

  @override
  String get crmActivitiesKindsNote => 'নোট';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'ইমেল';

  @override
  String get crmActivitiesSubject => 'কী করতে হবে বা কী হয়েছে';

  @override
  String get crmActivitiesDue => 'কখন';

  @override
  String get crmActivitiesDone => 'সম্পূর্ণ হিসেবে চিহ্নিত করুন';

  @override
  String get crmActivitiesReopen => 'অসম্পূর্ণ হিসেবে চিহ্নিত করুন';

  @override
  String get crmActivitiesNotes => 'নোট';

  @override
  String get crmActivitiesNone => 'এখানে কিছু নেই।';

  @override
  String get crmActivitiesOpen => 'খোলা';

  @override
  String get crmActivitiesAll => 'সব';

  @override
  String get crmActivitiesLate => 'দেরি';

  @override
  String get crmMessagesSend => 'WhatsApp পাঠান';

  @override
  String get crmMessagesTemplate => 'টেমপ্লেট';

  @override
  String crmMessagesSent(String to) {
    return '$to-কে পাঠানো হয়েছে।';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'পাঠানো যায়নি: $error';
  }

  @override
  String get crmMessagesDemo =>
      'ডেমো মোড: WhatsApp Business যুক্ত না হওয়া পর্যন্ত বার্তা লেখা থাকে কিন্তু পৌঁছায় না।';

  @override
  String get crmMessagesRemind => 'পরিশোধের অনুস্মারক পাঠান';

  @override
  String get crmTemplatesTitle => 'বার্তার টেমপ্লেট';

  @override
  String get crmTemplatesSubtitle =>
      'নাম, অঙ্ক ও তারিখের জন্য নম্বরযুক্ত ফাঁকা জায়গা সহ WhatsApp বার্তা। গ্রাহককে আগে বার্তা পাঠাতে টেমপ্লেট Meta-র অনুমোদিত হতে হবে; তার অনুমোদিত নাম দিন।';

  @override
  String get crmTemplatesName => 'নাম (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'লেখা';

  @override
  String get crmTemplatesCategory => 'বিভাগ';

  @override
  String get crmTemplatesCategoriesUtility => 'আপডেট (বিল, অনুস্মারক)';

  @override
  String get crmTemplatesCategoriesMarketing => 'মার্কেটিং';

  @override
  String get crmTemplatesProviderName => 'Meta-য় অনুমোদিত নাম';

  @override
  String get crmTemplatesAdd => 'টেমপ্লেট যোগ করুন';

  @override
  String get crmTemplatesSave => 'সংরক্ষণ করুন';

  @override
  String get crmCustomerTitle => 'গ্রাহক';

  @override
  String get crmCustomerBalance => 'ব্যালান্স';

  @override
  String get crmCustomerSalesThisYear => 'এই বছরের বিক্রি';

  @override
  String get crmCustomerSalesLastYear => 'গত বছর';

  @override
  String get crmCustomerOpenItems => 'খোলা বিল';

  @override
  String get crmCustomerInvoices => 'সাম্প্রতিক ইনভয়েস';

  @override
  String get crmCustomerReceipts => 'সম্প্রতি পাওয়া টাকা';

  @override
  String get crmCustomerOrders => 'খোলা কোটেশন ও অর্ডার';

  @override
  String get crmCustomerActivities => 'কার্যকলাপ';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'লিড $code থেকে ($source)';
  }

  @override
  String get crmCustomerLedger => 'খতিয়ান বিবরণী';

  @override
  String get crmErrorsInvalidPhone => '10 অঙ্কের ভারতীয় মোবাইল নম্বর দিন।';

  @override
  String get crmErrorsInvalidGstin => 'জিএসটিআইএন বৈধ নয়।';

  @override
  String get crmErrorsConvertToWin =>
      'লিড পেতে “পাওয়া গেছে: গ্রাহক বানান” ব্যবহার করুন।';

  @override
  String get crmErrorsLostReasonRequired => 'কেন হাতছাড়া হল জানান।';

  @override
  String get crmErrorsAlreadyConverted => 'এই লিড আগেই গ্রাহক।';

  @override
  String get crmErrorsLeadOrCustomerRequired => 'লিড বা গ্রাহক বেছে নিন।';

  @override
  String get crmErrorsUnknownTemplate => 'টেমপ্লেট বেছে নিন।';

  @override
  String get crmErrorsMissingParam =>
      'টেমপ্লেটের প্রতিটি ফাঁকা জায়গা পূরণ করুন।';

  @override
  String get crmErrorsTemplateTooLong => 'টেমপ্লেট খুব লম্বা।';

  @override
  String get crmErrorsTemplateExists => 'এই নামের টেমপ্লেট আগে থেকেই আছে।';

  @override
  String get crmErrorsNothingOutstanding => 'এই গ্রাহকের কাছে কিছু বাকি নেই।';

  @override
  String get crmErrorsInvalidTemplateName =>
      'শুধু ছোট হাতের অক্ষর, অঙ্ক ও _ ব্যবহার করুন।';

  @override
  String get crmErrorsUnknownAccount => 'গ্রাহক বেছে নিন।';

  @override
  String get crmErrorsInvalidStage => 'পর্যায় বেছে নিন।';

  @override
  String get priceListsTitle => 'মূল্য তালিকা';

  @override
  String get priceListsSubtitle =>
      'পাইকারি, পরিবেশক বা খুচরা দর। তালিকাভুক্ত গ্রাহক নতুন অর্ডার ও ইনভয়েসে তার দর পান।';

  @override
  String get priceListsOne => 'মূল্য তালিকা';

  @override
  String get priceListsNone => 'নেই (বিক্রয় দর)';

  @override
  String get priceListsNew => 'নতুন মূল্য তালিকা';

  @override
  String get priceListsName => 'নাম';

  @override
  String get priceListsDiscountPct => 'বিক্রয় দরে ছাড় (%)';

  @override
  String get priceListsDiscountHint =>
      'নির্দিষ্ট দর ছাড়া প্রতিটি আইটেমে প্রযোজ্য';

  @override
  String get priceListsFixedRates => 'নির্দিষ্ট দর';

  @override
  String get priceListsCustomers => 'গ্রাহক';

  @override
  String get priceListsEmpty => 'এখনও কোনো মূল্য তালিকা নেই।';

  @override
  String get priceListsAddRate => 'নির্দিষ্ট দর যোগ করুন';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'এই নামে মূল্য তালিকা আগে থেকেই আছে।';

  @override
  String get priceListsErrorsDuplicateItem => 'একটি আইটেম দুবার আছে।';

  @override
  String get agentsTitle => 'দালাল ও এজেন্ট';

  @override
  String get agentsSubtitle =>
      'প্রতিটি এজেন্টের আনা গ্রাহকদের কাছ থেকে পাওয়া টাকার উপর কমিশন। মাল ফেরত এলে কমিশন ফেরত যায়।';

  @override
  String get agentsIsAgent => 'দালাল বা এজেন্ট (কমিশন পান)';

  @override
  String get agentsCommissionPct => 'কমিশন (%)';

  @override
  String get agentsCommissionHint =>
      'করযোগ্য মূল্যের উপর, গ্রাহক যেমন টাকা দেন';

  @override
  String get agentsAgent => 'এজেন্ট';

  @override
  String get agentsNoAgent => 'কোনো এজেন্ট নেই';

  @override
  String get agentsSalesman => 'সেলসম্যান';

  @override
  String get agentsNoSalesman => 'কোনো সেলসম্যান নেই';

  @override
  String get agentsEarned => 'অর্জিত';

  @override
  String get agentsBilled => 'বিল হয়েছে';

  @override
  String get agentsDue => 'বকেয়া';

  @override
  String get agentsInvoice => 'চালান';

  @override
  String get agentsBase => 'করযোগ্য মূল্য';

  @override
  String get agentsReceived => 'প্রাপ্ত';

  @override
  String get agentsNoInvoices => 'এখনও কোনো চালান নেই।';

  @override
  String get agentsMakeBill => 'দালালি বিল করুন';

  @override
  String get agentsEmpty =>
      'এখনও কোনো এজেন্ট নেই। হিসাবের তালিকায় কোনো খাতাকে দালাল বা এজেন্ট হিসেবে চিহ্নিত করুন।';

  @override
  String get agentsBills => 'দালালি বিল';

  @override
  String get agentsNumber => 'নম্বর';

  @override
  String get agentsCommission => 'কমিশন';

  @override
  String get agentsTds => 'টিডিএস';

  @override
  String get agentsNet => 'নিট প্রদেয়';

  @override
  String get agentsNoBills => 'এখনও কোনো দালালি বিল নেই।';

  @override
  String agentsBillFor(String name, String amount) {
    return '$name-কে বকেয়া $amount কমিশনের বিল করুন।';
  }

  @override
  String get agentsTdsRate => 'টিডিএস হার (%)';

  @override
  String get agentsTdsHint =>
      'ফাঁকা রাখুন: বছরের কমিশন ₹20,000 ছাড়ালে 194H অনুযায়ী 2%';

  @override
  String get agentsPost => 'বিল পোস্ট করুন';

  @override
  String get agentsCancelBill => 'বিল বাতিল করুন';

  @override
  String get agentsErrorsNothingToBill =>
      'সেই তারিখে এই এজেন্টের কিছু বকেয়া নেই।';

  @override
  String get agentsErrorsNotAnAgent =>
      'দালাল বা এজেন্ট হিসেবে চিহ্নিত খাতা বাছুন।';

  @override
  String get targetsTitle => 'সেলসম্যান লক্ষ্য';

  @override
  String get targetsSubtitle =>
      'কমিশন স্ল্যাবসহ মাসিক লক্ষ্য, প্রত্যেক সেলসম্যানের বিক্রি (ফেরত বাদে) অনুযায়ী।';

  @override
  String get targetsPrevious => 'আগের মাস';

  @override
  String get targetsNext => 'পরের মাস';

  @override
  String get targetsEdit => 'লক্ষ্য ঠিক করুন';

  @override
  String get targetsChooseSalesman => 'সেলসম্যান বাছুন';

  @override
  String get targetsTarget => 'লক্ষ্য';

  @override
  String get targetsSlabs => 'স্ল্যাব';

  @override
  String get targetsSlabsHint =>
      'স্ল্যাব = লক্ষ্যের কত শতাংশ : কমিশন শতাংশ। যেমন 0:1, 100:2 মানে লক্ষ্যের নিচে 1% আর লক্ষ্যে বা তার বেশি হলে 2%।';

  @override
  String get targetsAdd => 'সেলসম্যান যোগ করুন';

  @override
  String get targetsCopyLast => 'আগের মাস থেকে কপি করুন';

  @override
  String get targetsAchieved => 'অর্জিত';

  @override
  String get targetsProgress => 'লক্ষ্যের';

  @override
  String get targetsRate => 'হার';

  @override
  String targetsInvoices(num n) {
    return '$nটি চালান';
  }

  @override
  String targetsReturns(String amount) {
    return 'ফেরত $amount';
  }

  @override
  String get targetsNoTarget => 'লক্ষ্য নেই';

  @override
  String get targetsEmpty => 'এই মাসে কোনো লক্ষ্য বা সেলসম্যানের বিক্রি নেই।';

  @override
  String get targetsNote =>
      'বিক্রি = সেলসম্যানের চালানের করযোগ্য মূল্য, সেই মাসে সেই চালানে দেওয়া ক্রেডিট নোট বাদে।';

  @override
  String get targetsErrorsInvalid =>
      'প্রতিটি সারিতে সেলসম্যান, টাকায় লক্ষ্য আর 0:1, 100:2 এর মতো স্ল্যাব চাই।';

  @override
  String get targetsErrorsDuplicateSalesman => 'একজন সেলসম্যান দুবার আছেন।';

  @override
  String get targetsErrorsDuplicateSlab => 'দুটি স্ল্যাব একই শতাংশ থেকে শুরু।';

  @override
  String get targetsErrorsUnknownEmployee =>
      'আপনার কর্মীদের মধ্যে থেকে সেলসম্যান বাছুন।';

  @override
  String get schemesTitle => 'স্কিম ও অফার';

  @override
  String get schemesSubtitle =>
      'কাউন্টারে নিজে থেকেই লাগু হওয়া অফার: শতাংশ ছাড়, টাকার ছাড়, X কিনুন Y পান, স্ল্যাব ও কম্বো।';

  @override
  String get schemesNew => 'নতুন স্কিম';

  @override
  String get schemesName => 'নাম';

  @override
  String get schemesOffer => 'অফার';

  @override
  String get schemesOn => 'কিসের উপর';

  @override
  String get schemesDates => 'তারিখ';

  @override
  String get schemesOff => 'বন্ধ';

  @override
  String get schemesEmpty => 'এখনও কোনো স্কিম নেই।';

  @override
  String get schemesRules =>
      'প্রতিটি সারিতে সর্বোচ্চ একটি স্কিম লাগে, আর বিলে সেই মিশ্রণ লাগে যাতে গ্রাহকের সবচেয়ে বেশি সাশ্রয় হয়। নিজস্ব ছাড়ের সারিতে স্কিম লাগে না।';

  @override
  String get schemesEverything => 'সবকিছু';

  @override
  String get schemesAlways => 'সবসময়';

  @override
  String get schemesNow => 'এখন থেকে';

  @override
  String get schemesNoEnd => 'শেষ তারিখ নেই';

  @override
  String schemesRange(String from, String to) {
    return '$from থেকে $to';
  }

  @override
  String get schemesKind => 'ধরন';

  @override
  String get schemesStartsOn => 'থেকে';

  @override
  String get schemesEndsOn => 'পর্যন্ত';

  @override
  String get schemesPct => 'ছাড় (%)';

  @override
  String get schemesOffPct => 'বাড়তি পিসে ছাড় (%)';

  @override
  String get schemesOffPctHint => '100 মানে বিনামূল্যে';

  @override
  String get schemesAmount => 'ছাড়ের টাকা (₹)';

  @override
  String get schemesMinValue => 'এই পণ্যে ন্যূনতম (₹)';

  @override
  String get schemesBuy => 'কিনুন';

  @override
  String get schemesGet => 'পান';

  @override
  String get schemesSlabs => 'স্ল্যাব';

  @override
  String get schemesQtySlabsHint => 'পিস : শতাংশ ছাড়, যেমন 3:10, 5:20';

  @override
  String get schemesValueSlabsHint => 'টাকা : শতাংশ ছাড়, যেমন 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'কম্বো দাম (₹)';

  @override
  String get schemesComboItems => 'কম্বোর পণ্য';

  @override
  String get schemesItem => 'পণ্য';

  @override
  String get schemesQty => 'পরিমাণ';

  @override
  String get schemesAddItem => 'পণ্য যোগ করুন';

  @override
  String get schemesAddStyle => 'স্টাইল যোগ করুন';

  @override
  String get schemesScopeHint =>
      'সব পণ্যের জন্য এগুলো ফাঁকা রাখুন; নইলে এর যেকোনো একটির সাথে মেলা পণ্য ধরা হবে।';

  @override
  String get schemesBrands => 'ব্র্যান্ড';

  @override
  String get schemesCategories => 'বিভাগ';

  @override
  String get schemesStyles => 'স্টাইল';

  @override
  String get schemesItems => 'পণ্য';

  @override
  String get schemesCommaHint => 'কমা দিয়ে আলাদা করুন';

  @override
  String get schemesActive => 'চালু';

  @override
  String get schemesKindsPercent => 'শতাংশ ছাড়';

  @override
  String get schemesKindsAmountOff => 'টাকার ছাড়';

  @override
  String get schemesKindsQtySlab => 'পরিমাণ স্ল্যাব';

  @override
  String get schemesKindsValueSlab => 'মূল্য স্ল্যাব';

  @override
  String get schemesKindsBuyGet => 'X কিনুন Y পান';

  @override
  String get schemesKindsCombo => 'কম্বো বা হ্যাম্পার';

  @override
  String get schemesKindHintPercent => 'প্রতিটি অন্তর্ভুক্ত পণ্যে একই শতাংশ';

  @override
  String get schemesKindHintAmountOff =>
      'নির্দিষ্ট টাকার ছাড়, মূল্য অনুযায়ী ভাগ';

  @override
  String get schemesKindHintQtySlab => 'বেশি পিস, বেশি শতাংশ';

  @override
  String get schemesKindHintValueSlab => 'বড় বিল, বেশি শতাংশ';

  @override
  String get schemesKindHintBuyGet =>
      'প্রতিটি দলের সবচেয়ে সস্তাগুলো বিনামূল্যে বা ছাড়ে';

  @override
  String get schemesKindHintCombo => 'একটি দামে পণ্যের সেট';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% ছাড়';
  }

  @override
  String schemesSumMin(String amount) {
    return '$amount বা তার বেশিতে';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount ছাড়';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ পিস $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return '$buyটি কিনুন $getটি বিনামূল্যে';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return '$buyটি কিনুন $getটিতে $pct% ছাড়';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$nটি পণ্য $price-এ';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'এই ধরনের স্কিমের জন্য দরকারি তথ্য দিন।';

  @override
  String get schemesErrorsSchemeNameTaken =>
      'এই নামে একটি স্কিম আগে থেকেই আছে।';

  @override
  String get schemesErrorsEndsBeforeStart => 'শেষ তারিখ শুরুর তারিখের আগে।';

  @override
  String get schemesErrorsDuplicateSlab => 'দুটি স্ল্যাব একই জায়গা থেকে শুরু।';

  @override
  String get schemesErrorsUnknownItem => 'আপনার তালিকা থেকে পণ্য বাছুন।';

  @override
  String get schemesErrorsUnknownStyle => 'আপনার তালিকা থেকে স্টাইল বাছুন।';

  @override
  String get schemesErrorsSlabs => 'স্ল্যাব এভাবে লিখুন: 3:10, 5:20।';

  @override
  String get schemesErrorsNumber => 'টাকা ও শতাংশ সংখ্যা হতে হবে।';

  @override
  String get interestTitle => 'বকেয়ার উপর সুদ';

  @override
  String get interestSubtitle =>
      'প্রতিটি বিলে নির্ধারিত তারিখের পরের দিনগুলির সরল সুদ, গ্রাহকের হারে।';

  @override
  String get interestPartyRates => 'যাদের সুদের হার নির্ধারিত সেই গ্রাহক।';

  @override
  String interestUsingRate(String rate) {
    return 'নিজস্ব হার নেই এমন গ্রাহকদের হিসাব $rate% হারে।';
  }

  @override
  String get interestPartyRatesOnly => 'শুধু হার থাকা গ্রাহক';

  @override
  String interestTryRate(String rate) {
    return 'সবার হিসাব $rate% হারে করুন';
  }

  @override
  String get interestRate => 'হার';

  @override
  String get interestOverdue => 'বকেয়া';

  @override
  String get interestInterest => 'সুদ';

  @override
  String interestDueOn(String date) {
    return 'নির্ধারিত $date';
  }

  @override
  String get interestNone => 'সুদ ধরার মতো বকেয়া বিল নেই।';

  @override
  String get interestGstNote =>
      'দেরিতে পেমেন্টের সুদ সরবরাহ মূল্যের অংশ (CGST আইন ধারা 15(2)(d)); পণ্যের হারে GST সহ বিল করুন।';

  @override
  String get integrityTitle => 'সামঞ্জস্য যাচাই';

  @override
  String get integritySubtitle =>
      'আপনার হিসাব কি নিজেদের মধ্যে মেলে? প্রতিটি যাচাই এমন দুটি জিনিস মেলায় যা মিলতেই হবে, আর পার্থক্য তার রেকর্ড সহ দেখায়।';

  @override
  String get integrityAllGood =>
      'সব যাচাই পাস করেছে। আপনার হিসাব নিজেদের মধ্যে মেলে।';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি যাচাইয়ে নজর দিতে হবে',
      one: '$nটি যাচাইয়ে নজর দিতে হবে',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'পাস';

  @override
  String get integrityFail => 'পার্থক্য';

  @override
  String get integrityWarn => 'এটি দেখুন';

  @override
  String get integrityRecords => 'রেকর্ড';

  @override
  String get integrityFirstTwenty => 'প্রথম ২০টি দেখানো হয়েছে।';

  @override
  String get integrityVouchersBalanceTitle => 'প্রতিটি ভাউচার সমান';

  @override
  String get integrityVouchersBalanceHelp =>
      'প্রতিটি ভাউচারে ডেবিট ও ক্রেডিট সমান। যেটি নয় সেটি এখানে দেখা যায়।';

  @override
  String get integrityTrialBalanceTitle => 'ট্রায়াল ব্যালেন্স মেলে';

  @override
  String get integrityTrialBalanceHelp =>
      'প্রারম্ভিক জের ও প্রতিটি এন্ট্রির যোগফল শূন্য হওয়া উচিত। পার্থক্য সাধারণত হয় যখন প্রারম্ভিক জের অপর পাশ, যেমন মালিকের মূলধন, ছাড়া লেখা হয়।';

  @override
  String get integrityInvoicesMatchLedgerTitle =>
      'বিক্রয় বিল খাতার সঙ্গে মেলে';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'প্রতিটি পোস্ট করা বিল তার মোট টাকা গ্রাহকের অ্যাকাউন্টে দিয়েছে।';

  @override
  String get integrityBillsMatchLedgerTitle => 'ক্রয় বিল খাতার সঙ্গে মেলে';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'রিভার্স চার্জ বাদে প্রতিটি পোস্ট করা বিল মোট টাকা সরবরাহকারীর অ্যাকাউন্টে দিয়েছে।';

  @override
  String get integrityDocumentsPostedTitle =>
      'পোস্ট করা নথির খাতার এন্ট্রি আছে';

  @override
  String get integrityDocumentsPostedHelp =>
      'যে পোস্ট করা বিলের পিছনে ভাউচার নেই তা এখানে দেখা যায়।';

  @override
  String get integrityCancelledReversedTitle => 'বাতিল ভাউচারের নিট শূন্য';

  @override
  String get integrityCancelledReversedHelp =>
      'ভাউচার বাতিল করলে সে যে অ্যাকাউন্টগুলো ছুঁয়েছিল প্রতিটির উল্টো এন্ট্রি হতে হবে।';

  @override
  String get integrityReceivablesMatchTitle =>
      'গ্রাহকদের কাছে পাওনা খাতার সঙ্গে মেলে';

  @override
  String get integrityReceivablesMatchHelp =>
      'বকেয়া তালিকার যোগফল গ্রাহকদের খাতার জেরের সমান।';

  @override
  String get integrityPayablesMatchTitle =>
      'সরবরাহকারীদের দেনা খাতার সঙ্গে মেলে';

  @override
  String get integrityPayablesMatchHelp =>
      'বকেয়া তালিকার যোগফল সরবরাহকারীদের খাতার জেরের সমান।';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'গিফট ভাউচারের দায় অব্যবহৃত ভাউচারের সঙ্গে মেলে';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'গিফট ভাউচারের খাতা সক্রিয় ভাউচারে থাকা জেরের সমান।';

  @override
  String get integrityNegativeStockTitle => 'কোনো স্টক শূন্যের নিচে নয়';

  @override
  String get integrityNegativeStockHelp =>
      'খাতায় দেখানো স্টকের চেয়ে বেশি বিক্রি বা দেওয়া পণ্য। এটি সত্যিকারের সময়ের ফারাক হতে পারে; বাদ পড়া প্রাপ্তি লিখুন।';

  @override
  String get sensitiveTitle => 'সংবেদনশীল পরিবর্তন';

  @override
  String get sensitiveSubtitle =>
      'যে পরিবর্তন টাকা সরাতে বা দরজা খুলতে পারে: ব্যাংক বিবরণ, ধারের শর্ত, কর সেটিং, কার কী অধিকার, সময়কাল লক ও বেতন সেটিং। সবচেয়ে নতুন আগে।';

  @override
  String get sensitiveKindBank => 'ব্যাংক বিবরণ';

  @override
  String get sensitiveKindCredit => 'ধারের শর্ত';

  @override
  String get sensitiveKindTax => 'কর ও কোম্পানি সেটিং';

  @override
  String get sensitiveKindPermissions => 'কার কী অধিকার';

  @override
  String get sensitiveKindPeriod => 'সময়কাল লক ও নম্বরিং';

  @override
  String get sensitiveKindPayroll => 'বেতন সেটিং';

  @override
  String get sensitiveKindOverride => 'ধারের সীমা অতিক্রম';

  @override
  String get sensitiveKindDevice => 'ডিভাইস';

  @override
  String get sensitiveAll => 'সব ধরন';

  @override
  String get sensitiveNone => 'এই সময়ে কোনো সংবেদনশীল পরিবর্তন নেই।';

  @override
  String get sensitiveShow => 'দেখান';

  @override
  String get cfoTitle => 'মালিকের দৃষ্টি';

  @override
  String get cfoSubtitle =>
      'বিক্রি থেকে মুনাফা পর্যন্ত, এই সময়ের ছবি, গত বছরের একই সময়ের সঙ্গে। আপনার খাতায় আয়কর না থাকলে করের আগে ও পরের মুনাফা একই দেখায়।';

  @override
  String get cfoThisPeriod => 'এই সময়';

  @override
  String get cfoLastYear => 'গত বছরের একই সময়';

  @override
  String get cfoGrowth => 'বৃদ্ধি';

  @override
  String get cfoRevenue => 'রাজস্ব';

  @override
  String get cfoCostOfGoods => 'বিক্রীত পণ্যের খরচ';

  @override
  String get cfoGrossProfit => 'মোট মুনাফা';

  @override
  String get cfoGrossMargin => 'মোট মার্জিন';

  @override
  String get cfoOperatingExpenses => 'পরিচালন খরচ';

  @override
  String get cfoOtherIncome => 'অন্যান্য আয়';

  @override
  String get cfoDepreciation => 'অবচয়';

  @override
  String get cfoEbitda => 'EBITDA (অবচয়ের আগের মুনাফা)';

  @override
  String get cfoNetProfit => 'নিট মুনাফা';

  @override
  String get cfoMonthly => 'মাসওয়ারি মোট মার্জিন';

  @override
  String get lrTitle => 'এলআর ও পরিবহন এন্ট্রি';

  @override
  String get lrSubtitle =>
      'ট্রান্সপোর্টারের মাধ্যমে পাঠানো পণ্য: এলআর নম্বর, বিল, ভাড়া, আর গ্রাহকের কাছে পৌঁছেছে কিনা।';

  @override
  String get lrTransporter => 'ট্রান্সপোর্টার';

  @override
  String get lrLrNumber => 'এলআর নম্বর';

  @override
  String get lrInvoice => 'বিল';

  @override
  String get lrNoInvoice => 'বিল নেই';

  @override
  String get lrDestination => 'গন্তব্য';

  @override
  String get lrPackages => 'প্যাকেজ';

  @override
  String get lrWeight => 'ওজন (কেজি)';

  @override
  String get lrFreight => 'ভাড়া';

  @override
  String get lrFreightBy => 'ভাড়া কে দেবে';

  @override
  String get lrPaid => 'আমরা দিয়েছি';

  @override
  String get lrToPay => 'গ্রাহক দেবেন';

  @override
  String get lrAdd => 'পাঠানো পণ্য যোগ করুন';

  @override
  String get lrStatus => 'অবস্থা';

  @override
  String get lrAllStatuses => 'সব অবস্থা';

  @override
  String get lrStatusesBooked => 'বুক করা হয়েছে';

  @override
  String get lrStatusesInTransit => 'পথে';

  @override
  String get lrStatusesDelivered => 'পৌঁছেছে';

  @override
  String lrDeliveredOn(String date) {
    return '$date তারিখে পৌঁছেছে';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'পাঠানোর $n দিন',
      one: 'পাঠানোর $n দিন',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty => 'এখনও কোনো পণ্য পাঠানো হয়নি। উপরে প্রথমটি যোগ করুন।';

  @override
  String get lrErrorsLrTaken => 'এই ট্রান্সপোর্টারের এই এলআর নম্বর আগেই আছে।';

  @override
  String get lrErrorsUnknownInvoice => 'সেই বিল পাওয়া যায়নি।';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'পৌঁছানোর তারিখ পাঠানোর তারিখের আগে।';

  @override
  String get hsnTitle => 'এইচএসএন ও এসএসি কোড';

  @override
  String get hsnSubtitle =>
      'আপনার ব্যবসায় ব্যবহৃত কোড, সহজ বর্ণনা সহ। পণ্য ও স্টাইলের ফর্ম এই তালিকা থেকে পরামর্শ দেয়। এখানকার হার শুধু সুবিধার জন্য: পোশাক ও জুতোয় দামের স্ল্যাব অনুযায়ী কর লাগে।';

  @override
  String get hsnCode => 'কোড';

  @override
  String get hsnDescription => 'বর্ণনা';

  @override
  String get hsnKind => 'ধরন';

  @override
  String get hsnGoods => 'পণ্য (এইচএসএন)';

  @override
  String get hsnService => 'পরিষেবা (এসএসি)';

  @override
  String get hsnRate => 'হার';

  @override
  String get hsnAddStandard => 'প্রচলিত পোশাকের কোড যোগ করুন';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি কোড যোগ হয়েছে। আগের কোড বদলায়নি।',
      one: '$nটি কোড যোগ হয়েছে। আগের কোড বদলায়নি।',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'আর্কাইভ করা দেখান';

  @override
  String get hsnEmpty =>
      'এখনও কোনো কোড নেই। উপরে যোগ করুন, বা প্রচলিত পোশাকের কোড যোগ করুন।';

  @override
  String get hsnErrorsHsnTaken => 'এই কোড তালিকায় আগেই আছে।';

  @override
  String get hsnErrorsInvalidHsn =>
      'এইচএসএন কোডে ৪, ৬ বা ৮ অঙ্ক থাকে (এসএসি কোডে ৬)।';

  @override
  String get notesTitle => 'আমার নোট';

  @override
  String get notesPrivate => 'এগুলো শুধু আপনিই দেখতে পান।';

  @override
  String get notesNone => 'কিছু লেখা নেই। নিচে একটি মনে করার কথা লিখুন।';

  @override
  String get notesPlaceholder => 'নোট বা মনে করার কথা লিখুন';

  @override
  String get notesRemindOn => 'এই দিনে মনে করান';

  @override
  String get notesAdd => 'যোগ করুন';

  @override
  String get notesToday => 'আজ';

  @override
  String notesOverdue(String date) {
    return '$date তারিখে ছিল';
  }

  @override
  String notesMarkDone(String note) {
    return 'সম্পন্ন: $note';
  }

  @override
  String get notesRemove => 'নোট মুছুন';

  @override
  String get movementTitle => 'দ্রুত ও ধীরে বিক্রি হওয়া পণ্য';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'গত $days দিনে কী বিক্রি হয়েছে। দ্রুত মানে $fastMin বা বেশি পিস; ধীর মানে কিছু বিক্রি কিন্তু এর কম; অচল মানে কিছুই নয়। অচল পণ্য আগে।';
  }

  @override
  String get movementWindow => 'পিছনে দেখুন';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n দিন',
      one: '$n দিন',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'দ্রুতের সীমা (পিস)';

  @override
  String get movementIncludeFabric => 'কাপড় ও ট্রিম অন্তর্ভুক্ত করুন';

  @override
  String get movementClassFast => 'দ্রুত';

  @override
  String get movementClassSlow => 'ধীর';

  @override
  String get movementClassNone => 'অচল';

  @override
  String movementItems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$nটি পণ্য',
      one: '$nটি পণ্য',
    );
    return '$_temp0';
  }

  @override
  String movementPiecesInStock(String n) {
    return 'স্টকে $n পিস';
  }

  @override
  String get movementItem => 'পণ্য';

  @override
  String get movementStatus => 'গতি';

  @override
  String movementSold(String days) {
    return '$days দিনে বিক্রি';
  }

  @override
  String get movementInStock => 'স্টকে';

  @override
  String get movementStockValue => 'স্টকের মূল্য';

  @override
  String get movementLastSold => 'শেষ বিক্রি';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n দিন আগে',
      one: '$n দিন আগে',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'কখনও না';

  @override
  String get movementEmpty => 'দেখানোর মতো স্টক নেই।';

  @override
  String get movementFirstRows => 'প্রথম ৫০০টি পণ্য দেখানো হয়েছে।';

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
