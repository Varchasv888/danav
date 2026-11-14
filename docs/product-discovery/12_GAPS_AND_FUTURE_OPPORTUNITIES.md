# 12 Gaps and future opportunities

Facts [F] come from the plan document, the status rules (file 10) and code searches. Opportunities [I] are inference and are not commitments.

## A. Documented in the plan but not built [F]

Items marked not started in `docs/apparel-plan.md`, each with the result of a code search (file 10 section C).

| ID | What the plan asks for | Status (file 10) | Search result |
|---|---|---|---|
| O1 | Availability service: physical on hand, available to sell, available to promise by date, reserved, in transit, quality hold, damaged and returned awaiting inspe | NOT IMPLEMENTED | Searched 5 terms (available to promise, availableToPromise, available_to_promise, reservation, reservedQty) across API, web, db schema, domain and device sources: no matches. |
| O2 | Order lifecycle: one timeline per order (quotation or cart to payment, allocation, dispatch, delivery, return and ledger), holds for credit, payment failure, st | NOT IMPLEMENTED | Searched 2 terms (orderTimeline, order timeline) across API, web, db schema, domain and device sources: no matches. |
| O3 | Fulfilment sourcing: ship from warehouse or store, click and collect, reserve in store, ship to store, split fulfilment, rule-based sourcing (distance, promised | NOT IMPLEMENTED | Searched 5 terms (click and collect, clickAndCollect, click_and_collect, ship from store, sourcing rule) across API, web, db schema, domain and device sources: no matches. |
| O4 | Returns engine: return against the original line across stores and channels; eligibility by product, days, condition, promotion and sale type; inspection outcom | NOT IMPLEMENTED | Searched 4 terms (returnEligibility, return window, returns engine, return_window) across API, web, db schema, domain and device sources: no matches. |
| W1 | Locations: zones, racks, shelves and bins with capacity; stock at company, site, warehouse, bin, style, colour, size, lot, condition and reservation (dimensions | NOT IMPLEMENTED | No bin/rack/zone model; matches for 'shelf' are code comments. |
| W2 | Inbound: receiving against PO with discrepancy capture and quality inspection; put-away rules (product class, velocity, size, lot); cross-dock and direct-to-sto | NOT IMPLEMENTED | Searched 4 terms (putaway, put-away, put_away, quality inspection) across API, web, db schema, domain and device sources: no matches. |
| W3 | Outbound: directed picking (single, batch, cluster, wave), pick verification by barcode or RFID, packing station with carton contents, weight and dimensions, sh | NOT IMPLEMENTED | Searched 4 terms (pick list, picklist, wave pick, directed picking) across API, web, db schema, domain and device sources: no matches. |
| W4 | Counting: cycle counts by value, velocity, risk or ABC class, blind counts. | PARTIALLY IMPLEMENTED | Blind counts exist (`apps/api/src/services/stockcount.ts:102`); cycle counts by value, velocity, risk or ABC class were not found. |
| W5 | Carriers: courier adapters behind one shipment interface (demo until keys are set), rate shopping by serviceability, cost and SLA, tracking events to shared sta | NOT IMPLEMENTED | Searched 4 terms (rate shopping, carrier adapter, courier adapter, shipment interface) across API, web, db schema, domain and device sources: no matches. |
| C1 | Fabric and trims: roll ID, dye lot, shade group, width, GSM, grade, supplier, receiving inspection; metres and kg with per-lot conversion; grey and finished sto | NOT IMPLEMENTED | Searched 7 terms (dye lot, dyeLot, dye_lot, shade group, roll id, rollId) across API, web, db schema, domain and device sources: no matches. |
| C2 | Job work depth: process routes, challan from one job worker to the next, partial receipts with conversion and loss tolerance, shortage debit note, 11 and 35 mon | NOT IMPLEMENTED | Searched 3 terms (process route, process_route, processRoute) across API, web, db schema, domain and device sources: no matches. |
| C3 | Product engineering: versioned tech packs, BOMs, size specifications, grading and construction notes; sample requests, fit comments and approvals; approved subs | NOT IMPLEMENTED | Searched 4 terms (tech pack, techpack, tech_pack, grading rule) across API, web, db schema, domain and device sources: no matches. |
| C4 | Cut to pack: size-wise BOM lines, cut order (ratio and plies), lay record, QR bundle tickets, scan-based operation completion, WIP by stage and bundle, queue ag | NOT IMPLEMENTED | Searched 6 terms (cut order, cutOrder, cut_order, lay record, bundle ticket, bundleTicket) across API, web, db schema, domain and device sources: no matches. |
| C5 | Planning: production orders pegged to demand, season and delivery date; material and capacity check before release; finite-capacity scheduling by line, machine, | NOT IMPLEMENTED | Searched 4 terms (capacity plan, capacityCheck, demand peg, pegging) across API, web, db schema, domain and device sources: no matches. |
| C6 | Quality: incoming, in-process and final inspection; defect codes, severity, operation, supplier and lot; rework or scrap decision with cost; sampling plans per  | PARTIALLY IMPLEMENTED | Goods on hold wait for inspection and are passed or rejected (`services/purchasing.ts:514`); defect codes, in-process and final inspection were not found. |
| C7 | Actual costing: cost per production order and per style and size (material at the valuation method, normal and abnormal waste, rework, labour, piece rate, job w | NOT IMPLEMENTED | Searched 4 terms (actual cost, actualCost, actual_cost, cost per production) across API, web, db schema, domain and device sources: no matches. |
| C8 | Dispatch: transporter, LR number and date, bale or carton packing list, delivery memo, deductions ledger. | PARTIALLY IMPLEMENTED | Transport/LR entry (`lr_entries`, `/sales/lr`), cartons on the invoice and a packing slip print exist (plan R16, R27); bale/carton packing list and deductions ledger as specified were not found. |
| M1 | Collection lifecycle: season calendar with drop, launch, core, carryover, markdown and discontinue states; style master adds composition, care, size chart, land | NOT IMPLEMENTED | Searched 4 terms (season calendar, seasonCalendar, collection lifecycle, drop date) across API, web, db schema, domain and device sources: no matches. |
| M2 | Assortment and size curves: size-curve profiles by category, region, channel and store cluster; assortment plans (width, depth, colour spread, size availability | NOT IMPLEMENTED | 'sizeCurve' is a heading label on the receipt form, not a size-curve profile model. |
| M3 | Open-to-buy: budget by season, category, brand, store cluster and month; opening stock, planned receipts, sales, markdowns and closing target; commitments with  | NOT IMPLEMENTED | Searched 4 terms (open-to-buy, open to buy, openToBuy, open_to_buy) across API, web, db schema, domain and device sources: no matches. |
| M4 | Promotion and price policy engine: rules by company, channel, store, segment, brand, category, product and variant; stacking and priority; time windows, caps an | NOT IMPLEMENTED | Searched 3 terms (policy engine, price policy, pricePolicy) across API, web, db schema, domain and device sources: no matches. |
| M5 | Replenishment and allocation: transfer against purchase against markdown compared on the same assumptions; considers stockout-adjusted sales, sell-through, cove | NOT IMPLEMENTED | Searched 1 terms (replenishment) across API, web, db schema, domain and device sources: no matches. |
| M6 | End of season: markdown runs, pre-book allocation, EOSS planning. | NOT IMPLEMENTED | Searched 5 terms (markdown run, markdownRun, EOSS, end of season, end-of-season) across API, web, db schema, domain and device sources: no matches. |
| N1 | Integration framework: versioned API with scoped API keys and rate limits; signed webhooks with event IDs, retries and replay protection; transactional outbox;  | PARTIALLY IMPLEMENTED | Rate limiting is on (`@fastify/rate-limit`, `app.ts`) and provider webhooks are verified inbound; scoped API keys, versioned public API and outbound signed webhooks were not found. |
| N2 | Operations: background-job dashboard and queue lag alerts, structured logs with correlation IDs, error reporting with redaction, feature flags and staged rollou | NOT IMPLEMENTED | No job dashboard, queue-lag alerts or correlation ids found (Fastify's logger is on but is not the item). |
| N3 | Marketplaces: settlement import (Myntra, Ajio, Amazon, Flipkart mappings), per-order matching, TCS 0.5% and TDS 0.1% receivable, returns against RTO, suspense r | NOT IMPLEMENTED | Searched 5 terms (Myntra, Ajio, Flipkart, Amazon, marketplace) across API, web, db schema, domain and device sources: no matches. |
| N4 | Web stores: Shopify and WooCommerce connectors through one channel layer (catalogue, price, stock, orders, cancellations, returns, settlements), per-channel buf | NOT IMPLEMENTED | Searched 2 terms (Shopify, WooCommerce) across API, web, db schema, domain and device sources: no matches. |
| N5 | Customer 360 and clienteling: one customer identity with duplicate detection and merge; purchases, returns, alterations, repairs, appointments and preferences;  | NOT IMPLEMENTED | Customer 360 appears only in a route comment; no customer identity merge or clienteling view found (a merge of duplicate masters exists under `/masters/merge`). |
| N6 | Wholesale buyer portal: party catalogue and prices, colour-size matrix ordering, ratio packs, pre-booking, available-to-promise, draft order to approval, credit | NOT IMPLEMENTED | Searched 2 terms (buyer portal, buyerPortal) across API, web, db schema, domain and device sources: no matches. |
| N7 | Supplier and job-worker workspace: RFQs and quote comparison, POs and delivery schedules, ASN, shortage and damage notices, invoice matching, job-work quantitie | NOT IMPLEMENTED | Searched 3 terms (RFQ, ASN, supplier portal) across API, web, db schema, domain and device sources: no matches. |
| N8 | Franchise and multi-brand: central or local authority for prices, purchases, expenses and hiring; store opening and closing playbook with opening-stock allocati | NOT IMPLEMENTED | Searched 1 terms (franchise) across API, web, db schema, domain and device sources: no matches. |
| N9 | SaaS layer: plans and subscription billing (Razorpay, demo until keys are set), usage limits, custom fields and forms, multi-company consolidation, sandbox copi | NOT IMPLEMENTED | A tenant is documented as 'one subscription' (`schema.ts:9`) but there are no plans, billing or usage limits. |
| N10 | Workflow builder and control tower: a prioritised work queue replacing passive tiles (orders at risk, stock mismatches, size gaps, aged stock, bottlenecks, late | NOT IMPLEMENTED | Searched 3 terms (control tower, workflow builder, work queue) across API, web, db schema, domain and device sources: no matches. |
| I1 | Demand forecast by style, colour, size, store and channel: seasonal baselines and intermittent-demand models compared by backtest; ranges, drivers, history dept | NOT IMPLEMENTED | Only a cash forecast exists (`services/workingcap.ts`, plan D5); demand forecasting by style, colour, size and store was not found. |
| I2 | Size-curve and replenishment recommendations from stockout-adjusted demand. | NOT IMPLEMENTED | Searched 2 terms (replenishment recommend, size-curve recommend) across API, web, db schema, domain and device sources: no matches. |
| I3 | Markdown scenarios with expected sell-through, revenue and margin ranges. | NOT IMPLEMENTED | Searched 2 terms (markdown scenario, markdownScenario) across API, web, db schema, domain and device sources: no matches. |
| I4 | Production scheduling optimisation where data supports it; bottleneck and lateness risk. | NOT IMPLEMENTED | Searched 2 terms (scheduling optim, bottleneck) across API, web, db schema, domain and device sources: no matches. |
| I5 | Anomaly flags: stock adjustments, repeated returns, consumption and wastage, discount overrides, supplier price jumps, yields and defects, journal patterns; lea | PARTIALLY IMPLEMENTED | An anomalies list exists (`services/analytics.ts:222`, shown on insights); the specific flags (stock adjustments, repeated returns, consumption, discount overrides) are only partly covered [I]. |
| I6 | Supplier reliability and material yield risk scores. | NOT IMPLEMENTED | Searched 3 terms (reliability score, yield risk, supplier score) across API, web, db schema, domain and device sources: no matches. |
| I7 | Governance: beat a simple baseline before rollout, evaluation by category, store and size, model version and data window recorded, drift and error monitoring wi | NOT IMPLEMENTED | Searched 2 terms (model version, baseline model) across API, web, db schema, domain and device sources: no matches. |
| T1 | Material provenance: fibre composition and recycled content, certificates with scope, issuer, expiry and verification, supplier documents. | NOT IMPLEMENTED | Searched 4 terms (provenance, fibre composition, fiber composition, recycled content) across API, web, db schema, domain and device sources: no matches. |
| T2 | Genealogy report: finished SKU to batch, bundle, roll, dye lot, supplier and quality records; gaps and expired certificates as exceptions. | NOT IMPLEMENTED | Searched 1 terms (genealogy) across API, web, db schema, domain and device sources: no matches. |
| T3 | Circularity records: cutting utilisation, waste by reason and destination, repair, resale, recycling; water, energy and chemicals only with a reliable measureme | NOT IMPLEMENTED | Searched 2 terms (circularity, waste by reason) across API, web, db schema, domain and device sources: no matches. |
| T4 | Product QR page with approved, versioned information and export evidence packs per market (requirements configurable; obligations confirmed with specialists). | NOT IMPLEMENTED | Searched 3 terms (product QR, productQr, digital product passport) across API, web, db schema, domain and device sources: no matches. |
| U4 | Scorecard on the product itself: median checkout time, scan-to-stock accuracy, sync failures, duplicate transaction count, cashier errors. | NOT IMPLEMENTED | Searched 3 terms (median checkout, checkout time, scan-to-stock) across API, web, db schema, domain and device sources: no matches. |

## B. Started but with work left [F]

| Plan ID | What is left (plan text) |
|---|---|
| B8 | (see plan text) |
| S1 | item and variant, production order and posting states are written but only the first five are driven in the test. |
| S2 | consignment stores against the ledger. |
| S3 | branch and warehouse scope on permissions. |
| S4 | a true restore into a separate test business (needs every id remapped). |
| S5 | (see plan text) |
| S6 | tax slabs (they are law, held in the shared package). |
| S7 | local data protection (an encrypted on-device database) and a conflict screen on the device itself that offers edit-and-resend. |
| R1 | approval memo, order, advance and token picked from the bill header; sale and return lines in one grid beyond the exchange. |
| R2 | optional serial or unique-piece IDs. |
| R3 | counts by location (needs bins, phase W). |
| R4 | a graph on stock ageing. |
| R5 | vertical view, ledger views by previous year, pending transactions. |
| R6 | branch price lists. |
| R7 | the other earning and redeeming rules (validity days, exclusions), which the offline app shares and needs the same change for. |
| R8 | margin and stock-ageing bands, helper attribution and helper commission, helper attendance, chart. |
| R9 | sales order repairing. |
| R10 | reports by salesperson and branch (consignment bills carry neither), invoicing across our branches. |
| R11 | none of the original list. |
| R12 | travel claims linked to expense claims. |
| R13 | the other flows (bill, payroll, daily sales to owner) raising their events, and provider webhooks. |
| R14 | stock audit by scan, counter slip and token, the reports, customer profile, image capture, cash and bank entry. |
| R15 | drill from the other panels. |
| R16 | the rest. |
| R17 | attributes on purchase lines and on labels. |
| R18 | none of the original list. |
| R19 | rights on dashboard widgets and mobile screens, a role limited to chosen account groups, audit columns on every listing. |
| R20 | apply on items already discounted, apply when editing a bill, inclusive of tax, salesman commission basis per promotion. |
| R21 | current working date. |
| R22 | re-post ledger and stock from documents. |
| R23 | (see plan text) |
| R24 | PDF and WhatsApp delivery, a filter panel on every attribute. |
| R25 | interest and tax lines (no such accounts in the standard chart). |
| R26 | ledger parameters, TDS and TCS masters as editable lists (the rates live in the shared domain package). |
| R27 | delivery order, GST journal voucher, sample issue and receive, LR and transport entry, repacking a box and reopening a box. |
| R28 | TCS report as a salary-style register is not needed (TCS has its own report). |
| R29 | the rest. |
| D1 | moving bank, gateway, marketplace, GST portal, payroll-to-bank, POS tenders, job-worker and consignment matching onto this engine (each has its own screen today), evidence upload on the screen. |
| D2 | month-end by entity and owner, and snapshots of other reports. |
| D3 | the new section 393 numbering (needs the official table). |
| D4 | GSTR-2A comparison, Rule 37A, GSTR-9C and GSTR-4 summaries, slab exception report, and an approval workflow around each return. |
| D5 | loans and capex in the forecast, per-bank formats of the statement. |
| D6 | per-branch expense allocation to centres. |
| D7 | freight, channel fees and wastage per sale, production and job-work cost (needs Phase C), loyalty-funded offers separately. |
| D8 | month-by-month view, a factory-specific change with machine capacity. |
| D9 | posting the incentive to the books when a scrip is credited, drawback, advance authorisation tracking, foreign currency invoices. |
| D10 | approval thresholds by document type and amount that hold a document until approved, and masking and export rights per field. |
| U1 | (see plan text) |
| U2 | (see plan text) |
| U3 | (see plan text) |

## C. Everything outside the app is a demo [F]

GST portal (e-invoice, e-way bill, returns), bank feed, SMS/push, WhatsApp (real client present, needs keys and approved templates), receipt reading (real client present, needs a key). Details and the steps to make each real are in file 09 section H. Payment-gateway collection is not in the code at all (only settlement import).

## D. Production-readiness gaps [F then I]

| Gap | Evidence | Type |
|---|---|---|
| No background job system | Only a 60 second in-process interval plus `/cron/*` endpoints (`server.ts`); N2 not built | F |
| No observability beyond logs | No job dashboard, queue lag alerts, error tracking integration found (N2) | F |
| No public API surface for partners | No API keys, versions or outbound webhooks found (N1) | F |
| Single database and region assumed | One Postgres (Neon for the live demo); the edge gateway and Cloudflare-only proposals are not implemented | F |
| Hosted demo data needs reseeding after deploy | Seeding is a script run with `--url`; deletions need the user (project memory) | F |
| No web offline mode | No service worker or manifest in `apps/web` | F |
| Stock value is not posted to the ledger | Plan S2: 'the books do not post stock to the ledger'; integrity check cannot compare stock value | F |
| Consignment stores not compared against the ledger | Plan S2 'Left' | F |
| Branch scope and account-group scope on permissions | Plan R19 'Left'; only store scope exists | F |
| Approval thresholds by amount and field masking | Plan D10 'Left' | F |
| Restore into the live business | Only a restore test into a separate test business exists (plan S4) | F |
| Load, soak and counter-latency evidence | No performance test found; plan U4 (scorecard: median checkout time, scan-to-stock accuracy, sync failures) not built | F |

## E. Features without an automated test [F]

15 of 268 features have no API test that names their routes (the test search is by route string, so a test that builds the path dynamically could be missed [I]).

| ID | Feature | Status | Screens |
|---|---|---|---|
| SEC-003 | Auth: logout | BACKEND ONLY | 0 |
| BNK-002 | Banking: lines | PARTIALLY IMPLEMENTED | 3 |
| SAL-006 | Salesmen | PARTIALLY IMPLEMENTED | 9 |
| CRM-001 | Comms: meta | PARTIALLY IMPLEMENTED | 1 |
| SEC-014 | Branches | BACKEND ONLY | 0 |
| CRM-019 | Crm: messaging | PARTIALLY IMPLEMENTED | 4 |
| SEC-021 | Cron | BACKEND ONLY | 0 |
| TAX-003 | Print language | PARTIALLY IMPLEMENTED | 2 |
| TAX-008 | GST reports by kind (templated route) | BACKEND ONLY | 0 |
| HR-009 | Payslips | PARTIALLY IMPLEMENTED | 1 |
| HR-015 | Loan receipts | BACKEND ONLY | 0 |
| INV-005 | Inventory: valuation method | PARTIALLY IMPLEMENTED | 1 |
| INV-010 | Reports: item ledger | PARTIALLY IMPLEMENTED | 1 |
| SAL-027 | E-invoice generate and cancel (invoices and credit notes, templated route) | DEMO / PLACEHOLDER | 0 |
| SEC-028 | Meta | BACKEND ONLY | 0 |

## F. Cross-cutting duplications to consolidate [F/I]

- Reconciliation engines: bank (`recon`/`banking`), GST 2A/2B (`gstwork`), gateway settlements, consignment and job worker each match differently; only the statement workbench uses the shared engine (plan D1 'Left').
- Message sending: per-flow event wiring is partial (repairs wired; bill, payroll and other flows 'Left' in R13).
- Report framework: reports are individual pages; the shell with saved layouts, column chooser and filters on every attribute (U3, R24) is not complete.

## G. Opportunities [I]

| Opportunity | Why it follows from the evidence | Size guess |
|---|---|---|
| Fix the menu so built features are reachable | UX-01: most 'Soon' tiles already have screens or need none | Small |
| Make one connector real end to end (WhatsApp) | Client, signatures and templates exist; needs keys and Meta approval | Small to medium |
| GST sandbox connection | Adapter boundary and simulator follow the real rules; the biggest trust gap for a pilot customer | Medium |
| Counter reliability pack | Offline bill path, rules table and encrypted store exist; add a counter scorecard (U4) and a soak test | Medium |
| Assistant upgrade (after UI/UX) | Today rule based with optional model call; the target is analytic answers like the reference copilot (project memory) | Large |
| Order and availability layer (Phase O) | Not started; foundation for multi-channel | Large |
| Apparel manufacturing depth (Phase C) | Only BOM, production order and job work exist | Large |
| Merchandising planning (Phase M) | Nothing built; builds on the size, season and style masters that exist | Large |
