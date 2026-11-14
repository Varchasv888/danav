You are continuing work on Varchasv ERP at E:\varchasverp, an apparel distributor ERP. Another AI tool (Claude Code) built the earlier parts and will take over again later, so the repository documents are our shared memory. Work from them, not from guesses.

Read these first, in this order, and do not edit code until you have:
1. AGENTS.md
2. docs/HANDOFF.md (rules, conventions, commands, current state, known issues)
3. docs/BUILD_LOG.md (what changed most recently and the exact next step)
4. docs/roadmap-and-build-schedule.md (the plan; this is the document attached to this message)
5. From docs/product-status-inventory.md read only sections 1, 7, 8 and 9 for now.
6. From docs/distributor-brief-mapping.md read sections 2 to 6 (GST evidence, phase plan, reservation design, file conversion map, acceptance criteria).

Then run `git status` and `git log --oneline -10`, and tell me in under 10 lines: the current commit, what is uncommitted, and which roadmap phase and item you will take. Wait for my yes before building.

How to work:
- One roadmap item at a time. Start with Phase 0 (product readiness) in this order: (a) one billing destination and removal of duplicate menu entries, (b) a company setting "filing method: manual" that hides the simulator GSP card, (c) fix the integrity page text (strings are nested under `integrity.checks.*` but looked up under `integrity.*`), (d) decide the six tiles with no screen, (e) explain or fix the three tests that failed only in the full run (`scheduledchanges.test.ts`, `insights-crm.test.ts`). Do not start Phase 1 until Phase 0's exit gate is met.
- Keep each turn small, and write what you learned into docs/BUILD_LOG.md as you go, so a context limit never loses progress. If you are running short of room, stop, update the log, and tell me to start a new thread.
- Follow the conventions in docs/HANDOFF.md section 5 exactly: money as Decimal strings, row level security on every tenant table (append the block by hand after drizzle generate), audit on writes, tests with every behaviour change including failure and correction paths, labelled cards on phone widths, English strings through packages/i18n/scripts/merge-en.cjs.
- Never write an em dash anywhere (code, strings, documents, replies). Use a comma, colon or full stop.
- Do not commit or push unless I say so. "Push" means commit then push.
- Run the relevant tests before and after each change: `cd apps/api && npx vitest run test/<file>.test.ts`, then `npx tsc --noEmit` in apps/api and apps/web. After a schema change, rebuild packages/db (`npm run build` there) and apply the migration.
- A feature is done only by the definition in docs/HANDOFF.md section 6. A rendered screen or an existing route is not done. When something is finished and verified, update docs/product-status-inventory.md; when it is not verified, say so plainly in the log.
- Truthfulness on GST: filing is manual by the accountant. Varchasv prepares workpapers and records the ARN, date and proof. Nothing in the UI or the docs may imply Varchasv filed a return, and nothing may claim GSTN accepts our Excel or JSON until it has been tested in the current official tool and the result is recorded.
- AI and WhatsApp may read and draft only. Every number shown to a person (stock, price, credit, ETA, tax, margin) must come from a permission-checked Varchasv query. Build the provider-neutral interface first; Mulltiply and G-Retail are blocked on information from outside and are not dependencies.
- If the working tree contains changes you did not make and the log does not explain them, read the diff before building on them. If they touch the same files as your task, stop and ask me.

At the end of every turn, append an entry to the top of docs/BUILD_LOG.md using the template in that file: what changed, files, migrations, tests run with results, what was verified for real, what was not, decisions, and the exact next step. Then tell me the same in a few lines, including anything you need me, the accountant or the CA to decide.
