# 03 Screen catalog

All 229 web screens (Next.js `page.tsx` files under `apps/web/app`), then print pages, the device app screens, public pages and unlinked menu tiles. Titles, field labels, column headings and button names are the English strings (`packages/i18n/messages/en.json`) used by the screen's own code [F]. Fields built from data rather than literal labels are not listed, so field lists are a lower bound.

Flags: **client** = interactive client component; **server** = rendered on the server; **keys** = function keys the screen binds; **kbd** = has key handlers; **print** = offers printing; **export** = offers a download; **upload** = file picker.


## Layout group `app` (203 screens)

### `/account` My account
- **Purpose (screen subtitle) [F]**: Your name and password, used for every business you belong to.
- **File**: `apps/web/app/(app)/account/page.tsx` (23 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-009
- **Structure**: 0 table(s), 2 form(s), 5 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Email, Your name, Current password, New password, Repeat new password; buttons: Save, Change password

### `/accounts/bill-receipt`
- **File**: `apps/web/app/(app)/accounts/bill-receipt/page.tsx` (30 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, FIN-018, SEC-013, INV-004, INV-007
- **Structure**: 1 table(s), 1 form(s), 5 input(s), 2 select(s), 3 button(s)
- **Content [F]**: fields: Cash or bank account, Date, Reference (cheque, UPI id), Narration; columns: Bill, Date, Due, Pending, Pay now; buttons: Fill oldest first

### `/accounts/chart` Chart of accounts
- **Purpose (screen subtitle) [F]**: Ledgers grouped the way your accountant expects. Customers go under Sundry Debtors, suppliers under Sundry Creditors.
- **File**: `apps/web/app/(app)/accounts/chart/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SAL-005, SAL-006, SAL-018
- **Structure**: 1 table(s), 1 form(s), 20 input(s), 8 select(s), 3 button(s)
- **Content [F]**: fields: Search, Group, Account name, Opening balance, GSTIN, State, Phone, Bill to, City, PIN code (+4 more); columns: Account name, Group, GSTIN, Balance; buttons: Save, Cancel
- **Permission checks in screen code**: accounts.create, accounts.edit

### `/accounts/close` Close the books
- **Purpose (screen subtitle) [F]**: Check what is still open before a month ends, sign off what you accept, save the month's reports, and settle each day's counter cash.
- **File**: `apps/web/app/(app)/accounts/close/page.tsx` (28 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, FIN-020, FIN-021, FIN-022, POS-014
- **Structure**: 0 table(s), 2 form(s), 3 input(s), 0 select(s), 4 button(s)
- **Content [F]**: fields: Day; buttons: Show
- **Permission checks in screen code**: accounts.approve, sales.approve

### `/accounts/gst-jv` GST journal voucher
- **Purpose (screen subtitle) [F]**: Adjust GST on its own: pay tax out of credit, reverse or claim credit, or raise or cut tax payable. No goods or party bill is involved.
- **File**: `apps/web/app/(app)/accounts/gst-jv/page.tsx` (41 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SAL-005, SAL-006, TAX-010, SAL-018
- **Structure**: 2 table(s), 2 form(s), 24 input(s), 12 select(s), 5 button(s)
- **Content [F]**: fields: Search, Group, Account name, Opening balance, GSTIN, State, Phone, Bill to, City, PIN code (+4 more); columns: Account name, Group, GSTIN, Balance; buttons: Save, Cancel

### `/accounts/reconciliation` Reconciliation
- **Purpose (screen subtitle) [F]**: Check a customer's or supplier's statement against your ledger. Matching is done by rules; what does not match becomes an exception with a reason, an owner and a history.
- **File**: `apps/web/app/(app)/accounts/reconciliation/page.tsx` (26 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, BNK-005, SEC-024
- **Structure**: 0 table(s), 1 form(s), 4 input(s), 4 select(s), 6 button(s)
- **Content [F]**: fields: Statement from a, Name, From, To, Their statement, Reason, Owner; buttons: Match
- **Permission checks in screen code**: accounts.approve, accounts.create, users.view

### `/accounts/scenarios` What-if planning
- **Purpose (screen subtitle) [F]**: Try a hire, a new shop, a price change or a loan against the last twelve months of your books, and see the year ahead as a worst, expected and best case.
- **File**: `apps/web/app/(app)/accounts/scenarios/page.tsx` (18 lines + 1 component file(s)); server
- **Features it calls**: FIN-023
- **Structure**: 1 table(s), 0 form(s), 2 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Scenario name; columns: Last 12 months; buttons: Run the numbers, Save scenario

### `/accounts/tds` TDS on payments
- **Purpose (screen subtitle) [F]**: Tax held back from contractors, professionals, rent, commission and interest, and the quarterly return (Form 26Q).
- **File**: `apps/web/app/(app)/accounts/tds/page.tsx` (28 lines + 1 component file(s)); server, export
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, TAX-013, TAX-014 (+6 more)
- **Structure**: 3 table(s), 3 form(s), 10 input(s), 4 select(s), 5 button(s)
- **Content [F]**: tabs: deduct, challans, return, tcs, tracker, sections; fields: Paid to, Section, Date of payment, Amount paid, Rate % (leave empty for the standard rate), Note, Date deposited, Paid from, BSR code (7 digits), Challan serial (+2 more); columns: Date of payment, Payee, Section, Paid, Rate, TDS, Status, Nature of payment, Individual or HUF %, Others % (+2 more); buttons: Show, Deduct TDS, Record challan
- **Permission checks in screen code**: accounts.create

### `/accounts/vouchers/[id]`
- **File**: `apps/web/app/(app)/accounts/vouchers/[id]/page.tsx` (73 lines + 1 component file(s)); server
- **Features it calls**: FIN-012, SEC-004
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Reason for cancelling; columns: Account, Debit, Credit; buttons: Cancel voucher
- **Permission checks in screen code**: accounts.cancel

### `/accounts/vouchers/new` Vouchers
- **Purpose (screen subtitle) [F]**: Every entry in your books. Posted vouchers are never edited: cancel and re-enter instead.
- **File**: `apps/web/app/(app)/accounts/vouchers/new/page.tsx` (29 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, FIN-012, SAL-005, SAL-006, SAL-018
- **Structure**: 2 table(s), 2 form(s), 25 input(s), 9 select(s), 6 button(s)
- **Content [F]**: fields: Search, Group, Account name, Opening balance, GSTIN, State, Phone, Bill to, City, PIN code (+4 more); columns: Account name, Group, GSTIN, Balance, Account, Debit, Credit; buttons: Save, Cancel, Add line, Post voucher

### `/accounts/vouchers` Vouchers
- **Purpose (screen subtitle) [F]**: Every entry in your books. Posted vouchers are never edited: cancel and re-enter instead.
- **File**: `apps/web/app/(app)/accounts/vouchers/page.tsx` (86 lines + 1 component file(s)); server
- **Features it calls**: FIN-012, SEC-004
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: Date, Number, Accounts, Narration, Amount
- **Permission checks in screen code**: accounts.create

### `/accounts/working-capital` Working capital
- **Purpose (screen subtitle) [F]**: What customers could owe you, when suppliers must be paid, cheques still to clear, where cash is heading, and the statement a bank asks for.
- **File**: `apps/web/app/(app)/accounts/working-capital/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, FIN-029, FIN-030 (+4 more)
- **Structure**: 4 table(s), 2 form(s), 10 input(s), 6 select(s), 3 button(s)
- **Content [F]**: tabs: exposure, suppliers, cheques, forecast, commitments, power; fields: Cheque, Party, Bank account, Cheque no., Cheque date, Amount, Overdue share that will come in (%), Type, Direction, Name (+4 more); columns: Customer, Owed, Overdue, Unapplied receipts, Orders open, Exposure, Limit, Week of, Collections, Supplier payments (+4 more); buttons: Record cheque, Add
- **Permission checks in screen code**: accounts.create

### `/assets/[id]` Fixed assets
- **Purpose (screen subtitle) [F]**: Register, depreciation as per the Companies Act, and the income-tax block schedule.
- **File**: `apps/web/app/(app)/assets/[id]/page.tsx` (73 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, AST-001, SEC-004, SEC-013, INV-004, INV-007
- **Structure**: 3 table(s), 4 form(s), 19 input(s), 12 select(s), 7 button(s)
- **Content [F]**: fields: Add a standard class, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %, Asset, Class, Cost (+4 more); columns: Period, Days, Entry, Total, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %; buttons: Add, Add asset, Record sale, Save
- **Permission checks in screen code**: assets.submit

### `/assets/depreciation` Depreciation
- **Purpose (screen subtitle) [F]**: Charge depreciation for a month, quarter or year. Each asset continues from where it was last charged.
- **File**: `apps/web/app/(app)/assets/depreciation/page.tsx` (46 lines + 3 component file(s)); server
- **Features it calls**: AST-001, SEC-004
- **Structure**: 3 table(s), 5 form(s), 20 input(s), 12 select(s), 10 button(s)
- **Content [F]**: fields: Cancelled, Cancel run, Add a standard class, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %, Asset (+4 more); columns: Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %; buttons: Add, Add asset, Record sale, Save
- **Permission checks in screen code**: assets.cancel, assets.submit

### `/assets/income-tax` Income-tax depreciation
- **Purpose (screen subtitle) [F]**: Block-wise, as for the tax audit report (Form 3CD, clause 18). Additions used for under 180 days get half the rate.
- **File**: `apps/web/app/(app)/assets/income-tax/page.tsx` (59 lines + 1 component file(s)); server
- **Features it calls**: AST-001, SEC-004
- **Structure**: 3 table(s), 5 form(s), 19 input(s), 13 select(s), 8 button(s)
- **Content [F]**: fields: Year, Add a standard class, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %, Asset, Class (+4 more); columns: Block, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %; buttons: Show, Add, Add asset, Record sale, Save
- **Permission checks in screen code**: assets.edit

### `/assets/new` Fixed assets
- **Purpose (screen subtitle) [F]**: Register, depreciation as per the Companies Act, and the income-tax block schedule.
- **File**: `apps/web/app/(app)/assets/new/page.tsx` (24 lines + 1 component file(s)); server
- **Features it calls**: AST-001, HR-001
- **Structure**: 2 table(s), 4 form(s), 19 input(s), 12 select(s), 7 button(s)
- **Content [F]**: fields: Add a standard class, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %, Asset, Class, Cost (+4 more); columns: Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %; buttons: Add, Add asset, Record sale, Save

### `/assets` Fixed assets
- **Purpose (screen subtitle) [F]**: Register, depreciation as per the Companies Act, and the income-tax block schedule.
- **File**: `apps/web/app/(app)/assets/page.tsx` (67 lines + 2 component file(s)); server
- **Features it calls**: AST-001, SEC-004
- **Structure**: 3 table(s), 4 form(s), 19 input(s), 12 select(s), 7 button(s)
- **Content [F]**: fields: Add a standard class, Name, Method, Useful life (years), Residual value %, Income-tax block, Tax rate %, Asset, Class, Cost (+4 more); columns: Code, Asset, Bought, Cost, Depreciation to date, Book value, Status, Name, Method, Useful life (years) (+3 more); buttons: Add, Add asset, Record sale, Save
- **Permission checks in screen code**: assets.create, assets.edit

### `/assistant` Assistant
- **Purpose (screen subtitle) [F]**: Ask about sales, dues, profit, stock or GST. It reads your books; it never changes them.
- **File**: `apps/web/app/(app)/assistant/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: RPT-007
- **Structure**: 0 table(s), 1 form(s), 1 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Ask a question…; buttons: Ask

### `/banking/[id]`
- **File**: `apps/web/app/(app)/banking/[id]/page.tsx` (101 lines + 1 component file(s)); server, export, upload
- **Features it calls**: SEC-004, BNK-001, BNK-002
- **Structure**: 1 table(s), 3 form(s), 8 input(s), 1 select(s), 13 button(s)
- **Content [F]**: tabs: open, matched, ignored, brs; fields: As on, Post to ledger, Narration, Bank, Account (last 4 digits), IFSC; buttons: Show, Post entry, Save
- **Permission checks in screen code**: banking.create, banking.edit

### `/banking` Banks
- **Purpose (screen subtitle) [F]**: Match your bank statements with the books.
- **File**: `apps/web/app/(app)/banking/page.tsx` (49 lines + 0 component file(s)); server
- **Features it calls**: BNK-001
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/banking/rules` Bank rules
- **Purpose (screen subtitle) [F]**: Statement lines with these words are posted to a ledger in one click (bank charges, interest, standing orders).
- **File**: `apps/web/app/(app)/banking/rules/page.tsx` (21 lines + 1 component file(s)); server, export, upload
- **Features it calls**: SEC-004, BNK-001, BNK-002, BNK-003, BNK-004
- **Structure**: 0 table(s), 0 form(s), 6 input(s), 4 select(s), 2 button(s)
- **Content [F]**: fields: Narration contains, Money, Post to, Narration, Priority, Gateway, Paid into, Collections were booked to
- **Permission checks in screen code**: banking.edit

### `/banking/settlements` Gateway settlements
- **Purpose (screen subtitle) [F]**: Payouts from Razorpay, PhonePe, Paytm and others: collections less refunds, fees and GST on fees, landing in the bank as one credit.
- **File**: `apps/web/app/(app)/banking/settlements/page.tsx` (65 lines + 1 component file(s)); server, export, upload
- **Features it calls**: SEC-004, BNK-001, BNK-002, BNK-004
- **Structure**: 1 table(s), 0 form(s), 6 input(s), 4 select(s), 2 button(s)
- **Content [F]**: fields: In bank, Narration contains, Money, Post to, Narration, Priority, Gateway, Paid into, Collections were booked to; columns: Settled, Settlement, Payments, Collected, Refunds, Fees, GST on fees, Paid out, In bank
- **Permission checks in screen code**: banking.create

### `/chat` Chat
- **Purpose (screen subtitle) [F]**: Messages with the other people in this business. Only you and the other person can read a conversation.
- **File**: `apps/web/app/(app)/chat/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: AI-001
- **Structure**: 0 table(s), 1 form(s), 1 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Type a message; buttons: Send

### `/crm/activities` Follow-ups
- **Purpose (screen subtitle) [F]**: Calls, meetings and tasks, the earliest due first.
- **File**: `apps/web/app/(app)/crm/activities/page.tsx` (26 lines + 1 component file(s)); server
- **Features it calls**: CRM-015, CRM-017, CRM-020, CRM-021
- **Structure**: 0 table(s), 3 form(s), 18 input(s), 5 select(s), 9 button(s)
- **Content [F]**: fields: Contact person, Business, Mobile, Email, Source, Expected value (₹), Expected to close, City, GSTIN, State (+4 more); buttons: Save, Mark lost, Add

### `/crm/communications` Communication centre
- **Purpose (screen subtitle) [F]**: Every message the business sends, in one place: wording by language, who agreed to hear from you, what is waiting, what went, what it cost.
- **File**: `apps/web/app/(app)/crm/communications/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, CRM-001, CRM-002, CRM-003, CRM-005, CRM-006, CRM-007, CRM-010 (+1 more)
- **Structure**: 4 table(s), 4 form(s), 13 input(s), 5 select(s), 6 button(s)
- **Content [F]**: tabs: log, send, templates, consent, settings; fields: Show, Event, Mobile number, Email, Details, Channel, Language, Subject (email), Message, Mobile or email (+3 more); columns: Channel, Delivered, Cost, When, Event, To, Message, Status, Language, Mobile or email (+2 more); buttons: Queue the message, Save wording, Save
- **Permission checks in screen code**: crm.edit

### `/crm/customers/[id]` Customer
- **File**: `apps/web/app/(app)/crm/customers/[id]/page.tsx` (81 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, CRM-015, CRM-017, CRM-018, CRM-019, CRM-020, CRM-021
- **Structure**: 0 table(s), 3 form(s), 18 input(s), 5 select(s), 9 button(s)
- **Content [F]**: fields: Cancelled, Contact person, Business, Mobile, Email, Source, Expected value (₹), Expected to close, City, GSTIN (+4 more); buttons: Save, Mark lost, Add
- **Permission checks in screen code**: crm.create

### `/crm/leads/[id]` Leads
- **Purpose (screen subtitle) [F]**: Prospects from first enquiry to order.
- **File**: `apps/web/app/(app)/crm/leads/[id]/page.tsx` (44 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, CRM-015, CRM-017, CRM-018, CRM-019, CRM-020, CRM-021
- **Structure**: 0 table(s), 3 form(s), 18 input(s), 5 select(s), 9 button(s)
- **Content [F]**: fields: Contact person, Business, Mobile, Email, Source, Expected value (₹), Expected to close, City, GSTIN, State (+4 more); buttons: Save, Mark lost, Add
- **Permission checks in screen code**: crm.create, crm.edit

### `/crm/leads/new` Leads
- **Purpose (screen subtitle) [F]**: Prospects from first enquiry to order.
- **File**: `apps/web/app/(app)/crm/leads/new/page.tsx` (18 lines + 1 component file(s)); server
- **Features it calls**: CRM-015, CRM-017, CRM-020, CRM-021
- **Structure**: 0 table(s), 3 form(s), 18 input(s), 5 select(s), 9 button(s)
- **Content [F]**: fields: Contact person, Business, Mobile, Email, Source, Expected value (₹), Expected to close, City, GSTIN, State (+4 more); buttons: Save, Mark lost, Add

### `/crm/leads` Leads
- **Purpose (screen subtitle) [F]**: Prospects from first enquiry to order.
- **File**: `apps/web/app/(app)/crm/leads/page.tsx` (81 lines + 0 component file(s)); server
- **Features it calls**: SEC-004, CRM-015, CRM-016
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Search name, business, mobile or city; columns: Contact person, Source, Stage, Expected value (₹), Next follow-up, Owner; buttons: Search
- **Permission checks in screen code**: crm.create

### `/crm/messages`
- **File**: `apps/web/app/(app)/crm/messages/page.tsx` (79 lines + 0 component file(s)); server
- **Features it calls**: CRM-019
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: When, To, Type, Message, Status

### `/crm/templates` Message templates
- **Purpose (screen subtitle) [F]**: WhatsApp messages with numbered blanks for names, amounts and dates. To message a customer first, the template must be approved by Meta; enter its approved name.
- **File**: `apps/web/app/(app)/crm/templates/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, CRM-015, CRM-017, CRM-018, CRM-019, CRM-020, CRM-021
- **Structure**: 0 table(s), 3 form(s), 18 input(s), 5 select(s), 9 button(s)
- **Content [F]**: fields: Contact person, Business, Mobile, Email, Source, Expected value (₹), Expected to close, City, GSTIN, State (+4 more); buttons: Save, Mark lost, Add
- **Permission checks in screen code**: crm.edit

### `/dashboard`
- **File**: `apps/web/app/(app)/dashboard/page.tsx` (234 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-013, RPT-001
- **Structure**: 0 table(s), 0 form(s), 2 input(s), 3 select(s), 0 button(s)
- **Content [F]**: fields: Money position, Sales, last 30 days, Supplier state, Place of supply, Quantity, Rate (₹), GST %

### `/expenses/[id]/edit` Expense claim
- **File**: `apps/web/app/(app)/expenses/[id]/edit/page.tsx` (35 lines + 1 component file(s)); server, upload
- **Features it calls**: SEC-004, EXP-001, EXP-002
- **Structure**: 0 table(s), 2 form(s), 22 input(s), 6 select(s), 12 button(s)
- **Content [F]**: fields: Employee, Date, Purpose, Project, Category, From, To, Kilometres, Days away, Amount (₹) (+4 more); buttons: Reject, Pay
- **Permission checks in screen code**: projects.view

### `/expenses/[id]` Expense claim
- **File**: `apps/web/app/(app)/expenses/[id]/page.tsx` (70 lines + 2 component file(s)); server, upload
- **Features it calls**: SEC-004, EXP-001, EXP-002
- **Structure**: 1 table(s), 2 form(s), 22 input(s), 6 select(s), 12 button(s)
- **Content [F]**: fields: Employee, Date, Purpose, Project, Category, From, To, Kilometres, Days away, Amount (₹) (+4 more); columns: Date, Category, Vendor, GST credit, Amount; buttons: Reject, Pay
- **Permission checks in screen code**: expenses.approve, expenses.cancel, expenses.edit

### `/expenses/new` Expense claims
- **Purpose (screen subtitle) [F]**: Staff claim what they spent; approving books it (with GST credit where allowed) and paying settles it.
- **File**: `apps/web/app/(app)/expenses/new/page.tsx` (22 lines + 1 component file(s)); server, upload
- **Features it calls**: SEC-004, EXP-001, EXP-002
- **Structure**: 0 table(s), 2 form(s), 22 input(s), 6 select(s), 12 button(s)
- **Content [F]**: fields: Employee, Date, Purpose, Project, Category, From, To, Kilometres, Days away, Amount (₹) (+4 more); buttons: Reject, Pay
- **Permission checks in screen code**: projects.view

### `/expenses` Expense claims
- **Purpose (screen subtitle) [F]**: Staff claim what they spent; approving books it (with GST credit where allowed) and paying settles it.
- **File**: `apps/web/app/(app)/expenses/page.tsx` (71 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, EXP-002
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Claim, Employee, Purpose, Amount, Status
- **Permission checks in screen code**: expenses.create

### `/expenses/travel` Travel claims
- **Purpose (screen subtitle) [F]**: Trips claimed by each person: how many, how far and what was paid. Each trip sits on an ordinary expense claim.
- **File**: `apps/web/app/(app)/expenses/travel/page.tsx` (46 lines + 0 component file(s)); server
- **Features it calls**: EXP-003
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 0 select(s), 0 button(s)

### `/gst/compliance` GST compliance
- **Purpose (screen subtitle) [F]**: Supplier statements, credit to give back, the annual working and sign-off before a return goes up.
- **File**: `apps/web/app/(app)/gst/compliance/page.tsx` (33 lines + 1 component file(s)); server, upload
- **Features it calls**: FIN-010, FIN-011, SEC-004, TAX-011
- **Structure**: 7 table(s), 0 form(s), 6 input(s), 3 select(s), 5 button(s)
- **Content [F]**: tabs: twoA, rule37a, annual, approvals; fields: Load a GSTR-2A file, Month, Financial year starting, Book the reversal to, Composition rate %, Return
- **Permission checks in screen code**: gst.approve, gst.submit

### `/gst/exports` Exports
- **Purpose (screen subtitle) [F]**: Shipping bills and bank realisation, duty-credit scrips with their rates, and the refund when inputs are taxed higher than the goods.
- **File**: `apps/web/app/(app)/gst/exports/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, TAX-001
- **Structure**: 4 table(s), 5 form(s), 20 input(s), 2 select(s), 7 button(s)
- **Content [F]**: tabs: shipments, incentive, scrips, inverted; fields: Shipping bill number, Shipping bill date, Port code, Realisation certificate number, Realisation certificate date, Money received so far, Scheme, Tariff heading starts with, Rate (%), From (+4 more); columns: Invoice, Shipping bill, Invoice value, Money received, Due by, Status, Shipped on, Value, Incentive earned, No rate for (+4 more); buttons: Save, Add rate, Add scrip, Work it out
- **Permission checks in screen code**: gst.submit

### `/gst/returns` GST returns
- **Purpose (screen subtitle) [F]**: GSTR-1 and GSTR-3B from your invoices and bills. File them here, or download the JSON for the GST portal's offline tool.
- **File**: `apps/web/app/(app)/gst/returns/page.tsx` (181 lines + 2 component file(s)); server, export
- **Features it calls**: SEC-004, TAX-004, TAX-005, TAX-006, TAX-007
- **Structure**: 3 table(s), 3 form(s), 3 input(s), 1 select(s), 8 button(s)
- **Content [F]**: fields: Download JSON, GST portal username, OTP; columns: Taxable value, Section, Invoices, Tax, Tax head, Tax due, Paid by credit, Pay in cash, Credit carried forward; buttons: Show, Send OTP, Connect, File with EVC
- **Permission checks in screen code**: gst.approve, gst.submit

### `/gst/slab-exceptions` GST slab exceptions
- **Purpose (screen subtitle) [F]**: Garments and footwear pay GST by the value of each piece. This lists sales charged a rate that value does not call for.
- **File**: `apps/web/app/(app)/gst/slab-exceptions/page.tsx` (41 lines + 0 component file(s)); server
- **Features it calls**: TAX-011
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 0 select(s), 0 button(s)

### `/gst/workspace` GST workspace
- **Purpose (screen subtitle) [F]**: What to file and when, your supplier statement against your books, invoices waiting for an e-invoice, and credit that may have to be paid back.
- **File**: `apps/web/app/(app)/gst/workspace/page.tsx` (22 lines + 1 component file(s)); server, upload
- **Features it calls**: SEC-004, TAX-011
- **Structure**: 0 table(s), 0 form(s), 2 input(s), 1 select(s), 0 button(s)
- **Content [F]**: tabs: calendar, recon, einvoice, rule37; fields: Load GSTR-2B (JSON), Return period
- **Permission checks in screen code**: gst.submit

### `/hr/attendance-alerts` Absent and late
- **Purpose (screen subtitle) [F]**: Who was marked absent or came in late on a day. A day with no entry counts as present.
- **File**: `apps/web/app/(app)/hr/attendance-alerts/page.tsx` (48 lines + 0 component file(s)); server
- **Features it calls**: HR-010
- **Structure**: 0 table(s), 1 form(s), 1 input(s), 0 select(s), 1 button(s)

### `/hr/attendance-devices` Attendance machines
- **Purpose (screen subtitle) [F]**: Fingerprint, face or card machines that send their punches here on their own. No file to export or import.
- **File**: `apps/web/app/(app)/hr/attendance-devices/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, HR-020
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Name, Serial number, Remove machine; columns: When, Machine, Number, Person; buttons: Register machine
- **Permission checks in screen code**: hr.edit

### `/hr/attendance` Attendance
- **Purpose (screen subtitle) [F]**: Unmarked working days count as present. Click a day to mark it absent, then half day, then present again.
- **File**: `apps/web/app/(app)/hr/attendance/page.tsx` (54 lines + 2 component file(s)); server, export, upload
- **Features it calls**: SEC-004, TAX-009, HR-002, HR-003, HR-004
- **Structure**: 2 table(s), 3 form(s), 5 input(s), 3 select(s), 4 button(s)
- **Content [F]**: fields: Month, Date, Holiday, Employee, What happened, Note; columns: Full name, Loss of pay, Row, Code, Date, Worked, Result; buttons: Show, Add holiday, Save change
- **Permission checks in screen code**: hr.edit

### `/hr/documents` Documents and KYC
- **File**: `apps/web/app/(app)/hr/documents/page.tsx` (54 lines + 0 component file(s)); server
- **Features it calls**: HR-013
- **Structure**: 1 table(s), 1 form(s), 0 input(s), 1 select(s), 1 button(s)

### `/hr/employees/[id]`
- **File**: `apps/web/app/(app)/hr/employees/[id]/page.tsx` (138 lines + 6 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, HR-001, HR-014, HR-016, INV-004 (+2 more)
- **Structure**: 3 table(s), 8 form(s), 44 input(s), 10 select(s), 13 button(s)
- **Content [F]**: fields: Effective from, Last working day, Leave to encash (days), Other dues (bonus, notice pay), Recoveries (advances), Remarks, Document, Number, Issued on, Expires on (+4 more); columns: Leave type, Brought forward, This year, Taken, Balance, Type, Paid on, Amount, Monthly instalment, Recovered; buttons: Save revision, Save declaration, Settle and mark as left, Add document, Save review, Pay out, Save repayment
- **Permission checks in screen code**: hr.edit, payroll.approve, payroll.cancel, payroll.create, payroll.edit, payroll.view

### `/hr/employees/new` Employees
- **Purpose (screen subtitle) [F]**: Your team, their pay and statutory details.
- **File**: `apps/web/app/(app)/hr/employees/new/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, HR-016, INV-004, INV-007, INV-012
- **Structure**: 0 table(s), 1 form(s), 23 input(s), 5 select(s), 1 button(s)
- **Content [F]**: fields: Full name, Name in Hindi (optional), Gender, Date of birth, Mobile, Email, Address, City, PIN code, Employee code (+4 more)

### `/hr/employees` Employees
- **Purpose (screen subtitle) [F]**: Your team, their pay and statutory details.
- **File**: `apps/web/app/(app)/hr/employees/page.tsx` (60 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, HR-001
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Employee code, Full name, Designation, Joined on, Status, Monthly gross
- **Permission checks in screen code**: hr.create

### `/hr/leave` Leave
- **Purpose (screen subtitle) [F]**: Requests, approvals and balances.
- **File**: `apps/web/app/(app)/hr/leave/page.tsx` (30 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, HR-001, HR-005, HR-006
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 2 select(s), 4 button(s)
- **Content [F]**: fields: Employee, Leave type, From, To, Reason; buttons: Submit request
- **Permission checks in screen code**: hr.approve, hr.create, hr.edit

### `/hr/loan-requests` Advance and loan requests
- **Purpose (screen subtitle) [F]**: Ask for an advance or loan on an employee's behalf. Nothing is paid until someone with approval rights approves it.
- **File**: `apps/web/app/(app)/hr/loan-requests/page.tsx` (28 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, HR-001, HR-012, INV-004, INV-007
- **Structure**: 0 table(s), 1 form(s), 5 input(s), 3 select(s), 4 button(s)
- **Content [F]**: fields: Employee, Type, Amount, Recovery per month, Reason, Pay from, Date, Note; buttons: Send request
- **Permission checks in screen code**: payroll.approve, payroll.create

### `/hr/payroll/[id]`
- **File**: `apps/web/app/(app)/hr/payroll/[id]/page.tsx` (29 lines + 3 component file(s)); server, export
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, HR-008, INV-004, INV-007
- **Structure**: 1 table(s), 4 form(s), 7 input(s), 2 select(s), 16 button(s)
- **Content [F]**: fields: Cancel run, Reason for cancelling, Month, LOP days, Paid from, Payment date; columns: Employee; buttons: Run payroll, Remove, Save, Close, Record payment
- **Permission checks in screen code**: payroll.approve, payroll.cancel, payroll.edit, payroll.export, payroll.submit

### `/hr/payroll` Payroll
- **Purpose (screen subtitle) [F]**: Monthly salary with PF, ESI, professional tax and TDS worked out, posted to your books.
- **File**: `apps/web/app/(app)/hr/payroll/page.tsx` (62 lines + 2 component file(s)); server, export
- **Features it calls**: SEC-004, HR-008
- **Structure**: 2 table(s), 3 form(s), 6 input(s), 2 select(s), 13 button(s)
- **Content [F]**: fields: Month, LOP days, Paid from, Payment date; columns: Month, Status, Employee, Gross, Net pay; buttons: Run payroll, Remove, Save, Close, Record payment
- **Permission checks in screen code**: payroll.approve, payroll.create, payroll.edit, payroll.export, payroll.submit

### `/hr/statutory` Statutory dues & TDS
- **Purpose (screen subtitle) [F]**: PF, ESI, professional tax, LWF and TDS from final payroll, what's been paid, the quarterly TDS return and Form 16.
- **File**: `apps/web/app/(app)/hr/statutory/page.tsx` (55 lines + 1 component file(s)); server, export
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, HR-001, HR-017, HR-018, INV-004 (+1 more)
- **Structure**: 1 table(s), 2 form(s), 5 input(s), 3 select(s), 5 button(s)
- **Content [F]**: fields: Financial year, Amount, Paid on, Paid from, Challan / TRRN no., BSR code, Challan serial no., Quarter; columns: Wage month, Type, Due, Paid, Balance, Pay by; buttons: Show, Save payment, Close
- **Permission checks in screen code**: payroll.submit

### `/hr/stipends` Stipend
- **Purpose (screen subtitle) [F]**: Pay a trainee or apprentice a monthly stipend. One payment per person per month, with no PF or ESI.
- **File**: `apps/web/app/(app)/hr/stipends/page.tsx` (33 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, HR-001, HR-011, INV-004, INV-007
- **Structure**: 1 table(s), 2 form(s), 4 input(s), 2 select(s), 2 button(s)
- **Content [F]**: fields: Month, Employee, Amount, Date, Pay from, Remarks, Cancelled; columns: Employee, Date, Amount; buttons: Show, Pay stipend
- **Permission checks in screen code**: payroll.cancel, payroll.create

### `/insights` Business insights
- **Purpose (screen subtitle) [F]**: Sales, profit, stock and money for any period, against the same period last year.
- **File**: `apps/web/app/(app)/insights/page.tsx` (27 lines + 1 component file(s)); server
- **Features it calls**: RPT-001
- **Structure**: 2 table(s), 1 form(s), 2 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: From, To, Sales, Pieces sold, Average bill, Margin, Purchases, Stock now, To collect, To pay (+3 more); columns: Age, Pieces, Value; buttons: Show

### `/inventory/barcode-search` Barcode search
- **Purpose (screen subtitle) [F]**: Scan or type a barcode, SKU or part of a name to see the item, its rates and stock.
- **File**: `apps/web/app/(app)/inventory/barcode-search/page.tsx` (58 lines + 0 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 1 button(s)

### `/inventory/branch-prices` Store prices
- **Purpose (screen subtitle) [F]**: Each store can sell an item at its own rate over the usual one. Items with no entry sell at the usual rate.
- **File**: `apps/web/app/(app)/inventory/branch-prices/page.tsx` (24 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, POS-005, SEC-013, INV-004, INV-007
- **Structure**: 1 table(s), 1 form(s), 6 input(s), 3 select(s), 4 button(s)
- **Content [F]**: fields: Store, Copy rates from, Item, Store rate, From date, To date, From time, To time, Paste a list; columns: Item, Usual rate, Store rate, When; buttons: Add rate
- **Permission checks in screen code**: sales.edit

### `/inventory/catalogue/[id]` Image catalogue
- **Purpose (screen subtitle) [F]**: Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them.
- **File**: `apps/web/app/(app)/inventory/catalogue/[id]/page.tsx` (21 lines + 1 component file(s)); server, export
- **Features it calls**: SEC-004, SAL-003, SAL-021
- **Structure**: 0 table(s), 0 form(s), 5 input(s), 1 select(s), 7 button(s)
- **Content [F]**: fields: Link works for, Link, WhatsApp number; buttons: Export to Excel
- **Permission checks in screen code**: sales.create

### `/inventory/catalogue` Image catalogue
- **Purpose (screen subtitle) [F]**: Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them.
- **File**: `apps/web/app/(app)/inventory/catalogue/page.tsx` (30 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SAL-003, SEC-013, INV-004, INV-007
- **Structure**: 0 table(s), 2 form(s), 10 input(s), 3 select(s), 7 button(s)
- **Content [F]**: fields: Sort, Barcode, design or name, Prices for, Rate from, Rate up to, Received from, Received up to, Selection name, For party; buttons: Apply, Save selection
- **Permission checks in screen code**: sales.create

### `/inventory/counts/[id]` Stock counts
- **Purpose (screen subtitle) [F]**: Count a store by scanning barcodes. An approver sees the differences and their value, and approving puts the books right.
- **File**: `apps/web/app/(app)/inventory/counts/[id]/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-022
- **Structure**: 1 table(s), 2 form(s), 7 input(s), 3 select(s), 7 button(s)
- **Content [F]**: fields: Warehouse, What to count, Name, Scan a barcode, Reason for the differences; columns: Item, Barcode, In the books, Counted, Difference, Value; buttons: Start counting, Add
- **Permission checks in screen code**: inventory.approve, inventory.create

### `/inventory/counts/audit` Stock audit
- **Purpose (screen subtitle) [F]**: How well the books matched the shelves in each count, and what is found short again and again.
- **File**: `apps/web/app/(app)/inventory/counts/audit/page.tsx` (53 lines + 0 component file(s)); server
- **Features it calls**: INV-023
- **Structure**: 2 table(s), 1 form(s), 2 input(s), 0 select(s), 0 button(s)

### `/inventory/counts` Stock counts
- **Purpose (screen subtitle) [F]**: Count a store by scanning barcodes. An approver sees the differences and their value, and approving puts the books right.
- **File**: `apps/web/app/(app)/inventory/counts/page.tsx` (52 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, INV-022
- **Structure**: 2 table(s), 2 form(s), 7 input(s), 3 select(s), 7 button(s)
- **Content [F]**: fields: Warehouse, What to count, Name, Scan a barcode, Reason for the differences; columns: Count, Name, Warehouse, Started, Pieces counted, Stage, Item, Barcode, In the books, Counted (+2 more); buttons: Start counting, Add
- **Permission checks in screen code**: inventory.create

### `/inventory/distribution` Branches and share-out
- **Purpose (screen subtitle) [F]**: Stores side by side, and new stock shared between them by demand, ratio or fixed numbers.
- **File**: `apps/web/app/(app)/inventory/distribution/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-001, INV-002, INV-004, INV-007
- **Structure**: 2 table(s), 0 form(s), 5 input(s), 3 select(s), 2 button(s)
- **Content [F]**: fields: From, To, Stock is in, Item, Pieces, Share by, Days of sales to look at; columns: Store, Sales, Share of sales, Pieces, Bills, Average bill, Stock, Stock value, Days of cover; buttons: Show the share-out, Send as transfers
- **Permission checks in screen code**: inventory.create

### `/inventory/items/[id]`
- **File**: `apps/web/app/(app)/inventory/items/[id]/page.tsx` (84 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, INV-010
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: Date, Particulars, Warehouse, In, Out, Quantity, Value

### `/inventory/items` Items
- **Purpose (screen subtitle) [F]**: Goods you stock and services you buy or sell, with HSN/SAC and GST rate.
- **File**: `apps/web/app/(app)/inventory/items/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-003, INV-004, INV-007, INV-020
- **Structure**: 1 table(s), 1 form(s), 20 input(s), 6 select(s), 7 button(s)
- **Content [F]**: fields: Search, Item name, Type, HSN / SAC, GST rate, Pieces in one unit, Unit, Purchase rate, Sale rate, MRP (+4 more); columns: Item name, HSN / SAC, GST rate, Purchase rate, In stock; buttons: Save, Cancel
- **Permission checks in screen code**: inventory.create, inventory.edit

### `/inventory/journals/[id]`
- **File**: `apps/web/app/(app)/inventory/journals/[id]/page.tsx` (59 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, INV-008
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Cancel voucher, Reason for cancelling; columns: Item, Warehouse, In, Out, Rate
- **Permission checks in screen code**: inventory.cancel

### `/inventory/journals/new` Stock journals
- **Purpose (screen subtitle) [F]**: Opening stock, physical-count adjustments, transfers between warehouses, and consumption.
- **File**: `apps/web/app/(app)/inventory/journals/new/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, INV-008, INV-029
- **Structure**: 1 table(s), 1 form(s), 5 input(s), 4 select(s), 3 button(s)
- **Content [F]**: fields: Date, Narration, Warehouse, To warehouse, Add / remove, Quantity, Rate, Batch; columns: Item, Warehouse, To warehouse, Add / remove, Quantity, Rate, Batch; buttons: Post stock journal

### `/inventory/journals` Stock journals
- **Purpose (screen subtitle) [F]**: Opening stock, physical-count adjustments, transfers between warehouses, and consumption.
- **File**: `apps/web/app/(app)/inventory/journals/page.tsx` (59 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-008
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Type, Narration, Status
- **Permission checks in screen code**: inventory.create

### `/inventory/labels` Barcode and price labels
- **Purpose (screen subtitle) [F]**: Print tags with the barcode, MRP and size on label rolls, A4 sheets or hang tags.
- **File**: `apps/web/app/(app)/inventory/labels/page.tsx` (47 lines + 2 component file(s)); server, kbd
- **Features it calls**: SEC-013, INV-007, INV-029
- **Structure**: 1 table(s), 0 form(s), 7 input(s), 3 select(s), 4 button(s)
- **Content [F]**: fields: Scan a barcode or type a name, A whole design, Labels, Label stock, Copies of each label, Labels already used on the first sheet, Extra line text; columns: Item, Barcode, MRP, Labels; buttons: Give barcodes to items that have none

### `/inventory/losses` Stock losses and damage
- **Purpose (screen subtitle) [F]**: Write off stock that is damaged, lost, stolen or expired, with the reason and a photo. A big loss waits for a second person to approve it.
- **File**: `apps/web/app/(app)/inventory/losses/page.tsx` (31 lines + 1 component file(s)); server, upload
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, EXP-001, INV-004, INV-007, INV-013 (+1 more)
- **Structure**: 0 table(s), 2 form(s), 4 input(s), 3 select(s), 4 button(s)
- **Content [F]**: fields: Item, Store, Pieces, Reason, What happened, Photo or paper, Approval limit (value at cost); buttons: Record loss, Save limit
- **Permission checks in screen code**: inventory.approve, inventory.create

### `/inventory/margin-bands` Mark-up bands
- **Purpose (screen subtitle) [F]**: From each cost upward, the MRP and the two sale rates come off a band. Receipts fill them in for you.
- **File**: `apps/web/app/(app)/inventory/margin-bands/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-015
- **Structure**: 0 table(s), 0 form(s), 5 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: From cost, Mark-up %, Sale rate: % off MRP, Lower rate: % off MRP, Remove band, Try a cost; buttons: Save bands
- **Permission checks in screen code**: inventory.approve

### `/inventory/rate-update` Rate updation
- **Purpose (screen subtitle) [F]**: Change sale rate, MRP or purchase rate for a group of items at once. Preview first; nothing changes until you apply.
- **File**: `apps/web/app/(app)/inventory/rate-update/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-018, INV-029
- **Structure**: 2 table(s), 0 form(s), 2 input(s), 5 select(s), 5 button(s)
- **Content [F]**: fields: Style, Rate, Change by, Round to; columns: Item, Was, Now
- **Permission checks in screen code**: inventory.approve

### `/inventory/relabel` Re-labelling
- **Purpose (screen subtitle) [F]**: Rename or re-price items already in stock on one voucher; the old values are kept and the barcodes stay the same.
- **File**: `apps/web/app/(app)/inventory/relabel/page.tsx` (24 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, INV-019
- **Structure**: 1 table(s), 1 form(s), 6 input(s), 1 select(s), 2 button(s)
- **Content [F]**: fields: Item, New name, Colour, Size, MRP, Sale rate, Remove, Why

### `/inventory/reset-stock` Reset physical stock
- **Purpose (screen subtitle) [F]**: Bring a store's stock to zero so it can be counted from scratch.
- **File**: `apps/web/app/(app)/inventory/reset-stock/page.tsx` (23 lines + 1 component file(s)); server
- **Features it calls**: INV-004, INV-025, INV-029
- **Structure**: 0 table(s), 1 form(s), 2 input(s), 3 select(s), 1 button(s)
- **Content [F]**: fields: Store, Which goods, Choose, Why; buttons: Reset to zero

### `/inventory/serials` Serial numbers
- **Purpose (screen subtitle) [F]**: Pieces that carry their own number: where each one is, when it came in and the bill it left on.
- **File**: `apps/web/app/(app)/inventory/serials/page.tsx` (26 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, INV-021
- **Structure**: 2 table(s), 2 form(s), 2 input(s), 3 select(s), 2 button(s)
- **Content [F]**: fields: Find a serial number, Item, Show, Store, Enter serial numbers; columns: Serial, Store, Came in, Sold on, Item, In stock, With a serial, Difference; buttons: Find, Add serials
- **Permission checks in screen code**: inventory.create

### `/inventory/stock-finance` Stock finance
- **Purpose (screen subtitle) [F]**: Slow stock that may be worth less than it cost, the provision it needs with a second person's approval, and stock and sales by store, GSTIN and channel.
- **File**: `apps/web/app/(app)/inventory/stock-finance/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, FIN-024, FIN-025, FIN-026
- **Structure**: 1 table(s), 0 form(s), 2 input(s), 0 select(s), 3 button(s)
- **Content [F]**: tabs: review, proposals, centres; fields: Selling cost (%); columns: Item, Pieces, Cost, By age, Below selling price, Write-down
- **Permission checks in screen code**: inventory.approve, inventory.edit

### `/inventory/stock-limits` Minimum and maximum stock
- **Purpose (screen subtitle) [F]**: Set how little and how much of each item a warehouse should hold. Items under their minimum are flagged so you know what to order.
- **File**: `apps/web/app/(app)/inventory/stock-limits/page.tsx` (28 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, INV-024
- **Structure**: 1 table(s), 0 form(s), 4 input(s), 1 select(s), 1 button(s)
- **Content [F]**: columns: Item, In stock, Minimum, Maximum, To order
- **Permission checks in screen code**: inventory.edit

### `/inventory/stock` Stock summary
- **Purpose (screen subtitle) [F]**: Quantity and value of every item. Valued by {method}.
- **File**: `apps/web/app/(app)/inventory/stock/page.tsx` (102 lines + 0 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, INV-009, INV-011
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 1 select(s), 1 button(s)
- **Content [F]**: columns: Item name, Quantity, Rate, Value; buttons: Show

### `/inventory/styles/[id]` Styles
- **Purpose (screen subtitle) [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock.
- **File**: `apps/web/app/(app)/inventory/styles/[id]/page.tsx` (32 lines + 2 component file(s)); server, upload
- **Features it calls**: FIN-010, FIN-011, SEC-004, SAL-001, SAL-002, SEC-013, INV-003, INV-004 (+5 more)
- **Structure**: 3 table(s), 5 form(s), 32 input(s), 8 select(s), 9 button(s)
- **Content [F]**: fields: Search by design no., name or brand, Design no., Name, Brand, Category, Season, Collection, HSN / SAC, GST rate, Unit (+4 more); columns: Design no., Name, Brand, Season, Colours, Variants, Sale rate, In stock, Colour, Total (+4 more); buttons: Create style, Cancel, Save, Add colours or sizes, Add
- **Permission checks in screen code**: inventory.edit

### `/inventory/styles` Styles
- **Purpose (screen subtitle) [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock.
- **File**: `apps/web/app/(app)/inventory/styles/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SAL-001, SAL-002, SEC-013, INV-003, INV-004 (+5 more)
- **Structure**: 3 table(s), 5 form(s), 31 input(s), 6 select(s), 9 button(s)
- **Content [F]**: fields: Search by design no., name or brand, Design no., Name, Brand, Category, Season, Collection, HSN / SAC, GST rate, Unit (+4 more); columns: Design no., Name, Brand, Season, Colours, Variants, Sale rate, In stock, Colour, Total (+4 more); buttons: Create style, Cancel, Save, Add colours or sizes, Add
- **Permission checks in screen code**: inventory.create

### `/inventory/styles/setup` Styles
- **Purpose (screen subtitle) [F]**: Designs sold in colours and sizes. Each colour and size is its own item, with its own barcode and stock.
- **File**: `apps/web/app/(app)/inventory/styles/setup/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SAL-001, SAL-002, INV-003, INV-012, INV-027, INV-028, INV-029
- **Structure**: 3 table(s), 5 form(s), 31 input(s), 6 select(s), 9 button(s)
- **Content [F]**: fields: Search by design no., name or brand, Design no., Name, Brand, Category, Season, Collection, HSN / SAC, GST rate, Unit (+4 more); columns: Design no., Name, Brand, Season, Colours, Variants, Sale rate, In stock, Colour, Total (+4 more); buttons: Create style, Cancel, Save, Add colours or sizes, Add
- **Permission checks in screen code**: inventory.edit

### `/inventory/transfers/[id]` Stock transfer
- **Purpose (screen subtitle) [F]**: Stock sent between warehouses. It leaves the source now and shows as in transit until the other side counts it in.
- **File**: `apps/web/app/(app)/inventory/transfers/[id]/page.tsx` (43 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, INV-030
- **Structure**: 2 table(s), 1 form(s), 2 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Received, Received on; columns: Item, Sent, Received; buttons: Receive stock, Call back
- **Permission checks in screen code**: inventory.cancel, inventory.create

### `/inventory/transfers/new` Stock transfer
- **Purpose (screen subtitle) [F]**: Stock sent between warehouses. It leaves the source now and shows as in transit until the other side counts it in.
- **File**: `apps/web/app/(app)/inventory/transfers/new/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, INV-030
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 2 select(s), 2 button(s)
- **Content [F]**: fields: Date, Transporter, Vehicle number, Item, Quantity, Remove this line; columns: Item, Quantity

### `/inventory/transfers` Stock transfer
- **Purpose (screen subtitle) [F]**: Stock sent between warehouses. It leaves the source now and shows as in transit until the other side counts it in.
- **File**: `apps/web/app/(app)/inventory/transfers/page.tsx` (55 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-030
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Permission checks in screen code**: inventory.create

### `/launcher` All actions
- **Purpose (screen subtitle) [F]**: Every entry, screen and report in one place. The star pins a tile to My Menu.
- **File**: `apps/web/app/(app)/launcher/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-005
- **Structure**: 0 table(s), 0 form(s), 1 input(s), 0 select(s), 0 button(s)
- **Content [F]**: fields: Type to find an action

### `/manufacturing/boms/[id]` Bills of materials
- **Purpose (screen subtitle) [F]**: What goes into each item you make, with wastage, work-centre time and overheads.
- **File**: `apps/web/app/(app)/manufacturing/boms/[id]/page.tsx` (91 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, MFG-002
- **Structure**: 3 table(s), 1 form(s), 9 input(s), 3 select(s), 7 button(s)
- **Content [F]**: fields: Archived, Default, Item made, Makes (quantity), Fixed overhead per batch (₹), Notes, Material, Quantity, Wastage %, Operation (+3 more); columns: Material, Quantity, Wastage %, Rate; buttons: Save BOM
- **Permission checks in screen code**: inventory.create, inventory.edit

### `/manufacturing/boms/new` Bills of materials
- **Purpose (screen subtitle) [F]**: What goes into each item you make, with wastage, work-centre time and overheads.
- **File**: `apps/web/app/(app)/manufacturing/boms/new/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, MFG-001, MFG-002
- **Structure**: 1 table(s), 1 form(s), 9 input(s), 3 select(s), 7 button(s)
- **Content [F]**: fields: Item made, Makes (quantity), Fixed overhead per batch (₹), Notes, Material, Quantity, Wastage %, Operation, Work centre, Minutes (+1 more); columns: Material, Quantity, Wastage %; buttons: Save BOM

### `/manufacturing/boms` Bills of materials
- **Purpose (screen subtitle) [F]**: What goes into each item you make, with wastage, work-centre time and overheads.
- **File**: `apps/web/app/(app)/manufacturing/boms/page.tsx` (61 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, MFG-001, MFG-002
- **Structure**: 2 table(s), 1 form(s), 9 input(s), 3 select(s), 7 button(s)
- **Content [F]**: fields: Archived, Default, Item made, Makes (quantity), Fixed overhead per batch (₹), Notes, Material, Quantity, Wastage %, Operation (+3 more); columns: Item made, Version, Makes (quantity), Material, Quantity, Wastage %; buttons: Save BOM
- **Permission checks in screen code**: inventory.create, inventory.edit

### `/manufacturing/job-work` Job work
- **Purpose (screen subtitle) [F]**: Goods sent to job workers on a challan and received back processed. Inputs must return within a year (capital goods three).
- **File**: `apps/web/app/(app)/manufacturing/job-work/page.tsx` (108 lines + 3 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, MFG-005
- **Structure**: 2 table(s), 2 form(s), 6 input(s), 3 select(s), 8 button(s)
- **Content [F]**: fields: Cancelled, Cancel, Reason for cancelling, Material, Quantity, Date, Job worker, Process, From challan, Job charges (₹); columns: Date, Number, Job worker, Material, Still with job worker
- **Permission checks in screen code**: inventory.cancel, inventory.create

### `/manufacturing/mrp` Material planning (MRP)
- **Purpose (screen subtitle) [F]**: What to make and buy to meet open sales orders and reorder levels, net of stock and what's already on order.
- **File**: `apps/web/app/(app)/manufacturing/mrp/page.tsx` (31 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, MFG-004
- **Structure**: 1 table(s), 1 form(s), 3 input(s), 1 select(s), 2 button(s)
- **Content [F]**: fields: Plan as of, Quantity, Supplier; columns: Item, Action, On hand, On order, Quantity, Start / order by, Needed by, Supplier; buttons: Show
- **Permission checks in screen code**: inventory.create, purchase.create

### `/manufacturing/orders/[id]` Production orders
- **Purpose (screen subtitle) [F]**: Plan, release and complete production. Materials leave stock and output comes in at cost.
- **File**: `apps/web/app/(app)/manufacturing/orders/[id]/page.tsx` (101 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, MFG-003
- **Structure**: 2 table(s), 3 form(s), 11 input(s), 2 select(s), 9 button(s)
- **Content [F]**: fields: Item, Quantity, Date, Notes, Good quantity, Rejected, Material, Cancel order; columns: Date, Good quantity, Material cost, Unit cost; buttons: Create order, Record output, Issue extra material
- **Permission checks in screen code**: inventory.cancel, inventory.create

### `/manufacturing/orders/new` Production orders
- **Purpose (screen subtitle) [F]**: Plan, release and complete production. Materials leave stock and output comes in at cost.
- **File**: `apps/web/app/(app)/manufacturing/orders/new/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, INV-004, INV-007, MFG-002, MFG-003
- **Structure**: 0 table(s), 3 form(s), 11 input(s), 2 select(s), 9 button(s)
- **Content [F]**: fields: Item, Quantity, Date, Notes, Good quantity, Rejected, Material, Cancel order; buttons: Create order, Record output, Issue extra material

### `/manufacturing/orders` Production orders
- **Purpose (screen subtitle) [F]**: Plan, release and complete production. Materials leave stock and output comes in at cost.
- **File**: `apps/web/app/(app)/manufacturing/orders/page.tsx` (59 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, MFG-003
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Item, Quantity, Produced, Status
- **Permission checks in screen code**: inventory.create

### `/masters/hsn` HSN and SAC codes
- **Purpose (screen subtitle) [F]**: The codes your business uses, with plain descriptions. Item and style forms suggest from this list. A rate here is only a convenience: apparel and footwear are taxed by price slab.
- **File**: `apps/web/app/(app)/masters/hsn/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-003
- **Structure**: 0 table(s), 2 form(s), 8 input(s), 2 select(s), 4 button(s)
- **Content [F]**: fields: Search, Code, Description, Type, Rate; buttons: Add, Save
- **Permission checks in screen code**: inventory.create, inventory.edit

### `/masters/lists/[kind]`
- **File**: `apps/web/app/(app)/masters/lists/[kind]/page.tsx` (38 lines + 1 component file(s)); server, kbd
- **Features it calls**: SEC-004, INV-012
- **Structure**: 0 table(s), 2 form(s), 12 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Lists, Name, Code, From, To, Note; buttons: Add, Save

### `/masters/merge` Merge duplicates
- **Purpose (screen subtitle) [F]**: Fold a duplicate customer, supplier or item into the one you want to keep. History stays where it was; the balance or stock moves across.
- **File**: `apps/web/app/(app)/masters/merge/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, INV-016, INV-017
- **Structure**: 0 table(s), 1 form(s), 0 input(s), 2 select(s), 1 button(s)
- **Content [F]**: fields: Duplicate (will be closed), Keep this one; buttons: Merge
- **Permission checks in screen code**: accounts.edit, inventory.edit

### `/masters`
- **File**: `apps/web/app/(app)/masters/page.tsx` (27 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/my-menu` All actions
- **Purpose (screen subtitle) [F]**: Every entry, screen and report in one place. The star pins a tile to My Menu.
- **File**: `apps/web/app/(app)/my-menu/page.tsx` (104 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, SEC-005, RPT-001, AI-002, POS-017
- **Structure**: 0 table(s), 1 form(s), 3 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Waiting for you, Write a note or reminder, Remind me on
- **Permission checks in screen code**: sales.view

### `/pos/alterations` Alterations and repairs
- **Purpose (screen subtitle) [F]**: Take garments in for fitting, give them to a karigar, and hand them back on the promised day.
- **File**: `apps/web/app/(app)/pos/alterations/page.tsx` (28 lines + 2 component file(s)); server, keys F10/F2/F3/F4/F5/F6/F7/F8/F9, kbd
- **Features it calls**: POS-001, POS-002, POS-003, SEC-004, POS-006, SAL-001, POS-013, POS-014 (+5 more)
- **Structure**: 3 table(s), 4 form(s), 19 input(s), 8 select(s), 22 button(s)
- **Content [F]**: fields: Karigar, Counter, Payment, Reason for cancelling, Against bill, Name, Mobile, Trial on, Deliver on, Garment (+4 more); columns: Karigar, Slips, Pieces, Labour, Name, Customer pays; buttons: Take in, Cancel, Close shift, Open shift, Hold
- **Permission checks in screen code**: sales.edit

### `/pos/billing` Billing
- **File**: `apps/web/app/(app)/pos/billing/page.tsx` (26 lines + 2 component file(s)); server, keys F10/F2/F3/F4/F5/F6/F7/F8/F9, kbd
- **Features it calls**: POS-004, SEC-004, POS-006, SAL-001, INV-007, POS-011, POS-012, POS-013 (+7 more)
- **Structure**: 2 table(s), 3 form(s), 20 input(s), 6 select(s), 14 button(s)
- **Content [F]**: fields: Counter, Cash counted (₹), Opening cash (₹), Salesman for the bill, Helper, Who is it for? (optional), Scan barcode or search items, Serial numbers, one for each piece, Qty, Rate (+4 more); columns: Item, Qty, Rate, Disc ₹, Salesman, Amount; buttons: Close shift, Open shift, Hold, Complete bill
- **Permission checks in screen code**: sales.approve

### `/pos/bills` POS bills
- **Purpose (screen subtitle) [F]**: Bills from all counters for a day.
- **File**: `apps/web/app/(app)/pos/bills/page.tsx` (100 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, POS-015, POS-017, POS-020, POS-028
- **Structure**: 2 table(s), 2 form(s), 2 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Date, Void, Reason; columns: Bill no., Time, Customer, Paid by, Total; buttons: Show, Void
- **Permission checks in screen code**: sales.cancel, sales.create

### `/pos/loyalty` Loyalty members
- **Purpose (screen subtitle) [F]**: The points the shop owes, who to wish this fortnight, and each member's birthday and anniversary.
- **File**: `apps/web/app/(app)/pos/loyalty/page.tsx` (60 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, POS-009
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Name or phone, Name, Birthday, Anniversary; columns: Member, Points, Lifetime points, Birthday, Anniversary; buttons: Find
- **Permission checks in screen code**: sales.edit

### `/pos/returns` Returns and exchanges
- **Purpose (screen subtitle) [F]**: Take goods back against a bill. For a size or colour swap, give store credit and bill the new piece with it.
- **File**: `apps/web/app/(app)/pos/returns/page.tsx` (47 lines + 2 component file(s)); server, keys F10/F2/F3/F4/F5/F6/F7/F8/F9, kbd
- **Features it calls**: SEC-004, POS-006, SAL-001, POS-013, POS-014, POS-015, POS-016, POS-018 (+3 more)
- **Structure**: 3 table(s), 5 form(s), 6 input(s), 7 select(s), 14 button(s)
- **Content [F]**: fields: Qty back, Reason, Condition, Counter, Give back as, Cash counted (₹), Opening cash (₹), Salesman for the bill, Helper, Who is it for? (optional); columns: Item, Can return, Qty back, Reason, Condition, Return, Bill, What came back, Give back as, Total; buttons: Take back, Close shift, Open shift, Hold
- **Permission checks in screen code**: sales.create

### `/pos/schemes` Schemes and offers
- **Purpose (screen subtitle) [F]**: Offers the counter applies on its own: percent off, amount off, buy X get Y, slabs and combos.
- **File**: `apps/web/app/(app)/pos/schemes/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, POS-010, INV-029
- **Structure**: 1 table(s), 1 form(s), 29 input(s), 5 select(s), 4 button(s)
- **Content [F]**: fields: Name, Type, From, Until, Offer hours from, Offer hours until, Rank, Amount off (₹), Minimum on these items (₹), Buy (+4 more); columns: Name, Offer, On, Dates; buttons: Save, Cancel
- **Permission checks in screen code**: company.view, inventory.view, sales.edit

### `/pos/tailoring` Made-to-order tailoring
- **Purpose (screen subtitle) [F]**: Measurements, an advance, each process through a karigar, and the tailoring bill at delivery.
- **File**: `apps/web/app/(app)/pos/tailoring/page.tsx` (28 lines + 2 component file(s)); server, keys F10/F2/F3/F4/F5/F6/F7/F8/F9, kbd, upload
- **Features it calls**: FIN-010, FIN-011, POS-001, SEC-004, POS-006, SAL-001, SEC-013, EXP-001 (+12 more)
- **Structure**: 1 table(s), 5 form(s), 25 input(s), 9 select(s), 25 button(s)
- **Content [F]**: fields: Counter, Cash counted (₹), Opening cash (₹), Salesman for the bill, Helper, Who is it for? (optional), Karigar, Payment, Reason for cancelling, Mobile (+4 more); buttons: Close shift, Open shift, Hold, Book order, Cancel, Save
- **Permission checks in screen code**: sales.edit

### `/pos/vouchers` Vouchers and coupons
- **Purpose (screen subtitle) [F]**: Gift vouchers, coupon codes, discount cards and lucky draws for the counter.
- **File**: `apps/web/app/(app)/pos/vouchers/page.tsx` (24 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, POS-028, POS-029, POS-030, POS-032
- **Structure**: 3 table(s), 4 form(s), 24 input(s), 2 select(s), 9 button(s)
- **Content [F]**: fields: Value (₹), How many, Expires on, Paid by, Name, Customer mobile (for points), Code, Type, Most it can take off (₹), Minimum bill (₹) (+4 more); columns: Code, For, Value (₹), Balance, Expires on, Status, Discount, Valid, Used, Card number (+2 more); buttons: Sell vouchers, Save, Cancel, Pick winners
- **Permission checks in screen code**: accounts.create, sales.approve, sales.edit

### `/projects/[id]` Projects
- **Purpose (screen subtitle) [F]**: Tasks, time, costs and billing for each job.
- **File**: `apps/web/app/(app)/projects/[id]/page.tsx` (88 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, PRJ-001, PRJ-002
- **Structure**: 1 table(s), 5 form(s), 22 input(s), 10 select(s), 9 button(s)
- **Content [F]**: fields: Cancelled, Project, Customer, Billing, Contract value (₹), Bill rate per hour (₹), Invoice as (service item), Budget cost (₹), Budget hours, Start (+4 more); columns: Date, Employee, Project, Task, Hours, Bill/h, Status; buttons: Save project, Add task, Add, Add milestone, Log
- **Permission checks in screen code**: projects.approve, projects.create, projects.edit, sales.create

### `/projects/new` Projects
- **Purpose (screen subtitle) [F]**: Tasks, time, costs and billing for each job.
- **File**: `apps/web/app/(app)/projects/new/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: PRJ-001, PRJ-002
- **Structure**: 1 table(s), 5 form(s), 22 input(s), 10 select(s), 9 button(s)
- **Content [F]**: fields: Project, Customer, Billing, Contract value (₹), Bill rate per hour (₹), Invoice as (service item), Budget cost (₹), Budget hours, Start, End (+4 more); columns: Date, Employee, Project, Task, Hours, Bill/h, Status; buttons: Save project, Add task, Add, Add milestone, Log

### `/projects` Projects
- **Purpose (screen subtitle) [F]**: Tasks, time, costs and billing for each job.
- **File**: `apps/web/app/(app)/projects/page.tsx` (59 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, PRJ-001
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Project, Customer, Billing, Hours, Billed, Cost, Margin, Status
- **Permission checks in screen code**: projects.create

### `/projects/timesheets` Timesheets
- **Purpose (screen subtitle) [F]**: Log hours against projects; approved billable hours can be invoiced.
- **File**: `apps/web/app/(app)/projects/timesheets/page.tsx` (46 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, PRJ-001, PRJ-002
- **Structure**: 1 table(s), 6 form(s), 24 input(s), 11 select(s), 10 button(s)
- **Content [F]**: fields: From, To, Status, Project, Customer, Billing, Contract value (₹), Bill rate per hour (₹), Invoice as (service item), Budget cost (₹) (+4 more); columns: Date, Employee, Project, Task, Hours, Bill/h, Status; buttons: Show, Save project, Add task, Add, Add milestone, Log
- **Permission checks in screen code**: projects.approve, projects.create

### `/purchase/bills/[id]`
- **File**: `apps/web/app/(app)/purchase/bills/[id]/page.tsx` (31 lines + 3 component file(s)); server
- **Features it calls**: SEC-004, RPT-008, PUR-004, PUR-005
- **Structure**: 2 table(s), 2 form(s), 4 input(s), 0 select(s), 6 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling, Date, Reason; columns: Item, Qty, Rate, GST %, Taxable value; buttons: Post debit note
- **Permission checks in screen code**: purchase.cancel, purchase.create

### `/purchase/bills/new` Purchase bills
- **Purpose (screen subtitle) [F]**: Supplier invoices. Each one posts to purchases, input GST and the supplier's account.
- **File**: `apps/web/app/(app)/purchase/bills/new/page.tsx` (64 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, EXP-001, RPT-008, INV-004, INV-007, PUR-001 (+3 more)
- **Structure**: 2 table(s), 1 form(s), 12 input(s), 5 select(s), 3 button(s)
- **Content [F]**: fields: Supplier, Supplier invoice no., Supplier invoice date, Posting date, Due on, Date, Expected by, Narration, Qty, Unit (+4 more); columns: Item, Qty, Rate, GST %, Taxable value, Discount, Warehouse, Amount

### `/purchase/bills` Purchase bills
- **Purpose (screen subtitle) [F]**: Supplier invoices. Each one posts to purchases, input GST and the supplier's account.
- **File**: `apps/web/app/(app)/purchase/bills/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Supplier, Supplier invoice no., Status, Total
- **Permission checks in screen code**: purchase.create

### `/purchase/orders/[id]`
- **File**: `apps/web/app/(app)/purchase/orders/[id]/page.tsx` (29 lines + 3 component file(s)); server
- **Features it calls**: SEC-004, PUR-001
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 4 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling; columns: Item, Qty, Rate, GST %, Taxable value
- **Permission checks in screen code**: purchase.cancel, purchase.create, purchase.edit

### `/purchase/orders/new` Purchase orders
- **Purpose (screen subtitle) [F]**: What you've ordered from suppliers and how much has arrived.
- **File**: `apps/web/app/(app)/purchase/orders/new/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, EXP-001, RPT-008, INV-004, INV-007, PUR-001 (+2 more)
- **Structure**: 1 table(s), 1 form(s), 12 input(s), 5 select(s), 3 button(s)
- **Content [F]**: fields: Supplier, Supplier invoice no., Supplier invoice date, Posting date, Due on, Date, Expected by, Narration, Qty, Unit (+4 more); columns: Item, Qty, Rate, Discount, GST %, Warehouse, Amount

### `/purchase/orders` Purchase orders
- **Purpose (screen subtitle) [F]**: What you've ordered from suppliers and how much has arrived.
- **File**: `apps/web/app/(app)/purchase/orders/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Supplier, Supplier invoice no., Status, Total
- **Permission checks in screen code**: purchase.create

### `/purchase/receipts/[id]`
- **File**: `apps/web/app/(app)/purchase/receipts/[id]/page.tsx` (33 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, PUR-002
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling; columns: Item, Qty, Rate, GST %, Taxable value
- **Permission checks in screen code**: purchase.cancel, purchase.create

### `/purchase/receipts/new` Inward challans
- **Purpose (screen subtitle) [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later.
- **File**: `apps/web/app/(app)/purchase/receipts/new/page.tsx` (36 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SAL-001, SEC-013, INV-004, INV-007, INV-015, PUR-001 (+3 more)
- **Structure**: 3 table(s), 1 form(s), 15 input(s), 4 select(s), 3 button(s)
- **Content [F]**: fields: Date, Supplier challan no., Warehouse, Supplier, Transporter, LR no., LR date, Mark-up %, Round MRP to, Qty (+4 more); columns: Item, Qty, Rate, GST %, Taxable value, Cost, MRP, Mark-up, Margin, Short (+4 more); buttons: New inward challan

### `/purchase/receipts` Inward challans
- **Purpose (screen subtitle) [F]**: Goods that arrived (GRN). Stock goes up on receipt; the bill comes later.
- **File**: `apps/web/app/(app)/purchase/receipts/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Supplier, Supplier invoice no., Status, Total
- **Permission checks in screen code**: purchase.create

### `/purchase/receiving` Receiving and inspection
- **Purpose (screen subtitle) [F]**: Goods waiting to be passed, and what suppliers owe for goods that came short, damaged or went back.
- **File**: `apps/web/app/(app)/purchase/receiving/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, PUR-002, PUR-006
- **Structure**: 2 table(s), 0 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Pass, Reject, From, To; columns: Receipt, Item, On hold, Pass, Reject
- **Permission checks in screen code**: purchase.approve

### `/purchase/returns/[id]`
- **File**: `apps/web/app/(app)/purchase/returns/[id]/page.tsx` (16 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, PUR-005
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 3 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling; columns: Item, Qty, Rate, GST %, Taxable value
- **Permission checks in screen code**: purchase.cancel

### `/purchase/returns` Purchase returns
- **Purpose (screen subtitle) [F]**: Goods sent back to suppliers (debit notes).
- **File**: `apps/web/app/(app)/purchase/returns/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Supplier, Supplier invoice no., Status, Total
- **Permission checks in screen code**: purchase.create

### `/reports/balance-sheet`
- **File**: `apps/web/app/(app)/reports/balance-sheet/page.tsx` (97 lines + 1 component file(s)); server
- **Features it calls**: FIN-016
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports/books` Account books
- **Purpose (screen subtitle) [F]**: Cash and bank movements, a group month by month, what was spent from cash and bank, and where the money came from and went.
- **File**: `apps/web/app/(app)/reports/books/page.tsx` (161 lines + 1 component file(s)); server
- **Features it calls**: FIN-001, FIN-002, FIN-003, FIN-004, FIN-005, FIN-006, FIN-010, FIN-011 (+3 more)
- **Structure**: 8 table(s), 2 form(s), 23 input(s), 9 select(s), 4 button(s)
- **Content [F]**: fields: Search, Group, Account name, Opening balance, GSTIN, State, Phone, Bill to, City, PIN code (+4 more); columns: Account name, Group, GSTIN, Balance; buttons: Save, Cancel

### `/reports/builder` Report builder
- **Purpose (screen subtitle) [F]**: Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it emailed.
- **File**: `apps/web/app/(app)/reports/builder/page.tsx` (23 lines + 1 component file(s)); server, export
- **Features it calls**: RPT-005, RPT-006
- **Structure**: 1 table(s), 0 form(s), 8 input(s), 5 select(s), 4 button(s)
- **Content [F]**: fields: Data, Period, From, To, Move left, Move right, Hide this column, Email addresses, Report name, Email it (+4 more); buttons: Run, Download CSV, Email it now, Save report

### `/reports/cash-flow-statement` Cash flow
- **Purpose (screen subtitle) [F]**: Where the cash came from and where it went, from profit to the change in cash and bank.
- **File**: `apps/web/app/(app)/reports/cash-flow-statement/page.tsx` (58 lines + 1 component file(s)); server
- **Features it calls**: FIN-019
- **Structure**: 2 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports/cfo` Owner's view
- **Purpose (screen subtitle) [F]**: From sales to profit for the period, against the same period last year. Profit before and after tax are the same here unless your books record income tax.
- **File**: `apps/web/app/(app)/reports/cfo/page.tsx` (90 lines + 0 component file(s)); server
- **Features it calls**: FIN-008
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 1 select(s), 1 button(s)

### `/reports/checks` Checks
- **Purpose (screen subtitle) [F]**: Entries worth a second look before your CA sees them: cash limits under the Income-tax Act, possible duplicate bills, sales below cost, stock below zero.
- **File**: `apps/web/app/(app)/reports/checks/page.tsx` (52 lines + 0 component file(s)); server
- **Features it calls**: RPT-001
- **Structure**: 0 table(s), 1 form(s), 2 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: From, To; buttons: Show

### `/reports/colour-size`
- **File**: `apps/web/app/(app)/reports/colour-size/page.tsx` (29 lines + 1 component file(s)); server, export
- **Features it calls**: FIN-010, FIN-011, SEC-013, RPT-002, INV-004, INV-007
- **Structure**: 3 table(s), 1 form(s), 8 input(s), 6 select(s), 3 button(s)
- **Content [F]**: fields: Show, From, To, As of, Store, Brand, Category, Design no. or name, No photo, Dead after (+2 more); columns: Colour, Total, Item, Stock, Value, Last sold, Date, No., Customer; buttons: Excel

### `/reports/consignment-sales` Shop-in-shop sales
- **Purpose (screen subtitle) [F]**: Goods billed from consignment stock, grouped the way you ask.
- **File**: `apps/web/app/(app)/reports/consignment-sales/page.tsx` (44 lines + 0 component file(s)); server
- **Features it calls**: SAL-013
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 1 select(s), 0 button(s)

### `/reports/daily-sales` Daily sales
- **Purpose (screen subtitle) [F]**: One day of selling: sales net of returns, bills, what moved through cash and the bank, and the best sellers.
- **File**: `apps/web/app/(app)/reports/daily-sales/page.tsx` (61 lines + 0 component file(s)); server
- **Features it calls**: POS-007
- **Structure**: 2 table(s), 1 form(s), 1 input(s), 2 select(s), 1 button(s)

### `/reports/discounts` Discount register
- **Purpose (screen subtitle) [F]**: Every discounted line on invoices and counter bills in the period, and which items are discounted most.
- **File**: `apps/web/app/(app)/reports/discounts/page.tsx` (65 lines + 1 component file(s)); server
- **Features it calls**: POS-008
- **Structure**: 2 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports/integrity` Integrity check
- **Purpose (screen subtitle) [F]**: Do your books agree with themselves? Each check compares two things that must match and lists any difference with the records behind it.
- **File**: `apps/web/app/(app)/reports/integrity/page.tsx` (57 lines + 0 component file(s)); server
- **Features it calls**: FIN-007
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/reports/interest` Interest on overdue
- **Purpose (screen subtitle) [F]**: Simple interest on each bill for the days it is past due, at the customer's rate.
- **File**: `apps/web/app/(app)/reports/interest/page.tsx` (88 lines + 1 component file(s)); server
- **Features it calls**: SAL-019
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: Party, Rate, Overdue, Interest

### `/reports/ledger/[id]`
- **File**: `apps/web/app/(app)/reports/ledger/[id]/page.tsx` (78 lines + 1 component file(s)); server
- **Features it calls**: FIN-017
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: Date, Particulars, Number, Debit, Credit, Balance

### `/reports/msme` MSME payments
- **Purpose (screen subtitle) [F]**: What is owed to micro and small suppliers, bill by bill. A bill unpaid after {days} days of acceptance cannot be claimed as a cost until it is paid, and interest runs on it.
- **File**: `apps/web/app/(app)/reports/msme/page.tsx` (56 lines + 1 component file(s)); server
- **Features it calls**: TAX-012
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports`
- **File**: `apps/web/app/(app)/reports/page.tsx` (29 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/reports/payables`
- **File**: `apps/web/app/(app)/reports/payables/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SAL-030
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Party, Balance
- **Permission checks in screen code**: crm.create

### `/reports/profit-loss`
- **File**: `apps/web/app/(app)/reports/profit-loss/page.tsx` (136 lines + 1 component file(s)); server
- **Features it calls**: FIN-015
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: This period, Same period last year, Change

### `/reports/profitability` Profitability
- **Purpose (screen subtitle) [F]**: From gross sales to operating profit, with each figure marked as booked, estimated or shared out.
- **File**: `apps/web/app/(app)/reports/profitability/page.tsx` (61 lines + 1 component file(s)); server
- **Features it calls**: RPT-009
- **Structure**: 2 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports/receivables`
- **File**: `apps/web/app/(app)/reports/receivables/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SAL-030
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Party, Balance
- **Permission checks in screen code**: crm.create

### `/reports/registers` Registers and ratios
- **Purpose (screen subtitle) [F]**: Daily and monthly registers, this year against last, profit by design, brand or party, stock cover, vendors and what is still to come.
- **File**: `apps/web/app/(app)/reports/registers/page.tsx` (18 lines + 1 component file(s)); server
- **Features it calls**: RPT-010, RPT-011, RPT-012, RPT-013, RPT-014, RPT-015, RPT-016
- **Structure**: 1 table(s), 0 form(s), 3 input(s), 2 select(s), 0 button(s)
- **Content [F]**: tabs: sales, purchases, stock, years, versus, profit, ratios, vendors; fields: From, By, Group by, Days looked back

### `/reports/sales-order-register` Sales order register
- **Purpose (screen subtitle) [F]**: Sales orders still to be fulfilled, with what is pending and its value. Orders past their promised date come first.
- **File**: `apps/web/app/(app)/reports/sales-order-register/page.tsx` (53 lines + 1 component file(s)); server
- **Features it calls**: SAL-017
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports/sales-register`
- **File**: `apps/web/app/(app)/reports/sales-register/page.tsx` (28 lines + 2 component file(s)); server, export
- **Features it calls**: RPT-004
- **Structure**: 3 table(s), 2 form(s), 12 input(s), 6 select(s), 4 button(s)
- **Content [F]**: fields: Show, From, To, As of, Store, Brand, Category, Design no. or name, No photo, Dead after (+2 more); columns: Colour, Total, Item, Stock, Value, Last sold, Date, No., Customer; buttons: Excel

### `/reports/saved` Report builder
- **Purpose (screen subtitle) [F]**: Group and total sales, purchases, expenses, ledger entries or time any way you need; save it, or have it emailed.
- **File**: `apps/web/app/(app)/reports/saved/page.tsx` (43 lines + 1 component file(s)); server, export
- **Features it calls**: SEC-004, RPT-005, RPT-006
- **Structure**: 1 table(s), 0 form(s), 8 input(s), 5 select(s), 4 button(s)
- **Content [F]**: fields: Data, Period, From, To, Move left, Move right, Hide this column, Email addresses, Report name, Email it (+4 more); buttons: Run, Download CSV, Email it now, Save report
- **Permission checks in screen code**: reports.export

### `/reports/stock-ageing`
- **File**: `apps/web/app/(app)/reports/stock-ageing/page.tsx` (25 lines + 1 component file(s)); server, export
- **Features it calls**: RPT-003
- **Structure**: 3 table(s), 1 form(s), 8 input(s), 6 select(s), 3 button(s)
- **Content [F]**: fields: Show, From, To, As of, Store, Brand, Category, Design no. or name, No photo, Dead after (+2 more); columns: Colour, Total, Item, Stock, Value, Last sold, Date, No., Customer; buttons: Excel

### `/reports/stock-movement` Fast and slow movers
- **Purpose (screen subtitle) [F]**: What sold in the last {days} days. Fast means {fastMin} or more pieces; slow means some sold, fewer than that; non-moving means none. Non-moving stock is listed first.
- **File**: `apps/web/app/(app)/reports/stock-movement/page.tsx` (82 lines + 0 component file(s)); server
- **Features it calls**: FIN-009
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 1 select(s), 1 button(s)

### `/reports/stock-posting-check` Stock posting check
- **Purpose (screen subtitle) [F]**: Every sale should have taken exactly its pieces out of stock. This lists the ones that did not.
- **File**: `apps/web/app/(app)/reports/stock-posting-check/page.tsx` (30 lines + 0 component file(s)); server
- **Features it calls**: INV-026
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/reports/store-results` Store results
- **Purpose (screen subtitle) [F]**: Each store with its sales, gross margin and share of the expenses.
- **File**: `apps/web/app/(app)/reports/store-results/page.tsx` (24 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, FIN-027, FIN-028
- **Structure**: 1 table(s), 2 form(s), 3 input(s), 2 select(s), 3 button(s)
- **Content [F]**: fields: From, To, Expense, Spread by; columns: Store, Sales, Gross margin, Expenses, Result; buttons: Show, Save rule
- **Permission checks in screen code**: accounts.create

### `/reports/trial-balance`
- **File**: `apps/web/app/(app)/reports/trial-balance/page.tsx` (108 lines + 1 component file(s)); server
- **Features it calls**: FIN-014
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: Particulars, Debit, Credit, Same day last year, Change

### `/reports/user-activity` User activity
- **Purpose (screen subtitle) [F]**: Who signed in and what they made, changed and cancelled, from the audit trail.
- **File**: `apps/web/app/(app)/reports/user-activity/page.tsx` (62 lines + 1 component file(s)); server
- **Features it calls**: SEC-030
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 0 select(s), 1 button(s)

### `/reports/year-end` Year-end check
- **Purpose (screen subtitle) [F]**: What to settle before a financial year is closed and locked. Nothing here changes your books.
- **File**: `apps/web/app/(app)/reports/year-end/page.tsx` (96 lines + 0 component file(s)); server
- **Features it calls**: FIN-035, FIN-036
- **Structure**: 2 table(s), 1 form(s), 0 input(s), 1 select(s), 1 button(s)

### `/sales/approval-memos` Goods on approval
- **Purpose (screen subtitle) [F]**: Pieces a customer has taken to try or show. They stay on the books until billed or brought back.
- **File**: `apps/web/app/(app)/sales/approval-memos/page.tsx` (27 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, POS-004, SEC-004, SEC-013, INV-004, INV-007
- **Structure**: 2 table(s), 0 form(s), 5 input(s), 2 select(s), 6 button(s)
- **Content [F]**: fields: Store, Customer, Phone, Due back, Item, Pieces, Take back; columns: Memo, Customer, Store, Out, Value, Item, Rate, Take back
- **Permission checks in screen code**: sales.create, sales.edit

### `/sales/approvals` Goods on approval
- **Purpose (screen subtitle) [F]**: Approval memos with goods still with the customer. Take back what didn't sell; invoice the rest within six months.
- **File**: `apps/web/app/(app)/sales/approvals/page.tsx` (69 lines + 0 component file(s)); server
- **Features it calls**: SEC-004, SAL-023
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Still out, Value, Days out, Invoice by
- **Permission checks in screen code**: sales.create

### `/sales/commission-rules` Salesman commission rules
- **Purpose (screen subtitle) [F]**: Commission by item, brand, category or MRP range. For each sale the most specific matching rule decides the percentage.
- **File**: `apps/web/app/(app)/sales/commission-rules/page.tsx` (31 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, SAL-028
- **Structure**: 3 table(s), 2 form(s), 8 input(s), 2 select(s), 2 button(s)
- **Content [F]**: fields: Rule name, Applies to, Name, Item, MRP from, MRP up to, Commission %, Remove rule, Month, Sales by salesman; columns: Salesman, Sales (net of returns), Not covered by a rule, Commission, Helper, Days worked; buttons: Add rule, Show
- **Permission checks in screen code**: payroll.edit

### `/sales/commission` Brokers and agents
- **Purpose (screen subtitle) [F]**: Commission on money received from the customers each agent brought. Goods returned take it back.
- **File**: `apps/web/app/(app)/sales/commission/page.tsx` (30 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, SAL-007, SAL-008
- **Structure**: 3 table(s), 3 form(s), 7 input(s), 0 select(s), 7 button(s)
- **Content [F]**: fields: Date, TDS rate (%), Reason for cancelling; columns: Agent, Earned, Billed, Due, Invoice, Taxable value, Received, Number, Date, Commission (+2 more); buttons: Post bill, Cancel, Cancel bill
- **Permission checks in screen code**: accounts.create, accounts.view

### `/sales/consignment` Consignment and shop-in-shop
- **Purpose (screen subtitle) [F]**: Goods kept at other stores stay yours until they sell. Send stock, take it back, and bill what their sales report says was sold.
- **File**: `apps/web/app/(app)/sales/consignment/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, SAL-012, SAL-014, INV-004, INV-007
- **Structure**: 2 table(s), 0 form(s), 4 input(s), 2 select(s), 7 button(s)
- **Content [F]**: fields: Counted, Consignee, Date, Item, Qty, Agreed rate; columns: Consignee, With them, Value at cost, Sold, Ageing, Item, Sent, Taken back, Counted, Bill by; buttons: Cancel
- **Permission checks in screen code**: sales.create

### `/sales/credit-notes/[id]`
- **File**: `apps/web/app/(app)/sales/credit-notes/[id]/page.tsx` (24 lines + 3 component file(s)); server
- **Features it calls**: SEC-004, SAL-026
- **Structure**: 1 table(s), 2 form(s), 2 input(s), 1 select(s), 7 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling, Remark; columns: Item, Qty, Rate, GST %, Taxable value; buttons: Cancel IRN
- **Permission checks in screen code**: gst.cancel, gst.submit, sales.cancel

### `/sales/credit-notes` Credit notes
- **Purpose (screen subtitle) [F]**: Sales returns and price reductions after sale.
- **File**: `apps/web/app/(app)/sales/credit-notes/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Status, e-Invoice, Valid until, Reason
- **Permission checks in screen code**: sales.create

### `/sales/deliveries/[id]`
- **File**: `apps/web/app/(app)/sales/deliveries/[id]/page.tsx` (41 lines + 3 component file(s)); server
- **Features it calls**: SEC-004, SAL-022
- **Structure**: 2 table(s), 2 form(s), 3 input(s), 0 select(s), 6 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling, Date; columns: Item, Qty, Rate, GST %, Taxable value, Still out, Came back; buttons: Save return
- **Permission checks in screen code**: sales.cancel, sales.create

### `/sales/deliveries/new` Delivery challans
- **Purpose (screen subtitle) [F]**: Goods sent out before (or without) an invoice. Stock goes down on delivery.
- **File**: `apps/web/app/(app)/sales/deliveries/new/page.tsx` (42 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, SAL-015, INV-004, INV-007, SAL-021, SAL-022
- **Structure**: 2 table(s), 1 form(s), 6 input(s), 4 select(s), 3 button(s)
- **Content [F]**: fields: Customer, Warehouse, Date, Reason, Transporter, Vehicle no., Qty, Rate, Batch; columns: Item, Qty, Rate, GST %, Taxable value, Batch; buttons: New delivery challan

### `/sales/deliveries` Delivery challans
- **Purpose (screen subtitle) [F]**: Goods sent out before (or without) an invoice. Stock goes down on delivery.
- **File**: `apps/web/app/(app)/sales/deliveries/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Status, e-Invoice, Valid until, Reason
- **Permission checks in screen code**: sales.create

### `/sales/delivery-orders/[id]` Delivery orders
- **Purpose (screen subtitle) [F]**: Tell the warehouse what to send. No stock moves until a challan is made against the order.
- **File**: `apps/web/app/(app)/sales/delivery-orders/[id]/page.tsx` (89 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, SAL-015, INV-004, INV-007
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 2 button(s)
- **Permission checks in screen code**: sales.cancel, sales.create

### `/sales/delivery-orders/new` Delivery orders
- **Purpose (screen subtitle) [F]**: Tell the warehouse what to send. No stock moves until a challan is made against the order.
- **File**: `apps/web/app/(app)/sales/delivery-orders/new/page.tsx` (34 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-013, SAL-015, INV-004, INV-007, SAL-021
- **Structure**: 2 table(s), 1 form(s), 5 input(s), 2 select(s), 2 button(s)
- **Content [F]**: fields: Customer, Date, Deliver by, Transporter, Item, Quantity, Remove this line, Narration; columns: Item, Qty, Rate, GST %, Taxable value, Quantity

### `/sales/delivery-orders` Delivery orders
- **Purpose (screen subtitle) [F]**: Tell the warehouse what to send. No stock moves until a challan is made against the order.
- **File**: `apps/web/app/(app)/sales/delivery-orders/page.tsx` (66 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SAL-015
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Permission checks in screen code**: sales.create

### `/sales/inquiries` Inquiry log
- **Purpose (screen subtitle) [F]**: Questions asked at the counter that may turn into work, each with a day to follow up.
- **File**: `apps/web/app/(app)/sales/inquiries/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, POS-023
- **Structure**: 1 table(s), 1 form(s), 5 input(s), 1 select(s), 2 button(s)
- **Content [F]**: fields: Customer, Mobile, About, What they asked, Follow up on; columns: Customer, What they asked, Follow up on, Status; buttons: Add inquiry
- **Permission checks in screen code**: sales.create

### `/sales/invoices/[id]`
- **File**: `apps/web/app/(app)/sales/invoices/[id]/page.tsx` (53 lines + 6 component file(s)); server
- **Features it calls**: SEC-004, SAL-025, SAL-026
- **Structure**: 2 table(s), 4 form(s), 9 input(s), 1 select(s), 12 button(s)
- **Content [F]**: fields: Cancel, Reason for cancelling, Date, Reason, Remark, Mobile number; columns: Item, Qty, Rate, GST %, Taxable value, Credit per unit; buttons: Post credit note, Cancel IRN, Send
- **Permission checks in screen code**: gst.cancel, gst.submit, sales.cancel, sales.create

### `/sales/invoices/new` Sales invoices
- **Purpose (screen subtitle) [F]**: Tax invoices. Each one posts to sales, output GST and the customer's account.
- **File**: `apps/web/app/(app)/sales/invoices/new/page.tsx` (67 lines + 2 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SAL-005, SAL-006, SEC-013, INV-004, INV-007, SAL-018 (+3 more)
- **Structure**: 2 table(s), 1 form(s), 17 input(s), 9 select(s), 4 button(s)
- **Content [F]**: fields: Customer, Date, Place of supply, Due on, Valid until, Advance requested, Agent, Commission (%), Salesman, Rate basis (+4 more); columns: Item, Qty, Rate, GST %, Taxable value, Discount, Warehouse, Amount

### `/sales/invoices` Sales invoices
- **Purpose (screen subtitle) [F]**: Tax invoices. Each one posts to sales, output GST and the customer's account.
- **File**: `apps/web/app/(app)/sales/invoices/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Status, e-Invoice, Valid until, Reason
- **Permission checks in screen code**: sales.create

### `/sales/lr` LR and transport entry
- **Purpose (screen subtitle) [F]**: Goods sent through a transporter: the LR number, the invoice, freight, and whether it has reached the customer.
- **File**: `apps/web/app/(app)/sales/lr/page.tsx` (33 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, INV-012, SAL-025
- **Structure**: 1 table(s), 2 form(s), 8 input(s), 4 select(s), 2 button(s)
- **Content [F]**: fields: Date, Transporter, LR number, Invoice, Destination, Packages, Weight (kg), Freight, Who pays the freight, Status (+1 more); columns: Date, Transporter, LR number, Invoice, Packages, Freight, Status; buttons: Add consignment, Show
- **Permission checks in screen code**: sales.create, sales.edit

### `/sales/orders/[id]`
- **File**: `apps/web/app/(app)/sales/orders/[id]/page.tsx` (30 lines + 3 component file(s)); server
- **Features it calls**: SEC-004, SAL-021
- **Structure**: 1 table(s), 1 form(s), 1 input(s), 0 select(s), 4 button(s)
- **Content [F]**: fields: Close order, Cancel, Reason for cancelling; columns: Item, Qty, Rate, GST %, Taxable value
- **Permission checks in screen code**: sales.cancel, sales.create, sales.edit

### `/sales/orders/new` Sales orders
- **Purpose (screen subtitle) [F]**: What customers have ordered and how much has gone out.
- **File**: `apps/web/app/(app)/sales/orders/new/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SAL-005, SAL-006, SEC-013, INV-004, INV-007, SAL-018 (+1 more)
- **Structure**: 1 table(s), 1 form(s), 17 input(s), 9 select(s), 4 button(s)
- **Content [F]**: fields: Customer, Date, Place of supply, Due on, Valid until, Advance requested, Agent, Commission (%), Salesman, Rate basis (+4 more); columns: Item, Qty, Rate, Discount, GST %, Warehouse, Amount

### `/sales/orders` Sales orders
- **Purpose (screen subtitle) [F]**: What customers have ordered and how much has gone out.
- **File**: `apps/web/app/(app)/sales/orders/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Status, e-Invoice, Valid until, Reason
- **Permission checks in screen code**: sales.create

### `/sales/price-lists` Price lists
- **Purpose (screen subtitle) [F]**: Wholesale, distributor or retailer rates. A customer on a list gets its rates on new orders and invoices.
- **File**: `apps/web/app/(app)/sales/price-lists/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, SAL-018
- **Structure**: 2 table(s), 1 form(s), 4 input(s), 1 select(s), 4 button(s)
- **Content [F]**: fields: Name, Discount off sale rate (%), Item, Rate; columns: Name, Discount off sale rate (%), Fixed rates, Customers; buttons: Save, Cancel
- **Permission checks in screen code**: sales.edit

### `/sales/proformas/[id]`
- **File**: `apps/web/app/(app)/sales/proformas/[id]/page.tsx` (6 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SAL-020
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: fields: Cancel
- **Permission checks in screen code**: sales.cancel, sales.create, sales.edit

### `/sales/proformas/new` Proforma invoices
- **Purpose (screen subtitle) [F]**: Ask for payment or an advance before the goods go. No tax or stock effect until the invoice.
- **File**: `apps/web/app/(app)/sales/proformas/new/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SAL-005, SAL-006, SEC-013, INV-004, INV-007, SAL-018 (+1 more)
- **Structure**: 1 table(s), 1 form(s), 17 input(s), 9 select(s), 4 button(s)
- **Content [F]**: fields: Customer, Date, Place of supply, Due on, Valid until, Advance requested, Agent, Commission (%), Salesman, Rate basis (+4 more); columns: Item, Qty, Rate, Discount, GST %, Warehouse, Amount

### `/sales/proformas` Proforma invoices
- **Purpose (screen subtitle) [F]**: Ask for payment or an advance before the goods go. No tax or stock effect until the invoice.
- **File**: `apps/web/app/(app)/sales/proformas/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Status, e-Invoice, Valid until, Reason
- **Permission checks in screen code**: sales.create

### `/sales/quotations/[id]`
- **File**: `apps/web/app/(app)/sales/quotations/[id]/page.tsx` (6 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SAL-020
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: fields: Cancel
- **Permission checks in screen code**: sales.cancel, sales.create, sales.edit

### `/sales/quotations/new` Quotations
- **Purpose (screen subtitle) [F]**: Price quotes for customers. No stock or accounts effect until converted.
- **File**: `apps/web/app/(app)/sales/quotations/new/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SAL-005, SAL-006, SEC-013, INV-004, INV-007, SAL-018 (+1 more)
- **Structure**: 1 table(s), 1 form(s), 17 input(s), 9 select(s), 4 button(s)
- **Content [F]**: fields: Customer, Date, Place of supply, Due on, Valid until, Advance requested, Agent, Commission (%), Salesman, Rate basis (+4 more); columns: Item, Qty, Rate, Discount, GST %, Warehouse, Amount

### `/sales/quotations` Quotations
- **Purpose (screen subtitle) [F]**: Price quotes for customers. No stock or accounts effect until converted.
- **File**: `apps/web/app/(app)/sales/quotations/page.tsx` (12 lines + 1 component file(s)); server
- **Features it calls**: SEC-004
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Status, e-Invoice, Valid until, Reason
- **Permission checks in screen code**: sales.create

### `/sales/repairs` Service desk
- **Purpose (screen subtitle) [F]**: Repairs from intake to hand-back: diagnosis, estimate, approval, the bench and delivery. Deposits and charges are tracked here and are not posted to the books.
- **File**: `apps/web/app/(app)/sales/repairs/page.tsx` (28 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, POS-022
- **Structure**: 0 table(s), 2 form(s), 12 input(s), 1 select(s), 8 button(s)
- **Content [F]**: fields: Amount, GST (%), Reason, Customer, phone, item or number, Status, From a sale, Customer, Phone, Item, What is wrong (+2 more); buttons: Find, Fill in, Take in
- **Permission checks in screen code**: sales.create, sales.edit

### `/sales/samples` Samples out
- **Purpose (screen subtitle) [F]**: Samples sent to parties and not yet back. They are not a sale and carry no tax. Take back what is not kept.
- **File**: `apps/web/app/(app)/sales/samples/page.tsx` (66 lines + 0 component file(s)); server
- **Features it calls**: SEC-004, SAL-024
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Date, Number, Customer, Still out, Value, Days out
- **Permission checks in screen code**: sales.create

### `/sales/service-customers` Repair and tailoring customers
- **Purpose (screen subtitle) [F]**: What each customer paid up front and still sits with you, and what is left to collect on work that is ready.
- **File**: `apps/web/app/(app)/sales/service-customers/page.tsx` (33 lines + 0 component file(s)); server
- **Features it calls**: POS-024
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/sales/targets` Salesman targets
- **Purpose (screen subtitle) [F]**: Monthly targets with commission slabs, against each salesman's invoiced sales less returns.
- **File**: `apps/web/app/(app)/sales/targets/page.tsx` (32 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, SAL-006, SAL-009, SAL-010, SAL-011
- **Structure**: 1 table(s), 0 form(s), 2 input(s), 1 select(s), 7 button(s)
- **Content [F]**: fields: Previous month, Next month, Salesman, Target, Slabs; columns: Salesman, Target, Achieved, Of target, Rate, Commission; buttons: Copy last month, Save
- **Permission checks in screen code**: sales.approve

### `/settings/approvals` Approvals
- **Purpose (screen subtitle) [F]**: Changes that wait for a second person before they take effect.
- **File**: `apps/web/app/(app)/settings/approvals/page.tsx` (26 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-011, SEC-012
- **Structure**: 0 table(s), 0 form(s), 2 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Note
- **Permission checks in screen code**: settings.edit, special.approveBankChange

### `/settings/audit-log` Audit trail
- **Purpose (screen subtitle) [F]**: Every change, who made it and when. Entries can't be edited or deleted.
- **File**: `apps/web/app/(app)/settings/audit-log/page.tsx` (47 lines + 1 component file(s)); server
- **Features it calls**: SEC-017
- **Structure**: 1 table(s), 0 form(s), 1 input(s), 0 select(s), 2 button(s)
- **Content [F]**: fields: Saved copy to check (optional); buttons: Show latest hash to keep

### `/settings/backup` Backup and export
- **Purpose (screen subtitle) [F]**: Your data is yours. Download all of it, any time, in files you can open without Varchasv.
- **File**: `apps/web/app/(app)/settings/backup/page.tsx` (48 lines + 2 component file(s)); server, export, upload
- **Features it calls**: SEC-004, SEC-010, SEC-018
- **Structure**: 0 table(s), 2 form(s), 7 input(s), 3 select(s), 3 button(s)
- **Content [F]**: fields: Passphrase (at least 12 characters), How often, On, At (India time), Send to (separate with commas), Backup passphrase; buttons: Download locked backup, Save schedule
- **Permission checks in screen code**: company.export

### `/settings/company` Company & branches
- **Purpose (screen subtitle) [F]**: Legal details and one branch per GSTIN or location.
- **File**: `apps/web/app/(app)/settings/company/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-013
- **Structure**: 1 table(s), 2 form(s), 8 input(s), 1 select(s), 4 button(s)
- **Content [F]**: fields: Display name, Legal name, PAN, Books begin on, Branch name, State, GSTIN, City, PIN code; columns: Branch name, GSTIN, State, City; buttons: Add
- **Permission checks in screen code**: company.edit

### `/settings/controls` Internal controls
- **Purpose (screen subtitle) [F]**: Who can both do and approve, journals that look unusual, dealings with related parties, and a regular look at who has access.
- **File**: `apps/web/app/(app)/settings/controls/page.tsx` (22 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, SEC-019, SEC-020, INV-004, INV-007
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 1 select(s), 3 button(s)
- **Content [F]**: tabs: sod, journals, related, access; fields: Mark a customer or supplier as a related party
- **Permission checks in screen code**: accounts.edit, users.edit

### `/settings/dated-changes` Dated changes
- **Purpose (screen subtitle) [F]**: Set a GST rate, a price or credit terms to change on a chosen day. The old value stays until then, and what changed is kept here.
- **File**: `apps/web/app/(app)/settings/dated-changes/page.tsx` (34 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, SEC-016, INV-004, INV-007, SEC-023 (+1 more)
- **Structure**: 1 table(s), 1 form(s), 4 input(s), 3 select(s), 1 button(s)
- **Content [F]**: fields: Change for, Record, What changes, New value, Takes effect on, Note; buttons: Schedule change
- **Permission checks in screen code**: accounts.edit, inventory.edit, settings.edit, users.edit

### `/settings/devices` Devices and sync
- **Purpose (screen subtitle) [F]**: The phones and computers that work offline for this business, when each last synced, and anything the server refused.
- **File**: `apps/web/app/(app)/settings/devices/page.tsx` (23 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SYN-002, SYN-003, SYN-004
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Permission checks in screen code**: users.edit

### `/settings/expenses` Expense categories
- **Purpose (screen subtitle) [F]**: Which ledger each kind of expense goes to, limits, and whether GST credit is blocked (section 17(5)).
- **File**: `apps/web/app/(app)/settings/expenses/page.tsx` (22 lines + 1 component file(s)); server, upload
- **Features it calls**: SEC-004, EXP-001, EXP-002
- **Structure**: 0 table(s), 2 form(s), 22 input(s), 6 select(s), 12 button(s)
- **Content [F]**: fields: Employee, Date, Purpose, Project, Category, From, To, Kilometres, Days away, Amount (₹) (+4 more); buttons: Reject, Pay
- **Permission checks in screen code**: expenses.approve

### `/settings/financial-years` Financial years
- **Purpose (screen subtitle) [F]**: Lock a period once its books are final: for example after filing GST returns. Nobody can post or cancel entries on or before the lock date.
- **File**: `apps/web/app/(app)/settings/financial-years/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: FIN-013, SEC-004, SEC-015
- **Structure**: 1 table(s), 0 form(s), 1 input(s), 0 select(s), 2 button(s)
- **Content [F]**: columns: Year, Period, Locked up to
- **Permission checks in screen code**: accounts.approve

### `/settings/gst` GST & invoicing
- **File**: `apps/web/app/(app)/settings/gst/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, TAX-002
- **Structure**: 0 table(s), 1 form(s), 5 input(s), 1 select(s), 1 button(s)
- **Content [F]**: fields: Second language on prints, E-way bill needed above (₹), Bank details on invoices, Invoice terms & conditions; buttons: Save
- **Permission checks in screen code**: gst.edit

### `/settings/import` Import data
- **Purpose (screen subtitle) [F]**: Bring customers, suppliers and items across from a spreadsheet or from Tally.
- **File**: `apps/web/app/(app)/settings/import/page.tsx` (18 lines + 1 component file(s)); server, export, upload
- **Features it calls**: TAX-009
- **Structure**: 1 table(s), 0 form(s), 1 input(s), 0 select(s), 1 button(s)
- **Content [F]**: columns: Row, Account name, Result

### `/settings/inventory` Inventory settings
- **File**: `apps/web/app/(app)/settings/inventory/page.tsx` (21 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-005, INV-006, INV-007
- **Structure**: 0 table(s), 1 form(s), 2 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Warehouse name; buttons: Add warehouse
- **Permission checks in screen code**: inventory.approve, inventory.create

### `/settings/number-series` Number series
- **Purpose (screen subtitle) [F]**: How invoices and vouchers are numbered. GST allows at most 16 characters: letters, digits, - and /.
- **File**: `apps/web/app/(app)/settings/number-series/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-016
- **Structure**: 1 table(s), 0 form(s), 1 input(s), 0 select(s), 3 button(s)
- **Content [F]**: columns: Document, Pattern, Next number, Financial year
- **Permission checks in screen code**: settings.edit

### `/settings/payroll` Payroll settings
- **Purpose (screen subtitle) [F]**: Registration codes, weekly offs and state levies.
- **File**: `apps/web/app/(app)/settings/payroll/page.tsx` (24 lines + 2 component file(s)); server
- **Features it calls**: SEC-004, HR-007, HR-016
- **Structure**: 1 table(s), 1 form(s), 11 input(s), 1 select(s), 3 button(s)
- **Content [F]**: fields: TAN (tax deduction account number), EPF establishment code, ESI employer code, Employee share (₹), Employer share (₹), Leave encashment per day, Shift, Starts, Ends, Default; buttons: Save
- **Permission checks in screen code**: hr.edit, payroll.edit

### `/settings/pos` Counter settings
- **Purpose (screen subtitle) [F]**: Pricing, loyalty points, discount limits and counters.
- **File**: `apps/web/app/(app)/settings/pos/page.tsx` (33 lines + 3 component file(s)); server, keys F10/F2/F3/F4/F5/F6/F7/F8/F9, kbd
- **Features it calls**: FIN-010, FIN-011, SEC-004, POS-006, SAL-001, SEC-013, INV-004, INV-007 (+9 more)
- **Structure**: 2 table(s), 4 form(s), 39 input(s), 8 select(s), 17 button(s)
- **Content [F]**: fields: Counter, Cash counted (₹), Opening cash (₹), Salesman for the bill, Helper, Who is it for? (optional), Scan barcode or search items, Serial numbers, one for each piece, Qty, Rate (+4 more); columns: Item, Qty, Rate, Disc ₹, Salesman, Amount; buttons: Close shift, Open shift, Hold, Complete bill, Save
- **Permission checks in screen code**: sales.edit, users.view

### `/settings/process-locks` Lock by document kind
- **Purpose (screen subtitle) [F]**: Close one kind of document up to a date without locking the whole period.
- **File**: `apps/web/app/(app)/settings/process-locks/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-004, SEC-022
- **Structure**: 1 table(s), 0 form(s), 1 input(s), 0 select(s), 2 button(s)
- **Content [F]**: columns: Document kind, Locked up to
- **Permission checks in screen code**: settings.edit

### `/settings/sensitive-changes` Sensitive changes
- **Purpose (screen subtitle) [F]**: Changes that can move money or open a door: bank details, credit terms, tax settings, who may do what, period locks and payroll settings. Newest first.
- **File**: `apps/web/app/(app)/settings/sensitive-changes/page.tsx` (67 lines + 0 component file(s)); server
- **Features it calls**: SEC-017
- **Structure**: 1 table(s), 1 form(s), 2 input(s), 1 select(s), 1 button(s)

### `/settings/team` Team & roles
- **Purpose (screen subtitle) [F]**: Who can use this business and what each person can do.
- **File**: `apps/web/app/(app)/settings/team/page.tsx` (25 lines + 1 component file(s)); server
- **Features it calls**: FIN-010, FIN-011, SEC-004, SEC-013, INV-004, INV-007, SEC-024, SEC-025 (+1 more)
- **Structure**: 2 table(s), 2 form(s), 5 input(s), 2 select(s), 12 button(s)
- **Content [F]**: fields: Email, Role, Role name; columns: Your name, Role, Status; buttons: Invite, Save, Cancel
- **Permission checks in screen code**: users.create, users.delete, users.edit


## Layout group `auth` (5 screens)

### `/forgot-password`
- **File**: `apps/web/app/(auth)/forgot-password/page.tsx` (49 lines + 0 component file(s)); client
- **Features it calls**: SEC-009
- **Structure**: 0 table(s), 1 form(s), 1 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Email; buttons: Send reset link

### `/invite/[token]` Join {business}
- **Purpose (screen subtitle) [F]**: {email} has been invited as {role}.
- **File**: `apps/web/app/(auth)/invite/[token]/page.tsx` (20 lines + 1 component file(s)); server
- **Features it calls**: SEC-025
- **Structure**: 0 table(s), 1 form(s), 2 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Your name, Password; buttons: Accept invitation

### `/login`
- **File**: `apps/web/app/(auth)/login/page.tsx` (53 lines + 0 component file(s)); client
- **Features it calls**: SEC-002
- **Structure**: 0 table(s), 1 form(s), 1 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: Email, Password; buttons: Sign in

### `/reset-password/[token]`
- **File**: `apps/web/app/(auth)/reset-password/[token]/page.tsx` (18 lines + 1 component file(s)); server
- **Features it calls**: SEC-009
- **Structure**: 0 table(s), 1 form(s), 2 input(s), 0 select(s), 1 button(s)
- **Content [F]**: fields: New password, Repeat new password; buttons: Set password

### `/signup`
- **File**: `apps/web/app/(auth)/signup/page.tsx` (103 lines + 0 component file(s)); client
- **Features it calls**: SEC-001
- **Structure**: 0 table(s), 1 form(s), 4 input(s), 2 select(s), 1 button(s)
- **Content [F]**: fields: Your name, Email, Password, Business name, State, Type of business; buttons: Create account


## Layout group `print` (18 screens)

### `/print/box-label/[id]`
- **File**: `apps/web/app/(print)/print/box-label/[id]/page.tsx` (41 lines + 1 component file(s)); server, print
- **Features it calls**: SAL-025
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/catalogue/[id]`
- **File**: `apps/web/app/(print)/print/catalogue/[id]/page.tsx` (25 lines + 3 component file(s)); server, print, export
- **Features it calls**: SAL-003, SAL-021
- **Structure**: 0 table(s), 0 form(s), 5 input(s), 1 select(s), 7 button(s)
- **Content [F]**: fields: Link works for, Link, WhatsApp number; buttons: Export to Excel

### `/print/challan/[id]`
- **File**: `apps/web/app/(print)/print/challan/[id]/page.tsx` (13 lines + 1 component file(s)); server, print
- **Features it calls**: SAL-022
- **Structure**: 3 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/cheque/[id]`
- **File**: `apps/web/app/(print)/print/cheque/[id]/page.tsx` (48 lines + 1 component file(s)); server, print
- **Features it calls**: FIN-012
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/count-sheet/[id]` Count sheet
- **File**: `apps/web/app/(print)/print/count-sheet/[id]/page.tsx` (41 lines + 1 component file(s)); server, print
- **Features it calls**: INV-022
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/envelope/[id]`
- **File**: `apps/web/app/(print)/print/envelope/[id]/page.tsx` (31 lines + 1 component file(s)); server, print
- **Features it calls**: FIN-010, FIN-011
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/eway-bill/[id]` E-way bill
- **File**: `apps/web/app/(print)/print/eway-bill/[id]/page.tsx` (130 lines + 2 component file(s)); server, print
- **Features it calls**: SAL-025
- **Structure**: 9 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/form16/[id]`
- **File**: `apps/web/app/(print)/print/form16/[id]/page.tsx` (112 lines + 1 component file(s)); server, print
- **Features it calls**: TAX-003, HR-001
- **Structure**: 3 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/invoice/[id]`
- **File**: `apps/web/app/(print)/print/invoice/[id]/page.tsx` (12 lines + 1 component file(s)); server, print
- **Features it calls**: SAL-025
- **Structure**: 4 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/labels`
- **File**: `apps/web/app/(print)/print/labels/page.tsx` (24 lines + 1 component file(s)); client, print
- **Features it calls**: -
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/packing-slip/[id]` Packing slip
- **File**: `apps/web/app/(print)/print/packing-slip/[id]/page.tsx` (48 lines + 1 component file(s)); server, print
- **Features it calls**: SAL-025
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/parcel-labels/[id]`
- **File**: `apps/web/app/(print)/print/parcel-labels/[id]/page.tsx` (39 lines + 1 component file(s)); server, print
- **Features it calls**: SAL-025
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/payslip/[id]`
- **File**: `apps/web/app/(print)/print/payslip/[id]/page.tsx` (117 lines + 1 component file(s)); server, print
- **Features it calls**: TAX-003, HR-009
- **Structure**: 5 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/quotation/[id]`
- **File**: `apps/web/app/(print)/print/quotation/[id]/page.tsx` (12 lines + 1 component file(s)); server, print
- **Features it calls**: SAL-020
- **Structure**: 4 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/receipt/[id]`
- **File**: `apps/web/app/(print)/print/receipt/[id]/page.tsx` (12 lines + 1 component file(s)); server, print
- **Features it calls**: POS-015
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Taxable

### `/print/tds-certificate` Certificate of tax deducted at source
- **File**: `apps/web/app/(print)/print/tds-certificate/page.tsx` (55 lines + 1 component file(s)); server, print
- **Features it calls**: TAX-019
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/transfer-slip/[id]` Transfer slip
- **File**: `apps/web/app/(print)/print/transfer-slip/[id]/page.tsx` (35 lines + 1 component file(s)); server, print
- **Features it calls**: INV-030
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/print/vouchers` Vouchers
- **File**: `apps/web/app/(print)/print/vouchers/page.tsx` (47 lines + 1 component file(s)); server, print
- **Features it calls**: FIN-012
- **Structure**: 1 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)


## Layout group `public` (3 screens)

### `/b/[token]`
- **File**: `apps/web/app/b/[token]/page.tsx` (98 lines + 3 component file(s)); server, print
- **Features it calls**: SAL-032
- **Structure**: 6 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)
- **Content [F]**: columns: Taxable

### `/c/[token]` Image catalogue
- **Purpose (screen subtitle) [F]**: Every design and colour with its photo, rate, stock and sales. Pick designs for a party, then print, export or share them.
- **File**: `apps/web/app/c/[token]/page.tsx` (37 lines + 1 component file(s)); server
- **Features it calls**: SAL-004
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)

### `/`
- **File**: `apps/web/app/page.tsx` (6 lines + 0 component file(s)); server
- **Features it calls**: -
- **Structure**: 0 table(s), 0 form(s), 0 input(s), 0 select(s), 0 button(s)


## Print pages [F]

| Route pattern | File |
|---|---|
| /print/box-label/[id] | `apps/web/app/(print)/print/box-label/[id]/page.tsx` |
| /print/catalogue/[id] | `apps/web/app/(print)/print/catalogue/[id]/page.tsx` |
| /print/challan/[id] | `apps/web/app/(print)/print/challan/[id]/page.tsx` |
| /print/cheque/[id] | `apps/web/app/(print)/print/cheque/[id]/page.tsx` |
| /print/count-sheet/[id] | `apps/web/app/(print)/print/count-sheet/[id]/page.tsx` |
| /print/envelope/[id] | `apps/web/app/(print)/print/envelope/[id]/page.tsx` |
| /print/eway-bill/[id] | `apps/web/app/(print)/print/eway-bill/[id]/page.tsx` |
| /print/form16/[id] | `apps/web/app/(print)/print/form16/[id]/page.tsx` |
| /print/invoice/[id] | `apps/web/app/(print)/print/invoice/[id]/page.tsx` |
| /print/labels | `apps/web/app/(print)/print/labels/page.tsx` |
| /print/packing-slip/[id] | `apps/web/app/(print)/print/packing-slip/[id]/page.tsx` |
| /print/parcel-labels/[id] | `apps/web/app/(print)/print/parcel-labels/[id]/page.tsx` |
| /print/payslip/[id] | `apps/web/app/(print)/print/payslip/[id]/page.tsx` |
| /print/quotation/[id] | `apps/web/app/(print)/print/quotation/[id]/page.tsx` |
| /print/receipt/[id] | `apps/web/app/(print)/print/receipt/[id]/page.tsx` |
| /print/tds-certificate | `apps/web/app/(print)/print/tds-certificate/page.tsx` |
| /print/transfer-slip/[id] | `apps/web/app/(print)/print/transfer-slip/[id]/page.tsx` |
| /print/vouchers | `apps/web/app/(print)/print/vouchers/page.tsx` |


## Device app (Flutter) screens [F]

| File | Lines | Widgets |
|---|---|---|
| `apps/varchasv/lib/ui/accounts_screen.dart` | 143 | AccountsScreen |
| `apps/varchasv/lib/ui/audit_screen.dart` | 158 | AuditScreen |
| `apps/varchasv/lib/ui/cash_entry_screen.dart` | 119 | CashEntryScreen |
| `apps/varchasv/lib/ui/conflicts_screen.dart` | 126 | ConflictsScreen |
| `apps/varchasv/lib/ui/connect_screen.dart` | 94 | ConnectScreen |
| `apps/varchasv/lib/ui/customers_screen.dart` | 80 | CustomersScreen |
| `apps/varchasv/lib/ui/errors.dart` | 52 |  |
| `apps/varchasv/lib/ui/field_screen.dart` | 243 | FieldScreen, _OrderTab, _ClaimTab |
| `apps/varchasv/lib/ui/format.dart` | 31 |  |
| `apps/varchasv/lib/ui/gst_calculator.dart` | 102 | GstCalculatorCard |
| `apps/varchasv/lib/ui/home.dart` | 116 | HomeShell |
| `apps/varchasv/lib/ui/hr_screen.dart` | 380 | HrScreen, _AttendanceTab, _EmployeesTab, _PayslipsPage (+2 more) |
| `apps/varchasv/lib/ui/overview_screen.dart` | 198 | OverviewScreen |
| `apps/varchasv/lib/ui/photo.dart` | 13 |  |
| `apps/varchasv/lib/ui/pos_screen.dart` | 437 | PosScreen, _BillingTab, _BillsTab |
| `apps/varchasv/lib/ui/reports_screen.dart` | 90 | ReportsScreen |
| `apps/varchasv/lib/ui/sync_screen.dart` | 108 | SyncScreen |
| `apps/varchasv/lib/ui/theme.dart` | 27 |  |
| `apps/varchasv/lib/ui/token_screen.dart` | 81 | TokenScreen |
| `apps/varchasv/lib/ui/tools_screen.dart` | 53 | ToolsScreen |
| `apps/varchasv/lib/ui/voucher_form.dart` | 176 | VoucherFormScreen |
| `apps/varchasv/lib/ui/vouchers_screen.dart` | 160 | VouchersScreen, _VoucherTile, VoucherDetail |

Role home screens come from `apps/varchasv/lib/domain/role_home.dart` (cashier, manager, warehouse, buyer, accountant, owner); sections shown depend on the signed-in person's permissions (plan item R14).


## Menu tiles with no screen ("Soon") [F]

| Section | Group | Tile | Permission |
|---|---|---|---|
| Masters | Stock | Fixed Barcode | - |
| Masters | Parameters | Ledger Parameter | - |
| Masters | Parameters | TCS Tax Master | - |
| Transaction | Other Transaction | RePacking Box | - |
| Transaction | Other Transaction | ReOpen Box | - |
| Account Reports | Final Report Group | TCS Report | - |
| Payroll | Master Group | Salary Deduction | - |
| Payroll | Master Group | Week Off | - |
| Payroll | Master Group | Week Off Cancel | - |
| Payroll | Payroll Transaction Group | Stipend | - |
| Payroll | Payroll Transaction Group | Incentive | - |
| Payroll | Payroll Transaction Group | Other Deduction | - |
| Payroll | Report Group | Menu Log Session Report | - |
| Utility | Extra Utility | Out Standing Adj | - |
| Utility | Extra Utility | Sales Stock Ledger Diff | - |
| Utility | Extra Utility | Note Report | - |
| Utility | User Management | Current Date Setting | - |
| Utility | Software Utility | Ledger And Stock Posting | - |
| Utility | Software Utility | Report Type | - |
| Utility | Software Utility | Software Update | - |
| Utility | Software Utility | DB Updates | - |
| Utility | Software Utility | Schedule Backup | - |
| Utility | Software Utility | Export Vouchers to PDF | - |


## Screens that no menu tile links to [F]

20 static screens in the app layout are not the target of any menu tile (they are reached from other screens, a tab, or a button): `/assets/new`, `/banking/rules`, `/crm/leads/new`, `/expenses/new`, `/hr/employees/new`, `/inventory/transfers/new`, `/manufacturing/boms/new`, `/manufacturing/orders/new`, `/masters`, `/my-menu`, `/projects/new`, `/purchase/bills/new`, `/purchase/orders/new`, `/purchase/receipts/new`, `/reports/cash-flow-statement`, `/sales/delivery-orders/new`, `/sales/invoices/new`, `/sales/orders/new`, `/sales/proformas/new`, `/sales/quotations/new`
