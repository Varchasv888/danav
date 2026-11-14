# Varchasv ERP Systems

Accounting, GST, inventory, purchasing, sales and payroll for Indian businesses. It runs **online**
(Next.js web app + Fastify API) and **offline** (a Flutter app for Windows, macOS, Linux, Android and iOS).

## Layout

| Path | What it is |
|---|---|
| `apps/web` | Next.js online app (port 3100). Twelve Indian languages, light and dark themes. |
| `apps/api` | Fastify cloud API (port 4100) for every module, sync for the offline app, and the GSP relay. `scripts/` has the demo seed, load test and API-docs generator. |
| `apps/varchasv` | Flutter offline app. `lib/domain` is the Dart port of the business rules. |
| `packages/domain` | TypeScript reference implementation of the business rules (GST, GSTIN, fiscal year, numbering, journals, amount in words). |
| `packages/db` | Drizzle schema and SQL migrations with Postgres row-level security. |
| `packages/i18n` | Translation catalogues; generates Flutter ARB files. |
| `spec/fixtures` | Shared test cases that **both** the TS and Dart rules must pass. |
| `scripts/db.mjs` | Database backup, restore and restore drill. |
| `docs/api.md` | API reference, generated from the routes (`npm run docs:api -w @varchasv/api`). |
| `TESTING.md` | Guide for people testing the system by hand. |

## Run it locally

Requirements: Node 24+, Docker, Flutter (installed at `E:\sdk\flutter`).

```bash
npm install
npm run db:up          # Postgres 17 in Docker on port 5433
npm run db:migrate     # tables + row-level security
npm run dev -w @varchasv/api
npm run dev -w @varchasv/web   # http://localhost:3100
```

Copy `.env.example` to `.env` first. The app connects as `varchasv_app`, a role that cannot bypass
row-level security; migrations run as the owner role.

`npm run demo:seed` creates a complete demo garment business (books from 1 April 2024: every month of
fabric purchases, job work, production, wholesale and showroom sales, payroll and running costs, plus
assets, banking, expenses, projects and CRM) with one sign-in per role. `--years 0` makes only the
current year.
A new business can start its books on a past date (`booksFrom` at sign-up, from FY 2024-25) to bring in
earlier years. See
[TESTING.md](TESTING.md).

**Everything in Docker** (for testers): set `SECRETS_KEY` in `.env`, then

```bash
docker compose --profile app up --build -d      # migrate, API on :4100, web on :3100
docker compose --profile app run --rm seed      # demo business
```

## Tests

```bash
npm test -w @varchasv/domain     # rules + shared fixtures + 2,000 random invoices
npm test -w @varchasv/api        # every module end to end against Postgres (needs the dev database)
npm run i18n:check               # every language has every key
cd apps/varchasv && flutter test # Dart port against the same fixtures + widget test
```

End-to-end offline sync against a running API (skipped when the variable isn't set):

```bash
cd apps/varchasv && VARCHASV_E2E_API=http://localhost:4100 flutter test test/e2e_sync_test.dart test/pos_e2e_test.dart
```

## Security and operations

- **Every route is checked** (`apps/api/test/security.test.ts`): it sweeps the registered route table.
  - Anonymous callers get 401 on everything except the short public list in `src/lib/public-routes.ts`.
  - A read-only member gets 403 on every route their role doesn't grant.
  - A second business requests every `GET /…/:id` route with every id from the first; nothing of the first business comes back.
  - Row-level security in Postgres backs this up underneath.
- **Sessions:** httpOnly, SameSite=Lax cookies, Secure in production (`COOKIE_SECURE` overrides this for a plain-HTTP test server). The offline app uses bearer tokens instead.
  - A password change signs out the user's other sessions.
  - A password reset works through a one-hour, single-use emailed link, and signs out every session.
- **Limits:**
  - 600 requests a minute per session (`RATE_LIMIT_PER_MINUTE`).
  - Tighter limits on sign-in, sign-up, password reset and invitations.
  - Body limits per route (uploads up to 8–30 MB).
- **Headers:** helmet on the API; on the web, frame-ancestors none, nosniff, a strict referrer policy and permissions policy, plus HSTS in production.
- **Email** goes over SMTP when `SMTP_URL` is set; otherwise it is written to the API log.
- **Load test:**
  - Run it with `npm run load-test -w @varchasv/api -- --email <seeded owner>`, against an API started with a high `RATE_LIMIT_PER_MINUTE`.
  - On a laptop, the production build with 20 concurrent connections serves:
    - lists and reports at 90–160 requests a second;
    - the dashboard at about 27;
    - new invoices at about 20 (each one posts to the ledger and stock and takes a number).
  - Every foreign key used in queries is indexed (migration `0030_fk_indexes`).
- **Backups:** `npm run db:backup` writes a `pg_dump` to `backups/`, and `npm run db:restore -- <file>` puts one back.
  - `npm run db:drill` backs up, restores into a scratch database, and checks that row counts, balanced books, row-level security and the audit-log guard all match.
  - In production, also keep the database provider's point-in-time recovery on.

## Deploying to Vercel

Two Vercel projects from this repo, plus a hosted Postgres (Neon through the Vercel Marketplace). Everything runs in Singapore (`sin1`), the closest region Neon offers on Vercel, on free plans (Vercel Hobby, Neon Free):

| Project | Root directory | Notes |
|---|---|---|
| `varchasv-api` | `apps/api` | `api/index.mjs` hands every request to Fastify (`src/serverless.ts`). Vercel Cron calls `/cron/reports` daily. |
| `varchasv-web` | `apps/web` | Next.js. `API_URL` (set before building) points `/api` at the API project, so cookies stay first-party. |

1. **Database.** Create the Neon database and connect it to `varchasv-api`. Then, with the owner's *direct* connection string, run:
   ```bash
   OWNER_URL="postgres://…" node scripts/hosted-db.mjs
   ```
   This creates the restricted `varchasv_app` role, runs the migrations, and writes `.env.hosted.local` (git-ignored).
2. **API environment:**
   - `APP_DATABASE_URL` (from `.env.hosted.local`)
   - `SECRETS_KEY`
   - `CRON_SECRET`
   - `WEB_ORIGIN` (the web project's URL)
   - `DB_POOL_MAX=3`
   - optionally `SMTP_URL`, `ANTHROPIC_API_KEY`
3. **Web environment:** `API_URL` (the API project's URL).
4. **Demo data:** the seed sends its requests to the deployed API, which runs next to the database:
   ```bash
   npm run demo:seed -- --url https://varchasv-api.vercel.app
   ```

Limits on the Hobby plan:
- Request bodies up to 4.5 MB, so larger Tally imports and statements must be split.
- Cron runs once a day.
- The rate-limit counters are per function instance.

## How offline sync works

- The Flutter app signs in once (`POST /auth/login` with `client: "app"` returns a bearer token) and
  registers as a device (`POST /devices`), which gives it a code such as `A1` and its own number
  series (`PA1/26-27/00001` for payments, `RA1/…` for receipts, …). Two devices can never issue the same number.
- Everything is written to the local SQLite database first, with an **outbox** entry in the same
  transaction. IDs are generated on the device, so a customer created offline can be used in a voucher offline.
- **Push** (`POST /sync/push`) sends the outbox in order; the server runs each operation through the
  same posting rules, and a retried operation is recognised and not applied twice. Refusals (e.g. a
  locked period) are shown on the voucher; network or server errors are retried automatically.
- **Pull** (`GET /sync/pull`) returns rows changed since the device's cursor. The cursor is a Postgres
  transaction id capped at the oldest still-running transaction, so a slow save is never skipped.

## How inventory is accounted

- **Periodic, like Tally.** Purchase bills post to Purchases + input GST + the supplier. Closing stock is
  valued from the stock ledger on the report date and appears in the P&L (gross profit = sales −
  purchases − opening stock + closing stock) and the balance sheet. Opening stock is dated the day before
  books begin and shows in the trial balance.
- **Valuation:** moving average or FIFO per company (`packages/domain/src/inventory.ts`, fixtures in
  `spec/fixtures/stock.json`, Dart port in `apps/varchasv/lib/domain/inventory.dart`).
- **The stock ledger is append-only.** Values aren't stored; they're computed by replaying the ledger,
  so back-dated entries never need reposting. A cancelled document's rows and their reversals are both
  skipped when valuing, so it counts as if it never happened.
- **Purchasing:** order → goods receipt (stock in at net cost) → bill (GL) → return (debit note, stock out).
  Over-receiving, over-billing, over-returning and booking the same supplier invoice twice are refused.

## Sales and GST compliance

- **Quotation → order → delivery challan → invoice → credit note.** A quotation has no stock or
  accounts effect and converts once, into an order or straight into an invoice (cancelling that
  document frees the quotation again). Delivering takes stock out; invoicing a delivered line doesn't
  take it out again. Over-delivering, over-invoicing and over-returning are refused. Credit limits, a
  missing HSN and invoices that need an e-way bill raise warnings, not errors.
- **e-Invoice and e-way bill** go through `apps/api/src/integrations/gsp.ts`. Until a GST Suvidha
  Provider is signed up, `SimulatorGsp` stands in and applies the real rules: the IRN is built the way
  the IRP does (SHA-256 of GSTIN + FY + doc type + number), duplicates are refused, the QR is signed,
  an IRN or e-way bill can be cancelled only within 24 hours, e-way bills last one day per 200 km
  (ending at midnight), can change vehicle while valid, and can be extended only from 8 hours before
  to 8 hours after expiry. An invoice is cancelled only after its e-way bill, then its IRN.
- **Returns:** GSTR-1 JSON in the GSTN offline-tool format (b2b, b2cl, b2cs, exp, cdnr, cdnur, HSN
  split B2B/B2C, document summary) and GSTR-3B (tables 3.1, 4 and the Rule 88A set-off order)
  (`packages/domain/src/gstr.ts`, fixtures in `spec/fixtures/gstr.json`).
- **Filing** (`apps/api/src/services/filing.ts`): connect to the GST portal with the taxpayer's portal
  username and OTP (a session of about 6 hours; the token is stored AES-256-GCM encrypted), upload
  the return, then file it with an EVC OTP; the portal's ARN is stored. Filing is refused if the books
  changed after the upload, and a filed GSTR-1 locks that month's invoices and credit notes. The
  simulator accepts the GST sandbox's fixed OTP, which the screen shows in test mode.
- **Secrets:** set `SECRETS_KEY` (32 random bytes, base64) in production; the API refuses to start
  without it there. Development falls back to a fixed, non-secret key.
- **Printing:** `/print/invoice/<id>` is an A4 Rule 46 tax invoice with the signed QR, tax by rate and
  the amount in words, and `/print/quotation/<id>` the matching quotation, with Hindi labels beside
  English when bilingual printing is on.
- **Importing:** customers/suppliers and items from CSV, or ledgers and stock items from a Tally XML
  export (Gateway of Tally → Export → Masters). Every import is previewed as a dry run first.

## HR and payroll

- **Rules** live in `packages/domain/src/payroll.ts` (Dart port `apps/varchasv/lib/domain/payroll.dart`,
  cases in `spec/fixtures/payroll.json`): PF (₹15,000 ceiling, EPS 8.33%, EDLI and admin 0.5%, optional
  full-wage PF), ESI (₹21,000 coverage decided per April–September / October–March period, both shares
  rounded up, no employee share at ₹176 a day or less), professional tax slabs for Maharashtra,
  Karnataka, West Bengal, Gujarat, Telangana and Andhra Pradesh, labour welfare fund (amounts and
  months set per company), income tax under both regimes (FY 2024-25 to FY 2026-27 slabs, 87A rebate with marginal
  relief, surcharge with marginal relief, 4% cess, ₹10 rounding), gratuity (15/26 per year, five years
  or one for fixed-term, ₹20 lakh cap) and leave encashment. Under the labour codes (from 21 Nov 2025)
  PF wages are at least half of gross; a setting turns this off. **Check the rate tables before each
  financial year.**
- **Monthly run:** a draft is built from salary structures and attendance (absent, half days, unpaid
  leave, and days before joining or after leaving are loss of pay); loss-of-pay days and deductions
  (e.g. an advance recovered) can be typed in. TDS projects the year's salary (final payslips so far,
  months paid before Varchasv estimated from the structure, this month, the rest at the current
  structure) and spreads the tax still due over the months left. Months are run in order.
- **Finalizing** posts Dr Salaries & Wages and Employer PF/ESI/LWF, Cr Salary Payable, PF, ESI, PT, LWF
  and TDS Payable (and Salary Advances for recoveries), and locks that month's attendance and leave.
  Paying posts Dr Salary Payable, Cr bank or cash. Files: EPF ECR 2.0 text, ESI monthly contribution
  CSV and a bank transfer CSV.
- **Leaving:** the settlement pays gratuity and leave encashment through a journal and marks the
  employee as left; the last month's salary is prorated in that month's run.
- Bank account numbers are stored encrypted (last four digits in clear); only the last four digits of
  Aadhaar are ever kept.
- **Extras on a payslip:** overtime, incentives or bonus typed in for the month (bonus can be kept
  out of ESI wages). **Arrears** are worked out automatically when a salary revision takes effect
  back into months already paid (up to a year): the difference is prorated by each month's paid days,
  the basic/DA part counts for PF, and each month's arrears are paid once (a second revision pays only
  the further difference). A back-dated cut isn't recovered automatically.
- **Advances and loans:** paid out from bank or cash (Dr Salary Advances); the instalment is
  deducted each month from the chosen month (it can be changed or skipped, 0, in a draft) and the
  loan closes when recovered.
- **Shifts and biometric punches:** a CSV of code, date, first in, last out is read against the
  employee's shift (late after start + grace; full or half day by minutes worked; night shifts
  crossing midnight work). Months with final payroll can't be changed.
- **Statutory dues:** each final month's PF, ESI, PT, LWF and TDS against challans recorded (Dr the
  payable, Cr bank), with due dates (PF/ESI the 15th, TDS the 7th, 30 April for March).
- **TDS returns:** Form 24Q deductee rows (Annexure I) and, in Q4, each employee's year (Annexure II)
  as CSV for the NSDL Return Preparation Utility; it flags a missing TAN or PAN and months where
  TDS deducted and deposited differ. **Form 16 Part B** is printed from final payslips (Part A comes
  from TRACES); months paid before Varchasv are listed so they can be added before signing.
- **Salary register** (CSV) and **payslip emails** for each final run.
- **Offline app:** employees, leave types and requests, attendance from the start of last month, and
  payslips of final runs sync to the device. Attendance and leave requests can be made offline; the
  server applies the same checks when they arrive and a refusal shows on the item.
- **Not yet:** the NSDL FVU text file itself (the RPU makes it), filing 24Q through a GSP, TDS on
  arrears spread over earlier years (relief under section 89), and employee self-service login.

## Recipes, manufacturing and POS

- **BOMs** (`packages/domain/src/bom.ts`, Dart has the POS half in `lib/domain/pos.dart`, cases in
  `spec/fixtures/manufacturing-pos.json`): multi-level, with wastage %, work-centre minutes × cost per
  hour and a fixed overhead per batch. Each save is a new version; one is the default. A loop is refused.
  Cost roll-up uses current stock rates (a sub-assembly without stock uses its own BOM cost).
- **Production orders** (`PRD/26-27/00001`): planned → released → output recorded (materials for
  good + rejected units are backflushed; unit cost = materials + overheads + extra issues ÷ good
  units) → completed. Extra material can be issued; cancelling reverses all the stock.
- **MRP** plans from open sales orders (by delivery date) and reorder levels, net of stock (not what's
  with job workers), open purchase orders and open production orders, level by level with lead times
  and minimum order quantities. Chosen lines become production orders and purchase orders (one per supplier).
- **Job work** (section 143): a JWO challan moves inputs to the job worker's own warehouse (still
  ours); a JWI challan brings back processed goods at sent cost + job charges. **ITC-04** lists
  what was sent, received and is still out, with the one-year (three for capital goods) return date.
- **POS** (`packages/domain/src/pos.ts`): prices with or without GST inside (the tax is split out so
  the customer pays the tag price), bill discount spread by value, round off, split payments (only cash gives change), and loyalty points (earned per ₹100
  paid, redeemed as a discount up to a share of the bill). Each counter has its own series
  (`T1/26-27/00001`). A shift is opened with a float and closed by counting cash; a shortage or
  excess posts to Cash Short/Excess. Bills post Dr cash / UPI clearing / card clearing / customer,
  Cr sales and output GST. Voiding is same day, in an open shift, and puts stock and points back.
- **GSTR-1** includes POS bills as B2C small by rate (less counter returns), POS lines in the HSN
  summary, and each counter's bill and return series in the document summary.
- **Offline counter:** a counter linked to a device (POS settings on the web) bills from the Flutter
  app with no connection. The device numbers the bills from its own series (continuing after the
  last number the cloud has), works them out with the Dart port and uploads them as `pos.bill`
  operations; the server re-computes each one and flags a different total rather than changing it.
  On-account sales, loyalty redemption and service charge need the web counter.
- Receipts print at 80 mm from `/print/receipt/<id>`.

## Banking, fixed assets, expenses and projects

Rules in `packages/domain/src/bank.ts` and `depreciation.ts`, cases in `spec/fixtures/banking-assets.json`.
Four permission modules (`banking`, `assets`, `expenses`, `projects`); migration 0023 adds them to
existing businesses' built-in roles.

- **Bank statements:** import a bank's CSV export (from Excel: Save As → CSV). The heading row and columns are
  found by name (HDFC, ICICI, SBI, Axis and similar layouts; separate withdrawal/deposit columns or one
  amount with Cr/Dr; dates like 05/10/26 or 05-Oct-2026). Lines already imported are skipped.
- **Matching:** a line is matched automatically when it's certain: the same cheque number, UTR or UPI
  reference (up to 90 days apart), or the only same-amount entry that day or naming the party. Others
  are suggested, matched by hand (several receipts can clear one deposit), posted as a new receipt,
  payment or contra, or ignored. **Bank rules** ("SMS CHARGES" → Bank Charges) post matching lines in one go.
- **Reconciliation statement** as on any date: balance per books ± cheques not presented, deposits not
  credited and bank entries not in the books = balance per bank, checked against the statement.
- **Bank feed** (`apps/api/src/integrations/bankfeed.ts`): the Account Aggregator adapter. Until a provider
  (Setu, Finvu, …) is signed up, `SimulatorFeed` approves consent at once and reports what the books show
  went through the account, with bank narrations and month-end SMS charges.
- **Gateway settlements:** a Razorpay settlement report (or any report with settlement id, amount, fee
  and tax) is posted once per payout: Dr bank (net), gateway charges and input IGST on them, Cr the
  ledger the collections were booked to (UPI or card receipts). The bank credit then matches it.
- **Fixed assets:** classes from Schedule II presets (useful life, residual 5%, income-tax block and
  rate), each with its own cost and accumulated-depreciation ledgers. An asset is bought on credit, paid
  from cash/bank (input GST can be taken) or registered as brought forward. **Depreciation** runs for any
  period within a year, straight line or WDV, pro rata by days, continuing from where each asset was
  last charged. **Selling or scrapping** charges depreciation to the sale date, then posts profit or loss
  (and output GST on the sale). The **income-tax schedule** works block by block (half rate for use under
  180 days, capital gain or loss when a block's sales exceed it or it ceases), carrying WDV forward.
- **Expense claims** (`EXP/26-27/00001`): lines by category with receipts (photo or PDF, up to 5 MB, kept
  in the database). GST credit is taken on a tax invoice with the vendor's GSTIN, unless the category is
  blocked under section 17(5) (meals, vehicle hire). Categories can have limits and require receipts
  above an amount. Approving posts Dr expenses and input GST, Cr Expense Reimbursements Payable; paying
  posts Dr that, Cr cash/bank. **Reading receipts:** set `ANTHROPIC_API_KEY` in the API's environment and
  Claude fills in vendor, GSTIN, bill number, date, total and rate (the user checks them); without it
  the details are typed.
- **Projects:** fixed price (milestones invoiced when due) or time and material (approved billable hours
  invoiced at each person's bill rate), or internal. Tasks, timesheets (cost per hour from the employee,
  else monthly gross ÷ 208, kept as at the day logged), job costing from hours, expense claims and
  purchase bills charged to the project, against budget. Cancelling a project invoice frees its
  milestones and hours to be billed again.
- **Not yet:** Setu/Finvu Account Aggregator itself, OFX/PDF statements, additional depreciation
  (section 32(1)(iia)), and employee self-service for claims and timesheets (planned with the mobile app).

Changing a business rule: update `spec/fixtures` first, then both `packages/domain` and
`apps/varchasv/lib/domain`, until both test suites pass.

## Analytics, assistant, CRM and field work

Rules in `packages/domain/src/schedule.ts` and `messaging.ts`, cases in `spec/fixtures/analytics-crm.json`.
A `crm` permission module (migration 0027); sales staff can work leads, accountants can view them.

- **Dashboard:** today's and this month's sales against yesterday and the same days last month,
  receivables and payables (overdue, due in 7 days), profit and gross profit this month, stock value,
  cash and bank balances, a 30-day sales chart, top customers, best sellers, largest amounts to collect,
  the sales pipeline and what is waiting for approval.
- **Alerts:** customers more than 60 days late, GSTR-1 (11th) and GSTR-3B (20th) due or late, items below
  reorder level, bank lines unmatched for a week, claims waiting over 3 days, late follow-ups, and a cash
  or bank ledger showing a negative balance.
- **Checks** (Reports → Checks): cash paid to one party over ₹10,000 in a day (section 40A(3)), cash
  received of ₹2 lakh or more (269ST), the same supplier billing the same amount twice within a week,
  sales below purchase rate, and stock below zero.
- **Report builder:** group and total sales, purchases, expenses, ledger entries or time by up to three
  dimensions (month, customer, item, HSN, state, ledger, employee, project…), download CSV, save, and have
  it emailed daily, weekly or monthly. Schedules run every minute from the API process with the creating
  user's permissions; the CSV is formula-safe.
- **Assistant:** answers questions about sales, dues, profit, stock and GST from the books, through
  read-only tools that respect the user's permissions; every question is in the audit trail. With
  `ANTHROPIC_API_KEY` set it uses Claude (`ASSISTANT_MODEL`, default `claude-sonnet-5-5`); without it a
  built-in assistant answers the common questions.
- **CRM:** leads (`LD-0001`) from first enquiry to won or lost, stage probabilities for a weighted
  pipeline, follow-ups (calls, meetings, tasks), and **Won: make a customer**, which creates the
  Sundry Debtors ledger (or reuses one with the same GSTIN). The customer page shows balance, sales this
  year and last, open bills, recent invoices and receipts, and the activity history.
- **WhatsApp:** message templates with numbered blanks (payment reminder, order confirmation, follow-up
  seeded). Set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_ID` (WhatsApp Cloud API) to send; without them messages
  are recorded but not delivered. **Send payment reminder** fills in the customer's outstanding amount.
- **Read bill:** on a new purchase bill, a photo or PDF of the supplier's bill fills in the form
  (supplier matched by GSTIN, items by name or HSN) when `ANTHROPIC_API_KEY` is set.
- **In the app:** the first screen is an overview from the API (cached for offline viewing) with
  approvals for claims and timesheets. **Field work** takes sales orders and expense claims offline; they
  upload through the outbox and get their numbers (`SO/…`, `EXP/…`) from the cloud.

## Translations

Twelve languages ship: English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam,
Punjabi, Assamese and Odia (`packages/i18n/locales.js`). The regional catalogues were machine-drafted
and should be reviewed by native speakers before selling in each region.

Edit `packages/i18n/messages/*.json`, then run `npm run i18n:check` and `npm run i18n:arb`
(regenerates the Flutter ARB files and the app's language menu) followed by `flutter gen-l10n` in
`apps/varchasv`. Placeholders are lower-camel ICU arguments like `{name}`; inside plural branches write
`{count}` rather than `#` (the check enforces this), so counts keep Latin digits and Flutter prints them.

- The web app runs each language with Latin digits (`mr-u-nu-latn`), so dates and counts match amounts.
- Readers of Devanagari languages (Hindi, Marathi) see the Hindi names of items and parties.
- Amounts in words exist in English, Hindi and Marathi; other languages use English words.
- Invoices, payslips and Form 16 print in English plus a second language chosen under
  Settings → GST & invoicing (Hindi by default). Fonts: Noto Sans for each script, loaded only when used.
