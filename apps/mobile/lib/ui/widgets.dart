import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/dates.dart';
import '../core/perf.dart';
import '../core/search.dart';

/// A number box that follows the same rules as the web app: a zero empties when the box is entered so typing starts at once, any other value is selected so typing replaces it.
class NumField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final ValueChanged<String> onChanged;
  final ValueChanged<String>? onSubmitted;
  final FocusNode? focusNode;
  final bool decimal;
  const NumField({
    super.key,
    required this.controller,
    required this.label,
    required this.onChanged,
    this.onSubmitted,
    this.focusNode,
    this.decimal = true,
  });

  @override
  State<NumField> createState() => _NumFieldState();
}

class _NumFieldState extends State<NumField> {
  FocusNode? _own;
  late FocusNode _node;

  FocusNode _pick() => widget.focusNode ?? (_own ??= FocusNode());

  @override
  void initState() {
    super.initState();
    _node = _pick()..addListener(_onFocus);
  }

  /// The screen may hand this box a different focus node (a fresh invoice has fresh boxes); follow it rather than keep listening to one that is gone.
  @override
  void didUpdateWidget(NumField old) {
    super.didUpdateWidget(old);
    final next = _pick();
    if (!identical(next, _node)) {
      _node.removeListener(_onFocus);
      _node = next..addListener(_onFocus);
    }
  }

  void _onFocus() {
    if (!_node.hasFocus) return;
    final c = widget.controller;
    if (isZeroText(c.text)) {
      c.clear();
      widget.onChanged('');
    } else {
      c.selection = TextSelection(baseOffset: 0, extentOffset: c.text.length);
    }
  }

  @override
  void dispose() {
    _node.removeListener(_onFocus);
    _own?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => TextField(
    controller: widget.controller,
    focusNode: _node,
    textAlign: TextAlign.end,
    keyboardType: TextInputType.numberWithOptions(decimal: widget.decimal),
    textInputAction: TextInputAction.next,
    inputFormatters: [
      FilteringTextInputFormatter.allow(
        widget.decimal ? RegExp(r'[0-9.]') : RegExp(r'[0-9]'),
      ),
    ],
    decoration: InputDecoration(labelText: widget.label, isDense: true),
    style: const TextStyle(fontFeatures: [FontFeature.tabularFigures()]),
    onChanged: widget.onChanged,
    onSubmitted: widget.onSubmitted,
  );
}

/// A box that finds things as you type from the catalogue held in memory: no waiting, the list is there on the next frame.
class LocalPicker<T extends Object> extends StatelessWidget {
  final SearchIndex<T> index;
  final String Function(T) label;
  final String? Function(T)? sub;
  final TextEditingController controller;
  final FocusNode focusNode;
  final String hint;
  final ValueChanged<T> onSelected;
  final VoidCallback? onCleared;
  final String perfName;
  const LocalPicker({
    super.key,
    required this.index,
    required this.label,
    this.sub,
    required this.controller,
    required this.focusNode,
    required this.hint,
    required this.onSelected,
    this.onCleared,
    this.perfName = 'search',
  });

  @override
  Widget build(BuildContext context) => RawAutocomplete<T>(
    textEditingController: controller,
    focusNode: focusNode,
    displayStringForOption: label,
    optionsBuilder: (v) => Perf.time(perfName, () => index.search(v.text)),
    onSelected: onSelected,
    fieldViewBuilder: (context, c, f, submit) => TextField(
      controller: c,
      focusNode: f,
      decoration: InputDecoration(
        labelText: hint,
        isDense: true,
        suffixIcon: c.text.isEmpty
            ? null
            : IconButton(
                icon: const Icon(Icons.clear, size: 18),
                onPressed: () {
                  c.clear();
                  onCleared?.call();
                },
              ),
      ),
      onChanged: (t) {
        if (t.isEmpty) onCleared?.call();
      },
      onSubmitted: (_) => submit(),
    ),
    optionsViewBuilder: (context, onSel, options) => Align(
      alignment: Alignment.topLeft,
      child: Material(
        elevation: 6,
        borderRadius: BorderRadius.circular(12),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 320, maxWidth: 480),
          child: ListView.builder(
            padding: EdgeInsets.zero,
            shrinkWrap: true,
            itemCount: options.length,
            itemBuilder: (context, i) {
              final o = options.elementAt(i);
              final highlighted =
                  AutocompleteHighlightedOption.of(context) == i;
              return ListTile(
                dense: true,
                selected: highlighted,
                title: Text(
                  label(o),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                subtitle: sub?.call(o) == null
                    ? null
                    : Text(
                        sub!(o)!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                onTap: () => onSel(o),
              );
            },
          ),
        ),
      ),
    ),
  );
}
