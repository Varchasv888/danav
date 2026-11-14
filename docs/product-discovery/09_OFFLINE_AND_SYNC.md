# 09 Offline and sync

Sources: `packages/domain/src/offline.ts`, `apps/api/src/routes/sync.ts`, `apps/varchasv/lib` (data, sync, domain), `packages/db` migrations (`sync_changes`, `sync_horizon`, `record_sync_change`) and `apps/api/src/integrations`. Facts unless marked.

## A. The offline rule table [F]

Every action is declared in `OFFLINE_ACTIONS` as `allowed` (done on the device and sent later; the server checks again and applies once), `read_only` (the device shows its last copy) or `online_only` (the device refuses it offline instead of guessing). The Dart copy (`lib/domain/offline.dart`) and a shared fixture (`spec/fixtures/offline_rules.json`) are tested against the TypeScript table, and a test asserts every sync operation kind in `routes/sync.ts` is declared `allowed`.

| Action | Mode | Note |
|---|---|---|
| `account.upsert` | allowed | Add or edit a customer or supplier. |
| `voucher.create` | allowed | Receipts, payments, journals and contras. |
| `voucher.cancel` | allowed | Cancel a voucher; the server reverses it once. |
| `attendance.mark` | allowed | Mark attendance. |
| `leave.request` | allowed | Ask for leave. |
| `pos.bill` | allowed | Counter bills, with the numbers the device was given. |
| `expense.claim` | allowed | Submit an expense claim. |
| `sales.order` | allowed | Take a sales order. |
| `stock.count` | allowed | Count stock by scanning, as a spot check. |
| `masters.items` | read_only | Items, prices and stock as of the last sync. |
| `masters.parties` | read_only | Customers and their balances as of the last sync. |
| `pos.coupon` | online_only | Discount cards and coupons are checked against the server. |
| `pos.giftVoucher` | online_only | Gift voucher balances must be checked and spent on the server. |
| `gst.einvoice` | online_only | E-invoice and e-way bill calls go to the tax portal. |
| `team.admin` | online_only | Inviting people and changing roles. |
| `settings.locks` | online_only | Period locks and numbering. |
| `settings.backup` | online_only | Exporting or restoring the business's data. |

## B. Operations the device can queue [F]

| Kind | What it does | Server schema (`routes/sync.ts`) | Handled by device code |
|---|---|---|---|
| `account.upsert` | Add or edit a customer or supplier | yes | yes |
| `voucher.create` | Receipt, payment, journal, contra | yes | yes |
| `voucher.cancel` | Cancel a voucher (server reverses once) | yes | yes |
| `attendance.mark` | Mark attendance | yes | yes |
| `leave.request` | Ask for leave | yes | yes |
| `pos.bill` | Counter bill with device-allocated numbers | yes | yes |
| `expense.claim` | Submit an expense claim | yes | yes |
| `sales.order` | Take a sales order | yes | yes |
| `stock.count` | Scan-count stock as a spot check | yes | yes |

## C. Protocol [F unless marked]

- **Enrol**: `POST /devices` registers a device; `GET /devices` lists them with last sync; `POST /devices/:id/revoke` removes one (step-up). Screen: `/settings/devices`.
- **Push**: `POST /sync/push` takes an ordered list of operations `{opId (uuid), kind, payload}`. `opId` is the idempotency key: the same operation sent twice is applied once. A permanent failure parks the operation (`_permanent` in `lib/sync/sync_service.dart` treats anything other than internal, offline or error codes as permanent) and the server keeps it in `sync_rejections` (`keepRejection` in `routes/sync.ts`). Screens: `/settings/devices` (server side) and the device's conflicts screen (`lib/ui/conflicts_screen.dart`).
- **Pull**: `GET /sync/pull` returns rows changed after the device's cursor. The cursor is a transaction id; `sync_changes` (insert only) is filled by triggers on 16 tables (`companies, branches, fiscal_years, account_groups, accounts, vouchers, items, warehouses, employees, leave_types, leave_requests, payroll_runs, attendance, pos_terminals, pos_bills, branch_prices`); `sync_horizon()` bounds what is kept. Whether a store-scoped member's pull is cut to their stores is not established (no reference in `routes/sync.ts`; file 13, Q-31).
- **Status**: `GET /sync/status` and `GET /sync/rejections`; `GET /sync/offline-rules` serves the rule table to the app.
- **Order**: the device pushes its outbox in order, then pulls (`SyncService`: "two-step sync").
- **Numbers**: the device is given its own number ranges (`DeviceSeries` local table) so offline bills do not collide with server numbering.

## D. Device storage [F]

Local tables (20, drift): `Meta`, `Companies`, `FiscalYears`, `AccountGroups`, `Accounts`, `Vouchers`, `VoucherLines`, `DeviceSeries`, `Outbox`, `Employees`, `LeaveTypes`, `LeaveRequests`, `AttendanceDays`, `Payslips`, `PosItems`, `PosTerminals`, `PosBills`, `ExpenseCategories`, `LocalClaims`, `FieldOrders`. The database is opened with SQLCipher (`lib/data/secure_db.dart`), the key lives in secure storage (`lib/data/device_key.dart`). A test checks the key is not stored in the clear. Audit, customers, reports, cash entry and token flows have their own data files in `lib/data`.

What the device can read offline (declared `read_only`): items with prices and stock, customers and balances, each as of the last sync. Reports on the device (`lib/data/reports.dart`) run on the local copy [I: from file name; confirm].

## E. Web app offline behaviour [F]

No service worker or web manifest was found in `apps/web` (searched for `serviceWorker`, `manifest.webmanifest`, `next-pwa`). The web app therefore needs a connection; offline working is delivered by the Flutter device app only. [F: negative search]

## F. Conflict handling [F/I]

- No merge of edits: an operation is applied or refused. Refused operations are shown with the reason and offered for edit-and-resend (plan S7, `conflicts.dart` + test).
- Cancelling twice is refused; the same counter bill sent twice makes one bill (invariant test).
- Edits made to the same master on two devices: last applied wins by arrival order [I: no version check found on `account.upsert`; confirm in file 13].

## G. Server background work [F]

There is no job queue library. Background work is: (1) an in-process interval of 60 seconds in `apps/api/src/server.ts` that runs scheduled reports, scheduled changes, scheduled backups, comm reminders and consignee emails; (2) cron endpoints under `/cron/*` guarded by `CRON_SECRET` so an outside scheduler can call the same work; (3) SECURITY DEFINER database functions that list which businesses have work due (`due_saved_reports`, `due_backups`, `due_scheduled_changes`, `due_comm_tenants`, `due_consignee_tenants`, `comm_reminder_tenants`). Cron routes:

| Method | Path | Line |
|---|---|---|
| GET | `/cron/reports` | apps/api/src/routes/cron.ts:21 |
| GET | `/cron/backups` | apps/api/src/routes/cron.ts:25 |
| GET | `/cron/comms` | apps/api/src/routes/cron.ts:29 |
| GET | `/cron/reminders` | apps/api/src/routes/cron.ts:33 |
| GET | `/cron/statements` | apps/api/src/routes/cron.ts:37 |
| GET | `/cron/changes` | apps/api/src/routes/cron.ts:41 |
| GET | `/cron/audit-seal` | apps/api/src/routes/cron.ts:45 |

Plan item N2 (background-job dashboard, queue lag alerts, correlation IDs) is not built (file 10).

## H. External connectors (adapters) [F]

| File | Demo or simulator | Real implementation | Env switches | Purpose (source comment) |
|---|---|---|---|---|
| `integrations/bankfeed.ts` | SimulatorFeed | none | - | Bank feed adapter. In India a business's bank transactions are shared through the RBI's Account Aggregator framework: the business approves a consent in its AA app, and the FIU (us |
| `integrations/channels.ts` | DemoSender | none | - | SMS and push behind one small interface. No paid provider is wired in: the demo senders record what would go out and report it sent, so every flow can be tried end to end, and a re |
| `integrations/gsp.ts` | SimulatorGsp | none | - | GST Suvidha Provider (GSP) adapter: e-invoice (IRP), e-way bill (NIC) and GST returns (GSTN).  * `SimulatorGsp` follows the real rules so the whole flow works end to end before a G |
| `integrations/messaging.ts` | DemoMessenger | WhatsAppCloud | `WHATSAPP_PHONE_ID`, `WHATSAPP_TOKEN` | Sending WhatsApp messages. With WHATSAPP_TOKEN and WHATSAPP_PHONE_ID set, messages go through Meta's WhatsApp Cloud API: as an approved template when the template has a provider na |
| `integrations/receipts.ts` | DemoReceiptReader | ClaudeReceiptReader | `ANTHROPIC_API_KEY`, `RECEIPT_MODEL` | Reads a bill or receipt photo/PDF: for an expense claim (vendor, GSTIN, invoice number, date, total, GST rate) or for a purchase bill (also its lines). With ANTHROPIC_API_KEY set,  |

Environment variables read by the API: `ANTHROPIC_API_KEY`, `APP_DATABASE_URL`, `ASSISTANT_MODEL`, `DATABASE_URL`, `RECEIPT_MODEL`, `SMS_WEBHOOK_SECRET`, `WHATSAPP_APP_SECRET`, `WHATSAPP_PHONE_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_VERIFY_TOKEN`. `DATABASE_URL`/`APP_DATABASE_URL` select the database roles; the rest switch connectors. Variables read elsewhere (`CRON_SECRET`, `JWT`-style secrets, mail) are in `apps/api/src/env.ts`; the extraction above covers `process.env.X` uses only. [F]

**What is needed to make each connector real** (from code comments and the architecture discussion; [I] for effort): GST: a GSP account and sandbox keys behind `Gsp` (e-invoice IRP, e-way bill NIC, GSTN returns); bank feed: an Account Aggregator FIU relationship behind `bankfeed`; SMS/push: a DLT-registered sender behind `channels`; WhatsApp: Meta Business verification, approved templates (the code already supports Cloud API with the two env vars and signature checks); receipt reading: `ANTHROPIC_API_KEY` (already supported); payment gateway: not present in code (only settlement import).
