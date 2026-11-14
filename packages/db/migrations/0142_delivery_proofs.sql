CREATE TABLE "delivery_proof_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"proof_id" uuid NOT NULL,
	"note_line_id" uuid NOT NULL,
	"short_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"damaged_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_proofs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"received_on" date NOT NULL,
	"received_by" varchar(80) NOT NULL,
	"file_id" uuid,
	"note" varchar(300),
	"discrepancy" boolean DEFAULT false NOT NULL,
	"claim_owner_id" uuid,
	"claim_deadline" date,
	"claim_status" varchar(8) DEFAULT 'open' NOT NULL,
	"claim_note" varchar(300),
	"claim_closed_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_proof_id_delivery_proofs_id_fk" FOREIGN KEY ("proof_id") REFERENCES "public"."delivery_proofs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_note_line_id_delivery_note_lines_id_fk" FOREIGN KEY ("note_line_id") REFERENCES "public"."delivery_note_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_note_id_delivery_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."delivery_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_claim_owner_id_users_id_fk" FOREIGN KEY ("claim_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "delivery_proof_lines_proof" ON "delivery_proof_lines" USING btree ("proof_id");--> statement-breakpoint
CREATE INDEX "delivery_proof_lines_tenant_idx" ON "delivery_proof_lines" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_proofs_note" ON "delivery_proofs" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "delivery_proofs_claim" ON "delivery_proofs" USING btree ("company_id","claim_status","claim_deadline");
--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_claim_status_valid" CHECK (claim_status IN ('open', 'settled', 'waived'));
--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_qty_valid" CHECK (short_qty >= 0 AND damaged_qty >= 0);
--> statement-breakpoint
ALTER TABLE delivery_proofs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_proofs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_proofs TO varchasv_app;
--> statement-breakpoint
ALTER TABLE delivery_proof_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_proof_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_proof_lines TO varchasv_app;
