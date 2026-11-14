CREATE TABLE "recurring_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"type" varchar(8) NOT NULL,
	"narration" varchar(200),
	"lines" jsonb NOT NULL,
	"frequency" varchar(10) NOT NULL,
	"day_of_month" integer NOT NULL,
	"next_on" date NOT NULL,
	"ends_on" date,
	"last_run_on" date,
	"active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recurring_vouchers_due" ON "recurring_vouchers" USING btree ("company_id","active","next_on");--> statement-breakpoint
CREATE INDEX "recurring_vouchers_tenant_idx" ON "recurring_vouchers" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_valid" CHECK (type IN ('journal', 'payment', 'receipt', 'contra') AND frequency IN ('monthly', 'quarterly', 'yearly') AND day_of_month BETWEEN 1 AND 31);
--> statement-breakpoint
ALTER TABLE recurring_vouchers ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON recurring_vouchers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON recurring_vouchers TO varchasv_app;
