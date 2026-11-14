CREATE TABLE "gst_filings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"gstin" char(15) NOT NULL,
	"return_type" varchar(8) NOT NULL,
	"period" char(6) NOT NULL,
	"status" varchar(10) NOT NULL,
	"payload_hash" char(64) NOT NULL,
	"summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"reference_id" varchar(40),
	"arn" varchar(20),
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"filed_at" timestamp with time zone,
	"filed_by" uuid,
	"provider" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gst_sessions" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"gstin" char(15) NOT NULL,
	"username" varchar(60) NOT NULL,
	"token_enc" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "quotation_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"quotation_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"valid_until" date NOT NULL,
	"place_of_supply" char(2) NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"lut" boolean DEFAULT false NOT NULL,
	"status" varchar(12) DEFAULT 'open' NOT NULL,
	"customer_reference" varchar(40),
	"narration" text,
	"terms" text,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"converted_kind" varchar(8),
	"converted_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "quotation_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "ewb_status" varchar(10) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "quotation_id" uuid;--> statement-breakpoint
ALTER TABLE "gst_filings" ADD CONSTRAINT "gst_filings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_filings" ADD CONSTRAINT "gst_filings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_filings" ADD CONSTRAINT "gst_filings_filed_by_users_id_fk" FOREIGN KEY ("filed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_sessions" ADD CONSTRAINT "gst_sessions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_sessions" ADD CONSTRAINT "gst_sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_sessions" ADD CONSTRAINT "gst_sessions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_lines" ADD CONSTRAINT "quotation_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_lines" ADD CONSTRAINT "quotation_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_lines" ADD CONSTRAINT "quotation_lines_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_filings_period" ON "gst_filings" USING btree ("company_id","gstin","return_type","period");--> statement-breakpoint
CREATE UNIQUE INDEX "quotations_number" ON "quotations" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;