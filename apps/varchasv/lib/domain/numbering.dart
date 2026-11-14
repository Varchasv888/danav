/// Document numbering. Port of packages/domain/src/numbering.ts.
/// GST rule 46: at most 16 characters of letters, digits, '-' and '/'.
const gstDocNumberMax = 16;
final _allowed = RegExp(r'^[A-Za-z0-9/-]+$');
final _token = RegExp(r'\{(FYL|FY|DEV|SEQ(?::(\d+))?)\}');

String formatDocumentNumber(String pattern, {required String fyShort, required String fyLabel, required int seq, String? device}) {
  if (seq < 1) throw ArgumentError('sequence must be a positive integer');
  return pattern.replaceAllMapped(_token, (m) {
    final token = m.group(1)!;
    if (token == 'FY') return fyShort;
    if (token == 'FYL') return fyLabel;
    if (token == 'DEV') {
      if (device == null) throw ArgumentError('pattern uses {DEV} but no device code was given');
      return device;
    }
    final pad = m.group(2);
    return seq.toString().padLeft(pad == null ? 1 : int.parse(pad), '0');
  });
}

/// null when valid, else "empty" | "too_long" | "bad_chars".
String? checkGstDocumentNumber(String n) {
  if (n.isEmpty) return 'empty';
  if (n.length > gstDocNumberMax) return 'too_long';
  if (!_allowed.hasMatch(n)) return 'bad_chars';
  return null;
}

String? checkSeriesPattern(String pattern, {int maxSeq = 99999, String device = 'Z9'}) {
  if (!RegExp(r'\{SEQ(?::\d+)?\}').hasMatch(pattern)) return 'empty';
  return checkGstDocumentNumber(formatDocumentNumber(pattern, fyShort: '25-26', fyLabel: '2025-26', seq: maxSeq, device: device));
}
