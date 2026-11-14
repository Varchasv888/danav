/// Latency bookkeeping: how long the things a person waits for really take, kept as microseconds so a 3 ms budget can be checked rather than assumed.
library;

class Perf {
  static final Map<String, List<int>> _samples = {};
  static const int _keep = 2000;

  static T time<T>(String name, T Function() fn) {
    final sw = Stopwatch()..start();
    final r = fn();
    record(name, sw.elapsedMicroseconds);
    return r;
  }

  static void record(String name, int micros) {
    final list = _samples.putIfAbsent(name, () => []);
    list.add(micros);
    if (list.length > _keep) list.removeAt(0);
  }

  static void reset() => _samples.clear();

  /// p50, p95, p99 and the worst, in milliseconds.
  static PerfStat? stat(String name) {
    final list = _samples[name];
    if (list == null || list.isEmpty) return null;
    final s = [...list]..sort();
    double at(double p) => s[((s.length - 1) * p).round()] / 1000;
    return PerfStat(name, s.length, at(0.5), at(0.95), at(0.99), s.last / 1000);
  }

  static List<PerfStat> all() => [
    for (final n in _samples.keys.toList()..sort()) stat(n)!,
  ];
}

class PerfStat {
  final String name;
  final int count;
  final double p50, p95, p99, max;
  const PerfStat(this.name, this.count, this.p50, this.p95, this.p99, this.max);
  @override
  String toString() =>
      '$name n=$count p50=${p50.toStringAsFixed(3)}ms p95=${p95.toStringAsFixed(3)}ms p99=${p99.toStringAsFixed(3)}ms max=${max.toStringAsFixed(3)}ms';
}
