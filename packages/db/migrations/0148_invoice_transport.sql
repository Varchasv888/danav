ALTER TABLE "sales_invoices" ADD COLUMN "transporter" varchar(80);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "lr_number" varchar(30);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "lr_date" date;