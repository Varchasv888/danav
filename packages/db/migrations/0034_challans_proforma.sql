CREATE TABLE "delivery_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"date" date NOT NULL,
	"lines" jsonb NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "rate" numeric(18, 4);--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "gst_rate" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "taxable" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "reason" varchar(12) DEFAULT 'supply' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "place_of_supply" char(2);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "supply_kind" varchar(8);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "transporter" varchar(80);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "vehicle_no" varchar(16);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "taxable" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "cgst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "sgst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "utgst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "igst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "cess" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "total" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotations" ADD COLUMN "kind" varchar(10) DEFAULT 'quotation' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotations" ADD COLUMN "advance_due" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "delivery_returns" ADD CONSTRAINT "delivery_returns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_returns" ADD CONSTRAINT "delivery_returns_note_id_delivery_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."delivery_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_returns" ADD CONSTRAINT "delivery_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE delivery_returns ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_returns USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_returns TO varchasv_app;
