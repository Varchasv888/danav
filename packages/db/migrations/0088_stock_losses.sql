CREATE TABLE "stock_losses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(24) NOT NULL,
	"date" date NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"reason" varchar(12) NOT NULL,
	"note" varchar(300),
	"file_id" uuid,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"journal_id" uuid,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"decision_note" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "loss_approval_limit" numeric(18, 2) DEFAULT '2000' NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_journal_id_stock_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_losses_number" ON "stock_losses" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "stock_losses_status" ON "stock_losses" USING btree ("tenant_id","status");--> statement-breakpoint
ALTER TABLE stock_losses ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_losses USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_losses TO varchasv_app;
