# Vyapar UI/UX and document reference from installed code

Survey date: 7 November 2026
Application observed: Vyapar Desktop 37.0.0 (`Vyaparapp`, Electron)
Purpose: capture reusable interface and document patterns for Varchasv ERP. This is an independent implementation reference, not a request to copy source code or branding.

## Method and confidence

This pass reads the installed app's local ASAR extraction: the renderer HTML/CSS, first-party React bundles, print/report HTML generators, VAT/GST model bundles, and names of app chunks. No app code was executed. No premium area was opened. Demo business values and personal data are intentionally excluded.

The app's JavaScript bundles are obfuscated. The official Wakaru 1.14.0 Linux x64 executable was downloaded into the repository's local tools folder and its SHA-256 matched the publisher's value (`664fa06782a61eda7ed15885134b52525fd565dd77607e642062ceb6cd927c38`). REA's recovery call cannot run in the current session because its server did not start with `REA_WAKARU_COMMAND`; the available Docker Desktop WSL image also lacks the GNU runtime libraries required by the official binary. The system image and Codex global configuration were left unchanged. Consequently, findings below distinguish direct source evidence from earlier direct UI observations and mark any runtime-only behavior as unverified.

## Executive findings

- Vyapar is an Electron desktop app with a React renderer, a persistent left navigation rail, dense business screens, and document generation built around HTML templates.
- The shell favors a dark slate navigation surface, white/light gray workspace surfaces, compact Roboto typography, status/accent colors, expandable menu groups, and small 33–40 px navigation rows. Badges, notification dots, and a WhatsApp callout occupy the rail.
- The invoice preview is a document workbench: template/theme selection on one side, a central document preview, and a utility column for payment collection, sharing, print, and PDF download. CSS also shows a compact first-use preview arrangement and a floating utility dock.
- Invoice templates are HTML, with multiple numbered themes and configurable columns, labels, item details, transport details, and invoice options. The source contains separate output paths for printable HTML and Excel report rows; the Windows print dialog observed previously did not provide an app preview. This pass did not confirm a native PDF encoder or every available export option.
- The print generator contains templates for invoices and proformas, estimates/orders, delivery challans, returns, account statements, stock movement/transfer, balance sheet, trial balance, bank statement, and GST-related reports. A single bundle can contain many templates, so chunk names alone are not a complete feature inventory.
- Varchasv already covers much of the Indian-compliance document and GST structure. The highest-value reuse is the document-preview workbench and its customization controls, not replacing Varchasv's tax calculations or its current A4 invoice composition.

## Navigation and visual system

### Shell composition

Direct CSS and earlier screen observation together show:

- Persistent left navigation (`styles/leftNav.css`, `Index1.css`), with expandable submenu groups, icons/text, selected-item styling, small count badges, sync indicators, and marketing/connectivity callouts.
- Main working area is light, with dense tables and forms. The rail is dark slate/near-black. Menus expand below group headings; a selected sub-item receives a darker slate fill.
- The rail carries a green sync dot (`#08bd7c`), red alert/new markers (`#ed1a3b`), pale-blue banners (`#e4f2ff`), and a WhatsApp panel in dark teal (`#2a6561`). Text on the rail is white or muted white.
- The source uses Roboto/Roboto Medium in the shell and invoice preview. The menu style includes 12 px submenu text, roughly 33 px submenu rows, and 38–40 px group/header rows. This favors high information density over large touch targets.
- Previously observed top-level groups include Home, Parties, Items, Sale, Purchase & Expense, Grow Your Business, Cash & Bank, Accounting, Reports, Sync/Share/Backup, Utilities, Settings, and Plans & Pricing. Sale submenu entries included Sale Invoices, Estimate/Quotation, Proforma Invoice, Payment-In, Sale Order, Delivery Challan, Sale Return/Credit Note, and POS.

### Color and surface references

Directly found in local CSS (representative, not a full extracted design-token table):

| Use | Value | Source evidence |
|---|---|---|
| Dark rail scrollbar / slate structure | `#212934` | `styles/leftNav.css` |
| Dark sync panel | `#12181f` | `styles/leftNav.css` |
| Selected submenu | `#2c3643` | `styles/leftNav.css` |
| Green sync state | `#08bd7c` | `styles/leftNav.css` |
| Red alert/new state | `#ed1a3b` | `styles/leftNav.css` |
| Pale blue banner / POS minimized strip | `#e4f2ff` | `styles/leftNav.css` |
| WhatsApp callout | `#2a6561`, heading `#69d654` | `styles/leftNav.css` |
| Invoice preview text | `#2b4c56` | `styles/invoicePreview.css` |
| Preview action blue | `#0075e8` / `#1789fc` | `styles/invoicePreview.css` |
| Template selection teal | `#097aa8` | `styles/invoicePreview.css` |
| Preview background gray | `#f5f6f7` | `styles/invoicePreview.css` |

This is product-specific color evidence, not a recommendation to transplant exact colors. Varchasv's approved tokens remain the design source of truth; adopt component hierarchy, states, density choices, and action placement where they fit.

## Screen patterns

### Home and reports

Earlier direct UI observation found a dashboard with receivables/payables summary cards, a trend/chart region, frequently used reports, and connectivity/promotional cards. Reports use a date range and firm filter above a tabular report, with Excel and Print actions. Report categories observed include transaction, party, GST, item/stock, business status, tax, expenses, sale orders, and loans.

The print bundles directly contain report HTML including account statement, trial balance, balance sheet, profit and loss, bank statement, ageing/due-date columns, and GST return sections. Report print HTML uses explicit tables and light gray header rows, fixed column widths, right-aligned amounts, and report-specific title/period/company data. Do not assume the on-screen report component exactly matches the print markup.

### Parties and items

Earlier direct UI observation found a party split view with a list and selected-record detail pane. The party editor groups fields into GST & Address, Credit & Balance, and Additional Fields. Items are grouped into Products, Services, Category, and Units; a selected item's detail and transaction history occupy the side panel.

### Sales and purchase entry

Earlier direct UI observation found a document-entry screen with party search, phone, document number/date, place/state of supply, and an editable line grid. The grid uses item, HSN/SAC, quantity, unit, price, discount, tax, and amount columns; totals, terms, notes/attachments, round-off, and save/share actions follow. Blank starter rows and keyboard-oriented entry reduce the steps needed to begin a transaction.

The first-party print source confirms options and data fields broader than the initial invoice screenshot: configurable tax columns, unit/quantity display, item serial number and description, item details, transport details, acknowledgment, payment status, amount-in-words, received-by, custom fields, and theme selection. Configuration is partly represented by named print settings and per-template flags.

### Invoice/proforma preview and output

Direct CSS evidence from `styles/invoicePreview.css` describes a three-part preview workbench:

1. A template/theme chooser with a scrollable list and selected-template highlight.
2. A central preview canvas (`.pdf-viewer`, `.preview-contents`) with scroll, zoom/expanded mode, and a link policy that disables document links except the pay-now link.
3. A right-side utilities column with payment collection, sharing choices, normal print, thermal print, and PDF download actions.

The CSS sizes each share action as a compact icon tile (about 68 × 67 px), with a 32 px icon and 12 px label. The utility column uses full-width rows approximately 55 px high. A first-use version uses a dark template rail and a floating bottom utility dock with circular icons and a wider WhatsApp control.

The print HTML generator includes invoice and proforma labels, invoice/proforma number and date, validity/due dates, bill-to/ship-to, place of supply, HSN code, tax amount, round-off, terms and conditions, authorized signatory, and amount-in-words. Template generation is setting-driven and supports multiple themes (`THEME_1` onward; the preview bundle directly exposes at least Themes 1–6, while the generator includes theme identifiers beyond those). The source also contains theme color choice and print-paper-size lookup. Exact available theme count is not established from the accessible source.

Known output evidence:

- **Print:** generated HTML is sent into the print flow. Earlier direct observation of the installed app's Windows print dialog reported that the app did not offer its own print preview.
- **PDF:** the preview has a `download-pdf` utility and print-oriented HTML/CSS; exact PDF-generation implementation and filename behavior are not established by this source-only pass.
- **Thermal:** a dedicated thermal-print action exists; CSS and the earlier direct observation show thermal output alongside the standard invoice preview. Supported paper widths include layout-specific thermal styling, but exact width options were not recovered.
- **Excel:** report generator code prepares Excel descriptions/rows; bulk item import/update chunks confirm Excel is used for data movement. This establishes Excel handling, not a claim that every report or invoice has an Excel export.
- **WhatsApp/share:** share tiles and WhatsApp controls are explicit in the preview UI. Sending behavior and premium restrictions were not exercised.

### GST and accounting

First-party bundles include a VAT/GST report model and report/print generation. The report generator includes GST sections with GSTR-1 and GSTR-3B identifiers, B2B classification, HSN code, taxable value, tax columns, and export supplies (including zero-rated exports on payment of tax). The precise filing calculation logic, portal exchange, JSON schema, and all return tables are not safely recoverable from the obscured model code in this pass; treat those as unknown rather than copy assumptions.

Accounting sources include a Chart of Accounts React bundle and account-category hierarchy constants. Report print code includes trial balance and balance sheet, while the report UI exposes ageing/due date fields. The exact rule set for default accounts and posting behavior cannot be inferred from template presence alone.

## Output format inventory found in local bundles

This is a code-name/template inventory, not proof every item was enabled for the demo company or available without a paid plan.

| Format family | Source evidence / fields |
|---|---|
| Sales invoice | Invoice HTML generator; seller/buyer, GSTIN, supply state, lines, HSN, tax, discounts, totals, amount in words, payment status, signature and theme settings |
| Proforma invoice | Explicit proforma number/date and proforma template; valid-until/advance fields appear in the associated document workflow |
| Estimate/quotation | Template generator and observed conversion actions into order or invoice |
| Delivery challan | Generator has delivery-challan amount-in-words constants and separate print output paths |
| Credit/debit and sales/purchase returns | Return document types and transaction-print code present |
| Account statement | Dedicated HTML generator name and account statement header in print bundle |
| Trial balance / balance sheet / profit and loss | Report HTML template strings in balance-sheet/report generator bundle |
| Bank statement / ageing | Dedicated generator bundle; due-date and days-late columns in report output |
| Stock / inventory reports | Stock-transfer detail and stock-report template identifiers in print generator bundle |
| GST returns | GSTR-1/GSTR-3B, B2B, HSN, export-supply and tax-field identifiers in report generator |
| Spreadsheet | Excel row-preparation fields and Excel import/bulk-update bundles; exact per-screen export matrix not established |
| Thermal receipt | Dedicated thermal printer action and compact receipt styling |

## Varchasv fit and implementation decisions

Varchasv already has a shell, token system, report/table foundations, GST workbooks, offline GSTR-1 JSON export, and printable A4 invoice/proforma/quotation. The current invoice is intentionally compliance-forward: Rule 46, seller/buyer GST details, place of supply, HSN, tax by rate, amount in words, and IRN/signed QR are present in `apps/web/components/print/TaxDocument.tsx`. POS thermal/A4 output is in `apps/web/components/pos/ReceiptView.tsx`. Proforma conversion to an order or invoice is present in `apps/web/components/sales/QuotationDetail.tsx`. The GST returns page exposes JSON and multiple Excel workbooks at `apps/web/app/(app)/gst/returns/page.tsx`.

Recommended adoption order:

1. **Invoice preview workbench:** add a dedicated preview/customize view around the existing Varchasv print document: left template/settings controls, centered A4 preview, right action rail for print/PDF/share; retain Varchasv's current tax fields and output as the canonical baseline.
2. **Document appearance controls:** expose business-safe options already represented in Varchasv data (logo/business identity, bank details, terms, bilingual print setting where enabled, signature, show/hide optional columns, paper size). Save preferences per company/template and render the preview immediately.
3. **Entry-form ergonomics:** preserve the party-first header and line grid; improve keyboard movement, rapid item creation, visible blank-row behavior, sticky totals/actions, and form validation. Do not copy Vyapar's small desktop-only targets into mobile layouts.
4. **Report workbench consistency:** align filters, report title/period/company context, table, totals, and Print/Excel/CSV actions using Varchasv's existing shared `DataTable`/report patterns.
5. **GST/accounting correctness:** use Vyapar's visible return/report labels as a completeness checklist only. Keep calculations and statutory output tied to Varchasv's documented rules and verified filing schemas.

No screen has been changed in Varchasv as part of this research record. The next implementation step should be the invoice preview workbench and print settings, then repeat the comparison across party/item detail, sales/purchase editor, GST return/report, accounting reports, and POS receipt patterns.

## Source inventory used

Extracted installed app root: `C:\Users\siddh\AppData\Local\Temp\rea-extracted-e39e0b1e-c982-4022-9bbf-653e543b0512`.

- Shell/navigation: `UIComponent/Index1.html`, `UIComponent/Index1.js`, `Index1.css`, `styles/leftNav.css`.
- Invoice preview: `styles/invoicePreview.css`, `styles/ftuInvoicePreview.css`, `styles/liteModeSaleInvoicePreview.css`; `uijsx-...InvoicePreview...bundle.js`.
- Sales/purchase transactions: `salePurchaseContainer-...PaymentTransaction...bundle.js`.
- Print/report templates: `printing-ReportHTMLGenerator_AccountStatementHTML...bundle.js`, `printing-ReportHTMLGenerator_BalanceSheetHTMLGenerator...bundle.js`, `printing-ReportHTMLGenerator_CustomReportHTMLGenerator...bundle.js`.
- Dashboard and accounts: `dashboardPage-...Dashboard...bundle.js`, `uijsx-...ChartOfAccounts...bundle.js`, `constants-...AccountCategoryHierarchy...bundle.js`.
- GST report/model: `models-Models_vatReports_VatReportModel_ts.bundle.js`, `dbManager-...vatReport...bundle.js`, `components-components_reports_vatReport...bundle.js`.
- Varchasv comparison: `apps/web/components/print/TaxDocument.tsx`, `apps/web/components/pos/ReceiptView.tsx`, `apps/web/components/sales/QuotationDetail.tsx`, `apps/web/app/(app)/gst/returns/page.tsx`, and `docs/ui-ux-redesign/PROGRESS.md`.
