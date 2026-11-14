"use client";

import { BlockError } from "@/components/data/states";

/** Keep a transient server/API failure inside the app shell and let the user retry the return view. */
export default function GstReturnsError({ reset }: { error: Error; reset: () => void }) {
  return <BlockError message="GST returns could not be loaded. Please try again." onRetry={reset} />;
}
