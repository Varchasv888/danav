CREATE TABLE "colors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" varchar(8) NOT NULL,
	"hex" varchar(7),
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_pack_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"pack_item_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "size_scales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sizes" text[] NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"brand" text,
	"category" text,
	"season" text,
	"collection" text,
	"hsn" varchar(8),
	"gst_rate" numeric(5, 2) DEFAULT '5' NOT NULL,
	"gst_slab" varchar(12),
	"uom_id" uuid NOT NULL,
	"purchase_rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"sale_rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"mrp" numeric(18, 2),
	"size_scale_id" uuid,
	"fits" text[],
	"image_file_id" uuid,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "style_id" uuid;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "color" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "size" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "fit" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "size_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "is_pack" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "colors" ADD CONSTRAINT "colors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colors" ADD CONSTRAINT "colors_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_pack_lines" ADD CONSTRAINT "item_pack_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_pack_lines" ADD CONSTRAINT "item_pack_lines_pack_item_id_items_id_fk" FOREIGN KEY ("pack_item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_pack_lines" ADD CONSTRAINT "item_pack_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "size_scales" ADD CONSTRAINT "size_scales_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "size_scales" ADD CONSTRAINT "size_scales_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_uom_id_uoms_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "styles" ADD CONSTRAINT "styles_size_scale_id_size_scales_id_fk" FOREIGN KEY ("size_scale_id") REFERENCES "public"."size_scales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "colors_company_name" ON "colors" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "colors_company_code" ON "colors" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "item_pack_lines_pack" ON "item_pack_lines" USING btree ("pack_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "size_scales_company_name" ON "size_scales" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "styles_company_code" ON "styles" USING btree ("company_id",lower("code"));--> statement-breakpoint
CREATE INDEX "styles_company_name" ON "styles" USING btree ("company_id","name");--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_style_id_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."styles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "items_style" ON "items" USING btree ("style_id");--> statement-breakpoint
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['size_scales','colors','styles','item_pack_lines'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
