# BI-003 Finance Intelligence

Proposed identifier. It does not clash with any existing feature ID (existing prefixes: AI, AST, BNK, CRM, EXP, FIN, HR, INV, MFG, POS, PRJ, PUR, RPT, SAL, SEC, SYN, TAX; no `BI-` ID exists).

- **Audience**: CFO, finance manager
- **Business questions**: Profit trend, margin, expense variance, cash flow, ageing, concentration, DSO, DPO, working capital, cash forecast.
- **What exists today (fact)**: Live: working capital, ageing, cash flow statement, scenarios. Missing: DSO, DPO, debtor and creditor concentration, expense-to-sales ratio.

## Existing screens that already answer part of it

- `/reports/cfo` (exists)
- `/accounts/working-capital` (exists)
- `/reports/receivables` (exists)
- `/reports/payables` (exists)
- `/reports/cash-flow-statement` (exists)
- `/accounts/scenarios` (exists)

## Layout [proposed]

Header with period, comparison (same period last year, previous period), scope (company, branch, store) and freshness stamp. Then: KPI strip (each KPI links to its dictionary entry), the main trend, a ranking, a composition view, an exceptions list, and a drill-down table. Every chart has a table view and a text summary; colour is never the only carrier of meaning.

## Measures

Only measures with an entry in the KPI dictionary (BI-013) may appear. Measures this section needs and their state:

- Defined and live: see the 12 entries at `/bi/kpis`.
- Needed but not defined: listed under 'Missing' above; each needs a formula, a source and an owner before it is shown.

## Drill-down and permissions

Each drill step re-checks tenant, company, store scope and permission. A user without transaction-level permission stops at the aggregate (for example `reports.view` without `sales.view` sees totals but cannot open invoices). Store-scoped members see their stores only; note the open question about device pull scope (`13_OPEN_QUESTIONS`, Q-31) applies to API scoping generally and must be settled before drill-down over stores.

## Forecasts and estimates

Anything predictive is labelled Forecast, with assumptions, range, model version and data freshness, and is never mixed into a total of actuals. No predictive model exists in the product today; none is to be shown until one is built and evaluated against a simple baseline (plan item I7).

## States

Loading skeleton; empty (no data for the period, widen it); error (service failed, retry, nothing stale shown as fresh); permission (names the missing permission); partial (some panels unavailable because their data is not collected: say which).

## Acceptance criteria

- Every figure has a dictionary entry and matches the underlying report for the same filters.
- Drill-down respects permissions and store scope.
- Export equals what is on screen.
- Forecast and estimate values are visibly different from actuals.
- Freshness is visible.
- Works at 1440, 1280, 768 and 375 px and with a keyboard.

## Status

Design: written. Implementation: the BI home links to the existing screens above; the dedicated dashboard is not built. Visual QA: partial for `/bi` and `/bi/kpis` (looked at in a browser on 4 Nov 2026), not done elsewhere.
