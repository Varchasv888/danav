CREATE TABLE "pos_held_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"terminal_id" uuid NOT NULL,
	"label" varchar(60),
	"customer_phone" varchar(10),
	"customer_name" varchar(80),
	"lines" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD COLUMN "overrides" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "allow_rate_change" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "max_line_discount_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "max_bill_discount_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "require_salesman" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pos_held_bills_terminal" ON "pos_held_bills" USING btree ("terminal_id","created_at");--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE pos_held_bills ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON pos_held_bills USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_held_bills TO varchasv_app;
