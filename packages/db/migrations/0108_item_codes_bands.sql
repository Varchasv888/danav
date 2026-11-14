CREATE TABLE "margin_bands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"from_rate" numeric(12, 2) NOT NULL,
	"markup_pct" numeric(7, 2) NOT NULL,
	"markdown1_pct" numeric(5, 2) DEFAULT '0' NOT NULL,
	"markdown2_pct" numeric(5, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "default_qty" numeric(18, 4);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "short_code" varchar(12);--> statement-breakpoint
ALTER TABLE "margin_bands" ADD CONSTRAINT "margin_bands_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_bands" ADD CONSTRAINT "margin_bands_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "margin_bands_from" ON "margin_bands" USING btree ("company_id","from_rate");--> statement-breakpoint
CREATE UNIQUE INDEX "items_company_short_code" ON "items" USING btree ("company_id",upper("short_code")) WHERE "items"."short_code" is not null;--> statement-breakpoint
ALTER TABLE margin_bands ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON margin_bands USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON margin_bands TO varchasv_app;
