import 'money.dart';

/// Amount in words (Indian system) and digit grouping. Port of packages/domain/src/words.ts.

const _enOnes = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', //
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const _enTens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

final List<String> _hi0to99 = ('शून्य एक दो तीन चार पाँच छह सात आठ नौ '
        'दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस '
        'बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस '
        'तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस '
        'चालीस इकतालीस बयालीस तैंतालीस चवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास '
        'पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ '
        'साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर '
        'सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी '
        'अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी '
        'नब्बे इक्यानबे बानबे तिरानबे चौरानबे पचानबे छियानबे सत्तानबे अट्ठानबे निन्यानबे')
    .split(' ');

/// Marathi: hundreds join the number ("दोनशे"), and exactly one hundred is "शंभर".
final List<String> _mr0to99 = ('शून्य एक दोन तीन चार पाच सहा सात आठ नऊ '
        'दहा अकरा बारा तेरा चौदा पंधरा सोळा सतरा अठरा एकोणीस '
        'वीस एकवीस बावीस तेवीस चोवीस पंचवीस सव्वीस सत्तावीस अठ्ठावीस एकोणतीस '
        'तीस एकतीस बत्तीस तेहतीस चौतीस पस्तीस छत्तीस सदतीस अडतीस एकोणचाळीस '
        'चाळीस एक्केचाळीस बेचाळीस त्रेचाळीस चव्वेचाळीस पंचेचाळीस सेहेचाळीस सत्तेचाळीस अठ्ठेचाळीस एकोणपन्नास '
        'पन्नास एक्कावन्न बावन्न त्रेपन्न चोपन्न पंचावन्न छप्पन्न सत्तावन्न अठ्ठावन्न एकोणसाठ '
        'साठ एकसष्ट बासष्ट त्रेसष्ट चौसष्ट पासष्ट सहासष्ट सदुसष्ट अडुसष्ट एकोणसत्तर '
        'सत्तर एक्काहत्तर बाहत्तर त्र्याहत्तर चौऱ्याहत्तर पंच्याहत्तर शहात्तर सत्त्याहत्तर अठ्ठ्याहत्तर एकोणऐंशी '
        'ऐंशी एक्क्याऐंशी ब्याऐंशी त्र्याऐंशी चौऱ्याऐंशी पंच्याऐंशी शहाऐंशी सत्त्याऐंशी अठ्ठ्याऐंशी एकोणनव्वद '
        'नव्वद एक्क्याण्णव ब्याण्णव त्र्याण्णव चौऱ्याण्णव पंच्याण्णव शहाण्णव सत्त्याण्णव अठ्ठ्याण्णव नव्व्याण्णव')
    .split(' ');

class _Lang {
  const _Lang(this.under100, this.hundreds, this.thousand, this.lakh, this.crore, this.zero, this.amount);
  final String Function(int) under100;
  /// "Two Hundred"; `alone` when nothing follows in the hundreds group.
  final String Function(int n, bool alone) hundreds;
  final String thousand, lakh, crore, zero;
  final String Function(String rupees, String? paise) amount;
}

String _enUnder100(int n) => n < 20 ? _enOnes[n] : _enTens[n ~/ 10] + (n % 10 != 0 ? '-${_enOnes[n % 10]}' : '');

final _langs = <String, _Lang>{
  'en': _Lang(_enUnder100, (n, _) => '${_enOnes[n]} Hundred', 'Thousand', 'Lakh', 'Crore', 'Zero',
      (r, p) => p != null ? 'Rupees $r and $p Paise Only' : 'Rupees $r Only'),
  'hi': _Lang((n) => _hi0to99[n], (n, _) => '${_hi0to99[n]} सौ', 'हज़ार', 'लाख', 'करोड़', 'शून्य',
      (r, p) => p != null ? '$r रुपये और $p पैसे मात्र' : '$r रुपये मात्र'),
  'mr': _Lang((n) => _mr0to99[n], (n, alone) => n == 1 && alone ? 'शंभर' : '${_mr0to99[n]}शे', 'हजार', 'लाख', 'कोटी', 'शून्य',
      (r, p) => p != null ? '$r रुपये आणि $p पैसे फक्त' : '$r रुपये फक्त'),
};

String integerToWords(int n, [String lang = 'en']) {
  final l = _langs[lang]!;
  if (n < 0) throw ArgumentError('negative amounts are not spelled out');
  if (n == 0) return l.zero;
  final parts = <String>[];
  final crore = n ~/ 10000000;
  var rest = n % 10000000;
  if (crore > 0) parts.add('${integerToWords(crore, lang)} ${l.crore}');
  final lakh = rest ~/ 100000;
  rest %= 100000;
  if (lakh > 0) parts.add('${l.under100(lakh)} ${l.lakh}');
  final thousand = rest ~/ 1000;
  rest %= 1000;
  if (thousand > 0) parts.add('${l.under100(thousand)} ${l.thousand}');
  final hundred = rest ~/ 100;
  final below = rest % 100;
  if (hundred > 0) parts.add(l.hundreds(hundred, below == 0));
  if (below > 0) parts.add(l.under100(below));
  return parts.join(' ');
}

/// The words language for a UI or print locale; languages without a number table use English.
String wordsLang(String locale) => _langs.containsKey(locale) ? locale : 'en';

/// Devanagari-script languages, whose readers are shown the Hindi names of items and parties.
bool devanagari(String locale) => locale == 'hi' || locale == 'mr';

String amountInWords(Object amount, [String lang = 'en']) {
  final a = round2(amount);
  if (a < zero) throw ArgumentError('negative amounts are not spelled out');
  final rupees = a.floor().toBigInt().toInt();
  final paise = ((a - a.floor()) * dec(100)).round().toBigInt().toInt();
  return _langs[lang]!.amount(integerToWords(rupees, lang), paise > 0 ? integerToWords(paise, lang) : null);
}

/// 1234567.8 → "12,34,567.80"
String formatIndian(Object amount, [int decimals = 2]) {
  final v = dec(amount).round(scale: decimals);
  final negative = v < zero;
  final parts = v.abs().toStringAsFixed(decimals).split('.');
  final intPart = parts[0];
  final last3 = intPart.length > 3 ? intPart.substring(intPart.length - 3) : intPart;
  var head = intPart.length > 3 ? intPart.substring(0, intPart.length - 3) : '';
  head = head.replaceAllMapped(RegExp(r'\B(?=(\d{2})+(?!\d))'), (_) => ',');
  final grouped = head.isEmpty ? last3 : '$head,$last3';
  return '${negative ? '-' : ''}$grouped${parts.length > 1 ? '.${parts[1]}' : ''}';
}
