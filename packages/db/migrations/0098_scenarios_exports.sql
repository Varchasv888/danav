CREATE TABLE "duty_scrips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"scheme" varchar(8) NOT NULL,
	"number" varchar(30) NOT NULL,
	"issued_on" date NOT NULL,
	"valid_until" date,
	"amount" numeric(18, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "export_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"shipping_bill_no" varchar(20),
	"shipping_bill_date" date,
	"port_code" varchar(8),
	"fob_value" numeric(18, 2),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"brc_no" varchar(30),
	"brc_date" date,
	"realised_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"note" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incentive_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"scheme" varchar(8) NOT NULL,
	"hsn_prefix" varchar(8) NOT NULL,
	"rate_pct" numeric(6, 3) NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"adjustments" jsonb NOT NULL,
	"baseline" jsonb NOT NULL,
	"note" varchar(300),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scrip_uses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"scrip_id" uuid NOT NULL,
	"used_on" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"purpose" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "duty_scrips" ADD CONSTRAINT "duty_scrips_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "duty_scrips" ADD CONSTRAINT "duty_scrips_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "export_shipments" ADD CONSTRAINT "export_shipments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "export_shipments" ADD CONSTRAINT "export_shipments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "export_shipments" ADD CONSTRAINT "export_shipments_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incentive_rates" ADD CONSTRAINT "incentive_rates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incentive_rates" ADD CONSTRAINT "incentive_rates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrip_uses" ADD CONSTRAINT "scrip_uses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrip_uses" ADD CONSTRAINT "scrip_uses_scrip_id_duty_scrips_id_fk" FOREIGN KEY ("scrip_id") REFERENCES "public"."duty_scrips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "duty_scrips_number" ON "duty_scrips" USING btree ("company_id","scheme","number");--> statement-breakpoint
CREATE UNIQUE INDEX "export_shipments_invoice" ON "export_shipments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "incentive_rates_lookup" ON "incentive_rates" USING btree ("company_id","scheme","hsn_prefix");--> statement-breakpoint
CREATE UNIQUE INDEX "scenarios_name" ON "scenarios" USING btree ("company_id",lower("name"));
--> statement-breakpoint
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON scenarios USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON scenarios TO varchasv_app;
--> statement-breakpoint
ALTER TABLE export_shipments ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON export_shipments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON export_shipments TO varchasv_app;
--> statement-breakpoint
ALTER TABLE duty_scrips ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON duty_scrips USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON duty_scrips TO varchasv_app;
--> statement-breakpoint
ALTER TABLE scrip_uses ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON scrip_uses USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON scrip_uses TO varchasv_app;
--> statement-breakpoint
ALTER TABLE incentive_rates ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON incentive_rates USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON incentive_rates TO varchasv_app;
