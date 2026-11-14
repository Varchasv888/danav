// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Gujarati (`gu`).
class AppLocalizationsGu extends AppLocalizations {
  AppLocalizationsGu([String locale = 'gu']) : super(locale);

  @override
  String get brandName => 'Varchasv';

  @override
  String get brandFull => 'Varchasv ERP Systems';

  @override
  String get brandTagline =>
      'હિસાબ, જીએસટી, સ્ટોક અને પગાર, ઓનલાઇન અને ઓફલાઇન, તમારી ભાષામાં.';

  @override
  String get commonSave => 'સાચવો';

  @override
  String get commonSaving => 'સાચવી રહ્યા છીએ…';

  @override
  String get commonSaved => 'સચવાયું';

  @override
  String get commonCancel => 'રદ કરો';

  @override
  String get commonEdit => 'ફેરફાર કરો';

  @override
  String get commonAdd => 'ઉમેરો';

  @override
  String get commonClose => 'બંધ કરો';

  @override
  String get commonLoading => 'લોડ થઈ રહ્યું છે…';

  @override
  String get commonOptional => 'વૈકલ્પિક';

  @override
  String get commonLanguage => 'ભાષા';

  @override
  String get commonTheme => 'થીમ';

  @override
  String get commonLight => 'લાઇટ';

  @override
  String get commonDark => 'ડાર્ક';

  @override
  String get commonSystem => 'સિસ્ટમ';

  @override
  String commonComingSoon(String phase) {
    return 'તબક્કા $phaseમાં આવી રહ્યું છે';
  }

  @override
  String get commonNone => 'કોઈ નહીં';

  @override
  String get commonYes => 'હા';

  @override
  String get commonNo => 'ના';

  @override
  String get commonSearch => 'શોધો';

  @override
  String get commonAll => 'બધા';

  @override
  String get commonFrom => 'થી';

  @override
  String get commonTo => 'સુધી';

  @override
  String get commonAsOf => 'તારીખ મુજબ';

  @override
  String get commonTotal => 'કુલ';

  @override
  String get commonDebit => 'ઉધાર';

  @override
  String get commonCredit => 'જમા';

  @override
  String get commonBalance => 'બાકી';

  @override
  String get commonDate => 'તારીખ';

  @override
  String get commonNarration => 'વિગત';

  @override
  String get commonActions => 'ક્રિયાઓ';

  @override
  String get commonBack => 'પાછા';

  @override
  String get commonApply => 'બતાવો';

  @override
  String get commonRemove => 'દૂર કરો';

  @override
  String get commonCopy => 'નકલ કરો';

  @override
  String get commonCopied => 'નકલ થઈ';

  @override
  String get commonDr => 'ઉ';

  @override
  String get commonCr => 'જ';

  @override
  String get commonView => 'જુઓ';

  @override
  String get commonArchived => 'આર્કાઇવ';

  @override
  String get commonPrint => 'છાપો';

  @override
  String commonListCapped(String count) {
    return 'તાજેતરના $count દસ્તાવેજો બતાવ્યા છે. જૂના જોવા માટે તારીખો પસંદ કરો.';
  }

  @override
  String get authLoginTitle => 'તમારા વ્યવસાયમાં સાઇન ઇન કરો';

  @override
  String get authLoginSubtitle => 'ફરી સ્વાગત છે.';

  @override
  String get authSignupTitle => 'Varchasv પર તમારો વ્યવસાય શરૂ કરો';

  @override
  String get authSignupSubtitle =>
      '₹40 લાખથી ઓછા ટર્નઓવરવાળા વ્યવસાયો માટે મફત. કાર્ડની જરૂર નથી.';

  @override
  String get authEmail => 'ઇમેઇલ';

  @override
  String get authPassword => 'પાસવર્ડ';

  @override
  String get authPasswordHint => 'ઓછામાં ઓછા 8 અક્ષર';

  @override
  String get authName => 'તમારું નામ';

  @override
  String get authBusinessName => 'વ્યવસાયનું નામ';

  @override
  String get authState => 'રાજ્ય';

  @override
  String get authGstin => 'જીએસટીઆઈએન';

  @override
  String get authGstinHint => 'જીએસટી નોંધણી ન હોય તો ખાલી રાખો';

  @override
  String get authIndustry => 'વ્યવસાયનો પ્રકાર';

  @override
  String get authLogin => 'સાઇન ઇન';

  @override
  String get authSignup => 'ખાતું બનાવો';

  @override
  String get authLogout => 'સાઇન આઉટ';

  @override
  String get authNoAccount => 'Varchasv પર નવા છો?';

  @override
  String get authHaveAccount => 'પહેલેથી ખાતું છે?';

  @override
  String get authCreateOne => 'ખાતું બનાવો';

  @override
  String get authSignInInstead => 'સાઇન ઇન';

  @override
  String get authErrorsInvalidCredentials =>
      'આ ઇમેઇલ અને પાસવર્ડ મેળ ખાતા નથી.';

  @override
  String get authErrorsEmailTaken => 'આ ઇમેઇલનું ખાતું પહેલેથી છે.';

  @override
  String get authErrorsGstinLength => 'જીએસટીઆઈએનમાં 15 અક્ષર હોય છે.';

  @override
  String get authErrorsGstinFormat => 'આ જીએસટીઆઈએન જેવું લાગતું નથી.';

  @override
  String get authErrorsGstinState =>
      'જીએસટીઆઈએન અજાણ્યા રાજ્ય કોડથી શરૂ થાય છે.';

  @override
  String get authErrorsGstinChecksum =>
      'આ જીએસટીઆઈએનમાં ટાઇપની ભૂલ છે: છેલ્લો અક્ષર મેળ ખાતો નથી.';

  @override
  String get authErrorsGstinStateMismatch =>
      'આ જીએસટીઆઈએન પસંદ કરેલા રાજ્યથી અલગ રાજ્યનું છે.';

  @override
  String get authErrorsValidation => 'કૃપા કરીને દર્શાવેલ ખાનાં તપાસો.';

  @override
  String get authErrorsGeneric => 'કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'આ લિંક સમાપ્ત થઈ ગઈ છે અથવા પહેલેથી વપરાઈ ગઈ છે. નવી લિંક મંગાવો.';

  @override
  String get authErrorsWrongPassword => 'તમારો હાલનો પાસવર્ડ ખોટો છે.';

  @override
  String get authErrorsPasswordsDiffer => 'બંને પાસવર્ડ મેળ ખાતા નથી.';

  @override
  String get authErrorsNeedsChangeDate =>
      'તમને દસ્તાવેજમાં પાછલી તારીખ નાખવાનો અધિકાર નથી. આજની તારીખ વાપરો, અથવા માલિક પાસે અધિકાર માંગો.';

  @override
  String get authErrorsNeedsFutureDate =>
      'તમને દસ્તાવેજમાં આગળની તારીખ નાખવાનો અધિકાર નથી. આજની તારીખ વાપરો, અથવા માલિક પાસે અધિકાર માંગો.';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'એક લાઇનનો ભાવ ખરીદ કિંમત કરતાં ઓછો છે. તમને ખરીદ કિંમતથી ઓછા ભાવે વેચવાનો અધિકાર નથી; ભાવ વધારો અથવા માલિકને પૂછો.';

  @override
  String get authForgotLink => 'પાસવર્ડ ભૂલી ગયા?';

  @override
  String get authForgotTitle => 'તમારો પાસવર્ડ રીસેટ કરો';

  @override
  String get authForgotSubtitle =>
      'તમારા ખાતાનો ઈમેલ લખો, નવો પાસવર્ડ પસંદ કરવા અમે લિંક મોકલીશું.';

  @override
  String get authSendLink => 'રીસેટ લિંક મોકલો';

  @override
  String authForgotSent(String email) {
    return 'જો $email માટે ખાતું હોય, તો રીસેટ લિંક મોકલાઈ રહી છે. તે એક જ વાર ચાલે છે અને એક કલાકમાં સમાપ્ત થાય છે.';
  }

  @override
  String get authBackToLogin => 'સાઇન ઇન પર પાછા';

  @override
  String get authResetTitle => 'નવો પાસવર્ડ પસંદ કરો';

  @override
  String get authNewPassword => 'નવો પાસવર્ડ';

  @override
  String get authConfirmPassword => 'નવો પાસવર્ડ ફરી લખો';

  @override
  String get authSetPassword => 'પાસવર્ડ સેટ કરો';

  @override
  String get authResetDone =>
      'તમારો પાસવર્ડ બદલાઈ ગયો છે અને તમે બધે જ સાઇન આઉટ થઈ ગયા છો. નવા પાસવર્ડથી સાઇન ઇન કરો.';

  @override
  String get shellGoTo => 'અહીં જાઓ…';

  @override
  String get shellGoToPlaceholder => 'સ્ક્રીન ખોલો અથવા નવી એન્ટ્રી શરૂ કરો';

  @override
  String shellNoMatch(String query) {
    return '“$query” સાથે કંઈ મેળ ખાતું નથી.';
  }

  @override
  String get shellTallyKeys =>
      'ટેલીની કી ટેક્સ્ટ ફીલ્ડની બહાર ગમે ત્યાં ચાલે છે: F4 કોન્ટ્રા, F5 ચુકવણી, F6 આવક, F7 જર્નલ, F8 વેચાણ, F9 ખરીદી.';

  @override
  String get shellCreate => 'નવું';

  @override
  String get shellEntries => 'નવી એન્ટ્રી';

  @override
  String get shellScreens => 'સ્ક્રીન';

  @override
  String get shellMenu => 'મેનુ';

  @override
  String shellFy(String years) {
    return 'નાણાકીય વર્ષ $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type વાઉચર';
  }

  @override
  String get shellFold => 'મેનૂ નાનું કરો';

  @override
  String get shellUnfold => 'મેનૂ ખોલો';

  @override
  String get accountTitle => 'મારું ખાતું';

  @override
  String get accountSubtitle =>
      'તમારું નામ અને પાસવર્ડ, તમારા દરેક વ્યવસાય માટે વપરાય છે.';

  @override
  String get accountProfile => 'પ્રોફાઇલ';

  @override
  String get accountSave => 'સાચવો';

  @override
  String get accountSaved => 'સાચવ્યું';

  @override
  String get accountPasswordTitle => 'પાસવર્ડ બદલો';

  @override
  String get accountCurrentPassword => 'હાલનો પાસવર્ડ';

  @override
  String get accountPasswordChanged =>
      'પાસવર્ડ બદલાયો. તમારા બીજા ઉપકરણો સાઇન આઉટ કરવામાં આવ્યા છે.';

  @override
  String get industryApparel => 'વસ્ત્ર અને કાપડ';

  @override
  String get industryGeneral => 'સામાન્ય';

  @override
  String get industryTrading => 'વેપાર / વિતરણ';

  @override
  String get industryManufacturing => 'ઉત્પાદન';

  @override
  String get industryRetail => 'છૂટક દુકાન';

  @override
  String get industryServices => 'સેવાઓ';

  @override
  String get navDashboard => 'ડેશબોર્ડ';

  @override
  String get navSales => 'વેચાણ';

  @override
  String get navPurchase => 'ખરીદી';

  @override
  String get navInventory => 'માલ';

  @override
  String get navAccounts => 'હિસાબ';

  @override
  String get navGst => 'જીએસટી';

  @override
  String get navHr => 'એચઆર અને પગાર';

  @override
  String get navReports => 'રિપોર્ટ';

  @override
  String get navSettings => 'સેટિંગ્સ';

  @override
  String get navCompany => 'કંપની અને શાખાઓ';

  @override
  String get navNumberSeries => 'નંબર શ્રેણી';

  @override
  String get navAuditLog => 'ઓડિટ ટ્રેલ';

  @override
  String get navTools => 'સાધનો';

  @override
  String get navTeam => 'ટીમ અને ભૂમિકાઓ';

  @override
  String get navChart => 'ખાતાંની યાદી';

  @override
  String get navVouchers => 'વાઉચર અને કૂપન';

  @override
  String get navTrialBalance => 'કાચું સરવૈયું';

  @override
  String get navProfitLoss => 'નફા-નુકસાન';

  @override
  String get navBalanceSheet => 'પાકું સરવૈયું';

  @override
  String get navFinancialYears => 'નાણાકીય વર્ષો';

  @override
  String get navItems => 'વસ્તુઓ';

  @override
  String get navStock => 'સ્ટોક સારાંશ';

  @override
  String get navStockJournals => 'સ્ટોક જર્નલ';

  @override
  String get navReorder => 'ફરી ઓર્ડર';

  @override
  String get navPurchaseOrders => 'ખરીદી ઓર્ડર';

  @override
  String get navGoodsReceipts => 'ઇનવર્ડ ચલણ';

  @override
  String get navPurchaseBills => 'ખરીદી બિલ';

  @override
  String get navPurchaseReturns => 'ખરીદી પરત';

  @override
  String get navSalesOrders => 'વેચાણ ઓર્ડર';

  @override
  String get navDeliveryNotes => 'ડિલિવરી ચલણ';

  @override
  String get navSalesInvoices => 'વેચાણ બિલ';

  @override
  String get navCreditNotes => 'ક્રેડિટ નોટ';

  @override
  String get navReceivables => 'લેણાં';

  @override
  String get navPayables => 'દેવાં';

  @override
  String get navGstReturns => 'જીએસટી રિટર્ન';

  @override
  String get navGstSettings => 'જીએસટી અને બિલિંગ';

  @override
  String get navImport => 'ડેટા આયાત';

  @override
  String get navQuotations => 'ક્વોટેશન';

  @override
  String get navEmployees => 'કર્મચારીઓ';

  @override
  String get navAttendance => 'હાજરી';

  @override
  String get navLeave => 'રજા';

  @override
  String get navPayroll => 'પગારપત્રક';

  @override
  String get navPayrollSettings => 'પગારપત્રક';

  @override
  String get navStatutory => 'વૈધાનિક અને ટીડીએસ';

  @override
  String get navManufacturing => 'ઉત્પાદન';

  @override
  String get navBoms => 'સામગ્રી યાદી (BOM)';

  @override
  String get navProduction => 'ઉત્પાદન ઓર્ડર';

  @override
  String get navMrp => 'માલ આયોજન';

  @override
  String get navJobWork => 'જોબ વર્ક';

  @override
  String get navPos => 'પોઇન્ટ ઓફ સેલ';

  @override
  String get navPosBilling => 'બિલિંગ';

  @override
  String get navPosBills => 'બિલ';

  @override
  String get navPosSettings => 'કાઉન્ટર સેટિંગ';

  @override
  String get navBanking => 'બેંકિંગ';

  @override
  String get navBankAccounts => 'બેંક મેળવણી';

  @override
  String get navBankRules => 'બેંક નિયમો';

  @override
  String get navSettlements => 'ગેટવે સેટલમેન્ટ';

  @override
  String get navAssets => 'સ્થાયી મિલકત';

  @override
  String get navAssetRegister => 'મિલકત રજિસ્ટર';

  @override
  String get navDepreciation => 'ઘસારો';

  @override
  String get navItDepreciation => 'આવકવેરા ઘસારો';

  @override
  String get navExpenses => 'ખર્ચ';

  @override
  String get navExpenseClaims => 'ખર્ચ દાવા';

  @override
  String get navExpenseCategories => 'ખર્ચ પ્રકાર';

  @override
  String get navProjects => 'પ્રોજેક્ટ';

  @override
  String get navProjectList => 'પ્રોજેક્ટ';

  @override
  String get navTimesheets => 'ટાઇમશીટ';

  @override
  String get navAssistant => 'સહાયક';

  @override
  String get navCrm => 'સીઆરએમ';

  @override
  String get navLeads => 'લીડ';

  @override
  String get navFollowUps => 'ફોલો-અપ';

  @override
  String get navMessageTemplates => 'સંદેશ નમૂના';

  @override
  String get navReportBuilder => 'રિપોર્ટ બિલ્ડર';

  @override
  String get navSavedReports => 'સાચવેલા રિપોર્ટ';

  @override
  String get navChecks => 'તપાસ';

  @override
  String get navStyles => 'સ્ટાઇલ';

  @override
  String get navProformas => 'પ્રોફોર્મા ઇન્વૉઇસ';

  @override
  String get navApprovals => 'મંજૂરી પરનો માલ';

  @override
  String get navPriceLists => 'ભાવ યાદી';

  @override
  String get navInterest => 'બાકી પર વ્યાજ';

  @override
  String get navAgents => 'એજન્ટ કમિશન';

  @override
  String get navTargets => 'સેલ્સમેન લક્ષ્ય';

  @override
  String get navSchemes => 'સ્કીમ અને ઑફર';

  @override
  String get navPosReturns => 'વળતર અને બદલી';

  @override
  String get navAlterations => 'ઑલ્ટરેશન';

  @override
  String get navTailoring => 'સિલાઈ';

  @override
  String get navConsignment => 'કન્સાઇનમેન્ટ';

  @override
  String get navCatalogue => 'ઇમેજ કૅટલૉગ';

  @override
  String get navInsights => 'બિઝનેસ ઇન્સાઇટ્સ';

  @override
  String get navSalesRegister => 'વેચાણ રજિસ્ટર';

  @override
  String get navColourSize => 'રંગ-સાઇઝ રિપોર્ટ';

  @override
  String get navStockAgeing => 'સ્ટૉકનું આયુ';

  @override
  String get navLabels => 'બારકોડ લેબલ';

  @override
  String get navMessageLog => 'વૉટ્સએપ લૉગ';

  @override
  String get navMyMenu => 'મારું મેનૂ';

  @override
  String get navAllActions => 'બધાં કામ';

  @override
  String get navStockCounts => 'સ્ટૉક ગણતરી';

  @override
  String get navWorkspace => 'કાર્યક્ષેત્ર';

  @override
  String get navSalesPos => 'વેચાણ અને કાઉન્ટર';

  @override
  String get navPromotions => 'ઑફર અને ભાવ';

  @override
  String get navFinance => 'હિસાબ અને બૅન્કિંગ';

  @override
  String get navOperations => 'ખર્ચ, પ્રોજેક્ટ અને મિલકત';

  @override
  String get navMasters => 'માસ્ટર';

  @override
  String get navReportsHub => 'બધા રિપોર્ટ';

  @override
  String get navMastersHub => 'બધા માસ્ટર';

  @override
  String get navSizesColours => 'સાઇઝ અને રંગ';

  @override
  String get navBandWorkspace => 'કાર્યક્ષેત્ર';

  @override
  String get navBandCommerce => 'વેચાણ';

  @override
  String get navBandSupply => 'ખરીદી અને સ્ટૉક';

  @override
  String get navBandProduction => 'ઉત્પાદન અને કામકાજ';

  @override
  String get navBandMoney => 'પૈસા અને લોકો';

  @override
  String get navBandInsight => 'રિપોર્ટ';

  @override
  String get navBandAdmin => 'સેટઅપ';

  @override
  String get navIntegrity => 'અખંડિતતા તપાસ';

  @override
  String get navCfoView => 'માલિકનો દૃષ્ટિકોણ';

  @override
  String get navStockMovement => 'ઝડપી અને ધીમા વેચાતા માલ';

  @override
  String dashboardGreeting(String name) {
    return 'નમસ્તે, $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return 'આજે $business ક્યાં ઊભું છે તે જુઓ.';
  }

  @override
  String get dashboardSetupTitle => 'સેટઅપ પૂર્ણ કરો';

  @override
  String get dashboardSetupCompany => 'કંપનીની વિગતો અને પાન ઉમેરો';

  @override
  String get dashboardSetupBranch => 'દરેક શાખા માટે જીએસટીઆઈએન ઉમેરો';

  @override
  String get dashboardSetupSeries => 'તમારી બિલ નંબર શ્રેણી તપાસો';

  @override
  String get dashboardRoadmapTitle => 'શું આવી રહ્યું છે';

  @override
  String get dashboardCalcTitle => 'ઝડપી જીએસટી કેલ્ક્યુલેટર';

  @override
  String get dashboardCalcSubtitle =>
      'પુરવઠાના સ્થળ પરથી CGST/SGST અથવા IGST ગણે છે.';

  @override
  String get dashboardKSalesToday => 'આજનું વેચાણ';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'ગઈકાલે $amount';
  }

  @override
  String get dashboardKSalesMonth => 'આ મહિનાનું વેચાણ';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'ગયા મહિને આ જ દિવસો સુધી $amount';
  }

  @override
  String get dashboardKReceivables => 'લેણાં';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount મુદત વીતી';
  }

  @override
  String get dashboardKPayables => 'દેવાં';

  @override
  String dashboardKDueSoon(String amount) {
    return '7 દિવસમાં $amount ચૂકવવાના';
  }

  @override
  String get dashboardKProfit => 'આ મહિનાનો નફો';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'કુલ નફો $amount';
  }

  @override
  String get dashboardKStockValue => 'સ્ટોકની કિંમત';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count વસ્તુઓ',
      one: '$count વસ્તુ',
    );
    return '$_temp0 ફરી ઓર્ડર સ્તરથી નીચે';
  }

  @override
  String get dashboardKPipeline => 'વેચાણ પાઇપલાઇન';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$count ખુલ્લી લીડ · ભારિત $amount';
  }

  @override
  String get dashboardKApprovals => 'તમારી રાહ જુએ છે';

  @override
  String get dashboardKClaims => 'ખર્ચ દાવા';

  @override
  String get dashboardKTimesheets => 'ટાઇમશીટ';

  @override
  String get dashboardKLeave => 'રજા અરજીઓ';

  @override
  String get dashboardKNothingWaiting => 'કંઈ બાકી નથી.';

  @override
  String get dashboardKSalesTrend => 'વેચાણ, છેલ્લા 30 દિવસ';

  @override
  String get dashboardKCashBank => 'રોકડ અને બેંક';

  @override
  String get dashboardKTopCustomers => 'આ મહિનાના મુખ્ય ગ્રાહકો';

  @override
  String get dashboardKTopItems => 'આ મહિને સૌથી વધુ વેચાયેલ';

  @override
  String get dashboardKTopDebtors => 'વસૂલવાની સૌથી મોટી રકમો';

  @override
  String get dashboardKAlerts => 'ધ્યાન આપવાની જરૂર';

  @override
  String get dashboardKNoAlerts => 'બધું બરાબર છે.';

  @override
  String get dashboardKAsk => 'સહાયકને પૂછો';

  @override
  String dashboardKYesterday(String amount) {
    return 'ગઈકાલે $amount';
  }

  @override
  String get dashboardPosition => 'નાણાંની સ્થિતિ';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ખાતાં',
      one: '$count ખાતું',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'બિઝનેસ ઇન્સાઇટ્સ';

  @override
  String get insightsSubtitle =>
      'કોઈ પણ સમયગાળાનું વેચાણ, નફો, સ્ટૉક અને નાણાં, ગયા વર્ષના એ જ સમયગાળા સાથે.';

  @override
  String get insightsNoLastYear => 'આ વર્ષે નવું';

  @override
  String get insightsPts => 'અંક';

  @override
  String get insightsVsLastYear => 'ગયા વર્ષ કરતાં';

  @override
  String get insightsNoSales => 'આ સમયગાળામાં વેચાણ નથી.';

  @override
  String get insightsHideTable => 'કોષ્ટક છુપાવો';

  @override
  String get insightsShowTable => 'કોષ્ટકમાં જુઓ';

  @override
  String get insightsPresetsThisMonth => 'આ મહિને';

  @override
  String get insightsPresetsLastMonth => 'ગયો મહિનો';

  @override
  String get insightsPresetsThisFy => 'આ નાણાકીય વર્ષ';

  @override
  String get insightsPresetsLastFy => 'ગયું નાણાકીય વર્ષ';

  @override
  String get insightsPresetsLast12 => 'છેલ્લા 12 મહિના';

  @override
  String get insightsFrom => 'થી';

  @override
  String get insightsTo => 'સુધી';

  @override
  String get insightsApply => 'બતાવો';

  @override
  String insightsCompared(String from, String to) {
    return 'ફેરફાર $from થી $to ની સરખામણીએ છે.';
  }

  @override
  String get insightsKpiSales => 'વેચાણ';

  @override
  String get insightsKpiPieces => 'વેચાયેલા નંગ';

  @override
  String get insightsKpiAvgBill => 'સરેરાશ બિલ';

  @override
  String get insightsKpiProfit => 'માર્જિન';

  @override
  String get insightsKpiPurchases => 'ખરીદી';

  @override
  String get insightsKpiStock => 'હાલનો સ્ટૉક';

  @override
  String get insightsKpiReceivable => 'લેવાના';

  @override
  String get insightsKpiPayable => 'ચૂકવવાના';

  @override
  String get insightsBeforeTax => 'GST પહેલાં, વળતર બાદ';

  @override
  String insightsBillsCount(String n) {
    return 'બિલ: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return '$v પ્રતિ નંગ';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n નંગ';
  }

  @override
  String get insightsOwedToUs => 'ગ્રાહકો પાસેથી';

  @override
  String get insightsWeOwe => 'સપ્લાયરોને';

  @override
  String get insightsTrend => 'વેચાણનો વલણ';

  @override
  String get insightsByMonth => 'મહિનાવાર, GST પહેલાં';

  @override
  String get insightsByDay => 'દિવસવાર, GST પહેલાં';

  @override
  String get insightsWeekday => 'વ્યસ્ત દિવસો';

  @override
  String get insightsWeekdaySub => 'અઠવાડિયાના દિવસ મુજબ વેચાણ';

  @override
  String get insightsDaysD1 => 'સોમ';

  @override
  String get insightsDaysD2 => 'મંગળ';

  @override
  String get insightsDaysD3 => 'બુધ';

  @override
  String get insightsDaysD4 => 'ગુરુ';

  @override
  String get insightsDaysD5 => 'શુક્ર';

  @override
  String get insightsDaysD6 => 'શનિ';

  @override
  String get insightsDaysD7 => 'રવિ';

  @override
  String get insightsDesigns => 'શ્રેષ્ઠ ડિઝાઇન';

  @override
  String get insightsByValue => 'વેચાણ મૂલ્ય મુજબ';

  @override
  String get insightsSalesmen => 'શ્રેષ્ઠ સેલ્સમેન';

  @override
  String get insightsSalesmenSub => 'તેમણે વેચેલી કાઉન્ટર લાઇન અને ઇન્વૉઇસ';

  @override
  String get insightsNoSalesmen => 'હજી કોઈ વેચાણ પર સેલ્સમેન નથી.';

  @override
  String get insightsCustomers => 'મોટા ગ્રાહકો';

  @override
  String get insightsCustomersSub => 'ઇન્વૉઇસવાળા ગ્રાહકો, વળતર બાદ';

  @override
  String get insightsBrands => 'બ્રાન્ડ';

  @override
  String get insightsTenders => 'ગ્રાહકોએ કેવી રીતે ચૂકવ્યું';

  @override
  String get insightsTendersSub => 'GST સાથે: કાઉન્ટર ચુકવણી અને ઉધાર ઇન્વૉઇસ';

  @override
  String get insightsModesCash => 'રોકડ';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'કાર્ડ';

  @override
  String get insightsModesCredit => 'કાઉન્ટર ઉધાર';

  @override
  String get insightsModesInvoice => 'ઇન્વૉઇસ';

  @override
  String get insightsAgeing => 'વેચાણનું આયુ';

  @override
  String get insightsAgeingSub => 'વેચાતા પહેલાં માલ કેટલો સમય રહ્યો';

  @override
  String get insightsAge => 'આયુ';

  @override
  String get insightsPieces => 'નંગ';

  @override
  String get insightsValue => 'મૂલ્ય';

  @override
  String get insightsAgesD030 => '0 થી 30 દિવસ';

  @override
  String get insightsAgesD3160 => '31 થી 60 દિવસ';

  @override
  String get insightsAgesD6190 => '61 થી 90 દિવસ';

  @override
  String get insightsAgesD91180 => '91 થી 180 દિવસ';

  @override
  String get insightsAgesD181365 => '6 થી 12 મહિના';

  @override
  String get insightsAgesY12 => '1 થી 2 વર્ષ';

  @override
  String get insightsAgesY2plus => '2 વર્ષથી વધુ';

  @override
  String get insightsErrorsInvalidPeriod => 'શરૂઆતની તારીખ અંત પછી છે.';

  @override
  String insightsOnCost(String v) {
    return 'પ્રમાણભૂત ખર્ચ કરતાં $v વધુ';
  }

  @override
  String get calcFrom => 'સપ્લાયરનું રાજ્ય';

  @override
  String get calcTo => 'પુરવઠાનું સ્થળ';

  @override
  String get calcQty => 'જથ્થો';

  @override
  String get calcRate => 'દર (₹)';

  @override
  String get calcGstRate => 'જીએસટી %';

  @override
  String get calcTaxable => 'કરપાત્ર કિંમત';

  @override
  String get calcCgst => 'CGST';

  @override
  String get calcSgst => 'SGST';

  @override
  String get calcUtgst => 'UTGST';

  @override
  String get calcIgst => 'IGST';

  @override
  String get calcRoundOff => 'રાઉન્ડ ઓફ';

  @override
  String get calcTotal => 'કુલ';

  @override
  String get calcInWords => 'શબ્દોમાં';

  @override
  String get calcCess => 'સેસ';

  @override
  String get companyTitle => 'કંપની અને શાખાઓ';

  @override
  String get companySubtitle =>
      'કાનૂની વિગતો અને દરેક જીએસટીઆઈએન અથવા સ્થળ માટે એક શાખા.';

  @override
  String get companyName => 'દર્શાવવાનું નામ';

  @override
  String get companyLegalName => 'કાનૂની નામ';

  @override
  String get companyPan => 'પાન';

  @override
  String get companyBooksBegin => 'હિસાબ શરૂ થવાની તારીખ';

  @override
  String get companyBranches => 'શાખાઓ';

  @override
  String get companyAddBranch => 'શાખા ઉમેરો';

  @override
  String get companyBranchName => 'શાખાનું નામ';

  @override
  String get companyHeadOffice => 'મુખ્ય કચેરી';

  @override
  String get companyUnregistered => 'નોંધાયેલ નથી';

  @override
  String get companyCity => 'શહેર';

  @override
  String get companyPincode => 'પિન કોડ';

  @override
  String get seriesTitle => 'નંબર શ્રેણી';

  @override
  String get seriesSubtitle =>
      'બિલ અને વાઉચરને નંબર કેવી રીતે અપાય છે. જીએસટી મહત્તમ 16 અક્ષરની મંજૂરી આપે છે: અક્ષરો, અંકો, - અને /.';

  @override
  String get seriesDocType => 'દસ્તાવેજ';

  @override
  String get seriesPattern => 'પેટર્ન';

  @override
  String get seriesNext => 'આગલો નંબર';

  @override
  String get seriesFy => 'નાણાકીય વર્ષ';

  @override
  String get seriesTokens =>
      'ટોકન: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = ડિવાઇસ કોડ (ઓફલાઇન એપ)';

  @override
  String get seriesTypesSalesInvoice => 'વેચાણ બિલ';

  @override
  String get seriesTypesCreditNote => 'ક્રેડિટ નોટ';

  @override
  String get seriesTypesDebitNote => 'ડેબિટ નોટ';

  @override
  String get seriesTypesPurchaseBill => 'ખરીદી બિલ';

  @override
  String get seriesTypesReceipt => 'આવક';

  @override
  String get seriesTypesPayment => 'ચુકવણી';

  @override
  String get seriesTypesJournal => 'જર્નલ વાઉચર';

  @override
  String get seriesErrorsSeriesTooLong => 'આ પેટર્નના નંબર 16 અક્ષરથી વધી જશે.';

  @override
  String get seriesErrorsSeriesBadChars =>
      'ફક્ત અક્ષરો, અંકો, - અને / ની મંજૂરી છે.';

  @override
  String get seriesErrorsSeriesEmpty => 'પેટર્નમાં SEQ ટોકન હોવો જોઈએ.';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'આગલો નંબર પહેલેથી આપેલા નંબરોથી ઓછો ન હોઈ શકે.';

  @override
  String get auditTitle => 'ઓડિટ ટ્રેલ';

  @override
  String get auditSubtitle =>
      'દરેક ફેરફાર, કોણે કર્યો અને ક્યારે. નોંધો બદલી કે કાઢી શકાતી નથી.';

  @override
  String get auditWhen => 'ક્યારે';

  @override
  String get auditWho => 'કોણ';

  @override
  String get auditWhat => 'શું';

  @override
  String get auditDetails => 'વિગતો';

  @override
  String get auditLoadMore => 'જૂની નોંધો લોડ કરો';

  @override
  String get auditActionsCreate => 'બનાવ્યું';

  @override
  String get auditActionsUpdate => 'બદલ્યું';

  @override
  String get auditActionsLogin => 'સાઇન ઇન કર્યું';

  @override
  String get auditActionsDelete => 'કાઢી નાખ્યું';

  @override
  String get auditActionsCancel => 'રદ કર્યું';

  @override
  String get auditVerify => 'ઓડિટ ટ્રેઇલ તપાસો';

  @override
  String get auditVerifying => 'તપાસ ચાલુ છે...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'બધી $n એન્ટ્રીઓ સુરક્ષિત છે. કંઈ બદલાયું કે કાઢી નંખાયું નથી.',
      one: 'બધી $n એન્ટ્રી સુરક્ષિત છે. કંઈ બદલાયું કે કાઢી નંખાયું નથી.',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'એન્ટ્રી નંબર $seq આગળની એન્ટ્રીઓ સાથે મેળ ખાતી નથી ($reason). ઓડિટ ટ્રેઇલ બદલાયું કે બગડ્યું છે. નકલ રાખો અને સહાયનો સંપર્ક કરો.';
  }

  @override
  String get auditReasonGap => 'એક એન્ટ્રી ખૂટે છે';

  @override
  String get auditReasonLink => 'ક્રમ તૂટેલો છે';

  @override
  String get auditReasonContent => 'એન્ટ્રી બદલાઈ છે';

  @override
  String get auditVerifyFailed => 'તપાસ થઈ શકી નહીં. ફરી પ્રયાસ કરો.';

  @override
  String get backupTitle => 'બેકઅપ અને એક્સપોર્ટ';

  @override
  String get backupSubtitle =>
      'તમારો ડેટા તમારો છે. ગમે ત્યારે બધો ડાઉનલોડ કરો, Varchasv વગર ખુલે તેવી ફાઇલોમાં.';

  @override
  String get backupDownload => 'બધું ડાઉનલોડ કરો (ZIP)';

  @override
  String get backupWhat => 'તમને શું મળે છે';

  @override
  String get backupItem1 =>
      'દરેક કોષ્ટક Excel માટે CSV ફાઇલમાં અને ચોક્કસ કિંમતો સાથે JSON ફાઇલમાં.';

  @override
  String get backupItem2 => 'તમે અપલોડ કરેલો દરેક દસ્તાવેજ જેમ હતો તેમ.';

  @override
  String get backupItem3 =>
      'દરેક કોષ્ટક સમજાવતી README, અને ચેકસમની યાદી જેથી પછી બતાવી શકાય કે કંઈ બદલાયું નથી.';

  @override
  String get backupLeftOut =>
      'પાસવર્ડ, લૉગિન ટોકન અને કર-પોર્ટલ સત્રો સામેલ નથી.';

  @override
  String get backupKeep =>
      'ફાઇલ સુરક્ષિત જગ્યાએ રાખો. તેમાં તમારા ગ્રાહકો, સપ્લાયરો, કિંમતો અને હિસાબ છે.';

  @override
  String get backupSlow => 'મોટા ધંધા માટે તૈયાર થવામાં એક મિનિટ લાગી શકે.';

  @override
  String get backupAuditLink => 'તમારું ઓડિટ ટ્રેઇલ અખંડ છે કે નહીં તે તપાસો';

  @override
  String get roadmapAccounts => 'હિસાબ અને જીએસટી ફાઇલિંગ';

  @override
  String get roadmapInventory => 'માલ અને ખરીદી';

  @override
  String get roadmapSales => 'વેચાણ, ઈ-ઇન્વૉઇસ અને ઈ-વે બિલ';

  @override
  String get roadmapOffline =>
      'Windows, Mac, Linux, Android અને iOS માટે ઓફલાઇન એપ';

  @override
  String get roadmapPayroll => 'એચઆર અને પગાર';

  @override
  String get switcherTitle => 'તમારા વ્યવસાયો';

  @override
  String get switcherAddBusiness => 'વ્યવસાય ઉમેરો';

  @override
  String get switcherCreate => 'વ્યવસાય બનાવો';

  @override
  String get teamTitle => 'ટીમ અને ભૂમિકાઓ';

  @override
  String get teamSubtitle =>
      'આ વ્યવસાય કોણ વાપરી શકે અને દરેક વ્યક્તિ શું કરી શકે.';

  @override
  String get teamMembers => 'સભ્યો';

  @override
  String get teamInvite => 'આમંત્રણ';

  @override
  String get teamInviteTitle => 'કોઈને આમંત્રિત કરો';

  @override
  String get teamEmail => 'ઇમેઇલ';

  @override
  String get teamRole => 'ભૂમિકા';

  @override
  String get teamStatus => 'સ્થિતિ';

  @override
  String get teamActive => 'સક્રિય';

  @override
  String get teamSuspended => 'સ્થગિત';

  @override
  String get teamYou => 'તમે';

  @override
  String get teamPendingInvites => 'બાકી આમંત્રણો';

  @override
  String get teamExpires => 'સમાપ્તિ';

  @override
  String get teamRevoke => 'પાછું ખેંચો';

  @override
  String get teamSuspend => 'સ્થગિત કરો';

  @override
  String get teamReactivate => 'ફરી સક્રિય કરો';

  @override
  String get teamRemove => 'દૂર કરો';

  @override
  String get teamInviteLink => 'આમંત્રણ લિંક';

  @override
  String get teamInviteLinkHint =>
      'અમે ઇમેઇલ કરી દીધી છે. તમે WhatsApp પર પણ મોકલી શકો: તે એક જ વાર ચાલે છે અને 7 દિવસમાં સમાપ્ત થાય છે.';

  @override
  String get teamRoles => 'ભૂમિકાઓ';

  @override
  String get teamNewRole => 'નવી ભૂમિકા';

  @override
  String get teamRoleName => 'ભૂમિકાનું નામ';

  @override
  String get teamPermissions => 'પરવાનગીઓ';

  @override
  String get teamSystemRole => 'બિલ્ટ-ઇન';

  @override
  String teamMembersCount(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count સભ્યો',
      one: '$count સભ્ય',
    );
    return '$_temp0';
  }

  @override
  String get teamModulesCompany => 'કંપની';

  @override
  String get teamModulesUsers => 'ટીમ';

  @override
  String get teamModulesAccounts => 'હિસાબ';

  @override
  String get teamModulesSales => 'વેચાણ';

  @override
  String get teamModulesPurchase => 'ખરીદી';

  @override
  String get teamModulesInventory => 'માલ';

  @override
  String get teamModulesGst => 'જીએસટી';

  @override
  String get teamModulesHr => 'એચઆર';

  @override
  String get teamModulesPayroll => 'પગારપત્રક';

  @override
  String get teamModulesReports => 'રિપોર્ટ';

  @override
  String get teamModulesSettings => 'સેટિંગ્સ';

  @override
  String get teamModulesBanking => 'બેંકિંગ';

  @override
  String get teamModulesAssets => 'સ્થાયી મિલકત';

  @override
  String get teamModulesExpenses => 'ખર્ચ';

  @override
  String get teamModulesProjects => 'પ્રોજેક્ટ';

  @override
  String get teamModulesCrm => 'સીઆરએમ';

  @override
  String get teamPermView => 'જોવું';

  @override
  String get teamPermCreate => 'બનાવવું';

  @override
  String get teamPermEdit => 'ફેરફાર';

  @override
  String get teamPermSubmit => 'સબમિટ';

  @override
  String get teamPermCancel => 'રદ કરવું';

  @override
  String get teamPermDelete => 'કાઢવું';

  @override
  String get teamPermExport => 'નિકાસ';

  @override
  String get teamPermApprove => 'મંજૂરી';

  @override
  String get teamErrorsCannotChangeSelf =>
      'તમે તમારી પોતાની ઍક્સેસ બદલી શકતા નથી.';

  @override
  String get teamErrorsLastOwner =>
      'વ્યવસાયમાં ઓછામાં ઓછો એક સક્રિય માલિક હોવો જોઈએ.';

  @override
  String get teamErrorsOwnerOnly => 'ફક્ત માલિક આ કરી શકે છે.';

  @override
  String get teamErrorsAlreadyMember => 'આ વ્યક્તિ પહેલેથી સભ્ય છે.';

  @override
  String get teamErrorsPermissionEscalation =>
      'તમારી પાસે ન હોય તેવી પરવાનગી તમે આપી શકતા નથી.';

  @override
  String get teamErrorsSystemRole => 'બિલ્ટ-ઇન ભૂમિકાઓ બદલી શકાતી નથી.';

  @override
  String get teamErrorsRoleInUse =>
      'આ ભૂમિકા કાઢતા પહેલાં સભ્યોને બીજી ભૂમિકામાં ખસેડો.';

  @override
  String get teamErrorsUnknownRole => 'તે ભૂમિકા હવે અસ્તિત્વમાં નથી.';

  @override
  String get teamSpecialTitle => 'ખાસ અધિકારો';

  @override
  String get teamSpecialHelp =>
      'ઉપરના કોષ્ટકથી અલગ એક-એક અધિકાર. કોઈ બિલ બનાવી શકે પણ પાછલી તારીખ નાખવી કે ખરીદ કિંમતથી ઓછા ભાવે વેચવું તેના હાથમાં નથી.';

  @override
  String get teamSpecialChangeDate => 'દસ્તાવેજોમાં પાછલી તારીખ નાખવી';

  @override
  String get teamSpecialFutureDate => 'દસ્તાવેજોમાં આગળની તારીખ નાખવી';

  @override
  String get teamSpecialSellBelowCost => 'ખરીદ કિંમતથી ઓછા ભાવે વેચવું';

  @override
  String get teamSpecialSeeAgentCommission => 'એજન્ટ કમિશન જોવું';

  @override
  String get teamSpecialImportData => 'ડેટા આયાત કરવો';

  @override
  String inviteTitle(String business) {
    return '$businessમાં જોડાઓ';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$emailને $role તરીકે આમંત્રણ મળ્યું છે.';
  }

  @override
  String get inviteCreateAccount => 'સ્વીકારવા માટે તમારું ખાતું બનાવો.';

  @override
  String get inviteSignInToAccept =>
      'સ્વીકારવા માટે તમારો Varchasv પાસવર્ડ દાખલ કરો.';

  @override
  String get inviteAccept => 'આમંત્રણ સ્વીકારો';

  @override
  String get inviteInvalid =>
      'આ આમંત્રણ લિંક અમાન્ય છે, વપરાઈ ગઈ છે અથવા સમાપ્ત થઈ ગઈ છે. નવી માગો.';

  @override
  String get accountsTitle => 'ખાતાંની યાદી';

  @override
  String get accountsSubtitle =>
      'તમારા એકાઉન્ટન્ટની અપેક્ષા મુજબ જૂથબદ્ધ ખાતાં. ગ્રાહકો Sundry Debtors હેઠળ, સપ્લાયર Sundry Creditors હેઠળ.';

  @override
  String get accountsNewAccount => 'નવું ખાતું';

  @override
  String get accountsName => 'ખાતાનું નામ';

  @override
  String get accountsNameHi => 'હિન્દીમાં નામ';

  @override
  String get accountsGroup => 'જૂથ';

  @override
  String get accountsBalance => 'બાકી';

  @override
  String get accountsOpeningBalance => 'શરૂઆતની બાકી';

  @override
  String get accountsOpeningHint =>
      'ઉધાર માટે ધન (રોકડ, બેંક, દેવાદાર); જમા માટે ઋણ (મૂડી, લોન, લેણદાર).';

  @override
  String get accountsCode => 'કોડ';

  @override
  String get accountsParty => 'પક્ષની વિગતો';

  @override
  String get accountsPhone => 'ફોન';

  @override
  String get accountsIfsc => 'IFSC';

  @override
  String get accountsAccountNumber => 'ખાતા નંબર';

  @override
  String get accountsAllGroups => 'બધાં જૂથ';

  @override
  String get accountsEmpty => 'કોઈ ખાતું મળ્યું નથી.';

  @override
  String get accountsErrorsAccountNameTaken => 'આ નામનું ખાતું પહેલેથી છે.';

  @override
  String get accountsErrorsUnknownGroup => 'જૂથ પસંદ કરો.';

  @override
  String get accountsErrorsInvalidIfsc => 'IFSC આવો દેખાય છે: HDFC0001234.';

  @override
  String get accountsErrorsInvalidPan => 'પાન આવો દેખાય છે: ABCDE1234F.';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'બિલ્ટ-ઇન ખાતાં પોતાના જૂથમાં જ રહે છે.';

  @override
  String get accountsErrorsNotAnAgent =>
      'દલાલ કે એજન્ટ તરીકે ચિહ્નિત ખાતું પસંદ કરો.';

  @override
  String get accountsErrorsUnknownSalesman =>
      'તમારા કર્મચારીઓમાંથી સેલ્સમેન પસંદ કરો.';

  @override
  String get accountsCreditLimit => 'ઉધાર મર્યાદા (₹)';

  @override
  String get accountsCreditDays => 'ઉધારના દિવસો';

  @override
  String get accountsCreditControl => 'મર્યાદા વટાવે અથવા બાકી હોય ત્યારે';

  @override
  String get accountsCreditControlHint =>
      'બ્લૉક કરવાથી માલિક કે એડમિન મંજૂરી આપે ત્યાં સુધી નવું વેચાણ અટકે છે.';

  @override
  String get accountsCreditWarn => 'ચેતવણી આપીને મંજૂરી';

  @override
  String get accountsCreditBlock => 'બ્લૉક';

  @override
  String get accountsBlockOverdueDays => 'મંજૂર બાકી દિવસ';

  @override
  String get accountsInterestRate => 'બાકી પર વ્યાજ (% વાર્ષિક)';

  @override
  String get vouchersTitle => 'વાઉચર';

  @override
  String get vouchersSubtitle =>
      'તમારા હિસાબની દરેક નોંધ. નોંધાયેલા વાઉચર ક્યારેય બદલાતા નથી: રદ કરીને ફરી નોંધો.';

  @override
  String get vouchersNew => 'નવું વાઉચર';

  @override
  String get vouchersTypesJournal => 'જર્નલ';

  @override
  String get vouchersTypesPayment => 'ચુકવણી';

  @override
  String get vouchersTypesReceipt => 'આવક';

  @override
  String get vouchersTypesContra => 'કોન્ટ્રા';

  @override
  String get vouchersTypesPurchase => 'ખરીદી';

  @override
  String get vouchersTypesDebitNote => 'ડેબિટ નોટ';

  @override
  String get vouchersTypesSales => 'વેચાણ';

  @override
  String get vouchersTypesCreditNote => 'ક્રેડિટ નોટ';

  @override
  String get vouchersTypesGatewaySettlement => 'ગેટવે સેટલમેન્ટ';

  @override
  String get vouchersTypesAssetPurchase => 'મિલકત ખરીદી';

  @override
  String get vouchersTypesDepreciation => 'ઘસારો';

  @override
  String get vouchersTypesAssetDisposal => 'મિલકત વેચાણ';

  @override
  String get vouchersTypesExpenseClaim => 'ખર્ચ દાવો';

  @override
  String get vouchersTypesBrokerage => 'દલાલી બિલ';

  @override
  String get vouchersTypeHintsJournal =>
      'સમાયોજન, ઉધાર વેચાણ અને ખરીદી, જોગવાઈઓ.';

  @override
  String get vouchersTypeHintsPayment => 'રોકડ અથવા બેંકમાંથી જતા પૈસા.';

  @override
  String get vouchersTypeHintsReceipt => 'રોકડ અથવા બેંકમાં આવતા પૈસા.';

  @override
  String get vouchersTypeHintsContra => 'ફક્ત રોકડ અને બેંક ખાતાં વચ્ચે.';

  @override
  String get vouchersNumber => 'નંબર';

  @override
  String get vouchersReference => 'સંદર્ભ';

  @override
  String get vouchersAccount => 'ખાતું';

  @override
  String get vouchersAccounts => 'ખાતાં';

  @override
  String get vouchersAmount => 'રકમ';

  @override
  String get vouchersAddLine => 'લાઇન ઉમેરો';

  @override
  String get vouchersDifference => 'તફાવત';

  @override
  String get vouchersPost => 'વાઉચર નોંધો';

  @override
  String get vouchersCancel => 'વાઉચર રદ કરો';

  @override
  String get vouchersCancelReason => 'રદ કરવાનું કારણ';

  @override
  String get vouchersCancelled => 'રદ';

  @override
  String get vouchersPosted => 'નોંધાયેલ';

  @override
  String get vouchersStatus => 'સ્થિતિ';

  @override
  String get vouchersEmpty => 'આ સમયગાળામાં કોઈ વાઉચર નથી.';

  @override
  String get vouchersChooseAccount => 'ખાતું પસંદ કરો…';

  @override
  String get vouchersErrorsUnbalanced => 'ઉધાર અને જમા સરખા હોવા જોઈએ.';

  @override
  String get vouchersErrorsTooFewLines => 'વાઉચરમાં ઓછામાં ઓછી બે લાઇન જોઈએ.';

  @override
  String get vouchersErrorsZeroLine => 'દરેક લાઇનમાં રકમ જોઈએ.';

  @override
  String get vouchersErrorsBothSides =>
      'લાઇન ઉધાર અથવા જમા હોઈ શકે, બંને નહીં.';

  @override
  String get vouchersErrorsNegativeAmount => 'રકમ ઋણ ન હોઈ શકે.';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'ચુકવણીમાં રોકડ અથવા બેંક ખાતું જમા થવું જોઈએ.';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'આવકમાં રોકડ અથવા બેંક ખાતું ઉધાર થવું જોઈએ.';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'કોન્ટ્રા વાઉચરમાં ફક્ત રોકડ અને બેંક ખાતાં વાપરી શકાય.';

  @override
  String get vouchersErrorsPeriodLocked => 'આ તારીખ લૉક થયેલા સમયગાળામાં છે.';

  @override
  String get vouchersErrorsPeriodClosed => 'આ નાણાકીય વર્ષ બંધ છે.';

  @override
  String get vouchersErrorsBeforeBooksBegin =>
      'આ તારીખ હિસાબ શરૂ થયા પહેલાંની છે.';

  @override
  String get vouchersErrorsAlreadyCancelled => 'આ વાઉચર પહેલેથી રદ છે.';

  @override
  String get vouchersErrorsUnknownAccount => 'એક ખાતું હવે અસ્તિત્વમાં નથી.';

  @override
  String get vouchersErrorsAccountArchived => 'એક ખાતું આર્કાઇવ છે.';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account શૂન્યથી નીચે જશે: $amount. તમે છતાં નોંધી શકો છો.';
  }

  @override
  String get promosTitle => 'વાઉચર અને કૂપન';

  @override
  String get promosSubtitle =>
      'કાઉન્ટર માટે ગિફ્ટ વાઉચર, કૂપન કોડ, ડિસ્કાઉન્ટ કાર્ડ અને લકી ડ્રો.';

  @override
  String get promosStatusesActive => 'ચાલુ';

  @override
  String get promosStatusesUsed => 'પૂરું વપરાયું';

  @override
  String get promosStatusesExpired => 'સમયસીમા પૂરી';

  @override
  String get promosGiftTitle => 'ગિફ્ટ વાઉચર';

  @override
  String promosGiftHint(String amount) {
    return 'ચાલુ વાઉચર પર હજી $amount બાકી છે. GST વાઉચર વેચતી વખતે નહીં, તેનાથી માલ ખરીદતી વખતે લાગે છે.';
  }

  @override
  String get promosGiftCode => 'કોડ';

  @override
  String get promosGiftFor => 'કોના માટે';

  @override
  String get promosGiftValue => 'મૂલ્ય (₹)';

  @override
  String get promosGiftBalance => 'બાકી';

  @override
  String get promosGiftExpires => 'સમાપ્તિ તારીખ';

  @override
  String get promosGiftEmpty => 'હજી કોઈ ગિફ્ટ વાઉચર વેચાયું નથી.';

  @override
  String get promosGiftCount => 'કેટલા';

  @override
  String get promosGiftPaidBy => 'ચુકવણી રીત';

  @override
  String get promosGiftSell => 'વાઉચર વેચો';

  @override
  String get promosGiftIssued => 'વેચાયા. કોડ:';

  @override
  String get promosGiftExpire => 'સમાપ્ત વાઉચરની રકમ પાછી લખો';

  @override
  String get promosGiftExpireHint =>
      'તારીખ વીતી ગયેલા વાઉચરની બાકી રકમ આવક બને છે.';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$n વાઉચર સમાપ્ત, $amount પાછા લખ્યા.';
  }

  @override
  String get promosCouponsTitle => 'કૂપન કોડ';

  @override
  String get promosCouponsNew => 'નવું કૂપન';

  @override
  String get promosCouponsCode => 'કોડ';

  @override
  String get promosCouponsOff => 'છૂટ';

  @override
  String get promosCouponsValid => 'માન્ય';

  @override
  String get promosCouponsUsed => 'વપરાશ';

  @override
  String get promosCouponsEmpty => 'હજી કોઈ કૂપન નથી.';

  @override
  String promosCouponsUpTo(String amount) {
    return '$amount સુધી';
  }

  @override
  String get promosCouponsMaxDiscount => 'મહત્તમ છૂટ (₹)';

  @override
  String get promosCouponsMinBill => 'ઓછામાં ઓછું બિલ (₹)';

  @override
  String get promosCouponsMaxUses => 'કેટલી વાર';

  @override
  String get promosCouponsMaxUsesHint => 'ખાલી = કોઈ મર્યાદા નહીં';

  @override
  String get promosCardsTitle => 'ડિસ્કાઉન્ટ કાર્ડ';

  @override
  String get promosCardsNew => 'નવું કાર્ડ';

  @override
  String get promosCardsNumber => 'કાર્ડ નંબર';

  @override
  String get promosCardsHolder => 'ધારક';

  @override
  String get promosCardsValidUntil => 'ક્યાં સુધી માન્ય';

  @override
  String get promosCardsEmpty => 'હજી કોઈ ડિસ્કાઉન્ટ કાર્ડ નથી.';

  @override
  String get promosDrawTitle => 'લકી ડ્રો';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from થી $to · $entries એન્ટ્રી';
  }

  @override
  String get promosDrawEmpty => 'હજી કોઈ ડ્રો નથી.';

  @override
  String get promosDrawWinners => 'વિજેતા';

  @override
  String get promosDrawHint =>
      'આ સમયગાળામાં ગ્રાહક મોબાઇલવાળું દરેક બિલ એક એન્ટ્રી છે; દરેક મોબાઇલ એક જ વાર જીતી શકે.';

  @override
  String get promosDrawRun => 'વિજેતા પસંદ કરો';

  @override
  String get promosStatus => 'સ્થિતિ';

  @override
  String get promosErrorsInvalidAmount => 'રૂપિયામાં રકમ લખો.';

  @override
  String get promosErrorsInvalidPercent => '0 થી 100 વચ્ચે ટકા લખો.';

  @override
  String get promosErrorsCodeTaken => 'આ કોડ પહેલેથી વપરાય છે.';

  @override
  String get promosErrorsExpiryBeforeIssue =>
      'સમાપ્તિ તારીખ આજ પછીની હોવી જોઈએ.';

  @override
  String get promosErrorsEndsBeforeStart =>
      'છેલ્લી તારીખ શરૂઆતની તારીખ પહેલાં છે.';

  @override
  String get promosErrorsNoEntries =>
      'તે સમયગાળામાં ગ્રાહક મોબાઇલવાળું કોઈ બિલ નથી.';

  @override
  String get promosErrorsInvalidCode => 'માત્ર અક્ષરો, અંકો અને હાઇફન.';

  @override
  String get promosErrorsInvalidPhone => '10 અંકનો મોબાઇલ નંબર લખો.';

  @override
  String get posReturnsTitle => 'વળતર અને બદલી';

  @override
  String get posReturnsSubtitle =>
      'બિલ સામે માલ પાછો લો. સાઇઝ કે રંગ બદલવા સ્ટોર ક્રેડિટ આપો અને તેનાથી નવો નંગ બિલ કરો.';

  @override
  String get posReturnsReturn => 'વળતર';

  @override
  String posReturnsSaved(String number) {
    return 'વળતર $number સાચવ્યું';
  }

  @override
  String get posReturnsCreditCode => 'સ્ટોર ક્રેડિટ કોડ:';

  @override
  String get posReturnsExchangeNow => 'હમણાં બદલીનું બિલ બનાવો';

  @override
  String posReturnsRefunded(String mode) {
    return '$mode થી પાછા આપ્યા.';
  }

  @override
  String posReturnsAgainst(String number) {
    return '$number સામે વળતર';
  }

  @override
  String get posReturnsCanReturn => 'પાછું થઈ શકે';

  @override
  String get posReturnsQty => 'પાછો જથ્થો';

  @override
  String get posReturnsReason => 'કારણ';

  @override
  String get posReturnsCondition => 'સ્થિતિ';

  @override
  String get posReturnsCounter => 'કાઉન્ટર';

  @override
  String get posReturnsNoShift => 'પહેલાં કાઉન્ટર પર શિફ્ટ ખોલો.';

  @override
  String get posReturnsGive => 'કઈ રીતે પાછું આપો';

  @override
  String get posReturnsVoucherHint =>
      'હમણાં કે પછી બદલીની ચુકવણી માટે વાઉચર કોડ';

  @override
  String get posReturnsStoreCredit => 'સ્ટોર ક્રેડિટ (બદલી)';

  @override
  String posReturnsAbout(String amount) {
    return 'આશરે $amount';
  }

  @override
  String get posReturnsTake => 'પાછું લો';

  @override
  String get posReturnsNumber => 'વળતર';

  @override
  String get posReturnsBill => 'બિલ';

  @override
  String get posReturnsWhat => 'શું પાછું આવ્યું';

  @override
  String get posReturnsNone => 'આ દિવસે કોઈ વળતર નથી.';

  @override
  String get posReturnsByReason => 'કારણ પ્રમાણે';

  @override
  String get posReturnsByCondition => 'સ્થિતિ પ્રમાણે';

  @override
  String get posReturnsBillNumber => 'બિલ નંબર';

  @override
  String get posReturnsFind => 'બિલ શોધો';

  @override
  String get posReturnsNotFound => 'તે નંબરનું કોઈ બિલ નથી.';

  @override
  String get posReturnsDate => 'તારીખ';

  @override
  String get posReturnsShow => 'બતાવો';

  @override
  String get posReturnsReasonsSize => 'સાઇઝ';

  @override
  String get posReturnsReasonsColour => 'રંગ';

  @override
  String get posReturnsReasonsDefect => 'ઉત્પાદન ખામી';

  @override
  String get posReturnsReasonsDamaged => 'નુકસાનગ્રસ્ત';

  @override
  String get posReturnsReasonsNotLiked => 'પસંદ ન આવ્યું';

  @override
  String get posReturnsReasonsOther => 'અન્ય';

  @override
  String get posReturnsGradesA => 'A: નવા જેવું, શેલ્ફ પર પાછું';

  @override
  String get posReturnsGradesB => 'B: નાની ખામી, સેકન્ડમાં વેચો';

  @override
  String get posReturnsGradesC => 'C: વેચી શકાય નહીં';

  @override
  String get posReturnsErrorsBillVoid =>
      'આ બિલ રદ થયું છે; તેની સામે વળતર ન થઈ શકે.';

  @override
  String get posReturnsErrorsOverReturn => 'આ લાઇન પર બાકી કરતાં વધુ છે.';

  @override
  String get posReturnsErrorsSessionNotOpen =>
      'પહેલાં આ કાઉન્ટર પર શિફ્ટ ખોલો.';

  @override
  String get posReturnsErrorsDuplicateLine => 'એક લાઇન બે વાર છે.';

  @override
  String get alterationsTitle => 'ઑલ્ટરેશન અને રિપેર';

  @override
  String get alterationsSubtitle =>
      'ફિટિંગ માટે કપડાં લો, કારીગરને આપો અને નક્કી દિવસે પાછાં આપો.';

  @override
  String get alterationsNewSlip => 'નવી ઑલ્ટરેશન સ્લિપ';

  @override
  String get alterationsSetUpFirst =>
      'સ્લિપ લેવા પહેલાં નીચે ઑલ્ટરેશનના પ્રકાર ઉમેરો.';

  @override
  String get alterationsStatusReceived => 'લીધું';

  @override
  String get alterationsStatusWithKarigar => 'કારીગર પાસે';

  @override
  String get alterationsStatusReady => 'ગ્રાહક માટે તૈયાર';

  @override
  String get alterationsNone => 'અહીં કંઈ નથી.';

  @override
  String alterationsLabour(String from, String to) {
    return 'કારીગર મજૂરી, $from થી $to';
  }

  @override
  String get alterationsKarigar => 'કારીગર';

  @override
  String get alterationsKarigars => 'કારીગરો';

  @override
  String get alterationsKarigarHint =>
      'બહારના કારીગરોનું પોતાનું ખાતું બને છે; કામ પાછું આવે ત્યારે મજૂરી જમા થાય છે. અંદરના કારીગરને પગાર મળે છે.';

  @override
  String get alterationsNoKarigars => 'હજી કોઈ કારીગર નથી.';

  @override
  String get alterationsOutside => 'બહારના કારીગર';

  @override
  String get alterationsInHouse => 'અંદરના';

  @override
  String get alterationsPhone => 'મોબાઇલ';

  @override
  String get alterationsSlips => 'સ્લિપ';

  @override
  String get alterationsPieces => 'નંગ';

  @override
  String get alterationsLabourCol => 'મજૂરી';

  @override
  String get alterationsNoLabour =>
      'આ મહિને કારીગરો પાસેથી કંઈ પાછું આવ્યું નથી.';

  @override
  String get alterationsOverdue => 'મોડું';

  @override
  String alterationsDue(String date) {
    return '$date સુધી';
  }

  @override
  String alterationsTrial(String date) {
    return 'ટ્રાયલ $date';
  }

  @override
  String alterationsWith(String name) {
    return '$name પાસે';
  }

  @override
  String get alterationsFree => 'મફત';

  @override
  String get alterationsGive => 'આપો';

  @override
  String get alterationsBack => 'કારીગર પાસેથી પાછું';

  @override
  String get alterationsDeliver => 'સોંપો';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'સોંપો અને $amount લો';
  }

  @override
  String get alterationsCancelSlip => 'સ્લિપ રદ કરો';

  @override
  String get alterationsAgainstBill => 'બિલ સામે';

  @override
  String get alterationsTrialOn => 'ટ્રાયલ તારીખ';

  @override
  String get alterationsDeliveryOn => 'ડિલિવરી તારીખ';

  @override
  String get alterationsComplimentary => 'ખરીદી સાથે મફત';

  @override
  String get alterationsGarment => 'કપડું';

  @override
  String get alterationsWork => 'કામ';

  @override
  String get alterationsNotes => 'માપ અને નોંધ';

  @override
  String get alterationsAddWork => 'કામ ઉમેરો';

  @override
  String get alterationsTakeIn => 'સ્લિપ બનાવો';

  @override
  String alterationsCharge(String amount) {
    return 'ચાર્જ $amount';
  }

  @override
  String get alterationsTypes => 'આપાતા ઑલ્ટરેશન અને રિપેર';

  @override
  String get alterationsCustomerCharge => 'ગ્રાહક ચૂકવે';

  @override
  String get alterationsKindsAlteration => 'ઑલ્ટરેશન';

  @override
  String get alterationsKindsRepair => 'રિપેર';

  @override
  String get alterationsErrorsNameTaken => 'આ નામ પહેલેથી વપરાય છે.';

  @override
  String get alterationsErrorsNotReceived =>
      'આ સ્લિપ પહેલેથી કારીગર પાસે ગઈ છે.';

  @override
  String get alterationsErrorsNotWithKarigar => 'આ સ્લિપ કોઈ કારીગર પાસે નથી.';

  @override
  String get alterationsErrorsNotReady => 'આ સ્લિપ હજી તૈયાર નથી.';

  @override
  String get alterationsErrorsTerminalRequired =>
      'ચાર્જ લેવા માટે કાઉન્ટર પસંદ કરો.';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'ડિલિવરી તારીખ સ્લિપની તારીખ પહેલાં છે.';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'ટ્રાયલ સ્લિપ અને ડિલિવરી તારીખ વચ્ચે હોવી જોઈએ.';

  @override
  String get alterationsErrorsCannotCancel =>
      'સોંપાયેલી કે રદ સ્લિપ રદ ન થઈ શકે.';

  @override
  String get tailoringTitle => 'ઑર્ડર પર સિલાઈ';

  @override
  String get tailoringSubtitle =>
      'માપ, ઍડવાન્સ, દરેક કામ કારીગર પાસેથી, અને ડિલિવરી પર સિલાઈનું બિલ.';

  @override
  String get tailoringNewOrder => 'નવો સિલાઈ ઑર્ડર';

  @override
  String get tailoringTakeMeasurements => 'માપ લો';

  @override
  String get tailoringStatusBooked => 'બુક';

  @override
  String get tailoringStatusInWork => 'કામ ચાલુ છે';

  @override
  String get tailoringStatusReady => 'ડિલિવરી માટે તૈયાર';

  @override
  String get tailoringTrialDue => 'ટ્રાયલ બાકી';

  @override
  String get tailoringToday => 'આજે આપવાનું';

  @override
  String get tailoringMarkDone => 'થઈ ગયું';

  @override
  String get tailoringMarkReady => 'તૈયાર કરો';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'કુલ $total, ઍડવાન્સ $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'આપો અને $amount લો';
  }

  @override
  String get tailoringCancelOrder => 'ઑર્ડર રદ કરો';

  @override
  String tailoringCardsFound(String n) {
    return '$n માપ કાર્ડ છે';
  }

  @override
  String get tailoringStitchingPrice => 'સિલાઈ કિંમત';

  @override
  String get tailoringMeasurements => 'માપ કાર્ડ';

  @override
  String get tailoringNoCard => 'કાર્ડ નહીં';

  @override
  String get tailoringFabric => 'કાપડ';

  @override
  String get tailoringOwnFabric => 'ગ્રાહકનું પોતાનું કાપડ';

  @override
  String get tailoringMetres => 'મીટર';

  @override
  String get tailoringStyleNotes =>
      'સ્ટાઇલ નોંધ (કૉલર, ખિસ્સા, ફિટિંગ, અસ્તર...)';

  @override
  String get tailoringAddGarment => 'કપડું ઉમેરો';

  @override
  String get tailoringAdvance => 'ઍડવાન્સ (₹)';

  @override
  String get tailoringAdvanceHint =>
      'આ ઑર્ડર માટે જમા રહે છે; ડિલિવરી વખતે બિલમાંથી બાદ થાય છે';

  @override
  String get tailoringBook => 'ઑર્ડર બુક કરો';

  @override
  String tailoringEstimate(String amount) {
    return 'અંદાજ $amount';
  }

  @override
  String get tailoringInches => 'માપ ઇંચમાં. જે ન જોઈએ તે ખાલી રાખો.';

  @override
  String get tailoringOtherMeasure => 'અન્ય માપ';

  @override
  String get tailoringValue => 'મૂલ્ય';

  @override
  String get tailoringPhoto => 'ફોટો ઉમેરો';

  @override
  String get tailoringRates => 'કામ પ્રમાણે કારીગર દર';

  @override
  String get tailoringRatesHint =>
      'દરેક કપડાના દરેક કામની પ્રતિ નંગ મજૂરી, થાય તે ક્રમમાં. નવા ઑર્ડર આ કામ લે છે.';

  @override
  String get tailoringProcess => 'કામ';

  @override
  String get tailoringNoRates =>
      'હજી કોઈ દર નથી: દર ઉમેરો ત્યાં સુધી ઑર્ડરમાં કામ નહીં હોય.';

  @override
  String get tailoringAddRate => 'કામ ઉમેરો';

  @override
  String get tailoringKeysChest => 'છાતી';

  @override
  String get tailoringKeysWaist => 'કમર';

  @override
  String get tailoringKeysHip => 'હિપ';

  @override
  String get tailoringKeysShoulder => 'ખભો';

  @override
  String get tailoringKeysLength => 'લંબાઈ';

  @override
  String get tailoringKeysSleeve => 'બાંય';

  @override
  String get tailoringKeysNeck => 'ગળું';

  @override
  String get tailoringKeysInseam => 'અંદરની લંબાઈ';

  @override
  String get tailoringErrorsPhotoTooBig =>
      'ફોટો બહુ મોટો છે (વધુમાં વધુ 6 MB).';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'ઍડવાન્સ ઑર્ડરના કુલ કરતાં વધુ છે.';

  @override
  String get tailoringErrorsAssignFirst => 'પહેલાં કામ કારીગરને આપો.';

  @override
  String get tailoringErrorsProcessDone => 'તે કામ પહેલેથી થઈ ગયું છે.';

  @override
  String get tailoringErrorsProcessesPending => 'કેટલાક કામ હજી બાકી છે.';

  @override
  String get tailoringErrorsNotReady => 'આ ઑર્ડર હજી તૈયાર નથી.';

  @override
  String get tailoringErrorsOrderClosed =>
      'આ ઑર્ડર પહેલેથી અપાયો કે રદ થયો છે.';

  @override
  String get tailoringErrorsFabricQtyRequired => 'કેટલા મીટર કાપડ તે લખો.';

  @override
  String get tailoringErrorsNoMeasurements => 'ઓછામાં ઓછું એક માપ લખો.';

  @override
  String get tailoringErrorsDuplicateRate => 'એ જ કપડું અને કામ બે વાર છે.';

  @override
  String get consignmentTitle => 'કન્સાઇનમેન્ટ અને શૉપ-ઇન-શૉપ';

  @override
  String get consignmentSubtitle =>
      'બીજી દુકાનોમાં રાખેલો માલ વેચાય ત્યાં સુધી તમારો રહે છે. માલ મોકલો, પાછો લો અને તેમના વેચાણ રિપોર્ટ મુજબ બિલ બનાવો.';

  @override
  String get consignmentSend => 'માલ મોકલો';

  @override
  String get consignmentBillSales => 'તેમના વેચાણનું બિલ';

  @override
  String get consignmentTakeBack => 'માલ પાછો લો';

  @override
  String get consignmentConsignee => 'કન્સાઇની';

  @override
  String get consignmentHeld => 'તેમની પાસે';

  @override
  String get consignmentValueAtCost => 'પડતર મૂલ્ય';

  @override
  String get consignmentSold => 'વેચાયું';

  @override
  String get consignmentAgeing => 'જૂનો માલ';

  @override
  String consignmentItemsAgeing(String n) {
    return '150 દિવસથી જૂની વસ્તુઓ: $n';
  }

  @override
  String get consignmentFine => 'બધું નવું';

  @override
  String get consignmentNone => 'હજી કોઈ માલ કન્સાઇનમેન્ટ પર નથી.';

  @override
  String consignmentReconcileTitle(String name) {
    return 'મેળવણી: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'તેમની દુકાને ગણેલી સંખ્યા ભરો. ઓછા પડેલા પીસ વેચાયેલા ગણી તેમને બિલ થશે. માલ મોકલ્યાના છ મહિનામાં બિલ કરવું જરૂરી છે.';

  @override
  String get consignmentSent => 'મોકલ્યું';

  @override
  String get consignmentReturned => 'પાછું આવ્યું';

  @override
  String get consignmentCounted => 'ગણતરી';

  @override
  String get consignmentInvoiceBy => 'બિલની અંતિમ તારીખ';

  @override
  String consignmentMismatch(String n) {
    return '$n નો તફાવત';
  }

  @override
  String consignmentShortage(String n) {
    return 'ગણતરીમાં ઓછા પીસ: $n';
  }

  @override
  String get consignmentShortageNarration => 'સ્ટૉક ગણતરીમાં વેચાયેલું મળ્યું';

  @override
  String get consignmentBillShortage => 'ઘટને વેચાણ ગણી બિલ કરો';

  @override
  String get consignmentRegister => 'હેરફેર';

  @override
  String get consignmentKindsSend => 'મોકલ્યું';

  @override
  String get consignmentKindsReturn => 'પાછું આવ્યું';

  @override
  String get consignmentKindsSale => 'વેચાયું અને બિલ થયું';

  @override
  String get consignmentFormsSend => 'કન્સાઇનમેન્ટ પર માલ મોકલો';

  @override
  String get consignmentFormsReturn => 'માલ પાછો લો';

  @override
  String get consignmentFormsSales => 'તેમનો વેચાણ રિપોર્ટ';

  @override
  String get consignmentFormHintsSend =>
      'માલ તેમની દુકાને જાય છે અને તમારા ચોપડે રહે છે. દર ખાલી રાખશો તો તેમની ભાવ યાદી અથવા વસ્તુનો વેચાણ દર લાગશે.';

  @override
  String get consignmentFormHintsReturn =>
      'ન વેચાયેલા પીસ તમારા મુખ્ય ગોદામમાં પાછા આવે છે.';

  @override
  String get consignmentFormHintsSales =>
      'દરેક વેચાણ રિપોર્ટ તેમની દુકાનના માલમાંથી તેમના નામે ટૅક્સ ઇન્વૉઇસ બને છે. ક્રેડિટ મર્યાદા વટાવે તો પણ ચેતવણી સાથે બને છે.';

  @override
  String get consignmentAgreedRate => 'નક્કી દર';

  @override
  String get consignmentAddLine => 'વસ્તુ ઉમેરો';

  @override
  String get consignmentSaveSend => 'મોકલો';

  @override
  String get consignmentSaveReturn => 'પાછું લો';

  @override
  String get consignmentSaveSales => 'ઇન્વૉઇસ બનાવો';

  @override
  String get consignmentErrorsMoreThanHeld =>
      'આ તેમની પાસેના માલ કરતાં વધુ છે.';

  @override
  String get consignmentErrorsNotACustomer => 'ગ્રાહક ખાતું પસંદ કરો.';

  @override
  String get consignmentErrorsDuplicateItem => 'એક જ વસ્તુ બે વાર છે.';

  @override
  String get consignmentErrorsUnknownItem => 'એક વસ્તુ હવે અસ્તિત્વમાં નથી.';

  @override
  String get reportsParticulars => 'વિગત';

  @override
  String get reportsTradingIncome => 'વેચાણ અને પ્રત્યક્ષ આવક';

  @override
  String get reportsTradingExpense => 'ખરીદી અને પ્રત્યક્ષ ખર્ચ';

  @override
  String get reportsGrossProfit => 'કુલ નફો';

  @override
  String get reportsOtherIncome => 'પરોક્ષ આવક';

  @override
  String get reportsOtherExpense => 'પરોક્ષ ખર્ચ';

  @override
  String get reportsNetProfit => 'ચોખ્ખો નફો';

  @override
  String get reportsNetLoss => 'ચોખ્ખું નુકસાન';

  @override
  String get reportsAssets => 'મિલકતો';

  @override
  String get reportsLiabilities => 'જવાબદારીઓ અને મૂડી';

  @override
  String get reportsProfitAndLoss => 'નફા-નુકસાન ખાતું';

  @override
  String get reportsDifference => 'તફાવત';

  @override
  String get reportsOpeningDifference => 'શરૂઆતની બાકીમાં તફાવત';

  @override
  String get reportsOpening => 'શરૂઆતની બાકી';

  @override
  String get reportsClosing => 'અંતિમ બાકી';

  @override
  String get reportsNoData => 'આ સમયગાળામાં બતાવવા જેવું કંઈ નથી.';

  @override
  String reportsLedgerTitle(String account) {
    return 'ખાતાવહી: $account';
  }

  @override
  String get reportsStockNote =>
      'તબક્કા 3માં માલ આવ્યા પછી અંતિમ સ્ટોક ઉમેરાય છે.';

  @override
  String get reportsOpeningStock => 'શરૂઆતનો સ્ટોક';

  @override
  String get reportsClosingStock => 'અંતિમ સ્ટોક';

  @override
  String get reportsBuilderTitle => 'રિપોર્ટ બિલ્ડર';

  @override
  String get reportsBuilderSubtitle =>
      'વેચાણ, ખરીદી, ખર્ચ, ખાતાવહી નોંધો કે સમયને જેમ જોઈએ તેમ જૂથબદ્ધ કરી સરવાળો કરો; સાચવો, અથવા ઇમેઇલથી મેળવો.';

  @override
  String get reportsBuilderDataset => 'ડેટા';

  @override
  String get reportsBuilderDatasetsSales => 'વેચાણ';

  @override
  String get reportsBuilderDatasetsPurchases => 'ખરીદી';

  @override
  String get reportsBuilderDatasetsExpenses => 'ખર્ચ';

  @override
  String get reportsBuilderDatasetsLedger => 'ખાતાવહી નોંધો';

  @override
  String get reportsBuilderDatasetsTime => 'ટાઇમશીટ';

  @override
  String get reportsBuilderGroupBy => 'જૂથબદ્ધ કરો (3 સુધી)';

  @override
  String get reportsBuilderMeasures => 'બતાવો';

  @override
  String get reportsBuilderDimsMonth => 'મહિનો';

  @override
  String get reportsBuilderDimsDay => 'દિવસ';

  @override
  String get reportsBuilderDimsCustomer => 'ગ્રાહક';

  @override
  String get reportsBuilderDimsItem => 'વસ્તુ';

  @override
  String get reportsBuilderDimsHsn => 'HSN';

  @override
  String get reportsBuilderDimsState => 'રાજ્ય';

  @override
  String get reportsBuilderDimsSupplier => 'સપ્લાયર';

  @override
  String get reportsBuilderDimsCategory => 'પ્રકાર';

  @override
  String get reportsBuilderDimsEmployee => 'કર્મચારી';

  @override
  String get reportsBuilderDimsProject => 'પ્રોજેક્ટ';

  @override
  String get reportsBuilderDimsAccount => 'ખાતું';

  @override
  String get reportsBuilderDimsGroup => 'જૂથ';

  @override
  String get reportsBuilderDimsType => 'વાઉચર પ્રકાર';

  @override
  String get reportsBuilderMeasureNamesQty => 'જથ્થો';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'કરપાત્ર કિંમત';

  @override
  String get reportsBuilderMeasureNamesTax => 'જીએસટી';

  @override
  String get reportsBuilderMeasureNamesTotal => 'કુલ';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'દસ્તાવેજો';

  @override
  String get reportsBuilderMeasureNamesAmount => 'રકમ';

  @override
  String get reportsBuilderMeasureNamesItc => 'જીએસટી ક્રેડિટ';

  @override
  String get reportsBuilderMeasureNamesDebit => 'ઉધાર';

  @override
  String get reportsBuilderMeasureNamesCredit => 'જમા';

  @override
  String get reportsBuilderMeasureNamesNet => 'ચોખ્ખું';

  @override
  String get reportsBuilderMeasureNamesHours => 'કલાક';

  @override
  String get reportsBuilderMeasureNamesCost => 'ખર્ચ';

  @override
  String get reportsBuilderMeasureNamesBillableValue => 'બિલપાત્ર કિંમત';

  @override
  String get reportsBuilderPeriod => 'સમયગાળો';

  @override
  String get reportsBuilderPresetsToday => 'આજે';

  @override
  String get reportsBuilderPresetsYesterday => 'ગઈકાલે';

  @override
  String get reportsBuilderPresetsThisMonth => 'આ મહિનો';

  @override
  String get reportsBuilderPresetsLastMonth => 'ગયો મહિનો';

  @override
  String get reportsBuilderPresetsThisQuarter => 'આ ત્રિમાસિક';

  @override
  String get reportsBuilderPresetsLastQuarter => 'ગયું ત્રિમાસિક';

  @override
  String get reportsBuilderPresetsThisFy => 'આ નાણાકીય વર્ષ';

  @override
  String get reportsBuilderPresetsLastFy => 'ગયું નાણાકીય વર્ષ';

  @override
  String get reportsBuilderPresetsCustom => 'તારીખો પસંદ કરો';

  @override
  String get reportsBuilderRun => 'ચલાવો';

  @override
  String get reportsBuilderCsv => 'CSV ડાઉનલોડ કરો';

  @override
  String get reportsBuilderSave => 'રિપોર્ટ સાચવો';

  @override
  String get reportsBuilderName => 'રિપોર્ટનું નામ';

  @override
  String get reportsBuilderSchedule => 'ઇમેઇલ કરો';

  @override
  String get reportsBuilderFrequenciesNone => 'ઇમેઇલ ન કરો';

  @override
  String get reportsBuilderFrequenciesDaily => 'દરરોજ (ગઈકાલના આંકડા)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'દર અઠવાડિયે (ગયા સોમવારથી રવિવાર)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'દર મહિને (ગયો મહિનો)';

  @override
  String get reportsBuilderHour => 'સમય';

  @override
  String get reportsBuilderWeekday => 'દિવસ';

  @override
  String get reportsBuilderWeekdays0 => 'રવિવાર';

  @override
  String get reportsBuilderWeekdays1 => 'સોમવાર';

  @override
  String get reportsBuilderWeekdays2 => 'મંગળવાર';

  @override
  String get reportsBuilderWeekdays3 => 'બુધવાર';

  @override
  String get reportsBuilderWeekdays4 => 'ગુરુવાર';

  @override
  String get reportsBuilderWeekdays5 => 'શુક્રવાર';

  @override
  String get reportsBuilderWeekdays6 => 'શનિવાર';

  @override
  String get reportsBuilderDay => 'તારીખે (1–28)';

  @override
  String get reportsBuilderRecipients => 'આમને ઇમેઇલ કરો (અલ્પવિરામથી અલગ)';

  @override
  String get reportsBuilderSaved => 'સચવાયું.';

  @override
  String get reportsBuilderTotal => 'કુલ';

  @override
  String get reportsBuilderNoRows => 'આ સમયગાળામાં ડેટા નથી.';

  @override
  String get reportsBuilderSavedTitle => 'સાચવેલા રિપોર્ટ';

  @override
  String reportsBuilderNextRun(String date) {
    return 'આગલો ઇમેઇલ: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'છેલ્લો રન નિષ્ફળ: $error';
  }

  @override
  String get reportsBuilderDelete => 'કાઢી નાખો';

  @override
  String get reportsBuilderNone => 'હજી કોઈ રિપોર્ટ સાચવ્યો નથી.';

  @override
  String get reportsErrorsUnknownDataset => 'શેના પર રિપોર્ટ કરવો તે પસંદ કરો.';

  @override
  String get reportsErrorsUnknownMeasure =>
      'બતાવવા માટે ઓછામાં ઓછો એક આંકડો પસંદ કરો.';

  @override
  String get reportsErrorsUnknownDimension => 'તે જૂથીકરણ અહીં ઉપલબ્ધ નથી.';

  @override
  String get reportsErrorsInvalidPeriod => 'તારીખો તપાસો.';

  @override
  String get reportsErrorsRecipientsRequired =>
      'ઓછામાં ઓછું એક ઇમેઇલ સરનામું ઉમેરો.';

  @override
  String get reportsErrorsInvalidHour => 'સમય પસંદ કરો.';

  @override
  String get reportsErrorsInvalidWeekday => 'અઠવાડિયાનો દિવસ પસંદ કરો.';

  @override
  String get reportsErrorsInvalidDay => '1 થી 28 વચ્ચેની તારીખ પસંદ કરો.';

  @override
  String get reportsErrorsUnknownFilter => 'તે ફિલ્ટર અહીં ઉપલબ્ધ નથી.';

  @override
  String get ownerReportsColourSizeTitle => 'રંગ અને સાઇઝ રિપોર્ટ';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'દરેક ડિઝાઇન રંગ અને સાઇઝની ગ્રિડમાં, સ્ટૉક અથવા વેચાયેલા નંગ સાથે.';

  @override
  String get ownerReportsAgeingTitle => 'સ્ટૉકનું આયુ અને ડેડ સ્ટૉક';

  @override
  String get ownerReportsAgeingSubtitle =>
      'આજનો સ્ટૉક કેટલા સમયથી છે (પહેલાં આવેલો પહેલાં વેચાય), અને શું વેચાવાનું બંધ થયું.';

  @override
  String get ownerReportsRegisterTitle => 'વેચાણ રજિસ્ટર';

  @override
  String get ownerReportsRegisterSubtitle =>
      'સમયગાળાનું દરેક ઇન્વૉઇસ, કાઉન્ટર બિલ અને વળતર, ચુકવણીની રીત સાથે.';

  @override
  String get ownerReportsDesign => 'ડિઝાઇન';

  @override
  String get ownerReportsName => 'નામ';

  @override
  String get ownerReportsBrand => 'બ્રાન્ડ';

  @override
  String get ownerReportsColour => 'રંગ';

  @override
  String get ownerReportsSize => 'સાઇઝ';

  @override
  String get ownerReportsSold => 'વેચાયા';

  @override
  String get ownerReportsStock => 'સ્ટૉક';

  @override
  String get ownerReportsSales => 'વેચાણ';

  @override
  String get ownerReportsReportType => 'બતાવો';

  @override
  String get ownerReportsFrom => 'થી';

  @override
  String get ownerReportsTo => 'સુધી';

  @override
  String get ownerReportsAsOf => 'આ તારીખે';

  @override
  String get ownerReportsStore => 'ગોદામ';

  @override
  String get ownerReportsAllStores => 'અમારાં બધાં ગોદામ';

  @override
  String get ownerReportsAllBrands => 'બધી બ્રાન્ડ';

  @override
  String get ownerReportsCategory => 'શ્રેણી';

  @override
  String get ownerReportsAllCategories => 'બધી શ્રેણી';

  @override
  String get ownerReportsSearchDesign => 'ડિઝાઇન નં. અથવા નામ';

  @override
  String ownerReportsTotalSold(String n) {
    return 'વેચાયેલા નંગ: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'સ્ટૉકમાં નંગ: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'MRP $v';
  }

  @override
  String get ownerReportsTotal => 'કુલ';

  @override
  String get ownerReportsNoPhoto => 'ફોટો નથી';

  @override
  String get ownerReportsNothing => 'આ પસંદગીઓ માટે કંઈ નથી.';

  @override
  String get ownerReportsItem => 'વસ્તુ';

  @override
  String get ownerReportsValue => 'મૂલ્ય';

  @override
  String get ownerReportsDeadAfter => 'ડેડ ક્યારે';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'ડેડ: $n દિવસથી વેચાણ નથી';
  }

  @override
  String get ownerReportsOnlyDead => 'માત્ર ડેડ સ્ટૉક';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'આયુ મુજબ સ્ટૉક: $v, $n નંગ';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'ડેડ સ્ટૉક ($n દિવસથી વેચાણ નથી)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'વસ્તુઓ: $items, નંગ: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'છૂટ, સપ્લાયરને પરત અથવા બીજા ગોદામે મોકલવા યોગ્ય.';

  @override
  String get ownerReportsDead => 'ડેડ';

  @override
  String get ownerReportsLastSold => 'છેલ્લું વેચાણ';

  @override
  String get ownerReportsIdleDays => 'વેચાણ વગરના દિવસ';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n દિવસ પહેલાં)';
  }

  @override
  String get ownerReportsNeverSold => 'ક્યારેય વેચાયું નથી';

  @override
  String get ownerReportsDate => 'તારીખ';

  @override
  String get ownerReportsNumber => 'નં.';

  @override
  String get ownerReportsKind => 'દસ્તાવેજ';

  @override
  String get ownerReportsParty => 'ગ્રાહક';

  @override
  String get ownerReportsColsPieces => 'નંગ';

  @override
  String get ownerReportsColsGross => 'કુલ રકમ';

  @override
  String get ownerReportsColsDiscount => 'છૂટ';

  @override
  String get ownerReportsColsTaxable => 'કરપાત્ર';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'બિલ રકમ';

  @override
  String get ownerReportsColsCash => 'રોકડ';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'કાર્ડ';

  @override
  String get ownerReportsColsCredit => 'ઉધાર';

  @override
  String get ownerReportsKindsInvoice => 'ઇન્વૉઇસ';

  @override
  String get ownerReportsKindsBill => 'કાઉન્ટર બિલ';

  @override
  String get ownerReportsKindsCreditNote => 'ક્રેડિટ નોટ';

  @override
  String get ownerReportsKindsCounterReturn => 'કાઉન્ટર વળતર';

  @override
  String get ownerReportsSearchRegister => 'નંબર અથવા ગ્રાહક';

  @override
  String get ownerReportsAllKinds => 'બધા દસ્તાવેજ';

  @override
  String ownerReportsDocuments(String n) {
    return 'દસ્તાવેજ: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'વળતર માઇનસ લાઇનમાં છે. રંગીન લાઇન પર છૂટ હતી; છેકેલી લાઇન રદ છે અને કુલમાં નથી.';

  @override
  String get ownerReportsCompareLastYear => 'ગયા વર્ષ સાથે સરખામણી';

  @override
  String get ownerReportsThisPeriod => 'આ સમયગાળો';

  @override
  String get ownerReportsSameLastYear => 'ગયા વર્ષે આ જ સમયગાળો';

  @override
  String get ownerReportsChange => 'ફેરફાર';

  @override
  String get ownerReportsErrorsInvalidPeriod => 'શરૂઆતની તારીખ અંત પછી છે.';

  @override
  String get ownerReportsWithMaterials => 'કાપડ અને ટ્રિમ સાથે';

  @override
  String get ownerReportsAvgBill => 'સરેરાશ બિલ';

  @override
  String get fyTitle => 'નાણાકીય વર્ષો';

  @override
  String get fySubtitle =>
      'હિસાબ અંતિમ થાય ત્યારે સમયગાળો લૉક કરો: ઉદાહરણ તરીકે જીએસટી રિટર્ન ભર્યા પછી. લૉક તારીખ સુધી કોઈ નોંધ કરી કે રદ કરી શકતું નથી.';

  @override
  String get fyYear => 'વર્ષ';

  @override
  String get fyPeriod => 'સમયગાળો';

  @override
  String get fyLockedUpTo => 'સુધી લૉક';

  @override
  String get fyOpen => 'ખુલ્લું';

  @override
  String get fyLock => 'લૉક કરો';

  @override
  String get fyUnlock => 'લૉક દૂર કરો';

  @override
  String get fyErrorsLockOutsideYear =>
      'લૉક તારીખ આ નાણાકીય વર્ષની અંદર હોવી જોઈએ.';

  @override
  String get appConnectTitle => 'આ ડિવાઇસ જોડો';

  @override
  String get appConnectSubtitle =>
      'તમારા Varchasv ખાતાથી એક વાર સાઇન ઇન કરો. પછી એપ ઇન્ટરનેટ વગર ચાલે છે અને ઓનલાઇન હો ત્યારે સિંક થાય છે.';

  @override
  String get appServer => 'સર્વર સરનામું';

  @override
  String get appConnect => 'જોડો';

  @override
  String get appConnecting => 'જોડાઈ રહ્યું છે…';

  @override
  String get appNoBusiness =>
      'આ ખાતું હજી કોઈ વ્યવસાયનો ભાગ નથી. પહેલાં વેબસાઇટ પર એક બનાવો.';

  @override
  String get appCantReach =>
      'સર્વર સુધી પહોંચી શકાતું નથી. સરનામું અને ઇન્ટરનેટ જોડાણ તપાસો.';

  @override
  String get appSyncTitle => 'સિંક';

  @override
  String get appSyncNow => 'હમણાં સિંક કરો';

  @override
  String appLastSync(String time) {
    return 'છેલ્લે $timeએ સિંક થયું';
  }

  @override
  String get appNeverSynced => 'હજી સિંક થયું નથી';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ફેરફારો અપલોડની રાહમાં',
      one: '$count ફેરફાર અપલોડની રાહમાં',
      zero: 'બધું અપલોડ થઈ ગયું',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'સર્વરે $count ફેરફારો નકાર્યા',
      one: 'સર્વરે $count ફેરફાર નકાર્યો',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'નકારેલા ફેરફારો ફરી પ્રયાસ કરો';

  @override
  String get appOffline =>
      'ઓફલાઇન: તમારું કામ આ ડિવાઇસ પર સચવાયું છે અને પછી અપલોડ થશે.';

  @override
  String get appSyncing => 'સિંક થઈ રહ્યું છે…';

  @override
  String get appDevice => 'આ ડિવાઇસ';

  @override
  String appDeviceCode(String code) {
    return 'ડિવાઇસ કોડ $code';
  }

  @override
  String get appBusiness => 'વ્યવસાય';

  @override
  String get appSignOut => 'આ ડિવાઇસમાંથી સાઇન આઉટ કરો';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ફેરફારો હજી અપલોડ થયા નથી અને ખોવાઈ જશે.',
      one: '$count ફેરફાર હજી અપલોડ થયો નથી અને ખોવાઈ જશે.',
      zero: 'આથી આ ડિવાઇસ પરથી તમારા હિસાબની સ્થાનિક નકલ દૂર થશે.',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'અપલોડની રાહમાં';

  @override
  String get appBadgeFailed => 'નકાર્યું';

  @override
  String get appBadgeSynced => 'અપલોડ થયું';

  @override
  String get appNoVouchers => 'હજી કોઈ વાઉચર નથી. ઉમેરવા + દબાવો.';

  @override
  String get appAddAccount => 'ખાતું ઉમેરો';

  @override
  String get appNoPermission => 'તમને આ કરવાની પરવાનગી નથી.';

  @override
  String get appToday => 'આજે';

  @override
  String get appPreviousDay => 'આગલો દિવસ';

  @override
  String get appNextDay => 'પછીનો દિવસ';

  @override
  String get appNotSyncedYet => 'સિંકની રાહમાં';

  @override
  String get appFieldTitle => 'ફીલ્ડ વર્ક';

  @override
  String get appFieldNewOrder => 'નવો ઓર્ડર';

  @override
  String get appFieldNewClaim => 'નવો ખર્ચ દાવો';

  @override
  String get appFieldOrders => 'આ ડિવાઇસના ઓર્ડર';

  @override
  String get appFieldClaims => 'આ ડિવાઇસના દાવા';

  @override
  String appFieldSentAs(String number) {
    return '$number તરીકે અપલોડ થયું';
  }

  @override
  String appFieldApprox(String amount) {
    return 'જીએસટી સાથે લગભગ ₹$amount; અંતિમ રકમ અપલોડ વખતે ગણાય છે';
  }

  @override
  String get appFieldAddItem => 'વસ્તુ ઉમેરો';

  @override
  String get appFieldQty => 'જથ્થો';

  @override
  String get appFieldRate => 'દર';

  @override
  String get appFieldSave => 'સાચવો';

  @override
  String get appFieldSaved => 'આ ડિવાઇસ પર સચવાયું; ઓનલાઇન થતાં અપલોડ થશે.';

  @override
  String get appFieldNone => 'હજી કંઈ નથી.';

  @override
  String get appOverviewTitle => 'ઝાંખી';

  @override
  String appOverviewAsOf(String time) {
    return '$time મુજબના આંકડા';
  }

  @override
  String appOverviewOffline(String time) {
    return '$timeના આંકડા બતાવી રહ્યા છીએ. તાજા કરવા ઇન્ટરનેટ સાથે જોડાઓ.';
  }

  @override
  String get appOverviewNever => 'આજના આંકડા જોવા ઇન્ટરનેટ સાથે જોડાઓ.';

  @override
  String get appOverviewRefresh => 'તાજું કરો';

  @override
  String get appApprovalsTitle => 'મંજૂરીઓ';

  @override
  String get appApprovalsNone => 'તમારી રાહમાં કંઈ નથી.';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours કલાક';
  }

  @override
  String get appApprovalsNeedOnline => 'મંજૂરી માટે ઇન્ટરનેટ જરૂરી છે.';

  @override
  String get itemsTitle => 'વસ્તુઓ';

  @override
  String get itemsSubtitle =>
      'તમે રાખો છો તે માલ અને ખરીદો કે વેચો છો તે સેવાઓ, HSN/SAC અને જીએસટી દર સાથે.';

  @override
  String get itemsNew => 'નવી વસ્તુ';

  @override
  String get itemsName => 'વસ્તુનું નામ';

  @override
  String get itemsKind => 'પ્રકાર';

  @override
  String get itemsGoods => 'માલ';

  @override
  String get itemsService => 'સેવા';

  @override
  String get itemsSku => 'SKU / કોડ';

  @override
  String get itemsBarcode => 'બારકોડ';

  @override
  String get itemsHsn => 'HSN / SAC';

  @override
  String get itemsGstRate => 'જીએસટી દર';

  @override
  String get itemsUom => 'એકમ';

  @override
  String get itemsPurchaseRate => 'ખરીદ દર';

  @override
  String get itemsSaleRate => 'વેચાણ દર';

  @override
  String get itemsMrp => 'MRP';

  @override
  String get itemsReorderLevel => 'ફરી ઓર્ડર સ્તર';

  @override
  String get itemsReorderQty => 'ફરી ઓર્ડર જથ્થો';

  @override
  String get itemsTrackBatches => 'બેચ નંબર અને સમાપ્તિ તારીખ રાખો';

  @override
  String get itemsInStock => 'સ્ટોકમાં';

  @override
  String get itemsEmpty => 'હજી કોઈ વસ્તુ નથી.';

  @override
  String get itemsErrorsInvalidHsn => 'HSN કોડમાં 4, 6 અથવા 8 અંક હોય છે.';

  @override
  String get itemsErrorsInvalidSac => 'SAC કોડમાં 99થી શરૂ થતા 6 અંક હોય છે.';

  @override
  String get itemsErrorsItemNameTaken => 'આ નામની વસ્તુ પહેલેથી છે.';

  @override
  String get itemsErrorsSkuTaken => 'બીજી વસ્તુ પહેલેથી આ કોડ વાપરે છે.';

  @override
  String get itemsErrorsUnknownUom => 'એકમ પસંદ કરો.';

  @override
  String get itemsErrorsSameAsBaseUnit => 'આ પહેલેથી જ વસ્તુનો પોતાનો એકમ છે.';

  @override
  String get itemsErrorsDuplicateUnit => 'દરેક એકમ એક જ વાર ઉમેરી શકાય.';

  @override
  String get itemsErrorsInvalidFactor =>
      'તેમાં મૂળ એકમના કેટલા છે તે 0 થી વધુ લખો.';

  @override
  String get itemsLeadTimeDays => 'લીડ ટાઇમ (દિવસ)';

  @override
  String get itemsGstSlab => 'જીએસટી દર';

  @override
  String get itemsSlabNone => 'નિશ્ચિત દર';

  @override
  String get itemsSlabApparel =>
      'ડિસ્કાઉન્ટ પછી પીસ દીઠ ₹2,500 સુધી 5%, તેનાથી ઉપર 18% (22 સપ્ટેમ્બર 2025 થી)';

  @override
  String get itemsSlabFootwear =>
      'ડિસ્કાઉન્ટ પછી જોડી દીઠ ₹2,500 સુધી 5%, તેનાથી ઉપર 18% (22 સપ્ટેમ્બર 2025 થી)';

  @override
  String get itemsSlabPieces => 'એક એકમમાં પીસ';

  @override
  String get itemsSlabPiecesHint =>
      'એક એકમ તરીકે વેચાતા સેટની કિંમત જીએસટી ચકાસણી માટે આટલા પીસમાં વહેંચાય છે. સેટને એક પીસ ગણવા 1 લખો.';

  @override
  String get itemsByPrice => 'કિંમત મુજબ';

  @override
  String get itemsOtherUnits => 'અન્ય એકમો';

  @override
  String get itemsUnitFactor => 'મૂળ એકમમાં કેટલા';

  @override
  String get itemsOfBaseUnit => 'મૂળ એકમ';

  @override
  String get itemsAddUnit => 'એકમ ઉમેરો';

  @override
  String get stylesTitle => 'સ્ટાઇલ';

  @override
  String get stylesSubtitle =>
      'રંગ અને સાઇઝમાં વેચાતી ડિઝાઇન. દરેક રંગ અને સાઇઝ અલગ આઇટમ છે, જેનો પોતાનો બારકોડ અને સ્ટોક છે.';

  @override
  String get stylesSizesAndColors => 'સાઇઝ અને રંગ';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'સ્ટાઇલ ઉમેરતી વખતે પસંદ કરવાના સાઇઝ સ્કેલ અને રંગ.';

  @override
  String get stylesNew => 'નવી સ્ટાઇલ';

  @override
  String get stylesCreate => 'સ્ટાઇલ બનાવો';

  @override
  String get stylesCode => 'ડિઝાઇન નં.';

  @override
  String get stylesCodeHint => 'દરેક SKUમાં વપરાય છે, જેમ કે KT-101-NVY-M.';

  @override
  String get stylesName => 'નામ';

  @override
  String get stylesBrand => 'બ્રાન્ડ';

  @override
  String get stylesCategory => 'શ્રેણી';

  @override
  String get stylesSeason => 'સીઝન';

  @override
  String get stylesSeasonExample => 'તહેવાર 2026';

  @override
  String get stylesCollection => 'કલેક્શન';

  @override
  String get stylesSizeScale => 'સાઇઝ સ્કેલ';

  @override
  String get stylesSizes => 'સાઇઝ';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'રંગ';

  @override
  String get stylesColor => 'રંગ';

  @override
  String get stylesFits => 'ફિટ';

  @override
  String get stylesFitsHint =>
      'રંગ અને સાઇઝ ઉપરાંત ત્રીજો વિકલ્પ, અલ્પવિરામથી અલગ.';

  @override
  String get stylesFitsExample => 'સ્લિમ, રેગ્યુલર';

  @override
  String get stylesVariants => 'વેરિઅન્ટ';

  @override
  String get stylesSaleRate => 'વેચાણ દર';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'આનાથી $count આઇટમ બનશે, દરેક રંગ અને સાઇઝ માટે એક.',
      one: 'આનાથી $count આઇટમ બનશે.',
      zero: 'સાઇઝ અને રંગ પસંદ કરો.',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'હજી કોઈ સ્ટાઇલ નથી. એક ઉમેરો અને તેના બધા રંગ-સાઇઝ એક સાથે બનશે.';

  @override
  String get stylesNoMatch => 'તમારી શોધ સાથે કોઈ સ્ટાઇલ મેળ ખાતી નથી.';

  @override
  String get stylesSearchStyles => 'ડિઝાઇન નં., નામ અથવા બ્રાન્ડથી શોધો';

  @override
  String get stylesNoStyles => 'કોઈ સ્ટાઇલ મળી નથી.';

  @override
  String get stylesChooseStyle => 'સ્ટાઇલ પસંદ કરો';

  @override
  String get stylesOtherStyle => 'બીજી સ્ટાઇલ';

  @override
  String get stylesAddBySize => 'સાઇઝ મુજબ ઉમેરો';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count પીસ ઉમેરો',
      one: '$count પીસ ઉમેરો',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'દરેક ખાનાની નીચેનો નાનો આંકડો હાથ પરનો સ્ટોક છે.';

  @override
  String get stylesStockGrid => 'રંગ અને સાઇઝ મુજબ સ્ટોક';

  @override
  String get stylesAllWarehouses => 'બધા ગોડાઉન';

  @override
  String get stylesDetails => 'સ્ટાઇલની વિગતો';

  @override
  String get stylesApplyPrices => 'આ દર દરેક સાઇઝ પર લાગુ કરો';

  @override
  String get stylesAddVariants => 'રંગ અથવા સાઇઝ ઉમેરો';

  @override
  String get stylesAddVariantsHint =>
      'નવા રંગ, સાઇઝ અથવા બંને પસંદ કરો. સ્ટાઇલમાં પહેલેથી હોય તે વેરિઅન્ટ એમ જ રહેશે.';

  @override
  String get stylesSets => 'સેટ';

  @override
  String get stylesNoSets => 'હજી કોઈ સેટ નથી.';

  @override
  String get stylesNewSet => 'નવો સેટ';

  @override
  String get stylesNewSetHint =>
      'એક રંગનો સાઇઝ પ્રમાણનો સેટ, એક એકમ તરીકે વેચાય છે. સ્ટોક તેના પીસ તરીકે ચાલે છે.';

  @override
  String get stylesRatio => 'સાઇઝના પીસ';

  @override
  String get stylesSetAsOnePiece => 'જીએસટી માટે આખા સેટને એક પીસ ગણો';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count પીસનો સેટ બનાવો',
      one: '$count પીસનો સેટ બનાવો',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'સાઇઝ સ્કેલ';

  @override
  String get stylesScaleName => 'સ્કેલનું નામ';

  @override
  String get stylesColorName => 'રંગનું નામ';

  @override
  String get stylesColorCode => 'કોડ';

  @override
  String get stylesSwatch => 'રંગ નમૂનો';

  @override
  String get stylesArchive => 'આર્કાઇવ કરો';

  @override
  String get stylesRestore => 'પાછું લાવો';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'આ ડિઝાઇન નં. બીજી સ્ટાઇલમાં પહેલેથી છે.';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'ઓછામાં ઓછો એક રંગ અને એક સાઇઝ પસંદ કરો.';

  @override
  String get stylesErrorsUnknownColor => 'આ રંગ તમારી યાદીમાં નથી.';

  @override
  String get stylesErrorsVariantMissing =>
      'આ સ્ટાઇલમાં તે રંગની તે સાઇઝ નથી. પહેલા ઉમેરો.';

  @override
  String get stylesErrorsRatioRequired =>
      'સેટમાં ઓછામાં ઓછી એક સાઇઝના પીસ લખો.';

  @override
  String get stylesErrorsPackExists => 'આ સેટ પહેલેથી છે.';

  @override
  String get stylesErrorsScaleNameTaken => 'આ નામનો સાઇઝ સ્કેલ પહેલેથી છે.';

  @override
  String get stylesErrorsColorTaken => 'આ નામ અથવા કોડનો રંગ પહેલેથી છે.';

  @override
  String get stylesErrorsSizesRequired => 'ઓછામાં ઓછી એક સાઇઝ લખો.';

  @override
  String get stylesErrorsColorCodeRequired => 'રંગનો કોડ લખો.';

  @override
  String get stylesSummaryTaxonomy => 'ડિઝાઇન';

  @override
  String get stylesSummaryCode => 'ડિઝાઇન નં.';

  @override
  String get stylesSummaryName => 'નામ';

  @override
  String get stylesSummaryBrand => 'બ્રાન્ડ';

  @override
  String get stylesSummaryCategory => 'શ્રેણી';

  @override
  String get stylesSummarySeason => 'સીઝન';

  @override
  String get stylesSummaryCollection => 'કલેક્શન';

  @override
  String get stylesSummarySizes => 'સાઇઝ';

  @override
  String get stylesSummaryColours => 'રંગ';

  @override
  String get stylesSummaryPricing => 'ભાવ અને ખર્ચ';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'માર્ક-અપ $pct%';
  }

  @override
  String get stylesSummaryCost => 'ખરીદ દર';

  @override
  String get stylesSummarySaleRate => 'વેચાણ દર';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from થી $to';
  }

  @override
  String get stylesSummaryPieces => 'સ્ટૉકમાં નંગ';

  @override
  String get stylesSummarySkus => 'રંગ અને સાઇઝની વસ્તુઓ';

  @override
  String get stylesSummaryValueAtCost => 'ખર્ચે સ્ટૉક';

  @override
  String get stylesSummaryMedia => 'ફોટો';

  @override
  String stylesSummaryPhotos(String n) {
    return '$n સાચવેલ';
  }

  @override
  String get stylesSummaryNoPhotos => 'હજુ કોઈ ફોટો નથી.';

  @override
  String get stylesSummaryManagePhotos => 'ફોટો ઉમેરો અથવા બદલો';

  @override
  String get stylesAttributes => 'સ્ટાઇલનું વર્ણન (તમારી યાદીઓમાંથી)';

  @override
  String get catalogueTitle => 'ઇમેજ કૅટલૉગ';

  @override
  String get catalogueSubtitle =>
      'દરેક ડિઝાઇન અને રંગ ફોટો, દર, સ્ટૉક અને વેચાણ સાથે. પાર્ટી માટે ડિઝાઇન પસંદ કરો, પછી પ્રિન્ટ, એક્સપોર્ટ અથવા શેર કરો.';

  @override
  String get catalogueAllColours => 'બધા રંગ';

  @override
  String get cataloguePhotos => 'ફોટા';

  @override
  String get catalogueView => 'દૃશ્ય';

  @override
  String get catalogueViewsFront => 'આગળ';

  @override
  String get catalogueViewsBack => 'પાછળ';

  @override
  String get catalogueViewsDetail => 'વિગત';

  @override
  String get catalogueViewsModel => 'મૉડેલ પર';

  @override
  String get catalogueViewsOther => 'અન્ય';

  @override
  String get catalogueUploading => 'અપલોડ થઈ રહ્યું છે…';

  @override
  String get catalogueAddPhotos => 'ફોટા ઉમેરો';

  @override
  String get cataloguePhotoHint =>
      'અપલોડ પહેલાં ફોટા આ જ ડિવાઇસ પર નાના થાય છે. ફોન પર કૅમેરાથી લઈ શકાય છે.';

  @override
  String get catalogueShownFirst => 'પહેલો દેખાય છે';

  @override
  String get catalogueShowFirst => 'પહેલો બતાવો';

  @override
  String get catalogueNoPhotos => 'હજી કોઈ ફોટો નથી.';

  @override
  String catalogueRecords(String n) {
    return 'દેખાતી ડિઝાઇન: $n';
  }

  @override
  String get catalogueTileSize => 'ટાઇલ કદ';

  @override
  String get catalogueSort => 'ક્રમ';

  @override
  String get catalogueSortsCode => 'ડિઝાઇન નં. મુજબ';

  @override
  String get catalogueSortsNewest => 'નવા પહેલાં';

  @override
  String get catalogueSortsBest => 'સૌથી વધુ વેચાયેલા';

  @override
  String get catalogueSortsPriceLow => 'ભાવ: ઓછાથી વધુ';

  @override
  String get catalogueSortsPriceHigh => 'ભાવ: વધુથી ઓછો';

  @override
  String get catalogueSortsStock => 'સૌથી વધુ સ્ટૉક';

  @override
  String catalogueCart(String n) {
    return 'કાર્ટ ($n)';
  }

  @override
  String get catalogueNoPhoto => 'ફોટો નથી';

  @override
  String catalogueStock(String n) {
    return 'સ્ટૉક: $n';
  }

  @override
  String catalogueSold(String n) {
    return '90 દિવસમાં વેચાયા: $n';
  }

  @override
  String get catalogueAdded => 'કાર્ટમાં';

  @override
  String get catalogueAdd => 'ઉમેરો';

  @override
  String get catalogueNone => 'આ ફિલ્ટર સાથે કોઈ ડિઝાઇન મળતી નથી.';

  @override
  String get cataloguePrevious => 'પાછલું';

  @override
  String get catalogueNext => 'આગળનું';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$total માંથી $from થી $to';
  }

  @override
  String get catalogueSelections => 'સાચવેલી પસંદગીઓ';

  @override
  String catalogueDesigns(String n) {
    return 'ડિઝાઇન: $n';
  }

  @override
  String get catalogueSharedBadge => 'લિંક ચાલુ';

  @override
  String get catalogueNoSelections =>
      'હજી કોઈ પસંદગી નથી. ડિઝાઇન કાર્ટમાં ઉમેરી સાચવો.';

  @override
  String get catalogueSearch => 'બારકોડ, ડિઝાઇન અથવા નામ';

  @override
  String get cataloguePriceFor => 'ભાવ કોના માટે';

  @override
  String get catalogueSaleRate => 'વેચાણ દર';

  @override
  String get catalogueInStockOnly => 'માત્ર સ્ટૉકવાળા';

  @override
  String get catalogueWithPhotoOnly => 'માત્ર ફોટોવાળા';

  @override
  String get catalogueRate => 'દર';

  @override
  String get catalogueRateFrom => 'દર થી';

  @override
  String get catalogueRateTo => 'દર સુધી';

  @override
  String get catalogueReceived => 'આ વચ્ચે આવ્યું';

  @override
  String get catalogueReceivedFrom => 'થી આવ્યું';

  @override
  String get catalogueReceivedTo => 'સુધી આવ્યું';

  @override
  String get catalogueApply => 'લાગુ કરો';

  @override
  String get catalogueBrand => 'બ્રાન્ડ';

  @override
  String get catalogueCategory => 'શ્રેણી';

  @override
  String get catalogueSeason => 'સીઝન';

  @override
  String get catalogueClear => 'ફિલ્ટર દૂર કરો';

  @override
  String catalogueDefaultName(String party) {
    return '$party માટે';
  }

  @override
  String get catalogueUntitled => 'નવી પસંદગી';

  @override
  String get catalogueCartTitle => 'કાર્ટ';

  @override
  String get catalogueCartEmpty => 'કાર્ટ ખાલી છે. ડિઝાઇન પર ઉમેરો દબાવો.';

  @override
  String get catalogueSelectionName => 'પસંદગીનું નામ';

  @override
  String get catalogueForParty => 'પાર્ટી માટે';

  @override
  String get catalogueAnyone => 'કોઈ પણ';

  @override
  String get catalogueSaveSelection => 'પસંદગી સાચવો';

  @override
  String get catalogueEmptyCart => 'કાર્ટ ખાલી કરો';

  @override
  String get catalogueColsCode => 'ડિઝાઇન નં.';

  @override
  String get catalogueColsName => 'નામ';

  @override
  String get catalogueColsSize => 'સાઇઝ';

  @override
  String get catalogueColsRate => 'દર';

  @override
  String get catalogueColsMrp => 'MRP';

  @override
  String get catalogueColsStock => 'સ્ટૉક';

  @override
  String get cataloguePrintPdf => 'પ્રિન્ટ અથવા PDF';

  @override
  String get catalogueExportExcel => 'Excel માં કાઢો';

  @override
  String get catalogueShowPrices => 'ભાવ બતાવો';

  @override
  String get catalogueShowStock => 'સ્ટૉકવાળી સાઇઝ બતાવો';

  @override
  String get catalogueDeleteConfirm =>
      'આ પસંદગી કાઢી નાખવી? શેર કરેલી લિંક બંધ થશે.';

  @override
  String get catalogueDelete => 'પસંદગી કાઢો';

  @override
  String get catalogueShareTitle => 'શેર કરો';

  @override
  String catalogueSharedUntil(String date) {
    return 'એક લિંક $date સુધી ચાલુ છે. નવી બનાવતાં જૂની બંધ થશે.';
  }

  @override
  String get catalogueShareHint =>
      'લૉગિન વગર આ કૅટલૉગ ખોલતી લિંક બનાવો, પછી કૉપિ કરો અથવા WhatsApp પર મોકલો.';

  @override
  String get catalogueLinkWorksFor => 'લિંક ચાલશે';

  @override
  String catalogueDays(String n) {
    return '$n દિવસ';
  }

  @override
  String get catalogueNewLink => 'નવી લિંક બનાવો';

  @override
  String get catalogueMakeLink => 'લિંક બનાવો';

  @override
  String get catalogueStopSharing => 'શેર બંધ કરો';

  @override
  String get catalogueLink => 'લિંક';

  @override
  String get catalogueCopied => 'લિંક કૉપિ થઈ.';

  @override
  String get catalogueCopy => 'કૉપિ';

  @override
  String get catalogueWhatsappTo => 'WhatsApp નંબર';

  @override
  String catalogueSentDemo(String to) {
    return '$to ને મોકલ્યું તરીકે નોંધાયું (ડેમો: હજી WhatsApp પ્રદાતા સેટ નથી).';
  }

  @override
  String catalogueSent(String to) {
    return '$to ને WhatsApp પર મોકલ્યું.';
  }

  @override
  String get catalogueSendWhatsapp => 'WhatsApp પર મોકલો';

  @override
  String catalogueOrderHint(String party) {
    return '$party માટે સેલ્સ ઑર્ડર બનાવવા સાઇઝ મુજબ નંગ ભરો.';
  }

  @override
  String catalogueMrp(String v) {
    return 'MRP $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'નંગ: $pieces, કર પહેલાં $value';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'કૅટલૉગ પસંદગી $name માંથી';
  }

  @override
  String get catalogueMakeOrder => 'સેલ્સ ઑર્ડર બનાવો';

  @override
  String catalogueForPartyLine(String party) {
    return '$party માટે';
  }

  @override
  String get catalogueSelectionSubtitle => 'એક કૅટલૉગ પસંદગી';

  @override
  String get catalogueLinkExpiredTitle => 'આ કૅટલૉગ હવે શેર નથી';

  @override
  String get catalogueLinkExpired =>
      'લિંકની મુદત પૂરી થઈ અથવા બદલાઈ. મોકલનાર પાસે નવી લિંક માગો.';

  @override
  String get catalogueErrorsUnknownStyle => 'તે ડિઝાઇન હવે અસ્તિત્વમાં નથી.';

  @override
  String get catalogueErrorsUnknownColor => 'આ ડિઝાઇનમાં આ રંગ નથી.';

  @override
  String get catalogueErrorsUnknownFile => 'ફોટો અપલોડ ન થયો. ફરી પ્રયાસ કરો.';

  @override
  String get catalogueErrorsFileType => 'JPEG, PNG અથવા WebP ફોટો વાપરો.';

  @override
  String get catalogueErrorsFileTooLarge => 'ફોટો બહુ મોટો છે.';

  @override
  String get catalogueErrorsFileEmpty => 'ફોટો ખાલી છે.';

  @override
  String get catalogueErrorsDuplicateImage =>
      'આ ફોટો આ ડિઝાઇન અને રંગ પર પહેલેથી છે.';

  @override
  String get catalogueErrorsNoLines => 'ઓછામાં ઓછી એક ડિઝાઇન ઉમેરો.';

  @override
  String get catalogueErrorsDuplicateLine =>
      'એક ડિઝાઇન અને રંગ યાદીમાં બે વાર છે.';

  @override
  String get catalogueErrorsUnknownAccount => 'યાદીમાંથી પાર્ટી પસંદ કરો.';

  @override
  String get catalogueErrorsInvalidDays => 'લિંક 1 થી 90 દિવસ ચાલી શકે.';

  @override
  String get catalogueErrorsShareLinkStale =>
      'તે લિંક હવે ચાલુ નથી. પહેલાં નવી લિંક બનાવો.';

  @override
  String get catalogueErrorsInvalidPhone => '10 અંકનો ભારતીય મોબાઇલ નંબર ભરો.';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp એ સંદેશ ન સ્વીકાર્યો. પછી પ્રયાસ કરો.';

  @override
  String get labelsTitle => 'બારકોડ અને ભાવ લેબલ';

  @override
  String get labelsSubtitle =>
      'લેબલ રોલ, A4 શીટ અથવા હૅંગ ટૅગ પર બારકોડ, MRP અને સાઇઝવાળા ટૅગ છાપો.';

  @override
  String get labelsSearch => 'બારકોડ સ્કૅન કરો અથવા નામ લખો';

  @override
  String get labelsWholeDesign => 'આખી ડિઝાઇન';

  @override
  String get labelsAddOneEach => 'દરેક સાઇઝનું એક';

  @override
  String get labelsAddStock => 'સ્ટૉકના દરેક નંગનું એક';

  @override
  String get labelsItem => 'વસ્તુ';

  @override
  String get labelsBarcode => 'બારકોડ';

  @override
  String get labelsMrp => 'MRP';

  @override
  String get labelsPrice => 'ભાવ';

  @override
  String get labelsLabels => 'લેબલ';

  @override
  String get labelsNoBarcode => 'નથી';

  @override
  String get labelsRemove => 'દૂર કરો';

  @override
  String get labelsEmpty =>
      'લેબલ ઉમેરવા વસ્તુ સ્કૅન કરો કે શોધો, અથવા ડિઝાઇન પસંદ કરો.';

  @override
  String get labelsStock => 'લેબલ પ્રકાર';

  @override
  String get labelsTemplatesRoll50x25 => 'રોલ, 50 x 25 mm, એક હરોળ';

  @override
  String get labelsTemplatesRoll38x25x2 => 'રોલ, 38 x 25 mm, બે હરોળ';

  @override
  String get labelsTemplatesA4x65 => 'A4 શીટ, 65 લેબલ (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'હૅંગ ટૅગ, 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'વ્યવસાયનું નામ';

  @override
  String get labelsFieldsName => 'વસ્તુનું નામ';

  @override
  String get labelsFieldsDesign => 'ડિઝાઇન નં.';

  @override
  String get labelsFieldsColourSize => 'રંગ અને સાઇઝ';

  @override
  String get labelsFieldsMrp => 'MRP';

  @override
  String get labelsFieldsPrice => 'વેચાણ ભાવ';

  @override
  String get labelsFieldsExtra => 'વધારાની લાઇન';

  @override
  String get labelsExtraText => 'વધારાની લાઇનનું લખાણ';

  @override
  String get labelsExtraHint =>
      'જેમ કે ઉત્પાદનનો મહિનો અથવા ઉત્પાદકનું સરનામું.';

  @override
  String get labelsPreview => 'મૂળ કદમાં પૂર્વાવલોકન';

  @override
  String get labelsPreviewEmpty => 'લેબલ જોવા વસ્તુ ઉમેરો.';

  @override
  String labelsPrint(String n) {
    return '$n લેબલ છાપો';
  }

  @override
  String get labelsPrintHint =>
      'પ્રિન્ટ વિન્ડો લેબલના કદમાં ખૂલે છે; લેબલ પ્રિન્ટર પસંદ કરો અને માર્જિન શૂન્ય રાખો.';

  @override
  String get labelsNothingToPrint =>
      'છાપવા માટે કંઈ નથી. ઇન્વેન્ટરીમાં લેબલ પસંદ કરો, પછી પ્રિન્ટ દબાવો.';

  @override
  String get labelsForBill => 'આ માલના લેબલ છાપો';

  @override
  String get labelsPrintLabels => 'લેબલ છાપો';

  @override
  String get shareSendWhatsApp => 'વૉટ્સએપ પર મોકલો';

  @override
  String get shareSend => 'મોકલો';

  @override
  String get shareMobile => 'મોબાઇલ નંબર';

  @override
  String shareSentTo(String to) {
    return '$to પર વૉટ્સએપ મોકલ્યું';
  }

  @override
  String get shareAgain => 'ફરી મોકલો';

  @override
  String get shareFailed => 'મોકલાયું નહીં. નંબર તપાસી ફરી પ્રયત્ન કરો.';

  @override
  String get shareAutoFailed => 'બિલ આપમેળે વૉટ્સએપ પર ન જઈ શક્યું. ફરી મોકલો.';

  @override
  String get shareRemind => 'યાદ અપાવો';

  @override
  String get shareRemindAll => 'બધા બાકીદારોને યાદ અપાવો';

  @override
  String get shareRemindAllConfirm =>
      'બાકી બિલવાળા દરેક ગ્રાહકને વૉટ્સએપ પર ચુકવણીની યાદ મોકલવી?';

  @override
  String get shareReminded => 'યાદ મોકલી';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n યાદ મોકલી',
      zero: 'કોઈ યાદ મોકલાઈ નથી',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'મોબાઇલ નંબર નથી, ફોન કરો: $names';
  }

  @override
  String get shareLogTitle => 'વૉટ્સએપ લૉગ';

  @override
  String get shareLogSubtitle =>
      'ગ્રાહકોને મોકલેલાં બધાં બિલ, ઇન્વૉઇસ, યાદ અને સંદેશ, નવાં પહેલાં.';

  @override
  String get shareFilterAll => 'બધા';

  @override
  String get shareFilterSent => 'મોકલેલા';

  @override
  String get shareFilterFailed => 'નિષ્ફળ';

  @override
  String get shareThisMonth => 'ગણતરી આ મહિનાની છે';

  @override
  String get shareWhen => 'ક્યારે';

  @override
  String get shareToCol => 'કોને';

  @override
  String get shareKind => 'પ્રકાર';

  @override
  String get shareMessage => 'સંદેશ';

  @override
  String get shareStatus => 'સ્થિતિ';

  @override
  String shareBy(String name) {
    return '$name એ મોકલ્યું';
  }

  @override
  String get shareNone =>
      'હજુ કોઈ સંદેશ નથી. વૉટ્સએપ પર મોકલેલાં બિલ, ઇન્વૉઇસ અને યાદ અહીં દેખાશે.';

  @override
  String get shareKindsBillShare => 'કાઉન્ટર બિલ';

  @override
  String get shareKindsInvoiceShare => 'ઇન્વૉઇસ';

  @override
  String get shareKindsPaymentReminderLink => 'ચુકવણીની યાદ';

  @override
  String get shareKindsPaymentReminder => 'ચુકવણીની યાદ';

  @override
  String get shareKindsOrderConfirmation => 'ઑર્ડરની પુષ્ટિ';

  @override
  String get shareKindsFollowUp => 'ફૉલો-અપ';

  @override
  String get shareExpiredTitle => 'આ લિંક હવે ચાલુ નથી';

  @override
  String get shareExpired => 'લિંકની મુદત પૂરી થઈ છે. દુકાનને ફરી મોકલવા કહો.';

  @override
  String get shareStatement => 'ખાતાનું પત્રક';

  @override
  String shareStatementFor(String name) {
    return '$nameનું ખાતાનું પત્રક';
  }

  @override
  String shareAsOf(String date) {
    return '$date સુધી';
  }

  @override
  String get shareBalance => 'બાકી રકમ';

  @override
  String shareOverdue(String amount) {
    return '₹$amount મુદત વીતી';
  }

  @override
  String get shareBill => 'બિલ';

  @override
  String get shareDate => 'તારીખ';

  @override
  String get shareDue => 'ચુકવણી તારીખ';

  @override
  String get shareLate => 'મોડું';

  @override
  String get shareAmount => 'રકમ';

  @override
  String shareDays(num n) {
    return '$n દિવસ';
  }

  @override
  String get shareNotDue => 'હજુ બાકી નથી';

  @override
  String get shareNothingOpen => 'કંઈ બાકી નથી. આભાર.';

  @override
  String shareAdvance(String amount) {
    return 'ઓછું, આગોતરું ચૂકવ્યું: ₹$amount';
  }

  @override
  String get sharePayTo => 'ચુકવણી અહીં કરો';

  @override
  String get shareStatementNote =>
      'જો તમે ચુકવણી કરી દીધી હોય તો આ પત્રક અવગણો અથવા ચુકવણીની વિગત અમને મોકલો.';

  @override
  String get shareErrorsInvalidPhone => '10 અંકનો મોબાઇલ નંબર લખો.';

  @override
  String get shareErrorsNothingOutstanding => 'કંઈ બાકી નથી.';

  @override
  String get shareErrorsSendFailed =>
      'વૉટ્સએપે સંદેશ સ્વીકાર્યો નહીં. ફરી પ્રયત્ન કરો.';

  @override
  String get shareErrorsOutside24hWindow =>
      'આ ગ્રાહકે 24 કલાકમાં સંદેશ કર્યો નથી, તેથી વૉટ્સએપને મંજૂર ટેમ્પલેટ જોઈએ. સંદેશ ટેમ્પલેટમાં તેનું મંજૂર નામ લખો.';

  @override
  String get shareErrorsBillVoid => 'આ બિલ રદ થયું છે.';

  @override
  String get shareErrorsInvoiceCancelled => 'આ ઇન્વૉઇસ રદ થયું છે.';

  @override
  String get shareErrorsUnknownTemplate =>
      'સંદેશ ટેમ્પલેટ આર્કાઇવ થયો છે. સંદેશ ટેમ્પલેટમાં તેને પાછો લાવો.';

  @override
  String get launcherTitle => 'બધાં કામ';

  @override
  String get launcherSubtitle =>
      'દરેક એન્ટ્રી, સ્ક્રીન અને રિપોર્ટ એક જગ્યાએ. તારો દબાવી ટાઇલ મારા મેનૂમાં ઉમેરો.';

  @override
  String get launcherFilter => 'કામ શોધવા લખો';

  @override
  String get launcherPin => 'મારા મેનૂમાં ઉમેરો';

  @override
  String get launcherUnpin => 'મારા મેનૂમાંથી કાઢો';

  @override
  String get launcherSaveFailed =>
      'મારું મેનૂ સાચવી શકાયું નહીં. ફરી પ્રયત્ન કરો.';

  @override
  String get launcherNoMatch => 'આની સાથે કંઈ મેળ ખાતું નથી.';

  @override
  String get launcherDone => 'થઈ ગયું';

  @override
  String get launcherEdit => 'ટાઇલ બદલો';

  @override
  String get launcherAddTiles => 'ટાઇલ ઉમેરો';

  @override
  String get launcherReset => 'મૂળ ટાઇલ પર પાછા જાઓ';

  @override
  String get launcherMoveLeft => 'પહેલાં ખસેડો';

  @override
  String get launcherMoveRight => 'પછી ખસેડો';

  @override
  String get launcherEmpty => 'હજુ કોઈ ટાઇલ નથી. બધાં કામમાંથી ઉમેરો.';

  @override
  String get launcherMyMenu => 'મારું મેનૂ';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'નમસ્તે $name. તમારી પોતાની ટાઇલ; ટાઇલ બદલોથી બદલો.';
  }

  @override
  String get launcherWaiting => 'તમારી રાહ જુએ છે';

  @override
  String get launcherSalesToday => 'આજનું વેચાણ';

  @override
  String get launcherToCollect => 'વસૂલ કરવાનું';

  @override
  String get launcherToPay => 'ચૂકવવાનું';

  @override
  String launcherOverdue(String amount) {
    return '$amount મુદત વીતી';
  }

  @override
  String get launcherFullDashboard => 'પૂરું ડૅશબોર્ડ';

  @override
  String get launcherGroupsEntries => 'નવી એન્ટ્રી';

  @override
  String get launcherGroupsPos => 'શોરૂમ કાઉન્ટર';

  @override
  String get launcherGroupsSales => 'વેચાણ';

  @override
  String get launcherGroupsPurchase => 'ખરીદી';

  @override
  String get launcherGroupsInventory => 'સ્ટૉક';

  @override
  String get launcherGroupsManufacturing => 'ઉત્પાદન અને જૉબ વર્ક';

  @override
  String get launcherGroupsAccounts => 'હિસાબ અને GST';

  @override
  String get launcherGroupsBanking => 'બૅન્કિંગ';

  @override
  String get launcherGroupsReports => 'રિપોર્ટ';

  @override
  String get launcherGroupsCrm => 'ગ્રાહકો અને વૉટ્સએપ';

  @override
  String get launcherGroupsHr => 'કર્મચારી અને પગાર';

  @override
  String get launcherGroupsExpenses => 'ખર્ચ';

  @override
  String get launcherGroupsAssets => 'સ્થિર મિલકત';

  @override
  String get launcherGroupsProjects => 'પ્રોજેક્ટ';

  @override
  String get launcherGroupsHome => 'હોમ';

  @override
  String get launcherGroupsSettings => 'સેટિંગ';

  @override
  String get launcherLaunchpad => 'લૉન્ચપૅડ';

  @override
  String launcherPinned(String n) {
    return '$n પિન કરેલા';
  }

  @override
  String get launcherRecent => 'તાજેતરમાં ખોલેલા';

  @override
  String get launcherMoney => 'આજના પૈસા';

  @override
  String launcherVsYesterday(String pct) {
    return 'ગઈકાલથી $pct%';
  }

  @override
  String launcherCounterBills(num n) {
    return '$n કાઉન્ટર બિલ';
  }

  @override
  String get launcherCashToday => 'કાઉન્ટર પર રોકડ';

  @override
  String get launcherUpiToday => 'કાઉન્ટર પર UPI';

  @override
  String get launcherCardToday => 'કાઉન્ટર પર કાર્ડ';

  @override
  String get launcherOverdueToCollect => 'મુદત વીતેલી વસૂલી';

  @override
  String get launcherAllTab => 'બધું';

  @override
  String get launcherGridView => 'ટાઇલ';

  @override
  String get launcherListView => 'યાદી';

  @override
  String get launcherOpen => 'ખોલો';

  @override
  String launcherCount(String n) {
    return '$n સ્ક્રીન અને એન્ટ્રી જે તમે ખોલી શકો';
  }

  @override
  String get menuHMasters => 'માસ્ટર';

  @override
  String get menuHTransaction => 'વ્યવહાર';

  @override
  String get menuHReports => 'રિપોર્ટ';

  @override
  String get menuHAccountReports => 'હિસાબ રિપોર્ટ';

  @override
  String get menuHPayroll => 'પગાર';

  @override
  String get menuHUtility => 'યુટિલિટી';

  @override
  String get menuHChat => 'ચૅટ';

  @override
  String get menuHExit => 'બહાર';

  @override
  String get menuSoon => 'ટૂંક સમયમાં';

  @override
  String get menuNotBuilt => 'હજુ બન્યું નથી; યાદીમાં છે.';

  @override
  String get menuFilter => 'ફિલ્ટર';

  @override
  String get menuHome => 'હોમ';

  @override
  String get menuOpenScreens => 'ખુલ્લી સ્ક્રીન';

  @override
  String get menuGAccount => 'હિસાબ';

  @override
  String get menuGStock => 'સ્ટૉક';

  @override
  String get menuGParameters => 'પેરામીટર';

  @override
  String get menuGPromotion => 'પ્રમોશન માસ્ટર';

  @override
  String get menuGSales => 'વેચાણ વ્યવહાર';

  @override
  String get menuGAccounting => 'હિસાબી વ્યવહાર';

  @override
  String get menuGPurchase => 'ખરીદ વ્યવહાર';

  @override
  String get menuGJobwork => 'જૉબવર્ક વ્યવહાર';

  @override
  String get menuGOther => 'અન્ય વ્યવહાર';

  @override
  String get menuGSalesReports => 'વેચાણ રિપોર્ટ';

  @override
  String get menuGStockReports => 'સ્ટૉક રિપોર્ટ';

  @override
  String get menuGCustomReports => 'પોતાના રિપોર્ટ અને તપાસ';

  @override
  String get menuGAccountReportsGroup => 'હિસાબ રિપોર્ટ જૂથ';

  @override
  String get menuGFinalReportGroup => 'અંતિમ રિપોર્ટ જૂથ';

  @override
  String get menuGMasterGroup => 'માસ્ટર જૂથ';

  @override
  String get menuGPayrollTransactionGroup => 'પગાર વ્યવહાર જૂથ';

  @override
  String get menuGReportGroup => 'રિપોર્ટ જૂથ';

  @override
  String get menuGUtilityGroup => 'યુટિલિટી જૂથ';

  @override
  String get menuGBarcodeGroup => 'બારકોડ જૂથ';

  @override
  String get menuGExtraUtility => 'વધારાની યુટિલિટી';

  @override
  String get menuGUserManagement => 'યૂઝર સંચાલન';

  @override
  String get menuGSoftwareUtility => 'સૉફ્ટવેર યુટિલિટી';

  @override
  String get menuGChatGroup => 'ચૅટ અને ગ્રાહકો';

  @override
  String get menuIAccountMaster => 'ખાતા માસ્ટર';

  @override
  String get menuIBankMaster => 'બૅન્ક માસ્ટર';

  @override
  String get menuIOpeningBalance => 'શરૂઆતની બાકી';

  @override
  String get menuIBalanceSheetGroup => 'બૅલેન્સ શીટ જૂથ';

  @override
  String get menuIAccountGroup => 'ખાતા જૂથ';

  @override
  String get menuIAccountCategory => 'ખાતા શ્રેણી';

  @override
  String get menuIRegionMaster => 'પ્રદેશ માસ્ટર';

  @override
  String get menuICustomerSubCategory => 'ગ્રાહક પેટા શ્રેણી';

  @override
  String get menuIRemarksMaster => 'ટિપ્પણી માસ્ટર';

  @override
  String get menuICompanyMaster => 'કંપની માસ્ટર';

  @override
  String get menuICountryMaster => 'દેશ માસ્ટર';

  @override
  String get menuIDepartmentMaster => 'વિભાગ માસ્ટર';

  @override
  String get menuIManufactureCompany => 'ઉત્પાદક કંપની';

  @override
  String get menuIBrandMaster => 'બ્રાન્ડ માસ્ટર';

  @override
  String get menuIProductMaster => 'ઉત્પાદન માસ્ટર';

  @override
  String get menuIStyleMaster => 'સ્ટાઇલ માસ્ટર';

  @override
  String get menuIItemGroup => 'વસ્તુ જૂથ';

  @override
  String get menuIItemMaster => 'વસ્તુ માસ્ટર';

  @override
  String get menuIDesignMaster => 'ડિઝાઇન માસ્ટર';

  @override
  String get menuIColorMaster => 'રંગ માસ્ટર';

  @override
  String get menuISizeGroupMaster => 'સાઇઝ જૂથ માસ્ટર';

  @override
  String get menuISizeMaster => 'સાઇઝ માસ્ટર';

  @override
  String get menuIFabric => 'કાપડ';

  @override
  String get menuISleeves => 'બાંય';

  @override
  String get menuINeck => 'ગળું';

  @override
  String get menuIFit => 'ફિટ';

  @override
  String get menuISeason => 'સીઝન';

  @override
  String get menuIStyleAttr => 'સ્ટાઇલ';

  @override
  String get menuIGender => 'જાતિ';

  @override
  String get menuITypeMaster => 'પ્રકાર માસ્ટર';

  @override
  String get menuISubCategory9 => 'પેટા શ્રેણી 9';

  @override
  String get menuISubCategory10 => 'પેટા શ્રેણી 10';

  @override
  String get menuIMaterialMaster => 'મટીરિયલ માસ્ટર';

  @override
  String get menuIFixedBarcode => 'સ્થિર બારકોડ';

  @override
  String get menuIMinMaxStock => 'ન્યૂનતમ મહત્તમ સ્ટૉક';

  @override
  String get menuIOpeningStock => 'શરૂઆતનો સ્ટૉક';

  @override
  String get menuISeasonMaster => 'સીઝન માસ્ટર';

  @override
  String get menuIProcessMaster => 'પ્રક્રિયા માસ્ટર';

  @override
  String get menuIOrderType => 'ઑર્ડર પ્રકાર';

  @override
  String get menuIWarehouses => 'ગોડાઉન અને સ્ટોર';

  @override
  String get menuIDayBookMaster => 'ડેબુક માસ્ટર';

  @override
  String get menuILedgerParameter => 'ખાતા પેરામીટર';

  @override
  String get menuISalesmanMaster => 'સેલ્સમેન માસ્ટર';

  @override
  String get menuITaxMaster => 'ટૅક્સ માસ્ટર';

  @override
  String get menuITdsMaster => 'TDS માસ્ટર';

  @override
  String get menuITcsTaxMaster => 'TCS ટૅક્સ માસ્ટર';

  @override
  String get menuIFinanceYearMaster => 'નાણાકીય વર્ષ માસ્ટર';

  @override
  String get menuIHsnCodeMaster => 'HSN કોડ માસ્ટર';

  @override
  String get menuISalesReturnReason => 'વેચાણ પરત કારણ';

  @override
  String get menuISalesmanCommTarget => 'સેલ્સમેન કમિશન લક્ષ્ય';

  @override
  String get menuIItemDiscountSetup => 'વસ્તુ છૂટ સેટઅપ';

  @override
  String get menuIPromoMaster => 'પ્રોમો માસ્ટર';

  @override
  String get menuISisSetup => 'SIS સેટઅપ';

  @override
  String get menuIItemCommissionSetup => 'વસ્તુ કમિશન સેટઅપ';

  @override
  String get menuISourceMaster => 'સ્રોત માસ્ટર';

  @override
  String get menuISalesOrderWh => 'વેચાણ ઑર્ડર (જથ્થાબંધ)';

  @override
  String get menuIWhSalesOrderCancel => 'જથ્થાબંધ ઑર્ડર રદ';

  @override
  String get menuIDeliveryOrder => 'ડિલિવરી ઑર્ડર (D.O)';

  @override
  String get menuIDeliveryChallan => 'ડિલિવરી ચલણ';

  @override
  String get menuISalesBillWh => 'વેચાણ બિલ (જથ્થાબંધ)';

  @override
  String get menuIDeliveryChallanReturnWh => 'ડિલિવરી ચલણ પરત (જથ્થાબંધ)';

  @override
  String get menuICreditNoteWh => 'ક્રેડિટ નોટ (જથ્થાબંધ)';

  @override
  String get menuIAdvanceReceipt => 'આગોતરી રસીદ';

  @override
  String get menuICashPayRec => 'રોકડ ચુકવણી/જમા';

  @override
  String get menuIBankPayRec => 'બૅન્ક ચુકવણી/જમા';

  @override
  String get menuIBillWiseReceipt => 'બિલ મુજબ રસીદ';

  @override
  String get menuICardReceipt => 'કાર્ડ રસીદ';

  @override
  String get menuIJournalVoucher => 'જર્નલ વાઉચર';

  @override
  String get menuIContraVoucher => 'કૉન્ટ્રા વાઉચર';

  @override
  String get menuIPurchaseOrder => 'ખરીદ ઑર્ડર';

  @override
  String get menuIInwardChallan => 'ઇનવર્ડ ચલણ';

  @override
  String get menuIPurchase => 'ખરીદી';

  @override
  String get menuIGoodsReturn => 'માલ પરત';

  @override
  String get menuIDebitNote => 'ડેબિટ નોટ';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'જૉબ ઇશ્યૂ';

  @override
  String get menuIJobReceipt => 'જૉબ રસીદ';

  @override
  String get menuIJobWorkIssue => 'જૉબવર્ક ઇશ્યૂ';

  @override
  String get menuIJobWorkReceipt => 'જૉબવર્ક રસીદ';

  @override
  String get menuIStockAdjustment => 'સ્ટૉક સમાયોજન';

  @override
  String get menuISampleIssue => 'નમૂનો ઇશ્યૂ';

  @override
  String get menuISampleReceive => 'નમૂનો પ્રાપ્તિ';

  @override
  String get menuIQuotation => 'ક્વોટેશન';

  @override
  String get menuILrTransportEntry => 'LR/પરિવહન એન્ટ્રી';

  @override
  String get menuIEWayBill => 'ઈ-વે બિલ';

  @override
  String get menuIRePackingBox => 'રીપૅકિંગ બૉક્સ';

  @override
  String get menuIReOpenBox => 'બૉક્સ ફરી ખોલો';

  @override
  String get menuILedgerReport => 'ખાતાવહી રિપોર્ટ';

  @override
  String get menuICashBookReport => 'રોકડ મેળ રિપોર્ટ';

  @override
  String get menuIBankReport => 'બૅન્ક રિપોર્ટ';

  @override
  String get menuIBankReconciliation => 'બૅન્ક મેળવણી';

  @override
  String get menuIGroupMonthSummary => 'જૂથ/મહિના સારાંશ';

  @override
  String get menuICashBankExpense => 'રોકડ બૅન્ક ખર્ચ';

  @override
  String get menuICashFlowReportGroup => 'રોકડ પ્રવાહ રિપોર્ટ';

  @override
  String get menuIBillToBillAdjustment => 'બિલ થી બિલ સમાયોજન';

  @override
  String get menuIMsmeReport => 'MSME રિપોર્ટ';

  @override
  String get menuIOutstandingPayable => 'બાકી ચૂકવવાપાત્ર';

  @override
  String get menuIOutstandingReceivable => 'બાકી લેણું';

  @override
  String get menuIDebtorsList => 'દેવાદાર યાદી';

  @override
  String get menuICreditorList => 'લેણદાર યાદી';

  @override
  String get menuIInterestReport => 'વ્યાજ રિપોર્ટ';

  @override
  String get menuIDepreciationAssetReport => 'ઘસારો મિલકત રિપોર્ટ';

  @override
  String get menuIJournalVoucherReport => 'જર્નલ વાઉચર રિપોર્ટ';

  @override
  String get menuIGstReport => 'GST રિપોર્ટ';

  @override
  String get menuITdsReport => 'TDS રિપોર્ટ';

  @override
  String get menuITdsForm26q => 'TDS ફૉર્મ 26Q';

  @override
  String get menuIFinalReport => 'અંતિમ રિપોર્ટ';

  @override
  String get menuIRcmRegister => 'RCM રજિસ્ટર';

  @override
  String get menuITcsReport => 'TCS રિપોર્ટ';

  @override
  String get menuIEmployee => 'કર્મચારી';

  @override
  String get menuIEmployeeKyc => 'કર્મચારી KYC અપડેટ';

  @override
  String get menuISalaryDeduction => 'પગાર કપાત';

  @override
  String get menuIWeekOff => 'સાપ્તાહિક રજા';

  @override
  String get menuIWeekOffCancel => 'સાપ્તાહિક રજા રદ';

  @override
  String get menuIHolidays => 'રજાઓ';

  @override
  String get menuIDesignation => 'હોદ્દો';

  @override
  String get menuIDepartment => 'વિભાગ';

  @override
  String get menuIShiftMaster => 'શિફ્ટ માસ્ટર';

  @override
  String get menuIDailyAttendance => 'દૈનિક હાજરી';

  @override
  String get menuILeaveApplication => 'રજા અરજી';

  @override
  String get menuIAdvanceSalary => 'આગોતરો પગાર (ઉપાડ)';

  @override
  String get menuILoanIssue => 'લોન આપવી';

  @override
  String get menuILoanReceipt => 'લોન વસૂલી';

  @override
  String get menuIMonthlySalary => 'માસિક પગાર';

  @override
  String get menuIStipend => 'સ્ટાઇપેન્ડ';

  @override
  String get menuISalaryPayment => 'પગાર ચુકવણી';

  @override
  String get menuIStipendPayment => 'સ્ટાઇપેન્ડ ચુકવણી';

  @override
  String get menuIIncentive => 'પ્રોત્સાહન';

  @override
  String get menuIOtherDeduction => 'અન્ય કપાત';

  @override
  String get menuIAdvanceLoanRequest => 'આગોતરો અને લોન વિનંતી';

  @override
  String get menuIMonthlyAttendanceRegister => 'માસિક હાજરી રજિસ્ટર';

  @override
  String get menuIDayWiseAttendanceRegister => 'દિવસ મુજબ હાજરી રજિસ્ટર';

  @override
  String get menuISalarySlipRegister => 'પગાર સ્લિપ રજિસ્ટર';

  @override
  String get menuIPtReport => 'PT રિપોર્ટ';

  @override
  String get menuILeaveReport => 'રજા રિપોર્ટ';

  @override
  String get menuIMenuLogSessionReport => 'મેનૂ લૉગ સત્ર રિપોર્ટ';

  @override
  String get menuIPayrollParameter => 'પગાર પેરામીટર';

  @override
  String get menuIDeviceSettings => 'ડિવાઇસ સેટિંગ';

  @override
  String get menuIBarcodePrint => 'બારકોડ પ્રિન્ટ';

  @override
  String get menuIBarcodeSearch => 'બારકોડ શોધ';

  @override
  String get menuIBarcodeDesignImage => 'બારકોડ/ડિઝાઇન ફોટો';

  @override
  String get menuIRateUpdation => 'દર અપડેટ';

  @override
  String get menuIImageCatalogue => 'ફોટો કૅટલોગ';

  @override
  String get menuISalesDiscountMaster => 'વેચાણ છૂટ માસ્ટર';

  @override
  String get menuISalesDiscountDesignWise => 'ડિઝાઇન મુજબ વેચાણ છૂટ';

  @override
  String get menuISalesmanCommission => 'સેલ્સમેન કમિશન';

  @override
  String get menuIDayClose => 'દિવસ બંધ';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'ઈમેલ';

  @override
  String get menuIBulkMessenger => 'બલ્ક મેસેન્જર';

  @override
  String get menuILogHistoryReport => 'લૉગ ઇતિહાસ રિપોર્ટ';

  @override
  String get menuIOutstandingAdj => 'બાકી સમાયોજન';

  @override
  String get menuIResetPhysicalStock => 'ભૌતિક સ્ટૉક રીસેટ';

  @override
  String get menuIPhysicalStockVerification => 'ભૌતિક સ્ટૉક ચકાસણી';

  @override
  String get menuIMerge => 'મર્જ';

  @override
  String get menuISalesStockLedgerDiff => 'વેચાણ સ્ટૉક ખાતા ફરક';

  @override
  String get menuINoteReport => 'નોંધ રિપોર્ટ';

  @override
  String get menuIEInvoiceUpload => 'ઈ-ઇન્વૉઇસ અપલોડ';

  @override
  String get menuIEWayBillUpload => 'ઈ-વે બિલ અપલોડ';

  @override
  String get menuIAutoOutstandingReminder => 'આપમેળે બાકી યાદ';

  @override
  String get menuIUsers => 'યૂઝર';

  @override
  String get menuIUserGroup => 'યૂઝર જૂથ';

  @override
  String get menuICurrentDateSetting => 'હાલની તારીખ સેટિંગ';

  @override
  String get menuIDataLockTillDate => 'તારીખ સુધી ડેટા લૉક';

  @override
  String get menuIMyDevices => 'મારાં ડિવાઇસ';

  @override
  String get menuILedgerStockPosting => 'ખાતા અને સ્ટૉક પોસ્ટિંગ';

  @override
  String get menuIReportType => 'રિપોર્ટ પ્રકાર';

  @override
  String get menuIUserParameter => 'યૂઝર પેરામીટર';

  @override
  String get menuIBalanceTransfer => 'બાકી ટ્રાન્સફર';

  @override
  String get menuIDatabaseBackup => 'ડેટાબેઝ બૅકઅપ';

  @override
  String get menuISoftwareUpdate => 'સૉફ્ટવેર અપડેટ';

  @override
  String get menuIDbUpdates => 'DB અપડેટ';

  @override
  String get menuIScheduleBackup => 'બૅકઅપ સમય નક્કી';

  @override
  String get menuIExportVouchersPdf => 'વાઉચર PDF માં કાઢો';

  @override
  String get menuIEmployeeDepartment => 'વિભાગ';

  @override
  String get menuISensitiveChanges => 'સંવેદનશીલ ફેરફારો';

  @override
  String get menuITransporterMaster => 'ટ્રાન્સપોર્ટર માસ્ટર';

  @override
  String get listsSubtitle =>
      'આ વ્યવસાયની પોતાની યાદી. એન્ટ્રી કાઢવાને બદલે આર્કાઇવ કરો, જેથી જૂના દસ્તાવેજોમાં તેનું મૂલ્ય રહે.';

  @override
  String get listsName => 'નામ';

  @override
  String get listsCode => 'કોડ';

  @override
  String get listsNote => 'નોંધ';

  @override
  String get listsNewEntry => 'નવી એન્ટ્રી';

  @override
  String listsShowArchived(String n) {
    return 'આર્કાઇવ કરેલી બતાવો ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n એન્ટ્રી',
      one: '$n એન્ટ્રી',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'આર્કાઇવ કરો';

  @override
  String get listsRestore => 'પાછી લાવો';

  @override
  String get listsNoMatch => 'શોધ સાથે કોઈ એન્ટ્રી મેળ ખાતી નથી.';

  @override
  String get listsEmpty =>
      'આ યાદીમાં હજી કંઈ નથી. પહેલી એન્ટ્રી ઉપરની લાઇનમાં લખો.';

  @override
  String get listsEmptyReadOnly => 'આ યાદીમાં હજી કંઈ નથી.';

  @override
  String get listsOtherLists => 'યાદીઓ';

  @override
  String get listsErrorsLookupTaken => 'આ યાદીમાં આ નામની એન્ટ્રી પહેલેથી છે.';

  @override
  String get listsErrorsEndBeforeStart =>
      'અંતિમ તારીખ શરૂઆતની તારીખ પહેલાંની છે.';

  @override
  String get limitsTitle => 'ન્યૂનતમ અને મહત્તમ સ્ટોક';

  @override
  String get limitsSubtitle =>
      'દરેક માલનો જથ્થો ગોડાઉનમાં ઓછામાં ઓછો અને વધુમાં વધુ કેટલો રહે તે નક્કી કરો. ન્યૂનતમથી નીચેના માલ પર નિશાન લાગે છે, જેથી શું મંગાવવું તે ખબર પડે.';

  @override
  String get limitsWarehouse => 'ગોડાઉન';

  @override
  String limitsOnlyBelow(String n) {
    return 'ફક્ત ન્યૂનતમથી નીચે ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n પંક્તિઓ સાચવી',
      one: '$n પંક્તિ સાચવી',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return '$n બદલાયેલી પંક્તિઓ સાચવો';
  }

  @override
  String get limitsItem => 'માલ';

  @override
  String get limitsInStock => 'સ્ટોકમાં';

  @override
  String get limitsMin => 'ન્યૂનતમ';

  @override
  String get limitsMax => 'મહત્તમ';

  @override
  String get limitsToOrder => 'મંગાવવાનું';

  @override
  String get limitsBelow => 'ન્યૂનતમથી નીચે';

  @override
  String get limitsNoMatch => 'કોઈ માલ મેળ ખાતો નથી.';

  @override
  String get limitsEmpty =>
      'હજી કોઈ માલ નથી. પહેલા માલ અથવા સ્ટાઇલ ઉમેરો, પછી અહીં મર્યાદા નક્કી કરો.';

  @override
  String get limitsErrorsMaxBelowMin => 'મહત્તમ ન્યૂનતમથી ઓછું ન હોઈ શકે.';

  @override
  String get billReceiptTitleReceivable => 'બિલ મુજબ રસીદ';

  @override
  String get billReceiptTitlePayable => 'બિલ મુજબ ચુકવણી';

  @override
  String get billReceiptSubtitleReceivable =>
      'મળેલી રકમ નોંધો અને તે કયા બિલોની છે તે પસંદ કરો. બાકી રકમ ખાતામાં રહે છે અને સૌથી જૂના બિલ ચૂકવે છે.';

  @override
  String get billReceiptSubtitlePayable =>
      'સપ્લાયરને કરેલી ચુકવણી નોંધો અને તે કયા બિલોની છે તે પસંદ કરો. બાકી રકમ ખાતામાં રહે છે અને સૌથી જૂના બિલ ચૂકવે છે.';

  @override
  String get billReceiptTabReceipt => 'રસીદ';

  @override
  String get billReceiptTabPayment => 'ચુકવણી';

  @override
  String get billReceiptCustomer => 'ગ્રાહક';

  @override
  String get billReceiptSupplier => 'સપ્લાયર';

  @override
  String get billReceiptChoose => 'પક્ષ પસંદ કરો';

  @override
  String get billReceiptAccount => 'રોકડ અથવા બેંક ખાતું';

  @override
  String get billReceiptAmountReceived => 'મળેલી રકમ';

  @override
  String get billReceiptAmountPaid => 'ચૂકવેલી રકમ';

  @override
  String get billReceiptReference => 'સંદર્ભ (ચેક, UPI આઈડી)';

  @override
  String get billReceiptOpenBills => 'બાકી બિલ';

  @override
  String billReceiptAdvance(String amount) {
    return 'પહેલેથી ખાતામાં: $amount';
  }

  @override
  String get billReceiptFillOldest => 'સૌથી જૂનાથી ભરો';

  @override
  String get billReceiptClear => 'સાફ કરો';

  @override
  String get billReceiptBill => 'બિલ';

  @override
  String get billReceiptDueOn => 'ચુકવણી તારીખ';

  @override
  String get billReceiptPending => 'બાકી';

  @override
  String get billReceiptPayNow => 'હમણાં ચૂકવો';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n દિવસ મોડું',
      one: '$n દિવસ મોડું',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'આ પક્ષનું કોઈ બાકી બિલ નથી.';

  @override
  String get billReceiptOnBills => 'બિલો પર';

  @override
  String get billReceiptOnAccount => 'ખાતામાં';

  @override
  String get billReceiptSaveReceipt => 'રસીદ સાચવો';

  @override
  String get billReceiptSavePayment => 'ચુકવણી સાચવો';

  @override
  String billReceiptSaved(String number) {
    return '$number તરીકે સાચવ્યું';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'બિલોની કુલ રકમ આપેલી રકમ કરતાં વધુ છે.';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'આમાંથી એક બિલ હવે બાકી નથી. પેજ ફરી ખોલીને ફરી પ્રયાસ કરો.';

  @override
  String get billReceiptErrorsOverBill => 'એક રકમ બિલની બાકી રકમ કરતાં વધુ છે.';

  @override
  String get billReceiptErrorsAmountRequired => 'રકમ દાખલ કરો.';

  @override
  String get billReceiptErrorsBillTwice => 'એ જ બિલ બે વાર છે.';

  @override
  String get booksTitle => 'ખાતાવહી';

  @override
  String get booksSubtitle =>
      'રોકડ અને બેંકની હિલચાલ, કોઈ જૂથની મહિના મુજબ સ્થિતિ, રોકડ અને બેંકમાંથી થયેલો ખર્ચ, અને પૈસા ક્યાંથી આવ્યા ને ક્યાં ગયા.';

  @override
  String get booksCash => 'રોકડ વહી';

  @override
  String get booksBank => 'બેંક વહી';

  @override
  String get booksGroup => 'જૂથ મહિના મુજબ';

  @override
  String get booksExpense => 'રોકડ અને બેંક ખર્ચ';

  @override
  String get booksFlow => 'રોકડ પ્રવાહ';

  @override
  String get booksShow => 'બતાવો';

  @override
  String get booksPickGroup => 'ખાતા જૂથ';

  @override
  String get booksOpening => 'શરૂઆતની બાકી';

  @override
  String get booksReceipts => 'જમા';

  @override
  String get booksPayments => 'ચૂકવણી';

  @override
  String get booksClosing => 'અંતિમ બાકી';

  @override
  String get booksAccounts => 'ખાતાં';

  @override
  String get booksByDay => 'દિવસ મુજબ';

  @override
  String get booksMonth => 'મહિનો';

  @override
  String get booksDebit => 'ઉધાર';

  @override
  String get booksCredit => 'જમા';

  @override
  String get booksExpenseAccount => 'ખર્ચ ખાતું';

  @override
  String get booksVouchers => 'વાઉચર';

  @override
  String get booksOtherSide => 'એન્ટ્રીની બીજી બાજુ';

  @override
  String get booksMoneyIn => 'આવેલા પૈસા';

  @override
  String get booksMoneyOut => 'ગયેલા પૈસા';

  @override
  String get booksNet => 'ચોખ્ખું';

  @override
  String get booksTotal => 'કુલ';

  @override
  String get booksEmpty => 'આ સમયગાળામાં કંઈ નથી.';

  @override
  String get booksNoAccounts => 'આ જૂથમાં હજી કોઈ ખાતું નથી.';

  @override
  String get booksRcm => 'આરસીએમ રજિસ્ટર';

  @override
  String get booksAdjust => 'બિલ થી બિલ સમાયોજન';

  @override
  String get booksVoucher => 'વાઉચર';

  @override
  String get booksBill => 'પતાવેલું બિલ';

  @override
  String get booksParty => 'પક્ષ';

  @override
  String get booksAmount => 'રકમ';

  @override
  String get booksSupplier => 'સપ્લાયર';

  @override
  String get booksInvoice => 'સપ્લાયરનું બિલ';

  @override
  String get booksTaxable => 'કરપાત્ર';

  @override
  String get booksCgst => 'સીજીએસટી';

  @override
  String get booksSgst => 'એસજીએસટી / યુટીજીએસટી';

  @override
  String get booksIgst => 'આઈજીએસટી';

  @override
  String get booksCess => 'ઉપકર';

  @override
  String get hubReportsTitle => 'રિપોર્ટ';

  @override
  String get hubReportsSubtitle =>
      'દરેક રિપોર્ટ એક જગ્યાએ, તે કયા પ્રશ્નનો જવાબ આપે છે તે મુજબ.';

  @override
  String get hubMastersTitle => 'માસ્ટર';

  @override
  String get hubMastersSubtitle =>
      'દરેક બિલ અને વાઉચર જેના પર આધાર રાખે છે તે રેકોર્ડ: તમે શું વેચો છો, કોની સાથે વ્યવહાર કરો છો, ભાવ અને નિયમ, સ્ટોર અને કાઉન્ટર.';

  @override
  String get hubGroupsMerchandise => 'માલ';

  @override
  String get hubGroupsParties => 'પાર્ટી અને લોકો';

  @override
  String get hubGroupsCommercial => 'ભાવ, ઑફર અને ટૅક્સ';

  @override
  String get hubGroupsOperational => 'સ્ટોર, કાઉન્ટર અને નિયમ';

  @override
  String get hubGroupsSales => 'વેચાણ';

  @override
  String get hubGroupsStock => 'સ્ટૉક';

  @override
  String get hubGroupsAccounts => 'હિસાબ રિપોર્ટ';

  @override
  String get hubGroupsTax => 'ટૅક્સ અને વૈધાનિક';

  @override
  String get hubGroupsAudit => 'તપાસ અને ઑડિટ';

  @override
  String get hubGroupsCustom => 'તમારા પોતાના રિપોર્ટ';

  @override
  String get hubAboutMerchandise => 'ડિઝાઇન, સાઇઝ, રંગ અને ફોટો';

  @override
  String get hubAboutParties => 'ગ્રાહકો, સપ્લાયર અને દરેક ખાતું; કર્મચારી';

  @override
  String get hubAboutCommercial =>
      'વસ્તુઓ કયા ભાવે વેચાય છે અને કયો GST લાગે છે';

  @override
  String get hubAboutOperational =>
      'સ્ટૉક ક્યાં રહે છે અને કાઉન્ટર તથા નંબર કેવી રીતે ચાલે છે';

  @override
  String get hubAboutSales => 'શું વેચાયું, ક્યાં અને કોને';

  @override
  String get hubAboutStock => 'છાજલી પર શું છે અને કેટલા દિવસથી પડ્યું છે';

  @override
  String get hubAboutAccounts => 'કોનું કેટલું બાકી, નફો અને હિસાબ';

  @override
  String get hubAboutTax => 'GST રિટર્ન, પગાર વૈધાનિક અને ટૅક્સ ઘસારો';

  @override
  String get hubAboutAudit => 'જોવા જેવી ગડબડ અને કોણે શું બદલ્યું';

  @override
  String get hubAboutCustom => 'પોતાના રિપોર્ટ બનાવો, સાચવો અને સમય નક્કી કરો';

  @override
  String get exchangeOpen => 'પરત અથવા બદલી';

  @override
  String get exchangeTitle => 'આ બિલ પર પાછો આવેલો માલ';

  @override
  String exchangeTaking(num pieces, String number) {
    return '$number માંથી $pieces નંગ પરત';
  }

  @override
  String get exchangeCredit => 'ક્રેડિટ';

  @override
  String get exchangeAdd => 'આ બિલ પર પરત લો';

  @override
  String exchangeCreditUsed(String number) {
    return '$number સામે પરત';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount ક્રેડિટ બાકી છે; તે સ્ટોર ક્રેડિટ રહેશે.';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'પરત $number એ આ બિલમાંથી $amount ઘટાડ્યા.';
  }

  @override
  String exchangeLeftCode(String amount) {
    return '$amount નું સ્ટોર ક્રેડિટ બાકી, કોડ:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'પરત (બિલ $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'સ્ટોર ક્રેડિટ $amount, કોડ $code';
  }

  @override
  String get inwardTransporter => 'ટ્રાન્સપોર્ટર';

  @override
  String get inwardLrNumber => 'LR નંબર';

  @override
  String get inwardLrDate => 'LR તારીખ';

  @override
  String get inwardMarkup => 'માર્ક-અપ %';

  @override
  String get inwardMarkupHint => 'ખર્ચ પરથી MRP ભરે છે';

  @override
  String get inwardRounding => 'MRP ગોળ કરો';

  @override
  String get inwardRound1 => 'નજીકનો રૂપિયો';

  @override
  String get inwardRound9 => '9 પર અંત (1,299)';

  @override
  String get inwardRound10 => 'આગળના 10';

  @override
  String get inwardRound50 => 'આગળના 50';

  @override
  String get inwardCost => 'ખર્ચ';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'માર્ક-અપ';

  @override
  String get inwardMarkupTitle => 'ખર્ચ પર MRP, ખર્ચના %';

  @override
  String get inwardMarginCol => 'માર્જિન';

  @override
  String get inwardMarginTitle => 'MRP થી ખર્ચ સુધી ઘટ, MRP ના %';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces નંગ, ખર્ચ $value';
  }

  @override
  String get inwardLastPurchases => 'છેલ્લી ખરીદી';

  @override
  String get inwardPickLine => 'પહેલાંનો ખર્ચ જોવા કોઈ લાઇન પસંદ કરો.';

  @override
  String get inwardCurrentMrp => 'હાલનો MRP';

  @override
  String get inwardInStock => 'સ્ટૉકમાં';

  @override
  String get inwardDate => 'તારીખ';

  @override
  String get inwardNeverBought => 'પહેલાં ખરીદ્યું નથી.';

  @override
  String get inwardPrintLabels => 'આ નંગના લેબલ છાપો';

  @override
  String get inwardDocument => 'ચલણ';

  @override
  String get inwardState => 'રાજ્ય';

  @override
  String get inwardTransport => 'પરિવહન';

  @override
  String get inwardSizeCurve => 'સાઇઝ મુજબ નંગ';

  @override
  String get inwardTotalQty => 'નંગ';

  @override
  String get inwardAtCost => 'ખર્ચે';

  @override
  String get inwardAvgMarkup => 'માર્ક-અપ';

  @override
  String get countsTitle => 'સ્ટૉક ગણતરી';

  @override
  String get countsSubtitle =>
      'બારકોડ સ્કૅન કરી સ્ટોર ગણો. મંજૂર કરનાર ફરક અને તેનું મૂલ્ય જુએ છે, અને મંજૂરીથી હિસાબ સુધરે છે.';

  @override
  String get countsWholeStore => 'આખો સ્ટોર';

  @override
  String get countsWhat => 'શું ગણવું';

  @override
  String get countsByAll => 'સ્ટોરનો બધો માલ';

  @override
  String get countsByBrand => 'એક બ્રાન્ડ';

  @override
  String get countsByCategory => 'એક શ્રેણી';

  @override
  String get countsByStyleId => 'એક ડિઝાઇન';

  @override
  String get countsName => 'નામ';

  @override
  String get countsNamePlaceholder => 'દા.ત. કુર્તા દીવાલ';

  @override
  String get countsBlind => 'અંધ ગણતરી (ગણનાર હિસાબના આંકડા જોતા નથી)';

  @override
  String get countsBlindShort => 'અંધ ગણતરી';

  @override
  String get countsStart => 'ગણતરી શરૂ કરો';

  @override
  String get countsScanHere => 'બારકોડ સ્કૅન કરો';

  @override
  String get countsAdd => 'ઉમેરો';

  @override
  String get countsScanHint =>
      'દરેક સ્કૅન એક નંગ ઉમેરે છે. પાંચ માટે 5*બારકોડ લખો, અથવા નીચેના કોષ્ટકમાં સંખ્યા લખો.';

  @override
  String get countsOutOfScope => 'આ ગણતરીમાં નહોતું, ઉમેર્યું';

  @override
  String get countsStatusCounting => 'ગણતરી ચાલુ છે';

  @override
  String get countsStatusSubmitted => 'મંજૂરીની રાહ';

  @override
  String get countsStatusApproved => 'મંજૂર, હિસાબ સુધાર્યો';

  @override
  String get countsStatusCancelled => 'રદ';

  @override
  String get countsJournal => 'સ્ટૉક સમાયોજન જુઓ';

  @override
  String get countsPiecesCounted => 'ગણેલા નંગ';

  @override
  String get countsItemsCounted => 'ગણેલી વસ્તુઓ';

  @override
  String get countsInBooks => 'હિસાબમાં';

  @override
  String get countsShort => 'ઓછું (મૂલ્ય)';

  @override
  String get countsExcess => 'વધારે (મૂલ્ય)';

  @override
  String get countsNet => 'ચોખ્ખો ફરક';

  @override
  String get countsBlindNote => 'અંધ ગણતરી: સબમિટ પછી હિસાબના આંકડા દેખાશે.';

  @override
  String get countsSubmit => 'ગણતરી પૂરી કરો';

  @override
  String get countsReason => 'ફરકનું કારણ';

  @override
  String countsApproveAdjust(num n) {
    return 'મંજૂર કરો અને $n વસ્તુ સુધારો';
  }

  @override
  String get countsApproveNone => 'મંજૂર કરો (કોઈ ફરક નથી)';

  @override
  String get countsRecount => 'ફરી ગણવા પાછું મોકલો';

  @override
  String get countsWaitingApproval => 'માલિક અથવા એડમિન ફરક મંજૂર કરે છે.';

  @override
  String get countsCancelConfirm =>
      'આ ગણતરી રદ કરવી? હિસાબમાં કંઈ બદલાશે નહીં.';

  @override
  String get countsCancel => 'ગણતરી રદ કરો';

  @override
  String get countsOnlyDiff => 'ફક્ત ફરકવાળી વસ્તુઓ બતાવો';

  @override
  String get countsItem => 'વસ્તુ';

  @override
  String get countsCounted => 'ગણ્યું';

  @override
  String get countsDiff => 'ફરક';

  @override
  String get countsValue => 'મૂલ્ય';

  @override
  String get countsNoDiff => 'હિસાબથી કંઈ અલગ નથી.';

  @override
  String get countsNumber => 'ગણતરી';

  @override
  String get countsStarted => 'શરૂ';

  @override
  String get countsState => 'સ્થિતિ';

  @override
  String get countsNone => 'હજુ કોઈ ગણતરી નથી.';

  @override
  String get countsErrorsCountClosed => 'આ ગણતરી હવે ખુલ્લી નથી.';

  @override
  String get countsErrorsCountNotSubmitted => 'પહેલાં ગણતરી પૂરી કરો.';

  @override
  String get countsErrorsReasonRequired => 'ફરકનું કારણ લખો.';

  @override
  String get countsErrorsUnknownBarcode => 'આ બારકોડની કોઈ વસ્તુ નથી.';

  @override
  String get countsErrorsNothingToCount =>
      'તે પસંદગી સાથે કોઈ માલ મેળ ખાતો નથી.';

  @override
  String get countsErrorsUnknownWarehouse => 'સ્ટોર પસંદ કરો.';

  @override
  String get countsErrorsTooManyCodes =>
      'ફાઇલમાં 5,000 થી વધુ અલગ બારકોડ છે. તેને વહેંચીને ભાગોમાં આયાત કરો.';

  @override
  String get countsImportTitle => 'સ્કેનર ફાઇલ આયાત કરો';

  @override
  String get countsImportHelp =>
      'હેન્ડહેલ્ડ સ્કેનરની ટેક્સ્ટ ફાઇલ: દરેક લાઇનમાં એક બારકોડ, અથવા બારકોડ અને જથ્થો (\"8901234567890,3\"). ફરી આવેલા બારકોડનો સરવાળો થાય છે.';

  @override
  String get countsImportMode => 'સંખ્યાઓનું શું કરવું';

  @override
  String get countsImportAdd => 'જે ગણાઈ ગયું તેમાં ઉમેરો';

  @override
  String get countsImportReplace => 'આ બારકોડની ગણતરી બદલો';

  @override
  String get countsImportChoose => 'ફાઇલ પસંદ કરો';

  @override
  String get countsImportReading => 'વાંચે છે...';

  @override
  String get countsImportTooBig => 'આ ફાઇલ બહુ મોટી છે (2 એમબીથી વધુ).';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matched માલ ગણાયા',
      one: '$matched માલ ગણાયો',
    );
    return '$_temp0, $pieces નંગ';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n માલ આ ગણતરીની યાદીમાં નહોતા, ઉમેર્યા.',
      one: '$n માલ આ ગણતરીની યાદીમાં નહોતો, ઉમેર્યો.',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n કોડ માલ નથી: $list',
      one: '$n કોડ માલ નથી: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n લાઇન વાંચી શકાઈ નહીં (લાઇન $list)',
      one: '$n લાઇન વાંચી શકાઈ નહીં (લાઇન $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'સ્ટોક સારાંશ';

  @override
  String stockSubtitle(String method) {
    return 'દરેક વસ્તુનો જથ્થો અને કિંમત. $method પદ્ધતિથી મૂલ્યાંકન.';
  }

  @override
  String get stockMethodAverage => 'મૂવિંગ એવરેજ';

  @override
  String get stockMethodFifo => 'FIFO (પહેલું આવે, પહેલું જાય)';

  @override
  String get stockWarehouse => 'ગોડાઉન';

  @override
  String get stockAllWarehouses => 'બધાં ગોડાઉન';

  @override
  String get stockQty => 'જથ્થો';

  @override
  String get stockRate => 'દર';

  @override
  String get stockValue => 'કિંમત';

  @override
  String get stockTotalValue => 'કુલ સ્ટોક કિંમત';

  @override
  String get stockBelowReorder => 'ફરી ઓર્ડર સ્તરથી નીચે';

  @override
  String get stockReorderTitle => 'ફરી ઓર્ડર કરવાની વસ્તુઓ';

  @override
  String get stockReorderEmpty => 'કોઈ વસ્તુ ફરી ઓર્ડર સ્તરથી નીચે નથી.';

  @override
  String get stockSuggested => 'સૂચવેલ ઓર્ડર';

  @override
  String stockLedgerTitle(String item) {
    return 'સ્ટોક ખાતાવહી: $item';
  }

  @override
  String get stockIn => 'આવક';

  @override
  String get stockOut => 'જાવક';

  @override
  String get stockSourceStockJournal => 'સ્ટોક જર્નલ';

  @override
  String get stockSourceGrn => 'માલ આવક';

  @override
  String get stockSourcePurchaseBill => 'ખરીદી બિલ';

  @override
  String get stockSourcePurchaseReturn => 'ખરીદી પરત';

  @override
  String get stockNegativeWarning =>
      'એક વસ્તુનો સ્ટોક શૂન્યથી નીચે ગયો. ખરીદીની નોંધ રહી ગઈ છે કે તપાસો.';

  @override
  String get sjTitle => 'સ્ટોક જર્નલ';

  @override
  String get sjSubtitle =>
      'શરૂઆતનો સ્ટોક, ભૌતિક ગણતરી સમાયોજન, ગોડાઉન વચ્ચે ટ્રાન્સફર અને વપરાશ.';

  @override
  String get sjNew => 'નવું સ્ટોક જર્નલ';

  @override
  String get sjKindsOpening => 'શરૂઆતનો સ્ટોક';

  @override
  String get sjKindsAdjustment => 'સમાયોજન';

  @override
  String get sjKindsTransfer => 'ટ્રાન્સફર';

  @override
  String get sjKindsIssue => 'વપરાશ';

  @override
  String get sjKindHintsOpening =>
      'હિસાબ શરૂ થયો ત્યારે તમારી પાસે હતો તે સ્ટોક. જથ્થો અને કિંમત દાખલ કરો.';

  @override
  String get sjKindHintsAdjustment =>
      'ભૌતિક ગણતરી પછી સ્ટોક સુધારો: જથ્થો ઉમેરો અથવા ઘટાડો.';

  @override
  String get sjKindHintsTransfer => 'ગોડાઉન વચ્ચે માલ તેની હાલની કિંમતે ખસેડો.';

  @override
  String get sjKindHintsIssue =>
      'વ્યવસાયમાં વપરાયેલો માલ (નમૂના, પોતાનો ઉપયોગ, ઉત્પાદન).';

  @override
  String get sjDirection => 'ઉમેરો / ઘટાડો';

  @override
  String get sjAdd => 'ઉમેરો';

  @override
  String get sjRemove => 'ઘટાડો';

  @override
  String get sjToWarehouse => 'આ ગોડાઉનમાં';

  @override
  String get sjBatch => 'બેચ';

  @override
  String get sjExpiry => 'સમાપ્તિ';

  @override
  String get sjPost => 'સ્ટોક જર્નલ નોંધો';

  @override
  String get sjErrorsRateRequired => 'શરૂઆતના સ્ટોક માટે કિંમત દર દાખલ કરો.';

  @override
  String get sjErrorsServiceHasNoStock => 'સેવાઓનો સ્ટોક હોતો નથી.';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses => 'બે અલગ ગોડાઉન પસંદ કરો.';

  @override
  String get sjErrorsBatchRequired => 'આ વસ્તુ બેચ રાખે છે: બેચ નંબર દાખલ કરો.';

  @override
  String get sjErrorsQtyMustBePositive => 'જથ્થો શૂન્યથી વધુ હોવો જોઈએ.';

  @override
  String get purchaseSupplier => 'સપ્લાયર';

  @override
  String get purchaseChooseSupplier => 'સપ્લાયર પસંદ કરો…';

  @override
  String get purchaseItem => 'વસ્તુ';

  @override
  String get purchaseChooseItem => 'વસ્તુ પસંદ કરો…';

  @override
  String get purchaseQty => 'જથ્થો';

  @override
  String get purchaseRate => 'દર';

  @override
  String get purchaseDiscount => 'વળતર';

  @override
  String get purchaseGst => 'જીએસટી %';

  @override
  String get purchaseAmount => 'રકમ';

  @override
  String get purchaseTaxable => 'કરપાત્ર કિંમત';

  @override
  String get purchaseTotal => 'કુલ';

  @override
  String get purchaseStatus => 'સ્થિતિ';

  @override
  String get purchaseStatusesOpen => 'ખુલ્લો';

  @override
  String get purchaseStatusesPartial => 'અંશતઃ આવ્યો';

  @override
  String get purchaseStatusesReceived => 'આવ્યો';

  @override
  String get purchaseStatusesClosed => 'બંધ';

  @override
  String get purchaseStatusesCancelled => 'રદ';

  @override
  String get purchaseStatusesPosted => 'નોંધાયેલ';

  @override
  String get purchaseStatusesBilled => 'બિલ થયું';

  @override
  String get purchaseOrdersTitle => 'ખરીદી ઓર્ડર';

  @override
  String get purchaseOrdersSubtitle =>
      'તમે સપ્લાયર પાસેથી શું મંગાવ્યું અને કેટલું આવ્યું.';

  @override
  String get purchaseOrdersNew => 'નવો ખરીદી ઓર્ડર';

  @override
  String get purchaseOrdersExpectedOn => 'અપેક્ષિત તારીખ';

  @override
  String get purchaseOrdersOrdered => 'મંગાવ્યું';

  @override
  String get purchaseOrdersReceived => 'આવ્યું';

  @override
  String get purchaseOrdersBilled => 'બિલ થયું';

  @override
  String get purchaseOrdersReceive => 'માલ સ્વીકારો';

  @override
  String get purchaseOrdersBill => 'બિલ નોંધો';

  @override
  String get purchaseOrdersClose => 'ઓર્ડર બંધ કરો';

  @override
  String get purchaseReceiptsTitle => 'ઇનવર્ડ ચલણ';

  @override
  String get purchaseReceiptsSubtitle =>
      'આવેલો માલ (GRN). આવક પર સ્ટોક વધે છે; બિલ પછી આવે છે.';

  @override
  String get purchaseReceiptsNew => 'નવું ઇનવર્ડ ચલણ';

  @override
  String get purchaseReceiptsChallan => 'સપ્લાયરનો ચલણ નં.';

  @override
  String get purchaseReceiptsBill => 'બિલ નોંધો';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'ઓર્ડર $number સામે';
  }

  @override
  String get purchaseBillsTitle => 'ખરીદી બિલ';

  @override
  String get purchaseBillsSubtitle =>
      'સપ્લાયરનાં બિલ. દરેક બિલ ખરીદી, ઇનપુટ જીએસટી અને સપ્લાયરના ખાતામાં નોંધાય છે.';

  @override
  String get purchaseBillsNew => 'નવું ખરીદી બિલ';

  @override
  String get purchaseBillsInvoiceNo => 'સપ્લાયરનો બિલ નં.';

  @override
  String get purchaseBillsInvoiceDate => 'સપ્લાયરના બિલની તારીખ';

  @override
  String get purchaseBillsPostingDate => 'નોંધની તારીખ';

  @override
  String get purchaseBillsDueOn => 'ચૂકવણીની તારીખ';

  @override
  String get purchaseBillsReverseCharge => 'રિવર્સ ચાર્જ (કર અમે ભરીએ)';

  @override
  String get purchaseBillsReturn => 'માલ પરત કરો';

  @override
  String get purchaseBillsReturned => 'પરત કર્યું';

  @override
  String get purchaseBillsPost => 'બિલ નોંધો';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'લાઇન $line પર બિલનો દર માલ આવકથી અલગ છે. સ્ટોક આવકના દરે જ રહે છે.';
  }

  @override
  String get purchaseReturnsTitle => 'ખરીદી પરત';

  @override
  String get purchaseReturnsSubtitle =>
      'સપ્લાયરને પાછો મોકલેલો માલ (ડેબિટ નોટ).';

  @override
  String get purchaseReturnsNew => 'માલ પરત કરો';

  @override
  String get purchaseReturnsReason => 'કારણ';

  @override
  String get purchaseReturnsPost => 'ડેબિટ નોટ નોંધો';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'બિલ $number સામે';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'Sundry Creditors હેઠળનું ખાતું પસંદ કરો.';

  @override
  String get purchaseErrorsUnknownSupplier => 'સપ્લાયર પસંદ કરો.';

  @override
  String get purchaseErrorsOverReceipt => 'આ ઓર્ડર પર બાકી કરતાં વધુ છે.';

  @override
  String get purchaseErrorsOverBilling =>
      'આ આવેલા અને હજી બિલ ન થયેલા માલ કરતાં વધુ છે.';

  @override
  String get purchaseErrorsOverReturn =>
      'આ બિલ થયેલા અને હજી પરત ન થયેલા માલ કરતાં વધુ છે.';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'આ સપ્લાયર બિલ પહેલેથી નોંધાયેલું છે.';

  @override
  String get purchaseErrorsBillHasReturns => 'પહેલાં આ બિલ સામેના પરત રદ કરો.';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'આ આવકનું બિલ થઈ ગયું છે; પહેલાં બિલ રદ કરો.';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'આ ઓર્ડર સામે માલ આવી ગયો છે; તેને બંધ કરો.';

  @override
  String get purchaseErrorsOrderNotOpen => 'આ ઓર્ડર બંધ છે.';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'સપ્લાયરના બિલની તારીખ નોંધની તારીખ પછીની ન હોઈ શકે.';

  @override
  String get purchaseErrorsNoLines => 'ઓછામાં ઓછી એક લાઇન ઉમેરો.';

  @override
  String get purchaseErrorsItemArchived => 'એક વસ્તુ આર્કાઇવ છે.';

  @override
  String get purchaseReadButton => 'બિલ વાંચો';

  @override
  String get purchaseReadHint =>
      'સપ્લાયરના બિલનો ફોટો અથવા PDF: ફોર્મ ભરાઈ જશે, તમે તપાસો.';

  @override
  String get purchaseReadReading => 'બિલ વાંચી રહ્યા છીએ…';

  @override
  String get purchaseReadDone =>
      'બિલમાંથી ભર્યું. સાચવતાં પહેલાં દરેક લાઇન તપાસો.';

  @override
  String purchaseReadUnmatched(String items) {
    return 'આ માટે વસ્તુ પસંદ કરો: $items.';
  }

  @override
  String get purchaseReadDemo =>
      'આપમેળે વાંચવાનું ચાલુ નથી; કૃપા કરીને બિલ ભરો.';

  @override
  String get purchaseReadNone => 'આ બિલ વાંચી શકાયું નહીં; કૃપા કરીને ભરો.';

  @override
  String get inventorySettingsTitle => 'માલ સેટિંગ્સ';

  @override
  String get inventorySettingsValuation => 'સ્ટોક મૂલ્યાંકન પદ્ધતિ';

  @override
  String get inventorySettingsValuationHint =>
      'વપરાયેલા અને બાકી સ્ટોકની કિંમત કેવી રીતે ગણાય. બદલવાથી શરૂઆતથી બધા સ્ટોકનું ફરી મૂલ્યાંકન થાય છે.';

  @override
  String get inventorySettingsWarehouses => 'ગોડાઉન';

  @override
  String get inventorySettingsAddWarehouse => 'ગોડાઉન ઉમેરો';

  @override
  String get inventorySettingsWarehouseName => 'ગોડાઉનનું નામ';

  @override
  String get inventorySettingsDefault => 'મુખ્ય';

  @override
  String get inventorySettingsNameTaken => 'આ નામનું ગોડાઉન પહેલેથી છે.';

  @override
  String get salesCustomer => 'ગ્રાહક';

  @override
  String get salesChooseCustomer => 'ગ્રાહક પસંદ કરો…';

  @override
  String get salesPlaceOfSupply => 'પુરવઠાનું સ્થળ';

  @override
  String get salesExport => 'નિકાસ';

  @override
  String get salesSez => 'SEZ ગ્રાહક';

  @override
  String get salesLut => 'LUT હેઠળ (કર વગર)';

  @override
  String get salesStatusesDelivered => 'પહોંચાડ્યું';

  @override
  String get salesStatusesInvoiced => 'બિલ થયું';

  @override
  String get salesStatusesAccepted => 'સ્વીકાર્યું';

  @override
  String get salesStatusesDeclined => 'નકાર્યું';

  @override
  String get salesStatusesConverted => 'રૂપાંતરિત';

  @override
  String get salesStatusesExpired => 'મુદત પૂરી';

  @override
  String get salesOrdersTitle => 'વેચાણ ઓર્ડર';

  @override
  String get salesOrdersSubtitle => 'ગ્રાહકોએ શું મંગાવ્યું અને કેટલું ગયું.';

  @override
  String get salesOrdersNew => 'નવો વેચાણ ઓર્ડર';

  @override
  String get salesOrdersDeliverBy => 'પહોંચાડવાની તારીખ';

  @override
  String get salesOrdersCustomerRef => 'ગ્રાહકનો PO નં.';

  @override
  String get salesOrdersOrdered => 'મંગાવ્યું';

  @override
  String get salesOrdersDelivered => 'પહોંચાડ્યું';

  @override
  String get salesOrdersInvoiced => 'બિલ થયું';

  @override
  String get salesOrdersDeliver => 'માલ પહોંચાડો';

  @override
  String get salesOrdersInvoice => 'બિલ બનાવો';

  @override
  String get salesOrdersClose => 'ઓર્ડર બંધ કરો';

  @override
  String get salesDeliveriesTitle => 'ડિલિવરી ચલણ';

  @override
  String get salesDeliveriesSubtitle =>
      'બિલ પહેલાં (અથવા બિલ વગર) મોકલેલો માલ. ડિલિવરી પર સ્ટોક ઘટે છે.';

  @override
  String get salesDeliveriesNew => 'નવું ડિલિવરી ચલણ';

  @override
  String get salesDeliveriesInvoice => 'બિલ બનાવો';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'ઓર્ડર $number સામે';
  }

  @override
  String get salesDeliveriesReason => 'કારણ';

  @override
  String get salesDeliveriesValue => 'મૂલ્ય';

  @override
  String get salesDeliveriesTransporter => 'ટ્રાન્સપોર્ટર';

  @override
  String get salesDeliveriesVehicleNo => 'વાહન નં.';

  @override
  String get salesDeliveriesPrint => 'ચલણ છાપો (3 નકલ)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return '$date સુધી ઇન્વૉઇસ';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    return 'માલ $count વાર પાછો આવ્યો: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'માલ પાછો લો';

  @override
  String get salesDeliveriesStillOut => 'હજી બહાર';

  @override
  String get salesDeliveriesCameBack => 'પાછો આવ્યો';

  @override
  String get salesDeliveriesSaveReturn => 'વળતર સાચવો';

  @override
  String get salesDeliveriesNewApproval => 'નવો મંજૂરી મેમો';

  @override
  String get salesDeliveriesReasonsSupply => 'પુરવઠો, ઇન્વૉઇસ પછી';

  @override
  String get salesDeliveriesReasonsApproval => 'મંજૂરી પર વેચાણ';

  @override
  String get salesDeliveriesReasonsJobWork => 'જોબ વર્ક';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'પુરવઠો નહીં (પોતાનો ઉપયોગ, સમારકામ)';

  @override
  String get salesDeliveriesReasonsLots => 'હપ્તામાં પુરવઠો';

  @override
  String get salesDeliveriesReasonsExhibition => 'પ્રદર્શન કે મેળો';

  @override
  String get salesDeliveriesReasonsOther => 'અન્ય';

  @override
  String get salesDeliveriesReasonsSample => 'સેમ્પલ';

  @override
  String get salesDeliveriesReasonHintsSupply =>
      'માલ વેચાયો; ટેક્સ ઇન્વૉઇસ પછી.';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'ગ્રાહક વેચાય તે રાખે છે. છ મહિનામાં ઇન્વૉઇસ કરો અથવા માલ પાછો લો.';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'પ્રોસેસિંગ માટે મોકલ્યો; માલ પાછો આવશે.';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'વેચાણ વિના માલ જાય છે, તેથી ટેક્સ દેખાતો નથી.';

  @override
  String get salesDeliveriesReasonHintsLots => 'એક પુરવઠો ઘણા હપ્તામાં.';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'પ્રદર્શનમાં બતાવ્યો; ન વેચાયેલો માલ પાછો આવશે.';

  @override
  String get salesDeliveriesReasonHintsOther => 'માલની કોઈ અન્ય હેરફેર.';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'બતાવવા કે અજમાવવા મોકલ્યું; વેચાણ નથી, એટલે કર દેખાતો નથી. ન રાખેલા નંગ પરત પર પાછા આવે છે.';

  @override
  String get salesInvoicesTitle => 'વેચાણ બિલ';

  @override
  String get salesInvoicesSubtitle =>
      'કર બિલ. દરેક બિલ વેચાણ, આઉટપુટ જીએસટી અને ગ્રાહકના ખાતામાં નોંધાય છે.';

  @override
  String get salesInvoicesNew => 'નવું બિલ';

  @override
  String get salesInvoicesDueOn => 'ચૂકવણીની તારીખ';

  @override
  String get salesInvoicesPost => 'બિલ સાચવો';

  @override
  String get salesInvoicesPrint => 'છાપો';

  @override
  String get salesInvoicesCreditNote => 'ક્રેડિટ નોટ / પરત';

  @override
  String get salesInvoicesReturned => 'પરત આવ્યું';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'આથી ગ્રાહક ઉધાર મર્યાદા વટાવે છે ($detail બાકી).';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return '$detailનો માલ: ખસેડતાં પહેલાં ઈ-વે બિલ જરૂરી.';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'લાઇન $lineNoમાં HSN કોડ નથી; કર બિલ પર તે જરૂરી છે.';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'કેટલોક સ્ટોક શૂન્યથી નીચે ગયો. ખરીદીની નોંધ રહી ગઈ છે કે તપાસો.';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'આ ગ્રાહકનું એક બિલ $days દિવસથી બાકી છે.';
  }

  @override
  String get salesCreditNotesTitle => 'ક્રેડિટ નોટ';

  @override
  String get salesCreditNotesSubtitle => 'વેચાણ પરત અને વેચાણ પછી ભાવ ઘટાડો.';

  @override
  String get salesCreditNotesNew => 'ક્રેડિટ નોટ';

  @override
  String get salesCreditNotesReason => 'કારણ';

  @override
  String get salesCreditNotesGoodsReturned => 'માલ સ્ટોકમાં પાછો આવ્યો';

  @override
  String get salesCreditNotesPriceReduction => 'ફક્ત ભાવ ઘટાડો (માલ પાછો નહીં)';

  @override
  String get salesCreditNotesCreditRate => 'એકમ દીઠ ક્રેડિટ';

  @override
  String get salesCreditNotesPost => 'ક્રેડિટ નોટ નોંધો';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'બિલ $number સામે';
  }

  @override
  String get salesErrorsNotACustomer =>
      'Sundry Debtors હેઠળનું ખાતું પસંદ કરો.';

  @override
  String get salesErrorsUnknownCustomer => 'ગ્રાહક પસંદ કરો.';

  @override
  String get salesErrorsOverDelivery => 'આ ઓર્ડર પર બાકી કરતાં વધુ છે.';

  @override
  String get salesErrorsOverInvoicing =>
      'આ પહોંચાડેલા અને હજી બિલ ન થયેલા માલ કરતાં વધુ છે.';

  @override
  String get salesErrorsOverReturn => 'બહાર છે તેના કરતાં વધુ પાછું આવે છે.';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'પહેલાં આ બિલ સામેની ક્રેડિટ નોટ રદ કરો.';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'આ ચલણનું બિલ થઈ ગયું છે; પહેલાં બિલ રદ કરો.';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'આ ઓર્ડર સામે માલ ગયો છે; તેને બંધ કરો.';

  @override
  String get salesErrorsCancelIrnFirst => 'પહેલાં ઈ-ઇન્વૉઇસ (IRN) રદ કરો.';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'ક્રેડિટ બિલના દરથી વધુ ન હોઈ શકે.';

  @override
  String get salesErrorsRateRequired => 'એકમ દીઠ ક્રેડિટ દાખલ કરો.';

  @override
  String get salesErrorsQuotationNotOpen =>
      'આ ક્વોટેશન પહેલેથી રૂપાંતરિત અથવા બંધ છે.';

  @override
  String get salesErrorsQuotationConverted =>
      'આ ક્વોટેશન રૂપાંતરિત થયું છે; પહેલાં તેમાંથી બનેલો ઓર્ડર કે બિલ રદ કરો.';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'આ ક્વોટેશન બીજા ગ્રાહક માટે છે.';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“સુધી માન્ય” ક્વોટેશનની તારીખ પહેલાંની ન હોઈ શકે.';

  @override
  String get salesErrorsCancelEwbFirst => 'પહેલાં ઈ-વે બિલ રદ કરો.';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'આ મહિનાનું GSTR-1 પહેલેથી ભરાયું છે. ચાલુ મહિનાની તારીખ આપો, અથવા જીએસટી પોર્ટલ પર સુધારો કરો.';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'એડવાન્સ કુલ રકમથી વધુ ન હોઈ શકે.';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'આ ચલણ પર માલ પાછો આવ્યો છે, તેથી રદ ન થઈ શકે.';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'વળતરની તારીખ ચલણની તારીખ પહેલાંની છે.';

  @override
  String get salesErrorsDeliveryCancelled => 'આ ચલણ રદ છે.';

  @override
  String get salesErrorsUnknownDeliveryLine => 'આ લાઇન આ ચલણ પર નથી.';

  @override
  String get salesErrorsCreditBlocked =>
      'આ વેચાણ ગ્રાહકને ક્રેડિટ મર્યાદાથી ઉપર લઈ જાય છે અને તેમનું ખાતું બ્લૉક પર છે.';

  @override
  String get salesErrorsOverdueBlocked =>
      'આ ગ્રાહકનું એક બિલ મંજૂર સમય કરતાં વધુ બાકી છે અને તેમનું ખાતું બ્લૉક પર છે.';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'માત્ર માલિક કે એડમિન ક્રેડિટ બ્લૉક ઓવરરાઇડ કરી શકે.';

  @override
  String get salesErrorsNotAnAgent =>
      'દલાલ કે એજન્ટ તરીકે ચિહ્નિત ખાતું પસંદ કરો.';

  @override
  String get salesErrorsUnknownSalesman =>
      'તમારા કર્મચારીઓમાંથી સેલ્સમેન પસંદ કરો.';

  @override
  String get salesErrorsUnknownOrder => 'તે ઓર્ડર મળ્યો નથી.';

  @override
  String get salesQuotationsTitle => 'ક્વોટેશન';

  @override
  String get salesQuotationsSubtitle =>
      'ગ્રાહકો માટે ભાવ દરખાસ્તો. રૂપાંતર થાય ત્યાં સુધી સ્ટોક કે હિસાબ પર અસર નહીં.';

  @override
  String get salesQuotationsNew => 'નવું ક્વોટેશન';

  @override
  String get salesQuotationsSave => 'ક્વોટેશન સાચવો';

  @override
  String get salesQuotationsValidUntil => 'સુધી માન્ય';

  @override
  String get salesQuotationsToOrder => 'ઓર્ડરમાં ફેરવો';

  @override
  String get salesQuotationsToInvoice => 'બિલમાં ફેરવો';

  @override
  String get salesQuotationsAccept => 'સ્વીકાર્યું તરીકે નોંધો';

  @override
  String get salesQuotationsDecline => 'નકાર્યું તરીકે નોંધો';

  @override
  String get salesQuotationsPrint => 'છાપો / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'ઓર્ડરમાં',
      'other': 'બિલમાં',
    });
    return '$_temp0 ફેરવાયું';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'ક્વોટેશન $numberમાંથી';
  }

  @override
  String get salesQuotationsTerms => 'શરતો';

  @override
  String get salesProformasTitle => 'પ્રોફોર્મા ઇન્વૉઇસ';

  @override
  String get salesProformasSubtitle =>
      'માલ મોકલતા પહેલાં ચુકવણી કે એડવાન્સ માગો. ઇન્વૉઇસ સુધી ટેક્સ કે સ્ટોક પર અસર નહીં.';

  @override
  String get salesProformasNew => 'નવું પ્રોફોર્મા ઇન્વૉઇસ';

  @override
  String get salesProformasSave => 'પ્રોફોર્મા સાચવો';

  @override
  String get salesProformasAdvanceDue => 'માગેલ એડવાન્સ';

  @override
  String get salesProformasAdvanceHint => 'પૂરી રકમ માગવા ખાલી રાખો';

  @override
  String get salesApprovalsTitle => 'મંજૂરી પરનો માલ';

  @override
  String get salesApprovalsSubtitle =>
      'જેનો માલ હજી ગ્રાહક પાસે છે તેવા મંજૂરી મેમો. ન વેચાયેલો માલ પાછો લો; બાકીનું છ મહિનામાં ઇન્વૉઇસ કરો.';

  @override
  String salesApprovalsSummary(num count, String value) {
    return '$count મેમો ખુલ્લા, મૂલ્ય $value';
  }

  @override
  String get salesApprovalsDaysOut => 'બહારના દિવસ';

  @override
  String salesApprovalsDaysLeft(num days) {
    return '$days દિવસ બાકી';
  }

  @override
  String get salesApprovalsEmpty => 'મંજૂરી પર કોઈ માલ બહાર નથી.';

  @override
  String get salesOverrideCredit => 'મંજૂરી આપીને સાચવો';

  @override
  String get salesSamplesTitle => 'બહાર ગયેલા સેમ્પલ';

  @override
  String get salesSamplesSubtitle =>
      'પક્ષોને મોકલેલા પણ હજી પાછા ન આવેલા સેમ્પલ. આ વેચાણ નથી અને તેના પર કર નથી. જે રાખવામાં ન આવે તે પાછા લો.';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ચલણ',
      one: '$count ચલણ',
    );
    return '$_temp0 માં $pieces નંગ હજી બહાર';
  }

  @override
  String get salesSamplesNew => 'નવું સેમ્પલ ચલણ';

  @override
  String get salesSamplesEmpty => 'કોઈ સેમ્પલ બહાર નથી.';

  @override
  String get einvoiceTitle => 'ઈ-ઇન્વૉઇસ';

  @override
  String get einvoiceStatusNotRequired => 'જરૂરી નથી';

  @override
  String get einvoiceStatusPending => 'IRN બાકી';

  @override
  String get einvoiceStatusGenerated => 'IRN બન્યો';

  @override
  String get einvoiceStatusCancelled => 'IRN રદ';

  @override
  String get einvoiceStatusFailed => 'IRN નિષ્ફળ';

  @override
  String get einvoiceGenerate => 'IRN બનાવો';

  @override
  String get einvoiceCancel => 'IRN રદ કરો';

  @override
  String get einvoiceCancelHint => 'IRN બન્યાના 24 કલાકમાં જ રદ કરી શકાય છે.';

  @override
  String get einvoiceReasons1 => 'ડુપ્લિકેટ';

  @override
  String get einvoiceReasons2 => 'ડેટા એન્ટ્રીની ભૂલ';

  @override
  String get einvoiceReasons3 => 'ઓર્ડર રદ';

  @override
  String get einvoiceReasons4 => 'અન્ય';

  @override
  String get einvoiceRemark => 'નોંધ';

  @override
  String get einvoiceIrn => 'IRN';

  @override
  String get einvoiceAckNo => 'પાવતી નં.';

  @override
  String get einvoiceAckDate => 'પાવતી તારીખ';

  @override
  String get einvoiceSimulator =>
      'ટેસ્ટ મોડ: જીએસટી પ્રદાતા જોડાય ત્યાં સુધી IRN બિલ્ટ-ઇન સિમ્યુલેટરમાંથી આવે છે.';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'ગ્રાહકનો જીએસટીઆઈએન નથી; ઈ-ઇન્વૉઇસ ફક્ત નોંધાયેલા ખરીદનારા અને નિકાસ માટે છે.';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'આ બિલ નંબર IRP માટે માન્ય નથી.';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'ગ્રાહક અને તમારી શાખાનો માન્ય પિન કોડ ઉમેરો.';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'ગ્રાહક અને તમારી શાખાનાં સરનામાં ઉમેરો.';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn => 'દરેક વસ્તુને HSN કોડ જોઈએ.';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch => 'સરવાળા મેળ ખાતા નથી.';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'પહેલાં તમારી શાખાનો જીએસટીઆઈએન ઉમેરો.';

  @override
  String get einvoiceErrorsDuplicateIrn => 'IRP પાસે આ બિલ પહેલેથી છે.';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'આ IRN રદ કરવાના 24 કલાક વીતી ગયા. તેના બદલે ક્રેડિટ નોટ આપો.';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated => 'IRN પહેલેથી બન્યો છે.';

  @override
  String get einvoiceErrorsCancelEwbFirst => 'પહેલાં ઈ-વે બિલ રદ કરો.';

  @override
  String get ewbTitle => 'ઈ-વે બિલ';

  @override
  String get ewbGenerate => 'ઈ-વે બિલ બનાવો';

  @override
  String get ewbVehicleNo => 'વાહન નં.';

  @override
  String get ewbDistance => 'અંતર (કિમી)';

  @override
  String get ewbNumber => 'EWB નં.';

  @override
  String get ewbValidUpto => 'સુધી માન્ય';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'આ વાહન નંબર લાગતો નથી (દા.ત. GJ01AB1234).';

  @override
  String get ewbErrorsInvalidDistance => 'અંતર કિમીમાં દાખલ કરો.';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'ઈ-વે બિલની મુદત પૂરી થવાના 8 કલાક પહેલાંથી 8 કલાક પછી સુધી જ લંબાવી શકાય.';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'આ ઈ-વે બિલ રદ કરવાના 24 કલાક વીતી ગયા.';

  @override
  String get ewbErrorsEwbExpired => 'આ ઈ-વે બિલની મુદત પૂરી થઈ; મુદત લંબાવો.';

  @override
  String get ewbErrorsNoActiveEwb => 'આ બિલ પર સક્રિય ઈ-વે બિલ નથી.';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'આ બિલ પર ઈ-વે બિલ પહેલેથી સક્રિય છે.';

  @override
  String get ewbErrorsInvalidPincode => '6 અંકનો પિન કોડ દાખલ કરો.';

  @override
  String get ewbStatusActive => 'સક્રિય';

  @override
  String get ewbStatusCancelled => 'રદ';

  @override
  String get ewbChangeVehicle => 'વાહન બદલો';

  @override
  String get ewbExtend => 'મુદત લંબાવો';

  @override
  String get ewbCancel => 'ઈ-વે બિલ રદ કરો';

  @override
  String get ewbNewVehicle => 'નવો વાહન નં.';

  @override
  String get ewbCurrentPlace => 'હાલનું સ્થળ';

  @override
  String get ewbCurrentPincode => 'હાલનો પિન કોડ';

  @override
  String get ewbRemainingKm => 'બાકી અંતર (કિમી)';

  @override
  String get ewbReason => 'કારણ';

  @override
  String get ewbRemark => 'નોંધ';

  @override
  String get ewbSave => 'સાચવો';

  @override
  String get ewbExtendHint =>
      'ઈ-વે બિલની મુદત પૂરી થવાના 8 કલાક પહેલાંથી 8 કલાક પછી સુધી મંજૂર.';

  @override
  String get ewbCancelHint => 'બન્યાના 24 કલાકમાં, માલ ખસ્યો ન હોય તો મંજૂર.';

  @override
  String ewbCancelledNote(String number) {
    return 'ઈ-વે બિલ $number રદ થયું. તમે નવું બનાવી શકો છો.';
  }

  @override
  String get ewbVehicleReasons1 => 'વાહન બગડ્યું';

  @override
  String get ewbVehicleReasons2 => 'ટ્રાન્સશિપમેન્ટ';

  @override
  String get ewbVehicleReasons3 => 'અન્ય';

  @override
  String get ewbVehicleReasons4 => 'પહેલી વાર';

  @override
  String get ewbExtendReasons1 => 'કુદરતી આફત';

  @override
  String get ewbExtendReasons2 => 'કાયદો અને વ્યવસ્થા';

  @override
  String get ewbExtendReasons4 => 'ટ્રાન્સશિપમેન્ટ';

  @override
  String get ewbExtendReasons5 => 'અકસ્માત';

  @override
  String get ewbExtendReasons99 => 'અન્ય';

  @override
  String get ewbCancelReasons1 => 'ડુપ્લિકેટ';

  @override
  String get ewbCancelReasons2 => 'ઓર્ડર રદ';

  @override
  String get ewbCancelReasons3 => 'ડેટા એન્ટ્રીની ભૂલ';

  @override
  String get ewbCancelReasons4 => 'અન્ય';

  @override
  String get printTaxInvoice => 'કર બિલ';

  @override
  String get printCreditNote => 'ક્રેડિટ નોટ';

  @override
  String get printOriginal => 'પ્રાપ્તકર્તા માટે મૂળ નકલ';

  @override
  String get printBillTo => 'બિલ આમને';

  @override
  String get printShipTo => 'માલ આમને';

  @override
  String get printInvoiceNo => 'બિલ નં.';

  @override
  String get printInvoiceDate => 'બિલ તારીખ';

  @override
  String get printSno => '#';

  @override
  String get printHsn => 'HSN/SAC';

  @override
  String get printTaxSummary => 'કર સારાંશ';

  @override
  String get printRate => 'દર';

  @override
  String get printAmountInWords => 'રકમ શબ્દોમાં';

  @override
  String get printBank => 'બેંક વિગતો';

  @override
  String get printTerms => 'નિયમો અને શરતો';

  @override
  String printForCompany(String company) {
    return '$company વતી';
  }

  @override
  String get printSignatory => 'અધિકૃત સહી કરનાર';

  @override
  String get printComputerGenerated => 'આ કમ્પ્યુટર દ્વારા બનાવેલું બિલ છે.';

  @override
  String get printReverseCharge => 'રિવર્સ ચાર્જ પર ચૂકવવાપાત્ર કર';

  @override
  String get printExportLut => 'IGST ચૂકવ્યા વગર LUT હેઠળ નિકાસ માટે પુરવઠો';

  @override
  String get printQuotation => 'ક્વોટેશન';

  @override
  String get printQuotationNo => 'ક્વોટેશન નં.';

  @override
  String get printQuotationDate => 'ક્વોટેશન તારીખ';

  @override
  String get printQuotedTo => 'આમને ક્વોટેશન';

  @override
  String get printComputerGeneratedQuote =>
      'આ કમ્પ્યુટર દ્વારા બનાવેલું ક્વોટેશન છે. આપેલી તારીખ સુધી ભાવ માન્ય છે.';

  @override
  String get printProforma => 'પ્રોફોર્મા ઇન્વૉઇસ';

  @override
  String get printProformaNo => 'પ્રોફોર્મા નં.';

  @override
  String get printProformaDate => 'પ્રોફોર્મા તારીખ';

  @override
  String get printComputerGeneratedProforma =>
      'આ પ્રોફોર્મા ઇન્વૉઇસ છે, ટેક્સ ઇન્વૉઇસ નથી. પુરવઠા પર ટેક્સ ઇન્વૉઇસ આપવામાં આવશે.';

  @override
  String get printDeliveryChallan => 'ડિલિવરી ચલણ';

  @override
  String get printApprovalMemo => 'મંજૂરી મેમો';

  @override
  String get printCopyConsignee => 'મૂળ નકલ માલ મેળવનાર માટે';

  @override
  String get printCopyTransporter => 'બીજી નકલ ટ્રાન્સપોર્ટર માટે';

  @override
  String get printCopyConsignor => 'ત્રીજી નકલ મોકલનાર માટે';

  @override
  String get printConsignee => 'માલ મેળવનાર';

  @override
  String get printChallanNo => 'ચલણ નં.';

  @override
  String get printChallanDate => 'ચલણ તારીખ';

  @override
  String get printInvoiceBy => 'ઇન્વૉઇસની છેલ્લી તારીખ';

  @override
  String get printValue => 'મૂલ્ય';

  @override
  String get printNotASupply =>
      'માલ પુરવઠા સિવાયના કારણે મોકલ્યો. આ ચલણ પર કોઈ ટેક્સ નથી.';

  @override
  String get printReceivedBy => 'મેળવનાર';

  @override
  String get printSignatureAndDate => 'સહી અને તારીખ';

  @override
  String get outstandingReceivablesTitle => 'લેણાં';

  @override
  String get outstandingReceivablesSubtitle =>
      'ગ્રાહકો પાસેથી લેવાના, સમય મુજબ. આવક પહેલાં સૌથી જૂનાં બિલ ચૂકવે છે.';

  @override
  String get outstandingPayablesTitle => 'દેવાં';

  @override
  String get outstandingPayablesSubtitle =>
      'સપ્લાયરને ચૂકવવાના, સમય મુજબ. ચુકવણી પહેલાં સૌથી જૂનાં બિલ ચૂકવે છે.';

  @override
  String get outstandingParty => 'પક્ષ';

  @override
  String get outstandingBalance => 'બાકી';

  @override
  String get outstandingNotDue => 'હજી ચૂકવવાનું નથી';

  @override
  String get outstandingD030 => '1-30 દિવસ';

  @override
  String get outstandingD3160 => '31-60 દિવસ';

  @override
  String get outstandingD6190 => '61-90 દિવસ';

  @override
  String get outstandingAdvance => 'એડવાન્સ';

  @override
  String get outstandingOpenItems => 'ખુલ્લાં બિલ';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days દિવસ મુદત વીતી',
      one: '$days દિવસ મુદત વીતી',
      zero: 'ચૂકવવાપાત્ર',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'કંઈ બાકી નથી.';

  @override
  String get outstandingD91180 => '91 થી 180 દિવસ';

  @override
  String get outstandingD180plus => '180 દિવસથી વધુ';

  @override
  String get returnsTitle => 'જીએસટી રિટર્ન';

  @override
  String get returnsSubtitle =>
      'તમારાં બિલોમાંથી GSTR-1 અને GSTR-3B. અહીં ભરો, અથવા જીએસટી પોર્ટલના ઓફલાઇન ટૂલ માટે JSON ડાઉનલોડ કરો.';

  @override
  String get returnsPeriod => 'કર સમયગાળો';

  @override
  String get returnsGstr1 => 'GSTR-1';

  @override
  String get returnsGstr3b => 'GSTR-3B';

  @override
  String get returnsDownload => 'JSON ડાઉનલોડ કરો';

  @override
  String get returnsSection => 'વિભાગ';

  @override
  String get returnsCount => 'બિલ';

  @override
  String get returnsTaxable => 'કરપાત્ર કિંમત';

  @override
  String get returnsTax => 'કર';

  @override
  String get returnsB2b => 'B2B: નોંધાયેલા ગ્રાહકો';

  @override
  String get returnsB2cl => 'B2C મોટા: બીજું રાજ્ય, ₹1 લાખથી વધુ';

  @override
  String get returnsB2cs => 'B2C નાના';

  @override
  String get returnsExp => 'નિકાસ';

  @override
  String get returnsCdn => 'ક્રેડિટ નોટ';

  @override
  String get returnsCancelled => 'રદ બિલ (દસ્તાવેજ સારાંશમાં)';

  @override
  String get returnsOutward => '3.1(a) જાવક કરપાત્ર પુરવઠો';

  @override
  String get returnsZeroRated => '3.1(b) શૂન્ય દર (નિકાસ, SEZ)';

  @override
  String get returnsNil => '3.1(c) શૂન્ય દર / મુક્ત';

  @override
  String get returnsRcm => '3.1(d) રિવર્સ ચાર્જવાળો આવક પુરવઠો';

  @override
  String get returnsItc => '4. ઇનપુટ ટેક્સ ક્રેડિટ';

  @override
  String get returnsSetOff => '6.1 કરની ચુકવણી';

  @override
  String get returnsHead => 'કરનો પ્રકાર';

  @override
  String get returnsLiability => 'ચૂકવવાપાત્ર કર';

  @override
  String get returnsPaidByCredit => 'ક્રેડિટથી ચૂકવ્યો';

  @override
  String get returnsCash => 'રોકડમાં ચૂકવો';

  @override
  String get returnsCarryForward => 'આગળ લઈ જવાતી ક્રેડિટ';

  @override
  String get returnsFilingNote =>
      'રિટર્ન તમારા જીએસટી પ્રદાતા દ્વારા ભરાય છે. પ્રદાતા જોડાય ત્યાં સુધી ટેસ્ટ મોડ બિલ્ટ-ઇન સિમ્યુલેટર વાપરે છે.';

  @override
  String get gstSettingsTitle => 'જીએસટી અને બિલિંગ';

  @override
  String get gstSettingsEinvoice => 'ઈ-ઇન્વૉઇસ (IRN) બનાવો';

  @override
  String get gstSettingsEinvoiceHint =>
      '2017-18થી કોઈ પણ વર્ષમાં ટર્નઓવર ₹5 કરોડથી વધે તો ફરજિયાત.';

  @override
  String get gstSettingsEwbThreshold => 'આ કિંમતથી વધુ પર ઈ-વે બિલ (₹)';

  @override
  String get gstSettingsBilingual =>
      'બિલ, પગાર સ્લિપ અને ફોર્મ 16 બે ભાષામાં છાપો';

  @override
  String get gstSettingsPrintLanguage => 'છાપકામની બીજી ભાષા';

  @override
  String get gstSettingsTerms => 'બિલના નિયમો અને શરતો';

  @override
  String get gstSettingsBank => 'બિલ પરની બેંક વિગતો';

  @override
  String get importTitle => 'ડેટા આયાત';

  @override
  String get importSubtitle =>
      'સ્પ્રેડશીટ અથવા Tallyમાંથી ગ્રાહકો, સપ્લાયર અને વસ્તુઓ લાવો.';

  @override
  String get importParties => 'ગ્રાહકો અને સપ્લાયર (CSV)';

  @override
  String get importItems => 'વસ્તુઓ (CSV)';

  @override
  String get importTally => 'Tally XML';

  @override
  String get importTemplate => 'નમૂના CSV ડાઉનલોડ કરો';

  @override
  String get importTallyHint =>
      'Tallyમાં: Display → List of Accounts → Alt+E (Export), XML ફોર્મેટ. સ્ટોક વસ્તુઓ પણ સામેલ કરો.';

  @override
  String get importChoose => 'ફાઇલ પસંદ કરો';

  @override
  String get importPreview => 'ફાઇલ તપાસો';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count પંક્તિઓ',
      one: '$count પંક્તિ',
    );
    return '$_temp0 આયાત કરો';
  }

  @override
  String get importRow => 'પંક્તિ';

  @override
  String get importStatus => 'પરિણામ';

  @override
  String get importCreate => 'બનશે';

  @override
  String get importExists => 'પહેલેથી છે: છોડી દીધું';

  @override
  String get importDone => 'આયાત થયું.';

  @override
  String get filingTitle => 'જીએસટી પોર્ટલ પર ભરો';

  @override
  String get filingPortal => 'જીએસટી પોર્ટલ જોડાણ';

  @override
  String get filingPortalHint =>
      'પહેલાં તમારી જીએસટી પોર્ટલ પ્રોફાઇલમાં “API access” ચાલુ કરો. સત્ર લગભગ 6 કલાક ચાલે છે.';

  @override
  String get filingUsername => 'જીએસટી પોર્ટલ યુઝરનેમ';

  @override
  String get filingSendOtp => 'OTP મોકલો';

  @override
  String get filingOtp => 'OTP';

  @override
  String get filingConnect => 'જોડો';

  @override
  String filingConnected(String username, String time) {
    return '$username તરીકે $time સુધી જોડાયેલ';
  }

  @override
  String get filingDisconnect => 'જોડાણ દૂર કરો';

  @override
  String filingSimulatorOtp(String otp) {
    return 'ટેસ્ટ મોડ: OTP $otp છે.';
  }

  @override
  String get filingUpload => 'અપલોડ કરો';

  @override
  String get filingUploadAgain => 'ફરી અપલોડ કરો';

  @override
  String filingUploaded(String time) {
    return '$timeએ અપલોડ થયું';
  }

  @override
  String get filingGetOtp => 'EVC OTP મોકલો';

  @override
  String get filingEvcHint => 'OTP તમારા અધિકૃત સહી કરનારના મોબાઇલ પર જાય છે.';

  @override
  String get filingFile => 'EVCથી ભરો';

  @override
  String filingFiled(String time) {
    return '$timeએ ભર્યું';
  }

  @override
  String get filingArn => 'ARN';

  @override
  String get filingNotUploaded => 'અપલોડ થયું નથી';

  @override
  String get filingLocked =>
      'કોઈ મહિનાનું GSTR-1 ભર્યા પછી તે મહિનાનાં બિલ અને ક્રેડિટ નોટ લૉક થઈ જાય છે.';

  @override
  String filingCashNote(String amount) {
    return 'ભરતાં પહેલાં તમારી ઇલેક્ટ્રોનિક રોકડ ખાતાવહીમાં $amount રાખો (જીએસટી પોર્ટલ પર ચલણ).';
  }

  @override
  String get filingErrorsGstSessionRequired =>
      'પહેલાં જીએસટી પોર્ટલ સાથે જોડાઓ.';

  @override
  String get filingErrorsGstSessionExpired =>
      'જીએસટી પોર્ટલ સત્ર પૂરું થયું. ફરી જોડાઓ.';

  @override
  String get filingErrorsInvalidOtp => 'આ OTP સાચો નથી.';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'તમારું જીએસટી પોર્ટલ યુઝરનેમ દાખલ કરો.';

  @override
  String get filingErrorsUploadFirst => 'પહેલાં રિટર્ન અપલોડ કરો.';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'અપલોડ પછી તમારા હિસાબમાં ફેરફાર થયો. ફરી અપલોડ કરો, પછી ભરો.';

  @override
  String get filingErrorsReturnAlreadyFiled => 'આ રિટર્ન પહેલેથી ભરાયું છે.';

  @override
  String get filingErrorsCompanyPanRequired =>
      'કંપની અને શાખાઓમાં વ્યવસાયનો પાન ઉમેરો.';

  @override
  String get filingErrorsInvalidPan => 'વ્યવસાયનો પાન માન્ય નથી.';

  @override
  String get filingErrorsBranchGstinRequired =>
      'પહેલાં મુખ્ય કચેરીનો જીએસટીઆઈએન ઉમેરો.';

  @override
  String get hrEmployeesTitle => 'કર્મચારીઓ';

  @override
  String get hrEmployeesSubtitle => 'તમારી ટીમ, તેમનો પગાર અને વૈધાનિક વિગતો.';

  @override
  String get hrEmployeesNew => 'કર્મચારી ઉમેરો';

  @override
  String get hrEmployeesNone => 'હજી કોઈ કર્મચારી નથી.';

  @override
  String get hrSectionsPersonal => 'વ્યક્તિગત';

  @override
  String get hrSectionsJob => 'નોકરી';

  @override
  String get hrSectionsStatutory => 'PF, ESI અને કર';

  @override
  String get hrSectionsBank => 'પગાર ચુકવણી';

  @override
  String get hrSectionsSalary => 'પગાર માળખું';

  @override
  String get hrCode => 'કર્મચારી કોડ';

  @override
  String get hrCodeHint => 'આપમેળે નંબર માટે ખાલી રાખો';

  @override
  String get hrName => 'પૂરું નામ';

  @override
  String get hrNameHi => 'હિન્દીમાં નામ (વૈકલ્પિક)';

  @override
  String get hrGender => 'લિંગ';

  @override
  String get hrGendersMale => 'પુરુષ';

  @override
  String get hrGendersFemale => 'સ્ત્રી';

  @override
  String get hrGendersOther => 'અન્ય';

  @override
  String get hrDob => 'જન્મ તારીખ';

  @override
  String get hrJoinedOn => 'જોડાયાની તારીખ';

  @override
  String get hrLeftOn => 'છોડ્યાની તારીખ';

  @override
  String get hrFixedTerm => 'નિયત મુદતનો કર્મચારી';

  @override
  String get hrDepartment => 'વિભાગ';

  @override
  String get hrDesignation => 'હોદ્દો';

  @override
  String get hrWorkState => 'કામનું રાજ્ય';

  @override
  String get hrWorkStateHint => 'આથી વ્યવસાય વેરો નક્કી થાય છે';

  @override
  String get hrPhone => 'મોબાઇલ';

  @override
  String get hrEmail => 'ઇમેઇલ';

  @override
  String get hrAddress => 'સરનામું';

  @override
  String get hrCity => 'શહેર';

  @override
  String get hrPincode => 'પિન કોડ';

  @override
  String get hrPan => 'પાન';

  @override
  String get hrAadhaarLast4 => 'આધાર (ફક્ત છેલ્લા 4 અંક)';

  @override
  String get hrUan => 'UAN';

  @override
  String get hrEsiNumber => 'ESI IP નંબર';

  @override
  String get hrPfMember => 'PF સભ્ય';

  @override
  String get hrEpsEligible => 'પેન્શન યોજનામાં (EPS)';

  @override
  String get hrPfOnActual => 'પૂરા પગાર પર PF (₹15,000થી વધુ)';

  @override
  String get hrDisabled => 'દિવ્યાંગ વ્યક્તિ (₹25,000 સુધી ESI)';

  @override
  String get hrTaxRegime => 'કર વ્યવસ્થા';

  @override
  String get hrRegimesNew => 'નવી વ્યવસ્થા';

  @override
  String get hrRegimesOld => 'જૂની વ્યવસ્થા';

  @override
  String get hrMetro => 'મેટ્રો શહેરમાં રહે છે (HRA માટે)';

  @override
  String get hrPaymentMode => 'ચુકવણી પદ્ધતિ';

  @override
  String get hrPaymentModesBank => 'બેંક ટ્રાન્સફર';

  @override
  String get hrPaymentModesCash => 'રોકડ';

  @override
  String get hrPaymentModesCheque => 'ચેક';

  @override
  String get hrBankName => 'બેંક';

  @override
  String get hrBankIfsc => 'IFSC';

  @override
  String get hrBankAccount => 'ખાતા નંબર';

  @override
  String hrBankAccountHint(String last4) {
    return 'એન્ક્રિપ્ટ કરીને સચવાય છે. નોંધમાં: છેલ્લા $last4';
  }

  @override
  String get hrMonthlyGross => 'માસિક કુલ પગાર';

  @override
  String get hrStatus => 'સ્થિતિ';

  @override
  String get hrStatusesActive => 'સક્રિય';

  @override
  String get hrStatusesLeft => 'છોડી ગયા';

  @override
  String get hrSave => 'સાચવો';

  @override
  String get hrSaved => 'સચવાયું';

  @override
  String get hrCreate => 'કર્મચારી ઉમેરો';

  @override
  String get hrSalaryTitle => 'પગાર માળખું';

  @override
  String get hrSalaryEffectiveFrom => 'થી લાગુ';

  @override
  String get hrSalaryComponent => 'ઘટક';

  @override
  String get hrSalaryMonthly => 'માસિક (₹)';

  @override
  String get hrSalaryPfWage => 'બેઝિક/DA (PF પગાર)';

  @override
  String get hrSalaryHra => 'HRA';

  @override
  String get hrSalaryEsiExcluded => 'ESI પગારમાં નહીં';

  @override
  String get hrSalaryAdd => 'ઘટક ઉમેરો';

  @override
  String get hrSalaryRevise => 'સુધારો સાચવો';

  @override
  String get hrSalaryHistory => 'અગાઉનાં માળખાં';

  @override
  String get hrSalaryGross => 'માસિક કુલ';

  @override
  String get hrSalaryAnnual => 'વાર્ષિક';

  @override
  String get hrSalaryDefaultsBasic => 'બેઝિક';

  @override
  String get hrSalaryDefaultsHra => 'HRA';

  @override
  String get hrSalaryDefaultsSpecial => 'વિશેષ ભથ્થું';

  @override
  String get hrDeclarationTitle => 'કર ઘોષણા';

  @override
  String get hrDeclarationHint =>
      'TDS માટે વપરાય છે. માનક કપાત સિવાયની કપાતો ફક્ત જૂની વ્યવસ્થામાં લાગુ.';

  @override
  String get hrDeclarationFy => 'નાણાકીય વર્ષ';

  @override
  String get hrDeclarationRentPaid => 'વર્ષમાં ભરેલું ભાડું';

  @override
  String get hrDeclarationC80 => '80C રોકાણ (PF આપમેળે ઉમેરાય છે)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) NPS';

  @override
  String get hrDeclarationD80 => '80D આરોગ્ય વીમો';

  @override
  String get hrDeclarationHomeLoanInterest => 'હોમ લોન વ્યાજ';

  @override
  String get hrDeclarationOtherDeductions => 'અન્ય કપાતો (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'અન્ય આવક';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'આ વર્ષે અગાઉના નોકરીદાતાનો પગાર';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'આ વર્ષે પહેલેથી કપાયેલ TDS (અગાઉનો નોકરીદાતા, અથવા Varchasv પહેલાં)';

  @override
  String get hrDeclarationSave => 'ઘોષણા સાચવો';

  @override
  String get hrAttendanceTitle => 'હાજરી';

  @override
  String get hrAttendanceSubtitle =>
      'ન નોંધાયેલા કામકાજના દિવસો હાજર ગણાય છે. ગેરહાજર કરવા દિવસ પર ક્લિક કરો, પછી અડધો દિવસ, પછી ફરી હાજર.';

  @override
  String get hrAttendanceLegendPresent => 'હાજર';

  @override
  String get hrAttendanceLegendAbsent => 'ગેરહાજર';

  @override
  String get hrAttendanceLegendHalfDay => 'અડધો દિવસ';

  @override
  String get hrAttendanceLegendLeave => 'રજા પર';

  @override
  String get hrAttendanceLegendWeekOff => 'સાપ્તાહિક રજા';

  @override
  String get hrAttendanceLegendHoliday => 'તહેવારની રજા';

  @override
  String get hrAttendanceLegendLate => 'મોડું';

  @override
  String get hrAttendanceLop => 'પગાર કપાત';

  @override
  String get hrAttendanceLocked =>
      'આ મહિનાનું પગારપત્રક અંતિમ છે, તેથી હાજરી બદલી શકાતી નથી.';

  @override
  String get hrAttendanceHolidays => 'રજાઓ';

  @override
  String get hrAttendanceAddHoliday => 'રજા ઉમેરો';

  @override
  String get hrAttendanceHolidayName => 'રજા';

  @override
  String get hrAttendanceNoEmployees => 'આ મહિને કોઈ નોકરીમાં ન હતું.';

  @override
  String get hrAttendanceSaving => 'સાચવી રહ્યા છીએ…';

  @override
  String get hrLeaveTitle => 'રજા';

  @override
  String get hrLeaveSubtitle => 'અરજીઓ, મંજૂરીઓ અને બાકી રજા.';

  @override
  String get hrLeaveNew => 'રજા માટે અરજી કરો';

  @override
  String get hrLeaveEmployee => 'કર્મચારી';

  @override
  String get hrLeaveType => 'રજાનો પ્રકાર';

  @override
  String get hrLeaveFrom => 'થી';

  @override
  String get hrLeaveTo => 'સુધી';

  @override
  String get hrLeaveHalfDay => 'અડધો દિવસ';

  @override
  String get hrLeaveReason => 'કારણ';

  @override
  String get hrLeaveDays => 'દિવસ';

  @override
  String get hrLeaveSubmit => 'અરજી મોકલો';

  @override
  String get hrLeaveApprove => 'મંજૂર કરો';

  @override
  String get hrLeaveReject => 'નામંજૂર કરો';

  @override
  String get hrLeaveCancel => 'રદ કરો';

  @override
  String get hrLeavePending => 'મંજૂરીની રાહમાં';

  @override
  String get hrLeaveAll => 'બધી અરજીઓ';

  @override
  String get hrLeaveBalances => 'બાકી રજા';

  @override
  String get hrLeaveOpening => 'આગળથી લાવેલ';

  @override
  String get hrLeaveQuota => 'આ વર્ષે';

  @override
  String get hrLeaveTaken => 'લીધેલી';

  @override
  String get hrLeaveBalance => 'બાકી';

  @override
  String get hrLeaveNone => 'રજાની કોઈ અરજી નથી.';

  @override
  String get hrLeaveStatusesPending => 'બાકી';

  @override
  String get hrLeaveStatusesApproved => 'મંજૂર';

  @override
  String get hrLeaveStatusesRejected => 'નામંજૂર';

  @override
  String get hrLeaveStatusesCancelled => 'રદ';

  @override
  String get hrSettleTitle => 'પૂર્ણ અને અંતિમ હિસાબ';

  @override
  String get hrSettleHint =>
      'કર્મચારીને છોડી ગયા તરીકે નોંધે છે અને ગ્રેચ્યુઇટી તથા રજા રોકડ ચૂકવે છે. છેલ્લા મહિનાનો પગાર પગારપત્રકમાંથી આવે છે.';

  @override
  String get hrSettleLeftOn => 'છેલ્લો કામકાજનો દિવસ';

  @override
  String get hrSettleServiceYears => 'સેવા (વર્ષ)';

  @override
  String get hrSettleGratuity => 'ગ્રેચ્યુઇટી';

  @override
  String get hrSettleNotEligible => 'ચૂકવવાપાત્ર નથી (5 વર્ષથી ઓછું)';

  @override
  String get hrSettleLeaveDays => 'રોકડ કરવાની રજા (દિવસ)';

  @override
  String get hrSettleEncashment => 'રજા રોકડ';

  @override
  String get hrSettleOtherEarnings => 'અન્ય લેણાં (બોનસ, નોટિસ પગાર)';

  @override
  String get hrSettleRecoveries => 'વસૂલાત (એડવાન્સ)';

  @override
  String get hrSettleRemarks => 'નોંધ';

  @override
  String get hrSettleTotal => 'ચોખ્ખું ચૂકવવાપાત્ર';

  @override
  String get hrSettleConfirm => 'હિસાબ કરો અને છોડી ગયા તરીકે નોંધો';

  @override
  String hrSettleDone(String date, String amount) {
    return '$dateએ હિસાબ થયો: $amount';
  }

  @override
  String get hrPayslips => 'પગાર સ્લિપ';

  @override
  String get hrErrorsInvalidPan => 'આ પાન માન્ય નથી (દા.ત. ABCDE1234F).';

  @override
  String get hrErrorsInvalidIfsc => 'આ IFSC માન્ય નથી (દા.ત. HDFC0001234).';

  @override
  String get hrErrorsInvalidBankAccount => '6 થી 18 અંક દાખલ કરો.';

  @override
  String get hrErrorsBasicRequired =>
      'ઓછામાં ઓછા એક ઘટકને બેઝિક/DA તરીકે નોંધો.';

  @override
  String get hrErrorsNoComponents => 'ઓછામાં ઓછો એક પગાર ઘટક ઉમેરો.';

  @override
  String get hrErrorsDuplicateComponent => 'બે ઘટકોનો કોડ સરખો છે.';

  @override
  String get hrErrorsEmployeeCodeTaken => 'આ કોડ બીજા કર્મચારીનો છે.';

  @override
  String get hrErrorsDobAfterJoining => 'જન્મ તારીખ જોડાયા પહેલાંની હોવી જોઈએ.';

  @override
  String get hrErrorsBeforeJoining => 'આ જોડાયાની તારીખ પહેલાંનું છે.';

  @override
  String get hrErrorsLeaveOverlap => 'આ બીજી રજા અરજી સાથે ટકરાય છે.';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'પૂરતી રજા બાકી નથી.';

  @override
  String get hrErrorsNoWorkingDays => 'આ બધી તારીખો રજા કે સાપ્તાહિક રજા છે.';

  @override
  String get hrErrorsHalfDaySingleDate => 'અડધો દિવસ એક જ તારીખનો હોવો જોઈએ.';

  @override
  String get hrErrorsLeaveCrossesYear => '31 માર્ચ પછી જતી રજા અલગ કરો.';

  @override
  String get hrErrorsNotEmployedOnDate => 'તે તારીખે નોકરીમાં ન હતા.';

  @override
  String get hrErrorsDayOnLeave => 'તે દિવસે મંજૂર રજા છે; પહેલાં રજા રદ કરો.';

  @override
  String get hrErrorsPayrollFinalized =>
      'તે મહિનાનું પગારપત્રક પહેલેથી અંતિમ છે.';

  @override
  String get hrErrorsLeaveNotPending => 'આ અરજી પર પહેલેથી નિર્ણય થયો છે.';

  @override
  String get hrErrorsLeaveNotOpen => 'આ અરજી પહેલેથી બંધ છે.';

  @override
  String get hrErrorsLeftBeforeJoining => 'આ જોડાયાની તારીખ પહેલાંનું છે.';

  @override
  String get hrErrorsNoSalaryStructure => 'પહેલાં પગાર માળખું ઉમેરો.';

  @override
  String get hrErrorsAlreadyLeft => 'આ કર્મચારીનો હિસાબ પહેલેથી થયો છે.';

  @override
  String get hrErrorsRecoveriesExceedDues => 'વસૂલાત લેણાંથી વધુ ન હોઈ શકે.';

  @override
  String get hrErrorsInvalidUan => 'UANમાં 12 અંક હોય છે.';

  @override
  String get hrErrorsInvalidEsiNumber => 'ESI IP નંબરમાં 10 થી 17 અંક હોય છે.';

  @override
  String get hrErrorsInvalidAadhaarLast4 => 'ફક્ત છેલ્લા 4 અંક દાખલ કરો.';

  @override
  String get hrErrorsInvalidPhone => '10 અંકનો મોબાઇલ નંબર દાખલ કરો.';

  @override
  String get hrErrorsToBeforeFrom => '“સુધી” “થી” પહેલાં ન હોઈ શકે.';

  @override
  String get hrErrorsUnknownLeaveType => 'રજાનો પ્રકાર પસંદ કરો.';

  @override
  String get hrErrorsUnknownEmployee => 'કર્મચારી પસંદ કરો.';

  @override
  String get hrErrorsLoanNotActive => 'આ લોન પૂરેપૂરી ચૂકવાઈ ગઈ છે અથવા રદ છે.';

  @override
  String get hrErrorsOverRecovery => 'આ રકમ લોન પર બાકી રકમ કરતાં વધુ છે.';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'ચુકવણીની તારીખ લોન આપ્યાની તારીખ પહેલાંની છે.';

  @override
  String get hrErrorsExpiryBeforeIssue =>
      'સમાપ્તિ તારીખ જારી તારીખ પહેલાંની છે.';

  @override
  String get hrLoansTitle => 'એડવાન્સ અને લોન';

  @override
  String get hrLoansNew => 'એડવાન્સ અથવા લોન આપો';

  @override
  String get hrLoansKind => 'પ્રકાર';

  @override
  String get hrLoansKindsAdvance => 'પગાર એડવાન્સ';

  @override
  String get hrLoansKindsLoan => 'લોન';

  @override
  String get hrLoansDate => 'આપ્યાની તારીખ';

  @override
  String get hrLoansAmount => 'રકમ';

  @override
  String get hrLoansInstalment => 'માસિક હપ્તો';

  @override
  String get hrLoansStartPeriod => 'વસૂલાત થી';

  @override
  String get hrLoansPaidFrom => 'માંથી ચૂકવ્યું';

  @override
  String get hrLoansRemarks => 'નોંધ';

  @override
  String get hrLoansRecovered => 'વસૂલ';

  @override
  String get hrLoansBalance => 'બાકી';

  @override
  String get hrLoansStatusesActive => 'વસૂલાત ચાલુ';

  @override
  String get hrLoansStatusesClosed => 'વસૂલ થયું';

  @override
  String get hrLoansStatusesCancelled => 'રદ';

  @override
  String get hrLoansNone => 'કોઈ એડવાન્સ કે લોન નથી.';

  @override
  String get hrLoansCreate => 'ચૂકવો';

  @override
  String get hrLoansCancel => 'રદ કરો';

  @override
  String get hrLoansReceive => 'ચુકવણી લો';

  @override
  String get hrLoansReceiveAmount => 'મળેલી રકમ';

  @override
  String get hrLoansReceivedInto => 'કયા ખાતામાં મળ્યું';

  @override
  String get hrLoansReceiveSave => 'ચુકવણી સાચવો';

  @override
  String get hrShiftsTitle => 'શિફ્ટ';

  @override
  String get hrShiftsName => 'શિફ્ટ';

  @override
  String get hrShiftsStart => 'શરૂ';

  @override
  String get hrShiftsEnd => 'પૂરી';

  @override
  String get hrShiftsGrace => 'છૂટ (મિનિટ)';

  @override
  String get hrShiftsFullDay => 'પૂરો દિવસ (મિનિટ)';

  @override
  String get hrShiftsHalfDay => 'અડધો દિવસ (મિનિટ)';

  @override
  String get hrShiftsIsDefault => 'મુખ્ય';

  @override
  String get hrShiftsAdd => 'શિફ્ટ ઉમેરો';

  @override
  String get hrShiftsSave => 'સાચવો';

  @override
  String get hrShiftsNone =>
      'હજી કોઈ શિફ્ટ નથી. પંચ 09:30–18:30 મુજબ વંચાય છે.';

  @override
  String get hrShiftsShift => 'શિફ્ટ';

  @override
  String get hrShiftsNoShift => 'કંપનીની મુખ્ય';

  @override
  String get hrPunchesTitle => 'પંચ આયાત કરો';

  @override
  String get hrPunchesHint =>
      'બાયોમેટ્રિક મશીનની CSV, કૉલમ: code, date (YYYY-MM-DD), in, out (24 કલાક HH:MM). દરેક દિવસ કર્મચારીની શિફ્ટ મુજબ વંચાય છે.';

  @override
  String get hrPunchesTemplate => 'નમૂના CSV ડાઉનલોડ કરો';

  @override
  String get hrPunchesChoose => 'CSV ફાઇલ પસંદ કરો';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count દિવસ',
      one: '$count દિવસ',
    );
    return '$_temp0 આયાત કરો';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count દિવસ',
      one: '$count દિવસ',
    );
    return '$_temp0 આયાત થયા.';
  }

  @override
  String get hrPunchesRow => 'પંક્તિ';

  @override
  String get hrPunchesCode => 'કોડ';

  @override
  String get hrPunchesDate => 'તારીખ';

  @override
  String get hrPunchesWorked => 'કામ કર્યું';

  @override
  String get hrPunchesStatus => 'પરિણામ';

  @override
  String get hrPunchesLate => 'મોડું';

  @override
  String get hrDocumentsTitle => 'દસ્તાવેજો અને કેવાયસી';

  @override
  String get hrDocumentsHelp =>
      'ઓળખ અને પાલનના દસ્તાવેજો. નંબરના ફક્ત છેલ્લા ચાર અક્ષરો દેખાય છે. મુદત પૂરી થતાં પહેલાં યાદ અપાવવા મુદત ઉમેરો.';

  @override
  String get hrDocumentsNone => 'હજી કોઈ દસ્તાવેજ નોંધાયેલ નથી.';

  @override
  String hrDocumentsExpires(String date) {
    return '$date ના રોજ પૂરું થાય છે';
  }

  @override
  String get hrDocumentsNoExpiry => 'મુદત નથી';

  @override
  String get hrDocumentsExpired => 'સમાપ્ત';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n દિવસ બાકી',
      one: '$n દિવસ બાકી',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'દૂર કરો';

  @override
  String get hrDocumentsKind => 'દસ્તાવેજ';

  @override
  String get hrDocumentsNumber => 'નંબર';

  @override
  String get hrDocumentsIssuedOn => 'જારી તારીખ';

  @override
  String get hrDocumentsExpiresOnLabel => 'સમાપ્તિ તારીખ';

  @override
  String get hrDocumentsAdd => 'દસ્તાવેજ ઉમેરો';

  @override
  String get hrDocumentsKindsAadhaar => 'આધાર';

  @override
  String get hrDocumentsKindsPan => 'પાન';

  @override
  String get hrDocumentsKindsPassport => 'પાસપોર્ટ';

  @override
  String get hrDocumentsKindsDrivingLicence => 'ડ્રાઇવિંગ લાઇસન્સ';

  @override
  String get hrDocumentsKindsVoterId => 'મતદાર ઓળખપત્ર';

  @override
  String get hrDocumentsKindsBankProof => 'બેંક પુરાવો';

  @override
  String get hrDocumentsKindsPoliceVerification => 'પોલીસ ચકાસણી';

  @override
  String get hrDocumentsKindsMedicalFitness => 'તબીબી ફિટનેસ';

  @override
  String get hrDocumentsKindsContract => 'કરાર';

  @override
  String get hrDocumentsKindsOther => 'અન્ય';

  @override
  String get hrDocumentsExpiringTitle => 'સમાપ્ત થતા દસ્તાવેજો';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'કાર્યરત કર્મચારીઓના દસ્તાવેજો જે પૂરા થઈ ગયા છે કે જલદી થશે, સૌથી પહેલા ઉપર.';

  @override
  String get hrDocumentsWithin => 'આટલા સમયમાં સમાપ્ત';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n દિવસ',
      one: '$n દિવસ',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'બતાવો';

  @override
  String get hrDocumentsEmployee => 'કર્મચારી';

  @override
  String get hrDocumentsNoneExpiring => 'આ સમયગાળામાં કંઈ સમાપ્ત થતું નથી.';

  @override
  String get payrollTitle => 'પગારપત્રક';

  @override
  String get payrollSubtitle =>
      'PF, ESI, વ્યવસાય વેરો અને TDS ગણીને માસિક પગાર, તમારા હિસાબમાં નોંધાયેલ.';

  @override
  String get payrollRun => 'પગાર ગણો';

  @override
  String get payrollMonth => 'મહિનો';

  @override
  String get payrollNone => 'હજી પગાર ગણાયો નથી.';

  @override
  String payrollEmployees(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count કર્મચારીઓ',
      one: '$count કર્મચારી',
    );
    return '$_temp0';
  }

  @override
  String get payrollStatusesDraft => 'ડ્રાફ્ટ';

  @override
  String get payrollStatusesFinalized => 'અંતિમ';

  @override
  String get payrollStatusesPaid => 'ચૂકવ્યો';

  @override
  String get payrollStatusesCancelled => 'રદ';

  @override
  String get payrollColsEmployee => 'કર્મચારી';

  @override
  String get payrollColsPaidDays => 'પગારના દિવસો';

  @override
  String get payrollColsLop => 'કપાતના દિવસો';

  @override
  String get payrollColsGross => 'કુલ';

  @override
  String get payrollColsPf => 'PF';

  @override
  String get payrollColsEsi => 'ESI';

  @override
  String get payrollColsPt => 'વ્યવસાય વેરો';

  @override
  String get payrollColsLwf => 'LWF';

  @override
  String get payrollColsTds => 'TDS';

  @override
  String get payrollColsOther => 'અન્ય';

  @override
  String get payrollColsNet => 'ચોખ્ખો પગાર';

  @override
  String get payrollRefresh => 'હાજરીમાંથી અપડેટ કરો';

  @override
  String get payrollFinalize => 'અંતિમ કરો અને નોંધો';

  @override
  String get payrollFinalizeHint =>
      'પગાર, PF, ESI, વ્યવસાય વેરો અને TDS ચૂકવવાપાત્ર તમારા હિસાબમાં નોંધે છે. પછી મહિનાની હાજરી લૉક થાય છે.';

  @override
  String get payrollPay => 'ચુકવણી નોંધો';

  @override
  String get payrollPayFrom => 'માંથી ચૂકવ્યું';

  @override
  String get payrollPayDate => 'ચુકવણીની તારીખ';

  @override
  String get payrollCancel => 'પગાર રદ કરો';

  @override
  String get payrollFilesTitle => 'ભરવા અને ચુકવણી માટે ફાઇલો';

  @override
  String get payrollFilesEcr => 'EPF ECR';

  @override
  String get payrollFilesEsi => 'ESI ફાળો';

  @override
  String get payrollFilesBank => 'બેંક ટ્રાન્સફર';

  @override
  String payrollFilesMissing(String codes) {
    return 'છોડી દીધા (વિગતો નથી): $codes';
  }

  @override
  String get payrollTotalsGross => 'કુલ પગાર';

  @override
  String get payrollTotalsDeductions => 'કપાત';

  @override
  String get payrollTotalsNet => 'ચોખ્ખો પગાર';

  @override
  String get payrollTotalsEmployer => 'નોકરીદાતાના PF/ESI/LWF';

  @override
  String get payrollLopEdited => 'હાથથી લખ્યું';

  @override
  String get payrollLopReset => 'હાજરી વાપરો';

  @override
  String get payrollAddDeduction => 'કપાત ઉમેરો';

  @override
  String get payrollDeductionName => 'કપાત';

  @override
  String get payrollDeductionAmount => 'રકમ';

  @override
  String get payrollEdit => 'ફેરફાર કરો';

  @override
  String get payrollView => 'પગાર સ્લિપ';

  @override
  String get payrollErrorsRunExists => 'તે મહિનાનો પગાર પહેલેથી છે.';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'પહેલાં અગાઉના મહિનાનો ડ્રાફ્ટ અંતિમ કે રદ કરો.';

  @override
  String get payrollErrorsRunNotDraft => 'ફક્ત ડ્રાફ્ટ બદલી શકાય.';

  @override
  String get payrollErrorsRunEmpty => 'અંતિમ કરવા કોઈ પગાર સ્લિપ નથી.';

  @override
  String get payrollErrorsRunNotFinalized => 'પહેલાં પગાર અંતિમ કરો.';

  @override
  String get payrollErrorsRunPaid => 'ચૂકવેલો પગાર રદ ન થઈ શકે.';

  @override
  String get payrollErrorsLaterRunFinal =>
      'પછીનો મહિનો પહેલેથી અંતિમ છે; પહેલાં તે રદ કરો.';

  @override
  String get payrollErrorsLopExceedsDays =>
      'કપાતના દિવસો મહિનાના દિવસોથી વધુ છે.';

  @override
  String get payrollErrorsDeductionsExceedPay => 'કપાત પગારથી વધુ છે.';

  @override
  String get payrollErrorsInvalidPeriod => 'મહિનો પસંદ કરો.';

  @override
  String get payrollErrorsInvalidSettings => 'સેટિંગ્સ તપાસો.';

  @override
  String get payrollErrorsReservedCode =>
      'આ કોડ આપમેળે ગણાતા એરિયર્સ માટે અનામત છે.';

  @override
  String get payrollErrorsInvalidInstalment =>
      'હપ્તો 0થી વધુ અને રકમથી વધુ નહીં હોવો જોઈએ.';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'લોન આપ્યા પહેલાં વસૂલાત શરૂ ન થઈ શકે.';

  @override
  String get payrollErrorsEmployeeNotActive => 'આ કર્મચારી છોડી ગયા છે.';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'આમાંથી થોડું પહેલેથી વસૂલ થયું છે; રદ ન થઈ શકે.';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'BSR કોડ અને ચલણ ક્રમાંક દાખલ કરો.';

  @override
  String get payrollErrorsInvalidBsrCode => 'BSR કોડમાં 7 અંક હોય છે.';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'ચલણ ક્રમાંકમાં 5 અંક સુધી હોય છે.';

  @override
  String get payrollErrorsInvalidTan => 'આ TAN માન્ય નથી (દા.ત. MUMA12345B).';

  @override
  String get payrollErrorsNoFinalPayslips =>
      'તે વર્ષની કોઈ અંતિમ પગાર સ્લિપ નથી.';

  @override
  String get payrollErrorsInvalidTime => '09:30 જેવો 24 કલાકનો સમય વાપરો.';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'અડધો દિવસ પૂરા દિવસથી લાંબો ન હોઈ શકે.';

  @override
  String get payrollErrorsInvalidAmount => 'રકમ દાખલ કરો.';

  @override
  String get payrollSettingsTitle => 'પગારપત્રક સેટિંગ્સ';

  @override
  String get payrollSettingsSubtitle =>
      'નોંધણી કોડ, સાપ્તાહિક રજાઓ અને રાજ્ય વેરા.';

  @override
  String get payrollSettingsPfCode => 'EPF સંસ્થા કોડ';

  @override
  String get payrollSettingsEsiCode => 'ESI નોકરીદાતા કોડ';

  @override
  String get payrollSettingsLabourCode =>
      'શ્રમ સંહિતાનો 50% પગાર નિયમ લાગુ કરો';

  @override
  String get payrollSettingsLabourCodeHint =>
      'સામાજિક સુરક્ષા સંહિતા હેઠળ (21 નવે 2025થી), ભથ્થાં પગારના અડધાથી વધુ હોય તો વધારાનો ભાગ PF પગાર ગણાય છે.';

  @override
  String get payrollSettingsWeeklyOffs => 'સાપ્તાહિક રજાઓ';

  @override
  String get payrollSettingsLwf => 'શ્રમ કલ્યાણ ફંડ';

  @override
  String get payrollSettingsLwfEmployee => 'કર્મચારીનો હિસ્સો (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'નોકરીદાતાનો હિસ્સો (₹)';

  @override
  String get payrollSettingsLwfMonths => 'કપાતના મહિના';

  @override
  String get payrollSettingsEncashment => 'દૈનિક રજા રોકડ';

  @override
  String payrollSettingsDivisor(String n) {
    return 'માસિક પગાર ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'સાચવો';

  @override
  String get payrollSettingsTan => 'TAN (કર કપાત ખાતા નંબર)';

  @override
  String get payrollSlipTitle => 'પગાર સ્લિપ';

  @override
  String payrollSlipFor(String month) {
    return '$monthની પગાર સ્લિપ';
  }

  @override
  String get payrollSlipEarnings => 'કમાણી';

  @override
  String get payrollSlipDeductions => 'કપાત';

  @override
  String get payrollSlipNetPay => 'ચોખ્ખો પગાર';

  @override
  String get payrollSlipInWords => 'શબ્દોમાં';

  @override
  String get payrollSlipEmployer => 'નોકરીદાતાનો ફાળો (કપાયો નથી)';

  @override
  String get payrollSlipTax => 'આવકવેરા ગણતરી';

  @override
  String get payrollSlipAnnualSalary => 'વર્ષનો અંદાજિત પગાર';

  @override
  String get payrollSlipTaxableIncome => 'કરપાત્ર આવક';

  @override
  String get payrollSlipAnnualTax => 'વર્ષનો કર';

  @override
  String get payrollSlipDeductedSoFar => 'અત્યાર સુધી કપાયો';

  @override
  String get payrollSlipPfEmployee => 'પ્રોવિડન્ટ ફંડ';

  @override
  String get payrollSlipEsiEmployee => 'ESI';

  @override
  String get payrollSlipPt => 'વ્યવસાય વેરો';

  @override
  String get payrollSlipLwf => 'શ્રમ કલ્યાણ ફંડ';

  @override
  String get payrollSlipTds => 'આવકવેરો (TDS)';

  @override
  String get payrollSlipEps => 'પેન્શન (EPS)';

  @override
  String get payrollSlipEpf => 'PF (નોકરીદાતા)';

  @override
  String get payrollSlipEdli => 'EDLI';

  @override
  String get payrollSlipAdmin => 'PF વહીવટ';

  @override
  String get payrollSlipEsiEmployer => 'ESI (નોકરીદાતા)';

  @override
  String get payrollSlipComputerGenerated =>
      'આ કમ્પ્યુટર દ્વારા બનાવેલી પગાર સ્લિપ છે, સહીની જરૂર નથી.';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count અગાઉના મહિના',
      one: '$count અગાઉનો મહિનો',
    );
    return 'પગાર માળખામાંથી અંદાજિત $_temp0 સામેલ (Varchasv પહેલાં ચૂકવેલ).';
  }

  @override
  String get payrollExtraTitle => 'વધારાની કમાણી (ફક્ત આ મહિને)';

  @override
  String get payrollExtraName => 'કમાણી';

  @override
  String get payrollExtraAmount => 'રકમ';

  @override
  String get payrollExtraAdd => 'કમાણી ઉમેરો';

  @override
  String get payrollExtraEsiExcluded => 'ESI પગારમાં નહીં (દા.ત. બોનસ)';

  @override
  String get payrollLoanRecoveryTitle => 'લોન અને એડવાન્સના હપ્તા';

  @override
  String get payrollLoanRecoveryHint =>
      'આ મહિને છોડવા 0 લખો; હપ્તો વાપરવા ખાલી કરો.';

  @override
  String get payrollRegister => 'પગાર રજિસ્ટર';

  @override
  String get payrollEmail => 'પગાર સ્લિપ ઇમેઇલ કરો';

  @override
  String payrollEmailed(String sent) {
    return '$sent ઇમેઇલ કરી.';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'ઇમેઇલ સરનામું નથી: $codes';
  }

  @override
  String get statutoryTitle => 'વૈધાનિક લેણાં અને TDS';

  @override
  String get statutorySubtitle =>
      'અંતિમ પગારમાંથી PF, ESI, વ્યવસાય વેરો, LWF અને TDS, શું ચૂકવાયું, ત્રિમાસિક TDS રિટર્ન અને ફોર્મ 16.';

  @override
  String get statutoryFy => 'નાણાકીય વર્ષ';

  @override
  String get statutoryDues => 'લેણાં અને ચુકવણી';

  @override
  String get statutoryKind => 'પ્રકાર';

  @override
  String get statutoryKindsPf => 'PF';

  @override
  String get statutoryKindsEsi => 'ESI';

  @override
  String get statutoryKindsPt => 'વ્યવસાય વેરો';

  @override
  String get statutoryKindsLwf => 'LWF';

  @override
  String get statutoryKindsTds => 'TDS';

  @override
  String get statutoryPeriod => 'પગારનો મહિનો';

  @override
  String get statutoryDue => 'ચૂકવવાપાત્ર';

  @override
  String get statutoryPaid => 'ચૂકવ્યું';

  @override
  String get statutoryBalance => 'બાકી';

  @override
  String get statutoryDueDate => 'છેલ્લી તારીખ';

  @override
  String get statutoryPay => 'ચુકવણી નોંધો';

  @override
  String get statutoryPaidOn => 'ચૂકવ્યાની તારીખ';

  @override
  String get statutoryAccount => 'માંથી ચૂકવ્યું';

  @override
  String get statutoryReference => 'ચલણ / TRRN નં.';

  @override
  String get statutoryBsrCode => 'BSR કોડ';

  @override
  String get statutoryChallanSerial => 'ચલણ ક્રમાંક';

  @override
  String get statutoryRecord => 'ચુકવણી સાચવો';

  @override
  String get statutoryNone => 'આ વર્ષે હજી કોઈ અંતિમ પગાર નથી.';

  @override
  String get statutoryOverdue => 'મુદત વીતી';

  @override
  String get statutoryQ24Title => 'ત્રિમાસિક TDS રિટર્ન (ફોર્મ 24Q)';

  @override
  String get statutoryQ24Quarter => 'ત્રિમાસિક';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · એપ્રિલ–જૂન';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · જુલાઈ–સપ્ટે';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · ઑક્ટો–ડિસે';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · જાન્યુ–માર્ચ';

  @override
  String get statutoryQ24Deductees => 'કપાતધારક પંક્તિઓ';

  @override
  String get statutoryQ24Challans => 'ચલણ';

  @override
  String get statutoryQ24TotalTds => 'TDS';

  @override
  String get statutoryQ24Download => 'કપાતધારક પંક્તિઓ (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'પરિશિષ્ટ II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'આને NSDL રિટર્ન પ્રિપેરેશન યુટિલિટી (RPU)માં આયાત કરો, FVUથી ફાઇલ તપાસો, પછી TIN-NSDL પર અપલોડ કરો.';

  @override
  String get statutoryQ24WarningsTanMissing =>
      'પગારપત્રક સેટિંગ્સમાં TAN ઉમેરો.';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return '$detailનો પાન નથી: પાન વગર 20% દરે કર કાપવો જોઈએ.';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return '$detail માટે કાપેલો અને જમા કરેલો કર મેળ ખાતો નથી.';
  }

  @override
  String get statutoryForm16Title => 'ફોર્મ 16';

  @override
  String get statutoryForm16Hint =>
      'ભાગ B પગારપત્રકમાંથી. ભાગ A TRACESમાંથી ડાઉનલોડ કરી જોડો; બંને પર નોકરીદાતાની સહી.';

  @override
  String get statutoryForm16View => 'ભાગ B';

  @override
  String get form16Title => 'ફોર્મ 16 · ભાગ B';

  @override
  String get form16Subtitle =>
      'પગાર પર સ્ત્રોત પર કપાયેલા કર માટે કલમ 203 હેઠળ પ્રમાણપત્ર';

  @override
  String get form16Employer => 'નોકરીદાતા';

  @override
  String get form16Employee => 'કર્મચારી';

  @override
  String get form16Tan => 'TAN';

  @override
  String get form16Pan => 'પાન';

  @override
  String get form16Ay => 'આકારણી વર્ષ';

  @override
  String get form16Period => 'નોકરીનો સમયગાળો';

  @override
  String get form16Salary => 'ચૂકવેલો પગાર';

  @override
  String get form16Gross => 'કુલ પગાર';

  @override
  String get form16Previous => 'અગાઉના નોકરીદાતાનો પગાર';

  @override
  String get form16Exemptions => 'બાદ: કલમ 16 હેઠળ મુક્તિ અને કપાત';

  @override
  String get form16HraExempt => 'ઘરભાડા ભથ્થું મુક્તિ';

  @override
  String get form16StandardDeduction => 'માનક કપાત';

  @override
  String get form16Pt => 'વ્યવસાય વેરો';

  @override
  String get form16HouseProperty => 'મકાન મિલકતની આવક (હોમ લોન વ્યાજ)';

  @override
  String get form16ChapterVIA => 'પ્રકરણ VI-A હેઠળ કપાતો';

  @override
  String get form16TaxableIncome => 'કુલ કરપાત્ર આવક';

  @override
  String get form16Tax => 'કુલ આવક પર કર';

  @override
  String get form16Rebate => 'કલમ 87A હેઠળ રિબેટ';

  @override
  String get form16Surcharge => 'સરચાર્જ';

  @override
  String get form16Cess => 'આરોગ્ય અને શિક્ષણ સેસ';

  @override
  String get form16Total => 'ચૂકવવાપાત્ર કર';

  @override
  String get form16Regime => 'કર વ્યવસ્થા';

  @override
  String get form16TdsQuarterly => 'કાપેલો અને જમા કરેલો કર';

  @override
  String get form16Quarter => 'ત્રિમાસિક';

  @override
  String get form16Challans => 'ચલણ (BSR કોડ · તારીખ · ક્રમાંક)';

  @override
  String get form16TdsDeducted => 'કુલ કાપેલો કર';

  @override
  String get form16Balance => 'ચૂકવવાપાત્ર કર (પરત)';

  @override
  String get form16Verification =>
      'ઉપલબ્ધ હિસાબી ચોપડા, દસ્તાવેજો અને રેકોર્ડના આધારે ઉપરની માહિતી સાચી અને યોગ્ય હોવાનું પ્રમાણિત કરવામાં આવે છે.';

  @override
  String get form16Signature => 'કર કાપવા માટે જવાબદાર વ્યક્તિની સહી';

  @override
  String get form16PartA => 'ભાગ A (TRACESમાંથી) જોડવો.';

  @override
  String form16Missing(String months) {
    return '$monthsની પગાર સ્લિપ અહીં નથી (Varchasv પહેલાં ચૂકવેલ). સહી પહેલાં તે પગાર અને કર ઉમેરો.';
  }

  @override
  String get mfgBomsTitle => 'સામગ્રી યાદી (BOM)';

  @override
  String get mfgBomsSubtitle =>
      'તમે બનાવો છો તે દરેક વસ્તુમાં શું જાય છે, બગાડ, વર્ક સેન્ટર સમય અને ઓવરહેડ સાથે.';

  @override
  String get mfgBomsNew => 'નવું બીઓએમ';

  @override
  String get mfgBomsItem => 'બનતી વસ્તુ';

  @override
  String get mfgBomsVersion => 'આવૃત્તિ';

  @override
  String get mfgBomsOutputQty => 'ઉત્પાદન (જથ્થો)';

  @override
  String get mfgBomsOverhead => 'બેચ દીઠ નિશ્ચિત ઓવરહેડ (₹)';

  @override
  String get mfgBomsComponent => 'સામગ્રી';

  @override
  String get mfgBomsQty => 'જથ્થો';

  @override
  String get mfgBomsWastage => 'બગાડ %';

  @override
  String get mfgBomsOperations => 'પ્રક્રિયાઓ';

  @override
  String get mfgBomsOperation => 'પ્રક્રિયા';

  @override
  String get mfgBomsWorkCentre => 'વર્ક સેન્ટર';

  @override
  String get mfgBomsMinutes => 'મિનિટ';

  @override
  String get mfgBomsAddLine => 'સામગ્રી ઉમેરો';

  @override
  String get mfgBomsAddOperation => 'પ્રક્રિયા ઉમેરો';

  @override
  String get mfgBomsSave => 'બીઓએમ સાચવો';

  @override
  String get mfgBomsMakeDefault => 'મુખ્ય તરીકે વાપરો';

  @override
  String get mfgBomsDefault => 'મુખ્ય';

  @override
  String get mfgBomsArchive => 'આર્કાઇવ કરો';

  @override
  String get mfgBomsArchived => 'આર્કાઇવ';

  @override
  String get mfgBomsUnitCost => 'એકમ દીઠ ખર્ચ';

  @override
  String get mfgBomsOverheadPerUnit => 'એકમ દીઠ ઓવરહેડ';

  @override
  String get mfgBomsRate => 'દર';

  @override
  String get mfgBomsCost => 'ખર્ચ';

  @override
  String get mfgBomsNone => 'હજી કોઈ બીઓએમ નથી.';

  @override
  String get mfgBomsNotes => 'નોંધ';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count સામગ્રીઓ',
      one: '$count સામગ્રી',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'વર્ક સેન્ટર';

  @override
  String get mfgWorkCentresName => 'વર્ક સેન્ટર';

  @override
  String get mfgWorkCentresCostPerHour => 'કલાક દીઠ ખર્ચ (₹)';

  @override
  String get mfgWorkCentresAdd => 'વર્ક સેન્ટર ઉમેરો';

  @override
  String get mfgWorkCentresSave => 'સાચવો';

  @override
  String get mfgOrdersTitle => 'ઉત્પાદન ઓર્ડર';

  @override
  String get mfgOrdersSubtitle =>
      'ઉત્પાદનનું આયોજન, શરૂઆત અને પૂર્ણતા. સામગ્રી સ્ટોકમાંથી જાય છે અને ઉત્પાદન ખર્ચ પર આવે છે.';

  @override
  String get mfgOrdersNew => 'નવો ઉત્પાદન ઓર્ડર';

  @override
  String get mfgOrdersItem => 'વસ્તુ';

  @override
  String get mfgOrdersQty => 'જથ્થો';

  @override
  String get mfgOrdersDate => 'તારીખ';

  @override
  String get mfgOrdersStatus => 'સ્થિતિ';

  @override
  String get mfgOrdersStatusesPlanned => 'આયોજિત';

  @override
  String get mfgOrdersStatusesReleased => 'શરૂ';

  @override
  String get mfgOrdersStatusesCompleted => 'પૂર્ણ';

  @override
  String get mfgOrdersStatusesCancelled => 'રદ';

  @override
  String get mfgOrdersProduced => 'ઉત્પાદિત';

  @override
  String get mfgOrdersRejected => 'નકાર્યું';

  @override
  String get mfgOrdersRelease => 'શરૂ કરો';

  @override
  String get mfgOrdersIssue => 'વધારાની સામગ્રી આપો';

  @override
  String get mfgOrdersComplete => 'ઉત્પાદન નોંધો';

  @override
  String get mfgOrdersGoodQty => 'સારો જથ્થો';

  @override
  String get mfgOrdersRejectedQty => 'નકારેલ';

  @override
  String get mfgOrdersClose => 'આ પછી ઓર્ડર બંધ કરો';

  @override
  String get mfgOrdersRemaining => 'હજી બનાવવાનું';

  @override
  String get mfgOrdersMaterials => 'બાકી માટે સામગ્રી';

  @override
  String get mfgOrdersEntries => 'ઇતિહાસ';

  @override
  String get mfgOrdersUnitCost => 'એકમ ખર્ચ';

  @override
  String get mfgOrdersMaterialCost => 'સામગ્રી ખર્ચ';

  @override
  String get mfgOrdersOverheadCost => 'ઓવરહેડ';

  @override
  String get mfgOrdersKindsIssue => 'વધારાની સામગ્રી';

  @override
  String get mfgOrdersKindsComplete => 'ઉત્પાદન';

  @override
  String get mfgOrdersReleaseNow => 'તરત શરૂ કરો';

  @override
  String get mfgOrdersNone => 'હજી કોઈ ઉત્પાદન ઓર્ડર નથી.';

  @override
  String get mfgOrdersSave => 'ઓર્ડર બનાવો';

  @override
  String get mfgOrdersCancel => 'ઓર્ડર રદ કરો';

  @override
  String get mfgMrpTitle => 'માલ આયોજન (MRP)';

  @override
  String get mfgMrpSubtitle =>
      'ખુલ્લા વેચાણ ઓર્ડર અને ફરી ઓર્ડર સ્તર પૂરા કરવા શું બનાવવું અને શું ખરીદવું, સ્ટોક અને પહેલેથી મંગાવેલું બાદ કરીને.';

  @override
  String get mfgMrpAsOf => 'આ તારીખ મુજબ આયોજન';

  @override
  String get mfgMrpAction => 'ક્રિયા';

  @override
  String get mfgMrpActionsMake => 'બનાવો';

  @override
  String get mfgMrpActionsBuy => 'ખરીદો';

  @override
  String get mfgMrpQty => 'જથ્થો';

  @override
  String get mfgMrpNeedBy => 'સુધી જોઈએ';

  @override
  String get mfgMrpReleaseBy => 'શરૂ / ઓર્ડર સુધીમાં';

  @override
  String get mfgMrpOnHand => 'હાથ પર';

  @override
  String get mfgMrpOnOrder => 'મંગાવેલું';

  @override
  String get mfgMrpSupplier => 'સપ્લાયર';

  @override
  String get mfgMrpConvert => 'પસંદ કરેલાના ઓર્ડર બનાવો';

  @override
  String mfgMrpCreated(String orders) {
    return '$orders બન્યા.';
  }

  @override
  String get mfgMrpNone =>
      'આયોજનની જરૂર નથી: સ્ટોક અને ઓર્ડર માંગ પૂરી કરે છે.';

  @override
  String get mfgJobWorkTitle => 'જોબ વર્ક';

  @override
  String get mfgJobWorkSubtitle =>
      'ચલણ પર જોબ વર્કરને મોકલેલો અને પ્રક્રિયા પછી પાછો આવેલો માલ. કાચો માલ એક વર્ષમાં પાછો આવવો જોઈએ (મૂડી માલ ત્રણ વર્ષમાં).';

  @override
  String get mfgJobWorkSend => 'જોબ વર્ક માટે મોકલો';

  @override
  String get mfgJobWorkReceive => 'પાછું સ્વીકારો';

  @override
  String get mfgJobWorkJobWorker => 'જોબ વર્કર';

  @override
  String get mfgJobWorkProcess => 'પ્રક્રિયા';

  @override
  String get mfgJobWorkSent => 'મોકલ્યું';

  @override
  String get mfgJobWorkPending => 'હજી જોબ વર્કર પાસે';

  @override
  String get mfgJobWorkReturnBy => 'પરત કરવાની મુદત';

  @override
  String get mfgJobWorkOverdue => 'મુદત વીતી';

  @override
  String get mfgJobWorkReceived => 'સ્વીકારેલી વસ્તુ';

  @override
  String get mfgJobWorkConsumed => 'વપરાયેલો માલ';

  @override
  String get mfgJobWorkCharges => 'જોબ ચાર્જ (₹)';

  @override
  String get mfgJobWorkFrom => 'ચલણમાંથી';

  @override
  String get mfgJobWorkItc04 => 'ITC-04 (છમાસિક)';

  @override
  String get mfgJobWorkHalf => 'છમાસિક';

  @override
  String get mfgJobWorkHalvesH1 => 'એપ્રિલ–સપ્ટેમ્બર';

  @override
  String get mfgJobWorkHalvesH2 => 'ઑક્ટોબર–માર્ચ';

  @override
  String get mfgJobWorkSentTable => 'મોકલેલો માલ';

  @override
  String get mfgJobWorkReceivedTable => 'પાછો આવેલો માલ';

  @override
  String get mfgJobWorkPendingTable => 'જોબ વર્કર પાસે બાકી';

  @override
  String get mfgJobWorkNone => 'હજી કોઈ જોબ વર્ક નથી.';

  @override
  String get mfgJobWorkCapitalGoods => 'મૂડી માલ';

  @override
  String get mfgErrorsBomCycle =>
      'આથી ચક્ર બને છે: વસ્તુને પોતાની જ જરૂર પડશે.';

  @override
  String get mfgErrorsBomEmpty => 'ઓછામાં ઓછી એક સામગ્રી ઉમેરો.';

  @override
  String get mfgErrorsInvalidOutputQty => 'એક બેચમાં કેટલું બને તે દાખલ કરો.';

  @override
  String get mfgErrorsDuplicateComponent => 'એક સામગ્રી બે વાર આવી છે.';

  @override
  String get mfgErrorsUnknownWorkCentre => 'વર્ક સેન્ટર પસંદ કરો.';

  @override
  String get mfgErrorsNoBom => 'આ વસ્તુનું સક્રિય બીઓએમ નથી.';

  @override
  String get mfgErrorsBomArchived => 'તે બીઓએમ આર્કાઇવ છે.';

  @override
  String get mfgErrorsOrderNotPlanned => 'ફક્ત આયોજિત ઓર્ડર શરૂ કરી શકાય.';

  @override
  String get mfgErrorsOrderNotReleased => 'પહેલાં ઓર્ડર શરૂ કરો.';

  @override
  String get mfgErrorsSupplierRequired =>
      'ખરીદવાની વસ્તુઓ માટે સપ્લાયર પસંદ કરો.';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'જોબ વર્કર તરીકે સપ્લાયર અથવા ગ્રાહક પસંદ કરો.';

  @override
  String get mfgErrorsUnknownChallan => 'મોકલેલું ચલણ પસંદ કરો.';

  @override
  String get mfgErrorsChallanCancelled => 'તે ચલણ રદ છે.';

  @override
  String get mfgErrorsItemNotSent => 'આ વસ્તુ આ ચલણ પર મોકલી ન હતી.';

  @override
  String get mfgErrorsMoreThanSent => 'આ જોબ વર્કર પાસે બાકી કરતાં વધુ છે.';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'આ ચલણ પર માલ પાછો આવ્યો છે; પહેલાં તે રદ કરો.';

  @override
  String get posBillingTitle => 'બિલિંગ';

  @override
  String get posBillingTerminal => 'કાઉન્ટર';

  @override
  String get posBillingChooseTerminal => 'કાઉન્ટર પસંદ કરો';

  @override
  String get posBillingOpenShift => 'શિફ્ટ શરૂ કરો';

  @override
  String get posBillingOpeningCash => 'શરૂઆતની રોકડ (₹)';

  @override
  String get posBillingCloseShift => 'શિફ્ટ બંધ કરો';

  @override
  String get posBillingCountedCash => 'ગણેલી રોકડ (₹)';

  @override
  String get posBillingExpected => 'અપેક્ષિત';

  @override
  String get posBillingDifference => 'તફાવત';

  @override
  String get posBillingSearch => 'બારકોડ સ્કેન કરો અથવા વસ્તુ શોધો';

  @override
  String get posBillingCart => 'બિલ';

  @override
  String get posBillingEmpty => 'બિલ શરૂ કરવા વસ્તુઓ ઉમેરો.';

  @override
  String get posBillingQty => 'જથ્થો';

  @override
  String get posBillingPrice => 'ભાવ';

  @override
  String get posBillingAmount => 'રકમ';

  @override
  String get posBillingDiscount => 'બિલ વળતર (₹)';

  @override
  String get posBillingCustomer => 'ગ્રાહકનો મોબાઇલ (પોઇન્ટ માટે)';

  @override
  String get posBillingCustomerName => 'નામ';

  @override
  String posBillingPoints(String points) {
    return '$points પોઇન્ટ';
  }

  @override
  String get posBillingRedeem => 'પોઇન્ટ વાપરો';

  @override
  String posBillingRedeemable(String points, String value) {
    return '$points પોઇન્ટ સુધી (₹$value)';
  }

  @override
  String get posBillingPayments => 'ચુકવણી';

  @override
  String get posBillingModesCash => 'રોકડ';

  @override
  String get posBillingModesUpi => 'UPI';

  @override
  String get posBillingModesCard => 'કાર્ડ';

  @override
  String get posBillingModesCredit => 'ઉધાર ખાતે';

  @override
  String get posBillingReference => 'સંદર્ભ';

  @override
  String get posBillingAddPayment => 'ચુકવણી વહેંચો';

  @override
  String get posBillingPay => 'બિલ પૂર્ણ કરો';

  @override
  String get posBillingTotal => 'કુલ';

  @override
  String get posBillingChange => 'પાછા આપવાના';

  @override
  String get posBillingDue => 'હજી બાકી';

  @override
  String get posBillingTaxable => 'કરપાત્ર';

  @override
  String get posBillingTax => 'જીએસટી';

  @override
  String get posBillingRoundOff => 'રાઉન્ડ ઓફ';

  @override
  String posBillingDone(String number) {
    return 'બિલ $number સચવાયું';
  }

  @override
  String get posBillingPrint => 'રસીદ છાપો';

  @override
  String get posBillingNewBill => 'નવું બિલ';

  @override
  String get posBillingShiftTotals => 'આ શિફ્ટ';

  @override
  String get posBillingBills => 'બિલ';

  @override
  String get posBillingDeviceTerminal =>
      'આ કાઉન્ટર પોતાના ડિવાઇસથી બિલ કરે છે (ઓફલાઇન એપ).';

  @override
  String get posBillsTitle => 'પીઓએસ બિલ';

  @override
  String get posBillsSubtitle => 'એક દિવસનાં બધાં કાઉન્ટરનાં બિલ.';

  @override
  String get posBillsDate => 'તારીખ';

  @override
  String get posBillsNumber => 'બિલ નં.';

  @override
  String get posBillsTime => 'સમય';

  @override
  String get posBillsMode => 'ચુકવણી પદ્ધતિ';

  @override
  String get posBillsVoid => 'રદ કરો';

  @override
  String get posBillsVoided => 'રદ';

  @override
  String get posBillsReason => 'કારણ';

  @override
  String get posBillsSummary => 'દિવસનો સારાંશ';

  @override
  String get posBillsTopItems => 'સૌથી વધુ વેચાયેલ';

  @override
  String get posBillsMismatch => 'ડિવાઇસનો સરવાળો અલગ હતો';

  @override
  String get posBillsNone => 'આ દિવસે કોઈ બિલ નથી.';

  @override
  String get posSettingsTitle => 'કાઉન્ટર સેટિંગ';

  @override
  String get posSettingsSubtitle =>
      'ભાવ, લૉયલ્ટી પૉઇન્ટ, છૂટની મર્યાદા અને કાઉન્ટર.';

  @override
  String get posSettingsPricesIncludeTax => 'ભાવમાં જીએસટી સામેલ';

  @override
  String get posSettingsLoyalty => 'લોયલ્ટી પોઇન્ટ';

  @override
  String get posSettingsLoyaltyEnabled => 'લોયલ્ટી પોઇન્ટ આપો';

  @override
  String get posSettingsPointsPer100 => '₹100 દીઠ પોઇન્ટ';

  @override
  String get posSettingsPointValue => 'એક પોઇન્ટની કિંમત (₹)';

  @override
  String get posSettingsMaxRedeem =>
      'પોઇન્ટથી ચૂકવી શકાય તેટલો બિલનો મહત્તમ ભાગ (%)';

  @override
  String get posSettingsFooter => 'રસીદની ફૂટર';

  @override
  String get posSettingsTerminals => 'કાઉન્ટર';

  @override
  String get posSettingsTerminalName => 'કાઉન્ટરનું નામ';

  @override
  String get posSettingsWarehouse => 'માંથી વેચાણ';

  @override
  String get posSettingsDevice => 'ઓફલાઇન ડિવાઇસ';

  @override
  String get posSettingsNoDevice => 'કોઈ નહીં (વેબ બિલિંગ)';

  @override
  String get posSettingsAddTerminal => 'કાઉન્ટર ઉમેરો';

  @override
  String get posSettingsSave => 'સાચવો';

  @override
  String get posReceiptTaxInvoice => 'કર બિલ';

  @override
  String get posReceiptBillOfSupply => 'રોકડ મેમો';

  @override
  String get posReceiptThanks => 'આભાર! ફરી પધારજો.';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'મળેલા પોઇન્ટ: $points · બાકી $balance';
  }

  @override
  String get posErrorsSessionNotOpen => 'પહેલાં આ કાઉન્ટર પર શિફ્ટ શરૂ કરો.';

  @override
  String get posErrorsSessionAlreadyOpen =>
      'આ કાઉન્ટર પર શિફ્ટ પહેલેથી શરૂ છે.';

  @override
  String get posErrorsSessionClosed => 'તે શિફ્ટ બંધ છે.';

  @override
  String get posErrorsDeviceTerminal => 'આ કાઉન્ટર પોતાના ડિવાઇસથી બિલ કરે છે.';

  @override
  String get posErrorsTerminalOnOtherDevice => 'આ કાઉન્ટર બીજા ડિવાઇસનું છે.';

  @override
  String get posErrorsTooManyPoints => 'આ બિલ પર વાપરી શકાય તેનાથી વધુ પોઇન્ટ.';

  @override
  String get posErrorsLoyaltyNotAvailable =>
      'પહેલાં ગ્રાહકનો મોબાઇલ નંબર દાખલ કરો.';

  @override
  String get posErrorsOverpaidNonCash =>
      'UPI અને કાર્ડ બાકી રકમથી વધુ ન હોઈ શકે.';

  @override
  String get posErrorsUnderpaid => 'બિલ પૂરું ચૂકવાયું નથી.';

  @override
  String get posErrorsInvalidPayment => 'ચુકવણીની રકમ દાખલ કરો.';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'ઉધાર વેચાણ માટે ગ્રાહક પસંદ કરો.';

  @override
  String get posErrorsDiscountExceedsAmount => 'વળતર બિલથી વધુ છે.';

  @override
  String get posErrorsVoidSameDayOnly => 'ફક્ત આજનાં બિલ રદ કરી શકાય.';

  @override
  String get posErrorsOrderNotOpen => 'તે ઓર્ડર બંધ છે.';

  @override
  String get posErrorsBillNumberTaken => 'તે બિલ નંબર પહેલેથી વપરાયો છે.';

  @override
  String get posErrorsInvalidPhone => '10 અંકનો મોબાઇલ નંબર દાખલ કરો.';

  @override
  String get posErrorsNoLines => 'ઓછામાં ઓછી એક વસ્તુ ઉમેરો.';

  @override
  String get posDeviceNoTerminal =>
      'આ ડિવાઇસ પર કોઈ બિલિંગ કાઉન્ટર નથી. વેબ પર પીઓએસ સેટિંગ્સ ખોલો, આ ડિવાઇસ સાથે કાઉન્ટર જોડો, પછી સિંક કરો.';

  @override
  String get posDeviceTodayBills => 'આ ડિવાઇસ પરનાં આજનાં બિલ';

  @override
  String get posDeviceWaiting => 'અપલોડની રાહમાં';

  @override
  String get posDeviceUploaded => 'અપલોડ થયું';

  @override
  String posDeviceFailed(String error) {
    return 'સ્વીકાર્યું નહીં: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'સર્વરનો સરવાળો $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'બિલને આ ડિવાઇસ પર નંબર મળે છે અને ઓનલાઇન થતાં અપલોડ થાય છે.';

  @override
  String get posDeviceNoFiscalYear =>
      'આજની તારીખ કોઈ નાણાકીય વર્ષમાં નથી. પહેલાં ક્લાઉડ સાથે સિંક કરો.';

  @override
  String get posPromoReferredBy => 'કોણે મોકલ્યા (મોબાઇલ)';

  @override
  String posPromoReferredHint(String points) {
    return 'તેમને $points પોઇન્ટ મળશે';
  }

  @override
  String get posPromoCoupon => 'કૂપન કોડ';

  @override
  String posPromoCouponOk(String off) {
    return '$off છૂટ';
  }

  @override
  String get posPromoCard => 'ડિસ્કાઉન્ટ કાર્ડ';

  @override
  String get posPromoCardOff => 'ડિસ્કાઉન્ટ કાર્ડ';

  @override
  String posPromoCouponOff(String code) {
    return 'કૂપન $code';
  }

  @override
  String posPromoVoucher(String code) {
    return 'ગિફ્ટ વાઉચર $code';
  }

  @override
  String get posPromoToPay => 'ચૂકવવાના';

  @override
  String get posPromoVoucherCode => 'ગિફ્ટ વાઉચર કોડ';

  @override
  String get posPromoUseVoucher => 'વાઉચર વાપરો';

  @override
  String get posPromoReferralPoints => 'રેફરલ પોઇન્ટ';

  @override
  String get posPromoReferralPointsHint =>
      'જે સભ્યએ મોકલેલો ગ્રાહક જોડાઈને ખરીદે તેને (0 = બંધ)';

  @override
  String get posPromoErrorsCouponNotFound => 'આવું કોઈ કૂપન નથી, અથવા બંધ છે.';

  @override
  String get posPromoErrorsCouponNotValidToday => 'આ કૂપન આજે માન્ય નથી.';

  @override
  String get posPromoErrorsCouponUsedUp => 'આ કૂપન પૂરું વપરાઈ ગયું છે.';

  @override
  String get posPromoErrorsCouponMinBill =>
      'બિલ આ કૂપનની ઓછામાં ઓછી રકમથી ઓછું છે.';

  @override
  String get posPromoErrorsCardNotFound =>
      'આવું કોઈ ડિસ્કાઉન્ટ કાર્ડ નથી, અથવા બંધ છે.';

  @override
  String get posPromoErrorsCardExpired =>
      'આ ડિસ્કાઉન્ટ કાર્ડની મુદત પૂરી થઈ છે.';

  @override
  String get posPromoErrorsVoucherNotFound => 'તે કોડનું કોઈ ગિફ્ટ વાઉચર નથી.';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'આ ગિફ્ટ વાઉચર પૂરું વપરાયું અથવા સમાપ્ત છે.';

  @override
  String get posPromoErrorsVoucherBalanceLow => 'વાઉચર પર એટલી રકમ બાકી નથી.';

  @override
  String get posPromoErrorsVoucherMoreThanBill =>
      'વાઉચરની રકમ બિલ કરતાં વધુ છે.';

  @override
  String get posPromoErrorsVoucherTwice => 'એ જ વાઉચર બે વાર દાખલ કર્યું.';

  @override
  String get posPromoErrorsOnlineOnly =>
      'કૂપન, કાર્ડ અને ગિફ્ટ વાઉચર માટે ઓનલાઇન કાઉન્ટર જોઈએ.';

  @override
  String get posCounterControls => 'કાઉન્ટર નિયંત્રણ';

  @override
  String get posCounterAllowRateChange => 'કૅશિયર દર બદલી શકે';

  @override
  String get posCounterRequireSalesman => 'દરેક લાઇન પર સેલ્સમેન જરૂરી';

  @override
  String get posCounterMaxLineDiscount => 'મહત્તમ લાઇન છૂટ, %';

  @override
  String get posCounterMaxBillDiscount => 'મહત્તમ બિલ છૂટ, %';

  @override
  String get posCounterLimitHint =>
      'ખાલી: મર્યાદા નથી. વધુ માટે મંજૂરી આપનારનું કારણ જોઈએ.';

  @override
  String get posCounterSalesman => 'સેલ્સમેન';

  @override
  String get posCounterNoSalesman => 'સેલ્સમેન નથી';

  @override
  String get posCounterBillSalesman => 'બિલનો સેલ્સમેન';

  @override
  String get posCounterRate => 'દર';

  @override
  String get posCounterRateLocked => 'દર લૉક છે';

  @override
  String get posCounterDisc => 'છૂટ ₹';

  @override
  String get posCounterLineDiscount => 'લાઇન છૂટ રૂપિયામાં';

  @override
  String posCounterVisits(String n) {
    return 'મુલાકાત: $n';
  }

  @override
  String posCounterSpent(String v) {
    return 'ખર્ચ $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'પાછું $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'છેલ્લે $date';
  }

  @override
  String get posCounterBuys => 'સામાન્ય રીતે લે છે';

  @override
  String get posCounterNewCustomer => 'નવો ગ્રાહક: આ બિલથી જોડાશે.';

  @override
  String get posCounterApprovalReason => 'મંજૂરીનું કારણ';

  @override
  String get posCounterBrokenRate => 'દર બદલ્યો';

  @override
  String get posCounterBrokenLineDiscount => 'લાઇન છૂટ મર્યાદાથી વધુ';

  @override
  String get posCounterBrokenBillDiscount => 'બિલ છૂટ મર્યાદાથી વધુ';

  @override
  String get posCounterNeedsApprover => 'મેનેજરની મંજૂરી જોઈએ';

  @override
  String get posCounterHold => 'બિલ રોકો';

  @override
  String posCounterHeldBills(String n) {
    return 'રોકેલાં બિલ ($n)';
  }

  @override
  String get posCounterHoldLabel => 'કોના માટે? (વૈકલ્પિક)';

  @override
  String get posCounterHoldNow => 'રોકો';

  @override
  String get posCounterUnnamed => 'ગ્રાહક';

  @override
  String posCounterPieces(String n) {
    return 'નંગ: $n';
  }

  @override
  String get posCounterResume => 'આનું બિલ કરો';

  @override
  String get posCounterNoneHeld => 'કોઈ રોકેલું બિલ નથી.';

  @override
  String get posCounterHoldFirst =>
      'બીજું લેતા પહેલાં ચાલુ બિલ રોકો કે પૂરું કરો.';

  @override
  String get posCounterSizeStock => 'અહીં સાઇઝ મુજબ સ્ટૉક';

  @override
  String get posCounterAddSize => 'આ રંગ અને સાઇઝ ઉમેરો';

  @override
  String get posCounterKeysSearch => 'સ્કૅન અથવા શોધ';

  @override
  String get posCounterKeysHold => 'બિલ રોકો';

  @override
  String get posCounterKeysHeld => 'રોકેલાં બિલ';

  @override
  String get posCounterKeysCustomer => 'ગ્રાહક';

  @override
  String get posCounterKeysDiscount => 'છૂટ';

  @override
  String get posCounterKeysCash => 'પૂરું રોકડ';

  @override
  String get posCounterKeysUpi => 'પૂરું UPI';

  @override
  String get posCounterKeysCard => 'પૂરું કાર્ડ';

  @override
  String get posCounterKeysPay => 'બિલ પૂરું કરો';

  @override
  String get posCounterKeysExchange => 'પરત અથવા બદલી';

  @override
  String get posCounterErrorsRateLocked =>
      'દર લૉક છે. મેનેજર કારણ સાથે મંજૂરી આપી શકે.';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'લાઇન છૂટ મર્યાદાથી વધુ છે. મેનેજર કારણ સાથે મંજૂરી આપી શકે.';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'બિલ છૂટ મર્યાદાથી વધુ છે. મેનેજર કારણ સાથે મંજૂરી આપી શકે.';

  @override
  String get posCounterErrorsSalesmanRequired =>
      'દરેક લાઇનનો સેલ્સમેન પસંદ કરો.';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'તે સેલ્સમેન સ્ટાફ યાદીમાં નથી.';

  @override
  String get posCounterErrorsHeldBillGone =>
      'તે રોકેલું બિલ પહેલેથી લેવાઈ ગયું.';

  @override
  String get posCounterAutoSendBill =>
      'ગ્રાહક મોબાઇલ આપે તો બિલ આપમેળે વૉટ્સએપ પર મોકલો';

  @override
  String get posCounterBrowse => 'વસ્તુઓ જુઓ';

  @override
  String get posCounterItem => 'વસ્તુ';

  @override
  String posCounterPiecesInBill(String n) {
    return 'બિલમાં $n નંગ';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'દરે કુલ $v';
  }

  @override
  String get posCounterOffers => 'છૂટ અને ઑફર';

  @override
  String get posCounterBreakdown => 'બિલની વિગત';

  @override
  String get posCounterInclGst => 'GST સહિત';

  @override
  String get posCounterBillItems => 'બિલની વસ્તુઓ';

  @override
  String get posCounterScanToStart =>
      'બિલ શરૂ કરવા બારકોડ સ્કૅન કરો અથવા શોધો. હોલ્ડ બિલ લેવા F4 દબાવો.';

  @override
  String get bankingAccountsTitle => 'બેંકો';

  @override
  String get bankingAccountsSubtitle =>
      'તમારાં બેંક સ્ટેટમેન્ટ હિસાબ સાથે મેળવો.';

  @override
  String get bankingAccountsBookBalance => 'હિસાબ મુજબ';

  @override
  String get bankingAccountsStatementBalance => 'બેંક મુજબ';

  @override
  String bankingAccountsAsOf(String date) {
    return '$dateએ';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'મેળવવાની $count લાઇનો',
      one: 'મેળવવાની $count લાઇન',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'બધું મેળ ખાય છે';

  @override
  String get bankingAccountsNone =>
      'હજી કોઈ બેંક ખાતું નથી. ખાતાંની યાદીમાં Bank Accounts હેઠળ ખાતું ઉમેરો.';

  @override
  String get bankingAccountsReconcile => 'મેળવણી કરો';

  @override
  String get bankingAccountsNoStatement => 'હજી સ્ટેટમેન્ટ નથી';

  @override
  String get bankingProfileTitle => 'બેંક વિગતો';

  @override
  String get bankingProfileBankName => 'બેંક';

  @override
  String get bankingProfileLast4 => 'ખાતું (છેલ્લા 4 અંક)';

  @override
  String get bankingProfileIfsc => 'IFSC';

  @override
  String get bankingProfileSave => 'સાચવો';

  @override
  String get bankingImportTitle => 'સ્ટેટમેન્ટ આયાત કરો';

  @override
  String get bankingImportHint =>
      'નેટ બેંકિંગમાંથી સ્ટેટમેન્ટ CSVમાં ડાઉનલોડ કરો (Excelમાંથી: Save As → CSV). કૉલમ તેમનાં શીર્ષકોથી ઓળખાય છે, તેથી મોટાભાગની ભારતીય બેંકો ચાલે છે.';

  @override
  String get bankingImportFile => 'સ્ટેટમેન્ટ ફાઇલ (CSV)';

  @override
  String get bankingImportButton => 'આયાત કરો';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$added લાઇન ઉમેરાઈ, $duplicates પહેલેથી હતી, $matched આપમેળે મેળ ખાઈ.';
  }

  @override
  String get bankingFeedTitle => 'બેંક ફીડ';

  @override
  String get bankingFeedHint =>
      'તમે સંમતિ મંજૂર કરો પછી વ્યવહારો RBI એકાઉન્ટ એગ્રીગેટર વ્યવસ્થા દ્વારા આવે છે. પ્રદાતા જોડાય ત્યાં સુધી સિમ્યુલેટર કામ કરે છે.';

  @override
  String get bankingFeedConnect => 'જોડો';

  @override
  String get bankingFeedFetch => 'હમણાં લાવો';

  @override
  String get bankingFeedDisconnect => 'જોડાણ દૂર કરો';

  @override
  String get bankingFeedStatusesActive => 'જોડાયેલ';

  @override
  String get bankingFeedStatusesPending => 'સંમતિની રાહમાં';

  @override
  String get bankingFeedStatusesRevoked => 'જોડાણ દૂર';

  @override
  String bankingFeedFetched(String date) {
    return '$date સુધી લાવ્યા';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$added નવા વ્યવહારો, $matched મેળ ખાયા.';
  }

  @override
  String get bankingTabsOpen => 'મેળવવાના';

  @override
  String get bankingTabsMatched => 'મેળ ખાયેલા';

  @override
  String get bankingTabsIgnored => 'અવગણેલા';

  @override
  String get bankingTabsBrs => 'મેળવણી પત્રક';

  @override
  String get bankingLinesDate => 'તારીખ';

  @override
  String get bankingLinesDescription => 'વિગત';

  @override
  String get bankingLinesWithdrawal => 'ઉપાડ';

  @override
  String get bankingLinesDeposit => 'જમા';

  @override
  String get bankingLinesBalance => 'બાકી';

  @override
  String get bankingLinesSuggestion => 'આવું લાગે છે';

  @override
  String get bankingLinesAccept => 'મેળવો';

  @override
  String get bankingLinesCreate => 'નોંધ કરો';

  @override
  String get bankingLinesIgnore => 'અવગણો';

  @override
  String get bankingLinesByHand => 'નોંધ શોધો';

  @override
  String get bankingLinesUnmatch => 'મેળ દૂર કરો';

  @override
  String get bankingLinesRestore => 'પાછું લાવો';

  @override
  String get bankingLinesAccount => 'આ ખાતામાં નોંધો';

  @override
  String get bankingLinesNarration => 'વિગત';

  @override
  String bankingLinesRule(String account) {
    return 'નિયમ: $account';
  }

  @override
  String get bankingLinesApplyRules => 'નિયમ મુજબ બધું નોંધો';

  @override
  String bankingLinesRulesDone(String count) {
    return '$count નોંધો થઈ.';
  }

  @override
  String get bankingLinesNone => 'અહીં કંઈ નથી.';

  @override
  String bankingLinesEntries(String from, String to) {
    return '$from થી $to સુધીની ન મેળ ખાયેલી નોંધો';
  }

  @override
  String get bankingLinesMatchSelected => 'પસંદ કરેલું મેળવો';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return '$amountમાંથી $total પસંદ';
  }

  @override
  String get bankingLinesReasonsAmount => 'સરખી રકમ';

  @override
  String get bankingLinesReasonsSameDay => 'તે જ દિવસ';

  @override
  String get bankingLinesReasonsReference => 'સરખો સંદર્ભ';

  @override
  String get bankingLinesReasonsParty => 'પક્ષનું નામ';

  @override
  String get bankingBrsAsOf => 'આ તારીખે';

  @override
  String get bankingBrsPerBooks => 'હિસાબ મુજબ બાકી';

  @override
  String get bankingBrsNotPresented => 'ઉમેરો: આપેલા પણ હજી રજૂ ન થયેલા ચેક';

  @override
  String get bankingBrsNotCredited => 'બાદ: બેંકે હજી જમા ન કરેલી થાપણ';

  @override
  String get bankingBrsBankDebits => 'બાદ: હિસાબમાં ન હોય તેવા બેંક ઉધાર';

  @override
  String get bankingBrsBankCredits => 'ઉમેરો: હિસાબમાં ન હોય તેવા બેંક જમા';

  @override
  String get bankingBrsPerBank => 'બેંક મુજબ બાકી';

  @override
  String bankingBrsStatement(String date) {
    return '$dateએ સ્ટેટમેન્ટ બાકી';
  }

  @override
  String get bankingBrsDifference => 'તફાવત';

  @override
  String get bankingBrsBalanced => 'મેળ ખાય છે';

  @override
  String get bankingRulesTitle => 'બેંક નિયમો';

  @override
  String get bankingRulesSubtitle =>
      'આ શબ્દોવાળી સ્ટેટમેન્ટ લાઇન એક ક્લિકમાં ખાતામાં નોંધાય છે (બેંક ચાર્જ, વ્યાજ, સ્થાયી સૂચનાઓ).';

  @override
  String get bankingRulesContains => 'વિગતમાં છે';

  @override
  String get bankingRulesDirection => 'પૈસા';

  @override
  String get bankingRulesDirectionsIn => 'આવ્યા';

  @override
  String get bankingRulesDirectionsOut => 'ગયા';

  @override
  String get bankingRulesDirectionsAny => 'આવ્યા કે ગયા';

  @override
  String get bankingRulesAccount => 'આમાં નોંધો';

  @override
  String get bankingRulesNarration => 'વિગત';

  @override
  String get bankingRulesPriority => 'પ્રાથમિકતા';

  @override
  String get bankingRulesAdd => 'નિયમ ઉમેરો';

  @override
  String get bankingRulesSave => 'સાચવો';

  @override
  String get bankingSettlementsTitle => 'ગેટવે સેટલમેન્ટ';

  @override
  String get bankingSettlementsSubtitle =>
      'Razorpay, PhonePe, Paytm વગેરેની ચુકવણીઓ: વસૂલાત બાદ રિફંડ, ફી અને ફી પર જીએસટી, બેંકમાં એક જમા તરીકે.';

  @override
  String get bankingSettlementsProvider => 'ગેટવે';

  @override
  String get bankingSettlementsBank => 'આમાં જમા';

  @override
  String get bankingSettlementsClearing => 'વસૂલાત અહીં નોંધાઈ હતી';

  @override
  String get bankingSettlementsFile => 'સેટલમેન્ટ રિપોર્ટ (CSV)';

  @override
  String get bankingSettlementsImport => 'આયાત કરો';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$posted ચુકવણીઓ નોંધાઈ, $skipped પહેલેથી થઈ હતી, $matched બેંક સાથે મેળ ખાઈ.';
  }

  @override
  String get bankingSettlementsSettlementId => 'સેટલમેન્ટ';

  @override
  String get bankingSettlementsSettledOn => 'સેટલ તારીખ';

  @override
  String get bankingSettlementsPayments => 'ચુકવણીઓ';

  @override
  String get bankingSettlementsGross => 'વસૂલ';

  @override
  String get bankingSettlementsRefunds => 'રિફંડ';

  @override
  String get bankingSettlementsFees => 'ફી';

  @override
  String get bankingSettlementsTax => 'ફી પર જીએસટી';

  @override
  String get bankingSettlementsNet => 'ચૂકવેલ';

  @override
  String get bankingSettlementsMatched => 'બેંકમાં';

  @override
  String get bankingSettlementsNone => 'હજી કોઈ સેટલમેન્ટ નથી.';

  @override
  String get bankingErrorsNoHeader =>
      'શીર્ષક પંક્તિ મળી નહીં. સ્ટેટમેન્ટ તેના કૉલમ શીર્ષકો સાથે CSV તરીકે સાચવો.';

  @override
  String get bankingErrorsNoRows => 'ફાઇલમાં કોઈ વ્યવહાર મળ્યો નહીં.';

  @override
  String get bankingErrorsBadAmount => 'ફાઇલમાંની એક રકમ વાંચી શકાઈ નહીં.';

  @override
  String get bankingErrorsUnknownFormat =>
      'આ સેટલમેન્ટ રિપોર્ટ લાગતો નથી (settlement id, amount અને fee કૉલમ જોઈએ).';

  @override
  String get bankingErrorsInvalidFile => 'ફાઇલ વાંચી શકાઈ નહીં.';

  @override
  String get bankingErrorsNotABankAccount =>
      'Bank Accounts હેઠળનું ખાતું પસંદ કરો.';

  @override
  String get bankingErrorsFeedNotConnected => 'પહેલાં બેંક ફીડ જોડો.';

  @override
  String get bankingErrorsLineAlreadyMatched => 'તે લાઇન પહેલેથી મેળ ખાય છે.';

  @override
  String get bankingErrorsVoucherNotOpen =>
      'તે નોંધ પહેલેથી મેળ ખાય છે અથવા રદ છે.';

  @override
  String get bankingErrorsWrongDirection =>
      'આવેલા પૈસા ફક્ત આવક સાથે, ગયેલા ફક્ત ચુકવણી સાથે મેળવી શકાય.';

  @override
  String get bankingErrorsAmountsDiffer =>
      'નોંધોનો સરવાળો લાઇનની રકમ જેટલો નથી.';

  @override
  String get bankingErrorsSameAccount => 'અલગ ખાતું પસંદ કરો.';

  @override
  String get bankingErrorsInvalidIfsc => 'માન્ય IFSC દાખલ કરો.';

  @override
  String get assetsRegisterTitle => 'સ્થાયી મિલકત';

  @override
  String get assetsRegisterSubtitle =>
      'રજિસ્ટર, કંપની કાયદા મુજબ ઘસારો અને આવકવેરા બ્લોક પત્રક.';

  @override
  String get assetsRegisterNew => 'મિલકત ઉમેરો';

  @override
  String get assetsRegisterCode => 'કોડ';

  @override
  String get assetsRegisterName => 'મિલકત';

  @override
  String get assetsRegisterClass => 'વર્ગ';

  @override
  String get assetsRegisterPurchased => 'ખરીદી';

  @override
  String get assetsRegisterPutToUse => 'થી ઉપયોગમાં';

  @override
  String get assetsRegisterCost => 'કિંમત';

  @override
  String get assetsRegisterAccumulated => 'આજ સુધીનો ઘસારો';

  @override
  String get assetsRegisterBookValue => 'ચોપડા કિંમત';

  @override
  String get assetsRegisterStatus => 'સ્થિતિ';

  @override
  String get assetsRegisterStatusesActive => 'ઉપયોગમાં';

  @override
  String get assetsRegisterStatusesDisposed => 'વેચી / ભંગાર';

  @override
  String get assetsRegisterLocation => 'સ્થળ';

  @override
  String get assetsRegisterSerialNo => 'ક્રમાંક';

  @override
  String get assetsRegisterCustodian => 'પાસે';

  @override
  String get assetsRegisterNone => 'હજી કોઈ મિલકત નથી.';

  @override
  String get assetsClassesTitle => 'મિલકત વર્ગો';

  @override
  String get assetsClassesPresets => 'પ્રમાણભૂત વર્ગ ઉમેરો';

  @override
  String get assetsClassesPreset => 'વર્ગ';

  @override
  String get assetsClassesAdd => 'ઉમેરો';

  @override
  String get assetsClassesCustom => 'અથવા પોતાનો બનાવો';

  @override
  String get assetsClassesName => 'નામ';

  @override
  String get assetsClassesMethod => 'પદ્ધતિ';

  @override
  String get assetsClassesMethodsSlm => 'સીધી લીટી';

  @override
  String get assetsClassesMethodsWdv => 'ઘટતી કિંમત (WDV)';

  @override
  String get assetsClassesLife => 'ઉપયોગી આયુષ્ય (વર્ષ)';

  @override
  String get assetsClassesResidual => 'શેષ કિંમત %';

  @override
  String get assetsClassesItBlock => 'આવકવેરા બ્લોક';

  @override
  String get assetsClassesItRate => 'કર દર %';

  @override
  String get assetsClassesBlocksBuilding => 'મકાનો';

  @override
  String get assetsClassesBlocksPlantMachinery => 'પ્લાન્ટ અને મશીનરી';

  @override
  String get assetsClassesBlocksFurniture => 'ફર્નિચર અને ફિટિંગ';

  @override
  String get assetsClassesBlocksComputers => 'કમ્પ્યુટર અને સૉફ્ટવેર';

  @override
  String get assetsClassesBlocksIntangibles => 'અમૂર્ત મિલકતો';

  @override
  String get assetsFormAcquisition => 'કેવી રીતે આવી';

  @override
  String get assetsFormAcquisitionsSupplier => 'ઉધાર પર ખરીદી';

  @override
  String get assetsFormAcquisitionsPaid => 'રોકડ અથવા બેંકમાંથી ચૂકવી';

  @override
  String get assetsFormAcquisitionsOpening => 'પહેલેથી હિસાબમાં (આગળ લાવેલ)';

  @override
  String get assetsFormSupplier => 'સપ્લાયર';

  @override
  String get assetsFormPaidFrom => 'માંથી ચૂકવ્યું';

  @override
  String get assetsFormGstRate => 'જીએસટી દર % (ઇનપુટ ક્રેડિટ લીધી)';

  @override
  String get assetsFormSupplierGstin => 'સપ્લાયરનો જીએસટીઆઈએન';

  @override
  String get assetsFormInvoiceRef => 'બિલ નં.';

  @override
  String get assetsFormOpeningAccumulated => 'અગાઉ લગાવેલો ઘસારો';

  @override
  String get assetsFormNotes => 'નોંધ';

  @override
  String get assetsFormSave => 'મિલકત ઉમેરો';

  @override
  String get assetsDetailHistory => 'લગાવેલો ઘસારો';

  @override
  String get assetsDetailPeriod => 'સમયગાળો';

  @override
  String get assetsDetailDays => 'દિવસ';

  @override
  String get assetsDetailVoucher => 'નોંધ';

  @override
  String get assetsDetailDispose => 'વેચો અથવા ભંગારમાં કાઢો';

  @override
  String get assetsDetailDisposeDate => 'તારીખ';

  @override
  String get assetsDetailSaleValue => 'વેચાણ કિંમત (₹, ભંગાર હોય તો 0)';

  @override
  String get assetsDetailReceivedIn => 'આમાં મળ્યા';

  @override
  String get assetsDetailSaleGst => 'વેચાણ પર જીએસટી %';

  @override
  String get assetsDetailBuyerState =>
      'ખરીદનારનું રાજ્ય (તમારા રાજ્ય બહાર હોય તો)';

  @override
  String get assetsDetailDisposeButton => 'વેચાણ નોંધો';

  @override
  String assetsDetailDisposed(String date, String value) {
    return '$dateએ $valueમાં વેચી';
  }

  @override
  String get assetsDetailProfit => 'વેચાણ પર નફો';

  @override
  String get assetsDetailLoss => 'વેચાણ પર નુકસાન';

  @override
  String get assetsDetailPurchase => 'ખરીદીની નોંધ';

  @override
  String get assetsDepreciationTitle => 'ઘસારો';

  @override
  String get assetsDepreciationSubtitle =>
      'મહિના, ત્રિમાસિક કે વર્ષનો ઘસારો લગાવો. દરેક મિલકત છેલ્લે જ્યાં અટકી ત્યાંથી આગળ વધે છે.';

  @override
  String get assetsDepreciationFrom => 'થી';

  @override
  String get assetsDepreciationTo => 'સુધી';

  @override
  String get assetsDepreciationPreview => 'ગણો';

  @override
  String get assetsDepreciationPost => 'ઘસારો નોંધો';

  @override
  String get assetsDepreciationTotal => 'કુલ';

  @override
  String get assetsDepreciationRuns => 'નોંધો';

  @override
  String get assetsDepreciationNone => 'આ સમયગાળામાં લગાવવા જેવું કંઈ નથી.';

  @override
  String get assetsDepreciationCancel => 'નોંધ રદ કરો';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count મિલકતો',
      one: '$count મિલકત',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'આવકવેરા ઘસારો';

  @override
  String get assetsItSubtitle =>
      'બ્લોક મુજબ, કર ઓડિટ રિપોર્ટ પ્રમાણે (ફોર્મ 3CD, કલમ 18). 180 દિવસથી ઓછા વપરાયેલા ઉમેરાને અડધો દર.';

  @override
  String get assetsItFy => 'વર્ષ';

  @override
  String get assetsItBlock => 'બ્લોક';

  @override
  String get assetsItRate => 'દર';

  @override
  String get assetsItOpening => 'શરૂઆતની WDV';

  @override
  String get assetsItAddFull => 'ઉમેરા (180 દિવસ કે વધુ)';

  @override
  String get assetsItAddHalf => 'ઉમેરા (180 દિવસથી ઓછા)';

  @override
  String get assetsItSales => 'વેચાણ';

  @override
  String get assetsItDepreciation => 'ઘસારો';

  @override
  String get assetsItClosing => 'અંતિમ WDV';

  @override
  String get assetsItGain => 'ટૂંકા ગાળાનો લાભ';

  @override
  String get assetsItLoss => 'ટૂંકા ગાળાનું નુકસાન';

  @override
  String get assetsItOpeningTitle => 'શરૂઆતની ઘટતી કિંમત';

  @override
  String get assetsItOpeningHint =>
      'તમારા છેલ્લા કર રિટર્નમાંથી પહેલા વર્ષની શરૂઆતની દરેક બ્લોકની WDV દાખલ કરો; પછીનાં વર્ષો આપમેળે આગળ વધે છે.';

  @override
  String get assetsItSave => 'સાચવો';

  @override
  String get assetsItTotal => 'કુલ';

  @override
  String get assetsItNone => 'આ વર્ષે કોઈ મિલકત નથી.';

  @override
  String get assetsErrorsClassExists => 'તે વર્ગ પહેલેથી છે.';

  @override
  String get assetsErrorsClassIncomplete => 'નામ, આયુષ્ય અને કર બ્લોક ભરો.';

  @override
  String get assetsErrorsUnknownPreset => 'વર્ગ પસંદ કરો.';

  @override
  String get assetsErrorsInvalidLife => 'ઉપયોગી આયુષ્ય વર્ષમાં દાખલ કરો.';

  @override
  String get assetsErrorsInvalidResidual =>
      'ઘટતી કિંમત પદ્ધતિ માટે શેષ કિંમત 0%થી વધુ જોઈએ.';

  @override
  String get assetsErrorsUnknownClass => 'વર્ગ પસંદ કરો.';

  @override
  String get assetsErrorsClassArchived => 'તે વર્ગ આર્કાઇવ છે.';

  @override
  String get assetsErrorsInvalidCost => 'કિંમત દાખલ કરો.';

  @override
  String get assetsErrorsUsedBeforeBought => 'ખરીદી પહેલાં ઉપયોગમાં ન હોઈ શકે.';

  @override
  String get assetsErrorsAccountRequired => 'ખાતું પસંદ કરો.';

  @override
  String get assetsErrorsNotASupplier => 'સપ્લાયર પસંદ કરો.';

  @override
  String get assetsErrorsNotCashOrBank => 'રોકડ કે બેંક ખાતું પસંદ કરો.';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'ઇનપુટ ક્રેડિટ લેવા સપ્લાયરનો જીએસટીઆઈએન દાખલ કરો.';

  @override
  String get assetsErrorsPeriodCrossesYear =>
      'સમયગાળો એક જ નાણાકીય વર્ષમાં હોવો જોઈએ.';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'આ સમયગાળામાં લગાવવા જેવું કંઈ નથી.';

  @override
  String get assetsErrorsLaterRunExists =>
      'પછીની નોંધમાં આ મિલકતો પર ઘસારો છે; પહેલાં તે રદ કરો.';

  @override
  String get assetsErrorsAssetDisposed => 'આ નોંધની એક મિલકત વેચાઈ ગઈ છે.';

  @override
  String get assetsErrorsAlreadyDisposed => 'આ મિલકત પહેલેથી વેચાઈ છે.';

  @override
  String get assetsErrorsSoldBeforeUse =>
      'વેચાણ તારીખ ઉપયોગ શરૂ થયા પહેલાંની છે.';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'વેચાણ તારીખ પછીનો ઘસારો લાગ્યો છે; પહેલાં તે નોંધ રદ કરો.';

  @override
  String get assetsErrorsInvalidDepreciation => 'ઘસારો ગણી શકાયો નહીં.';

  @override
  String get assetsErrorsInvalidFy => 'વર્ષ પસંદ કરો.';

  @override
  String get expensesClaimsTitle => 'ખર્ચ દાવા';

  @override
  String get expensesClaimsSubtitle =>
      'કર્મચારીઓ કરેલા ખર્ચનો દાવો કરે છે; મંજૂરી પર તે નોંધાય છે (મંજૂર હોય ત્યાં જીએસટી ક્રેડિટ સાથે) અને ચુકવણીથી પૂરો થાય છે.';

  @override
  String get expensesClaimsNew => 'નવો દાવો';

  @override
  String get expensesClaimsNumber => 'દાવો';

  @override
  String get expensesClaimsEmployee => 'કર્મચારી';

  @override
  String get expensesClaimsDate => 'તારીખ';

  @override
  String get expensesClaimsClaimTitle => 'હેતુ';

  @override
  String get expensesClaimsTotal => 'રકમ';

  @override
  String get expensesClaimsItc => 'જીએસટી ક્રેડિટ';

  @override
  String get expensesClaimsStatus => 'સ્થિતિ';

  @override
  String get expensesClaimsStatusesDraft => 'ડ્રાફ્ટ';

  @override
  String get expensesClaimsStatusesSubmitted => 'મંજૂરીની રાહમાં';

  @override
  String get expensesClaimsStatusesApproved => 'મંજૂર';

  @override
  String get expensesClaimsStatusesRejected => 'નામંજૂર';

  @override
  String get expensesClaimsStatusesPaid => 'ચૂકવ્યો';

  @override
  String get expensesClaimsStatusesCancelled => 'રદ';

  @override
  String get expensesClaimsWaiting => 'મંજૂરીની રાહમાં';

  @override
  String get expensesClaimsToPay => 'મંજૂર, ચૂકવવાના';

  @override
  String get expensesClaimsNone => 'હજી કોઈ દાવો નથી.';

  @override
  String get expensesClaimsAll => 'બધા';

  @override
  String get expensesFormTitle => 'ખર્ચ દાવો';

  @override
  String get expensesFormProject => 'પ્રોજેક્ટ';

  @override
  String get expensesFormLines => 'ખર્ચ';

  @override
  String get expensesFormCategory => 'પ્રકાર';

  @override
  String get expensesFormDescription => 'વિગત';

  @override
  String get expensesFormAmount => 'રકમ (₹)';

  @override
  String get expensesFormGstRate => 'જીએસટી %';

  @override
  String get expensesFormVendor => 'વિક્રેતા';

  @override
  String get expensesFormVendorGstin => 'વિક્રેતાનો જીએસટીઆઈએન';

  @override
  String get expensesFormInvoiceNo => 'બિલ નં.';

  @override
  String get expensesFormReceipt => 'રસીદ';

  @override
  String get expensesFormUpload => 'જોડો';

  @override
  String get expensesFormRead => 'રસીદ વાંચો';

  @override
  String get expensesFormReading => 'વાંચી રહ્યા છીએ…';

  @override
  String get expensesFormReadDone => 'રસીદમાંથી ભર્યું. કૃપા કરીને તપાસો.';

  @override
  String get expensesFormReadNone =>
      'આ રસીદ વાંચી શકાઈ નહીં; કૃપા કરીને વિગતો ભરો.';

  @override
  String get expensesFormReadDemo =>
      'આપમેળે વાંચવાનું ચાલુ નથી; કૃપા કરીને વિગતો ભરો.';

  @override
  String get expensesFormAddLine => 'ખર્ચ ઉમેરો';

  @override
  String get expensesFormSaveDraft => 'ડ્રાફ્ટ સાચવો';

  @override
  String get expensesFormSubmit => 'મંજૂરી માટે મોકલો';

  @override
  String get expensesFormItcHint =>
      'બિલ કંપનીના નામે વિક્રેતાના જીએસટીઆઈએન સાથેનું કર બિલ હોય અને પ્રકાર મંજૂરી આપે ત્યારે જીએસટી ક્રેડિટ લેવાય છે.';

  @override
  String get expensesDetailApprove => 'મંજૂર કરો';

  @override
  String get expensesDetailReject => 'નામંજૂર કરો';

  @override
  String get expensesDetailReason => 'કારણ';

  @override
  String get expensesDetailPay => 'ચૂકવો';

  @override
  String get expensesDetailPayFrom => 'માંથી ચૂકવો';

  @override
  String get expensesDetailPaidOn => 'ચુકવણીની તારીખ';

  @override
  String get expensesDetailEdit => 'ફેરફાર કરો';

  @override
  String get expensesDetailSubmit => 'મોકલો';

  @override
  String get expensesDetailCancel => 'દાવો રદ કરો';

  @override
  String get expensesDetailVoucher => 'ખર્ચની નોંધ';

  @override
  String get expensesDetailPaymentVoucher => 'ચુકવણી';

  @override
  String expensesDetailRejected(String reason) {
    return 'નામંજૂર: $reason';
  }

  @override
  String get expensesDetailReceipt => 'રસીદ જુઓ';

  @override
  String get expensesCategoriesTitle => 'ખર્ચ પ્રકાર';

  @override
  String get expensesCategoriesSubtitle =>
      'દરેક પ્રકારનો ખર્ચ કયા ખાતામાં જાય છે, મર્યાદાઓ, અને જીએસટી ક્રેડિટ અવરોધિત છે કે નહીં (કલમ 17(5)).';

  @override
  String get expensesCategoriesName => 'પ્રકાર';

  @override
  String get expensesCategoriesAccount => 'ખાતું';

  @override
  String get expensesCategoriesBlocked => 'જીએસટી ક્રેડિટ નહીં';

  @override
  String get expensesCategoriesLimit => 'દાવા દીઠ મર્યાદા (₹)';

  @override
  String get expensesCategoriesReceiptAbove => 'આનાથી વધુ પર રસીદ જરૂરી (₹)';

  @override
  String get expensesCategoriesAdd => 'પ્રકાર ઉમેરો';

  @override
  String get expensesCategoriesSave => 'સાચવો';

  @override
  String get expensesErrorsNoLines => 'ઓછામાં ઓછો એક ખર્ચ ઉમેરો.';

  @override
  String get expensesErrorsUnknownCategory => 'પ્રકાર પસંદ કરો.';

  @override
  String get expensesErrorsCategoryArchived => 'તે પ્રકાર આર્કાઇવ છે.';

  @override
  String get expensesErrorsInvalidAmount => 'રકમ દાખલ કરો.';

  @override
  String get expensesErrorsReceiptRequired => 'આ ખર્ચની રસીદ જોડો.';

  @override
  String get expensesErrorsOverLimit => 'આ પ્રકારની દાવા દીઠ મર્યાદાથી વધુ છે.';

  @override
  String get expensesErrorsInvalidGstin => 'વિક્રેતાનો જીએસટીઆઈએન માન્ય નથી.';

  @override
  String get expensesErrorsUnknownEmployee => 'કર્મચારી પસંદ કરો.';

  @override
  String get expensesErrorsUnknownProject => 'પ્રોજેક્ટ પસંદ કરો.';

  @override
  String get expensesErrorsClaimLocked =>
      'ફક્ત ડ્રાફ્ટ અથવા નામંજૂર દાવો બદલી શકાય.';

  @override
  String get expensesErrorsClaimNotSubmitted => 'દાવો મંજૂરીની રાહમાં નથી.';

  @override
  String get expensesErrorsClaimNotApproved => 'પહેલાં દાવો મંજૂર કરો.';

  @override
  String get expensesErrorsClaimPaid =>
      'ચૂકવેલો દાવો રદ ન થઈ શકે; પહેલાં ચુકવણી રદ કરો.';

  @override
  String get expensesErrorsPaidBeforeClaim =>
      'ચુકવણીની તારીખ દાવા પહેલાંની છે.';

  @override
  String get expensesErrorsCategoryExists => 'તે પ્રકાર પહેલેથી છે.';

  @override
  String get expensesErrorsNotAnExpenseAccount => 'ખર્ચનું ખાતું પસંદ કરો.';

  @override
  String get expensesErrorsFileType => 'ફોટો (JPG, PNG, WebP) અથવા PDF જોડો.';

  @override
  String get expensesErrorsFileTooLarge => 'ફાઇલ 5 MBથી મોટી છે.';

  @override
  String get expensesErrorsFileEmpty => 'ફાઇલ ખાલી છે.';

  @override
  String get projectsListTitle => 'પ્રોજેક્ટ';

  @override
  String get projectsListSubtitle =>
      'દરેક કામનાં કાર્યો, સમય, ખર્ચ અને બિલિંગ.';

  @override
  String get projectsListNew => 'નવો પ્રોજેક્ટ';

  @override
  String get projectsListCode => 'કોડ';

  @override
  String get projectsListName => 'પ્રોજેક્ટ';

  @override
  String get projectsListCustomer => 'ગ્રાહક';

  @override
  String get projectsListBilling => 'બિલિંગ';

  @override
  String get projectsListBillingsFixed => 'નિશ્ચિત કિંમત';

  @override
  String get projectsListBillingsTimeMaterial => 'સમય અને સામગ્રી';

  @override
  String get projectsListBillingsNonBillable => 'આંતરિક';

  @override
  String get projectsListStatus => 'સ્થિતિ';

  @override
  String get projectsListStatusesActive => 'સક્રિય';

  @override
  String get projectsListStatusesOnHold => 'રોકાયેલ';

  @override
  String get projectsListStatusesCompleted => 'પૂર્ણ';

  @override
  String get projectsListStatusesCancelled => 'રદ';

  @override
  String get projectsListRevenue => 'બિલ કર્યું';

  @override
  String get projectsListCost => 'ખર્ચ';

  @override
  String get projectsListMargin => 'માર્જિન';

  @override
  String get projectsListHours => 'કલાક';

  @override
  String get projectsListNone => 'હજી કોઈ પ્રોજેક્ટ નથી.';

  @override
  String get projectsFormContractValue => 'કરાર કિંમત (₹)';

  @override
  String get projectsFormBudgetCost => 'બજેટ ખર્ચ (₹)';

  @override
  String get projectsFormBudgetHours => 'બજેટ કલાક';

  @override
  String get projectsFormBillRate => 'કલાક દીઠ બિલ દર (₹)';

  @override
  String get projectsFormBillingItem => 'બિલ પર (સેવા વસ્તુ)';

  @override
  String get projectsFormStartOn => 'શરૂઆત';

  @override
  String get projectsFormEndOn => 'અંત';

  @override
  String get projectsFormNotes => 'નોંધ';

  @override
  String get projectsFormSave => 'પ્રોજેક્ટ સાચવો';

  @override
  String get projectsDetailLabour => 'મજૂરી';

  @override
  String get projectsDetailExpenses => 'ખર્ચ';

  @override
  String get projectsDetailPurchases => 'ખરીદી';

  @override
  String get projectsDetailUnbilled => 'બિલ ન થયેલો સમય';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return 'બજેટના $pct%';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return 'કલાકના $pct%';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% માર્જિન';
  }

  @override
  String get projectsDetailTasks => 'કાર્યો';

  @override
  String get projectsDetailTask => 'કાર્ય';

  @override
  String get projectsDetailAssignee => 'સોંપેલ';

  @override
  String get projectsDetailEstimate => 'અંદાજ (કલાક)';

  @override
  String get projectsDetailLogged => 'નોંધાયેલ (કલાક)';

  @override
  String get projectsDetailDue => 'મુદત';

  @override
  String get projectsDetailTaskStatusesTodo => 'કરવાનું';

  @override
  String get projectsDetailTaskStatusesDoing => 'ચાલુ';

  @override
  String get projectsDetailTaskStatusesDone => 'પૂર્ણ';

  @override
  String get projectsDetailAddTask => 'કાર્ય ઉમેરો';

  @override
  String get projectsDetailMembers => 'ટીમ અને દર';

  @override
  String get projectsDetailMember => 'વ્યક્તિ';

  @override
  String get projectsDetailMemberRate => 'બિલ દર (₹/કલાક)';

  @override
  String get projectsDetailAddMember => 'ઉમેરો';

  @override
  String get projectsDetailMilestones => 'માઇલસ્ટોન';

  @override
  String get projectsDetailMilestone => 'માઇલસ્ટોન';

  @override
  String get projectsDetailAmount => 'રકમ (₹)';

  @override
  String get projectsDetailAddMilestone => 'માઇલસ્ટોન ઉમેરો';

  @override
  String get projectsDetailBill => 'બિલ કરો';

  @override
  String projectsDetailBilled(String number) {
    return 'બિલ $number';
  }

  @override
  String get projectsDetailTime => 'સમય';

  @override
  String get projectsDetailBillTime => 'મંજૂર કલાકોનું બિલ કરો';

  @override
  String get projectsDetailBillUpTo => 'સુધી';

  @override
  String get projectsDetailInvoices => 'બિલ';

  @override
  String get projectsDetailEdit => 'પ્રોજેક્ટ બદલો';

  @override
  String get projectsDetailRemove => 'દૂર કરો';

  @override
  String projectsDetailInvoiced(String number) {
    return 'બિલ $number બન્યું.';
  }

  @override
  String get projectsTimeTitle => 'ટાઇમશીટ';

  @override
  String get projectsTimeSubtitle =>
      'પ્રોજેક્ટ પર કલાક નોંધો; મંજૂર બિલપાત્ર કલાકોનું બિલ કરી શકાય.';

  @override
  String get projectsTimeLog => 'સમય નોંધો';

  @override
  String get projectsTimeEmployee => 'કર્મચારી';

  @override
  String get projectsTimeProject => 'પ્રોજેક્ટ';

  @override
  String get projectsTimeTask => 'કાર્ય';

  @override
  String get projectsTimeDate => 'તારીખ';

  @override
  String get projectsTimeHours => 'કલાક';

  @override
  String get projectsTimeBillable => 'બિલપાત્ર';

  @override
  String get projectsTimeNote => 'નોંધ';

  @override
  String get projectsTimeSave => 'નોંધો';

  @override
  String get projectsTimeApprove => 'મંજૂર કરો';

  @override
  String get projectsTimeReject => 'નામંજૂર કરો';

  @override
  String projectsTimeSelected(String count) {
    return '$count પસંદ';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'મોકલ્યું';

  @override
  String get projectsTimeStatusesApproved => 'મંજૂર';

  @override
  String get projectsTimeStatusesRejected => 'નામંજૂર';

  @override
  String get projectsTimeStatusesBilled => 'બિલ થયું';

  @override
  String get projectsTimeTotal => 'કુલ';

  @override
  String get projectsTimeNone => 'કોઈ સમય નોંધાયો નથી.';

  @override
  String get projectsTimeCostRate => 'ખર્ચ/કલાક';

  @override
  String get projectsTimeBillRate => 'બિલ/કલાક';

  @override
  String get projectsTimeDelete => 'કાઢી નાખો';

  @override
  String get projectsErrorsNotACustomer => 'ગ્રાહક પસંદ કરો.';

  @override
  String get projectsErrorsUnknownItem => 'સેવા વસ્તુ પસંદ કરો.';

  @override
  String get projectsErrorsEndsBeforeStart => 'અંતની તારીખ શરૂઆત પહેલાંની છે.';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'પહેલાં પ્રોજેક્ટનો ગ્રાહક નક્કી કરો.';

  @override
  String get projectsErrorsBillingItemRequired =>
      'પ્રોજેક્ટમાં બિલ માટેની વસ્તુ પસંદ કરો.';

  @override
  String get projectsErrorsMilestoneBilled =>
      'તે માઇલસ્ટોનનું બિલ પહેલેથી થયું છે.';

  @override
  String get projectsErrorsProjectNotActive => 'પ્રોજેક્ટ સક્રિય નથી.';

  @override
  String get projectsErrorsInvalidHours => '0 થી 24 વચ્ચેના કલાક દાખલ કરો.';

  @override
  String get projectsErrorsTooManyHours => 'એક દિવસમાં 24 કલાકથી વધુ.';

  @override
  String get projectsErrorsUnknownTask => 'આ પ્રોજેક્ટનું કાર્ય પસંદ કરો.';

  @override
  String get projectsErrorsTimesheetLocked =>
      'મંજૂર કે બિલ થયેલો સમય બદલી શકાતો નથી.';

  @override
  String get projectsErrorsNothingToBill =>
      'બિલ કરવા માટે કોઈ મંજૂર બિલપાત્ર કલાક નથી.';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'ફક્ત સમય-અને-સામગ્રી પ્રોજેક્ટનું કલાક મુજબ બિલ થાય છે.';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'તે તારીખે કર્મચારી નોકરીમાં ન હતા.';

  @override
  String get projectsErrorsUnknownEmployee => 'કર્મચારી પસંદ કરો.';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ગ્રાહકોની',
      one: '$count ગ્રાહકની',
    );
    return '$_temp0 ચુકવણી 60 દિવસથી વધુ મોડી છે: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$periodનું $form $days દિવસ મોડું છે';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$periodનું $form $days દિવસમાં ભરવાનું છે';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count વસ્તુઓ',
      one: '$count વસ્તુ',
    );
    return '$_temp0 ફરી ઓર્ડર સ્તરથી નીચે';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$count બેંક સ્ટેટમેન્ટ લાઇન એક અઠવાડિયાથી વધુ સમયથી મેળવણીની રાહમાં છે';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$count ખર્ચ દાવા 3 દિવસથી વધુ સમયથી મંજૂરીની રાહમાં છે';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ફોલો-અપ મોડાં છે',
      one: '$count ફોલો-અપ મોડું છે',
    );
    return '$_temp0';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$nameમાં ઋણ બાકી ($amount) છે: કોઈ નોંધ રહી ગઈ છે કે ખોટી છે';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    return '$count મંજૂરી મેમો છ મહિનાની ઇન્વૉઇસ મર્યાદાની નજીક છે';
  }

  @override
  String alertsApprovalsOut(num count) {
    return '$count મંજૂરી મેમોનો માલ 30 દિવસથી વધુ બહાર છે';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count સંવેદનશીલ ફેરફારો',
      one: '$count સંવેદનશીલ ફેરફાર',
    );
    return 'છેલ્લા 7 દિવસમાં $_temp0 (બેંક વિગતો, ઉધાર શરતો, કર સેટિંગ કે અધિકાર)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count કર્મચારી દસ્તાવેજો',
      one: '$count કર્મચારી દસ્તાવેજ',
    );
    return '$_temp0 પૂરા થઈ ગયા છે કે 30 દિવસમાં થશે';
  }

  @override
  String get checksTitle => 'તપાસ';

  @override
  String get checksSubtitle =>
      'તમારા સીએ જુએ તે પહેલાં ફરી જોવા જેવી નોંધો: આવકવેરા કાયદા હેઠળ રોકડ મર્યાદા, સંભવિત ડુપ્લિકેટ બિલ, ખર્ચથી ઓછા ભાવે વેચાણ, શૂન્યથી નીચે સ્ટોક.';

  @override
  String get checksNone => 'કંઈ અસામાન્ય મળ્યું નથી.';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return '$partyને રોકડ ચૂકવ્યા: એક દિવસમાં $amount. એક વ્યક્તિને એક દિવસમાં ₹10,000થી વધુ રોકડ ખર્ચ માન્ય નથી (કલમ 40A(3)); બેંકથી ચૂકવો.';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return '$party પાસેથી રોકડ મળ્યા: એક દિવસમાં $amount. ₹2 લાખ કે વધુ રોકડ સ્વીકારવી માન્ય નથી (કલમ 269ST); દંડ એ જ રકમ જેટલો.';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplierએ એક અઠવાડિયામાં બે વાર $amountનું બિલ આપ્યું ($first અને $second). એક ડુપ્લિકેટ છે?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item $rateમાં વેચાઈ, ખરીદ દર $costથી ઓછું.';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item $qty $uom પર છે: સ્ટોક કરતાં વધુ વેચાયું કે આપાયું.';
  }

  @override
  String get assistantTitle => 'સહાયક';

  @override
  String get assistantSubtitle =>
      'વેચાણ, લેણાં-દેવાં, નફો, સ્ટોક કે જીએસટી વિશે પૂછો. તે તમારો હિસાબ વાંચે છે; ક્યારેય બદલતો નથી.';

  @override
  String get assistantPlaceholder => 'પ્રશ્ન પૂછો…';

  @override
  String get assistantSend => 'પૂછો';

  @override
  String get assistantThinking => 'શોધી રહ્યા છીએ…';

  @override
  String get assistantClear => 'નવી વાતચીત';

  @override
  String get assistantDemo =>
      'બિલ્ટ-ઇન સહાયક: સામાન્ય પ્રશ્નોના જવાબ આપે છે. કંઈ પણ પૂછવા AI સેવા જોડો.';

  @override
  String get assistantClaude =>
      'તમારા હિસાબમાંથી, તમારા ઍક્સેસ અધિકારો સાથે Claudeએ જવાબ આપ્યો.';

  @override
  String get assistantSuggestionsS1 => 'આપણું સૌથી વધુ લેણું કોની પાસે છે?';

  @override
  String get assistantSuggestionsS2 => 'આ મહિને વેચાણ કેવું છે?';

  @override
  String get assistantSuggestionsS3 => 'આ મહિને આપણો નફો કેટલો છે?';

  @override
  String get assistantSuggestionsS4 => 'કઈ વસ્તુઓ ફરી ઓર્ડર સ્તરથી નીચે છે?';

  @override
  String get assistantSuggestionsS5 => 'મારે તપાસવી જોઈએ એવી કોઈ નોંધ છે?';

  @override
  String assistantTools(String tools) {
    return 'જોયું: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'સહાયક વ્યસ્ત છે; એક મિનિટ પછી ફરી પ્રયાસ કરો.';

  @override
  String get assistantErrorsAssistantFailed =>
      'સહાયક હમણાં જવાબ આપી શક્યો નહીં.';

  @override
  String get assistantErrorsEmptyQuestion => 'પ્રશ્ન લખો.';

  @override
  String get crmLeadsTitle => 'લીડ';

  @override
  String get crmLeadsSubtitle => 'પહેલી પૂછપરછથી ઓર્ડર સુધીના સંભવિત ગ્રાહકો.';

  @override
  String get crmLeadsNew => 'નવી લીડ';

  @override
  String get crmLeadsName => 'સંપર્ક વ્યક્તિ';

  @override
  String get crmLeadsOrganisation => 'વ્યવસાય';

  @override
  String get crmLeadsPhone => 'મોબાઇલ';

  @override
  String get crmLeadsEmail => 'ઇમેઇલ';

  @override
  String get crmLeadsGstin => 'જીએસટીઆઈએન';

  @override
  String get crmLeadsState => 'રાજ્ય';

  @override
  String get crmLeadsCity => 'શહેર';

  @override
  String get crmLeadsSource => 'સ્ત્રોત';

  @override
  String get crmLeadsSourcesWalkIn => 'સીધી મુલાકાત';

  @override
  String get crmLeadsSourcesReferral => 'ભલામણ';

  @override
  String get crmLeadsSourcesWebsite => 'વેબસાઇટ';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'વેપાર મેળો';

  @override
  String get crmLeadsSourcesOther => 'અન્ય';

  @override
  String get crmLeadsStage => 'તબક્કો';

  @override
  String get crmLeadsStagesNew => 'નવી';

  @override
  String get crmLeadsStagesContacted => 'સંપર્ક થયો';

  @override
  String get crmLeadsStagesQualified => 'યોગ્ય';

  @override
  String get crmLeadsStagesProposal => 'દરખાસ્ત મોકલી';

  @override
  String get crmLeadsStagesWon => 'મળી';

  @override
  String get crmLeadsStagesLost => 'ગઈ';

  @override
  String get crmLeadsValue => 'અપેક્ષિત કિંમત (₹)';

  @override
  String get crmLeadsExpectedClose => 'અપેક્ષિત પૂર્ણતા';

  @override
  String get crmLeadsOwner => 'જવાબદાર';

  @override
  String get crmLeadsNotes => 'નોંધ';

  @override
  String get crmLeadsNextFollowUp => 'આગલું ફોલો-અપ';

  @override
  String get crmLeadsSave => 'સાચવો';

  @override
  String get crmLeadsNone => 'હજી કોઈ લીડ નથી.';

  @override
  String get crmLeadsSearch => 'નામ, વ્યવસાય, મોબાઇલ કે શહેર શોધો';

  @override
  String crmLeadsWeighted(String amount) {
    return 'ભારિત $amount';
  }

  @override
  String get crmLeadsConvert => 'મળી: ગ્રાહક બનાવો';

  @override
  String get crmLeadsLost => 'ગઈ તરીકે નોંધો';

  @override
  String get crmLeadsLostReason => 'કેમ ગઈ?';

  @override
  String get crmLeadsEdit => 'લીડ બદલો';

  @override
  String get crmActivitiesTitle => 'ફોલો-અપ';

  @override
  String get crmActivitiesSubtitle =>
      'કૉલ, મીટિંગ અને કાર્યો, સૌથી પહેલાં બાકી હોય તે પહેલાં.';

  @override
  String get crmActivitiesAdd => 'ઉમેરો';

  @override
  String get crmActivitiesKind => 'પ્રકાર';

  @override
  String get crmActivitiesKindsCall => 'કૉલ';

  @override
  String get crmActivitiesKindsMeeting => 'મીટિંગ';

  @override
  String get crmActivitiesKindsTask => 'કાર્ય';

  @override
  String get crmActivitiesKindsNote => 'નોંધ';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'ઇમેઇલ';

  @override
  String get crmActivitiesSubject => 'શું કરવાનું કે શું થયું';

  @override
  String get crmActivitiesDue => 'ક્યારે';

  @override
  String get crmActivitiesDone => 'પૂર્ણ તરીકે નોંધો';

  @override
  String get crmActivitiesReopen => 'અપૂર્ણ તરીકે નોંધો';

  @override
  String get crmActivitiesNotes => 'નોંધ';

  @override
  String get crmActivitiesNone => 'અહીં કંઈ નથી.';

  @override
  String get crmActivitiesOpen => 'ખુલ્લાં';

  @override
  String get crmActivitiesAll => 'બધાં';

  @override
  String get crmActivitiesLate => 'મોડું';

  @override
  String get crmMessagesSend => 'WhatsApp મોકલો';

  @override
  String get crmMessagesTemplate => 'નમૂનો';

  @override
  String crmMessagesSent(String to) {
    return '$toને મોકલ્યું.';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'મોકલાયું નહીં: $error';
  }

  @override
  String get crmMessagesDemo =>
      'ડેમો મોડ: WhatsApp Business જોડાય ત્યાં સુધી સંદેશા નોંધાય છે પણ પહોંચાડાતા નથી.';

  @override
  String get crmMessagesRemind => 'ચુકવણી યાદી મોકલો';

  @override
  String get crmTemplatesTitle => 'સંદેશ નમૂના';

  @override
  String get crmTemplatesSubtitle =>
      'નામ, રકમ અને તારીખ માટે ક્રમાંકિત ખાલી જગ્યાવાળા WhatsApp સંદેશા. ગ્રાહકને પહેલાં સંદેશ મોકલવા નમૂનો Meta દ્વારા મંજૂર હોવો જોઈએ; તેનું મંજૂર નામ દાખલ કરો.';

  @override
  String get crmTemplatesName => 'નામ (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'લખાણ';

  @override
  String get crmTemplatesCategory => 'વર્ગ';

  @override
  String get crmTemplatesCategoriesUtility => 'અપડેટ (બિલ, યાદી)';

  @override
  String get crmTemplatesCategoriesMarketing => 'માર્કેટિંગ';

  @override
  String get crmTemplatesProviderName => 'Meta પરનું મંજૂર નામ';

  @override
  String get crmTemplatesAdd => 'નમૂનો ઉમેરો';

  @override
  String get crmTemplatesSave => 'સાચવો';

  @override
  String get crmCustomerTitle => 'ગ્રાહક';

  @override
  String get crmCustomerBalance => 'બાકી';

  @override
  String get crmCustomerSalesThisYear => 'આ વર્ષનું વેચાણ';

  @override
  String get crmCustomerSalesLastYear => 'ગયું વર્ષ';

  @override
  String get crmCustomerOpenItems => 'ખુલ્લાં બિલ';

  @override
  String get crmCustomerInvoices => 'તાજેતરનાં બિલ';

  @override
  String get crmCustomerReceipts => 'તાજેતરમાં મળેલા પૈસા';

  @override
  String get crmCustomerOrders => 'ખુલ્લાં ક્વોટેશન અને ઓર્ડર';

  @override
  String get crmCustomerActivities => 'પ્રવૃત્તિ';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'લીડ $codeમાંથી ($source)';
  }

  @override
  String get crmCustomerLedger => 'ખાતાવહી પત્રક';

  @override
  String get crmErrorsInvalidPhone => '10 અંકનો ભારતીય મોબાઇલ નંબર દાખલ કરો.';

  @override
  String get crmErrorsInvalidGstin => 'જીએસટીઆઈએન માન્ય નથી.';

  @override
  String get crmErrorsConvertToWin => 'લીડ જીતવા “મળી: ગ્રાહક બનાવો” વાપરો.';

  @override
  String get crmErrorsLostReasonRequired => 'કેમ ગઈ તે જણાવો.';

  @override
  String get crmErrorsAlreadyConverted => 'આ લીડ પહેલેથી ગ્રાહક છે.';

  @override
  String get crmErrorsLeadOrCustomerRequired => 'લીડ અથવા ગ્રાહક પસંદ કરો.';

  @override
  String get crmErrorsUnknownTemplate => 'નમૂનો પસંદ કરો.';

  @override
  String get crmErrorsMissingParam => 'નમૂનાની દરેક ખાલી જગ્યા ભરો.';

  @override
  String get crmErrorsTemplateTooLong => 'નમૂનો ખૂબ લાંબો છે.';

  @override
  String get crmErrorsTemplateExists => 'આ નામનો નમૂનો પહેલેથી છે.';

  @override
  String get crmErrorsNothingOutstanding => 'આ ગ્રાહક પાસે કંઈ બાકી નથી.';

  @override
  String get crmErrorsInvalidTemplateName =>
      'ફક્ત નાના અક્ષરો, અંકો અને _ વાપરો.';

  @override
  String get crmErrorsUnknownAccount => 'ગ્રાહક પસંદ કરો.';

  @override
  String get crmErrorsInvalidStage => 'તબક્કો પસંદ કરો.';

  @override
  String get priceListsTitle => 'ભાવ યાદી';

  @override
  String get priceListsSubtitle =>
      'જથ્થાબંધ, વિતરક કે છૂટક ભાવ. યાદીવાળા ગ્રાહકને નવા ઓર્ડર અને ઇન્વૉઇસ પર તેના ભાવ મળે છે.';

  @override
  String get priceListsOne => 'ભાવ યાદી';

  @override
  String get priceListsNone => 'કોઈ નહીં (વેચાણ ભાવ)';

  @override
  String get priceListsNew => 'નવી ભાવ યાદી';

  @override
  String get priceListsName => 'નામ';

  @override
  String get priceListsDiscountPct => 'વેચાણ ભાવ પર છૂટ (%)';

  @override
  String get priceListsDiscountHint => 'નક્કી ભાવ વગરની દરેક વસ્તુ પર લાગુ';

  @override
  String get priceListsFixedRates => 'નક્કી ભાવ';

  @override
  String get priceListsCustomers => 'ગ્રાહકો';

  @override
  String get priceListsEmpty => 'હજી કોઈ ભાવ યાદી નથી.';

  @override
  String get priceListsAddRate => 'નક્કી ભાવ ઉમેરો';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'આ નામની ભાવ યાદી પહેલેથી છે.';

  @override
  String get priceListsErrorsDuplicateItem => 'એક વસ્તુ બે વાર છે.';

  @override
  String get agentsTitle => 'દલાલ અને એજન્ટ';

  @override
  String get agentsSubtitle =>
      'દરેક એજન્ટે લાવેલા ગ્રાહકો પાસેથી મળેલા પૈસા પર કમિશન. માલ પાછો આવે તો કમિશન પાછું થાય છે.';

  @override
  String get agentsIsAgent => 'દલાલ કે એજન્ટ (કમિશન મળે છે)';

  @override
  String get agentsCommissionPct => 'કમિશન (%)';

  @override
  String get agentsCommissionHint => 'કરપાત્ર મૂલ્ય પર, ગ્રાહક ચૂકવે તેમ';

  @override
  String get agentsAgent => 'એજન્ટ';

  @override
  String get agentsNoAgent => 'કોઈ એજન્ટ નહીં';

  @override
  String get agentsSalesman => 'સેલ્સમેન';

  @override
  String get agentsNoSalesman => 'કોઈ સેલ્સમેન નહીં';

  @override
  String get agentsEarned => 'કમાયેલું';

  @override
  String get agentsBilled => 'બિલ કર્યું';

  @override
  String get agentsDue => 'બાકી';

  @override
  String get agentsInvoice => 'બિલ';

  @override
  String get agentsBase => 'કરપાત્ર મૂલ્ય';

  @override
  String get agentsReceived => 'મળેલું';

  @override
  String get agentsNoInvoices => 'હજી કોઈ બિલ નથી.';

  @override
  String get agentsMakeBill => 'દલાલી બિલ બનાવો';

  @override
  String get agentsEmpty =>
      'હજી કોઈ એજન્ટ નથી. ખાતાવહીમાં કોઈ ખાતાને દલાલ કે એજન્ટ તરીકે ચિહ્નિત કરો.';

  @override
  String get agentsBills => 'દલાલી બિલ';

  @override
  String get agentsNumber => 'નંબર';

  @override
  String get agentsCommission => 'કમિશન';

  @override
  String get agentsTds => 'ટીડીએસ';

  @override
  String get agentsNet => 'ચોખ્ખું ચૂકવવાપાત્ર';

  @override
  String get agentsNoBills => 'હજી કોઈ દલાલી બિલ નથી.';

  @override
  String agentsBillFor(String name, String amount) {
    return '$name ને બાકી $amount કમિશનનું બિલ બનાવો.';
  }

  @override
  String get agentsTdsRate => 'ટીડીએસ દર (%)';

  @override
  String get agentsTdsHint =>
      'ખાલી રાખો: વર્ષનું કમિશન ₹20,000 થી વધે ત્યારે 194H હેઠળ 2%';

  @override
  String get agentsPost => 'બિલ પોસ્ટ કરો';

  @override
  String get agentsCancelBill => 'બિલ રદ કરો';

  @override
  String get agentsErrorsNothingToBill => 'તે તારીખે આ એજન્ટનું કંઈ બાકી નથી.';

  @override
  String get agentsErrorsNotAnAgent =>
      'દલાલ કે એજન્ટ તરીકે ચિહ્નિત ખાતું પસંદ કરો.';

  @override
  String get targetsTitle => 'સેલ્સમેન લક્ષ્ય';

  @override
  String get targetsSubtitle =>
      'કમિશન સ્લેબ સાથે માસિક લક્ષ્ય, દરેક સેલ્સમેનના વેચાણ (વળતર બાદ) સામે.';

  @override
  String get targetsPrevious => 'પાછલો મહિનો';

  @override
  String get targetsNext => 'આગલો મહિનો';

  @override
  String get targetsEdit => 'લક્ષ્ય નક્કી કરો';

  @override
  String get targetsChooseSalesman => 'સેલ્સમેન પસંદ કરો';

  @override
  String get targetsTarget => 'લક્ષ્ય';

  @override
  String get targetsSlabs => 'સ્લેબ';

  @override
  String get targetsSlabsHint =>
      'સ્લેબ = લક્ષ્યના કેટલા ટકા : કમિશન ટકા. જેમ કે 0:1, 100:2 લક્ષ્યથી ઓછું હોય તો 1% અને લક્ષ્ય કે વધુ હોય તો 2%.';

  @override
  String get targetsAdd => 'સેલ્સમેન ઉમેરો';

  @override
  String get targetsCopyLast => 'પાછલા મહિનામાંથી કૉપી કરો';

  @override
  String get targetsAchieved => 'હાંસલ';

  @override
  String get targetsProgress => 'લક્ષ્યના';

  @override
  String get targetsRate => 'દર';

  @override
  String targetsInvoices(num n) {
    return '$n બિલ';
  }

  @override
  String targetsReturns(String amount) {
    return 'વળતર $amount';
  }

  @override
  String get targetsNoTarget => 'કોઈ લક્ષ્ય નથી';

  @override
  String get targetsEmpty => 'આ મહિને કોઈ લક્ષ્ય કે સેલ્સમેનનું વેચાણ નથી.';

  @override
  String get targetsNote =>
      'વેચાણ = સેલ્સમેનના બિલોનું કરપાત્ર મૂલ્ય, તે મહિને તે બિલો પર આપેલી ક્રેડિટ નોટ બાદ કરીને.';

  @override
  String get targetsErrorsInvalid =>
      'દરેક લાઇનમાં સેલ્સમેન, રૂપિયામાં લક્ષ્ય અને 0:1, 100:2 જેવા સ્લેબ જોઈએ.';

  @override
  String get targetsErrorsDuplicateSalesman => 'એક સેલ્સમેન બે વાર છે.';

  @override
  String get targetsErrorsDuplicateSlab => 'બે સ્લેબ એક જ ટકાથી શરૂ થાય છે.';

  @override
  String get targetsErrorsUnknownEmployee =>
      'તમારા કર્મચારીઓમાંથી સેલ્સમેન પસંદ કરો.';

  @override
  String get schemesTitle => 'સ્કીમ અને ઑફર';

  @override
  String get schemesSubtitle =>
      'કાઉન્ટર પર આપમેળે લાગુ થતી ઑફર: ટકા છૂટ, રકમ છૂટ, X ખરીદો Y મેળવો, સ્લેબ અને કૉમ્બો.';

  @override
  String get schemesNew => 'નવી સ્કીમ';

  @override
  String get schemesName => 'નામ';

  @override
  String get schemesOffer => 'ઑફર';

  @override
  String get schemesOn => 'શેના પર';

  @override
  String get schemesDates => 'તારીખો';

  @override
  String get schemesOff => 'બંધ';

  @override
  String get schemesEmpty => 'હજી કોઈ સ્કીમ નથી.';

  @override
  String get schemesRules =>
      'દરેક લાઇન પર વધુમાં વધુ એક સ્કીમ લાગે છે, અને બિલ પર ગ્રાહકની સૌથી વધુ બચત કરતો મેળ લાગે છે. પોતાની છૂટવાળી લાઇન પર સ્કીમ લાગતી નથી.';

  @override
  String get schemesEverything => 'બધું';

  @override
  String get schemesAlways => 'હંમેશા';

  @override
  String get schemesNow => 'હમણાંથી';

  @override
  String get schemesNoEnd => 'છેલ્લી તારીખ નહીં';

  @override
  String schemesRange(String from, String to) {
    return '$from થી $to';
  }

  @override
  String get schemesKind => 'પ્રકાર';

  @override
  String get schemesStartsOn => 'થી';

  @override
  String get schemesEndsOn => 'સુધી';

  @override
  String get schemesPct => 'છૂટ (%)';

  @override
  String get schemesOffPct => 'વધારાના નંગ પર છૂટ (%)';

  @override
  String get schemesOffPctHint => '100 એટલે મફત';

  @override
  String get schemesAmount => 'છૂટની રકમ (₹)';

  @override
  String get schemesMinValue => 'આ વસ્તુઓ પર ઓછામાં ઓછું (₹)';

  @override
  String get schemesBuy => 'ખરીદો';

  @override
  String get schemesGet => 'મેળવો';

  @override
  String get schemesSlabs => 'સ્લેબ';

  @override
  String get schemesQtySlabsHint => 'નંગ : ટકા છૂટ, જેમ કે 3:10, 5:20';

  @override
  String get schemesValueSlabsHint =>
      'રૂપિયા : ટકા છૂટ, જેમ કે 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'કૉમ્બો કિંમત (₹)';

  @override
  String get schemesComboItems => 'કૉમ્બોની વસ્તુઓ';

  @override
  String get schemesItem => 'વસ્તુ';

  @override
  String get schemesQty => 'જથ્થો';

  @override
  String get schemesAddItem => 'વસ્તુ ઉમેરો';

  @override
  String get schemesAddStyle => 'સ્ટાઇલ ઉમેરો';

  @override
  String get schemesScopeHint =>
      'બધી વસ્તુઓ માટે આ ખાલી રાખો; નહીં તો આમાંથી કોઈ પણ સાથે મેળ ખાતી વસ્તુ ગણાશે.';

  @override
  String get schemesBrands => 'બ્રાન્ડ';

  @override
  String get schemesCategories => 'શ્રેણીઓ';

  @override
  String get schemesStyles => 'સ્ટાઇલ';

  @override
  String get schemesItems => 'વસ્તુઓ';

  @override
  String get schemesCommaHint => 'અલ્પવિરામથી અલગ કરો';

  @override
  String get schemesActive => 'ચાલુ';

  @override
  String get schemesKindsPercent => 'ટકા છૂટ';

  @override
  String get schemesKindsAmountOff => 'રકમ છૂટ';

  @override
  String get schemesKindsQtySlab => 'જથ્થા સ્લેબ';

  @override
  String get schemesKindsValueSlab => 'મૂલ્ય સ્લેબ';

  @override
  String get schemesKindsBuyGet => 'X ખરીદો Y મેળવો';

  @override
  String get schemesKindsCombo => 'કૉમ્બો અથવા હેમ્પર';

  @override
  String get schemesKindHintPercent => 'દરેક સમાવિષ્ટ વસ્તુ પર સરખા ટકા';

  @override
  String get schemesKindHintAmountOff =>
      'નક્કી રકમની છૂટ, મૂલ્ય પ્રમાણે વહેંચાયેલી';

  @override
  String get schemesKindHintQtySlab => 'વધુ નંગ, વધુ ટકા';

  @override
  String get schemesKindHintValueSlab => 'મોટું બિલ, વધુ ટકા';

  @override
  String get schemesKindHintBuyGet =>
      'દરેક જૂથની સૌથી સસ્તી વસ્તુઓ મફત કે છૂટ પર';

  @override
  String get schemesKindHintCombo => 'વસ્તુઓનો સેટ એક કિંમતે';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% છૂટ';
  }

  @override
  String schemesSumMin(String amount) {
    return '$amount કે વધુ પર';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount છૂટ';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ નંગ $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return '$buy ખરીદો $get મફત';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return '$buy ખરીદો $get પર $pct% છૂટ';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$n વસ્તુઓ $price માં';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'આ પ્રકારની સ્કીમ માટે જરૂરી વિગતો ભરો.';

  @override
  String get schemesErrorsSchemeNameTaken => 'આ નામની સ્કીમ પહેલેથી છે.';

  @override
  String get schemesErrorsEndsBeforeStart =>
      'છેલ્લી તારીખ શરૂઆતની તારીખ પહેલાં છે.';

  @override
  String get schemesErrorsDuplicateSlab => 'બે સ્લેબ એક જ બિંદુથી શરૂ થાય છે.';

  @override
  String get schemesErrorsUnknownItem => 'તમારી યાદીમાંથી વસ્તુઓ પસંદ કરો.';

  @override
  String get schemesErrorsUnknownStyle => 'તમારી યાદીમાંથી સ્ટાઇલ પસંદ કરો.';

  @override
  String get schemesErrorsSlabs => 'સ્લેબ આ રીતે લખો: 3:10, 5:20.';

  @override
  String get schemesErrorsNumber => 'રકમ અને ટકા સંખ્યા હોવા જોઈએ.';

  @override
  String get interestTitle => 'બાકી પર વ્યાજ';

  @override
  String get interestSubtitle =>
      'દરેક બિલ પર નિયત તારીખ પછીના દિવસોનું સાદું વ્યાજ, ગ્રાહકના દરે.';

  @override
  String get interestPartyRates => 'જેમનો વ્યાજ દર નક્કી છે તેવા ગ્રાહકો.';

  @override
  String interestUsingRate(String rate) {
    return 'પોતાનો દર ન હોય તેવા ગ્રાહકોની ગણતરી $rate% થી.';
  }

  @override
  String get interestPartyRatesOnly => 'માત્ર દર ધરાવતા ગ્રાહકો';

  @override
  String interestTryRate(String rate) {
    return 'બધાની $rate% થી ગણતરી કરો';
  }

  @override
  String get interestRate => 'દર';

  @override
  String get interestOverdue => 'બાકી';

  @override
  String get interestInterest => 'વ્યાજ';

  @override
  String interestDueOn(String date) {
    return 'નિયત $date';
  }

  @override
  String get interestNone => 'વ્યાજ લગાવવા કોઈ બાકી બિલ નથી.';

  @override
  String get interestGstNote =>
      'મોડી ચુકવણી પરનું વ્યાજ પુરવઠાના મૂલ્યનો ભાગ છે (CGST કાયદો કલમ 15(2)(d)); માલના દરે GST સાથે બિલ કરો.';

  @override
  String get integrityTitle => 'અખંડિતતા તપાસ';

  @override
  String get integritySubtitle =>
      'શું તમારા હિસાબ પરસ્પર મેળ ખાય છે? દરેક તપાસ મળવી જ જોઈએ તેવી બે બાબતોની સરખામણી કરે છે અને તફાવત તેના રેકોર્ડ સાથે બતાવે છે.';

  @override
  String get integrityAllGood =>
      'બધી તપાસ પાસ છે. તમારા હિસાબ પરસ્પર મેળ ખાય છે.';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n તપાસ પર ધ્યાન આપવું',
      one: '$n તપાસ પર ધ્યાન આપવું',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'પાસ';

  @override
  String get integrityFail => 'તફાવત';

  @override
  String get integrityWarn => 'આ જુઓ';

  @override
  String get integrityRecords => 'રેકોર્ડ';

  @override
  String get integrityFirstTwenty => 'પહેલા 20 બતાવ્યા છે.';

  @override
  String get integrityVouchersBalanceTitle => 'દરેક વાઉચર સંતુલિત છે';

  @override
  String get integrityVouchersBalanceHelp =>
      'દરેક વાઉચરમાં ઉધાર અને જમા સરખા છે. જે નથી તે અહીં દેખાય છે.';

  @override
  String get integrityTrialBalanceTitle => 'ટ્રાયલ બેલેન્સ સંતુલિત છે';

  @override
  String get integrityTrialBalanceHelp =>
      'શરૂઆતની બાકી અને દરેક નોંધનો સરવાળો શૂન્ય હોવો જોઈએ. તફાવત સામાન્ય રીતે એટલે આવે કે શરૂઆતની બાકી બીજી બાજુ, જેમ કે માલિકની મૂડી, વગર નોંધાઈ.';

  @override
  String get integrityInvoicesMatchLedgerTitle =>
      'વેચાણ બિલ ખાતાવહી સાથે મેળ ખાય છે';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'દરેક નોંધાયેલા બિલે તેની કુલ રકમ ગ્રાહકના ખાતામાં નાખી.';

  @override
  String get integrityBillsMatchLedgerTitle =>
      'ખરીદ બિલ ખાતાવહી સાથે મેળ ખાય છે';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'રિવર્સ ચાર્જ સિવાય દરેક નોંધાયેલા બિલે કુલ રકમ સપ્લાયરના ખાતામાં નાખી.';

  @override
  String get integrityDocumentsPostedTitle =>
      'નોંધાયેલા દસ્તાવેજોની ખાતાવહી એન્ટ્રીઓ છે';

  @override
  String get integrityDocumentsPostedHelp =>
      'જે નોંધાયેલા બિલ પાછળ વાઉચર નથી તે અહીં દેખાય છે.';

  @override
  String get integrityCancelledReversedTitle => 'રદ વાઉચરનો કુલ શૂન્ય છે';

  @override
  String get integrityCancelledReversedHelp =>
      'વાઉચર રદ કરતાં તેણે સ્પર્શેલા દરેક ખાતાની ઉલટી એન્ટ્રી થવી જોઈએ.';

  @override
  String get integrityReceivablesMatchTitle =>
      'ગ્રાહકો પાસેથી લેણું ખાતાવહી સાથે મેળ ખાય છે';

  @override
  String get integrityReceivablesMatchHelp =>
      'બાકી યાદીનો સરવાળો ગ્રાહકોની ખાતાવહી બાકી જેટલો છે.';

  @override
  String get integrityPayablesMatchTitle =>
      'સપ્લાયરોને દેવું ખાતાવહી સાથે મેળ ખાય છે';

  @override
  String get integrityPayablesMatchHelp =>
      'બાકી યાદીનો સરવાળો સપ્લાયરોની ખાતાવહી બાકી જેટલો છે.';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'ગિફ્ટ વાઉચર જવાબદારી વણવપરાયેલા વાઉચર સાથે મેળ ખાય છે';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'ગિફ્ટ વાઉચરનું ખાતું સક્રિય વાઉચર પર બાકી રકમ જેટલું છે.';

  @override
  String get integrityNegativeStockTitle => 'કોઈ સ્ટોક શૂન્યથી નીચે નથી';

  @override
  String get integrityNegativeStockHelp =>
      'ખાતામાં દેખાતા સ્ટોક કરતાં વધુ વેચાયેલો કે અપાયેલો માલ. આ સાચો સમયનો તફાવત હોઈ શકે; ખૂટતી પ્રાપ્તિ નોંધો.';

  @override
  String get sensitiveTitle => 'સંવેદનશીલ ફેરફારો';

  @override
  String get sensitiveSubtitle =>
      'પૈસા ખસેડી શકે કે દરવાજો ખોલી શકે તેવા ફેરફારો: બેંક વિગતો, ઉધાર શરતો, કર સેટિંગ, કોને શું અધિકાર, સમયગાળા લૉક અને પગાર સેટિંગ. સૌથી નવું ઉપર.';

  @override
  String get sensitiveKindBank => 'બેંક વિગતો';

  @override
  String get sensitiveKindCredit => 'ઉધાર શરતો';

  @override
  String get sensitiveKindTax => 'કર અને કંપની સેટિંગ';

  @override
  String get sensitiveKindPermissions => 'કોને શું અધિકાર';

  @override
  String get sensitiveKindPeriod => 'સમયગાળા લૉક અને નંબરિંગ';

  @override
  String get sensitiveKindPayroll => 'પગાર સેટિંગ';

  @override
  String get sensitiveKindOverride => 'ઉધાર મર્યાદા ઓળંગવી';

  @override
  String get sensitiveKindDevice => 'ઉપકરણો';

  @override
  String get sensitiveAll => 'બધા પ્રકાર';

  @override
  String get sensitiveNone => 'આ સમયગાળામાં કોઈ સંવેદનશીલ ફેરફાર નથી.';

  @override
  String get sensitiveShow => 'બતાવો';

  @override
  String get cfoTitle => 'માલિકનો દૃષ્ટિકોણ';

  @override
  String get cfoSubtitle =>
      'વેચાણથી નફા સુધી, આ સમયગાળો, ગયા વર્ષના એ જ સમયગાળા સાથે. તમારા હિસાબમાં આવકવેરો નોંધાયેલો ન હોય ત્યાં સુધી કર પહેલાંનો અને પછીનો નફો સરખો દેખાય છે.';

  @override
  String get cfoThisPeriod => 'આ સમયગાળો';

  @override
  String get cfoLastYear => 'ગયા વર્ષનો એ જ સમયગાળો';

  @override
  String get cfoGrowth => 'વૃદ્ધિ';

  @override
  String get cfoRevenue => 'આવક';

  @override
  String get cfoCostOfGoods => 'વેચાયેલા માલની કિંમત';

  @override
  String get cfoGrossProfit => 'કુલ નફો';

  @override
  String get cfoGrossMargin => 'કુલ માર્જિન';

  @override
  String get cfoOperatingExpenses => 'સંચાલન ખર્ચ';

  @override
  String get cfoOtherIncome => 'અન્ય આવક';

  @override
  String get cfoDepreciation => 'ઘસારો';

  @override
  String get cfoEbitda => 'EBITDA (ઘસારા પહેલાંનો નફો)';

  @override
  String get cfoNetProfit => 'ચોખ્ખો નફો';

  @override
  String get cfoMonthly => 'મહિના મુજબ કુલ માર્જિન';

  @override
  String get lrTitle => 'એલઆર અને પરિવહન એન્ટ્રી';

  @override
  String get lrSubtitle =>
      'ટ્રાન્સપોર્ટર મારફતે મોકલેલો માલ: એલઆર નંબર, બિલ, ભાડું, અને ગ્રાહક સુધી પહોંચ્યો કે નહીં.';

  @override
  String get lrTransporter => 'ટ્રાન્સપોર્ટર';

  @override
  String get lrLrNumber => 'એલઆર નંબર';

  @override
  String get lrInvoice => 'બિલ';

  @override
  String get lrNoInvoice => 'બિલ નથી';

  @override
  String get lrDestination => 'ગંતવ્ય';

  @override
  String get lrPackages => 'પેકેજ';

  @override
  String get lrWeight => 'વજન (કિગ્રા)';

  @override
  String get lrFreight => 'ભાડું';

  @override
  String get lrFreightBy => 'ભાડું કોણ ચૂકવશે';

  @override
  String get lrPaid => 'અમે ચૂકવ્યું';

  @override
  String get lrToPay => 'ગ્રાહક ચૂકવશે';

  @override
  String get lrAdd => 'મોકલેલો માલ નોંધો';

  @override
  String get lrStatus => 'સ્થિતિ';

  @override
  String get lrAllStatuses => 'બધી સ્થિતિ';

  @override
  String get lrStatusesBooked => 'બુક કર્યું';

  @override
  String get lrStatusesInTransit => 'રસ્તામાં';

  @override
  String get lrStatusesDelivered => 'પહોંચ્યો';

  @override
  String lrDeliveredOn(String date) {
    return '$date ના રોજ પહોંચ્યો';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'મોકલ્યાને $n દિવસ',
      one: 'મોકલ્યાને $n દિવસ',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty => 'હજી કોઈ માલ મોકલ્યો નથી. ઉપર પહેલો નોંધો.';

  @override
  String get lrErrorsLrTaken =>
      'આ ટ્રાન્સપોર્ટરનો આ એલઆર નંબર પહેલેથી નોંધાયેલો છે.';

  @override
  String get lrErrorsUnknownInvoice => 'તે બિલ મળ્યું નથી.';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'પહોંચવાની તારીખ મોકલવાની તારીખ પહેલાંની છે.';

  @override
  String get hsnTitle => 'એચએસએન અને એસએસી કોડ';

  @override
  String get hsnSubtitle =>
      'તમારા ધંધામાં વપરાતા કોડ, સરળ વર્ણન સાથે. માલ અને સ્ટાઇલના ફોર્મ આ યાદીમાંથી સૂચવે છે. અહીંનો દર ફક્ત સગવડ માટે: કપડાં અને પગરખાં પર કિંમતના સ્લેબ મુજબ કર લાગે છે.';

  @override
  String get hsnCode => 'કોડ';

  @override
  String get hsnDescription => 'વર્ણન';

  @override
  String get hsnKind => 'પ્રકાર';

  @override
  String get hsnGoods => 'માલ (એચએસએન)';

  @override
  String get hsnService => 'સેવા (એસએસી)';

  @override
  String get hsnRate => 'દર';

  @override
  String get hsnAddStandard => 'માનક કપડાંના કોડ ઉમેરો';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n કોડ ઉમેર્યા. અગાઉના કોડ બદલાયા નથી.',
      one: '$n કોડ ઉમેર્યો. અગાઉના કોડ બદલાયા નથી.',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'આર્કાઇવ કરેલા બતાવો';

  @override
  String get hsnEmpty =>
      'હજી કોઈ કોડ નથી. ઉપર ઉમેરો, અથવા માનક કપડાંના કોડ ઉમેરો.';

  @override
  String get hsnErrorsHsnTaken => 'આ કોડ યાદીમાં પહેલેથી છે.';

  @override
  String get hsnErrorsInvalidHsn =>
      'એચએસએન કોડમાં 4, 6 કે 8 અંક હોય છે (એસએસી કોડમાં 6).';

  @override
  String get notesTitle => 'મારી નોંધો';

  @override
  String get notesPrivate => 'આ ફક્ત તમે જ જોઈ શકો છો.';

  @override
  String get notesNone => 'કંઈ નોંધ્યું નથી. નીચે યાદ લખો.';

  @override
  String get notesPlaceholder => 'નોંધ કે યાદ લખો';

  @override
  String get notesRemindOn => 'મને આ દિવસે યાદ કરાવો';

  @override
  String get notesAdd => 'ઉમેરો';

  @override
  String get notesToday => 'આજે';

  @override
  String notesOverdue(String date) {
    return '$date ના રોજ હતું';
  }

  @override
  String notesMarkDone(String note) {
    return 'પૂર્ણ: $note';
  }

  @override
  String get notesRemove => 'નોંધ કાઢી નાખો';

  @override
  String get movementTitle => 'ઝડપી અને ધીમા વેચાતા માલ';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'છેલ્લા $days દિવસમાં શું વેચાયું. ઝડપી એટલે $fastMin કે વધુ નંગ; ધીમું એટલે થોડું વેચાયું પણ તેથી ઓછું; ન ચાલતું એટલે કંઈ નહીં. ન ચાલતો માલ પહેલા.';
  }

  @override
  String get movementWindow => 'પાછળ જુઓ';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n દિવસ',
      one: '$n દિવસ',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'ઝડપી માટે મર્યાદા (નંગ)';

  @override
  String get movementIncludeFabric => 'કાપડ અને ટ્રિમ્સ પણ સામેલ કરો';

  @override
  String get movementClassFast => 'ઝડપી';

  @override
  String get movementClassSlow => 'ધીમું';

  @override
  String get movementClassNone => 'ન ચાલતું';

  @override
  String movementItems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n માલ',
      one: '$n માલ',
    );
    return '$_temp0';
  }

  @override
  String movementPiecesInStock(String n) {
    return 'સ્ટોકમાં $n નંગ';
  }

  @override
  String get movementItem => 'માલ';

  @override
  String get movementStatus => 'ગતિ';

  @override
  String movementSold(String days) {
    return '$days દિવસમાં વેચાયું';
  }

  @override
  String get movementInStock => 'સ્ટોકમાં';

  @override
  String get movementStockValue => 'સ્ટોક મૂલ્ય';

  @override
  String get movementLastSold => 'છેલ્લું વેચાણ';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n દિવસ પહેલાં',
      one: '$n દિવસ પહેલાં',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'ક્યારેય નહીં';

  @override
  String get movementEmpty => 'બતાવવા માટે કોઈ સ્ટોક નથી.';

  @override
  String get movementFirstRows => 'પહેલા 500 માલ બતાવ્યા છે.';

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
