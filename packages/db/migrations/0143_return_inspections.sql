CREATE TABLE "return_inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"source_type" varchar(16) NOT NULL,
	"source_id" uuid NOT NULL,
	"source_number" varchar(20) NOT NULL,
	"customer_id" uuid,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"restocked_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"written_off_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"status" varchar(8) DEFAULT 'pending' NOT NULL,
	"note" varchar(300),
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "return_inspections_open" ON "return_inspections" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "return_inspections_source" ON "return_inspections" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "return_inspections_tenant_idx" ON "return_inspections" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_valid" CHECK (qty > 0 AND restocked_qty >= 0 AND written_off_qty >= 0 AND restocked_qty + written_off_qty <= qty AND status IN ('pending', 'done') AND source_type IN ('credit_note', 'delivery_return'));
--> statement-breakpoint
ALTER TABLE return_inspections ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON return_inspections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON return_inspections TO varchasv_app;
