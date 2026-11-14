# 05 Command palette

Built (already existed, kept): `apps/web/components/GoTo.tsx`, fed from `Shell.tsx`. Opens with Ctrl+K, F2 or Alt+G. F4 to F9 open the voucher and invoice entries outside text fields.

## What it searches today

Screens (menu entries and the 13 sections) and the seven New entries, ranked by prefix, word start, containment and initials ("pb" finds Purchase bills). Entries the person has no permission for are not offered. Results are grouped by the menu group when the field is empty.

## What the brief asks for and what is missing

| Search target | State |
|---|---|
| Screens, modules, navigation | built |
| Actions (New invoice, New voucher) | built (7) |
| Reports | built as screens |
| Customers, suppliers, products, SKUs | **not built** |
| Invoices, vouchers, purchase and sales orders | **not built** |
| Employees | **not built** |
| Saved dashboards | not applicable yet (Dashboard Studio not built) |
| Recent commands | not built (My Menu keeps recent screens) |

## Backend dependency

There is no global record search endpoint. Existing lookups are narrow: barcode and item search (`/inventory/barcode-search` screen), `GET /pos/bills/lookup`, `GET /approval-memos/by-number`, `GET /serials/lookup`. A palette search needs one new permission-aware endpoint, for example `GET /search?q=&types=`, which:

1. checks the caller's permission per type (`accounts.view` for parties, `inventory.view` for items, `sales.view` for invoices, `hr.view` for employees);
2. applies tenant isolation (row level security already does) and store scope for store-scoped members;
3. returns type, id, label, secondary text and the screen to open, capped per type;
4. is rate limited like the other read routes.

The palette must re-check permission when the result is opened (the screen's own API guard does this) and never place a restricted record's name in a result the person could not open.

## Interaction spec for the extension

Groups in this order: Actions, Records, Documents, Reports, Navigation. Prefix filters (`c:`, `i:`, `inv:`) narrow by type. Show key hints on the right. Keep Esc to close and arrow keys plus Enter to choose. The overlay uses `--glass` and opaque rows. All of this is unchanged from the built behaviour except the new groups.
