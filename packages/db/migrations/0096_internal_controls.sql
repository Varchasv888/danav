CREATE TABLE "access_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"started_by" uuid,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"members" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "related_party" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "step_up_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "access_reviews" ADD CONSTRAINT "access_reviews_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_reviews" ADD CONSTRAINT "access_reviews_started_by_users_id_fk" FOREIGN KEY ("started_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE access_reviews ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON access_reviews USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON access_reviews TO varchasv_app;
