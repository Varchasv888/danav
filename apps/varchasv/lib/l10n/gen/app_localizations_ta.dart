// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Tamil (`ta`).
class AppLocalizationsTa extends AppLocalizations {
  AppLocalizationsTa([String locale = 'ta']) : super(locale);

  @override
  String get brandName => 'Varchasv';

  @override
  String get brandFull => 'Varchasv ERP Systems';

  @override
  String get brandTagline =>
      'கணக்கு, ஜிஎஸ்டி, சரக்கு, சம்பளம், ஆன்லைனிலும் ஆஃப்லைனிலும், உங்கள் மொழியில்.';

  @override
  String get commonSave => 'சேமி';

  @override
  String get commonSaving => 'சேமிக்கிறது…';

  @override
  String get commonSaved => 'சேமிக்கப்பட்டது';

  @override
  String get commonCancel => 'ரத்துசெய்';

  @override
  String get commonEdit => 'திருத்து';

  @override
  String get commonAdd => 'சேர்';

  @override
  String get commonClose => 'மூடு';

  @override
  String get commonLoading => 'ஏற்றுகிறது…';

  @override
  String get commonOptional => 'விருப்பத்தேர்வு';

  @override
  String get commonLanguage => 'மொழி';

  @override
  String get commonTheme => 'தீம்';

  @override
  String get commonLight => 'வெளிர்';

  @override
  String get commonDark => 'இருள்';

  @override
  String get commonSystem => 'கணினி';

  @override
  String commonComingSoon(String phase) {
    return 'கட்டம் $phase-இல் வருகிறது';
  }

  @override
  String get commonNone => 'எதுவுமில்லை';

  @override
  String get commonYes => 'ஆம்';

  @override
  String get commonNo => 'இல்லை';

  @override
  String get commonSearch => 'தேடு';

  @override
  String get commonAll => 'அனைத்தும்';

  @override
  String get commonFrom => 'இருந்து';

  @override
  String get commonTo => 'வரை';

  @override
  String get commonAsOf => 'தேதியின்படி';

  @override
  String get commonTotal => 'மொத்தம்';

  @override
  String get commonDebit => 'பற்று';

  @override
  String get commonCredit => 'வரவு';

  @override
  String get commonBalance => 'இருப்பு';

  @override
  String get commonDate => 'தேதி';

  @override
  String get commonNarration => 'விவரம்';

  @override
  String get commonActions => 'செயல்கள்';

  @override
  String get commonBack => 'பின்செல்';

  @override
  String get commonApply => 'காட்டு';

  @override
  String get commonRemove => 'நீக்கு';

  @override
  String get commonCopy => 'நகலெடு';

  @override
  String get commonCopied => 'நகலெடுக்கப்பட்டது';

  @override
  String get commonDr => 'ப';

  @override
  String get commonCr => 'வ';

  @override
  String get commonView => 'பார்';

  @override
  String get commonArchived => 'காப்பகம்';

  @override
  String get commonPrint => 'அச்சிடு';

  @override
  String commonListCapped(String count) {
    return 'சமீபத்திய $count ஆவணங்கள் காட்டப்படுகின்றன. பழையவற்றைப் பார்க்க தேதிகளைத் தேர்வுசெய்யவும்.';
  }

  @override
  String get authLoginTitle => 'உங்கள் வணிகத்தில் உள்நுழையவும்';

  @override
  String get authLoginSubtitle => 'மீண்டும் வருக.';

  @override
  String get authSignupTitle => 'Varchasv-இல் உங்கள் வணிகத்தைத் தொடங்குங்கள்';

  @override
  String get authSignupSubtitle =>
      '₹40 லட்சத்துக்குக் குறைவான விற்றுமுதல் உள்ள வணிகங்களுக்கு இலவசம். அட்டை தேவையில்லை.';

  @override
  String get authEmail => 'மின்னஞ்சல்';

  @override
  String get authPassword => 'கடவுச்சொல்';

  @override
  String get authPasswordHint => 'குறைந்தது 8 எழுத்துகள்';

  @override
  String get authName => 'உங்கள் பெயர்';

  @override
  String get authBusinessName => 'வணிகப் பெயர்';

  @override
  String get authState => 'மாநிலம்';

  @override
  String get authGstin => 'ஜிஎஸ்டிஐஎன்';

  @override
  String get authGstinHint => 'ஜிஎஸ்டி பதிவு இல்லையெனில் காலியாக விடவும்';

  @override
  String get authIndustry => 'வணிக வகை';

  @override
  String get authLogin => 'உள்நுழை';

  @override
  String get authSignup => 'கணக்கை உருவாக்கு';

  @override
  String get authLogout => 'வெளியேறு';

  @override
  String get authNoAccount => 'Varchasv-க்குப் புதியவரா?';

  @override
  String get authHaveAccount => 'ஏற்கனவே கணக்கு உள்ளதா?';

  @override
  String get authCreateOne => 'கணக்கை உருவாக்கு';

  @override
  String get authSignInInstead => 'உள்நுழை';

  @override
  String get authErrorsInvalidCredentials =>
      'இந்த மின்னஞ்சலும் கடவுச்சொல்லும் பொருந்தவில்லை.';

  @override
  String get authErrorsEmailTaken =>
      'இந்த மின்னஞ்சலுக்கு ஏற்கனவே கணக்கு உள்ளது.';

  @override
  String get authErrorsGstinLength =>
      'ஜிஎஸ்டிஐஎன்-இல் 15 எழுத்துகள் இருக்கும்.';

  @override
  String get authErrorsGstinFormat => 'இது ஜிஎஸ்டிஐஎன் போலத் தெரியவில்லை.';

  @override
  String get authErrorsGstinState =>
      'ஜிஎஸ்டிஐஎன் அறியப்படாத மாநிலக் குறியீட்டில் தொடங்குகிறது.';

  @override
  String get authErrorsGstinChecksum =>
      'இந்த ஜிஎஸ்டிஐஎன்-இல் தட்டச்சுப் பிழை உள்ளது: கடைசி எழுத்து பொருந்தவில்லை.';

  @override
  String get authErrorsGstinStateMismatch =>
      'இந்த ஜிஎஸ்டிஐஎன் தேர்ந்தெடுத்த மாநிலத்தைச் சேர்ந்ததல்ல.';

  @override
  String get authErrorsValidation => 'குறிக்கப்பட்ட புலங்களைச் சரிபார்க்கவும்.';

  @override
  String get authErrorsGeneric => 'ஏதோ தவறு நடந்தது. மீண்டும் முயலவும்.';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'இந்த இணைப்பு காலாவதியானது அல்லது ஏற்கனவே பயன்படுத்தப்பட்டது. புதிய இணைப்பைக் கேளுங்கள்.';

  @override
  String get authErrorsWrongPassword => 'உங்கள் தற்போதைய கடவுச்சொல் தவறு.';

  @override
  String get authErrorsPasswordsDiffer =>
      'இரண்டு கடவுச்சொற்களும் பொருந்தவில்லை.';

  @override
  String get authErrorsNeedsChangeDate =>
      'ஆவணத்திற்குப் பின்தேதி இட உங்களுக்கு உரிமை இல்லை. இன்றைய தேதியைப் பயன்படுத்துங்கள், அல்லது உரிமையாளரிடம் உரிமை கேளுங்கள்.';

  @override
  String get authErrorsNeedsFutureDate =>
      'ஆவணத்திற்கு முன்தேதி இட உங்களுக்கு உரிமை இல்லை. இன்றைய தேதியைப் பயன்படுத்துங்கள், அல்லது உரிமையாளரிடம் உரிமை கேளுங்கள்.';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'ஒரு வரியின் விலை அதன் செலவை விடக் குறைவு. செலவுக்குக் கீழே விற்க உங்களுக்கு உரிமை இல்லை; விலையை உயர்த்துங்கள் அல்லது உரிமையாளரிடம் கேளுங்கள்.';

  @override
  String get authForgotLink => 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?';

  @override
  String get authForgotTitle => 'உங்கள் கடவுச்சொல்லை மீட்டமைக்கவும்';

  @override
  String get authForgotSubtitle =>
      'உங்கள் கணக்கின் மின்னஞ்சலை உள்ளிடுங்கள்; புதிய கடவுச்சொல்லைத் தேர்வுசெய்ய இணைப்பை அனுப்புவோம்.';

  @override
  String get authSendLink => 'மீட்டமைப்பு இணைப்பை அனுப்பு';

  @override
  String authForgotSent(String email) {
    return '$email க்கு கணக்கு இருந்தால், மீட்டமைப்பு இணைப்பு அனுப்பப்படுகிறது. இது ஒருமுறை மட்டுமே வேலை செய்யும், ஒரு மணி நேரத்தில் காலாவதியாகும்.';
  }

  @override
  String get authBackToLogin => 'உள்நுழைவுக்குத் திரும்பு';

  @override
  String get authResetTitle => 'புதிய கடவுச்சொல்லைத் தேர்வுசெய்யவும்';

  @override
  String get authNewPassword => 'புதிய கடவுச்சொல்';

  @override
  String get authConfirmPassword => 'புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்';

  @override
  String get authSetPassword => 'கடவுச்சொல்லை அமை';

  @override
  String get authResetDone =>
      'உங்கள் கடவுச்சொல் மாற்றப்பட்டது, எல்லா இடங்களிலிருந்தும் நீங்கள் வெளியேற்றப்பட்டீர்கள். புதிய கடவுச்சொல்லுடன் உள்நுழையவும்.';

  @override
  String get shellGoTo => 'செல்க…';

  @override
  String get shellGoToPlaceholder =>
      'ஒரு திரையைத் திறக்கவும் அல்லது புதிய பதிவைத் தொடங்கவும்';

  @override
  String shellNoMatch(String query) {
    return '“$query” உடன் எதுவும் பொருந்தவில்லை.';
  }

  @override
  String get shellTallyKeys =>
      'உரைப் புலத்துக்கு வெளியே எங்கும் டேலி விசைகள் வேலை செய்யும்: F4 கான்ட்ரா, F5 பணம் செலுத்தல், F6 வரவு, F7 ஜர்னல், F8 விற்பனை, F9 கொள்முதல்.';

  @override
  String get shellCreate => 'புதியது';

  @override
  String get shellEntries => 'புதிய பதிவு';

  @override
  String get shellScreens => 'திரைகள்';

  @override
  String get shellMenu => 'பட்டி';

  @override
  String shellFy(String years) {
    return 'நிதியாண்டு $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type வவுச்சர்';
  }

  @override
  String get shellFold => 'மெனுவைச் சுருக்கு';

  @override
  String get shellUnfold => 'மெனுவைத் திற';

  @override
  String get accountTitle => 'எனது கணக்கு';

  @override
  String get accountSubtitle =>
      'உங்கள் பெயர் மற்றும் கடவுச்சொல், நீங்கள் சேர்ந்துள்ள ஒவ்வொரு வணிகத்துக்கும் பயன்படும்.';

  @override
  String get accountProfile => 'சுயவிவரம்';

  @override
  String get accountSave => 'சேமி';

  @override
  String get accountSaved => 'சேமிக்கப்பட்டது';

  @override
  String get accountPasswordTitle => 'கடவுச்சொல்லை மாற்று';

  @override
  String get accountCurrentPassword => 'தற்போதைய கடவுச்சொல்';

  @override
  String get accountPasswordChanged =>
      'கடவுச்சொல் மாற்றப்பட்டது. உங்கள் மற்ற சாதனங்கள் வெளியேற்றப்பட்டன.';

  @override
  String get industryApparel => 'ஆடை மற்றும் ஜவுளி';

  @override
  String get industryGeneral => 'பொது';

  @override
  String get industryTrading => 'வர்த்தகம் / விநியோகம்';

  @override
  String get industryManufacturing => 'உற்பத்தி';

  @override
  String get industryRetail => 'சில்லறைக் கடை';

  @override
  String get industryServices => 'சேவைகள்';

  @override
  String get navDashboard => 'டாஷ்போர்டு';

  @override
  String get navSales => 'விற்பனை';

  @override
  String get navPurchase => 'கொள்முதல்';

  @override
  String get navInventory => 'சரக்கு';

  @override
  String get navAccounts => 'கணக்குகள்';

  @override
  String get navGst => 'ஜிஎஸ்டி';

  @override
  String get navHr => 'மனிதவளம் & சம்பளம்';

  @override
  String get navReports => 'அறிக்கைகள்';

  @override
  String get navSettings => 'அமைப்புகள்';

  @override
  String get navCompany => 'நிறுவனம் & கிளைகள்';

  @override
  String get navNumberSeries => 'எண் வரிசை';

  @override
  String get navAuditLog => 'தணிக்கைத் தடம்';

  @override
  String get navTools => 'கருவிகள்';

  @override
  String get navTeam => 'குழு & பங்குகள்';

  @override
  String get navChart => 'கணக்குப் பட்டியல்';

  @override
  String get navVouchers => 'வவுச்சர்கள் மற்றும் கூப்பன்கள்';

  @override
  String get navTrialBalance => 'இருப்பாய்வு';

  @override
  String get navProfitLoss => 'லாப நட்டம்';

  @override
  String get navBalanceSheet => 'இருப்புநிலைக் குறிப்பு';

  @override
  String get navFinancialYears => 'நிதியாண்டுகள்';

  @override
  String get navItems => 'பொருட்கள்';

  @override
  String get navStock => 'சரக்குச் சுருக்கம்';

  @override
  String get navStockJournals => 'சரக்குப் பதிவேடு';

  @override
  String get navReorder => 'மறு ஆர்டர்';

  @override
  String get navPurchaseOrders => 'கொள்முதல் ஆர்டர்கள்';

  @override
  String get navGoodsReceipts => 'உள்வரவு சலான்';

  @override
  String get navPurchaseBills => 'கொள்முதல் பில்கள்';

  @override
  String get navPurchaseReturns => 'கொள்முதல் திருப்பம்';

  @override
  String get navSalesOrders => 'விற்பனை ஆர்டர்கள்';

  @override
  String get navDeliveryNotes => 'டெலிவரி சலான்';

  @override
  String get navSalesInvoices => 'விற்பனை விலைப்பட்டியல்';

  @override
  String get navCreditNotes => 'கிரெடிட் நோட்';

  @override
  String get navReceivables => 'வரவேண்டியவை';

  @override
  String get navPayables => 'செலுத்த வேண்டியவை';

  @override
  String get navGstReturns => 'ஜிஎஸ்டி ரிட்டர்ன்';

  @override
  String get navGstSettings => 'ஜிஎஸ்டி & விலைப்பட்டியல்';

  @override
  String get navImport => 'தரவு இறக்குமதி';

  @override
  String get navQuotations => 'விலைப்புள்ளிகள்';

  @override
  String get navEmployees => 'பணியாளர்கள்';

  @override
  String get navAttendance => 'வருகை';

  @override
  String get navLeave => 'விடுப்பு';

  @override
  String get navPayroll => 'சம்பளப் பட்டியல்';

  @override
  String get navPayrollSettings => 'சம்பளப் பட்டியல்';

  @override
  String get navStatutory => 'சட்டப்பூர்வ & டிடிஎஸ்';

  @override
  String get navManufacturing => 'உற்பத்தி';

  @override
  String get navBoms => 'பொருள் பட்டியல் (BOM)';

  @override
  String get navProduction => 'உற்பத்தி ஆர்டர்கள்';

  @override
  String get navMrp => 'பொருள் திட்டமிடல்';

  @override
  String get navJobWork => 'ஜாப் வொர்க்';

  @override
  String get navPos => 'விற்பனை முனையம்';

  @override
  String get navPosBilling => 'பில்லிங்';

  @override
  String get navPosBills => 'பில்கள்';

  @override
  String get navPosSettings => 'கவுண்டர் அமைப்புகள்';

  @override
  String get navBanking => 'வங்கி';

  @override
  String get navBankAccounts => 'வங்கி ஒப்பீடு';

  @override
  String get navBankRules => 'வங்கி விதிகள்';

  @override
  String get navSettlements => 'கேட்வே தீர்வுகள்';

  @override
  String get navAssets => 'நிலைச் சொத்துகள்';

  @override
  String get navAssetRegister => 'சொத்துப் பதிவேடு';

  @override
  String get navDepreciation => 'தேய்மானம்';

  @override
  String get navItDepreciation => 'வருமான வரி தேய்மானம்';

  @override
  String get navExpenses => 'செலவுகள்';

  @override
  String get navExpenseClaims => 'செலவுக் கோரிக்கைகள்';

  @override
  String get navExpenseCategories => 'செலவு வகைகள்';

  @override
  String get navProjects => 'திட்டங்கள்';

  @override
  String get navProjectList => 'திட்டங்கள்';

  @override
  String get navTimesheets => 'நேரத்தாள்கள்';

  @override
  String get navAssistant => 'உதவியாளர்';

  @override
  String get navCrm => 'சிஆர்எம்';

  @override
  String get navLeads => 'லீட்கள்';

  @override
  String get navFollowUps => 'பின்தொடர்வுகள்';

  @override
  String get navMessageTemplates => 'செய்தி வார்ப்புருக்கள்';

  @override
  String get navReportBuilder => 'அறிக்கை உருவாக்கி';

  @override
  String get navSavedReports => 'சேமித்த அறிக்கைகள்';

  @override
  String get navChecks => 'சோதனைகள்';

  @override
  String get navStyles => 'ஸ்டைல்கள்';

  @override
  String get navProformas => 'புரோஃபார்மா இன்வாய்ஸ்';

  @override
  String get navApprovals => 'ஒப்புதலுக்கு அனுப்பிய சரக்கு';

  @override
  String get navPriceLists => 'விலைப் பட்டியல்';

  @override
  String get navInterest => 'நிலுவை மீதான வட்டி';

  @override
  String get navAgents => 'முகவர் கமிஷன்';

  @override
  String get navTargets => 'விற்பனையாளர் இலக்குகள்';

  @override
  String get navSchemes => 'திட்டங்கள் மற்றும் சலுகைகள்';

  @override
  String get navPosReturns => 'திருப்பி அளித்தல் மற்றும் மாற்றம்';

  @override
  String get navAlterations => 'ஆல்டரேஷன்';

  @override
  String get navTailoring => 'தையல்';

  @override
  String get navConsignment => 'சரக்கு ஒப்படைப்பு';

  @override
  String get navCatalogue => 'படக் கையேடு';

  @override
  String get navInsights => 'வணிக நுண்ணறிவு';

  @override
  String get navSalesRegister => 'விற்பனைப் பதிவேடு';

  @override
  String get navColourSize => 'நிறம்-அளவு அறிக்கை';

  @override
  String get navStockAgeing => 'இருப்பு வயது';

  @override
  String get navLabels => 'பார்கோடு லேபிள்கள்';

  @override
  String get navMessageLog => 'வாட்ஸ்அப் பதிவு';

  @override
  String get navMyMenu => 'என் மெனு';

  @override
  String get navAllActions => 'அனைத்து செயல்கள்';

  @override
  String get navStockCounts => 'இருப்பு எண்ணிக்கை';

  @override
  String get navWorkspace => 'பணியிடம்';

  @override
  String get navSalesPos => 'விற்பனை, கவுண்டர்';

  @override
  String get navPromotions => 'சலுகைகள், விலை';

  @override
  String get navFinance => 'கணக்கு, வங்கி';

  @override
  String get navOperations => 'செலவு, திட்டம், சொத்து';

  @override
  String get navMasters => 'முதன்மைப் பதிவுகள்';

  @override
  String get navReportsHub => 'அனைத்து அறிக்கைகள்';

  @override
  String get navMastersHub => 'அனைத்து முதன்மைப் பதிவுகள்';

  @override
  String get navSizesColours => 'அளவுகள், நிறங்கள்';

  @override
  String get navBandWorkspace => 'பணியிடம்';

  @override
  String get navBandCommerce => 'விற்பனை';

  @override
  String get navBandSupply => 'கொள்முதல், இருப்பு';

  @override
  String get navBandProduction => 'உற்பத்தி, இயக்கம்';

  @override
  String get navBandMoney => 'பணம், பணியாளர்';

  @override
  String get navBandInsight => 'அறிக்கைகள்';

  @override
  String get navBandAdmin => 'அமைப்பு';

  @override
  String get navIntegrity => 'ஒருமைப்பாட்டுச் சோதனை';

  @override
  String get navCfoView => 'உரிமையாளர் பார்வை';

  @override
  String get navStockMovement => 'வேகமாகவும் மெதுவாகவும் விற்கும் பொருட்கள்';

  @override
  String dashboardGreeting(String name) {
    return 'வணக்கம், $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return 'இன்று $business எங்கே நிற்கிறது என்று பாருங்கள்.';
  }

  @override
  String get dashboardSetupTitle => 'அமைப்பை முடிக்கவும்';

  @override
  String get dashboardSetupCompany =>
      'நிறுவன விவரங்களும் பான் எண்ணும் சேர்க்கவும்';

  @override
  String get dashboardSetupBranch =>
      'ஒவ்வொரு கிளைக்கும் ஜிஎஸ்டிஐஎன் சேர்க்கவும்';

  @override
  String get dashboardSetupSeries =>
      'உங்கள் விலைப்பட்டியல் எண் வரிசையைச் சரிபார்க்கவும்';

  @override
  String get dashboardRoadmapTitle => 'என்ன வருகிறது';

  @override
  String get dashboardCalcTitle => 'விரைவு ஜிஎஸ்டி கணிப்பான்';

  @override
  String get dashboardCalcSubtitle =>
      'விநியோக இடத்தைக் கொண்டு CGST/SGST அல்லது IGST கணக்கிடும்.';

  @override
  String get dashboardKSalesToday => 'இன்றைய விற்பனை';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'நேற்று $amount';
  }

  @override
  String get dashboardKSalesMonth => 'இம்மாத விற்பனை';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'கடந்த மாதம் இதே நாட்கள் வரை $amount';
  }

  @override
  String get dashboardKReceivables => 'வரவேண்டியவை';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount தவணை தாண்டியது';
  }

  @override
  String get dashboardKPayables => 'செலுத்த வேண்டியவை';

  @override
  String dashboardKDueSoon(String amount) {
    return '7 நாட்களில் $amount செலுத்த வேண்டும்';
  }

  @override
  String get dashboardKProfit => 'இம்மாத லாபம்';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'மொத்த லாபம் $amount';
  }

  @override
  String get dashboardKStockValue => 'சரக்கு மதிப்பு';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count பொருட்கள்',
      one: '$count பொருள்',
    );
    return '$_temp0 மறு ஆர்டர் நிலைக்குக் கீழே';
  }

  @override
  String get dashboardKPipeline => 'விற்பனைக் குழாய்';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$count திறந்த லீட்கள் · எடையிட்ட $amount';
  }

  @override
  String get dashboardKApprovals => 'உங்களுக்காகக் காத்திருப்பவை';

  @override
  String get dashboardKClaims => 'செலவுக் கோரிக்கைகள்';

  @override
  String get dashboardKTimesheets => 'நேரத்தாள்கள்';

  @override
  String get dashboardKLeave => 'விடுப்புக் கோரிக்கைகள்';

  @override
  String get dashboardKNothingWaiting => 'எதுவும் காத்திருக்கவில்லை.';

  @override
  String get dashboardKSalesTrend => 'விற்பனை, கடந்த 30 நாட்கள்';

  @override
  String get dashboardKCashBank => 'ரொக்கம் & வங்கி';

  @override
  String get dashboardKTopCustomers => 'இம்மாத முக்கிய வாடிக்கையாளர்கள்';

  @override
  String get dashboardKTopItems => 'இம்மாதம் அதிகம் விற்றவை';

  @override
  String get dashboardKTopDebtors => 'வசூலிக்க வேண்டிய பெரிய தொகைகள்';

  @override
  String get dashboardKAlerts => 'கவனிக்க வேண்டியவை';

  @override
  String get dashboardKNoAlerts => 'எல்லாம் சரி.';

  @override
  String get dashboardKAsk => 'உதவியாளரிடம் கேளுங்கள்';

  @override
  String dashboardKYesterday(String amount) {
    return 'நேற்று $amount';
  }

  @override
  String get dashboardPosition => 'பண நிலை';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count கணக்குகள்',
      one: '$count கணக்கு',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'வணிக நுண்ணறிவு';

  @override
  String get insightsSubtitle =>
      'எந்தக் காலத்துக்குமான விற்பனை, லாபம், இருப்பு, பணம், கடந்த ஆண்டின் அதே காலத்துடன் ஒப்பிட்டு.';

  @override
  String get insightsNoLastYear => 'இந்த ஆண்டு புதிது';

  @override
  String get insightsPts => 'புள்ளி';

  @override
  String get insightsVsLastYear => 'கடந்த ஆண்டை விட';

  @override
  String get insightsNoSales => 'இந்தக் காலத்தில் விற்பனை இல்லை.';

  @override
  String get insightsHideTable => 'அட்டவணையை மறை';

  @override
  String get insightsShowTable => 'அட்டவணையாகக் காட்டு';

  @override
  String get insightsPresetsThisMonth => 'இந்த மாதம்';

  @override
  String get insightsPresetsLastMonth => 'கடந்த மாதம்';

  @override
  String get insightsPresetsThisFy => 'இந்த நிதியாண்டு';

  @override
  String get insightsPresetsLastFy => 'கடந்த நிதியாண்டு';

  @override
  String get insightsPresetsLast12 => 'கடந்த 12 மாதங்கள்';

  @override
  String get insightsFrom => 'முதல்';

  @override
  String get insightsTo => 'வரை';

  @override
  String get insightsApply => 'காட்டு';

  @override
  String insightsCompared(String from, String to) {
    return 'மாற்றங்கள் $from முதல் $to வரையுடன் ஒப்பிட்டவை.';
  }

  @override
  String get insightsKpiSales => 'விற்பனை';

  @override
  String get insightsKpiPieces => 'விற்ற துண்டுகள்';

  @override
  String get insightsKpiAvgBill => 'சராசரி பில்';

  @override
  String get insightsKpiProfit => 'லாப வரம்பு';

  @override
  String get insightsKpiPurchases => 'கொள்முதல்';

  @override
  String get insightsKpiStock => 'இப்போதைய இருப்பு';

  @override
  String get insightsKpiReceivable => 'வசூலிக்க வேண்டியது';

  @override
  String get insightsKpiPayable => 'செலுத்த வேண்டியது';

  @override
  String get insightsBeforeTax => 'GST க்கு முன், திருப்பங்கள் கழித்து';

  @override
  String insightsBillsCount(String n) {
    return 'பில்கள்: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return 'துண்டுக்கு $v';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n துண்டுகள்';
  }

  @override
  String get insightsOwedToUs => 'வாடிக்கையாளர்களிடமிருந்து';

  @override
  String get insightsWeOwe => 'சப்ளையர்களுக்கு';

  @override
  String get insightsTrend => 'விற்பனைப் போக்கு';

  @override
  String get insightsByMonth => 'மாதவாரி, GST க்கு முன்';

  @override
  String get insightsByDay => 'நாள்வாரி, GST க்கு முன்';

  @override
  String get insightsWeekday => 'பரபரப்பான நாட்கள்';

  @override
  String get insightsWeekdaySub => 'வாரத்தின் நாள் வாரியாக விற்பனை';

  @override
  String get insightsDaysD1 => 'திங்';

  @override
  String get insightsDaysD2 => 'செவ்';

  @override
  String get insightsDaysD3 => 'புத';

  @override
  String get insightsDaysD4 => 'வியா';

  @override
  String get insightsDaysD5 => 'வெள்';

  @override
  String get insightsDaysD6 => 'சனி';

  @override
  String get insightsDaysD7 => 'ஞாயி';

  @override
  String get insightsDesigns => 'சிறந்த டிசைன்கள்';

  @override
  String get insightsByValue => 'விற்பனை மதிப்பின்படி';

  @override
  String get insightsSalesmen => 'சிறந்த விற்பனையாளர்கள்';

  @override
  String get insightsSalesmenSub =>
      'அவர்கள் விற்ற கவுண்டர் வரிகள், விலைப்பட்டியல்கள்';

  @override
  String get insightsNoSalesmen =>
      'இன்னும் எந்த விற்பனையிலும் விற்பனையாளர் இல்லை.';

  @override
  String get insightsCustomers => 'முக்கிய வாடிக்கையாளர்கள்';

  @override
  String get insightsCustomersSub =>
      'விலைப்பட்டியல் வாடிக்கையாளர்கள், திருப்பங்கள் கழித்து';

  @override
  String get insightsBrands => 'பிராண்டுகள்';

  @override
  String get insightsTenders => 'வாடிக்கையாளர்கள் எப்படிச் செலுத்தினர்';

  @override
  String get insightsTendersSub =>
      'GST உடன்: கவுண்டர் கட்டணங்கள், கடன் விலைப்பட்டியல்கள்';

  @override
  String get insightsModesCash => 'ரொக்கம்';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'அட்டை';

  @override
  String get insightsModesCredit => 'கவுண்டர் கடன்';

  @override
  String get insightsModesInvoice => 'விலைப்பட்டியல்கள்';

  @override
  String get insightsAgeing => 'விற்பனை வயது';

  @override
  String get insightsAgeingSub => 'விற்கும் முன் சரக்கு எவ்வளவு காலம் இருந்தது';

  @override
  String get insightsAge => 'வயது';

  @override
  String get insightsPieces => 'துண்டுகள்';

  @override
  String get insightsValue => 'மதிப்பு';

  @override
  String get insightsAgesD030 => '0 முதல் 30 நாள்';

  @override
  String get insightsAgesD3160 => '31 முதல் 60 நாள்';

  @override
  String get insightsAgesD6190 => '61 முதல் 90 நாள்';

  @override
  String get insightsAgesD91180 => '91 முதல் 180 நாள்';

  @override
  String get insightsAgesD181365 => '6 முதல் 12 மாதம்';

  @override
  String get insightsAgesY12 => '1 முதல் 2 ஆண்டு';

  @override
  String get insightsAgesY2plus => '2 ஆண்டுக்கு மேல்';

  @override
  String get insightsErrorsInvalidPeriod =>
      'தொடக்கத் தேதி முடிவுக்குப் பின் உள்ளது.';

  @override
  String insightsOnCost(String v) {
    return 'நிலையான செலவை விட $v அதிகம்';
  }

  @override
  String get calcFrom => 'சப்ளையர் மாநிலம்';

  @override
  String get calcTo => 'விநியோக இடம்';

  @override
  String get calcQty => 'அளவு';

  @override
  String get calcRate => 'விலை (₹)';

  @override
  String get calcGstRate => 'ஜிஎஸ்டி %';

  @override
  String get calcTaxable => 'வரிக்குட்பட்ட மதிப்பு';

  @override
  String get calcCgst => 'CGST';

  @override
  String get calcSgst => 'SGST';

  @override
  String get calcUtgst => 'UTGST';

  @override
  String get calcIgst => 'IGST';

  @override
  String get calcRoundOff => 'முழுமையாக்கல்';

  @override
  String get calcTotal => 'மொத்தம்';

  @override
  String get calcInWords => 'எழுத்தில்';

  @override
  String get calcCess => 'செஸ்';

  @override
  String get companyTitle => 'நிறுவனம் & கிளைகள்';

  @override
  String get companySubtitle =>
      'சட்டப்பூர்வ விவரங்களும் ஒவ்வொரு ஜிஎஸ்டிஐஎன் அல்லது இடத்துக்கும் ஒரு கிளையும்.';

  @override
  String get companyName => 'காட்சிப் பெயர்';

  @override
  String get companyLegalName => 'சட்டப்பூர்வப் பெயர்';

  @override
  String get companyPan => 'பான்';

  @override
  String get companyBooksBegin => 'கணக்குகள் தொடங்கும் தேதி';

  @override
  String get companyBranches => 'கிளைகள்';

  @override
  String get companyAddBranch => 'கிளை சேர்';

  @override
  String get companyBranchName => 'கிளைப் பெயர்';

  @override
  String get companyHeadOffice => 'தலைமை அலுவலகம்';

  @override
  String get companyUnregistered => 'பதிவு செய்யப்படவில்லை';

  @override
  String get companyCity => 'நகரம்';

  @override
  String get companyPincode => 'அஞ்சல் குறியீடு';

  @override
  String get seriesTitle => 'எண் வரிசை';

  @override
  String get seriesSubtitle =>
      'விலைப்பட்டியல்களும் வவுச்சர்களும் எப்படி எண்ணிடப்படுகின்றன. ஜிஎஸ்டி அதிகபட்சம் 16 எழுத்துகளை அனுமதிக்கிறது: எழுத்துகள், எண்கள், - மற்றும் /.';

  @override
  String get seriesDocType => 'ஆவணம்';

  @override
  String get seriesPattern => 'வடிவம்';

  @override
  String get seriesNext => 'அடுத்த எண்';

  @override
  String get seriesFy => 'நிதியாண்டு';

  @override
  String get seriesTokens =>
      'குறிகள்: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = சாதனக் குறியீடு (ஆஃப்லைன் செயலி)';

  @override
  String get seriesTypesSalesInvoice => 'விற்பனை விலைப்பட்டியல்';

  @override
  String get seriesTypesCreditNote => 'கிரெடிட் நோட்';

  @override
  String get seriesTypesDebitNote => 'டெபிட் நோட்';

  @override
  String get seriesTypesPurchaseBill => 'கொள்முதல் பில்';

  @override
  String get seriesTypesReceipt => 'வரவு';

  @override
  String get seriesTypesPayment => 'செலுத்துகை';

  @override
  String get seriesTypesJournal => 'ஜர்னல் வவுச்சர்';

  @override
  String get seriesErrorsSeriesTooLong =>
      'இந்த வடிவத்தின் எண்கள் 16 எழுத்துகளைத் தாண்டும்.';

  @override
  String get seriesErrorsSeriesBadChars =>
      'எழுத்துகள், எண்கள், - மற்றும் / மட்டுமே அனுமதி.';

  @override
  String get seriesErrorsSeriesEmpty => 'வடிவத்தில் SEQ குறி இருக்க வேண்டும்.';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'அடுத்த எண் ஏற்கனவே வழங்கிய எண்களை விடக் குறைவாக இருக்க முடியாது.';

  @override
  String get auditTitle => 'தணிக்கைத் தடம்';

  @override
  String get auditSubtitle =>
      'ஒவ்வொரு மாற்றமும், யார் செய்தார், எப்போது. பதிவுகளைத் திருத்தவோ நீக்கவோ முடியாது.';

  @override
  String get auditWhen => 'எப்போது';

  @override
  String get auditWho => 'யார்';

  @override
  String get auditWhat => 'என்ன';

  @override
  String get auditDetails => 'விவரங்கள்';

  @override
  String get auditLoadMore => 'பழைய பதிவுகளை ஏற்று';

  @override
  String get auditActionsCreate => 'உருவாக்கினார்';

  @override
  String get auditActionsUpdate => 'மாற்றினார்';

  @override
  String get auditActionsLogin => 'உள்நுழைந்தார்';

  @override
  String get auditActionsDelete => 'நீக்கினார்';

  @override
  String get auditActionsCancel => 'ரத்துசெய்தார்';

  @override
  String get auditVerify => 'தணிக்கைத் தடத்தைச் சரிபார்';

  @override
  String get auditVerifying => 'சரிபார்க்கிறது...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other:
          'அனைத்து $n பதிவுகளும் அப்படியே உள்ளன. எதுவும் மாற்றப்படவோ நீக்கப்படவோ இல்லை.',
      one:
          'அனைத்து $n பதிவும் அப்படியே உள்ளது. எதுவும் மாற்றப்படவோ நீக்கப்படவோ இல்லை.',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'பதிவு எண் $seq முந்தைய பதிவுகளுடன் பொருந்தவில்லை ($reason). தணிக்கைத் தடம் மாற்றப்பட்டுள்ளது அல்லது சேதமடைந்துள்ளது. ஒரு நகலை வைத்துக்கொண்டு ஆதரவைத் தொடர்பு கொள்ளுங்கள்.';
  }

  @override
  String get auditReasonGap => 'ஒரு பதிவு காணவில்லை';

  @override
  String get auditReasonLink => 'வரிசை உடைந்துள்ளது';

  @override
  String get auditReasonContent => 'பதிவு மாற்றப்பட்டுள்ளது';

  @override
  String get auditVerifyFailed => 'சரிபார்க்க முடியவில்லை. மீண்டும் முயலவும்.';

  @override
  String get backupTitle => 'காப்புப்பிரதி மற்றும் ஏற்றுமதி';

  @override
  String get backupSubtitle =>
      'உங்கள் தரவு உங்களுடையது. எப்போது வேண்டுமானாலும் முழுவதையும் பதிவிறக்குங்கள், Varchasv இல்லாமலும் திறக்கும் கோப்புகளில்.';

  @override
  String get backupDownload => 'அனைத்தையும் பதிவிறக்கு (ZIP)';

  @override
  String get backupWhat => 'உங்களுக்கு என்ன கிடைக்கும்';

  @override
  String get backupItem1 =>
      'ஒவ்வொரு அட்டவணையும் Excel க்கான CSV கோப்பாகவும், துல்லியமான மதிப்புகளுடன் JSON கோப்பாகவும்.';

  @override
  String get backupItem2 => 'நீங்கள் பதிவேற்றிய ஒவ்வொரு ஆவணமும் அப்படியே.';

  @override
  String get backupItem3 =>
      'ஒவ்வொரு அட்டவணையையும் விளக்கும் README, மற்றும் எதுவும் மாறவில்லை என்று பின்னர் காட்ட செக்சம் பட்டியல்.';

  @override
  String get backupLeftOut =>
      'கடவுச்சொற்கள், உள்நுழைவு டோக்கன்கள், வரி-போர்ட்டல் அமர்வுகள் சேர்க்கப்படவில்லை.';

  @override
  String get backupKeep =>
      'கோப்பைப் பாதுகாப்பான இடத்தில் வையுங்கள். அதில் உங்கள் வாடிக்கையாளர்கள், சப்ளையர்கள், விலைகள், கணக்குகள் உள்ளன.';

  @override
  String get backupSlow => 'பெரிய வணிகத்திற்கு தயாராக ஒரு நிமிடம் ஆகலாம்.';

  @override
  String get backupAuditLink =>
      'உங்கள் தணிக்கைத் தடம் மாறாமல் உள்ளதா எனச் சரிபாருங்கள்';

  @override
  String get roadmapAccounts => 'கணக்கியல் & ஜிஎஸ்டி தாக்கல்';

  @override
  String get roadmapInventory => 'சரக்கு & கொள்முதல்';

  @override
  String get roadmapSales => 'விற்பனை, இ-இன்வாய்ஸ் & இ-வே பில்';

  @override
  String get roadmapOffline =>
      'Windows, Mac, Linux, Android & iOS-க்கான ஆஃப்லைன் செயலி';

  @override
  String get roadmapPayroll => 'மனிதவளம் & சம்பளம்';

  @override
  String get switcherTitle => 'உங்கள் வணிகங்கள்';

  @override
  String get switcherAddBusiness => 'வணிகம் சேர்';

  @override
  String get switcherCreate => 'வணிகத்தை உருவாக்கு';

  @override
  String get teamTitle => 'குழு & பங்குகள்';

  @override
  String get teamSubtitle =>
      'இந்த வணிகத்தை யார் பயன்படுத்தலாம், ஒவ்வொருவரும் என்ன செய்யலாம்.';

  @override
  String get teamMembers => 'உறுப்பினர்கள்';

  @override
  String get teamInvite => 'அழை';

  @override
  String get teamInviteTitle => 'ஒருவரை அழைக்கவும்';

  @override
  String get teamEmail => 'மின்னஞ்சல்';

  @override
  String get teamRole => 'பங்கு';

  @override
  String get teamStatus => 'நிலை';

  @override
  String get teamActive => 'செயலில்';

  @override
  String get teamSuspended => 'இடைநிறுத்தம்';

  @override
  String get teamYou => 'நீங்கள்';

  @override
  String get teamPendingInvites => 'நிலுவையிலுள்ள அழைப்புகள்';

  @override
  String get teamExpires => 'காலாவதி';

  @override
  String get teamRevoke => 'திரும்பப் பெறு';

  @override
  String get teamSuspend => 'இடைநிறுத்து';

  @override
  String get teamReactivate => 'மீண்டும் செயல்படுத்து';

  @override
  String get teamRemove => 'நீக்கு';

  @override
  String get teamInviteLink => 'அழைப்பு இணைப்பு';

  @override
  String get teamInviteLinkHint =>
      'மின்னஞ்சல் அனுப்பிவிட்டோம். WhatsApp-இலும் பகிரலாம்: ஒருமுறை மட்டுமே செயல்படும், 7 நாட்களில் காலாவதியாகும்.';

  @override
  String get teamRoles => 'பங்குகள்';

  @override
  String get teamNewRole => 'புதிய பங்கு';

  @override
  String get teamRoleName => 'பங்கின் பெயர்';

  @override
  String get teamPermissions => 'அனுமதிகள்';

  @override
  String get teamSystemRole => 'உள்ளமைந்தது';

  @override
  String teamMembersCount(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count உறுப்பினர்கள்',
      one: '$count உறுப்பினர்',
    );
    return '$_temp0';
  }

  @override
  String get teamModulesCompany => 'நிறுவனம்';

  @override
  String get teamModulesUsers => 'குழு';

  @override
  String get teamModulesAccounts => 'கணக்குகள்';

  @override
  String get teamModulesSales => 'விற்பனை';

  @override
  String get teamModulesPurchase => 'கொள்முதல்';

  @override
  String get teamModulesInventory => 'சரக்கு';

  @override
  String get teamModulesGst => 'ஜிஎஸ்டி';

  @override
  String get teamModulesHr => 'மனிதவளம்';

  @override
  String get teamModulesPayroll => 'சம்பளப் பட்டியல்';

  @override
  String get teamModulesReports => 'அறிக்கைகள்';

  @override
  String get teamModulesSettings => 'அமைப்புகள்';

  @override
  String get teamModulesBanking => 'வங்கி';

  @override
  String get teamModulesAssets => 'நிலைச் சொத்துகள்';

  @override
  String get teamModulesExpenses => 'செலவுகள்';

  @override
  String get teamModulesProjects => 'திட்டங்கள்';

  @override
  String get teamModulesCrm => 'சிஆர்எம்';

  @override
  String get teamPermView => 'பார்';

  @override
  String get teamPermCreate => 'உருவாக்கு';

  @override
  String get teamPermEdit => 'திருத்து';

  @override
  String get teamPermSubmit => 'சமர்ப்பி';

  @override
  String get teamPermCancel => 'ரத்துசெய்';

  @override
  String get teamPermDelete => 'நீக்கு';

  @override
  String get teamPermExport => 'ஏற்றுமதி';

  @override
  String get teamPermApprove => 'ஒப்புதல்';

  @override
  String get teamErrorsCannotChangeSelf =>
      'உங்கள் சொந்த அணுகலை மாற்ற முடியாது.';

  @override
  String get teamErrorsLastOwner =>
      'வணிகத்தில் குறைந்தது ஒரு செயலில் உள்ள உரிமையாளர் வேண்டும்.';

  @override
  String get teamErrorsOwnerOnly => 'உரிமையாளர் மட்டுமே இதைச் செய்யலாம்.';

  @override
  String get teamErrorsAlreadyMember => 'இவர் ஏற்கனவே உறுப்பினர்.';

  @override
  String get teamErrorsPermissionEscalation =>
      'உங்களிடம் இல்லாத அனுமதியை வழங்க முடியாது.';

  @override
  String get teamErrorsSystemRole => 'உள்ளமைந்த பங்குகளை மாற்ற முடியாது.';

  @override
  String get teamErrorsRoleInUse =>
      'இந்தப் பங்கை நீக்கும் முன் உறுப்பினர்களை வேறு பங்குக்கு மாற்றவும்.';

  @override
  String get teamErrorsUnknownRole => 'அந்தப் பங்கு இனி இல்லை.';

  @override
  String get teamSpecialTitle => 'சிறப்பு உரிமைகள்';

  @override
  String get teamSpecialHelp =>
      'மேலுள்ள அட்டவணைக்கு அப்பாற்பட்ட தனித்தனி உரிமைகள். ஒருவர் பில் போடலாம், ஆனால் பின்தேதி இடவோ செலவுக்குக் கீழே விற்கவோ முடியாது.';

  @override
  String get teamSpecialChangeDate => 'ஆவணங்களுக்குப் பின்தேதி இடுதல்';

  @override
  String get teamSpecialFutureDate => 'ஆவணங்களுக்கு முன்தேதி இடுதல்';

  @override
  String get teamSpecialSellBelowCost => 'செலவுக்குக் கீழே விற்பனை';

  @override
  String get teamSpecialSeeAgentCommission => 'முகவர் கமிஷனைப் பார்த்தல்';

  @override
  String get teamSpecialImportData => 'தரவை இறக்குமதி செய்தல்';

  @override
  String inviteTitle(String business) {
    return '$business-இல் சேருங்கள்';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$email $role ஆக அழைக்கப்பட்டுள்ளார்.';
  }

  @override
  String get inviteCreateAccount => 'ஏற்க உங்கள் கணக்கை உருவாக்கவும்.';

  @override
  String get inviteSignInToAccept =>
      'ஏற்க உங்கள் Varchasv கடவுச்சொல்லை உள்ளிடவும்.';

  @override
  String get inviteAccept => 'அழைப்பை ஏற்கவும்';

  @override
  String get inviteInvalid =>
      'இந்த அழைப்பு இணைப்பு செல்லாதது, பயன்படுத்தப்பட்டது அல்லது காலாவதியானது. புதியதைக் கேளுங்கள்.';

  @override
  String get accountsTitle => 'கணக்குப் பட்டியல்';

  @override
  String get accountsSubtitle =>
      'உங்கள் கணக்காளர் எதிர்பார்க்கும்படி தொகுக்கப்பட்ட பேரேடுகள். வாடிக்கையாளர்கள் Sundry Debtors கீழ், சப்ளையர்கள் Sundry Creditors கீழ்.';

  @override
  String get accountsNewAccount => 'புதிய கணக்கு';

  @override
  String get accountsName => 'கணக்குப் பெயர்';

  @override
  String get accountsNameHi => 'இந்தியில் பெயர்';

  @override
  String get accountsGroup => 'குழு';

  @override
  String get accountsBalance => 'இருப்பு';

  @override
  String get accountsOpeningBalance => 'தொடக்க இருப்பு';

  @override
  String get accountsOpeningHint =>
      'பற்றுக்கு நேர்மறை (ரொக்கம், வங்கி, கடனாளிகள்); வரவுக்கு எதிர்மறை (மூலதனம், கடன்கள், கடன்கொடுத்தோர்).';

  @override
  String get accountsCode => 'குறியீடு';

  @override
  String get accountsParty => 'தரப்பு விவரங்கள்';

  @override
  String get accountsPhone => 'தொலைபேசி';

  @override
  String get accountsIfsc => 'IFSC';

  @override
  String get accountsAccountNumber => 'கணக்கு எண்';

  @override
  String get accountsAllGroups => 'அனைத்துக் குழுக்களும்';

  @override
  String get accountsEmpty => 'பொருந்தும் கணக்கு இல்லை.';

  @override
  String get accountsErrorsAccountNameTaken =>
      'இந்தப் பெயரில் ஏற்கனவே கணக்கு உள்ளது.';

  @override
  String get accountsErrorsUnknownGroup => 'குழுவைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get accountsErrorsInvalidIfsc => 'IFSC இப்படி இருக்கும்: HDFC0001234.';

  @override
  String get accountsErrorsInvalidPan => 'பான் இப்படி இருக்கும்: ABCDE1234F.';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'உள்ளமைந்த கணக்குகள் தங்கள் குழுவிலேயே இருக்கும்.';

  @override
  String get accountsErrorsNotAnAgent =>
      'தரகர் அல்லது முகவர் எனக் குறிக்கப்பட்ட கணக்கைத் தேர்வுசெய்.';

  @override
  String get accountsErrorsUnknownSalesman =>
      'உங்கள் ஊழியர்களில் இருந்து விற்பனையாளரைத் தேர்வுசெய்.';

  @override
  String get accountsCreditLimit => 'கடன் வரம்பு (₹)';

  @override
  String get accountsCreditDays => 'கடன் நாட்கள்';

  @override
  String get accountsCreditControl => 'வரம்பு மீறினால் அல்லது நிலுவை இருந்தால்';

  @override
  String get accountsCreditControlHint =>
      'தடுத்தால் உரிமையாளர் அல்லது நிர்வாகி அனுமதிக்கும் வரை புதிய விற்பனை நிற்கும்.';

  @override
  String get accountsCreditWarn => 'எச்சரித்து அனுமதி';

  @override
  String get accountsCreditBlock => 'தடு';

  @override
  String get accountsBlockOverdueDays => 'அனுமதிக்கப்பட்ட நிலுவை நாட்கள்';

  @override
  String get accountsInterestRate => 'நிலுவை மீதான வட்டி (ஆண்டுக்கு %)';

  @override
  String get vouchersTitle => 'வவுச்சர்கள்';

  @override
  String get vouchersSubtitle =>
      'உங்கள் கணக்குகளின் ஒவ்வொரு பதிவும். பதிந்த வவுச்சர்கள் ஒருபோதும் திருத்தப்படாது: ரத்துசெய்து மீண்டும் பதியவும்.';

  @override
  String get vouchersNew => 'புதிய வவுச்சர்';

  @override
  String get vouchersTypesJournal => 'ஜர்னல்';

  @override
  String get vouchersTypesPayment => 'செலுத்துகை';

  @override
  String get vouchersTypesReceipt => 'வரவு';

  @override
  String get vouchersTypesContra => 'கான்ட்ரா';

  @override
  String get vouchersTypesPurchase => 'கொள்முதல்';

  @override
  String get vouchersTypesDebitNote => 'டெபிட் நோட்';

  @override
  String get vouchersTypesSales => 'விற்பனை';

  @override
  String get vouchersTypesCreditNote => 'கிரெடிட் நோட்';

  @override
  String get vouchersTypesGatewaySettlement => 'கேட்வே தீர்வு';

  @override
  String get vouchersTypesAssetPurchase => 'சொத்துக் கொள்முதல்';

  @override
  String get vouchersTypesDepreciation => 'தேய்மானம்';

  @override
  String get vouchersTypesAssetDisposal => 'சொத்து விற்பனை';

  @override
  String get vouchersTypesExpenseClaim => 'செலவுக் கோரிக்கை';

  @override
  String get vouchersTypesBrokerage => 'தரகு பில்';

  @override
  String get vouchersTypeHintsJournal =>
      'சரிசெய்தல், கடன் விற்பனை மற்றும் கொள்முதல், ஒதுக்கீடுகள்.';

  @override
  String get vouchersTypeHintsPayment =>
      'ரொக்கம் அல்லது வங்கியிலிருந்து வெளியேறும் பணம்.';

  @override
  String get vouchersTypeHintsReceipt => 'ரொக்கம் அல்லது வங்கிக்கு வரும் பணம்.';

  @override
  String get vouchersTypeHintsContra =>
      'ரொக்கம் மற்றும் வங்கிக் கணக்குகளுக்கு இடையில் மட்டும்.';

  @override
  String get vouchersNumber => 'எண்';

  @override
  String get vouchersReference => 'குறிப்பு';

  @override
  String get vouchersAccount => 'கணக்கு';

  @override
  String get vouchersAccounts => 'கணக்குகள்';

  @override
  String get vouchersAmount => 'தொகை';

  @override
  String get vouchersAddLine => 'வரி சேர்';

  @override
  String get vouchersDifference => 'வேறுபாடு';

  @override
  String get vouchersPost => 'வவுச்சரைப் பதி';

  @override
  String get vouchersCancel => 'வவுச்சரை ரத்துசெய்';

  @override
  String get vouchersCancelReason => 'ரத்துசெய்யும் காரணம்';

  @override
  String get vouchersCancelled => 'ரத்துசெய்யப்பட்டது';

  @override
  String get vouchersPosted => 'பதியப்பட்டது';

  @override
  String get vouchersStatus => 'நிலை';

  @override
  String get vouchersEmpty => 'இந்தக் காலத்தில் வவுச்சர் இல்லை.';

  @override
  String get vouchersChooseAccount => 'கணக்கைத் தேர்ந்தெடு…';

  @override
  String get vouchersErrorsUnbalanced =>
      'பற்றும் வரவும் சமமாக இருக்க வேண்டும்.';

  @override
  String get vouchersErrorsTooFewLines =>
      'வவுச்சருக்குக் குறைந்தது இரண்டு வரிகள் தேவை.';

  @override
  String get vouchersErrorsZeroLine => 'ஒவ்வொரு வரிக்கும் தொகை தேவை.';

  @override
  String get vouchersErrorsBothSides =>
      'ஒரு வரி பற்று அல்லது வரவாக இருக்கலாம், இரண்டுமல்ல.';

  @override
  String get vouchersErrorsNegativeAmount =>
      'தொகை எதிர்மறையாக இருக்க முடியாது.';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'செலுத்துகையில் ரொக்கம் அல்லது வங்கிக் கணக்கு வரவு வைக்கப்பட வேண்டும்.';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'வரவில் ரொக்கம் அல்லது வங்கிக் கணக்கு பற்று வைக்கப்பட வேண்டும்.';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'கான்ட்ரா வவுச்சரில் ரொக்கம் மற்றும் வங்கிக் கணக்குகள் மட்டுமே.';

  @override
  String get vouchersErrorsPeriodLocked =>
      'இந்தத் தேதி பூட்டப்பட்ட காலத்தில் உள்ளது.';

  @override
  String get vouchersErrorsPeriodClosed => 'இந்த நிதியாண்டு மூடப்பட்டுள்ளது.';

  @override
  String get vouchersErrorsBeforeBooksBegin =>
      'இந்தத் தேதி கணக்குகள் தொடங்கும் முன்னானது.';

  @override
  String get vouchersErrorsAlreadyCancelled =>
      'இந்த வவுச்சர் ஏற்கனவே ரத்துசெய்யப்பட்டது.';

  @override
  String get vouchersErrorsUnknownAccount => 'ஒரு கணக்கு இனி இல்லை.';

  @override
  String get vouchersErrorsAccountArchived => 'ஒரு கணக்கு காப்பகத்தில் உள்ளது.';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account பூஜ்யத்துக்குக் கீழே செல்லும்: $amount. இருந்தாலும் பதியலாம்.';
  }

  @override
  String get promosTitle => 'வவுச்சர்கள் மற்றும் கூப்பன்கள்';

  @override
  String get promosSubtitle =>
      'கவுண்டருக்கான பரிசு வவுச்சர்கள், கூப்பன் குறியீடுகள், தள்ளுபடி அட்டைகள், அதிர்ஷ்டக் குலுக்கல்.';

  @override
  String get promosStatusesActive => 'செயலில்';

  @override
  String get promosStatusesUsed => 'முழுவதும் பயன்படுத்தப்பட்டது';

  @override
  String get promosStatusesExpired => 'காலாவதியானது';

  @override
  String get promosGiftTitle => 'பரிசு வவுச்சர்கள்';

  @override
  String promosGiftHint(String amount) {
    return 'செயலில் உள்ள வவுச்சர்களில் இன்னும் $amount நிலுவை. GST வவுச்சர் விற்கும்போது அல்ல, பொருள் வாங்கும்போது விதிக்கப்படும்.';
  }

  @override
  String get promosGiftCode => 'குறியீடு';

  @override
  String get promosGiftFor => 'யாருக்கு';

  @override
  String get promosGiftValue => 'மதிப்பு (₹)';

  @override
  String get promosGiftBalance => 'இருப்பு';

  @override
  String get promosGiftExpires => 'காலாவதி தேதி';

  @override
  String get promosGiftEmpty => 'இன்னும் பரிசு வவுச்சர்கள் விற்கப்படவில்லை.';

  @override
  String get promosGiftCount => 'எத்தனை';

  @override
  String get promosGiftPaidBy => 'செலுத்திய முறை';

  @override
  String get promosGiftSell => 'வவுச்சர்களை விற்கவும்';

  @override
  String get promosGiftIssued => 'விற்கப்பட்டது. குறியீடுகள்:';

  @override
  String get promosGiftExpire => 'காலாவதியான வவுச்சர்களைத் திரும்ப எழுது';

  @override
  String get promosGiftExpireHint =>
      'தேதி கடந்த வவுச்சர்களின் மீதமுள்ள தொகை வருமானமாகும்.';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$n வவுச்சர்கள் காலாவதி, $amount திரும்ப எழுதப்பட்டது.';
  }

  @override
  String get promosCouponsTitle => 'கூப்பன் குறியீடுகள்';

  @override
  String get promosCouponsNew => 'புதிய கூப்பன்';

  @override
  String get promosCouponsCode => 'குறியீடு';

  @override
  String get promosCouponsOff => 'தள்ளுபடி';

  @override
  String get promosCouponsValid => 'செல்லுபடி';

  @override
  String get promosCouponsUsed => 'பயன்பாடு';

  @override
  String get promosCouponsEmpty => 'இன்னும் கூப்பன்கள் இல்லை.';

  @override
  String promosCouponsUpTo(String amount) {
    return '$amount வரை';
  }

  @override
  String get promosCouponsMaxDiscount => 'அதிகபட்ச தள்ளுபடி (₹)';

  @override
  String get promosCouponsMinBill => 'குறைந்தபட்ச பில் (₹)';

  @override
  String get promosCouponsMaxUses => 'எத்தனை முறை';

  @override
  String get promosCouponsMaxUsesHint => 'காலி = வரம்பு இல்லை';

  @override
  String get promosCardsTitle => 'தள்ளுபடி அட்டைகள்';

  @override
  String get promosCardsNew => 'புதிய அட்டை';

  @override
  String get promosCardsNumber => 'அட்டை எண்';

  @override
  String get promosCardsHolder => 'உரிமையாளர்';

  @override
  String get promosCardsValidUntil => 'செல்லுபடி வரை';

  @override
  String get promosCardsEmpty => 'இன்னும் தள்ளுபடி அட்டைகள் இல்லை.';

  @override
  String get promosDrawTitle => 'அதிர்ஷ்டக் குலுக்கல்';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from முதல் $to · $entries பதிவுகள்';
  }

  @override
  String get promosDrawEmpty => 'இன்னும் குலுக்கல் இல்லை.';

  @override
  String get promosDrawWinners => 'வெற்றியாளர்கள்';

  @override
  String get promosDrawHint =>
      'இந்தக் காலத்தில் வாடிக்கையாளர் மொபைல் உள்ள ஒவ்வொரு பில்லும் ஒரு பதிவு; ஒவ்வொரு மொபைலும் ஒருமுறைதான் வெல்லும்.';

  @override
  String get promosDrawRun => 'வெற்றியாளர்களைத் தேர்வுசெய்';

  @override
  String get promosStatus => 'நிலை';

  @override
  String get promosErrorsInvalidAmount => 'ரூபாயில் தொகையை உள்ளிடவும்.';

  @override
  String get promosErrorsInvalidPercent =>
      '0 முதல் 100 வரை சதவீதம் உள்ளிடவும்.';

  @override
  String get promosErrorsCodeTaken =>
      'இந்தக் குறியீடு ஏற்கனவே பயன்பாட்டில் உள்ளது.';

  @override
  String get promosErrorsExpiryBeforeIssue =>
      'காலாவதி தேதி இன்றைக்குப் பிறகு இருக்க வேண்டும்.';

  @override
  String get promosErrorsEndsBeforeStart =>
      'முடிவுத் தேதி தொடக்கத் தேதிக்கு முன் உள்ளது.';

  @override
  String get promosErrorsNoEntries =>
      'அந்தக் காலத்தில் வாடிக்கையாளர் மொபைல் உள்ள பில் இல்லை.';

  @override
  String get promosErrorsInvalidCode =>
      'எழுத்துகள், எண்கள், இணைப்புக்குறி மட்டும்.';

  @override
  String get promosErrorsInvalidPhone => '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.';

  @override
  String get posReturnsTitle => 'திருப்பி அளித்தல் மற்றும் மாற்றம்';

  @override
  String get posReturnsSubtitle =>
      'பில்லுக்கு எதிராகப் பொருளைத் திரும்பப் பெறுங்கள். அளவு அல்லது நிற மாற்றத்துக்கு ஸ்டோர் கிரெடிட் கொடுத்து புதியதை அதனால் பில் செய்யுங்கள்.';

  @override
  String get posReturnsReturn => 'திருப்பு';

  @override
  String posReturnsSaved(String number) {
    return 'திருப்பம் $number சேமிக்கப்பட்டது';
  }

  @override
  String get posReturnsCreditCode => 'ஸ்டோர் கிரெடிட் குறியீடு:';

  @override
  String get posReturnsExchangeNow => 'இப்போதே மாற்றத்தைப் பில் செய்';

  @override
  String posReturnsRefunded(String mode) {
    return '$mode மூலம் திருப்பிக் கொடுக்கப்பட்டது.';
  }

  @override
  String posReturnsAgainst(String number) {
    return '$number க்கு எதிரான திருப்பம்';
  }

  @override
  String get posReturnsCanReturn => 'திருப்ப முடியும்';

  @override
  String get posReturnsQty => 'திரும்பும் அளவு';

  @override
  String get posReturnsReason => 'காரணம்';

  @override
  String get posReturnsCondition => 'நிலை';

  @override
  String get posReturnsCounter => 'கவுண்டர்';

  @override
  String get posReturnsNoShift =>
      'முதலில் ஒரு கவுண்டரில் ஷிஃப்ட் தொடங்குங்கள்.';

  @override
  String get posReturnsGive => 'எப்படித் திருப்பித் தருவது';

  @override
  String get posReturnsVoucherHint =>
      'இப்போதோ பிறகோ மாற்றத்துக்குச் செலுத்த வவுச்சர் குறியீடு';

  @override
  String get posReturnsStoreCredit => 'ஸ்டோர் கிரெடிட் (மாற்றம்)';

  @override
  String posReturnsAbout(String amount) {
    return 'சுமார் $amount';
  }

  @override
  String get posReturnsTake => 'திரும்பப் பெறு';

  @override
  String get posReturnsNumber => 'திருப்பம்';

  @override
  String get posReturnsBill => 'பில்';

  @override
  String get posReturnsWhat => 'என்ன திரும்பியது';

  @override
  String get posReturnsNone => 'இந்த நாளில் திருப்பம் இல்லை.';

  @override
  String get posReturnsByReason => 'காரணம் வாரியாக';

  @override
  String get posReturnsByCondition => 'நிலை வாரியாக';

  @override
  String get posReturnsBillNumber => 'பில் எண்';

  @override
  String get posReturnsFind => 'பில்லைத் தேடு';

  @override
  String get posReturnsNotFound => 'அந்த எண்ணில் பில் இல்லை.';

  @override
  String get posReturnsDate => 'தேதி';

  @override
  String get posReturnsShow => 'காட்டு';

  @override
  String get posReturnsReasonsSize => 'அளவு';

  @override
  String get posReturnsReasonsColour => 'நிறம்';

  @override
  String get posReturnsReasonsDefect => 'உற்பத்திக் குறைபாடு';

  @override
  String get posReturnsReasonsDamaged => 'சேதமடைந்தது';

  @override
  String get posReturnsReasonsNotLiked => 'பிடிக்கவில்லை';

  @override
  String get posReturnsReasonsOther => 'மற்றவை';

  @override
  String get posReturnsGradesA => 'A: புதியது போல, அலமாரிக்கு';

  @override
  String get posReturnsGradesB => 'B: சிறு குறை, இரண்டாம் தரமாக விற்க';

  @override
  String get posReturnsGradesC => 'C: விற்க முடியாது';

  @override
  String get posReturnsErrorsBillVoid =>
      'இந்தப் பில் ரத்து செய்யப்பட்டது; இதற்கு திருப்பம் இல்லை.';

  @override
  String get posReturnsErrorsOverReturn =>
      'அந்த வரியில் மீதமுள்ளதை விட அதிகம்.';

  @override
  String get posReturnsErrorsSessionNotOpen =>
      'முதலில் இந்தக் கவுண்டரில் ஷிஃப்ட் தொடங்குங்கள்.';

  @override
  String get posReturnsErrorsDuplicateLine => 'ஒரு வரி இருமுறை உள்ளது.';

  @override
  String get alterationsTitle => 'ஆல்டரேஷன் மற்றும் பழுதுபார்ப்பு';

  @override
  String get alterationsSubtitle =>
      'பொருத்தத்துக்கு ஆடைகளைப் பெற்று, கைவினைஞரிடம் கொடுத்து, உறுதியளித்த நாளில் திருப்பிக் கொடுங்கள்.';

  @override
  String get alterationsNewSlip => 'புதிய ஆல்டரேஷன் சீட்டு';

  @override
  String get alterationsSetUpFirst =>
      'சீட்டுகள் எடுக்க முதலில் கீழே ஆல்டரேஷன் வகைகளைச் சேர்க்கவும்.';

  @override
  String get alterationsStatusReceived => 'பெறப்பட்டது';

  @override
  String get alterationsStatusWithKarigar => 'கைவினைஞரிடம்';

  @override
  String get alterationsStatusReady => 'வாடிக்கையாளருக்குத் தயார்';

  @override
  String get alterationsNone => 'இங்கு எதுவும் இல்லை.';

  @override
  String alterationsLabour(String from, String to) {
    return 'கைவினைஞர் கூலி, $from முதல் $to';
  }

  @override
  String get alterationsKarigar => 'கைவினைஞர்';

  @override
  String get alterationsKarigars => 'கைவினைஞர்கள்';

  @override
  String get alterationsKarigarHint =>
      'வெளி கைவினைஞர்களுக்கு தனி கணக்கு; வேலை திரும்பும்போது கூலி வரவு வைக்கப்படும். உள் கைவினைஞர்கள் சம்பளம் பெறுவர்.';

  @override
  String get alterationsNoKarigars => 'இன்னும் கைவினைஞர்கள் இல்லை.';

  @override
  String get alterationsOutside => 'வெளி கைவினைஞர்';

  @override
  String get alterationsInHouse => 'உள்ளக';

  @override
  String get alterationsPhone => 'மொபைல்';

  @override
  String get alterationsSlips => 'சீட்டுகள்';

  @override
  String get alterationsPieces => 'துண்டுகள்';

  @override
  String get alterationsLabourCol => 'கூலி';

  @override
  String get alterationsNoLabour =>
      'இந்த மாதம் கைவினைஞர்களிடமிருந்து எதுவும் வரவில்லை.';

  @override
  String get alterationsOverdue => 'தாமதம்';

  @override
  String alterationsDue(String date) {
    return '$date க்குள்';
  }

  @override
  String alterationsTrial(String date) {
    return 'சோதனை $date';
  }

  @override
  String alterationsWith(String name) {
    return '$name இடம்';
  }

  @override
  String get alterationsFree => 'இலவசம்';

  @override
  String get alterationsGive => 'கொடு';

  @override
  String get alterationsBack => 'கைவினைஞரிடமிருந்து திரும்பியது';

  @override
  String get alterationsDeliver => 'ஒப்படை';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'ஒப்படைத்து $amount வசூலி';
  }

  @override
  String get alterationsCancelSlip => 'சீட்டை ரத்து செய்';

  @override
  String get alterationsAgainstBill => 'பில்லுக்கு எதிராக';

  @override
  String get alterationsTrialOn => 'சோதனை தேதி';

  @override
  String get alterationsDeliveryOn => 'ஒப்படைப்பு தேதி';

  @override
  String get alterationsComplimentary => 'வாங்கியதுடன் இலவசம்';

  @override
  String get alterationsGarment => 'ஆடை';

  @override
  String get alterationsWork => 'வேலை';

  @override
  String get alterationsNotes => 'அளவுகள் மற்றும் குறிப்புகள்';

  @override
  String get alterationsAddWork => 'வேலையைச் சேர்';

  @override
  String get alterationsTakeIn => 'சீட்டு போடு';

  @override
  String alterationsCharge(String amount) {
    return 'கட்டணம் $amount';
  }

  @override
  String get alterationsTypes => 'செய்யப்படும் ஆல்டரேஷன்கள், பழுதுகள்';

  @override
  String get alterationsCustomerCharge => 'வாடிக்கையாளர் செலுத்துவது';

  @override
  String get alterationsKindsAlteration => 'ஆல்டரேஷன்';

  @override
  String get alterationsKindsRepair => 'பழுதுபார்ப்பு';

  @override
  String get alterationsErrorsNameTaken =>
      'இந்தப் பெயர் ஏற்கனவே பயன்பாட்டில் உள்ளது.';

  @override
  String get alterationsErrorsNotReceived =>
      'இந்தச் சீட்டு ஏற்கனவே கைவினைஞரிடம் சென்றுவிட்டது.';

  @override
  String get alterationsErrorsNotWithKarigar =>
      'இந்தச் சீட்டு எந்தக் கைவினைஞரிடமும் இல்லை.';

  @override
  String get alterationsErrorsNotReady => 'இந்தச் சீட்டு இன்னும் தயாராகவில்லை.';

  @override
  String get alterationsErrorsTerminalRequired =>
      'கட்டணம் வசூலிக்க கவுண்டரைத் தேர்வுசெய்யவும்.';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'ஒப்படைப்பு தேதி சீட்டின் தேதிக்கு முன் உள்ளது.';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'சோதனை சீட்டு தேதிக்கும் ஒப்படைப்புக்கும் இடையில் இருக்க வேண்டும்.';

  @override
  String get alterationsErrorsCannotCancel =>
      'ஒப்படைத்த அல்லது ரத்தான சீட்டை ரத்து செய்ய முடியாது.';

  @override
  String get tailoringTitle => 'ஆர்டர் தையல்';

  @override
  String get tailoringSubtitle =>
      'அளவுகள், முன்பணம், ஒவ்வொரு வேலையும் கைவினைஞர் மூலம், ஒப்படைப்பில் தையல் பில்.';

  @override
  String get tailoringNewOrder => 'புதிய தையல் ஆர்டர்';

  @override
  String get tailoringTakeMeasurements => 'அளவு எடு';

  @override
  String get tailoringStatusBooked => 'பதிவானது';

  @override
  String get tailoringStatusInWork => 'வேலையில்';

  @override
  String get tailoringStatusReady => 'ஒப்படைப்புக்குத் தயார்';

  @override
  String get tailoringTrialDue => 'சோதனை நிலுவை';

  @override
  String get tailoringToday => 'இன்று ஒப்படைப்பு';

  @override
  String get tailoringMarkDone => 'முடிந்தது';

  @override
  String get tailoringMarkReady => 'தயார் எனக் குறி';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'மொத்தம் $total, முன்பணம் $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'ஒப்படைத்து $amount வசூலி';
  }

  @override
  String get tailoringCancelOrder => 'ஆர்டரை ரத்து செய்';

  @override
  String tailoringCardsFound(String n) {
    return '$n அளவு அட்டைகள் உள்ளன';
  }

  @override
  String get tailoringStitchingPrice => 'தையல் விலை';

  @override
  String get tailoringMeasurements => 'அளவு அட்டை';

  @override
  String get tailoringNoCard => 'அட்டை இல்லை';

  @override
  String get tailoringFabric => 'துணி';

  @override
  String get tailoringOwnFabric => 'வாடிக்கையாளரின் துணி';

  @override
  String get tailoringMetres => 'மீட்டர்';

  @override
  String get tailoringStyleNotes =>
      'ஸ்டைல் குறிப்புகள் (காலர், பாக்கெட், பொருத்தம்...)';

  @override
  String get tailoringAddGarment => 'ஆடையைச் சேர்';

  @override
  String get tailoringAdvance => 'முன்பணம் (₹)';

  @override
  String get tailoringAdvanceHint =>
      'இந்த ஆர்டருக்கு வரவாக இருக்கும்; ஒப்படைப்பில் பில்லில் கழிக்கப்படும்';

  @override
  String get tailoringBook => 'ஆர்டர் பதிவுசெய்';

  @override
  String tailoringEstimate(String amount) {
    return 'மதிப்பீடு $amount';
  }

  @override
  String get tailoringInches =>
      'அளவுகள் அங்குலத்தில். தேவையில்லாததை காலியாக விடுங்கள்.';

  @override
  String get tailoringOtherMeasure => 'பிற அளவு';

  @override
  String get tailoringValue => 'மதிப்பு';

  @override
  String get tailoringPhoto => 'புகைப்படம் சேர்';

  @override
  String get tailoringRates => 'வேலை வாரியாக கைவினைஞர் கூலி';

  @override
  String get tailoringRatesHint =>
      'ஒவ்வொரு ஆடையின் ஒவ்வொரு வேலைக்கும் துண்டுக்கான கூலி, செய்யும் வரிசையில். புதிய ஆர்டர்கள் இவற்றை எடுக்கும்.';

  @override
  String get tailoringProcess => 'வேலை';

  @override
  String get tailoringNoRates =>
      'இன்னும் கூலி இல்லை: சேர்க்கும் வரை ஆர்டர்களில் வேலைகள் இருக்காது.';

  @override
  String get tailoringAddRate => 'வேலையைச் சேர்';

  @override
  String get tailoringKeysChest => 'மார்பு';

  @override
  String get tailoringKeysWaist => 'இடுப்பு';

  @override
  String get tailoringKeysHip => 'இடுப்புச் சுற்று';

  @override
  String get tailoringKeysShoulder => 'தோள்';

  @override
  String get tailoringKeysLength => 'நீளம்';

  @override
  String get tailoringKeysSleeve => 'கை நீளம்';

  @override
  String get tailoringKeysNeck => 'கழுத்து';

  @override
  String get tailoringKeysInseam => 'உள் நீளம்';

  @override
  String get tailoringErrorsPhotoTooBig =>
      'புகைப்படம் மிகப் பெரியது (அதிகபட்சம் 6 MB).';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'முன்பணம் ஆர்டர் மொத்தத்தை விட அதிகம்.';

  @override
  String get tailoringErrorsAssignFirst =>
      'முதலில் வேலையை கைவினைஞரிடம் கொடுங்கள்.';

  @override
  String get tailoringErrorsProcessDone => 'அந்த வேலை ஏற்கனவே முடிந்தது.';

  @override
  String get tailoringErrorsProcessesPending =>
      'சில வேலைகள் இன்னும் முடியவில்லை.';

  @override
  String get tailoringErrorsNotReady => 'இந்த ஆர்டர் இன்னும் தயாராகவில்லை.';

  @override
  String get tailoringErrorsOrderClosed =>
      'இந்த ஆர்டர் ஏற்கனவே ஒப்படைக்கப்பட்டது அல்லது ரத்தானது.';

  @override
  String get tailoringErrorsFabricQtyRequired =>
      'எத்தனை மீட்டர் துணி என உள்ளிடவும்.';

  @override
  String get tailoringErrorsNoMeasurements => 'குறைந்தது ஒரு அளவை உள்ளிடவும்.';

  @override
  String get tailoringErrorsDuplicateRate =>
      'அதே ஆடையும் வேலையும் இருமுறை உள்ளன.';

  @override
  String get consignmentTitle => 'சரக்கு ஒப்படைப்பு மற்றும் கடைக்குள் கடை';

  @override
  String get consignmentSubtitle =>
      'பிற கடைகளில் வைத்த சரக்கு விற்கும் வரை உங்களுடையதே. சரக்கை அனுப்புங்கள், திரும்பப் பெறுங்கள், அவர்களின் விற்பனை அறிக்கைப்படி பில் போடுங்கள்.';

  @override
  String get consignmentSend => 'சரக்கு அனுப்பு';

  @override
  String get consignmentBillSales => 'அவர்களின் விற்பனைக்கு பில்';

  @override
  String get consignmentTakeBack => 'சரக்கை திரும்பப் பெறு';

  @override
  String get consignmentConsignee => 'சரக்கு பெறுநர்';

  @override
  String get consignmentHeld => 'அவர்களிடம்';

  @override
  String get consignmentValueAtCost => 'அடக்க விலை மதிப்பு';

  @override
  String get consignmentSold => 'விற்றது';

  @override
  String get consignmentAgeing => 'பழைய சரக்கு';

  @override
  String consignmentItemsAgeing(String n) {
    return '150 நாட்களைக் கடந்த பொருட்கள்: $n';
  }

  @override
  String get consignmentFine => 'அனைத்தும் புதியது';

  @override
  String get consignmentNone => 'இன்னும் எந்தச் சரக்கும் ஒப்படைப்பில் இல்லை.';

  @override
  String consignmentReconcileTitle(String name) {
    return 'சரிபார்ப்பு: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'அவர்கள் கடையில் எண்ணியதை உள்ளிடுங்கள். குறைந்த துண்டுகள் விற்றதாகக் கருதி பில் போடப்படும். அனுப்பிய ஆறு மாதங்களுக்குள் பில் போட வேண்டும்.';

  @override
  String get consignmentSent => 'அனுப்பியது';

  @override
  String get consignmentReturned => 'திரும்பியது';

  @override
  String get consignmentCounted => 'எண்ணியது';

  @override
  String get consignmentInvoiceBy => 'பில் கடைசி நாள்';

  @override
  String consignmentMismatch(String n) {
    return '$n வித்தியாசம்';
  }

  @override
  String consignmentShortage(String n) {
    return 'எண்ணிக்கையில் குறைந்த துண்டுகள்: $n';
  }

  @override
  String get consignmentShortageNarration =>
      'இருப்பு எண்ணிக்கையில் விற்றதாகக் கண்டது';

  @override
  String get consignmentBillShortage => 'குறைவை விற்றதாக பில் போடு';

  @override
  String get consignmentRegister => 'நகர்வுகள்';

  @override
  String get consignmentKindsSend => 'அனுப்பியது';

  @override
  String get consignmentKindsReturn => 'திரும்பியது';

  @override
  String get consignmentKindsSale => 'விற்று பில் போட்டது';

  @override
  String get consignmentFormsSend => 'ஒப்படைப்பில் சரக்கு அனுப்பு';

  @override
  String get consignmentFormsReturn => 'சரக்கை திரும்பப் பெறு';

  @override
  String get consignmentFormsSales => 'அவர்களின் விற்பனை அறிக்கை';

  @override
  String get consignmentFormHintsSend =>
      'சரக்கு அவர்கள் கடைக்குச் செல்லும், உங்கள் கணக்கில் இருக்கும். விலையை காலியாக விட்டால் அவர்களின் விலைப்பட்டியல் அல்லது பொருளின் விற்பனை விலை பயன்படும்.';

  @override
  String get consignmentFormHintsReturn =>
      'விற்காத துண்டுகள் உங்கள் முதன்மைக் கிடங்குக்குத் திரும்பும்.';

  @override
  String get consignmentFormHintsSales =>
      'ஒவ்வொரு விற்பனை அறிக்கையும் அவர்கள் கடை இருப்பிலிருந்து அவர்களுக்கு வரி விலைப்பட்டியலாகும். கடன் வரம்பைத் தாண்டினாலும் எச்சரிக்கையுடன் ஆகும்.';

  @override
  String get consignmentAgreedRate => 'ஒப்பந்த விலை';

  @override
  String get consignmentAddLine => 'பொருள் சேர்';

  @override
  String get consignmentSaveSend => 'அனுப்பு';

  @override
  String get consignmentSaveReturn => 'திரும்பப் பெறு';

  @override
  String get consignmentSaveSales => 'விலைப்பட்டியல் உருவாக்கு';

  @override
  String get consignmentErrorsMoreThanHeld =>
      'இது அவர்களிடம் உள்ளதை விட அதிகம்.';

  @override
  String get consignmentErrorsNotACustomer =>
      'வாடிக்கையாளர் கணக்கைத் தேர்ந்தெடுங்கள்.';

  @override
  String get consignmentErrorsDuplicateItem => 'அதே பொருள் இருமுறை உள்ளது.';

  @override
  String get consignmentErrorsUnknownItem => 'ஒரு பொருள் இப்போது இல்லை.';

  @override
  String get reportsParticulars => 'விவரங்கள்';

  @override
  String get reportsTradingIncome => 'விற்பனை & நேரடி வருமானம்';

  @override
  String get reportsTradingExpense => 'கொள்முதல் & நேரடிச் செலவுகள்';

  @override
  String get reportsGrossProfit => 'மொத்த லாபம்';

  @override
  String get reportsOtherIncome => 'மறைமுக வருமானம்';

  @override
  String get reportsOtherExpense => 'மறைமுகச் செலவுகள்';

  @override
  String get reportsNetProfit => 'நிகர லாபம்';

  @override
  String get reportsNetLoss => 'நிகர நட்டம்';

  @override
  String get reportsAssets => 'சொத்துகள்';

  @override
  String get reportsLiabilities => 'பொறுப்புகள் & மூலதனம்';

  @override
  String get reportsProfitAndLoss => 'லாப நட்டக் கணக்கு';

  @override
  String get reportsDifference => 'வேறுபாடு';

  @override
  String get reportsOpeningDifference => 'தொடக்க இருப்புகளில் வேறுபாடு';

  @override
  String get reportsOpening => 'தொடக்க இருப்பு';

  @override
  String get reportsClosing => 'இறுதி இருப்பு';

  @override
  String get reportsNoData => 'இந்தக் காலத்தில் காட்ட எதுவுமில்லை.';

  @override
  String reportsLedgerTitle(String account) {
    return 'பேரேடு: $account';
  }

  @override
  String get reportsStockNote =>
      'கட்டம் 3-இல் சரக்கு வந்ததும் இறுதிச் சரக்கு சேர்க்கப்படும்.';

  @override
  String get reportsOpeningStock => 'தொடக்கச் சரக்கு';

  @override
  String get reportsClosingStock => 'இறுதிச் சரக்கு';

  @override
  String get reportsBuilderTitle => 'அறிக்கை உருவாக்கி';

  @override
  String get reportsBuilderSubtitle =>
      'விற்பனை, கொள்முதல், செலவுகள், பேரேட்டுப் பதிவுகள் அல்லது நேரத்தை வேண்டியபடி தொகுத்துக் கூட்டுங்கள்; சேமிக்கலாம், அல்லது மின்னஞ்சலில் பெறலாம்.';

  @override
  String get reportsBuilderDataset => 'தரவு';

  @override
  String get reportsBuilderDatasetsSales => 'விற்பனை';

  @override
  String get reportsBuilderDatasetsPurchases => 'கொள்முதல்';

  @override
  String get reportsBuilderDatasetsExpenses => 'செலவுகள்';

  @override
  String get reportsBuilderDatasetsLedger => 'பேரேட்டுப் பதிவுகள்';

  @override
  String get reportsBuilderDatasetsTime => 'நேரத்தாள்கள்';

  @override
  String get reportsBuilderGroupBy => 'தொகுப்பு (3 வரை)';

  @override
  String get reportsBuilderMeasures => 'காட்டு';

  @override
  String get reportsBuilderDimsMonth => 'மாதம்';

  @override
  String get reportsBuilderDimsDay => 'நாள்';

  @override
  String get reportsBuilderDimsCustomer => 'வாடிக்கையாளர்';

  @override
  String get reportsBuilderDimsItem => 'பொருள்';

  @override
  String get reportsBuilderDimsHsn => 'HSN';

  @override
  String get reportsBuilderDimsState => 'மாநிலம்';

  @override
  String get reportsBuilderDimsSupplier => 'சப்ளையர்';

  @override
  String get reportsBuilderDimsCategory => 'வகை';

  @override
  String get reportsBuilderDimsEmployee => 'பணியாளர்';

  @override
  String get reportsBuilderDimsProject => 'திட்டம்';

  @override
  String get reportsBuilderDimsAccount => 'பேரேடு';

  @override
  String get reportsBuilderDimsGroup => 'குழு';

  @override
  String get reportsBuilderDimsType => 'வவுச்சர் வகை';

  @override
  String get reportsBuilderMeasureNamesQty => 'அளவு';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'வரிக்குட்பட்ட மதிப்பு';

  @override
  String get reportsBuilderMeasureNamesTax => 'ஜிஎஸ்டி';

  @override
  String get reportsBuilderMeasureNamesTotal => 'மொத்தம்';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'ஆவணங்கள்';

  @override
  String get reportsBuilderMeasureNamesAmount => 'தொகை';

  @override
  String get reportsBuilderMeasureNamesItc => 'ஜிஎஸ்டி கிரெடிட்';

  @override
  String get reportsBuilderMeasureNamesDebit => 'பற்று';

  @override
  String get reportsBuilderMeasureNamesCredit => 'வரவு';

  @override
  String get reportsBuilderMeasureNamesNet => 'நிகரம்';

  @override
  String get reportsBuilderMeasureNamesHours => 'மணிநேரம்';

  @override
  String get reportsBuilderMeasureNamesCost => 'செலவு';

  @override
  String get reportsBuilderMeasureNamesBillableValue =>
      'பில் செய்யக்கூடிய மதிப்பு';

  @override
  String get reportsBuilderPeriod => 'காலம்';

  @override
  String get reportsBuilderPresetsToday => 'இன்று';

  @override
  String get reportsBuilderPresetsYesterday => 'நேற்று';

  @override
  String get reportsBuilderPresetsThisMonth => 'இந்த மாதம்';

  @override
  String get reportsBuilderPresetsLastMonth => 'கடந்த மாதம்';

  @override
  String get reportsBuilderPresetsThisQuarter => 'இந்தக் காலாண்டு';

  @override
  String get reportsBuilderPresetsLastQuarter => 'கடந்த காலாண்டு';

  @override
  String get reportsBuilderPresetsThisFy => 'இந்த நிதியாண்டு';

  @override
  String get reportsBuilderPresetsLastFy => 'கடந்த நிதியாண்டு';

  @override
  String get reportsBuilderPresetsCustom => 'தேதிகளைத் தேர்ந்தெடு';

  @override
  String get reportsBuilderRun => 'இயக்கு';

  @override
  String get reportsBuilderCsv => 'CSV பதிவிறக்கு';

  @override
  String get reportsBuilderSave => 'அறிக்கையைச் சேமி';

  @override
  String get reportsBuilderName => 'அறிக்கைப் பெயர்';

  @override
  String get reportsBuilderSchedule => 'மின்னஞ்சல் செய்';

  @override
  String get reportsBuilderFrequenciesNone => 'மின்னஞ்சல் வேண்டாம்';

  @override
  String get reportsBuilderFrequenciesDaily => 'தினமும் (நேற்றைய எண்ணிக்கைகள்)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'வாரந்தோறும் (கடந்த திங்கள் முதல் ஞாயிறு)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'மாதந்தோறும் (கடந்த மாதம்)';

  @override
  String get reportsBuilderHour => 'நேரம்';

  @override
  String get reportsBuilderWeekday => 'கிழமை';

  @override
  String get reportsBuilderWeekdays0 => 'ஞாயிறு';

  @override
  String get reportsBuilderWeekdays1 => 'திங்கள்';

  @override
  String get reportsBuilderWeekdays2 => 'செவ்வாய்';

  @override
  String get reportsBuilderWeekdays3 => 'புதன்';

  @override
  String get reportsBuilderWeekdays4 => 'வியாழன்';

  @override
  String get reportsBuilderWeekdays5 => 'வெள்ளி';

  @override
  String get reportsBuilderWeekdays6 => 'சனி';

  @override
  String get reportsBuilderDay => 'தேதியில் (1–28)';

  @override
  String get reportsBuilderRecipients =>
      'இவர்களுக்கு மின்னஞ்சல் (காற்புள்ளியால் பிரிக்கவும்)';

  @override
  String get reportsBuilderSaved => 'சேமிக்கப்பட்டது.';

  @override
  String get reportsBuilderTotal => 'மொத்தம்';

  @override
  String get reportsBuilderNoRows => 'இந்தக் காலத்துக்குத் தரவு இல்லை.';

  @override
  String get reportsBuilderSavedTitle => 'சேமித்த அறிக்கைகள்';

  @override
  String reportsBuilderNextRun(String date) {
    return 'அடுத்த மின்னஞ்சல்: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'கடைசி இயக்கம் தோல்வி: $error';
  }

  @override
  String get reportsBuilderDelete => 'நீக்கு';

  @override
  String get reportsBuilderNone => 'இன்னும் சேமித்த அறிக்கை இல்லை.';

  @override
  String get reportsErrorsUnknownDataset =>
      'எதைப் பற்றி அறிக்கை என்று தேர்ந்தெடுக்கவும்.';

  @override
  String get reportsErrorsUnknownMeasure =>
      'காட்ட குறைந்தது ஒரு எண்ணிக்கையைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get reportsErrorsUnknownDimension =>
      'அந்தத் தொகுப்பு இங்கு கிடைக்காது.';

  @override
  String get reportsErrorsInvalidPeriod => 'தேதிகளைச் சரிபார்க்கவும்.';

  @override
  String get reportsErrorsRecipientsRequired =>
      'குறைந்தது ஒரு மின்னஞ்சல் முகவரி சேர்க்கவும்.';

  @override
  String get reportsErrorsInvalidHour => 'நேரத்தைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get reportsErrorsInvalidWeekday =>
      'வாரத்தின் நாளைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get reportsErrorsInvalidDay =>
      '1 முதல் 28 வரை ஒரு தேதியைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get reportsErrorsUnknownFilter => 'அந்த வடிகட்டி இங்கு கிடைக்காது.';

  @override
  String get ownerReportsColourSizeTitle => 'நிறம், அளவு அறிக்கை';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'ஒவ்வொரு டிசைனும் நிறம், அளவு அட்டவணையாக, இருப்பு அல்லது விற்ற துண்டுகளுடன்.';

  @override
  String get ownerReportsAgeingTitle => 'இருப்பு வயதும் தேங்கிய இருப்பும்';

  @override
  String get ownerReportsAgeingSubtitle =>
      'இன்றைய இருப்பு எவ்வளவு காலமாக உள்ளது (முதலில் வந்தது முதலில் விற்கும்), எது விற்பது நின்றது.';

  @override
  String get ownerReportsRegisterTitle => 'விற்பனைப் பதிவேடு';

  @override
  String get ownerReportsRegisterSubtitle =>
      'காலத்தின் ஒவ்வொரு விலைப்பட்டியல், கவுண்டர் பில், திருப்பம், செலுத்திய முறையுடன்.';

  @override
  String get ownerReportsDesign => 'டிசைன்';

  @override
  String get ownerReportsName => 'பெயர்';

  @override
  String get ownerReportsBrand => 'பிராண்ட்';

  @override
  String get ownerReportsColour => 'நிறம்';

  @override
  String get ownerReportsSize => 'அளவு';

  @override
  String get ownerReportsSold => 'விற்றது';

  @override
  String get ownerReportsStock => 'இருப்பு';

  @override
  String get ownerReportsSales => 'விற்பனை';

  @override
  String get ownerReportsReportType => 'காட்டு';

  @override
  String get ownerReportsFrom => 'முதல்';

  @override
  String get ownerReportsTo => 'வரை';

  @override
  String get ownerReportsAsOf => 'இந்தத் தேதியில்';

  @override
  String get ownerReportsStore => 'கிடங்கு';

  @override
  String get ownerReportsAllStores => 'எங்கள் எல்லாக் கிடங்குகளும்';

  @override
  String get ownerReportsAllBrands => 'எல்லா பிராண்டுகளும்';

  @override
  String get ownerReportsCategory => 'வகை';

  @override
  String get ownerReportsAllCategories => 'எல்லா வகைகளும்';

  @override
  String get ownerReportsSearchDesign => 'டிசைன் எண் அல்லது பெயர்';

  @override
  String ownerReportsTotalSold(String n) {
    return 'விற்ற துண்டுகள்: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'இருப்பில் துண்டுகள்: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'MRP $v';
  }

  @override
  String get ownerReportsTotal => 'மொத்தம்';

  @override
  String get ownerReportsNoPhoto => 'படம் இல்லை';

  @override
  String get ownerReportsNothing => 'இந்தத் தேர்வுகளுக்கு எதுவும் இல்லை.';

  @override
  String get ownerReportsItem => 'பொருள்';

  @override
  String get ownerReportsValue => 'மதிப்பு';

  @override
  String get ownerReportsDeadAfter => 'தேக்கம் எப்போது';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'தேக்கம்: $n நாள் விற்பனை இல்லை';
  }

  @override
  String get ownerReportsOnlyDead => 'தேங்கிய இருப்பு மட்டும்';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'வயது வாரி இருப்பு: $v, $n துண்டுகள்';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'தேங்கிய இருப்பு ($n நாள் விற்பனை இல்லை)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'பொருட்கள்: $items, துண்டுகள்: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'தள்ளுபடி, சப்ளையருக்குத் திருப்பம் அல்லது வேறு கிடங்குக்கு மாற்றத்திற்கு ஏற்றவை.';

  @override
  String get ownerReportsDead => 'தேக்கம்';

  @override
  String get ownerReportsLastSold => 'கடைசி விற்பனை';

  @override
  String get ownerReportsIdleDays => 'விற்பனையற்ற நாட்கள்';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n நாள் முன்)';
  }

  @override
  String get ownerReportsNeverSold => 'ஒருபோதும் விற்கவில்லை';

  @override
  String get ownerReportsDate => 'தேதி';

  @override
  String get ownerReportsNumber => 'எண்';

  @override
  String get ownerReportsKind => 'ஆவணம்';

  @override
  String get ownerReportsParty => 'வாடிக்கையாளர்';

  @override
  String get ownerReportsColsPieces => 'துண்டு';

  @override
  String get ownerReportsColsGross => 'மொத்தம்';

  @override
  String get ownerReportsColsDiscount => 'தள்ளுபடி';

  @override
  String get ownerReportsColsTaxable => 'வரிக்குட்பட்டது';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'பில் தொகை';

  @override
  String get ownerReportsColsCash => 'ரொக்கம்';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'அட்டை';

  @override
  String get ownerReportsColsCredit => 'கடன்';

  @override
  String get ownerReportsKindsInvoice => 'விலைப்பட்டியல்';

  @override
  String get ownerReportsKindsBill => 'கவுண்டர் பில்';

  @override
  String get ownerReportsKindsCreditNote => 'கிரெடிட் நோட்';

  @override
  String get ownerReportsKindsCounterReturn => 'கவுண்டர் திருப்பம்';

  @override
  String get ownerReportsSearchRegister => 'எண் அல்லது வாடிக்கையாளர்';

  @override
  String get ownerReportsAllKinds => 'எல்லா ஆவணங்களும்';

  @override
  String ownerReportsDocuments(String n) {
    return 'ஆவணங்கள்: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'திருப்பங்கள் கழிவு வரிசைகளாக உள்ளன. நிழலிட்ட வரிசைகளில் தள்ளுபடி; அடித்த வரிசைகள் ரத்து, மொத்தத்தில் சேர்க்கப்படவில்லை.';

  @override
  String get ownerReportsCompareLastYear => 'கடந்த ஆண்டுடன் ஒப்பிடு';

  @override
  String get ownerReportsThisPeriod => 'இந்தக் காலம்';

  @override
  String get ownerReportsSameLastYear => 'கடந்த ஆண்டு அதே காலம்';

  @override
  String get ownerReportsChange => 'மாற்றம்';

  @override
  String get ownerReportsErrorsInvalidPeriod =>
      'தொடக்கத் தேதி முடிவுக்குப் பின் உள்ளது.';

  @override
  String get ownerReportsWithMaterials => 'துணி, டிரிம்களுடன்';

  @override
  String get ownerReportsAvgBill => 'சராசரி பில்';

  @override
  String get fyTitle => 'நிதியாண்டுகள்';

  @override
  String get fySubtitle =>
      'கணக்குகள் இறுதியானதும் காலத்தைப் பூட்டவும்: எ.கா. ஜிஎஸ்டி ரிட்டர்ன் தாக்கல் செய்த பிறகு. பூட்டுத் தேதி வரை யாரும் பதியவோ ரத்துசெய்யவோ முடியாது.';

  @override
  String get fyYear => 'ஆண்டு';

  @override
  String get fyPeriod => 'காலம்';

  @override
  String get fyLockedUpTo => 'வரை பூட்டப்பட்டது';

  @override
  String get fyOpen => 'திறந்தது';

  @override
  String get fyLock => 'பூட்டு';

  @override
  String get fyUnlock => 'பூட்டை நீக்கு';

  @override
  String get fyErrorsLockOutsideYear =>
      'பூட்டுத் தேதி இந்த நிதியாண்டுக்குள் இருக்க வேண்டும்.';

  @override
  String get appConnectTitle => 'இந்தச் சாதனத்தை இணைக்கவும்';

  @override
  String get appConnectSubtitle =>
      'உங்கள் Varchasv கணக்கில் ஒருமுறை உள்நுழையவும். பின்னர் செயலி இணையம் இல்லாமலும் இயங்கும், ஆன்லைனில் இருக்கும்போது ஒத்திசைக்கும்.';

  @override
  String get appServer => 'சேவையக முகவரி';

  @override
  String get appConnect => 'இணை';

  @override
  String get appConnecting => 'இணைக்கிறது…';

  @override
  String get appNoBusiness =>
      'இந்தக் கணக்கு இன்னும் எந்த வணிகத்திலும் இல்லை. முதலில் இணையதளத்தில் ஒன்றை உருவாக்கவும்.';

  @override
  String get appCantReach =>
      'சேவையகத்தை அடைய முடியவில்லை. முகவரியையும் இணைய இணைப்பையும் சரிபார்க்கவும்.';

  @override
  String get appSyncTitle => 'ஒத்திசைவு';

  @override
  String get appSyncNow => 'இப்போது ஒத்திசை';

  @override
  String appLastSync(String time) {
    return 'கடைசியாக $time ஒத்திசைந்தது';
  }

  @override
  String get appNeverSynced => 'இன்னும் ஒத்திசைக்கவில்லை';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count மாற்றங்கள் பதிவேற்றக் காத்திருக்கின்றன',
      one: '$count மாற்றம் பதிவேற்றக் காத்திருக்கிறது',
      zero: 'அனைத்தும் பதிவேற்றப்பட்டன',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'சேவையகம் $count மாற்றங்களை மறுத்தது',
      one: 'சேவையகம் $count மாற்றத்தை மறுத்தது',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'மறுக்கப்பட்ட மாற்றங்களை மீண்டும் முயல்';

  @override
  String get appOffline =>
      'ஆஃப்லைன்: உங்கள் வேலை இந்தச் சாதனத்தில் சேமிக்கப்பட்டுள்ளது, பின்னர் பதிவேற்றப்படும்.';

  @override
  String get appSyncing => 'ஒத்திசைக்கிறது…';

  @override
  String get appDevice => 'இந்தச் சாதனம்';

  @override
  String appDeviceCode(String code) {
    return 'சாதனக் குறியீடு $code';
  }

  @override
  String get appBusiness => 'வணிகம்';

  @override
  String get appSignOut => 'இந்தச் சாதனத்திலிருந்து வெளியேறு';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count மாற்றங்கள் இன்னும் பதிவேற்றப்படவில்லை, அவை இழக்கப்படும்.',
      one: '$count மாற்றம் இன்னும் பதிவேற்றப்படவில்லை, அது இழக்கப்படும்.',
      zero: 'இது இந்தச் சாதனத்திலிருந்து உங்கள் கணக்குகளின் உள்ளூர் நகலை நீக்கும்.',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'பதிவேற்றக் காத்திருக்கிறது';

  @override
  String get appBadgeFailed => 'மறுக்கப்பட்டது';

  @override
  String get appBadgeSynced => 'பதிவேற்றப்பட்டது';

  @override
  String get appNoVouchers => 'இன்னும் வவுச்சர் இல்லை. சேர்க்க + தட்டவும்.';

  @override
  String get appAddAccount => 'கணக்கு சேர்';

  @override
  String get appNoPermission => 'இதைச் செய்ய உங்களுக்கு அனுமதி இல்லை.';

  @override
  String get appToday => 'இன்று';

  @override
  String get appPreviousDay => 'முந்தைய நாள்';

  @override
  String get appNextDay => 'அடுத்த நாள்';

  @override
  String get appNotSyncedYet => 'ஒத்திசைவுக்குக் காத்திருக்கிறது';

  @override
  String get appFieldTitle => 'களப்பணி';

  @override
  String get appFieldNewOrder => 'புதிய ஆர்டர்';

  @override
  String get appFieldNewClaim => 'புதிய செலவுக் கோரிக்கை';

  @override
  String get appFieldOrders => 'இந்தச் சாதனத்தின் ஆர்டர்கள்';

  @override
  String get appFieldClaims => 'இந்தச் சாதனத்தின் கோரிக்கைகள்';

  @override
  String appFieldSentAs(String number) {
    return '$number ஆகப் பதிவேற்றப்பட்டது';
  }

  @override
  String appFieldApprox(String amount) {
    return 'ஜிஎஸ்டியுடன் சுமார் ₹$amount; இறுதித் தொகை பதிவேற்றும்போது கணக்கிடப்படும்';
  }

  @override
  String get appFieldAddItem => 'பொருள் சேர்';

  @override
  String get appFieldQty => 'அளவு';

  @override
  String get appFieldRate => 'விலை';

  @override
  String get appFieldSave => 'சேமி';

  @override
  String get appFieldSaved =>
      'இந்தச் சாதனத்தில் சேமிக்கப்பட்டது; ஆன்லைனில் வந்ததும் பதிவேற்றப்படும்.';

  @override
  String get appFieldNone => 'இன்னும் எதுவுமில்லை.';

  @override
  String get appOverviewTitle => 'கண்ணோட்டம்';

  @override
  String appOverviewAsOf(String time) {
    return '$time நிலவரப்படி எண்ணிக்கைகள்';
  }

  @override
  String appOverviewOffline(String time) {
    return '$time எண்ணிக்கைகளைக் காட்டுகிறது. புதுப்பிக்க இணையத்தில் இணையவும்.';
  }

  @override
  String get appOverviewNever =>
      'இன்றைய எண்ணிக்கைகளைப் பார்க்க இணையத்தில் இணையவும்.';

  @override
  String get appOverviewRefresh => 'புதுப்பி';

  @override
  String get appApprovalsTitle => 'ஒப்புதல்கள்';

  @override
  String get appApprovalsNone => 'உங்களுக்காக எதுவும் காத்திருக்கவில்லை.';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours ம';
  }

  @override
  String get appApprovalsNeedOnline => 'ஒப்புதலுக்கு இணையம் தேவை.';

  @override
  String get itemsTitle => 'பொருட்கள்';

  @override
  String get itemsSubtitle =>
      'நீங்கள் வைத்திருக்கும் சரக்குகளும் வாங்கும் அல்லது விற்கும் சேவைகளும், HSN/SAC மற்றும் ஜிஎஸ்டி விகிதத்துடன்.';

  @override
  String get itemsNew => 'புதிய பொருள்';

  @override
  String get itemsName => 'பொருளின் பெயர்';

  @override
  String get itemsKind => 'வகை';

  @override
  String get itemsGoods => 'சரக்கு';

  @override
  String get itemsService => 'சேவை';

  @override
  String get itemsSku => 'SKU / குறியீடு';

  @override
  String get itemsBarcode => 'பார்கோடு';

  @override
  String get itemsHsn => 'HSN / SAC';

  @override
  String get itemsGstRate => 'ஜிஎஸ்டி விகிதம்';

  @override
  String get itemsUom => 'அலகு';

  @override
  String get itemsPurchaseRate => 'கொள்முதல் விலை';

  @override
  String get itemsSaleRate => 'விற்பனை விலை';

  @override
  String get itemsMrp => 'MRP';

  @override
  String get itemsReorderLevel => 'மறு ஆர்டர் நிலை';

  @override
  String get itemsReorderQty => 'மறு ஆர்டர் அளவு';

  @override
  String get itemsTrackBatches => 'தொகுதி எண்ணும் காலாவதியும் பதிவுசெய்';

  @override
  String get itemsInStock => 'இருப்பில்';

  @override
  String get itemsEmpty => 'இன்னும் பொருட்கள் இல்லை.';

  @override
  String get itemsErrorsInvalidHsn =>
      'HSN குறியீட்டில் 4, 6 அல்லது 8 இலக்கங்கள் இருக்கும்.';

  @override
  String get itemsErrorsInvalidSac =>
      'SAC குறியீட்டில் 99-இல் தொடங்கும் 6 இலக்கங்கள் இருக்கும்.';

  @override
  String get itemsErrorsItemNameTaken =>
      'இந்தப் பெயரில் ஏற்கனவே பொருள் உள்ளது.';

  @override
  String get itemsErrorsSkuTaken =>
      'வேறொரு பொருள் இந்தக் குறியீட்டைப் பயன்படுத்துகிறது.';

  @override
  String get itemsErrorsUnknownUom => 'அலகைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get itemsErrorsSameAsBaseUnit => 'இது ஏற்கனவே பொருளின் சொந்த அலகு.';

  @override
  String get itemsErrorsDuplicateUnit =>
      'ஒவ்வொரு அலகையும் ஒருமுறை மட்டுமே சேர்க்கலாம்.';

  @override
  String get itemsErrorsInvalidFactor =>
      'இதில் அடிப்படை அலகு எத்தனை என்பதை 0-க்கு மேல் உள்ளிடவும்.';

  @override
  String get itemsLeadTimeDays => 'முன்னேற்ற நேரம் (நாட்கள்)';

  @override
  String get itemsGstSlab => 'ஜிஎஸ்டி விகிதம்';

  @override
  String get itemsSlabNone => 'நிலையான விகிதம்';

  @override
  String get itemsSlabApparel =>
      'தள்ளுபடிக்குப் பின் ஒரு துண்டுக்கு ₹2,500 வரை 5%, அதற்கு மேல் 18% (22 செப்டம்பர் 2025 முதல்)';

  @override
  String get itemsSlabFootwear =>
      'தள்ளுபடிக்குப் பின் ஒரு ஜோடிக்கு ₹2,500 வரை 5%, அதற்கு மேல் 18% (22 செப்டம்பர் 2025 முதல்)';

  @override
  String get itemsSlabPieces => 'ஒரு அலகில் துண்டுகள்';

  @override
  String get itemsSlabPiecesHint =>
      'ஒரு அலகாக விற்கப்படும் தொகுப்பின் விலை ஜிஎஸ்டி சோதனைக்காக இத்தனை துண்டுகளாகப் பிரிக்கப்படும். தொகுப்பை ஒரே துண்டாகக் கருத 1 என உள்ளிடவும்.';

  @override
  String get itemsByPrice => 'விலைப்படி';

  @override
  String get itemsOtherUnits => 'பிற அலகுகள்';

  @override
  String get itemsUnitFactor => 'அடிப்படை அலகில் எத்தனை';

  @override
  String get itemsOfBaseUnit => 'அடிப்படை அலகு';

  @override
  String get itemsAddUnit => 'அலகைச் சேர்';

  @override
  String get stylesTitle => 'ஸ்டைல்கள்';

  @override
  String get stylesSubtitle =>
      'நிறங்களிலும் அளவுகளிலும் விற்கப்படும் வடிவமைப்புகள். ஒவ்வொரு நிறமும் அளவும் தனி பொருள், அதற்கென பார்கோடும் இருப்பும் உண்டு.';

  @override
  String get stylesSizesAndColors => 'அளவுகள் மற்றும் நிறங்கள்';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'ஸ்டைல் சேர்க்கும்போது தேர்வு செய்யும் அளவு வரிசைகளும் நிறங்களும்.';

  @override
  String get stylesNew => 'புதிய ஸ்டைல்';

  @override
  String get stylesCreate => 'ஸ்டைலை உருவாக்கு';

  @override
  String get stylesCode => 'டிசைன் எண்';

  @override
  String get stylesCodeHint =>
      'ஒவ்வொரு SKU-விலும் பயன்படும், உதா. KT-101-NVY-M.';

  @override
  String get stylesName => 'பெயர்';

  @override
  String get stylesBrand => 'பிராண்ட்';

  @override
  String get stylesCategory => 'வகை';

  @override
  String get stylesSeason => 'சீசன்';

  @override
  String get stylesSeasonExample => 'பண்டிகை 2026';

  @override
  String get stylesCollection => 'கலெக்ஷன்';

  @override
  String get stylesSizeScale => 'அளவு வரிசை';

  @override
  String get stylesSizes => 'அளவுகள்';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'நிறங்கள்';

  @override
  String get stylesColor => 'நிறம்';

  @override
  String get stylesFits => 'ஃபிட்';

  @override
  String get stylesFitsHint =>
      'நிறம், அளவு தவிர மூன்றாவது தேர்வு, காற்புள்ளியால் பிரிக்கவும்.';

  @override
  String get stylesFitsExample => 'ஸ்லிம், ரெகுலர்';

  @override
  String get stylesVariants => 'வகைகள்';

  @override
  String get stylesSaleRate => 'விற்பனை விலை';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other:
          'இது $count பொருட்களை உருவாக்கும், ஒவ்வொரு நிறம், அளவுக்கும் ஒன்று.',
      one: 'இது $count பொருளை உருவாக்கும்.',
      zero: 'அளவுகளையும் நிறங்களையும் தேர்வு செய்யவும்.',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'இன்னும் ஸ்டைல்கள் இல்லை. ஒன்றைச் சேர்த்தால் அதன் எல்லா நிறம், அளவுகளும் ஒரே நேரத்தில் உருவாகும்.';

  @override
  String get stylesNoMatch => 'உங்கள் தேடலுக்குப் பொருந்தும் ஸ்டைல் இல்லை.';

  @override
  String get stylesSearchStyles =>
      'டிசைன் எண், பெயர் அல்லது பிராண்டால் தேடவும்';

  @override
  String get stylesNoStyles => 'ஸ்டைல்கள் இல்லை.';

  @override
  String get stylesChooseStyle => 'ஸ்டைலைத் தேர்வு செய்யவும்';

  @override
  String get stylesOtherStyle => 'வேறு ஸ்டைல்';

  @override
  String get stylesAddBySize => 'அளவுப்படி சேர்';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count துண்டுகள் சேர்',
      one: '$count துண்டு சேர்',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'ஒவ்வொரு பெட்டியின் கீழுள்ள சிறிய எண் கையிருப்பு.';

  @override
  String get stylesStockGrid => 'நிறம், அளவுப்படி இருப்பு';

  @override
  String get stylesAllWarehouses => 'எல்லா கிடங்குகள்';

  @override
  String get stylesDetails => 'ஸ்டைல் விவரங்கள்';

  @override
  String get stylesApplyPrices => 'இந்த விலைகளை எல்லா அளவுகளுக்கும் பொருத்து';

  @override
  String get stylesAddVariants => 'நிறங்கள் அல்லது அளவுகளைச் சேர்';

  @override
  String get stylesAddVariantsHint =>
      'புதிய நிறங்கள், அளவுகள் அல்லது இரண்டையும் தேர்வு செய்யவும். ஏற்கனவே உள்ள வகைகள் அப்படியே இருக்கும்.';

  @override
  String get stylesSets => 'செட்கள்';

  @override
  String get stylesNoSets => 'இன்னும் செட்கள் இல்லை.';

  @override
  String get stylesNewSet => 'புதிய செட்';

  @override
  String get stylesNewSetHint =>
      'ஒரு நிறத்தின் அளவு விகித செட், ஒரு அலகாக விற்கப்படும். இருப்பு அதன் துண்டுகளாக நகரும்.';

  @override
  String get stylesRatio => 'அளவின் துண்டுகள்';

  @override
  String get stylesSetAsOnePiece =>
      'ஜிஎஸ்டிக்கு முழு செட்டையும் ஒரு துண்டாகக் கணக்கிடு';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count துண்டுகள் செட் உருவாக்கு',
      one: '$count துண்டு செட் உருவாக்கு',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'அளவு வரிசைகள்';

  @override
  String get stylesScaleName => 'வரிசையின் பெயர்';

  @override
  String get stylesColorName => 'நிறத்தின் பெயர்';

  @override
  String get stylesColorCode => 'குறியீடு';

  @override
  String get stylesSwatch => 'நிற மாதிரி';

  @override
  String get stylesArchive => 'காப்பகப்படுத்து';

  @override
  String get stylesRestore => 'மீட்டெடு';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'இந்த டிசைன் எண் வேறு ஸ்டைலில் ஏற்கனவே உள்ளது.';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'குறைந்தது ஒரு நிறமும் ஒரு அளவும் தேர்வு செய்யவும்.';

  @override
  String get stylesErrorsUnknownColor => 'இந்த நிறம் உங்கள் பட்டியலில் இல்லை.';

  @override
  String get stylesErrorsVariantMissing =>
      'இந்த ஸ்டைலில் அந்த நிறத்துக்கு அந்த அளவு இல்லை. முதலில் அதைச் சேர்க்கவும்.';

  @override
  String get stylesErrorsRatioRequired =>
      'செட்டில் குறைந்தது ஒரு அளவின் துண்டுகளை உள்ளிடவும்.';

  @override
  String get stylesErrorsPackExists => 'இந்த செட் ஏற்கனவே உள்ளது.';

  @override
  String get stylesErrorsScaleNameTaken =>
      'இந்தப் பெயரில் ஒரு அளவு வரிசை ஏற்கனவே உள்ளது.';

  @override
  String get stylesErrorsColorTaken =>
      'இந்தப் பெயர் அல்லது குறியீட்டில் ஒரு நிறம் ஏற்கனவே உள்ளது.';

  @override
  String get stylesErrorsSizesRequired => 'குறைந்தது ஒரு அளவை உள்ளிடவும்.';

  @override
  String get stylesErrorsColorCodeRequired =>
      'நிறத்துக்கு ஒரு குறியீட்டை உள்ளிடவும்.';

  @override
  String get stylesSummaryTaxonomy => 'வடிவமைப்பு';

  @override
  String get stylesSummaryCode => 'வடிவமைப்பு எண்';

  @override
  String get stylesSummaryName => 'பெயர்';

  @override
  String get stylesSummaryBrand => 'பிராண்ட்';

  @override
  String get stylesSummaryCategory => 'வகை';

  @override
  String get stylesSummarySeason => 'பருவம்';

  @override
  String get stylesSummaryCollection => 'தொகுப்பு';

  @override
  String get stylesSummarySizes => 'அளவுகள்';

  @override
  String get stylesSummaryColours => 'நிறங்கள்';

  @override
  String get stylesSummaryPricing => 'விலை, அடக்கம்';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'மார்க்-அப் $pct%';
  }

  @override
  String get stylesSummaryCost => 'கொள்முதல் விலை';

  @override
  String get stylesSummarySaleRate => 'விற்பனை விலை';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from முதல் $to';
  }

  @override
  String get stylesSummaryPieces => 'இருப்பில் துண்டுகள்';

  @override
  String get stylesSummarySkus => 'நிறம், அளவு பொருட்கள்';

  @override
  String get stylesSummaryValueAtCost => 'அடக்க விலையில் இருப்பு';

  @override
  String get stylesSummaryMedia => 'படங்கள்';

  @override
  String stylesSummaryPhotos(String n) {
    return '$n உள்ளன';
  }

  @override
  String get stylesSummaryNoPhotos => 'இன்னும் படங்கள் இல்லை.';

  @override
  String get stylesSummaryManagePhotos => 'படங்களைச் சேர் அல்லது மாற்று';

  @override
  String get stylesAttributes =>
      'ஸ்டைலை விவரிக்கவும் (உங்கள் பட்டியல்களிலிருந்து)';

  @override
  String get catalogueTitle => 'படக் கையேடு';

  @override
  String get catalogueSubtitle =>
      'ஒவ்வொரு டிசைனும் நிறமும் படம், விலை, இருப்பு, விற்பனையுடன். ஒரு வாடிக்கையாளருக்கு டிசைன்களைத் தேர்ந்து அச்சிடுங்கள், ஏற்றுமதி செய்யுங்கள் அல்லது பகிருங்கள்.';

  @override
  String get catalogueAllColours => 'எல்லா நிறங்களும்';

  @override
  String get cataloguePhotos => 'படங்கள்';

  @override
  String get catalogueView => 'கோணம்';

  @override
  String get catalogueViewsFront => 'முன்பக்கம்';

  @override
  String get catalogueViewsBack => 'பின்பக்கம்';

  @override
  String get catalogueViewsDetail => 'நுணுக்கம்';

  @override
  String get catalogueViewsModel => 'மாடலில்';

  @override
  String get catalogueViewsOther => 'மற்றவை';

  @override
  String get catalogueUploading => 'பதிவேற்றுகிறது…';

  @override
  String get catalogueAddPhotos => 'படங்களைச் சேர்';

  @override
  String get cataloguePhotoHint =>
      'பதிவேற்றும் முன் படங்கள் இந்தச் சாதனத்திலேயே சிறிதாக்கப்படும். தொலைபேசியில் கேமராவால் எடுக்கலாம்.';

  @override
  String get catalogueShownFirst => 'முதலில் காட்டப்படும்';

  @override
  String get catalogueShowFirst => 'முதலில் காட்டு';

  @override
  String get catalogueNoPhotos => 'இன்னும் படங்கள் இல்லை.';

  @override
  String catalogueRecords(String n) {
    return 'காட்டப்படும் டிசைன்கள்: $n';
  }

  @override
  String get catalogueTileSize => 'ஓடு அளவு';

  @override
  String get catalogueSort => 'வரிசை';

  @override
  String get catalogueSortsCode => 'டிசைன் எண் படி';

  @override
  String get catalogueSortsNewest => 'புதியவை முதலில்';

  @override
  String get catalogueSortsBest => 'அதிகம் விற்பவை';

  @override
  String get catalogueSortsPriceLow => 'விலை: குறைவிலிருந்து அதிகம்';

  @override
  String get catalogueSortsPriceHigh => 'விலை: அதிகத்திலிருந்து குறைவு';

  @override
  String get catalogueSortsStock => 'அதிக இருப்பு';

  @override
  String catalogueCart(String n) {
    return 'கூடை ($n)';
  }

  @override
  String get catalogueNoPhoto => 'படம் இல்லை';

  @override
  String catalogueStock(String n) {
    return 'இருப்பு: $n';
  }

  @override
  String catalogueSold(String n) {
    return '90 நாளில் விற்றது: $n';
  }

  @override
  String get catalogueAdded => 'கூடையில்';

  @override
  String get catalogueAdd => 'சேர்';

  @override
  String get catalogueNone => 'இந்த வடிகட்டிகளுக்குப் பொருந்தும் டிசைன் இல்லை.';

  @override
  String get cataloguePrevious => 'முந்தைய';

  @override
  String get catalogueNext => 'அடுத்து';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$total இல் $from முதல் $to';
  }

  @override
  String get catalogueSelections => 'சேமித்த தேர்வுகள்';

  @override
  String catalogueDesigns(String n) {
    return 'டிசைன்கள்: $n';
  }

  @override
  String get catalogueSharedBadge => 'இணைப்பு செயலில்';

  @override
  String get catalogueNoSelections =>
      'இன்னும் தேர்வுகள் இல்லை. டிசைன்களைக் கூடையில் சேர்த்துச் சேமியுங்கள்.';

  @override
  String get catalogueSearch => 'பார்கோடு, டிசைன் அல்லது பெயர்';

  @override
  String get cataloguePriceFor => 'யாருக்கான விலை';

  @override
  String get catalogueSaleRate => 'விற்பனை விலை';

  @override
  String get catalogueInStockOnly => 'இருப்பில் உள்ளவை மட்டும்';

  @override
  String get catalogueWithPhotoOnly => 'படம் உள்ளவை மட்டும்';

  @override
  String get catalogueRate => 'விலை';

  @override
  String get catalogueRateFrom => 'விலை முதல்';

  @override
  String get catalogueRateTo => 'விலை வரை';

  @override
  String get catalogueReceived => 'இடையில் வந்தது';

  @override
  String get catalogueReceivedFrom => 'முதல் வந்தது';

  @override
  String get catalogueReceivedTo => 'வரை வந்தது';

  @override
  String get catalogueApply => 'பயன்படுத்து';

  @override
  String get catalogueBrand => 'பிராண்ட்';

  @override
  String get catalogueCategory => 'வகை';

  @override
  String get catalogueSeason => 'பருவம்';

  @override
  String get catalogueClear => 'வடிகட்டிகளை அழி';

  @override
  String catalogueDefaultName(String party) {
    return '$party க்காக';
  }

  @override
  String get catalogueUntitled => 'புதிய தேர்வு';

  @override
  String get catalogueCartTitle => 'கூடை';

  @override
  String get catalogueCartEmpty =>
      'கூடை காலியாக உள்ளது. ஒரு டிசைனில் சேர் அழுத்துங்கள்.';

  @override
  String get catalogueSelectionName => 'தேர்வின் பெயர்';

  @override
  String get catalogueForParty => 'வாடிக்கையாளருக்கு';

  @override
  String get catalogueAnyone => 'யாராயினும்';

  @override
  String get catalogueSaveSelection => 'தேர்வைச் சேமி';

  @override
  String get catalogueEmptyCart => 'கூடையைக் காலி செய்';

  @override
  String get catalogueColsCode => 'டிசைன் எண்';

  @override
  String get catalogueColsName => 'பெயர்';

  @override
  String get catalogueColsSize => 'அளவு';

  @override
  String get catalogueColsRate => 'விலை';

  @override
  String get catalogueColsMrp => 'MRP';

  @override
  String get catalogueColsStock => 'இருப்பு';

  @override
  String get cataloguePrintPdf => 'அச்சு அல்லது PDF';

  @override
  String get catalogueExportExcel => 'Excel க்கு ஏற்றுமதி';

  @override
  String get catalogueShowPrices => 'விலைகளைக் காட்டு';

  @override
  String get catalogueShowStock => 'இருப்பிலுள்ள அளவுகளைக் காட்டு';

  @override
  String get catalogueDeleteConfirm =>
      'இந்தத் தேர்வை நீக்கவா? பகிர்ந்த இணைப்பு வேலை செய்யாது.';

  @override
  String get catalogueDelete => 'தேர்வை நீக்கு';

  @override
  String get catalogueShareTitle => 'பகிர்';

  @override
  String catalogueSharedUntil(String date) {
    return 'ஒரு இணைப்பு $date வரை செயலில் உள்ளது. புதியது பழையதை நிறுத்தும்.';
  }

  @override
  String get catalogueShareHint =>
      'உள்நுழையாமல் இந்தக் கையேட்டைத் திறக்கும் இணைப்பை உருவாக்கி, நகலெடுக்கவும் அல்லது WhatsApp இல் அனுப்பவும்.';

  @override
  String get catalogueLinkWorksFor => 'இணைப்பு செல்லும் காலம்';

  @override
  String catalogueDays(String n) {
    return '$n நாட்கள்';
  }

  @override
  String get catalogueNewLink => 'புதிய இணைப்பு';

  @override
  String get catalogueMakeLink => 'இணைப்பை உருவாக்கு';

  @override
  String get catalogueStopSharing => 'பகிர்வை நிறுத்து';

  @override
  String get catalogueLink => 'இணைப்பு';

  @override
  String get catalogueCopied => 'இணைப்பு நகலெடுக்கப்பட்டது.';

  @override
  String get catalogueCopy => 'நகலெடு';

  @override
  String get catalogueWhatsappTo => 'WhatsApp எண்';

  @override
  String catalogueSentDemo(String to) {
    return '$to க்கு அனுப்பியதாகப் பதிவானது (டெமோ: WhatsApp சேவை இன்னும் அமைக்கப்படவில்லை).';
  }

  @override
  String catalogueSent(String to) {
    return '$to க்கு WhatsApp இல் அனுப்பப்பட்டது.';
  }

  @override
  String get catalogueSendWhatsapp => 'WhatsApp இல் அனுப்பு';

  @override
  String catalogueOrderHint(String party) {
    return '$party க்கு விற்பனை ஆர்டர் செய்ய அளவு வாரியாக எண்ணிக்கை இடுங்கள்.';
  }

  @override
  String catalogueMrp(String v) {
    return 'MRP $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'துண்டுகள்: $pieces, வரிக்கு முன் $value';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'கையேடு தேர்வு $name இலிருந்து';
  }

  @override
  String get catalogueMakeOrder => 'விற்பனை ஆர்டர் உருவாக்கு';

  @override
  String catalogueForPartyLine(String party) {
    return '$party க்காக';
  }

  @override
  String get catalogueSelectionSubtitle => 'ஒரு கையேடு தேர்வு';

  @override
  String get catalogueLinkExpiredTitle =>
      'இந்தக் கையேடு இப்போது பகிரப்படவில்லை';

  @override
  String get catalogueLinkExpired =>
      'இணைப்பு காலாவதியானது அல்லது மாற்றப்பட்டது. அனுப்பியவரிடம் புதியதைக் கேளுங்கள்.';

  @override
  String get catalogueErrorsUnknownStyle => 'அந்த டிசைன் இப்போது இல்லை.';

  @override
  String get catalogueErrorsUnknownColor => 'இந்த டிசைனில் இந்த நிறம் இல்லை.';

  @override
  String get catalogueErrorsUnknownFile =>
      'படம் பதிவேறவில்லை. மீண்டும் முயலுங்கள்.';

  @override
  String get catalogueErrorsFileType =>
      'JPEG, PNG அல்லது WebP படத்தைப் பயன்படுத்துங்கள்.';

  @override
  String get catalogueErrorsFileTooLarge => 'படம் மிகப் பெரியது.';

  @override
  String get catalogueErrorsFileEmpty => 'படம் காலியாக உள்ளது.';

  @override
  String get catalogueErrorsDuplicateImage =>
      'இந்தப் படம் இந்த டிசைன், நிறத்தில் ஏற்கனவே உள்ளது.';

  @override
  String get catalogueErrorsNoLines => 'குறைந்தது ஒரு டிசைனைச் சேருங்கள்.';

  @override
  String get catalogueErrorsDuplicateLine =>
      'ஒரு டிசைனும் நிறமும் பட்டியலில் இருமுறை உள்ளன.';

  @override
  String get catalogueErrorsUnknownAccount =>
      'பட்டியலிலிருந்து வாடிக்கையாளரைத் தேர்ந்தெடுங்கள்.';

  @override
  String get catalogueErrorsInvalidDays =>
      'இணைப்பு 1 முதல் 90 நாள் வரை செல்லும்.';

  @override
  String get catalogueErrorsShareLinkStale =>
      'அந்த இணைப்பு இப்போது செயலில் இல்லை. முதலில் புதியதை உருவாக்குங்கள்.';

  @override
  String get catalogueErrorsInvalidPhone =>
      '10 இலக்க இந்திய கைபேசி எண்ணை இடுங்கள்.';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp செய்தியை ஏற்கவில்லை. பின்னர் முயலுங்கள்.';

  @override
  String get labelsTitle => 'பார்கோடு, விலை லேபிள்கள்';

  @override
  String get labelsSubtitle =>
      'லேபிள் ரோல், A4 தாள் அல்லது தொங்கு டேக்கில் பார்கோடு, MRP, அளவுடன் அச்சிடுங்கள்.';

  @override
  String get labelsSearch => 'பார்கோடை ஸ்கேன் செய்யவும் அல்லது பெயரை இடவும்';

  @override
  String get labelsWholeDesign => 'முழு டிசைன்';

  @override
  String get labelsAddOneEach => 'ஒவ்வொரு அளவிலும் ஒன்று';

  @override
  String get labelsAddStock => 'இருப்பில் ஒவ்வொரு துண்டுக்கும் ஒன்று';

  @override
  String get labelsItem => 'பொருள்';

  @override
  String get labelsBarcode => 'பார்கோடு';

  @override
  String get labelsMrp => 'MRP';

  @override
  String get labelsPrice => 'விலை';

  @override
  String get labelsLabels => 'லேபிள்கள்';

  @override
  String get labelsNoBarcode => 'இல்லை';

  @override
  String get labelsRemove => 'நீக்கு';

  @override
  String get labelsEmpty =>
      'லேபிள்களைச் சேர்க்க பொருட்களை ஸ்கேன் செய்யவும் அல்லது தேடவும், அல்லது டிசைனைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get labelsStock => 'லேபிள் வகை';

  @override
  String get labelsTemplatesRoll50x25 => 'ரோல், 50 x 25 mm, ஒரு வரிசை';

  @override
  String get labelsTemplatesRoll38x25x2 => 'ரோல், 38 x 25 mm, இரு வரிசை';

  @override
  String get labelsTemplatesA4x65 => 'A4 தாள், 65 லேபிள்கள் (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'தொங்கு டேக், 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'வணிகப் பெயர்';

  @override
  String get labelsFieldsName => 'பொருளின் பெயர்';

  @override
  String get labelsFieldsDesign => 'டிசைன் எண்';

  @override
  String get labelsFieldsColourSize => 'நிறம், அளவு';

  @override
  String get labelsFieldsMrp => 'MRP';

  @override
  String get labelsFieldsPrice => 'விற்பனை விலை';

  @override
  String get labelsFieldsExtra => 'கூடுதல் வரி';

  @override
  String get labelsExtraText => 'கூடுதல் வரி உரை';

  @override
  String get labelsExtraHint =>
      'எ.கா. தயாரித்த மாதம் அல்லது தயாரிப்பாளர் முகவரி.';

  @override
  String get labelsPreview => 'உண்மையான அளவில் முன்னோட்டம்';

  @override
  String get labelsPreviewEmpty => 'லேபிளைப் பார்க்க ஒரு பொருளைச் சேர்க்கவும்.';

  @override
  String labelsPrint(String n) {
    return '$n லேபிள்களை அச்சிடு';
  }

  @override
  String get labelsPrintHint =>
      'அச்சு சாளரம் லேபிள் அளவில் திறக்கும்; லேபிள் அச்சுப்பொறியைத் தேர்ந்து ஓரங்களை இல்லை என வையுங்கள்.';

  @override
  String get labelsNothingToPrint =>
      'அச்சிட எதுவும் இல்லை. சரக்கில் லேபிள்களைத் தேர்ந்து அச்சு அழுத்துங்கள்.';

  @override
  String get labelsForBill => 'இந்தச் சரக்குக்கு லேபிள்கள் அச்சிடு';

  @override
  String get labelsPrintLabels => 'லேபிள்கள் அச்சிடு';

  @override
  String get shareSendWhatsApp => 'வாட்ஸ்அப்பில் அனுப்பு';

  @override
  String get shareSend => 'அனுப்பு';

  @override
  String get shareMobile => 'மொபைல் எண்';

  @override
  String shareSentTo(String to) {
    return '$to எண்ணுக்கு வாட்ஸ்அப் அனுப்பப்பட்டது';
  }

  @override
  String get shareAgain => 'மீண்டும் அனுப்பு';

  @override
  String get shareFailed =>
      'அனுப்பப்படவில்லை. எண்ணைச் சரிபார்த்து மீண்டும் முயலுங்கள்.';

  @override
  String get shareAutoFailed =>
      'பில் தானாக வாட்ஸ்அப்பில் போகவில்லை. மீண்டும் அனுப்புங்கள்.';

  @override
  String get shareRemind => 'நினைவூட்டு';

  @override
  String get shareRemindAll => 'தாமதமான அனைவருக்கும் நினைவூட்டு';

  @override
  String get shareRemindAllConfirm =>
      'தாமதமான பில் உள்ள ஒவ்வொரு வாடிக்கையாளருக்கும் வாட்ஸ்அப்பில் பணம் நினைவூட்டல் அனுப்பவா?';

  @override
  String get shareReminded => 'நினைவூட்டல் அனுப்பப்பட்டது';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n நினைவூட்டல்கள் அனுப்பப்பட்டன',
      zero: 'நினைவூட்டல் எதுவும் அனுப்பப்படவில்லை',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'மொபைல் எண் இல்லை, அழையுங்கள்: $names';
  }

  @override
  String get shareLogTitle => 'வாட்ஸ்அப் பதிவு';

  @override
  String get shareLogSubtitle =>
      'வாடிக்கையாளர்களுக்கு அனுப்பிய பில்கள், இன்வாய்ஸ்கள், நினைவூட்டல்கள், செய்திகள், புதியவை முதலில்.';

  @override
  String get shareFilterAll => 'அனைத்தும்';

  @override
  String get shareFilterSent => 'அனுப்பியவை';

  @override
  String get shareFilterFailed => 'தோல்வி';

  @override
  String get shareThisMonth => 'எண்ணிக்கை இந்த மாதத்துக்கானது';

  @override
  String get shareWhen => 'எப்போது';

  @override
  String get shareToCol => 'யாருக்கு';

  @override
  String get shareKind => 'வகை';

  @override
  String get shareMessage => 'செய்தி';

  @override
  String get shareStatus => 'நிலை';

  @override
  String shareBy(String name) {
    return 'அனுப்பியவர் $name';
  }

  @override
  String get shareNone =>
      'இன்னும் செய்திகள் இல்லை. வாட்ஸ்அப்பில் அனுப்பும் பில்கள், இன்வாய்ஸ்கள், நினைவூட்டல்கள் இங்கே தெரியும்.';

  @override
  String get shareKindsBillShare => 'கவுண்டர் பில்';

  @override
  String get shareKindsInvoiceShare => 'இன்வாய்ஸ்';

  @override
  String get shareKindsPaymentReminderLink => 'பணம் நினைவூட்டல்';

  @override
  String get shareKindsPaymentReminder => 'பணம் நினைவூட்டல்';

  @override
  String get shareKindsOrderConfirmation => 'ஆர்டர் உறுதிப்படுத்தல்';

  @override
  String get shareKindsFollowUp => 'பின்தொடர்தல்';

  @override
  String get shareExpiredTitle => 'இந்த இணைப்பு இனி செயலில் இல்லை';

  @override
  String get shareExpired =>
      'இணைப்பு காலாவதியானது. கடையிடம் மீண்டும் அனுப்பச் சொல்லுங்கள்.';

  @override
  String get shareStatement => 'கணக்கு அறிக்கை';

  @override
  String shareStatementFor(String name) {
    return '$name கணக்கு அறிக்கை';
  }

  @override
  String shareAsOf(String date) {
    return '$date நிலவரப்படி';
  }

  @override
  String get shareBalance => 'செலுத்த வேண்டியது';

  @override
  String shareOverdue(String amount) {
    return '₹$amount தாமதம்';
  }

  @override
  String get shareBill => 'பில்';

  @override
  String get shareDate => 'தேதி';

  @override
  String get shareDue => 'செலுத்த வேண்டிய நாள்';

  @override
  String get shareLate => 'தாமதம்';

  @override
  String get shareAmount => 'தொகை';

  @override
  String shareDays(num n) {
    return '$n நாள்';
  }

  @override
  String get shareNotDue => 'இன்னும் கெடு வரவில்லை';

  @override
  String get shareNothingOpen => 'எதுவும் நிலுவையில் இல்லை. நன்றி.';

  @override
  String shareAdvance(String amount) {
    return 'கழிவு, முன்பணம்: ₹$amount';
  }

  @override
  String get sharePayTo => 'இங்கே செலுத்துங்கள்';

  @override
  String get shareStatementNote =>
      'ஏற்கனவே செலுத்தியிருந்தால் இந்த அறிக்கையைப் புறக்கணிக்கவும் அல்லது பணம் செலுத்திய விவரத்தை எங்களுக்கு அனுப்பவும்.';

  @override
  String get shareErrorsInvalidPhone => '10 இலக்க மொபைல் எண்ணை உள்ளிடுங்கள்.';

  @override
  String get shareErrorsNothingOutstanding => 'நிலுவை எதுவும் இல்லை.';

  @override
  String get shareErrorsSendFailed =>
      'வாட்ஸ்அப் செய்தியை ஏற்கவில்லை. மீண்டும் முயலுங்கள்.';

  @override
  String get shareErrorsOutside24hWindow =>
      'இந்த வாடிக்கையாளர் 24 மணி நேரத்தில் செய்தி அனுப்பவில்லை, எனவே அங்கீகரிக்கப்பட்ட டெம்ப்ளேட் தேவை. செய்தி டெம்ப்ளேட்களில் அதன் பெயரைச் சேர்க்கவும்.';

  @override
  String get shareErrorsBillVoid => 'இந்த பில் ரத்து செய்யப்பட்டது.';

  @override
  String get shareErrorsInvoiceCancelled =>
      'இந்த இன்வாய்ஸ் ரத்து செய்யப்பட்டது.';

  @override
  String get shareErrorsUnknownTemplate =>
      'செய்தி டெம்ப்ளேட் காப்பகத்தில் உள்ளது. செய்தி டெம்ப்ளேட்களில் மீட்டெடுக்கவும்.';

  @override
  String get launcherTitle => 'அனைத்து செயல்கள்';

  @override
  String get launcherSubtitle =>
      'ஒவ்வொரு பதிவு, திரை, அறிக்கை ஒரே இடத்தில். நட்சத்திரம் டைலை என் மெனுவில் சேர்க்கும்.';

  @override
  String get launcherFilter => 'செயலைத் தேட தட்டச்சு செய்யுங்கள்';

  @override
  String get launcherPin => 'என் மெனுவில் சேர்';

  @override
  String get launcherUnpin => 'என் மெனுவிலிருந்து நீக்கு';

  @override
  String get launcherSaveFailed =>
      'என் மெனுவைச் சேமிக்க முடியவில்லை. மீண்டும் முயலுங்கள்.';

  @override
  String get launcherNoMatch => 'இதற்குப் பொருத்தம் எதுவும் இல்லை.';

  @override
  String get launcherDone => 'முடிந்தது';

  @override
  String get launcherEdit => 'டைல்களை மாற்று';

  @override
  String get launcherAddTiles => 'டைல்களைச் சேர்';

  @override
  String get launcherReset => 'இயல்பு டைல்களுக்குத் திரும்பு';

  @override
  String get launcherMoveLeft => 'முன்னே நகர்த்து';

  @override
  String get launcherMoveRight => 'பின்னே நகர்த்து';

  @override
  String get launcherEmpty =>
      'இன்னும் டைல்கள் இல்லை. அனைத்து செயல்களிலிருந்து சேருங்கள்.';

  @override
  String get launcherMyMenu => 'என் மெனு';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'வணக்கம் $name. உங்கள் சொந்த டைல்கள்; டைல்களை மாற்று மூலம் மாற்றுங்கள்.';
  }

  @override
  String get launcherWaiting => 'உங்களுக்காகக் காத்திருப்பவை';

  @override
  String get launcherSalesToday => 'இன்றைய விற்பனை';

  @override
  String get launcherToCollect => 'வசூலிக்க வேண்டியது';

  @override
  String get launcherToPay => 'செலுத்த வேண்டியது';

  @override
  String launcherOverdue(String amount) {
    return '$amount தாமதம்';
  }

  @override
  String get launcherFullDashboard => 'முழு டாஷ்போர்டு';

  @override
  String get launcherGroupsEntries => 'புதிய பதிவு';

  @override
  String get launcherGroupsPos => 'ஷோரூம் கவுண்டர்';

  @override
  String get launcherGroupsSales => 'விற்பனை';

  @override
  String get launcherGroupsPurchase => 'கொள்முதல்';

  @override
  String get launcherGroupsInventory => 'இருப்பு';

  @override
  String get launcherGroupsManufacturing => 'உற்பத்தி, ஜாப் வேலை';

  @override
  String get launcherGroupsAccounts => 'கணக்கு, GST';

  @override
  String get launcherGroupsBanking => 'வங்கி';

  @override
  String get launcherGroupsReports => 'அறிக்கைகள்';

  @override
  String get launcherGroupsCrm => 'வாடிக்கையாளர், வாட்ஸ்அப்';

  @override
  String get launcherGroupsHr => 'பணியாளர், சம்பளம்';

  @override
  String get launcherGroupsExpenses => 'செலவுகள்';

  @override
  String get launcherGroupsAssets => 'நிலையான சொத்துகள்';

  @override
  String get launcherGroupsProjects => 'திட்டங்கள்';

  @override
  String get launcherGroupsHome => 'முகப்பு';

  @override
  String get launcherGroupsSettings => 'அமைப்புகள்';

  @override
  String get launcherLaunchpad => 'தொடக்கப் பலகை';

  @override
  String launcherPinned(String n) {
    return '$n பின் செய்தவை';
  }

  @override
  String get launcherRecent => 'சமீபத்தில் திறந்தவை';

  @override
  String get launcherMoney => 'இன்றைய பணம்';

  @override
  String launcherVsYesterday(String pct) {
    return 'நேற்றை விட $pct%';
  }

  @override
  String launcherCounterBills(num n) {
    return '$n கவுண்டர் பில்கள்';
  }

  @override
  String get launcherCashToday => 'கவுண்டர்களில் ரொக்கம்';

  @override
  String get launcherUpiToday => 'கவுண்டர்களில் UPI';

  @override
  String get launcherCardToday => 'கவுண்டர்களில் அட்டை';

  @override
  String get launcherOverdueToCollect => 'தாமதமான வசூல்';

  @override
  String get launcherAllTab => 'அனைத்தும்';

  @override
  String get launcherGridView => 'டைல்கள்';

  @override
  String get launcherListView => 'பட்டியல்';

  @override
  String get launcherOpen => 'திற';

  @override
  String launcherCount(String n) {
    return 'நீங்கள் திறக்கக்கூடிய $n திரைகள், பதிவுகள்';
  }

  @override
  String get menuHMasters => 'மாஸ்டர்கள்';

  @override
  String get menuHTransaction => 'பரிவர்த்தனை';

  @override
  String get menuHReports => 'அறிக்கைகள்';

  @override
  String get menuHAccountReports => 'கணக்கு அறிக்கைகள்';

  @override
  String get menuHPayroll => 'சம்பளம்';

  @override
  String get menuHUtility => 'பயன்பாடுகள்';

  @override
  String get menuHChat => 'அரட்டை';

  @override
  String get menuHExit => 'வெளியேறு';

  @override
  String get menuSoon => 'விரைவில்';

  @override
  String get menuNotBuilt => 'இன்னும் உருவாக்கவில்லை; பட்டியலில் உள்ளது.';

  @override
  String get menuFilter => 'வடிகட்டு';

  @override
  String get menuHome => 'முகப்பு';

  @override
  String get menuOpenScreens => 'திறந்த திரைகள்';

  @override
  String get menuGAccount => 'கணக்கு';

  @override
  String get menuGStock => 'இருப்பு';

  @override
  String get menuGParameters => 'அளவுருக்கள்';

  @override
  String get menuGPromotion => 'விளம்பர மாஸ்டர்';

  @override
  String get menuGSales => 'விற்பனை பரிவர்த்தனை';

  @override
  String get menuGAccounting => 'கணக்கியல் பரிவர்த்தனை';

  @override
  String get menuGPurchase => 'கொள்முதல் பரிவர்த்தனை';

  @override
  String get menuGJobwork => 'ஜாப்வேலை பரிவர்த்தனை';

  @override
  String get menuGOther => 'பிற பரிவர்த்தனை';

  @override
  String get menuGSalesReports => 'விற்பனை அறிக்கைகள்';

  @override
  String get menuGStockReports => 'இருப்பு அறிக்கைகள்';

  @override
  String get menuGCustomReports => 'சொந்த அறிக்கைகள், சரிபார்ப்பு';

  @override
  String get menuGAccountReportsGroup => 'கணக்கு அறிக்கைக் குழு';

  @override
  String get menuGFinalReportGroup => 'இறுதி அறிக்கைக் குழு';

  @override
  String get menuGMasterGroup => 'மாஸ்டர் குழு';

  @override
  String get menuGPayrollTransactionGroup => 'சம்பளப் பரிவர்த்தனைக் குழு';

  @override
  String get menuGReportGroup => 'அறிக்கைக் குழு';

  @override
  String get menuGUtilityGroup => 'பயன்பாட்டுக் குழு';

  @override
  String get menuGBarcodeGroup => 'பார்கோடு குழு';

  @override
  String get menuGExtraUtility => 'கூடுதல் பயன்பாடுகள்';

  @override
  String get menuGUserManagement => 'பயனர் மேலாண்மை';

  @override
  String get menuGSoftwareUtility => 'மென்பொருள் பயன்பாடுகள்';

  @override
  String get menuGChatGroup => 'அரட்டை, வாடிக்கையாளர்';

  @override
  String get menuIAccountMaster => 'கணக்கு மாஸ்டர்';

  @override
  String get menuIBankMaster => 'வங்கி மாஸ்டர்';

  @override
  String get menuIOpeningBalance => 'தொடக்க இருப்பு';

  @override
  String get menuIBalanceSheetGroup => 'இருப்புநிலைக் குழு';

  @override
  String get menuIAccountGroup => 'கணக்குக் குழு';

  @override
  String get menuIAccountCategory => 'கணக்கு வகை';

  @override
  String get menuIRegionMaster => 'பகுதி மாஸ்டர்';

  @override
  String get menuICustomerSubCategory => 'வாடிக்கையாளர் துணை வகை';

  @override
  String get menuIRemarksMaster => 'குறிப்பு மாஸ்டர்';

  @override
  String get menuICompanyMaster => 'நிறுவன மாஸ்டர்';

  @override
  String get menuICountryMaster => 'நாடு மாஸ்டர்';

  @override
  String get menuIDepartmentMaster => 'துறை மாஸ்டர்';

  @override
  String get menuIManufactureCompany => 'தயாரிப்பு நிறுவனம்';

  @override
  String get menuIBrandMaster => 'பிராண்ட் மாஸ்டர்';

  @override
  String get menuIProductMaster => 'பொருள் மாஸ்டர்';

  @override
  String get menuIStyleMaster => 'ஸ்டைல் மாஸ்டர்';

  @override
  String get menuIItemGroup => 'பொருள் குழு';

  @override
  String get menuIItemMaster => 'பொருள் மாஸ்டர்';

  @override
  String get menuIDesignMaster => 'வடிவமைப்பு மாஸ்டர்';

  @override
  String get menuIColorMaster => 'நிற மாஸ்டர்';

  @override
  String get menuISizeGroupMaster => 'அளவுக் குழு மாஸ்டர்';

  @override
  String get menuISizeMaster => 'அளவு மாஸ்டர்';

  @override
  String get menuIFabric => 'துணி';

  @override
  String get menuISleeves => 'கை';

  @override
  String get menuINeck => 'கழுத்து';

  @override
  String get menuIFit => 'பொருத்தம்';

  @override
  String get menuISeason => 'பருவம்';

  @override
  String get menuIStyleAttr => 'ஸ்டைல்';

  @override
  String get menuIGender => 'பாலினம்';

  @override
  String get menuITypeMaster => 'வகை மாஸ்டர்';

  @override
  String get menuISubCategory9 => 'துணை வகை 9';

  @override
  String get menuISubCategory10 => 'துணை வகை 10';

  @override
  String get menuIMaterialMaster => 'பொருள் மூல மாஸ்டர்';

  @override
  String get menuIFixedBarcode => 'நிலையான பார்கோடு';

  @override
  String get menuIMinMaxStock => 'குறைந்த அதிக இருப்பு';

  @override
  String get menuIOpeningStock => 'தொடக்க இருப்பு';

  @override
  String get menuISeasonMaster => 'பருவ மாஸ்டர்';

  @override
  String get menuIProcessMaster => 'செயல்முறை மாஸ்டர்';

  @override
  String get menuIOrderType => 'ஆர்டர் வகை';

  @override
  String get menuIWarehouses => 'கிடங்குகள், கடைகள்';

  @override
  String get menuIDayBookMaster => 'நாள்பதிவு மாஸ்டர்';

  @override
  String get menuILedgerParameter => 'பேரேடு அளவுரு';

  @override
  String get menuISalesmanMaster => 'விற்பனையாளர் மாஸ்டர்';

  @override
  String get menuITaxMaster => 'வரி மாஸ்டர்';

  @override
  String get menuITdsMaster => 'TDS மாஸ்டர்';

  @override
  String get menuITcsTaxMaster => 'TCS வரி மாஸ்டர்';

  @override
  String get menuIFinanceYearMaster => 'நிதியாண்டு மாஸ்டர்';

  @override
  String get menuIHsnCodeMaster => 'HSN குறியீடு மாஸ்டர்';

  @override
  String get menuISalesReturnReason => 'விற்பனை திருப்பக் காரணம்';

  @override
  String get menuISalesmanCommTarget => 'விற்பனையாளர் கமிஷன் இலக்கு';

  @override
  String get menuIItemDiscountSetup => 'பொருள் தள்ளுபடி அமைப்பு';

  @override
  String get menuIPromoMaster => 'ப்ரோமோ மாஸ்டர்';

  @override
  String get menuISisSetup => 'SIS அமைப்பு';

  @override
  String get menuIItemCommissionSetup => 'பொருள் கமிஷன் அமைப்பு';

  @override
  String get menuISourceMaster => 'மூல மாஸ்டர்';

  @override
  String get menuISalesOrderWh => 'விற்பனை ஆர்டர் (மொத்தம்)';

  @override
  String get menuIWhSalesOrderCancel => 'மொத்த ஆர்டர் ரத்து';

  @override
  String get menuIDeliveryOrder => 'டெலிவரி ஆர்டர் (D.O)';

  @override
  String get menuIDeliveryChallan => 'டெலிவரி சலான்';

  @override
  String get menuISalesBillWh => 'விற்பனை பில் (மொத்தம்)';

  @override
  String get menuIDeliveryChallanReturnWh =>
      'டெலிவரி சலான் திருப்பம் (மொத்தம்)';

  @override
  String get menuICreditNoteWh => 'வரவுக் குறிப்பு (மொத்தம்)';

  @override
  String get menuIAdvanceReceipt => 'முன்பணம் ரசீது';

  @override
  String get menuICashPayRec => 'ரொக்கம் செலுத்து/பெறு';

  @override
  String get menuIBankPayRec => 'வங்கி செலுத்து/பெறு';

  @override
  String get menuIBillWiseReceipt => 'பில் வாரியான ரசீது';

  @override
  String get menuICardReceipt => 'அட்டை ரசீது';

  @override
  String get menuIJournalVoucher => 'ஜர்னல் வவுச்சர்';

  @override
  String get menuIContraVoucher => 'கான்ட்ரா வவுச்சர்';

  @override
  String get menuIPurchaseOrder => 'கொள்முதல் ஆர்டர்';

  @override
  String get menuIInwardChallan => 'உள்வரவு சலான்';

  @override
  String get menuIPurchase => 'கொள்முதல்';

  @override
  String get menuIGoodsReturn => 'பொருள் திருப்பம்';

  @override
  String get menuIDebitNote => 'பற்றுக் குறிப்பு';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'வேலை வழங்கல்';

  @override
  String get menuIJobReceipt => 'வேலை வரவு';

  @override
  String get menuIJobWorkIssue => 'ஜாப்வேலை வழங்கல்';

  @override
  String get menuIJobWorkReceipt => 'ஜாப்வேலை வரவு';

  @override
  String get menuIStockAdjustment => 'இருப்பு சரிசெய்தல்';

  @override
  String get menuISampleIssue => 'மாதிரி வழங்கல்';

  @override
  String get menuISampleReceive => 'மாதிரி வரவு';

  @override
  String get menuIQuotation => 'மேற்கோள்';

  @override
  String get menuILrTransportEntry => 'LR/போக்குவரத்து பதிவு';

  @override
  String get menuIEWayBill => 'இ-வே பில்';

  @override
  String get menuIRePackingBox => 'மறு பொதி பெட்டி';

  @override
  String get menuIReOpenBox => 'பெட்டியை மீண்டும் திற';

  @override
  String get menuILedgerReport => 'பேரேடு அறிக்கை';

  @override
  String get menuICashBookReport => 'ரொக்கப் புத்தக அறிக்கை';

  @override
  String get menuIBankReport => 'வங்கி அறிக்கை';

  @override
  String get menuIBankReconciliation => 'வங்கி சமரசம்';

  @override
  String get menuIGroupMonthSummary => 'குழு/மாத சுருக்கம்';

  @override
  String get menuICashBankExpense => 'ரொக்க வங்கிச் செலவு';

  @override
  String get menuICashFlowReportGroup => 'பணப்புழக்க அறிக்கை';

  @override
  String get menuIBillToBillAdjustment => 'பில் முதல் பில் சரிசெய்தல்';

  @override
  String get menuIMsmeReport => 'MSME அறிக்கை';

  @override
  String get menuIOutstandingPayable => 'நிலுவை செலுத்த வேண்டியது';

  @override
  String get menuIOutstandingReceivable => 'நிலுவை வர வேண்டியது';

  @override
  String get menuIDebtorsList => 'கடனாளிகள் பட்டியல்';

  @override
  String get menuICreditorList => 'கடன் கொடுத்தோர் பட்டியல்';

  @override
  String get menuIInterestReport => 'வட்டி அறிக்கை';

  @override
  String get menuIDepreciationAssetReport => 'தேய்மான சொத்து அறிக்கை';

  @override
  String get menuIJournalVoucherReport => 'ஜர்னல் வவுச்சர் அறிக்கை';

  @override
  String get menuIGstReport => 'GST அறிக்கை';

  @override
  String get menuITdsReport => 'TDS அறிக்கை';

  @override
  String get menuITdsForm26q => 'TDS படிவம் 26Q';

  @override
  String get menuIFinalReport => 'இறுதி அறிக்கை';

  @override
  String get menuIRcmRegister => 'RCM பதிவேடு';

  @override
  String get menuITcsReport => 'TCS அறிக்கை';

  @override
  String get menuIEmployee => 'பணியாளர்';

  @override
  String get menuIEmployeeKyc => 'பணியாளர் KYC புதுப்பிப்பு';

  @override
  String get menuISalaryDeduction => 'சம்பளப் பிடித்தம்';

  @override
  String get menuIWeekOff => 'வார விடுமுறை';

  @override
  String get menuIWeekOffCancel => 'வார விடுமுறை ரத்து';

  @override
  String get menuIHolidays => 'விடுமுறைகள்';

  @override
  String get menuIDesignation => 'பதவி';

  @override
  String get menuIDepartment => 'துறை';

  @override
  String get menuIShiftMaster => 'ஷிப்ட் மாஸ்டர்';

  @override
  String get menuIDailyAttendance => 'தினசரி வருகை';

  @override
  String get menuILeaveApplication => 'விடுப்பு விண்ணப்பம்';

  @override
  String get menuIAdvanceSalary => 'முன்பணச் சம்பளம் (உபாட்)';

  @override
  String get menuILoanIssue => 'கடன் வழங்கல்';

  @override
  String get menuILoanReceipt => 'கடன் வசூல்';

  @override
  String get menuIMonthlySalary => 'மாதச் சம்பளம்';

  @override
  String get menuIStipend => 'உதவித்தொகை';

  @override
  String get menuISalaryPayment => 'சம்பளம் செலுத்தல்';

  @override
  String get menuIStipendPayment => 'உதவித்தொகை செலுத்தல்';

  @override
  String get menuIIncentive => 'ஊக்கத்தொகை';

  @override
  String get menuIOtherDeduction => 'பிற பிடித்தம்';

  @override
  String get menuIAdvanceLoanRequest => 'முன்பணம், கடன் கோரிக்கை';

  @override
  String get menuIMonthlyAttendanceRegister => 'மாத வருகைப் பதிவேடு';

  @override
  String get menuIDayWiseAttendanceRegister => 'நாள் வாரியான வருகைப் பதிவேடு';

  @override
  String get menuISalarySlipRegister => 'சம்பளச் சீட்டுப் பதிவேடு';

  @override
  String get menuIPtReport => 'PT அறிக்கை';

  @override
  String get menuILeaveReport => 'விடுப்பு அறிக்கை';

  @override
  String get menuIMenuLogSessionReport => 'மெனு பதிவு அமர்வு அறிக்கை';

  @override
  String get menuIPayrollParameter => 'சம்பள அளவுரு';

  @override
  String get menuIDeviceSettings => 'சாதன அமைப்புகள்';

  @override
  String get menuIBarcodePrint => 'பார்கோடு அச்சு';

  @override
  String get menuIBarcodeSearch => 'பார்கோடு தேடல்';

  @override
  String get menuIBarcodeDesignImage => 'பார்கோடு/வடிவமைப்புப் படம்';

  @override
  String get menuIRateUpdation => 'விலை புதுப்பிப்பு';

  @override
  String get menuIImageCatalogue => 'படப் பட்டியல்';

  @override
  String get menuISalesDiscountMaster => 'விற்பனைத் தள்ளுபடி மாஸ்டர்';

  @override
  String get menuISalesDiscountDesignWise => 'வடிவமைப்பு வாரியான தள்ளுபடி';

  @override
  String get menuISalesmanCommission => 'விற்பனையாளர் கமிஷன்';

  @override
  String get menuIDayClose => 'நாள் முடிவு';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'மின்னஞ்சல்';

  @override
  String get menuIBulkMessenger => 'மொத்தச் செய்தி';

  @override
  String get menuILogHistoryReport => 'பதிவு வரலாறு அறிக்கை';

  @override
  String get menuIOutstandingAdj => 'நிலுவை சரிசெய்தல்';

  @override
  String get menuIResetPhysicalStock => 'உண்மை இருப்பு மீட்டமை';

  @override
  String get menuIPhysicalStockVerification => 'உண்மை இருப்பு சரிபார்ப்பு';

  @override
  String get menuIMerge => 'இணை';

  @override
  String get menuISalesStockLedgerDiff => 'விற்பனை இருப்புப் பேரேடு வேறுபாடு';

  @override
  String get menuINoteReport => 'குறிப்பு அறிக்கை';

  @override
  String get menuIEInvoiceUpload => 'இ-இன்வாய்ஸ் பதிவேற்றம்';

  @override
  String get menuIEWayBillUpload => 'இ-வே பில் பதிவேற்றம்';

  @override
  String get menuIAutoOutstandingReminder => 'தானியங்கி நிலுவை நினைவூட்டல்';

  @override
  String get menuIUsers => 'பயனர்கள்';

  @override
  String get menuIUserGroup => 'பயனர் குழு';

  @override
  String get menuICurrentDateSetting => 'தற்போதைய தேதி அமைப்பு';

  @override
  String get menuIDataLockTillDate => 'தேதி வரை தரவுப் பூட்டு';

  @override
  String get menuIMyDevices => 'என் சாதனங்கள்';

  @override
  String get menuILedgerStockPosting => 'பேரேடு, இருப்புப் பதிவு';

  @override
  String get menuIReportType => 'அறிக்கை வகை';

  @override
  String get menuIUserParameter => 'பயனர் அளவுரு';

  @override
  String get menuIBalanceTransfer => 'இருப்பு மாற்றம்';

  @override
  String get menuIDatabaseBackup => 'தரவுத்தள காப்பு';

  @override
  String get menuISoftwareUpdate => 'மென்பொருள் புதுப்பிப்பு';

  @override
  String get menuIDbUpdates => 'DB புதுப்பிப்புகள்';

  @override
  String get menuIScheduleBackup => 'காப்பு அட்டவணை';

  @override
  String get menuIExportVouchersPdf => 'வவுச்சர்களை PDF ஆக ஏற்றுமதி';

  @override
  String get menuIEmployeeDepartment => 'துறை';

  @override
  String get menuISensitiveChanges => 'முக்கிய மாற்றங்கள்';

  @override
  String get menuITransporterMaster => 'போக்குவரத்து நிறுவன மாஸ்டர்';

  @override
  String get listsSubtitle =>
      'இந்த வணிகத்தின் சொந்தப் பட்டியல். பதிவை நீக்குவதற்குப் பதிலாகக் காப்பகப்படுத்துங்கள்; பழைய ஆவணங்களில் அதன் மதிப்பு நிலைக்கும்.';

  @override
  String get listsName => 'பெயர்';

  @override
  String get listsCode => 'குறியீடு';

  @override
  String get listsNote => 'குறிப்பு';

  @override
  String get listsNewEntry => 'புதிய பதிவு';

  @override
  String listsShowArchived(String n) {
    return 'காப்பகப்படுத்தியவற்றைக் காட்டு ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n பதிவுகள்',
      one: '$n பதிவு',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'காப்பகப்படுத்து';

  @override
  String get listsRestore => 'மீட்டெடு';

  @override
  String get listsNoMatch => 'தேடலுக்குப் பொருந்தும் பதிவு இல்லை.';

  @override
  String get listsEmpty =>
      'இந்தப் பட்டியலில் இன்னும் எதுவும் இல்லை. முதல் பதிவை மேல் வரியில் எழுதுங்கள்.';

  @override
  String get listsEmptyReadOnly => 'இந்தப் பட்டியலில் இன்னும் எதுவும் இல்லை.';

  @override
  String get listsOtherLists => 'பட்டியல்கள்';

  @override
  String get listsErrorsLookupTaken =>
      'இந்தப் பட்டியலில் இந்தப் பெயரில் ஏற்கனவே பதிவு உள்ளது.';

  @override
  String get listsErrorsEndBeforeStart =>
      'முடிவுத் தேதி தொடக்கத் தேதிக்கு முன் உள்ளது.';

  @override
  String get limitsTitle => 'குறைந்தபட்ச மற்றும் அதிகபட்ச இருப்பு';

  @override
  String get limitsSubtitle =>
      'ஒவ்வொரு பொருளையும் கிடங்கில் குறைந்தது மற்றும் அதிகபட்சம் எவ்வளவு வைத்திருக்க வேண்டும் என்பதை அமைக்கவும். குறைந்தபட்சத்திற்குக் கீழுள்ள பொருட்கள் குறிக்கப்படும், எதை ஆர்டர் செய்ய வேண்டும் என்று தெரியும்.';

  @override
  String get limitsWarehouse => 'கிடங்கு';

  @override
  String limitsOnlyBelow(String n) {
    return 'குறைந்தபட்சத்திற்குக் கீழ் மட்டும் ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n வரிசைகள் சேமிக்கப்பட்டன',
      one: '$n வரிசை சேமிக்கப்பட்டது',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return 'மாறிய $n வரிசைகளைச் சேமி';
  }

  @override
  String get limitsItem => 'பொருள்';

  @override
  String get limitsInStock => 'இருப்பில்';

  @override
  String get limitsMin => 'குறைந்தபட்சம்';

  @override
  String get limitsMax => 'அதிகபட்சம்';

  @override
  String get limitsToOrder => 'ஆர்டர் செய்ய';

  @override
  String get limitsBelow => 'குறைந்தபட்சத்திற்குக் கீழ்';

  @override
  String get limitsNoMatch => 'பொருந்தும் பொருள் இல்லை.';

  @override
  String get limitsEmpty =>
      'இன்னும் பொருட்கள் இல்லை. முதலில் பொருட்கள் அல்லது ஸ்டைல்களைச் சேர்த்து, பிறகு இங்கே வரம்புகளை அமைக்கவும்.';

  @override
  String get limitsErrorsMaxBelowMin =>
      'அதிகபட்சம் குறைந்தபட்சத்தை விடக் குறைவாக இருக்கக் கூடாது.';

  @override
  String get billReceiptTitleReceivable => 'பில் வாரியான ரசீது';

  @override
  String get billReceiptTitlePayable => 'பில் வாரியான கட்டணம்';

  @override
  String get billReceiptSubtitleReceivable =>
      'பெற்ற தொகையைப் பதிவு செய்து, அது எந்த பில்களுக்கானது என்பதைத் தேர்வு செய்யுங்கள். மீதம் கணக்கில் இருந்து பழைய பில்களை முதலில் தீர்க்கும்.';

  @override
  String get billReceiptSubtitlePayable =>
      'சப்ளையருக்கு செலுத்திய தொகையைப் பதிவு செய்து, அது எந்த பில்களுக்கானது என்பதைத் தேர்வு செய்யுங்கள். மீதம் கணக்கில் இருந்து பழைய பில்களை முதலில் தீர்க்கும்.';

  @override
  String get billReceiptTabReceipt => 'ரசீது';

  @override
  String get billReceiptTabPayment => 'கட்டணம்';

  @override
  String get billReceiptCustomer => 'வாடிக்கையாளர்';

  @override
  String get billReceiptSupplier => 'சப்ளையர்';

  @override
  String get billReceiptChoose => 'தரப்பைத் தேர்வு செய்க';

  @override
  String get billReceiptAccount => 'ரொக்கம் அல்லது வங்கிக் கணக்கு';

  @override
  String get billReceiptAmountReceived => 'பெற்ற தொகை';

  @override
  String get billReceiptAmountPaid => 'செலுத்திய தொகை';

  @override
  String get billReceiptReference => 'குறிப்பு (காசோலை, UPI ஐடி)';

  @override
  String get billReceiptOpenBills => 'நிலுவை பில்கள்';

  @override
  String billReceiptAdvance(String amount) {
    return 'ஏற்கனவே கணக்கில்: $amount';
  }

  @override
  String get billReceiptFillOldest => 'பழையதிலிருந்து நிரப்பு';

  @override
  String get billReceiptClear => 'அழி';

  @override
  String get billReceiptBill => 'பில்';

  @override
  String get billReceiptDueOn => 'கடைசி தேதி';

  @override
  String get billReceiptPending => 'நிலுவை';

  @override
  String get billReceiptPayNow => 'இப்போது செலுத்து';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n நாட்கள் தாமதம்',
      one: '$n நாள் தாமதம்',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'இந்தத் தரப்பிற்கு நிலுவை பில்கள் இல்லை.';

  @override
  String get billReceiptOnBills => 'பில்களில்';

  @override
  String get billReceiptOnAccount => 'கணக்கில்';

  @override
  String get billReceiptSaveReceipt => 'ரசீதைச் சேமி';

  @override
  String get billReceiptSavePayment => 'கட்டணத்தைச் சேமி';

  @override
  String billReceiptSaved(String number) {
    return '$number ஆகச் சேமிக்கப்பட்டது';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'பில்களின் கூட்டுத்தொகை தொகையை விட அதிகம்.';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'இந்த பில்களில் ஒன்று இனி நிலுவையில் இல்லை. பக்கத்தை மீண்டும் ஏற்றி முயலவும்.';

  @override
  String get billReceiptErrorsOverBill =>
      'ஒரு தொகை பில்லின் நிலுவையை விட அதிகம்.';

  @override
  String get billReceiptErrorsAmountRequired => 'தொகையை உள்ளிடவும்.';

  @override
  String get billReceiptErrorsBillTwice => 'ஒரே பில் இரண்டு முறை உள்ளது.';

  @override
  String get booksTitle => 'கணக்குப் புத்தகங்கள்';

  @override
  String get booksSubtitle =>
      'ரொக்கம் மற்றும் வங்கி நடவடிக்கைகள், ஒரு குழுவின் மாதவாரி நிலை, ரொக்கம் மற்றும் வங்கியிலிருந்து செய்த செலவு, பணம் எங்கிருந்து வந்து எங்கே சென்றது.';

  @override
  String get booksCash => 'ரொக்கப் புத்தகம்';

  @override
  String get booksBank => 'வங்கிப் புத்தகம்';

  @override
  String get booksGroup => 'குழு மாதவாரி';

  @override
  String get booksExpense => 'ரொக்கம் மற்றும் வங்கிச் செலவு';

  @override
  String get booksFlow => 'பணப் புழக்கம்';

  @override
  String get booksShow => 'காட்டு';

  @override
  String get booksPickGroup => 'கணக்குக் குழு';

  @override
  String get booksOpening => 'தொடக்க இருப்பு';

  @override
  String get booksReceipts => 'வரவு';

  @override
  String get booksPayments => 'செலவு';

  @override
  String get booksClosing => 'இறுதி இருப்பு';

  @override
  String get booksAccounts => 'கணக்குகள்';

  @override
  String get booksByDay => 'தினவாரி';

  @override
  String get booksMonth => 'மாதம்';

  @override
  String get booksDebit => 'பற்று';

  @override
  String get booksCredit => 'வரவு';

  @override
  String get booksExpenseAccount => 'செலவுக் கணக்கு';

  @override
  String get booksVouchers => 'வவுச்சர்கள்';

  @override
  String get booksOtherSide => 'பதிவின் மறுபக்கம்';

  @override
  String get booksMoneyIn => 'வந்த பணம்';

  @override
  String get booksMoneyOut => 'சென்ற பணம்';

  @override
  String get booksNet => 'நிகரம்';

  @override
  String get booksTotal => 'மொத்தம்';

  @override
  String get booksEmpty => 'இந்தக் காலத்தில் எதுவும் இல்லை.';

  @override
  String get booksNoAccounts => 'இந்தக் குழுவில் இன்னும் கணக்குகள் இல்லை.';

  @override
  String get booksRcm => 'ஆர்சிஎம் பதிவேடு';

  @override
  String get booksAdjust => 'பில் முதல் பில் சரிசெய்தல்';

  @override
  String get booksVoucher => 'வவுச்சர்';

  @override
  String get booksBill => 'தீர்த்த பில்';

  @override
  String get booksParty => 'தரப்பு';

  @override
  String get booksAmount => 'தொகை';

  @override
  String get booksSupplier => 'சப்ளையர்';

  @override
  String get booksInvoice => 'சப்ளையர் பில்';

  @override
  String get booksTaxable => 'வரிக்குட்பட்ட';

  @override
  String get booksCgst => 'சிஜிஎஸ்டி';

  @override
  String get booksSgst => 'எஸ்ஜிஎஸ்டி / யுடிஜிஎஸ்டி';

  @override
  String get booksIgst => 'ஐஜிஎஸ்டி';

  @override
  String get booksCess => 'செஸ்';

  @override
  String get hubReportsTitle => 'அறிக்கைகள்';

  @override
  String get hubReportsSubtitle =>
      'ஒவ்வொரு அறிக்கையும் ஒரே இடத்தில், அது பதிலளிக்கும் கேள்வியின்படி.';

  @override
  String get hubMastersTitle => 'முதன்மைப் பதிவுகள்';

  @override
  String get hubMastersSubtitle =>
      'ஒவ்வொரு பில்லும் வவுச்சரும் சார்ந்திருக்கும் பதிவுகள்: நீங்கள் விற்பவை, யாருடன் வணிகம், விலைகள், விதிகள், கடைகள், கவுண்டர்கள்.';

  @override
  String get hubGroupsMerchandise => 'சரக்குகள்';

  @override
  String get hubGroupsParties => 'தரப்பினர், பணியாளர்';

  @override
  String get hubGroupsCommercial => 'விலை, சலுகை, வரி';

  @override
  String get hubGroupsOperational => 'கடைகள், கவுண்டர்கள், விதிகள்';

  @override
  String get hubGroupsSales => 'விற்பனை';

  @override
  String get hubGroupsStock => 'இருப்பு';

  @override
  String get hubGroupsAccounts => 'கணக்கு அறிக்கைகள்';

  @override
  String get hubGroupsTax => 'வரி, சட்டப்பூர்வம்';

  @override
  String get hubGroupsAudit => 'சரிபார்ப்பு, தணிக்கை';

  @override
  String get hubGroupsCustom => 'உங்கள் சொந்த அறிக்கைகள்';

  @override
  String get hubAboutMerchandise => 'வடிவமைப்பு, அளவு, நிறம், படங்கள்';

  @override
  String get hubAboutParties => 'வாடிக்கையாளர், சப்ளையர், கணக்குகள்; பணியாளர்';

  @override
  String get hubAboutCommercial =>
      'பொருட்கள் விற்கும் விலையும் பொருந்தும் GST-யும்';

  @override
  String get hubAboutOperational =>
      'இருப்பு எங்கே, கவுண்டர்களும் எண்களும் எப்படி இயங்குகின்றன';

  @override
  String get hubAboutSales => 'என்ன விற்றது, எங்கே, யாருக்கு';

  @override
  String get hubAboutStock => 'அலமாரியில் என்ன, எவ்வளவு நாளாக';

  @override
  String get hubAboutAccounts => 'யார் எவ்வளவு தர வேண்டும், லாபம், கணக்குகள்';

  @override
  String get hubAboutTax =>
      'GST ரிட்டர்ன்கள், சம்பள சட்டப்பூர்வம், வரித் தேய்மானம்';

  @override
  String get hubAboutAudit => 'கவனிக்க வேண்டியவை, யார் என்ன மாற்றினார்';

  @override
  String get hubAboutCustom => 'உங்கள் சொந்தத்தை உருவாக்கு, சேமி, நேரமிடு';

  @override
  String get exchangeOpen => 'திருப்பம் அல்லது மாற்றம்';

  @override
  String get exchangeTitle => 'இந்த பில்லில் திரும்பும் பொருட்கள்';

  @override
  String exchangeTaking(num pieces, String number) {
    return '$number இலிருந்து $pieces துண்டுகள் திரும்ப';
  }

  @override
  String get exchangeCredit => 'வரவு';

  @override
  String get exchangeAdd => 'இந்த பில்லில் திரும்பப் பெறு';

  @override
  String exchangeCreditUsed(String number) {
    return '$number க்கு எதிரான திருப்பம்';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount வரவு மீதம்; அது கடை வரவாக இருக்கும்.';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'திருப்பம் $number இந்த பில்லில் $amount குறைத்தது.';
  }

  @override
  String exchangeLeftCode(String amount) {
    return '$amount கடை வரவு மீதம், குறியீடு:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'திரும்பியது (பில் $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'கடை வரவு $amount, குறியீடு $code';
  }

  @override
  String get inwardTransporter => 'போக்குவரத்து நிறுவனம்';

  @override
  String get inwardLrNumber => 'LR எண்';

  @override
  String get inwardLrDate => 'LR தேதி';

  @override
  String get inwardMarkup => 'மார்க்-அப் %';

  @override
  String get inwardMarkupHint => 'விலையிலிருந்து MRP நிரப்பும்';

  @override
  String get inwardRounding => 'MRP ஐ முழுமையாக்கு';

  @override
  String get inwardRound1 => 'அருகிலுள்ள ரூபாய்';

  @override
  String get inwardRound9 => '9 இல் முடியும் (1,299)';

  @override
  String get inwardRound10 => 'அடுத்த 10';

  @override
  String get inwardRound50 => 'அடுத்த 50';

  @override
  String get inwardCost => 'விலை';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'மார்க்-அப்';

  @override
  String get inwardMarkupTitle => 'விலைக்கு மேல் MRP, விலையின் %';

  @override
  String get inwardMarginCol => 'லாப விகிதம்';

  @override
  String get inwardMarginTitle => 'MRP இலிருந்து விலை வரை குறைவு, MRP இன் %';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces துண்டுகள், விலை $value';
  }

  @override
  String get inwardLastPurchases => 'கடைசி கொள்முதல்கள்';

  @override
  String get inwardPickLine =>
      'முன்பு என்ன விலை என்று பார்க்க ஒரு வரியைத் தேர்ந்தெடுங்கள்.';

  @override
  String get inwardCurrentMrp => 'தற்போதைய MRP';

  @override
  String get inwardInStock => 'இருப்பில்';

  @override
  String get inwardDate => 'தேதி';

  @override
  String get inwardNeverBought => 'முன்பு வாங்கவில்லை.';

  @override
  String get inwardPrintLabels => 'இந்தத் துண்டுகளுக்கு லேபிள் அச்சிடு';

  @override
  String get inwardDocument => 'சலான்';

  @override
  String get inwardState => 'மாநிலம்';

  @override
  String get inwardTransport => 'போக்குவரத்து';

  @override
  String get inwardSizeCurve => 'அளவு வாரியாக துண்டுகள்';

  @override
  String get inwardTotalQty => 'துண்டுகள்';

  @override
  String get inwardAtCost => 'விலையில்';

  @override
  String get inwardAvgMarkup => 'மார்க்-அப்';

  @override
  String get countsTitle => 'இருப்பு எண்ணிக்கை';

  @override
  String get countsSubtitle =>
      'பார்கோடுகளை ஸ்கேன் செய்து கடையை எண்ணுங்கள். ஒப்புதலளிப்பவர் வேறுபாடுகளையும் மதிப்பையும் பார்ப்பார்; ஒப்புதல் கணக்கைச் சரிசெய்யும்.';

  @override
  String get countsWholeStore => 'முழுக் கடை';

  @override
  String get countsWhat => 'எதை எண்ணுவது';

  @override
  String get countsByAll => 'கடையின் அனைத்துப் பொருட்களும்';

  @override
  String get countsByBrand => 'ஒரு பிராண்ட்';

  @override
  String get countsByCategory => 'ஒரு வகை';

  @override
  String get countsByStyleId => 'ஒரு வடிவமைப்பு';

  @override
  String get countsName => 'பெயர்';

  @override
  String get countsNamePlaceholder => 'எ.கா. குர்தா சுவர்';

  @override
  String get countsBlind =>
      'மறைமுக எண்ணிக்கை (எண்ணுபவர்கள் கணக்கு எண்களைப் பார்க்க மாட்டார்கள்)';

  @override
  String get countsBlindShort => 'மறைமுக எண்ணிக்கை';

  @override
  String get countsStart => 'எண்ணத் தொடங்கு';

  @override
  String get countsScanHere => 'பார்கோடை ஸ்கேன் செய்யுங்கள்';

  @override
  String get countsAdd => 'சேர்';

  @override
  String get countsScanHint =>
      'ஒவ்வொரு ஸ்கேனும் ஒரு துண்டைச் சேர்க்கும். ஐந்துக்கு 5*பார்கோடு என தட்டச்சு செய்யுங்கள், அல்லது கீழே அட்டவணையில் எண்ணிக்கையை எழுதுங்கள்.';

  @override
  String get countsOutOfScope => 'இந்த எண்ணிக்கையில் இல்லை, சேர்க்கப்பட்டது';

  @override
  String get countsStatusCounting => 'எண்ணப்படுகிறது';

  @override
  String get countsStatusSubmitted => 'ஒப்புதலுக்குக் காத்திருக்கிறது';

  @override
  String get countsStatusApproved =>
      'ஒப்புதல் பெற்றது, கணக்கு சரிசெய்யப்பட்டது';

  @override
  String get countsStatusCancelled => 'ரத்து';

  @override
  String get countsJournal => 'இருப்பு சரிசெய்தலைப் பார்';

  @override
  String get countsPiecesCounted => 'எண்ணிய துண்டுகள்';

  @override
  String get countsItemsCounted => 'எண்ணிய பொருட்கள்';

  @override
  String get countsInBooks => 'கணக்கில்';

  @override
  String get countsShort => 'குறைவு (மதிப்பு)';

  @override
  String get countsExcess => 'அதிகம் (மதிப்பு)';

  @override
  String get countsNet => 'நிகர வேறுபாடு';

  @override
  String get countsBlindNote =>
      'மறைமுக எண்ணிக்கை: சமர்ப்பித்த பின் கணக்கு எண்கள் தெரியும்.';

  @override
  String get countsSubmit => 'எண்ணுவதை முடி';

  @override
  String get countsReason => 'வேறுபாடுகளுக்கான காரணம்';

  @override
  String countsApproveAdjust(num n) {
    return 'ஒப்புதல் அளித்து $n பொருட்களைச் சரிசெய்';
  }

  @override
  String get countsApproveNone => 'ஒப்புதல் (வேறுபாடு இல்லை)';

  @override
  String get countsRecount => 'மீண்டும் எண்ணத் திருப்பி அனுப்பு';

  @override
  String get countsWaitingApproval =>
      'உரிமையாளர் அல்லது நிர்வாகி வேறுபாடுகளை ஒப்புதல் அளிப்பார்.';

  @override
  String get countsCancelConfirm =>
      'இந்த எண்ணிக்கையை ரத்து செய்யவா? கணக்கில் எதுவும் மாறாது.';

  @override
  String get countsCancel => 'எண்ணிக்கையை ரத்து செய்';

  @override
  String get countsOnlyDiff => 'வேறுபடும் பொருட்களை மட்டும் காட்டு';

  @override
  String get countsItem => 'பொருள்';

  @override
  String get countsCounted => 'எண்ணியது';

  @override
  String get countsDiff => 'வேறுபாடு';

  @override
  String get countsValue => 'மதிப்பு';

  @override
  String get countsNoDiff => 'கணக்கிலிருந்து எதுவும் வேறுபடவில்லை.';

  @override
  String get countsNumber => 'எண்ணிக்கை';

  @override
  String get countsStarted => 'தொடங்கியது';

  @override
  String get countsState => 'நிலை';

  @override
  String get countsNone => 'இன்னும் எண்ணிக்கை இல்லை.';

  @override
  String get countsErrorsCountClosed =>
      'இந்த எண்ணிக்கை இனி திறந்திருக்கவில்லை.';

  @override
  String get countsErrorsCountNotSubmitted => 'முதலில் எண்ணுவதை முடியுங்கள்.';

  @override
  String get countsErrorsReasonRequired =>
      'வேறுபாடுகளுக்கான காரணத்தைக் கொடுங்கள்.';

  @override
  String get countsErrorsUnknownBarcode => 'இந்த பார்கோடுடன் பொருள் இல்லை.';

  @override
  String get countsErrorsNothingToCount =>
      'அந்தத் தேர்வுக்குப் பொருந்தும் பொருள் இல்லை.';

  @override
  String get countsErrorsUnknownWarehouse => 'கடையைத் தேர்ந்தெடுங்கள்.';

  @override
  String get countsErrorsTooManyCodes =>
      'கோப்பில் 5,000-க்கும் மேற்பட்ட வெவ்வேறு பார்கோடுகள் உள்ளன. பிரித்து பகுதிகளாக இறக்குமதி செய்யவும்.';

  @override
  String get countsImportTitle => 'ஸ்கேனர் கோப்பை இறக்குமதி செய்';

  @override
  String get countsImportHelp =>
      'கையடக்க ஸ்கேனரின் உரைக் கோப்பு: ஒரு வரிக்கு ஒரு பார்கோடு, அல்லது பார்கோடு மற்றும் அளவு (\"8901234567890,3\"). மீண்டும் வரும் பார்கோடுகள் கூட்டப்படும்.';

  @override
  String get countsImportMode => 'எண்களை என்ன செய்வது';

  @override
  String get countsImportAdd => 'ஏற்கனவே எண்ணியதில் சேர்';

  @override
  String get countsImportReplace => 'இந்த பார்கோடுகளின் எண்ணிக்கையை மாற்று';

  @override
  String get countsImportChoose => 'கோப்பைத் தேர்வு செய்';

  @override
  String get countsImportReading => 'படிக்கிறது...';

  @override
  String get countsImportTooBig =>
      'இந்தக் கோப்பு மிகப் பெரியது (2 எம்பிக்கு மேல்).';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matched பொருட்கள் எண்ணப்பட்டன',
      one: '$matched பொருள் எண்ணப்பட்டது',
    );
    return '$_temp0, $pieces எண்ணிக்கை';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n பொருட்கள் இந்த எண்ணிக்கைப் பட்டியலில் இல்லை, சேர்க்கப்பட்டன.',
      one: '$n பொருள் இந்த எண்ணிக்கைப் பட்டியலில் இல்லை, சேர்க்கப்பட்டது.',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n குறியீடுகள் பொருட்கள் அல்ல: $list',
      one: '$n குறியீடு பொருள் அல்ல: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n வரிகளைப் படிக்க முடியவில்லை (வரிகள் $list)',
      one: '$n வரியைப் படிக்க முடியவில்லை (வரி $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'சரக்குச் சுருக்கம்';

  @override
  String stockSubtitle(String method) {
    return 'ஒவ்வொரு பொருளின் அளவும் மதிப்பும். $method முறையில் மதிப்பிடப்பட்டது.';
  }

  @override
  String get stockMethodAverage => 'நகரும் சராசரி';

  @override
  String get stockMethodFifo => 'FIFO (முதலில் வந்தது முதலில் போகும்)';

  @override
  String get stockWarehouse => 'கிடங்கு';

  @override
  String get stockAllWarehouses => 'அனைத்துக் கிடங்குகளும்';

  @override
  String get stockQty => 'அளவு';

  @override
  String get stockRate => 'விலை';

  @override
  String get stockValue => 'மதிப்பு';

  @override
  String get stockTotalValue => 'மொத்தச் சரக்கு மதிப்பு';

  @override
  String get stockBelowReorder => 'மறு ஆர்டர் நிலைக்குக் கீழே';

  @override
  String get stockReorderTitle => 'மறு ஆர்டர் செய்ய வேண்டிய பொருட்கள்';

  @override
  String get stockReorderEmpty => 'எதுவும் மறு ஆர்டர் நிலைக்குக் கீழே இல்லை.';

  @override
  String get stockSuggested => 'பரிந்துரைத்த ஆர்டர்';

  @override
  String stockLedgerTitle(String item) {
    return 'சரக்குப் பேரேடு: $item';
  }

  @override
  String get stockIn => 'வரவு';

  @override
  String get stockOut => 'செலவு';

  @override
  String get stockSourceStockJournal => 'சரக்குப் பதிவேடு';

  @override
  String get stockSourceGrn => 'சரக்கு வரவு';

  @override
  String get stockSourcePurchaseBill => 'கொள்முதல் பில்';

  @override
  String get stockSourcePurchaseReturn => 'கொள்முதல் திருப்பம்';

  @override
  String get stockNegativeWarning =>
      'ஒரு பொருளின் சரக்கு பூஜ்யத்துக்குக் கீழே சென்றது. கொள்முதல் பதிவு விடுபட்டுள்ளதா எனப் பார்க்கவும்.';

  @override
  String get sjTitle => 'சரக்குப் பதிவேடு';

  @override
  String get sjSubtitle =>
      'தொடக்கச் சரக்கு, எண்ணிக்கைக்குப் பின் சரிசெய்தல், கிடங்குகளுக்கு இடையே மாற்றம், பயன்பாடு.';

  @override
  String get sjNew => 'புதிய சரக்குப் பதிவு';

  @override
  String get sjKindsOpening => 'தொடக்கச் சரக்கு';

  @override
  String get sjKindsAdjustment => 'சரிசெய்தல்';

  @override
  String get sjKindsTransfer => 'மாற்றம்';

  @override
  String get sjKindsIssue => 'பயன்பாடு';

  @override
  String get sjKindHintsOpening =>
      'கணக்குகள் தொடங்கியபோது உங்களிடம் இருந்த சரக்கு. அளவையும் விலையையும் உள்ளிடவும்.';

  @override
  String get sjKindHintsAdjustment =>
      'உண்மையான எண்ணிக்கைக்குப் பின் சரக்கைச் சரிசெய்யவும்: அளவைக் கூட்டவும் அல்லது குறைக்கவும்.';

  @override
  String get sjKindHintsTransfer =>
      'கிடங்குகளுக்கு இடையே சரக்கை தற்போதைய விலையில் நகர்த்தவும்.';

  @override
  String get sjKindHintsIssue =>
      'வணிகத்தில் பயன்படுத்திய சரக்கு (மாதிரிகள், சொந்தப் பயன்பாடு, உற்பத்தி).';

  @override
  String get sjDirection => 'கூட்டு / குறை';

  @override
  String get sjAdd => 'கூட்டு';

  @override
  String get sjRemove => 'குறை';

  @override
  String get sjToWarehouse => 'இந்தக் கிடங்குக்கு';

  @override
  String get sjBatch => 'தொகுதி';

  @override
  String get sjExpiry => 'காலாவதி';

  @override
  String get sjPost => 'சரக்குப் பதிவைப் பதி';

  @override
  String get sjErrorsRateRequired => 'தொடக்கச் சரக்குக்கு விலையை உள்ளிடவும்.';

  @override
  String get sjErrorsServiceHasNoStock => 'சேவைகளுக்குச் சரக்கு இல்லை.';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses =>
      'இரண்டு வெவ்வேறு கிடங்குகளைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get sjErrorsBatchRequired =>
      'இந்தப் பொருள் தொகுதிகளைப் பதிவுசெய்கிறது: தொகுதி எண்ணை உள்ளிடவும்.';

  @override
  String get sjErrorsQtyMustBePositive =>
      'அளவு பூஜ்யத்தை விட அதிகமாக இருக்க வேண்டும்.';

  @override
  String get purchaseSupplier => 'சப்ளையர்';

  @override
  String get purchaseChooseSupplier => 'சப்ளையரைத் தேர்ந்தெடு…';

  @override
  String get purchaseItem => 'பொருள்';

  @override
  String get purchaseChooseItem => 'பொருளைத் தேர்ந்தெடு…';

  @override
  String get purchaseQty => 'அளவு';

  @override
  String get purchaseRate => 'விலை';

  @override
  String get purchaseDiscount => 'தள்ளுபடி';

  @override
  String get purchaseGst => 'ஜிஎஸ்டி %';

  @override
  String get purchaseAmount => 'தொகை';

  @override
  String get purchaseTaxable => 'வரிக்குட்பட்ட மதிப்பு';

  @override
  String get purchaseTotal => 'மொத்தம்';

  @override
  String get purchaseStatus => 'நிலை';

  @override
  String get purchaseStatusesOpen => 'திறந்தது';

  @override
  String get purchaseStatusesPartial => 'பகுதியாக வந்தது';

  @override
  String get purchaseStatusesReceived => 'வந்தது';

  @override
  String get purchaseStatusesClosed => 'மூடப்பட்டது';

  @override
  String get purchaseStatusesCancelled => 'ரத்துசெய்யப்பட்டது';

  @override
  String get purchaseStatusesPosted => 'பதியப்பட்டது';

  @override
  String get purchaseStatusesBilled => 'பில் செய்யப்பட்டது';

  @override
  String get purchaseOrdersTitle => 'கொள்முதல் ஆர்டர்கள்';

  @override
  String get purchaseOrdersSubtitle =>
      'சப்ளையர்களிடம் என்ன ஆர்டர் செய்தீர்கள், எவ்வளவு வந்தது.';

  @override
  String get purchaseOrdersNew => 'புதிய கொள்முதல் ஆர்டர்';

  @override
  String get purchaseOrdersExpectedOn => 'எதிர்பார்க்கும் தேதி';

  @override
  String get purchaseOrdersOrdered => 'ஆர்டர் செய்தது';

  @override
  String get purchaseOrdersReceived => 'வந்தது';

  @override
  String get purchaseOrdersBilled => 'பில் செய்தது';

  @override
  String get purchaseOrdersReceive => 'சரக்கைப் பெறு';

  @override
  String get purchaseOrdersBill => 'பில் பதி';

  @override
  String get purchaseOrdersClose => 'ஆர்டரை மூடு';

  @override
  String get purchaseReceiptsTitle => 'உள்வரவு சலான்';

  @override
  String get purchaseReceiptsSubtitle =>
      'வந்த சரக்கு (GRN). வரவில் சரக்கு கூடும்; பில் பின்னர் வரும்.';

  @override
  String get purchaseReceiptsNew => 'புதிய உள்வரவு சலான்';

  @override
  String get purchaseReceiptsChallan => 'சப்ளையரின் சலான் எண்';

  @override
  String get purchaseReceiptsBill => 'பில் பதி';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'ஆர்டர் $number-க்கு எதிராக';
  }

  @override
  String get purchaseBillsTitle => 'கொள்முதல் பில்கள்';

  @override
  String get purchaseBillsSubtitle =>
      'சப்ளையர் விலைப்பட்டியல்கள். ஒவ்வொரு பில்லும் கொள்முதல், உள்ளீட்டு ஜிஎஸ்டி மற்றும் சப்ளையர் கணக்கில் பதியப்படும்.';

  @override
  String get purchaseBillsNew => 'புதிய கொள்முதல் பில்';

  @override
  String get purchaseBillsInvoiceNo => 'சப்ளையர் விலைப்பட்டியல் எண்';

  @override
  String get purchaseBillsInvoiceDate => 'சப்ளையர் விலைப்பட்டியல் தேதி';

  @override
  String get purchaseBillsPostingDate => 'பதிவுத் தேதி';

  @override
  String get purchaseBillsDueOn => 'செலுத்த வேண்டிய தேதி';

  @override
  String get purchaseBillsReverseCharge =>
      'தலைகீழ் கட்டணம் (வரியை நாங்கள் செலுத்துவோம்)';

  @override
  String get purchaseBillsReturn => 'சரக்கைத் திருப்பு';

  @override
  String get purchaseBillsReturned => 'திருப்பப்பட்டது';

  @override
  String get purchaseBillsPost => 'பில் பதி';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'வரி $line-இல் பில் விலை சரக்கு வரவிலிருந்து வேறுபடுகிறது. சரக்கு வரவு விலையிலேயே இருக்கும்.';
  }

  @override
  String get purchaseReturnsTitle => 'கொள்முதல் திருப்பம்';

  @override
  String get purchaseReturnsSubtitle =>
      'சப்ளையர்களுக்குத் திருப்பி அனுப்பிய சரக்கு (டெபிட் நோட்).';

  @override
  String get purchaseReturnsNew => 'சரக்கைத் திருப்பு';

  @override
  String get purchaseReturnsReason => 'காரணம்';

  @override
  String get purchaseReturnsPost => 'டெபிட் நோட் பதி';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'பில் $number-க்கு எதிராக';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'Sundry Creditors கீழுள்ள கணக்கைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get purchaseErrorsUnknownSupplier => 'சப்ளையரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get purchaseErrorsOverReceipt => 'இது ஆர்டரில் மீதமுள்ளதை விட அதிகம்.';

  @override
  String get purchaseErrorsOverBilling =>
      'இது வந்து இன்னும் பில் செய்யப்படாத சரக்கை விட அதிகம்.';

  @override
  String get purchaseErrorsOverReturn =>
      'இது பில் செய்து இன்னும் திருப்பப்படாத சரக்கை விட அதிகம்.';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'இந்த சப்ளையர் விலைப்பட்டியல் ஏற்கனவே பதியப்பட்டுள்ளது.';

  @override
  String get purchaseErrorsBillHasReturns =>
      'முதலில் இந்தப் பில்லுக்கு எதிரான திருப்பங்களை ரத்துசெய்யவும்.';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'இந்த வரவுக்கு பில் செய்யப்பட்டுள்ளது; முதலில் பில்லை ரத்துசெய்யவும்.';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'இந்த ஆர்டருக்கு எதிராகச் சரக்கு வந்துள்ளது; அதை மூடவும்.';

  @override
  String get purchaseErrorsOrderNotOpen => 'இந்த ஆர்டர் மூடப்பட்டுள்ளது.';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'சப்ளையர் விலைப்பட்டியல் தேதி பதிவுத் தேதிக்குப் பின் இருக்க முடியாது.';

  @override
  String get purchaseErrorsNoLines => 'குறைந்தது ஒரு வரி சேர்க்கவும்.';

  @override
  String get purchaseErrorsItemArchived => 'ஒரு பொருள் காப்பகத்தில் உள்ளது.';

  @override
  String get purchaseReadButton => 'பில்லைப் படி';

  @override
  String get purchaseReadHint =>
      'சப்ளையர் பில்லின் புகைப்படம் அல்லது PDF: படிவம் நிரப்பப்படும், நீங்கள் சரிபார்க்கவும்.';

  @override
  String get purchaseReadReading => 'பில்லைப் படிக்கிறது…';

  @override
  String get purchaseReadDone =>
      'பில்லிலிருந்து நிரப்பப்பட்டது. சேமிக்கும் முன் ஒவ்வொரு வரியையும் சரிபார்க்கவும்.';

  @override
  String purchaseReadUnmatched(String items) {
    return 'இவற்றுக்குப் பொருளைத் தேர்ந்தெடுக்கவும்: $items.';
  }

  @override
  String get purchaseReadDemo =>
      'தானியங்கி வாசிப்பு அமைக்கப்படவில்லை; பில்லை நீங்களே உள்ளிடவும்.';

  @override
  String get purchaseReadNone =>
      'இந்தப் பில்லைப் படிக்க முடியவில்லை; நீங்களே உள்ளிடவும்.';

  @override
  String get inventorySettingsTitle => 'சரக்கு அமைப்புகள்';

  @override
  String get inventorySettingsValuation => 'சரக்கு மதிப்பீட்டு முறை';

  @override
  String get inventorySettingsValuationHint =>
      'பயன்பட்ட மற்றும் மீதமுள்ள சரக்கின் மதிப்பு எப்படிக் கணக்கிடப்படும். மாற்றினால் தொடக்கத்திலிருந்து அனைத்துச் சரக்கும் மறுமதிப்பீடு செய்யப்படும்.';

  @override
  String get inventorySettingsWarehouses => 'கிடங்குகள்';

  @override
  String get inventorySettingsAddWarehouse => 'கிடங்கு சேர்';

  @override
  String get inventorySettingsWarehouseName => 'கிடங்கின் பெயர்';

  @override
  String get inventorySettingsDefault => 'முதன்மை';

  @override
  String get inventorySettingsNameTaken =>
      'இந்தப் பெயரில் ஏற்கனவே கிடங்கு உள்ளது.';

  @override
  String get salesCustomer => 'வாடிக்கையாளர்';

  @override
  String get salesChooseCustomer => 'வாடிக்கையாளரைத் தேர்ந்தெடு…';

  @override
  String get salesPlaceOfSupply => 'விநியோக இடம்';

  @override
  String get salesExport => 'ஏற்றுமதி';

  @override
  String get salesSez => 'SEZ வாடிக்கையாளர்';

  @override
  String get salesLut => 'LUT கீழ் (வரியின்றி)';

  @override
  String get salesStatusesDelivered => 'வழங்கப்பட்டது';

  @override
  String get salesStatusesInvoiced => 'விலைப்பட்டியல் இடப்பட்டது';

  @override
  String get salesStatusesAccepted => 'ஏற்கப்பட்டது';

  @override
  String get salesStatusesDeclined => 'நிராகரிக்கப்பட்டது';

  @override
  String get salesStatusesConverted => 'மாற்றப்பட்டது';

  @override
  String get salesStatusesExpired => 'காலாவதியானது';

  @override
  String get salesOrdersTitle => 'விற்பனை ஆர்டர்கள்';

  @override
  String get salesOrdersSubtitle =>
      'வாடிக்கையாளர்கள் என்ன ஆர்டர் செய்தார்கள், எவ்வளவு அனுப்பப்பட்டது.';

  @override
  String get salesOrdersNew => 'புதிய விற்பனை ஆர்டர்';

  @override
  String get salesOrdersDeliverBy => 'வழங்கும் தேதி';

  @override
  String get salesOrdersCustomerRef => 'வாடிக்கையாளர் PO எண்';

  @override
  String get salesOrdersOrdered => 'ஆர்டர் செய்தது';

  @override
  String get salesOrdersDelivered => 'வழங்கியது';

  @override
  String get salesOrdersInvoiced => 'விலைப்பட்டியல் இட்டது';

  @override
  String get salesOrdersDeliver => 'சரக்கை வழங்கு';

  @override
  String get salesOrdersInvoice => 'விலைப்பட்டியல் உருவாக்கு';

  @override
  String get salesOrdersClose => 'ஆர்டரை மூடு';

  @override
  String get salesDeliveriesTitle => 'டெலிவரி சலான்';

  @override
  String get salesDeliveriesSubtitle =>
      'விலைப்பட்டியலுக்கு முன் (அல்லது இல்லாமல்) அனுப்பிய சரக்கு. டெலிவரியில் சரக்கு குறையும்.';

  @override
  String get salesDeliveriesNew => 'புதிய டெலிவரி சலான்';

  @override
  String get salesDeliveriesInvoice => 'விலைப்பட்டியல் உருவாக்கு';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'ஆர்டர் $number-க்கு எதிராக';
  }

  @override
  String get salesDeliveriesReason => 'காரணம்';

  @override
  String get salesDeliveriesValue => 'மதிப்பு';

  @override
  String get salesDeliveriesTransporter => 'போக்குவரத்தாளர்';

  @override
  String get salesDeliveriesVehicleNo => 'வாகன எண்';

  @override
  String get salesDeliveriesPrint => 'சலான் அச்சிடு (3 நகல்கள்)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return '$dateக்குள் இன்வாய்ஸ்';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    return 'சரக்கு $count முறை திரும்பியது: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'சரக்கைத் திரும்பப் பெறு';

  @override
  String get salesDeliveriesStillOut => 'இன்னும் வெளியே';

  @override
  String get salesDeliveriesCameBack => 'திரும்பியது';

  @override
  String get salesDeliveriesSaveReturn => 'திருப்பத்தைச் சேமி';

  @override
  String get salesDeliveriesNewApproval => 'புதிய ஒப்புதல் மெமோ';

  @override
  String get salesDeliveriesReasonsSupply => 'வழங்கல், இன்வாய்ஸ் பின்னர்';

  @override
  String get salesDeliveriesReasonsApproval => 'ஒப்புதலில் விற்பனை';

  @override
  String get salesDeliveriesReasonsJobWork => 'ஜாப் வொர்க்';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'வழங்கல் அல்ல (சொந்தப் பயன்பாடு, பழுது)';

  @override
  String get salesDeliveriesReasonsLots => 'தவணைகளில் வழங்கல்';

  @override
  String get salesDeliveriesReasonsExhibition => 'கண்காட்சி அல்லது சந்தை';

  @override
  String get salesDeliveriesReasonsOther => 'மற்றவை';

  @override
  String get salesDeliveriesReasonsSample => 'மாதிரிகள்';

  @override
  String get salesDeliveriesReasonHintsSupply =>
      'சரக்கு விற்கப்பட்டது; வரி இன்வாய்ஸ் பின்னர்.';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'விற்பதை வாடிக்கையாளர் வைத்துக்கொள்வார். ஆறு மாதங்களுக்குள் இன்வாய்ஸ் செய்யுங்கள் அல்லது சரக்கைத் திரும்பப் பெறுங்கள்.';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'செயலாக்கத்திற்கு அனுப்பப்பட்டது; சரக்கு திரும்பும்.';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'விற்பனையின்றி சரக்கு செல்கிறது, எனவே வரி காட்டப்படாது.';

  @override
  String get salesDeliveriesReasonHintsLots => 'ஒரு வழங்கல் பல தவணைகளில்.';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'கண்காட்சியில் காட்டப்பட்டது; விற்காத சரக்கு திரும்பும்.';

  @override
  String get salesDeliveriesReasonHintsOther => 'சரக்கின் வேறு எந்த நகர்வும்.';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'காட்ட அல்லது முயன்று பார்க்க அனுப்பியது; விற்பனை அல்ல, எனவே வரி காட்டப்படாது. வைத்துக்கொள்ளாதவை திரும்பப் பெறப்படும்.';

  @override
  String get salesInvoicesTitle => 'விற்பனை விலைப்பட்டியல்கள்';

  @override
  String get salesInvoicesSubtitle =>
      'வரி விலைப்பட்டியல்கள். ஒவ்வொன்றும் விற்பனை, வெளியீட்டு ஜிஎஸ்டி மற்றும் வாடிக்கையாளர் கணக்கில் பதியப்படும்.';

  @override
  String get salesInvoicesNew => 'புதிய விலைப்பட்டியல்';

  @override
  String get salesInvoicesDueOn => 'செலுத்த வேண்டிய தேதி';

  @override
  String get salesInvoicesPost => 'விலைப்பட்டியலைச் சேமி';

  @override
  String get salesInvoicesPrint => 'அச்சிடு';

  @override
  String get salesInvoicesCreditNote => 'கிரெடிட் நோட் / திருப்பம்';

  @override
  String get salesInvoicesReturned => 'திரும்பியது';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'இதனால் வாடிக்கையாளர் கடன் வரம்பைத் தாண்டுகிறார் ($detail நிலுவை).';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return '$detail மதிப்புச் சரக்கு: நகர்த்தும் முன் இ-வே பில் தேவை.';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'வரி $lineNo-இல் HSN குறியீடு இல்லை; வரி விலைப்பட்டியலில் அது தேவை.';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'சில சரக்கு பூஜ்யத்துக்குக் கீழே சென்றது. கொள்முதல் பதிவு விடுபட்டுள்ளதா எனப் பார்க்கவும்.';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'இந்த வாடிக்கையாளரின் ஒரு பில் $days நாட்கள் நிலுவையில் உள்ளது.';
  }

  @override
  String get salesCreditNotesTitle => 'கிரெடிட் நோட்கள்';

  @override
  String get salesCreditNotesSubtitle =>
      'விற்பனைத் திருப்பமும் விற்பனைக்குப் பின் விலைக் குறைப்பும்.';

  @override
  String get salesCreditNotesNew => 'கிரெடிட் நோட்';

  @override
  String get salesCreditNotesReason => 'காரணம்';

  @override
  String get salesCreditNotesGoodsReturned =>
      'சரக்கு இருப்புக்குத் திரும்பியது';

  @override
  String get salesCreditNotesPriceReduction =>
      'விலைக் குறைப்பு மட்டும் (சரக்கு திரும்பவில்லை)';

  @override
  String get salesCreditNotesCreditRate => 'ஒரு அலகுக்குக் கிரெடிட்';

  @override
  String get salesCreditNotesPost => 'கிரெடிட் நோட் பதி';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'விலைப்பட்டியல் $number-க்கு எதிராக';
  }

  @override
  String get salesErrorsNotACustomer =>
      'Sundry Debtors கீழுள்ள கணக்கைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get salesErrorsUnknownCustomer => 'வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get salesErrorsOverDelivery => 'இது ஆர்டரில் மீதமுள்ளதை விட அதிகம்.';

  @override
  String get salesErrorsOverInvoicing =>
      'இது வழங்கி இன்னும் விலைப்பட்டியல் இடாத சரக்கை விட அதிகம்.';

  @override
  String get salesErrorsOverReturn =>
      'வெளியே இருப்பதை விட அதிகம் திரும்புகிறது.';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'முதலில் இந்த விலைப்பட்டியலுக்கு எதிரான கிரெடிட் நோட்களை ரத்துசெய்யவும்.';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'இந்தச் சலானுக்கு விலைப்பட்டியல் இடப்பட்டுள்ளது; முதலில் அதை ரத்துசெய்யவும்.';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'இந்த ஆர்டருக்கு எதிராகச் சரக்கு அனுப்பப்பட்டுள்ளது; அதை மூடவும்.';

  @override
  String get salesErrorsCancelIrnFirst =>
      'முதலில் இ-இன்வாய்ஸை (IRN) ரத்துசெய்யவும்.';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'கிரெடிட் விலைப்பட்டியல் விலையை விட அதிகமாக இருக்க முடியாது.';

  @override
  String get salesErrorsRateRequired => 'ஒரு அலகுக்குக் கிரெடிட்டை உள்ளிடவும்.';

  @override
  String get salesErrorsQuotationNotOpen =>
      'இந்த விலைப்புள்ளி ஏற்கனவே மாற்றப்பட்டது அல்லது மூடப்பட்டது.';

  @override
  String get salesErrorsQuotationConverted =>
      'இந்த விலைப்புள்ளி மாற்றப்பட்டது; முதலில் அதிலிருந்து உருவான ஆர்டர் அல்லது விலைப்பட்டியலை ரத்துசெய்யவும்.';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'இந்த விலைப்புள்ளி வேறு வாடிக்கையாளருக்கானது.';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“வரை செல்லும்” தேதி விலைப்புள்ளித் தேதிக்கு முன் இருக்க முடியாது.';

  @override
  String get salesErrorsCancelEwbFirst => 'முதலில் இ-வே பில்லை ரத்துசெய்யவும்.';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'இந்த மாதத்தின் GSTR-1 ஏற்கனவே தாக்கல் செய்யப்பட்டது. நடப்பு மாதத் தேதியைப் பயன்படுத்தவும், அல்லது ஜிஎஸ்டி போர்ட்டலில் திருத்தவும்.';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'முன்பணம் மொத்தத்தை விட அதிகமாக இருக்க முடியாது.';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'இந்த சலானில் சரக்கு திரும்பியுள்ளது, எனவே ரத்து செய்ய முடியாது.';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'திருப்பத் தேதி சலான் தேதிக்கு முன் உள்ளது.';

  @override
  String get salesErrorsDeliveryCancelled => 'இந்த சலான் ரத்து செய்யப்பட்டது.';

  @override
  String get salesErrorsUnknownDeliveryLine => 'இந்த வரி இந்த சலானில் இல்லை.';

  @override
  String get salesErrorsCreditBlocked =>
      'இந்த விற்பனை வாடிக்கையாளரைக் கடன் வரம்பிற்கு மேல் கொண்டு செல்கிறது, அவர்களின் கணக்கு தடுக்கப்பட்டுள்ளது.';

  @override
  String get salesErrorsOverdueBlocked =>
      'இந்த வாடிக்கையாளரின் ஒரு பில் அனுமதிக்கப்பட்டதை விட நீண்ட காலம் நிலுவையில் உள்ளது, அவர்களின் கணக்கு தடுக்கப்பட்டுள்ளது.';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'உரிமையாளர் அல்லது நிர்வாகி மட்டுமே கடன் தடையை மீற முடியும்.';

  @override
  String get salesErrorsNotAnAgent =>
      'தரகர் அல்லது முகவர் எனக் குறிக்கப்பட்ட கணக்கைத் தேர்வுசெய்.';

  @override
  String get salesErrorsUnknownSalesman =>
      'உங்கள் ஊழியர்களில் இருந்து விற்பனையாளரைத் தேர்வுசெய்.';

  @override
  String get salesErrorsUnknownOrder => 'அந்த ஆர்டர் கிடைக்கவில்லை.';

  @override
  String get salesQuotationsTitle => 'விலைப்புள்ளிகள்';

  @override
  String get salesQuotationsSubtitle =>
      'வாடிக்கையாளர்களுக்கான விலை முன்மொழிவுகள். மாற்றும் வரை சரக்கிலோ கணக்கிலோ பாதிப்பு இல்லை.';

  @override
  String get salesQuotationsNew => 'புதிய விலைப்புள்ளி';

  @override
  String get salesQuotationsSave => 'விலைப்புள்ளியைச் சேமி';

  @override
  String get salesQuotationsValidUntil => 'வரை செல்லும்';

  @override
  String get salesQuotationsToOrder => 'ஆர்டராக மாற்று';

  @override
  String get salesQuotationsToInvoice => 'விலைப்பட்டியலாக மாற்று';

  @override
  String get salesQuotationsAccept => 'ஏற்கப்பட்டதாகக் குறி';

  @override
  String get salesQuotationsDecline => 'நிராகரிக்கப்பட்டதாகக் குறி';

  @override
  String get salesQuotationsPrint => 'அச்சிடு / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'ஆர்டராக',
      'other': 'விலைப்பட்டியலாக',
    });
    return '$_temp0 மாற்றப்பட்டது';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'விலைப்புள்ளி $number-இலிருந்து';
  }

  @override
  String get salesQuotationsTerms => 'நிபந்தனைகள்';

  @override
  String get salesProformasTitle => 'புரோஃபார்மா இன்வாய்ஸ்';

  @override
  String get salesProformasSubtitle =>
      'சரக்கை அனுப்பும் முன் கட்டணம் அல்லது முன்பணம் கேளுங்கள். இன்வாய்ஸ் வரை வரி அல்லது இருப்பில் தாக்கம் இல்லை.';

  @override
  String get salesProformasNew => 'புதிய புரோஃபார்மா இன்வாய்ஸ்';

  @override
  String get salesProformasSave => 'புரோஃபார்மாவைச் சேமி';

  @override
  String get salesProformasAdvanceDue => 'கேட்கப்பட்ட முன்பணம்';

  @override
  String get salesProformasAdvanceHint =>
      'முழுத் தொகையைக் கேட்க காலியாக விடுங்கள்';

  @override
  String get salesApprovalsTitle => 'ஒப்புதலுக்கு அனுப்பிய சரக்கு';

  @override
  String get salesApprovalsSubtitle =>
      'சரக்கு இன்னும் வாடிக்கையாளரிடம் உள்ள ஒப்புதல் மெமோக்கள். விற்காததைத் திரும்பப் பெறுங்கள்; மீதியை ஆறு மாதங்களுக்குள் இன்வாய்ஸ் செய்யுங்கள்.';

  @override
  String salesApprovalsSummary(num count, String value) {
    return '$count மெமோக்கள் திறந்தவை, மதிப்பு $value';
  }

  @override
  String get salesApprovalsDaysOut => 'வெளியே நாட்கள்';

  @override
  String salesApprovalsDaysLeft(num days) {
    return '$days நாட்கள் உள்ளன';
  }

  @override
  String get salesApprovalsEmpty => 'ஒப்புதலில் எந்தச் சரக்கும் வெளியே இல்லை.';

  @override
  String get salesOverrideCredit => 'அனுமதித்துச் சேமி';

  @override
  String get salesSamplesTitle => 'வெளியே உள்ள மாதிரிகள்';

  @override
  String get salesSamplesSubtitle =>
      'கட்சிகளுக்கு அனுப்பிய, இன்னும் திரும்பாத மாதிரிகள். இவை விற்பனை அல்ல, வரி இல்லை. வைத்துக்கொள்ளாதவற்றைத் திரும்பப் பெறுங்கள்.';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count சலான்கள்',
      one: '$count சலான்',
    );
    return '$_temp0 இல் $pieces எண்ணிக்கை இன்னும் வெளியே';
  }

  @override
  String get salesSamplesNew => 'புதிய மாதிரி சலான்';

  @override
  String get salesSamplesEmpty => 'மாதிரிகள் எதுவும் வெளியே இல்லை.';

  @override
  String get einvoiceTitle => 'இ-இன்வாய்ஸ்';

  @override
  String get einvoiceStatusNotRequired => 'தேவையில்லை';

  @override
  String get einvoiceStatusPending => 'IRN நிலுவையில்';

  @override
  String get einvoiceStatusGenerated => 'IRN உருவானது';

  @override
  String get einvoiceStatusCancelled => 'IRN ரத்து';

  @override
  String get einvoiceStatusFailed => 'IRN தோல்வி';

  @override
  String get einvoiceGenerate => 'IRN உருவாக்கு';

  @override
  String get einvoiceCancel => 'IRN ரத்துசெய்';

  @override
  String get einvoiceCancelHint =>
      'IRN உருவான 24 மணிநேரத்துக்குள் மட்டுமே ரத்துசெய்யலாம்.';

  @override
  String get einvoiceReasons1 => 'நகல்';

  @override
  String get einvoiceReasons2 => 'தரவு உள்ளீட்டுப் பிழை';

  @override
  String get einvoiceReasons3 => 'ஆர்டர் ரத்து';

  @override
  String get einvoiceReasons4 => 'மற்றவை';

  @override
  String get einvoiceRemark => 'குறிப்பு';

  @override
  String get einvoiceIrn => 'IRN';

  @override
  String get einvoiceAckNo => 'ஒப்புகை எண்';

  @override
  String get einvoiceAckDate => 'ஒப்புகைத் தேதி';

  @override
  String get einvoiceSimulator =>
      'சோதனை முறை: ஜிஎஸ்டி வழங்குநர் இணைக்கப்படும் வரை IRN உள்ளமைந்த சிமுலேட்டரிலிருந்து வரும்.';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'வாடிக்கையாளருக்கு ஜிஎஸ்டிஐஎன் இல்லை; இ-இன்வாய்ஸ் பதிவுசெய்த வாங்குநர்களுக்கும் ஏற்றுமதிக்கும் மட்டுமே.';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'இந்த விலைப்பட்டியல் எண் IRP-க்குச் செல்லாது.';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'வாடிக்கையாளர் மற்றும் உங்கள் கிளையின் சரியான அஞ்சல் குறியீட்டைச் சேர்க்கவும்.';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'வாடிக்கையாளர் மற்றும் உங்கள் கிளையின் முகவரிகளைச் சேர்க்கவும்.';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn =>
      'ஒவ்வொரு பொருளுக்கும் HSN குறியீடு தேவை.';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch =>
      'மொத்தங்கள் பொருந்தவில்லை.';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'முதலில் உங்கள் கிளையின் ஜிஎஸ்டிஐஎன்-ஐச் சேர்க்கவும்.';

  @override
  String get einvoiceErrorsDuplicateIrn =>
      'IRP-இல் இந்த விலைப்பட்டியல் ஏற்கனவே உள்ளது.';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'இந்த IRN-ஐ ரத்துசெய்யும் 24 மணிநேரம் கடந்துவிட்டது. பதிலாக கிரெடிட் நோட் வழங்கவும்.';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated =>
      'IRN ஏற்கனவே உருவாக்கப்பட்டது.';

  @override
  String get einvoiceErrorsCancelEwbFirst =>
      'முதலில் இ-வே பில்லை ரத்துசெய்யவும்.';

  @override
  String get ewbTitle => 'இ-வே பில்';

  @override
  String get ewbGenerate => 'இ-வே பில் உருவாக்கு';

  @override
  String get ewbVehicleNo => 'வாகன எண்';

  @override
  String get ewbDistance => 'தூரம் (கிமீ)';

  @override
  String get ewbNumber => 'EWB எண்';

  @override
  String get ewbValidUpto => 'வரை செல்லும்';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'இது வாகன எண் போலத் தெரியவில்லை (எ.கா. TN01AB1234).';

  @override
  String get ewbErrorsInvalidDistance => 'தூரத்தைக் கிமீ-இல் உள்ளிடவும்.';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'இ-வே பில் காலாவதியாவதற்கு 8 மணிநேரம் முன்பிருந்து 8 மணிநேரம் பின்பு வரை மட்டுமே நீட்டிக்கலாம்.';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'இந்த இ-வே பில்லை ரத்துசெய்யும் 24 மணிநேரம் கடந்துவிட்டது.';

  @override
  String get ewbErrorsEwbExpired =>
      'இந்த இ-வே பில் காலாவதியானது; நீட்டிக்கவும்.';

  @override
  String get ewbErrorsNoActiveEwb =>
      'இந்த விலைப்பட்டியலில் செயலிலுள்ள இ-வே பில் இல்லை.';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'இந்த விலைப்பட்டியலில் ஏற்கனவே இ-வே பில் செயலில் உள்ளது.';

  @override
  String get ewbErrorsInvalidPincode => '6 இலக்க அஞ்சல் குறியீட்டை உள்ளிடவும்.';

  @override
  String get ewbStatusActive => 'செயலில்';

  @override
  String get ewbStatusCancelled => 'ரத்து';

  @override
  String get ewbChangeVehicle => 'வாகனத்தை மாற்று';

  @override
  String get ewbExtend => 'செல்லுபடியை நீட்டி';

  @override
  String get ewbCancel => 'இ-வே பில்லை ரத்துசெய்';

  @override
  String get ewbNewVehicle => 'புதிய வாகன எண்';

  @override
  String get ewbCurrentPlace => 'தற்போதைய இடம்';

  @override
  String get ewbCurrentPincode => 'தற்போதைய அஞ்சல் குறியீடு';

  @override
  String get ewbRemainingKm => 'மீதமுள்ள தூரம் (கிமீ)';

  @override
  String get ewbReason => 'காரணம்';

  @override
  String get ewbRemark => 'குறிப்பு';

  @override
  String get ewbSave => 'சேமி';

  @override
  String get ewbExtendHint =>
      'இ-வே பில் காலாவதியாவதற்கு 8 மணிநேரம் முன்பிருந்து 8 மணிநேரம் பின்பு வரை அனுமதி.';

  @override
  String get ewbCancelHint =>
      'உருவாக்கிய 24 மணிநேரத்துக்குள், சரக்கு நகராவிட்டால் அனுமதி.';

  @override
  String ewbCancelledNote(String number) {
    return 'இ-வே பில் $number ரத்துசெய்யப்பட்டது. புதியதை உருவாக்கலாம்.';
  }

  @override
  String get ewbVehicleReasons1 => 'வாகனப் பழுது';

  @override
  String get ewbVehicleReasons2 => 'இடமாற்று ஏற்றுமதி';

  @override
  String get ewbVehicleReasons3 => 'மற்றவை';

  @override
  String get ewbVehicleReasons4 => 'முதல் முறை';

  @override
  String get ewbExtendReasons1 => 'இயற்கைப் பேரிடர்';

  @override
  String get ewbExtendReasons2 => 'சட்டம் ஒழுங்கு';

  @override
  String get ewbExtendReasons4 => 'இடமாற்று ஏற்றுமதி';

  @override
  String get ewbExtendReasons5 => 'விபத்து';

  @override
  String get ewbExtendReasons99 => 'மற்றவை';

  @override
  String get ewbCancelReasons1 => 'நகல்';

  @override
  String get ewbCancelReasons2 => 'ஆர்டர் ரத்து';

  @override
  String get ewbCancelReasons3 => 'தரவு உள்ளீட்டுப் பிழை';

  @override
  String get ewbCancelReasons4 => 'மற்றவை';

  @override
  String get printTaxInvoice => 'வரி விலைப்பட்டியல்';

  @override
  String get printCreditNote => 'கிரெடிட் நோட்';

  @override
  String get printOriginal => 'பெறுநருக்கான அசல்';

  @override
  String get printBillTo => 'பில் பெறுநர்';

  @override
  String get printShipTo => 'சரக்கு பெறுநர்';

  @override
  String get printInvoiceNo => 'விலைப்பட்டியல் எண்';

  @override
  String get printInvoiceDate => 'விலைப்பட்டியல் தேதி';

  @override
  String get printSno => '#';

  @override
  String get printHsn => 'HSN/SAC';

  @override
  String get printTaxSummary => 'வரிச் சுருக்கம்';

  @override
  String get printRate => 'விகிதம்';

  @override
  String get printAmountInWords => 'தொகை எழுத்தில்';

  @override
  String get printBank => 'வங்கி விவரங்கள்';

  @override
  String get printTerms => 'விதிமுறைகள் & நிபந்தனைகள்';

  @override
  String printForCompany(String company) {
    return '$company சார்பாக';
  }

  @override
  String get printSignatory => 'அங்கீகரிக்கப்பட்ட கையொப்பமிடுபவர்';

  @override
  String get printComputerGenerated =>
      'இது கணினியால் உருவாக்கப்பட்ட விலைப்பட்டியல்.';

  @override
  String get printReverseCharge => 'தலைகீழ் கட்டணத்தில் செலுத்த வேண்டிய வரி';

  @override
  String get printExportLut =>
      'IGST செலுத்தாமல் LUT கீழ் ஏற்றுமதிக்கான விநியோகம்';

  @override
  String get printQuotation => 'விலைப்புள்ளி';

  @override
  String get printQuotationNo => 'விலைப்புள்ளி எண்';

  @override
  String get printQuotationDate => 'விலைப்புள்ளித் தேதி';

  @override
  String get printQuotedTo => 'விலைப்புள்ளி பெறுநர்';

  @override
  String get printComputerGeneratedQuote =>
      'இது கணினியால் உருவாக்கப்பட்ட விலைப்புள்ளி. குறிப்பிட்ட தேதி வரை விலைகள் செல்லும்.';

  @override
  String get printProforma => 'புரோஃபார்மா இன்வாய்ஸ்';

  @override
  String get printProformaNo => 'புரோஃபார்மா எண்';

  @override
  String get printProformaDate => 'புரோஃபார்மா தேதி';

  @override
  String get printComputerGeneratedProforma =>
      'இது புரோஃபார்மா இன்வாய்ஸ், வரி இன்வாய்ஸ் அல்ல. வழங்கும்போது வரி இன்வாய்ஸ் வழங்கப்படும்.';

  @override
  String get printDeliveryChallan => 'டெலிவரி சலான்';

  @override
  String get printApprovalMemo => 'ஒப்புதல் மெமோ';

  @override
  String get printCopyConsignee => 'பெறுநருக்கான அசல்';

  @override
  String get printCopyTransporter => 'போக்குவரத்தாளருக்கான இரண்டாம் நகல்';

  @override
  String get printCopyConsignor => 'அனுப்புநருக்கான மூன்றாம் நகல்';

  @override
  String get printConsignee => 'பெறுநர்';

  @override
  String get printChallanNo => 'சலான் எண்';

  @override
  String get printChallanDate => 'சலான் தேதி';

  @override
  String get printInvoiceBy => 'இன்வாய்ஸ் கடைசி தேதி';

  @override
  String get printValue => 'மதிப்பு';

  @override
  String get printNotASupply =>
      'வழங்கல் அல்லாத காரணத்திற்காக சரக்கு அனுப்பப்பட்டது. இந்த சலானில் வரி இல்லை.';

  @override
  String get printReceivedBy => 'பெற்றவர்';

  @override
  String get printSignatureAndDate => 'கையொப்பம் மற்றும் தேதி';

  @override
  String get outstandingReceivablesTitle => 'வரவேண்டியவை';

  @override
  String get outstandingReceivablesSubtitle =>
      'வாடிக்கையாளர்களிடமிருந்து வரவேண்டியவை, காலவாரியாக. வரவுகள் முதலில் பழைய பில்களைத் தீர்க்கும்.';

  @override
  String get outstandingPayablesTitle => 'செலுத்த வேண்டியவை';

  @override
  String get outstandingPayablesSubtitle =>
      'சப்ளையர்களுக்குச் செலுத்த வேண்டியவை, காலவாரியாக. செலுத்துகைகள் முதலில் பழைய பில்களைத் தீர்க்கும்.';

  @override
  String get outstandingParty => 'தரப்பு';

  @override
  String get outstandingBalance => 'இருப்பு';

  @override
  String get outstandingNotDue => 'இன்னும் தவணை வரவில்லை';

  @override
  String get outstandingD030 => '1-30 நாட்கள்';

  @override
  String get outstandingD3160 => '31-60 நாட்கள்';

  @override
  String get outstandingD6190 => '61-90 நாட்கள்';

  @override
  String get outstandingAdvance => 'முன்பணம்';

  @override
  String get outstandingOpenItems => 'திறந்த பில்கள்';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days நாட்கள் தாமதம்',
      one: '$days நாள் தாமதம்',
      zero: 'தவணை',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'நிலுவை எதுவுமில்லை.';

  @override
  String get outstandingD91180 => '91 முதல் 180 நாட்கள்';

  @override
  String get outstandingD180plus => '180 நாட்களுக்கு மேல்';

  @override
  String get returnsTitle => 'ஜிஎஸ்டி ரிட்டர்ன்கள்';

  @override
  String get returnsSubtitle =>
      'உங்கள் விலைப்பட்டியல்கள் மற்றும் பில்களிலிருந்து GSTR-1 மற்றும் GSTR-3B. இங்கே தாக்கல் செய்யவும், அல்லது ஜிஎஸ்டி போர்ட்டலின் ஆஃப்லைன் கருவிக்கு JSON பதிவிறக்கவும்.';

  @override
  String get returnsPeriod => 'வரிக் காலம்';

  @override
  String get returnsGstr1 => 'GSTR-1';

  @override
  String get returnsGstr3b => 'GSTR-3B';

  @override
  String get returnsDownload => 'JSON பதிவிறக்கு';

  @override
  String get returnsSection => 'பிரிவு';

  @override
  String get returnsCount => 'விலைப்பட்டியல்கள்';

  @override
  String get returnsTaxable => 'வரிக்குட்பட்ட மதிப்பு';

  @override
  String get returnsTax => 'வரி';

  @override
  String get returnsB2b => 'B2B: பதிவுசெய்த வாடிக்கையாளர்கள்';

  @override
  String get returnsB2cl => 'B2C பெரியது: வேறு மாநிலம், ₹1 லட்சத்துக்கு மேல்';

  @override
  String get returnsB2cs => 'B2C சிறியது';

  @override
  String get returnsExp => 'ஏற்றுமதி';

  @override
  String get returnsCdn => 'கிரெடிட் நோட்கள்';

  @override
  String get returnsCancelled =>
      'ரத்தான விலைப்பட்டியல்கள் (ஆவணச் சுருக்கத்தில்)';

  @override
  String get returnsOutward => '3.1(a) வெளிச்செல்லும் வரிக்குட்பட்ட விநியோகம்';

  @override
  String get returnsZeroRated => '3.1(b) பூஜ்ய விகிதம் (ஏற்றுமதி, SEZ)';

  @override
  String get returnsNil => '3.1(c) பூஜ்ய விகிதம் / விலக்கு';

  @override
  String get returnsRcm => '3.1(d) தலைகீழ் கட்டணத்தில் உள்வரும் விநியோகம்';

  @override
  String get returnsItc => '4. உள்ளீட்டு வரிக் கிரெடிட்';

  @override
  String get returnsSetOff => '6.1 வரி செலுத்துதல்';

  @override
  String get returnsHead => 'வரி வகை';

  @override
  String get returnsLiability => 'செலுத்த வேண்டிய வரி';

  @override
  String get returnsPaidByCredit => 'கிரெடிட் மூலம் செலுத்தியது';

  @override
  String get returnsCash => 'ரொக்கமாகச் செலுத்து';

  @override
  String get returnsCarryForward => 'முன்கொண்டு செல்லும் கிரெடிட்';

  @override
  String get returnsFilingNote =>
      'ரிட்டர்ன்கள் உங்கள் ஜிஎஸ்டி வழங்குநர் மூலம் தாக்கல் செய்யப்படுகின்றன. வழங்குநர் இணைக்கப்படும் வரை சோதனை முறை உள்ளமைந்த சிமுலேட்டரைப் பயன்படுத்தும்.';

  @override
  String get gstSettingsTitle => 'ஜிஎஸ்டி & விலைப்பட்டியல்';

  @override
  String get gstSettingsEinvoice => 'இ-இன்வாய்ஸ் (IRN) உருவாக்கு';

  @override
  String get gstSettingsEinvoiceHint =>
      '2017-18 முதல் எந்த ஆண்டிலும் விற்றுமுதல் ₹5 கோடியைத் தாண்டினால் கட்டாயம்.';

  @override
  String get gstSettingsEwbThreshold => 'இந்த மதிப்புக்கு மேல் இ-வே பில் (₹)';

  @override
  String get gstSettingsBilingual =>
      'விலைப்பட்டியல், சம்பளச் சீட்டு, படிவம் 16 இரண்டு மொழிகளில் அச்சிடு';

  @override
  String get gstSettingsPrintLanguage => 'அச்சின் இரண்டாம் மொழி';

  @override
  String get gstSettingsTerms => 'விலைப்பட்டியல் விதிமுறைகள் & நிபந்தனைகள்';

  @override
  String get gstSettingsBank => 'விலைப்பட்டியலில் வங்கி விவரங்கள்';

  @override
  String get importTitle => 'தரவு இறக்குமதி';

  @override
  String get importSubtitle =>
      'விரிதாள் அல்லது Tally-இலிருந்து வாடிக்கையாளர்கள், சப்ளையர்கள், பொருட்களைக் கொண்டு வாருங்கள்.';

  @override
  String get importParties => 'வாடிக்கையாளர்கள் & சப்ளையர்கள் (CSV)';

  @override
  String get importItems => 'பொருட்கள் (CSV)';

  @override
  String get importTally => 'Tally XML';

  @override
  String get importTemplate => 'மாதிரி CSV பதிவிறக்கு';

  @override
  String get importTallyHint =>
      'Tally-இல்: Display → List of Accounts → Alt+E (Export), XML வடிவம். சரக்குப் பொருட்களையும் சேர்க்கவும்.';

  @override
  String get importChoose => 'கோப்பைத் தேர்ந்தெடு';

  @override
  String get importPreview => 'கோப்பைச் சரிபார்';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count வரிசைகள்',
      one: '$count வரிசை',
    );
    return '$_temp0 இறக்குமதி செய்';
  }

  @override
  String get importRow => 'வரிசை';

  @override
  String get importStatus => 'முடிவு';

  @override
  String get importCreate => 'உருவாக்கப்படும்';

  @override
  String get importExists => 'ஏற்கனவே உள்ளது: தவிர்க்கப்பட்டது';

  @override
  String get importDone => 'இறக்குமதி செய்யப்பட்டது.';

  @override
  String get filingTitle => 'ஜிஎஸ்டி போர்ட்டலில் தாக்கல்';

  @override
  String get filingPortal => 'ஜிஎஸ்டி போர்ட்டல் இணைப்பு';

  @override
  String get filingPortalHint =>
      'முதலில் உங்கள் ஜிஎஸ்டி போர்ட்டல் சுயவிவரத்தில் “API access”-ஐ இயக்கவும். அமர்வு சுமார் 6 மணிநேரம் நீடிக்கும்.';

  @override
  String get filingUsername => 'ஜிஎஸ்டி போர்ட்டல் பயனர்பெயர்';

  @override
  String get filingSendOtp => 'OTP அனுப்பு';

  @override
  String get filingOtp => 'OTP';

  @override
  String get filingConnect => 'இணை';

  @override
  String filingConnected(String username, String time) {
    return '$username ஆக $time வரை இணைக்கப்பட்டது';
  }

  @override
  String get filingDisconnect => 'துண்டி';

  @override
  String filingSimulatorOtp(String otp) {
    return 'சோதனை முறை: OTP $otp.';
  }

  @override
  String get filingUpload => 'பதிவேற்று';

  @override
  String get filingUploadAgain => 'மீண்டும் பதிவேற்று';

  @override
  String filingUploaded(String time) {
    return '$time-இல் பதிவேற்றப்பட்டது';
  }

  @override
  String get filingGetOtp => 'EVC OTP அனுப்பு';

  @override
  String get filingEvcHint =>
      'OTP உங்கள் அங்கீகரிக்கப்பட்ட கையொப்பமிடுபவரின் மொபைலுக்குச் செல்லும்.';

  @override
  String get filingFile => 'EVC மூலம் தாக்கல் செய்';

  @override
  String filingFiled(String time) {
    return '$time-இல் தாக்கல் செய்யப்பட்டது';
  }

  @override
  String get filingArn => 'ARN';

  @override
  String get filingNotUploaded => 'பதிவேற்றப்படவில்லை';

  @override
  String get filingLocked =>
      'ஒரு மாதத்தின் GSTR-1 தாக்கல் ஆனதும், அந்த மாத விலைப்பட்டியல்களும் கிரெடிட் நோட்களும் பூட்டப்படும்.';

  @override
  String filingCashNote(String amount) {
    return 'தாக்கலுக்கு முன் உங்கள் மின்னணு ரொக்கப் பேரேட்டில் $amount வைக்கவும் (ஜிஎஸ்டி போர்ட்டலில் சலான்).';
  }

  @override
  String get filingErrorsGstSessionRequired =>
      'முதலில் ஜிஎஸ்டி போர்ட்டலுடன் இணையவும்.';

  @override
  String get filingErrorsGstSessionExpired =>
      'ஜிஎஸ்டி போர்ட்டல் அமர்வு முடிந்தது. மீண்டும் இணையவும்.';

  @override
  String get filingErrorsInvalidOtp => 'இந்த OTP சரியில்லை.';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'உங்கள் ஜிஎஸ்டி போர்ட்டல் பயனர்பெயரை உள்ளிடவும்.';

  @override
  String get filingErrorsUploadFirst => 'முதலில் ரிட்டர்னைப் பதிவேற்றவும்.';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'பதிவேற்றத்துக்குப் பின் உங்கள் கணக்குகள் மாறின. மீண்டும் பதிவேற்றி, பின் தாக்கல் செய்யவும்.';

  @override
  String get filingErrorsReturnAlreadyFiled =>
      'இந்த ரிட்டர்ன் ஏற்கனவே தாக்கல் செய்யப்பட்டது.';

  @override
  String get filingErrorsCompanyPanRequired =>
      'நிறுவனம் & கிளைகளில் வணிகத்தின் பான் எண்ணைச் சேர்க்கவும்.';

  @override
  String get filingErrorsInvalidPan => 'வணிகத்தின் பான் செல்லாது.';

  @override
  String get filingErrorsBranchGstinRequired =>
      'முதலில் தலைமை அலுவலகத்தின் ஜிஎஸ்டிஐஎன்-ஐச் சேர்க்கவும்.';

  @override
  String get hrEmployeesTitle => 'பணியாளர்கள்';

  @override
  String get hrEmployeesSubtitle =>
      'உங்கள் குழு, அவர்களின் சம்பளம், சட்டப்பூர்வ விவரங்கள்.';

  @override
  String get hrEmployeesNew => 'பணியாளரைச் சேர்';

  @override
  String get hrEmployeesNone => 'இன்னும் பணியாளர்கள் இல்லை.';

  @override
  String get hrSectionsPersonal => 'தனிப்பட்டவை';

  @override
  String get hrSectionsJob => 'வேலை';

  @override
  String get hrSectionsStatutory => 'PF, ESI & வரி';

  @override
  String get hrSectionsBank => 'சம்பளம் செலுத்துதல்';

  @override
  String get hrSectionsSalary => 'சம்பள அமைப்பு';

  @override
  String get hrCode => 'பணியாளர் குறியீடு';

  @override
  String get hrCodeHint => 'தானாக எண்ணிட காலியாக விடவும்';

  @override
  String get hrName => 'முழுப் பெயர்';

  @override
  String get hrNameHi => 'இந்தியில் பெயர் (விருப்பத்தேர்வு)';

  @override
  String get hrGender => 'பாலினம்';

  @override
  String get hrGendersMale => 'ஆண்';

  @override
  String get hrGendersFemale => 'பெண்';

  @override
  String get hrGendersOther => 'மற்றவர்';

  @override
  String get hrDob => 'பிறந்த தேதி';

  @override
  String get hrJoinedOn => 'சேர்ந்த தேதி';

  @override
  String get hrLeftOn => 'விலகிய தேதி';

  @override
  String get hrFixedTerm => 'நிலையான கால பணியாளர்';

  @override
  String get hrDepartment => 'துறை';

  @override
  String get hrDesignation => 'பதவி';

  @override
  String get hrWorkState => 'பணி மாநிலம்';

  @override
  String get hrWorkStateHint => 'இதைக் கொண்டு தொழில் வரி முடிவாகும்';

  @override
  String get hrPhone => 'மொபைல்';

  @override
  String get hrEmail => 'மின்னஞ்சல்';

  @override
  String get hrAddress => 'முகவரி';

  @override
  String get hrCity => 'நகரம்';

  @override
  String get hrPincode => 'அஞ்சல் குறியீடு';

  @override
  String get hrPan => 'பான்';

  @override
  String get hrAadhaarLast4 => 'ஆதார் (கடைசி 4 இலக்கங்கள் மட்டும்)';

  @override
  String get hrUan => 'UAN';

  @override
  String get hrEsiNumber => 'ESI IP எண்';

  @override
  String get hrPfMember => 'PF உறுப்பினர்';

  @override
  String get hrEpsEligible => 'ஓய்வூதியத் திட்டத்தில் (EPS)';

  @override
  String get hrPfOnActual => 'முழுச் சம்பளத்தில் PF (₹15,000-க்கு மேல்)';

  @override
  String get hrDisabled => 'மாற்றுத்திறனாளி (₹25,000 வரை ESI)';

  @override
  String get hrTaxRegime => 'வரி முறை';

  @override
  String get hrRegimesNew => 'புதிய முறை';

  @override
  String get hrRegimesOld => 'பழைய முறை';

  @override
  String get hrMetro => 'பெருநகரில் வசிக்கிறார் (HRA-க்கு)';

  @override
  String get hrPaymentMode => 'செலுத்தும் முறை';

  @override
  String get hrPaymentModesBank => 'வங்கிப் பரிமாற்றம்';

  @override
  String get hrPaymentModesCash => 'ரொக்கம்';

  @override
  String get hrPaymentModesCheque => 'காசோலை';

  @override
  String get hrBankName => 'வங்கி';

  @override
  String get hrBankIfsc => 'IFSC';

  @override
  String get hrBankAccount => 'கணக்கு எண்';

  @override
  String hrBankAccountHint(String last4) {
    return 'மறையாக்கம் செய்து சேமிக்கப்படுகிறது. பதிவில்: கடைசி $last4';
  }

  @override
  String get hrMonthlyGross => 'மாத மொத்தச் சம்பளம்';

  @override
  String get hrStatus => 'நிலை';

  @override
  String get hrStatusesActive => 'செயலில்';

  @override
  String get hrStatusesLeft => 'விலகினார்';

  @override
  String get hrSave => 'சேமி';

  @override
  String get hrSaved => 'சேமிக்கப்பட்டது';

  @override
  String get hrCreate => 'பணியாளரைச் சேர்';

  @override
  String get hrSalaryTitle => 'சம்பள அமைப்பு';

  @override
  String get hrSalaryEffectiveFrom => 'முதல் அமலில்';

  @override
  String get hrSalaryComponent => 'கூறு';

  @override
  String get hrSalaryMonthly => 'மாதம் (₹)';

  @override
  String get hrSalaryPfWage => 'அடிப்படை/DA (PF சம்பளம்)';

  @override
  String get hrSalaryHra => 'HRA';

  @override
  String get hrSalaryEsiExcluded => 'ESI சம்பளத்தில் இல்லை';

  @override
  String get hrSalaryAdd => 'கூறு சேர்';

  @override
  String get hrSalaryRevise => 'திருத்தத்தைச் சேமி';

  @override
  String get hrSalaryHistory => 'முந்தைய அமைப்புகள்';

  @override
  String get hrSalaryGross => 'மாத மொத்தம்';

  @override
  String get hrSalaryAnnual => 'ஆண்டுக்கு';

  @override
  String get hrSalaryDefaultsBasic => 'அடிப்படை';

  @override
  String get hrSalaryDefaultsHra => 'HRA';

  @override
  String get hrSalaryDefaultsSpecial => 'சிறப்புப் படி';

  @override
  String get hrDeclarationTitle => 'வரி அறிவிப்பு';

  @override
  String get hrDeclarationHint =>
      'TDS-க்குப் பயன்படும். நிலையான கழிவு தவிர மற்ற கழிவுகள் பழைய முறையில் மட்டும்.';

  @override
  String get hrDeclarationFy => 'நிதியாண்டு';

  @override
  String get hrDeclarationRentPaid => 'ஆண்டில் செலுத்திய வாடகை';

  @override
  String get hrDeclarationC80 => '80C முதலீடுகள் (PF தானாகச் சேர்க்கப்படும்)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) NPS';

  @override
  String get hrDeclarationD80 => '80D மருத்துவக் காப்பீடு';

  @override
  String get hrDeclarationHomeLoanInterest => 'வீட்டுக் கடன் வட்டி';

  @override
  String get hrDeclarationOtherDeductions => 'மற்ற கழிவுகள் (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'மற்ற வருமானம்';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'இந்த ஆண்டு முந்தைய முதலாளியிடம் பெற்ற சம்பளம்';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'இந்த ஆண்டு ஏற்கனவே பிடித்த TDS (முந்தைய முதலாளி, அல்லது Varchasv-க்கு முன்)';

  @override
  String get hrDeclarationSave => 'அறிவிப்பைச் சேமி';

  @override
  String get hrAttendanceTitle => 'வருகை';

  @override
  String get hrAttendanceSubtitle =>
      'குறிக்காத வேலை நாட்கள் வருகையாகக் கொள்ளப்படும். வராமை எனக் குறிக்க நாளைக் கிளிக் செய்யவும், பின் அரை நாள், பின் மீண்டும் வருகை.';

  @override
  String get hrAttendanceLegendPresent => 'வருகை';

  @override
  String get hrAttendanceLegendAbsent => 'வராமை';

  @override
  String get hrAttendanceLegendHalfDay => 'அரை நாள்';

  @override
  String get hrAttendanceLegendLeave => 'விடுப்பில்';

  @override
  String get hrAttendanceLegendWeekOff => 'வார விடுமுறை';

  @override
  String get hrAttendanceLegendHoliday => 'விடுமுறை நாள்';

  @override
  String get hrAttendanceLegendLate => 'தாமதம்';

  @override
  String get hrAttendanceLop => 'சம்பள இழப்பு';

  @override
  String get hrAttendanceLocked =>
      'இந்த மாதச் சம்பளம் இறுதியானது, எனவே வருகையை மாற்ற முடியாது.';

  @override
  String get hrAttendanceHolidays => 'விடுமுறை நாட்கள்';

  @override
  String get hrAttendanceAddHoliday => 'விடுமுறை சேர்';

  @override
  String get hrAttendanceHolidayName => 'விடுமுறை';

  @override
  String get hrAttendanceNoEmployees => 'இந்த மாதம் யாரும் வேலையில் இல்லை.';

  @override
  String get hrAttendanceSaving => 'சேமிக்கிறது…';

  @override
  String get hrLeaveTitle => 'விடுப்பு';

  @override
  String get hrLeaveSubtitle => 'கோரிக்கைகள், ஒப்புதல்கள், மீதமுள்ள விடுப்பு.';

  @override
  String get hrLeaveNew => 'விடுப்புக்கு விண்ணப்பி';

  @override
  String get hrLeaveEmployee => 'பணியாளர்';

  @override
  String get hrLeaveType => 'விடுப்பு வகை';

  @override
  String get hrLeaveFrom => 'இருந்து';

  @override
  String get hrLeaveTo => 'வரை';

  @override
  String get hrLeaveHalfDay => 'அரை நாள்';

  @override
  String get hrLeaveReason => 'காரணம்';

  @override
  String get hrLeaveDays => 'நாட்கள்';

  @override
  String get hrLeaveSubmit => 'கோரிக்கையைச் சமர்ப்பி';

  @override
  String get hrLeaveApprove => 'ஒப்புதல் அளி';

  @override
  String get hrLeaveReject => 'நிராகரி';

  @override
  String get hrLeaveCancel => 'ரத்துசெய்';

  @override
  String get hrLeavePending => 'ஒப்புதலுக்குக் காத்திருக்கிறது';

  @override
  String get hrLeaveAll => 'அனைத்துக் கோரிக்கைகளும்';

  @override
  String get hrLeaveBalances => 'மீதமுள்ள விடுப்பு';

  @override
  String get hrLeaveOpening => 'முன்கொண்டு வந்தது';

  @override
  String get hrLeaveQuota => 'இந்த ஆண்டு';

  @override
  String get hrLeaveTaken => 'எடுத்தது';

  @override
  String get hrLeaveBalance => 'மீதம்';

  @override
  String get hrLeaveNone => 'விடுப்புக் கோரிக்கைகள் இல்லை.';

  @override
  String get hrLeaveStatusesPending => 'நிலுவையில்';

  @override
  String get hrLeaveStatusesApproved => 'ஒப்புதல் பெற்றது';

  @override
  String get hrLeaveStatusesRejected => 'நிராகரிக்கப்பட்டது';

  @override
  String get hrLeaveStatusesCancelled => 'ரத்துசெய்யப்பட்டது';

  @override
  String get hrSettleTitle => 'முழு & இறுதித் தீர்வு';

  @override
  String get hrSettleHint =>
      'பணியாளரை விலகியவராகக் குறித்து, பணிக்கொடை மற்றும் விடுப்பு ஈடுசெய்தலை வழங்கும். கடைசி மாதச் சம்பளம் சம்பளப் பட்டியலிலிருந்து வரும்.';

  @override
  String get hrSettleLeftOn => 'கடைசி வேலை நாள்';

  @override
  String get hrSettleServiceYears => 'பணிக்காலம் (ஆண்டுகள்)';

  @override
  String get hrSettleGratuity => 'பணிக்கொடை';

  @override
  String get hrSettleNotEligible => 'தகுதியில்லை (5 ஆண்டுகளுக்குக் குறைவு)';

  @override
  String get hrSettleLeaveDays => 'ஈடுசெய்ய விடுப்பு (நாட்கள்)';

  @override
  String get hrSettleEncashment => 'விடுப்பு ஈடுசெய்தல்';

  @override
  String get hrSettleOtherEarnings =>
      'மற்ற நிலுவைகள் (போனஸ், அறிவிப்புச் சம்பளம்)';

  @override
  String get hrSettleRecoveries => 'வசூல் (முன்பணம்)';

  @override
  String get hrSettleRemarks => 'குறிப்பு';

  @override
  String get hrSettleTotal => 'நிகரச் செலுத்த வேண்டியது';

  @override
  String get hrSettleConfirm => 'தீர்வு செய்து விலகியதாகக் குறி';

  @override
  String hrSettleDone(String date, String amount) {
    return '$date அன்று தீர்வு: $amount';
  }

  @override
  String get hrPayslips => 'சம்பளச் சீட்டுகள்';

  @override
  String get hrErrorsInvalidPan => 'இந்தப் பான் செல்லாது (எ.கா. ABCDE1234F).';

  @override
  String get hrErrorsInvalidIfsc => 'இந்த IFSC செல்லாது (எ.கா. HDFC0001234).';

  @override
  String get hrErrorsInvalidBankAccount => '6 முதல் 18 இலக்கங்கள் உள்ளிடவும்.';

  @override
  String get hrErrorsBasicRequired =>
      'குறைந்தது ஒரு கூறை அடிப்படை/DA எனக் குறிக்கவும்.';

  @override
  String get hrErrorsNoComponents =>
      'குறைந்தது ஒரு சம்பளக் கூறைச் சேர்க்கவும்.';

  @override
  String get hrErrorsDuplicateComponent => 'இரண்டு கூறுகளுக்கு ஒரே குறியீடு.';

  @override
  String get hrErrorsEmployeeCodeTaken =>
      'இந்தக் குறியீடு வேறொரு பணியாளருடையது.';

  @override
  String get hrErrorsDobAfterJoining =>
      'பிறந்த தேதி சேர்ந்த தேதிக்கு முன் இருக்க வேண்டும்.';

  @override
  String get hrErrorsBeforeJoining => 'இது சேர்ந்த தேதிக்கு முன்னானது.';

  @override
  String get hrErrorsLeaveOverlap =>
      'இது வேறொரு விடுப்புக் கோரிக்கையுடன் மோதுகிறது.';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'போதுமான விடுப்பு இல்லை.';

  @override
  String get hrErrorsNoWorkingDays =>
      'இந்தத் தேதிகள் அனைத்தும் விடுமுறை அல்லது வார விடுமுறை.';

  @override
  String get hrErrorsHalfDaySingleDate =>
      'அரை நாள் ஒரே தேதியாக இருக்க வேண்டும்.';

  @override
  String get hrErrorsLeaveCrossesYear =>
      '31 மார்ச்சைத் தாண்டும் விடுப்பைப் பிரிக்கவும்.';

  @override
  String get hrErrorsNotEmployedOnDate => 'அந்தத் தேதியில் வேலையில் இல்லை.';

  @override
  String get hrErrorsDayOnLeave =>
      'அந்த நாளில் ஒப்புதல் பெற்ற விடுப்பு உள்ளது; முதலில் அதை ரத்துசெய்யவும்.';

  @override
  String get hrErrorsPayrollFinalized =>
      'அந்த மாதச் சம்பளம் ஏற்கனவே இறுதியானது.';

  @override
  String get hrErrorsLeaveNotPending =>
      'இந்தக் கோரிக்கை மீது ஏற்கனவே முடிவு எடுக்கப்பட்டது.';

  @override
  String get hrErrorsLeaveNotOpen => 'இந்தக் கோரிக்கை ஏற்கனவே மூடப்பட்டது.';

  @override
  String get hrErrorsLeftBeforeJoining => 'இது சேர்ந்த தேதிக்கு முன்னானது.';

  @override
  String get hrErrorsNoSalaryStructure =>
      'முதலில் சம்பள அமைப்பைச் சேர்க்கவும்.';

  @override
  String get hrErrorsAlreadyLeft =>
      'இந்தப் பணியாளருக்கு ஏற்கனவே தீர்வு செய்யப்பட்டது.';

  @override
  String get hrErrorsRecoveriesExceedDues =>
      'வசூல் நிலுவையை விட அதிகமாக இருக்க முடியாது.';

  @override
  String get hrErrorsInvalidUan => 'UAN-இல் 12 இலக்கங்கள் இருக்கும்.';

  @override
  String get hrErrorsInvalidEsiNumber =>
      'ESI IP எண்ணில் 10 முதல் 17 இலக்கங்கள் இருக்கும்.';

  @override
  String get hrErrorsInvalidAadhaarLast4 =>
      'கடைசி 4 இலக்கங்களை மட்டும் உள்ளிடவும்.';

  @override
  String get hrErrorsInvalidPhone => '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.';

  @override
  String get hrErrorsToBeforeFrom =>
      '“வரை” “இருந்து”-க்கு முன் இருக்க முடியாது.';

  @override
  String get hrErrorsUnknownLeaveType => 'விடுப்பு வகையைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get hrErrorsUnknownEmployee => 'பணியாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get hrErrorsLoanNotActive =>
      'இந்தக் கடன் முழுவதும் திருப்பிச் செலுத்தப்பட்டது அல்லது ரத்தாகிவிட்டது.';

  @override
  String get hrErrorsOverRecovery =>
      'இந்தத் தொகை கடனில் மீதமுள்ளதை விட அதிகம்.';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'திருப்பிச் செலுத்தும் தேதி கடன் வழங்கிய தேதிக்கு முன் உள்ளது.';

  @override
  String get hrErrorsExpiryBeforeIssue =>
      'காலாவதி தேதி வழங்கிய தேதிக்கு முன் உள்ளது.';

  @override
  String get hrLoansTitle => 'முன்பணம் & கடன்கள்';

  @override
  String get hrLoansNew => 'முன்பணம் அல்லது கடன் வழங்கு';

  @override
  String get hrLoansKind => 'வகை';

  @override
  String get hrLoansKindsAdvance => 'சம்பள முன்பணம்';

  @override
  String get hrLoansKindsLoan => 'கடன்';

  @override
  String get hrLoansDate => 'வழங்கிய தேதி';

  @override
  String get hrLoansAmount => 'தொகை';

  @override
  String get hrLoansInstalment => 'மாதத் தவணை';

  @override
  String get hrLoansStartPeriod => 'வசூல் தொடக்கம்';

  @override
  String get hrLoansPaidFrom => 'இதிலிருந்து செலுத்தியது';

  @override
  String get hrLoansRemarks => 'குறிப்பு';

  @override
  String get hrLoansRecovered => 'வசூலானது';

  @override
  String get hrLoansBalance => 'மீதம்';

  @override
  String get hrLoansStatusesActive => 'வசூல் நடைபெறுகிறது';

  @override
  String get hrLoansStatusesClosed => 'வசூல் முடிந்தது';

  @override
  String get hrLoansStatusesCancelled => 'ரத்துசெய்யப்பட்டது';

  @override
  String get hrLoansNone => 'முன்பணமோ கடனோ இல்லை.';

  @override
  String get hrLoansCreate => 'வழங்கு';

  @override
  String get hrLoansCancel => 'ரத்துசெய்';

  @override
  String get hrLoansReceive => 'திருப்பிச் செலுத்துதலைப் பெறு';

  @override
  String get hrLoansReceiveAmount => 'பெற்ற தொகை';

  @override
  String get hrLoansReceivedInto => 'எந்தக் கணக்கில் பெறப்பட்டது';

  @override
  String get hrLoansReceiveSave => 'திருப்பிச் செலுத்துதலைச் சேமி';

  @override
  String get hrShiftsTitle => 'பணிநேரங்கள்';

  @override
  String get hrShiftsName => 'பணிநேரம்';

  @override
  String get hrShiftsStart => 'தொடக்கம்';

  @override
  String get hrShiftsEnd => 'முடிவு';

  @override
  String get hrShiftsGrace => 'சலுகை (நிமிடம்)';

  @override
  String get hrShiftsFullDay => 'முழு நாள் (நிமிடம்)';

  @override
  String get hrShiftsHalfDay => 'அரை நாள் (நிமிடம்)';

  @override
  String get hrShiftsIsDefault => 'முதன்மை';

  @override
  String get hrShiftsAdd => 'பணிநேரம் சேர்';

  @override
  String get hrShiftsSave => 'சேமி';

  @override
  String get hrShiftsNone =>
      'இன்னும் பணிநேரங்கள் இல்லை. பதிவுகள் 09:30–18:30 படி படிக்கப்படும்.';

  @override
  String get hrShiftsShift => 'பணிநேரம்';

  @override
  String get hrShiftsNoShift => 'நிறுவன முதன்மை';

  @override
  String get hrPunchesTitle => 'வருகைப் பதிவுகளை இறக்குமதி செய்';

  @override
  String get hrPunchesHint =>
      'பயோமெட்ரிக் இயந்திரத்தின் CSV, நெடுவரிசைகள்: code, date (YYYY-MM-DD), in, out (24 மணி HH:MM). ஒவ்வொரு நாளும் பணியாளரின் பணிநேரப்படி படிக்கப்படும்.';

  @override
  String get hrPunchesTemplate => 'மாதிரி CSV பதிவிறக்கு';

  @override
  String get hrPunchesChoose => 'CSV கோப்பைத் தேர்ந்தெடு';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count நாட்கள்',
      one: '$count நாள்',
    );
    return '$_temp0 இறக்குமதி செய்';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count நாட்கள்',
      one: '$count நாள்',
    );
    return '$_temp0 இறக்குமதி செய்யப்பட்டன.';
  }

  @override
  String get hrPunchesRow => 'வரிசை';

  @override
  String get hrPunchesCode => 'குறியீடு';

  @override
  String get hrPunchesDate => 'தேதி';

  @override
  String get hrPunchesWorked => 'வேலை செய்தது';

  @override
  String get hrPunchesStatus => 'முடிவு';

  @override
  String get hrPunchesLate => 'தாமதம்';

  @override
  String get hrDocumentsTitle => 'ஆவணங்கள் மற்றும் கேஒய்சி';

  @override
  String get hrDocumentsHelp =>
      'அடையாள மற்றும் இணக்க ஆவணங்கள். எண்ணின் கடைசி நான்கு எழுத்துகள் மட்டுமே காட்டப்படும். காலாவதிக்கு முன் நினைவூட்ட காலாவதி தேதியைச் சேர்க்கவும்.';

  @override
  String get hrDocumentsNone => 'இன்னும் ஆவணங்கள் எதுவும் இல்லை.';

  @override
  String hrDocumentsExpires(String date) {
    return '$date அன்று காலாவதி';
  }

  @override
  String get hrDocumentsNoExpiry => 'காலாவதி இல்லை';

  @override
  String get hrDocumentsExpired => 'காலாவதி ஆனது';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n நாட்கள் உள்ளன',
      one: '$n நாள் உள்ளது',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'நீக்கு';

  @override
  String get hrDocumentsKind => 'ஆவணம்';

  @override
  String get hrDocumentsNumber => 'எண்';

  @override
  String get hrDocumentsIssuedOn => 'வழங்கிய தேதி';

  @override
  String get hrDocumentsExpiresOnLabel => 'காலாவதி தேதி';

  @override
  String get hrDocumentsAdd => 'ஆவணத்தைச் சேர்';

  @override
  String get hrDocumentsKindsAadhaar => 'ஆதார்';

  @override
  String get hrDocumentsKindsPan => 'பான்';

  @override
  String get hrDocumentsKindsPassport => 'கடவுச்சீட்டு';

  @override
  String get hrDocumentsKindsDrivingLicence => 'ஓட்டுநர் உரிமம்';

  @override
  String get hrDocumentsKindsVoterId => 'வாக்காளர் அடையாள அட்டை';

  @override
  String get hrDocumentsKindsBankProof => 'வங்கி ஆதாரம்';

  @override
  String get hrDocumentsKindsPoliceVerification => 'காவல் சரிபார்ப்பு';

  @override
  String get hrDocumentsKindsMedicalFitness => 'மருத்துவத் தகுதி';

  @override
  String get hrDocumentsKindsContract => 'ஒப்பந்தம்';

  @override
  String get hrDocumentsKindsOther => 'மற்றவை';

  @override
  String get hrDocumentsExpiringTitle => 'காலாவதியாகும் ஆவணங்கள்';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'பணியில் உள்ள ஊழியர்களின் காலாவதியான அல்லது விரைவில் காலாவதியாகும் ஆவணங்கள், விரைவில் முடிவதே முதலில்.';

  @override
  String get hrDocumentsWithin => 'இதற்குள் காலாவதி';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n நாட்கள்',
      one: '$n நாள்',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'காட்டு';

  @override
  String get hrDocumentsEmployee => 'ஊழியர்';

  @override
  String get hrDocumentsNoneExpiring =>
      'இந்தக் காலத்தில் எதுவும் காலாவதியாகவில்லை.';

  @override
  String get payrollTitle => 'சம்பளப் பட்டியல்';

  @override
  String get payrollSubtitle =>
      'PF, ESI, தொழில் வரி, TDS கணக்கிட்ட மாதச் சம்பளம், உங்கள் கணக்குகளில் பதியப்படும்.';

  @override
  String get payrollRun => 'சம்பளம் கணக்கிடு';

  @override
  String get payrollMonth => 'மாதம்';

  @override
  String get payrollNone => 'இன்னும் சம்பளம் கணக்கிடப்படவில்லை.';

  @override
  String payrollEmployees(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count பணியாளர்கள்',
      one: '$count பணியாளர்',
    );
    return '$_temp0';
  }

  @override
  String get payrollStatusesDraft => 'வரைவு';

  @override
  String get payrollStatusesFinalized => 'இறுதி';

  @override
  String get payrollStatusesPaid => 'செலுத்தப்பட்டது';

  @override
  String get payrollStatusesCancelled => 'ரத்து';

  @override
  String get payrollColsEmployee => 'பணியாளர்';

  @override
  String get payrollColsPaidDays => 'சம்பள நாட்கள்';

  @override
  String get payrollColsLop => 'இழப்பு நாட்கள்';

  @override
  String get payrollColsGross => 'மொத்தம்';

  @override
  String get payrollColsPf => 'PF';

  @override
  String get payrollColsEsi => 'ESI';

  @override
  String get payrollColsPt => 'தொழில் வரி';

  @override
  String get payrollColsLwf => 'LWF';

  @override
  String get payrollColsTds => 'TDS';

  @override
  String get payrollColsOther => 'மற்றவை';

  @override
  String get payrollColsNet => 'நிகரச் சம்பளம்';

  @override
  String get payrollRefresh => 'வருகையிலிருந்து புதுப்பி';

  @override
  String get payrollFinalize => 'இறுதிசெய்து பதி';

  @override
  String get payrollFinalizeHint =>
      'சம்பளம், PF, ESI, தொழில் வரி, TDS செலுத்த வேண்டியவற்றை உங்கள் கணக்குகளில் பதியும். பின்னர் அந்த மாத வருகை பூட்டப்படும்.';

  @override
  String get payrollPay => 'செலுத்துகையைப் பதி';

  @override
  String get payrollPayFrom => 'இதிலிருந்து செலுத்தியது';

  @override
  String get payrollPayDate => 'செலுத்தும் தேதி';

  @override
  String get payrollCancel => 'சம்பளத்தை ரத்துசெய்';

  @override
  String get payrollFilesTitle => 'தாக்கல் & செலுத்துதலுக்கான கோப்புகள்';

  @override
  String get payrollFilesEcr => 'EPF ECR';

  @override
  String get payrollFilesEsi => 'ESI பங்களிப்பு';

  @override
  String get payrollFilesBank => 'வங்கிப் பரிமாற்றம்';

  @override
  String payrollFilesMissing(String codes) {
    return 'விடுபட்டவை (விவரங்கள் இல்லை): $codes';
  }

  @override
  String get payrollTotalsGross => 'மொத்தச் சம்பளம்';

  @override
  String get payrollTotalsDeductions => 'பிடித்தங்கள்';

  @override
  String get payrollTotalsNet => 'நிகரச் சம்பளம்';

  @override
  String get payrollTotalsEmployer => 'முதலாளியின் PF/ESI/LWF';

  @override
  String get payrollLopEdited => 'கைமுறையாக உள்ளிட்டது';

  @override
  String get payrollLopReset => 'வருகையைப் பயன்படுத்து';

  @override
  String get payrollAddDeduction => 'பிடித்தம் சேர்';

  @override
  String get payrollDeductionName => 'பிடித்தம்';

  @override
  String get payrollDeductionAmount => 'தொகை';

  @override
  String get payrollEdit => 'திருத்து';

  @override
  String get payrollView => 'சம்பளச் சீட்டு';

  @override
  String get payrollErrorsRunExists => 'அந்த மாதச் சம்பளம் ஏற்கனவே உள்ளது.';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'முதலில் முந்தைய மாத வரைவை இறுதிசெய்யவும் அல்லது ரத்துசெய்யவும்.';

  @override
  String get payrollErrorsRunNotDraft => 'வரைவை மட்டுமே மாற்ற முடியும்.';

  @override
  String get payrollErrorsRunEmpty => 'இறுதிசெய்ய சம்பளச் சீட்டுகள் இல்லை.';

  @override
  String get payrollErrorsRunNotFinalized =>
      'முதலில் சம்பளத்தை இறுதிசெய்யவும்.';

  @override
  String get payrollErrorsRunPaid => 'செலுத்திய சம்பளத்தை ரத்துசெய்ய முடியாது.';

  @override
  String get payrollErrorsLaterRunFinal =>
      'பிந்தைய மாதம் ஏற்கனவே இறுதியானது; முதலில் அதை ரத்துசெய்யவும்.';

  @override
  String get payrollErrorsLopExceedsDays =>
      'இழப்பு நாட்கள் மாதத்தின் நாட்களை விட அதிகம்.';

  @override
  String get payrollErrorsDeductionsExceedPay =>
      'பிடித்தங்கள் சம்பளத்தை விட அதிகம்.';

  @override
  String get payrollErrorsInvalidPeriod => 'மாதத்தைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get payrollErrorsInvalidSettings => 'அமைப்புகளைச் சரிபார்க்கவும்.';

  @override
  String get payrollErrorsReservedCode =>
      'இந்தக் குறியீடு தானாகக் கணக்கிடப்படும் நிலுவைத் தொகைக்கு ஒதுக்கப்பட்டது.';

  @override
  String get payrollErrorsInvalidInstalment =>
      'தவணை 0-ஐ விட அதிகமாகவும் தொகையை விடக் குறைவாகவும் இருக்க வேண்டும்.';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'கடன் வழங்கும் முன் வசூல் தொடங்க முடியாது.';

  @override
  String get payrollErrorsEmployeeNotActive => 'இந்தப் பணியாளர் விலகிவிட்டார்.';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'இதில் ஒரு பகுதி ஏற்கனவே வசூலானது; ரத்துசெய்ய முடியாது.';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'BSR குறியீடும் சலான் வரிசை எண்ணும் உள்ளிடவும்.';

  @override
  String get payrollErrorsInvalidBsrCode =>
      'BSR குறியீட்டில் 7 இலக்கங்கள் இருக்கும்.';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'சலான் வரிசை எண்ணில் 5 இலக்கங்கள் வரை இருக்கும்.';

  @override
  String get payrollErrorsInvalidTan => 'இந்த TAN செல்லாது (எ.கா. MUMA12345B).';

  @override
  String get payrollErrorsNoFinalPayslips =>
      'அந்த ஆண்டுக்கு இறுதிச் சம்பளச் சீட்டுகள் இல்லை.';

  @override
  String get payrollErrorsInvalidTime =>
      '09:30 போன்ற 24 மணி நேரத்தைப் பயன்படுத்தவும்.';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'அரை நாள் முழு நாளை விட நீளமாக இருக்க முடியாது.';

  @override
  String get payrollErrorsInvalidAmount => 'தொகையை உள்ளிடவும்.';

  @override
  String get payrollSettingsTitle => 'சம்பளப் பட்டியல் அமைப்புகள்';

  @override
  String get payrollSettingsSubtitle =>
      'பதிவுக் குறியீடுகள், வார விடுமுறைகள், மாநில வரிகள்.';

  @override
  String get payrollSettingsPfCode => 'EPF நிறுவனக் குறியீடு';

  @override
  String get payrollSettingsEsiCode => 'ESI முதலாளிக் குறியீடு';

  @override
  String get payrollSettingsLabourCode =>
      'தொழிலாளர் சட்டத்தின் 50% சம்பள விதியைப் பயன்படுத்து';

  @override
  String get payrollSettingsLabourCodeHint =>
      'சமூகப் பாதுகாப்புச் சட்டப்படி (21 நவ 2025 முதல்), படிகள் சம்பளத்தின் பாதிக்கு மேல் இருந்தால், மிகுதி PF சம்பளமாகக் கொள்ளப்படும்.';

  @override
  String get payrollSettingsWeeklyOffs => 'வார விடுமுறைகள்';

  @override
  String get payrollSettingsLwf => 'தொழிலாளர் நல நிதி';

  @override
  String get payrollSettingsLwfEmployee => 'பணியாளர் பங்கு (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'முதலாளி பங்கு (₹)';

  @override
  String get payrollSettingsLwfMonths => 'பிடிக்கும் மாதங்கள்';

  @override
  String get payrollSettingsEncashment => 'ஒரு நாள் விடுப்பு ஈடுசெய்தல்';

  @override
  String payrollSettingsDivisor(String n) {
    return 'மாதச் சம்பளம் ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'சேமி';

  @override
  String get payrollSettingsTan => 'TAN (வரிப் பிடித்தக் கணக்கு எண்)';

  @override
  String get payrollSlipTitle => 'சம்பளச் சீட்டு';

  @override
  String payrollSlipFor(String month) {
    return '$month சம்பளச் சீட்டு';
  }

  @override
  String get payrollSlipEarnings => 'வருவாய்';

  @override
  String get payrollSlipDeductions => 'பிடித்தங்கள்';

  @override
  String get payrollSlipNetPay => 'நிகரச் சம்பளம்';

  @override
  String get payrollSlipInWords => 'எழுத்தில்';

  @override
  String get payrollSlipEmployer => 'முதலாளி பங்களிப்புகள் (பிடிக்கப்படவில்லை)';

  @override
  String get payrollSlipTax => 'வருமான வரிக் கணக்கீடு';

  @override
  String get payrollSlipAnnualSalary => 'ஆண்டின் மதிப்பிட்ட சம்பளம்';

  @override
  String get payrollSlipTaxableIncome => 'வரிக்குட்பட்ட வருமானம்';

  @override
  String get payrollSlipAnnualTax => 'ஆண்டு வரி';

  @override
  String get payrollSlipDeductedSoFar => 'இதுவரை பிடித்தது';

  @override
  String get payrollSlipPfEmployee => 'வருங்கால வைப்பு நிதி';

  @override
  String get payrollSlipEsiEmployee => 'ESI';

  @override
  String get payrollSlipPt => 'தொழில் வரி';

  @override
  String get payrollSlipLwf => 'தொழிலாளர் நல நிதி';

  @override
  String get payrollSlipTds => 'வருமான வரி (TDS)';

  @override
  String get payrollSlipEps => 'ஓய்வூதியம் (EPS)';

  @override
  String get payrollSlipEpf => 'PF (முதலாளி)';

  @override
  String get payrollSlipEdli => 'EDLI';

  @override
  String get payrollSlipAdmin => 'PF நிர்வாகம்';

  @override
  String get payrollSlipEsiEmployer => 'ESI (முதலாளி)';

  @override
  String get payrollSlipComputerGenerated =>
      'இது கணினியால் உருவான சம்பளச் சீட்டு, கையொப்பம் தேவையில்லை.';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count முந்தைய மாதங்கள்',
      one: '$count முந்தைய மாதம்',
    );
    return 'சம்பள அமைப்பிலிருந்து மதிப்பிட்ட $_temp0 அடங்கும் (Varchasv-க்கு முன் செலுத்தியது).';
  }

  @override
  String get payrollExtraTitle => 'கூடுதல் வருவாய் (இந்த மாதம் மட்டும்)';

  @override
  String get payrollExtraName => 'வருவாய்';

  @override
  String get payrollExtraAmount => 'தொகை';

  @override
  String get payrollExtraAdd => 'வருவாய் சேர்';

  @override
  String get payrollExtraEsiExcluded => 'ESI சம்பளத்தில் இல்லை (எ.கா. போனஸ்)';

  @override
  String get payrollLoanRecoveryTitle => 'கடன் & முன்பணத் தவணைகள்';

  @override
  String get payrollLoanRecoveryHint =>
      'இந்த மாதம் தவிர்க்க 0 உள்ளிடவும்; தவணையைப் பயன்படுத்த காலியாக்கவும்.';

  @override
  String get payrollRegister => 'சம்பளப் பதிவேடு';

  @override
  String get payrollEmail => 'சம்பளச் சீட்டுகளை மின்னஞ்சல் செய்';

  @override
  String payrollEmailed(String sent) {
    return '$sent மின்னஞ்சல் செய்யப்பட்டது.';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'மின்னஞ்சல் முகவரி இல்லை: $codes';
  }

  @override
  String get statutoryTitle => 'சட்டப்பூர்வ நிலுவைகள் & TDS';

  @override
  String get statutorySubtitle =>
      'இறுதிச் சம்பளத்திலிருந்து PF, ESI, தொழில் வரி, LWF, TDS, எவ்வளவு செலுத்தப்பட்டது, காலாண்டு TDS ரிட்டர்ன், படிவம் 16.';

  @override
  String get statutoryFy => 'நிதியாண்டு';

  @override
  String get statutoryDues => 'நிலுவைகளும் செலுத்துகைகளும்';

  @override
  String get statutoryKind => 'வகை';

  @override
  String get statutoryKindsPf => 'PF';

  @override
  String get statutoryKindsEsi => 'ESI';

  @override
  String get statutoryKindsPt => 'தொழில் வரி';

  @override
  String get statutoryKindsLwf => 'LWF';

  @override
  String get statutoryKindsTds => 'TDS';

  @override
  String get statutoryPeriod => 'சம்பள மாதம்';

  @override
  String get statutoryDue => 'செலுத்த வேண்டியது';

  @override
  String get statutoryPaid => 'செலுத்தியது';

  @override
  String get statutoryBalance => 'மீதம்';

  @override
  String get statutoryDueDate => 'கடைசித் தேதி';

  @override
  String get statutoryPay => 'செலுத்துகையைப் பதி';

  @override
  String get statutoryPaidOn => 'செலுத்திய தேதி';

  @override
  String get statutoryAccount => 'இதிலிருந்து செலுத்தியது';

  @override
  String get statutoryReference => 'சலான் / TRRN எண்';

  @override
  String get statutoryBsrCode => 'BSR குறியீடு';

  @override
  String get statutoryChallanSerial => 'சலான் வரிசை எண்';

  @override
  String get statutoryRecord => 'செலுத்துகையைச் சேமி';

  @override
  String get statutoryNone => 'இந்த ஆண்டு இன்னும் இறுதிச் சம்பளம் இல்லை.';

  @override
  String get statutoryOverdue => 'தாமதம்';

  @override
  String get statutoryQ24Title => 'காலாண்டு TDS ரிட்டர்ன் (படிவம் 24Q)';

  @override
  String get statutoryQ24Quarter => 'காலாண்டு';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · ஏப்–ஜூன்';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · ஜூலை–செப்';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · அக்–டிச';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · ஜன–மார்';

  @override
  String get statutoryQ24Deductees => 'பிடித்தம் செய்யப்பட்டோர் வரிசைகள்';

  @override
  String get statutoryQ24Challans => 'சலான்கள்';

  @override
  String get statutoryQ24TotalTds => 'TDS';

  @override
  String get statutoryQ24Download => 'பிடித்தம் செய்யப்பட்டோர் வரிசைகள் (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'இணைப்பு II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'இவற்றை NSDL ரிட்டர்ன் தயாரிப்புக் கருவியில் (RPU) இறக்குமதி செய்து, FVU மூலம் கோப்பைச் சரிபார்த்து, TIN-NSDL-இல் பதிவேற்றவும்.';

  @override
  String get statutoryQ24WarningsTanMissing =>
      'சம்பளப் பட்டியல் அமைப்புகளில் TAN சேர்க்கவும்.';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return '$detail-க்குப் பான் இல்லை: பான் இல்லாமல் 20% வரி பிடிக்க வேண்டும்.';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return '$detail-க்குப் பிடித்ததும் செலுத்தியதும் பொருந்தவில்லை.';
  }

  @override
  String get statutoryForm16Title => 'படிவம் 16';

  @override
  String get statutoryForm16Hint =>
      'பகுதி B சம்பளப் பட்டியலிலிருந்து. பகுதி A-ஐ TRACES-இலிருந்து பதிவிறக்கி இணைக்கவும்; இரண்டிலும் முதலாளி கையொப்பம்.';

  @override
  String get statutoryForm16View => 'பகுதி B';

  @override
  String get form16Title => 'படிவம் 16 · பகுதி B';

  @override
  String get form16Subtitle =>
      'சம்பளத்தில் மூலத்தில் பிடித்த வரிக்கான பிரிவு 203 சான்றிதழ்';

  @override
  String get form16Employer => 'முதலாளி';

  @override
  String get form16Employee => 'பணியாளர்';

  @override
  String get form16Tan => 'TAN';

  @override
  String get form16Pan => 'பான்';

  @override
  String get form16Ay => 'மதிப்பீட்டு ஆண்டு';

  @override
  String get form16Period => 'பணிக் காலம்';

  @override
  String get form16Salary => 'செலுத்திய சம்பளம்';

  @override
  String get form16Gross => 'மொத்தச் சம்பளம்';

  @override
  String get form16Previous => 'முந்தைய முதலாளியிடம் பெற்ற சம்பளம்';

  @override
  String get form16Exemptions => 'கழி: பிரிவு 16 கீழ் விலக்குகளும் கழிவுகளும்';

  @override
  String get form16HraExempt => 'வீட்டு வாடகைப் படி விலக்கு';

  @override
  String get form16StandardDeduction => 'நிலையான கழிவு';

  @override
  String get form16Pt => 'தொழில் வரி';

  @override
  String get form16HouseProperty =>
      'வீட்டுச் சொத்து வருமானம் (வீட்டுக் கடன் வட்டி)';

  @override
  String get form16ChapterVIA => 'அத்தியாயம் VI-A கீழ் கழிவுகள்';

  @override
  String get form16TaxableIncome => 'மொத்த வரிக்குட்பட்ட வருமானம்';

  @override
  String get form16Tax => 'மொத்த வருமானத்தின் மீதான வரி';

  @override
  String get form16Rebate => 'பிரிவு 87A கீழ் தள்ளுபடி';

  @override
  String get form16Surcharge => 'கூடுதல் கட்டணம்';

  @override
  String get form16Cess => 'சுகாதார & கல்வி செஸ்';

  @override
  String get form16Total => 'செலுத்த வேண்டிய வரி';

  @override
  String get form16Regime => 'வரி முறை';

  @override
  String get form16TdsQuarterly => 'பிடித்ததும் செலுத்தியதுமான வரி';

  @override
  String get form16Quarter => 'காலாண்டு';

  @override
  String get form16Challans => 'சலான்கள் (BSR குறியீடு · தேதி · வரிசை எண்)';

  @override
  String get form16TdsDeducted => 'மொத்தம் பிடித்த வரி';

  @override
  String get form16Balance => 'செலுத்த வேண்டிய வரி (திருப்பித் தர வேண்டியது)';

  @override
  String get form16Verification =>
      'கிடைக்கும் கணக்குப் புத்தகங்கள், ஆவணங்கள், பதிவுகளின் அடிப்படையில் மேற்கண்ட தகவல் உண்மையானது, சரியானது எனச் சான்றளிக்கப்படுகிறது.';

  @override
  String get form16Signature => 'வரி பிடிக்கப் பொறுப்பானவரின் கையொப்பம்';

  @override
  String get form16PartA => 'பகுதி A (TRACES-இலிருந்து) இணைக்கப்பட வேண்டும்.';

  @override
  String form16Missing(String months) {
    return '$months-க்கான சம்பளச் சீட்டுகள் இங்கு இல்லை (Varchasv-க்கு முன் செலுத்தியது). கையொப்பமிடும் முன் அந்தச் சம்பளத்தையும் வரியையும் சேர்க்கவும்.';
  }

  @override
  String get mfgBomsTitle => 'பொருள் பட்டியல் (BOM)';

  @override
  String get mfgBomsSubtitle =>
      'நீங்கள் தயாரிக்கும் ஒவ்வொரு பொருளிலும் என்ன செல்கிறது, கழிவு, பணி மைய நேரம், மேல்செலவுகளுடன்.';

  @override
  String get mfgBomsNew => 'புதிய பிஓஎம்';

  @override
  String get mfgBomsItem => 'தயாரிக்கும் பொருள்';

  @override
  String get mfgBomsVersion => 'பதிப்பு';

  @override
  String get mfgBomsOutputQty => 'உற்பத்தி (அளவு)';

  @override
  String get mfgBomsOverhead => 'ஒரு தொகுதிக்கு நிலையான மேல்செலவு (₹)';

  @override
  String get mfgBomsComponent => 'மூலப்பொருள்';

  @override
  String get mfgBomsQty => 'அளவு';

  @override
  String get mfgBomsWastage => 'கழிவு %';

  @override
  String get mfgBomsOperations => 'செயல்முறைகள்';

  @override
  String get mfgBomsOperation => 'செயல்முறை';

  @override
  String get mfgBomsWorkCentre => 'பணி மையம்';

  @override
  String get mfgBomsMinutes => 'நிமிடங்கள்';

  @override
  String get mfgBomsAddLine => 'மூலப்பொருள் சேர்';

  @override
  String get mfgBomsAddOperation => 'செயல்முறை சேர்';

  @override
  String get mfgBomsSave => 'பிஓஎம்-ஐச் சேமி';

  @override
  String get mfgBomsMakeDefault => 'முதன்மையாகப் பயன்படுத்து';

  @override
  String get mfgBomsDefault => 'முதன்மை';

  @override
  String get mfgBomsArchive => 'காப்பகப்படுத்து';

  @override
  String get mfgBomsArchived => 'காப்பகம்';

  @override
  String get mfgBomsUnitCost => 'ஒரு அலகுச் செலவு';

  @override
  String get mfgBomsOverheadPerUnit => 'ஒரு அலகு மேல்செலவு';

  @override
  String get mfgBomsRate => 'விலை';

  @override
  String get mfgBomsCost => 'செலவு';

  @override
  String get mfgBomsNone => 'இன்னும் பிஓஎம் இல்லை.';

  @override
  String get mfgBomsNotes => 'குறிப்புகள்';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count மூலப்பொருட்கள்',
      one: '$count மூலப்பொருள்',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'பணி மையங்கள்';

  @override
  String get mfgWorkCentresName => 'பணி மையம்';

  @override
  String get mfgWorkCentresCostPerHour => 'மணிநேரச் செலவு (₹)';

  @override
  String get mfgWorkCentresAdd => 'பணி மையம் சேர்';

  @override
  String get mfgWorkCentresSave => 'சேமி';

  @override
  String get mfgOrdersTitle => 'உற்பத்தி ஆர்டர்கள்';

  @override
  String get mfgOrdersSubtitle =>
      'உற்பத்தியைத் திட்டமிடு, தொடங்கு, முடி. மூலப்பொருட்கள் சரக்கிலிருந்து செல்லும், உற்பத்தி செலவு விலையில் வரும்.';

  @override
  String get mfgOrdersNew => 'புதிய உற்பத்தி ஆர்டர்';

  @override
  String get mfgOrdersItem => 'பொருள்';

  @override
  String get mfgOrdersQty => 'அளவு';

  @override
  String get mfgOrdersDate => 'தேதி';

  @override
  String get mfgOrdersStatus => 'நிலை';

  @override
  String get mfgOrdersStatusesPlanned => 'திட்டமிட்டது';

  @override
  String get mfgOrdersStatusesReleased => 'தொடங்கியது';

  @override
  String get mfgOrdersStatusesCompleted => 'முடிந்தது';

  @override
  String get mfgOrdersStatusesCancelled => 'ரத்து';

  @override
  String get mfgOrdersProduced => 'உற்பத்தியானது';

  @override
  String get mfgOrdersRejected => 'நிராகரிக்கப்பட்டது';

  @override
  String get mfgOrdersRelease => 'தொடங்கு';

  @override
  String get mfgOrdersIssue => 'கூடுதல் மூலப்பொருள் வழங்கு';

  @override
  String get mfgOrdersComplete => 'உற்பத்தியைப் பதி';

  @override
  String get mfgOrdersGoodQty => 'நல்ல அளவு';

  @override
  String get mfgOrdersRejectedQty => 'நிராகரிப்பு';

  @override
  String get mfgOrdersClose => 'இதன் பின் ஆர்டரை மூடு';

  @override
  String get mfgOrdersRemaining => 'இன்னும் தயாரிக்க வேண்டியது';

  @override
  String get mfgOrdersMaterials => 'மீதிக்கான மூலப்பொருட்கள்';

  @override
  String get mfgOrdersEntries => 'வரலாறு';

  @override
  String get mfgOrdersUnitCost => 'அலகுச் செலவு';

  @override
  String get mfgOrdersMaterialCost => 'மூலப்பொருள் செலவு';

  @override
  String get mfgOrdersOverheadCost => 'மேல்செலவுகள்';

  @override
  String get mfgOrdersKindsIssue => 'கூடுதல் வழங்கல்';

  @override
  String get mfgOrdersKindsComplete => 'உற்பத்தி';

  @override
  String get mfgOrdersReleaseNow => 'உடனே தொடங்கு';

  @override
  String get mfgOrdersNone => 'இன்னும் உற்பத்தி ஆர்டர்கள் இல்லை.';

  @override
  String get mfgOrdersSave => 'ஆர்டர் உருவாக்கு';

  @override
  String get mfgOrdersCancel => 'ஆர்டரை ரத்துசெய்';

  @override
  String get mfgMrpTitle => 'பொருள் திட்டமிடல் (MRP)';

  @override
  String get mfgMrpSubtitle =>
      'திறந்த விற்பனை ஆர்டர்களையும் மறு ஆர்டர் நிலைகளையும் நிறைவேற்ற என்ன தயாரிக்க, என்ன வாங்க வேண்டும், சரக்கும் ஏற்கனவே ஆர்டர் செய்ததும் கழித்து.';

  @override
  String get mfgMrpAsOf => 'இந்தத் தேதிப்படி திட்டம்';

  @override
  String get mfgMrpAction => 'செயல்';

  @override
  String get mfgMrpActionsMake => 'தயாரி';

  @override
  String get mfgMrpActionsBuy => 'வாங்கு';

  @override
  String get mfgMrpQty => 'அளவு';

  @override
  String get mfgMrpNeedBy => 'தேவைப்படும் தேதி';

  @override
  String get mfgMrpReleaseBy => 'தொடங்க / ஆர்டர் செய்ய கடைசி';

  @override
  String get mfgMrpOnHand => 'கையிருப்பு';

  @override
  String get mfgMrpOnOrder => 'ஆர்டரில்';

  @override
  String get mfgMrpSupplier => 'சப்ளையர்';

  @override
  String get mfgMrpConvert => 'தேர்ந்தெடுத்தவற்றுக்கு ஆர்டர் உருவாக்கு';

  @override
  String mfgMrpCreated(String orders) {
    return '$orders உருவாக்கப்பட்டன.';
  }

  @override
  String get mfgMrpNone =>
      'திட்டமிட எதுவுமில்லை: சரக்கும் ஆர்டர்களும் தேவையை நிறைவேற்றுகின்றன.';

  @override
  String get mfgJobWorkTitle => 'ஜாப் வொர்க்';

  @override
  String get mfgJobWorkSubtitle =>
      'சலானில் ஜாப் வொர்க்கருக்கு அனுப்பி, செயலாக்கப்பட்டுத் திரும்பிய சரக்கு. உள்ளீடுகள் ஓராண்டுக்குள் திரும்ப வேண்டும் (மூலதனப் பொருட்கள் மூன்றாண்டுக்குள்).';

  @override
  String get mfgJobWorkSend => 'ஜாப் வொர்க்குக்கு அனுப்பு';

  @override
  String get mfgJobWorkReceive => 'திரும்பப் பெறு';

  @override
  String get mfgJobWorkJobWorker => 'ஜாப் வொர்க்கர்';

  @override
  String get mfgJobWorkProcess => 'செயல்முறை';

  @override
  String get mfgJobWorkSent => 'அனுப்பியது';

  @override
  String get mfgJobWorkPending => 'இன்னும் ஜாப் வொர்க்கரிடம்';

  @override
  String get mfgJobWorkReturnBy => 'திரும்ப வேண்டிய தேதி';

  @override
  String get mfgJobWorkOverdue => 'தாமதம்';

  @override
  String get mfgJobWorkReceived => 'பெற்ற பொருள்';

  @override
  String get mfgJobWorkConsumed => 'பயன்பட்ட உள்ளீடுகள்';

  @override
  String get mfgJobWorkCharges => 'ஜாப் கட்டணம் (₹)';

  @override
  String get mfgJobWorkFrom => 'சலானிலிருந்து';

  @override
  String get mfgJobWorkItc04 => 'ITC-04 (அரையாண்டு)';

  @override
  String get mfgJobWorkHalf => 'அரையாண்டு';

  @override
  String get mfgJobWorkHalvesH1 => 'ஏப்ரல்–செப்டம்பர்';

  @override
  String get mfgJobWorkHalvesH2 => 'அக்டோபர்–மார்ச்';

  @override
  String get mfgJobWorkSentTable => 'அனுப்பிய சரக்கு';

  @override
  String get mfgJobWorkReceivedTable => 'திரும்பிய சரக்கு';

  @override
  String get mfgJobWorkPendingTable => 'ஜாப் வொர்க்கர்களிடம் நிலுவையில்';

  @override
  String get mfgJobWorkNone => 'இன்னும் ஜாப் வொர்க் இல்லை.';

  @override
  String get mfgJobWorkCapitalGoods => 'மூலதனப் பொருட்கள்';

  @override
  String get mfgErrorsBomCycle =>
      'இது சுழற்சியை உருவாக்குகிறது: பொருளுக்கு அதுவே தேவைப்படும்.';

  @override
  String get mfgErrorsBomEmpty => 'குறைந்தது ஒரு மூலப்பொருளைச் சேர்க்கவும்.';

  @override
  String get mfgErrorsInvalidOutputQty =>
      'ஒரு தொகுதியில் எவ்வளவு தயாராகும் என்பதை உள்ளிடவும்.';

  @override
  String get mfgErrorsDuplicateComponent => 'ஒரு மூலப்பொருள் இருமுறை வருகிறது.';

  @override
  String get mfgErrorsUnknownWorkCentre => 'பணி மையத்தைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get mfgErrorsNoBom => 'இந்தப் பொருளுக்குச் செயலிலுள்ள பிஓஎம் இல்லை.';

  @override
  String get mfgErrorsBomArchived => 'அந்தப் பிஓஎம் காப்பகத்தில் உள்ளது.';

  @override
  String get mfgErrorsOrderNotPlanned =>
      'திட்டமிட்ட ஆர்டரை மட்டுமே தொடங்க முடியும்.';

  @override
  String get mfgErrorsOrderNotReleased => 'முதலில் ஆர்டரைத் தொடங்கவும்.';

  @override
  String get mfgErrorsSupplierRequired =>
      'வாங்க வேண்டிய பொருட்களுக்கு சப்ளையரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'ஜாப் வொர்க்கராக சப்ளையர் அல்லது வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get mfgErrorsUnknownChallan => 'அனுப்பிய சலானைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get mfgErrorsChallanCancelled => 'அந்தச் சலான் ரத்துசெய்யப்பட்டது.';

  @override
  String get mfgErrorsItemNotSent =>
      'இந்தப் பொருள் இந்தச் சலானில் அனுப்பப்படவில்லை.';

  @override
  String get mfgErrorsMoreThanSent =>
      'இது ஜாப் வொர்க்கரிடம் மீதமுள்ளதை விட அதிகம்.';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'இந்தச் சலானில் சரக்கு திரும்பியுள்ளது; முதலில் அவற்றை ரத்துசெய்யவும்.';

  @override
  String get posBillingTitle => 'பில்லிங்';

  @override
  String get posBillingTerminal => 'கவுண்டர்';

  @override
  String get posBillingChooseTerminal => 'கவுண்டரைத் தேர்ந்தெடு';

  @override
  String get posBillingOpenShift => 'பணிநேரத்தைத் தொடங்கு';

  @override
  String get posBillingOpeningCash => 'தொடக்க ரொக்கம் (₹)';

  @override
  String get posBillingCloseShift => 'பணிநேரத்தை முடி';

  @override
  String get posBillingCountedCash => 'எண்ணிய ரொக்கம் (₹)';

  @override
  String get posBillingExpected => 'எதிர்பார்ப்பு';

  @override
  String get posBillingDifference => 'வேறுபாடு';

  @override
  String get posBillingSearch => 'பார்கோடை ஸ்கேன் செய் அல்லது பொருளைத் தேடு';

  @override
  String get posBillingCart => 'பில்';

  @override
  String get posBillingEmpty => 'பில்லைத் தொடங்க பொருட்களைச் சேர்க்கவும்.';

  @override
  String get posBillingQty => 'அளவு';

  @override
  String get posBillingPrice => 'விலை';

  @override
  String get posBillingAmount => 'தொகை';

  @override
  String get posBillingDiscount => 'பில் தள்ளுபடி (₹)';

  @override
  String get posBillingCustomer => 'வாடிக்கையாளர் மொபைல் (புள்ளிகளுக்கு)';

  @override
  String get posBillingCustomerName => 'பெயர்';

  @override
  String posBillingPoints(String points) {
    return '$points புள்ளிகள்';
  }

  @override
  String get posBillingRedeem => 'புள்ளிகளைப் பயன்படுத்து';

  @override
  String posBillingRedeemable(String points, String value) {
    return '$points புள்ளிகள் வரை (₹$value)';
  }

  @override
  String get posBillingPayments => 'செலுத்துகை';

  @override
  String get posBillingModesCash => 'ரொக்கம்';

  @override
  String get posBillingModesUpi => 'UPI';

  @override
  String get posBillingModesCard => 'அட்டை';

  @override
  String get posBillingModesCredit => 'கணக்கில்';

  @override
  String get posBillingReference => 'குறிப்பு';

  @override
  String get posBillingAddPayment => 'பிரித்துச் செலுத்து';

  @override
  String get posBillingPay => 'பில்லை முடி';

  @override
  String get posBillingTotal => 'மொத்தம்';

  @override
  String get posBillingChange => 'திருப்பித் தர வேண்டியது';

  @override
  String get posBillingDue => 'இன்னும் நிலுவை';

  @override
  String get posBillingTaxable => 'வரிக்குட்பட்டது';

  @override
  String get posBillingTax => 'ஜிஎஸ்டி';

  @override
  String get posBillingRoundOff => 'முழுமையாக்கல்';

  @override
  String posBillingDone(String number) {
    return 'பில் $number சேமிக்கப்பட்டது';
  }

  @override
  String get posBillingPrint => 'ரசீதை அச்சிடு';

  @override
  String get posBillingNewBill => 'புதிய பில்';

  @override
  String get posBillingShiftTotals => 'இந்தப் பணிநேரம்';

  @override
  String get posBillingBills => 'பில்கள்';

  @override
  String get posBillingDeviceTerminal =>
      'இந்தக் கவுண்டர் தன் சாதனத்திலிருந்து பில் செய்கிறது (ஆஃப்லைன் செயலி).';

  @override
  String get posBillsTitle => 'பிஓஎஸ் பில்கள்';

  @override
  String get posBillsSubtitle => 'ஒரு நாளின் அனைத்துக் கவுண்டர்களின் பில்கள்.';

  @override
  String get posBillsDate => 'தேதி';

  @override
  String get posBillsNumber => 'பில் எண்';

  @override
  String get posBillsTime => 'நேரம்';

  @override
  String get posBillsMode => 'செலுத்தும் முறை';

  @override
  String get posBillsVoid => 'செல்லாததாக்கு';

  @override
  String get posBillsVoided => 'செல்லாதது';

  @override
  String get posBillsReason => 'காரணம்';

  @override
  String get posBillsSummary => 'நாள் சுருக்கம்';

  @override
  String get posBillsTopItems => 'அதிகம் விற்றவை';

  @override
  String get posBillsMismatch => 'சாதனத்தின் மொத்தம் வேறுபட்டது';

  @override
  String get posBillsNone => 'இந்த நாளில் பில்கள் இல்லை.';

  @override
  String get posSettingsTitle => 'கவுண்டர் அமைப்புகள்';

  @override
  String get posSettingsSubtitle =>
      'விலை, லாயல்டி புள்ளிகள், தள்ளுபடி வரம்பு, கவுண்டர்கள்.';

  @override
  String get posSettingsPricesIncludeTax => 'விலைகளில் ஜிஎஸ்டி அடங்கும்';

  @override
  String get posSettingsLoyalty => 'விசுவாசப் புள்ளிகள்';

  @override
  String get posSettingsLoyaltyEnabled => 'விசுவாசப் புள்ளிகள் வழங்கு';

  @override
  String get posSettingsPointsPer100 => '₹100-க்கு புள்ளிகள்';

  @override
  String get posSettingsPointValue => 'ஒரு புள்ளியின் மதிப்பு (₹)';

  @override
  String get posSettingsMaxRedeem =>
      'புள்ளிகளால் செலுத்தக்கூடிய பில்லின் அதிகபட்சப் பகுதி (%)';

  @override
  String get posSettingsFooter => 'ரசீது அடிக்குறிப்பு';

  @override
  String get posSettingsTerminals => 'கவுண்டர்கள்';

  @override
  String get posSettingsTerminalName => 'கவுண்டர் பெயர்';

  @override
  String get posSettingsWarehouse => 'இதிலிருந்து விற்பனை';

  @override
  String get posSettingsDevice => 'ஆஃப்லைன் சாதனம்';

  @override
  String get posSettingsNoDevice => 'எதுவுமில்லை (வலை பில்லிங்)';

  @override
  String get posSettingsAddTerminal => 'கவுண்டர் சேர்';

  @override
  String get posSettingsSave => 'சேமி';

  @override
  String get posReceiptTaxInvoice => 'வரி விலைப்பட்டியல்';

  @override
  String get posReceiptBillOfSupply => 'ரொக்க மெமோ';

  @override
  String get posReceiptThanks => 'நன்றி! மீண்டும் வருக.';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'பெற்ற புள்ளிகள்: $points · மீதம் $balance';
  }

  @override
  String get posErrorsSessionNotOpen =>
      'முதலில் இந்தக் கவுண்டரில் பணிநேரத்தைத் தொடங்கவும்.';

  @override
  String get posErrorsSessionAlreadyOpen =>
      'இந்தக் கவுண்டரில் ஏற்கனவே பணிநேரம் நடைபெறுகிறது.';

  @override
  String get posErrorsSessionClosed => 'அந்தப் பணிநேரம் முடிந்தது.';

  @override
  String get posErrorsDeviceTerminal =>
      'இந்தக் கவுண்டர் தன் சாதனத்திலிருந்து பில் செய்கிறது.';

  @override
  String get posErrorsTerminalOnOtherDevice =>
      'இந்தக் கவுண்டர் வேறு சாதனத்துக்குரியது.';

  @override
  String get posErrorsTooManyPoints =>
      'இந்தப் பில்லில் பயன்படுத்தக்கூடியதை விட அதிகப் புள்ளிகள்.';

  @override
  String get posErrorsLoyaltyNotAvailable =>
      'முதலில் வாடிக்கையாளரின் மொபைல் எண்ணை உள்ளிடவும்.';

  @override
  String get posErrorsOverpaidNonCash =>
      'UPI மற்றும் அட்டை நிலுவைத் தொகையை விட அதிகமாக இருக்க முடியாது.';

  @override
  String get posErrorsUnderpaid => 'பில் முழுமையாகச் செலுத்தப்படவில்லை.';

  @override
  String get posErrorsInvalidPayment => 'செலுத்தும் தொகையை உள்ளிடவும்.';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'கணக்கில் விற்பனைக்கு வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get posErrorsDiscountExceedsAmount => 'தள்ளுபடி பில்லை விட அதிகம்.';

  @override
  String get posErrorsVoidSameDayOnly =>
      'இன்றைய பில்களை மட்டுமே செல்லாததாக்க முடியும்.';

  @override
  String get posErrorsOrderNotOpen => 'அந்த ஆர்டர் மூடப்பட்டது.';

  @override
  String get posErrorsBillNumberTaken =>
      'அந்தப் பில் எண் ஏற்கனவே பயன்படுத்தப்பட்டது.';

  @override
  String get posErrorsInvalidPhone => '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.';

  @override
  String get posErrorsNoLines => 'குறைந்தது ஒரு பொருளைச் சேர்க்கவும்.';

  @override
  String get posDeviceNoTerminal =>
      'இந்தச் சாதனத்துக்குப் பில்லிங் கவுண்டர் இல்லை. வலையில் பிஓஎஸ் அமைப்புகளைத் திறந்து இந்தச் சாதனத்துடன் ஒரு கவுண்டரை இணைத்து, பின் ஒத்திசைக்கவும்.';

  @override
  String get posDeviceTodayBills => 'இந்தச் சாதனத்தின் இன்றைய பில்கள்';

  @override
  String get posDeviceWaiting => 'பதிவேற்றக் காத்திருக்கிறது';

  @override
  String get posDeviceUploaded => 'பதிவேற்றப்பட்டது';

  @override
  String posDeviceFailed(String error) {
    return 'ஏற்கப்படவில்லை: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'சேவையக மொத்தம் $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'பில்கள் இந்தச் சாதனத்திலேயே எண்ணிடப்பட்டு, ஆன்லைனில் வந்ததும் பதிவேற்றப்படும்.';

  @override
  String get posDeviceNoFiscalYear =>
      'இன்றைய தேதி எந்த நிதியாண்டிலும் இல்லை. முதலில் கிளவுடுடன் ஒத்திசைக்கவும்.';

  @override
  String get posPromoReferredBy => 'பரிந்துரைத்தவர் (மொபைல்)';

  @override
  String posPromoReferredHint(String points) {
    return 'அவருக்கு $points புள்ளிகள்';
  }

  @override
  String get posPromoCoupon => 'கூப்பன் குறியீடு';

  @override
  String posPromoCouponOk(String off) {
    return '$off தள்ளுபடி';
  }

  @override
  String get posPromoCard => 'தள்ளுபடி அட்டை';

  @override
  String get posPromoCardOff => 'தள்ளுபடி அட்டை';

  @override
  String posPromoCouponOff(String code) {
    return 'கூப்பன் $code';
  }

  @override
  String posPromoVoucher(String code) {
    return 'பரிசு வவுச்சர் $code';
  }

  @override
  String get posPromoToPay => 'செலுத்த வேண்டியது';

  @override
  String get posPromoVoucherCode => 'பரிசு வவுச்சர் குறியீடு';

  @override
  String get posPromoUseVoucher => 'வவுச்சரைப் பயன்படுத்து';

  @override
  String get posPromoReferralPoints => 'பரிந்துரைப் புள்ளிகள்';

  @override
  String get posPromoReferralPointsHint =>
      'பரிந்துரைத்தவர் சேர்ந்து வாங்கினால் உறுப்பினருக்கு (0 = நிறுத்தம்)';

  @override
  String get posPromoErrorsCouponNotFound =>
      'அப்படி ஒரு கூப்பன் இல்லை, அல்லது நிறுத்தப்பட்டது.';

  @override
  String get posPromoErrorsCouponNotValidToday =>
      'இந்தக் கூப்பன் இன்று செல்லாது.';

  @override
  String get posPromoErrorsCouponUsedUp =>
      'இந்தக் கூப்பன் முழுவதும் பயன்படுத்தப்பட்டது.';

  @override
  String get posPromoErrorsCouponMinBill =>
      'பில் இந்தக் கூப்பனின் குறைந்தபட்சத்தை விடக் குறைவு.';

  @override
  String get posPromoErrorsCardNotFound =>
      'அப்படி ஒரு தள்ளுபடி அட்டை இல்லை, அல்லது நிறுத்தப்பட்டது.';

  @override
  String get posPromoErrorsCardExpired => 'இந்தத் தள்ளுபடி அட்டை காலாவதியானது.';

  @override
  String get posPromoErrorsVoucherNotFound =>
      'அந்தக் குறியீட்டில் பரிசு வவுச்சர் இல்லை.';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'இந்தப் பரிசு வவுச்சர் பயன்படுத்தப்பட்டது அல்லது காலாவதியானது.';

  @override
  String get posPromoErrorsVoucherBalanceLow => 'வவுச்சரில் அவ்வளவு மீதமில்லை.';

  @override
  String get posPromoErrorsVoucherMoreThanBill =>
      'வவுச்சர்கள் பில்லை விட அதிகம்.';

  @override
  String get posPromoErrorsVoucherTwice =>
      'அதே வவுச்சர் இருமுறை உள்ளிடப்பட்டது.';

  @override
  String get posPromoErrorsOnlineOnly =>
      'கூப்பன், அட்டை, பரிசு வவுச்சருக்கு ஆன்லைன் கவுண்டர் வேண்டும்.';

  @override
  String get posCounterControls => 'கவுண்டர் கட்டுப்பாடுகள்';

  @override
  String get posCounterAllowRateChange => 'காசாளர் விலையை மாற்றலாம்';

  @override
  String get posCounterRequireSalesman => 'ஒவ்வொரு வரிக்கும் விற்பனையாளர் தேவை';

  @override
  String get posCounterMaxLineDiscount => 'அதிகபட்ச வரி தள்ளுபடி, %';

  @override
  String get posCounterMaxBillDiscount => 'அதிகபட்ச பில் தள்ளுபடி, %';

  @override
  String get posCounterLimitHint =>
      'காலி: வரம்பு இல்லை. அதிகமெனில் ஒப்புதலாளர் காரணம் தேவை.';

  @override
  String get posCounterSalesman => 'விற்பனையாளர்';

  @override
  String get posCounterNoSalesman => 'விற்பனையாளர் இல்லை';

  @override
  String get posCounterBillSalesman => 'பில்லின் விற்பனையாளர்';

  @override
  String get posCounterRate => 'விலை';

  @override
  String get posCounterRateLocked => 'விலை பூட்டப்பட்டது';

  @override
  String get posCounterDisc => 'தள்ளு ₹';

  @override
  String get posCounterLineDiscount => 'வரி தள்ளுபடி ரூபாயில்';

  @override
  String posCounterVisits(String n) {
    return 'வருகைகள்: $n';
  }

  @override
  String posCounterSpent(String v) {
    return 'செலவு $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'திருப்பியது $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'கடைசியாக $date';
  }

  @override
  String get posCounterBuys => 'வழக்கமாக வாங்குவது';

  @override
  String get posCounterNewCustomer =>
      'புதிய வாடிக்கையாளர்: இந்தப் பில்லில் சேருவார்.';

  @override
  String get posCounterApprovalReason => 'ஒப்புதல் காரணம்';

  @override
  String get posCounterBrokenRate => 'விலை மாற்றம்';

  @override
  String get posCounterBrokenLineDiscount => 'வரி தள்ளுபடி வரம்பை மீறியது';

  @override
  String get posCounterBrokenBillDiscount => 'பில் தள்ளுபடி வரம்பை மீறியது';

  @override
  String get posCounterNeedsApprover => 'மேலாளர் ஒப்புதல் தேவை';

  @override
  String get posCounterHold => 'பில்லை நிறுத்து';

  @override
  String posCounterHeldBills(String n) {
    return 'நிறுத்திய பில்கள் ($n)';
  }

  @override
  String get posCounterHoldLabel => 'யாருக்கு? (விருப்பம்)';

  @override
  String get posCounterHoldNow => 'நிறுத்து';

  @override
  String get posCounterUnnamed => 'வாடிக்கையாளர்';

  @override
  String posCounterPieces(String n) {
    return 'துண்டுகள்: $n';
  }

  @override
  String get posCounterResume => 'இதற்குப் பில்';

  @override
  String get posCounterNoneHeld => 'நிறுத்திய பில் இல்லை.';

  @override
  String get posCounterHoldFirst =>
      'இன்னொன்றை எடுக்கும் முன் இப்போதைய பில்லை நிறுத்தவும் அல்லது முடிக்கவும்.';

  @override
  String get posCounterSizeStock => 'இங்கே அளவு வாரி இருப்பு';

  @override
  String get posCounterAddSize => 'இந்த நிறம், அளவைச் சேர்';

  @override
  String get posCounterKeysSearch => 'ஸ்கேன் அல்லது தேடல்';

  @override
  String get posCounterKeysHold => 'பில் நிறுத்து';

  @override
  String get posCounterKeysHeld => 'நிறுத்திய பில்கள்';

  @override
  String get posCounterKeysCustomer => 'வாடிக்கையாளர்';

  @override
  String get posCounterKeysDiscount => 'தள்ளுபடி';

  @override
  String get posCounterKeysCash => 'முழு ரொக்கம்';

  @override
  String get posCounterKeysUpi => 'முழு UPI';

  @override
  String get posCounterKeysCard => 'முழு அட்டை';

  @override
  String get posCounterKeysPay => 'பில் முடி';

  @override
  String get posCounterKeysExchange => 'திருப்பம் அல்லது மாற்றம்';

  @override
  String get posCounterErrorsRateLocked =>
      'விலை பூட்டப்பட்டது. மேலாளர் காரணத்துடன் அனுமதிக்கலாம்.';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'வரி தள்ளுபடி வரம்பை மீறியது. மேலாளர் காரணத்துடன் அனுமதிக்கலாம்.';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'பில் தள்ளுபடி வரம்பை மீறியது. மேலாளர் காரணத்துடன் அனுமதிக்கலாம்.';

  @override
  String get posCounterErrorsSalesmanRequired =>
      'ஒவ்வொரு வரிக்கும் விற்பனையாளரைத் தேர்ந்தெடுங்கள்.';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'அந்த விற்பனையாளர் பணியாளர் பட்டியலில் இல்லை.';

  @override
  String get posCounterErrorsHeldBillGone =>
      'அந்த நிறுத்திய பில் ஏற்கனவே எடுக்கப்பட்டது.';

  @override
  String get posCounterAutoSendBill =>
      'வாடிக்கையாளர் மொபைல் தந்தால் பில்லை தானாக வாட்ஸ்அப்பில் அனுப்பு';

  @override
  String get posCounterBrowse => 'பொருட்களைப் பார்';

  @override
  String get posCounterItem => 'பொருள்';

  @override
  String posCounterPiecesInBill(String n) {
    return 'பில்லில் $n துண்டுகள்';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'விலையில் மொத்தம் $v';
  }

  @override
  String get posCounterOffers => 'தள்ளுபடி, சலுகைகள்';

  @override
  String get posCounterBreakdown => 'பில் விவரம்';

  @override
  String get posCounterInclGst => 'GST உட்பட';

  @override
  String get posCounterBillItems => 'பில் பொருட்கள்';

  @override
  String get posCounterScanToStart =>
      'பில்லைத் தொடங்க பார்கோடை ஸ்கேன் செய்யுங்கள் அல்லது தேடுங்கள். நிறுத்திய பில்லை எடுக்க F4.';

  @override
  String get bankingAccountsTitle => 'வங்கிகள்';

  @override
  String get bankingAccountsSubtitle =>
      'உங்கள் வங்கி அறிக்கைகளைக் கணக்குகளுடன் ஒப்பிடவும்.';

  @override
  String get bankingAccountsBookBalance => 'கணக்குப்படி';

  @override
  String get bankingAccountsStatementBalance => 'வங்கிப்படி';

  @override
  String bankingAccountsAsOf(String date) {
    return '$date அன்று';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'ஒப்பிட வேண்டிய $count வரிகள்',
      one: 'ஒப்பிட வேண்டிய $count வரி',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'அனைத்தும் பொருந்தின';

  @override
  String get bankingAccountsNone =>
      'இன்னும் வங்கிக் கணக்குகள் இல்லை. கணக்குப் பட்டியலில் Bank Accounts கீழ் பேரேட்டைச் சேர்க்கவும்.';

  @override
  String get bankingAccountsReconcile => 'ஒப்பிடு';

  @override
  String get bankingAccountsNoStatement => 'இன்னும் அறிக்கை இல்லை';

  @override
  String get bankingProfileTitle => 'வங்கி விவரங்கள்';

  @override
  String get bankingProfileBankName => 'வங்கி';

  @override
  String get bankingProfileLast4 => 'கணக்கு (கடைசி 4 இலக்கங்கள்)';

  @override
  String get bankingProfileIfsc => 'IFSC';

  @override
  String get bankingProfileSave => 'சேமி';

  @override
  String get bankingImportTitle => 'அறிக்கையை இறக்குமதி செய்';

  @override
  String get bankingImportHint =>
      'நெட் பேங்கிங்கிலிருந்து அறிக்கையை CSV-ஆகப் பதிவிறக்கவும் (Excel-இலிருந்து: Save As → CSV). நெடுவரிசைகள் தலைப்புகளால் அறியப்படுவதால் பெரும்பாலான இந்திய வங்கிகள் இயங்கும்.';

  @override
  String get bankingImportFile => 'அறிக்கைக் கோப்பு (CSV)';

  @override
  String get bankingImportButton => 'இறக்குமதி செய்';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$added வரிகள் சேர்ந்தன, $duplicates ஏற்கனவே இருந்தன, $matched தானாகப் பொருந்தின.';
  }

  @override
  String get bankingFeedTitle => 'வங்கி ஊட்டம்';

  @override
  String get bankingFeedHint =>
      'நீங்கள் ஒப்புதல் அளித்ததும் பரிவர்த்தனைகள் RBI கணக்கு ஒருங்கிணைப்பாளர் அமைப்பின் மூலம் வரும். வழங்குநர் பதிவாகும் வரை சிமுலேட்டர் இயங்கும்.';

  @override
  String get bankingFeedConnect => 'இணை';

  @override
  String get bankingFeedFetch => 'இப்போது பெறு';

  @override
  String get bankingFeedDisconnect => 'துண்டி';

  @override
  String get bankingFeedStatusesActive => 'இணைக்கப்பட்டது';

  @override
  String get bankingFeedStatusesPending => 'ஒப்புதலுக்குக் காத்திருக்கிறது';

  @override
  String get bankingFeedStatusesRevoked => 'துண்டிக்கப்பட்டது';

  @override
  String bankingFeedFetched(String date) {
    return '$date வரை பெறப்பட்டது';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$added புதிய பரிவர்த்தனைகள், $matched பொருந்தின.';
  }

  @override
  String get bankingTabsOpen => 'ஒப்பிட வேண்டியவை';

  @override
  String get bankingTabsMatched => 'பொருந்தியவை';

  @override
  String get bankingTabsIgnored => 'புறக்கணித்தவை';

  @override
  String get bankingTabsBrs => 'ஒப்பீட்டு அறிக்கை';

  @override
  String get bankingLinesDate => 'தேதி';

  @override
  String get bankingLinesDescription => 'விவரம்';

  @override
  String get bankingLinesWithdrawal => 'எடுப்பு';

  @override
  String get bankingLinesDeposit => 'வைப்பு';

  @override
  String get bankingLinesBalance => 'இருப்பு';

  @override
  String get bankingLinesSuggestion => 'இது போலத் தெரிகிறது';

  @override
  String get bankingLinesAccept => 'பொருத்து';

  @override
  String get bankingLinesCreate => 'பதிவிடு';

  @override
  String get bankingLinesIgnore => 'புறக்கணி';

  @override
  String get bankingLinesByHand => 'பதிவைத் தேடு';

  @override
  String get bankingLinesUnmatch => 'பொருத்தத்தை நீக்கு';

  @override
  String get bankingLinesRestore => 'மீட்டெடு';

  @override
  String get bankingLinesAccount => 'இந்தப் பேரேட்டில் பதி';

  @override
  String get bankingLinesNarration => 'விவரம்';

  @override
  String bankingLinesRule(String account) {
    return 'விதி: $account';
  }

  @override
  String get bankingLinesApplyRules => 'விதிப்படி அனைத்தையும் பதி';

  @override
  String bankingLinesRulesDone(String count) {
    return '$count பதிவுகள் பதியப்பட்டன.';
  }

  @override
  String get bankingLinesNone => 'இங்கே எதுவுமில்லை.';

  @override
  String bankingLinesEntries(String from, String to) {
    return '$from முதல் $to வரை பொருந்தாத பதிவுகள்';
  }

  @override
  String get bankingLinesMatchSelected => 'தேர்ந்தெடுத்தவற்றைப் பொருத்து';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return '$amount-இல் $total தேர்ந்தெடுக்கப்பட்டது';
  }

  @override
  String get bankingLinesReasonsAmount => 'ஒரே தொகை';

  @override
  String get bankingLinesReasonsSameDay => 'ஒரே நாள்';

  @override
  String get bankingLinesReasonsReference => 'ஒரே குறிப்பு';

  @override
  String get bankingLinesReasonsParty => 'தரப்புப் பெயர்';

  @override
  String get bankingBrsAsOf => 'இந்தத் தேதியில்';

  @override
  String get bankingBrsPerBooks => 'கணக்குப்படி இருப்பு';

  @override
  String get bankingBrsNotPresented =>
      'கூட்டு: வழங்கியும் இன்னும் சமர்ப்பிக்கப்படாத காசோலைகள்';

  @override
  String get bankingBrsNotCredited =>
      'கழி: வங்கி இன்னும் வரவு வைக்காத வைப்புகள்';

  @override
  String get bankingBrsBankDebits => 'கழி: கணக்கில் இல்லாத வங்கிப் பற்றுகள்';

  @override
  String get bankingBrsBankCredits => 'கூட்டு: கணக்கில் இல்லாத வங்கி வரவுகள்';

  @override
  String get bankingBrsPerBank => 'வங்கிப்படி இருப்பு';

  @override
  String bankingBrsStatement(String date) {
    return '$date அறிக்கை இருப்பு';
  }

  @override
  String get bankingBrsDifference => 'வேறுபாடு';

  @override
  String get bankingBrsBalanced => 'பொருந்தியது';

  @override
  String get bankingRulesTitle => 'வங்கி விதிகள்';

  @override
  String get bankingRulesSubtitle =>
      'இந்தச் சொற்கள் உள்ள அறிக்கை வரிகள் ஒரே கிளிக்கில் பேரேட்டில் பதியப்படும் (வங்கிக் கட்டணம், வட்டி, நிலையான அறிவுறுத்தல்கள்).';

  @override
  String get bankingRulesContains => 'விவரத்தில் உள்ளது';

  @override
  String get bankingRulesDirection => 'பணம்';

  @override
  String get bankingRulesDirectionsIn => 'வந்தது';

  @override
  String get bankingRulesDirectionsOut => 'சென்றது';

  @override
  String get bankingRulesDirectionsAny => 'வந்தது அல்லது சென்றது';

  @override
  String get bankingRulesAccount => 'இதில் பதி';

  @override
  String get bankingRulesNarration => 'விவரம்';

  @override
  String get bankingRulesPriority => 'முன்னுரிமை';

  @override
  String get bankingRulesAdd => 'விதி சேர்';

  @override
  String get bankingRulesSave => 'சேமி';

  @override
  String get bankingSettlementsTitle => 'கேட்வே தீர்வுகள்';

  @override
  String get bankingSettlementsSubtitle =>
      'Razorpay, PhonePe, Paytm போன்றவற்றின் செலுத்துகைகள்: வசூல் கழித்தல் திருப்பங்கள், கட்டணம், கட்டணத்தின் மீது ஜிஎஸ்டி, வங்கியில் ஒரே வரவாக.';

  @override
  String get bankingSettlementsProvider => 'கேட்வே';

  @override
  String get bankingSettlementsBank => 'இதில் செலுத்தப்பட்டது';

  @override
  String get bankingSettlementsClearing => 'வசூல் இங்கு பதியப்பட்டது';

  @override
  String get bankingSettlementsFile => 'தீர்வு அறிக்கை (CSV)';

  @override
  String get bankingSettlementsImport => 'இறக்குமதி செய்';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$posted செலுத்துகைகள் பதியப்பட்டன, $skipped ஏற்கனவே செய்யப்பட்டவை, $matched வங்கியுடன் பொருந்தின.';
  }

  @override
  String get bankingSettlementsSettlementId => 'தீர்வு';

  @override
  String get bankingSettlementsSettledOn => 'தீர்வுத் தேதி';

  @override
  String get bankingSettlementsPayments => 'செலுத்துகைகள்';

  @override
  String get bankingSettlementsGross => 'வசூலானது';

  @override
  String get bankingSettlementsRefunds => 'திருப்பங்கள்';

  @override
  String get bankingSettlementsFees => 'கட்டணம்';

  @override
  String get bankingSettlementsTax => 'கட்டணத்தின் மீது ஜிஎஸ்டி';

  @override
  String get bankingSettlementsNet => 'செலுத்தப்பட்டது';

  @override
  String get bankingSettlementsMatched => 'வங்கியில்';

  @override
  String get bankingSettlementsNone => 'இன்னும் தீர்வுகள் இல்லை.';

  @override
  String get bankingErrorsNoHeader =>
      'தலைப்பு வரிசை கிடைக்கவில்லை. நெடுவரிசைத் தலைப்புகளுடன் அறிக்கையை CSV-ஆகச் சேமிக்கவும்.';

  @override
  String get bankingErrorsNoRows => 'கோப்பில் பரிவர்த்தனைகள் இல்லை.';

  @override
  String get bankingErrorsBadAmount =>
      'கோப்பிலுள்ள ஒரு தொகையைப் படிக்க முடியவில்லை.';

  @override
  String get bankingErrorsUnknownFormat =>
      'இது தீர்வு அறிக்கை போலத் தெரியவில்லை (settlement id, amount, fee நெடுவரிசைகள் தேவை).';

  @override
  String get bankingErrorsInvalidFile => 'கோப்பைப் படிக்க முடியவில்லை.';

  @override
  String get bankingErrorsNotABankAccount =>
      'Bank Accounts கீழுள்ள பேரேட்டைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get bankingErrorsFeedNotConnected =>
      'முதலில் வங்கி ஊட்டத்தை இணைக்கவும்.';

  @override
  String get bankingErrorsLineAlreadyMatched => 'அந்த வரி ஏற்கனவே பொருந்தியது.';

  @override
  String get bankingErrorsVoucherNotOpen =>
      'அந்தப் பதிவு ஏற்கனவே பொருந்தியது அல்லது ரத்துசெய்யப்பட்டது.';

  @override
  String get bankingErrorsWrongDirection =>
      'வந்த பணம் வரவுகளுடனும், சென்ற பணம் செலுத்துகைகளுடனும் மட்டுமே பொருந்தும்.';

  @override
  String get bankingErrorsAmountsDiffer =>
      'பதிவுகளின் கூட்டு வரியின் தொகைக்குச் சமமாக இல்லை.';

  @override
  String get bankingErrorsSameAccount => 'வேறு பேரேட்டைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get bankingErrorsInvalidIfsc => 'சரியான IFSC உள்ளிடவும்.';

  @override
  String get assetsRegisterTitle => 'நிலைச் சொத்துகள்';

  @override
  String get assetsRegisterSubtitle =>
      'பதிவேடு, நிறுவனச் சட்டப்படி தேய்மானம், வருமான வரித் தொகுதி அட்டவணை.';

  @override
  String get assetsRegisterNew => 'சொத்து சேர்';

  @override
  String get assetsRegisterCode => 'குறியீடு';

  @override
  String get assetsRegisterName => 'சொத்து';

  @override
  String get assetsRegisterClass => 'வகுப்பு';

  @override
  String get assetsRegisterPurchased => 'வாங்கியது';

  @override
  String get assetsRegisterPutToUse => 'பயன்பாட்டில் இருந்து';

  @override
  String get assetsRegisterCost => 'விலை';

  @override
  String get assetsRegisterAccumulated => 'இதுவரை தேய்மானம்';

  @override
  String get assetsRegisterBookValue => 'புத்தக மதிப்பு';

  @override
  String get assetsRegisterStatus => 'நிலை';

  @override
  String get assetsRegisterStatusesActive => 'பயன்பாட்டில்';

  @override
  String get assetsRegisterStatusesDisposed => 'விற்றது / கழித்தது';

  @override
  String get assetsRegisterLocation => 'இடம்';

  @override
  String get assetsRegisterSerialNo => 'வரிசை எண்';

  @override
  String get assetsRegisterCustodian => 'பொறுப்பாளர்';

  @override
  String get assetsRegisterNone => 'இன்னும் சொத்துகள் இல்லை.';

  @override
  String get assetsClassesTitle => 'சொத்து வகுப்புகள்';

  @override
  String get assetsClassesPresets => 'நிலையான வகுப்பைச் சேர்';

  @override
  String get assetsClassesPreset => 'வகுப்பு';

  @override
  String get assetsClassesAdd => 'சேர்';

  @override
  String get assetsClassesCustom => 'அல்லது சொந்தமாக வரையறு';

  @override
  String get assetsClassesName => 'பெயர்';

  @override
  String get assetsClassesMethod => 'முறை';

  @override
  String get assetsClassesMethodsSlm => 'நேர்கோட்டு முறை';

  @override
  String get assetsClassesMethodsWdv => 'குறைந்துவரும் மதிப்பு (WDV)';

  @override
  String get assetsClassesLife => 'பயன்பாட்டுக் காலம் (ஆண்டுகள்)';

  @override
  String get assetsClassesResidual => 'எஞ்சிய மதிப்பு %';

  @override
  String get assetsClassesItBlock => 'வருமான வரித் தொகுதி';

  @override
  String get assetsClassesItRate => 'வரி விகிதம் %';

  @override
  String get assetsClassesBlocksBuilding => 'கட்டடங்கள்';

  @override
  String get assetsClassesBlocksPlantMachinery => 'ஆலை & இயந்திரங்கள்';

  @override
  String get assetsClassesBlocksFurniture => 'தளவாடங்கள் & பொருத்துதல்கள்';

  @override
  String get assetsClassesBlocksComputers => 'கணினிகள் & மென்பொருள்';

  @override
  String get assetsClassesBlocksIntangibles => 'அருவச் சொத்துகள்';

  @override
  String get assetsFormAcquisition => 'எப்படி வந்தது';

  @override
  String get assetsFormAcquisitionsSupplier => 'கடனில் வாங்கியது';

  @override
  String get assetsFormAcquisitionsPaid =>
      'ரொக்கம் அல்லது வங்கியிலிருந்து செலுத்தியது';

  @override
  String get assetsFormAcquisitionsOpening =>
      'ஏற்கனவே கணக்கில் (முன்கொண்டு வந்தது)';

  @override
  String get assetsFormSupplier => 'சப்ளையர்';

  @override
  String get assetsFormPaidFrom => 'இதிலிருந்து செலுத்தியது';

  @override
  String get assetsFormGstRate =>
      'ஜிஎஸ்டி விகிதம் % (உள்ளீட்டுக் கிரெடிட் பெற்றது)';

  @override
  String get assetsFormSupplierGstin => 'சப்ளையர் ஜிஎஸ்டிஐஎன்';

  @override
  String get assetsFormInvoiceRef => 'பில் எண்';

  @override
  String get assetsFormOpeningAccumulated => 'முன்பு விதித்த தேய்மானம்';

  @override
  String get assetsFormNotes => 'குறிப்புகள்';

  @override
  String get assetsFormSave => 'சொத்து சேர்';

  @override
  String get assetsDetailHistory => 'விதித்த தேய்மானம்';

  @override
  String get assetsDetailPeriod => 'காலம்';

  @override
  String get assetsDetailDays => 'நாட்கள்';

  @override
  String get assetsDetailVoucher => 'பதிவு';

  @override
  String get assetsDetailDispose => 'விற்க அல்லது கழிக்க';

  @override
  String get assetsDetailDisposeDate => 'தேதி';

  @override
  String get assetsDetailSaleValue => 'விற்பனை மதிப்பு (₹, கழித்தால் 0)';

  @override
  String get assetsDetailReceivedIn => 'இதில் பெறப்பட்டது';

  @override
  String get assetsDetailSaleGst => 'விற்பனையில் ஜிஎஸ்டி %';

  @override
  String get assetsDetailBuyerState =>
      'வாங்குநரின் மாநிலம் (உங்கள் மாநிலத்துக்கு வெளியே என்றால்)';

  @override
  String get assetsDetailDisposeButton => 'விற்பனையைப் பதி';

  @override
  String assetsDetailDisposed(String date, String value) {
    return '$date அன்று $value-க்கு விற்கப்பட்டது';
  }

  @override
  String get assetsDetailProfit => 'விற்பனையில் லாபம்';

  @override
  String get assetsDetailLoss => 'விற்பனையில் நட்டம்';

  @override
  String get assetsDetailPurchase => 'கொள்முதல் பதிவு';

  @override
  String get assetsDepreciationTitle => 'தேய்மானம்';

  @override
  String get assetsDepreciationSubtitle =>
      'ஒரு மாதம், காலாண்டு அல்லது ஆண்டுக்குத் தேய்மானம் விதிக்கவும். ஒவ்வொரு சொத்தும் கடைசியாக விதித்த இடத்திலிருந்து தொடரும்.';

  @override
  String get assetsDepreciationFrom => 'இருந்து';

  @override
  String get assetsDepreciationTo => 'வரை';

  @override
  String get assetsDepreciationPreview => 'கணக்கிடு';

  @override
  String get assetsDepreciationPost => 'தேய்மானத்தைப் பதி';

  @override
  String get assetsDepreciationTotal => 'மொத்தம்';

  @override
  String get assetsDepreciationRuns => 'பதிவுகள்';

  @override
  String get assetsDepreciationNone => 'இந்தக் காலத்தில் விதிக்க எதுவுமில்லை.';

  @override
  String get assetsDepreciationCancel => 'பதிவை ரத்துசெய்';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count சொத்துகள்',
      one: '$count சொத்து',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'வருமான வரி தேய்மானம்';

  @override
  String get assetsItSubtitle =>
      'தொகுதிவாரியாக, வரித் தணிக்கை அறிக்கையைப் போல (படிவம் 3CD, பிரிவு 18). 180 நாட்களுக்குக் குறைவாகப் பயன்பட்ட சேர்ப்புகளுக்கு அரை விகிதம்.';

  @override
  String get assetsItFy => 'ஆண்டு';

  @override
  String get assetsItBlock => 'தொகுதி';

  @override
  String get assetsItRate => 'விகிதம்';

  @override
  String get assetsItOpening => 'தொடக்க WDV';

  @override
  String get assetsItAddFull => 'சேர்ப்புகள் (180 நாட்கள் அல்லது மேல்)';

  @override
  String get assetsItAddHalf => 'சேர்ப்புகள் (180 நாட்களுக்குக் குறைவு)';

  @override
  String get assetsItSales => 'விற்பனை';

  @override
  String get assetsItDepreciation => 'தேய்மானம்';

  @override
  String get assetsItClosing => 'இறுதி WDV';

  @override
  String get assetsItGain => 'குறுகிய கால ஆதாயம்';

  @override
  String get assetsItLoss => 'குறுகிய கால நட்டம்';

  @override
  String get assetsItOpeningTitle => 'தொடக்கக் குறைந்துவரும் மதிப்பு';

  @override
  String get assetsItOpeningHint =>
      'உங்கள் கடைசி வரி ரிட்டர்னிலிருந்து முதல் ஆண்டின் தொடக்கத்தில் ஒவ்வொரு தொகுதியின் WDV-ஐ உள்ளிடவும்; அடுத்த ஆண்டுகள் தானாகத் தொடரும்.';

  @override
  String get assetsItSave => 'சேமி';

  @override
  String get assetsItTotal => 'மொத்தம்';

  @override
  String get assetsItNone => 'இந்த ஆண்டு சொத்துகள் இல்லை.';

  @override
  String get assetsErrorsClassExists => 'அந்த வகுப்பு ஏற்கனவே உள்ளது.';

  @override
  String get assetsErrorsClassIncomplete =>
      'பெயர், காலம், வரித் தொகுதியை நிரப்பவும்.';

  @override
  String get assetsErrorsUnknownPreset => 'வகுப்பைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get assetsErrorsInvalidLife =>
      'பயன்பாட்டுக் காலத்தை ஆண்டுகளில் உள்ளிடவும்.';

  @override
  String get assetsErrorsInvalidResidual =>
      'குறைந்துவரும் மதிப்பு முறைக்கு எஞ்சிய மதிப்பு 0%-க்கு மேல் தேவை.';

  @override
  String get assetsErrorsUnknownClass => 'வகுப்பைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get assetsErrorsClassArchived => 'அந்த வகுப்பு காப்பகத்தில் உள்ளது.';

  @override
  String get assetsErrorsInvalidCost => 'விலையை உள்ளிடவும்.';

  @override
  String get assetsErrorsUsedBeforeBought =>
      'வாங்கும் முன் பயன்பாட்டில் இருக்க முடியாது.';

  @override
  String get assetsErrorsAccountRequired => 'பேரேட்டைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get assetsErrorsNotASupplier => 'சப்ளையரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get assetsErrorsNotCashOrBank =>
      'ரொக்கம் அல்லது வங்கிப் பேரேட்டைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'உள்ளீட்டுக் கிரெடிட் பெற சப்ளையரின் ஜிஎஸ்டிஐஎன்-ஐ உள்ளிடவும்.';

  @override
  String get assetsErrorsPeriodCrossesYear =>
      'காலம் ஒரே நிதியாண்டுக்குள் இருக்க வேண்டும்.';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'இந்தக் காலத்தில் விதிக்க எதுவுமில்லை.';

  @override
  String get assetsErrorsLaterRunExists =>
      'பிந்தைய பதிவு இந்தச் சொத்துகளுக்குத் தேய்மானம் விதிக்கிறது; முதலில் அதை ரத்துசெய்யவும்.';

  @override
  String get assetsErrorsAssetDisposed =>
      'இந்தப் பதிவிலுள்ள ஒரு சொத்து விற்கப்பட்டது.';

  @override
  String get assetsErrorsAlreadyDisposed =>
      'இந்தச் சொத்து ஏற்கனவே விற்கப்பட்டது.';

  @override
  String get assetsErrorsSoldBeforeUse =>
      'விற்பனைத் தேதி பயன்பாட்டுக்கு வந்ததற்கு முன்னானது.';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'விற்பனைத் தேதிக்குப் பின் தேய்மானம் விதிக்கப்பட்டுள்ளது; முதலில் அந்தப் பதிவை ரத்துசெய்யவும்.';

  @override
  String get assetsErrorsInvalidDepreciation =>
      'தேய்மானத்தைக் கணக்கிட முடியவில்லை.';

  @override
  String get assetsErrorsInvalidFy => 'ஆண்டைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get expensesClaimsTitle => 'செலவுக் கோரிக்கைகள்';

  @override
  String get expensesClaimsSubtitle =>
      'பணியாளர்கள் செலவைக் கோருகிறார்கள்; ஒப்புதலில் அது பதியப்படும் (அனுமதி உள்ள இடத்தில் ஜிஎஸ்டி கிரெடிட்டுடன்), செலுத்தியதும் தீர்வாகும்.';

  @override
  String get expensesClaimsNew => 'புதிய கோரிக்கை';

  @override
  String get expensesClaimsNumber => 'கோரிக்கை';

  @override
  String get expensesClaimsEmployee => 'பணியாளர்';

  @override
  String get expensesClaimsDate => 'தேதி';

  @override
  String get expensesClaimsClaimTitle => 'நோக்கம்';

  @override
  String get expensesClaimsTotal => 'தொகை';

  @override
  String get expensesClaimsItc => 'ஜிஎஸ்டி கிரெடிட்';

  @override
  String get expensesClaimsStatus => 'நிலை';

  @override
  String get expensesClaimsStatusesDraft => 'வரைவு';

  @override
  String get expensesClaimsStatusesSubmitted =>
      'ஒப்புதலுக்குக் காத்திருக்கிறது';

  @override
  String get expensesClaimsStatusesApproved => 'ஒப்புதல் பெற்றது';

  @override
  String get expensesClaimsStatusesRejected => 'நிராகரிக்கப்பட்டது';

  @override
  String get expensesClaimsStatusesPaid => 'செலுத்தப்பட்டது';

  @override
  String get expensesClaimsStatusesCancelled => 'ரத்து';

  @override
  String get expensesClaimsWaiting => 'ஒப்புதலுக்குக் காத்திருக்கிறது';

  @override
  String get expensesClaimsToPay => 'ஒப்புதல் பெற்றது, செலுத்த வேண்டும்';

  @override
  String get expensesClaimsNone => 'இன்னும் கோரிக்கைகள் இல்லை.';

  @override
  String get expensesClaimsAll => 'அனைத்தும்';

  @override
  String get expensesFormTitle => 'செலவுக் கோரிக்கை';

  @override
  String get expensesFormProject => 'திட்டம்';

  @override
  String get expensesFormLines => 'செலவுகள்';

  @override
  String get expensesFormCategory => 'வகை';

  @override
  String get expensesFormDescription => 'விவரம்';

  @override
  String get expensesFormAmount => 'தொகை (₹)';

  @override
  String get expensesFormGstRate => 'ஜிஎஸ்டி %';

  @override
  String get expensesFormVendor => 'விற்பனையாளர்';

  @override
  String get expensesFormVendorGstin => 'விற்பனையாளர் ஜிஎஸ்டிஐஎன்';

  @override
  String get expensesFormInvoiceNo => 'பில் எண்';

  @override
  String get expensesFormReceipt => 'ரசீது';

  @override
  String get expensesFormUpload => 'இணை';

  @override
  String get expensesFormRead => 'ரசீதைப் படி';

  @override
  String get expensesFormReading => 'படிக்கிறது…';

  @override
  String get expensesFormReadDone =>
      'ரசீதிலிருந்து நிரப்பப்பட்டது. சரிபார்க்கவும்.';

  @override
  String get expensesFormReadNone =>
      'இந்த ரசீதைப் படிக்க முடியவில்லை; விவரங்களை உள்ளிடவும்.';

  @override
  String get expensesFormReadDemo =>
      'தானியங்கி வாசிப்பு அமைக்கப்படவில்லை; விவரங்களை உள்ளிடவும்.';

  @override
  String get expensesFormAddLine => 'செலவு சேர்';

  @override
  String get expensesFormSaveDraft => 'வரைவைச் சேமி';

  @override
  String get expensesFormSubmit => 'ஒப்புதலுக்குச் சமர்ப்பி';

  @override
  String get expensesFormItcHint =>
      'பில் நிறுவனத்தின் பெயரில் விற்பனையாளரின் ஜிஎஸ்டிஐஎன்-உடன் வரி விலைப்பட்டியலாக இருந்து, வகை அனுமதித்தால் ஜிஎஸ்டி கிரெடிட் பெறப்படும்.';

  @override
  String get expensesDetailApprove => 'ஒப்புதல் அளி';

  @override
  String get expensesDetailReject => 'நிராகரி';

  @override
  String get expensesDetailReason => 'காரணம்';

  @override
  String get expensesDetailPay => 'செலுத்து';

  @override
  String get expensesDetailPayFrom => 'இதிலிருந்து செலுத்து';

  @override
  String get expensesDetailPaidOn => 'செலுத்தும் தேதி';

  @override
  String get expensesDetailEdit => 'திருத்து';

  @override
  String get expensesDetailSubmit => 'சமர்ப்பி';

  @override
  String get expensesDetailCancel => 'கோரிக்கையை ரத்துசெய்';

  @override
  String get expensesDetailVoucher => 'செலவுப் பதிவு';

  @override
  String get expensesDetailPaymentVoucher => 'செலுத்துகை';

  @override
  String expensesDetailRejected(String reason) {
    return 'நிராகரிக்கப்பட்டது: $reason';
  }

  @override
  String get expensesDetailReceipt => 'ரசீதைப் பார்';

  @override
  String get expensesCategoriesTitle => 'செலவு வகைகள்';

  @override
  String get expensesCategoriesSubtitle =>
      'ஒவ்வொரு செலவும் எந்தப் பேரேட்டுக்குச் செல்கிறது, வரம்புகள், ஜிஎஸ்டி கிரெடிட் தடுக்கப்பட்டதா (பிரிவு 17(5)).';

  @override
  String get expensesCategoriesName => 'வகை';

  @override
  String get expensesCategoriesAccount => 'பேரேடு';

  @override
  String get expensesCategoriesBlocked => 'ஜிஎஸ்டி கிரெடிட் இல்லை';

  @override
  String get expensesCategoriesLimit => 'ஒரு கோரிக்கைக்கு வரம்பு (₹)';

  @override
  String get expensesCategoriesReceiptAbove => 'இதற்கு மேல் ரசீது தேவை (₹)';

  @override
  String get expensesCategoriesAdd => 'வகை சேர்';

  @override
  String get expensesCategoriesSave => 'சேமி';

  @override
  String get expensesErrorsNoLines => 'குறைந்தது ஒரு செலவைச் சேர்க்கவும்.';

  @override
  String get expensesErrorsUnknownCategory => 'வகையைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get expensesErrorsCategoryArchived => 'அந்த வகை காப்பகத்தில் உள்ளது.';

  @override
  String get expensesErrorsInvalidAmount => 'தொகையை உள்ளிடவும்.';

  @override
  String get expensesErrorsReceiptRequired =>
      'இந்தச் செலவுக்கு ரசீதை இணைக்கவும்.';

  @override
  String get expensesErrorsOverLimit =>
      'இது வகையின் ஒரு கோரிக்கை வரம்பை விட அதிகம்.';

  @override
  String get expensesErrorsInvalidGstin =>
      'விற்பனையாளரின் ஜிஎஸ்டிஐஎன் செல்லாது.';

  @override
  String get expensesErrorsUnknownEmployee => 'பணியாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get expensesErrorsUnknownProject => 'திட்டத்தைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get expensesErrorsClaimLocked =>
      'வரைவு அல்லது நிராகரிக்கப்பட்ட கோரிக்கையை மட்டுமே மாற்ற முடியும்.';

  @override
  String get expensesErrorsClaimNotSubmitted =>
      'கோரிக்கை ஒப்புதலுக்குக் காத்திருக்கவில்லை.';

  @override
  String get expensesErrorsClaimNotApproved =>
      'முதலில் கோரிக்கைக்கு ஒப்புதல் அளிக்கவும்.';

  @override
  String get expensesErrorsClaimPaid =>
      'செலுத்திய கோரிக்கையை ரத்துசெய்ய முடியாது; முதலில் செலுத்துகையை ரத்துசெய்யவும்.';

  @override
  String get expensesErrorsPaidBeforeClaim =>
      'செலுத்தும் தேதி கோரிக்கைக்கு முன்னானது.';

  @override
  String get expensesErrorsCategoryExists => 'அந்த வகை ஏற்கனவே உள்ளது.';

  @override
  String get expensesErrorsNotAnExpenseAccount =>
      'செலவுப் பேரேட்டைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get expensesErrorsFileType =>
      'புகைப்படம் (JPG, PNG, WebP) அல்லது PDF இணைக்கவும்.';

  @override
  String get expensesErrorsFileTooLarge => 'கோப்பு 5 MB-க்கு மேல் உள்ளது.';

  @override
  String get expensesErrorsFileEmpty => 'கோப்பு காலியாக உள்ளது.';

  @override
  String get projectsListTitle => 'திட்டங்கள்';

  @override
  String get projectsListSubtitle =>
      'ஒவ்வொரு வேலைக்கும் பணிகள், நேரம், செலவுகள், பில்லிங்.';

  @override
  String get projectsListNew => 'புதிய திட்டம்';

  @override
  String get projectsListCode => 'குறியீடு';

  @override
  String get projectsListName => 'திட்டம்';

  @override
  String get projectsListCustomer => 'வாடிக்கையாளர்';

  @override
  String get projectsListBilling => 'பில்லிங்';

  @override
  String get projectsListBillingsFixed => 'நிலையான விலை';

  @override
  String get projectsListBillingsTimeMaterial => 'நேரம் & பொருள்';

  @override
  String get projectsListBillingsNonBillable => 'உள்துறை';

  @override
  String get projectsListStatus => 'நிலை';

  @override
  String get projectsListStatusesActive => 'செயலில்';

  @override
  String get projectsListStatusesOnHold => 'நிறுத்தி வைக்கப்பட்டது';

  @override
  String get projectsListStatusesCompleted => 'முடிந்தது';

  @override
  String get projectsListStatusesCancelled => 'ரத்து';

  @override
  String get projectsListRevenue => 'பில் செய்தது';

  @override
  String get projectsListCost => 'செலவு';

  @override
  String get projectsListMargin => 'லாப விளிம்பு';

  @override
  String get projectsListHours => 'மணிநேரம்';

  @override
  String get projectsListNone => 'இன்னும் திட்டங்கள் இல்லை.';

  @override
  String get projectsFormContractValue => 'ஒப்பந்த மதிப்பு (₹)';

  @override
  String get projectsFormBudgetCost => 'வரவுசெலவுச் செலவு (₹)';

  @override
  String get projectsFormBudgetHours => 'வரவுசெலவு மணிநேரம்';

  @override
  String get projectsFormBillRate => 'மணிநேர பில் விலை (₹)';

  @override
  String get projectsFormBillingItem => 'விலைப்பட்டியலில் (சேவைப் பொருள்)';

  @override
  String get projectsFormStartOn => 'தொடக்கம்';

  @override
  String get projectsFormEndOn => 'முடிவு';

  @override
  String get projectsFormNotes => 'குறிப்புகள்';

  @override
  String get projectsFormSave => 'திட்டத்தைச் சேமி';

  @override
  String get projectsDetailLabour => 'உழைப்பு';

  @override
  String get projectsDetailExpenses => 'செலவுகள்';

  @override
  String get projectsDetailPurchases => 'கொள்முதல்';

  @override
  String get projectsDetailUnbilled => 'பில் செய்யாத நேரம்';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return 'வரவுசெலவில் $pct%';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return 'மணிநேரத்தில் $pct%';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% லாப விளிம்பு';
  }

  @override
  String get projectsDetailTasks => 'பணிகள்';

  @override
  String get projectsDetailTask => 'பணி';

  @override
  String get projectsDetailAssignee => 'ஒதுக்கப்பட்டவர்';

  @override
  String get projectsDetailEstimate => 'மதிப்பீடு (ம)';

  @override
  String get projectsDetailLogged => 'பதிந்தது (ம)';

  @override
  String get projectsDetailDue => 'கடைசித் தேதி';

  @override
  String get projectsDetailTaskStatusesTodo => 'செய்ய வேண்டியது';

  @override
  String get projectsDetailTaskStatusesDoing => 'நடைபெறுகிறது';

  @override
  String get projectsDetailTaskStatusesDone => 'முடிந்தது';

  @override
  String get projectsDetailAddTask => 'பணி சேர்';

  @override
  String get projectsDetailMembers => 'குழுவும் விலைகளும்';

  @override
  String get projectsDetailMember => 'நபர்';

  @override
  String get projectsDetailMemberRate => 'பில் விலை (₹/ம)';

  @override
  String get projectsDetailAddMember => 'சேர்';

  @override
  String get projectsDetailMilestones => 'மைல்கற்கள்';

  @override
  String get projectsDetailMilestone => 'மைல்கல்';

  @override
  String get projectsDetailAmount => 'தொகை (₹)';

  @override
  String get projectsDetailAddMilestone => 'மைல்கல் சேர்';

  @override
  String get projectsDetailBill => 'விலைப்பட்டியல் இடு';

  @override
  String projectsDetailBilled(String number) {
    return 'விலைப்பட்டியல் $number';
  }

  @override
  String get projectsDetailTime => 'நேரம்';

  @override
  String get projectsDetailBillTime =>
      'ஒப்புதல் பெற்ற மணிநேரங்களுக்கு விலைப்பட்டியல் இடு';

  @override
  String get projectsDetailBillUpTo => 'வரை';

  @override
  String get projectsDetailInvoices => 'விலைப்பட்டியல்கள்';

  @override
  String get projectsDetailEdit => 'திட்டத்தைத் திருத்து';

  @override
  String get projectsDetailRemove => 'நீக்கு';

  @override
  String projectsDetailInvoiced(String number) {
    return 'விலைப்பட்டியல் $number உருவானது.';
  }

  @override
  String get projectsTimeTitle => 'நேரத்தாள்கள்';

  @override
  String get projectsTimeSubtitle =>
      'திட்டங்களில் மணிநேரம் பதியுங்கள்; ஒப்புதல் பெற்ற பில் செய்யக்கூடிய மணிநேரங்களுக்கு விலைப்பட்டியல் இடலாம்.';

  @override
  String get projectsTimeLog => 'நேரம் பதி';

  @override
  String get projectsTimeEmployee => 'பணியாளர்';

  @override
  String get projectsTimeProject => 'திட்டம்';

  @override
  String get projectsTimeTask => 'பணி';

  @override
  String get projectsTimeDate => 'தேதி';

  @override
  String get projectsTimeHours => 'மணிநேரம்';

  @override
  String get projectsTimeBillable => 'பில் செய்யக்கூடியது';

  @override
  String get projectsTimeNote => 'குறிப்பு';

  @override
  String get projectsTimeSave => 'பதி';

  @override
  String get projectsTimeApprove => 'ஒப்புதல் அளி';

  @override
  String get projectsTimeReject => 'நிராகரி';

  @override
  String projectsTimeSelected(String count) {
    return '$count தேர்ந்தெடுக்கப்பட்டன';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'சமர்ப்பிக்கப்பட்டது';

  @override
  String get projectsTimeStatusesApproved => 'ஒப்புதல் பெற்றது';

  @override
  String get projectsTimeStatusesRejected => 'நிராகரிக்கப்பட்டது';

  @override
  String get projectsTimeStatusesBilled => 'விலைப்பட்டியல் இடப்பட்டது';

  @override
  String get projectsTimeTotal => 'மொத்தம்';

  @override
  String get projectsTimeNone => 'நேரம் பதியப்படவில்லை.';

  @override
  String get projectsTimeCostRate => 'செலவு/ம';

  @override
  String get projectsTimeBillRate => 'பில்/ம';

  @override
  String get projectsTimeDelete => 'நீக்கு';

  @override
  String get projectsErrorsNotACustomer => 'வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get projectsErrorsUnknownItem => 'சேவைப் பொருளைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get projectsErrorsEndsBeforeStart =>
      'முடிவுத் தேதி தொடக்கத்துக்கு முன்னானது.';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'முதலில் திட்டத்தின் வாடிக்கையாளரை அமைக்கவும்.';

  @override
  String get projectsErrorsBillingItemRequired =>
      'திட்டத்தில் விலைப்பட்டியலுக்கான பொருளைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get projectsErrorsMilestoneBilled =>
      'அந்த மைல்கல்லுக்கு ஏற்கனவே விலைப்பட்டியல் இடப்பட்டது.';

  @override
  String get projectsErrorsProjectNotActive => 'திட்டம் செயலில் இல்லை.';

  @override
  String get projectsErrorsInvalidHours =>
      '0 முதல் 24 வரை மணிநேரம் உள்ளிடவும்.';

  @override
  String get projectsErrorsTooManyHours => 'ஒரு நாளில் 24 மணிநேரத்துக்கு மேல்.';

  @override
  String get projectsErrorsUnknownTask =>
      'இந்தத் திட்டத்தின் பணியைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get projectsErrorsTimesheetLocked =>
      'ஒப்புதல் பெற்ற அல்லது விலைப்பட்டியல் இட்ட நேரத்தை மாற்ற முடியாது.';

  @override
  String get projectsErrorsNothingToBill =>
      'விலைப்பட்டியல் இட ஒப்புதல் பெற்ற பில் செய்யக்கூடிய மணிநேரம் இல்லை.';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'நேரம்-&-பொருள் திட்டங்கள் மட்டுமே மணிநேரத்துக்கு பில் செய்யும்.';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'அந்தத் தேதியில் பணியாளர் வேலையில் இல்லை.';

  @override
  String get projectsErrorsUnknownEmployee => 'பணியாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count வாடிக்கையாளர்கள்',
      one: '$count வாடிக்கையாளர்',
    );
    return '$_temp0 60 நாட்களுக்கு மேல் செலுத்தத் தாமதம்: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$period-க்கான $form $days நாட்கள் தாமதம்';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$period-க்கான $form $days நாட்களில் தாக்கல் செய்ய வேண்டும்';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count பொருட்கள்',
      one: '$count பொருள்',
    );
    return '$_temp0 மறு ஆர்டர் நிலைக்குக் கீழே';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$count வங்கி அறிக்கை வரிகள் ஒரு வாரத்துக்கு மேல் ஒப்பீட்டுக்குக் காத்திருக்கின்றன';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$count செலவுக் கோரிக்கைகள் 3 நாட்களுக்கு மேல் ஒப்புதலுக்குக் காத்திருக்கின்றன';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count பின்தொடர்வுகள் தாமதம்',
      one: '$count பின்தொடர்வு தாமதம்',
    );
    return '$_temp0';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$name எதிர்மறை இருப்பைக் காட்டுகிறது ($amount): ஒரு பதிவு விடுபட்டுள்ளது அல்லது தவறானது';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    return '$count ஒப்புதல் மெமோக்கள் ஆறு மாத இன்வாய்ஸ் வரம்பை நெருங்குகின்றன';
  }

  @override
  String alertsApprovalsOut(num count) {
    return '$count ஒப்புதல் மெமோக்களின் சரக்கு 30 நாட்களுக்கு மேல் வெளியே உள்ளது';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count முக்கிய மாற்றங்கள்',
      one: '$count முக்கிய மாற்றம்',
    );
    return 'கடந்த 7 நாட்களில் $_temp0 (வங்கி விவரங்கள், கடன் விதிமுறைகள், வரி அமைப்புகள் அல்லது உரிமைகள்)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ஊழியர் ஆவணங்கள்',
      one: '$count ஊழியர் ஆவணம்',
    );
    return '$_temp0 காலாவதியாகிவிட்டன அல்லது 30 நாட்களில் ஆகும்';
  }

  @override
  String get checksTitle => 'சோதனைகள்';

  @override
  String get checksSubtitle =>
      'உங்கள் CA பார்க்கும் முன் மீண்டும் பார்க்க வேண்டிய பதிவுகள்: வருமான வரிச் சட்டத்தின் ரொக்க வரம்புகள், சாத்தியமான நகல் பில்கள், விலைக்குக் குறைவான விற்பனை, பூஜ்யத்துக்குக் கீழ் சரக்கு.';

  @override
  String get checksNone => 'அசாதாரணமாக எதுவும் இல்லை.';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return '$party-க்கு ரொக்கம் செலுத்தியது: ஒரே நாளில் $amount. ஒருவருக்கு ஒரு நாளில் ₹10,000-க்கு மேல் ரொக்கச் செலவு அனுமதிக்கப்படாது (பிரிவு 40A(3)); வங்கி மூலம் செலுத்தவும்.';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return '$party-இடமிருந்து ரொக்கம் பெற்றது: ஒரே நாளில் $amount. ₹2 லட்சம் அல்லது அதற்கு மேல் ரொக்கம் பெறுவது அனுமதிக்கப்படாது (பிரிவு 269ST); அபராதம் அதே தொகை.';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplier ஒரு வாரத்துக்குள் இருமுறை $amount பில் செய்தார் ($first மற்றும் $second). ஒன்று நகலா?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item $rate-க்கு விற்கப்பட்டது, கொள்முதல் விலை $cost-க்குக் குறைவு.';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item $qty $uom-இல் உள்ளது: சரக்கில் இருந்ததை விட அதிகம் விற்கப்பட்டது அல்லது வழங்கப்பட்டது.';
  }

  @override
  String get assistantTitle => 'உதவியாளர்';

  @override
  String get assistantSubtitle =>
      'விற்பனை, நிலுவைகள், லாபம், சரக்கு அல்லது ஜிஎஸ்டி பற்றிக் கேளுங்கள். இது உங்கள் கணக்குகளைப் படிக்கும்; ஒருபோதும் மாற்றாது.';

  @override
  String get assistantPlaceholder => 'ஒரு கேள்வி கேளுங்கள்…';

  @override
  String get assistantSend => 'கேள்';

  @override
  String get assistantThinking => 'தேடுகிறது…';

  @override
  String get assistantClear => 'புதிய உரையாடல்';

  @override
  String get assistantDemo =>
      'உள்ளமைந்த உதவியாளர்: பொதுவான கேள்விகளுக்குப் பதிலளிக்கும். எதையும் கேட்க AI சேவையை இணைக்கவும்.';

  @override
  String get assistantClaude =>
      'உங்கள் கணக்குகளிலிருந்து, உங்கள் அணுகல் உரிமைகளுடன் Claude பதிலளித்தது.';

  @override
  String get assistantSuggestionsS1 => 'நமக்கு அதிகம் தர வேண்டியவர் யார்?';

  @override
  String get assistantSuggestionsS2 => 'இந்த மாத விற்பனை எப்படி?';

  @override
  String get assistantSuggestionsS3 => 'இந்த மாதம் நம் லாபம் எவ்வளவு?';

  @override
  String get assistantSuggestionsS4 =>
      'எந்தப் பொருட்கள் மறு ஆர்டர் நிலைக்குக் கீழே உள்ளன?';

  @override
  String get assistantSuggestionsS5 =>
      'நான் சரிபார்க்க வேண்டிய பதிவுகள் ஏதேனும் உள்ளதா?';

  @override
  String assistantTools(String tools) {
    return 'பார்த்தவை: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'உதவியாளர் பணியில் உள்ளது; ஒரு நிமிடம் கழித்து முயலவும்.';

  @override
  String get assistantErrorsAssistantFailed =>
      'உதவியாளரால் இப்போது பதிலளிக்க முடியவில்லை.';

  @override
  String get assistantErrorsEmptyQuestion =>
      'ஒரு கேள்வியைத் தட்டச்சு செய்யவும்.';

  @override
  String get crmLeadsTitle => 'லீட்கள்';

  @override
  String get crmLeadsSubtitle =>
      'முதல் விசாரணையிலிருந்து ஆர்டர் வரை வாய்ப்புள்ள வாடிக்கையாளர்கள்.';

  @override
  String get crmLeadsNew => 'புதிய லீட்';

  @override
  String get crmLeadsName => 'தொடர்பு நபர்';

  @override
  String get crmLeadsOrganisation => 'வணிகம்';

  @override
  String get crmLeadsPhone => 'மொபைல்';

  @override
  String get crmLeadsEmail => 'மின்னஞ்சல்';

  @override
  String get crmLeadsGstin => 'ஜிஎஸ்டிஐஎன்';

  @override
  String get crmLeadsState => 'மாநிலம்';

  @override
  String get crmLeadsCity => 'நகரம்';

  @override
  String get crmLeadsSource => 'மூலம்';

  @override
  String get crmLeadsSourcesWalkIn => 'நேரடி வருகை';

  @override
  String get crmLeadsSourcesReferral => 'பரிந்துரை';

  @override
  String get crmLeadsSourcesWebsite => 'இணையதளம்';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'வர்த்தகக் கண்காட்சி';

  @override
  String get crmLeadsSourcesOther => 'மற்றவை';

  @override
  String get crmLeadsStage => 'நிலை';

  @override
  String get crmLeadsStagesNew => 'புதியது';

  @override
  String get crmLeadsStagesContacted => 'தொடர்புகொண்டது';

  @override
  String get crmLeadsStagesQualified => 'தகுதியானது';

  @override
  String get crmLeadsStagesProposal => 'முன்மொழிவு அனுப்பப்பட்டது';

  @override
  String get crmLeadsStagesWon => 'வென்றது';

  @override
  String get crmLeadsStagesLost => 'இழந்தது';

  @override
  String get crmLeadsValue => 'எதிர்பார்க்கும் மதிப்பு (₹)';

  @override
  String get crmLeadsExpectedClose => 'எதிர்பார்க்கும் முடிவு';

  @override
  String get crmLeadsOwner => 'பொறுப்பாளர்';

  @override
  String get crmLeadsNotes => 'குறிப்புகள்';

  @override
  String get crmLeadsNextFollowUp => 'அடுத்த பின்தொடர்வு';

  @override
  String get crmLeadsSave => 'சேமி';

  @override
  String get crmLeadsNone => 'இன்னும் லீட்கள் இல்லை.';

  @override
  String get crmLeadsSearch => 'பெயர், வணிகம், மொபைல் அல்லது நகரத்தைத் தேடு';

  @override
  String crmLeadsWeighted(String amount) {
    return 'எடையிட்ட $amount';
  }

  @override
  String get crmLeadsConvert => 'வென்றது: வாடிக்கையாளராக்கு';

  @override
  String get crmLeadsLost => 'இழந்ததாகக் குறி';

  @override
  String get crmLeadsLostReason => 'ஏன் இழந்தது?';

  @override
  String get crmLeadsEdit => 'லீடைத் திருத்து';

  @override
  String get crmActivitiesTitle => 'பின்தொடர்வுகள்';

  @override
  String get crmActivitiesSubtitle =>
      'அழைப்புகள், சந்திப்புகள், பணிகள், முதலில் வர வேண்டியது முதலில்.';

  @override
  String get crmActivitiesAdd => 'சேர்';

  @override
  String get crmActivitiesKind => 'வகை';

  @override
  String get crmActivitiesKindsCall => 'அழைப்பு';

  @override
  String get crmActivitiesKindsMeeting => 'சந்திப்பு';

  @override
  String get crmActivitiesKindsTask => 'பணி';

  @override
  String get crmActivitiesKindsNote => 'குறிப்பு';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'மின்னஞ்சல்';

  @override
  String get crmActivitiesSubject => 'என்ன செய்ய வேண்டும் அல்லது என்ன நடந்தது';

  @override
  String get crmActivitiesDue => 'எப்போது';

  @override
  String get crmActivitiesDone => 'முடிந்ததாகக் குறி';

  @override
  String get crmActivitiesReopen => 'முடியாததாகக் குறி';

  @override
  String get crmActivitiesNotes => 'குறிப்புகள்';

  @override
  String get crmActivitiesNone => 'இங்கே எதுவுமில்லை.';

  @override
  String get crmActivitiesOpen => 'திறந்தவை';

  @override
  String get crmActivitiesAll => 'அனைத்தும்';

  @override
  String get crmActivitiesLate => 'தாமதம்';

  @override
  String get crmMessagesSend => 'WhatsApp அனுப்பு';

  @override
  String get crmMessagesTemplate => 'வார்ப்புரு';

  @override
  String crmMessagesSent(String to) {
    return '$to-க்கு அனுப்பப்பட்டது.';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'அனுப்பப்படவில்லை: $error';
  }

  @override
  String get crmMessagesDemo =>
      'டெமோ முறை: WhatsApp Business இணைக்கப்படும் வரை செய்திகள் பதியப்படும், ஆனால் அனுப்பப்படாது.';

  @override
  String get crmMessagesRemind => 'செலுத்த நினைவூட்டல் அனுப்பு';

  @override
  String get crmTemplatesTitle => 'செய்தி வார்ப்புருக்கள்';

  @override
  String get crmTemplatesSubtitle =>
      'பெயர், தொகை, தேதிக்கான எண்ணிட்ட காலியிடங்களுடன் WhatsApp செய்திகள். வாடிக்கையாளருக்கு முதலில் செய்தி அனுப்ப வார்ப்புரு Meta-வின் ஒப்புதல் பெற்றிருக்க வேண்டும்; அதன் ஒப்புதல் பெற்ற பெயரை உள்ளிடவும்.';

  @override
  String get crmTemplatesName => 'பெயர் (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'உரை';

  @override
  String get crmTemplatesCategory => 'வகை';

  @override
  String get crmTemplatesCategoriesUtility =>
      'புதுப்பிப்புகள் (பில்கள், நினைவூட்டல்கள்)';

  @override
  String get crmTemplatesCategoriesMarketing => 'சந்தைப்படுத்தல்';

  @override
  String get crmTemplatesProviderName => 'Meta-வில் ஒப்புதல் பெற்ற பெயர்';

  @override
  String get crmTemplatesAdd => 'வார்ப்புரு சேர்';

  @override
  String get crmTemplatesSave => 'சேமி';

  @override
  String get crmCustomerTitle => 'வாடிக்கையாளர்';

  @override
  String get crmCustomerBalance => 'இருப்பு';

  @override
  String get crmCustomerSalesThisYear => 'இந்த ஆண்டு விற்பனை';

  @override
  String get crmCustomerSalesLastYear => 'கடந்த ஆண்டு';

  @override
  String get crmCustomerOpenItems => 'திறந்த பில்கள்';

  @override
  String get crmCustomerInvoices => 'சமீபத்திய விலைப்பட்டியல்கள்';

  @override
  String get crmCustomerReceipts => 'சமீபத்தில் பெற்ற பணம்';

  @override
  String get crmCustomerOrders => 'திறந்த விலைப்புள்ளிகளும் ஆர்டர்களும்';

  @override
  String get crmCustomerActivities => 'செயல்பாடுகள்';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'லீட் $code-இலிருந்து ($source)';
  }

  @override
  String get crmCustomerLedger => 'பேரேட்டு அறிக்கை';

  @override
  String get crmErrorsInvalidPhone =>
      '10 இலக்க இந்திய மொபைல் எண்ணை உள்ளிடவும்.';

  @override
  String get crmErrorsInvalidGstin => 'ஜிஎஸ்டிஐஎன் செல்லாது.';

  @override
  String get crmErrorsConvertToWin =>
      'லீடை வெல்ல “வென்றது: வாடிக்கையாளராக்கு” பயன்படுத்தவும்.';

  @override
  String get crmErrorsLostReasonRequired => 'ஏன் இழந்தது என்று சொல்லவும்.';

  @override
  String get crmErrorsAlreadyConverted => 'இந்த லீட் ஏற்கனவே வாடிக்கையாளர்.';

  @override
  String get crmErrorsLeadOrCustomerRequired =>
      'லீட் அல்லது வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get crmErrorsUnknownTemplate => 'வார்ப்புருவைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get crmErrorsMissingParam =>
      'வார்ப்புருவின் ஒவ்வொரு காலியிடத்தையும் நிரப்பவும்.';

  @override
  String get crmErrorsTemplateTooLong => 'வார்ப்புரு மிக நீளமானது.';

  @override
  String get crmErrorsTemplateExists =>
      'இந்தப் பெயரில் ஏற்கனவே வார்ப்புரு உள்ளது.';

  @override
  String get crmErrorsNothingOutstanding =>
      'இந்த வாடிக்கையாளரிடம் நிலுவை எதுவுமில்லை.';

  @override
  String get crmErrorsInvalidTemplateName =>
      'சிற்றெழுத்துகள், எண்கள், _ மட்டுமே பயன்படுத்தவும்.';

  @override
  String get crmErrorsUnknownAccount => 'வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get crmErrorsInvalidStage => 'நிலையைத் தேர்ந்தெடுக்கவும்.';

  @override
  String get priceListsTitle => 'விலைப் பட்டியல்';

  @override
  String get priceListsSubtitle =>
      'மொத்த, விநியோகஸ்தர் அல்லது சில்லறை விலைகள். பட்டியலில் உள்ள வாடிக்கையாளருக்குப் புதிய ஆர்டர்கள் மற்றும் இன்வாய்ஸ்களில் அதன் விலைகள் கிடைக்கும்.';

  @override
  String get priceListsOne => 'விலைப் பட்டியல்';

  @override
  String get priceListsNone => 'இல்லை (விற்பனை விலை)';

  @override
  String get priceListsNew => 'புதிய விலைப் பட்டியல்';

  @override
  String get priceListsName => 'பெயர்';

  @override
  String get priceListsDiscountPct => 'விற்பனை விலையில் தள்ளுபடி (%)';

  @override
  String get priceListsDiscountHint =>
      'நிலையான விலை இல்லாத ஒவ்வொரு பொருளுக்கும் பொருந்தும்';

  @override
  String get priceListsFixedRates => 'நிலையான விலைகள்';

  @override
  String get priceListsCustomers => 'வாடிக்கையாளர்கள்';

  @override
  String get priceListsEmpty => 'இன்னும் விலைப் பட்டியல் இல்லை.';

  @override
  String get priceListsAddRate => 'நிலையான விலை சேர்';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'இந்தப் பெயரில் விலைப் பட்டியல் ஏற்கனவே உள்ளது.';

  @override
  String get priceListsErrorsDuplicateItem => 'ஒரு பொருள் இருமுறை உள்ளது.';

  @override
  String get agentsTitle => 'தரகர்கள் மற்றும் முகவர்கள்';

  @override
  String get agentsSubtitle =>
      'ஒவ்வொரு முகவரும் கொண்டுவந்த வாடிக்கையாளர்களிடமிருந்து பெற்ற பணத்தின் மீது கமிஷன். பொருள் திரும்பினால் கமிஷன் திரும்பும்.';

  @override
  String get agentsIsAgent => 'தரகர் அல்லது முகவர் (கமிஷன் பெறுபவர்)';

  @override
  String get agentsCommissionPct => 'கமிஷன் (%)';

  @override
  String get agentsCommissionHint =>
      'வரி விதிக்கத்தக்க மதிப்பில், வாடிக்கையாளர் செலுத்தும்போது';

  @override
  String get agentsAgent => 'முகவர்';

  @override
  String get agentsNoAgent => 'முகவர் இல்லை';

  @override
  String get agentsSalesman => 'விற்பனையாளர்';

  @override
  String get agentsNoSalesman => 'விற்பனையாளர் இல்லை';

  @override
  String get agentsEarned => 'ஈட்டியது';

  @override
  String get agentsBilled => 'பில் செய்தது';

  @override
  String get agentsDue => 'நிலுவை';

  @override
  String get agentsInvoice => 'விலைப்பட்டியல்';

  @override
  String get agentsBase => 'வரி மதிப்பு';

  @override
  String get agentsReceived => 'பெற்றது';

  @override
  String get agentsNoInvoices => 'இன்னும் விலைப்பட்டியல் இல்லை.';

  @override
  String get agentsMakeBill => 'தரகு பில் உருவாக்கு';

  @override
  String get agentsEmpty =>
      'இன்னும் முகவர்கள் இல்லை. கணக்குப் பட்டியலில் ஒரு கணக்கைத் தரகர் அல்லது முகவர் எனக் குறிக்கவும்.';

  @override
  String get agentsBills => 'தரகு பில்கள்';

  @override
  String get agentsNumber => 'எண்';

  @override
  String get agentsCommission => 'கமிஷன்';

  @override
  String get agentsTds => 'டிடிஎஸ்';

  @override
  String get agentsNet => 'நிகர செலுத்த வேண்டியது';

  @override
  String get agentsNoBills => 'இன்னும் தரகு பில்கள் இல்லை.';

  @override
  String agentsBillFor(String name, String amount) {
    return '$name அவர்களுக்கு நிலுவையில் உள்ள $amount கமிஷனுக்கு பில் செய்யவும்.';
  }

  @override
  String get agentsTdsRate => 'டிடிஎஸ் விகிதம் (%)';

  @override
  String get agentsTdsHint =>
      'காலியாக விடுங்கள்: ஆண்டின் கமிஷன் ₹20,000 தாண்டினால் 194H கீழ் 2%';

  @override
  String get agentsPost => 'பில் பதிவு செய்';

  @override
  String get agentsCancelBill => 'பில்லை ரத்து செய்';

  @override
  String get agentsErrorsNothingToBill =>
      'அந்தத் தேதியில் இந்த முகவருக்கு நிலுவை எதுவும் இல்லை.';

  @override
  String get agentsErrorsNotAnAgent =>
      'தரகர் அல்லது முகவர் எனக் குறிக்கப்பட்ட கணக்கைத் தேர்வுசெய்.';

  @override
  String get targetsTitle => 'விற்பனையாளர் இலக்குகள்';

  @override
  String get targetsSubtitle =>
      'கமிஷன் படிநிலைகளுடன் மாதாந்திர இலக்குகள், ஒவ்வொரு விற்பனையாளரின் விற்பனை (திரும்பியவை கழித்து) அடிப்படையில்.';

  @override
  String get targetsPrevious => 'முந்தைய மாதம்';

  @override
  String get targetsNext => 'அடுத்த மாதம்';

  @override
  String get targetsEdit => 'இலக்குகளை அமை';

  @override
  String get targetsChooseSalesman => 'விற்பனையாளரைத் தேர்வுசெய்';

  @override
  String get targetsTarget => 'இலக்கு';

  @override
  String get targetsSlabs => 'படிநிலைகள்';

  @override
  String get targetsSlabsHint =>
      'படிநிலை = இலக்கில் எத்தனை சதவீதம் : கமிஷன் சதவீதம். உதா. 0:1, 100:2 என்றால் இலக்குக்குக் கீழே 1%, இலக்கு அல்லது அதற்கு மேல் 2%.';

  @override
  String get targetsAdd => 'விற்பனையாளரைச் சேர்';

  @override
  String get targetsCopyLast => 'கடந்த மாதத்திலிருந்து நகலெடு';

  @override
  String get targetsAchieved => 'அடைந்தது';

  @override
  String get targetsProgress => 'இலக்கில்';

  @override
  String get targetsRate => 'விகிதம்';

  @override
  String targetsInvoices(num n) {
    return '$n விலைப்பட்டியல்கள்';
  }

  @override
  String targetsReturns(String amount) {
    return 'திரும்பியவை $amount';
  }

  @override
  String get targetsNoTarget => 'இலக்கு இல்லை';

  @override
  String get targetsEmpty =>
      'இந்த மாதம் இலக்குகளோ விற்பனையாளர் விற்பனையோ இல்லை.';

  @override
  String get targetsNote =>
      'விற்பனை = விற்பனையாளர் குறிக்கப்பட்ட விலைப்பட்டியல்களின் வரி மதிப்பு, அந்த மாதம் அவற்றின் மீதான கடன் குறிப்புகள் கழித்து.';

  @override
  String get targetsErrorsInvalid =>
      'ஒவ்வொரு வரிசையிலும் விற்பனையாளர், ரூபாயில் இலக்கு, 0:1, 100:2 போன்ற படிநிலைகள் தேவை.';

  @override
  String get targetsErrorsDuplicateSalesman =>
      'ஒரு விற்பனையாளர் இருமுறை உள்ளார்.';

  @override
  String get targetsErrorsDuplicateSlab =>
      'இரண்டு படிநிலைகள் ஒரே சதவீதத்தில் தொடங்குகின்றன.';

  @override
  String get targetsErrorsUnknownEmployee =>
      'உங்கள் ஊழியர்களில் இருந்து விற்பனையாளரைத் தேர்வுசெய்.';

  @override
  String get schemesTitle => 'திட்டங்கள் மற்றும் சலுகைகள்';

  @override
  String get schemesSubtitle =>
      'கவுண்டர் தானாகவே பயன்படுத்தும் சலுகைகள்: சதவீத தள்ளுபடி, தொகை தள்ளுபடி, X வாங்கினால் Y, படிநிலைகள், காம்போ.';

  @override
  String get schemesNew => 'புதிய திட்டம்';

  @override
  String get schemesName => 'பெயர்';

  @override
  String get schemesOffer => 'சலுகை';

  @override
  String get schemesOn => 'எதில்';

  @override
  String get schemesDates => 'தேதிகள்';

  @override
  String get schemesOff => 'நிறுத்தப்பட்டது';

  @override
  String get schemesEmpty => 'இன்னும் திட்டங்கள் இல்லை.';

  @override
  String get schemesRules =>
      'ஒவ்வொரு வரிக்கும் அதிகபட்சம் ஒரு திட்டம்; வாடிக்கையாளருக்கு அதிக சேமிப்பு தரும் கலவை பில்லுக்குப் பொருந்தும். தனி தள்ளுபடி உள்ள வரிக்கு திட்டம் இல்லை.';

  @override
  String get schemesEverything => 'அனைத்தும்';

  @override
  String get schemesAlways => 'எப்போதும்';

  @override
  String get schemesNow => 'இப்போதிலிருந்து';

  @override
  String get schemesNoEnd => 'முடிவுத் தேதி இல்லை';

  @override
  String schemesRange(String from, String to) {
    return '$from முதல் $to';
  }

  @override
  String get schemesKind => 'வகை';

  @override
  String get schemesStartsOn => 'முதல்';

  @override
  String get schemesEndsOn => 'வரை';

  @override
  String get schemesPct => 'தள்ளுபடி (%)';

  @override
  String get schemesOffPct => 'கூடுதல் துண்டுகளுக்கு தள்ளுபடி (%)';

  @override
  String get schemesOffPctHint => '100 என்றால் இலவசம்';

  @override
  String get schemesAmount => 'தள்ளுபடி தொகை (₹)';

  @override
  String get schemesMinValue => 'இவற்றின் குறைந்தபட்சம் (₹)';

  @override
  String get schemesBuy => 'வாங்கு';

  @override
  String get schemesGet => 'பெறு';

  @override
  String get schemesSlabs => 'படிநிலைகள்';

  @override
  String get schemesQtySlabsHint => 'துண்டுகள் : சதவீதம், உதா. 3:10, 5:20';

  @override
  String get schemesValueSlabsHint => 'ரூபாய் : சதவீதம், உதா. 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'காம்போ விலை (₹)';

  @override
  String get schemesComboItems => 'காம்போவில் உள்ளவை';

  @override
  String get schemesItem => 'பொருள்';

  @override
  String get schemesQty => 'அளவு';

  @override
  String get schemesAddItem => 'பொருளைச் சேர்';

  @override
  String get schemesAddStyle => 'ஸ்டைலைச் சேர்';

  @override
  String get schemesScopeHint =>
      'எல்லாப் பொருட்களுக்கும் இவற்றை காலியாக விடுங்கள்; இல்லையெனில் இவற்றில் ஏதேனும் ஒன்றுடன் பொருந்தும் பொருள் சேரும்.';

  @override
  String get schemesBrands => 'பிராண்டுகள்';

  @override
  String get schemesCategories => 'வகைகள்';

  @override
  String get schemesStyles => 'ஸ்டைல்கள்';

  @override
  String get schemesItems => 'பொருட்கள்';

  @override
  String get schemesCommaHint => 'காற்புள்ளியால் பிரிக்கவும்';

  @override
  String get schemesActive => 'இயக்கத்தில்';

  @override
  String get schemesKindsPercent => 'சதவீத தள்ளுபடி';

  @override
  String get schemesKindsAmountOff => 'தொகை தள்ளுபடி';

  @override
  String get schemesKindsQtySlab => 'அளவு படிநிலைகள்';

  @override
  String get schemesKindsValueSlab => 'மதிப்பு படிநிலைகள்';

  @override
  String get schemesKindsBuyGet => 'X வாங்கினால் Y';

  @override
  String get schemesKindsCombo => 'காம்போ அல்லது ஹேம்பர்';

  @override
  String get schemesKindHintPercent => 'ஒவ்வொரு பொருளுக்கும் அதே சதவீதம்';

  @override
  String get schemesKindHintAmountOff =>
      'நிலையான தொகை, மதிப்பின்படி பிரிக்கப்படும்';

  @override
  String get schemesKindHintQtySlab => 'அதிக துண்டுகள், அதிக சதவீதம்';

  @override
  String get schemesKindHintValueSlab => 'பெரிய பில், அதிக சதவீதம்';

  @override
  String get schemesKindHintBuyGet =>
      'ஒவ்வொரு குழுவிலும் மலிவானவை இலவசம் அல்லது தள்ளுபடி';

  @override
  String get schemesKindHintCombo => 'ஒரே விலையில் பொருட்களின் தொகுப்பு';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% தள்ளுபடி';
  }

  @override
  String schemesSumMin(String amount) {
    return '$amount அல்லது அதற்கு மேல்';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount தள்ளுபடி';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ துண்டு $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return '$buy வாங்கினால் $get இலவசம்';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return '$buy வாங்கினால் $get க்கு $pct% தள்ளுபடி';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$n பொருட்கள் $priceக்கு';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'இந்த வகை திட்டத்துக்குத் தேவையானதை நிரப்புங்கள்.';

  @override
  String get schemesErrorsSchemeNameTaken =>
      'இந்தப் பெயரில் ஒரு திட்டம் ஏற்கனவே உள்ளது.';

  @override
  String get schemesErrorsEndsBeforeStart =>
      'முடிவுத் தேதி தொடக்கத் தேதிக்கு முன் உள்ளது.';

  @override
  String get schemesErrorsDuplicateSlab =>
      'இரண்டு படிநிலைகள் ஒரே இடத்தில் தொடங்குகின்றன.';

  @override
  String get schemesErrorsUnknownItem =>
      'உங்கள் பட்டியலிலிருந்து பொருட்களைத் தேர்வுசெய்யவும்.';

  @override
  String get schemesErrorsUnknownStyle =>
      'உங்கள் பட்டியலிலிருந்து ஸ்டைல்களைத் தேர்வுசெய்யவும்.';

  @override
  String get schemesErrorsSlabs => 'படிநிலைகளை இப்படி எழுதுங்கள்: 3:10, 5:20.';

  @override
  String get schemesErrorsNumber =>
      'தொகைகளும் சதவீதங்களும் எண்களாக இருக்க வேண்டும்.';

  @override
  String get interestTitle => 'நிலுவை மீதான வட்டி';

  @override
  String get interestSubtitle =>
      'ஒவ்வொரு பில்லுக்கும் கெடு தேதிக்குப் பிந்தைய நாட்களுக்கான தனி வட்டி, வாடிக்கையாளரின் விகிதத்தில்.';

  @override
  String get interestPartyRates =>
      'வட்டி விகிதம் அமைக்கப்பட்ட வாடிக்கையாளர்கள்.';

  @override
  String interestUsingRate(String rate) {
    return 'சொந்த விகிதம் இல்லாதவர்கள் $rate% இல் கணக்கிடப்படுவர்.';
  }

  @override
  String get interestPartyRatesOnly => 'விகிதம் உள்ள வாடிக்கையாளர்கள் மட்டும்';

  @override
  String interestTryRate(String rate) {
    return 'அனைவரையும் $rate% இல் கணக்கிடு';
  }

  @override
  String get interestRate => 'விகிதம்';

  @override
  String get interestOverdue => 'நிலுவை';

  @override
  String get interestInterest => 'வட்டி';

  @override
  String interestDueOn(String date) {
    return 'கெடு $date';
  }

  @override
  String get interestNone => 'வட்டி விதிக்க நிலுவைப் பில்கள் இல்லை.';

  @override
  String get interestGstNote =>
      'தாமதக் கட்டணத்திற்கான வட்டி வழங்கல் மதிப்பின் பகுதி (CGST சட்டம் பிரிவு 15(2)(d)); பொருளின் விகிதத்தில் GST உடன் பில் செய்யவும்.';

  @override
  String get integrityTitle => 'ஒருமைப்பாட்டுச் சோதனை';

  @override
  String get integritySubtitle =>
      'உங்கள் கணக்குகள் தமக்குள் ஒத்துப்போகின்றனவா? ஒவ்வொரு சோதனையும் பொருந்த வேண்டிய இரண்டை ஒப்பிட்டு, வேறுபாட்டை அதன் பதிவுகளுடன் காட்டுகிறது.';

  @override
  String get integrityAllGood =>
      'அனைத்துச் சோதனைகளும் தேர்ச்சி. உங்கள் கணக்குகள் தமக்குள் ஒத்துப்போகின்றன.';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n சோதனைகளுக்குக் கவனம் தேவை',
      one: '$n சோதனைக்குக் கவனம் தேவை',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'தேர்ச்சி';

  @override
  String get integrityFail => 'வேறுபாடு';

  @override
  String get integrityWarn => 'இதைப் பாருங்கள்';

  @override
  String get integrityRecords => 'பதிவுகள்';

  @override
  String get integrityFirstTwenty => 'முதல் 20 காட்டப்பட்டுள்ளன.';

  @override
  String get integrityVouchersBalanceTitle =>
      'ஒவ்வொரு வவுச்சரும் சமநிலையில் உள்ளது';

  @override
  String get integrityVouchersBalanceHelp =>
      'ஒவ்வொரு வவுச்சரிலும் பற்றும் வரவும் சமம். இல்லாதவை இங்கே காட்டப்படும்.';

  @override
  String get integrityTrialBalanceTitle => 'சோதனை இருப்பு சமநிலையில் உள்ளது';

  @override
  String get integrityTrialBalanceHelp =>
      'தொடக்க இருப்பும் ஒவ்வொரு பதிவும் சேர்ந்து பூஜ்யமாக இருக்க வேண்டும். வேறுபாடு பொதுவாக, உரிமையாளர் மூலதனம் போன்ற மறுபக்கம் இல்லாமல் தொடக்க இருப்பு பதிவிட்டதால் வரும்.';

  @override
  String get integrityInvoicesMatchLedgerTitle =>
      'விற்பனை பில்கள் பேரேட்டுடன் பொருந்துகின்றன';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'ஒவ்வொரு பதிவான பில்லும் அதன் மொத்தத்தை வாடிக்கையாளர் கணக்கில் சேர்த்தது.';

  @override
  String get integrityBillsMatchLedgerTitle =>
      'கொள்முதல் பில்கள் பேரேட்டுடன் பொருந்துகின்றன';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'ரிவர்ஸ் சார்ஜ் தவிர ஒவ்வொரு பதிவான பில்லும் மொத்தத்தை சப்ளையர் கணக்கில் சேர்த்தது.';

  @override
  String get integrityDocumentsPostedTitle =>
      'பதிவான ஆவணங்களுக்குப் பேரேட்டுப் பதிவுகள் உள்ளன';

  @override
  String get integrityDocumentsPostedHelp =>
      'பின்னால் வவுச்சர் இல்லாத பதிவான பில் இங்கே காட்டப்படும்.';

  @override
  String get integrityCancelledReversedTitle =>
      'ரத்தான வவுச்சர்களின் நிகரம் பூஜ்யம்';

  @override
  String get integrityCancelledReversedHelp =>
      'வவுச்சரை ரத்து செய்தால் அது தொட்ட ஒவ்வொரு கணக்கிற்கும் எதிர்ப் பதிவு இருக்க வேண்டும்.';

  @override
  String get integrityReceivablesMatchTitle =>
      'வாடிக்கையாளர்களிடமிருந்து வர வேண்டியது பேரேட்டுடன் பொருந்துகிறது';

  @override
  String get integrityReceivablesMatchHelp =>
      'நிலுவைப் பட்டியலின் கூட்டுத்தொகை வாடிக்கையாளர் பேரேட்டு இருப்புகளுக்குச் சமம்.';

  @override
  String get integrityPayablesMatchTitle =>
      'சப்ளையர்களுக்குத் தர வேண்டியது பேரேட்டுடன் பொருந்துகிறது';

  @override
  String get integrityPayablesMatchHelp =>
      'நிலுவைப் பட்டியலின் கூட்டுத்தொகை சப்ளையர் பேரேட்டு இருப்புகளுக்குச் சமம்.';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'பரிசு வவுச்சர் பொறுப்பு செலவழிக்காத வவுச்சர்களுடன் பொருந்துகிறது';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'பரிசு வவுச்சர் பேரேட்டுக் கணக்கு செயலில் உள்ள வவுச்சர்களில் மீதமுள்ளதற்குச் சமம்.';

  @override
  String get integrityNegativeStockTitle =>
      'எந்த இருப்பும் பூஜ்யத்திற்குக் கீழ் இல்லை';

  @override
  String get integrityNegativeStockHelp =>
      'பேரேட்டில் காட்டப்படும் இருப்பை விட அதிகமாக விற்கப்பட்ட அல்லது வழங்கப்பட்ட பொருட்கள். இது உண்மையான நேர இடைவெளியாக இருக்கலாம்; விடுபட்ட வரவைப் பதிவிடுங்கள்.';

  @override
  String get sensitiveTitle => 'முக்கிய மாற்றங்கள்';

  @override
  String get sensitiveSubtitle =>
      'பணத்தை நகர்த்தவோ கதவைத் திறக்கவோ கூடிய மாற்றங்கள்: வங்கி விவரங்கள், கடன் விதிமுறைகள், வரி அமைப்புகள், யாருக்கு என்ன உரிமை, கால பூட்டுகள், சம்பள அமைப்புகள். புதியது முதலில்.';

  @override
  String get sensitiveKindBank => 'வங்கி விவரங்கள்';

  @override
  String get sensitiveKindCredit => 'கடன் விதிமுறைகள்';

  @override
  String get sensitiveKindTax => 'வரி மற்றும் நிறுவன அமைப்புகள்';

  @override
  String get sensitiveKindPermissions => 'யாருக்கு என்ன உரிமை';

  @override
  String get sensitiveKindPeriod => 'கால பூட்டுகள் மற்றும் எண்ணிடல்';

  @override
  String get sensitiveKindPayroll => 'சம்பள அமைப்புகள்';

  @override
  String get sensitiveKindOverride => 'கடன் வரம்பு மீறல்';

  @override
  String get sensitiveKindDevice => 'சாதனங்கள்';

  @override
  String get sensitiveAll => 'அனைத்து வகைகள்';

  @override
  String get sensitiveNone => 'இந்தக் காலத்தில் முக்கிய மாற்றங்கள் இல்லை.';

  @override
  String get sensitiveShow => 'காட்டு';

  @override
  String get cfoTitle => 'உரிமையாளர் பார்வை';

  @override
  String get cfoSubtitle =>
      'விற்பனை முதல் லாபம் வரை, இந்தக் காலம், கடந்த ஆண்டின் அதே காலத்துடன். உங்கள் கணக்கில் வருமான வரி பதிவாகாவிட்டால் வரிக்கு முன்னும் பின்னும் லாபம் ஒன்றாகவே இருக்கும்.';

  @override
  String get cfoThisPeriod => 'இந்தக் காலம்';

  @override
  String get cfoLastYear => 'கடந்த ஆண்டின் அதே காலம்';

  @override
  String get cfoGrowth => 'வளர்ச்சி';

  @override
  String get cfoRevenue => 'வருவாய்';

  @override
  String get cfoCostOfGoods => 'விற்ற பொருட்களின் செலவு';

  @override
  String get cfoGrossProfit => 'மொத்த லாபம்';

  @override
  String get cfoGrossMargin => 'மொத்த மார்ஜின்';

  @override
  String get cfoOperatingExpenses => 'இயக்கச் செலவுகள்';

  @override
  String get cfoOtherIncome => 'பிற வருமானம்';

  @override
  String get cfoDepreciation => 'தேய்மானம்';

  @override
  String get cfoEbitda => 'EBITDA (தேய்மானத்திற்கு முன் லாபம்)';

  @override
  String get cfoNetProfit => 'நிகர லாபம்';

  @override
  String get cfoMonthly => 'மாதவாரி மொத்த மார்ஜின்';

  @override
  String get lrTitle => 'எல்ஆர் மற்றும் போக்குவரத்துப் பதிவு';

  @override
  String get lrSubtitle =>
      'போக்குவரத்து நிறுவனம் வழியாக அனுப்பிய பொருட்கள்: எல்ஆர் எண், பில், சரக்குக் கட்டணம், வாடிக்கையாளரைச் சென்றடைந்ததா.';

  @override
  String get lrTransporter => 'போக்குவரத்து நிறுவனம்';

  @override
  String get lrLrNumber => 'எல்ஆர் எண்';

  @override
  String get lrInvoice => 'பில்';

  @override
  String get lrNoInvoice => 'பில் இல்லை';

  @override
  String get lrDestination => 'சேருமிடம்';

  @override
  String get lrPackages => 'பொதிகள்';

  @override
  String get lrWeight => 'எடை (கிலோ)';

  @override
  String get lrFreight => 'சரக்குக் கட்டணம்';

  @override
  String get lrFreightBy => 'சரக்குக் கட்டணத்தை யார் செலுத்துவார்';

  @override
  String get lrPaid => 'நாங்கள் செலுத்தினோம்';

  @override
  String get lrToPay => 'வாடிக்கையாளர் செலுத்துவார்';

  @override
  String get lrAdd => 'அனுப்பிய பொருளைச் சேர்';

  @override
  String get lrStatus => 'நிலை';

  @override
  String get lrAllStatuses => 'அனைத்து நிலைகள்';

  @override
  String get lrStatusesBooked => 'பதிவு செய்தது';

  @override
  String get lrStatusesInTransit => 'வழியில்';

  @override
  String get lrStatusesDelivered => 'சென்றடைந்தது';

  @override
  String lrDeliveredOn(String date) {
    return '$date அன்று சென்றடைந்தது';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'அனுப்பி $n நாட்கள்',
      one: 'அனுப்பி $n நாள்',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty =>
      'இன்னும் எதுவும் அனுப்பப்படவில்லை. மேலே முதலாவதைச் சேர்க்கவும்.';

  @override
  String get lrErrorsLrTaken =>
      'இந்த போக்குவரத்து நிறுவனத்தின் இந்த எல்ஆர் எண் ஏற்கனவே பதிவாகியுள்ளது.';

  @override
  String get lrErrorsUnknownInvoice => 'அந்த பில் கிடைக்கவில்லை.';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'சென்றடைந்த தேதி அனுப்பிய தேதிக்கு முன் உள்ளது.';

  @override
  String get hsnTitle => 'எச்எஸ்என் மற்றும் எஸ்ஏசி குறியீடுகள்';

  @override
  String get hsnSubtitle =>
      'உங்கள் வணிகம் பயன்படுத்தும் குறியீடுகள், எளிய விளக்கத்துடன். பொருள் மற்றும் ஸ்டைல் படிவங்கள் இந்தப் பட்டியலிலிருந்து பரிந்துரைக்கும். இங்குள்ள விகிதம் வசதிக்காக மட்டுமே: ஆடை மற்றும் காலணிக்கு விலை அடுக்கு அடிப்படையில் வரி.';

  @override
  String get hsnCode => 'குறியீடு';

  @override
  String get hsnDescription => 'விளக்கம்';

  @override
  String get hsnKind => 'வகை';

  @override
  String get hsnGoods => 'பொருட்கள் (எச்எஸ்என்)';

  @override
  String get hsnService => 'சேவை (எஸ்ஏசி)';

  @override
  String get hsnRate => 'விகிதம்';

  @override
  String get hsnAddStandard => 'நிலையான ஆடைக் குறியீடுகளைச் சேர்';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n குறியீடுகள் சேர்க்கப்பட்டன. ஏற்கனவே இருந்தவை மாற்றப்படவில்லை.',
      one: '$n குறியீடு சேர்க்கப்பட்டது. ஏற்கனவே இருந்தவை மாற்றப்படவில்லை.',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'காப்பகப்படுத்தியவற்றைக் காட்டு';

  @override
  String get hsnEmpty =>
      'இன்னும் குறியீடுகள் இல்லை. மேலே சேர்க்கவும், அல்லது நிலையான ஆடைக் குறியீடுகளைச் சேர்க்கவும்.';

  @override
  String get hsnErrorsHsnTaken => 'இந்தக் குறியீடு ஏற்கனவே பட்டியலில் உள்ளது.';

  @override
  String get hsnErrorsInvalidHsn =>
      'எச்எஸ்என் குறியீட்டில் 4, 6 அல்லது 8 இலக்கங்கள் இருக்கும் (எஸ்ஏசியில் 6).';

  @override
  String get notesTitle => 'என் குறிப்புகள்';

  @override
  String get notesPrivate => 'இவற்றை நீங்கள் மட்டுமே பார்க்க முடியும்.';

  @override
  String get notesNone =>
      'எதுவும் குறிக்கப்படவில்லை. கீழே நினைவூட்டலை எழுதுங்கள்.';

  @override
  String get notesPlaceholder => 'குறிப்பு அல்லது நினைவூட்டலை எழுதுங்கள்';

  @override
  String get notesRemindOn => 'இந்த நாளில் நினைவூட்டு';

  @override
  String get notesAdd => 'சேர்';

  @override
  String get notesToday => 'இன்று';

  @override
  String notesOverdue(String date) {
    return '$date அன்று இருந்தது';
  }

  @override
  String notesMarkDone(String note) {
    return 'முடிந்தது: $note';
  }

  @override
  String get notesRemove => 'குறிப்பை நீக்கு';

  @override
  String get movementTitle => 'வேகமாகவும் மெதுவாகவும் விற்கும் பொருட்கள்';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'கடந்த $days நாட்களில் விற்றது. வேகம் என்றால் $fastMin அல்லது அதற்கு மேல்; மெதுவு என்றால் சிலது விற்றது ஆனால் அதைவிடக் குறைவு; நகராதது என்றால் எதுவும் இல்லை. நகராதவை முதலில்.';
  }

  @override
  String get movementWindow => 'பின்னோக்கிப் பார்';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n நாட்கள்',
      one: '$n நாள்',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'வேகத்தின் எல்லை (எண்ணிக்கை)';

  @override
  String get movementIncludeFabric => 'துணி மற்றும் டிரிம்களையும் சேர்';

  @override
  String get movementClassFast => 'வேகம்';

  @override
  String get movementClassSlow => 'மெதுவு';

  @override
  String get movementClassNone => 'நகராதது';

  @override
  String movementItems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n பொருட்கள்',
      one: '$n பொருள்',
    );
    return '$_temp0';
  }

  @override
  String movementPiecesInStock(String n) {
    return 'இருப்பில் $n எண்ணிக்கை';
  }

  @override
  String get movementItem => 'பொருள்';

  @override
  String get movementStatus => 'இயக்கம்';

  @override
  String movementSold(String days) {
    return '$days நாட்களில் விற்றது';
  }

  @override
  String get movementInStock => 'இருப்பில்';

  @override
  String get movementStockValue => 'இருப்பு மதிப்பு';

  @override
  String get movementLastSold => 'கடைசி விற்பனை';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n நாட்கள் முன்பு',
      one: '$n நாள் முன்பு',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'இதுவரை இல்லை';

  @override
  String get movementEmpty => 'காட்ட இருப்பு இல்லை.';

  @override
  String get movementFirstRows => 'முதல் 500 பொருட்கள் காட்டப்பட்டுள்ளன.';

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
