ALTER TABLE "schemes" ADD COLUMN "confirm_before_apply" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "allow_with_gift_vouchers" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "allow_with_customer_discount" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "allow_returns" boolean DEFAULT true NOT NULL;