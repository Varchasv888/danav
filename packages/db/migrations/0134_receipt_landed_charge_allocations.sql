CREATE TABLE "goods_receipt_landed_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"receipt_id" uuid NOT NULL,
	"description" varchar(120) NOT NULL,
	"source_document" varchar(120) NOT NULL,
	"gross_amount" numeric(18, 2) NOT NULL,
	"recoverable_gst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net_amount" numeric(18, 2) NOT NULL,
	"allocation_basis" varchar(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "goods_receipt_landed_charges_amounts_valid" CHECK (gross_amount > 0 AND recoverable_gst >= 0 AND recoverable_gst <= gross_amount AND net_amount = gross_amount - recoverable_gst),
	CONSTRAINT "goods_receipt_landed_charges_basis_valid" CHECK (allocation_basis IN ('direct', 'weight', 'volume', 'net_value', 'units'))
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_landed_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"charge_id" uuid NOT NULL,
	"receipt_line_id" uuid NOT NULL,
	"allocated_amount" numeric(18, 2) NOT NULL,
	CONSTRAINT "goods_receipt_landed_allocations_amount_positive" CHECK (allocated_amount > 0)
);
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_charges" ADD CONSTRAINT "goods_receipt_landed_charges_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_charges" ADD CONSTRAINT "goods_receipt_landed_charges_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_charges" ADD CONSTRAINT "goods_receipt_landed_charges_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_allocations" ADD CONSTRAINT "goods_receipt_landed_allocations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_allocations" ADD CONSTRAINT "goods_receipt_landed_allocations_charge_id_goods_receipt_landed_charges_id_fk" FOREIGN KEY ("charge_id") REFERENCES "public"."goods_receipt_landed_charges"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_allocations" ADD CONSTRAINT "goods_receipt_landed_allocations_receipt_line_id_goods_receipt_lines_id_fk" FOREIGN KEY ("receipt_line_id") REFERENCES "public"."goods_receipt_lines"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "goods_receipt_landed_charges_receipt_idx" ON "goods_receipt_landed_charges" USING btree ("receipt_id");
--> statement-breakpoint
CREATE INDEX "goods_receipt_landed_charges_tenant_idx" ON "goods_receipt_landed_charges" USING btree ("tenant_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_receipt_landed_allocations_charge_line" ON "goods_receipt_landed_allocations" USING btree ("charge_id","receipt_line_id");
--> statement-breakpoint
CREATE INDEX "goods_receipt_landed_allocations_tenant_idx" ON "goods_receipt_landed_allocations" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE goods_receipt_landed_charges ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON goods_receipt_landed_charges USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON goods_receipt_landed_charges TO varchasv_app;
--> statement-breakpoint
ALTER TABLE goods_receipt_landed_allocations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON goods_receipt_landed_allocations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON goods_receipt_landed_allocations TO varchasv_app;
