CREATE TABLE "measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_phone" varchar(10) NOT NULL,
	"customer_name" varchar(80),
	"garment" varchar(40) NOT NULL,
	"values" jsonb NOT NULL,
	"photo_file_id" uuid,
	"notes" text,
	"taken_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tailoring_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"customer_name" varchar(80) NOT NULL,
	"customer_phone" varchar(10) NOT NULL,
	"lines" jsonb NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"advance" numeric(18, 2) DEFAULT '0' NOT NULL,
	"advance_voucher_id" uuid,
	"trial_on" date,
	"delivery_on" date NOT NULL,
	"status" varchar(12) DEFAULT 'booked' NOT NULL,
	"delivered_on" date,
	"delivery_bill_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tailoring_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"garment" varchar(40) NOT NULL,
	"process" varchar(40) NOT NULL,
	"rate" numeric(18, 2) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_photo_file_id_files_id_fk" FOREIGN KEY ("photo_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_advance_voucher_id_gift_vouchers_id_fk" FOREIGN KEY ("advance_voucher_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_delivery_bill_id_pos_bills_id_fk" FOREIGN KEY ("delivery_bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_rates" ADD CONSTRAINT "tailoring_rates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_rates" ADD CONSTRAINT "tailoring_rates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "measurements_phone" ON "measurements" USING btree ("company_id","customer_phone");--> statement-breakpoint
CREATE UNIQUE INDEX "tailoring_orders_number" ON "tailoring_orders" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "tailoring_orders_status" ON "tailoring_orders" USING btree ("company_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "tailoring_rates_key" ON "tailoring_rates" USING btree ("company_id",lower("garment"),lower("process"));--> statement-breakpoint
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON measurements USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON measurements TO varchasv_app;--> statement-breakpoint
ALTER TABLE tailoring_rates ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tailoring_rates USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tailoring_rates TO varchasv_app;--> statement-breakpoint
ALTER TABLE tailoring_orders ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tailoring_orders USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tailoring_orders TO varchasv_app;
