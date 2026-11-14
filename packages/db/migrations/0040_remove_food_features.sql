DROP TABLE "kots" CASCADE;--> statement-breakpoint
DROP TABLE "pos_orders" CASCADE;--> statement-breakpoint
DROP TABLE "pos_tables" CASCADE;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "recipe_on_sale";--> statement-breakpoint
ALTER TABLE "pos_bills" DROP COLUMN "order_id";--> statement-breakpoint
ALTER TABLE "pos_bills" DROP COLUMN "service_charge";--> statement-breakpoint
ALTER TABLE "pos_settings" DROP COLUMN "service_charge_pct";--> statement-breakpoint
ALTER TABLE "pos_settings" DROP COLUMN "service_charge_gst_rate";--> statement-breakpoint
ALTER TABLE "pos_settings" DROP COLUMN "restaurant";