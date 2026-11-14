# 00 Design strategy

Working document for the Varchasv ERP interface redesign. Baseline: the discovery package in `docs/product-discovery/` (4 November 2026): 268 features, 229 web screens, 749 routes. Nothing here changes a route, a permission, a posting rule or an API contract.

## Phase 0: what the code already was (validated against source)

- **Shell**: a navy top bar (business switcher, financial-year label, Go to, New, assistant, user, working date, lock, sign out), a G-Retail style menu bar (7 headings with a panel of icon tiles and a filter), a tab strip of open screens, and a drawer sidebar for small screens (`apps/web/components/Shell.tsx`, `MenuBar.tsx`, `TabStrip.tsx`).
- **Palette**: tokens in `apps/web/app/globals.css` already matched the brief's neutrals closely (canvas `#f5f7fa`, surface `#ffffff`) and used Inter with Anek for Indian scripts.
- **Components**: one UI file (`components/ui.tsx`: Button, Input, Select, Field, Card, PageHeader, Alert, Badge); no table component; each screen builds its own table markup (`01_DESIGN_TOKENS` and `06_SHARED_COMPONENTS` record what is shared and what is not).
- **Navigation**: 262 menu tiles, 23 with no screen; 29 screens targeted by more than one tile (`11_UI_UX_AUDIT` UX-01, UX-03 in the discovery).
- **Palette problems found by measurement** (`01_DESIGN_TOKENS`): primary blue, muted text and the faint text colour were below the WCAG AA text ratio on the surfaces they are used on; field borders were below the 3:1 boundary ratio; the teal used for "posted" text was 3.7:1.

## Decisions

1. **Build on the existing shell, not beside it.** The brief asks for module tabs with hover mega-menus and multi-window workspace tabs. Both are delivered by replacing `MenuBar` with `MegaMenu` and extending `TabStrip`; the header, Go to, business switcher and sidebar drawer remain. A second design system was not introduced.
2. **Module tabs replace the G-Retail headings.** The earlier direction (project memory: follow G-Retail's organisation) produced seven headings (Masters, Transaction, Reports and so on). The brief's module-oriented tabs supersede it. The G-Retail letter shortcuts survive as Alt plus a letter per tab, and every one of the 187 screens the old menu reached is still reachable (checked by script, see `03_NAVIGATION_ARCHITECTURE`).
3. **Keep the existing palette identity; fix what measurement failed.** The brief's colours are initial values to validate. Several fail AA as small text on white (warning `#B7791F` 3.6:1, info `#477DB8` 4.3:1, teal `#27877F` 4.3:1), so they were not adopted as is. The product's blue was darkened slightly to pass.
4. **Honest status everywhere.** A screen for a simulator says so; a tile with no screen is shown greyed with a label; the BI home states how much of each section exists.
5. **Specify everything, build in phases.** All 268 features have a 30-point specification (`modules/`); only the shell, tokens, BI home and KPI dictionary are built so far (`PROGRESS.md`). Screen-by-screen restyling follows the framework in `06_SHARED_COMPONENTS`.

## Conflicts between the brief and the product, and how each was resolved

| Brief | Product fact | Resolution |
|---|---|---|
| Legal entity and branch selectors in the header | The session has one business; a business has companies and branches, but no selector or scope switch exists | Not added: a selector that changes nothing would be decorative. Listed as a dependency (`02_APPLICATION_SHELL`) |
| Notifications drawer, approval inbox, sync status in the header | Approvals exist at `/settings/approvals`; no notification store; the web app has no sync | Not added as controls; specified in `02_APPLICATION_SHELL` with the data each needs |
| Command palette searches customers, invoices, products | No record search endpoint exists (only barcode, bill and memo lookups) | Palette keeps searching screens and actions; record search is a backend dependency (`05_COMMAND_PALETTE`) |
| Ctrl+Tab, Ctrl+W | The browser keeps them | Workspace tabs use Ctrl+Alt+Right, Left, W and T (`04_WORKSPACE_TABS`) |
| Dashboard widgets resizable, reorderable, shared | No layout store exists | BI Dashboard Studio specified (BI-011), not built |
| Role dashboards for 13 personas | Home is My Menu (per-user tiles) and a dashboard; role home exists on the device only | Specified in `02_APPLICATION_SHELL`; to build after the screen framework |
| Do not introduce a Branch Edge Gateway | Not in the codebase | Respected: nothing in this redesign adds one |
| Show planned features distinctly | 23 tiles "Soon" | Kept as greyed, labelled entries in a "Not built yet" column per tab |

## Order of work

Phase 1 tokens and Phase 2 shell are done (`PROGRESS.md`). Next: Phase 3 shared screen framework (table, filter bar, object header, empty and error states), then Phase 4 benchmark screens in the order the brief gives.
