ALTER TABLE "repair_jobs" ADD COLUMN "deposit_voucher_id" uuid;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "settle_voucher_id" uuid;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_deposit_voucher_id_vouchers_id_fk" FOREIGN KEY ("deposit_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_settle_voucher_id_vouchers_id_fk" FOREIGN KEY ("settle_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;