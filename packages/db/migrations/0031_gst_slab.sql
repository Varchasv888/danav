ALTER TABLE "items" ADD COLUMN "gst_slab" varchar(12);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "slab_pieces" integer DEFAULT 1 NOT NULL;