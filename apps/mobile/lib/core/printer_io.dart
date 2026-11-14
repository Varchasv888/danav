import 'dart:io';

/// Sends receipt bytes straight to a network receipt printer (host:9100). The server makes the bytes (layout, cut, cash drawer); the app only delivers them.
Future<void> sendToPrinter(
  String target,
  List<int> bytes, {
  Duration timeout = const Duration(seconds: 6),
}) async {
  final m = RegExp(r'^(?:tcp:)?([\w.-]+):(\d{2,5})$').firstMatch(target.trim());
  if (m == null)
    throw const FormatException(
      'Printer address must look like 192.168.1.50:9100',
    );
  final socket = await Socket.connect(
    m.group(1)!,
    int.parse(m.group(2)!),
    timeout: timeout,
  );
  socket.add(bytes);
  await socket.flush();
  await socket.close();
}
