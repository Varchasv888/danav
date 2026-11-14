DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['employees','salary_structures','tax_declarations','holidays','leave_types','leave_openings','leave_requests',
    'attendance','payroll_settings','payroll_runs','payslips','settlements'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- One live payroll run per company and month (a cancelled run can be redone).
CREATE UNIQUE INDEX payroll_runs_period ON payroll_runs (company_id, period) WHERE status <> 'cancelled';
