ALTER TABLE "salesman_commission_rules" ALTER COLUMN "kind" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "helper_id" uuid;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "helper_share_pct" numeric(5, 2) DEFAULT '30' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "helper_id" uuid;--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD COLUMN "band_from" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD COLUMN "band_to" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_helper_id_employees_id_fk" FOREIGN KEY ("helper_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_helper_id_employees_id_fk" FOREIGN KEY ("helper_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;