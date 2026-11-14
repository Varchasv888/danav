ALTER TABLE "pos_settings" ADD COLUMN "loyalty_slabs" jsonb;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_min_redeem" integer DEFAULT 0 NOT NULL;