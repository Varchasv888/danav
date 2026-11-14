"use client";

import { useEffect } from "react";

/**
 * On a phone, a wide table cannot be read by scrolling sideways, so every table with a header row is shown as a stack of cards:
 * one card per row, the first cell as its title and each other cell under its column's name. The names are copied from the header
 * onto the cells (data-label); the layout itself is CSS (globals.css, `table[data-stack]`). Tables that already lay themselves out
 * for a phone, or that opt out with data-no-stack, are left alone. On wider screens nothing is changed.
 */
export function PhoneTables() {
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      if (!mq.matches) return;
      for (const table of main.querySelectorAll<HTMLTableElement>("table:not([data-no-stack])")) {
        if (table.hasAttribute("data-phone")) continue;
        // A table already turned into blocks by its own phone classes, or one with fewer than three columns, is shown as it is.
        // Every table is marked once seen: until then CSS keeps a wide one out of sight so it is never painted before it is stacked.
        if (getComputedStyle(table).display === "block") { table.setAttribute("data-phone", "skip"); continue; }
        const heads = [...(table.tHead?.rows[0]?.cells ?? [])];
        if (heads.length < 3) { table.setAttribute("data-phone", "skip"); continue; }
        const labels: string[] = [];
        for (const h of heads) for (let i = 0; i < Math.max(1, h.colSpan); i++) labels.push((h.textContent ?? "").trim());
        for (const body of [...table.tBodies, ...(table.tFoot ? [table.tFoot] : [])]) {
          for (const row of body.rows) {
            let col = 0;
            for (const cell of row.cells) {
              cell.setAttribute("data-label", cell.colSpan > 1 ? "" : (labels[col] ?? ""));
              col += Math.max(1, cell.colSpan);
            }
          }
        }
        table.setAttribute("data-stack", "");
        table.setAttribute("data-phone", "done");
      }
    };
    // Applied as soon as the page changes, so a wide table is never painted first.
    const later = () => apply();
    apply();
    const obs = new MutationObserver(later);
    obs.observe(main, { childList: true, subtree: true });
    mq.addEventListener("change", later);
    return () => { obs.disconnect(); mq.removeEventListener("change", later); };
  }, []);
  return null;
}
