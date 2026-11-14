# 06 Data and API map

Part A lists all 197 tables; part B all 749 API routes. Both are extracted mechanically from `packages/db/src/schema.ts` and `apps/api/src/routes/*.ts`, so they are facts. The module of a table is the module whose services reference it most [I]; a table touched by many modules is in the module that writes it most.

## Database facts [F]

- 197 tables, 2643 columns, 127 migrations (`packages/db/migrations`), 198 names enabled for row level security in migrations.
- Tenant isolation: row level security keyed to `app_tenant()` is enabled in migrations for 198 names. Of these, 194 are tables in `schema.ts`; `sync_changes` is created in a migration only; 3 names (`kots`, `pos_orders`, `pos_tables`) no longer appear in `schema.ts` [I: dropped or renamed tables]. A test asserts every table with a `tenant_id` has RLS. Tables without RLS: `users`, `sessions`, `password_resets` [I: identity tables read before a tenant is known; `sessions` is the one carrying a tenant column, confirm in file 13 Q-13].
- Insert-only tables (UPDATE and DELETE not granted): `gl_entries`, `recon_events`, `relabels`, `report_snapshots`, `stock_ledger`, `sync_changes`.
- Immutable by trigger: `audit_log` (`audit_log_immutable`), `gl_entries` (`gl_entries_immutable`), `stock_ledger` (`stock_ledger_immutable`); vouchers must balance (`gl_voucher_balanced`).
- Security definer functions (look up a tenant without being in one): `app_tenant`, `attendance_device_by_serial`, `audit_log_immutable`, `catalogue_share_by_token`, `comm_reminder_tenants`, `comm_tenant_by_provider_id`, `comm_tenants_by_contact`, `due_backups`, `due_comm_tenants`, `due_consignee_tenants`, `due_saved_reports`, `due_scheduled_changes`, `invitation_by_token`, `seal_audit_entries`, `seal_audit_entry`, `shared_document_by_token`, `tenants_with_unsealed_audit`, `user_tenants`.
- Sync triggers: 16 triggers fill `sync_changes` for tables the device pulls.

## A. Tables


### FIN Accounting and Finance (21 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `companies` | 12 | yes |  |  | `accounting`, `changes`, `losses`, `onboarding` |
| `fiscal_years` | 9 | yes |  | companies | `accounting`, `onboarding` |
| `number_series` | 12 | yes |  | branches, companies, devices, fiscal_years | `accounting`, `scheduledchanges`, `onboarding` |
| `account_groups` | 11 | yes |  | companies | `accounting`, `assets`, `crm`, `alterations` (+9 more) |
| `vouchers` | 19 | yes |  | branches, companies, devices, fiscal_years, users | `accounting`, `assets`, `banking`, `expenses` |
| `voucher_lines` | 8 | yes |  | accounts, vouchers | `accounting` |
| `bill_allocations` | 6 | yes |  | companies, vouchers | `returns`, `billreceipts` |
| `gl_entries` | 10 | yes | insert-only | accounts, companies, vouchers | `accounting` |
| `close_signoffs` | 8 | yes |  | companies, users | `close` |
| `month_closes` | 8 | yes |  | companies, users | `close` |
| `report_snapshots` | 10 | yes | insert-only | companies, users | `close` |
| `post_dated_cheques` | 16 | yes |  | accounts, companies, users, vouchers | `workingcap` |
| `cash_commitments` | 14 | yes |  | companies, users | `workingcap` |
| `expense_allocation_rules` | 8 | yes |  | accounts, companies, users | `expensealloc` |
| `stock_writedowns` | 17 | yes |  | companies, users, vouchers | `stockfinance` |
| `scenarios` | 9 | yes |  | companies, users | `scenarios` |
| `gift_vouchers` | 16 | yes |  | companies, users, vouchers | `vouchers`, `tailoring`, `pos` |
| `gift_voucher_redemptions` | 8 | yes |  | gift_vouchers | `vouchers` |
| `coupons` | 14 | yes |  | companies | `vouchers`, `pos` |
| `discount_cards` | 10 | yes |  | companies | `vouchers` |
| `lucky_draws` | 11 | yes |  | companies, users | `vouchers` |


### TAX GST, TDS and Statutory Compliance (16 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `purchase_bills` | 27 | yes |  | accounts, branches, companies, purchase_orders, users (+1 more) | `gstwork`, `purchasing` |
| `gst_settings` | 10 | yes |  | companies | `gstwork`, `sharing`, `filing`, `sales` |
| `gst_filings` | 15 | yes |  | companies, users | `filing`, `gstwork` |
| `gst_sessions` | 7 | yes |  | companies, users | `filing` |
| `tds_deductions` | 17 | yes |  | accounts, companies, users, vouchers | `tds` |
| `tcs_collections` | 16 | yes |  | accounts, companies, users, vouchers | `tcs`, `tds` |
| `tds_challans` | 13 | yes |  | accounts, companies, users, vouchers | `tds`, `tcs` |
| `gstr2b_imports` | 9 | yes |  | companies, users | `gstwork` |
| `gstr2b_rows` | 23 | yes |  | gstr2b_imports, purchase_bills, users | `gstwork` |
| `itc_reversals` | 16 | yes |  | companies, purchase_bills, users, vouchers | `gstwork` |
| `gst_return_approvals` | 13 | yes |  | companies, users | `filing` |
| `tds_section_map` | 9 | yes |  | companies, users | `tds` |
| `export_shipments` | 14 | yes |  | companies, sales_invoices | `exports` |
| `duty_scrips` | 9 | yes |  | companies | `exports` |
| `scrip_uses` | 7 | yes |  | duty_scrips | `exports` |
| `incentive_rates` | 9 | yes |  | companies | `exports` |


### BNK Banking (10 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `recon_runs` | 13 | yes |  | accounts, companies, users | `recon` |
| `recon_items` | 18 | yes |  | recon_runs, users | `recon` |
| `recon_events` | 8 | yes | insert-only | recon_runs, users | `recon` |
| `recon_writeoffs` | 13 | yes |  | recon_runs, users, vouchers | `recon` |
| `bank_profiles` | 10 | yes |  | accounts, companies | `banking` |
| `bank_statements` | 12 | yes |  | accounts, companies, users | `banking` |
| `bank_lines` | 16 | yes |  | accounts, bank_statements, companies | `banking` |
| `bank_matches` | 6 | yes |  | accounts, bank_lines, vouchers | `banking` |
| `bank_rules` | 9 | yes |  | accounts, companies | `banking` |
| `gateway_settlements` | 20 | yes |  | accounts, companies, users, vouchers | `banking` |


### SAL Sales and Wholesale (27 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `accounts` | 34 | yes |  | account_groups, companies, price_lists | `tds`, `crm`, `banking`, `commission` (+33 more) |
| `price_lists` | 7 | yes |  | companies | `catalogue`, `consignment` |
| `price_list_items` | 5 | yes |  | items, price_lists | `catalogue`, `consignment` |
| `quotations` | 28 | yes |  | accounts, branches, companies, users | `sales`, `crm` |
| `quotation_lines` | 18 | yes |  | items, quotations | `sales` |
| `sales_orders` | 26 | yes |  | accounts, branches, companies, employees, quotations (+1 more) | `sales`, `crm`, `deliveryorders`, `repairs` |
| `sales_order_lines` | 20 | yes |  | items, sales_orders | `sales`, `deliveryorders`, `repairs` |
| `delivery_orders` | 13 | yes |  | accounts, companies, sales_orders, users | `deliveryorders` |
| `delivery_order_lines` | 7 | yes |  | delivery_orders, items, sales_order_lines | `deliveryorders` |
| `delivery_notes` | 24 | yes |  | accounts, companies, sales_orders, users, warehouses | `sales`, `deliveryorders` |
| `delivery_note_lines` | 14 | yes |  | delivery_notes, delivery_order_lines, items, sales_order_lines | `sales`, `deliveryorders` |
| `delivery_returns` | 8 | yes |  | delivery_notes, users | `sales` |
| `sales_invoices` | 52 | yes |  | accounts, branches, companies, employees, quotations (+3 more) | `sales`, `commission`, `projects`, `crm` (+6 more) |
| `sales_invoice_lines` | 24 | yes |  | delivery_note_lines, items, sales_invoices, sales_order_lines, warehouses | `sales`, `returns`, `repairs`, `sharing` |
| `brokerage_bills` | 16 | yes |  | accounts, companies, users, vouchers | `commission`, `tds` |
| `sales_targets` | 8 | yes |  | companies, employees | `commission` |
| `credit_notes` | 29 | yes |  | accounts, companies, sales_invoices, users, vouchers (+1 more) | `sales`, `returns` |
| `credit_note_lines` | 19 | yes |  | credit_notes, items, sales_invoice_lines | `sales`, `returns` |
| `salesman_commission_rules` | 14 | yes |  | companies, items | `salesmancomm` |
| `consignee_terms` | 10 | yes |  | accounts, companies | `consignment` |
| `consignment_moves` | 14 | yes |  | accounts, companies, sales_invoices, stock_journals, users | `consignment` |
| `style_images` | 12 | yes |  | companies, files, styles, users | `catalogue`, `ownerreports` |
| `shared_documents` | 9 | yes |  | companies, users | `sharing` |
| `catalogue_selections` | 13 | yes |  | accounts, companies, users | `catalogue` |
| `files` | 10 | yes |  | companies, users | `catalogue`, `files`, `tailoring`, `expenses` (+1 more) |
| `messages` | 15 | yes |  | accounts, companies, crm_leads, message_templates, users | `sharing`, `crm`, `catalogue` |
| `lr_entries` | 18 | yes |  | accounts, companies, sales_invoices, users | `lr` |


### POS Counter, Retail and Service Desk (23 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `branches` | 10 | yes |  | companies | `pos`, `returns`, `distribution`, `sharing` (+11 more) |
| `devices` | 8 | yes |  |  | `pos` |
| `repair_jobs` | 28 | yes |  | companies, users, vouchers | `repairs` |
| `inquiries` | 14 | yes |  | companies, repair_jobs, users | `repairs` |
| `branch_prices` | 14 | yes |  | companies, items, users, warehouses | `branchprices` |
| `approval_memos` | 13 | yes |  | companies, users, warehouses | `approvalmemos`, `commreminders` |
| `approval_memo_lines` | 9 | yes |  | approval_memos, items | `approvalmemos` |
| `pos_settings` | 22 | yes |  | companies | `pos`, `profitability` |
| `pos_terminals` | 8 | yes |  | companies, devices, warehouses | `pos`, `close` |
| `pos_sessions` | 17 | yes |  | pos_terminals, users, vouchers | `pos`, `close` |
| `karigars` | 9 | yes |  | accounts, companies, employees | `alterations`, `tailoring` |
| `alteration_types` | 9 | yes |  | companies | `alterations` |
| `alterations` | 24 | yes |  | companies, karigars, pos_bills, users, vouchers | `alterations` |
| `measurements` | 11 | yes |  | companies, files | `tailoring` |
| `tailoring_rates` | 7 | yes |  | companies | `tailoring` |
| `tailoring_orders` | 19 | yes |  | companies, gift_vouchers, pos_bills, users | `tailoring`, `repairs` |
| `loyalty_members` | 11 | yes |  | companies | `pos`, `loyalty`, `loyaltylots` |
| `loyalty_lots` | 9 | yes |  | loyalty_members | `loyaltylots` |
| `schemes` | 31 | yes |  | companies | `schemes` |
| `pos_bills` | 35 | yes |  | accounts, companies, pos_sessions, pos_terminals, users (+1 more) | `pos`, `vouchers`, `loyalty`, `alterations` (+4 more) |
| `pos_bill_lines` | 22 | yes |  | employees, items, pos_bills | `pos`, `returns`, `repairs` |
| `pos_held_bills` | 10 | yes |  | companies, pos_terminals, users | `pos` |
| `pos_returns` | 20 | yes |  | companies, gift_vouchers, pos_bills, pos_sessions, pos_terminals (+2 more) | `pos`, `returns` |


### PUR Purchasing (7 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `purchase_orders` | 20 | yes |  | accounts, branches, companies, users | `purchasing` |
| `purchase_order_lines` | 20 | yes |  | items, purchase_orders | `purchasing` |
| `goods_receipts` | 16 | yes |  | accounts, companies, purchase_orders, users, warehouses | `purchasing` |
| `goods_receipt_lines` | 17 | yes |  | goods_receipts, items, purchase_order_lines | `purchasing` |
| `purchase_bill_lines` | 24 | yes |  | goods_receipt_lines, items, purchase_bills, purchase_order_lines, warehouses | `purchasing` |
| `purchase_returns` | 22 | yes |  | accounts, companies, purchase_bills, users, vouchers (+1 more) | `purchasing` |
| `purchase_return_lines` | 19 | yes |  | items, purchase_bill_lines, purchase_returns | `purchasing` |


### INV Inventory and Masters of Stock (24 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `uoms` | 7 | yes |  | companies | `inventory`, `returns`, `sales`, `alterations` (+5 more) |
| `warehouses` | 12 | yes |  | branches, companies | `consignment`, `transfers`, `approvalmemos`, `pos` (+16 more) |
| `size_scales` | 7 | yes |  | companies | `styles` |
| `colors` | 7 | yes |  | companies | `styles`, `catalogue`, `ownerreports` |
| `lookups` | 11 | yes |  | companies | `lookups` |
| `styles` | 24 | yes |  | companies, size_scales, uoms | `styles`, `stockcount`, `catalogue`, `ownerreports` (+5 more) |
| `items` | 34 | yes |  | companies, styles, uoms | `manufacturing`, `styles`, `purchasing`, `stockcount` (+31 more) |
| `rate_update_requests` | 11 | yes |  | companies, users | `rateupdate` |
| `relabels` | 9 | yes | insert-only | companies, users | `relabel` |
| `margin_bands` | 7 | yes |  | companies | `marginbands` |
| `stock_limits` | 8 | yes |  | companies, items, warehouses | `stocklimits` |
| `item_units` | 5 | yes |  | items, uoms | `inventory` |
| `item_pack_lines` | 5 | yes |  | items | `styles`, `inventory` |
| `stock_ledger` | 15 | yes | insert-only | companies, items, warehouses | `inventory`, `pos`, `sales`, `transfers` |
| `stock_journals` | 10 | yes |  | companies, users | `inventory` |
| `stock_journal_lines` | 12 | yes |  | items, stock_journals, warehouses | `inventory` |
| `stock_counts` | 18 | yes |  | companies, stock_journals, users, warehouses | `stockcount` |
| `stock_count_lines` | 7 | yes |  | items, stock_counts | `stockcount` |
| `stock_transfers` | 14 | yes |  | companies, users, warehouses | `transfers` |
| `stock_transfer_lines` | 8 | yes |  | items, stock_transfers | `transfers` |
| `item_barcodes` | 8 | yes |  | accounts, companies, items | `barcodes`, `merge` |
| `stock_losses` | 19 | yes |  | companies, items, stock_journals, users, warehouses | `losses` |
| `item_serials` | 14 | yes |  | companies, items, pos_bills, users, warehouses | `serials` |
| `hsn_codes` | 9 | yes |  | companies | `hsn` |


### MFG Manufacturing and Job Work (7 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `work_centres` | 6 | yes |  | companies | `manufacturing` |
| `boms` | 12 | yes |  | companies, items, users | `manufacturing` |
| `bom_lines` | 7 | yes |  | boms, items | `manufacturing` |
| `bom_operations` | 7 | yes |  | boms, work_centres | `manufacturing` |
| `production_orders` | 21 | yes |  | boms, companies, items, users, warehouses | `manufacturing` |
| `production_entries` | 14 | yes |  | production_orders, users | `manufacturing` |
| `job_work_challans` | 15 | yes |  | accounts, companies, users | `jobwork` |


### HR People, Attendance and Payroll (16 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `employees` | 39 | yes |  | branches, companies | `hr`, `hr-ops`, `projects`, `expenses` (+10 more) |
| `attendance_devices` | 9 | yes |  |  | `devicepunch` |
| `attendance_punches` | 10 | yes |  | attendance_devices, employees | `devicepunch` |
| `week_off_changes` | 8 | yes |  | employees | `hr` |
| `statutory_payments` | 15 | yes |  | accounts, companies, users, vouchers | `statutory` |
| `salary_structures` | 7 | yes |  | employees, users | `hr`, `projects` |
| `tax_declarations` | 14 | yes |  | employees | `hr` |
| `holidays` | 5 | yes |  | companies | `hr` |
| `leave_types` | 10 | yes |  | companies | `hr` |
| `leave_openings` | 6 | yes |  | employees, leave_types | `hr` |
| `leave_requests` | 14 | yes |  | employees, leave_types, users | `hr` |
| `attendance` | 12 | yes |  | employees, leave_requests | `hr`, `devicepunch`, `hr-ops`, `attendancealerts` |
| `payroll_settings` | 11 | yes |  | companies | `hr`, `payroll` |
| `payroll_runs` | 15 | yes |  | companies, users, vouchers | `payroll`, `statutory`, `hr`, `devicepunch` (+2 more) |
| `payslips` | 21 | yes |  | employees, payroll_runs | `payroll`, `statutory` |
| `settlements` | 16 | yes |  | employees, users, vouchers | `hr` |


### EXP Expenses (3 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `expense_categories` | 12 | yes |  | accounts, companies | `expenses` |
| `expense_claims` | 19 | yes |  | companies, employees, users, vouchers | `expenses` |
| `expense_lines` | 20 | yes |  | expense_categories, expense_claims, files | `expenses` |


### PRJ Projects and Timesheets (5 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `projects` | 18 | yes |  | accounts, companies, items, users | `projects`, `expenses`, `purchasing`, `sales` |
| `project_tasks` | 10 | yes |  | employees, projects | `projects` |
| `project_members` | 5 | yes |  | employees, projects | `projects` |
| `timesheets` | 17 | yes |  | companies, employees, project_tasks, projects, users | `projects`, `sales` |
| `project_milestones` | 9 | yes |  | projects | `projects`, `sales` |


### CRM CRM and Communications (7 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `crm_leads` | 22 | yes |  | accounts, companies, users | `crm` |
| `crm_activities` | 13 | yes |  | accounts, companies, crm_leads, users | `crm` |
| `message_templates` | 10 | yes |  | companies | `crm`, `sharing` |
| `comm_templates` | 10 | yes |  | companies | `comms` |
| `comm_consents` | 9 | yes |  | companies | `comms` |
| `comm_outbox` | 23 | yes |  | accounts, companies, users | `comms` |
| `comm_settings` | 12 | yes |  | companies | `comms` |


### AST Fixed Assets (5 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `asset_classes` | 13 | yes |  | accounts, companies | `assets` |
| `assets` | 23 | yes |  | accounts, asset_classes, companies, employees, users (+1 more) | `assets` |
| `depreciation_runs` | 10 | yes |  | companies, users, vouchers | `assets` |
| `depreciation_entries` | 6 | yes |  | assets, depreciation_runs | `assets` |
| `it_block_openings` | 7 | yes |  | companies | `assets` |


### RPT Reports and Analytics (1 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `saved_reports` | 15 | yes |  | companies, users | `reportbuilder` |


### AI Assistant, Chat and Notes (1 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `chat_messages` | 7 | yes |  | users | `chat` |


### SEC Security, Settings and Administration (24 tables)

| Table | Cols | RLS | Mode | References | Used by services |
|---|---|---|---|---|---|
| `tenants` | 6 | yes |  |  | `backups`, `onboarding`, `restore` |
| `users` | 7 | NO |  |  | `controls`, `close`, `crm`, `recon` (+6 more) |
| `sessions` | 8 | NO |  | tenants, users |  |
| `password_resets` | 5 | NO |  | users |  |
| `roles` | 7 | yes |  |  | `controls`, `scheduledchanges`, `chat`, `onboarding` |
| `memberships` | 8 | yes |  | roles, users | `chat`, `controls`, `onboarding`, `restore` |
| `audit_log` | 14 | yes |  |  |  |
| `invitations` | 10 | yes |  | roles, users |  |
| `process_locks` | 7 | yes |  | companies, users | `processlocks` |
| `doc_prints` | 7 | yes |  | users |  |
| `shifts` | 10 | yes |  | companies | `hr-ops`, `devicepunch` |
| `employee_loans` | 15 | yes |  | accounts, employees, users, vouchers | `hr-ops`, `payroll` |
| `stipend_payments` | 12 | yes |  | accounts, employees, users, vouchers | `hr-ops` |
| `loan_requests` | 14 | yes |  | employee_loans, employees, users | `hr-ops` |
| `employee_reviews` | 10 | yes |  | employees, users | `hr-ops` |
| `change_requests` | 13 | yes |  | users | `changes` |
| `backup_settings` | 12 | yes |  | tenants | `backups` |
| `backup_runs` | 12 | yes |  |  | `backups` |
| `scheduled_changes` | 15 | yes |  | users | `scheduledchanges` |
| `sync_rejections` | 12 | yes |  | devices, users |  |
| `access_reviews` | 6 | yes |  | users | `controls` |
| `user_notes` | 7 | yes |  | users |  |
| `employee_documents` | 11 | yes |  | employees, files, users | `hr-ops` |
| `loan_receipts` | 10 | yes |  | accounts, employee_loans, users, vouchers | `hr-ops` |


### Column detail (all tables)

Compact form `column:type` (required columns marked `*`, references `->table`).

- **`tenants`** (`schema.ts:21`): id:id, name:text*, plan:varchar*, industry:varchar*, status:varchar*, created_at:timestamptz
- **`users`** (`schema.ts:30`): id:id, email:text*, phone:varchar, name:text*, password_hash:text*, locale:varchar*, created_at:timestamptz
- **`sessions`** (`schema.ts:40`): token_hash:char, user_id:uuid*->users, tenant_id:uuid->tenants, user_agent:text, ip:inet, expires_at:timestamp*, step_up_until:timestamp, created_at:timestamptz
- **`password_resets`** (`schema.ts:54`): token_hash:char, user_id:uuid*->users, expires_at:timestamp*, used_at:timestamp, created_at:timestamptz
- **`roles`** (`schema.ts:62`): id:id, tenant_id:uuid, key:varchar*, name:text*, permissions:text*, system:boolean*, created_at:timestamptz
- **`memberships`** (`schema.ts:72`): id:id, tenant_id:uuid, user_id:uuid*->users, role_id:uuid*->roles, status:varchar*, menu:jsonb, warehouse_scope:jsonb, created_at:timestamptz
- **`companies`** (`schema.ts:85`): id:id, tenant_id:uuid, name:text*, legal_name:text, pan:char, base_currency:char*, books_begin_on:date*, valuation_method:varchar*, bank_change_approval:boolean*, loss_approval_limit:numeric*, created_at:timestamptz, updated_at:timestamptz
- **`branches`** (`schema.ts:103`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:text*, gstin:char, state_code:char*, address:jsonb*, is_head_office:boolean*, created_at:timestamptz, updated_at:timestamptz
- **`fiscal_years`** (`schema.ts:119`): id:id, tenant_id:uuid, company_id:uuid*->companies, label:varchar*, starts_on:date*, ends_on:date*, locked_up_to:date, closed:boolean*, created_at:timestamptz
- **`devices`** (`schema.ts:133`): id:id, tenant_id:uuid, name:text*, code:varchar*, platform:varchar*, last_seen_at:timestamp, revoked_at:timestamp, created_at:timestamptz
- **`number_series`** (`schema.ts:144`): id:id, tenant_id:uuid, company_id:uuid*->companies, branch_id:uuid->branches, fiscal_year_id:uuid*->fiscal_years, device_id:uuid->devices, doc_type:varchar*, name:text*, pattern:varchar*, next_seq:integer*, is_default:boolean*, created_at:timestamptz
- **`audit_log`** (`schema.ts:160`): id:bigserial, tenant_id:uuid, user_id:uuid, action:varchar*, entity:varchar*, entity_id:text, before:jsonb, after:jsonb, ip:inet, request_id:varchar, at:timestamp*, chain_seq:bigint, prev_hash:char, hash:char
- **`invitations`** (`schema.ts:184`): id:id, tenant_id:uuid, email:text*, role_id:uuid*->roles, token_hash:char*, invited_by:uuid->users, expires_at:timestamp*, accepted_at:timestamp, revoked_at:timestamp, created_at:timestamptz
- **`account_groups`** (`schema.ts:200`): id:id, tenant_id:uuid, company_id:uuid*->companies, parent_id:uuid, key:varchar, name:text*, name_hi:text, nature:varchar*, pl:varchar, system:boolean*, created_at:timestamptz
- **`accounts`** (`schema.ts:218`): id:id, tenant_id:uuid, company_id:uuid*->companies, group_id:uuid*->account_groups, key:varchar, name:text*, name_hi:text, code:varchar, opening_balance:numeric*, gstin:char, state_code:char, pan:char, udyam_number:varchar, msme_class:varchar, phone:varchar, email:text, bank:jsonb, address:jsonb, credit_limit:numeric, credit_days:integer, credit_control:varchar*, block_overdue_days:integer, interest_rate:numeric, price_list_id:uuid->price_lists, is_agent:boolean*, commission_pct:numeric, agent_id:uuid, salesman_id:uuid, archived:boolean*, related_party:boolean*, merged_into_id:uuid, system:boolean*, created_at:timestamptz, updated_at:timestamptz
- **`vouchers`** (`schema.ts:272`): id:id, tenant_id:uuid, company_id:uuid*->companies, branch_id:uuid->branches, fiscal_year_id:uuid*->fiscal_years, type:varchar*, number:varchar*, date:date*, narration:text, reference:varchar, status:varchar*, total:numeric*, client_id:uuid, device_id:uuid->devices, created_by:uuid->users, cancelled_by:uuid->users, cancelled_at:timestamp, cancel_reason:text, created_at:timestamptz
- **`voucher_lines`** (`schema.ts:298`): id:id, tenant_id:uuid, voucher_id:uuid*->vouchers, line_no:integer*, account_id:uuid*->accounts, debit:numeric*, credit:numeric*, narration:text
- **`bill_allocations`** (`schema.ts:313`): id:id, tenant_id:uuid, company_id:uuid*->companies, voucher_id:uuid*->vouchers, bill_voucher_id:uuid*->vouchers, amount:numeric*
- **`gl_entries`** (`schema.ts:326`): id:bigserial, tenant_id:uuid, company_id:uuid*->companies, voucher_id:uuid*->vouchers, account_id:uuid*->accounts, date:date*, debit:numeric*, credit:numeric*, is_reversal:boolean*, posted_at:timestamp*
- **`uoms`** (`schema.ts:348`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:text*, name_hi:text, decimals:integer*
- **`warehouses`** (`schema.ts:358`): id:id, tenant_id:uuid, company_id:uuid*->companies, branch_id:uuid->branches, name:text*, is_default:boolean*, archived:boolean*, job_worker_id:uuid, consignee_id:uuid, in_transit:boolean*, quality_hold:boolean*, created_at:timestamptz
- **`size_scales`** (`schema.ts:380`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:text*, sizes:text*, archived:boolean*, created_at:timestamptz
- **`colors`** (`schema.ts:390`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:text*, code:varchar*, hex:varchar, archived:boolean*
- **`lookups`** (`schema.ts:405`): id:id, tenant_id:uuid, company_id:uuid*->companies, kind:varchar*, name:text*, code:varchar, note:text, starts_on:date, ends_on:date, archived:boolean*, created_at:timestamptz
- **`styles`** (`schema.ts:426`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:text*, name_hi:text, brand:text, category:text, season:text, collection:text, hsn:varchar, gst_rate:numeric*, gst_slab:varchar, uom_id:uuid*->uoms, purchase_rate:numeric*, sale_rate:numeric*, mrp:numeric, size_scale_id:uuid->size_scales, fits:text, attributes:jsonb*, image_file_id:uuid, archived:boolean*, created_at:timestamptz, updated_at:timestamptz
- **`items`** (`schema.ts:455`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:text*, name_hi:text, sku:varchar, barcode:varchar, kind:varchar*, hsn:varchar, gst_rate:numeric*, gst_slab:varchar, slab_pieces:integer*, cess_rate:numeric*, uom_id:uuid*->uoms, purchase_rate:numeric*, sale_rate:numeric*, mrp:numeric(18,2), reorder_level:numeric(18,4), reorder_qty:numeric(18,4), default_qty:numeric(18,4), short_code:varchar, track_batches:boolean*, track_serials:boolean*, lead_time_days:integer*, style_id:uuid->styles, color:text, size:text, fit:text, size_order:integer*, is_pack:boolean*, archived:boolean*, merged_into_id:uuid, created_at:timestamptz, updated_at:timestamptz
- **`process_locks`** (`schema.ts:508`): id:id, tenant_id:uuid, company_id:uuid*->companies, doc_type:varchar*, locked_up_to:date*, updated_by:uuid->users, updated_at:timestamptz
- **`rate_update_requests`** (`schema.ts:519`): id:id, tenant_id:uuid, company_id:uuid*->companies, input:jsonb*, summary:jsonb*, status:varchar*, requested_by:uuid->users, decided_by:uuid->users, decision_note:text, created_at:timestamptz, decided_at:timestamp
- **`doc_prints`** (`schema.ts:534`): id:id, tenant_id:uuid, doc_type:varchar*, doc_id:uuid*, count:integer*, last_at:timestamp*, last_by:uuid->users
- **`relabels`** (`schema.ts:545`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, reason:text*, changes:jsonb*, created_by:uuid->users, created_at:timestamptz
- **`margin_bands`** (`schema.ts:561`): id:id, tenant_id:uuid, company_id:uuid*->companies, from_rate:numeric*, markup_pct:numeric*, markdown1_pct:numeric*, markdown2_pct:numeric*
- **`stock_limits`** (`schema.ts:572`): id:id, tenant_id:uuid, company_id:uuid*->companies, item_id:uuid*->items, warehouse_id:uuid*->warehouses, min_qty:numeric(18,4)*, max_qty:numeric(18,4)*, updated_at:timestamptz
- **`item_units`** (`schema.ts:584`): id:id, tenant_id:uuid, item_id:uuid*->items, uom_id:uuid*->uoms, factor:numeric*
- **`price_lists`** (`schema.ts:596`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, discount_pct:numeric*, archived:boolean*, created_at:timestamptz
- **`price_list_items`** (`schema.ts:606`): id:id, tenant_id:uuid, price_list_id:uuid*->price_lists, item_id:uuid*->items, rate:numeric*
- **`item_pack_lines`** (`schema.ts:615`): id:id, tenant_id:uuid, pack_item_id:uuid*->items, item_id:uuid*->items, qty:numeric*
- **`stock_ledger`** (`schema.ts:628`): id:bigserial, tenant_id:uuid, company_id:uuid*->companies, item_id:uuid*->items, warehouse_id:uuid*->warehouses, date:date*, qty_in:numeric(18,4)*, qty_out:numeric(18,4)*, rate:numeric*, batch_no:varchar, expiry:date, source_type:varchar*, source_id:uuid*, is_reversal:boolean*, posted_at:timestamp*
- **`stock_journals`** (`schema.ts:652`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, kind:varchar*, narration:text, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`stock_journal_lines`** (`schema.ts:665`): id:id, tenant_id:uuid, journal_id:uuid*->stock_journals, line_no:integer*, item_id:uuid*->items, warehouse_id:uuid*->warehouses, to_warehouse_id:uuid->warehouses, qty_in:numeric(18,4)*, qty_out:numeric(18,4)*, rate:numeric*, batch_no:varchar, expiry:date
- **`stock_counts`** (`schema.ts:684`): id:id, tenant_id:uuid, company_id:uuid*->companies, warehouse_id:uuid*->warehouses, number:varchar*, name:varchar*, scope:jsonb*, verify_only:boolean*, blind:boolean*, status:varchar*, submitted_at:timestamp, submitted_by:uuid->users, approved_at:timestamp, approved_by:uuid->users, reason:text, journal_id:uuid->stock_journals, created_by:uuid->users, created_at:timestamptz
- **`stock_count_lines`** (`schema.ts:708`): id:id, tenant_id:uuid, count_id:uuid*->stock_counts, item_id:uuid*->items, expected:numeric(18,4)*, counted:numeric(18,4)*, rate:numeric*
- **`purchase_orders`** (`schema.ts:746`): id:id, tenant_id:uuid, company_id:uuid*->companies, branch_id:uuid*->branches, supplier_id:uuid*->accounts, number:varchar*, date:date*, expected_on:date, status:varchar*, supply_kind:varchar*, narration:text, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, created_by:uuid->users, created_at:timestamptz
- **`purchase_order_lines`** (`schema.ts:763`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, order_id:uuid*->purchase_orders, received_qty:numeric(18,4)*, billed_qty:numeric(18,4)*
- **`goods_receipts`** (`schema.ts:770`): id:id, tenant_id:uuid, company_id:uuid*->companies, supplier_id:uuid*->accounts, order_id:uuid->purchase_orders, warehouse_id:uuid*->warehouses, number:varchar*, date:date*, supplier_challan:varchar, transporter:varchar, lr_number:varchar, lr_date:date, status:varchar*, narration:text, created_by:uuid->users, created_at:timestamptz
- **`goods_receipt_lines`** (`schema.ts:790`): id:id, tenant_id:uuid, receipt_id:uuid*->goods_receipts, line_no:integer*, item_id:uuid*->items, order_line_id:uuid->purchase_order_lines, qty:numeric(18,4)*, rate:numeric*, mrp:numeric(18,2), batch_no:varchar, expiry:date, billed_qty:numeric(18,4)*, challan_qty:numeric(18,4), short_qty:numeric(18,4)*, damaged_qty:numeric(18,4)*, hold_qty:numeric(18,4)*, returned_qty:numeric(18,4)*
- **`purchase_bills`** (`schema.ts:813`): id:id, tenant_id:uuid, project_id:uuid, company_id:uuid*->companies, branch_id:uuid*->branches, supplier_id:uuid*->accounts, order_id:uuid->purchase_orders, voucher_id:uuid->vouchers, number:varchar*, date:date*, supplier_invoice_no:varchar*, supplier_invoice_date:date*, due_on:date, supply_kind:varchar*, reverse_charge:boolean*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, round_off:numeric(18,2)*, status:varchar*, narration:text, created_by:uuid->users, created_at:timestamptz
- **`purchase_bill_lines`** (`schema.ts:841`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, bill_id:uuid*->purchase_bills, order_line_id:uuid->purchase_order_lines, receipt_line_id:uuid->goods_receipt_lines, warehouse_id:uuid->warehouses, batch_no:varchar, expiry:date, returned_qty:numeric(18,4)*
- **`purchase_returns`** (`schema.ts:853`): id:id, tenant_id:uuid, company_id:uuid*->companies, bill_id:uuid*->purchase_bills, supplier_id:uuid*->accounts, voucher_id:uuid->vouchers, warehouse_id:uuid*->warehouses, number:varchar*, date:date*, reason:text*, supply_kind:varchar*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, round_off:numeric(18,2)*, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`purchase_return_lines`** (`schema.ts:872`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, return_id:uuid*->purchase_returns, bill_line_id:uuid*->purchase_bill_lines
- **`quotations`** (`schema.ts:892`): id:id, tenant_id:uuid, kind:varchar*, advance_due:numeric(18,2), company_id:uuid*->companies, branch_id:uuid*->branches, customer_id:uuid*->accounts, number:varchar*, date:date*, valid_until:date*, place_of_supply:char*, supply_kind:varchar*, lut:boolean*, status:varchar*, customer_reference:varchar, narration:text, terms:text, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, converted_kind:varchar, converted_id:uuid, created_by:uuid->users, created_at:timestamptz
- **`quotation_lines`** (`schema.ts:917`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, quotation_id:uuid*->quotations
- **`sales_orders`** (`schema.ts:922`): id:id, tenant_id:uuid, company_id:uuid*->companies, branch_id:uuid*->branches, customer_id:uuid*->accounts, quotation_id:uuid->quotations, number:varchar*, date:date*, deliver_by:date, place_of_supply:char*, supply_kind:varchar*, status:varchar*, customer_reference:varchar, narration:text, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, agent_id:uuid->accounts, agent_pct:numeric, salesman_id:uuid->employees, created_by:uuid->users, created_at:timestamptz
- **`sales_order_lines`** (`schema.ts:945`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, order_id:uuid*->sales_orders, delivered_qty:numeric(18,4)*, invoiced_qty:numeric(18,4)*
- **`delivery_orders`** (`schema.ts:956`): id:id, tenant_id:uuid, company_id:uuid*->companies, customer_id:uuid*->accounts, order_id:uuid->sales_orders, number:varchar*, date:date*, deliver_by:date, transporter:varchar, status:varchar*, narration:text, created_by:uuid->users, created_at:timestamptz
- **`delivery_order_lines`** (`schema.ts:972`): id:id, tenant_id:uuid, delivery_order_id:uuid*->delivery_orders, line_no:integer*, item_id:uuid*->items, order_line_id:uuid->sales_order_lines, qty:numeric(18,4)*
- **`delivery_notes`** (`schema.ts:988`): id:id, tenant_id:uuid, company_id:uuid*->companies, customer_id:uuid*->accounts, order_id:uuid->sales_orders, warehouse_id:uuid*->warehouses, number:varchar*, date:date*, status:varchar*, reason:varchar*, place_of_supply:char, supply_kind:varchar, transporter:varchar, vehicle_no:varchar, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, narration:text, created_by:uuid->users, created_at:timestamptz
- **`delivery_note_lines`** (`schema.ts:1009`): id:id, tenant_id:uuid, note_id:uuid*->delivery_notes, line_no:integer*, item_id:uuid*->items, order_line_id:uuid->sales_order_lines, delivery_order_line_id:uuid->delivery_order_lines, qty:numeric(18,4)*, batch_no:varchar, invoiced_qty:numeric(18,4)*, returned_qty:numeric(18,4)*, rate:numeric, gst_rate:numeric, taxable:numeric(18,2)*
- **`delivery_returns`** (`schema.ts:1029`): id:id, tenant_id:uuid, note_id:uuid*->delivery_notes, date:date*, lines:jsonb*, narration:text, created_by:uuid->users, created_at:timestamptz
- **`sales_invoices`** (`schema.ts:1044`): id:id, tenant_id:uuid, project_id:uuid, company_id:uuid*->companies, branch_id:uuid*->branches, customer_id:uuid*->accounts, order_id:uuid->sales_orders, quotation_id:uuid->quotations, voucher_id:uuid->vouchers, number:varchar*, date:date*, due_on:date, customer_name:text*, customer_gstin:char, billing_address:jsonb*, shipping_address:jsonb, place_of_supply:char*, supply_kind:varchar*, lut:boolean*, reverse_charge:boolean*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, round_off:numeric(18,2)*, status:varchar*, narration:text, einvoice_status:varchar*, irn:char, ack_no:varchar, ack_date:timestamp, signed_qr:text, einvoice_error:text, ewb_status:varchar*, ewb_no:varchar, ewb_date:timestamp, ewb_valid_upto:timestamp, vehicle_no:varchar, transport_distance_km:integer, header_discounts:jsonb*, early_pay_pct:numeric, early_pay_days:integer, cartons:integer, agent_id:uuid->accounts, agent_pct:numeric, salesman_id:uuid->employees, helper_id:uuid->employees, created_by:uuid->users, created_at:timestamptz
- **`sales_invoice_lines`** (`schema.ts:1103`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, warehouse_id:uuid->warehouses, batch_no:varchar, invoice_id:uuid*->sales_invoices, order_line_id:uuid->sales_order_lines, delivery_line_id:uuid->delivery_note_lines, returned_qty:numeric(18,4)*, header_discount:numeric(18,2)*
- **`brokerage_bills`** (`schema.ts:1118`): id:id, tenant_id:uuid, company_id:uuid*->companies, agent_id:uuid*->accounts, voucher_id:uuid->vouchers, number:varchar*, date:date*, amount:numeric(18,2)*, tds_rate:numeric*, tds:numeric(18,2)*, net:numeric(18,2)*, lines:jsonb*, status:varchar*, narration:text, created_by:uuid->users, created_at:timestamptz
- **`sales_targets`** (`schema.ts:1138`): id:id, tenant_id:uuid, company_id:uuid*->companies, employee_id:uuid*->employees, month:char*, target:numeric(18,2)*, slabs:jsonb*, created_at:timestamptz
- **`credit_notes`** (`schema.ts:1150`): id:id, tenant_id:uuid, company_id:uuid*->companies, invoice_id:uuid*->sales_invoices, customer_id:uuid*->accounts, voucher_id:uuid->vouchers, warehouse_id:uuid->warehouses, number:varchar*, date:date*, reason:text*, goods_returned:boolean*, supply_kind:varchar*, place_of_supply:char*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, round_off:numeric(18,2)*, status:varchar*, einvoice_status:varchar*, irn:char, ack_no:varchar, ack_date:timestamp, signed_qr:text, created_by:uuid->users, created_at:timestamptz
- **`credit_note_lines`** (`schema.ts:1176`): id:id, tenant_id:uuid, line_no:integer*, item_id:uuid*->items, description:text, qty:numeric(18,4)*, rate:numeric*, discount:numeric(18,2)*, gst_rate:numeric*, cess_rate:numeric*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, utgst:numeric(18,2)*, igst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, note_id:uuid*->credit_notes, invoice_line_id:uuid*->sales_invoice_lines
- **`gst_settings`** (`schema.ts:1183`): company_id:uuid->companies, tenant_id:uuid, einvoice_enabled:boolean*, qrmp:boolean*, eway_bill_threshold:numeric(18,2)*, bilingual_print:boolean*, print_language:varchar*, invoice_terms:text, bank_details:text, approval_required:boolean*
- **`gst_filings`** (`schema.ts:1204`): id:id, tenant_id:uuid, company_id:uuid*->companies, gstin:char*, return_type:varchar*, period:char*, status:varchar*, payload_hash:char*, summary:jsonb*, reference_id:varchar, arn:varchar, uploaded_at:timestamp*, filed_at:timestamp, filed_by:uuid->users, provider:varchar*
- **`gst_sessions`** (`schema.ts:1226`): company_id:uuid->companies, tenant_id:uuid, gstin:char*, username:varchar*, token_enc:text*, expires_at:timestamp*, created_by:uuid->users
- **`employees`** (`schema.ts:1245`): id:id, tenant_id:uuid, company_id:uuid*->companies, branch_id:uuid->branches, code:varchar*, name:text*, name_hi:text, gender:varchar*, dob:date, punch_pin:varchar, weekly_offs:jsonb, joined_on:date*, left_on:date, status:varchar*, fixed_term:boolean*, department:varchar, designation:varchar, work_state:char*, phone:varchar, email:varchar, address:jsonb, pan:char, aadhaar_last4:char, uan:varchar, esi_number:varchar, pf_member:boolean*, cost_per_hour:numeric, eps_eligible:boolean*, pf_on_actual_wages:boolean*, disabled:boolean*, tax_regime:varchar*, metro:boolean*, payment_mode:varchar*, bank_name:varchar, bank_ifsc:char, bank_account_enc:text, bank_account_last4:char, shift_id:uuid, created_at:timestamptz
- **`shifts`** (`schema.ts:1291`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, start_time:char*, end_time:char*, grace_minutes:integer*, full_day_minutes:integer*, half_day_minutes:integer*, is_default:boolean*
- **`employee_loans`** (`schema.ts:1305`): id:id, tenant_id:uuid, employee_id:uuid*->employees, kind:varchar*, date:date*, amount:numeric(18,2)*, instalment:numeric(18,2)*, recovered:numeric(18,2)*, start_period:char*, status:varchar*, paid_from_account_id:uuid->accounts, voucher_id:uuid->vouchers, remarks:text, created_by:uuid->users, created_at:timestamptz
- **`stipend_payments`** (`schema.ts:1324`): id:id, tenant_id:uuid, employee_id:uuid*->employees, period:char*, amount:numeric(18,2)*, date:date*, paid_from_account_id:uuid*->accounts, voucher_id:uuid->vouchers, status:varchar*, remarks:text, created_by:uuid->users, created_at:timestamptz
- **`loan_requests`** (`schema.ts:1343`): id:id, tenant_id:uuid, employee_id:uuid*->employees, kind:varchar*, amount:numeric(18,2)*, instalment:numeric(18,2)*, reason:text, status:varchar*, requested_by:uuid->users, decided_by:uuid->users, decided_at:timestamp, decision_note:text, loan_id:uuid->employee_loans, created_at:timestamptz
- **`stock_transfers`** (`schema.ts:1364`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, from_warehouse_id:uuid*->warehouses, to_warehouse_id:uuid*->warehouses, transporter:varchar, vehicle_no:varchar, status:varchar*, received_on:date, narration:text, created_by:uuid->users, created_at:timestamptz
- **`stock_transfer_lines`** (`schema.ts:1381`): id:id, tenant_id:uuid, transfer_id:uuid*->stock_transfers, line_no:integer*, item_id:uuid*->items, qty:numeric(18,4)*, received_qty:numeric(18,4)*, short_qty:numeric(18,4)*
- **`salesman_commission_rules`** (`schema.ts:1396`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, kind:varchar*, match:text, item_id:uuid->items, mrp_from:numeric, mrp_to:numeric, band_from:numeric, band_to:numeric, rate_pct:numeric*, active:boolean*, created_at:timestamptz
- **`employee_reviews`** (`schema.ts:1415`): id:id, tenant_id:uuid, employee_id:uuid*->employees, period:varchar*, reviewed_on:date*, rating:integer*, strengths:text, improvements:text, reviewer_id:uuid->users, created_at:timestamptz
- **`chat_messages`** (`schema.ts:1429`): id:id, tenant_id:uuid, from_user_id:uuid*->users, to_user_id:uuid*->users, body:text*, created_at:timestamptz, read_at:timestamp
- **`change_requests`** (`schema.ts:1440`): id:id, tenant_id:uuid, kind:varchar*, entity_id:uuid*, entity_name:text*, before:jsonb, after:jsonb, status:varchar*, requested_by:uuid->users, decided_by:uuid->users, decided_at:timestamp, decision_note:text, created_at:timestamptz
- **`repair_jobs`** (`schema.ts:1460`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, received_on:date*, customer_name:varchar*, customer_phone:varchar, item_description:text*, complaint:text, diagnosis:text, warranty:boolean*, estimate:numeric(18,2), deposit:numeric(18,2)*, deposit_voucher_id:uuid->vouchers, settle_voucher_id:uuid->vouchers, spares:jsonb*, final_charge:numeric(18,2), gst_rate:numeric*, gst_amount:numeric(18,2)*, status:varchar*, promised_on:date, delivered_on:date, reason:text, source_kind:varchar, source_id:uuid, source_number:varchar, created_by:uuid->users, created_at:timestamptz
- **`inquiries`** (`schema.ts:1495`): id:id, tenant_id:uuid, company_id:uuid*->companies, date:date*, customer_name:varchar*, customer_phone:varchar, kind:varchar*, note:text*, follow_up_on:date, status:varchar*, outcome:text, repair_id:uuid->repair_jobs, created_by:uuid->users, created_at:timestamptz
- **`consignee_terms`** (`schema.ts:1514`): id:id, tenant_id:uuid, company_id:uuid*->companies, customer_id:uuid*->accounts, settlement_days:integer*, discrepancy_owner:varchar, statement_frequency:varchar, statement_email:varchar, statement_last_sent:date, updated_at:timestamptz
- **`attendance_devices`** (`schema.ts:1533`): id:id, tenant_id:uuid, name:varchar*, serial:varchar*, active:boolean*, last_seen_at:timestamp, last_ip:varchar, last_stamp:varchar, created_at:timestamptz
- **`attendance_punches`** (`schema.ts:1547`): id:id, tenant_id:uuid, device_id:uuid*->attendance_devices, pin:varchar*, punch_date:date*, punch_time:char*, status:varchar, verify:varchar, employee_id:uuid->employees, created_at:timestamptz
- **`week_off_changes`** (`schema.ts:1562`): id:id, tenant_id:uuid, employee_id:uuid*->employees, date:date*, kind:varchar*, note:varchar, created_by:uuid, created_at:timestamptz
- **`tds_deductions`** (`schema.ts:1574`): id:id, tenant_id:uuid, company_id:uuid*->companies, deductee_id:uuid*->accounts, section:varchar*, date:date*, base:numeric(18,2)*, taxable_base:numeric(18,2)*, rate:numeric*, tds:numeric(18,2)*, no_pan:boolean*, voucher_id:uuid->vouchers, challan_id:uuid, note:varchar, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`tcs_collections`** (`schema.ts:1596`): id:id, tenant_id:uuid, company_id:uuid*->companies, customer_id:uuid*->accounts, section:varchar*, date:date*, base:numeric(18,2)*, rate:numeric*, tcs:numeric(18,2)*, no_pan:boolean*, voucher_id:uuid->vouchers, challan_id:uuid, note:varchar, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`tds_challans`** (`schema.ts:1616`): id:id, tenant_id:uuid, company_id:uuid*->companies, paid_on:date*, amount:numeric(18,2)*, account_id:uuid*->accounts, bsr_code:char*, challan_serial:varchar*, kind:varchar*, voucher_id:uuid->vouchers, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`backup_settings`** (`schema.ts:1634`): tenant_id:uuid->tenants, enabled:boolean*, frequency:varchar*, hour:integer*, weekday:integer*, recipients:jsonb*, passphrase_enc:text, next_run_at:timestamp, last_run_at:timestamp, last_ok_at:timestamp, last_error:varchar, updated_at:timestamptz
- **`backup_runs`** (`schema.ts:1653`): id:id, tenant_id:uuid, started_at:timestamp*, trigger:varchar*, status:varchar*, filename:varchar, bytes:integer, table_count:integer, row_count:integer, sha256:char, sent_to:jsonb*, error:varchar
- **`scheduled_changes`** (`schema.ts:1669`): id:id, tenant_id:uuid, entity:varchar*, entity_id:uuid*, entity_name:text*, field:varchar*, value:text, previous:text, effective_from:date*, status:varchar*, applied_at:timestamp, error:varchar, note:varchar, created_by:uuid->users, created_at:timestamptz
- **`sync_rejections`** (`schema.ts:1689`): id:id, tenant_id:uuid, device_id:uuid*->devices, op_id:varchar*, kind:varchar, error:varchar*, payload:jsonb, status:varchar*, note:varchar, resolved_by:uuid->users, resolved_at:timestamp, created_at:timestamptz
- **`item_barcodes`** (`schema.ts:1705`): id:id, tenant_id:uuid, company_id:uuid*->companies, item_id:uuid*->items, code:varchar*, kind:varchar*, supplier_id:uuid->accounts, created_at:timestamptz
- **`stock_losses`** (`schema.ts:1717`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, item_id:uuid*->items, warehouse_id:uuid*->warehouses, qty:numeric*, value:numeric(18,2)*, reason:varchar*, note:varchar, file_id:uuid, status:varchar*, journal_id:uuid->stock_journals, requested_by:uuid->users, decided_by:uuid->users, decided_at:timestamp, decision_note:varchar, created_at:timestamptz
- **`close_signoffs`** (`schema.ts:1741`): id:id, tenant_id:uuid, company_id:uuid*->companies, period:char*, key:varchar*, note:varchar, signed_by:uuid->users, signed_at:timestamp*
- **`month_closes`** (`schema.ts:1753`): id:id, tenant_id:uuid, company_id:uuid*->companies, period:char*, closed_by:uuid->users, closed_at:timestamp*, reopened_at:timestamp, reopen_reason:varchar
- **`report_snapshots`** (`schema.ts:1765`): id:id, tenant_id:uuid, company_id:uuid*->companies, period:char*, kind:varchar*, version:integer*, filters:jsonb*, data:jsonb*, taken_by:uuid->users, taken_at:timestamp*
- **`gstr2b_imports`** (`schema.ts:1779`): id:id, tenant_id:uuid, company_id:uuid*->companies, period:char*, gstin:char, rows:integer*, imported_by:uuid->users, imported_at:timestamp*, source:varchar*
- **`gstr2b_rows`** (`schema.ts:1793`): id:id, tenant_id:uuid, import_id:uuid*->gstr2b_imports, ctin:char*, supplier_name:varchar, kind:varchar*, doc_no:varchar*, doc_date:date*, taxable:numeric(18,2)*, igst:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, cess:numeric(18,2)*, itc_available:boolean*, reason:varchar, bill_id:uuid->purchase_bills, match:varchar*, diff:jsonb, decision:varchar, decision_note:varchar, decided_by:uuid->users, supplier_filed_1:boolean, supplier_filed_3b:boolean
- **`itc_reversals`** (`schema.ts:1822`): id:id, tenant_id:uuid, company_id:uuid*->companies, rule:varchar*, bill_id:uuid*->purchase_bills, igst:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, cess:numeric(18,2)*, reversed_on:date*, voucher_id:uuid->vouchers, reclaimed_on:date, reclaim_voucher_id:uuid->vouchers, note:varchar, created_by:uuid->users, created_at:timestamptz
- **`gst_return_approvals`** (`schema.ts:1842`): id:id, tenant_id:uuid, company_id:uuid*->companies, return_type:varchar*, period:char*, status:varchar*, payload_hash:char*, summary:jsonb*, requested_by:uuid->users, requested_at:timestamp*, decided_by:uuid->users, decided_at:timestamp, note:varchar
- **`post_dated_cheques`** (`schema.ts:1859`): id:id, tenant_id:uuid, company_id:uuid*->companies, direction:varchar*, party_id:uuid*->accounts, bank_account_id:uuid*->accounts, cheque_no:varchar*, drawn_on:varchar, cheque_date:date*, amount:numeric(18,2)*, status:varchar*, voucher_id:uuid->vouchers, note:varchar, settled_on:date, created_by:uuid->users, created_at:timestamptz
- **`cash_commitments`** (`schema.ts:1879`): id:id, tenant_id:uuid, company_id:uuid*->companies, kind:varchar*, direction:varchar*, name:varchar*, amount:numeric(18,2)*, first_date:date*, repeat:varchar*, until:date, note:varchar, active:boolean*, created_by:uuid->users, created_at:timestamptz
- **`expense_allocation_rules`** (`schema.ts:1897`): id:id, tenant_id:uuid, company_id:uuid*->companies, account_id:uuid*->accounts, basis:varchar*, shares:jsonb, updated_by:uuid->users, updated_at:timestamptz
- **`tds_section_map`** (`schema.ts:1910`): id:id, tenant_id:uuid, company_id:uuid*->companies, legacy_section:varchar*, new_ref:varchar*, payment_code:varchar, note:varchar, updated_by:uuid->users, updated_at:timestamptz
- **`branch_prices`** (`schema.ts:1923`): id:id, tenant_id:uuid, company_id:uuid*->companies, warehouse_id:uuid*->warehouses, item_id:uuid*->items, sale_rate:numeric(18,2)*, starts_on:date, ends_on:date, weekdays:jsonb, from_time:varchar, to_time:varchar, note:varchar, created_by:uuid->users, created_at:timestamptz
- **`item_serials`** (`schema.ts:1941`): id:id, tenant_id:uuid, company_id:uuid*->companies, item_id:uuid*->items, serial:varchar*, status:varchar*, warehouse_id:uuid->warehouses, received_on:date, source_kind:varchar, source_id:uuid, sold_bill_id:uuid->pos_bills, sold_on:date, created_by:uuid->users, created_at:timestamptz
- **`approval_memos`** (`schema.ts:1960`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, warehouse_id:uuid*->warehouses, customer_name:varchar*, customer_phone:varchar, due_back:date, note:varchar, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`approval_memo_lines`** (`schema.ts:1976`): id:id, tenant_id:uuid, memo_id:uuid*->approval_memos, line_no:integer*, item_id:uuid*->items, qty:numeric(18,4)*, rate:numeric(18,2)*, returned_qty:numeric(18,4)*, billed_qty:numeric(18,4)*
- **`stock_writedowns`** (`schema.ts:1989`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, as_of:date*, basis:jsonb*, lines:jsonb*, required:numeric(18,2)*, held:numeric(18,2)*, change:numeric(18,2)*, status:varchar*, note:varchar, voucher_id:uuid->vouchers, requested_by:uuid->users, decided_by:uuid->users, decided_at:timestamp, created_at:timestamptz
- **`access_reviews`** (`schema.ts:2011`): id:id, tenant_id:uuid, started_by:uuid->users, started_at:timestamp*, completed_at:timestamp, members:jsonb*
- **`recon_runs`** (`schema.ts:2022`): id:id, tenant_id:uuid, company_id:uuid*->companies, kind:varchar*, party_id:uuid->accounts, from_date:date*, to_date:date*, rules:jsonb*, their_closing:numeric(18,2), status:varchar*, created_by:uuid->users, created_at:timestamptz, closed_at:timestamp
- **`recon_items`** (`schema.ts:2040`): id:id, tenant_id:uuid, run_id:uuid*->recon_runs, side:varchar*, ref:varchar*, date:date*, amount:numeric(18,2)*, description:varchar, source_voucher_id:uuid, status:varchar*, group_id:uuid, rule:varchar, matched_by:varchar, reason_code:varchar, owner_id:uuid->users, note:varchar, evidence_file_id:uuid, created_at:timestamptz
- **`recon_events`** (`schema.ts:2062`): id:bigserial, tenant_id:uuid, run_id:uuid*->recon_runs, item_id:uuid, action:varchar*, detail:jsonb*, by:uuid->users, at:timestamp*
- **`recon_writeoffs`** (`schema.ts:2074`): id:id, tenant_id:uuid, run_id:uuid*->recon_runs, item_ids:jsonb*, amount:numeric(18,2)*, reason_code:varchar*, note:varchar, status:varchar*, requested_by:uuid->users, decided_by:uuid->users, decided_at:timestamp, voucher_id:uuid->vouchers, created_at:timestamptz
- **`scenarios`** (`schema.ts:2092`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, adjustments:jsonb*, baseline:jsonb*, note:varchar, created_by:uuid->users, created_at:timestamptz
- **`export_shipments`** (`schema.ts:2105`): id:id, tenant_id:uuid, company_id:uuid*->companies, invoice_id:uuid*->sales_invoices, shipping_bill_no:varchar, shipping_bill_date:date, port_code:varchar, fob_value:numeric(18,2), currency:varchar*, brc_no:varchar, brc_date:date, realised_amount:numeric(18,2)*, note:varchar, created_at:timestamptz
- **`duty_scrips`** (`schema.ts:2123`): id:id, tenant_id:uuid, company_id:uuid*->companies, scheme:varchar*, number:varchar*, issued_on:date*, valid_until:date, amount:numeric(18,2)*, created_at:timestamptz
- **`scrip_uses`** (`schema.ts:2136`): id:id, tenant_id:uuid, scrip_id:uuid*->duty_scrips, used_on:date*, amount:numeric(18,2)*, purpose:varchar, created_at:timestamptz
- **`incentive_rates`** (`schema.ts:2147`): id:id, tenant_id:uuid, company_id:uuid*->companies, scheme:varchar*, hsn_prefix:varchar*, rate_pct:numeric*, effective_from:date*, effective_to:date, created_at:timestamptz
- **`user_notes`** (`schema.ts:2160`): id:id, tenant_id:uuid, user_id:uuid*->users, body:text*, due_on:date, done_at:timestamp, created_at:timestamptz
- **`hsn_codes`** (`schema.ts:2171`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, description:text*, kind:varchar*, gst_rate:numeric, archived:boolean*, created_at:timestamptz
- **`employee_documents`** (`schema.ts:2185`): id:id, tenant_id:uuid, employee_id:uuid*->employees, kind:varchar*, number:text, issued_on:date, expires_on:date, file_id:uuid->files, note:text, created_by:uuid->users, created_at:timestamptz
- **`loan_receipts`** (`schema.ts:2200`): id:id, tenant_id:uuid, loan_id:uuid*->employee_loans, date:date*, amount:numeric(18,2)*, account_id:uuid*->accounts, voucher_id:uuid->vouchers, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`statutory_payments`** (`schema.ts:2214`): id:id, tenant_id:uuid, company_id:uuid*->companies, kind:varchar*, period:char*, amount:numeric(18,2)*, paid_on:date*, account_id:uuid*->accounts, reference:varchar, bsr_code:char, challan_serial:varchar, voucher_id:uuid->vouchers, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`salary_structures`** (`schema.ts:2233`): id:id, tenant_id:uuid, employee_id:uuid*->employees, effective_from:date*, components:jsonb*, created_by:uuid->users, created_at:timestamptz
- **`tax_declarations`** (`schema.ts:2244`): id:id, tenant_id:uuid, employee_id:uuid*->employees, fy:varchar*, rent_paid:numeric(18,2)*, c80:numeric(18,2)*, ccd1b:numeric(18,2)*, d80:numeric(18,2)*, home_loan_interest:numeric(18,2)*, other_deductions:numeric(18,2)*, other_income:numeric(18,2)*, previous_employer_salary:numeric(18,2)*, previous_employer_tds:numeric(18,2)*, updated_at:timestamptz
- **`holidays`** (`schema.ts:2261`): id:id, tenant_id:uuid, company_id:uuid*->companies, date:date*, name:varchar*
- **`leave_types`** (`schema.ts:2269`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:varchar*, name_hi:varchar, annual_quota:numeric*, paid:boolean*, encashable:boolean*, archived:boolean*
- **`leave_openings`** (`schema.ts:2283`): id:id, tenant_id:uuid, employee_id:uuid*->employees, leave_type_id:uuid*->leave_types, fy:varchar*, days:numeric*
- **`leave_requests`** (`schema.ts:2292`): id:id, tenant_id:uuid, employee_id:uuid*->employees, leave_type_id:uuid*->leave_types, from_date:date*, to_date:date*, half_day:boolean*, days:numeric*, reason:text, status:varchar*, decided_by:uuid->users, decided_at:timestamp, created_by:uuid->users, created_at:timestamptz
- **`attendance`** (`schema.ts:2310`): id:id, tenant_id:uuid, employee_id:uuid*->employees, date:date*, status:varchar*, leave_request_id:uuid->leave_requests, note:varchar, in_time:char, out_time:char, worked_minutes:integer, late:boolean*, source:varchar*
- **`payroll_settings`** (`schema.ts:2325`): company_id:uuid->companies, tenant_id:uuid, tan:char, pf_establishment_code:varchar, esi_employer_code:varchar, labour_code_wages:boolean*, weekly_offs:jsonb*, lwf_employee:numeric(18,2)*, lwf_employer:numeric(18,2)*, lwf_months:jsonb*, encashment_divisor:integer*
- **`payroll_runs`** (`schema.ts:2339`): id:id, tenant_id:uuid, company_id:uuid*->companies, period:char*, status:varchar*, gross:numeric(18,2)*, deductions:numeric(18,2)*, net_pay:numeric(18,2)*, employer_contributions:numeric(18,2)*, voucher_id:uuid->vouchers, payment_voucher_id:uuid->vouchers, created_by:uuid->users, created_at:timestamptz, finalized_at:timestamp, paid_at:timestamp
- **`payslips`** (`schema.ts:2357`): id:id, tenant_id:uuid, run_id:uuid*->payroll_runs, employee_id:uuid*->employees, lop_days:numeric*, lop_override:numeric, paid_days:numeric*, gross:numeric(18,2)*, pf_wages:numeric(18,2)*, pf_employee:numeric(18,2)*, esi_employee:numeric(18,2)*, pt:numeric(18,2)*, lwf_employee:numeric(18,2)*, tds:numeric(18,2)*, other_deductions:jsonb*, extra_earnings:jsonb*, loan_recoveries:jsonb*, total_deductions:numeric(18,2)*, net_pay:numeric(18,2)*, employer_contributions:numeric(18,2)*, detail:jsonb*
- **`settlements`** (`schema.ts:2386`): id:id, tenant_id:uuid, employee_id:uuid*->employees, left_on:date*, service_years:integer*, gratuity:numeric(18,2)*, leave_days:numeric*, leave_encashment:numeric(18,2)*, other_earnings:numeric(18,2)*, recoveries:numeric(18,2)*, total:numeric(18,2)*, remarks:text, voucher_id:uuid->vouchers, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`work_centres`** (`schema.ts:2407`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, cost_per_hour:numeric(18,2)*, archived:boolean*
- **`boms`** (`schema.ts:2417`): id:id, tenant_id:uuid, company_id:uuid*->companies, item_id:uuid*->items, version:integer*, output_qty:numeric(18,4)*, overhead:numeric(18,2)*, is_default:boolean*, status:varchar*, notes:text, created_by:uuid->users, created_at:timestamptz
- **`bom_lines`** (`schema.ts:2433`): id:id, tenant_id:uuid, bom_id:uuid*->boms, line_no:integer*, item_id:uuid*->items, qty:numeric(18,4)*, wastage_pct:numeric*
- **`bom_operations`** (`schema.ts:2443`): id:id, tenant_id:uuid, bom_id:uuid*->boms, line_no:integer*, name:varchar*, work_centre_id:uuid*->work_centres, minutes:numeric*
- **`production_orders`** (`schema.ts:2458`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, item_id:uuid*->items, bom_id:uuid*->boms, qty:numeric(18,4)*, source_warehouse_id:uuid*->warehouses, target_warehouse_id:uuid*->warehouses, status:varchar*, produced_qty:numeric(18,4)*, rejected_qty:numeric(18,4)*, material_cost:numeric(18,2)*, overhead_cost:numeric(18,2)*, pending_cost:numeric(18,2)*, sales_order_id:uuid, notes:text, created_by:uuid->users, created_at:timestamptz, completed_at:timestamp
- **`production_entries`** (`schema.ts:2483`): id:id, tenant_id:uuid, order_id:uuid*->production_orders, kind:varchar*, date:date*, good_qty:numeric(18,4)*, rejected_qty:numeric(18,4)*, material_cost:numeric(18,2)*, overhead_cost:numeric(18,2)*, unit_cost:numeric*, lines:jsonb*, notes:text, created_by:uuid->users, created_at:timestamptz
- **`job_work_challans`** (`schema.ts:2504`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, direction:varchar*, job_worker_id:uuid*->accounts, process:varchar, sent_challan_id:uuid, lines:jsonb*, consumed:jsonb*, charges:numeric(18,2)*, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`pos_settings`** (`schema.ts:2526`): company_id:uuid->companies, tenant_id:uuid, prices_include_tax:boolean*, loyalty_enabled:boolean*, loyalty_points_per_100:integer*, loyalty_slabs:jsonb, loyalty_min_redeem:integer*, loyalty_validity_days:integer, helper_share_pct:numeric*, loyalty_exclude_discounted_bills:boolean*, loyalty_exclude_discounted_items:boolean*, loyalty_exclude_brands:text, loyalty_exclude_categories:text, loyalty_point_value:numeric*, loyalty_max_redeem_pct:numeric*, referral_points:integer*, receipt_footer:text, allow_rate_change:boolean*, max_line_discount_pct:numeric, max_bill_discount_pct:numeric, require_salesman:boolean*, auto_send_bill:boolean*
- **`pos_terminals`** (`schema.ts:2560`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:varchar*, warehouse_id:uuid*->warehouses, device_id:uuid->devices, archived:boolean*
- **`pos_sessions`** (`schema.ts:2572`): id:id, tenant_id:uuid, terminal_id:uuid*->pos_terminals, opened_by:uuid->users, opened_at:timestamp*, opening_cash:numeric(18,2)*, status:varchar*, closed_by:uuid->users, closed_at:timestamp, expected_cash:numeric(18,2), counted_cash:numeric(18,2), difference:numeric(18,2), variance_signed_by:uuid->users, variance_signed_at:timestamp, variance_note:varchar, totals:jsonb, voucher_id:uuid->vouchers
- **`karigars`** (`schema.ts:2594`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, phone:varchar, account_id:uuid->accounts, employee_id:uuid->employees, active:boolean*, created_at:timestamptz
- **`alteration_types`** (`schema.ts:2608`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, kind:varchar*, charge:numeric(18,2)*, labour:numeric(18,2)*, active:boolean*, created_at:timestamptz
- **`alterations`** (`schema.ts:2624`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, bill_id:uuid->pos_bills, customer_name:varchar, customer_phone:varchar, lines:jsonb*, charge:numeric(18,2)*, labour:numeric(18,2)*, complimentary:boolean*, trial_on:date, delivery_on:date*, status:varchar*, karigar_id:uuid->karigars, issued_on:date, ready_on:date, delivered_on:date, labour_voucher_id:uuid->vouchers, delivery_bill_id:uuid->pos_bills, notes:text, created_by:uuid->users, created_at:timestamptz
- **`measurements`** (`schema.ts:2653`): id:id, tenant_id:uuid, company_id:uuid*->companies, customer_phone:varchar*, customer_name:varchar, garment:varchar*, values:jsonb*, photo_file_id:uuid->files, notes:text, taken_on:date*, created_at:timestamptz
- **`tailoring_rates`** (`schema.ts:2669`): id:id, tenant_id:uuid, company_id:uuid*->companies, garment:varchar*, process:varchar*, rate:numeric(18,2)*, position:integer*
- **`tailoring_orders`** (`schema.ts:2684`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, date:date*, customer_name:varchar*, customer_phone:varchar*, lines:jsonb, total:numeric(18,2)*, advance:numeric(18,2)*, advance_voucher_id:uuid->gift_vouchers, trial_on:date, delivery_on:date*, status:varchar*, delivered_on:date, delivery_bill_id:uuid->pos_bills, notes:text, created_by:uuid->users, created_at:timestamptz
- **`consignment_moves`** (`schema.ts:2714`): id:id, tenant_id:uuid, company_id:uuid*->companies, customer_id:uuid*->accounts, kind:varchar*, number:varchar*, date:date*, lines:jsonb*, value:numeric(18,2)*, stock_journal_id:uuid->stock_journals, invoice_id:uuid->sales_invoices, narration:text, created_by:uuid->users, created_at:timestamptz
- **`style_images`** (`schema.ts:2735`): id:id, tenant_id:uuid, company_id:uuid*->companies, style_id:uuid*->styles, color:text, view:varchar*, file_id:uuid*->files, thumb_file_id:uuid*->files, sort_order:integer*, archived:boolean*, created_by:uuid->users, created_at:timestamptz
- **`shared_documents`** (`schema.ts:2754`): id:id, tenant_id:uuid, company_id:uuid*->companies, kind:varchar*, doc_id:uuid*, token_hash:char*, expires_at:timestamp*, created_by:uuid->users, created_at:timestamptz
- **`catalogue_selections`** (`schema.ts:2770`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:text*, party_id:uuid->accounts, lines:jsonb*, show_prices:boolean*, show_stock:boolean*, share_token_hash:char, share_expires_at:timestamp, created_by:uuid->users, created_at:timestamptz, updated_at:timestamptz
- **`loyalty_members`** (`schema.ts:2786`): id:id, tenant_id:uuid, company_id:uuid*->companies, phone:varchar*, name:varchar, points:integer*, lifetime_points:integer*, referred_by:varchar, birthday:date, anniversary:date, created_at:timestamptz
- **`loyalty_lots`** (`schema.ts:2801`): id:id, tenant_id:uuid, member_id:uuid*->loyalty_members, bill_id:uuid, earned:integer*, left:integer*, earned_on:date*, expires_on:date, created_at:timestamptz
- **`gift_vouchers`** (`schema.ts:2817`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, value:numeric(18,2)*, balance:numeric(18,2)*, issued_on:date*, expires_on:date*, status:varchar*, customer_phone:varchar, customer_name:varchar, paid_by:varchar*, voucher_id:uuid->vouchers, expiry_voucher_id:uuid->vouchers, created_by:uuid->users, created_at:timestamptz
- **`gift_voucher_redemptions`** (`schema.ts:2836`): id:id, tenant_id:uuid, gift_voucher_id:uuid*->gift_vouchers, bill_id:uuid*, date:date*, amount:numeric(18,2)*, reversed:boolean*, created_at:timestamptz
- **`coupons`** (`schema.ts:2848`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, kind:varchar*, value:numeric*, max_discount:numeric(18,2), min_bill:numeric(18,2), starts_on:date, ends_on:date, max_uses:integer, used:integer*, active:boolean*, created_at:timestamptz
- **`discount_cards`** (`schema.ts:2866`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, holder:varchar*, phone:varchar, pct:numeric*, valid_until:date, active:boolean*, created_at:timestamptz
- **`lucky_draws`** (`schema.ts:2880`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, from_date:date*, to_date:date*, min_bill:numeric(18,2), entries:integer*, winners:jsonb*, created_by:uuid->users, created_at:timestamptz
- **`schemes`** (`schema.ts:2906`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, kind:varchar*, starts_on:date, ends_on:date, weekdays:jsonb, priority:integer, from_time:char, to_time:char, branch_ids:jsonb, active:boolean*, scope:jsonb*, confirm_before_apply:boolean*, allow_with_gift_vouchers:boolean*, allow_with_customer_discount:boolean*, allow_returns:boolean*, apply_on_discounted:boolean*, inclusive_of_tax:boolean*, commission_basis:varchar*, pct:numeric, amount:numeric(18,2), min_value:numeric(18,2), buy:integer, get:integer, slabs:jsonb, combo_price:numeric(18,2), combo_items:jsonb, created_at:timestamptz, updated_at:timestamptz
- **`pos_bills`** (`schema.ts:2946`): id:id, tenant_id:uuid, company_id:uuid*->companies, terminal_id:uuid*->pos_terminals, session_id:uuid->pos_sessions, number:varchar*, date:date*, customer_phone:varchar, customer_name:varchar, customer_account_id:uuid->accounts, prices_include_tax:boolean*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, cess:numeric(18,2)*, discount:numeric(18,2)*, round_off:numeric(18,2)*, total:numeric(18,2)*, payments:jsonb*, change:numeric(18,2)*, tax_by_rate:jsonb*, loyalty_earned:integer*, loyalty_redeemed:integer*, status:varchar*, void_reason:text, voucher_id:uuid->vouchers, source:varchar*, promos:jsonb, schemes:jsonb*, mismatch:jsonb, overrides:jsonb*, return_id:uuid, billed_at:timestamp, created_by:uuid->users, created_at:timestamptz
- **`pos_bill_lines`** (`schema.ts:2993`): id:id, tenant_id:uuid, bill_id:uuid*->pos_bills, line_no:integer*, item_id:uuid*->items, name:text*, hsn:varchar, qty:numeric(18,4)*, price:numeric*, gst_rate:numeric*, cess_rate:numeric*, discount:numeric(18,2)*, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, cess:numeric(18,2)*, total:numeric(18,2)*, returned_qty:numeric(18,4)*, salesman_id:uuid->employees, serials:jsonb, commission_adj:numeric(18,2)*, helper_id:uuid->employees
- **`pos_held_bills`** (`schema.ts:3023`): id:id, tenant_id:uuid, company_id:uuid*->companies, terminal_id:uuid*->pos_terminals, label:varchar, customer_phone:varchar, customer_name:varchar, lines:jsonb*, created_by:uuid->users, created_at:timestamptz
- **`pos_returns`** (`schema.ts:3041`): id:id, tenant_id:uuid, company_id:uuid*->companies, terminal_id:uuid*->pos_terminals, session_id:uuid->pos_sessions, bill_id:uuid*->pos_bills, number:varchar*, date:date*, lines:jsonb, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, cess:numeric(18,2)*, round_off:numeric(18,2)*, total:numeric(18,2)*, refund_mode:varchar*, gift_voucher_id:uuid->gift_vouchers, voucher_id:uuid->vouchers, created_by:uuid->users, created_at:timestamptz
- **`files`** (`schema.ts:3071`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:text*, content_type:varchar*, size:integer*, sha256:char*, data:bytea*, created_by:uuid->users, created_at:timestamptz
- **`bank_profiles`** (`schema.ts:3087`): account_id:uuid->accounts, tenant_id:uuid, company_id:uuid*->companies, bank_name:varchar, account_last4:char, ifsc:char, feed_provider:varchar, feed_consent_id:varchar, feed_status:varchar, feed_fetched_to:date
- **`bank_statements`** (`schema.ts:3100`): id:id, tenant_id:uuid, company_id:uuid*->companies, account_id:uuid*->accounts, source:varchar*, file_name:text, from_date:date*, to_date:date*, line_count:integer*, duplicates:integer*, created_by:uuid->users, created_at:timestamptz
- **`bank_lines`** (`schema.ts:3116`): id:id, tenant_id:uuid, company_id:uuid*->companies, account_id:uuid*->accounts, statement_id:uuid*->bank_statements, date:date*, description:text*, reference:varchar, debit:numeric(18,2)*, credit:numeric(18,2)*, balance:numeric(18,2), fingerprint:text*, seq:integer*, status:varchar*, matched_by:varchar, matched_at:timestamp
- **`bank_matches`** (`schema.ts:3137`): id:id, tenant_id:uuid, bank_line_id:uuid*->bank_lines, account_id:uuid*->accounts, voucher_id:uuid*->vouchers, amount:numeric(18,2)*
- **`bank_rules`** (`schema.ts:3147`): id:id, tenant_id:uuid, company_id:uuid*->companies, contains:varchar*, direction:varchar*, account_id:uuid*->accounts, narration:varchar, priority:integer*, archived:boolean*
- **`gateway_settlements`** (`schema.ts:3160`): id:id, tenant_id:uuid, company_id:uuid*->companies, provider:varchar*, settlement_id:varchar*, utr:varchar, settled_on:date*, payments:integer*, gross:numeric(18,2)*, refunds:numeric(18,2)*, fees:numeric(18,2)*, tax:numeric(18,2)*, adjustments:numeric(18,2)*, net:numeric(18,2)*, bank_account_id:uuid*->accounts, clearing_account_id:uuid*->accounts, voucher_id:uuid->vouchers, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`asset_classes`** (`schema.ts:3185`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, name_hi:varchar, method:varchar*, life_years:numeric*, residual_pct:numeric*, it_block:varchar*, it_rate:numeric*, asset_account_id:uuid*->accounts, accumulated_account_id:uuid*->accounts, archived:boolean*
- **`assets`** (`schema.ts:3201`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:text*, class_id:uuid*->asset_classes, purchase_date:date*, put_to_use_on:date*, cost:numeric(18,2)*, opening_accumulated:numeric(18,2)*, location:varchar, serial_no:varchar, custodian_id:uuid->employees, supplier_id:uuid->accounts, invoice_ref:varchar, voucher_id:uuid->vouchers, status:varchar*, disposed_on:date, sale_value:numeric(18,2), disposal_voucher_id:uuid->vouchers, notes:text, created_by:uuid->users, created_at:timestamptz
- **`depreciation_runs`** (`schema.ts:3228`): id:id, tenant_id:uuid, company_id:uuid*->companies, from_date:date*, to_date:date*, total:numeric(18,2)*, voucher_id:uuid->vouchers, status:varchar*, created_by:uuid->users, created_at:timestamptz
- **`depreciation_entries`** (`schema.ts:3241`): id:id, tenant_id:uuid, run_id:uuid*->depreciation_runs, asset_id:uuid*->assets, amount:numeric(18,2)*, days:integer*
- **`it_block_openings`** (`schema.ts:3251`): id:id, tenant_id:uuid, company_id:uuid*->companies, fy:varchar*, block:varchar*, rate:numeric*, opening_wdv:numeric(18,2)*
- **`expense_categories`** (`schema.ts:3263`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, name_hi:varchar, account_id:uuid*->accounts, blocked_credit:boolean*, limit_per_claim:numeric(18,2), receipt_required_above:numeric(18,2), per_km_rate:numeric, daily_allowance:numeric, archived:boolean*
- **`expense_claims`** (`schema.ts:3280`): id:id, tenant_id:uuid, company_id:uuid*->companies, number:varchar*, employee_id:uuid*->employees, date:date*, title:varchar*, project_id:uuid, status:varchar*, total:numeric(18,2)*, itc:numeric(18,2)*, submitted_at:timestamp, decided_by:uuid->users, decided_at:timestamp, reject_reason:text, voucher_id:uuid->vouchers, payment_voucher_id:uuid->vouchers, created_by:uuid->users, created_at:timestamptz
- **`expense_lines`** (`schema.ts:3302`): id:id, tenant_id:uuid, claim_id:uuid*->expense_claims, line_no:integer*, date:date*, category_id:uuid*->expense_categories, description:text, amount:numeric(18,2)*, gst_rate:numeric*, vendor_name:varchar, vendor_gstin:char, invoice_no:varchar, taxable:numeric(18,2)*, cgst:numeric(18,2)*, sgst:numeric(18,2)*, igst:numeric(18,2)*, project_id:uuid, file_id:uuid->files, ocr:jsonb, travel:jsonb
- **`projects`** (`schema.ts:3329`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:text*, customer_id:uuid->accounts, status:varchar*, billing:varchar*, contract_value:numeric(18,2), budget_cost:numeric(18,2), budget_hours:numeric, bill_rate:numeric(18,2), billing_item_id:uuid->items, start_on:date, end_on:date, notes:text, created_by:uuid->users, created_at:timestamptz
- **`project_tasks`** (`schema.ts:3350`): id:id, tenant_id:uuid, project_id:uuid*->projects, name:varchar*, status:varchar*, assignee_id:uuid->employees, estimated_hours:numeric, due_on:date, sort_order:integer*, created_at:timestamptz
- **`project_members`** (`schema.ts:3364`): id:id, tenant_id:uuid, project_id:uuid*->projects, employee_id:uuid*->employees, bill_rate:numeric(18,2)
- **`timesheets`** (`schema.ts:3372`): id:id, tenant_id:uuid, company_id:uuid*->companies, project_id:uuid*->projects, task_id:uuid->project_tasks, employee_id:uuid*->employees, date:date*, hours:numeric*, billable:boolean*, note:varchar, cost_rate:numeric(18,2)*, bill_rate:numeric(18,2)*, status:varchar*, invoice_id:uuid, approved_by:uuid->users, created_by:uuid->users, created_at:timestamptz
- **`project_milestones`** (`schema.ts:3393`): id:id, tenant_id:uuid, project_id:uuid*->projects, name:varchar*, amount:numeric(18,2)*, due_on:date, status:varchar*, invoice_id:uuid, sort_order:integer*
- **`crm_leads`** (`schema.ts:3408`): id:id, tenant_id:uuid, company_id:uuid*->companies, code:varchar*, name:text*, organisation:text, phone:varchar, email:varchar, gstin:char, state_code:char, city:varchar, source:varchar*, stage:varchar*, value:numeric(18,2), expected_close:date, owner_id:uuid->users, customer_id:uuid->accounts, lost_reason:text, notes:text, created_by:uuid->users, created_at:timestamptz, updated_at:timestamptz
- **`crm_activities`** (`schema.ts:3434`): id:id, tenant_id:uuid, company_id:uuid*->companies, lead_id:uuid->crm_leads, account_id:uuid->accounts, kind:varchar*, subject:varchar*, due_at:timestamp, done_at:timestamp, owner_id:uuid->users, notes:text, created_by:uuid->users, created_at:timestamptz
- **`message_templates`** (`schema.ts:3451`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, channel:varchar*, category:varchar*, language:varchar*, body:text*, provider_name:varchar, archived:boolean*
- **`messages`** (`schema.ts:3464`): id:id, tenant_id:uuid, company_id:uuid*->companies, channel:varchar*, to:varchar*, account_id:uuid->accounts, lead_id:uuid->crm_leads, template_id:uuid->message_templates, body:text*, status:varchar*, provider:varchar*, provider_id:varchar, error:text, created_by:uuid->users, created_at:timestamptz
- **`comm_templates`** (`schema.ts:3485`): id:id, tenant_id:uuid, company_id:uuid*->companies, event:varchar*, channel:varchar*, language:varchar*, category:varchar*, subject:varchar, body:text*, archived:boolean*
- **`comm_consents`** (`schema.ts:3499`): id:id, tenant_id:uuid, company_id:uuid*->companies, contact:varchar*, channel:varchar*, marketing_opt_in:boolean*, opted_out:boolean*, source:varchar, updated_at:timestamptz
- **`comm_outbox`** (`schema.ts:3512`): id:id, tenant_id:uuid, company_id:uuid*->companies, event:varchar*, channel:varchar*, category:varchar*, language:varchar*, to:varchar*, account_id:uuid->accounts, subject:varchar, body:text*, status:varchar*, attempts:integer*, next_attempt_at:timestamp*, dedupe_key:varchar, provider:varchar, provider_id:varchar, cost:numeric*, error:text, created_by:uuid->users, created_at:timestamptz, sent_at:timestamp, delivered_at:timestamp
- **`comm_settings`** (`schema.ts:3543`): id:id, tenant_id:uuid, company_id:uuid*->companies, cost_whatsapp_utility:numeric*, cost_whatsapp_marketing:numeric*, cost_sms:numeric*, cost_email:numeric*, cost_push:numeric*, owner_phone:varchar, owner_email:varchar, max_attempts:integer*, auto_events:jsonb*
- **`saved_reports`** (`schema.ts:3571`): id:id, tenant_id:uuid, company_id:uuid*->companies, name:varchar*, config:jsonb*, frequency:varchar, hour:integer, weekday:integer, day:integer, recipients:text*, next_run_at:timestamp, last_run_at:timestamp, last_error:text, created_by:uuid->users, created_at:timestamptz
- **`lr_entries`** (`schema.ts:3593`): id:id, tenant_id:uuid, company_id:uuid*->companies, date:date*, transporter:text*, lr_number:varchar*, invoice_id:uuid->sales_invoices, customer_id:uuid->accounts, destination:text, packages:integer*, weight_kg:numeric, freight:numeric(18,2)*, freight_by:varchar*, status:varchar*, delivered_on:date, note:text, created_by:uuid->users, created_at:timestamptz

## B. API routes

Columns: guard = the permission expression found on the route; step-up = route demands password confirmation; public = listed in `lib/public-routes.ts`. Tables are those the route's services reference (a superset of what the route touches). Feature IDs link to file 02.


### `apps/api/src/routes/accountbooks.ts` (9 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/cash-book` | FIN-001 | reports.view |  | 23 |
| GET | `/reports/group-month` | FIN-002 | reports.view |  | 28 |
| GET | `/reports/cash-bank-expense` | FIN-003 | reports.view |  | 33 |
| GET | `/reports/cash-flow` | FIN-004 | reports.view |  | 37 |
| GET | `/reports/rcm-register` | FIN-005 | reports.view |  | 41 |
| GET | `/reports/bill-adjustments` | FIN-006 | reports.view |  | 45 |
| GET | `/reports/integrity` | FIN-007 | reports.view |  | 50 |
| GET | `/reports/cfo` | FIN-008 | reports.view |  | 55 |
| GET | `/reports/stock-movement` | FIN-009 | reports.view |  | 60 |


### `apps/api/src/routes/accounting.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/accounts/groups` | FIN-010 | accounts.view |  | 77 |
| GET | `/accounts` | FIN-011 | accounts.view |  | 87 |
| POST | `/accounts` | FIN-011 | accounts.create |  | 102 |
| PATCH | `/accounts/:id` | FIN-011 | accounts.edit |  | 130 |
| GET | `/vouchers` | FIN-012 | accounts.view |  | 162 |
| GET | `/vouchers/:id` | FIN-012 | accounts.view |  | 188 |
| POST | `/vouchers` | FIN-012 | accounts.create |  | 204 |
| POST | `/vouchers/:id/cancel` | FIN-012 | accounts.cancel |  | 222 |
| PATCH | `/fiscal-years/:id` | FIN-013 | accounts.approve |  | 232 |
| GET | `/reports/trial-balance` | FIN-014 | reports.view |  | 248 |
| GET | `/reports/profit-loss` | FIN-015 | reports.view |  | 254 |
| GET | `/reports/balance-sheet` | FIN-016 | reports.view |  | 264 |
| GET | `/reports/ledger/:accountId` | FIN-017 | reports.view |  | 273 |


### `apps/api/src/routes/alterations.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/karigars` | POS-001 | sales.view |  | 27 |
| POST | `/karigars` | POS-001 | sales.edit |  | 31 |
| PUT | `/karigars/:id` | POS-001 | sales.edit |  | 32 |
| GET | `/alteration-types` | POS-002 | sales.view |  | 35 |
| POST | `/alteration-types` | POS-002 | sales.edit |  | 39 |
| PUT | `/alteration-types/:id` | POS-002 | sales.edit |  | 40 |
| GET | `/alterations` | POS-003 | sales.view |  | 42 |
| GET | `/alterations/labour` | POS-003 | sales.view |  | 46 |
| POST | `/alterations` | POS-003 | sales.create |  | 50 |
| POST | `/alterations/:id/issue` | POS-003 | sales.create |  | 58 |
| POST | `/alterations/:id/receive` | POS-003 | sales.create |  | 62 |
| POST | `/alterations/:id/deliver` | POS-003 | sales.create |  | 66 |
| POST | `/alterations/:id/cancel` | POS-003 | sales.cancel |  | 70 |


### `apps/api/src/routes/approvalmemos.ts` (5 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/approval-memos` | POS-004 | sales.view |  | 17 |
| GET | `/approval-memos/by-number` | POS-004 | sales.view |  | 21 |
| GET | `/approval-memos/:id` | POS-004 | sales.view |  | 25 |
| POST | `/approval-memos` | POS-004 | sales.create |  | 29 |
| POST | `/approval-memos/:id/return` | POS-004 | sales.edit |  | 36 |


### `apps/api/src/routes/assets.ts` (14 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/assets/presets` | AST-001 | assets.view |  | 25 |
| GET | `/assets/classes` | AST-001 | assets.view |  | 26 |
| POST | `/assets/classes` | AST-001 | assets.edit |  | 27 |
| PATCH | `/assets/classes/:id` | AST-001 | assets.edit |  | 34 |
| GET | `/assets` | AST-001 | assets.view |  | 39 |
| GET | `/assets/:id` | AST-001 | assets.view |  | 40 |
| POST | `/assets` | AST-001 | assets.create |  | 41 |
| POST | `/assets/:id/dispose` | AST-001 | assets.submit |  | 50 |
| GET | `/assets/depreciation/runs` | AST-001 | assets.view |  | 57 |
| GET | `/assets/depreciation/preview` | AST-001 | assets.view |  | 58 |
| POST | `/assets/depreciation` | AST-001 | assets.submit |  | 62 |
| POST | `/assets/depreciation/runs/:id/cancel` | AST-001 | assets.cancel |  | 66 |
| GET | `/assets/income-tax` | AST-001 | assets.view |  | 72 |
| PUT | `/assets/income-tax/openings` | AST-001 | assets.edit |  | 76 |


### `apps/api/src/routes/auth.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| POST | `/auth/signup` | SEC-001 | PUBLIC |  | 49 |
| POST | `/auth/login` | SEC-002 | PUBLIC |  | 64 |
| POST | `/auth/logout` | SEC-003 | PUBLIC |  | 85 |
| GET | `/auth/me` | SEC-004 | NONE |  | 91 |
| PATCH | `/auth/me` | SEC-004 | NONE |  | 126 |
| GET | `/me/menu` | SEC-005 | NONE |  | 104 |
| PUT | `/me/menu` | SEC-005 | NONE |  | 109 |
| POST | `/auth/switch` | SEC-006 | NONE |  | 117 |
| POST | `/auth/unlock` | SEC-007 | NONE |  | 134 |
| POST | `/auth/step-up` | SEC-008 | NONE |  | 143 |
| POST | `/auth/password` | SEC-009 | NONE |  | 153 |
| POST | `/auth/password/forgot` | SEC-009 | PUBLIC |  | 164 |
| POST | `/auth/password/reset` | SEC-009 | PUBLIC |  | 186 |


### `apps/api/src/routes/backups.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/backups` | SEC-010 | company.export |  | 10 |
| PUT | `/backups` | SEC-010 | company.export |  | 14 |
| POST | `/backups/run` | SEC-010 | company.export |  | 23 |


### `apps/api/src/routes/banking.ts` (19 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/banking/accounts` | BNK-001 | banking.view |  | 23 |
| PUT | `/banking/accounts/:id/profile` | BNK-001 | banking.edit |  | 24 |
| POST | `/banking/accounts/:id/statements` | BNK-001 | banking.create |  | 29 |
| POST | `/banking/accounts/:id/feed/connect` | BNK-001 | banking.edit |  | 33 |
| POST | `/banking/accounts/:id/feed/disconnect` | BNK-001 | banking.edit |  | 34 |
| POST | `/banking/accounts/:id/feed/fetch` | BNK-001 | banking.create |  | 35 |
| GET | `/banking/accounts/:id/lines` | BNK-001 | banking.view |  | 39 |
| GET | `/banking/accounts/:id/open-entries` | BNK-001 | banking.view |  | 43 |
| POST | `/banking/accounts/:id/apply-rules` | BNK-001 | banking.create |  | 47 |
| GET | `/banking/accounts/:id/reconciliation` | BNK-001 | banking.view |  | 48 |
| POST | `/banking/lines/:id/match` | BNK-002 | banking.edit |  | 53 |
| POST | `/banking/lines/:id/unmatch` | BNK-002 | banking.edit |  | 58 |
| POST | `/banking/lines/:id/ignore` | BNK-002 | banking.edit |  | 59 |
| POST | `/banking/lines/:id/create` | BNK-002 | banking.create |  | 60 |
| GET | `/banking/rules` | BNK-003 | banking.view |  | 70 |
| POST | `/banking/rules` | BNK-003 | banking.edit |  | 71 |
| PUT | `/banking/rules/:id` | BNK-003 | banking.edit |  | 72 |
| GET | `/banking/settlements` | BNK-004 | banking.view |  | 74 |
| POST | `/banking/settlements` | BNK-004 | banking.create |  | 75 |


### `apps/api/src/routes/billreceipts.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/bill-receipts/open` | FIN-018 | accounts.view |  | 20 |
| POST | `/bill-receipts` | FIN-018 | accounts.create |  | 25 |


### `apps/api/src/routes/branchprices.ts` (6 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/branch-prices` | POS-005 | sales.view |  | 19 |
| POST | `/branch-prices` | POS-005 | sales.edit |  | 23 |
| POST | `/branch-prices/import` | POS-005 | sales.edit |  | 30 |
| POST | `/branch-prices/copy` | POS-005 | sales.edit |  | 34 |
| DELETE | `/branch-prices/:id` | POS-005 | sales.edit |  | 38 |
| GET | `/pos/branch-prices` | POS-006 | sales.view |  | 44 |


### `apps/api/src/routes/cashflow.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/cash-flow-statement` | FIN-019 | reports.view |  | 8 |


### `apps/api/src/routes/catalogue.ts` (14 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/styles/:id/images` | SAL-001 | inventory.view, sales.view |  | 34 |
| POST | `/styles/:id/images` | SAL-001 | inventory.edit |  | 35 |
| PATCH | `/style-images/:id` | SAL-002 | inventory.edit |  | 39 |
| GET | `/catalogue` | SAL-003 | inventory.view, sales.view |  | 44 |
| GET | `/catalogue/selections` | SAL-003 | inventory.view, sales.view |  | 55 |
| GET | `/catalogue/selections/:id` | SAL-003 | inventory.view, sales.view |  | 56 |
| POST | `/catalogue/selections` | SAL-003 | sales.create |  | 57 |
| PUT | `/catalogue/selections/:id` | SAL-003 | sales.create |  | 58 |
| DELETE | `/catalogue/selections/:id` | SAL-003 | sales.create |  | 59 |
| POST | `/catalogue/selections/:id/share` | SAL-003 | sales.create |  | 63 |
| DELETE | `/catalogue/selections/:id/share` | SAL-003 | sales.create |  | 67 |
| POST | `/catalogue/selections/:id/send` | SAL-003 | sales.create |  | 71 |
| GET | `/public/catalogue/:token` | SAL-004 | PUBLIC |  | 83 |
| GET | `/public/catalogue/:token/files/:fileId` | SAL-004 | PUBLIC |  | 87 |


### `apps/api/src/routes/changes.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/settings/approvals` | SEC-011 | settings.view |  | 11 |
| PUT | `/settings/approvals` | SEC-011 | settings.edit |  | 12 |
| GET | `/change-requests` | SEC-012 | settings.view |  | 17 |
| POST | `/change-requests/:id/decide` | SEC-012 | special.approveBankChange |  | 22 |


### `apps/api/src/routes/chat.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/chat/people` | AI-001 | NONE |  | 11 |
| GET | `/chat/unread` | AI-001 | NONE |  | 12 |
| GET | `/chat/:userId` | AI-001 | NONE |  | 13 |
| POST | `/chat/:userId` | AI-001 | NONE |  | 19 |


### `apps/api/src/routes/close.ts` (9 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/close/checklist` | FIN-020 | reports.view |  | 18 |
| POST | `/close/signoff` | FIN-020 | accounts.approve |  | 22 |
| DELETE | `/close/signoff` | FIN-020 | accounts.approve |  | 27 |
| POST | `/close/month` | FIN-020 | accounts.approve |  | 32 |
| POST | `/close/reopen` | FIN-020 | accounts.approve | yes | 36 |
| GET | `/close/snapshots` | FIN-020 | reports.view |  | 42 |
| GET | `/close/snapshots/:id` | FIN-020 | reports.view |  | 46 |
| GET | `/pos/day-close` | FIN-021 | sales.view |  | 51 |
| POST | `/pos/sessions/:id/sign-variance` | FIN-022 | sales.approve |  | 55 |


### `apps/api/src/routes/commission.ts` (10 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/agents` | SAL-005 | sales.view |  | 23 |
| GET | `/salesmen` | SAL-006 | sales.view |  | 33 |
| GET | `/reports/agent-commission` | SAL-007 | special.seeAgentCommission |  | 42 |
| GET | `/brokerage-bills` | SAL-008 | accounts.view |  | 48 |
| GET | `/brokerage-bills/:id` | SAL-008 | accounts.view |  | 52 |
| POST | `/brokerage-bills` | SAL-008 | accounts.create |  | 62 |
| POST | `/brokerage-bills/:id/cancel` | SAL-008 | accounts.cancel |  | 69 |
| GET | `/reports/salesman` | SAL-009 | sales.view |  | 76 |
| GET | `/reports/salesman-year` | SAL-010 | sales.view |  | 81 |
| PUT | `/sales-targets/:month` | SAL-011 | sales.approve |  | 86 |


### `apps/api/src/routes/comms.ts` (16 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/comms/meta` | CRM-001 | crm.view |  | 31 |
| GET | `/comms/templates` | CRM-002 | crm.view |  | 32 |
| PUT | `/comms/templates` | CRM-002 | crm.edit |  | 33 |
| GET | `/comms/settings` | CRM-003 | crm.view |  | 38 |
| PUT | `/comms/settings` | CRM-003 | crm.edit |  | 39 |
| POST | `/comms/reminders` | CRM-004 | crm.edit |  | 48 |
| GET | `/comms/consents` | CRM-005 | crm.view |  | 49 |
| PUT | `/comms/consents` | CRM-005 | crm.edit |  | 50 |
| POST | `/comms/opt-out` | CRM-006 | crm.edit |  | 54 |
| POST | `/comms/send` | CRM-007 | crm.edit |  | 59 |
| POST | `/comms/queue` | CRM-008 | crm.edit |  | 66 |
| POST | `/comms/broadcast` | CRM-009 | crm.edit |  | 70 |
| POST | `/comms/process` | CRM-010 | crm.edit |  | 74 |
| POST | `/comms/receipts` | CRM-011 | crm.edit |  | 75 |
| GET | `/comms/outbox` | CRM-012 | crm.view |  | 80 |
| GET | `/comms/report` | CRM-013 | crm.view |  | 84 |


### `apps/api/src/routes/commwebhooks.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/webhooks/whatsapp` | CRM-014 | PUBLIC |  | 16 |
| POST | `/webhooks/whatsapp` | CRM-014 | PUBLIC |  | 23 |
| POST | `/webhooks/sms` | CRM-014 | PUBLIC |  | 32 |


### `apps/api/src/routes/company.ts` (15 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/companies` | SEC-013 | company.view |  | 40 |
| PATCH | `/companies/:id` | SEC-013 | company.edit |  | 49 |
| POST | `/companies/:id/branches` | SEC-013 | company.edit |  | 68 |
| PATCH | `/branches/:id` | SEC-014 | company.edit |  | 85 |
| GET | `/fiscal-years` | SEC-015 | company.view |  | 103 |
| GET | `/number-series` | SEC-016 | settings.view |  | 108 |
| PATCH | `/number-series/:id` | SEC-016 | settings.edit |  | 123 |
| GET | `/audit-log` | SEC-017 | settings.view |  | 148 |
| POST | `/audit-log/verify` | SEC-017 | settings.view |  | 164 |
| GET | `/audit-log/anchor` | SEC-017 | settings.view |  | 170 |
| GET | `/audit-log/sensitive` | SEC-017 | settings.view |  | 222 |
| GET | `/export/business.zip` | SEC-018 | company.export |  | 176 |
| POST | `/export/business.vbk` | SEC-018 | company.export |  | 188 |
| POST | `/export/verify` | SEC-018 | company.export |  | 200 |
| POST | `/export/restore-test` | SEC-018 | company.export | yes | 210 |


### `apps/api/src/routes/consignment.ts` (8 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/consignees` | SAL-012 | sales.view |  | 22 |
| GET | `/consignees/:customerId` | SAL-012 | sales.view |  | 26 |
| GET | `/consignees/:customerId/terms` | SAL-012 | sales.view |  | 31 |
| PUT | `/consignees/:customerId/terms` | SAL-012 | sales.edit |  | 35 |
| GET | `/reports/consignment-sales` | SAL-013 | sales.view |  | 40 |
| POST | `/consignment/send` | SAL-014 | sales.create |  | 44 |
| POST | `/consignment/return` | SAL-014 | sales.create |  | 48 |
| POST | `/consignment/sales` | SAL-014 | sales.create |  | 52 |


### `apps/api/src/routes/controls.ts` (8 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/controls/sod` | SEC-019 | users.view |  | 16 |
| GET | `/controls/journals` | SEC-019 | reports.view |  | 17 |
| GET | `/controls/related-parties` | SEC-019 | reports.view |  | 21 |
| GET | `/controls/access-reviews` | SEC-019 | users.view |  | 32 |
| POST | `/controls/access-reviews` | SEC-019 | users.edit |  | 33 |
| POST | `/controls/access-reviews/:id/decide` | SEC-019 | users.edit |  | 34 |
| POST | `/controls/access-reviews/:id/complete` | SEC-019 | users.edit |  | 40 |
| PUT | `/accounts/:id/related-party` | SEC-020 | accounts.edit |  | 25 |


### `apps/api/src/routes/crm.ts` (17 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/crm/leads` | CRM-015 | crm.view |  | 31 |
| GET | `/crm/leads/:id` | CRM-015 | crm.view |  | 36 |
| POST | `/crm/leads` | CRM-015 | crm.create |  | 37 |
| PUT | `/crm/leads/:id` | CRM-015 | crm.edit |  | 38 |
| POST | `/crm/leads/:id/stage` | CRM-015 | crm.edit |  | 39 |
| POST | `/crm/leads/:id/convert` | CRM-015 | crm.edit |  | 44 |
| GET | `/crm/pipeline` | CRM-016 | crm.view |  | 35 |
| GET | `/crm/activities` | CRM-017 | crm.view |  | 53 |
| POST | `/crm/activities` | CRM-017 | crm.create |  | 57 |
| POST | `/crm/activities/:id/done` | CRM-017 | crm.edit |  | 58 |
| GET | `/crm/templates` | CRM-018 | crm.view |  | 63 |
| POST | `/crm/templates` | CRM-018 | crm.edit |  | 69 |
| PUT | `/crm/templates/:id` | CRM-018 | crm.edit |  | 70 |
| GET | `/crm/messaging` | CRM-019 | crm.view |  | 64 |
| POST | `/crm/messages` | CRM-020 | crm.create |  | 71 |
| POST | `/crm/customers/:id/remind` | CRM-021 | crm.create |  | 76 |
| GET | `/crm/customers/:id` | CRM-021 | crm.view |  | 80 |


### `apps/api/src/routes/cron.ts` (7 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/cron/reports` | SEC-021 | NONE |  | 21 |
| GET | `/cron/backups` | SEC-021 | NONE |  | 25 |
| GET | `/cron/comms` | SEC-021 | NONE |  | 29 |
| GET | `/cron/reminders` | SEC-021 | NONE |  | 33 |
| GET | `/cron/statements` | SEC-021 | NONE |  | 37 |
| GET | `/cron/changes` | SEC-021 | NONE |  | 41 |
| GET | `/cron/audit-seal` | SEC-021 | NONE |  | 45 |


### `apps/api/src/routes/dailysales.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/daily-sales` | POS-007 | reports.view |  | 10 |


### `apps/api/src/routes/deliveryorders.ts` (5 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/delivery-orders` | SAL-015 | sales.view |  | 22 |
| GET | `/delivery-orders/:id` | SAL-015 | sales.view |  | 27 |
| POST | `/delivery-orders` | SAL-015 | sales.create |  | 31 |
| POST | `/delivery-orders/:id/close` | SAL-015 | sales.create |  | 37 |
| POST | `/delivery-orders/:id/cancel` | SAL-015 | sales.cancel |  | 42 |


### `apps/api/src/routes/discounts.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/discounts` | POS-008 | reports.view |  | 12 |


### `apps/api/src/routes/distribution.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/branch-comparison` | INV-001 | reports.view |  | 22 |
| POST | `/allocations/propose` | INV-002 | inventory.view |  | 26 |
| POST | `/allocations/dispatch` | INV-002 | inventory.create |  | 30 |


### `apps/api/src/routes/expenses.ts` (18 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| POST | `/files` | EXP-001 | expenses.create, purchase.create, sales.create, inventory.edit |  | 26 |
| GET | `/files/:id` | EXP-001 | expenses.view, purchase.view, sales.view, inventory.view |  | 30 |
| POST | `/files/:id/read` | EXP-001 | expenses.create |  | 35 |
| GET | `/expenses/people` | EXP-002 | expenses.view |  | 38 |
| GET | `/expenses/categories` | EXP-002 | expenses.view |  | 48 |
| POST | `/expenses/categories` | EXP-002 | expenses.approve |  | 49 |
| PUT | `/expenses/categories/:id` | EXP-002 | expenses.approve |  | 50 |
| GET | `/expenses/claims` | EXP-002 | expenses.view |  | 67 |
| GET | `/expenses/totals` | EXP-002 | expenses.view |  | 71 |
| GET | `/expenses/claims/:id` | EXP-002 | expenses.view |  | 72 |
| POST | `/expenses/claims` | EXP-002 | expenses.create |  | 73 |
| PUT | `/expenses/claims/:id` | EXP-002 | expenses.edit |  | 74 |
| POST | `/expenses/claims/:id/submit` | EXP-002 | expenses.submit |  | 75 |
| POST | `/expenses/claims/:id/approve` | EXP-002 | expenses.approve |  | 76 |
| POST | `/expenses/claims/:id/reject` | EXP-002 | expenses.approve |  | 77 |
| POST | `/expenses/claims/:id/pay` | EXP-002 | expenses.approve |  | 82 |
| POST | `/expenses/claims/:id/cancel` | EXP-002 | expenses.cancel |  | 87 |
| GET | `/reports/travel-claims` | EXP-003 | expenses.view |  | 52 |


### `apps/api/src/routes/exports.ts` (10 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/exports/shipments` | TAX-001 | gst.view |  | 18 |
| PUT | `/exports/shipments/:invoiceId` | TAX-001 | gst.submit |  | 19 |
| GET | `/exports/rates` | TAX-001 | gst.view |  | 28 |
| POST | `/exports/rates` | TAX-001 | gst.submit |  | 29 |
| DELETE | `/exports/rates/:id` | TAX-001 | gst.submit |  | 33 |
| GET | `/exports/incentive` | TAX-001 | gst.view |  | 38 |
| GET | `/exports/scrips` | TAX-001 | gst.view |  | 43 |
| POST | `/exports/scrips` | TAX-001 | gst.submit |  | 44 |
| POST | `/exports/scrips/:id/use` | TAX-001 | gst.submit |  | 48 |
| GET | `/exports/inverted-duty` | TAX-001 | gst.view |  | 54 |


### `apps/api/src/routes/gst.ts` (17 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/gst/settings` | TAX-002 | gst.view |  | 22 |
| PUT | `/gst/settings` | TAX-002 | gst.edit |  | 41 |
| GET | `/print-language` | TAX-003 | gst.edit |  | 32 |
| GET | `/gst/gstr1` | TAX-004 | gst.view |  | 58 |
| GET | `/gst/gstr3b` | TAX-005 | gst.view |  | 64 |
| GET | `/gst/portal` | TAX-006 | gst.view |  | 76 |
| POST | `/gst/portal/otp` | TAX-006 | gst.submit |  | 80 |
| POST | `/gst/portal/connect` | TAX-006 | gst.submit |  | 86 |
| POST | `/gst/portal/disconnect` | TAX-006 | gst.submit |  | 91 |
| GET | `/gst/filings` | TAX-007 | gst.view |  | 97 |
| POST | `/gst/filings/upload` | TAX-007 | gst.submit |  | 101 |
| POST | `/gst/filings/otp` | TAX-007 | gst.approve |  | 107 |
| POST | `/gst/filings/file` | TAX-007 | gst.approve |  | 113 |
| GET | `/reports/${kind}s` | TAX-008 | reports.view |  | 120 |
| POST | `/import/parties` | TAX-009 | accounts.create, special.importData |  | 129 |
| POST | `/import/items` | TAX-009 | inventory.create, special.importData |  | 141 |
| POST | `/import/tally` | TAX-009 | accounts.create, special.importData |  | 153 |


### `apps/api/src/routes/gstjv.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/gst-jv/position` | TAX-010 | accounts.view |  | 22 |
| POST | `/gst-jv` | TAX-010 | accounts.create |  | 26 |


### `apps/api/src/routes/gstwork.ts` (23 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/gst/work/settings` | TAX-011 | gst.view |  | 18 |
| PUT | `/gst/work/settings` | TAX-011 | gst.submit |  | 19 |
| GET | `/gst/work/calendar` | TAX-011 | gst.view |  | 27 |
| GET | `/gst/work/einvoice-alerts` | TAX-011 | gst.view |  | 28 |
| GET | `/gst/work/slab-exceptions` | TAX-011 | gst.view |  | 29 |
| GET | `/gst/work/rule37` | TAX-011 | gst.view |  | 33 |
| GET | `/gst/work/2b` | TAX-011 | gst.view |  | 35 |
| POST | `/gst/work/2b` | TAX-011 | gst.submit |  | 36 |
| GET | `/gst/work/2b/:period` | TAX-011 | gst.view |  | 40 |
| POST | `/gst/work/2b/rows/:id/decide` | TAX-011 | gst.submit |  | 44 |
| GET | `/gst/work/2a` | TAX-011 | gst.view |  | 52 |
| POST | `/gst/work/2a` | TAX-011 | gst.submit |  | 53 |
| GET | `/gst/work/2a/:period` | TAX-011 | gst.view |  | 57 |
| GET | `/gst/work/2a/:period/vs-2b` | TAX-011 | gst.view |  | 61 |
| GET | `/gst/work/rule37a` | TAX-011 | gst.view |  | 68 |
| GET | `/gst/work/itc-reversals` | TAX-011 | gst.view |  | 72 |
| POST | `/gst/work/itc-reversals` | TAX-011 | gst.submit |  | 73 |
| POST | `/gst/work/itc-reversals/:id/reclaim` | TAX-011 | gst.submit |  | 77 |
| GET | `/gst/work/gstr9c` | TAX-011 | gst.view |  | 85 |
| GET | `/gst/work/gstr4` | TAX-011 | gst.view |  | 89 |
| GET | `/gst/work/approvals` | TAX-011 | gst.view |  | 95 |
| POST | `/gst/work/approvals` | TAX-011 | gst.submit |  | 96 |
| POST | `/gst/work/approvals/:id/decide` | TAX-011 | gst.approve |  | 100 |


### `apps/api/src/routes/hr.ts` (69 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/employees` | HR-001 | hr.view |  | 59 |
| GET | `/employees/:id` | HR-001 | hr.view |  | 60 |
| POST | `/employees` | HR-001 | hr.create |  | 61 |
| PATCH | `/employees/:id` | HR-001 | hr.edit |  | 65 |
| POST | `/employees/:id/salary` | HR-001 | payroll.edit |  | 70 |
| GET | `/employees/:id/tax-declaration` | HR-001 | payroll.view |  | 74 |
| PUT | `/employees/:id/tax-declaration` | HR-001 | payroll.edit |  | 78 |
| GET | `/employees/:id/payslips` | HR-001 | payroll.view |  | 86 |
| GET | `/employees/:id/leave-balances` | HR-001 | hr.view |  | 87 |
| PUT | `/employees/:id/leave-openings` | HR-001 | hr.edit |  | 91 |
| GET | `/employees/:id/settlement` | HR-001 | payroll.view |  | 95 |
| POST | `/employees/:id/settle` | HR-001 | payroll.approve |  | 99 |
| GET | `/employees/:id/loans` | HR-001 | payroll.view |  | 211 |
| POST | `/employees/:id/loans` | HR-001 | payroll.create |  | 212 |
| GET | `/employees/:id/reviews` | HR-001 | hr.view |  | 219 |
| POST | `/employees/:id/reviews` | HR-001 | hr.edit |  | 220 |
| DELETE | `/employees/:id/reviews/:reviewId` | HR-001 | hr.edit |  | 224 |
| POST | `/employees/:id/stipends` | HR-001 | payroll.create |  | 239 |
| POST | `/employees/:id/loan-requests` | HR-001 | payroll.create |  | 253 |
| GET | `/employees/:id/documents` | HR-001 | hr.view |  | 265 |
| POST | `/employees/:id/documents` | HR-001 | hr.edit |  | 266 |
| PATCH | `/employees/:id/documents/:docId` | HR-001 | hr.edit |  | 270 |
| DELETE | `/employees/:id/documents/:docId` | HR-001 | hr.edit |  | 274 |
| GET | `/employees/:id/form16` | HR-001 | payroll.view |  | 347 |
| GET | `/holidays` | HR-002 | hr.view |  | 105 |
| POST | `/holidays` | HR-002 | hr.edit |  | 109 |
| DELETE | `/holidays/:id` | HR-002 | hr.edit |  | 113 |
| GET | `/attendance` | HR-003 | hr.view |  | 118 |
| PUT | `/attendance` | HR-003 | hr.edit |  | 122 |
| POST | `/attendance/import` | HR-003 | hr.edit |  | 315 |
| GET | `/hr/week-off-changes` | HR-004 | hr.view |  | 128 |
| POST | `/hr/week-off-changes` | HR-004 | hr.edit |  | 132 |
| DELETE | `/hr/week-off-changes/:id` | HR-004 | hr.edit |  | 137 |
| GET | `/leave-types` | HR-005 | hr.view |  | 143 |
| GET | `/leave-requests` | HR-006 | hr.view |  | 144 |
| POST | `/leave-requests` | HR-006 | hr.create |  | 148 |
| POST | `/leave-requests/:id/${action}` | HR-006 | hr.approve |  | 153 |
| POST | `/leave-requests/:id/cancel` | HR-006 | hr.edit |  | 158 |
| GET | `/payroll/settings` | HR-007 | payroll.view |  | 164 |
| PUT | `/payroll/settings` | HR-007 | payroll.edit |  | 165 |
| GET | `/payroll-runs` | HR-008 | payroll.view |  | 176 |
| GET | `/payroll-runs/:id` | HR-008 | payroll.view |  | 177 |
| POST | `/payroll-runs` | HR-008 | payroll.create |  | 178 |
| POST | `/payroll-runs/:id/refresh` | HR-008 | payroll.edit |  | 182 |
| PATCH | `/payroll-runs/:id/payslips/:payslipId` | HR-008 | payroll.edit |  | 183 |
| POST | `/payroll-runs/:id/finalize` | HR-008 | payroll.approve |  | 193 |
| POST | `/payroll-runs/:id/pay` | HR-008 | payroll.submit |  | 194 |
| POST | `/payroll-runs/:id/cancel` | HR-008 | payroll.cancel |  | 198 |
| GET | `/payroll-runs/:id/${name}` | HR-008 | payroll.export |  | 204 |
| GET | `/payroll-runs/:id/register` | HR-008 | payroll.export |  | 207 |
| POST | `/payroll-runs/:id/email` | HR-008 | payroll.submit |  | 208 |
| GET | `/payslips/:id` | HR-009 | payroll.view |  | 206 |
| GET | `/hr/attendance-alerts` | HR-010 | hr.view |  | 230 |
| GET | `/stipends` | HR-011 | payroll.view |  | 235 |
| POST | `/stipends/:id/cancel` | HR-011 | payroll.cancel |  | 243 |
| GET | `/loan-requests` | HR-012 | payroll.view |  | 249 |
| POST | `/loan-requests/:id/decide` | HR-012 | payroll.approve |  | 257 |
| GET | `/hr/documents/expiring` | HR-013 | hr.view |  | 279 |
| GET | `/loans/:id/receipts` | HR-014 | payroll.view |  | 284 |
| POST | `/loans/:id/receipts` | HR-014 | payroll.create |  | 285 |
| POST | `/loans/:id/cancel` | HR-014 | payroll.cancel |  | 294 |
| POST | `/loan-receipts/:id/cancel` | HR-015 | payroll.cancel |  | 289 |
| GET | `/shifts` | HR-016 | hr.view |  | 306 |
| POST | `/shifts` | HR-016 | hr.edit |  | 307 |
| PUT | `/shifts/:id` | HR-016 | hr.edit |  | 311 |
| GET | `/statutory/dues` | HR-017 | payroll.view |  | 324 |
| POST | `/statutory/payments` | HR-017 | payroll.submit |  | 328 |
| POST | `/statutory/payments/:id/cancel` | HR-017 | payroll.cancel |  | 335 |
| GET | `/tds/24q` | HR-018 | payroll.view |  | 340 |


### `apps/api/src/routes/hsn.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/hsn` | INV-003 | inventory.view |  | 18 |
| POST | `/hsn` | INV-003 | inventory.create |  | 23 |
| PATCH | `/hsn/:id` | INV-003 | inventory.edit |  | 28 |
| POST | `/hsn/seed-standard` | INV-003 | inventory.create |  | 34 |


### `apps/api/src/routes/iclock.ts` (10 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/iclock/cdata` | HR-019 | PUBLIC |  | 23 |
| POST | `/iclock/cdata` | HR-019 | PUBLIC |  | 35 |
| GET | `/iclock/getrequest` | HR-019 | PUBLIC |  | 44 |
| POST | `/iclock/devicecmd` | HR-019 | hr.view |  | 49 |
| GET | `/attendance/devices` | HR-020 | hr.view |  | 53 |
| POST | `/attendance/devices` | HR-020 | hr.edit |  | 54 |
| PATCH | `/attendance/devices/:id` | HR-020 | hr.edit |  | 59 |
| DELETE | `/attendance/devices/:id` | HR-020 | hr.edit |  | 64 |
| GET | `/attendance/punches` | HR-020 | hr.view |  | 69 |
| POST | `/attendance/punches/reprocess` | HR-020 | hr.edit |  | 70 |


### `apps/api/src/routes/insights.ts` (17 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/analytics/dashboard` | RPT-001 | reports.view |  | 36 |
| GET | `/analytics/insights` | RPT-001 | reports.view |  | 41 |
| GET | `/analytics/checks` | RPT-001 | reports.view |  | 67 |
| GET | `/reports/colour-size` | RPT-002 | inventory.view, reports.view |  | 48 |
| GET | `/reports/stock-ageing` | RPT-003 | inventory.view, reports.view |  | 57 |
| GET | `/reports/sales-register` | RPT-004 | sales.view, reports.view |  | 61 |
| GET | `/reports/builder/datasets` | RPT-005 | NONE |  | 74 |
| POST | `/reports/builder/run` | RPT-005 | NONE |  | 75 |
| POST | `/reports/builder/csv` | RPT-005 | reports.export |  | 80 |
| POST | `/reports/builder/email` | RPT-005 | reports.export |  | 86 |
| GET | `/reports/saved` | RPT-006 | reports.view |  | 97 |
| POST | `/reports/saved` | RPT-006 | reports.export |  | 98 |
| PUT | `/reports/saved/:id` | RPT-006 | reports.export |  | 99 |
| DELETE | `/reports/saved/:id` | RPT-006 | reports.export |  | 100 |
| GET | `/assistant/tools` | RPT-007 | NONE |  | 103 |
| POST | `/assistant/ask` | RPT-007 | NONE |  | 104 |
| POST | `/purchase-bills/read` | RPT-008 | purchase.create |  | 114 |


### `apps/api/src/routes/inventory.ts` (20 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/inventory/setup` | INV-004 | inventory.view |  | 52 |
| PATCH | `/inventory/valuation-method` | INV-005 | inventory.approve |  | 66 |
| POST | `/warehouses` | INV-006 | inventory.create |  | 77 |
| GET | `/items` | INV-007 | inventory.view |  | 93 |
| POST | `/items/barcodes/generate` | INV-007 | inventory.edit |  | 114 |
| GET | `/items/:id/barcodes` | INV-007 | inventory.view |  | 119 |
| POST | `/items/:id/barcodes` | INV-007 | inventory.edit |  | 124 |
| DELETE | `/items/barcodes/:id` | INV-007 | inventory.edit |  | 130 |
| GET | `/items/by-code` | INV-007 | inventory.view |  | 137 |
| PUT | `/items/:id/units` | INV-007 | inventory.edit |  | 148 |
| GET | `/items/:id` | INV-007 | inventory.view |  | 155 |
| POST | `/items` | INV-007 | inventory.create |  | 168 |
| PATCH | `/items/:id` | INV-007 | inventory.edit |  | 186 |
| GET | `/stock-journals` | INV-008 | inventory.view |  | 205 |
| GET | `/stock-journals/:id` | INV-008 | inventory.view |  | 218 |
| POST | `/stock-journals` | INV-008 | inventory.create |  | 231 |
| POST | `/stock-journals/:id/cancel` | INV-008 | inventory.cancel |  | 247 |
| GET | `/reports/stock-summary` | INV-009 | inventory.view |  | 257 |
| GET | `/reports/item-ledger/:itemId` | INV-010 | inventory.view |  | 265 |
| GET | `/reports/reorder` | INV-011 | inventory.view |  | 276 |


### `apps/api/src/routes/lookups.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/lookups` | INV-012 | sales.view, inventory.view, hr.view |  | 26 |
| GET | `/lookups/:kind` | INV-012 | sales.view, inventory.view, hr.view |  | 30 |
| POST | `/lookups/:kind` | INV-012 | sales.create, inventory.create, hr.create |  | 36 |
| PATCH | `/lookups/:kind/:id` | INV-012 | sales.edit, inventory.edit, hr.edit |  | 43 |


### `apps/api/src/routes/losses.ts` (6 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/stock-losses` | INV-013 | inventory.view |  | 16 |
| POST | `/stock-losses` | INV-013 | inventory.create |  | 20 |
| POST | `/stock-losses/:id/decide` | INV-013 | inventory.approve |  | 28 |
| GET | `/stock-losses/settings` | INV-013 | inventory.view |  | 33 |
| PUT | `/stock-losses/settings` | INV-013 | inventory.approve |  | 34 |
| GET | `/reports/stock-losses` | INV-014 | inventory.view |  | 38 |


### `apps/api/src/routes/loyalty.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/loyalty/members` | POS-009 | sales.view |  | 15 |
| PATCH | `/loyalty/members/:phone` | POS-009 | sales.edit |  | 20 |
| GET | `/loyalty/upcoming` | POS-009 | sales.view |  | 26 |
| GET | `/loyalty/report` | POS-009 | sales.view |  | 31 |


### `apps/api/src/routes/lr.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/lr-entries` | SAL-016 | sales.view |  | 24 |
| POST | `/lr-entries` | SAL-016 | sales.create |  | 29 |
| PATCH | `/lr-entries/:id` | SAL-016 | sales.edit |  | 34 |


### `apps/api/src/routes/manufacturing.ts` (22 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/work-centres` | MFG-001 | inventory.view |  | 29 |
| POST | `/work-centres` | MFG-001 | inventory.edit |  | 30 |
| PUT | `/work-centres/:id` | MFG-001 | inventory.edit |  | 31 |
| GET | `/boms` | MFG-002 | inventory.view |  | 33 |
| GET | `/boms/:id` | MFG-002 | inventory.view |  | 34 |
| POST | `/boms` | MFG-002 | inventory.create |  | 35 |
| POST | `/boms/:id/default` | MFG-002 | inventory.edit |  | 43 |
| POST | `/boms/:id/archive` | MFG-002 | inventory.edit |  | 44 |
| GET | `/production-orders` | MFG-003 | inventory.view |  | 47 |
| GET | `/production-orders/:id` | MFG-003 | inventory.view |  | 48 |
| POST | `/production-orders` | MFG-003 | inventory.create |  | 49 |
| POST | `/production-orders/:id/release` | MFG-003 | inventory.edit |  | 56 |
| POST | `/production-orders/:id/issue` | MFG-003 | inventory.create |  | 57 |
| POST | `/production-orders/:id/complete` | MFG-003 | inventory.create |  | 61 |
| POST | `/production-orders/:id/cancel` | MFG-003 | inventory.cancel |  | 65 |
| GET | `/mrp` | MFG-004 | inventory.view |  | 72 |
| POST | `/mrp/convert` | MFG-004 | purchase.create |  | 76 |
| GET | `/job-work` | MFG-005 | inventory.view |  | 85 |
| POST | `/job-work/send` | MFG-005 | inventory.create |  | 86 |
| POST | `/job-work/receive` | MFG-005 | inventory.create |  | 93 |
| POST | `/job-work/:id/cancel` | MFG-005 | inventory.cancel |  | 100 |
| GET | `/job-work/itc04` | MFG-005 | gst.view |  | 105 |


### `apps/api/src/routes/marginbands.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/margin-bands` | INV-015 | inventory.view |  | 11 |
| PUT | `/margin-bands` | INV-015 | inventory.approve |  | 12 |
| GET | `/margin-bands/price` | INV-015 | inventory.view |  | 17 |


### `apps/api/src/routes/merge.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| POST | `/accounts/:id/merge` | INV-016 | accounts.edit |  | 11 |
| POST | `/items/:id/merge` | INV-017 | inventory.edit |  | 17 |


### `apps/api/src/routes/msme.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/msme` | TAX-012 | accounts.view |  | 10 |


### `apps/api/src/routes/notes.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/notes` | AI-002 | NONE |  | 19 |
| POST | `/notes` | AI-002 | NONE |  | 27 |
| PATCH | `/notes/:id` | AI-002 | NONE |  | 33 |
| DELETE | `/notes/:id` | AI-002 | NONE |  | 44 |


### `apps/api/src/routes/offline.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/sync/offline-rules` | SYN-001 | NONE |  | 7 |


### `apps/api/src/routes/orderregister.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/sales-order-register` | SAL-017 | sales.view |  | 10 |


### `apps/api/src/routes/pos.ts` (27 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/schemes` | POS-010 | sales.view |  | 61 |
| POST | `/schemes` | POS-010 | sales.edit |  | 63 |
| PUT | `/schemes/:id` | POS-010 | sales.edit |  | 67 |
| GET | `/pos/schemes` | POS-011 | sales.view |  | 62 |
| GET | `/pos/settings` | POS-012 | sales.view |  | 72 |
| PUT | `/pos/settings` | POS-012 | sales.edit |  | 73 |
| GET | `/pos/terminals` | POS-013 | sales.view |  | 88 |
| POST | `/pos/terminals` | POS-013 | sales.edit |  | 89 |
| PUT | `/pos/terminals/:id` | POS-013 | sales.edit |  | 90 |
| POST | `/pos/sessions` | POS-014 | sales.create |  | 93 |
| GET | `/pos/sessions/:id` | POS-014 | sales.view |  | 97 |
| POST | `/pos/sessions/:id/close` | POS-014 | sales.create |  | 98 |
| GET | `/pos/bills` | POS-015 | sales.view |  | 103 |
| GET | `/pos/bills/lookup` | POS-015 | sales.view |  | 107 |
| GET | `/pos/bills/:id` | POS-015 | sales.view |  | 124 |
| POST | `/pos/bills` | POS-015 | sales.create |  | 125 |
| POST | `/pos/bills/:id/send` | POS-015 | sales.create |  | 140 |
| POST | `/pos/bills/:id/void` | POS-015 | sales.cancel |  | 144 |
| POST | `/pos/returns` | POS-016 | sales.create |  | 112 |
| GET | `/pos/returns` | POS-016 | sales.view |  | 119 |
| GET | `/pos/summary` | POS-017 | sales.view |  | 149 |
| GET | `/pos/held` | POS-018 | sales.view |  | 154 |
| POST | `/pos/held` | POS-018 | sales.create |  | 155 |
| POST | `/pos/held/:id/resume` | POS-018 | sales.create |  | 162 |
| GET | `/pos/salesmen` | POS-019 | sales.view |  | 163 |
| GET | `/pos/customers/:phone` | POS-020 | sales.view |  | 164 |
| GET | `/pos/loyalty/:phone` | POS-021 | sales.view |  | 168 |


### `apps/api/src/routes/pricelists.ts` (6 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/price-lists` | SAL-018 | sales.view |  | 23 |
| GET | `/price-lists/:id` | SAL-018 | sales.view |  | 37 |
| GET | `/price-lists/:id/rates` | SAL-018 | sales.view |  | 54 |
| POST | `/price-lists` | SAL-018 | sales.edit |  | 92 |
| PUT | `/price-lists/:id` | SAL-018 | sales.edit |  | 96 |
| GET | `/reports/interest` | SAL-019 | reports.view |  | 101 |


### `apps/api/src/routes/processlocks.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/settings/process-locks` | SEC-022 | settings.view |  | 9 |
| PUT | `/settings/process-locks` | SEC-022 | settings.edit |  | 10 |


### `apps/api/src/routes/profitability.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/profitability` | RPT-009 | reports.view |  | 11 |


### `apps/api/src/routes/projects.ts` (19 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/projects` | PRJ-001 | projects.view |  | 32 |
| GET | `/projects/:id` | PRJ-001 | projects.view |  | 33 |
| POST | `/projects` | PRJ-001 | projects.create |  | 34 |
| PUT | `/projects/:id` | PRJ-001 | projects.edit |  | 35 |
| POST | `/projects/:id/tasks` | PRJ-001 | projects.edit |  | 41 |
| PUT | `/projects/:id/tasks/:childId` | PRJ-001 | projects.edit |  | 42 |
| DELETE | `/projects/:id/tasks/:childId` | PRJ-001 | projects.edit |  | 46 |
| PUT | `/projects/:id/members` | PRJ-001 | projects.edit |  | 52 |
| DELETE | `/projects/:id/members/:childId` | PRJ-001 | projects.edit |  | 57 |
| POST | `/projects/:id/milestones` | PRJ-001 | projects.edit |  | 64 |
| PUT | `/projects/:id/milestones/:childId` | PRJ-001 | projects.edit |  | 65 |
| DELETE | `/projects/:id/milestones/:childId` | PRJ-001 | projects.edit |  | 69 |
| POST | `/projects/:id/milestones/:childId/bill` | PRJ-001 | sales.create |  | 74 |
| POST | `/projects/:id/bill-time` | PRJ-001 | sales.create |  | 80 |
| GET | `/projects/people` | PRJ-001 | projects.view |  | 87 |
| GET | `/timesheets` | PRJ-002 | projects.view |  | 93 |
| POST | `/timesheets` | PRJ-002 | projects.create |  | 100 |
| DELETE | `/timesheets/:id` | PRJ-002 | projects.create |  | 106 |
| POST | `/timesheets/decide` | PRJ-002 | projects.approve |  | 107 |


### `apps/api/src/routes/purchasing.ts` (18 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/purchase-orders/:id` | PUR-001 | purchase.view |  | 64 |
| POST | `/purchase-orders` | PUR-001 | purchase.create |  | 79 |
| POST | `/purchase-orders/:id/close` | PUR-001 | purchase.edit |  | 88 |
| POST | `/purchase-orders/:id/cancel` | PUR-001 | purchase.cancel |  | 94 |
| GET | `/goods-receipts/:id` | PUR-002 | purchase.view |  | 66 |
| POST | `/goods-receipts` | PUR-002 | purchase.create |  | 100 |
| GET | `/goods-receipts/holds` | PUR-002 | purchase.view |  | 118 |
| POST | `/goods-receipts/:id/release-hold` | PUR-002 | purchase.approve |  | 123 |
| POST | `/goods-receipts/:id/return` | PUR-002 | purchase.create |  | 129 |
| POST | `/goods-receipts/:id/cancel` | PUR-002 | purchase.cancel |  | 135 |
| GET | `/items/:id/purchase-history` | PUR-003 | purchase.view |  | 68 |
| GET | `/purchase-bills/:id` | PUR-004 | purchase.view |  | 72 |
| POST | `/purchase-bills` | PUR-004 | purchase.create |  | 142 |
| POST | `/purchase-bills/:id/cancel` | PUR-004 | purchase.cancel |  | 159 |
| GET | `/purchase-returns/:id` | PUR-005 | purchase.view |  | 74 |
| POST | `/purchase-returns` | PUR-005 | purchase.create |  | 166 |
| POST | `/purchase-returns/:id/cancel` | PUR-005 | purchase.cancel |  | 176 |
| GET | `/reports/supplier-claims` | PUR-006 | purchase.view |  | 119 |


### `apps/api/src/routes/rateupdate.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| POST | `/inventory/rate-update` | INV-018 | inventory.edit |  | 20 |
| POST | `/inventory/rate-update/request` | INV-018 | inventory.edit |  | 27 |
| GET | `/inventory/rate-update/requests` | INV-018 | inventory.view |  | 32 |
| POST | `/inventory/rate-update/requests/:id/decide` | INV-018 | inventory.approve |  | 33 |


### `apps/api/src/routes/recon.ts` (9 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/recon/runs` | BNK-005 | accounts.view |  | 17 |
| GET | `/recon/runs/:id` | BNK-005 | accounts.view |  | 18 |
| POST | `/recon/runs` | BNK-005 | accounts.create |  | 22 |
| POST | `/recon/runs/:id/match` | BNK-005 | accounts.create |  | 30 |
| POST | `/recon/runs/:id/unmatch` | BNK-005 | accounts.create |  | 35 |
| PATCH | `/recon/items/:id` | BNK-005 | accounts.create |  | 41 |
| POST | `/recon/runs/:id/writeoffs` | BNK-005 | accounts.create |  | 47 |
| POST | `/recon/writeoffs/:id/decide` | BNK-005 | accounts.approve |  | 52 |
| POST | `/recon/runs/:id/close` | BNK-005 | accounts.approve |  | 58 |


### `apps/api/src/routes/relabel.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/relabels` | INV-019 | inventory.view |  | 13 |
| GET | `/relabels/:id` | INV-019 | inventory.view |  | 14 |
| POST | `/relabels` | INV-019 | inventory.edit |  | 15 |


### `apps/api/src/routes/repairs.ts` (10 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/repairs` | POS-022 | sales.view |  | 28 |
| GET | `/repairs/from-sale` | POS-022 | sales.view |  | 33 |
| GET | `/repairs/open` | POS-022 | sales.view |  | 38 |
| GET | `/repairs/:id` | POS-022 | sales.view |  | 39 |
| POST | `/repairs` | POS-022 | sales.create |  | 40 |
| POST | `/repairs/:id/act` | POS-022 | sales.edit |  | 50 |
| GET | `/inquiries` | POS-023 | sales.view |  | 57 |
| POST | `/inquiries` | POS-023 | sales.create |  | 62 |
| POST | `/inquiries/:id/close` | POS-023 | sales.edit |  | 67 |
| GET | `/reports/service-customers` | POS-024 | sales.view |  | 72 |


### `apps/api/src/routes/retailreports.ts` (7 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/register` | RPT-010 | reports.view |  | 17 |
| GET | `/reports/year-comparison` | RPT-011 | reports.view |  | 21 |
| GET | `/reports/sales-vs-purchases` | RPT-012 | reports.view |  | 25 |
| GET | `/reports/profit-by` | RPT-013 | reports.view |  | 29 |
| GET | `/reports/stock-ratios` | RPT-014 | reports.view |  | 33 |
| GET | `/reports/vendor-analysis` | RPT-015 | reports.view |  | 37 |
| GET | `/reports/purchase-backlog` | RPT-016 | reports.view |  | 41 |


### `apps/api/src/routes/sales.ts` (29 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/quotations/:id` | SAL-020 | sales.view |  | 86 |
| GET | `/quotations/:id/print` | SAL-020 | sales.view |  | 146 |
| POST | `/quotations` | SAL-020 | sales.create |  | 166 |
| POST | `/quotations/:id/${action}` | SAL-020 | custom guard |  | 176 |
| GET | `/sales-orders/:id` | SAL-021 | sales.view |  | 87 |
| POST | `/sales-orders` | SAL-021 | sales.create |  | 183 |
| POST | `/sales-orders/:id/close` | SAL-021 | sales.edit |  | 192 |
| POST | `/sales-orders/:id/cancel` | SAL-021 | sales.cancel |  | 197 |
| GET | `/delivery-notes/:id` | SAL-022 | sales.view |  | 88 |
| GET | `/delivery-notes/:id/print` | SAL-022 | sales.view |  | 108 |
| POST | `/delivery-notes` | SAL-022 | sales.create |  | 203 |
| POST | `/delivery-notes/:id/returns` | SAL-022 | sales.create |  | 214 |
| POST | `/delivery-notes/:id/cancel` | SAL-022 | sales.cancel |  | 219 |
| GET | `/approvals/pending` | SAL-023 | sales.view |  | 96 |
| GET | `/samples/pending` | SAL-024 | sales.view |  | 102 |
| GET | `/sales-invoices/:id/early-discount` | SAL-025 | sales.view |  | 129 |
| GET | `/sales-invoices/:id` | SAL-025 | sales.view |  | 134 |
| GET | `/sales-invoices/:id/print` | SAL-025 | sales.view |  | 138 |
| POST | `/sales-invoices` | SAL-025 | sales.create |  | 226 |
| POST | `/sales-invoices/:id/cancel` | SAL-025 | sales.cancel |  | 245 |
| POST | `/sales-invoices/:id/eway-bill` | SAL-025 | gst.submit |  | 284 |
| POST | `/sales-invoices/:id/eway-bill/vehicle` | SAL-025 | gst.submit |  | 292 |
| POST | `/sales-invoices/:id/eway-bill/extend` | SAL-025 | gst.submit |  | 298 |
| POST | `/sales-invoices/:id/eway-bill/cancel` | SAL-025 | gst.cancel |  | 306 |
| GET | `/credit-notes/:id` | SAL-026 | sales.view |  | 135 |
| POST | `/credit-notes` | SAL-026 | sales.create |  | 252 |
| POST | `/credit-notes/:id/cancel` | SAL-026 | sales.cancel |  | 262 |
| POST | `/${path}/:id/einvoice` | SAL-027 | gst.submit |  | 272 |
| POST | `/${path}/:id/einvoice/cancel` | SAL-027 | gst.cancel |  | 276 |


### `apps/api/src/routes/salesmancomm.ts` (5 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/salesman-commission/rules` | SAL-028 | payroll.view |  | 18 |
| POST | `/salesman-commission/rules` | SAL-028 | payroll.edit |  | 22 |
| PUT | `/salesman-commission/rules/:id` | SAL-028 | payroll.edit |  | 27 |
| DELETE | `/salesman-commission/rules/:id` | SAL-028 | payroll.edit |  | 32 |
| GET | `/salesman-commission/report` | SAL-028 | payroll.view |  | 37 |


### `apps/api/src/routes/scenarios.ts` (6 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/scenarios/kinds` | FIN-023 | reports.view |  | 29 |
| GET | `/scenarios/baseline` | FIN-023 | reports.view |  | 30 |
| POST | `/scenarios/preview` | FIN-023 | reports.view |  | 31 |
| GET | `/scenarios` | FIN-023 | reports.view |  | 35 |
| POST | `/scenarios` | FIN-023 | reports.view |  | 36 |
| DELETE | `/scenarios/:id` | FIN-023 | reports.view |  | 40 |


### `apps/api/src/routes/scheduledchanges.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/config/fields` | SEC-023 | settings.view |  | 13 |
| GET | `/config/changes` | SEC-023 | settings.view |  | 14 |
| POST | `/config/changes` | SEC-023 | settings.view |  | 19 |
| POST | `/config/changes/:id/cancel` | SEC-023 | settings.view |  | 35 |


### `apps/api/src/routes/serials.ts` (5 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| PUT | `/items/:id/track-serials` | INV-020 | inventory.edit |  | 15 |
| GET | `/serials` | INV-021 | inventory.view |  | 21 |
| POST | `/serials` | INV-021 | inventory.create |  | 25 |
| GET | `/serials/lookup` | INV-021 | inventory.view |  | 29 |
| GET | `/serials/check` | INV-021 | inventory.view |  | 33 |


### `apps/api/src/routes/sharing.ts` (4 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| POST | `/sales-invoices/:id/send` | SAL-029 | sales.create |  | 23 |
| POST | `/reminders/payments` | SAL-030 | crm.create |  | 27 |
| GET | `/messages` | SAL-031 | crm.view |  | 31 |
| GET | `/public/documents/:token` | SAL-032 | PUBLIC |  | 41 |


### `apps/api/src/routes/stockcount.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/stock-counts` | INV-022 | inventory.view |  | 17 |
| GET | `/stock-counts/scopes` | INV-022 | inventory.view |  | 22 |
| POST | `/stock-counts` | INV-022 | inventory.create |  | 23 |
| GET | `/stock-counts/:id` | INV-022 | inventory.view |  | 30 |
| POST | `/stock-counts/:id/scan` | INV-022 | inventory.create |  | 32 |
| POST | `/stock-counts/:id/import-scans` | INV-022 | inventory.create |  | 37 |
| PUT | `/stock-counts/:id/lines` | INV-022 | inventory.create |  | 41 |
| POST | `/stock-counts/:id/reset` | INV-022 | inventory.create |  | 46 |
| POST | `/stock-counts/:id/submit` | INV-022 | inventory.create |  | 47 |
| POST | `/stock-counts/:id/reopen` | INV-022 | inventory.edit |  | 51 |
| POST | `/stock-counts/:id/approve` | INV-022 | inventory.approve |  | 55 |
| POST | `/stock-counts/:id/cancel` | INV-022 | inventory.cancel |  | 59 |
| GET | `/reports/stock-audit` | INV-023 | inventory.view |  | 18 |


### `apps/api/src/routes/stockfinance.ts` (8 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/finance/stock-review` | FIN-024 | inventory.view |  | 20 |
| GET | `/finance/writedowns` | FIN-025 | inventory.view |  | 25 |
| POST | `/finance/writedowns` | FIN-025 | inventory.edit |  | 26 |
| POST | `/finance/writedowns/:id/decide` | FIN-025 | inventory.approve | yes | 30 |
| GET | `/finance/cost-centres` | FIN-026 | reports.view |  | 36 |
| GET | `/finance/store-results` | FIN-027 | reports.view |  | 40 |
| PUT | `/finance/allocation-rules/:accountId` | FIN-028 | accounts.create |  | 44 |
| DELETE | `/finance/allocation-rules/:accountId` | FIN-028 | accounts.create |  | 50 |


### `apps/api/src/routes/stocklimits.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/stock-limits` | INV-024 | inventory.view |  | 13 |
| PUT | `/stock-limits/:warehouseId` | INV-024 | inventory.edit |  | 18 |


### `apps/api/src/routes/stockreset.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| POST | `/inventory/reset-stock` | INV-025 | inventory.approve | yes | 10 |
| GET | `/reports/stock-posting-check` | INV-026 | reports.view |  | 19 |


### `apps/api/src/routes/styles.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/size-scales` | INV-027 | inventory.view |  | 38 |
| POST | `/size-scales` | INV-027 | inventory.create |  | 40 |
| PATCH | `/size-scales/:id` | INV-027 | inventory.edit |  | 41 |
| GET | `/colors` | INV-028 | inventory.view |  | 43 |
| POST | `/colors` | INV-028 | inventory.create |  | 45 |
| PATCH | `/colors/:id` | INV-028 | inventory.edit |  | 46 |
| GET | `/styles` | INV-029 | inventory.view |  | 49 |
| GET | `/styles/:id` | INV-029 | inventory.view |  | 57 |
| POST | `/styles` | INV-029 | inventory.create |  | 61 |
| PATCH | `/styles/:id` | INV-029 | inventory.edit |  | 66 |
| POST | `/styles/:id/variants` | INV-029 | inventory.create |  | 71 |
| PUT | `/styles/:id/units` | INV-029 | inventory.edit |  | 74 |
| POST | `/styles/:id/packs` | INV-029 | inventory.create |  | 82 |


### `apps/api/src/routes/sync.ts` (8 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/sync/status` | SYN-002 | users.view |  | 341 |
| GET | `/sync/rejections` | SYN-003 | users.view |  | 350 |
| POST | `/sync/rejections/:id/resolve` | SYN-003 | users.edit |  | 362 |
| POST | `/devices` | SYN-004 | accounts.view |  | 377 |
| GET | `/devices` | SYN-004 | users.view |  | 404 |
| POST | `/devices/:id/revoke` | SYN-004 | users.edit | yes | 409 |
| GET | `/sync/pull` | SYN-005 | accounts.view |  | 428 |
| POST | `/sync/push` | SYN-006 | accounts.view |  | 449 |


### `apps/api/src/routes/tailoring.ts` (12 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/measurements` | POS-025 | sales.view |  | 30 |
| POST | `/measurements` | POS-025 | sales.create |  | 34 |
| PUT | `/measurements/:id` | POS-025 | sales.create |  | 35 |
| GET | `/tailoring-rates` | POS-026 | sales.view |  | 37 |
| PUT | `/tailoring-rates` | POS-026 | sales.edit |  | 38 |
| GET | `/tailoring-orders` | POS-027 | sales.view |  | 43 |
| POST | `/tailoring-orders` | POS-027 | sales.create |  | 47 |
| POST | `/tailoring-orders/:id/assign` | POS-027 | sales.create |  | 58 |
| POST | `/tailoring-orders/:id/done` | POS-027 | sales.create |  | 62 |
| POST | `/tailoring-orders/:id/ready` | POS-027 | sales.create |  | 66 |
| POST | `/tailoring-orders/:id/deliver` | POS-027 | sales.create |  | 67 |
| POST | `/tailoring-orders/:id/cancel` | POS-027 | sales.cancel |  | 71 |


### `apps/api/src/routes/tds.ts` (20 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/tds/section-map` | TAX-013 | accounts.view |  | 22 |
| PUT | `/tds/section-map` | TAX-013 | accounts.create |  | 23 |
| DELETE | `/tds/section-map/:section` | TAX-013 | accounts.create |  | 30 |
| GET | `/tds/sections` | TAX-014 | accounts.view |  | 35 |
| GET | `/tds/preview` | TAX-015 | accounts.view |  | 37 |
| GET | `/tds/deductions` | TAX-016 | accounts.view |  | 41 |
| POST | `/tds/deductions` | TAX-016 | accounts.create |  | 45 |
| POST | `/tds/deductions/:id/cancel` | TAX-016 | accounts.edit |  | 49 |
| GET | `/tds/challans` | TAX-017 | accounts.view |  | 56 |
| POST | `/tds/challans` | TAX-017 | accounts.create |  | 60 |
| POST | `/tds/challans/:id/cancel` | TAX-017 | accounts.edit |  | 64 |
| GET | `/tds/26q` | TAX-018 | reports.view |  | 71 |
| GET | `/tds/certificate` | TAX-019 | reports.view |  | 80 |
| GET | `/tds/194q` | TAX-020 | reports.view |  | 84 |
| GET | `/tcs/sections` | TAX-021 | accounts.view |  | 90 |
| GET | `/tcs/preview` | TAX-021 | accounts.view |  | 91 |
| GET | `/tcs/collections` | TAX-021 | accounts.view |  | 95 |
| POST | `/tcs/collections` | TAX-021 | accounts.create |  | 99 |
| POST | `/tcs/collections/:id/cancel` | TAX-021 | accounts.edit |  | 103 |
| GET | `/tcs/27eq` | TAX-021 | reports.view |  | 109 |


### `apps/api/src/routes/team.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/members` | SEC-024 | users.view |  | 34 |
| PATCH | `/members/:id` | SEC-024 | users.edit |  | 51 |
| DELETE | `/members/:id` | SEC-024 | users.delete |  | 96 |
| GET | `/invitations` | SEC-025 | users.view |  | 119 |
| POST | `/invitations` | SEC-025 | users.create |  | 131 |
| DELETE | `/invitations/:id` | SEC-025 | users.create |  | 164 |
| GET | `/invitations/lookup/:token` | SEC-025 | PUBLIC |  | 184 |
| POST | `/invitations/accept` | SEC-025 | PUBLIC |  | 192 |
| GET | `/roles` | SEC-026 | users.view |  | 237 |
| POST | `/roles` | SEC-026 | users.edit |  | 248 |
| PATCH | `/roles/:id` | SEC-026 | users.edit |  | 262 |
| DELETE | `/roles/:id` | SEC-026 | users.edit |  | 277 |
| POST | `/tenants` | SEC-027 | NONE |  | 295 |


### `apps/api/src/routes/tools.ts` (3 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/meta/states` | SEC-028 | PUBLIC |  | 9 |
| POST | `/tools/gstin` | SEC-029 | PUBLIC |  | 11 |
| POST | `/tools/gst` | SEC-029 | PUBLIC |  | 16 |


### `apps/api/src/routes/transfers.ts` (6 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/stock-transfers` | INV-030 | inventory.view |  | 16 |
| GET | `/stock-transfers/in-transit` | INV-030 | inventory.view |  | 21 |
| GET | `/stock-transfers/:id` | INV-030 | inventory.view |  | 25 |
| POST | `/stock-transfers` | INV-030 | inventory.create |  | 29 |
| POST | `/stock-transfers/:id/receive` | INV-030 | inventory.create |  | 39 |
| POST | `/stock-transfers/:id/cancel` | INV-030 | inventory.cancel |  | 44 |


### `apps/api/src/routes/useractivity.ts` (1 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/user-activity` | SEC-030 | settings.view |  | 12 |


### `apps/api/src/routes/vouchers.ts` (13 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/gift-vouchers` | POS-028 | sales.view |  | 36 |
| GET | `/gift-vouchers/:code` | POS-028 | sales.view |  | 40 |
| POST | `/gift-vouchers` | POS-028 | sales.create |  | 44 |
| POST | `/gift-vouchers/expire` | POS-028 | accounts.create |  | 51 |
| GET | `/coupons` | POS-029 | sales.view |  | 56 |
| POST | `/coupons` | POS-029 | sales.edit |  | 60 |
| PUT | `/coupons/:id` | POS-029 | sales.edit |  | 61 |
| GET | `/discount-cards` | POS-030 | sales.view |  | 63 |
| POST | `/discount-cards` | POS-030 | sales.edit |  | 67 |
| PUT | `/discount-cards/:id` | POS-030 | sales.edit |  | 68 |
| GET | `/pos/promo` | POS-031 | sales.view |  | 71 |
| GET | `/lucky-draws` | POS-032 | sales.view |  | 84 |
| POST | `/lucky-draws` | POS-032 | sales.approve |  | 85 |


### `apps/api/src/routes/workingcap.ts` (10 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/finance/credit-exposure` | FIN-029 | reports.view |  | 17 |
| GET | `/finance/supplier-calendar` | FIN-030 | reports.view |  | 18 |
| GET | `/finance/cash-forecast` | FIN-031 | reports.view |  | 19 |
| GET | `/finance/commitments` | FIN-032 | reports.view |  | 23 |
| POST | `/finance/commitments` | FIN-032 | accounts.create |  | 24 |
| POST | `/finance/commitments/:id/stop` | FIN-032 | accounts.create |  | 31 |
| GET | `/finance/drawing-power` | FIN-033 | reports.view |  | 36 |
| GET | `/finance/cheques` | FIN-034 | accounts.view |  | 41 |
| POST | `/finance/cheques` | FIN-034 | accounts.create |  | 45 |
| POST | `/finance/cheques/:id/settle` | FIN-034 | accounts.create |  | 52 |


### `apps/api/src/routes/yearend.ts` (2 routes)

| Method | Path | Feature | Guard | Step-up | Line |
|---|---|---|---|---|---|
| GET | `/reports/year-end` | FIN-035 | reports.view |  | 9 |
| GET | `/reports/carry-forward` | FIN-036 | reports.view |  | 14 |


### Helper-registered routes [F]

Routes registered through loops or helper functions (`list`, `crud`, `register`) rather than a literal `app.get(...)`; the extractor records templated paths as written (for example `/${path}/:id/einvoice`).

| File | Path | Helper |
|---|---|---|
| `apps/api/src/routes/purchasing.ts` | `/purchase-orders` | list |
| `apps/api/src/routes/purchasing.ts` | `/goods-receipts` | list |
| `apps/api/src/routes/purchasing.ts` | `/purchase-bills` | list |
| `apps/api/src/routes/purchasing.ts` | `/purchase-returns` | list |
| `apps/api/src/routes/sales.ts` | `/quotations` | list |
| `apps/api/src/routes/sales.ts` | `/sales-orders` | list |
| `apps/api/src/routes/sales.ts` | `/delivery-notes` | list |
| `apps/api/src/routes/sales.ts` | `/sales-invoices` | list |
| `apps/api/src/routes/sales.ts` | `/credit-notes` | list |
