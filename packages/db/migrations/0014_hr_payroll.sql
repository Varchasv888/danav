CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" varchar(8) NOT NULL,
	"leave_request_id" uuid,
	"note" varchar(120)
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"gender" varchar(6) NOT NULL,
	"dob" date,
	"joined_on" date NOT NULL,
	"left_on" date,
	"status" varchar(8) DEFAULT 'active' NOT NULL,
	"fixed_term" boolean DEFAULT false NOT NULL,
	"department" varchar(60),
	"designation" varchar(60),
	"work_state" char(2) NOT NULL,
	"phone" varchar(15),
	"email" varchar(120),
	"address" jsonb,
	"pan" char(10),
	"aadhaar_last4" char(4),
	"uan" varchar(12),
	"esi_number" varchar(17),
	"pf_member" boolean DEFAULT true NOT NULL,
	"eps_eligible" boolean DEFAULT true NOT NULL,
	"pf_on_actual_wages" boolean DEFAULT false NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"tax_regime" varchar(3) DEFAULT 'new' NOT NULL,
	"metro" boolean DEFAULT false NOT NULL,
	"payment_mode" varchar(6) DEFAULT 'bank' NOT NULL,
	"bank_name" varchar(80),
	"bank_ifsc" char(11),
	"bank_account_enc" text,
	"bank_account_last4" char(4),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"date" date NOT NULL,
	"name" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"leave_type_id" uuid NOT NULL,
	"fy" varchar(7) NOT NULL,
	"days" numeric(6, 1) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"leave_type_id" uuid NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"half_day" boolean DEFAULT false NOT NULL,
	"days" numeric(6, 1) NOT NULL,
	"reason" text,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(8) NOT NULL,
	"name" varchar(60) NOT NULL,
	"name_hi" varchar(60),
	"annual_quota" numeric(6, 1) DEFAULT '0' NOT NULL,
	"paid" boolean DEFAULT true NOT NULL,
	"encashable" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"status" varchar(10) DEFAULT 'draft' NOT NULL,
	"gross" numeric(18, 2) DEFAULT '0' NOT NULL,
	"deductions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net_pay" numeric(18, 2) DEFAULT '0' NOT NULL,
	"employer_contributions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"voucher_id" uuid,
	"payment_voucher_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finalized_at" timestamp with time zone,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payroll_settings" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"pf_establishment_code" varchar(22),
	"esi_employer_code" varchar(17),
	"labour_code_wages" boolean DEFAULT true NOT NULL,
	"weekly_offs" jsonb DEFAULT '[0]'::jsonb NOT NULL,
	"lwf_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lwf_employer" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lwf_months" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"encashment_divisor" integer DEFAULT 30 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payslips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"lop_days" numeric(5, 1) DEFAULT '0' NOT NULL,
	"lop_override" numeric(5, 1),
	"paid_days" numeric(5, 1) NOT NULL,
	"gross" numeric(18, 2) NOT NULL,
	"pf_wages" numeric(18, 2) DEFAULT '0' NOT NULL,
	"pf_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"esi_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"pt" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lwf_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_deductions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_deductions" numeric(18, 2) NOT NULL,
	"net_pay" numeric(18, 2) NOT NULL,
	"employer_contributions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"detail" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_structures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"effective_from" date NOT NULL,
	"components" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"left_on" date NOT NULL,
	"service_years" integer NOT NULL,
	"gratuity" numeric(18, 2) DEFAULT '0' NOT NULL,
	"leave_days" numeric(6, 1) DEFAULT '0' NOT NULL,
	"leave_encashment" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_earnings" numeric(18, 2) DEFAULT '0' NOT NULL,
	"recoveries" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"remarks" text,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_declarations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"fy" varchar(7) NOT NULL,
	"rent_paid" numeric(18, 2) DEFAULT '0' NOT NULL,
	"c80" numeric(18, 2) DEFAULT '0' NOT NULL,
	"ccd1b" numeric(18, 2) DEFAULT '0' NOT NULL,
	"d80" numeric(18, 2) DEFAULT '0' NOT NULL,
	"home_loan_interest" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_deductions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_income" numeric(18, 2) DEFAULT '0' NOT NULL,
	"previous_employer_salary" numeric(18, 2) DEFAULT '0' NOT NULL,
	"previous_employer_tds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_leave_request_id_leave_requests_id_fk" FOREIGN KEY ("leave_request_id") REFERENCES "public"."leave_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_openings" ADD CONSTRAINT "leave_openings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_openings" ADD CONSTRAINT "leave_openings_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_openings" ADD CONSTRAINT "leave_openings_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_payment_voucher_id_vouchers_id_fk" FOREIGN KEY ("payment_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_settings" ADD CONSTRAINT "payroll_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_settings" ADD CONSTRAINT "payroll_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_run_id_payroll_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."payroll_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_declarations" ADD CONSTRAINT "tax_declarations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_declarations" ADD CONSTRAINT "tax_declarations_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_day" ON "attendance" USING btree ("employee_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_code" ON "employees" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "holidays_date" ON "holidays" USING btree ("company_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "leave_openings_fy" ON "leave_openings" USING btree ("employee_id","leave_type_id","fy");--> statement-breakpoint
CREATE INDEX "leave_requests_employee" ON "leave_requests" USING btree ("employee_id","from_date");--> statement-breakpoint
CREATE UNIQUE INDEX "leave_types_code" ON "leave_types" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "payslips_employee" ON "payslips" USING btree ("run_id","employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "salary_structures_from" ON "salary_structures" USING btree ("employee_id","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "tax_declarations_fy" ON "tax_declarations" USING btree ("employee_id","fy");