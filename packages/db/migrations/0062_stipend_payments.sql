CREATE TABLE "stipend_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"date" date NOT NULL,
	"paid_from_account_id" uuid NOT NULL,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"remarks" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_paid_from_account_id_accounts_id_fk" FOREIGN KEY ("paid_from_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stipend_payments_period" ON "stipend_payments" USING btree ("tenant_id","period");--> statement-breakpoint
ALTER TABLE stipend_payments ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stipend_payments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stipend_payments TO varchasv_app;
