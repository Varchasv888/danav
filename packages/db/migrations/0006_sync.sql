-- Change log for offline devices. Every insert/update of a synced table records (entity, id, txid).
-- Devices pull with a transaction-id cursor: the server only hands out changes from transactions
-- older than the oldest still-running one (pg_snapshot_xmin), so a slow commit is never skipped.
CREATE TABLE sync_changes (
  seq bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity varchar(30) NOT NULL,
  entity_id uuid NOT NULL,
  txid xid8 NOT NULL DEFAULT pg_current_xact_id(),
  at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX sync_changes_tenant_txid ON sync_changes (tenant_id, txid);
--> statement-breakpoint
ALTER TABLE sync_changes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON sync_changes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT ON sync_changes TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE sync_changes_seq_seq TO varchasv_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION record_sync_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO sync_changes (tenant_id, entity, entity_id) VALUES (NEW.tenant_id, TG_ARGV[0], NEW.id);
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE TRIGGER sync_companies AFTER INSERT OR UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION record_sync_change('company');
--> statement-breakpoint
CREATE TRIGGER sync_branches AFTER INSERT OR UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION record_sync_change('branch');
--> statement-breakpoint
CREATE TRIGGER sync_fiscal_years AFTER INSERT OR UPDATE ON fiscal_years FOR EACH ROW EXECUTE FUNCTION record_sync_change('fiscal_year');
--> statement-breakpoint
CREATE TRIGGER sync_account_groups AFTER INSERT OR UPDATE ON account_groups FOR EACH ROW EXECUTE FUNCTION record_sync_change('account_group');
--> statement-breakpoint
CREATE TRIGGER sync_accounts AFTER INSERT OR UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION record_sync_change('account');
--> statement-breakpoint
CREATE TRIGGER sync_vouchers AFTER INSERT OR UPDATE ON vouchers FOR EACH ROW EXECUTE FUNCTION record_sync_change('voucher');
--> statement-breakpoint
-- The oldest transaction still running; changes from transactions below it are final.
CREATE OR REPLACE FUNCTION sync_horizon() RETURNS xid8 LANGUAGE sql STABLE AS $$ SELECT pg_snapshot_xmin(pg_current_snapshot()) $$;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION sync_horizon() TO varchasv_app;
