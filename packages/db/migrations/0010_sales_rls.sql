DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sales_orders','sales_order_lines','delivery_notes','delivery_note_lines','sales_invoices',
    'sales_invoice_lines','credit_notes','credit_note_lines','gst_settings'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- The IRN is unique across the whole system (the IRP never issues the same one twice).
CREATE UNIQUE INDEX sales_invoices_irn ON sales_invoices (irn) WHERE irn IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX credit_notes_irn ON credit_notes (irn) WHERE irn IS NOT NULL;
