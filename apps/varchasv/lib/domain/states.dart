/// GST state/UT codes. Port of packages/domain/src/states.ts.
/// `ut` marks Union Territories without a legislature (UTGST instead of SGST).
class GstState {
  const GstState(this.code, this.name, this.nameHi, {this.ut = false});
  final String code;
  final String name;
  final String nameHi;
  final bool ut;
}

const gstStates = <GstState>[
  GstState('01', 'Jammu and Kashmir', 'जम्मू और कश्मीर'),
  GstState('02', 'Himachal Pradesh', 'हिमाचल प्रदेश'),
  GstState('03', 'Punjab', 'पंजाब'),
  GstState('04', 'Chandigarh', 'चंडीगढ़', ut: true),
  GstState('05', 'Uttarakhand', 'उत्तराखंड'),
  GstState('06', 'Haryana', 'हरियाणा'),
  GstState('07', 'Delhi', 'दिल्ली'),
  GstState('08', 'Rajasthan', 'राजस्थान'),
  GstState('09', 'Uttar Pradesh', 'उत्तर प्रदेश'),
  GstState('10', 'Bihar', 'बिहार'),
  GstState('11', 'Sikkim', 'सिक्किम'),
  GstState('12', 'Arunachal Pradesh', 'अरुणाचल प्रदेश'),
  GstState('13', 'Nagaland', 'नागालैंड'),
  GstState('14', 'Manipur', 'मणिपुर'),
  GstState('15', 'Mizoram', 'मिज़ोरम'),
  GstState('16', 'Tripura', 'त्रिपुरा'),
  GstState('17', 'Meghalaya', 'मेघालय'),
  GstState('18', 'Assam', 'असम'),
  GstState('19', 'West Bengal', 'पश्चिम बंगाल'),
  GstState('20', 'Jharkhand', 'झारखंड'),
  GstState('21', 'Odisha', 'ओडिशा'),
  GstState('22', 'Chhattisgarh', 'छत्तीसगढ़'),
  GstState('23', 'Madhya Pradesh', 'मध्य प्रदेश'),
  GstState('24', 'Gujarat', 'गुजरात'),
  GstState('26', 'Dadra and Nagar Haveli and Daman and Diu', 'दादरा और नगर हवेली और दमन और दीव', ut: true),
  GstState('27', 'Maharashtra', 'महाराष्ट्र'),
  GstState('29', 'Karnataka', 'कर्नाटक'),
  GstState('30', 'Goa', 'गोवा'),
  GstState('31', 'Lakshadweep', 'लक्षद्वीप', ut: true),
  GstState('32', 'Kerala', 'केरल'),
  GstState('33', 'Tamil Nadu', 'तमिलनाडु'),
  GstState('34', 'Puducherry', 'पुडुचेरी'),
  GstState('35', 'Andaman and Nicobar Islands', 'अंडमान और निकोबार द्वीपसमूह', ut: true),
  GstState('36', 'Telangana', 'तेलंगाना'),
  GstState('37', 'Andhra Pradesh', 'आंध्र प्रदेश'),
  GstState('38', 'Ladakh', 'लद्दाख', ut: true),
  GstState('97', 'Other Territory', 'अन्य क्षेत्र', ut: true),
  GstState('96', 'Foreign Country', 'विदेश'),
];

final Map<String, GstState> _byCode = {for (final s in gstStates) s.code: s};

GstState? findState(String code) => _byCode[code];
bool isValidStateCode(String code) => _byCode.containsKey(code);
