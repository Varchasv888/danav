# 06 Shared components

What exists, what each should become, and the screen patterns every feature specification refers to.

## Exists today (`apps/web/components`)

| Component | File | Notes |
|---|---|---|
| Button, Input, Select, Field, Card, PageHeader, Alert, Badge | `ui.tsx` | Input and Select now use the `--border-input` token |
| StatusBadge | `StatusBadge.tsx` | used for document status |
| MegaMenu, TabStrip | `MegaMenu.tsx`, `TabStrip.tsx` | new, built |
| GoTo (command palette) | `GoTo.tsx` | existing |
| PasswordInput | `PasswordInput.tsx` | new: show and hide toggle, used on sign in and sign up |
| DateFilter, WorkingDate, BusinessSwitcher, LockScreen, StepUpDialog, ThemeSwitch, LanguageSwitch | root of `components` | existing |
| DataTable, states, export | `components/data/DataTable.tsx`, `states.tsx`, `lib/xlsx-export.ts` | **built**: sort, search, column chooser, remembered view, sticky header, totals, Excel and CSV export; empty, loading and error states. Used by the six sales registers |
| Charts | `components/charts/Charts.tsx` (TrendChart, BarList) | **built** for the BI home; the older columns and bar list in `insights/Insights.tsx` are not yet moved onto it |
| Tables elsewhere | hand-written | **gap**: 174 screens hand-write `<table>` markup; 57 of them have no horizontal-scroll wrapper |

## To build (Phase 3), in order

1. **DataTable**: sticky head, tabular numerals, right-aligned amounts, column chooser, resize, pin, sort, group, saved views, row selection, bulk bar, totals footer, scroll wrapper, empty/loading/error rows. Virtualise above a few hundred rows.
2. **FilterBar**: compact primary row plus an advanced panel; saved filters; scope control.
3. **ObjectHeader and Tabs**: identity, status, summary figures, actions, tabs, timeline, attachments, audit.
4. **Editor**: document header, line grid with keyboard entry, totals, sticky action footer, draft handling, `useWorkspaceDirty`.
5. **EmptyState, ErrorState, LoadingSkeleton, ConfirmDialog, Drawer**.
6. **TaskInbox and ApprovalPanel**: what happened, why, who, record, amount or quantity, due date, permitted actions, history. Data: `GET /settings/approvals`, `GET /change-requests`, loan requests, stock-count approvals, expense approvals, failed syncs (`sync_rejections`), alerts (`/analytics/dashboard`). No single endpoint serves all of these; an aggregate read endpoint is a dependency.
7. **Chart library** (line, area, bar, grouped, stacked, horizontal rank, waterfall, heatmap, treemap, Pareto, funnel) with table view, keyboard focus and `--chart-*` colours.

## Screen patterns used in the feature specs

| Pattern | Use | Anatomy |
|---|---|---|
| Register | any list | header, filter bar, DataTable, totals, export |
| Editor | any document entry | header fields, grid, totals, footer actions |
| Object page | one record | ObjectHeader, summary, tabs, timeline |
| Workflow | multi-stage documents | stage line with who and when, next action, why blocked, linked documents |
| Reconciliation workbench | bank, statement, GST, gateway | two panels, suggestions with confidence, differences strip |
| Approval | decisions | queue plus detail, decision footer |
| Dashboard | role homes and BI | KPI strip, trend, ranking, exceptions, drill table |
| Report | reports | period and compare filters, table or chart, totals, export, print |

Consistency rule: a searchable select behaves the same in Purchase Order, Sales Invoice, Journal Voucher, Product Master and Employee Master. Today the account picker in `VoucherForm` is a native `<select>`; the shared combobox replaces it.
