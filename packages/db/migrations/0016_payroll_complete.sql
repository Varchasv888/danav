CREATE TABLE "employee_loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"instalment" numeric(18, 2) NOT NULL,
	"recovered" numeric(18, 2) DEFAULT '0' NOT NULL,
	"start_period" char(7) NOT NULL,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"paid_from_account_id" uuid,
	"voucher_id" uuid,
	"remarks" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(40) NOT NULL,
	"start_time" char(5) NOT NULL,
	"end_time" char(5) NOT NULL,
	"grace_minutes" integer DEFAULT 10 NOT NULL,
	"full_day_minutes" integer DEFAULT 480 NOT NULL,
	"half_day_minutes" integer DEFAULT 240 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statutory_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(4) NOT NULL,
	"period" char(7) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"paid_on" date NOT NULL,
	"account_id" uuid NOT NULL,
	"reference" varchar(40),
	"bsr_code" char(7),
	"challan_serial" varchar(5),
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "in_time" char(5);--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "out_time" char(5);--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "worked_minutes" integer;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "late" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "source" varchar(8) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "shift_id" uuid;--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "extra_earnings" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "loan_recoveries" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_paid_from_account_id_accounts_id_fk" FOREIGN KEY ("paid_from_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shifts_name" ON "shifts" USING btree ("company_id","name");--> statement-breakpoint
CREATE INDEX "statutory_payments_period" ON "statutory_payments" USING btree ("company_id","kind","period");