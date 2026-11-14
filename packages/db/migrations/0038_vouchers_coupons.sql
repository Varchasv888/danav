CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"kind" varchar(8) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"max_discount" numeric(18, 2),
	"min_bill" numeric(18, 2),
	"starts_on" date,
	"ends_on" date,
	"max_uses" integer,
	"used" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discount_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(20) NOT NULL,
	"holder" varchar(80) NOT NULL,
	"phone" varchar(10),
	"pct" numeric(5, 2) NOT NULL,
	"valid_until" date,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_voucher_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"gift_voucher_id" uuid NOT NULL,
	"bill_id" uuid NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"reversed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(16) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"balance" numeric(18, 2) NOT NULL,
	"issued_on" date NOT NULL,
	"expires_on" date NOT NULL,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"customer_phone" varchar(10),
	"customer_name" varchar(80),
	"paid_by" varchar(6) NOT NULL,
	"voucher_id" uuid,
	"expiry_voucher_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lucky_draws" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"min_bill" numeric(18, 2),
	"entries" integer NOT NULL,
	"winners" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loyalty_members" ADD COLUMN "referred_by" varchar(10);--> statement-breakpoint
ALTER TABLE "pos_bills" ADD COLUMN "promos" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "referral_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_cards" ADD CONSTRAINT "discount_cards_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_cards" ADD CONSTRAINT "discount_cards_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_voucher_redemptions" ADD CONSTRAINT "gift_voucher_redemptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_voucher_redemptions" ADD CONSTRAINT "gift_voucher_redemptions_gift_voucher_id_gift_vouchers_id_fk" FOREIGN KEY ("gift_voucher_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_expiry_voucher_id_vouchers_id_fk" FOREIGN KEY ("expiry_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lucky_draws" ADD CONSTRAINT "lucky_draws_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lucky_draws" ADD CONSTRAINT "lucky_draws_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lucky_draws" ADD CONSTRAINT "lucky_draws_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_code" ON "coupons" USING btree ("company_id",upper("code"));--> statement-breakpoint
CREATE UNIQUE INDEX "discount_cards_number" ON "discount_cards" USING btree ("company_id",upper("number"));--> statement-breakpoint
CREATE INDEX "gift_voucher_redemptions_voucher" ON "gift_voucher_redemptions" USING btree ("gift_voucher_id");--> statement-breakpoint
CREATE UNIQUE INDEX "gift_vouchers_code" ON "gift_vouchers" USING btree ("company_id","code");--> statement-breakpoint
ALTER TABLE gift_vouchers ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gift_vouchers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gift_vouchers TO varchasv_app;--> statement-breakpoint
ALTER TABLE gift_voucher_redemptions ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gift_voucher_redemptions USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gift_voucher_redemptions TO varchasv_app;--> statement-breakpoint
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON coupons USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON coupons TO varchasv_app;--> statement-breakpoint
ALTER TABLE discount_cards ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON discount_cards USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON discount_cards TO varchasv_app;--> statement-breakpoint
ALTER TABLE lucky_draws ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON lucky_draws USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON lucky_draws TO varchasv_app;
