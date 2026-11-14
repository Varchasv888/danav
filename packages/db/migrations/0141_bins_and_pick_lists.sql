CREATE TABLE "bin_stock" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bin_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pick_list_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"list_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"order_line_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"bin_id" uuid,
	"to_pick" numeric(18, 4) NOT NULL,
	"picked" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pick_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"exceptions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"accepted_short" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "warehouse_bins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"note" varchar(80),
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_bin_id_warehouse_bins_id_fk" FOREIGN KEY ("bin_id") REFERENCES "public"."warehouse_bins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_list_id_pick_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."pick_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_order_line_id_sales_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."sales_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_bin_id_warehouse_bins_id_fk" FOREIGN KEY ("bin_id") REFERENCES "public"."warehouse_bins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bin_stock_bin_item" ON "bin_stock" USING btree ("bin_id","item_id");--> statement-breakpoint
CREATE INDEX "bin_stock_item" ON "bin_stock" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "bin_stock_tenant_idx" ON "bin_stock" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "pick_list_lines_list" ON "pick_list_lines" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX "pick_list_lines_tenant_idx" ON "pick_list_lines" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pick_lists_number" ON "pick_lists" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "pick_lists_order" ON "pick_lists" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "warehouse_bins_code" ON "warehouse_bins" USING btree ("warehouse_id","code");--> statement-breakpoint
CREATE INDEX "warehouse_bins_tenant_idx" ON "warehouse_bins" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_qty_positive" CHECK (qty > 0);
--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_status_valid" CHECK (status IN ('open', 'done', 'cancelled'));
--> statement-breakpoint
ALTER TABLE warehouse_bins ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON warehouse_bins USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON warehouse_bins TO varchasv_app;
--> statement-breakpoint
ALTER TABLE bin_stock ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON bin_stock USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON bin_stock TO varchasv_app;
--> statement-breakpoint
ALTER TABLE pick_lists ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON pick_lists USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pick_lists TO varchasv_app;
--> statement-breakpoint
ALTER TABLE pick_list_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON pick_list_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pick_list_lines TO varchasv_app;
