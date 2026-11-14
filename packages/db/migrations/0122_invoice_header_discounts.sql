ALTER TABLE "pos_bills" ADD COLUMN "header_discount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "header_discounts" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "early_pay_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "early_pay_days" integer;