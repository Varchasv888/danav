CREATE TABLE "stock_writedowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(24) NOT NULL,
	"as_of" date NOT NULL,
	"basis" jsonb NOT NULL,
	"lines" jsonb NOT NULL,
	"required" numeric(18, 2) NOT NULL,
	"held" numeric(18, 2) NOT NULL,
	"change" numeric(18, 2) NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"note" varchar(200),
	"voucher_id" uuid,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_writedowns_number" ON "stock_writedowns" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE stock_writedowns ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_writedowns USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_writedowns TO varchasv_app;
