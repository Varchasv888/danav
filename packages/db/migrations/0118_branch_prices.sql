CREATE TABLE "branch_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"sale_rate" numeric(18, 2) NOT NULL,
	"starts_on" date,
	"ends_on" date,
	"weekdays" jsonb,
	"from_time" varchar(5),
	"to_time" varchar(5),
	"note" varchar(120),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "branch_prices_store_item" ON "branch_prices" USING btree ("warehouse_id","item_id");
--> statement-breakpoint
ALTER TABLE branch_prices ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON branch_prices USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON branch_prices TO varchasv_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION record_item_change_from_price() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO sync_changes (tenant_id, entity, entity_id) VALUES (COALESCE(NEW.tenant_id, OLD.tenant_id), 'item', COALESCE(NEW.item_id, OLD.item_id));
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE TRIGGER sync_branch_prices AFTER INSERT OR UPDATE OR DELETE ON branch_prices FOR EACH ROW EXECUTE FUNCTION record_item_change_from_price();
