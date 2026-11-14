CREATE TABLE "attendance_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"serial" varchar(40) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"last_seen_at" timestamp with time zone,
	"last_ip" varchar(45),
	"last_stamp" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance_punches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"device_id" uuid NOT NULL,
	"pin" varchar(24) NOT NULL,
	"punch_date" date NOT NULL,
	"punch_time" char(8) NOT NULL,
	"status" varchar(4),
	"verify" varchar(4),
	"employee_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "punch_pin" varchar(24);--> statement-breakpoint
ALTER TABLE "attendance_devices" ADD CONSTRAINT "attendance_devices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_punches" ADD CONSTRAINT "attendance_punches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_punches" ADD CONSTRAINT "attendance_punches_device_id_attendance_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."attendance_devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_punches" ADD CONSTRAINT "attendance_punches_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_devices_serial" ON "attendance_devices" USING btree (upper("serial"));--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_punches_once" ON "attendance_punches" USING btree ("device_id","pin","punch_date","punch_time");--> statement-breakpoint
CREATE INDEX "attendance_punches_day" ON "attendance_punches" USING btree ("tenant_id","punch_date");--> statement-breakpoint
ALTER TABLE attendance_devices ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON attendance_devices USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON attendance_devices TO varchasv_app;--> statement-breakpoint
ALTER TABLE attendance_punches ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON attendance_punches USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON attendance_punches TO varchasv_app;--> statement-breakpoint
-- The machine's request carries no login: its serial number says which business it belongs to. Returns nothing for an unknown or switched-off machine.
CREATE OR REPLACE FUNCTION attendance_device_by_serial(p_serial text)
  RETURNS TABLE (id uuid, tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT d.id, d.tenant_id FROM attendance_devices d JOIN tenants t ON t.id = d.tenant_id
    WHERE upper(d.serial) = upper(p_serial) AND d.active AND t.status = 'active'
  $$;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION attendance_device_by_serial(text) TO varchasv_app;
