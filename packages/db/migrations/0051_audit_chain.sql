ALTER TABLE "audit_log" ADD COLUMN "chain_seq" bigint;--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "prev_hash" char(64);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "hash" char(64);--> statement-breakpoint
CREATE INDEX "audit_log_tenant_chain" ON "audit_log" USING btree ("tenant_id","chain_seq");--> statement-breakpoint
-- Sealing is the one allowed change to an audit entry: filling in its chain fields once, nothing else.
CREATE OR REPLACE FUNCTION audit_log_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.hash IS NULL AND NEW.hash IS NOT NULL
     AND (NEW.id, NEW.tenant_id, NEW.user_id, NEW.action, NEW.entity, NEW.entity_id, NEW.before, NEW.after, NEW.ip, NEW.at)
         IS NOT DISTINCT FROM (OLD.id, OLD.tenant_id, OLD.user_id, OLD.action, OLD.entity, OLD.entity_id, OLD.before, OLD.after, OLD.ip, OLD.at) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'audit_log is append-only';
END $$;
--> statement-breakpoint
-- The app role cannot update the audit log; this function (run as the owner) can only seal an unsealed
-- entry of the caller's own business, and the trigger above lets nothing else change.
CREATE OR REPLACE FUNCTION seal_audit_entry(p_id bigint, p_seq bigint, p_prev char(64), p_hash char(64))
  RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  UPDATE audit_log SET chain_seq = p_seq, prev_hash = p_prev, hash = p_hash
   WHERE id = p_id AND tenant_id = app_tenant() AND hash IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n = 1;
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION seal_audit_entry(bigint, bigint, char, char) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION seal_audit_entry(bigint, bigint, char, char) TO varchasv_app;
--> statement-breakpoint
-- The scheduler learns only which businesses have unsealed entries, then seals inside each one's own transaction.
CREATE OR REPLACE FUNCTION tenants_with_unsealed_audit()
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT a.tenant_id FROM audit_log a JOIN tenants t ON t.id = a.tenant_id AND t.status = 'active'
    WHERE a.hash IS NULL LIMIT 200
  $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION tenants_with_unsealed_audit() FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION tenants_with_unsealed_audit() TO varchasv_app;
