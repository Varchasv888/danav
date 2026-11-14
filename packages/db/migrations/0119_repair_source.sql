ALTER TABLE "repair_jobs" ADD COLUMN "source_kind" varchar(8);--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "source_id" uuid;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "source_number" varchar(30);