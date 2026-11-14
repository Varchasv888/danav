import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const MAGIC = Buffer.from("VBK1");
const key = (pass: string, salt: Buffer) => scryptSync(pass, salt, 32, { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });

/** AES-256-GCM with a key made from the passphrase: layout is magic, salt, iv, tag, then the encrypted bytes. */
export function encryptBackup(data: Buffer, passphrase: string): Buffer {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(passphrase, salt), iv);
  const body = Buffer.concat([cipher.update(data), cipher.final()]);
  return Buffer.concat([MAGIC, salt, iv, cipher.getAuthTag(), body]);
}

/** Throws "not_a_backup" for a file that is not one of ours and "wrong_passphrase" when it cannot be opened (a wrong passphrase and a damaged file look the same). */
export function decryptBackup(file: Buffer, passphrase: string): Buffer {
  if (file.length < 48 || !file.subarray(0, 4).equals(MAGIC)) throw new Error("not_a_backup");
  const salt = file.subarray(4, 20);
  const iv = file.subarray(20, 32);
  const tag = file.subarray(32, 48);
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(passphrase, salt), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(file.subarray(48)), decipher.final()]);
  } catch { throw new Error("wrong_passphrase"); }
}
