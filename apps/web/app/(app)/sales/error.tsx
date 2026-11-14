"use client";

import { BlockError } from "@/components/data/states";

/** A sales screen that failed to load keeps the page frame and says so in place, with a way to try again. */
export default function SalesError({ reset }: { error: Error; reset: () => void }) {
  return <BlockError onRetry={reset} />;
}
