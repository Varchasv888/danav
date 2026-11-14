CREATE TABLE "gst_compare_figures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(6) NOT NULL,
	"portal" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"final" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gstr1_amendments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(6) NOT NULL,
	"kind" varchar(4) NOT NULL,
	"ctin" char(15),
	"original_number" varchar(40),
	"original_date" date,
	"original_period" char(6),
	"number" varchar(40),
	"doc_date" date,
	"note_type" char(1),
	"pos" char(2) NOT NULL,
	"intra" boolean NOT NULL,
	"reverse_charge" boolean DEFAULT false NOT NULL,
	"invoice_type" varchar(5),
	"value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lines" jsonb NOT NULL,
	"reason" varchar(200) NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gst_compare_figures" ADD CONSTRAINT "gst_compare_figures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_compare_figures" ADD CONSTRAINT "gst_compare_figures_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_compare_figures" ADD CONSTRAINT "gst_compare_figures_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_compare_figures_period" ON "gst_compare_figures" USING btree ("company_id","period");--> statement-breakpoint
CREATE INDEX "gstr1_amendments_period" ON "gstr1_amendments" USING btree ("company_id","period");--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_kind_valid" CHECK (kind IN ('b2b', 'cdn', 'b2cs'));
--> statement-breakpoint
ALTER TABLE gst_compare_figures ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON gst_compare_figures USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gst_compare_figures TO varchasv_app;
--> statement-breakpoint
ALTER TABLE gstr1_amendments ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON gstr1_amendments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gstr1_amendments TO varchasv_app;
