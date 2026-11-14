ALTER TABLE items ADD COLUMN IF NOT EXISTS tile_brand text;
--> statement-breakpoint
ALTER TABLE items ADD COLUMN IF NOT EXISTS tile_finish text;
--> statement-breakpoint
ALTER TABLE tenants ALTER COLUMN industry SET DEFAULT 'tiles';
