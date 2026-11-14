ALTER TABLE "sales_invoice_lines" ADD COLUMN "header_discount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_bills" DROP COLUMN "header_discount";