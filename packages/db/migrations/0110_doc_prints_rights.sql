CREATE TABLE "doc_prints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"doc_type" varchar(20) NOT NULL,
	"doc_id" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_by" uuid
);
--> statement-breakpoint
ALTER TABLE "doc_prints" ADD CONSTRAINT "doc_prints_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doc_prints" ADD CONSTRAINT "doc_prints_last_by_users_id_fk" FOREIGN KEY ("last_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "doc_prints_doc" ON "doc_prints" USING btree ("tenant_id","doc_type","doc_id");--> statement-breakpoint
ALTER TABLE doc_prints ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON doc_prints USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON doc_prints TO varchasv_app;--> statement-breakpoint
-- Print and reprint rights: everyone who could view a module keeps the right to print its documents, and everyone who could edit keeps the right to
-- reprint them, so nothing stops working. Owners can now take them away per role. The sale-rate right goes to every role that could create sales.
UPDATE roles SET permissions = ARRAY(SELECT DISTINCT p FROM unnest(permissions || ARRAY(
    SELECT split_part(p2, '.', 1) || '.print' FROM unnest(permissions) AS p2 WHERE p2 LIKE '%.view'
  ) || ARRAY(
    SELECT split_part(p3, '.', 1) || '.reprint' FROM unnest(permissions) AS p3 WHERE p3 LIKE '%.edit'
  ) || ARRAY(
    SELECT 'special.changeSaleRate' FROM unnest(permissions) AS p4 WHERE p4 = 'sales.create'
  )) AS p ORDER BY p);
