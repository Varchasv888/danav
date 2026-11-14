ALTER TABLE "expense_categories" ADD COLUMN "per_km_rate" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "expense_categories" ADD COLUMN "daily_allowance" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "expense_lines" ADD COLUMN "travel" jsonb;