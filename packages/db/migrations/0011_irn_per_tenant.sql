-- The IRP itself guarantees an IRN is never issued twice. Ours only needs to stop the same business
-- storing one twice; making it global would wrongly clash if a GSTIN is ever used in two businesses.
DROP INDEX IF EXISTS sales_invoices_irn;
--> statement-breakpoint
DROP INDEX IF EXISTS credit_notes_irn;
--> statement-breakpoint
CREATE UNIQUE INDEX sales_invoices_irn ON sales_invoices (tenant_id, irn) WHERE irn IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX credit_notes_irn ON credit_notes (tenant_id, irn) WHERE irn IS NOT NULL;
