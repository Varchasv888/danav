CREATE TABLE "gst_return_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"return_type" varchar(8) NOT NULL,
	"period" char(6) NOT NULL,
	"status" varchar(10) DEFAULT 'requested' NOT NULL,
	"payload_hash" char(64) NOT NULL,
	"summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"requested_by" uuid,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"note" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "itc_reversals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"rule" varchar(4) NOT NULL,
	"bill_id" uuid NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"reversed_on" date NOT NULL,
	"voucher_id" uuid,
	"reclaimed_on" date,
	"reclaim_voucher_id" uuid,
	"note" varchar(200),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "gstr2b_imports_period";--> statement-breakpoint
ALTER TABLE "gst_settings" ADD COLUMN "approval_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD COLUMN "source" varchar(2) DEFAULT '2b' NOT NULL;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD COLUMN "supplier_filed_1" boolean;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD COLUMN "supplier_filed_3b" boolean;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_reclaim_voucher_id_vouchers_id_fk" FOREIGN KEY ("reclaim_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_return_approvals_period" ON "gst_return_approvals" USING btree ("company_id","return_type","period");--> statement-breakpoint
CREATE UNIQUE INDEX "itc_reversals_bill_rule" ON "itc_reversals" USING btree ("bill_id","rule");--> statement-breakpoint
CREATE INDEX "itc_reversals_company" ON "itc_reversals" USING btree ("company_id","reversed_on");--> statement-breakpoint
CREATE UNIQUE INDEX "gstr2b_imports_period" ON "gstr2b_imports" USING btree ("company_id","period","source");
--> statement-breakpoint
ALTER TABLE itc_reversals ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON itc_reversals USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON itc_reversals TO varchasv_app;
--> statement-breakpoint
ALTER TABLE gst_return_approvals ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gst_return_approvals USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gst_return_approvals TO varchasv_app;
