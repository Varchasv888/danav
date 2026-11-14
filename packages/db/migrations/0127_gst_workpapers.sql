CREATE TABLE "gst_workpapers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"return_type" varchar(8) NOT NULL,
	"period" char(6) NOT NULL,
	"status" varchar(10) DEFAULT 'prepared' NOT NULL,
	"manual" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"figures_hash" char(64),
	"arn" varchar(20),
	"filed_on" date,
	"filed_by" uuid,
	"evidence_file_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_filed_by_users_id_fk" FOREIGN KEY ("filed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_workpapers_period" ON "gst_workpapers" USING btree ("company_id","return_type","period");
--> statement-breakpoint
ALTER TABLE gst_workpapers ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gst_workpapers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gst_workpapers TO varchasv_app;
