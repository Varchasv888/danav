/// A browser cannot open a raw printer connection; the Android and Windows apps can.
Future<void> sendToPrinter(
  String target,
  List<int> bytes, {
  Duration timeout = const Duration(seconds: 6),
}) async {
  throw UnsupportedError(
    'Printing straight to a receipt printer needs the Android or Windows app.',
  );
}
