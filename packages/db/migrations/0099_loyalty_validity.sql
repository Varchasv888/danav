CREATE TABLE "loyalty_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"bill_id" uuid,
	"earned" integer NOT NULL,
	"left" integer NOT NULL,
	"earned_on" date NOT NULL,
	"expires_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_validity_days" integer;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_discounted_bills" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_discounted_items" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_brands" text[];--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_categories" text[];--> statement-breakpoint
ALTER TABLE "loyalty_lots" ADD CONSTRAINT "loyalty_lots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_lots" ADD CONSTRAINT "loyalty_lots_member_id_loyalty_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."loyalty_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loyalty_lots_member" ON "loyalty_lots" USING btree ("member_id","expires_on");
--> statement-breakpoint
ALTER TABLE loyalty_lots ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON loyalty_lots USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON loyalty_lots TO varchasv_app;
