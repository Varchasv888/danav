import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { env } from "../env.js";

/**
 * AES-256-GCM for secrets kept in the database. Output is "v1.<iv>.<tag>.<ciphertext>" in base64url.
 * Without SECRETS_KEY (development only; production refuses to start) a fixed development key is
 * derived, so local data stays readable across restarts.
 */
function key() {
  if (env.SECRETS_KEY) {
    const k = Buffer.from(env.SECRETS_KEY, "base64");
    if (k.length !== 32) throw new Error("SECRETS_KEY must be 32 bytes, base64-encoded");
    return k;
  }
  return createHash("sha256").update("varchasv-development-only-not-secret").digest();
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return ["v1", iv.toString("base64url"), c.getAuthTag().toString("base64url"), body.toString("base64url")].join(".");
}

export function decryptSecret(sealed: string): string {
  const [v, iv, tag, body] = sealed.split(".");
  if (v !== "v1" || !iv || !tag || !body) throw new Error("unknown secret format");
  const d = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
  d.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([d.update(Buffer.from(body, "base64url")), d.final()]).toString("utf8");
}
