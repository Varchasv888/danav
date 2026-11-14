CREATE TABLE "recon_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"item_id" uuid,
	"action" varchar(20) NOT NULL,
	"detail" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"by" uuid,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recon_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"side" varchar(6) NOT NULL,
	"ref" varchar(60) DEFAULT '' NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"description" varchar(160),
	"source_voucher_id" uuid,
	"status" varchar(12) DEFAULT 'unmatched' NOT NULL,
	"group_id" uuid,
	"rule" varchar(14),
	"matched_by" varchar(6),
	"reason_code" varchar(20),
	"owner_id" uuid,
	"note" varchar(200),
	"evidence_file_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recon_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(20) NOT NULL,
	"party_id" uuid,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"rules" jsonb NOT NULL,
	"their_closing" numeric(18, 2),
	"status" varchar(8) DEFAULT 'open' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "recon_writeoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"item_ids" jsonb NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"reason_code" varchar(20) NOT NULL,
	"note" varchar(200),
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"voucher_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recon_events" ADD CONSTRAINT "recon_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_events" ADD CONSTRAINT "recon_events_run_id_recon_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."recon_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_events" ADD CONSTRAINT "recon_events_by_users_id_fk" FOREIGN KEY ("by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_items" ADD CONSTRAINT "recon_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_items" ADD CONSTRAINT "recon_items_run_id_recon_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."recon_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_items" ADD CONSTRAINT "recon_items_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_party_id_accounts_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_run_id_recon_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."recon_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recon_events_run" ON "recon_events" USING btree ("run_id","id");--> statement-breakpoint
CREATE INDEX "recon_items_run" ON "recon_items" USING btree ("run_id","status");--> statement-breakpoint
CREATE INDEX "recon_runs_company" ON "recon_runs" USING btree ("company_id","status");--> statement-breakpoint
ALTER TABLE recon_runs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_runs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON recon_runs TO varchasv_app;--> statement-breakpoint
ALTER TABLE recon_items ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_items USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON recon_items TO varchasv_app;--> statement-breakpoint
ALTER TABLE recon_events ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_events USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT ON recon_events TO varchasv_app;--> statement-breakpoint
GRANT USAGE ON SEQUENCE recon_events_id_seq TO varchasv_app;--> statement-breakpoint
ALTER TABLE recon_writeoffs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_writeoffs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON recon_writeoffs TO varchasv_app;
