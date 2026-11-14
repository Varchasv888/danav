# Varchasv ERP: product plan (apparel, retail, wholesale and manufacturing)

Sources, all of which are in scope ("add all"):
- `E:\AnvishaMain\reports\Apparel ERP module requirements.md` (research, 27 Oct 2026).
- The G-Retail Extreme / G-Soft Extreme feature list and screenshots (29 Oct 2026), checked item by item
  against the code, and a hands-on survey of the running app the same day
  (`E:\AnvishaMain\reports\GRetail gap list.md`), which added R16 to R25.
- `additional_erp_features_roadmap.md` (v2) and `additional_erp_features_roadmap_v3.md` (Advanced ERP
  Product Blueprint), both 29 Oct 2026.

Work goes phase by phase in dependency order. Each step ends with tests green, the docs updated, a
commit and a Vercel deploy. Rewritten 29 Oct 2026 to take in v3 and the G-Soft parity audit.

Status key: [ ] to do, [~] in progress, [x] done.

## How we build (applies to every step)

Non-negotiables (v3 section 19):
- No silent stock or accounting adjustments; every balance is explainable from recorded movements.
- No untraceable change to a posted document. Corrections go through reversal, credit or debit note, or
  an approved amendment. Issued invoice numbers are never regenerated (GST needs them in sequence).
- No external event processed twice because a provider or device retried it (idempotency keys).
- No front-end-only security: tenant, branch and permission checks happen on the server and, where
  possible, in the database.
- No claim of a filed return, successful payment, delivered shipment or completed sync without evidence.
- No recommendation shown as certainty; high-impact actions need a person to approve them.
- No forks per customer: differences are configuration, not copies of the code.

Before a step starts, write down: the outcome it improves, which records own its data, its states and
reversals, retry and offline behaviour, accounting, tax and stock effects, permissions and audit, how it
behaves across branches and entities, how it is reconciled and tested, and the metric that shows it works.

Conventions:
- Rules live in `packages/domain` (TypeScript) with a Dart port in `apps/varchasv/lib/domain` and cases in
  `spec/fixtures` whenever the offline app needs them.
- Every new string goes into all 12 catalogues (`npm run i18n:check`).
- Services that need a paid account (SMS, card terminal, couriers, marketplaces, Shopify, Account
  Aggregator, GSP) ship as working demo adapters that switch to the real API when a key is set.
- AI and forecasting use statistics and rules that run in our own code; no paid model is required.
- Hosting stays on free tiers (Vercel Hobby, Neon Free) unless the user agrees otherwise.
- No em dashes in UI text or docs.
- A modular monolith: Accounting, Tax, Inventory, Orders, Purchasing, Production, POS, Customers,
  Payroll and Integrations stay modules of one app with tested contracts between them.

## UI and UX direction

The user wants the product to feel like G-Retail Extreme in how it is organised and how fast it is to
operate, with a modern look of our own. A full redesign pass is phase U; new screens built before then
already follow these rules.

What to take from the G-Retail screens:
- **Transaction menu as a launcher.** One screen lists every action in labelled groups (Sales,
  Accounting, Purchase, Branch, Job work, Other), each an icon tile with a short name (Sales, Counter
  slip, Tailoring, Delivery bill, Sales order, Order cancel, Sales order repairing, Approval issue,
  Approval receipt, Advance receipt, Gift coupon, Credit note, Inquiry, Customer token; Cash pay/rec,
  Bank pay/rec, Bill-wise receipt, Card receipt, Journal, Cash transfer; Purchase order, Inward challan,
  Purchase, Goods return, Debit note, GST JV; Stock outward, Packing slip, Stock inward, Stock
  distribution, Godown challan, Branch transfer; Alteration issue and receipt, Delivery memo, Job issue,
  Unfinished job issue and receipt, Job receipt). A filter box searches the tiles.
- **"My Menu", each user's favourites.** A grid of large square tiles (about six a row), each with its
  name at the top left and a big, colourful illustrated icon at the bottom right; the user picks any
  mix of masters, transactions and reports (sales, purchase, barcode print, inward challan, outstanding
  payable, customer history, footfall, min-max stock, sales analysis, ledger, item master with its
  shortcut key, and so on) and it opens as the home screen.
- **A home rail of things waiting:** today's summary, pending vouchers (credit notes not yet used,
  inward challans not yet billed, alterations pending, branch stock not yet received), outstanding
  payable and receivable, reminders (birthdays and anniversaries, last backup, SMS balance).
- **Keyboard-first entry.** Barcode scan into the line, Enter moves on, function keys for tenders and
  actions (F3 barcode, F5 card, F6 cheque, F7 credit note, F8 gift voucher, F9 cash, F10 adjust
  outstanding, F11 cash tender, Ctrl+I image, Ctrl+Q alteration slip, F12 print). Every shortcut is shown
  in a footer bar.
- **Dense, single-screen documents.** The sales bill keeps header (bill no., date, day, time, due
  balance, scheme points, token no., approval and advance links), the line grid (type sale or return,
  barcode, item, salesman, design, colour, alteration flag, qty, rate, discount, tax, net), and side
  panels (size-wise stock of the scanned design, item photo, customer card with points, ledger and
  outstanding, bill totals, payment split) on one screen without scrolling.
- **Context panels on entry screens.** Inward challan shows the item photo, the last five purchase rates
  and MRPs, size-wise entry, mark-up and mark-down % to MRP, and transport and LR details.
- **Report conventions.** A filter row under every column header, totals in a footer, Print, Export
  (Excel and PDF) and Email on every report, summary or detail toggles, branch filter, "compare to last
  year", % of total columns, group-wise, with-account and main-account views, vertical or standard
  balance sheet, and a chart under the grid that can switch type.
- **Business intelligence home.** KPI tiles (sales qty and amount, average bill and rate, profit %,
  stock, purchases, receivable and payable) with hourly sales, top salesmen, top products, top
  suppliers by sales, sales by tender, and sales ageing buckets.
- **Colour and size matrices** with sizes as columns, a thumbnail per design and colour that enlarges on
  hover, and brand, product, design, lot and department filters.
- **Image catalogue as a shop.** Filter facets on the left (inward date, stock, rate slider, brand,
  product, design, colour, lot), tiles with photo, price, stock, sales, sizes and rating, add to cart,
  party-wise stock switch, tile size slider.
- **Listings that read like registers.** Sales listing shows each bill with qty, gross, item discount,
  net, bill discount, cash, card, outstanding, loyalty and advance columns, with discounted bills
  highlighted.

What we do better than the reference: clean modern styling with one text size, light and dark themes,
works on a phone and a desktop, the same screens in 12 languages, and no hidden state (every pending
item links to the exact record).

## Phase A: data model and tax (blocks every apparel sale)
- [x] A1 GST rate by price: slab presets (apparel and footwear, effective-dated: before 22 Sep 2025
      Rs 1,000 with 5/12; from 22 Sep 2025 Rs 2,500 with 5/18; footwear before: Rs 1,000 with 12/18),
      item `gst_slab` + `slab_pieces`, rate picked per line after discounts (bill discounts spread
      first), in the TypeScript and Dart rules with shared fixtures; applied in sales, purchase, POS
      (web and offline); credit notes keep the original line rate. The slab exception report moves to
      D4. Also fixed: PATCH routes no longer reset defaulted fields (zod fills defaults inside partial()).
- [x] A2 Styles: style master (design no., brand, category, season, collection), colour library, size
      scales, optional third dimension (fit); SKU generation (one item per colour and size, own code
      and in-store EAN-13), grid entry on sales, purchase, stock and POS screens; colour-size stock grid.
- [x] A3 Sets and ratio packs: a pack item made of SKUs in a ratio, billed as one line, stock moved
      as pieces; slab test per piece or per set (setting).
- [x] A4 Alternate units: buy in dozens or boxes, sell in pieces. Item units with factors (per item or
      for every variant of a style); sales and purchase lines pick the unit and convert quantity and
      rate to the base unit, so stock, GST slabs and valuation always work in pieces.
- [x] A5 Documents: proforma invoice (own PI series, advance requested, converts to order or invoice,
      "not a tax invoice" print); delivery challan reasons under Rule 55 (supply, approval, job work, not
      a supply, lots, exhibition, other) with value and, for supplies, tax on the challan, transporter and
      vehicle, triplicate print; approval memo with goods taken back (stock returns at the cost it left
      at), invoicing of the rest, the s. 31(7) six-month invoice-by date, a "Goods on approval" page and
      dashboard alerts after 30 days and near the six-month limit.
- [x] A6 Wholesale credit: per customer "warn" or "block" when over the credit limit or with a bill
      overdue past the allowed days (orders, challans sent as supplies, invoices; offline field orders
      only warn); owners and admins (sales.approve) can override, recorded in the audit log. Ageing
      30/60/90/180 and over. Interest on overdue at each customer's rate (or one asked for), with the
      s. 15(2)(d) note that it is billed with GST. Party price lists: a discount off the sale rate plus
      fixed item rates, filled in on new sales documents.
- [x] A7 Brokers and agents: any party ledger can be a broker or agent with a commission rate; customers
      carry a default agent and salesman, which fill in on orders and invoices (an invoice from an order
      takes the order's). Commission is earned on money received: each invoice's taxable value, less
      goods returned, times the share of the bill paid (credit notes come off their own invoice, other
      receipts pay the oldest bill first). Brokerage bills post commission expense, credit the agent net of
      194H TDS (2% once the year's commission passes Rs 20,000, or a rate given) and record each invoice's
      share, so returns after a bill net off on the next one; cancelling a bill puts it back as due.
      Salesman targets per month with slabs (from % of target, commission %), against taxable sales less
      that month's credit notes.

## Phase B: store floor (GRetail parity)
- [x] B1 Schemes at the counter: percent off (with a minimum), amount off, quantity and value slabs,
      buy X get Y (free or a percent off the cheapest of each group), combos and hampers at one price,
      date ranges and an on or off switch. A scheme covers items, styles, brands or categories (the
      server turns these into item ids); one rule set in packages/domain/src/schemes.ts with a Dart
      port and shared fixtures, so the offline counter gives the same discounts. Each line takes one
      scheme, a line with its own discount takes none, and every order of up to six schemes is tried
      to find the biggest saving. Bills record the schemes applied. Wholesale invoices do not take
      schemes yet (trade schemes follow in M4).
- [x] B2 Gift vouchers sold with their own codes (money held as a liability, no GST until spent on
      goods), paying all or part of a counter bill, balances given back on a void, unspent balances
      written back to income after expiry. Coupon codes (percent with a cap, or an amount; minimum bill,
      dates, uses) and discount cards (percent while valid), both price reductions worked out by
      promoDiscounts in packages/domain so the screen and the server agree. Referral points for the
      member who brings a new one. Lucky draws among the period's bills with a mobile, one win per
      mobile. Online counters only; the offline counter refuses them.
- [x] B3 Returns and exchanges at the counter: lines back against a bill (up to what is left) with a
      reason (size, colour, defect, damaged, did not like, other) and a condition grade (A back on the
      shelf at the cost it left at; B and C to a "Damaged and seconds" store). A B2C credit note at the
      bill's own prices and tax, refunded to the rupee in cash, UPI or card, or as store credit (a gift
      voucher) that pays for the size or colour swap on the next bill. Refunds come out of the shift's
      cash; returns come off GSTR-1 B2CS and the B2C HSN summary, count as credit notes in documents
      issued, and reduce GSTR-3B. Returns page with counts by reason and condition.
- [x] B4 Alterations and repairs: karigars (in-house, or outside with their own ledger), types with
      the customer's charge and the karigar's labour, slips against a counter bill or on their own with
      trial and delivery dates, taken in, given to a karigar, back (outside labour credited to the
      karigar), handed over with the charge collected on a counter bill unless free. Board by stage
      with overdue and trial-today marks, labour by karigar for the month. Removed restaurant tables,
      kitchen tickets, service charge and recipe-on-sale; the demo is now a garment business.
- [x] B5 Made-to-order tailoring: measurement cards per customer and garment (inches, with a photo),
      karigar rates per garment and process, orders with the customer's own fabric or fabric from
      stock, trial and delivery dates, an advance held as store credit for the order; each process
      given to a karigar and marked done (outside labour credited then), ready when all are done; the
      tailoring bill is a counter bill for stitching and fabric with the advance taken off. The board
      flags trials due, deliveries today and overdue orders.
- [x] B6 Shop-in-shop and consignment: each consignee customer gets its own store ("At <name>"),
      so goods sent stay in your stock and books; take-backs return them to the main store. Their
      sales report becomes a tax invoice from that store at the agreed rate (input, price list or
      sale rate), and goes through over a credit limit with a warning. Reconciliation per item:
      sent, taken back, sold, with them, any mismatch, the oldest pieces out (first in, first out)
      with a bill-by date six months on, flagged after 150 days; a stock count bills the shortage.
- [x] Books from a past date and two years of demo history: a business can start its books on a past
      date (from FY 2024-25); payroll has the FY 2024-25 tax slabs; the demo seed trades every month from
      1 April 2024.
- [x] B7 Image catalogue: photos per style and colour (front, back, detail, on model, other), shrunk in
      the browser to a full view and a thumbnail before upload (about 20 KB and 3 KB), the same picture
      refused twice, first photo chosen, removed photos archived; thumbnails in the colour-size stock grid.
      Inventory > Image catalogue: tiles per design and colour with photo, rate (sale rate or a party's
      price list), stock in own stores, sales in the last 90 days and sizes; search by barcode, design,
      name, brand or colour; filters by brand, category, season and colour with counts, rate range, in
      stock, with photo, received between; sorting; tile size; a cart saved as a selection for a party.
      A selection prints as a catalogue (PDF from the browser), exports to Excel (CSV), shares by a link
      that opens without signing in until it expires (only a hash of the token is kept; a new link stops
      the old one), is sent on WhatsApp (demo messenger until a key is set), and turns size quantities
      into a sales order at the party's rates. Still to come: thumbnails on the bill (U2), counts started
      from the catalogue (R3), photo review queue and weight ranges if customers ask.
- [~] B8 Counter extras. Done (30 Oct 2026, demo-first): held bills shared by every counter, salesman per
      bill and per line, rate lock and line and bill discount limits that only an approver can pass with a
      reason (kept on the bill), function keys F2 to F10 and Ctrl+Enter with a key bar, the scanned design's
      photo and stock by colour and size beside the bill (a click adds that piece), and the customer's
      visits, spend net of returns, last visit and usual buys when their mobile is entered.
      Barcode and price labels (EAN-13 drawn in the browser) on a 50x25 roll, a 2-across 38x25 roll, A4
      sheets of 65 or 50x75 hang tags, from a search, a whole design or a purchase bill, with chosen fields.
      Still to do: footfall count per store and hour, appointments and tokens (fitting, trial,
      tailoring, alteration and repair desks with wait, no-show and reschedule), counter slips, SMS
      adapter (demo until a provider key is set), card terminal adapter (demo), RFID file import for
      stock counts with duplicate-read filtering.

## Phase S: prove the foundation (v3 stage 0; before more features)
- [~] S1 Canonical IDs and states. Done 3 Nov 2026: the written lifecycles of nine kinds of document (domain lifecycle.ts) and a test
      that drives real flows (sales order, delivery order and challan, stock transfer, stock count, loan request, stipend) and checks
      every state is declared and every move allowed. Left: item and variant, payment, return, production order and posting
      states, change request and employee loan flows in the test. Original scope: Canonical IDs and states: written lifecycle states for item and variant, order, payment, return,
      stock movement, production order and posting; a test per state change and reversal.
      Update 3 Nov 2026: written lifecycles added for sales invoice, purchase bill, counter bill, voucher, goods receipt, production order, item variant and payment, with a test that drives invoice, bill, counter bill, voucher and receipt through posted and cancelled. Left: item and variant, production order and posting states are written but only the first five are driven in the test.
- [~] S2 Integrity checks. Done 2 Nov 2026: Integrity page (/reports/integrity) with ten checks: vouchers
      balance, trial balance, invoices and bills against the ledger, posted documents have vouchers, cancelled
      vouchers net to zero, receivables, payables, gift-voucher liability, negative stock; each lists the records
      behind a difference. The demo seed now books the owner's capital so openings balance. Two more checks (3 Nov 2026): GST on each posted invoice against the output tax accounts, and each finalised or paid payroll run against Salary payable. Left: stock value (the books do not post stock to the ledger, so there is nothing to compare) and consignment stores against the ledger; invariant tests that no flow double-posts.
      Update 3 Nov 2026: invariant tests that no flow posts twice (cancelling an invoice, bill or counter bill a second time is refused; the same counter bill sent twice makes one bill, one voucher and one stock movement; every voucher balances; no document owns two live vouchers; a cancelled document reverses exactly once). Left: consignment stores against the ledger.
- [~] S3 Tenant safety. Done 3 Nov 2026: a database test that every table with a tenant_id has row level security and a tenant
      policy, and that the application role holds no update or delete on the ledgers (found and revoked a stray one on the
      stock ledger, migration 0068). Left: branch and warehouse scope on permissions, cross-tenant tests for jobs, files,
      exports and scheduled emails. Original scope: cross-tenant tests across API routes, background jobs, files, reports, exports
      and scheduled emails; branch and warehouse scope on permissions.
      Update 3 Nov 2026: cross-tenant tests for files, business exports, scenarios, messages, saved and scheduled reports, and the background senders (messages and reports work one business at a time). Left: branch and warehouse scope on permissions.
- [~] S4 Backups the business owns. Done 2 Nov 2026: per-business export (/settings/backup, GET
      /export/business.zip): every table as CSV and JSON, uploaded files, README and a manifest of checksums;
      secrets left out; audited. Locked backup (3 Nov 2026, English only): the export encrypted with a passphrase (AES-256-GCM) for off-site storage, and a restore drill that
      opens a saved backup and checks every file against its checksum without touching the business. Scheduled backups done 3 Nov 2026 (English only): daily or weekly at an India hour, the locked copy emailed to up to five addresses with the passphrase kept sealed on the server, a Back up now button, a history of runs with size and checksum, failure emails, a home alert when a failure or two missed cycles is on record, and a /cron/backups route for hosts without a long-running process. The restore check now also confirms the copy's ledger balances. Left: a true restore into a separate test business (needs every id remapped).
      Update 3 Nov 2026: a true restore (POST /export/restore-test, Settings, backup page): the locked backup is opened with its passphrase, the person confirms their password, and every table is rebuilt as a new separate business with new ids and references changed to match, in the order references allow, then checked row by row and by ledger totals against the backup; the person becomes owner of the copy. Messages, scheduled reports and changes, backups, devices, punches and the audit log are not carried so the copy cannot act on its own. Nothing left on this step.
- [~] S5 Tamper-evident audit. Done 2 Nov 2026: entries are sealed into a per-business hash chain (batch
      sealing by the scheduler or on demand; the app role cannot update the log, only a narrow function can
      seal), a Check button on the audit trail walks the chain and names the first broken entry (edited,
      missing or out of order). Request IDs (3 Nov 2026): every response carries x-request-id, kept on each audit entry the request makes. An outside copy
      of the latest hash (Show latest hash, paste it back to check): a deleted last entry is caught. Reasons on overrides (3 Nov 2026): letting a sale through a credit block now needs a reason (3 to 200 characters), kept in the audit entry; counter overrides already did. Nothing left on this step except overrides added later.
- [~] S6 Sensitive-change controls. Done 2 Nov 2026: a Sensitive changes page (/settings/sensitive-changes)
      from the audit trail, filtered by kind (bank details, credit terms, tax and company settings, who may
      do what, period locks and numbering, payroll settings, credit override, devices), account numbers
      masked, and a home-page alert for changes in the last 7 days. Maker-checker on a party's bank details (/settings/approvals, 3 Nov 2026,
      English only): a switch, changes by people without the approve right are held, someone with the right who did not ask
      approves or rejects, masked numbers, audit shows approver and requester. Employee bank details (3 Nov 2026): the same switch holds an HR editor's change to an employee's bank name, IFSC or account number for a second person, with the sealed number never shown. Dated changes (/settings/dated-changes, 3 Nov 2026, English only): a GST or cess rate, sale, purchase or MRP rate on an item, and credit limit, credit days or interest on a party, set to start on a future date; the scheduler applies them (or /cron/changes), the previous value is kept, pending ones can be cancelled, and each application is in the audit trail. Left: dating other kinds of setting (tax slabs, number series, role permissions).
      Update 3 Nov 2026: a role's whole set of permissions and a numbering series' pattern can be dated to start on a future day (through /config/changes; the dated-changes screen still offers only items and parties). Left: tax slabs (they are law, held in the shared package).
- [~] S7 Offline declared per action. Done 3 Nov 2026: every action is declared allowed, read only or online only in the domain
      package (offline.ts), served at /sync/offline-rules, and a test keeps it equal to what the sync endpoint accepts. Done 3 Nov 2026 (English only): the Flutter app keeps the same table (Dart port checked against spec/fixtures/offline_rules.json), refreshes it from /sync/offline-rules on every sync and loads the saved copy at start, lists it on its sync screen and says so when the server has revoked the device; /settings/devices shows each device with last sync and open refusals and revokes one; the server writes down every operation it refuses (once per device and operation) and /settings/devices lists them to settle with a note, audited. Left: local data protection (an encrypted on-device database) and a conflict screen on the device itself that offers edit-and-resend. Original scope: Offline declared per action: each offline-app action marked allowed, read-only or online-only;
      device enrolment, remote revoke and local data protection; sync status and conflict queue visible.

## Phase R: retail parity pack (G-Soft items not yet covered, high frequency first)
- [~] R1 Counter and billing. Done (30 Oct 2026, demo-first): an exchange on one bill (F5): the old bill's
      lines come back as a credit note inside the new bill, the credit pays first, any credit left stays as
      store credit with a code, and the receipt prints the returned pieces; customer history and the
      scanned design's size-wise stock beside the bill were done in B8. Still to do: customer history on the bill (total spend, net of returns, by product and
      category, last visits); sale and return lines in one bill grid (exchange in one document, original
      bill linked); approval memo, order, advance and token picked from the bill header; size-wise stock
      of the scanned design and item photo beside the grid; split tenders with tender-wise day-end;
      duplicate submit protection.
      Update 3 Nov 2026: duplicate submit protection (the counter sends one id per bill; pressing pay twice or retrying after a lost reply returns the same bill, one voucher, one stock movement). Customer history and split tenders (up to six payments, tender mix in the sales report) were already done. Left: approval memo, order, advance and token picked from the bill header; sale and return lines in one grid beyond the exchange.
- [~] R2 Product identity and receiving. Done (30 Oct 2026, demo-first): the goods receipt is now the
      inward challan: transporter, LR number and date, size-grid entry, mark-up % to MRP with shop rounding
      (ends in 9, next 10 or 50, nearest rupee), margin % per line, the item's photo, MRP, stock and last
      five purchase rates beside the line; the MRP set goes onto the item (audited) and labels print from the
      challan. Other barcodes done 3 Nov 2026 (English only): an item answers to supplier or alternate codes (item page, Other codes), scanning finds it at the counter, in labels and in stock counts, a merged duplicate's barcode becomes an alias, and no code can belong to two items; old documents are never rewritten. Still to do: optional serial or unique-piece IDs; inward challan with size-wise entry, mark-up and
      mark-down % to MRP, last five purchase rates, LR and transport; partial receipts with shortage,
      damage and quality hold; inward return against the challan; minimum and maximum stock levels with
      reorder point.
      Update 3 Nov 2026 (/purchase/receiving): the inward challan records what the challan said, what came short or damaged and what goes on quality hold (a Quality hold warehouse, not for sale); held goods are passed (into stock, billable) or rejected (back to the supplier, order open again) by someone with the approve right; accepted goods can be sent back before they are billed; a supplier claims report values short, damaged and returned goods by supplier. Min and max stock levels with reorder were already done. Left: optional serial or unique-piece IDs.
- [~] R3 Stock counts and losses. Done (30 Oct 2026, demo-first): counts of a store, a brand, a category or
      a design; scanning (one piece per scan, or 5*barcode) or typed counts; blind counts that hide the
      books from counters; submit, recount or approve; approval by someone with inventory approval, with a
      reason, posts one stock adjustment at the cost when counting began. Still to do: count sheets by location, brand or design, blind counts, mobile
      scanning, count variance approval; physical verification any time; stock audit report. Damage and loss done 3 Nov 2026 (/inventory/losses, English only): reason codes, a photo or paper as evidence, writing off at cost through a stock journal, an approval limit above which a second person with the approve right must decide, and a by-reason report. Left of the original scope: count sheets by location, blind counts, mobile scanning; damage and loss
      Update 3 Nov 2026: spot checks (a count of chosen items that records the difference and does not adjust stock), counts by season or a list of items, a printable count sheet (/print/count-sheet/<id>, books hidden on a blind count), and a stock audit report (/inventory/counts/audit: accuracy of the books per count, short and excess value, items short in more than one count). Left: counts by location (needs bins, phase W).
- [~] R4 Stock and sales reports. Done (30 Oct 2026, demo-first): colour-size matrix of stock or sales
      with photos (hover to enlarge), stock ageing first in first out with dead stock, sales register with
      payment split and totals, all exportable to Excel. Still to do: daily and monthly sales and stock registers; a graph on stock
      ageing; moving, slow and non-moving;
      dead stock tracer; stock ratio (cover, sell-through, size availability); month and year
      comparisons; sales against purchase comparison; vendor analysis (price, lead time promised and
      actual, fill rate, returns, defects); sales profit by item, design, brand and party; pending and
      order backlog reports; hourly and time-of-day sales.
      Update 3 Nov 2026 (/reports/registers): sales, purchase and stock registers by day or month; this year against last by month; sales against purchases; profit by design, item, brand, category or customer; stock ratios by design (days of cover, share sold, sizes in stock); vendor analysis (rate per piece, promised and actual lead time, order filled, late orders, returns); purchase order backlog with days late. Stock ageing, fast and slow movers and hourly sales were done earlier. Left: a graph on stock ageing.
- [~] R5 Accounting report parity. Done: compare to last year on profit and loss. Compare to last year on the trial balance (3 Nov 2026). Cash flow statement done 3 Nov 2026 (/reports/cash-flow-statement, English only: operating, investing and financing by the indirect method, adding up to the change in cash and bank, any gap shown). Still to do: cash flow grouped like the balance sheet
      statement grouped like the balance sheet; compare-to-last-year column on the balance sheet (3 Nov 2026) and on the trading
      account; opening trial balance; % of total; group-wise, with-account and main-account views;
      vertical view; ledger with previous year, book, month and date-wise views and pending
      transactions; bill-wise outstanding that opens the invoice's items; TCS report.
      Update 3 Nov 2026: a share-of-sales column on the profit and loss (% of sales toggle). Last-year columns on the balance sheet and the trading account were already done. Left: vertical view, ledger views by previous year, pending transactions.
- [~] R6 Chain stores. Done 3 Nov 2026: stock transfer with an in-transit stage (/inventory/transfers): dispatch moves stock into an
      In transit warehouse, the other side receives the counted quantity, a shortage is recorded and leaves stock,
      an unreceived transfer can be called back. Left: allocation by demand, packing slips, branch comparison,
      branch price and offer allocation. Original scope: branch-wise distribution of new stock (allocation by expected demand, ratio or
      fixed), branch transfer and godown challans with in-transit stock and receipt reconciliation,
      packing slips, branch-wise sales and stock reports, head office and branch comparison, branch
      price and offer allocation with start and end time.
      Update 3 Nov 2026 (/inventory/distribution): stores compared side by side (sales and share, pieces, bills, average bill, stock, value and days of cover), new stock shared between stores by recent demand, a ratio or fixed pieces and sent as transfers, and a transfer packing slip (/print/transfer-slip/<id>). Branch-wise offers were done under R20. Left: branch price lists.
- [~] R7 Loyalty and membership. Done 3 Nov 2026 (English only): /pos/loyalty with members and search, birthday and anniversary per member,
      who to wish in the next 14 days, points held and what the shop owes, earned and redeemed this month. Point slabs by bill amount and a minimum to redeem done 3 Nov 2026 (TypeScript and Dart with shared fixtures; set on the POS settings page). Left: the other earning and
      redeeming rules (validity days, exclusions), which the offline app shares and needs the same change for. Original scope: membership IDs with assignment rules, card and cardless members,
      point slabs by bill amount, point validity days, minimum points to use, value per point, filters
      by department, brand or product, exclusions (discounted bills, auto-discounted items, outstanding
      bills), point reversal on returns, birthday and anniversary reminders, loyalty report.
      Update 3 Nov 2026: points validity (set in days; each bill's points are a lot that lapses on its own date, spent soonest-lapsing first, taken off at the next bill and not redeemable once lapsed, with points expiring in 30 days on the loyalty report) and earning exclusions (no points on a discounted bill, on discounted items, or on listed brands and categories). Counter bills only; the offline app takes its points from the server at sync.
- [~] R8 Salesman pack. Done 3 Nov 2026 (English only): commission rules by item, brand, category, MRP range or everything
      (/sales/commission-rules), the most specific rule wins, monthly commission per salesman net of returns and credit
      notes, uncovered sales shown. Left: margin and stock-ageing bands, helper attribution and helper commission, helper
      attendance, chart. Original scope: yearly and monthly targets; commission by item, barcode or article, MRP range,
      brand, margin and stock-ageing band; helper attribution and helper commission without double
      counting; reversal on returns; salesman-wise sales with chart; helper attendance.
      Update 3 Nov 2026: commission by margin earned and by stock age bands, helper on a bill with the helper's share of the commission (setting) taken from the salesman's so the total never exceeds the rule, helper days worked from attendance, a sales bar chart, and a yearly targets view (/sales/targets). Targets now count counter bills as well as invoices. Reversal on returns was already done.
- [~] R9 Service desk. Done 3 Nov 2026 (English only): repairs from intake to hand-back (/sales/repairs): diagnosis, estimate, approval,
      warranty (no estimate, no charge), spares used, deposit and charge tracked, decline or cancel with a reason, open and overdue list,
      a written lifecycle. Money in the books done 3 Nov 2026: a deposit is held as a liability (Repair deposits), delivery books the charge as Repair and service income, uses the deposit and takes or refunds the difference, a declined or cancelled job returns the deposit; GST on the charge is not yet added. Left: customer ledger for repair and tailoring
      customers, sales order repairing, inquiry log. Original scope: Service desk extras: repair intake with diagnosis, estimate approval, spares used, warranty or
      chargeable; customer ledger and outstanding for tailoring and repair customers (deposits as
      liabilities, never revenue early); sales order repairing; order cancel with reasons; inquiry log.
      Update 3 Nov 2026: GST on a repair (the charge is what the customer pays; at delivery the tax inside it goes to the output tax accounts half and half, none on a warranty repair), an inquiry log (/sales/inquiries: a question, a follow-up day, due ones first, closed with what came of it) and repair and tailoring customers (/sales/service-customers: deposits and advances held for each customer, never income until delivery, and what is left to collect). Left: sales order repairing.
- [~] R10 Shop-in-shop extras. Done 3 Nov 2026 (English only): settlement terms per consignee (days to settle, who follows up differences), settlement due
      date from the oldest goods still out, late flag and differing-item count on the consignment screen and list. Left: scheduled emails to the
      consignee, reports by date, discount, branch, brand, item and salesperson, invoicing across our branches. Original scope: Shop-in-shop extras: scheduled stock and sales emails to the consignee; reports by date,
      discount, branch, brand, item and salesperson; invoicing across our branches; discrepancy owner
      and settlement due date.
      Update 3 Nov 2026: shop-in-shop sales by month, day, consignee, brand, category, item or discount below MRP (/reports/consignment-sales) and a stock and sales statement emailed to the consignee every week or month (set on the consignee, a scheduler and /cron/statements). Left: reports by salesperson and branch (consignment bills carry neither), invoicing across our branches.
- [~] R11 Utilities. Done 3 Nov 2026 (English only): user activity report with KPI tiles (/reports/user-activity: active users, sign-ins,
      documents made, changes, cancellations, vouchers made) from the audit trail. Merge duplicates done 3 Nov 2026 (/masters/merge: a customer or supplier's balance moves to the one kept on a journal voucher and missing details are copied; an item's stock moves at its own cost and its barcode goes across; the duplicate is closed and points at the kept record; history stays put because the books are append-only). Left: label printing, bulk rate
      updates with approval (the rate change itself is done under R29), courier entry, data lock by process. Original scope: Utilities: cheque, envelope and parcel label printing; merge duplicate accounts, items,
      designs, colours and barcodes by alias (history kept); bulk rate and MRP updates with a valuation
      preview and approval; article-wise discount and commission; courier and parcel entry; data lock by
      process as well as period; user activity report with KPI tiles (active users, sessions, hours,
      vouchers created and altered).
      Update 3 Nov 2026: cheque printing from a payment voucher (/print/cheque/<id>, with date boxes, amount in words, A/C Payee crossing and a shift in millimetres to fit the leaf), envelope printing from a party (/print/envelope/<id>) and parcel labels, one per carton (/print/parcel-labels/<id>). Left: bulk rate updates with approval, courier entry, data lock by process.
      Update 3 Nov 2026: data lock by kind of document (/settings/process-locks: nothing of that kind can be made on or before a date, apart from the period lock), and bulk rate updates that need a second person's approval (/inventory/rate-update: the preview shows the effect on the value of stock in hand; someone without the approve right asks, someone else approves and it applies; nobody approves their own). Courier and parcel entries are the LR entries already built. Left: none of the original list.
- [~] R12 Payroll extras. Done 3 Nov 2026 (English only): performance reviews on the employee page (period, 1 to 5 rating,
      what went well, what to improve, history and average). Absent and late (/hr/attendance-alerts, with a home-page alert, 3 Nov 2026, English only). Attendance machines (/hr/attendance-devices, 3 Nov 2026): a fingerprint, face or card machine that speaks the ZKTeco ADMS cloud protocol (also eSSL, BioMax, Realtime) pushes punches to /iclock/cdata; the serial number registers it to a business, each punch is kept as sent, matched to the employee by saved punch number or code digits, and the day worked out from first and last punch against the shift (a hand-marked day or leave is never overwritten). Left: travel claims linked to expense claims. Original scope: performance appraisal, employee rating and review history; travel claims
      linked to expense claims; absence and late notifications.
      Update 3 Nov 2026: travel claims are expense claims whose lines carry a trip (from, to, kilometres, days); a category with a per-km rate and a daily allowance pays the trip by that policy and refuses a typed amount that differs; a travel register by person (/expenses/travel). Nothing left on this step.
- [~] R13 Communication centre. Done (30 Oct 2026, demo-first): WhatsApp for counter bills (sent by
      itself when the customer gives a mobile, a POS setting) and tax invoices, each with a link that opens
      the bill or invoice without signing in for 90 days; payment reminders to one customer or everyone
      overdue, with a link to their statement of open bills and the bank details, listing customers with no
      mobile to call instead; a WhatsApp log of everything sent. Still to do: one service for SMS, email,
      WhatsApp and push with templates per
      language, trigger events, consent and opt-out, retries without duplicates, delivery status and cost.
      Events: bill to customer and owner, outstanding reminder, appointment and token, trial and
      delivery, repair and alteration status, order updates, month-wise and time-wise sales to the owner,
      scheduled summaries, backup status, credit-day exceptions, absent employee, payroll, OTP login,
      promotional campaigns with consent.
      Update 3 Nov 2026 (/crm/communications): one service for WhatsApp, SMS, email and app notifications: wording per event, channel and language with English as the fallback, 16 events, consent (marketing only to those who agreed; a STOP reply opts out of everything but sign-in codes), an outbox with retries (up to a setting, waits growing), a dedupe key so one event never sends twice, delivery receipts, cost per channel and a report, owner contacts for owner events, campaigns to consenting customers, and a scheduler. SMS and app notifications use demo senders until a gateway is set; WhatsApp uses the existing messenger. Left: wiring each existing flow (bill, repair, payroll and so on) to raise its event, and provider webhooks.
      Update 3 Nov 2026: a repair that is ready or handed back queues a WhatsApp and SMS message to the customer, once each. Left: the other flows (bill, payroll, daily sales to owner) raising their events, and provider webhooks.
- [~] R14 Mobile parity (Flutter app). Done 3 Nov 2026: the app shows only the sections the signed-in person's rights allow (counter, books, people, field, figures) and opens on the one their role works in (a cashier on the counter, HR on people, an accountant on the figures), the rights are fetched on connect and refreshed on every sync and kept for offline starts, with a test per role; offline status per action is listed on the sync screen. Left: stock audit by scan, counter slip and token, the reports, customer profile, image capture, cash and bank entry. Original scope: role home screens (cashier, manager, warehouse, buyer,
      accountant, owner); stock audit by scan; counter slip and token; salesman, sales, stock and
      outstanding reports; customer profile and feedback; image capture into the catalogue; cash and bank
      entry and reports; offline status per action.
- [~] R15 Business intelligence home. Done (30 Oct 2026, demo-first): Business insights page with period
      presets and dates; tiles for sales, pieces and bills, average bill and rate, margin on standard cost,
      purchases, stock, to collect and to pay, each against the same period last year; sales trend by day
      or month and busy weekdays (hover values, table view); best designs, salesmen, customers, brands; how
      customers paid; sales ageing first in first out. Hourly sales done 3 Nov 2026 (busy-hours chart on the insights page; device bills now carry the time they were rung up, not the time they synced). Still to do: chart type switch, drill to records.

GRetail gaps with no step until now (hands-on survey, 29 Oct 2026, `E:\AnvishaMain\reports\GRetail gap list.md`):
      Update 3 Nov 2026: the sales trend can be shown as bars or dots, and each day or month on it opens the sales register for that period. Left: drill from the other panels.
- [~] R16 Wholesale billing extras. Cartons or bales on the invoice and its print, a packing slip (/print/packing-slip/<invoice>: items and quantities, no prices, cartons), a rate basis switch (wholesale rate or MRP) per bill that re-prices the lines, and bill lines imported from a CSV or text file by barcode, SKU or name (3 Nov 2026, English only). Done 2 Nov 2026: GST JV (/accounts/gst-jv): a journal that moves only GST, built
      from the tax heads: pay tax out of credit (only credits the law allows), reverse or claim input credit,
      raise or cut tax payable; shows credit and tax payable now. Delivery order (/sales/delivery-orders): the dispatch
      instruction between order and challan (from a sales order or alone); challans are made against its lines,
      cannot exceed what it says to send, and the screen shows ordered, sent, billed and not yet billed. Left: the rest. Original scope: delivery order between sales order and challan, with the difference
      against the bill; bill lines pulled from job receipts, stock inward and goods returns; cash discount,
      special discount and discount at payment as separate bill lines; carton count, packing slip,
      covering letter and state transit forms on the invoice; bill lines imported from Excel; item photos
      sent with the bill on WhatsApp; a rate basis switch per bill (wholesale rate or MRP); sample issue
      and sample receipt with pending samples; GST JV for tax-only adjustments.
- [~] R17 Item attributes and small masters. Done 2 Nov 2026: the small masters (R26 lists) and ten style
      attributes (fabric, sleeves, neck, fit, style, gender, type, two spare sub-categories, material) chosen
      from them on the style form, saved on the style and filterable through the API (attr=fabric:Cotton);
      min and max stock per warehouse in a grid. Left: attributes on purchase lines, labels, promotions and
      reports; default quantity and barcode short code on the item; item tax by purchase rate band; margin
      bands that fill MRP and rates on receipt. Original scope: up to ten configurable attributes per business (fabric,
      sleeves, neck, gender, type, material and so on), each a master usable on purchase lines, labels,
      filters, promotions and reports; masters for process, order type, remarks, sales return reasons,
      region and lead source; default quantity and barcode short code on the item; item tax by purchase
      rate band as well as sale rate; margin bands (purchase mark-up and mark-down, two sale mark-down
      levels) that fill MRP and rates on receipt; min and max stock per branch edited in a grid.
      Update 3 Nov 2026: default quantity per scan and a short code on the item (typed or scanned at the counter, unique per business), mark-up bands by purchase rate with two mark-downs (/inventory/margin-bands) that fill the MRP and the sale rate on an inward challan, and the sale rate on a receipt line going onto the item with an audit entry. Item tax by purchase rate was already done. Left: attributes on purchase lines and on labels.
- [~] R18 Label printing extras. Done 3 Nov 2026 (English only): copies per label, labels already used on a part sheet (blank places left), and labels from a sales invoice,
      challan or stock journal as well as a purchase bill, receipt or design (?invoice= ?delivery= ?journal=). Left: item photo on the label, box label reprint,
      one label for many barcodes, re-labelling with a rate update voucher. Original scope: Label printing extras: print from any source document by voucher or barcode range, skip used
      labels on a part sheet, copies per label, item photo on the label, box label reprint, one label for
      many barcodes; re-labelling that changes item, design, colour, size or sub category of existing
      barcodes with the old values kept on a rate update voucher.
      Update 3 Nov 2026: item photo on a label, one label per design and colour that lists its sizes with their barcodes, box labels from an invoice (/print/box-label/<id>, one box or all), and re-labelling (/inventory/relabel: rename, recolour, resize or re-price existing items on one numbered voucher that keeps old and new values; barcodes do not change). Left: none of the original list.
- [~] R19 Fine-grained permissions. Done 2 Nov 2026: special rights as permissions (special.changeDate,
      futureDate, sellBelowCost, seeAgentCommission, importData), ticked per role in the role editor and
      enforced on the server (back or future dating of invoices, bills, receipts, vouchers and credit notes;
      selling a line below its purchase rate; the agent commission report; the three imports). Existing roles
      kept every ability through a migration; new system roles start stricter. Left of the original scope:
      rights per document type (print, re-print, listing) on top of module rights; special rights to
      change the sale rate, delete a line, change the bill mode and change the salesman; rights on
      dashboard widgets and mobile screens; a role limited to chosen account groups; audit columns (added
      and edited by, when, which device) on every listing. Enforced on the server.
      Update 3 Nov 2026: print and reprint rights per module (the first print of a sales invoice, challan or quotation needs the print right, each further print the reprint right; every print is counted with who made it), and a right to change a sale rate at the counter. Existing roles kept what they could do through a migration. Left: rights on dashboard widgets and mobile screens, a role limited to chosen account groups, audit columns on every listing.
- [~] R20 Promotion rules. Done 3 Nov 2026: schemes run on chosen days of the week, within hours (overnight windows work) and in chosen
      branches; the same rules in TypeScript and Dart with 13 shared fixture cases; the till, the server bill and the device sync all honour them
      (device bills skip hours rules because the server cannot know their time). Manual priority done 3 Nov 2026 (a rank on an offer puts it ahead of the rest; same rule in the Dart port and the shared fixtures). Left: include and exclude lists on any attribute (R17), and flags: confirm before applying, apply on items already
      discounted, apply when editing a bill, allow with gift vouchers, allow returns, allow with customer
      discount, inclusive of tax; salesman commission basis per promotion. Feeds M4. Original wording: per branch with time of day and days of the week, include and exclude lists on
      any attribute (R17), manual priority, and flags: confirm before applying, apply on items already
      discounted, apply when editing a bill, allow with gift vouchers, allow returns, allow with customer
      discount, inclusive of tax; salesman commission basis per promotion. Feeds M4.
      Update 3 Nov 2026: include and exclude lists on brand, category, style, item and any style attribute (fabric and the rest), and the counter flags: ask the cashier first, allow with gift vouchers, allow with a discount card or coupon, allow returns. Left: apply on items already discounted, apply when editing a bill, inclusive of tax, salesman commission basis per promotion.
- [~] R21 Workspace. Done 2 Nov 2026: private notes and reminders with an optional date on the home screen (/notes,
      only the writer sees them). Chat between users of a business (/chat: people with unread counts, private conversations, refreshes every 5 s; 3 Nov 2026, English only). Lock screen (a button in the top bar, Ctrl+Alt+L, and after 15 minutes idle; the password is checked by the server; 3 Nov 2026). Left: current working date. Original scope:
      lock screen, chat between users of a business, personal notes and schedules on the
      home screen. Current working date (3 Nov 2026, English only): a person with the right to change the date (or use a future date) sets a working date from the top bar; it is kept in a cookie, shown in amber while it differs from today, and the 15 document and voucher forms start with it. The server still checks every date.
- [~] R22 Stock count and year-end utilities. Done 2 Nov 2026: import a handheld scanner text file into a count (one scan or
      "code,qty" per line, repeats add up, add or replace, unknown codes and unreadable lines reported).
      Reset a count back to zero while counting (3 Nov 2026). Year-end check (/reports/year-end, 3 Nov 2026, English only): profit, the books' checks and every half-done document in the year. Many vouchers print as one PDF (/print/vouchers, 3 Nov 2026). Left: year-end carry-forward with a check report, re-post ledger and stock from documents. Original scope:
      import a handheld scanner text file into a count, reset a
      count, carry balances into the new financial year with a check report, re-post ledger and stock
      from documents, export many vouchers to PDF at once.
      Update 3 Nov 2026: carry-forward check (/reports/carry-forward, shown on the year-end page): the balances that become next year's openings, the stock carried, the year's profit and what it adds to the profit carried, open bills by side, and whether assets and liabilities agree. Left: re-post ledger and stock from documents.
- [~] R23 Payroll extras from GRetail. Done 2 Nov 2026: employee documents and KYC with expiry (card on the employee
      page, /hr/documents expiring list, home-page alert, numbers masked), loan receipts, advance and loan requests
      with approval (/hr/loan-requests: request on an employee's behalf, someone with the payroll approve right
      approves, which pays it out as an ordinary loan, or rejects with a note). Stipend (/hr/stipends: one payment per person per month, Dr Stipend
      Cr cash or bank, cancel reverses it). Week off per employee done 3 Nov 2026 (own off days on the employee, default the business setting; one-day cancel or swap on the attendance page; leave counting, the grid and absence alerts honour them; the payroll engine needed no change because attendance is kept as exceptions). Attendance machines linked (ADMS push).
      Original scope:
      employee KYC update with document expiry, stipend and stipend
      payment, advance salary (upad) and loan requests with approval, week off and week-off cancel per
      employee, attendance device link.
- [~] R24 Report extras. Done 2 Nov 2026: fast, slow and non-moving stock analysis with a changeable window and fast
      line (/reports/stock-movement). Discount register (/reports/discounts) and sales order register (/reports/sales-order-register, pending pieces and value, late orders first), 3 Nov 2026, English only. Left: saved layouts with column chooser, filter panel on every attribute,
      sending any report on WhatsApp or email as PDF or Excel, stock zooming to movements, barcode scan, repack,
      discount and sales order registers, an RCM-style register for others. Original scope:
      per-report saved layouts with column chooser (visible, sum, order) and grouping;
      a filter panel on every attribute; WhatsApp and email of any report as PDF or Excel; stock zooming
      from a summary to the movements (fresh or defective); fast, slow and non-moving analysis with
      editable bands; barcode scan, repack, discount and sales order register reports; cash book, bank
      book, group and month summary, cash and bank expense; an RCM register.
      Update 3 Nov 2026: a saved report keeps a column layout (which columns show and in what order, chosen on the builder) and any report can be emailed as a CSV straight away to up to five people. Left: PDF and WhatsApp delivery, a filter panel on every attribute.
- [~] R25 Dashboards. Done 2 Nov 2026: Owner's view (/reports/cfo): revenue, cost of goods, gross profit and margin,
      operating expenses, other income, depreciation, EBITDA and net profit against the same period last year with
      growth, and gross margin by month. Daily sales (/reports/daily-sales, 3 Nov 2026, English only): sales net of returns, bills, average bill, cash and bank movement from the books, top N picker. Left: sales ageing on it,
      amounts in lakhs, interest and tax lines (no such accounts in the standard chart). Original scope:
      daily sales with a cash and bank tile, top N picker and sales ageing up to over five
      years; a CFO view (revenue, cost of goods sold, expenses and profit after tax against last year with
      growth, monthly gross margin %, EBITDA, profit before and after tax); amounts in rupees or lakhs.
      Update 3 Nov 2026: daily sales shows how old the goods were when they sold in bands up to over five years, and daily sales and the owner's view can show amounts in lakhs. Left: interest and tax lines (no such accounts in the standard chart).
- [~] R26 Menu masters (Soon tiles under Masters, 29 Oct 2026). Done 30 Oct 2026: 26 simple lists on one
      screen (/masters/lists/<kind>, kinds in domain LOOKUP_KINDS), brand, category and season suggested on
      the style form. Min and max stock per warehouse as an editable grid with a below-minimum flag and
      quantity to order (/inventory/stock-limits, 2 Nov 2026). HSN and SAC code master (/masters/hsn, 63 standard apparel, fabric,
      footwear and service codes to add, suggested on the item and style forms). Left: fixed barcode, ledger
      parameters, TDS and TCS masters.
      Original scope: account category, region, country,
      customer sub-category, remarks; department, manufacture company, brand, product, item group, fabric,
      sleeves, neck, fit, season, style attribute, gender, type, sub-categories 9 and 10, material,
      process, order type (feed R17 attributes); fixed barcode, min and max stock, season master; ledger
      parameters, TDS and TCS masters, HSN code master, sales return reasons, customer source.
      Update 3 Nov 2026: in-store EAN-13 barcodes can be given to every item that has none (Labels page; a barcode that exists never changes). Left: ledger parameters, TDS and TCS masters as editable lists (the rates live in the shared domain package).
- [~] R27 Menu transactions (Soon tiles under Transaction). Done 2 Nov 2026: bill-wise receipt and payment
      (/accounts/bill-receipt; allocations table, outstanding honours named bills before oldest-first).
      LR and transport entry (/sales/lr, with a Transporter Master list); sample issue and receipt (a "sample" challan
      reason, untaxed, returns through the usual challan return, pending list at /sales/samples). Left: delivery order, GST
      journal voucher, sample issue and receive, LR and transport entry, repacking a box and reopening a
      box.
      Update 3 Nov 2026: repacking a box and reopening a box need no screen of their own: a ratio pack moves as its pieces in every document, so packing or unpacking changes no stock. Nothing left on this step.
- [~] R28 Menu account and payroll reports (Soon tiles; extends R23 and R24). Done 2 Nov 2026: cash book,
      bank book, group by month, cash and bank expense, cash flow, RCM register, bill-to-bill adjustment
      (/reports/books); designation and department lists (HR); loan receipt (an employee repays a loan or advance in cash or by bank, reversible). MSME payments report (/reports/msme, 3 Nov 2026, English only: Udyam number and class on a supplier, bills past 45 days flagged, medium enterprises shown but not under the rule). TDS on non-salary payments done 3 Nov 2026 (/accounts/tds, English only: section master with limits and rates in the shared domain package, deduction with a live preview that counts the year's earlier payments and the no-PAN rate, challan deposit, and the quarterly Form 26Q deductee and challan files for the NSDL utility; agent commission TDS is included). Left: TCS report; salary deductions, week off and cancel, stipend and stipend payment, incentive, other deductions, advance and loan
      requests, menu log session report.
      Update 3 Nov 2026: other deductions and incentive, overtime and bonus are already typed on each payslip, and sign-ins by person are in the user activity report. Left: TCS report as a salary-style register is not needed (TCS has its own report).
- [~] R29 Menu utilities. Done 3 Nov 2026: rate updation (/inventory/rate-update): by brand, category, season, style or
      everything; percent, amount or set rate; rounding; preview then apply; a sale rate cannot pass the MRP.
      Barcode search (/inventory/barcode-search). Left: the rest. Original scope (Soon tiles under Utility; extends R21 and R22): barcode search, rate updation,
      SMS and email sending, outstanding adjustment, reset physical stock, merge masters, sales and stock
      ledger difference, note report, current working date, my devices, ledger and stock re-posting, report
      types, balance transfer to the new year, database backup and scheduled backup, software and database
      updates, export vouchers to PDF.

## Phase O: one order and inventory truth (v3 section 3)
      Update 3 Nov 2026: reset physical stock (/inventory/reset-stock, with the password again: one stock adjustment takes a store's goods, or one brand, category or design, to zero) and a stock posting check (/reports/stock-posting-check: every sale should have taken exactly its pieces out of stock). Left: re-posting the ledger from documents.
- [ ] O1 Availability service: physical on hand, available to sell, available to promise by date,
      reserved, in transit, quality hold, damaged and returned awaiting inspection, expected inbound with
      ETA; reservations with expiry, renewal and release; atomic reservation so two checkouts never
      promise the same piece; balances explainable from movements and reconciled against cached totals.
- [ ] O2 Order lifecycle: one timeline per order (quotation or cart to payment, allocation, dispatch,
      delivery, return and ledger), holds for credit, payment failure, stock or compliance, backorders,
      partial shipments, substitutions with customer approval, cancellations that release stock and
      reverse money exactly once, idempotent order requests.
- [ ] O3 Fulfilment sourcing: ship from warehouse or store, click and collect, reserve in store, ship to
      store, split fulfilment, rule-based sourcing (distance, promised date, cost, store workload,
      margin, stock protection), store safety stock and channel buffers.
- [ ] O4 Returns engine: return against the original line across stores and channels; eligibility by
      product, days, condition, promotion and sale type; inspection outcomes (restock, quarantine,
      repair, rework, return to vendor, salvage, scrap); refund, exchange, store credit and partial
      refund; correct reversal of discounts, tax, points, commission and payment fees; abuse patterns
      flagged for review, never accused.

## Phase W: warehouse execution and logistics (v3 section 5)
- [ ] W1 Locations: zones, racks, shelves and bins with capacity; stock at company, site, warehouse,
      bin, style, colour, size, lot, condition and reservation (dimensions configurable per business).
- [ ] W2 Inbound: receiving against PO with discrepancy capture and quality inspection; put-away rules
      (product class, velocity, size, lot); cross-dock and direct-to-store.
- [ ] W3 Outbound: directed picking (single, batch, cluster, wave), pick verification by barcode or
      RFID, packing station with carton contents, weight and dimensions, shipping label, dispatch audit,
      bale and carton IDs, manifest checks; replenishment of pick faces from reserve.
- [ ] W4 Counting: cycle counts by value, velocity, risk or ABC class, blind counts.
- [ ] W5 Carriers: courier adapters behind one shipment interface (demo until keys are set), rate
      shopping by serviceability, cost and SLA, tracking events to shared states, failed delivery, RTO
      and claims, freight bills matched to shipments and contracted rates, reverse-logistics cost.

## Phase C: apparel production depth (v3 section 6)
- [ ] C1 Fabric and trims: roll ID, dye lot, shade group, width, GSM, grade, supplier, receiving
      inspection; metres and kg with per-lot conversion; grey and finished stores; remnants; shade
      continuity (one dye lot per lay or order); trim and accessory lots.
- [ ] C2 Job work depth: process routes, challan from one job worker to the next, partial receipts with
      conversion and loss tolerance, shortage debit note, 11 and 35 month alerts with a deemed-supply
      proposal, rate cards, karigar pending view, 194C on job charges, MRP counting stock with job
      workers, job-worker mode (bill processing only), barcode and QR issue and receipt, unfinished job
      issue and receipt, material balance by lot reconciled.
- [ ] C3 Product engineering: versioned tech packs, BOMs, size specifications, grading and construction
      notes; sample requests, fit comments and approvals; approved substitutions with cost impact;
      standard operations with work centre, skill and standard time; consumption standards by size;
      marker efficiency planned against actual.
- [ ] C4 Cut to pack: size-wise BOM lines, cut order (ratio and plies), lay record, QR bundle tickets,
      scan-based operation completion, WIP by stage and bundle, queue age and bottleneck alerts,
      rejections and rework, piece-rate wages into payroll without double counting rework.
- [ ] C5 Planning: production orders pegged to demand, season and delivery date; material and capacity
      check before release; finite-capacity scheduling by line, machine, skill and shift.
- [ ] C6 Quality: incoming, in-process and final inspection; defect codes, severity, operation,
      supplier and lot; rework or scrap decision with cost; sampling plans per product and supplier;
      supplier and job-worker quality scores; corrective actions with owner, due date and evidence.
- [ ] C7 Actual costing: cost per production order and per style and size (material at the valuation
      method, normal and abnormal waste, rework, labour, piece rate, job work, dyeing, freight, approved
      overhead), WIP value by stage, standard against actual (usage, rate, time, yield), cost per good,
      rejected and reworked unit, finished stock linked to its cost build-up and the ledger.
- [ ] C8 Dispatch: transporter, LR number and date, bale or carton packing list, delivery memo,
      deductions ledger.

## Phase D: finance, compliance and reconciliation (v3 section 7)
- [~] D1 Done 3 Nov 2026 (/accounts/reconciliation, English only): one matching engine in the domain package (reference and amount, then amount and nearby date, then one against several in either direction, with a tolerance, used once each) and a workbench for customer and supplier statements: paste their statement, see what matched and why, match or undo by hand, and work the exceptions with a reason code, an owner, a note and ageing; a write-off needs a second person and books the difference to a Reconciliation differences account so the ledger agrees with the statement; a run closes only when every exception has a reason and owner or is written off; every step is kept in a history that is never edited. Left: moving bank, gateway, marketplace, GST portal, payroll-to-bank, POS tenders, job-worker and consignment matching onto this engine (each has its own screen today), evidence upload on the screen. Original wording: Reconciliation workbench: one engine with match rules, tolerances, one-to-many and many-to-one
      matching, exception queue, evidence, owner, ageing, reason codes, approved write-off and full
      history (a mismatch is never deleted). Sources: bank, payment gateways, marketplaces, GST portal,
      stock value against ledger, payroll against bank and postings, supplier and customer statements,
      POS tenders and cash drawer, job-worker material and invoices, consignment. Existing bank, gateway,
      approval and consignment matching move onto it.
- [~] D2 Close management. Done 3 Nov 2026 (/accounts/close, English only): a month-end checklist of 13 lines (draft payroll, open claims, invoices with no entry, unmatched bank lines, suspense, unsigned cash differences, open shifts, goods in transit, received not billed, dispatched not invoiced, negative stock, failing books checks, depreciation) each of which is clear or signed off with a note by someone with the approve right; closing saves the trial balance, profit and loss and balance sheet as version 1, and reopening then closing again saves a restatement beside it and shows what changed; the daily counter close lists the day's shifts with cash differences that a second person signs off. Left: month-end by entity and owner, and snapshots of other reports. Original scope: daily POS close with cash variance sign-off; month-end checklist by entity and
      owner (missing documents, unposted batches, unreconciled control accounts, aged suspense,
      negative stock); cut-off checks (goods in transit, received not invoiced, dispatched not billed);
      saved report snapshots with filters, timestamp and version; restatements shown separately.
- [~] D3 Done 3 Nov 2026 (/accounts/tds, English only): TDS with limits and Form 26Q (see R26), TCS on sales (five sections, collection, deposit, Form 27EQ files), a certificate of tax deducted per payee and quarter (printable Form 16A working copy), and a 194Q tracker of each supplier's purchases against the Rs 50 lakh limit with the tax still to deduct; MSME 45-day flagging was done earlier (R25). Left: the new section 393 numbering with a map from the legacy codes (needs the official table), a disallowance total on the MSME report. Original wording: Vendor TDS (section 393 with legacy codes), 194Q per-seller tracker, TCS, MSME (Udyam, 15 and
      45 day ageing, disallowance report), withholding certificates.
      Update 3 Nov 2026: the MSME report totals what to add back to profit for tax (bills past 45 days) and the interest running on them at three times the bank rate (simple, so a floor). Left: the new section 393 numbering (needs the official table).
- [~] D4 Done 3 Nov 2026 (/gst/workspace, English only): a filing calendar (GSTR-1 on the 11th or 13th under the quarterly scheme, GSTR-3B on the 20th or 22nd, GSTR-9 on 31 December) showing filed with its acknowledgement number, uploaded, overdue, due soon; GSTR-2B loaded from the portal's JSON and matched to purchase bills by supplier GSTIN and invoice number, with amount differences, rows not booked, bills booked but not in the statement (credit at risk), credit the statement marks not available, and a noted decision on each exception; an e-invoice reporting-window alert (30 days); Rule 37 list of bills unpaid past 180 days with the credit to reverse. Left: GSTR-2A comparison, Rule 37A, GSTR-9C and GSTR-4 summaries, slab exception report, and an approval workflow around each return. Original wording: GST workspace: filing calendar, GSTR-2B and IMS reconciliation (2B JSON import), GSTR-2A
      comparison, Rule 37 and 37A lists, blocked and ineligible credit, e-invoice 30-day alert, GSTR-9
      and 9C summaries, GSTR-4 for composition taxpayers, slab exception report; each return a versioned
      workflow with approval, submission reference and filed copy; nothing marked filed without proof.
- [~] D5 Done 3 Nov 2026 (/accounts/working-capital, English only): credit exposure per customer (bills owed, less unapplied receipts, plus open orders, against the limit); a supplier due-date calendar by week; a post-dated cheque register where a cleared cheque posts the receipt or payment and a bounced one posts nothing; an 8-week cash forecast from bills due, cheques and monthly payroll with an owner-chosen share of overdue money, showing the lowest point; a bank stock statement with drawing power from stock and receivables under 90 days. Left: loans and capex in the forecast, per-bank formats of the statement. Original wording: Working capital: credit exposure across pending orders, overdue bills and unapplied receipts;
      cash-flow forecast from payables, receivables, payroll, purchases and loans; supplier due-date
      calendar; post-dated cheques; bank stock statement (drawing power).
- [~] D6 Done 3 Nov 2026 (/inventory/stock-finance, English only): a slow-stock review taking the larger of an age provision (owner-set percentages by age band) and the shortfall against net realisable value; a provision proposal that a second person approves, posting only the change in the provision (or releasing some) as a journal; and cost centres: stock by store, sales by channel (counter on web, counter on a device, wholesale) and totals by GSTIN. Left: per-branch expense allocation to centres. Original wording: Stock finance: stock ageing with NRV write-down, controlled revaluation entries, cost centres
      per store, channel and GSTIN.
- [~] D7 Done 3 Nov 2026 (/reports/profitability, English only): gross sales, discounts, returns, net sales, cost of goods at standard cost, gross margin, agent commission, contribution, overhead shared by net sales and operating profit, each marked from documents, estimated or shared out, cut by design, brand, item, size, customer, store or channel, with the rows adding back to the total. Left: freight, channel fees and wastage per sale, production and job-work cost (needs Phase C), loyalty-funded offers separately. Original wording: Profitability waterfall: gross sales, discounts and loyalty-funded offers, returns, production
      cost, job work and wastage, freight, commission and channel fees, contribution margin, allocated
      overhead, operating profit; by SKU, size, style, order, customer, store and channel; each number
      marked direct, estimated or allocated.
- [~] D8 Done 3 Nov 2026 (/accounts/scenarios, English only): a baseline taken from the last twelve months of the books (sales, cost of goods, running costs, days to collect, pay and hold stock, cash), nine kinds of change (hire, new shop, price, discount, supplier cost, credit terms, loan, demand, stock holding) each with a worst, expected and best value, a year-ahead result for all three cases next to today, and saved scenarios that keep the baseline they were made on. Left: month-by-month view, a factory-specific change with machine capacity. Original wording: Scenario modelling: hiring, new store or factory, price and discount, supplier price, credit
      terms, loans and capex, demand and stock scenarios with assumptions and ranges.
- [~] D9 Done 3 Nov 2026 (/gst/exports, English only): export and SEZ invoices with shipping bill, port and bank realisation certificate details and a nine-month countdown (open, due soon, overdue, realised); RoDTEP and RoSCTL rates typed in by the user with start and end dates (none built in; the longest matching heading in force on the shipping bill date applies) and the incentive each shipment earns, with gaps shown; a scrip ledger with balance, use and lapse; and the inverted duty refund working (sales at the lower rate times input credit over total turnover, less tax paid on them). Left: posting the incentive to the books when a scrip is credited, drawback, advance authorisation tracking, foreign currency invoices. Original wording: Exports: shipping bill and BRC, RoSCTL and RoDTEP scrip ledger with dated rates, inverted duty
      refund working.
- [~] D10 Done 3 Nov 2026 (/settings/controls, English only): a segregation-of-duties report of people holding both halves of nine right pairs; unusual manual journals (round sums, Sundays, entered long after their date, entered at night, touching cash or bank, repeated); related parties marked on accounts with everything booked against them; a periodic access review (a snapshot of members, a decision on each, overdue after 90 days); and step-up confirmation, which asks for the password again before reopening a closed month, approving a stock write-down or revoking a device. Left: approval thresholds by document type and amount that hold a document until approved, and masking and export rights per field. Original wording: Internal controls: segregation of duties, approval thresholds by type, amount and entity,
      related-party flags, journal anomaly checks, periodic access reviews, step-up confirmation for
      high-risk actions, sensitive field masking and export permissions.

## Phase M: merchandising, buying and replenishment (v3 section 4)
- [ ] M1 Collection lifecycle: season calendar with drop, launch, core, carryover, markdown and
      discontinue states; style master adds composition, care, size chart, landed cost and target margin;
      change history that never rewrites old documents; sample and launch readiness checklist.
- [ ] M2 Assortment and size curves: size-curve profiles by category, region, channel and store cluster;
      assortment plans (width, depth, colour spread, size availability).
- [ ] M3 Open-to-buy: budget by season, category, brand, store cluster and month; opening stock,
      planned receipts, sales, markdowns and closing target; commitments with payment dates; supplier
      capacity, MOQ, case packs, lead time and reliability; approval when over budget or over-covered.
- [ ] M4 Promotion and price policy engine: rules by company, channel, store, segment, brand, category,
      product and variant; stacking and priority; time windows, caps and budgets; minimum margin and
      price floors with override approval; simulation on past bills before launch; trade schemes on
      wholesale invoices; lift and incremental margin after the campaign.
- [ ] M5 Replenishment and allocation: transfer against purchase against markdown compared on the same
      assumptions; considers stockout-adjusted sales, sell-through, cover, size gaps, lead time, MOQ,
      on-order, reservations and budget; every suggestion shows its calculation and constraint, and
      overrides record a reason.
- [ ] M6 End of season: markdown runs, pre-book allocation, EOSS planning.

## Phase N: network, channels and platform (v3 sections 8, 9, 11, 15)
- [ ] N1 Integration framework: versioned API with scoped API keys and rate limits; signed webhooks with
      event IDs, retries and replay protection; transactional outbox; idempotency keys; dead-letter queue
      and manual replay; integration health page per business and provider; import preview with field
      mapping, validation, duplicate detection and row errors.
- [ ] N2 Operations: background-job dashboard and queue lag alerts, structured logs with correlation
      IDs, error reporting with redaction, feature flags and staged rollout, usage and storage per
      business.
- [ ] N3 Marketplaces: settlement import (Myntra, Ajio, Amazon, Flipkart mappings), per-order matching,
      TCS 0.5% and TDS 0.1% receivable, returns against RTO, suspense register, on the D1 engine.
- [ ] N4 Web stores: Shopify and WooCommerce connectors through one channel layer (catalogue, price,
      stock, orders, cancellations, returns, settlements), per-channel buffers, re-sync tools.
- [ ] N5 Customer 360 and clienteling: one customer identity with duplicate detection and merge;
      purchases, returns, alterations, repairs, appointments and preferences; size and fit profile with
      consent; value on net contribution; RFM segments; wishlists, back-in-stock and new-collection
      alerts; follow-ups after fittings and repairs; customer quotes and holds with expiry; feedback.
- [ ] N6 Wholesale buyer portal: party catalogue and prices, colour-size matrix ordering, ratio packs,
      pre-booking, available-to-promise, draft order to approval, credit check, dispatch tracking,
      reorder, invoices and statements.
- [ ] N7 Supplier and job-worker workspace: RFQs and quote comparison, POs and delivery schedules, ASN,
      shortage and damage notices, invoice matching, job-work quantities, material balance, stage,
      rejections and billing, performance; each party sees only its own records.
- [ ] N8 Franchise and multi-brand: central or local authority for prices, purchases, expenses and
      hiring; store opening and closing playbook with opening-stock allocation; royalty and revenue-share
      formulas with effective dates; regional assortment and offers; branch P&L, shrinkage, cash variance,
      staff productivity and audit scorecard; group reports across entities with separate books.
- [ ] N9 SaaS layer: plans and subscription billing (Razorpay, demo until keys are set), usage limits,
      custom fields and forms, multi-company consolidation, sandbox copies, white-label for partners,
      audited support access (break-glass).
- [ ] N10 Workflow builder and control tower: a prioritised work queue replacing passive tiles (orders at
      risk, stock mismatches, size gaps, aged stock, bottlenecks, late supply, unmatched transactions,
      overdue receivables, margin erosion, failed integrations, pending approvals), each with severity,
      evidence, next step, owner, due date and escalation; workflow rules (trigger, condition, action,
      approver, SLA) with versions, dry-run and loop protection.

## Phase I: intelligence after data quality (v3 section 10)
- [ ] I1 Demand forecast by style, colour, size, store and channel: seasonal baselines and
      intermittent-demand models compared by backtest; ranges, drivers, history depth and freshness shown.
- [ ] I2 Size-curve and replenishment recommendations from stockout-adjusted demand.
- [ ] I3 Markdown scenarios with expected sell-through, revenue and margin ranges.
- [ ] I4 Production scheduling optimisation where data supports it; bottleneck and lateness risk.
- [ ] I5 Anomaly flags: stock adjustments, repeated returns, consumption and wastage, discount
      overrides, supplier price jumps, yields and defects, journal patterns; leads for review only.
- [ ] I6 Supplier reliability and material yield risk scores.
- [ ] I7 Governance: beat a simple baseline before rollout, evaluation by category, store and size,
      model version and data window recorded, drift and error monitoring with rollback, decision cards
      (what, evidence, assumptions, upside and downside, data freshness, approver, outcome), accepted,
      rejected and overridden recommendations kept.

## Phase T: traceability and sustainability (v3 section 14)
- [ ] T1 Material provenance: fibre composition and recycled content, certificates with scope, issuer,
      expiry and verification, supplier documents.
- [ ] T2 Genealogy report: finished SKU to batch, bundle, roll, dye lot, supplier and quality records;
      gaps and expired certificates as exceptions.
- [ ] T3 Circularity records: cutting utilisation, waste by reason and destination, repair, resale,
      recycling; water, energy and chemicals only with a reliable measurement source.
- [ ] T4 Product QR page with approved, versioned information and export evidence packs per market
      (requirements configurable; obligations confirmed with specialists).

## Phase U: interface redesign
- [~] U1 Transaction launcher, "My Menu" favourites grid per user, and home rail (UI direction above),
      keyboard map and command search. Done (30 Oct 2026, demo-first): All actions launcher (every entry,
      screen and report as coloured icon tiles in groups, a filter box, a star to pin), My Menu as the home
      after sign-in (big square tiles kept per user and business, edit, reorder, reset) with a rail of today's
      sales, money to collect and pay, and alerts. Also: leftover bakery wording (recipes, restaurant,
      tables, kitchen tickets) removed from the screens.
      Restyled (29 Oct 2026) to the user's Stitch designs: design system (navy shell, clear blue actions,
      teal for posted, flat 1px surfaces, 4px and 6px corners, Inter with tabular figures, keycaps,
      dense 14px root, dark set kept); full-width navy top bar with search on Ctrl K and F2; sidebar of
      13 sections in bands that folds to icons; Reports and Masters hubs; My Menu launchpad cards with a
      recently opened strip and today's money by tender; All actions with tabs by area, numbered groups,
      cards or list. Still to do: notification bell and branch picker once those features exist.
- [~] U2 Document screens rebuilt to the single-screen pattern (sales bill, inward challan, purchase,
      challans, job work) with context panels. Done (29 Oct 2026): counter billing (key strip, scan line,
      dense bill grid, customer, offers, CGST and SGST breakdown, navy total, tender keys); inward challan
      (challan, supplier, transport and MRP blocks, item panel with last purchases and size curve, fixed
      totals bar); style page (design, price and cost, photos, barcode and stock matrix); dashboard figure
      strip. Still to do: sales invoice, purchase bill, challans and job work in the same pattern.
- [~] U3 Report shell: filter row, totals footer, export and email, compare to last year, chart switch,
      saved views; applied to every report. Done: icon header with filters and Print on every report,
      figure cards on the sales register, amounts that never wrap. Still to do: filter row under headers,
      email, chart switch and saved views.
- [ ] U4 Scorecard on the product itself: median checkout time, scan-to-stock accuracy, sync failures,
      duplicate transaction count, cashier errors.

## Scorecard (track once the matching phase lands)
Inventory: record accuracy, stockout rate, aged stock value, sell-through. Buying: forecast error by style
and size, supplier on-time in-full, excess buy. Fulfilment: on-time in-full, cycle time, cancellations for
stock. POS: median checkout time, sync failures, duplicates. Production: first-pass yield, WIP age,
material variance, cost per good unit. Finance: reconciliation exception age, close duration, unexplained
suspense. Customer: repeat purchase, return rate, net contribution per segment. Integrations: success rate,
retry backlog, duplicate events, time to recover. Models: lift over baseline, bias, override rate.
Security: cross-tenant test pass rate, restore success, access reviews done.

## Order of work
B7, B8, then S1 to S7, then R1 to R25, O, W, C, D, M, N, I, T. R19 (permissions) goes first among the
new R steps because later screens need its rights. Phase U can start once R is done, or earlier
if the user asks. A step from a later phase can move up when a customer needs it (for example D4 GST
reconciliation or N3 marketplaces).

- D4 note, 4 Nov 2026: GST slab exceptions at /gst/slab-exceptions (the rate charged on each garment or footwear sale is checked against the rate its piece value calls for, with the tax over or under charged). Still open: GSTR-2A comparison, Rule 37A, GSTR-9C and GSTR-4 summaries, approval workflow.
- D6 note, 4 Nov 2026: expense allocation is covered by profitability by store; no separate screen planned.
- D7 note, 4 Nov 2026: profitability now shows what loyalty points and offers cost (loyaltyFunded) alongside margin.

- Open items closed 4 Nov 2026 (English only; migrations 0114 to 0126): D3 section 393 map (/accounts/tds, Sections tab: reference and payment code typed or pasted per section, carried into the 26Q file and certificates; no table is built in because the official numbers were not available to check). D4 (/gst/compliance): GSTR-2A loaded beside 2B with supplier filing flags, Rule 37A list with reversal and re-claim journals, GSTR-9C working, GSTR-4 summary at a composition rate, approval before upload by a second person. D5 loans and capital purchases in the cash forecast (/accounts/working-capital, Loans and purchases tab). D6 expenses spread over stores by sales, stock, equal shares or percentages (/reports/store-results). D7 loyalty cost in profitability.
- R-series closed 4 Nov 2026: R1 approval memo (/sales/approval-memos, billed from the counter), R2 serial numbers (/inventory/serials), R6 store price lists (/inventory/branch-prices), R9 repairs from an order, invoice or bill, R13 flows that message by themselves, weekly and approval reminders, signed WhatsApp and SMS webhooks (delivery, failure, STOP), R16 special and cash discounts as separate lines with early-payment terms, R17 attributes beside purchase lines and on labels, R20 apply on discounted, inclusive of tax, commission basis (TypeScript, Dart and shared fixtures), R14 device tools (cash and bank entry, stock count by scanning, customer profile, reports, tokens and slips, receipt photos). S6 dated changes for role rights and numbering series. S7 encrypted device database (SQLCipher, key in the secure store) and a screen for refused changes. Store scope: a person can be limited to some stores, checked on every request.
- Still not done: Flutter counter does not apply the commission basis (device bills are accepted as sent), device store prices ignore hours, GSTR-9C is a working for the auditor and not the portal table-wise form, composition billing itself (bill of supply, no credit) is not built, the section 393 table is entered by the business.
