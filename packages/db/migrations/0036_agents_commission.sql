CREATE TABLE "brokerage_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"voucher_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"tds_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"tds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net" numeric(18, 2) NOT NULL,
	"lines" jsonb NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"month" char(7) NOT NULL,
	"target" numeric(18, 2) NOT NULL,
	"slabs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "is_agent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "commission_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "agent_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "agent_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_targets" ADD CONSTRAINT "sales_targets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_targets" ADD CONSTRAINT "sales_targets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_targets" ADD CONSTRAINT "sales_targets_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "brokerage_bills_number" ON "brokerage_bills" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "brokerage_bills_agent" ON "brokerage_bills" USING btree ("agent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_targets_key" ON "sales_targets" USING btree ("company_id","employee_id","month");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sales_invoices_agent" ON "sales_invoices" USING btree ("agent_id");--> statement-breakpoint
ALTER TABLE brokerage_bills ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON brokerage_bills USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON brokerage_bills TO varchasv_app;--> statement-breakpoint
ALTER TABLE sales_targets ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON sales_targets USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON sales_targets TO varchasv_app;
