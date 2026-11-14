CREATE TABLE "alteration_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"kind" varchar(10) DEFAULT 'alteration' NOT NULL,
	"charge" numeric(18, 2) DEFAULT '0' NOT NULL,
	"labour" numeric(18, 2) DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alterations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"bill_id" uuid,
	"customer_name" varchar(80),
	"customer_phone" varchar(10),
	"lines" jsonb NOT NULL,
	"charge" numeric(18, 2) NOT NULL,
	"labour" numeric(18, 2) NOT NULL,
	"complimentary" boolean DEFAULT false NOT NULL,
	"trial_on" date,
	"delivery_on" date NOT NULL,
	"status" varchar(12) DEFAULT 'received' NOT NULL,
	"karigar_id" uuid,
	"issued_on" date,
	"ready_on" date,
	"delivered_on" date,
	"labour_voucher_id" uuid,
	"delivery_bill_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "karigars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"phone" varchar(10),
	"account_id" uuid,
	"employee_id" uuid,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alteration_types" ADD CONSTRAINT "alteration_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alteration_types" ADD CONSTRAINT "alteration_types_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_bill_id_pos_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_karigar_id_karigars_id_fk" FOREIGN KEY ("karigar_id") REFERENCES "public"."karigars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_labour_voucher_id_vouchers_id_fk" FOREIGN KEY ("labour_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_delivery_bill_id_pos_bills_id_fk" FOREIGN KEY ("delivery_bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "alteration_types_name" ON "alteration_types" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "alterations_number" ON "alterations" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "alterations_status" ON "alterations" USING btree ("company_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "karigars_name" ON "karigars" USING btree ("company_id",lower("name"));--> statement-breakpoint
ALTER TABLE karigars ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON karigars USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON karigars TO varchasv_app;--> statement-breakpoint
ALTER TABLE alteration_types ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON alteration_types USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON alteration_types TO varchasv_app;--> statement-breakpoint
ALTER TABLE alterations ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON alterations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON alterations TO varchasv_app;
