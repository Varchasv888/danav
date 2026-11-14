CREATE TABLE "packing_box_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"box_id" uuid NOT NULL,
	"actor_id" uuid,
	"operation" varchar(12) NOT NULL,
	"reason" text,
	"before_contents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"after_contents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packing_box_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"box_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packing_boxes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(40) NOT NULL,
	"status" varchar(8) DEFAULT 'open' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD CONSTRAINT "packing_box_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD CONSTRAINT "packing_box_events_box_id_packing_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."packing_boxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD CONSTRAINT "packing_box_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_lines" ADD CONSTRAINT "packing_box_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_lines" ADD CONSTRAINT "packing_box_lines_box_id_packing_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."packing_boxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_lines" ADD CONSTRAINT "packing_box_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "packing_box_events_box_created" ON "packing_box_events" USING btree ("box_id","created_at");--> statement-breakpoint
CREATE INDEX "packing_box_events_tenant_idx" ON "packing_box_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "packing_box_lines_box_item" ON "packing_box_lines" USING btree ("box_id","item_id");--> statement-breakpoint
CREATE INDEX "packing_box_lines_tenant_idx" ON "packing_box_lines" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "packing_boxes_company_code" ON "packing_boxes" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "packing_boxes_company_status" ON "packing_boxes" USING btree ("company_id","status","created_at");--> statement-breakpoint
CREATE INDEX "packing_boxes_tenant_idx" ON "packing_boxes" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE packing_box_lines ADD CONSTRAINT packing_box_lines_qty_positive CHECK (qty > 0);
--> statement-breakpoint
ALTER TABLE packing_boxes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON packing_boxes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON packing_boxes TO varchasv_app;
--> statement-breakpoint
ALTER TABLE packing_box_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON packing_box_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON packing_box_lines TO varchasv_app;
--> statement-breakpoint
ALTER TABLE packing_box_events ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON packing_box_events USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT ON packing_box_events TO varchasv_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION packing_box_events_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'packing_box_events is append-only';
END $$;
--> statement-breakpoint
CREATE TRIGGER packing_box_events_immutable BEFORE UPDATE OR DELETE ON packing_box_events
  FOR EACH ROW EXECUTE FUNCTION packing_box_events_immutable();
