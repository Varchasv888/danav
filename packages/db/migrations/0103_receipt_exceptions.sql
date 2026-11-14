ALTER TABLE "goods_receipt_lines" ADD COLUMN "challan_qty" numeric(18, 4);--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "short_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "damaged_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "hold_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "quality_hold" boolean DEFAULT false NOT NULL;