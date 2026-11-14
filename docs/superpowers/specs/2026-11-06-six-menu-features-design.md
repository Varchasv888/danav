# Six formerly disabled ERP destinations - design

Date: 2026-11-06
Status: Approved by owner on 2026-11-06
Source of scope: owner explicitly approved building Fixed Barcode, Ledger Parameter, TCS Tax Master, Re-pack Box, Re-open Box, and TCS Report.

## Intent

Turn the six visible but disabled destinations into useful, safe workflows for the apparel distributor. Follow the existing Next.js, Fastify, PostgreSQL, tenant isolation, audit, and permission patterns. A tile is complete only when its intended action can be completed and its important failure cases are covered.

## Product decisions proposed for review

- **Fixed Barcode:** reuse the existing in-house EAN-13 assignment service and label printing flow. Add the missing dedicated destination and a focused screen for selecting unbarcoded goods, previewing the count, assigning codes, and printing. Never replace a barcode that already exists; assign only to active goods.
- **Ledger Parameter:** present this to the client as **Ledger Posting Defaults**. Let an authorized owner/accountant map supported automatic posting roles to ledgers in the same company. Validate that selected ledgers are active and in a compatible account group. Show the current and proposed ledger before saving, record changes in the audit log, and apply them only to future postings. Existing vouchers are never rewritten. This is a narrow setup feature, not the deferred ledger redesign.
- **TCS Tax Master:** show the statutory TCS sections, nature, rate, no-PAN rate, and applicability note in a dedicated master screen. Rates remain sourced from the shared domain package and are not freely editable by company users. Proposed company-level enable/disable controls decide which sections appear in TCS collection entry; changes are audited. This avoids silently changing statutory rates.
- **TCS Report:** add a standalone, read-only report for financial year and quarter, reusing the existing Form 27EQ calculation and CSV output. Show collections, challan deposits, totals, and existing warnings such as missing PAN/TAN or collected/deposited mismatch. No duplicate tax calculation is introduced.
- **Re-pack Box / Re-open Box:** add box records with a stable box code, label, current contents, open/packed state, and append-only operation history. Each contents row identifies a sellable goods item (the existing variant-level item record) and a positive quantity; lots and warehouse locations are outside this slice. Repack replaces the recorded contents of an open box; reopen changes a packed box to open with a reason; repacking can close it again. These actions change packaging records only: they do not change stock ledger, on-hand quantity, accounting, or invoice lines. Print a box label and contents summary. Dispatch linkage is outside this slice.

## User roles and safety

- Viewing follows the relevant existing view permissions.
- Barcode assignment, ledger mapping changes, TCS applicability changes, and box changes require the relevant edit permission and are audited.
- All persisted data is company-scoped and tenant-isolated. Cross-company and cross-tenant IDs must be rejected.
- Statutory TCS values come from code; a company cannot override the legal rates through this screen.
- No historic voucher, stock ledger row, or posted sales document is edited by these workflows.

## Scope

Included:
- Make the six corresponding menu tiles navigable and remove their disabled state.
- Add the required pages, API behavior, persistence, English user-facing copy, audit events, and tests.
- Responsive and accessible forms consistent with existing 375px phone checks.

Not included:
- Ledger report redesign or changing prior accounting entries.
- Physical stock movements, location picking, dispatch, or sales invoice changes for box records.
- Changing statutory TCS rates in the application.
- New GST/TCS filing automation or external provider integration.
- Building unrelated items from the broader backlog.

## Acceptance evidence

1. **Fixed Barcode:** only active goods without a code can be selected; assignment is unique and repeat-safe; existing codes never change; selected codes can be printed.
2. **Ledger Posting Defaults:** mappings cannot cross companies or choose incompatible/archived ledgers; a representative future automatic posting uses the selected ledger; prior vouchers remain byte-for-byte unchanged; the update is permission-checked and audited.
3. **TCS Tax Master:** section values match the shared domain definitions; company applicability is isolated; disabling a section hides it from collection entry without changing existing collections.
4. **TCS Report:** selected FY/quarter exactly matches the existing Form 27EQ service; totals reconcile to the rows and challans; CSV remains downloadable; report is read-only and permission-checked.
5. **Boxes:** create, repack, reopen, and label flows retain a traceable history; invalid/empty contents and invalid state transitions are rejected; before/after stock quantities and stock-ledger row counts are unchanged.
6. All six menu destinations load for authorized users and are hidden/denied correctly for unauthorized users; relevant API, domain, web typechecks/build, and targeted tests pass.

## Remaining implementation choices left to the builder

- Use the existing route/layout conventions and established permission names.
- Seed the editable posting-role list from the automatic posting roles the application actually uses; do not expose unrelated chart accounts as settings.
- Use the existing company number-series conventions for stable human-readable box codes, unless a suitable box-code generator already exists.
- English-only scope: do not add or update locale files for these destinations. This follows the owner's clarification on 2026-11-06; existing translations from the already completed Fixed Barcode slice remain as committed.
