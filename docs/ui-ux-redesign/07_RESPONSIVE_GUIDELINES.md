# 07 Responsive guidelines

Targets: 1440 and above, 1280, 768, 375.

## Today (measured from source)

- 130 of 229 screens use responsive classes in their own code; the shell and shared components do.
- 57 screens with tables have no scroll wrapper.
- Root font size 14px desktop, 15px on phones (`globals.css`) so fields do not trigger zoom.
- Under 768px the bottom bar (Home, Sell, Stock, Money, More) and its sheets replace the module row and workspace tabs (`components/MobileNav.tsx`); from 768 to 1024px the sidebar drawer is still the compact menu.

## Rules

1. Tables never shrink to fit. Under 1024px they scroll horizontally inside a wrapper with the first column sticky, or restack into labelled records for registers a phone user needs (invoices, orders, approvals).
2. Entry screens keep the line grid on tablet; on a phone each line becomes a card with the essential fields and an edit sheet.
3. Primary actions move to a bottom bar on a phone; destructive ones stay in a menu.
4. Object pages collapse tabs into a scroll row at 768 and a select at 375.
5. Charts keep their table view; labels move to a legend on narrow widths.
6. Touch targets 44px high on the phone layout.
7. Do not imply web offline behaviour: there is none.

## Flutter

The device app keeps its own screens (`apps/varchasv/lib/ui`). Share tokens, not widgets: take the colour, radius and type values from `01_DESIGN_TOKENS` into `lib/ui/theme.dart`. Not done yet.

## Verification status

Checked in a browser on 4 Nov 2026: 1440px (shell, registers, BI); 768px (header, tabs, BI, invoice form: no sideways overflow after two fixes); 375px (shell, bottom bar and sheets, invoice form, sales registers as cards, BI with charts, dark mode). Not checked: 1280px, and the phone layout of POS billing, the editors other than the sales form, the ledger and most other screens.
