import 'dart:io';

import 'package:image_picker/image_picker.dart';

/// Takes a photo with the phone's camera (on a computer, picks a picture from a folder instead) and returns its path, or null if the person backed out.
/// The picture is reduced in size so a receipt is readable but light to upload.
Future<String?> takePhoto({ImagePicker? picker}) async {
  final p = picker ?? ImagePicker();
  final mobile = Platform.isAndroid || Platform.isIOS;
  final x = await p.pickImage(source: mobile ? ImageSource.camera : ImageSource.gallery, maxWidth: 1600, imageQuality: 80);
  return x?.path;
}
