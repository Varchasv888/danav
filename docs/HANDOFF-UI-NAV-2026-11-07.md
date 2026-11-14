# Handoff: UI navigation and register layout

## Published state

- Repository: `kaalvakraa/varchasvesp`
- Branch: `main`
- Published commit: `cc134a0` (`feat(web): match section and feature navigation layout`)
- The commit is based on the already approved work from `4a1f223` and was pushed as a fast-forward.

## What changed

- Desktop now has three areas: dark top-level section rail, adjacent light subsection and feature list, and the main feature view.
- The rail contains Home, Masters, Inventory, Purchase, Sales, Transactions, Accounting, GST, CRM, Financial planning, Tax and compliance, People, Analytics, Administration, Reports, and Utilities. Manufacturing and Projects remain available as Varchasv-specific sections.
- Report routes are grouped in Reports; import, backup, device, number-series, and otherwise unassigned screens are grouped under Utilities. Existing permissions and working destinations are retained. Planned entries remain disabled and marked Soon.
- Registers use compact numbered rows with sorting, per-column filters, search, Excel export, and print. Sales date filters appear in the table's filter band.
- Accounting and GST calculation, posting, API, and export behavior were not changed by this UI update.

## Verification and limits

- `npm run typecheck -w @varchasv/web`: passed.
- `git diff --check`: passed.
- Tests were not run because the owner deferred the test phase.
- `npm run build -w @varchasv/web` started but produced no further output; it was interrupted after the process stopped responding. Production build and deployment status are unverified.
- No browser screenshot review or responsive checks were run. Confirm the navigation and report layout at desktop, tablet, and phone widths in the later UI test phase.

## Next step

During the planned test phase, review section-to-feature navigation, representative report lists and filters, keyboard access, and 1440/1280/768/375 pixel layouts. Check a print preview and Excel output. Do not treat this handoff as product or QA acceptance.

## Hosted GST/API error follow-up

- The Vercel function log showed `/gst/returns` crashing on a null GSTR-1 summary after a server/API request failed. The page now guards incomplete data and has an app-level retry error state.
- `/gst/workspace` now keeps working if only its e-invoice alerts request fails, and displays an explicit message for that panel.
- TDS and TCS master pages now show an in-app retry state on server errors.
- The Vercel API build configuration compiles the API but does not run database migrations. The TCS settings endpoint queries `tcs_section_settings`, created by migration `0130_tcs_section_settings.sql`. A missing production migration is a likely cause of its 500, but the frontend log does not prove this. Confirm against the API function's underlying database error and the production migration ledger before applying pending migrations. Migration runner requires the privileged `DATABASE_OWNER_URL`; never substitute or print credentials.
- The e-invoice alerts 500 is a separate API failure. It is not explained by migration 0130 alone. Its API-side exception remains to be inspected.
- Follow-up: the generic GST returns error text uses the catalog path `common.errors.generic`.

### Hosted database repair

- With the owner's approval, applied migrations `0127_gst_workpapers.sql` through `0134_receipt_landed_charge_allocations.sql` to the hosted database. The migration ledger had been at `0126_comm_auto_events`.
- Read-only verification confirmed the ledger now ends at `0134_receipt_landed_charge_allocations`, `tcs_section_settings` exists with RLS enabled and SELECT granted to `varchasv_app`, and `gst_settings.filing_method` exists.
- Vercel web and API checks were green at commit `9f091ea`. No authenticated post-migration request could be exercised in this session, so recheck `/accounts/tds`, `/masters/tcs-tax`, `/gst/workspace`, and `/gst/returns` while signed in.
