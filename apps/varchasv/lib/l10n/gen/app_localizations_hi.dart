// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Hindi (`hi`).
class AppLocalizationsHi extends AppLocalizations {
  AppLocalizationsHi([String locale = 'hi']) : super(locale);

  @override
  String get brandName => 'वर्चस्व';

  @override
  String get brandFull => 'वर्चस्व ईआरपी सिस्टम्स';

  @override
  String get brandTagline =>
      'हिसाब-किताब, जीएसटी, स्टॉक और पेरोल, ऑनलाइन और ऑफ़लाइन, आपकी भाषा में।';

  @override
  String get commonSave => 'सहेजें';

  @override
  String get commonSaving => 'सहेजा जा रहा है…';

  @override
  String get commonSaved => 'सहेज लिया गया';

  @override
  String get commonCancel => 'रद्द करें';

  @override
  String get commonEdit => 'बदलें';

  @override
  String get commonAdd => 'जोड़ें';

  @override
  String get commonClose => 'बंद करें';

  @override
  String get commonLoading => 'लोड हो रहा है…';

  @override
  String get commonOptional => 'वैकल्पिक';

  @override
  String get commonLanguage => 'भाषा';

  @override
  String get commonTheme => 'थीम';

  @override
  String get commonLight => 'लाइट';

  @override
  String get commonDark => 'डार्क';

  @override
  String get commonSystem => 'सिस्टम';

  @override
  String commonComingSoon(String phase) {
    return 'चरण $phase में आ रहा है';
  }

  @override
  String get commonNone => 'कोई नहीं';

  @override
  String get commonYes => 'हाँ';

  @override
  String get commonNo => 'नहीं';

  @override
  String get commonSearch => 'खोजें';

  @override
  String get commonAll => 'सभी';

  @override
  String get commonFrom => 'से';

  @override
  String get commonTo => 'तक';

  @override
  String get commonAsOf => 'तारीख तक';

  @override
  String get commonTotal => 'कुल';

  @override
  String get commonDebit => 'नामे (डेबिट)';

  @override
  String get commonCredit => 'जमा (क्रेडिट)';

  @override
  String get commonBalance => 'शेष';

  @override
  String get commonDate => 'तारीख';

  @override
  String get commonNarration => 'विवरण';

  @override
  String get commonActions => 'कार्य';

  @override
  String get commonBack => 'वापस';

  @override
  String get commonApply => 'दिखाएँ';

  @override
  String get commonRemove => 'हटाएँ';

  @override
  String get commonCopy => 'कॉपी करें';

  @override
  String get commonCopied => 'कॉपी हो गया';

  @override
  String get commonDr => 'नामे';

  @override
  String get commonCr => 'जमा';

  @override
  String get commonView => 'देखें';

  @override
  String get commonArchived => 'संग्रहीत';

  @override
  String get commonPrint => 'प्रिंट';

  @override
  String commonListCapped(String count) {
    return 'नवीनतम $count दस्तावेज़ दिखाए जा रहे हैं। पुराने देखने के लिए तारीख़ें चुनें।';
  }

  @override
  String get authLoginTitle => 'अपने व्यवसाय में साइन इन करें';

  @override
  String get authLoginSubtitle => 'फिर से स्वागत है।';

  @override
  String get authSignupTitle => 'वर्चस्व पर अपना व्यवसाय शुरू करें';

  @override
  String get authSignupSubtitle =>
      '₹40 लाख से कम टर्नओवर वाले व्यवसायों के लिए मुफ़्त। कार्ड की ज़रूरत नहीं।';

  @override
  String get authEmail => 'ईमेल';

  @override
  String get authPassword => 'पासवर्ड';

  @override
  String get authPasswordHint => 'कम से कम 8 अक्षर';

  @override
  String get authName => 'आपका नाम';

  @override
  String get authBusinessName => 'व्यवसाय का नाम';

  @override
  String get authState => 'राज्य';

  @override
  String get authGstin => 'जीएसटीआईएन';

  @override
  String get authGstinHint =>
      'अगर आप जीएसटी में पंजीकृत नहीं हैं तो खाली छोड़ें';

  @override
  String get authIndustry => 'व्यवसाय का प्रकार';

  @override
  String get authLogin => 'साइन इन करें';

  @override
  String get authSignup => 'खाता बनाएँ';

  @override
  String get authLogout => 'साइन आउट';

  @override
  String get authNoAccount => 'वर्चस्व पर नए हैं?';

  @override
  String get authHaveAccount => 'पहले से खाता है?';

  @override
  String get authCreateOne => 'खाता बनाएँ';

  @override
  String get authSignInInstead => 'साइन इन करें';

  @override
  String get authErrorsInvalidCredentials => 'ईमेल और पासवर्ड मेल नहीं खाते।';

  @override
  String get authErrorsEmailTaken => 'इस ईमेल से पहले से एक खाता मौजूद है।';

  @override
  String get authErrorsGstinLength => 'जीएसटीआईएन में 15 अक्षर होते हैं।';

  @override
  String get authErrorsGstinFormat => 'यह जीएसटीआईएन जैसा नहीं दिखता।';

  @override
  String get authErrorsGstinState =>
      'जीएसटीआईएन एक अज्ञात राज्य कोड से शुरू होता है।';

  @override
  String get authErrorsGstinChecksum =>
      'इस जीएसटीआईएन में टाइपिंग की गलती है: अंतिम अक्षर मेल नहीं खाता।';

  @override
  String get authErrorsGstinStateMismatch =>
      'यह जीएसटीआईएन चुने गए राज्य का नहीं है।';

  @override
  String get authErrorsValidation => 'कृपया चिह्नित फ़ील्ड जाँचें।';

  @override
  String get authErrorsGeneric => 'कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'यह लिंक समाप्त हो गया है या पहले ही इस्तेमाल हो चुका है। नया लिंक मँगाएँ।';

  @override
  String get authErrorsWrongPassword => 'आपका मौजूदा पासवर्ड गलत है।';

  @override
  String get authErrorsPasswordsDiffer => 'दोनों पासवर्ड मेल नहीं खाते।';

  @override
  String get authErrorsNeedsChangeDate =>
      'आपको दस्तावेज़ पर पिछली तारीख डालने का अधिकार नहीं। आज की तारीख रखें, या मालिक से अधिकार माँगें।';

  @override
  String get authErrorsNeedsFutureDate =>
      'आपको दस्तावेज़ पर आगे की तारीख डालने का अधिकार नहीं। आज की तारीख रखें, या मालिक से अधिकार माँगें।';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'एक पंक्ति का भाव उसकी लागत से कम है। लागत से कम पर बेचने का आपको अधिकार नहीं; भाव बढ़ाएँ या मालिक से पूछें।';

  @override
  String get authForgotLink => 'पासवर्ड भूल गए?';

  @override
  String get authForgotTitle => 'अपना पासवर्ड रीसेट करें';

  @override
  String get authForgotSubtitle =>
      'अपने खाते का ईमेल डालें, हम नया पासवर्ड चुनने के लिए एक लिंक भेजेंगे।';

  @override
  String get authSendLink => 'रीसेट लिंक भेजें';

  @override
  String authForgotSent(String email) {
    return 'अगर $email का खाता है, तो रीसेट लिंक भेजा जा रहा है। यह एक बार काम करता है और एक घंटे में समाप्त हो जाता है।';
  }

  @override
  String get authBackToLogin => 'साइन इन पर वापस जाएँ';

  @override
  String get authResetTitle => 'नया पासवर्ड चुनें';

  @override
  String get authNewPassword => 'नया पासवर्ड';

  @override
  String get authConfirmPassword => 'नया पासवर्ड दोबारा लिखें';

  @override
  String get authSetPassword => 'पासवर्ड सेट करें';

  @override
  String get authResetDone =>
      'आपका पासवर्ड बदल गया है और आप हर जगह से साइन आउट हो गए हैं। नए पासवर्ड से साइन इन करें।';

  @override
  String get shellGoTo => 'यहाँ जाएँ…';

  @override
  String get shellGoToPlaceholder => 'कोई स्क्रीन खोलें या नई एंट्री शुरू करें';

  @override
  String shellNoMatch(String query) {
    return '“$query” से कुछ नहीं मिला।';
  }

  @override
  String get shellTallyKeys =>
      'टैली की कुंजियाँ टेक्स्ट फ़ील्ड के बाहर कहीं भी चलती हैं: F4 कॉन्ट्रा, F5 भुगतान, F6 प्राप्ति, F7 जर्नल, F8 बिक्री, F9 ख़रीद।';

  @override
  String get shellCreate => 'नया';

  @override
  String get shellEntries => 'नई एंट्री';

  @override
  String get shellScreens => 'स्क्रीन';

  @override
  String get shellMenu => 'मेन्यू';

  @override
  String shellFy(String years) {
    return 'वि.व. $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type वाउचर';
  }

  @override
  String get shellFold => 'मेनू छोटा करें';

  @override
  String get shellUnfold => 'मेनू खोलें';

  @override
  String get accountTitle => 'मेरा खाता';

  @override
  String get accountSubtitle =>
      'आपका नाम और पासवर्ड, जो आपके हर व्यवसाय के लिए इस्तेमाल होता है।';

  @override
  String get accountProfile => 'प्रोफ़ाइल';

  @override
  String get accountSave => 'सहेजें';

  @override
  String get accountSaved => 'सहेजा गया';

  @override
  String get accountPasswordTitle => 'पासवर्ड बदलें';

  @override
  String get accountCurrentPassword => 'मौजूदा पासवर्ड';

  @override
  String get accountPasswordChanged =>
      'पासवर्ड बदल गया। आपके दूसरे डिवाइस साइन आउट कर दिए गए हैं।';

  @override
  String get industryApparel => 'परिधान और कपड़ा';

  @override
  String get industryGeneral => 'सामान्य';

  @override
  String get industryTrading => 'ट्रेडिंग / वितरण';

  @override
  String get industryManufacturing => 'निर्माण (मैन्युफैक्चरिंग)';

  @override
  String get industryRetail => 'खुदरा दुकान';

  @override
  String get industryServices => 'सेवाएँ';

  @override
  String get navDashboard => 'डैशबोर्ड';

  @override
  String get navSales => 'बिक्री';

  @override
  String get navPurchase => 'खरीद';

  @override
  String get navInventory => 'स्टॉक';

  @override
  String get navAccounts => 'लेखा';

  @override
  String get navGst => 'जीएसटी';

  @override
  String get navHr => 'एचआर और पेरोल';

  @override
  String get navReports => 'रिपोर्ट';

  @override
  String get navSettings => 'सेटिंग्स';

  @override
  String get navCompany => 'कंपनी और शाखाएँ';

  @override
  String get navNumberSeries => 'नंबर सीरीज़';

  @override
  String get navAuditLog => 'ऑडिट ट्रेल';

  @override
  String get navTools => 'टूल्स';

  @override
  String get navTeam => 'टीम और भूमिकाएँ';

  @override
  String get navChart => 'खातों की सूची';

  @override
  String get navVouchers => 'वाउचर और कूपन';

  @override
  String get navTrialBalance => 'तलपट (ट्रायल बैलेंस)';

  @override
  String get navProfitLoss => 'लाभ-हानि';

  @override
  String get navBalanceSheet => 'तुलन पत्र (बैलेंस शीट)';

  @override
  String get navFinancialYears => 'वित्त वर्ष';

  @override
  String get navItems => 'आइटम';

  @override
  String get navStock => 'स्टॉक सारांश';

  @override
  String get navStockJournals => 'स्टॉक जर्नल';

  @override
  String get navReorder => 'पुनः ऑर्डर';

  @override
  String get navPurchaseOrders => 'खरीद ऑर्डर';

  @override
  String get navGoodsReceipts => 'इनवर्ड चालान';

  @override
  String get navPurchaseBills => 'खरीद बिल';

  @override
  String get navPurchaseReturns => 'खरीद वापसी';

  @override
  String get navSalesOrders => 'बिक्री ऑर्डर';

  @override
  String get navDeliveryNotes => 'डिलीवरी चालान';

  @override
  String get navSalesInvoices => 'बिक्री इनवॉइस';

  @override
  String get navCreditNotes => 'क्रेडिट नोट';

  @override
  String get navReceivables => 'लेनदारी (प्राप्य)';

  @override
  String get navPayables => 'देनदारी (देय)';

  @override
  String get navGstReturns => 'जीएसटी रिटर्न';

  @override
  String get navGstSettings => 'जीएसटी और इनवॉइस';

  @override
  String get navImport => 'डेटा आयात';

  @override
  String get navQuotations => 'कोटेशन';

  @override
  String get navEmployees => 'कर्मचारी';

  @override
  String get navAttendance => 'हाज़िरी';

  @override
  String get navLeave => 'छुट्टी';

  @override
  String get navPayroll => 'वेतन';

  @override
  String get navPayrollSettings => 'वेतन';

  @override
  String get navStatutory => 'वैधानिक और टीडीएस';

  @override
  String get navManufacturing => 'उत्पादन';

  @override
  String get navBoms => 'सामग्री सूची (BOM)';

  @override
  String get navProduction => 'उत्पादन आदेश';

  @override
  String get navMrp => 'सामग्री योजना';

  @override
  String get navJobWork => 'जॉब वर्क';

  @override
  String get navPos => 'पॉइंट ऑफ़ सेल';

  @override
  String get navPosBilling => 'बिलिंग';

  @override
  String get navPosBills => 'बिल';

  @override
  String get navPosSettings => 'काउंटर सेटिंग';

  @override
  String get navBanking => 'बैंकिंग';

  @override
  String get navBankAccounts => 'बैंक मिलान';

  @override
  String get navBankRules => 'बैंक नियम';

  @override
  String get navSettlements => 'गेटवे सेटलमेंट';

  @override
  String get navAssets => 'स्थायी संपत्ति';

  @override
  String get navAssetRegister => 'संपत्ति रजिस्टर';

  @override
  String get navDepreciation => 'मूल्यह्रास';

  @override
  String get navItDepreciation => 'आयकर मूल्यह्रास';

  @override
  String get navExpenses => 'व्यय';

  @override
  String get navExpenseClaims => 'व्यय दावे';

  @override
  String get navExpenseCategories => 'व्यय श्रेणियाँ';

  @override
  String get navProjects => 'परियोजनाएँ';

  @override
  String get navProjectList => 'परियोजनाएँ';

  @override
  String get navTimesheets => 'टाइमशीट';

  @override
  String get navAssistant => 'सहायक';

  @override
  String get navCrm => 'सीआरएम';

  @override
  String get navLeads => 'लीड';

  @override
  String get navFollowUps => 'फ़ॉलो-अप';

  @override
  String get navMessageTemplates => 'संदेश टेम्पलेट';

  @override
  String get navReportBuilder => 'रिपोर्ट बनाएँ';

  @override
  String get navSavedReports => 'सहेजी रिपोर्ट';

  @override
  String get navChecks => 'जाँच';

  @override
  String get navStyles => 'स्टाइल';

  @override
  String get navProformas => 'प्रोफ़ॉर्मा इनवॉइस';

  @override
  String get navApprovals => 'अप्रूवल पर माल';

  @override
  String get navPriceLists => 'मूल्य सूची';

  @override
  String get navInterest => 'बकाया पर ब्याज';

  @override
  String get navAgents => 'एजेंट कमीशन';

  @override
  String get navTargets => 'सेल्समैन लक्ष्य';

  @override
  String get navSchemes => 'स्कीम और ऑफ़र';

  @override
  String get navPosReturns => 'वापसी और बदलाव';

  @override
  String get navAlterations => 'ऑल्टरेशन';

  @override
  String get navTailoring => 'सिलाई';

  @override
  String get navConsignment => 'कंसाइनमेंट';

  @override
  String get navCatalogue => 'इमेज कैटलॉग';

  @override
  String get navInsights => 'बिज़नेस इनसाइट्स';

  @override
  String get navSalesRegister => 'बिक्री रजिस्टर';

  @override
  String get navColourSize => 'रंग-साइज़ रिपोर्ट';

  @override
  String get navStockAgeing => 'स्टॉक की उम्र';

  @override
  String get navLabels => 'बारकोड लेबल';

  @override
  String get navMessageLog => 'व्हाट्सऐप लॉग';

  @override
  String get navMyMenu => 'मेरा मेनू';

  @override
  String get navAllActions => 'सभी काम';

  @override
  String get navStockCounts => 'स्टॉक गिनती';

  @override
  String get navWorkspace => 'कार्यक्षेत्र';

  @override
  String get navSalesPos => 'बिक्री और काउंटर';

  @override
  String get navPromotions => 'ऑफ़र और दाम';

  @override
  String get navFinance => 'खाते और बैंकिंग';

  @override
  String get navOperations => 'खर्च, प्रोजेक्ट और संपत्ति';

  @override
  String get navMasters => 'मास्टर';

  @override
  String get navReportsHub => 'सभी रिपोर्ट';

  @override
  String get navMastersHub => 'सभी मास्टर';

  @override
  String get navSizesColours => 'साइज़ और रंग';

  @override
  String get navBandWorkspace => 'कार्यक्षेत्र';

  @override
  String get navBandCommerce => 'बिक्री';

  @override
  String get navBandSupply => 'खरीद और स्टॉक';

  @override
  String get navBandProduction => 'उत्पादन और संचालन';

  @override
  String get navBandMoney => 'पैसा और लोग';

  @override
  String get navBandInsight => 'रिपोर्ट';

  @override
  String get navBandAdmin => 'सेटअप';

  @override
  String get navIntegrity => 'अखंडता जाँच';

  @override
  String get navCfoView => 'मालिक का नज़रिया';

  @override
  String get navStockMovement => 'तेज़ और धीमे बिकने वाला माल';

  @override
  String dashboardGreeting(String name) {
    return 'नमस्ते, $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return 'आज $business की स्थिति।';
  }

  @override
  String get dashboardSetupTitle => 'सेटअप पूरा करें';

  @override
  String get dashboardSetupCompany => 'कंपनी का विवरण और पैन जोड़ें';

  @override
  String get dashboardSetupBranch => 'हर शाखा का जीएसटीआईएन जोड़ें';

  @override
  String get dashboardSetupSeries => 'इनवॉइस नंबर सीरीज़ जाँचें';

  @override
  String get dashboardRoadmapTitle => 'आगे क्या आ रहा है';

  @override
  String get dashboardCalcTitle => 'झटपट जीएसटी कैलकुलेटर';

  @override
  String get dashboardCalcSubtitle =>
      'आपूर्ति के स्थान से सीजीएसटी/एसजीएसटी या आईजीएसटी निकालता है।';

  @override
  String get dashboardKSalesToday => 'आज की बिक्री';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'कल $amount';
  }

  @override
  String get dashboardKSalesMonth => 'इस महीने की बिक्री';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'पिछले महीने इन्हीं दिनों $amount';
  }

  @override
  String get dashboardKReceivables => 'लेना है';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount बकाया';
  }

  @override
  String get dashboardKPayables => 'देना है';

  @override
  String dashboardKDueSoon(String amount) {
    return '7 दिन में $amount देय';
  }

  @override
  String get dashboardKProfit => 'इस महीने का लाभ';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'सकल लाभ $amount';
  }

  @override
  String get dashboardKStockValue => 'स्टॉक का मूल्य';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count आइटम',
      one: '$count आइटम',
    );
    return '$_temp0 पुनः ऑर्डर स्तर से नीचे';
  }

  @override
  String get dashboardKPipeline => 'बिक्री पाइपलाइन';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$count खुली लीड · भारित $amount';
  }

  @override
  String get dashboardKApprovals => 'आपकी प्रतीक्षा में';

  @override
  String get dashboardKClaims => 'व्यय दावे';

  @override
  String get dashboardKTimesheets => 'टाइमशीट';

  @override
  String get dashboardKLeave => 'अवकाश अनुरोध';

  @override
  String get dashboardKNothingWaiting => 'कुछ प्रतीक्षा में नहीं।';

  @override
  String get dashboardKSalesTrend => 'पिछले 30 दिन की बिक्री';

  @override
  String get dashboardKCashBank => 'नकद और बैंक';

  @override
  String get dashboardKTopCustomers => 'इस महीने के शीर्ष ग्राहक';

  @override
  String get dashboardKTopItems => 'इस महीने सबसे ज़्यादा बिके';

  @override
  String get dashboardKTopDebtors => 'सबसे बड़ी वसूली';

  @override
  String get dashboardKAlerts => 'ध्यान दें';

  @override
  String get dashboardKNoAlerts => 'सब ठीक है।';

  @override
  String get dashboardKAsk => 'सहायक से पूछें';

  @override
  String dashboardKYesterday(String amount) {
    return 'कल $amount';
  }

  @override
  String get dashboardPosition => 'पैसे की स्थिति';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count खाते',
      one: '$count खाता',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'बिज़नेस इनसाइट्स';

  @override
  String get insightsSubtitle =>
      'किसी भी अवधि की बिक्री, मुनाफ़ा, स्टॉक और पैसा, पिछले साल की उसी अवधि से तुलना।';

  @override
  String get insightsNoLastYear => 'इस साल नया';

  @override
  String get insightsPts => 'अंक';

  @override
  String get insightsVsLastYear => 'पिछले साल से';

  @override
  String get insightsNoSales => 'इस अवधि में कोई बिक्री नहीं।';

  @override
  String get insightsHideTable => 'तालिका छिपाएँ';

  @override
  String get insightsShowTable => 'तालिका में देखें';

  @override
  String get insightsPresetsThisMonth => 'इस महीने';

  @override
  String get insightsPresetsLastMonth => 'पिछला महीना';

  @override
  String get insightsPresetsThisFy => 'इस वित्त वर्ष';

  @override
  String get insightsPresetsLastFy => 'पिछला वित्त वर्ष';

  @override
  String get insightsPresetsLast12 => 'पिछले 12 महीने';

  @override
  String get insightsFrom => 'से';

  @override
  String get insightsTo => 'तक';

  @override
  String get insightsApply => 'दिखाएँ';

  @override
  String insightsCompared(String from, String to) {
    return 'बदलाव $from से $to की तुलना में हैं।';
  }

  @override
  String get insightsKpiSales => 'बिक्री';

  @override
  String get insightsKpiPieces => 'बिके पीस';

  @override
  String get insightsKpiAvgBill => 'औसत बिल';

  @override
  String get insightsKpiProfit => 'मार्जिन';

  @override
  String get insightsKpiPurchases => 'ख़रीद';

  @override
  String get insightsKpiStock => 'अभी स्टॉक';

  @override
  String get insightsKpiReceivable => 'वसूलना है';

  @override
  String get insightsKpiPayable => 'चुकाना है';

  @override
  String get insightsBeforeTax => 'GST से पहले, वापसी घटाकर';

  @override
  String insightsBillsCount(String n) {
    return 'बिल: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return '$v प्रति पीस';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n पीस';
  }

  @override
  String get insightsOwedToUs => 'ग्राहकों से';

  @override
  String get insightsWeOwe => 'सप्लायरों को';

  @override
  String get insightsTrend => 'बिक्री का रुझान';

  @override
  String get insightsByMonth => 'महीनेवार, GST से पहले';

  @override
  String get insightsByDay => 'दिनवार, GST से पहले';

  @override
  String get insightsWeekday => 'व्यस्त दिन';

  @override
  String get insightsWeekdaySub => 'हफ़्ते के दिन के हिसाब से बिक्री';

  @override
  String get insightsDaysD1 => 'सोम';

  @override
  String get insightsDaysD2 => 'मंगल';

  @override
  String get insightsDaysD3 => 'बुध';

  @override
  String get insightsDaysD4 => 'गुरु';

  @override
  String get insightsDaysD5 => 'शुक्र';

  @override
  String get insightsDaysD6 => 'शनि';

  @override
  String get insightsDaysD7 => 'रवि';

  @override
  String get insightsDesigns => 'सबसे अच्छे डिज़ाइन';

  @override
  String get insightsByValue => 'बिक्री मूल्य से';

  @override
  String get insightsSalesmen => 'सबसे अच्छे सेल्समैन';

  @override
  String get insightsSalesmenSub => 'काउंटर लाइनें और इनवॉइस जो उन्होंने बेचे';

  @override
  String get insightsNoSalesmen => 'अभी किसी बिक्री पर सेल्समैन नहीं।';

  @override
  String get insightsCustomers => 'बड़े ग्राहक';

  @override
  String get insightsCustomersSub => 'इनवॉइस वाले ग्राहक, वापसी घटाकर';

  @override
  String get insightsBrands => 'ब्रांड';

  @override
  String get insightsTenders => 'ग्राहकों ने कैसे भुगतान किया';

  @override
  String get insightsTendersSub => 'GST सहित: काउंटर भुगतान और उधार इनवॉइस';

  @override
  String get insightsModesCash => 'नकद';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'कार्ड';

  @override
  String get insightsModesCredit => 'काउंटर उधार';

  @override
  String get insightsModesInvoice => 'इनवॉइस';

  @override
  String get insightsAgeing => 'बिक्री की उम्र';

  @override
  String get insightsAgeingSub => 'बिकने से पहले माल कितने समय रहा';

  @override
  String get insightsAge => 'उम्र';

  @override
  String get insightsPieces => 'पीस';

  @override
  String get insightsValue => 'मूल्य';

  @override
  String get insightsAgesD030 => '0 से 30 दिन';

  @override
  String get insightsAgesD3160 => '31 से 60 दिन';

  @override
  String get insightsAgesD6190 => '61 से 90 दिन';

  @override
  String get insightsAgesD91180 => '91 से 180 दिन';

  @override
  String get insightsAgesD181365 => '6 से 12 महीने';

  @override
  String get insightsAgesY12 => '1 से 2 साल';

  @override
  String get insightsAgesY2plus => '2 साल से ज़्यादा';

  @override
  String get insightsErrorsInvalidPeriod => 'शुरुआत की तारीख़ अंत के बाद है।';

  @override
  String insightsOnCost(String v) {
    return 'मानक लागत से $v ज़्यादा';
  }

  @override
  String get calcFrom => 'आपूर्तिकर्ता का राज्य';

  @override
  String get calcTo => 'आपूर्ति का स्थान';

  @override
  String get calcQty => 'मात्रा';

  @override
  String get calcRate => 'दर (₹)';

  @override
  String get calcGstRate => 'जीएसटी %';

  @override
  String get calcTaxable => 'कर योग्य मूल्य';

  @override
  String get calcCgst => 'सीजीएसटी';

  @override
  String get calcSgst => 'एसजीएसटी';

  @override
  String get calcUtgst => 'यूटीजीएसटी';

  @override
  String get calcIgst => 'आईजीएसटी';

  @override
  String get calcRoundOff => 'राउंड ऑफ़';

  @override
  String get calcTotal => 'कुल';

  @override
  String get calcInWords => 'शब्दों में';

  @override
  String get calcCess => 'सेस';

  @override
  String get companyTitle => 'कंपनी और शाखाएँ';

  @override
  String get companySubtitle =>
      'कानूनी विवरण, और हर जीएसटीआईएन या स्थान के लिए एक शाखा।';

  @override
  String get companyName => 'दिखाने वाला नाम';

  @override
  String get companyLegalName => 'कानूनी नाम';

  @override
  String get companyPan => 'पैन';

  @override
  String get companyBooksBegin => 'खाते शुरू होने की तारीख';

  @override
  String get companyBranches => 'शाखाएँ';

  @override
  String get companyAddBranch => 'शाखा जोड़ें';

  @override
  String get companyBranchName => 'शाखा का नाम';

  @override
  String get companyHeadOffice => 'मुख्य कार्यालय';

  @override
  String get companyUnregistered => 'पंजीकृत नहीं';

  @override
  String get companyCity => 'शहर';

  @override
  String get companyPincode => 'पिन कोड';

  @override
  String get seriesTitle => 'नंबर सीरीज़';

  @override
  String get seriesSubtitle =>
      'इनवॉइस और वाउचर के नंबर कैसे बनते हैं। जीएसटी में अधिकतम 16 अक्षर: अक्षर, अंक, - और /।';

  @override
  String get seriesDocType => 'दस्तावेज़';

  @override
  String get seriesPattern => 'पैटर्न';

  @override
  String get seriesNext => 'अगला नंबर';

  @override
  String get seriesFy => 'वित्त वर्ष';

  @override
  String get seriesTokens =>
      'टोकन: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = डिवाइस कोड (ऑफ़लाइन ऐप)';

  @override
  String get seriesTypesSalesInvoice => 'बिक्री इनवॉइस';

  @override
  String get seriesTypesCreditNote => 'क्रेडिट नोट';

  @override
  String get seriesTypesDebitNote => 'डेबिट नोट';

  @override
  String get seriesTypesPurchaseBill => 'खरीद बिल';

  @override
  String get seriesTypesReceipt => 'रसीद';

  @override
  String get seriesTypesPayment => 'भुगतान';

  @override
  String get seriesTypesJournal => 'जर्नल वाउचर';

  @override
  String get seriesErrorsSeriesTooLong =>
      'इस पैटर्न के नंबर 16 अक्षरों से लंबे हो जाएँगे।';

  @override
  String get seriesErrorsSeriesBadChars =>
      'केवल अक्षर, अंक, - और / की अनुमति है।';

  @override
  String get seriesErrorsSeriesEmpty => 'पैटर्न में SEQ टोकन होना ज़रूरी है।';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'अगला नंबर पहले जारी नंबरों से कम नहीं हो सकता।';

  @override
  String get auditTitle => 'ऑडिट ट्रेल';

  @override
  String get auditSubtitle =>
      'हर बदलाव, किसने किया और कब। प्रविष्टियाँ बदली या हटाई नहीं जा सकतीं।';

  @override
  String get auditWhen => 'कब';

  @override
  String get auditWho => 'किसने';

  @override
  String get auditWhat => 'क्या';

  @override
  String get auditDetails => 'विवरण';

  @override
  String get auditLoadMore => 'पुरानी प्रविष्टियाँ देखें';

  @override
  String get auditActionsCreate => 'बनाया';

  @override
  String get auditActionsUpdate => 'बदला';

  @override
  String get auditActionsLogin => 'साइन इन किया';

  @override
  String get auditActionsDelete => 'हटाया';

  @override
  String get auditActionsCancel => 'रद्द किया';

  @override
  String get auditVerify => 'ऑडिट ट्रेल जाँचें';

  @override
  String get auditVerifying => 'जाँच हो रही है...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'सभी $n प्रविष्टियाँ सुरक्षित हैं। कुछ बदला या हटाया नहीं गया।',
      one: 'सभी $n प्रविष्टि सुरक्षित है। कुछ बदला या हटाया नहीं गया।',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'प्रविष्टि संख्या $seq पिछली प्रविष्टियों से मेल नहीं खाती ($reason)। ऑडिट ट्रेल बदला या खराब हुआ है। एक प्रति रखें और सहायता से संपर्क करें।';
  }

  @override
  String get auditReasonGap => 'एक प्रविष्टि गायब है';

  @override
  String get auditReasonLink => 'क्रम टूटा हुआ है';

  @override
  String get auditReasonContent => 'प्रविष्टि बदली गई है';

  @override
  String get auditVerifyFailed => 'जाँच नहीं हो सकी। फिर कोशिश करें।';

  @override
  String get backupTitle => 'बैकअप और एक्सपोर्ट';

  @override
  String get backupSubtitle =>
      'आपका डेटा आपका है। जब चाहें पूरा डाउनलोड करें, ऐसी फ़ाइलों में जो Varchasv के बिना भी खुलती हैं।';

  @override
  String get backupDownload => 'सब कुछ डाउनलोड करें (ZIP)';

  @override
  String get backupWhat => 'आपको क्या मिलता है';

  @override
  String get backupItem1 =>
      'हर तालिका Excel के लिए CSV फ़ाइल में और सटीक मानों वाली JSON फ़ाइल में।';

  @override
  String get backupItem2 => 'आपके अपलोड किए हर दस्तावेज़ जैसे के तैसे।';

  @override
  String get backupItem3 =>
      'हर तालिका समझाने वाली README, और चेकसम की सूची ताकि आप बाद में दिखा सकें कि कुछ नहीं बदला।';

  @override
  String get backupLeftOut =>
      'पासवर्ड, लॉगिन टोकन और कर-पोर्टल सत्र शामिल नहीं हैं।';

  @override
  String get backupKeep =>
      'फ़ाइल को सुरक्षित जगह रखें। इसमें आपके ग्राहक, आपूर्तिकर्ता, कीमतें और बही-खाते हैं।';

  @override
  String get backupSlow =>
      'बड़े कारोबार में तैयार होने में एक मिनट लग सकता है।';

  @override
  String get backupAuditLink => 'जाँचें कि आपका ऑडिट ट्रेल अछूता है';

  @override
  String get roadmapAccounts => 'लेखा और जीएसटी रिटर्न';

  @override
  String get roadmapInventory => 'स्टॉक और खरीद';

  @override
  String get roadmapSales => 'बिक्री, ई-इनवॉइस और ई-वे बिल';

  @override
  String get roadmapOffline =>
      'विंडोज़, मैक, लिनक्स, एंड्रॉइड और आईओएस के लिए ऑफ़लाइन ऐप';

  @override
  String get roadmapPayroll => 'एचआर और पेरोल';

  @override
  String get switcherTitle => 'आपके व्यवसाय';

  @override
  String get switcherAddBusiness => 'व्यवसाय जोड़ें';

  @override
  String get switcherCreate => 'व्यवसाय बनाएँ';

  @override
  String get teamTitle => 'टीम और भूमिकाएँ';

  @override
  String get teamSubtitle =>
      'इस व्यवसाय का उपयोग कौन कर सकता है और हर व्यक्ति क्या कर सकता है।';

  @override
  String get teamMembers => 'सदस्य';

  @override
  String get teamInvite => 'आमंत्रित करें';

  @override
  String get teamInviteTitle => 'किसी को आमंत्रित करें';

  @override
  String get teamEmail => 'ईमेल';

  @override
  String get teamRole => 'भूमिका';

  @override
  String get teamStatus => 'स्थिति';

  @override
  String get teamActive => 'सक्रिय';

  @override
  String get teamSuspended => 'निलंबित';

  @override
  String get teamYou => 'आप';

  @override
  String get teamPendingInvites => 'लंबित आमंत्रण';

  @override
  String get teamExpires => 'समाप्ति';

  @override
  String get teamRevoke => 'वापस लें';

  @override
  String get teamSuspend => 'निलंबित करें';

  @override
  String get teamReactivate => 'फिर से सक्रिय करें';

  @override
  String get teamRemove => 'हटाएँ';

  @override
  String get teamInviteLink => 'आमंत्रण लिंक';

  @override
  String get teamInviteLinkHint =>
      'हमने इसे ईमेल कर दिया है। आप इसे व्हाट्सऐप पर भी भेज सकते हैं: यह एक बार चलता है और 7 दिन में समाप्त हो जाता है।';

  @override
  String get teamRoles => 'भूमिकाएँ';

  @override
  String get teamNewRole => 'नई भूमिका';

  @override
  String get teamRoleName => 'भूमिका का नाम';

  @override
  String get teamPermissions => 'अनुमतियाँ';

  @override
  String get teamSystemRole => 'बिल्ट-इन';

  @override
  String teamMembersCount(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count सदस्य',
      one: '$count सदस्य',
    );
    return '$_temp0';
  }

  @override
  String get teamModulesCompany => 'कंपनी';

  @override
  String get teamModulesUsers => 'टीम';

  @override
  String get teamModulesAccounts => 'लेखा';

  @override
  String get teamModulesSales => 'बिक्री';

  @override
  String get teamModulesPurchase => 'खरीद';

  @override
  String get teamModulesInventory => 'स्टॉक';

  @override
  String get teamModulesGst => 'जीएसटी';

  @override
  String get teamModulesHr => 'एचआर';

  @override
  String get teamModulesPayroll => 'पेरोल';

  @override
  String get teamModulesReports => 'रिपोर्ट';

  @override
  String get teamModulesSettings => 'सेटिंग्स';

  @override
  String get teamModulesBanking => 'बैंकिंग';

  @override
  String get teamModulesAssets => 'स्थायी संपत्ति';

  @override
  String get teamModulesExpenses => 'व्यय';

  @override
  String get teamModulesProjects => 'परियोजनाएँ';

  @override
  String get teamModulesCrm => 'सीआरएम';

  @override
  String get teamPermView => 'देखें';

  @override
  String get teamPermCreate => 'बनाएँ';

  @override
  String get teamPermEdit => 'बदलें';

  @override
  String get teamPermSubmit => 'जमा करें';

  @override
  String get teamPermCancel => 'रद्द करें';

  @override
  String get teamPermDelete => 'हटाएँ';

  @override
  String get teamPermExport => 'निर्यात';

  @override
  String get teamPermApprove => 'स्वीकृत करें';

  @override
  String get teamErrorsCannotChangeSelf =>
      'आप अपनी खुद की पहुँच नहीं बदल सकते।';

  @override
  String get teamErrorsLastOwner =>
      'व्यवसाय में कम से कम एक सक्रिय मालिक होना चाहिए।';

  @override
  String get teamErrorsOwnerOnly => 'यह केवल मालिक कर सकता है।';

  @override
  String get teamErrorsAlreadyMember => 'यह व्यक्ति पहले से सदस्य है।';

  @override
  String get teamErrorsPermissionEscalation =>
      'आप वह अनुमति नहीं दे सकते जो आपके पास नहीं है।';

  @override
  String get teamErrorsSystemRole => 'बिल्ट-इन भूमिकाएँ बदली नहीं जा सकतीं।';

  @override
  String get teamErrorsRoleInUse =>
      'हटाने से पहले सदस्यों को दूसरी भूमिका में डालें।';

  @override
  String get teamErrorsUnknownRole => 'यह भूमिका अब मौजूद नहीं है।';

  @override
  String get teamSpecialTitle => 'विशेष अधिकार';

  @override
  String get teamSpecialHelp =>
      'ऊपर की तालिका से अलग एक-एक अधिकार। कोई बिल बना सकता है पर पिछली तारीख डालना या लागत से कम पर बेचना उसके हाथ में नहीं।';

  @override
  String get teamSpecialChangeDate => 'दस्तावेज़ों पर पिछली तारीख डालना';

  @override
  String get teamSpecialFutureDate => 'दस्तावेज़ों पर आगे की तारीख डालना';

  @override
  String get teamSpecialSellBelowCost => 'लागत से कम पर बेचना';

  @override
  String get teamSpecialSeeAgentCommission => 'एजेंट कमीशन देखना';

  @override
  String get teamSpecialImportData => 'डेटा आयात करना';

  @override
  String inviteTitle(String business) {
    return '$business से जुड़ें';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$email को $role के रूप में आमंत्रित किया गया है।';
  }

  @override
  String get inviteCreateAccount => 'स्वीकार करने के लिए अपना खाता बनाएँ।';

  @override
  String get inviteSignInToAccept =>
      'स्वीकार करने के लिए अपना वर्चस्व पासवर्ड डालें।';

  @override
  String get inviteAccept => 'आमंत्रण स्वीकार करें';

  @override
  String get inviteInvalid =>
      'यह आमंत्रण लिंक अमान्य है, पहले इस्तेमाल हो चुका है या समाप्त हो गया है। नया लिंक माँगें।';

  @override
  String get accountsTitle => 'खातों की सूची';

  @override
  String get accountsSubtitle =>
      'खाते उसी तरह समूहों में जैसे आपके अकाउंटेंट उम्मीद करते हैं। ग्राहक विविध देनदार में, आपूर्तिकर्ता विविध लेनदार में।';

  @override
  String get accountsNewAccount => 'नया खाता';

  @override
  String get accountsName => 'खाते का नाम';

  @override
  String get accountsNameHi => 'हिंदी में नाम';

  @override
  String get accountsGroup => 'समूह';

  @override
  String get accountsBalance => 'शेष';

  @override
  String get accountsOpeningBalance => 'प्रारंभिक शेष';

  @override
  String get accountsOpeningHint =>
      'नामे के लिए धनात्मक (नकद, बैंक, देनदार); जमा के लिए ऋणात्मक (पूँजी, ऋण, लेनदार)।';

  @override
  String get accountsCode => 'कोड';

  @override
  String get accountsParty => 'पार्टी का विवरण';

  @override
  String get accountsPhone => 'फ़ोन';

  @override
  String get accountsIfsc => 'आईएफ़एससी';

  @override
  String get accountsAccountNumber => 'खाता संख्या';

  @override
  String get accountsAllGroups => 'सभी समूह';

  @override
  String get accountsEmpty => 'कोई खाता नहीं मिला।';

  @override
  String get accountsErrorsAccountNameTaken =>
      'इस नाम का खाता पहले से मौजूद है।';

  @override
  String get accountsErrorsUnknownGroup => 'समूह चुनें।';

  @override
  String get accountsErrorsInvalidIfsc => 'आईएफ़एससी HDFC0001234 जैसा होता है।';

  @override
  String get accountsErrorsInvalidPan => 'पैन ABCDE1234F जैसा होता है।';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'बिल्ट-इन खाते अपने समूह में ही रहते हैं।';

  @override
  String get accountsErrorsNotAnAgent => 'दलाल या एजेंट चिह्नित खाता चुनें।';

  @override
  String get accountsErrorsUnknownSalesman =>
      'अपने कर्मचारियों में से सेल्समैन चुनें।';

  @override
  String get accountsCreditLimit => 'क्रेडिट सीमा (₹)';

  @override
  String get accountsCreditDays => 'क्रेडिट दिन';

  @override
  String get accountsCreditControl => 'सीमा से अधिक या बकाया होने पर';

  @override
  String get accountsCreditControlHint =>
      'ब्लॉक करने पर नई बिक्री तब तक रुकती है जब तक मालिक या एडमिन अनुमति न दे।';

  @override
  String get accountsCreditWarn => 'चेतावनी देकर अनुमति';

  @override
  String get accountsCreditBlock => 'ब्लॉक';

  @override
  String get accountsBlockOverdueDays => 'अनुमत बकाया दिन';

  @override
  String get accountsInterestRate => 'बकाया पर ब्याज (% वार्षिक)';

  @override
  String get vouchersTitle => 'वाउचर';

  @override
  String get vouchersSubtitle =>
      'आपके खातों की हर प्रविष्टि। पोस्ट किए गए वाउचर बदले नहीं जाते: रद्द करके दोबारा दर्ज करें।';

  @override
  String get vouchersNew => 'नया वाउचर';

  @override
  String get vouchersTypesJournal => 'जर्नल';

  @override
  String get vouchersTypesPayment => 'भुगतान';

  @override
  String get vouchersTypesReceipt => 'रसीद';

  @override
  String get vouchersTypesContra => 'कॉन्ट्रा';

  @override
  String get vouchersTypesPurchase => 'खरीद';

  @override
  String get vouchersTypesDebitNote => 'डेबिट नोट';

  @override
  String get vouchersTypesSales => 'बिक्री';

  @override
  String get vouchersTypesCreditNote => 'क्रेडिट नोट';

  @override
  String get vouchersTypesGatewaySettlement => 'गेटवे सेटलमेंट';

  @override
  String get vouchersTypesAssetPurchase => 'संपत्ति ख़रीद';

  @override
  String get vouchersTypesDepreciation => 'मूल्यह्रास';

  @override
  String get vouchersTypesAssetDisposal => 'संपत्ति बिक्री';

  @override
  String get vouchersTypesExpenseClaim => 'व्यय दावा';

  @override
  String get vouchersTypesBrokerage => 'दलाली बिल';

  @override
  String get vouchersTypeHintsJournal =>
      'समायोजन, उधार बिक्री और खरीद, प्रावधान।';

  @override
  String get vouchersTypeHintsPayment => 'नकद या बैंक से जाने वाला पैसा।';

  @override
  String get vouchersTypeHintsReceipt => 'नकद या बैंक में आने वाला पैसा।';

  @override
  String get vouchersTypeHintsContra => 'केवल नकद और बैंक खातों के बीच।';

  @override
  String get vouchersNumber => 'नंबर';

  @override
  String get vouchersReference => 'संदर्भ';

  @override
  String get vouchersAccount => 'खाता';

  @override
  String get vouchersAccounts => 'खाते';

  @override
  String get vouchersAmount => 'राशि';

  @override
  String get vouchersAddLine => 'पंक्ति जोड़ें';

  @override
  String get vouchersDifference => 'अंतर';

  @override
  String get vouchersPost => 'वाउचर पोस्ट करें';

  @override
  String get vouchersCancel => 'वाउचर रद्द करें';

  @override
  String get vouchersCancelReason => 'रद्द करने का कारण';

  @override
  String get vouchersCancelled => 'रद्द';

  @override
  String get vouchersPosted => 'पोस्ट किया गया';

  @override
  String get vouchersStatus => 'स्थिति';

  @override
  String get vouchersEmpty => 'इस अवधि में कोई वाउचर नहीं।';

  @override
  String get vouchersChooseAccount => 'खाता चुनें…';

  @override
  String get vouchersErrorsUnbalanced => 'नामे और जमा बराबर होने चाहिए।';

  @override
  String get vouchersErrorsTooFewLines =>
      'वाउचर में कम से कम दो पंक्तियाँ चाहिए।';

  @override
  String get vouchersErrorsZeroLine => 'हर पंक्ति में राशि होनी चाहिए।';

  @override
  String get vouchersErrorsBothSides =>
      'एक पंक्ति नामे या जमा हो सकती है, दोनों नहीं।';

  @override
  String get vouchersErrorsNegativeAmount => 'राशि ऋणात्मक नहीं हो सकती।';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'भुगतान में किसी नकद या बैंक खाते को जमा करना ज़रूरी है।';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'रसीद में किसी नकद या बैंक खाते को नामे करना ज़रूरी है।';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'कॉन्ट्रा वाउचर में केवल नकद और बैंक खाते हो सकते हैं।';

  @override
  String get vouchersErrorsPeriodLocked => 'यह तारीख लॉक की गई अवधि में है।';

  @override
  String get vouchersErrorsPeriodClosed => 'यह वित्त वर्ष बंद हो चुका है।';

  @override
  String get vouchersErrorsBeforeBooksBegin =>
      'यह तारीख आपके खाते शुरू होने से पहले की है।';

  @override
  String get vouchersErrorsAlreadyCancelled => 'यह वाउचर पहले ही रद्द है।';

  @override
  String get vouchersErrorsUnknownAccount => 'एक खाता अब मौजूद नहीं है।';

  @override
  String get vouchersErrorsAccountArchived => 'एक खाता संग्रहीत है।';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account शून्य से नीचे चला जाएगा: $amount। आप फिर भी पोस्ट कर सकते हैं।';
  }

  @override
  String get promosTitle => 'वाउचर और कूपन';

  @override
  String get promosSubtitle =>
      'काउंटर के लिए गिफ्ट वाउचर, कूपन कोड, डिस्काउंट कार्ड और लकी ड्रॉ।';

  @override
  String get promosStatusesActive => 'चालू';

  @override
  String get promosStatusesUsed => 'पूरा इस्तेमाल';

  @override
  String get promosStatusesExpired => 'समाप्त';

  @override
  String get promosGiftTitle => 'गिफ्ट वाउचर';

  @override
  String promosGiftHint(String amount) {
    return 'चालू वाउचर पर अभी $amount देय है। GST वाउचर बेचते समय नहीं, उससे सामान खरीदते समय लगता है।';
  }

  @override
  String get promosGiftCode => 'कोड';

  @override
  String get promosGiftFor => 'किसके लिए';

  @override
  String get promosGiftValue => 'मूल्य (₹)';

  @override
  String get promosGiftBalance => 'बाकी';

  @override
  String get promosGiftExpires => 'समाप्ति तिथि';

  @override
  String get promosGiftEmpty => 'अभी कोई गिफ्ट वाउचर नहीं बेचा।';

  @override
  String get promosGiftCount => 'कितने';

  @override
  String get promosGiftPaidBy => 'भुगतान का तरीका';

  @override
  String get promosGiftSell => 'वाउचर बेचें';

  @override
  String get promosGiftIssued => 'बिक गए। कोड:';

  @override
  String get promosGiftExpire => 'समाप्त वाउचर की रकम वापस लिखें';

  @override
  String get promosGiftExpireHint =>
      'तारीख निकल चुके वाउचर की बची रकम आय बन जाती है।';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$n वाउचर समाप्त, $amount वापस लिखा गया।';
  }

  @override
  String get promosCouponsTitle => 'कूपन कोड';

  @override
  String get promosCouponsNew => 'नया कूपन';

  @override
  String get promosCouponsCode => 'कोड';

  @override
  String get promosCouponsOff => 'छूट';

  @override
  String get promosCouponsValid => 'मान्य';

  @override
  String get promosCouponsUsed => 'उपयोग';

  @override
  String get promosCouponsEmpty => 'अभी कोई कूपन नहीं।';

  @override
  String promosCouponsUpTo(String amount) {
    return '$amount तक';
  }

  @override
  String get promosCouponsMaxDiscount => 'अधिकतम छूट (₹)';

  @override
  String get promosCouponsMinBill => 'न्यूनतम बिल (₹)';

  @override
  String get promosCouponsMaxUses => 'कितनी बार';

  @override
  String get promosCouponsMaxUsesHint => 'खाली = कोई सीमा नहीं';

  @override
  String get promosCardsTitle => 'डिस्काउंट कार्ड';

  @override
  String get promosCardsNew => 'नया कार्ड';

  @override
  String get promosCardsNumber => 'कार्ड नंबर';

  @override
  String get promosCardsHolder => 'धारक';

  @override
  String get promosCardsValidUntil => 'कब तक मान्य';

  @override
  String get promosCardsEmpty => 'अभी कोई डिस्काउंट कार्ड नहीं।';

  @override
  String get promosDrawTitle => 'लकी ड्रॉ';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from से $to · $entries प्रविष्टियाँ';
  }

  @override
  String get promosDrawEmpty => 'अभी कोई ड्रॉ नहीं।';

  @override
  String get promosDrawWinners => 'विजेता';

  @override
  String get promosDrawHint =>
      'इस अवधि में ग्राहक मोबाइल वाला हर बिल एक प्रविष्टि है; हर मोबाइल एक बार ही जीत सकता है।';

  @override
  String get promosDrawRun => 'विजेता चुनें';

  @override
  String get promosStatus => 'स्थिति';

  @override
  String get promosErrorsInvalidAmount => 'रुपये में रकम डालें।';

  @override
  String get promosErrorsInvalidPercent => '0 से 100 के बीच प्रतिशत डालें।';

  @override
  String get promosErrorsCodeTaken => 'यह कोड पहले से इस्तेमाल में है।';

  @override
  String get promosErrorsExpiryBeforeIssue =>
      'समाप्ति तिथि आज के बाद की होनी चाहिए।';

  @override
  String get promosErrorsEndsBeforeStart =>
      'अंतिम तारीख शुरुआती तारीख से पहले है।';

  @override
  String get promosErrorsNoEntries =>
      'उस अवधि में ग्राहक मोबाइल वाला कोई बिल नहीं।';

  @override
  String get promosErrorsInvalidCode => 'केवल अक्षर, अंक और हाइफ़न।';

  @override
  String get promosErrorsInvalidPhone => '10 अंकों का मोबाइल नंबर डालें।';

  @override
  String get posReturnsTitle => 'वापसी और बदलाव';

  @override
  String get posReturnsSubtitle =>
      'बिल के सामने सामान वापस लें। साइज़ या रंग बदलने के लिए स्टोर क्रेडिट दें और उससे नया पीस बिल करें।';

  @override
  String get posReturnsReturn => 'वापसी';

  @override
  String posReturnsSaved(String number) {
    return 'वापसी $number सहेजी गई';
  }

  @override
  String get posReturnsCreditCode => 'स्टोर क्रेडिट कोड:';

  @override
  String get posReturnsExchangeNow => 'अभी बदलाव का बिल बनाएँ';

  @override
  String posReturnsRefunded(String mode) {
    return '$mode से लौटाया गया।';
  }

  @override
  String posReturnsAgainst(String number) {
    return '$number के सामने वापसी';
  }

  @override
  String get posReturnsCanReturn => 'वापस हो सकता';

  @override
  String get posReturnsQty => 'वापस मात्रा';

  @override
  String get posReturnsReason => 'कारण';

  @override
  String get posReturnsCondition => 'हालत';

  @override
  String get posReturnsCounter => 'काउंटर';

  @override
  String get posReturnsNoShift => 'पहले किसी काउंटर पर शिफ्ट खोलें।';

  @override
  String get posReturnsGive => 'किस रूप में लौटाएँ';

  @override
  String get posReturnsVoucherHint =>
      'अभी या बाद में बदलाव के भुगतान के लिए वाउचर कोड';

  @override
  String get posReturnsStoreCredit => 'स्टोर क्रेडिट (बदलाव)';

  @override
  String posReturnsAbout(String amount) {
    return 'लगभग $amount';
  }

  @override
  String get posReturnsTake => 'वापस लें';

  @override
  String get posReturnsNumber => 'वापसी';

  @override
  String get posReturnsBill => 'बिल';

  @override
  String get posReturnsWhat => 'क्या वापस आया';

  @override
  String get posReturnsNone => 'इस दिन कोई वापसी नहीं।';

  @override
  String get posReturnsByReason => 'कारण के अनुसार';

  @override
  String get posReturnsByCondition => 'हालत के अनुसार';

  @override
  String get posReturnsBillNumber => 'बिल नंबर';

  @override
  String get posReturnsFind => 'बिल खोजें';

  @override
  String get posReturnsNotFound => 'उस नंबर का कोई बिल नहीं।';

  @override
  String get posReturnsDate => 'तारीख';

  @override
  String get posReturnsShow => 'दिखाएँ';

  @override
  String get posReturnsReasonsSize => 'साइज़';

  @override
  String get posReturnsReasonsColour => 'रंग';

  @override
  String get posReturnsReasonsDefect => 'निर्माण दोष';

  @override
  String get posReturnsReasonsDamaged => 'क्षतिग्रस्त';

  @override
  String get posReturnsReasonsNotLiked => 'पसंद नहीं आया';

  @override
  String get posReturnsReasonsOther => 'अन्य';

  @override
  String get posReturnsGradesA => 'A: नया जैसा, शेल्फ़ पर वापस';

  @override
  String get posReturnsGradesB => 'B: छोटी खामी, सेकंड में बेचें';

  @override
  String get posReturnsGradesC => 'C: बेचा नहीं जा सकता';

  @override
  String get posReturnsErrorsBillVoid =>
      'यह बिल रद्द हो चुका है; इस पर वापसी नहीं हो सकती।';

  @override
  String get posReturnsErrorsOverReturn =>
      'यह उस पंक्ति पर बची मात्रा से ज़्यादा है।';

  @override
  String get posReturnsErrorsSessionNotOpen => 'पहले इस काउंटर पर शिफ्ट खोलें।';

  @override
  String get posReturnsErrorsDuplicateLine => 'एक पंक्ति दो बार है।';

  @override
  String get alterationsTitle => 'ऑल्टरेशन और मरम्मत';

  @override
  String get alterationsSubtitle =>
      'फिटिंग के लिए कपड़े लें, कारीगर को दें और वादे के दिन लौटाएँ।';

  @override
  String get alterationsNewSlip => 'नई ऑल्टरेशन पर्ची';

  @override
  String get alterationsSetUpFirst =>
      'पर्ची लेने के लिए पहले नीचे ऑल्टरेशन के प्रकार जोड़ें।';

  @override
  String get alterationsStatusReceived => 'प्राप्त';

  @override
  String get alterationsStatusWithKarigar => 'कारीगर के पास';

  @override
  String get alterationsStatusReady => 'ग्राहक के लिए तैयार';

  @override
  String get alterationsNone => 'यहाँ कुछ नहीं।';

  @override
  String alterationsLabour(String from, String to) {
    return 'कारीगर मज़दूरी, $from से $to';
  }

  @override
  String get alterationsKarigar => 'कारीगर';

  @override
  String get alterationsKarigars => 'कारीगर';

  @override
  String get alterationsKarigarHint =>
      'बाहरी कारीगरों का अपना खाता बनता है; काम लौटने पर उनकी मज़दूरी जमा होती है। अंदर के कारीगरों को वेतन मिलता है।';

  @override
  String get alterationsNoKarigars => 'अभी कोई कारीगर नहीं।';

  @override
  String get alterationsOutside => 'बाहरी कारीगर';

  @override
  String get alterationsInHouse => 'अंदर के';

  @override
  String get alterationsPhone => 'मोबाइल';

  @override
  String get alterationsSlips => 'पर्चियाँ';

  @override
  String get alterationsPieces => 'पीस';

  @override
  String get alterationsLabourCol => 'मज़दूरी';

  @override
  String get alterationsNoLabour => 'इस महीने कारीगरों से कुछ नहीं लौटा।';

  @override
  String get alterationsOverdue => 'देर हो गई';

  @override
  String alterationsDue(String date) {
    return '$date तक';
  }

  @override
  String alterationsTrial(String date) {
    return 'ट्रायल $date';
  }

  @override
  String alterationsWith(String name) {
    return '$name के पास';
  }

  @override
  String get alterationsFree => 'मुफ़्त';

  @override
  String get alterationsGive => 'दें';

  @override
  String get alterationsBack => 'कारीगर से लौटा';

  @override
  String get alterationsDeliver => 'सौंपें';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'सौंपें और $amount लें';
  }

  @override
  String get alterationsCancelSlip => 'पर्ची रद्द करें';

  @override
  String get alterationsAgainstBill => 'बिल के सामने';

  @override
  String get alterationsTrialOn => 'ट्रायल की तारीख';

  @override
  String get alterationsDeliveryOn => 'डिलीवरी की तारीख';

  @override
  String get alterationsComplimentary => 'खरीद के साथ मुफ़्त';

  @override
  String get alterationsGarment => 'कपड़ा';

  @override
  String get alterationsWork => 'काम';

  @override
  String get alterationsNotes => 'नाप और नोट';

  @override
  String get alterationsAddWork => 'काम जोड़ें';

  @override
  String get alterationsTakeIn => 'पर्ची बनाएँ';

  @override
  String alterationsCharge(String amount) {
    return 'शुल्क $amount';
  }

  @override
  String get alterationsTypes => 'दिए जाने वाले ऑल्टरेशन और मरम्मत';

  @override
  String get alterationsCustomerCharge => 'ग्राहक देगा';

  @override
  String get alterationsKindsAlteration => 'ऑल्टरेशन';

  @override
  String get alterationsKindsRepair => 'मरम्मत';

  @override
  String get alterationsErrorsNameTaken => 'यह नाम पहले से इस्तेमाल में है।';

  @override
  String get alterationsErrorsNotReceived =>
      'यह पर्ची पहले ही कारीगर को जा चुकी है।';

  @override
  String get alterationsErrorsNotWithKarigar =>
      'यह पर्ची किसी कारीगर के पास नहीं है।';

  @override
  String get alterationsErrorsNotReady => 'यह पर्ची अभी तैयार नहीं है।';

  @override
  String get alterationsErrorsTerminalRequired =>
      'शुल्क लेने के लिए काउंटर चुनें।';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'डिलीवरी की तारीख पर्ची की तारीख से पहले है।';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'ट्रायल पर्ची और डिलीवरी की तारीख के बीच होनी चाहिए।';

  @override
  String get alterationsErrorsCannotCancel =>
      'दी जा चुकी या रद्द पर्ची रद्द नहीं हो सकती।';

  @override
  String get tailoringTitle => 'ऑर्डर पर सिलाई';

  @override
  String get tailoringSubtitle =>
      'नाप, एडवांस, हर काम कारीगर से, और डिलीवरी पर सिलाई का बिल।';

  @override
  String get tailoringNewOrder => 'नया सिलाई ऑर्डर';

  @override
  String get tailoringTakeMeasurements => 'नाप लें';

  @override
  String get tailoringStatusBooked => 'बुक';

  @override
  String get tailoringStatusInWork => 'काम चल रहा है';

  @override
  String get tailoringStatusReady => 'डिलीवरी के लिए तैयार';

  @override
  String get tailoringTrialDue => 'ट्रायल बाकी';

  @override
  String get tailoringToday => 'आज देना है';

  @override
  String get tailoringMarkDone => 'हो गया';

  @override
  String get tailoringMarkReady => 'तैयार करें';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'कुल $total, एडवांस $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'डिलीवर करें और $amount लें';
  }

  @override
  String get tailoringCancelOrder => 'ऑर्डर रद्द करें';

  @override
  String tailoringCardsFound(String n) {
    return '$n नाप कार्ड मौजूद';
  }

  @override
  String get tailoringStitchingPrice => 'सिलाई की कीमत';

  @override
  String get tailoringMeasurements => 'नाप कार्ड';

  @override
  String get tailoringNoCard => 'कोई कार्ड नहीं';

  @override
  String get tailoringFabric => 'कपड़ा';

  @override
  String get tailoringOwnFabric => 'ग्राहक का अपना कपड़ा';

  @override
  String get tailoringMetres => 'मीटर';

  @override
  String get tailoringStyleNotes => 'स्टाइल नोट (कॉलर, जेब, फिटिंग, अस्तर...)';

  @override
  String get tailoringAddGarment => 'कपड़ा जोड़ें';

  @override
  String get tailoringAdvance => 'एडवांस (₹)';

  @override
  String get tailoringAdvanceHint =>
      'इस ऑर्डर के लिए जमा रहता है; डिलीवरी पर बिल से घटता है';

  @override
  String get tailoringBook => 'ऑर्डर बुक करें';

  @override
  String tailoringEstimate(String amount) {
    return 'अनुमान $amount';
  }

  @override
  String get tailoringInches => 'नाप इंच में। जो न चाहिए उसे खाली छोड़ें।';

  @override
  String get tailoringOtherMeasure => 'अन्य नाप';

  @override
  String get tailoringValue => 'मान';

  @override
  String get tailoringPhoto => 'फोटो जोड़ें';

  @override
  String get tailoringRates => 'काम के हिसाब से कारीगर दरें';

  @override
  String get tailoringRatesHint =>
      'हर कपड़े के हर काम की प्रति पीस मज़दूरी, जिस क्रम में होता है। नए ऑर्डर ये काम लेते हैं।';

  @override
  String get tailoringProcess => 'काम';

  @override
  String get tailoringNoRates =>
      'अभी कोई दर नहीं: दरें जोड़ने तक ऑर्डर में काम नहीं होंगे।';

  @override
  String get tailoringAddRate => 'काम जोड़ें';

  @override
  String get tailoringKeysChest => 'छाती';

  @override
  String get tailoringKeysWaist => 'कमर';

  @override
  String get tailoringKeysHip => 'हिप';

  @override
  String get tailoringKeysShoulder => 'कंधा';

  @override
  String get tailoringKeysLength => 'लंबाई';

  @override
  String get tailoringKeysSleeve => 'आस्तीन';

  @override
  String get tailoringKeysNeck => 'गला';

  @override
  String get tailoringKeysInseam => 'अंदरूनी लंबाई';

  @override
  String get tailoringErrorsPhotoTooBig => 'फोटो बहुत बड़ी है (अधिकतम 6 MB)।';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'एडवांस ऑर्डर की कुल राशि से ज़्यादा है।';

  @override
  String get tailoringErrorsAssignFirst => 'पहले काम किसी कारीगर को दें।';

  @override
  String get tailoringErrorsProcessDone => 'वह काम पहले ही हो चुका है।';

  @override
  String get tailoringErrorsProcessesPending => 'कुछ काम अभी बाकी हैं।';

  @override
  String get tailoringErrorsNotReady => 'यह ऑर्डर अभी तैयार नहीं है।';

  @override
  String get tailoringErrorsOrderClosed =>
      'यह ऑर्डर पहले ही दिया या रद्द हो चुका है।';

  @override
  String get tailoringErrorsFabricQtyRequired => 'कितने मीटर कपड़ा, डालें।';

  @override
  String get tailoringErrorsNoMeasurements => 'कम से कम एक नाप डालें।';

  @override
  String get tailoringErrorsDuplicateRate => 'एक ही कपड़ा और काम दो बार है।';

  @override
  String get consignmentTitle => 'कंसाइनमेंट और शॉप-इन-शॉप';

  @override
  String get consignmentSubtitle =>
      'दूसरी दुकानों पर रखा माल बिकने तक आपका रहता है। माल भेजें, वापस लें, और उनकी बिक्री रिपोर्ट के अनुसार बिल बनाएँ।';

  @override
  String get consignmentSend => 'माल भेजें';

  @override
  String get consignmentBillSales => 'उनकी बिक्री का बिल';

  @override
  String get consignmentTakeBack => 'माल वापस लें';

  @override
  String get consignmentConsignee => 'कंसाइनी';

  @override
  String get consignmentHeld => 'उनके पास';

  @override
  String get consignmentValueAtCost => 'लागत पर मूल्य';

  @override
  String get consignmentSold => 'बिका';

  @override
  String get consignmentAgeing => 'पुराना माल';

  @override
  String consignmentItemsAgeing(String n) {
    return '150 दिन से पुराने आइटम: $n';
  }

  @override
  String get consignmentFine => 'सब नया';

  @override
  String get consignmentNone => 'अभी कोई माल कंसाइनमेंट पर नहीं है।';

  @override
  String consignmentReconcileTitle(String name) {
    return 'मिलान: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'उनकी दुकान पर गिनी संख्या भरें। कम निकले पीस उन्हें बिके मानकर बिल होंगे। माल भेजने के छह महीने के भीतर बिल बनाना ज़रूरी है।';

  @override
  String get consignmentSent => 'भेजा';

  @override
  String get consignmentReturned => 'वापस आया';

  @override
  String get consignmentCounted => 'गिनती';

  @override
  String get consignmentInvoiceBy => 'बिल की अंतिम तिथि';

  @override
  String consignmentMismatch(String n) {
    return '$n का अंतर';
  }

  @override
  String consignmentShortage(String n) {
    return 'गिनती में कम पीस: $n';
  }

  @override
  String get consignmentShortageNarration => 'स्टॉक गिनती में बिका पाया गया';

  @override
  String get consignmentBillShortage => 'कमी को बिका मानकर बिल करें';

  @override
  String get consignmentRegister => 'आवाजाही';

  @override
  String get consignmentKindsSend => 'भेजा';

  @override
  String get consignmentKindsReturn => 'वापस आया';

  @override
  String get consignmentKindsSale => 'बिका और बिल हुआ';

  @override
  String get consignmentFormsSend => 'कंसाइनमेंट पर माल भेजें';

  @override
  String get consignmentFormsReturn => 'माल वापस लें';

  @override
  String get consignmentFormsSales => 'उनकी बिक्री रिपोर्ट';

  @override
  String get consignmentFormHintsSend =>
      'माल उनकी दुकान में जाता है और आपकी किताबों में रहता है। दर खाली छोड़ें तो उनकी मूल्य सूची या आइटम की बिक्री दर लगेगी।';

  @override
  String get consignmentFormHintsReturn =>
      'न बिके पीस आपके मुख्य गोदाम में लौटते हैं।';

  @override
  String get consignmentFormHintsSales =>
      'हर बिक्री रिपोर्ट उनकी दुकान के माल से उनके नाम टैक्स इनवॉइस बनती है। क्रेडिट सीमा पार होने पर भी चेतावनी के साथ बनती है।';

  @override
  String get consignmentAgreedRate => 'तय दर';

  @override
  String get consignmentAddLine => 'आइटम जोड़ें';

  @override
  String get consignmentSaveSend => 'भेजें';

  @override
  String get consignmentSaveReturn => 'वापस लें';

  @override
  String get consignmentSaveSales => 'इनवॉइस बनाएँ';

  @override
  String get consignmentErrorsMoreThanHeld =>
      'यह उनके पास मौजूद माल से ज़्यादा है।';

  @override
  String get consignmentErrorsNotACustomer => 'ग्राहक खाता चुनें।';

  @override
  String get consignmentErrorsDuplicateItem => 'एक ही आइटम दो बार है।';

  @override
  String get consignmentErrorsUnknownItem => 'एक आइटम अब मौजूद नहीं है।';

  @override
  String get reportsParticulars => 'विवरण';

  @override
  String get reportsTradingIncome => 'बिक्री और प्रत्यक्ष आय';

  @override
  String get reportsTradingExpense => 'खरीद और प्रत्यक्ष व्यय';

  @override
  String get reportsGrossProfit => 'सकल लाभ';

  @override
  String get reportsOtherIncome => 'अप्रत्यक्ष आय';

  @override
  String get reportsOtherExpense => 'अप्रत्यक्ष व्यय';

  @override
  String get reportsNetProfit => 'शुद्ध लाभ';

  @override
  String get reportsNetLoss => 'शुद्ध हानि';

  @override
  String get reportsAssets => 'संपत्तियाँ';

  @override
  String get reportsLiabilities => 'देयताएँ और पूँजी';

  @override
  String get reportsProfitAndLoss => 'लाभ-हानि खाता';

  @override
  String get reportsDifference => 'अंतर';

  @override
  String get reportsOpeningDifference => 'प्रारंभिक शेष में अंतर';

  @override
  String get reportsOpening => 'प्रारंभिक शेष';

  @override
  String get reportsClosing => 'अंतिम शेष';

  @override
  String get reportsNoData => 'इस अवधि के लिए दिखाने को कुछ नहीं।';

  @override
  String reportsLedgerTitle(String account) {
    return 'खाता बही: $account';
  }

  @override
  String get reportsStockNote =>
      'अंतिम स्टॉक चरण 3 में स्टॉक मॉड्यूल आने पर जुड़ेगा।';

  @override
  String get reportsOpeningStock => 'प्रारंभिक स्टॉक';

  @override
  String get reportsClosingStock => 'अंतिम स्टॉक';

  @override
  String get reportsBuilderTitle => 'रिपोर्ट बनाएँ';

  @override
  String get reportsBuilderSubtitle =>
      'बिक्री, ख़रीद, व्यय, लेजर प्रविष्टियाँ या समय को जैसे चाहें समूहित करें और जोड़ें; सहेजें, या ईमेल से मँगाएँ।';

  @override
  String get reportsBuilderDataset => 'डेटा';

  @override
  String get reportsBuilderDatasetsSales => 'बिक्री';

  @override
  String get reportsBuilderDatasetsPurchases => 'ख़रीद';

  @override
  String get reportsBuilderDatasetsExpenses => 'व्यय';

  @override
  String get reportsBuilderDatasetsLedger => 'लेजर प्रविष्टियाँ';

  @override
  String get reportsBuilderDatasetsTime => 'टाइमशीट';

  @override
  String get reportsBuilderGroupBy => 'समूह (अधिकतम 3)';

  @override
  String get reportsBuilderMeasures => 'दिखाएँ';

  @override
  String get reportsBuilderDimsMonth => 'महीना';

  @override
  String get reportsBuilderDimsDay => 'दिन';

  @override
  String get reportsBuilderDimsCustomer => 'ग्राहक';

  @override
  String get reportsBuilderDimsItem => 'आइटम';

  @override
  String get reportsBuilderDimsHsn => 'एचएसएन';

  @override
  String get reportsBuilderDimsState => 'राज्य';

  @override
  String get reportsBuilderDimsSupplier => 'आपूर्तिकर्ता';

  @override
  String get reportsBuilderDimsCategory => 'श्रेणी';

  @override
  String get reportsBuilderDimsEmployee => 'कर्मचारी';

  @override
  String get reportsBuilderDimsProject => 'परियोजना';

  @override
  String get reportsBuilderDimsAccount => 'लेजर';

  @override
  String get reportsBuilderDimsGroup => 'समूह';

  @override
  String get reportsBuilderDimsType => 'वाउचर प्रकार';

  @override
  String get reportsBuilderMeasureNamesQty => 'मात्रा';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'कर योग्य मूल्य';

  @override
  String get reportsBuilderMeasureNamesTax => 'जीएसटी';

  @override
  String get reportsBuilderMeasureNamesTotal => 'कुल';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'दस्तावेज़';

  @override
  String get reportsBuilderMeasureNamesAmount => 'राशि';

  @override
  String get reportsBuilderMeasureNamesItc => 'जीएसटी क्रेडिट';

  @override
  String get reportsBuilderMeasureNamesDebit => 'नामे';

  @override
  String get reportsBuilderMeasureNamesCredit => 'जमा';

  @override
  String get reportsBuilderMeasureNamesNet => 'शुद्ध';

  @override
  String get reportsBuilderMeasureNamesHours => 'घंटे';

  @override
  String get reportsBuilderMeasureNamesCost => 'लागत';

  @override
  String get reportsBuilderMeasureNamesBillableValue => 'बिल योग्य मूल्य';

  @override
  String get reportsBuilderPeriod => 'अवधि';

  @override
  String get reportsBuilderPresetsToday => 'आज';

  @override
  String get reportsBuilderPresetsYesterday => 'कल';

  @override
  String get reportsBuilderPresetsThisMonth => 'इस महीने';

  @override
  String get reportsBuilderPresetsLastMonth => 'पिछले महीने';

  @override
  String get reportsBuilderPresetsThisQuarter => 'इस तिमाही';

  @override
  String get reportsBuilderPresetsLastQuarter => 'पिछली तिमाही';

  @override
  String get reportsBuilderPresetsThisFy => 'इस वित्त वर्ष';

  @override
  String get reportsBuilderPresetsLastFy => 'पिछले वित्त वर्ष';

  @override
  String get reportsBuilderPresetsCustom => 'तारीख़ें चुनें';

  @override
  String get reportsBuilderRun => 'चलाएँ';

  @override
  String get reportsBuilderCsv => 'CSV डाउनलोड करें';

  @override
  String get reportsBuilderSave => 'रिपोर्ट सहेजें';

  @override
  String get reportsBuilderName => 'रिपोर्ट का नाम';

  @override
  String get reportsBuilderSchedule => 'ईमेल करें';

  @override
  String get reportsBuilderFrequenciesNone => 'ईमेल न करें';

  @override
  String get reportsBuilderFrequenciesDaily => 'हर दिन (कल के आँकड़े)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'हर सप्ताह (पिछला सोमवार से रविवार)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'हर महीने (पिछला महीना)';

  @override
  String get reportsBuilderHour => 'समय';

  @override
  String get reportsBuilderWeekday => 'दिन';

  @override
  String get reportsBuilderWeekdays0 => 'रविवार';

  @override
  String get reportsBuilderWeekdays1 => 'सोमवार';

  @override
  String get reportsBuilderWeekdays2 => 'मंगलवार';

  @override
  String get reportsBuilderWeekdays3 => 'बुधवार';

  @override
  String get reportsBuilderWeekdays4 => 'गुरुवार';

  @override
  String get reportsBuilderWeekdays5 => 'शुक्रवार';

  @override
  String get reportsBuilderWeekdays6 => 'शनिवार';

  @override
  String get reportsBuilderDay => 'तारीख़ (1–28)';

  @override
  String get reportsBuilderRecipients => 'किसे ईमेल करें (अल्पविराम से अलग)';

  @override
  String get reportsBuilderSaved => 'सहेजा गया।';

  @override
  String get reportsBuilderTotal => 'कुल';

  @override
  String get reportsBuilderNoRows => 'इस अवधि में कोई डेटा नहीं।';

  @override
  String get reportsBuilderSavedTitle => 'सहेजी रिपोर्ट';

  @override
  String reportsBuilderNextRun(String date) {
    return 'अगला ईमेल: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'पिछली बार विफल: $error';
  }

  @override
  String get reportsBuilderDelete => 'हटाएँ';

  @override
  String get reportsBuilderNone => 'अभी कोई सहेजी रिपोर्ट नहीं।';

  @override
  String get reportsErrorsUnknownDataset => 'किस पर रिपोर्ट चाहिए चुनें।';

  @override
  String get reportsErrorsUnknownMeasure =>
      'दिखाने के लिए कम से कम एक आँकड़ा चुनें।';

  @override
  String get reportsErrorsUnknownDimension => 'यह समूह यहाँ उपलब्ध नहीं है।';

  @override
  String get reportsErrorsInvalidPeriod => 'तारीख़ें जाँचें।';

  @override
  String get reportsErrorsRecipientsRequired => 'कम से कम एक ईमेल पता जोड़ें।';

  @override
  String get reportsErrorsInvalidHour => 'समय चुनें।';

  @override
  String get reportsErrorsInvalidWeekday => 'सप्ताह का दिन चुनें।';

  @override
  String get reportsErrorsInvalidDay => '1 से 28 के बीच तारीख़ चुनें।';

  @override
  String get reportsErrorsUnknownFilter => 'यह फ़िल्टर यहाँ उपलब्ध नहीं है।';

  @override
  String get ownerReportsColourSizeTitle => 'रंग और साइज़ रिपोर्ट';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'हर डिज़ाइन रंग और साइज़ की ग्रिड में, स्टॉक या बिके पीस के साथ।';

  @override
  String get ownerReportsAgeingTitle => 'स्टॉक की उम्र और डेड स्टॉक';

  @override
  String get ownerReportsAgeingSubtitle =>
      'आज का स्टॉक कितने समय से है (पहले आया पहले बिकता है), और क्या बिकना बंद हो गया।';

  @override
  String get ownerReportsRegisterTitle => 'बिक्री रजिस्टर';

  @override
  String get ownerReportsRegisterSubtitle =>
      'अवधि का हर इनवॉइस, काउंटर बिल और वापसी, भुगतान के तरीके के साथ।';

  @override
  String get ownerReportsDesign => 'डिज़ाइन';

  @override
  String get ownerReportsName => 'नाम';

  @override
  String get ownerReportsBrand => 'ब्रांड';

  @override
  String get ownerReportsColour => 'रंग';

  @override
  String get ownerReportsSize => 'साइज़';

  @override
  String get ownerReportsSold => 'बिके';

  @override
  String get ownerReportsStock => 'स्टॉक';

  @override
  String get ownerReportsSales => 'बिक्री';

  @override
  String get ownerReportsReportType => 'दिखाएँ';

  @override
  String get ownerReportsFrom => 'से';

  @override
  String get ownerReportsTo => 'तक';

  @override
  String get ownerReportsAsOf => 'तक की स्थिति';

  @override
  String get ownerReportsStore => 'गोदाम';

  @override
  String get ownerReportsAllStores => 'हमारे सभी गोदाम';

  @override
  String get ownerReportsAllBrands => 'सभी ब्रांड';

  @override
  String get ownerReportsCategory => 'श्रेणी';

  @override
  String get ownerReportsAllCategories => 'सभी श्रेणियाँ';

  @override
  String get ownerReportsSearchDesign => 'डिज़ाइन नं. या नाम';

  @override
  String ownerReportsTotalSold(String n) {
    return 'बिके पीस: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'स्टॉक में पीस: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'एमआरपी $v';
  }

  @override
  String get ownerReportsTotal => 'कुल';

  @override
  String get ownerReportsNoPhoto => 'फ़ोटो नहीं';

  @override
  String get ownerReportsNothing => 'इन विकल्पों के लिए कुछ नहीं।';

  @override
  String get ownerReportsItem => 'आइटम';

  @override
  String get ownerReportsValue => 'मूल्य';

  @override
  String get ownerReportsDeadAfter => 'डेड कब';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'डेड: $n दिन से बिक्री नहीं';
  }

  @override
  String get ownerReportsOnlyDead => 'सिर्फ़ डेड स्टॉक';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'उम्र के हिसाब से स्टॉक: $v, $n पीस';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'डेड स्टॉक ($n दिन से बिक्री नहीं)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'आइटम: $items, पीस: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'छूट, सप्लायर को वापसी या दूसरे गोदाम भेजने लायक।';

  @override
  String get ownerReportsDead => 'डेड';

  @override
  String get ownerReportsLastSold => 'आख़िरी बिक्री';

  @override
  String get ownerReportsIdleDays => 'बिना बिक्री के दिन';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n दिन पहले)';
  }

  @override
  String get ownerReportsNeverSold => 'कभी नहीं बिका';

  @override
  String get ownerReportsDate => 'तारीख़';

  @override
  String get ownerReportsNumber => 'नं.';

  @override
  String get ownerReportsKind => 'दस्तावेज़';

  @override
  String get ownerReportsParty => 'ग्राहक';

  @override
  String get ownerReportsColsPieces => 'पीस';

  @override
  String get ownerReportsColsGross => 'कुल राशि';

  @override
  String get ownerReportsColsDiscount => 'छूट';

  @override
  String get ownerReportsColsTaxable => 'कर योग्य';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'बिल राशि';

  @override
  String get ownerReportsColsCash => 'नकद';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'कार्ड';

  @override
  String get ownerReportsColsCredit => 'उधार';

  @override
  String get ownerReportsKindsInvoice => 'इनवॉइस';

  @override
  String get ownerReportsKindsBill => 'काउंटर बिल';

  @override
  String get ownerReportsKindsCreditNote => 'क्रेडिट नोट';

  @override
  String get ownerReportsKindsCounterReturn => 'काउंटर वापसी';

  @override
  String get ownerReportsSearchRegister => 'नंबर या ग्राहक';

  @override
  String get ownerReportsAllKinds => 'सभी दस्तावेज़';

  @override
  String ownerReportsDocuments(String n) {
    return 'दस्तावेज़: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'वापसी माइनस पंक्तियों में है। रंगी पंक्तियों में छूट थी; कटी पंक्तियाँ रद्द हैं और कुल में नहीं जुड़ीं।';

  @override
  String get ownerReportsCompareLastYear => 'पिछले साल से तुलना';

  @override
  String get ownerReportsThisPeriod => 'यह अवधि';

  @override
  String get ownerReportsSameLastYear => 'पिछले साल यही अवधि';

  @override
  String get ownerReportsChange => 'बदलाव';

  @override
  String get ownerReportsErrorsInvalidPeriod =>
      'शुरुआत की तारीख़ अंत के बाद है।';

  @override
  String get ownerReportsWithMaterials => 'कपड़ा और ट्रिम भी';

  @override
  String get ownerReportsAvgBill => 'औसत बिल';

  @override
  String get fyTitle => 'वित्त वर्ष';

  @override
  String get fySubtitle =>
      'जब किसी अवधि के खाते अंतिम हो जाएँ, उसे लॉक करें: जैसे जीएसटी रिटर्न भरने के बाद। लॉक की तारीख तक कोई प्रविष्टि पोस्ट या रद्द नहीं कर सकता।';

  @override
  String get fyYear => 'वर्ष';

  @override
  String get fyPeriod => 'अवधि';

  @override
  String get fyLockedUpTo => 'लॉक की तारीख';

  @override
  String get fyOpen => 'खुला';

  @override
  String get fyLock => 'लॉक करें';

  @override
  String get fyUnlock => 'लॉक हटाएँ';

  @override
  String get fyErrorsLockOutsideYear =>
      'लॉक की तारीख इसी वित्त वर्ष में होनी चाहिए।';

  @override
  String get appConnectTitle => 'इस डिवाइस को जोड़ें';

  @override
  String get appConnectSubtitle =>
      'अपने वर्चस्व खाते से एक बार साइन इन करें। उसके बाद ऐप बिना इंटरनेट के चलता है और ऑनलाइन होने पर सिंक हो जाता है।';

  @override
  String get appServer => 'सर्वर का पता';

  @override
  String get appConnect => 'जोड़ें';

  @override
  String get appConnecting => 'जोड़ा जा रहा है…';

  @override
  String get appNoBusiness =>
      'यह खाता अभी किसी व्यवसाय से नहीं जुड़ा है। पहले वेबसाइट पर व्यवसाय बनाएँ।';

  @override
  String get appCantReach =>
      'सर्वर तक नहीं पहुँच पा रहे। पता और इंटरनेट कनेक्शन जाँचें।';

  @override
  String get appSyncTitle => 'सिंक';

  @override
  String get appSyncNow => 'अभी सिंक करें';

  @override
  String appLastSync(String time) {
    return 'पिछला सिंक $time';
  }

  @override
  String get appNeverSynced => 'अभी तक सिंक नहीं हुआ';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count बदलाव अपलोड होना बाकी',
      one: '$count बदलाव अपलोड होना बाकी',
      zero: 'सब कुछ अपलोड हो गया',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count बदलाव सर्वर ने अस्वीकार किए',
      one: '$count बदलाव सर्वर ने अस्वीकार किया',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'अस्वीकृत बदलाव फिर से भेजें';

  @override
  String get appOffline =>
      'ऑफ़लाइन: आपका काम इस डिवाइस पर सुरक्षित है और बाद में अपलोड होगा।';

  @override
  String get appSyncing => 'सिंक हो रहा है…';

  @override
  String get appDevice => 'यह डिवाइस';

  @override
  String appDeviceCode(String code) {
    return 'डिवाइस कोड $code';
  }

  @override
  String get appBusiness => 'व्यवसाय';

  @override
  String get appSignOut => 'इस डिवाइस से साइन आउट करें';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count बदलाव अभी अपलोड नहीं हुए हैं और खो जाएँगे।',
      one: '$count बदलाव अभी अपलोड नहीं हुआ है और खो जाएगा।',
      zero: 'इससे इस डिवाइस से आपके खातों की लोकल कॉपी हट जाएगी।',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'अपलोड बाकी';

  @override
  String get appBadgeFailed => 'अस्वीकृत';

  @override
  String get appBadgeSynced => 'अपलोड हो गया';

  @override
  String get appNoVouchers => 'अभी कोई वाउचर नहीं। जोड़ने के लिए + दबाएँ।';

  @override
  String get appAddAccount => 'खाता जोड़ें';

  @override
  String get appNoPermission => 'आपको यह करने की अनुमति नहीं है।';

  @override
  String get appToday => 'आज';

  @override
  String get appPreviousDay => 'पिछला दिन';

  @override
  String get appNextDay => 'अगला दिन';

  @override
  String get appNotSyncedYet => 'सिंक होना बाकी';

  @override
  String get appFieldTitle => 'फ़ील्ड कार्य';

  @override
  String get appFieldNewOrder => 'नया ऑर्डर';

  @override
  String get appFieldNewClaim => 'नया व्यय दावा';

  @override
  String get appFieldOrders => 'इस डिवाइस से ऑर्डर';

  @override
  String get appFieldClaims => 'इस डिवाइस से दावे';

  @override
  String appFieldSentAs(String number) {
    return '$number के रूप में अपलोड हुआ';
  }

  @override
  String appFieldApprox(String amount) {
    return 'जीएसटी सहित लगभग ₹$amount; अंतिम राशि अपलोड पर तय होगी';
  }

  @override
  String get appFieldAddItem => 'आइटम जोड़ें';

  @override
  String get appFieldQty => 'मात्रा';

  @override
  String get appFieldRate => 'दर';

  @override
  String get appFieldSave => 'सहेजें';

  @override
  String get appFieldSaved =>
      'इस डिवाइस पर सहेजा गया; ऑनलाइन होने पर अपलोड होगा।';

  @override
  String get appFieldNone => 'अभी कुछ नहीं।';

  @override
  String get appOverviewTitle => 'सारांश';

  @override
  String appOverviewAsOf(String time) {
    return '$time के आँकड़े';
  }

  @override
  String appOverviewOffline(String time) {
    return '$time के आँकड़े दिखा रहे हैं। ताज़ा करने के लिए इंटरनेट से जुड़ें।';
  }

  @override
  String get appOverviewNever => 'आज के आँकड़े देखने के लिए इंटरनेट से जुड़ें।';

  @override
  String get appOverviewRefresh => 'ताज़ा करें';

  @override
  String get appApprovalsTitle => 'स्वीकृतियाँ';

  @override
  String get appApprovalsNone => 'आपकी प्रतीक्षा में कुछ नहीं।';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours घंटे';
  }

  @override
  String get appApprovalsNeedOnline => 'स्वीकृति के लिए इंटरनेट चाहिए।';

  @override
  String get itemsTitle => 'आइटम';

  @override
  String get itemsSubtitle =>
      'आपके स्टॉक का माल और खरीदी-बेची जाने वाली सेवाएँ, एचएसएन/एसएसी और जीएसटी दर के साथ।';

  @override
  String get itemsNew => 'नया आइटम';

  @override
  String get itemsName => 'आइटम का नाम';

  @override
  String get itemsKind => 'प्रकार';

  @override
  String get itemsGoods => 'माल';

  @override
  String get itemsService => 'सेवा';

  @override
  String get itemsSku => 'एसकेयू / कोड';

  @override
  String get itemsBarcode => 'बारकोड';

  @override
  String get itemsHsn => 'एचएसएन / एसएसी';

  @override
  String get itemsGstRate => 'जीएसटी दर';

  @override
  String get itemsUom => 'इकाई';

  @override
  String get itemsPurchaseRate => 'खरीद दर';

  @override
  String get itemsSaleRate => 'बिक्री दर';

  @override
  String get itemsMrp => 'एमआरपी';

  @override
  String get itemsReorderLevel => 'पुनः ऑर्डर स्तर';

  @override
  String get itemsReorderQty => 'पुनः ऑर्डर मात्रा';

  @override
  String get itemsTrackBatches => 'बैच नंबर और एक्सपायरी ट्रैक करें';

  @override
  String get itemsInStock => 'स्टॉक में';

  @override
  String get itemsEmpty => 'अभी कोई आइटम नहीं।';

  @override
  String get itemsErrorsInvalidHsn => 'एचएसएन कोड में 4, 6 या 8 अंक होते हैं।';

  @override
  String get itemsErrorsInvalidSac =>
      'एसएसी कोड 99 से शुरू होने वाले 6 अंकों का होता है।';

  @override
  String get itemsErrorsItemNameTaken => 'इस नाम का आइटम पहले से मौजूद है।';

  @override
  String get itemsErrorsSkuTaken =>
      'यह कोड किसी दूसरे आइटम में इस्तेमाल हो रहा है।';

  @override
  String get itemsErrorsUnknownUom => 'इकाई चुनें।';

  @override
  String get itemsErrorsSameAsBaseUnit => 'यह पहले से आइटम की अपनी इकाई है।';

  @override
  String get itemsErrorsDuplicateUnit => 'हर इकाई एक बार ही जोड़ी जा सकती है।';

  @override
  String get itemsErrorsInvalidFactor =>
      'इसमें मूल इकाई की कितनी मात्रा है, 0 से अधिक लिखें।';

  @override
  String get itemsLeadTimeDays => 'आपूर्ति समय (दिन)';

  @override
  String get itemsGstSlab => 'जीएसटी दर';

  @override
  String get itemsSlabNone => 'तय दर';

  @override
  String get itemsSlabApparel =>
      'छूट के बाद ₹2,500 प्रति पीस तक 5%, उससे ऊपर 18% (22 सितंबर 2025 से)';

  @override
  String get itemsSlabFootwear =>
      'छूट के बाद ₹2,500 प्रति जोड़ी तक 5%, उससे ऊपर 18% (22 सितंबर 2025 से)';

  @override
  String get itemsSlabPieces => 'एक इकाई में पीस';

  @override
  String get itemsSlabPiecesHint =>
      'एक इकाई के रूप में बिकने वाले सेट की कीमत जीएसटी जाँच के लिए इतने पीस में बाँटी जाती है। सेट को एक पीस मानने के लिए 1 लिखें।';

  @override
  String get itemsByPrice => 'कीमत से';

  @override
  String get itemsOtherUnits => 'अन्य इकाइयाँ';

  @override
  String get itemsUnitFactor => 'मूल इकाई में कितने';

  @override
  String get itemsOfBaseUnit => 'मूल इकाई';

  @override
  String get itemsAddUnit => 'इकाई जोड़ें';

  @override
  String get stylesTitle => 'स्टाइल';

  @override
  String get stylesSubtitle =>
      'रंगों और साइज़ में बिकने वाले डिज़ाइन। हर रंग और साइज़ एक अलग आइटम है, जिसका अपना बारकोड और स्टॉक है।';

  @override
  String get stylesSizesAndColors => 'साइज़ और रंग';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'स्टाइल जोड़ते समय चुने जाने वाले साइज़ स्केल और रंग।';

  @override
  String get stylesNew => 'नई स्टाइल';

  @override
  String get stylesCreate => 'स्टाइल बनाएँ';

  @override
  String get stylesCode => 'डिज़ाइन नं.';

  @override
  String get stylesCodeHint => 'हर SKU में लगता है, जैसे KT-101-NVY-M।';

  @override
  String get stylesName => 'नाम';

  @override
  String get stylesBrand => 'ब्रांड';

  @override
  String get stylesCategory => 'श्रेणी';

  @override
  String get stylesSeason => 'सीज़न';

  @override
  String get stylesSeasonExample => 'त्योहार 2026';

  @override
  String get stylesCollection => 'कलेक्शन';

  @override
  String get stylesSizeScale => 'साइज़ स्केल';

  @override
  String get stylesSizes => 'साइज़';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'रंग';

  @override
  String get stylesColor => 'रंग';

  @override
  String get stylesFits => 'फ़िट';

  @override
  String get stylesFitsHint =>
      'रंग और साइज़ के अलावा तीसरा विकल्प, अल्पविराम से अलग।';

  @override
  String get stylesFitsExample => 'स्लिम, रेगुलर';

  @override
  String get stylesVariants => 'वैरिएंट';

  @override
  String get stylesSaleRate => 'बिक्री दर';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'इससे $count आइटम बनेंगे, हर रंग और साइज़ का एक।',
      one: 'इससे $count आइटम बनेगा।',
      zero: 'साइज़ और रंग चुनें।',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'अभी कोई स्टाइल नहीं। एक जोड़ें और उसके सभी रंग-साइज़ एक साथ बन जाएँगे।';

  @override
  String get stylesNoMatch => 'आपकी खोज से कोई स्टाइल नहीं मिली।';

  @override
  String get stylesSearchStyles => 'डिज़ाइन नं., नाम या ब्रांड से खोजें';

  @override
  String get stylesNoStyles => 'कोई स्टाइल नहीं मिली।';

  @override
  String get stylesChooseStyle => 'स्टाइल चुनें';

  @override
  String get stylesOtherStyle => 'दूसरी स्टाइल';

  @override
  String get stylesAddBySize => 'साइज़ से जोड़ें';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count पीस जोड़ें',
      one: '$count पीस जोड़ें',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'हर खाने के नीचे छोटी संख्या हाथ में स्टॉक है।';

  @override
  String get stylesStockGrid => 'रंग और साइज़ के अनुसार स्टॉक';

  @override
  String get stylesAllWarehouses => 'सभी गोदाम';

  @override
  String get stylesDetails => 'स्टाइल का विवरण';

  @override
  String get stylesApplyPrices => 'ये दरें हर साइज़ पर लागू करें';

  @override
  String get stylesAddVariants => 'रंग या साइज़ जोड़ें';

  @override
  String get stylesAddVariantsHint =>
      'नए रंग, साइज़ या दोनों चुनें। स्टाइल में पहले से मौजूद वैरिएंट वैसे ही रहेंगे।';

  @override
  String get stylesSets => 'सेट';

  @override
  String get stylesNoSets => 'अभी कोई सेट नहीं।';

  @override
  String get stylesNewSet => 'नया सेट';

  @override
  String get stylesNewSetHint =>
      'एक रंग का साइज़ अनुपात वाला सेट, जो एक इकाई के रूप में बिकता है। स्टॉक उसके पीस के रूप में घटता-बढ़ता है।';

  @override
  String get stylesRatio => 'साइज़ के पीस';

  @override
  String get stylesSetAsOnePiece => 'जीएसटी के लिए पूरे सेट को एक पीस मानें';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count पीस का सेट बनाएँ',
      one: '$count पीस का सेट बनाएँ',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'साइज़ स्केल';

  @override
  String get stylesScaleName => 'स्केल का नाम';

  @override
  String get stylesColorName => 'रंग का नाम';

  @override
  String get stylesColorCode => 'कोड';

  @override
  String get stylesSwatch => 'रंग नमूना';

  @override
  String get stylesArchive => 'संग्रहित करें';

  @override
  String get stylesRestore => 'वापस लाएँ';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'यह डिज़ाइन नं. किसी दूसरी स्टाइल में पहले से है।';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'कम से कम एक रंग और एक साइज़ चुनें।';

  @override
  String get stylesErrorsUnknownColor => 'यह रंग आपकी सूची में नहीं है।';

  @override
  String get stylesErrorsVariantMissing =>
      'इस स्टाइल में उस रंग का कोई साइज़ आइटम नहीं है। पहले उसे जोड़ें।';

  @override
  String get stylesErrorsRatioRequired =>
      'सेट में कम से कम एक साइज़ के पीस लिखें।';

  @override
  String get stylesErrorsPackExists => 'यह सेट पहले से मौजूद है।';

  @override
  String get stylesErrorsScaleNameTaken => 'इस नाम का साइज़ स्केल पहले से है।';

  @override
  String get stylesErrorsColorTaken => 'इस नाम या कोड का रंग पहले से है।';

  @override
  String get stylesErrorsSizesRequired => 'कम से कम एक साइज़ लिखें।';

  @override
  String get stylesErrorsColorCodeRequired => 'रंग का कोड लिखें।';

  @override
  String get stylesSummaryTaxonomy => 'डिज़ाइन';

  @override
  String get stylesSummaryCode => 'डिज़ाइन नं.';

  @override
  String get stylesSummaryName => 'नाम';

  @override
  String get stylesSummaryBrand => 'ब्रांड';

  @override
  String get stylesSummaryCategory => 'श्रेणी';

  @override
  String get stylesSummarySeason => 'सीज़न';

  @override
  String get stylesSummaryCollection => 'कलेक्शन';

  @override
  String get stylesSummarySizes => 'साइज़';

  @override
  String get stylesSummaryColours => 'रंग';

  @override
  String get stylesSummaryPricing => 'दाम और लागत';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'मार्क-अप $pct%';
  }

  @override
  String get stylesSummaryCost => 'खरीद दर';

  @override
  String get stylesSummarySaleRate => 'बिक्री दर';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from से $to';
  }

  @override
  String get stylesSummaryPieces => 'स्टॉक में पीस';

  @override
  String get stylesSummarySkus => 'रंग और साइज़ के आइटम';

  @override
  String get stylesSummaryValueAtCost => 'लागत पर स्टॉक';

  @override
  String get stylesSummaryMedia => 'फ़ोटो';

  @override
  String stylesSummaryPhotos(String n) {
    return '$n रखी हैं';
  }

  @override
  String get stylesSummaryNoPhotos => 'अभी कोई फ़ोटो नहीं।';

  @override
  String get stylesSummaryManagePhotos => 'फ़ोटो जोड़ें या बदलें';

  @override
  String get stylesAttributes => 'स्टाइल का वर्णन (आपकी सूचियों से)';

  @override
  String get catalogueTitle => 'इमेज कैटलॉग';

  @override
  String get catalogueSubtitle =>
      'हर डिज़ाइन और रंग फ़ोटो, दर, स्टॉक और बिक्री के साथ। किसी पार्टी के लिए डिज़ाइन चुनें, फिर प्रिंट, एक्सपोर्ट या शेयर करें।';

  @override
  String get catalogueAllColours => 'सभी रंग';

  @override
  String get cataloguePhotos => 'फ़ोटो';

  @override
  String get catalogueView => 'दृश्य';

  @override
  String get catalogueViewsFront => 'सामने';

  @override
  String get catalogueViewsBack => 'पीछे';

  @override
  String get catalogueViewsDetail => 'बारीकी';

  @override
  String get catalogueViewsModel => 'मॉडल पर';

  @override
  String get catalogueViewsOther => 'अन्य';

  @override
  String get catalogueUploading => 'अपलोड हो रहा है…';

  @override
  String get catalogueAddPhotos => 'फ़ोटो जोड़ें';

  @override
  String get cataloguePhotoHint =>
      'अपलोड से पहले फ़ोटो इसी डिवाइस पर छोटी की जाती हैं। फ़ोन पर कैमरे से भी ले सकते हैं।';

  @override
  String get catalogueShownFirst => 'पहले दिखती है';

  @override
  String get catalogueShowFirst => 'पहले दिखाएँ';

  @override
  String get catalogueNoPhotos => 'अभी कोई फ़ोटो नहीं।';

  @override
  String catalogueRecords(String n) {
    return 'दिख रहे डिज़ाइन: $n';
  }

  @override
  String get catalogueTileSize => 'टाइल आकार';

  @override
  String get catalogueSort => 'क्रम';

  @override
  String get catalogueSortsCode => 'डिज़ाइन नं. से';

  @override
  String get catalogueSortsNewest => 'नए पहले';

  @override
  String get catalogueSortsBest => 'सबसे ज़्यादा बिके';

  @override
  String get catalogueSortsPriceLow => 'दाम: कम से ज़्यादा';

  @override
  String get catalogueSortsPriceHigh => 'दाम: ज़्यादा से कम';

  @override
  String get catalogueSortsStock => 'सबसे ज़्यादा स्टॉक';

  @override
  String catalogueCart(String n) {
    return 'कार्ट ($n)';
  }

  @override
  String get catalogueNoPhoto => 'फ़ोटो नहीं';

  @override
  String catalogueStock(String n) {
    return 'स्टॉक: $n';
  }

  @override
  String catalogueSold(String n) {
    return '90 दिन में बिके: $n';
  }

  @override
  String get catalogueAdded => 'कार्ट में';

  @override
  String get catalogueAdd => 'जोड़ें';

  @override
  String get catalogueNone => 'इन फ़िल्टर से कोई डिज़ाइन नहीं मिला।';

  @override
  String get cataloguePrevious => 'पिछला';

  @override
  String get catalogueNext => 'अगला';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$total में से $from से $to';
  }

  @override
  String get catalogueSelections => 'सहेजे गए चयन';

  @override
  String catalogueDesigns(String n) {
    return 'डिज़ाइन: $n';
  }

  @override
  String get catalogueSharedBadge => 'लिंक चालू';

  @override
  String get catalogueNoSelections =>
      'अभी कोई चयन नहीं। डिज़ाइन कार्ट में डालकर सहेजें।';

  @override
  String get catalogueSearch => 'बारकोड, डिज़ाइन या नाम';

  @override
  String get cataloguePriceFor => 'दाम किसके लिए';

  @override
  String get catalogueSaleRate => 'बिक्री दर';

  @override
  String get catalogueInStockOnly => 'सिर्फ़ स्टॉक वाले';

  @override
  String get catalogueWithPhotoOnly => 'सिर्फ़ फ़ोटो वाले';

  @override
  String get catalogueRate => 'दर';

  @override
  String get catalogueRateFrom => 'दर से';

  @override
  String get catalogueRateTo => 'दर तक';

  @override
  String get catalogueReceived => 'इनके बीच आया';

  @override
  String get catalogueReceivedFrom => 'से आया';

  @override
  String get catalogueReceivedTo => 'तक आया';

  @override
  String get catalogueApply => 'लागू करें';

  @override
  String get catalogueBrand => 'ब्रांड';

  @override
  String get catalogueCategory => 'श्रेणी';

  @override
  String get catalogueSeason => 'सीज़न';

  @override
  String get catalogueClear => 'फ़िल्टर हटाएँ';

  @override
  String catalogueDefaultName(String party) {
    return '$party के लिए';
  }

  @override
  String get catalogueUntitled => 'नया चयन';

  @override
  String get catalogueCartTitle => 'कार्ट';

  @override
  String get catalogueCartEmpty =>
      'कार्ट खाली है। किसी डिज़ाइन पर जोड़ें दबाएँ।';

  @override
  String get catalogueSelectionName => 'चयन का नाम';

  @override
  String get catalogueForParty => 'पार्टी के लिए';

  @override
  String get catalogueAnyone => 'कोई भी';

  @override
  String get catalogueSaveSelection => 'चयन सहेजें';

  @override
  String get catalogueEmptyCart => 'कार्ट खाली करें';

  @override
  String get catalogueColsCode => 'डिज़ाइन नं.';

  @override
  String get catalogueColsName => 'नाम';

  @override
  String get catalogueColsSize => 'साइज़';

  @override
  String get catalogueColsRate => 'दर';

  @override
  String get catalogueColsMrp => 'एमआरपी';

  @override
  String get catalogueColsStock => 'स्टॉक';

  @override
  String get cataloguePrintPdf => 'प्रिंट या PDF';

  @override
  String get catalogueExportExcel => 'Excel में निकालें';

  @override
  String get catalogueShowPrices => 'दाम दिखाएँ';

  @override
  String get catalogueShowStock => 'स्टॉक वाले साइज़ दिखाएँ';

  @override
  String get catalogueDeleteConfirm =>
      'यह चयन हटाएँ? शेयर किया लिंक बंद हो जाएगा।';

  @override
  String get catalogueDelete => 'चयन हटाएँ';

  @override
  String get catalogueShareTitle => 'शेयर करें';

  @override
  String catalogueSharedUntil(String date) {
    return 'एक लिंक $date तक चालू है। नया बनाने पर पुराना बंद होगा।';
  }

  @override
  String get catalogueShareHint =>
      'ऐसा लिंक बनाएँ जो बिना लॉगिन यह कैटलॉग खोले, फिर कॉपी करें या WhatsApp पर भेजें।';

  @override
  String get catalogueLinkWorksFor => 'लिंक चलेगा';

  @override
  String catalogueDays(String n) {
    return '$n दिन';
  }

  @override
  String get catalogueNewLink => 'नया लिंक बनाएँ';

  @override
  String get catalogueMakeLink => 'लिंक बनाएँ';

  @override
  String get catalogueStopSharing => 'शेयर बंद करें';

  @override
  String get catalogueLink => 'लिंक';

  @override
  String get catalogueCopied => 'लिंक कॉपी हुआ।';

  @override
  String get catalogueCopy => 'कॉपी';

  @override
  String get catalogueWhatsappTo => 'WhatsApp नंबर';

  @override
  String catalogueSentDemo(String to) {
    return '$to को भेजा दर्ज हुआ (डेमो: अभी WhatsApp प्रदाता सेट नहीं है)।';
  }

  @override
  String catalogueSent(String to) {
    return '$to को WhatsApp पर भेजा।';
  }

  @override
  String get catalogueSendWhatsapp => 'WhatsApp पर भेजें';

  @override
  String catalogueOrderHint(String party) {
    return '$party के लिए सेल्स ऑर्डर बनाने को साइज़वार मात्रा भरें।';
  }

  @override
  String catalogueMrp(String v) {
    return 'एमआरपी $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'नग: $pieces, कर से पहले $value';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'कैटलॉग चयन $name से';
  }

  @override
  String get catalogueMakeOrder => 'सेल्स ऑर्डर बनाएँ';

  @override
  String catalogueForPartyLine(String party) {
    return '$party के लिए';
  }

  @override
  String get catalogueSelectionSubtitle => 'एक कैटलॉग चयन';

  @override
  String get catalogueLinkExpiredTitle => 'यह कैटलॉग अब शेयर नहीं है';

  @override
  String get catalogueLinkExpired =>
      'लिंक की अवधि ख़त्म हो गई या बदल दिया गया। भेजने वाले से नया लिंक माँगें।';

  @override
  String get catalogueErrorsUnknownStyle => 'वह डिज़ाइन अब मौजूद नहीं है।';

  @override
  String get catalogueErrorsUnknownColor => 'इस डिज़ाइन में यह रंग नहीं है।';

  @override
  String get catalogueErrorsUnknownFile =>
      'फ़ोटो अपलोड नहीं हुई। फिर कोशिश करें।';

  @override
  String get catalogueErrorsFileType => 'JPEG, PNG या WebP फ़ोटो लें।';

  @override
  String get catalogueErrorsFileTooLarge => 'फ़ोटो बहुत बड़ी है।';

  @override
  String get catalogueErrorsFileEmpty => 'फ़ोटो खाली है।';

  @override
  String get catalogueErrorsDuplicateImage =>
      'यह फ़ोटो इस डिज़ाइन और रंग पर पहले से है।';

  @override
  String get catalogueErrorsNoLines => 'कम से कम एक डिज़ाइन जोड़ें।';

  @override
  String get catalogueErrorsDuplicateLine =>
      'एक डिज़ाइन और रंग सूची में दो बार है।';

  @override
  String get catalogueErrorsUnknownAccount => 'सूची से पार्टी चुनें।';

  @override
  String get catalogueErrorsInvalidDays => 'लिंक 1 से 90 दिन तक चल सकता है।';

  @override
  String get catalogueErrorsShareLinkStale =>
      'वह लिंक अब चालू नहीं है। पहले नया लिंक बनाएँ।';

  @override
  String get catalogueErrorsInvalidPhone =>
      '10 अंकों का भारतीय मोबाइल नंबर भरें।';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp ने संदेश नहीं लिया। बाद में कोशिश करें।';

  @override
  String get labelsTitle => 'बारकोड और दाम के लेबल';

  @override
  String get labelsSubtitle =>
      'लेबल रोल, A4 शीट या हैंग टैग पर बारकोड, MRP और साइज़ वाले टैग छापें।';

  @override
  String get labelsSearch => 'बारकोड स्कैन करें या नाम लिखें';

  @override
  String get labelsWholeDesign => 'पूरा डिज़ाइन';

  @override
  String get labelsAddOneEach => 'हर साइज़ का एक';

  @override
  String get labelsAddStock => 'स्टॉक के हर पीस का एक';

  @override
  String get labelsItem => 'आइटम';

  @override
  String get labelsBarcode => 'बारकोड';

  @override
  String get labelsMrp => 'एमआरपी';

  @override
  String get labelsPrice => 'दाम';

  @override
  String get labelsLabels => 'लेबल';

  @override
  String get labelsNoBarcode => 'नहीं';

  @override
  String get labelsRemove => 'हटाएँ';

  @override
  String get labelsEmpty =>
      'लेबल जोड़ने को आइटम स्कैन या खोजें, या डिज़ाइन चुनें।';

  @override
  String get labelsStock => 'लेबल का प्रकार';

  @override
  String get labelsTemplatesRoll50x25 => 'रोल, 50 x 25 mm, एक कतार';

  @override
  String get labelsTemplatesRoll38x25x2 => 'रोल, 38 x 25 mm, दो कतार';

  @override
  String get labelsTemplatesA4x65 => 'A4 शीट, 65 लेबल (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'हैंग टैग, 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'व्यवसाय का नाम';

  @override
  String get labelsFieldsName => 'आइटम का नाम';

  @override
  String get labelsFieldsDesign => 'डिज़ाइन नं.';

  @override
  String get labelsFieldsColourSize => 'रंग और साइज़';

  @override
  String get labelsFieldsMrp => 'एमआरपी';

  @override
  String get labelsFieldsPrice => 'बिक्री दाम';

  @override
  String get labelsFieldsExtra => 'अतिरिक्त पंक्ति';

  @override
  String get labelsExtraText => 'अतिरिक्त पंक्ति का पाठ';

  @override
  String get labelsExtraHint => 'जैसे बनाने का महीना या निर्माता का पता।';

  @override
  String get labelsPreview => 'असली आकार में झलक';

  @override
  String get labelsPreviewEmpty => 'लेबल देखने को आइटम जोड़ें।';

  @override
  String labelsPrint(String n) {
    return '$n लेबल छापें';
  }

  @override
  String get labelsPrintHint =>
      'प्रिंट विंडो लेबल के आकार में खुलती है; लेबल प्रिंटर चुनें और मार्जिन शून्य रखें।';

  @override
  String get labelsNothingToPrint =>
      'छापने को कुछ नहीं। इन्वेंटरी में लेबल चुनें, फिर प्रिंट दबाएँ।';

  @override
  String get labelsForBill => 'इस माल के लेबल छापें';

  @override
  String get labelsPrintLabels => 'लेबल छापें';

  @override
  String get shareSendWhatsApp => 'व्हाट्सऐप पर भेजें';

  @override
  String get shareSend => 'भेजें';

  @override
  String get shareMobile => 'मोबाइल नंबर';

  @override
  String shareSentTo(String to) {
    return '$to पर व्हाट्सऐप भेजा गया';
  }

  @override
  String get shareAgain => 'फिर भेजें';

  @override
  String get shareFailed => 'नहीं भेजा गया। नंबर जाँचकर फिर कोशिश करें।';

  @override
  String get shareAutoFailed =>
      'बिल अपने आप व्हाट्सऐप पर नहीं जा सका। फिर भेजें।';

  @override
  String get shareRemind => 'याद दिलाएँ';

  @override
  String get shareRemindAll => 'सभी बकायादारों को याद दिलाएँ';

  @override
  String get shareRemindAllConfirm =>
      'बकाया बिल वाले हर ग्राहक को व्हाट्सऐप पर भुगतान की याद भेजें?';

  @override
  String get shareReminded => 'याद भेजी गई';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n याद भेजी गईं',
      zero: 'कोई याद नहीं भेजी गई',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'मोबाइल नंबर नहीं है, फ़ोन करें: $names';
  }

  @override
  String get shareLogTitle => 'व्हाट्सऐप लॉग';

  @override
  String get shareLogSubtitle =>
      'ग्राहकों को भेजे गए सभी बिल, इनवॉइस, याद और संदेश, नए पहले।';

  @override
  String get shareFilterAll => 'सभी';

  @override
  String get shareFilterSent => 'भेजे गए';

  @override
  String get shareFilterFailed => 'नहीं गए';

  @override
  String get shareThisMonth => 'गिनती इस महीने की है';

  @override
  String get shareWhen => 'कब';

  @override
  String get shareToCol => 'किसे';

  @override
  String get shareKind => 'प्रकार';

  @override
  String get shareMessage => 'संदेश';

  @override
  String get shareStatus => 'स्थिति';

  @override
  String shareBy(String name) {
    return '$name ने भेजा';
  }

  @override
  String get shareNone =>
      'अभी कोई संदेश नहीं। व्हाट्सऐप पर भेजे बिल, इनवॉइस और याद यहाँ दिखेंगे।';

  @override
  String get shareKindsBillShare => 'काउंटर बिल';

  @override
  String get shareKindsInvoiceShare => 'इनवॉइस';

  @override
  String get shareKindsPaymentReminderLink => 'भुगतान की याद';

  @override
  String get shareKindsPaymentReminder => 'भुगतान की याद';

  @override
  String get shareKindsOrderConfirmation => 'ऑर्डर की पुष्टि';

  @override
  String get shareKindsFollowUp => 'फ़ॉलो-अप';

  @override
  String get shareExpiredTitle => 'यह लिंक अब चालू नहीं है';

  @override
  String get shareExpired =>
      'लिंक की अवधि खत्म हो गई है। दुकान से फिर भेजने को कहें।';

  @override
  String get shareStatement => 'खाता विवरण';

  @override
  String shareStatementFor(String name) {
    return '$name का खाता विवरण';
  }

  @override
  String shareAsOf(String date) {
    return '$date तक';
  }

  @override
  String get shareBalance => 'बकाया रकम';

  @override
  String shareOverdue(String amount) {
    return '₹$amount की देय तारीख निकल गई';
  }

  @override
  String get shareBill => 'बिल';

  @override
  String get shareDate => 'तारीख';

  @override
  String get shareDue => 'देय तारीख';

  @override
  String get shareLate => 'देरी';

  @override
  String get shareAmount => 'रकम';

  @override
  String shareDays(num n) {
    return '$n दिन';
  }

  @override
  String get shareNotDue => 'अभी देय नहीं';

  @override
  String get shareNothingOpen => 'कुछ भी बकाया नहीं है। धन्यवाद।';

  @override
  String shareAdvance(String amount) {
    return 'घटाएँ, अग्रिम दिया: ₹$amount';
  }

  @override
  String get sharePayTo => 'भुगतान यहाँ करें';

  @override
  String get shareStatementNote =>
      'अगर आप भुगतान कर चुके हैं तो इस विवरण को अनदेखा करें या भुगतान का ब्योरा हमें भेजें।';

  @override
  String get shareErrorsInvalidPhone => '10 अंकों का मोबाइल नंबर डालें।';

  @override
  String get shareErrorsNothingOutstanding => 'कुछ भी बकाया नहीं है।';

  @override
  String get shareErrorsSendFailed =>
      'व्हाट्सऐप ने संदेश नहीं लिया। फिर कोशिश करें।';

  @override
  String get shareErrorsOutside24hWindow =>
      'इस ग्राहक ने 24 घंटे में संदेश नहीं किया, इसलिए व्हाट्सऐप को मंज़ूर टेम्पलेट चाहिए। संदेश टेम्पलेट में उसका मंज़ूर नाम डालें।';

  @override
  String get shareErrorsBillVoid => 'यह बिल रद्द हो चुका है।';

  @override
  String get shareErrorsInvoiceCancelled => 'यह इनवॉइस रद्द हो चुका है।';

  @override
  String get shareErrorsUnknownTemplate =>
      'संदेश टेम्पलेट संग्रह में चला गया है। संदेश टेम्पलेट में उसे वापस लाएँ।';

  @override
  String get launcherTitle => 'सभी काम';

  @override
  String get launcherSubtitle =>
      'हर एंट्री, स्क्रीन और रिपोर्ट एक जगह। स्टार दबाकर टाइल मेरे मेनू में जोड़ें।';

  @override
  String get launcherFilter => 'काम खोजने के लिए लिखें';

  @override
  String get launcherPin => 'मेरे मेनू में जोड़ें';

  @override
  String get launcherUnpin => 'मेरे मेनू से हटाएँ';

  @override
  String get launcherSaveFailed =>
      'मेरा मेनू सहेजा नहीं जा सका। फिर कोशिश करें।';

  @override
  String get launcherNoMatch => 'इससे कुछ मेल नहीं खाता।';

  @override
  String get launcherDone => 'हो गया';

  @override
  String get launcherEdit => 'टाइल बदलें';

  @override
  String get launcherAddTiles => 'टाइल जोड़ें';

  @override
  String get launcherReset => 'पहले वाली टाइल पर लौटें';

  @override
  String get launcherMoveLeft => 'पहले ले जाएँ';

  @override
  String get launcherMoveRight => 'बाद में ले जाएँ';

  @override
  String get launcherEmpty => 'अभी कोई टाइल नहीं। सभी काम से जोड़ें।';

  @override
  String get launcherMyMenu => 'मेरा मेनू';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'नमस्ते $name। आपकी अपनी टाइल; टाइल बदलें से बदलें।';
  }

  @override
  String get launcherWaiting => 'आपका इंतज़ार';

  @override
  String get launcherSalesToday => 'आज की बिक्री';

  @override
  String get launcherToCollect => 'वसूल करना है';

  @override
  String get launcherToPay => 'चुकाना है';

  @override
  String launcherOverdue(String amount) {
    return '$amount देय तिथि पार';
  }

  @override
  String get launcherFullDashboard => 'पूरा डैशबोर्ड';

  @override
  String get launcherGroupsEntries => 'नई एंट्री';

  @override
  String get launcherGroupsPos => 'शोरूम काउंटर';

  @override
  String get launcherGroupsSales => 'बिक्री';

  @override
  String get launcherGroupsPurchase => 'खरीद';

  @override
  String get launcherGroupsInventory => 'स्टॉक';

  @override
  String get launcherGroupsManufacturing => 'उत्पादन और जॉब वर्क';

  @override
  String get launcherGroupsAccounts => 'खाते और GST';

  @override
  String get launcherGroupsBanking => 'बैंकिंग';

  @override
  String get launcherGroupsReports => 'रिपोर्ट';

  @override
  String get launcherGroupsCrm => 'ग्राहक और व्हाट्सऐप';

  @override
  String get launcherGroupsHr => 'कर्मचारी और वेतन';

  @override
  String get launcherGroupsExpenses => 'खर्च';

  @override
  String get launcherGroupsAssets => 'स्थायी संपत्ति';

  @override
  String get launcherGroupsProjects => 'प्रोजेक्ट';

  @override
  String get launcherGroupsHome => 'होम';

  @override
  String get launcherGroupsSettings => 'सेटिंग';

  @override
  String get launcherLaunchpad => 'लॉन्चपैड';

  @override
  String launcherPinned(String n) {
    return '$n पिन किए';
  }

  @override
  String get launcherRecent => 'हाल में खोले गए';

  @override
  String get launcherMoney => 'आज का पैसा';

  @override
  String launcherVsYesterday(String pct) {
    return 'कल से $pct%';
  }

  @override
  String launcherCounterBills(num n) {
    return '$n काउंटर बिल';
  }

  @override
  String get launcherCashToday => 'काउंटर पर नकद';

  @override
  String get launcherUpiToday => 'काउंटर पर UPI';

  @override
  String get launcherCardToday => 'काउंटर पर कार्ड';

  @override
  String get launcherOverdueToCollect => 'देय तिथि पार वसूली';

  @override
  String get launcherAllTab => 'सब कुछ';

  @override
  String get launcherGridView => 'टाइल';

  @override
  String get launcherListView => 'सूची';

  @override
  String get launcherOpen => 'खोलें';

  @override
  String launcherCount(String n) {
    return '$n स्क्रीन और एंट्री जो आप खोल सकते हैं';
  }

  @override
  String get menuHMasters => 'मास्टर';

  @override
  String get menuHTransaction => 'लेन-देन';

  @override
  String get menuHReports => 'रिपोर्ट';

  @override
  String get menuHAccountReports => 'खाता रिपोर्ट';

  @override
  String get menuHPayroll => 'वेतन';

  @override
  String get menuHUtility => 'यूटिलिटी';

  @override
  String get menuHChat => 'चैट';

  @override
  String get menuHExit => 'बाहर';

  @override
  String get menuSoon => 'जल्द';

  @override
  String get menuNotBuilt => 'अभी नहीं बना; बनने की सूची में है।';

  @override
  String get menuFilter => 'फ़िल्टर';

  @override
  String get menuHome => 'होम';

  @override
  String get menuOpenScreens => 'खुली स्क्रीन';

  @override
  String get menuGAccount => 'खाता';

  @override
  String get menuGStock => 'स्टॉक';

  @override
  String get menuGParameters => 'पैरामीटर';

  @override
  String get menuGPromotion => 'प्रमोशन मास्टर';

  @override
  String get menuGSales => 'बिक्री लेन-देन';

  @override
  String get menuGAccounting => 'लेखा लेन-देन';

  @override
  String get menuGPurchase => 'खरीद लेन-देन';

  @override
  String get menuGJobwork => 'जॉबवर्क लेन-देन';

  @override
  String get menuGOther => 'अन्य लेन-देन';

  @override
  String get menuGSalesReports => 'बिक्री रिपोर्ट';

  @override
  String get menuGStockReports => 'स्टॉक रिपोर्ट';

  @override
  String get menuGCustomReports => 'अपनी रिपोर्ट और जाँच';

  @override
  String get menuGAccountReportsGroup => 'खाता रिपोर्ट समूह';

  @override
  String get menuGFinalReportGroup => 'अंतिम रिपोर्ट समूह';

  @override
  String get menuGMasterGroup => 'मास्टर समूह';

  @override
  String get menuGPayrollTransactionGroup => 'वेतन लेन-देन समूह';

  @override
  String get menuGReportGroup => 'रिपोर्ट समूह';

  @override
  String get menuGUtilityGroup => 'यूटिलिटी समूह';

  @override
  String get menuGBarcodeGroup => 'बारकोड समूह';

  @override
  String get menuGExtraUtility => 'अतिरिक्त यूटिलिटी';

  @override
  String get menuGUserManagement => 'यूज़र प्रबंधन';

  @override
  String get menuGSoftwareUtility => 'सॉफ़्टवेयर यूटिलिटी';

  @override
  String get menuGChatGroup => 'चैट और ग्राहक';

  @override
  String get menuIAccountMaster => 'खाता मास्टर';

  @override
  String get menuIBankMaster => 'बैंक मास्टर';

  @override
  String get menuIOpeningBalance => 'प्रारंभिक शेष';

  @override
  String get menuIBalanceSheetGroup => 'बैलेंस शीट समूह';

  @override
  String get menuIAccountGroup => 'खाता समूह';

  @override
  String get menuIAccountCategory => 'खाता श्रेणी';

  @override
  String get menuIRegionMaster => 'क्षेत्र मास्टर';

  @override
  String get menuICustomerSubCategory => 'ग्राहक उप-श्रेणी';

  @override
  String get menuIRemarksMaster => 'टिप्पणी मास्टर';

  @override
  String get menuICompanyMaster => 'कंपनी मास्टर';

  @override
  String get menuICountryMaster => 'देश मास्टर';

  @override
  String get menuIDepartmentMaster => 'विभाग मास्टर';

  @override
  String get menuIManufactureCompany => 'निर्माता कंपनी';

  @override
  String get menuIBrandMaster => 'ब्रांड मास्टर';

  @override
  String get menuIProductMaster => 'उत्पाद मास्टर';

  @override
  String get menuIStyleMaster => 'स्टाइल मास्टर';

  @override
  String get menuIItemGroup => 'आइटम समूह';

  @override
  String get menuIItemMaster => 'आइटम मास्टर';

  @override
  String get menuIDesignMaster => 'डिज़ाइन मास्टर';

  @override
  String get menuIColorMaster => 'रंग मास्टर';

  @override
  String get menuISizeGroupMaster => 'साइज़ समूह मास्टर';

  @override
  String get menuISizeMaster => 'साइज़ मास्टर';

  @override
  String get menuIFabric => 'कपड़ा';

  @override
  String get menuISleeves => 'आस्तीन';

  @override
  String get menuINeck => 'गला';

  @override
  String get menuIFit => 'फ़िट';

  @override
  String get menuISeason => 'सीज़न';

  @override
  String get menuIStyleAttr => 'स्टाइल';

  @override
  String get menuIGender => 'लिंग';

  @override
  String get menuITypeMaster => 'प्रकार मास्टर';

  @override
  String get menuISubCategory9 => 'उप-श्रेणी 9';

  @override
  String get menuISubCategory10 => 'उप-श्रेणी 10';

  @override
  String get menuIMaterialMaster => 'मटीरियल मास्टर';

  @override
  String get menuIFixedBarcode => 'स्थिर बारकोड';

  @override
  String get menuIMinMaxStock => 'न्यूनतम अधिकतम स्टॉक';

  @override
  String get menuIOpeningStock => 'प्रारंभिक स्टॉक';

  @override
  String get menuISeasonMaster => 'सीज़न मास्टर';

  @override
  String get menuIProcessMaster => 'प्रक्रिया मास्टर';

  @override
  String get menuIOrderType => 'ऑर्डर प्रकार';

  @override
  String get menuIWarehouses => 'गोदाम और स्टोर';

  @override
  String get menuIDayBookMaster => 'डेबुक मास्टर';

  @override
  String get menuILedgerParameter => 'खाता पैरामीटर';

  @override
  String get menuISalesmanMaster => 'सेल्समैन मास्टर';

  @override
  String get menuITaxMaster => 'टैक्स मास्टर';

  @override
  String get menuITdsMaster => 'TDS मास्टर';

  @override
  String get menuITcsTaxMaster => 'TCS टैक्स मास्टर';

  @override
  String get menuIFinanceYearMaster => 'वित्त वर्ष मास्टर';

  @override
  String get menuIHsnCodeMaster => 'HSN कोड मास्टर';

  @override
  String get menuISalesReturnReason => 'बिक्री वापसी कारण';

  @override
  String get menuISalesmanCommTarget => 'सेल्समैन कमीशन लक्ष्य';

  @override
  String get menuIItemDiscountSetup => 'आइटम छूट सेटअप';

  @override
  String get menuIPromoMaster => 'प्रोमो मास्टर';

  @override
  String get menuISisSetup => 'SIS सेटअप';

  @override
  String get menuIItemCommissionSetup => 'आइटम कमीशन सेटअप';

  @override
  String get menuISourceMaster => 'स्रोत मास्टर';

  @override
  String get menuISalesOrderWh => 'बिक्री ऑर्डर (थोक)';

  @override
  String get menuIWhSalesOrderCancel => 'थोक ऑर्डर रद्द';

  @override
  String get menuIDeliveryOrder => 'डिलीवरी ऑर्डर (D.O)';

  @override
  String get menuIDeliveryChallan => 'डिलीवरी चालान';

  @override
  String get menuISalesBillWh => 'बिक्री बिल (थोक)';

  @override
  String get menuIDeliveryChallanReturnWh => 'डिलीवरी चालान वापसी (थोक)';

  @override
  String get menuICreditNoteWh => 'क्रेडिट नोट (थोक)';

  @override
  String get menuIAdvanceReceipt => 'अग्रिम रसीद';

  @override
  String get menuICashPayRec => 'नकद भुगतान/प्राप्ति';

  @override
  String get menuIBankPayRec => 'बैंक भुगतान/प्राप्ति';

  @override
  String get menuIBillWiseReceipt => 'बिल-वार रसीद';

  @override
  String get menuICardReceipt => 'कार्ड रसीद';

  @override
  String get menuIJournalVoucher => 'जर्नल वाउचर';

  @override
  String get menuIContraVoucher => 'कॉन्ट्रा वाउचर';

  @override
  String get menuIPurchaseOrder => 'खरीद ऑर्डर';

  @override
  String get menuIInwardChallan => 'इनवर्ड चालान';

  @override
  String get menuIPurchase => 'खरीद';

  @override
  String get menuIGoodsReturn => 'माल वापसी';

  @override
  String get menuIDebitNote => 'डेबिट नोट';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'जॉब इश्यू';

  @override
  String get menuIJobReceipt => 'जॉब रसीद';

  @override
  String get menuIJobWorkIssue => 'जॉबवर्क इश्यू';

  @override
  String get menuIJobWorkReceipt => 'जॉबवर्क रसीद';

  @override
  String get menuIStockAdjustment => 'स्टॉक समायोजन';

  @override
  String get menuISampleIssue => 'सैंपल इश्यू';

  @override
  String get menuISampleReceive => 'सैंपल प्राप्ति';

  @override
  String get menuIQuotation => 'कोटेशन';

  @override
  String get menuILrTransportEntry => 'LR/ढुलाई एंट्री';

  @override
  String get menuIEWayBill => 'ई-वे बिल';

  @override
  String get menuIRePackingBox => 'रीपैकिंग बॉक्स';

  @override
  String get menuIReOpenBox => 'बॉक्स फिर खोलें';

  @override
  String get menuILedgerReport => 'खाता रिपोर्ट';

  @override
  String get menuICashBookReport => 'रोकड़ बही रिपोर्ट';

  @override
  String get menuIBankReport => 'बैंक रिपोर्ट';

  @override
  String get menuIBankReconciliation => 'बैंक मिलान';

  @override
  String get menuIGroupMonthSummary => 'समूह/माह सारांश';

  @override
  String get menuICashBankExpense => 'नकद बैंक खर्च';

  @override
  String get menuICashFlowReportGroup => 'नकदी प्रवाह रिपोर्ट';

  @override
  String get menuIBillToBillAdjustment => 'बिल से बिल समायोजन';

  @override
  String get menuIMsmeReport => 'MSME रिपोर्ट';

  @override
  String get menuIOutstandingPayable => 'बकाया देय';

  @override
  String get menuIOutstandingReceivable => 'बकाया प्राप्य';

  @override
  String get menuIDebtorsList => 'देनदार सूची';

  @override
  String get menuICreditorList => 'लेनदार सूची';

  @override
  String get menuIInterestReport => 'ब्याज रिपोर्ट';

  @override
  String get menuIDepreciationAssetReport => 'मूल्यह्रास संपत्ति रिपोर्ट';

  @override
  String get menuIJournalVoucherReport => 'जर्नल वाउचर रिपोर्ट';

  @override
  String get menuIGstReport => 'GST रिपोर्ट';

  @override
  String get menuITdsReport => 'TDS रिपोर्ट';

  @override
  String get menuITdsForm26q => 'TDS फॉर्म 26Q';

  @override
  String get menuIFinalReport => 'अंतिम रिपोर्ट';

  @override
  String get menuIRcmRegister => 'RCM रजिस्टर';

  @override
  String get menuITcsReport => 'TCS रिपोर्ट';

  @override
  String get menuIEmployee => 'कर्मचारी';

  @override
  String get menuIEmployeeKyc => 'कर्मचारी KYC अपडेट';

  @override
  String get menuISalaryDeduction => 'वेतन कटौती';

  @override
  String get menuIWeekOff => 'साप्ताहिक छुट्टी';

  @override
  String get menuIWeekOffCancel => 'साप्ताहिक छुट्टी रद्द';

  @override
  String get menuIHolidays => 'छुट्टियाँ';

  @override
  String get menuIDesignation => 'पद';

  @override
  String get menuIDepartment => 'विभाग';

  @override
  String get menuIShiftMaster => 'शिफ्ट मास्टर';

  @override
  String get menuIDailyAttendance => 'दैनिक हाज़िरी';

  @override
  String get menuILeaveApplication => 'छुट्टी आवेदन';

  @override
  String get menuIAdvanceSalary => 'अग्रिम वेतन (उपाड़)';

  @override
  String get menuILoanIssue => 'ऋण जारी';

  @override
  String get menuILoanReceipt => 'ऋण वसूली';

  @override
  String get menuIMonthlySalary => 'मासिक वेतन';

  @override
  String get menuIStipend => 'वजीफ़ा';

  @override
  String get menuISalaryPayment => 'वेतन भुगतान';

  @override
  String get menuIStipendPayment => 'वजीफ़ा भुगतान';

  @override
  String get menuIIncentive => 'प्रोत्साहन';

  @override
  String get menuIOtherDeduction => 'अन्य कटौती';

  @override
  String get menuIAdvanceLoanRequest => 'अग्रिम और ऋण अनुरोध';

  @override
  String get menuIMonthlyAttendanceRegister => 'मासिक हाज़िरी रजिस्टर';

  @override
  String get menuIDayWiseAttendanceRegister => 'दिनवार हाज़िरी रजिस्टर';

  @override
  String get menuISalarySlipRegister => 'वेतन पर्ची रजिस्टर';

  @override
  String get menuIPtReport => 'PT रिपोर्ट';

  @override
  String get menuILeaveReport => 'छुट्टी रिपोर्ट';

  @override
  String get menuIMenuLogSessionReport => 'मेनू लॉग सत्र रिपोर्ट';

  @override
  String get menuIPayrollParameter => 'वेतन पैरामीटर';

  @override
  String get menuIDeviceSettings => 'डिवाइस सेटिंग';

  @override
  String get menuIBarcodePrint => 'बारकोड प्रिंट';

  @override
  String get menuIBarcodeSearch => 'बारकोड खोज';

  @override
  String get menuIBarcodeDesignImage => 'बारकोड/डिज़ाइन फ़ोटो';

  @override
  String get menuIRateUpdation => 'दर अपडेट';

  @override
  String get menuIImageCatalogue => 'फ़ोटो कैटलॉग';

  @override
  String get menuISalesDiscountMaster => 'बिक्री छूट मास्टर';

  @override
  String get menuISalesDiscountDesignWise => 'डिज़ाइन-वार बिक्री छूट';

  @override
  String get menuISalesmanCommission => 'सेल्समैन कमीशन';

  @override
  String get menuIDayClose => 'दिन बंद';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'ईमेल';

  @override
  String get menuIBulkMessenger => 'बल्क मैसेंजर';

  @override
  String get menuILogHistoryReport => 'लॉग इतिहास रिपोर्ट';

  @override
  String get menuIOutstandingAdj => 'बकाया समायोजन';

  @override
  String get menuIResetPhysicalStock => 'भौतिक स्टॉक रीसेट';

  @override
  String get menuIPhysicalStockVerification => 'भौतिक स्टॉक सत्यापन';

  @override
  String get menuIMerge => 'मर्ज';

  @override
  String get menuISalesStockLedgerDiff => 'बिक्री स्टॉक खाता अंतर';

  @override
  String get menuINoteReport => 'नोट रिपोर्ट';

  @override
  String get menuIEInvoiceUpload => 'ई-इनवॉइस अपलोड';

  @override
  String get menuIEWayBillUpload => 'ई-वे बिल अपलोड';

  @override
  String get menuIAutoOutstandingReminder => 'स्वतः बकाया याद';

  @override
  String get menuIUsers => 'यूज़र';

  @override
  String get menuIUserGroup => 'यूज़र समूह';

  @override
  String get menuICurrentDateSetting => 'वर्तमान तिथि सेटिंग';

  @override
  String get menuIDataLockTillDate => 'तिथि तक डेटा लॉक';

  @override
  String get menuIMyDevices => 'मेरे डिवाइस';

  @override
  String get menuILedgerStockPosting => 'खाता और स्टॉक पोस्टिंग';

  @override
  String get menuIReportType => 'रिपोर्ट प्रकार';

  @override
  String get menuIUserParameter => 'यूज़र पैरामीटर';

  @override
  String get menuIBalanceTransfer => 'शेष अंतरण';

  @override
  String get menuIDatabaseBackup => 'डेटाबेस बैकअप';

  @override
  String get menuISoftwareUpdate => 'सॉफ़्टवेयर अपडेट';

  @override
  String get menuIDbUpdates => 'DB अपडेट';

  @override
  String get menuIScheduleBackup => 'बैकअप समय तय करें';

  @override
  String get menuIExportVouchersPdf => 'वाउचर PDF में निकालें';

  @override
  String get menuIEmployeeDepartment => 'विभाग';

  @override
  String get menuISensitiveChanges => 'संवेदनशील बदलाव';

  @override
  String get menuITransporterMaster => 'ट्रांसपोर्टर मास्टर';

  @override
  String get listsSubtitle =>
      'इस व्यवसाय की अपनी सूची। प्रविष्टि हटाने के बजाय संग्रहित करें, ताकि पुराने दस्तावेज़ों में उसका मान बना रहे।';

  @override
  String get listsName => 'नाम';

  @override
  String get listsCode => 'कोड';

  @override
  String get listsNote => 'टिप्पणी';

  @override
  String get listsNewEntry => 'नई प्रविष्टि';

  @override
  String listsShowArchived(String n) {
    return 'संग्रहित दिखाएँ ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n प्रविष्टियाँ',
      one: '$n प्रविष्टि',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'संग्रहित करें';

  @override
  String get listsRestore => 'वापस लाएँ';

  @override
  String get listsNoMatch => 'खोज से कोई प्रविष्टि मेल नहीं खाती।';

  @override
  String get listsEmpty =>
      'इस सूची में अभी कुछ नहीं है। पहली प्रविष्टि ऊपर की पंक्ति में लिखें।';

  @override
  String get listsEmptyReadOnly => 'इस सूची में अभी कुछ नहीं है।';

  @override
  String get listsOtherLists => 'सूचियाँ';

  @override
  String get listsErrorsLookupTaken =>
      'इस सूची में इस नाम की प्रविष्टि पहले से है।';

  @override
  String get listsErrorsEndBeforeStart => 'समाप्ति तिथि आरंभ तिथि से पहले है।';

  @override
  String get limitsTitle => 'न्यूनतम और अधिकतम स्टॉक';

  @override
  String get limitsSubtitle =>
      'तय करें कि हर माल का स्टॉक गोदाम में कम से कम और ज़्यादा से ज़्यादा कितना रहे। न्यूनतम से नीचे वाले माल पर निशान लगता है, ताकि पता चले क्या मँगाना है।';

  @override
  String get limitsWarehouse => 'गोदाम';

  @override
  String limitsOnlyBelow(String n) {
    return 'केवल न्यूनतम से नीचे ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n पंक्तियाँ सहेजी गईं',
      one: '$n पंक्ति सहेजी गई',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return '$n बदली पंक्तियाँ सहेजें';
  }

  @override
  String get limitsItem => 'माल';

  @override
  String get limitsInStock => 'स्टॉक में';

  @override
  String get limitsMin => 'न्यूनतम';

  @override
  String get limitsMax => 'अधिकतम';

  @override
  String get limitsToOrder => 'मँगाना है';

  @override
  String get limitsBelow => 'न्यूनतम से नीचे';

  @override
  String get limitsNoMatch => 'कोई माल मेल नहीं खाता।';

  @override
  String get limitsEmpty =>
      'अभी कोई माल नहीं है। पहले माल या स्टाइल जोड़ें, फिर यहाँ सीमा तय करें।';

  @override
  String get limitsErrorsMaxBelowMin => 'अधिकतम, न्यूनतम से कम नहीं हो सकता।';

  @override
  String get billReceiptTitleReceivable => 'बिल अनुसार रसीद';

  @override
  String get billReceiptTitlePayable => 'बिल अनुसार भुगतान';

  @override
  String get billReceiptSubtitleReceivable =>
      'प्राप्त रकम दर्ज करें और चुनें कि वह किन बिलों का भुगतान है। बची रकम खाते में रहती है और सबसे पुराने बिल चुकाती है।';

  @override
  String get billReceiptSubtitlePayable =>
      'आपूर्तिकर्ता को दिया भुगतान दर्ज करें और चुनें कि वह किन बिलों का है। बची रकम खाते में रहती है और सबसे पुराने बिल चुकाती है।';

  @override
  String get billReceiptTabReceipt => 'रसीद';

  @override
  String get billReceiptTabPayment => 'भुगतान';

  @override
  String get billReceiptCustomer => 'ग्राहक';

  @override
  String get billReceiptSupplier => 'आपूर्तिकर्ता';

  @override
  String get billReceiptChoose => 'पक्ष चुनें';

  @override
  String get billReceiptAccount => 'नकद या बैंक खाता';

  @override
  String get billReceiptAmountReceived => 'प्राप्त रकम';

  @override
  String get billReceiptAmountPaid => 'दी गई रकम';

  @override
  String get billReceiptReference => 'संदर्भ (चेक, UPI आईडी)';

  @override
  String get billReceiptOpenBills => 'बकाया बिल';

  @override
  String billReceiptAdvance(String amount) {
    return 'पहले से खाते में: $amount';
  }

  @override
  String get billReceiptFillOldest => 'सबसे पुराने से भरें';

  @override
  String get billReceiptClear => 'साफ़ करें';

  @override
  String get billReceiptBill => 'बिल';

  @override
  String get billReceiptDueOn => 'देय तिथि';

  @override
  String get billReceiptPending => 'बकाया';

  @override
  String get billReceiptPayNow => 'अभी चुकाएँ';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिन देर',
      one: '$n दिन देर',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'इस पक्ष का कोई बकाया बिल नहीं है।';

  @override
  String get billReceiptOnBills => 'बिलों पर';

  @override
  String get billReceiptOnAccount => 'खाते में';

  @override
  String get billReceiptSaveReceipt => 'रसीद सहेजें';

  @override
  String get billReceiptSavePayment => 'भुगतान सहेजें';

  @override
  String billReceiptSaved(String number) {
    return '$number के रूप में सहेजा गया';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'बिलों की कुल रकम दी गई रकम से ज़्यादा है।';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'इनमें से एक बिल अब बकाया नहीं है। पेज दोबारा खोलकर फिर कोशिश करें।';

  @override
  String get billReceiptErrorsOverBill => 'एक रकम बिल के बकाया से ज़्यादा है।';

  @override
  String get billReceiptErrorsAmountRequired => 'रकम दर्ज करें।';

  @override
  String get billReceiptErrorsBillTwice => 'एक ही बिल दो बार दिया गया है।';

  @override
  String get booksTitle => 'खाता बही';

  @override
  String get booksSubtitle =>
      'नकद और बैंक का लेन-देन, किसी समूह का महीनेवार हाल, नकद और बैंक से हुआ खर्च, और पैसा कहाँ से आया और कहाँ गया।';

  @override
  String get booksCash => 'रोकड़ बही';

  @override
  String get booksBank => 'बैंक बही';

  @override
  String get booksGroup => 'समूह महीनेवार';

  @override
  String get booksExpense => 'नकद और बैंक खर्च';

  @override
  String get booksFlow => 'नकदी प्रवाह';

  @override
  String get booksShow => 'दिखाएँ';

  @override
  String get booksPickGroup => 'खाता समूह';

  @override
  String get booksOpening => 'प्रारंभिक शेष';

  @override
  String get booksReceipts => 'प्राप्तियाँ';

  @override
  String get booksPayments => 'भुगतान';

  @override
  String get booksClosing => 'अंतिम शेष';

  @override
  String get booksAccounts => 'खाते';

  @override
  String get booksByDay => 'दिनवार';

  @override
  String get booksMonth => 'महीना';

  @override
  String get booksDebit => 'नामे';

  @override
  String get booksCredit => 'जमा';

  @override
  String get booksExpenseAccount => 'व्यय खाता';

  @override
  String get booksVouchers => 'वाउचर';

  @override
  String get booksOtherSide => 'प्रविष्टि का दूसरा पक्ष';

  @override
  String get booksMoneyIn => 'आया पैसा';

  @override
  String get booksMoneyOut => 'गया पैसा';

  @override
  String get booksNet => 'शुद्ध';

  @override
  String get booksTotal => 'कुल';

  @override
  String get booksEmpty => 'इस अवधि में कुछ नहीं है।';

  @override
  String get booksNoAccounts => 'इस समूह में अभी कोई खाता नहीं है।';

  @override
  String get booksRcm => 'आरसीएम रजिस्टर';

  @override
  String get booksAdjust => 'बिल से बिल समायोजन';

  @override
  String get booksVoucher => 'वाउचर';

  @override
  String get booksBill => 'निपटाया गया बिल';

  @override
  String get booksParty => 'पक्ष';

  @override
  String get booksAmount => 'रकम';

  @override
  String get booksSupplier => 'आपूर्तिकर्ता';

  @override
  String get booksInvoice => 'आपूर्तिकर्ता का बिल';

  @override
  String get booksTaxable => 'कर योग्य';

  @override
  String get booksCgst => 'सीजीएसटी';

  @override
  String get booksSgst => 'एसजीएसटी / यूटीजीएसटी';

  @override
  String get booksIgst => 'आईजीएसटी';

  @override
  String get booksCess => 'उपकर';

  @override
  String get hubReportsTitle => 'रिपोर्ट';

  @override
  String get hubReportsSubtitle =>
      'हर रिपोर्ट एक जगह, उस सवाल के हिसाब से जिसका वह जवाब देती है।';

  @override
  String get hubMastersTitle => 'मास्टर';

  @override
  String get hubMastersSubtitle =>
      'वे रिकॉर्ड जिन पर हर बिल और वाउचर टिका है: आप क्या बेचते हैं, किससे लेन-देन करते हैं, दाम और नियम, स्टोर और काउंटर।';

  @override
  String get hubGroupsMerchandise => 'माल';

  @override
  String get hubGroupsParties => 'पार्टी और लोग';

  @override
  String get hubGroupsCommercial => 'दाम, ऑफ़र और टैक्स';

  @override
  String get hubGroupsOperational => 'स्टोर, काउंटर और नियम';

  @override
  String get hubGroupsSales => 'बिक्री';

  @override
  String get hubGroupsStock => 'स्टॉक';

  @override
  String get hubGroupsAccounts => 'खाता रिपोर्ट';

  @override
  String get hubGroupsTax => 'टैक्स और वैधानिक';

  @override
  String get hubGroupsAudit => 'जाँच और ऑडिट';

  @override
  String get hubGroupsCustom => 'आपकी अपनी रिपोर्ट';

  @override
  String get hubAboutMerchandise => 'डिज़ाइन, साइज़, रंग और फ़ोटो';

  @override
  String get hubAboutParties => 'ग्राहक, सप्लायर और हर खाता; कर्मचारी';

  @override
  String get hubAboutCommercial =>
      'चीज़ें किस दाम पर बिकती हैं और कौन सा GST लगता है';

  @override
  String get hubAboutOperational =>
      'स्टॉक कहाँ रहता है और काउंटर व नंबर कैसे चलते हैं';

  @override
  String get hubAboutSales => 'क्या बिका, कहाँ और किसे';

  @override
  String get hubAboutStock => 'शेल्फ़ पर क्या है और कितने दिन से पड़ा है';

  @override
  String get hubAboutAccounts => 'किसका कितना बकाया, मुनाफ़ा और खाते';

  @override
  String get hubAboutTax => 'GST रिटर्न, वेतन वैधानिक और टैक्स मूल्यह्रास';

  @override
  String get hubAboutAudit => 'देखने लायक गड़बड़ियाँ और किसने क्या बदला';

  @override
  String get hubAboutCustom => 'अपनी रिपोर्ट बनाएँ, सहेजें और समय तय करें';

  @override
  String get exchangeOpen => 'वापसी या बदली';

  @override
  String get exchangeTitle => 'इस बिल पर वापस आया माल';

  @override
  String exchangeTaking(num pieces, String number) {
    return '$number से $pieces पीस वापस';
  }

  @override
  String get exchangeCredit => 'क्रेडिट';

  @override
  String get exchangeAdd => 'इस बिल पर वापस लें';

  @override
  String exchangeCreditUsed(String number) {
    return '$number के बदले वापसी';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount क्रेडिट बचा है; यह स्टोर क्रेडिट रहेगा।';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'वापसी $number ने इस बिल से $amount घटाए।';
  }

  @override
  String exchangeLeftCode(String amount) {
    return '$amount का स्टोर क्रेडिट बचा, कोड:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'वापस (बिल $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'स्टोर क्रेडिट $amount, कोड $code';
  }

  @override
  String get inwardTransporter => 'ट्रांसपोर्टर';

  @override
  String get inwardLrNumber => 'LR नंबर';

  @override
  String get inwardLrDate => 'LR तारीख';

  @override
  String get inwardMarkup => 'मार्क-अप %';

  @override
  String get inwardMarkupHint => 'लागत से MRP भरता है';

  @override
  String get inwardRounding => 'MRP को गोल करें';

  @override
  String get inwardRound1 => 'निकटतम रुपया';

  @override
  String get inwardRound9 => '9 पर खत्म (1,299)';

  @override
  String get inwardRound10 => 'अगले 10';

  @override
  String get inwardRound50 => 'अगले 50';

  @override
  String get inwardCost => 'लागत';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'मार्क-अप';

  @override
  String get inwardMarkupTitle => 'लागत पर MRP, लागत का %';

  @override
  String get inwardMarginCol => 'मार्जिन';

  @override
  String get inwardMarginTitle => 'MRP से लागत तक कमी, MRP का %';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces पीस, लागत $value';
  }

  @override
  String get inwardLastPurchases => 'पिछली खरीद';

  @override
  String get inwardPickLine => 'पहले की लागत देखने के लिए कोई लाइन चुनें।';

  @override
  String get inwardCurrentMrp => 'अभी का MRP';

  @override
  String get inwardInStock => 'स्टॉक में';

  @override
  String get inwardDate => 'तारीख';

  @override
  String get inwardNeverBought => 'पहले नहीं खरीदा।';

  @override
  String get inwardPrintLabels => 'इन पीस के लेबल छापें';

  @override
  String get inwardDocument => 'चालान';

  @override
  String get inwardState => 'राज्य';

  @override
  String get inwardTransport => 'ढुलाई';

  @override
  String get inwardSizeCurve => 'साइज़ के हिसाब से पीस';

  @override
  String get inwardTotalQty => 'पीस';

  @override
  String get inwardAtCost => 'लागत पर';

  @override
  String get inwardAvgMarkup => 'मार्क-अप';

  @override
  String get countsTitle => 'स्टॉक गिनती';

  @override
  String get countsSubtitle =>
      'बारकोड स्कैन करके स्टोर गिनें। अनुमोदक अंतर और उसका मूल्य देखता है, और मंज़ूरी से खाते ठीक होते हैं।';

  @override
  String get countsWholeStore => 'पूरा स्टोर';

  @override
  String get countsWhat => 'क्या गिनना है';

  @override
  String get countsByAll => 'स्टोर का सारा माल';

  @override
  String get countsByBrand => 'एक ब्रांड';

  @override
  String get countsByCategory => 'एक श्रेणी';

  @override
  String get countsByStyleId => 'एक डिज़ाइन';

  @override
  String get countsName => 'नाम';

  @override
  String get countsNamePlaceholder => 'जैसे कुर्ता दीवार';

  @override
  String get countsBlind =>
      'बिना देखे गिनती (गिनने वाले खाते के आँकड़े नहीं देखते)';

  @override
  String get countsBlindShort => 'बिना देखे गिनती';

  @override
  String get countsStart => 'गिनती शुरू करें';

  @override
  String get countsScanHere => 'बारकोड स्कैन करें';

  @override
  String get countsAdd => 'जोड़ें';

  @override
  String get countsScanHint =>
      'हर स्कैन एक पीस जोड़ता है। पाँच के लिए 5*बारकोड लिखें, या नीचे तालिका में गिनती लिखें।';

  @override
  String get countsOutOfScope => 'इस गिनती में नहीं था, जोड़ा';

  @override
  String get countsStatusCounting => 'गिनती चल रही है';

  @override
  String get countsStatusSubmitted => 'मंज़ूरी का इंतज़ार';

  @override
  String get countsStatusApproved => 'मंज़ूर, खाते ठीक किए';

  @override
  String get countsStatusCancelled => 'रद्द';

  @override
  String get countsJournal => 'स्टॉक समायोजन देखें';

  @override
  String get countsPiecesCounted => 'गिने गए पीस';

  @override
  String get countsItemsCounted => 'गिने गए आइटम';

  @override
  String get countsInBooks => 'खाते में';

  @override
  String get countsShort => 'कम (मूल्य)';

  @override
  String get countsExcess => 'अधिक (मूल्य)';

  @override
  String get countsNet => 'कुल अंतर';

  @override
  String get countsBlindNote =>
      'बिना देखे गिनती: जमा करने के बाद खाते के आँकड़े दिखेंगे।';

  @override
  String get countsSubmit => 'गिनती पूरी करें';

  @override
  String get countsReason => 'अंतर का कारण';

  @override
  String countsApproveAdjust(num n) {
    return 'मंज़ूर करें और $n आइटम ठीक करें';
  }

  @override
  String get countsApproveNone => 'मंज़ूर करें (कोई अंतर नहीं)';

  @override
  String get countsRecount => 'फिर से गिनने भेजें';

  @override
  String get countsWaitingApproval => 'मालिक या एडमिन अंतर मंज़ूर करते हैं।';

  @override
  String get countsCancelConfirm =>
      'यह गिनती रद्द करें? खातों में कुछ नहीं बदलेगा।';

  @override
  String get countsCancel => 'गिनती रद्द करें';

  @override
  String get countsOnlyDiff => 'केवल अंतर वाले आइटम दिखाएँ';

  @override
  String get countsItem => 'आइटम';

  @override
  String get countsCounted => 'गिना';

  @override
  String get countsDiff => 'अंतर';

  @override
  String get countsValue => 'मूल्य';

  @override
  String get countsNoDiff => 'खातों से कुछ अलग नहीं।';

  @override
  String get countsNumber => 'गिनती';

  @override
  String get countsStarted => 'शुरू';

  @override
  String get countsState => 'स्थिति';

  @override
  String get countsNone => 'अभी कोई गिनती नहीं।';

  @override
  String get countsErrorsCountClosed => 'यह गिनती अब खुली नहीं है।';

  @override
  String get countsErrorsCountNotSubmitted => 'पहले गिनती पूरी करें।';

  @override
  String get countsErrorsReasonRequired => 'अंतर का कारण लिखें।';

  @override
  String get countsErrorsUnknownBarcode => 'इस बारकोड का कोई आइटम नहीं।';

  @override
  String get countsErrorsNothingToCount => 'उस चुनाव से कोई माल मेल नहीं खाता।';

  @override
  String get countsErrorsUnknownWarehouse => 'स्टोर चुनें।';

  @override
  String get countsErrorsTooManyCodes =>
      'फ़ाइल में 5,000 से ज़्यादा अलग बारकोड हैं। उसे बाँटकर हिस्सों में आयात करें।';

  @override
  String get countsImportTitle => 'स्कैनर फ़ाइल आयात करें';

  @override
  String get countsImportHelp =>
      'हैंडहेल्ड स्कैनर की टेक्स्ट फ़ाइल: हर पंक्ति में एक बारकोड, या बारकोड और मात्रा (\"8901234567890,3\")। दोहराए बारकोड जुड़ जाते हैं।';

  @override
  String get countsImportMode => 'संख्याओं का क्या करें';

  @override
  String get countsImportAdd => 'जो गिना जा चुका है उसमें जोड़ें';

  @override
  String get countsImportReplace => 'इन बारकोड की गिनती बदलें';

  @override
  String get countsImportChoose => 'फ़ाइल चुनें';

  @override
  String get countsImportReading => 'पढ़ रहा है...';

  @override
  String get countsImportTooBig => 'यह फ़ाइल बहुत बड़ी है (2 एमबी से ज़्यादा)।';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matched माल गिने गए',
      one: '$matched माल गिना गया',
    );
    return '$_temp0, $pieces नग';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n माल इस गिनती की सूची में नहीं थे, जोड़े गए।',
      one: '$n माल इस गिनती की सूची में नहीं था, जोड़ा गया।',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n कोड कोई माल नहीं हैं: $list',
      one: '$n कोड कोई माल नहीं है: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n पंक्तियाँ पढ़ी न जा सकीं (पंक्तियाँ $list)',
      one: '$n पंक्ति पढ़ी न जा सकी (पंक्ति $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'स्टॉक सारांश';

  @override
  String stockSubtitle(String method) {
    return 'हर आइटम की मात्रा और मूल्य। मूल्यांकन: $method।';
  }

  @override
  String get stockMethodAverage => 'चल औसत';

  @override
  String get stockMethodFifo => 'फीफो (पहले आया, पहले गया)';

  @override
  String get stockWarehouse => 'गोदाम';

  @override
  String get stockAllWarehouses => 'सभी गोदाम';

  @override
  String get stockQty => 'मात्रा';

  @override
  String get stockRate => 'दर';

  @override
  String get stockValue => 'मूल्य';

  @override
  String get stockTotalValue => 'कुल स्टॉक मूल्य';

  @override
  String get stockBelowReorder => 'पुनः ऑर्डर स्तर से नीचे';

  @override
  String get stockReorderTitle => 'पुनः ऑर्डर करने वाले आइटम';

  @override
  String get stockReorderEmpty =>
      'कोई भी आइटम पुनः ऑर्डर स्तर से नीचे नहीं है।';

  @override
  String get stockSuggested => 'सुझाया गया ऑर्डर';

  @override
  String stockLedgerTitle(String item) {
    return 'स्टॉक खाता: $item';
  }

  @override
  String get stockIn => 'आवक';

  @override
  String get stockOut => 'जावक';

  @override
  String get stockSourceStockJournal => 'स्टॉक जर्नल';

  @override
  String get stockSourceGrn => 'माल प्राप्ति';

  @override
  String get stockSourcePurchaseBill => 'खरीद बिल';

  @override
  String get stockSourcePurchaseReturn => 'खरीद वापसी';

  @override
  String get stockNegativeWarning =>
      'किसी आइटम का स्टॉक शून्य से नीचे चला गया। कोई खरीद प्रविष्टि छूटी तो नहीं, जाँचें।';

  @override
  String get sjTitle => 'स्टॉक जर्नल';

  @override
  String get sjSubtitle =>
      'प्रारंभिक स्टॉक, गिनती के बाद समायोजन, गोदामों के बीच स्थानांतरण और खपत।';

  @override
  String get sjNew => 'नया स्टॉक जर्नल';

  @override
  String get sjKindsOpening => 'प्रारंभिक स्टॉक';

  @override
  String get sjKindsAdjustment => 'समायोजन';

  @override
  String get sjKindsTransfer => 'स्थानांतरण';

  @override
  String get sjKindsIssue => 'निर्गम / खपत';

  @override
  String get sjKindHintsOpening =>
      'खाते शुरू होने के समय का स्टॉक। मात्रा और लागत डालें।';

  @override
  String get sjKindHintsAdjustment =>
      'भौतिक गिनती के बाद स्टॉक ठीक करें: मात्रा जोड़ें या घटाएँ।';

  @override
  String get sjKindHintsTransfer =>
      'माल को उसकी मौजूदा लागत पर एक गोदाम से दूसरे में भेजें।';

  @override
  String get sjKindHintsIssue =>
      'व्यवसाय में खपत हुआ माल (नमूने, निजी उपयोग, उत्पादन)।';

  @override
  String get sjDirection => 'जोड़ें / घटाएँ';

  @override
  String get sjAdd => 'जोड़ें';

  @override
  String get sjRemove => 'घटाएँ';

  @override
  String get sjToWarehouse => 'किस गोदाम में';

  @override
  String get sjBatch => 'बैच';

  @override
  String get sjExpiry => 'एक्सपायरी';

  @override
  String get sjPost => 'स्टॉक जर्नल पोस्ट करें';

  @override
  String get sjErrorsRateRequired => 'प्रारंभिक स्टॉक की लागत दर डालें।';

  @override
  String get sjErrorsServiceHasNoStock => 'सेवाओं का स्टॉक नहीं होता।';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses => 'दो अलग-अलग गोदाम चुनें।';

  @override
  String get sjErrorsBatchRequired =>
      'यह आइटम बैच ट्रैक करता है: बैच नंबर डालें।';

  @override
  String get sjErrorsQtyMustBePositive => 'मात्रा शून्य से अधिक होनी चाहिए।';

  @override
  String get purchaseSupplier => 'आपूर्तिकर्ता';

  @override
  String get purchaseChooseSupplier => 'आपूर्तिकर्ता चुनें…';

  @override
  String get purchaseItem => 'आइटम';

  @override
  String get purchaseChooseItem => 'आइटम चुनें…';

  @override
  String get purchaseQty => 'मात्रा';

  @override
  String get purchaseRate => 'दर';

  @override
  String get purchaseDiscount => 'छूट';

  @override
  String get purchaseGst => 'जीएसटी %';

  @override
  String get purchaseAmount => 'राशि';

  @override
  String get purchaseTaxable => 'कर योग्य मूल्य';

  @override
  String get purchaseTotal => 'कुल';

  @override
  String get purchaseStatus => 'स्थिति';

  @override
  String get purchaseStatusesOpen => 'खुला';

  @override
  String get purchaseStatusesPartial => 'आंशिक प्राप्त';

  @override
  String get purchaseStatusesReceived => 'प्राप्त';

  @override
  String get purchaseStatusesClosed => 'बंद';

  @override
  String get purchaseStatusesCancelled => 'रद्द';

  @override
  String get purchaseStatusesPosted => 'पोस्ट किया गया';

  @override
  String get purchaseStatusesBilled => 'बिल हो गया';

  @override
  String get purchaseOrdersTitle => 'खरीद ऑर्डर';

  @override
  String get purchaseOrdersSubtitle =>
      'आपूर्तिकर्ताओं से क्या मँगाया और कितना आया।';

  @override
  String get purchaseOrdersNew => 'नया खरीद ऑर्डर';

  @override
  String get purchaseOrdersExpectedOn => 'कब तक अपेक्षित';

  @override
  String get purchaseOrdersOrdered => 'ऑर्डर किया';

  @override
  String get purchaseOrdersReceived => 'प्राप्त';

  @override
  String get purchaseOrdersBilled => 'बिल किया';

  @override
  String get purchaseOrdersReceive => 'माल प्राप्त करें';

  @override
  String get purchaseOrdersBill => 'बिल दर्ज करें';

  @override
  String get purchaseOrdersClose => 'ऑर्डर बंद करें';

  @override
  String get purchaseReceiptsTitle => 'इनवर्ड चालान';

  @override
  String get purchaseReceiptsSubtitle =>
      'आया हुआ माल (जीआरएन)। प्राप्ति पर स्टॉक बढ़ता है; बिल बाद में आता है।';

  @override
  String get purchaseReceiptsNew => 'नया इनवर्ड चालान';

  @override
  String get purchaseReceiptsChallan => 'आपूर्तिकर्ता चालान नं.';

  @override
  String get purchaseReceiptsBill => 'बिल दर्ज करें';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'ऑर्डर $number के विरुद्ध';
  }

  @override
  String get purchaseBillsTitle => 'खरीद बिल';

  @override
  String get purchaseBillsSubtitle =>
      'आपूर्तिकर्ताओं के इनवॉइस। हर बिल खरीद, इनपुट जीएसटी और आपूर्तिकर्ता के खाते में पोस्ट होता है।';

  @override
  String get purchaseBillsNew => 'नया खरीद बिल';

  @override
  String get purchaseBillsInvoiceNo => 'आपूर्तिकर्ता इनवॉइस नं.';

  @override
  String get purchaseBillsInvoiceDate => 'आपूर्तिकर्ता इनवॉइस तारीख';

  @override
  String get purchaseBillsPostingDate => 'पोस्टिंग तारीख';

  @override
  String get purchaseBillsDueOn => 'देय तारीख';

  @override
  String get purchaseBillsReverseCharge => 'रिवर्स चार्ज (कर हम भरेंगे)';

  @override
  String get purchaseBillsReturn => 'माल वापस करें';

  @override
  String get purchaseBillsReturned => 'वापस किया';

  @override
  String get purchaseBillsPost => 'बिल पोस्ट करें';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'पंक्ति $line पर बिल की दर माल प्राप्ति से अलग है। स्टॉक प्राप्ति की दर पर ही रहेगा।';
  }

  @override
  String get purchaseReturnsTitle => 'खरीद वापसी';

  @override
  String get purchaseReturnsSubtitle =>
      'आपूर्तिकर्ताओं को लौटाया गया माल (डेबिट नोट)।';

  @override
  String get purchaseReturnsNew => 'माल वापस करें';

  @override
  String get purchaseReturnsReason => 'कारण';

  @override
  String get purchaseReturnsPost => 'डेबिट नोट पोस्ट करें';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'बिल $number के विरुद्ध';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'विविध लेनदार के अंतर्गत कोई खाता चुनें।';

  @override
  String get purchaseErrorsUnknownSupplier => 'आपूर्तिकर्ता चुनें।';

  @override
  String get purchaseErrorsOverReceipt =>
      'यह ऑर्डर में बाकी मात्रा से ज़्यादा है।';

  @override
  String get purchaseErrorsOverBilling =>
      'यह प्राप्त और अभी तक बिल न हुई मात्रा से ज़्यादा है।';

  @override
  String get purchaseErrorsOverReturn =>
      'यह बिल की गई और अभी तक वापस न हुई मात्रा से ज़्यादा है।';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'यह आपूर्तिकर्ता इनवॉइस पहले ही दर्ज हो चुका है।';

  @override
  String get purchaseErrorsBillHasReturns =>
      'पहले इस बिल की वापसियाँ रद्द करें।';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'इस प्राप्ति का बिल बन चुका है; पहले बिल रद्द करें।';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'इस ऑर्डर पर माल आ चुका है; इसे बंद करें।';

  @override
  String get purchaseErrorsOrderNotOpen => 'यह ऑर्डर बंद है।';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'आपूर्तिकर्ता के इनवॉइस की तारीख पोस्टिंग तारीख के बाद नहीं हो सकती।';

  @override
  String get purchaseErrorsNoLines => 'कम से कम एक पंक्ति जोड़ें।';

  @override
  String get purchaseErrorsItemArchived => 'एक आइटम संग्रहीत है।';

  @override
  String get purchaseReadButton => 'बिल पढ़ें';

  @override
  String get purchaseReadHint =>
      'आपूर्तिकर्ता के बिल की फ़ोटो या PDF: फ़ॉर्म भर दिया जाएगा, आप जाँच लें।';

  @override
  String get purchaseReadReading => 'बिल पढ़ रहे हैं…';

  @override
  String get purchaseReadDone =>
      'बिल से भरा गया। सहेजने से पहले हर पंक्ति जाँच लें।';

  @override
  String purchaseReadUnmatched(String items) {
    return 'इनका आइटम चुनें: $items।';
  }

  @override
  String get purchaseReadDemo => 'अपने आप पढ़ना चालू नहीं है; कृपया बिल भरें।';

  @override
  String get purchaseReadNone => 'यह बिल पढ़ा नहीं जा सका; कृपया भरें।';

  @override
  String get inventorySettingsTitle => 'स्टॉक सेटिंग्स';

  @override
  String get inventorySettingsValuation => 'स्टॉक मूल्यांकन विधि';

  @override
  String get inventorySettingsValuationHint =>
      'निकले और बचे स्टॉक का मूल्य कैसे निकले। बदलने पर शुरुआत से पूरे स्टॉक का फिर से मूल्यांकन होगा।';

  @override
  String get inventorySettingsWarehouses => 'गोदाम';

  @override
  String get inventorySettingsAddWarehouse => 'गोदाम जोड़ें';

  @override
  String get inventorySettingsWarehouseName => 'गोदाम का नाम';

  @override
  String get inventorySettingsDefault => 'डिफ़ॉल्ट';

  @override
  String get inventorySettingsNameTaken => 'इस नाम का गोदाम पहले से मौजूद है।';

  @override
  String get salesCustomer => 'ग्राहक';

  @override
  String get salesChooseCustomer => 'ग्राहक चुनें…';

  @override
  String get salesPlaceOfSupply => 'आपूर्ति का स्थान';

  @override
  String get salesExport => 'निर्यात';

  @override
  String get salesSez => 'एसईज़ेड ग्राहक';

  @override
  String get salesLut => 'एलयूटी के तहत (बिना कर)';

  @override
  String get salesStatusesDelivered => 'डिलीवर हो गया';

  @override
  String get salesStatusesInvoiced => 'इनवॉइस हो गया';

  @override
  String get salesStatusesAccepted => 'स्वीकृत';

  @override
  String get salesStatusesDeclined => 'अस्वीकृत';

  @override
  String get salesStatusesConverted => 'बदला गया';

  @override
  String get salesStatusesExpired => 'समाप्त';

  @override
  String get salesOrdersTitle => 'बिक्री ऑर्डर';

  @override
  String get salesOrdersSubtitle =>
      'ग्राहकों ने क्या ऑर्डर किया और कितना भेजा गया।';

  @override
  String get salesOrdersNew => 'नया बिक्री ऑर्डर';

  @override
  String get salesOrdersDeliverBy => 'कब तक डिलीवरी';

  @override
  String get salesOrdersCustomerRef => 'ग्राहक का पीओ नं.';

  @override
  String get salesOrdersOrdered => 'ऑर्डर';

  @override
  String get salesOrdersDelivered => 'डिलीवर';

  @override
  String get salesOrdersInvoiced => 'इनवॉइस';

  @override
  String get salesOrdersDeliver => 'माल भेजें';

  @override
  String get salesOrdersInvoice => 'इनवॉइस बनाएँ';

  @override
  String get salesOrdersClose => 'ऑर्डर बंद करें';

  @override
  String get salesDeliveriesTitle => 'डिलीवरी चालान';

  @override
  String get salesDeliveriesSubtitle =>
      'इनवॉइस से पहले (या बिना) भेजा गया माल। डिलीवरी पर स्टॉक घटता है।';

  @override
  String get salesDeliveriesNew => 'नया डिलीवरी चालान';

  @override
  String get salesDeliveriesInvoice => 'इनवॉइस बनाएँ';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'ऑर्डर $number के विरुद्ध';
  }

  @override
  String get salesDeliveriesReason => 'कारण';

  @override
  String get salesDeliveriesValue => 'मूल्य';

  @override
  String get salesDeliveriesTransporter => 'ट्रांसपोर्टर';

  @override
  String get salesDeliveriesVehicleNo => 'वाहन सं.';

  @override
  String get salesDeliveriesPrint => 'चालान छापें (3 प्रतियाँ)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return '$date तक इनवॉइस';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    return 'माल $count बार वापस आया: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'माल वापस लें';

  @override
  String get salesDeliveriesStillOut => 'अभी बाहर';

  @override
  String get salesDeliveriesCameBack => 'वापस आया';

  @override
  String get salesDeliveriesSaveReturn => 'वापसी सहेजें';

  @override
  String get salesDeliveriesNewApproval => 'नया अप्रूवल मेमो';

  @override
  String get salesDeliveriesReasonsSupply => 'आपूर्ति, इनवॉइस बाद में';

  @override
  String get salesDeliveriesReasonsApproval => 'अप्रूवल पर बिक्री';

  @override
  String get salesDeliveriesReasonsJobWork => 'जॉब वर्क';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'आपूर्ति नहीं (स्वयं उपयोग, मरम्मत)';

  @override
  String get salesDeliveriesReasonsLots => 'किस्तों में आपूर्ति';

  @override
  String get salesDeliveriesReasonsExhibition => 'प्रदर्शनी या मेला';

  @override
  String get salesDeliveriesReasonsOther => 'अन्य';

  @override
  String get salesDeliveriesReasonsSample => 'सैंपल';

  @override
  String get salesDeliveriesReasonHintsSupply =>
      'माल बिका; टैक्स इनवॉइस बाद में।';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'ग्राहक जो बिके वह रखता है। छह महीने में इनवॉइस बनाएँ या माल वापस लें।';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'प्रोसेसिंग के लिए भेजा; माल वापस आएगा।';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'बिना बिक्री के माल जाता है, इसलिए टैक्स नहीं दिखता।';

  @override
  String get salesDeliveriesReasonHintsLots => 'एक आपूर्ति कई किस्तों में।';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'प्रदर्शनी में दिखाया; न बिका माल वापस आएगा।';

  @override
  String get salesDeliveriesReasonHintsOther => 'माल का कोई अन्य आवागमन।';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'दिखाने या आज़माने के लिए भेजा; बिक्री नहीं, इसलिए कर नहीं दिखता। जो न रखा जाए वह वापसी पर लौटता है।';

  @override
  String get salesInvoicesTitle => 'बिक्री इनवॉइस';

  @override
  String get salesInvoicesSubtitle =>
      'टैक्स इनवॉइस। हर इनवॉइस बिक्री, आउटपुट जीएसटी और ग्राहक के खाते में पोस्ट होता है।';

  @override
  String get salesInvoicesNew => 'नया इनवॉइस';

  @override
  String get salesInvoicesDueOn => 'देय तारीख';

  @override
  String get salesInvoicesPost => 'इनवॉइस सहेजें';

  @override
  String get salesInvoicesPrint => 'प्रिंट';

  @override
  String get salesInvoicesCreditNote => 'क्रेडिट नोट / वापसी';

  @override
  String get salesInvoicesReturned => 'वापस';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'इससे ग्राहक अपनी क्रेडिट सीमा से ऊपर चला जाता है ($detail बकाया)।';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return '$detail का माल: भेजने से पहले ई-वे बिल ज़रूरी है।';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'पंक्ति $lineNo में एचएसएन कोड नहीं है; टैक्स इनवॉइस पर यह ज़रूरी है।';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'कुछ स्टॉक शून्य से नीचे चला गया। कोई खरीद प्रविष्टि छूटी तो नहीं, जाँचें।';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'इस ग्राहक का एक बिल $days दिन से बकाया है।';
  }

  @override
  String get salesCreditNotesTitle => 'क्रेडिट नोट';

  @override
  String get salesCreditNotesSubtitle =>
      'बिक्री वापसी और बिक्री के बाद दाम में कमी।';

  @override
  String get salesCreditNotesNew => 'क्रेडिट नोट';

  @override
  String get salesCreditNotesReason => 'कारण';

  @override
  String get salesCreditNotesGoodsReturned => 'माल स्टॉक में वापस';

  @override
  String get salesCreditNotesPriceReduction =>
      'केवल दाम में कमी (माल वापस नहीं)';

  @override
  String get salesCreditNotesCreditRate => 'प्रति इकाई क्रेडिट';

  @override
  String get salesCreditNotesPost => 'क्रेडिट नोट पोस्ट करें';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'इनवॉइस $number के विरुद्ध';
  }

  @override
  String get salesErrorsNotACustomer =>
      'विविध देनदार के अंतर्गत कोई खाता चुनें।';

  @override
  String get salesErrorsUnknownCustomer => 'ग्राहक चुनें।';

  @override
  String get salesErrorsOverDelivery =>
      'यह ऑर्डर में बाकी मात्रा से ज़्यादा है।';

  @override
  String get salesErrorsOverInvoicing =>
      'यह डिलीवर और अभी तक इनवॉइस न हुई मात्रा से ज़्यादा है।';

  @override
  String get salesErrorsOverReturn => 'जितना बाहर है उससे अधिक वापस आ रहा है।';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'पहले इस इनवॉइस के क्रेडिट नोट रद्द करें।';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'इस चालान का इनवॉइस बन चुका है; पहले इनवॉइस रद्द करें।';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'इस ऑर्डर पर माल जा चुका है; इसे बंद करें।';

  @override
  String get salesErrorsCancelIrnFirst => 'पहले ई-इनवॉइस (आईआरएन) रद्द करें।';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'क्रेडिट इनवॉइस की दर से ज़्यादा नहीं हो सकता।';

  @override
  String get salesErrorsRateRequired => 'प्रति इकाई क्रेडिट डालें।';

  @override
  String get salesErrorsQuotationNotOpen =>
      'यह कोटेशन पहले ही बदला या बंद किया जा चुका है।';

  @override
  String get salesErrorsQuotationConverted =>
      'यह कोटेशन बदला जा चुका है; पहले उससे बना ऑर्डर या इनवॉइस रद्द करें।';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'यह कोटेशन किसी दूसरे ग्राहक का है।';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“कब तक मान्य” कोटेशन की तारीख से पहले नहीं हो सकता।';

  @override
  String get salesErrorsCancelEwbFirst => 'पहले ई-वे बिल रद्द करें।';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'इस महीने का GSTR-1 दाखिल हो चुका है। चालू महीने की तारीख डालें, या GST पोर्टल पर संशोधन करें।';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'अग्रिम कुल राशि से अधिक नहीं हो सकता।';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'इस चालान पर माल वापस आया है, इसलिए रद्द नहीं हो सकता।';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'वापसी की तिथि चालान की तिथि से पहले है।';

  @override
  String get salesErrorsDeliveryCancelled => 'यह चालान रद्द है।';

  @override
  String get salesErrorsUnknownDeliveryLine => 'यह लाइन इस चालान पर नहीं है।';

  @override
  String get salesErrorsCreditBlocked =>
      'यह बिक्री ग्राहक को क्रेडिट सीमा से ऊपर ले जाती है, और उनका खाता ब्लॉक पर है।';

  @override
  String get salesErrorsOverdueBlocked =>
      'इस ग्राहक का एक बिल अनुमत अवधि से अधिक बकाया है, और उनका खाता ब्लॉक पर है।';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'केवल मालिक या एडमिन क्रेडिट ब्लॉक हटा सकते हैं।';

  @override
  String get salesErrorsNotAnAgent => 'दलाल या एजेंट चिह्नित खाता चुनें।';

  @override
  String get salesErrorsUnknownSalesman =>
      'अपने कर्मचारियों में से सेल्समैन चुनें।';

  @override
  String get salesErrorsUnknownOrder => 'वह ऑर्डर नहीं मिला।';

  @override
  String get salesQuotationsTitle => 'कोटेशन';

  @override
  String get salesQuotationsSubtitle =>
      'ग्राहकों के लिए भाव। बदलने तक स्टॉक या खातों पर कोई असर नहीं।';

  @override
  String get salesQuotationsNew => 'नया कोटेशन';

  @override
  String get salesQuotationsSave => 'कोटेशन सहेजें';

  @override
  String get salesQuotationsValidUntil => 'कब तक मान्य';

  @override
  String get salesQuotationsToOrder => 'ऑर्डर बनाएँ';

  @override
  String get salesQuotationsToInvoice => 'इनवॉइस बनाएँ';

  @override
  String get salesQuotationsAccept => 'स्वीकृत करें';

  @override
  String get salesQuotationsDecline => 'अस्वीकृत करें';

  @override
  String get salesQuotationsPrint => 'प्रिंट / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'ऑर्डर',
      'other': 'इनवॉइस',
    });
    return '$_temp0 में बदला गया';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'कोटेशन $number से';
  }

  @override
  String get salesQuotationsTerms => 'शर्तें';

  @override
  String get salesProformasTitle => 'प्रोफ़ॉर्मा इनवॉइस';

  @override
  String get salesProformasSubtitle =>
      'माल भेजने से पहले भुगतान या अग्रिम माँगें। इनवॉइस तक टैक्स या स्टॉक पर असर नहीं।';

  @override
  String get salesProformasNew => 'नया प्रोफ़ॉर्मा इनवॉइस';

  @override
  String get salesProformasSave => 'प्रोफ़ॉर्मा सहेजें';

  @override
  String get salesProformasAdvanceDue => 'माँगा गया अग्रिम';

  @override
  String get salesProformasAdvanceHint => 'पूरी राशि माँगने के लिए खाली छोड़ें';

  @override
  String get salesApprovalsTitle => 'अप्रूवल पर माल';

  @override
  String get salesApprovalsSubtitle =>
      'जिन अप्रूवल मेमो का माल अभी ग्राहक के पास है। न बिका माल वापस लें; बाकी का छह महीने में इनवॉइस बनाएँ।';

  @override
  String salesApprovalsSummary(num count, String value) {
    return '$count मेमो खुले, मूल्य $value';
  }

  @override
  String get salesApprovalsDaysOut => 'बाहर दिन';

  @override
  String salesApprovalsDaysLeft(num days) {
    return '$days दिन बाकी';
  }

  @override
  String get salesApprovalsEmpty => 'अप्रूवल पर कोई माल बाहर नहीं।';

  @override
  String get salesOverrideCredit => 'अनुमति देकर सहेजें';

  @override
  String get salesSamplesTitle => 'बाहर गए सैंपल';

  @override
  String get salesSamplesSubtitle =>
      'पार्टियों को भेजे गए सैंपल जो अभी वापस नहीं आए। ये बिक्री नहीं हैं और इन पर कर नहीं लगता। जो न रखा जाए उसे वापस लें।';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count चालान',
      one: '$count चालान',
    );
    return '$_temp0 में $pieces नग अभी बाहर';
  }

  @override
  String get salesSamplesNew => 'नया सैंपल चालान';

  @override
  String get salesSamplesEmpty => 'कोई सैंपल बाहर नहीं है।';

  @override
  String get einvoiceTitle => 'ई-इनवॉइस';

  @override
  String get einvoiceStatusNotRequired => 'ज़रूरी नहीं';

  @override
  String get einvoiceStatusPending => 'आईआरएन बाकी';

  @override
  String get einvoiceStatusGenerated => 'आईआरएन बन गया';

  @override
  String get einvoiceStatusCancelled => 'आईआरएन रद्द';

  @override
  String get einvoiceStatusFailed => 'आईआरएन विफल';

  @override
  String get einvoiceGenerate => 'आईआरएन बनाएँ';

  @override
  String get einvoiceCancel => 'आईआरएन रद्द करें';

  @override
  String get einvoiceCancelHint =>
      'आईआरएन बनने के 24 घंटे के भीतर ही रद्द किया जा सकता है।';

  @override
  String get einvoiceReasons1 => 'डुप्लीकेट';

  @override
  String get einvoiceReasons2 => 'डेटा प्रविष्टि की गलती';

  @override
  String get einvoiceReasons3 => 'ऑर्डर रद्द';

  @override
  String get einvoiceReasons4 => 'अन्य';

  @override
  String get einvoiceRemark => 'टिप्पणी';

  @override
  String get einvoiceIrn => 'आईआरएन';

  @override
  String get einvoiceAckNo => 'पावती नं.';

  @override
  String get einvoiceAckDate => 'पावती तारीख';

  @override
  String get einvoiceSimulator =>
      'परीक्षण मोड: जीएसटी प्रदाता जुड़ने तक आईआरएन अंतर्निहित सिम्युलेटर से आते हैं।';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'ग्राहक का जीएसटीआईएन नहीं है; ई-इनवॉइस केवल पंजीकृत खरीदारों और निर्यात के लिए है।';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'इनवॉइस नंबर आईआरपी के लिए मान्य नहीं है।';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'ग्राहक और अपनी शाखा का मान्य पिन कोड जोड़ें।';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'ग्राहक और अपनी शाखा का पता जोड़ें।';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn =>
      'हर आइटम का एचएसएन कोड ज़रूरी है।';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch => 'योग मेल नहीं खाते।';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'पहले अपनी शाखा का जीएसटीआईएन जोड़ें।';

  @override
  String get einvoiceErrorsDuplicateIrn => 'आईआरपी में यह इनवॉइस पहले से है।';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'इस आईआरएन को रद्द करने के 24 घंटे बीत चुके हैं। इसके बजाय क्रेडिट नोट जारी करें।';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated => 'आईआरएन पहले ही बन चुका है।';

  @override
  String get einvoiceErrorsCancelEwbFirst => 'पहले ई-वे बिल रद्द करें।';

  @override
  String get ewbTitle => 'ई-वे बिल';

  @override
  String get ewbGenerate => 'ई-वे बिल बनाएँ';

  @override
  String get ewbVehicleNo => 'वाहन नं.';

  @override
  String get ewbDistance => 'दूरी (किमी)';

  @override
  String get ewbNumber => 'ईडब्ल्यूबी नं.';

  @override
  String get ewbValidUpto => 'कब तक मान्य';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'यह वाहन नंबर जैसा नहीं लगता (जैसे MH12AB1234)।';

  @override
  String get ewbErrorsInvalidDistance => 'दूरी किमी में डालें।';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'ई-वे बिल समाप्त होने से 8 घंटे पहले से 8 घंटे बाद तक ही बढ़ाया जा सकता है।';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'इस ई-वे बिल को रद्द करने के 24 घंटे बीत चुके हैं।';

  @override
  String get ewbErrorsEwbExpired =>
      'यह ई-वे बिल समाप्त हो गया है; इसकी वैधता बढ़ाएँ।';

  @override
  String get ewbErrorsNoActiveEwb => 'इस इनवॉइस पर कोई चालू ई-वे बिल नहीं है।';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'इस इनवॉइस पर एक ई-वे बिल पहले से चालू है।';

  @override
  String get ewbErrorsInvalidPincode => '6 अंकों का पिन कोड डालें।';

  @override
  String get ewbStatusActive => 'चालू';

  @override
  String get ewbStatusCancelled => 'रद्द';

  @override
  String get ewbChangeVehicle => 'वाहन बदलें';

  @override
  String get ewbExtend => 'वैधता बढ़ाएँ';

  @override
  String get ewbCancel => 'ई-वे बिल रद्द करें';

  @override
  String get ewbNewVehicle => 'नया वाहन नं.';

  @override
  String get ewbCurrentPlace => 'अभी का स्थान';

  @override
  String get ewbCurrentPincode => 'अभी का पिन कोड';

  @override
  String get ewbRemainingKm => 'बची दूरी (कि.मी.)';

  @override
  String get ewbReason => 'कारण';

  @override
  String get ewbRemark => 'टिप्पणी';

  @override
  String get ewbSave => 'सहेजें';

  @override
  String get ewbExtendHint =>
      'ई-वे बिल समाप्त होने से 8 घंटे पहले से 8 घंटे बाद तक ही बढ़ाया जा सकता है।';

  @override
  String get ewbCancelHint =>
      'बनने के 24 घंटे के भीतर, अगर माल चला न हो, तभी रद्द हो सकता है।';

  @override
  String ewbCancelledNote(String number) {
    return 'ई-वे बिल $number रद्द किया गया। आप नया बना सकते हैं।';
  }

  @override
  String get ewbVehicleReasons1 => 'वाहन खराब';

  @override
  String get ewbVehicleReasons2 => 'माल दूसरे वाहन में';

  @override
  String get ewbVehicleReasons3 => 'अन्य';

  @override
  String get ewbVehicleReasons4 => 'पहली बार';

  @override
  String get ewbExtendReasons1 => 'प्राकृतिक आपदा';

  @override
  String get ewbExtendReasons2 => 'कानून-व्यवस्था';

  @override
  String get ewbExtendReasons4 => 'माल दूसरे वाहन में';

  @override
  String get ewbExtendReasons5 => 'दुर्घटना';

  @override
  String get ewbExtendReasons99 => 'अन्य';

  @override
  String get ewbCancelReasons1 => 'दोहराव';

  @override
  String get ewbCancelReasons2 => 'ऑर्डर रद्द';

  @override
  String get ewbCancelReasons3 => 'एंट्री में गलती';

  @override
  String get ewbCancelReasons4 => 'अन्य';

  @override
  String get printTaxInvoice => 'कर बीजक (टैक्स इनवॉइस)';

  @override
  String get printCreditNote => 'क्रेडिट नोट';

  @override
  String get printOriginal => 'प्राप्तकर्ता के लिए मूल प्रति';

  @override
  String get printBillTo => 'बिल प्राप्तकर्ता';

  @override
  String get printShipTo => 'माल प्राप्तकर्ता';

  @override
  String get printInvoiceNo => 'इनवॉइस नं.';

  @override
  String get printInvoiceDate => 'इनवॉइस तारीख';

  @override
  String get printSno => 'क्र.';

  @override
  String get printHsn => 'एचएसएन/एसएसी';

  @override
  String get printTaxSummary => 'कर सारांश';

  @override
  String get printRate => 'दर';

  @override
  String get printAmountInWords => 'राशि शब्दों में';

  @override
  String get printBank => 'बैंक विवरण';

  @override
  String get printTerms => 'नियम और शर्तें';

  @override
  String printForCompany(String company) {
    return '$company के लिए';
  }

  @override
  String get printSignatory => 'अधिकृत हस्ताक्षरकर्ता';

  @override
  String get printComputerGenerated =>
      'यह कंप्यूटर द्वारा बनाया गया इनवॉइस है।';

  @override
  String get printReverseCharge => 'रिवर्स चार्ज पर देय कर';

  @override
  String get printExportLut =>
      'एलयूटी के तहत बिना आईजीएसटी भुगतान के निर्यात हेतु आपूर्ति';

  @override
  String get printQuotation => 'कोटेशन';

  @override
  String get printQuotationNo => 'कोटेशन नं.';

  @override
  String get printQuotationDate => 'कोटेशन तारीख';

  @override
  String get printQuotedTo => 'किसके लिए';

  @override
  String get printComputerGeneratedQuote =>
      'यह कंप्यूटर से बना कोटेशन है। भाव दिखाई गई तारीख तक मान्य हैं।';

  @override
  String get printProforma => 'प्रोफ़ॉर्मा इनवॉइस';

  @override
  String get printProformaNo => 'प्रोफ़ॉर्मा सं.';

  @override
  String get printProformaDate => 'प्रोफ़ॉर्मा तिथि';

  @override
  String get printComputerGeneratedProforma =>
      'यह प्रोफ़ॉर्मा इनवॉइस है, टैक्स इनवॉइस नहीं। आपूर्ति पर टैक्स इनवॉइस जारी होगा।';

  @override
  String get printDeliveryChallan => 'डिलीवरी चालान';

  @override
  String get printApprovalMemo => 'अप्रूवल मेमो';

  @override
  String get printCopyConsignee => 'मूल प्रति प्राप्तकर्ता के लिए';

  @override
  String get printCopyTransporter => 'दूसरी प्रति ट्रांसपोर्टर के लिए';

  @override
  String get printCopyConsignor => 'तीसरी प्रति प्रेषक के लिए';

  @override
  String get printConsignee => 'प्राप्तकर्ता';

  @override
  String get printChallanNo => 'चालान सं.';

  @override
  String get printChallanDate => 'चालान तिथि';

  @override
  String get printInvoiceBy => 'इनवॉइस की अंतिम तिथि';

  @override
  String get printValue => 'मूल्य';

  @override
  String get printNotASupply =>
      'माल आपूर्ति के अलावा किसी कारण से भेजा गया। इस चालान पर कोई टैक्स नहीं।';

  @override
  String get printReceivedBy => 'प्राप्तकर्ता';

  @override
  String get printSignatureAndDate => 'हस्ताक्षर और तिथि';

  @override
  String get outstandingReceivablesTitle => 'लेनदारी (प्राप्य)';

  @override
  String get outstandingReceivablesSubtitle =>
      'ग्राहकों पर आपका बकाया, अवधि के अनुसार। प्राप्तियाँ सबसे पुराने बिल पहले चुकाती हैं।';

  @override
  String get outstandingPayablesTitle => 'देनदारी (देय)';

  @override
  String get outstandingPayablesSubtitle =>
      'आपूर्तिकर्ताओं को आपका देय, अवधि के अनुसार। भुगतान सबसे पुराने बिल पहले चुकाते हैं।';

  @override
  String get outstandingParty => 'पार्टी';

  @override
  String get outstandingBalance => 'शेष';

  @override
  String get outstandingNotDue => 'अभी देय नहीं';

  @override
  String get outstandingD030 => '1-30 दिन';

  @override
  String get outstandingD3160 => '31-60 दिन';

  @override
  String get outstandingD6190 => '61-90 दिन';

  @override
  String get outstandingAdvance => 'अग्रिम';

  @override
  String get outstandingOpenItems => 'बकाया बिल';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days दिन देर',
      one: '$days दिन देर',
      zero: 'देय',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'कुछ भी बकाया नहीं।';

  @override
  String get outstandingD91180 => '91 से 180 दिन';

  @override
  String get outstandingD180plus => '180 दिन से अधिक';

  @override
  String get returnsTitle => 'जीएसटी रिटर्न';

  @override
  String get returnsSubtitle =>
      'आपके इनवॉइस और बिलों से GSTR-1 और GSTR-3B। यहीं दाखिल करें, या GST पोर्टल के ऑफ़लाइन टूल के लिए JSON डाउनलोड करें।';

  @override
  String get returnsPeriod => 'कर अवधि';

  @override
  String get returnsGstr1 => 'जीएसटीआर-1';

  @override
  String get returnsGstr3b => 'जीएसटीआर-3बी';

  @override
  String get returnsDownload => 'JSON डाउनलोड करें';

  @override
  String get returnsSection => 'खंड';

  @override
  String get returnsCount => 'इनवॉइस';

  @override
  String get returnsTaxable => 'कर योग्य मूल्य';

  @override
  String get returnsTax => 'कर';

  @override
  String get returnsB2b => 'बी2बी: पंजीकृत ग्राहक';

  @override
  String get returnsB2cl => 'बी2सी बड़े: दूसरे राज्य, ₹1 लाख से अधिक';

  @override
  String get returnsB2cs => 'बी2सी छोटे';

  @override
  String get returnsExp => 'निर्यात';

  @override
  String get returnsCdn => 'क्रेडिट नोट';

  @override
  String get returnsCancelled => 'रद्द इनवॉइस (दस्तावेज़ सारांश में)';

  @override
  String get returnsOutward => '3.1(क) कर योग्य बाहरी आपूर्ति';

  @override
  String get returnsZeroRated => '3.1(ख) शून्य दर (निर्यात, एसईज़ेड)';

  @override
  String get returnsNil => '3.1(ग) शून्य / छूट प्राप्त';

  @override
  String get returnsRcm => '3.1(घ) रिवर्स चार्ज पर आवक आपूर्ति';

  @override
  String get returnsItc => '4. इनपुट टैक्स क्रेडिट';

  @override
  String get returnsSetOff => '6.1 कर का भुगतान';

  @override
  String get returnsHead => 'कर मद';

  @override
  String get returnsLiability => 'देय कर';

  @override
  String get returnsPaidByCredit => 'क्रेडिट से भुगतान';

  @override
  String get returnsCash => 'नकद भुगतान';

  @override
  String get returnsCarryForward => 'आगे ले जाया गया क्रेडिट';

  @override
  String get returnsFilingNote =>
      'दाखिला आपके GST प्रदाता के ज़रिए होता है। प्रदाता जुड़ने तक टेस्ट मोड में बिल्ट-इन सिम्युलेटर चलता है।';

  @override
  String get gstSettingsTitle => 'जीएसटी और इनवॉइस';

  @override
  String get gstSettingsEinvoice => 'ई-इनवॉइस (आईआरएन) बनाएँ';

  @override
  String get gstSettingsEinvoiceHint =>
      '2017-18 से किसी भी वर्ष में टर्नओवर ₹5 करोड़ से अधिक होने पर अनिवार्य।';

  @override
  String get gstSettingsEwbThreshold => 'इससे अधिक पर ई-वे बिल ज़रूरी (₹)';

  @override
  String get gstSettingsBilingual =>
      'बीजक, वेतन पर्ची और फ़ॉर्म 16 दो भाषाओं में छापें';

  @override
  String get gstSettingsPrintLanguage => 'छपाई की दूसरी भाषा';

  @override
  String get gstSettingsTerms => 'इनवॉइस के नियम और शर्तें';

  @override
  String get gstSettingsBank => 'इनवॉइस पर बैंक विवरण';

  @override
  String get importTitle => 'डेटा आयात';

  @override
  String get importSubtitle =>
      'ग्राहक, आपूर्तिकर्ता और आइटम स्प्रेडशीट या टैली से लाएँ।';

  @override
  String get importParties => 'ग्राहक और आपूर्तिकर्ता (CSV)';

  @override
  String get importItems => 'आइटम (CSV)';

  @override
  String get importTally => 'टैली XML';

  @override
  String get importTemplate => 'नमूना CSV डाउनलोड करें';

  @override
  String get importTallyHint =>
      'टैली में: Display → List of Accounts → Alt+E (Export), फ़ॉर्मेट XML। स्टॉक आइटम भी शामिल करें।';

  @override
  String get importChoose => 'फ़ाइल चुनें';

  @override
  String get importPreview => 'फ़ाइल जाँचें';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count पंक्तियाँ',
      one: '$count पंक्ति',
    );
    return '$_temp0 आयात करें';
  }

  @override
  String get importRow => 'पंक्ति';

  @override
  String get importStatus => 'परिणाम';

  @override
  String get importCreate => 'बनाई जाएगी';

  @override
  String get importExists => 'पहले से है: छोड़ी गई';

  @override
  String get importDone => 'आयात हो गया।';

  @override
  String get filingTitle => 'GST पोर्टल पर दाखिल करें';

  @override
  String get filingPortal => 'GST पोर्टल कनेक्शन';

  @override
  String get filingPortalHint =>
      'पहले अपनी GST पोर्टल प्रोफ़ाइल में “API access” चालू करें। सत्र लगभग 6 घंटे चलता है।';

  @override
  String get filingUsername => 'GST पोर्टल यूज़रनेम';

  @override
  String get filingSendOtp => 'OTP भेजें';

  @override
  String get filingOtp => 'OTP';

  @override
  String get filingConnect => 'जोड़ें';

  @override
  String filingConnected(String username, String time) {
    return '$username के रूप में $time तक जुड़ा';
  }

  @override
  String get filingDisconnect => 'कनेक्शन हटाएँ';

  @override
  String filingSimulatorOtp(String otp) {
    return 'टेस्ट मोड: OTP $otp है।';
  }

  @override
  String get filingUpload => 'अपलोड करें';

  @override
  String get filingUploadAgain => 'फिर से अपलोड करें';

  @override
  String filingUploaded(String time) {
    return '$time को अपलोड हुआ';
  }

  @override
  String get filingGetOtp => 'EVC OTP भेजें';

  @override
  String get filingEvcHint =>
      'OTP आपके अधिकृत हस्ताक्षरकर्ता के मोबाइल पर जाएगा।';

  @override
  String get filingFile => 'EVC से दाखिल करें';

  @override
  String filingFiled(String time) {
    return '$time को दाखिल हुआ';
  }

  @override
  String get filingArn => 'ARN';

  @override
  String get filingNotUploaded => 'अपलोड नहीं हुआ';

  @override
  String get filingLocked =>
      'किसी महीने का GSTR-1 दाखिल होने के बाद उसके इनवॉइस और क्रेडिट नोट लॉक हो जाते हैं।';

  @override
  String filingCashNote(String amount) {
    return 'दाखिल करने से पहले अपने इलेक्ट्रॉनिक कैश लेजर में $amount रखें (GST पोर्टल पर चालान से)।';
  }

  @override
  String get filingErrorsGstSessionRequired => 'पहले GST पोर्टल से जुड़ें।';

  @override
  String get filingErrorsGstSessionExpired =>
      'GST पोर्टल सत्र समाप्त हो गया। फिर से जुड़ें।';

  @override
  String get filingErrorsInvalidOtp => 'यह OTP सही नहीं है।';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'अपना GST पोर्टल यूज़रनेम डालें।';

  @override
  String get filingErrorsUploadFirst => 'पहले रिटर्न अपलोड करें।';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'अपलोड के बाद आपके खाते बदल गए। फिर से अपलोड करें, फिर दाखिल करें।';

  @override
  String get filingErrorsReturnAlreadyFiled =>
      'यह रिटर्न पहले ही दाखिल हो चुका है।';

  @override
  String get filingErrorsCompanyPanRequired =>
      'कंपनी और शाखाएँ में अपने व्यवसाय का PAN जोड़ें।';

  @override
  String get filingErrorsInvalidPan => 'व्यवसाय का PAN सही नहीं है।';

  @override
  String get filingErrorsBranchGstinRequired =>
      'पहले अपने मुख्य कार्यालय का GSTIN जोड़ें।';

  @override
  String get hrEmployeesTitle => 'कर्मचारी';

  @override
  String get hrEmployeesSubtitle => 'आपकी टीम, उनका वेतन और वैधानिक विवरण।';

  @override
  String get hrEmployeesNew => 'कर्मचारी जोड़ें';

  @override
  String get hrEmployeesNone => 'अभी कोई कर्मचारी नहीं।';

  @override
  String get hrSectionsPersonal => 'निजी';

  @override
  String get hrSectionsJob => 'नौकरी';

  @override
  String get hrSectionsStatutory => 'पीएफ, ईएसआई और कर';

  @override
  String get hrSectionsBank => 'वेतन भुगतान';

  @override
  String get hrSectionsSalary => 'वेतन संरचना';

  @override
  String get hrCode => 'कर्मचारी कोड';

  @override
  String get hrCodeHint => 'अपने आप नंबर के लिए खाली छोड़ें';

  @override
  String get hrName => 'पूरा नाम';

  @override
  String get hrNameHi => 'हिंदी में नाम (वैकल्पिक)';

  @override
  String get hrGender => 'लिंग';

  @override
  String get hrGendersMale => 'पुरुष';

  @override
  String get hrGendersFemale => 'महिला';

  @override
  String get hrGendersOther => 'अन्य';

  @override
  String get hrDob => 'जन्म तिथि';

  @override
  String get hrJoinedOn => 'कार्यभार की तारीख';

  @override
  String get hrLeftOn => 'छोड़ने की तारीख';

  @override
  String get hrFixedTerm => 'निश्चित अवधि कर्मचारी';

  @override
  String get hrDepartment => 'विभाग';

  @override
  String get hrDesignation => 'पद';

  @override
  String get hrWorkState => 'कार्य राज्य';

  @override
  String get hrWorkStateHint => 'व्यवसाय कर इसी से तय होता है';

  @override
  String get hrPhone => 'मोबाइल';

  @override
  String get hrEmail => 'ईमेल';

  @override
  String get hrAddress => 'पता';

  @override
  String get hrCity => 'शहर';

  @override
  String get hrPincode => 'पिन कोड';

  @override
  String get hrPan => 'पैन';

  @override
  String get hrAadhaarLast4 => 'आधार (केवल अंतिम 4 अंक)';

  @override
  String get hrUan => 'यूएएन';

  @override
  String get hrEsiNumber => 'ईएसआई आईपी नंबर';

  @override
  String get hrPfMember => 'पीएफ सदस्य';

  @override
  String get hrEpsEligible => 'पेंशन योजना (ईपीएस) में';

  @override
  String get hrPfOnActual => 'पूरे वेतन पर पीएफ (₹15,000 से ऊपर)';

  @override
  String get hrDisabled => 'दिव्यांग (ईएसआई ₹25,000 तक)';

  @override
  String get hrTaxRegime => 'कर व्यवस्था';

  @override
  String get hrRegimesNew => 'नई व्यवस्था';

  @override
  String get hrRegimesOld => 'पुरानी व्यवस्था';

  @override
  String get hrMetro => 'महानगर में रहते हैं (एचआरए के लिए)';

  @override
  String get hrPaymentMode => 'भुगतान का तरीका';

  @override
  String get hrPaymentModesBank => 'बैंक ट्रांसफ़र';

  @override
  String get hrPaymentModesCash => 'नकद';

  @override
  String get hrPaymentModesCheque => 'चेक';

  @override
  String get hrBankName => 'बैंक';

  @override
  String get hrBankIfsc => 'आईएफ़एससी';

  @override
  String get hrBankAccount => 'खाता नंबर';

  @override
  String hrBankAccountHint(String last4) {
    return 'एन्क्रिप्ट करके रखा गया। दर्ज खाता: अंत में $last4';
  }

  @override
  String get hrMonthlyGross => 'मासिक सकल';

  @override
  String get hrStatus => 'स्थिति';

  @override
  String get hrStatusesActive => 'सक्रिय';

  @override
  String get hrStatusesLeft => 'छोड़ चुके';

  @override
  String get hrSave => 'सहेजें';

  @override
  String get hrSaved => 'सहेजा गया';

  @override
  String get hrCreate => 'कर्मचारी जोड़ें';

  @override
  String get hrSalaryTitle => 'वेतन संरचना';

  @override
  String get hrSalaryEffectiveFrom => 'कब से लागू';

  @override
  String get hrSalaryComponent => 'घटक';

  @override
  String get hrSalaryMonthly => 'मासिक (₹)';

  @override
  String get hrSalaryPfWage => 'मूल/डीए (पीएफ वेतन)';

  @override
  String get hrSalaryHra => 'एचआरए';

  @override
  String get hrSalaryEsiExcluded => 'ईएसआई वेतन नहीं';

  @override
  String get hrSalaryAdd => 'घटक जोड़ें';

  @override
  String get hrSalaryRevise => 'संशोधन सहेजें';

  @override
  String get hrSalaryHistory => 'पुरानी संरचनाएँ';

  @override
  String get hrSalaryGross => 'मासिक सकल';

  @override
  String get hrSalaryAnnual => 'वार्षिक';

  @override
  String get hrSalaryDefaultsBasic => 'मूल वेतन';

  @override
  String get hrSalaryDefaultsHra => 'एचआरए';

  @override
  String get hrSalaryDefaultsSpecial => 'विशेष भत्ता';

  @override
  String get hrDeclarationTitle => 'कर घोषणा';

  @override
  String get hrDeclarationHint =>
      'टीडीएस के लिए। मानक कटौती के अलावा अन्य कटौतियाँ केवल पुरानी व्यवस्था में लागू होती हैं।';

  @override
  String get hrDeclarationFy => 'वित्त वर्ष';

  @override
  String get hrDeclarationRentPaid => 'साल में दिया किराया';

  @override
  String get hrDeclarationC80 => '80C निवेश (पीएफ अपने आप जुड़ता है)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) एनपीएस';

  @override
  String get hrDeclarationD80 => '80D स्वास्थ्य बीमा';

  @override
  String get hrDeclarationHomeLoanInterest => 'गृह ऋण ब्याज';

  @override
  String get hrDeclarationOtherDeductions => 'अन्य कटौतियाँ (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'अन्य आय';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'इस साल पिछले नियोक्ता से वेतन';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'इस साल पहले कटा टीडीएस (पिछला नियोक्ता, या Varchasv से पहले)';

  @override
  String get hrDeclarationSave => 'घोषणा सहेजें';

  @override
  String get hrAttendanceTitle => 'हाज़िरी';

  @override
  String get hrAttendanceSubtitle =>
      'बिना निशान वाले कार्य दिवस उपस्थित गिने जाते हैं। किसी दिन पर क्लिक करें: अनुपस्थित, फिर आधा दिन, फिर उपस्थित।';

  @override
  String get hrAttendanceLegendPresent => 'उपस्थित';

  @override
  String get hrAttendanceLegendAbsent => 'अनुपस्थित';

  @override
  String get hrAttendanceLegendHalfDay => 'आधा दिन';

  @override
  String get hrAttendanceLegendLeave => 'छुट्टी पर';

  @override
  String get hrAttendanceLegendWeekOff => 'साप्ताहिक अवकाश';

  @override
  String get hrAttendanceLegendHoliday => 'छुट्टी का दिन';

  @override
  String get hrAttendanceLegendLate => 'देर से';

  @override
  String get hrAttendanceLop => 'वेतन कटौती';

  @override
  String get hrAttendanceLocked =>
      'इस महीने का वेतन अंतिम हो चुका है, इसलिए हाज़िरी नहीं बदल सकती।';

  @override
  String get hrAttendanceHolidays => 'छुट्टियाँ';

  @override
  String get hrAttendanceAddHoliday => 'छुट्टी जोड़ें';

  @override
  String get hrAttendanceHolidayName => 'छुट्टी';

  @override
  String get hrAttendanceNoEmployees => 'इस महीने कोई कर्मचारी नहीं था।';

  @override
  String get hrAttendanceSaving => 'सहेज रहे हैं…';

  @override
  String get hrLeaveTitle => 'छुट्टी';

  @override
  String get hrLeaveSubtitle => 'आवेदन, मंज़ूरी और शेष छुट्टी।';

  @override
  String get hrLeaveNew => 'छुट्टी का आवेदन';

  @override
  String get hrLeaveEmployee => 'कर्मचारी';

  @override
  String get hrLeaveType => 'छुट्टी का प्रकार';

  @override
  String get hrLeaveFrom => 'से';

  @override
  String get hrLeaveTo => 'तक';

  @override
  String get hrLeaveHalfDay => 'आधा दिन';

  @override
  String get hrLeaveReason => 'कारण';

  @override
  String get hrLeaveDays => 'दिन';

  @override
  String get hrLeaveSubmit => 'आवेदन भेजें';

  @override
  String get hrLeaveApprove => 'मंज़ूर करें';

  @override
  String get hrLeaveReject => 'अस्वीकार करें';

  @override
  String get hrLeaveCancel => 'रद्द करें';

  @override
  String get hrLeavePending => 'मंज़ूरी बाकी';

  @override
  String get hrLeaveAll => 'सभी आवेदन';

  @override
  String get hrLeaveBalances => 'शेष छुट्टी';

  @override
  String get hrLeaveOpening => 'पिछले साल से';

  @override
  String get hrLeaveQuota => 'इस साल';

  @override
  String get hrLeaveTaken => 'ली गई';

  @override
  String get hrLeaveBalance => 'शेष';

  @override
  String get hrLeaveNone => 'कोई छुट्टी आवेदन नहीं।';

  @override
  String get hrLeaveStatusesPending => 'लंबित';

  @override
  String get hrLeaveStatusesApproved => 'मंज़ूर';

  @override
  String get hrLeaveStatusesRejected => 'अस्वीकृत';

  @override
  String get hrLeaveStatusesCancelled => 'रद्द';

  @override
  String get hrSettleTitle => 'पूर्ण और अंतिम निपटान';

  @override
  String get hrSettleHint =>
      'कर्मचारी को छोड़ चुका दर्ज करता है और ग्रेच्युटी व अवकाश नकदीकरण देता है। अंतिम महीने का वेतन पेरोल से आता है।';

  @override
  String get hrSettleLeftOn => 'अंतिम कार्य दिवस';

  @override
  String get hrSettleServiceYears => 'सेवा (वर्ष)';

  @override
  String get hrSettleGratuity => 'ग्रेच्युटी';

  @override
  String get hrSettleNotEligible => 'देय नहीं (5 वर्ष से कम)';

  @override
  String get hrSettleLeaveDays => 'नकदीकरण हेतु छुट्टी (दिन)';

  @override
  String get hrSettleEncashment => 'अवकाश नकदीकरण';

  @override
  String get hrSettleOtherEarnings => 'अन्य देय (बोनस, नोटिस वेतन)';

  @override
  String get hrSettleRecoveries => 'वसूली (अग्रिम)';

  @override
  String get hrSettleRemarks => 'टिप्पणी';

  @override
  String get hrSettleTotal => 'कुल देय';

  @override
  String get hrSettleConfirm => 'निपटान करें और छोड़ चुका दर्ज करें';

  @override
  String hrSettleDone(String date, String amount) {
    return '$date को निपटान: $amount';
  }

  @override
  String get hrPayslips => 'वेतन पर्चियाँ';

  @override
  String get hrErrorsInvalidPan => 'यह पैन सही नहीं है (जैसे ABCDE1234F)।';

  @override
  String get hrErrorsInvalidIfsc =>
      'यह आईएफ़एससी सही नहीं है (जैसे HDFC0001234)।';

  @override
  String get hrErrorsInvalidBankAccount => '6 से 18 अंक डालें।';

  @override
  String get hrErrorsBasicRequired =>
      'कम से कम एक घटक को मूल/डीए चिह्नित करें।';

  @override
  String get hrErrorsNoComponents => 'कम से कम एक वेतन घटक जोड़ें।';

  @override
  String get hrErrorsDuplicateComponent => 'दो घटकों का कोड एक जैसा है।';

  @override
  String get hrErrorsEmployeeCodeTaken => 'यह कोड किसी और कर्मचारी का है।';

  @override
  String get hrErrorsDobAfterJoining =>
      'जन्म तिथि कार्यभार से पहले होनी चाहिए।';

  @override
  String get hrErrorsBeforeJoining => 'यह कार्यभार की तारीख से पहले है।';

  @override
  String get hrErrorsLeaveOverlap => 'यह किसी दूसरे छुट्टी आवेदन से टकराता है।';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'पर्याप्त छुट्टी शेष नहीं है।';

  @override
  String get hrErrorsNoWorkingDays =>
      'ये सभी तारीखें छुट्टी या साप्ताहिक अवकाश हैं।';

  @override
  String get hrErrorsHalfDaySingleDate =>
      'आधा दिन केवल एक तारीख का हो सकता है।';

  @override
  String get hrErrorsLeaveCrossesYear =>
      '31 मार्च के पार जाने वाली छुट्टी को दो भागों में बाँटें।';

  @override
  String get hrErrorsNotEmployedOnDate => 'उस तारीख को नौकरी में नहीं थे।';

  @override
  String get hrErrorsDayOnLeave =>
      'उस दिन मंज़ूर छुट्टी है; पहले छुट्टी रद्द करें।';

  @override
  String get hrErrorsPayrollFinalized =>
      'उस महीने का वेतन पहले ही अंतिम हो चुका है।';

  @override
  String get hrErrorsLeaveNotPending => 'इस आवेदन पर निर्णय हो चुका है।';

  @override
  String get hrErrorsLeaveNotOpen => 'यह आवेदन पहले ही बंद है।';

  @override
  String get hrErrorsLeftBeforeJoining => 'यह कार्यभार की तारीख से पहले है।';

  @override
  String get hrErrorsNoSalaryStructure => 'पहले वेतन संरचना जोड़ें।';

  @override
  String get hrErrorsAlreadyLeft => 'इस कर्मचारी का निपटान हो चुका है।';

  @override
  String get hrErrorsRecoveriesExceedDues => 'वसूली देय से अधिक नहीं हो सकती।';

  @override
  String get hrErrorsInvalidUan => 'यूएएन 12 अंकों का होता है।';

  @override
  String get hrErrorsInvalidEsiNumber =>
      'ईएसआई आईपी नंबर 10 से 17 अंकों का होता है।';

  @override
  String get hrErrorsInvalidAadhaarLast4 => 'केवल अंतिम 4 अंक डालें।';

  @override
  String get hrErrorsInvalidPhone => '10 अंकों का मोबाइल नंबर डालें।';

  @override
  String get hrErrorsToBeforeFrom => '“तक” “से” से पहले नहीं हो सकता।';

  @override
  String get hrErrorsUnknownLeaveType => 'छुट्टी का प्रकार चुनें।';

  @override
  String get hrErrorsUnknownEmployee => 'कर्मचारी चुनें।';

  @override
  String get hrErrorsLoanNotActive =>
      'यह ऋण पूरा चुकाया जा चुका है या रद्द है।';

  @override
  String get hrErrorsOverRecovery => 'यह रकम ऋण पर बाकी रकम से ज़्यादा है।';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'चुकौती की तारीख ऋण देने की तारीख से पहले है।';

  @override
  String get hrErrorsExpiryBeforeIssue => 'समाप्ति तिथि जारी तिथि से पहले है।';

  @override
  String get hrLoansTitle => 'अग्रिम और ऋण';

  @override
  String get hrLoansNew => 'अग्रिम या ऋण दें';

  @override
  String get hrLoansKind => 'प्रकार';

  @override
  String get hrLoansKindsAdvance => 'वेतन अग्रिम';

  @override
  String get hrLoansKindsLoan => 'ऋण';

  @override
  String get hrLoansDate => 'भुगतान तारीख';

  @override
  String get hrLoansAmount => 'राशि';

  @override
  String get hrLoansInstalment => 'मासिक किस्त';

  @override
  String get hrLoansStartPeriod => 'वसूली कब से';

  @override
  String get hrLoansPaidFrom => 'किस खाते से';

  @override
  String get hrLoansRemarks => 'टिप्पणी';

  @override
  String get hrLoansRecovered => 'वसूला';

  @override
  String get hrLoansBalance => 'शेष';

  @override
  String get hrLoansStatusesActive => 'वसूली जारी';

  @override
  String get hrLoansStatusesClosed => 'वसूल हो गया';

  @override
  String get hrLoansStatusesCancelled => 'रद्द';

  @override
  String get hrLoansNone => 'कोई अग्रिम या ऋण नहीं।';

  @override
  String get hrLoansCreate => 'भुगतान करें';

  @override
  String get hrLoansCancel => 'रद्द करें';

  @override
  String get hrLoansReceive => 'चुकौती लें';

  @override
  String get hrLoansReceiveAmount => 'प्राप्त रकम';

  @override
  String get hrLoansReceivedInto => 'किस खाते में मिला';

  @override
  String get hrLoansReceiveSave => 'चुकौती सहेजें';

  @override
  String get hrShiftsTitle => 'शिफ़्ट';

  @override
  String get hrShiftsName => 'शिफ़्ट';

  @override
  String get hrShiftsStart => 'शुरू';

  @override
  String get hrShiftsEnd => 'समाप्त';

  @override
  String get hrShiftsGrace => 'छूट (मिनट)';

  @override
  String get hrShiftsFullDay => 'पूरा दिन (मिनट)';

  @override
  String get hrShiftsHalfDay => 'आधा दिन (मिनट)';

  @override
  String get hrShiftsIsDefault => 'डिफ़ॉल्ट';

  @override
  String get hrShiftsAdd => 'शिफ़्ट जोड़ें';

  @override
  String get hrShiftsSave => 'सहेजें';

  @override
  String get hrShiftsNone =>
      'अभी कोई शिफ़्ट नहीं। पंच 09:30–18:30 के हिसाब से पढ़े जाते हैं।';

  @override
  String get hrShiftsShift => 'शिफ़्ट';

  @override
  String get hrShiftsNoShift => 'कंपनी डिफ़ॉल्ट';

  @override
  String get hrPunchesTitle => 'पंच आयात करें';

  @override
  String get hrPunchesHint =>
      'बायोमेट्रिक मशीन की CSV, कॉलम: code, date (YYYY-MM-DD), in, out (24 घंटे HH:MM)। हर दिन कर्मचारी की शिफ़्ट के हिसाब से पढ़ा जाता है।';

  @override
  String get hrPunchesTemplate => 'नमूना CSV डाउनलोड करें';

  @override
  String get hrPunchesChoose => 'CSV फ़ाइल चुनें';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count दिन',
      one: '$count दिन',
    );
    return '$_temp0 आयात करें';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count दिन',
      one: '$count दिन',
    );
    return '$_temp0 आयात हुए।';
  }

  @override
  String get hrPunchesRow => 'पंक्ति';

  @override
  String get hrPunchesCode => 'कोड';

  @override
  String get hrPunchesDate => 'तारीख';

  @override
  String get hrPunchesWorked => 'काम किया';

  @override
  String get hrPunchesStatus => 'परिणाम';

  @override
  String get hrPunchesLate => 'देर से';

  @override
  String get hrDocumentsTitle => 'दस्तावेज़ और केवाईसी';

  @override
  String get hrDocumentsHelp =>
      'पहचान और अनुपालन के दस्तावेज़। नंबर के केवल अंतिम चार अक्षर दिखते हैं। समाप्ति तिथि जोड़ें ताकि खत्म होने से पहले याद दिलाया जाए।';

  @override
  String get hrDocumentsNone => 'अभी कोई दस्तावेज़ दर्ज नहीं।';

  @override
  String hrDocumentsExpires(String date) {
    return '$date को समाप्त';
  }

  @override
  String get hrDocumentsNoExpiry => 'कोई समाप्ति नहीं';

  @override
  String get hrDocumentsExpired => 'समाप्त';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिन शेष',
      one: '$n दिन शेष',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'हटाएँ';

  @override
  String get hrDocumentsKind => 'दस्तावेज़';

  @override
  String get hrDocumentsNumber => 'नंबर';

  @override
  String get hrDocumentsIssuedOn => 'जारी तिथि';

  @override
  String get hrDocumentsExpiresOnLabel => 'समाप्ति तिथि';

  @override
  String get hrDocumentsAdd => 'दस्तावेज़ जोड़ें';

  @override
  String get hrDocumentsKindsAadhaar => 'आधार';

  @override
  String get hrDocumentsKindsPan => 'पैन';

  @override
  String get hrDocumentsKindsPassport => 'पासपोर्ट';

  @override
  String get hrDocumentsKindsDrivingLicence => 'ड्राइविंग लाइसेंस';

  @override
  String get hrDocumentsKindsVoterId => 'मतदाता पहचान पत्र';

  @override
  String get hrDocumentsKindsBankProof => 'बैंक प्रमाण';

  @override
  String get hrDocumentsKindsPoliceVerification => 'पुलिस सत्यापन';

  @override
  String get hrDocumentsKindsMedicalFitness => 'चिकित्सा फिटनेस';

  @override
  String get hrDocumentsKindsContract => 'अनुबंध';

  @override
  String get hrDocumentsKindsOther => 'अन्य';

  @override
  String get hrDocumentsExpiringTitle => 'समाप्त हो रहे दस्तावेज़';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'कार्यरत कर्मचारियों के दस्तावेज़ जो खत्म हो चुके हैं या जल्द खत्म होंगे, सबसे पहले वाले ऊपर।';

  @override
  String get hrDocumentsWithin => 'इतने समय में समाप्त';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिन',
      one: '$n दिन',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'दिखाएँ';

  @override
  String get hrDocumentsEmployee => 'कर्मचारी';

  @override
  String get hrDocumentsNoneExpiring => 'इस अवधि में कुछ समाप्त नहीं हो रहा।';

  @override
  String get payrollTitle => 'वेतन';

  @override
  String get payrollSubtitle =>
      'पीएफ, ईएसआई, व्यवसाय कर और टीडीएस सहित मासिक वेतन, आपकी बहियों में दर्ज।';

  @override
  String get payrollRun => 'वेतन बनाएँ';

  @override
  String get payrollMonth => 'महीना';

  @override
  String get payrollNone => 'अभी कोई वेतन रन नहीं।';

  @override
  String payrollEmployees(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count कर्मचारी',
      one: '$count कर्मचारी',
    );
    return '$_temp0';
  }

  @override
  String get payrollStatusesDraft => 'ड्राफ़्ट';

  @override
  String get payrollStatusesFinalized => 'अंतिम';

  @override
  String get payrollStatusesPaid => 'भुगतान हुआ';

  @override
  String get payrollStatusesCancelled => 'रद्द';

  @override
  String get payrollColsEmployee => 'कर्मचारी';

  @override
  String get payrollColsPaidDays => 'वेतन दिवस';

  @override
  String get payrollColsLop => 'कटौती दिवस';

  @override
  String get payrollColsGross => 'सकल';

  @override
  String get payrollColsPf => 'पीएफ';

  @override
  String get payrollColsEsi => 'ईएसआई';

  @override
  String get payrollColsPt => 'व्य. कर';

  @override
  String get payrollColsLwf => 'एलडब्ल्यूएफ';

  @override
  String get payrollColsTds => 'टीडीएस';

  @override
  String get payrollColsOther => 'अन्य';

  @override
  String get payrollColsNet => 'शुद्ध वेतन';

  @override
  String get payrollRefresh => 'हाज़िरी से फिर गणना करें';

  @override
  String get payrollFinalize => 'अंतिम करें और दर्ज करें';

  @override
  String get payrollFinalizeHint =>
      'वेतन, देय पीएफ, ईएसआई, व्यवसाय कर और टीडीएस आपकी बहियों में दर्ज होते हैं। फिर उस महीने की हाज़िरी लॉक हो जाती है।';

  @override
  String get payrollPay => 'भुगतान दर्ज करें';

  @override
  String get payrollPayFrom => 'किस खाते से';

  @override
  String get payrollPayDate => 'भुगतान तारीख';

  @override
  String get payrollCancel => 'रन रद्द करें';

  @override
  String get payrollFilesTitle => 'दाखिले और भुगतान की फ़ाइलें';

  @override
  String get payrollFilesEcr => 'ईपीएफ ईसीआर';

  @override
  String get payrollFilesEsi => 'ईएसआई अंशदान';

  @override
  String get payrollFilesBank => 'बैंक ट्रांसफ़र';

  @override
  String payrollFilesMissing(String codes) {
    return 'छूटे (विवरण नहीं): $codes';
  }

  @override
  String get payrollTotalsGross => 'सकल वेतन';

  @override
  String get payrollTotalsDeductions => 'कटौतियाँ';

  @override
  String get payrollTotalsNet => 'शुद्ध वेतन';

  @override
  String get payrollTotalsEmployer => 'नियोक्ता पीएफ/ईएसआई/एलडब्ल्यूएफ';

  @override
  String get payrollLopEdited => 'हाथ से भरा';

  @override
  String get payrollLopReset => 'हाज़िरी से लें';

  @override
  String get payrollAddDeduction => 'कटौती जोड़ें';

  @override
  String get payrollDeductionName => 'कटौती';

  @override
  String get payrollDeductionAmount => 'राशि';

  @override
  String get payrollEdit => 'बदलें';

  @override
  String get payrollView => 'वेतन पर्ची';

  @override
  String get payrollErrorsRunExists => 'उस महीने का वेतन पहले से बना है।';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'पहले पिछले महीने का ड्राफ़्ट अंतिम या रद्द करें।';

  @override
  String get payrollErrorsRunNotDraft => 'केवल ड्राफ़्ट बदला जा सकता है।';

  @override
  String get payrollErrorsRunEmpty => 'अंतिम करने के लिए कोई वेतन पर्ची नहीं।';

  @override
  String get payrollErrorsRunNotFinalized => 'पहले रन अंतिम करें।';

  @override
  String get payrollErrorsRunPaid => 'भुगतान हुआ रन रद्द नहीं हो सकता।';

  @override
  String get payrollErrorsLaterRunFinal =>
      'बाद का महीना अंतिम हो चुका है; पहले उसे रद्द करें।';

  @override
  String get payrollErrorsLopExceedsDays =>
      'कटौती दिवस महीने के दिनों से अधिक हैं।';

  @override
  String get payrollErrorsDeductionsExceedPay => 'कटौतियाँ वेतन से अधिक हैं।';

  @override
  String get payrollErrorsInvalidPeriod => 'महीना चुनें।';

  @override
  String get payrollErrorsInvalidSettings => 'सेटिंग जाँचें।';

  @override
  String get payrollErrorsReservedCode =>
      'यह कोड अपने आप गणना होने वाले बकाया के लिए है।';

  @override
  String get payrollErrorsInvalidInstalment =>
      'किस्त 0 से अधिक और राशि से कम या बराबर होनी चाहिए।';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'वसूली ऋण देने से पहले शुरू नहीं हो सकती।';

  @override
  String get payrollErrorsEmployeeNotActive => 'यह कर्मचारी छोड़ चुका है।';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'इसका कुछ भाग वसूल हो चुका है; इसे रद्द नहीं किया जा सकता।';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'बीएसआर कोड और चालान क्रमांक डालें।';

  @override
  String get payrollErrorsInvalidBsrCode => 'बीएसआर कोड 7 अंकों का होता है।';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'चालान क्रमांक अधिकतम 5 अंकों का होता है।';

  @override
  String get payrollErrorsInvalidTan => 'यह टैन सही नहीं है (जैसे MUMA12345B)।';

  @override
  String get payrollErrorsNoFinalPayslips =>
      'उस साल की कोई अंतिम वेतन पर्ची नहीं।';

  @override
  String get payrollErrorsInvalidTime => '24 घंटे का समय लिखें, जैसे 09:30।';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'आधा दिन पूरे दिन से लंबा नहीं हो सकता।';

  @override
  String get payrollErrorsInvalidAmount => 'राशि डालें।';

  @override
  String get payrollSettingsTitle => 'वेतन सेटिंग';

  @override
  String get payrollSettingsSubtitle =>
      'पंजीकरण कोड, साप्ताहिक अवकाश और राज्य शुल्क।';

  @override
  String get payrollSettingsPfCode => 'ईपीएफ प्रतिष्ठान कोड';

  @override
  String get payrollSettingsEsiCode => 'ईएसआई नियोक्ता कोड';

  @override
  String get payrollSettingsLabourCode =>
      'श्रम संहिता का 50% वेतन नियम लागू करें';

  @override
  String get payrollSettingsLabourCodeHint =>
      'सामाजिक सुरक्षा संहिता (21 नवंबर 2025 से) के अनुसार, भत्ते वेतन के आधे से अधिक हों तो अतिरिक्त भाग पीएफ वेतन गिना जाता है।';

  @override
  String get payrollSettingsWeeklyOffs => 'साप्ताहिक अवकाश';

  @override
  String get payrollSettingsLwf => 'श्रम कल्याण निधि';

  @override
  String get payrollSettingsLwfEmployee => 'कर्मचारी अंश (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'नियोक्ता अंश (₹)';

  @override
  String get payrollSettingsLwfMonths => 'किन महीनों में';

  @override
  String get payrollSettingsEncashment => 'प्रति दिन अवकाश नकदीकरण';

  @override
  String payrollSettingsDivisor(String n) {
    return 'मासिक वेतन ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'सहेजें';

  @override
  String get payrollSettingsTan => 'टैन (कर कटौती खाता संख्या)';

  @override
  String get payrollSlipTitle => 'वेतन पर्ची';

  @override
  String payrollSlipFor(String month) {
    return '$month की वेतन पर्ची';
  }

  @override
  String get payrollSlipEarnings => 'आय';

  @override
  String get payrollSlipDeductions => 'कटौतियाँ';

  @override
  String get payrollSlipNetPay => 'शुद्ध वेतन';

  @override
  String get payrollSlipInWords => 'शब्दों में';

  @override
  String get payrollSlipEmployer => 'नियोक्ता अंशदान (कटौती नहीं)';

  @override
  String get payrollSlipTax => 'आयकर गणना';

  @override
  String get payrollSlipAnnualSalary => 'वर्ष का अनुमानित वेतन';

  @override
  String get payrollSlipTaxableIncome => 'कर योग्य आय';

  @override
  String get payrollSlipAnnualTax => 'वर्ष का कर';

  @override
  String get payrollSlipDeductedSoFar => 'अब तक कटा';

  @override
  String get payrollSlipPfEmployee => 'भविष्य निधि';

  @override
  String get payrollSlipEsiEmployee => 'ईएसआई';

  @override
  String get payrollSlipPt => 'व्यवसाय कर';

  @override
  String get payrollSlipLwf => 'श्रम कल्याण निधि';

  @override
  String get payrollSlipTds => 'आयकर (टीडीएस)';

  @override
  String get payrollSlipEps => 'पेंशन (ईपीएस)';

  @override
  String get payrollSlipEpf => 'पीएफ (नियोक्ता)';

  @override
  String get payrollSlipEdli => 'ईडीएलआई';

  @override
  String get payrollSlipAdmin => 'पीएफ प्रशासन';

  @override
  String get payrollSlipEsiEmployer => 'ईएसआई (नियोक्ता)';

  @override
  String get payrollSlipComputerGenerated =>
      'यह कंप्यूटर से बनी वेतन पर्ची है, हस्ताक्षर की आवश्यकता नहीं।';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count पिछले महीने',
      one: '$count पिछला महीना',
    );
    return 'इसमें वेतन संरचना से अनुमानित $_temp0 शामिल (Varchasv से पहले भुगतान)।';
  }

  @override
  String get payrollExtraTitle => 'अतिरिक्त आय (केवल इस महीने)';

  @override
  String get payrollExtraName => 'आय';

  @override
  String get payrollExtraAmount => 'राशि';

  @override
  String get payrollExtraAdd => 'आय जोड़ें';

  @override
  String get payrollExtraEsiExcluded => 'ईएसआई वेतन नहीं (जैसे बोनस)';

  @override
  String get payrollLoanRecoveryTitle => 'ऋण और अग्रिम की किस्तें';

  @override
  String get payrollLoanRecoveryHint =>
      'इस महीने छोड़ने के लिए 0 लिखें; किस्त के लिए खाली छोड़ें।';

  @override
  String get payrollRegister => 'वेतन रजिस्टर';

  @override
  String get payrollEmail => 'वेतन पर्चियाँ ईमेल करें';

  @override
  String payrollEmailed(String sent) {
    return '$sent भेजी गईं।';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'ईमेल पता नहीं: $codes';
  }

  @override
  String get statutoryTitle => 'वैधानिक देय और टीडीएस';

  @override
  String get statutorySubtitle =>
      'अंतिम वेतन से पीएफ, ईएसआई, व्यवसाय कर, एलडब्ल्यूएफ और टीडीएस, क्या भुगतान हुआ, तिमाही टीडीएस रिटर्न और फ़ॉर्म 16।';

  @override
  String get statutoryFy => 'वित्त वर्ष';

  @override
  String get statutoryDues => 'देय और भुगतान';

  @override
  String get statutoryKind => 'प्रकार';

  @override
  String get statutoryKindsPf => 'पीएफ';

  @override
  String get statutoryKindsEsi => 'ईएसआई';

  @override
  String get statutoryKindsPt => 'व्यवसाय कर';

  @override
  String get statutoryKindsLwf => 'एलडब्ल्यूएफ';

  @override
  String get statutoryKindsTds => 'टीडीएस';

  @override
  String get statutoryPeriod => 'वेतन माह';

  @override
  String get statutoryDue => 'देय';

  @override
  String get statutoryPaid => 'भुगतान';

  @override
  String get statutoryBalance => 'शेष';

  @override
  String get statutoryDueDate => 'अंतिम तिथि';

  @override
  String get statutoryPay => 'भुगतान दर्ज करें';

  @override
  String get statutoryPaidOn => 'भुगतान तारीख';

  @override
  String get statutoryAccount => 'किस खाते से';

  @override
  String get statutoryReference => 'चालान / टीआरआरएन नं.';

  @override
  String get statutoryBsrCode => 'बीएसआर कोड';

  @override
  String get statutoryChallanSerial => 'चालान क्रमांक';

  @override
  String get statutoryRecord => 'भुगतान सहेजें';

  @override
  String get statutoryNone => 'इस साल अभी कोई अंतिम वेतन नहीं।';

  @override
  String get statutoryOverdue => 'देरी';

  @override
  String get statutoryQ24Title => 'तिमाही टीडीएस रिटर्न (फ़ॉर्म 24Q)';

  @override
  String get statutoryQ24Quarter => 'तिमाही';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · अप्रैल–जून';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · जुलाई–सितंबर';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · अक्टूबर–दिसंबर';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · जनवरी–मार्च';

  @override
  String get statutoryQ24Deductees => 'कटौती पंक्तियाँ';

  @override
  String get statutoryQ24Challans => 'चालान';

  @override
  String get statutoryQ24TotalTds => 'टीडीएस';

  @override
  String get statutoryQ24Download => 'कटौती पंक्तियाँ (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'अनुलग्नक II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'इन्हें एनएसडीएल रिटर्न प्रिपरेशन यूटिलिटी (RPU) में आयात करें, FVU से जाँचें, फिर TIN-NSDL पर अपलोड करें।';

  @override
  String get statutoryQ24WarningsTanMissing => 'वेतन सेटिंग में टैन जोड़ें।';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return '$detail का पैन नहीं: इसके बिना 20% पर कर कटना चाहिए।';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return '$detail के लिए कटा और जमा बराबर नहीं।';
  }

  @override
  String get statutoryForm16Title => 'फ़ॉर्म 16';

  @override
  String get statutoryForm16Hint =>
      'भाग B वेतन से। भाग A ट्रेसेस से डाउनलोड करके साथ लगाएँ; दोनों पर नियोक्ता हस्ताक्षर करते हैं।';

  @override
  String get statutoryForm16View => 'भाग B';

  @override
  String get form16Title => 'फ़ॉर्म 16 · भाग B';

  @override
  String get form16Subtitle =>
      'वेतन पर स्रोत पर कटे कर हेतु धारा 203 के अंतर्गत प्रमाणपत्र';

  @override
  String get form16Employer => 'नियोक्ता';

  @override
  String get form16Employee => 'कर्मचारी';

  @override
  String get form16Tan => 'टैन';

  @override
  String get form16Pan => 'पैन';

  @override
  String get form16Ay => 'कर निर्धारण वर्ष';

  @override
  String get form16Period => 'नौकरी की अवधि';

  @override
  String get form16Salary => 'भुगतान किया वेतन';

  @override
  String get form16Gross => 'सकल वेतन';

  @override
  String get form16Previous => 'पिछले नियोक्ता से वेतन';

  @override
  String get form16Exemptions => 'घटाएँ: धारा 16 के अंतर्गत छूट और कटौतियाँ';

  @override
  String get form16HraExempt => 'मकान किराया भत्ता छूट';

  @override
  String get form16StandardDeduction => 'मानक कटौती';

  @override
  String get form16Pt => 'व्यवसाय कर';

  @override
  String get form16HouseProperty => 'गृह संपत्ति से आय (गृह ऋण ब्याज)';

  @override
  String get form16ChapterVIA => 'अध्याय VI-A के अंतर्गत कटौतियाँ';

  @override
  String get form16TaxableIncome => 'कुल कर योग्य आय';

  @override
  String get form16Tax => 'कुल आय पर कर';

  @override
  String get form16Rebate => 'धारा 87A के अंतर्गत छूट';

  @override
  String get form16Surcharge => 'अधिभार';

  @override
  String get form16Cess => 'स्वास्थ्य और शिक्षा उपकर';

  @override
  String get form16Total => 'देय कर';

  @override
  String get form16Regime => 'कर व्यवस्था';

  @override
  String get form16TdsQuarterly => 'कटा और जमा कर';

  @override
  String get form16Quarter => 'तिमाही';

  @override
  String get form16Challans => 'चालान (बीएसआर कोड · तारीख · क्रमांक)';

  @override
  String get form16TdsDeducted => 'कुल कटा कर';

  @override
  String get form16Balance => 'देय (वापसी योग्य) कर';

  @override
  String get form16Verification =>
      'प्रमाणित किया जाता है कि उपरोक्त जानकारी उपलब्ध खातों, दस्तावेज़ों और अभिलेखों के आधार पर सत्य और सही है।';

  @override
  String get form16Signature =>
      'कर काटने के लिए ज़िम्मेदार व्यक्ति के हस्ताक्षर';

  @override
  String get form16PartA => 'भाग A (ट्रेसेस से) साथ लगाना है।';

  @override
  String form16Missing(String months) {
    return '$months की वेतन पर्चियाँ यहाँ नहीं हैं (Varchasv से पहले भुगतान)। हस्ताक्षर से पहले वह वेतन और कर जोड़ें।';
  }

  @override
  String get mfgBomsTitle => 'सामग्री सूची (BOM)';

  @override
  String get mfgBomsSubtitle =>
      'आप जो बनाते हैं उसमें क्या लगता है: बर्बादी, वर्क-सेंटर समय और ओवरहेड सहित।';

  @override
  String get mfgBomsNew => 'नया बीओएम';

  @override
  String get mfgBomsItem => 'बनने वाली वस्तु';

  @override
  String get mfgBomsVersion => 'संस्करण';

  @override
  String get mfgBomsOutputQty => 'बनता है (मात्रा)';

  @override
  String get mfgBomsOverhead => 'प्रति बैच स्थिर ओवरहेड (₹)';

  @override
  String get mfgBomsComponent => 'सामग्री';

  @override
  String get mfgBomsQty => 'मात्रा';

  @override
  String get mfgBomsWastage => 'बर्बादी %';

  @override
  String get mfgBomsOperations => 'प्रक्रियाएँ';

  @override
  String get mfgBomsOperation => 'प्रक्रिया';

  @override
  String get mfgBomsWorkCentre => 'वर्क सेंटर';

  @override
  String get mfgBomsMinutes => 'मिनट';

  @override
  String get mfgBomsAddLine => 'सामग्री जोड़ें';

  @override
  String get mfgBomsAddOperation => 'प्रक्रिया जोड़ें';

  @override
  String get mfgBomsSave => 'बीओएम सहेजें';

  @override
  String get mfgBomsMakeDefault => 'डिफ़ॉल्ट बनाएँ';

  @override
  String get mfgBomsDefault => 'डिफ़ॉल्ट';

  @override
  String get mfgBomsArchive => 'संग्रहित करें';

  @override
  String get mfgBomsArchived => 'संग्रहित';

  @override
  String get mfgBomsUnitCost => 'प्रति इकाई लागत';

  @override
  String get mfgBomsOverheadPerUnit => 'प्रति इकाई ओवरहेड';

  @override
  String get mfgBomsRate => 'दर';

  @override
  String get mfgBomsCost => 'लागत';

  @override
  String get mfgBomsNone => 'अभी कोई बीओएम नहीं।';

  @override
  String get mfgBomsNotes => 'टिप्पणी';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count सामग्रियाँ',
      one: '$count सामग्री',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'वर्क सेंटर';

  @override
  String get mfgWorkCentresName => 'वर्क सेंटर';

  @override
  String get mfgWorkCentresCostPerHour => 'प्रति घंटा लागत (₹)';

  @override
  String get mfgWorkCentresAdd => 'वर्क सेंटर जोड़ें';

  @override
  String get mfgWorkCentresSave => 'सहेजें';

  @override
  String get mfgOrdersTitle => 'उत्पादन आदेश';

  @override
  String get mfgOrdersSubtitle =>
      'उत्पादन की योजना, रिलीज़ और पूरा करना। सामग्री स्टॉक से घटती है और उत्पाद लागत पर आता है।';

  @override
  String get mfgOrdersNew => 'नया उत्पादन आदेश';

  @override
  String get mfgOrdersItem => 'वस्तु';

  @override
  String get mfgOrdersQty => 'मात्रा';

  @override
  String get mfgOrdersDate => 'तारीख';

  @override
  String get mfgOrdersStatus => 'स्थिति';

  @override
  String get mfgOrdersStatusesPlanned => 'योजना';

  @override
  String get mfgOrdersStatusesReleased => 'रिलीज़';

  @override
  String get mfgOrdersStatusesCompleted => 'पूरा';

  @override
  String get mfgOrdersStatusesCancelled => 'रद्द';

  @override
  String get mfgOrdersProduced => 'बना';

  @override
  String get mfgOrdersRejected => 'अस्वीकृत';

  @override
  String get mfgOrdersRelease => 'रिलीज़ करें';

  @override
  String get mfgOrdersIssue => 'अतिरिक्त सामग्री दें';

  @override
  String get mfgOrdersComplete => 'उत्पादन दर्ज करें';

  @override
  String get mfgOrdersGoodQty => 'अच्छी मात्रा';

  @override
  String get mfgOrdersRejectedQty => 'अस्वीकृत';

  @override
  String get mfgOrdersClose => 'इसके बाद आदेश बंद करें';

  @override
  String get mfgOrdersRemaining => 'बनाना बाकी';

  @override
  String get mfgOrdersMaterials => 'बाकी के लिए सामग्री';

  @override
  String get mfgOrdersEntries => 'इतिहास';

  @override
  String get mfgOrdersUnitCost => 'इकाई लागत';

  @override
  String get mfgOrdersMaterialCost => 'सामग्री लागत';

  @override
  String get mfgOrdersOverheadCost => 'ओवरहेड';

  @override
  String get mfgOrdersKindsIssue => 'अतिरिक्त सामग्री';

  @override
  String get mfgOrdersKindsComplete => 'उत्पादन';

  @override
  String get mfgOrdersReleaseNow => 'तुरंत रिलीज़ करें';

  @override
  String get mfgOrdersNone => 'अभी कोई उत्पादन आदेश नहीं।';

  @override
  String get mfgOrdersSave => 'आदेश बनाएँ';

  @override
  String get mfgOrdersCancel => 'आदेश रद्द करें';

  @override
  String get mfgMrpTitle => 'सामग्री योजना (एमआरपी)';

  @override
  String get mfgMrpSubtitle =>
      'खुले बिक्री आदेशों और रीऑर्डर स्तर के लिए क्या बनाना और खरीदना है, स्टॉक और पहले से ऑर्डर घटाकर।';

  @override
  String get mfgMrpAsOf => 'योजना तारीख';

  @override
  String get mfgMrpAction => 'क्रिया';

  @override
  String get mfgMrpActionsMake => 'बनाएँ';

  @override
  String get mfgMrpActionsBuy => 'खरीदें';

  @override
  String get mfgMrpQty => 'मात्रा';

  @override
  String get mfgMrpNeedBy => 'कब तक चाहिए';

  @override
  String get mfgMrpReleaseBy => 'कब शुरू / ऑर्डर करें';

  @override
  String get mfgMrpOnHand => 'स्टॉक में';

  @override
  String get mfgMrpOnOrder => 'ऑर्डर पर';

  @override
  String get mfgMrpSupplier => 'आपूर्तिकर्ता';

  @override
  String get mfgMrpConvert => 'चुने हुए के आदेश बनाएँ';

  @override
  String mfgMrpCreated(String orders) {
    return '$orders बने।';
  }

  @override
  String get mfgMrpNone =>
      'योजना की ज़रूरत नहीं: स्टॉक और ऑर्डर माँग पूरी करते हैं।';

  @override
  String get mfgJobWorkTitle => 'जॉब वर्क';

  @override
  String get mfgJobWorkSubtitle =>
      'चालान पर जॉब वर्कर को भेजा और प्रोसेस होकर लौटा माल। इनपुट एक साल में (पूँजीगत माल तीन साल में) लौटना चाहिए।';

  @override
  String get mfgJobWorkSend => 'जॉब वर्क के लिए भेजें';

  @override
  String get mfgJobWorkReceive => 'वापस प्राप्त करें';

  @override
  String get mfgJobWorkJobWorker => 'जॉब वर्कर';

  @override
  String get mfgJobWorkProcess => 'प्रक्रिया';

  @override
  String get mfgJobWorkSent => 'भेजा';

  @override
  String get mfgJobWorkPending => 'जॉब वर्कर के पास';

  @override
  String get mfgJobWorkReturnBy => 'कब तक लौटाना';

  @override
  String get mfgJobWorkOverdue => 'देरी';

  @override
  String get mfgJobWorkReceived => 'प्राप्त वस्तु';

  @override
  String get mfgJobWorkConsumed => 'लगे इनपुट';

  @override
  String get mfgJobWorkCharges => 'जॉब शुल्क (₹)';

  @override
  String get mfgJobWorkFrom => 'किस चालान से';

  @override
  String get mfgJobWorkItc04 => 'आईटीसी-04 (अर्धवार्षिक)';

  @override
  String get mfgJobWorkHalf => 'छमाही';

  @override
  String get mfgJobWorkHalvesH1 => 'अप्रैल–सितंबर';

  @override
  String get mfgJobWorkHalvesH2 => 'अक्टूबर–मार्च';

  @override
  String get mfgJobWorkSentTable => 'भेजा गया माल';

  @override
  String get mfgJobWorkReceivedTable => 'वापस मिला माल';

  @override
  String get mfgJobWorkPendingTable => 'जॉब वर्करों के पास बाकी';

  @override
  String get mfgJobWorkNone => 'अभी कोई जॉब वर्क नहीं।';

  @override
  String get mfgJobWorkCapitalGoods => 'पूँजीगत माल';

  @override
  String get mfgErrorsBomCycle =>
      'इससे चक्र बनता है: कोई वस्तु खुद पर निर्भर होगी।';

  @override
  String get mfgErrorsBomEmpty => 'कम से कम एक सामग्री जोड़ें।';

  @override
  String get mfgErrorsInvalidOutputQty => 'एक बैच में कितना बनता है, डालें।';

  @override
  String get mfgErrorsDuplicateComponent => 'एक सामग्री दो बार है।';

  @override
  String get mfgErrorsUnknownWorkCentre => 'वर्क सेंटर चुनें।';

  @override
  String get mfgErrorsNoBom => 'इस वस्तु का कोई सक्रिय बीओएम नहीं।';

  @override
  String get mfgErrorsBomArchived => 'यह बीओएम संग्रहित है।';

  @override
  String get mfgErrorsOrderNotPlanned =>
      'केवल योजना वाला आदेश रिलीज़ हो सकता है।';

  @override
  String get mfgErrorsOrderNotReleased => 'पहले आदेश रिलीज़ करें।';

  @override
  String get mfgErrorsSupplierRequired =>
      'खरीदने वाली वस्तुओं के लिए आपूर्तिकर्ता चुनें।';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'जॉब वर्कर के रूप में आपूर्तिकर्ता या ग्राहक चुनें।';

  @override
  String get mfgErrorsUnknownChallan => 'भेजा गया चालान चुनें।';

  @override
  String get mfgErrorsChallanCancelled => 'यह चालान रद्द है।';

  @override
  String get mfgErrorsItemNotSent => 'यह वस्तु इस चालान पर नहीं भेजी गई।';

  @override
  String get mfgErrorsMoreThanSent => 'जॉब वर्कर के पास बची मात्रा से अधिक।';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'इस चालान पर माल लौट चुका है; पहले वह रद्द करें।';

  @override
  String get posBillingTitle => 'बिलिंग';

  @override
  String get posBillingTerminal => 'काउंटर';

  @override
  String get posBillingChooseTerminal => 'काउंटर चुनें';

  @override
  String get posBillingOpenShift => 'शिफ़्ट शुरू करें';

  @override
  String get posBillingOpeningCash => 'शुरुआती नकद (₹)';

  @override
  String get posBillingCloseShift => 'शिफ़्ट बंद करें';

  @override
  String get posBillingCountedCash => 'गिना गया नकद (₹)';

  @override
  String get posBillingExpected => 'अपेक्षित';

  @override
  String get posBillingDifference => 'अंतर';

  @override
  String get posBillingSearch => 'बारकोड स्कैन करें या वस्तु खोजें';

  @override
  String get posBillingCart => 'बिल';

  @override
  String get posBillingEmpty => 'बिल शुरू करने के लिए वस्तुएँ जोड़ें।';

  @override
  String get posBillingQty => 'मात्रा';

  @override
  String get posBillingPrice => 'मूल्य';

  @override
  String get posBillingAmount => 'राशि';

  @override
  String get posBillingDiscount => 'बिल छूट (₹)';

  @override
  String get posBillingCustomer => 'ग्राहक मोबाइल (पॉइंट के लिए)';

  @override
  String get posBillingCustomerName => 'नाम';

  @override
  String posBillingPoints(String points) {
    return '$points पॉइंट';
  }

  @override
  String get posBillingRedeem => 'पॉइंट भुनाएँ';

  @override
  String posBillingRedeemable(String points, String value) {
    return 'अधिकतम $points पॉइंट (₹$value)';
  }

  @override
  String get posBillingPayments => 'भुगतान';

  @override
  String get posBillingModesCash => 'नकद';

  @override
  String get posBillingModesUpi => 'यूपीआई';

  @override
  String get posBillingModesCard => 'कार्ड';

  @override
  String get posBillingModesCredit => 'उधार';

  @override
  String get posBillingReference => 'संदर्भ';

  @override
  String get posBillingAddPayment => 'भुगतान बाँटें';

  @override
  String get posBillingPay => 'बिल पूरा करें';

  @override
  String get posBillingTotal => 'कुल';

  @override
  String get posBillingChange => 'लौटाने हैं';

  @override
  String get posBillingDue => 'बाकी';

  @override
  String get posBillingTaxable => 'कर योग्य';

  @override
  String get posBillingTax => 'जीएसटी';

  @override
  String get posBillingRoundOff => 'राउंड ऑफ़';

  @override
  String posBillingDone(String number) {
    return 'बिल $number सहेजा गया';
  }

  @override
  String get posBillingPrint => 'रसीद प्रिंट करें';

  @override
  String get posBillingNewBill => 'नया बिल';

  @override
  String get posBillingShiftTotals => 'इस शिफ़्ट में';

  @override
  String get posBillingBills => 'बिल';

  @override
  String get posBillingDeviceTerminal =>
      'यह काउंटर अपने डिवाइस (ऑफ़लाइन ऐप) से बिल करता है।';

  @override
  String get posBillsTitle => 'पीओएस बिल';

  @override
  String get posBillsSubtitle => 'किसी दिन के सभी काउंटरों के बिल।';

  @override
  String get posBillsDate => 'तारीख';

  @override
  String get posBillsNumber => 'बिल नं.';

  @override
  String get posBillsTime => 'समय';

  @override
  String get posBillsMode => 'भुगतान';

  @override
  String get posBillsVoid => 'रद्द करें';

  @override
  String get posBillsVoided => 'रद्द';

  @override
  String get posBillsReason => 'कारण';

  @override
  String get posBillsSummary => 'दिन का सारांश';

  @override
  String get posBillsTopItems => 'सबसे ज़्यादा बिकी';

  @override
  String get posBillsMismatch => 'डिवाइस का कुल अलग था';

  @override
  String get posBillsNone => 'इस दिन कोई बिल नहीं।';

  @override
  String get posSettingsTitle => 'काउंटर सेटिंग';

  @override
  String get posSettingsSubtitle =>
      'दाम, लॉयल्टी पॉइंट, छूट की सीमा और काउंटर।';

  @override
  String get posSettingsPricesIncludeTax => 'मूल्य में जीएसटी शामिल';

  @override
  String get posSettingsLoyalty => 'लॉयल्टी पॉइंट';

  @override
  String get posSettingsLoyaltyEnabled => 'लॉयल्टी पॉइंट दें';

  @override
  String get posSettingsPointsPer100 => 'प्रति ₹100 पॉइंट';

  @override
  String get posSettingsPointValue => 'एक पॉइंट का मूल्य (₹)';

  @override
  String get posSettingsMaxRedeem => 'बिल का अधिकतम भाग पॉइंट से (%)';

  @override
  String get posSettingsFooter => 'रसीद के नीचे';

  @override
  String get posSettingsTerminals => 'काउंटर';

  @override
  String get posSettingsTerminalName => 'काउंटर का नाम';

  @override
  String get posSettingsWarehouse => 'कहाँ से बिकता है';

  @override
  String get posSettingsDevice => 'ऑफ़लाइन डिवाइस';

  @override
  String get posSettingsNoDevice => 'कोई नहीं (वेब बिलिंग)';

  @override
  String get posSettingsAddTerminal => 'काउंटर जोड़ें';

  @override
  String get posSettingsSave => 'सहेजें';

  @override
  String get posReceiptTaxInvoice => 'कर बीजक';

  @override
  String get posReceiptBillOfSupply => 'कैश मेमो';

  @override
  String get posReceiptThanks => 'धन्यवाद! फिर पधारें।';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'मिले पॉइंट: $points · शेष $balance';
  }

  @override
  String get posErrorsSessionNotOpen => 'पहले इस काउंटर पर शिफ़्ट शुरू करें।';

  @override
  String get posErrorsSessionAlreadyOpen =>
      'इस काउंटर पर शिफ़्ट पहले से चालू है।';

  @override
  String get posErrorsSessionClosed => 'वह शिफ़्ट बंद है।';

  @override
  String get posErrorsDeviceTerminal => 'यह काउंटर अपने डिवाइस से बिल करता है।';

  @override
  String get posErrorsTerminalOnOtherDevice =>
      'यह काउंटर किसी दूसरे डिवाइस का है।';

  @override
  String get posErrorsTooManyPoints => 'इस बिल पर इतने पॉइंट नहीं लग सकते।';

  @override
  String get posErrorsLoyaltyNotAvailable =>
      'पहले ग्राहक का मोबाइल नंबर डालें।';

  @override
  String get posErrorsOverpaidNonCash =>
      'यूपीआई और कार्ड बाकी राशि से अधिक नहीं हो सकते।';

  @override
  String get posErrorsUnderpaid => 'बिल का पूरा भुगतान नहीं हुआ।';

  @override
  String get posErrorsInvalidPayment => 'भुगतान राशि डालें।';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'उधार बिक्री के लिए ग्राहक चुनें।';

  @override
  String get posErrorsDiscountExceedsAmount => 'छूट बिल से अधिक है।';

  @override
  String get posErrorsVoidSameDayOnly => 'केवल आज के बिल रद्द हो सकते हैं।';

  @override
  String get posErrorsOrderNotOpen => 'यह आदेश बंद है।';

  @override
  String get posErrorsBillNumberTaken => 'यह बिल नंबर पहले से उपयोग में है।';

  @override
  String get posErrorsInvalidPhone => '10 अंकों का मोबाइल नंबर डालें।';

  @override
  String get posErrorsNoLines => 'कम से कम एक वस्तु जोड़ें।';

  @override
  String get posDeviceNoTerminal =>
      'इस डिवाइस पर कोई बिलिंग काउंटर नहीं है। वेब पर POS सेटिंग्स खोलकर किसी काउंटर को इस डिवाइस से जोड़ें, फिर सिंक करें।';

  @override
  String get posDeviceTodayBills => 'इस डिवाइस के आज के बिल';

  @override
  String get posDeviceWaiting => 'अपलोड होना बाकी';

  @override
  String get posDeviceUploaded => 'अपलोड हो गया';

  @override
  String posDeviceFailed(String error) {
    return 'स्वीकार नहीं हुआ: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'सर्वर का कुल $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'बिल इसी डिवाइस पर क्रमांकित होते हैं और ऑनलाइन होने पर अपलोड हो जाते हैं।';

  @override
  String get posDeviceNoFiscalYear =>
      'आज की तारीख किसी वित्त वर्ष में नहीं है। पहले क्लाउड से सिंक करें।';

  @override
  String get posPromoReferredBy => 'किसने भेजा (मोबाइल)';

  @override
  String posPromoReferredHint(String points) {
    return 'उन्हें $points पॉइंट मिलेंगे';
  }

  @override
  String get posPromoCoupon => 'कूपन कोड';

  @override
  String posPromoCouponOk(String off) {
    return '$off छूट';
  }

  @override
  String get posPromoCard => 'डिस्काउंट कार्ड';

  @override
  String get posPromoCardOff => 'डिस्काउंट कार्ड';

  @override
  String posPromoCouponOff(String code) {
    return 'कूपन $code';
  }

  @override
  String posPromoVoucher(String code) {
    return 'गिफ्ट वाउचर $code';
  }

  @override
  String get posPromoToPay => 'भुगतान करना है';

  @override
  String get posPromoVoucherCode => 'गिफ्ट वाउचर कोड';

  @override
  String get posPromoUseVoucher => 'वाउचर लगाएँ';

  @override
  String get posPromoReferralPoints => 'रेफ़रल पॉइंट';

  @override
  String get posPromoReferralPointsHint =>
      'उस सदस्य को जिसका भेजा ग्राहक जुड़कर खरीदे (0 = बंद)';

  @override
  String get posPromoErrorsCouponNotFound => 'ऐसा कोई कूपन नहीं, या बंद है।';

  @override
  String get posPromoErrorsCouponNotValidToday => 'यह कूपन आज मान्य नहीं है।';

  @override
  String get posPromoErrorsCouponUsedUp => 'यह कूपन पूरा इस्तेमाल हो चुका है।';

  @override
  String get posPromoErrorsCouponMinBill =>
      'बिल इस कूपन की न्यूनतम राशि से कम है।';

  @override
  String get posPromoErrorsCardNotFound =>
      'ऐसा कोई डिस्काउंट कार्ड नहीं, या बंद है।';

  @override
  String get posPromoErrorsCardExpired =>
      'यह डिस्काउंट कार्ड समाप्त हो चुका है।';

  @override
  String get posPromoErrorsVoucherNotFound => 'उस कोड का कोई गिफ्ट वाउचर नहीं।';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'यह गिफ्ट वाउचर पूरा इस्तेमाल हो चुका या समाप्त है।';

  @override
  String get posPromoErrorsVoucherBalanceLow => 'वाउचर पर इतनी रकम नहीं बची।';

  @override
  String get posPromoErrorsVoucherMoreThanBill =>
      'वाउचर की रकम बिल से ज़्यादा है।';

  @override
  String get posPromoErrorsVoucherTwice => 'एक ही वाउचर दो बार डाला गया।';

  @override
  String get posPromoErrorsOnlineOnly =>
      'कूपन, कार्ड और गिफ्ट वाउचर के लिए ऑनलाइन काउंटर चाहिए।';

  @override
  String get posCounterControls => 'काउंटर नियंत्रण';

  @override
  String get posCounterAllowRateChange => 'कैशियर दर बदल सकते हैं';

  @override
  String get posCounterRequireSalesman => 'हर लाइन पर सेल्समैन ज़रूरी';

  @override
  String get posCounterMaxLineDiscount => 'सबसे बड़ी लाइन छूट, %';

  @override
  String get posCounterMaxBillDiscount => 'सबसे बड़ी बिल छूट, %';

  @override
  String get posCounterLimitHint =>
      'खाली: कोई सीमा नहीं। ज़्यादा पर अनुमोदक का कारण चाहिए।';

  @override
  String get posCounterSalesman => 'सेल्समैन';

  @override
  String get posCounterNoSalesman => 'कोई सेल्समैन नहीं';

  @override
  String get posCounterBillSalesman => 'बिल का सेल्समैन';

  @override
  String get posCounterRate => 'दर';

  @override
  String get posCounterRateLocked => 'दर लॉक है';

  @override
  String get posCounterDisc => 'छूट ₹';

  @override
  String get posCounterLineDiscount => 'लाइन छूट रुपये में';

  @override
  String posCounterVisits(String n) {
    return 'आना: $n बार';
  }

  @override
  String posCounterSpent(String v) {
    return 'ख़र्च $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'वापस $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'आख़िरी बार $date';
  }

  @override
  String get posCounterBuys => 'आमतौर पर लेते हैं';

  @override
  String get posCounterNewCustomer => 'नया ग्राहक: इस बिल से जुड़ेंगे।';

  @override
  String get posCounterApprovalReason => 'अनुमति का कारण';

  @override
  String get posCounterBrokenRate => 'दर बदली';

  @override
  String get posCounterBrokenLineDiscount => 'लाइन छूट सीमा से ज़्यादा';

  @override
  String get posCounterBrokenBillDiscount => 'बिल छूट सीमा से ज़्यादा';

  @override
  String get posCounterNeedsApprover => 'मैनेजर की अनुमति चाहिए';

  @override
  String get posCounterHold => 'बिल रोकें';

  @override
  String posCounterHeldBills(String n) {
    return 'रुके बिल ($n)';
  }

  @override
  String get posCounterHoldLabel => 'किसके लिए? (वैकल्पिक)';

  @override
  String get posCounterHoldNow => 'रोकें';

  @override
  String get posCounterUnnamed => 'ग्राहक';

  @override
  String posCounterPieces(String n) {
    return 'पीस: $n';
  }

  @override
  String get posCounterResume => 'इसका बिल बनाएँ';

  @override
  String get posCounterNoneHeld => 'कोई रुका बिल नहीं।';

  @override
  String get posCounterHoldFirst =>
      'दूसरा उठाने से पहले मौजूदा बिल रोकें या पूरा करें।';

  @override
  String get posCounterSizeStock => 'यहाँ साइज़वार स्टॉक';

  @override
  String get posCounterAddSize => 'यह रंग और साइज़ जोड़ें';

  @override
  String get posCounterKeysSearch => 'स्कैन या खोज';

  @override
  String get posCounterKeysHold => 'बिल रोकें';

  @override
  String get posCounterKeysHeld => 'रुके बिल';

  @override
  String get posCounterKeysCustomer => 'ग्राहक';

  @override
  String get posCounterKeysDiscount => 'छूट';

  @override
  String get posCounterKeysCash => 'पूरा नकद';

  @override
  String get posCounterKeysUpi => 'पूरा UPI';

  @override
  String get posCounterKeysCard => 'पूरा कार्ड';

  @override
  String get posCounterKeysPay => 'बिल पूरा करें';

  @override
  String get posCounterKeysExchange => 'वापसी या बदली';

  @override
  String get posCounterErrorsRateLocked =>
      'दर लॉक है। मैनेजर कारण के साथ अनुमति दे सकते हैं।';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'लाइन छूट सीमा से ज़्यादा है। मैनेजर कारण के साथ अनुमति दे सकते हैं।';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'बिल छूट सीमा से ज़्यादा है। मैनेजर कारण के साथ अनुमति दे सकते हैं।';

  @override
  String get posCounterErrorsSalesmanRequired => 'हर लाइन का सेल्समैन चुनें।';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'वह सेल्समैन स्टाफ़ सूची में नहीं है।';

  @override
  String get posCounterErrorsHeldBillGone =>
      'वह रुका बिल पहले ही उठा लिया गया।';

  @override
  String get posCounterAutoSendBill =>
      'ग्राहक मोबाइल दे तो बिल अपने आप व्हाट्सऐप पर भेजें';

  @override
  String get posCounterBrowse => 'आइटम देखें';

  @override
  String get posCounterItem => 'आइटम';

  @override
  String posCounterPiecesInBill(String n) {
    return 'बिल में $n पीस';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'दर पर कुल $v';
  }

  @override
  String get posCounterOffers => 'छूट और ऑफ़र';

  @override
  String get posCounterBreakdown => 'बिल का ब्योरा';

  @override
  String get posCounterInclGst => 'GST सहित';

  @override
  String get posCounterBillItems => 'बिल के आइटम';

  @override
  String get posCounterScanToStart =>
      'बिल शुरू करने के लिए बारकोड स्कैन करें या खोजें। होल्ड बिल उठाने के लिए F4 दबाएँ।';

  @override
  String get bankingAccountsTitle => 'बैंक';

  @override
  String get bankingAccountsSubtitle => 'बैंक स्टेटमेंट को खातों से मिलाएँ।';

  @override
  String get bankingAccountsBookBalance => 'खातों के अनुसार';

  @override
  String get bankingAccountsStatementBalance => 'बैंक के अनुसार';

  @override
  String bankingAccountsAsOf(String date) {
    return '$date को';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count पंक्तियाँ मिलानी हैं',
      one: '$count पंक्ति मिलानी है',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'सब मिल गए';

  @override
  String get bankingAccountsNone =>
      'अभी कोई बैंक खाता नहीं है। खातों की सूची में बैंक खाते के अंतर्गत एक लेजर जोड़ें।';

  @override
  String get bankingAccountsReconcile => 'मिलान करें';

  @override
  String get bankingAccountsNoStatement => 'अभी कोई स्टेटमेंट नहीं';

  @override
  String get bankingProfileTitle => 'बैंक विवरण';

  @override
  String get bankingProfileBankName => 'बैंक';

  @override
  String get bankingProfileLast4 => 'खाता (अंतिम 4 अंक)';

  @override
  String get bankingProfileIfsc => 'आईएफ़एससी';

  @override
  String get bankingProfileSave => 'सहेजें';

  @override
  String get bankingImportTitle => 'स्टेटमेंट आयात करें';

  @override
  String get bankingImportHint =>
      'नेट बैंकिंग से स्टेटमेंट CSV में डाउनलोड करें (Excel से: Save As → CSV)। कॉलम उनके शीर्षक से पहचाने जाते हैं, इसलिए ज़्यादातर भारतीय बैंकों के स्टेटमेंट चलते हैं।';

  @override
  String get bankingImportFile => 'स्टेटमेंट फ़ाइल (CSV)';

  @override
  String get bankingImportButton => 'आयात करें';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$added पंक्तियाँ जोड़ी गईं, $duplicates पहले से थीं, $matched अपने आप मिलाई गईं।';
  }

  @override
  String get bankingFeedTitle => 'बैंक फ़ीड';

  @override
  String get bankingFeedHint =>
      'सहमति देने के बाद लेन-देन RBI के अकाउंट एग्रीगेटर ढाँचे से आते हैं। प्रदाता से अनुबंध होने तक एक सिम्युलेटर काम करता है।';

  @override
  String get bankingFeedConnect => 'जोड़ें';

  @override
  String get bankingFeedFetch => 'अभी लाएँ';

  @override
  String get bankingFeedDisconnect => 'हटाएँ';

  @override
  String get bankingFeedStatusesActive => 'जुड़ा है';

  @override
  String get bankingFeedStatusesPending => 'सहमति की प्रतीक्षा';

  @override
  String get bankingFeedStatusesRevoked => 'हटाया गया';

  @override
  String bankingFeedFetched(String date) {
    return '$date तक लाया गया';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$added नए लेन-देन, $matched मिलाए गए।';
  }

  @override
  String get bankingTabsOpen => 'मिलाने हैं';

  @override
  String get bankingTabsMatched => 'मिल गए';

  @override
  String get bankingTabsIgnored => 'छोड़े गए';

  @override
  String get bankingTabsBrs => 'मिलान विवरण';

  @override
  String get bankingLinesDate => 'तारीख़';

  @override
  String get bankingLinesDescription => 'विवरण';

  @override
  String get bankingLinesWithdrawal => 'निकासी';

  @override
  String get bankingLinesDeposit => 'जमा';

  @override
  String get bankingLinesBalance => 'शेष';

  @override
  String get bankingLinesSuggestion => 'संभवतः';

  @override
  String get bankingLinesAccept => 'मिलाएँ';

  @override
  String get bankingLinesCreate => 'प्रविष्टि दर्ज करें';

  @override
  String get bankingLinesIgnore => 'छोड़ें';

  @override
  String get bankingLinesByHand => 'प्रविष्टि खोजें';

  @override
  String get bankingLinesUnmatch => 'मिलान हटाएँ';

  @override
  String get bankingLinesRestore => 'वापस लाएँ';

  @override
  String get bankingLinesAccount => 'किस लेजर में';

  @override
  String get bankingLinesNarration => 'विवरण';

  @override
  String bankingLinesRule(String account) {
    return 'नियम: $account';
  }

  @override
  String get bankingLinesApplyRules => 'नियम वाली सभी पंक्तियाँ दर्ज करें';

  @override
  String bankingLinesRulesDone(String count) {
    return '$count प्रविष्टियाँ दर्ज हुईं।';
  }

  @override
  String get bankingLinesNone => 'यहाँ कुछ नहीं है।';

  @override
  String bankingLinesEntries(String from, String to) {
    return '$from से $to तक की बिना मिलान वाली प्रविष्टियाँ';
  }

  @override
  String get bankingLinesMatchSelected => 'चुनी हुई मिलाएँ';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return '$amount में से $total चुना';
  }

  @override
  String get bankingLinesReasonsAmount => 'समान राशि';

  @override
  String get bankingLinesReasonsSameDay => 'उसी दिन';

  @override
  String get bankingLinesReasonsReference => 'समान संदर्भ';

  @override
  String get bankingLinesReasonsParty => 'पक्ष का नाम';

  @override
  String get bankingBrsAsOf => 'तारीख़';

  @override
  String get bankingBrsPerBooks => 'खातों के अनुसार शेष';

  @override
  String get bankingBrsNotPresented =>
      'जोड़ें: जारी किए गए पर अभी प्रस्तुत न हुए चेक';

  @override
  String get bankingBrsNotCredited => 'घटाएँ: जमा जो बैंक ने अभी नहीं दिखाई';

  @override
  String get bankingBrsBankDebits =>
      'घटाएँ: बैंक के डेबिट जो खातों में नहीं हैं';

  @override
  String get bankingBrsBankCredits =>
      'जोड़ें: बैंक के क्रेडिट जो खातों में नहीं हैं';

  @override
  String get bankingBrsPerBank => 'बैंक के अनुसार शेष';

  @override
  String bankingBrsStatement(String date) {
    return '$date को स्टेटमेंट शेष';
  }

  @override
  String get bankingBrsDifference => 'अंतर';

  @override
  String get bankingBrsBalanced => 'मिलान पूरा';

  @override
  String get bankingRulesTitle => 'बैंक नियम';

  @override
  String get bankingRulesSubtitle =>
      'इन शब्दों वाली स्टेटमेंट पंक्तियाँ एक क्लिक में किसी लेजर में दर्ज होती हैं (बैंक शुल्क, ब्याज, स्थायी निर्देश)।';

  @override
  String get bankingRulesContains => 'विवरण में हो';

  @override
  String get bankingRulesDirection => 'पैसा';

  @override
  String get bankingRulesDirectionsIn => 'आया';

  @override
  String get bankingRulesDirectionsOut => 'गया';

  @override
  String get bankingRulesDirectionsAny => 'आया या गया';

  @override
  String get bankingRulesAccount => 'किस लेजर में';

  @override
  String get bankingRulesNarration => 'विवरण';

  @override
  String get bankingRulesPriority => 'प्राथमिकता';

  @override
  String get bankingRulesAdd => 'नियम जोड़ें';

  @override
  String get bankingRulesSave => 'सहेजें';

  @override
  String get bankingSettlementsTitle => 'गेटवे सेटलमेंट';

  @override
  String get bankingSettlementsSubtitle =>
      'Razorpay, PhonePe, Paytm आदि से भुगतान: वसूली में से रिफ़ंड, शुल्क और शुल्क पर जीएसटी घटाकर बैंक में एक क्रेडिट।';

  @override
  String get bankingSettlementsProvider => 'गेटवे';

  @override
  String get bankingSettlementsBank => 'किस बैंक में आया';

  @override
  String get bankingSettlementsClearing => 'वसूली किस खाते में दर्ज थी';

  @override
  String get bankingSettlementsFile => 'सेटलमेंट रिपोर्ट (CSV)';

  @override
  String get bankingSettlementsImport => 'आयात करें';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$posted भुगतान दर्ज हुए, $skipped पहले से थे, $matched बैंक से मिले।';
  }

  @override
  String get bankingSettlementsSettlementId => 'सेटलमेंट';

  @override
  String get bankingSettlementsSettledOn => 'तारीख़';

  @override
  String get bankingSettlementsPayments => 'भुगतान';

  @override
  String get bankingSettlementsGross => 'वसूली';

  @override
  String get bankingSettlementsRefunds => 'रिफ़ंड';

  @override
  String get bankingSettlementsFees => 'शुल्क';

  @override
  String get bankingSettlementsTax => 'शुल्क पर जीएसटी';

  @override
  String get bankingSettlementsNet => 'प्राप्त राशि';

  @override
  String get bankingSettlementsMatched => 'बैंक में';

  @override
  String get bankingSettlementsNone => 'अभी कोई सेटलमेंट नहीं।';

  @override
  String get bankingErrorsNoHeader =>
      'शीर्षक वाली पंक्ति नहीं मिली। स्टेटमेंट को कॉलम शीर्षकों के साथ CSV में सहेजें।';

  @override
  String get bankingErrorsNoRows => 'फ़ाइल में कोई लेन-देन नहीं मिला।';

  @override
  String get bankingErrorsBadAmount => 'फ़ाइल की कोई राशि पढ़ी नहीं जा सकी।';

  @override
  String get bankingErrorsUnknownFormat =>
      'यह सेटलमेंट रिपोर्ट नहीं लगती (इसमें सेटलमेंट आईडी, राशि और शुल्क के कॉलम चाहिए)।';

  @override
  String get bankingErrorsInvalidFile => 'फ़ाइल पढ़ी नहीं जा सकी।';

  @override
  String get bankingErrorsNotABankAccount =>
      'बैंक खाते के अंतर्गत कोई लेजर चुनें।';

  @override
  String get bankingErrorsFeedNotConnected => 'पहले बैंक फ़ीड जोड़ें।';

  @override
  String get bankingErrorsLineAlreadyMatched =>
      'यह पंक्ति पहले से मिलाई जा चुकी है।';

  @override
  String get bankingErrorsVoucherNotOpen =>
      'यह प्रविष्टि पहले से मिलाई गई है या रद्द है।';

  @override
  String get bankingErrorsWrongDirection =>
      'आया पैसा केवल प्राप्तियों से और गया पैसा केवल भुगतानों से मिलता है।';

  @override
  String get bankingErrorsAmountsDiffer =>
      'प्रविष्टियों का जोड़ पंक्ति की राशि के बराबर नहीं है।';

  @override
  String get bankingErrorsSameAccount => 'कोई दूसरा लेजर चुनें।';

  @override
  String get bankingErrorsInvalidIfsc => 'सही आईएफ़एससी दर्ज करें।';

  @override
  String get assetsRegisterTitle => 'स्थायी संपत्ति';

  @override
  String get assetsRegisterSubtitle =>
      'रजिस्टर, कंपनी अधिनियम के अनुसार मूल्यह्रास, और आयकर ब्लॉक सूची।';

  @override
  String get assetsRegisterNew => 'संपत्ति जोड़ें';

  @override
  String get assetsRegisterCode => 'कोड';

  @override
  String get assetsRegisterName => 'संपत्ति';

  @override
  String get assetsRegisterClass => 'वर्ग';

  @override
  String get assetsRegisterPurchased => 'ख़रीदी';

  @override
  String get assetsRegisterPutToUse => 'उपयोग आरंभ';

  @override
  String get assetsRegisterCost => 'लागत';

  @override
  String get assetsRegisterAccumulated => 'अब तक मूल्यह्रास';

  @override
  String get assetsRegisterBookValue => 'बही मूल्य';

  @override
  String get assetsRegisterStatus => 'स्थिति';

  @override
  String get assetsRegisterStatusesActive => 'उपयोग में';

  @override
  String get assetsRegisterStatusesDisposed => 'बेची / हटाई गई';

  @override
  String get assetsRegisterLocation => 'स्थान';

  @override
  String get assetsRegisterSerialNo => 'सीरियल नं.';

  @override
  String get assetsRegisterCustodian => 'किसके पास';

  @override
  String get assetsRegisterNone => 'अभी कोई संपत्ति नहीं।';

  @override
  String get assetsClassesTitle => 'संपत्ति वर्ग';

  @override
  String get assetsClassesPresets => 'मानक वर्ग जोड़ें';

  @override
  String get assetsClassesPreset => 'वर्ग';

  @override
  String get assetsClassesAdd => 'जोड़ें';

  @override
  String get assetsClassesCustom => 'या अपना वर्ग बनाएँ';

  @override
  String get assetsClassesName => 'नाम';

  @override
  String get assetsClassesMethod => 'पद्धति';

  @override
  String get assetsClassesMethodsSlm => 'सीधी रेखा';

  @override
  String get assetsClassesMethodsWdv => 'घटते मूल्य';

  @override
  String get assetsClassesLife => 'उपयोगी जीवन (वर्ष)';

  @override
  String get assetsClassesResidual => 'अवशिष्ट मूल्य %';

  @override
  String get assetsClassesItBlock => 'आयकर ब्लॉक';

  @override
  String get assetsClassesItRate => 'कर दर %';

  @override
  String get assetsClassesBlocksBuilding => 'भवन';

  @override
  String get assetsClassesBlocksPlantMachinery => 'संयंत्र और मशीनरी';

  @override
  String get assetsClassesBlocksFurniture => 'फ़र्नीचर और फ़िटिंग';

  @override
  String get assetsClassesBlocksComputers => 'कंप्यूटर और सॉफ़्टवेयर';

  @override
  String get assetsClassesBlocksIntangibles => 'अमूर्त संपत्ति';

  @override
  String get assetsFormAcquisition => 'कैसे आई';

  @override
  String get assetsFormAcquisitionsSupplier => 'उधार पर ख़रीदी';

  @override
  String get assetsFormAcquisitionsPaid => 'नकद या बैंक से भुगतान';

  @override
  String get assetsFormAcquisitionsOpening => 'पहले से खातों में (आगे लाई गई)';

  @override
  String get assetsFormSupplier => 'आपूर्तिकर्ता';

  @override
  String get assetsFormPaidFrom => 'किससे भुगतान';

  @override
  String get assetsFormGstRate => 'जीएसटी दर % (इनपुट क्रेडिट लिया)';

  @override
  String get assetsFormSupplierGstin => 'आपूर्तिकर्ता का जीएसटीआईएन';

  @override
  String get assetsFormInvoiceRef => 'बिल नं.';

  @override
  String get assetsFormOpeningAccumulated => 'पहले लगाया गया मूल्यह्रास';

  @override
  String get assetsFormNotes => 'टिप्पणी';

  @override
  String get assetsFormSave => 'संपत्ति जोड़ें';

  @override
  String get assetsDetailHistory => 'लगाया गया मूल्यह्रास';

  @override
  String get assetsDetailPeriod => 'अवधि';

  @override
  String get assetsDetailDays => 'दिन';

  @override
  String get assetsDetailVoucher => 'प्रविष्टि';

  @override
  String get assetsDetailDispose => 'बेचें या हटाएँ';

  @override
  String get assetsDetailDisposeDate => 'तारीख़';

  @override
  String get assetsDetailSaleValue => 'बिक्री मूल्य (₹, हटाने पर 0)';

  @override
  String get assetsDetailReceivedIn => 'किसमें प्राप्त';

  @override
  String get assetsDetailSaleGst => 'बिक्री पर जीएसटी %';

  @override
  String get assetsDetailBuyerState => 'ख़रीदार का राज्य (यदि दूसरा हो)';

  @override
  String get assetsDetailDisposeButton => 'बिक्री दर्ज करें';

  @override
  String assetsDetailDisposed(String date, String value) {
    return '$date को $value में बेची';
  }

  @override
  String get assetsDetailProfit => 'बिक्री पर लाभ';

  @override
  String get assetsDetailLoss => 'बिक्री पर हानि';

  @override
  String get assetsDetailPurchase => 'ख़रीद प्रविष्टि';

  @override
  String get assetsDepreciationTitle => 'मूल्यह्रास';

  @override
  String get assetsDepreciationSubtitle =>
      'किसी माह, तिमाही या वर्ष का मूल्यह्रास लगाएँ। हर संपत्ति पिछली बार जहाँ तक लगा था वहाँ से आगे चलती है।';

  @override
  String get assetsDepreciationFrom => 'से';

  @override
  String get assetsDepreciationTo => 'तक';

  @override
  String get assetsDepreciationPreview => 'गणना करें';

  @override
  String get assetsDepreciationPost => 'मूल्यह्रास दर्ज करें';

  @override
  String get assetsDepreciationTotal => 'कुल';

  @override
  String get assetsDepreciationRuns => 'दर्ज मूल्यह्रास';

  @override
  String get assetsDepreciationNone => 'इस अवधि में लगाने को कुछ नहीं।';

  @override
  String get assetsDepreciationCancel => 'रद्द करें';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count संपत्तियाँ',
      one: '$count संपत्ति',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'आयकर मूल्यह्रास';

  @override
  String get assetsItSubtitle =>
      'ब्लॉक के अनुसार, कर लेखा-परीक्षा रिपोर्ट (फ़ॉर्म 3CD, खंड 18) की तरह। 180 दिन से कम उपयोग वाली नई संपत्ति पर आधी दर।';

  @override
  String get assetsItFy => 'वर्ष';

  @override
  String get assetsItBlock => 'ब्लॉक';

  @override
  String get assetsItRate => 'दर';

  @override
  String get assetsItOpening => 'आरंभिक WDV';

  @override
  String get assetsItAddFull => 'जोड़ (180 दिन या अधिक)';

  @override
  String get assetsItAddHalf => 'जोड़ (180 दिन से कम)';

  @override
  String get assetsItSales => 'बिक्री';

  @override
  String get assetsItDepreciation => 'मूल्यह्रास';

  @override
  String get assetsItClosing => 'अंतिम WDV';

  @override
  String get assetsItGain => 'अल्पकालिक लाभ';

  @override
  String get assetsItLoss => 'अल्पकालिक हानि';

  @override
  String get assetsItOpeningTitle => 'आरंभिक घटा हुआ मूल्य';

  @override
  String get assetsItOpeningHint =>
      'पहले वर्ष के आरंभ में हर ब्लॉक का WDV अपने पिछले आयकर रिटर्न से दर्ज करें; आगे के वर्ष अपने आप चलते हैं।';

  @override
  String get assetsItSave => 'सहेजें';

  @override
  String get assetsItTotal => 'कुल';

  @override
  String get assetsItNone => 'इस वर्ष कोई संपत्ति नहीं।';

  @override
  String get assetsErrorsClassExists => 'यह वर्ग पहले से है।';

  @override
  String get assetsErrorsClassIncomplete => 'नाम, जीवन और कर ब्लॉक भरें।';

  @override
  String get assetsErrorsUnknownPreset => 'वर्ग चुनें।';

  @override
  String get assetsErrorsInvalidLife => 'उपयोगी जीवन वर्षों में दर्ज करें।';

  @override
  String get assetsErrorsInvalidResidual =>
      'घटते मूल्य पद्धति में अवशिष्ट मूल्य 0% से अधिक चाहिए।';

  @override
  String get assetsErrorsUnknownClass => 'वर्ग चुनें।';

  @override
  String get assetsErrorsClassArchived => 'यह वर्ग संग्रहीत है।';

  @override
  String get assetsErrorsInvalidCost => 'लागत दर्ज करें।';

  @override
  String get assetsErrorsUsedBeforeBought =>
      'ख़रीद से पहले उपयोग नहीं हो सकता।';

  @override
  String get assetsErrorsAccountRequired => 'लेजर चुनें।';

  @override
  String get assetsErrorsNotASupplier => 'आपूर्तिकर्ता चुनें।';

  @override
  String get assetsErrorsNotCashOrBank => 'नकद या बैंक लेजर चुनें।';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'इनपुट क्रेडिट के लिए आपूर्तिकर्ता का जीएसटीआईएन दर्ज करें।';

  @override
  String get assetsErrorsPeriodCrossesYear =>
      'अवधि एक ही वित्त वर्ष में होनी चाहिए।';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'इस अवधि में लगाने को कुछ नहीं।';

  @override
  String get assetsErrorsLaterRunExists =>
      'बाद का मूल्यह्रास इन संपत्तियों पर लगा है; पहले उसे रद्द करें।';

  @override
  String get assetsErrorsAssetDisposed => 'इसमें की एक संपत्ति बिक चुकी है।';

  @override
  String get assetsErrorsAlreadyDisposed => 'यह संपत्ति पहले ही बिक चुकी है।';

  @override
  String get assetsErrorsSoldBeforeUse =>
      'बिक्री की तारीख़ उपयोग आरंभ से पहले है।';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'बिक्री की तारीख़ के बाद तक मूल्यह्रास लगा है; पहले उसे रद्द करें।';

  @override
  String get assetsErrorsInvalidDepreciation =>
      'मूल्यह्रास की गणना नहीं हो सकी।';

  @override
  String get assetsErrorsInvalidFy => 'वर्ष चुनें।';

  @override
  String get expensesClaimsTitle => 'व्यय दावे';

  @override
  String get expensesClaimsSubtitle =>
      'कर्मचारी अपना ख़र्च दावा करते हैं; स्वीकृति पर यह खातों में दर्ज होता है (जहाँ अनुमति हो वहाँ जीएसटी क्रेडिट के साथ) और भुगतान से निपटता है।';

  @override
  String get expensesClaimsNew => 'नया दावा';

  @override
  String get expensesClaimsNumber => 'दावा';

  @override
  String get expensesClaimsEmployee => 'कर्मचारी';

  @override
  String get expensesClaimsDate => 'तारीख़';

  @override
  String get expensesClaimsClaimTitle => 'उद्देश्य';

  @override
  String get expensesClaimsTotal => 'राशि';

  @override
  String get expensesClaimsItc => 'जीएसटी क्रेडिट';

  @override
  String get expensesClaimsStatus => 'स्थिति';

  @override
  String get expensesClaimsStatusesDraft => 'मसौदा';

  @override
  String get expensesClaimsStatusesSubmitted => 'स्वीकृति की प्रतीक्षा';

  @override
  String get expensesClaimsStatusesApproved => 'स्वीकृत';

  @override
  String get expensesClaimsStatusesRejected => 'अस्वीकृत';

  @override
  String get expensesClaimsStatusesPaid => 'भुगतान हुआ';

  @override
  String get expensesClaimsStatusesCancelled => 'रद्द';

  @override
  String get expensesClaimsWaiting => 'स्वीकृति की प्रतीक्षा';

  @override
  String get expensesClaimsToPay => 'स्वीकृत, भुगतान बाकी';

  @override
  String get expensesClaimsNone => 'अभी कोई दावा नहीं।';

  @override
  String get expensesClaimsAll => 'सभी';

  @override
  String get expensesFormTitle => 'व्यय दावा';

  @override
  String get expensesFormProject => 'परियोजना';

  @override
  String get expensesFormLines => 'व्यय';

  @override
  String get expensesFormCategory => 'श्रेणी';

  @override
  String get expensesFormDescription => 'विवरण';

  @override
  String get expensesFormAmount => 'राशि (₹)';

  @override
  String get expensesFormGstRate => 'जीएसटी %';

  @override
  String get expensesFormVendor => 'विक्रेता';

  @override
  String get expensesFormVendorGstin => 'विक्रेता का जीएसटीआईएन';

  @override
  String get expensesFormInvoiceNo => 'बिल नं.';

  @override
  String get expensesFormReceipt => 'रसीद';

  @override
  String get expensesFormUpload => 'संलग्न करें';

  @override
  String get expensesFormRead => 'रसीद पढ़ें';

  @override
  String get expensesFormReading => 'पढ़ रहे हैं…';

  @override
  String get expensesFormReadDone => 'रसीद से भरा गया। कृपया जाँच लें।';

  @override
  String get expensesFormReadNone =>
      'यह रसीद पढ़ी नहीं जा सकी; कृपया विवरण भरें।';

  @override
  String get expensesFormReadDemo =>
      'अपने आप पढ़ना चालू नहीं है; कृपया विवरण भरें।';

  @override
  String get expensesFormAddLine => 'व्यय जोड़ें';

  @override
  String get expensesFormSaveDraft => 'मसौदा सहेजें';

  @override
  String get expensesFormSubmit => 'स्वीकृति के लिए भेजें';

  @override
  String get expensesFormItcHint =>
      'जीएसटी क्रेडिट तब लिया जाता है जब बिल कंपनी के नाम पर विक्रेता के जीएसटीआईएन वाला कर बीजक हो और श्रेणी इसकी अनुमति दे।';

  @override
  String get expensesDetailApprove => 'स्वीकृत करें';

  @override
  String get expensesDetailReject => 'अस्वीकार करें';

  @override
  String get expensesDetailReason => 'कारण';

  @override
  String get expensesDetailPay => 'भुगतान करें';

  @override
  String get expensesDetailPayFrom => 'किससे भुगतान';

  @override
  String get expensesDetailPaidOn => 'भुगतान की तारीख़';

  @override
  String get expensesDetailEdit => 'बदलें';

  @override
  String get expensesDetailSubmit => 'भेजें';

  @override
  String get expensesDetailCancel => 'दावा रद्द करें';

  @override
  String get expensesDetailVoucher => 'व्यय प्रविष्टि';

  @override
  String get expensesDetailPaymentVoucher => 'भुगतान';

  @override
  String expensesDetailRejected(String reason) {
    return 'अस्वीकृत: $reason';
  }

  @override
  String get expensesDetailReceipt => 'रसीद देखें';

  @override
  String get expensesCategoriesTitle => 'व्यय श्रेणियाँ';

  @override
  String get expensesCategoriesSubtitle =>
      'हर तरह का व्यय किस लेजर में जाता है, सीमाएँ, और जीएसटी क्रेडिट रुका है या नहीं (धारा 17(5))।';

  @override
  String get expensesCategoriesName => 'श्रेणी';

  @override
  String get expensesCategoriesAccount => 'लेजर';

  @override
  String get expensesCategoriesBlocked => 'जीएसटी क्रेडिट नहीं';

  @override
  String get expensesCategoriesLimit => 'प्रति दावा सीमा (₹)';

  @override
  String get expensesCategoriesReceiptAbove => 'इससे ऊपर रसीद ज़रूरी (₹)';

  @override
  String get expensesCategoriesAdd => 'श्रेणी जोड़ें';

  @override
  String get expensesCategoriesSave => 'सहेजें';

  @override
  String get expensesErrorsNoLines => 'कम से कम एक व्यय जोड़ें।';

  @override
  String get expensesErrorsUnknownCategory => 'श्रेणी चुनें।';

  @override
  String get expensesErrorsCategoryArchived => 'यह श्रेणी संग्रहीत है।';

  @override
  String get expensesErrorsInvalidAmount => 'राशि दर्ज करें।';

  @override
  String get expensesErrorsReceiptRequired => 'इस व्यय की रसीद संलग्न करें।';

  @override
  String get expensesErrorsOverLimit =>
      'यह श्रेणी की प्रति दावा सीमा से अधिक है।';

  @override
  String get expensesErrorsInvalidGstin =>
      'विक्रेता का जीएसटीआईएन सही नहीं है।';

  @override
  String get expensesErrorsUnknownEmployee => 'कर्मचारी चुनें।';

  @override
  String get expensesErrorsUnknownProject => 'परियोजना चुनें।';

  @override
  String get expensesErrorsClaimLocked =>
      'केवल मसौदा या अस्वीकृत दावा बदला जा सकता है।';

  @override
  String get expensesErrorsClaimNotSubmitted =>
      'यह दावा स्वीकृति की प्रतीक्षा में नहीं है।';

  @override
  String get expensesErrorsClaimNotApproved => 'पहले दावा स्वीकृत करें।';

  @override
  String get expensesErrorsClaimPaid =>
      'भुगतान हो चुका दावा रद्द नहीं हो सकता; पहले भुगतान रद्द करें।';

  @override
  String get expensesErrorsPaidBeforeClaim =>
      'भुगतान की तारीख़ दावे से पहले है।';

  @override
  String get expensesErrorsCategoryExists => 'यह श्रेणी पहले से है।';

  @override
  String get expensesErrorsNotAnExpenseAccount => 'कोई व्यय लेजर चुनें।';

  @override
  String get expensesErrorsFileType =>
      'फ़ोटो (JPG, PNG, WebP) या PDF संलग्न करें।';

  @override
  String get expensesErrorsFileTooLarge => 'फ़ाइल 5 MB से बड़ी है।';

  @override
  String get expensesErrorsFileEmpty => 'फ़ाइल ख़ाली है।';

  @override
  String get projectsListTitle => 'परियोजनाएँ';

  @override
  String get projectsListSubtitle => 'हर काम के कार्य, समय, लागत और बिलिंग।';

  @override
  String get projectsListNew => 'नई परियोजना';

  @override
  String get projectsListCode => 'कोड';

  @override
  String get projectsListName => 'परियोजना';

  @override
  String get projectsListCustomer => 'ग्राहक';

  @override
  String get projectsListBilling => 'बिलिंग';

  @override
  String get projectsListBillingsFixed => 'निश्चित मूल्य';

  @override
  String get projectsListBillingsTimeMaterial => 'समय और सामग्री';

  @override
  String get projectsListBillingsNonBillable => 'आंतरिक';

  @override
  String get projectsListStatus => 'स्थिति';

  @override
  String get projectsListStatusesActive => 'सक्रिय';

  @override
  String get projectsListStatusesOnHold => 'रुकी हुई';

  @override
  String get projectsListStatusesCompleted => 'पूर्ण';

  @override
  String get projectsListStatusesCancelled => 'रद्द';

  @override
  String get projectsListRevenue => 'बिल किया';

  @override
  String get projectsListCost => 'लागत';

  @override
  String get projectsListMargin => 'मार्जिन';

  @override
  String get projectsListHours => 'घंटे';

  @override
  String get projectsListNone => 'अभी कोई परियोजना नहीं।';

  @override
  String get projectsFormContractValue => 'अनुबंध मूल्य (₹)';

  @override
  String get projectsFormBudgetCost => 'बजट लागत (₹)';

  @override
  String get projectsFormBudgetHours => 'बजट घंटे';

  @override
  String get projectsFormBillRate => 'प्रति घंटा बिल दर (₹)';

  @override
  String get projectsFormBillingItem => 'बीजक में (सेवा आइटम)';

  @override
  String get projectsFormStartOn => 'आरंभ';

  @override
  String get projectsFormEndOn => 'समाप्ति';

  @override
  String get projectsFormNotes => 'टिप्पणी';

  @override
  String get projectsFormSave => 'परियोजना सहेजें';

  @override
  String get projectsDetailLabour => 'श्रम';

  @override
  String get projectsDetailExpenses => 'व्यय';

  @override
  String get projectsDetailPurchases => 'ख़रीद';

  @override
  String get projectsDetailUnbilled => 'बिना बिल का समय';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return 'बजट का $pct%';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return 'घंटों का $pct%';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% मार्जिन';
  }

  @override
  String get projectsDetailTasks => 'कार्य';

  @override
  String get projectsDetailTask => 'कार्य';

  @override
  String get projectsDetailAssignee => 'किसे सौंपा';

  @override
  String get projectsDetailEstimate => 'अनुमान (घं.)';

  @override
  String get projectsDetailLogged => 'दर्ज (घं.)';

  @override
  String get projectsDetailDue => 'नियत तारीख़';

  @override
  String get projectsDetailTaskStatusesTodo => 'करना है';

  @override
  String get projectsDetailTaskStatusesDoing => 'चल रहा है';

  @override
  String get projectsDetailTaskStatusesDone => 'पूर्ण';

  @override
  String get projectsDetailAddTask => 'कार्य जोड़ें';

  @override
  String get projectsDetailMembers => 'टीम और दरें';

  @override
  String get projectsDetailMember => 'व्यक्ति';

  @override
  String get projectsDetailMemberRate => 'बिल दर (₹/घं.)';

  @override
  String get projectsDetailAddMember => 'जोड़ें';

  @override
  String get projectsDetailMilestones => 'पड़ाव';

  @override
  String get projectsDetailMilestone => 'पड़ाव';

  @override
  String get projectsDetailAmount => 'राशि (₹)';

  @override
  String get projectsDetailAddMilestone => 'पड़ाव जोड़ें';

  @override
  String get projectsDetailBill => 'बीजक बनाएँ';

  @override
  String projectsDetailBilled(String number) {
    return 'बीजक $number';
  }

  @override
  String get projectsDetailTime => 'समय';

  @override
  String get projectsDetailBillTime => 'स्वीकृत घंटों का बीजक बनाएँ';

  @override
  String get projectsDetailBillUpTo => 'तक';

  @override
  String get projectsDetailInvoices => 'बीजक';

  @override
  String get projectsDetailEdit => 'परियोजना बदलें';

  @override
  String get projectsDetailRemove => 'हटाएँ';

  @override
  String projectsDetailInvoiced(String number) {
    return 'बीजक $number बना।';
  }

  @override
  String get projectsTimeTitle => 'टाइमशीट';

  @override
  String get projectsTimeSubtitle =>
      'परियोजनाओं पर घंटे दर्ज करें; स्वीकृत बिल योग्य घंटों का बीजक बन सकता है।';

  @override
  String get projectsTimeLog => 'समय दर्ज करें';

  @override
  String get projectsTimeEmployee => 'कर्मचारी';

  @override
  String get projectsTimeProject => 'परियोजना';

  @override
  String get projectsTimeTask => 'कार्य';

  @override
  String get projectsTimeDate => 'तारीख़';

  @override
  String get projectsTimeHours => 'घंटे';

  @override
  String get projectsTimeBillable => 'बिल योग्य';

  @override
  String get projectsTimeNote => 'टिप्पणी';

  @override
  String get projectsTimeSave => 'दर्ज करें';

  @override
  String get projectsTimeApprove => 'स्वीकृत करें';

  @override
  String get projectsTimeReject => 'अस्वीकार करें';

  @override
  String projectsTimeSelected(String count) {
    return '$count चुने';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'भेजा गया';

  @override
  String get projectsTimeStatusesApproved => 'स्वीकृत';

  @override
  String get projectsTimeStatusesRejected => 'अस्वीकृत';

  @override
  String get projectsTimeStatusesBilled => 'बीजक बना';

  @override
  String get projectsTimeTotal => 'कुल';

  @override
  String get projectsTimeNone => 'कोई समय दर्ज नहीं।';

  @override
  String get projectsTimeCostRate => 'लागत/घं.';

  @override
  String get projectsTimeBillRate => 'बिल/घं.';

  @override
  String get projectsTimeDelete => 'हटाएँ';

  @override
  String get projectsErrorsNotACustomer => 'ग्राहक चुनें।';

  @override
  String get projectsErrorsUnknownItem => 'सेवा आइटम चुनें।';

  @override
  String get projectsErrorsEndsBeforeStart =>
      'समाप्ति की तारीख़ आरंभ से पहले है।';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'पहले परियोजना का ग्राहक चुनें।';

  @override
  String get projectsErrorsBillingItemRequired =>
      'परियोजना में बीजक का आइटम चुनें।';

  @override
  String get projectsErrorsMilestoneBilled => 'इस पड़ाव का बीजक बन चुका है।';

  @override
  String get projectsErrorsProjectNotActive => 'परियोजना सक्रिय नहीं है।';

  @override
  String get projectsErrorsInvalidHours => '0 से 24 के बीच घंटे दर्ज करें।';

  @override
  String get projectsErrorsTooManyHours => 'एक दिन में 24 घंटे से अधिक।';

  @override
  String get projectsErrorsUnknownTask => 'इस परियोजना का कोई कार्य चुनें।';

  @override
  String get projectsErrorsTimesheetLocked =>
      'स्वीकृत या बीजक वाला समय बदला नहीं जा सकता।';

  @override
  String get projectsErrorsNothingToBill =>
      'बीजक के लिए कोई स्वीकृत बिल योग्य घंटे नहीं।';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'केवल समय और सामग्री वाली परियोजनाओं का बिल घंटों से बनता है।';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'उस तारीख़ को कर्मचारी कार्यरत नहीं था।';

  @override
  String get projectsErrorsUnknownEmployee => 'कर्मचारी चुनें।';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ग्राहक',
      one: '$count ग्राहक',
    );
    return '$_temp0 60 दिन से अधिक देर से भुगतान कर रहे हैं: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$period का $form $days दिन देर से है';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$period का $form $days दिन में देय है';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count आइटम',
      one: '$count आइटम',
    );
    return '$_temp0 पुनः ऑर्डर स्तर से नीचे हैं';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$count बैंक स्टेटमेंट पंक्तियाँ एक सप्ताह से मिलान की प्रतीक्षा में हैं';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$count व्यय दावे 3 दिन से अधिक से स्वीकृति की प्रतीक्षा में हैं';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count फ़ॉलो-अप',
      one: '$count फ़ॉलो-अप',
    );
    return '$_temp0 देर से हैं';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$name में ऋणात्मक शेष ($amount) है: कोई प्रविष्टि छूटी या ग़लत है';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    return '$count अप्रूवल मेमो छह महीने की इनवॉइस सीमा के पास हैं';
  }

  @override
  String alertsApprovalsOut(num count) {
    return '$count अप्रूवल मेमो का माल 30 दिन से अधिक से बाहर है';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count संवेदनशील बदलाव',
      one: '$count संवेदनशील बदलाव',
    );
    return 'पिछले 7 दिनों में $_temp0 (बैंक विवरण, उधार शर्तें, कर सेटिंग या अधिकार)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count कर्मचारी दस्तावेज़',
      one: '$count कर्मचारी दस्तावेज़',
    );
    return '$_temp0 समाप्त हो चुके हैं या 30 दिन में हो जाएँगे';
  }

  @override
  String get checksTitle => 'जाँच';

  @override
  String get checksSubtitle =>
      'वे प्रविष्टियाँ जिन्हें सीए के देखने से पहले एक बार देख लें: आयकर अधिनियम की नकद सीमाएँ, संभावित दोहरे बिल, लागत से कम बिक्री, शून्य से कम स्टॉक।';

  @override
  String get checksNone => 'कुछ असामान्य नहीं मिला।';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return '$party को एक दिन में $amount नकद दिया। एक व्यक्ति को एक दिन में ₹10,000 से अधिक का नकद व्यय मान्य नहीं (धारा 40A(3)); बैंक से भुगतान करें।';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return '$party से एक दिन में $amount नकद लिया। ₹2 लाख या अधिक नकद लेना मना है (धारा 269ST); जुर्माना उतनी ही राशि है।';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplier ने एक सप्ताह में दो बार $amount का बिल दिया ($first और $second)। क्या एक दोहरा है?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item $rate पर बेचा, जो ख़रीद दर $cost से कम है।';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item $qty $uom पर है: स्टॉक से ज़्यादा बेचा या जारी किया गया।';
  }

  @override
  String get assistantTitle => 'सहायक';

  @override
  String get assistantSubtitle =>
      'बिक्री, बकाया, लाभ, स्टॉक या जीएसटी के बारे में पूछें। यह आपके खाते पढ़ता है; कभी बदलता नहीं।';

  @override
  String get assistantPlaceholder => 'प्रश्न पूछें…';

  @override
  String get assistantSend => 'पूछें';

  @override
  String get assistantThinking => 'देख रहे हैं…';

  @override
  String get assistantClear => 'नई बातचीत';

  @override
  String get assistantDemo =>
      'अंतर्निहित सहायक: आम प्रश्नों के उत्तर देता है। कुछ भी पूछने के लिए एआई सेवा जोड़ें।';

  @override
  String get assistantClaude =>
      'Claude आपके खातों से, आपके अधिकारों के साथ उत्तर देता है।';

  @override
  String get assistantSuggestionsS1 => 'हमें सबसे ज़्यादा किससे लेना है?';

  @override
  String get assistantSuggestionsS2 => 'इस महीने की बिक्री कैसी है?';

  @override
  String get assistantSuggestionsS3 => 'इस महीने का लाभ कितना है?';

  @override
  String get assistantSuggestionsS4 =>
      'कौन से आइटम पुनः ऑर्डर स्तर से नीचे हैं?';

  @override
  String get assistantSuggestionsS5 => 'कोई प्रविष्टि जो जाँचनी चाहिए?';

  @override
  String assistantTools(String tools) {
    return 'देखा: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'सहायक व्यस्त है; एक मिनट में फिर कोशिश करें।';

  @override
  String get assistantErrorsAssistantFailed => 'सहायक अभी उत्तर नहीं दे सका।';

  @override
  String get assistantErrorsEmptyQuestion => 'प्रश्न लिखें।';

  @override
  String get crmLeadsTitle => 'लीड';

  @override
  String get crmLeadsSubtitle => 'पहली पूछताछ से ऑर्डर तक संभावित ग्राहक।';

  @override
  String get crmLeadsNew => 'नई लीड';

  @override
  String get crmLeadsName => 'संपर्क व्यक्ति';

  @override
  String get crmLeadsOrganisation => 'व्यवसाय';

  @override
  String get crmLeadsPhone => 'मोबाइल';

  @override
  String get crmLeadsEmail => 'ईमेल';

  @override
  String get crmLeadsGstin => 'जीएसटीआईएन';

  @override
  String get crmLeadsState => 'राज्य';

  @override
  String get crmLeadsCity => 'शहर';

  @override
  String get crmLeadsSource => 'स्रोत';

  @override
  String get crmLeadsSourcesWalkIn => 'सीधे आए';

  @override
  String get crmLeadsSourcesReferral => 'सिफ़ारिश';

  @override
  String get crmLeadsSourcesWebsite => 'वेबसाइट';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'व्यापार मेला';

  @override
  String get crmLeadsSourcesOther => 'अन्य';

  @override
  String get crmLeadsStage => 'चरण';

  @override
  String get crmLeadsStagesNew => 'नई';

  @override
  String get crmLeadsStagesContacted => 'संपर्क हुआ';

  @override
  String get crmLeadsStagesQualified => 'योग्य';

  @override
  String get crmLeadsStagesProposal => 'प्रस्ताव भेजा';

  @override
  String get crmLeadsStagesWon => 'जीती';

  @override
  String get crmLeadsStagesLost => 'खोई';

  @override
  String get crmLeadsValue => 'अनुमानित मूल्य (₹)';

  @override
  String get crmLeadsExpectedClose => 'बंद होने की अनुमानित तारीख़';

  @override
  String get crmLeadsOwner => 'ज़िम्मेदार';

  @override
  String get crmLeadsNotes => 'टिप्पणी';

  @override
  String get crmLeadsNextFollowUp => 'अगला फ़ॉलो-अप';

  @override
  String get crmLeadsSave => 'सहेजें';

  @override
  String get crmLeadsNone => 'अभी कोई लीड नहीं।';

  @override
  String get crmLeadsSearch => 'नाम, व्यवसाय, मोबाइल या शहर खोजें';

  @override
  String crmLeadsWeighted(String amount) {
    return 'भारित $amount';
  }

  @override
  String get crmLeadsConvert => 'जीती: ग्राहक बनाएँ';

  @override
  String get crmLeadsLost => 'खोई चिह्नित करें';

  @override
  String get crmLeadsLostReason => 'क्यों खोई?';

  @override
  String get crmLeadsEdit => 'लीड बदलें';

  @override
  String get crmActivitiesTitle => 'फ़ॉलो-अप';

  @override
  String get crmActivitiesSubtitle =>
      'कॉल, बैठकें और कार्य, सबसे पहले देय पहले।';

  @override
  String get crmActivitiesAdd => 'जोड़ें';

  @override
  String get crmActivitiesKind => 'प्रकार';

  @override
  String get crmActivitiesKindsCall => 'कॉल';

  @override
  String get crmActivitiesKindsMeeting => 'बैठक';

  @override
  String get crmActivitiesKindsTask => 'कार्य';

  @override
  String get crmActivitiesKindsNote => 'नोट';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'ईमेल';

  @override
  String get crmActivitiesSubject => 'क्या करना है या क्या हुआ';

  @override
  String get crmActivitiesDue => 'कब';

  @override
  String get crmActivitiesDone => 'पूर्ण चिह्नित करें';

  @override
  String get crmActivitiesReopen => 'अपूर्ण चिह्नित करें';

  @override
  String get crmActivitiesNotes => 'टिप्पणी';

  @override
  String get crmActivitiesNone => 'यहाँ कुछ नहीं है।';

  @override
  String get crmActivitiesOpen => 'खुले';

  @override
  String get crmActivitiesAll => 'सभी';

  @override
  String get crmActivitiesLate => 'देर';

  @override
  String get crmMessagesSend => 'WhatsApp भेजें';

  @override
  String get crmMessagesTemplate => 'टेम्पलेट';

  @override
  String crmMessagesSent(String to) {
    return '$to को भेजा गया।';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'नहीं भेजा गया: $error';
  }

  @override
  String get crmMessagesDemo =>
      'डेमो: WhatsApp Business जुड़ने तक संदेश दर्ज होते हैं पर पहुँचते नहीं।';

  @override
  String get crmMessagesRemind => 'भुगतान अनुस्मारक भेजें';

  @override
  String get crmTemplatesTitle => 'संदेश टेम्पलेट';

  @override
  String get crmTemplatesSubtitle =>
      'नाम, राशि और तारीख़ के क्रमांकित रिक्त स्थानों वाले WhatsApp संदेश। ग्राहक को पहले संदेश भेजने के लिए टेम्पलेट Meta से स्वीकृत होना चाहिए; उसका स्वीकृत नाम दें।';

  @override
  String get crmTemplatesName => 'नाम (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'पाठ';

  @override
  String get crmTemplatesCategory => 'श्रेणी';

  @override
  String get crmTemplatesCategoriesUtility => 'सूचना (बिल, अनुस्मारक)';

  @override
  String get crmTemplatesCategoriesMarketing => 'मार्केटिंग';

  @override
  String get crmTemplatesProviderName => 'Meta पर स्वीकृत नाम';

  @override
  String get crmTemplatesAdd => 'टेम्पलेट जोड़ें';

  @override
  String get crmTemplatesSave => 'सहेजें';

  @override
  String get crmCustomerTitle => 'ग्राहक';

  @override
  String get crmCustomerBalance => 'शेष';

  @override
  String get crmCustomerSalesThisYear => 'इस वर्ष की बिक्री';

  @override
  String get crmCustomerSalesLastYear => 'पिछला वर्ष';

  @override
  String get crmCustomerOpenItems => 'खुले बिल';

  @override
  String get crmCustomerInvoices => 'हाल के बीजक';

  @override
  String get crmCustomerReceipts => 'हाल में प्राप्त भुगतान';

  @override
  String get crmCustomerOrders => 'खुले कोटेशन और ऑर्डर';

  @override
  String get crmCustomerActivities => 'गतिविधि';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'लीड $code से ($source)';
  }

  @override
  String get crmCustomerLedger => 'लेजर विवरण';

  @override
  String get crmErrorsInvalidPhone =>
      '10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।';

  @override
  String get crmErrorsInvalidGstin => 'जीएसटीआईएन सही नहीं है।';

  @override
  String get crmErrorsConvertToWin =>
      'लीड जीतने के लिए “जीती: ग्राहक बनाएँ” का उपयोग करें।';

  @override
  String get crmErrorsLostReasonRequired => 'बताएँ कि क्यों खोई।';

  @override
  String get crmErrorsAlreadyConverted => 'यह लीड पहले से ग्राहक है।';

  @override
  String get crmErrorsLeadOrCustomerRequired => 'लीड या ग्राहक चुनें।';

  @override
  String get crmErrorsUnknownTemplate => 'टेम्पलेट चुनें।';

  @override
  String get crmErrorsMissingParam => 'टेम्पलेट के सभी रिक्त स्थान भरें।';

  @override
  String get crmErrorsTemplateTooLong => 'टेम्पलेट बहुत लंबा है।';

  @override
  String get crmErrorsTemplateExists => 'इस नाम का टेम्पलेट पहले से है।';

  @override
  String get crmErrorsNothingOutstanding => 'इस ग्राहक से कुछ बकाया नहीं है।';

  @override
  String get crmErrorsInvalidTemplateName =>
      'केवल छोटे अक्षर, अंक और _ का उपयोग करें।';

  @override
  String get crmErrorsUnknownAccount => 'ग्राहक चुनें।';

  @override
  String get crmErrorsInvalidStage => 'चरण चुनें।';

  @override
  String get priceListsTitle => 'मूल्य सूची';

  @override
  String get priceListsSubtitle =>
      'थोक, वितरक या खुदरा दरें। सूची वाले ग्राहक को नए ऑर्डर और इनवॉइस पर उसकी दरें मिलती हैं।';

  @override
  String get priceListsOne => 'मूल्य सूची';

  @override
  String get priceListsNone => 'कोई नहीं (बिक्री दर)';

  @override
  String get priceListsNew => 'नई मूल्य सूची';

  @override
  String get priceListsName => 'नाम';

  @override
  String get priceListsDiscountPct => 'बिक्री दर पर छूट (%)';

  @override
  String get priceListsDiscountHint => 'बिना तय दर वाले हर आइटम पर लागू';

  @override
  String get priceListsFixedRates => 'तय दरें';

  @override
  String get priceListsCustomers => 'ग्राहक';

  @override
  String get priceListsEmpty => 'अभी कोई मूल्य सूची नहीं।';

  @override
  String get priceListsAddRate => 'तय दर जोड़ें';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'इस नाम की मूल्य सूची पहले से है।';

  @override
  String get priceListsErrorsDuplicateItem => 'एक आइटम दो बार है।';

  @override
  String get agentsTitle => 'दलाल और एजेंट';

  @override
  String get agentsSubtitle =>
      'हर एजेंट के लाए ग्राहकों से मिले पैसे पर कमीशन। माल वापस आने पर कमीशन वापस होता है।';

  @override
  String get agentsIsAgent => 'दलाल या एजेंट (कमीशन पाता है)';

  @override
  String get agentsCommissionPct => 'कमीशन (%)';

  @override
  String get agentsCommissionHint =>
      'कर योग्य मूल्य पर, जैसे-जैसे ग्राहक भुगतान करे';

  @override
  String get agentsAgent => 'एजेंट';

  @override
  String get agentsNoAgent => 'कोई एजेंट नहीं';

  @override
  String get agentsSalesman => 'सेल्समैन';

  @override
  String get agentsNoSalesman => 'कोई सेल्समैन नहीं';

  @override
  String get agentsEarned => 'अर्जित';

  @override
  String get agentsBilled => 'बिल किया';

  @override
  String get agentsDue => 'देय';

  @override
  String get agentsInvoice => 'बिल';

  @override
  String get agentsBase => 'कर योग्य मूल्य';

  @override
  String get agentsReceived => 'प्राप्त';

  @override
  String get agentsNoInvoices => 'अभी कोई बिल नहीं।';

  @override
  String get agentsMakeBill => 'दलाली बिल बनाएँ';

  @override
  String get agentsEmpty =>
      'अभी कोई एजेंट नहीं। खातों की सूची में किसी खाते को दलाल या एजेंट चिह्नित करें।';

  @override
  String get agentsBills => 'दलाली बिल';

  @override
  String get agentsNumber => 'संख्या';

  @override
  String get agentsCommission => 'कमीशन';

  @override
  String get agentsTds => 'टीडीएस';

  @override
  String get agentsNet => 'शुद्ध देय';

  @override
  String get agentsNoBills => 'अभी कोई दलाली बिल नहीं।';

  @override
  String agentsBillFor(String name, String amount) {
    return '$name को देय $amount कमीशन का बिल बनाएँ।';
  }

  @override
  String get agentsTdsRate => 'टीडीएस दर (%)';

  @override
  String get agentsTdsHint =>
      'खाली छोड़ें: साल का कमीशन ₹20,000 से ऊपर होने पर 194H के तहत 2%';

  @override
  String get agentsPost => 'बिल पोस्ट करें';

  @override
  String get agentsCancelBill => 'बिल रद्द करें';

  @override
  String get agentsErrorsNothingToBill =>
      'उस तारीख तक इस एजेंट का कुछ देय नहीं है।';

  @override
  String get agentsErrorsNotAnAgent => 'दलाल या एजेंट चिह्नित खाता चुनें।';

  @override
  String get targetsTitle => 'सेल्समैन लक्ष्य';

  @override
  String get targetsSubtitle =>
      'कमीशन स्लैब के साथ मासिक लक्ष्य, हर सेल्समैन की बिक्री (वापसी घटाकर) के मुकाबले।';

  @override
  String get targetsPrevious => 'पिछला महीना';

  @override
  String get targetsNext => 'अगला महीना';

  @override
  String get targetsEdit => 'लक्ष्य तय करें';

  @override
  String get targetsChooseSalesman => 'सेल्समैन चुनें';

  @override
  String get targetsTarget => 'लक्ष्य';

  @override
  String get targetsSlabs => 'स्लैब';

  @override
  String get targetsSlabsHint =>
      'स्लैब = लक्ष्य का कितना प्रतिशत : कमीशन प्रतिशत। जैसे 0:1, 100:2 लक्ष्य से नीचे 1% और लक्ष्य पर या ऊपर 2% देता है।';

  @override
  String get targetsAdd => 'सेल्समैन जोड़ें';

  @override
  String get targetsCopyLast => 'पिछले महीने से कॉपी करें';

  @override
  String get targetsAchieved => 'हासिल';

  @override
  String get targetsProgress => 'लक्ष्य का';

  @override
  String get targetsRate => 'दर';

  @override
  String targetsInvoices(num n) {
    return '$n बिल';
  }

  @override
  String targetsReturns(String amount) {
    return 'वापसी $amount';
  }

  @override
  String get targetsNoTarget => 'कोई लक्ष्य नहीं';

  @override
  String get targetsEmpty => 'इस महीने कोई लक्ष्य या सेल्समैन की बिक्री नहीं।';

  @override
  String get targetsNote =>
      'बिक्री = सेल्समैन वाले बिलों का कर योग्य मूल्य, उस महीने उन बिलों पर जारी क्रेडिट नोट घटाकर।';

  @override
  String get targetsErrorsInvalid =>
      'हर पंक्ति में सेल्समैन, रुपये में लक्ष्य और 0:1, 100:2 जैसे स्लैब चाहिए।';

  @override
  String get targetsErrorsDuplicateSalesman => 'एक सेल्समैन दो बार है।';

  @override
  String get targetsErrorsDuplicateSlab =>
      'दो स्लैब एक ही प्रतिशत से शुरू होते हैं।';

  @override
  String get targetsErrorsUnknownEmployee =>
      'अपने कर्मचारियों में से सेल्समैन चुनें।';

  @override
  String get schemesTitle => 'स्कीम और ऑफ़र';

  @override
  String get schemesSubtitle =>
      'काउंटर पर अपने आप लगने वाले ऑफ़र: प्रतिशत छूट, रकम छूट, X खरीदें Y पाएँ, स्लैब और कॉम्बो।';

  @override
  String get schemesNew => 'नई स्कीम';

  @override
  String get schemesName => 'नाम';

  @override
  String get schemesOffer => 'ऑफ़र';

  @override
  String get schemesOn => 'किस पर';

  @override
  String get schemesDates => 'तारीखें';

  @override
  String get schemesOff => 'बंद';

  @override
  String get schemesEmpty => 'अभी कोई स्कीम नहीं।';

  @override
  String get schemesRules =>
      'हर पंक्ति पर ज़्यादा से ज़्यादा एक स्कीम लगती है, और बिल पर वह मेल लगता है जिससे ग्राहक की सबसे ज़्यादा बचत हो। अपनी छूट वाली पंक्ति पर स्कीम नहीं लगती।';

  @override
  String get schemesEverything => 'सब कुछ';

  @override
  String get schemesAlways => 'हमेशा';

  @override
  String get schemesNow => 'अभी से';

  @override
  String get schemesNoEnd => 'कोई अंतिम तारीख नहीं';

  @override
  String schemesRange(String from, String to) {
    return '$from से $to';
  }

  @override
  String get schemesKind => 'प्रकार';

  @override
  String get schemesStartsOn => 'से';

  @override
  String get schemesEndsOn => 'तक';

  @override
  String get schemesPct => 'छूट (%)';

  @override
  String get schemesOffPct => 'अतिरिक्त पीस पर छूट (%)';

  @override
  String get schemesOffPctHint => '100 से मुफ़्त';

  @override
  String get schemesAmount => 'छूट की रकम (₹)';

  @override
  String get schemesMinValue => 'इन वस्तुओं पर न्यूनतम (₹)';

  @override
  String get schemesBuy => 'खरीदें';

  @override
  String get schemesGet => 'पाएँ';

  @override
  String get schemesSlabs => 'स्लैब';

  @override
  String get schemesQtySlabsHint => 'पीस : प्रतिशत छूट, जैसे 3:10, 5:20';

  @override
  String get schemesValueSlabsHint =>
      'रुपये : प्रतिशत छूट, जैसे 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'कॉम्बो कीमत (₹)';

  @override
  String get schemesComboItems => 'कॉम्बो की वस्तुएँ';

  @override
  String get schemesItem => 'वस्तु';

  @override
  String get schemesQty => 'मात्रा';

  @override
  String get schemesAddItem => 'वस्तु जोड़ें';

  @override
  String get schemesAddStyle => 'स्टाइल जोड़ें';

  @override
  String get schemesScopeHint =>
      'सभी वस्तुओं के लिए इन्हें खाली छोड़ें; वरना इनमें से किसी से भी मेल खाने वाली वस्तु गिनी जाएगी।';

  @override
  String get schemesBrands => 'ब्रांड';

  @override
  String get schemesCategories => 'श्रेणियाँ';

  @override
  String get schemesStyles => 'स्टाइल';

  @override
  String get schemesItems => 'वस्तुएँ';

  @override
  String get schemesCommaHint => 'कॉमा से अलग करें';

  @override
  String get schemesActive => 'चालू';

  @override
  String get schemesKindsPercent => 'प्रतिशत छूट';

  @override
  String get schemesKindsAmountOff => 'रकम छूट';

  @override
  String get schemesKindsQtySlab => 'मात्रा स्लैब';

  @override
  String get schemesKindsValueSlab => 'मूल्य स्लैब';

  @override
  String get schemesKindsBuyGet => 'X खरीदें Y पाएँ';

  @override
  String get schemesKindsCombo => 'कॉम्बो या हैम्पर';

  @override
  String get schemesKindHintPercent => 'हर शामिल वस्तु पर एक-सा प्रतिशत';

  @override
  String get schemesKindHintAmountOff =>
      'एक तय रकम की छूट, मूल्य के हिसाब से बँटी';

  @override
  String get schemesKindHintQtySlab => 'ज़्यादा पीस, ज़्यादा प्रतिशत';

  @override
  String get schemesKindHintValueSlab => 'बड़ा बिल, ज़्यादा प्रतिशत';

  @override
  String get schemesKindHintBuyGet =>
      'हर समूह की सबसे सस्ती वस्तुएँ मुफ़्त या छूट पर';

  @override
  String get schemesKindHintCombo => 'वस्तुओं का सेट एक कीमत पर';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% छूट';
  }

  @override
  String schemesSumMin(String amount) {
    return '$amount या ज़्यादा पर';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount छूट';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ पीस $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return '$buy खरीदें $get मुफ़्त';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return '$buy खरीदें $get पर $pct% छूट';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$n वस्तुएँ $price में';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'इस प्रकार की स्कीम के लिए ज़रूरी चीज़ें भरें।';

  @override
  String get schemesErrorsSchemeNameTaken => 'इस नाम की स्कीम पहले से है।';

  @override
  String get schemesErrorsEndsBeforeStart =>
      'अंतिम तारीख शुरुआती तारीख से पहले है।';

  @override
  String get schemesErrorsDuplicateSlab =>
      'दो स्लैब एक ही जगह से शुरू होते हैं।';

  @override
  String get schemesErrorsUnknownItem => 'अपनी सूची से वस्तुएँ चुनें।';

  @override
  String get schemesErrorsUnknownStyle => 'अपनी सूची से स्टाइल चुनें।';

  @override
  String get schemesErrorsSlabs => 'स्लैब ऐसे लिखें: 3:10, 5:20।';

  @override
  String get schemesErrorsNumber => 'रकम और प्रतिशत संख्या होने चाहिए।';

  @override
  String get interestTitle => 'बकाया पर ब्याज';

  @override
  String get interestSubtitle =>
      'हर बिल पर देय तिथि के बाद के दिनों का साधारण ब्याज, ग्राहक की दर से।';

  @override
  String get interestPartyRates => 'जिन ग्राहकों की ब्याज दर तय है।';

  @override
  String interestUsingRate(String rate) {
    return 'जिन ग्राहकों की अपनी दर नहीं, उनका $rate% से हिसाब।';
  }

  @override
  String get interestPartyRatesOnly => 'केवल दर वाले ग्राहक';

  @override
  String interestTryRate(String rate) {
    return 'सबका $rate% से हिसाब करें';
  }

  @override
  String get interestRate => 'दर';

  @override
  String get interestOverdue => 'बकाया';

  @override
  String get interestInterest => 'ब्याज';

  @override
  String interestDueOn(String date) {
    return 'देय $date';
  }

  @override
  String get interestNone => 'ब्याज लगाने के लिए कोई बकाया बिल नहीं।';

  @override
  String get interestGstNote =>
      'देरी से भुगतान पर लिया गया ब्याज आपूर्ति मूल्य का हिस्सा है (CGST अधिनियम धारा 15(2)(d)); इसे माल की दर से GST सहित बिल करें।';

  @override
  String get integrityTitle => 'अखंडता जाँच';

  @override
  String get integritySubtitle =>
      'क्या आपकी बही आपस में मेल खाती है? हर जाँच दो चीज़ों की तुलना करती है जिन्हें मिलना चाहिए, और अंतर को उसके पीछे के रिकॉर्ड के साथ दिखाती है।';

  @override
  String get integrityAllGood =>
      'सभी जाँच सफल हैं। आपकी बही आपस में मेल खाती है।';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n जाँचों पर ध्यान चाहिए',
      one: '$n जाँच पर ध्यान चाहिए',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'सफल';

  @override
  String get integrityFail => 'अंतर';

  @override
  String get integrityWarn => 'इसे देखें';

  @override
  String get integrityRecords => 'रिकॉर्ड';

  @override
  String get integrityFirstTwenty => 'पहले 20 दिखाए गए हैं।';

  @override
  String get integrityVouchersBalanceTitle => 'हर वाउचर संतुलित है';

  @override
  String get integrityVouchersBalanceHelp =>
      'हर वाउचर में नामे और जमा बराबर हैं। जो नहीं हैं वे यहाँ दिखते हैं।';

  @override
  String get integrityTrialBalanceTitle => 'ट्रायल बैलेंस संतुलित है';

  @override
  String get integrityTrialBalanceHelp =>
      'आरंभिक शेष और हर दर्ज प्रविष्टि का जोड़ शून्य होना चाहिए। अंतर आमतौर पर इसलिए आता है कि आरंभिक शेष बिना दूसरे पक्ष, जैसे मालिक की पूँजी, के दर्ज हुआ।';

  @override
  String get integrityInvoicesMatchLedgerTitle =>
      'बिक्री बिल बही से मेल खाते हैं';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'हर दर्ज बिल ने अपनी कुल रकम ग्राहक के खाते में डाली।';

  @override
  String get integrityBillsMatchLedgerTitle => 'खरीद बिल बही से मेल खाते हैं';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'रिवर्स चार्ज वाले को छोड़कर हर दर्ज बिल ने अपनी कुल रकम आपूर्तिकर्ता के खाते में डाली।';

  @override
  String get integrityDocumentsPostedTitle =>
      'दर्ज दस्तावेज़ों की बही प्रविष्टियाँ हैं';

  @override
  String get integrityDocumentsPostedHelp =>
      'जिस दर्ज बिल के पीछे कोई वाउचर नहीं है वह यहाँ दिखता है।';

  @override
  String get integrityCancelledReversedTitle => 'रद्द वाउचर का कुल शून्य है';

  @override
  String get integrityCancelledReversedHelp =>
      'वाउचर रद्द करने पर उसके हर खाते का उलटा प्रविष्टि होना चाहिए।';

  @override
  String get integrityReceivablesMatchTitle =>
      'ग्राहकों से लेना बही से मेल खाता है';

  @override
  String get integrityReceivablesMatchHelp =>
      'बकाया सूची का जोड़ ग्राहकों के बही शेष के बराबर है।';

  @override
  String get integrityPayablesMatchTitle =>
      'आपूर्तिकर्ताओं को देना बही से मेल खाता है';

  @override
  String get integrityPayablesMatchHelp =>
      'बकाया सूची का जोड़ आपूर्तिकर्ताओं के बही शेष के बराबर है।';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'गिफ्ट वाउचर देयता बिना खर्च वाउचर से मेल खाती है';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'गिफ्ट वाउचर का बही खाता सक्रिय वाउचरों पर बचे शेष के बराबर है।';

  @override
  String get integrityNegativeStockTitle => 'कोई स्टॉक शून्य से नीचे नहीं';

  @override
  String get integrityNegativeStockHelp =>
      'बही में दिखे स्टॉक से ज़्यादा बेचा या दिया गया माल। यह असली समय का अंतर हो सकता है; छूटी हुई प्राप्ति दर्ज करें।';

  @override
  String get sensitiveTitle => 'संवेदनशील बदलाव';

  @override
  String get sensitiveSubtitle =>
      'ऐसे बदलाव जो पैसा हिला सकते हैं या दरवाज़ा खोल सकते हैं: बैंक विवरण, उधार की शर्तें, कर सेटिंग, किसे क्या अधिकार, अवधि ताले और वेतन सेटिंग। सबसे नया ऊपर।';

  @override
  String get sensitiveKindBank => 'बैंक विवरण';

  @override
  String get sensitiveKindCredit => 'उधार की शर्तें';

  @override
  String get sensitiveKindTax => 'कर और कंपनी सेटिंग';

  @override
  String get sensitiveKindPermissions => 'किसे क्या अधिकार';

  @override
  String get sensitiveKindPeriod => 'अवधि ताले और क्रमांक';

  @override
  String get sensitiveKindPayroll => 'वेतन सेटिंग';

  @override
  String get sensitiveKindOverride => 'उधार सीमा पार करना';

  @override
  String get sensitiveKindDevice => 'डिवाइस';

  @override
  String get sensitiveAll => 'सभी प्रकार';

  @override
  String get sensitiveNone => 'इस अवधि में कोई संवेदनशील बदलाव नहीं।';

  @override
  String get sensitiveShow => 'दिखाएँ';

  @override
  String get cfoTitle => 'मालिक का नज़रिया';

  @override
  String get cfoSubtitle =>
      'बिक्री से मुनाफ़े तक, इस अवधि का हाल, पिछले साल की उसी अवधि के साथ। मुनाफ़ा कर से पहले और बाद में तब तक एक ही है जब तक आपकी बही में आयकर दर्ज न हो।';

  @override
  String get cfoThisPeriod => 'यह अवधि';

  @override
  String get cfoLastYear => 'पिछले साल की उसी अवधि';

  @override
  String get cfoGrowth => 'वृद्धि';

  @override
  String get cfoRevenue => 'राजस्व';

  @override
  String get cfoCostOfGoods => 'बेचे गए माल की लागत';

  @override
  String get cfoGrossProfit => 'सकल लाभ';

  @override
  String get cfoGrossMargin => 'सकल मार्जिन';

  @override
  String get cfoOperatingExpenses => 'परिचालन खर्च';

  @override
  String get cfoOtherIncome => 'अन्य आय';

  @override
  String get cfoDepreciation => 'मूल्यह्रास';

  @override
  String get cfoEbitda => 'EBITDA (मूल्यह्रास से पहले का मुनाफ़ा)';

  @override
  String get cfoNetProfit => 'शुद्ध लाभ';

  @override
  String get cfoMonthly => 'महीनेवार सकल मार्जिन';

  @override
  String get lrTitle => 'एलआर और परिवहन प्रविष्टि';

  @override
  String get lrSubtitle =>
      'ट्रांसपोर्टर से भेजा गया माल: एलआर नंबर, बिल, भाड़ा, और ग्राहक तक पहुँचा या नहीं।';

  @override
  String get lrTransporter => 'ट्रांसपोर्टर';

  @override
  String get lrLrNumber => 'एलआर नंबर';

  @override
  String get lrInvoice => 'बिल';

  @override
  String get lrNoInvoice => 'कोई बिल नहीं';

  @override
  String get lrDestination => 'गंतव्य';

  @override
  String get lrPackages => 'पैकेट';

  @override
  String get lrWeight => 'वज़न (किग्रा)';

  @override
  String get lrFreight => 'भाड़ा';

  @override
  String get lrFreightBy => 'भाड़ा कौन देगा';

  @override
  String get lrPaid => 'हमने चुकाया';

  @override
  String get lrToPay => 'ग्राहक देगा';

  @override
  String get lrAdd => 'माल भेजना दर्ज करें';

  @override
  String get lrStatus => 'स्थिति';

  @override
  String get lrAllStatuses => 'सभी स्थितियाँ';

  @override
  String get lrStatusesBooked => 'बुक किया';

  @override
  String get lrStatusesInTransit => 'रास्ते में';

  @override
  String get lrStatusesDelivered => 'पहुँच गया';

  @override
  String lrDeliveredOn(String date) {
    return '$date को पहुँचा';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'भेजे हुए $n दिन',
      one: 'भेजे हुए $n दिन',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty => 'अभी कोई माल नहीं भेजा गया। ऊपर पहला दर्ज करें।';

  @override
  String get lrErrorsLrTaken =>
      'इस ट्रांसपोर्टर के पास यह एलआर नंबर पहले से दर्ज है।';

  @override
  String get lrErrorsUnknownInvoice => 'वह बिल नहीं मिला।';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'पहुँचने की तारीख भेजने की तारीख से पहले है।';

  @override
  String get hsnTitle => 'एचएसएन और एसएसी कोड';

  @override
  String get hsnSubtitle =>
      'आपके कारोबार में काम आने वाले कोड, सरल विवरण के साथ। माल और स्टाइल के फ़ॉर्म इसी सूची से सुझाव देते हैं। यहाँ की दर सिर्फ़ सुविधा है: कपड़े और जूते कीमत के स्लैब से कर पाते हैं।';

  @override
  String get hsnCode => 'कोड';

  @override
  String get hsnDescription => 'विवरण';

  @override
  String get hsnKind => 'प्रकार';

  @override
  String get hsnGoods => 'माल (एचएसएन)';

  @override
  String get hsnService => 'सेवा (एसएसी)';

  @override
  String get hsnRate => 'दर';

  @override
  String get hsnAddStandard => 'मानक परिधान कोड जोड़ें';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n कोड जोड़े गए। आपके पहले के कोड नहीं बदले।',
      one: '$n कोड जोड़ा गया। आपके पहले के कोड नहीं बदले।',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'संग्रहित दिखाएँ';

  @override
  String get hsnEmpty =>
      'अभी कोई कोड नहीं। ऊपर जोड़ें, या मानक परिधान कोड जोड़ें।';

  @override
  String get hsnErrorsHsnTaken => 'यह कोड सूची में पहले से है।';

  @override
  String get hsnErrorsInvalidHsn =>
      'एचएसएन कोड में 4, 6 या 8 अंक होते हैं (एसएसी कोड में 6)।';

  @override
  String get notesTitle => 'मेरे नोट्स';

  @override
  String get notesPrivate => 'इन्हें केवल आप देख सकते हैं।';

  @override
  String get notesNone => 'कुछ दर्ज नहीं। नीचे याद दिलाने वाली बात लिखें।';

  @override
  String get notesPlaceholder => 'नोट या याद दिलाने वाली बात लिखें';

  @override
  String get notesRemindOn => 'मुझे इस दिन याद दिलाएँ';

  @override
  String get notesAdd => 'जोड़ें';

  @override
  String get notesToday => 'आज';

  @override
  String notesOverdue(String date) {
    return '$date को देय था';
  }

  @override
  String notesMarkDone(String note) {
    return 'पूरा हुआ: $note';
  }

  @override
  String get notesRemove => 'नोट हटाएँ';

  @override
  String get movementTitle => 'तेज़ और धीमे बिकने वाला माल';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'पिछले $days दिनों में क्या बिका। तेज़ यानी $fastMin या ज़्यादा नग; धीमा यानी कुछ बिका पर इससे कम; ठहरा हुआ यानी कुछ नहीं। ठहरा हुआ माल सबसे पहले।';
  }

  @override
  String get movementWindow => 'पीछे देखें';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिन',
      one: '$n दिन',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'तेज़ की सीमा (नग)';

  @override
  String get movementIncludeFabric => 'कपड़ा और ट्रिम्स भी शामिल करें';

  @override
  String get movementClassFast => 'तेज़';

  @override
  String get movementClassSlow => 'धीमा';

  @override
  String get movementClassNone => 'ठहरा हुआ';

  @override
  String movementItems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n माल',
      one: '$n माल',
    );
    return '$_temp0';
  }

  @override
  String movementPiecesInStock(String n) {
    return 'स्टॉक में $n नग';
  }

  @override
  String get movementItem => 'माल';

  @override
  String get movementStatus => 'गति';

  @override
  String movementSold(String days) {
    return '$days दिनों में बिका';
  }

  @override
  String get movementInStock => 'स्टॉक में';

  @override
  String get movementStockValue => 'स्टॉक मूल्य';

  @override
  String get movementLastSold => 'आखिरी बिक्री';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिन पहले',
      one: '$n दिन पहले',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'कभी नहीं';

  @override
  String get movementEmpty => 'दिखाने के लिए कोई स्टॉक नहीं।';

  @override
  String get movementFirstRows => 'पहले 500 माल दिखाए गए हैं।';

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
