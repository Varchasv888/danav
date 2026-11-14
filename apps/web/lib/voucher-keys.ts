import type { KeyboardEvent } from "react";

/** The shortcut keys every entry form shares: Ctrl+S saves, Esc cancels (the button marked data-cancel is pressed, unless a picker is open and Esc is for it). */
export function voucherKeys(e: KeyboardEvent<HTMLFormElement>) {
  const target = e.target as HTMLElement;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); e.currentTarget.requestSubmit(); return; }
  if (e.key === "Escape" && !(target.getAttribute("role") === "combobox" && target.getAttribute("aria-expanded") === "true")) {
    const cancel = e.currentTarget.querySelector<HTMLElement>("[data-cancel]");
    if (cancel) { e.preventDefault(); cancel.click(); }
  }
}
