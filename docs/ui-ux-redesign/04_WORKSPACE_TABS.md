# 04 Workspace tabs

Built: `apps/web/components/TabStrip.tsx`, `apps/web/lib/workspace-dirty.ts`. Verified in a browser on 4 Nov 2026: tabs appear per screen, pin moves a tab to the front, the right-click menu opens and acts, and a half-filled voucher shows the unsaved dot.

## Behaviour

| Requirement | State |
|---|---|
| Each opened screen is a tab | built (a tab is added about half a second after the screen sets its title, so a screen passed through in a click is not kept) |
| Keeps filters when switching | built: the tab remembers the full URL including its query string. It restores the **filters in the URL**; it does not keep unsent form input of a screen you left (a screen is re-rendered on return) |
| Close one tab | built (cross) |
| Close others, close all except pinned, pin | built (right-click, or the Context Menu key or Shift+F10 on a focused tab) |
| Overflow | built: the strip scrolls horizontally and keeps the active tab in view |
| Maximum | 14 tabs; opening one more removes the oldest unpinned tab |
| Restore last session | built, per business, on this device (localStorage key `varchasv.tabs.<tenant>`) |
| Unsaved changes | mechanism built (a screen calls `useWorkspaceDirty(dirty)`; the tab shows a dot and asks before closing, and the browser asks before the window closes). Wired into the **voucher form only**; other entry screens still need the one-line call |
| No duplicate tabs | one tab per path; a new document (`/new`) and a saved one (`/[id]`) are different paths and so different tabs |
| Meaningful labels | the page title (it carries the document number or name where the screen sets it) |
| Reopen recently closed | built: last 10 per business; menu item or Ctrl+Alt+T |
| Keyboard | Ctrl+Alt+Right and Left switch tabs; Ctrl+Alt+W closes the current unpinned tab; Ctrl+Alt+T reopens |

## Why not Ctrl+Tab, Ctrl+W

Browsers reserve Ctrl+Tab, Ctrl+W and Ctrl+Shift+T and do not let pages override them reliably. The brief asks not to hijack browser shortcuts; Ctrl+Alt combinations are free in all common browsers. They are shown in the strip's tooltip.

## Dependencies and limits

- Wire `useWorkspaceDirty` into the other entry forms (sales invoice, purchase bill, receipt, challan, journal, POS billing, employee, payroll edit). It is one line per form: pass whether anything has been typed.
- A tab holds a URL, not component state: a half-filled new document is lost if its tab is left and the browser discards the page. True state preservation needs keeping screens mounted (a heavier change); not done.
- Tab sets are per device, not synced between devices.
