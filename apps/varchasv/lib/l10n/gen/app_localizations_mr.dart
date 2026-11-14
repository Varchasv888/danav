// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Marathi (`mr`).
class AppLocalizationsMr extends AppLocalizations {
  AppLocalizationsMr([String locale = 'mr']) : super(locale);

  @override
  String get brandName => 'Varchasv';

  @override
  String get brandFull => 'Varchasv ERP Systems';

  @override
  String get brandTagline =>
      'हिशेब, जीएसटी, स्टॉक आणि पगार, ऑनलाइन आणि ऑफलाइन, तुमच्या भाषेत.';

  @override
  String get commonSave => 'जतन करा';

  @override
  String get commonSaving => 'जतन होत आहे…';

  @override
  String get commonSaved => 'जतन झाले';

  @override
  String get commonCancel => 'रद्द करा';

  @override
  String get commonEdit => 'बदला';

  @override
  String get commonAdd => 'जोडा';

  @override
  String get commonClose => 'बंद करा';

  @override
  String get commonLoading => 'लोड होत आहे…';

  @override
  String get commonOptional => 'ऐच्छिक';

  @override
  String get commonLanguage => 'भाषा';

  @override
  String get commonTheme => 'थीम';

  @override
  String get commonLight => 'फिकट';

  @override
  String get commonDark => 'गडद';

  @override
  String get commonSystem => 'सिस्टम';

  @override
  String commonComingSoon(String phase) {
    return 'टप्पा $phase मध्ये येत आहे';
  }

  @override
  String get commonNone => 'काहीही नाही';

  @override
  String get commonYes => 'होय';

  @override
  String get commonNo => 'नाही';

  @override
  String get commonSearch => 'शोधा';

  @override
  String get commonAll => 'सर्व';

  @override
  String get commonFrom => 'पासून';

  @override
  String get commonTo => 'पर्यंत';

  @override
  String get commonAsOf => 'या तारखेला';

  @override
  String get commonTotal => 'एकूण';

  @override
  String get commonDebit => 'नावे';

  @override
  String get commonCredit => 'जमा';

  @override
  String get commonBalance => 'शिल्लक';

  @override
  String get commonDate => 'तारीख';

  @override
  String get commonNarration => 'तपशील';

  @override
  String get commonActions => 'क्रिया';

  @override
  String get commonBack => 'मागे';

  @override
  String get commonApply => 'दाखवा';

  @override
  String get commonRemove => 'काढा';

  @override
  String get commonCopy => 'कॉपी करा';

  @override
  String get commonCopied => 'कॉपी झाले';

  @override
  String get commonDr => 'नावे';

  @override
  String get commonCr => 'जमा';

  @override
  String get commonView => 'पहा';

  @override
  String get commonArchived => 'संग्रहित';

  @override
  String get commonPrint => 'छापा';

  @override
  String commonListCapped(String count) {
    return 'नवीनतम $count दस्तऐवज दाखवले आहेत. जुने पाहण्यासाठी तारखा निवडा.';
  }

  @override
  String get authLoginTitle => 'तुमच्या व्यवसायात साइन इन करा';

  @override
  String get authLoginSubtitle => 'पुन्हा स्वागत आहे.';

  @override
  String get authSignupTitle => 'तुमचा व्यवसाय Varchasv वर सुरू करा';

  @override
  String get authSignupSubtitle =>
      '₹40 लाखांपेक्षा कमी उलाढालीच्या व्यवसायांसाठी मोफत. कार्डची गरज नाही.';

  @override
  String get authEmail => 'ईमेल';

  @override
  String get authPassword => 'पासवर्ड';

  @override
  String get authPasswordHint => 'किमान 8 अक्षरे';

  @override
  String get authName => 'तुमचे नाव';

  @override
  String get authBusinessName => 'व्यवसायाचे नाव';

  @override
  String get authState => 'राज्य';

  @override
  String get authGstin => 'जीएसटीआयएन';

  @override
  String get authGstinHint => 'जीएसटी नोंदणी नसल्यास रिकामे ठेवा';

  @override
  String get authIndustry => 'व्यवसायाचा प्रकार';

  @override
  String get authLogin => 'साइन इन करा';

  @override
  String get authSignup => 'खाते तयार करा';

  @override
  String get authLogout => 'साइन आउट करा';

  @override
  String get authNoAccount => 'Varchasv वर नवीन आहात?';

  @override
  String get authHaveAccount => 'आधीच खाते आहे?';

  @override
  String get authCreateOne => 'खाते तयार करा';

  @override
  String get authSignInInstead => 'साइन इन करा';

  @override
  String get authErrorsInvalidCredentials => 'हा ईमेल आणि पासवर्ड जुळत नाहीत.';

  @override
  String get authErrorsEmailTaken => 'या ईमेलचे खाते आधीच आहे.';

  @override
  String get authErrorsGstinLength => 'जीएसटीआयएन 15 अक्षरांचा असतो.';

  @override
  String get authErrorsGstinFormat => 'हा जीएसटीआयएन वाटत नाही.';

  @override
  String get authErrorsGstinState => 'जीएसटीआयएन अज्ञात राज्य कोडने सुरू होतो.';

  @override
  String get authErrorsGstinChecksum =>
      'या जीएसटीआयएनमध्ये टायपिंगची चूक आहे: शेवटचे अक्षर जुळत नाही.';

  @override
  String get authErrorsGstinStateMismatch =>
      'हा जीएसटीआयएन निवडलेल्या राज्यापेक्षा वेगळ्या राज्याचा आहे.';

  @override
  String get authErrorsValidation => 'कृपया चिन्हांकित जागा तपासा.';

  @override
  String get authErrorsGeneric => 'काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.';

  @override
  String get authErrorsInvalidOrExpiredLink =>
      'ही लिंक कालबाह्य झाली आहे किंवा आधीच वापरली गेली आहे. नवीन लिंक मागवा.';

  @override
  String get authErrorsWrongPassword => 'तुमचा सध्याचा पासवर्ड चुकीचा आहे.';

  @override
  String get authErrorsPasswordsDiffer => 'दोन्ही पासवर्ड जुळत नाहीत.';

  @override
  String get authErrorsNeedsChangeDate =>
      'तुम्हाला दस्तऐवजावर मागची तारीख टाकण्याचा अधिकार नाही. आजची तारीख वापरा किंवा मालकाकडून अधिकार मागा.';

  @override
  String get authErrorsNeedsFutureDate =>
      'तुम्हाला दस्तऐवजावर पुढची तारीख टाकण्याचा अधिकार नाही. आजची तारीख वापरा किंवा मालकाकडून अधिकार मागा.';

  @override
  String get authErrorsNeedsSellBelowCost =>
      'एका ओळीचा भाव खरेदी किमतीपेक्षा कमी आहे. तुम्हाला खरेदी किमतीखाली विकण्याचा अधिकार नाही; भाव वाढवा किंवा मालकाला विचारा.';

  @override
  String get authForgotLink => 'पासवर्ड विसरलात?';

  @override
  String get authForgotTitle => 'तुमचा पासवर्ड रीसेट करा';

  @override
  String get authForgotSubtitle =>
      'तुमच्या खात्याचा ईमेल टाका, नवीन पासवर्ड निवडण्यासाठी आम्ही लिंक पाठवू.';

  @override
  String get authSendLink => 'रीसेट लिंक पाठवा';

  @override
  String authForgotSent(String email) {
    return '$email साठी खाते असल्यास, रीसेट लिंक पाठवली जात आहे. ती एकदाच चालते आणि एका तासात कालबाह्य होते.';
  }

  @override
  String get authBackToLogin => 'साइन इनकडे परत';

  @override
  String get authResetTitle => 'नवीन पासवर्ड निवडा';

  @override
  String get authNewPassword => 'नवीन पासवर्ड';

  @override
  String get authConfirmPassword => 'नवीन पासवर्ड पुन्हा लिहा';

  @override
  String get authSetPassword => 'पासवर्ड सेट करा';

  @override
  String get authResetDone =>
      'तुमचा पासवर्ड बदलला आहे आणि तुम्ही सर्व ठिकाणांहून साइन आउट झाला आहात. नवीन पासवर्डने साइन इन करा.';

  @override
  String get shellGoTo => 'येथे जा…';

  @override
  String get shellGoToPlaceholder => 'स्क्रीन उघडा किंवा नवीन नोंद सुरू करा';

  @override
  String shellNoMatch(String query) {
    return '“$query” शी काहीही जुळले नाही.';
  }

  @override
  String get shellTallyKeys =>
      'टॅलीच्या की मजकूर क्षेत्राबाहेर कुठेही चालतात: F4 कॉन्ट्रा, F5 देयक, F6 जमा, F7 जर्नल, F8 विक्री, F9 खरेदी.';

  @override
  String get shellCreate => 'नवीन';

  @override
  String get shellEntries => 'नवीन नोंद';

  @override
  String get shellScreens => 'स्क्रीन';

  @override
  String get shellMenu => 'मेनू';

  @override
  String shellFy(String years) {
    return 'आ.व. $years';
  }

  @override
  String shellNewVoucher(String type) {
    return '$type व्हाउचर';
  }

  @override
  String get shellFold => 'मेनू लहान करा';

  @override
  String get shellUnfold => 'मेनू उघडा';

  @override
  String get accountTitle => 'माझे खाते';

  @override
  String get accountSubtitle =>
      'तुमचे नाव आणि पासवर्ड, तुमच्या प्रत्येक व्यवसायासाठी वापरले जातात.';

  @override
  String get accountProfile => 'प्रोफाइल';

  @override
  String get accountSave => 'जतन करा';

  @override
  String get accountSaved => 'जतन केले';

  @override
  String get accountPasswordTitle => 'पासवर्ड बदला';

  @override
  String get accountCurrentPassword => 'सध्याचा पासवर्ड';

  @override
  String get accountPasswordChanged =>
      'पासवर्ड बदलला. तुमची इतर उपकरणे साइन आउट केली आहेत.';

  @override
  String get industryApparel => 'वस्त्र आणि कापड';

  @override
  String get industryGeneral => 'सामान्य';

  @override
  String get industryTrading => 'व्यापार / वितरण';

  @override
  String get industryManufacturing => 'उत्पादन';

  @override
  String get industryRetail => 'किरकोळ दुकान';

  @override
  String get industryServices => 'सेवा';

  @override
  String get navDashboard => 'डॅशबोर्ड';

  @override
  String get navSales => 'विक्री';

  @override
  String get navPurchase => 'खरेदी';

  @override
  String get navInventory => 'माल';

  @override
  String get navAccounts => 'हिशेब';

  @override
  String get navGst => 'जीएसटी';

  @override
  String get navHr => 'एचआर आणि पगार';

  @override
  String get navReports => 'अहवाल';

  @override
  String get navSettings => 'सेटिंग्ज';

  @override
  String get navCompany => 'कंपनी आणि शाखा';

  @override
  String get navNumberSeries => 'क्रमांक मालिका';

  @override
  String get navAuditLog => 'लेखापरीक्षण नोंद';

  @override
  String get navTools => 'साधने';

  @override
  String get navTeam => 'टीम आणि भूमिका';

  @override
  String get navChart => 'खात्यांची यादी';

  @override
  String get navVouchers => 'व्हाउचर आणि कूपन';

  @override
  String get navTrialBalance => 'तेरीज';

  @override
  String get navProfitLoss => 'नफा-तोटा';

  @override
  String get navBalanceSheet => 'ताळेबंद';

  @override
  String get navFinancialYears => 'आर्थिक वर्षे';

  @override
  String get navItems => 'वस्तू';

  @override
  String get navStock => 'स्टॉक सारांश';

  @override
  String get navStockJournals => 'स्टॉक जर्नल';

  @override
  String get navReorder => 'पुन्हा मागणी';

  @override
  String get navPurchaseOrders => 'खरेदी ऑर्डर';

  @override
  String get navGoodsReceipts => 'इनवर्ड चलन';

  @override
  String get navPurchaseBills => 'खरेदी बिले';

  @override
  String get navPurchaseReturns => 'खरेदी परतावा';

  @override
  String get navSalesOrders => 'विक्री ऑर्डर';

  @override
  String get navDeliveryNotes => 'डिलिव्हरी चलन';

  @override
  String get navSalesInvoices => 'विक्री बीजक';

  @override
  String get navCreditNotes => 'क्रेडिट नोट';

  @override
  String get navReceivables => 'येणे बाकी';

  @override
  String get navPayables => 'देणे बाकी';

  @override
  String get navGstReturns => 'जीएसटी रिटर्न';

  @override
  String get navGstSettings => 'जीएसटी आणि बीजक';

  @override
  String get navImport => 'डेटा आयात';

  @override
  String get navQuotations => 'कोटेशन';

  @override
  String get navEmployees => 'कर्मचारी';

  @override
  String get navAttendance => 'हजेरी';

  @override
  String get navLeave => 'रजा';

  @override
  String get navPayroll => 'पगार';

  @override
  String get navPayrollSettings => 'पगार';

  @override
  String get navStatutory => 'वैधानिक आणि टीडीएस';

  @override
  String get navManufacturing => 'उत्पादन';

  @override
  String get navBoms => 'साहित्य यादी (BOM)';

  @override
  String get navProduction => 'उत्पादन ऑर्डर';

  @override
  String get navMrp => 'साहित्य नियोजन';

  @override
  String get navJobWork => 'जॉब वर्क';

  @override
  String get navPos => 'पॉइंट ऑफ सेल';

  @override
  String get navPosBilling => 'बिलिंग';

  @override
  String get navPosBills => 'बिले';

  @override
  String get navPosSettings => 'काउंटर सेटिंग';

  @override
  String get navBanking => 'बँकिंग';

  @override
  String get navBankAccounts => 'बँक जुळवणी';

  @override
  String get navBankRules => 'बँक नियम';

  @override
  String get navSettlements => 'गेटवे सेटलमेंट';

  @override
  String get navAssets => 'स्थिर मालमत्ता';

  @override
  String get navAssetRegister => 'मालमत्ता नोंदवही';

  @override
  String get navDepreciation => 'घसारा';

  @override
  String get navItDepreciation => 'आयकर घसारा';

  @override
  String get navExpenses => 'खर्च';

  @override
  String get navExpenseClaims => 'खर्च दावे';

  @override
  String get navExpenseCategories => 'खर्च प्रकार';

  @override
  String get navProjects => 'प्रकल्प';

  @override
  String get navProjectList => 'प्रकल्प';

  @override
  String get navTimesheets => 'टाइमशीट';

  @override
  String get navAssistant => 'सहाय्यक';

  @override
  String get navCrm => 'सीआरएम';

  @override
  String get navLeads => 'लीड';

  @override
  String get navFollowUps => 'पाठपुरावा';

  @override
  String get navMessageTemplates => 'संदेश नमुने';

  @override
  String get navReportBuilder => 'अहवाल तयार करा';

  @override
  String get navSavedReports => 'जतन केलेले अहवाल';

  @override
  String get navChecks => 'तपासण्या';

  @override
  String get navStyles => 'स्टाइल';

  @override
  String get navProformas => 'प्रोफॉर्मा इनव्हॉइस';

  @override
  String get navApprovals => 'मंजुरीवरील माल';

  @override
  String get navPriceLists => 'किंमत यादी';

  @override
  String get navInterest => 'थकबाकीवर व्याज';

  @override
  String get navAgents => 'एजंट कमिशन';

  @override
  String get navTargets => 'सेल्समन लक्ष्य';

  @override
  String get navSchemes => 'स्कीम आणि ऑफर';

  @override
  String get navPosReturns => 'परतावा आणि बदल';

  @override
  String get navAlterations => 'ऑल्टरेशन';

  @override
  String get navTailoring => 'शिवणकाम';

  @override
  String get navConsignment => 'कन्साइनमेंट';

  @override
  String get navCatalogue => 'इमेज कॅटलॉग';

  @override
  String get navInsights => 'व्यवसाय अंतर्दृष्टी';

  @override
  String get navSalesRegister => 'विक्री रजिस्टर';

  @override
  String get navColourSize => 'रंग-साइज अहवाल';

  @override
  String get navStockAgeing => 'स्टॉकचे वय';

  @override
  String get navLabels => 'बारकोड लेबल';

  @override
  String get navMessageLog => 'व्हॉट्सॲप लॉग';

  @override
  String get navMyMenu => 'माझा मेनू';

  @override
  String get navAllActions => 'सर्व कामे';

  @override
  String get navStockCounts => 'स्टॉक मोजणी';

  @override
  String get navWorkspace => 'कार्यक्षेत्र';

  @override
  String get navSalesPos => 'विक्री आणि काउंटर';

  @override
  String get navPromotions => 'ऑफर आणि किंमत';

  @override
  String get navFinance => 'खाती आणि बँकिंग';

  @override
  String get navOperations => 'खर्च, प्रकल्प आणि मालमत्ता';

  @override
  String get navMasters => 'मास्टर';

  @override
  String get navReportsHub => 'सर्व अहवाल';

  @override
  String get navMastersHub => 'सर्व मास्टर';

  @override
  String get navSizesColours => 'साइज आणि रंग';

  @override
  String get navBandWorkspace => 'कार्यक्षेत्र';

  @override
  String get navBandCommerce => 'विक्री';

  @override
  String get navBandSupply => 'खरेदी आणि स्टॉक';

  @override
  String get navBandProduction => 'उत्पादन आणि कामकाज';

  @override
  String get navBandMoney => 'पैसा आणि लोक';

  @override
  String get navBandInsight => 'अहवाल';

  @override
  String get navBandAdmin => 'सेटअप';

  @override
  String get navIntegrity => 'अखंडता तपासणी';

  @override
  String get navCfoView => 'मालकाचा दृष्टिकोन';

  @override
  String get navStockMovement => 'वेगाने आणि हळू विकणारा माल';

  @override
  String dashboardGreeting(String name) {
    return 'नमस्कार, $name';
  }

  @override
  String dashboardSubtitle(String business) {
    return '$business आज कुठे आहे ते पहा.';
  }

  @override
  String get dashboardSetupTitle => 'सेटअप पूर्ण करा';

  @override
  String get dashboardSetupCompany => 'कंपनीचा तपशील आणि पॅन जोडा';

  @override
  String get dashboardSetupBranch => 'प्रत्येक शाखेसाठी जीएसटीआयएन जोडा';

  @override
  String get dashboardSetupSeries => 'बीजक क्रमांक मालिका तपासा';

  @override
  String get dashboardRoadmapTitle => 'पुढे काय येत आहे';

  @override
  String get dashboardCalcTitle => 'झटपट जीएसटी कॅल्क्युलेटर';

  @override
  String get dashboardCalcSubtitle =>
      'पुरवठ्याच्या ठिकाणावरून सीजीएसटी/एसजीएसटी किंवा आयजीएसटी काढतो.';

  @override
  String get dashboardKSalesToday => 'आजची विक्री';

  @override
  String dashboardKVsYesterday(String amount) {
    return 'काल $amount';
  }

  @override
  String get dashboardKSalesMonth => 'या महिन्याची विक्री';

  @override
  String dashboardKVsLastMonth(String amount) {
    return 'मागील महिन्यात याच दिवसांत $amount';
  }

  @override
  String get dashboardKReceivables => 'येणे बाकी';

  @override
  String dashboardKOverdue(String amount) {
    return '$amount थकीत';
  }

  @override
  String get dashboardKPayables => 'देणे बाकी';

  @override
  String dashboardKDueSoon(String amount) {
    return '7 दिवसांत $amount देय';
  }

  @override
  String get dashboardKProfit => 'या महिन्याचा नफा';

  @override
  String dashboardKGrossProfit(String amount) {
    return 'एकूण नफा $amount';
  }

  @override
  String get dashboardKStockValue => 'स्टॉकचे मूल्य';

  @override
  String dashboardKLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count वस्तू',
      one: '$count वस्तू',
    );
    return '$_temp0 पुन्हा मागणी पातळीच्या खाली';
  }

  @override
  String get dashboardKPipeline => 'विक्री पाइपलाइन';

  @override
  String dashboardKWeighted(String count, String amount) {
    return '$count खुले लीड · भारित $amount';
  }

  @override
  String get dashboardKApprovals => 'तुमच्या प्रतीक्षेत';

  @override
  String get dashboardKClaims => 'खर्च दावे';

  @override
  String get dashboardKTimesheets => 'टाइमशीट';

  @override
  String get dashboardKLeave => 'रजा अर्ज';

  @override
  String get dashboardKNothingWaiting => 'काहीही प्रतीक्षेत नाही.';

  @override
  String get dashboardKSalesTrend => 'मागील 30 दिवसांची विक्री';

  @override
  String get dashboardKCashBank => 'रोख आणि बँक';

  @override
  String get dashboardKTopCustomers => 'या महिन्यातील प्रमुख ग्राहक';

  @override
  String get dashboardKTopItems => 'या महिन्यात सर्वाधिक विकलेले';

  @override
  String get dashboardKTopDebtors => 'सर्वात मोठी वसुली';

  @override
  String get dashboardKAlerts => 'लक्ष द्या';

  @override
  String get dashboardKNoAlerts => 'सर्व ठीक आहे.';

  @override
  String get dashboardKAsk => 'सहाय्यकाला विचारा';

  @override
  String dashboardKYesterday(String amount) {
    return 'काल $amount';
  }

  @override
  String get dashboardPosition => 'पैशांची स्थिती';

  @override
  String dashboardAccounts(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count खाती',
      one: '$count खाते',
    );
    return '$_temp0';
  }

  @override
  String get insightsTitle => 'व्यवसाय अंतर्दृष्टी';

  @override
  String get insightsSubtitle =>
      'कोणत्याही कालावधीची विक्री, नफा, स्टॉक आणि पैसा, मागील वर्षाच्या त्याच कालावधीशी तुलना.';

  @override
  String get insightsNoLastYear => 'या वर्षी नवीन';

  @override
  String get insightsPts => 'अंक';

  @override
  String get insightsVsLastYear => 'मागील वर्षाच्या तुलनेत';

  @override
  String get insightsNoSales => 'या कालावधीत विक्री नाही.';

  @override
  String get insightsHideTable => 'तक्ता लपवा';

  @override
  String get insightsShowTable => 'तक्त्यात पाहा';

  @override
  String get insightsPresetsThisMonth => 'या महिन्यात';

  @override
  String get insightsPresetsLastMonth => 'मागील महिना';

  @override
  String get insightsPresetsThisFy => 'हे आर्थिक वर्ष';

  @override
  String get insightsPresetsLastFy => 'मागील आर्थिक वर्ष';

  @override
  String get insightsPresetsLast12 => 'मागील 12 महिने';

  @override
  String get insightsFrom => 'पासून';

  @override
  String get insightsTo => 'पर्यंत';

  @override
  String get insightsApply => 'दाखवा';

  @override
  String insightsCompared(String from, String to) {
    return 'बदल $from ते $to च्या तुलनेत आहेत.';
  }

  @override
  String get insightsKpiSales => 'विक्री';

  @override
  String get insightsKpiPieces => 'विकलेले नग';

  @override
  String get insightsKpiAvgBill => 'सरासरी बिल';

  @override
  String get insightsKpiProfit => 'मार्जिन';

  @override
  String get insightsKpiPurchases => 'खरेदी';

  @override
  String get insightsKpiStock => 'सध्याचा स्टॉक';

  @override
  String get insightsKpiReceivable => 'येणे बाकी';

  @override
  String get insightsKpiPayable => 'देणे बाकी';

  @override
  String get insightsBeforeTax => 'GST पूर्वी, परतावा वजा';

  @override
  String insightsBillsCount(String n) {
    return 'बिले: $n';
  }

  @override
  String insightsAvgRate(String v) {
    return '$v प्रति नग';
  }

  @override
  String insightsPiecesCount(String n) {
    return '$n नग';
  }

  @override
  String get insightsOwedToUs => 'ग्राहकांकडून';

  @override
  String get insightsWeOwe => 'पुरवठादारांना';

  @override
  String get insightsTrend => 'विक्रीचा कल';

  @override
  String get insightsByMonth => 'महिनावार, GST पूर्वी';

  @override
  String get insightsByDay => 'दिवसवार, GST पूर्वी';

  @override
  String get insightsWeekday => 'गर्दीचे दिवस';

  @override
  String get insightsWeekdaySub => 'आठवड्याच्या दिवसानुसार विक्री';

  @override
  String get insightsDaysD1 => 'सोम';

  @override
  String get insightsDaysD2 => 'मंगळ';

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
  String get insightsDesigns => 'सर्वोत्तम डिझाइन';

  @override
  String get insightsByValue => 'विक्री मूल्यानुसार';

  @override
  String get insightsSalesmen => 'सर्वोत्तम सेल्समन';

  @override
  String get insightsSalesmenSub => 'त्यांनी विकलेल्या काउंटर ओळी आणि बीजके';

  @override
  String get insightsNoSalesmen => 'अद्याप कोणत्याही विक्रीवर सेल्समन नाही.';

  @override
  String get insightsCustomers => 'मोठे ग्राहक';

  @override
  String get insightsCustomersSub => 'बीजक असलेले ग्राहक, परतावा वजा';

  @override
  String get insightsBrands => 'ब्रँड';

  @override
  String get insightsTenders => 'ग्राहकांनी कसे पैसे दिले';

  @override
  String get insightsTendersSub => 'GST सह: काउंटर पेमेंट आणि उधारी बीजके';

  @override
  String get insightsModesCash => 'रोख';

  @override
  String get insightsModesUpi => 'UPI';

  @override
  String get insightsModesCard => 'कार्ड';

  @override
  String get insightsModesCredit => 'काउंटर उधारी';

  @override
  String get insightsModesInvoice => 'बीजके';

  @override
  String get insightsAgeing => 'विक्रीचे वय';

  @override
  String get insightsAgeingSub => 'विकण्यापूर्वी माल किती काळ होता';

  @override
  String get insightsAge => 'वय';

  @override
  String get insightsPieces => 'नग';

  @override
  String get insightsValue => 'मूल्य';

  @override
  String get insightsAgesD030 => '0 ते 30 दिवस';

  @override
  String get insightsAgesD3160 => '31 ते 60 दिवस';

  @override
  String get insightsAgesD6190 => '61 ते 90 दिवस';

  @override
  String get insightsAgesD91180 => '91 ते 180 दिवस';

  @override
  String get insightsAgesD181365 => '6 ते 12 महिने';

  @override
  String get insightsAgesY12 => '1 ते 2 वर्षे';

  @override
  String get insightsAgesY2plus => '2 वर्षांपेक्षा जास्त';

  @override
  String get insightsErrorsInvalidPeriod =>
      'सुरुवातीची तारीख शेवटच्या नंतर आहे.';

  @override
  String insightsOnCost(String v) {
    return 'मानक खर्चापेक्षा $v जास्त';
  }

  @override
  String get calcFrom => 'पुरवठादाराचे राज्य';

  @override
  String get calcTo => 'पुरवठ्याचे ठिकाण';

  @override
  String get calcQty => 'प्रमाण';

  @override
  String get calcRate => 'दर (₹)';

  @override
  String get calcGstRate => 'जीएसटी %';

  @override
  String get calcTaxable => 'करपात्र मूल्य';

  @override
  String get calcCgst => 'सीजीएसटी';

  @override
  String get calcSgst => 'एसजीएसटी';

  @override
  String get calcUtgst => 'यूटीजीएसटी';

  @override
  String get calcIgst => 'आयजीएसटी';

  @override
  String get calcRoundOff => 'पूर्णांक';

  @override
  String get calcTotal => 'एकूण';

  @override
  String get calcInWords => 'अक्षरी';

  @override
  String get calcCess => 'उपकर';

  @override
  String get companyTitle => 'कंपनी आणि शाखा';

  @override
  String get companySubtitle =>
      'कायदेशीर तपशील आणि प्रत्येक जीएसटीआयएन किंवा ठिकाणासाठी एक शाखा.';

  @override
  String get companyName => 'दाखवायचे नाव';

  @override
  String get companyLegalName => 'कायदेशीर नाव';

  @override
  String get companyPan => 'पॅन';

  @override
  String get companyBooksBegin => 'हिशेब सुरुवात';

  @override
  String get companyBranches => 'शाखा';

  @override
  String get companyAddBranch => 'शाखा जोडा';

  @override
  String get companyBranchName => 'शाखेचे नाव';

  @override
  String get companyHeadOffice => 'मुख्य कार्यालय';

  @override
  String get companyUnregistered => 'नोंदणीकृत नाही';

  @override
  String get companyCity => 'शहर';

  @override
  String get companyPincode => 'पिन कोड';

  @override
  String get seriesTitle => 'क्रमांक मालिका';

  @override
  String get seriesSubtitle =>
      'बीजक आणि व्हाउचरना क्रमांक कसे दिले जातात. जीएसटीनुसार जास्तीत जास्त 16 अक्षरे: अक्षरे, अंक, - आणि /.';

  @override
  String get seriesDocType => 'दस्तऐवज';

  @override
  String get seriesPattern => 'नमुना';

  @override
  String get seriesNext => 'पुढील क्रमांक';

  @override
  String get seriesFy => 'आर्थिक वर्ष';

  @override
  String get seriesTokens =>
      'टोकन: FY = 25-26, FYL = 2025-26, SEQ:5 = 00001, DEV = डिव्हाइस कोड (ऑफलाइन ॲप)';

  @override
  String get seriesTypesSalesInvoice => 'विक्री बीजक';

  @override
  String get seriesTypesCreditNote => 'क्रेडिट नोट';

  @override
  String get seriesTypesDebitNote => 'डेबिट नोट';

  @override
  String get seriesTypesPurchaseBill => 'खरेदी बिल';

  @override
  String get seriesTypesReceipt => 'पावती';

  @override
  String get seriesTypesPayment => 'भरणा';

  @override
  String get seriesTypesJournal => 'जर्नल व्हाउचर';

  @override
  String get seriesErrorsSeriesTooLong =>
      'या नमुन्यातील क्रमांक 16 अक्षरांपेक्षा मोठे होतील.';

  @override
  String get seriesErrorsSeriesBadChars => 'फक्त अक्षरे, अंक, - आणि / चालतात.';

  @override
  String get seriesErrorsSeriesEmpty => 'नमुन्यात SEQ टोकन असणे आवश्यक आहे.';

  @override
  String get seriesErrorsSeriesCannotGoBack =>
      'पुढील क्रमांक आधी दिलेल्या क्रमांकांपेक्षा कमी असू शकत नाही.';

  @override
  String get auditTitle => 'लेखापरीक्षण नोंद';

  @override
  String get auditSubtitle =>
      'प्रत्येक बदल, कोणी आणि केव्हा केला. नोंदी बदलता किंवा हटवता येत नाहीत.';

  @override
  String get auditWhen => 'केव्हा';

  @override
  String get auditWho => 'कोणी';

  @override
  String get auditWhat => 'काय';

  @override
  String get auditDetails => 'तपशील';

  @override
  String get auditLoadMore => 'जुन्या नोंदी लोड करा';

  @override
  String get auditActionsCreate => 'तयार केले';

  @override
  String get auditActionsUpdate => 'बदलले';

  @override
  String get auditActionsLogin => 'साइन इन केले';

  @override
  String get auditActionsDelete => 'हटवले';

  @override
  String get auditActionsCancel => 'रद्द केले';

  @override
  String get auditVerify => 'ऑडिट ट्रेल तपासा';

  @override
  String get auditVerifying => 'तपासत आहे...';

  @override
  String auditVerifyOk(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'सर्व $n नोंदी सुरक्षित आहेत. काहीही बदललेले किंवा काढलेले नाही.',
      one: 'सर्व $n नोंद सुरक्षित आहे. काहीही बदललेले किंवा काढलेले नाही.',
    );
    return '$_temp0';
  }

  @override
  String auditVerifyBroken(String seq, String reason) {
    return 'नोंद क्रमांक $seq आधीच्या नोंदींशी जुळत नाही ($reason). ऑडिट ट्रेल बदलले किंवा बिघडले आहे. प्रत ठेवा आणि सहाय्याशी संपर्क साधा.';
  }

  @override
  String get auditReasonGap => 'एक नोंद गायब आहे';

  @override
  String get auditReasonLink => 'क्रम तुटला आहे';

  @override
  String get auditReasonContent => 'नोंद बदलली आहे';

  @override
  String get auditVerifyFailed => 'तपासणी करता आली नाही. पुन्हा प्रयत्न करा.';

  @override
  String get backupTitle => 'बॅकअप आणि एक्सपोर्ट';

  @override
  String get backupSubtitle =>
      'तुमचा डेटा तुमचा आहे. केव्हाही सगळा डाउनलोड करा, Varchasv शिवायही उघडणाऱ्या फाइलमध्ये.';

  @override
  String get backupDownload => 'सर्व काही डाउनलोड करा (ZIP)';

  @override
  String get backupWhat => 'तुम्हाला काय मिळते';

  @override
  String get backupItem1 =>
      'प्रत्येक तक्ता Excel साठी CSV फाइलमध्ये आणि अचूक मूल्यांसह JSON फाइलमध्ये.';

  @override
  String get backupItem2 =>
      'तुम्ही अपलोड केलेला प्रत्येक दस्तऐवज जसा होता तसा.';

  @override
  String get backupItem3 =>
      'प्रत्येक तक्ता समजावणारी README आणि चेकसम यादी, म्हणजे काही बदलले नाही हे नंतर दाखवता येईल.';

  @override
  String get backupLeftOut =>
      'पासवर्ड, लॉगिन टोकन आणि कर-पोर्टल सत्रे समाविष्ट नाहीत.';

  @override
  String get backupKeep =>
      'फाइल सुरक्षित ठिकाणी ठेवा. त्यात तुमचे ग्राहक, पुरवठादार, किमती आणि हिशेब आहेत.';

  @override
  String get backupSlow =>
      'मोठ्या व्यवसायासाठी तयार व्हायला एक मिनिट लागू शकतो.';

  @override
  String get backupAuditLink => 'तुमचे ऑडिट ट्रेल अबाधित आहे का ते तपासा';

  @override
  String get roadmapAccounts => 'हिशेब आणि जीएसटी रिटर्न';

  @override
  String get roadmapInventory => 'माल आणि खरेदी';

  @override
  String get roadmapSales => 'विक्री, ई-इनव्हॉइस आणि ई-वे बिल';

  @override
  String get roadmapOffline =>
      'Windows, Mac, Linux, Android आणि iOS साठी ऑफलाइन ॲप';

  @override
  String get roadmapPayroll => 'एचआर आणि पगार';

  @override
  String get switcherTitle => 'तुमचे व्यवसाय';

  @override
  String get switcherAddBusiness => 'व्यवसाय जोडा';

  @override
  String get switcherCreate => 'व्यवसाय तयार करा';

  @override
  String get teamTitle => 'टीम आणि भूमिका';

  @override
  String get teamSubtitle =>
      'हा व्यवसाय कोण वापरू शकतो आणि प्रत्येकजण काय करू शकतो.';

  @override
  String get teamMembers => 'सदस्य';

  @override
  String get teamInvite => 'आमंत्रित करा';

  @override
  String get teamInviteTitle => 'एखाद्याला आमंत्रित करा';

  @override
  String get teamEmail => 'ईमेल';

  @override
  String get teamRole => 'भूमिका';

  @override
  String get teamStatus => 'स्थिती';

  @override
  String get teamActive => 'सक्रिय';

  @override
  String get teamSuspended => 'निलंबित';

  @override
  String get teamYou => 'तुम्ही';

  @override
  String get teamPendingInvites => 'प्रलंबित आमंत्रणे';

  @override
  String get teamExpires => 'मुदत संपते';

  @override
  String get teamRevoke => 'मागे घ्या';

  @override
  String get teamSuspend => 'निलंबित करा';

  @override
  String get teamReactivate => 'पुन्हा सक्रिय करा';

  @override
  String get teamRemove => 'काढा';

  @override
  String get teamInviteLink => 'आमंत्रण लिंक';

  @override
  String get teamInviteLinkHint =>
      'आम्ही ती ईमेल केली आहे. तुम्ही ती WhatsApp वरही पाठवू शकता: ती एकदाच चालते आणि 7 दिवसांत संपते.';

  @override
  String get teamRoles => 'भूमिका';

  @override
  String get teamNewRole => 'नवीन भूमिका';

  @override
  String get teamRoleName => 'भूमिकेचे नाव';

  @override
  String get teamPermissions => 'परवानग्या';

  @override
  String get teamSystemRole => 'अंगभूत';

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
  String get teamModulesAccounts => 'हिशेब';

  @override
  String get teamModulesSales => 'विक्री';

  @override
  String get teamModulesPurchase => 'खरेदी';

  @override
  String get teamModulesInventory => 'माल';

  @override
  String get teamModulesGst => 'जीएसटी';

  @override
  String get teamModulesHr => 'एचआर';

  @override
  String get teamModulesPayroll => 'पगार';

  @override
  String get teamModulesReports => 'अहवाल';

  @override
  String get teamModulesSettings => 'सेटिंग्ज';

  @override
  String get teamModulesBanking => 'बँकिंग';

  @override
  String get teamModulesAssets => 'स्थिर मालमत्ता';

  @override
  String get teamModulesExpenses => 'खर्च';

  @override
  String get teamModulesProjects => 'प्रकल्प';

  @override
  String get teamModulesCrm => 'सीआरएम';

  @override
  String get teamPermView => 'पहा';

  @override
  String get teamPermCreate => 'तयार करा';

  @override
  String get teamPermEdit => 'बदला';

  @override
  String get teamPermSubmit => 'सादर करा';

  @override
  String get teamPermCancel => 'रद्द करा';

  @override
  String get teamPermDelete => 'हटवा';

  @override
  String get teamPermExport => 'निर्यात';

  @override
  String get teamPermApprove => 'मंजूर करा';

  @override
  String get teamErrorsCannotChangeSelf =>
      'तुम्ही स्वतःचा प्रवेश बदलू शकत नाही.';

  @override
  String get teamErrorsLastOwner => 'व्यवसायाला किमान एक सक्रिय मालक हवा.';

  @override
  String get teamErrorsOwnerOnly => 'हे फक्त मालक करू शकतो.';

  @override
  String get teamErrorsAlreadyMember => 'ही व्यक्ती आधीच सदस्य आहे.';

  @override
  String get teamErrorsPermissionEscalation =>
      'तुमच्याकडे नसलेल्या परवानग्या तुम्ही देऊ शकत नाही.';

  @override
  String get teamErrorsSystemRole => 'अंगभूत भूमिका बदलता येत नाहीत.';

  @override
  String get teamErrorsRoleInUse =>
      'ही भूमिका हटवण्यापूर्वी सदस्यांना दुसऱ्या भूमिकेत हलवा.';

  @override
  String get teamErrorsUnknownRole => 'ती भूमिका आता अस्तित्वात नाही.';

  @override
  String get teamSpecialTitle => 'विशेष अधिकार';

  @override
  String get teamSpecialHelp =>
      'वरील तक्त्याबाहेरचे एकेक अधिकार. कोणी बिले बनवू शकतो पण मागची तारीख टाकणे किंवा खरेदी किमतीखाली विकणे त्याच्या हातात नसते.';

  @override
  String get teamSpecialChangeDate => 'दस्तऐवजांवर मागची तारीख टाकणे';

  @override
  String get teamSpecialFutureDate => 'दस्तऐवजांवर पुढची तारीख टाकणे';

  @override
  String get teamSpecialSellBelowCost => 'खरेदी किमतीखाली विकणे';

  @override
  String get teamSpecialSeeAgentCommission => 'एजंट कमिशन पाहणे';

  @override
  String get teamSpecialImportData => 'डेटा आयात करणे';

  @override
  String inviteTitle(String business) {
    return '$business मध्ये सामील व्हा';
  }

  @override
  String inviteSubtitle(String email, String role) {
    return '$email यांना $role म्हणून आमंत्रित केले आहे.';
  }

  @override
  String get inviteCreateAccount => 'स्वीकारण्यासाठी तुमचे खाते तयार करा.';

  @override
  String get inviteSignInToAccept =>
      'स्वीकारण्यासाठी तुमचा Varchasv पासवर्ड टाका.';

  @override
  String get inviteAccept => 'आमंत्रण स्वीकारा';

  @override
  String get inviteInvalid =>
      'ही आमंत्रण लिंक अवैध आहे, आधीच वापरली गेली आहे किंवा तिची मुदत संपली आहे. नवीन लिंक मागा.';

  @override
  String get accountsTitle => 'खात्यांची यादी';

  @override
  String get accountsSubtitle =>
      'तुमच्या लेखापालाला अपेक्षित गटांनुसार खाती. ग्राहक विविध देणेकरी (Sundry Debtors) खाली, पुरवठादार विविध घेणेकरी (Sundry Creditors) खाली.';

  @override
  String get accountsNewAccount => 'नवीन खाते';

  @override
  String get accountsName => 'खात्याचे नाव';

  @override
  String get accountsNameHi => 'हिंदीतील नाव';

  @override
  String get accountsGroup => 'गट';

  @override
  String get accountsBalance => 'शिल्लक';

  @override
  String get accountsOpeningBalance => 'आरंभीची शिल्लक';

  @override
  String get accountsOpeningHint =>
      'नावे (रोख, बँक, देणेकरी) साठी धन; जमा (भांडवल, कर्ज, घेणेकरी) साठी ऋण.';

  @override
  String get accountsCode => 'कोड';

  @override
  String get accountsParty => 'पक्षाचा तपशील';

  @override
  String get accountsPhone => 'फोन';

  @override
  String get accountsIfsc => 'आयएफएससी';

  @override
  String get accountsAccountNumber => 'खाते क्रमांक';

  @override
  String get accountsAllGroups => 'सर्व गट';

  @override
  String get accountsEmpty => 'जुळणारे खाते नाही.';

  @override
  String get accountsErrorsAccountNameTaken => 'या नावाचे खाते आधीच आहे.';

  @override
  String get accountsErrorsUnknownGroup => 'गट निवडा.';

  @override
  String get accountsErrorsInvalidIfsc => 'आयएफएससी HDFC0001234 सारखा असतो.';

  @override
  String get accountsErrorsInvalidPan => 'पॅन ABCDE1234F सारखा असतो.';

  @override
  String get accountsErrorsSystemAccountGroup =>
      'अंगभूत खाती त्यांच्या गटातच राहतात.';

  @override
  String get accountsErrorsNotAnAgent =>
      'दलाल किंवा एजंट म्हणून खूण केलेले खाते निवडा.';

  @override
  String get accountsErrorsUnknownSalesman =>
      'तुमच्या कर्मचाऱ्यांमधून सेल्समन निवडा.';

  @override
  String get accountsCreditLimit => 'उधारी मर्यादा (₹)';

  @override
  String get accountsCreditDays => 'उधारी दिवस';

  @override
  String get accountsCreditControl => 'मर्यादा ओलांडल्यास किंवा थकबाकी असल्यास';

  @override
  String get accountsCreditControlHint =>
      'ब्लॉक केल्यास मालक किंवा अॅडमिन परवानगी देईपर्यंत नवी विक्री थांबते.';

  @override
  String get accountsCreditWarn => 'इशारा देऊन परवानगी';

  @override
  String get accountsCreditBlock => 'ब्लॉक';

  @override
  String get accountsBlockOverdueDays => 'परवानगी असलेले थकीत दिवस';

  @override
  String get accountsInterestRate => 'थकबाकीवर व्याज (% वार्षिक)';

  @override
  String get vouchersTitle => 'व्हाउचर';

  @override
  String get vouchersSubtitle =>
      'तुमच्या हिशेबातील प्रत्येक नोंद. नोंदवलेले व्हाउचर कधीही बदलले जात नाहीत: रद्द करून पुन्हा नोंदवा.';

  @override
  String get vouchersNew => 'नवीन व्हाउचर';

  @override
  String get vouchersTypesJournal => 'जर्नल';

  @override
  String get vouchersTypesPayment => 'भरणा';

  @override
  String get vouchersTypesReceipt => 'पावती';

  @override
  String get vouchersTypesContra => 'कॉन्ट्रा';

  @override
  String get vouchersTypesPurchase => 'खरेदी';

  @override
  String get vouchersTypesDebitNote => 'डेबिट नोट';

  @override
  String get vouchersTypesSales => 'विक्री';

  @override
  String get vouchersTypesCreditNote => 'क्रेडिट नोट';

  @override
  String get vouchersTypesGatewaySettlement => 'गेटवे सेटलमेंट';

  @override
  String get vouchersTypesAssetPurchase => 'मालमत्ता खरेदी';

  @override
  String get vouchersTypesDepreciation => 'घसारा';

  @override
  String get vouchersTypesAssetDisposal => 'मालमत्ता विक्री';

  @override
  String get vouchersTypesExpenseClaim => 'खर्च दावा';

  @override
  String get vouchersTypesBrokerage => 'दलाली बिल';

  @override
  String get vouchersTypeHintsJournal =>
      'समायोजन, उधारी विक्री व खरेदी, तरतुदी.';

  @override
  String get vouchersTypeHintsPayment => 'रोख किंवा बँकेतून बाहेर जाणारे पैसे.';

  @override
  String get vouchersTypeHintsReceipt => 'रोख किंवा बँकेत येणारे पैसे.';

  @override
  String get vouchersTypeHintsContra => 'फक्त रोख आणि बँक खात्यांमध्ये.';

  @override
  String get vouchersNumber => 'क्रमांक';

  @override
  String get vouchersReference => 'संदर्भ';

  @override
  String get vouchersAccount => 'खाते';

  @override
  String get vouchersAccounts => 'खाती';

  @override
  String get vouchersAmount => 'रक्कम';

  @override
  String get vouchersAddLine => 'ओळ जोडा';

  @override
  String get vouchersDifference => 'फरक';

  @override
  String get vouchersPost => 'व्हाउचर नोंदवा';

  @override
  String get vouchersCancel => 'व्हाउचर रद्द करा';

  @override
  String get vouchersCancelReason => 'रद्द करण्याचे कारण';

  @override
  String get vouchersCancelled => 'रद्द';

  @override
  String get vouchersPosted => 'नोंदवले';

  @override
  String get vouchersStatus => 'स्थिती';

  @override
  String get vouchersEmpty => 'या कालावधीत व्हाउचर नाहीत.';

  @override
  String get vouchersChooseAccount => 'खाते निवडा…';

  @override
  String get vouchersErrorsUnbalanced => 'नावे आणि जमा समान असणे आवश्यक आहे.';

  @override
  String get vouchersErrorsTooFewLines => 'व्हाउचरला किमान दोन ओळी हव्यात.';

  @override
  String get vouchersErrorsZeroLine => 'प्रत्येक ओळीला रक्कम हवी.';

  @override
  String get vouchersErrorsBothSides =>
      'एक ओळ नावे किंवा जमा असू शकते, दोन्ही नाही.';

  @override
  String get vouchersErrorsNegativeAmount => 'रक्कम ऋण असू शकत नाही.';

  @override
  String get vouchersErrorsPaymentNeedsCashBankCredit =>
      'भरण्यात रोख किंवा बँक खाते जमा असणे आवश्यक आहे.';

  @override
  String get vouchersErrorsReceiptNeedsCashBankDebit =>
      'पावतीत रोख किंवा बँक खाते नावे असणे आवश्यक आहे.';

  @override
  String get vouchersErrorsContraOnlyCashBank =>
      'कॉन्ट्रा व्हाउचरमध्ये फक्त रोख आणि बँक खाती चालतात.';

  @override
  String get vouchersErrorsPeriodLocked =>
      'ही तारीख बंद केलेल्या कालावधीत आहे.';

  @override
  String get vouchersErrorsPeriodClosed => 'हे आर्थिक वर्ष बंद आहे.';

  @override
  String get vouchersErrorsBeforeBooksBegin =>
      'ही तारीख हिशेब सुरू होण्यापूर्वीची आहे.';

  @override
  String get vouchersErrorsAlreadyCancelled => 'हे व्हाउचर आधीच रद्द आहे.';

  @override
  String get vouchersErrorsUnknownAccount => 'एखादे खाते आता अस्तित्वात नाही.';

  @override
  String get vouchersErrorsAccountArchived => 'एखादे खाते संग्रहित आहे.';

  @override
  String vouchersNegativeWarning(String account, String amount) {
    return '$account शून्याखाली जाईल: $amount. तरीही तुम्ही नोंदवू शकता.';
  }

  @override
  String get promosTitle => 'व्हाउचर आणि कूपन';

  @override
  String get promosSubtitle =>
      'काउंटरसाठी गिफ्ट व्हाउचर, कूपन कोड, डिस्काउंट कार्ड आणि लकी ड्रॉ.';

  @override
  String get promosStatusesActive => 'सुरू';

  @override
  String get promosStatusesUsed => 'पूर्ण वापरले';

  @override
  String get promosStatusesExpired => 'मुदत संपली';

  @override
  String get promosGiftTitle => 'गिफ्ट व्हाउचर';

  @override
  String promosGiftHint(String amount) {
    return 'सुरू व्हाउचरवर अजून $amount देय आहे. GST व्हाउचर विकताना नाही, त्याने माल घेताना लागतो.';
  }

  @override
  String get promosGiftCode => 'कोड';

  @override
  String get promosGiftFor => 'कोणासाठी';

  @override
  String get promosGiftValue => 'मूल्य (₹)';

  @override
  String get promosGiftBalance => 'शिल्लक';

  @override
  String get promosGiftExpires => 'मुदत संपण्याची तारीख';

  @override
  String get promosGiftEmpty => 'अजून गिफ्ट व्हाउचर विकले नाहीत.';

  @override
  String get promosGiftCount => 'किती';

  @override
  String get promosGiftPaidBy => 'पैसे कसे दिले';

  @override
  String get promosGiftSell => 'व्हाउचर विका';

  @override
  String get promosGiftIssued => 'विकले. कोड:';

  @override
  String get promosGiftExpire => 'मुदत संपलेल्या व्हाउचरची रक्कम परत नोंदवा';

  @override
  String get promosGiftExpireHint =>
      'तारीख उलटलेल्या व्हाउचरची उरलेली रक्कम उत्पन्न होते.';

  @override
  String promosGiftExpiredDone(String n, String amount) {
    return '$n व्हाउचरची मुदत संपली, $amount परत नोंदवले.';
  }

  @override
  String get promosCouponsTitle => 'कूपन कोड';

  @override
  String get promosCouponsNew => 'नवीन कूपन';

  @override
  String get promosCouponsCode => 'कोड';

  @override
  String get promosCouponsOff => 'सूट';

  @override
  String get promosCouponsValid => 'वैध';

  @override
  String get promosCouponsUsed => 'वापर';

  @override
  String get promosCouponsEmpty => 'अजून कूपन नाहीत.';

  @override
  String promosCouponsUpTo(String amount) {
    return '$amount पर्यंत';
  }

  @override
  String get promosCouponsMaxDiscount => 'कमाल सूट (₹)';

  @override
  String get promosCouponsMinBill => 'किमान बिल (₹)';

  @override
  String get promosCouponsMaxUses => 'किती वेळा';

  @override
  String get promosCouponsMaxUsesHint => 'रिकामे = मर्यादा नाही';

  @override
  String get promosCardsTitle => 'डिस्काउंट कार्ड';

  @override
  String get promosCardsNew => 'नवीन कार्ड';

  @override
  String get promosCardsNumber => 'कार्ड क्रमांक';

  @override
  String get promosCardsHolder => 'धारक';

  @override
  String get promosCardsValidUntil => 'कधीपर्यंत वैध';

  @override
  String get promosCardsEmpty => 'अजून डिस्काउंट कार्ड नाहीत.';

  @override
  String get promosDrawTitle => 'लकी ड्रॉ';

  @override
  String promosDrawSummary(String from, String to, String entries) {
    return '$from ते $to · $entries नोंदी';
  }

  @override
  String get promosDrawEmpty => 'अजून ड्रॉ नाहीत.';

  @override
  String get promosDrawWinners => 'विजेते';

  @override
  String get promosDrawHint =>
      'या कालावधीतील ग्राहक मोबाईल असलेले प्रत्येक बिल एक नोंद आहे; प्रत्येक मोबाईल एकदाच जिंकू शकतो.';

  @override
  String get promosDrawRun => 'विजेते निवडा';

  @override
  String get promosStatus => 'स्थिती';

  @override
  String get promosErrorsInvalidAmount => 'रुपयांत रक्कम लिहा.';

  @override
  String get promosErrorsInvalidPercent => '0 ते 100 मधील टक्के लिहा.';

  @override
  String get promosErrorsCodeTaken => 'हा कोड आधीच वापरात आहे.';

  @override
  String get promosErrorsExpiryBeforeIssue =>
      'मुदत संपण्याची तारीख आजनंतरची हवी.';

  @override
  String get promosErrorsEndsBeforeStart =>
      'शेवटची तारीख सुरुवातीच्या तारखेच्या आधी आहे.';

  @override
  String get promosErrorsNoEntries =>
      'त्या कालावधीत ग्राहक मोबाईल असलेले बिल नाही.';

  @override
  String get promosErrorsInvalidCode => 'फक्त अक्षरे, अंक आणि हायफन.';

  @override
  String get promosErrorsInvalidPhone => '10 अंकी मोबाईल क्रमांक लिहा.';

  @override
  String get posReturnsTitle => 'परतावा आणि बदल';

  @override
  String get posReturnsSubtitle =>
      'बिलाविरुद्ध माल परत घ्या. साइज किंवा रंग बदलण्यासाठी स्टोअर क्रेडिट द्या आणि त्याने नवीन नग बिल करा.';

  @override
  String get posReturnsReturn => 'परत';

  @override
  String posReturnsSaved(String number) {
    return 'परतावा $number जतन केला';
  }

  @override
  String get posReturnsCreditCode => 'स्टोअर क्रेडिट कोड:';

  @override
  String get posReturnsExchangeNow => 'आता बदलाचे बिल करा';

  @override
  String posReturnsRefunded(String mode) {
    return '$mode ने परत दिले.';
  }

  @override
  String posReturnsAgainst(String number) {
    return '$number विरुद्ध परतावा';
  }

  @override
  String get posReturnsCanReturn => 'परत होऊ शकते';

  @override
  String get posReturnsQty => 'परत नग';

  @override
  String get posReturnsReason => 'कारण';

  @override
  String get posReturnsCondition => 'स्थिती';

  @override
  String get posReturnsCounter => 'काउंटर';

  @override
  String get posReturnsNoShift => 'आधी काउंटरवर शिफ्ट सुरू करा.';

  @override
  String get posReturnsGive => 'कशा रूपात परत द्या';

  @override
  String get posReturnsVoucherHint =>
      'आता किंवा नंतर बदलाचे पैसे देण्यासाठी व्हाउचर कोड';

  @override
  String get posReturnsStoreCredit => 'स्टोअर क्रेडिट (बदल)';

  @override
  String posReturnsAbout(String amount) {
    return 'सुमारे $amount';
  }

  @override
  String get posReturnsTake => 'परत घ्या';

  @override
  String get posReturnsNumber => 'परतावा';

  @override
  String get posReturnsBill => 'बिल';

  @override
  String get posReturnsWhat => 'काय परत आले';

  @override
  String get posReturnsNone => 'या दिवशी परतावा नाही.';

  @override
  String get posReturnsByReason => 'कारणानुसार';

  @override
  String get posReturnsByCondition => 'स्थितीनुसार';

  @override
  String get posReturnsBillNumber => 'बिल क्रमांक';

  @override
  String get posReturnsFind => 'बिल शोधा';

  @override
  String get posReturnsNotFound => 'त्या क्रमांकाचे बिल नाही.';

  @override
  String get posReturnsDate => 'तारीख';

  @override
  String get posReturnsShow => 'दाखवा';

  @override
  String get posReturnsReasonsSize => 'साइज';

  @override
  String get posReturnsReasonsColour => 'रंग';

  @override
  String get posReturnsReasonsDefect => 'उत्पादन दोष';

  @override
  String get posReturnsReasonsDamaged => 'खराब झालेले';

  @override
  String get posReturnsReasonsNotLiked => 'आवडले नाही';

  @override
  String get posReturnsReasonsOther => 'इतर';

  @override
  String get posReturnsGradesA => 'A: नवीनसारखे, शेल्फवर परत';

  @override
  String get posReturnsGradesB => 'B: किरकोळ दोष, सेकंड म्हणून विका';

  @override
  String get posReturnsGradesC => 'C: विकता येणार नाही';

  @override
  String get posReturnsErrorsBillVoid =>
      'हे बिल रद्द झाले आहे; त्यावर परतावा होणार नाही.';

  @override
  String get posReturnsErrorsOverReturn =>
      'हे त्या ओळीवर उरलेल्यापेक्षा जास्त आहे.';

  @override
  String get posReturnsErrorsSessionNotOpen =>
      'आधी या काउंटरवर शिफ्ट सुरू करा.';

  @override
  String get posReturnsErrorsDuplicateLine => 'एक ओळ दोनदा आहे.';

  @override
  String get alterationsTitle => 'ऑल्टरेशन आणि दुरुस्ती';

  @override
  String get alterationsSubtitle =>
      'फिटिंगसाठी कपडे घ्या, कारागिराला द्या आणि ठरलेल्या दिवशी परत द्या.';

  @override
  String get alterationsNewSlip => 'नवीन ऑल्टरेशन स्लिप';

  @override
  String get alterationsSetUpFirst =>
      'स्लिप घेण्यासाठी आधी खाली ऑल्टरेशनचे प्रकार जोडा.';

  @override
  String get alterationsStatusReceived => 'घेतले';

  @override
  String get alterationsStatusWithKarigar => 'कारागिराकडे';

  @override
  String get alterationsStatusReady => 'ग्राहकासाठी तयार';

  @override
  String get alterationsNone => 'येथे काही नाही.';

  @override
  String alterationsLabour(String from, String to) {
    return 'कारागीर मजुरी, $from ते $to';
  }

  @override
  String get alterationsKarigar => 'कारागीर';

  @override
  String get alterationsKarigars => 'कारागीर';

  @override
  String get alterationsKarigarHint =>
      'बाहेरच्या कारागिरांचे स्वतःचे खाते बनते; काम परत आल्यावर मजुरी जमा होते. आतले कारागीर पगारातून.';

  @override
  String get alterationsNoKarigars => 'अजून कारागीर नाहीत.';

  @override
  String get alterationsOutside => 'बाहेरचा कारागीर';

  @override
  String get alterationsInHouse => 'आतले';

  @override
  String get alterationsPhone => 'मोबाईल';

  @override
  String get alterationsSlips => 'स्लिप';

  @override
  String get alterationsPieces => 'नग';

  @override
  String get alterationsLabourCol => 'मजुरी';

  @override
  String get alterationsNoLabour =>
      'या महिन्यात कारागिरांकडून काही परत आले नाही.';

  @override
  String get alterationsOverdue => 'उशीर';

  @override
  String alterationsDue(String date) {
    return '$date पर्यंत';
  }

  @override
  String alterationsTrial(String date) {
    return 'ट्रायल $date';
  }

  @override
  String alterationsWith(String name) {
    return '$name कडे';
  }

  @override
  String get alterationsFree => 'मोफत';

  @override
  String get alterationsGive => 'द्या';

  @override
  String get alterationsBack => 'कारागिराकडून परत';

  @override
  String get alterationsDeliver => 'द्या';

  @override
  String alterationsDeliverCollect(String amount) {
    return 'द्या आणि $amount घ्या';
  }

  @override
  String get alterationsCancelSlip => 'स्लिप रद्द करा';

  @override
  String get alterationsAgainstBill => 'बिलाविरुद्ध';

  @override
  String get alterationsTrialOn => 'ट्रायलची तारीख';

  @override
  String get alterationsDeliveryOn => 'देण्याची तारीख';

  @override
  String get alterationsComplimentary => 'खरेदीसोबत मोफत';

  @override
  String get alterationsGarment => 'कपडा';

  @override
  String get alterationsWork => 'काम';

  @override
  String get alterationsNotes => 'मापे आणि टिपा';

  @override
  String get alterationsAddWork => 'काम जोडा';

  @override
  String get alterationsTakeIn => 'स्लिप करा';

  @override
  String alterationsCharge(String amount) {
    return 'शुल्क $amount';
  }

  @override
  String get alterationsTypes => 'दिल्या जाणाऱ्या ऑल्टरेशन आणि दुरुस्ती';

  @override
  String get alterationsCustomerCharge => 'ग्राहक देईल';

  @override
  String get alterationsKindsAlteration => 'ऑल्टरेशन';

  @override
  String get alterationsKindsRepair => 'दुरुस्ती';

  @override
  String get alterationsErrorsNameTaken => 'हे नाव आधीच वापरात आहे.';

  @override
  String get alterationsErrorsNotReceived =>
      'ही स्लिप आधीच कारागिराकडे गेली आहे.';

  @override
  String get alterationsErrorsNotWithKarigar =>
      'ही स्लिप कोणत्याही कारागिराकडे नाही.';

  @override
  String get alterationsErrorsNotReady => 'ही स्लिप अजून तयार नाही.';

  @override
  String get alterationsErrorsTerminalRequired =>
      'शुल्क घेण्यासाठी काउंटर निवडा.';

  @override
  String get alterationsErrorsDeliveryBeforeDate =>
      'देण्याची तारीख स्लिपच्या तारखेच्या आधी आहे.';

  @override
  String get alterationsErrorsTrialOutOfRange =>
      'ट्रायल स्लिप आणि देण्याच्या तारखेच्या दरम्यान हवी.';

  @override
  String get alterationsErrorsCannotCancel =>
      'दिलेली किंवा रद्द स्लिप रद्द करता येत नाही.';

  @override
  String get tailoringTitle => 'ऑर्डरनुसार शिवणकाम';

  @override
  String get tailoringSubtitle =>
      'मापे, आगाऊ रक्कम, प्रत्येक काम कारागिराकडून, आणि देताना शिवणकामाचे बिल.';

  @override
  String get tailoringNewOrder => 'नवीन शिवण ऑर्डर';

  @override
  String get tailoringTakeMeasurements => 'मापे घ्या';

  @override
  String get tailoringStatusBooked => 'नोंदवले';

  @override
  String get tailoringStatusInWork => 'काम सुरू आहे';

  @override
  String get tailoringStatusReady => 'देण्यासाठी तयार';

  @override
  String get tailoringTrialDue => 'ट्रायल बाकी';

  @override
  String get tailoringToday => 'आज द्यायचे';

  @override
  String get tailoringMarkDone => 'झाले';

  @override
  String get tailoringMarkReady => 'तयार म्हणून नोंदवा';

  @override
  String tailoringTotalAdvance(String total, String advance) {
    return 'एकूण $total, आगाऊ $advance';
  }

  @override
  String tailoringDeliver(String amount) {
    return 'द्या आणि $amount घ्या';
  }

  @override
  String get tailoringCancelOrder => 'ऑर्डर रद्द करा';

  @override
  String tailoringCardsFound(String n) {
    return '$n माप कार्ड आहेत';
  }

  @override
  String get tailoringStitchingPrice => 'शिवणकामाची किंमत';

  @override
  String get tailoringMeasurements => 'माप कार्ड';

  @override
  String get tailoringNoCard => 'कार्ड नाही';

  @override
  String get tailoringFabric => 'कापड';

  @override
  String get tailoringOwnFabric => 'ग्राहकाचे स्वतःचे कापड';

  @override
  String get tailoringMetres => 'मीटर';

  @override
  String get tailoringStyleNotes =>
      'स्टाइल टिपा (कॉलर, खिसे, फिटिंग, अस्तर...)';

  @override
  String get tailoringAddGarment => 'कपडा जोडा';

  @override
  String get tailoringAdvance => 'आगाऊ (₹)';

  @override
  String get tailoringAdvanceHint =>
      'या ऑर्डरसाठी जमा राहते; देताना बिलातून वजा होते';

  @override
  String get tailoringBook => 'ऑर्डर नोंदवा';

  @override
  String tailoringEstimate(String amount) {
    return 'अंदाज $amount';
  }

  @override
  String get tailoringInches => 'मापे इंचात. नको ते रिकामे ठेवा.';

  @override
  String get tailoringOtherMeasure => 'इतर माप';

  @override
  String get tailoringValue => 'मूल्य';

  @override
  String get tailoringPhoto => 'फोटो जोडा';

  @override
  String get tailoringRates => 'कामानुसार कारागीर दर';

  @override
  String get tailoringRatesHint =>
      'प्रत्येक कपड्याच्या प्रत्येक कामाची प्रति नग मजुरी, होण्याच्या क्रमाने. नवीन ऑर्डर ही कामे घेतात.';

  @override
  String get tailoringProcess => 'काम';

  @override
  String get tailoringNoRates =>
      'अजून दर नाहीत: दर जोडेपर्यंत ऑर्डरमध्ये कामे नसतील.';

  @override
  String get tailoringAddRate => 'काम जोडा';

  @override
  String get tailoringKeysChest => 'छाती';

  @override
  String get tailoringKeysWaist => 'कंबर';

  @override
  String get tailoringKeysHip => 'नितंब';

  @override
  String get tailoringKeysShoulder => 'खांदा';

  @override
  String get tailoringKeysLength => 'लांबी';

  @override
  String get tailoringKeysSleeve => 'बाही';

  @override
  String get tailoringKeysNeck => 'गळा';

  @override
  String get tailoringKeysInseam => 'आतील लांबी';

  @override
  String get tailoringErrorsPhotoTooBig => 'फोटो खूप मोठा आहे (कमाल 6 MB).';

  @override
  String get tailoringErrorsAdvanceMoreThanTotal =>
      'आगाऊ रक्कम ऑर्डरच्या एकूणपेक्षा जास्त आहे.';

  @override
  String get tailoringErrorsAssignFirst => 'आधी काम कारागिराला द्या.';

  @override
  String get tailoringErrorsProcessDone => 'ते काम आधीच झाले आहे.';

  @override
  String get tailoringErrorsProcessesPending => 'काही कामे अजून बाकी आहेत.';

  @override
  String get tailoringErrorsNotReady => 'ही ऑर्डर अजून तयार नाही.';

  @override
  String get tailoringErrorsOrderClosed =>
      'ही ऑर्डर आधीच दिली किंवा रद्द झाली आहे.';

  @override
  String get tailoringErrorsFabricQtyRequired => 'किती मीटर कापड ते लिहा.';

  @override
  String get tailoringErrorsNoMeasurements => 'किमान एक माप लिहा.';

  @override
  String get tailoringErrorsDuplicateRate => 'तोच कपडा आणि काम दोनदा आहे.';

  @override
  String get consignmentTitle => 'कन्साइनमेंट आणि शॉप-इन-शॉप';

  @override
  String get consignmentSubtitle =>
      'इतर दुकानांत ठेवलेला माल विकला जाईपर्यंत तुमचाच असतो. माल पाठवा, परत घ्या आणि त्यांच्या विक्री अहवालानुसार बिल करा.';

  @override
  String get consignmentSend => 'माल पाठवा';

  @override
  String get consignmentBillSales => 'त्यांच्या विक्रीचे बिल';

  @override
  String get consignmentTakeBack => 'माल परत घ्या';

  @override
  String get consignmentConsignee => 'कन्साइनी';

  @override
  String get consignmentHeld => 'त्यांच्याकडे';

  @override
  String get consignmentValueAtCost => 'खर्चानुसार मूल्य';

  @override
  String get consignmentSold => 'विकले';

  @override
  String get consignmentAgeing => 'जुना माल';

  @override
  String consignmentItemsAgeing(String n) {
    return '150 दिवसांपेक्षा जुन्या वस्तू: $n';
  }

  @override
  String get consignmentFine => 'सर्व नवीन';

  @override
  String get consignmentNone => 'अद्याप कोणताही माल कन्साइनमेंटवर नाही.';

  @override
  String consignmentReconcileTitle(String name) {
    return 'जुळवणी: $name';
  }

  @override
  String get consignmentReconcileHint =>
      'त्यांच्या दुकानात मोजलेली संख्या भरा. कमी भरलेले पीस विकले म्हणून त्यांना बिल केले जातील. माल पाठवल्यापासून सहा महिन्यांत बिल करणे आवश्यक आहे.';

  @override
  String get consignmentSent => 'पाठवले';

  @override
  String get consignmentReturned => 'परत आले';

  @override
  String get consignmentCounted => 'मोजणी';

  @override
  String get consignmentInvoiceBy => 'बिलाची अंतिम तारीख';

  @override
  String consignmentMismatch(String n) {
    return '$n चा फरक';
  }

  @override
  String consignmentShortage(String n) {
    return 'मोजणीत कमी पीस: $n';
  }

  @override
  String get consignmentShortageNarration => 'स्टॉक मोजणीत विकलेले आढळले';

  @override
  String get consignmentBillShortage => 'कमतरता विकली म्हणून बिल करा';

  @override
  String get consignmentRegister => 'हालचाली';

  @override
  String get consignmentKindsSend => 'पाठवले';

  @override
  String get consignmentKindsReturn => 'परत आले';

  @override
  String get consignmentKindsSale => 'विकले आणि बिल झाले';

  @override
  String get consignmentFormsSend => 'कन्साइनमेंटवर माल पाठवा';

  @override
  String get consignmentFormsReturn => 'माल परत घ्या';

  @override
  String get consignmentFormsSales => 'त्यांचा विक्री अहवाल';

  @override
  String get consignmentFormHintsSend =>
      'माल त्यांच्या दुकानात जातो आणि तुमच्या हिशोबात राहतो. दर रिकामा ठेवल्यास त्यांची किंमत यादी किंवा वस्तूचा विक्री दर लागेल.';

  @override
  String get consignmentFormHintsReturn =>
      'न विकलेले पीस तुमच्या मुख्य गोदामात परत येतात.';

  @override
  String get consignmentFormHintsSales =>
      'प्रत्येक विक्री अहवाल त्यांच्या दुकानातील मालातून त्यांच्या नावे कर बीजक बनतो. क्रेडिट मर्यादा ओलांडली तरी इशाऱ्यासह बनतो.';

  @override
  String get consignmentAgreedRate => 'ठरलेला दर';

  @override
  String get consignmentAddLine => 'वस्तू जोडा';

  @override
  String get consignmentSaveSend => 'पाठवा';

  @override
  String get consignmentSaveReturn => 'परत घ्या';

  @override
  String get consignmentSaveSales => 'बीजक बनवा';

  @override
  String get consignmentErrorsMoreThanHeld =>
      'हे त्यांच्याकडील मालापेक्षा जास्त आहे.';

  @override
  String get consignmentErrorsNotACustomer => 'ग्राहक खाते निवडा.';

  @override
  String get consignmentErrorsDuplicateItem => 'तीच वस्तू दोनदा आहे.';

  @override
  String get consignmentErrorsUnknownItem => 'एक वस्तू आता अस्तित्वात नाही.';

  @override
  String get reportsParticulars => 'तपशील';

  @override
  String get reportsTradingIncome => 'विक्री आणि प्रत्यक्ष उत्पन्न';

  @override
  String get reportsTradingExpense => 'खरेदी आणि प्रत्यक्ष खर्च';

  @override
  String get reportsGrossProfit => 'एकूण नफा';

  @override
  String get reportsOtherIncome => 'अप्रत्यक्ष उत्पन्न';

  @override
  String get reportsOtherExpense => 'अप्रत्यक्ष खर्च';

  @override
  String get reportsNetProfit => 'निव्वळ नफा';

  @override
  String get reportsNetLoss => 'निव्वळ तोटा';

  @override
  String get reportsAssets => 'मालमत्ता';

  @override
  String get reportsLiabilities => 'देणी आणि भांडवल';

  @override
  String get reportsProfitAndLoss => 'नफा-तोटा खाते';

  @override
  String get reportsDifference => 'फरक';

  @override
  String get reportsOpeningDifference => 'आरंभीच्या शिलकेतील फरक';

  @override
  String get reportsOpening => 'आरंभीची शिल्लक';

  @override
  String get reportsClosing => 'अखेरची शिल्लक';

  @override
  String get reportsNoData => 'या कालावधीत दाखवण्यासारखे काही नाही.';

  @override
  String reportsLedgerTitle(String account) {
    return 'खतावणी: $account';
  }

  @override
  String get reportsStockNote =>
      'माल (टप्पा 3) आल्यानंतर अखेरचा स्टॉक जोडला जातो.';

  @override
  String get reportsOpeningStock => 'आरंभीचा स्टॉक';

  @override
  String get reportsClosingStock => 'अखेरचा स्टॉक';

  @override
  String get reportsBuilderTitle => 'अहवाल तयार करा';

  @override
  String get reportsBuilderSubtitle =>
      'विक्री, खरेदी, खर्च, खतावणी नोंदी किंवा वेळ हवे तसे गटबद्ध करा आणि बेरीज करा; जतन करा, किंवा ईमेलने मागवा.';

  @override
  String get reportsBuilderDataset => 'डेटा';

  @override
  String get reportsBuilderDatasetsSales => 'विक्री';

  @override
  String get reportsBuilderDatasetsPurchases => 'खरेदी';

  @override
  String get reportsBuilderDatasetsExpenses => 'खर्च';

  @override
  String get reportsBuilderDatasetsLedger => 'खतावणी नोंदी';

  @override
  String get reportsBuilderDatasetsTime => 'टाइमशीट';

  @override
  String get reportsBuilderGroupBy => 'गट (जास्तीत जास्त 3)';

  @override
  String get reportsBuilderMeasures => 'दाखवा';

  @override
  String get reportsBuilderDimsMonth => 'महिना';

  @override
  String get reportsBuilderDimsDay => 'दिवस';

  @override
  String get reportsBuilderDimsCustomer => 'ग्राहक';

  @override
  String get reportsBuilderDimsItem => 'वस्तू';

  @override
  String get reportsBuilderDimsHsn => 'एचएसएन';

  @override
  String get reportsBuilderDimsState => 'राज्य';

  @override
  String get reportsBuilderDimsSupplier => 'पुरवठादार';

  @override
  String get reportsBuilderDimsCategory => 'प्रकार';

  @override
  String get reportsBuilderDimsEmployee => 'कर्मचारी';

  @override
  String get reportsBuilderDimsProject => 'प्रकल्प';

  @override
  String get reportsBuilderDimsAccount => 'खाते';

  @override
  String get reportsBuilderDimsGroup => 'गट';

  @override
  String get reportsBuilderDimsType => 'व्हाउचर प्रकार';

  @override
  String get reportsBuilderMeasureNamesQty => 'प्रमाण';

  @override
  String get reportsBuilderMeasureNamesTaxable => 'करपात्र मूल्य';

  @override
  String get reportsBuilderMeasureNamesTax => 'जीएसटी';

  @override
  String get reportsBuilderMeasureNamesTotal => 'एकूण';

  @override
  String get reportsBuilderMeasureNamesDocuments => 'दस्तऐवज';

  @override
  String get reportsBuilderMeasureNamesAmount => 'रक्कम';

  @override
  String get reportsBuilderMeasureNamesItc => 'जीएसटी क्रेडिट';

  @override
  String get reportsBuilderMeasureNamesDebit => 'नावे';

  @override
  String get reportsBuilderMeasureNamesCredit => 'जमा';

  @override
  String get reportsBuilderMeasureNamesNet => 'निव्वळ';

  @override
  String get reportsBuilderMeasureNamesHours => 'तास';

  @override
  String get reportsBuilderMeasureNamesCost => 'खर्च';

  @override
  String get reportsBuilderMeasureNamesBillableValue => 'बिल करण्याजोगे मूल्य';

  @override
  String get reportsBuilderPeriod => 'कालावधी';

  @override
  String get reportsBuilderPresetsToday => 'आज';

  @override
  String get reportsBuilderPresetsYesterday => 'काल';

  @override
  String get reportsBuilderPresetsThisMonth => 'हा महिना';

  @override
  String get reportsBuilderPresetsLastMonth => 'मागील महिना';

  @override
  String get reportsBuilderPresetsThisQuarter => 'ही तिमाही';

  @override
  String get reportsBuilderPresetsLastQuarter => 'मागील तिमाही';

  @override
  String get reportsBuilderPresetsThisFy => 'हे आर्थिक वर्ष';

  @override
  String get reportsBuilderPresetsLastFy => 'मागील आर्थिक वर्ष';

  @override
  String get reportsBuilderPresetsCustom => 'तारखा निवडा';

  @override
  String get reportsBuilderRun => 'चालवा';

  @override
  String get reportsBuilderCsv => 'CSV डाउनलोड करा';

  @override
  String get reportsBuilderSave => 'अहवाल जतन करा';

  @override
  String get reportsBuilderName => 'अहवालाचे नाव';

  @override
  String get reportsBuilderSchedule => 'ईमेल करा';

  @override
  String get reportsBuilderFrequenciesNone => 'ईमेल करू नका';

  @override
  String get reportsBuilderFrequenciesDaily => 'दररोज (कालचे आकडे)';

  @override
  String get reportsBuilderFrequenciesWeekly =>
      'दर आठवड्याला (मागील सोमवार ते रविवार)';

  @override
  String get reportsBuilderFrequenciesMonthly => 'दर महिन्याला (मागील महिना)';

  @override
  String get reportsBuilderHour => 'वेळ';

  @override
  String get reportsBuilderWeekday => 'दिवस';

  @override
  String get reportsBuilderWeekdays0 => 'रविवार';

  @override
  String get reportsBuilderWeekdays1 => 'सोमवार';

  @override
  String get reportsBuilderWeekdays2 => 'मंगळवार';

  @override
  String get reportsBuilderWeekdays3 => 'बुधवार';

  @override
  String get reportsBuilderWeekdays4 => 'गुरुवार';

  @override
  String get reportsBuilderWeekdays5 => 'शुक्रवार';

  @override
  String get reportsBuilderWeekdays6 => 'शनिवार';

  @override
  String get reportsBuilderDay => 'तारीख (1–28)';

  @override
  String get reportsBuilderRecipients =>
      'यांना ईमेल करा (स्वल्पविरामाने वेगळे)';

  @override
  String get reportsBuilderSaved => 'जतन झाले.';

  @override
  String get reportsBuilderTotal => 'एकूण';

  @override
  String get reportsBuilderNoRows => 'या कालावधीत डेटा नाही.';

  @override
  String get reportsBuilderSavedTitle => 'जतन केलेले अहवाल';

  @override
  String reportsBuilderNextRun(String date) {
    return 'पुढील ईमेल: $date';
  }

  @override
  String reportsBuilderLastError(String error) {
    return 'मागील वेळी अयशस्वी: $error';
  }

  @override
  String get reportsBuilderDelete => 'हटवा';

  @override
  String get reportsBuilderNone => 'अजून जतन केलेले अहवाल नाहीत.';

  @override
  String get reportsErrorsUnknownDataset => 'कशावर अहवाल हवा ते निवडा.';

  @override
  String get reportsErrorsUnknownMeasure => 'दाखवण्यासाठी किमान एक आकडा निवडा.';

  @override
  String get reportsErrorsUnknownDimension => 'हा गट येथे उपलब्ध नाही.';

  @override
  String get reportsErrorsInvalidPeriod => 'तारखा तपासा.';

  @override
  String get reportsErrorsRecipientsRequired => 'किमान एक ईमेल पत्ता जोडा.';

  @override
  String get reportsErrorsInvalidHour => 'वेळ निवडा.';

  @override
  String get reportsErrorsInvalidWeekday => 'आठवड्याचा दिवस निवडा.';

  @override
  String get reportsErrorsInvalidDay => '1 ते 28 मधील तारीख निवडा.';

  @override
  String get reportsErrorsUnknownFilter => 'हा फिल्टर येथे उपलब्ध नाही.';

  @override
  String get ownerReportsColourSizeTitle => 'रंग आणि साइज अहवाल';

  @override
  String get ownerReportsColourSizeSubtitle =>
      'प्रत्येक डिझाइन रंग आणि साइजच्या ग्रिडमध्ये, स्टॉक किंवा विकलेल्या नगांसह.';

  @override
  String get ownerReportsAgeingTitle => 'स्टॉकचे वय आणि डेड स्टॉक';

  @override
  String get ownerReportsAgeingSubtitle =>
      'आजचा स्टॉक किती काळापासून आहे (आधी आलेला आधी विकतो), आणि काय विकणे थांबले.';

  @override
  String get ownerReportsRegisterTitle => 'विक्री रजिस्टर';

  @override
  String get ownerReportsRegisterSubtitle =>
      'कालावधीतील प्रत्येक बीजक, काउंटर बिल आणि परतावा, पैसे कसे दिले यासह.';

  @override
  String get ownerReportsDesign => 'डिझाइन';

  @override
  String get ownerReportsName => 'नाव';

  @override
  String get ownerReportsBrand => 'ब्रँड';

  @override
  String get ownerReportsColour => 'रंग';

  @override
  String get ownerReportsSize => 'साइज';

  @override
  String get ownerReportsSold => 'विकले';

  @override
  String get ownerReportsStock => 'स्टॉक';

  @override
  String get ownerReportsSales => 'विक्री';

  @override
  String get ownerReportsReportType => 'दाखवा';

  @override
  String get ownerReportsFrom => 'पासून';

  @override
  String get ownerReportsTo => 'पर्यंत';

  @override
  String get ownerReportsAsOf => 'या तारखेला';

  @override
  String get ownerReportsStore => 'गोदाम';

  @override
  String get ownerReportsAllStores => 'आमची सर्व गोदामे';

  @override
  String get ownerReportsAllBrands => 'सर्व ब्रँड';

  @override
  String get ownerReportsCategory => 'श्रेणी';

  @override
  String get ownerReportsAllCategories => 'सर्व श्रेणी';

  @override
  String get ownerReportsSearchDesign => 'डिझाइन क्र. किंवा नाव';

  @override
  String ownerReportsTotalSold(String n) {
    return 'विकलेले नग: $n';
  }

  @override
  String ownerReportsTotalStock(String n) {
    return 'स्टॉकमधील नग: $n';
  }

  @override
  String get ownerReportsExcel => 'Excel';

  @override
  String ownerReportsMrp(String v) {
    return 'एमआरपी $v';
  }

  @override
  String get ownerReportsTotal => 'एकूण';

  @override
  String get ownerReportsNoPhoto => 'फोटो नाही';

  @override
  String get ownerReportsNothing => 'या निवडींसाठी काही नाही.';

  @override
  String get ownerReportsItem => 'वस्तू';

  @override
  String get ownerReportsValue => 'मूल्य';

  @override
  String get ownerReportsDeadAfter => 'डेड केव्हा';

  @override
  String ownerReportsDeadAfterDays(String n) {
    return 'डेड: $n दिवस विक्री नाही';
  }

  @override
  String get ownerReportsOnlyDead => 'फक्त डेड स्टॉक';

  @override
  String ownerReportsByAge(String v, String n) {
    return 'वयानुसार स्टॉक: $v, $n नग';
  }

  @override
  String ownerReportsDeadTitle(String n) {
    return 'डेड स्टॉक ($n दिवस विक्री नाही)';
  }

  @override
  String ownerReportsDeadDetail(String items, String qty) {
    return 'वस्तू: $items, नग: $qty';
  }

  @override
  String get ownerReportsDeadHint =>
      'सूट, पुरवठादाराला परत किंवा दुसऱ्या गोदामात पाठवण्यासाठी योग्य.';

  @override
  String get ownerReportsDead => 'डेड';

  @override
  String get ownerReportsLastSold => 'शेवटची विक्री';

  @override
  String get ownerReportsIdleDays => 'विक्रीशिवाय दिवस';

  @override
  String ownerReportsIdle(String date, String n) {
    return '$date ($n दिवसांपूर्वी)';
  }

  @override
  String get ownerReportsNeverSold => 'कधीच विकले नाही';

  @override
  String get ownerReportsDate => 'तारीख';

  @override
  String get ownerReportsNumber => 'क्र.';

  @override
  String get ownerReportsKind => 'दस्तऐवज';

  @override
  String get ownerReportsParty => 'ग्राहक';

  @override
  String get ownerReportsColsPieces => 'नग';

  @override
  String get ownerReportsColsGross => 'एकूण रक्कम';

  @override
  String get ownerReportsColsDiscount => 'सूट';

  @override
  String get ownerReportsColsTaxable => 'करपात्र';

  @override
  String get ownerReportsColsTax => 'GST';

  @override
  String get ownerReportsColsTotal => 'बिल रक्कम';

  @override
  String get ownerReportsColsCash => 'रोख';

  @override
  String get ownerReportsColsUpi => 'UPI';

  @override
  String get ownerReportsColsCard => 'कार्ड';

  @override
  String get ownerReportsColsCredit => 'उधारी';

  @override
  String get ownerReportsKindsInvoice => 'बीजक';

  @override
  String get ownerReportsKindsBill => 'काउंटर बिल';

  @override
  String get ownerReportsKindsCreditNote => 'क्रेडिट नोट';

  @override
  String get ownerReportsKindsCounterReturn => 'काउंटर परतावा';

  @override
  String get ownerReportsSearchRegister => 'क्रमांक किंवा ग्राहक';

  @override
  String get ownerReportsAllKinds => 'सर्व दस्तऐवज';

  @override
  String ownerReportsDocuments(String n) {
    return 'दस्तऐवज: $n';
  }

  @override
  String get ownerReportsRegisterHint =>
      'परतावे वजा ओळींमध्ये आहेत. छटा असलेल्या ओळींवर सूट होती; खोडलेल्या ओळी रद्द आहेत आणि एकूणात नाहीत.';

  @override
  String get ownerReportsCompareLastYear => 'मागील वर्षाशी तुलना';

  @override
  String get ownerReportsThisPeriod => 'हा कालावधी';

  @override
  String get ownerReportsSameLastYear => 'मागील वर्षी हाच कालावधी';

  @override
  String get ownerReportsChange => 'बदल';

  @override
  String get ownerReportsErrorsInvalidPeriod =>
      'सुरुवातीची तारीख शेवटच्या नंतर आहे.';

  @override
  String get ownerReportsWithMaterials => 'कापड आणि ट्रिम्ससह';

  @override
  String get ownerReportsAvgBill => 'सरासरी बिल';

  @override
  String get fyTitle => 'आर्थिक वर्षे';

  @override
  String get fySubtitle =>
      'हिशेब अंतिम झाल्यावर कालावधी बंद करा: उदा. जीएसटी रिटर्न भरल्यानंतर. बंद तारखेपर्यंत कोणीही नोंदी करू किंवा रद्द करू शकत नाही.';

  @override
  String get fyYear => 'वर्ष';

  @override
  String get fyPeriod => 'कालावधी';

  @override
  String get fyLockedUpTo => 'पर्यंत बंद';

  @override
  String get fyOpen => 'खुले';

  @override
  String get fyLock => 'बंद करा';

  @override
  String get fyUnlock => 'बंदी काढा';

  @override
  String get fyErrorsLockOutsideYear => 'बंद तारीख याच आर्थिक वर्षात असावी.';

  @override
  String get appConnectTitle => 'हे डिव्हाइस जोडा';

  @override
  String get appConnectSubtitle =>
      'तुमच्या Varchasv खात्याने एकदा साइन इन करा. त्यानंतर ॲप इंटरनेटशिवाय चालते आणि ऑनलाइन असताना सिंक होते.';

  @override
  String get appServer => 'सर्व्हरचा पत्ता';

  @override
  String get appConnect => 'जोडा';

  @override
  String get appConnecting => 'जोडत आहे…';

  @override
  String get appNoBusiness =>
      'हे खाते अजून कोणत्याही व्यवसायाचा भाग नाही. आधी वेबसाइटवर व्यवसाय तयार करा.';

  @override
  String get appCantReach =>
      'सर्व्हरपर्यंत पोहोचता येत नाही. पत्ता आणि इंटरनेट कनेक्शन तपासा.';

  @override
  String get appSyncTitle => 'सिंक';

  @override
  String get appSyncNow => 'आता सिंक करा';

  @override
  String appLastSync(String time) {
    return 'शेवटचे सिंक $time';
  }

  @override
  String get appNeverSynced => 'अजून सिंक झाले नाही';

  @override
  String appPending(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count बदल अपलोडच्या प्रतीक्षेत',
      one: '$count बदल अपलोडच्या प्रतीक्षेत',
      zero: 'सर्व काही अपलोड झाले आहे',
    );
    return '$_temp0';
  }

  @override
  String appRefused(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count बदल सर्व्हरने नाकारले',
      one: '$count बदल सर्व्हरने नाकारला',
    );
    return '$_temp0';
  }

  @override
  String get appRetry => 'नाकारलेले बदल पुन्हा पाठवा';

  @override
  String get appOffline =>
      'ऑफलाइन: तुमचे काम या डिव्हाइसवर जतन आहे आणि नंतर अपलोड होईल.';

  @override
  String get appSyncing => 'सिंक होत आहे…';

  @override
  String get appDevice => 'हे डिव्हाइस';

  @override
  String appDeviceCode(String code) {
    return 'डिव्हाइस कोड $code';
  }

  @override
  String get appBusiness => 'व्यवसाय';

  @override
  String get appSignOut => 'या डिव्हाइसवरून साइन आउट करा';

  @override
  String appSignOutWarning(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count बदल अजून अपलोड झालेले नाहीत आणि ते हरवतील.',
      one: '$count बदल अजून अपलोड झालेला नाही आणि तो हरवेल.',
      zero: 'यामुळे तुमच्या हिशेबाची स्थानिक प्रत या डिव्हाइसवरून काढली जाईल.',
    );
    return '$_temp0';
  }

  @override
  String get appBadgePending => 'अपलोडच्या प्रतीक्षेत';

  @override
  String get appBadgeFailed => 'नाकारले';

  @override
  String get appBadgeSynced => 'अपलोड झाले';

  @override
  String get appNoVouchers => 'अजून व्हाउचर नाहीत. जोडण्यासाठी + दाबा.';

  @override
  String get appAddAccount => 'खाते जोडा';

  @override
  String get appNoPermission => 'तुम्हाला हे करण्याची परवानगी नाही.';

  @override
  String get appToday => 'आज';

  @override
  String get appPreviousDay => 'मागील दिवस';

  @override
  String get appNextDay => 'पुढील दिवस';

  @override
  String get appNotSyncedYet => 'सिंकच्या प्रतीक्षेत';

  @override
  String get appFieldTitle => 'फील्ड काम';

  @override
  String get appFieldNewOrder => 'नवीन ऑर्डर';

  @override
  String get appFieldNewClaim => 'नवीन खर्च दावा';

  @override
  String get appFieldOrders => 'या डिव्हाइसवरील ऑर्डर';

  @override
  String get appFieldClaims => 'या डिव्हाइसवरील दावे';

  @override
  String appFieldSentAs(String number) {
    return '$number म्हणून अपलोड झाले';
  }

  @override
  String appFieldApprox(String amount) {
    return 'जीएसटीसह सुमारे ₹$amount; अंतिम रक्कम अपलोड करताना ठरते';
  }

  @override
  String get appFieldAddItem => 'वस्तू जोडा';

  @override
  String get appFieldQty => 'प्रमाण';

  @override
  String get appFieldRate => 'दर';

  @override
  String get appFieldSave => 'जतन करा';

  @override
  String get appFieldSaved =>
      'या डिव्हाइसवर जतन झाले; ऑनलाइन असताना अपलोड होईल.';

  @override
  String get appFieldNone => 'अजून काही नाही.';

  @override
  String get appOverviewTitle => 'आढावा';

  @override
  String appOverviewAsOf(String time) {
    return '$time चे आकडे';
  }

  @override
  String appOverviewOffline(String time) {
    return '$time चे आकडे दाखवत आहे. ताजे करण्यासाठी इंटरनेटशी जोडा.';
  }

  @override
  String get appOverviewNever => 'आजचे आकडे पाहण्यासाठी इंटरनेटशी जोडा.';

  @override
  String get appOverviewRefresh => 'ताजे करा';

  @override
  String get appApprovalsTitle => 'मंजुरी';

  @override
  String get appApprovalsNone => 'तुमच्या प्रतीक्षेत काहीही नाही.';

  @override
  String appApprovalsHours(String project, String hours) {
    return '$project · $hours तास';
  }

  @override
  String get appApprovalsNeedOnline => 'मंजुरीसाठी इंटरनेट हवे.';

  @override
  String get itemsTitle => 'वस्तू';

  @override
  String get itemsSubtitle =>
      'तुम्ही ठेवता तो माल आणि तुम्ही खरेदी किंवा विक्री करता त्या सेवा, एचएसएन/एसएसी आणि जीएसटी दरासह.';

  @override
  String get itemsNew => 'नवीन वस्तू';

  @override
  String get itemsName => 'वस्तूचे नाव';

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
  String get itemsUom => 'एकक';

  @override
  String get itemsPurchaseRate => 'खरेदी दर';

  @override
  String get itemsSaleRate => 'विक्री दर';

  @override
  String get itemsMrp => 'एमआरपी';

  @override
  String get itemsReorderLevel => 'पुन्हा मागणी पातळी';

  @override
  String get itemsReorderQty => 'पुन्हा मागणी प्रमाण';

  @override
  String get itemsTrackBatches => 'बॅच क्रमांक आणि मुदत नोंदवा';

  @override
  String get itemsInStock => 'स्टॉकमध्ये';

  @override
  String get itemsEmpty => 'अजून वस्तू नाहीत.';

  @override
  String get itemsErrorsInvalidHsn => 'एचएसएन कोड 4, 6 किंवा 8 अंकी असतो.';

  @override
  String get itemsErrorsInvalidSac =>
      'एसएसी कोड 99 ने सुरू होणारा 6 अंकी असतो.';

  @override
  String get itemsErrorsItemNameTaken => 'या नावाची वस्तू आधीच आहे.';

  @override
  String get itemsErrorsSkuTaken => 'हा कोड दुसरी वस्तू वापरते.';

  @override
  String get itemsErrorsUnknownUom => 'एकक निवडा.';

  @override
  String get itemsErrorsSameAsBaseUnit => 'हे आधीच वस्तूचे स्वतःचे एकक आहे.';

  @override
  String get itemsErrorsDuplicateUnit => 'प्रत्येक एकक एकदाच जोडता येते.';

  @override
  String get itemsErrorsInvalidFactor =>
      'यात मूळ एककाचे किती आहेत ते 0 पेक्षा जास्त लिहा.';

  @override
  String get itemsLeadTimeDays => 'पुरवठा कालावधी (दिवस)';

  @override
  String get itemsGstSlab => 'जीएसटी दर';

  @override
  String get itemsSlabNone => 'ठरलेला दर';

  @override
  String get itemsSlabApparel =>
      'सवलतीनंतर प्रति नग ₹2,500 पर्यंत 5%, त्यावर 18% (22 सप्टेंबर 2025 पासून)';

  @override
  String get itemsSlabFootwear =>
      'सवलतीनंतर प्रति जोडी ₹2,500 पर्यंत 5%, त्यावर 18% (22 सप्टेंबर 2025 पासून)';

  @override
  String get itemsSlabPieces => 'एका एककात नग';

  @override
  String get itemsSlabPiecesHint =>
      'एक एकक म्हणून विकल्या जाणाऱ्या सेटची किंमत जीएसटी तपासणीसाठी इतक्या नगांत विभागली जाते. सेटला एक नग मानण्यासाठी 1 लिहा.';

  @override
  String get itemsByPrice => 'किंमतीनुसार';

  @override
  String get itemsOtherUnits => 'इतर एकके';

  @override
  String get itemsUnitFactor => 'मूळ एककात किती';

  @override
  String get itemsOfBaseUnit => 'मूळ एकक';

  @override
  String get itemsAddUnit => 'एकक जोडा';

  @override
  String get stylesTitle => 'स्टाइल';

  @override
  String get stylesSubtitle =>
      'रंग आणि साइजमध्ये विकले जाणारे डिझाइन. प्रत्येक रंग आणि साइज स्वतंत्र आयटम आहे, ज्याचा स्वतःचा बारकोड आणि स्टॉक आहे.';

  @override
  String get stylesSizesAndColors => 'साइज आणि रंग';

  @override
  String get stylesSizesAndColorsSubtitle =>
      'स्टाइल जोडताना निवडायचे साइज स्केल आणि रंग.';

  @override
  String get stylesNew => 'नवीन स्टाइल';

  @override
  String get stylesCreate => 'स्टाइल तयार करा';

  @override
  String get stylesCode => 'डिझाइन क्र.';

  @override
  String get stylesCodeHint =>
      'प्रत्येक SKU मध्ये वापरला जातो, उदा. KT-101-NVY-M.';

  @override
  String get stylesName => 'नाव';

  @override
  String get stylesBrand => 'ब्रँड';

  @override
  String get stylesCategory => 'वर्ग';

  @override
  String get stylesSeason => 'सीझन';

  @override
  String get stylesSeasonExample => 'सण 2026';

  @override
  String get stylesCollection => 'कलेक्शन';

  @override
  String get stylesSizeScale => 'साइज स्केल';

  @override
  String get stylesSizes => 'साइज';

  @override
  String get stylesSizesExample => 'S, M, L, XL';

  @override
  String get stylesColors => 'रंग';

  @override
  String get stylesColor => 'रंग';

  @override
  String get stylesFits => 'फिट';

  @override
  String get stylesFitsHint =>
      'रंग आणि साइजशिवाय तिसरा पर्याय, स्वल्पविरामाने वेगळा.';

  @override
  String get stylesFitsExample => 'स्लिम, रेग्युलर';

  @override
  String get stylesVariants => 'प्रकार';

  @override
  String get stylesSaleRate => 'विक्री दर';

  @override
  String stylesWillCreate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'यातून $count आयटम तयार होतील, प्रत्येक रंग आणि साइजसाठी एक.',
      one: 'यातून $count आयटम तयार होईल.',
      zero: 'साइज आणि रंग निवडा.',
    );
    return '$_temp0';
  }

  @override
  String get stylesEmpty =>
      'अजून स्टाइल नाहीत. एक जोडा आणि त्याचे सर्व रंग-साइज एकदम तयार होतील.';

  @override
  String get stylesNoMatch => 'शोधाशी जुळणारी स्टाइल नाही.';

  @override
  String get stylesSearchStyles => 'डिझाइन क्र., नाव किंवा ब्रँडने शोधा';

  @override
  String get stylesNoStyles => 'स्टाइल सापडली नाही.';

  @override
  String get stylesChooseStyle => 'स्टाइल निवडा';

  @override
  String get stylesOtherStyle => 'दुसरी स्टाइल';

  @override
  String get stylesAddBySize => 'साइजनुसार जोडा';

  @override
  String stylesAddPieces(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count नग जोडा',
      one: '$count नग जोडा',
    );
    return '$_temp0';
  }

  @override
  String get stylesStockUnder =>
      'प्रत्येक चौकटीखालील छोटा आकडा हातातील स्टॉक आहे.';

  @override
  String get stylesStockGrid => 'रंग आणि साइजनुसार स्टॉक';

  @override
  String get stylesAllWarehouses => 'सर्व गोदामे';

  @override
  String get stylesDetails => 'स्टाइलचे तपशील';

  @override
  String get stylesApplyPrices => 'हे दर प्रत्येक साइजला लागू करा';

  @override
  String get stylesAddVariants => 'रंग किंवा साइज जोडा';

  @override
  String get stylesAddVariantsHint =>
      'नवीन रंग, साइज किंवा दोन्ही निवडा. स्टाइलमध्ये आधीपासून असलेले प्रकार तसेच राहतील.';

  @override
  String get stylesSets => 'सेट';

  @override
  String get stylesNoSets => 'अजून सेट नाहीत.';

  @override
  String get stylesNewSet => 'नवीन सेट';

  @override
  String get stylesNewSetHint =>
      'एका रंगाचा साइज प्रमाणातील सेट, एक एकक म्हणून विकला जातो. स्टॉक त्याच्या नगांप्रमाणे हलतो.';

  @override
  String get stylesRatio => 'साइजचे नग';

  @override
  String get stylesSetAsOnePiece => 'जीएसटीसाठी संपूर्ण सेट एक नग माना';

  @override
  String stylesCreateSet(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count नगांचा सेट तयार करा',
      one: '$count नगांचा सेट तयार करा',
    );
    return '$_temp0';
  }

  @override
  String get stylesSizeScales => 'साइज स्केल';

  @override
  String get stylesScaleName => 'स्केलचे नाव';

  @override
  String get stylesColorName => 'रंगाचे नाव';

  @override
  String get stylesColorCode => 'कोड';

  @override
  String get stylesSwatch => 'रंग नमुना';

  @override
  String get stylesArchive => 'संग्रहित करा';

  @override
  String get stylesRestore => 'परत आणा';

  @override
  String get stylesErrorsStyleCodeTaken =>
      'हा डिझाइन क्र. दुसऱ्या स्टाइलमध्ये आधीच आहे.';

  @override
  String get stylesErrorsColorsAndSizesRequired =>
      'किमान एक रंग आणि एक साइज निवडा.';

  @override
  String get stylesErrorsUnknownColor => 'हा रंग तुमच्या यादीत नाही.';

  @override
  String get stylesErrorsVariantMissing =>
      'या स्टाइलमध्ये त्या रंगाचा तो साइज नाही. आधी तो जोडा.';

  @override
  String get stylesErrorsRatioRequired => 'सेटमध्ये किमान एका साइजचे नग लिहा.';

  @override
  String get stylesErrorsPackExists => 'हा सेट आधीच आहे.';

  @override
  String get stylesErrorsScaleNameTaken => 'या नावाचा साइज स्केल आधीच आहे.';

  @override
  String get stylesErrorsColorTaken => 'या नावाचा किंवा कोडचा रंग आधीच आहे.';

  @override
  String get stylesErrorsSizesRequired => 'किमान एक साइज लिहा.';

  @override
  String get stylesErrorsColorCodeRequired => 'रंगाचा कोड लिहा.';

  @override
  String get stylesSummaryTaxonomy => 'डिझाइन';

  @override
  String get stylesSummaryCode => 'डिझाइन क्र.';

  @override
  String get stylesSummaryName => 'नाव';

  @override
  String get stylesSummaryBrand => 'ब्रँड';

  @override
  String get stylesSummaryCategory => 'श्रेणी';

  @override
  String get stylesSummarySeason => 'हंगाम';

  @override
  String get stylesSummaryCollection => 'कलेक्शन';

  @override
  String get stylesSummarySizes => 'साइज';

  @override
  String get stylesSummaryColours => 'रंग';

  @override
  String get stylesSummaryPricing => 'किंमत आणि खर्च';

  @override
  String stylesSummaryMarkup(String pct) {
    return 'मार्क-अप $pct%';
  }

  @override
  String get stylesSummaryCost => 'खरेदी दर';

  @override
  String get stylesSummarySaleRate => 'विक्री दर';

  @override
  String stylesSummaryRange(String from, String to) {
    return '$from ते $to';
  }

  @override
  String get stylesSummaryPieces => 'स्टॉकमधील नग';

  @override
  String get stylesSummarySkus => 'रंग आणि साइजच्या वस्तू';

  @override
  String get stylesSummaryValueAtCost => 'खर्चाने स्टॉक';

  @override
  String get stylesSummaryMedia => 'फोटो';

  @override
  String stylesSummaryPhotos(String n) {
    return '$n जतन';
  }

  @override
  String get stylesSummaryNoPhotos => 'अजून फोटो नाहीत.';

  @override
  String get stylesSummaryManagePhotos => 'फोटो जोडा किंवा बदला';

  @override
  String get stylesAttributes => 'स्टाइलचे वर्णन (तुमच्या याद्यांमधून)';

  @override
  String get catalogueTitle => 'इमेज कॅटलॉग';

  @override
  String get catalogueSubtitle =>
      'प्रत्येक डिझाइन आणि रंग फोटो, दर, स्टॉक आणि विक्रीसह. पार्टीसाठी डिझाइन निवडा, मग प्रिंट, एक्सपोर्ट किंवा शेअर करा.';

  @override
  String get catalogueAllColours => 'सर्व रंग';

  @override
  String get cataloguePhotos => 'फोटो';

  @override
  String get catalogueView => 'दृश्य';

  @override
  String get catalogueViewsFront => 'पुढून';

  @override
  String get catalogueViewsBack => 'मागून';

  @override
  String get catalogueViewsDetail => 'तपशील';

  @override
  String get catalogueViewsModel => 'मॉडेलवर';

  @override
  String get catalogueViewsOther => 'इतर';

  @override
  String get catalogueUploading => 'अपलोड होत आहे…';

  @override
  String get catalogueAddPhotos => 'फोटो जोडा';

  @override
  String get cataloguePhotoHint =>
      'अपलोडपूर्वी फोटो याच डिव्हाइसवर लहान केले जातात. फोनवर कॅमेऱ्याने काढता येतात.';

  @override
  String get catalogueShownFirst => 'आधी दिसते';

  @override
  String get catalogueShowFirst => 'आधी दाखवा';

  @override
  String get catalogueNoPhotos => 'अद्याप फोटो नाहीत.';

  @override
  String catalogueRecords(String n) {
    return 'दिसणारे डिझाइन: $n';
  }

  @override
  String get catalogueTileSize => 'टाइल आकार';

  @override
  String get catalogueSort => 'क्रम';

  @override
  String get catalogueSortsCode => 'डिझाइन क्र.नुसार';

  @override
  String get catalogueSortsNewest => 'नवीन आधी';

  @override
  String get catalogueSortsBest => 'सर्वाधिक विक्री';

  @override
  String get catalogueSortsPriceLow => 'किंमत: कमी ते जास्त';

  @override
  String get catalogueSortsPriceHigh => 'किंमत: जास्त ते कमी';

  @override
  String get catalogueSortsStock => 'सर्वाधिक स्टॉक';

  @override
  String catalogueCart(String n) {
    return 'कार्ट ($n)';
  }

  @override
  String get catalogueNoPhoto => 'फोटो नाही';

  @override
  String catalogueStock(String n) {
    return 'स्टॉक: $n';
  }

  @override
  String catalogueSold(String n) {
    return '90 दिवसांत विकले: $n';
  }

  @override
  String get catalogueAdded => 'कार्टमध्ये';

  @override
  String get catalogueAdd => 'जोडा';

  @override
  String get catalogueNone => 'या फिल्टरशी कोणतेही डिझाइन जुळत नाही.';

  @override
  String get cataloguePrevious => 'मागील';

  @override
  String get catalogueNext => 'पुढील';

  @override
  String catalogueShowing(String from, String to, String total) {
    return '$total पैकी $from ते $to';
  }

  @override
  String get catalogueSelections => 'जतन केलेल्या निवडी';

  @override
  String catalogueDesigns(String n) {
    return 'डिझाइन: $n';
  }

  @override
  String get catalogueSharedBadge => 'लिंक चालू';

  @override
  String get catalogueNoSelections =>
      'अद्याप निवडी नाहीत. डिझाइन कार्टमध्ये टाकून जतन करा.';

  @override
  String get catalogueSearch => 'बारकोड, डिझाइन किंवा नाव';

  @override
  String get cataloguePriceFor => 'किंमत कोणासाठी';

  @override
  String get catalogueSaleRate => 'विक्री दर';

  @override
  String get catalogueInStockOnly => 'फक्त स्टॉकमधील';

  @override
  String get catalogueWithPhotoOnly => 'फक्त फोटो असलेले';

  @override
  String get catalogueRate => 'दर';

  @override
  String get catalogueRateFrom => 'दर पासून';

  @override
  String get catalogueRateTo => 'दर पर्यंत';

  @override
  String get catalogueReceived => 'यादरम्यान आले';

  @override
  String get catalogueReceivedFrom => 'पासून आले';

  @override
  String get catalogueReceivedTo => 'पर्यंत आले';

  @override
  String get catalogueApply => 'लागू करा';

  @override
  String get catalogueBrand => 'ब्रँड';

  @override
  String get catalogueCategory => 'श्रेणी';

  @override
  String get catalogueSeason => 'हंगाम';

  @override
  String get catalogueClear => 'फिल्टर काढा';

  @override
  String catalogueDefaultName(String party) {
    return '$party साठी';
  }

  @override
  String get catalogueUntitled => 'नवीन निवड';

  @override
  String get catalogueCartTitle => 'कार्ट';

  @override
  String get catalogueCartEmpty => 'कार्ट रिकामे आहे. डिझाइनवर जोडा दाबा.';

  @override
  String get catalogueSelectionName => 'निवडीचे नाव';

  @override
  String get catalogueForParty => 'पार्टीसाठी';

  @override
  String get catalogueAnyone => 'कोणीही';

  @override
  String get catalogueSaveSelection => 'निवड जतन करा';

  @override
  String get catalogueEmptyCart => 'कार्ट रिकामे करा';

  @override
  String get catalogueColsCode => 'डिझाइन क्र.';

  @override
  String get catalogueColsName => 'नाव';

  @override
  String get catalogueColsSize => 'साइज';

  @override
  String get catalogueColsRate => 'दर';

  @override
  String get catalogueColsMrp => 'एमआरपी';

  @override
  String get catalogueColsStock => 'स्टॉक';

  @override
  String get cataloguePrintPdf => 'प्रिंट किंवा PDF';

  @override
  String get catalogueExportExcel => 'Excel मध्ये काढा';

  @override
  String get catalogueShowPrices => 'किंमत दाखवा';

  @override
  String get catalogueShowStock => 'स्टॉकमधील साइज दाखवा';

  @override
  String get catalogueDeleteConfirm =>
      'ही निवड हटवायची? शेअर केलेली लिंक बंद होईल.';

  @override
  String get catalogueDelete => 'निवड हटवा';

  @override
  String get catalogueShareTitle => 'शेअर करा';

  @override
  String catalogueSharedUntil(String date) {
    return 'एक लिंक $date पर्यंत चालू आहे. नवीन बनवल्यास जुनी बंद होईल.';
  }

  @override
  String get catalogueShareHint =>
      'लॉगिनशिवाय हा कॅटलॉग उघडणारी लिंक बनवा, मग कॉपी करा किंवा WhatsApp वर पाठवा.';

  @override
  String get catalogueLinkWorksFor => 'लिंक चालेल';

  @override
  String catalogueDays(String n) {
    return '$n दिवस';
  }

  @override
  String get catalogueNewLink => 'नवीन लिंक बनवा';

  @override
  String get catalogueMakeLink => 'लिंक बनवा';

  @override
  String get catalogueStopSharing => 'शेअर बंद करा';

  @override
  String get catalogueLink => 'लिंक';

  @override
  String get catalogueCopied => 'लिंक कॉपी झाली.';

  @override
  String get catalogueCopy => 'कॉपी';

  @override
  String get catalogueWhatsappTo => 'WhatsApp क्रमांक';

  @override
  String catalogueSentDemo(String to) {
    return '$to ला पाठवले म्हणून नोंदवले (डेमो: अद्याप WhatsApp प्रदाता सेट नाही).';
  }

  @override
  String catalogueSent(String to) {
    return '$to ला WhatsApp वर पाठवले.';
  }

  @override
  String get catalogueSendWhatsapp => 'WhatsApp वर पाठवा';

  @override
  String catalogueOrderHint(String party) {
    return '$party साठी विक्री ऑर्डर बनवण्यासाठी साइजनुसार नग भरा.';
  }

  @override
  String catalogueMrp(String v) {
    return 'एमआरपी $v';
  }

  @override
  String catalogueOrderTotal(String pieces, String value) {
    return 'नग: $pieces, करापूर्वी $value';
  }

  @override
  String catalogueOrderNarration(String name) {
    return 'कॅटलॉग निवड $name मधून';
  }

  @override
  String get catalogueMakeOrder => 'विक्री ऑर्डर बनवा';

  @override
  String catalogueForPartyLine(String party) {
    return '$party साठी';
  }

  @override
  String get catalogueSelectionSubtitle => 'एक कॅटलॉग निवड';

  @override
  String get catalogueLinkExpiredTitle => 'हा कॅटलॉग आता शेअर नाही';

  @override
  String get catalogueLinkExpired =>
      'लिंकची मुदत संपली किंवा ती बदलली. पाठवणाऱ्याकडे नवीन लिंक मागा.';

  @override
  String get catalogueErrorsUnknownStyle => 'ते डिझाइन आता अस्तित्वात नाही.';

  @override
  String get catalogueErrorsUnknownColor => 'या डिझाइनमध्ये हा रंग नाही.';

  @override
  String get catalogueErrorsUnknownFile =>
      'फोटो अपलोड झाला नाही. पुन्हा प्रयत्न करा.';

  @override
  String get catalogueErrorsFileType => 'JPEG, PNG किंवा WebP फोटो वापरा.';

  @override
  String get catalogueErrorsFileTooLarge => 'फोटो खूप मोठा आहे.';

  @override
  String get catalogueErrorsFileEmpty => 'फोटो रिकामा आहे.';

  @override
  String get catalogueErrorsDuplicateImage =>
      'हा फोटो या डिझाइन आणि रंगावर आधीच आहे.';

  @override
  String get catalogueErrorsNoLines => 'किमान एक डिझाइन जोडा.';

  @override
  String get catalogueErrorsDuplicateLine =>
      'एक डिझाइन आणि रंग यादीत दोनदा आहे.';

  @override
  String get catalogueErrorsUnknownAccount => 'यादीतून पार्टी निवडा.';

  @override
  String get catalogueErrorsInvalidDays => 'लिंक 1 ते 90 दिवस चालू शकते.';

  @override
  String get catalogueErrorsShareLinkStale =>
      'ती लिंक आता चालू नाही. आधी नवीन लिंक बनवा.';

  @override
  String get catalogueErrorsInvalidPhone =>
      '10 अंकी भारतीय मोबाइल क्रमांक भरा.';

  @override
  String get catalogueErrorsSendFailed =>
      'WhatsApp ने संदेश स्वीकारला नाही. नंतर प्रयत्न करा.';

  @override
  String get labelsTitle => 'बारकोड आणि किंमत लेबल';

  @override
  String get labelsSubtitle =>
      'लेबल रोल, A4 शीट किंवा हँग टॅगवर बारकोड, MRP आणि साइजचे टॅग छापा.';

  @override
  String get labelsSearch => 'बारकोड स्कॅन करा किंवा नाव लिहा';

  @override
  String get labelsWholeDesign => 'संपूर्ण डिझाइन';

  @override
  String get labelsAddOneEach => 'प्रत्येक साइजचा एक';

  @override
  String get labelsAddStock => 'स्टॉकमधील प्रत्येक नगाचा एक';

  @override
  String get labelsItem => 'वस्तू';

  @override
  String get labelsBarcode => 'बारकोड';

  @override
  String get labelsMrp => 'एमआरपी';

  @override
  String get labelsPrice => 'किंमत';

  @override
  String get labelsLabels => 'लेबल';

  @override
  String get labelsNoBarcode => 'नाही';

  @override
  String get labelsRemove => 'काढा';

  @override
  String get labelsEmpty =>
      'लेबल जोडण्यासाठी वस्तू स्कॅन करा किंवा शोधा, किंवा डिझाइन निवडा.';

  @override
  String get labelsStock => 'लेबल प्रकार';

  @override
  String get labelsTemplatesRoll50x25 => 'रोल, 50 x 25 mm, एक रांग';

  @override
  String get labelsTemplatesRoll38x25x2 => 'रोल, 38 x 25 mm, दोन रांगा';

  @override
  String get labelsTemplatesA4x65 => 'A4 शीट, 65 लेबल (38.1 x 21.2 mm)';

  @override
  String get labelsTemplatesTag50x75 => 'हँग टॅग, 50 x 75 mm';

  @override
  String get labelsFieldsBusiness => 'व्यवसायाचे नाव';

  @override
  String get labelsFieldsName => 'वस्तूचे नाव';

  @override
  String get labelsFieldsDesign => 'डिझाइन क्र.';

  @override
  String get labelsFieldsColourSize => 'रंग आणि साइज';

  @override
  String get labelsFieldsMrp => 'एमआरपी';

  @override
  String get labelsFieldsPrice => 'विक्री किंमत';

  @override
  String get labelsFieldsExtra => 'अतिरिक्त ओळ';

  @override
  String get labelsExtraText => 'अतिरिक्त ओळीचा मजकूर';

  @override
  String get labelsExtraHint => 'उदा. उत्पादनाचा महिना किंवा उत्पादकाचा पत्ता.';

  @override
  String get labelsPreview => 'मूळ आकारात पूर्वावलोकन';

  @override
  String get labelsPreviewEmpty => 'लेबल पाहण्यासाठी वस्तू जोडा.';

  @override
  String labelsPrint(String n) {
    return '$n लेबल छापा';
  }

  @override
  String get labelsPrintHint =>
      'प्रिंट विंडो लेबलच्या आकारात उघडते; लेबल प्रिंटर निवडा आणि मार्जिन शून्य ठेवा.';

  @override
  String get labelsNothingToPrint =>
      'छापण्यासाठी काही नाही. इन्व्हेंटरीत लेबल निवडा, मग प्रिंट दाबा.';

  @override
  String get labelsForBill => 'या मालाचे लेबल छापा';

  @override
  String get labelsPrintLabels => 'लेबल छापा';

  @override
  String get shareSendWhatsApp => 'व्हॉट्सॲपवर पाठवा';

  @override
  String get shareSend => 'पाठवा';

  @override
  String get shareMobile => 'मोबाइल नंबर';

  @override
  String shareSentTo(String to) {
    return '$to वर व्हॉट्सॲप पाठवले';
  }

  @override
  String get shareAgain => 'पुन्हा पाठवा';

  @override
  String get shareFailed => 'पाठवले नाही. नंबर तपासून पुन्हा प्रयत्न करा.';

  @override
  String get shareAutoFailed =>
      'बिल आपोआप व्हॉट्सॲपवर जाऊ शकले नाही. पुन्हा पाठवा.';

  @override
  String get shareRemind => 'आठवण करा';

  @override
  String get shareRemindAll => 'सर्व थकबाकीदारांना आठवण करा';

  @override
  String get shareRemindAllConfirm =>
      'थकीत बिल असलेल्या प्रत्येक ग्राहकाला व्हॉट्सॲपवर पेमेंटची आठवण पाठवायची?';

  @override
  String get shareReminded => 'आठवण पाठवली';

  @override
  String shareRemindedAll(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n आठवणी पाठवल्या',
      zero: 'एकही आठवण पाठवली नाही',
    );
    return '$_temp0';
  }

  @override
  String shareNoPhone(String names) {
    return 'मोबाइल नंबर नाही, फोन करा: $names';
  }

  @override
  String get shareLogTitle => 'व्हॉट्सॲप लॉग';

  @override
  String get shareLogSubtitle =>
      'ग्राहकांना पाठवलेली सर्व बिले, इनव्हॉइस, आठवणी आणि संदेश, नवे आधी.';

  @override
  String get shareFilterAll => 'सर्व';

  @override
  String get shareFilterSent => 'पाठवले';

  @override
  String get shareFilterFailed => 'गेले नाहीत';

  @override
  String get shareThisMonth => 'मोजणी या महिन्याची आहे';

  @override
  String get shareWhen => 'केव्हा';

  @override
  String get shareToCol => 'कोणाला';

  @override
  String get shareKind => 'प्रकार';

  @override
  String get shareMessage => 'संदेश';

  @override
  String get shareStatus => 'स्थिती';

  @override
  String shareBy(String name) {
    return '$name यांनी पाठवले';
  }

  @override
  String get shareNone =>
      'अजून संदेश नाहीत. व्हॉट्सॲपवर पाठवलेली बिले, इनव्हॉइस आणि आठवणी इथे दिसतील.';

  @override
  String get shareKindsBillShare => 'काउंटर बिल';

  @override
  String get shareKindsInvoiceShare => 'इनव्हॉइस';

  @override
  String get shareKindsPaymentReminderLink => 'पेमेंटची आठवण';

  @override
  String get shareKindsPaymentReminder => 'पेमेंटची आठवण';

  @override
  String get shareKindsOrderConfirmation => 'ऑर्डरची पुष्टी';

  @override
  String get shareKindsFollowUp => 'फॉलो-अप';

  @override
  String get shareExpiredTitle => 'ही लिंक आता चालू नाही';

  @override
  String get shareExpired =>
      'लिंकची मुदत संपली आहे. दुकानाला पुन्हा पाठवायला सांगा.';

  @override
  String get shareStatement => 'खाते विवरण';

  @override
  String shareStatementFor(String name) {
    return '$name यांचे खाते विवरण';
  }

  @override
  String shareAsOf(String date) {
    return '$date पर्यंत';
  }

  @override
  String get shareBalance => 'देय रक्कम';

  @override
  String shareOverdue(String amount) {
    return '₹$amount थकीत';
  }

  @override
  String get shareBill => 'बिल';

  @override
  String get shareDate => 'तारीख';

  @override
  String get shareDue => 'देय तारीख';

  @override
  String get shareLate => 'उशीर';

  @override
  String get shareAmount => 'रक्कम';

  @override
  String shareDays(num n) {
    return '$n दिवस';
  }

  @override
  String get shareNotDue => 'अजून देय नाही';

  @override
  String get shareNothingOpen => 'काहीही देय नाही. धन्यवाद.';

  @override
  String shareAdvance(String amount) {
    return 'वजा आगाऊ दिलेले: ₹$amount';
  }

  @override
  String get sharePayTo => 'पेमेंट इथे करा';

  @override
  String get shareStatementNote =>
      'आपण आधीच पैसे दिले असल्यास हे विवरण दुर्लक्षित करा किंवा पेमेंटचा तपशील आम्हाला पाठवा.';

  @override
  String get shareErrorsInvalidPhone => '10 अंकी मोबाइल नंबर टाका.';

  @override
  String get shareErrorsNothingOutstanding => 'काहीही थकीत नाही.';

  @override
  String get shareErrorsSendFailed =>
      'व्हॉट्सॲपने संदेश स्वीकारला नाही. पुन्हा प्रयत्न करा.';

  @override
  String get shareErrorsOutside24hWindow =>
      'या ग्राहकाने 24 तासांत संदेश केला नाही, म्हणून व्हॉट्सॲपला मंजूर टेम्पलेट हवा. संदेश टेम्पलेटमध्ये त्याचे मंजूर नाव टाका.';

  @override
  String get shareErrorsBillVoid => 'हे बिल रद्द झाले आहे.';

  @override
  String get shareErrorsInvoiceCancelled => 'हे इनव्हॉइस रद्द झाले आहे.';

  @override
  String get shareErrorsUnknownTemplate =>
      'संदेश टेम्पलेट संग्रहात गेला आहे. संदेश टेम्पलेटमध्ये तो परत आणा.';

  @override
  String get launcherTitle => 'सर्व कामे';

  @override
  String get launcherSubtitle =>
      'प्रत्येक नोंद, स्क्रीन आणि अहवाल एका ठिकाणी. तारा दाबून टाइल माझ्या मेनूमध्ये जोडा.';

  @override
  String get launcherFilter => 'काम शोधण्यासाठी लिहा';

  @override
  String get launcherPin => 'माझ्या मेनूत जोडा';

  @override
  String get launcherUnpin => 'माझ्या मेनूतून काढा';

  @override
  String get launcherSaveFailed =>
      'माझा मेनू जतन झाला नाही. पुन्हा प्रयत्न करा.';

  @override
  String get launcherNoMatch => 'याच्याशी काहीही जुळत नाही.';

  @override
  String get launcherDone => 'झाले';

  @override
  String get launcherEdit => 'टाइल बदला';

  @override
  String get launcherAddTiles => 'टाइल जोडा';

  @override
  String get launcherReset => 'मूळ टाइलवर परत जा';

  @override
  String get launcherMoveLeft => 'आधी हलवा';

  @override
  String get launcherMoveRight => 'नंतर हलवा';

  @override
  String get launcherEmpty => 'अजून टाइल नाहीत. सर्व कामे मधून जोडा.';

  @override
  String get launcherMyMenu => 'माझा मेनू';

  @override
  String launcherMyMenuSubtitle(String name) {
    return 'नमस्कार $name. तुमच्या स्वतःच्या टाइल; टाइल बदला मधून बदला.';
  }

  @override
  String get launcherWaiting => 'तुमची वाट पाहत आहे';

  @override
  String get launcherSalesToday => 'आजची विक्री';

  @override
  String get launcherToCollect => 'वसूल करायचे';

  @override
  String get launcherToPay => 'द्यायचे';

  @override
  String launcherOverdue(String amount) {
    return '$amount थकीत';
  }

  @override
  String get launcherFullDashboard => 'पूर्ण डॅशबोर्ड';

  @override
  String get launcherGroupsEntries => 'नवीन नोंद';

  @override
  String get launcherGroupsPos => 'शोरूम काउंटर';

  @override
  String get launcherGroupsSales => 'विक्री';

  @override
  String get launcherGroupsPurchase => 'खरेदी';

  @override
  String get launcherGroupsInventory => 'स्टॉक';

  @override
  String get launcherGroupsManufacturing => 'उत्पादन आणि जॉब वर्क';

  @override
  String get launcherGroupsAccounts => 'खाती आणि GST';

  @override
  String get launcherGroupsBanking => 'बँकिंग';

  @override
  String get launcherGroupsReports => 'अहवाल';

  @override
  String get launcherGroupsCrm => 'ग्राहक आणि व्हॉट्सॲप';

  @override
  String get launcherGroupsHr => 'कर्मचारी आणि पगार';

  @override
  String get launcherGroupsExpenses => 'खर्च';

  @override
  String get launcherGroupsAssets => 'स्थिर मालमत्ता';

  @override
  String get launcherGroupsProjects => 'प्रकल्प';

  @override
  String get launcherGroupsHome => 'होम';

  @override
  String get launcherGroupsSettings => 'सेटिंग';

  @override
  String get launcherLaunchpad => 'लॉन्चपॅड';

  @override
  String launcherPinned(String n) {
    return '$n पिन केलेले';
  }

  @override
  String get launcherRecent => 'अलीकडे उघडलेले';

  @override
  String get launcherMoney => 'आजचे पैसे';

  @override
  String launcherVsYesterday(String pct) {
    return 'कालपेक्षा $pct%';
  }

  @override
  String launcherCounterBills(num n) {
    return '$n काउंटर बिले';
  }

  @override
  String get launcherCashToday => 'काउंटरवरील रोख';

  @override
  String get launcherUpiToday => 'काउंटरवरील UPI';

  @override
  String get launcherCardToday => 'काउंटरवरील कार्ड';

  @override
  String get launcherOverdueToCollect => 'थकीत वसुली';

  @override
  String get launcherAllTab => 'सर्व काही';

  @override
  String get launcherGridView => 'टाइल';

  @override
  String get launcherListView => 'यादी';

  @override
  String get launcherOpen => 'उघडा';

  @override
  String launcherCount(String n) {
    return '$n स्क्रीन आणि नोंदी ज्या तुम्ही उघडू शकता';
  }

  @override
  String get menuHMasters => 'मास्टर';

  @override
  String get menuHTransaction => 'व्यवहार';

  @override
  String get menuHReports => 'अहवाल';

  @override
  String get menuHAccountReports => 'खाते अहवाल';

  @override
  String get menuHPayroll => 'पगार';

  @override
  String get menuHUtility => 'युटिलिटी';

  @override
  String get menuHChat => 'चॅट';

  @override
  String get menuHExit => 'बाहेर';

  @override
  String get menuSoon => 'लवकरच';

  @override
  String get menuNotBuilt => 'अजून बनलेले नाही; यादीत आहे.';

  @override
  String get menuFilter => 'फिल्टर';

  @override
  String get menuHome => 'होम';

  @override
  String get menuOpenScreens => 'उघडलेल्या स्क्रीन';

  @override
  String get menuGAccount => 'खाते';

  @override
  String get menuGStock => 'स्टॉक';

  @override
  String get menuGParameters => 'पॅरामीटर';

  @override
  String get menuGPromotion => 'प्रमोशन मास्टर';

  @override
  String get menuGSales => 'विक्री व्यवहार';

  @override
  String get menuGAccounting => 'लेखा व्यवहार';

  @override
  String get menuGPurchase => 'खरेदी व्यवहार';

  @override
  String get menuGJobwork => 'जॉबवर्क व्यवहार';

  @override
  String get menuGOther => 'इतर व्यवहार';

  @override
  String get menuGSalesReports => 'विक्री अहवाल';

  @override
  String get menuGStockReports => 'स्टॉक अहवाल';

  @override
  String get menuGCustomReports => 'स्वतःचे अहवाल आणि तपासणी';

  @override
  String get menuGAccountReportsGroup => 'खाते अहवाल गट';

  @override
  String get menuGFinalReportGroup => 'अंतिम अहवाल गट';

  @override
  String get menuGMasterGroup => 'मास्टर गट';

  @override
  String get menuGPayrollTransactionGroup => 'पगार व्यवहार गट';

  @override
  String get menuGReportGroup => 'अहवाल गट';

  @override
  String get menuGUtilityGroup => 'युटिलिटी गट';

  @override
  String get menuGBarcodeGroup => 'बारकोड गट';

  @override
  String get menuGExtraUtility => 'अतिरिक्त युटिलिटी';

  @override
  String get menuGUserManagement => 'वापरकर्ता व्यवस्थापन';

  @override
  String get menuGSoftwareUtility => 'सॉफ्टवेअर युटिलिटी';

  @override
  String get menuGChatGroup => 'चॅट आणि ग्राहक';

  @override
  String get menuIAccountMaster => 'खाते मास्टर';

  @override
  String get menuIBankMaster => 'बँक मास्टर';

  @override
  String get menuIOpeningBalance => 'सुरुवातीची शिल्लक';

  @override
  String get menuIBalanceSheetGroup => 'ताळेबंद गट';

  @override
  String get menuIAccountGroup => 'खाते गट';

  @override
  String get menuIAccountCategory => 'खाते श्रेणी';

  @override
  String get menuIRegionMaster => 'प्रदेश मास्टर';

  @override
  String get menuICustomerSubCategory => 'ग्राहक उप-श्रेणी';

  @override
  String get menuIRemarksMaster => 'शेरा मास्टर';

  @override
  String get menuICompanyMaster => 'कंपनी मास्टर';

  @override
  String get menuICountryMaster => 'देश मास्टर';

  @override
  String get menuIDepartmentMaster => 'विभाग मास्टर';

  @override
  String get menuIManufactureCompany => 'उत्पादक कंपनी';

  @override
  String get menuIBrandMaster => 'ब्रँड मास्टर';

  @override
  String get menuIProductMaster => 'उत्पादन मास्टर';

  @override
  String get menuIStyleMaster => 'स्टाइल मास्टर';

  @override
  String get menuIItemGroup => 'वस्तू गट';

  @override
  String get menuIItemMaster => 'वस्तू मास्टर';

  @override
  String get menuIDesignMaster => 'डिझाइन मास्टर';

  @override
  String get menuIColorMaster => 'रंग मास्टर';

  @override
  String get menuISizeGroupMaster => 'साइज गट मास्टर';

  @override
  String get menuISizeMaster => 'साइज मास्टर';

  @override
  String get menuIFabric => 'कापड';

  @override
  String get menuISleeves => 'बाही';

  @override
  String get menuINeck => 'गळा';

  @override
  String get menuIFit => 'फिट';

  @override
  String get menuISeason => 'हंगाम';

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
  String get menuIMaterialMaster => 'मटेरियल मास्टर';

  @override
  String get menuIFixedBarcode => 'स्थिर बारकोड';

  @override
  String get menuIMinMaxStock => 'किमान कमाल स्टॉक';

  @override
  String get menuIOpeningStock => 'सुरुवातीचा स्टॉक';

  @override
  String get menuISeasonMaster => 'हंगाम मास्टर';

  @override
  String get menuIProcessMaster => 'प्रक्रिया मास्टर';

  @override
  String get menuIOrderType => 'ऑर्डर प्रकार';

  @override
  String get menuIWarehouses => 'गोदाम आणि स्टोअर';

  @override
  String get menuIDayBookMaster => 'डेबुक मास्टर';

  @override
  String get menuILedgerParameter => 'खाते पॅरामीटर';

  @override
  String get menuISalesmanMaster => 'सेल्समन मास्टर';

  @override
  String get menuITaxMaster => 'कर मास्टर';

  @override
  String get menuITdsMaster => 'TDS मास्टर';

  @override
  String get menuITcsTaxMaster => 'TCS कर मास्टर';

  @override
  String get menuIFinanceYearMaster => 'आर्थिक वर्ष मास्टर';

  @override
  String get menuIHsnCodeMaster => 'HSN कोड मास्टर';

  @override
  String get menuISalesReturnReason => 'विक्री परत कारण';

  @override
  String get menuISalesmanCommTarget => 'सेल्समन कमिशन लक्ष्य';

  @override
  String get menuIItemDiscountSetup => 'वस्तू सवलत सेटअप';

  @override
  String get menuIPromoMaster => 'प्रोमो मास्टर';

  @override
  String get menuISisSetup => 'SIS सेटअप';

  @override
  String get menuIItemCommissionSetup => 'वस्तू कमिशन सेटअप';

  @override
  String get menuISourceMaster => 'स्रोत मास्टर';

  @override
  String get menuISalesOrderWh => 'विक्री ऑर्डर (घाऊक)';

  @override
  String get menuIWhSalesOrderCancel => 'घाऊक ऑर्डर रद्द';

  @override
  String get menuIDeliveryOrder => 'डिलिव्हरी ऑर्डर (D.O)';

  @override
  String get menuIDeliveryChallan => 'डिलिव्हरी चलन';

  @override
  String get menuISalesBillWh => 'विक्री बिल (घाऊक)';

  @override
  String get menuIDeliveryChallanReturnWh => 'डिलिव्हरी चलन परत (घाऊक)';

  @override
  String get menuICreditNoteWh => 'क्रेडिट नोट (घाऊक)';

  @override
  String get menuIAdvanceReceipt => 'आगाऊ पावती';

  @override
  String get menuICashPayRec => 'रोख भरणा/जमा';

  @override
  String get menuIBankPayRec => 'बँक भरणा/जमा';

  @override
  String get menuIBillWiseReceipt => 'बिलनिहाय पावती';

  @override
  String get menuICardReceipt => 'कार्ड पावती';

  @override
  String get menuIJournalVoucher => 'जर्नल व्हाउचर';

  @override
  String get menuIContraVoucher => 'कॉन्ट्रा व्हाउचर';

  @override
  String get menuIPurchaseOrder => 'खरेदी ऑर्डर';

  @override
  String get menuIInwardChallan => 'इनवर्ड चलन';

  @override
  String get menuIPurchase => 'खरेदी';

  @override
  String get menuIGoodsReturn => 'माल परत';

  @override
  String get menuIDebitNote => 'डेबिट नोट';

  @override
  String get menuIGstJv => 'GST JV';

  @override
  String get menuIJobIssue => 'जॉब इश्यू';

  @override
  String get menuIJobReceipt => 'जॉब पावती';

  @override
  String get menuIJobWorkIssue => 'जॉबवर्क इश्यू';

  @override
  String get menuIJobWorkReceipt => 'जॉबवर्क पावती';

  @override
  String get menuIStockAdjustment => 'स्टॉक समायोजन';

  @override
  String get menuISampleIssue => 'नमुना इश्यू';

  @override
  String get menuISampleReceive => 'नमुना प्राप्ती';

  @override
  String get menuIQuotation => 'कोटेशन';

  @override
  String get menuILrTransportEntry => 'LR/वाहतूक नोंद';

  @override
  String get menuIEWayBill => 'ई-वे बिल';

  @override
  String get menuIRePackingBox => 'रीपॅकिंग बॉक्स';

  @override
  String get menuIReOpenBox => 'बॉक्स पुन्हा उघडा';

  @override
  String get menuILedgerReport => 'खातेवही अहवाल';

  @override
  String get menuICashBookReport => 'रोख वही अहवाल';

  @override
  String get menuIBankReport => 'बँक अहवाल';

  @override
  String get menuIBankReconciliation => 'बँक जुळवणी';

  @override
  String get menuIGroupMonthSummary => 'गट/महिना सारांश';

  @override
  String get menuICashBankExpense => 'रोख बँक खर्च';

  @override
  String get menuICashFlowReportGroup => 'रोख प्रवाह अहवाल';

  @override
  String get menuIBillToBillAdjustment => 'बिल ते बिल समायोजन';

  @override
  String get menuIMsmeReport => 'MSME अहवाल';

  @override
  String get menuIOutstandingPayable => 'थकीत देय';

  @override
  String get menuIOutstandingReceivable => 'थकीत येणे';

  @override
  String get menuIDebtorsList => 'ऋणको यादी';

  @override
  String get menuICreditorList => 'धनको यादी';

  @override
  String get menuIInterestReport => 'व्याज अहवाल';

  @override
  String get menuIDepreciationAssetReport => 'घसारा मालमत्ता अहवाल';

  @override
  String get menuIJournalVoucherReport => 'जर्नल व्हाउचर अहवाल';

  @override
  String get menuIGstReport => 'GST अहवाल';

  @override
  String get menuITdsReport => 'TDS अहवाल';

  @override
  String get menuITdsForm26q => 'TDS फॉर्म 26Q';

  @override
  String get menuIFinalReport => 'अंतिम अहवाल';

  @override
  String get menuIRcmRegister => 'RCM रजिस्टर';

  @override
  String get menuITcsReport => 'TCS अहवाल';

  @override
  String get menuIEmployee => 'कर्मचारी';

  @override
  String get menuIEmployeeKyc => 'कर्मचारी KYC अपडेट';

  @override
  String get menuISalaryDeduction => 'पगार कपात';

  @override
  String get menuIWeekOff => 'साप्ताहिक सुट्टी';

  @override
  String get menuIWeekOffCancel => 'साप्ताहिक सुट्टी रद्द';

  @override
  String get menuIHolidays => 'सुट्ट्या';

  @override
  String get menuIDesignation => 'पद';

  @override
  String get menuIDepartment => 'विभाग';

  @override
  String get menuIShiftMaster => 'शिफ्ट मास्टर';

  @override
  String get menuIDailyAttendance => 'दैनिक हजेरी';

  @override
  String get menuILeaveApplication => 'रजा अर्ज';

  @override
  String get menuIAdvanceSalary => 'आगाऊ पगार (उपाड)';

  @override
  String get menuILoanIssue => 'कर्ज देणे';

  @override
  String get menuILoanReceipt => 'कर्ज वसुली';

  @override
  String get menuIMonthlySalary => 'मासिक पगार';

  @override
  String get menuIStipend => 'विद्यावेतन';

  @override
  String get menuISalaryPayment => 'पगार अदायगी';

  @override
  String get menuIStipendPayment => 'विद्यावेतन अदायगी';

  @override
  String get menuIIncentive => 'प्रोत्साहन';

  @override
  String get menuIOtherDeduction => 'इतर कपात';

  @override
  String get menuIAdvanceLoanRequest => 'आगाऊ आणि कर्ज विनंती';

  @override
  String get menuIMonthlyAttendanceRegister => 'मासिक हजेरी रजिस्टर';

  @override
  String get menuIDayWiseAttendanceRegister => 'दिवसनिहाय हजेरी रजिस्टर';

  @override
  String get menuISalarySlipRegister => 'पगार स्लिप रजिस्टर';

  @override
  String get menuIPtReport => 'PT अहवाल';

  @override
  String get menuILeaveReport => 'रजा अहवाल';

  @override
  String get menuIMenuLogSessionReport => 'मेनू लॉग सत्र अहवाल';

  @override
  String get menuIPayrollParameter => 'पगार पॅरामीटर';

  @override
  String get menuIDeviceSettings => 'डिव्हाइस सेटिंग';

  @override
  String get menuIBarcodePrint => 'बारकोड प्रिंट';

  @override
  String get menuIBarcodeSearch => 'बारकोड शोध';

  @override
  String get menuIBarcodeDesignImage => 'बारकोड/डिझाइन फोटो';

  @override
  String get menuIRateUpdation => 'दर अद्ययावत';

  @override
  String get menuIImageCatalogue => 'फोटो कॅटलॉग';

  @override
  String get menuISalesDiscountMaster => 'विक्री सवलत मास्टर';

  @override
  String get menuISalesDiscountDesignWise => 'डिझाइननिहाय विक्री सवलत';

  @override
  String get menuISalesmanCommission => 'सेल्समन कमिशन';

  @override
  String get menuIDayClose => 'दिवस बंद';

  @override
  String get menuISms => 'SMS';

  @override
  String get menuIEmail => 'ईमेल';

  @override
  String get menuIBulkMessenger => 'बल्क मेसेंजर';

  @override
  String get menuILogHistoryReport => 'लॉग इतिहास अहवाल';

  @override
  String get menuIOutstandingAdj => 'थकीत समायोजन';

  @override
  String get menuIResetPhysicalStock => 'प्रत्यक्ष स्टॉक रीसेट';

  @override
  String get menuIPhysicalStockVerification => 'प्रत्यक्ष स्टॉक पडताळणी';

  @override
  String get menuIMerge => 'विलीन';

  @override
  String get menuISalesStockLedgerDiff => 'विक्री स्टॉक खाते फरक';

  @override
  String get menuINoteReport => 'नोंद अहवाल';

  @override
  String get menuIEInvoiceUpload => 'ई-इनव्हॉइस अपलोड';

  @override
  String get menuIEWayBillUpload => 'ई-वे बिल अपलोड';

  @override
  String get menuIAutoOutstandingReminder => 'स्वयं थकबाकी आठवण';

  @override
  String get menuIUsers => 'वापरकर्ते';

  @override
  String get menuIUserGroup => 'वापरकर्ता गट';

  @override
  String get menuICurrentDateSetting => 'चालू तारीख सेटिंग';

  @override
  String get menuIDataLockTillDate => 'तारखेपर्यंत डेटा लॉक';

  @override
  String get menuIMyDevices => 'माझी डिव्हाइसेस';

  @override
  String get menuILedgerStockPosting => 'खाते आणि स्टॉक पोस्टिंग';

  @override
  String get menuIReportType => 'अहवाल प्रकार';

  @override
  String get menuIUserParameter => 'वापरकर्ता पॅरामीटर';

  @override
  String get menuIBalanceTransfer => 'शिल्लक हस्तांतरण';

  @override
  String get menuIDatabaseBackup => 'डेटाबेस बॅकअप';

  @override
  String get menuISoftwareUpdate => 'सॉफ्टवेअर अपडेट';

  @override
  String get menuIDbUpdates => 'DB अपडेट';

  @override
  String get menuIScheduleBackup => 'बॅकअप वेळ ठरवा';

  @override
  String get menuIExportVouchersPdf => 'व्हाउचर PDF मध्ये काढा';

  @override
  String get menuIEmployeeDepartment => 'विभाग';

  @override
  String get menuISensitiveChanges => 'संवेदनशील बदल';

  @override
  String get menuITransporterMaster => 'ट्रान्सपोर्टर मास्टर';

  @override
  String get listsSubtitle =>
      'या व्यवसायाची स्वतःची यादी. नोंद हटवण्याऐवजी संग्रहित करा, म्हणजे जुन्या दस्तऐवजांत तिचे मूल्य टिकून राहील.';

  @override
  String get listsName => 'नाव';

  @override
  String get listsCode => 'कोड';

  @override
  String get listsNote => 'टीप';

  @override
  String get listsNewEntry => 'नवीन नोंद';

  @override
  String listsShowArchived(String n) {
    return 'संग्रहित दाखवा ($n)';
  }

  @override
  String listsEntries(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n नोंदी',
      one: '$n नोंद',
    );
    return '$_temp0';
  }

  @override
  String get listsArchive => 'संग्रहित करा';

  @override
  String get listsRestore => 'परत आणा';

  @override
  String get listsNoMatch => 'शोधाशी जुळणारी नोंद नाही.';

  @override
  String get listsEmpty =>
      'या यादीत अजून काही नाही. पहिली नोंद वरच्या ओळीत लिहा.';

  @override
  String get listsEmptyReadOnly => 'या यादीत अजून काही नाही.';

  @override
  String get listsOtherLists => 'याद्या';

  @override
  String get listsErrorsLookupTaken => 'या यादीत या नावाची नोंद आधीच आहे.';

  @override
  String get listsErrorsEndBeforeStart =>
      'शेवटची तारीख सुरुवातीच्या तारखेपूर्वी आहे.';

  @override
  String get limitsTitle => 'किमान आणि कमाल स्टॉक';

  @override
  String get limitsSubtitle =>
      'प्रत्येक मालाचा साठा गोदामात किमान आणि कमाल किती असावा ते ठरवा. किमानपेक्षा कमी असलेल्या मालावर खूण दिसते, म्हणजे काय मागवायचे ते कळते.';

  @override
  String get limitsWarehouse => 'गोदाम';

  @override
  String limitsOnlyBelow(String n) {
    return 'फक्त किमानपेक्षा कमी ($n)';
  }

  @override
  String limitsSaved(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n ओळी जतन केल्या',
      one: '$n ओळ जतन केली',
    );
    return '$_temp0';
  }

  @override
  String limitsSaveN(String n) {
    return '$n बदललेल्या ओळी जतन करा';
  }

  @override
  String get limitsItem => 'माल';

  @override
  String get limitsInStock => 'साठ्यात';

  @override
  String get limitsMin => 'किमान';

  @override
  String get limitsMax => 'कमाल';

  @override
  String get limitsToOrder => 'मागवायचे';

  @override
  String get limitsBelow => 'किमानपेक्षा कमी';

  @override
  String get limitsNoMatch => 'जुळणारा माल नाही.';

  @override
  String get limitsEmpty =>
      'अजून माल नाही. आधी माल किंवा स्टाइल जोडा, मग इथे मर्यादा ठरवा.';

  @override
  String get limitsErrorsMaxBelowMin => 'कमाल हे किमानपेक्षा कमी असू शकत नाही.';

  @override
  String get billReceiptTitleReceivable => 'बिलानुसार पावती';

  @override
  String get billReceiptTitlePayable => 'बिलानुसार पेमेंट';

  @override
  String get billReceiptSubtitleReceivable =>
      'मिळालेली रक्कम नोंदवा आणि ती कोणत्या बिलांची आहे ते निवडा. उरलेली रक्कम खात्यावर राहते आणि सर्वात जुनी बिले फेडते.';

  @override
  String get billReceiptSubtitlePayable =>
      'पुरवठादाराला दिलेले पेमेंट नोंदवा आणि ते कोणत्या बिलांचे आहे ते निवडा. उरलेली रक्कम खात्यावर राहते आणि सर्वात जुनी बिले फेडते.';

  @override
  String get billReceiptTabReceipt => 'पावती';

  @override
  String get billReceiptTabPayment => 'पेमेंट';

  @override
  String get billReceiptCustomer => 'ग्राहक';

  @override
  String get billReceiptSupplier => 'पुरवठादार';

  @override
  String get billReceiptChoose => 'पक्ष निवडा';

  @override
  String get billReceiptAccount => 'रोख किंवा बँक खाते';

  @override
  String get billReceiptAmountReceived => 'मिळालेली रक्कम';

  @override
  String get billReceiptAmountPaid => 'दिलेली रक्कम';

  @override
  String get billReceiptReference => 'संदर्भ (धनादेश, UPI आयडी)';

  @override
  String get billReceiptOpenBills => 'बाकी बिले';

  @override
  String billReceiptAdvance(String amount) {
    return 'आधीच खात्यावर: $amount';
  }

  @override
  String get billReceiptFillOldest => 'सर्वात जुन्यापासून भरा';

  @override
  String get billReceiptClear => 'साफ करा';

  @override
  String get billReceiptBill => 'बिल';

  @override
  String get billReceiptDueOn => 'देय तारीख';

  @override
  String get billReceiptPending => 'बाकी';

  @override
  String get billReceiptPayNow => 'आत्ता भरा';

  @override
  String billReceiptLate(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिवस उशीर',
      one: '$n दिवस उशीर',
    );
    return '$_temp0';
  }

  @override
  String get billReceiptNoBills => 'या पक्षाचे कोणतेही बाकी बिल नाही.';

  @override
  String get billReceiptOnBills => 'बिलांवर';

  @override
  String get billReceiptOnAccount => 'खात्यावर';

  @override
  String get billReceiptSaveReceipt => 'पावती जतन करा';

  @override
  String get billReceiptSavePayment => 'पेमेंट जतन करा';

  @override
  String billReceiptSaved(String number) {
    return '$number म्हणून जतन केले';
  }

  @override
  String get billReceiptErrorsOverAllocated =>
      'बिलांची एकूण रक्कम दिलेल्या रकमेपेक्षा जास्त आहे.';

  @override
  String get billReceiptErrorsBillNotOpen =>
      'यापैकी एक बिल आता बाकी नाही. पान पुन्हा उघडून पुन्हा प्रयत्न करा.';

  @override
  String get billReceiptErrorsOverBill =>
      'एक रक्कम बिलाच्या बाकीपेक्षा जास्त आहे.';

  @override
  String get billReceiptErrorsAmountRequired => 'रक्कम भरा.';

  @override
  String get billReceiptErrorsBillTwice => 'तेच बिल दोनदा दिले आहे.';

  @override
  String get booksTitle => 'खाते वही';

  @override
  String get booksSubtitle =>
      'रोख आणि बँकेचे व्यवहार, एखाद्या गटाचा महिनावार तपशील, रोख व बँकेतून झालेला खर्च, आणि पैसे कुठून आले व कुठे गेले.';

  @override
  String get booksCash => 'रोखवही';

  @override
  String get booksBank => 'बँक वही';

  @override
  String get booksGroup => 'गट महिनावार';

  @override
  String get booksExpense => 'रोख आणि बँक खर्च';

  @override
  String get booksFlow => 'रोख प्रवाह';

  @override
  String get booksShow => 'दाखवा';

  @override
  String get booksPickGroup => 'खाते गट';

  @override
  String get booksOpening => 'सुरुवातीची शिल्लक';

  @override
  String get booksReceipts => 'जमा';

  @override
  String get booksPayments => 'खर्च';

  @override
  String get booksClosing => 'अखेरची शिल्लक';

  @override
  String get booksAccounts => 'खाती';

  @override
  String get booksByDay => 'दिवसानुसार';

  @override
  String get booksMonth => 'महिना';

  @override
  String get booksDebit => 'नावे';

  @override
  String get booksCredit => 'जमा';

  @override
  String get booksExpenseAccount => 'खर्च खाते';

  @override
  String get booksVouchers => 'व्हाउचर';

  @override
  String get booksOtherSide => 'नोंदीची दुसरी बाजू';

  @override
  String get booksMoneyIn => 'आलेले पैसे';

  @override
  String get booksMoneyOut => 'गेलेले पैसे';

  @override
  String get booksNet => 'निव्वळ';

  @override
  String get booksTotal => 'एकूण';

  @override
  String get booksEmpty => 'या कालावधीत काही नाही.';

  @override
  String get booksNoAccounts => 'या गटात अजून खाते नाहीत.';

  @override
  String get booksRcm => 'आरसीएम नोंदवही';

  @override
  String get booksAdjust => 'बिल ते बिल समायोजन';

  @override
  String get booksVoucher => 'व्हाउचर';

  @override
  String get booksBill => 'फेडलेले बिल';

  @override
  String get booksParty => 'पक्ष';

  @override
  String get booksAmount => 'रक्कम';

  @override
  String get booksSupplier => 'पुरवठादार';

  @override
  String get booksInvoice => 'पुरवठादाराचे बिल';

  @override
  String get booksTaxable => 'करपात्र';

  @override
  String get booksCgst => 'सीजीएसटी';

  @override
  String get booksSgst => 'एसजीएसटी / यूटीजीएसटी';

  @override
  String get booksIgst => 'आयजीएसटी';

  @override
  String get booksCess => 'उपकर';

  @override
  String get hubReportsTitle => 'अहवाल';

  @override
  String get hubReportsSubtitle =>
      'प्रत्येक अहवाल एका ठिकाणी, तो कोणत्या प्रश्नाचे उत्तर देतो त्यानुसार.';

  @override
  String get hubMastersTitle => 'मास्टर';

  @override
  String get hubMastersSubtitle =>
      'प्रत्येक बिल आणि व्हाउचर ज्यावर आधारित असते ते रेकॉर्ड: तुम्ही काय विकता, कोणाशी व्यवहार करता, किंमती आणि नियम, स्टोअर आणि काउंटर.';

  @override
  String get hubGroupsMerchandise => 'माल';

  @override
  String get hubGroupsParties => 'पार्टी आणि लोक';

  @override
  String get hubGroupsCommercial => 'किंमती, ऑफर आणि कर';

  @override
  String get hubGroupsOperational => 'स्टोअर, काउंटर आणि नियम';

  @override
  String get hubGroupsSales => 'विक्री';

  @override
  String get hubGroupsStock => 'स्टॉक';

  @override
  String get hubGroupsAccounts => 'खाते अहवाल';

  @override
  String get hubGroupsTax => 'कर आणि वैधानिक';

  @override
  String get hubGroupsAudit => 'तपासणी आणि ऑडिट';

  @override
  String get hubGroupsCustom => 'तुमचे स्वतःचे अहवाल';

  @override
  String get hubAboutMerchandise => 'डिझाइन, साइज, रंग आणि फोटो';

  @override
  String get hubAboutParties => 'ग्राहक, पुरवठादार आणि प्रत्येक खाते; कर्मचारी';

  @override
  String get hubAboutCommercial =>
      'वस्तू कोणत्या किंमतीला विकल्या जातात आणि कोणता GST लागतो';

  @override
  String get hubAboutOperational =>
      'स्टॉक कुठे असतो आणि काउंटर व क्रमांक कसे चालतात';

  @override
  String get hubAboutSales => 'काय विकले, कुठे आणि कोणाला';

  @override
  String get hubAboutStock => 'शेल्फवर काय आहे आणि किती दिवस पडून आहे';

  @override
  String get hubAboutAccounts => 'कोणाचे किती देणे, नफा आणि खाती';

  @override
  String get hubAboutTax => 'GST रिटर्न, पगार वैधानिक आणि कर घसारा';

  @override
  String get hubAboutAudit => 'पाहण्याजोग्या अपवाद आणि कोणी काय बदलले';

  @override
  String get hubAboutCustom => 'स्वतःचे अहवाल बनवा, जतन करा आणि वेळ ठरवा';

  @override
  String get exchangeOpen => 'परत किंवा बदल';

  @override
  String get exchangeTitle => 'या बिलावर परत आलेला माल';

  @override
  String exchangeTaking(num pieces, String number) {
    return '$number मधून $pieces नग परत';
  }

  @override
  String get exchangeCredit => 'क्रेडिट';

  @override
  String get exchangeAdd => 'या बिलावर परत घ्या';

  @override
  String exchangeCreditUsed(String number) {
    return '$number विरुद्ध परत';
  }

  @override
  String exchangeCreditLeft(String amount) {
    return '$amount क्रेडिट उरले आहे; ते स्टोअर क्रेडिट राहील.';
  }

  @override
  String exchangeDone(String number, String amount) {
    return 'परत $number ने या बिलातून $amount कमी केले.';
  }

  @override
  String exchangeLeftCode(String amount) {
    return '$amount चे स्टोअर क्रेडिट उरले, कोड:';
  }

  @override
  String exchangeReceiptReturned(String number) {
    return 'परत (बिल $number)';
  }

  @override
  String exchangeReceiptCredit(String amount, String code) {
    return 'स्टोअर क्रेडिट $amount, कोड $code';
  }

  @override
  String get inwardTransporter => 'ट्रान्सपोर्टर';

  @override
  String get inwardLrNumber => 'LR क्रमांक';

  @override
  String get inwardLrDate => 'LR तारीख';

  @override
  String get inwardMarkup => 'मार्क-अप %';

  @override
  String get inwardMarkupHint => 'खर्चावरून MRP भरते';

  @override
  String get inwardRounding => 'MRP गोल करा';

  @override
  String get inwardRound1 => 'जवळचा रुपया';

  @override
  String get inwardRound9 => '9 ने शेवट (1,299)';

  @override
  String get inwardRound10 => 'पुढील 10';

  @override
  String get inwardRound50 => 'पुढील 50';

  @override
  String get inwardCost => 'खर्च';

  @override
  String get inwardMrp => 'MRP';

  @override
  String get inwardMarkupCol => 'मार्क-अप';

  @override
  String get inwardMarkupTitle => 'खर्चावर MRP, खर्चाचा %';

  @override
  String get inwardMarginCol => 'मार्जिन';

  @override
  String get inwardMarginTitle => 'MRP पासून खर्चापर्यंत घट, MRP चा %';

  @override
  String inwardTotals(String pieces, String value) {
    return '$pieces नग, खर्च $value';
  }

  @override
  String get inwardLastPurchases => 'मागील खरेदी';

  @override
  String get inwardPickLine => 'आधीचा खर्च पाहण्यासाठी एखादी ओळ निवडा.';

  @override
  String get inwardCurrentMrp => 'सध्याचा MRP';

  @override
  String get inwardInStock => 'स्टॉकमध्ये';

  @override
  String get inwardDate => 'तारीख';

  @override
  String get inwardNeverBought => 'आधी खरेदी केले नाही.';

  @override
  String get inwardPrintLabels => 'या नगांचे लेबल छापा';

  @override
  String get inwardDocument => 'चलन';

  @override
  String get inwardState => 'राज्य';

  @override
  String get inwardTransport => 'वाहतूक';

  @override
  String get inwardSizeCurve => 'साइजनुसार नग';

  @override
  String get inwardTotalQty => 'नग';

  @override
  String get inwardAtCost => 'खर्चाने';

  @override
  String get inwardAvgMarkup => 'मार्क-अप';

  @override
  String get countsTitle => 'स्टॉक मोजणी';

  @override
  String get countsSubtitle =>
      'बारकोड स्कॅन करून स्टोअर मोजा. मंजूर करणारा फरक व त्याचे मूल्य पाहतो, आणि मंजुरीने खाती दुरुस्त होतात.';

  @override
  String get countsWholeStore => 'संपूर्ण स्टोअर';

  @override
  String get countsWhat => 'काय मोजायचे';

  @override
  String get countsByAll => 'स्टोअरमधील सर्व माल';

  @override
  String get countsByBrand => 'एक ब्रँड';

  @override
  String get countsByCategory => 'एक श्रेणी';

  @override
  String get countsByStyleId => 'एक डिझाइन';

  @override
  String get countsName => 'नाव';

  @override
  String get countsNamePlaceholder => 'उदा. कुर्ता भिंत';

  @override
  String get countsBlind => 'अंध मोजणी (मोजणारे खात्याचे आकडे पाहत नाहीत)';

  @override
  String get countsBlindShort => 'अंध मोजणी';

  @override
  String get countsStart => 'मोजणी सुरू करा';

  @override
  String get countsScanHere => 'बारकोड स्कॅन करा';

  @override
  String get countsAdd => 'जोडा';

  @override
  String get countsScanHint =>
      'प्रत्येक स्कॅन एक नग जोडतो. पाचसाठी 5*बारकोड लिहा, किंवा खालील तक्त्यात संख्या लिहा.';

  @override
  String get countsOutOfScope => 'या मोजणीत नव्हते, जोडले';

  @override
  String get countsStatusCounting => 'मोजणी सुरू आहे';

  @override
  String get countsStatusSubmitted => 'मंजुरीची प्रतीक्षा';

  @override
  String get countsStatusApproved => 'मंजूर, खाती दुरुस्त';

  @override
  String get countsStatusCancelled => 'रद्द';

  @override
  String get countsJournal => 'स्टॉक समायोजन पहा';

  @override
  String get countsPiecesCounted => 'मोजलेले नग';

  @override
  String get countsItemsCounted => 'मोजलेल्या वस्तू';

  @override
  String get countsInBooks => 'खात्यात';

  @override
  String get countsShort => 'कमी (मूल्य)';

  @override
  String get countsExcess => 'जास्त (मूल्य)';

  @override
  String get countsNet => 'निव्वळ फरक';

  @override
  String get countsBlindNote =>
      'अंध मोजणी: सादर केल्यानंतर खात्याचे आकडे दिसतील.';

  @override
  String get countsSubmit => 'मोजणी पूर्ण करा';

  @override
  String get countsReason => 'फरकाचे कारण';

  @override
  String countsApproveAdjust(num n) {
    return 'मंजूर करा आणि $n वस्तू दुरुस्त करा';
  }

  @override
  String get countsApproveNone => 'मंजूर करा (फरक नाही)';

  @override
  String get countsRecount => 'पुन्हा मोजण्यासाठी परत पाठवा';

  @override
  String get countsWaitingApproval => 'मालक किंवा अ‍ॅडमिन फरक मंजूर करतात.';

  @override
  String get countsCancelConfirm =>
      'ही मोजणी रद्द करायची? खात्यात काहीही बदलणार नाही.';

  @override
  String get countsCancel => 'मोजणी रद्द करा';

  @override
  String get countsOnlyDiff => 'फक्त फरक असलेल्या वस्तू दाखवा';

  @override
  String get countsItem => 'वस्तू';

  @override
  String get countsCounted => 'मोजले';

  @override
  String get countsDiff => 'फरक';

  @override
  String get countsValue => 'मूल्य';

  @override
  String get countsNoDiff => 'खात्यापेक्षा काहीही वेगळे नाही.';

  @override
  String get countsNumber => 'मोजणी';

  @override
  String get countsStarted => 'सुरू';

  @override
  String get countsState => 'स्थिती';

  @override
  String get countsNone => 'अजून मोजणी नाही.';

  @override
  String get countsErrorsCountClosed => 'ही मोजणी आता खुली नाही.';

  @override
  String get countsErrorsCountNotSubmitted => 'आधी मोजणी पूर्ण करा.';

  @override
  String get countsErrorsReasonRequired => 'फरकाचे कारण लिहा.';

  @override
  String get countsErrorsUnknownBarcode => 'या बारकोडची कोणतीही वस्तू नाही.';

  @override
  String get countsErrorsNothingToCount =>
      'त्या निवडीशी कोणताही माल जुळत नाही.';

  @override
  String get countsErrorsUnknownWarehouse => 'स्टोअर निवडा.';

  @override
  String get countsErrorsTooManyCodes =>
      'फाइलमध्ये 5,000 पेक्षा जास्त वेगवेगळे बारकोड आहेत. ती विभागून भागांत आयात करा.';

  @override
  String get countsImportTitle => 'स्कॅनर फाइल आयात करा';

  @override
  String get countsImportHelp =>
      'हँडहेल्ड स्कॅनरची टेक्स्ट फाइल: प्रत्येक ओळीत एक बारकोड, किंवा बारकोड आणि संख्या (\"8901234567890,3\"). पुन्हा आलेले बारकोड बेरीज होतात.';

  @override
  String get countsImportMode => 'संख्यांचे काय करायचे';

  @override
  String get countsImportAdd => 'मोजलेल्यात मिळवा';

  @override
  String get countsImportReplace => 'या बारकोडची मोजणी बदला';

  @override
  String get countsImportChoose => 'फाइल निवडा';

  @override
  String get countsImportReading => 'वाचत आहे...';

  @override
  String get countsImportTooBig =>
      'ही फाइल खूप मोठी आहे (2 एमबी पेक्षा जास्त).';

  @override
  String countsImportDone(num matched, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      matched,
      locale: localeName,
      other: '$matched माल मोजले',
      one: '$matched माल मोजला',
    );
    return '$_temp0, $pieces नग';
  }

  @override
  String countsImportExtra(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n माल या मोजणीच्या यादीत नव्हते, जोडले.',
      one: '$n माल या मोजणीच्या यादीत नव्हता, जोडला.',
    );
    return '$_temp0';
  }

  @override
  String countsImportUnknown(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n कोड माल नाहीत: $list',
      one: '$n कोड माल नाही: $list',
    );
    return '$_temp0';
  }

  @override
  String countsImportSkipped(num n, String list) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n ओळी वाचता आल्या नाहीत (ओळी $list)',
      one: '$n ओळ वाचता आली नाही (ओळ $list)',
    );
    return '$_temp0';
  }

  @override
  String get stockTitle => 'स्टॉक सारांश';

  @override
  String stockSubtitle(String method) {
    return 'प्रत्येक वस्तूचे प्रमाण आणि मूल्य. मूल्यांकन $method ने.';
  }

  @override
  String get stockMethodAverage => 'चल सरासरी';

  @override
  String get stockMethodFifo => 'FIFO (आधी आले, आधी गेले)';

  @override
  String get stockWarehouse => 'गोदाम';

  @override
  String get stockAllWarehouses => 'सर्व गोदामे';

  @override
  String get stockQty => 'प्रमाण';

  @override
  String get stockRate => 'दर';

  @override
  String get stockValue => 'मूल्य';

  @override
  String get stockTotalValue => 'एकूण स्टॉक मूल्य';

  @override
  String get stockBelowReorder => 'पुन्हा मागणी पातळीखाली';

  @override
  String get stockReorderTitle => 'पुन्हा मागवायच्या वस्तू';

  @override
  String get stockReorderEmpty => 'काहीही पुन्हा मागणी पातळीखाली नाही.';

  @override
  String get stockSuggested => 'सुचवलेली ऑर्डर';

  @override
  String stockLedgerTitle(String item) {
    return 'स्टॉक खतावणी: $item';
  }

  @override
  String get stockIn => 'आवक';

  @override
  String get stockOut => 'जावक';

  @override
  String get stockSourceStockJournal => 'स्टॉक जर्नल';

  @override
  String get stockSourceGrn => 'माल पावती';

  @override
  String get stockSourcePurchaseBill => 'खरेदी बिल';

  @override
  String get stockSourcePurchaseReturn => 'खरेदी परतावा';

  @override
  String get stockNegativeWarning =>
      'एखाद्या वस्तूचा स्टॉक शून्याखाली गेला. खरेदीची नोंद राहिली आहे का ते तपासा.';

  @override
  String get sjTitle => 'स्टॉक जर्नल';

  @override
  String get sjSubtitle =>
      'आरंभीचा स्टॉक, प्रत्यक्ष मोजणीनंतरचे समायोजन, गोदामांमधील हस्तांतरण आणि वापर.';

  @override
  String get sjNew => 'नवीन स्टॉक जर्नल';

  @override
  String get sjKindsOpening => 'आरंभीचा स्टॉक';

  @override
  String get sjKindsAdjustment => 'समायोजन';

  @override
  String get sjKindsTransfer => 'हस्तांतरण';

  @override
  String get sjKindsIssue => 'वापर / उपभोग';

  @override
  String get sjKindHintsOpening =>
      'हिशेब सुरू झाले तेव्हा तुमच्याकडे असलेला स्टॉक. प्रमाण आणि किंमत टाका.';

  @override
  String get sjKindHintsAdjustment =>
      'प्रत्यक्ष मोजणीनंतर स्टॉक दुरुस्त करा: प्रमाण वाढवा किंवा कमी करा.';

  @override
  String get sjKindHintsTransfer => 'सध्याच्या किमतीवर गोदामांमध्ये माल हलवा.';

  @override
  String get sjKindHintsIssue =>
      'व्यवसायात वापरलेला माल (नमुने, स्वतःसाठी, उत्पादन).';

  @override
  String get sjDirection => 'वाढवा / कमी करा';

  @override
  String get sjAdd => 'वाढवा';

  @override
  String get sjRemove => 'कमी करा';

  @override
  String get sjToWarehouse => 'या गोदामात';

  @override
  String get sjBatch => 'बॅच';

  @override
  String get sjExpiry => 'मुदत';

  @override
  String get sjPost => 'स्टॉक जर्नल नोंदवा';

  @override
  String get sjErrorsRateRequired => 'आरंभीच्या स्टॉकसाठी किंमत दर टाका.';

  @override
  String get sjErrorsServiceHasNoStock => 'सेवांना स्टॉक नसतो.';

  @override
  String get sjErrorsTransferNeedsTwoWarehouses => 'दोन वेगवेगळी गोदामे निवडा.';

  @override
  String get sjErrorsBatchRequired =>
      'ही वस्तू बॅचनुसार ठेवली जाते: बॅच क्रमांक टाका.';

  @override
  String get sjErrorsQtyMustBePositive => 'प्रमाण शून्यापेक्षा जास्त असावे.';

  @override
  String get purchaseSupplier => 'पुरवठादार';

  @override
  String get purchaseChooseSupplier => 'पुरवठादार निवडा…';

  @override
  String get purchaseItem => 'वस्तू';

  @override
  String get purchaseChooseItem => 'वस्तू निवडा…';

  @override
  String get purchaseQty => 'प्रमाण';

  @override
  String get purchaseRate => 'दर';

  @override
  String get purchaseDiscount => 'सूट';

  @override
  String get purchaseGst => 'जीएसटी %';

  @override
  String get purchaseAmount => 'रक्कम';

  @override
  String get purchaseTaxable => 'करपात्र मूल्य';

  @override
  String get purchaseTotal => 'एकूण';

  @override
  String get purchaseStatus => 'स्थिती';

  @override
  String get purchaseStatusesOpen => 'खुली';

  @override
  String get purchaseStatusesPartial => 'अंशतः आली';

  @override
  String get purchaseStatusesReceived => 'आली';

  @override
  String get purchaseStatusesClosed => 'बंद';

  @override
  String get purchaseStatusesCancelled => 'रद्द';

  @override
  String get purchaseStatusesPosted => 'नोंदवले';

  @override
  String get purchaseStatusesBilled => 'बिल झाले';

  @override
  String get purchaseOrdersTitle => 'खरेदी ऑर्डर';

  @override
  String get purchaseOrdersSubtitle =>
      'तुम्ही पुरवठादारांकडे काय मागवले आणि किती आले.';

  @override
  String get purchaseOrdersNew => 'नवीन खरेदी ऑर्डर';

  @override
  String get purchaseOrdersExpectedOn => 'अपेक्षित तारीख';

  @override
  String get purchaseOrdersOrdered => 'मागवले';

  @override
  String get purchaseOrdersReceived => 'आले';

  @override
  String get purchaseOrdersBilled => 'बिल झाले';

  @override
  String get purchaseOrdersReceive => 'माल स्वीकारा';

  @override
  String get purchaseOrdersBill => 'बिल नोंदवा';

  @override
  String get purchaseOrdersClose => 'ऑर्डर बंद करा';

  @override
  String get purchaseReceiptsTitle => 'इनवर्ड चलन';

  @override
  String get purchaseReceiptsSubtitle =>
      'आलेला माल (जीआरएन). पावतीवर स्टॉक वाढतो; बिल नंतर येते.';

  @override
  String get purchaseReceiptsNew => 'नवे इनवर्ड चलन';

  @override
  String get purchaseReceiptsChallan => 'पुरवठादाराचा चलन क्र.';

  @override
  String get purchaseReceiptsBill => 'बिल नोंदवा';

  @override
  String purchaseReceiptsFromOrder(String number) {
    return 'ऑर्डर $number विरुद्ध';
  }

  @override
  String get purchaseBillsTitle => 'खरेदी बिले';

  @override
  String get purchaseBillsSubtitle =>
      'पुरवठादारांची बीजके. प्रत्येक बिल खरेदी, इनपुट जीएसटी आणि पुरवठादाराच्या खात्यात नोंदवले जाते.';

  @override
  String get purchaseBillsNew => 'नवीन खरेदी बिल';

  @override
  String get purchaseBillsInvoiceNo => 'पुरवठादाराचा बीजक क्र.';

  @override
  String get purchaseBillsInvoiceDate => 'पुरवठादाराच्या बीजकाची तारीख';

  @override
  String get purchaseBillsPostingDate => 'नोंदीची तारीख';

  @override
  String get purchaseBillsDueOn => 'देय तारीख';

  @override
  String get purchaseBillsReverseCharge => 'रिव्हर्स चार्ज (कर आम्ही भरतो)';

  @override
  String get purchaseBillsReturn => 'माल परत करा';

  @override
  String get purchaseBillsReturned => 'परत केले';

  @override
  String get purchaseBillsPost => 'बिल नोंदवा';

  @override
  String purchaseBillsRateWarning(String line) {
    return 'ओळ $line वर बिलाचा दर माल पावतीपेक्षा वेगळा आहे. स्टॉक पावतीच्या दरानेच राहतो.';
  }

  @override
  String get purchaseReturnsTitle => 'खरेदी परतावा';

  @override
  String get purchaseReturnsSubtitle =>
      'पुरवठादारांना परत पाठवलेला माल (डेबिट नोट).';

  @override
  String get purchaseReturnsNew => 'माल परत करा';

  @override
  String get purchaseReturnsReason => 'कारण';

  @override
  String get purchaseReturnsPost => 'डेबिट नोट नोंदवा';

  @override
  String purchaseReturnsBillNo(String number) {
    return 'बिल $number विरुद्ध';
  }

  @override
  String get purchaseErrorsNotASupplier =>
      'विविध घेणेकरी (Sundry Creditors) खालील खाते निवडा.';

  @override
  String get purchaseErrorsUnknownSupplier => 'पुरवठादार निवडा.';

  @override
  String get purchaseErrorsOverReceipt => 'हे ऑर्डरवरील बाकीपेक्षा जास्त आहे.';

  @override
  String get purchaseErrorsOverBilling =>
      'हे आलेल्या आणि अजून बिल न झालेल्या मालापेक्षा जास्त आहे.';

  @override
  String get purchaseErrorsOverReturn =>
      'हे बिल झालेल्या आणि अजून परत न केलेल्या मालापेक्षा जास्त आहे.';

  @override
  String get purchaseErrorsDuplicateSupplierInvoice =>
      'हे पुरवठादार बीजक आधीच नोंदवले आहे.';

  @override
  String get purchaseErrorsBillHasReturns =>
      'आधी या बिलाविरुद्धचे परतावे रद्द करा.';

  @override
  String get purchaseErrorsReceiptIsBilled =>
      'या पावतीचे बिल झाले आहे; आधी बिल रद्द करा.';

  @override
  String get purchaseErrorsOrderHasReceipts =>
      'या ऑर्डरविरुद्ध माल आला आहे; ती बंद करा.';

  @override
  String get purchaseErrorsOrderNotOpen => 'ही ऑर्डर बंद आहे.';

  @override
  String get purchaseErrorsInvoiceAfterPostingDate =>
      'पुरवठादाराच्या बीजकाची तारीख नोंदीच्या तारखेनंतरची असू शकत नाही.';

  @override
  String get purchaseErrorsNoLines => 'किमान एक ओळ जोडा.';

  @override
  String get purchaseErrorsItemArchived => 'एखादी वस्तू संग्रहित आहे.';

  @override
  String get purchaseReadButton => 'बिल वाचा';

  @override
  String get purchaseReadHint =>
      'पुरवठादाराच्या बिलाचा फोटो किंवा PDF: फॉर्म भरला जाईल, तुम्ही तपासा.';

  @override
  String get purchaseReadReading => 'बिल वाचत आहे…';

  @override
  String get purchaseReadDone =>
      'बिलावरून भरले. जतन करण्यापूर्वी प्रत्येक ओळ तपासा.';

  @override
  String purchaseReadUnmatched(String items) {
    return 'यांची वस्तू निवडा: $items.';
  }

  @override
  String get purchaseReadDemo => 'आपोआप वाचणे सुरू केलेले नाही; कृपया बिल भरा.';

  @override
  String get purchaseReadNone => 'हे बिल वाचता आले नाही; कृपया भरा.';

  @override
  String get inventorySettingsTitle => 'मालाची सेटिंग्ज';

  @override
  String get inventorySettingsValuation => 'स्टॉक मूल्यांकन पद्धत';

  @override
  String get inventorySettingsValuationHint =>
      'वापरलेल्या आणि शिल्लक स्टॉकचे मूल्य कसे काढायचे. बदलल्यास सर्व स्टॉकचे सुरुवातीपासून पुन्हा मूल्यांकन होते.';

  @override
  String get inventorySettingsWarehouses => 'गोदामे';

  @override
  String get inventorySettingsAddWarehouse => 'गोदाम जोडा';

  @override
  String get inventorySettingsWarehouseName => 'गोदामाचे नाव';

  @override
  String get inventorySettingsDefault => 'मुख्य';

  @override
  String get inventorySettingsNameTaken => 'या नावाचे गोदाम आधीच आहे.';

  @override
  String get salesCustomer => 'ग्राहक';

  @override
  String get salesChooseCustomer => 'ग्राहक निवडा…';

  @override
  String get salesPlaceOfSupply => 'पुरवठ्याचे ठिकाण';

  @override
  String get salesExport => 'निर्यात';

  @override
  String get salesSez => 'एसईझेड ग्राहक';

  @override
  String get salesLut => 'एलयूटी अंतर्गत (कराशिवाय)';

  @override
  String get salesStatusesDelivered => 'पोहोचवले';

  @override
  String get salesStatusesInvoiced => 'बीजक झाले';

  @override
  String get salesStatusesAccepted => 'स्वीकारले';

  @override
  String get salesStatusesDeclined => 'नाकारले';

  @override
  String get salesStatusesConverted => 'रूपांतरित';

  @override
  String get salesStatusesExpired => 'मुदत संपली';

  @override
  String get salesOrdersTitle => 'विक्री ऑर्डर';

  @override
  String get salesOrdersSubtitle => 'ग्राहकांनी काय मागवले आणि किती गेले.';

  @override
  String get salesOrdersNew => 'नवीन विक्री ऑर्डर';

  @override
  String get salesOrdersDeliverBy => 'पोहोचवण्याची तारीख';

  @override
  String get salesOrdersCustomerRef => 'ग्राहकाचा पीओ क्र.';

  @override
  String get salesOrdersOrdered => 'मागवले';

  @override
  String get salesOrdersDelivered => 'पोहोचवले';

  @override
  String get salesOrdersInvoiced => 'बीजक झाले';

  @override
  String get salesOrdersDeliver => 'माल पोहोचवा';

  @override
  String get salesOrdersInvoice => 'बीजक तयार करा';

  @override
  String get salesOrdersClose => 'ऑर्डर बंद करा';

  @override
  String get salesDeliveriesTitle => 'डिलिव्हरी चलन';

  @override
  String get salesDeliveriesSubtitle =>
      'बीजकापूर्वी (किंवा बीजकाशिवाय) पाठवलेला माल. डिलिव्हरीवर स्टॉक कमी होतो.';

  @override
  String get salesDeliveriesNew => 'नवीन डिलिव्हरी चलन';

  @override
  String get salesDeliveriesInvoice => 'बीजक तयार करा';

  @override
  String salesDeliveriesFromOrder(String number) {
    return 'ऑर्डर $number विरुद्ध';
  }

  @override
  String get salesDeliveriesReason => 'कारण';

  @override
  String get salesDeliveriesValue => 'मूल्य';

  @override
  String get salesDeliveriesTransporter => 'वाहतूकदार';

  @override
  String get salesDeliveriesVehicleNo => 'वाहन क्र.';

  @override
  String get salesDeliveriesPrint => 'चलन छापा (3 प्रती)';

  @override
  String salesDeliveriesInvoiceBy(String date) {
    return '$date पर्यंत इनव्हॉइस';
  }

  @override
  String salesDeliveriesReturnsMade(num count, String dates) {
    return 'माल $count वेळा परत आला: $dates';
  }

  @override
  String get salesDeliveriesTakeBack => 'माल परत घ्या';

  @override
  String get salesDeliveriesStillOut => 'अजून बाहेर';

  @override
  String get salesDeliveriesCameBack => 'परत आला';

  @override
  String get salesDeliveriesSaveReturn => 'परतावा जतन करा';

  @override
  String get salesDeliveriesNewApproval => 'नवीन मंजुरी मेमो';

  @override
  String get salesDeliveriesReasonsSupply => 'पुरवठा, इनव्हॉइस नंतर';

  @override
  String get salesDeliveriesReasonsApproval => 'मंजुरीवर विक्री';

  @override
  String get salesDeliveriesReasonsJobWork => 'जॉब वर्क';

  @override
  String get salesDeliveriesReasonsNotSupply =>
      'पुरवठा नाही (स्वतःचा वापर, दुरुस्ती)';

  @override
  String get salesDeliveriesReasonsLots => 'हप्त्यांत पुरवठा';

  @override
  String get salesDeliveriesReasonsExhibition => 'प्रदर्शन किंवा जत्रा';

  @override
  String get salesDeliveriesReasonsOther => 'इतर';

  @override
  String get salesDeliveriesReasonsSample => 'सॅम्पल';

  @override
  String get salesDeliveriesReasonHintsSupply => 'माल विकला; कर इनव्हॉइस नंतर.';

  @override
  String get salesDeliveriesReasonHintsApproval =>
      'ग्राहक विकले जाईल ते ठेवतो. सहा महिन्यांत इनव्हॉइस करा किंवा माल परत घ्या.';

  @override
  String get salesDeliveriesReasonHintsJobWork =>
      'प्रक्रियेसाठी पाठवला; माल परत येईल.';

  @override
  String get salesDeliveriesReasonHintsNotSupply =>
      'विक्रीशिवाय माल जातो, म्हणून कर दाखवला जात नाही.';

  @override
  String get salesDeliveriesReasonHintsLots => 'एक पुरवठा अनेक हप्त्यांत.';

  @override
  String get salesDeliveriesReasonHintsExhibition =>
      'प्रदर्शनात दाखवला; न विकलेला माल परत येईल.';

  @override
  String get salesDeliveriesReasonHintsOther => 'मालाची इतर कोणतीही हालचाल.';

  @override
  String get salesDeliveriesReasonHintsSample =>
      'दाखवण्यासाठी किंवा वापरून पाहण्यासाठी पाठवले; विक्री नाही, म्हणून कर दिसत नाही. न ठेवलेले नग परताव्यावर परत येतात.';

  @override
  String get salesInvoicesTitle => 'विक्री बीजके';

  @override
  String get salesInvoicesSubtitle =>
      'कर बीजके. प्रत्येक बीजक विक्री, आउटपुट जीएसटी आणि ग्राहकाच्या खात्यात नोंदवले जाते.';

  @override
  String get salesInvoicesNew => 'नवीन बीजक';

  @override
  String get salesInvoicesDueOn => 'देय तारीख';

  @override
  String get salesInvoicesPost => 'बीजक जतन करा';

  @override
  String get salesInvoicesPrint => 'छापा';

  @override
  String get salesInvoicesCreditNote => 'क्रेडिट नोट / परतावा';

  @override
  String get salesInvoicesReturned => 'परत आले';

  @override
  String salesInvoicesWarningsCreditLimitExceeded(String detail) {
    return 'यामुळे ग्राहक उधारी मर्यादेपलीकडे जातो ($detail बाकी).';
  }

  @override
  String salesInvoicesWarningsEwayBillRequired(String detail) {
    return '$detail चा माल: हलवण्यापूर्वी ई-वे बिल आवश्यक.';
  }

  @override
  String salesInvoicesWarningsMissingHsn(String lineNo) {
    return 'ओळ $lineNo ला एचएसएन कोड नाही; कर बीजकावर तो आवश्यक आहे.';
  }

  @override
  String get salesInvoicesWarningsNegativeStock =>
      'काही स्टॉक शून्याखाली गेला. खरेदीची नोंद राहिली आहे का ते तपासा.';

  @override
  String salesInvoicesWarningsOverdueBills(String days) {
    return 'या ग्राहकाचे एक बिल $days दिवस थकीत आहे.';
  }

  @override
  String get salesCreditNotesTitle => 'क्रेडिट नोट';

  @override
  String get salesCreditNotesSubtitle =>
      'विक्री परतावा आणि विक्रीनंतरची किंमत कपात.';

  @override
  String get salesCreditNotesNew => 'क्रेडिट नोट';

  @override
  String get salesCreditNotesReason => 'कारण';

  @override
  String get salesCreditNotesGoodsReturned => 'माल स्टॉकमध्ये परत आला';

  @override
  String get salesCreditNotesPriceReduction => 'फक्त किंमत कपात (माल परत नाही)';

  @override
  String get salesCreditNotesCreditRate => 'प्रति एकक क्रेडिट';

  @override
  String get salesCreditNotesPost => 'क्रेडिट नोट नोंदवा';

  @override
  String salesCreditNotesAgainstInvoice(String number) {
    return 'बीजक $number विरुद्ध';
  }

  @override
  String get salesErrorsNotACustomer =>
      'विविध देणेकरी (Sundry Debtors) खालील खाते निवडा.';

  @override
  String get salesErrorsUnknownCustomer => 'ग्राहक निवडा.';

  @override
  String get salesErrorsOverDelivery => 'हे ऑर्डरवरील बाकीपेक्षा जास्त आहे.';

  @override
  String get salesErrorsOverInvoicing =>
      'हे पोहोचवलेल्या आणि अजून बीजक न झालेल्या मालापेक्षा जास्त आहे.';

  @override
  String get salesErrorsOverReturn => 'बाहेर आहे त्यापेक्षा जास्त परत येत आहे.';

  @override
  String get salesErrorsInvoiceHasCreditNotes =>
      'आधी या बीजकाविरुद्धच्या क्रेडिट नोट रद्द करा.';

  @override
  String get salesErrorsDeliveryIsInvoiced =>
      'या चलनाचे बीजक झाले आहे; आधी बीजक रद्द करा.';

  @override
  String get salesErrorsOrderHasDeliveries =>
      'या ऑर्डरविरुद्ध माल गेला आहे; ती बंद करा.';

  @override
  String get salesErrorsCancelIrnFirst => 'आधी ई-इनव्हॉइस (आयआरएन) रद्द करा.';

  @override
  String get salesErrorsCreditAboveInvoiceRate =>
      'क्रेडिट बीजकाच्या दरापेक्षा जास्त असू शकत नाही.';

  @override
  String get salesErrorsRateRequired => 'प्रति एकक क्रेडिट टाका.';

  @override
  String get salesErrorsQuotationNotOpen =>
      'हे कोटेशन आधीच रूपांतरित किंवा बंद झाले आहे.';

  @override
  String get salesErrorsQuotationConverted =>
      'हे कोटेशन रूपांतरित झाले आहे; आधी त्यावरून बनवलेली ऑर्डर किंवा बीजक रद्द करा.';

  @override
  String get salesErrorsQuotationCustomerMismatch =>
      'हे कोटेशन वेगळ्या ग्राहकासाठी आहे.';

  @override
  String get salesErrorsValidUntilBeforeDate =>
      '“पर्यंत वैध” कोटेशनच्या तारखेपूर्वीचे असू शकत नाही.';

  @override
  String get salesErrorsCancelEwbFirst => 'आधी ई-वे बिल रद्द करा.';

  @override
  String get salesErrorsGstr1FiledForPeriod =>
      'या महिन्याचा GSTR-1 आधीच भरला आहे. चालू महिन्याची तारीख द्या, किंवा जीएसटी पोर्टलवर सुधारणा करा.';

  @override
  String get salesErrorsAdvanceMoreThanTotal =>
      'आगाऊ रक्कम एकूणपेक्षा जास्त असू शकत नाही.';

  @override
  String get salesErrorsDeliveryHasReturns =>
      'या चलनावर माल परत आला आहे, त्यामुळे रद्द करता येत नाही.';

  @override
  String get salesErrorsReturnBeforeChallan =>
      'परताव्याची तारीख चलनाच्या तारखेपूर्वी आहे.';

  @override
  String get salesErrorsDeliveryCancelled => 'हे चलन रद्द आहे.';

  @override
  String get salesErrorsUnknownDeliveryLine => 'ही ओळ या चलनावर नाही.';

  @override
  String get salesErrorsCreditBlocked =>
      'ही विक्री ग्राहकाला क्रेडिट मर्यादेपलीकडे नेते आणि त्यांचे खाते ब्लॉकवर आहे.';

  @override
  String get salesErrorsOverdueBlocked =>
      'या ग्राहकाचे एक बिल परवानगीपेक्षा जास्त काळ थकीत आहे आणि त्यांचे खाते ब्लॉकवर आहे.';

  @override
  String get salesErrorsOverrideNotAllowed =>
      'फक्त मालक किंवा अॅडमिन क्रेडिट ब्लॉक ओलांडू शकतात.';

  @override
  String get salesErrorsNotAnAgent =>
      'दलाल किंवा एजंट म्हणून खूण केलेले खाते निवडा.';

  @override
  String get salesErrorsUnknownSalesman =>
      'तुमच्या कर्मचाऱ्यांमधून सेल्समन निवडा.';

  @override
  String get salesErrorsUnknownOrder => 'ती ऑर्डर सापडली नाही.';

  @override
  String get salesQuotationsTitle => 'कोटेशन';

  @override
  String get salesQuotationsSubtitle =>
      'ग्राहकांसाठी किमतीचे प्रस्ताव. रूपांतरित होईपर्यंत स्टॉक किंवा हिशेबावर परिणाम नाही.';

  @override
  String get salesQuotationsNew => 'नवीन कोटेशन';

  @override
  String get salesQuotationsSave => 'कोटेशन जतन करा';

  @override
  String get salesQuotationsValidUntil => 'पर्यंत वैध';

  @override
  String get salesQuotationsToOrder => 'ऑर्डरमध्ये रूपांतर करा';

  @override
  String get salesQuotationsToInvoice => 'बीजकात रूपांतर करा';

  @override
  String get salesQuotationsAccept => 'स्वीकारले म्हणून चिन्हांकित करा';

  @override
  String get salesQuotationsDecline => 'नाकारले म्हणून चिन्हांकित करा';

  @override
  String get salesQuotationsPrint => 'छापा / PDF';

  @override
  String salesQuotationsConvertedTo(String order, String invoice, String kind) {
    String _temp0 = intl.Intl.selectLogic(kind, {
      'order': 'ऑर्डरमध्ये',
      'other': 'बीजकात',
    });
    return '$_temp0 रूपांतरित';
  }

  @override
  String salesQuotationsFromQuotation(String number) {
    return 'कोटेशन $number वरून';
  }

  @override
  String get salesQuotationsTerms => 'अटी';

  @override
  String get salesProformasTitle => 'प्रोफॉर्मा इनव्हॉइस';

  @override
  String get salesProformasSubtitle =>
      'माल पाठवण्यापूर्वी पेमेंट किंवा आगाऊ रक्कम मागा. इनव्हॉइसपर्यंत कर किंवा स्टॉकवर परिणाम नाही.';

  @override
  String get salesProformasNew => 'नवीन प्रोफॉर्मा इनव्हॉइस';

  @override
  String get salesProformasSave => 'प्रोफॉर्मा जतन करा';

  @override
  String get salesProformasAdvanceDue => 'मागितलेली आगाऊ रक्कम';

  @override
  String get salesProformasAdvanceHint => 'पूर्ण रक्कम मागण्यासाठी रिकामे ठेवा';

  @override
  String get salesApprovalsTitle => 'मंजुरीवरील माल';

  @override
  String get salesApprovalsSubtitle =>
      'ज्यांचा माल अजून ग्राहकाकडे आहे असे मंजुरी मेमो. न विकलेला माल परत घ्या; बाकीचे सहा महिन्यांत इनव्हॉइस करा.';

  @override
  String salesApprovalsSummary(num count, String value) {
    return '$count मेमो उघडे, मूल्य $value';
  }

  @override
  String get salesApprovalsDaysOut => 'बाहेरचे दिवस';

  @override
  String salesApprovalsDaysLeft(num days) {
    return '$days दिवस बाकी';
  }

  @override
  String get salesApprovalsEmpty => 'मंजुरीवर कोणताही माल बाहेर नाही.';

  @override
  String get salesOverrideCredit => 'परवानगी देऊन जतन करा';

  @override
  String get salesSamplesTitle => 'बाहेर गेलेले सॅम्पल';

  @override
  String get salesSamplesSubtitle =>
      'पक्षांना पाठवलेले पण अजून परत न आलेले सॅम्पल. ही विक्री नाही आणि यावर कर नाही. जे ठेवले जात नाही ते परत घ्या.';

  @override
  String salesSamplesSummary(num count, String pieces) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count चलन',
      one: '$count चलन',
    );
    return '$_temp0 मध्ये $pieces नग अजून बाहेर';
  }

  @override
  String get salesSamplesNew => 'नवीन सॅम्पल चलन';

  @override
  String get salesSamplesEmpty => 'कोणतेही सॅम्पल बाहेर नाही.';

  @override
  String get einvoiceTitle => 'ई-इनव्हॉइस';

  @override
  String get einvoiceStatusNotRequired => 'आवश्यक नाही';

  @override
  String get einvoiceStatusPending => 'आयआरएन प्रलंबित';

  @override
  String get einvoiceStatusGenerated => 'आयआरएन तयार';

  @override
  String get einvoiceStatusCancelled => 'आयआरएन रद्द';

  @override
  String get einvoiceStatusFailed => 'आयआरएन अयशस्वी';

  @override
  String get einvoiceGenerate => 'आयआरएन तयार करा';

  @override
  String get einvoiceCancel => 'आयआरएन रद्द करा';

  @override
  String get einvoiceCancelHint =>
      'आयआरएन तयार झाल्यापासून 24 तासांतच रद्द करता येतो.';

  @override
  String get einvoiceReasons1 => 'दुहेरी';

  @override
  String get einvoiceReasons2 => 'नोंदीतील चूक';

  @override
  String get einvoiceReasons3 => 'ऑर्डर रद्द';

  @override
  String get einvoiceReasons4 => 'इतर';

  @override
  String get einvoiceRemark => 'शेरा';

  @override
  String get einvoiceIrn => 'आयआरएन';

  @override
  String get einvoiceAckNo => 'पोच क्र.';

  @override
  String get einvoiceAckDate => 'पोच तारीख';

  @override
  String get einvoiceSimulator =>
      'चाचणी मोड: जीएसटी प्रदाता जोडेपर्यंत आयआरएन अंगभूत सिम्युलेटरकडून येतात.';

  @override
  String get einvoiceErrorsEinvoiceBuyerGstinRequired =>
      'ग्राहकाचा जीएसटीआयएन नाही; ई-इनव्हॉइस फक्त नोंदणीकृत खरेदीदार आणि निर्यातीसाठी आहेत.';

  @override
  String get einvoiceErrorsEinvoiceInvalidDocNumber =>
      'हा बीजक क्रमांक आयआरपीसाठी वैध नाही.';

  @override
  String get einvoiceErrorsEinvoiceInvalidPincode =>
      'ग्राहक आणि तुमच्या शाखेचा वैध पिन कोड जोडा.';

  @override
  String get einvoiceErrorsEinvoiceAddressRequired =>
      'ग्राहक आणि तुमच्या शाखेचे पत्ते जोडा.';

  @override
  String get einvoiceErrorsEinvoiceInvalidHsn =>
      'प्रत्येक वस्तूला एचएसएन कोड हवा.';

  @override
  String get einvoiceErrorsEinvoiceTotalsMismatch => 'बेरजा जुळत नाहीत.';

  @override
  String get einvoiceErrorsBranchGstinRequired =>
      'आधी तुमच्या शाखेचा जीएसटीआयएन जोडा.';

  @override
  String get einvoiceErrorsDuplicateIrn => 'आयआरपीकडे हे बीजक आधीच आहे.';

  @override
  String get einvoiceErrorsIrnCancelWindowPassed =>
      'हा आयआरएन रद्द करण्याचे 24 तास उलटले. त्याऐवजी क्रेडिट नोट द्या.';

  @override
  String get einvoiceErrorsIrnAlreadyGenerated => 'आयआरएन आधीच तयार झाला आहे.';

  @override
  String get einvoiceErrorsCancelEwbFirst => 'आधी ई-वे बिल रद्द करा.';

  @override
  String get ewbTitle => 'ई-वे बिल';

  @override
  String get ewbGenerate => 'ई-वे बिल तयार करा';

  @override
  String get ewbVehicleNo => 'वाहन क्र.';

  @override
  String get ewbDistance => 'अंतर (किमी)';

  @override
  String get ewbNumber => 'ईडब्ल्यूबी क्र.';

  @override
  String get ewbValidUpto => 'पर्यंत वैध';

  @override
  String get ewbErrorsInvalidVehicleNo =>
      'हा वाहन क्रमांक वाटत नाही (उदा. MH12AB1234).';

  @override
  String get ewbErrorsInvalidDistance => 'अंतर किमीमध्ये टाका.';

  @override
  String get ewbErrorsEwbExtensionWindow =>
      'ई-वे बिलाची मुदत संपण्यापूर्वी 8 तास ते संपल्यानंतर 8 तासांतच वाढवता येते.';

  @override
  String get ewbErrorsEwbCancelWindowPassed =>
      'हे ई-वे बिल रद्द करण्याचे 24 तास उलटले.';

  @override
  String get ewbErrorsEwbExpired => 'या ई-वे बिलाची मुदत संपली; मुदत वाढवा.';

  @override
  String get ewbErrorsNoActiveEwb => 'या बीजकावर सक्रिय ई-वे बिल नाही.';

  @override
  String get ewbErrorsEwbAlreadyGenerated =>
      'या बीजकावर ई-वे बिल आधीच सक्रिय आहे.';

  @override
  String get ewbErrorsInvalidPincode => '6 अंकी पिन कोड टाका.';

  @override
  String get ewbStatusActive => 'सक्रिय';

  @override
  String get ewbStatusCancelled => 'रद्द';

  @override
  String get ewbChangeVehicle => 'वाहन बदला';

  @override
  String get ewbExtend => 'मुदत वाढवा';

  @override
  String get ewbCancel => 'ई-वे बिल रद्द करा';

  @override
  String get ewbNewVehicle => 'नवीन वाहन क्र.';

  @override
  String get ewbCurrentPlace => 'सध्याचे ठिकाण';

  @override
  String get ewbCurrentPincode => 'सध्याचा पिन कोड';

  @override
  String get ewbRemainingKm => 'उरलेले अंतर (किमी)';

  @override
  String get ewbReason => 'कारण';

  @override
  String get ewbRemark => 'शेरा';

  @override
  String get ewbSave => 'जतन करा';

  @override
  String get ewbExtendHint =>
      'ई-वे बिलाची मुदत संपण्यापूर्वी 8 तास ते संपल्यानंतर 8 तासांपर्यंत परवानगी.';

  @override
  String get ewbCancelHint =>
      'तयार झाल्यापासून 24 तासांत, माल हलला नसल्यास परवानगी.';

  @override
  String ewbCancelledNote(String number) {
    return 'ई-वे बिल $number रद्द झाले. तुम्ही नवीन तयार करू शकता.';
  }

  @override
  String get ewbVehicleReasons1 => 'वाहन बिघाड';

  @override
  String get ewbVehicleReasons2 => 'मालवाहतूक बदल';

  @override
  String get ewbVehicleReasons3 => 'इतर';

  @override
  String get ewbVehicleReasons4 => 'पहिल्यांदा';

  @override
  String get ewbExtendReasons1 => 'नैसर्गिक आपत्ती';

  @override
  String get ewbExtendReasons2 => 'कायदा व सुव्यवस्था';

  @override
  String get ewbExtendReasons4 => 'मालवाहतूक बदल';

  @override
  String get ewbExtendReasons5 => 'अपघात';

  @override
  String get ewbExtendReasons99 => 'इतर';

  @override
  String get ewbCancelReasons1 => 'दुहेरी';

  @override
  String get ewbCancelReasons2 => 'ऑर्डर रद्द';

  @override
  String get ewbCancelReasons3 => 'नोंदीतील चूक';

  @override
  String get ewbCancelReasons4 => 'इतर';

  @override
  String get printTaxInvoice => 'कर बीजक';

  @override
  String get printCreditNote => 'क्रेडिट नोट';

  @override
  String get printOriginal => 'प्राप्तकर्त्यासाठी मूळ प्रत';

  @override
  String get printBillTo => 'बिल यांना';

  @override
  String get printShipTo => 'माल यांना';

  @override
  String get printInvoiceNo => 'बीजक क्र.';

  @override
  String get printInvoiceDate => 'बीजक तारीख';

  @override
  String get printSno => '#';

  @override
  String get printHsn => 'एचएसएन/एसएसी';

  @override
  String get printTaxSummary => 'कर सारांश';

  @override
  String get printRate => 'दर';

  @override
  String get printAmountInWords => 'रक्कम अक्षरी';

  @override
  String get printBank => 'बँक तपशील';

  @override
  String get printTerms => 'अटी व शर्ती';

  @override
  String printForCompany(String company) {
    return '$company करिता';
  }

  @override
  String get printSignatory => 'अधिकृत स्वाक्षरीकर्ता';

  @override
  String get printComputerGenerated => 'हे संगणकाद्वारे तयार केलेले बीजक आहे.';

  @override
  String get printReverseCharge => 'रिव्हर्स चार्जवर देय कर';

  @override
  String get printExportLut =>
      'आयजीएसटी न भरता एलयूटी अंतर्गत निर्यातीसाठीचा पुरवठा';

  @override
  String get printQuotation => 'कोटेशन';

  @override
  String get printQuotationNo => 'कोटेशन क्र.';

  @override
  String get printQuotationDate => 'कोटेशन तारीख';

  @override
  String get printQuotedTo => 'यांना कोटेशन';

  @override
  String get printComputerGeneratedQuote =>
      'हे संगणकाद्वारे तयार केलेले कोटेशन आहे. दिलेल्या तारखेपर्यंत किमती वैध आहेत.';

  @override
  String get printProforma => 'प्रोफॉर्मा इनव्हॉइस';

  @override
  String get printProformaNo => 'प्रोफॉर्मा क्र.';

  @override
  String get printProformaDate => 'प्रोफॉर्मा तारीख';

  @override
  String get printComputerGeneratedProforma =>
      'हे प्रोफॉर्मा इनव्हॉइस आहे, कर इनव्हॉइस नाही. पुरवठ्यावर कर इनव्हॉइस दिले जाईल.';

  @override
  String get printDeliveryChallan => 'डिलिव्हरी चलन';

  @override
  String get printApprovalMemo => 'मंजुरी मेमो';

  @override
  String get printCopyConsignee => 'मूळ प्रत प्राप्तकर्त्यासाठी';

  @override
  String get printCopyTransporter => 'दुसरी प्रत वाहतूकदारासाठी';

  @override
  String get printCopyConsignor => 'तिसरी प्रत पाठवणाऱ्यासाठी';

  @override
  String get printConsignee => 'प्राप्तकर्ता';

  @override
  String get printChallanNo => 'चलन क्र.';

  @override
  String get printChallanDate => 'चलन तारीख';

  @override
  String get printInvoiceBy => 'इनव्हॉइसची अंतिम तारीख';

  @override
  String get printValue => 'मूल्य';

  @override
  String get printNotASupply =>
      'माल पुरवठ्याव्यतिरिक्त कारणासाठी पाठवला. या चलनावर कर नाही.';

  @override
  String get printReceivedBy => 'स्वीकारणारा';

  @override
  String get printSignatureAndDate => 'सही आणि तारीख';

  @override
  String get outstandingReceivablesTitle => 'येणे बाकी';

  @override
  String get outstandingReceivablesSubtitle =>
      'ग्राहकांकडून येणे, वयानुसार. पावत्या आधी सर्वात जुनी बिले भरतात.';

  @override
  String get outstandingPayablesTitle => 'देणे बाकी';

  @override
  String get outstandingPayablesSubtitle =>
      'पुरवठादारांना देणे, वयानुसार. भरणा आधी सर्वात जुनी बिले भरतो.';

  @override
  String get outstandingParty => 'पक्ष';

  @override
  String get outstandingBalance => 'शिल्लक';

  @override
  String get outstandingNotDue => 'अजून देय नाही';

  @override
  String get outstandingD030 => '1-30 दिवस';

  @override
  String get outstandingD3160 => '31-60 दिवस';

  @override
  String get outstandingD6190 => '61-90 दिवस';

  @override
  String get outstandingAdvance => 'आगाऊ';

  @override
  String get outstandingOpenItems => 'खुली बिले';

  @override
  String outstandingOverdue(String due, num days) {
    String _temp0 = intl.Intl.pluralLogic(
      days,
      locale: localeName,
      other: '$days दिवस थकीत',
      one: '$days दिवस थकीत',
      zero: 'देय',
    );
    return '$_temp0';
  }

  @override
  String get outstandingNone => 'काहीही बाकी नाही.';

  @override
  String get outstandingD91180 => '91 ते 180 दिवस';

  @override
  String get outstandingD180plus => '180 दिवसांपेक्षा जास्त';

  @override
  String get returnsTitle => 'जीएसटी रिटर्न';

  @override
  String get returnsSubtitle =>
      'तुमच्या बीजक आणि बिलांवरून GSTR-1 आणि GSTR-3B. येथे भरा, किंवा जीएसटी पोर्टलच्या ऑफलाइन साधनासाठी JSON डाउनलोड करा.';

  @override
  String get returnsPeriod => 'कर कालावधी';

  @override
  String get returnsGstr1 => 'GSTR-1';

  @override
  String get returnsGstr3b => 'GSTR-3B';

  @override
  String get returnsDownload => 'JSON डाउनलोड करा';

  @override
  String get returnsSection => 'विभाग';

  @override
  String get returnsCount => 'बीजके';

  @override
  String get returnsTaxable => 'करपात्र मूल्य';

  @override
  String get returnsTax => 'कर';

  @override
  String get returnsB2b => 'B2B: नोंदणीकृत ग्राहक';

  @override
  String get returnsB2cl => 'B2C मोठे: इतर राज्य, ₹1 लाखापेक्षा जास्त';

  @override
  String get returnsB2cs => 'B2C लहान';

  @override
  String get returnsExp => 'निर्यात';

  @override
  String get returnsCdn => 'क्रेडिट नोट';

  @override
  String get returnsCancelled => 'रद्द बीजके (दस्तऐवज सारांशात)';

  @override
  String get returnsOutward => '3.1(a) जावक करपात्र पुरवठा';

  @override
  String get returnsZeroRated => '3.1(b) शून्य दर (निर्यात, एसईझेड)';

  @override
  String get returnsNil => '3.1(c) शून्य दर / सवलतप्राप्त';

  @override
  String get returnsRcm => '3.1(d) रिव्हर्स चार्जवरील आवक पुरवठा';

  @override
  String get returnsItc => '4. इनपुट कर क्रेडिट';

  @override
  String get returnsSetOff => '6.1 कराचा भरणा';

  @override
  String get returnsHead => 'कर प्रकार';

  @override
  String get returnsLiability => 'देय कर';

  @override
  String get returnsPaidByCredit => 'क्रेडिटने भरले';

  @override
  String get returnsCash => 'रोखीने भरा';

  @override
  String get returnsCarryForward => 'पुढे नेलेले क्रेडिट';

  @override
  String get returnsFilingNote =>
      'रिटर्न तुमच्या जीएसटी प्रदात्यामार्फत भरले जातात. प्रदाता जोडेपर्यंत चाचणी मोड अंगभूत सिम्युलेटर वापरतो.';

  @override
  String get gstSettingsTitle => 'जीएसटी आणि बीजक';

  @override
  String get gstSettingsEinvoice => 'ई-इनव्हॉइस (आयआरएन) तयार करा';

  @override
  String get gstSettingsEinvoiceHint =>
      '2017-18 पासून कोणत्याही वर्षी उलाढाल ₹5 कोटी ओलांडल्यावर बंधनकारक.';

  @override
  String get gstSettingsEwbThreshold => 'यापेक्षा जास्त मूल्यावर ई-वे बिल (₹)';

  @override
  String get gstSettingsBilingual =>
      'बीजके, वेतन पावत्या आणि फॉर्म 16 दोन भाषांत छापा';

  @override
  String get gstSettingsPrintLanguage => 'छपाईची दुसरी भाषा';

  @override
  String get gstSettingsTerms => 'बीजकाच्या अटी व शर्ती';

  @override
  String get gstSettingsBank => 'बीजकावरील बँक तपशील';

  @override
  String get importTitle => 'डेटा आयात';

  @override
  String get importSubtitle =>
      'स्प्रेडशीट किंवा Tally मधून ग्राहक, पुरवठादार आणि वस्तू आणा.';

  @override
  String get importParties => 'ग्राहक आणि पुरवठादार (CSV)';

  @override
  String get importItems => 'वस्तू (CSV)';

  @override
  String get importTally => 'Tally XML';

  @override
  String get importTemplate => 'नमुना CSV डाउनलोड करा';

  @override
  String get importTallyHint =>
      'Tally मध्ये: Display → List of Accounts → Alt+E (Export), XML स्वरूप. स्टॉक वस्तूही समाविष्ट करा.';

  @override
  String get importChoose => 'फाइल निवडा';

  @override
  String get importPreview => 'फाइल तपासा';

  @override
  String importCommit(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ओळी',
      one: '$count ओळ',
    );
    return '$_temp0 आयात करा';
  }

  @override
  String get importRow => 'ओळ';

  @override
  String get importStatus => 'निकाल';

  @override
  String get importCreate => 'तयार होईल';

  @override
  String get importExists => 'आधीच आहे: वगळले';

  @override
  String get importDone => 'आयात झाले.';

  @override
  String get filingTitle => 'जीएसटी पोर्टलवर भरा';

  @override
  String get filingPortal => 'जीएसटी पोर्टल जोडणी';

  @override
  String get filingPortalHint =>
      'आधी तुमच्या जीएसटी पोर्टल प्रोफाइलमध्ये “API access” सुरू करा. सत्र सुमारे 6 तास टिकते.';

  @override
  String get filingUsername => 'जीएसटी पोर्टल वापरकर्तानाव';

  @override
  String get filingSendOtp => 'ओटीपी पाठवा';

  @override
  String get filingOtp => 'ओटीपी';

  @override
  String get filingConnect => 'जोडा';

  @override
  String filingConnected(String username, String time) {
    return '$username म्हणून $time पर्यंत जोडलेले';
  }

  @override
  String get filingDisconnect => 'जोडणी काढा';

  @override
  String filingSimulatorOtp(String otp) {
    return 'चाचणी मोड: ओटीपी $otp आहे.';
  }

  @override
  String get filingUpload => 'अपलोड करा';

  @override
  String get filingUploadAgain => 'पुन्हा अपलोड करा';

  @override
  String filingUploaded(String time) {
    return '$time ला अपलोड झाले';
  }

  @override
  String get filingGetOtp => 'ईव्हीसी ओटीपी पाठवा';

  @override
  String get filingEvcHint =>
      'ओटीपी तुमच्या अधिकृत स्वाक्षरीकर्त्याच्या मोबाइलवर जातो.';

  @override
  String get filingFile => 'ईव्हीसीने भरा';

  @override
  String filingFiled(String time) {
    return '$time ला भरले';
  }

  @override
  String get filingArn => 'एआरएन';

  @override
  String get filingNotUploaded => 'अपलोड झाले नाही';

  @override
  String get filingLocked =>
      'एखाद्या महिन्याचा GSTR-1 भरल्यावर त्या महिन्याची बीजके आणि क्रेडिट नोट बंद होतात.';

  @override
  String filingCashNote(String amount) {
    return 'भरण्यापूर्वी तुमच्या इलेक्ट्रॉनिक रोख खतावणीत $amount ठेवा (जीएसटी पोर्टलवर चलन).';
  }

  @override
  String get filingErrorsGstSessionRequired => 'आधी जीएसटी पोर्टलशी जोडा.';

  @override
  String get filingErrorsGstSessionExpired =>
      'जीएसटी पोर्टल सत्र संपले. पुन्हा जोडा.';

  @override
  String get filingErrorsInvalidOtp => 'हा ओटीपी बरोबर नाही.';

  @override
  String get filingErrorsInvalidPortalUsername =>
      'तुमचे जीएसटी पोर्टल वापरकर्तानाव टाका.';

  @override
  String get filingErrorsUploadFirst => 'आधी रिटर्न अपलोड करा.';

  @override
  String get filingErrorsBooksChangedSinceUpload =>
      'अपलोडनंतर तुमच्या हिशेबात बदल झाले. पुन्हा अपलोड करा, मग भरा.';

  @override
  String get filingErrorsReturnAlreadyFiled => 'हा रिटर्न आधीच भरला आहे.';

  @override
  String get filingErrorsCompanyPanRequired =>
      'कंपनी आणि शाखा मध्ये व्यवसायाचा पॅन जोडा.';

  @override
  String get filingErrorsInvalidPan => 'व्यवसायाचा पॅन वैध नाही.';

  @override
  String get filingErrorsBranchGstinRequired =>
      'आधी मुख्य कार्यालयाचा जीएसटीआयएन जोडा.';

  @override
  String get hrEmployeesTitle => 'कर्मचारी';

  @override
  String get hrEmployeesSubtitle =>
      'तुमची टीम, त्यांचे वेतन आणि वैधानिक तपशील.';

  @override
  String get hrEmployeesNew => 'कर्मचारी जोडा';

  @override
  String get hrEmployeesNone => 'अजून कर्मचारी नाहीत.';

  @override
  String get hrSectionsPersonal => 'वैयक्तिक';

  @override
  String get hrSectionsJob => 'नोकरी';

  @override
  String get hrSectionsStatutory => 'पीएफ, ईएसआय आणि कर';

  @override
  String get hrSectionsBank => 'वेतन भरणा';

  @override
  String get hrSectionsSalary => 'वेतन रचना';

  @override
  String get hrCode => 'कर्मचारी कोड';

  @override
  String get hrCodeHint => 'आपोआप क्रमांकासाठी रिकामे ठेवा';

  @override
  String get hrName => 'पूर्ण नाव';

  @override
  String get hrNameHi => 'हिंदीत नाव (ऐच्छिक)';

  @override
  String get hrGender => 'लिंग';

  @override
  String get hrGendersMale => 'पुरुष';

  @override
  String get hrGendersFemale => 'स्त्री';

  @override
  String get hrGendersOther => 'इतर';

  @override
  String get hrDob => 'जन्मतारीख';

  @override
  String get hrJoinedOn => 'रुजू तारीख';

  @override
  String get hrLeftOn => 'सोडल्याची तारीख';

  @override
  String get hrFixedTerm => 'ठराविक मुदतीचा कर्मचारी';

  @override
  String get hrDepartment => 'विभाग';

  @override
  String get hrDesignation => 'पद';

  @override
  String get hrWorkState => 'कामाचे राज्य';

  @override
  String get hrWorkStateHint => 'यावरून व्यवसाय कर ठरतो';

  @override
  String get hrPhone => 'मोबाइल';

  @override
  String get hrEmail => 'ईमेल';

  @override
  String get hrAddress => 'पत्ता';

  @override
  String get hrCity => 'शहर';

  @override
  String get hrPincode => 'पिन कोड';

  @override
  String get hrPan => 'पॅन';

  @override
  String get hrAadhaarLast4 => 'आधार (फक्त शेवटचे 4 अंक)';

  @override
  String get hrUan => 'यूएएन';

  @override
  String get hrEsiNumber => 'ईएसआय आयपी क्रमांक';

  @override
  String get hrPfMember => 'पीएफ सदस्य';

  @override
  String get hrEpsEligible => 'पेन्शन योजनेत (ईपीएस)';

  @override
  String get hrPfOnActual => 'पूर्ण वेतनावर पीएफ (₹15,000 पेक्षा जास्त)';

  @override
  String get hrDisabled => 'दिव्यांग व्यक्ती (₹25,000 पर्यंत ईएसआय)';

  @override
  String get hrTaxRegime => 'कर प्रणाली';

  @override
  String get hrRegimesNew => 'नवी प्रणाली';

  @override
  String get hrRegimesOld => 'जुनी प्रणाली';

  @override
  String get hrMetro => 'महानगरात राहतात (एचआरएसाठी)';

  @override
  String get hrPaymentMode => 'भरणा पद्धत';

  @override
  String get hrPaymentModesBank => 'बँक हस्तांतरण';

  @override
  String get hrPaymentModesCash => 'रोख';

  @override
  String get hrPaymentModesCheque => 'धनादेश';

  @override
  String get hrBankName => 'बँक';

  @override
  String get hrBankIfsc => 'आयएफएससी';

  @override
  String get hrBankAccount => 'खाते क्रमांक';

  @override
  String hrBankAccountHint(String last4) {
    return 'सांकेतिक स्वरूपात जतन. नोंदीत: शेवटचे $last4';
  }

  @override
  String get hrMonthlyGross => 'मासिक एकूण वेतन';

  @override
  String get hrStatus => 'स्थिती';

  @override
  String get hrStatusesActive => 'सक्रिय';

  @override
  String get hrStatusesLeft => 'सोडले';

  @override
  String get hrSave => 'जतन करा';

  @override
  String get hrSaved => 'जतन झाले';

  @override
  String get hrCreate => 'कर्मचारी जोडा';

  @override
  String get hrSalaryTitle => 'वेतन रचना';

  @override
  String get hrSalaryEffectiveFrom => 'पासून लागू';

  @override
  String get hrSalaryComponent => 'घटक';

  @override
  String get hrSalaryMonthly => 'मासिक (₹)';

  @override
  String get hrSalaryPfWage => 'मूळ/महागाई भत्ता (पीएफ वेतन)';

  @override
  String get hrSalaryHra => 'एचआरए';

  @override
  String get hrSalaryEsiExcluded => 'ईएसआय वेतनात नाही';

  @override
  String get hrSalaryAdd => 'घटक जोडा';

  @override
  String get hrSalaryRevise => 'सुधारणा जतन करा';

  @override
  String get hrSalaryHistory => 'आधीच्या रचना';

  @override
  String get hrSalaryGross => 'मासिक एकूण';

  @override
  String get hrSalaryAnnual => 'वार्षिक';

  @override
  String get hrSalaryDefaultsBasic => 'मूळ वेतन';

  @override
  String get hrSalaryDefaultsHra => 'एचआरए';

  @override
  String get hrSalaryDefaultsSpecial => 'विशेष भत्ता';

  @override
  String get hrDeclarationTitle => 'कर घोषणा';

  @override
  String get hrDeclarationHint =>
      'टीडीएससाठी वापरले जाते. मानक वजावटीव्यतिरिक्त वजावटी फक्त जुन्या प्रणालीत लागू.';

  @override
  String get hrDeclarationFy => 'आर्थिक वर्ष';

  @override
  String get hrDeclarationRentPaid => 'वर्षात भरलेले भाडे';

  @override
  String get hrDeclarationC80 => '80C गुंतवणूक (पीएफ आपोआप जोडला जातो)';

  @override
  String get hrDeclarationCcd1b => '80CCD(1B) एनपीएस';

  @override
  String get hrDeclarationD80 => '80D आरोग्य विमा';

  @override
  String get hrDeclarationHomeLoanInterest => 'गृहकर्ज व्याज';

  @override
  String get hrDeclarationOtherDeductions => 'इतर वजावटी (80E, 80G…)';

  @override
  String get hrDeclarationOtherIncome => 'इतर उत्पन्न';

  @override
  String get hrDeclarationPreviousEmployerSalary =>
      'या वर्षी आधीच्या नियोक्त्याकडून वेतन';

  @override
  String get hrDeclarationPreviousEmployerTds =>
      'या वर्षी आधीच कापलेला टीडीएस (आधीचा नियोक्ता, किंवा Varchasv पूर्वी)';

  @override
  String get hrDeclarationSave => 'घोषणा जतन करा';

  @override
  String get hrAttendanceTitle => 'हजेरी';

  @override
  String get hrAttendanceSubtitle =>
      'न नोंदवलेले कामाचे दिवस उपस्थित धरले जातात. गैरहजर करण्यासाठी दिवसावर क्लिक करा, मग अर्धा दिवस, मग पुन्हा उपस्थित.';

  @override
  String get hrAttendanceLegendPresent => 'उपस्थित';

  @override
  String get hrAttendanceLegendAbsent => 'गैरहजर';

  @override
  String get hrAttendanceLegendHalfDay => 'अर्धा दिवस';

  @override
  String get hrAttendanceLegendLeave => 'रजेवर';

  @override
  String get hrAttendanceLegendWeekOff => 'साप्ताहिक सुट्टी';

  @override
  String get hrAttendanceLegendHoliday => 'सुट्टी';

  @override
  String get hrAttendanceLegendLate => 'उशीर';

  @override
  String get hrAttendanceLop => 'बिनपगारी';

  @override
  String get hrAttendanceLocked =>
      'या महिन्याचा पगार अंतिम झाला आहे, त्यामुळे हजेरी बदलता येत नाही.';

  @override
  String get hrAttendanceHolidays => 'सुट्ट्या';

  @override
  String get hrAttendanceAddHoliday => 'सुट्टी जोडा';

  @override
  String get hrAttendanceHolidayName => 'सुट्टी';

  @override
  String get hrAttendanceNoEmployees => 'या महिन्यात कोणीही नोकरीत नव्हते.';

  @override
  String get hrAttendanceSaving => 'जतन करत आहे…';

  @override
  String get hrLeaveTitle => 'रजा';

  @override
  String get hrLeaveSubtitle => 'अर्ज, मंजुरी आणि शिल्लक.';

  @override
  String get hrLeaveNew => 'रजेसाठी अर्ज करा';

  @override
  String get hrLeaveEmployee => 'कर्मचारी';

  @override
  String get hrLeaveType => 'रजेचा प्रकार';

  @override
  String get hrLeaveFrom => 'पासून';

  @override
  String get hrLeaveTo => 'पर्यंत';

  @override
  String get hrLeaveHalfDay => 'अर्धा दिवस';

  @override
  String get hrLeaveReason => 'कारण';

  @override
  String get hrLeaveDays => 'दिवस';

  @override
  String get hrLeaveSubmit => 'अर्ज पाठवा';

  @override
  String get hrLeaveApprove => 'मंजूर करा';

  @override
  String get hrLeaveReject => 'नाकारा';

  @override
  String get hrLeaveCancel => 'रद्द करा';

  @override
  String get hrLeavePending => 'मंजुरीच्या प्रतीक्षेत';

  @override
  String get hrLeaveAll => 'सर्व अर्ज';

  @override
  String get hrLeaveBalances => 'रजा शिल्लक';

  @override
  String get hrLeaveOpening => 'मागील शिल्लक';

  @override
  String get hrLeaveQuota => 'या वर्षी';

  @override
  String get hrLeaveTaken => 'घेतलेली';

  @override
  String get hrLeaveBalance => 'शिल्लक';

  @override
  String get hrLeaveNone => 'रजेचे अर्ज नाहीत.';

  @override
  String get hrLeaveStatusesPending => 'प्रलंबित';

  @override
  String get hrLeaveStatusesApproved => 'मंजूर';

  @override
  String get hrLeaveStatusesRejected => 'नाकारले';

  @override
  String get hrLeaveStatusesCancelled => 'रद्द';

  @override
  String get hrSettleTitle => 'अंतिम हिशेब';

  @override
  String get hrSettleHint =>
      'कर्मचाऱ्याला सोडले म्हणून नोंदवते आणि उपदान व रजा रोखीकरण देते. शेवटच्या महिन्याचा पगार पेरोलमधून येतो.';

  @override
  String get hrSettleLeftOn => 'शेवटचा कामाचा दिवस';

  @override
  String get hrSettleServiceYears => 'सेवा (वर्षे)';

  @override
  String get hrSettleGratuity => 'उपदान (ग्रॅच्युइटी)';

  @override
  String get hrSettleNotEligible => 'देय नाही (5 वर्षांपेक्षा कमी)';

  @override
  String get hrSettleLeaveDays => 'रोखीकरणाची रजा (दिवस)';

  @override
  String get hrSettleEncashment => 'रजा रोखीकरण';

  @override
  String get hrSettleOtherEarnings => 'इतर देणी (बोनस, नोटीस वेतन)';

  @override
  String get hrSettleRecoveries => 'वसुली (आगाऊ रक्कम)';

  @override
  String get hrSettleRemarks => 'शेरा';

  @override
  String get hrSettleTotal => 'निव्वळ देय';

  @override
  String get hrSettleConfirm => 'हिशेब करा आणि सोडले म्हणून नोंदवा';

  @override
  String hrSettleDone(String date, String amount) {
    return '$date रोजी हिशेब झाला: $amount';
  }

  @override
  String get hrPayslips => 'वेतन पावत्या';

  @override
  String get hrErrorsInvalidPan => 'हा पॅन वैध नाही (उदा. ABCDE1234F).';

  @override
  String get hrErrorsInvalidIfsc => 'हा आयएफएससी वैध नाही (उदा. HDFC0001234).';

  @override
  String get hrErrorsInvalidBankAccount => '6 ते 18 अंक टाका.';

  @override
  String get hrErrorsBasicRequired =>
      'किमान एक घटक मूळ/महागाई भत्ता म्हणून चिन्हांकित करा.';

  @override
  String get hrErrorsNoComponents => 'किमान एक वेतन घटक जोडा.';

  @override
  String get hrErrorsDuplicateComponent => 'दोन घटकांचा कोड सारखा आहे.';

  @override
  String get hrErrorsEmployeeCodeTaken => 'हा कोड दुसऱ्या कर्मचाऱ्याचा आहे.';

  @override
  String get hrErrorsDobAfterJoining => 'जन्मतारीख रुजू तारखेपूर्वीची हवी.';

  @override
  String get hrErrorsBeforeJoining => 'हे रुजू तारखेपूर्वीचे आहे.';

  @override
  String get hrErrorsLeaveOverlap => 'हे दुसऱ्या रजा अर्जाशी जुळते.';

  @override
  String get hrErrorsInsufficientLeaveBalance => 'पुरेशी रजा शिल्लक नाही.';

  @override
  String get hrErrorsNoWorkingDays =>
      'या सर्व तारखा सुट्ट्या किंवा साप्ताहिक सुट्ट्या आहेत.';

  @override
  String get hrErrorsHalfDaySingleDate => 'अर्धा दिवस एकाच तारखेचा असावा.';

  @override
  String get hrErrorsLeaveCrossesYear =>
      '31 मार्चनंतर जाणारी रजा विभागून द्या.';

  @override
  String get hrErrorsNotEmployedOnDate => 'त्या तारखेला नोकरीत नव्हते.';

  @override
  String get hrErrorsDayOnLeave =>
      'त्या दिवशी मंजूर रजा आहे; आधी रजा रद्द करा.';

  @override
  String get hrErrorsPayrollFinalized =>
      'त्या महिन्याचा पगार आधीच अंतिम झाला आहे.';

  @override
  String get hrErrorsLeaveNotPending => 'या अर्जावर आधीच निर्णय झाला आहे.';

  @override
  String get hrErrorsLeaveNotOpen => 'हा अर्ज आधीच बंद आहे.';

  @override
  String get hrErrorsLeftBeforeJoining => 'हे रुजू तारखेपूर्वीचे आहे.';

  @override
  String get hrErrorsNoSalaryStructure => 'आधी वेतन रचना जोडा.';

  @override
  String get hrErrorsAlreadyLeft => 'या कर्मचाऱ्याचा हिशेब आधीच झाला आहे.';

  @override
  String get hrErrorsRecoveriesExceedDues =>
      'वसुली देण्यांपेक्षा जास्त असू शकत नाही.';

  @override
  String get hrErrorsInvalidUan => 'यूएएन 12 अंकी असतो.';

  @override
  String get hrErrorsInvalidEsiNumber =>
      'ईएसआय आयपी क्रमांक 10 ते 17 अंकी असतो.';

  @override
  String get hrErrorsInvalidAadhaarLast4 => 'फक्त शेवटचे 4 अंक टाका.';

  @override
  String get hrErrorsInvalidPhone => '10 अंकी मोबाइल क्रमांक टाका.';

  @override
  String get hrErrorsToBeforeFrom =>
      '“पर्यंत” हे “पासून” च्या आधी असू शकत नाही.';

  @override
  String get hrErrorsUnknownLeaveType => 'रजेचा प्रकार निवडा.';

  @override
  String get hrErrorsUnknownEmployee => 'कर्मचारी निवडा.';

  @override
  String get hrErrorsLoanNotActive =>
      'हे कर्ज पूर्ण फेडले गेले आहे किंवा रद्द आहे.';

  @override
  String get hrErrorsOverRecovery =>
      'ही रक्कम कर्जावर शिल्लक असलेल्या रकमेपेक्षा जास्त आहे.';

  @override
  String get hrErrorsReceiptBeforeLoan =>
      'परतफेडीची तारीख कर्ज दिल्याच्या तारखेपूर्वी आहे.';

  @override
  String get hrErrorsExpiryBeforeIssue =>
      'मुदत संपण्याची तारीख जारी तारखेपूर्वी आहे.';

  @override
  String get hrLoansTitle => 'आगाऊ रक्कम आणि कर्जे';

  @override
  String get hrLoansNew => 'आगाऊ रक्कम किंवा कर्ज द्या';

  @override
  String get hrLoansKind => 'प्रकार';

  @override
  String get hrLoansKindsAdvance => 'वेतन आगाऊ';

  @override
  String get hrLoansKindsLoan => 'कर्ज';

  @override
  String get hrLoansDate => 'दिल्याची तारीख';

  @override
  String get hrLoansAmount => 'रक्कम';

  @override
  String get hrLoansInstalment => 'मासिक हप्ता';

  @override
  String get hrLoansStartPeriod => 'वसुली पासून';

  @override
  String get hrLoansPaidFrom => 'यातून दिले';

  @override
  String get hrLoansRemarks => 'शेरा';

  @override
  String get hrLoansRecovered => 'वसूल';

  @override
  String get hrLoansBalance => 'शिल्लक';

  @override
  String get hrLoansStatusesActive => 'वसुली सुरू';

  @override
  String get hrLoansStatusesClosed => 'वसूल झाले';

  @override
  String get hrLoansStatusesCancelled => 'रद्द';

  @override
  String get hrLoansNone => 'आगाऊ रक्कम किंवा कर्जे नाहीत.';

  @override
  String get hrLoansCreate => 'द्या';

  @override
  String get hrLoansCancel => 'रद्द करा';

  @override
  String get hrLoansReceive => 'परतफेड घ्या';

  @override
  String get hrLoansReceiveAmount => 'मिळालेली रक्कम';

  @override
  String get hrLoansReceivedInto => 'कोणत्या खात्यात मिळाले';

  @override
  String get hrLoansReceiveSave => 'परतफेड जतन करा';

  @override
  String get hrShiftsTitle => 'पाळ्या';

  @override
  String get hrShiftsName => 'पाळी';

  @override
  String get hrShiftsStart => 'सुरुवात';

  @override
  String get hrShiftsEnd => 'शेवट';

  @override
  String get hrShiftsGrace => 'सवलत (मिनिटे)';

  @override
  String get hrShiftsFullDay => 'पूर्ण दिवस (मिनिटे)';

  @override
  String get hrShiftsHalfDay => 'अर्धा दिवस (मिनिटे)';

  @override
  String get hrShiftsIsDefault => 'मुख्य';

  @override
  String get hrShiftsAdd => 'पाळी जोडा';

  @override
  String get hrShiftsSave => 'जतन करा';

  @override
  String get hrShiftsNone =>
      'अजून पाळ्या नाहीत. पंच 09:30–18:30 नुसार वाचले जातात.';

  @override
  String get hrShiftsShift => 'पाळी';

  @override
  String get hrShiftsNoShift => 'कंपनीची मुख्य';

  @override
  String get hrPunchesTitle => 'पंच आयात करा';

  @override
  String get hrPunchesHint =>
      'बायोमेट्रिक मशीनची CSV, स्तंभ: code, date (YYYY-MM-DD), in, out (24 तास HH:MM). प्रत्येक दिवस कर्मचाऱ्याच्या पाळीनुसार वाचला जातो.';

  @override
  String get hrPunchesTemplate => 'नमुना CSV डाउनलोड करा';

  @override
  String get hrPunchesChoose => 'CSV फाइल निवडा';

  @override
  String hrPunchesImport(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count दिवस',
      one: '$count दिवस',
    );
    return '$_temp0 आयात करा';
  }

  @override
  String hrPunchesDone(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count दिवस',
      one: '$count दिवस',
    );
    return '$_temp0 आयात झाले.';
  }

  @override
  String get hrPunchesRow => 'ओळ';

  @override
  String get hrPunchesCode => 'कोड';

  @override
  String get hrPunchesDate => 'तारीख';

  @override
  String get hrPunchesWorked => 'काम केले';

  @override
  String get hrPunchesStatus => 'निकाल';

  @override
  String get hrPunchesLate => 'उशीर';

  @override
  String get hrDocumentsTitle => 'दस्तऐवज आणि केवायसी';

  @override
  String get hrDocumentsHelp =>
      'ओळख आणि अनुपालन दस्तऐवज. क्रमांकाची फक्त शेवटची चार अक्षरे दिसतात. मुदत संपण्यापूर्वी आठवण हवी असल्यास मुदत जोडा.';

  @override
  String get hrDocumentsNone => 'अजून कोणतेही दस्तऐवज नोंदवलेले नाहीत.';

  @override
  String hrDocumentsExpires(String date) {
    return '$date रोजी संपते';
  }

  @override
  String get hrDocumentsNoExpiry => 'मुदत नाही';

  @override
  String get hrDocumentsExpired => 'संपले';

  @override
  String hrDocumentsDaysLeft(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिवस बाकी',
      one: '$n दिवस बाकी',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsRemove => 'काढा';

  @override
  String get hrDocumentsKind => 'दस्तऐवज';

  @override
  String get hrDocumentsNumber => 'क्रमांक';

  @override
  String get hrDocumentsIssuedOn => 'जारी तारीख';

  @override
  String get hrDocumentsExpiresOnLabel => 'मुदत संपण्याची तारीख';

  @override
  String get hrDocumentsAdd => 'दस्तऐवज जोडा';

  @override
  String get hrDocumentsKindsAadhaar => 'आधार';

  @override
  String get hrDocumentsKindsPan => 'पॅन';

  @override
  String get hrDocumentsKindsPassport => 'पासपोर्ट';

  @override
  String get hrDocumentsKindsDrivingLicence => 'वाहन परवाना';

  @override
  String get hrDocumentsKindsVoterId => 'मतदार ओळखपत्र';

  @override
  String get hrDocumentsKindsBankProof => 'बँक पुरावा';

  @override
  String get hrDocumentsKindsPoliceVerification => 'पोलीस पडताळणी';

  @override
  String get hrDocumentsKindsMedicalFitness => 'वैद्यकीय तंदुरुस्ती';

  @override
  String get hrDocumentsKindsContract => 'करार';

  @override
  String get hrDocumentsKindsOther => 'इतर';

  @override
  String get hrDocumentsExpiringTitle => 'संपत असलेले दस्तऐवज';

  @override
  String get hrDocumentsExpiringSubtitle =>
      'कार्यरत कर्मचार्यांचे दस्तऐवज जे संपले आहेत किंवा लवकरच संपतील, लवकरात लवकर संपणारे वर.';

  @override
  String get hrDocumentsWithin => 'इतक्या कालावधीत संपणारे';

  @override
  String hrDocumentsWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिवस',
      one: '$n दिवस',
    );
    return '$_temp0';
  }

  @override
  String get hrDocumentsShow => 'दाखवा';

  @override
  String get hrDocumentsEmployee => 'कर्मचारी';

  @override
  String get hrDocumentsNoneExpiring => 'या कालावधीत काहीही संपत नाही.';

  @override
  String get payrollTitle => 'पगार (पेरोल)';

  @override
  String get payrollSubtitle =>
      'पीएफ, ईएसआय, व्यवसाय कर आणि टीडीएस मोजून मासिक पगार, तुमच्या हिशेबात नोंदवलेला.';

  @override
  String get payrollRun => 'पगार काढा';

  @override
  String get payrollMonth => 'महिना';

  @override
  String get payrollNone => 'अजून पगार काढलेला नाही.';

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
  String get payrollStatusesDraft => 'मसुदा';

  @override
  String get payrollStatusesFinalized => 'अंतिम';

  @override
  String get payrollStatusesPaid => 'दिला';

  @override
  String get payrollStatusesCancelled => 'रद्द';

  @override
  String get payrollColsEmployee => 'कर्मचारी';

  @override
  String get payrollColsPaidDays => 'पगारी दिवस';

  @override
  String get payrollColsLop => 'बिनपगारी दिवस';

  @override
  String get payrollColsGross => 'एकूण';

  @override
  String get payrollColsPf => 'पीएफ';

  @override
  String get payrollColsEsi => 'ईएसआय';

  @override
  String get payrollColsPt => 'व्यवसाय कर';

  @override
  String get payrollColsLwf => 'एलडब्ल्यूएफ';

  @override
  String get payrollColsTds => 'टीडीएस';

  @override
  String get payrollColsOther => 'इतर';

  @override
  String get payrollColsNet => 'निव्वळ पगार';

  @override
  String get payrollRefresh => 'हजेरीवरून अद्ययावत करा';

  @override
  String get payrollFinalize => 'अंतिम करा आणि नोंदवा';

  @override
  String get payrollFinalizeHint =>
      'पगार, पीएफ, ईएसआय, व्यवसाय कर आणि टीडीएस देणे तुमच्या हिशेबात नोंदवते. त्यानंतर त्या महिन्याची हजेरी बंद होते.';

  @override
  String get payrollPay => 'भरणा नोंदवा';

  @override
  String get payrollPayFrom => 'यातून दिले';

  @override
  String get payrollPayDate => 'भरण्याची तारीख';

  @override
  String get payrollCancel => 'पगार रद्द करा';

  @override
  String get payrollFilesTitle => 'भरणा आणि रिटर्नसाठी फाइल्स';

  @override
  String get payrollFilesEcr => 'ईपीएफ ईसीआर';

  @override
  String get payrollFilesEsi => 'ईएसआय योगदान';

  @override
  String get payrollFilesBank => 'बँक हस्तांतरण';

  @override
  String payrollFilesMissing(String codes) {
    return 'वगळले (तपशील नाही): $codes';
  }

  @override
  String get payrollTotalsGross => 'एकूण पगार';

  @override
  String get payrollTotalsDeductions => 'कपात';

  @override
  String get payrollTotalsNet => 'निव्वळ पगार';

  @override
  String get payrollTotalsEmployer => 'नियोक्त्याचे पीएफ/ईएसआय/एलडब्ल्यूएफ';

  @override
  String get payrollLopEdited => 'हाताने टाकले';

  @override
  String get payrollLopReset => 'हजेरी वापरा';

  @override
  String get payrollAddDeduction => 'कपात जोडा';

  @override
  String get payrollDeductionName => 'कपात';

  @override
  String get payrollDeductionAmount => 'रक्कम';

  @override
  String get payrollEdit => 'बदला';

  @override
  String get payrollView => 'वेतन पावती';

  @override
  String get payrollErrorsRunExists => 'त्या महिन्याचा पगार आधीच आहे.';

  @override
  String get payrollErrorsEarlierRunOpen =>
      'आधी मागील महिन्याचा मसुदा अंतिम किंवा रद्द करा.';

  @override
  String get payrollErrorsRunNotDraft => 'फक्त मसुदा बदलता येतो.';

  @override
  String get payrollErrorsRunEmpty => 'अंतिम करण्यासाठी वेतन पावत्या नाहीत.';

  @override
  String get payrollErrorsRunNotFinalized => 'आधी पगार अंतिम करा.';

  @override
  String get payrollErrorsRunPaid => 'दिलेला पगार रद्द करता येत नाही.';

  @override
  String get payrollErrorsLaterRunFinal =>
      'नंतरचा महिना आधीच अंतिम आहे; आधी तो रद्द करा.';

  @override
  String get payrollErrorsLopExceedsDays =>
      'बिनपगारी दिवस महिन्याच्या दिवसांपेक्षा जास्त आहेत.';

  @override
  String get payrollErrorsDeductionsExceedPay => 'कपात पगारापेक्षा जास्त आहे.';

  @override
  String get payrollErrorsInvalidPeriod => 'महिना निवडा.';

  @override
  String get payrollErrorsInvalidSettings => 'सेटिंग्ज तपासा.';

  @override
  String get payrollErrorsReservedCode =>
      'हा कोड आपोआप मोजलेल्या थकबाकीसाठी राखीव आहे.';

  @override
  String get payrollErrorsInvalidInstalment =>
      'हप्ता 0 पेक्षा जास्त आणि रकमेपेक्षा जास्त नसावा.';

  @override
  String get payrollErrorsRecoveryBeforeLoan =>
      'कर्ज दिल्याआधी वसुली सुरू होऊ शकत नाही.';

  @override
  String get payrollErrorsEmployeeNotActive => 'हा कर्मचारी सोडून गेला आहे.';

  @override
  String get payrollErrorsLoanPartlyRecovered =>
      'यातील काही रक्कम आधीच वसूल झाली आहे; रद्द करता येत नाही.';

  @override
  String get payrollErrorsChallanDetailsRequired =>
      'बीएसआर कोड आणि चलन अनुक्रमांक टाका.';

  @override
  String get payrollErrorsInvalidBsrCode => 'बीएसआर कोड 7 अंकी असतो.';

  @override
  String get payrollErrorsInvalidChallanSerial =>
      'चलन अनुक्रमांक 5 अंकांपर्यंत असतो.';

  @override
  String get payrollErrorsInvalidTan => 'हा टॅन वैध नाही (उदा. MUMA12345B).';

  @override
  String get payrollErrorsNoFinalPayslips =>
      'त्या वर्षाच्या अंतिम वेतन पावत्या नाहीत.';

  @override
  String get payrollErrorsInvalidTime => '09:30 सारखी 24 तासांची वेळ वापरा.';

  @override
  String get payrollErrorsHalfDayLongerThanFull =>
      'अर्धा दिवस पूर्ण दिवसापेक्षा मोठा असू शकत नाही.';

  @override
  String get payrollErrorsInvalidAmount => 'रक्कम टाका.';

  @override
  String get payrollSettingsTitle => 'पेरोल सेटिंग्ज';

  @override
  String get payrollSettingsSubtitle =>
      'नोंदणी कोड, साप्ताहिक सुट्ट्या आणि राज्य कर.';

  @override
  String get payrollSettingsPfCode => 'ईपीएफ आस्थापना कोड';

  @override
  String get payrollSettingsEsiCode => 'ईएसआय नियोक्ता कोड';

  @override
  String get payrollSettingsLabourCode =>
      'कामगार संहितेचा 50% वेतन नियम लागू करा';

  @override
  String get payrollSettingsLabourCodeHint =>
      'सामाजिक सुरक्षा संहितेनुसार (21 नोव्हें 2025 पासून), भत्ते पगाराच्या निम्म्यापेक्षा जास्त असल्यास जादा भाग पीएफ वेतन धरला जातो.';

  @override
  String get payrollSettingsWeeklyOffs => 'साप्ताहिक सुट्ट्या';

  @override
  String get payrollSettingsLwf => 'कामगार कल्याण निधी';

  @override
  String get payrollSettingsLwfEmployee => 'कर्मचारी वाटा (₹)';

  @override
  String get payrollSettingsLwfEmployer => 'नियोक्ता वाटा (₹)';

  @override
  String get payrollSettingsLwfMonths => 'कपातीचे महिने';

  @override
  String get payrollSettingsEncashment => 'प्रतिदिन रजा रोखीकरण';

  @override
  String payrollSettingsDivisor(String n) {
    return 'मासिक वेतन ÷ $n';
  }

  @override
  String get payrollSettingsSave => 'जतन करा';

  @override
  String get payrollSettingsTan => 'टॅन (कर कपात खाते क्रमांक)';

  @override
  String get payrollSlipTitle => 'वेतन पावती';

  @override
  String payrollSlipFor(String month) {
    return '$month ची वेतन पावती';
  }

  @override
  String get payrollSlipEarnings => 'कमाई';

  @override
  String get payrollSlipDeductions => 'कपात';

  @override
  String get payrollSlipNetPay => 'निव्वळ पगार';

  @override
  String get payrollSlipInWords => 'अक्षरी';

  @override
  String get payrollSlipEmployer => 'नियोक्त्याचे योगदान (कापले नाही)';

  @override
  String get payrollSlipTax => 'आयकर गणना';

  @override
  String get payrollSlipAnnualSalary => 'वर्षाचा अंदाजे पगार';

  @override
  String get payrollSlipTaxableIncome => 'करपात्र उत्पन्न';

  @override
  String get payrollSlipAnnualTax => 'वर्षाचा कर';

  @override
  String get payrollSlipDeductedSoFar => 'आतापर्यंत कापले';

  @override
  String get payrollSlipPfEmployee => 'भविष्य निर्वाह निधी';

  @override
  String get payrollSlipEsiEmployee => 'ईएसआय';

  @override
  String get payrollSlipPt => 'व्यवसाय कर';

  @override
  String get payrollSlipLwf => 'कामगार कल्याण निधी';

  @override
  String get payrollSlipTds => 'आयकर (टीडीएस)';

  @override
  String get payrollSlipEps => 'पेन्शन (ईपीएस)';

  @override
  String get payrollSlipEpf => 'पीएफ (नियोक्ता)';

  @override
  String get payrollSlipEdli => 'ईडीएलआय';

  @override
  String get payrollSlipAdmin => 'पीएफ प्रशासन';

  @override
  String get payrollSlipEsiEmployer => 'ईएसआय (नियोक्ता)';

  @override
  String get payrollSlipComputerGenerated =>
      'ही संगणकाद्वारे तयार केलेली वेतन पावती आहे, स्वाक्षरीची गरज नाही.';

  @override
  String payrollSlipEstimated(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count आधीचे महिने',
      one: '$count आधीचा महिना',
    );
    return 'वेतन रचनेवरून अंदाजित $_temp0 समाविष्ट (Varchasv पूर्वी दिलेले).';
  }

  @override
  String get payrollExtraTitle => 'जादा कमाई (फक्त या महिन्यासाठी)';

  @override
  String get payrollExtraName => 'कमाई';

  @override
  String get payrollExtraAmount => 'रक्कम';

  @override
  String get payrollExtraAdd => 'कमाई जोडा';

  @override
  String get payrollExtraEsiExcluded => 'ईएसआय वेतनात नाही (उदा. बोनस)';

  @override
  String get payrollLoanRecoveryTitle => 'कर्ज आणि आगाऊ रकमेचे हप्ते';

  @override
  String get payrollLoanRecoveryHint =>
      'या महिन्यात वगळण्यासाठी 0 टाका; हप्ता वापरण्यासाठी रिकामे करा.';

  @override
  String get payrollRegister => 'पगार नोंदवही';

  @override
  String get payrollEmail => 'वेतन पावत्या ईमेल करा';

  @override
  String payrollEmailed(String sent) {
    return '$sent ईमेल केल्या.';
  }

  @override
  String payrollNoEmail(String codes) {
    return 'ईमेल पत्ता नाही: $codes';
  }

  @override
  String get statutoryTitle => 'वैधानिक देणी आणि टीडीएस';

  @override
  String get statutorySubtitle =>
      'अंतिम पगारातील पीएफ, ईएसआय, व्यवसाय कर, एलडब्ल्यूएफ आणि टीडीएस, किती भरले, तिमाही टीडीएस रिटर्न आणि फॉर्म 16.';

  @override
  String get statutoryFy => 'आर्थिक वर्ष';

  @override
  String get statutoryDues => 'देणी आणि भरणा';

  @override
  String get statutoryKind => 'प्रकार';

  @override
  String get statutoryKindsPf => 'पीएफ';

  @override
  String get statutoryKindsEsi => 'ईएसआय';

  @override
  String get statutoryKindsPt => 'व्यवसाय कर';

  @override
  String get statutoryKindsLwf => 'एलडब्ल्यूएफ';

  @override
  String get statutoryKindsTds => 'टीडीएस';

  @override
  String get statutoryPeriod => 'वेतन महिना';

  @override
  String get statutoryDue => 'देय';

  @override
  String get statutoryPaid => 'भरले';

  @override
  String get statutoryBalance => 'शिल्लक';

  @override
  String get statutoryDueDate => 'भरण्याची अंतिम तारीख';

  @override
  String get statutoryPay => 'भरणा नोंदवा';

  @override
  String get statutoryPaidOn => 'भरल्याची तारीख';

  @override
  String get statutoryAccount => 'यातून भरले';

  @override
  String get statutoryReference => 'चलन / टीआरआरएन क्र.';

  @override
  String get statutoryBsrCode => 'बीएसआर कोड';

  @override
  String get statutoryChallanSerial => 'चलन अनुक्रमांक';

  @override
  String get statutoryRecord => 'भरणा जतन करा';

  @override
  String get statutoryNone => 'या वर्षी अजून अंतिम पगार नाही.';

  @override
  String get statutoryOverdue => 'थकीत';

  @override
  String get statutoryQ24Title => 'तिमाही टीडीएस रिटर्न (फॉर्म 24Q)';

  @override
  String get statutoryQ24Quarter => 'तिमाही';

  @override
  String get statutoryQ24Quarters1 => 'Q1 · एप्रिल–जून';

  @override
  String get statutoryQ24Quarters2 => 'Q2 · जुलै–सप्टें';

  @override
  String get statutoryQ24Quarters3 => 'Q3 · ऑक्टो–डिसें';

  @override
  String get statutoryQ24Quarters4 => 'Q4 · जाने–मार्च';

  @override
  String get statutoryQ24Deductees => 'कपातग्रस्त ओळी';

  @override
  String get statutoryQ24Challans => 'चलने';

  @override
  String get statutoryQ24TotalTds => 'टीडीएस';

  @override
  String get statutoryQ24Download => 'कपातग्रस्त ओळी (CSV)';

  @override
  String get statutoryQ24DownloadAnnex2 => 'परिशिष्ट II (CSV)';

  @override
  String get statutoryQ24RpuHint =>
      'हे NSDL रिटर्न प्रिपरेशन युटिलिटी (RPU) मध्ये आयात करा, FVU ने फाइल तपासा, मग TIN-NSDL वर अपलोड करा.';

  @override
  String get statutoryQ24WarningsTanMissing => 'पेरोल सेटिंग्जमध्ये टॅन जोडा.';

  @override
  String statutoryQ24WarningsPanMissing(String detail) {
    return '$detail चा पॅन नाही: पॅनशिवाय 20% दराने कर कापावा.';
  }

  @override
  String statutoryQ24WarningsDepositMismatch(String detail) {
    return '$detail साठी कापलेला आणि जमा केलेला कर जुळत नाही.';
  }

  @override
  String get statutoryForm16Title => 'फॉर्म 16';

  @override
  String get statutoryForm16Hint =>
      'भाग ब पेरोलमधून. भाग अ TRACES वरून डाउनलोड करून जोडा; दोन्हींवर नियोक्त्याची स्वाक्षरी.';

  @override
  String get statutoryForm16View => 'भाग ब';

  @override
  String get form16Title => 'फॉर्म 16 · भाग ब';

  @override
  String get form16Subtitle =>
      'पगारावरील उगमस्थानी कर कपातीसाठी कलम 203 अंतर्गत प्रमाणपत्र';

  @override
  String get form16Employer => 'नियोक्ता';

  @override
  String get form16Employee => 'कर्मचारी';

  @override
  String get form16Tan => 'टॅन';

  @override
  String get form16Pan => 'पॅन';

  @override
  String get form16Ay => 'कर निर्धारण वर्ष';

  @override
  String get form16Period => 'नोकरीचा कालावधी';

  @override
  String get form16Salary => 'दिलेला पगार';

  @override
  String get form16Gross => 'एकूण पगार';

  @override
  String get form16Previous => 'आधीच्या नियोक्त्याकडून पगार';

  @override
  String get form16Exemptions => 'वजा: कलम 16 अंतर्गत सूट आणि वजावटी';

  @override
  String get form16HraExempt => 'घरभाडे भत्ता सूट';

  @override
  String get form16StandardDeduction => 'मानक वजावट';

  @override
  String get form16Pt => 'व्यवसाय कर';

  @override
  String get form16HouseProperty => 'घर मालमत्तेचे उत्पन्न (गृहकर्ज व्याज)';

  @override
  String get form16ChapterVIA => 'प्रकरण VI-A अंतर्गत वजावटी';

  @override
  String get form16TaxableIncome => 'एकूण करपात्र उत्पन्न';

  @override
  String get form16Tax => 'एकूण उत्पन्नावर कर';

  @override
  String get form16Rebate => 'कलम 87A अंतर्गत सवलत';

  @override
  String get form16Surcharge => 'अधिभार';

  @override
  String get form16Cess => 'आरोग्य व शिक्षण उपकर';

  @override
  String get form16Total => 'देय कर';

  @override
  String get form16Regime => 'कर प्रणाली';

  @override
  String get form16TdsQuarterly => 'कापलेला आणि जमा केलेला कर';

  @override
  String get form16Quarter => 'तिमाही';

  @override
  String get form16Challans => 'चलने (बीएसआर कोड · तारीख · अनुक्रमांक)';

  @override
  String get form16TdsDeducted => 'एकूण कापलेला कर';

  @override
  String get form16Balance => 'देय कर (परतावा)';

  @override
  String get form16Verification =>
      'उपलब्ध हिशेब पुस्तके, दस्तऐवज आणि नोंदींच्या आधारे वरील माहिती खरी आणि बरोबर असल्याचे प्रमाणित करण्यात येते.';

  @override
  String get form16Signature => 'कर कापण्यास जबाबदार व्यक्तीची स्वाक्षरी';

  @override
  String get form16PartA => 'भाग अ (TRACES वरून) जोडावा.';

  @override
  String form16Missing(String months) {
    return '$months च्या वेतन पावत्या येथे नाहीत (Varchasv पूर्वी दिलेले). स्वाक्षरीपूर्वी तो पगार आणि कर जोडा.';
  }

  @override
  String get mfgBomsTitle => 'साहित्य यादी (BOM)';

  @override
  String get mfgBomsSubtitle =>
      'तुम्ही बनवता त्या प्रत्येक वस्तूत काय लागते, नासाडी, कार्यकेंद्र वेळ आणि ओव्हरहेडसह.';

  @override
  String get mfgBomsNew => 'नवीन बीओएम';

  @override
  String get mfgBomsItem => 'बनवलेली वस्तू';

  @override
  String get mfgBomsVersion => 'आवृत्ती';

  @override
  String get mfgBomsOutputQty => 'उत्पादन (प्रमाण)';

  @override
  String get mfgBomsOverhead => 'प्रति बॅच स्थिर ओव्हरहेड (₹)';

  @override
  String get mfgBomsComponent => 'कच्चा माल';

  @override
  String get mfgBomsQty => 'प्रमाण';

  @override
  String get mfgBomsWastage => 'नासाडी %';

  @override
  String get mfgBomsOperations => 'प्रक्रिया';

  @override
  String get mfgBomsOperation => 'प्रक्रिया';

  @override
  String get mfgBomsWorkCentre => 'कार्यकेंद्र';

  @override
  String get mfgBomsMinutes => 'मिनिटे';

  @override
  String get mfgBomsAddLine => 'माल जोडा';

  @override
  String get mfgBomsAddOperation => 'प्रक्रिया जोडा';

  @override
  String get mfgBomsSave => 'बीओएम जतन करा';

  @override
  String get mfgBomsMakeDefault => 'मुख्य म्हणून वापरा';

  @override
  String get mfgBomsDefault => 'मुख्य';

  @override
  String get mfgBomsArchive => 'संग्रहित करा';

  @override
  String get mfgBomsArchived => 'संग्रहित';

  @override
  String get mfgBomsUnitCost => 'प्रति एकक खर्च';

  @override
  String get mfgBomsOverheadPerUnit => 'प्रति एकक ओव्हरहेड';

  @override
  String get mfgBomsRate => 'दर';

  @override
  String get mfgBomsCost => 'खर्च';

  @override
  String get mfgBomsNone => 'अजून बीओएम नाहीत.';

  @override
  String get mfgBomsNotes => 'टिपा';

  @override
  String mfgBomsLines(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count माल',
      one: '$count माल',
    );
    return '$_temp0';
  }

  @override
  String get mfgWorkCentresTitle => 'कार्यकेंद्रे';

  @override
  String get mfgWorkCentresName => 'कार्यकेंद्र';

  @override
  String get mfgWorkCentresCostPerHour => 'प्रति तास खर्च (₹)';

  @override
  String get mfgWorkCentresAdd => 'कार्यकेंद्र जोडा';

  @override
  String get mfgWorkCentresSave => 'जतन करा';

  @override
  String get mfgOrdersTitle => 'उत्पादन ऑर्डर';

  @override
  String get mfgOrdersSubtitle =>
      'उत्पादनाचे नियोजन, सुरुवात आणि पूर्तता. माल स्टॉकमधून जातो आणि उत्पादन खर्चाने येते.';

  @override
  String get mfgOrdersNew => 'नवीन उत्पादन ऑर्डर';

  @override
  String get mfgOrdersItem => 'वस्तू';

  @override
  String get mfgOrdersQty => 'प्रमाण';

  @override
  String get mfgOrdersDate => 'तारीख';

  @override
  String get mfgOrdersStatus => 'स्थिती';

  @override
  String get mfgOrdersStatusesPlanned => 'नियोजित';

  @override
  String get mfgOrdersStatusesReleased => 'सुरू';

  @override
  String get mfgOrdersStatusesCompleted => 'पूर्ण';

  @override
  String get mfgOrdersStatusesCancelled => 'रद्द';

  @override
  String get mfgOrdersProduced => 'उत्पादित';

  @override
  String get mfgOrdersRejected => 'नाकारले';

  @override
  String get mfgOrdersRelease => 'सुरू करा';

  @override
  String get mfgOrdersIssue => 'जादा माल द्या';

  @override
  String get mfgOrdersComplete => 'उत्पादन नोंदवा';

  @override
  String get mfgOrdersGoodQty => 'चांगले प्रमाण';

  @override
  String get mfgOrdersRejectedQty => 'नाकारलेले';

  @override
  String get mfgOrdersClose => 'यानंतर ऑर्डर बंद करा';

  @override
  String get mfgOrdersRemaining => 'अजून बनवायचे';

  @override
  String get mfgOrdersMaterials => 'उरलेल्यासाठी माल';

  @override
  String get mfgOrdersEntries => 'इतिहास';

  @override
  String get mfgOrdersUnitCost => 'एकक खर्च';

  @override
  String get mfgOrdersMaterialCost => 'मालाचा खर्च';

  @override
  String get mfgOrdersOverheadCost => 'ओव्हरहेड';

  @override
  String get mfgOrdersKindsIssue => 'जादा माल';

  @override
  String get mfgOrdersKindsComplete => 'उत्पादन';

  @override
  String get mfgOrdersReleaseNow => 'लगेच सुरू करा';

  @override
  String get mfgOrdersNone => 'अजून उत्पादन ऑर्डर नाहीत.';

  @override
  String get mfgOrdersSave => 'ऑर्डर तयार करा';

  @override
  String get mfgOrdersCancel => 'ऑर्डर रद्द करा';

  @override
  String get mfgMrpTitle => 'माल नियोजन (एमआरपी)';

  @override
  String get mfgMrpSubtitle =>
      'खुल्या विक्री ऑर्डर आणि पुनर्मागणी पातळी पूर्ण करण्यासाठी काय बनवायचे आणि काय खरेदी करायचे, स्टॉक आणि आधीच मागवलेले वजा करून.';

  @override
  String get mfgMrpAsOf => 'या तारखेनुसार नियोजन';

  @override
  String get mfgMrpAction => 'कृती';

  @override
  String get mfgMrpActionsMake => 'बनवा';

  @override
  String get mfgMrpActionsBuy => 'खरेदी करा';

  @override
  String get mfgMrpQty => 'प्रमाण';

  @override
  String get mfgMrpNeedBy => 'पर्यंत हवे';

  @override
  String get mfgMrpReleaseBy => 'सुरू / मागणी पर्यंत';

  @override
  String get mfgMrpOnHand => 'हातात';

  @override
  String get mfgMrpOnOrder => 'मागवलेले';

  @override
  String get mfgMrpSupplier => 'पुरवठादार';

  @override
  String get mfgMrpConvert => 'निवडलेल्यांच्या ऑर्डर तयार करा';

  @override
  String mfgMrpCreated(String orders) {
    return '$orders तयार झाल्या.';
  }

  @override
  String get mfgMrpNone =>
      'नियोजनाची गरज नाही: स्टॉक आणि ऑर्डर मागणी पूर्ण करतात.';

  @override
  String get mfgJobWorkTitle => 'जॉब वर्क';

  @override
  String get mfgJobWorkSubtitle =>
      'चलनावर जॉब वर्करकडे पाठवलेला आणि प्रक्रिया होऊन परत आलेला माल. कच्चा माल एका वर्षात परत यायला हवा (भांडवली वस्तू तीन वर्षांत).';

  @override
  String get mfgJobWorkSend => 'जॉब वर्कसाठी पाठवा';

  @override
  String get mfgJobWorkReceive => 'परत स्वीकारा';

  @override
  String get mfgJobWorkJobWorker => 'जॉब वर्कर';

  @override
  String get mfgJobWorkProcess => 'प्रक्रिया';

  @override
  String get mfgJobWorkSent => 'पाठवले';

  @override
  String get mfgJobWorkPending => 'अजून जॉब वर्करकडे';

  @override
  String get mfgJobWorkReturnBy => 'परतीची मुदत';

  @override
  String get mfgJobWorkOverdue => 'थकीत';

  @override
  String get mfgJobWorkReceived => 'स्वीकारलेली वस्तू';

  @override
  String get mfgJobWorkConsumed => 'वापरलेला माल';

  @override
  String get mfgJobWorkCharges => 'जॉब शुल्क (₹)';

  @override
  String get mfgJobWorkFrom => 'चलनातून';

  @override
  String get mfgJobWorkItc04 => 'ITC-04 (सहामाही)';

  @override
  String get mfgJobWorkHalf => 'सहामाही';

  @override
  String get mfgJobWorkHalvesH1 => 'एप्रिल–सप्टेंबर';

  @override
  String get mfgJobWorkHalvesH2 => 'ऑक्टोबर–मार्च';

  @override
  String get mfgJobWorkSentTable => 'पाठवलेला माल';

  @override
  String get mfgJobWorkReceivedTable => 'परत आलेला माल';

  @override
  String get mfgJobWorkPendingTable => 'जॉब वर्करकडे प्रलंबित';

  @override
  String get mfgJobWorkNone => 'अजून जॉब वर्क नाही.';

  @override
  String get mfgJobWorkCapitalGoods => 'भांडवली वस्तू';

  @override
  String get mfgErrorsBomCycle =>
      'यामुळे वर्तुळ तयार होते: वस्तूला स्वतःचीच गरज लागेल.';

  @override
  String get mfgErrorsBomEmpty => 'किमान एक माल जोडा.';

  @override
  String get mfgErrorsInvalidOutputQty => 'एका बॅचमध्ये किती बनते ते टाका.';

  @override
  String get mfgErrorsDuplicateComponent => 'एक माल दोनदा आला आहे.';

  @override
  String get mfgErrorsUnknownWorkCentre => 'कार्यकेंद्र निवडा.';

  @override
  String get mfgErrorsNoBom => 'या वस्तूचे सक्रिय बीओएम नाही.';

  @override
  String get mfgErrorsBomArchived => 'ते बीओएम संग्रहित आहे.';

  @override
  String get mfgErrorsOrderNotPlanned => 'फक्त नियोजित ऑर्डर सुरू करता येते.';

  @override
  String get mfgErrorsOrderNotReleased => 'आधी ऑर्डर सुरू करा.';

  @override
  String get mfgErrorsSupplierRequired =>
      'खरेदीच्या वस्तूंसाठी पुरवठादार निवडा.';

  @override
  String get mfgErrorsUnknownJobWorker =>
      'जॉब वर्कर म्हणून पुरवठादार किंवा ग्राहक निवडा.';

  @override
  String get mfgErrorsUnknownChallan => 'पाठवलेले चलन निवडा.';

  @override
  String get mfgErrorsChallanCancelled => 'ते चलन रद्द आहे.';

  @override
  String get mfgErrorsItemNotSent => 'ही वस्तू या चलनावर पाठवली नव्हती.';

  @override
  String get mfgErrorsMoreThanSent =>
      'हे जॉब वर्करकडे शिल्लक असलेल्यापेक्षा जास्त आहे.';

  @override
  String get mfgErrorsChallanHasReceipts =>
      'या चलनावर माल परत आला आहे; आधी ते रद्द करा.';

  @override
  String get posBillingTitle => 'बिलिंग';

  @override
  String get posBillingTerminal => 'काउंटर';

  @override
  String get posBillingChooseTerminal => 'काउंटर निवडा';

  @override
  String get posBillingOpenShift => 'पाळी सुरू करा';

  @override
  String get posBillingOpeningCash => 'सुरुवातीची रोख (₹)';

  @override
  String get posBillingCloseShift => 'पाळी बंद करा';

  @override
  String get posBillingCountedCash => 'मोजलेली रोख (₹)';

  @override
  String get posBillingExpected => 'अपेक्षित';

  @override
  String get posBillingDifference => 'फरक';

  @override
  String get posBillingSearch => 'बारकोड स्कॅन करा किंवा वस्तू शोधा';

  @override
  String get posBillingCart => 'बिल';

  @override
  String get posBillingEmpty => 'बिल सुरू करण्यासाठी वस्तू जोडा.';

  @override
  String get posBillingQty => 'प्रमाण';

  @override
  String get posBillingPrice => 'किंमत';

  @override
  String get posBillingAmount => 'रक्कम';

  @override
  String get posBillingDiscount => 'बिल सूट (₹)';

  @override
  String get posBillingCustomer => 'ग्राहक मोबाइल (गुणांसाठी)';

  @override
  String get posBillingCustomerName => 'नाव';

  @override
  String posBillingPoints(String points) {
    return '$points गुण';
  }

  @override
  String get posBillingRedeem => 'गुण वापरा';

  @override
  String posBillingRedeemable(String points, String value) {
    return '$points गुणांपर्यंत (₹$value)';
  }

  @override
  String get posBillingPayments => 'भरणा';

  @override
  String get posBillingModesCash => 'रोख';

  @override
  String get posBillingModesUpi => 'यूपीआय';

  @override
  String get posBillingModesCard => 'कार्ड';

  @override
  String get posBillingModesCredit => 'उधारीवर';

  @override
  String get posBillingReference => 'संदर्भ';

  @override
  String get posBillingAddPayment => 'विभागून भरणा';

  @override
  String get posBillingPay => 'बिल पूर्ण करा';

  @override
  String get posBillingTotal => 'एकूण';

  @override
  String get posBillingChange => 'परत द्यायचे सुटे';

  @override
  String get posBillingDue => 'अजून बाकी';

  @override
  String get posBillingTaxable => 'करपात्र';

  @override
  String get posBillingTax => 'जीएसटी';

  @override
  String get posBillingRoundOff => 'पूर्णांक';

  @override
  String posBillingDone(String number) {
    return 'बिल $number जतन झाले';
  }

  @override
  String get posBillingPrint => 'पावती छापा';

  @override
  String get posBillingNewBill => 'नवीन बिल';

  @override
  String get posBillingShiftTotals => 'ही पाळी';

  @override
  String get posBillingBills => 'बिले';

  @override
  String get posBillingDeviceTerminal =>
      'हा काउंटर त्याच्या उपकरणावरून बिल करतो (ऑफलाइन ॲप).';

  @override
  String get posBillsTitle => 'पीओएस बिले';

  @override
  String get posBillsSubtitle => 'एका दिवसाची सर्व काउंटरची बिले.';

  @override
  String get posBillsDate => 'तारीख';

  @override
  String get posBillsNumber => 'बिल क्र.';

  @override
  String get posBillsTime => 'वेळ';

  @override
  String get posBillsMode => 'भरणा पद्धत';

  @override
  String get posBillsVoid => 'रद्द करा';

  @override
  String get posBillsVoided => 'रद्द';

  @override
  String get posBillsReason => 'कारण';

  @override
  String get posBillsSummary => 'दिवसाचा सारांश';

  @override
  String get posBillsTopItems => 'सर्वाधिक विक्री';

  @override
  String get posBillsMismatch => 'उपकरणावरील एकूण वेगळी होती';

  @override
  String get posBillsNone => 'या दिवशी बिले नाहीत.';

  @override
  String get posSettingsTitle => 'काउंटर सेटिंग';

  @override
  String get posSettingsSubtitle =>
      'किंमत, लॉयल्टी पॉइंट, सवलत मर्यादा आणि काउंटर.';

  @override
  String get posSettingsPricesIncludeTax => 'किमतीत जीएसटी समाविष्ट';

  @override
  String get posSettingsLoyalty => 'लॉयल्टी गुण';

  @override
  String get posSettingsLoyaltyEnabled => 'लॉयल्टी गुण द्या';

  @override
  String get posSettingsPointsPer100 => 'प्रति ₹100 गुण';

  @override
  String get posSettingsPointValue => 'एका गुणाचे मूल्य (₹)';

  @override
  String get posSettingsMaxRedeem => 'गुणांनी भरता येणारा बिलाचा कमाल भाग (%)';

  @override
  String get posSettingsFooter => 'पावतीची तळटीप';

  @override
  String get posSettingsTerminals => 'काउंटर';

  @override
  String get posSettingsTerminalName => 'काउंटरचे नाव';

  @override
  String get posSettingsWarehouse => 'यातून विक्री';

  @override
  String get posSettingsDevice => 'ऑफलाइन उपकरण';

  @override
  String get posSettingsNoDevice => 'नाही (वेब बिलिंग)';

  @override
  String get posSettingsAddTerminal => 'काउंटर जोडा';

  @override
  String get posSettingsSave => 'जतन करा';

  @override
  String get posReceiptTaxInvoice => 'कर बीजक';

  @override
  String get posReceiptBillOfSupply => 'रोख मेमो';

  @override
  String get posReceiptThanks => 'धन्यवाद! पुन्हा भेट द्या.';

  @override
  String posReceiptPointsEarned(String points, String balance) {
    return 'मिळालेले गुण: $points · शिल्लक $balance';
  }

  @override
  String get posErrorsSessionNotOpen => 'आधी या काउंटरवर पाळी सुरू करा.';

  @override
  String get posErrorsSessionAlreadyOpen => 'या काउंटरवर पाळी आधीच सुरू आहे.';

  @override
  String get posErrorsSessionClosed => 'ती पाळी बंद आहे.';

  @override
  String get posErrorsDeviceTerminal =>
      'हा काउंटर त्याच्या उपकरणावरून बिल करतो.';

  @override
  String get posErrorsTerminalOnOtherDevice =>
      'हा काउंटर दुसऱ्या उपकरणाचा आहे.';

  @override
  String get posErrorsTooManyPoints =>
      'या बिलावर वापरता येतील त्यापेक्षा जास्त गुण.';

  @override
  String get posErrorsLoyaltyNotAvailable =>
      'आधी ग्राहकाचा मोबाइल क्रमांक टाका.';

  @override
  String get posErrorsOverpaidNonCash =>
      'यूपीआय आणि कार्ड बाकी रकमेपेक्षा जास्त असू शकत नाही.';

  @override
  String get posErrorsUnderpaid => 'बिल पूर्ण भरलेले नाही.';

  @override
  String get posErrorsInvalidPayment => 'भरण्याची रक्कम टाका.';

  @override
  String get posErrorsCustomerRequiredForCredit =>
      'उधारी विक्रीसाठी ग्राहक निवडा.';

  @override
  String get posErrorsDiscountExceedsAmount => 'सूट बिलापेक्षा जास्त आहे.';

  @override
  String get posErrorsVoidSameDayOnly => 'फक्त आजची बिले रद्द करता येतात.';

  @override
  String get posErrorsOrderNotOpen => 'ती ऑर्डर बंद आहे.';

  @override
  String get posErrorsBillNumberTaken => 'तो बिल क्रमांक आधीच वापरला आहे.';

  @override
  String get posErrorsInvalidPhone => '10 अंकी मोबाइल क्रमांक टाका.';

  @override
  String get posErrorsNoLines => 'किमान एक वस्तू जोडा.';

  @override
  String get posDeviceNoTerminal =>
      'या उपकरणाला बिलिंग काउंटर नाही. वेबवर पीओएस सेटिंग्ज उघडा, या उपकरणाला काउंटर जोडा, मग सिंक करा.';

  @override
  String get posDeviceTodayBills => 'या उपकरणावरील आजची बिले';

  @override
  String get posDeviceWaiting => 'अपलोडच्या प्रतीक्षेत';

  @override
  String get posDeviceUploaded => 'अपलोड झाले';

  @override
  String posDeviceFailed(String error) {
    return 'स्वीकारले नाही: $error';
  }

  @override
  String posDeviceMismatch(String total) {
    return 'सर्व्हरवरील एकूण $total';
  }

  @override
  String get posDeviceOfflineNote =>
      'बिलांना या उपकरणावर क्रमांक मिळतात आणि ऑनलाइन असताना ती अपलोड होतात.';

  @override
  String get posDeviceNoFiscalYear =>
      'आजची तारीख कोणत्याही आर्थिक वर्षात नाही. आधी क्लाउडशी सिंक करा.';

  @override
  String get posPromoReferredBy => 'कोणी पाठवले (मोबाईल)';

  @override
  String posPromoReferredHint(String points) {
    return 'त्यांना $points पॉइंट मिळतील';
  }

  @override
  String get posPromoCoupon => 'कूपन कोड';

  @override
  String posPromoCouponOk(String off) {
    return '$off सूट';
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
    return 'गिफ्ट व्हाउचर $code';
  }

  @override
  String get posPromoToPay => 'भरायचे';

  @override
  String get posPromoVoucherCode => 'गिफ्ट व्हाउचर कोड';

  @override
  String get posPromoUseVoucher => 'व्हाउचर वापरा';

  @override
  String get posPromoReferralPoints => 'रेफरल पॉइंट';

  @override
  String get posPromoReferralPointsHint =>
      'ज्या सदस्याने पाठवलेला ग्राहक सामील होऊन खरेदी करतो त्याला (0 = बंद)';

  @override
  String get posPromoErrorsCouponNotFound => 'असे कूपन नाही, किंवा बंद आहे.';

  @override
  String get posPromoErrorsCouponNotValidToday => 'हे कूपन आज वैध नाही.';

  @override
  String get posPromoErrorsCouponUsedUp => 'हे कूपन पूर्ण वापरले गेले आहे.';

  @override
  String get posPromoErrorsCouponMinBill =>
      'बिल या कूपनच्या किमान रकमेपेक्षा कमी आहे.';

  @override
  String get posPromoErrorsCardNotFound =>
      'असे डिस्काउंट कार्ड नाही, किंवा बंद आहे.';

  @override
  String get posPromoErrorsCardExpired =>
      'या डिस्काउंट कार्डची मुदत संपली आहे.';

  @override
  String get posPromoErrorsVoucherNotFound => 'त्या कोडचे गिफ्ट व्हाउचर नाही.';

  @override
  String get posPromoErrorsVoucherNotUsable =>
      'हे गिफ्ट व्हाउचर पूर्ण वापरले किंवा मुदत संपली.';

  @override
  String get posPromoErrorsVoucherBalanceLow =>
      'व्हाउचरवर एवढी रक्कम उरलेली नाही.';

  @override
  String get posPromoErrorsVoucherMoreThanBill =>
      'व्हाउचरची रक्कम बिलापेक्षा जास्त आहे.';

  @override
  String get posPromoErrorsVoucherTwice => 'तेच व्हाउचर दोनदा टाकले.';

  @override
  String get posPromoErrorsOnlineOnly =>
      'कूपन, कार्ड आणि गिफ्ट व्हाउचरसाठी ऑनलाईन काउंटर हवा.';

  @override
  String get posCounterControls => 'काउंटर नियंत्रण';

  @override
  String get posCounterAllowRateChange => 'कॅशियर दर बदलू शकतात';

  @override
  String get posCounterRequireSalesman => 'प्रत्येक ओळीला सेल्समन आवश्यक';

  @override
  String get posCounterMaxLineDiscount => 'कमाल ओळ सूट, %';

  @override
  String get posCounterMaxBillDiscount => 'कमाल बिल सूट, %';

  @override
  String get posCounterLimitHint =>
      'रिकामे: मर्यादा नाही. जास्तीसाठी मंजूरकर्त्याचे कारण हवे.';

  @override
  String get posCounterSalesman => 'सेल्समन';

  @override
  String get posCounterNoSalesman => 'सेल्समन नाही';

  @override
  String get posCounterBillSalesman => 'बिलाचा सेल्समन';

  @override
  String get posCounterRate => 'दर';

  @override
  String get posCounterRateLocked => 'दर लॉक आहे';

  @override
  String get posCounterDisc => 'सूट ₹';

  @override
  String get posCounterLineDiscount => 'ओळ सूट रुपयांत';

  @override
  String posCounterVisits(String n) {
    return 'भेटी: $n';
  }

  @override
  String posCounterSpent(String v) {
    return 'खर्च $v';
  }

  @override
  String posCounterReturned(String v) {
    return 'परत $v';
  }

  @override
  String posCounterLastVisit(String date) {
    return 'शेवटची $date';
  }

  @override
  String get posCounterBuys => 'सहसा घेतात';

  @override
  String get posCounterNewCustomer => 'नवीन ग्राहक: या बिलाने सामील होतील.';

  @override
  String get posCounterApprovalReason => 'मंजुरीचे कारण';

  @override
  String get posCounterBrokenRate => 'दर बदलला';

  @override
  String get posCounterBrokenLineDiscount => 'ओळ सूट मर्यादेपेक्षा जास्त';

  @override
  String get posCounterBrokenBillDiscount => 'बिल सूट मर्यादेपेक्षा जास्त';

  @override
  String get posCounterNeedsApprover => 'मॅनेजरची मंजुरी हवी';

  @override
  String get posCounterHold => 'बिल थांबवा';

  @override
  String posCounterHeldBills(String n) {
    return 'थांबवलेली बिले ($n)';
  }

  @override
  String get posCounterHoldLabel => 'कोणासाठी? (ऐच्छिक)';

  @override
  String get posCounterHoldNow => 'थांबवा';

  @override
  String get posCounterUnnamed => 'ग्राहक';

  @override
  String posCounterPieces(String n) {
    return 'नग: $n';
  }

  @override
  String get posCounterResume => 'याचे बिल करा';

  @override
  String get posCounterNoneHeld => 'थांबवलेले बिल नाही.';

  @override
  String get posCounterHoldFirst =>
      'दुसरे घेण्यापूर्वी चालू बिल थांबवा किंवा पूर्ण करा.';

  @override
  String get posCounterSizeStock => 'येथे साइजनुसार स्टॉक';

  @override
  String get posCounterAddSize => 'हा रंग आणि साइज जोडा';

  @override
  String get posCounterKeysSearch => 'स्कॅन किंवा शोध';

  @override
  String get posCounterKeysHold => 'बिल थांबवा';

  @override
  String get posCounterKeysHeld => 'थांबवलेली बिले';

  @override
  String get posCounterKeysCustomer => 'ग्राहक';

  @override
  String get posCounterKeysDiscount => 'सूट';

  @override
  String get posCounterKeysCash => 'पूर्ण रोख';

  @override
  String get posCounterKeysUpi => 'पूर्ण UPI';

  @override
  String get posCounterKeysCard => 'पूर्ण कार्ड';

  @override
  String get posCounterKeysPay => 'बिल पूर्ण करा';

  @override
  String get posCounterKeysExchange => 'परत किंवा बदल';

  @override
  String get posCounterErrorsRateLocked =>
      'दर लॉक आहे. मॅनेजर कारणासह परवानगी देऊ शकतात.';

  @override
  String get posCounterErrorsDiscountOverLimit =>
      'ओळ सूट मर्यादेपेक्षा जास्त आहे. मॅनेजर कारणासह परवानगी देऊ शकतात.';

  @override
  String get posCounterErrorsBillDiscountOverLimit =>
      'बिल सूट मर्यादेपेक्षा जास्त आहे. मॅनेजर कारणासह परवानगी देऊ शकतात.';

  @override
  String get posCounterErrorsSalesmanRequired =>
      'प्रत्येक ओळीचा सेल्समन निवडा.';

  @override
  String get posCounterErrorsUnknownSalesman =>
      'तो सेल्समन कर्मचारी यादीत नाही.';

  @override
  String get posCounterErrorsHeldBillGone =>
      'ते थांबवलेले बिल आधीच घेतले गेले.';

  @override
  String get posCounterAutoSendBill =>
      'ग्राहकाने मोबाइल दिल्यास बिल आपोआप व्हॉट्सॲपवर पाठवा';

  @override
  String get posCounterBrowse => 'वस्तू पहा';

  @override
  String get posCounterItem => 'वस्तू';

  @override
  String posCounterPiecesInBill(String n) {
    return 'बिलात $n नग';
  }

  @override
  String posCounterGrossAtRate(String v) {
    return 'दराने एकूण $v';
  }

  @override
  String get posCounterOffers => 'सवलत आणि ऑफर';

  @override
  String get posCounterBreakdown => 'बिलाचा तपशील';

  @override
  String get posCounterInclGst => 'GST सह';

  @override
  String get posCounterBillItems => 'बिलातील वस्तू';

  @override
  String get posCounterScanToStart =>
      'बिल सुरू करण्यासाठी बारकोड स्कॅन करा किंवा शोधा. होल्ड बिल घेण्यासाठी F4 दाबा.';

  @override
  String get bankingAccountsTitle => 'बँका';

  @override
  String get bankingAccountsSubtitle => 'तुमची बँक विवरणे हिशेबाशी जुळवा.';

  @override
  String get bankingAccountsBookBalance => 'हिशेबानुसार';

  @override
  String get bankingAccountsStatementBalance => 'बँकेनुसार';

  @override
  String bankingAccountsAsOf(String date) {
    return '$date रोजी';
  }

  @override
  String bankingAccountsUnmatched(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'जुळवायच्या $count ओळी',
      one: 'जुळवायची $count ओळ',
    );
    return '$_temp0';
  }

  @override
  String get bankingAccountsAllMatched => 'सर्व जुळले';

  @override
  String get bankingAccountsNone =>
      'अजून बँक खाती नाहीत. खातेसूचीत Bank Accounts खाली खाते जोडा.';

  @override
  String get bankingAccountsReconcile => 'जुळवणी करा';

  @override
  String get bankingAccountsNoStatement => 'अजून विवरण नाही';

  @override
  String get bankingProfileTitle => 'बँक तपशील';

  @override
  String get bankingProfileBankName => 'बँक';

  @override
  String get bankingProfileLast4 => 'खाते (शेवटचे 4 अंक)';

  @override
  String get bankingProfileIfsc => 'आयएफएससी';

  @override
  String get bankingProfileSave => 'जतन करा';

  @override
  String get bankingImportTitle => 'विवरण आयात करा';

  @override
  String get bankingImportHint =>
      'नेट बँकिंगमधून विवरण CSV मध्ये डाउनलोड करा (Excel मधून: Save As → CSV). स्तंभ त्यांच्या शीर्षकांवरून ओळखले जातात, त्यामुळे बहुतेक भारतीय बँका चालतात.';

  @override
  String get bankingImportFile => 'विवरण फाइल (CSV)';

  @override
  String get bankingImportButton => 'आयात करा';

  @override
  String bankingImportDone(String added, String duplicates, String matched) {
    return '$added ओळी जोडल्या, $duplicates आधीच होत्या, $matched आपोआप जुळल्या.';
  }

  @override
  String get bankingFeedTitle => 'बँक फीड';

  @override
  String get bankingFeedHint =>
      'तुम्ही संमती मंजूर केल्यावर व्यवहार RBI अकाउंट ॲग्रिगेटर प्रणालीद्वारे येतात. प्रदाता जोडेपर्यंत सिम्युलेटर काम करतो.';

  @override
  String get bankingFeedConnect => 'जोडा';

  @override
  String get bankingFeedFetch => 'आता आणा';

  @override
  String get bankingFeedDisconnect => 'जोडणी काढा';

  @override
  String get bankingFeedStatusesActive => 'जोडलेले';

  @override
  String get bankingFeedStatusesPending => 'संमतीच्या प्रतीक्षेत';

  @override
  String get bankingFeedStatusesRevoked => 'जोडणी काढली';

  @override
  String bankingFeedFetched(String date) {
    return '$date पर्यंत आणले';
  }

  @override
  String bankingFeedDone(String added, String matched) {
    return '$added नवीन व्यवहार, $matched जुळले.';
  }

  @override
  String get bankingTabsOpen => 'जुळवायचे';

  @override
  String get bankingTabsMatched => 'जुळलेले';

  @override
  String get bankingTabsIgnored => 'दुर्लक्षित';

  @override
  String get bankingTabsBrs => 'जुळवणी विवरण';

  @override
  String get bankingLinesDate => 'तारीख';

  @override
  String get bankingLinesDescription => 'तपशील';

  @override
  String get bankingLinesWithdrawal => 'काढले';

  @override
  String get bankingLinesDeposit => 'जमा';

  @override
  String get bankingLinesBalance => 'शिल्लक';

  @override
  String get bankingLinesSuggestion => 'असे दिसते';

  @override
  String get bankingLinesAccept => 'जुळवा';

  @override
  String get bankingLinesCreate => 'नोंद करा';

  @override
  String get bankingLinesIgnore => 'दुर्लक्ष करा';

  @override
  String get bankingLinesByHand => 'नोंद शोधा';

  @override
  String get bankingLinesUnmatch => 'जुळणी काढा';

  @override
  String get bankingLinesRestore => 'परत आणा';

  @override
  String get bankingLinesAccount => 'या खात्यात नोंदवा';

  @override
  String get bankingLinesNarration => 'तपशील';

  @override
  String bankingLinesRule(String account) {
    return 'नियम: $account';
  }

  @override
  String get bankingLinesApplyRules => 'नियमानुसार सर्व नोंदवा';

  @override
  String bankingLinesRulesDone(String count) {
    return '$count नोंदी झाल्या.';
  }

  @override
  String get bankingLinesNone => 'येथे काहीही नाही.';

  @override
  String bankingLinesEntries(String from, String to) {
    return '$from ते $to मधील न जुळलेल्या नोंदी';
  }

  @override
  String get bankingLinesMatchSelected => 'निवडलेले जुळवा';

  @override
  String bankingLinesSelectedTotal(String total, String amount) {
    return '$amount पैकी $total निवडले';
  }

  @override
  String get bankingLinesReasonsAmount => 'सारखी रक्कम';

  @override
  String get bankingLinesReasonsSameDay => 'त्याच दिवशी';

  @override
  String get bankingLinesReasonsReference => 'सारखा संदर्भ';

  @override
  String get bankingLinesReasonsParty => 'पक्षाचे नाव';

  @override
  String get bankingBrsAsOf => 'या तारखेला';

  @override
  String get bankingBrsPerBooks => 'हिशेबानुसार शिल्लक';

  @override
  String get bankingBrsNotPresented => 'अधिक: दिलेले पण अजून न वटलेले धनादेश';

  @override
  String get bankingBrsNotCredited => 'वजा: बँकेने अजून जमा न केलेल्या ठेवी';

  @override
  String get bankingBrsBankDebits => 'वजा: हिशेबात नसलेले बँकेचे नावे';

  @override
  String get bankingBrsBankCredits => 'अधिक: हिशेबात नसलेले बँकेचे जमा';

  @override
  String get bankingBrsPerBank => 'बँकेनुसार शिल्लक';

  @override
  String bankingBrsStatement(String date) {
    return '$date रोजी विवरण शिल्लक';
  }

  @override
  String get bankingBrsDifference => 'फरक';

  @override
  String get bankingBrsBalanced => 'जुळले';

  @override
  String get bankingRulesTitle => 'बँक नियम';

  @override
  String get bankingRulesSubtitle =>
      'हे शब्द असलेल्या विवरण ओळी एका क्लिकमध्ये खात्यात नोंदवल्या जातात (बँक शुल्क, व्याज, स्थायी सूचना).';

  @override
  String get bankingRulesContains => 'तपशीलात आहे';

  @override
  String get bankingRulesDirection => 'पैसे';

  @override
  String get bankingRulesDirectionsIn => 'आले';

  @override
  String get bankingRulesDirectionsOut => 'गेले';

  @override
  String get bankingRulesDirectionsAny => 'आले किंवा गेले';

  @override
  String get bankingRulesAccount => 'यात नोंदवा';

  @override
  String get bankingRulesNarration => 'तपशील';

  @override
  String get bankingRulesPriority => 'प्राधान्य';

  @override
  String get bankingRulesAdd => 'नियम जोडा';

  @override
  String get bankingRulesSave => 'जतन करा';

  @override
  String get bankingSettlementsTitle => 'गेटवे सेटलमेंट';

  @override
  String get bankingSettlementsSubtitle =>
      'Razorpay, PhonePe, Paytm इत्यादींकडून येणारी रक्कम: संकलन वजा परतावे, शुल्क आणि शुल्कावरील जीएसटी, बँकेत एकच जमा म्हणून.';

  @override
  String get bankingSettlementsProvider => 'गेटवे';

  @override
  String get bankingSettlementsBank => 'यात जमा';

  @override
  String get bankingSettlementsClearing => 'संकलन येथे नोंदवले होते';

  @override
  String get bankingSettlementsFile => 'सेटलमेंट अहवाल (CSV)';

  @override
  String get bankingSettlementsImport => 'आयात करा';

  @override
  String bankingSettlementsDone(String posted, String skipped, String matched) {
    return '$posted रकमा नोंदवल्या, $skipped आधीच झाल्या होत्या, $matched बँकेशी जुळल्या.';
  }

  @override
  String get bankingSettlementsSettlementId => 'सेटलमेंट';

  @override
  String get bankingSettlementsSettledOn => 'सेटल तारीख';

  @override
  String get bankingSettlementsPayments => 'भरणा';

  @override
  String get bankingSettlementsGross => 'संकलित';

  @override
  String get bankingSettlementsRefunds => 'परतावे';

  @override
  String get bankingSettlementsFees => 'शुल्क';

  @override
  String get bankingSettlementsTax => 'शुल्कावर जीएसटी';

  @override
  String get bankingSettlementsNet => 'दिलेली रक्कम';

  @override
  String get bankingSettlementsMatched => 'बँकेत';

  @override
  String get bankingSettlementsNone => 'अजून सेटलमेंट नाहीत.';

  @override
  String get bankingErrorsNoHeader =>
      'शीर्षक ओळ सापडली नाही. विवरण त्याच्या स्तंभ शीर्षकांसह CSV म्हणून जतन करा.';

  @override
  String get bankingErrorsNoRows => 'फाइलमध्ये व्यवहार सापडले नाहीत.';

  @override
  String get bankingErrorsBadAmount => 'फाइलमधील एक रक्कम वाचता आली नाही.';

  @override
  String get bankingErrorsUnknownFormat =>
      'हा सेटलमेंट अहवाल वाटत नाही (settlement id, amount आणि fee स्तंभ हवेत).';

  @override
  String get bankingErrorsInvalidFile => 'फाइल वाचता आली नाही.';

  @override
  String get bankingErrorsNotABankAccount => 'Bank Accounts खालील खाते निवडा.';

  @override
  String get bankingErrorsFeedNotConnected => 'आधी बँक फीड जोडा.';

  @override
  String get bankingErrorsLineAlreadyMatched => 'ती ओळ आधीच जुळली आहे.';

  @override
  String get bankingErrorsVoucherNotOpen =>
      'ती नोंद आधीच जुळली आहे किंवा रद्द आहे.';

  @override
  String get bankingErrorsWrongDirection =>
      'आलेले पैसे फक्त पावत्यांशी, गेलेले फक्त भरण्यांशी जुळतात.';

  @override
  String get bankingErrorsAmountsDiffer =>
      'नोंदींची बेरीज ओळीच्या रकमेइतकी होत नाही.';

  @override
  String get bankingErrorsSameAccount => 'वेगळे खाते निवडा.';

  @override
  String get bankingErrorsInvalidIfsc => 'वैध आयएफएससी टाका.';

  @override
  String get assetsRegisterTitle => 'स्थिर मालमत्ता';

  @override
  String get assetsRegisterSubtitle =>
      'नोंदवही, कंपनी कायद्यानुसार घसारा आणि आयकर गट तक्ता.';

  @override
  String get assetsRegisterNew => 'मालमत्ता जोडा';

  @override
  String get assetsRegisterCode => 'कोड';

  @override
  String get assetsRegisterName => 'मालमत्ता';

  @override
  String get assetsRegisterClass => 'वर्ग';

  @override
  String get assetsRegisterPurchased => 'खरेदी';

  @override
  String get assetsRegisterPutToUse => 'वापरात पासून';

  @override
  String get assetsRegisterCost => 'किंमत';

  @override
  String get assetsRegisterAccumulated => 'आजपर्यंतचा घसारा';

  @override
  String get assetsRegisterBookValue => 'पुस्तकी मूल्य';

  @override
  String get assetsRegisterStatus => 'स्थिती';

  @override
  String get assetsRegisterStatusesActive => 'वापरात';

  @override
  String get assetsRegisterStatusesDisposed => 'विकले / भंगार';

  @override
  String get assetsRegisterLocation => 'ठिकाण';

  @override
  String get assetsRegisterSerialNo => 'अनुक्रमांक';

  @override
  String get assetsRegisterCustodian => 'यांच्याकडे';

  @override
  String get assetsRegisterNone => 'अजून मालमत्ता नाही.';

  @override
  String get assetsClassesTitle => 'मालमत्ता वर्ग';

  @override
  String get assetsClassesPresets => 'मानक वर्ग जोडा';

  @override
  String get assetsClassesPreset => 'वर्ग';

  @override
  String get assetsClassesAdd => 'जोडा';

  @override
  String get assetsClassesCustom => 'किंवा तुमचा स्वतःचा ठरवा';

  @override
  String get assetsClassesName => 'नाव';

  @override
  String get assetsClassesMethod => 'पद्धत';

  @override
  String get assetsClassesMethodsSlm => 'सरळ रेषा';

  @override
  String get assetsClassesMethodsWdv => 'लिखित मूल्य (WDV)';

  @override
  String get assetsClassesLife => 'उपयुक्त आयुष्य (वर्षे)';

  @override
  String get assetsClassesResidual => 'अवशिष्ट मूल्य %';

  @override
  String get assetsClassesItBlock => 'आयकर गट';

  @override
  String get assetsClassesItRate => 'कर दर %';

  @override
  String get assetsClassesBlocksBuilding => 'इमारती';

  @override
  String get assetsClassesBlocksPlantMachinery => 'संयंत्र आणि यंत्रसामग्री';

  @override
  String get assetsClassesBlocksFurniture => 'फर्निचर आणि फिटिंग्ज';

  @override
  String get assetsClassesBlocksComputers => 'संगणक आणि सॉफ्टवेअर';

  @override
  String get assetsClassesBlocksIntangibles => 'अमूर्त मालमत्ता';

  @override
  String get assetsFormAcquisition => 'कशी आली';

  @override
  String get assetsFormAcquisitionsSupplier => 'उधारीवर खरेदी';

  @override
  String get assetsFormAcquisitionsPaid => 'रोख किंवा बँकेतून भरले';

  @override
  String get assetsFormAcquisitionsOpening => 'आधीच हिशेबात (पुढे आणलेली)';

  @override
  String get assetsFormSupplier => 'पुरवठादार';

  @override
  String get assetsFormPaidFrom => 'यातून भरले';

  @override
  String get assetsFormGstRate => 'जीएसटी दर % (इनपुट क्रेडिट घेतले)';

  @override
  String get assetsFormSupplierGstin => 'पुरवठादाराचा जीएसटीआयएन';

  @override
  String get assetsFormInvoiceRef => 'बिल क्र.';

  @override
  String get assetsFormOpeningAccumulated => 'आधी लावलेला घसारा';

  @override
  String get assetsFormNotes => 'टिपा';

  @override
  String get assetsFormSave => 'मालमत्ता जोडा';

  @override
  String get assetsDetailHistory => 'लावलेला घसारा';

  @override
  String get assetsDetailPeriod => 'कालावधी';

  @override
  String get assetsDetailDays => 'दिवस';

  @override
  String get assetsDetailVoucher => 'नोंद';

  @override
  String get assetsDetailDispose => 'विका किंवा भंगारात काढा';

  @override
  String get assetsDetailDisposeDate => 'तारीख';

  @override
  String get assetsDetailSaleValue => 'विक्री मूल्य (₹, भंगार असल्यास 0)';

  @override
  String get assetsDetailReceivedIn => 'यात मिळाले';

  @override
  String get assetsDetailSaleGst => 'विक्रीवर जीएसटी %';

  @override
  String get assetsDetailBuyerState =>
      'खरेदीदाराचे राज्य (तुमच्या राज्याबाहेर असल्यास)';

  @override
  String get assetsDetailDisposeButton => 'विक्री नोंदवा';

  @override
  String assetsDetailDisposed(String date, String value) {
    return '$date रोजी $value ला विकले';
  }

  @override
  String get assetsDetailProfit => 'विक्रीवर नफा';

  @override
  String get assetsDetailLoss => 'विक्रीवर तोटा';

  @override
  String get assetsDetailPurchase => 'खरेदी नोंद';

  @override
  String get assetsDepreciationTitle => 'घसारा';

  @override
  String get assetsDepreciationSubtitle =>
      'महिना, तिमाही किंवा वर्षाचा घसारा लावा. प्रत्येक मालमत्ता शेवटच्या वेळी जिथे थांबली तिथून पुढे जाते.';

  @override
  String get assetsDepreciationFrom => 'पासून';

  @override
  String get assetsDepreciationTo => 'पर्यंत';

  @override
  String get assetsDepreciationPreview => 'मोजा';

  @override
  String get assetsDepreciationPost => 'घसारा नोंदवा';

  @override
  String get assetsDepreciationTotal => 'एकूण';

  @override
  String get assetsDepreciationRuns => 'नोंदी';

  @override
  String get assetsDepreciationNone => 'या कालावधीत लावण्यासारखे काही नाही.';

  @override
  String get assetsDepreciationCancel => 'नोंद रद्द करा';

  @override
  String assetsDepreciationAssets(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count मालमत्ता',
      one: '$count मालमत्ता',
    );
    return '$_temp0';
  }

  @override
  String get assetsItTitle => 'आयकर घसारा';

  @override
  String get assetsItSubtitle =>
      'गटनिहाय, कर लेखापरीक्षण अहवालाप्रमाणे (फॉर्म 3CD, कलम 18). 180 दिवसांपेक्षा कमी वापरलेल्या भरींना निम्मा दर.';

  @override
  String get assetsItFy => 'वर्ष';

  @override
  String get assetsItBlock => 'गट';

  @override
  String get assetsItRate => 'दर';

  @override
  String get assetsItOpening => 'सुरुवातीचे WDV';

  @override
  String get assetsItAddFull => 'भर (180 दिवस किंवा जास्त)';

  @override
  String get assetsItAddHalf => 'भर (180 दिवसांपेक्षा कमी)';

  @override
  String get assetsItSales => 'विक्री';

  @override
  String get assetsItDepreciation => 'घसारा';

  @override
  String get assetsItClosing => 'अखेरचे WDV';

  @override
  String get assetsItGain => 'अल्पकालीन लाभ';

  @override
  String get assetsItLoss => 'अल्पकालीन तोटा';

  @override
  String get assetsItOpeningTitle => 'सुरुवातीचे लिखित मूल्य';

  @override
  String get assetsItOpeningHint =>
      'तुमच्या शेवटच्या कर रिटर्नवरून पहिल्या वर्षाच्या सुरुवातीचे प्रत्येक गटाचे WDV टाका; पुढील वर्षे आपोआप पुढे जातात.';

  @override
  String get assetsItSave => 'जतन करा';

  @override
  String get assetsItTotal => 'एकूण';

  @override
  String get assetsItNone => 'या वर्षी मालमत्ता नाही.';

  @override
  String get assetsErrorsClassExists => 'तो वर्ग आधीच आहे.';

  @override
  String get assetsErrorsClassIncomplete => 'नाव, आयुष्य आणि कर गट भरा.';

  @override
  String get assetsErrorsUnknownPreset => 'वर्ग निवडा.';

  @override
  String get assetsErrorsInvalidLife => 'उपयुक्त आयुष्य वर्षांत टाका.';

  @override
  String get assetsErrorsInvalidResidual =>
      'लिखित मूल्य पद्धतीसाठी अवशिष्ट मूल्य 0% पेक्षा जास्त हवे.';

  @override
  String get assetsErrorsUnknownClass => 'वर्ग निवडा.';

  @override
  String get assetsErrorsClassArchived => 'तो वर्ग संग्रहित आहे.';

  @override
  String get assetsErrorsInvalidCost => 'किंमत टाका.';

  @override
  String get assetsErrorsUsedBeforeBought => 'खरेदीपूर्वी वापरात असू शकत नाही.';

  @override
  String get assetsErrorsAccountRequired => 'खाते निवडा.';

  @override
  String get assetsErrorsNotASupplier => 'पुरवठादार निवडा.';

  @override
  String get assetsErrorsNotCashOrBank => 'रोख किंवा बँक खाते निवडा.';

  @override
  String get assetsErrorsSupplierGstinRequired =>
      'इनपुट क्रेडिट घेण्यासाठी पुरवठादाराचा जीएसटीआयएन टाका.';

  @override
  String get assetsErrorsPeriodCrossesYear => 'कालावधी एकाच आर्थिक वर्षात हवा.';

  @override
  String get assetsErrorsNothingToDepreciate =>
      'या कालावधीत लावण्यासारखे काही नाही.';

  @override
  String get assetsErrorsLaterRunExists =>
      'नंतरच्या नोंदीत या मालमत्तांवर घसारा आहे; आधी ती रद्द करा.';

  @override
  String get assetsErrorsAssetDisposed =>
      'या नोंदीतील एक मालमत्ता विकली गेली आहे.';

  @override
  String get assetsErrorsAlreadyDisposed => 'ही मालमत्ता आधीच विकली आहे.';

  @override
  String get assetsErrorsSoldBeforeUse =>
      'विक्रीची तारीख वापरात येण्यापूर्वीची आहे.';

  @override
  String get assetsErrorsDepreciatedPastSale =>
      'विक्री तारखेनंतरचा घसारा लावला आहे; आधी ती नोंद रद्द करा.';

  @override
  String get assetsErrorsInvalidDepreciation => 'घसारा मोजता आला नाही.';

  @override
  String get assetsErrorsInvalidFy => 'वर्ष निवडा.';

  @override
  String get expensesClaimsTitle => 'खर्च दावे';

  @override
  String get expensesClaimsSubtitle =>
      'कर्मचारी केलेल्या खर्चाचा दावा करतात; मंजुरीवर तो नोंदवला जातो (परवानगी असल्यास जीएसटी क्रेडिटसह) आणि भरल्यावर पूर्ण होतो.';

  @override
  String get expensesClaimsNew => 'नवीन दावा';

  @override
  String get expensesClaimsNumber => 'दावा';

  @override
  String get expensesClaimsEmployee => 'कर्मचारी';

  @override
  String get expensesClaimsDate => 'तारीख';

  @override
  String get expensesClaimsClaimTitle => 'उद्देश';

  @override
  String get expensesClaimsTotal => 'रक्कम';

  @override
  String get expensesClaimsItc => 'जीएसटी क्रेडिट';

  @override
  String get expensesClaimsStatus => 'स्थिती';

  @override
  String get expensesClaimsStatusesDraft => 'मसुदा';

  @override
  String get expensesClaimsStatusesSubmitted => 'मंजुरीच्या प्रतीक्षेत';

  @override
  String get expensesClaimsStatusesApproved => 'मंजूर';

  @override
  String get expensesClaimsStatusesRejected => 'नाकारले';

  @override
  String get expensesClaimsStatusesPaid => 'दिले';

  @override
  String get expensesClaimsStatusesCancelled => 'रद्द';

  @override
  String get expensesClaimsWaiting => 'मंजुरीच्या प्रतीक्षेत';

  @override
  String get expensesClaimsToPay => 'मंजूर, द्यायचे';

  @override
  String get expensesClaimsNone => 'अजून दावे नाहीत.';

  @override
  String get expensesClaimsAll => 'सर्व';

  @override
  String get expensesFormTitle => 'खर्च दावा';

  @override
  String get expensesFormProject => 'प्रकल्प';

  @override
  String get expensesFormLines => 'खर्च';

  @override
  String get expensesFormCategory => 'प्रकार';

  @override
  String get expensesFormDescription => 'तपशील';

  @override
  String get expensesFormAmount => 'रक्कम (₹)';

  @override
  String get expensesFormGstRate => 'जीएसटी %';

  @override
  String get expensesFormVendor => 'विक्रेता';

  @override
  String get expensesFormVendorGstin => 'विक्रेत्याचा जीएसटीआयएन';

  @override
  String get expensesFormInvoiceNo => 'बिल क्र.';

  @override
  String get expensesFormReceipt => 'पावती';

  @override
  String get expensesFormUpload => 'जोडा';

  @override
  String get expensesFormRead => 'पावती वाचा';

  @override
  String get expensesFormReading => 'वाचत आहे…';

  @override
  String get expensesFormReadDone => 'पावतीवरून भरले. कृपया तपासा.';

  @override
  String get expensesFormReadNone =>
      'ही पावती वाचता आली नाही; कृपया तपशील भरा.';

  @override
  String get expensesFormReadDemo =>
      'आपोआप वाचणे सुरू केलेले नाही; कृपया तपशील भरा.';

  @override
  String get expensesFormAddLine => 'खर्च जोडा';

  @override
  String get expensesFormSaveDraft => 'मसुदा जतन करा';

  @override
  String get expensesFormSubmit => 'मंजुरीसाठी पाठवा';

  @override
  String get expensesFormItcHint =>
      'बिल कंपनीच्या नावे विक्रेत्याच्या जीएसटीआयएनसह कर बीजक असेल आणि प्रकाराला परवानगी असेल तेव्हा जीएसटी क्रेडिट घेतले जाते.';

  @override
  String get expensesDetailApprove => 'मंजूर करा';

  @override
  String get expensesDetailReject => 'नाकारा';

  @override
  String get expensesDetailReason => 'कारण';

  @override
  String get expensesDetailPay => 'द्या';

  @override
  String get expensesDetailPayFrom => 'यातून द्या';

  @override
  String get expensesDetailPaidOn => 'भरण्याची तारीख';

  @override
  String get expensesDetailEdit => 'बदला';

  @override
  String get expensesDetailSubmit => 'पाठवा';

  @override
  String get expensesDetailCancel => 'दावा रद्द करा';

  @override
  String get expensesDetailVoucher => 'खर्च नोंद';

  @override
  String get expensesDetailPaymentVoucher => 'भरणा';

  @override
  String expensesDetailRejected(String reason) {
    return 'नाकारले: $reason';
  }

  @override
  String get expensesDetailReceipt => 'पावती पहा';

  @override
  String get expensesCategoriesTitle => 'खर्च प्रकार';

  @override
  String get expensesCategoriesSubtitle =>
      'प्रत्येक प्रकारचा खर्च कोणत्या खात्यात जातो, मर्यादा आणि जीएसटी क्रेडिट अवरोधित आहे का (कलम 17(5)).';

  @override
  String get expensesCategoriesName => 'प्रकार';

  @override
  String get expensesCategoriesAccount => 'खाते';

  @override
  String get expensesCategoriesBlocked => 'जीएसटी क्रेडिट नाही';

  @override
  String get expensesCategoriesLimit => 'प्रति दावा मर्यादा (₹)';

  @override
  String get expensesCategoriesReceiptAbove =>
      'यापेक्षा जास्त असल्यास पावती हवी (₹)';

  @override
  String get expensesCategoriesAdd => 'प्रकार जोडा';

  @override
  String get expensesCategoriesSave => 'जतन करा';

  @override
  String get expensesErrorsNoLines => 'किमान एक खर्च जोडा.';

  @override
  String get expensesErrorsUnknownCategory => 'प्रकार निवडा.';

  @override
  String get expensesErrorsCategoryArchived => 'तो प्रकार संग्रहित आहे.';

  @override
  String get expensesErrorsInvalidAmount => 'रक्कम टाका.';

  @override
  String get expensesErrorsReceiptRequired => 'या खर्चाची पावती जोडा.';

  @override
  String get expensesErrorsOverLimit =>
      'हे प्रकाराच्या प्रति दावा मर्यादेपेक्षा जास्त आहे.';

  @override
  String get expensesErrorsInvalidGstin => 'विक्रेत्याचा जीएसटीआयएन वैध नाही.';

  @override
  String get expensesErrorsUnknownEmployee => 'कर्मचारी निवडा.';

  @override
  String get expensesErrorsUnknownProject => 'प्रकल्प निवडा.';

  @override
  String get expensesErrorsClaimLocked =>
      'फक्त मसुदा किंवा नाकारलेला दावा बदलता येतो.';

  @override
  String get expensesErrorsClaimNotSubmitted =>
      'दावा मंजुरीच्या प्रतीक्षेत नाही.';

  @override
  String get expensesErrorsClaimNotApproved => 'आधी दावा मंजूर करा.';

  @override
  String get expensesErrorsClaimPaid =>
      'दिलेला दावा रद्द करता येत नाही; आधी भरणा रद्द करा.';

  @override
  String get expensesErrorsPaidBeforeClaim =>
      'भरण्याची तारीख दाव्यापूर्वीची आहे.';

  @override
  String get expensesErrorsCategoryExists => 'तो प्रकार आधीच आहे.';

  @override
  String get expensesErrorsNotAnExpenseAccount => 'खर्चाचे खाते निवडा.';

  @override
  String get expensesErrorsFileType => 'फोटो (JPG, PNG, WebP) किंवा PDF जोडा.';

  @override
  String get expensesErrorsFileTooLarge => 'फाइल 5 MB पेक्षा मोठी आहे.';

  @override
  String get expensesErrorsFileEmpty => 'फाइल रिकामी आहे.';

  @override
  String get projectsListTitle => 'प्रकल्प';

  @override
  String get projectsListSubtitle =>
      'प्रत्येक कामाची कार्ये, वेळ, खर्च आणि बिलिंग.';

  @override
  String get projectsListNew => 'नवीन प्रकल्प';

  @override
  String get projectsListCode => 'कोड';

  @override
  String get projectsListName => 'प्रकल्प';

  @override
  String get projectsListCustomer => 'ग्राहक';

  @override
  String get projectsListBilling => 'बिलिंग';

  @override
  String get projectsListBillingsFixed => 'ठराविक किंमत';

  @override
  String get projectsListBillingsTimeMaterial => 'वेळ आणि साहित्य';

  @override
  String get projectsListBillingsNonBillable => 'अंतर्गत';

  @override
  String get projectsListStatus => 'स्थिती';

  @override
  String get projectsListStatusesActive => 'सक्रिय';

  @override
  String get projectsListStatusesOnHold => 'थांबवलेला';

  @override
  String get projectsListStatusesCompleted => 'पूर्ण';

  @override
  String get projectsListStatusesCancelled => 'रद्द';

  @override
  String get projectsListRevenue => 'बिल केले';

  @override
  String get projectsListCost => 'खर्च';

  @override
  String get projectsListMargin => 'नफा';

  @override
  String get projectsListHours => 'तास';

  @override
  String get projectsListNone => 'अजून प्रकल्प नाहीत.';

  @override
  String get projectsFormContractValue => 'कराराचे मूल्य (₹)';

  @override
  String get projectsFormBudgetCost => 'अंदाजपत्रकीय खर्च (₹)';

  @override
  String get projectsFormBudgetHours => 'अंदाजपत्रकीय तास';

  @override
  String get projectsFormBillRate => 'प्रति तास बिल दर (₹)';

  @override
  String get projectsFormBillingItem => 'बीजकावर (सेवा वस्तू)';

  @override
  String get projectsFormStartOn => 'सुरुवात';

  @override
  String get projectsFormEndOn => 'शेवट';

  @override
  String get projectsFormNotes => 'टिपा';

  @override
  String get projectsFormSave => 'प्रकल्प जतन करा';

  @override
  String get projectsDetailLabour => 'मजुरी';

  @override
  String get projectsDetailExpenses => 'खर्च';

  @override
  String get projectsDetailPurchases => 'खरेदी';

  @override
  String get projectsDetailUnbilled => 'बिल न केलेला वेळ';

  @override
  String projectsDetailBudgetUsed(String pct) {
    return 'अंदाजपत्रकाच्या $pct%';
  }

  @override
  String projectsDetailHoursUsed(String pct) {
    return 'तासांच्या $pct%';
  }

  @override
  String projectsDetailMarginPct(String pct) {
    return '$pct% नफा';
  }

  @override
  String get projectsDetailTasks => 'कार्ये';

  @override
  String get projectsDetailTask => 'कार्य';

  @override
  String get projectsDetailAssignee => 'यांना सोपवले';

  @override
  String get projectsDetailEstimate => 'अंदाज (तास)';

  @override
  String get projectsDetailLogged => 'नोंदवले (तास)';

  @override
  String get projectsDetailDue => 'मुदत';

  @override
  String get projectsDetailTaskStatusesTodo => 'करायचे';

  @override
  String get projectsDetailTaskStatusesDoing => 'सुरू';

  @override
  String get projectsDetailTaskStatusesDone => 'पूर्ण';

  @override
  String get projectsDetailAddTask => 'कार्य जोडा';

  @override
  String get projectsDetailMembers => 'टीम आणि दर';

  @override
  String get projectsDetailMember => 'व्यक्ती';

  @override
  String get projectsDetailMemberRate => 'बिल दर (₹/तास)';

  @override
  String get projectsDetailAddMember => 'जोडा';

  @override
  String get projectsDetailMilestones => 'टप्पे';

  @override
  String get projectsDetailMilestone => 'टप्पा';

  @override
  String get projectsDetailAmount => 'रक्कम (₹)';

  @override
  String get projectsDetailAddMilestone => 'टप्पा जोडा';

  @override
  String get projectsDetailBill => 'बीजक करा';

  @override
  String projectsDetailBilled(String number) {
    return 'बीजक $number';
  }

  @override
  String get projectsDetailTime => 'वेळ';

  @override
  String get projectsDetailBillTime => 'मंजूर तासांचे बीजक करा';

  @override
  String get projectsDetailBillUpTo => 'पर्यंत';

  @override
  String get projectsDetailInvoices => 'बीजके';

  @override
  String get projectsDetailEdit => 'प्रकल्प बदला';

  @override
  String get projectsDetailRemove => 'काढा';

  @override
  String projectsDetailInvoiced(String number) {
    return 'बीजक $number तयार झाले.';
  }

  @override
  String get projectsTimeTitle => 'वेळपत्रके';

  @override
  String get projectsTimeSubtitle =>
      'प्रकल्पांवर तास नोंदवा; मंजूर बिलयोग्य तासांचे बीजक करता येते.';

  @override
  String get projectsTimeLog => 'वेळ नोंदवा';

  @override
  String get projectsTimeEmployee => 'कर्मचारी';

  @override
  String get projectsTimeProject => 'प्रकल्प';

  @override
  String get projectsTimeTask => 'कार्य';

  @override
  String get projectsTimeDate => 'तारीख';

  @override
  String get projectsTimeHours => 'तास';

  @override
  String get projectsTimeBillable => 'बिलयोग्य';

  @override
  String get projectsTimeNote => 'टीप';

  @override
  String get projectsTimeSave => 'नोंदवा';

  @override
  String get projectsTimeApprove => 'मंजूर करा';

  @override
  String get projectsTimeReject => 'नाकारा';

  @override
  String projectsTimeSelected(String count) {
    return '$count निवडले';
  }

  @override
  String get projectsTimeStatusesSubmitted => 'पाठवले';

  @override
  String get projectsTimeStatusesApproved => 'मंजूर';

  @override
  String get projectsTimeStatusesRejected => 'नाकारले';

  @override
  String get projectsTimeStatusesBilled => 'बीजक झाले';

  @override
  String get projectsTimeTotal => 'एकूण';

  @override
  String get projectsTimeNone => 'वेळ नोंदवलेला नाही.';

  @override
  String get projectsTimeCostRate => 'खर्च/तास';

  @override
  String get projectsTimeBillRate => 'बिल/तास';

  @override
  String get projectsTimeDelete => 'हटवा';

  @override
  String get projectsErrorsNotACustomer => 'ग्राहक निवडा.';

  @override
  String get projectsErrorsUnknownItem => 'सेवा वस्तू निवडा.';

  @override
  String get projectsErrorsEndsBeforeStart =>
      'शेवटची तारीख सुरुवातीपूर्वीची आहे.';

  @override
  String get projectsErrorsProjectCustomerRequired =>
      'आधी प्रकल्पाचा ग्राहक ठरवा.';

  @override
  String get projectsErrorsBillingItemRequired =>
      'प्रकल्पात बीजकासाठी वस्तू निवडा.';

  @override
  String get projectsErrorsMilestoneBilled =>
      'त्या टप्प्याचे बीजक आधीच झाले आहे.';

  @override
  String get projectsErrorsProjectNotActive => 'प्रकल्प सक्रिय नाही.';

  @override
  String get projectsErrorsInvalidHours => '0 ते 24 मधील तास टाका.';

  @override
  String get projectsErrorsTooManyHours => 'एका दिवसात 24 तासांपेक्षा जास्त.';

  @override
  String get projectsErrorsUnknownTask => 'या प्रकल्पातील कार्य निवडा.';

  @override
  String get projectsErrorsTimesheetLocked =>
      'मंजूर किंवा बीजक झालेला वेळ बदलता येत नाही.';

  @override
  String get projectsErrorsNothingToBill =>
      'बीजकासाठी मंजूर बिलयोग्य तास नाहीत.';

  @override
  String get projectsErrorsNotTimeAndMaterial =>
      'फक्त वेळ-आणि-साहित्य प्रकल्पांचे तासावर बिल होते.';

  @override
  String get projectsErrorsNotEmployedOnDate =>
      'त्या तारखेला कर्मचारी नोकरीत नव्हता.';

  @override
  String get projectsErrorsUnknownEmployee => 'कर्मचारी निवडा.';

  @override
  String alertsOverdue60(num count, String amount) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count ग्राहकांचे',
      one: '$count ग्राहकाचे',
    );
    return '$_temp0 पैसे 60 दिवसांपेक्षा जास्त थकले आहेत: $amount';
  }

  @override
  String alertsGstOverdue(String form, String period, String days) {
    return '$period चा $form $days दिवस उशिरा आहे';
  }

  @override
  String alertsGstDue(String form, String period, String days) {
    return '$period चा $form $days दिवसांत देय आहे';
  }

  @override
  String alertsLowStock(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count वस्तू',
      one: '$count वस्तू',
    );
    return '$_temp0 पुनर्मागणी पातळीखाली';
  }

  @override
  String alertsUnmatchedBank(String count) {
    return '$count बँक विवरण ओळी आठवड्यापेक्षा जास्त काळ जुळणीच्या प्रतीक्षेत आहेत';
  }

  @override
  String alertsClaimsWaiting(String count) {
    return '$count खर्च दावे 3 दिवसांपेक्षा जास्त काळ मंजुरीच्या प्रतीक्षेत आहेत';
  }

  @override
  String alertsFollowUpsLate(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count पाठपुरावे उशिरा आहेत',
      one: '$count पाठपुरावा उशिरा आहे',
    );
    return '$_temp0';
  }

  @override
  String alertsNegativeCash(String name, String amount) {
    return '$name मध्ये उणे शिल्लक ($amount) आहे: एखादी नोंद राहिली आहे किंवा चुकीची आहे';
  }

  @override
  String alertsApprovalInvoiceDue(num count) {
    return '$count मंजुरी मेमो सहा महिन्यांच्या इनव्हॉइस मर्यादेजवळ आहेत';
  }

  @override
  String alertsApprovalsOut(num count) {
    return '$count मंजुरी मेमोचा माल 30 दिवसांपेक्षा जास्त बाहेर आहे';
  }

  @override
  String alertsSensitiveChanges(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count संवेदनशील बदल',
      one: '$count संवेदनशील बदल',
    );
    return 'गेल्या 7 दिवसांत $_temp0 (बँक तपशील, उधार अटी, कर सेटिंग किंवा अधिकार)';
  }

  @override
  String alertsKycExpiring(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count कर्मचारी दस्तऐवज',
      one: '$count कर्मचारी दस्तऐवज',
    );
    return '$_temp0 संपले आहेत किंवा 30 दिवसांत संपतील';
  }

  @override
  String get checksTitle => 'तपासण्या';

  @override
  String get checksSubtitle =>
      'तुमच्या सीएने पाहण्यापूर्वी पुन्हा पाहण्याजोग्या नोंदी: आयकर कायद्यानुसार रोख मर्यादा, संभाव्य दुहेरी बिले, खर्चापेक्षा कमी दराने विक्री, शून्याखाली स्टॉक.';

  @override
  String get checksNone => 'काहीही असामान्य आढळले नाही.';

  @override
  String checksKindsCash40A3(String party, String amount) {
    return '$party ला रोख दिले: एका दिवसात $amount. एका व्यक्तीला एका दिवसात ₹10,000 पेक्षा जास्त रोख खर्च मान्य नाही (कलम 40A(3)); बँकेने द्या.';
  }

  @override
  String checksKindsCash269ST(String party, String amount) {
    return '$party कडून रोख मिळाले: एका दिवसात $amount. ₹2 लाख किंवा जास्त रोख स्वीकारणे मान्य नाही (कलम 269ST); दंड त्याच रकमेइतका.';
  }

  @override
  String checksKindsDuplicateBill(
    String supplier,
    String amount,
    String first,
    String second,
  ) {
    return '$supplier ने आठवड्यात दोनदा $amount चे बिल दिले ($first आणि $second). एक दुहेरी आहे का?';
  }

  @override
  String checksKindsBelowCost(
    String number,
    String item,
    String rate,
    String cost,
  ) {
    return '$number: $item $rate ला विकले, खरेदी दर $cost पेक्षा कमी.';
  }

  @override
  String checksKindsNegativeStock(String item, String qty, String uom) {
    return '$item $qty $uom वर आहे: स्टॉकपेक्षा जास्त विकले किंवा दिले गेले.';
  }

  @override
  String get assistantTitle => 'सहाय्यक';

  @override
  String get assistantSubtitle =>
      'विक्री, येणे-देणे, नफा, स्टॉक किंवा जीएसटीबद्दल विचारा. तो तुमचे हिशेब वाचतो; कधीही बदलत नाही.';

  @override
  String get assistantPlaceholder => 'प्रश्न विचारा…';

  @override
  String get assistantSend => 'विचारा';

  @override
  String get assistantThinking => 'शोधत आहे…';

  @override
  String get assistantClear => 'नवीन संभाषण';

  @override
  String get assistantDemo =>
      'अंगभूत सहाय्यक: सामान्य प्रश्नांची उत्तरे देतो. काहीही विचारण्यासाठी AI सेवा जोडा.';

  @override
  String get assistantClaude =>
      'तुमच्या हिशेबातून, तुमच्या प्रवेश अधिकारांसह Claude ने उत्तर दिले.';

  @override
  String get assistantSuggestionsS1 =>
      'आपले सर्वात जास्त पैसे कोणाकडे थकले आहेत?';

  @override
  String get assistantSuggestionsS2 => 'या महिन्यात विक्री कशी आहे?';

  @override
  String get assistantSuggestionsS3 => 'या महिन्यात आपला नफा किती?';

  @override
  String get assistantSuggestionsS4 =>
      'कोणत्या वस्तू पुनर्मागणी पातळीखाली आहेत?';

  @override
  String get assistantSuggestionsS5 => 'मी तपासाव्या अशा काही नोंदी आहेत का?';

  @override
  String assistantTools(String tools) {
    return 'पाहिले: $tools';
  }

  @override
  String get assistantErrorsAssistantBusy =>
      'सहाय्यक व्यस्त आहे; एका मिनिटाने पुन्हा प्रयत्न करा.';

  @override
  String get assistantErrorsAssistantFailed =>
      'सहाय्यक आत्ता उत्तर देऊ शकला नाही.';

  @override
  String get assistantErrorsEmptyQuestion => 'प्रश्न टाइप करा.';

  @override
  String get crmLeadsTitle => 'लीड्स';

  @override
  String get crmLeadsSubtitle =>
      'पहिल्या चौकशीपासून ऑर्डरपर्यंत संभाव्य ग्राहक.';

  @override
  String get crmLeadsNew => 'नवीन लीड';

  @override
  String get crmLeadsName => 'संपर्क व्यक्ती';

  @override
  String get crmLeadsOrganisation => 'व्यवसाय';

  @override
  String get crmLeadsPhone => 'मोबाइल';

  @override
  String get crmLeadsEmail => 'ईमेल';

  @override
  String get crmLeadsGstin => 'जीएसटीआयएन';

  @override
  String get crmLeadsState => 'राज्य';

  @override
  String get crmLeadsCity => 'शहर';

  @override
  String get crmLeadsSource => 'स्रोत';

  @override
  String get crmLeadsSourcesWalkIn => 'थेट भेट';

  @override
  String get crmLeadsSourcesReferral => 'शिफारस';

  @override
  String get crmLeadsSourcesWebsite => 'वेबसाइट';

  @override
  String get crmLeadsSourcesIndiamart => 'IndiaMART';

  @override
  String get crmLeadsSourcesJustdial => 'Justdial';

  @override
  String get crmLeadsSourcesWhatsapp => 'WhatsApp';

  @override
  String get crmLeadsSourcesTradeFair => 'व्यापार प्रदर्शन';

  @override
  String get crmLeadsSourcesOther => 'इतर';

  @override
  String get crmLeadsStage => 'टप्पा';

  @override
  String get crmLeadsStagesNew => 'नवीन';

  @override
  String get crmLeadsStagesContacted => 'संपर्क झाला';

  @override
  String get crmLeadsStagesQualified => 'पात्र';

  @override
  String get crmLeadsStagesProposal => 'प्रस्ताव पाठवला';

  @override
  String get crmLeadsStagesWon => 'मिळाला';

  @override
  String get crmLeadsStagesLost => 'गेला';

  @override
  String get crmLeadsValue => 'अपेक्षित मूल्य (₹)';

  @override
  String get crmLeadsExpectedClose => 'अपेक्षित पूर्तता';

  @override
  String get crmLeadsOwner => 'जबाबदार';

  @override
  String get crmLeadsNotes => 'टिपा';

  @override
  String get crmLeadsNextFollowUp => 'पुढील पाठपुरावा';

  @override
  String get crmLeadsSave => 'जतन करा';

  @override
  String get crmLeadsNone => 'अजून लीड्स नाहीत.';

  @override
  String get crmLeadsSearch => 'नाव, व्यवसाय, मोबाइल किंवा शहर शोधा';

  @override
  String crmLeadsWeighted(String amount) {
    return 'भारित $amount';
  }

  @override
  String get crmLeadsConvert => 'मिळाला: ग्राहक बनवा';

  @override
  String get crmLeadsLost => 'गेला म्हणून नोंदवा';

  @override
  String get crmLeadsLostReason => 'का गेला?';

  @override
  String get crmLeadsEdit => 'लीड बदला';

  @override
  String get crmActivitiesTitle => 'पाठपुरावे';

  @override
  String get crmActivitiesSubtitle =>
      'कॉल, भेटी आणि कार्ये, सर्वात आधी देय असलेले प्रथम.';

  @override
  String get crmActivitiesAdd => 'जोडा';

  @override
  String get crmActivitiesKind => 'प्रकार';

  @override
  String get crmActivitiesKindsCall => 'कॉल';

  @override
  String get crmActivitiesKindsMeeting => 'भेट';

  @override
  String get crmActivitiesKindsTask => 'कार्य';

  @override
  String get crmActivitiesKindsNote => 'टीप';

  @override
  String get crmActivitiesKindsWhatsapp => 'WhatsApp';

  @override
  String get crmActivitiesKindsEmail => 'ईमेल';

  @override
  String get crmActivitiesSubject => 'काय करायचे किंवा काय झाले';

  @override
  String get crmActivitiesDue => 'केव्हा';

  @override
  String get crmActivitiesDone => 'पूर्ण म्हणून नोंदवा';

  @override
  String get crmActivitiesReopen => 'अपूर्ण म्हणून नोंदवा';

  @override
  String get crmActivitiesNotes => 'टिपा';

  @override
  String get crmActivitiesNone => 'येथे काहीही नाही.';

  @override
  String get crmActivitiesOpen => 'खुले';

  @override
  String get crmActivitiesAll => 'सर्व';

  @override
  String get crmActivitiesLate => 'उशीर';

  @override
  String get crmMessagesSend => 'WhatsApp पाठवा';

  @override
  String get crmMessagesTemplate => 'साचा';

  @override
  String crmMessagesSent(String to) {
    return '$to ला पाठवले.';
  }

  @override
  String crmMessagesFailed(String error) {
    return 'पाठवले नाही: $error';
  }

  @override
  String get crmMessagesDemo =>
      'डेमो मोड: WhatsApp Business जोडेपर्यंत संदेश नोंदवले जातात पण पोहोचवले जात नाहीत.';

  @override
  String get crmMessagesRemind => 'भरणा स्मरणपत्र पाठवा';

  @override
  String get crmTemplatesTitle => 'संदेश साचे';

  @override
  String get crmTemplatesSubtitle =>
      'नावे, रकमा आणि तारखांसाठी क्रमांकित रिकाम्या जागा असलेले WhatsApp संदेश. ग्राहकाला आधी संदेश पाठवण्यासाठी साचा Meta ने मंजूर केलेला हवा; त्याचे मंजूर नाव टाका.';

  @override
  String get crmTemplatesName => 'नाव (a–z, 0–9, _)';

  @override
  String get crmTemplatesBody => 'मजकूर';

  @override
  String get crmTemplatesCategory => 'वर्ग';

  @override
  String get crmTemplatesCategoriesUtility => 'अद्यतने (बिले, स्मरणपत्रे)';

  @override
  String get crmTemplatesCategoriesMarketing => 'विपणन';

  @override
  String get crmTemplatesProviderName => 'Meta कडील मंजूर नाव';

  @override
  String get crmTemplatesAdd => 'साचा जोडा';

  @override
  String get crmTemplatesSave => 'जतन करा';

  @override
  String get crmCustomerTitle => 'ग्राहक';

  @override
  String get crmCustomerBalance => 'शिल्लक';

  @override
  String get crmCustomerSalesThisYear => 'या वर्षीची विक्री';

  @override
  String get crmCustomerSalesLastYear => 'मागील वर्ष';

  @override
  String get crmCustomerOpenItems => 'खुली बिले';

  @override
  String get crmCustomerInvoices => 'अलीकडील बीजके';

  @override
  String get crmCustomerReceipts => 'अलीकडे मिळालेले पैसे';

  @override
  String get crmCustomerOrders => 'खुली कोटेशन आणि ऑर्डर';

  @override
  String get crmCustomerActivities => 'घडामोडी';

  @override
  String crmCustomerFromLead(String code, String source) {
    return 'लीड $code पासून ($source)';
  }

  @override
  String get crmCustomerLedger => 'खाते उतारा';

  @override
  String get crmErrorsInvalidPhone => '10 अंकी भारतीय मोबाइल क्रमांक टाका.';

  @override
  String get crmErrorsInvalidGstin => 'जीएसटीआयएन वैध नाही.';

  @override
  String get crmErrorsConvertToWin =>
      'लीड मिळवण्यासाठी “मिळाला: ग्राहक बनवा” वापरा.';

  @override
  String get crmErrorsLostReasonRequired => 'का गेला ते सांगा.';

  @override
  String get crmErrorsAlreadyConverted => 'हा लीड आधीच ग्राहक आहे.';

  @override
  String get crmErrorsLeadOrCustomerRequired => 'लीड किंवा ग्राहक निवडा.';

  @override
  String get crmErrorsUnknownTemplate => 'साचा निवडा.';

  @override
  String get crmErrorsMissingParam => 'साच्यातील प्रत्येक रिकामी जागा भरा.';

  @override
  String get crmErrorsTemplateTooLong => 'साचा खूप मोठा आहे.';

  @override
  String get crmErrorsTemplateExists => 'या नावाचा साचा आधीच आहे.';

  @override
  String get crmErrorsNothingOutstanding => 'या ग्राहकाकडून काहीही बाकी नाही.';

  @override
  String get crmErrorsInvalidTemplateName =>
      'फक्त लहान अक्षरे, अंक आणि _ वापरा.';

  @override
  String get crmErrorsUnknownAccount => 'ग्राहक निवडा.';

  @override
  String get crmErrorsInvalidStage => 'टप्पा निवडा.';

  @override
  String get priceListsTitle => 'किंमत यादी';

  @override
  String get priceListsSubtitle =>
      'घाऊक, वितरक किंवा किरकोळ दर. यादीतील ग्राहकाला नव्या ऑर्डर आणि इनव्हॉइसवर तिचे दर मिळतात.';

  @override
  String get priceListsOne => 'किंमत यादी';

  @override
  String get priceListsNone => 'काही नाही (विक्री दर)';

  @override
  String get priceListsNew => 'नवीन किंमत यादी';

  @override
  String get priceListsName => 'नाव';

  @override
  String get priceListsDiscountPct => 'विक्री दरावर सूट (%)';

  @override
  String get priceListsDiscountHint =>
      'ठरलेला दर नसलेल्या प्रत्येक वस्तूला लागू';

  @override
  String get priceListsFixedRates => 'ठरलेले दर';

  @override
  String get priceListsCustomers => 'ग्राहक';

  @override
  String get priceListsEmpty => 'अजून किंमत यादी नाही.';

  @override
  String get priceListsAddRate => 'ठरलेला दर जोडा';

  @override
  String get priceListsErrorsPriceListNameTaken =>
      'या नावाची किंमत यादी आधीच आहे.';

  @override
  String get priceListsErrorsDuplicateItem => 'एक वस्तू दोनदा आहे.';

  @override
  String get agentsTitle => 'दलाल आणि एजंट';

  @override
  String get agentsSubtitle =>
      'प्रत्येक एजंटने आणलेल्या ग्राहकांकडून मिळालेल्या पैशावर कमिशन. माल परत आल्यास कमिशन परत होते.';

  @override
  String get agentsIsAgent => 'दलाल किंवा एजंट (कमिशन मिळते)';

  @override
  String get agentsCommissionPct => 'कमिशन (%)';

  @override
  String get agentsCommissionHint => 'करपात्र मूल्यावर, ग्राहक पैसे देईल तसे';

  @override
  String get agentsAgent => 'एजंट';

  @override
  String get agentsNoAgent => 'एजंट नाही';

  @override
  String get agentsSalesman => 'सेल्समन';

  @override
  String get agentsNoSalesman => 'सेल्समन नाही';

  @override
  String get agentsEarned => 'मिळवलेले';

  @override
  String get agentsBilled => 'बिल केले';

  @override
  String get agentsDue => 'देय';

  @override
  String get agentsInvoice => 'बिल';

  @override
  String get agentsBase => 'करपात्र मूल्य';

  @override
  String get agentsReceived => 'मिळाले';

  @override
  String get agentsNoInvoices => 'अजून बिल नाहीत.';

  @override
  String get agentsMakeBill => 'दलाली बिल करा';

  @override
  String get agentsEmpty =>
      'अजून एजंट नाहीत. खात्यांच्या यादीत खात्याला दलाल किंवा एजंट म्हणून खूण करा.';

  @override
  String get agentsBills => 'दलाली बिले';

  @override
  String get agentsNumber => 'क्रमांक';

  @override
  String get agentsCommission => 'कमिशन';

  @override
  String get agentsTds => 'टीडीएस';

  @override
  String get agentsNet => 'निव्वळ देय';

  @override
  String get agentsNoBills => 'अजून दलाली बिले नाहीत.';

  @override
  String agentsBillFor(String name, String amount) {
    return '$name यांना देय $amount कमिशनचे बिल करा.';
  }

  @override
  String get agentsTdsRate => 'टीडीएस दर (%)';

  @override
  String get agentsTdsHint =>
      'रिकामे ठेवा: वर्षाचे कमिशन ₹20,000 पेक्षा जास्त झाल्यावर 194H नुसार 2%';

  @override
  String get agentsPost => 'बिल पोस्ट करा';

  @override
  String get agentsCancelBill => 'बिल रद्द करा';

  @override
  String get agentsErrorsNothingToBill =>
      'त्या तारखेला या एजंटचे काहीही देय नाही.';

  @override
  String get agentsErrorsNotAnAgent =>
      'दलाल किंवा एजंट म्हणून खूण केलेले खाते निवडा.';

  @override
  String get targetsTitle => 'सेल्समन लक्ष्य';

  @override
  String get targetsSubtitle =>
      'कमिशन स्लॅबसह मासिक लक्ष्य, प्रत्येक सेल्समनच्या विक्रीशी (परतावा वजा करून) तुलना.';

  @override
  String get targetsPrevious => 'मागील महिना';

  @override
  String get targetsNext => 'पुढील महिना';

  @override
  String get targetsEdit => 'लक्ष्य ठरवा';

  @override
  String get targetsChooseSalesman => 'सेल्समन निवडा';

  @override
  String get targetsTarget => 'लक्ष्य';

  @override
  String get targetsSlabs => 'स्लॅब';

  @override
  String get targetsSlabsHint =>
      'स्लॅब = लक्ष्याचे किती टक्के : कमिशन टक्के. उदा. 0:1, 100:2 म्हणजे लक्ष्याखाली 1% आणि लक्ष्यावर किंवा वर 2%.';

  @override
  String get targetsAdd => 'सेल्समन जोडा';

  @override
  String get targetsCopyLast => 'मागील महिन्यातून कॉपी करा';

  @override
  String get targetsAchieved => 'साध्य';

  @override
  String get targetsProgress => 'लक्ष्याच्या';

  @override
  String get targetsRate => 'दर';

  @override
  String targetsInvoices(num n) {
    return '$n बिले';
  }

  @override
  String targetsReturns(String amount) {
    return 'परतावा $amount';
  }

  @override
  String get targetsNoTarget => 'लक्ष्य नाही';

  @override
  String get targetsEmpty => 'या महिन्यात लक्ष्य किंवा सेल्समनची विक्री नाही.';

  @override
  String get targetsNote =>
      'विक्री = सेल्समनच्या बिलांचे करपात्र मूल्य, त्या महिन्यात त्या बिलांवर दिलेल्या क्रेडिट नोट वजा करून.';

  @override
  String get targetsErrorsInvalid =>
      'प्रत्येक ओळीत सेल्समन, रुपयांत लक्ष्य आणि 0:1, 100:2 असे स्लॅब हवेत.';

  @override
  String get targetsErrorsDuplicateSalesman => 'एक सेल्समन दोनदा आहे.';

  @override
  String get targetsErrorsDuplicateSlab =>
      'दोन स्लॅब एकाच टक्क्यापासून सुरू होतात.';

  @override
  String get targetsErrorsUnknownEmployee =>
      'तुमच्या कर्मचाऱ्यांमधून सेल्समन निवडा.';

  @override
  String get schemesTitle => 'स्कीम आणि ऑफर';

  @override
  String get schemesSubtitle =>
      'काउंटरवर आपोआप लागू होणाऱ्या ऑफर: टक्के सूट, रक्कम सूट, X घ्या Y मिळवा, स्लॅब आणि कॉम्बो.';

  @override
  String get schemesNew => 'नवीन स्कीम';

  @override
  String get schemesName => 'नाव';

  @override
  String get schemesOffer => 'ऑफर';

  @override
  String get schemesOn => 'कशावर';

  @override
  String get schemesDates => 'तारखा';

  @override
  String get schemesOff => 'बंद';

  @override
  String get schemesEmpty => 'अजून स्कीम नाहीत.';

  @override
  String get schemesRules =>
      'प्रत्येक ओळीला जास्तीत जास्त एक स्कीम लागते, आणि बिलाला ग्राहकाची सर्वाधिक बचत करणारा मेळ लागतो. स्वतःची सूट असलेल्या ओळीला स्कीम लागत नाही.';

  @override
  String get schemesEverything => 'सर्व काही';

  @override
  String get schemesAlways => 'नेहमी';

  @override
  String get schemesNow => 'आतापासून';

  @override
  String get schemesNoEnd => 'शेवटची तारीख नाही';

  @override
  String schemesRange(String from, String to) {
    return '$from ते $to';
  }

  @override
  String get schemesKind => 'प्रकार';

  @override
  String get schemesStartsOn => 'पासून';

  @override
  String get schemesEndsOn => 'पर्यंत';

  @override
  String get schemesPct => 'सूट (%)';

  @override
  String get schemesOffPct => 'जादा नगांवर सूट (%)';

  @override
  String get schemesOffPctHint => '100 म्हणजे मोफत';

  @override
  String get schemesAmount => 'सूट रक्कम (₹)';

  @override
  String get schemesMinValue => 'या वस्तूंवर किमान (₹)';

  @override
  String get schemesBuy => 'घ्या';

  @override
  String get schemesGet => 'मिळवा';

  @override
  String get schemesSlabs => 'स्लॅब';

  @override
  String get schemesQtySlabsHint => 'नग : टक्के सूट, उदा. 3:10, 5:20';

  @override
  String get schemesValueSlabsHint => 'रुपये : टक्के सूट, उदा. 2000:5, 5000:10';

  @override
  String get schemesComboPrice => 'कॉम्बो किंमत (₹)';

  @override
  String get schemesComboItems => 'कॉम्बोमधील वस्तू';

  @override
  String get schemesItem => 'वस्तू';

  @override
  String get schemesQty => 'नग';

  @override
  String get schemesAddItem => 'वस्तू जोडा';

  @override
  String get schemesAddStyle => 'स्टाइल जोडा';

  @override
  String get schemesScopeHint =>
      'सर्व वस्तूंसाठी हे रिकामे ठेवा; नाहीतर यांपैकी कोणत्याही एकाशी जुळणारी वस्तू मोजली जाईल.';

  @override
  String get schemesBrands => 'ब्रँड';

  @override
  String get schemesCategories => 'श्रेणी';

  @override
  String get schemesStyles => 'स्टाइल';

  @override
  String get schemesItems => 'वस्तू';

  @override
  String get schemesCommaHint => 'स्वल्पविरामाने वेगळे करा';

  @override
  String get schemesActive => 'सुरू';

  @override
  String get schemesKindsPercent => 'टक्के सूट';

  @override
  String get schemesKindsAmountOff => 'रक्कम सूट';

  @override
  String get schemesKindsQtySlab => 'नग स्लॅब';

  @override
  String get schemesKindsValueSlab => 'मूल्य स्लॅब';

  @override
  String get schemesKindsBuyGet => 'X घ्या Y मिळवा';

  @override
  String get schemesKindsCombo => 'कॉम्बो किंवा हॅम्पर';

  @override
  String get schemesKindHintPercent => 'प्रत्येक समाविष्ट वस्तूवर तेच टक्के';

  @override
  String get schemesKindHintAmountOff =>
      'ठरलेली रक्कम सूट, मूल्यानुसार विभागलेली';

  @override
  String get schemesKindHintQtySlab => 'जास्त नग, जास्त टक्के';

  @override
  String get schemesKindHintValueSlab => 'मोठे बिल, जास्त टक्के';

  @override
  String get schemesKindHintBuyGet =>
      'प्रत्येक गटातील सर्वात स्वस्त वस्तू मोफत किंवा सवलतीत';

  @override
  String get schemesKindHintCombo => 'वस्तूंचा संच एका किमतीत';

  @override
  String schemesSumPercent(String pct) {
    return '$pct% सूट';
  }

  @override
  String schemesSumMin(String amount) {
    return '$amount किंवा जास्त वर';
  }

  @override
  String schemesSumAmountOff(String amount) {
    return '$amount सूट';
  }

  @override
  String schemesSumQtySlab(String from, String pct) {
    return '$from+ नग $pct%';
  }

  @override
  String schemesSumValueSlab(String from, String pct) {
    return '$from+ $pct%';
  }

  @override
  String schemesSumBuyGetFree(String buy, String get) {
    return '$buy घ्या $get मोफत';
  }

  @override
  String schemesSumBuyGetOff(String buy, String get, String pct) {
    return '$buy घ्या $get वर $pct% सूट';
  }

  @override
  String schemesSumCombo(String n, String price) {
    return '$n वस्तू $price मध्ये';
  }

  @override
  String get schemesErrorsSchemeIncomplete =>
      'या प्रकारच्या स्कीमसाठी आवश्यक माहिती भरा.';

  @override
  String get schemesErrorsSchemeNameTaken => 'या नावाची स्कीम आधीच आहे.';

  @override
  String get schemesErrorsEndsBeforeStart =>
      'शेवटची तारीख सुरुवातीच्या तारखेच्या आधी आहे.';

  @override
  String get schemesErrorsDuplicateSlab =>
      'दोन स्लॅब एकाच बिंदूपासून सुरू होतात.';

  @override
  String get schemesErrorsUnknownItem => 'तुमच्या यादीतून वस्तू निवडा.';

  @override
  String get schemesErrorsUnknownStyle => 'तुमच्या यादीतून स्टाइल निवडा.';

  @override
  String get schemesErrorsSlabs => 'स्लॅब असे लिहा: 3:10, 5:20.';

  @override
  String get schemesErrorsNumber => 'रक्कम आणि टक्के संख्या असाव्यात.';

  @override
  String get interestTitle => 'थकबाकीवर व्याज';

  @override
  String get interestSubtitle =>
      'प्रत्येक बिलावर देय तारखेनंतरच्या दिवसांचे सरळ व्याज, ग्राहकाच्या दराने.';

  @override
  String get interestPartyRates => 'ज्यांचा व्याजदर ठरलेला आहे असे ग्राहक.';

  @override
  String interestUsingRate(String rate) {
    return 'स्वतःचा दर नसलेल्या ग्राहकांचा हिशोब $rate% ने.';
  }

  @override
  String get interestPartyRatesOnly => 'फक्त दर असलेले ग्राहक';

  @override
  String interestTryRate(String rate) {
    return 'सर्वांचा $rate% ने हिशोब करा';
  }

  @override
  String get interestRate => 'दर';

  @override
  String get interestOverdue => 'थकबाकी';

  @override
  String get interestInterest => 'व्याज';

  @override
  String interestDueOn(String date) {
    return 'देय $date';
  }

  @override
  String get interestNone => 'व्याज लावण्यासाठी थकीत बिल नाही.';

  @override
  String get interestGstNote =>
      'उशिरा पेमेंटवरील व्याज पुरवठ्याच्या मूल्याचा भाग आहे (CGST कायदा कलम 15(2)(d)); मालाच्या दराने GST सह बिल करा.';

  @override
  String get integrityTitle => 'अखंडता तपासणी';

  @override
  String get integritySubtitle =>
      'तुमची खाती एकमेकांशी जुळतात का? प्रत्येक तपासणी जुळायलाच हवेत अशा दोन गोष्टींची तुलना करते आणि फरक त्यामागील नोंदींसह दाखवते.';

  @override
  String get integrityAllGood =>
      'सर्व तपासण्या यशस्वी. तुमची खाती एकमेकांशी जुळतात.';

  @override
  String integrityProblems(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n तपासण्यांकडे लक्ष हवे',
      one: '$n तपासणीकडे लक्ष हवे',
    );
    return '$_temp0';
  }

  @override
  String get integrityPass => 'यशस्वी';

  @override
  String get integrityFail => 'फरक';

  @override
  String get integrityWarn => 'हे पहा';

  @override
  String get integrityRecords => 'नोंदी';

  @override
  String get integrityFirstTwenty => 'पहिल्या 20 दाखवल्या आहेत.';

  @override
  String get integrityVouchersBalanceTitle => 'प्रत्येक व्हाउचर जुळते';

  @override
  String get integrityVouchersBalanceHelp =>
      'प्रत्येक व्हाउचरमध्ये नावे आणि जमा समान आहेत. जे नाहीत ते इथे दिसतात.';

  @override
  String get integrityTrialBalanceTitle => 'ताळेबंद चाचणी जुळते';

  @override
  String get integrityTrialBalanceHelp =>
      'सुरुवातीची शिल्लक आणि प्रत्येक नोंद मिळून बेरीज शून्य हवी. फरक सहसा यामुळे येतो की सुरुवातीची शिल्लक दुसऱ्या बाजूशिवाय, उदा. मालकाचे भांडवल, नोंदवली गेली.';

  @override
  String get integrityInvoicesMatchLedgerTitle => 'विक्री बिले खात्याशी जुळतात';

  @override
  String get integrityInvoicesMatchLedgerHelp =>
      'प्रत्येक नोंदवलेल्या बिलाने त्याची एकूण रक्कम ग्राहकाच्या खात्यात टाकली.';

  @override
  String get integrityBillsMatchLedgerTitle => 'खरेदी बिले खात्याशी जुळतात';

  @override
  String get integrityBillsMatchLedgerHelp =>
      'रिव्हर्स चार्ज वगळता प्रत्येक नोंदवलेल्या बिलाने एकूण रक्कम पुरवठादाराच्या खात्यात टाकली.';

  @override
  String get integrityDocumentsPostedTitle =>
      'नोंदवलेल्या दस्तऐवजांच्या खाते नोंदी आहेत';

  @override
  String get integrityDocumentsPostedHelp =>
      'ज्या नोंदवलेल्या बिलामागे व्हाउचर नाही ते इथे दिसते.';

  @override
  String get integrityCancelledReversedTitle =>
      'रद्द व्हाउचरची निव्वळ बेरीज शून्य आहे';

  @override
  String get integrityCancelledReversedHelp =>
      'व्हाउचर रद्द केल्यावर त्याने स्पर्श केलेल्या प्रत्येक खात्याची उलट नोंद व्हायला हवी.';

  @override
  String get integrityReceivablesMatchTitle =>
      'ग्राहकांकडून येणे खात्याशी जुळते';

  @override
  String get integrityReceivablesMatchHelp =>
      'बाकी यादीची बेरीज ग्राहकांच्या खाते शिल्लकेइतकी आहे.';

  @override
  String get integrityPayablesMatchTitle => 'पुरवठादारांना देणे खात्याशी जुळते';

  @override
  String get integrityPayablesMatchHelp =>
      'बाकी यादीची बेरीज पुरवठादारांच्या खाते शिल्लकेइतकी आहे.';

  @override
  String get integrityGiftVoucherLiabilityTitle =>
      'गिफ्ट व्हाउचर देयता न वापरलेल्या व्हाउचरशी जुळते';

  @override
  String get integrityGiftVoucherLiabilityHelp =>
      'गिफ्ट व्हाउचरचे खाते सक्रिय व्हाउचरवरील शिल्लकेइतके आहे.';

  @override
  String get integrityNegativeStockTitle => 'कोणताही साठा शून्याखाली नाही';

  @override
  String get integrityNegativeStockHelp =>
      'खात्यात दिसणाऱ्या साठ्यापेक्षा जास्त विकलेला किंवा दिलेला माल. हा खरा वेळेचा फरक असू शकतो; राहिलेली पावती नोंदवा.';

  @override
  String get sensitiveTitle => 'संवेदनशील बदल';

  @override
  String get sensitiveSubtitle =>
      'पैसे हलवू शकणारे किंवा दार उघडणारे बदल: बँक तपशील, उधारीच्या अटी, कर सेटिंग, कोणाला काय अधिकार, कालावधी लॉक आणि पगार सेटिंग. सर्वात नवीन वर.';

  @override
  String get sensitiveKindBank => 'बँक तपशील';

  @override
  String get sensitiveKindCredit => 'उधारीच्या अटी';

  @override
  String get sensitiveKindTax => 'कर आणि कंपनी सेटिंग';

  @override
  String get sensitiveKindPermissions => 'कोणाला काय अधिकार';

  @override
  String get sensitiveKindPeriod => 'कालावधी लॉक आणि क्रमांक';

  @override
  String get sensitiveKindPayroll => 'पगार सेटिंग';

  @override
  String get sensitiveKindOverride => 'उधार मर्यादा ओलांडणे';

  @override
  String get sensitiveKindDevice => 'उपकरणे';

  @override
  String get sensitiveAll => 'सर्व प्रकार';

  @override
  String get sensitiveNone => 'या कालावधीत कोणताही संवेदनशील बदल नाही.';

  @override
  String get sensitiveShow => 'दाखवा';

  @override
  String get cfoTitle => 'मालकाचा दृष्टिकोन';

  @override
  String get cfoSubtitle =>
      'विक्रीपासून नफ्यापर्यंत, या कालावधीचे चित्र, गेल्या वर्षीच्या त्याच कालावधीसह. तुमच्या खात्यात आयकर नोंदवलेला नसल्यास करापूर्वीचा आणि नंतरचा नफा सारखाच दिसतो.';

  @override
  String get cfoThisPeriod => 'हा कालावधी';

  @override
  String get cfoLastYear => 'गेल्या वर्षीचा तोच कालावधी';

  @override
  String get cfoGrowth => 'वाढ';

  @override
  String get cfoRevenue => 'महसूल';

  @override
  String get cfoCostOfGoods => 'विकलेल्या मालाची किंमत';

  @override
  String get cfoGrossProfit => 'एकूण नफा';

  @override
  String get cfoGrossMargin => 'एकूण मार्जिन';

  @override
  String get cfoOperatingExpenses => 'परिचालन खर्च';

  @override
  String get cfoOtherIncome => 'इतर उत्पन्न';

  @override
  String get cfoDepreciation => 'घसारा';

  @override
  String get cfoEbitda => 'EBITDA (घसाऱ्यापूर्वीचा नफा)';

  @override
  String get cfoNetProfit => 'निव्वळ नफा';

  @override
  String get cfoMonthly => 'महिनावार एकूण मार्जिन';

  @override
  String get lrTitle => 'एलआर आणि वाहतूक नोंद';

  @override
  String get lrSubtitle =>
      'ट्रान्सपोर्टरमार्फत पाठवलेला माल: एलआर क्रमांक, बिल, भाडे, आणि ग्राहकापर्यंत पोहोचला का.';

  @override
  String get lrTransporter => 'ट्रान्सपोर्टर';

  @override
  String get lrLrNumber => 'एलआर क्रमांक';

  @override
  String get lrInvoice => 'बिल';

  @override
  String get lrNoInvoice => 'बिल नाही';

  @override
  String get lrDestination => 'गंतव्य';

  @override
  String get lrPackages => 'पॅकेज';

  @override
  String get lrWeight => 'वजन (किग्रॅ)';

  @override
  String get lrFreight => 'भाडे';

  @override
  String get lrFreightBy => 'भाडे कोण देणार';

  @override
  String get lrPaid => 'आम्ही भरले';

  @override
  String get lrToPay => 'ग्राहक देणार';

  @override
  String get lrAdd => 'पाठवलेला माल नोंदवा';

  @override
  String get lrStatus => 'स्थिती';

  @override
  String get lrAllStatuses => 'सर्व स्थिती';

  @override
  String get lrStatusesBooked => 'बुक केले';

  @override
  String get lrStatusesInTransit => 'मार्गात';

  @override
  String get lrStatusesDelivered => 'पोहोचला';

  @override
  String lrDeliveredOn(String date) {
    return '$date रोजी पोहोचला';
  }

  @override
  String lrDaysOut(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: 'पाठवून $n दिवस',
      one: 'पाठवून $n दिवस',
    );
    return '$_temp0';
  }

  @override
  String get lrEmpty => 'अजून कोणताही माल पाठवलेला नाही. वर पहिला नोंदवा.';

  @override
  String get lrErrorsLrTaken =>
      'या ट्रान्सपोर्टरकडे हा एलआर क्रमांक आधीच नोंदवलेला आहे.';

  @override
  String get lrErrorsUnknownInvoice => 'ते बिल सापडले नाही.';

  @override
  String get lrErrorsDeliveredBeforeSent =>
      'पोहोचण्याची तारीख पाठवण्याच्या तारखेपूर्वी आहे.';

  @override
  String get hsnTitle => 'एचएसएन आणि एसएसी कोड';

  @override
  String get hsnSubtitle =>
      'तुमच्या व्यवसायात वापरले जाणारे कोड, सोप्या वर्णनासह. माल आणि स्टाइलचे फॉर्म या यादीतून सुचवतात. इथला दर फक्त सोयीसाठी: कपडे आणि पादत्राणांवर किमतीच्या स्लॅबनुसार कर लागतो.';

  @override
  String get hsnCode => 'कोड';

  @override
  String get hsnDescription => 'वर्णन';

  @override
  String get hsnKind => 'प्रकार';

  @override
  String get hsnGoods => 'माल (एचएसएन)';

  @override
  String get hsnService => 'सेवा (एसएसी)';

  @override
  String get hsnRate => 'दर';

  @override
  String get hsnAddStandard => 'मानक कपड्यांचे कोड जोडा';

  @override
  String hsnStandardAdded(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n कोड जोडले. आधीचे कोड बदलले नाहीत.',
      one: '$n कोड जोडला. आधीचे कोड बदलले नाहीत.',
    );
    return '$_temp0';
  }

  @override
  String get hsnShowArchived => 'संग्रहित दाखवा';

  @override
  String get hsnEmpty =>
      'अजून कोड नाहीत. वर जोडा, किंवा मानक कपड्यांचे कोड जोडा.';

  @override
  String get hsnErrorsHsnTaken => 'हा कोड यादीत आधीच आहे.';

  @override
  String get hsnErrorsInvalidHsn =>
      'एचएसएन कोडमध्ये 4, 6 किंवा 8 अंक असतात (एसएसी कोडमध्ये 6).';

  @override
  String get notesTitle => 'माझ्या नोंदी';

  @override
  String get notesPrivate => 'हे फक्त तुम्हीच पाहू शकता.';

  @override
  String get notesNone => 'काही नोंदवलेले नाही. खाली आठवण लिहा.';

  @override
  String get notesPlaceholder => 'नोंद किंवा आठवण लिहा';

  @override
  String get notesRemindOn => 'मला या दिवशी आठवण करा';

  @override
  String get notesAdd => 'जोडा';

  @override
  String get notesToday => 'आज';

  @override
  String notesOverdue(String date) {
    return '$date रोजी होते';
  }

  @override
  String notesMarkDone(String note) {
    return 'पूर्ण झाले: $note';
  }

  @override
  String get notesRemove => 'नोंद हटवा';

  @override
  String get movementTitle => 'वेगाने आणि हळू विकणारा माल';

  @override
  String movementSubtitle(String days, String fastMin) {
    return 'गेल्या $days दिवसांत काय विकले. वेगवान म्हणजे $fastMin किंवा जास्त नग; हळू म्हणजे काही विकले पण त्याहून कमी; न हलणारे म्हणजे काहीच नाही. न हलणारा माल आधी.';
  }

  @override
  String get movementWindow => 'मागे पहा';

  @override
  String movementWindowDays(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिवस',
      one: '$n दिवस',
    );
    return '$_temp0';
  }

  @override
  String get movementFastFrom => 'वेगवान सीमा (नग)';

  @override
  String get movementIncludeFabric => 'कापड आणि ट्रिम्स समाविष्ट करा';

  @override
  String get movementClassFast => 'वेगवान';

  @override
  String get movementClassSlow => 'हळू';

  @override
  String get movementClassNone => 'न हलणारे';

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
    return 'साठ्यात $n नग';
  }

  @override
  String get movementItem => 'माल';

  @override
  String get movementStatus => 'हालचाल';

  @override
  String movementSold(String days) {
    return '$days दिवसांत विकले';
  }

  @override
  String get movementInStock => 'साठ्यात';

  @override
  String get movementStockValue => 'साठ्याचे मूल्य';

  @override
  String get movementLastSold => 'शेवटची विक्री';

  @override
  String movementDaysAgo(num n) {
    String _temp0 = intl.Intl.pluralLogic(
      n,
      locale: localeName,
      other: '$n दिवसांपूर्वी',
      one: '$n दिवसापूर्वी',
    );
    return '$_temp0';
  }

  @override
  String get movementNever => 'कधीच नाही';

  @override
  String get movementEmpty => 'दाखवण्यासाठी साठा नाही.';

  @override
  String get movementFirstRows => 'पहिले 500 माल दाखवले आहेत.';

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
