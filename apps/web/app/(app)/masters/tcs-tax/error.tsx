"use client";

import { BlockError } from "@/components/data/states";

export default function TcsTaxError({ reset }: { error: Error; reset: () => void }) {
  return <BlockError message="TCS settings could not be loaded. Please try again." onRetry={reset} />;
}
