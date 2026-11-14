/// Dates typed the quick way, as on the web: t (today), y (yesterday), e (end of month), +3 (days on), 11, 1111, 11/11, 111126, 11 nov 2026.
library;

const _months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

String _pad(int n) => n.toString().padLeft(2, '0');
String isoOf(DateTime d) => '${d.year}-${_pad(d.month)}-${_pad(d.day)}';

String? _valid(int y, int m, int d) {
  if (m < 1 || m > 12 || d < 1) return null;
  final t = DateTime.utc(y, m, d);
  return t.year == y && t.month == m && t.day == d
      ? '$y-${_pad(m)}-${_pad(d)}'
      : null;
}

String _addDays(String iso, int n) {
  final p = iso.split('-').map(int.parse).toList();
  return isoOf(DateTime.utc(p[0], p[1], p[2] + n));
}

/// The date as ISO (2026-11-11), or null if the text is not a date. [today] is the working date.
String? parseDateText(String text, String today) {
  final s = text.trim().toLowerCase();
  if (s.isEmpty) return null;
  final t = today.split('-').map(int.parse).toList();
  final ty = t[0], tm = t[1];
  if (s == 't') return today;
  if (s == 'y') return _addDays(today, -1);
  if (s == 'e') return isoOf(DateTime.utc(ty, tm + 1, 0));
  final off = RegExp(r'^([+-])(\d{1,3})$').firstMatch(s);
  if (off != null)
    return _addDays(
      today,
      (off.group(1) == '-' ? -1 : 1) * int.parse(off.group(2)!),
    );
  int year(String v) => v.length == 2 ? 2000 + int.parse(v) : int.parse(v);
  final iso = RegExp(r'^(\d{4})-(\d{1,2})-(\d{1,2})$').firstMatch(s);
  if (iso != null)
    return _valid(
      int.parse(iso.group(1)!),
      int.parse(iso.group(2)!),
      int.parse(iso.group(3)!),
    );
  final named = RegExp(
    r'^(\d{1,2})[\s/.-]*([a-z]{3,9})[\s/.,-]*(\d{2}|\d{4})?$',
  ).firstMatch(s);
  if (named != null) {
    final m = _months.indexOf(named.group(2)!.substring(0, 3)) + 1;
    return m == 0
        ? null
        : _valid(
            named.group(3) != null ? year(named.group(3)!) : ty,
            m,
            int.parse(named.group(1)!),
          );
  }
  final parts = s
      .split(RegExp(r'[\s/.-]+'))
      .where((x) => x.isNotEmpty)
      .toList();
  if (parts.length >= 2 && parts.every((p) => RegExp(r'^\d+$').hasMatch(p))) {
    return _valid(
      parts.length > 2 ? year(parts[2]) : ty,
      int.parse(parts[1]),
      int.parse(parts[0]),
    );
  }
  if (RegExp(r'^\d+$').hasMatch(s)) {
    if (s.length <= 2) return _valid(ty, tm, int.parse(s));
    if (s.length == 4)
      return _valid(
        ty,
        int.parse(s.substring(2)),
        int.parse(s.substring(0, 2)),
      );
    if (s.length == 6)
      return _valid(
        year(s.substring(4)),
        int.parse(s.substring(2, 4)),
        int.parse(s.substring(0, 2)),
      );
    if (s.length == 8)
      return _valid(
        int.parse(s.substring(4)),
        int.parse(s.substring(2, 4)),
        int.parse(s.substring(0, 2)),
      );
  }
  return null;
}

/// 2026-11-11 shown as 11 Nov 2026.
String showDate(String iso) {
  final m = RegExp(r'^(\d{4})-(\d{2})-(\d{2})$').firstMatch(iso);
  if (m == null) return iso;
  final mon = _months[int.parse(m.group(2)!) - 1];
  return '${int.parse(m.group(3)!)} ${mon[0].toUpperCase()}${mon.substring(1)} ${m.group(1)}';
}

/// 0, 0.00 and the like: a box holding this empties when entered so typing starts straight away.
bool isZeroText(String text) {
  final s = text.replaceAll(RegExp(r'[₹\s,]'), '');
  return RegExp(r'\d').hasMatch(s) && RegExp(r'^[-+]?[0.]*$').hasMatch(s);
}
