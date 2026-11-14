# BI-006 Retail Intelligence

Proposed identifier. It does not clash with any existing feature ID (existing prefixes: AI, AST, BNK, CRM, EXP, FIN, HR, INV, MFG, POS, PRJ, PUR, RPT, SAL, SEC, SYN, TAX; no `BI-` ID exists).

- **Audience**: Retail head, store manager
- **Business questions**: Store revenue and profit, per employee, footfall and conversion, basket, units per transaction, return rate, target achievement, discount effectiveness.
- **What exists today (fact)**: Live: store results, daily sales, targets. Missing: footfall conversion (no footfall data collected), per square foot (no floor area), units per transaction.

## Existing screens that already answer part of it

- `/reports/store-results` (exists)
- `/reports/daily-sales` (exists)
- `/pos/loyalty` (exists)
- `/sales/targets` (exists)

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
