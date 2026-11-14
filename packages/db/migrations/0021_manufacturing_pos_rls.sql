DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['work_centres','boms','bom_lines','bom_operations','production_orders','production_entries','job_work_challans',
    'pos_settings','pos_terminals','pos_sessions','pos_tables','pos_orders','kots','loyalty_members','pos_bills','pos_bill_lines'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- One open session per terminal.
CREATE UNIQUE INDEX pos_sessions_open ON pos_sessions (terminal_id) WHERE status = 'open';
--> statement-breakpoint
-- Offline POS devices need terminals and their bills (items already log their changes).
CREATE TRIGGER sync_pos_terminals AFTER INSERT OR UPDATE ON pos_terminals FOR EACH ROW EXECUTE FUNCTION record_sync_change('pos_terminal');
--> statement-breakpoint
CREATE TRIGGER sync_pos_bills AFTER INSERT OR UPDATE ON pos_bills FOR EACH ROW EXECUTE FUNCTION record_sync_change('pos_bill');
