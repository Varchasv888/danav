CREATE TABLE "pos_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"terminal_id" uuid NOT NULL,
	"session_id" uuid,
	"bill_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"lines" jsonb NOT NULL,
	"taxable" numeric(18, 2) NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"refund_mode" varchar(8) NOT NULL,
	"gift_voucher_id" uuid,
	"voucher_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_session_id_pos_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."pos_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_bill_id_pos_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_gift_voucher_id_gift_vouchers_id_fk" FOREIGN KEY ("gift_voucher_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_returns" ADD CONSTRAINT "pos_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "pos_returns_number" ON "pos_returns" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "pos_returns_date" ON "pos_returns" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "pos_returns_bill" ON "pos_returns" USING btree ("bill_id");--> statement-breakpoint
ALTER TABLE pos_returns ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON pos_returns USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_returns TO varchasv_app;
