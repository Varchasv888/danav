CREATE TABLE "ledger_posting_defaults" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"role_key" varchar(40) NOT NULL,
	"account_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ledger_posting_defaults" ADD CONSTRAINT "ledger_posting_defaults_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_posting_defaults" ADD CONSTRAINT "ledger_posting_defaults_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_posting_defaults" ADD CONSTRAINT "ledger_posting_defaults_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ledger_posting_defaults_company_role" ON "ledger_posting_defaults" USING btree ("company_id","role_key");--> statement-breakpoint
CREATE INDEX "ledger_posting_defaults_tenant_idx" ON "ledger_posting_defaults" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE ledger_posting_defaults ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON ledger_posting_defaults USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ledger_posting_defaults TO varchasv_app;
