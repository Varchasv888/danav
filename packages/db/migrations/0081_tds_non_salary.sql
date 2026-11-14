CREATE TABLE "tds_challans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"paid_on" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"account_id" uuid NOT NULL,
	"bsr_code" char(7) NOT NULL,
	"challan_serial" varchar(8) NOT NULL,
	"voucher_id" uuid,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tds_deductions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"deductee_id" uuid NOT NULL,
	"section" varchar(10) NOT NULL,
	"date" date NOT NULL,
	"base" numeric(18, 2) NOT NULL,
	"taxable_base" numeric(18, 2) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"tds" numeric(18, 2) NOT NULL,
	"no_pan" boolean DEFAULT false NOT NULL,
	"voucher_id" uuid,
	"challan_id" uuid,
	"note" varchar(200),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_deductee_id_accounts_id_fk" FOREIGN KEY ("deductee_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tds_challans_date" ON "tds_challans" USING btree ("company_id","paid_on");--> statement-breakpoint
CREATE INDEX "tds_deductions_date" ON "tds_deductions" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "tds_deductions_payee" ON "tds_deductions" USING btree ("deductee_id","section");--> statement-breakpoint
ALTER TABLE tds_deductions ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tds_deductions USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tds_deductions TO varchasv_app;--> statement-breakpoint
ALTER TABLE tds_challans ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tds_challans USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tds_challans TO varchasv_app;
