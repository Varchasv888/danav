CREATE TABLE "catalogue_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"party_id" uuid,
	"lines" jsonb NOT NULL,
	"show_prices" boolean DEFAULT true NOT NULL,
	"show_stock" boolean DEFAULT false NOT NULL,
	"share_token_hash" char(64),
	"share_expires_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "style_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"style_id" uuid NOT NULL,
	"color" text,
	"view" varchar(10) DEFAULT 'front' NOT NULL,
	"file_id" uuid NOT NULL,
	"thumb_file_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalogue_selections" ADD CONSTRAINT "catalogue_selections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogue_selections" ADD CONSTRAINT "catalogue_selections_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogue_selections" ADD CONSTRAINT "catalogue_selections_party_id_accounts_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalogue_selections" ADD CONSTRAINT "catalogue_selections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_images" ADD CONSTRAINT "style_images_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_images" ADD CONSTRAINT "style_images_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_images" ADD CONSTRAINT "style_images_style_id_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_images" ADD CONSTRAINT "style_images_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_images" ADD CONSTRAINT "style_images_thumb_file_id_files_id_fk" FOREIGN KEY ("thumb_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_images" ADD CONSTRAINT "style_images_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "catalogue_selections_token" ON "catalogue_selections" USING btree ("share_token_hash");--> statement-breakpoint
CREATE INDEX "catalogue_selections_company" ON "catalogue_selections" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "style_images_style" ON "style_images" USING btree ("style_id","color");--> statement-breakpoint
ALTER TABLE style_images ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON style_images USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON style_images TO varchasv_app;--> statement-breakpoint
ALTER TABLE catalogue_selections ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON catalogue_selections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON catalogue_selections TO varchasv_app;--> statement-breakpoint
-- A shared catalogue link is opened without signing in: this only says which business and selection a
-- live token belongs to; everything else is read inside that business's own tenant context.
CREATE OR REPLACE FUNCTION catalogue_share_by_token(p_hash text)
  RETURNS TABLE (tenant_id uuid, selection_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT s.tenant_id, s.id FROM catalogue_selections s
    JOIN tenants t ON t.id = s.tenant_id AND t.status = 'active'
    WHERE s.share_token_hash = p_hash AND s.share_expires_at > now()
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION catalogue_share_by_token(text) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION catalogue_share_by_token(text) TO varchasv_app;
