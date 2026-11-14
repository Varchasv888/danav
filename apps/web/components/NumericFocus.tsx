"use client";

import { useEffect } from "react";
import { numberOnBlur, numberOnFocus } from "@/lib/field-format";

/** Sets a box's text the way React notices it (a plain assignment would be ignored by a controlled input). */
function setText(el: HTMLInputElement, text: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, text);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * The same number-box rules for every numeric box on every screen, including the plain ones that are not the shared number field: entering a box holding zero
 * empties it, entering one holding anything else selects it, and leaving an empty required box puts back 0. The shared money and number fields do this themselves
 * (they are marked data-numeric="managed") and are left alone. Mounted once in the app layout.
 */
export function NumericFocus() {
  useEffect(() => {
    const numeric = (t: EventTarget | null): t is HTMLInputElement =>
      t instanceof HTMLInputElement && (t.inputMode === "decimal" || t.inputMode === "numeric") && t.type === "text" && !t.readOnly && !t.disabled && t.dataset.numeric !== "managed";
    const enter = (e: FocusEvent) => {
      const el = e.target;
      if (!numeric(el)) return;
      const f = numberOnFocus(el.value);
      if (f.select) el.select(); else if (el.value !== "") setText(el, "");
    };
    const leave = (e: FocusEvent) => {
      const el = e.target;
      if (!numeric(el) || !el.required || el.value.trim() !== "") return;
      setText(el, numberOnBlur("", { required: true, decimals: Number(el.dataset.decimals ?? 0) }));
    };
    document.addEventListener("focusin", enter);
    document.addEventListener("focusout", leave);
    return () => { document.removeEventListener("focusin", enter); document.removeEventListener("focusout", leave); };
  }, []);
  return null;
}
