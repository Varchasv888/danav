# 13 Open questions

Questions the repository cannot answer. Each states why it matters and what the code shows today. Numbered `Q-NN`; none of them has been guessed in the other documents.

| ID | Area | Question | Why it matters | What the repository shows |
|---|---|---|---|---|
| Q-01 | Product | Who is the first paying customer and what do they sell? | Prioritises Phase C (manufacturing) against Phase M (merchandising) against counter hardening; the plan serves apparel, footwear, retail and wholesale equally. | Plan header only |
| Q-02 | Product | How many counters and branches does the first customer run, and how many users sign in at once? | Sets the architecture answer (single Postgres vs edge gateway) and the performance targets. | Architecture proposals discussed in chat; not decided |
| Q-03 | Architecture | Is 'Cloudflare only, no separately hosted database' a hard rule? | D1 has no row level security or the SQL features the ledger uses; the recommendation was to keep Postgres and move storage and queues to Cloudflare in stages. | Awaiting answer |
| Q-04 | Compliance | Which GST Suvidha Provider (or direct IRP/NIC access) will be used, and who holds the credentials? | Replaces the simulator; decides data residency of filings. | `integrations/gsp.ts` simulator only |
| Q-05 | Compliance | Is the product expected to file returns, or only prepare them? | Changes the amount of approval and audit work needed before 'file' is real. | `/gst/filings` is a demo |
| Q-06 | Integrations | Which WhatsApp provider (Meta Cloud direct or a business solution provider) and which SMS DLT sender? | Cloud client exists; DLT sender does not. | `messaging.ts`, `channels.ts` |
| Q-07 | Integrations | Which payment gateway for customer collections? | No collection code exists; only settlement import from Razorpay, PhonePe, Paytm. | `gateway_settlements` |
| Q-08 | Integrations | Account Aggregator route or statement-file import only for banking? | Bank feed is a simulator. | `integrations/bankfeed.ts` |
| Q-09 | Hardware | Which barcode printers, label sizes, receipt printers and scanners must be supported at launch? | Label presets were changed on 4 Nov; no printer driver or raw-print path exists in the repo (browser print only) [I]. | `/print/labels` |
| Q-10 | Hardware | Which attendance machines beyond the ZKTeco ADMS protocol? | Only that protocol is implemented. | `routes/iclock.ts` |
| Q-11 | Data | Is migration from Tally and G-Retail needed on day one, and which G-Retail exports exist? | Tally import exists (`/import/tally`); G-Retail import does not. | `services/importer.ts` |
| Q-12 | Data | Should stock value post to the ledger (perpetual inventory)? | The books do not post stock to the ledger today; integrity cannot compare stock value. | Plan S2 |
| Q-13 | Security | Why do `users`, `sessions` and `password_resets` have no row level security, given `sessions` carries a tenant column? | Extraction flagged them as the only schema tables without RLS; likely intended because they are read before a tenant is known. | Migrations scanned in file 06 |
| Q-31 | Security | Is a store-scoped member's device pull limited to their stores? | `storeScopeGuard` checks store keys in requests; `routes/sync.ts` has no `warehouseScope` reference, so `GET /sync/pull` may return other stores' items, stock or bills. | `plugins/storescope.ts`, `routes/sync.ts` |
| Q-14 | Security | Should branch-level and account-group-level permission scope be built before the first multi-branch customer? | Only store scope exists (R19 'Left'). | `plugins/storescope.ts` |
| Q-15 | Security | What is the retention and deletion policy for the audit chain, backups and personal data (employee KYC documents, customer phone numbers)? | Audit is append-only; employee documents hold identity numbers. No retention rule found. | `audit_log`, `employee_documents` |
| Q-16 | Offline | How should edits of the same master on two devices resolve? | Operations are applied or refused; no version check was found on `account.upsert`. | `routes/sync.ts` |
| Q-17 | Offline | Does the web app need an offline mode, or is the device app the only offline path? | No service worker exists. | File 09 section E |
| Q-18 | Language | Which two languages after English, and for which screens (customer-facing documents first or whole app)? | Eleven other message files hold few keys. | File 11 UX-02 |
| Q-19 | Product | Which 'Soon' tiles should be removed, linked or built? | File 10 section B classifies all 23. | `menu.tsx` |
| Q-20 | Product | What is the scope of the AI assistant after UI/UX: read-only analytics, actions, or both; and is a paid model API allowed? | Event desk rules forbid paid AI there; for this ERP the decision is open. Assistant currently rule based with optional model key. | Project memory; `services/assistant.ts` |
| Q-21 | Product | Pricing and plan model (per user, per branch, per module)? | N9 not built; tenants are 'one subscription' only in a comment. | `schema.ts:9` |
| Q-22 | Product | Is the wholesale buyer portal (N6) or the marketplace layer (N3/N4) closer to a customer need than manufacturing depth (Phase C)? | Sequence of Phases C, M, N. | Plan |
| Q-23 | Operations | Who runs production: deployment, monitoring, backups of the database itself (as opposed to per-business exports)? | No runbook or monitoring found in the repo. | Repo scan |
| Q-24 | Operations | What is the target availability and recovery objective? | Needed before choosing the edge or cloud design. | Not stated |
| Q-25 | Quality | What is the acceptance target for counter speed (median checkout time) and for scan-to-stock accuracy? | U4 scorecard is unbuilt; no baseline exists. | Plan U4 |
| Q-26 | UI | Is the Stitch design set final, and which screens are first for the demo? | Restyle is in progress (U1 to U3). | Plan UI direction |
| Q-27 | Accounting | Should repair deposits and tailoring advances post to the books when taken? | Today they are tracked on the job and not posted until billed. | `/sales/repairs` text |
| Q-28 | Tax | Which TDS section 393 official table version will be used for the legacy map? | Plan D3 says the map 'needs the official table'; the map exists but its source is not stated. | `tds_section_map` |
| Q-29 | Compliance | Is e-way bill Part B and consolidated e-way bill needed? | Generate, vehicle, extend, cancel exist; consolidation not found. | `routes/sales.ts` |
| Q-30 | Discovery | Can a browser pass of the running web and device apps be run to complete the UI/UX audit? | File 11 is static only. | File 11 section E |

## How these affect the next steps

- Q-01, Q-02, Q-03, Q-24 decide architecture and sequencing. Nothing in the plan changes until they are answered.
- Q-04 to Q-10 decide which connectors to make real first.
- Q-13 to Q-17 are security and data-handling decisions that are cheaper before a customer onboards.
- Q-19, Q-26, Q-30 unblock the UI/UX work that is next on the roadmap.
