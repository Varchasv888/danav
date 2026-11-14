/**
 * GST state/UT codes (first two digits of a GSTIN and the place-of-supply code).
 * `ut: true` marks Union Territories without a legislature: intra-UT supplies there
 * levy UTGST instead of SGST.
 */
export interface GstState {
  code: string;
  name: string;
  nameHi: string;
  ut?: boolean;
}

export const GST_STATES: readonly GstState[] = [
  { code: "01", name: "Jammu and Kashmir", nameHi: "जम्मू और कश्मीर" },
  { code: "02", name: "Himachal Pradesh", nameHi: "हिमाचल प्रदेश" },
  { code: "03", name: "Punjab", nameHi: "पंजाब" },
  { code: "04", name: "Chandigarh", nameHi: "चंडीगढ़", ut: true },
  { code: "05", name: "Uttarakhand", nameHi: "उत्तराखंड" },
  { code: "06", name: "Haryana", nameHi: "हरियाणा" },
  { code: "07", name: "Delhi", nameHi: "दिल्ली" },
  { code: "08", name: "Rajasthan", nameHi: "राजस्थान" },
  { code: "09", name: "Uttar Pradesh", nameHi: "उत्तर प्रदेश" },
  { code: "10", name: "Bihar", nameHi: "बिहार" },
  { code: "11", name: "Sikkim", nameHi: "सिक्किम" },
  { code: "12", name: "Arunachal Pradesh", nameHi: "अरुणाचल प्रदेश" },
  { code: "13", name: "Nagaland", nameHi: "नागालैंड" },
  { code: "14", name: "Manipur", nameHi: "मणिपुर" },
  { code: "15", name: "Mizoram", nameHi: "मिज़ोरम" },
  { code: "16", name: "Tripura", nameHi: "त्रिपुरा" },
  { code: "17", name: "Meghalaya", nameHi: "मेघालय" },
  { code: "18", name: "Assam", nameHi: "असम" },
  { code: "19", name: "West Bengal", nameHi: "पश्चिम बंगाल" },
  { code: "20", name: "Jharkhand", nameHi: "झारखंड" },
  { code: "21", name: "Odisha", nameHi: "ओडिशा" },
  { code: "22", name: "Chhattisgarh", nameHi: "छत्तीसगढ़" },
  { code: "23", name: "Madhya Pradesh", nameHi: "मध्य प्रदेश" },
  { code: "24", name: "Gujarat", nameHi: "गुजरात" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu", nameHi: "दादरा और नगर हवेली और दमन और दीव", ut: true },
  { code: "27", name: "Maharashtra", nameHi: "महाराष्ट्र" },
  { code: "29", name: "Karnataka", nameHi: "कर्नाटक" },
  { code: "30", name: "Goa", nameHi: "गोवा" },
  { code: "31", name: "Lakshadweep", nameHi: "लक्षद्वीप", ut: true },
  { code: "32", name: "Kerala", nameHi: "केरल" },
  { code: "33", name: "Tamil Nadu", nameHi: "तमिलनाडु" },
  { code: "34", name: "Puducherry", nameHi: "पुडुचेरी" },
  { code: "35", name: "Andaman and Nicobar Islands", nameHi: "अंडमान और निकोबार द्वीपसमूह", ut: true },
  { code: "36", name: "Telangana", nameHi: "तेलंगाना" },
  { code: "37", name: "Andhra Pradesh", nameHi: "आंध्र प्रदेश" },
  { code: "38", name: "Ladakh", nameHi: "लद्दाख", ut: true },
  { code: "97", name: "Other Territory", nameHi: "अन्य क्षेत्र", ut: true },
  { code: "96", name: "Foreign Country", nameHi: "विदेश" },
];

const byCode = new Map(GST_STATES.map((s) => [s.code, s]));

export const findState = (code: string): GstState | undefined => byCode.get(code);

export function isValidStateCode(code: string): boolean {
  return byCode.has(code);
}
