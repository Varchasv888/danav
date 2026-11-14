ALTER TABLE "goods_receipt_lines" ADD COLUMN "landed_cost_per_unit" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "landed_cost_note" varchar(160);
