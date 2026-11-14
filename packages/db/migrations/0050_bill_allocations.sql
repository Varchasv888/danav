CREATE TABLE "bill_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"voucher_id" uuid NOT NULL,
	"bill_voucher_id" uuid NOT NULL,
	"amount" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_bill_voucher_id_vouchers_id_fk" FOREIGN KEY ("bill_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bill_allocations_voucher" ON "bill_allocations" USING btree ("voucher_id");--> statement-breakpoint
CREATE INDEX "bill_allocations_bill" ON "bill_allocations" USING btree ("bill_voucher_id");
--> statement-breakpoint
ALTER TABLE bill_allocations ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON bill_allocations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON bill_allocations TO varchasv_app;
