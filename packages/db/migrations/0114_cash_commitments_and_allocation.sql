CREATE TABLE "cash_commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"direction" varchar(3) DEFAULT 'out' NOT NULL,
	"name" varchar(80) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"first_date" date NOT NULL,
	"repeat" varchar(8) DEFAULT 'once' NOT NULL,
	"until" date,
	"note" varchar(200),
	"active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_allocation_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"basis" varchar(8) NOT NULL,
	"shares" jsonb,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cash_commitments" ADD CONSTRAINT "cash_commitments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_commitments" ADD CONSTRAINT "cash_commitments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_commitments" ADD CONSTRAINT "cash_commitments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cash_commitments_company" ON "cash_commitments" USING btree ("company_id","active");--> statement-breakpoint
CREATE UNIQUE INDEX "expense_alloc_account" ON "expense_allocation_rules" USING btree ("company_id","account_id");
--> statement-breakpoint
ALTER TABLE cash_commitments ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON cash_commitments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON cash_commitments TO varchasv_app;
--> statement-breakpoint
ALTER TABLE expense_allocation_rules ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON expense_allocation_rules USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON expense_allocation_rules TO varchasv_app;
