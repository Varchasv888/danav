"use client";

import { BlockError } from "@/components/data/states";

export default function TdsError({ reset }: { error: Error; reset: () => void }) {
  return <BlockError message="Tax deduction data could not be loaded. Please try again." onRetry={reset} />;
}
