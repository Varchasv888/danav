-- Runs once when the container's data volume is first created.
-- The app connects as varchasv_app, a role WITHOUT BYPASSRLS, so row-level
-- security is always enforced for application queries. Migrations run as the owner.
CREATE ROLE varchasv_app LOGIN PASSWORD 'varchasv_app_dev' NOSUPERUSER NOBYPASSRLS;
GRANT CONNECT ON DATABASE varchasv TO varchasv_app;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
