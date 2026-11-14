# Indian inventory valuation practice for the Phase 1 ERP foundation

**Research date:** 6 November 2026
**Purpose:** Set a defensible product default for an Indian apparel distributor while keeping statutory framework and company-specific choices explicit. This is product research, not a substitute for an entity-specific accounting opinion.

## Recommendation for this ERP

Use **moving weighted average cost per item variant and warehouse** as the initial default for ordinary interchangeable apparel stock. Keep FIFO as a supported company policy. Use specific identification only for genuinely non-interchangeable or specifically segregated goods whose individual cost identity is preserved (for example, a specifically identified customer lot or a serialized unit with its own traceable cost). Do not use LIFO.

The cost of an accepted receipt should include the net purchase price and directly attributable inbound costs required to bring that stock to its present location and condition. Allocate a charge that belongs to one receipt line directly; allocate a shared charge using a documented, consistent basis appropriate to the charge. Exclude GST that the entity is entitled to recover. Include tax or duties that are not recoverable in cost, subject to the entity's applicable accounting framework and tax facts. Deduct trade discounts, rebates and similar purchase reductions.

For this product's current accounting model, retain periodic inventory: purchase bills and inward freight remain in their trading expense ledgers, while the valued stock register supplies closing stock to the financial statements. Add a dated stock-to-ledger tie-out showing the Stock-in-Hand ledger balance and the stock-register value; any difference needs a reviewed closing-stock journal through the accounts workflow. The close action records a reason and requires the approver to confirm that allocated inward costs are supported, separately posted and exclude recoverable GST. Do not silently mix perpetual receipt postings with the existing purchase-ledger method. A future move to perpetual stock control and GRNI must be an explicit company migration with opening balances reconciled first.

These are ERP design recommendations derived from the standards below. The standards require appropriate inventory measurement and recognition; they do **not** prescribe an ERP's perpetual-versus-periodic architecture, a single shared-freight allocation formula, or this product's default cost formula for this specific business.

## What the authoritative sources require

### 1. Confirm which Indian reporting framework applies

There is no safe universal assumption that every Indian distributor reports under Ind AS. ICAI's current accounting-standards portal distinguishes the Companies (Accounting Standards) Rules, 2021 from Ind AS and notes the rules' effective accounting periods. MCA's Ind AS roadmap also makes applicability depend on factors such as listing, net worth and group relationship; sector-specific rules can apply to financial entities. The ERP should store or confirm the reporting framework and applicable accounting policy at company setup rather than infer it from business type alone. [ICAI compendium and standards portal](https://publication.icai.org/post-data/accounting-standards-as), [MCA Ind AS roadmap release](https://www.mca.gov.in/Ministry/pdf/PressRelease_06012015.pdf), [ICAI Ind AS 2025–26 compendium notice](https://www.icai.org/post/compendium-of-indian-accounting-standards)

For companies within the Ind AS framework, use Ind AS 2. Other companies use the applicable notified Accounting Standards, including AS 2 where applicable. Non-company entities should use the ICAI requirements that apply to their entity class. The framework decision belongs to the reporting entity and its accountant; the application can provide a safe default but must not claim a compliance determination based only on a tenant profile.

### 2. Measure inventory at the lower of cost and net realisable value

AS 2 paragraph 5 requires lower of cost and net realisable value (NRV); Ind AS 2 paragraph 9 says the same. NRV is the estimated ordinary-course selling price less estimated completion costs and costs necessary to make the sale. AS 2 paragraphs 20–25 and Ind AS 2 paragraphs 28–33 explain assessment and write-downs, including damaged/obsolete stock and reversal when NRV subsequently recovers, capped at the original write-down. [ICAI AS 2, paras 5–7 and 20–27](https://indasaccess.icai.org/Volume-III/AS/asb.html?a=105), [MCA Ind AS 2, paras 9 and 28–33](https://www.mca.gov.in/Ministry/pdf/IndAS2_2020_10112020.pdf)

**Product consequence:** cost coverage is not a proof that an item's carrying amount is recoverable. The report added for Phase 1 identifies positive stock with zero or negative carrying value; a separate NRV review/write-down process is needed for damaged, obsolete or slow-moving apparel. Do not automatically write down all aged stock based only on age.

### 3. Build cost from purchase and attributable costs

AS 2 paragraph 6 and Ind AS 2 paragraph 10 include costs of purchase, conversion and other costs incurred to bring inventory to its present location and condition. AS 2 paragraph 7 and Ind AS 2 paragraph 11 include purchase price, non-recoverable duties/taxes, inward freight and directly attributable acquisition expenditure, after trade discounts, rebates and similar deductions. Ind AS 2 also says a financing element in deferred settlement terms is interest over the financing period (paragraph 18); interest is generally not inventory cost, with the narrow qualifying-inventory exception in Ind AS 23. [ICAI AS 2, paras 6–13](https://indasaccess.icai.org/Volume-III/AS/asb.html?a=105), [MCA Ind AS 2, paras 10–18](https://www.mca.gov.in/Ministry/pdf/IndAS2_2020_10112020.pdf)

Abnormal wasted materials, labour or other production costs, unnecessary storage, administrative overheads that do not bring stock to its present location/condition, and selling/distribution costs are expensed rather than loaded into inventory (AS 2 paragraph 13; Ind AS 2 paragraph 16). For a trading distributor, ordinary purchase freight and directly attributable inward handling can qualify; outbound delivery to customers and selling costs do not.

GST input tax is not automatically recoverable merely because it appears on an invoice. CGST Act section 16 makes credit subject to conditions, including prescribed documentation, receipt, supplier furnishing invoice details that are communicated to the recipient, and other current statutory conditions/restrictions. Therefore the cost engine should accept an explicit recoverable/non-recoverable tax amount from the reviewed purchase posting. Exclude only the amount treated as recoverable ITC; include non-creditable tax in acquisition cost where it is part of the price paid to acquire the goods/service. [CBIC Tax Information Portal, current CGST Act section 16](https://taxinformation.cbic.gov.in/content-page/explore-act/1000285/1000001), [CBIC CGST Rules: documentary requirements for ITC](https://cbic-gst.gov.in/input-tax-credit-rules.html)

### 4. Use permitted cost formulas consistently

For items that are not ordinarily interchangeable, or goods segregated for specific projects, specific identification is appropriate. For ordinary interchangeable stock, AS 2 paragraph 16 and Ind AS 2 paragraphs 23–25 permit FIFO or weighted average. Ind AS 2 paragraph 25 requires the same formula for inventories with similar nature and use; different formulas need a difference in nature or use, not merely a different geographic location. Under weighted average, the average may be recalculated periodically or after each additional shipment. [ICAI AS 2, paras 14–17](https://indasaccess.icai.org/Volume-III/AS/asb.html?a=105), [MCA Ind AS 2, paras 23–27](https://www.mca.gov.in/Ministry/pdf/IndAS2_2020_10112020.pdf)

Neither standard permits LIFO as an inventory cost formula. Standard-cost and retail methods are measurement techniques, not alternatives to the requirement that their result approximate cost (Ind AS 2 paragraphs 21–22). Do not use the retail method for this distributor's mixed apparel margins unless a future product decision and reliable department-level gross-margin assumptions justify it.

**Why weighted average is the initial ERP default:** this is a product recommendation, not a standard mandate. Apparel stock identified by style/colour/size is normally represented as separate item variants; remaining identical units at a warehouse are ordinarily interchangeable. Moving average is practical for many purchase lots and helps avoid choosing which identical unit's cost is issued. FIFO remains useful when the business's physical flow and operational records are oldest-received-first. Apply either method consistently to like inventory and disclose the selected policy in reports/exports.

### 5. Recognise carrying cost as expense when related inventory is sold

AS 2 paragraph 25 and Ind AS 2 paragraph 34 require inventory carrying amount to be recognised as an expense in the period the related revenue is recognised. Write-downs to NRV and inventory losses are expenses when they occur; reversal of a previous write-down reduces inventory expense when NRV recovers. Ind AS 2 paragraph 36 requires disclosure of inventory policy/cost formula, carrying amounts by relevant classification, expense, write-downs and reversals. [ICAI AS 2, paras 20–27](https://indasaccess.icai.org/Volume-III/AS/asb.html?a=105), [MCA Ind AS 2, paras 34–37](https://www.mca.gov.in/Ministry/pdf/IndAS2_2020_10112020.pdf)

**Product consequence:** the stock ledger and GL need a reconcilable bridge. A posting-enabled perpetual design should debit stock control when goods are accepted, credit stock control at the same cost when sold/issued, and recognise COGS in the related revenue period. If the current trading-account/periodic method remains selected, the close process instead needs a reviewed closing-stock journal and explicit tie-out; the ERP must not manufacture a permanent GL control balance without switching the entity's configured method.

### 6. What Indian audit guidance expects to see in practice

ICAI's Guidance Note on Audit of Inventories describes control practices auditors examine: segregation of incompatible duties, standard forms for recording inventory movement, cross-checks between departments, management-led physical verification, supporting records for existence/ownership/valuation, stock-taking and cut-off procedures, valuation evidence, and retained documentation. This is audit guidance rather than a rule prescribing a specific ERP design or universal count frequency. The product recommendation is to keep receipt/issue/transfer/count documents linked to stock movements, freeze the cut-off used for each count, record the counter and approver, retain evidence and reasons, and expose differences for investigation/approval instead of silently overwriting balances. [ICAI Guidance Note on Audit of Inventories](https://www.icai.org/post/guidance-note-on-audit-of-inventories)

## Recommended posting and workflow rules

These journal patterns are ERP implementation choices to make the required valuation and expense recognition auditable. They need to be configurable by company/account map and must be tested for balanced entries.

| Event | Suggested subledger/GL treatment |
|---|---|
| Accepted receipt before supplier bill (current periodic model) | Record accepted and quality-held quantities in the stock subledger at net landed cost. Do not post an inventory-control/GRNI journal from the receipt. |
| Supplier bill matched to receipt (current periodic model) | Post the purchase bill to its purchase ledger, eligible Input GST separately, and supplier payable. Unmatched quantity/rate remains a visible exception, not an automatic silent revaluation. |
| Direct inward freight/handling bill (current periodic model) | Post the charge and eligible Input GST separately. Trace any allocable non-recoverable inward cost to the affected receipt lines so closing stock valuation includes the attributable portion; the uncapitalized portion remains in the freight/trading expense for the period. |
| Sale/issue (current periodic model) | Record quantity movements in the stock subledger. Purchases and direct costs flow through the trading accounts; the period-close opening/closing stock treatment determines the recognized cost. |
| Physical count short/excess | Require a submitted count, reason and approval; create one adjustment journal with count ID and source lines. Debit loss/stock variance and credit stock for shortages; debit stock and credit a variance/recovery account for excesses subject to reviewed account mapping. Never overwrite prior ledger movements. |
| Period close / tie-out (current periodic model) | Compare item-warehouse subledger value to the Stock-in-Hand ledger at the same cut-off, after receipts, issues, returns, transfers, count adjustments and NRV entries. Show the signed difference and source date; do not force a zero by inserting an unexplained balancing entry. |

For shared inbound charges, no single allocation basis is prescribed by AS 2/Ind AS 2. Recommended hierarchy: directly trace charge to a line/lot when evidence supports it; otherwise use shipment weight/volume when that drives freight; for a uniform shipment without better measures, allocate by net purchase value or units consistently. Store the charge, basis, rate, source invoice and allocated amount per line so a reviewer can reproduce the unit cost. Keep this hierarchy configurable and label the default as the company's policy.

## Phase 1 implementation decisions to apply

1. Keep both existing `average` and `fifo` valuation options. Set the new-company default to moving weighted average by item and warehouse, subject to an explicit framework/policy setting; do not silently alter an existing company's method.
2. Expand purchase receipt costing to carry non-recoverable tax and landed charges as separate traceable components. Apply only charges supported by source documents and approved allocation basis; do not capitalize recoverable input GST.
3. Preserve the current periodic/trading-account model. Add a common-date tie-out against Stock-in-Hand ledgers and keep any closing-stock voucher a reviewed accounts action; only add GRNI/perpetual postings after an explicit company migration and opening-balance reconciliation.
4. Link count approval journals to the count and preserve expected, counted, difference, unit cost, reason, approver and resulting journal. Do not overwrite stock balances.
5. Add NRV review evidence for material damaged/obsolete stock, with reviewed write-down and reversal journals; age alone should flag, not automatically value down.
6. Keep cost coverage semantics explicit: positive quantity with zero/negative value is a review flag; positive carrying value does not prove the whole position is recoverable or that a formal NRV review passed.

## Applicability caveats

- The 2020 MCA Ind AS 2 PDF is a primary standard text but later amendments may exist; ICAI's 2025–26 Ind AS compendium notes 2025 MCA amendment rules. Before release, verify the currently applicable notified text for the reporting period.
- This repo's tenant/company data does not establish whether the reporting entity is a company, listed/group entity, Ind AS entity, AS entity, partnership, or another entity type. Keep the applicable framework/policy explicit and do not promise compliance from generic defaults.
- Whether particular GST on freight/handling is recoverable depends on the invoice, recipient, receipt/use, business/taxable-supply facts and statutory conditions. The product must keep the tax decision visible and reviewed; it cannot infer ITC eligibility solely from tax rate.
- Exact ledgers (Inventory Control, GRNI, COGS, stock loss/excess, input tax) and whether to run perpetual or periodic accounting are company chart-of-account and policy choices. Provide a controlled setup and audit trail rather than hard-coding account names.
- For real financial statements, migration of opening stock and opening GL control balances must be reconciled and approved before enabling perpetual posting. Do not turn on new postings against an unreconciled opening balance.

## Primary sources

- [ICAI Accounting Standard 2 (revised 2016), current AS compendium page](https://indasaccess.icai.org/Volume-III/AS/asb.html?a=105), especially paragraphs 5–17 and 20–27.
- [ICAI Guidance Note on Audit of Inventories](https://www.icai.org/post/guidance-note-on-audit-of-inventories), for inventory movement controls, count/cut-off and audit evidence themes (guidance note issued in 1994; not a current valuation standard).
- [Ministry of Corporate Affairs, Ind AS 2 Inventories PDF](https://www.mca.gov.in/Ministry/pdf/IndAS2_2020_10112020.pdf), especially paragraphs 9–18, 21–37.
- [ICAI Accounting Standards portal](https://publication.icai.org/post-data/accounting-standards-as), which identifies the April 2025 AS compendium and the Companies (Accounting Standards) Rules, 2021.
- [ICAI Ind AS compendium 2025–26 announcement](https://www.icai.org/post/compendium-of-indian-accounting-standards), which notes inclusion of MCA's 2025 amendment rules.
- [MCA Ind AS implementation roadmap press release](https://www.mca.gov.in/Ministry/pdf/PressRelease_06012015.pdf); use with the applicable current MCA rules and entity-specific facts, not as a substitute for checking amendments.
- [CBIC Tax Information Portal, current CGST Act, section 16](https://taxinformation.cbic.gov.in/content-page/explore-act/1000285/1000001).
- [CBIC, CGST Input Tax Credit Rules](https://cbic-gst.gov.in/input-tax-credit-rules.html).
