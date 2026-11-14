import 'package:decimal/decimal.dart';
import 'package:flutter/widgets.dart';

import '../domain/domain.dart';

String _lang(BuildContext context) => Localizations.localeOf(context).languageCode;

/// Hindi names of items and parties are shown to readers of any Devanagari language.
bool showsHindiNames(BuildContext context) => devanagari(_lang(context));

/// Amount in words in the reader's language where there is a number table, else English.
String wordsFor(BuildContext context, Object amount) => amountInWords(amount, wordsLang(_lang(context)));

String localName(BuildContext context, String name, String? nameHi) => showsHindiNames(context) && nameHi != null && nameHi.isNotEmpty ? nameHi : name;

String rupees(Object v) {
  final d = dec(v);
  return d < Decimal.zero ? '−₹ ${formatIndian(-d)}' : '₹ ${formatIndian(d)}';
}

/// "12,300.00 Dr" / "4,000.00 Cr" (positive = debit).
String drCr(Decimal v, {required String dr, required String cr}) {
  if (v == Decimal.zero) return '0.00';
  return '${formatIndian(v.abs())} ${v < Decimal.zero ? cr : dr}';
}

String todayIso() {
  final now = DateTime.now();
  return '${now.year.toString().padLeft(4, '0')}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
}
