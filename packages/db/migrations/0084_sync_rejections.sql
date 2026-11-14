CREATE TABLE "sync_rejections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"device_id" uuid NOT NULL,
	"op_id" varchar(64) NOT NULL,
	"kind" varchar(40),
	"error" varchar(60) NOT NULL,
	"payload" jsonb,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"note" varchar(200),
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sync_rejections" ADD CONSTRAINT "sync_rejections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_rejections" ADD CONSTRAINT "sync_rejections_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_rejections" ADD CONSTRAINT "sync_rejections_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sync_rejections_once" ON "sync_rejections" USING btree ("device_id","op_id");--> statement-breakpoint
CREATE INDEX "sync_rejections_open" ON "sync_rejections" USING btree ("tenant_id","status");--> statement-breakpoint
ALTER TABLE sync_rejections ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON sync_rejections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON sync_rejections TO varchasv_app;
