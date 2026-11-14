-- A delivery receipt or a STOP reply from a messaging provider arrives with no login. These two lookups say which business a provider message id,
-- or a contact, belongs to without opening the tables to anyone: they return only tenant ids.
CREATE OR REPLACE FUNCTION comm_tenant_by_provider_id(p_id text) RETURNS uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM comm_outbox WHERE provider_id = p_id LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION comm_tenants_by_contact(p_to text) RETURNS SETOF uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT DISTINCT tenant_id FROM comm_outbox WHERE "to" = p_to
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION comm_tenant_by_provider_id(text) FROM PUBLIC;
--> statement-breakpoint
REVOKE ALL ON FUNCTION comm_tenants_by_contact(text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION comm_tenant_by_provider_id(text) TO varchasv_app;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION comm_tenants_by_contact(text) TO varchasv_app;
