-- Row-level security: every tenant-owned row is visible only when app.tenant_id matches.
-- The application connects as varchasv_app (no BYPASSRLS, not the table owner), so these
-- policies apply to every query it runs. Migrations run as the owner.

CREATE OR REPLACE FUNCTION app_tenant() RETURNS uuid
  LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.tenant_id', true), '')::uuid $$;
--> statement-breakpoint
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['roles','memberships','companies','branches','fiscal_years','devices','number_series','audit_log'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
  END LOOP;
END $$;
--> statement-breakpoint
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_self ON tenants USING (id = app_tenant()) WITH CHECK (id = app_tenant());
--> statement-breakpoint

-- Before a tenant is chosen (at login) the app needs the list of tenants a user belongs to.
CREATE OR REPLACE FUNCTION user_tenants(p_user uuid)
  RETURNS TABLE (tenant_id uuid, tenant_name text, role_key text)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT m.tenant_id, t.name, r.key
    FROM memberships m
    JOIN tenants t ON t.id = m.tenant_id
    JOIN roles r ON r.id = m.role_id
    WHERE m.user_id = p_user AND m.status = 'active' AND t.status = 'active'
    ORDER BY t.created_at
  $$;
--> statement-breakpoint

-- The audit trail is append-only (Companies Act audit-trail rule): no updates or deletes, by anyone.
CREATE OR REPLACE FUNCTION audit_log_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END $$;
--> statement-breakpoint
CREATE TRIGGER audit_log_no_change BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_immutable();
--> statement-breakpoint

GRANT USAGE ON SCHEMA public TO varchasv_app;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO varchasv_app;
--> statement-breakpoint
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM varchasv_app;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION app_tenant(), user_tenants(uuid) TO varchasv_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO varchasv_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO varchasv_app;
