ALTER TABLE "comm_settings" ADD COLUMN "auto_events" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION comm_reminder_tenants() RETURNS SETOF uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM comm_settings WHERE auto_events ? 'payment_reminders' OR auto_events ? 'approval_due'
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION comm_reminder_tenants() FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION comm_reminder_tenants() TO varchasv_app;
