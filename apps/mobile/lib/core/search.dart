/// Search that never waits for the network: the whole catalogue is in memory and a query is answered in well under a millisecond, even with tens of thousands of items.
library;

import 'dart:typed_data';

/// Each entry is searched through one lowercase string (name, code, size, colour and barcode joined). A query is split on spaces and every word must match: a word of three
/// or more letters anywhere in the text, a word of one or two letters at the start of a word (so "d" finds Denim, not Cotton). Results whose name starts with the query come
/// first, then those where a word begins a word, then the rest.
///
/// To stay fast the index keeps, for every three letter run, the list of entries that contain it, and for every one or two letter word start the same. A query takes the
/// shortest list among its words and checks only those entries, so the work depends on how rare the query is, not on how big the catalogue is.
class SearchIndex<T> {
  final List<T> _items;
  final List<String> _hay;
  final List<String> _name;
  final Map<int, Uint32List> _tri = {};
  final Map<int, Uint32List> _pre = {};

  SearchIndex(List<T> items, String Function(T) hay, String Function(T) name)
    : _items = items,
      _hay = [for (final i in items) hay(i)],
      _name = [for (final i in items) name(i).toLowerCase()] {
    final tri = <int, List<int>>{}, pre = <int, List<int>>{};
    void add(Map<int, List<int>> m, int key, int id) {
      final l = m.putIfAbsent(key, () => <int>[]);
      if (l.isEmpty || l.last != id) l.add(id);
    }

    for (var id = 0; id < _hay.length; id++) {
      final h = _hay[id];
      for (var i = 0; i + 2 < h.length; i++) {
        add(
          tri,
          _tkey(h.codeUnitAt(i), h.codeUnitAt(i + 1), h.codeUnitAt(i + 2)),
          id,
        );
      }
      var start = true;
      for (var i = 0; i < h.length; i++) {
        final c = h.codeUnitAt(i);
        if (c == 0x20) {
          start = true;
          continue;
        }
        if (start) {
          add(pre, c, id);
          if (i + 1 < h.length && h.codeUnitAt(i + 1) != 0x20)
            add(pre, _pkey(c, h.codeUnitAt(i + 1)), id);
          start = false;
        }
      }
    }
    for (final e in tri.entries) {
      _tri[e.key] = Uint32List.fromList(e.value);
    }
    for (final e in pre.entries) {
      _pre[e.key] = Uint32List.fromList(e.value);
    }
  }

  // Plain arithmetic rather than shifts, so the keys stay exact when the app runs in a browser (where shifts are 32 bit).
  static int _tkey(int a, int b, int c) => a * 4294967296 + b * 65536 + c;
  static int _pkey(int a, int b) => 281474976710656 + a * 65536 + b;

  int get length => _items.length;

  bool _wordMatches(String h, String w) =>
      w.length >= 3 ? h.contains(w) : (h.startsWith(w) || h.contains(' $w'));

  /// The shortest candidate list for one word, or null when no entry can match it.
  Uint32List? _candidates(String w) {
    if (w.length == 1) return _pre[w.codeUnitAt(0)];
    if (w.length == 2) return _pre[_pkey(w.codeUnitAt(0), w.codeUnitAt(1))];
    Uint32List? best;
    for (var i = 0; i + 2 < w.length; i++) {
      final l =
          _tri[_tkey(
            w.codeUnitAt(i),
            w.codeUnitAt(i + 1),
            w.codeUnitAt(i + 2),
          )];
      if (l == null) return null;
      if (best == null || l.length < best.length) best = l;
    }
    return best;
  }

  List<T> search(String query, {int limit = 30}) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty)
      return _items.length <= limit
          ? List.of(_items)
          : _items.sublist(0, limit);
    final words = q.split(RegExp(r'\s+'));
    Uint32List? driver;
    for (final w in words) {
      final c = _candidates(w);
      if (c == null) return const [];
      if (driver == null || c.length < driver.length) driver = c;
    }
    final first = <int>[], second = <int>[], third = <int>[];
    final lead = ' ${words.first}';
    for (final i in driver!) {
      final h = _hay[i];
      var ok = true;
      for (final w in words) {
        if (!_wordMatches(h, w)) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      final n = _name[i];
      if (n.startsWith(q)) {
        first.add(i);
        if (first.length >= limit) break;
      } else if (n.contains(lead)) {
        second.add(i);
      } else {
        third.add(i);
      }
      // Enough to fill the list with good company: stop looking at a short, common query's thousands of matches.
      if (first.length + second.length + third.length >= limit * 8) break;
    }
    final out = <T>[];
    for (final list in [first, second, third]) {
      for (final i in list) {
        if (out.length >= limit) return out;
        out.add(_items[i]);
      }
    }
    return out;
  }
}
