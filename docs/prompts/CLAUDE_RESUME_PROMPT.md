We are resuming work on Varchasv ERP (E:\varchasverp). Codex has probably been working in the same folder since you last did, so do not rely on your memory of the repository. Rebuild your picture from the documents and the code, then report before building.

Do this, in order:
1. Read docs/HANDOFF.md, then docs/BUILD_LOG.md (newest entries first), then docs/roadmap-and-build-schedule.md.
2. Run `git status`, `git log --oneline -15`, and `git diff --stat 3c9f571..HEAD` (3c9f571 is the last commit you made). List every file changed since, grouped by area.
3. For each BUILD_LOG entry written by Codex, check its claims against the code and the tests: open the changed files, run the tests it names (`cd apps/api && npx vitest run test/<file>.test.ts`), and run `npx tsc --noEmit` in apps/api and apps/web. Treat the log as a claim, not as proof.
4. Read docs/product-status-inventory.md sections 1, 7, 8 and 9, and docs/distributor-brief-mapping.md sections 2 to 6.
5. Tell me in under 15 lines: what is done and verified, what is done but unverified, what is half-finished or uncommitted and who it seems to belong to, any claim in the log that the code does not support, any test that now fails, and which roadmap phase and item is next.
6. Wait for my go-ahead.

Rules while working (full list in docs/HANDOFF.md): no em dashes anywhere; do not commit or push unless I say so ("push" means commit then push); one roadmap item at a time and do not start a phase whose earlier gate is open; a feature is done only by the definition in HANDOFF section 6; money as Decimal strings; row level security on every tenant table; tests with every behaviour change; English strings through packages/i18n/scripts/merge-en.cjs; GST is filed manually by the accountant and nothing may imply Varchasv filed a return or that GSTN accepts our files until tested in the current official tool.

If Codex left unfinished changes in files you need, say so and ask me before touching them. When you stop, append a BUILD_LOG entry in the template format, update the inventory only for verified work, and run `graphify update .`.
