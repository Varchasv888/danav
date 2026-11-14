-- A machine's serial is looked up whether or not it is switched on, so a serial cannot be registered twice; the caller decides what to do with a switched-off one.
DROP FUNCTION IF EXISTS attendance_device_by_serial(text);--> statement-breakpoint
CREATE OR REPLACE FUNCTION attendance_device_by_serial(p_serial text)
  RETURNS TABLE (id uuid, tenant_id uuid, active boolean)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT d.id, d.tenant_id, d.active FROM attendance_devices d JOIN tenants t ON t.id = d.tenant_id
    WHERE upper(d.serial) = upper(p_serial) AND t.status = 'active'
  $$;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION attendance_device_by_serial(text) TO varchasv_app;
