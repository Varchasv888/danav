"use client";

import { useEffect } from "react";

/**
 * Lets an entry screen tell the workspace tabs it holds unsaved work. The tab then shows a dot and asks before it
 * is closed, and the browser asks before the window is. A screen calls it with whether it is dirty right now;
 * it clears itself when the screen goes away, so a saved or abandoned form never leaves a stale dot.
 */
export const DIRTY_EVENT = "varchasv:dirty";

export function useWorkspaceDirty(dirty: boolean) {
  useEffect(() => {
    const path = window.location.pathname;
    window.dispatchEvent(new CustomEvent(DIRTY_EVENT, { detail: { path, dirty } }));
    return () => { window.dispatchEvent(new CustomEvent(DIRTY_EVENT, { detail: { path, dirty: false } })); };
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}
