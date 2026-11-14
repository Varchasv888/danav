DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['files','bank_profiles','bank_statements','bank_lines','bank_matches','bank_rules','gateway_settlements',
    'asset_classes','assets','depreciation_runs','depreciation_entries','it_block_openings',
    'expense_categories','expense_claims','expense_lines',
    'projects','project_tasks','project_members','timesheets','project_milestones'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- A bank line is matched to a voucher at most once.
CREATE UNIQUE INDEX bank_matches_line_voucher ON bank_matches (bank_line_id, voucher_id);
--> statement-breakpoint
-- The new permission modules (banking, assets, expenses, projects) for existing businesses' built-in roles,
-- as packages/domain/src/permissions.ts gives them to new ones.
DO $$
DECLARE
  all_actions text[] := ARRAY['view','create','edit','submit','cancel','delete','export','approve'];
  everything text[] := ARRAY(SELECT m || '.' || a FROM unnest(ARRAY['banking','assets','expenses','projects']) m, unnest(all_actions) a);
  grants jsonb := jsonb_build_object(
    'owner', to_jsonb(everything),
    'admin', to_jsonb(everything),
    'accountant', to_jsonb(ARRAY(SELECT m || '.' || a FROM unnest(ARRAY['banking','assets']) m, unnest(all_actions) a)
      || ARRAY['expenses.view','expenses.create','expenses.edit','expenses.submit','expenses.export','expenses.approve','projects.view']),
    'sales', to_jsonb(ARRAY['projects.view','projects.create','projects.edit','projects.submit','projects.export']),
    'hr', to_jsonb(ARRAY['expenses.view','expenses.create','expenses.edit','expenses.submit','expenses.export']),
    'viewer', to_jsonb(ARRAY['banking.view','assets.view','expenses.view','projects.view'])
  );
  k text;
BEGIN
  FOR k IN SELECT jsonb_object_keys(grants) LOOP
    UPDATE roles SET permissions = ARRAY(
      SELECT DISTINCT p FROM unnest(permissions || ARRAY(SELECT jsonb_array_elements_text(grants -> k))) AS p ORDER BY p
    ) WHERE system AND key = k;
  END LOOP;
END $$;
