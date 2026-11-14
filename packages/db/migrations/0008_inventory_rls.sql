DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['uoms','warehouses','items','stock_ledger','stock_journals','stock_journal_lines',
    'purchase_orders','purchase_order_lines','goods_receipts','goods_receipt_lines',
    'purchase_bills','purchase_bill_lines','purchase_returns','purchase_return_lines'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- The stock ledger is append-only, like the general ledger.
CREATE OR REPLACE FUNCTION stock_ledger_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'stock_ledger is append-only; post a reversal instead';
END $$;
--> statement-breakpoint
CREATE TRIGGER stock_ledger_no_change BEFORE UPDATE OR DELETE ON stock_ledger
  FOR EACH ROW EXECUTE FUNCTION stock_ledger_immutable();
--> statement-breakpoint
ALTER TABLE stock_ledger ADD CONSTRAINT stock_ledger_one_side CHECK (qty_in >= 0 AND qty_out >= 0 AND (qty_in = 0 OR qty_out = 0) AND (qty_in > 0 OR qty_out > 0) AND rate >= 0);
--> statement-breakpoint
ALTER TABLE companies ADD CONSTRAINT companies_valuation_method CHECK (valuation_method IN ('average', 'fifo'));
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON uoms, warehouses, items, stock_journals, stock_journal_lines,
  purchase_orders, purchase_order_lines, goods_receipts, goods_receipt_lines,
  purchase_bills, purchase_bill_lines, purchase_returns, purchase_return_lines TO varchasv_app;
--> statement-breakpoint
GRANT SELECT, INSERT ON stock_ledger TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE stock_ledger_id_seq TO varchasv_app;
--> statement-breakpoint
CREATE TRIGGER sync_items AFTER INSERT OR UPDATE ON items FOR EACH ROW EXECUTE FUNCTION record_sync_change('item');
--> statement-breakpoint
CREATE TRIGGER sync_warehouses AFTER INSERT OR UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION record_sync_change('warehouse');
