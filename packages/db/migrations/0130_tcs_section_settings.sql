CREATE TABLE "tcs_section_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"section" varchar(20) NOT NULL,
	"enabled" boolean NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tcs_section_settings" ADD CONSTRAINT "tcs_section_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_section_settings" ADD CONSTRAINT "tcs_section_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_section_settings" ADD CONSTRAINT "tcs_section_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tcs_section_settings_company_section" ON "tcs_section_settings" USING btree ("company_id","section");--> statement-breakpoint
CREATE INDEX "tcs_section_settings_tenant_idx" ON "tcs_section_settings" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE tcs_section_settings ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON tcs_section_settings USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tcs_section_settings TO varchasv_app;
