-- Sealing a whole batch in one statement (the first seal of a long history would otherwise take one call per entry).
CREATE OR REPLACE FUNCTION seal_audit_entries(p_ids bigint[], p_seqs bigint[], p_prevs text[], p_hashes text[])
  RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  UPDATE audit_log a SET chain_seq = v.seq, prev_hash = v.prev, hash = v.hash
    FROM unnest(p_ids, p_seqs, p_prevs, p_hashes) AS v(id, seq, prev, hash)
   WHERE a.id = v.id AND a.tenant_id = app_tenant() AND a.hash IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION seal_audit_entries(bigint[], bigint[], text[], text[]) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION seal_audit_entries(bigint[], bigint[], text[], text[]) TO varchasv_app;
--> statement-breakpoint
DROP FUNCTION IF EXISTS seal_audit_entry(bigint, bigint, char, char);
