DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['quotations','quotation_lines','gst_filings','gst_sessions'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- E-way bills generated before ewb_status existed are live ones.
UPDATE sales_invoices SET ewb_status = 'active' WHERE ewb_no IS NOT NULL;
