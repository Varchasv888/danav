# Retail invoice and interface changes

## Sales invoices
- A standard standalone invoice may now be saved with no selected customer. The API uses a per-company `Walk-in Retail Customer` debtor ledger, creating it in the same database transaction when first needed. Linked sales orders and quotations still require their original customer.
- The invoice includes an inline **New customer** panel, with customer name, phone, GSTIN and state. A successful save immediately selects the customer without discarding the invoice lines.
- The new-customer workflow uses the existing `/accounts` endpoint and requires `accounts.view` and `accounts.create` permissions. The walk-in billing route only requires normal invoice creation rights.
- Existing quote, proforma and order customer requirements are unchanged.

## Navigation and themes
- **Masters** now appears as a separate desktop module tab. Its individual links remain permission-filtered.
- Light, dark and system theme controls are visible in the desktop toolbar at supported desktop sizes; existing mobile and sidebar controls remain.

## Verification and release precautions
- Static TypeScript/TSX parsing completed for the four changed source files.
- Full TypeScript type-check, build, database integration tests and real GST-compliance tests were **not** run because project dependencies and a running Postgres database are not available in this workspace.
- Test a fresh walk-in invoice, second walk-in invoice, named customer creation, invoice print, company switching, permissions and GST requirements before deploying to production.
- Some tax documents require buyer information: a walk-in record is not a substitute for legally required B2B/buyer details.
