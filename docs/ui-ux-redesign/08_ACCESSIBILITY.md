# 08 Accessibility

Target: WCAG 2.2 AA where practical.

## Done in this phase

- Contrast measured and fixed for primary, muted, faint and teal text and for field boundaries (`01_DESIGN_TOKENS`).
- Mega menu: each tab is a button with `aria-expanded`, `aria-haspopup` and `aria-controls`; the panel is a `role="menu"` of links; keyboard focus on a tab opens it; arrow keys move; Esc closes and restores focus; hover is never the only way in; tooltips name the shortcut.
- Workspace tabs: `role="tablist"`, `aria-selected`, pin and close are labelled buttons, the context menu has `role="menu"` and opens from the keyboard (Context Menu key, Shift+F10); unsaved state has a text label as well as a dot.
- Password field: a labelled toggle button with `aria-pressed`.
- Reduced motion: the global rule in `globals.css` removes animation and transitions.
- Statuses: BI and menu badges carry text ("Live", "Partly built", "Planned", "Soon").

## Known gaps (from the discovery audit)

- 59 interactive screens have no ARIA attribute or screen-reader text in their own code (semantic HTML may cover some).
- Tables: header cells need `scope`; sortable columns need `aria-sort` (belongs in the DataTable build).
- Colour only: the discovery found amounts coloured red and green in some reports; add an arrow, sign or text.
- No automated accessibility scan has been run. Run axe on the 20 most used screens before sign-off.
- Dialogs: the confirm dialogs on tab close use the browser's `confirm`, which is accessible but unstyled.
- Focus order after dialogs was not audited screen by screen.

## Checklist for each redesigned screen

Labels on every control; visible focus; keyboard completes the main task; dialogs trap and restore focus; error text is linked to its field (`aria-describedby`); status has text; 4.5:1 text and 3:1 boundaries; zoom to 200% without loss; reduced motion respected.
