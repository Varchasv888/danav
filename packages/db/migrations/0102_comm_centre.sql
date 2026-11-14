CREATE TABLE "comm_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"contact" varchar(120) NOT NULL,
	"channel" varchar(10) NOT NULL,
	"marketing_opt_in" boolean DEFAULT false NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
	"source" varchar(30),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comm_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"event" varchar(30) NOT NULL,
	"channel" varchar(10) NOT NULL,
	"category" varchar(12) NOT NULL,
	"language" varchar(5) NOT NULL,
	"to" varchar(120) NOT NULL,
	"account_id" uuid,
	"subject" varchar(120),
	"body" text NOT NULL,
	"status" varchar(10) DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dedupe_key" varchar(120),
	"provider" varchar(20),
	"provider_id" varchar(120),
	"cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"error" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "comm_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"cost_whatsapp_utility" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_whatsapp_marketing" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_sms" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_email" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_push" numeric(8, 2) DEFAULT '0' NOT NULL,
	"owner_phone" varchar(10),
	"owner_email" varchar(120),
	"max_attempts" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comm_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"event" varchar(30) NOT NULL,
	"channel" varchar(10) NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"category" varchar(12) DEFAULT 'utility' NOT NULL,
	"subject" varchar(120),
	"body" text NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comm_consents" ADD CONSTRAINT "comm_consents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_consents" ADD CONSTRAINT "comm_consents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_settings" ADD CONSTRAINT "comm_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_settings" ADD CONSTRAINT "comm_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_templates" ADD CONSTRAINT "comm_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_templates" ADD CONSTRAINT "comm_templates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "comm_consents_key" ON "comm_consents" USING btree ("company_id","contact","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "comm_outbox_dedupe" ON "comm_outbox" USING btree ("company_id","dedupe_key") WHERE "comm_outbox"."dedupe_key" is not null;--> statement-breakpoint
CREATE INDEX "comm_outbox_due" ON "comm_outbox" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX "comm_outbox_company" ON "comm_outbox" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "comm_settings_company" ON "comm_settings" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "comm_templates_key" ON "comm_templates" USING btree ("company_id","event","channel","language");--> statement-breakpoint
ALTER TABLE comm_templates ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_templates USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_templates TO varchasv_app;--> statement-breakpoint
ALTER TABLE comm_consents ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_consents USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_consents TO varchasv_app;--> statement-breakpoint
ALTER TABLE comm_outbox ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_outbox USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_outbox TO varchasv_app;--> statement-breakpoint
ALTER TABLE comm_settings ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_settings USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_settings TO varchasv_app;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a message waiting to go.
CREATE OR REPLACE FUNCTION due_comm_tenants(p_now timestamptz)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT o.tenant_id FROM comm_outbox o
    JOIN tenants t ON t.id = o.tenant_id AND t.status = 'active'
    WHERE o.status = 'queued' AND o.next_attempt_at <= p_now
    LIMIT 200
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_comm_tenants(timestamptz) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_comm_tenants(timestamptz) TO varchasv_app;
