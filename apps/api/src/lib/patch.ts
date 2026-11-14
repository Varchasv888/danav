import type { z } from "zod";

/**
 * Parses a partial update. Zod fills in `.default()` values even inside `.partial()`, so a PATCH that
 * only renames something would also reset every defaulted field; this keeps only the fields sent.
 */
export function parsePatch<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const parsed = schema.parse(input) as Record<string, unknown>;
  const sent = input && typeof input === "object" ? input as Record<string, unknown> : {};
  return Object.fromEntries(Object.entries(parsed).filter(([k]) => k in sent)) as z.output<S>;
}
