-- HR data for offline devices. Employees, leave types, leave requests and payroll runs log their own id.
CREATE TRIGGER sync_employees AFTER INSERT OR UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION record_sync_change('employee');
--> statement-breakpoint
CREATE TRIGGER sync_leave_types AFTER INSERT OR UPDATE ON leave_types FOR EACH ROW EXECUTE FUNCTION record_sync_change('leave_type');
--> statement-breakpoint
CREATE TRIGGER sync_leave_requests AFTER INSERT OR UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION record_sync_change('leave_request');
--> statement-breakpoint
CREATE TRIGGER sync_payroll_runs AFTER INSERT OR UPDATE ON payroll_runs FOR EACH ROW EXECUTE FUNCTION record_sync_change('payroll_run');
--> statement-breakpoint
-- Attendance changes (including a day set back to present, which deletes the row) are logged by
-- employee, and the device replaces that employee's recent days.
CREATE OR REPLACE FUNCTION record_attendance_change() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE r attendance%ROWTYPE;
BEGIN
  IF TG_OP = 'DELETE' THEN r := OLD; ELSE r := NEW; END IF;
  INSERT INTO sync_changes (tenant_id, entity, entity_id) VALUES (r.tenant_id, 'attendance', r.employee_id);
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE TRIGGER sync_attendance AFTER INSERT OR UPDATE OR DELETE ON attendance FOR EACH ROW EXECUTE FUNCTION record_attendance_change();
