# Phase 0 - GST/UI replication specification audit

Audit date: 7 November 2026
Input: `C:\Users\siddh\Downloads\ui-ux-gst-replication-master-prompt.md`
Status at initial audit: **Audit drafted; then superseded by the user's follow-up authorization and screenshot archive.**

## Follow-up update - 7 November 2026

The user later supplied `vyapar uiux.rar` containing 119 feature screenshots and authorized implementation of the UI/UX, formats, and structure across matching Varchasv screens. English-only remains in force. Accounting and GST screens are in scope for visible workflow changes. Their calculations, ledger postings, backend behavior, and output contracts remain authoritative unless separately specified; screenshots alone are not evidence for changing statutory logic. The user deferred testing to a later phase. Current implementation scope and progress are recorded in `docs/superpowers/specs/2026-11-07-vyapar-inspired-uiux-spec.md`, `docs/superpowers/plans/2026-11-07-vyapar-inspired-uiux.md`, and `docs/ui-ux-redesign/PROGRESS.md`.

## Scope and instruction precedence

The user asked to apply the attached prompt word-for-word. The prompt's delivery instruction says to begin with Phase 0, enumerate missing/ambiguous inputs and risks, and wait for answers before writing feature code. This audit follows that instruction.

The prompt is a specification, not a source of permission to change external systems or copy protected brand assets. Its own asset rule requires swappable placeholders for product name, logo, icons, and fonts. The earlier user preference “English only” remains in force. Existing approved Varchasv behavior and accounting rules are not silently replaced by behaviors guessed from Vyapar.

This is the **master-prompt Phase 0**, separate from the earlier UI/UX redesign's Phase 0 discovery validation. The earlier project status remains as documented in `PROGRESS.md`: design system and shell are partly implemented; shared screen framework and benchmark modules are incomplete.

## Repository and reference material found

### Existing Varchasv implementation and design records

- Feature/design inventory: 268 feature specifications, 229 screens in the matrix, and 749 routes in the prior discovery package.
- Existing shared tokens in `apps/web/app/globals.css`, documented in `01_DESIGN_TOKENS.md`; a subset of colors, type, spacing, radii, elevation, and charts is defined. It is not yet a fully documented per-component specification covering every state and responsive breakpoint requested by the prompt.
- Existing shell, module navigation, command palette, workspace tabs, and mobile navigation; missing or partial items include scope selectors, notification/task inbox, record search, help content, and role homes.
- Shared UI includes basic buttons/fields/cards/page headers, badges, DataTable, empty/loading/error states, chart components, and Excel/CSV helpers. FilterBar, full object header, searchable combobox, reusable document editor, broad overlay library, and several DataTable behaviors remain gaps.
- Existing printed A4 invoice/proforma/quotation composition in `apps/web/components/print/TaxDocument.tsx`; challan layout in `ChallanDocument.tsx`; POS receipt output in `apps/web/components/pos/ReceiptView.tsx`; print setup in `PrintSetup.tsx`.
- Existing GST return JSON and spreadsheet generation in `apps/web/lib/gstr1-offline.ts`, `gstr2b-xlsx.ts`, `xlsx-export.ts`, and the GST returns route. These are not a complete per-screen export matrix or proof of byte-identical reference output.
- Existing API, domain and database packages, decimal arithmetic, GST/voucher fixtures, and backend tests. These do not supply Vyapar golden files or prove every end-to-end UI/export path.
- Prior code-based Vyapar findings are recorded in `docs/research/vyapar-codebase-ui-ux-reference.md`. They come from local HTML/CSS and bundled code; significant JavaScript is obfuscated, and the readable-source recovery tool could not be activated in this session. The file marks those unknowns. No reference PDF/XLSX/CSV/JSON samples or full screenshot/state pack has been supplied.
- A coarse source scan found 24 component-source lines containing hex literals and 80 containing `px` literals. These counts are leads for later cleanup, not a verified violation count: each occurrence must be classified, and values in print-specific page rules may require different treatment from interactive UI styles.

## Requirement-by-requirement audit

Status key: **Present** = evidence exists; **Partial** = some parts exist; **Missing input** = cannot specify faithfully yet; **Gap** = implementation/spec is incomplete.

| Prompt section | Current evidence | Phase 0 finding |
|---|---|---|
| 0. Role, objective, fidelity | Local Vyapar source survey and earlier UI notes exist. | **Missing input:** reference identity is Vyapar, but the fidelity slot is unfilled. Pixel-identical/≤2 px cannot be validated without screen captures at known viewport/scale for every target state. |
| 1. Non-negotiable rules | Varchasv has tokens, domain decimal arithmetic, accessibility notes, and feature specs. | **Partial/conflict:** “never invent” is accepted. The source prompt asks for exact sample-based tests, but no reference samples are attached. It also says follow reference GST behavior over current law by default, which conflicts with the earlier user direction to model Indian CA practice. English-only conflicts with any bilingual/multilingual print assumptions. |
| 2. Inputs | Repo tech stack and partial local Vyapar evidence are available. | **Missing input:** no screenshots/state captures, extracted token JSON, computed-style sheet, sample document/export files, complete interaction notes, or confirmation of PDF/print backend behavior. Stack slots can be filled from the repository; reference-dependent slots cannot. |
| 3. Design system | `globals.css` and token documentation define important semantic colors, typography, spacing, radii, dark mode, and chart colors. | **Partial:** no complete exact reference values for all color steps, font metrics, component states, density, z-index, icon/motion rules, and breakpoints. Current Varchasv token system is the correct base; importing unverified values would violate “never invent.” |
| 4. Shell/navigation | Varchasv has module menus, workspace tabs, Go To, quick create, business switching, and mobile navigation. Vyapar's code provides representative rail/preview CSS. | **Partial:** the master prompt's exact sidebar/topbar dimensions, item order, collapse behavior, and all responsive states are not supplied. Varchasv already made deliberate shell choices; wholesale replacement would conflict with existing project decisions and needs an explicit scope decision. |
| 5. Component library | Basic components, DataTable, state components, and charts exist. | **Gap:** required full state/keyboard/ARIA specs and reusable combobox, FilterBar, editor grid, overlay, upload, feedback, print-preview, and documentation/story page are incomplete. Exact dimensions and behavior need reference values or owner-approved assumptions. |
| 6. GST/accounting logic | GST, invoices, vouchers, reports, decimal math, and fixtures exist in the app. | **Partial/high consequence:** prompt-level checklists do not define the actual reference rules for tax-inclusive conversion, discounts/charges, rounding order, HSN threshold, TDS/TCS, postings/narration, document locks, numbering, stock valuation, or exact report grouping. Do not replace existing calculations based only on UI strings. Current-law/CA practice versus reference behavior needs owner decision and domain evidence. |
| 7. Document/print formats | A4 invoice/proforma/quotation, challan, POS receipt, and other print routes exist. Vyapar CSS/generator identifies theme selection, print/PDF/thermal controls, configurable fields, and report HTML. | **Partial/missing samples:** exact page geometry, field order, column widths, pagination, copy labels, QR payload/size, signature/footer rules, thermal widths, PDF engine, and editable template model are not settled. No reference PDFs or screenshots are attached, so the ≤1 mm claim is untestable. |
| 8. Import/export formats | GST JSON/XLSX, GSTR-2B reconciliation support, general XLSX/CSV, and import screens exist. | **Partial/missing schemas:** no reference samples/schema versions for GSTR-3B, IRP/e-way bulk, Tally XML, report sheets, ZIP naming, backups, or import error files. Do not claim exact compatibility until schemas and sample files are available. |
| 9. Data model/architecture | Next.js web app, Node API, Postgres/Drizzle packages, domain package, API routes, tenant/company data model. | **Partial:** entity/field/API foundations exist, but the prompt requires a complete constraint/index/audit/permissions/API matrix, concurrency/idempotency, offline/autosave behavior, and numeric precision inventory. Some of these are feature-specific and need a defined implementation scope. Performance targets `[N]` and `[X]` are blank. |
| 10. Interactions | Existing keyboard navigation, unsaved-change handling, tables, responsive behavior, filters, and status flows are documented in places. | **Partial:** no complete shortcut map, all-form tab-order inventory, validation timing/error-copy matrix, undo/autosave contract, or per-state focus behavior is supplied. Vyapar runtime behavior remains partly unknown from static source. |
| 11. Delivery phases | Master prompt defines phases 0–9. Existing redesign uses phases 0–8 with different names/order. | **Ambiguous:** treat these as a new replication program with its own Phase 0–9 numbering unless owner says to merge/reset the older sequence. Phase 0 is active now; no code phase has started under this master prompt. |
| 12. Acceptance | User-facing criteria are listed in the prompt. | **Not currently measurable:** no reference screenshots or files; golden tests lack golden inputs; no evidence yet of full WCAG 2.1 AA or all breakpoints. The numeric tolerances need test fixtures and a deterministic render/PDF environment. |

## Deviation & Gaps Log

| ID | Prompt requirement | Current state / deviation | Why |
|---|---|---|---|
| DG-01 | Fill every reference slot with observed values | Many slots remain blank; values are marked missing rather than invented. | No screenshot/token/sample package was attached; local bundles are partly obfuscated. |
| DG-02 | ≤2 px UI and ≤1 mm document fidelity | Not accepted as measurable yet. | No matched viewport screenshots or reference PDFs. |
| DG-03 | No hardcoded style values outside token file | Existing component-source scan has hex/px matches; no cleanup performed. | Each match must be reviewed; print page size/margins may belong in print-template tokens/config rather than app-wide UI tokens. |
| DG-04 | Golden-file tests for calculations, exports, documents | Existing fixtures cover domain cases, but no Vyapar golden exports/documents are present. | Exact reference samples and schema versions are missing. |
| DG-05 | Follow reference GST behavior even when it differs from current law | Not applied. | Conflicts with earlier instruction to use Indian CA-practitioner logic; requires owner direction and authoritative domain review. |
| DG-06 | Full print and export replication | Existing Varchasv formats are present; template workbench and exact output compatibility remain unbuilt/unverified. | Output samples and all relevant reference settings are absent. |
| DG-07 | Bilingual/localized labels where present | English-only retained. | Earlier user preference: “no need for multilingual, only english.” |
| DG-08 | Phase numbering | Master phases treated as a new sequence for this audit. | Prior redesign Phase 0–8 has different definitions and partial completion; silently combining them would misstate progress. |
| DG-09 | Use reference brand assets | Not copied; placeholders/swappable assets retained. | The prompt itself requires this; protected logos, icon sets, fonts, and marketing copy are excluded. |

## Decisions needed before Phase 1

Please answer these grouped decisions. Any missing pixel/schema-level detail can remain a tracked gap; the items below decide what work is authorized and how to label it.

1. **Reference package and fidelity:** Can you provide representative screenshots for the main screen types/states and sample invoice, proforma, challan, receipt, GST workbook/JSON, and report exports? If unavailable, should Phase 1 proceed from code-derived observations with all unverified measurements explicitly marked `ASSUMPTION`, and drop the pixel-level acceptance numbers until samples arrive?
2. **GST/accounting authority:** When Vyapar behavior, current GST law, and the earlier CA-practice instruction differ, which governs Varchasv? Recommended order for accurate accounting is current statutory requirements and Indian CA workflow, with Vyapar's UI behavior used only where compliant; any incompatible reference behavior would be logged rather than copied.
3. **Phase numbering:** Keep this master prompt's Phase 0–9 as a new, separate program, while preserving the older redesign progress record? (Recommended.)
4. **Tests and artifacts:** The prompt requires golden-file and visual-diff tests. Should those be written when reference samples arrive, while implementation proceeds with the existing domain fixtures and documented manual review in the meantime?
5. **Scope:** Does “apply this word-to-word” mean proceed through all Phase 1–9 scopes in the document over time, while still pausing after this Phase 0 audit for your answers? This audit does not begin feature coding.

## Current stop point

Phase 0 audit is complete as a gap inventory. **Phase 1 has not started.** No product code, GST rules, print template, export schema, or visual token was changed in response to this master prompt. Work can proceed after the five decisions above; any supplied reference files should be added to the evidence inventory before exact replication claims are made.
