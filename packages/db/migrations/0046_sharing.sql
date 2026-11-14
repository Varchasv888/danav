CREATE TABLE "shared_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(12) NOT NULL,
	"doc_id" uuid NOT NULL,
	"token_hash" char(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "auto_send_bill" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shared_documents" ADD CONSTRAINT "shared_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_documents" ADD CONSTRAINT "shared_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_documents" ADD CONSTRAINT "shared_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shared_documents_token" ON "shared_documents" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "shared_documents_doc" ON "shared_documents" USING btree ("doc_id");--> statement-breakpoint
ALTER TABLE shared_documents ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON shared_documents USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON shared_documents TO varchasv_app;--> statement-breakpoint
-- A shared bill, invoice or statement link is opened without signing in: this only says which business,
-- kind and document a live token belongs to; the document is then read inside that business's context.
CREATE OR REPLACE FUNCTION shared_document_by_token(p_hash text)
  RETURNS TABLE (tenant_id uuid, kind varchar, doc_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT d.tenant_id, d.kind, d.doc_id FROM shared_documents d
    JOIN tenants t ON t.id = d.tenant_id AND t.status = 'active'
    WHERE d.token_hash = p_hash AND d.expires_at > now()
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION shared_document_by_token(text) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION shared_document_by_token(text) TO varchasv_app;
