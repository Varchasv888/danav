CREATE TABLE "gstr2b_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(6) NOT NULL,
	"gstin" char(15),
	"rows" integer NOT NULL,
	"imported_by" uuid,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gstr2b_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"import_id" uuid NOT NULL,
	"ctin" char(15) NOT NULL,
	"supplier_name" varchar(120),
	"kind" varchar(8) DEFAULT 'invoice' NOT NULL,
	"doc_no" varchar(40) NOT NULL,
	"doc_date" date NOT NULL,
	"taxable" numeric(18, 2) NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"itc_available" boolean DEFAULT true NOT NULL,
	"reason" varchar(120),
	"bill_id" uuid,
	"match" varchar(12) DEFAULT 'unmatched' NOT NULL,
	"diff" jsonb,
	"decision" varchar(10),
	"decision_note" varchar(200),
	"decided_by" uuid
);
--> statement-breakpoint
ALTER TABLE "gst_settings" ADD COLUMN "qrmp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD CONSTRAINT "gstr2b_imports_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD CONSTRAINT "gstr2b_imports_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD CONSTRAINT "gstr2b_imports_imported_by_users_id_fk" FOREIGN KEY ("imported_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_import_id_gstr2b_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."gstr2b_imports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gstr2b_imports_period" ON "gstr2b_imports" USING btree ("company_id","period");--> statement-breakpoint
CREATE INDEX "gstr2b_rows_import" ON "gstr2b_rows" USING btree ("import_id");--> statement-breakpoint
CREATE INDEX "gstr2b_rows_doc" ON "gstr2b_rows" USING btree ("ctin","doc_no");--> statement-breakpoint
ALTER TABLE gstr2b_imports ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gstr2b_imports USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gstr2b_imports TO varchasv_app;--> statement-breakpoint
ALTER TABLE gstr2b_rows ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gstr2b_rows USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gstr2b_rows TO varchasv_app;
