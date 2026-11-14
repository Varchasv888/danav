# 02 Application shell

Built (verified in a browser on 4 Nov 2026): `apps/web/components/MegaMenu.tsx`, `apps/web/components/TabStrip.tsx`, `apps/web/lib/modules-nav.ts`, `apps/web/lib/workspace-dirty.ts`. Wired in `apps/web/components/Shell.tsx`.

## Layout

```
[logo] [business v] [FY]   [ Go to...  Ctrl K / F2 ]        [+ New] [Assistant] [user] [date] [lock] [sign out]
[My Workspace v][Masters v][Transactions v][Sales and Retail v] ... [More v] [Exit]        [theme][language]
[Home][pinned tabs][open screens ...]                                                      (workspace tabs)
------------------------------------------------------------------------------------------------------------
page
```

Header row 1 is navy; rows 2 and 3 are on the surface with a bottom rule. On screens under 1024 px the module row scrolls horizontally and the sidebar drawer (all sections) is available from the menu button.

## What the brief asks for and where each stands

| Element | State | Notes |
|---|---|---|
| Logo, organisation (business) selector | built | `BusinessSwitcher`; switching business reloads the session |
| Financial year | shown, not a selector | A label computed from today. A real selector needs `fiscal-years` choice carried to every report; today reports take their own date range. Dependency recorded |
| Legal entity and branch/store selector | not built | No scope-switch concept in the session. A control that changed nothing would be decorative. Needs: a `scope` cookie read by the API (company, branch, store), checked against `memberships.warehouse_scope` |
| Universal search | built for screens and actions | `GoTo` palette (`05_COMMAND_PALETTE`). Records need a search API |
| New / quick create | built | Seven entries with F4 to F9 keys |
| Notifications, approval inbox, sync status | not built | Approvals exist (`/settings/approvals`, `/change-requests`); there is no notification store and the web has no sync. Specified in `06_SHARED_COMPONENTS` (task and approval inbox) with required data |
| Help | not built | No help content exists |
| Profile, security, logout | built | account page, lock screen (Ctrl+Alt+L), step-up dialog, sign out |
| Module tabs with hover mega menu | **built** | `03_NAVIGATION_ARCHITECTURE` |
| Workspace tab bar | **built** | `04_WORKSPACE_TABS` |
| Optional quick-access rail | decided against for now | The module row plus workspace tabs cover it; My Menu (pinned tiles) and recent items live on the Home screen. Revisit after screen-width testing with real users |
| Role workspaces (13 personas) | specified only | See below |

## Role workspaces (specification)

Home is `/my-menu` (per-user pinned tiles, today's money, waiting items). Role homes are not built on the web. The persona to home mapping below uses data the API already serves; widgets with no data source are marked.

| Persona | Role in standard set | Panels from existing data | Missing data |
|---|---|---|---|
| Owner or executive | owner | `/analytics/dashboard` money, receivables, payables, alerts; `/bi` headline; `/reports/cfo` | branch comparison on one panel, pending approvals count |
| Administrator | admin | sensitive changes, access reviews, devices, backups (`/settings/*`) | - |
| Accountant | accountant | cash and bank, receivable and payable ageing, close checklist, GST calendar, TDS | unreconciled count as one figure |
| Finance manager | accountant | working capital, cash forecast, commitments | - |
| Sales manager | sales | register, targets, commission, outstanding | - |
| Cashier | sales | counter session, held bills, day close | cash variance history |
| Store manager | sales, storekeeper | store results, counts, transfers in transit, approval memos | target achievement per store on one panel |
| Warehouse manager | storekeeper | receiving holds, transfers, counts, reorder (`/reports/reorder`) | outward pending (no outward document list) |
| Purchase manager | purchase | orders, receiving, supplier dues, backlog | - |
| Production manager | (none in standard set) | orders, MRP, job work | WIP by stage, delays (no stage data) |
| HR manager | hr | attendance alerts, leave requests, payroll run | - |
| Employee | (self service not built) | leave, attendance, claims on the device app | web self-service |
| Auditor or read-only | viewer | view-only registers, audit log, integrity | - |

Widget framework requirements (hide, reorder, resize, scope, drill, refresh, export) need a layout store; see BI-011. Until then the tiles on My Menu are the personalisation mechanism.
