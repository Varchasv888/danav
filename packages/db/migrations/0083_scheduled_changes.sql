CREATE TABLE "scheduled_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"entity" varchar(10) NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_name" text NOT NULL,
	"field" varchar(20) NOT NULL,
	"value" varchar(40),
	"previous" varchar(40),
	"effective_from" date NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp with time zone,
	"error" varchar(120),
	"note" varchar(200),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scheduled_changes" ADD CONSTRAINT "scheduled_changes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_changes" ADD CONSTRAINT "scheduled_changes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scheduled_changes_due" ON "scheduled_changes" USING btree ("status","effective_from");--> statement-breakpoint
CREATE INDEX "scheduled_changes_entity" ON "scheduled_changes" USING btree ("tenant_id","entity","entity_id");--> statement-breakpoint
ALTER TABLE scheduled_changes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON scheduled_changes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON scheduled_changes TO varchasv_app;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a change due.
CREATE OR REPLACE FUNCTION due_scheduled_changes(p_today date)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT c.tenant_id FROM scheduled_changes c
    JOIN tenants t ON t.id = c.tenant_id AND t.status = 'active'
    WHERE c.status = 'pending' AND c.effective_from <= p_today
    LIMIT 200
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_scheduled_changes(date) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_scheduled_changes(date) TO varchasv_app;
