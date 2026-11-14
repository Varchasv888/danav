CREATE TABLE "repair_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"received_on" date NOT NULL,
	"customer_name" varchar(80) NOT NULL,
	"customer_phone" varchar(10),
	"item_description" text NOT NULL,
	"complaint" text,
	"diagnosis" text,
	"warranty" boolean DEFAULT false NOT NULL,
	"estimate" numeric(18, 2),
	"deposit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"spares" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"final_charge" numeric(18, 2),
	"status" varchar(12) DEFAULT 'received' NOT NULL,
	"promised_on" date,
	"delivered_on" date,
	"reason" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "repair_jobs_number" ON "repair_jobs" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "repair_jobs_status" ON "repair_jobs" USING btree ("company_id","status");--> statement-breakpoint
ALTER TABLE repair_jobs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON repair_jobs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON repair_jobs TO varchasv_app;
