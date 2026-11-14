CREATE TABLE "backup_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trigger" varchar(8) NOT NULL,
	"status" varchar(8) NOT NULL,
	"filename" varchar(80),
	"bytes" integer,
	"table_count" integer,
	"row_count" integer,
	"sha256" char(64),
	"sent_to" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"error" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "backup_settings" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"frequency" varchar(8) DEFAULT 'weekly' NOT NULL,
	"hour" integer DEFAULT 2 NOT NULL,
	"weekday" integer DEFAULT 0 NOT NULL,
	"recipients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"passphrase_enc" text,
	"next_run_at" timestamp with time zone,
	"last_run_at" timestamp with time zone,
	"last_ok_at" timestamp with time zone,
	"last_error" varchar(200),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "backup_runs" ADD CONSTRAINT "backup_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backup_settings" ADD CONSTRAINT "backup_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "backup_runs_when" ON "backup_runs" USING btree ("tenant_id","started_at");--> statement-breakpoint
ALTER TABLE backup_settings ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON backup_settings USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON backup_settings TO varchasv_app;--> statement-breakpoint
ALTER TABLE backup_runs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON backup_runs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON backup_runs TO varchasv_app;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a backup due.
CREATE OR REPLACE FUNCTION due_backups(p_now timestamptz)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT s.tenant_id FROM backup_settings s
    JOIN tenants t ON t.id = s.tenant_id AND t.status = 'active'
    WHERE s.enabled AND s.next_run_at IS NOT NULL AND s.next_run_at <= p_now
    ORDER BY s.next_run_at LIMIT 50
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_backups(timestamptz) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_backups(timestamptz) TO varchasv_app;
