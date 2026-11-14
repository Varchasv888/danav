-- The stock ledger is append-only. A trigger already refuses changes; the application role should not hold the privilege either.
REVOKE UPDATE, DELETE, TRUNCATE ON stock_ledger FROM varchasv_app;
