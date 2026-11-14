ALTER TABLE "pos_bill_lines" ADD COLUMN "commission_adj" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "apply_on_discounted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "inclusive_of_tax" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "commission_basis" varchar(4) DEFAULT 'net' NOT NULL;