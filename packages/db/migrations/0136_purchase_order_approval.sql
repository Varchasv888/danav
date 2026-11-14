ALTER TABLE "companies" ADD COLUMN "purchase_approval_limit" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approval_status" varchar(10) DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approval_note" varchar(200);--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;