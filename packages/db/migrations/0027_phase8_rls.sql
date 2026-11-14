DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['crm_leads','crm_activities','message_templates','messages','saved_reports'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- The report scheduler runs outside any tenant: it may only learn which reports are due (and whose),
-- then does the work inside that tenant's own transaction.
CREATE OR REPLACE FUNCTION due_saved_reports(p_now timestamptz)
  RETURNS TABLE (tenant_id uuid, report_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT s.tenant_id, s.id FROM saved_reports s
    JOIN tenants t ON t.id = s.tenant_id AND t.status = 'active'
    WHERE s.next_run_at IS NOT NULL AND s.next_run_at <= p_now
    ORDER BY s.next_run_at LIMIT 100
  $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION due_saved_reports(timestamptz) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_saved_reports(timestamptz) TO varchasv_app;
--> statement-breakpoint
-- The CRM module for existing businesses' built-in roles (as packages/domain/src/permissions.ts gives new ones).
DO $$
DECLARE
  all_actions text[] := ARRAY['view','create','edit','submit','cancel','delete','export','approve'];
  work text[] := ARRAY['crm.view','crm.create','crm.edit','crm.submit','crm.export'];
  grants jsonb := jsonb_build_object(
    'owner', to_jsonb(ARRAY(SELECT 'crm.' || a FROM unnest(all_actions) a)),
    'admin', to_jsonb(ARRAY(SELECT 'crm.' || a FROM unnest(all_actions) a)),
    'sales', to_jsonb(work),
    'accountant', to_jsonb(ARRAY['crm.view']),
    'viewer', to_jsonb(ARRAY['crm.view'])
  );
  k text;
BEGIN
  FOR k IN SELECT jsonb_object_keys(grants) LOOP
    UPDATE roles SET permissions = ARRAY(
      SELECT DISTINCT p FROM unnest(permissions || ARRAY(SELECT jsonb_array_elements_text(grants -> k))) AS p ORDER BY p
    ) WHERE system AND key = k;
  END LOOP;
END $$;
