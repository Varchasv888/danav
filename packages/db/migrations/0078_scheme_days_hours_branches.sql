ALTER TABLE "schemes" ADD COLUMN "weekdays" jsonb;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "from_time" char(5);--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "to_time" char(5);--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "branch_ids" jsonb;