# 03 Navigation architecture

Single source in code: `apps/web/lib/modules-nav.ts` (the `RULES` table). It places **existing** screens (taken from `lib/menu.tsx` and `lib/nav.tsx`) into thirteen tabs and their columns. It adds no screen. Any screen no rule places lands in More, so a new menu entry cannot vanish.

## The thirteen tabs

| Tab | Shortcut | Columns | Screens placed | Column names |
|---|---|---|---|---|
| My Workspace | Alt+W | 2 | 7 | start, people |
| Masters | Alt+M | 5 | 54 | orgFinance, product, salesCustomer, peopleMasters, tools |
| Transactions | Alt+T | 4 | 13 | sales, purchase, accounts, stock |
| Sales and Retail | Alt+S | 4 | 35 | commercial, counter, operations, reports |
| Procurement | Alt+P | 2 | 6 | documents, reports |
| Inventory | Alt+I | 4 | 23 | stock, catalogue, counting, reports |
| Manufacturing | Alt+U | 1 | 4 | planning |
| Finance | Alt+F | 5 | 24 | books, banking, planning, period, assetsExpenses |
| GST and Compliance | Alt+G | 2 | 9 | gst, tax |
| People and Payroll | Alt+H | 2 | 11 | workforce, payroll |
| Analytics and BI | Alt+B | 2 | 8 | bi, reports |
| Administration | Alt+A | 2 | 11 | records, access |
| More | Alt+O | 2 | 7 | crm, projects |

Coverage check (script run on 4 Nov 2026): **187 distinct screens** appeared in the old menus; **187 are reachable** from the new tabs; **0** fell into More's catch-all; the **23 tiles that have no screen** are shown greyed and labelled "Soon" in a "Not built yet" column of the tab their old heading maps to. A few screens are placed in two tabs on purpose: Masters and Inventory both list Style and Item masters; Transactions repeats entry screens as shortcuts. Unintended duplicates were not found.

## Mega menu behaviour (built)

- Hover a tab (mouse only): its menu opens after 150 ms, or at once when another is open; leaving closes it after 320 ms so the pointer can cross the gap.
- Click pins it open; click again or press Esc to close. Clicking outside closes a pinned menu.
- Keyboard: focusing a tab with the keyboard opens it; Left and Right move between tabs; Down enters the menu; arrows move to the nearest entry in that direction; Up from the first row returns to the tab; Esc closes and returns focus to the tab; Alt plus the tab's letter opens it with the filter focused.
- Touch: a tap opens (no hover dependence); the panel stacks columns on narrow screens.
- A filter box narrows the entries; Enter opens the first match.
- Entries the user has no permission for are removed; a column with nothing left is removed; a tab with nothing left is removed.
- Ctrl or Cmd click, or middle click, uses the browser's own behaviour (a new browser tab); within the app every opened screen becomes a workspace tab (`04_WORKSPACE_TABS`).
- The menu is a translucent overlay (`--glass`, 0.96) with blur; entries sit on it as plain text rows.

## Known issues

- Two tiles share the label "Goods on approval" (`/sales/approvals` and `/sales/approval-memos`). They are two screens; the labels need to be told apart (a discovery finding, UX-03).
- Tab labels are long at 1280 px; the row wraps to two lines below about 1400 px. If this proves poor, shorten "People and Payroll" and "GST and Compliance" or give the row a scroll.
- Menu strings are English only until translated (`NEEDS-TRANSLATION.txt`).

## Not changed

Routes. The sidebar drawer used on small screens still lists the 13 sections of `lib/nav.tsx`; it should be replaced by the same module list when the mobile pass is done (`07_RESPONSIVE_GUIDELINES`).
