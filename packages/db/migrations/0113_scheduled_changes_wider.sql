ALTER TABLE "scheduled_changes" ALTER COLUMN "entity" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "scheduled_changes" ALTER COLUMN "value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "scheduled_changes" ALTER COLUMN "previous" SET DATA TYPE text;