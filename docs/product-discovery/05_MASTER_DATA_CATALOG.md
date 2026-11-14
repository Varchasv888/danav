# 05 Master data catalog

Masters are the slow-changing records other documents point to. Each section lists the tables (from `packages/db/src/schema.ts`), their columns with types, who maintains them (permission), which screen edits them and which documents reference them [F]. Column lists are complete; types are the Drizzle column types.

The 26 small list masters of plan item R26 (account category, region, country, department, brand, product, item group, fabric, sleeves, neck, fit, season, style attribute, gender and others) live in one table, `lookups`, edited on one screen (`/inventory/setup`), see below.


## Company and structure

Company details, branches (one per GSTIN or location), financial years, numbering series, warehouses/stores and counters. [I: grouping and description written for this document]

### `tenants` (6 columns, `schema.ts:21`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| name | text | required |
| plan | varchar | required, default "free" |
| industry | varchar | required, default "general" |
| status | varchar | required, default "active" |
| created_at | timestamptz |  |

Maintained through services: `backups`, `onboarding`, `restore`. Referenced by 2 table(s): backup_settings, sessions.

### `companies` (12 columns, `schema.ts:85`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| name | text | required |
| legal_name | text |  |
| pan | char |  |
| base_currency | char | required, default "INR" |
| books_begin_on | date | required |
| valuation_method | varchar | required, default "average" |
| bank_change_approval | boolean | required, default false |
| loss_approval_limit | numeric | required, default "2000" |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: index `companies_tenant_idx` on t.tenantId

Maintained through services: `accounting`, `changes`, `losses`, `onboarding`. Referenced by 125 table(s): account_groups, accounts, alteration_types, alterations, approval_memos, asset_classes, assets, bank_lines (+117 more).

### `branches` (10 columns, `schema.ts:103`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | text | required |
| gstin | char |  |
| state_code | char | required |
| address | jsonb | required, default {} |
| is_head_office | boolean | required, default false |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: index `branches_company_idx` on t.companyId; uniqueIndex `branches_tenant_gstin` on t.tenantId, t.gstin

Maintained through services: `pos`, `returns`, `distribution`, `sharing`, `assets`, `expenses` (+9 more). Referenced by 9 table(s): employees, number_series, purchase_bills, purchase_orders, quotations, sales_invoices, sales_orders, vouchers (+1 more).

### `fiscal_years` (9 columns, `schema.ts:119`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| label | varchar | required |
| starts_on | date | required |
| ends_on | date | required |
| locked_up_to | date |  |
| closed | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `fiscal_years_company_label` on t.companyId, t.label

Maintained through services: `accounting`, `onboarding`. Referenced by 2 table(s): number_series, vouchers.

### `number_series` (12 columns, `schema.ts:144`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| branch_id | uuid | -> branches |
| fiscal_year_id | uuid | required, -> fiscal_years |
| device_id | uuid | -> devices |
| doc_type | varchar | required |
| name | text | required |
| pattern | varchar | required |
| next_seq | integer | required, default 1 |
| is_default | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: index `number_series_lookup` on t.companyId, t.docType, t.fiscalYearId

Maintained through services: `accounting`, `scheduledchanges`, `onboarding`. Referenced by 0 table(s): .

### `warehouses` (12 columns, `schema.ts:358`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| branch_id | uuid | -> branches |
| name | text | required |
| is_default | boolean | required, default false |
| archived | boolean | required, default false |
| job_worker_id | uuid |  |
| consignee_id | uuid |  |
| in_transit | boolean | required, default false |
| quality_hold | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `warehouses_company_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `consignment`, `transfers`, `approvalmemos`, `pos`, `purchasing`, `distribution` (+14 more). Referenced by 17 table(s): approval_memos, branch_prices, credit_notes, delivery_notes, goods_receipts, item_serials, pos_terminals, production_orders (+9 more).

### `devices` (8 columns, `schema.ts:133`)

Offline installations of the Flutter app. Each gets a short code used in its own number series.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| name | text | required |
| code | varchar | required |
| platform | varchar | required |
| last_seen_at | timestamp |  |
| revoked_at | timestamp |  |
| created_at | timestamptz |  |

Indexes: uniqueIndex `devices_tenant_code` on t.tenantId, t.code

Maintained through services: `pos`. Referenced by 4 table(s): number_series, pos_terminals, sync_rejections, vouchers.

### `pos_terminals` (8 columns, `schema.ts:2560`)

A billing counter. A terminal bound to a device numbers its own bills (it may be offline).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| name | varchar | required |
| warehouse_id | uuid | required, -> warehouses |
| device_id | uuid | -> devices |
| archived | boolean | required, default false |

Indexes: uniqueIndex `pos_terminals_code` on t.companyId, t.code

Maintained through services: `pos`, `close`. Referenced by 4 table(s): pos_bills, pos_held_bills, pos_returns, pos_sessions.


## Accounts and parties

Chart of accounts (groups and ledgers; customers under Sundry Debtors, suppliers under Sundry Creditors); price lists; consignee terms; bank statement formats. [I: grouping and description written for this document]

### `account_groups` (11 columns, `schema.ts:200`)

Account groups form a tree (Tally-style). `key` is set for template groups so code can find them.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| parent_id | uuid |  |
| key | varchar |  |
| name | text | required |
| name_hi | text |  |
| nature | varchar | required |
| pl | varchar |  |
| system | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `account_groups_company_key` on t.companyId, t.key; uniqueIndex `account_groups_company_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `accounting`, `assets`, `crm`, `alterations`, `banking`, `consignment` (+7 more). Referenced by 1 table(s): accounts.

### `accounts` (34 columns, `schema.ts:218`)

Ledger accounts. Customers and suppliers are accounts under Sundry Debtors/Creditors with party details.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| group_id | uuid | required, -> account_groups |
| key | varchar |  |
| name | text | required |
| name_hi | text |  |
| code | varchar |  |
| opening_balance | numeric | required, default "0" |
| gstin | char |  |
| state_code | char |  |
| pan | char |  |
| udyam_number | varchar |  |
| msme_class | varchar |  |
| phone | varchar |  |
| email | text |  |
| bank | jsonb |  |
| address | jsonb |  |
| credit_limit | numeric |  |
| credit_days | integer |  |
| credit_control | varchar | required, default "warn" |
| block_overdue_days | integer |  |
| interest_rate | numeric |  |
| price_list_id | uuid | -> price_lists |
| is_agent | boolean | required, default false |
| commission_pct | numeric |  |
| agent_id | uuid |  |
| salesman_id | uuid |  |
| archived | boolean | required, default false |
| related_party | boolean | required, default false |
| merged_into_id | uuid |  |
| system | boolean | required, default false |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `accounts_company_key` on t.companyId, t.key; uniqueIndex `accounts_company_name` on t.companyId, sql`lower(${t.name}; index `accounts_group_idx` on t.groupId

Maintained through services: `tds`, `crm`, `banking`, `commission`, `gstwork`, `accounting` (+31 more). Referenced by 45 table(s): asset_classes, assets, bank_lines, bank_matches, bank_profiles, bank_rules, bank_statements, brokerage_bills (+37 more).

### `price_lists` (7 columns, `schema.ts:596`)

Party price lists (wholesale, distributor, retailer): a discount off the item's sale rate, with fixed rates for chosen items. A customer on a list gets its rates on new sales documents.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| discount_pct | numeric | required, default "0" |
| archived | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `price_lists_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `catalogue`, `consignment`. Referenced by 2 table(s): accounts, price_list_items.

### `price_list_items` (5 columns, `schema.ts:606`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| price_list_id | uuid | required, -> price_lists |
| item_id | uuid | required, -> items |
| rate | numeric | required |

Indexes: uniqueIndex `price_list_items_item` on t.priceListId, t.itemId

Maintained through services: `catalogue`, `consignment`. Referenced by 0 table(s): .

### `consignee_terms` (10 columns, `schema.ts:1514`)

How a consignee (a shop-in-shop counter or outside store) is settled: how many days after goods go out we expect settlement, and who follows up differences.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| customer_id | uuid | required, -> accounts |
| settlement_days | integer | required, default 30 |
| discrepancy_owner | varchar |  |
| statement_frequency | varchar |  |
| statement_email | varchar |  |
| statement_last_sent | date |  |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `consignee_terms_customer` on t.companyId, t.customerId

Maintained through services: `consignment`. Referenced by 0 table(s): .

### `bank_profiles` (10 columns, `schema.ts:3087`)

Bank details and feed consent for a bank ledger.

| Column | Type | Notes |
|---|---|---|
| account_id | uuid | key, -> accounts |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| bank_name | varchar |  |
| account_last4 | char |  |
| ifsc | char |  |
| feed_provider | varchar |  |
| feed_consent_id | varchar |  |
| feed_status | varchar |  |
| feed_fetched_to | date |  |

Maintained through services: `banking`. Referenced by 0 table(s): .


## Items and styles

Items with HSN and GST rate; apparel styles with colour and size; units; barcodes; ratio packs; serial pieces; margin bands; reorder limits; the small list masters in `lookups`. [I: grouping and description written for this document]

### `items` (34 columns, `schema.ts:455`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | text | required |
| name_hi | text |  |
| sku | varchar |  |
| barcode | varchar |  |
| kind | varchar | required, default "goods" |
| hsn | varchar |  |
| gst_rate | numeric | required, default "18" |
| gst_slab | varchar |  |
| slab_pieces | integer | required, default 1 |
| cess_rate | numeric | required, default "0" |
| uom_id | uuid | required, -> uoms |
| purchase_rate | numeric | required, default "0" |
| sale_rate | numeric | required, default "0" |
| mrp | numeric(18,2) |  |
| reorder_level | numeric(18,4) |  |
| reorder_qty | numeric(18,4) |  |
| default_qty | numeric(18,4) |  |
| short_code | varchar |  |
| track_batches | boolean | required, default false |
| track_serials | boolean | required, default false |
| lead_time_days | integer | required, default 0 |
| style_id | uuid | -> styles |
| color | text |  |
| size | text |  |
| fit | text |  |
| size_order | integer | required, default 0 |
| is_pack | boolean | required, default false |
| archived | boolean | required, default false |
| merged_into_id | uuid |  |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: index `items_style` on t.styleId; uniqueIndex `items_company_name` on t.companyId, sql`lower(${t.name}; uniqueIndex `items_company_sku` on t.companyId, t.sku; uniqueIndex `items_company_short_code` on t.companyId, sql`upper(${t.shortCode}; index `items_company_barcode` on t.companyId, t.barcode

Maintained through services: `manufacturing`, `styles`, `purchasing`, `stockcount`, `inventory`, `returns` (+29 more). Referenced by 29 table(s): approval_memo_lines, bom_lines, boms, branch_prices, credit_note_lines, delivery_note_lines, delivery_order_lines, goods_receipt_lines (+21 more).

### `item_units` (5 columns, `schema.ts:584`)

Other units an item is bought or sold in (a dozen = 12 pieces); stock is always kept in the item's own unit.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| item_id | uuid | required, -> items |
| uom_id | uuid | required, -> uoms |
| factor | numeric | required |

Indexes: uniqueIndex `item_units_item_uom` on t.itemId, t.uomId

Maintained through services: `inventory`. Referenced by 0 table(s): .

### `item_barcodes` (8 columns, `schema.ts:1705`)

Another code an item answers to (a supplier's barcode, an old label, a merged duplicate's code). Old documents are never rewritten.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| item_id | uuid | required, -> items |
| code | varchar | required |
| kind | varchar | required, default "alternate" |
| supplier_id | uuid | -> accounts |
| created_at | timestamptz |  |

Indexes: uniqueIndex `item_barcodes_code` on t.companyId, t.code; index `item_barcodes_item` on t.itemId

Maintained through services: `barcodes`, `merge`. Referenced by 0 table(s): .

### `item_pack_lines` (5 columns, `schema.ts:615`)

The pieces in a set: selling or buying one set moves these quantities of each piece.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| pack_item_id | uuid | required, -> items |
| item_id | uuid | required, -> items |
| qty | numeric | required |

Indexes: index `item_pack_lines_pack` on t.packItemId

Maintained through services: `styles`, `inventory`. Referenced by 0 table(s): .

### `item_serials` (14 columns, `schema.ts:1941`)

One piece with its own serial number: where it is, and the bill it left on.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| item_id | uuid | required, -> items |
| serial | varchar | required |
| status | varchar | required, default "in_stock" |
| warehouse_id | uuid | -> warehouses |
| received_on | date |  |
| source_kind | varchar |  |
| source_id | uuid |  |
| sold_bill_id | uuid | -> pos_bills |
| sold_on | date |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: uniqueIndex `item_serials_unique` on t.companyId, t.itemId, sql`upper(${t.serial}; index `item_serials_status` on t.companyId, t.itemId, t.status

Maintained through services: `serials`. Referenced by 0 table(s): .

### `styles` (24 columns, `schema.ts:426`)

A design (style) sold in colours and sizes. Each colour-size (and fit) combination is an ordinary item with its own SKU and barcode, so stock, documents, POS and sync work on it unchanged; the style groups them for grid entry, catalogues and reports, and carries the shared master data.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| name | text | required |
| name_hi | text |  |
| brand | text |  |
| category | text |  |
| season | text |  |
| collection | text |  |
| hsn | varchar |  |
| gst_rate | numeric | required, default "5" |
| gst_slab | varchar |  |
| uom_id | uuid | required, -> uoms |
| purchase_rate | numeric | required, default "0" |
| sale_rate | numeric | required, default "0" |
| mrp | numeric |  |
| size_scale_id | uuid | -> size_scales |
| fits | text |  |
| attributes | jsonb | required, default sql`'{}'::jsonb` |
| image_file_id | uuid |  |
| archived | boolean | required, default false |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `styles_company_code` on t.companyId, sql`lower(${t.code}; index `styles_company_name` on t.companyId, t.name

Maintained through services: `styles`, `stockcount`, `catalogue`, `ownerreports`, `rateupdate`, `schemes` (+3 more). Referenced by 2 table(s): items, style_images.

### `style_images` (12 columns, `schema.ts:2735`)

Photos of a style, per colour (null colour: every colour). The browser shrinks each photo to a full view and a thumbnail before upload, so the files stay small. Archived photos stay for history.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| style_id | uuid | required, -> styles |
| color | text |  |
| view | varchar | required, default "front" |
| file_id | uuid | required, -> files |
| thumb_file_id | uuid | required, -> files |
| sort_order | integer | required, default 0 |
| archived | boolean | required, default false |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: index `style_images_style` on t.styleId, t.color

Maintained through services: `catalogue`, `ownerreports`. Referenced by 0 table(s): .

### `size_scales` (7 columns, `schema.ts:380`)

An ordered list of sizes (XS to 3XL, waist 28 to 40, kids' ages, UK shoe sizes).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | text | required |
| sizes | text | required |
| archived | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `size_scales_company_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `styles`. Referenced by 1 table(s): styles.

### `colors` (7 columns, `schema.ts:390`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | text | required |
| code | varchar | required |
| hex | varchar |  |
| archived | boolean | required, default false |

Indexes: uniqueIndex `colors_company_name` on t.companyId, sql`lower(${t.name}; uniqueIndex `colors_company_code` on t.companyId, t.code

Maintained through services: `styles`, `catalogue`, `ownerreports`. Referenced by 0 table(s): .

### `uoms` (7 columns, `schema.ts:348`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| name | text | required |
| name_hi | text |  |
| decimals | integer | required, default 0 |

Indexes: uniqueIndex `uoms_company_code` on t.companyId, t.code

Maintained through services: `inventory`, `returns`, `sales`, `alterations`, `jobwork`, `manufacturing` (+3 more). Referenced by 3 table(s): item_units, items, styles.

### `hsn_codes` (9 columns, `schema.ts:2171`)

HSN and SAC codes the business uses, with a plain description and, if it wants one, a default tax rate.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| description | text | required |
| kind | varchar | required, default "goods" |
| gst_rate | numeric |  |
| archived | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `hsn_codes_company_code` on t.companyId, t.code

Maintained through services: `hsn`. Referenced by 0 table(s): .

### `lookups` (11 columns, `schema.ts:405`)

Small named lists a business keeps for itself: brand, fabric, region, return reasons and the rest of LOOKUP_KINDS in the domain package. One table, one row per entry, the kind says which list.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| kind | varchar | required |
| name | text | required |
| code | varchar |  |
| note | text |  |
| starts_on | date |  |
| ends_on | date |  |
| archived | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `lookups_company_kind_name` on t.companyId, t.kind, sql`lower(${t.name}; index `lookups_company_kind` on t.companyId, t.kind

Maintained through services: `lookups`. Referenced by 0 table(s): .

### `margin_bands` (7 columns, `schema.ts:561`)

Mark-up by purchase rate: from this cost upward, the MRP is cost plus the mark-up, and the sale rate is that MRP less the first mark-down (a second mark-down gives the lower rate for sales and clearance). Filled in on receipt so a challan prices itself.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| from_rate | numeric | required |
| markup_pct | numeric | required |
| markdown1_pct | numeric | required, default "0" |
| markdown2_pct | numeric | required, default "0" |

Indexes: uniqueIndex `margin_bands_from` on t.companyId, t.fromRate

Maintained through services: `marginbands`. Referenced by 0 table(s): .

### `stock_limits` (8 columns, `schema.ts:572`)

Minimum and maximum stock an item should hold in one warehouse (a branch's shelf), for the reorder view.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| item_id | uuid | required, -> items |
| warehouse_id | uuid | required, -> warehouses |
| min_qty | numeric(18,4) | required, default "0" |
| max_qty | numeric(18,4) | required, default "0" |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `stock_limits_item_warehouse` on t.itemId, t.warehouseId; index `stock_limits_warehouse` on t.warehouseId

Maintained through services: `stocklimits`. Referenced by 0 table(s): .


## People and HR

Employees with pay and statutory details, salary structures, shifts, holidays, leave types, device registrations. [I: grouping and description written for this document]

### `employees` (39 columns, `schema.ts:1245`)

Employees. Bank account numbers are stored encrypted (only the last four digits in clear), and only the last four digits of Aadhaar are kept at all.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| branch_id | uuid | -> branches |
| code | varchar | required |
| name | text | required |
| name_hi | text |  |
| gender | varchar | required |
| dob | date |  |
| punch_pin | varchar |  |
| weekly_offs | jsonb |  |
| joined_on | date | required |
| left_on | date |  |
| status | varchar | required, default "active" |
| fixed_term | boolean | required, default false |
| department | varchar |  |
| designation | varchar |  |
| work_state | char | required |
| phone | varchar |  |
| email | varchar |  |
| address | jsonb |  |
| pan | char |  |
| aadhaar_last4 | char |  |
| uan | varchar |  |
| esi_number | varchar |  |
| pf_member | boolean | required, default true |
| cost_per_hour | numeric |  |
| eps_eligible | boolean | required, default true |
| pf_on_actual_wages | boolean | required, default false |
| disabled | boolean | required, default false |
| tax_regime | varchar | required, default "new" |
| metro | boolean | required, default false |
| payment_mode | varchar | required, default "bank" |
| bank_name | varchar |  |
| bank_ifsc | char |  |
| bank_account_enc | text |  |
| bank_account_last4 | char |  |
| shift_id | uuid |  |
| created_at | timestamptz |  |

Indexes: uniqueIndex `employees_code` on t.companyId, t.code

Maintained through services: `hr`, `hr-ops`, `projects`, `expenses`, `payroll`, `statutory` (+8 more). Referenced by 24 table(s): assets, attendance, attendance_punches, employee_documents, employee_loans, employee_reviews, expense_claims, karigars (+16 more).

### `salary_structures` (7 columns, `schema.ts:2233`)

Salary structures with the date they take effect; the latest one on or before a date applies.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| employee_id | uuid | required, -> employees |
| effective_from | date | required |
| components | jsonb | required |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: uniqueIndex `salary_structures_from` on t.employeeId, t.effectiveFrom

Maintained through services: `hr`, `projects`. Referenced by 0 table(s): .

### `shifts` (10 columns, `schema.ts:1291`)

Working hours used to read punches: late after start + grace; worked minutes decide full or half day.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| start_time | char | required |
| end_time | char | required |
| grace_minutes | integer | required, default 10 |
| full_day_minutes | integer | required, default 480 |
| half_day_minutes | integer | required, default 240 |
| is_default | boolean | required, default false |

Indexes: uniqueIndex `shifts_name` on t.companyId, t.name

Maintained through services: `hr-ops`, `devicepunch`. Referenced by 0 table(s): .

### `holidays` (5 columns, `schema.ts:2261`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| date | date | required |
| name | varchar | required |

Indexes: uniqueIndex `holidays_date` on t.companyId, t.date

Maintained through services: `hr`. Referenced by 0 table(s): .

### `leave_types` (10 columns, `schema.ts:2269`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| name | varchar | required |
| name_hi | varchar |  |
| annual_quota | numeric | required, default "0" |
| paid | boolean | required, default true |
| encashable | boolean | required, default false |
| archived | boolean | required, default false |

Indexes: uniqueIndex `leave_types_code` on t.companyId, t.code

Maintained through services: `hr`. Referenced by 2 table(s): leave_openings, leave_requests.

### `leave_openings` (6 columns, `schema.ts:2283`)

Leave carried into a financial year (e.g. earned leave brought forward).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| employee_id | uuid | required, -> employees |
| leave_type_id | uuid | required, -> leave_types |
| fy | varchar | required |
| days | numeric | required |

Indexes: uniqueIndex `leave_openings_fy` on t.employeeId, t.leaveTypeId, t.fy

Maintained through services: `hr`. Referenced by 0 table(s): .

### `payroll_settings` (11 columns, `schema.ts:2325`)

| Column | Type | Notes |
|---|---|---|
| company_id | uuid | key, -> companies |
| tenant_id | uuid |  |
| tan | char |  |
| pf_establishment_code | varchar |  |
| esi_employer_code | varchar |  |
| labour_code_wages | boolean | required, default true |
| weekly_offs | jsonb | required, default [0] |
| lwf_employee | numeric(18,2) | required, default "0" |
| lwf_employer | numeric(18,2) | required, default "0" |
| lwf_months | jsonb | required, default [] |
| encashment_divisor | integer | required, default 30 |

Maintained through services: `hr`, `payroll`. Referenced by 0 table(s): .

### `attendance_devices` (9 columns, `schema.ts:1533`)

A fingerprint, face or card attendance machine that pushes its punches to this server (ZKTeco ADMS "cloud server" protocol, also used by eSSL, BioMax, Realtime and others). The machine is known by its serial number, which is how an unsigned request is tied to the business that registered it.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| name | varchar | required |
| serial | varchar | required |
| active | boolean | required, default true |
| last_seen_at | timestamp |  |
| last_ip | varchar |  |
| last_stamp | varchar |  |
| created_at | timestamptz |  |

Indexes: uniqueIndex `attendance_devices_serial` on sql`upper(${t.serial}

Maintained through services: `devicepunch`. Referenced by 1 table(s): attendance_punches.

### `employee_documents` (11 columns, `schema.ts:2185`)

An identity or compliance document kept for an employee (KYC): what it is, its number, and when it lapses.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| employee_id | uuid | required, -> employees |
| kind | varchar | required |
| number | text |  |
| issued_on | date |  |
| expires_on | date |  |
| file_id | uuid | -> files |
| note | text |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: index `employee_documents_employee` on t.employeeId; index `employee_documents_expiry` on t.tenantId, t.expiresOn

Maintained through services: `hr-ops`. Referenced by 0 table(s): .

### `employee_reviews` (10 columns, `schema.ts:1415`)

A performance review of an employee for a period: a rating from 1 to 5 with what went well and what to improve.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| employee_id | uuid | required, -> employees |
| period | varchar | required |
| reviewed_on | date | required |
| rating | integer | required |
| strengths | text |  |
| improvements | text |  |
| reviewer_id | uuid | -> users |
| created_at | timestamptz |  |

Indexes: index `employee_reviews_employee` on t.tenantId, t.employeeId, t.reviewedOn

Maintained through services: `hr-ops`. Referenced by 0 table(s): .

### `tax_declarations` (14 columns, `schema.ts:2244`)

What the employee declares for TDS in a financial year (old regime deductions, other income, previous employer).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| employee_id | uuid | required, -> employees |
| fy | varchar | required |
| rent_paid | numeric(18,2) | required, default "0" |
| c80 | numeric(18,2) | required, default "0" |
| ccd1b | numeric(18,2) | required, default "0" |
| d80 | numeric(18,2) | required, default "0" |
| home_loan_interest | numeric(18,2) | required, default "0" |
| other_deductions | numeric(18,2) | required, default "0" |
| other_income | numeric(18,2) | required, default "0" |
| previous_employer_salary | numeric(18,2) | required, default "0" |
| previous_employer_tds | numeric(18,2) | required, default "0" |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `tax_declarations_fy` on t.employeeId, t.fy

Maintained through services: `hr`. Referenced by 0 table(s): .


## Users and access

People, roles and permissions per business, store scope per member, invitations. [I: grouping and description written for this document]

### `users` (7 columns, `schema.ts:30`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| email | text | required |
| phone | varchar |  |
| name | text | required |
| password_hash | text | required |
| locale | varchar | required, default "en" |
| created_at | timestamptz |  |

Indexes: uniqueIndex `users_email_key` on sql`lower(${t.email}

Maintained through services: `controls`, `close`, `crm`, `recon`, `chat`, `changes` (+4 more). Referenced by 99 table(s): access_reviews, alterations, approval_memos, assets, bank_statements, boms, branch_prices, brokerage_bills (+91 more).

### `roles` (7 columns, `schema.ts:62`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| key | varchar | required |
| name | text | required |
| permissions | text | required, default sql`'{}'::text[]` |
| system | boolean | required, default false |
| created_at | timestamptz |  |

Indexes: uniqueIndex `roles_tenant_key` on t.tenantId, t.key

Maintained through services: `controls`, `scheduledchanges`, `chat`, `onboarding`. Referenced by 2 table(s): invitations, memberships.

### `memberships` (8 columns, `schema.ts:72`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| user_id | uuid | required, -> users |
| role_id | uuid | required, -> roles |
| status | varchar | required, default "active" |
| menu | jsonb |  |
| warehouse_scope | jsonb |  |
| created_at | timestamptz |  |

Indexes: uniqueIndex `memberships_tenant_user` on t.tenantId, t.userId

Maintained through services: `chat`, `controls`, `onboarding`, `restore`. Referenced by 0 table(s): .

### `invitations` (10 columns, `schema.ts:184`)

Invitations to join a tenant. The raw token is only in the invite link; we store its hash. Accepting happens before the invitee has a tenant context, via the SECURITY DEFINER function invitation_by_token() (migrations/0003_invitations_rls.sql).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| email | text | required |
| role_id | uuid | required, -> roles |
| token_hash | char | required |
| invited_by | uuid | -> users |
| expires_at | timestamp | required |
| accepted_at | timestamp |  |
| revoked_at | timestamp |  |
| created_at | timestamptz |  |

Indexes: uniqueIndex `invitations_token_key` on t.tokenHash; index `invitations_tenant_idx` on t.tenantId

Maintained through services: -. Referenced by 0 table(s): .

### `access_reviews` (6 columns, `schema.ts:2011`)

A periodic look at who has access: a snapshot of the members and their roles, and a decision on each.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| started_by | uuid | -> users |
| started_at | timestamp | required |
| completed_at | timestamp |  |
| members | jsonb | required |

Maintained through services: `controls`. Referenced by 0 table(s): .


## Retail and promotions

Offers and their flags, counter settings, loyalty, vouchers, coupons, branch prices, commission rules, craftspeople and service rates. [I: grouping and description written for this document]

### `schemes` (31 columns, `schema.ts:2906`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| kind | varchar | required |
| starts_on | date |  |
| ends_on | date |  |
| weekdays | jsonb |  |
| priority | integer |  |
| from_time | char |  |
| to_time | char |  |
| branch_ids | jsonb |  |
| active | boolean | required, default true |
| scope | jsonb | required, default {} |
| confirm_before_apply | boolean | required, default false |
| allow_with_gift_vouchers | boolean | required, default true |
| allow_with_customer_discount | boolean | required, default true |
| allow_returns | boolean | required, default true |
| apply_on_discounted | boolean | required, default false |
| inclusive_of_tax | boolean | required, default false |
| commission_basis | varchar | required, default "net" |
| pct | numeric |  |
| amount | numeric(18,2) |  |
| min_value | numeric(18,2) |  |
| buy | integer |  |
| get | integer |  |
| slabs | jsonb |  |
| combo_price | numeric(18,2) |  |
| combo_items | jsonb |  |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `schemes_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `schemes`. Referenced by 0 table(s): .

### `pos_settings` (22 columns, `schema.ts:2526`)

| Column | Type | Notes |
|---|---|---|
| company_id | uuid | key, -> companies |
| tenant_id | uuid |  |
| prices_include_tax | boolean | required, default true |
| loyalty_enabled | boolean | required, default false |
| loyalty_points_per_100 | integer | required, default 1 |
| loyalty_slabs | jsonb |  |
| loyalty_min_redeem | integer | required, default 0 |
| loyalty_validity_days | integer |  |
| helper_share_pct | numeric | required, default "30" |
| loyalty_exclude_discounted_bills | boolean | required, default false |
| loyalty_exclude_discounted_items | boolean | required, default false |
| loyalty_exclude_brands | text |  |
| loyalty_exclude_categories | text |  |
| loyalty_point_value | numeric | required, default "1" |
| loyalty_max_redeem_pct | numeric | required, default "20" |
| referral_points | integer | required, default 0 |
| receipt_footer | text |  |
| allow_rate_change | boolean | required, default true |
| max_line_discount_pct | numeric |  |
| max_bill_discount_pct | numeric |  |
| require_salesman | boolean | required, default false |
| auto_send_bill | boolean | required, default false |

Maintained through services: `pos`, `profitability`. Referenced by 0 table(s): .

### `loyalty_members` (11 columns, `schema.ts:2786`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| phone | varchar | required |
| name | varchar |  |
| points | integer | required, default 0 |
| lifetime_points | integer | required, default 0 |
| referred_by | varchar |  |
| birthday | date |  |
| anniversary | date |  |
| created_at | timestamptz |  |

Indexes: uniqueIndex `loyalty_members_phone` on t.companyId, t.phone

Maintained through services: `pos`, `loyalty`, `loyaltylots`. Referenced by 1 table(s): loyalty_lots.

### `gift_vouchers` (16 columns, `schema.ts:2817`)

Gift vouchers sold at the counter: the money is a liability until the voucher pays for goods (GST is charged then, on the goods), and what is left at expiry is written back as income.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| value | numeric(18,2) | required |
| balance | numeric(18,2) | required |
| issued_on | date | required |
| expires_on | date | required |
| status | varchar | required, default "active" |
| customer_phone | varchar |  |
| customer_name | varchar |  |
| paid_by | varchar | required |
| voucher_id | uuid | -> vouchers |
| expiry_voucher_id | uuid | -> vouchers |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: uniqueIndex `gift_vouchers_code` on t.companyId, t.code

Maintained through services: `vouchers`, `tailoring`, `pos`. Referenced by 3 table(s): gift_voucher_redemptions, pos_returns, tailoring_orders.

### `coupons` (14 columns, `schema.ts:2848`)

Coupon codes: percent (with a cap) or an amount off the bill, above a minimum, for a period and a number of uses.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| kind | varchar | required |
| value | numeric | required |
| max_discount | numeric(18,2) |  |
| min_bill | numeric(18,2) |  |
| starts_on | date |  |
| ends_on | date |  |
| max_uses | integer |  |
| used | integer | required, default 0 |
| active | boolean | required, default true |
| created_at | timestamptz |  |

Indexes: uniqueIndex `coupons_code` on t.companyId, sql`upper(${t.code}

Maintained through services: `vouchers`, `pos`. Referenced by 0 table(s): .

### `discount_cards` (10 columns, `schema.ts:2866`)

Discount cards (staff, members, privilege): a percent off every bill while the card is valid.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| number | varchar | required |
| holder | varchar | required |
| phone | varchar |  |
| pct | numeric | required |
| valid_until | date |  |
| active | boolean | required, default true |
| created_at | timestamptz |  |

Indexes: uniqueIndex `discount_cards_number` on t.companyId, sql`upper(${t.number}

Maintained through services: `vouchers`. Referenced by 0 table(s): .

### `lucky_draws` (11 columns, `schema.ts:2880`)

Lucky draws among the bills of a period: winners picked at random, one per customer.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| from_date | date | required |
| to_date | date | required |
| min_bill | numeric(18,2) |  |
| entries | integer | required |
| winners | jsonb | required |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Maintained through services: `vouchers`. Referenced by 0 table(s): .

### `branch_prices` (14 columns, `schema.ts:1923`)

A store's own selling rate for an item, optionally for a spell of dates, days of the week and hours. The latest entry that applies wins; no entry means the item's usual rate.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| warehouse_id | uuid | required, -> warehouses |
| item_id | uuid | required, -> items |
| sale_rate | numeric(18,2) | required |
| starts_on | date |  |
| ends_on | date |  |
| weekdays | jsonb |  |
| from_time | varchar |  |
| to_time | varchar |  |
| note | varchar |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: index `branch_prices_store_item` on t.warehouseId, t.itemId

Maintained through services: `branchprices`. Referenced by 0 table(s): .

### `salesman_commission_rules` (14 columns, `schema.ts:1396`)

Commission a salesman earns on what they sell, by what it is: one item, a brand, a category, an MRP range or everything. For each sale line the most specific rule that matches decides the percentage.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| kind | varchar | required |
| match | text |  |
| item_id | uuid | -> items |
| mrp_from | numeric |  |
| mrp_to | numeric |  |
| band_from | numeric |  |
| band_to | numeric |  |
| rate_pct | numeric | required |
| active | boolean | required, default true |
| created_at | timestamptz |  |

Maintained through services: `salesmancomm`. Referenced by 0 table(s): .

### `sales_targets` (8 columns, `schema.ts:1138`)

Monthly sales target per salesman, with commission slabs: reach `from`% of the target, earn `rate`% of sales.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| employee_id | uuid | required, -> employees |
| month | char | required |
| target | numeric(18,2) | required |
| slabs | jsonb | required, default [] |
| created_at | timestamptz |  |

Indexes: uniqueIndex `sales_targets_key` on t.companyId, t.employeeId, t.month

Maintained through services: `commission`. Referenced by 0 table(s): .

### `karigars` (9 columns, `schema.ts:2594`)

Tailors (karigars) who do alterations: in-house staff, or outside karigars paid per piece through their own ledger.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| phone | varchar |  |
| account_id | uuid | -> accounts |
| employee_id | uuid | -> employees |
| active | boolean | required, default true |
| created_at | timestamptz |  |

Indexes: uniqueIndex `karigars_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `alterations`, `tailoring`. Referenced by 1 table(s): alterations.

### `alteration_types` (9 columns, `schema.ts:2608`)

What can be done to a garment, with the customer's charge and the karigar's labour.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| kind | varchar | required, default "alteration" |
| charge | numeric(18,2) | required, default "0" |
| labour | numeric(18,2) | required, default "0" |
| active | boolean | required, default true |
| created_at | timestamptz |  |

Indexes: uniqueIndex `alteration_types_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `alterations`. Referenced by 0 table(s): .

### `tailoring_rates` (7 columns, `schema.ts:2669`)

Karigar labour per piece for each process of a garment (cutting, stitching, embroidery, finishing).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| garment | varchar | required |
| process | varchar | required |
| rate | numeric(18,2) | required |
| position | integer | required, default 0 |

Indexes: uniqueIndex `tailoring_rates_key` on t.companyId, sql`lower(${t.garment}

Maintained through services: `tailoring`. Referenced by 0 table(s): .

### `measurements` (11 columns, `schema.ts:2653`)

A customer's measurements for one kind of garment (shirt, trouser, kurta, blouse...), with an optional photo.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| customer_phone | varchar | required |
| customer_name | varchar |  |
| garment | varchar | required |
| values | jsonb | required |
| photo_file_id | uuid | -> files |
| notes | text |  |
| taken_on | date | required |
| created_at | timestamptz |  |

Indexes: index `measurements_phone` on t.companyId, t.customerPhone

Maintained through services: `tailoring`. Referenced by 0 table(s): .


## Finance and tax

GST settings, TDS section map, export incentive rates, expense categories with ledger and limit, allocation rules, asset classes, bank rules. [I: grouping and description written for this document]

### `gst_settings` (10 columns, `schema.ts:1183`)

GST settings per company: e-invoicing is compulsory above ₹5 crore turnover.

| Column | Type | Notes |
|---|---|---|
| company_id | uuid | key, -> companies |
| tenant_id | uuid |  |
| einvoice_enabled | boolean | required, default false |
| qrmp | boolean | required, default false |
| eway_bill_threshold | numeric(18,2) | required, default "50000" |
| bilingual_print | boolean | required, default true |
| print_language | varchar | required, default "hi" |
| invoice_terms | text |  |
| bank_details | text |  |
| approval_required | boolean | required, default false |

Maintained through services: `gstwork`, `sharing`, `filing`, `sales`. Referenced by 0 table(s): .

### `tds_section_map` (9 columns, `schema.ts:1910`)

What each legacy TDS section is called under section 393 of the Income-tax Act, 2025, typed or imported by the business from the official table.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| legacy_section | varchar | required |
| new_ref | varchar | required |
| payment_code | varchar |  |
| note | varchar |  |
| updated_by | uuid | -> users |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `tds_section_map_legacy` on t.companyId, t.legacySection

Maintained through services: `tds`. Referenced by 0 table(s): .

### `incentive_rates` (9 columns, `schema.ts:2147`)

An incentive rate by tariff heading and dates: the rate on a shipment is the one in force on its shipping bill date.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| scheme | varchar | required |
| hsn_prefix | varchar | required |
| rate_pct | numeric | required |
| effective_from | date | required |
| effective_to | date |  |
| created_at | timestamptz |  |

Indexes: index `incentive_rates_lookup` on t.companyId, t.scheme, t.hsnPrefix

Maintained through services: `exports`. Referenced by 0 table(s): .

### `expense_categories` (12 columns, `schema.ts:3263`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| name_hi | varchar |  |
| account_id | uuid | required, -> accounts |
| blocked_credit | boolean | required, default false |
| limit_per_claim | numeric(18,2) |  |
| receipt_required_above | numeric(18,2) |  |
| per_km_rate | numeric |  |
| daily_allowance | numeric |  |
| archived | boolean | required, default false |

Indexes: uniqueIndex `expense_categories_name` on t.companyId, t.name

Maintained through services: `expenses`. Referenced by 1 table(s): expense_lines.

### `expense_allocation_rules` (8 columns, `schema.ts:1897`)

How an expense account is spread over the stores: by sales, by stock, equally, or by percentages typed in.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| account_id | uuid | required, -> accounts |
| basis | varchar | required |
| shares | jsonb |  |
| updated_by | uuid | -> users |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `expense_alloc_account` on t.companyId, t.accountId

Maintained through services: `expensealloc`. Referenced by 0 table(s): .

### `asset_classes` (13 columns, `schema.ts:3185`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| name_hi | varchar |  |
| method | varchar | required, default "slm" |
| life_years | numeric | required |
| residual_pct | numeric | required, default "5" |
| it_block | varchar | required |
| it_rate | numeric | required |
| asset_account_id | uuid | required, -> accounts |
| accumulated_account_id | uuid | required, -> accounts |
| archived | boolean | required, default false |

Indexes: uniqueIndex `asset_classes_name` on t.companyId, t.name

Maintained through services: `assets`. Referenced by 1 table(s): assets.

### `it_block_openings` (7 columns, `schema.ts:3251`)

Opening written down value of an income-tax block for a year (entered once; later years carry forward).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| fy | varchar | required |
| block | varchar | required |
| rate | numeric | required |
| opening_wdv | numeric(18,2) | required |

Indexes: uniqueIndex `it_block_openings_key` on t.companyId, t.fy, t.block

Maintained through services: `assets`. Referenced by 0 table(s): .

### `bank_rules` (9 columns, `schema.ts:3147`)

"Lines whose description has these words go to this ledger" (bank charges, interest, standing orders).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| contains | varchar | required |
| direction | varchar | required, default "any" |
| account_id | uuid | required, -> accounts |
| narration | varchar |  |
| priority | integer | required, default 10 |
| archived | boolean | required, default false |

Maintained through services: `banking`. Referenced by 0 table(s): .

### `scenarios` (9 columns, `schema.ts:2092`)

A what-if the owner saved: the changes with their worst, expected and best values, and the baseline they were worked on.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| adjustments | jsonb | required |
| baseline | jsonb | required |
| note | varchar |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: uniqueIndex `scenarios_name` on t.companyId, sql`lower(${t.name}

Maintained through services: `scenarios`. Referenced by 0 table(s): .


## Manufacturing

Work centres, bills of material with operations. [I: grouping and description written for this document]

### `work_centres` (6 columns, `schema.ts:2407`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| cost_per_hour | numeric(18,2) | required, default "0" |
| archived | boolean | required, default false |

Indexes: uniqueIndex `work_centres_name` on t.companyId, t.name

Maintained through services: `manufacturing`. Referenced by 1 table(s): bom_operations.

### `boms` (12 columns, `schema.ts:2417`)

Bills of materials, versioned per item; one version is the default.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| item_id | uuid | required, -> items |
| version | integer | required |
| output_qty | numeric(18,4) | required |
| overhead | numeric(18,2) | required, default "0" |
| is_default | boolean | required, default true |
| status | varchar | required, default "active" |
| notes | text |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: uniqueIndex `boms_version` on t.companyId, t.itemId, t.version

Maintained through services: `manufacturing`. Referenced by 3 table(s): bom_lines, bom_operations, production_orders.

### `bom_lines` (7 columns, `schema.ts:2433`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| bom_id | uuid | required, -> boms |
| line_no | integer | required |
| item_id | uuid | required, -> items |
| qty | numeric(18,4) | required |
| wastage_pct | numeric | required, default "0" |

Maintained through services: `manufacturing`. Referenced by 0 table(s): .

### `bom_operations` (7 columns, `schema.ts:2443`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| bom_id | uuid | required, -> boms |
| line_no | integer | required |
| name | varchar | required |
| work_centre_id | uuid | required, -> work_centres |
| minutes | numeric | required |

Maintained through services: `manufacturing`. Referenced by 0 table(s): .


## Communications

Templates by language, settings including automatic events, customer consent. [I: grouping and description written for this document]

### `message_templates` (10 columns, `schema.ts:3451`)

Message templates; WhatsApp ones mirror a template approved by Meta ({{1}}, {{2}} placeholders).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| name | varchar | required |
| channel | varchar | required, default "whatsapp" |
| category | varchar | required, default "utility" |
| language | varchar | required, default "en" |
| body | text | required |
| provider_name | varchar |  |
| archived | boolean | required, default false |

Indexes: uniqueIndex `message_templates_name` on t.companyId, t.name

Maintained through services: `crm`, `sharing`. Referenced by 1 table(s): messages.

### `comm_templates` (10 columns, `schema.ts:3485`)

Wording for an event on a channel in a language ({name}-style placeholders); the English one is the fallback.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| event | varchar | required |
| channel | varchar | required |
| language | varchar | required, default "en" |
| category | varchar | required, default "utility" |
| subject | varchar |  |
| body | text | required |
| archived | boolean | required, default false |

Indexes: uniqueIndex `comm_templates_key` on t.companyId, t.event, t.channel, t.language

Maintained through services: `comms`. Referenced by 0 table(s): .

### `comm_settings` (12 columns, `schema.ts:3543`)

Cost per message by channel (the business's own rates, for the cost report), the owner's contacts, and how often to retry.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| cost_whatsapp_utility | numeric | required, default "0" |
| cost_whatsapp_marketing | numeric | required, default "0" |
| cost_sms | numeric | required, default "0" |
| cost_email | numeric | required, default "0" |
| cost_push | numeric | required, default "0" |
| owner_phone | varchar |  |
| owner_email | varchar |  |
| max_attempts | integer | required, default 3 |
| auto_events | jsonb | required, default sql`'[]'::jsonb` |

Indexes: uniqueIndex `comm_settings_company` on t.companyId

Maintained through services: `comms`. Referenced by 0 table(s): .

### `comm_consents` (9 columns, `schema.ts:3499`)

What a person (by phone or email) has agreed to or refused on a channel. Marketing needs a yes; anyone who opted out gets nothing but security codes.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| contact | varchar | required |
| channel | varchar | required |
| marketing_opt_in | boolean | required, default false |
| opted_out | boolean | required, default false |
| source | varchar |  |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `comm_consents_key` on t.companyId, t.contact, t.channel

Maintained through services: `comms`. Referenced by 0 table(s): .


## CRM and projects

Leads and projects with their tasks, milestones and members. [I: grouping and description written for this document]

### `crm_leads` (22 columns, `schema.ts:3408`)

A prospective customer, moving through the pipeline until won (converted to a customer ledger) or lost.

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| name | text | required |
| organisation | text |  |
| phone | varchar |  |
| email | varchar |  |
| gstin | char |  |
| state_code | char |  |
| city | varchar |  |
| source | varchar | required, default "other" |
| stage | varchar | required, default "new" |
| value | numeric(18,2) |  |
| expected_close | date |  |
| owner_id | uuid | -> users |
| customer_id | uuid | -> accounts |
| lost_reason | text |  |
| notes | text |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |
| updated_at | timestamptz |  |

Indexes: uniqueIndex `crm_leads_code` on t.companyId, t.code; index `crm_leads_stage` on t.companyId, t.stage

Maintained through services: `crm`. Referenced by 2 table(s): crm_activities, messages.

### `projects` (18 columns, `schema.ts:3329`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| company_id | uuid | required, -> companies |
| code | varchar | required |
| name | text | required |
| customer_id | uuid | -> accounts |
| status | varchar | required, default "active" |
| billing | varchar | required, default "fixed" |
| contract_value | numeric(18,2) |  |
| budget_cost | numeric(18,2) |  |
| budget_hours | numeric |  |
| bill_rate | numeric(18,2) |  |
| billing_item_id | uuid | -> items |
| start_on | date |  |
| end_on | date |  |
| notes | text |  |
| created_by | uuid | -> users |
| created_at | timestamptz |  |

Indexes: uniqueIndex `projects_code` on t.companyId, t.code

Maintained through services: `projects`, `expenses`, `purchasing`, `sales`. Referenced by 4 table(s): project_members, project_milestones, project_tasks, timesheets.

### `project_tasks` (10 columns, `schema.ts:3350`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| project_id | uuid | required, -> projects |
| name | varchar | required |
| status | varchar | required, default "todo" |
| assignee_id | uuid | -> employees |
| estimated_hours | numeric |  |
| due_on | date |  |
| sort_order | integer | required, default 0 |
| created_at | timestamptz |  |

Maintained through services: `projects`. Referenced by 1 table(s): timesheets.

### `project_milestones` (9 columns, `schema.ts:3393`)

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| project_id | uuid | required, -> projects |
| name | varchar | required |
| amount | numeric(18,2) | required |
| due_on | date |  |
| status | varchar | required, default "pending" |
| invoice_id | uuid |  |
| sort_order | integer | required, default 0 |

Maintained through services: `projects`, `sales`. Referenced by 0 table(s): .

### `project_members` (5 columns, `schema.ts:3364`)

Per-person bill rate on a project (else the project's rate).

| Column | Type | Notes |
|---|---|---|
| id | id |  |
| tenant_id | uuid |  |
| project_id | uuid | required, -> projects |
| employee_id | uuid | required, -> employees |
| bill_rate | numeric(18,2) |  |

Indexes: uniqueIndex `project_members_key` on t.projectId, t.employeeId

Maintained through services: `projects`. Referenced by 0 table(s): .


## Small list masters (`lookups`) [F]

The list of kinds was not found as a constant; see `apps/api/src/services/lookups.ts`. [UNKNOWN: kinds not enumerated]


## System-seeded masters [F/I]

New businesses are seeded with system roles (owner, admin, accountant, sales, purchase, storekeeper, hr, viewer; `SYSTEM_ROLES` in `packages/domain/src/permissions.ts`), the standard chart of account groups, the Indian states list (`GET /meta/states`) and a demo dataset when seeded with `--url` (a script, not application behaviour). [F for roles; I for the remainder, see `packages/db` seed files]
