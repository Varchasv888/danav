# GST practice for an apparel distributor and wholesaler: what applies, how sure we are

Written 9 November 2026 for Varchasv ERP. Purpose: settle what GST rules a garment distributor in Assam actually works to, before any GST code is added or changed. Nothing here is tax advice; the last section lists what only an accountant or the GST portal can settle.

## How to read the labels

Every statement carries one of three labels.

- **PRIMARY**: read in the text of the notification or Act itself.
- **MULTI**: several independent secondary sources (tax portals, software vendors, practitioners) agree. Not read in the official text.
- **CONFIRM**: sources conflict, only one source says it, or it was not found. Do not build on it until it is confirmed.

Limit of this research: web search only. The one official text read in full was Notification 9/2025 Central Tax (Rate), downloaded as a PDF. Everything else is secondary. The CBIC, GST portal and Assam tax department pages were not reachable through the search tool.

## 1. The business assumed

A registered regular taxpayer in Guwahati (Assam, state code 18) buying garments from mills and manufacturers, mostly from other states, and selling to retailers, mostly registered, some unregistered, in Assam and other states. It sends goods on approval and by transporter (LR). It may move stock between its own branches. Turnover is probably below Rs 5 crore a year but the product must handle both sides of that line.

Not assumed: manufacturing, export, composition scheme (a regular dealer making inter-state sales cannot use it), e-commerce.

## 2. Rates on garments and footwear

**PRIMARY** (Notification 9/2025 Central Tax (Rate), 17 September 2025, in force from 22 September 2025):

| Goods | Condition | CGST+SGST (or IGST) |
|---|---|---|
| Chapter 61 knitted apparel and accessories | sale value not exceeding Rs 2,500 per piece | 2.5% + 2.5% (IGST 5%) |
| Chapter 62 woven apparel and accessories | sale value not exceeding Rs 2,500 per piece | 5% |
| Chapter 63 other made-up textile articles and sets (not 6309 worn clothing, not the sack headings) | sale value not exceeding Rs 2,500 per piece | 5% |
| Chapter 64 footwear | sale value not exceeding Rs 2,500 per pair | 5% |
| Chapter 61, 62, 63 as above | sale value exceeding Rs 2,500 per piece | 9% + 9% (IGST 18%) |
| Footwear | sale value exceeding Rs 2,500 per pair | 18% |
| 6309 and 6310 worn clothing, rags | any | 5% |
| 6501 textile caps, 6505 hats | any | 5% |

Schedule I of the notification is the 2.5% schedule and Schedule II the 9% schedule. The 18% footwear entries are in Schedule II (the table above gives the combined rate). Before 22 September 2025 the split was 5% up to Rs 1,000 per piece and 12% above.

**CONFIRM**: the notification does not define "sale value". Practice and several guides treat it as the value of the single piece after any discount shown on the invoice and before GST (Section 15 values exclude tax). One forum thread argues the same; no official clarification was found. Sets: a set sold as one article at one price is tested on that price; separately priced components are tested separately. This is commentary, not text.

**MULTI**: the test is per piece (per pair), not per invoice, so one invoice can carry 5% and 18% lines. A tag or MRP that already includes tax is worked back to a pre-tax value before testing.

**Not applicable**: Rule 31D (retail sale price valuation, in force 1 February 2026, Notification 20/2025 Central Tax) applies only to pan masala and tobacco goods. It does not touch garments.

## 3. Registers and returns a regular taxpayer files

| Return | What it is | Due | Label |
|---|---|---|---|
| GSTR-1 | Outward supplies, monthly (or IFF for B2B plus quarterly GSTR-1 under QRMP) | 11th of next month monthly; 13th after the quarter under QRMP | MULTI |
| GSTR-3B | Summary return and tax payment | 20th of next month monthly; 22nd or 24th under QRMP depending on state | MULTI |
| GSTR-2A | Read-only statement of what suppliers reported about you. Not filed | n/a | MULTI |
| GSTR-2B | Read-only monthly ITC statement, generated on the 14th of the next month. Not filed | n/a | MULTI |
| GSTR-9 | Annual return | 31 December after the year (for FY 2024-25 it was 31 December 2025) | MULTI |
| GSTR-9C | Reconciliation statement, self-certified | with GSTR-9 | MULTI |

"GSTR-2" in the request means GSTR-2A and GSTR-2B. There is no GSTR-2 return to file. The product needs to read and reconcile them, not produce them.

QRMP (quarterly filing with monthly tax payment) is open to taxpayers up to Rs 5 crore. **MULTI**.

GSTR-9 is optional up to Rs 2 crore, required above it; GSTR-9C is required above Rs 5 crore. **MULTI** (reported as Notifications 13/2025 and 15/2025 Central Tax).

**CONFIRM**: late fee. Sources agree on Rs 50 a day (Rs 20 for a nil return) and disagree on the maximum. Interest on late tax is 18% a year (**MULTI**, not verified in text).

**MULTI**: a return cannot be filed after three years from its due date (GSTR-1, 3B, 9, 9C), in force from July 2025, first periods blocked from 1 August 2025. The product should refuse to build a return for a period already out of time and say so.

## 4. GSTR-1 content for this business

- **B2B**: sales to a registered buyer, invoice by invoice. **MULTI**.
- **B2CL**: inter-state sales to an unregistered buyer above Rs 1 lakh an invoice (lowered from Rs 2.5 lakh from August 2024, Notification 12/2024). **MULTI**. The product already uses Rs 1 lakh.
- **B2CS**: all other sales to unregistered buyers, summarised by state and rate. **MULTI**.
- **Credit and debit notes**: registered and unregistered, with the original invoice reference. **MULTI**.
- **Amendments** of earlier periods' invoices and notes. **MULTI**.
- **HSN summary (Table 12)**: now two tabs, B2B and B2C, with HSN picked from the portal's list, not typed. Digits: 4 up to Rs 5 crore, 6 above. **MULTI**. **CONFIRM**: whether B2C HSN is mandatory or optional for a taxpayer below Rs 5 crore (sources split).
- **Document summary (Table 13)**: series by series, from number, to number, total, cancelled. **MULTI**, matches how invoices are numbered.
- **Nil, exempt and non-GST supplies** (Table 8) where they exist. **MULTI**.

## 5. GSTR-3B and the ITC rules

- **Outward tax** comes from GSTR-1; **inward credit** from GSTR-2B. **MULTI**.
- **Rule 36(4)**: credit may be taken only as shown in GSTR-2B. **MULTI** for the principle; **CONFIRM** whether any provisional extra percentage still exists (a source recalled one that ended in January 2022; no search result confirmed the present text).
- **IMS (Invoice Management System)**: the buyer can accept, reject or hold each supplier invoice before GSTR-2B is generated. No action means accepted. Live from the October 2024 period. **MULTI**.
- **Section 16(4)**: credit for an invoice or debit note must be taken by 30 November after the financial year, or the date of filing the annual return if earlier. **MULTI**; the exact statutory words were not read.
- **Rule 37**: if the supplier is not paid within 180 days of the invoice date, the credit is reversed (with interest) and can be taken again on payment. Reversal goes in Table 4(B)(2) and reclaim in 4(A)(5). **MULTI**.
- **Blocked credit (Section 17(5))** is reversed through Table 4(B)(1). **MULTI**.
- **Table 3.1(d)** carries reverse-charge purchases; the matching credit goes in Table 4. **MULTI**.
- **Table 3.1.1** (supplies through e-commerce operators) is not relevant to a distributor selling direct.
- **CONFIRM**: a blog says Table 4(A) is auto-filled and locked from July 2026. Check the portal before designing around editable credit.

## 6. Credit notes, discounts and returns

- A credit note for a supply must be declared by 30 November after the financial year of the supply, or the annual return date if earlier. **MULTI**. The year-end for FY 2025-26 is therefore 30 November 2026.
- A discount that was agreed before the supply and shown on the invoice reduces the taxable value, so the slab follows the reduced price. **MULTI**.
- A discount given after the supply can be a credit note only if the agreement existed before the supply and the buyer reverses credit. **CONFIRM** (searched, not explained).
- Goods returned by a retailer are a credit note against the original invoice. **MULTI**.
- A debit note has no equivalent time limit for the supplier. **MULTI**.

## 7. Goods movement

- **E-way bill**: consignment above Rs 50,000. Assam's intra-state limit is also reported as Rs 50,000. **MULTI**; **CONFIRM** against the e-way bill portal notification list.
- **Goods on approval**: send on a delivery challan; invoice within six months of removal or when the supply is decided, whichever is earlier, otherwise the supply is deemed made on the removal date. Goods that return in time need no invoice. **MULTI** (also Circular 10/10/2017 GST).
- **Delivery challan** (Rule 55) for transport that is not a supply. **MULTI**.
- **Job work and ITC-04** (cutting, stitching, embroidery, dyeing sent to others): **NOT RESEARCHED**.
- **Stock transfer between own GSTINs** is a supply and needs a tax invoice: **NOT RESEARCHED**.
- **Advances**: no GST on advances received for goods. **NOT RESEARCHED** here; widely known, confirm.

## 8. E-invoicing

- Mandatory for a business whose turnover has crossed Rs 5 crore in any year since 2017-18 (from 1 August 2023). **MULTI**.
- For turnover Rs 10 crore and above, an e-invoice must be reported to the IRP within 30 days of the invoice date (from 1 April 2025), credit and debit notes included. **MULTI**.
- A distributor under Rs 5 crore does not need e-invoicing; the product should switch it on from the AATO setting, not by default.

## 9. Reverse charge

- **GTA freight**: where a goods transport agency does not opt for forward charge, the buyer pays 5% by reverse charge; with forward charge the rates are 5% (no credit) or 12% (with credit). **CONFIRM** (blog sources only).
- **Purchases from unregistered suppliers**: Section 9(4) is reported as suspended for general goods suppliers except specified classes. **CONFIRM**. There is no current Rs 5,000 a day rule that applies.

## 10. Where the product stands against this

Read from the code on 9 November 2026. "Present" means the code exists; it has not been run against a database this session.

| Item | Product | Verdict |
|---|---|---|
| Rate slab on apparel and footwear (Rs 1,000 until 21 Sep 2025, Rs 2,500 from 22 Sep 2025, 5% and 18%) | `packages/domain/src/slab.ts` | Matches the notification. Pre-tax per-piece test with line discount. Chapter 63 uses the same slab flag. |
| GST rate list includes 0, 5, 12, 18, 28, 40 | `gst.ts` | Fine; 12 and 28 kept for old documents. |
| B2CL threshold Rs 1 lakh | `gstr.ts` | Matches. |
| GSTR-1 build, GSTR-3B build, workpaper | `routes/gst.ts`, `services/returns.ts` | Present. Needs checking against sections 4 and 5. |
| GSTR-2A and 2B import, 2A vs 2B, row decisions | `routes/gstwork.ts` | Present. Row decisions are the IMS accept, reject, hold idea. |
| Rule 37 list, ITC reversals and reclaim | `routes/gstwork.ts` | Present. |
| GSTR-9, GSTR-9C | `services/gstannual.ts`, `/gst/work/gstr9c` | Present. FY 2024-25 changes (Table 8A basis) are disputed, see below. |
| Manual filing pack, simulator portal and filings | `services/gstmanual.ts`, `/gst/portal`, `/gst/filings` | Demo only until a GSP is connected, as agreed. |
| Three-year filing bar | `packages/domain/src/gstfiling.ts`, `routes/gst.ts` | Built 9 November 2026. Filing and "filed" are refused for a barred period; viewing still works. Standard monthly dates only. |
| Table 12 split into B2B and B2C | `services/returns.ts` (`hsn_b2b`, `hsn_b2c`) | Present, net of credit notes. Whether the portal still accepts typed HSN is not relevant: the product exports its own codes. |
| GSTR-1 amendments (B2BA, CDNRA, B2CSA) | `services/gstamend.ts`, `gstr1_amendments` | Built 9 November 2026. Keys follow the offline-tool names and have not been run through the current tool. |
| GSTR-1A (current-month correction after filing) | same amendment records | Not a separate return in the product. The same correction can be reported in the next GSTR-1 as an amendment; the accountant decides whether to use GSTR-1A on the portal. |
| Input credit driven by GSTR-2B | `gstfiling.ts` `itcFrom2b`, `?basis=2b` | Built 9 November 2026, opt-in. |
| GSTR-3B side by side (ERP, portal pre-filled, filed) | `gst_compare_figures`, `ThreeBCompare` | Built 9 November 2026. Typed figures, not read from the portal (that waits for a GSP). |

## 11. Questions only an accountant or the portal can answer

1. Is the Rs 2,500 test on the value before GST after invoice discount, per piece, and how should multi-piece packs and sets be tested?
2. Is B2C HSN reporting optional for a taxpayer below Rs 5 crore?
3. What is the exact present text of Rule 36(4) and is any provisional credit allowed?
4. Is Table 4(A) of GSTR-3B locked from July 2026, and what is editable?
5. What does Table 8A of GSTR-9 take for FY 2025-26?
6. Late fee ceilings for GSTR-1 and GSTR-3B.
7. Assam intra-state e-way bill limit and any state exemption.
8. Treatment of post-sale discounts, job work challans (ITC-04), own-branch transfers and advances.
9. Whether GTA freight is billed under forward or reverse charge in practice for this business.

## Sources

- [Notification 9/2025 Central Tax (Rate), PDF](https://gstgyaan.com/pdf/notification-no-09-2025-central-tax-rate.pdf) (read in full for the entries in section 2)
- [GST on garments above Rs 2,500, per-piece rule](https://accountune.com/gst-on-garments-above-2500) (commentary)
- [Rule 31D and Notification 20/2025 Central Tax](https://a2ztaxcorp.net/government-notifies-cgst-fifth-amendment-rules-2025-inserts-rule-31d-on-retail-sale-price-based-valuation-and-adds-new-clause-f-in-rule-86b-effective-from-1st-february-2026/)
- [Phase III GSTR-1 Table 12](https://taxguru.in/goods-and-service-tax/gstn-implements-phase-iii-table-12-gstr-1-1a-april-2025.html)
- [B2CL threshold advisory](https://taxscan.in/gst-council-recommends-lowering-b2c-inter-state-invoice-reporting-in-gstr-1-threshold-to-rs-1-lakh/412286)
- [GSTR-9 and 9C changes for FY 2024-25](https://www.taxscan.in/top-stories/key-changes-in-gstr-9-and-gstr-9c-for-fy-2024-25-everything-you-should-know-1437208)
- [Three-year filing bar](https://tallysolutions.com/gst/three-year-filing-cutoff-rule-in-gst-what-happens-to-old-pending-returns/)
- [Invoice Management System overview](https://gstzen.in/a/comprehensive-overview-of-invoice-management-system-ims.html)
- [GSTR-2B FAQ on the GST portal](https://tutorial.gst.gov.in/userguide/returns/FAQ_gstr2b.htm)
- [Rule 37 and ITC reversal](https://taxguru.in/goods-and-service-tax/statutory-regime-governing-reversal-input-tax-credit-cgst-act-2017.html)
- [Section 34 credit notes](https://taxguru.in/goods-and-service-tax/section-34-understanding-credit-notes-gst.html)
- [E-invoice thresholds and the 30-day rule](https://www.fonoa.com/resources/blog/india-imposes-a-new-time-limit-to-report-invoices-in-the-invoice-registration-portals)
- [State-wise e-way bill thresholds](https://www.mondaq.com/india/tax-authorities/1615944/eway-bill-limit-2025-state-wise-list-thresholds)
- [Goods on approval, Circular 10/10/2017 GST](https://www.taxheal.com/circular-no-10102017-gst.html)
- [GST due dates and late fees](https://www.taxscan.in/top-stories/gst-compliance-calendar-for-november-2025-1436222)
- [Reverse charge overview](https://busy.in/gst/reverse-charge-mechanism-on-goods-vs-services-a-comparative-analysis/)
