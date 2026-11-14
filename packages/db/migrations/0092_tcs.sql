CREATE TABLE "tcs_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"section" varchar(20) NOT NULL,
	"date" date NOT NULL,
	"base" numeric(18, 2) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"tcs" numeric(18, 2) NOT NULL,
	"no_pan" boolean DEFAULT false NOT NULL,
	"voucher_id" uuid,
	"challan_id" uuid,
	"note" varchar(200),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tds_challans" ADD COLUMN "kind" varchar(3) DEFAULT 'tds' NOT NULL;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tcs_collections_date" ON "tcs_collections" USING btree ("company_id","date");--> statement-breakpoint
ALTER TABLE tcs_collections ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tcs_collections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tcs_collections TO varchasv_app;
