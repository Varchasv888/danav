DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['account_groups','accounts','vouchers','voucher_lines','gl_entries'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
  END LOOP;
END $$;
--> statement-breakpoint

-- Posted ledger entries are never changed or deleted; corrections are reversing entries.
CREATE OR REPLACE FUNCTION gl_entries_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'gl_entries is append-only; post a reversal instead';
END $$;
--> statement-breakpoint
CREATE TRIGGER gl_entries_no_change BEFORE UPDATE OR DELETE ON gl_entries
  FOR EACH ROW EXECUTE FUNCTION gl_entries_immutable();
--> statement-breakpoint
REVOKE UPDATE, DELETE, TRUNCATE ON gl_entries FROM varchasv_app;
--> statement-breakpoint

-- Every voucher's ledger rows must balance. Checked at commit, after all rows of the voucher exist.
CREATE OR REPLACE FUNCTION gl_voucher_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE diff numeric;
BEGIN
  SELECT coalesce(sum(debit), 0) - coalesce(sum(credit), 0) INTO diff FROM gl_entries WHERE voucher_id = NEW.voucher_id;
  IF diff <> 0 THEN
    RAISE EXCEPTION 'ledger entries for voucher % do not balance (difference %)', NEW.voucher_id, diff;
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER gl_entries_balanced AFTER INSERT ON gl_entries
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION gl_voucher_balanced();
--> statement-breakpoint
ALTER TABLE voucher_lines ADD CONSTRAINT voucher_lines_one_side CHECK ((debit >= 0 AND credit >= 0) AND (debit = 0 OR credit = 0) AND (debit > 0 OR credit > 0));
--> statement-breakpoint
ALTER TABLE gl_entries ADD CONSTRAINT gl_entries_one_side CHECK ((debit >= 0 AND credit >= 0) AND (debit = 0 OR credit = 0));
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON account_groups, accounts, vouchers, voucher_lines TO varchasv_app;
--> statement-breakpoint
GRANT SELECT, INSERT ON gl_entries TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE gl_entries_id_seq TO varchasv_app;
