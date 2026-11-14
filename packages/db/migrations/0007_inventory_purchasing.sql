CREATE TABLE "goods_receipt_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"receipt_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"order_line_id" uuid,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"batch_no" varchar(40),
	"expiry" date,
	"billed_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"order_id" uuid,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"supplier_challan" varchar(40),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"sku" varchar(40),
	"barcode" varchar(40),
	"kind" varchar(10) DEFAULT 'goods' NOT NULL,
	"hsn" varchar(8),
	"gst_rate" numeric(5, 2) DEFAULT '18' NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"uom_id" uuid NOT NULL,
	"purchase_rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"sale_rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"mrp" numeric(18, 2),
	"reorder_level" numeric(18, 4),
	"reorder_qty" numeric(18, 4),
	"track_batches" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_bill_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"bill_id" uuid NOT NULL,
	"order_line_id" uuid,
	"receipt_line_id" uuid,
	"warehouse_id" uuid,
	"batch_no" varchar(40),
	"expiry" date,
	"returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"order_id" uuid,
	"voucher_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"supplier_invoice_no" varchar(16) NOT NULL,
	"supplier_invoice_date" date NOT NULL,
	"due_on" date,
	"supply_kind" varchar(8) NOT NULL,
	"reverse_charge" boolean DEFAULT false NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"order_id" uuid NOT NULL,
	"received_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"billed_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"expected_on" date,
	"status" varchar(12) DEFAULT 'open' NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"narration" text,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_return_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"return_id" uuid NOT NULL,
	"bill_line_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"bill_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"voucher_id" uuid,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"reason" text NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_journal_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"journal_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"to_warehouse_id" uuid,
	"qty_in" numeric(18, 4) DEFAULT '0' NOT NULL,
	"qty_out" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"batch_no" varchar(40),
	"expiry" date
);
--> statement-breakpoint
CREATE TABLE "stock_journals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"kind" varchar(12) NOT NULL,
	"narration" text,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_ledger" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"date" date NOT NULL,
	"qty_in" numeric(18, 4) DEFAULT '0' NOT NULL,
	"qty_out" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"batch_no" varchar(40),
	"expiry" date,
	"source_type" varchar(20) NOT NULL,
	"source_id" uuid NOT NULL,
	"is_reversal" boolean DEFAULT false NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uoms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"decimals" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"name" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "valuation_method" varchar(8) DEFAULT 'average' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_order_line_id_purchase_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."purchase_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_order_id_purchase_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_uom_id_uoms_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_order_line_id_purchase_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."purchase_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_receipt_line_id_goods_receipt_lines_id_fk" FOREIGN KEY ("receipt_line_id") REFERENCES "public"."goods_receipt_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_order_id_purchase_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_order_id_purchase_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_return_id_purchase_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "public"."purchase_returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_bill_line_id_purchase_bill_lines_id_fk" FOREIGN KEY ("bill_line_id") REFERENCES "public"."purchase_bill_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_journal_id_stock_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_to_warehouse_id_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uoms" ADD CONSTRAINT "uoms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uoms" ADD CONSTRAINT "uoms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "goods_receipts_number" ON "goods_receipts" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "items_company_name" ON "items" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "items_company_sku" ON "items" USING btree ("company_id","sku");--> statement-breakpoint
CREATE INDEX "items_company_barcode" ON "items" USING btree ("company_id","barcode");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_bills_number" ON "purchase_bills" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_bills_supplier_invoice" ON "purchase_bills" USING btree ("company_id","supplier_id","supplier_invoice_no","supplier_invoice_date");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_orders_number" ON "purchase_orders" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_returns_number" ON "purchase_returns" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_journals_number" ON "stock_journals" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "stock_ledger_item_wh_date" ON "stock_ledger" USING btree ("item_id","warehouse_id","date","id");--> statement-breakpoint
CREATE INDEX "stock_ledger_company_date" ON "stock_ledger" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "stock_ledger_source" ON "stock_ledger" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uoms_company_code" ON "uoms" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "warehouses_company_name" ON "warehouses" USING btree ("company_id",lower("name"));