CREATE TABLE "audit_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"action" varchar(40) NOT NULL,
	"entity" varchar(40) NOT NULL,
	"entity_id" text,
	"before" jsonb,
	"after" jsonb,
	"ip" "inet",
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"gstin" char(15),
	"state_code" char(2) NOT NULL,
	"address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_head_office" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"legal_name" text,
	"pan" char(10),
	"base_currency" char(3) DEFAULT 'INR' NOT NULL,
	"books_begin_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"platform" varchar(20) NOT NULL,
	"last_seen_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fiscal_years" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"label" varchar(7) NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"locked_up_to" date,
	"closed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "number_series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"fiscal_year_id" uuid NOT NULL,
	"device_id" uuid,
	"doc_type" varchar(30) NOT NULL,
	"name" text NOT NULL,
	"pattern" varchar(40) NOT NULL,
	"next_seq" integer DEFAULT 1 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" varchar(40) NOT NULL,
	"name" text NOT NULL,
	"permissions" text[] DEFAULT '{}'::text[] NOT NULL,
	"system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token_hash" char(64) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid,
	"user_agent" text,
	"ip" "inet",
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"plan" varchar(20) DEFAULT 'free' NOT NULL,
	"industry" varchar(30) DEFAULT 'general' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone" varchar(15),
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"locale" varchar(5) DEFAULT 'en' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fiscal_years" ADD CONSTRAINT "fiscal_years_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fiscal_years" ADD CONSTRAINT "fiscal_years_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_series" ADD CONSTRAINT "number_series_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_series" ADD CONSTRAINT "number_series_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_series" ADD CONSTRAINT "number_series_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_series" ADD CONSTRAINT "number_series_fiscal_year_id_fiscal_years_id_fk" FOREIGN KEY ("fiscal_year_id") REFERENCES "public"."fiscal_years"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_series" ADD CONSTRAINT "number_series_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_tenant_at" ON "audit_log" USING btree ("tenant_id","at");--> statement-breakpoint
CREATE INDEX "branches_company_idx" ON "branches" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "branches_tenant_gstin" ON "branches" USING btree ("tenant_id","gstin");--> statement-breakpoint
CREATE INDEX "companies_tenant_idx" ON "companies" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "devices_tenant_code" ON "devices" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "fiscal_years_company_label" ON "fiscal_years" USING btree ("company_id","label");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_tenant_user" ON "memberships" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "number_series_lookup" ON "number_series" USING btree ("company_id","doc_type","fiscal_year_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_tenant_key" ON "roles" USING btree ("tenant_id","key");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree (lower("email"));


-- Row-level security: every tenant-owned row is visible only when app.tenant_id matches.
-- The application connects as varchasv_app (no BYPASSRLS, not the table owner), so these
-- policies apply to every query it runs. Migrations run as the owner.

CREATE OR REPLACE FUNCTION app_tenant() RETURNS uuid
  LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.tenant_id', true), '')::uuid $$;
--> statement-breakpoint
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['roles','memberships','companies','branches','fiscal_years','devices','number_series','audit_log'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
  END LOOP;
END $$;
--> statement-breakpoint
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_self ON tenants USING (id = app_tenant()) WITH CHECK (id = app_tenant());
--> statement-breakpoint

-- Before a tenant is chosen (at login) the app needs the list of tenants a user belongs to.
CREATE OR REPLACE FUNCTION user_tenants(p_user uuid)
  RETURNS TABLE (tenant_id uuid, tenant_name text, role_key text)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT m.tenant_id, t.name, r.key
    FROM memberships m
    JOIN tenants t ON t.id = m.tenant_id
    JOIN roles r ON r.id = m.role_id
    WHERE m.user_id = p_user AND m.status = 'active' AND t.status = 'active'
    ORDER BY t.created_at
  $$;
--> statement-breakpoint

-- The audit trail is append-only (Companies Act audit-trail rule): no updates or deletes, by anyone.
CREATE OR REPLACE FUNCTION audit_log_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END $$;
--> statement-breakpoint
CREATE TRIGGER audit_log_no_change BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_immutable();
--> statement-breakpoint

GRANT USAGE ON SCHEMA public TO varchasv_app;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO varchasv_app;
--> statement-breakpoint
REVOKE UPDATE, DELETE, TRUNCATE ON audit_log FROM varchasv_app;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION app_tenant(), user_tenants(uuid) TO varchasv_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO varchasv_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO varchasv_app;



CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role_id" uuid NOT NULL,
	"token_hash" char(64) NOT NULL,
	"invited_by" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "invitations_tenant_idx" ON "invitations" USING btree ("tenant_id");


ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON invitations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint

-- Looks up an open invitation by token hash before the invitee has a tenant context.
-- Returns nothing for expired, revoked or already-accepted invitations.
CREATE OR REPLACE FUNCTION invitation_by_token(p_hash text)
  RETURNS TABLE (id uuid, tenant_id uuid, tenant_name text, email text, role_id uuid, role_name text)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT i.id, i.tenant_id, t.name, i.email, i.role_id, r.name
    FROM invitations i
    JOIN tenants t ON t.id = i.tenant_id
    JOIN roles r ON r.id = i.role_id
    WHERE i.token_hash = p_hash
      AND i.accepted_at IS NULL AND i.revoked_at IS NULL AND i.expires_at > now()
      AND t.status = 'active'
  $$;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION invitation_by_token(text) TO varchasv_app;



CREATE TABLE "account_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"parent_id" uuid,
	"key" varchar(40),
	"name" text NOT NULL,
	"name_hi" text,
	"nature" varchar(10) NOT NULL,
	"pl" varchar(10),
	"system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"key" varchar(40),
	"name" text NOT NULL,
	"name_hi" text,
	"code" varchar(20),
	"opening_balance" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gstin" char(15),
	"state_code" char(2),
	"pan" char(10),
	"phone" varchar(15),
	"email" text,
	"bank" jsonb,
	"archived" boolean DEFAULT false NOT NULL,
	"system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gl_entries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"voucher_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"date" date NOT NULL,
	"debit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"credit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"is_reversal" boolean DEFAULT false NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voucher_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"voucher_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"account_id" uuid NOT NULL,
	"debit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"credit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"narration" text
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"fiscal_year_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"narration" text,
	"reference" varchar(60),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"client_id" uuid,
	"device_id" uuid,
	"created_by" uuid,
	"cancelled_by" uuid,
	"cancelled_at" timestamp with time zone,
	"cancel_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_groups" ADD CONSTRAINT "account_groups_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_groups" ADD CONSTRAINT "account_groups_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_group_id_account_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."account_groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gl_entries" ADD CONSTRAINT "gl_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gl_entries" ADD CONSTRAINT "gl_entries_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gl_entries" ADD CONSTRAINT "gl_entries_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gl_entries" ADD CONSTRAINT "gl_entries_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_lines" ADD CONSTRAINT "voucher_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_lines" ADD CONSTRAINT "voucher_lines_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_lines" ADD CONSTRAINT "voucher_lines_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_fiscal_year_id_fiscal_years_id_fk" FOREIGN KEY ("fiscal_year_id") REFERENCES "public"."fiscal_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_cancelled_by_users_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_groups_company_key" ON "account_groups" USING btree ("company_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "account_groups_company_name" ON "account_groups" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_company_key" ON "accounts" USING btree ("company_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_company_name" ON "accounts" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE INDEX "accounts_group_idx" ON "accounts" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "gl_entries_account_date" ON "gl_entries" USING btree ("account_id","date");--> statement-breakpoint
CREATE INDEX "gl_entries_company_date" ON "gl_entries" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "gl_entries_voucher_idx" ON "gl_entries" USING btree ("voucher_id");--> statement-breakpoint
CREATE INDEX "voucher_lines_voucher_idx" ON "voucher_lines" USING btree ("voucher_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vouchers_number_key" ON "vouchers" USING btree ("company_id","fiscal_year_id","type","number");--> statement-breakpoint
CREATE UNIQUE INDEX "vouchers_client_key" ON "vouchers" USING btree ("tenant_id","client_id");--> statement-breakpoint
CREATE INDEX "vouchers_company_date" ON "vouchers" USING btree ("company_id","date");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['account_groups','accounts','vouchers','voucher_lines','gl_entries'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
  END LOOP;
END $$;
--> statement-breakpoint

-- Posted ledger entries are never changed or deleted; corrections are reversing entries.
CREATE OR REPLACE FUNCTION gl_entries_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'gl_entries is append-only; post a reversal instead';
END $$;
--> statement-breakpoint
CREATE TRIGGER gl_entries_no_change BEFORE UPDATE OR DELETE ON gl_entries
  FOR EACH ROW EXECUTE FUNCTION gl_entries_immutable();
--> statement-breakpoint
REVOKE UPDATE, DELETE, TRUNCATE ON gl_entries FROM varchasv_app;
--> statement-breakpoint

-- Every voucher's ledger rows must balance. Checked at commit, after all rows of the voucher exist.
CREATE OR REPLACE FUNCTION gl_voucher_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE diff numeric;
BEGIN
  SELECT coalesce(sum(debit), 0) - coalesce(sum(credit), 0) INTO diff FROM gl_entries WHERE voucher_id = NEW.voucher_id;
  IF diff <> 0 THEN
    RAISE EXCEPTION 'ledger entries for voucher % do not balance (difference %)', NEW.voucher_id, diff;
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER gl_entries_balanced AFTER INSERT ON gl_entries
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION gl_voucher_balanced();
--> statement-breakpoint
ALTER TABLE voucher_lines ADD CONSTRAINT voucher_lines_one_side CHECK ((debit >= 0 AND credit >= 0) AND (debit = 0 OR credit = 0) AND (debit > 0 OR credit > 0));
--> statement-breakpoint
ALTER TABLE gl_entries ADD CONSTRAINT gl_entries_one_side CHECK ((debit >= 0 AND credit >= 0) AND (debit = 0 OR credit = 0));
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON account_groups, accounts, vouchers, voucher_lines TO varchasv_app;
--> statement-breakpoint
GRANT SELECT, INSERT ON gl_entries TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE gl_entries_id_seq TO varchasv_app;



-- Change log for offline devices. Every insert/update of a synced table records (entity, id, txid).
-- Devices pull with a transaction-id cursor: the server only hands out changes from transactions
-- older than the oldest still-running one (pg_snapshot_xmin), so a slow commit is never skipped.
CREATE TABLE sync_changes (
  seq bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity varchar(30) NOT NULL,
  entity_id uuid NOT NULL,
  txid xid8 NOT NULL DEFAULT pg_current_xact_id(),
  at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX sync_changes_tenant_txid ON sync_changes (tenant_id, txid);
--> statement-breakpoint
ALTER TABLE sync_changes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON sync_changes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT ON sync_changes TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE sync_changes_seq_seq TO varchasv_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION record_sync_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO sync_changes (tenant_id, entity, entity_id) VALUES (NEW.tenant_id, TG_ARGV[0], NEW.id);
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE TRIGGER sync_companies AFTER INSERT OR UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION record_sync_change('company');
--> statement-breakpoint
CREATE TRIGGER sync_branches AFTER INSERT OR UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION record_sync_change('branch');
--> statement-breakpoint
CREATE TRIGGER sync_fiscal_years AFTER INSERT OR UPDATE ON fiscal_years FOR EACH ROW EXECUTE FUNCTION record_sync_change('fiscal_year');
--> statement-breakpoint
CREATE TRIGGER sync_account_groups AFTER INSERT OR UPDATE ON account_groups FOR EACH ROW EXECUTE FUNCTION record_sync_change('account_group');
--> statement-breakpoint
CREATE TRIGGER sync_accounts AFTER INSERT OR UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION record_sync_change('account');
--> statement-breakpoint
CREATE TRIGGER sync_vouchers AFTER INSERT OR UPDATE ON vouchers FOR EACH ROW EXECUTE FUNCTION record_sync_change('voucher');
--> statement-breakpoint
-- The oldest transaction still running; changes from transactions below it are final.
CREATE OR REPLACE FUNCTION sync_horizon() RETURNS xid8 LANGUAGE sql STABLE AS $$ SELECT pg_snapshot_xmin(pg_current_snapshot()) $$;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION sync_horizon() TO varchasv_app;



CREATE TABLE "goods_receipt_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"receipt_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"order_line_id" uuid,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"batch_no" varchar(40),
	"expiry" date,
	"billed_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"order_id" uuid,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"supplier_challan" varchar(40),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"sku" varchar(40),
	"barcode" varchar(40),
	"kind" varchar(10) DEFAULT 'goods' NOT NULL,
	"hsn" varchar(8),
	"gst_rate" numeric(5, 2) DEFAULT '18' NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"uom_id" uuid NOT NULL,
	"purchase_rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"sale_rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"mrp" numeric(18, 2),
	"reorder_level" numeric(18, 4),
	"reorder_qty" numeric(18, 4),
	"track_batches" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_bill_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"bill_id" uuid NOT NULL,
	"order_line_id" uuid,
	"receipt_line_id" uuid,
	"warehouse_id" uuid,
	"batch_no" varchar(40),
	"expiry" date,
	"returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"order_id" uuid,
	"voucher_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"supplier_invoice_no" varchar(16) NOT NULL,
	"supplier_invoice_date" date NOT NULL,
	"due_on" date,
	"supply_kind" varchar(8) NOT NULL,
	"reverse_charge" boolean DEFAULT false NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"order_id" uuid NOT NULL,
	"received_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"billed_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"expected_on" date,
	"status" varchar(12) DEFAULT 'open' NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"narration" text,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_return_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"return_id" uuid NOT NULL,
	"bill_line_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"bill_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"voucher_id" uuid,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"reason" text NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_journal_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"journal_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"to_warehouse_id" uuid,
	"qty_in" numeric(18, 4) DEFAULT '0' NOT NULL,
	"qty_out" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"batch_no" varchar(40),
	"expiry" date
);
--> statement-breakpoint
CREATE TABLE "stock_journals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"kind" varchar(12) NOT NULL,
	"narration" text,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_ledger" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"date" date NOT NULL,
	"qty_in" numeric(18, 4) DEFAULT '0' NOT NULL,
	"qty_out" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rate" numeric(18, 4) DEFAULT '0' NOT NULL,
	"batch_no" varchar(40),
	"expiry" date,
	"source_type" varchar(20) NOT NULL,
	"source_id" uuid NOT NULL,
	"is_reversal" boolean DEFAULT false NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uoms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"decimals" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"name" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "valuation_method" varchar(8) DEFAULT 'average' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_order_line_id_purchase_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."purchase_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_order_id_purchase_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_uom_id_uoms_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_order_line_id_purchase_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."purchase_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_receipt_line_id_goods_receipt_lines_id_fk" FOREIGN KEY ("receipt_line_id") REFERENCES "public"."goods_receipt_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bill_lines" ADD CONSTRAINT "purchase_bill_lines_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_order_id_purchase_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD CONSTRAINT "purchase_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_order_id_purchase_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_return_id_purchase_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "public"."purchase_returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_return_lines" ADD CONSTRAINT "purchase_return_lines_bill_line_id_purchase_bill_lines_id_fk" FOREIGN KEY ("bill_line_id") REFERENCES "public"."purchase_bill_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_journal_id_stock_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journal_lines" ADD CONSTRAINT "stock_journal_lines_to_warehouse_id_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_ledger" ADD CONSTRAINT "stock_ledger_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uoms" ADD CONSTRAINT "uoms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uoms" ADD CONSTRAINT "uoms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "goods_receipts_number" ON "goods_receipts" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "items_company_name" ON "items" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "items_company_sku" ON "items" USING btree ("company_id","sku");--> statement-breakpoint
CREATE INDEX "items_company_barcode" ON "items" USING btree ("company_id","barcode");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_bills_number" ON "purchase_bills" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_bills_supplier_invoice" ON "purchase_bills" USING btree ("company_id","supplier_id","supplier_invoice_no","supplier_invoice_date");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_orders_number" ON "purchase_orders" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_returns_number" ON "purchase_returns" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_journals_number" ON "stock_journals" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "stock_ledger_item_wh_date" ON "stock_ledger" USING btree ("item_id","warehouse_id","date","id");--> statement-breakpoint
CREATE INDEX "stock_ledger_company_date" ON "stock_ledger" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "stock_ledger_source" ON "stock_ledger" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uoms_company_code" ON "uoms" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "warehouses_company_name" ON "warehouses" USING btree ("company_id",lower("name"));


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['uoms','warehouses','items','stock_ledger','stock_journals','stock_journal_lines',
    'purchase_orders','purchase_order_lines','goods_receipts','goods_receipt_lines',
    'purchase_bills','purchase_bill_lines','purchase_returns','purchase_return_lines'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- The stock ledger is append-only, like the general ledger.
CREATE OR REPLACE FUNCTION stock_ledger_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'stock_ledger is append-only; post a reversal instead';
END $$;
--> statement-breakpoint
CREATE TRIGGER stock_ledger_no_change BEFORE UPDATE OR DELETE ON stock_ledger
  FOR EACH ROW EXECUTE FUNCTION stock_ledger_immutable();
--> statement-breakpoint
ALTER TABLE stock_ledger ADD CONSTRAINT stock_ledger_one_side CHECK (qty_in >= 0 AND qty_out >= 0 AND (qty_in = 0 OR qty_out = 0) AND (qty_in > 0 OR qty_out > 0) AND rate >= 0);
--> statement-breakpoint
ALTER TABLE companies ADD CONSTRAINT companies_valuation_method CHECK (valuation_method IN ('average', 'fifo'));
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON uoms, warehouses, items, stock_journals, stock_journal_lines,
  purchase_orders, purchase_order_lines, goods_receipts, goods_receipt_lines,
  purchase_bills, purchase_bill_lines, purchase_returns, purchase_return_lines TO varchasv_app;
--> statement-breakpoint
GRANT SELECT, INSERT ON stock_ledger TO varchasv_app;
--> statement-breakpoint
GRANT USAGE, SELECT ON SEQUENCE stock_ledger_id_seq TO varchasv_app;
--> statement-breakpoint
CREATE TRIGGER sync_items AFTER INSERT OR UPDATE ON items FOR EACH ROW EXECUTE FUNCTION record_sync_change('item');
--> statement-breakpoint
CREATE TRIGGER sync_warehouses AFTER INSERT OR UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION record_sync_change('warehouse');



CREATE TABLE "credit_note_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"note_id" uuid NOT NULL,
	"invoice_line_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"voucher_id" uuid,
	"warehouse_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"reason" text NOT NULL,
	"goods_returned" boolean DEFAULT true NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"place_of_supply" char(2) NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"einvoice_status" varchar(16) DEFAULT 'not_required' NOT NULL,
	"irn" char(64),
	"ack_no" varchar(20),
	"ack_date" timestamp with time zone,
	"signed_qr" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_note_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"order_line_id" uuid,
	"qty" numeric(18, 4) NOT NULL,
	"batch_no" varchar(40),
	"invoiced_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"order_id" uuid,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gst_settings" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"einvoice_enabled" boolean DEFAULT false NOT NULL,
	"eway_bill_threshold" numeric(18, 2) DEFAULT '50000' NOT NULL,
	"bilingual_print" boolean DEFAULT true NOT NULL,
	"invoice_terms" text,
	"bank_details" text
);
--> statement-breakpoint
CREATE TABLE "sales_invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"warehouse_id" uuid,
	"batch_no" varchar(40),
	"invoice_id" uuid NOT NULL,
	"order_line_id" uuid,
	"delivery_line_id" uuid,
	"returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"order_id" uuid,
	"voucher_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"due_on" date,
	"customer_name" text NOT NULL,
	"customer_gstin" char(15),
	"billing_address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"shipping_address" jsonb,
	"place_of_supply" char(2) NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"lut" boolean DEFAULT false NOT NULL,
	"reverse_charge" boolean DEFAULT false NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"einvoice_status" varchar(16) DEFAULT 'not_required' NOT NULL,
	"irn" char(64),
	"ack_no" varchar(20),
	"ack_date" timestamp with time zone,
	"signed_qr" text,
	"einvoice_error" text,
	"ewb_no" varchar(12),
	"ewb_date" timestamp with time zone,
	"ewb_valid_upto" timestamp with time zone,
	"vehicle_no" varchar(15),
	"transport_distance_km" integer,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"order_id" uuid NOT NULL,
	"delivered_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"invoiced_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"deliver_by" date,
	"place_of_supply" char(2) NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"status" varchar(12) DEFAULT 'open' NOT NULL,
	"customer_reference" varchar(40),
	"narration" text,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "address" jsonb;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "credit_limit" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "credit_days" integer;--> statement-breakpoint
ALTER TABLE "credit_note_lines" ADD CONSTRAINT "credit_note_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_note_lines" ADD CONSTRAINT "credit_note_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_note_lines" ADD CONSTRAINT "credit_note_lines_note_id_credit_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."credit_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_note_lines" ADD CONSTRAINT "credit_note_lines_invoice_line_id_sales_invoice_lines_id_fk" FOREIGN KEY ("invoice_line_id") REFERENCES "public"."sales_invoice_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD CONSTRAINT "delivery_note_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD CONSTRAINT "delivery_note_lines_note_id_delivery_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."delivery_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD CONSTRAINT "delivery_note_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD CONSTRAINT "delivery_note_lines_order_line_id_sales_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."sales_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_settings" ADD CONSTRAINT "gst_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_settings" ADD CONSTRAINT "gst_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_order_line_id_sales_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."sales_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ADD CONSTRAINT "sales_invoice_lines_delivery_line_id_delivery_note_lines_id_fk" FOREIGN KEY ("delivery_line_id") REFERENCES "public"."delivery_note_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_lines" ADD CONSTRAINT "sales_order_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_lines" ADD CONSTRAINT "sales_order_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_lines" ADD CONSTRAINT "sales_order_lines_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "credit_notes_number" ON "credit_notes" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_notes_number" ON "delivery_notes" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_invoices_number" ON "sales_invoices" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "sales_invoices_company_date" ON "sales_invoices" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "sales_invoices_customer" ON "sales_invoices" USING btree ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_orders_number" ON "sales_orders" USING btree ("company_id","number");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['sales_orders','sales_order_lines','delivery_notes','delivery_note_lines','sales_invoices',
    'sales_invoice_lines','credit_notes','credit_note_lines','gst_settings'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- The IRN is unique across the whole system (the IRP never issues the same one twice).
CREATE UNIQUE INDEX sales_invoices_irn ON sales_invoices (irn) WHERE irn IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX credit_notes_irn ON credit_notes (irn) WHERE irn IS NOT NULL;



-- The IRP itself guarantees an IRN is never issued twice. Ours only needs to stop the same business
-- storing one twice; making it global would wrongly clash if a GSTIN is ever used in two businesses.
DROP INDEX IF EXISTS sales_invoices_irn;
--> statement-breakpoint
DROP INDEX IF EXISTS credit_notes_irn;
--> statement-breakpoint
CREATE UNIQUE INDEX sales_invoices_irn ON sales_invoices (tenant_id, irn) WHERE irn IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX credit_notes_irn ON credit_notes (tenant_id, irn) WHERE irn IS NOT NULL;



CREATE TABLE "gst_filings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"gstin" char(15) NOT NULL,
	"return_type" varchar(8) NOT NULL,
	"period" char(6) NOT NULL,
	"status" varchar(10) NOT NULL,
	"payload_hash" char(64) NOT NULL,
	"summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"reference_id" varchar(40),
	"arn" varchar(20),
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"filed_at" timestamp with time zone,
	"filed_by" uuid,
	"provider" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gst_sessions" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"gstin" char(15) NOT NULL,
	"username" varchar(60) NOT NULL,
	"token_enc" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE "quotation_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"description" text,
	"qty" numeric(18, 4) NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"quotation_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"valid_until" date NOT NULL,
	"place_of_supply" char(2) NOT NULL,
	"supply_kind" varchar(8) NOT NULL,
	"lut" boolean DEFAULT false NOT NULL,
	"status" varchar(12) DEFAULT 'open' NOT NULL,
	"customer_reference" varchar(40),
	"narration" text,
	"terms" text,
	"taxable" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"utgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) DEFAULT '0' NOT NULL,
	"converted_kind" varchar(8),
	"converted_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "quotation_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "ewb_status" varchar(10) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "quotation_id" uuid;--> statement-breakpoint
ALTER TABLE "gst_filings" ADD CONSTRAINT "gst_filings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_filings" ADD CONSTRAINT "gst_filings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_filings" ADD CONSTRAINT "gst_filings_filed_by_users_id_fk" FOREIGN KEY ("filed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_sessions" ADD CONSTRAINT "gst_sessions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_sessions" ADD CONSTRAINT "gst_sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_sessions" ADD CONSTRAINT "gst_sessions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_lines" ADD CONSTRAINT "quotation_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_lines" ADD CONSTRAINT "quotation_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_lines" ADD CONSTRAINT "quotation_lines_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_filings_period" ON "gst_filings" USING btree ("company_id","gstin","return_type","period");--> statement-breakpoint
CREATE UNIQUE INDEX "quotations_number" ON "quotations" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['quotations','quotation_lines','gst_filings','gst_sessions'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- E-way bills generated before ewb_status existed are live ones.
UPDATE sales_invoices SET ewb_status = 'active' WHERE ewb_no IS NOT NULL;



CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" varchar(8) NOT NULL,
	"leave_request_id" uuid,
	"note" varchar(120)
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"code" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"name_hi" text,
	"gender" varchar(6) NOT NULL,
	"dob" date,
	"joined_on" date NOT NULL,
	"left_on" date,
	"status" varchar(8) DEFAULT 'active' NOT NULL,
	"fixed_term" boolean DEFAULT false NOT NULL,
	"department" varchar(60),
	"designation" varchar(60),
	"work_state" char(2) NOT NULL,
	"phone" varchar(15),
	"email" varchar(120),
	"address" jsonb,
	"pan" char(10),
	"aadhaar_last4" char(4),
	"uan" varchar(12),
	"esi_number" varchar(17),
	"pf_member" boolean DEFAULT true NOT NULL,
	"eps_eligible" boolean DEFAULT true NOT NULL,
	"pf_on_actual_wages" boolean DEFAULT false NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"tax_regime" varchar(3) DEFAULT 'new' NOT NULL,
	"metro" boolean DEFAULT false NOT NULL,
	"payment_mode" varchar(6) DEFAULT 'bank' NOT NULL,
	"bank_name" varchar(80),
	"bank_ifsc" char(11),
	"bank_account_enc" text,
	"bank_account_last4" char(4),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "holidays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"date" date NOT NULL,
	"name" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"leave_type_id" uuid NOT NULL,
	"fy" varchar(7) NOT NULL,
	"days" numeric(6, 1) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"leave_type_id" uuid NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"half_day" boolean DEFAULT false NOT NULL,
	"days" numeric(6, 1) NOT NULL,
	"reason" text,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leave_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(8) NOT NULL,
	"name" varchar(60) NOT NULL,
	"name_hi" varchar(60),
	"annual_quota" numeric(6, 1) DEFAULT '0' NOT NULL,
	"paid" boolean DEFAULT true NOT NULL,
	"encashable" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"status" varchar(10) DEFAULT 'draft' NOT NULL,
	"gross" numeric(18, 2) DEFAULT '0' NOT NULL,
	"deductions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net_pay" numeric(18, 2) DEFAULT '0' NOT NULL,
	"employer_contributions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"voucher_id" uuid,
	"payment_voucher_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finalized_at" timestamp with time zone,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payroll_settings" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"pf_establishment_code" varchar(22),
	"esi_employer_code" varchar(17),
	"labour_code_wages" boolean DEFAULT true NOT NULL,
	"weekly_offs" jsonb DEFAULT '[0]'::jsonb NOT NULL,
	"lwf_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lwf_employer" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lwf_months" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"encashment_divisor" integer DEFAULT 30 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payslips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"lop_days" numeric(5, 1) DEFAULT '0' NOT NULL,
	"lop_override" numeric(5, 1),
	"paid_days" numeric(5, 1) NOT NULL,
	"gross" numeric(18, 2) NOT NULL,
	"pf_wages" numeric(18, 2) DEFAULT '0' NOT NULL,
	"pf_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"esi_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"pt" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lwf_employee" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_deductions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_deductions" numeric(18, 2) NOT NULL,
	"net_pay" numeric(18, 2) NOT NULL,
	"employer_contributions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"detail" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_structures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"effective_from" date NOT NULL,
	"components" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"left_on" date NOT NULL,
	"service_years" integer NOT NULL,
	"gratuity" numeric(18, 2) DEFAULT '0' NOT NULL,
	"leave_days" numeric(6, 1) DEFAULT '0' NOT NULL,
	"leave_encashment" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_earnings" numeric(18, 2) DEFAULT '0' NOT NULL,
	"recoveries" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"remarks" text,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_declarations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"fy" varchar(7) NOT NULL,
	"rent_paid" numeric(18, 2) DEFAULT '0' NOT NULL,
	"c80" numeric(18, 2) DEFAULT '0' NOT NULL,
	"ccd1b" numeric(18, 2) DEFAULT '0' NOT NULL,
	"d80" numeric(18, 2) DEFAULT '0' NOT NULL,
	"home_loan_interest" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_deductions" numeric(18, 2) DEFAULT '0' NOT NULL,
	"other_income" numeric(18, 2) DEFAULT '0' NOT NULL,
	"previous_employer_salary" numeric(18, 2) DEFAULT '0' NOT NULL,
	"previous_employer_tds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_leave_request_id_leave_requests_id_fk" FOREIGN KEY ("leave_request_id") REFERENCES "public"."leave_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_openings" ADD CONSTRAINT "leave_openings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_openings" ADD CONSTRAINT "leave_openings_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_openings" ADD CONSTRAINT "leave_openings_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leave_type_id_leave_types_id_fk" FOREIGN KEY ("leave_type_id") REFERENCES "public"."leave_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_payment_voucher_id_vouchers_id_fk" FOREIGN KEY ("payment_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_settings" ADD CONSTRAINT "payroll_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_settings" ADD CONSTRAINT "payroll_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_run_id_payroll_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."payroll_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_declarations" ADD CONSTRAINT "tax_declarations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_declarations" ADD CONSTRAINT "tax_declarations_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_day" ON "attendance" USING btree ("employee_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_code" ON "employees" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "holidays_date" ON "holidays" USING btree ("company_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "leave_openings_fy" ON "leave_openings" USING btree ("employee_id","leave_type_id","fy");--> statement-breakpoint
CREATE INDEX "leave_requests_employee" ON "leave_requests" USING btree ("employee_id","from_date");--> statement-breakpoint
CREATE UNIQUE INDEX "leave_types_code" ON "leave_types" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "payslips_employee" ON "payslips" USING btree ("run_id","employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "salary_structures_from" ON "salary_structures" USING btree ("employee_id","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "tax_declarations_fy" ON "tax_declarations" USING btree ("employee_id","fy");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['employees','salary_structures','tax_declarations','holidays','leave_types','leave_openings','leave_requests',
    'attendance','payroll_settings','payroll_runs','payslips','settlements'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- One live payroll run per company and month (a cancelled run can be redone).
CREATE UNIQUE INDEX payroll_runs_period ON payroll_runs (company_id, period) WHERE status <> 'cancelled';



CREATE TABLE "employee_loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"instalment" numeric(18, 2) NOT NULL,
	"recovered" numeric(18, 2) DEFAULT '0' NOT NULL,
	"start_period" char(7) NOT NULL,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"paid_from_account_id" uuid,
	"voucher_id" uuid,
	"remarks" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(40) NOT NULL,
	"start_time" char(5) NOT NULL,
	"end_time" char(5) NOT NULL,
	"grace_minutes" integer DEFAULT 10 NOT NULL,
	"full_day_minutes" integer DEFAULT 480 NOT NULL,
	"half_day_minutes" integer DEFAULT 240 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statutory_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(4) NOT NULL,
	"period" char(7) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"paid_on" date NOT NULL,
	"account_id" uuid NOT NULL,
	"reference" varchar(40),
	"bsr_code" char(7),
	"challan_serial" varchar(5),
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "in_time" char(5);--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "out_time" char(5);--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "worked_minutes" integer;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "late" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "source" varchar(8) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "shift_id" uuid;--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "extra_earnings" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "loan_recoveries" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_paid_from_account_id_accounts_id_fk" FOREIGN KEY ("paid_from_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statutory_payments" ADD CONSTRAINT "statutory_payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shifts_name" ON "shifts" USING btree ("company_id","name");--> statement-breakpoint
CREATE INDEX "statutory_payments_period" ON "statutory_payments" USING btree ("company_id","kind","period");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['shifts','employee_loans','statutory_payments'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
ALTER TABLE employees ADD CONSTRAINT employees_shift_fk FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL;



ALTER TABLE "payroll_settings" ADD COLUMN "tan" char(10);


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



CREATE TABLE "bom_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bom_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"wastage_pct" numeric(5, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bom_operations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bom_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"name" varchar(60) NOT NULL,
	"work_centre_id" uuid NOT NULL,
	"minutes" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"output_qty" numeric(18, 4) NOT NULL,
	"overhead" numeric(18, 2) DEFAULT '0' NOT NULL,
	"is_default" boolean DEFAULT true NOT NULL,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_work_challans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"direction" varchar(3) NOT NULL,
	"job_worker_id" uuid NOT NULL,
	"process" varchar(80),
	"sent_challan_id" uuid,
	"lines" jsonb NOT NULL,
	"consumed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"charges" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"lines" jsonb NOT NULL,
	"status" varchar(10) DEFAULT 'new' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"phone" varchar(10) NOT NULL,
	"name" varchar(80),
	"points" integer DEFAULT 0 NOT NULL,
	"lifetime_points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_bill_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bill_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"name" text NOT NULL,
	"hsn" varchar(8),
	"qty" numeric(18, 4) NOT NULL,
	"price" numeric(18, 2) NOT NULL,
	"gst_rate" numeric(5, 2) NOT NULL,
	"cess_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"taxable" numeric(18, 2) NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"terminal_id" uuid NOT NULL,
	"session_id" uuid,
	"order_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"customer_phone" varchar(10),
	"customer_name" varchar(80),
	"customer_account_id" uuid,
	"prices_include_tax" boolean NOT NULL,
	"taxable" numeric(18, 2) NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"discount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"service_charge" numeric(18, 2) DEFAULT '0' NOT NULL,
	"round_off" numeric(18, 2) DEFAULT '0' NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"payments" jsonb NOT NULL,
	"change" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tax_by_rate" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"loyalty_earned" integer DEFAULT 0 NOT NULL,
	"loyalty_redeemed" integer DEFAULT 0 NOT NULL,
	"status" varchar(8) DEFAULT 'paid' NOT NULL,
	"void_reason" text,
	"voucher_id" uuid,
	"source" varchar(8) DEFAULT 'web' NOT NULL,
	"mismatch" jsonb,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"table_id" uuid,
	"terminal_id" uuid NOT NULL,
	"covers" integer DEFAULT 1 NOT NULL,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"bill_id" uuid,
	"opened_by" uuid,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"terminal_id" uuid NOT NULL,
	"opened_by" uuid,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"opening_cash" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(8) DEFAULT 'open' NOT NULL,
	"closed_by" uuid,
	"closed_at" timestamp with time zone,
	"expected_cash" numeric(18, 2),
	"counted_cash" numeric(18, 2),
	"difference" numeric(18, 2),
	"totals" jsonb,
	"voucher_id" uuid
);
--> statement-breakpoint
CREATE TABLE "pos_settings" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"prices_include_tax" boolean DEFAULT true NOT NULL,
	"service_charge_pct" numeric(5, 2) DEFAULT '0' NOT NULL,
	"service_charge_gst_rate" numeric(5, 2) DEFAULT '5' NOT NULL,
	"restaurant" boolean DEFAULT false NOT NULL,
	"loyalty_enabled" boolean DEFAULT false NOT NULL,
	"loyalty_points_per_100" integer DEFAULT 1 NOT NULL,
	"loyalty_point_value" numeric(10, 2) DEFAULT '1' NOT NULL,
	"loyalty_max_redeem_pct" numeric(5, 2) DEFAULT '20' NOT NULL,
	"receipt_footer" text
);
--> statement-breakpoint
CREATE TABLE "pos_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(20) NOT NULL,
	"area" varchar(30),
	"seats" integer DEFAULT 4 NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_terminals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(4) NOT NULL,
	"name" varchar(60) NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"device_id" uuid,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"kind" varchar(10) NOT NULL,
	"date" date NOT NULL,
	"good_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rejected_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"material_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"overhead_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"unit_cost" numeric(18, 4) DEFAULT '0' NOT NULL,
	"lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"item_id" uuid NOT NULL,
	"bom_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"source_warehouse_id" uuid NOT NULL,
	"target_warehouse_id" uuid NOT NULL,
	"status" varchar(10) DEFAULT 'planned' NOT NULL,
	"produced_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rejected_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"material_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"overhead_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"pending_cost" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sales_order_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "work_centres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"cost_per_hour" numeric(18, 2) DEFAULT '0' NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "recipe_on_sale" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "lead_time_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "job_worker_id" uuid;--> statement-breakpoint
ALTER TABLE "bom_lines" ADD CONSTRAINT "bom_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_lines" ADD CONSTRAINT "bom_lines_bom_id_boms_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."boms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_lines" ADD CONSTRAINT "bom_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_operations" ADD CONSTRAINT "bom_operations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_operations" ADD CONSTRAINT "bom_operations_bom_id_boms_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."boms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_operations" ADD CONSTRAINT "bom_operations_work_centre_id_work_centres_id_fk" FOREIGN KEY ("work_centre_id") REFERENCES "public"."work_centres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_work_challans" ADD CONSTRAINT "job_work_challans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_work_challans" ADD CONSTRAINT "job_work_challans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_work_challans" ADD CONSTRAINT "job_work_challans_job_worker_id_accounts_id_fk" FOREIGN KEY ("job_worker_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_work_challans" ADD CONSTRAINT "job_work_challans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kots" ADD CONSTRAINT "kots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kots" ADD CONSTRAINT "kots_order_id_pos_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pos_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kots" ADD CONSTRAINT "kots_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_members" ADD CONSTRAINT "loyalty_members_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_members" ADD CONSTRAINT "loyalty_members_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_bill_id_pos_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_session_id_pos_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."pos_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_customer_account_id_accounts_id_fk" FOREIGN KEY ("customer_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD CONSTRAINT "pos_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_orders" ADD CONSTRAINT "pos_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_orders" ADD CONSTRAINT "pos_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_orders" ADD CONSTRAINT "pos_orders_table_id_pos_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."pos_tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_orders" ADD CONSTRAINT "pos_orders_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_orders" ADD CONSTRAINT "pos_orders_opened_by_users_id_fk" FOREIGN KEY ("opened_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_opened_by_users_id_fk" FOREIGN KEY ("opened_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_closed_by_users_id_fk" FOREIGN KEY ("closed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD CONSTRAINT "pos_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD CONSTRAINT "pos_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_tables" ADD CONSTRAINT "pos_tables_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_tables" ADD CONSTRAINT "pos_tables_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_terminals" ADD CONSTRAINT "pos_terminals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_terminals" ADD CONSTRAINT "pos_terminals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_terminals" ADD CONSTRAINT "pos_terminals_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_terminals" ADD CONSTRAINT "pos_terminals_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_entries" ADD CONSTRAINT "production_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_entries" ADD CONSTRAINT "production_entries_order_id_production_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."production_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_entries" ADD CONSTRAINT "production_entries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_bom_id_boms_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."boms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_source_warehouse_id_warehouses_id_fk" FOREIGN KEY ("source_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_target_warehouse_id_warehouses_id_fk" FOREIGN KEY ("target_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_centres" ADD CONSTRAINT "work_centres_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_centres" ADD CONSTRAINT "work_centres_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "boms_version" ON "boms" USING btree ("company_id","item_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "job_work_number" ON "job_work_challans" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "loyalty_members_phone" ON "loyalty_members" USING btree ("company_id","phone");--> statement-breakpoint
CREATE UNIQUE INDEX "pos_bills_number" ON "pos_bills" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "pos_bills_date" ON "pos_bills" USING btree ("company_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "pos_tables_name" ON "pos_tables" USING btree ("company_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "pos_terminals_code" ON "pos_terminals" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "production_orders_number" ON "production_orders" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "work_centres_name" ON "work_centres" USING btree ("company_id","name");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['work_centres','boms','bom_lines','bom_operations','production_orders','production_entries','job_work_challans',
    'pos_settings','pos_terminals','pos_sessions','pos_tables','pos_orders','kots','loyalty_members','pos_bills','pos_bill_lines'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- One open session per terminal.
CREATE UNIQUE INDEX pos_sessions_open ON pos_sessions (terminal_id) WHERE status = 'open';
--> statement-breakpoint
-- Offline POS devices need terminals and their bills (items already log their changes).
CREATE TRIGGER sync_pos_terminals AFTER INSERT OR UPDATE ON pos_terminals FOR EACH ROW EXECUTE FUNCTION record_sync_change('pos_terminal');
--> statement-breakpoint
CREATE TRIGGER sync_pos_bills AFTER INSERT OR UPDATE ON pos_bills FOR EACH ROW EXECUTE FUNCTION record_sync_change('pos_bill');



CREATE TABLE "asset_classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"name_hi" varchar(60),
	"method" varchar(3) DEFAULT 'slm' NOT NULL,
	"life_years" numeric(5, 2) NOT NULL,
	"residual_pct" numeric(5, 2) DEFAULT '5' NOT NULL,
	"it_block" varchar(30) NOT NULL,
	"it_rate" numeric(5, 2) NOT NULL,
	"asset_account_id" uuid NOT NULL,
	"accumulated_account_id" uuid NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(16) NOT NULL,
	"name" text NOT NULL,
	"class_id" uuid NOT NULL,
	"purchase_date" date NOT NULL,
	"put_to_use_on" date NOT NULL,
	"cost" numeric(18, 2) NOT NULL,
	"opening_accumulated" numeric(18, 2) DEFAULT '0' NOT NULL,
	"location" varchar(80),
	"serial_no" varchar(60),
	"custodian_id" uuid,
	"supplier_id" uuid,
	"invoice_ref" varchar(40),
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"disposed_on" date,
	"sale_value" numeric(18, 2),
	"disposal_voucher_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"statement_id" uuid NOT NULL,
	"date" date NOT NULL,
	"description" text NOT NULL,
	"reference" varchar(60),
	"debit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"credit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"balance" numeric(18, 2),
	"fingerprint" text NOT NULL,
	"status" varchar(10) DEFAULT 'unmatched' NOT NULL,
	"matched_by" varchar(8),
	"matched_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "bank_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bank_line_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"voucher_id" uuid NOT NULL,
	"amount" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank_profiles" (
	"account_id" uuid PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"bank_name" varchar(80),
	"account_last4" char(4),
	"ifsc" char(11),
	"feed_provider" varchar(20),
	"feed_consent_id" varchar(80),
	"feed_status" varchar(12),
	"feed_fetched_to" date
);
--> statement-breakpoint
CREATE TABLE "bank_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"contains" varchar(80) NOT NULL,
	"direction" varchar(3) DEFAULT 'any' NOT NULL,
	"account_id" uuid NOT NULL,
	"narration" varchar(120),
	"priority" integer DEFAULT 10 NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank_statements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"source" varchar(8) NOT NULL,
	"file_name" text,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"line_count" integer NOT NULL,
	"duplicates" integer DEFAULT 0 NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "depreciation_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"days" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "depreciation_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"name_hi" varchar(60),
	"account_id" uuid NOT NULL,
	"blocked_credit" boolean DEFAULT false NOT NULL,
	"limit_per_claim" numeric(18, 2),
	"receipt_required_above" numeric(18, 2),
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"title" varchar(120) NOT NULL,
	"project_id" uuid,
	"status" varchar(10) DEFAULT 'draft' NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"itc" numeric(18, 2) DEFAULT '0' NOT NULL,
	"submitted_at" timestamp with time zone,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"reject_reason" text,
	"voucher_id" uuid,
	"payment_voucher_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"claim_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"date" date NOT NULL,
	"category_id" uuid NOT NULL,
	"description" text,
	"amount" numeric(18, 2) NOT NULL,
	"gst_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"vendor_name" varchar(100),
	"vendor_gstin" char(15),
	"invoice_no" varchar(30),
	"taxable" numeric(18, 2) NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"project_id" uuid,
	"file_id" uuid,
	"ocr" jsonb
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"content_type" varchar(80) NOT NULL,
	"size" integer NOT NULL,
	"sha256" char(64) NOT NULL,
	"data" "bytea" NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gateway_settlements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"provider" varchar(20) NOT NULL,
	"settlement_id" varchar(60) NOT NULL,
	"utr" varchar(40),
	"settled_on" date NOT NULL,
	"payments" integer NOT NULL,
	"gross" numeric(18, 2) NOT NULL,
	"refunds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"fees" numeric(18, 2) DEFAULT '0' NOT NULL,
	"tax" numeric(18, 2) DEFAULT '0' NOT NULL,
	"adjustments" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net" numeric(18, 2) NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"clearing_account_id" uuid NOT NULL,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "it_block_openings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"fy" varchar(7) NOT NULL,
	"block" varchar(30) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"opening_wdv" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"bill_rate" numeric(18, 2)
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"due_on" date,
	"status" varchar(8) DEFAULT 'pending' NOT NULL,
	"invoice_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"status" varchar(8) DEFAULT 'todo' NOT NULL,
	"assignee_id" uuid,
	"estimated_hours" numeric(8, 2),
	"due_on" date,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(12) NOT NULL,
	"name" text NOT NULL,
	"customer_id" uuid,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"billing" varchar(12) DEFAULT 'fixed' NOT NULL,
	"contract_value" numeric(18, 2),
	"budget_cost" numeric(18, 2),
	"budget_hours" numeric(10, 2),
	"bill_rate" numeric(18, 2),
	"billing_item_id" uuid,
	"start_on" date,
	"end_on" date,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timesheets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"task_id" uuid,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"hours" numeric(5, 2) NOT NULL,
	"billable" boolean DEFAULT true NOT NULL,
	"note" varchar(200),
	"cost_rate" numeric(18, 2) NOT NULL,
	"bill_rate" numeric(18, 2) DEFAULT '0' NOT NULL,
	"status" varchar(10) DEFAULT 'submitted' NOT NULL,
	"invoice_id" uuid,
	"approved_by" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "cost_per_hour" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "purchase_bills" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "project_id" uuid;--> statement-breakpoint
ALTER TABLE "asset_classes" ADD CONSTRAINT "asset_classes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_classes" ADD CONSTRAINT "asset_classes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_classes" ADD CONSTRAINT "asset_classes_asset_account_id_accounts_id_fk" FOREIGN KEY ("asset_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_classes" ADD CONSTRAINT "asset_classes_accumulated_account_id_accounts_id_fk" FOREIGN KEY ("accumulated_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_class_id_asset_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."asset_classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_custodian_id_employees_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_disposal_voucher_id_vouchers_id_fk" FOREIGN KEY ("disposal_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_lines" ADD CONSTRAINT "bank_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_lines" ADD CONSTRAINT "bank_lines_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_lines" ADD CONSTRAINT "bank_lines_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_lines" ADD CONSTRAINT "bank_lines_statement_id_bank_statements_id_fk" FOREIGN KEY ("statement_id") REFERENCES "public"."bank_statements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_matches" ADD CONSTRAINT "bank_matches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_matches" ADD CONSTRAINT "bank_matches_bank_line_id_bank_lines_id_fk" FOREIGN KEY ("bank_line_id") REFERENCES "public"."bank_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_matches" ADD CONSTRAINT "bank_matches_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_matches" ADD CONSTRAINT "bank_matches_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_profiles" ADD CONSTRAINT "bank_profiles_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_profiles" ADD CONSTRAINT "bank_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_profiles" ADD CONSTRAINT "bank_profiles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_rules" ADD CONSTRAINT "bank_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_rules" ADD CONSTRAINT "bank_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_rules" ADD CONSTRAINT "bank_rules_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_entries" ADD CONSTRAINT "depreciation_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_entries" ADD CONSTRAINT "depreciation_entries_run_id_depreciation_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."depreciation_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_entries" ADD CONSTRAINT "depreciation_entries_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_runs" ADD CONSTRAINT "depreciation_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_runs" ADD CONSTRAINT "depreciation_runs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_runs" ADD CONSTRAINT "depreciation_runs_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_runs" ADD CONSTRAINT "depreciation_runs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_payment_voucher_id_vouchers_id_fk" FOREIGN KEY ("payment_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_lines" ADD CONSTRAINT "expense_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_lines" ADD CONSTRAINT "expense_lines_claim_id_expense_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."expense_claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_lines" ADD CONSTRAINT "expense_lines_category_id_expense_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_lines" ADD CONSTRAINT "expense_lines_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway_settlements" ADD CONSTRAINT "gateway_settlements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway_settlements" ADD CONSTRAINT "gateway_settlements_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway_settlements" ADD CONSTRAINT "gateway_settlements_bank_account_id_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway_settlements" ADD CONSTRAINT "gateway_settlements_clearing_account_id_accounts_id_fk" FOREIGN KEY ("clearing_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway_settlements" ADD CONSTRAINT "gateway_settlements_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gateway_settlements" ADD CONSTRAINT "gateway_settlements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "it_block_openings" ADD CONSTRAINT "it_block_openings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "it_block_openings" ADD CONSTRAINT "it_block_openings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_assignee_id_employees_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_billing_item_id_items_id_fk" FOREIGN KEY ("billing_item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_task_id_project_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."project_tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "asset_classes_name" ON "asset_classes" USING btree ("company_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "assets_code" ON "assets" USING btree ("company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "bank_lines_fingerprint" ON "bank_lines" USING btree ("account_id","fingerprint");--> statement-breakpoint
CREATE INDEX "bank_lines_date" ON "bank_lines" USING btree ("account_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "bank_matches_voucher" ON "bank_matches" USING btree ("account_id","voucher_id");--> statement-breakpoint
CREATE UNIQUE INDEX "expense_categories_name" ON "expense_categories" USING btree ("company_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "expense_claims_number" ON "expense_claims" USING btree ("company_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "gateway_settlements_id" ON "gateway_settlements" USING btree ("company_id","provider","settlement_id");--> statement-breakpoint
CREATE UNIQUE INDEX "it_block_openings_key" ON "it_block_openings" USING btree ("company_id","fy","block");--> statement-breakpoint
CREATE UNIQUE INDEX "project_members_key" ON "project_members" USING btree ("project_id","employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_code" ON "projects" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "timesheets_project" ON "timesheets" USING btree ("project_id","date");--> statement-breakpoint
CREATE INDEX "timesheets_employee" ON "timesheets" USING btree ("employee_id","date");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['files','bank_profiles','bank_statements','bank_lines','bank_matches','bank_rules','gateway_settlements',
    'asset_classes','assets','depreciation_runs','depreciation_entries','it_block_openings',
    'expense_categories','expense_claims','expense_lines',
    'projects','project_tasks','project_members','timesheets','project_milestones'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- A bank line is matched to a voucher at most once.
CREATE UNIQUE INDEX bank_matches_line_voucher ON bank_matches (bank_line_id, voucher_id);
--> statement-breakpoint
-- The new permission modules (banking, assets, expenses, projects) for existing businesses' built-in roles,
-- as packages/domain/src/permissions.ts gives them to new ones.
DO $$
DECLARE
  all_actions text[] := ARRAY['view','create','edit','submit','cancel','delete','export','approve'];
  everything text[] := ARRAY(SELECT m || '.' || a FROM unnest(ARRAY['banking','assets','expenses','projects']) m, unnest(all_actions) a);
  grants jsonb := jsonb_build_object(
    'owner', to_jsonb(everything),
    'admin', to_jsonb(everything),
    'accountant', to_jsonb(ARRAY(SELECT m || '.' || a FROM unnest(ARRAY['banking','assets']) m, unnest(all_actions) a)
      || ARRAY['expenses.view','expenses.create','expenses.edit','expenses.submit','expenses.export','expenses.approve','projects.view']),
    'sales', to_jsonb(ARRAY['projects.view','projects.create','projects.edit','projects.submit','projects.export']),
    'hr', to_jsonb(ARRAY['expenses.view','expenses.create','expenses.edit','expenses.submit','expenses.export']),
    'viewer', to_jsonb(ARRAY['banking.view','assets.view','expenses.view','projects.view'])
  );
  k text;
BEGIN
  FOR k IN SELECT jsonb_object_keys(grants) LOOP
    UPDATE roles SET permissions = ARRAY(
      SELECT DISTINCT p FROM unnest(permissions || ARRAY(SELECT jsonb_array_elements_text(grants -> k))) AS p ORDER BY p
    ) WHERE system AND key = k;
  END LOOP;
END $$;



ALTER TABLE "bank_lines" ADD COLUMN "seq" integer DEFAULT 0 NOT NULL;


ALTER TABLE "projects" ALTER COLUMN "billing" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "billing" SET DEFAULT 'fixed';


CREATE TABLE "crm_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"lead_id" uuid,
	"account_id" uuid,
	"kind" varchar(10) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"due_at" timestamp with time zone,
	"done_at" timestamp with time zone,
	"owner_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(12) NOT NULL,
	"name" text NOT NULL,
	"organisation" text,
	"phone" varchar(15),
	"email" varchar(120),
	"gstin" char(15),
	"state_code" char(2),
	"city" varchar(80),
	"source" varchar(12) DEFAULT 'other' NOT NULL,
	"stage" varchar(10) DEFAULT 'new' NOT NULL,
	"value" numeric(18, 2),
	"expected_close" date,
	"owner_id" uuid,
	"customer_id" uuid,
	"lost_reason" text,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"channel" varchar(10) DEFAULT 'whatsapp' NOT NULL,
	"category" varchar(12) DEFAULT 'utility' NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"body" text NOT NULL,
	"provider_name" varchar(80),
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"channel" varchar(10) NOT NULL,
	"to" varchar(15) NOT NULL,
	"account_id" uuid,
	"lead_id" uuid,
	"template_id" uuid,
	"body" text NOT NULL,
	"status" varchar(10) NOT NULL,
	"provider" varchar(20) NOT NULL,
	"provider_id" varchar(120),
	"error" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"config" jsonb NOT NULL,
	"frequency" varchar(8),
	"hour" integer,
	"weekday" integer,
	"day" integer,
	"recipients" text[] DEFAULT '{}'::text[] NOT NULL,
	"next_run_at" timestamp with time zone,
	"last_run_at" timestamp with time zone,
	"last_error" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_lead_id_crm_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."crm_leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crm_leads" ADD CONSTRAINT "crm_leads_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_templates" ADD CONSTRAINT "message_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_templates" ADD CONSTRAINT "message_templates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_lead_id_crm_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."crm_leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_template_id_message_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."message_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_reports" ADD CONSTRAINT "saved_reports_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_reports" ADD CONSTRAINT "saved_reports_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_reports" ADD CONSTRAINT "saved_reports_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "crm_activities_due" ON "crm_activities" USING btree ("company_id","due_at");--> statement-breakpoint
CREATE UNIQUE INDEX "crm_leads_code" ON "crm_leads" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "crm_leads_stage" ON "crm_leads" USING btree ("company_id","stage");--> statement-breakpoint
CREATE UNIQUE INDEX "message_templates_name" ON "message_templates" USING btree ("company_id","name");--> statement-breakpoint
CREATE INDEX "messages_account" ON "messages" USING btree ("account_id","created_at");--> statement-breakpoint
CREATE INDEX "saved_reports_due" ON "saved_reports" USING btree ("next_run_at");


DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['crm_leads','crm_activities','message_templates','messages','saved_reports'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant())', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO varchasv_app', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- The report scheduler runs outside any tenant: it may only learn which reports are due (and whose),
-- then does the work inside that tenant's own transaction.
CREATE OR REPLACE FUNCTION due_saved_reports(p_now timestamptz)
  RETURNS TABLE (tenant_id uuid, report_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT s.tenant_id, s.id FROM saved_reports s
    JOIN tenants t ON t.id = s.tenant_id AND t.status = 'active'
    WHERE s.next_run_at IS NOT NULL AND s.next_run_at <= p_now
    ORDER BY s.next_run_at LIMIT 100
  $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION due_saved_reports(timestamptz) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_saved_reports(timestamptz) TO varchasv_app;
--> statement-breakpoint
-- The CRM module for existing businesses' built-in roles (as packages/domain/src/permissions.ts gives new ones).
DO $$
DECLARE
  all_actions text[] := ARRAY['view','create','edit','submit','cancel','delete','export','approve'];
  work text[] := ARRAY['crm.view','crm.create','crm.edit','crm.submit','crm.export'];
  grants jsonb := jsonb_build_object(
    'owner', to_jsonb(ARRAY(SELECT 'crm.' || a FROM unnest(all_actions) a)),
    'admin', to_jsonb(ARRAY(SELECT 'crm.' || a FROM unnest(all_actions) a)),
    'sales', to_jsonb(work),
    'accountant', to_jsonb(ARRAY['crm.view']),
    'viewer', to_jsonb(ARRAY['crm.view'])
  );
  k text;
BEGIN
  FOR k IN SELECT jsonb_object_keys(grants) LOOP
    UPDATE roles SET permissions = ARRAY(
      SELECT DISTINCT p FROM unnest(permissions || ARRAY(SELECT jsonb_array_elements_text(grants -> k))) AS p ORDER BY p
    ) WHERE system AND key = k;
  END LOOP;
END $$;



ALTER TABLE "gst_settings" ADD COLUMN "print_language" varchar(5) DEFAULT 'hi' NOT NULL;


CREATE TABLE "password_resets" (
	"token_hash" char(64) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "password_resets_user_idx" ON "password_resets" USING btree ("user_id");


-- Foreign keys that queries filter or join on (document lines by parent, documents by voucher and party,
-- company-scoped lists). Postgres doesn't index foreign keys by itself. Audit columns (*_by) are left out.
CREATE INDEX IF NOT EXISTS asset_classes_accumulated_account_id_idx ON asset_classes (accumulated_account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS asset_classes_asset_account_id_idx ON asset_classes (asset_account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_class_id_idx ON assets (class_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_custodian_id_idx ON assets (custodian_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_disposal_voucher_id_idx ON assets (disposal_voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_supplier_id_idx ON assets (supplier_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_voucher_id_idx ON assets (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS attendance_leave_request_id_idx ON attendance (leave_request_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_lines_company_id_idx ON bank_lines (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_lines_statement_id_idx ON bank_lines (statement_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_matches_voucher_id_idx ON bank_matches (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_profiles_company_id_idx ON bank_profiles (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_rules_account_id_idx ON bank_rules (account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_rules_company_id_idx ON bank_rules (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_statements_account_id_idx ON bank_statements (account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bank_statements_company_id_idx ON bank_statements (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bom_lines_bom_id_idx ON bom_lines (bom_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bom_lines_item_id_idx ON bom_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bom_operations_bom_id_idx ON bom_operations (bom_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bom_operations_work_centre_id_idx ON bom_operations (work_centre_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS boms_item_id_idx ON boms (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_note_lines_invoice_line_id_idx ON credit_note_lines (invoice_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_note_lines_item_id_idx ON credit_note_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_note_lines_note_id_idx ON credit_note_lines (note_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_notes_customer_id_idx ON credit_notes (customer_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_notes_invoice_id_idx ON credit_notes (invoice_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_notes_voucher_id_idx ON credit_notes (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS credit_notes_warehouse_id_idx ON credit_notes (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_activities_account_id_idx ON crm_activities (account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_activities_lead_id_idx ON crm_activities (lead_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_activities_owner_id_idx ON crm_activities (owner_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_leads_customer_id_idx ON crm_leads (customer_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS crm_leads_owner_id_idx ON crm_leads (owner_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS delivery_note_lines_item_id_idx ON delivery_note_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS delivery_note_lines_note_id_idx ON delivery_note_lines (note_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS delivery_note_lines_order_line_id_idx ON delivery_note_lines (order_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS delivery_notes_customer_id_idx ON delivery_notes (customer_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS delivery_notes_order_id_idx ON delivery_notes (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS delivery_notes_warehouse_id_idx ON delivery_notes (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS depreciation_entries_asset_id_idx ON depreciation_entries (asset_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS depreciation_entries_run_id_idx ON depreciation_entries (run_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS depreciation_runs_company_id_idx ON depreciation_runs (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS depreciation_runs_voucher_id_idx ON depreciation_runs (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS employee_loans_employee_id_idx ON employee_loans (employee_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS employee_loans_paid_from_account_id_idx ON employee_loans (paid_from_account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS employee_loans_voucher_id_idx ON employee_loans (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS employees_branch_id_idx ON employees (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS employees_shift_id_idx ON employees (shift_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_categories_account_id_idx ON expense_categories (account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_claims_employee_id_idx ON expense_claims (employee_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_claims_payment_voucher_id_idx ON expense_claims (payment_voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_claims_voucher_id_idx ON expense_claims (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_lines_category_id_idx ON expense_lines (category_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_lines_claim_id_idx ON expense_lines (claim_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS expense_lines_file_id_idx ON expense_lines (file_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS files_company_id_idx ON files (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS gateway_settlements_bank_account_id_idx ON gateway_settlements (bank_account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS gateway_settlements_clearing_account_id_idx ON gateway_settlements (clearing_account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS gateway_settlements_voucher_id_idx ON gateway_settlements (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS goods_receipt_lines_item_id_idx ON goods_receipt_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS goods_receipt_lines_order_line_id_idx ON goods_receipt_lines (order_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS goods_receipt_lines_receipt_id_idx ON goods_receipt_lines (receipt_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS goods_receipts_order_id_idx ON goods_receipts (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS goods_receipts_supplier_id_idx ON goods_receipts (supplier_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS goods_receipts_warehouse_id_idx ON goods_receipts (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS invitations_role_id_idx ON invitations (role_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS items_uom_id_idx ON items (uom_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS job_work_challans_job_worker_id_idx ON job_work_challans (job_worker_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS kots_order_id_idx ON kots (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS leave_openings_leave_type_id_idx ON leave_openings (leave_type_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS leave_requests_leave_type_id_idx ON leave_requests (leave_type_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS memberships_role_id_idx ON memberships (role_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS memberships_user_id_idx ON memberships (user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS messages_company_id_idx ON messages (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS messages_lead_id_idx ON messages (lead_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS messages_template_id_idx ON messages (template_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS number_series_branch_id_idx ON number_series (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS number_series_device_id_idx ON number_series (device_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS number_series_fiscal_year_id_idx ON number_series (fiscal_year_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS payroll_runs_payment_voucher_id_idx ON payroll_runs (payment_voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS payroll_runs_voucher_id_idx ON payroll_runs (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS payslips_employee_id_idx ON payslips (employee_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_bill_lines_bill_id_idx ON pos_bill_lines (bill_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_bill_lines_item_id_idx ON pos_bill_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_bills_customer_account_id_idx ON pos_bills (customer_account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_bills_session_id_idx ON pos_bills (session_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_bills_terminal_id_idx ON pos_bills (terminal_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_bills_voucher_id_idx ON pos_bills (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_orders_company_id_idx ON pos_orders (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_orders_table_id_idx ON pos_orders (table_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_orders_terminal_id_idx ON pos_orders (terminal_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_sessions_voucher_id_idx ON pos_sessions (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_terminals_device_id_idx ON pos_terminals (device_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS pos_terminals_warehouse_id_idx ON pos_terminals (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS production_entries_order_id_idx ON production_entries (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS production_orders_bom_id_idx ON production_orders (bom_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS production_orders_item_id_idx ON production_orders (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS production_orders_source_warehouse_id_idx ON production_orders (source_warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS production_orders_target_warehouse_id_idx ON production_orders (target_warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS project_members_employee_id_idx ON project_members (employee_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones (project_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS project_tasks_assignee_id_idx ON project_tasks (assignee_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS project_tasks_project_id_idx ON project_tasks (project_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS projects_billing_item_id_idx ON projects (billing_item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS projects_customer_id_idx ON projects (customer_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bill_lines_bill_id_idx ON purchase_bill_lines (bill_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bill_lines_item_id_idx ON purchase_bill_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bill_lines_order_line_id_idx ON purchase_bill_lines (order_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bill_lines_receipt_line_id_idx ON purchase_bill_lines (receipt_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bill_lines_warehouse_id_idx ON purchase_bill_lines (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bills_branch_id_idx ON purchase_bills (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bills_order_id_idx ON purchase_bills (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bills_supplier_id_idx ON purchase_bills (supplier_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_bills_voucher_id_idx ON purchase_bills (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_order_lines_item_id_idx ON purchase_order_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_order_lines_order_id_idx ON purchase_order_lines (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_orders_branch_id_idx ON purchase_orders (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_orders_supplier_id_idx ON purchase_orders (supplier_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_return_lines_bill_line_id_idx ON purchase_return_lines (bill_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_return_lines_item_id_idx ON purchase_return_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_return_lines_return_id_idx ON purchase_return_lines (return_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_returns_bill_id_idx ON purchase_returns (bill_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_returns_supplier_id_idx ON purchase_returns (supplier_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_returns_voucher_id_idx ON purchase_returns (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS purchase_returns_warehouse_id_idx ON purchase_returns (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS quotation_lines_item_id_idx ON quotation_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS quotation_lines_quotation_id_idx ON quotation_lines (quotation_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS quotations_branch_id_idx ON quotations (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS quotations_customer_id_idx ON quotations (customer_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoice_lines_delivery_line_id_idx ON sales_invoice_lines (delivery_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoice_lines_invoice_id_idx ON sales_invoice_lines (invoice_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoice_lines_item_id_idx ON sales_invoice_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoice_lines_order_line_id_idx ON sales_invoice_lines (order_line_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoice_lines_warehouse_id_idx ON sales_invoice_lines (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoices_branch_id_idx ON sales_invoices (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoices_order_id_idx ON sales_invoices (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoices_quotation_id_idx ON sales_invoices (quotation_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_invoices_voucher_id_idx ON sales_invoices (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_order_lines_item_id_idx ON sales_order_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_order_lines_order_id_idx ON sales_order_lines (order_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_orders_branch_id_idx ON sales_orders (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_orders_customer_id_idx ON sales_orders (customer_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sales_orders_quotation_id_idx ON sales_orders (quotation_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS saved_reports_company_id_idx ON saved_reports (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS settlements_employee_id_idx ON settlements (employee_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS settlements_voucher_id_idx ON settlements (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS statutory_payments_account_id_idx ON statutory_payments (account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS statutory_payments_voucher_id_idx ON statutory_payments (voucher_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS stock_journal_lines_item_id_idx ON stock_journal_lines (item_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS stock_journal_lines_journal_id_idx ON stock_journal_lines (journal_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS stock_journal_lines_to_warehouse_id_idx ON stock_journal_lines (to_warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS stock_journal_lines_warehouse_id_idx ON stock_journal_lines (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS stock_ledger_warehouse_id_idx ON stock_ledger (warehouse_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS timesheets_company_id_idx ON timesheets (company_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS timesheets_task_id_idx ON timesheets (task_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS voucher_lines_account_id_idx ON voucher_lines (account_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS vouchers_branch_id_idx ON vouchers (branch_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS vouchers_device_id_idx ON vouchers (device_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS vouchers_fiscal_year_id_idx ON vouchers (fiscal_year_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS warehouses_branch_id_idx ON warehouses (branch_id);



ALTER TABLE "items" ADD COLUMN "gst_slab" varchar(12);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "slab_pieces" integer DEFAULT 1 NOT NULL;


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



CREATE TABLE "item_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"uom_id" uuid NOT NULL,
	"factor" numeric(18, 4) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_units" ADD CONSTRAINT "item_units_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_units" ADD CONSTRAINT "item_units_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_units" ADD CONSTRAINT "item_units_uom_id_uoms_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."uoms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_units_item_uom" ON "item_units" USING btree ("item_id","uom_id");--> statement-breakpoint
ALTER TABLE item_units ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON item_units USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON item_units TO varchasv_app;



CREATE TABLE "delivery_returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"date" date NOT NULL,
	"lines" jsonb NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "rate" numeric(18, 4);--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "gst_rate" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "taxable" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "reason" varchar(12) DEFAULT 'supply' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "place_of_supply" char(2);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "supply_kind" varchar(8);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "transporter" varchar(80);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "vehicle_no" varchar(16);--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "taxable" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "cgst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "sgst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "utgst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "igst" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "cess" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD COLUMN "total" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotations" ADD COLUMN "kind" varchar(10) DEFAULT 'quotation' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotations" ADD COLUMN "advance_due" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "delivery_returns" ADD CONSTRAINT "delivery_returns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_returns" ADD CONSTRAINT "delivery_returns_note_id_delivery_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."delivery_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_returns" ADD CONSTRAINT "delivery_returns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE delivery_returns ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_returns USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_returns TO varchasv_app;



CREATE TABLE "price_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"price_list_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"rate" numeric(18, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"discount_pct" numeric(5, 2) DEFAULT '0' NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "credit_control" varchar(8) DEFAULT 'warn' NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "block_overdue_days" integer;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "interest_rate" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "price_list_id" uuid;--> statement-breakpoint
ALTER TABLE "price_list_items" ADD CONSTRAINT "price_list_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_list_items" ADD CONSTRAINT "price_list_items_price_list_id_price_lists_id_fk" FOREIGN KEY ("price_list_id") REFERENCES "public"."price_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_list_items" ADD CONSTRAINT "price_list_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_lists" ADD CONSTRAINT "price_lists_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_lists" ADD CONSTRAINT "price_lists_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "price_list_items_item" ON "price_list_items" USING btree ("price_list_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "price_lists_name" ON "price_lists" USING btree ("company_id",lower("name"));--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_price_list_id_price_lists_id_fk" FOREIGN KEY ("price_list_id") REFERENCES "public"."price_lists"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON price_lists USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON price_lists TO varchasv_app;--> statement-breakpoint
ALTER TABLE price_list_items ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON price_list_items USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON price_list_items TO varchasv_app;



CREATE TABLE "brokerage_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"voucher_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"tds_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"tds" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net" numeric(18, 2) NOT NULL,
	"lines" jsonb NOT NULL,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"month" char(7) NOT NULL,
	"target" numeric(18, 2) NOT NULL,
	"slabs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "is_agent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "commission_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "agent_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "agent_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brokerage_bills" ADD CONSTRAINT "brokerage_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_targets" ADD CONSTRAINT "sales_targets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_targets" ADD CONSTRAINT "sales_targets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_targets" ADD CONSTRAINT "sales_targets_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "brokerage_bills_number" ON "brokerage_bills" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "brokerage_bills_agent" ON "brokerage_bills" USING btree ("agent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_targets_key" ON "sales_targets" USING btree ("company_id","employee_id","month");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_agent_id_accounts_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sales_invoices_agent" ON "sales_invoices" USING btree ("agent_id");--> statement-breakpoint
ALTER TABLE brokerage_bills ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON brokerage_bills USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON brokerage_bills TO varchasv_app;--> statement-breakpoint
ALTER TABLE sales_targets ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON sales_targets USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON sales_targets TO varchasv_app;



CREATE TABLE "schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"kind" varchar(12) NOT NULL,
	"starts_on" date,
	"ends_on" date,
	"active" boolean DEFAULT true NOT NULL,
	"scope" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"pct" numeric(5, 2),
	"amount" numeric(18, 2),
	"min_value" numeric(18, 2),
	"buy" integer,
	"get" integer,
	"slabs" jsonb,
	"combo_price" numeric(18, 2),
	"combo_items" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_bills" ADD COLUMN "schemes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schemes" ADD CONSTRAINT "schemes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "schemes_name" ON "schemes" USING btree ("company_id",lower("name"));--> statement-breakpoint
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON schemes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON schemes TO varchasv_app;



CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"kind" varchar(8) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"max_discount" numeric(18, 2),
	"min_bill" numeric(18, 2),
	"starts_on" date,
	"ends_on" date,
	"max_uses" integer,
	"used" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discount_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(20) NOT NULL,
	"holder" varchar(80) NOT NULL,
	"phone" varchar(10),
	"pct" numeric(5, 2) NOT NULL,
	"valid_until" date,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_voucher_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"gift_voucher_id" uuid NOT NULL,
	"bill_id" uuid NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"reversed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(16) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"balance" numeric(18, 2) NOT NULL,
	"issued_on" date NOT NULL,
	"expires_on" date NOT NULL,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"customer_phone" varchar(10),
	"customer_name" varchar(80),
	"paid_by" varchar(6) NOT NULL,
	"voucher_id" uuid,
	"expiry_voucher_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lucky_draws" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"min_bill" numeric(18, 2),
	"entries" integer NOT NULL,
	"winners" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loyalty_members" ADD COLUMN "referred_by" varchar(10);--> statement-breakpoint
ALTER TABLE "pos_bills" ADD COLUMN "promos" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "referral_points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_cards" ADD CONSTRAINT "discount_cards_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_cards" ADD CONSTRAINT "discount_cards_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_voucher_redemptions" ADD CONSTRAINT "gift_voucher_redemptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_voucher_redemptions" ADD CONSTRAINT "gift_voucher_redemptions_gift_voucher_id_gift_vouchers_id_fk" FOREIGN KEY ("gift_voucher_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_expiry_voucher_id_vouchers_id_fk" FOREIGN KEY ("expiry_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_vouchers" ADD CONSTRAINT "gift_vouchers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lucky_draws" ADD CONSTRAINT "lucky_draws_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lucky_draws" ADD CONSTRAINT "lucky_draws_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lucky_draws" ADD CONSTRAINT "lucky_draws_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_code" ON "coupons" USING btree ("company_id",upper("code"));--> statement-breakpoint
CREATE UNIQUE INDEX "discount_cards_number" ON "discount_cards" USING btree ("company_id",upper("number"));--> statement-breakpoint
CREATE INDEX "gift_voucher_redemptions_voucher" ON "gift_voucher_redemptions" USING btree ("gift_voucher_id");--> statement-breakpoint
CREATE UNIQUE INDEX "gift_vouchers_code" ON "gift_vouchers" USING btree ("company_id","code");--> statement-breakpoint
ALTER TABLE gift_vouchers ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gift_vouchers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gift_vouchers TO varchasv_app;--> statement-breakpoint
ALTER TABLE gift_voucher_redemptions ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gift_voucher_redemptions USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gift_voucher_redemptions TO varchasv_app;--> statement-breakpoint
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON coupons USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON coupons TO varchasv_app;--> statement-breakpoint
ALTER TABLE discount_cards ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON discount_cards USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON discount_cards TO varchasv_app;--> statement-breakpoint
ALTER TABLE lucky_draws ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON lucky_draws USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON lucky_draws TO varchasv_app;



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



DROP TABLE "kots" CASCADE;--> statement-breakpoint
DROP TABLE "pos_orders" CASCADE;--> statement-breakpoint
DROP TABLE "pos_tables" CASCADE;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "recipe_on_sale";--> statement-breakpoint
ALTER TABLE "pos_bills" DROP COLUMN "order_id";--> statement-breakpoint
ALTER TABLE "pos_bills" DROP COLUMN "service_charge";--> statement-breakpoint
ALTER TABLE "pos_settings" DROP COLUMN "service_charge_pct";--> statement-breakpoint
ALTER TABLE "pos_settings" DROP COLUMN "service_charge_gst_rate";--> statement-breakpoint
ALTER TABLE "pos_settings" DROP COLUMN "restaurant";


CREATE TABLE "alteration_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"kind" varchar(10) DEFAULT 'alteration' NOT NULL,
	"charge" numeric(18, 2) DEFAULT '0' NOT NULL,
	"labour" numeric(18, 2) DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alterations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"bill_id" uuid,
	"customer_name" varchar(80),
	"customer_phone" varchar(10),
	"lines" jsonb NOT NULL,
	"charge" numeric(18, 2) NOT NULL,
	"labour" numeric(18, 2) NOT NULL,
	"complimentary" boolean DEFAULT false NOT NULL,
	"trial_on" date,
	"delivery_on" date NOT NULL,
	"status" varchar(12) DEFAULT 'received' NOT NULL,
	"karigar_id" uuid,
	"issued_on" date,
	"ready_on" date,
	"delivered_on" date,
	"labour_voucher_id" uuid,
	"delivery_bill_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "karigars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"phone" varchar(10),
	"account_id" uuid,
	"employee_id" uuid,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alteration_types" ADD CONSTRAINT "alteration_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alteration_types" ADD CONSTRAINT "alteration_types_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_bill_id_pos_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_karigar_id_karigars_id_fk" FOREIGN KEY ("karigar_id") REFERENCES "public"."karigars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_labour_voucher_id_vouchers_id_fk" FOREIGN KEY ("labour_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_delivery_bill_id_pos_bills_id_fk" FOREIGN KEY ("delivery_bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alterations" ADD CONSTRAINT "alterations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "karigars" ADD CONSTRAINT "karigars_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "alteration_types_name" ON "alteration_types" USING btree ("company_id",lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "alterations_number" ON "alterations" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "alterations_status" ON "alterations" USING btree ("company_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "karigars_name" ON "karigars" USING btree ("company_id",lower("name"));--> statement-breakpoint
ALTER TABLE karigars ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON karigars USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON karigars TO varchasv_app;--> statement-breakpoint
ALTER TABLE alteration_types ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON alteration_types USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON alteration_types TO varchasv_app;--> statement-breakpoint
ALTER TABLE alterations ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON alterations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON alterations TO varchasv_app;



CREATE TABLE "measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_phone" varchar(10) NOT NULL,
	"customer_name" varchar(80),
	"garment" varchar(40) NOT NULL,
	"values" jsonb NOT NULL,
	"photo_file_id" uuid,
	"notes" text,
	"taken_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tailoring_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"customer_name" varchar(80) NOT NULL,
	"customer_phone" varchar(10) NOT NULL,
	"lines" jsonb NOT NULL,
	"total" numeric(18, 2) NOT NULL,
	"advance" numeric(18, 2) DEFAULT '0' NOT NULL,
	"advance_voucher_id" uuid,
	"trial_on" date,
	"delivery_on" date NOT NULL,
	"status" varchar(12) DEFAULT 'booked' NOT NULL,
	"delivered_on" date,
	"delivery_bill_id" uuid,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tailoring_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"garment" varchar(40) NOT NULL,
	"process" varchar(40) NOT NULL,
	"rate" numeric(18, 2) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_photo_file_id_files_id_fk" FOREIGN KEY ("photo_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_advance_voucher_id_gift_vouchers_id_fk" FOREIGN KEY ("advance_voucher_id") REFERENCES "public"."gift_vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_delivery_bill_id_pos_bills_id_fk" FOREIGN KEY ("delivery_bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_orders" ADD CONSTRAINT "tailoring_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_rates" ADD CONSTRAINT "tailoring_rates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tailoring_rates" ADD CONSTRAINT "tailoring_rates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "measurements_phone" ON "measurements" USING btree ("company_id","customer_phone");--> statement-breakpoint
CREATE UNIQUE INDEX "tailoring_orders_number" ON "tailoring_orders" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "tailoring_orders_status" ON "tailoring_orders" USING btree ("company_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "tailoring_rates_key" ON "tailoring_rates" USING btree ("company_id",lower("garment"),lower("process"));--> statement-breakpoint
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON measurements USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON measurements TO varchasv_app;--> statement-breakpoint
ALTER TABLE tailoring_rates ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tailoring_rates USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tailoring_rates TO varchasv_app;--> statement-breakpoint
ALTER TABLE tailoring_orders ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tailoring_orders USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tailoring_orders TO varchasv_app;



CREATE TABLE "consignment_moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"lines" jsonb NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"stock_journal_id" uuid,
	"invoice_id" uuid,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "consignee_id" uuid;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_stock_journal_id_stock_journals_id_fk" FOREIGN KEY ("stock_journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignment_moves" ADD CONSTRAINT "consignment_moves_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "consignment_moves_customer" ON "consignment_moves" USING btree ("company_id","customer_id","date");--> statement-breakpoint
ALTER TABLE consignment_moves ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON consignment_moves USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON consignment_moves TO varchasv_app;



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



CREATE TABLE "pos_held_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"terminal_id" uuid NOT NULL,
	"label" varchar(60),
	"customer_phone" varchar(10),
	"customer_name" varchar(80),
	"lines" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "salesman_id" uuid;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD COLUMN "overrides" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "allow_rate_change" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "max_line_discount_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "max_bill_discount_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "require_salesman" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_held_bills" ADD CONSTRAINT "pos_held_bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pos_held_bills_terminal" ON "pos_held_bills" USING btree ("terminal_id","created_at");--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_salesman_id_employees_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE pos_held_bills ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON pos_held_bills USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pos_held_bills TO varchasv_app;



CREATE TABLE "shared_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(12) NOT NULL,
	"doc_id" uuid NOT NULL,
	"token_hash" char(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "auto_send_bill" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shared_documents" ADD CONSTRAINT "shared_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_documents" ADD CONSTRAINT "shared_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_documents" ADD CONSTRAINT "shared_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shared_documents_token" ON "shared_documents" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "shared_documents_doc" ON "shared_documents" USING btree ("doc_id");--> statement-breakpoint
ALTER TABLE shared_documents ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON shared_documents USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON shared_documents TO varchasv_app;--> statement-breakpoint
-- A shared bill, invoice or statement link is opened without signing in: this only says which business,
-- kind and document a live token belongs to; the document is then read inside that business's context.
CREATE OR REPLACE FUNCTION shared_document_by_token(p_hash text)
  RETURNS TABLE (tenant_id uuid, kind varchar, doc_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT d.tenant_id, d.kind, d.doc_id FROM shared_documents d
    JOIN tenants t ON t.id = d.tenant_id AND t.status = 'active'
    WHERE d.token_hash = p_hash AND d.expires_at > now()
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION shared_document_by_token(text) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION shared_document_by_token(text) TO varchasv_app;



CREATE TABLE "stock_count_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"count_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"expected" numeric(18, 4) DEFAULT '0' NOT NULL,
	"counted" numeric(18, 4) DEFAULT '0' NOT NULL,
	"rate" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_counts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"name" varchar(80) NOT NULL,
	"scope" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"blind" boolean DEFAULT true NOT NULL,
	"status" varchar(10) DEFAULT 'counting' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" uuid,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"reason" text,
	"journal_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "mrp" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD COLUMN "transporter" varchar(80);--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD COLUMN "lr_number" varchar(30);--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD COLUMN "lr_date" date;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "menu" jsonb;--> statement-breakpoint
ALTER TABLE "pos_bills" ADD COLUMN "return_id" uuid;--> statement-breakpoint
ALTER TABLE "stock_count_lines" ADD CONSTRAINT "stock_count_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_count_lines" ADD CONSTRAINT "stock_count_lines_count_id_stock_counts_id_fk" FOREIGN KEY ("count_id") REFERENCES "public"."stock_counts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_count_lines" ADD CONSTRAINT "stock_count_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_journal_id_stock_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_count_lines_item" ON "stock_count_lines" USING btree ("count_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_counts_number" ON "stock_counts" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE stock_counts ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_counts USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_counts TO varchasv_app;--> statement-breakpoint
ALTER TABLE stock_count_lines ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_count_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_count_lines TO varchasv_app;



CREATE TABLE "lookups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(24) NOT NULL,
	"name" text NOT NULL,
	"code" varchar(12),
	"note" text,
	"starts_on" date,
	"ends_on" date,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lookups" ADD CONSTRAINT "lookups_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lookups" ADD CONSTRAINT "lookups_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lookups_company_kind_name" ON "lookups" USING btree ("company_id","kind",lower("name"));--> statement-breakpoint
CREATE INDEX "lookups_company_kind" ON "lookups" USING btree ("company_id","kind");--> statement-breakpoint
ALTER TABLE lookups ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON lookups USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON lookups TO varchasv_app;



CREATE TABLE "stock_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"min_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"max_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_limits" ADD CONSTRAINT "stock_limits_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_limits" ADD CONSTRAINT "stock_limits_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_limits" ADD CONSTRAINT "stock_limits_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_limits" ADD CONSTRAINT "stock_limits_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_limits_item_warehouse" ON "stock_limits" USING btree ("item_id","warehouse_id");--> statement-breakpoint
CREATE INDEX "stock_limits_warehouse" ON "stock_limits" USING btree ("warehouse_id");--> statement-breakpoint
ALTER TABLE stock_limits ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_limits USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_limits TO varchasv_app;



CREATE TABLE "bill_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"voucher_id" uuid NOT NULL,
	"bill_voucher_id" uuid NOT NULL,
	"amount" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_allocations" ADD CONSTRAINT "bill_allocations_bill_voucher_id_vouchers_id_fk" FOREIGN KEY ("bill_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bill_allocations_voucher" ON "bill_allocations" USING btree ("voucher_id");--> statement-breakpoint
CREATE INDEX "bill_allocations_bill" ON "bill_allocations" USING btree ("bill_voucher_id");
--> statement-breakpoint
ALTER TABLE bill_allocations ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON bill_allocations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON bill_allocations TO varchasv_app;



ALTER TABLE "audit_log" ADD COLUMN "chain_seq" bigint;--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "prev_hash" char(64);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "hash" char(64);--> statement-breakpoint
CREATE INDEX "audit_log_tenant_chain" ON "audit_log" USING btree ("tenant_id","chain_seq");--> statement-breakpoint
-- Sealing is the one allowed change to an audit entry: filling in its chain fields once, nothing else.
CREATE OR REPLACE FUNCTION audit_log_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.hash IS NULL AND NEW.hash IS NOT NULL
     AND (NEW.id, NEW.tenant_id, NEW.user_id, NEW.action, NEW.entity, NEW.entity_id, NEW.before, NEW.after, NEW.ip, NEW.at)
         IS NOT DISTINCT FROM (OLD.id, OLD.tenant_id, OLD.user_id, OLD.action, OLD.entity, OLD.entity_id, OLD.before, OLD.after, OLD.ip, OLD.at) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'audit_log is append-only';
END $$;
--> statement-breakpoint
-- The app role cannot update the audit log; this function (run as the owner) can only seal an unsealed
-- entry of the caller's own business, and the trigger above lets nothing else change.
CREATE OR REPLACE FUNCTION seal_audit_entry(p_id bigint, p_seq bigint, p_prev char(64), p_hash char(64))
  RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  UPDATE audit_log SET chain_seq = p_seq, prev_hash = p_prev, hash = p_hash
   WHERE id = p_id AND tenant_id = app_tenant() AND hash IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n = 1;
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION seal_audit_entry(bigint, bigint, char, char) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION seal_audit_entry(bigint, bigint, char, char) TO varchasv_app;
--> statement-breakpoint
-- The scheduler learns only which businesses have unsealed entries, then seals inside each one's own transaction.
CREATE OR REPLACE FUNCTION tenants_with_unsealed_audit()
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT a.tenant_id FROM audit_log a JOIN tenants t ON t.id = a.tenant_id AND t.status = 'active'
    WHERE a.hash IS NULL LIMIT 200
  $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION tenants_with_unsealed_audit() FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION tenants_with_unsealed_audit() TO varchasv_app;



-- Sealing a whole batch in one statement (the first seal of a long history would otherwise take one call per entry).
CREATE OR REPLACE FUNCTION seal_audit_entries(p_ids bigint[], p_seqs bigint[], p_prevs text[], p_hashes text[])
  RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
  UPDATE audit_log a SET chain_seq = v.seq, prev_hash = v.prev, hash = v.hash
    FROM unnest(p_ids, p_seqs, p_prevs, p_hashes) AS v(id, seq, prev, hash)
   WHERE a.id = v.id AND a.tenant_id = app_tenant() AND a.hash IS NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION seal_audit_entries(bigint[], bigint[], text[], text[]) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION seal_audit_entries(bigint[], bigint[], text[], text[]) TO varchasv_app;
--> statement-breakpoint
DROP FUNCTION IF EXISTS seal_audit_entry(bigint, bigint, char, char);



-- Special rights (back-dating, future dating, selling below cost, agent commission, import): everyone who
-- could do these things before keeps the right, so nothing stops working. Owners can now take them away per role.
UPDATE roles
   SET permissions = ARRAY(SELECT DISTINCT p FROM unnest(permissions || ARRAY[
         'special.changeDate', 'special.futureDate', 'special.sellBelowCost', 'special.seeAgentCommission', 'special.importData'
       ]) AS p ORDER BY p)
 WHERE key <> 'viewer';



ALTER TABLE "styles" ADD COLUMN "attributes" jsonb DEFAULT '{}'::jsonb NOT NULL;


CREATE TABLE "lr_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"date" date NOT NULL,
	"transporter" text NOT NULL,
	"lr_number" varchar(30) NOT NULL,
	"invoice_id" uuid,
	"customer_id" uuid,
	"destination" text,
	"packages" integer DEFAULT 1 NOT NULL,
	"weight_kg" numeric(12, 3),
	"freight" numeric(18, 2) DEFAULT '0' NOT NULL,
	"freight_by" varchar(7) DEFAULT 'paid' NOT NULL,
	"status" varchar(10) DEFAULT 'booked' NOT NULL,
	"delivered_on" date,
	"note" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lr_entries" ADD CONSTRAINT "lr_entries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lr_entries_transporter_lr" ON "lr_entries" USING btree ("company_id",lower("transporter"),"lr_number");--> statement-breakpoint
CREATE INDEX "lr_entries_company_date" ON "lr_entries" USING btree ("company_id","date");--> statement-breakpoint
ALTER TABLE lr_entries ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON lr_entries USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON lr_entries TO varchasv_app;



CREATE TABLE "loan_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"account_id" uuid NOT NULL,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loan_receipts" ADD CONSTRAINT "loan_receipts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_receipts" ADD CONSTRAINT "loan_receipts_loan_id_employee_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."employee_loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_receipts" ADD CONSTRAINT "loan_receipts_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_receipts" ADD CONSTRAINT "loan_receipts_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_receipts" ADD CONSTRAINT "loan_receipts_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loan_receipts_loan" ON "loan_receipts" USING btree ("loan_id");--> statement-breakpoint
ALTER TABLE loan_receipts ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON loan_receipts USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON loan_receipts TO varchasv_app;



CREATE TABLE "employee_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"kind" varchar(20) NOT NULL,
	"number" text,
	"issued_on" date,
	"expires_on" date,
	"file_id" uuid,
	"note" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "employee_documents_employee" ON "employee_documents" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "employee_documents_expiry" ON "employee_documents" USING btree ("tenant_id","expires_on");--> statement-breakpoint
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON employee_documents USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_documents TO varchasv_app;



CREATE TABLE "hsn_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(8) NOT NULL,
	"description" text NOT NULL,
	"kind" varchar(7) DEFAULT 'goods' NOT NULL,
	"gst_rate" numeric(5, 2),
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hsn_codes" ADD CONSTRAINT "hsn_codes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hsn_codes" ADD CONSTRAINT "hsn_codes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "hsn_codes_company_code" ON "hsn_codes" USING btree ("company_id","code");--> statement-breakpoint
ALTER TABLE hsn_codes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON hsn_codes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON hsn_codes TO varchasv_app;



CREATE TABLE "user_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"due_on" date,
	"done_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_notes_user" ON "user_notes" USING btree ("tenant_id","user_id","done_at");--> statement-breakpoint
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON user_notes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON user_notes TO varchasv_app;



CREATE TABLE "delivery_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"delivery_order_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"order_line_id" uuid,
	"qty" numeric(18, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"order_id" uuid,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"deliver_by" date,
	"transporter" varchar(80),
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD COLUMN "delivery_order_line_id" uuid;--> statement-breakpoint
ALTER TABLE "delivery_order_lines" ADD CONSTRAINT "delivery_order_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_order_lines" ADD CONSTRAINT "delivery_order_lines_delivery_order_id_delivery_orders_id_fk" FOREIGN KEY ("delivery_order_id") REFERENCES "public"."delivery_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_order_lines" ADD CONSTRAINT "delivery_order_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_order_lines" ADD CONSTRAINT "delivery_order_lines_order_line_id_sales_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."sales_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_orders_number" ON "delivery_orders" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ADD CONSTRAINT "delivery_note_lines_delivery_order_line_id_delivery_order_lines_id_fk" FOREIGN KEY ("delivery_order_line_id") REFERENCES "public"."delivery_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_orders USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_orders TO varchasv_app;--> statement-breakpoint
ALTER TABLE delivery_order_lines ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_order_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_order_lines TO varchasv_app;



CREATE TABLE "loan_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"instalment" numeric(18, 2) NOT NULL,
	"reason" text,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"decision_note" text,
	"loan_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_requests" ADD CONSTRAINT "loan_requests_loan_id_employee_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."employee_loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loan_requests_status" ON "loan_requests" USING btree ("tenant_id","status","created_at");--> statement-breakpoint
ALTER TABLE loan_requests ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON loan_requests USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON loan_requests TO varchasv_app;



CREATE TABLE "stipend_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"date" date NOT NULL,
	"paid_from_account_id" uuid NOT NULL,
	"voucher_id" uuid,
	"status" varchar(10) DEFAULT 'posted' NOT NULL,
	"remarks" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_paid_from_account_id_accounts_id_fk" FOREIGN KEY ("paid_from_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stipend_payments" ADD CONSTRAINT "stipend_payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stipend_payments_period" ON "stipend_payments" USING btree ("tenant_id","period");--> statement-breakpoint
ALTER TABLE stipend_payments ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stipend_payments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stipend_payments TO varchasv_app;



CREATE TABLE "stock_transfer_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"transfer_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"received_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"short_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"date" date NOT NULL,
	"from_warehouse_id" uuid NOT NULL,
	"to_warehouse_id" uuid NOT NULL,
	"transporter" varchar(80),
	"vehicle_no" varchar(16),
	"status" varchar(12) DEFAULT 'in_transit' NOT NULL,
	"received_on" date,
	"narration" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "in_transit" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_transfer_lines" ADD CONSTRAINT "stock_transfer_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_lines" ADD CONSTRAINT "stock_transfer_lines_transfer_id_stock_transfers_id_fk" FOREIGN KEY ("transfer_id") REFERENCES "public"."stock_transfers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_lines" ADD CONSTRAINT "stock_transfer_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_warehouse_id_warehouses_id_fk" FOREIGN KEY ("from_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_warehouse_id_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_transfers_number" ON "stock_transfers" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_transfers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_transfers TO varchasv_app;--> statement-breakpoint
ALTER TABLE stock_transfer_lines ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_transfer_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_transfer_lines TO varchasv_app;



ALTER TABLE "loyalty_members" ADD COLUMN "birthday" date;--> statement-breakpoint
ALTER TABLE "loyalty_members" ADD COLUMN "anniversary" date;


CREATE TABLE "salesman_commission_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(60) NOT NULL,
	"kind" varchar(10) NOT NULL,
	"match" text,
	"item_id" uuid,
	"mrp_from" numeric(12, 2),
	"mrp_to" numeric(12, 2),
	"rate_pct" numeric(5, 2) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD CONSTRAINT "salesman_commission_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD CONSTRAINT "salesman_commission_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD CONSTRAINT "salesman_commission_rules_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE salesman_commission_rules ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON salesman_commission_rules USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON salesman_commission_rules TO varchasv_app;



CREATE TABLE "employee_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"period" varchar(20) NOT NULL,
	"reviewed_on" date NOT NULL,
	"rating" integer NOT NULL,
	"strengths" text,
	"improvements" text,
	"reviewer_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employee_reviews" ADD CONSTRAINT "employee_reviews_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_reviews" ADD CONSTRAINT "employee_reviews_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_reviews" ADD CONSTRAINT "employee_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "employee_reviews_employee" ON "employee_reviews" USING btree ("tenant_id","employee_id","reviewed_on");--> statement-breakpoint
ALTER TABLE employee_reviews ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON employee_reviews USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_reviews TO varchasv_app;



CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_messages_pair" ON "chat_messages" USING btree ("tenant_id","from_user_id","to_user_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_messages_unread" ON "chat_messages" USING btree ("tenant_id","to_user_id","read_at");--> statement-breakpoint
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON chat_messages USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON chat_messages TO varchasv_app;



-- The stock ledger is append-only. A trigger already refuses changes; the application role should not hold the privilege either.
REVOKE UPDATE, DELETE, TRUNCATE ON stock_ledger FROM varchasv_app;



ALTER TABLE "audit_log" ADD COLUMN "request_id" varchar(64);


CREATE TABLE "change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"kind" varchar(20) NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_name" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"decision_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "bank_change_approval" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_requests" ADD CONSTRAINT "change_requests_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "change_requests_status" ON "change_requests" USING btree ("tenant_id","status","created_at");--> statement-breakpoint
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON change_requests USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON change_requests TO varchasv_app;



-- Owners and admins hold the new right to approve bank detail changes; other roles do not.
UPDATE roles
   SET permissions = ARRAY(SELECT DISTINCT p FROM unnest(permissions || ARRAY['special.approveBankChange']) AS p ORDER BY p)
 WHERE key IN ('owner', 'admin');



CREATE TABLE "repair_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"received_on" date NOT NULL,
	"customer_name" varchar(80) NOT NULL,
	"customer_phone" varchar(10),
	"item_description" text NOT NULL,
	"complaint" text,
	"diagnosis" text,
	"warranty" boolean DEFAULT false NOT NULL,
	"estimate" numeric(18, 2),
	"deposit" numeric(18, 2) DEFAULT '0' NOT NULL,
	"spares" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"final_charge" numeric(18, 2),
	"status" varchar(12) DEFAULT 'received' NOT NULL,
	"promised_on" date,
	"delivered_on" date,
	"reason" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "repair_jobs_number" ON "repair_jobs" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "repair_jobs_status" ON "repair_jobs" USING btree ("company_id","status");--> statement-breakpoint
ALTER TABLE repair_jobs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON repair_jobs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON repair_jobs TO varchasv_app;



ALTER TABLE "accounts" ADD COLUMN "udyam_number" varchar(19);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "msme_class" varchar(6);


CREATE TABLE "consignee_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"settlement_days" integer DEFAULT 30 NOT NULL,
	"discrepancy_owner" varchar(80),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD CONSTRAINT "consignee_terms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD CONSTRAINT "consignee_terms_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD CONSTRAINT "consignee_terms_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "consignee_terms_customer" ON "consignee_terms" USING btree ("company_id","customer_id");--> statement-breakpoint
ALTER TABLE consignee_terms ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON consignee_terms USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON consignee_terms TO varchasv_app;



ALTER TABLE "sales_invoices" ADD COLUMN "cartons" integer;


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



-- A machine's serial is looked up whether or not it is switched on, so a serial cannot be registered twice; the caller decides what to do with a switched-off one.
DROP FUNCTION IF EXISTS attendance_device_by_serial(text);--> statement-breakpoint
CREATE OR REPLACE FUNCTION attendance_device_by_serial(p_serial text)
  RETURNS TABLE (id uuid, tenant_id uuid, active boolean)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT d.id, d.tenant_id, d.active FROM attendance_devices d JOIN tenants t ON t.id = d.tenant_id
    WHERE upper(d.serial) = upper(p_serial) AND t.status = 'active'
  $$;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION attendance_device_by_serial(text) TO varchasv_app;



ALTER TABLE "schemes" ADD COLUMN "weekdays" jsonb;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "from_time" char(5);--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "to_time" char(5);--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "branch_ids" jsonb;


CREATE TABLE "week_off_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"kind" varchar(8) NOT NULL,
	"note" varchar(200),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "weekly_offs" jsonb;--> statement-breakpoint
ALTER TABLE "week_off_changes" ADD CONSTRAINT "week_off_changes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "week_off_changes" ADD CONSTRAINT "week_off_changes_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "week_off_changes_once" ON "week_off_changes" USING btree ("employee_id","date");--> statement-breakpoint
ALTER TABLE week_off_changes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON week_off_changes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON week_off_changes TO varchasv_app;



ALTER TABLE "accounts" ADD COLUMN "merged_into_id" uuid;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "merged_into_id" uuid;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_merged_into_id_accounts_id_fk" FOREIGN KEY ("merged_into_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_merged_into_id_items_id_fk" FOREIGN KEY ("merged_into_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;


CREATE TABLE "tds_challans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"paid_on" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"account_id" uuid NOT NULL,
	"bsr_code" char(7) NOT NULL,
	"challan_serial" varchar(8) NOT NULL,
	"voucher_id" uuid,
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tds_deductions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"deductee_id" uuid NOT NULL,
	"section" varchar(10) NOT NULL,
	"date" date NOT NULL,
	"base" numeric(18, 2) NOT NULL,
	"taxable_base" numeric(18, 2) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"tds" numeric(18, 2) NOT NULL,
	"no_pan" boolean DEFAULT false NOT NULL,
	"voucher_id" uuid,
	"challan_id" uuid,
	"note" varchar(200),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_challans" ADD CONSTRAINT "tds_challans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_deductee_id_accounts_id_fk" FOREIGN KEY ("deductee_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_deductions" ADD CONSTRAINT "tds_deductions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tds_challans_date" ON "tds_challans" USING btree ("company_id","paid_on");--> statement-breakpoint
CREATE INDEX "tds_deductions_date" ON "tds_deductions" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "tds_deductions_payee" ON "tds_deductions" USING btree ("deductee_id","section");--> statement-breakpoint
ALTER TABLE tds_deductions ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tds_deductions USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tds_deductions TO varchasv_app;--> statement-breakpoint
ALTER TABLE tds_challans ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tds_challans USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tds_challans TO varchasv_app;



CREATE TABLE "backup_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trigger" varchar(8) NOT NULL,
	"status" varchar(8) NOT NULL,
	"filename" varchar(80),
	"bytes" integer,
	"table_count" integer,
	"row_count" integer,
	"sha256" char(64),
	"sent_to" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"error" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "backup_settings" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"frequency" varchar(8) DEFAULT 'weekly' NOT NULL,
	"hour" integer DEFAULT 2 NOT NULL,
	"weekday" integer DEFAULT 0 NOT NULL,
	"recipients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"passphrase_enc" text,
	"next_run_at" timestamp with time zone,
	"last_run_at" timestamp with time zone,
	"last_ok_at" timestamp with time zone,
	"last_error" varchar(200),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "backup_runs" ADD CONSTRAINT "backup_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backup_settings" ADD CONSTRAINT "backup_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "backup_runs_when" ON "backup_runs" USING btree ("tenant_id","started_at");--> statement-breakpoint
ALTER TABLE backup_settings ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON backup_settings USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON backup_settings TO varchasv_app;--> statement-breakpoint
ALTER TABLE backup_runs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON backup_runs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON backup_runs TO varchasv_app;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a backup due.
CREATE OR REPLACE FUNCTION due_backups(p_now timestamptz)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT s.tenant_id FROM backup_settings s
    JOIN tenants t ON t.id = s.tenant_id AND t.status = 'active'
    WHERE s.enabled AND s.next_run_at IS NOT NULL AND s.next_run_at <= p_now
    ORDER BY s.next_run_at LIMIT 50
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_backups(timestamptz) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_backups(timestamptz) TO varchasv_app;



CREATE TABLE "scheduled_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"entity" varchar(10) NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_name" text NOT NULL,
	"field" varchar(20) NOT NULL,
	"value" varchar(40),
	"previous" varchar(40),
	"effective_from" date NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp with time zone,
	"error" varchar(120),
	"note" varchar(200),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scheduled_changes" ADD CONSTRAINT "scheduled_changes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_changes" ADD CONSTRAINT "scheduled_changes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scheduled_changes_due" ON "scheduled_changes" USING btree ("status","effective_from");--> statement-breakpoint
CREATE INDEX "scheduled_changes_entity" ON "scheduled_changes" USING btree ("tenant_id","entity","entity_id");--> statement-breakpoint
ALTER TABLE scheduled_changes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON scheduled_changes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON scheduled_changes TO varchasv_app;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a change due.
CREATE OR REPLACE FUNCTION due_scheduled_changes(p_today date)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT c.tenant_id FROM scheduled_changes c
    JOIN tenants t ON t.id = c.tenant_id AND t.status = 'active'
    WHERE c.status = 'pending' AND c.effective_from <= p_today
    LIMIT 200
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_scheduled_changes(date) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_scheduled_changes(date) TO varchasv_app;



CREATE TABLE "sync_rejections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"device_id" uuid NOT NULL,
	"op_id" varchar(64) NOT NULL,
	"kind" varchar(40),
	"error" varchar(60) NOT NULL,
	"payload" jsonb,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"note" varchar(200),
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sync_rejections" ADD CONSTRAINT "sync_rejections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_rejections" ADD CONSTRAINT "sync_rejections_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_rejections" ADD CONSTRAINT "sync_rejections_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sync_rejections_once" ON "sync_rejections" USING btree ("device_id","op_id");--> statement-breakpoint
CREATE INDEX "sync_rejections_open" ON "sync_rejections" USING btree ("tenant_id","status");--> statement-breakpoint
ALTER TABLE sync_rejections ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON sync_rejections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON sync_rejections TO varchasv_app;



CREATE TABLE "item_barcodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"code" varchar(40) NOT NULL,
	"kind" varchar(10) DEFAULT 'alternate' NOT NULL,
	"supplier_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "item_barcodes" ADD CONSTRAINT "item_barcodes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_barcodes" ADD CONSTRAINT "item_barcodes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_barcodes" ADD CONSTRAINT "item_barcodes_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_barcodes" ADD CONSTRAINT "item_barcodes_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_barcodes_code" ON "item_barcodes" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "item_barcodes_item" ON "item_barcodes" USING btree ("item_id");--> statement-breakpoint
ALTER TABLE item_barcodes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON item_barcodes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON item_barcodes TO varchasv_app;



ALTER TABLE "schemes" ADD COLUMN "priority" integer;


ALTER TABLE "pos_settings" ADD COLUMN "loyalty_slabs" jsonb;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_min_redeem" integer DEFAULT 0 NOT NULL;


CREATE TABLE "stock_losses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(24) NOT NULL,
	"date" date NOT NULL,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"reason" varchar(12) NOT NULL,
	"note" varchar(300),
	"file_id" uuid,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"journal_id" uuid,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"decision_note" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "loss_approval_limit" numeric(18, 2) DEFAULT '2000' NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_journal_id_stock_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."stock_journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_losses" ADD CONSTRAINT "stock_losses_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_losses_number" ON "stock_losses" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "stock_losses_status" ON "stock_losses" USING btree ("tenant_id","status");--> statement-breakpoint
ALTER TABLE stock_losses ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_losses USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_losses TO varchasv_app;



ALTER TABLE "repair_jobs" ADD COLUMN "deposit_voucher_id" uuid;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "settle_voucher_id" uuid;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_deposit_voucher_id_vouchers_id_fk" FOREIGN KEY ("deposit_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD CONSTRAINT "repair_jobs_settle_voucher_id_vouchers_id_fk" FOREIGN KEY ("settle_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;


ALTER TABLE "pos_bills" ADD COLUMN "billed_at" timestamp with time zone;


CREATE TABLE "close_signoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"key" varchar(30) NOT NULL,
	"note" varchar(200),
	"signed_by" uuid,
	"signed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "month_closes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"closed_by" uuid,
	"closed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reopened_at" timestamp with time zone,
	"reopen_reason" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "report_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(7) NOT NULL,
	"kind" varchar(20) NOT NULL,
	"version" integer NOT NULL,
	"filters" jsonb NOT NULL,
	"data" jsonb NOT NULL,
	"taken_by" uuid,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD COLUMN "variance_signed_by" uuid;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD COLUMN "variance_signed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD COLUMN "variance_note" varchar(200);--> statement-breakpoint
ALTER TABLE "close_signoffs" ADD CONSTRAINT "close_signoffs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_signoffs" ADD CONSTRAINT "close_signoffs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_signoffs" ADD CONSTRAINT "close_signoffs_signed_by_users_id_fk" FOREIGN KEY ("signed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "month_closes" ADD CONSTRAINT "month_closes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "month_closes" ADD CONSTRAINT "month_closes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "month_closes" ADD CONSTRAINT "month_closes_closed_by_users_id_fk" FOREIGN KEY ("closed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_snapshots" ADD CONSTRAINT "report_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_snapshots" ADD CONSTRAINT "report_snapshots_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_snapshots" ADD CONSTRAINT "report_snapshots_taken_by_users_id_fk" FOREIGN KEY ("taken_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "close_signoffs_once" ON "close_signoffs" USING btree ("company_id","period","key");--> statement-breakpoint
CREATE UNIQUE INDEX "month_closes_once" ON "month_closes" USING btree ("company_id","period");--> statement-breakpoint
CREATE UNIQUE INDEX "report_snapshots_version" ON "report_snapshots" USING btree ("company_id","period","kind","version");--> statement-breakpoint
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_variance_signed_by_users_id_fk" FOREIGN KEY ("variance_signed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE close_signoffs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON close_signoffs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON close_signoffs TO varchasv_app;--> statement-breakpoint
ALTER TABLE month_closes ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON month_closes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON month_closes TO varchasv_app;--> statement-breakpoint
ALTER TABLE report_snapshots ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON report_snapshots USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT ON report_snapshots TO varchasv_app;



CREATE TABLE "tcs_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"section" varchar(20) NOT NULL,
	"date" date NOT NULL,
	"base" numeric(18, 2) NOT NULL,
	"rate" numeric(5, 2) NOT NULL,
	"tcs" numeric(18, 2) NOT NULL,
	"no_pan" boolean DEFAULT false NOT NULL,
	"voucher_id" uuid,
	"challan_id" uuid,
	"note" varchar(200),
	"status" varchar(12) DEFAULT 'posted' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tds_challans" ADD COLUMN "kind" varchar(3) DEFAULT 'tds' NOT NULL;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_collections" ADD CONSTRAINT "tcs_collections_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tcs_collections_date" ON "tcs_collections" USING btree ("company_id","date");--> statement-breakpoint
ALTER TABLE tcs_collections ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tcs_collections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tcs_collections TO varchasv_app;



CREATE TABLE "gstr2b_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(6) NOT NULL,
	"gstin" char(15),
	"rows" integer NOT NULL,
	"imported_by" uuid,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gstr2b_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"import_id" uuid NOT NULL,
	"ctin" char(15) NOT NULL,
	"supplier_name" varchar(120),
	"kind" varchar(8) DEFAULT 'invoice' NOT NULL,
	"doc_no" varchar(40) NOT NULL,
	"doc_date" date NOT NULL,
	"taxable" numeric(18, 2) NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"itc_available" boolean DEFAULT true NOT NULL,
	"reason" varchar(120),
	"bill_id" uuid,
	"match" varchar(12) DEFAULT 'unmatched' NOT NULL,
	"diff" jsonb,
	"decision" varchar(10),
	"decision_note" varchar(200),
	"decided_by" uuid
);
--> statement-breakpoint
ALTER TABLE "gst_settings" ADD COLUMN "qrmp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD CONSTRAINT "gstr2b_imports_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD CONSTRAINT "gstr2b_imports_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD CONSTRAINT "gstr2b_imports_imported_by_users_id_fk" FOREIGN KEY ("imported_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_import_id_gstr2b_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."gstr2b_imports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD CONSTRAINT "gstr2b_rows_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gstr2b_imports_period" ON "gstr2b_imports" USING btree ("company_id","period");--> statement-breakpoint
CREATE INDEX "gstr2b_rows_import" ON "gstr2b_rows" USING btree ("import_id");--> statement-breakpoint
CREATE INDEX "gstr2b_rows_doc" ON "gstr2b_rows" USING btree ("ctin","doc_no");--> statement-breakpoint
ALTER TABLE gstr2b_imports ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gstr2b_imports USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gstr2b_imports TO varchasv_app;--> statement-breakpoint
ALTER TABLE gstr2b_rows ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gstr2b_rows USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gstr2b_rows TO varchasv_app;



CREATE TABLE "post_dated_cheques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"direction" varchar(8) NOT NULL,
	"party_id" uuid NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"cheque_no" varchar(12) NOT NULL,
	"drawn_on" varchar(60),
	"cheque_date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"voucher_id" uuid,
	"note" varchar(200),
	"settled_on" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_party_id_accounts_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_bank_account_id_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_dated_cheques" ADD CONSTRAINT "post_dated_cheques_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pdc_status_date" ON "post_dated_cheques" USING btree ("company_id","status","cheque_date");--> statement-breakpoint
ALTER TABLE post_dated_cheques ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON post_dated_cheques USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON post_dated_cheques TO varchasv_app;



CREATE TABLE "stock_writedowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(24) NOT NULL,
	"as_of" date NOT NULL,
	"basis" jsonb NOT NULL,
	"lines" jsonb NOT NULL,
	"required" numeric(18, 2) NOT NULL,
	"held" numeric(18, 2) NOT NULL,
	"change" numeric(18, 2) NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"note" varchar(200),
	"voucher_id" uuid,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_writedowns" ADD CONSTRAINT "stock_writedowns_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_writedowns_number" ON "stock_writedowns" USING btree ("company_id","number");--> statement-breakpoint
ALTER TABLE stock_writedowns ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_writedowns USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_writedowns TO varchasv_app;



CREATE TABLE "access_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"started_by" uuid,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"members" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "related_party" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "step_up_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "access_reviews" ADD CONSTRAINT "access_reviews_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_reviews" ADD CONSTRAINT "access_reviews_started_by_users_id_fk" FOREIGN KEY ("started_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE access_reviews ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON access_reviews USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON access_reviews TO varchasv_app;



CREATE TABLE "recon_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"item_id" uuid,
	"action" varchar(20) NOT NULL,
	"detail" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"by" uuid,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recon_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"side" varchar(6) NOT NULL,
	"ref" varchar(60) DEFAULT '' NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"description" varchar(160),
	"source_voucher_id" uuid,
	"status" varchar(12) DEFAULT 'unmatched' NOT NULL,
	"group_id" uuid,
	"rule" varchar(14),
	"matched_by" varchar(6),
	"reason_code" varchar(20),
	"owner_id" uuid,
	"note" varchar(200),
	"evidence_file_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recon_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(20) NOT NULL,
	"party_id" uuid,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"rules" jsonb NOT NULL,
	"their_closing" numeric(18, 2),
	"status" varchar(8) DEFAULT 'open' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "recon_writeoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"run_id" uuid NOT NULL,
	"item_ids" jsonb NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"reason_code" varchar(20) NOT NULL,
	"note" varchar(200),
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"requested_by" uuid,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"voucher_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recon_events" ADD CONSTRAINT "recon_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_events" ADD CONSTRAINT "recon_events_run_id_recon_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."recon_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_events" ADD CONSTRAINT "recon_events_by_users_id_fk" FOREIGN KEY ("by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_items" ADD CONSTRAINT "recon_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_items" ADD CONSTRAINT "recon_items_run_id_recon_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."recon_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_items" ADD CONSTRAINT "recon_items_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_party_id_accounts_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_runs" ADD CONSTRAINT "recon_runs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_run_id_recon_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."recon_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon_writeoffs" ADD CONSTRAINT "recon_writeoffs_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recon_events_run" ON "recon_events" USING btree ("run_id","id");--> statement-breakpoint
CREATE INDEX "recon_items_run" ON "recon_items" USING btree ("run_id","status");--> statement-breakpoint
CREATE INDEX "recon_runs_company" ON "recon_runs" USING btree ("company_id","status");--> statement-breakpoint
ALTER TABLE recon_runs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_runs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON recon_runs TO varchasv_app;--> statement-breakpoint
ALTER TABLE recon_items ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_items USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON recon_items TO varchasv_app;--> statement-breakpoint
ALTER TABLE recon_events ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_events USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT ON recon_events TO varchasv_app;--> statement-breakpoint
GRANT USAGE ON SEQUENCE recon_events_id_seq TO varchasv_app;--> statement-breakpoint
ALTER TABLE recon_writeoffs ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON recon_writeoffs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON recon_writeoffs TO varchasv_app;



CREATE TABLE "duty_scrips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"scheme" varchar(8) NOT NULL,
	"number" varchar(30) NOT NULL,
	"issued_on" date NOT NULL,
	"valid_until" date,
	"amount" numeric(18, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "export_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"shipping_bill_no" varchar(20),
	"shipping_bill_date" date,
	"port_code" varchar(8),
	"fob_value" numeric(18, 2),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"brc_no" varchar(30),
	"brc_date" date,
	"realised_amount" numeric(18, 2) DEFAULT '0' NOT NULL,
	"note" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incentive_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"scheme" varchar(8) NOT NULL,
	"hsn_prefix" varchar(8) NOT NULL,
	"rate_pct" numeric(6, 3) NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"adjustments" jsonb NOT NULL,
	"baseline" jsonb NOT NULL,
	"note" varchar(300),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scrip_uses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"scrip_id" uuid NOT NULL,
	"used_on" date NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"purpose" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "duty_scrips" ADD CONSTRAINT "duty_scrips_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "duty_scrips" ADD CONSTRAINT "duty_scrips_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "export_shipments" ADD CONSTRAINT "export_shipments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "export_shipments" ADD CONSTRAINT "export_shipments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "export_shipments" ADD CONSTRAINT "export_shipments_invoice_id_sales_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."sales_invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incentive_rates" ADD CONSTRAINT "incentive_rates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incentive_rates" ADD CONSTRAINT "incentive_rates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrip_uses" ADD CONSTRAINT "scrip_uses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrip_uses" ADD CONSTRAINT "scrip_uses_scrip_id_duty_scrips_id_fk" FOREIGN KEY ("scrip_id") REFERENCES "public"."duty_scrips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "duty_scrips_number" ON "duty_scrips" USING btree ("company_id","scheme","number");--> statement-breakpoint
CREATE UNIQUE INDEX "export_shipments_invoice" ON "export_shipments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "incentive_rates_lookup" ON "incentive_rates" USING btree ("company_id","scheme","hsn_prefix");--> statement-breakpoint
CREATE UNIQUE INDEX "scenarios_name" ON "scenarios" USING btree ("company_id",lower("name"));
--> statement-breakpoint
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON scenarios USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON scenarios TO varchasv_app;
--> statement-breakpoint
ALTER TABLE export_shipments ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON export_shipments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON export_shipments TO varchasv_app;
--> statement-breakpoint
ALTER TABLE duty_scrips ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON duty_scrips USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON duty_scrips TO varchasv_app;
--> statement-breakpoint
ALTER TABLE scrip_uses ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON scrip_uses USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON scrip_uses TO varchasv_app;
--> statement-breakpoint
ALTER TABLE incentive_rates ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON incentive_rates USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON incentive_rates TO varchasv_app;



CREATE TABLE "loyalty_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"bill_id" uuid,
	"earned" integer NOT NULL,
	"left" integer NOT NULL,
	"earned_on" date NOT NULL,
	"expires_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_validity_days" integer;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_discounted_bills" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_discounted_items" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_brands" text[];--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "loyalty_exclude_categories" text[];--> statement-breakpoint
ALTER TABLE "loyalty_lots" ADD CONSTRAINT "loyalty_lots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_lots" ADD CONSTRAINT "loyalty_lots_member_id_loyalty_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."loyalty_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loyalty_lots_member" ON "loyalty_lots" USING btree ("member_id","expires_on");
--> statement-breakpoint
ALTER TABLE loyalty_lots ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON loyalty_lots USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON loyalty_lots TO varchasv_app;



ALTER TABLE "schemes" ADD COLUMN "confirm_before_apply" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "allow_with_gift_vouchers" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "allow_with_customer_discount" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "allow_returns" boolean DEFAULT true NOT NULL;


ALTER TABLE "salesman_commission_rules" ALTER COLUMN "kind" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "helper_id" uuid;--> statement-breakpoint
ALTER TABLE "pos_settings" ADD COLUMN "helper_share_pct" numeric(5, 2) DEFAULT '30' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "helper_id" uuid;--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD COLUMN "band_from" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "salesman_commission_rules" ADD COLUMN "band_to" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD CONSTRAINT "pos_bill_lines_helper_id_employees_id_fk" FOREIGN KEY ("helper_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_helper_id_employees_id_fk" FOREIGN KEY ("helper_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;


CREATE TABLE "comm_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"contact" varchar(120) NOT NULL,
	"channel" varchar(10) NOT NULL,
	"marketing_opt_in" boolean DEFAULT false NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
	"source" varchar(30),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comm_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"event" varchar(30) NOT NULL,
	"channel" varchar(10) NOT NULL,
	"category" varchar(12) NOT NULL,
	"language" varchar(5) NOT NULL,
	"to" varchar(120) NOT NULL,
	"account_id" uuid,
	"subject" varchar(120),
	"body" text NOT NULL,
	"status" varchar(10) DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dedupe_key" varchar(120),
	"provider" varchar(20),
	"provider_id" varchar(120),
	"cost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"error" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "comm_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"cost_whatsapp_utility" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_whatsapp_marketing" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_sms" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_email" numeric(8, 2) DEFAULT '0' NOT NULL,
	"cost_push" numeric(8, 2) DEFAULT '0' NOT NULL,
	"owner_phone" varchar(10),
	"owner_email" varchar(120),
	"max_attempts" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comm_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"event" varchar(30) NOT NULL,
	"channel" varchar(10) NOT NULL,
	"language" varchar(5) DEFAULT 'en' NOT NULL,
	"category" varchar(12) DEFAULT 'utility' NOT NULL,
	"subject" varchar(120),
	"body" text NOT NULL,
	"archived" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comm_consents" ADD CONSTRAINT "comm_consents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_consents" ADD CONSTRAINT "comm_consents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_outbox" ADD CONSTRAINT "comm_outbox_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_settings" ADD CONSTRAINT "comm_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_settings" ADD CONSTRAINT "comm_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_templates" ADD CONSTRAINT "comm_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_templates" ADD CONSTRAINT "comm_templates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "comm_consents_key" ON "comm_consents" USING btree ("company_id","contact","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "comm_outbox_dedupe" ON "comm_outbox" USING btree ("company_id","dedupe_key") WHERE "comm_outbox"."dedupe_key" is not null;--> statement-breakpoint
CREATE INDEX "comm_outbox_due" ON "comm_outbox" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX "comm_outbox_company" ON "comm_outbox" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "comm_settings_company" ON "comm_settings" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "comm_templates_key" ON "comm_templates" USING btree ("company_id","event","channel","language");--> statement-breakpoint
ALTER TABLE comm_templates ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_templates USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_templates TO varchasv_app;--> statement-breakpoint
ALTER TABLE comm_consents ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_consents USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_consents TO varchasv_app;--> statement-breakpoint
ALTER TABLE comm_outbox ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_outbox USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_outbox TO varchasv_app;--> statement-breakpoint
ALTER TABLE comm_settings ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON comm_settings USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON comm_settings TO varchasv_app;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a message waiting to go.
CREATE OR REPLACE FUNCTION due_comm_tenants(p_now timestamptz)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT o.tenant_id FROM comm_outbox o
    JOIN tenants t ON t.id = o.tenant_id AND t.status = 'active'
    WHERE o.status = 'queued' AND o.next_attempt_at <= p_now
    LIMIT 200
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_comm_tenants(timestamptz) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_comm_tenants(timestamptz) TO varchasv_app;



ALTER TABLE "goods_receipt_lines" ADD COLUMN "challan_qty" numeric(18, 4);--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "short_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "damaged_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "hold_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "returned_qty" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN "quality_hold" boolean DEFAULT false NOT NULL;


ALTER TABLE "stock_counts" ADD COLUMN "verify_only" boolean DEFAULT false NOT NULL;


ALTER TABLE "expense_categories" ADD COLUMN "per_km_rate" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "expense_categories" ADD COLUMN "daily_allowance" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "expense_lines" ADD COLUMN "travel" jsonb;


CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"date" date NOT NULL,
	"customer_name" varchar(80) NOT NULL,
	"customer_phone" varchar(10),
	"kind" varchar(10) DEFAULT 'other' NOT NULL,
	"note" text NOT NULL,
	"follow_up_on" date,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"outcome" text,
	"repair_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "gst_rate" numeric(5, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "gst_amount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_repair_id_repair_jobs_id_fk" FOREIGN KEY ("repair_id") REFERENCES "public"."repair_jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inquiries_company_status" ON "inquiries" USING btree ("company_id","status","follow_up_on");
--> statement-breakpoint
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON inquiries USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON inquiries TO varchasv_app;



ALTER TABLE "consignee_terms" ADD COLUMN "statement_frequency" varchar(8);--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD COLUMN "statement_email" varchar(120);--> statement-breakpoint
ALTER TABLE "consignee_terms" ADD COLUMN "statement_last_sent" date;--> statement-breakpoint
-- The scheduler runs outside any business: it may only learn which businesses have a consignee statement scheduled.
CREATE OR REPLACE FUNCTION due_consignee_tenants(p_today date)
  RETURNS TABLE (tenant_id uuid)
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT DISTINCT c.tenant_id FROM consignee_terms c
    JOIN tenants t ON t.id = c.tenant_id AND t.status = 'active'
    WHERE c.statement_frequency IS NOT NULL AND c.statement_email IS NOT NULL
      AND (c.statement_last_sent IS NULL OR c.statement_last_sent + (CASE c.statement_frequency WHEN 'weekly' THEN 7 ELSE 30 END) <= p_today)
    LIMIT 200
  $$;--> statement-breakpoint
REVOKE ALL ON FUNCTION due_consignee_tenants(date) FROM PUBLIC;--> statement-breakpoint
GRANT EXECUTE ON FUNCTION due_consignee_tenants(date) TO varchasv_app;



CREATE TABLE "margin_bands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"from_rate" numeric(12, 2) NOT NULL,
	"markup_pct" numeric(7, 2) NOT NULL,
	"markdown1_pct" numeric(5, 2) DEFAULT '0' NOT NULL,
	"markdown2_pct" numeric(5, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "default_qty" numeric(18, 4);--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "short_code" varchar(12);--> statement-breakpoint
ALTER TABLE "margin_bands" ADD CONSTRAINT "margin_bands_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "margin_bands" ADD CONSTRAINT "margin_bands_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "margin_bands_from" ON "margin_bands" USING btree ("company_id","from_rate");--> statement-breakpoint
CREATE UNIQUE INDEX "items_company_short_code" ON "items" USING btree ("company_id",upper("short_code")) WHERE "items"."short_code" is not null;--> statement-breakpoint
ALTER TABLE margin_bands ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON margin_bands USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON margin_bands TO varchasv_app;



CREATE TABLE "relabels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"number" varchar(20) NOT NULL,
	"date" date NOT NULL,
	"reason" text NOT NULL,
	"changes" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "relabels" ADD CONSTRAINT "relabels_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relabels" ADD CONSTRAINT "relabels_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relabels" ADD CONSTRAINT "relabels_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "relabels_number" ON "relabels" USING btree ("company_id","number");
--> statement-breakpoint
ALTER TABLE relabels ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON relabels USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT ON relabels TO varchasv_app;



CREATE TABLE "doc_prints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"doc_type" varchar(20) NOT NULL,
	"doc_id" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_by" uuid
);
--> statement-breakpoint
ALTER TABLE "doc_prints" ADD CONSTRAINT "doc_prints_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doc_prints" ADD CONSTRAINT "doc_prints_last_by_users_id_fk" FOREIGN KEY ("last_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "doc_prints_doc" ON "doc_prints" USING btree ("tenant_id","doc_type","doc_id");--> statement-breakpoint
ALTER TABLE doc_prints ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON doc_prints USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON doc_prints TO varchasv_app;--> statement-breakpoint
-- Print and reprint rights: everyone who could view a module keeps the right to print its documents, and everyone who could edit keeps the right to
-- reprint them, so nothing stops working. Owners can now take them away per role. The sale-rate right goes to every role that could create sales.
UPDATE roles SET permissions = ARRAY(SELECT DISTINCT p FROM unnest(permissions || ARRAY(
    SELECT split_part(p2, '.', 1) || '.print' FROM unnest(permissions) AS p2 WHERE p2 LIKE '%.view'
  ) || ARRAY(
    SELECT split_part(p3, '.', 1) || '.reprint' FROM unnest(permissions) AS p3 WHERE p3 LIKE '%.edit'
  ) || ARRAY(
    SELECT 'special.changeSaleRate' FROM unnest(permissions) AS p4 WHERE p4 = 'sales.create'
  )) AS p ORDER BY p);



CREATE TABLE "process_locks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_type" varchar(30) NOT NULL,
	"locked_up_to" date NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "process_locks" ADD CONSTRAINT "process_locks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "process_locks" ADD CONSTRAINT "process_locks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "process_locks" ADD CONSTRAINT "process_locks_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "process_locks_doc" ON "process_locks" USING btree ("company_id","doc_type");
--> statement-breakpoint
ALTER TABLE process_locks ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON process_locks USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON process_locks TO varchasv_app;



CREATE TABLE "rate_update_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"input" jsonb NOT NULL,
	"summary" jsonb NOT NULL,
	"status" varchar(10) DEFAULT 'pending' NOT NULL,
	"requested_by" uuid,
	"decided_by" uuid,
	"decision_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "rate_update_requests" ADD CONSTRAINT "rate_update_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_update_requests" ADD CONSTRAINT "rate_update_requests_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_update_requests" ADD CONSTRAINT "rate_update_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_update_requests" ADD CONSTRAINT "rate_update_requests_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rate_update_requests_status" ON "rate_update_requests" USING btree ("company_id","status");
--> statement-breakpoint
ALTER TABLE rate_update_requests ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON rate_update_requests USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON rate_update_requests TO varchasv_app;



ALTER TABLE "scheduled_changes" ALTER COLUMN "entity" SET DATA TYPE varchar(16);--> statement-breakpoint
ALTER TABLE "scheduled_changes" ALTER COLUMN "value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "scheduled_changes" ALTER COLUMN "previous" SET DATA TYPE text;


CREATE TABLE "cash_commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"kind" varchar(8) NOT NULL,
	"direction" varchar(3) DEFAULT 'out' NOT NULL,
	"name" varchar(80) NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"first_date" date NOT NULL,
	"repeat" varchar(8) DEFAULT 'once' NOT NULL,
	"until" date,
	"note" varchar(200),
	"active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_allocation_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"basis" varchar(8) NOT NULL,
	"shares" jsonb,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cash_commitments" ADD CONSTRAINT "cash_commitments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_commitments" ADD CONSTRAINT "cash_commitments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_commitments" ADD CONSTRAINT "cash_commitments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocation_rules" ADD CONSTRAINT "expense_allocation_rules_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cash_commitments_company" ON "cash_commitments" USING btree ("company_id","active");--> statement-breakpoint
CREATE UNIQUE INDEX "expense_alloc_account" ON "expense_allocation_rules" USING btree ("company_id","account_id");
--> statement-breakpoint
ALTER TABLE cash_commitments ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON cash_commitments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON cash_commitments TO varchasv_app;
--> statement-breakpoint
ALTER TABLE expense_allocation_rules ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON expense_allocation_rules USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON expense_allocation_rules TO varchasv_app;



CREATE TABLE "gst_return_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"return_type" varchar(8) NOT NULL,
	"period" char(6) NOT NULL,
	"status" varchar(10) DEFAULT 'requested' NOT NULL,
	"payload_hash" char(64) NOT NULL,
	"summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"requested_by" uuid,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"note" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "itc_reversals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"rule" varchar(4) NOT NULL,
	"bill_id" uuid NOT NULL,
	"igst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"sgst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"cess" numeric(18, 2) DEFAULT '0' NOT NULL,
	"reversed_on" date NOT NULL,
	"voucher_id" uuid,
	"reclaimed_on" date,
	"reclaim_voucher_id" uuid,
	"note" varchar(200),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "gstr2b_imports_period";--> statement-breakpoint
ALTER TABLE "gst_settings" ADD COLUMN "approval_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gstr2b_imports" ADD COLUMN "source" varchar(2) DEFAULT '2b' NOT NULL;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD COLUMN "supplier_filed_1" boolean;--> statement-breakpoint
ALTER TABLE "gstr2b_rows" ADD COLUMN "supplier_filed_3b" boolean;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_return_approvals" ADD CONSTRAINT "gst_return_approvals_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_bill_id_purchase_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."purchase_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_reclaim_voucher_id_vouchers_id_fk" FOREIGN KEY ("reclaim_voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itc_reversals" ADD CONSTRAINT "itc_reversals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_return_approvals_period" ON "gst_return_approvals" USING btree ("company_id","return_type","period");--> statement-breakpoint
CREATE UNIQUE INDEX "itc_reversals_bill_rule" ON "itc_reversals" USING btree ("bill_id","rule");--> statement-breakpoint
CREATE INDEX "itc_reversals_company" ON "itc_reversals" USING btree ("company_id","reversed_on");--> statement-breakpoint
CREATE UNIQUE INDEX "gstr2b_imports_period" ON "gstr2b_imports" USING btree ("company_id","period","source");
--> statement-breakpoint
ALTER TABLE itc_reversals ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON itc_reversals USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON itc_reversals TO varchasv_app;
--> statement-breakpoint
ALTER TABLE gst_return_approvals ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gst_return_approvals USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gst_return_approvals TO varchasv_app;



CREATE TABLE "tds_section_map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"legacy_section" varchar(12) NOT NULL,
	"new_ref" varchar(40) NOT NULL,
	"payment_code" varchar(8),
	"note" varchar(200),
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tds_section_map" ADD CONSTRAINT "tds_section_map_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_section_map" ADD CONSTRAINT "tds_section_map_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tds_section_map" ADD CONSTRAINT "tds_section_map_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tds_section_map_legacy" ON "tds_section_map" USING btree ("company_id","legacy_section");
--> statement-breakpoint
ALTER TABLE tds_section_map ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON tds_section_map USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tds_section_map TO varchasv_app;



ALTER TABLE "pos_bill_lines" ADD COLUMN "commission_adj" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "apply_on_discounted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "inclusive_of_tax" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "schemes" ADD COLUMN "commission_basis" varchar(4) DEFAULT 'net' NOT NULL;


CREATE TABLE "branch_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"sale_rate" numeric(18, 2) NOT NULL,
	"starts_on" date,
	"ends_on" date,
	"weekdays" jsonb,
	"from_time" varchar(5),
	"to_time" varchar(5),
	"note" varchar(120),
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branch_prices" ADD CONSTRAINT "branch_prices_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "branch_prices_store_item" ON "branch_prices" USING btree ("warehouse_id","item_id");
--> statement-breakpoint
ALTER TABLE branch_prices ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON branch_prices USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON branch_prices TO varchasv_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION record_item_change_from_price() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO sync_changes (tenant_id, entity, entity_id) VALUES (COALESCE(NEW.tenant_id, OLD.tenant_id), 'item', COALESCE(NEW.item_id, OLD.item_id));
  RETURN NULL;
END $$;
--> statement-breakpoint
CREATE TRIGGER sync_branch_prices AFTER INSERT OR UPDATE OR DELETE ON branch_prices FOR EACH ROW EXECUTE FUNCTION record_item_change_from_price();



ALTER TABLE "repair_jobs" ADD COLUMN "source_kind" varchar(8);--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "source_id" uuid;--> statement-breakpoint
ALTER TABLE "repair_jobs" ADD COLUMN "source_number" varchar(30);


CREATE TABLE "item_serials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"serial" varchar(40) NOT NULL,
	"status" varchar(10) DEFAULT 'in_stock' NOT NULL,
	"warehouse_id" uuid,
	"received_on" date,
	"source_kind" varchar(8),
	"source_id" uuid,
	"sold_bill_id" uuid,
	"sold_on" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "track_serials" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_bill_lines" ADD COLUMN "serials" jsonb;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_sold_bill_id_pos_bills_id_fk" FOREIGN KEY ("sold_bill_id") REFERENCES "public"."pos_bills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_serials" ADD CONSTRAINT "item_serials_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "item_serials_unique" ON "item_serials" USING btree ("company_id","item_id",upper("serial"));--> statement-breakpoint
CREATE INDEX "item_serials_status" ON "item_serials" USING btree ("company_id","item_id","status");
--> statement-breakpoint
ALTER TABLE item_serials ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON item_serials USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON item_serials TO varchasv_app;



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



ALTER TABLE "pos_bills" ADD COLUMN "header_discount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "header_discounts" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "early_pay_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "early_pay_days" integer;


ALTER TABLE "sales_invoice_lines" ADD COLUMN "header_discount" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "pos_bills" DROP COLUMN "header_discount";


ALTER TABLE "memberships" ADD COLUMN "warehouse_scope" jsonb;


-- A delivery receipt or a STOP reply from a messaging provider arrives with no login. These two lookups say which business a provider message id,
-- or a contact, belongs to without opening the tables to anyone: they return only tenant ids.
CREATE OR REPLACE FUNCTION comm_tenant_by_provider_id(p_id text) RETURNS uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM comm_outbox WHERE provider_id = p_id LIMIT 1
$$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION comm_tenants_by_contact(p_to text) RETURNS SETOF uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT DISTINCT tenant_id FROM comm_outbox WHERE "to" = p_to
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION comm_tenant_by_provider_id(text) FROM PUBLIC;
--> statement-breakpoint
REVOKE ALL ON FUNCTION comm_tenants_by_contact(text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION comm_tenant_by_provider_id(text) TO varchasv_app;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION comm_tenants_by_contact(text) TO varchasv_app;



ALTER TABLE "comm_settings" ADD COLUMN "auto_events" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION comm_reminder_tenants() RETURNS SETOF uuid
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM comm_settings WHERE auto_events ? 'payment_reminders' OR auto_events ? 'approval_due'
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION comm_reminder_tenants() FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION comm_reminder_tenants() TO varchasv_app;



CREATE TABLE "gst_workpapers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"return_type" varchar(8) NOT NULL,
	"period" char(6) NOT NULL,
	"status" varchar(10) DEFAULT 'prepared' NOT NULL,
	"manual" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"figures_hash" char(64),
	"arn" varchar(20),
	"filed_on" date,
	"filed_by" uuid,
	"evidence_file_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_filed_by_users_id_fk" FOREIGN KEY ("filed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_workpapers" ADD CONSTRAINT "gst_workpapers_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_workpapers_period" ON "gst_workpapers" USING btree ("company_id","return_type","period");
--> statement-breakpoint
ALTER TABLE gst_workpapers ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON gst_workpapers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gst_workpapers TO varchasv_app;



ALTER TABLE "gst_settings" ADD COLUMN "filing_method" varchar(12) DEFAULT 'manual' NOT NULL;


CREATE TABLE "ledger_posting_defaults" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"role_key" varchar(40) NOT NULL,
	"account_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ledger_posting_defaults" ADD CONSTRAINT "ledger_posting_defaults_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_posting_defaults" ADD CONSTRAINT "ledger_posting_defaults_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_posting_defaults" ADD CONSTRAINT "ledger_posting_defaults_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ledger_posting_defaults_company_role" ON "ledger_posting_defaults" USING btree ("company_id","role_key");--> statement-breakpoint
CREATE INDEX "ledger_posting_defaults_tenant_idx" ON "ledger_posting_defaults" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE ledger_posting_defaults ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON ledger_posting_defaults USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON ledger_posting_defaults TO varchasv_app;



CREATE TABLE "tcs_section_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"section" varchar(20) NOT NULL,
	"enabled" boolean NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tcs_section_settings" ADD CONSTRAINT "tcs_section_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_section_settings" ADD CONSTRAINT "tcs_section_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tcs_section_settings" ADD CONSTRAINT "tcs_section_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tcs_section_settings_company_section" ON "tcs_section_settings" USING btree ("company_id","section");--> statement-breakpoint
CREATE INDEX "tcs_section_settings_tenant_idx" ON "tcs_section_settings" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE tcs_section_settings ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON tcs_section_settings USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON tcs_section_settings TO varchasv_app;



CREATE TABLE "packing_box_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"box_id" uuid NOT NULL,
	"actor_id" uuid,
	"operation" varchar(12) NOT NULL,
	"reason" text,
	"before_contents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"after_contents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packing_box_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"box_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packing_boxes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"code" varchar(40) NOT NULL,
	"status" varchar(8) DEFAULT 'open' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD CONSTRAINT "packing_box_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD CONSTRAINT "packing_box_events_box_id_packing_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."packing_boxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD CONSTRAINT "packing_box_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_lines" ADD CONSTRAINT "packing_box_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_lines" ADD CONSTRAINT "packing_box_lines_box_id_packing_boxes_id_fk" FOREIGN KEY ("box_id") REFERENCES "public"."packing_boxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_box_lines" ADD CONSTRAINT "packing_box_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "packing_box_events_box_created" ON "packing_box_events" USING btree ("box_id","created_at");--> statement-breakpoint
CREATE INDEX "packing_box_events_tenant_idx" ON "packing_box_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "packing_box_lines_box_item" ON "packing_box_lines" USING btree ("box_id","item_id");--> statement-breakpoint
CREATE INDEX "packing_box_lines_tenant_idx" ON "packing_box_lines" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "packing_boxes_company_code" ON "packing_boxes" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "packing_boxes_company_status" ON "packing_boxes" USING btree ("company_id","status","created_at");--> statement-breakpoint
CREATE INDEX "packing_boxes_tenant_idx" ON "packing_boxes" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE packing_box_lines ADD CONSTRAINT packing_box_lines_qty_positive CHECK (qty > 0);
--> statement-breakpoint
ALTER TABLE packing_boxes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON packing_boxes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON packing_boxes TO varchasv_app;
--> statement-breakpoint
ALTER TABLE packing_box_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON packing_box_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON packing_box_lines TO varchasv_app;
--> statement-breakpoint
ALTER TABLE packing_box_events ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON packing_box_events USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT ON packing_box_events TO varchasv_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION packing_box_events_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'packing_box_events is append-only';
END $$;
--> statement-breakpoint
CREATE TRIGGER packing_box_events_immutable BEFORE UPDATE OR DELETE ON packing_box_events
  FOR EACH ROW EXECUTE FUNCTION packing_box_events_immutable();



DROP INDEX "packing_box_events_box_created";--> statement-breakpoint
ALTER TABLE "packing_box_events" ADD COLUMN "sequence" integer;--> statement-breakpoint
DROP TRIGGER "packing_box_events_immutable" ON "packing_box_events";--> statement-breakpoint
WITH ranked_events AS (
  SELECT "id", row_number() OVER (PARTITION BY "box_id" ORDER BY "created_at", "id")::integer AS "sequence"
  FROM "packing_box_events"
)
UPDATE "packing_box_events" AS events SET "sequence" = ranked_events."sequence"
FROM ranked_events WHERE events."id" = ranked_events."id";--> statement-breakpoint
ALTER TABLE "packing_box_events" ALTER COLUMN "sequence" SET NOT NULL;--> statement-breakpoint
CREATE TRIGGER "packing_box_events_immutable" BEFORE UPDATE OR DELETE ON "packing_box_events"
  FOR EACH ROW EXECUTE FUNCTION packing_box_events_immutable();--> statement-breakpoint
CREATE UNIQUE INDEX "packing_box_events_box_sequence" ON "packing_box_events" USING btree ("box_id","sequence");



ALTER TABLE "goods_receipt_lines" ADD COLUMN "landed_cost_per_unit" numeric(18, 4) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ADD COLUMN "landed_cost_note" varchar(160);



CREATE TABLE "goods_receipt_landed_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"receipt_id" uuid NOT NULL,
	"description" varchar(120) NOT NULL,
	"source_document" varchar(120) NOT NULL,
	"gross_amount" numeric(18, 2) NOT NULL,
	"recoverable_gst" numeric(18, 2) DEFAULT '0' NOT NULL,
	"net_amount" numeric(18, 2) NOT NULL,
	"allocation_basis" varchar(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "goods_receipt_landed_charges_amounts_valid" CHECK (gross_amount > 0 AND recoverable_gst >= 0 AND recoverable_gst <= gross_amount AND net_amount = gross_amount - recoverable_gst),
	CONSTRAINT "goods_receipt_landed_charges_basis_valid" CHECK (allocation_basis IN ('direct', 'weight', 'volume', 'net_value', 'units'))
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_landed_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"charge_id" uuid NOT NULL,
	"receipt_line_id" uuid NOT NULL,
	"allocated_amount" numeric(18, 2) NOT NULL,
	CONSTRAINT "goods_receipt_landed_allocations_amount_positive" CHECK (allocated_amount > 0)
);
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_charges" ADD CONSTRAINT "goods_receipt_landed_charges_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_charges" ADD CONSTRAINT "goods_receipt_landed_charges_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_charges" ADD CONSTRAINT "goods_receipt_landed_charges_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_allocations" ADD CONSTRAINT "goods_receipt_landed_allocations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_allocations" ADD CONSTRAINT "goods_receipt_landed_allocations_charge_id_goods_receipt_landed_charges_id_fk" FOREIGN KEY ("charge_id") REFERENCES "public"."goods_receipt_landed_charges"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goods_receipt_landed_allocations" ADD CONSTRAINT "goods_receipt_landed_allocations_receipt_line_id_goods_receipt_lines_id_fk" FOREIGN KEY ("receipt_line_id") REFERENCES "public"."goods_receipt_lines"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "goods_receipt_landed_charges_receipt_idx" ON "goods_receipt_landed_charges" USING btree ("receipt_id");
--> statement-breakpoint
CREATE INDEX "goods_receipt_landed_charges_tenant_idx" ON "goods_receipt_landed_charges" USING btree ("tenant_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "goods_receipt_landed_allocations_charge_line" ON "goods_receipt_landed_allocations" USING btree ("charge_id","receipt_line_id");
--> statement-breakpoint
CREATE INDEX "goods_receipt_landed_allocations_tenant_idx" ON "goods_receipt_landed_allocations" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE goods_receipt_landed_charges ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON goods_receipt_landed_charges USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON goods_receipt_landed_charges TO varchasv_app;
--> statement-breakpoint
ALTER TABLE goods_receipt_landed_allocations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON goods_receipt_landed_allocations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON goods_receipt_landed_allocations TO varchasv_app;



CREATE TABLE "gst_compare_figures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(6) NOT NULL,
	"portal" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"final" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gstr1_amendments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"period" char(6) NOT NULL,
	"kind" varchar(4) NOT NULL,
	"ctin" char(15),
	"original_number" varchar(40),
	"original_date" date,
	"original_period" char(6),
	"number" varchar(40),
	"doc_date" date,
	"note_type" char(1),
	"pos" char(2) NOT NULL,
	"intra" boolean NOT NULL,
	"reverse_charge" boolean DEFAULT false NOT NULL,
	"invoice_type" varchar(5),
	"value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"lines" jsonb NOT NULL,
	"reason" varchar(200) NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gst_compare_figures" ADD CONSTRAINT "gst_compare_figures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_compare_figures" ADD CONSTRAINT "gst_compare_figures_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gst_compare_figures" ADD CONSTRAINT "gst_compare_figures_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "gst_compare_figures_period" ON "gst_compare_figures" USING btree ("company_id","period");--> statement-breakpoint
CREATE INDEX "gstr1_amendments_period" ON "gstr1_amendments" USING btree ("company_id","period");--> statement-breakpoint
ALTER TABLE "gstr1_amendments" ADD CONSTRAINT "gstr1_amendments_kind_valid" CHECK (kind IN ('b2b', 'cdn', 'b2cs'));
--> statement-breakpoint
ALTER TABLE gst_compare_figures ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON gst_compare_figures USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gst_compare_figures TO varchasv_app;
--> statement-breakpoint
ALTER TABLE gstr1_amendments ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON gstr1_amendments USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON gstr1_amendments TO varchasv_app;



ALTER TABLE "companies" ADD COLUMN "purchase_approval_limit" numeric(18, 2);--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approval_status" varchar(10) DEFAULT 'approved' NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "approval_note" varchar(200);--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;


ALTER TABLE "purchase_returns" ADD COLUMN "kind" varchar(8) DEFAULT 'goods' NOT NULL;


CREATE TABLE "supplier_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"rate" numeric(18, 4) NOT NULL,
	"extra_cost" numeric(18, 4) DEFAULT '0' NOT NULL,
	"min_qty" numeric(18, 4),
	"lead_days" integer,
	"quoted_on" date NOT NULL,
	"valid_until" date,
	"note" varchar(200),
	"archived" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_supplier_id_accounts_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "supplier_quotes_item" ON "supplier_quotes" USING btree ("company_id","item_id");--> statement-breakpoint
CREATE INDEX "supplier_quotes_tenant_idx" ON "supplier_quotes" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD CONSTRAINT "supplier_quotes_amounts_valid" CHECK (rate >= 0 AND extra_cost >= 0);
--> statement-breakpoint
ALTER TABLE supplier_quotes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON supplier_quotes USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON supplier_quotes TO varchasv_app;



CREATE TABLE "recurring_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"type" varchar(8) NOT NULL,
	"narration" varchar(200),
	"lines" jsonb NOT NULL,
	"frequency" varchar(10) NOT NULL,
	"day_of_month" integer NOT NULL,
	"next_on" date NOT NULL,
	"ends_on" date,
	"last_run_on" date,
	"active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recurring_vouchers_due" ON "recurring_vouchers" USING btree ("company_id","active","next_on");--> statement-breakpoint
CREATE INDEX "recurring_vouchers_tenant_idx" ON "recurring_vouchers" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "recurring_vouchers" ADD CONSTRAINT "recurring_vouchers_valid" CHECK (type IN ('journal', 'payment', 'receipt', 'contra') AND frequency IN ('monthly', 'quarterly', 'yearly') AND day_of_month BETWEEN 1 AND 31);
--> statement-breakpoint
ALTER TABLE recurring_vouchers ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON recurring_vouchers USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON recurring_vouchers TO varchasv_app;



CREATE TABLE "stock_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"order_line_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"released" boolean DEFAULT false NOT NULL,
	"reserved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_order_line_id_sales_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."sales_order_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_reserved_by_users_id_fk" FOREIGN KEY ("reserved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stock_reservations_line" ON "stock_reservations" USING btree ("order_line_id");--> statement-breakpoint
CREATE INDEX "stock_reservations_item" ON "stock_reservations" USING btree ("company_id","item_id");--> statement-breakpoint
CREATE INDEX "stock_reservations_tenant_idx" ON "stock_reservations" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_qty_positive" CHECK (qty > 0);
--> statement-breakpoint
ALTER TABLE stock_reservations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON stock_reservations USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON stock_reservations TO varchasv_app;



CREATE TABLE "bin_stock" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bin_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pick_list_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"list_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"order_line_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"bin_id" uuid,
	"to_pick" numeric(18, 4) NOT NULL,
	"picked" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pick_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"number" varchar(16) NOT NULL,
	"status" varchar(10) DEFAULT 'open' NOT NULL,
	"exceptions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"accepted_short" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "warehouse_bins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"note" varchar(80),
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_bin_id_warehouse_bins_id_fk" FOREIGN KEY ("bin_id") REFERENCES "public"."warehouse_bins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_list_id_pick_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."pick_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_order_line_id_sales_order_lines_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "public"."sales_order_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_list_lines" ADD CONSTRAINT "pick_list_lines_bin_id_warehouse_bins_id_fk" FOREIGN KEY ("bin_id") REFERENCES "public"."warehouse_bins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_order_id_sales_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_bins" ADD CONSTRAINT "warehouse_bins_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bin_stock_bin_item" ON "bin_stock" USING btree ("bin_id","item_id");--> statement-breakpoint
CREATE INDEX "bin_stock_item" ON "bin_stock" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "bin_stock_tenant_idx" ON "bin_stock" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "pick_list_lines_list" ON "pick_list_lines" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX "pick_list_lines_tenant_idx" ON "pick_list_lines" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pick_lists_number" ON "pick_lists" USING btree ("company_id","number");--> statement-breakpoint
CREATE INDEX "pick_lists_order" ON "pick_lists" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "warehouse_bins_code" ON "warehouse_bins" USING btree ("warehouse_id","code");--> statement-breakpoint
CREATE INDEX "warehouse_bins_tenant_idx" ON "warehouse_bins" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "bin_stock" ADD CONSTRAINT "bin_stock_qty_positive" CHECK (qty > 0);
--> statement-breakpoint
ALTER TABLE "pick_lists" ADD CONSTRAINT "pick_lists_status_valid" CHECK (status IN ('open', 'done', 'cancelled'));
--> statement-breakpoint
ALTER TABLE warehouse_bins ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON warehouse_bins USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON warehouse_bins TO varchasv_app;
--> statement-breakpoint
ALTER TABLE bin_stock ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON bin_stock USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON bin_stock TO varchasv_app;
--> statement-breakpoint
ALTER TABLE pick_lists ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON pick_lists USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pick_lists TO varchasv_app;
--> statement-breakpoint
ALTER TABLE pick_list_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON pick_list_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON pick_list_lines TO varchasv_app;



CREATE TABLE "delivery_proof_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"proof_id" uuid NOT NULL,
	"note_line_id" uuid NOT NULL,
	"short_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"damaged_qty" numeric(18, 4) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_proofs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"received_on" date NOT NULL,
	"received_by" varchar(80) NOT NULL,
	"file_id" uuid,
	"note" varchar(300),
	"discrepancy" boolean DEFAULT false NOT NULL,
	"claim_owner_id" uuid,
	"claim_deadline" date,
	"claim_status" varchar(8) DEFAULT 'open' NOT NULL,
	"claim_note" varchar(300),
	"claim_closed_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_proof_id_delivery_proofs_id_fk" FOREIGN KEY ("proof_id") REFERENCES "public"."delivery_proofs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_note_line_id_delivery_note_lines_id_fk" FOREIGN KEY ("note_line_id") REFERENCES "public"."delivery_note_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_note_id_delivery_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."delivery_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_claim_owner_id_users_id_fk" FOREIGN KEY ("claim_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "delivery_proof_lines_proof" ON "delivery_proof_lines" USING btree ("proof_id");--> statement-breakpoint
CREATE INDEX "delivery_proof_lines_tenant_idx" ON "delivery_proof_lines" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "delivery_proofs_note" ON "delivery_proofs" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "delivery_proofs_claim" ON "delivery_proofs" USING btree ("company_id","claim_status","claim_deadline");
--> statement-breakpoint
ALTER TABLE "delivery_proofs" ADD CONSTRAINT "delivery_proofs_claim_status_valid" CHECK (claim_status IN ('open', 'settled', 'waived'));
--> statement-breakpoint
ALTER TABLE "delivery_proof_lines" ADD CONSTRAINT "delivery_proof_lines_qty_valid" CHECK (short_qty >= 0 AND damaged_qty >= 0);
--> statement-breakpoint
ALTER TABLE delivery_proofs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_proofs USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_proofs TO varchasv_app;
--> statement-breakpoint
ALTER TABLE delivery_proof_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON delivery_proof_lines USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON delivery_proof_lines TO varchasv_app;



CREATE TABLE "return_inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"source_type" varchar(16) NOT NULL,
	"source_id" uuid NOT NULL,
	"source_number" varchar(20) NOT NULL,
	"customer_id" uuid,
	"item_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"qty" numeric(18, 4) NOT NULL,
	"restocked_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"written_off_qty" numeric(18, 4) DEFAULT '0' NOT NULL,
	"status" varchar(8) DEFAULT 'pending' NOT NULL,
	"note" varchar(300),
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_customer_id_accounts_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_decided_by_users_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "return_inspections_open" ON "return_inspections" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "return_inspections_source" ON "return_inspections" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "return_inspections_tenant_idx" ON "return_inspections" USING btree ("tenant_id");
--> statement-breakpoint
ALTER TABLE "return_inspections" ADD CONSTRAINT "return_inspections_valid" CHECK (qty > 0 AND restocked_qty >= 0 AND written_off_qty >= 0 AND restocked_qty + written_off_qty <= qty AND status IN ('pending', 'done') AND source_type IN ('credit_note', 'delivery_return'));
--> statement-breakpoint
ALTER TABLE return_inspections ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY tenant_isolation ON return_inspections USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON return_inspections TO varchasv_app;



ALTER TABLE "packing_boxes" ADD COLUMN "delivery_note_id" uuid;--> statement-breakpoint
ALTER TABLE "packing_boxes" ADD CONSTRAINT "packing_boxes_delivery_note_id_delivery_notes_id_fk" FOREIGN KEY ("delivery_note_id") REFERENCES "public"."delivery_notes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "packing_boxes_note" ON "packing_boxes" USING btree ("delivery_note_id");


CREATE TABLE "company_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"prefs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_preferences" ADD CONSTRAINT "company_preferences_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_preferences" ADD CONSTRAINT "company_preferences_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_preferences" ADD CONSTRAINT "company_preferences_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "company_preferences_company" ON "company_preferences" USING btree ("company_id");--> statement-breakpoint
ALTER TABLE company_preferences ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY tenant_isolation ON company_preferences USING (tenant_id = app_tenant()) WITH CHECK (tenant_id = app_tenant());--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON company_preferences TO varchasv_app;



ALTER TABLE "goods_receipt_lines" ADD COLUMN "defect_code" varchar(20);


ALTER TABLE "company_preferences" ADD COLUMN "passcode_hash" varchar(200);


ALTER TABLE "sales_invoices" ADD COLUMN "transporter" varchar(80);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "lr_number" varchar(30);--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD COLUMN "lr_date" date;


