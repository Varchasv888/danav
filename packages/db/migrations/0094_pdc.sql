CREATE TABLE "post_dated_cheques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"direction" varchar(8) NOT NULL,
	"party_id" uuid NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"cheque_no" varchar(12) NOT NULL,
	"drawn_on" varchar(60),
	"cheque_date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"voucher_id" uuid,
	"note" varchar(200),
	"settled_on" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_party_id_accounts_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_bank_account_id_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pdc_status_date" ON "post_dated_cheques" USING btree ("company_id","status","cheque_date");--> statement-breakpoint
ALTER TABLE post_dated_cheques ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON post_dated_cheques USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON post_dated_cheques TO varchasv_app;
