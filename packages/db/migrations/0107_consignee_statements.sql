ALTER TABLE "consignee_terms" ADD COLUMN "statement_frequency" varchar(8);--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD COLUMN "statement_email" varchar(120);--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD COLUMN "statement_last_sent" date;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a consignee statement scheduled.
CREATE OR REPLACE FUNCTION due_consignee_tenants(p_today date)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT c.tenant_id FROM consignee_terms c
    JOIN tenants t ON t.id = c.tenant_id AND t.status = 'active'
    WHERE c.statement_frequency IS NOT NULL AND c.statement_email IS NOT NULL
      AND (c.statement_last_sent IS NULL OR c.statement_last_sent + (CASE c.statement_frequency WHEN 'weekly' THEN 7 ELSE 30 END) <= p_today)
    LIMIT 200
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_consignee_tenants(date) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_consignee_tenants(date) TO varchasv_app;
