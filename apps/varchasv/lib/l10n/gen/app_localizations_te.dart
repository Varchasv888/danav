// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Telugu (`te`).
class AppLocalizationsTe extends AppLocalizations {
  AppLocalizationsTe([String locale = 'te']) : super(locale);

  @override
  String get brandName => 'Varchasv';

  @override
  String get brandFull => 'Varchasv ERP Systems';

  @override
  String get brandTagline =>
      'లెక్కలు, జీఎస్టీ, స్టాక్, జీతాలు, ఆన్‌లైన్‌లో, ఆఫ్‌లైన్‌లో, మీ భాషలో.';

  @override
  String get commonSave => 'సేవ్ చేయండి';

  @override
  String get commonSaving => 'సేవ్ అవుతోంది…';

  @override
  String get commonSaved => 'సేవ్ అయింది';

  @override
  String get commonCancel => 'రద్దు చేయండి';

  @override
  String get commonEdit => 'సవరించండి';

  @override
  String get commonAdd => 'జోడించండి';

  @override
  String get commonClose => 'మూసివేయండి';

  @override
  String get commonLoading => 'లోడ్ అవుతోంది…';

  @override
  String get commonOptional => 'ఐచ్ఛికం';

  @override
  String get commonLanguage => 'భాష';

  @override
  String get commonTheme => 'థీమ్';

  @override
  String get commonLight => 'లైట్';

  @override
  String get commonDark => 'డార్క్';

  @override
  String get commonSystem => 'సిస్టమ్';

  @override
  String commonComingSoon(String phase) {
    return 'దశ $phaseలో వస్తోంది';
  }

  @override
  String get commonNone => 'ఏదీ లేదు';

  @override
  String get commonYes => 'అవును';

  @override
  String get commonNo => 'కాదు';

  @override
  String get commonSearch => 'వెతకండి';

  @override
  String get commonAll => 'అన్నీ';

  @override
  String get commonFrom => 'నుండి';

  @override
  String get commonTo => 'వరకు';

  @override
  String get commonAsOf => 'తేదీ నాటికి';

  @override
  String get commonTotal => 'మొత్తం';

  @override
  String get commonDebit => 'డెబిట్';

  @override
  String get commonCredit => 'క్రెడిట్';

  @override
  String get commonBalance => 'బ్యాలెన్స్';

  @override
  String get commonDate => 'తేదీ';

  @override
  String get commonNarration => 'వివరణ';

  @override
  String get commonActions => 'చర్యలు';

  @override
  String get commonBack => 'వెనక్కి';

  @override
  String get commonApply => 'చూపించండి';

  @override
  String get commonRemove => 'తీసివేయండి';

  @override
  String get commonCopy => 'కాపీ';

  @override
  String get commonCopied => 'కాపీ అయింది';

  @override
  String get commonDr => 'డె';

  @override
  String get commonCr => 'క్రె';

  @override
  String get commonView => 'చూడండి';

  @override
  String get commonArchived => 'ఆర్కైవ్';

  @override
  String get commonPrint => 'ప్రింట్';

  @override
  String commonListCapped(String count) {
    return 'తాజా $count పత్రాలు చూపబడుతున్నాయి. పాతవి చూడటానికి తేదీలను ఎంచుకోండి.';
  }

  @override
  String get authLoginTitle => 'మీ వ్యాపారంలోకి సైన్ ఇన్ చేయండి';

  @override
  String get authLoginSubtitle => 'తిరిగి స్వాగతం.';

  @override
  String get authSignupTitle => 'Varchasvలో మీ వ్యాపారాన్ని ప్రారంభించండి';

  @override
  String get authSignupSubtitle =>
      '₹40 లక్షల లోపు టర్నోవర్ ఉన్న వ్యాపారాలకు ఉచితం. కార్డు అవసరం లేదు.';

  @override
  String get authEmail => 'ఈమెయిల్';

  @override
  String get authPassword => 'పాస్‌వర్డ్';

  @override
  String get authPasswordHint => 'కనీసం 8 అక్షరాలు';

  @override
  String get authName => 'మీ పేరు';

  @override
  String get authBusinessName => 'వ్యాపారం పేరు';

  @override
  String get authState => 'రాష్ట్రం';

  @override
  String get authGstin => 'జీఎస్టీఐఎన్';

  @override
  String get authGstinHint => 'జీఎస్టీ నమోదు లేకపోతే ఖాళీగా ఉంచండి';

  @override
  String get authIndustry => 'వ్యాపార రకం';

  @override
  String get authLogin => 'సైన్ ఇన్';

  @override
  String get authSignup => 'ఖాతా సృష్టించండి';

  @override
  String get authLogout => 'సైన్ అవుట్';

  @override
  String get authNoAccount => 'Varchasvకి కొత్తా?';

  @override
  String get authHaveAccount => 'ఇప్పటికే ఖాతా ఉందా?';

  @override
  String get authCreateOne => 'ఖాతా సృష్టించండి';

  @override
  String get authSignInInstead => 'సైన్ ఇన్';

  @override
  String get authErrorsInvalidCredentials =>
      'ఈ ఈమెయిల్, పాస్‌వర్డ్ సరిపోలడం లేదు.';

  @override
  String get authErrorsEmailTaken => 'ఈ ఈమెయిల్‌తో ఇప్పటికే ఖాతా ఉంది.';

  @override
  String get authErrorsGstinLength => 'జీఎస్టీఐఎన్‌లో 15 అక్షరాలు ఉంటాయి.';

  @override
  String get authErrorsGstinFormat => 'ఇది జీఎస్టీఐఎన్‌లా కనిపించడం లేదు.';

  @override
  String get authErrorsGstinState =>
      'జీఎస్టీఐఎన్ తెలియని రాష్ట్ర కోడ్‌తో మొదలవుతోంది.';

  @override
  String get authErrorsGstinChecksum =>
      'ఈ జీఎస్టీఐఎన్‌లో టైపింగ్ పొరపాటు ఉంది: చివరి అక్షరం సరిపోలడం లేదు.';

  @override
  String get authErrorsGstinStateMismatch =>
      'ఈ జీఎస్టీఐఎన్ ఎంచుకున్న రాష్ట్రానిది కాదు.';

  @override
  String get authErrorsValidation => 'గుర్తించిన ఫీల్డ్‌లను తనిఖీ చేయండి.';

  @override
  String get authErrorsGeneric => 'ఏదో పొరపాటు జరిగింది. మళ్లీ ప్రయత్నించండి.';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'ఈ లింక్ గడువు ముగిసింది లేదా ఇప్పటికే ఉపయోగించబడింది. కొత్త లింక్ అడగండి.';

  @override
  String get authErrorsWrongPassword => 'మీ ప్రస్తుత పాస్‌వర్డ్ తప్పు.';

  @override
  String get authErrorsPasswordsDiffer => 'రెండు పాస్‌వర్డ్‌లు సరిపోలలేదు.';

  @override
  String get authErrorsNeedsChangeDate =>
      'పత్రానికి వెనుక తేదీ వేసే హక్కు మీకు లేదు. నేటి తేదీ వాడండి, లేదా యజమానిని హక్కు అడగండి.';

  @override
  String get authErrorsNeedsFutureDate =>
      'పత్రానికి ముందు తేదీ వేసే హక్కు మీకు లేదు. నేటి తేదీ వాడండి, లేదా యజమానిని హక్కు అడగండి.';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'ఒక వరుస ధర ఖరీదు కంటే తక్కువ. ఖరీదు కంటే తక్కువకు అమ్మే హక్కు మీకు లేదు; ధర పెంచండి లేదా యజమానిని అడగండి.';

  @override
  String get authForgotLink => 'పాస్‌వర్డ్ మర్చిపోయారా?';

  @override
  String get authForgotTitle => 'మీ పాస్‌వర్డ్‌ను రీసెట్ చేయండి';

  @override
  String get authForgotSubtitle =>
      'మీ ఖాతా ఇమెయిల్‌ను నమోదు చేయండి, కొత్త పాస్‌వర్డ్ ఎంచుకోవడానికి మేము లింక్ పంపుతాము.';

  @override
  String get authSendLink => 'రీసెట్ లింక్ పంపండి';

  @override
  String authForgotSent(String email) {
    return '$email కోసం ఖాతా ఉంటే, రీసెట్ లింక్ పంపబడుతోంది. ఇది ఒక్కసారే పనిచేస్తుంది, ఒక గంటలో గడువు ముగుస్తుంది.';
  }

  @override
  String get authBackToLogin => 'సైన్ ఇన్‌కు తిరిగి వెళ్ళండి';

  @override
  String get authResetTitle => 'కొత్త పాస్‌వర్డ్ ఎంచుకోండి';

  @override
  String get authNewPassword => 'కొత్త పాస్‌వర్డ్';

  @override
  String get authConfirmPassword => 'కొత్త పాస్‌వర్డ్‌ను మళ్ళీ నమోదు చేయండి';

  @override
  String get authSetPassword => 'పాస్‌వర్డ్ సెట్ చేయండి';

  @override
  String get authResetDone =>
      'మీ పాస్‌వర్డ్ మార్చబడింది, అన్ని చోట్ల నుండి మీరు సైన్ అవుట్ అయ్యారు. కొత్త పాస్‌వర్డ్‌తో సైన్ ఇన్ చేయండి.';

  @override
  String get shellGoTo => 'వెళ్ళండి…';

  @override
  String get shellGoToPlaceholder =>
      'ఒక స్క్రీన్ తెరవండి లేదా కొత్త ఎంట్రీ ప్రారంభించండి';

  @override
  String shellNoMatch(String query) {
    return '“$query”కి ఏదీ సరిపోలలేదు.';
  }

  @override
  String get shellTallyKeys =>
      'టెక్స్ట్ ఫీల్డ్ బయట ఎక్కడైనా టాలీ కీలు పనిచేస్తాయి: F4 కాంట్రా, F5 చెల్లింపు, F6 రసీదు, F7 జర్నల్, F8 అమ్మకం, F9 కొనుగోలు.';

  @override
  String get shellCreate => 'కొత్తది';

  @override
  String get shellEntries => 'కొత్త ఎంట్రీ';

  @override
  String get shellScreens => 'స్క్రీన్లు';

  @override
  String get shellMenu => 'మెనూ';

  @override
  String shellFy(String years) {
    return 'ఆర్థిక సంవత్సరం $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type వోచర్';
  }

  @override
  String get shellFold => 'మెనూ కుదించండి';

  @override
  String get shellUnfold => 'మెనూ తెరవండి';

  @override
  String get accountTitle => 'నా ఖాతా';

  @override
  String get accountSubtitle =>
      'మీ పేరు మరియు పాస్‌వర్డ్, మీరు చేరిన ప్రతి వ్యాపారానికి ఉపయోగించబడతాయి.';

  @override
  String get accountProfile => 'ప్రొఫైల్';

  @override
  String get accountSave => 'సేవ్ చేయండి';

  @override
  String get accountSaved => 'సేవ్ అయింది';

  @override
  String get accountPasswordTitle => 'పాస్‌వర్డ్ మార్చండి';

  @override
  String get accountCurrentPassword => 'ప్రస్తుత పాస్‌వర్డ్';

  @override
  String get accountPasswordChanged =>
      'పాస్‌వర్డ్ మార్చబడింది. మీ ఇతర పరికరాలు సైన్ అవుట్ చేయబడ్డాయి.';

  @override
  String get industryApparel => 'దుస్తులు మరియు వస్త్రాలు';

  @override
  String get industryGeneral => 'సాధారణం';

  @override
  String get industryTrading => 'వ్యాపారం / పంపిణీ';

  @override
  String get industryManufacturing => 'తయారీ';

  @override
  String get industryRetail => 'రిటైల్ దుకాణం';

  @override
  String get industryServices => 'సేవలు';

  @override
  String get navDashboard => 'డాష్‌బోర్డ్';

  @override
  String get navSales => 'అమ్మకాలు';

  @override
  String get navPurchase => 'కొనుగోళ్లు';

  @override
  String get navInventory => 'సరుకు';

  @override
  String get navAccounts => 'ఖాతాలు';

  @override
  String get navGst => 'జీఎస్టీ';

  @override
  String get navHr => 'హెచ్‌ఆర్ & జీతాలు';

  @override
  String get navReports => 'నివేదికలు';

  @override
  String get navSettings => 'సెట్టింగ్‌లు';

  @override
  String get navCompany => 'కంపెనీ & శాఖలు';

  @override
  String get navNumberSeries => 'నంబర్ సిరీస్';

  @override
  String get navAuditLog => 'ఆడిట్ ట్రైల్';

  @override
  String get navTools => 'సాధనాలు';

  @override
  String get navTeam => 'బృందం & పాత్రలు';

  @override
  String get navChart => 'ఖాతాల జాబితా';

  @override
  String get navVouchers => 'వోచర్లు మరియు కూపన్లు';

  @override
  String get navTrialBalance => 'ట్రయల్ బ్యాలెన్స్';

  @override
  String get navProfitLoss => 'లాభనష్టాలు';

  @override
  String get navBalanceSheet => 'బ్యాలెన్స్ షీట్';

  @override
  String get navFinancialYears => 'ఆర్థిక సంవత్సరాలు';

  @override
  String get navItems => 'వస్తువులు';

  @override
  String get navStock => 'స్టాక్ సారాంశం';

  @override
  String get navStockJournals => 'స్టాక్ జర్నల్స్';

  @override
  String get navReorder => 'రీఆర్డర్';

  @override
  String get navPurchaseOrders => 'కొనుగోలు ఆర్డర్లు';

  @override
  String get navGoodsReceipts => 'ఇన్‌వర్డ్ చలాన్';

  @override
  String get navPurchaseBills => 'కొనుగోలు బిల్లులు';

  @override
  String get navPurchaseReturns => 'కొనుగోలు వాపసులు';

  @override
  String get navSalesOrders => 'అమ్మకపు ఆర్డర్లు';

  @override
  String get navDeliveryNotes => 'డెలివరీ చలాన్లు';

  @override
  String get navSalesInvoices => 'అమ్మకపు ఇన్‌వాయిస్‌లు';

  @override
  String get navCreditNotes => 'క్రెడిట్ నోట్లు';

  @override
  String get navReceivables => 'రావలసినవి';

  @override
  String get navPayables => 'చెల్లించవలసినవి';

  @override
  String get navGstReturns => 'జీఎస్టీ రిటర్న్‌లు';

  @override
  String get navGstSettings => 'జీఎస్టీ & ఇన్‌వాయిసింగ్';

  @override
  String get navImport => 'డేటా దిగుమతి';

  @override
  String get navQuotations => 'కొటేషన్లు';

  @override
  String get navEmployees => 'ఉద్యోగులు';

  @override
  String get navAttendance => 'హాజరు';

  @override
  String get navLeave => 'సెలవు';

  @override
  String get navPayroll => 'పేరోల్';

  @override
  String get navPayrollSettings => 'పేరోల్';

  @override
  String get navStatutory => 'చట్టబద్ధ & టీడీఎస్';

  @override
  String get navManufacturing => 'తయారీ';

  @override
  String get navBoms => 'మెటీరియల్ జాబితా (BOM)';

  @override
  String get navProduction => 'ఉత్పత్తి ఆర్డర్లు';

  @override
  String get navMrp => 'మెటీరియల్ ప్రణాళిక';

  @override
  String get navJobWork => 'జాబ్ వర్క్';

  @override
  String get navPos => 'పాయింట్ ఆఫ్ సేల్';

  @override
  String get navPosBilling => 'బిల్లింగ్';

  @override
  String get navPosBills => 'బిల్లులు';

  @override
  String get navPosSettings => 'కౌంటర్ సెట్టింగ్‌లు';

  @override
  String get navBanking => 'బ్యాంకింగ్';

  @override
  String get navBankAccounts => 'బ్యాంక్ సరిపోల్చడం';

  @override
  String get navBankRules => 'బ్యాంక్ నియమాలు';

  @override
  String get navSettlements => 'గేట్‌వే సెటిల్‌మెంట్లు';

  @override
  String get navAssets => 'స్థిర ఆస్తులు';

  @override
  String get navAssetRegister => 'ఆస్తుల రిజిస్టర్';

  @override
  String get navDepreciation => 'తరుగుదల';

  @override
  String get navItDepreciation => 'ఆదాయపు పన్ను తరుగుదల';

  @override
  String get navExpenses => 'ఖర్చులు';

  @override
  String get navExpenseClaims => 'ఖర్చుల క్లెయిమ్‌లు';

  @override
  String get navExpenseCategories => 'ఖర్చుల వర్గాలు';

  @override
  String get navProjects => 'ప్రాజెక్టులు';

  @override
  String get navProjectList => 'ప్రాజెక్టులు';

  @override
  String get navTimesheets => 'టైమ్‌షీట్లు';

  @override
  String get navAssistant => 'సహాయకుడు';

  @override
  String get navCrm => 'సీఆర్‌ఎం';

  @override
  String get navLeads => 'లీడ్లు';

  @override
  String get navFollowUps => 'ఫాలో-అప్‌లు';

  @override
  String get navMessageTemplates => 'సందేశ టెంప్లేట్లు';

  @override
  String get navReportBuilder => 'నివేదిక బిల్డర్';

  @override
  String get navSavedReports => 'సేవ్ చేసిన నివేదికలు';

  @override
  String get navChecks => 'తనిఖీలు';

  @override
  String get navStyles => 'స్టైల్స్';

  @override
  String get navProformas => 'ప్రొఫార్మా ఇన్‌వాయిస్';

  @override
  String get navApprovals => 'ఆమోదానికి పంపిన సరుకు';

  @override
  String get navPriceLists => 'ధరల జాబితా';

  @override
  String get navInterest => 'బకాయిపై వడ్డీ';

  @override
  String get navAgents => 'ఏజెంట్ కమిషన్';

  @override
  String get navTargets => 'సేల్స్‌మెన్ లక్ష్యాలు';

  @override
  String get navSchemes => 'స్కీమ్‌లు మరియు ఆఫర్లు';

  @override
  String get navPosReturns => 'రిటర్న్‌లు మరియు మార్పిడి';

  @override
  String get navAlterations => 'ఆల్టరేషన్';

  @override
  String get navTailoring => 'కుట్టు పని';

  @override
  String get navConsignment => 'కన్సైన్‌మెంట్';

  @override
  String get navCatalogue => 'చిత్ర కేటలాగ్';

  @override
  String get navInsights => 'వ్యాపార విశ్లేషణ';

  @override
  String get navSalesRegister => 'అమ్మకాల రిజిస్టర్';

  @override
  String get navColourSize => 'రంగు-సైజు నివేదిక';

  @override
  String get navStockAgeing => 'స్టాక్ వయసు';

  @override
  String get navLabels => 'బార్‌కోడ్ లేబుల్స్';

  @override
  String get navMessageLog => 'వాట్సాప్ లాగ్';

  @override
  String get navMyMenu => 'నా మెనూ';

  @override
  String get navAllActions => 'అన్ని పనులు';

  @override
  String get navStockCounts => 'స్టాక్ లెక్కింపు';

  @override
  String get navWorkspace => 'పని స్థలం';

  @override
  String get navSalesPos => 'అమ్మకాలు, కౌంటర్';

  @override
  String get navPromotions => 'ఆఫర్లు, ధరలు';

  @override
  String get navFinance => 'ఖాతాలు, బ్యాంకింగ్';

  @override
  String get navOperations => 'ఖర్చులు, ప్రాజెక్టులు, ఆస్తులు';

  @override
  String get navMasters => 'మాస్టర్లు';

  @override
  String get navReportsHub => 'అన్ని రిపోర్టులు';

  @override
  String get navMastersHub => 'అన్ని మాస్టర్లు';

  @override
  String get navSizesColours => 'సైజులు, రంగులు';

  @override
  String get navBandWorkspace => 'పని స్థలం';

  @override
  String get navBandCommerce => 'అమ్మకం';

  @override
  String get navBandSupply => 'కొనుగోలు, స్టాక్';

  @override
  String get navBandProduction => 'ఉత్పత్తి, నిర్వహణ';

  @override
  String get navBandMoney => 'డబ్బు, సిబ్బంది';

  @override
  String get navBandInsight => 'రిపోర్టులు';

  @override
  String get navBandAdmin => 'సెటప్';

  @override
  String get navIntegrity => 'సమగ్రత తనిఖీ';

  @override
  String get navCfoView => 'యజమాని వీక్షణ';

  @override
  String get navStockMovement => 'వేగంగా మరియు నెమ్మదిగా అమ్ముడయ్యేవి';

  @override
  String dashboardGreeting(String name) {
    return 'నమస్తే, $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return 'ఈరోజు $business ఎక్కడ ఉందో చూడండి.';
  }

  @override
  String get dashboardSetupTitle => 'సెటప్ పూర్తి చేయండి';

  @override
  String get dashboardSetupCompany => 'కంపెనీ వివరాలు, పాన్ జోడించండి';

  @override
  String get dashboardSetupBranch => 'ప్రతి శాఖకు జీఎస్టీఐఎన్ జోడించండి';

  @override
  String get dashboardSetupSeries =>
      'మీ ఇన్‌వాయిస్ నంబర్ సిరీస్‌ను తనిఖీ చేయండి';

  @override
  String get dashboardRoadmapTitle => 'ఏమి వస్తోంది';

  @override
  String get dashboardCalcTitle => 'త్వరిత జీఎస్టీ కాలిక్యులేటర్';

  @override
  String get dashboardCalcSubtitle =>
      'సరఫరా స్థలం ఆధారంగా CGST/SGST లేదా IGST లెక్కిస్తుంది.';

  @override
  String get dashboardKSalesToday => 'ఈరోజు అమ్మకాలు';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'నిన్న $amount';
  }

  @override
  String get dashboardKSalesMonth => 'ఈ నెల అమ్మకాలు';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'గత నెల ఇవే రోజుల వరకు $amount';
  }

  @override
  String get dashboardKReceivables => 'రావలసినవి';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount గడువు దాటింది';
  }

  @override
  String get dashboardKPayables => 'చెల్లించవలసినవి';

  @override
  String dashboardKDueSoon(String amount) {
    return '7 రోజుల్లో $amount చెల్లించాలి';
  }

  @override
  String get dashboardKProfit => 'ఈ నెల లాభం';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'స్థూల లాభం $amount';
  }

  @override
  String get dashboardKStockValue => 'స్టాక్ విలువ';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count వస్తువులు',
      one: '$count వస్తువు',
    );
    return '$_temp0 రీఆర్డర్ స్థాయి కంటే తక్కువ';
  }

  @override
  String get dashboardKPipeline => 'అమ్మకాల పైప్‌లైన్';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$count తెరిచిన లీడ్లు · వెయిటెడ్ $amount';
  }

  @override
  String get dashboardKApprovals => 'మీ కోసం ఎదురుచూస్తున్నవి';

  @override
  String get dashboardKClaims => 'ఖర్చుల క్లెయిమ్‌లు';

  @override
  String get dashboardKTimesheets => 'టైమ్‌షీట్లు';

  @override
  String get dashboardKLeave => 'సెలవు అభ్యర్థనలు';

  @override
  String get dashboardKNothingWaiting => 'ఏదీ ఎదురుచూడటం లేదు.';

  @override
  String get dashboardKSalesTrend => 'అమ్మకాలు, గత 30 రోజులు';

  @override
  String get dashboardKCashBank => 'నగదు & బ్యాంక్';

  @override
  String get dashboardKTopCustomers => 'ఈ నెల ప్రధాన కస్టమర్లు';

  @override
  String get dashboardKTopItems => 'ఈ నెల ఎక్కువగా అమ్ముడైనవి';

  @override
  String get dashboardKTopDebtors => 'వసూలు చేయాల్సిన పెద్ద మొత్తాలు';

  @override
  String get dashboardKAlerts => 'దృష్టి పెట్టాల్సినవి';

  @override
  String get dashboardKNoAlerts => 'అంతా బాగుంది.';

  @override
  String get dashboardKAsk => 'సహాయకుడిని అడగండి';

  @override
  String dashboardKYesterday(String amount) {
    return 'నిన్న $amount';
  }

  @override
  String get dashboardPosition => 'డబ్బు స్థితి';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ఖాతాలు',
      one: '$count ఖాతా',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'వ్యాపార విశ్లేషణ';

  @override
  String get insightsSubtitle =>
      'ఏ కాలానికైనా అమ్మకాలు, లాభం, స్టాక్, డబ్బు, గత సంవత్సరం అదే కాలంతో పోలిక.';

  @override
  String get insightsNoLastYear => 'ఈ సంవత్సరం కొత్తది';

  @override
  String get insightsPts => 'పాయింట్లు';

  @override
  String get insightsVsLastYear => 'గత సంవత్సరంతో';

  @override
  String get insightsNoSales => 'ఈ కాలంలో అమ్మకాలు లేవు.';

  @override
  String get insightsHideTable => 'పట్టిక దాచండి';

  @override
  String get insightsShowTable => 'పట్టికగా చూపండి';

  @override
  String get insightsPresetsThisMonth => 'ఈ నెల';

  @override
  String get insightsPresetsLastMonth => 'గత నెల';

  @override
  String get insightsPresetsThisFy => 'ఈ ఆర్థిక సంవత్సరం';

  @override
  String get insightsPresetsLastFy => 'గత ఆర్థిక సంవత్సరం';

  @override
  String get insightsPresetsLast12 => 'గత 12 నెలలు';

  @override
  String get insightsFrom => 'నుండి';

  @override
  String get insightsTo => 'వరకు';

  @override
  String get insightsApply => 'చూపండి';

  @override
  String insightsCompared(String from, String to) {
    return 'మార్పులు $from నుండి $to తో పోలిస్తే.';
  }

  @override
  String get insightsKpiSales => 'అమ్మకాలు';

  @override
  String get insightsKpiPieces => 'అమ్మిన ముక్కలు';

  @override
  String get insightsKpiAvgBill => 'సగటు బిల్లు';

  @override
  String get insightsKpiProfit => 'మార్జిన్';

  @override
  String get insightsKpiPurchases => 'కొనుగోళ్లు';

  @override
  String get insightsKpiStock => 'ప్రస్తుత స్టాక్';

  @override
  String get insightsKpiReceivable => 'వసూలు చేయాలి';

  @override
  String get insightsKpiPayable => 'చెల్లించాలి';

  @override
  String get insightsBeforeTax => 'GST ముందు, రిటర్న్‌లు తీసేసి';

  @override
  String insightsBillsCount(String n) {
    return 'బిల్లులు: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return 'ముక్కకు $v';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n ముక్కలు';
  }

  @override
  String get insightsOwedToUs => 'కస్టమర్ల నుండి';

  @override
  String get insightsWeOwe => 'సరఫరాదారులకు';

  @override
  String get insightsTrend => 'అమ్మకాల ధోరణి';

  @override
  String get insightsByMonth => 'నెలవారీ, GST ముందు';

  @override
  String get insightsByDay => 'రోజువారీ, GST ముందు';

  @override
  String get insightsWeekday => 'రద్దీ రోజులు';

  @override
  String get insightsWeekdaySub => 'వారంలో రోజు వారీ అమ్మకాలు';

  @override
  String get insightsDaysD1 => 'సోమ';

  @override
  String get insightsDaysD2 => 'మంగళ';

  @override
  String get insightsDaysD3 => 'బుధ';

  @override
  String get insightsDaysD4 => 'గురు';

  @override
  String get insightsDaysD5 => 'శుక్ర';

  @override
  String get insightsDaysD6 => 'శని';

  @override
  String get insightsDaysD7 => 'ఆది';

  @override
  String get insightsDesigns => 'ఉత్తమ డిజైన్లు';

  @override
  String get insightsByValue => 'అమ్మకం విలువ ప్రకారం';

  @override
  String get insightsSalesmen => 'ఉత్తమ సేల్స్‌మెన్';

  @override
  String get insightsSalesmenSub => 'వారు అమ్మిన కౌంటర్ లైన్లు, ఇన్వాయిస్‌లు';

  @override
  String get insightsNoSalesmen => 'ఇంకా ఏ అమ్మకంలోనూ సేల్స్‌మెన్ లేరు.';

  @override
  String get insightsCustomers => 'ప్రధాన కస్టమర్లు';

  @override
  String get insightsCustomersSub => 'ఇన్వాయిస్ కస్టమర్లు, రిటర్న్‌లు తీసేసి';

  @override
  String get insightsBrands => 'బ్రాండ్లు';

  @override
  String get insightsTenders => 'కస్టమర్లు ఎలా చెల్లించారు';

  @override
  String get insightsTendersSub =>
      'GST తో: కౌంటర్ చెల్లింపులు, ఖాతా ఇన్వాయిస్‌లు';

  @override
  String get insightsModesCash => 'నగదు';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'కార్డ్';

  @override
  String get insightsModesCredit => 'కౌంటర్ ఖాతా';

  @override
  String get insightsModesInvoice => 'ఇన్వాయిస్‌లు';

  @override
  String get insightsAgeing => 'అమ్మకాల వయసు';

  @override
  String get insightsAgeingSub => 'అమ్ముడుపోయే ముందు సరుకు ఎంతకాలం ఉంది';

  @override
  String get insightsAge => 'వయసు';

  @override
  String get insightsPieces => 'ముక్కలు';

  @override
  String get insightsValue => 'విలువ';

  @override
  String get insightsAgesD030 => '0 నుండి 30 రోజులు';

  @override
  String get insightsAgesD3160 => '31 నుండి 60 రోజులు';

  @override
  String get insightsAgesD6190 => '61 నుండి 90 రోజులు';

  @override
  String get insightsAgesD91180 => '91 నుండి 180 రోజులు';

  @override
  String get insightsAgesD181365 => '6 నుండి 12 నెలలు';

  @override
  String get insightsAgesY12 => '1 నుండి 2 సంవత్సరాలు';

  @override
  String get insightsAgesY2plus => '2 సంవత్సరాలకు పైగా';

  @override
  String get insightsErrorsInvalidPeriod => 'ప్రారంభ తేదీ ముగింపు తర్వాత ఉంది.';

  @override
  String insightsOnCost(String v) {
    return 'ప్రామాణిక ఖర్చు కంటే $v ఎక్కువ';
  }

  @override
  String get calcFrom => 'సరఫరాదారు రాష్ట్రం';

  @override
  String get calcTo => 'సరఫరా స్థలం';

  @override
  String get calcQty => 'పరిమాణం';

  @override
  String get calcRate => 'ధర (₹)';

  @override
  String get calcGstRate => 'జీఎస్టీ %';

  @override
  String get calcTaxable => 'పన్ను విధించదగిన విలువ';

  @override
  String get calcCgst => 'CGST';

  @override
  String get calcSgst => 'SGST';

  @override
  String get calcUtgst => 'UTGST';

  @override
  String get calcIgst => 'IGST';

  @override
  String get calcRoundOff => 'రౌండ్ ఆఫ్';

  @override
  String get calcTotal => 'మొత్తం';

  @override
  String get calcInWords => 'అక్షరాల్లో';

  @override
  String get calcCess => 'సెస్';

  @override
  String get companyTitle => 'కంపెనీ & శాఖలు';

  @override
  String get companySubtitle =>
      'చట్టపరమైన వివరాలు, ప్రతి జీఎస్టీఐఎన్ లేదా స్థలానికి ఒక శాఖ.';

  @override
  String get companyName => 'ప్రదర్శన పేరు';

  @override
  String get companyLegalName => 'చట్టపరమైన పేరు';

  @override
  String get companyPan => 'పాన్';

  @override
  String get companyBooksBegin => 'ఖాతాలు ప్రారంభ తేదీ';

  @override
  String get companyBranches => 'శాఖలు';

  @override
  String get companyAddBranch => 'శాఖ జోడించండి';

  @override
  String get companyBranchName => 'శాఖ పేరు';

  @override
  String get companyHeadOffice => 'ప్రధాన కార్యాలయం';

  @override
  String get companyUnregistered => 'నమోదు కాలేదు';

  @override
  String get companyCity => 'నగరం';

  @override
  String get companyPincode => 'పిన్ కోడ్';

  @override
  String get seriesTitle => 'నంబర్ సిరీస్';

  @override
  String get seriesSubtitle =>
      'ఇన్‌వాయిస్‌లు, వోచర్లకు నంబర్లు ఎలా ఇస్తారు. జీఎస్టీ గరిష్టంగా 16 అక్షరాలను అనుమతిస్తుంది: అక్షరాలు, అంకెలు, - మరియు /.';

  @override
  String get seriesDocType => 'పత్రం';

  @override
  String get seriesPattern => 'నమూనా';

  @override
  String get seriesNext => 'తదుపరి నంబర్';

  @override
  String get seriesFy => 'ఆర్థిక సంవత్సరం';

  @override
  String get seriesTokens =>
      'టోకెన్లు: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = పరికర కోడ్ (ఆఫ్‌లైన్ యాప్)';

  @override
  String get seriesTypesSalesInvoice => 'అమ్మకపు ఇన్‌వాయిస్';

  @override
  String get seriesTypesCreditNote => 'క్రెడిట్ నోట్';

  @override
  String get seriesTypesDebitNote => 'డెబిట్ నోట్';

  @override
  String get seriesTypesPurchaseBill => 'కొనుగోలు బిల్లు';

  @override
  String get seriesTypesReceipt => 'రసీదు';

  @override
  String get seriesTypesPayment => 'చెల్లింపు';

  @override
  String get seriesTypesJournal => 'జర్నల్ వోచర్';

  @override
  String get seriesErrorsSeriesTooLong =>
      'ఈ నమూనా నంబర్లు 16 అక్షరాలను మించిపోతాయి.';

  @override
  String get seriesErrorsSeriesBadChars =>
      'అక్షరాలు, అంకెలు, - మరియు / మాత్రమే అనుమతించబడతాయి.';

  @override
  String get seriesErrorsSeriesEmpty => 'నమూనాలో SEQ టోకెన్ ఉండాలి.';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'తదుపరి నంబర్ ఇప్పటికే ఇచ్చిన నంబర్ల కంటే తక్కువ ఉండకూడదు.';

  @override
  String get auditTitle => 'ఆడిట్ ట్రైల్';

  @override
  String get auditSubtitle =>
      'ప్రతి మార్పు, ఎవరు చేశారు, ఎప్పుడు. ఎంట్రీలను సవరించడం లేదా తొలగించడం కుదరదు.';

  @override
  String get auditWhen => 'ఎప్పుడు';

  @override
  String get auditWho => 'ఎవరు';

  @override
  String get auditWhat => 'ఏమిటి';

  @override
  String get auditDetails => 'వివరాలు';

  @override
  String get auditLoadMore => 'పాత ఎంట్రీలను లోడ్ చేయండి';

  @override
  String get auditActionsCreate => 'సృష్టించారు';

  @override
  String get auditActionsUpdate => 'మార్చారు';

  @override
  String get auditActionsLogin => 'సైన్ ఇన్ అయ్యారు';

  @override
  String get auditActionsDelete => 'తొలగించారు';

  @override
  String get auditActionsCancel => 'రద్దు చేశారు';

  @override
  String get auditVerify => 'ఆడిట్ ట్రైల్ తనిఖీ చేయి';

  @override
  String get auditVerifying => 'తనిఖీ చేస్తోంది...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other:
          'మొత్తం $n ఎంట్రీలు భద్రంగా ఉన్నాయి. ఏదీ మార్చబడలేదు లేదా తొలగించబడలేదు.',
      one: 'మొత్తం $n ఎంట్రీ భద్రంగా ఉంది. ఏదీ మార్చబడలేదు లేదా తొలగించబడలేదు.',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'ఎంట్రీ సంఖ్య $seq ముందు ఎంట్రీలతో సరిపోలడం లేదు ($reason). ఆడిట్ ట్రైల్ మార్చబడింది లేదా దెబ్బతింది. ఒక కాపీ ఉంచుకుని సహాయాన్ని సంప్రదించండి.';
  }

  @override
  String get auditReasonGap => 'ఒక ఎంట్రీ లేదు';

  @override
  String get auditReasonLink => 'క్రమం విరిగింది';

  @override
  String get auditReasonContent => 'ఎంట్రీ మార్చబడింది';

  @override
  String get auditVerifyFailed => 'తనిఖీ చేయలేకపోయింది. మళ్లీ ప్రయత్నించండి.';

  @override
  String get backupTitle => 'బ్యాకప్ మరియు ఎగుమతి';

  @override
  String get backupSubtitle =>
      'మీ డేటా మీదే. ఎప్పుడైనా మొత్తం డౌన్‌లోడ్ చేసుకోండి, Varchasv లేకుండానే తెరిచే ఫైళ్లలో.';

  @override
  String get backupDownload => 'అన్నీ డౌన్‌లోడ్ చేయి (ZIP)';

  @override
  String get backupWhat => 'మీకు ఏమి లభిస్తుంది';

  @override
  String get backupItem1 =>
      'ప్రతి పట్టిక Excel కోసం CSV ఫైల్‌గా, ఖచ్చితమైన విలువలతో JSON ఫైల్‌గా.';

  @override
  String get backupItem2 => 'మీరు అప్‌లోడ్ చేసిన ప్రతి పత్రం యథాతథంగా.';

  @override
  String get backupItem3 =>
      'ప్రతి పట్టికను వివరించే README, మరియు ఏదీ మారలేదని తర్వాత చూపడానికి చెక్‌సమ్‌ల జాబితా.';

  @override
  String get backupLeftOut =>
      'పాస్‌వర్డ్‌లు, లాగిన్ టోకెన్లు, పన్ను-పోర్టల్ సెషన్లు చేర్చబడలేదు.';

  @override
  String get backupKeep =>
      'ఫైల్‌ను సురక్షితమైన చోట ఉంచండి. అందులో మీ కస్టమర్లు, సరఫరాదారులు, ధరలు, ఖాతాలు ఉన్నాయి.';

  @override
  String get backupSlow =>
      'పెద్ద వ్యాపారానికి సిద్ధం కావడానికి ఒక నిమిషం పట్టవచ్చు.';

  @override
  String get backupAuditLink =>
      'మీ ఆడిట్ ట్రైల్ చెక్కుచెదరకుండా ఉందా తనిఖీ చేయండి';

  @override
  String get roadmapAccounts => 'లెక్కలు & జీఎస్టీ దాఖలు';

  @override
  String get roadmapInventory => 'సరుకు & కొనుగోళ్లు';

  @override
  String get roadmapSales => 'అమ్మకాలు, ఇ-ఇన్‌వాయిస్ & ఇ-వే బిల్లు';

  @override
  String get roadmapOffline =>
      'Windows, Mac, Linux, Android & iOS కోసం ఆఫ్‌లైన్ యాప్';

  @override
  String get roadmapPayroll => 'హెచ్‌ఆర్ & జీతాలు';

  @override
  String get switcherTitle => 'మీ వ్యాపారాలు';

  @override
  String get switcherAddBusiness => 'వ్యాపారం జోడించండి';

  @override
  String get switcherCreate => 'వ్యాపారం సృష్టించండి';

  @override
  String get teamTitle => 'బృందం & పాత్రలు';

  @override
  String get teamSubtitle =>
      'ఈ వ్యాపారాన్ని ఎవరు ఉపయోగించవచ్చు, ప్రతి ఒక్కరూ ఏమి చేయవచ్చు.';

  @override
  String get teamMembers => 'సభ్యులు';

  @override
  String get teamInvite => 'ఆహ్వానించండి';

  @override
  String get teamInviteTitle => 'ఎవరినైనా ఆహ్వానించండి';

  @override
  String get teamEmail => 'ఈమెయిల్';

  @override
  String get teamRole => 'పాత్ర';

  @override
  String get teamStatus => 'స్థితి';

  @override
  String get teamActive => 'క్రియాశీలం';

  @override
  String get teamSuspended => 'నిలిపివేయబడింది';

  @override
  String get teamYou => 'మీరు';

  @override
  String get teamPendingInvites => 'పెండింగ్ ఆహ్వానాలు';

  @override
  String get teamExpires => 'గడువు';

  @override
  String get teamRevoke => 'ఉపసంహరించండి';

  @override
  String get teamSuspend => 'నిలిపివేయండి';

  @override
  String get teamReactivate => 'మళ్లీ క్రియాశీలం చేయండి';

  @override
  String get teamRemove => 'తీసివేయండి';

  @override
  String get teamInviteLink => 'ఆహ్వాన లింక్';

  @override
  String get teamInviteLinkHint =>
      'మేము ఈమెయిల్ పంపాము. WhatsAppలో కూడా పంచుకోవచ్చు: ఇది ఒకసారి మాత్రమే పనిచేస్తుంది, 7 రోజుల్లో గడువు ముగుస్తుంది.';

  @override
  String get teamRoles => 'పాత్రలు';

  @override
  String get teamNewRole => 'కొత్త పాత్ర';

  @override
  String get teamRoleName => 'పాత్ర పేరు';

  @override
  String get teamPermissions => 'అనుమతులు';

  @override
  String get teamSystemRole => 'అంతర్నిర్మితం';

  @override
  String teamMembersCount(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count సభ్యులు',
      one: '$count సభ్యుడు',
    );
    return '$_temp0';
  }

  @override
  String get teamModulesCompany => 'కంపెనీ';

  @override
  String get teamModulesUsers => 'బృందం';

  @override
  String get teamModulesAccounts => 'ఖాతాలు';

  @override
  String get teamModulesSales => 'అమ్మకాలు';

  @override
  String get teamModulesPurchase => 'కొనుగోళ్లు';

  @override
  String get teamModulesInventory => 'సరుకు';

  @override
  String get teamModulesGst => 'జీఎస్టీ';

  @override
  String get teamModulesHr => 'హెచ్‌ఆర్';

  @override
  String get teamModulesPayroll => 'పేరోల్';

  @override
  String get teamModulesReports => 'నివేదికలు';

  @override
  String get teamModulesSettings => 'సెట్టింగ్‌లు';

  @override
  String get teamModulesBanking => 'బ్యాంకింగ్';

  @override
  String get teamModulesAssets => 'స్థిర ఆస్తులు';

  @override
  String get teamModulesExpenses => 'ఖర్చులు';

  @override
  String get teamModulesProjects => 'ప్రాజెక్టులు';

  @override
  String get teamModulesCrm => 'సీఆర్‌ఎం';

  @override
  String get teamPermView => 'చూడటం';

  @override
  String get teamPermCreate => 'సృష్టించడం';

  @override
  String get teamPermEdit => 'సవరించడం';

  @override
  String get teamPermSubmit => 'సమర్పించడం';

  @override
  String get teamPermCancel => 'రద్దు చేయడం';

  @override
  String get teamPermDelete => 'తొలగించడం';

  @override
  String get teamPermExport => 'ఎగుమతి';

  @override
  String get teamPermApprove => 'ఆమోదం';

  @override
  String get teamErrorsCannotChangeSelf => 'మీ స్వంత యాక్సెస్‌ను మార్చలేరు.';

  @override
  String get teamErrorsLastOwner =>
      'వ్యాపారానికి కనీసం ఒక క్రియాశీల యజమాని ఉండాలి.';

  @override
  String get teamErrorsOwnerOnly => 'యజమాని మాత్రమే దీన్ని చేయగలరు.';

  @override
  String get teamErrorsAlreadyMember => 'ఈ వ్యక్తి ఇప్పటికే సభ్యుడు.';

  @override
  String get teamErrorsPermissionEscalation => 'మీకు లేని అనుమతులను ఇవ్వలేరు.';

  @override
  String get teamErrorsSystemRole => 'అంతర్నిర్మిత పాత్రలను మార్చలేరు.';

  @override
  String get teamErrorsRoleInUse =>
      'ఈ పాత్రను తొలగించే ముందు సభ్యులను వేరే పాత్రకు మార్చండి.';

  @override
  String get teamErrorsUnknownRole => 'ఆ పాత్ర ఇక లేదు.';

  @override
  String get teamSpecialTitle => 'ప్రత్యేక హక్కులు';

  @override
  String get teamSpecialHelp =>
      'పై పట్టికకు అదనంగా ఒక్కొక్క హక్కు. ఎవరైనా బిల్లులు వేయవచ్చు కానీ వెనుక తేదీ వేయడం లేదా ఖరీదు కంటే తక్కువకు అమ్మడం చేయలేరు.';

  @override
  String get teamSpecialChangeDate => 'పత్రాలకు వెనుక తేదీ వేయడం';

  @override
  String get teamSpecialFutureDate => 'పత్రాలకు ముందు తేదీ వేయడం';

  @override
  String get teamSpecialSellBelowCost => 'ఖరీదు కంటే తక్కువకు అమ్మడం';

  @override
  String get teamSpecialSeeAgentCommission => 'ఏజెంట్ కమిషన్ చూడటం';

  @override
  String get teamSpecialImportData => 'డేటా దిగుమతి';

  @override
  String inviteTitle(String business) {
    return '$businessలో చేరండి';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$emailని $roleగా ఆహ్వానించారు.';
  }

  @override
  String get inviteCreateAccount => 'అంగీకరించడానికి మీ ఖాతాను సృష్టించండి.';

  @override
  String get inviteSignInToAccept =>
      'అంగీకరించడానికి మీ Varchasv పాస్‌వర్డ్ నమోదు చేయండి.';

  @override
  String get inviteAccept => 'ఆహ్వానాన్ని అంగీకరించండి';

  @override
  String get inviteInvalid =>
      'ఈ ఆహ్వాన లింక్ చెల్లదు, ఇప్పటికే ఉపయోగించబడింది లేదా గడువు ముగిసింది. కొత్తది అడగండి.';

  @override
  String get accountsTitle => 'ఖాతాల జాబితా';

  @override
  String get accountsSubtitle =>
      'మీ అకౌంటెంట్ ఆశించిన విధంగా సమూహపరచిన లెడ్జర్లు. కస్టమర్లు Sundry Debtors కింద, సరఫరాదారులు Sundry Creditors కింద.';

  @override
  String get accountsNewAccount => 'కొత్త ఖాతా';

  @override
  String get accountsName => 'ఖాతా పేరు';

  @override
  String get accountsNameHi => 'హిందీలో పేరు';

  @override
  String get accountsGroup => 'సమూహం';

  @override
  String get accountsBalance => 'బ్యాలెన్స్';

  @override
  String get accountsOpeningBalance => 'ప్రారంభ బ్యాలెన్స్';

  @override
  String get accountsOpeningHint =>
      'డెబిట్‌కు ధనాత్మకం (నగదు, బ్యాంక్, రుణగ్రహీతలు); క్రెడిట్‌కు రుణాత్మకం (మూలధనం, రుణాలు, రుణదాతలు).';

  @override
  String get accountsCode => 'కోడ్';

  @override
  String get accountsParty => 'పార్టీ వివరాలు';

  @override
  String get accountsPhone => 'ఫోన్';

  @override
  String get accountsIfsc => 'IFSC';

  @override
  String get accountsAccountNumber => 'ఖాతా నంబర్';

  @override
  String get accountsAllGroups => 'అన్ని సమూహాలు';

  @override
  String get accountsEmpty => 'సరిపోలే ఖాతాలు లేవు.';

  @override
  String get accountsErrorsAccountNameTaken => 'ఈ పేరుతో ఇప్పటికే ఖాతా ఉంది.';

  @override
  String get accountsErrorsUnknownGroup => 'సమూహాన్ని ఎంచుకోండి.';

  @override
  String get accountsErrorsInvalidIfsc => 'IFSC ఇలా ఉంటుంది: HDFC0001234.';

  @override
  String get accountsErrorsInvalidPan => 'పాన్ ఇలా ఉంటుంది: ABCDE1234F.';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'అంతర్నిర్మిత ఖాతాలు తమ సమూహంలోనే ఉంటాయి.';

  @override
  String get accountsErrorsNotAnAgent =>
      'బ్రోకర్ లేదా ఏజెంట్‌గా గుర్తించిన ఖాతాను ఎంచుకోండి.';

  @override
  String get accountsErrorsUnknownSalesman =>
      'మీ ఉద్యోగుల నుండి సేల్స్‌మెన్‌ను ఎంచుకోండి.';

  @override
  String get accountsCreditLimit => 'అప్పు పరిమితి (₹)';

  @override
  String get accountsCreditDays => 'అప్పు రోజులు';

  @override
  String get accountsCreditControl => 'పరిమితి దాటినా లేదా బకాయి ఉన్నా';

  @override
  String get accountsCreditControlHint =>
      'బ్లాక్ చేస్తే యజమాని లేదా అడ్మిన్ అనుమతించే వరకు కొత్త అమ్మకాలు ఆగుతాయి.';

  @override
  String get accountsCreditWarn => 'హెచ్చరించి అనుమతించు';

  @override
  String get accountsCreditBlock => 'బ్లాక్';

  @override
  String get accountsBlockOverdueDays => 'అనుమతించిన బకాయి రోజులు';

  @override
  String get accountsInterestRate => 'బకాయిపై వడ్డీ (సంవత్సరానికి %)';

  @override
  String get vouchersTitle => 'వోచర్లు';

  @override
  String get vouchersSubtitle =>
      'మీ ఖాతాల్లోని ప్రతి ఎంట్రీ. పోస్ట్ చేసిన వోచర్లు ఎప్పుడూ సవరించబడవు: రద్దు చేసి మళ్లీ నమోదు చేయండి.';

  @override
  String get vouchersNew => 'కొత్త వోచర్';

  @override
  String get vouchersTypesJournal => 'జర్నల్';

  @override
  String get vouchersTypesPayment => 'చెల్లింపు';

  @override
  String get vouchersTypesReceipt => 'రసీదు';

  @override
  String get vouchersTypesContra => 'కాంట్రా';

  @override
  String get vouchersTypesPurchase => 'కొనుగోలు';

  @override
  String get vouchersTypesDebitNote => 'డెబిట్ నోట్';

  @override
  String get vouchersTypesSales => 'అమ్మకం';

  @override
  String get vouchersTypesCreditNote => 'క్రెడిట్ నోట్';

  @override
  String get vouchersTypesGatewaySettlement => 'గేట్‌వే సెటిల్‌మెంట్';

  @override
  String get vouchersTypesAssetPurchase => 'ఆస్తి కొనుగోలు';

  @override
  String get vouchersTypesDepreciation => 'తరుగుదల';

  @override
  String get vouchersTypesAssetDisposal => 'ఆస్తి అమ్మకం';

  @override
  String get vouchersTypesExpenseClaim => 'ఖర్చు క్లెయిమ్';

  @override
  String get vouchersTypesBrokerage => 'బ్రోకరేజ్ బిల్';

  @override
  String get vouchersTypeHintsJournal =>
      'సర్దుబాట్లు, అప్పుపై అమ్మకాలు & కొనుగోళ్లు, కేటాయింపులు.';

  @override
  String get vouchersTypeHintsPayment =>
      'నగదు లేదా బ్యాంక్ నుండి బయటకు వెళ్లే డబ్బు.';

  @override
  String get vouchersTypeHintsReceipt => 'నగదు లేదా బ్యాంక్‌లోకి వచ్చే డబ్బు.';

  @override
  String get vouchersTypeHintsContra => 'నగదు, బ్యాంక్ ఖాతాల మధ్య మాత్రమే.';

  @override
  String get vouchersNumber => 'నంబర్';

  @override
  String get vouchersReference => 'సూచన';

  @override
  String get vouchersAccount => 'ఖాతా';

  @override
  String get vouchersAccounts => 'ఖాతాలు';

  @override
  String get vouchersAmount => 'మొత్తం';

  @override
  String get vouchersAddLine => 'లైన్ జోడించండి';

  @override
  String get vouchersDifference => 'తేడా';

  @override
  String get vouchersPost => 'వోచర్ పోస్ట్ చేయండి';

  @override
  String get vouchersCancel => 'వోచర్ రద్దు చేయండి';

  @override
  String get vouchersCancelReason => 'రద్దు కారణం';

  @override
  String get vouchersCancelled => 'రద్దయింది';

  @override
  String get vouchersPosted => 'పోస్ట్ అయింది';

  @override
  String get vouchersStatus => 'స్థితి';

  @override
  String get vouchersEmpty => 'ఈ కాలంలో వోచర్లు లేవు.';

  @override
  String get vouchersChooseAccount => 'ఖాతా ఎంచుకోండి…';

  @override
  String get vouchersErrorsUnbalanced => 'డెబిట్లు, క్రెడిట్లు సమానంగా ఉండాలి.';

  @override
  String get vouchersErrorsTooFewLines => 'వోచర్‌కు కనీసం రెండు లైన్లు కావాలి.';

  @override
  String get vouchersErrorsZeroLine => 'ప్రతి లైన్‌కు మొత్తం కావాలి.';

  @override
  String get vouchersErrorsBothSides =>
      'ఒక లైన్ డెబిట్ లేదా క్రెడిట్ కావచ్చు, రెండూ కాదు.';

  @override
  String get vouchersErrorsNegativeAmount => 'మొత్తాలు రుణాత్మకంగా ఉండకూడదు.';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'చెల్లింపులో నగదు లేదా బ్యాంక్ ఖాతాకు క్రెడిట్ ఉండాలి.';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'రసీదులో నగదు లేదా బ్యాంక్ ఖాతాకు డెబిట్ ఉండాలి.';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'కాంట్రా వోచర్‌లో నగదు, బ్యాంక్ ఖాతాలు మాత్రమే.';

  @override
  String get vouchersErrorsPeriodLocked => 'ఈ తేదీ లాక్ చేసిన కాలంలో ఉంది.';

  @override
  String get vouchersErrorsPeriodClosed => 'ఈ ఆర్థిక సంవత్సరం ముగిసింది.';

  @override
  String get vouchersErrorsBeforeBooksBegin =>
      'ఈ తేదీ ఖాతాలు ప్రారంభానికి ముందుది.';

  @override
  String get vouchersErrorsAlreadyCancelled => 'ఈ వోచర్ ఇప్పటికే రద్దయింది.';

  @override
  String get vouchersErrorsUnknownAccount => 'ఒక ఖాతా ఇక లేదు.';

  @override
  String get vouchersErrorsAccountArchived => 'ఒక ఖాతా ఆర్కైవ్ చేయబడింది.';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account సున్నా కంటే తక్కువకు వెళ్తుంది: $amount. అయినా పోస్ట్ చేయవచ్చు.';
  }

  @override
  String get promosTitle => 'వోచర్లు మరియు కూపన్లు';

  @override
  String get promosSubtitle =>
      'కౌంటర్ కోసం గిఫ్ట్ వోచర్లు, కూపన్ కోడ్‌లు, డిస్కౌంట్ కార్డులు, లక్కీ డ్రా.';

  @override
  String get promosStatusesActive => 'యాక్టివ్';

  @override
  String get promosStatusesUsed => 'పూర్తిగా వాడారు';

  @override
  String get promosStatusesExpired => 'గడువు ముగిసింది';

  @override
  String get promosGiftTitle => 'గిఫ్ట్ వోచర్లు';

  @override
  String promosGiftHint(String amount) {
    return 'యాక్టివ్ వోచర్లపై ఇంకా $amount బకాయి. GST వోచర్ అమ్మినప్పుడు కాదు, దానితో సరుకు కొన్నప్పుడు వర్తిస్తుంది.';
  }

  @override
  String get promosGiftCode => 'కోడ్';

  @override
  String get promosGiftFor => 'ఎవరికి';

  @override
  String get promosGiftValue => 'విలువ (₹)';

  @override
  String get promosGiftBalance => 'బ్యాలెన్స్';

  @override
  String get promosGiftExpires => 'గడువు తేదీ';

  @override
  String get promosGiftEmpty => 'ఇంకా గిఫ్ట్ వోచర్లు అమ్మలేదు.';

  @override
  String get promosGiftCount => 'ఎన్ని';

  @override
  String get promosGiftPaidBy => 'చెల్లింపు విధానం';

  @override
  String get promosGiftSell => 'వోచర్లు అమ్మండి';

  @override
  String get promosGiftIssued => 'అమ్మబడ్డాయి. కోడ్‌లు:';

  @override
  String get promosGiftExpire => 'గడువు ముగిసిన వోచర్లను తిరిగి రాయండి';

  @override
  String get promosGiftExpireHint =>
      'తేదీ దాటిన వోచర్లలో మిగిలినది ఆదాయం అవుతుంది.';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$n వోచర్ల గడువు ముగిసింది, $amount తిరిగి రాశారు.';
  }

  @override
  String get promosCouponsTitle => 'కూపన్ కోడ్‌లు';

  @override
  String get promosCouponsNew => 'కొత్త కూపన్';

  @override
  String get promosCouponsCode => 'కోడ్';

  @override
  String get promosCouponsOff => 'తగ్గింపు';

  @override
  String get promosCouponsValid => 'చెల్లుబాటు';

  @override
  String get promosCouponsUsed => 'వాడకం';

  @override
  String get promosCouponsEmpty => 'ఇంకా కూపన్లు లేవు.';

  @override
  String promosCouponsUpTo(String amount) {
    return '$amount వరకు';
  }

  @override
  String get promosCouponsMaxDiscount => 'గరిష్ఠ తగ్గింపు (₹)';

  @override
  String get promosCouponsMinBill => 'కనీస బిల్ (₹)';

  @override
  String get promosCouponsMaxUses => 'ఎన్నిసార్లు';

  @override
  String get promosCouponsMaxUsesHint => 'ఖాళీ = పరిమితి లేదు';

  @override
  String get promosCardsTitle => 'డిస్కౌంట్ కార్డులు';

  @override
  String get promosCardsNew => 'కొత్త కార్డ్';

  @override
  String get promosCardsNumber => 'కార్డ్ నంబర్';

  @override
  String get promosCardsHolder => 'హోల్డర్';

  @override
  String get promosCardsValidUntil => 'చెల్లుబాటు వరకు';

  @override
  String get promosCardsEmpty => 'ఇంకా డిస్కౌంట్ కార్డులు లేవు.';

  @override
  String get promosDrawTitle => 'లక్కీ డ్రా';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from నుండి $to · $entries ఎంట్రీలు';
  }

  @override
  String get promosDrawEmpty => 'ఇంకా డ్రాలు లేవు.';

  @override
  String get promosDrawWinners => 'విజేతలు';

  @override
  String get promosDrawHint =>
      'ఈ కాలంలో కస్టమర్ మొబైల్ ఉన్న ప్రతి బిల్ ఒక ఎంట్రీ; ప్రతి మొబైల్ ఒక్కసారే గెలవగలదు.';

  @override
  String get promosDrawRun => 'విజేతలను ఎంచుకోండి';

  @override
  String get promosStatus => 'స్థితి';

  @override
  String get promosErrorsInvalidAmount => 'రూపాయల్లో మొత్తం నమోదు చేయండి.';

  @override
  String get promosErrorsInvalidPercent =>
      '0 నుండి 100 మధ్య శాతం నమోదు చేయండి.';

  @override
  String get promosErrorsCodeTaken => 'ఈ కోడ్ ఇప్పటికే వాడుకలో ఉంది.';

  @override
  String get promosErrorsExpiryBeforeIssue => 'గడువు తేదీ ఈరోజు తర్వాత ఉండాలి.';

  @override
  String get promosErrorsEndsBeforeStart =>
      'ముగింపు తేదీ ప్రారంభ తేదీకి ముందుంది.';

  @override
  String get promosErrorsNoEntries => 'ఆ కాలంలో కస్టమర్ మొబైల్ ఉన్న బిల్ లేదు.';

  @override
  String get promosErrorsInvalidCode => 'అక్షరాలు, అంకెలు, హైఫన్ మాత్రమే.';

  @override
  String get promosErrorsInvalidPhone => '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.';

  @override
  String get posReturnsTitle => 'రిటర్న్‌లు మరియు మార్పిడి';

  @override
  String get posReturnsSubtitle =>
      'బిల్‌పై సరుకు తిరిగి తీసుకోండి. సైజ్ లేదా రంగు మార్పుకు స్టోర్ క్రెడిట్ ఇచ్చి దానితో కొత్తది బిల్ చేయండి.';

  @override
  String get posReturnsReturn => 'రిటర్న్';

  @override
  String posReturnsSaved(String number) {
    return 'రిటర్న్ $number సేవ్ అయింది';
  }

  @override
  String get posReturnsCreditCode => 'స్టోర్ క్రెడిట్ కోడ్:';

  @override
  String get posReturnsExchangeNow => 'ఇప్పుడే మార్పిడి బిల్ చేయండి';

  @override
  String posReturnsRefunded(String mode) {
    return '$mode ద్వారా తిరిగి ఇచ్చారు.';
  }

  @override
  String posReturnsAgainst(String number) {
    return '$numberపై రిటర్న్';
  }

  @override
  String get posReturnsCanReturn => 'తిరిగి ఇవ్వవచ్చు';

  @override
  String get posReturnsQty => 'తిరిగి వచ్చే పరిమాణం';

  @override
  String get posReturnsReason => 'కారణం';

  @override
  String get posReturnsCondition => 'స్థితి';

  @override
  String get posReturnsCounter => 'కౌంటర్';

  @override
  String get posReturnsNoShift => 'ముందుగా కౌంటర్‌లో షిఫ్ట్ తెరవండి.';

  @override
  String get posReturnsGive => 'ఎలా తిరిగి ఇవ్వాలి';

  @override
  String get posReturnsVoucherHint =>
      'ఇప్పుడో తర్వాతో మార్పిడికి చెల్లించడానికి వోచర్ కోడ్';

  @override
  String get posReturnsStoreCredit => 'స్టోర్ క్రెడిట్ (మార్పిడి)';

  @override
  String posReturnsAbout(String amount) {
    return 'సుమారు $amount';
  }

  @override
  String get posReturnsTake => 'తిరిగి తీసుకోండి';

  @override
  String get posReturnsNumber => 'రిటర్న్';

  @override
  String get posReturnsBill => 'బిల్';

  @override
  String get posReturnsWhat => 'ఏమి తిరిగి వచ్చింది';

  @override
  String get posReturnsNone => 'ఈ రోజు రిటర్న్‌లు లేవు.';

  @override
  String get posReturnsByReason => 'కారణం వారీగా';

  @override
  String get posReturnsByCondition => 'స్థితి వారీగా';

  @override
  String get posReturnsBillNumber => 'బిల్ నంబర్';

  @override
  String get posReturnsFind => 'బిల్ వెతకండి';

  @override
  String get posReturnsNotFound => 'ఆ నంబర్‌తో బిల్ లేదు.';

  @override
  String get posReturnsDate => 'తేదీ';

  @override
  String get posReturnsShow => 'చూపించు';

  @override
  String get posReturnsReasonsSize => 'సైజ్';

  @override
  String get posReturnsReasonsColour => 'రంగు';

  @override
  String get posReturnsReasonsDefect => 'తయారీ లోపం';

  @override
  String get posReturnsReasonsDamaged => 'దెబ్బతిన్నది';

  @override
  String get posReturnsReasonsNotLiked => 'నచ్చలేదు';

  @override
  String get posReturnsReasonsOther => 'ఇతరం';

  @override
  String get posReturnsGradesA => 'A: కొత్తదానిలా, షెల్ఫ్‌కి తిరిగి';

  @override
  String get posReturnsGradesB => 'B: చిన్న లోపం, సెకండ్‌గా అమ్మండి';

  @override
  String get posReturnsGradesC => 'C: అమ్మలేము';

  @override
  String get posReturnsErrorsBillVoid =>
      'ఈ బిల్ రద్దయింది; దీనిపై రిటర్న్ కుదరదు.';

  @override
  String get posReturnsErrorsOverReturn => 'ఆ వరుసలో మిగిలిన దానికంటే ఎక్కువ.';

  @override
  String get posReturnsErrorsSessionNotOpen =>
      'ముందుగా ఈ కౌంటర్‌లో షిఫ్ట్ తెరవండి.';

  @override
  String get posReturnsErrorsDuplicateLine => 'ఒక వరుస రెండుసార్లు ఉంది.';

  @override
  String get alterationsTitle => 'ఆల్టరేషన్ మరియు రిపేర్';

  @override
  String get alterationsSubtitle =>
      'ఫిటింగ్ కోసం బట్టలు తీసుకుని, కారీగర్‌కు ఇచ్చి, చెప్పిన రోజున తిరిగి ఇవ్వండి.';

  @override
  String get alterationsNewSlip => 'కొత్త ఆల్టరేషన్ స్లిప్';

  @override
  String get alterationsSetUpFirst =>
      'స్లిప్‌లు తీసుకోవడానికి ముందుగా కింద ఆల్టరేషన్ రకాలను జోడించండి.';

  @override
  String get alterationsStatusReceived => 'తీసుకున్నవి';

  @override
  String get alterationsStatusWithKarigar => 'కారీగర్ వద్ద';

  @override
  String get alterationsStatusReady => 'కస్టమర్‌కు సిద్ధం';

  @override
  String get alterationsNone => 'ఇక్కడ ఏమీ లేదు.';

  @override
  String alterationsLabour(String from, String to) {
    return 'కారీగర్ కూలీ, $from నుండి $to';
  }

  @override
  String get alterationsKarigar => 'కారీగర్';

  @override
  String get alterationsKarigars => 'కారీగర్లు';

  @override
  String get alterationsKarigarHint =>
      'బయటి కారీగర్లకు సొంత ఖాతా; పని తిరిగి వచ్చినప్పుడు కూలీ జమ అవుతుంది. లోపలి కారీగర్లకు జీతం.';

  @override
  String get alterationsNoKarigars => 'ఇంకా కారీగర్లు లేరు.';

  @override
  String get alterationsOutside => 'బయటి కారీగర్';

  @override
  String get alterationsInHouse => 'లోపలి';

  @override
  String get alterationsPhone => 'మొబైల్';

  @override
  String get alterationsSlips => 'స్లిప్‌లు';

  @override
  String get alterationsPieces => 'ముక్కలు';

  @override
  String get alterationsLabourCol => 'కూలీ';

  @override
  String get alterationsNoLabour => 'ఈ నెల కారీగర్ల నుండి ఏమీ తిరిగి రాలేదు.';

  @override
  String get alterationsOverdue => 'ఆలస్యం';

  @override
  String alterationsDue(String date) {
    return '$date లోపు';
  }

  @override
  String alterationsTrial(String date) {
    return 'ట్రయల్ $date';
  }

  @override
  String alterationsWith(String name) {
    return '$name వద్ద';
  }

  @override
  String get alterationsFree => 'ఉచితం';

  @override
  String get alterationsGive => 'ఇవ్వండి';

  @override
  String get alterationsBack => 'కారీగర్ నుండి వచ్చింది';

  @override
  String get alterationsDeliver => 'అప్పగించండి';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'అప్పగించి $amount వసూలు చేయండి';
  }

  @override
  String get alterationsCancelSlip => 'స్లిప్ రద్దు చేయండి';

  @override
  String get alterationsAgainstBill => 'బిల్‌పై';

  @override
  String get alterationsTrialOn => 'ట్రయల్ తేదీ';

  @override
  String get alterationsDeliveryOn => 'డెలివరీ తేదీ';

  @override
  String get alterationsComplimentary => 'కొనుగోలుతో ఉచితం';

  @override
  String get alterationsGarment => 'బట్ట';

  @override
  String get alterationsWork => 'పని';

  @override
  String get alterationsNotes => 'కొలతలు మరియు గమనికలు';

  @override
  String get alterationsAddWork => 'పని జోడించండి';

  @override
  String get alterationsTakeIn => 'స్లిప్ చేయండి';

  @override
  String alterationsCharge(String amount) {
    return 'ఛార్జ్ $amount';
  }

  @override
  String get alterationsTypes => 'చేసే ఆల్టరేషన్లు, రిపేర్లు';

  @override
  String get alterationsCustomerCharge => 'కస్టమర్ చెల్లిస్తారు';

  @override
  String get alterationsKindsAlteration => 'ఆల్టరేషన్';

  @override
  String get alterationsKindsRepair => 'రిపేర్';

  @override
  String get alterationsErrorsNameTaken => 'ఈ పేరు ఇప్పటికే వాడుకలో ఉంది.';

  @override
  String get alterationsErrorsNotReceived =>
      'ఈ స్లిప్ ఇప్పటికే కారీగర్‌కు వెళ్ళింది.';

  @override
  String get alterationsErrorsNotWithKarigar =>
      'ఈ స్లిప్ ఏ కారీగర్ వద్దా లేదు.';

  @override
  String get alterationsErrorsNotReady => 'ఈ స్లిప్ ఇంకా సిద్ధం కాలేదు.';

  @override
  String get alterationsErrorsTerminalRequired =>
      'ఛార్జ్ వసూలు చేయడానికి కౌంటర్ ఎంచుకోండి.';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'డెలివరీ తేదీ స్లిప్ తేదీకి ముందుంది.';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'ట్రయల్ స్లిప్ తేదీ, డెలివరీ మధ్య ఉండాలి.';

  @override
  String get alterationsErrorsCannotCancel =>
      'అప్పగించిన లేదా రద్దైన స్లిప్‌ను రద్దు చేయలేము.';

  @override
  String get tailoringTitle => 'ఆర్డర్‌పై కుట్టు';

  @override
  String get tailoringSubtitle =>
      'కొలతలు, అడ్వాన్స్, ప్రతి పని కారీగర్ ద్వారా, డెలివరీలో కుట్టు బిల్.';

  @override
  String get tailoringNewOrder => 'కొత్త కుట్టు ఆర్డర్';

  @override
  String get tailoringTakeMeasurements => 'కొలతలు తీసుకోండి';

  @override
  String get tailoringStatusBooked => 'బుక్ అయింది';

  @override
  String get tailoringStatusInWork => 'పనిలో ఉంది';

  @override
  String get tailoringStatusReady => 'డెలివరీకి సిద్ధం';

  @override
  String get tailoringTrialDue => 'ట్రయల్ బాకీ';

  @override
  String get tailoringToday => 'ఈరోజు ఇవ్వాలి';

  @override
  String get tailoringMarkDone => 'అయిపోయింది';

  @override
  String get tailoringMarkReady => 'సిద్ధంగా గుర్తించండి';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'మొత్తం $total, అడ్వాన్స్ $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'ఇచ్చి $amount వసూలు చేయండి';
  }

  @override
  String get tailoringCancelOrder => 'ఆర్డర్ రద్దు చేయండి';

  @override
  String tailoringCardsFound(String n) {
    return '$n కొలత కార్డులు ఉన్నాయి';
  }

  @override
  String get tailoringStitchingPrice => 'కుట్టు ధర';

  @override
  String get tailoringMeasurements => 'కొలత కార్డ్';

  @override
  String get tailoringNoCard => 'కార్డ్ లేదు';

  @override
  String get tailoringFabric => 'బట్ట';

  @override
  String get tailoringOwnFabric => 'కస్టమర్ సొంత బట్ట';

  @override
  String get tailoringMetres => 'మీటర్లు';

  @override
  String get tailoringStyleNotes => 'స్టైల్ గమనికలు (కాలర్, జేబులు, ఫిట్...)';

  @override
  String get tailoringAddGarment => 'బట్ట జోడించండి';

  @override
  String get tailoringAdvance => 'అడ్వాన్స్ (₹)';

  @override
  String get tailoringAdvanceHint =>
      'ఈ ఆర్డర్‌కు జమగా ఉంటుంది; డెలివరీలో బిల్‌లో తగ్గుతుంది';

  @override
  String get tailoringBook => 'ఆర్డర్ బుక్ చేయండి';

  @override
  String tailoringEstimate(String amount) {
    return 'అంచనా $amount';
  }

  @override
  String get tailoringInches =>
      'కొలతలు అంగుళాల్లో. అవసరం లేనివి ఖాళీగా వదలండి.';

  @override
  String get tailoringOtherMeasure => 'ఇతర కొలత';

  @override
  String get tailoringValue => 'విలువ';

  @override
  String get tailoringPhoto => 'ఫోటో జోడించండి';

  @override
  String get tailoringRates => 'పని వారీగా కారీగర్ రేట్లు';

  @override
  String get tailoringRatesHint =>
      'ప్రతి బట్ట ప్రతి పనికి ముక్కకు కూలీ, చేసే క్రమంలో. కొత్త ఆర్డర్లు ఈ పనులు తీసుకుంటాయి.';

  @override
  String get tailoringProcess => 'పని';

  @override
  String get tailoringNoRates =>
      'ఇంకా రేట్లు లేవు: జోడించే వరకు ఆర్డర్లలో పనులు ఉండవు.';

  @override
  String get tailoringAddRate => 'పని జోడించండి';

  @override
  String get tailoringKeysChest => 'ఛాతీ';

  @override
  String get tailoringKeysWaist => 'నడుము';

  @override
  String get tailoringKeysHip => 'తుంటి';

  @override
  String get tailoringKeysShoulder => 'భుజం';

  @override
  String get tailoringKeysLength => 'పొడవు';

  @override
  String get tailoringKeysSleeve => 'చేతి పొడవు';

  @override
  String get tailoringKeysNeck => 'మెడ';

  @override
  String get tailoringKeysInseam => 'లోపలి పొడవు';

  @override
  String get tailoringErrorsPhotoTooBig => 'ఫోటో చాలా పెద్దది (గరిష్ఠం 6 MB).';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'అడ్వాన్స్ ఆర్డర్ మొత్తం కంటే ఎక్కువ.';

  @override
  String get tailoringErrorsAssignFirst => 'ముందుగా పనిని కారీగర్‌కు ఇవ్వండి.';

  @override
  String get tailoringErrorsProcessDone => 'ఆ పని ఇప్పటికే అయిపోయింది.';

  @override
  String get tailoringErrorsProcessesPending => 'కొన్ని పనులు ఇంకా అవ్వలేదు.';

  @override
  String get tailoringErrorsNotReady => 'ఈ ఆర్డర్ ఇంకా సిద్ధం కాలేదు.';

  @override
  String get tailoringErrorsOrderClosed =>
      'ఈ ఆర్డర్ ఇప్పటికే ఇచ్చారు లేదా రద్దైంది.';

  @override
  String get tailoringErrorsFabricQtyRequired =>
      'ఎన్ని మీటర్ల బట్ట నమోదు చేయండి.';

  @override
  String get tailoringErrorsNoMeasurements => 'కనీసం ఒక కొలత నమోదు చేయండి.';

  @override
  String get tailoringErrorsDuplicateRate =>
      'అదే బట్ట, పని రెండుసార్లు ఉన్నాయి.';

  @override
  String get consignmentTitle => 'కన్సైన్‌మెంట్ మరియు షాప్-ఇన్-షాప్';

  @override
  String get consignmentSubtitle =>
      'ఇతర దుకాణాల్లో ఉంచిన సరుకు అమ్ముడయ్యే వరకు మీదే. సరుకు పంపండి, వెనక్కి తీసుకోండి, వారి అమ్మకాల నివేదిక ప్రకారం బిల్లు చేయండి.';

  @override
  String get consignmentSend => 'సరుకు పంపండి';

  @override
  String get consignmentBillSales => 'వారి అమ్మకాలకు బిల్లు';

  @override
  String get consignmentTakeBack => 'సరుకు వెనక్కి తీసుకోండి';

  @override
  String get consignmentConsignee => 'కన్సైనీ';

  @override
  String get consignmentHeld => 'వారి వద్ద';

  @override
  String get consignmentValueAtCost => 'ఖర్చు ధర విలువ';

  @override
  String get consignmentSold => 'అమ్మినవి';

  @override
  String get consignmentAgeing => 'పాత సరుకు';

  @override
  String consignmentItemsAgeing(String n) {
    return '150 రోజులు దాటిన వస్తువులు: $n';
  }

  @override
  String get consignmentFine => 'అన్నీ కొత్తవి';

  @override
  String get consignmentNone => 'ఇంకా ఏ సరుకూ కన్సైన్‌మెంట్‌లో లేదు.';

  @override
  String consignmentReconcileTitle(String name) {
    return 'సరిపోల్చడం: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'వారి దుకాణంలో లెక్కించిన సంఖ్యను నమోదు చేయండి. తక్కువైన ముక్కలు అమ్మినట్లుగా వారికి బిల్లు అవుతాయి. పంపిన ఆరు నెలల్లో బిల్లు చేయాలి.';

  @override
  String get consignmentSent => 'పంపినవి';

  @override
  String get consignmentReturned => 'వెనక్కి వచ్చినవి';

  @override
  String get consignmentCounted => 'లెక్కించినవి';

  @override
  String get consignmentInvoiceBy => 'బిల్లు చివరి తేదీ';

  @override
  String consignmentMismatch(String n) {
    return '$n తేడా';
  }

  @override
  String consignmentShortage(String n) {
    return 'లెక్కలో తక్కువ ముక్కలు: $n';
  }

  @override
  String get consignmentShortageNarration =>
      'స్టాక్ లెక్కలో అమ్మినట్లు తేలింది';

  @override
  String get consignmentBillShortage => 'తక్కువను అమ్మినట్లు బిల్లు చేయండి';

  @override
  String get consignmentRegister => 'కదలికలు';

  @override
  String get consignmentKindsSend => 'పంపినవి';

  @override
  String get consignmentKindsReturn => 'వెనక్కి వచ్చినవి';

  @override
  String get consignmentKindsSale => 'అమ్మి బిల్లు చేసినవి';

  @override
  String get consignmentFormsSend => 'కన్సైన్‌మెంట్‌పై సరుకు పంపండి';

  @override
  String get consignmentFormsReturn => 'సరుకు వెనక్కి తీసుకోండి';

  @override
  String get consignmentFormsSales => 'వారి అమ్మకాల నివేదిక';

  @override
  String get consignmentFormHintsSend =>
      'సరుకు వారి దుకాణానికి వెళ్తుంది, మీ ఖాతాల్లోనే ఉంటుంది. ధర ఖాళీగా ఉంచితే వారి ధరల జాబితా లేదా వస్తువు అమ్మకం ధర వాడబడుతుంది.';

  @override
  String get consignmentFormHintsReturn =>
      'అమ్ముడుపోని ముక్కలు మీ ప్రధాన గోదాముకు తిరిగి వస్తాయి.';

  @override
  String get consignmentFormHintsSales =>
      'ప్రతి అమ్మకాల నివేదిక వారి దుకాణంలోని సరుకు నుండి వారికి పన్ను ఇన్వాయిస్ అవుతుంది. క్రెడిట్ పరిమితి దాటినా హెచ్చరికతో అవుతుంది.';

  @override
  String get consignmentAgreedRate => 'అంగీకరించిన ధర';

  @override
  String get consignmentAddLine => 'వస్తువు జోడించండి';

  @override
  String get consignmentSaveSend => 'పంపండి';

  @override
  String get consignmentSaveReturn => 'వెనక్కి తీసుకోండి';

  @override
  String get consignmentSaveSales => 'ఇన్వాయిస్ తయారు చేయండి';

  @override
  String get consignmentErrorsMoreThanHeld =>
      'ఇది వారి వద్ద ఉన్న దానికంటే ఎక్కువ.';

  @override
  String get consignmentErrorsNotACustomer => 'కస్టమర్ ఖాతాను ఎంచుకోండి.';

  @override
  String get consignmentErrorsDuplicateItem => 'అదే వస్తువు రెండుసార్లు ఉంది.';

  @override
  String get consignmentErrorsUnknownItem => 'ఒక వస్తువు ఇప్పుడు లేదు.';

  @override
  String get reportsParticulars => 'వివరాలు';

  @override
  String get reportsTradingIncome => 'అమ్మకాలు & ప్రత్యక్ష ఆదాయం';

  @override
  String get reportsTradingExpense => 'కొనుగోళ్లు & ప్రత్యక్ష ఖర్చులు';

  @override
  String get reportsGrossProfit => 'స్థూల లాభం';

  @override
  String get reportsOtherIncome => 'పరోక్ష ఆదాయం';

  @override
  String get reportsOtherExpense => 'పరోక్ష ఖర్చులు';

  @override
  String get reportsNetProfit => 'నికర లాభం';

  @override
  String get reportsNetLoss => 'నికర నష్టం';

  @override
  String get reportsAssets => 'ఆస్తులు';

  @override
  String get reportsLiabilities => 'అప్పులు & మూలధనం';

  @override
  String get reportsProfitAndLoss => 'లాభనష్టాల ఖాతా';

  @override
  String get reportsDifference => 'తేడా';

  @override
  String get reportsOpeningDifference => 'ప్రారంభ బ్యాలెన్స్‌లలో తేడా';

  @override
  String get reportsOpening => 'ప్రారంభ బ్యాలెన్స్';

  @override
  String get reportsClosing => 'ముగింపు బ్యాలెన్స్';

  @override
  String get reportsNoData => 'ఈ కాలానికి చూపించడానికి ఏమీ లేదు.';

  @override
  String reportsLedgerTitle(String account) {
    return 'లెడ్జర్: $account';
  }

  @override
  String get reportsStockNote =>
      'దశ 3లో సరుకు వచ్చాక ముగింపు స్టాక్ జోడించబడుతుంది.';

  @override
  String get reportsOpeningStock => 'ప్రారంభ స్టాక్';

  @override
  String get reportsClosingStock => 'ముగింపు స్టాక్';

  @override
  String get reportsBuilderTitle => 'నివేదిక బిల్డర్';

  @override
  String get reportsBuilderSubtitle =>
      'అమ్మకాలు, కొనుగోళ్లు, ఖర్చులు, లెడ్జర్ ఎంట్రీలు లేదా సమయాన్ని మీకు కావలసినట్లు సమూహపరిచి మొత్తం చేయండి; సేవ్ చేయండి, లేదా ఈమెయిల్‌లో పొందండి.';

  @override
  String get reportsBuilderDataset => 'డేటా';

  @override
  String get reportsBuilderDatasetsSales => 'అమ్మకాలు';

  @override
  String get reportsBuilderDatasetsPurchases => 'కొనుగోళ్లు';

  @override
  String get reportsBuilderDatasetsExpenses => 'ఖర్చులు';

  @override
  String get reportsBuilderDatasetsLedger => 'లెడ్జర్ ఎంట్రీలు';

  @override
  String get reportsBuilderDatasetsTime => 'టైమ్‌షీట్లు';

  @override
  String get reportsBuilderGroupBy => 'సమూహపరచండి (3 వరకు)';

  @override
  String get reportsBuilderMeasures => 'చూపించండి';

  @override
  String get reportsBuilderDimsMonth => 'నెల';

  @override
  String get reportsBuilderDimsDay => 'రోజు';

  @override
  String get reportsBuilderDimsCustomer => 'కస్టమర్';

  @override
  String get reportsBuilderDimsItem => 'వస్తువు';

  @override
  String get reportsBuilderDimsHsn => 'HSN';

  @override
  String get reportsBuilderDimsState => 'రాష్ట్రం';

  @override
  String get reportsBuilderDimsSupplier => 'సరఫరాదారు';

  @override
  String get reportsBuilderDimsCategory => 'వర్గం';

  @override
  String get reportsBuilderDimsEmployee => 'ఉద్యోగి';

  @override
  String get reportsBuilderDimsProject => 'ప్రాజెక్టు';

  @override
  String get reportsBuilderDimsAccount => 'లెడ్జర్';

  @override
  String get reportsBuilderDimsGroup => 'సమూహం';

  @override
  String get reportsBuilderDimsType => 'వోచర్ రకం';

  @override
  String get reportsBuilderMeasureNamesQty => 'పరిమాణం';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'పన్ను విధించదగిన విలువ';

  @override
  String get reportsBuilderMeasureNamesTax => 'జీఎస్టీ';

  @override
  String get reportsBuilderMeasureNamesTotal => 'మొత్తం';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'పత్రాలు';

  @override
  String get reportsBuilderMeasureNamesAmount => 'మొత్తం';

  @override
  String get reportsBuilderMeasureNamesItc => 'జీఎస్టీ క్రెడిట్';

  @override
  String get reportsBuilderMeasureNamesDebit => 'డెబిట్';

  @override
  String get reportsBuilderMeasureNamesCredit => 'క్రెడిట్';

  @override
  String get reportsBuilderMeasureNamesNet => 'నికరం';

  @override
  String get reportsBuilderMeasureNamesHours => 'గంటలు';

  @override
  String get reportsBuilderMeasureNamesCost => 'ఖర్చు';

  @override
  String get reportsBuilderMeasureNamesBillableValue => 'బిల్ చేయదగిన విలువ';

  @override
  String get reportsBuilderPeriod => 'కాలం';

  @override
  String get reportsBuilderPresetsToday => 'ఈరోజు';

  @override
  String get reportsBuilderPresetsYesterday => 'నిన్న';

  @override
  String get reportsBuilderPresetsThisMonth => 'ఈ నెల';

  @override
  String get reportsBuilderPresetsLastMonth => 'గత నెల';

  @override
  String get reportsBuilderPresetsThisQuarter => 'ఈ త్రైమాసికం';

  @override
  String get reportsBuilderPresetsLastQuarter => 'గత త్రైమాసికం';

  @override
  String get reportsBuilderPresetsThisFy => 'ఈ ఆర్థిక సంవత్సరం';

  @override
  String get reportsBuilderPresetsLastFy => 'గత ఆర్థిక సంవత్సరం';

  @override
  String get reportsBuilderPresetsCustom => 'తేదీలు ఎంచుకోండి';

  @override
  String get reportsBuilderRun => 'రన్ చేయండి';

  @override
  String get reportsBuilderCsv => 'CSV డౌన్‌లోడ్';

  @override
  String get reportsBuilderSave => 'నివేదిక సేవ్ చేయండి';

  @override
  String get reportsBuilderName => 'నివేదిక పేరు';

  @override
  String get reportsBuilderSchedule => 'ఈమెయిల్ చేయండి';

  @override
  String get reportsBuilderFrequenciesNone => 'ఈమెయిల్ వద్దు';

  @override
  String get reportsBuilderFrequenciesDaily => 'ప్రతిరోజు (నిన్నటి అంకెలు)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'ప్రతి వారం (గత సోమవారం నుండి ఆదివారం)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'ప్రతి నెల (గత నెల)';

  @override
  String get reportsBuilderHour => 'సమయం';

  @override
  String get reportsBuilderWeekday => 'రోజు';

  @override
  String get reportsBuilderWeekdays0 => 'ఆదివారం';

  @override
  String get reportsBuilderWeekdays1 => 'సోమవారం';

  @override
  String get reportsBuilderWeekdays2 => 'మంగళవారం';

  @override
  String get reportsBuilderWeekdays3 => 'బుధవారం';

  @override
  String get reportsBuilderWeekdays4 => 'గురువారం';

  @override
  String get reportsBuilderWeekdays5 => 'శుక్రవారం';

  @override
  String get reportsBuilderWeekdays6 => 'శనివారం';

  @override
  String get reportsBuilderDay => 'తేదీన (1–28)';

  @override
  String get reportsBuilderRecipients =>
      'ఈమెయిల్ పంపాల్సినవారు (కామాలతో వేరు చేయండి)';

  @override
  String get reportsBuilderSaved => 'సేవ్ అయింది.';

  @override
  String get reportsBuilderTotal => 'మొత్తం';

  @override
  String get reportsBuilderNoRows => 'ఈ కాలానికి డేటా లేదు.';

  @override
  String get reportsBuilderSavedTitle => 'సేవ్ చేసిన నివేదికలు';

  @override
  String reportsBuilderNextRun(String date) {
    return 'తదుపరి ఈమెయిల్: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'చివరి రన్ విఫలమైంది: $error';
  }

  @override
  String get reportsBuilderDelete => 'తొలగించండి';

  @override
  String get reportsBuilderNone => 'ఇంకా సేవ్ చేసిన నివేదికలు లేవు.';

  @override
  String get reportsErrorsUnknownDataset => 'దేనిపై నివేదిక కావాలో ఎంచుకోండి.';

  @override
  String get reportsErrorsUnknownMeasure =>
      'చూపించడానికి కనీసం ఒక అంకెను ఎంచుకోండి.';

  @override
  String get reportsErrorsUnknownDimension =>
      'ఆ సమూహీకరణ ఇక్కడ అందుబాటులో లేదు.';

  @override
  String get reportsErrorsInvalidPeriod => 'తేదీలను తనిఖీ చేయండి.';

  @override
  String get reportsErrorsRecipientsRequired =>
      'కనీసం ఒక ఈమెయిల్ చిరునామా జోడించండి.';

  @override
  String get reportsErrorsInvalidHour => 'సమయం ఎంచుకోండి.';

  @override
  String get reportsErrorsInvalidWeekday => 'వారంలో రోజును ఎంచుకోండి.';

  @override
  String get reportsErrorsInvalidDay => '1 నుండి 28 మధ్య తేదీ ఎంచుకోండి.';

  @override
  String get reportsErrorsUnknownFilter => 'ఆ ఫిల్టర్ ఇక్కడ అందుబాటులో లేదు.';

  @override
  String get ownerReportsColourSizeTitle => 'రంగు, సైజు నివేదిక';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'ప్రతి డిజైన్ రంగు, సైజుల గ్రిడ్‌గా, స్టాక్ లేదా అమ్మిన ముక్కలతో.';

  @override
  String get ownerReportsAgeingTitle => 'స్టాక్ వయసు, నిలిచిన స్టాక్';

  @override
  String get ownerReportsAgeingSubtitle =>
      'ఈరోజు స్టాక్ ఎంతకాలంగా ఉంది (ముందు వచ్చింది ముందు అమ్ముడవుతుంది), ఏది అమ్మడం ఆగింది.';

  @override
  String get ownerReportsRegisterTitle => 'అమ్మకాల రిజిస్టర్';

  @override
  String get ownerReportsRegisterSubtitle =>
      'కాలంలోని ప్రతి ఇన్వాయిస్, కౌంటర్ బిల్లు, రిటర్న్, చెల్లించిన విధానంతో.';

  @override
  String get ownerReportsDesign => 'డిజైన్';

  @override
  String get ownerReportsName => 'పేరు';

  @override
  String get ownerReportsBrand => 'బ్రాండ్';

  @override
  String get ownerReportsColour => 'రంగు';

  @override
  String get ownerReportsSize => 'సైజు';

  @override
  String get ownerReportsSold => 'అమ్మినవి';

  @override
  String get ownerReportsStock => 'స్టాక్';

  @override
  String get ownerReportsSales => 'అమ్మకాలు';

  @override
  String get ownerReportsReportType => 'చూపండి';

  @override
  String get ownerReportsFrom => 'నుండి';

  @override
  String get ownerReportsTo => 'వరకు';

  @override
  String get ownerReportsAsOf => 'ఈ తేదీకి';

  @override
  String get ownerReportsStore => 'గోదాము';

  @override
  String get ownerReportsAllStores => 'మా అన్ని గోదాములు';

  @override
  String get ownerReportsAllBrands => 'అన్ని బ్రాండ్లు';

  @override
  String get ownerReportsCategory => 'వర్గం';

  @override
  String get ownerReportsAllCategories => 'అన్ని వర్గాలు';

  @override
  String get ownerReportsSearchDesign => 'డిజైన్ నం. లేదా పేరు';

  @override
  String ownerReportsTotalSold(String n) {
    return 'అమ్మిన ముక్కలు: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'స్టాక్‌లో ముక్కలు: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'MRP $v';
  }

  @override
  String get ownerReportsTotal => 'మొత్తం';

  @override
  String get ownerReportsNoPhoto => 'ఫోటో లేదు';

  @override
  String get ownerReportsNothing => 'ఈ ఎంపికలకు ఏమీ లేదు.';

  @override
  String get ownerReportsItem => 'వస్తువు';

  @override
  String get ownerReportsValue => 'విలువ';

  @override
  String get ownerReportsDeadAfter => 'నిలిచిపోయింది ఎప్పుడు';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'నిలిచింది: $n రోజులు అమ్మకం లేదు';
  }

  @override
  String get ownerReportsOnlyDead => 'నిలిచిన స్టాక్ మాత్రమే';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'వయసు వారీ స్టాక్: $v, $n ముక్కలు';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'నిలిచిన స్టాక్ ($n రోజులు అమ్మకం లేదు)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'వస్తువులు: $items, ముక్కలు: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'డిస్కౌంట్, సరఫరాదారుకు రిటర్న్ లేదా వేరే గోదాముకు బదిలీకి తగినవి.';

  @override
  String get ownerReportsDead => 'నిలిచింది';

  @override
  String get ownerReportsLastSold => 'చివరి అమ్మకం';

  @override
  String get ownerReportsIdleDays => 'అమ్మకం లేని రోజులు';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n రోజుల క్రితం)';
  }

  @override
  String get ownerReportsNeverSold => 'ఎప్పుడూ అమ్ముడుపోలేదు';

  @override
  String get ownerReportsDate => 'తేదీ';

  @override
  String get ownerReportsNumber => 'నం.';

  @override
  String get ownerReportsKind => 'పత్రం';

  @override
  String get ownerReportsParty => 'కస్టమర్';

  @override
  String get ownerReportsColsPieces => 'ముక్కలు';

  @override
  String get ownerReportsColsGross => 'స్థూలం';

  @override
  String get ownerReportsColsDiscount => 'డిస్కౌంట్';

  @override
  String get ownerReportsColsTaxable => 'పన్ను విధించదగినది';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'బిల్లు మొత్తం';

  @override
  String get ownerReportsColsCash => 'నగదు';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'కార్డ్';

  @override
  String get ownerReportsColsCredit => 'ఖాతాలో';

  @override
  String get ownerReportsKindsInvoice => 'ఇన్వాయిస్';

  @override
  String get ownerReportsKindsBill => 'కౌంటర్ బిల్లు';

  @override
  String get ownerReportsKindsCreditNote => 'క్రెడిట్ నోట్';

  @override
  String get ownerReportsKindsCounterReturn => 'కౌంటర్ రిటర్న్';

  @override
  String get ownerReportsSearchRegister => 'నంబర్ లేదా కస్టమర్';

  @override
  String get ownerReportsAllKinds => 'అన్ని పత్రాలు';

  @override
  String ownerReportsDocuments(String n) {
    return 'పత్రాలు: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'రిటర్న్‌లు మైనస్ వరుసలుగా ఉన్నాయి. రంగు వరుసల్లో డిస్కౌంట్ ఉంది; కొట్టివేసిన వరుసలు రద్దు, మొత్తంలో లేవు.';

  @override
  String get ownerReportsCompareLastYear => 'గత సంవత్సరంతో పోల్చండి';

  @override
  String get ownerReportsThisPeriod => 'ఈ కాలం';

  @override
  String get ownerReportsSameLastYear => 'గత సంవత్సరం అదే కాలం';

  @override
  String get ownerReportsChange => 'మార్పు';

  @override
  String get ownerReportsErrorsInvalidPeriod =>
      'ప్రారంభ తేదీ ముగింపు తర్వాత ఉంది.';

  @override
  String get ownerReportsWithMaterials => 'బట్ట, ట్రిమ్‌లతో';

  @override
  String get ownerReportsAvgBill => 'సగటు బిల్లు';

  @override
  String get fyTitle => 'ఆర్థిక సంవత్సరాలు';

  @override
  String get fySubtitle =>
      'ఖాతాలు ఖరారయ్యాక కాలాన్ని లాక్ చేయండి: ఉదా. జీఎస్టీ రిటర్న్‌లు దాఖలు చేసిన తర్వాత. లాక్ తేదీ వరకు ఎవరూ ఎంట్రీలు పోస్ట్ లేదా రద్దు చేయలేరు.';

  @override
  String get fyYear => 'సంవత్సరం';

  @override
  String get fyPeriod => 'కాలం';

  @override
  String get fyLockedUpTo => 'వరకు లాక్';

  @override
  String get fyOpen => 'తెరిచి ఉంది';

  @override
  String get fyLock => 'లాక్ చేయండి';

  @override
  String get fyUnlock => 'లాక్ తీసివేయండి';

  @override
  String get fyErrorsLockOutsideYear =>
      'లాక్ తేదీ ఈ ఆర్థిక సంవత్సరంలోనే ఉండాలి.';

  @override
  String get appConnectTitle => 'ఈ పరికరాన్ని కనెక్ట్ చేయండి';

  @override
  String get appConnectSubtitle =>
      'మీ Varchasv ఖాతాతో ఒకసారి సైన్ ఇన్ చేయండి. ఆ తర్వాత యాప్ ఇంటర్నెట్ లేకుండా పనిచేస్తుంది, మీరు ఆన్‌లైన్‌లో ఉన్నప్పుడు సింక్ అవుతుంది.';

  @override
  String get appServer => 'సర్వర్ చిరునామా';

  @override
  String get appConnect => 'కనెక్ట్ చేయండి';

  @override
  String get appConnecting => 'కనెక్ట్ అవుతోంది…';

  @override
  String get appNoBusiness =>
      'ఈ ఖాతా ఇంకా ఏ వ్యాపారంలోనూ లేదు. ముందుగా వెబ్‌సైట్‌లో ఒకటి సృష్టించండి.';

  @override
  String get appCantReach =>
      'సర్వర్‌ను చేరుకోలేకపోయాం. చిరునామా, ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి.';

  @override
  String get appSyncTitle => 'సింక్';

  @override
  String get appSyncNow => 'ఇప్పుడే సింక్ చేయండి';

  @override
  String appLastSync(String time) {
    return 'చివరిగా $timeకి సింక్ అయింది';
  }

  @override
  String get appNeverSynced => 'ఇంకా సింక్ కాలేదు';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count మార్పులు అప్‌లోడ్ కోసం వేచి ఉన్నాయి',
      one: '$count మార్పు అప్‌లోడ్ కోసం వేచి ఉంది',
      zero: 'అన్నీ అప్‌లోడ్ అయ్యాయి',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'సర్వర్ $count మార్పులను తిరస్కరించింది',
      one: 'సర్వర్ $count మార్పును తిరస్కరించింది',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'తిరస్కరించిన మార్పులను మళ్లీ ప్రయత్నించండి';

  @override
  String get appOffline =>
      'ఆఫ్‌లైన్: మీ పని ఈ పరికరంలో సేవ్ అయింది, తర్వాత అప్‌లోడ్ అవుతుంది.';

  @override
  String get appSyncing => 'సింక్ అవుతోంది…';

  @override
  String get appDevice => 'ఈ పరికరం';

  @override
  String appDeviceCode(String code) {
    return 'పరికర కోడ్ $code';
  }

  @override
  String get appBusiness => 'వ్యాపారం';

  @override
  String get appSignOut => 'ఈ పరికరం నుండి సైన్ అవుట్ చేయండి';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count మార్పులు ఇంకా అప్‌లోడ్ కాలేదు, అవి పోతాయి.',
      one: '$count మార్పు ఇంకా అప్‌లోడ్ కాలేదు, అది పోతుంది.',
      zero: 'ఇది ఈ పరికరం నుండి మీ ఖాతాల స్థానిక కాపీని తీసివేస్తుంది.',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'అప్‌లోడ్ కోసం వేచి ఉంది';

  @override
  String get appBadgeFailed => 'తిరస్కరించబడింది';

  @override
  String get appBadgeSynced => 'అప్‌లోడ్ అయింది';

  @override
  String get appNoVouchers => 'ఇంకా వోచర్లు లేవు. జోడించడానికి + నొక్కండి.';

  @override
  String get appAddAccount => 'ఖాతా జోడించండి';

  @override
  String get appNoPermission => 'దీన్ని చేయడానికి మీకు అనుమతి లేదు.';

  @override
  String get appToday => 'ఈరోజు';

  @override
  String get appPreviousDay => 'ముందు రోజు';

  @override
  String get appNextDay => 'తర్వాతి రోజు';

  @override
  String get appNotSyncedYet => 'సింక్ కోసం వేచి ఉంది';

  @override
  String get appFieldTitle => 'ఫీల్డ్ వర్క్';

  @override
  String get appFieldNewOrder => 'కొత్త ఆర్డర్';

  @override
  String get appFieldNewClaim => 'కొత్త ఖర్చు క్లెయిమ్';

  @override
  String get appFieldOrders => 'ఈ పరికరం నుండి ఆర్డర్లు';

  @override
  String get appFieldClaims => 'ఈ పరికరం నుండి క్లెయిమ్‌లు';

  @override
  String appFieldSentAs(String number) {
    return '$numberగా అప్‌లోడ్ అయింది';
  }

  @override
  String appFieldApprox(String amount) {
    return 'జీఎస్టీతో సుమారు ₹$amount; తుది మొత్తం అప్‌లోడ్ సమయంలో లెక్కించబడుతుంది';
  }

  @override
  String get appFieldAddItem => 'వస్తువు జోడించండి';

  @override
  String get appFieldQty => 'పరిమాణం';

  @override
  String get appFieldRate => 'ధర';

  @override
  String get appFieldSave => 'సేవ్ చేయండి';

  @override
  String get appFieldSaved =>
      'ఈ పరికరంలో సేవ్ అయింది; ఆన్‌లైన్‌లోకి వచ్చాక అప్‌లోడ్ అవుతుంది.';

  @override
  String get appFieldNone => 'ఇంకా ఏమీ లేదు.';

  @override
  String get appOverviewTitle => 'సమీక్ష';

  @override
  String appOverviewAsOf(String time) {
    return '$time నాటి అంకెలు';
  }

  @override
  String appOverviewOffline(String time) {
    return '$time నాటి అంకెలు చూపిస్తోంది. రిఫ్రెష్ చేయడానికి ఇంటర్నెట్‌కు కనెక్ట్ అవ్వండి.';
  }

  @override
  String get appOverviewNever =>
      'ఈరోజు అంకెలు చూడటానికి ఇంటర్నెట్‌కు కనెక్ట్ అవ్వండి.';

  @override
  String get appOverviewRefresh => 'రిఫ్రెష్';

  @override
  String get appApprovalsTitle => 'ఆమోదాలు';

  @override
  String get appApprovalsNone => 'మీ కోసం ఏదీ వేచి లేదు.';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours గం';
  }

  @override
  String get appApprovalsNeedOnline => 'ఆమోదాలకు ఇంటర్నెట్ అవసరం.';

  @override
  String get itemsTitle => 'వస్తువులు';

  @override
  String get itemsSubtitle =>
      'మీరు నిల్వ ఉంచే సరుకులు, కొనే లేదా అమ్మే సేవలు, HSN/SAC మరియు జీఎస్టీ రేటుతో.';

  @override
  String get itemsNew => 'కొత్త వస్తువు';

  @override
  String get itemsName => 'వస్తువు పేరు';

  @override
  String get itemsKind => 'రకం';

  @override
  String get itemsGoods => 'సరుకు';

  @override
  String get itemsService => 'సేవ';

  @override
  String get itemsSku => 'SKU / కోడ్';

  @override
  String get itemsBarcode => 'బార్‌కోడ్';

  @override
  String get itemsHsn => 'HSN / SAC';

  @override
  String get itemsGstRate => 'జీఎస్టీ రేటు';

  @override
  String get itemsUom => 'యూనిట్';

  @override
  String get itemsPurchaseRate => 'కొనుగోలు ధర';

  @override
  String get itemsSaleRate => 'అమ్మకపు ధర';

  @override
  String get itemsMrp => 'MRP';

  @override
  String get itemsReorderLevel => 'రీఆర్డర్ స్థాయి';

  @override
  String get itemsReorderQty => 'రీఆర్డర్ పరిమాణం';

  @override
  String get itemsTrackBatches => 'బ్యాచ్ నంబర్లు, గడువు తేదీలు నమోదు చేయండి';

  @override
  String get itemsInStock => 'స్టాక్‌లో';

  @override
  String get itemsEmpty => 'ఇంకా వస్తువులు లేవు.';

  @override
  String get itemsErrorsInvalidHsn => 'HSN కోడ్‌లో 4, 6 లేదా 8 అంకెలు ఉంటాయి.';

  @override
  String get itemsErrorsInvalidSac =>
      'SAC కోడ్‌లో 99తో మొదలయ్యే 6 అంకెలు ఉంటాయి.';

  @override
  String get itemsErrorsItemNameTaken => 'ఈ పేరుతో ఇప్పటికే వస్తువు ఉంది.';

  @override
  String get itemsErrorsSkuTaken =>
      'మరో వస్తువు ఇప్పటికే ఈ కోడ్ ఉపయోగిస్తోంది.';

  @override
  String get itemsErrorsUnknownUom => 'యూనిట్ ఎంచుకోండి.';

  @override
  String get itemsErrorsSameAsBaseUnit => 'ఇది ఇప్పటికే ఐటమ్ సొంత యూనిట్.';

  @override
  String get itemsErrorsDuplicateUnit =>
      'ప్రతి యూనిట్‌ను ఒక్కసారే జోడించవచ్చు.';

  @override
  String get itemsErrorsInvalidFactor =>
      'ఇందులో మూల యూనిట్ ఎన్ని ఉన్నాయో 0 కంటే ఎక్కువ నమోదు చేయండి.';

  @override
  String get itemsLeadTimeDays => 'లీడ్ టైమ్ (రోజులు)';

  @override
  String get itemsGstSlab => 'జీఎస్టీ రేటు';

  @override
  String get itemsSlabNone => 'స్థిర రేటు';

  @override
  String get itemsSlabApparel =>
      'తగ్గింపు తర్వాత ఒక్కో ముక్కకు ₹2,500 వరకు 5%, దానికి మించి 18% (22 సెప్టెంబర్ 2025 నుండి)';

  @override
  String get itemsSlabFootwear =>
      'తగ్గింపు తర్వాత ఒక్కో జతకు ₹2,500 వరకు 5%, దానికి మించి 18% (22 సెప్టెంబర్ 2025 నుండి)';

  @override
  String get itemsSlabPieces => 'ఒక యూనిట్‌లో ముక్కలు';

  @override
  String get itemsSlabPiecesHint =>
      'ఒక యూనిట్‌గా అమ్మే సెట్ ధర జీఎస్టీ పరీక్ష కోసం ఇన్ని ముక్కలుగా విభజించబడుతుంది. సెట్‌ను ఒకే ముక్కగా లెక్కించడానికి 1 నమోదు చేయండి.';

  @override
  String get itemsByPrice => 'ధర ప్రకారం';

  @override
  String get itemsOtherUnits => 'ఇతర యూనిట్లు';

  @override
  String get itemsUnitFactor => 'మూల యూనిట్‌లో ఎన్ని';

  @override
  String get itemsOfBaseUnit => 'మూల యూనిట్';

  @override
  String get itemsAddUnit => 'యూనిట్ జోడించండి';

  @override
  String get stylesTitle => 'స్టైల్స్';

  @override
  String get stylesSubtitle =>
      'రంగులు, సైజుల్లో అమ్మే డిజైన్లు. ప్రతి రంగు, సైజు ఒక ప్రత్యేక వస్తువు, దానికి సొంత బార్‌కోడ్, స్టాక్ ఉంటాయి.';

  @override
  String get stylesSizesAndColors => 'సైజులు, రంగులు';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'స్టైల్ జోడించేటప్పుడు ఎంచుకునే సైజు స్కేల్‌లు, రంగులు.';

  @override
  String get stylesNew => 'కొత్త స్టైల్';

  @override
  String get stylesCreate => 'స్టైల్ సృష్టించండి';

  @override
  String get stylesCode => 'డిజైన్ నం.';

  @override
  String get stylesCodeHint => 'ప్రతి SKUలో వాడబడుతుంది, ఉదా. KT-101-NVY-M.';

  @override
  String get stylesName => 'పేరు';

  @override
  String get stylesBrand => 'బ్రాండ్';

  @override
  String get stylesCategory => 'వర్గం';

  @override
  String get stylesSeason => 'సీజన్';

  @override
  String get stylesSeasonExample => 'పండుగ 2026';

  @override
  String get stylesCollection => 'కలెక్షన్';

  @override
  String get stylesSizeScale => 'సైజు స్కేల్';

  @override
  String get stylesSizes => 'సైజులు';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'రంగులు';

  @override
  String get stylesColor => 'రంగు';

  @override
  String get stylesFits => 'ఫిట్';

  @override
  String get stylesFitsHint =>
      'రంగు, సైజు కాకుండా మూడో ఎంపిక, కామాలతో వేరు చేయండి.';

  @override
  String get stylesFitsExample => 'స్లిమ్, రెగ్యులర్';

  @override
  String get stylesVariants => 'వేరియంట్లు';

  @override
  String get stylesSaleRate => 'అమ్మకం ధర';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'దీనితో $count వస్తువులు తయారవుతాయి, ప్రతి రంగు, సైజుకు ఒకటి.',
      one: 'దీనితో $count వస్తువు తయారవుతుంది.',
      zero: 'సైజులు, రంగులు ఎంచుకోండి.',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'ఇంకా స్టైల్స్ లేవు. ఒకటి జోడిస్తే దాని అన్ని రంగులు, సైజులు ఒకేసారి తయారవుతాయి.';

  @override
  String get stylesNoMatch => 'మీ వెతుకులాటకు సరిపోయే స్టైల్ లేదు.';

  @override
  String get stylesSearchStyles => 'డిజైన్ నం., పేరు లేదా బ్రాండ్‌తో వెతకండి';

  @override
  String get stylesNoStyles => 'స్టైల్స్ కనిపించలేదు.';

  @override
  String get stylesChooseStyle => 'స్టైల్ ఎంచుకోండి';

  @override
  String get stylesOtherStyle => 'మరో స్టైల్';

  @override
  String get stylesAddBySize => 'సైజు ప్రకారం జోడించండి';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ముక్కలు జోడించండి',
      one: '$count ముక్క జోడించండి',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'ప్రతి పెట్టె కింద ఉన్న చిన్న సంఖ్య చేతిలో ఉన్న స్టాక్.';

  @override
  String get stylesStockGrid => 'రంగు, సైజు ప్రకారం స్టాక్';

  @override
  String get stylesAllWarehouses => 'అన్ని గోదాములు';

  @override
  String get stylesDetails => 'స్టైల్ వివరాలు';

  @override
  String get stylesApplyPrices => 'ఈ ధరలను ప్రతి సైజుకు వర్తింపజేయండి';

  @override
  String get stylesAddVariants => 'రంగులు లేదా సైజులు జోడించండి';

  @override
  String get stylesAddVariantsHint =>
      'కొత్త రంగులు, సైజులు లేదా రెండూ ఎంచుకోండి. స్టైల్‌లో ఇప్పటికే ఉన్న వేరియంట్లు అలాగే ఉంటాయి.';

  @override
  String get stylesSets => 'సెట్లు';

  @override
  String get stylesNoSets => 'ఇంకా సెట్లు లేవు.';

  @override
  String get stylesNewSet => 'కొత్త సెట్';

  @override
  String get stylesNewSetHint =>
      'ఒక రంగులో సైజు నిష్పత్తి సెట్, ఒక యూనిట్‌గా అమ్మబడుతుంది. స్టాక్ దాని ముక్కలుగా కదులుతుంది.';

  @override
  String get stylesRatio => 'సైజు ముక్కలు';

  @override
  String get stylesSetAsOnePiece =>
      'జీఎస్టీ కోసం మొత్తం సెట్‌ను ఒక ముక్కగా లెక్కించండి';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ముక్కల సెట్ సృష్టించండి',
      one: '$count ముక్క సెట్ సృష్టించండి',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'సైజు స్కేల్‌లు';

  @override
  String get stylesScaleName => 'స్కేల్ పేరు';

  @override
  String get stylesColorName => 'రంగు పేరు';

  @override
  String get stylesColorCode => 'కోడ్';

  @override
  String get stylesSwatch => 'రంగు నమూనా';

  @override
  String get stylesArchive => 'ఆర్కైవ్ చేయండి';

  @override
  String get stylesRestore => 'పునరుద్ధరించండి';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'ఈ డిజైన్ నం. మరో స్టైల్‌లో ఇప్పటికే ఉంది.';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'కనీసం ఒక రంగు, ఒక సైజు ఎంచుకోండి.';

  @override
  String get stylesErrorsUnknownColor => 'ఈ రంగు మీ జాబితాలో లేదు.';

  @override
  String get stylesErrorsVariantMissing =>
      'ఈ స్టైల్‌లో ఆ రంగులో ఆ సైజు లేదు. ముందు దాన్ని జోడించండి.';

  @override
  String get stylesErrorsRatioRequired =>
      'సెట్‌లో కనీసం ఒక సైజు ముక్కలు నమోదు చేయండి.';

  @override
  String get stylesErrorsPackExists => 'ఈ సెట్ ఇప్పటికే ఉంది.';

  @override
  String get stylesErrorsScaleNameTaken =>
      'ఈ పేరుతో సైజు స్కేల్ ఇప్పటికే ఉంది.';

  @override
  String get stylesErrorsColorTaken =>
      'ఈ పేరు లేదా కోడ్‌తో రంగు ఇప్పటికే ఉంది.';

  @override
  String get stylesErrorsSizesRequired => 'కనీసం ఒక సైజు నమోదు చేయండి.';

  @override
  String get stylesErrorsColorCodeRequired => 'రంగుకు కోడ్ నమోదు చేయండి.';

  @override
  String get stylesSummaryTaxonomy => 'డిజైన్';

  @override
  String get stylesSummaryCode => 'డిజైన్ నం.';

  @override
  String get stylesSummaryName => 'పేరు';

  @override
  String get stylesSummaryBrand => 'బ్రాండ్';

  @override
  String get stylesSummaryCategory => 'వర్గం';

  @override
  String get stylesSummarySeason => 'సీజన్';

  @override
  String get stylesSummaryCollection => 'కలెక్షన్';

  @override
  String get stylesSummarySizes => 'సైజులు';

  @override
  String get stylesSummaryColours => 'రంగులు';

  @override
  String get stylesSummaryPricing => 'ధర, ఖర్చు';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'మార్క్-అప్ $pct%';
  }

  @override
  String get stylesSummaryCost => 'కొనుగోలు ధర';

  @override
  String get stylesSummarySaleRate => 'అమ్మకం ధర';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from నుండి $to';
  }

  @override
  String get stylesSummaryPieces => 'స్టాక్‌లో పీసులు';

  @override
  String get stylesSummarySkus => 'రంగు, సైజు వస్తువులు';

  @override
  String get stylesSummaryValueAtCost => 'ఖర్చుతో స్టాక్';

  @override
  String get stylesSummaryMedia => 'ఫొటోలు';

  @override
  String stylesSummaryPhotos(String n) {
    return '$n ఉన్నాయి';
  }

  @override
  String get stylesSummaryNoPhotos => 'ఇంకా ఫొటోలు లేవు.';

  @override
  String get stylesSummaryManagePhotos => 'ఫొటోలు చేర్చండి లేదా మార్చండి';

  @override
  String get stylesAttributes => 'స్టైల్ వివరణ (మీ జాబితాల నుండి)';

  @override
  String get catalogueTitle => 'చిత్ర కేటలాగ్';

  @override
  String get catalogueSubtitle =>
      'ప్రతి డిజైన్, రంగు ఫోటో, ధర, స్టాక్, అమ్మకాలతో. పార్టీ కోసం డిజైన్లు ఎంచుకుని ప్రింట్, ఎక్స్‌పోర్ట్ లేదా షేర్ చేయండి.';

  @override
  String get catalogueAllColours => 'అన్ని రంగులు';

  @override
  String get cataloguePhotos => 'ఫోటోలు';

  @override
  String get catalogueView => 'వీక్షణ';

  @override
  String get catalogueViewsFront => 'ముందు';

  @override
  String get catalogueViewsBack => 'వెనుక';

  @override
  String get catalogueViewsDetail => 'వివరం';

  @override
  String get catalogueViewsModel => 'మోడల్‌పై';

  @override
  String get catalogueViewsOther => 'ఇతర';

  @override
  String get catalogueUploading => 'అప్‌లోడ్ అవుతోంది…';

  @override
  String get catalogueAddPhotos => 'ఫోటోలు జోడించండి';

  @override
  String get cataloguePhotoHint =>
      'అప్‌లోడ్‌కు ముందు ఫోటోలు ఈ పరికరంలోనే చిన్నవి చేయబడతాయి. ఫోన్‌లో కెమెరాతో తీయవచ్చు.';

  @override
  String get catalogueShownFirst => 'ముందుగా కనిపిస్తుంది';

  @override
  String get catalogueShowFirst => 'ముందుగా చూపండి';

  @override
  String get catalogueNoPhotos => 'ఇంకా ఫోటోలు లేవు.';

  @override
  String catalogueRecords(String n) {
    return 'చూపిస్తున్న డిజైన్లు: $n';
  }

  @override
  String get catalogueTileSize => 'టైల్ పరిమాణం';

  @override
  String get catalogueSort => 'క్రమం';

  @override
  String get catalogueSortsCode => 'డిజైన్ నం. ప్రకారం';

  @override
  String get catalogueSortsNewest => 'కొత్తవి ముందు';

  @override
  String get catalogueSortsBest => 'ఎక్కువ అమ్ముడైనవి';

  @override
  String get catalogueSortsPriceLow => 'ధర: తక్కువ నుండి ఎక్కువ';

  @override
  String get catalogueSortsPriceHigh => 'ధర: ఎక్కువ నుండి తక్కువ';

  @override
  String get catalogueSortsStock => 'ఎక్కువ స్టాక్';

  @override
  String catalogueCart(String n) {
    return 'కార్ట్ ($n)';
  }

  @override
  String get catalogueNoPhoto => 'ఫోటో లేదు';

  @override
  String catalogueStock(String n) {
    return 'స్టాక్: $n';
  }

  @override
  String catalogueSold(String n) {
    return '90 రోజుల్లో అమ్మినవి: $n';
  }

  @override
  String get catalogueAdded => 'కార్ట్‌లో';

  @override
  String get catalogueAdd => 'జోడించు';

  @override
  String get catalogueNone => 'ఈ ఫిల్టర్లకు సరిపడే డిజైన్లు లేవు.';

  @override
  String get cataloguePrevious => 'మునుపటి';

  @override
  String get catalogueNext => 'తదుపరి';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$totalలో $from నుండి $to';
  }

  @override
  String get catalogueSelections => 'సేవ్ చేసిన ఎంపికలు';

  @override
  String catalogueDesigns(String n) {
    return 'డిజైన్లు: $n';
  }

  @override
  String get catalogueSharedBadge => 'లింక్ యాక్టివ్';

  @override
  String get catalogueNoSelections =>
      'ఇంకా ఎంపికలు లేవు. డిజైన్లను కార్ట్‌లో జోడించి సేవ్ చేయండి.';

  @override
  String get catalogueSearch => 'బార్‌కోడ్, డిజైన్ లేదా పేరు';

  @override
  String get cataloguePriceFor => 'ధరలు ఎవరికి';

  @override
  String get catalogueSaleRate => 'అమ్మకం ధర';

  @override
  String get catalogueInStockOnly => 'స్టాక్‌లో ఉన్నవి మాత్రమే';

  @override
  String get catalogueWithPhotoOnly => 'ఫోటో ఉన్నవి మాత్రమే';

  @override
  String get catalogueRate => 'ధర';

  @override
  String get catalogueRateFrom => 'ధర నుండి';

  @override
  String get catalogueRateTo => 'ధర వరకు';

  @override
  String get catalogueReceived => 'మధ్యలో వచ్చినవి';

  @override
  String get catalogueReceivedFrom => 'నుండి వచ్చినవి';

  @override
  String get catalogueReceivedTo => 'వరకు వచ్చినవి';

  @override
  String get catalogueApply => 'వర్తింపజేయండి';

  @override
  String get catalogueBrand => 'బ్రాండ్';

  @override
  String get catalogueCategory => 'వర్గం';

  @override
  String get catalogueSeason => 'సీజన్';

  @override
  String get catalogueClear => 'ఫిల్టర్లు తొలగించండి';

  @override
  String catalogueDefaultName(String party) {
    return '$party కోసం';
  }

  @override
  String get catalogueUntitled => 'కొత్త ఎంపిక';

  @override
  String get catalogueCartTitle => 'కార్ట్';

  @override
  String get catalogueCartEmpty =>
      'కార్ట్ ఖాళీగా ఉంది. డిజైన్‌పై జోడించు నొక్కండి.';

  @override
  String get catalogueSelectionName => 'ఎంపిక పేరు';

  @override
  String get catalogueForParty => 'పార్టీ కోసం';

  @override
  String get catalogueAnyone => 'ఎవరైనా';

  @override
  String get catalogueSaveSelection => 'ఎంపిక సేవ్ చేయండి';

  @override
  String get catalogueEmptyCart => 'కార్ట్ ఖాళీ చేయండి';

  @override
  String get catalogueColsCode => 'డిజైన్ నం.';

  @override
  String get catalogueColsName => 'పేరు';

  @override
  String get catalogueColsSize => 'సైజ్';

  @override
  String get catalogueColsRate => 'ధర';

  @override
  String get catalogueColsMrp => 'MRP';

  @override
  String get catalogueColsStock => 'స్టాక్';

  @override
  String get cataloguePrintPdf => 'ప్రింట్ లేదా PDF';

  @override
  String get catalogueExportExcel => 'Excel‌కు ఎక్స్‌పోర్ట్';

  @override
  String get catalogueShowPrices => 'ధరలు చూపండి';

  @override
  String get catalogueShowStock => 'స్టాక్‌లోని సైజులు చూపండి';

  @override
  String get catalogueDeleteConfirm =>
      'ఈ ఎంపిక తొలగించాలా? షేర్ చేసిన లింక్ పనిచేయదు.';

  @override
  String get catalogueDelete => 'ఎంపిక తొలగించండి';

  @override
  String get catalogueShareTitle => 'షేర్ చేయండి';

  @override
  String catalogueSharedUntil(String date) {
    return 'ఒక లింక్ $date వరకు యాక్టివ్. కొత్తది చేస్తే పాతది ఆగుతుంది.';
  }

  @override
  String get catalogueShareHint =>
      'లాగిన్ లేకుండా ఈ కేటలాగ్ తెరిచే లింక్ చేసి, కాపీ చేయండి లేదా WhatsAppలో పంపండి.';

  @override
  String get catalogueLinkWorksFor => 'లింక్ పనిచేసే కాలం';

  @override
  String catalogueDays(String n) {
    return '$n రోజులు';
  }

  @override
  String get catalogueNewLink => 'కొత్త లింక్ చేయండి';

  @override
  String get catalogueMakeLink => 'లింక్ చేయండి';

  @override
  String get catalogueStopSharing => 'షేర్ ఆపండి';

  @override
  String get catalogueLink => 'లింక్';

  @override
  String get catalogueCopied => 'లింక్ కాపీ అయింది.';

  @override
  String get catalogueCopy => 'కాపీ';

  @override
  String get catalogueWhatsappTo => 'WhatsApp నంబర్';

  @override
  String catalogueSentDemo(String to) {
    return '$toకు పంపినట్లు నమోదైంది (డెమో: WhatsApp ప్రొవైడర్ ఇంకా సెట్ కాలేదు).';
  }

  @override
  String catalogueSent(String to) {
    return '$toకు WhatsAppలో పంపబడింది.';
  }

  @override
  String get catalogueSendWhatsapp => 'WhatsAppలో పంపండి';

  @override
  String catalogueOrderHint(String party) {
    return '$party కోసం సేల్స్ ఆర్డర్ చేయడానికి సైజు వారీగా సంఖ్య నమోదు చేయండి.';
  }

  @override
  String catalogueMrp(String v) {
    return 'MRP $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'ముక్కలు: $pieces, పన్ను ముందు $value';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'కేటలాగ్ ఎంపిక $name నుండి';
  }

  @override
  String get catalogueMakeOrder => 'సేల్స్ ఆర్డర్ చేయండి';

  @override
  String catalogueForPartyLine(String party) {
    return '$party కోసం';
  }

  @override
  String get catalogueSelectionSubtitle => 'ఒక కేటలాగ్ ఎంపిక';

  @override
  String get catalogueLinkExpiredTitle => 'ఈ కేటలాగ్ ఇక షేర్ చేయబడలేదు';

  @override
  String get catalogueLinkExpired =>
      'లింక్ గడువు ముగిసింది లేదా మార్చబడింది. పంపినవారిని కొత్తది అడగండి.';

  @override
  String get catalogueErrorsUnknownStyle => 'ఆ డిజైన్ ఇప్పుడు లేదు.';

  @override
  String get catalogueErrorsUnknownColor => 'ఈ డిజైన్‌లో ఈ రంగు లేదు.';

  @override
  String get catalogueErrorsUnknownFile =>
      'ఫోటో అప్‌లోడ్ కాలేదు. మళ్లీ ప్రయత్నించండి.';

  @override
  String get catalogueErrorsFileType => 'JPEG, PNG లేదా WebP ఫోటో వాడండి.';

  @override
  String get catalogueErrorsFileTooLarge => 'ఫోటో చాలా పెద్దది.';

  @override
  String get catalogueErrorsFileEmpty => 'ఫోటో ఖాళీగా ఉంది.';

  @override
  String get catalogueErrorsDuplicateImage =>
      'ఈ ఫోటో ఈ డిజైన్, రంగుకు ఇప్పటికే ఉంది.';

  @override
  String get catalogueErrorsNoLines => 'కనీసం ఒక డిజైన్ జోడించండి.';

  @override
  String get catalogueErrorsDuplicateLine =>
      'ఒక డిజైన్, రంగు జాబితాలో రెండుసార్లు ఉంది.';

  @override
  String get catalogueErrorsUnknownAccount =>
      'జాబితా నుండి పార్టీని ఎంచుకోండి.';

  @override
  String get catalogueErrorsInvalidDays => 'లింక్ 1 నుండి 90 రోజులు ఉండవచ్చు.';

  @override
  String get catalogueErrorsShareLinkStale =>
      'ఆ లింక్ ఇప్పుడు యాక్టివ్ కాదు. ముందు కొత్త లింక్ చేయండి.';

  @override
  String get catalogueErrorsInvalidPhone =>
      '10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp సందేశాన్ని అంగీకరించలేదు. తర్వాత ప్రయత్నించండి.';

  @override
  String get labelsTitle => 'బార్‌కోడ్, ధర లేబుల్స్';

  @override
  String get labelsSubtitle =>
      'లేబుల్ రోల్, A4 షీట్ లేదా హ్యాంగ్ ట్యాగ్‌పై బార్‌కోడ్, MRP, సైజుతో ముద్రించండి.';

  @override
  String get labelsSearch => 'బార్‌కోడ్ స్కాన్ చేయండి లేదా పేరు టైప్ చేయండి';

  @override
  String get labelsWholeDesign => 'మొత్తం డిజైన్';

  @override
  String get labelsAddOneEach => 'ప్రతి సైజుకు ఒకటి';

  @override
  String get labelsAddStock => 'స్టాక్‌లో ప్రతి ముక్కకు ఒకటి';

  @override
  String get labelsItem => 'వస్తువు';

  @override
  String get labelsBarcode => 'బార్‌కోడ్';

  @override
  String get labelsMrp => 'MRP';

  @override
  String get labelsPrice => 'ధర';

  @override
  String get labelsLabels => 'లేబుల్స్';

  @override
  String get labelsNoBarcode => 'లేదు';

  @override
  String get labelsRemove => 'తొలగించండి';

  @override
  String get labelsEmpty =>
      'లేబుల్స్ జోడించడానికి వస్తువులను స్కాన్ చేయండి లేదా వెతకండి, లేదా డిజైన్ ఎంచుకోండి.';

  @override
  String get labelsStock => 'లేబుల్ రకం';

  @override
  String get labelsTemplatesRoll50x25 => 'రోల్, 50 x 25 mm, ఒక వరుస';

  @override
  String get labelsTemplatesRoll38x25x2 => 'రోల్, 38 x 25 mm, రెండు వరుసలు';

  @override
  String get labelsTemplatesA4x65 => 'A4 షీట్, 65 లేబుల్స్ (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'హ్యాంగ్ ట్యాగ్, 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'వ్యాపారం పేరు';

  @override
  String get labelsFieldsName => 'వస్తువు పేరు';

  @override
  String get labelsFieldsDesign => 'డిజైన్ నం.';

  @override
  String get labelsFieldsColourSize => 'రంగు, సైజు';

  @override
  String get labelsFieldsMrp => 'MRP';

  @override
  String get labelsFieldsPrice => 'అమ్మకం ధర';

  @override
  String get labelsFieldsExtra => 'అదనపు లైన్';

  @override
  String get labelsExtraText => 'అదనపు లైన్ పాఠ్యం';

  @override
  String get labelsExtraHint => 'ఉదా. తయారీ నెల లేదా తయారీదారు చిరునామా.';

  @override
  String get labelsPreview => 'అసలు పరిమాణంలో ప్రివ్యూ';

  @override
  String get labelsPreviewEmpty => 'లేబుల్ చూడటానికి వస్తువు జోడించండి.';

  @override
  String labelsPrint(String n) {
    return '$n లేబుల్స్ ముద్రించండి';
  }

  @override
  String get labelsPrintHint =>
      'ప్రింట్ విండో లేబుల్ పరిమాణంలో తెరుచుకుంటుంది; లేబుల్ ప్రింటర్ ఎంచుకుని మార్జిన్లు ఏదీ లేదుగా ఉంచండి.';

  @override
  String get labelsNothingToPrint =>
      'ముద్రించడానికి ఏమీ లేదు. ఇన్వెంటరీలో లేబుల్స్ ఎంచుకుని ప్రింట్ నొక్కండి.';

  @override
  String get labelsForBill => 'ఈ సరుకుకు లేబుల్స్ ముద్రించండి';

  @override
  String get labelsPrintLabels => 'లేబుల్స్ ముద్రించండి';

  @override
  String get shareSendWhatsApp => 'వాట్సాప్‌లో పంపండి';

  @override
  String get shareSend => 'పంపండి';

  @override
  String get shareMobile => 'మొబైల్ నంబర్';

  @override
  String shareSentTo(String to) {
    return '$to కు వాట్సాప్ పంపబడింది';
  }

  @override
  String get shareAgain => 'మళ్లీ పంపండి';

  @override
  String get shareFailed => 'పంపలేదు. నంబర్ చూసి మళ్లీ ప్రయత్నించండి.';

  @override
  String get shareAutoFailed =>
      'బిల్లు ఆటోమేటిక్‌గా వాట్సాప్‌కు వెళ్లలేదు. మళ్లీ పంపండి.';

  @override
  String get shareRemind => 'గుర్తు చేయండి';

  @override
  String get shareRemindAll => 'బకాయిదారులందరికీ గుర్తు చేయండి';

  @override
  String get shareRemindAllConfirm =>
      'బకాయి బిల్లులున్న ప్రతి కస్టమర్‌కు వాట్సాప్‌లో చెల్లింపు రిమైండర్ పంపాలా?';

  @override
  String get shareReminded => 'రిమైండర్ పంపబడింది';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n రిమైండర్లు పంపబడ్డాయి',
      zero: 'రిమైండర్లు ఏవీ పంపలేదు',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'మొబైల్ నంబర్ లేదు, ఫోన్ చేయండి: $names';
  }

  @override
  String get shareLogTitle => 'వాట్సాప్ లాగ్';

  @override
  String get shareLogSubtitle =>
      'కస్టమర్లకు పంపిన అన్ని బిల్లులు, ఇన్వాయిస్‌లు, రిమైండర్లు, సందేశాలు, కొత్తవి ముందు.';

  @override
  String get shareFilterAll => 'అన్నీ';

  @override
  String get shareFilterSent => 'పంపినవి';

  @override
  String get shareFilterFailed => 'విఫలం';

  @override
  String get shareThisMonth => 'లెక్క ఈ నెలకు';

  @override
  String get shareWhen => 'ఎప్పుడు';

  @override
  String get shareToCol => 'ఎవరికి';

  @override
  String get shareKind => 'రకం';

  @override
  String get shareMessage => 'సందేశం';

  @override
  String get shareStatus => 'స్థితి';

  @override
  String shareBy(String name) {
    return 'పంపినవారు $name';
  }

  @override
  String get shareNone =>
      'ఇంకా సందేశాలు లేవు. వాట్సాప్‌లో పంపే బిల్లులు, ఇన్వాయిస్‌లు, రిమైండర్లు ఇక్కడ కనిపిస్తాయి.';

  @override
  String get shareKindsBillShare => 'కౌంటర్ బిల్లు';

  @override
  String get shareKindsInvoiceShare => 'ఇన్వాయిస్';

  @override
  String get shareKindsPaymentReminderLink => 'చెల్లింపు రిమైండర్';

  @override
  String get shareKindsPaymentReminder => 'చెల్లింపు రిమైండర్';

  @override
  String get shareKindsOrderConfirmation => 'ఆర్డర్ నిర్ధారణ';

  @override
  String get shareKindsFollowUp => 'ఫాలో-అప్';

  @override
  String get shareExpiredTitle => 'ఈ లింక్ ఇప్పుడు పనిచేయదు';

  @override
  String get shareExpired =>
      'లింక్ గడువు ముగిసింది. షాప్‌ని మళ్లీ పంపమని అడగండి.';

  @override
  String get shareStatement => 'ఖాతా స్టేట్‌మెంట్';

  @override
  String shareStatementFor(String name) {
    return '$name ఖాతా స్టేట్‌మెంట్';
  }

  @override
  String shareAsOf(String date) {
    return '$date నాటికి';
  }

  @override
  String get shareBalance => 'చెల్లించాల్సినది';

  @override
  String shareOverdue(String amount) {
    return '₹$amount గడువు దాటింది';
  }

  @override
  String get shareBill => 'బిల్లు';

  @override
  String get shareDate => 'తేదీ';

  @override
  String get shareDue => 'చెల్లింపు తేదీ';

  @override
  String get shareLate => 'ఆలస్యం';

  @override
  String get shareAmount => 'మొత్తం';

  @override
  String shareDays(num n) {
    return '$n రోజులు';
  }

  @override
  String get shareNotDue => 'ఇంకా గడువు రాలేదు';

  @override
  String get shareNothingOpen => 'ఏమీ బకాయి లేదు. ధన్యవాదాలు.';

  @override
  String shareAdvance(String amount) {
    return 'తీసివేత, అడ్వాన్స్: ₹$amount';
  }

  @override
  String get sharePayTo => 'ఇక్కడ చెల్లించండి';

  @override
  String get shareStatementNote =>
      'మీరు ఇప్పటికే చెల్లించి ఉంటే ఈ స్టేట్‌మెంట్‌ను పట్టించుకోకండి లేదా చెల్లింపు వివరాలు మాకు పంపండి.';

  @override
  String get shareErrorsInvalidPhone => '10 అంకెల మొబైల్ నంబర్ ఇవ్వండి.';

  @override
  String get shareErrorsNothingOutstanding => 'బకాయి ఏమీ లేదు.';

  @override
  String get shareErrorsSendFailed =>
      'వాట్సాప్ సందేశాన్ని స్వీకరించలేదు. మళ్లీ ప్రయత్నించండి.';

  @override
  String get shareErrorsOutside24hWindow =>
      'ఈ కస్టమర్ 24 గంటల్లో సందేశం పంపలేదు, కాబట్టి ఆమోదించిన టెంప్లేట్ కావాలి. సందేశ టెంప్లేట్లలో దాని ఆమోదిత పేరు ఇవ్వండి.';

  @override
  String get shareErrorsBillVoid => 'ఈ బిల్లు రద్దయింది.';

  @override
  String get shareErrorsInvoiceCancelled => 'ఈ ఇన్వాయిస్ రద్దయింది.';

  @override
  String get shareErrorsUnknownTemplate =>
      'సందేశ టెంప్లేట్ ఆర్కైవ్ అయింది. సందేశ టెంప్లేట్లలో దాన్ని తిరిగి తెండి.';

  @override
  String get launcherTitle => 'అన్ని పనులు';

  @override
  String get launcherSubtitle =>
      'ప్రతి ఎంట్రీ, స్క్రీన్, రిపోర్ట్ ఒకే చోట. నక్షత్రం నొక్కి టైల్‌ను నా మెనూలో చేర్చండి.';

  @override
  String get launcherFilter => 'పని వెతకడానికి టైప్ చేయండి';

  @override
  String get launcherPin => 'నా మెనూలో చేర్చండి';

  @override
  String get launcherUnpin => 'నా మెనూ నుండి తీసేయండి';

  @override
  String get launcherSaveFailed => 'నా మెనూ సేవ్ కాలేదు. మళ్లీ ప్రయత్నించండి.';

  @override
  String get launcherNoMatch => 'దీనికి సరిపడేది ఏదీ లేదు.';

  @override
  String get launcherDone => 'అయిపోయింది';

  @override
  String get launcherEdit => 'టైల్స్ మార్చండి';

  @override
  String get launcherAddTiles => 'టైల్స్ చేర్చండి';

  @override
  String get launcherReset => 'మొదటి టైల్స్‌కు తిరిగి వెళ్ళండి';

  @override
  String get launcherMoveLeft => 'ముందుకు జరపండి';

  @override
  String get launcherMoveRight => 'వెనక్కి జరపండి';

  @override
  String get launcherEmpty => 'ఇంకా టైల్స్ లేవు. అన్ని పనుల నుండి చేర్చండి.';

  @override
  String get launcherMyMenu => 'నా మెనూ';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'నమస్తే $name. మీ సొంత టైల్స్; టైల్స్ మార్చండితో మార్చండి.';
  }

  @override
  String get launcherWaiting => 'మీ కోసం వేచి ఉన్నవి';

  @override
  String get launcherSalesToday => 'నేటి అమ్మకాలు';

  @override
  String get launcherToCollect => 'వసూలు చేయాల్సినది';

  @override
  String get launcherToPay => 'చెల్లించాల్సినది';

  @override
  String launcherOverdue(String amount) {
    return '$amount గడువు దాటింది';
  }

  @override
  String get launcherFullDashboard => 'పూర్తి డ్యాష్‌బోర్డ్';

  @override
  String get launcherGroupsEntries => 'కొత్త ఎంట్రీ';

  @override
  String get launcherGroupsPos => 'షోరూమ్ కౌంటర్';

  @override
  String get launcherGroupsSales => 'అమ్మకాలు';

  @override
  String get launcherGroupsPurchase => 'కొనుగోలు';

  @override
  String get launcherGroupsInventory => 'స్టాక్';

  @override
  String get launcherGroupsManufacturing => 'ఉత్పత్తి, జాబ్ వర్క్';

  @override
  String get launcherGroupsAccounts => 'ఖాతాలు, GST';

  @override
  String get launcherGroupsBanking => 'బ్యాంకింగ్';

  @override
  String get launcherGroupsReports => 'రిపోర్టులు';

  @override
  String get launcherGroupsCrm => 'కస్టమర్లు, వాట్సాప్';

  @override
  String get launcherGroupsHr => 'సిబ్బంది, జీతాలు';

  @override
  String get launcherGroupsExpenses => 'ఖర్చులు';

  @override
  String get launcherGroupsAssets => 'స్థిర ఆస్తులు';

  @override
  String get launcherGroupsProjects => 'ప్రాజెక్టులు';

  @override
  String get launcherGroupsHome => 'హోమ్';

  @override
  String get launcherGroupsSettings => 'సెట్టింగ్‌లు';

  @override
  String get launcherLaunchpad => 'లాంచ్‌ప్యాడ్';

  @override
  String launcherPinned(String n) {
    return '$n పిన్ చేసినవి';
  }

  @override
  String get launcherRecent => 'ఇటీవల తెరిచినవి';

  @override
  String get launcherMoney => 'నేటి డబ్బు';

  @override
  String launcherVsYesterday(String pct) {
    return 'నిన్నటితో $pct%';
  }

  @override
  String launcherCounterBills(num n) {
    return '$n కౌంటర్ బిల్లులు';
  }

  @override
  String get launcherCashToday => 'కౌంటర్లలో నగదు';

  @override
  String get launcherUpiToday => 'కౌంటర్లలో UPI';

  @override
  String get launcherCardToday => 'కౌంటర్లలో కార్డ్';

  @override
  String get launcherOverdueToCollect => 'గడువు దాటిన వసూలు';

  @override
  String get launcherAllTab => 'అన్నీ';

  @override
  String get launcherGridView => 'టైల్స్';

  @override
  String get launcherListView => 'జాబితా';

  @override
  String get launcherOpen => 'తెరవండి';

  @override
  String launcherCount(String n) {
    return 'మీరు తెరవగల $n స్క్రీన్లు, ఎంట్రీలు';
  }

  @override
  String get menuHMasters => 'మాస్టర్లు';

  @override
  String get menuHTransaction => 'లావాదేవీ';

  @override
  String get menuHReports => 'రిపోర్టులు';

  @override
  String get menuHAccountReports => 'ఖాతా రిపోర్టులు';

  @override
  String get menuHPayroll => 'జీతాలు';

  @override
  String get menuHUtility => 'యుటిలిటీ';

  @override
  String get menuHChat => 'చాట్';

  @override
  String get menuHExit => 'నిష్క్రమించు';

  @override
  String get menuSoon => 'త్వరలో';

  @override
  String get menuNotBuilt => 'ఇంకా తయారు కాలేదు; జాబితాలో ఉంది.';

  @override
  String get menuFilter => 'ఫిల్టర్';

  @override
  String get menuHome => 'హోమ్';

  @override
  String get menuOpenScreens => 'తెరిచిన స్క్రీన్లు';

  @override
  String get menuGAccount => 'ఖాతా';

  @override
  String get menuGStock => 'స్టాక్';

  @override
  String get menuGParameters => 'పారామితులు';

  @override
  String get menuGPromotion => 'ప్రమోషన్ మాస్టర్';

  @override
  String get menuGSales => 'అమ్మకాల లావాదేవీ';

  @override
  String get menuGAccounting => 'అకౌంటింగ్ లావాదేవీ';

  @override
  String get menuGPurchase => 'కొనుగోలు లావాదేవీ';

  @override
  String get menuGJobwork => 'జాబ్‌వర్క్ లావాదేవీ';

  @override
  String get menuGOther => 'ఇతర లావాదేవీ';

  @override
  String get menuGSalesReports => 'అమ్మకాల రిపోర్టులు';

  @override
  String get menuGStockReports => 'స్టాక్ రిపోర్టులు';

  @override
  String get menuGCustomReports => 'సొంత రిపోర్టులు, తనిఖీలు';

  @override
  String get menuGAccountReportsGroup => 'ఖాతా రిపోర్ట్ సమూహం';

  @override
  String get menuGFinalReportGroup => 'తుది రిపోర్ట్ సమూహం';

  @override
  String get menuGMasterGroup => 'మాస్టర్ సమూహం';

  @override
  String get menuGPayrollTransactionGroup => 'జీతాల లావాదేవీ సమూహం';

  @override
  String get menuGReportGroup => 'రిపోర్ట్ సమూహం';

  @override
  String get menuGUtilityGroup => 'యుటిలిటీ సమూహం';

  @override
  String get menuGBarcodeGroup => 'బార్‌కోడ్ సమూహం';

  @override
  String get menuGExtraUtility => 'అదనపు యుటిలిటీ';

  @override
  String get menuGUserManagement => 'వినియోగదారుల నిర్వహణ';

  @override
  String get menuGSoftwareUtility => 'సాఫ్ట్‌వేర్ యుటిలిటీ';

  @override
  String get menuGChatGroup => 'చాట్, కస్టమర్లు';

  @override
  String get menuIAccountMaster => 'ఖాతా మాస్టర్';

  @override
  String get menuIBankMaster => 'బ్యాంక్ మాస్టర్';

  @override
  String get menuIOpeningBalance => 'ప్రారంభ నిల్వ';

  @override
  String get menuIBalanceSheetGroup => 'బ్యాలెన్స్ షీట్ సమూహం';

  @override
  String get menuIAccountGroup => 'ఖాతా సమూహం';

  @override
  String get menuIAccountCategory => 'ఖాతా వర్గం';

  @override
  String get menuIRegionMaster => 'ప్రాంత మాస్టర్';

  @override
  String get menuICustomerSubCategory => 'కస్టమర్ ఉప వర్గం';

  @override
  String get menuIRemarksMaster => 'వ్యాఖ్యల మాస్టర్';

  @override
  String get menuICompanyMaster => 'కంపెనీ మాస్టర్';

  @override
  String get menuICountryMaster => 'దేశ మాస్టర్';

  @override
  String get menuIDepartmentMaster => 'విభాగ మాస్టర్';

  @override
  String get menuIManufactureCompany => 'తయారీ కంపెనీ';

  @override
  String get menuIBrandMaster => 'బ్రాండ్ మాస్టర్';

  @override
  String get menuIProductMaster => 'ఉత్పత్తి మాస్టర్';

  @override
  String get menuIStyleMaster => 'స్టైల్ మాస్టర్';

  @override
  String get menuIItemGroup => 'వస్తు సమూహం';

  @override
  String get menuIItemMaster => 'వస్తు మాస్టర్';

  @override
  String get menuIDesignMaster => 'డిజైన్ మాస్టర్';

  @override
  String get menuIColorMaster => 'రంగు మాస్టర్';

  @override
  String get menuISizeGroupMaster => 'సైజు సమూహ మాస్టర్';

  @override
  String get menuISizeMaster => 'సైజు మాస్టర్';

  @override
  String get menuIFabric => 'బట్ట';

  @override
  String get menuISleeves => 'చేతులు';

  @override
  String get menuINeck => 'మెడ';

  @override
  String get menuIFit => 'ఫిట్';

  @override
  String get menuISeason => 'సీజన్';

  @override
  String get menuIStyleAttr => 'స్టైల్';

  @override
  String get menuIGender => 'లింగం';

  @override
  String get menuITypeMaster => 'రకం మాస్టర్';

  @override
  String get menuISubCategory9 => 'ఉప వర్గం 9';

  @override
  String get menuISubCategory10 => 'ఉప వర్గం 10';

  @override
  String get menuIMaterialMaster => 'మెటీరియల్ మాస్టర్';

  @override
  String get menuIFixedBarcode => 'స్థిర బార్‌కోడ్';

  @override
  String get menuIMinMaxStock => 'కనిష్ఠ గరిష్ఠ స్టాక్';

  @override
  String get menuIOpeningStock => 'ప్రారంభ స్టాక్';

  @override
  String get menuISeasonMaster => 'సీజన్ మాస్టర్';

  @override
  String get menuIProcessMaster => 'ప్రక్రియ మాస్టర్';

  @override
  String get menuIOrderType => 'ఆర్డర్ రకం';

  @override
  String get menuIWarehouses => 'గోదాములు, స్టోర్లు';

  @override
  String get menuIDayBookMaster => 'డేబుక్ మాస్టర్';

  @override
  String get menuILedgerParameter => 'లెడ్జర్ పారామితి';

  @override
  String get menuISalesmanMaster => 'సేల్స్‌మన్ మాస్టర్';

  @override
  String get menuITaxMaster => 'పన్ను మాస్టర్';

  @override
  String get menuITdsMaster => 'TDS మాస్టర్';

  @override
  String get menuITcsTaxMaster => 'TCS పన్ను మాస్టర్';

  @override
  String get menuIFinanceYearMaster => 'ఆర్థిక సంవత్సర మాస్టర్';

  @override
  String get menuIHsnCodeMaster => 'HSN కోడ్ మాస్టర్';

  @override
  String get menuISalesReturnReason => 'అమ్మకం వాపసు కారణం';

  @override
  String get menuISalesmanCommTarget => 'సేల్స్‌మన్ కమిషన్ లక్ష్యం';

  @override
  String get menuIItemDiscountSetup => 'వస్తు డిస్కౌంట్ సెటప్';

  @override
  String get menuIPromoMaster => 'ప్రోమో మాస్టర్';

  @override
  String get menuISisSetup => 'SIS సెటప్';

  @override
  String get menuIItemCommissionSetup => 'వస్తు కమిషన్ సెటప్';

  @override
  String get menuISourceMaster => 'మూల మాస్టర్';

  @override
  String get menuISalesOrderWh => 'అమ్మకం ఆర్డర్ (టోకు)';

  @override
  String get menuIWhSalesOrderCancel => 'టోకు ఆర్డర్ రద్దు';

  @override
  String get menuIDeliveryOrder => 'డెలివరీ ఆర్డర్ (D.O)';

  @override
  String get menuIDeliveryChallan => 'డెలివరీ చలాన్';

  @override
  String get menuISalesBillWh => 'అమ్మకం బిల్లు (టోకు)';

  @override
  String get menuIDeliveryChallanReturnWh => 'డెలివరీ చలాన్ వాపసు (టోకు)';

  @override
  String get menuICreditNoteWh => 'క్రెడిట్ నోట్ (టోకు)';

  @override
  String get menuIAdvanceReceipt => 'అడ్వాన్స్ రసీదు';

  @override
  String get menuICashPayRec => 'నగదు చెల్లింపు/స్వీకరణ';

  @override
  String get menuIBankPayRec => 'బ్యాంక్ చెల్లింపు/స్వీకరణ';

  @override
  String get menuIBillWiseReceipt => 'బిల్లు వారీ రసీదు';

  @override
  String get menuICardReceipt => 'కార్డ్ రసీదు';

  @override
  String get menuIJournalVoucher => 'జర్నల్ వోచర్';

  @override
  String get menuIContraVoucher => 'కాంట్రా వోచర్';

  @override
  String get menuIPurchaseOrder => 'కొనుగోలు ఆర్డర్';

  @override
  String get menuIInwardChallan => 'ఇన్‌వర్డ్ చలాన్';

  @override
  String get menuIPurchase => 'కొనుగోలు';

  @override
  String get menuIGoodsReturn => 'సరుకు వాపసు';

  @override
  String get menuIDebitNote => 'డెబిట్ నోట్';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'జాబ్ ఇష్యూ';

  @override
  String get menuIJobReceipt => 'జాబ్ రసీదు';

  @override
  String get menuIJobWorkIssue => 'జాబ్‌వర్క్ ఇష్యూ';

  @override
  String get menuIJobWorkReceipt => 'జాబ్‌వర్క్ రసీదు';

  @override
  String get menuIStockAdjustment => 'స్టాక్ సర్దుబాటు';

  @override
  String get menuISampleIssue => 'నమూనా ఇష్యూ';

  @override
  String get menuISampleReceive => 'నమూనా స్వీకరణ';

  @override
  String get menuIQuotation => 'కొటేషన్';

  @override
  String get menuILrTransportEntry => 'LR/రవాణా ఎంట్రీ';

  @override
  String get menuIEWayBill => 'ఈ-వే బిల్లు';

  @override
  String get menuIRePackingBox => 'రీప్యాకింగ్ బాక్స్';

  @override
  String get menuIReOpenBox => 'బాక్స్ మళ్లీ తెరవండి';

  @override
  String get menuILedgerReport => 'లెడ్జర్ రిపోర్ట్';

  @override
  String get menuICashBookReport => 'నగదు పుస్తక రిపోర్ట్';

  @override
  String get menuIBankReport => 'బ్యాంక్ రిపోర్ట్';

  @override
  String get menuIBankReconciliation => 'బ్యాంక్ సమన్వయం';

  @override
  String get menuIGroupMonthSummary => 'సమూహం/నెల సారాంశం';

  @override
  String get menuICashBankExpense => 'నగదు బ్యాంక్ ఖర్చు';

  @override
  String get menuICashFlowReportGroup => 'నగదు ప్రవాహ రిపోర్ట్';

  @override
  String get menuIBillToBillAdjustment => 'బిల్లు నుండి బిల్లు సర్దుబాటు';

  @override
  String get menuIMsmeReport => 'MSME రిపోర్ట్';

  @override
  String get menuIOutstandingPayable => 'బకాయి చెల్లించాల్సినవి';

  @override
  String get menuIOutstandingReceivable => 'బకాయి రావాల్సినవి';

  @override
  String get menuIDebtorsList => 'రుణగ్రహీతల జాబితా';

  @override
  String get menuICreditorList => 'రుణదాతల జాబితా';

  @override
  String get menuIInterestReport => 'వడ్డీ రిపోర్ట్';

  @override
  String get menuIDepreciationAssetReport => 'తరుగుదల ఆస్తి రిపోర్ట్';

  @override
  String get menuIJournalVoucherReport => 'జర్నల్ వోచర్ రిపోర్ట్';

  @override
  String get menuIGstReport => 'GST రిపోర్ట్';

  @override
  String get menuITdsReport => 'TDS రిపోర్ట్';

  @override
  String get menuITdsForm26q => 'TDS ఫారం 26Q';

  @override
  String get menuIFinalReport => 'తుది రిపోర్ట్';

  @override
  String get menuIRcmRegister => 'RCM రిజిస్టర్';

  @override
  String get menuITcsReport => 'TCS రిపోర్ట్';

  @override
  String get menuIEmployee => 'ఉద్యోగి';

  @override
  String get menuIEmployeeKyc => 'ఉద్యోగి KYC నవీకరణ';

  @override
  String get menuISalaryDeduction => 'జీతం కోత';

  @override
  String get menuIWeekOff => 'వారపు సెలవు';

  @override
  String get menuIWeekOffCancel => 'వారపు సెలవు రద్దు';

  @override
  String get menuIHolidays => 'సెలవులు';

  @override
  String get menuIDesignation => 'హోదా';

  @override
  String get menuIDepartment => 'విభాగం';

  @override
  String get menuIShiftMaster => 'షిఫ్ట్ మాస్టర్';

  @override
  String get menuIDailyAttendance => 'రోజువారీ హాజరు';

  @override
  String get menuILeaveApplication => 'సెలవు దరఖాస్తు';

  @override
  String get menuIAdvanceSalary => 'అడ్వాన్స్ జీతం (ఉపాడ్)';

  @override
  String get menuILoanIssue => 'రుణం జారీ';

  @override
  String get menuILoanReceipt => 'రుణ వసూలు';

  @override
  String get menuIMonthlySalary => 'నెలవారీ జీతం';

  @override
  String get menuIStipend => 'స్టైపెండ్';

  @override
  String get menuISalaryPayment => 'జీతం చెల్లింపు';

  @override
  String get menuIStipendPayment => 'స్టైపెండ్ చెల్లింపు';

  @override
  String get menuIIncentive => 'ప్రోత్సాహకం';

  @override
  String get menuIOtherDeduction => 'ఇతర కోత';

  @override
  String get menuIAdvanceLoanRequest => 'అడ్వాన్స్, రుణ అభ్యర్థన';

  @override
  String get menuIMonthlyAttendanceRegister => 'నెలవారీ హాజరు రిజిస్టర్';

  @override
  String get menuIDayWiseAttendanceRegister => 'రోజు వారీ హాజరు రిజిస్టర్';

  @override
  String get menuISalarySlipRegister => 'జీతం స్లిప్ రిజిస్టర్';

  @override
  String get menuIPtReport => 'PT రిపోర్ట్';

  @override
  String get menuILeaveReport => 'సెలవు రిపోర్ట్';

  @override
  String get menuIMenuLogSessionReport => 'మెనూ లాగ్ సెషన్ రిపోర్ట్';

  @override
  String get menuIPayrollParameter => 'జీతాల పారామితి';

  @override
  String get menuIDeviceSettings => 'పరికర సెట్టింగ్‌లు';

  @override
  String get menuIBarcodePrint => 'బార్‌కోడ్ ప్రింట్';

  @override
  String get menuIBarcodeSearch => 'బార్‌కోడ్ శోధన';

  @override
  String get menuIBarcodeDesignImage => 'బార్‌కోడ్/డిజైన్ చిత్రం';

  @override
  String get menuIRateUpdation => 'ధర నవీకరణ';

  @override
  String get menuIImageCatalogue => 'చిత్ర కేటలాగ్';

  @override
  String get menuISalesDiscountMaster => 'అమ్మకం డిస్కౌంట్ మాస్టర్';

  @override
  String get menuISalesDiscountDesignWise => 'డిజైన్ వారీ అమ్మకం డిస్కౌంట్';

  @override
  String get menuISalesmanCommission => 'సేల్స్‌మన్ కమిషన్';

  @override
  String get menuIDayClose => 'రోజు ముగింపు';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'ఈమెయిల్';

  @override
  String get menuIBulkMessenger => 'బల్క్ మెసెంజర్';

  @override
  String get menuILogHistoryReport => 'లాగ్ చరిత్ర రిపోర్ట్';

  @override
  String get menuIOutstandingAdj => 'బకాయి సర్దుబాటు';

  @override
  String get menuIResetPhysicalStock => 'భౌతిక స్టాక్ రీసెట్';

  @override
  String get menuIPhysicalStockVerification => 'భౌతిక స్టాక్ ధృవీకరణ';

  @override
  String get menuIMerge => 'విలీనం';

  @override
  String get menuISalesStockLedgerDiff => 'అమ్మకం స్టాక్ లెడ్జర్ తేడా';

  @override
  String get menuINoteReport => 'నోట్ రిపోర్ట్';

  @override
  String get menuIEInvoiceUpload => 'ఈ-ఇన్వాయిస్ అప్‌లోడ్';

  @override
  String get menuIEWayBillUpload => 'ఈ-వే బిల్లు అప్‌లోడ్';

  @override
  String get menuIAutoOutstandingReminder => 'ఆటో బకాయి రిమైండర్';

  @override
  String get menuIUsers => 'వినియోగదారులు';

  @override
  String get menuIUserGroup => 'వినియోగదారు సమూహం';

  @override
  String get menuICurrentDateSetting => 'ప్రస్తుత తేదీ సెట్టింగ్';

  @override
  String get menuIDataLockTillDate => 'తేదీ వరకు డేటా లాక్';

  @override
  String get menuIMyDevices => 'నా పరికరాలు';

  @override
  String get menuILedgerStockPosting => 'లెడ్జర్, స్టాక్ పోస్టింగ్';

  @override
  String get menuIReportType => 'రిపోర్ట్ రకం';

  @override
  String get menuIUserParameter => 'వినియోగదారు పారామితి';

  @override
  String get menuIBalanceTransfer => 'నిల్వ బదిలీ';

  @override
  String get menuIDatabaseBackup => 'డేటాబేస్ బ్యాకప్';

  @override
  String get menuISoftwareUpdate => 'సాఫ్ట్‌వేర్ నవీకరణ';

  @override
  String get menuIDbUpdates => 'DB నవీకరణలు';

  @override
  String get menuIScheduleBackup => 'బ్యాకప్ షెడ్యూల్';

  @override
  String get menuIExportVouchersPdf => 'వోచర్లను PDF కి ఎగుమతి';

  @override
  String get menuIEmployeeDepartment => 'విభాగం';

  @override
  String get menuISensitiveChanges => 'సున్నితమైన మార్పులు';

  @override
  String get menuITransporterMaster => 'ట్రాన్స్‌పోర్టర్ మాస్టర్';

  @override
  String get listsSubtitle =>
      'ఈ వ్యాపారం సొంత జాబితా. ఎంట్రీని తొలగించే బదులు ఆర్కైవ్ చేయండి, పాత పత్రాల్లో దాని విలువ నిలుస్తుంది.';

  @override
  String get listsName => 'పేరు';

  @override
  String get listsCode => 'కోడ్';

  @override
  String get listsNote => 'గమనిక';

  @override
  String get listsNewEntry => 'కొత్త ఎంట్రీ';

  @override
  String listsShowArchived(String n) {
    return 'ఆర్కైవ్ చేసినవి చూపు ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n ఎంట్రీలు',
      one: '$n ఎంట్రీ',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'ఆర్కైవ్ చేయి';

  @override
  String get listsRestore => 'పునరుద్ధరించు';

  @override
  String get listsNoMatch => 'శోధనకు సరిపోయే ఎంట్రీ లేదు.';

  @override
  String get listsEmpty =>
      'ఈ జాబితాలో ఇంకా ఏమీ లేదు. మొదటి ఎంట్రీని పై వరుసలో రాయండి.';

  @override
  String get listsEmptyReadOnly => 'ఈ జాబితాలో ఇంకా ఏమీ లేదు.';

  @override
  String get listsOtherLists => 'జాబితాలు';

  @override
  String get listsErrorsLookupTaken =>
      'ఈ జాబితాలో ఈ పేరుతో ఎంట్రీ ఇప్పటికే ఉంది.';

  @override
  String get listsErrorsEndBeforeStart =>
      'ముగింపు తేదీ ప్రారంభ తేదీ కంటే ముందుంది.';

  @override
  String get limitsTitle => 'కనిష్ఠ మరియు గరిష్ఠ నిల్వ';

  @override
  String get limitsSubtitle =>
      'ప్రతి వస్తువు గిడ్డంగిలో కనిష్ఠంగా, గరిష్ఠంగా ఎంత ఉండాలో నిర్ణయించండి. కనిష్ఠం కంటే తక్కువ ఉన్న వస్తువులపై గుర్తు పడుతుంది, ఏమి ఆర్డర్ చేయాలో తెలుస్తుంది.';

  @override
  String get limitsWarehouse => 'గిడ్డంగి';

  @override
  String limitsOnlyBelow(String n) {
    return 'కనిష్ఠం కంటే తక్కువ మాత్రమే ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n వరుసలు సేవ్ అయ్యాయి',
      one: '$n వరుస సేవ్ అయింది',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return 'మారిన $n వరుసలను సేవ్ చేయి';
  }

  @override
  String get limitsItem => 'వస్తువు';

  @override
  String get limitsInStock => 'నిల్వలో';

  @override
  String get limitsMin => 'కనిష్ఠం';

  @override
  String get limitsMax => 'గరిష్ఠం';

  @override
  String get limitsToOrder => 'ఆర్డర్ చేయాలి';

  @override
  String get limitsBelow => 'కనిష్ఠం కంటే తక్కువ';

  @override
  String get limitsNoMatch => 'సరిపోయే వస్తువు లేదు.';

  @override
  String get limitsEmpty =>
      'ఇంకా వస్తువులు లేవు. ముందు వస్తువులు లేదా స్టైల్స్ చేర్చి, ఆపై ఇక్కడ పరిమితులు సెట్ చేయండి.';

  @override
  String get limitsErrorsMaxBelowMin => 'గరిష్ఠం కనిష్ఠం కంటే తక్కువ ఉండకూడదు.';

  @override
  String get billReceiptTitleReceivable => 'బిల్లుల వారీ రసీదు';

  @override
  String get billReceiptTitlePayable => 'బిల్లుల వారీ చెల్లింపు';

  @override
  String get billReceiptSubtitleReceivable =>
      'అందిన మొత్తాన్ని నమోదు చేసి, అది ఏ బిల్లులకో ఎంచుకోండి. మిగిలినది ఖాతాలో ఉండి పాత బిల్లులను ముందుగా తీరుస్తుంది.';

  @override
  String get billReceiptSubtitlePayable =>
      'సరఫరాదారుకు చేసిన చెల్లింపును నమోదు చేసి, అది ఏ బిల్లులకో ఎంచుకోండి. మిగిలినది ఖాతాలో ఉండి పాత బిల్లులను ముందుగా తీరుస్తుంది.';

  @override
  String get billReceiptTabReceipt => 'రసీదు';

  @override
  String get billReceiptTabPayment => 'చెల్లింపు';

  @override
  String get billReceiptCustomer => 'కస్టమర్';

  @override
  String get billReceiptSupplier => 'సరఫరాదారు';

  @override
  String get billReceiptChoose => 'పార్టీని ఎంచుకోండి';

  @override
  String get billReceiptAccount => 'నగదు లేదా బ్యాంకు ఖాతా';

  @override
  String get billReceiptAmountReceived => 'అందిన మొత్తం';

  @override
  String get billReceiptAmountPaid => 'చెల్లించిన మొత్తం';

  @override
  String get billReceiptReference => 'సూచన (చెక్కు, UPI ఐడి)';

  @override
  String get billReceiptOpenBills => 'పెండింగ్ బిల్లులు';

  @override
  String billReceiptAdvance(String amount) {
    return 'ఇప్పటికే ఖాతాలో: $amount';
  }

  @override
  String get billReceiptFillOldest => 'పాతదాని నుండి నింపు';

  @override
  String get billReceiptClear => 'తొలగించు';

  @override
  String get billReceiptBill => 'బిల్లు';

  @override
  String get billReceiptDueOn => 'గడువు';

  @override
  String get billReceiptPending => 'పెండింగ్';

  @override
  String get billReceiptPayNow => 'ఇప్పుడు చెల్లించు';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n రోజులు ఆలస్యం',
      one: '$n రోజు ఆలస్యం',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'ఈ పార్టీకి పెండింగ్ బిల్లులు లేవు.';

  @override
  String get billReceiptOnBills => 'బిల్లులపై';

  @override
  String get billReceiptOnAccount => 'ఖాతాలో';

  @override
  String get billReceiptSaveReceipt => 'రసీదు సేవ్ చేయి';

  @override
  String get billReceiptSavePayment => 'చెల్లింపు సేవ్ చేయి';

  @override
  String billReceiptSaved(String number) {
    return '$number గా సేవ్ అయింది';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'బిల్లుల మొత్తం ఇచ్చిన మొత్తం కంటే ఎక్కువ.';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'ఈ బిల్లులలో ఒకటి ఇకపై పెండింగ్‌లో లేదు. పేజీని మళ్లీ లోడ్ చేసి ప్రయత్నించండి.';

  @override
  String get billReceiptErrorsOverBill => 'ఒక మొత్తం బిల్లు బకాయి కంటే ఎక్కువ.';

  @override
  String get billReceiptErrorsAmountRequired => 'మొత్తాన్ని నమోదు చేయండి.';

  @override
  String get billReceiptErrorsBillTwice => 'ఒకే బిల్లు రెండుసార్లు ఉంది.';

  @override
  String get booksTitle => 'ఖాతా పుస్తకాలు';

  @override
  String get booksSubtitle =>
      'నగదు మరియు బ్యాంకు కదలికలు, ఒక గ్రూపు నెలవారీ స్థితి, నగదు మరియు బ్యాంకు నుండి ఖర్చు, డబ్బు ఎక్కడి నుండి వచ్చి ఎక్కడికి వెళ్లింది.';

  @override
  String get booksCash => 'నగదు పుస్తకం';

  @override
  String get booksBank => 'బ్యాంకు పుస్తకం';

  @override
  String get booksGroup => 'గ్రూపు నెలవారీ';

  @override
  String get booksExpense => 'నగదు మరియు బ్యాంకు ఖర్చు';

  @override
  String get booksFlow => 'నగదు ప్రవాహం';

  @override
  String get booksShow => 'చూపు';

  @override
  String get booksPickGroup => 'ఖాతా గ్రూపు';

  @override
  String get booksOpening => 'ప్రారంభ నిల్వ';

  @override
  String get booksReceipts => 'వసూళ్లు';

  @override
  String get booksPayments => 'చెల్లింపులు';

  @override
  String get booksClosing => 'ముగింపు నిల్వ';

  @override
  String get booksAccounts => 'ఖాతాలు';

  @override
  String get booksByDay => 'రోజువారీ';

  @override
  String get booksMonth => 'నెల';

  @override
  String get booksDebit => 'డెబిట్';

  @override
  String get booksCredit => 'క్రెడిట్';

  @override
  String get booksExpenseAccount => 'ఖర్చు ఖాతా';

  @override
  String get booksVouchers => 'వోచర్లు';

  @override
  String get booksOtherSide => 'ఎంట్రీ యొక్క అవతలి వైపు';

  @override
  String get booksMoneyIn => 'వచ్చిన డబ్బు';

  @override
  String get booksMoneyOut => 'వెళ్లిన డబ్బు';

  @override
  String get booksNet => 'నికరం';

  @override
  String get booksTotal => 'మొత్తం';

  @override
  String get booksEmpty => 'ఈ కాలంలో ఏమీ లేదు.';

  @override
  String get booksNoAccounts => 'ఈ గ్రూపులో ఇంకా ఖాతాలు లేవు.';

  @override
  String get booksRcm => 'ఆర్‌సిఎం రిజిస్టర్';

  @override
  String get booksAdjust => 'బిల్లు నుండి బిల్లు సర్దుబాటు';

  @override
  String get booksVoucher => 'వోచర్';

  @override
  String get booksBill => 'తీర్చిన బిల్లు';

  @override
  String get booksParty => 'పార్టీ';

  @override
  String get booksAmount => 'మొత్తం';

  @override
  String get booksSupplier => 'సరఫరాదారు';

  @override
  String get booksInvoice => 'సరఫరాదారు బిల్లు';

  @override
  String get booksTaxable => 'పన్ను పరిధి';

  @override
  String get booksCgst => 'సిజిఎస్టి';

  @override
  String get booksSgst => 'ఎస్జిఎస్టి / యుటిజిఎస్టి';

  @override
  String get booksIgst => 'ఐజిఎస్టి';

  @override
  String get booksCess => 'సెస్';

  @override
  String get hubReportsTitle => 'రిపోర్టులు';

  @override
  String get hubReportsSubtitle =>
      'ప్రతి రిపోర్ట్ ఒకే చోట, అది జవాబిచ్చే ప్రశ్న ప్రకారం.';

  @override
  String get hubMastersTitle => 'మాస్టర్లు';

  @override
  String get hubMastersSubtitle =>
      'ప్రతి బిల్లు, వోచర్ ఆధారపడే రికార్డులు: మీరు అమ్మేవి, ఎవరితో లావాదేవీలు, ధరలు, నియమాలు, స్టోర్లు, కౌంటర్లు.';

  @override
  String get hubGroupsMerchandise => 'సరుకులు';

  @override
  String get hubGroupsParties => 'పార్టీలు, సిబ్బంది';

  @override
  String get hubGroupsCommercial => 'ధరలు, ఆఫర్లు, పన్ను';

  @override
  String get hubGroupsOperational => 'స్టోర్లు, కౌంటర్లు, నియమాలు';

  @override
  String get hubGroupsSales => 'అమ్మకాలు';

  @override
  String get hubGroupsStock => 'స్టాక్';

  @override
  String get hubGroupsAccounts => 'ఖాతా రిపోర్టులు';

  @override
  String get hubGroupsTax => 'పన్ను, చట్టబద్ధం';

  @override
  String get hubGroupsAudit => 'తనిఖీలు, ఆడిట్';

  @override
  String get hubGroupsCustom => 'మీ సొంత రిపోర్టులు';

  @override
  String get hubAboutMerchandise => 'డిజైన్లు, సైజులు, రంగులు, ఫొటోలు';

  @override
  String get hubAboutParties => 'కస్టమర్లు, సరఫరాదారులు, ఖాతాలు; సిబ్బంది';

  @override
  String get hubAboutCommercial =>
      'వస్తువులు ఏ ధరకు అమ్ముతారు, ఏ GST వర్తిస్తుంది';

  @override
  String get hubAboutOperational =>
      'స్టాక్ ఎక్కడ ఉంటుంది, కౌంటర్లు, నంబర్లు ఎలా పని చేస్తాయి';

  @override
  String get hubAboutSales => 'ఏమి అమ్మారు, ఎక్కడ, ఎవరికి';

  @override
  String get hubAboutStock => 'అల్మారాలో ఏముంది, ఎన్ని రోజులుగా';

  @override
  String get hubAboutAccounts => 'ఎవరు ఎంత బాకీ, లాభం, ఖాతాలు';

  @override
  String get hubAboutTax => 'GST రిటర్నులు, జీతాల చట్టబద్ధం, పన్ను తరుగుదల';

  @override
  String get hubAboutAudit => 'చూడాల్సిన మినహాయింపులు, ఎవరు ఏమి మార్చారు';

  @override
  String get hubAboutCustom =>
      'మీ సొంతవి తయారు చేసి, సేవ్ చేసి, షెడ్యూల్ చేయండి';

  @override
  String get exchangeOpen => 'వాపసు లేదా మార్పు';

  @override
  String get exchangeTitle => 'ఈ బిల్లుపై వాపసు వచ్చే సరుకు';

  @override
  String exchangeTaking(num pieces, String number) {
    return '$number నుండి $pieces పీసులు వాపసు';
  }

  @override
  String get exchangeCredit => 'క్రెడిట్';

  @override
  String get exchangeAdd => 'ఈ బిల్లుపై వాపసు తీసుకోండి';

  @override
  String exchangeCreditUsed(String number) {
    return '$number పై వాపసు';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount క్రెడిట్ మిగిలింది; అది స్టోర్ క్రెడిట్‌గా ఉంటుంది.';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'వాపసు $number ఈ బిల్లు నుండి $amount తగ్గించింది.';
  }

  @override
  String exchangeLeftCode(String amount) {
    return '$amount స్టోర్ క్రెడిట్ మిగిలింది, కోడ్:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'వాపసు (బిల్లు $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'స్టోర్ క్రెడిట్ $amount, కోడ్ $code';
  }

  @override
  String get inwardTransporter => 'ట్రాన్స్‌పోర్టర్';

  @override
  String get inwardLrNumber => 'LR నంబర్';

  @override
  String get inwardLrDate => 'LR తేదీ';

  @override
  String get inwardMarkup => 'మార్క్-అప్ %';

  @override
  String get inwardMarkupHint => 'ఖర్చు నుండి MRP నింపుతుంది';

  @override
  String get inwardRounding => 'MRP రౌండ్ చేయండి';

  @override
  String get inwardRound1 => 'దగ్గరి రూపాయి';

  @override
  String get inwardRound9 => '9 తో ముగుస్తుంది (1,299)';

  @override
  String get inwardRound10 => 'తదుపరి 10';

  @override
  String get inwardRound50 => 'తదుపరి 50';

  @override
  String get inwardCost => 'ఖర్చు';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'మార్క్-అప్';

  @override
  String get inwardMarkupTitle => 'ఖర్చుపై MRP, ఖర్చులో %';

  @override
  String get inwardMarginCol => 'మార్జిన్';

  @override
  String get inwardMarginTitle => 'MRP నుండి ఖర్చు వరకు తగ్గింపు, MRPలో %';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces పీసులు, ఖర్చు $value';
  }

  @override
  String get inwardLastPurchases => 'గత కొనుగోళ్లు';

  @override
  String get inwardPickLine => 'ముందు ఖర్చు చూడడానికి ఒక లైన్ ఎంచుకోండి.';

  @override
  String get inwardCurrentMrp => 'ప్రస్తుత MRP';

  @override
  String get inwardInStock => 'స్టాక్‌లో';

  @override
  String get inwardDate => 'తేదీ';

  @override
  String get inwardNeverBought => 'ఇంతకు ముందు కొనలేదు.';

  @override
  String get inwardPrintLabels => 'ఈ పీసులకు లేబుల్స్ ముద్రించండి';

  @override
  String get inwardDocument => 'చలాన్';

  @override
  String get inwardState => 'రాష్ట్రం';

  @override
  String get inwardTransport => 'రవాణా';

  @override
  String get inwardSizeCurve => 'సైజు వారీగా పీసులు';

  @override
  String get inwardTotalQty => 'పీసులు';

  @override
  String get inwardAtCost => 'ఖర్చుతో';

  @override
  String get inwardAvgMarkup => 'మార్క్-అప్';

  @override
  String get countsTitle => 'స్టాక్ లెక్కింపు';

  @override
  String get countsSubtitle =>
      'బార్‌కోడ్‌లు స్కాన్ చేసి స్టోర్ లెక్కించండి. ఆమోదించేవారు తేడాలు, వాటి విలువ చూస్తారు; ఆమోదంతో ఖాతాలు సరిపోతాయి.';

  @override
  String get countsWholeStore => 'మొత్తం స్టోర్';

  @override
  String get countsWhat => 'ఏమి లెక్కించాలి';

  @override
  String get countsByAll => 'స్టోర్‌లోని అన్ని సరుకులు';

  @override
  String get countsByBrand => 'ఒక బ్రాండ్';

  @override
  String get countsByCategory => 'ఒక వర్గం';

  @override
  String get countsByStyleId => 'ఒక డిజైన్';

  @override
  String get countsName => 'పేరు';

  @override
  String get countsNamePlaceholder => 'ఉదా. కుర్తా గోడ';

  @override
  String get countsBlind =>
      'బ్లైండ్ లెక్కింపు (లెక్కించేవారు ఖాతా అంకెలు చూడరు)';

  @override
  String get countsBlindShort => 'బ్లైండ్ లెక్కింపు';

  @override
  String get countsStart => 'లెక్కింపు ప్రారంభించండి';

  @override
  String get countsScanHere => 'బార్‌కోడ్ స్కాన్ చేయండి';

  @override
  String get countsAdd => 'చేర్చు';

  @override
  String get countsScanHint =>
      'ప్రతి స్కాన్ ఒక పీసు చేరుస్తుంది. ఐదుకు 5*బార్‌కోడ్ టైప్ చేయండి, లేదా క్రింది పట్టికలో సంఖ్య రాయండి.';

  @override
  String get countsOutOfScope => 'ఈ లెక్కింపులో లేదు, చేర్చబడింది';

  @override
  String get countsStatusCounting => 'లెక్కిస్తున్నారు';

  @override
  String get countsStatusSubmitted => 'ఆమోదం కోసం వేచి ఉంది';

  @override
  String get countsStatusApproved => 'ఆమోదించబడింది, ఖాతాలు సరిచేయబడ్డాయి';

  @override
  String get countsStatusCancelled => 'రద్దు';

  @override
  String get countsJournal => 'స్టాక్ సర్దుబాటు చూడండి';

  @override
  String get countsPiecesCounted => 'లెక్కించిన పీసులు';

  @override
  String get countsItemsCounted => 'లెక్కించిన వస్తువులు';

  @override
  String get countsInBooks => 'ఖాతాలో';

  @override
  String get countsShort => 'తక్కువ (విలువ)';

  @override
  String get countsExcess => 'ఎక్కువ (విలువ)';

  @override
  String get countsNet => 'నికర తేడా';

  @override
  String get countsBlindNote =>
      'బ్లైండ్ లెక్కింపు: సమర్పించిన తర్వాత ఖాతా అంకెలు కనిపిస్తాయి.';

  @override
  String get countsSubmit => 'లెక్కింపు ముగించండి';

  @override
  String get countsReason => 'తేడాలకు కారణం';

  @override
  String countsApproveAdjust(num n) {
    return 'ఆమోదించి $n వస్తువులు సరిచేయండి';
  }

  @override
  String get countsApproveNone => 'ఆమోదించండి (తేడాలు లేవు)';

  @override
  String get countsRecount => 'మళ్లీ లెక్కించడానికి వెనక్కి పంపండి';

  @override
  String get countsWaitingApproval =>
      'యజమాని లేదా అడ్మిన్ తేడాలను ఆమోదిస్తారు.';

  @override
  String get countsCancelConfirm =>
      'ఈ లెక్కింపు రద్దు చేయాలా? ఖాతాల్లో ఏమీ మారదు.';

  @override
  String get countsCancel => 'లెక్కింపు రద్దు చేయండి';

  @override
  String get countsOnlyDiff => 'తేడా ఉన్న వస్తువులు మాత్రమే చూపించండి';

  @override
  String get countsItem => 'వస్తువు';

  @override
  String get countsCounted => 'లెక్కించింది';

  @override
  String get countsDiff => 'తేడా';

  @override
  String get countsValue => 'విలువ';

  @override
  String get countsNoDiff => 'ఖాతాల నుండి ఏదీ తేడా లేదు.';

  @override
  String get countsNumber => 'లెక్కింపు';

  @override
  String get countsStarted => 'ప్రారంభం';

  @override
  String get countsState => 'స్థితి';

  @override
  String get countsNone => 'ఇంకా లెక్కింపులు లేవు.';

  @override
  String get countsErrorsCountClosed => 'ఈ లెక్కింపు ఇక తెరిచి లేదు.';

  @override
  String get countsErrorsCountNotSubmitted => 'ముందు లెక్కింపు ముగించండి.';

  @override
  String get countsErrorsReasonRequired => 'తేడాలకు కారణం ఇవ్వండి.';

  @override
  String get countsErrorsUnknownBarcode => 'ఈ బార్‌కోడ్‌తో వస్తువు లేదు.';

  @override
  String get countsErrorsNothingToCount => 'ఆ ఎంపికకు సరిపడే సరుకు లేదు.';

  @override
  String get countsErrorsUnknownWarehouse => 'స్టోర్ ఎంచుకోండి.';

  @override
  String get countsErrorsTooManyCodes =>
      'ఫైల్‌లో 5,000 కంటే ఎక్కువ వేర్వేరు బార్‌కోడ్‌లు ఉన్నాయి. విభజించి భాగాలుగా దిగుమతి చేయండి.';

  @override
  String get countsImportTitle => 'స్కానర్ ఫైల్‌ను దిగుమతి చేయి';

  @override
  String get countsImportHelp =>
      'హ్యాండ్‌హెల్డ్ స్కానర్ టెక్స్ట్ ఫైల్: ప్రతి వరుసలో ఒక బార్‌కోడ్, లేదా బార్‌కోడ్ మరియు పరిమాణం (\"8901234567890,3\"). పునరావృత బార్‌కోడ్‌లు కలుస్తాయి.';

  @override
  String get countsImportMode => 'సంఖ్యలతో ఏమి చేయాలి';

  @override
  String get countsImportAdd => 'ఇప్పటికే లెక్కించిన దానికి కలుపు';

  @override
  String get countsImportReplace => 'ఈ బార్‌కోడ్‌ల లెక్కను మార్చు';

  @override
  String get countsImportChoose => 'ఫైల్ ఎంచుకోండి';

  @override
  String get countsImportReading => 'చదువుతోంది...';

  @override
  String get countsImportTooBig => 'ఈ ఫైల్ చాలా పెద్దది (2 ఎంబి కంటే ఎక్కువ).';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matched వస్తువులు లెక్కించబడ్డాయి',
      one: '$matched వస్తువు లెక్కించబడింది',
    );
    return '$_temp0, $pieces ముక్కలు';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n వస్తువులు ఈ లెక్క జాబితాలో లేవు, జోడించబడ్డాయి.',
      one: '$n వస్తువు ఈ లెక్క జాబితాలో లేదు, జోడించబడింది.',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n కోడ్‌లు వస్తువులు కావు: $list',
      one: '$n కోడ్ వస్తువు కాదు: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n వరుసలను చదవలేకపోయింది (వరుసలు $list)',
      one: '$n వరుసను చదవలేకపోయింది (వరుస $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'స్టాక్ సారాంశం';

  @override
  String stockSubtitle(String method) {
    return 'ప్రతి వస్తువు పరిమాణం, విలువ. $method పద్ధతిలో విలువ కట్టబడింది.';
  }

  @override
  String get stockMethodAverage => 'కదిలే సగటు';

  @override
  String get stockMethodFifo => 'FIFO (ముందు వచ్చింది ముందు పోతుంది)';

  @override
  String get stockWarehouse => 'గిడ్డంగి';

  @override
  String get stockAllWarehouses => 'అన్ని గిడ్డంగులు';

  @override
  String get stockQty => 'పరిమాణం';

  @override
  String get stockRate => 'ధర';

  @override
  String get stockValue => 'విలువ';

  @override
  String get stockTotalValue => 'మొత్తం స్టాక్ విలువ';

  @override
  String get stockBelowReorder => 'రీఆర్డర్ స్థాయి కంటే తక్కువ';

  @override
  String get stockReorderTitle => 'రీఆర్డర్ చేయాల్సిన వస్తువులు';

  @override
  String get stockReorderEmpty => 'ఏ వస్తువూ రీఆర్డర్ స్థాయి కంటే తక్కువ లేదు.';

  @override
  String get stockSuggested => 'సూచించిన ఆర్డర్';

  @override
  String stockLedgerTitle(String item) {
    return 'స్టాక్ లెడ్జర్: $item';
  }

  @override
  String get stockIn => 'లోపలికి';

  @override
  String get stockOut => 'బయటికి';

  @override
  String get stockSourceStockJournal => 'స్టాక్ జర్నల్';

  @override
  String get stockSourceGrn => 'సరుకు స్వీకరణ';

  @override
  String get stockSourcePurchaseBill => 'కొనుగోలు బిల్లు';

  @override
  String get stockSourcePurchaseReturn => 'కొనుగోలు వాపసు';

  @override
  String get stockNegativeWarning =>
      'ఒక వస్తువు స్టాక్ సున్నా కంటే తక్కువకు వెళ్లింది. కొనుగోలు ఎంట్రీ తప్పిపోయిందేమో చూడండి.';

  @override
  String get sjTitle => 'స్టాక్ జర్నల్స్';

  @override
  String get sjSubtitle =>
      'ప్రారంభ స్టాక్, భౌతిక లెక్కింపు సర్దుబాట్లు, గిడ్డంగుల మధ్య బదిలీలు, వినియోగం.';

  @override
  String get sjNew => 'కొత్త స్టాక్ జర్నల్';

  @override
  String get sjKindsOpening => 'ప్రారంభ స్టాక్';

  @override
  String get sjKindsAdjustment => 'సర్దుబాటు';

  @override
  String get sjKindsTransfer => 'బదిలీ';

  @override
  String get sjKindsIssue => 'వినియోగం';

  @override
  String get sjKindHintsOpening =>
      'ఖాతాలు ప్రారంభమైనప్పుడు మీ వద్ద ఉన్న స్టాక్. పరిమాణం, ధర నమోదు చేయండి.';

  @override
  String get sjKindHintsAdjustment =>
      'భౌతిక లెక్కింపు తర్వాత స్టాక్ సరిచేయండి: పరిమాణం జోడించండి లేదా తీసివేయండి.';

  @override
  String get sjKindHintsTransfer =>
      'గిడ్డంగుల మధ్య సరుకును ప్రస్తుత ధరకు తరలించండి.';

  @override
  String get sjKindHintsIssue =>
      'వ్యాపారంలో వాడిన సరుకు (నమూనాలు, స్వంత వాడకం, ఉత్పత్తి).';

  @override
  String get sjDirection => 'జోడించు / తీసివేయి';

  @override
  String get sjAdd => 'జోడించు';

  @override
  String get sjRemove => 'తీసివేయి';

  @override
  String get sjToWarehouse => 'ఈ గిడ్డంగికి';

  @override
  String get sjBatch => 'బ్యాచ్';

  @override
  String get sjExpiry => 'గడువు';

  @override
  String get sjPost => 'స్టాక్ జర్నల్ పోస్ట్ చేయండి';

  @override
  String get sjErrorsRateRequired => 'ప్రారంభ స్టాక్‌కు ధర నమోదు చేయండి.';

  @override
  String get sjErrorsServiceHasNoStock => 'సేవలకు స్టాక్ ఉండదు.';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses =>
      'రెండు వేర్వేరు గిడ్డంగులను ఎంచుకోండి.';

  @override
  String get sjErrorsBatchRequired =>
      'ఈ వస్తువు బ్యాచ్‌లను నమోదు చేస్తుంది: బ్యాచ్ నంబర్ ఇవ్వండి.';

  @override
  String get sjErrorsQtyMustBePositive =>
      'పరిమాణాలు సున్నా కంటే ఎక్కువగా ఉండాలి.';

  @override
  String get purchaseSupplier => 'సరఫరాదారు';

  @override
  String get purchaseChooseSupplier => 'సరఫరాదారుని ఎంచుకోండి…';

  @override
  String get purchaseItem => 'వస్తువు';

  @override
  String get purchaseChooseItem => 'వస్తువు ఎంచుకోండి…';

  @override
  String get purchaseQty => 'పరిమాణం';

  @override
  String get purchaseRate => 'ధర';

  @override
  String get purchaseDiscount => 'తగ్గింపు';

  @override
  String get purchaseGst => 'జీఎస్టీ %';

  @override
  String get purchaseAmount => 'మొత్తం';

  @override
  String get purchaseTaxable => 'పన్ను విధించదగిన విలువ';

  @override
  String get purchaseTotal => 'మొత్తం';

  @override
  String get purchaseStatus => 'స్థితి';

  @override
  String get purchaseStatusesOpen => 'తెరిచి ఉంది';

  @override
  String get purchaseStatusesPartial => 'పాక్షికంగా వచ్చింది';

  @override
  String get purchaseStatusesReceived => 'వచ్చింది';

  @override
  String get purchaseStatusesClosed => 'మూసివేయబడింది';

  @override
  String get purchaseStatusesCancelled => 'రద్దయింది';

  @override
  String get purchaseStatusesPosted => 'పోస్ట్ అయింది';

  @override
  String get purchaseStatusesBilled => 'బిల్ అయింది';

  @override
  String get purchaseOrdersTitle => 'కొనుగోలు ఆర్డర్లు';

  @override
  String get purchaseOrdersSubtitle =>
      'సరఫరాదారుల నుండి మీరు ఏమి ఆర్డర్ చేశారు, ఎంత వచ్చింది.';

  @override
  String get purchaseOrdersNew => 'కొత్త కొనుగోలు ఆర్డర్';

  @override
  String get purchaseOrdersExpectedOn => 'ఆశించిన తేదీ';

  @override
  String get purchaseOrdersOrdered => 'ఆర్డర్ చేసింది';

  @override
  String get purchaseOrdersReceived => 'వచ్చింది';

  @override
  String get purchaseOrdersBilled => 'బిల్ అయింది';

  @override
  String get purchaseOrdersReceive => 'సరుకు స్వీకరించండి';

  @override
  String get purchaseOrdersBill => 'బిల్లు నమోదు చేయండి';

  @override
  String get purchaseOrdersClose => 'ఆర్డర్ మూసివేయండి';

  @override
  String get purchaseReceiptsTitle => 'ఇన్‌వర్డ్ చలాన్';

  @override
  String get purchaseReceiptsSubtitle =>
      'వచ్చిన సరుకు (GRN). స్వీకరణతో స్టాక్ పెరుగుతుంది; బిల్లు తర్వాత వస్తుంది.';

  @override
  String get purchaseReceiptsNew => 'కొత్త ఇన్‌వర్డ్ చలాన్';

  @override
  String get purchaseReceiptsChallan => 'సరఫరాదారు చలాన్ నం.';

  @override
  String get purchaseReceiptsBill => 'బిల్లు నమోదు చేయండి';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'ఆర్డర్ $numberకి వ్యతిరేకంగా';
  }

  @override
  String get purchaseBillsTitle => 'కొనుగోలు బిల్లులు';

  @override
  String get purchaseBillsSubtitle =>
      'సరఫరాదారు ఇన్‌వాయిస్‌లు. ప్రతి బిల్లు కొనుగోళ్లు, ఇన్‌పుట్ జీఎస్టీ, సరఫరాదారు ఖాతాలో పోస్ట్ అవుతుంది.';

  @override
  String get purchaseBillsNew => 'కొత్త కొనుగోలు బిల్లు';

  @override
  String get purchaseBillsInvoiceNo => 'సరఫరాదారు ఇన్‌వాయిస్ నం.';

  @override
  String get purchaseBillsInvoiceDate => 'సరఫరాదారు ఇన్‌వాయిస్ తేదీ';

  @override
  String get purchaseBillsPostingDate => 'పోస్టింగ్ తేదీ';

  @override
  String get purchaseBillsDueOn => 'చెల్లింపు తేదీ';

  @override
  String get purchaseBillsReverseCharge =>
      'రివర్స్ ఛార్జ్ (పన్ను మేము చెల్లిస్తాం)';

  @override
  String get purchaseBillsReturn => 'సరుకు వాపసు ఇవ్వండి';

  @override
  String get purchaseBillsReturned => 'వాపసు ఇచ్చింది';

  @override
  String get purchaseBillsPost => 'బిల్లు పోస్ట్ చేయండి';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'లైన్ $lineలో బిల్లు ధర సరుకు స్వీకరణ ధరకు భిన్నంగా ఉంది. స్టాక్ స్వీకరణ ధరలోనే ఉంటుంది.';
  }

  @override
  String get purchaseReturnsTitle => 'కొనుగోలు వాపసులు';

  @override
  String get purchaseReturnsSubtitle =>
      'సరఫరాదారులకు తిరిగి పంపిన సరుకు (డెబిట్ నోట్లు).';

  @override
  String get purchaseReturnsNew => 'సరుకు వాపసు ఇవ్వండి';

  @override
  String get purchaseReturnsReason => 'కారణం';

  @override
  String get purchaseReturnsPost => 'డెబిట్ నోట్ పోస్ట్ చేయండి';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'బిల్లు $numberకి వ్యతిరేకంగా';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'Sundry Creditors కింది ఖాతాను ఎంచుకోండి.';

  @override
  String get purchaseErrorsUnknownSupplier => 'సరఫరాదారుని ఎంచుకోండి.';

  @override
  String get purchaseErrorsOverReceipt =>
      'ఇది ఆర్డర్‌లో మిగిలిన దానికంటే ఎక్కువ.';

  @override
  String get purchaseErrorsOverBilling =>
      'ఇది వచ్చి ఇంకా బిల్ కాని సరుకు కంటే ఎక్కువ.';

  @override
  String get purchaseErrorsOverReturn =>
      'ఇది బిల్ అయి ఇంకా వాపసు కాని సరుకు కంటే ఎక్కువ.';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'ఈ సరఫరాదారు ఇన్‌వాయిస్ ఇప్పటికే నమోదైంది.';

  @override
  String get purchaseErrorsBillHasReturns =>
      'ముందుగా ఈ బిల్లుకు వ్యతిరేకంగా ఉన్న వాపసులను రద్దు చేయండి.';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'ఈ స్వీకరణకు బిల్లు అయింది; ముందుగా బిల్లును రద్దు చేయండి.';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'ఈ ఆర్డర్‌కు సరుకు వచ్చింది; దాన్ని మూసివేయండి.';

  @override
  String get purchaseErrorsOrderNotOpen => 'ఈ ఆర్డర్ మూసివేయబడింది.';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'సరఫరాదారు ఇన్‌వాయిస్ తేదీ పోస్టింగ్ తేదీ తర్వాత ఉండకూడదు.';

  @override
  String get purchaseErrorsNoLines => 'కనీసం ఒక లైన్ జోడించండి.';

  @override
  String get purchaseErrorsItemArchived => 'ఒక వస్తువు ఆర్కైవ్ చేయబడింది.';

  @override
  String get purchaseReadButton => 'బిల్లు చదవండి';

  @override
  String get purchaseReadHint =>
      'సరఫరాదారు బిల్లు ఫోటో లేదా PDF: ఫారం నింపబడుతుంది, మీరు తనిఖీ చేయండి.';

  @override
  String get purchaseReadReading => 'బిల్లు చదువుతోంది…';

  @override
  String get purchaseReadDone =>
      'బిల్లు నుండి నింపబడింది. సేవ్ చేసే ముందు ప్రతి లైన్‌ను తనిఖీ చేయండి.';

  @override
  String purchaseReadUnmatched(String items) {
    return 'వీటికి వస్తువును ఎంచుకోండి: $items.';
  }

  @override
  String get purchaseReadDemo =>
      'ఆటోమేటిక్ రీడింగ్ సెటప్ కాలేదు; దయచేసి బిల్లును టైప్ చేయండి.';

  @override
  String get purchaseReadNone => 'ఈ బిల్లును చదవలేకపోయాం; దయచేసి టైప్ చేయండి.';

  @override
  String get inventorySettingsTitle => 'సరుకు సెట్టింగ్‌లు';

  @override
  String get inventorySettingsValuation => 'స్టాక్ విలువ కట్టే పద్ధతి';

  @override
  String get inventorySettingsValuationHint =>
      'వాడిన, మిగిలిన స్టాక్ విలువ ఎలా లెక్కిస్తారు. మార్చితే మొదటి నుండి అన్ని స్టాక్‌కు మళ్లీ విలువ కడతారు.';

  @override
  String get inventorySettingsWarehouses => 'గిడ్డంగులు';

  @override
  String get inventorySettingsAddWarehouse => 'గిడ్డంగి జోడించండి';

  @override
  String get inventorySettingsWarehouseName => 'గిడ్డంగి పేరు';

  @override
  String get inventorySettingsDefault => 'ప్రధాన';

  @override
  String get inventorySettingsNameTaken => 'ఈ పేరుతో ఇప్పటికే గిడ్డంగి ఉంది.';

  @override
  String get salesCustomer => 'కస్టమర్';

  @override
  String get salesChooseCustomer => 'కస్టమర్‌ను ఎంచుకోండి…';

  @override
  String get salesPlaceOfSupply => 'సరఫరా స్థలం';

  @override
  String get salesExport => 'ఎగుమతి';

  @override
  String get salesSez => 'SEZ కస్టమర్';

  @override
  String get salesLut => 'LUT కింద (పన్ను లేకుండా)';

  @override
  String get salesStatusesDelivered => 'డెలివరీ అయింది';

  @override
  String get salesStatusesInvoiced => 'ఇన్‌వాయిస్ అయింది';

  @override
  String get salesStatusesAccepted => 'అంగీకరించారు';

  @override
  String get salesStatusesDeclined => 'తిరస్కరించారు';

  @override
  String get salesStatusesConverted => 'మార్చబడింది';

  @override
  String get salesStatusesExpired => 'గడువు ముగిసింది';

  @override
  String get salesOrdersTitle => 'అమ్మకపు ఆర్డర్లు';

  @override
  String get salesOrdersSubtitle =>
      'కస్టమర్లు ఏమి ఆర్డర్ చేశారు, ఎంత పంపబడింది.';

  @override
  String get salesOrdersNew => 'కొత్త అమ్మకపు ఆర్డర్';

  @override
  String get salesOrdersDeliverBy => 'డెలివరీ తేదీ';

  @override
  String get salesOrdersCustomerRef => 'కస్టమర్ PO నం.';

  @override
  String get salesOrdersOrdered => 'ఆర్డర్ చేసింది';

  @override
  String get salesOrdersDelivered => 'డెలివరీ అయింది';

  @override
  String get salesOrdersInvoiced => 'ఇన్‌వాయిస్ అయింది';

  @override
  String get salesOrdersDeliver => 'సరుకు డెలివరీ చేయండి';

  @override
  String get salesOrdersInvoice => 'ఇన్‌వాయిస్ సృష్టించండి';

  @override
  String get salesOrdersClose => 'ఆర్డర్ మూసివేయండి';

  @override
  String get salesDeliveriesTitle => 'డెలివరీ చలాన్లు';

  @override
  String get salesDeliveriesSubtitle =>
      'ఇన్‌వాయిస్ ముందు (లేదా లేకుండా) పంపిన సరుకు. డెలివరీతో స్టాక్ తగ్గుతుంది.';

  @override
  String get salesDeliveriesNew => 'కొత్త డెలివరీ చలాన్';

  @override
  String get salesDeliveriesInvoice => 'ఇన్‌వాయిస్ సృష్టించండి';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'ఆర్డర్ $numberకి వ్యతిరేకంగా';
  }

  @override
  String get salesDeliveriesReason => 'కారణం';

  @override
  String get salesDeliveriesValue => 'విలువ';

  @override
  String get salesDeliveriesTransporter => 'రవాణాదారు';

  @override
  String get salesDeliveriesVehicleNo => 'వాహన సం.';

  @override
  String get salesDeliveriesPrint => 'చలాన్ ముద్రించండి (3 ప్రతులు)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return '$date లోపు ఇన్‌వాయిస్';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    return 'సరుకు $count సార్లు వెనక్కి వచ్చింది: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'సరుకు వెనక్కి తీసుకోండి';

  @override
  String get salesDeliveriesStillOut => 'ఇంకా బయట';

  @override
  String get salesDeliveriesCameBack => 'వెనక్కి వచ్చింది';

  @override
  String get salesDeliveriesSaveReturn => 'రిటర్న్ సేవ్ చేయండి';

  @override
  String get salesDeliveriesNewApproval => 'కొత్త ఆమోద మెమో';

  @override
  String get salesDeliveriesReasonsSupply => 'సరఫరా, ఇన్‌వాయిస్ తర్వాత';

  @override
  String get salesDeliveriesReasonsApproval => 'ఆమోదంపై అమ్మకం';

  @override
  String get salesDeliveriesReasonsJobWork => 'జాబ్ వర్క్';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'సరఫరా కాదు (స్వంత వినియోగం, మరమ్మతు)';

  @override
  String get salesDeliveriesReasonsLots => 'విడతలుగా సరఫరా';

  @override
  String get salesDeliveriesReasonsExhibition => 'ప్రదర్శన లేదా జాతర';

  @override
  String get salesDeliveriesReasonsOther => 'ఇతర';

  @override
  String get salesDeliveriesReasonsSample => 'శాంపిల్స్';

  @override
  String get salesDeliveriesReasonHintsSupply =>
      'సరుకు అమ్ముడైంది; పన్ను ఇన్‌వాయిస్ తర్వాత.';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'అమ్ముడైనది కస్టమర్ ఉంచుకుంటారు. ఆరు నెలల్లో ఇన్‌వాయిస్ చేయండి లేదా సరుకు వెనక్కి తీసుకోండి.';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'ప్రాసెసింగ్‌కు పంపబడింది; సరుకు తిరిగి వస్తుంది.';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'అమ్మకం లేకుండా సరుకు వెళ్తుంది, కాబట్టి పన్ను చూపబడదు.';

  @override
  String get salesDeliveriesReasonHintsLots => 'ఒక సరఫరా అనేక విడతలుగా.';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'ప్రదర్శనలో చూపబడింది; అమ్ముడుపోనిది తిరిగి వస్తుంది.';

  @override
  String get salesDeliveriesReasonHintsOther => 'సరుకు ఇతర ఏ రవాణా అయినా.';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'చూపడానికి లేదా ప్రయత్నించడానికి పంపినది; అమ్మకం కాదు కాబట్టి పన్ను చూపబడదు. ఉంచుకోనివి రిటర్న్‌పై తిరిగి వస్తాయి.';

  @override
  String get salesInvoicesTitle => 'అమ్మకపు ఇన్‌వాయిస్‌లు';

  @override
  String get salesInvoicesSubtitle =>
      'పన్ను ఇన్‌వాయిస్‌లు. ప్రతిదీ అమ్మకాలు, అవుట్‌పుట్ జీఎస్టీ, కస్టమర్ ఖాతాలో పోస్ట్ అవుతుంది.';

  @override
  String get salesInvoicesNew => 'కొత్త ఇన్‌వాయిస్';

  @override
  String get salesInvoicesDueOn => 'చెల్లింపు తేదీ';

  @override
  String get salesInvoicesPost => 'ఇన్‌వాయిస్ సేవ్ చేయండి';

  @override
  String get salesInvoicesPrint => 'ప్రింట్';

  @override
  String get salesInvoicesCreditNote => 'క్రెడిట్ నోట్ / వాపసు';

  @override
  String get salesInvoicesReturned => 'వాపసు వచ్చింది';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'దీనితో కస్టమర్ అప్పు పరిమితిని దాటుతారు ($detail బకాయి).';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return '$detail విలువ సరుకు: తరలించే ముందు ఇ-వే బిల్లు అవసరం.';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'లైన్ $lineNoకి HSN కోడ్ లేదు; పన్ను ఇన్‌వాయిస్‌లో అది అవసరం.';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'కొంత స్టాక్ సున్నా కంటే తక్కువకు వెళ్లింది. కొనుగోలు ఎంట్రీ తప్పిపోయిందేమో చూడండి.';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'ఈ కస్టమర్ ఒక బిల్లు $days రోజులుగా బకాయి ఉంది.';
  }

  @override
  String get salesCreditNotesTitle => 'క్రెడిట్ నోట్లు';

  @override
  String get salesCreditNotesSubtitle =>
      'అమ్మకపు వాపసులు, అమ్మకం తర్వాత ధర తగ్గింపులు.';

  @override
  String get salesCreditNotesNew => 'క్రెడిట్ నోట్';

  @override
  String get salesCreditNotesReason => 'కారణం';

  @override
  String get salesCreditNotesGoodsReturned =>
      'సరుకు స్టాక్‌లోకి తిరిగి వచ్చింది';

  @override
  String get salesCreditNotesPriceReduction =>
      'ధర తగ్గింపు మాత్రమే (సరుకు వాపసు లేదు)';

  @override
  String get salesCreditNotesCreditRate => 'యూనిట్‌కు క్రెడిట్';

  @override
  String get salesCreditNotesPost => 'క్రెడిట్ నోట్ పోస్ట్ చేయండి';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'ఇన్‌వాయిస్ $numberకి వ్యతిరేకంగా';
  }

  @override
  String get salesErrorsNotACustomer =>
      'Sundry Debtors కింది ఖాతాను ఎంచుకోండి.';

  @override
  String get salesErrorsUnknownCustomer => 'కస్టమర్‌ను ఎంచుకోండి.';

  @override
  String get salesErrorsOverDelivery =>
      'ఇది ఆర్డర్‌లో మిగిలిన దానికంటే ఎక్కువ.';

  @override
  String get salesErrorsOverInvoicing =>
      'ఇది డెలివరీ అయి ఇంకా ఇన్‌వాయిస్ కాని సరుకు కంటే ఎక్కువ.';

  @override
  String get salesErrorsOverReturn =>
      'బయట ఉన్నదాని కంటే ఎక్కువ వెనక్కి వస్తోంది.';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'ముందుగా ఈ ఇన్‌వాయిస్‌కు వ్యతిరేకంగా ఉన్న క్రెడిట్ నోట్లను రద్దు చేయండి.';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'ఈ చలాన్‌కు ఇన్‌వాయిస్ అయింది; ముందుగా ఇన్‌వాయిస్‌ను రద్దు చేయండి.';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'ఈ ఆర్డర్‌కు సరుకు పంపబడింది; దాన్ని మూసివేయండి.';

  @override
  String get salesErrorsCancelIrnFirst =>
      'ముందుగా ఇ-ఇన్‌వాయిస్ (IRN) రద్దు చేయండి.';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'క్రెడిట్ ఇన్‌వాయిస్ ధర కంటే ఎక్కువ ఉండకూడదు.';

  @override
  String get salesErrorsRateRequired => 'యూనిట్‌కు క్రెడిట్ నమోదు చేయండి.';

  @override
  String get salesErrorsQuotationNotOpen =>
      'ఈ కొటేషన్ ఇప్పటికే మార్చబడింది లేదా మూసివేయబడింది.';

  @override
  String get salesErrorsQuotationConverted =>
      'ఈ కొటేషన్ మార్చబడింది; ముందుగా దాని నుండి చేసిన ఆర్డర్ లేదా ఇన్‌వాయిస్‌ను రద్దు చేయండి.';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'ఈ కొటేషన్ వేరే కస్టమర్‌ది.';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“వరకు చెల్లుబాటు” కొటేషన్ తేదీకి ముందు ఉండకూడదు.';

  @override
  String get salesErrorsCancelEwbFirst => 'ముందుగా ఇ-వే బిల్లు రద్దు చేయండి.';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'ఈ నెల GSTR-1 ఇప్పటికే దాఖలైంది. ప్రస్తుత నెల తేదీ వాడండి, లేదా జీఎస్టీ పోర్టల్‌లో సవరించండి.';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'అడ్వాన్స్ మొత్తం కంటే ఎక్కువ ఉండకూడదు.';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'ఈ చలాన్‌పై సరుకు వెనక్కి వచ్చింది, కాబట్టి రద్దు చేయలేరు.';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'రిటర్న్ తేదీ చలాన్ తేదీకి ముందు ఉంది.';

  @override
  String get salesErrorsDeliveryCancelled => 'ఈ చలాన్ రద్దయింది.';

  @override
  String get salesErrorsUnknownDeliveryLine => 'ఈ లైన్ ఈ చలాన్‌లో లేదు.';

  @override
  String get salesErrorsCreditBlocked =>
      'ఈ అమ్మకం కస్టమర్‌ను క్రెడిట్ పరిమితి దాటిస్తుంది, వారి ఖాతా బ్లాక్‌లో ఉంది.';

  @override
  String get salesErrorsOverdueBlocked =>
      'ఈ కస్టమర్ ఒక బిల్లు అనుమతించిన దానికంటే ఎక్కువ కాలం బకాయి ఉంది, వారి ఖాతా బ్లాక్‌లో ఉంది.';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'యజమాని లేదా అడ్మిన్ మాత్రమే క్రెడిట్ బ్లాక్‌ను దాటగలరు.';

  @override
  String get salesErrorsNotAnAgent =>
      'బ్రోకర్ లేదా ఏజెంట్‌గా గుర్తించిన ఖాతాను ఎంచుకోండి.';

  @override
  String get salesErrorsUnknownSalesman =>
      'మీ ఉద్యోగుల నుండి సేల్స్‌మెన్‌ను ఎంచుకోండి.';

  @override
  String get salesErrorsUnknownOrder => 'ఆ ఆర్డర్ దొరకలేదు.';

  @override
  String get salesQuotationsTitle => 'కొటేషన్లు';

  @override
  String get salesQuotationsSubtitle =>
      'కస్టమర్లకు ధర ప్రతిపాదనలు. మార్చే వరకు స్టాక్ లేదా ఖాతాలపై ప్రభావం లేదు.';

  @override
  String get salesQuotationsNew => 'కొత్త కొటేషన్';

  @override
  String get salesQuotationsSave => 'కొటేషన్ సేవ్ చేయండి';

  @override
  String get salesQuotationsValidUntil => 'వరకు చెల్లుబాటు';

  @override
  String get salesQuotationsToOrder => 'ఆర్డర్‌గా మార్చండి';

  @override
  String get salesQuotationsToInvoice => 'ఇన్‌వాయిస్‌గా మార్చండి';

  @override
  String get salesQuotationsAccept => 'అంగీకరించినట్లు గుర్తించండి';

  @override
  String get salesQuotationsDecline => 'తిరస్కరించినట్లు గుర్తించండి';

  @override
  String get salesQuotationsPrint => 'ప్రింట్ / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'ఆర్డర్‌గా',
      'other': 'ఇన్‌వాయిస్‌గా',
    });
    return '$_temp0 మార్చబడింది';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'కొటేషన్ $number నుండి';
  }

  @override
  String get salesQuotationsTerms => 'నిబంధనలు';

  @override
  String get salesProformasTitle => 'ప్రొఫార్మా ఇన్‌వాయిస్';

  @override
  String get salesProformasSubtitle =>
      'సరుకు పంపే ముందు చెల్లింపు లేదా అడ్వాన్స్ అడగండి. ఇన్‌వాయిస్ వరకు పన్ను లేదా స్టాక్‌పై ప్రభావం లేదు.';

  @override
  String get salesProformasNew => 'కొత్త ప్రొఫార్మా ఇన్‌వాయిస్';

  @override
  String get salesProformasSave => 'ప్రొఫార్మా సేవ్ చేయండి';

  @override
  String get salesProformasAdvanceDue => 'అడిగిన అడ్వాన్స్';

  @override
  String get salesProformasAdvanceHint =>
      'పూర్తి మొత్తం అడగడానికి ఖాళీగా వదలండి';

  @override
  String get salesApprovalsTitle => 'ఆమోదానికి పంపిన సరుకు';

  @override
  String get salesApprovalsSubtitle =>
      'సరుకు ఇంకా కస్టమర్ వద్ద ఉన్న ఆమోద మెమోలు. అమ్ముడుపోనిది వెనక్కి తీసుకోండి; మిగిలినదానికి ఆరు నెలల్లో ఇన్‌వాయిస్ చేయండి.';

  @override
  String salesApprovalsSummary(num count, String value) {
    return '$count మెమోలు తెరిచి ఉన్నాయి, విలువ $value';
  }

  @override
  String get salesApprovalsDaysOut => 'బయట రోజులు';

  @override
  String salesApprovalsDaysLeft(num days) {
    return '$days రోజులు మిగిలాయి';
  }

  @override
  String get salesApprovalsEmpty => 'ఆమోదంపై ఏ సరుకూ బయట లేదు.';

  @override
  String get salesOverrideCredit => 'అనుమతించి సేవ్ చేయండి';

  @override
  String get salesSamplesTitle => 'బయట ఉన్న శాంపిల్స్';

  @override
  String get salesSamplesSubtitle =>
      'పార్టీలకు పంపి ఇంకా తిరిగి రాని శాంపిల్స్. ఇవి అమ్మకం కాదు, పన్ను ఉండదు. ఉంచుకోనివి వెనక్కి తీసుకోండి.';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count చలానాలు',
      one: '$count చలానా',
    );
    return '$_temp0 లో $pieces ముక్కలు ఇంకా బయట';
  }

  @override
  String get salesSamplesNew => 'కొత్త శాంపిల్ చలానా';

  @override
  String get salesSamplesEmpty => 'ఏ శాంపిల్ బయట లేదు.';

  @override
  String get einvoiceTitle => 'ఇ-ఇన్‌వాయిస్';

  @override
  String get einvoiceStatusNotRequired => 'అవసరం లేదు';

  @override
  String get einvoiceStatusPending => 'IRN పెండింగ్';

  @override
  String get einvoiceStatusGenerated => 'IRN సృష్టించబడింది';

  @override
  String get einvoiceStatusCancelled => 'IRN రద్దయింది';

  @override
  String get einvoiceStatusFailed => 'IRN విఫలమైంది';

  @override
  String get einvoiceGenerate => 'IRN సృష్టించండి';

  @override
  String get einvoiceCancel => 'IRN రద్దు చేయండి';

  @override
  String get einvoiceCancelHint => 'IRN సృష్టించిన 24 గంటల్లోనే రద్దు చేయగలరు.';

  @override
  String get einvoiceReasons1 => 'నకిలీ';

  @override
  String get einvoiceReasons2 => 'డేటా ఎంట్రీ పొరపాటు';

  @override
  String get einvoiceReasons3 => 'ఆర్డర్ రద్దయింది';

  @override
  String get einvoiceReasons4 => 'ఇతర';

  @override
  String get einvoiceRemark => 'వ్యాఖ్య';

  @override
  String get einvoiceIrn => 'IRN';

  @override
  String get einvoiceAckNo => 'అక్నాలెడ్జ్‌మెంట్ నం.';

  @override
  String get einvoiceAckDate => 'అక్నాలెడ్జ్‌మెంట్ తేదీ';

  @override
  String get einvoiceSimulator =>
      'టెస్ట్ మోడ్: జీఎస్టీ ప్రొవైడర్ కనెక్ట్ అయ్యే వరకు IRNలు అంతర్నిర్మిత సిమ్యులేటర్ నుండి వస్తాయి.';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'కస్టమర్‌కు జీఎస్టీఐఎన్ లేదు; ఇ-ఇన్‌వాయిస్‌లు నమోదైన కొనుగోలుదారులు, ఎగుమతులకు మాత్రమే.';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'ఈ ఇన్‌వాయిస్ నంబర్ IRPకి చెల్లదు.';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'కస్టమర్, మీ శాఖకు సరైన పిన్ కోడ్ జోడించండి.';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'కస్టమర్, మీ శాఖ చిరునామాలు జోడించండి.';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn =>
      'ప్రతి వస్తువుకు HSN కోడ్ కావాలి.';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch => 'మొత్తాలు సరిపోలడం లేదు.';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'ముందుగా మీ శాఖ జీఎస్టీఐఎన్ జోడించండి.';

  @override
  String get einvoiceErrorsDuplicateIrn =>
      'IRP వద్ద ఈ ఇన్‌వాయిస్ ఇప్పటికే ఉంది.';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'ఈ IRN రద్దు చేసే 24 గంటలు గడిచిపోయాయి. బదులుగా క్రెడిట్ నోట్ ఇవ్వండి.';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated =>
      'IRN ఇప్పటికే సృష్టించబడింది.';

  @override
  String get einvoiceErrorsCancelEwbFirst =>
      'ముందుగా ఇ-వే బిల్లు రద్దు చేయండి.';

  @override
  String get ewbTitle => 'ఇ-వే బిల్లు';

  @override
  String get ewbGenerate => 'ఇ-వే బిల్లు సృష్టించండి';

  @override
  String get ewbVehicleNo => 'వాహన నం.';

  @override
  String get ewbDistance => 'దూరం (కి.మీ)';

  @override
  String get ewbNumber => 'EWB నం.';

  @override
  String get ewbValidUpto => 'వరకు చెల్లుబాటు';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'ఇది వాహన నంబర్‌లా కనిపించడం లేదు (ఉదా. TS09AB1234).';

  @override
  String get ewbErrorsInvalidDistance => 'దూరాన్ని కి.మీలలో నమోదు చేయండి.';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'ఇ-వే బిల్లు గడువు ముగిసే 8 గంటల ముందు నుండి 8 గంటల తర్వాత వరకు మాత్రమే పొడిగించగలరు.';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'ఈ ఇ-వే బిల్లు రద్దు చేసే 24 గంటలు గడిచిపోయాయి.';

  @override
  String get ewbErrorsEwbExpired =>
      'ఈ ఇ-వే బిల్లు గడువు ముగిసింది; పొడిగించండి.';

  @override
  String get ewbErrorsNoActiveEwb =>
      'ఈ ఇన్‌వాయిస్‌పై క్రియాశీల ఇ-వే బిల్లు లేదు.';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'ఈ ఇన్‌వాయిస్‌పై ఇప్పటికే ఇ-వే బిల్లు క్రియాశీలంగా ఉంది.';

  @override
  String get ewbErrorsInvalidPincode => '6 అంకెల పిన్ కోడ్ నమోదు చేయండి.';

  @override
  String get ewbStatusActive => 'క్రియాశీలం';

  @override
  String get ewbStatusCancelled => 'రద్దయింది';

  @override
  String get ewbChangeVehicle => 'వాహనం మార్చండి';

  @override
  String get ewbExtend => 'చెల్లుబాటు పొడిగించండి';

  @override
  String get ewbCancel => 'ఇ-వే బిల్లు రద్దు చేయండి';

  @override
  String get ewbNewVehicle => 'కొత్త వాహన నం.';

  @override
  String get ewbCurrentPlace => 'ప్రస్తుత ప్రదేశం';

  @override
  String get ewbCurrentPincode => 'ప్రస్తుత పిన్ కోడ్';

  @override
  String get ewbRemainingKm => 'మిగిలిన దూరం (కి.మీ)';

  @override
  String get ewbReason => 'కారణం';

  @override
  String get ewbRemark => 'వ్యాఖ్య';

  @override
  String get ewbSave => 'సేవ్ చేయండి';

  @override
  String get ewbExtendHint =>
      'ఇ-వే బిల్లు గడువు ముగిసే 8 గంటల ముందు నుండి 8 గంటల తర్వాత వరకు అనుమతి.';

  @override
  String get ewbCancelHint => 'సృష్టించిన 24 గంటల్లో, సరుకు కదలకపోతే అనుమతి.';

  @override
  String ewbCancelledNote(String number) {
    return 'ఇ-వే బిల్లు $number రద్దయింది. కొత్తది సృష్టించవచ్చు.';
  }

  @override
  String get ewbVehicleReasons1 => 'వాహనం పాడైంది';

  @override
  String get ewbVehicleReasons2 => 'ట్రాన్స్‌షిప్‌మెంట్';

  @override
  String get ewbVehicleReasons3 => 'ఇతర';

  @override
  String get ewbVehicleReasons4 => 'మొదటిసారి';

  @override
  String get ewbExtendReasons1 => 'ప్రకృతి విపత్తు';

  @override
  String get ewbExtendReasons2 => 'శాంతిభద్రతలు';

  @override
  String get ewbExtendReasons4 => 'ట్రాన్స్‌షిప్‌మెంట్';

  @override
  String get ewbExtendReasons5 => 'ప్రమాదం';

  @override
  String get ewbExtendReasons99 => 'ఇతర';

  @override
  String get ewbCancelReasons1 => 'నకిలీ';

  @override
  String get ewbCancelReasons2 => 'ఆర్డర్ రద్దయింది';

  @override
  String get ewbCancelReasons3 => 'డేటా ఎంట్రీ పొరపాటు';

  @override
  String get ewbCancelReasons4 => 'ఇతర';

  @override
  String get printTaxInvoice => 'పన్ను ఇన్‌వాయిస్';

  @override
  String get printCreditNote => 'క్రెడిట్ నోట్';

  @override
  String get printOriginal => 'గ్రహీత కోసం అసలు ప్రతి';

  @override
  String get printBillTo => 'బిల్లు గ్రహీత';

  @override
  String get printShipTo => 'సరుకు గ్రహీత';

  @override
  String get printInvoiceNo => 'ఇన్‌వాయిస్ నం.';

  @override
  String get printInvoiceDate => 'ఇన్‌వాయిస్ తేదీ';

  @override
  String get printSno => '#';

  @override
  String get printHsn => 'HSN/SAC';

  @override
  String get printTaxSummary => 'పన్ను సారాంశం';

  @override
  String get printRate => 'రేటు';

  @override
  String get printAmountInWords => 'మొత్తం అక్షరాల్లో';

  @override
  String get printBank => 'బ్యాంక్ వివరాలు';

  @override
  String get printTerms => 'నిబంధనలు & షరతులు';

  @override
  String printForCompany(String company) {
    return '$company తరఫున';
  }

  @override
  String get printSignatory => 'అధీకృత సంతకందారు';

  @override
  String get printComputerGenerated => 'ఇది కంప్యూటర్ రూపొందించిన ఇన్‌వాయిస్.';

  @override
  String get printReverseCharge => 'రివర్స్ ఛార్జ్‌పై చెల్లించాల్సిన పన్ను';

  @override
  String get printExportLut => 'IGST చెల్లించకుండా LUT కింద ఎగుమతి కోసం సరఫరా';

  @override
  String get printQuotation => 'కొటేషన్';

  @override
  String get printQuotationNo => 'కొటేషన్ నం.';

  @override
  String get printQuotationDate => 'కొటేషన్ తేదీ';

  @override
  String get printQuotedTo => 'కొటేషన్ గ్రహీత';

  @override
  String get printComputerGeneratedQuote =>
      'ఇది కంప్యూటర్ రూపొందించిన కొటేషన్. ఇచ్చిన తేదీ వరకు ధరలు చెల్లుబాటు.';

  @override
  String get printProforma => 'ప్రొఫార్మా ఇన్‌వాయిస్';

  @override
  String get printProformaNo => 'ప్రొఫార్మా సం.';

  @override
  String get printProformaDate => 'ప్రొఫార్మా తేదీ';

  @override
  String get printComputerGeneratedProforma =>
      'ఇది ప్రొఫార్మా ఇన్‌వాయిస్, పన్ను ఇన్‌వాయిస్ కాదు. సరఫరా సమయంలో పన్ను ఇన్‌వాయిస్ ఇస్తాం.';

  @override
  String get printDeliveryChallan => 'డెలివరీ చలాన్';

  @override
  String get printApprovalMemo => 'ఆమోద మెమో';

  @override
  String get printCopyConsignee => 'స్వీకర్త కోసం అసలు ప్రతి';

  @override
  String get printCopyTransporter => 'రవాణాదారు కోసం రెండో ప్రతి';

  @override
  String get printCopyConsignor => 'పంపినవారి కోసం మూడో ప్రతి';

  @override
  String get printConsignee => 'స్వీకర్త';

  @override
  String get printChallanNo => 'చలాన్ సం.';

  @override
  String get printChallanDate => 'చలాన్ తేదీ';

  @override
  String get printInvoiceBy => 'ఇన్‌వాయిస్ చివరి తేదీ';

  @override
  String get printValue => 'విలువ';

  @override
  String get printNotASupply =>
      'సరఫరా కాని కారణంతో సరుకు పంపబడింది. ఈ చలాన్‌పై పన్ను లేదు.';

  @override
  String get printReceivedBy => 'స్వీకరించినవారు';

  @override
  String get printSignatureAndDate => 'సంతకం మరియు తేదీ';

  @override
  String get outstandingReceivablesTitle => 'రావలసినవి';

  @override
  String get outstandingReceivablesSubtitle =>
      'కస్టమర్ల నుండి రావలసినవి, కాలం వారీగా. రసీదులు ముందుగా పాత బిల్లులను తీరుస్తాయి.';

  @override
  String get outstandingPayablesTitle => 'చెల్లించవలసినవి';

  @override
  String get outstandingPayablesSubtitle =>
      'సరఫరాదారులకు చెల్లించవలసినవి, కాలం వారీగా. చెల్లింపులు ముందుగా పాత బిల్లులను తీరుస్తాయి.';

  @override
  String get outstandingParty => 'పార్టీ';

  @override
  String get outstandingBalance => 'బ్యాలెన్స్';

  @override
  String get outstandingNotDue => 'ఇంకా గడువు రాలేదు';

  @override
  String get outstandingD030 => '1-30 రోజులు';

  @override
  String get outstandingD3160 => '31-60 రోజులు';

  @override
  String get outstandingD6190 => '61-90 రోజులు';

  @override
  String get outstandingAdvance => 'అడ్వాన్స్';

  @override
  String get outstandingOpenItems => 'తెరిచిన బిల్లులు';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days రోజులు ఆలస్యం',
      one: '$days రోజు ఆలస్యం',
      zero: 'గడువు',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'బకాయి ఏమీ లేదు.';

  @override
  String get outstandingD91180 => '91 నుండి 180 రోజులు';

  @override
  String get outstandingD180plus => '180 రోజులకు పైగా';

  @override
  String get returnsTitle => 'జీఎస్టీ రిటర్న్‌లు';

  @override
  String get returnsSubtitle =>
      'మీ ఇన్‌వాయిస్‌లు, బిల్లుల నుండి GSTR-1, GSTR-3B. ఇక్కడే దాఖలు చేయండి, లేదా జీఎస్టీ పోర్టల్ ఆఫ్‌లైన్ టూల్ కోసం JSON డౌన్‌లోడ్ చేయండి.';

  @override
  String get returnsPeriod => 'పన్ను కాలం';

  @override
  String get returnsGstr1 => 'GSTR-1';

  @override
  String get returnsGstr3b => 'GSTR-3B';

  @override
  String get returnsDownload => 'JSON డౌన్‌లోడ్';

  @override
  String get returnsSection => 'విభాగం';

  @override
  String get returnsCount => 'ఇన్‌వాయిస్‌లు';

  @override
  String get returnsTaxable => 'పన్ను విధించదగిన విలువ';

  @override
  String get returnsTax => 'పన్ను';

  @override
  String get returnsB2b => 'B2B: నమోదైన కస్టమర్లు';

  @override
  String get returnsB2cl => 'B2C పెద్దవి: వేరే రాష్ట్రం, ₹1 లక్షకు పైగా';

  @override
  String get returnsB2cs => 'B2C చిన్నవి';

  @override
  String get returnsExp => 'ఎగుమతులు';

  @override
  String get returnsCdn => 'క్రెడిట్ నోట్లు';

  @override
  String get returnsCancelled => 'రద్దైన ఇన్‌వాయిస్‌లు (పత్రాల సారాంశంలో)';

  @override
  String get returnsOutward => '3.1(a) బయటికి పన్ను విధించదగిన సరఫరాలు';

  @override
  String get returnsZeroRated => '3.1(b) సున్నా రేటు (ఎగుమతులు, SEZ)';

  @override
  String get returnsNil => '3.1(c) నిల్ రేటు / మినహాయింపు';

  @override
  String get returnsRcm => '3.1(d) రివర్స్ ఛార్జ్‌పై లోపలికి సరఫరాలు';

  @override
  String get returnsItc => '4. ఇన్‌పుట్ ట్యాక్స్ క్రెడిట్';

  @override
  String get returnsSetOff => '6.1 పన్ను చెల్లింపు';

  @override
  String get returnsHead => 'పన్ను రకం';

  @override
  String get returnsLiability => 'చెల్లించాల్సిన పన్ను';

  @override
  String get returnsPaidByCredit => 'క్రెడిట్‌తో చెల్లించింది';

  @override
  String get returnsCash => 'నగదుగా చెల్లించండి';

  @override
  String get returnsCarryForward => 'ముందుకు తీసుకెళ్లే క్రెడిట్';

  @override
  String get returnsFilingNote =>
      'రిటర్న్‌లు మీ జీఎస్టీ ప్రొవైడర్ ద్వారా దాఖలవుతాయి. ప్రొవైడర్ కనెక్ట్ అయ్యే వరకు టెస్ట్ మోడ్ అంతర్నిర్మిత సిమ్యులేటర్‌ను వాడుతుంది.';

  @override
  String get gstSettingsTitle => 'జీఎస్టీ & ఇన్‌వాయిసింగ్';

  @override
  String get gstSettingsEinvoice => 'ఇ-ఇన్‌వాయిస్‌లు (IRN) సృష్టించండి';

  @override
  String get gstSettingsEinvoiceHint =>
      '2017-18 నుండి ఏ సంవత్సరంలోనైనా టర్నోవర్ ₹5 కోట్లు దాటితే తప్పనిసరి.';

  @override
  String get gstSettingsEwbThreshold => 'ఈ విలువకు పైన ఇ-వే బిల్లు (₹)';

  @override
  String get gstSettingsBilingual =>
      'ఇన్‌వాయిస్‌లు, జీతపు స్లిప్‌లు, ఫారం 16ను రెండు భాషల్లో ప్రింట్ చేయండి';

  @override
  String get gstSettingsPrintLanguage => 'ప్రింట్‌లో రెండవ భాష';

  @override
  String get gstSettingsTerms => 'ఇన్‌వాయిస్ నిబంధనలు & షరతులు';

  @override
  String get gstSettingsBank => 'ఇన్‌వాయిస్‌పై బ్యాంక్ వివరాలు';

  @override
  String get importTitle => 'డేటా దిగుమతి';

  @override
  String get importSubtitle =>
      'స్ప్రెడ్‌షీట్ లేదా Tally నుండి కస్టమర్లు, సరఫరాదారులు, వస్తువులను తీసుకురండి.';

  @override
  String get importParties => 'కస్టమర్లు & సరఫరాదారులు (CSV)';

  @override
  String get importItems => 'వస్తువులు (CSV)';

  @override
  String get importTally => 'Tally XML';

  @override
  String get importTemplate => 'నమూనా CSV డౌన్‌లోడ్';

  @override
  String get importTallyHint =>
      'Tallyలో: Display → List of Accounts → Alt+E (Export), XML ఫార్మాట్. స్టాక్ వస్తువులను కూడా చేర్చండి.';

  @override
  String get importChoose => 'ఫైల్ ఎంచుకోండి';

  @override
  String get importPreview => 'ఫైల్ తనిఖీ చేయండి';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count వరుసలు',
      one: '$count వరుస',
    );
    return '$_temp0 దిగుమతి చేయండి';
  }

  @override
  String get importRow => 'వరుస';

  @override
  String get importStatus => 'ఫలితం';

  @override
  String get importCreate => 'సృష్టించబడుతుంది';

  @override
  String get importExists => 'ఇప్పటికే ఉంది: వదిలేశాం';

  @override
  String get importDone => 'దిగుమతి అయింది.';

  @override
  String get filingTitle => 'జీఎస్టీ పోర్టల్‌లో దాఖలు';

  @override
  String get filingPortal => 'జీఎస్టీ పోర్టల్ కనెక్షన్';

  @override
  String get filingPortalHint =>
      'ముందుగా మీ జీఎస్టీ పోర్టల్ ప్రొఫైల్‌లో “API access” ఆన్ చేయండి. సెషన్ సుమారు 6 గంటలు ఉంటుంది.';

  @override
  String get filingUsername => 'జీఎస్టీ పోర్టల్ యూజర్‌నేమ్';

  @override
  String get filingSendOtp => 'OTP పంపండి';

  @override
  String get filingOtp => 'OTP';

  @override
  String get filingConnect => 'కనెక్ట్ చేయండి';

  @override
  String filingConnected(String username, String time) {
    return '$usernameగా $time వరకు కనెక్ట్ అయింది';
  }

  @override
  String get filingDisconnect => 'డిస్‌కనెక్ట్';

  @override
  String filingSimulatorOtp(String otp) {
    return 'టెస్ట్ మోడ్: OTP $otp.';
  }

  @override
  String get filingUpload => 'అప్‌లోడ్';

  @override
  String get filingUploadAgain => 'మళ్లీ అప్‌లోడ్';

  @override
  String filingUploaded(String time) {
    return '$timeకి అప్‌లోడ్ అయింది';
  }

  @override
  String get filingGetOtp => 'EVC OTP పంపండి';

  @override
  String get filingEvcHint => 'OTP మీ అధీకృత సంతకందారు మొబైల్‌కు వెళ్తుంది.';

  @override
  String get filingFile => 'EVCతో దాఖలు చేయండి';

  @override
  String filingFiled(String time) {
    return '$timeకి దాఖలైంది';
  }

  @override
  String get filingArn => 'ARN';

  @override
  String get filingNotUploaded => 'అప్‌లోడ్ కాలేదు';

  @override
  String get filingLocked =>
      'ఒక నెల GSTR-1 దాఖలయ్యాక ఆ నెల ఇన్‌వాయిస్‌లు, క్రెడిట్ నోట్లు లాక్ అవుతాయి.';

  @override
  String filingCashNote(String amount) {
    return 'దాఖలు చేసే ముందు మీ ఎలక్ట్రానిక్ నగదు లెడ్జర్‌లో $amount ఉంచండి (జీఎస్టీ పోర్టల్‌లో చలాన్).';
  }

  @override
  String get filingErrorsGstSessionRequired =>
      'ముందుగా జీఎస్టీ పోర్టల్‌కు కనెక్ట్ అవ్వండి.';

  @override
  String get filingErrorsGstSessionExpired =>
      'జీఎస్టీ పోర్టల్ సెషన్ ముగిసింది. మళ్లీ కనెక్ట్ అవ్వండి.';

  @override
  String get filingErrorsInvalidOtp => 'ఈ OTP సరైనది కాదు.';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'మీ జీఎస్టీ పోర్టల్ యూజర్‌నేమ్ నమోదు చేయండి.';

  @override
  String get filingErrorsUploadFirst => 'ముందుగా రిటర్న్ అప్‌లోడ్ చేయండి.';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'అప్‌లోడ్ తర్వాత మీ ఖాతాలు మారాయి. మళ్లీ అప్‌లోడ్ చేసి, తర్వాత దాఖలు చేయండి.';

  @override
  String get filingErrorsReturnAlreadyFiled => 'ఈ రిటర్న్ ఇప్పటికే దాఖలైంది.';

  @override
  String get filingErrorsCompanyPanRequired =>
      'కంపెనీ & శాఖలలో వ్యాపారం పాన్ జోడించండి.';

  @override
  String get filingErrorsInvalidPan => 'వ్యాపారం పాన్ చెల్లదు.';

  @override
  String get filingErrorsBranchGstinRequired =>
      'ముందుగా ప్రధాన కార్యాలయం జీఎస్టీఐఎన్ జోడించండి.';

  @override
  String get hrEmployeesTitle => 'ఉద్యోగులు';

  @override
  String get hrEmployeesSubtitle => 'మీ బృందం, వారి జీతాలు, చట్టబద్ధ వివరాలు.';

  @override
  String get hrEmployeesNew => 'ఉద్యోగిని జోడించండి';

  @override
  String get hrEmployeesNone => 'ఇంకా ఉద్యోగులు లేరు.';

  @override
  String get hrSectionsPersonal => 'వ్యక్తిగత';

  @override
  String get hrSectionsJob => 'ఉద్యోగం';

  @override
  String get hrSectionsStatutory => 'PF, ESI & పన్ను';

  @override
  String get hrSectionsBank => 'జీతం చెల్లింపు';

  @override
  String get hrSectionsSalary => 'జీత నిర్మాణం';

  @override
  String get hrCode => 'ఉద్యోగి కోడ్';

  @override
  String get hrCodeHint => 'ఆటోమేటిక్ నంబర్ కోసం ఖాళీగా ఉంచండి';

  @override
  String get hrName => 'పూర్తి పేరు';

  @override
  String get hrNameHi => 'హిందీలో పేరు (ఐచ్ఛికం)';

  @override
  String get hrGender => 'లింగం';

  @override
  String get hrGendersMale => 'పురుషుడు';

  @override
  String get hrGendersFemale => 'స్త్రీ';

  @override
  String get hrGendersOther => 'ఇతర';

  @override
  String get hrDob => 'పుట్టిన తేదీ';

  @override
  String get hrJoinedOn => 'చేరిన తేదీ';

  @override
  String get hrLeftOn => 'వెళ్లిన తేదీ';

  @override
  String get hrFixedTerm => 'నిర్ణీత కాల ఉద్యోగి';

  @override
  String get hrDepartment => 'విభాగం';

  @override
  String get hrDesignation => 'హోదా';

  @override
  String get hrWorkState => 'పని చేసే రాష్ట్రం';

  @override
  String get hrWorkStateHint => 'దీని ఆధారంగా వృత్తి పన్ను నిర్ణయమవుతుంది';

  @override
  String get hrPhone => 'మొబైల్';

  @override
  String get hrEmail => 'ఈమెయిల్';

  @override
  String get hrAddress => 'చిరునామా';

  @override
  String get hrCity => 'నగరం';

  @override
  String get hrPincode => 'పిన్ కోడ్';

  @override
  String get hrPan => 'పాన్';

  @override
  String get hrAadhaarLast4 => 'ఆధార్ (చివరి 4 అంకెలు మాత్రమే)';

  @override
  String get hrUan => 'UAN';

  @override
  String get hrEsiNumber => 'ESI IP నంబర్';

  @override
  String get hrPfMember => 'PF సభ్యుడు';

  @override
  String get hrEpsEligible => 'పెన్షన్ పథకంలో (EPS)';

  @override
  String get hrPfOnActual => 'పూర్తి జీతంపై PF (₹15,000 పైన)';

  @override
  String get hrDisabled => 'దివ్యాంగులు (₹25,000 వరకు ESI)';

  @override
  String get hrTaxRegime => 'పన్ను విధానం';

  @override
  String get hrRegimesNew => 'కొత్త విధానం';

  @override
  String get hrRegimesOld => 'పాత విధానం';

  @override
  String get hrMetro => 'మెట్రో నగరంలో నివసిస్తారు (HRA కోసం)';

  @override
  String get hrPaymentMode => 'చెల్లింపు విధానం';

  @override
  String get hrPaymentModesBank => 'బ్యాంక్ బదిలీ';

  @override
  String get hrPaymentModesCash => 'నగదు';

  @override
  String get hrPaymentModesCheque => 'చెక్కు';

  @override
  String get hrBankName => 'బ్యాంక్';

  @override
  String get hrBankIfsc => 'IFSC';

  @override
  String get hrBankAccount => 'ఖాతా నంబర్';

  @override
  String hrBankAccountHint(String last4) {
    return 'ఎన్‌క్రిప్ట్ చేసి నిల్వ చేయబడింది. నమోదులో: చివరి $last4';
  }

  @override
  String get hrMonthlyGross => 'నెలవారీ స్థూల జీతం';

  @override
  String get hrStatus => 'స్థితి';

  @override
  String get hrStatusesActive => 'క్రియాశీలం';

  @override
  String get hrStatusesLeft => 'వెళ్లిపోయారు';

  @override
  String get hrSave => 'సేవ్ చేయండి';

  @override
  String get hrSaved => 'సేవ్ అయింది';

  @override
  String get hrCreate => 'ఉద్యోగిని జోడించండి';

  @override
  String get hrSalaryTitle => 'జీత నిర్మాణం';

  @override
  String get hrSalaryEffectiveFrom => 'నుండి అమలు';

  @override
  String get hrSalaryComponent => 'భాగం';

  @override
  String get hrSalaryMonthly => 'నెలకు (₹)';

  @override
  String get hrSalaryPfWage => 'బేసిక్/DA (PF జీతం)';

  @override
  String get hrSalaryHra => 'HRA';

  @override
  String get hrSalaryEsiExcluded => 'ESI జీతంలో కాదు';

  @override
  String get hrSalaryAdd => 'భాగం జోడించండి';

  @override
  String get hrSalaryRevise => 'సవరణ సేవ్ చేయండి';

  @override
  String get hrSalaryHistory => 'మునుపటి నిర్మాణాలు';

  @override
  String get hrSalaryGross => 'నెలవారీ స్థూలం';

  @override
  String get hrSalaryAnnual => 'సంవత్సరానికి';

  @override
  String get hrSalaryDefaultsBasic => 'బేసిక్';

  @override
  String get hrSalaryDefaultsHra => 'HRA';

  @override
  String get hrSalaryDefaultsSpecial => 'ప్రత్యేక భత్యం';

  @override
  String get hrDeclarationTitle => 'పన్ను ప్రకటన';

  @override
  String get hrDeclarationHint =>
      'TDS కోసం వాడబడుతుంది. ప్రామాణిక మినహాయింపు కాకుండా ఇతర మినహాయింపులు పాత విధానంలో మాత్రమే.';

  @override
  String get hrDeclarationFy => 'ఆర్థిక సంవత్సరం';

  @override
  String get hrDeclarationRentPaid => 'సంవత్సరంలో చెల్లించిన అద్దె';

  @override
  String get hrDeclarationC80 =>
      '80C పెట్టుబడులు (PF ఆటోమేటిక్‌గా జోడించబడుతుంది)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) NPS';

  @override
  String get hrDeclarationD80 => '80D ఆరోగ్య బీమా';

  @override
  String get hrDeclarationHomeLoanInterest => 'గృహ రుణ వడ్డీ';

  @override
  String get hrDeclarationOtherDeductions => 'ఇతర మినహాయింపులు (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'ఇతర ఆదాయం';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'ఈ సంవత్సరం మునుపటి యజమాని నుండి జీతం';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'ఈ సంవత్సరం ఇప్పటికే తగ్గించిన TDS (మునుపటి యజమాని, లేదా Varchasv ముందు)';

  @override
  String get hrDeclarationSave => 'ప్రకటన సేవ్ చేయండి';

  @override
  String get hrAttendanceTitle => 'హాజరు';

  @override
  String get hrAttendanceSubtitle =>
      'గుర్తించని పని దినాలు హాజరుగా లెక్కించబడతాయి. గైర్హాజరుగా గుర్తించడానికి రోజుపై క్లిక్ చేయండి, తర్వాత సగం రోజు, తర్వాత మళ్లీ హాజరు.';

  @override
  String get hrAttendanceLegendPresent => 'హాజరు';

  @override
  String get hrAttendanceLegendAbsent => 'గైర్హాజరు';

  @override
  String get hrAttendanceLegendHalfDay => 'సగం రోజు';

  @override
  String get hrAttendanceLegendLeave => 'సెలవులో';

  @override
  String get hrAttendanceLegendWeekOff => 'వారపు సెలవు';

  @override
  String get hrAttendanceLegendHoliday => 'పండుగ సెలవు';

  @override
  String get hrAttendanceLegendLate => 'ఆలస్యం';

  @override
  String get hrAttendanceLop => 'జీతం కోత';

  @override
  String get hrAttendanceLocked =>
      'ఈ నెల పేరోల్ ఖరారైంది, కాబట్టి హాజరు మార్చలేరు.';

  @override
  String get hrAttendanceHolidays => 'సెలవు దినాలు';

  @override
  String get hrAttendanceAddHoliday => 'సెలవు జోడించండి';

  @override
  String get hrAttendanceHolidayName => 'సెలవు';

  @override
  String get hrAttendanceNoEmployees => 'ఈ నెల ఎవరూ ఉద్యోగంలో లేరు.';

  @override
  String get hrAttendanceSaving => 'సేవ్ అవుతోంది…';

  @override
  String get hrLeaveTitle => 'సెలవు';

  @override
  String get hrLeaveSubtitle => 'అభ్యర్థనలు, ఆమోదాలు, మిగిలిన సెలవులు.';

  @override
  String get hrLeaveNew => 'సెలవుకు దరఖాస్తు చేయండి';

  @override
  String get hrLeaveEmployee => 'ఉద్యోగి';

  @override
  String get hrLeaveType => 'సెలవు రకం';

  @override
  String get hrLeaveFrom => 'నుండి';

  @override
  String get hrLeaveTo => 'వరకు';

  @override
  String get hrLeaveHalfDay => 'సగం రోజు';

  @override
  String get hrLeaveReason => 'కారణం';

  @override
  String get hrLeaveDays => 'రోజులు';

  @override
  String get hrLeaveSubmit => 'అభ్యర్థన సమర్పించండి';

  @override
  String get hrLeaveApprove => 'ఆమోదించండి';

  @override
  String get hrLeaveReject => 'తిరస్కరించండి';

  @override
  String get hrLeaveCancel => 'రద్దు చేయండి';

  @override
  String get hrLeavePending => 'ఆమోదం కోసం వేచి ఉంది';

  @override
  String get hrLeaveAll => 'అన్ని అభ్యర్థనలు';

  @override
  String get hrLeaveBalances => 'మిగిలిన సెలవులు';

  @override
  String get hrLeaveOpening => 'ముందుకు తెచ్చినవి';

  @override
  String get hrLeaveQuota => 'ఈ సంవత్సరం';

  @override
  String get hrLeaveTaken => 'తీసుకున్నవి';

  @override
  String get hrLeaveBalance => 'మిగిలినవి';

  @override
  String get hrLeaveNone => 'సెలవు అభ్యర్థనలు లేవు.';

  @override
  String get hrLeaveStatusesPending => 'పెండింగ్';

  @override
  String get hrLeaveStatusesApproved => 'ఆమోదించబడింది';

  @override
  String get hrLeaveStatusesRejected => 'తిరస్కరించబడింది';

  @override
  String get hrLeaveStatusesCancelled => 'రద్దయింది';

  @override
  String get hrSettleTitle => 'పూర్తి & తుది సెటిల్‌మెంట్';

  @override
  String get hrSettleHint =>
      'ఉద్యోగిని వెళ్లిపోయినట్లు గుర్తించి, గ్రాట్యుటీ, సెలవు నగదుగా మార్పు చెల్లిస్తుంది. చివరి నెల జీతం పేరోల్ ద్వారా వస్తుంది.';

  @override
  String get hrSettleLeftOn => 'చివరి పని దినం';

  @override
  String get hrSettleServiceYears => 'సర్వీసు (సంవత్సరాలు)';

  @override
  String get hrSettleGratuity => 'గ్రాట్యుటీ';

  @override
  String get hrSettleNotEligible => 'అర్హత లేదు (5 సంవత్సరాల లోపు)';

  @override
  String get hrSettleLeaveDays => 'నగదుగా మార్చే సెలవులు (రోజులు)';

  @override
  String get hrSettleEncashment => 'సెలవు నగదుగా మార్పు';

  @override
  String get hrSettleOtherEarnings => 'ఇతర బకాయిలు (బోనస్, నోటీసు జీతం)';

  @override
  String get hrSettleRecoveries => 'వసూళ్లు (అడ్వాన్సులు)';

  @override
  String get hrSettleRemarks => 'వ్యాఖ్యలు';

  @override
  String get hrSettleTotal => 'నికర చెల్లించాల్సింది';

  @override
  String get hrSettleConfirm => 'సెటిల్ చేసి వెళ్లిపోయినట్లు గుర్తించండి';

  @override
  String hrSettleDone(String date, String amount) {
    return '$dateన సెటిల్ అయింది: $amount';
  }

  @override
  String get hrPayslips => 'జీతపు స్లిప్‌లు';

  @override
  String get hrErrorsInvalidPan => 'ఈ పాన్ చెల్లదు (ఉదా. ABCDE1234F).';

  @override
  String get hrErrorsInvalidIfsc => 'ఈ IFSC చెల్లదు (ఉదా. HDFC0001234).';

  @override
  String get hrErrorsInvalidBankAccount => '6 నుండి 18 అంకెలు నమోదు చేయండి.';

  @override
  String get hrErrorsBasicRequired =>
      'కనీసం ఒక భాగాన్ని బేసిక్/DAగా గుర్తించండి.';

  @override
  String get hrErrorsNoComponents => 'కనీసం ఒక జీత భాగాన్ని జోడించండి.';

  @override
  String get hrErrorsDuplicateComponent => 'రెండు భాగాలకు ఒకే కోడ్ ఉంది.';

  @override
  String get hrErrorsEmployeeCodeTaken => 'ఈ కోడ్ మరో ఉద్యోగిది.';

  @override
  String get hrErrorsDobAfterJoining =>
      'పుట్టిన తేదీ చేరిన తేదీకి ముందు ఉండాలి.';

  @override
  String get hrErrorsBeforeJoining => 'ఇది చేరిన తేదీకి ముందుది.';

  @override
  String get hrErrorsLeaveOverlap => 'ఇది మరో సెలవు అభ్యర్థనతో ఢీకొంటోంది.';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'తగినన్ని సెలవులు లేవు.';

  @override
  String get hrErrorsNoWorkingDays => 'ఈ తేదీలన్నీ సెలవులు లేదా వారపు సెలవులు.';

  @override
  String get hrErrorsHalfDaySingleDate => 'సగం రోజు ఒకే తేదీ అయి ఉండాలి.';

  @override
  String get hrErrorsLeaveCrossesYear => 'మార్చి 31 దాటే సెలవును విభజించండి.';

  @override
  String get hrErrorsNotEmployedOnDate => 'ఆ తేదీన ఉద్యోగంలో లేరు.';

  @override
  String get hrErrorsDayOnLeave =>
      'ఆ రోజు ఆమోదించిన సెలవు ఉంది; ముందుగా సెలవు రద్దు చేయండి.';

  @override
  String get hrErrorsPayrollFinalized => 'ఆ నెల పేరోల్ ఇప్పటికే ఖరారైంది.';

  @override
  String get hrErrorsLeaveNotPending =>
      'ఈ అభ్యర్థనపై ఇప్పటికే నిర్ణయం జరిగింది.';

  @override
  String get hrErrorsLeaveNotOpen => 'ఈ అభ్యర్థన ఇప్పటికే ముగిసింది.';

  @override
  String get hrErrorsLeftBeforeJoining => 'ఇది చేరిన తేదీకి ముందుది.';

  @override
  String get hrErrorsNoSalaryStructure => 'ముందుగా జీత నిర్మాణం జోడించండి.';

  @override
  String get hrErrorsAlreadyLeft => 'ఈ ఉద్యోగికి ఇప్పటికే సెటిల్‌మెంట్ అయింది.';

  @override
  String get hrErrorsRecoveriesExceedDues =>
      'వసూళ్లు బకాయిల కంటే ఎక్కువ ఉండకూడదు.';

  @override
  String get hrErrorsInvalidUan => 'UANలో 12 అంకెలు ఉంటాయి.';

  @override
  String get hrErrorsInvalidEsiNumber =>
      'ESI IP నంబర్‌లో 10 నుండి 17 అంకెలు ఉంటాయి.';

  @override
  String get hrErrorsInvalidAadhaarLast4 =>
      'చివరి 4 అంకెలు మాత్రమే నమోదు చేయండి.';

  @override
  String get hrErrorsInvalidPhone => '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.';

  @override
  String get hrErrorsToBeforeFrom => '“వరకు” “నుండి”కి ముందు ఉండకూడదు.';

  @override
  String get hrErrorsUnknownLeaveType => 'సెలవు రకాన్ని ఎంచుకోండి.';

  @override
  String get hrErrorsUnknownEmployee => 'ఉద్యోగిని ఎంచుకోండి.';

  @override
  String get hrErrorsLoanNotActive =>
      'ఈ రుణం పూర్తిగా చెల్లించబడింది లేదా రద్దయింది.';

  @override
  String get hrErrorsOverRecovery => 'ఈ మొత్తం రుణంపై మిగిలిన దానికంటే ఎక్కువ.';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'తిరిగి చెల్లింపు తేదీ రుణం ఇచ్చిన తేదీ కంటే ముందుంది.';

  @override
  String get hrErrorsExpiryBeforeIssue =>
      'ముగింపు తేదీ జారీ తేదీ కంటే ముందుంది.';

  @override
  String get hrLoansTitle => 'అడ్వాన్సులు & రుణాలు';

  @override
  String get hrLoansNew => 'అడ్వాన్స్ లేదా రుణం ఇవ్వండి';

  @override
  String get hrLoansKind => 'రకం';

  @override
  String get hrLoansKindsAdvance => 'జీతం అడ్వాన్స్';

  @override
  String get hrLoansKindsLoan => 'రుణం';

  @override
  String get hrLoansDate => 'ఇచ్చిన తేదీ';

  @override
  String get hrLoansAmount => 'మొత్తం';

  @override
  String get hrLoansInstalment => 'నెలవారీ వాయిదా';

  @override
  String get hrLoansStartPeriod => 'వసూలు ప్రారంభం';

  @override
  String get hrLoansPaidFrom => 'నుండి చెల్లించింది';

  @override
  String get hrLoansRemarks => 'వ్యాఖ్యలు';

  @override
  String get hrLoansRecovered => 'వసూలైంది';

  @override
  String get hrLoansBalance => 'మిగిలింది';

  @override
  String get hrLoansStatusesActive => 'వసూలవుతోంది';

  @override
  String get hrLoansStatusesClosed => 'వసూలు పూర్తి';

  @override
  String get hrLoansStatusesCancelled => 'రద్దయింది';

  @override
  String get hrLoansNone => 'అడ్వాన్సులు లేదా రుణాలు లేవు.';

  @override
  String get hrLoansCreate => 'చెల్లించండి';

  @override
  String get hrLoansCancel => 'రద్దు చేయండి';

  @override
  String get hrLoansReceive => 'తిరిగి చెల్లింపు స్వీకరించు';

  @override
  String get hrLoansReceiveAmount => 'అందిన మొత్తం';

  @override
  String get hrLoansReceivedInto => 'ఏ ఖాతాలో అందింది';

  @override
  String get hrLoansReceiveSave => 'తిరిగి చెల్లింపు సేవ్ చేయి';

  @override
  String get hrShiftsTitle => 'షిఫ్టులు';

  @override
  String get hrShiftsName => 'షిఫ్ట్';

  @override
  String get hrShiftsStart => 'ప్రారంభం';

  @override
  String get hrShiftsEnd => 'ముగింపు';

  @override
  String get hrShiftsGrace => 'సడలింపు (నిమి)';

  @override
  String get hrShiftsFullDay => 'పూర్తి రోజు (నిమి)';

  @override
  String get hrShiftsHalfDay => 'సగం రోజు (నిమి)';

  @override
  String get hrShiftsIsDefault => 'ప్రధాన';

  @override
  String get hrShiftsAdd => 'షిఫ్ట్ జోడించండి';

  @override
  String get hrShiftsSave => 'సేవ్ చేయండి';

  @override
  String get hrShiftsNone =>
      'ఇంకా షిఫ్టులు లేవు. పంచ్‌లు 09:30–18:30 ప్రకారం చదవబడతాయి.';

  @override
  String get hrShiftsShift => 'షిఫ్ట్';

  @override
  String get hrShiftsNoShift => 'కంపెనీ ప్రధాన';

  @override
  String get hrPunchesTitle => 'పంచ్‌లను దిగుమతి చేయండి';

  @override
  String get hrPunchesHint =>
      'బయోమెట్రిక్ యంత్రం నుండి CSV, కాలమ్‌లు: code, date (YYYY-MM-DD), in, out (24 గంటల HH:MM). ప్రతి రోజు ఉద్యోగి షిఫ్ట్ ప్రకారం చదవబడుతుంది.';

  @override
  String get hrPunchesTemplate => 'నమూనా CSV డౌన్‌లోడ్';

  @override
  String get hrPunchesChoose => 'CSV ఫైల్ ఎంచుకోండి';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count రోజులు',
      one: '$count రోజు',
    );
    return '$_temp0 దిగుమతి చేయండి';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count రోజులు',
      one: '$count రోజు',
    );
    return '$_temp0 దిగుమతి అయ్యాయి.';
  }

  @override
  String get hrPunchesRow => 'వరుస';

  @override
  String get hrPunchesCode => 'కోడ్';

  @override
  String get hrPunchesDate => 'తేదీ';

  @override
  String get hrPunchesWorked => 'పని చేసింది';

  @override
  String get hrPunchesStatus => 'ఫలితం';

  @override
  String get hrPunchesLate => 'ఆలస్యం';

  @override
  String get hrDocumentsTitle => 'పత్రాలు మరియు కేవైసీ';

  @override
  String get hrDocumentsHelp =>
      'గుర్తింపు మరియు నిబంధనల పత్రాలు. నంబర్ చివరి నాలుగు అక్షరాలు మాత్రమే కనిపిస్తాయి. ముగిసే ముందు గుర్తు చేయడానికి గడువు జోడించండి.';

  @override
  String get hrDocumentsNone => 'ఇంకా పత్రాలు ఏవీ లేవు.';

  @override
  String hrDocumentsExpires(String date) {
    return '$date న ముగుస్తుంది';
  }

  @override
  String get hrDocumentsNoExpiry => 'గడువు లేదు';

  @override
  String get hrDocumentsExpired => 'ముగిసింది';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n రోజులు మిగిలి ఉన్నాయి',
      one: '$n రోజు మిగిలి ఉంది',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'తొలగించు';

  @override
  String get hrDocumentsKind => 'పత్రం';

  @override
  String get hrDocumentsNumber => 'నంబర్';

  @override
  String get hrDocumentsIssuedOn => 'జారీ తేదీ';

  @override
  String get hrDocumentsExpiresOnLabel => 'ముగింపు తేదీ';

  @override
  String get hrDocumentsAdd => 'పత్రం జోడించు';

  @override
  String get hrDocumentsKindsAadhaar => 'ఆధార్';

  @override
  String get hrDocumentsKindsPan => 'పాన్';

  @override
  String get hrDocumentsKindsPassport => 'పాస్‌పోర్ట్';

  @override
  String get hrDocumentsKindsDrivingLicence => 'డ్రైవింగ్ లైసెన్స్';

  @override
  String get hrDocumentsKindsVoterId => 'ఓటరు గుర్తింపు కార్డు';

  @override
  String get hrDocumentsKindsBankProof => 'బ్యాంకు రుజువు';

  @override
  String get hrDocumentsKindsPoliceVerification => 'పోలీసు ధృవీకరణ';

  @override
  String get hrDocumentsKindsMedicalFitness => 'వైద్య ఫిట్‌నెస్';

  @override
  String get hrDocumentsKindsContract => 'ఒప్పందం';

  @override
  String get hrDocumentsKindsOther => 'ఇతర';

  @override
  String get hrDocumentsExpiringTitle => 'ముగియనున్న పత్రాలు';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'పనిచేస్తున్న ఉద్యోగుల ముగిసిన లేదా త్వరలో ముగిసే పత్రాలు, త్వరగా ముగిసేవి ముందు.';

  @override
  String get hrDocumentsWithin => 'ఇంతలో ముగిసేవి';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n రోజులు',
      one: '$n రోజు',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'చూపు';

  @override
  String get hrDocumentsEmployee => 'ఉద్యోగి';

  @override
  String get hrDocumentsNoneExpiring => 'ఈ కాలంలో ఏదీ ముగియడం లేదు.';

  @override
  String get payrollTitle => 'పేరోల్';

  @override
  String get payrollSubtitle =>
      'PF, ESI, వృత్తి పన్ను, TDS లెక్కించిన నెలవారీ జీతం, మీ ఖాతాల్లో పోస్ట్ చేయబడుతుంది.';

  @override
  String get payrollRun => 'పేరోల్ రన్ చేయండి';

  @override
  String get payrollMonth => 'నెల';

  @override
  String get payrollNone => 'ఇంకా పేరోల్ రన్‌లు లేవు.';

  @override
  String payrollEmployees(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ఉద్యోగులు',
      one: '$count ఉద్యోగి',
    );
    return '$_temp0';
  }

  @override
  String get payrollStatusesDraft => 'డ్రాఫ్ట్';

  @override
  String get payrollStatusesFinalized => 'ఖరారు';

  @override
  String get payrollStatusesPaid => 'చెల్లించబడింది';

  @override
  String get payrollStatusesCancelled => 'రద్దయింది';

  @override
  String get payrollColsEmployee => 'ఉద్యోగి';

  @override
  String get payrollColsPaidDays => 'జీతపు రోజులు';

  @override
  String get payrollColsLop => 'కోత రోజులు';

  @override
  String get payrollColsGross => 'స్థూలం';

  @override
  String get payrollColsPf => 'PF';

  @override
  String get payrollColsEsi => 'ESI';

  @override
  String get payrollColsPt => 'వృత్తి పన్ను';

  @override
  String get payrollColsLwf => 'LWF';

  @override
  String get payrollColsTds => 'TDS';

  @override
  String get payrollColsOther => 'ఇతర';

  @override
  String get payrollColsNet => 'నికర జీతం';

  @override
  String get payrollRefresh => 'హాజరు నుండి నవీకరించండి';

  @override
  String get payrollFinalize => 'ఖరారు చేసి పోస్ట్ చేయండి';

  @override
  String get payrollFinalizeHint =>
      'జీతం, PF, ESI, వృత్తి పన్ను, TDS చెల్లించాల్సినవి మీ ఖాతాల్లో పోస్ట్ చేస్తుంది. తర్వాత ఆ నెల హాజరు లాక్ అవుతుంది.';

  @override
  String get payrollPay => 'చెల్లింపు నమోదు చేయండి';

  @override
  String get payrollPayFrom => 'నుండి చెల్లించింది';

  @override
  String get payrollPayDate => 'చెల్లింపు తేదీ';

  @override
  String get payrollCancel => 'రన్ రద్దు చేయండి';

  @override
  String get payrollFilesTitle => 'దాఖలు & చెల్లింపు ఫైళ్లు';

  @override
  String get payrollFilesEcr => 'EPF ECR';

  @override
  String get payrollFilesEsi => 'ESI చందా';

  @override
  String get payrollFilesBank => 'బ్యాంక్ బదిలీ';

  @override
  String payrollFilesMissing(String codes) {
    return 'వదిలేశాం (వివరాలు లేవు): $codes';
  }

  @override
  String get payrollTotalsGross => 'స్థూల జీతం';

  @override
  String get payrollTotalsDeductions => 'తగ్గింపులు';

  @override
  String get payrollTotalsNet => 'నికర జీతం';

  @override
  String get payrollTotalsEmployer => 'యజమాని PF/ESI/LWF';

  @override
  String get payrollLopEdited => 'చేతితో నమోదు';

  @override
  String get payrollLopReset => 'హాజరు వాడండి';

  @override
  String get payrollAddDeduction => 'తగ్గింపు జోడించండి';

  @override
  String get payrollDeductionName => 'తగ్గింపు';

  @override
  String get payrollDeductionAmount => 'మొత్తం';

  @override
  String get payrollEdit => 'సవరించండి';

  @override
  String get payrollView => 'జీతపు స్లిప్';

  @override
  String get payrollErrorsRunExists => 'ఆ నెల పేరోల్ ఇప్పటికే ఉంది.';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'ముందుగా గత నెల డ్రాఫ్ట్‌ను ఖరారు చేయండి లేదా రద్దు చేయండి.';

  @override
  String get payrollErrorsRunNotDraft => 'డ్రాఫ్ట్‌ను మాత్రమే మార్చగలరు.';

  @override
  String get payrollErrorsRunEmpty => 'ఖరారు చేయడానికి జీతపు స్లిప్‌లు లేవు.';

  @override
  String get payrollErrorsRunNotFinalized => 'ముందుగా రన్‌ను ఖరారు చేయండి.';

  @override
  String get payrollErrorsRunPaid => 'చెల్లించిన రన్‌ను రద్దు చేయలేరు.';

  @override
  String get payrollErrorsLaterRunFinal =>
      'తర్వాతి నెల ఇప్పటికే ఖరారైంది; ముందుగా దాన్ని రద్దు చేయండి.';

  @override
  String get payrollErrorsLopExceedsDays => 'కోత రోజులు నెల రోజుల కంటే ఎక్కువ.';

  @override
  String get payrollErrorsDeductionsExceedPay => 'తగ్గింపులు జీతం కంటే ఎక్కువ.';

  @override
  String get payrollErrorsInvalidPeriod => 'నెల ఎంచుకోండి.';

  @override
  String get payrollErrorsInvalidSettings => 'సెట్టింగ్‌లను తనిఖీ చేయండి.';

  @override
  String get payrollErrorsReservedCode =>
      'ఈ కోడ్ ఆటోమేటిక్ బకాయిల కోసం రిజర్వ్ చేయబడింది.';

  @override
  String get payrollErrorsInvalidInstalment =>
      'వాయిదా 0 కంటే ఎక్కువ, మొత్తం కంటే ఎక్కువ కాకుండా ఉండాలి.';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'రుణం ఇవ్వక ముందే వసూలు ప్రారంభం కాదు.';

  @override
  String get payrollErrorsEmployeeNotActive => 'ఈ ఉద్యోగి వెళ్లిపోయారు.';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'ఇందులో కొంత ఇప్పటికే వసూలైంది; రద్దు చేయలేరు.';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'BSR కోడ్, చలాన్ సీరియల్ నంబర్ నమోదు చేయండి.';

  @override
  String get payrollErrorsInvalidBsrCode => 'BSR కోడ్‌లో 7 అంకెలు ఉంటాయి.';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'చలాన్ సీరియల్‌లో 5 అంకెల వరకు ఉంటాయి.';

  @override
  String get payrollErrorsInvalidTan => 'ఈ TAN చెల్లదు (ఉదా. MUMA12345B).';

  @override
  String get payrollErrorsNoFinalPayslips =>
      'ఆ సంవత్సరానికి ఖరారైన జీతపు స్లిప్‌లు లేవు.';

  @override
  String get payrollErrorsInvalidTime => '09:30 లాంటి 24 గంటల సమయం వాడండి.';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'సగం రోజు పూర్తి రోజు కంటే ఎక్కువ ఉండకూడదు.';

  @override
  String get payrollErrorsInvalidAmount => 'మొత్తం నమోదు చేయండి.';

  @override
  String get payrollSettingsTitle => 'పేరోల్ సెట్టింగ్‌లు';

  @override
  String get payrollSettingsSubtitle =>
      'నమోదు కోడ్‌లు, వారపు సెలవులు, రాష్ట్ర లెవీలు.';

  @override
  String get payrollSettingsPfCode => 'EPF సంస్థ కోడ్';

  @override
  String get payrollSettingsEsiCode => 'ESI యజమాని కోడ్';

  @override
  String get payrollSettingsLabourCode =>
      'కార్మిక కోడ్‌ల 50% జీత నియమం వర్తింపజేయండి';

  @override
  String get payrollSettingsLabourCodeHint =>
      'సామాజిక భద్రత కోడ్ ప్రకారం (21 నవం 2025 నుండి), భత్యాలు జీతంలో సగం కంటే ఎక్కువైతే, అదనపు భాగం PF జీతంగా లెక్కించబడుతుంది.';

  @override
  String get payrollSettingsWeeklyOffs => 'వారపు సెలవులు';

  @override
  String get payrollSettingsLwf => 'కార్మిక సంక్షేమ నిధి';

  @override
  String get payrollSettingsLwfEmployee => 'ఉద్యోగి వాటా (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'యజమాని వాటా (₹)';

  @override
  String get payrollSettingsLwfMonths => 'తగ్గించే నెలలు';

  @override
  String get payrollSettingsEncashment => 'రోజుకు సెలవు నగదుగా మార్పు';

  @override
  String payrollSettingsDivisor(String n) {
    return 'నెల జీతం ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'సేవ్ చేయండి';

  @override
  String get payrollSettingsTan => 'TAN (పన్ను తగ్గింపు ఖాతా నంబర్)';

  @override
  String get payrollSlipTitle => 'జీతపు స్లిప్';

  @override
  String payrollSlipFor(String month) {
    return '$month జీతపు స్లిప్';
  }

  @override
  String get payrollSlipEarnings => 'సంపాదనలు';

  @override
  String get payrollSlipDeductions => 'తగ్గింపులు';

  @override
  String get payrollSlipNetPay => 'నికర జీతం';

  @override
  String get payrollSlipInWords => 'అక్షరాల్లో';

  @override
  String get payrollSlipEmployer => 'యజమాని చందాలు (తగ్గించబడవు)';

  @override
  String get payrollSlipTax => 'ఆదాయపు పన్ను లెక్క';

  @override
  String get payrollSlipAnnualSalary => 'సంవత్సరపు అంచనా జీతం';

  @override
  String get payrollSlipTaxableIncome => 'పన్ను విధించదగిన ఆదాయం';

  @override
  String get payrollSlipAnnualTax => 'సంవత్సరపు పన్ను';

  @override
  String get payrollSlipDeductedSoFar => 'ఇప్పటివరకు తగ్గించింది';

  @override
  String get payrollSlipPfEmployee => 'భవిష్య నిధి';

  @override
  String get payrollSlipEsiEmployee => 'ESI';

  @override
  String get payrollSlipPt => 'వృత్తి పన్ను';

  @override
  String get payrollSlipLwf => 'కార్మిక సంక్షేమ నిధి';

  @override
  String get payrollSlipTds => 'ఆదాయపు పన్ను (TDS)';

  @override
  String get payrollSlipEps => 'పెన్షన్ (EPS)';

  @override
  String get payrollSlipEpf => 'PF (యజమాని)';

  @override
  String get payrollSlipEdli => 'EDLI';

  @override
  String get payrollSlipAdmin => 'PF పరిపాలన';

  @override
  String get payrollSlipEsiEmployer => 'ESI (యజమాని)';

  @override
  String get payrollSlipComputerGenerated =>
      'ఇది కంప్యూటర్ రూపొందించిన జీతపు స్లిప్, సంతకం అవసరం లేదు.';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count మునుపటి నెలలు',
      one: '$count మునుపటి నెల',
    );
    return 'జీత నిర్మాణం నుండి అంచనా వేసిన $_temp0 చేర్చబడ్డాయి (Varchasv ముందు చెల్లించినవి).';
  }

  @override
  String get payrollExtraTitle => 'అదనపు సంపాదనలు (ఈ నెల మాత్రమే)';

  @override
  String get payrollExtraName => 'సంపాదన';

  @override
  String get payrollExtraAmount => 'మొత్తం';

  @override
  String get payrollExtraAdd => 'సంపాదన జోడించండి';

  @override
  String get payrollExtraEsiExcluded => 'ESI జీతంలో కాదు (ఉదా. బోనస్)';

  @override
  String get payrollLoanRecoveryTitle => 'రుణ & అడ్వాన్స్ వాయిదాలు';

  @override
  String get payrollLoanRecoveryHint =>
      'ఈ నెల వదిలేయడానికి 0 టైప్ చేయండి; వాయిదా వాడటానికి ఖాళీ చేయండి.';

  @override
  String get payrollRegister => 'జీతాల రిజిస్టర్';

  @override
  String get payrollEmail => 'జీతపు స్లిప్‌లు ఈమెయిల్ చేయండి';

  @override
  String payrollEmailed(String sent) {
    return '$sent ఈమెయిల్ చేయబడ్డాయి.';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'ఈమెయిల్ చిరునామా లేదు: $codes';
  }

  @override
  String get statutoryTitle => 'చట్టబద్ధ బకాయిలు & TDS';

  @override
  String get statutorySubtitle =>
      'ఖరారైన పేరోల్ నుండి PF, ESI, వృత్తి పన్ను, LWF, TDS, ఎంత చెల్లించబడింది, త్రైమాసిక TDS రిటర్న్, ఫారం 16.';

  @override
  String get statutoryFy => 'ఆర్థిక సంవత్సరం';

  @override
  String get statutoryDues => 'బకాయిలు & చెల్లింపులు';

  @override
  String get statutoryKind => 'రకం';

  @override
  String get statutoryKindsPf => 'PF';

  @override
  String get statutoryKindsEsi => 'ESI';

  @override
  String get statutoryKindsPt => 'వృత్తి పన్ను';

  @override
  String get statutoryKindsLwf => 'LWF';

  @override
  String get statutoryKindsTds => 'TDS';

  @override
  String get statutoryPeriod => 'జీతపు నెల';

  @override
  String get statutoryDue => 'బకాయి';

  @override
  String get statutoryPaid => 'చెల్లించింది';

  @override
  String get statutoryBalance => 'మిగిలింది';

  @override
  String get statutoryDueDate => 'చివరి తేదీ';

  @override
  String get statutoryPay => 'చెల్లింపు నమోదు చేయండి';

  @override
  String get statutoryPaidOn => 'చెల్లించిన తేదీ';

  @override
  String get statutoryAccount => 'నుండి చెల్లించింది';

  @override
  String get statutoryReference => 'చలాన్ / TRRN నం.';

  @override
  String get statutoryBsrCode => 'BSR కోడ్';

  @override
  String get statutoryChallanSerial => 'చలాన్ సీరియల్ నం.';

  @override
  String get statutoryRecord => 'చెల్లింపు సేవ్ చేయండి';

  @override
  String get statutoryNone => 'ఈ సంవత్సరం ఇంకా ఖరారైన పేరోల్ లేదు.';

  @override
  String get statutoryOverdue => 'ఆలస్యం';

  @override
  String get statutoryQ24Title => 'త్రైమాసిక TDS రిటర్న్ (ఫారం 24Q)';

  @override
  String get statutoryQ24Quarter => 'త్రైమాసికం';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · ఏప్రి–జూన్';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · జూలై–సెప్టె';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · అక్టో–డిసె';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · జన–మార్చి';

  @override
  String get statutoryQ24Deductees => 'తగ్గింపు పొందిన వారి వరుసలు';

  @override
  String get statutoryQ24Challans => 'చలాన్లు';

  @override
  String get statutoryQ24TotalTds => 'TDS';

  @override
  String get statutoryQ24Download => 'తగ్గింపు పొందిన వారి వరుసలు (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'అనుబంధం II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'వీటిని NSDL రిటర్న్ ప్రిపరేషన్ యుటిలిటీ (RPU)లోకి దిగుమతి చేసి, FVUతో ఫైల్ తనిఖీ చేసి, TIN-NSDLలో అప్‌లోడ్ చేయండి.';

  @override
  String get statutoryQ24WarningsTanMissing =>
      'పేరోల్ సెట్టింగ్‌లలో TAN జోడించండి.';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return '$detailకి పాన్ లేదు: పాన్ లేకుండా 20% పన్ను తగ్గించాలి.';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return '$detailకి తగ్గించినది, జమ చేసినది సరిపోలడం లేదు.';
  }

  @override
  String get statutoryForm16Title => 'ఫారం 16';

  @override
  String get statutoryForm16Hint =>
      'భాగం B పేరోల్ నుండి. భాగం Aని TRACES నుండి డౌన్‌లోడ్ చేసి జతచేయండి; రెండింటిపై యజమాని సంతకం.';

  @override
  String get statutoryForm16View => 'భాగం B';

  @override
  String get form16Title => 'ఫారం 16 · భాగం B';

  @override
  String get form16Subtitle =>
      'జీతంపై మూలం వద్ద తగ్గించిన పన్నుకు సెక్షన్ 203 కింద ధృవపత్రం';

  @override
  String get form16Employer => 'యజమాని';

  @override
  String get form16Employee => 'ఉద్యోగి';

  @override
  String get form16Tan => 'TAN';

  @override
  String get form16Pan => 'పాన్';

  @override
  String get form16Ay => 'అసెస్‌మెంట్ సంవత్సరం';

  @override
  String get form16Period => 'ఉద్యోగ కాలం';

  @override
  String get form16Salary => 'చెల్లించిన జీతం';

  @override
  String get form16Gross => 'స్థూల జీతం';

  @override
  String get form16Previous => 'మునుపటి యజమాని నుండి జీతం';

  @override
  String get form16Exemptions =>
      'తీసివేత: సెక్షన్ 16 కింద మినహాయింపులు, తగ్గింపులు';

  @override
  String get form16HraExempt => 'ఇంటి అద్దె భత్యం మినహాయింపు';

  @override
  String get form16StandardDeduction => 'ప్రామాణిక తగ్గింపు';

  @override
  String get form16Pt => 'వృత్తి పన్ను';

  @override
  String get form16HouseProperty => 'ఇంటి ఆస్తి నుండి ఆదాయం (గృహ రుణ వడ్డీ)';

  @override
  String get form16ChapterVIA => 'అధ్యాయం VI-A కింద తగ్గింపులు';

  @override
  String get form16TaxableIncome => 'మొత్తం పన్ను విధించదగిన ఆదాయం';

  @override
  String get form16Tax => 'మొత్తం ఆదాయంపై పన్ను';

  @override
  String get form16Rebate => 'సెక్షన్ 87A కింద రిబేట్';

  @override
  String get form16Surcharge => 'సర్‌ఛార్జ్';

  @override
  String get form16Cess => 'ఆరోగ్య & విద్యా సెస్';

  @override
  String get form16Total => 'చెల్లించాల్సిన పన్ను';

  @override
  String get form16Regime => 'పన్ను విధానం';

  @override
  String get form16TdsQuarterly => 'తగ్గించి జమ చేసిన పన్ను';

  @override
  String get form16Quarter => 'త్రైమాసికం';

  @override
  String get form16Challans => 'చలాన్లు (BSR కోడ్ · తేదీ · సీరియల్)';

  @override
  String get form16TdsDeducted => 'మొత్తం తగ్గించిన పన్ను';

  @override
  String get form16Balance => 'చెల్లించాల్సిన పన్ను (వాపసు)';

  @override
  String get form16Verification =>
      'అందుబాటులో ఉన్న ఖాతా పుస్తకాలు, పత్రాలు, రికార్డుల ఆధారంగా పై సమాచారం నిజమైనది, సరైనది అని ధృవీకరించడమైనది.';

  @override
  String get form16Signature => 'పన్ను తగ్గించడానికి బాధ్యుడైన వ్యక్తి సంతకం';

  @override
  String get form16PartA => 'భాగం A (TRACES నుండి) జతచేయాలి.';

  @override
  String form16Missing(String months) {
    return '$monthsకి జీతపు స్లిప్‌లు ఇక్కడ లేవు (Varchasv ముందు చెల్లించినవి). సంతకం చేసే ముందు ఆ జీతం, పన్ను జోడించండి.';
  }

  @override
  String get mfgBomsTitle => 'మెటీరియల్ జాబితా (BOM)';

  @override
  String get mfgBomsSubtitle =>
      'మీరు తయారుచేసే ప్రతి వస్తువులోకి ఏమి వెళ్తుంది, వృథా, వర్క్ సెంటర్ సమయం, ఓవర్‌హెడ్‌లతో.';

  @override
  String get mfgBomsNew => 'కొత్త బీఓఎం';

  @override
  String get mfgBomsItem => 'తయారయ్యే వస్తువు';

  @override
  String get mfgBomsVersion => 'వెర్షన్';

  @override
  String get mfgBomsOutputQty => 'ఉత్పత్తి (పరిమాణం)';

  @override
  String get mfgBomsOverhead => 'బ్యాచ్‌కు స్థిర ఓవర్‌హెడ్ (₹)';

  @override
  String get mfgBomsComponent => 'ముడి పదార్థం';

  @override
  String get mfgBomsQty => 'పరిమాణం';

  @override
  String get mfgBomsWastage => 'వృథా %';

  @override
  String get mfgBomsOperations => 'ప్రక్రియలు';

  @override
  String get mfgBomsOperation => 'ప్రక్రియ';

  @override
  String get mfgBomsWorkCentre => 'వర్క్ సెంటర్';

  @override
  String get mfgBomsMinutes => 'నిమిషాలు';

  @override
  String get mfgBomsAddLine => 'పదార్థం జోడించండి';

  @override
  String get mfgBomsAddOperation => 'ప్రక్రియ జోడించండి';

  @override
  String get mfgBomsSave => 'బీఓఎం సేవ్ చేయండి';

  @override
  String get mfgBomsMakeDefault => 'ప్రధానంగా వాడండి';

  @override
  String get mfgBomsDefault => 'ప్రధాన';

  @override
  String get mfgBomsArchive => 'ఆర్కైవ్ చేయండి';

  @override
  String get mfgBomsArchived => 'ఆర్కైవ్';

  @override
  String get mfgBomsUnitCost => 'యూనిట్‌కు ఖర్చు';

  @override
  String get mfgBomsOverheadPerUnit => 'యూనిట్‌కు ఓవర్‌హెడ్';

  @override
  String get mfgBomsRate => 'ధర';

  @override
  String get mfgBomsCost => 'ఖర్చు';

  @override
  String get mfgBomsNone => 'ఇంకా బీఓఎంలు లేవు.';

  @override
  String get mfgBomsNotes => 'గమనికలు';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count పదార్థాలు',
      one: '$count పదార్థం',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'వర్క్ సెంటర్లు';

  @override
  String get mfgWorkCentresName => 'వర్క్ సెంటర్';

  @override
  String get mfgWorkCentresCostPerHour => 'గంటకు ఖర్చు (₹)';

  @override
  String get mfgWorkCentresAdd => 'వర్క్ సెంటర్ జోడించండి';

  @override
  String get mfgWorkCentresSave => 'సేవ్ చేయండి';

  @override
  String get mfgOrdersTitle => 'ఉత్పత్తి ఆర్డర్లు';

  @override
  String get mfgOrdersSubtitle =>
      'ఉత్పత్తిని ప్రణాళిక, విడుదల, పూర్తి చేయండి. పదార్థాలు స్టాక్ నుండి వెళ్తాయి, ఉత్పత్తి ఖర్చు ధరకు వస్తుంది.';

  @override
  String get mfgOrdersNew => 'కొత్త ఉత్పత్తి ఆర్డర్';

  @override
  String get mfgOrdersItem => 'వస్తువు';

  @override
  String get mfgOrdersQty => 'పరిమాణం';

  @override
  String get mfgOrdersDate => 'తేదీ';

  @override
  String get mfgOrdersStatus => 'స్థితి';

  @override
  String get mfgOrdersStatusesPlanned => 'ప్రణాళికలో';

  @override
  String get mfgOrdersStatusesReleased => 'విడుదలైంది';

  @override
  String get mfgOrdersStatusesCompleted => 'పూర్తయింది';

  @override
  String get mfgOrdersStatusesCancelled => 'రద్దయింది';

  @override
  String get mfgOrdersProduced => 'ఉత్పత్తి అయింది';

  @override
  String get mfgOrdersRejected => 'తిరస్కరించబడింది';

  @override
  String get mfgOrdersRelease => 'విడుదల చేయండి';

  @override
  String get mfgOrdersIssue => 'అదనపు పదార్థం ఇవ్వండి';

  @override
  String get mfgOrdersComplete => 'ఉత్పత్తి నమోదు చేయండి';

  @override
  String get mfgOrdersGoodQty => 'మంచి పరిమాణం';

  @override
  String get mfgOrdersRejectedQty => 'తిరస్కరించినది';

  @override
  String get mfgOrdersClose => 'దీని తర్వాత ఆర్డర్ మూసివేయండి';

  @override
  String get mfgOrdersRemaining => 'ఇంకా తయారుచేయాల్సింది';

  @override
  String get mfgOrdersMaterials => 'మిగిలినదానికి పదార్థాలు';

  @override
  String get mfgOrdersEntries => 'చరిత్ర';

  @override
  String get mfgOrdersUnitCost => 'యూనిట్ ఖర్చు';

  @override
  String get mfgOrdersMaterialCost => 'పదార్థ ఖర్చు';

  @override
  String get mfgOrdersOverheadCost => 'ఓవర్‌హెడ్‌లు';

  @override
  String get mfgOrdersKindsIssue => 'అదనపు ఇష్యూ';

  @override
  String get mfgOrdersKindsComplete => 'ఉత్పత్తి';

  @override
  String get mfgOrdersReleaseNow => 'వెంటనే విడుదల చేయండి';

  @override
  String get mfgOrdersNone => 'ఇంకా ఉత్పత్తి ఆర్డర్లు లేవు.';

  @override
  String get mfgOrdersSave => 'ఆర్డర్ సృష్టించండి';

  @override
  String get mfgOrdersCancel => 'ఆర్డర్ రద్దు చేయండి';

  @override
  String get mfgMrpTitle => 'మెటీరియల్ ప్రణాళిక (MRP)';

  @override
  String get mfgMrpSubtitle =>
      'తెరిచిన అమ్మకపు ఆర్డర్లు, రీఆర్డర్ స్థాయిలను తీర్చడానికి ఏమి తయారుచేయాలి, ఏమి కొనాలి, స్టాక్, ఇప్పటికే ఆర్డర్ చేసినవి తీసివేసి.';

  @override
  String get mfgMrpAsOf => 'ఈ తేదీ నాటికి ప్రణాళిక';

  @override
  String get mfgMrpAction => 'చర్య';

  @override
  String get mfgMrpActionsMake => 'తయారుచేయండి';

  @override
  String get mfgMrpActionsBuy => 'కొనండి';

  @override
  String get mfgMrpQty => 'పరిమాణం';

  @override
  String get mfgMrpNeedBy => 'కావాల్సిన తేదీ';

  @override
  String get mfgMrpReleaseBy => 'ప్రారంభం / ఆర్డర్ చివరి తేదీ';

  @override
  String get mfgMrpOnHand => 'చేతిలో';

  @override
  String get mfgMrpOnOrder => 'ఆర్డర్‌లో';

  @override
  String get mfgMrpSupplier => 'సరఫరాదారు';

  @override
  String get mfgMrpConvert => 'ఎంచుకున్నవాటికి ఆర్డర్లు సృష్టించండి';

  @override
  String mfgMrpCreated(String orders) {
    return '$orders సృష్టించబడ్డాయి.';
  }

  @override
  String get mfgMrpNone =>
      'ప్రణాళిక అవసరం లేదు: స్టాక్, ఆర్డర్లు డిమాండ్‌ను తీరుస్తాయి.';

  @override
  String get mfgJobWorkTitle => 'జాబ్ వర్క్';

  @override
  String get mfgJobWorkSubtitle =>
      'చలాన్‌పై జాబ్ వర్కర్లకు పంపి, ప్రాసెస్ అయి తిరిగి వచ్చిన సరుకు. ఇన్‌పుట్‌లు ఒక సంవత్సరంలో తిరిగి రావాలి (మూలధన సరుకులు మూడు సంవత్సరాల్లో).';

  @override
  String get mfgJobWorkSend => 'జాబ్ వర్క్‌కు పంపండి';

  @override
  String get mfgJobWorkReceive => 'తిరిగి స్వీకరించండి';

  @override
  String get mfgJobWorkJobWorker => 'జాబ్ వర్కర్';

  @override
  String get mfgJobWorkProcess => 'ప్రక్రియ';

  @override
  String get mfgJobWorkSent => 'పంపింది';

  @override
  String get mfgJobWorkPending => 'ఇంకా జాబ్ వర్కర్ వద్ద';

  @override
  String get mfgJobWorkReturnBy => 'తిరిగి ఇవ్వాల్సిన తేదీ';

  @override
  String get mfgJobWorkOverdue => 'ఆలస్యం';

  @override
  String get mfgJobWorkReceived => 'స్వీకరించిన వస్తువు';

  @override
  String get mfgJobWorkConsumed => 'వాడిన ఇన్‌పుట్‌లు';

  @override
  String get mfgJobWorkCharges => 'జాబ్ ఛార్జీలు (₹)';

  @override
  String get mfgJobWorkFrom => 'చలాన్ నుండి';

  @override
  String get mfgJobWorkItc04 => 'ITC-04 (అర్ధవార్షిక)';

  @override
  String get mfgJobWorkHalf => 'అర్ధ సంవత్సరం';

  @override
  String get mfgJobWorkHalvesH1 => 'ఏప్రిల్–సెప్టెంబర్';

  @override
  String get mfgJobWorkHalvesH2 => 'అక్టోబర్–మార్చి';

  @override
  String get mfgJobWorkSentTable => 'పంపిన సరుకు';

  @override
  String get mfgJobWorkReceivedTable => 'తిరిగి వచ్చిన సరుకు';

  @override
  String get mfgJobWorkPendingTable => 'జాబ్ వర్కర్ల వద్ద పెండింగ్';

  @override
  String get mfgJobWorkNone => 'ఇంకా జాబ్ వర్క్ లేదు.';

  @override
  String get mfgJobWorkCapitalGoods => 'మూలధన సరుకులు';

  @override
  String get mfgErrorsBomCycle =>
      'ఇది చక్రాన్ని సృష్టిస్తుంది: వస్తువుకు తనే అవసరమవుతుంది.';

  @override
  String get mfgErrorsBomEmpty => 'కనీసం ఒక పదార్థం జోడించండి.';

  @override
  String get mfgErrorsInvalidOutputQty =>
      'ఒక బ్యాచ్‌లో ఎంత తయారవుతుందో నమోదు చేయండి.';

  @override
  String get mfgErrorsDuplicateComponent => 'ఒక పదార్థం రెండుసార్లు ఉంది.';

  @override
  String get mfgErrorsUnknownWorkCentre => 'వర్క్ సెంటర్ ఎంచుకోండి.';

  @override
  String get mfgErrorsNoBom => 'ఈ వస్తువుకు క్రియాశీల బీఓఎం లేదు.';

  @override
  String get mfgErrorsBomArchived => 'ఆ బీఓఎం ఆర్కైవ్ చేయబడింది.';

  @override
  String get mfgErrorsOrderNotPlanned =>
      'ప్రణాళికలోని ఆర్డర్‌ను మాత్రమే విడుదల చేయగలరు.';

  @override
  String get mfgErrorsOrderNotReleased => 'ముందుగా ఆర్డర్ విడుదల చేయండి.';

  @override
  String get mfgErrorsSupplierRequired =>
      'కొనాల్సిన వస్తువులకు సరఫరాదారుని ఎంచుకోండి.';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'జాబ్ వర్కర్‌గా సరఫరాదారు లేదా కస్టమర్‌ను ఎంచుకోండి.';

  @override
  String get mfgErrorsUnknownChallan => 'పంపిన చలాన్‌ను ఎంచుకోండి.';

  @override
  String get mfgErrorsChallanCancelled => 'ఆ చలాన్ రద్దయింది.';

  @override
  String get mfgErrorsItemNotSent => 'ఈ వస్తువు ఈ చలాన్‌పై పంపబడలేదు.';

  @override
  String get mfgErrorsMoreThanSent =>
      'ఇది జాబ్ వర్కర్ వద్ద మిగిలిన దానికంటే ఎక్కువ.';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'ఈ చలాన్‌పై సరుకు తిరిగి వచ్చింది; ముందుగా వాటిని రద్దు చేయండి.';

  @override
  String get posBillingTitle => 'బిల్లింగ్';

  @override
  String get posBillingTerminal => 'కౌంటర్';

  @override
  String get posBillingChooseTerminal => 'కౌంటర్ ఎంచుకోండి';

  @override
  String get posBillingOpenShift => 'షిఫ్ట్ ప్రారంభించండి';

  @override
  String get posBillingOpeningCash => 'ప్రారంభ నగదు (₹)';

  @override
  String get posBillingCloseShift => 'షిఫ్ట్ ముగించండి';

  @override
  String get posBillingCountedCash => 'లెక్కించిన నగదు (₹)';

  @override
  String get posBillingExpected => 'ఆశించినది';

  @override
  String get posBillingDifference => 'తేడా';

  @override
  String get posBillingSearch => 'బార్‌కోడ్ స్కాన్ చేయండి లేదా వస్తువు వెతకండి';

  @override
  String get posBillingCart => 'బిల్లు';

  @override
  String get posBillingEmpty => 'బిల్లు ప్రారంభించడానికి వస్తువులు జోడించండి.';

  @override
  String get posBillingQty => 'పరిమాణం';

  @override
  String get posBillingPrice => 'ధర';

  @override
  String get posBillingAmount => 'మొత్తం';

  @override
  String get posBillingDiscount => 'బిల్లు తగ్గింపు (₹)';

  @override
  String get posBillingCustomer => 'కస్టమర్ మొబైల్ (పాయింట్ల కోసం)';

  @override
  String get posBillingCustomerName => 'పేరు';

  @override
  String posBillingPoints(String points) {
    return '$points పాయింట్లు';
  }

  @override
  String get posBillingRedeem => 'పాయింట్లు వాడండి';

  @override
  String posBillingRedeemable(String points, String value) {
    return '$points పాయింట్ల వరకు (₹$value)';
  }

  @override
  String get posBillingPayments => 'చెల్లింపు';

  @override
  String get posBillingModesCash => 'నగదు';

  @override
  String get posBillingModesUpi => 'UPI';

  @override
  String get posBillingModesCard => 'కార్డు';

  @override
  String get posBillingModesCredit => 'ఖాతాలో';

  @override
  String get posBillingReference => 'సూచన';

  @override
  String get posBillingAddPayment => 'చెల్లింపు విభజించండి';

  @override
  String get posBillingPay => 'బిల్లు పూర్తి చేయండి';

  @override
  String get posBillingTotal => 'మొత్తం';

  @override
  String get posBillingChange => 'తిరిగి ఇవ్వాల్సింది';

  @override
  String get posBillingDue => 'ఇంకా బకాయి';

  @override
  String get posBillingTaxable => 'పన్ను విధించదగినది';

  @override
  String get posBillingTax => 'జీఎస్టీ';

  @override
  String get posBillingRoundOff => 'రౌండ్ ఆఫ్';

  @override
  String posBillingDone(String number) {
    return 'బిల్లు $number సేవ్ అయింది';
  }

  @override
  String get posBillingPrint => 'రసీదు ప్రింట్';

  @override
  String get posBillingNewBill => 'కొత్త బిల్లు';

  @override
  String get posBillingShiftTotals => 'ఈ షిఫ్ట్';

  @override
  String get posBillingBills => 'బిల్లులు';

  @override
  String get posBillingDeviceTerminal =>
      'ఈ కౌంటర్ తన పరికరం నుండి బిల్ చేస్తుంది (ఆఫ్‌లైన్ యాప్).';

  @override
  String get posBillsTitle => 'పీఓఎస్ బిల్లులు';

  @override
  String get posBillsSubtitle => 'ఒక రోజులోని అన్ని కౌంటర్ల బిల్లులు.';

  @override
  String get posBillsDate => 'తేదీ';

  @override
  String get posBillsNumber => 'బిల్లు నం.';

  @override
  String get posBillsTime => 'సమయం';

  @override
  String get posBillsMode => 'చెల్లింపు విధానం';

  @override
  String get posBillsVoid => 'రద్దు చేయండి';

  @override
  String get posBillsVoided => 'రద్దయింది';

  @override
  String get posBillsReason => 'కారణం';

  @override
  String get posBillsSummary => 'రోజు సారాంశం';

  @override
  String get posBillsTopItems => 'ఎక్కువగా అమ్ముడైనవి';

  @override
  String get posBillsMismatch => 'పరికరం మొత్తం భిన్నంగా ఉంది';

  @override
  String get posBillsNone => 'ఈ రోజు బిల్లులు లేవు.';

  @override
  String get posSettingsTitle => 'కౌంటర్ సెట్టింగ్‌లు';

  @override
  String get posSettingsSubtitle =>
      'ధర, లాయల్టీ పాయింట్లు, డిస్కౌంట్ పరిమితి, కౌంటర్లు.';

  @override
  String get posSettingsPricesIncludeTax => 'ధరల్లో జీఎస్టీ కలిసి ఉంది';

  @override
  String get posSettingsLoyalty => 'లాయల్టీ పాయింట్లు';

  @override
  String get posSettingsLoyaltyEnabled => 'లాయల్టీ పాయింట్లు ఇవ్వండి';

  @override
  String get posSettingsPointsPer100 => '₹100కి పాయింట్లు';

  @override
  String get posSettingsPointValue => 'ఒక పాయింట్ విలువ (₹)';

  @override
  String get posSettingsMaxRedeem =>
      'పాయింట్లతో చెల్లించగల బిల్లు గరిష్ట భాగం (%)';

  @override
  String get posSettingsFooter => 'రసీదు ఫుటర్';

  @override
  String get posSettingsTerminals => 'కౌంటర్లు';

  @override
  String get posSettingsTerminalName => 'కౌంటర్ పేరు';

  @override
  String get posSettingsWarehouse => 'నుండి అమ్మకం';

  @override
  String get posSettingsDevice => 'ఆఫ్‌లైన్ పరికరం';

  @override
  String get posSettingsNoDevice => 'ఏదీ లేదు (వెబ్ బిల్లింగ్)';

  @override
  String get posSettingsAddTerminal => 'కౌంటర్ జోడించండి';

  @override
  String get posSettingsSave => 'సేవ్ చేయండి';

  @override
  String get posReceiptTaxInvoice => 'పన్ను ఇన్‌వాయిస్';

  @override
  String get posReceiptBillOfSupply => 'నగదు మెమో';

  @override
  String get posReceiptThanks => 'ధన్యవాదాలు! మళ్లీ రండి.';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'సంపాదించిన పాయింట్లు: $points · మిగిలినవి $balance';
  }

  @override
  String get posErrorsSessionNotOpen =>
      'ముందుగా ఈ కౌంటర్‌పై షిఫ్ట్ ప్రారంభించండి.';

  @override
  String get posErrorsSessionAlreadyOpen =>
      'ఈ కౌంటర్‌పై ఇప్పటికే షిఫ్ట్ నడుస్తోంది.';

  @override
  String get posErrorsSessionClosed => 'ఆ షిఫ్ట్ ముగిసింది.';

  @override
  String get posErrorsDeviceTerminal =>
      'ఈ కౌంటర్ తన పరికరం నుండి బిల్ చేస్తుంది.';

  @override
  String get posErrorsTerminalOnOtherDevice => 'ఈ కౌంటర్ మరో పరికరానిది.';

  @override
  String get posErrorsTooManyPoints =>
      'ఈ బిల్లుపై వాడగలిగే దానికంటే ఎక్కువ పాయింట్లు.';

  @override
  String get posErrorsLoyaltyNotAvailable =>
      'ముందుగా కస్టమర్ మొబైల్ నంబర్ నమోదు చేయండి.';

  @override
  String get posErrorsOverpaidNonCash =>
      'UPI, కార్డు బకాయి మొత్తం కంటే ఎక్కువ ఉండకూడదు.';

  @override
  String get posErrorsUnderpaid => 'బిల్లు పూర్తిగా చెల్లించబడలేదు.';

  @override
  String get posErrorsInvalidPayment => 'చెల్లింపు మొత్తం నమోదు చేయండి.';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'ఖాతాలో అమ్మకానికి కస్టమర్‌ను ఎంచుకోండి.';

  @override
  String get posErrorsDiscountExceedsAmount => 'తగ్గింపు బిల్లు కంటే ఎక్కువ.';

  @override
  String get posErrorsVoidSameDayOnly =>
      'ఈరోజు బిల్లులను మాత్రమే రద్దు చేయగలరు.';

  @override
  String get posErrorsOrderNotOpen => 'ఆ ఆర్డర్ ముగిసింది.';

  @override
  String get posErrorsBillNumberTaken => 'ఆ బిల్లు నంబర్ ఇప్పటికే వాడబడింది.';

  @override
  String get posErrorsInvalidPhone => '10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.';

  @override
  String get posErrorsNoLines => 'కనీసం ఒక వస్తువు జోడించండి.';

  @override
  String get posDeviceNoTerminal =>
      'ఈ పరికరానికి బిల్లింగ్ కౌంటర్ లేదు. వెబ్‌లో పీఓఎస్ సెట్టింగ్‌లు తెరిచి ఈ పరికరానికి ఒక కౌంటర్ లింక్ చేసి, తర్వాత సింక్ చేయండి.';

  @override
  String get posDeviceTodayBills => 'ఈ పరికరంలో ఈరోజు బిల్లులు';

  @override
  String get posDeviceWaiting => 'అప్‌లోడ్ కోసం వేచి ఉంది';

  @override
  String get posDeviceUploaded => 'అప్‌లోడ్ అయింది';

  @override
  String posDeviceFailed(String error) {
    return 'అంగీకరించబడలేదు: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'సర్వర్ మొత్తం $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'బిల్లులకు ఈ పరికరంలోనే నంబర్లు వస్తాయి, ఆన్‌లైన్‌లోకి వచ్చాక అప్‌లోడ్ అవుతాయి.';

  @override
  String get posDeviceNoFiscalYear =>
      'ఈరోజు ఏ ఆర్థిక సంవత్సరంలోనూ లేదు. ముందుగా క్లౌడ్‌తో సింక్ చేయండి.';

  @override
  String get posPromoReferredBy => 'సిఫార్సు చేసినవారు (మొబైల్)';

  @override
  String posPromoReferredHint(String points) {
    return 'వారికి $points పాయింట్లు';
  }

  @override
  String get posPromoCoupon => 'కూపన్ కోడ్';

  @override
  String posPromoCouponOk(String off) {
    return '$off తగ్గింపు';
  }

  @override
  String get posPromoCard => 'డిస్కౌంట్ కార్డ్';

  @override
  String get posPromoCardOff => 'డిస్కౌంట్ కార్డ్';

  @override
  String posPromoCouponOff(String code) {
    return 'కూపన్ $code';
  }

  @override
  String posPromoVoucher(String code) {
    return 'గిఫ్ట్ వోచర్ $code';
  }

  @override
  String get posPromoToPay => 'చెల్లించాల్సినది';

  @override
  String get posPromoVoucherCode => 'గిఫ్ట్ వోచర్ కోడ్';

  @override
  String get posPromoUseVoucher => 'వోచర్ వాడండి';

  @override
  String get posPromoReferralPoints => 'రిఫరల్ పాయింట్లు';

  @override
  String get posPromoReferralPointsHint =>
      'సిఫార్సు చేసినవారు చేరి కొంటే సభ్యునికి (0 = ఆఫ్)';

  @override
  String get posPromoErrorsCouponNotFound =>
      'అలాంటి కూపన్ లేదు, లేదా ఆఫ్‌లో ఉంది.';

  @override
  String get posPromoErrorsCouponNotValidToday => 'ఈ కూపన్ ఈరోజు చెల్లదు.';

  @override
  String get posPromoErrorsCouponUsedUp => 'ఈ కూపన్ పూర్తిగా వాడబడింది.';

  @override
  String get posPromoErrorsCouponMinBill => 'బిల్ ఈ కూపన్ కనీసం కంటే తక్కువ.';

  @override
  String get posPromoErrorsCardNotFound =>
      'అలాంటి డిస్కౌంట్ కార్డ్ లేదు, లేదా ఆఫ్‌లో ఉంది.';

  @override
  String get posPromoErrorsCardExpired => 'ఈ డిస్కౌంట్ కార్డ్ గడువు ముగిసింది.';

  @override
  String get posPromoErrorsVoucherNotFound => 'ఆ కోడ్‌తో గిఫ్ట్ వోచర్ లేదు.';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'ఈ గిఫ్ట్ వోచర్ వాడబడింది లేదా గడువు ముగిసింది.';

  @override
  String get posPromoErrorsVoucherBalanceLow => 'వోచర్‌లో అంత మిగిలి లేదు.';

  @override
  String get posPromoErrorsVoucherMoreThanBill => 'వోచర్లు బిల్ కంటే ఎక్కువ.';

  @override
  String get posPromoErrorsVoucherTwice => 'అదే వోచర్ రెండుసార్లు నమోదైంది.';

  @override
  String get posPromoErrorsOnlineOnly =>
      'కూపన్లు, కార్డులు, గిఫ్ట్ వోచర్లకు ఆన్‌లైన్ కౌంటర్ కావాలి.';

  @override
  String get posCounterControls => 'కౌంటర్ నియంత్రణలు';

  @override
  String get posCounterAllowRateChange => 'క్యాషియర్లు ధర మార్చవచ్చు';

  @override
  String get posCounterRequireSalesman => 'ప్రతి లైన్‌కు సేల్స్‌మెన్ అవసరం';

  @override
  String get posCounterMaxLineDiscount => 'గరిష్ఠ లైన్ డిస్కౌంట్, %';

  @override
  String get posCounterMaxBillDiscount => 'గరిష్ఠ బిల్ డిస్కౌంట్, %';

  @override
  String get posCounterLimitHint =>
      'ఖాళీ: పరిమితి లేదు. ఎక్కువైతే ఆమోదించేవారి కారణం అవసరం.';

  @override
  String get posCounterSalesman => 'సేల్స్‌మెన్';

  @override
  String get posCounterNoSalesman => 'సేల్స్‌మెన్ లేరు';

  @override
  String get posCounterBillSalesman => 'బిల్లు సేల్స్‌మెన్';

  @override
  String get posCounterRate => 'ధర';

  @override
  String get posCounterRateLocked => 'ధర లాక్ అయింది';

  @override
  String get posCounterDisc => 'తగ్గింపు ₹';

  @override
  String get posCounterLineDiscount => 'లైన్ డిస్కౌంట్ రూపాయల్లో';

  @override
  String posCounterVisits(String n) {
    return 'సందర్శనలు: $n';
  }

  @override
  String posCounterSpent(String v) {
    return 'ఖర్చు $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'తిరిగిచ్చినది $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'చివరిసారి $date';
  }

  @override
  String get posCounterBuys => 'సాధారణంగా కొనేవి';

  @override
  String get posCounterNewCustomer => 'కొత్త కస్టమర్: ఈ బిల్లుతో చేరతారు.';

  @override
  String get posCounterApprovalReason => 'ఆమోదించిన కారణం';

  @override
  String get posCounterBrokenRate => 'ధర మారింది';

  @override
  String get posCounterBrokenLineDiscount => 'లైన్ డిస్కౌంట్ పరిమితి మించింది';

  @override
  String get posCounterBrokenBillDiscount => 'బిల్ డిస్కౌంట్ పరిమితి మించింది';

  @override
  String get posCounterNeedsApprover => 'మేనేజర్ ఆమోదం అవసరం';

  @override
  String get posCounterHold => 'బిల్ హోల్డ్';

  @override
  String posCounterHeldBills(String n) {
    return 'హోల్డ్ బిల్లులు ($n)';
  }

  @override
  String get posCounterHoldLabel => 'ఎవరి కోసం? (ఐచ్ఛికం)';

  @override
  String get posCounterHoldNow => 'హోల్డ్';

  @override
  String get posCounterUnnamed => 'కస్టమర్';

  @override
  String posCounterPieces(String n) {
    return 'ముక్కలు: $n';
  }

  @override
  String get posCounterResume => 'దీనికి బిల్లు';

  @override
  String get posCounterNoneHeld => 'హోల్డ్ బిల్లులు లేవు.';

  @override
  String get posCounterHoldFirst =>
      'మరొకటి తీసుకునే ముందు ప్రస్తుత బిల్లు హోల్డ్ చేయండి లేదా పూర్తి చేయండి.';

  @override
  String get posCounterSizeStock => 'ఇక్కడ సైజు వారీ స్టాక్';

  @override
  String get posCounterAddSize => 'ఈ రంగు, సైజు జోడించండి';

  @override
  String get posCounterKeysSearch => 'స్కాన్ లేదా శోధన';

  @override
  String get posCounterKeysHold => 'బిల్ హోల్డ్';

  @override
  String get posCounterKeysHeld => 'హోల్డ్ బిల్లులు';

  @override
  String get posCounterKeysCustomer => 'కస్టమర్';

  @override
  String get posCounterKeysDiscount => 'డిస్కౌంట్';

  @override
  String get posCounterKeysCash => 'పూర్తి నగదు';

  @override
  String get posCounterKeysUpi => 'పూర్తి UPI';

  @override
  String get posCounterKeysCard => 'పూర్తి కార్డ్';

  @override
  String get posCounterKeysPay => 'బిల్ పూర్తి';

  @override
  String get posCounterKeysExchange => 'వాపసు లేదా మార్పు';

  @override
  String get posCounterErrorsRateLocked =>
      'ధర లాక్ అయింది. మేనేజర్ కారణంతో అనుమతించవచ్చు.';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'లైన్ డిస్కౌంట్ పరిమితి మించింది. మేనేజర్ కారణంతో అనుమతించవచ్చు.';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'బిల్ డిస్కౌంట్ పరిమితి మించింది. మేనేజర్ కారణంతో అనుమతించవచ్చు.';

  @override
  String get posCounterErrorsSalesmanRequired =>
      'ప్రతి లైన్‌కు సేల్స్‌మెన్‌ను ఎంచుకోండి.';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'ఆ సేల్స్‌మెన్ సిబ్బంది జాబితాలో లేరు.';

  @override
  String get posCounterErrorsHeldBillGone =>
      'ఆ హోల్డ్ బిల్లు ఇప్పటికే తీసుకున్నారు.';

  @override
  String get posCounterAutoSendBill =>
      'కస్టమర్ మొబైల్ ఇస్తే బిల్లును ఆటోమేటిక్‌గా వాట్సాప్‌లో పంపండి';

  @override
  String get posCounterBrowse => 'వస్తువులు చూడండి';

  @override
  String get posCounterItem => 'వస్తువు';

  @override
  String posCounterPiecesInBill(String n) {
    return 'బిల్లులో $n పీసులు';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'ధర ప్రకారం మొత్తం $v';
  }

  @override
  String get posCounterOffers => 'డిస్కౌంట్, ఆఫర్లు';

  @override
  String get posCounterBreakdown => 'బిల్లు వివరాలు';

  @override
  String get posCounterInclGst => 'GST తో కలిపి';

  @override
  String get posCounterBillItems => 'బిల్లు వస్తువులు';

  @override
  String get posCounterScanToStart =>
      'బిల్లు ప్రారంభించడానికి బార్‌కోడ్ స్కాన్ చేయండి లేదా వెతకండి. హోల్డ్ బిల్లు తీసుకోవడానికి F4.';

  @override
  String get bankingAccountsTitle => 'బ్యాంకులు';

  @override
  String get bankingAccountsSubtitle =>
      'మీ బ్యాంక్ స్టేట్‌మెంట్లను ఖాతాలతో సరిపోల్చండి.';

  @override
  String get bankingAccountsBookBalance => 'ఖాతాల ప్రకారం';

  @override
  String get bankingAccountsStatementBalance => 'బ్యాంక్ ప్రకారం';

  @override
  String bankingAccountsAsOf(String date) {
    return '$date నాటికి';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'సరిపోల్చాల్సిన $count లైన్లు',
      one: 'సరిపోల్చాల్సిన $count లైన్',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'అన్నీ సరిపోయాయి';

  @override
  String get bankingAccountsNone =>
      'ఇంకా బ్యాంక్ ఖాతాలు లేవు. ఖాతాల జాబితాలో Bank Accounts కింద లెడ్జర్ జోడించండి.';

  @override
  String get bankingAccountsReconcile => 'సరిపోల్చండి';

  @override
  String get bankingAccountsNoStatement => 'ఇంకా స్టేట్‌మెంట్ లేదు';

  @override
  String get bankingProfileTitle => 'బ్యాంక్ వివరాలు';

  @override
  String get bankingProfileBankName => 'బ్యాంక్';

  @override
  String get bankingProfileLast4 => 'ఖాతా (చివరి 4 అంకెలు)';

  @override
  String get bankingProfileIfsc => 'IFSC';

  @override
  String get bankingProfileSave => 'సేవ్ చేయండి';

  @override
  String get bankingImportTitle => 'స్టేట్‌మెంట్ దిగుమతి';

  @override
  String get bankingImportHint =>
      'నెట్ బ్యాంకింగ్ నుండి స్టేట్‌మెంట్‌ను CSVగా డౌన్‌లోడ్ చేయండి (Excel నుండి: Save As → CSV). కాలమ్‌లు శీర్షికల ద్వారా గుర్తించబడతాయి, కాబట్టి చాలా భారతీయ బ్యాంకులు పనిచేస్తాయి.';

  @override
  String get bankingImportFile => 'స్టేట్‌మెంట్ ఫైల్ (CSV)';

  @override
  String get bankingImportButton => 'దిగుమతి చేయండి';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$added లైన్లు జోడించబడ్డాయి, $duplicates ఇప్పటికే ఉన్నాయి, $matched ఆటోమేటిక్‌గా సరిపోయాయి.';
  }

  @override
  String get bankingFeedTitle => 'బ్యాంక్ ఫీడ్';

  @override
  String get bankingFeedHint =>
      'మీరు సమ్మతి ఆమోదించాక లావాదేవీలు RBI అకౌంట్ అగ్రిగేటర్ వ్యవస్థ ద్వారా వస్తాయి. ప్రొవైడర్ నమోదయ్యే వరకు సిమ్యులేటర్ పనిచేస్తుంది.';

  @override
  String get bankingFeedConnect => 'కనెక్ట్ చేయండి';

  @override
  String get bankingFeedFetch => 'ఇప్పుడే తెచ్చుకోండి';

  @override
  String get bankingFeedDisconnect => 'డిస్‌కనెక్ట్';

  @override
  String get bankingFeedStatusesActive => 'కనెక్ట్ అయింది';

  @override
  String get bankingFeedStatusesPending => 'సమ్మతి కోసం వేచి ఉంది';

  @override
  String get bankingFeedStatusesRevoked => 'డిస్‌కనెక్ట్ అయింది';

  @override
  String bankingFeedFetched(String date) {
    return '$date వరకు తెచ్చుకున్నాం';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$added కొత్త లావాదేవీలు, $matched సరిపోయాయి.';
  }

  @override
  String get bankingTabsOpen => 'సరిపోల్చాల్సినవి';

  @override
  String get bankingTabsMatched => 'సరిపోయినవి';

  @override
  String get bankingTabsIgnored => 'విస్మరించినవి';

  @override
  String get bankingTabsBrs => 'సరిపోలిక స్టేట్‌మెంట్';

  @override
  String get bankingLinesDate => 'తేదీ';

  @override
  String get bankingLinesDescription => 'వివరణ';

  @override
  String get bankingLinesWithdrawal => 'ఉపసంహరణ';

  @override
  String get bankingLinesDeposit => 'జమ';

  @override
  String get bankingLinesBalance => 'బ్యాలెన్స్';

  @override
  String get bankingLinesSuggestion => 'ఇలా కనిపిస్తోంది';

  @override
  String get bankingLinesAccept => 'సరిపోల్చండి';

  @override
  String get bankingLinesCreate => 'ఎంట్రీ పోస్ట్ చేయండి';

  @override
  String get bankingLinesIgnore => 'విస్మరించండి';

  @override
  String get bankingLinesByHand => 'ఎంట్రీ వెతకండి';

  @override
  String get bankingLinesUnmatch => 'సరిపోలిక తీసివేయండి';

  @override
  String get bankingLinesRestore => 'పునరుద్ధరించండి';

  @override
  String get bankingLinesAccount => 'ఈ లెడ్జర్‌కు పోస్ట్ చేయండి';

  @override
  String get bankingLinesNarration => 'వివరణ';

  @override
  String bankingLinesRule(String account) {
    return 'నియమం: $account';
  }

  @override
  String get bankingLinesApplyRules => 'నియమాల ప్రకారం అన్నీ పోస్ట్ చేయండి';

  @override
  String bankingLinesRulesDone(String count) {
    return '$count ఎంట్రీలు పోస్ట్ అయ్యాయి.';
  }

  @override
  String get bankingLinesNone => 'ఇక్కడ ఏమీ లేదు.';

  @override
  String bankingLinesEntries(String from, String to) {
    return '$from నుండి $to వరకు సరిపోలని ఎంట్రీలు';
  }

  @override
  String get bankingLinesMatchSelected => 'ఎంచుకున్నవి సరిపోల్చండి';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return '$amountలో $total ఎంచుకున్నారు';
  }

  @override
  String get bankingLinesReasonsAmount => 'అదే మొత్తం';

  @override
  String get bankingLinesReasonsSameDay => 'అదే రోజు';

  @override
  String get bankingLinesReasonsReference => 'అదే సూచన';

  @override
  String get bankingLinesReasonsParty => 'పార్టీ పేరు';

  @override
  String get bankingBrsAsOf => 'ఈ తేదీ నాటికి';

  @override
  String get bankingBrsPerBooks => 'ఖాతాల ప్రకారం బ్యాలెన్స్';

  @override
  String get bankingBrsNotPresented => 'కలపండి: ఇచ్చి ఇంకా సమర్పించని చెక్కులు';

  @override
  String get bankingBrsNotCredited =>
      'తీసివేయండి: బ్యాంక్ ఇంకా జమ చేయని డిపాజిట్లు';

  @override
  String get bankingBrsBankDebits =>
      'తీసివేయండి: ఖాతాల్లో లేని బ్యాంక్ డెబిట్లు';

  @override
  String get bankingBrsBankCredits =>
      'కలపండి: ఖాతాల్లో లేని బ్యాంక్ క్రెడిట్లు';

  @override
  String get bankingBrsPerBank => 'బ్యాంక్ ప్రకారం బ్యాలెన్స్';

  @override
  String bankingBrsStatement(String date) {
    return '$date నాటి స్టేట్‌మెంట్ బ్యాలెన్స్';
  }

  @override
  String get bankingBrsDifference => 'తేడా';

  @override
  String get bankingBrsBalanced => 'సరిపోయింది';

  @override
  String get bankingRulesTitle => 'బ్యాంక్ నియమాలు';

  @override
  String get bankingRulesSubtitle =>
      'ఈ పదాలున్న స్టేట్‌మెంట్ లైన్లు ఒక క్లిక్‌తో లెడ్జర్‌కు పోస్ట్ అవుతాయి (బ్యాంక్ ఛార్జీలు, వడ్డీ, స్టాండింగ్ ఆర్డర్లు).';

  @override
  String get bankingRulesContains => 'వివరణలో ఉంది';

  @override
  String get bankingRulesDirection => 'డబ్బు';

  @override
  String get bankingRulesDirectionsIn => 'వచ్చింది';

  @override
  String get bankingRulesDirectionsOut => 'వెళ్లింది';

  @override
  String get bankingRulesDirectionsAny => 'వచ్చినా వెళ్లినా';

  @override
  String get bankingRulesAccount => 'దీనికి పోస్ట్ చేయండి';

  @override
  String get bankingRulesNarration => 'వివరణ';

  @override
  String get bankingRulesPriority => 'ప్రాధాన్యత';

  @override
  String get bankingRulesAdd => 'నియమం జోడించండి';

  @override
  String get bankingRulesSave => 'సేవ్ చేయండి';

  @override
  String get bankingSettlementsTitle => 'గేట్‌వే సెటిల్‌మెంట్లు';

  @override
  String get bankingSettlementsSubtitle =>
      'Razorpay, PhonePe, Paytm మొదలైన వాటి చెల్లింపులు: వసూళ్లు మైనస్ రీఫండ్‌లు, ఫీజులు, ఫీజులపై జీఎస్టీ, బ్యాంక్‌లో ఒకే జమగా.';

  @override
  String get bankingSettlementsProvider => 'గేట్‌వే';

  @override
  String get bankingSettlementsBank => 'జమ అయిన చోటు';

  @override
  String get bankingSettlementsClearing => 'వసూళ్లు ఇక్కడ నమోదయ్యాయి';

  @override
  String get bankingSettlementsFile => 'సెటిల్‌మెంట్ నివేదిక (CSV)';

  @override
  String get bankingSettlementsImport => 'దిగుమతి చేయండి';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$posted చెల్లింపులు పోస్ట్ అయ్యాయి, $skipped ఇప్పటికే అయ్యాయి, $matched బ్యాంక్‌తో సరిపోయాయి.';
  }

  @override
  String get bankingSettlementsSettlementId => 'సెటిల్‌మెంట్';

  @override
  String get bankingSettlementsSettledOn => 'సెటిల్ తేదీ';

  @override
  String get bankingSettlementsPayments => 'చెల్లింపులు';

  @override
  String get bankingSettlementsGross => 'వసూలైంది';

  @override
  String get bankingSettlementsRefunds => 'రీఫండ్‌లు';

  @override
  String get bankingSettlementsFees => 'ఫీజులు';

  @override
  String get bankingSettlementsTax => 'ఫీజులపై జీఎస్టీ';

  @override
  String get bankingSettlementsNet => 'చెల్లించింది';

  @override
  String get bankingSettlementsMatched => 'బ్యాంక్‌లో';

  @override
  String get bankingSettlementsNone => 'ఇంకా సెటిల్‌మెంట్లు లేవు.';

  @override
  String get bankingErrorsNoHeader =>
      'శీర్షిక వరుస దొరకలేదు. కాలమ్ శీర్షికలతో స్టేట్‌మెంట్‌ను CSVగా సేవ్ చేయండి.';

  @override
  String get bankingErrorsNoRows => 'ఫైల్‌లో లావాదేవీలు దొరకలేదు.';

  @override
  String get bankingErrorsBadAmount => 'ఫైల్‌లోని ఒక మొత్తాన్ని చదవలేకపోయాం.';

  @override
  String get bankingErrorsUnknownFormat =>
      'ఇది సెటిల్‌మెంట్ నివేదికలా లేదు (settlement id, amount, fee కాలమ్‌లు కావాలి).';

  @override
  String get bankingErrorsInvalidFile => 'ఫైల్ చదవలేకపోయాం.';

  @override
  String get bankingErrorsNotABankAccount =>
      'Bank Accounts కింది లెడ్జర్‌ను ఎంచుకోండి.';

  @override
  String get bankingErrorsFeedNotConnected =>
      'ముందుగా బ్యాంక్ ఫీడ్ కనెక్ట్ చేయండి.';

  @override
  String get bankingErrorsLineAlreadyMatched => 'ఆ లైన్ ఇప్పటికే సరిపోయింది.';

  @override
  String get bankingErrorsVoucherNotOpen =>
      'ఆ ఎంట్రీ ఇప్పటికే సరిపోయింది లేదా రద్దయింది.';

  @override
  String get bankingErrorsWrongDirection =>
      'వచ్చిన డబ్బు రసీదులతో, వెళ్లిన డబ్బు చెల్లింపులతో మాత్రమే సరిపోతుంది.';

  @override
  String get bankingErrorsAmountsDiffer =>
      'ఎంట్రీల మొత్తం లైన్ మొత్తానికి సమానం కాదు.';

  @override
  String get bankingErrorsSameAccount => 'వేరే లెడ్జర్ ఎంచుకోండి.';

  @override
  String get bankingErrorsInvalidIfsc => 'సరైన IFSC నమోదు చేయండి.';

  @override
  String get assetsRegisterTitle => 'స్థిర ఆస్తులు';

  @override
  String get assetsRegisterSubtitle =>
      'రిజిస్టర్, కంపెనీల చట్టం ప్రకారం తరుగుదల, ఆదాయపు పన్ను బ్లాక్ షెడ్యూల్.';

  @override
  String get assetsRegisterNew => 'ఆస్తి జోడించండి';

  @override
  String get assetsRegisterCode => 'కోడ్';

  @override
  String get assetsRegisterName => 'ఆస్తి';

  @override
  String get assetsRegisterClass => 'తరగతి';

  @override
  String get assetsRegisterPurchased => 'కొన్నది';

  @override
  String get assetsRegisterPutToUse => 'నుండి వాడుకలో';

  @override
  String get assetsRegisterCost => 'ఖర్చు';

  @override
  String get assetsRegisterAccumulated => 'ఇప్పటివరకు తరుగుదల';

  @override
  String get assetsRegisterBookValue => 'పుస్తక విలువ';

  @override
  String get assetsRegisterStatus => 'స్థితి';

  @override
  String get assetsRegisterStatusesActive => 'వాడుకలో';

  @override
  String get assetsRegisterStatusesDisposed => 'అమ్మేసింది / తొలగించింది';

  @override
  String get assetsRegisterLocation => 'ప్రదేశం';

  @override
  String get assetsRegisterSerialNo => 'సీరియల్ నం.';

  @override
  String get assetsRegisterCustodian => 'ఎవరి వద్ద';

  @override
  String get assetsRegisterNone => 'ఇంకా ఆస్తులు లేవు.';

  @override
  String get assetsClassesTitle => 'ఆస్తి తరగతులు';

  @override
  String get assetsClassesPresets => 'ప్రామాణిక తరగతి జోడించండి';

  @override
  String get assetsClassesPreset => 'తరగతి';

  @override
  String get assetsClassesAdd => 'జోడించండి';

  @override
  String get assetsClassesCustom => 'లేదా మీదే నిర్వచించండి';

  @override
  String get assetsClassesName => 'పేరు';

  @override
  String get assetsClassesMethod => 'పద్ధతి';

  @override
  String get assetsClassesMethodsSlm => 'సరళ రేఖ';

  @override
  String get assetsClassesMethodsWdv => 'తగ్గుతున్న విలువ (WDV)';

  @override
  String get assetsClassesLife => 'ఉపయోగకర జీవితకాలం (సంవత్సరాలు)';

  @override
  String get assetsClassesResidual => 'అవశేష విలువ %';

  @override
  String get assetsClassesItBlock => 'ఆదాయపు పన్ను బ్లాక్';

  @override
  String get assetsClassesItRate => 'పన్ను రేటు %';

  @override
  String get assetsClassesBlocksBuilding => 'భవనాలు';

  @override
  String get assetsClassesBlocksPlantMachinery => 'ప్లాంట్ & యంత్రాలు';

  @override
  String get assetsClassesBlocksFurniture => 'ఫర్నిచర్ & ఫిట్టింగ్‌లు';

  @override
  String get assetsClassesBlocksComputers => 'కంప్యూటర్లు & సాఫ్ట్‌వేర్';

  @override
  String get assetsClassesBlocksIntangibles => 'కనిపించని ఆస్తులు';

  @override
  String get assetsFormAcquisition => 'ఎలా వచ్చింది';

  @override
  String get assetsFormAcquisitionsSupplier => 'అప్పుపై కొన్నది';

  @override
  String get assetsFormAcquisitionsPaid =>
      'నగదు లేదా బ్యాంక్ నుండి చెల్లించింది';

  @override
  String get assetsFormAcquisitionsOpening =>
      'ఇప్పటికే ఖాతాల్లో (ముందుకు తెచ్చినది)';

  @override
  String get assetsFormSupplier => 'సరఫరాదారు';

  @override
  String get assetsFormPaidFrom => 'నుండి చెల్లించింది';

  @override
  String get assetsFormGstRate =>
      'జీఎస్టీ రేటు % (ఇన్‌పుట్ క్రెడిట్ తీసుకున్నది)';

  @override
  String get assetsFormSupplierGstin => 'సరఫరాదారు జీఎస్టీఐఎన్';

  @override
  String get assetsFormInvoiceRef => 'బిల్లు నం.';

  @override
  String get assetsFormOpeningAccumulated => 'ఇంతకుముందు విధించిన తరుగుదల';

  @override
  String get assetsFormNotes => 'గమనికలు';

  @override
  String get assetsFormSave => 'ఆస్తి జోడించండి';

  @override
  String get assetsDetailHistory => 'విధించిన తరుగుదల';

  @override
  String get assetsDetailPeriod => 'కాలం';

  @override
  String get assetsDetailDays => 'రోజులు';

  @override
  String get assetsDetailVoucher => 'ఎంట్రీ';

  @override
  String get assetsDetailDispose => 'అమ్మండి లేదా తొలగించండి';

  @override
  String get assetsDetailDisposeDate => 'తేదీ';

  @override
  String get assetsDetailSaleValue => 'అమ్మకపు విలువ (₹, తొలగిస్తే 0)';

  @override
  String get assetsDetailReceivedIn => 'స్వీకరించిన చోటు';

  @override
  String get assetsDetailSaleGst => 'అమ్మకంపై జీఎస్టీ %';

  @override
  String get assetsDetailBuyerState =>
      'కొనుగోలుదారు రాష్ట్రం (మీ రాష్ట్రం బయట అయితే)';

  @override
  String get assetsDetailDisposeButton => 'అమ్మకం నమోదు చేయండి';

  @override
  String assetsDetailDisposed(String date, String value) {
    return '$dateన $valueకి అమ్మబడింది';
  }

  @override
  String get assetsDetailProfit => 'అమ్మకంపై లాభం';

  @override
  String get assetsDetailLoss => 'అమ్మకంపై నష్టం';

  @override
  String get assetsDetailPurchase => 'కొనుగోలు ఎంట్రీ';

  @override
  String get assetsDepreciationTitle => 'తరుగుదల';

  @override
  String get assetsDepreciationSubtitle =>
      'ఒక నెల, త్రైమాసికం లేదా సంవత్సరానికి తరుగుదల విధించండి. ప్రతి ఆస్తి చివరిసారి ఆగిన చోటు నుండి కొనసాగుతుంది.';

  @override
  String get assetsDepreciationFrom => 'నుండి';

  @override
  String get assetsDepreciationTo => 'వరకు';

  @override
  String get assetsDepreciationPreview => 'లెక్కించండి';

  @override
  String get assetsDepreciationPost => 'తరుగుదల పోస్ట్ చేయండి';

  @override
  String get assetsDepreciationTotal => 'మొత్తం';

  @override
  String get assetsDepreciationRuns => 'రన్‌లు';

  @override
  String get assetsDepreciationNone => 'ఈ కాలానికి విధించడానికి ఏమీ లేదు.';

  @override
  String get assetsDepreciationCancel => 'రన్ రద్దు చేయండి';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ఆస్తులు',
      one: '$count ఆస్తి',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'ఆదాయపు పన్ను తరుగుదల';

  @override
  String get assetsItSubtitle =>
      'బ్లాక్ వారీగా, పన్ను ఆడిట్ నివేదిక లాగా (ఫారం 3CD, క్లాజ్ 18). 180 రోజుల లోపు వాడిన చేర్పులకు సగం రేటు.';

  @override
  String get assetsItFy => 'సంవత్సరం';

  @override
  String get assetsItBlock => 'బ్లాక్';

  @override
  String get assetsItRate => 'రేటు';

  @override
  String get assetsItOpening => 'ప్రారంభ WDV';

  @override
  String get assetsItAddFull => 'చేర్పులు (180 రోజులు లేదా ఎక్కువ)';

  @override
  String get assetsItAddHalf => 'చేర్పులు (180 రోజుల లోపు)';

  @override
  String get assetsItSales => 'అమ్మకాలు';

  @override
  String get assetsItDepreciation => 'తరుగుదల';

  @override
  String get assetsItClosing => 'ముగింపు WDV';

  @override
  String get assetsItGain => 'స్వల్పకాలిక లాభం';

  @override
  String get assetsItLoss => 'స్వల్పకాలిక నష్టం';

  @override
  String get assetsItOpeningTitle => 'ప్రారంభ తగ్గుతున్న విలువ';

  @override
  String get assetsItOpeningHint =>
      'మీ చివరి పన్ను రిటర్న్ నుండి మొదటి సంవత్సరం ప్రారంభంలో ప్రతి బ్లాక్ WDV నమోదు చేయండి; తర్వాతి సంవత్సరాలు ఆటోమేటిక్‌గా కొనసాగుతాయి.';

  @override
  String get assetsItSave => 'సేవ్ చేయండి';

  @override
  String get assetsItTotal => 'మొత్తం';

  @override
  String get assetsItNone => 'ఈ సంవత్సరం ఆస్తులు లేవు.';

  @override
  String get assetsErrorsClassExists => 'ఆ తరగతి ఇప్పటికే ఉంది.';

  @override
  String get assetsErrorsClassIncomplete =>
      'పేరు, జీవితకాలం, పన్ను బ్లాక్ నింపండి.';

  @override
  String get assetsErrorsUnknownPreset => 'తరగతి ఎంచుకోండి.';

  @override
  String get assetsErrorsInvalidLife =>
      'ఉపయోగకర జీవితకాలాన్ని సంవత్సరాల్లో నమోదు చేయండి.';

  @override
  String get assetsErrorsInvalidResidual =>
      'తగ్గుతున్న విలువ పద్ధతికి అవశేష విలువ 0% కంటే ఎక్కువ కావాలి.';

  @override
  String get assetsErrorsUnknownClass => 'తరగతి ఎంచుకోండి.';

  @override
  String get assetsErrorsClassArchived => 'ఆ తరగతి ఆర్కైవ్ చేయబడింది.';

  @override
  String get assetsErrorsInvalidCost => 'ఖర్చు నమోదు చేయండి.';

  @override
  String get assetsErrorsUsedBeforeBought => 'కొనకముందే వాడుకలో ఉండదు.';

  @override
  String get assetsErrorsAccountRequired => 'లెడ్జర్ ఎంచుకోండి.';

  @override
  String get assetsErrorsNotASupplier => 'సరఫరాదారుని ఎంచుకోండి.';

  @override
  String get assetsErrorsNotCashOrBank =>
      'నగదు లేదా బ్యాంక్ లెడ్జర్ ఎంచుకోండి.';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'ఇన్‌పుట్ క్రెడిట్ తీసుకోవడానికి సరఫరాదారు జీఎస్టీఐఎన్ నమోదు చేయండి.';

  @override
  String get assetsErrorsPeriodCrossesYear =>
      'కాలం ఒకే ఆర్థిక సంవత్సరంలో ఉండాలి.';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'ఈ కాలానికి విధించడానికి ఏమీ లేదు.';

  @override
  String get assetsErrorsLaterRunExists =>
      'తర్వాతి రన్ ఈ ఆస్తులకు తరుగుదల విధిస్తుంది; ముందుగా దాన్ని రద్దు చేయండి.';

  @override
  String get assetsErrorsAssetDisposed => 'ఈ రన్‌లోని ఒక ఆస్తి అమ్మబడింది.';

  @override
  String get assetsErrorsAlreadyDisposed => 'ఈ ఆస్తి ఇప్పటికే అమ్మబడింది.';

  @override
  String get assetsErrorsSoldBeforeUse =>
      'అమ్మకపు తేదీ వాడుకలోకి వచ్చిన తేదీకి ముందుది.';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'అమ్మకపు తేదీ తర్వాత కూడా తరుగుదల విధించబడింది; ముందుగా ఆ రన్ రద్దు చేయండి.';

  @override
  String get assetsErrorsInvalidDepreciation => 'తరుగుదల లెక్కించలేకపోయాం.';

  @override
  String get assetsErrorsInvalidFy => 'సంవత్సరం ఎంచుకోండి.';

  @override
  String get expensesClaimsTitle => 'ఖర్చుల క్లెయిమ్‌లు';

  @override
  String get expensesClaimsSubtitle =>
      'సిబ్బంది ఖర్చు చేసినది క్లెయిమ్ చేస్తారు; ఆమోదంతో అది నమోదవుతుంది (అనుమతి ఉన్నచోట జీఎస్టీ క్రెడిట్‌తో), చెల్లింపుతో సెటిల్ అవుతుంది.';

  @override
  String get expensesClaimsNew => 'కొత్త క్లెయిమ్';

  @override
  String get expensesClaimsNumber => 'క్లెయిమ్';

  @override
  String get expensesClaimsEmployee => 'ఉద్యోగి';

  @override
  String get expensesClaimsDate => 'తేదీ';

  @override
  String get expensesClaimsClaimTitle => 'ఉద్దేశ్యం';

  @override
  String get expensesClaimsTotal => 'మొత్తం';

  @override
  String get expensesClaimsItc => 'జీఎస్టీ క్రెడిట్';

  @override
  String get expensesClaimsStatus => 'స్థితి';

  @override
  String get expensesClaimsStatusesDraft => 'డ్రాఫ్ట్';

  @override
  String get expensesClaimsStatusesSubmitted => 'ఆమోదం కోసం వేచి ఉంది';

  @override
  String get expensesClaimsStatusesApproved => 'ఆమోదించబడింది';

  @override
  String get expensesClaimsStatusesRejected => 'తిరస్కరించబడింది';

  @override
  String get expensesClaimsStatusesPaid => 'చెల్లించబడింది';

  @override
  String get expensesClaimsStatusesCancelled => 'రద్దయింది';

  @override
  String get expensesClaimsWaiting => 'ఆమోదం కోసం వేచి ఉంది';

  @override
  String get expensesClaimsToPay => 'ఆమోదించబడింది, చెల్లించాలి';

  @override
  String get expensesClaimsNone => 'ఇంకా క్లెయిమ్‌లు లేవు.';

  @override
  String get expensesClaimsAll => 'అన్నీ';

  @override
  String get expensesFormTitle => 'ఖర్చు క్లెయిమ్';

  @override
  String get expensesFormProject => 'ప్రాజెక్టు';

  @override
  String get expensesFormLines => 'ఖర్చులు';

  @override
  String get expensesFormCategory => 'వర్గం';

  @override
  String get expensesFormDescription => 'వివరాలు';

  @override
  String get expensesFormAmount => 'మొత్తం (₹)';

  @override
  String get expensesFormGstRate => 'జీఎస్టీ %';

  @override
  String get expensesFormVendor => 'విక్రేత';

  @override
  String get expensesFormVendorGstin => 'విక్రేత జీఎస్టీఐఎన్';

  @override
  String get expensesFormInvoiceNo => 'బిల్లు నం.';

  @override
  String get expensesFormReceipt => 'రసీదు';

  @override
  String get expensesFormUpload => 'జతచేయండి';

  @override
  String get expensesFormRead => 'రసీదు చదవండి';

  @override
  String get expensesFormReading => 'చదువుతోంది…';

  @override
  String get expensesFormReadDone =>
      'రసీదు నుండి నింపబడింది. దయచేసి తనిఖీ చేయండి.';

  @override
  String get expensesFormReadNone =>
      'ఈ రసీదు చదవలేకపోయాం; దయచేసి వివరాలు టైప్ చేయండి.';

  @override
  String get expensesFormReadDemo =>
      'ఆటోమేటిక్ రీడింగ్ సెటప్ కాలేదు; దయచేసి వివరాలు టైప్ చేయండి.';

  @override
  String get expensesFormAddLine => 'ఖర్చు జోడించండి';

  @override
  String get expensesFormSaveDraft => 'డ్రాఫ్ట్ సేవ్ చేయండి';

  @override
  String get expensesFormSubmit => 'ఆమోదానికి సమర్పించండి';

  @override
  String get expensesFormItcHint =>
      'బిల్లు కంపెనీ పేరుపై విక్రేత జీఎస్టీఐఎన్‌తో పన్ను ఇన్‌వాయిస్ అయి, వర్గం అనుమతిస్తే జీఎస్టీ క్రెడిట్ తీసుకోబడుతుంది.';

  @override
  String get expensesDetailApprove => 'ఆమోదించండి';

  @override
  String get expensesDetailReject => 'తిరస్కరించండి';

  @override
  String get expensesDetailReason => 'కారణం';

  @override
  String get expensesDetailPay => 'చెల్లించండి';

  @override
  String get expensesDetailPayFrom => 'నుండి చెల్లించండి';

  @override
  String get expensesDetailPaidOn => 'చెల్లింపు తేదీ';

  @override
  String get expensesDetailEdit => 'సవరించండి';

  @override
  String get expensesDetailSubmit => 'సమర్పించండి';

  @override
  String get expensesDetailCancel => 'క్లెయిమ్ రద్దు చేయండి';

  @override
  String get expensesDetailVoucher => 'ఖర్చు ఎంట్రీ';

  @override
  String get expensesDetailPaymentVoucher => 'చెల్లింపు';

  @override
  String expensesDetailRejected(String reason) {
    return 'తిరస్కరించబడింది: $reason';
  }

  @override
  String get expensesDetailReceipt => 'రసీదు చూడండి';

  @override
  String get expensesCategoriesTitle => 'ఖర్చుల వర్గాలు';

  @override
  String get expensesCategoriesSubtitle =>
      'ప్రతి రకం ఖర్చు ఏ లెడ్జర్‌కు వెళ్తుంది, పరిమితులు, జీఎస్టీ క్రెడిట్ నిరోధించబడిందా (సెక్షన్ 17(5)).';

  @override
  String get expensesCategoriesName => 'వర్గం';

  @override
  String get expensesCategoriesAccount => 'లెడ్జర్';

  @override
  String get expensesCategoriesBlocked => 'జీఎస్టీ క్రెడిట్ లేదు';

  @override
  String get expensesCategoriesLimit => 'క్లెయిమ్‌కు పరిమితి (₹)';

  @override
  String get expensesCategoriesReceiptAbove => 'దీని పైన రసీదు అవసరం (₹)';

  @override
  String get expensesCategoriesAdd => 'వర్గం జోడించండి';

  @override
  String get expensesCategoriesSave => 'సేవ్ చేయండి';

  @override
  String get expensesErrorsNoLines => 'కనీసం ఒక ఖర్చు జోడించండి.';

  @override
  String get expensesErrorsUnknownCategory => 'వర్గం ఎంచుకోండి.';

  @override
  String get expensesErrorsCategoryArchived => 'ఆ వర్గం ఆర్కైవ్ చేయబడింది.';

  @override
  String get expensesErrorsInvalidAmount => 'మొత్తం నమోదు చేయండి.';

  @override
  String get expensesErrorsReceiptRequired => 'ఈ ఖర్చుకు రసీదు జతచేయండి.';

  @override
  String get expensesErrorsOverLimit =>
      'ఇది వర్గం క్లెయిమ్ పరిమితి కంటే ఎక్కువ.';

  @override
  String get expensesErrorsInvalidGstin => 'విక్రేత జీఎస్టీఐఎన్ చెల్లదు.';

  @override
  String get expensesErrorsUnknownEmployee => 'ఉద్యోగిని ఎంచుకోండి.';

  @override
  String get expensesErrorsUnknownProject => 'ప్రాజెక్టు ఎంచుకోండి.';

  @override
  String get expensesErrorsClaimLocked =>
      'డ్రాఫ్ట్ లేదా తిరస్కరించిన క్లెయిమ్‌ను మాత్రమే మార్చగలరు.';

  @override
  String get expensesErrorsClaimNotSubmitted =>
      'క్లెయిమ్ ఆమోదం కోసం వేచి లేదు.';

  @override
  String get expensesErrorsClaimNotApproved =>
      'ముందుగా క్లెయిమ్‌ను ఆమోదించండి.';

  @override
  String get expensesErrorsClaimPaid =>
      'చెల్లించిన క్లెయిమ్‌ను రద్దు చేయలేరు; ముందుగా చెల్లింపు రద్దు చేయండి.';

  @override
  String get expensesErrorsPaidBeforeClaim =>
      'చెల్లింపు తేదీ క్లెయిమ్ కంటే ముందుది.';

  @override
  String get expensesErrorsCategoryExists => 'ఆ వర్గం ఇప్పటికే ఉంది.';

  @override
  String get expensesErrorsNotAnExpenseAccount => 'ఖర్చు లెడ్జర్ ఎంచుకోండి.';

  @override
  String get expensesErrorsFileType =>
      'ఫోటో (JPG, PNG, WebP) లేదా PDF జతచేయండి.';

  @override
  String get expensesErrorsFileTooLarge => 'ఫైల్ 5 MB కంటే పెద్దది.';

  @override
  String get expensesErrorsFileEmpty => 'ఫైల్ ఖాళీగా ఉంది.';

  @override
  String get projectsListTitle => 'ప్రాజెక్టులు';

  @override
  String get projectsListSubtitle =>
      'ప్రతి పనికి టాస్క్‌లు, సమయం, ఖర్చులు, బిల్లింగ్.';

  @override
  String get projectsListNew => 'కొత్త ప్రాజెక్టు';

  @override
  String get projectsListCode => 'కోడ్';

  @override
  String get projectsListName => 'ప్రాజెక్టు';

  @override
  String get projectsListCustomer => 'కస్టమర్';

  @override
  String get projectsListBilling => 'బిల్లింగ్';

  @override
  String get projectsListBillingsFixed => 'స్థిర ధర';

  @override
  String get projectsListBillingsTimeMaterial => 'సమయం & పదార్థం';

  @override
  String get projectsListBillingsNonBillable => 'అంతర్గత';

  @override
  String get projectsListStatus => 'స్థితి';

  @override
  String get projectsListStatusesActive => 'క్రియాశీలం';

  @override
  String get projectsListStatusesOnHold => 'నిలిపివేయబడింది';

  @override
  String get projectsListStatusesCompleted => 'పూర్తయింది';

  @override
  String get projectsListStatusesCancelled => 'రద్దయింది';

  @override
  String get projectsListRevenue => 'బిల్ చేసింది';

  @override
  String get projectsListCost => 'ఖర్చు';

  @override
  String get projectsListMargin => 'మార్జిన్';

  @override
  String get projectsListHours => 'గంటలు';

  @override
  String get projectsListNone => 'ఇంకా ప్రాజెక్టులు లేవు.';

  @override
  String get projectsFormContractValue => 'ఒప్పంద విలువ (₹)';

  @override
  String get projectsFormBudgetCost => 'బడ్జెట్ ఖర్చు (₹)';

  @override
  String get projectsFormBudgetHours => 'బడ్జెట్ గంటలు';

  @override
  String get projectsFormBillRate => 'గంటకు బిల్లు రేటు (₹)';

  @override
  String get projectsFormBillingItem => 'ఇన్‌వాయిస్‌లో (సేవ వస్తువు)';

  @override
  String get projectsFormStartOn => 'ప్రారంభం';

  @override
  String get projectsFormEndOn => 'ముగింపు';

  @override
  String get projectsFormNotes => 'గమనికలు';

  @override
  String get projectsFormSave => 'ప్రాజెక్టు సేవ్ చేయండి';

  @override
  String get projectsDetailLabour => 'శ్రమ';

  @override
  String get projectsDetailExpenses => 'ఖర్చులు';

  @override
  String get projectsDetailPurchases => 'కొనుగోళ్లు';

  @override
  String get projectsDetailUnbilled => 'బిల్ చేయని సమయం';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return 'బడ్జెట్‌లో $pct%';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return 'గంటల్లో $pct%';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% మార్జిన్';
  }

  @override
  String get projectsDetailTasks => 'టాస్క్‌లు';

  @override
  String get projectsDetailTask => 'టాస్క్';

  @override
  String get projectsDetailAssignee => 'కేటాయించినవారు';

  @override
  String get projectsDetailEstimate => 'అంచనా (గం)';

  @override
  String get projectsDetailLogged => 'నమోదు (గం)';

  @override
  String get projectsDetailDue => 'గడువు';

  @override
  String get projectsDetailTaskStatusesTodo => 'చేయాల్సింది';

  @override
  String get projectsDetailTaskStatusesDoing => 'జరుగుతోంది';

  @override
  String get projectsDetailTaskStatusesDone => 'పూర్తయింది';

  @override
  String get projectsDetailAddTask => 'టాస్క్ జోడించండి';

  @override
  String get projectsDetailMembers => 'బృందం & రేట్లు';

  @override
  String get projectsDetailMember => 'వ్యక్తి';

  @override
  String get projectsDetailMemberRate => 'బిల్లు రేటు (₹/గం)';

  @override
  String get projectsDetailAddMember => 'జోడించండి';

  @override
  String get projectsDetailMilestones => 'మైలురాళ్లు';

  @override
  String get projectsDetailMilestone => 'మైలురాయి';

  @override
  String get projectsDetailAmount => 'మొత్తం (₹)';

  @override
  String get projectsDetailAddMilestone => 'మైలురాయి జోడించండి';

  @override
  String get projectsDetailBill => 'ఇన్‌వాయిస్ చేయండి';

  @override
  String projectsDetailBilled(String number) {
    return 'ఇన్‌వాయిస్ $number';
  }

  @override
  String get projectsDetailTime => 'సమయం';

  @override
  String get projectsDetailBillTime => 'ఆమోదించిన గంటలకు ఇన్‌వాయిస్ చేయండి';

  @override
  String get projectsDetailBillUpTo => 'వరకు';

  @override
  String get projectsDetailInvoices => 'ఇన్‌వాయిస్‌లు';

  @override
  String get projectsDetailEdit => 'ప్రాజెక్టు సవరించండి';

  @override
  String get projectsDetailRemove => 'తీసివేయండి';

  @override
  String projectsDetailInvoiced(String number) {
    return 'ఇన్‌వాయిస్ $number సృష్టించబడింది.';
  }

  @override
  String get projectsTimeTitle => 'టైమ్‌షీట్లు';

  @override
  String get projectsTimeSubtitle =>
      'ప్రాజెక్టులపై గంటలు నమోదు చేయండి; ఆమోదించిన బిల్ చేయదగిన గంటలకు ఇన్‌వాయిస్ చేయవచ్చు.';

  @override
  String get projectsTimeLog => 'సమయం నమోదు చేయండి';

  @override
  String get projectsTimeEmployee => 'ఉద్యోగి';

  @override
  String get projectsTimeProject => 'ప్రాజెక్టు';

  @override
  String get projectsTimeTask => 'టాస్క్';

  @override
  String get projectsTimeDate => 'తేదీ';

  @override
  String get projectsTimeHours => 'గంటలు';

  @override
  String get projectsTimeBillable => 'బిల్ చేయదగినది';

  @override
  String get projectsTimeNote => 'గమనిక';

  @override
  String get projectsTimeSave => 'నమోదు చేయండి';

  @override
  String get projectsTimeApprove => 'ఆమోదించండి';

  @override
  String get projectsTimeReject => 'తిరస్కరించండి';

  @override
  String projectsTimeSelected(String count) {
    return '$count ఎంచుకున్నారు';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'సమర్పించబడింది';

  @override
  String get projectsTimeStatusesApproved => 'ఆమోదించబడింది';

  @override
  String get projectsTimeStatusesRejected => 'తిరస్కరించబడింది';

  @override
  String get projectsTimeStatusesBilled => 'ఇన్‌వాయిస్ అయింది';

  @override
  String get projectsTimeTotal => 'మొత్తం';

  @override
  String get projectsTimeNone => 'సమయం నమోదు కాలేదు.';

  @override
  String get projectsTimeCostRate => 'ఖర్చు/గం';

  @override
  String get projectsTimeBillRate => 'బిల్లు/గం';

  @override
  String get projectsTimeDelete => 'తొలగించండి';

  @override
  String get projectsErrorsNotACustomer => 'కస్టమర్‌ను ఎంచుకోండి.';

  @override
  String get projectsErrorsUnknownItem => 'సేవ వస్తువును ఎంచుకోండి.';

  @override
  String get projectsErrorsEndsBeforeStart =>
      'ముగింపు తేదీ ప్రారంభానికి ముందుది.';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'ముందుగా ప్రాజెక్టు కస్టమర్‌ను నిర్ణయించండి.';

  @override
  String get projectsErrorsBillingItemRequired =>
      'ప్రాజెక్టులో ఇన్‌వాయిస్ వస్తువును ఎంచుకోండి.';

  @override
  String get projectsErrorsMilestoneBilled =>
      'ఆ మైలురాయికి ఇప్పటికే ఇన్‌వాయిస్ అయింది.';

  @override
  String get projectsErrorsProjectNotActive => 'ప్రాజెక్టు క్రియాశీలంగా లేదు.';

  @override
  String get projectsErrorsInvalidHours =>
      '0 నుండి 24 మధ్య గంటలు నమోదు చేయండి.';

  @override
  String get projectsErrorsTooManyHours => 'ఒక రోజులో 24 గంటల కంటే ఎక్కువ.';

  @override
  String get projectsErrorsUnknownTask =>
      'ఈ ప్రాజెక్టులోని టాస్క్‌ను ఎంచుకోండి.';

  @override
  String get projectsErrorsTimesheetLocked =>
      'ఆమోదించిన లేదా ఇన్‌వాయిస్ అయిన సమయాన్ని మార్చలేరు.';

  @override
  String get projectsErrorsNothingToBill =>
      'ఇన్‌వాయిస్ చేయడానికి ఆమోదించిన బిల్ చేయదగిన గంటలు లేవు.';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'సమయం-&-పదార్థం ప్రాజెక్టులు మాత్రమే గంటల ప్రకారం బిల్ చేస్తాయి.';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'ఆ తేదీన ఉద్యోగి ఉద్యోగంలో లేరు.';

  @override
  String get projectsErrorsUnknownEmployee => 'ఉద్యోగిని ఎంచుకోండి.';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count కస్టమర్లు',
      one: '$count కస్టమర్',
    );
    return '$_temp0 60 రోజులకు పైగా చెల్లింపులో ఆలస్యం: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$periodకి $form $days రోజులు ఆలస్యం';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$periodకి $form $days రోజుల్లో దాఖలు చేయాలి';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count వస్తువులు',
      one: '$count వస్తువు',
    );
    return '$_temp0 రీఆర్డర్ స్థాయి కంటే తక్కువ';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$count బ్యాంక్ స్టేట్‌మెంట్ లైన్లు వారం పైగా సరిపోలిక కోసం వేచి ఉన్నాయి';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$count ఖర్చు క్లెయిమ్‌లు 3 రోజులకు పైగా ఆమోదం కోసం వేచి ఉన్నాయి';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ఫాలో-అప్‌లు ఆలస్యం',
      one: '$count ఫాలో-అప్ ఆలస్యం',
    );
    return '$_temp0';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$nameలో రుణాత్మక బ్యాలెన్స్ ($amount): ఒక ఎంట్రీ తప్పిపోయింది లేదా తప్పుగా ఉంది';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    return '$count ఆమోద మెమోలు ఆరు నెలల ఇన్‌వాయిస్ పరిమితికి దగ్గరగా ఉన్నాయి';
  }

  @override
  String alertsApprovalsOut(num count) {
    return '$count ఆమోద మెమోల సరుకు 30 రోజులకు పైగా బయట ఉంది';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count సున్నితమైన మార్పులు',
      one: '$count సున్నితమైన మార్పు',
    );
    return 'గత 7 రోజుల్లో $_temp0 (బ్యాంకు వివరాలు, క్రెడిట్ నిబంధనలు, పన్ను సెట్టింగ్‌లు లేదా హక్కులు)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ఉద్యోగి పత్రాలు',
      one: '$count ఉద్యోగి పత్రం',
    );
    return '$_temp0 ముగిసాయి లేదా 30 రోజుల్లో ముగుస్తాయి';
  }

  @override
  String get checksTitle => 'తనిఖీలు';

  @override
  String get checksSubtitle =>
      'మీ CA చూడక ముందే మళ్లీ చూడాల్సిన ఎంట్రీలు: ఆదాయపు పన్ను చట్టం ప్రకారం నగదు పరిమితులు, సాధ్యమైన నకిలీ బిల్లులు, ఖర్చు కంటే తక్కువకు అమ్మకాలు, సున్నా కంటే తక్కువ స్టాక్.';

  @override
  String get checksNone => 'అసాధారణంగా ఏమీ కనిపించలేదు.';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return '$partyకి నగదు చెల్లించింది: ఒక రోజులో $amount. ఒక వ్యక్తికి ఒక రోజులో ₹10,000 పైగా నగదు ఖర్చు అనుమతించబడదు (సెక్షన్ 40A(3)); బ్యాంక్ ద్వారా చెల్లించండి.';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return '$party నుండి నగదు వచ్చింది: ఒక రోజులో $amount. ₹2 లక్షలు లేదా అంతకంటే ఎక్కువ నగదు స్వీకరించడం అనుమతించబడదు (సెక్షన్ 269ST); జరిమానా అదే మొత్తం.';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplier ఒక వారంలో రెండుసార్లు $amount బిల్లు చేశారు ($first, $second). ఒకటి నకిలీనా?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item $rateకి అమ్మబడింది, కొనుగోలు ధర $cost కంటే తక్కువ.';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item $qty $uom వద్ద ఉంది: స్టాక్‌లో ఉన్నదాని కంటే ఎక్కువ అమ్మబడింది లేదా ఇవ్వబడింది.';
  }

  @override
  String get assistantTitle => 'సహాయకుడు';

  @override
  String get assistantSubtitle =>
      'అమ్మకాలు, బకాయిలు, లాభం, స్టాక్ లేదా జీఎస్టీ గురించి అడగండి. ఇది మీ ఖాతాలను చదువుతుంది; ఎప్పుడూ మార్చదు.';

  @override
  String get assistantPlaceholder => 'ఒక ప్రశ్న అడగండి…';

  @override
  String get assistantSend => 'అడగండి';

  @override
  String get assistantThinking => 'వెతుకుతోంది…';

  @override
  String get assistantClear => 'కొత్త సంభాషణ';

  @override
  String get assistantDemo =>
      'అంతర్నిర్మిత సహాయకుడు: సాధారణ ప్రశ్నలకు సమాధానం ఇస్తుంది. ఏదైనా అడగడానికి AI సేవను కనెక్ట్ చేయండి.';

  @override
  String get assistantClaude =>
      'మీ ఖాతాల నుండి, మీ యాక్సెస్ హక్కులతో Claude సమాధానం ఇచ్చింది.';

  @override
  String get assistantSuggestionsS1 => 'మనకు ఎక్కువగా ఎవరు బాకీ ఉన్నారు?';

  @override
  String get assistantSuggestionsS2 => 'ఈ నెల అమ్మకాలు ఎలా ఉన్నాయి?';

  @override
  String get assistantSuggestionsS3 => 'ఈ నెల మన లాభం ఎంత?';

  @override
  String get assistantSuggestionsS4 =>
      'ఏ వస్తువులు రీఆర్డర్ స్థాయి కంటే తక్కువ ఉన్నాయి?';

  @override
  String get assistantSuggestionsS5 =>
      'నేను తనిఖీ చేయాల్సిన ఎంట్రీలు ఏవైనా ఉన్నాయా?';

  @override
  String assistantTools(String tools) {
    return 'చూసినవి: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'సహాయకుడు బిజీగా ఉంది; ఒక నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.';

  @override
  String get assistantErrorsAssistantFailed =>
      'సహాయకుడు ప్రస్తుతం సమాధానం ఇవ్వలేకపోయింది.';

  @override
  String get assistantErrorsEmptyQuestion => 'ఒక ప్రశ్న టైప్ చేయండి.';

  @override
  String get crmLeadsTitle => 'లీడ్లు';

  @override
  String get crmLeadsSubtitle =>
      'మొదటి విచారణ నుండి ఆర్డర్ వరకు సంభావ్య కస్టమర్లు.';

  @override
  String get crmLeadsNew => 'కొత్త లీడ్';

  @override
  String get crmLeadsName => 'సంప్రదింపు వ్యక్తి';

  @override
  String get crmLeadsOrganisation => 'వ్యాపారం';

  @override
  String get crmLeadsPhone => 'మొబైల్';

  @override
  String get crmLeadsEmail => 'ఈమెయిల్';

  @override
  String get crmLeadsGstin => 'జీఎస్టీఐఎన్';

  @override
  String get crmLeadsState => 'రాష్ట్రం';

  @override
  String get crmLeadsCity => 'నగరం';

  @override
  String get crmLeadsSource => 'మూలం';

  @override
  String get crmLeadsSourcesWalkIn => 'నేరుగా వచ్చారు';

  @override
  String get crmLeadsSourcesReferral => 'సిఫార్సు';

  @override
  String get crmLeadsSourcesWebsite => 'వెబ్‌సైట్';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'వాణిజ్య ప్రదర్శన';

  @override
  String get crmLeadsSourcesOther => 'ఇతర';

  @override
  String get crmLeadsStage => 'దశ';

  @override
  String get crmLeadsStagesNew => 'కొత్తది';

  @override
  String get crmLeadsStagesContacted => 'సంప్రదించాం';

  @override
  String get crmLeadsStagesQualified => 'అర్హత ఉంది';

  @override
  String get crmLeadsStagesProposal => 'ప్రతిపాదన పంపాం';

  @override
  String get crmLeadsStagesWon => 'గెలిచాం';

  @override
  String get crmLeadsStagesLost => 'కోల్పోయాం';

  @override
  String get crmLeadsValue => 'ఆశించిన విలువ (₹)';

  @override
  String get crmLeadsExpectedClose => 'ఆశించిన ముగింపు';

  @override
  String get crmLeadsOwner => 'బాధ్యులు';

  @override
  String get crmLeadsNotes => 'గమనికలు';

  @override
  String get crmLeadsNextFollowUp => 'తదుపరి ఫాలో-అప్';

  @override
  String get crmLeadsSave => 'సేవ్ చేయండి';

  @override
  String get crmLeadsNone => 'ఇంకా లీడ్లు లేవు.';

  @override
  String get crmLeadsSearch => 'పేరు, వ్యాపారం, మొబైల్ లేదా నగరం వెతకండి';

  @override
  String crmLeadsWeighted(String amount) {
    return 'వెయిటెడ్ $amount';
  }

  @override
  String get crmLeadsConvert => 'గెలిచాం: కస్టమర్‌గా మార్చండి';

  @override
  String get crmLeadsLost => 'కోల్పోయినట్లు గుర్తించండి';

  @override
  String get crmLeadsLostReason => 'ఎందుకు కోల్పోయాం?';

  @override
  String get crmLeadsEdit => 'లీడ్ సవరించండి';

  @override
  String get crmActivitiesTitle => 'ఫాలో-అప్‌లు';

  @override
  String get crmActivitiesSubtitle =>
      'కాల్‌లు, సమావేశాలు, పనులు, ముందుగా గడువు ఉన్నవి ముందు.';

  @override
  String get crmActivitiesAdd => 'జోడించండి';

  @override
  String get crmActivitiesKind => 'రకం';

  @override
  String get crmActivitiesKindsCall => 'కాల్';

  @override
  String get crmActivitiesKindsMeeting => 'సమావేశం';

  @override
  String get crmActivitiesKindsTask => 'పని';

  @override
  String get crmActivitiesKindsNote => 'గమనిక';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'ఈమెయిల్';

  @override
  String get crmActivitiesSubject => 'ఏమి చేయాలి లేదా ఏమి జరిగింది';

  @override
  String get crmActivitiesDue => 'ఎప్పుడు';

  @override
  String get crmActivitiesDone => 'పూర్తయినట్లు గుర్తించండి';

  @override
  String get crmActivitiesReopen => 'పూర్తి కాలేదని గుర్తించండి';

  @override
  String get crmActivitiesNotes => 'గమనికలు';

  @override
  String get crmActivitiesNone => 'ఇక్కడ ఏమీ లేదు.';

  @override
  String get crmActivitiesOpen => 'తెరిచినవి';

  @override
  String get crmActivitiesAll => 'అన్నీ';

  @override
  String get crmActivitiesLate => 'ఆలస్యం';

  @override
  String get crmMessagesSend => 'WhatsApp పంపండి';

  @override
  String get crmMessagesTemplate => 'టెంప్లేట్';

  @override
  String crmMessagesSent(String to) {
    return '$toకి పంపబడింది.';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'పంపబడలేదు: $error';
  }

  @override
  String get crmMessagesDemo =>
      'డెమో మోడ్: WhatsApp Business కనెక్ట్ అయ్యే వరకు సందేశాలు నమోదవుతాయి కానీ డెలివరీ కావు.';

  @override
  String get crmMessagesRemind => 'చెల్లింపు రిమైండర్ పంపండి';

  @override
  String get crmTemplatesTitle => 'సందేశ టెంప్లేట్లు';

  @override
  String get crmTemplatesSubtitle =>
      'పేర్లు, మొత్తాలు, తేదీల కోసం సంఖ్య గల ఖాళీలతో WhatsApp సందేశాలు. కస్టమర్‌కు ముందుగా సందేశం పంపాలంటే టెంప్లేట్ Meta ఆమోదం పొందాలి; దాని ఆమోదిత పేరు నమోదు చేయండి.';

  @override
  String get crmTemplatesName => 'పేరు (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'పాఠ్యం';

  @override
  String get crmTemplatesCategory => 'వర్గం';

  @override
  String get crmTemplatesCategoriesUtility =>
      'అప్‌డేట్‌లు (బిల్లులు, రిమైండర్లు)';

  @override
  String get crmTemplatesCategoriesMarketing => 'మార్కెటింగ్';

  @override
  String get crmTemplatesProviderName => 'Metaలో ఆమోదిత పేరు';

  @override
  String get crmTemplatesAdd => 'టెంప్లేట్ జోడించండి';

  @override
  String get crmTemplatesSave => 'సేవ్ చేయండి';

  @override
  String get crmCustomerTitle => 'కస్టమర్';

  @override
  String get crmCustomerBalance => 'బ్యాలెన్స్';

  @override
  String get crmCustomerSalesThisYear => 'ఈ సంవత్సరం అమ్మకాలు';

  @override
  String get crmCustomerSalesLastYear => 'గత సంవత్సరం';

  @override
  String get crmCustomerOpenItems => 'తెరిచిన బిల్లులు';

  @override
  String get crmCustomerInvoices => 'ఇటీవలి ఇన్‌వాయిస్‌లు';

  @override
  String get crmCustomerReceipts => 'ఇటీవల వచ్చిన చెల్లింపులు';

  @override
  String get crmCustomerOrders => 'తెరిచిన కొటేషన్లు, ఆర్డర్లు';

  @override
  String get crmCustomerActivities => 'కార్యకలాపాలు';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'లీడ్ $code నుండి ($source)';
  }

  @override
  String get crmCustomerLedger => 'లెడ్జర్ స్టేట్‌మెంట్';

  @override
  String get crmErrorsInvalidPhone =>
      '10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.';

  @override
  String get crmErrorsInvalidGstin => 'జీఎస్టీఐఎన్ చెల్లదు.';

  @override
  String get crmErrorsConvertToWin =>
      'లీడ్ గెలవడానికి “గెలిచాం: కస్టమర్‌గా మార్చండి” వాడండి.';

  @override
  String get crmErrorsLostReasonRequired => 'ఎందుకు కోల్పోయామో చెప్పండి.';

  @override
  String get crmErrorsAlreadyConverted => 'ఈ లీడ్ ఇప్పటికే కస్టమర్.';

  @override
  String get crmErrorsLeadOrCustomerRequired =>
      'లీడ్ లేదా కస్టమర్‌ను ఎంచుకోండి.';

  @override
  String get crmErrorsUnknownTemplate => 'టెంప్లేట్ ఎంచుకోండి.';

  @override
  String get crmErrorsMissingParam => 'టెంప్లేట్‌లోని ప్రతి ఖాళీని నింపండి.';

  @override
  String get crmErrorsTemplateTooLong => 'టెంప్లేట్ చాలా పొడవుగా ఉంది.';

  @override
  String get crmErrorsTemplateExists => 'ఈ పేరుతో ఇప్పటికే టెంప్లేట్ ఉంది.';

  @override
  String get crmErrorsNothingOutstanding => 'ఈ కస్టమర్ నుండి బకాయి ఏమీ లేదు.';

  @override
  String get crmErrorsInvalidTemplateName =>
      'చిన్న అక్షరాలు, అంకెలు, _ మాత్రమే వాడండి.';

  @override
  String get crmErrorsUnknownAccount => 'కస్టమర్‌ను ఎంచుకోండి.';

  @override
  String get crmErrorsInvalidStage => 'దశను ఎంచుకోండి.';

  @override
  String get priceListsTitle => 'ధరల జాబితా';

  @override
  String get priceListsSubtitle =>
      'హోల్‌సేల్, పంపిణీదారు లేదా రిటైల్ ధరలు. జాబితాలోని కస్టమర్‌కు కొత్త ఆర్డర్లు, ఇన్‌వాయిస్‌లపై దాని ధరలు వస్తాయి.';

  @override
  String get priceListsOne => 'ధరల జాబితా';

  @override
  String get priceListsNone => 'ఏదీ లేదు (అమ్మకం ధర)';

  @override
  String get priceListsNew => 'కొత్త ధరల జాబితా';

  @override
  String get priceListsName => 'పేరు';

  @override
  String get priceListsDiscountPct => 'అమ్మకం ధరపై తగ్గింపు (%)';

  @override
  String get priceListsDiscountHint =>
      'స్థిర ధర లేని ప్రతి ఐటమ్‌కు వర్తిస్తుంది';

  @override
  String get priceListsFixedRates => 'స్థిర ధరలు';

  @override
  String get priceListsCustomers => 'కస్టమర్లు';

  @override
  String get priceListsEmpty => 'ఇంకా ధరల జాబితా లేదు.';

  @override
  String get priceListsAddRate => 'స్థిర ధర జోడించండి';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'ఈ పేరుతో ధరల జాబితా ఇప్పటికే ఉంది.';

  @override
  String get priceListsErrorsDuplicateItem => 'ఒక ఐటమ్ రెండుసార్లు ఉంది.';

  @override
  String get agentsTitle => 'బ్రోకర్లు మరియు ఏజెంట్లు';

  @override
  String get agentsSubtitle =>
      'ప్రతి ఏజెంట్ తెచ్చిన కస్టమర్ల నుండి అందిన డబ్బుపై కమిషన్. సరుకు తిరిగి వస్తే కమిషన్ తిరిగి పోతుంది.';

  @override
  String get agentsIsAgent => 'బ్రోకర్ లేదా ఏజెంట్ (కమిషన్ పొందుతారు)';

  @override
  String get agentsCommissionPct => 'కమిషన్ (%)';

  @override
  String get agentsCommissionHint =>
      'పన్ను విధించదగిన విలువపై, కస్టమర్ చెల్లించినట్లు';

  @override
  String get agentsAgent => 'ఏజెంట్';

  @override
  String get agentsNoAgent => 'ఏజెంట్ లేరు';

  @override
  String get agentsSalesman => 'సేల్స్‌మెన్';

  @override
  String get agentsNoSalesman => 'సేల్స్‌మెన్ లేరు';

  @override
  String get agentsEarned => 'సంపాదించినది';

  @override
  String get agentsBilled => 'బిల్ చేసినది';

  @override
  String get agentsDue => 'బకాయి';

  @override
  String get agentsInvoice => 'ఇన్‌వాయిస్';

  @override
  String get agentsBase => 'పన్ను విలువ';

  @override
  String get agentsReceived => 'అందినది';

  @override
  String get agentsNoInvoices => 'ఇంకా ఇన్‌వాయిస్‌లు లేవు.';

  @override
  String get agentsMakeBill => 'బ్రోకరేజ్ బిల్ చేయండి';

  @override
  String get agentsEmpty =>
      'ఇంకా ఏజెంట్లు లేరు. ఖాతాల జాబితాలో ఒక ఖాతాను బ్రోకర్ లేదా ఏజెంట్‌గా గుర్తించండి.';

  @override
  String get agentsBills => 'బ్రోకరేజ్ బిల్లులు';

  @override
  String get agentsNumber => 'సంఖ్య';

  @override
  String get agentsCommission => 'కమిషన్';

  @override
  String get agentsTds => 'టీడీఎస్';

  @override
  String get agentsNet => 'నికర చెల్లింపు';

  @override
  String get agentsNoBills => 'ఇంకా బ్రోకరేజ్ బిల్లులు లేవు.';

  @override
  String agentsBillFor(String name, String amount) {
    return '$nameకి బకాయి ఉన్న $amount కమిషన్‌కు బిల్ చేయండి.';
  }

  @override
  String get agentsTdsRate => 'టీడీఎస్ రేటు (%)';

  @override
  String get agentsTdsHint =>
      'ఖాళీగా వదిలేయండి: ఏడాది కమిషన్ ₹20,000 దాటితే 194H కింద 2%';

  @override
  String get agentsPost => 'బిల్ పోస్ట్ చేయండి';

  @override
  String get agentsCancelBill => 'బిల్ రద్దు చేయండి';

  @override
  String get agentsErrorsNothingToBill =>
      'ఆ తేదీకి ఈ ఏజెంట్‌కు బకాయి ఏమీ లేదు.';

  @override
  String get agentsErrorsNotAnAgent =>
      'బ్రోకర్ లేదా ఏజెంట్‌గా గుర్తించిన ఖాతాను ఎంచుకోండి.';

  @override
  String get targetsTitle => 'సేల్స్‌మెన్ లక్ష్యాలు';

  @override
  String get targetsSubtitle =>
      'కమిషన్ స్లాబ్‌లతో నెలవారీ లక్ష్యాలు, ప్రతి సేల్స్‌మెన్ అమ్మకాలు (రిటర్న్‌లు తీసివేసి) ఆధారంగా.';

  @override
  String get targetsPrevious => 'గత నెల';

  @override
  String get targetsNext => 'తదుపరి నెల';

  @override
  String get targetsEdit => 'లక్ష్యాలు నిర్ణయించండి';

  @override
  String get targetsChooseSalesman => 'సేల్స్‌మెన్‌ను ఎంచుకోండి';

  @override
  String get targetsTarget => 'లక్ష్యం';

  @override
  String get targetsSlabs => 'స్లాబ్‌లు';

  @override
  String get targetsSlabsHint =>
      'స్లాబ్ = లక్ష్యంలో ఎంత శాతం : కమిషన్ శాతం. ఉదా. 0:1, 100:2 అంటే లక్ష్యం కంటే తక్కువైతే 1%, లక్ష్యం లేదా పైన 2%.';

  @override
  String get targetsAdd => 'సేల్స్‌మెన్‌ను జోడించండి';

  @override
  String get targetsCopyLast => 'గత నెల నుండి కాపీ చేయండి';

  @override
  String get targetsAchieved => 'సాధించినది';

  @override
  String get targetsProgress => 'లక్ష్యంలో';

  @override
  String get targetsRate => 'రేటు';

  @override
  String targetsInvoices(num n) {
    return '$n ఇన్‌వాయిస్‌లు';
  }

  @override
  String targetsReturns(String amount) {
    return 'రిటర్న్‌లు $amount';
  }

  @override
  String get targetsNoTarget => 'లక్ష్యం లేదు';

  @override
  String get targetsEmpty => 'ఈ నెల లక్ష్యాలు లేదా సేల్స్‌మెన్ అమ్మకాలు లేవు.';

  @override
  String get targetsNote =>
      'అమ్మకాలు = సేల్స్‌మెన్ ఉన్న ఇన్‌వాయిస్‌ల పన్ను విలువ, ఆ నెలలో వాటిపై ఇచ్చిన క్రెడిట్ నోట్‌లు తీసివేసి.';

  @override
  String get targetsErrorsInvalid =>
      'ప్రతి వరుసలో సేల్స్‌మెన్, రూపాయల్లో లక్ష్యం, 0:1, 100:2 వంటి స్లాబ్‌లు ఉండాలి.';

  @override
  String get targetsErrorsDuplicateSalesman =>
      'ఒక సేల్స్‌మెన్ రెండుసార్లు ఉన్నారు.';

  @override
  String get targetsErrorsDuplicateSlab =>
      'రెండు స్లాబ్‌లు ఒకే శాతం నుండి మొదలవుతాయి.';

  @override
  String get targetsErrorsUnknownEmployee =>
      'మీ ఉద్యోగుల నుండి సేల్స్‌మెన్‌ను ఎంచుకోండి.';

  @override
  String get schemesTitle => 'స్కీమ్‌లు మరియు ఆఫర్లు';

  @override
  String get schemesSubtitle =>
      'కౌంటర్ స్వయంగా వర్తింపజేసే ఆఫర్లు: శాతం తగ్గింపు, మొత్తం తగ్గింపు, X కొంటే Y, స్లాబ్‌లు, కాంబోలు.';

  @override
  String get schemesNew => 'కొత్త స్కీమ్';

  @override
  String get schemesName => 'పేరు';

  @override
  String get schemesOffer => 'ఆఫర్';

  @override
  String get schemesOn => 'దేనిపై';

  @override
  String get schemesDates => 'తేదీలు';

  @override
  String get schemesOff => 'ఆఫ్';

  @override
  String get schemesEmpty => 'ఇంకా స్కీమ్‌లు లేవు.';

  @override
  String get schemesRules =>
      'ప్రతి వరుసకు గరిష్టంగా ఒక స్కీమ్; కస్టమర్‌కు ఎక్కువ ఆదా ఇచ్చే కలయిక బిల్‌కు వర్తిస్తుంది. సొంత తగ్గింపు ఉన్న వరుసకు స్కీమ్ ఉండదు.';

  @override
  String get schemesEverything => 'అన్నీ';

  @override
  String get schemesAlways => 'ఎల్లప్పుడూ';

  @override
  String get schemesNow => 'ఇప్పటి నుండి';

  @override
  String get schemesNoEnd => 'ముగింపు తేదీ లేదు';

  @override
  String schemesRange(String from, String to) {
    return '$from నుండి $to';
  }

  @override
  String get schemesKind => 'రకం';

  @override
  String get schemesStartsOn => 'నుండి';

  @override
  String get schemesEndsOn => 'వరకు';

  @override
  String get schemesPct => 'తగ్గింపు (%)';

  @override
  String get schemesOffPct => 'అదనపు ముక్కలపై తగ్గింపు (%)';

  @override
  String get schemesOffPctHint => '100 అంటే ఉచితం';

  @override
  String get schemesAmount => 'తగ్గింపు మొత్తం (₹)';

  @override
  String get schemesMinValue => 'ఈ వస్తువులపై కనీసం (₹)';

  @override
  String get schemesBuy => 'కొనండి';

  @override
  String get schemesGet => 'పొందండి';

  @override
  String get schemesSlabs => 'స్లాబ్‌లు';

  @override
  String get schemesQtySlabsHint => 'ముక్కలు : శాతం, ఉదా. 3:10, 5:20';

  @override
  String get schemesValueSlabsHint => 'రూపాయలు : శాతం, ఉదా. 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'కాంబో ధర (₹)';

  @override
  String get schemesComboItems => 'కాంబోలోని వస్తువులు';

  @override
  String get schemesItem => 'వస్తువు';

  @override
  String get schemesQty => 'పరిమాణం';

  @override
  String get schemesAddItem => 'వస్తువు జోడించండి';

  @override
  String get schemesAddStyle => 'స్టైల్ జోడించండి';

  @override
  String get schemesScopeHint =>
      'అన్ని వస్తువులకు ఇవి ఖాళీగా వదలండి; లేకుంటే వీటిలో ఏదైనా ఒకదానికి సరిపోయే వస్తువు లెక్కలోకి వస్తుంది.';

  @override
  String get schemesBrands => 'బ్రాండ్‌లు';

  @override
  String get schemesCategories => 'వర్గాలు';

  @override
  String get schemesStyles => 'స్టైల్‌లు';

  @override
  String get schemesItems => 'వస్తువులు';

  @override
  String get schemesCommaHint => 'కామాలతో వేరు చేయండి';

  @override
  String get schemesActive => 'ఆన్';

  @override
  String get schemesKindsPercent => 'శాతం తగ్గింపు';

  @override
  String get schemesKindsAmountOff => 'మొత్తం తగ్గింపు';

  @override
  String get schemesKindsQtySlab => 'పరిమాణ స్లాబ్‌లు';

  @override
  String get schemesKindsValueSlab => 'విలువ స్లాబ్‌లు';

  @override
  String get schemesKindsBuyGet => 'X కొంటే Y';

  @override
  String get schemesKindsCombo => 'కాంబో లేదా హ్యాంపర్';

  @override
  String get schemesKindHintPercent => 'ప్రతి వస్తువుపై అదే శాతం';

  @override
  String get schemesKindHintAmountOff =>
      'నిర్ణీత మొత్తం, విలువ ప్రకారం పంచబడుతుంది';

  @override
  String get schemesKindHintQtySlab => 'ఎక్కువ ముక్కలు, ఎక్కువ శాతం';

  @override
  String get schemesKindHintValueSlab => 'పెద్ద బిల్, ఎక్కువ శాతం';

  @override
  String get schemesKindHintBuyGet =>
      'ప్రతి గుంపులో చౌకైనవి ఉచితం లేదా తగ్గింపుతో';

  @override
  String get schemesKindHintCombo => 'ఒకే ధరకు వస్తువుల సెట్';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% తగ్గింపు';
  }

  @override
  String schemesSumMin(String amount) {
    return '$amount లేదా ఎక్కువపై';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount తగ్గింపు';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ ముక్కలు $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return '$buy కొంటే $get ఉచితం';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return '$buy కొంటే $getపై $pct% తగ్గింపు';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$n వస్తువులు $priceకి';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'ఈ రకం స్కీమ్‌కు అవసరమైనవి నింపండి.';

  @override
  String get schemesErrorsSchemeNameTaken => 'ఈ పేరుతో స్కీమ్ ఇప్పటికే ఉంది.';

  @override
  String get schemesErrorsEndsBeforeStart =>
      'ముగింపు తేదీ ప్రారంభ తేదీకి ముందుంది.';

  @override
  String get schemesErrorsDuplicateSlab =>
      'రెండు స్లాబ్‌లు ఒకే చోట మొదలవుతాయి.';

  @override
  String get schemesErrorsUnknownItem =>
      'మీ జాబితా నుండి వస్తువులను ఎంచుకోండి.';

  @override
  String get schemesErrorsUnknownStyle =>
      'మీ జాబితా నుండి స్టైల్‌లను ఎంచుకోండి.';

  @override
  String get schemesErrorsSlabs => 'స్లాబ్‌లను ఇలా రాయండి: 3:10, 5:20.';

  @override
  String get schemesErrorsNumber => 'మొత్తాలు, శాతాలు సంఖ్యలుగా ఉండాలి.';

  @override
  String get interestTitle => 'బకాయిపై వడ్డీ';

  @override
  String get interestSubtitle =>
      'ప్రతి బిల్లుపై గడువు తేదీ తర్వాతి రోజులకు సాధారణ వడ్డీ, కస్టమర్ రేటు వద్ద.';

  @override
  String get interestPartyRates => 'వడ్డీ రేటు నిర్ణయించిన కస్టమర్లు.';

  @override
  String interestUsingRate(String rate) {
    return 'స్వంత రేటు లేని కస్టమర్లను $rate% వద్ద లెక్కిస్తాం.';
  }

  @override
  String get interestPartyRatesOnly => 'రేటు ఉన్న కస్టమర్లు మాత్రమే';

  @override
  String interestTryRate(String rate) {
    return 'అందరినీ $rate% వద్ద లెక్కించండి';
  }

  @override
  String get interestRate => 'రేటు';

  @override
  String get interestOverdue => 'బకాయి';

  @override
  String get interestInterest => 'వడ్డీ';

  @override
  String interestDueOn(String date) {
    return 'గడువు $date';
  }

  @override
  String get interestNone => 'వడ్డీ వేయడానికి బకాయి బిల్లులు లేవు.';

  @override
  String get interestGstNote =>
      'ఆలస్య చెల్లింపుపై వడ్డీ సరఫరా విలువలో భాగం (CGST చట్టం సెక్షన్ 15(2)(d)); సరుకు రేటు వద్ద GSTతో బిల్ చేయండి.';

  @override
  String get integrityTitle => 'సమగ్రత తనిఖీ';

  @override
  String get integritySubtitle =>
      'మీ లెక్కలు ఒకదానికొకటి సరిపోతున్నాయా? ప్రతి తనిఖీ సరిపోవాల్సిన రెండింటిని పోల్చి, తేడాను దాని రికార్డులతో చూపుతుంది.';

  @override
  String get integrityAllGood =>
      'అన్ని తనిఖీలు పాస్ అయ్యాయి. మీ లెక్కలు ఒకదానికొకటి సరిపోతున్నాయి.';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n తనిఖీలకు శ్రద్ధ అవసరం',
      one: '$n తనిఖీకి శ్రద్ధ అవసరం',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'పాస్';

  @override
  String get integrityFail => 'తేడా';

  @override
  String get integrityWarn => 'దీన్ని చూడండి';

  @override
  String get integrityRecords => 'రికార్డులు';

  @override
  String get integrityFirstTwenty => 'మొదటి 20 చూపబడ్డాయి.';

  @override
  String get integrityVouchersBalanceTitle => 'ప్రతి వోచర్ సమతుల్యంగా ఉంది';

  @override
  String get integrityVouchersBalanceHelp =>
      'ప్రతి వోచర్‌లో డెబిట్, క్రెడిట్ సమానం. కానివి ఇక్కడ కనిపిస్తాయి.';

  @override
  String get integrityTrialBalanceTitle => 'ట్రయల్ బ్యాలెన్స్ సరిపోతుంది';

  @override
  String get integrityTrialBalanceHelp =>
      'ప్రారంభ నిల్వ, ప్రతి ఎంట్రీ కలిపి సున్నా కావాలి. యజమాని మూలధనం వంటి రెండో వైపు లేకుండా ప్రారంభ నిల్వ నమోదు చేస్తే సాధారణంగా తేడా వస్తుంది.';

  @override
  String get integrityInvoicesMatchLedgerTitle =>
      'అమ్మకపు బిల్లులు ఖాతాతో సరిపోతాయి';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'ప్రతి పోస్ట్ అయిన బిల్లు తన మొత్తాన్ని కస్టమర్ ఖాతాలో వేసింది.';

  @override
  String get integrityBillsMatchLedgerTitle =>
      'కొనుగోలు బిల్లులు ఖాతాతో సరిపోతాయి';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'రివర్స్ ఛార్జ్ మినహా ప్రతి పోస్ట్ అయిన బిల్లు మొత్తాన్ని సరఫరాదారు ఖాతాలో వేసింది.';

  @override
  String get integrityDocumentsPostedTitle =>
      'పోస్ట్ అయిన పత్రాలకు ఖాతా ఎంట్రీలు ఉన్నాయి';

  @override
  String get integrityDocumentsPostedHelp =>
      'వెనుక వోచర్ లేని పోస్ట్ అయిన బిల్లు ఇక్కడ కనిపిస్తుంది.';

  @override
  String get integrityCancelledReversedTitle =>
      'రద్దు చేసిన వోచర్ల నికరం సున్నా';

  @override
  String get integrityCancelledReversedHelp =>
      'వోచర్ రద్దు చేస్తే అది తాకిన ప్రతి ఖాతాకు వ్యతిరేక ఎంట్రీ ఉండాలి.';

  @override
  String get integrityReceivablesMatchTitle =>
      'కస్టమర్ల నుండి రావలసినది ఖాతాతో సరిపోతుంది';

  @override
  String get integrityReceivablesMatchHelp =>
      'పెండింగ్ జాబితా మొత్తం కస్టమర్ల ఖాతా నిల్వలకు సమానం.';

  @override
  String get integrityPayablesMatchTitle =>
      'సరఫరాదారులకు చెల్లించవలసినది ఖాతాతో సరిపోతుంది';

  @override
  String get integrityPayablesMatchHelp =>
      'పెండింగ్ జాబితా మొత్తం సరఫరాదారుల ఖాతా నిల్వలకు సమానం.';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'గిఫ్ట్ వోచర్ బాధ్యత ఖర్చు కాని వోచర్లతో సరిపోతుంది';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'గిఫ్ట్ వోచర్ల ఖాతా యాక్టివ్ వోచర్లపై మిగిలిన నిల్వకు సమానం.';

  @override
  String get integrityNegativeStockTitle => 'ఏ నిల్వ సున్నా కంటే తక్కువ లేదు';

  @override
  String get integrityNegativeStockHelp =>
      'పుస్తకాల్లో చూపిన నిల్వ కంటే ఎక్కువ అమ్మిన లేదా ఇచ్చిన వస్తువులు. ఇది నిజమైన సమయ అంతరం కావచ్చు; మిగిలిపోయిన రసీదును నమోదు చేయండి.';

  @override
  String get sensitiveTitle => 'సున్నితమైన మార్పులు';

  @override
  String get sensitiveSubtitle =>
      'డబ్బును కదిలించగల లేదా తలుపు తెరవగల మార్పులు: బ్యాంకు వివరాలు, క్రెడిట్ నిబంధనలు, పన్ను సెట్టింగ్‌లు, ఎవరికి ఏ హక్కు, కాల లాక్‌లు, జీతం సెట్టింగ్‌లు. కొత్తవి ముందు.';

  @override
  String get sensitiveKindBank => 'బ్యాంకు వివరాలు';

  @override
  String get sensitiveKindCredit => 'క్రెడిట్ నిబంధనలు';

  @override
  String get sensitiveKindTax => 'పన్ను మరియు కంపెనీ సెట్టింగ్‌లు';

  @override
  String get sensitiveKindPermissions => 'ఎవరికి ఏ హక్కు';

  @override
  String get sensitiveKindPeriod => 'కాల లాక్‌లు మరియు నంబరింగ్';

  @override
  String get sensitiveKindPayroll => 'జీతం సెట్టింగ్‌లు';

  @override
  String get sensitiveKindOverride => 'క్రెడిట్ పరిమితి దాటడం';

  @override
  String get sensitiveKindDevice => 'పరికరాలు';

  @override
  String get sensitiveAll => 'అన్ని రకాలు';

  @override
  String get sensitiveNone => 'ఈ కాలంలో సున్నితమైన మార్పులు లేవు.';

  @override
  String get sensitiveShow => 'చూపు';

  @override
  String get cfoTitle => 'యజమాని వీక్షణ';

  @override
  String get cfoSubtitle =>
      'అమ్మకాల నుండి లాభం వరకు, ఈ కాలం, గత ఏడాది అదే కాలంతో పోల్చి. మీ లెక్కల్లో ఆదాయపు పన్ను నమోదు కాకపోతే పన్నుకు ముందు, తర్వాత లాభం ఒకటే.';

  @override
  String get cfoThisPeriod => 'ఈ కాలం';

  @override
  String get cfoLastYear => 'గత ఏడాది అదే కాలం';

  @override
  String get cfoGrowth => 'వృద్ధి';

  @override
  String get cfoRevenue => 'ఆదాయం';

  @override
  String get cfoCostOfGoods => 'అమ్మిన వస్తువుల ఖరీదు';

  @override
  String get cfoGrossProfit => 'స్థూల లాభం';

  @override
  String get cfoGrossMargin => 'స్థూల మార్జిన్';

  @override
  String get cfoOperatingExpenses => 'నిర్వహణ ఖర్చులు';

  @override
  String get cfoOtherIncome => 'ఇతర ఆదాయం';

  @override
  String get cfoDepreciation => 'తరుగుదల';

  @override
  String get cfoEbitda => 'EBITDA (తరుగుదలకు ముందు లాభం)';

  @override
  String get cfoNetProfit => 'నికర లాభం';

  @override
  String get cfoMonthly => 'నెలవారీ స్థూల మార్జిన్';

  @override
  String get lrTitle => 'ఎల్‌ఆర్ మరియు రవాణా ఎంట్రీ';

  @override
  String get lrSubtitle =>
      'ట్రాన్స్‌పోర్టర్ ద్వారా పంపిన సరుకు: ఎల్‌ఆర్ నంబర్, బిల్లు, సరుకు రవాణా ఛార్జీ, కస్టమర్‌కు చేరిందా లేదా.';

  @override
  String get lrTransporter => 'ట్రాన్స్‌పోర్టర్';

  @override
  String get lrLrNumber => 'ఎల్‌ఆర్ నంబర్';

  @override
  String get lrInvoice => 'బిల్లు';

  @override
  String get lrNoInvoice => 'బిల్లు లేదు';

  @override
  String get lrDestination => 'గమ్యం';

  @override
  String get lrPackages => 'ప్యాకేజీలు';

  @override
  String get lrWeight => 'బరువు (కిలో)';

  @override
  String get lrFreight => 'సరుకు రవాణా ఛార్జీ';

  @override
  String get lrFreightBy => 'సరుకు రవాణా ఛార్జీ ఎవరు చెల్లిస్తారు';

  @override
  String get lrPaid => 'మేము చెల్లించాం';

  @override
  String get lrToPay => 'కస్టమర్ చెల్లిస్తారు';

  @override
  String get lrAdd => 'పంపిన సరుకును జోడించు';

  @override
  String get lrStatus => 'స్థితి';

  @override
  String get lrAllStatuses => 'అన్ని స్థితులు';

  @override
  String get lrStatusesBooked => 'బుక్ చేశారు';

  @override
  String get lrStatusesInTransit => 'మార్గంలో';

  @override
  String get lrStatusesDelivered => 'చేరింది';

  @override
  String lrDeliveredOn(String date) {
    return '$date న చేరింది';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'పంపి $n రోజులు',
      one: 'పంపి $n రోజు',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty => 'ఇంకా సరుకు పంపలేదు. పైన మొదటిదాన్ని జోడించండి.';

  @override
  String get lrErrorsLrTaken =>
      'ఈ ట్రాన్స్‌పోర్టర్‌కు ఈ ఎల్‌ఆర్ నంబర్ ఇప్పటికే ఉంది.';

  @override
  String get lrErrorsUnknownInvoice => 'ఆ బిల్లు కనుగొనబడలేదు.';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'చేరిన తేదీ పంపిన తేదీ కంటే ముందుంది.';

  @override
  String get hsnTitle => 'హెచ్‌ఎస్‌ఎన్ మరియు ఎస్‌ఏసీ కోడ్‌లు';

  @override
  String get hsnSubtitle =>
      'మీ వ్యాపారం వాడే కోడ్‌లు, సరళమైన వివరణలతో. వస్తువు మరియు స్టైల్ ఫారమ్‌లు ఈ జాబితా నుండి సూచిస్తాయి. ఇక్కడి రేటు సౌలభ్యం కోసమే: దుస్తులు, పాదరక్షలపై ధర స్లాబ్ ప్రకారం పన్ను.';

  @override
  String get hsnCode => 'కోడ్';

  @override
  String get hsnDescription => 'వివరణ';

  @override
  String get hsnKind => 'రకం';

  @override
  String get hsnGoods => 'వస్తువులు (హెచ్‌ఎస్‌ఎన్)';

  @override
  String get hsnService => 'సేవ (ఎస్‌ఏసీ)';

  @override
  String get hsnRate => 'రేటు';

  @override
  String get hsnAddStandard => 'ప్రామాణిక దుస్తుల కోడ్‌లను జోడించు';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n కోడ్‌లు జోడించబడ్డాయి. ఇప్పటికే ఉన్నవి మార్చబడలేదు.',
      one: '$n కోడ్ జోడించబడింది. ఇప్పటికే ఉన్నవి మార్చబడలేదు.',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'ఆర్కైవ్ చేసినవి చూపు';

  @override
  String get hsnEmpty =>
      'ఇంకా కోడ్‌లు లేవు. పైన జోడించండి, లేదా ప్రామాణిక దుస్తుల కోడ్‌లను జోడించండి.';

  @override
  String get hsnErrorsHsnTaken => 'ఈ కోడ్ ఇప్పటికే జాబితాలో ఉంది.';

  @override
  String get hsnErrorsInvalidHsn =>
      'హెచ్‌ఎస్‌ఎన్ కోడ్‌లో 4, 6 లేదా 8 అంకెలు ఉంటాయి (ఎస్‌ఏసీలో 6).';

  @override
  String get notesTitle => 'నా గమనికలు';

  @override
  String get notesPrivate => 'వీటిని మీరు మాత్రమే చూడగలరు.';

  @override
  String get notesNone => 'ఏమీ నమోదు కాలేదు. కింద గుర్తుచేసేదాన్ని రాయండి.';

  @override
  String get notesPlaceholder => 'గమనిక లేదా గుర్తుచేత రాయండి';

  @override
  String get notesRemindOn => 'ఈ రోజున గుర్తు చేయండి';

  @override
  String get notesAdd => 'జోడించు';

  @override
  String get notesToday => 'ఈరోజు';

  @override
  String notesOverdue(String date) {
    return '$date న ఉండేది';
  }

  @override
  String notesMarkDone(String note) {
    return 'పూర్తయింది: $note';
  }

  @override
  String get notesRemove => 'గమనికను తొలగించు';

  @override
  String get movementTitle => 'వేగంగా మరియు నెమ్మదిగా అమ్ముడయ్యేవి';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'గత $days రోజుల్లో అమ్మినవి. వేగం అంటే $fastMin లేదా అంతకంటే ఎక్కువ; నెమ్మది అంటే కొన్ని అమ్ముడయ్యాయి కానీ అంతకంటే తక్కువ; కదలనివి అంటే ఏమీ లేదు. కదలనివి ముందు.';
  }

  @override
  String get movementWindow => 'వెనక్కి చూడండి';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n రోజులు',
      one: '$n రోజు',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'వేగం పరిమితి (ముక్కలు)';

  @override
  String get movementIncludeFabric => 'బట్ట మరియు ట్రిమ్‌లను కూడా చేర్చు';

  @override
  String get movementClassFast => 'వేగం';

  @override
  String get movementClassSlow => 'నెమ్మది';

  @override
  String get movementClassNone => 'కదలనివి';

  @override
  String movementItems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n వస్తువులు',
      one: '$n వస్తువు',
    );
    return '$_temp0';
  }

  @override
  String movementPiecesInStock(String n) {
    return 'నిల్వలో $n ముక్కలు';
  }

  @override
  String get movementItem => 'వస్తువు';

  @override
  String get movementStatus => 'కదలిక';

  @override
  String movementSold(String days) {
    return '$days రోజుల్లో అమ్మినది';
  }

  @override
  String get movementInStock => 'నిల్వలో';

  @override
  String get movementStockValue => 'నిల్వ విలువ';

  @override
  String get movementLastSold => 'చివరి అమ్మకం';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n రోజుల క్రితం',
      one: '$n రోజు క్రితం',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'ఎప్పుడూ లేదు';

  @override
  String get movementEmpty => 'చూపడానికి నిల్వ లేదు.';

  @override
  String get movementFirstRows => 'మొదటి 500 వస్తువులు చూపబడ్డాయి.';

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
