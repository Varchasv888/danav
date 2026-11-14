# Distributor brief: requirements against the current build, plan and acceptance criteria

Source: the 6 November 2026 product discovery brief (all of it, including the archive and the six lifecycle images). Evidence is from the database schema, the navigation file, the accounting and profitability services, and the product discovery pack (files 10 and 12). The pack is a static review, so rows marked "unverified" need a look at the running screen before anyone relies on them.

Status words: **present** (built and tested), **partial**, **demo** (simulator or no keys), **missing**, **unverified**.

Nothing below is committed or pushed. The only code written from this work is the GST manual-filing pack described in section 2.

## 1. Where the build stands

| Area | Requirement | Status | Evidence and note |
|---|---|---|---|
| Order lifecycle | Quotations, orders, delivery orders, invoices, credit notes | present | `sales_orders`, `delivery_orders`, `sales_invoices`, `credit_notes` |
| | Availability and promise (on hand, reserved, held, incoming) | missing | No reservation or available-to-promise model (pack item O1) |
| | Reserve stock against an order, partial and backorder tracking | missing | Same |
| | Credit limit and approval at order release | partial | `accounts.credit_limit` exists; exposure and override reason inside the order screen unverified |
| | Colour-size order grid | unverified | A colour-size report exists; the order entry grid needs checking |
| | One order timeline | missing | Pack item O2 |
| Godown | Location pick list, scan verify, packing list | missing | Pack items W1 and W3 |
| | Transporter, LR, cartons | partial | `lr_entries`, cartons on invoice, packing slip print |
| | Proof of delivery, short or damaged goods with evidence | unverified | Delivery returns exist; evidence and owner per discrepancy not confirmed |
| Stock integrity | Blind counts, scan audit | partial | Cycle counts by class missing |
| | Goods held for inspection on receipt | partial | Hold, pass, reject exist; defect codes missing |
| Supplier loop | PO, receipt, bill, return | present | `purchase_orders`, `goods_receipts`, `purchase_bills`, `purchase_returns` |
| | Confirmation, ETA, late alerts, scan against PO | missing | Pack item N7 |
| | Ordered, received, billed three-way match | unverified | Needs checking on the bill screen |
| | Landed cost, supplier scorecard | missing | Pack items D7 and I6 |
| Stock and cost | Stock value in the books | **partial, important** | The books follow the trading-account method: closing stock is computed from the stock ledger at report time (`stockOn` in `accounting.ts`) and is not posted to a stock control account. So there is no ledger balance to tie the stock records to, and no perpetual cost of goods sold |
| | Cost of goods in margin reports | **estimate only** | `profitability.ts` costs goods at the item master `purchase_rate`, not at the actual cost of the lots sold. Freight and damage are not in it |
| Margin | Margin bridge by order, retailer, brand | partial | Pack item D7; actual, allocated and estimated must be labelled separately |
| Recommendations | Restock suggestions, "likely due" | missing | Pack items M5 and I2 |
| | WhatsApp send | demo | Client exists; needs keys and approved templates |
| Accounting | Ledgers, vouchers, reports, close | present | Broad coverage in the pack |
| | Bank statement import and matching | present | `bank_statements`, `bank_lines`, `bank_matches`, `bank_rules` |
| | BRS report, exception queue with owner and age | unverified | Matching exists; the statement itself needs checking against a real bank file |
| | One reconciliation workbench across sources | partial | Bank, GST, gateway, consignment and job-worker each have their own screen (pack item D1) |
| | Import and conversion studio | partial | See the source-to-destination map in section 5 |
| | Close cockpit with owners and sign-off | partial | Checklist and period locks exist |
| Navigation | One billing destination, fewer headers | partly built | `apps/web/lib/modules-nav.ts` assigns repeated routes one home tab. Browser check confirmed `/pos/billing` appears once under Sales plus the launchpad shortcut. Other repeated routes and staff acceptance remain open |
| GST | Manual preparation and filing record | built, partly verified | Section 2; manual filing is now the company default, with the simulator available only as an explicitly labeled demo mode |

### Audit run on 6 November 2026 (seven modules, 146 screens)

Method: every screen reached from the Masters, Transactions, Sales, Purchase, Inventory, Accounting and GST menu tabs was requested while signed in as the owner of the local test business; status, error text and empty states were read. This is a smoke test, not a test of every rule. Permissions, other roles and phone layouts were not tested.

- All 146 screens return 200 with no error text; none is slow (over 4 seconds) and none is greyed.
- 18 screens appear under two of the seven tabs (for example `/pos/billing` in Transactions and Sales; `/inventory/transfers`, `/inventory/relabel`, `/inventory/rate-update` in Transactions and Inventory).
- 6 menu tiles have no screen: fixed barcode, ledger parameter, TCS tax master (Masters); re-pack box, re-open box (Transactions); TCS report (Accounting).
- The integrity check page showed two raw translation keys (`integrity.gstMatchesInvoices.*`, `integrity.payrollMatchesLedger.*`). The lookup was fixed during the Phase 0 follow-up below.
- The pack is partly stale: it lists LR entry as having no screen, but `/sales/lr` loads. A customer and supplier statement reconciliation screen exists (statement lines are pasted in, matching by rules, exceptions with a reason, owner and history), so the gap is file import, not the reconciliation itself.
- The integrity and stock posting checks pass on the test data (286 sales checked).

### Phase 0 follow-up verification on 6 November 2026

- The production web build logged in as a synthetic owner. `/pos/billing` had one Sales menu entry plus the launchpad shortcut.
- GST settings saved and restored both filing modes. Manual mode hid the portal connection and OTP actions; provider mode showed the simulator warning that it sends nothing to GSTN.
- GST settings and returns pages fit a 375px viewport. The pass found and fixed a long export button that caused horizontal overflow and duplicate IDs that left one manual notes field without an accessible label.
- The integrity page's two untranslated check labels were reproduced and fixed. The production page now shows the GST and payroll check labels without raw translation keys.
- This verifies representative screens only. Staff acceptance, the complete sale and purchase path, the other menu routes and accountant review remain open.

## 2. GST manual-filing pack: what is built, with evidence

Built and written on 6 November 2026. Not committed.

**Changed or added files**

| File | What it does |
|---|---|
| `packages/db/src/schema.ts`, `packages/db/migrations/0127_gst_workpapers.sql`, `meta/0127_snapshot.json`, `meta/_journal.json` | Table `gst_workpapers` (typed figures, status, review hash, ARN, filing date, evidence files); row level security and grants appended |
| `apps/api/src/services/returns.ts` | `gstr3b()` extended: tables 3.2, 4 (imports, ISD, reversals, reclaim, ineligible, net, shortfall), 5, 5.1, and an ITC-per-books against GSTR-2B comparison; existing keys unchanged |
| `apps/api/src/services/gstmanual.ts` | Save workpaper, prepared, reviewed, filed, reopen; ARN and date checks; figure hash |
| `apps/api/src/routes/gst.ts` | `GET /gst/workpaper`, `PUT /gst/workpaper`, `POST /gst/workpaper/status`; `/gst/gstr3b` now reads the typed figures |
| `apps/web/components/gst/ManualFiling.tsx` | Typed-figure form, status actions, ARN, date and proof upload |
| `apps/web/app/(app)/gst/returns/page.tsx` | New 3B tables, comparison card, two filing cards, two Excel downloads |
| `apps/web/lib/gstr1-offline.ts` | GSTR-1 Excel with one sheet per table for the GSTN offline tool |
| `apps/web/lib/gstr2b-xlsx.ts`, `apps/web/components/gst/GstWorkspace.tsx` | GSTR-2B Excel read into the existing JSON importer, with a preview |
| `apps/api/test/gstmanual.test.ts` | 10 tests |
| `packages/i18n/messages/*.json` | New English strings; other languages carry English placeholders |

**Evidence**
- `gstmanual.test.ts` passes (10 tests) with `sales`, `gstwork` and `gstwork2` (46 tests together). The full API suite ran 670 of 673 passing; the 3 failures were in two unrelated files that pass when run alone.
- The filing flow (save figures, review, record ARN and date) was run in the browser against a local test business.
- The 2B Excel reader and the offline sheets were run once against a workbook built by hand, not a real portal file.

**Not evidenced, and not to be claimed**
- Nothing has been accepted by the current GSTN offline tool or portal. The GSTR-1 Excel follows the published template from memory. It is **input to the offline tool, which produces the JSON for upload**; it is not an upload file, and the button and note now say so.
- The 3B JSON keys for 3.2, 5 and 5.1 and the 4(D) labels are unverified against the current portal. Reclaimed credit is placed in 4(A)(5), which the accountant must confirm.
- The 2B Excel reader has not seen a real portal file. Debit notes in it are skipped and reported.

**GSTR-3B field checklist** (to verify with the accountant and the live portal)

| Table | Status |
|---|---|
| 3.1(a) to (d) outward, zero-rated, nil or exempt, reverse charge | built from the books |
| 3.1(e) non-GST outward | typed figure |
| 3.1.1 supplies under section 9(5) | **not built**; confirm whether it applies |
| 3.2 inter-state to unregistered, by place of supply | built for unregistered buyers only; composition and UIN holders not separated |
| 4 eligible, reversed, net, ineligible ITC | built; eligibility still comes from purchase bills plus typed figures, not from 2B row decisions |
| 5 exempt, nil and non-GST inward | typed figures |
| 5.1 interest and late fee | typed figures; not recomputed |
| 6.1 payment of tax across credit and cash ledgers | partial: set-off against credit and cash payable are shown; the portal's liability breakup and ledger balances are not |
| Side by side: ERP, portal pre-filled, accountant's final | **not built** |

**GSTR-1 checklist**
- B2B, B2CL, B2CS, exports, credit notes: built. Debit notes and amendments: not supported.
- Table 12 HSN split into B2B and B2C: present in the JSON and the Excel (`hsn(b2b)`, `hsn(b2c)`); unverified against the current utility.
- Table 13 documents issued: present in the JSON and the Excel (`docs`); the nature-of-document wording is unverified.
- GSTR-1A (same-period corrections): not built.

## 3. Phase plan (revised)

The accounting priority from the brief is stock valuation and stock-to-ledger first. Margin and reorder advice are only as good as the cost and stock figures under them, so the foundation runs first or in parallel, not last.

**Phase 0: honest and simple (small).** One billing destination. A company setting "filing method: manual" that hides the simulator GSP card. Nothing in the app implies a return was filed without recorded evidence.

**Phase A: trustworthy cost and stock (foundation, in parallel with Phase 1).**
1. Decide the policy with the client's CA: keep the trading-account method with a reconciliation, or post stock to a control account (perpetual). The brief says valuation policy must be configurable.
2. Valued stock by variant and warehouse tied to a ledger control balance, with a tie-out report.
3. Landed cost: inward freight and handling added to lot cost.
4. Margin reports cost goods at lot cost, not the item master rate.

**Implementation status (7 November 2026):** the research-based periodic stock-cost foundation is implemented and verified in code: source-backed landed-charge allocation on receipts, recoverable-GST exclusion, cost coverage, stock-register-to-ledger reconciliation, and an approval-gated closing-stock journal. The Phase A scope is still open for lot-cost margin reporting, a complete stock identity check, and company-specific accounting policy/opening-balance review before live close. See `docs/india-inventory-valuation-practice.md` and section 11 of `docs/product-status-inventory.md`.

**Phase 1: promise and reserve.** Section 4.

The stock summary currently shows company-wide open-order quantities for visibility. This does not reserve inventory or implement the location/date availability and concurrent order rules below; those remain the Phase 1 promise-and-reserve scope.

**Phase 2: godown execution.** Locations, pick list from reservations, scan verify, cartons, dispatch, delivery proof and discrepancy with evidence and owner.

**Phase 3: supplier loop.** Confirmation and ETA, scan receiving against the PO, shortage and damage claims, three-way match, supplier scorecard.

**Phase 4: margin bridge.** Needs Phase A and the freight, damage and claim records from Phases 2 and 3. Actual, allocated and estimated labelled separately.

**Phase 5: accounting trust.** Reconciliation workbench, BRS checks with real statements, exception owners, document inbox (section 5), close cockpit.

**Phase 6: recommendations.** Restock suggestions from verified stock, open POs, buyer history and lead times, worded "likely due". WhatsApp only with consent, approved templates and an approval step.

## 4. Reservation lifecycle (Phase 1 design)

Available to promise for a variant on a date is: on hand, minus held or damaged, minus reserved for other orders, plus incoming from open purchase orders that are due on or before that date (using the supplier's confirmed date when there is one, the expected date otherwise, and nothing when the PO is overdue and unconfirmed).

| Event | Effect on reservation |
|---|---|
| Order confirmed | Reserve the available quantity; the shortfall becomes a backorder line with a date |
| Order line changed or cancelled | Release the difference at once, with a reason |
| Partial pick | Reserved quantity stays; picked quantity is marked picked and is no longer free |
| Pick short or wrong item | Release the short quantity back to available and keep it on backorder |
| Dispatch | Reserved and picked quantity leaves stock; the reservation closes on dispatch |
| Invoice | Never releases a reservation. Invoicing may come before or after dispatch, so closing is driven by dispatch and cancellation only |
| Dispatch short at delivery | Discrepancy record with owner; stock effect follows the outcome (return to stock, hold, write off) |
| Credit hold | Reservation is kept for a stated number of days, then released and the order flagged |

Open question that changes this: is the invoice raised at dispatch or after delivery? The table above works either way, but the order timeline and the receivable start date depend on it.

## 5. Source-to-destination map for file conversion

Rule for every row: the original file is stored, the result is a **draft or a reconciling item, never a posted entry**, and a person with the right permission approves. Duplicates are caught by a stored file hash and by a business key. Errors are listed per row (row number, field, reason) and skipped rows are counted on the preview.

| Source file | Destination | Validation | Duplicate handling | Result |
|---|---|---|---|---|
| Bank statement (CSV or Excel, saved mapping per bank) | Bank lines of the chosen bank account | Opening plus movements equals closing balance; dates in range; debit and credit signs | File hash; date, amount, reference and balance key | Staged bank lines; matching runs after import; no vouchers |
| Bank statement PDF or image | Same, as a draft | Same, plus page references and low-confidence flags | Same | Draft for review; never straight into bank lines |
| Summary BRS (PDF or Excel) | BRS workspace as reconciling items for one account and date | Both balances present; items add up to the difference | Account and date | Pre-filled workspace marked "not verified". A summary alone cannot verify matches; it needs the statement lines and book entries |
| Supplier bill (PDF, image, Excel) | Draft purchase bill | Supplier and GSTIN match; line totals plus tax equal the total; date; HSN | Supplier, invoice number, date, total | Draft bill with the original beside the fields; match to PO and receipt is suggested |
| Supplier statement | Payable reconciliation | Opening, bills, payments and closing balance | Document numbers | Differences queue; no entries |
| GSTR-2B (JSON or Excel) | Purchase reconciliation | Schema or header check; supplier GSTIN format; period | Period, supplier, document number | Rows with match status and decisions; nothing posted |
| Tally masters and vouchers (XML, Excel, JSON) | Masters first, then vouchers in staging | Missing masters; unbalanced vouchers; control totals | Voucher number and date | Staging area with a posting step |
| Customer statement or receipts file | Receipts allocation and receivable reconciliation | Amounts and references | Reference and date | Unapplied receipts queue |

Support only the formats the client or the accountant can show a real sample of. Today the Tally and party or item importers exist; saved bank mappings, the staging area for every source and the PDF readers (which need a key) are not built.

## 6. Acceptance criteria before coding each phase

- **Phase 0:** each billing function is reachable from exactly one menu entry plus shortcuts; no screen says "filed" without a recorded ARN and date; the simulator is labelled wherever it remains.
- **Phase 0 implementation state:** The web mega-menu gives repeated routes one home tab, with `/pos/billing` under Sales, and a browser check verified one entry plus a launchpad shortcut. A static check covered 187 active menu destinations with no duplicate hrefs or missing pages. Manual filing is the default; provider mode is explicitly simulator-only. The 375px GST screens and integrity labels were verified. Staff acceptance, a reviewed sample sale and purchase, the owner's decision on disabled `Soon` tiles, and accountant acceptance of current GST files remain open.
- **Phase A:** a report shows stock value from records, the ledger balance and the difference, and the difference is zero on test data; a purchase with freight raises the unit cost of its lot; the margin report reproduces cost of goods from lots in a hand-calculated example.
- **Phase 1:** two orders for the last unit cannot both be confirmed; each event in the table in section 4 has a test; incoming stock counts only up to the date asked for.
- **Phase 2:** a wrong scan is refused with the reason; a short pick is visible on the order and on the backorder list; proof of delivery needs an attachment or a recorded reason.
- **Phase 3:** a bill that differs from received quantity or PO rate is flagged with the difference; the scorecard figures can be traced to the receipts behind them.
- **Phase 4:** every bridge line is labelled actual, allocated or estimated, and incomplete cost shows as such, never as profit.
- **Phase 5:** each row of the section 5 map has a test for the preview, a duplicate upload and an invalid row; nothing posts without approval.
- **GST:** the GSTR-1 workbook loads in the current GSTN offline tool without errors and produces JSON the portal accepts, checked by the accountant; the 3B figures are compared against the portal's pre-filled values for one real period.

## 7. Questions that change the build

1. What does "10%" mean: gross margin, markup or net?
2. Regular taxpayer, monthly or QRMP, one GSTIN or several, which state registrations?
3. Do salespeople take orders on WhatsApp, by phone or in person?
4. Is the invoice raised at dispatch or after delivery?
5. Does the godown have bins or racks, or is stock placed by area?
6. Which categories and variants are seasonal, and how early must they be bought?
7. Which routes or transporters cause losses, and what can the client show for recent freight, damage and claim costs?
8. Will the client's CA accept the trading-account method with a stock reconciliation, or require stock posted to a control account?
9. Can the accountant supply a real GSTR-2B Excel and JSON, a real bank statement and a real supplier statement for testing?
