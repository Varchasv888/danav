import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { decryptBackup, encryptBackup } from "../src/lib/backupcrypt.js";
import { unzip, zip } from "../src/lib/zip.js";
import { verifyBackup } from "../src/services/export.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const PASS = "a long enough passphrase";

const encrypted = async (cookie = c, passphrase = PASS) => t.app.inject({ method: "POST", url: "/export/business.vbk", headers: { cookie, "content-type": "application/json" }, payload: { passphrase } } as never);
const verify = (cookie: string, file: Buffer, passphrase: string) => t.call(cookie, "POST", "/export/verify", { passphrase, dataBase64: file.toString("base64") });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("vbk")).cookie;
  const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
  await t.call(c, "POST", "/accounts", { name: "Backup Probe Traders", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" });
});
afterAll(() => t.close());

describe("encrypted backups", () => {
  it("round-trips bytes, and refuses a wrong passphrase or a file that is not a backup", () => {
    const data = Buffer.from("the books of a small business");
    const file = encryptBackup(data, PASS);
    expect(file.includes(data)).toBe(false);
    expect(decryptBackup(file, PASS).equals(data)).toBe(true);
    expect(() => decryptBackup(file, "another passphrase")).toThrow("wrong_passphrase");
    expect(() => decryptBackup(Buffer.from("plain text, not a backup at all, padded to be long enough"), PASS)).toThrow("not_a_backup");
    const damaged = Buffer.from(file);
    damaged[damaged.length - 1] ^= 1;
    expect(() => decryptBackup(damaged, PASS)).toThrow("wrong_passphrase");
  });

  it("unzip reads back what zip wrote", () => {
    const files = [{ name: "a.txt", data: Buffer.from("hello") }, { name: "dir/b.json", data: Buffer.from("[1,2,3]") }];
    const back = unzip(zip(files));
    expect(back.map((f) => [f.name, f.data.toString()])).toEqual([["a.txt", "hello"], ["dir/b.json", "[1,2,3]"]]);
    expect(() => unzip(Buffer.from("nope"))).toThrow("not_a_zip");
  });

  it("downloads the business locked with a passphrase, and the restore drill passes on it", async () => {
    const res = await encrypted();
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-disposition"]).toMatch(/\.vbk"/);
    const file = res.rawPayload;
    expect(file.includes(Buffer.from("Backup Probe Traders"))).toBe(false);
    const r = await verify(c, file, PASS);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ ok: true, problems: [] });
    expect(r.body.tables).toBeGreaterThan(50);
    expect(r.body.rows).toBeGreaterThan(0);
  });

  it("the drill refuses a wrong passphrase and reports a changed file", async () => {
    const file = (await encrypted()).rawPayload;
    expect((await verify(c, file, "not the passphrase")).body.error).toBe("wrong_passphrase");
    expect((await verify(c, Buffer.from("this is only a note, not a backup, and long enough"), PASS)).body.error).toBe("not_a_backup");
    // Re-lock a tampered archive with the same passphrase: the lock is fine but the contents no longer match the manifest.
    const archive = decryptBackup(file, PASS);
    const files = unzip(archive).map((f) => (f.name === "json/accounts.json" ? { name: f.name, data: Buffer.from("[]") } : f));
    const tampered = encryptBackup(zip(files), PASS);
    const r = await verify(c, tampered, PASS);
    expect(r.body.ok).toBe(false);
    expect(r.body.problems.join(" ")).toContain("json/accounts.json");
    expect(verifyBackup(archive).ok).toBe(true);
  });

  it("needs a passphrase of 12 characters and the export right", async () => {
    expect((await encrypted(c, "short")).statusCode).toBe(400);
    expect((await encrypted("", PASS)).statusCode).toBe(401);
  });
});
