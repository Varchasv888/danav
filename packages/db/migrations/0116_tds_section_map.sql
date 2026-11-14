CREATE TABLE "tds_section_map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"legacy_section" varchar(12) NOT NULL,
	"new_ref" varchar(40) NOT NULL,
	"payment_code" varchar(8),
	"note" varchar(200),
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tds_section_map" ADD CONSTRAINT "tds_section_map_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_section_map" ADD CONSTRAINT "tds_section_map_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_section_map" ADD CONSTRAINT "tds_section_map_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tds_section_map_legacy" ON "tds_section_map" USING btree ("company_id","legacy_section");
--> statement-breakpoint
ALTER TABLE tds_section_map ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tds_section_map USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tds_section_map TO varchasv_app;
