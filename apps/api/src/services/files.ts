import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Stores an uploaded receipt or bill (sent as base64). Only images and PDFs up to 5 MB. */
export async function saveFile(tx: Tx, actor: Actor, input: { name: string; contentType: string; base64: string }) {
  if (!(FILE_TYPES as readonly string[]).includes(input.contentType)) throw badRequest("file_type");
  const data = Buffer.from(input.base64, "base64");
  if (!data.length) throw badRequest("file_empty");
  if (data.length > MAX_FILE_BYTES) throw badRequest("file_too_large");
  const magic = data.subarray(0, 4).toString("hex");
  const ok = input.contentType === "application/pdf" ? data.subarray(0, 4).toString() === "%PDF"
    : input.contentType === "image/png" ? magic === "89504e47" : input.contentType === "image/jpeg" ? magic.startsWith("ffd8ff") : data.subarray(8, 12).toString() === "WEBP";
  if (!ok) throw badRequest("file_type");
  const company = await resolveCompany(tx);
  const [row] = await tx.insert(tables.files).values({
    tenantId: actor.tenantId, companyId: company.id, name: input.name.slice(0, 200), contentType: input.contentType, size: data.length,
    sha256: createHash("sha256").update(data).digest("hex"), data, createdBy: actor.userId,
  }).returning({ id: tables.files.id, name: tables.files.name, contentType: tables.files.contentType, size: tables.files.size });
  return row!;
}

export async function getFile(tx: Tx, id: string) {
  const [f] = await tx.select().from(tables.files).where(eq(tables.files.id, id));
  if (!f) throw notFound();
  return f;
}
