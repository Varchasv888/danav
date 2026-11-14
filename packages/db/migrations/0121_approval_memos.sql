CREATE TABLE "approval_memo_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"memo_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 2) NOT NULL,
	"returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"billed_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_memos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(20) NOT NULL,
	"date" date NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"customer_name" varchar(80) NOT NULL,
	"customer_phone" varchar(10),
	"due_back" date,
	"note" varchar(200),
	"status" varchar(8) DEFAULT 'open' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "approval_memo_lines" ADD CONSTRAINT "approval_memo_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_memo_lines" ADD CONSTRAINT "approval_memo_lines_memo_id_approval_memos_id_fk" FOREIGN KEY ("memo_id") REFERENCES "public"."approval_memos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_memo_lines" ADD CONSTRAINT "approval_memo_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_memos" ADD CONSTRAINT "approval_memos_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_memos" ADD CONSTRAINT "approval_memos_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_memos" ADD CONSTRAINT "approval_memos_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approval_memos" ADD CONSTRAINT "approval_memos_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "approval_memo_lines_memo" ON "approval_memo_lines" USING btree ("memo_id");--> statement-breakpoint
CREATE UNIQUE INDEX "approval_memos_number" ON "approval_memos" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "approval_memos_status" ON "approval_memos" USING btree ("company_id","status");
--> statement-breakpoint
ALTER TABLE approval_memos ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON approval_memos USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON approval_memos TO varchasv_app;
--> statement-breakpoint
ALTER TABLE approval_memo_lines ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON approval_memo_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON approval_memo_lines TO varchasv_app;
