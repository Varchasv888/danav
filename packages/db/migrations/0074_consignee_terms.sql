CREATE TABLE "consignee_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"settlement_days" integer DEFAULT 30 NOT NULL,
	"discrepancy_owner" varchar(80),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD CONSTRAINT "consignee_terms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD CONSTRAINT "consignee_terms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD CONSTRAINT "consignee_terms_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "consignee_terms_customer" ON "consignee_terms" USING btree ("company_id","customer_id");--> statement-breakpoint
ALTER TABLE consignee_terms ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON consignee_terms USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON consignee_terms TO varchasv_app;
