ALTER TABLE "projects" ALTER COLUMN "billing" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "billing" SET DEFAULT 'fixed';