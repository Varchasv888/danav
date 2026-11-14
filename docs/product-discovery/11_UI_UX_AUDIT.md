# 11 UI/UX audit

**Method and limits.** This is a static audit: it reads the page, component, menu, translation and stylesheet sources. Nothing was rendered, so colour contrast, spacing, visual hierarchy, performance and real-device behaviour were **not** assessed; those need a browser pass (listed in file 13 as an open task). Counts below are mechanical and are facts [F]; judgements are marked [I].

Context from the plan: a restyle to the Stitch navy shell, a 13-section grouped sidebar, My Menu and All Actions was directed (plan section 'UI and UX direction'; items U1 to U3 in progress). The audit describes the code as it is on 4 November 2026, mid-restyle.

## A. Inventory [F]

| Measure | Value |
|---|---|
| Web screens | 229 |
| Client-rendered / server-rendered | 4 / 225 |
| Screens with a table | 174 |
| Screens with a form or input | 176 |
| Screens with function-key bindings | 5 |
| Screens with key handlers | 7 |
| Screens offering print / export / upload | 19 / 18 / 15 |
| Print pages | 18 |
| Menu sections / groups / tiles | 7 / 23 / 262 |
| Tiles with no screen (Soon) | 23 |
| Tiles pointing at the same screen as another tile | 29 screens (87 tiles) |
| Web components | 169 |
| Device app screens | 22 |

## B. Findings

### UX-01 23 menu tiles are labelled Soon but 17 of them are already built elsewhere or need no screen by design
- **Severity**: High  **Evidence type**: Fact
- **Detail**: 23 tiles have no link (`apps/web/lib/menu.tsx`). File 10 section B shows that tiles such as Stipend, Schedule backup, Export vouchers PDF, Stock ledger difference and Menu log session report have working screens under other paths. A user following the menu concludes the product lacks features it has.
- **Suggested direction** [I]: Link each tile to its real screen or remove it; keep a Soon marker only for the genuinely unbuilt (fixed barcode, ledger parameter, ledger stock re-posting).

### UX-02 Only English is complete
- **Severity**: High  **Evidence type**: Fact
- **Detail**: Key counts per message file: as 6544, bn 6544, en 6544, gu 6544, hi 6544, kn 6544, ml 6544, mr 6544, or 6544, pa 6544, ta 6544, te 6544 (en = 6544). Plan decision of 3 Nov 2026: English first, translations later from a placeholder list. Screens built since carry English only.
- **Suggested direction** [I]: Decide the first two languages before the demo audience is chosen (file 13); keep the placeholder list current.

### UX-03 29 screens are the target of more than one tile
- **Severity**: Medium  **Evidence type**: Fact
- **Detail**: Duplicate targets: `/accounts/chart` x5, `/banking` x2, `/inventory/styles` x2, `/inventory/styles/setup` x3, `/hr/employees` x5, `/accounts/tds` x3, `/settings/financial-years` x2, `/pos/schemes` x3, `/sales/commission` x2, `/sales/orders` x2, `/sales/deliveries` x2, `/sales/invoices` x4, `/accounts/vouchers/new` x5, `/accounts/vouchers` x2. Several are intended shortcuts; others are menu placeholders pointing at a combined screen (for example account master, opening balance and ledger list all open the chart).
- **Suggested direction** [I]: Decide per duplicate whether it is a shortcut or a stand-in; stand-ins should open the right tab or filter.

### UX-04 57 screens with tables have no horizontal-scroll wrapper
- **Severity**: Medium  **Evidence type**: Fact
- **Detail**: Screens: `/accounts/scenarios`, `/accounts/working-capital`, `/assets/[id]`, `/assets/depreciation`, `/assets/new`, `/banking/[id]`, `/expenses/travel`, `/gst/compliance`, `/gst/exports`, `/hr/attendance-devices`, `/hr/employees/[id]`, `/hr/stipends`, `/insights`, `/inventory/branch-prices`, `/inventory/counts/[id]`, `/inventory/counts`, `/inventory/journals/[id]`, `/inventory/labels`, `/inventory/rate-update`, `/inventory/relabel` (+37 more). Wide ERP tables on narrow screens will clip or break the layout. (Responsive classes also absent on 88 screens with tables or forms.)
- **Suggested direction** [I]: Wrap tables in a scroll container or switch to a stacked layout below tablet width; test at 375 and 768 px.

### UX-05 42 screens with forms show no busy state and 31 show no error text in their own code
- **Severity**: Medium  **Evidence type**: Fact
- **Detail**: Form screens without a busy/pending flag: `/accounts/chart`, `/accounts/vouchers/[id]`, `/accounts/vouchers`, `/crm/leads`, `/expenses/travel`, `/gst/slab-exceptions`, `/hr/attendance-alerts`, `/hr/documents`, `/insights`, `/inventory/barcode-search`, `/inventory/counts/audit`, `/inventory/items/[id]`, `/inventory/items`, `/inventory/journals/[id]` (+28 more). The shared form component may supply this; the count is a lower-bound check on the screen's own code and imports.
- **Suggested direction** [I]: Verify with a browser pass; add disabled-while-saving to every submit.

### UX-06 59 interactive screens have no ARIA attributes and no screen-reader text
- **Severity**: Medium  **Evidence type**: Fact
- **Detail**: Examples: `/account`, `/accounts/vouchers/[id]`, `/expenses/travel`, `/gst/slab-exceptions`, `/hr/attendance-alerts`, `/hr/documents`, `/hr/employees/new`, `/hr/leave`, `/hr/loan-requests`, `/hr/stipends`, `/inventory/barcode-search`, `/inventory/branch-prices` (+47 more). Semantic HTML may cover some of it. Whole product: focus styles in 13 places, dark-mode rules in 2 places, reduced-motion rules in 1.
- **Suggested direction** [I]: Run an automated accessibility scan (axe) on the 20 most used screens; add labels to icon-only buttons.

### UX-07 27 screens do not use the translation hook on the server side
- **Severity**: Medium  **Evidence type**: Fact
- **Detail**: Screens: `/accounts/vouchers/[id]`, `/hr/employees/[id]`, `/hr/payroll/[id]`, `/inventory/items/[id]`, `/inventory/journals/[id]`, `/purchase/bills/[id]`, `/purchase/orders/[id]`, `/purchase/receipts/[id]`, `/purchase/returns/[id]`, `/reports/ledger/[id]`, `/sales/credit-notes/[id]`, `/sales/deliveries/[id]` (+15 more). Client components may translate in their own file, so this is a lower bound.
- **Suggested direction** [I]: Confirm that no user-visible string is hard-coded; the plan's English-first rule only works if every string is a key.

### UX-08 Keyboard-first is partial
- **Severity**: Low  **Evidence type**: Fact
- **Detail**: Function keys are bound on 5 screens: `/pos/alterations` (F10/F2/F3/F4/F5/F6/F7/F8/F9), `/pos/billing` (F10/F2/F3/F4/F5/F6/F7/F8/F9), `/pos/returns` (F10/F2/F3/F4/F5/F6/F7/F8/F9), `/pos/tailoring` (F10/F2/F3/F4/F5/F6/F7/F8/F9), `/settings/pos` (F10/F2/F3/F4/F5/F6/F7/F8/F9). The reference product (G-Retail) is keyboard-driven; the plan (U1) lists keyboard work as in progress.
- **Suggested direction** [I]: Publish a key map per screen type; cover the ten busiest screens first (sales bill, inward challan, voucher, POS).

### UX-09 Print stylesheet rules appear in 22 places and print pages total 18
- **Severity**: Low  **Evidence type**: Fact
- **Detail**: Print pages exist for invoices, challans, labels, payslips, certificates, cheques, envelopes, count sheets and e-way bills. A4 label sheets were changed on 4 Nov 2026 (more presets, A4 default) and have not been looked at in a browser.
- **Suggested direction** [I]: Print-test each page on a real printer or PDF; labels especially.

### UX-10 Density is high by design
- **Severity**: Low  **Evidence type**: Inference
- **Detail**: Screens such as the stock register, style master, voucher forms and GST workspace carry many fields and columns (see the field and column lists in file 03). This matches the reference product but raises the learning cost for a new shop.
- **Suggested direction** [I]: Offer role-based simplified screens (cashier, owner) once the full screens settle.

## C. Navigation structure [F]

Sections and tile counts (see file 01 for every tile):

| Section | Letter | Groups | Tiles | Soon |
|---|---|---|---|---|
| Masters | M | 4 | 63 | 3 |
| Transaction | T | 5 | 58 | 2 |
| Reports | R | 3 | 15 | 0 |
| Account Reports | E | 2 | 40 | 1 |
| Payroll | Y | 4 | 31 | 7 |
| Utility | U | 4 | 49 | 10 |
| Chat | Q | 1 | 6 | 0 |

Home is `/my-menu` (the root page redirects there). `/launcher` shows every entry; the star pins a tile to My Menu per user. Secondary navigation lives in `apps/web/lib/nav.tsx`.

## D. Screens by size (a proxy for complexity) [F]

| Screen | Page lines + component lines | Tables | Inputs |
|---|---|---|---|
| `/settings/pos` | 1060 | 2 | 39 |
| `/pos/billing` | 912 | 2 | 20 |
| `/hr/employees/[id]` | 760 | 3 | 44 |
| `/pos/tailoring` | 732 | 1 | 25 |
| `/inventory/styles/[id]` | 730 | 3 | 32 |
| `/pos/alterations` | 701 | 3 | 19 |
| `/inventory/styles` | 626 | 3 | 31 |
| `/inventory/styles/setup` | 621 | 3 | 31 |
| `/pos/returns` | 600 | 3 | 6 |
| `/sales/invoices/new` | 518 | 2 | 17 |
| `/accounts/vouchers/new` | 474 | 2 | 25 |
| `/purchase/receipts/new` | 459 | 3 | 15 |
| `/sales/invoices/[id]` | 451 | 2 | 9 |
| `/projects/[id]` | 440 | 1 | 22 |
| `/accounts/gst-jv` | 424 | 2 | 24 |

## E. Not assessed

Colour contrast, typography scale, spacing consistency, loading performance, perceived speed of a counter bill, touch target sizes on the device app, empty-state wording quality, and screen-by-screen compliance with the Stitch designs. These need a running instance.
