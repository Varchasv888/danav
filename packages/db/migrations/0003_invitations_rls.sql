ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON invitations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint

-- Looks up an open invitation by token hash before the invitee has a tenant context.
-- Returns nothing for expired, revoked or already-accepted invitations.
CREATE OR REPLACE FUNCTION invitation_by_token(p_hash text)
  RETURNS TABLE (id uuid, tenant_id uuid, tenant_name text, email text, role_id uuid, role_name text)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT i.id, i.tenant_id, t.name, i.email, i.role_id, r.name
    FROM invitations i
    JOIN tenants t ON t.id = i.tenant_id
    JOIN roles r ON r.id = i.role_id
    WHERE i.token_hash = p_hash
      AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > now()
      AND t.status = 'active'
  $$;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION invitation_by_token(text) TO varchasv_app;
