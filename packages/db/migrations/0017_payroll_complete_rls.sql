DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['shifts','employee_loans','statutory_payments'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
ALTER TABLE employees ADD CONSTRAINT employees_shift_fk FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL;
