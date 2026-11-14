DROP INDEX "packing_box_events_box_created";--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD COLUMN "sequence" integer;--> statement-breakpoint
DROP TRIGGER "packing_box_events_immutable" ON "packing_box_events";--> statement-breakpoint
WITH ranked_events AS (
  SELECT "id", row_number() OVER (PARTITION BY "box_id" ORDER BY "created_at", "id")::integer AS "sequence"
  FROM "packing_box_events"
)
UPDATE "packing_box_events" AS events SET "sequence" = ranked_events."sequence"
FROM ranked_events WHERE events."id" = ranked_events."id";--> statement-breakpoint
ALTER TABLE "packing_box_events" ALTER COLUMN "sequence" SET NOT NULL;--> statement-breakpoint
CREATE TRIGGER "packing_box_events_immutable" BEFORE UPDATE OR DELETE ON "packing_box_events"
  FOR EACH ROW EXECUTE FUNCTION packing_box_events_immutable();--> statement-breakpoint
CREATE UNIQUE INDEX "packing_box_events_box_sequence" ON "packing_box_events" USING btree ("box_id","sequence");
