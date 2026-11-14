/// Indian digit grouping and amounts in words, the same as packages/domain/src/words.ts.
library;

import 'money.dart';

/// 1234567.8 with 2 decimals is "12,34,567.80".
String formatIndian(String amount, [int decimals = 2]) {
  final v = parseScaled(amount, decimals);
  final neg = v.isNegative;
  final s = v.abs().toString().padLeft(decimals + 1, '0');
  final intPart = s.substring(0, s.length - decimals);
  final frac = decimals > 0 ? s.substring(s.length - decimals) : null;
  final last3 = intPart.length > 3
      ? intPart.substring(intPart.length - 3)
      : intPart;
  var head = intPart.length > 3 ? intPart.substring(0, intPart.length - 3) : '';
  head = head.replaceAllMapped(RegExp(r'\B(?=(\d{2})+(?!\d))'), (_) => ',');
  final grouped = head.isEmpty ? last3 : '$head,$last3';
  return '${neg ? '-' : ''}$grouped${frac != null ? '.$frac' : ''}';
}

const _ones = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];
const _tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

String _under100(int n) => n < 20
    ? _ones[n]
    : _tens[n ~/ 10] + (n % 10 != 0 ? '-${_ones[n % 10]}' : '');

String integerToWords(BigInt n) {
  if (n == BigInt.zero) return 'Zero';
  final parts = <String>[];
  final crore = n ~/ BigInt.from(10000000);
  var rest = (n % BigInt.from(10000000)).toInt();
  if (crore > BigInt.zero) parts.add('${integerToWords(crore)} Crore');
  final lakh = rest ~/ 100000;
  rest %= 100000;
  if (lakh != 0) parts.add('${_under100(lakh)} Lakh');
  final thousand = rest ~/ 1000;
  rest %= 1000;
  if (thousand != 0) parts.add('${_under100(thousand)} Thousand');
  final hundred = rest ~/ 100, below = rest % 100;
  if (hundred != 0) parts.add('${_ones[hundred]} Hundred');
  if (below != 0) parts.add(_under100(below));
  return parts.join(' ');
}

/// "Rupees One Thousand Two Hundred Thirty-Four and Fifty Paise Only".
String amountInWords(String amount) {
  final paiseTotal = parseScaled(amount, 2);
  if (paiseTotal.isNegative)
    throw const FormatException('negative amounts are not spelled out');
  final rupees = paiseTotal ~/ BigInt.from(100);
  final paise = (paiseTotal % BigInt.from(100)).toInt();
  final r = integerToWords(rupees);
  return paise != 0
      ? 'Rupees $r and ${_under100(paise)} Paise Only'
      : 'Rupees $r Only';
}
