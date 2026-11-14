CREATE TABLE "lookups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(24) NOT NULL,
	"name" text NOT NULL,
	"code" varchar(12),
	"note" text,
	"starts_on" date,
	"ends_on" date,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lookups" ADD CONSTRAINT "lookups_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lookups" ADD CONSTRAINT "lookups_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lookups_company_kind_name" ON "lookups" USING btree ("company_id","kind",lower("name"));--> statement-breakpoint
CREATE INDEX "lookups_company_kind" ON "lookups" USING btree ("company_id","kind");--> statement-breakpoint
ALTER TABLE lookups ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON lookups USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON lookups TO varchasv_app;
