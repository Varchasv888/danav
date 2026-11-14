CREATE TABLE "consignment_moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"lines" jsonb NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"stock_journal_id" uuid,
	"invoice_id" uuid,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "consignee_id" uuid;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_stock_journal_id_stock_journals_id_fk" FOREIGN KEY ("stock_journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "consignment_moves_customer" ON "consignment_moves" USING btree ("company_id","customer_id","date");--> statement-breakpoint
ALTER TABLE consignment_moves ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON consignment_moves USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON consignment_moves TO varchasv_app;
