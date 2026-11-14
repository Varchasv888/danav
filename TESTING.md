# Testing Varchasv ERP by hand

This guide is for people trying the system as a real business would. Each section lists things to
do and what should happen. If something behaves differently, that's a bug worth reporting (see the end).

## 1. Get a system to test

**Option A: everything in Docker** (testers who don't develop)

1. Install Docker Desktop.
2. Copy `.env.example` to `.env` and set `SECRETS_KEY`. The command to generate one is in the file.
3. Run:

   ```bash
   docker compose --profile app up --build -d
   docker compose --profile app run --rm seed
   ```

4. Open http://localhost:3100.

**Option B: developer setup.** See *Run it locally* in the README, then run `npm run demo:seed`.

**Testing from other computers on the same network:** set `WEB_ORIGIN=http://<this-pc-ip>:3100` in `.env`,
and open that address on the other machine. `COOKIE_SECURE` stays `false` because this is plain HTTP.

### The demo business

`demo:seed` creates **Shree Ganesh Textiles**, a garment maker and wholesaler in Bhiwandi with a retail
showroom in Dadar, Mumbai. It has:

- Three styles in colours and sizes, each variant its own item with a barcode: *SH-101 Cotton Formal
  Shirt* (Ganesh Classic, S to XXL), *KT-201 Embroidered Rayon Kurta* (Anvi, Diwali collection) and
  *TR-301 Formal Trousers* (waist 30 to 38). GST is picked by price per piece (apparel slab).
- Two and a half years of books, from 1 April 2024 to September 2026 (FY 2024-25, FY 2025-26 and this
  year so far), with prices about 4% higher each year and a busier August to November:
  - fabric, trims and packing bought every month, with supplier bills paid the next month;
  - rayon sent to Raju Embroidery Works on job work every month and received back as embroidered fabric;
  - a BOM for every variant (fabric by size, buttons, thread, labels, poly bags) and eight production
    lots a month, going round every colour and size;
  - wholesale invoices to retailers in Maharashtra, Gujarat and Karnataka, two of them brought by a
    broker on 2% commission, with receipts, yearly brokerage bills and a credit note; older years are
    almost all collected;
  - the showroom's takings as one bill a month until September 2026, when the counter software starts;
  - rent, electricity and phone bills every month;
  - a payroll run every month (TDS on the FY 2024-25 and FY 2025-26 slabs), with leave and attendance,
    and monthly targets for the sales executive;
  - fixed assets (sewing and cutting machines brought forward, a van bought in April 2025, showroom
    fixtures) and depreciation for each year;
  - a September bank statement, expense claims, a school uniform project and CRM leads.
- The Dadar showroom counter (today's date): Diwali offers (15% on Anvi, shirts buy 2 get 1, a shirt
  and trouser combo), coupon `DIWALI200`, staff discount card `STAFF-01`, three gift vouchers, bills
  with loyalty, and a size exchange paid with store credit.
- Work left open on purpose, for testers to finish:
  - unpaid and overdue invoices (one customer is on credit block with interest at 18%);
  - a planned production order for 200 mustard kurtas;
  - an open fabric purchase order, an open sales order and a proforma with an advance;
  - kurtas out on approval with Mumbai Fashion House, partly returned;
  - a shop-in-shop counter at Phoenix Mall on consignment, with kurtas past 150 days;
  - a pending leave request;
  - a submitted expense claim and a draft one;
  - three unmatched bank lines;
  - follow-ups that are due.

It prints the sign-in emails:

- One **owner**.
- One person per role, with the role name in the address: `+accountant`, `+admin`, `+hr`, `+purchase`, `+sales`, `+storekeeper`, `+viewer`. For example, `tester-ab12+sales@varchasv.test`.

Everyone signs in with the `DEV_DEMO_PASSWORD` from `.env` (or `.env.example`). Run the seed again to
get a fresh business, for example one per tester. Pass `--email` to choose the address and
`--business` to choose the name. An address that already has a login gets the new business added to it.

### What is simulated

These parts need a paid provider account. Until one is set up, a simulator runs instead. The simulator
follows the real rules and says on screen that it is simulated.

| Feature | Stand-in | Notes |
|---|---|---|
| e-Invoice (IRN), e-way bill, GST return filing | GSP simulator | The OTP is `575757`. The GST screens show it in test mode. |
| Bank feed (Account Aggregator) | AA simulator | Statement CSV import is real. |
| WhatsApp messages | Logged, not sent | Shown on the lead's timeline. |
| Assistant, reading receipts and bills | Demo mode | Set `ANTHROPIC_API_KEY` for the real thing. |
| Email (invitations, password reset, payslips, scheduled reports) | Written to the API log | Set `SMTP_URL` to send real email. In Docker, read them with `docker compose logs api`. |

## 2. Things to check everywhere

- [ ] **Languages:** switch the language at the bottom of the sidebar. Twelve are available: English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Assamese and Odia.
  - The whole screen changes, with no leftover English.
  - Numbers stay in 0–9 digits with Indian grouping (₹1,23,456.00).
  - The regional translations are machine drafts. Note any wording a native speaker would not use.
- [ ] **Themes:** light and dark both look right on every screen.
- [ ] **Roles:** sign in as each role and confirm you only see and change what the role allows. The viewer can open screens but cannot save anything.
- [ ] **Phones and tablets:** the web app is usable at phone width.
- [ ] **Prints:** invoices, quotations, payslips and Form 16 print on A4. Amounts in words are correct.
  - The second print language is set in *Settings → GST*.
  - Amounts in words exist in English, Hindi and Marathi. Other languages print the words in English.

## 3. Scenarios by module

### Sign-in and account

| Do this | Expect |
|---|---|
| Sign in with a wrong password 11 times in 5 minutes | Refused. The 11th try is rate-limited, even with the right password. |
| *Forgot password?* on the sign-in page, then use the emailed link | You set a new password and are signed out everywhere. The link works only once and expires after an hour. |
| Click your name at the bottom of the sidebar → change password | Your other browsers and devices are signed out. This one stays signed in. |
| Sign up a second business with the same email (*business switcher → new business*) | Both businesses appear in the switcher. Their data never mixes. |
| Sign in | You land on *My Menu*: big tiles for daily work, and a rail with today's sales, money to collect and to pay, and alerts. |
| *All actions* (grid button beside Go to): type "count", star a tile | Only matching tiles show. The starred tile appears on My Menu; *Edit tiles* moves or removes it, and *Back to the default tiles* resets. |

### Sales

| Do this | Expect |
|---|---|
| Quotation → convert to order → delivery challan → invoice | Each step carries the lines forward. Stock goes out at delivery, not again at invoice. |
| Invoice Surat Saree Kendra or Bengaluru Trends | IGST (inter-state). A Maharashtra customer gets CGST + SGST. |
| Invoice a customer beyond their credit limit | A warning. Kolhapur Kapda Bazaar is set to block: only an owner or admin can override, and it is logged. |
| Generate an e-invoice, then an e-way bill | IRN and signed QR on the print. Cancelling works only within 24 hours, and in order: e-way bill first, then IRN, then the invoice. |
| Credit note for part of an invoice | Stock comes back and the customer's balance drops. You can't return more than was sold. |
| *Reports → Receivables* | Ageing buckets. Overdue invoices match the dashboard's warning. |
| *Inventory → Image catalogue*: filter by brand Anvi, price for Surat Saree Kendra | Tiles per colour with the swatch photo, the party's rate, stock and 90-day sales. Saved selection "Diwali kurtas for Surat" is listed below. |
| Add tiles to the cart and save; on the selection make a link, open it in a private window, send it on WhatsApp | The link shows the catalogue without signing in and stops working after "Stop sharing". Sending records a demo message. |
| On a selection for a party, type quantities by size and press Make sales order | A sales order at the party's rates opens. |
| *Inventory → Styles*, open a style, add photos for a colour | The photo appears under Photos and beside the colour in the stock grid. |
| *Reports → Colour-size report*: switch Stock and Sales, pick a brand | A grid per design with a photo per colour (hover enlarges), sizes across, totals both ways; Excel downloads it. |
| *Reports → Stock ageing* | Garments by how long they have been in stock (oldest sold first) and dead stock with no sale for 90 days; tick to include fabric and trims. |
| *Reports → Sales register* for last month | Every invoice, counter bill and return with pieces, discount, GST and the cash, UPI, card and on-account split, totalled. |
| *Reports → Profit & loss*, Compare to last year | A column for the same period last year and the change. |
| *Inventory → Barcode labels*, or Print labels on a style or a purchase bill | Pick the label stock and fields; the preview is actual size; Print opens the sheets at label size with a scannable EAN-13. |
| *Business insights*: press Last financial year, then This financial year | Sales, margin, pieces and bills change with arrows against the year before; best designs, salesmen and customers rank; sales ageing shows how old the pieces were when they sold. |
| *Sales → Consignment*: open Phoenix Mall Department Store | Sent, taken back, sold and with them per item; the May kurtas show red with a bill-by date six months after they went out. |
| Enter a count lower than "With them" and bill the shortage | An invoice for the short pieces at the agreed rate, from the stock at their store. Taking back more than they hold is refused. |

### Purchasing and inventory

| Do this | Expect |
|---|---|
| Receive the rest of the open Arvind Fabrics purchase order | The order closes. Receiving more than was ordered is refused. |
| Bill it | The supplier's balance goes up. Entering the same supplier invoice number twice is refused. |
| Return part of a bill | A debit note, and stock goes out. |
| *Purchase → Inward challans → New*: enter transporter and LR, add a design by size, set mark-up 150% | MRPs fill in, rounded to end in 9; mark-up and margin % show per line; the side panel shows the item's last purchases (GRN UTW-212 from Ulhasnagar Trouser Works). |
| Save it, then *Print labels for these pieces* | One label per piece, with the new MRP. |
| *Inventory → Stock counts*: count the shirt rack, scan barcodes (or type 5*barcode), finish counting | A counter on a blind count sees only what they counted. The owner sees the books, the differences and their value. |
| Approve with a reason | A stock adjustment is posted for the differences. "Shirt rack" in the demo is approved; "Kurta wall" is still being counted. |
| *Inventory → Stock summary* | Quantities and values agree with the purchases, sales and production you made. |
| Transfer shirts to the Dadar showroom | The stock moves. Total value is unchanged. |
| *Inventory → Styles*: open KT-201 | The colour by size stock grid; add a new colour and only the missing variants are created. |
| Follow the dashboard's low-stock warning | It opens the stock summary at the reorder list: items below their reorder level, with suggested quantities. |

### Manufacturing

| Do this | Expect |
|---|---|
| Release and complete the planned kurta production order (some rejected) | Embroidered fabric and trims consumed per the BOM, including wastage. Good kurtas go into stock at cost. |
| *Manufacturing → Job work*: send rayon to Raju Embroidery Works, then receive it | The fabric stays ours while away. The ITC-04 report lists what was sent and received. |
| *Manufacturing → Material planning* | Shortages for open orders, with purchase suggestions. |

### Showroom (POS)

| Do this | Expect |
|---|---|
| Bill two Anvi kurtas and three shirts | The Diwali 15% and "buy 2 get 1" offers appear on the bill. The best mix for the customer is chosen. |
| Add coupon `DIWALI200` on a bill over ₹2,000, or card `STAFF-01` | The discount comes off before GST. A bill below the minimum is refused. |
| Pay part of a bill with one of the gift vouchers | The voucher balance drops. Voiding the bill gives it back. |
| *POS → Returns and exchanges*: return a shirt for size, take store credit, then bill the other size | The refund is a store-credit code; "Bill the exchange now" opens billing with it filled in. |
| Bill with a phone number, pay part by UPI and part by cash | Change is shown and loyalty points are earned. The next visit can redeem them, up to the set limit. |
| *POS → Alterations*: hand over the ready slip and collect the charge | A counter bill for "Alteration and tailoring charges". The free slip goes to Salim, comes back, and is handed over with no bill. |
| *POS → Tailoring*: finish Nikhil Rao's shirts (stitching with Salim, then finishing) and deliver | The tailoring bill has stitching plus 3.4 m of poplin; the ₹1,000 advance comes off and only the balance is collected. |
| Book a new order: look up a mobile with measurement cards, add a photo to a new card | Earlier cards appear by garment; processes come from the rate table. |
| Give a slip to Salim Tailors and mark it back | Salim's ledger is credited the labour; the month's labour table shows it. |
| *POS → Billing*: scan or search a kurta | Its photo and stock by colour and size appear under the search box; clicking a number adds that colour and size. |
| Pick a salesman for the bill, press F3 and hold it, then F4 and "Bill this" | The held bill comes back with its salesmen. "Gentleman in the trial room" is already waiting. |
| Type a customer's mobile (F6) who bought before | Visits, spend, last visit and usual buys show; the name fills in. |
| Give 15% off a line or 8% off the bill | Over the 10% and 5% limits: an owner or admin must type a reason (kept on the bill); a cashier cannot. |
| F8, F9 or F10 then Ctrl+Enter | The whole amount goes to cash, UPI or card and the bill is finished. |
| Bill with a customer's mobile | The bill goes on WhatsApp by itself ("Sent on WhatsApp to XXXXXX..."). Without a mobile, "Send on WhatsApp" asks for one. |
| Open the link in that message (from *CRM → WhatsApp log*) in a private window | The receipt opens without signing in. A made-up link says it is no longer active. |
| F5 on the counter: find an old bill, take a piece back, bill a new piece | The credit pays first; you pay the difference. Credit beyond the new bill stays as store credit with a code. The receipt shows the returned piece. |
| Close the session | Expected and counted cash, with the difference (cash refunds come off). |

### Accounting and GST

| Do this | Expect |
|---|---|
| Record a receipt from a customer | Their oldest invoices are settled first. |
| *Reports → Trial balance, P&L, Balance sheet* | Debits equal credits and the balance sheet balances. |
| *GST → Returns* for September: prepare GSTR-1 and GSTR-3B, connect, upload, file (OTP above) | You get an ARN. September's invoices are then locked. |
| Lock a period (*Settings → Financial years*), then try to post into it | Refused. |
| *Settings → Audit log* | Every change shows who made it, when, and before/after values. |

### HR and payroll

| Do this | Expect |
|---|---|
| Approve the pending leave request | Leave balance drops. Attendance shows the leave days. |
| Run October payroll, finalize, pay | Payslips with PF, ESI, professional tax and TDS. The EPF ECR, ESI and bank files download. |
| Print a payslip and Form 16 in the second language | Bilingual labels. Amount in words in that language (English, Hindi or Marathi). |
| Full and final settlement for an employee | Leave encashment and gratuity (if eligible). |

### Banking, assets, expenses and projects

| Do this | Expect |
|---|---|
| *Banking → HDFC*: handle the 3 unmatched lines | SMS charges post through the rule. Post the electricity bill as an expense, and the Panchavati UPI as a receipt from Hotel Panchavati. |
| Import a statement CSV from your own bank (remove personal data first) | Columns are detected and lines already booked are matched. |
| *Assets*: run depreciation for October | Straight-line and WDV per class. Running the same period twice is refused. |
| Approve and pay the submitted expense claim | Expense and GST input credit posted, and the employee is paid. |
| Log timesheet hours on the catering project, then bill a milestone | Project cost and profit update, and the invoice links to the project. |

### CRM, dashboard and assistant

| Do this | Expect |
|---|---|
| Move a lead through the pipeline to *won* and convert it | It becomes a customer, and the pipeline value on the dashboard updates. |
| Complete a due follow-up | The dashboard's "follow-up late" warning disappears. |
| *Reports → Builder*: build, save and schedule a report | It runs, exports CSV, and the scheduled email arrives (or is logged). |
| Ask the assistant "Who owes me the most?" | It answers from your data. It never posts anything itself. |
| Open a posted invoice and press "Send on WhatsApp" | It goes to the customer's mobile with a link to view and print the invoice. |
| *Reports → Receivables*: "Remind everyone overdue", or "Remind" on one customer | Each customer with overdue bills gets a reminder with a link to their statement (open bills, days late, bank details). Nashik Readymade Stores has no mobile and is listed to call. |
| *CRM → WhatsApp log* | Every bill, invoice and reminder sent, with who sent it; "Failed" shows any that did not go. Messages are recorded but not delivered until WhatsApp Business is connected. |

### Offline app (Windows/Android)

Run it with `flutter run -d windows`, or build it with `flutter build windows`; the output is in `apps/varchasv/build/windows/x64/runner/Release`. Both need Visual Studio 2022 with the *Desktop development with C++* workload. Android needs the Android SDK.

| Do this | Expect |
|---|---|
| Connect to the cloud with the owner's email | The device registers and data arrives. |
| Turn off the network, record vouchers, a POS bill and attendance | Everything works and is numbered from the device's own series (e.g. `RA1/26-27/00001`). |
| Reconnect | Changes sync once. Nothing is duplicated, and the web app shows them. |
| Record vouchers on two devices offline | Both sync, each with its own number series, so numbers never clash. |

## 4. Reporting a bug

Please include:

- What you did, step by step, and what you expected.
- What happened instead, with a screenshot.
- Your role, the language you used, light or dark theme, and the browser or device.
- The document number (e.g. `INV/26-27/00012`) if there is one.

The date, number and amount fields are where Indian-format bugs hide. Try lakh and crore amounts,
dates around 31 March / 1 April, and inter-state customers.
