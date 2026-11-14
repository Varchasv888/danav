CREATE TABLE "item_serials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"serial" varchar(40) NOT NULL,
	"status" varchar(10) DEFAULT 'in_stock' NOT NULL,
	"warehouse_id" uuid,
	"received_on" date,
	"source_kind" varchar(8),
	"source_id" uuid,
	"sold_bill_id" uuid,
	"sold_on" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "track_serials" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "serials" jsonb;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_sold_bill_id_pos_bills_id_fk" FOREIGN KEY ("sold_bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_serials_unique" ON "item_serials" USING btree ("company_id","item_id",upper("serial"));--> statement-breakpoint
CREATE INDEX "item_serials_status" ON "item_serials" USING btree ("company_id","item_id","status");
--> statement-breakpoint
ALTER TABLE item_serials ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON item_serials USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON item_serials TO varchasv_app;
