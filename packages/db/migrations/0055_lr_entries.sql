CREATE TABLE "lr_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"date" date NOT NULL,
	"transporter" text NOT NULL,
	"lr_number" varchar(30) NOT NULL,
	"invoice_id" uuid,
	"customer_id" uuid,
	"destination" text,
	"packages" integer DEFAULT 1 NOT NULL,
	"weight_kg" numeric(12, 3),
	"freight" numeric(18, 2) DEFAULT '0' NOT NULL,
	"freight_by" varchar(7) DEFAULT 'paid' NOT NULL,
	"status" varchar(10) DEFAULT 'booked' NOT NULL,
	"delivered_on" date,
	"note" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lr_entries_transporter_lr" ON "lr_entries" USING btree ("company_id",lower("transporter"),"lr_number");--> statement-breakpoint
CREATE INDEX "lr_entries_company_date" ON "lr_entries" USING btree ("company_id","date");--> statement-breakpoint
ALTER TABLE lr_entries ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON lr_entries USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON lr_entries TO varchasv_app;
