import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { audit } from "../lib/audit.js";
import { badRequest, forbidden } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { readPrefs } from "./prefsread.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const hash = (code: string, salt: Buffer) => new Promise<Buffer>((res, rej) => scrypt(code, salt, 32, (e, k) => (e ? rej(e) : res(k))));

/** Stored as "salt:hash" in hex. A short numeric code is not a strong secret, so it guards against slips and casual changes, not against an attacker with database access. */
async function encode(code: string) {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${(await hash(code, salt)).toString("hex")}`;
}
async function matches(code: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const a = await hash(code, Buffer.from(salt, "hex")), b = Buffer.from(key, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Sets or changes the business passcode (four to eight digits). Changing it needs the current one. */
export async function setPasscode(tx: Tx, actor: Actor, passcode: string, current?: string) {
  if (!/^\d{4,8}$/.test(passcode)) throw badRequest("invalid_passcode");
  const company = await resolveCompany(tx);
  const [row] = await tx.select().from(tables.companyPreferences).where(eq(tables.companyPreferences.companyId, company.id));
  if (row?.passcodeHash && !(current && await matches(current, row.passcodeHash))) throw forbidden("passcode_wrong");
  const passcodeHash = await encode(passcode);
  if (row) await tx.update(tables.companyPreferences).set({ passcodeHash, updatedBy: actor.userId, updatedAt: new Date() }).where(eq(tables.companyPreferences.id, row.id));
  else await tx.insert(tables.companyPreferences).values({ tenantId: actor.tenantId, companyId: company.id, passcodeHash, updatedBy: actor.userId });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "passcode", entityId: company.id, after: { changed: true }, ip: actor.ip });
}

export async function hasPasscode(tx: Tx, companyId: string) {
  const [row] = await tx.select({ h: tables.companyPreferences.passcodeHash }).from(tables.companyPreferences).where(eq(tables.companyPreferences.companyId, companyId));
  return !!row?.h;
}

/** Whether cancelling a document needs the passcode: the setting is on and a passcode exists. */
export async function passcodeRequired(tx: Tx, companyId: string) {
  return (await readPrefs(tx, companyId))["security.passcodeOnCancel"] === true && await hasPasscode(tx, companyId);
}

export async function checkPasscode(tx: Tx, companyId: string, code: string | undefined) {
  if (!code) throw forbidden("passcode_required");
  const [row] = await tx.select({ h: tables.companyPreferences.passcodeHash }).from(tables.companyPreferences).where(eq(tables.companyPreferences.companyId, companyId));
  if (!row?.h || !(await matches(code, row.h))) throw forbidden("passcode_wrong");
}
