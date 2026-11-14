import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { decryptBackup } from "../src/lib/backupcrypt.js";
import type { Mailer } from "../src/lib/mailer.js";
import { runBackup, runDueBackups } from "../src/services/backups.js";
import { verifyBackup } from "../src/services/export.js";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
let tenantId: string;
const PASS = "a long backup passphrase";

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const put = (body: Record<string, unknown>) => t.call(c, "PUT", "/backups", body);
const settings = { enabled: true, frequency: "daily", hour: 2, weekday: 0, recipients: ["owner@example.in"] };

beforeAll(async () => {
  t = await testApp();
  const s = await t.signup("backups");
  c = s.cookie;
  tenantId = (await t.call(c, "GET", "/auth/me")).body.tenantId;
  // Some books to put in the copy.
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const debtors = groups.find((g) => g.key === "sundry_debtors")!.id;
  const shop = (await t.call(c, "POST", "/accounts", { name: "Backup Shop", groupId: debtors, stateCode: "27" })).body.id;
  const cash = (await get("/accounts")).find((a: { key: string | null }) => a.key === "cash").id;
  await t.call(c, "POST", "/vouchers", { type: "receipt", date: "2026-11-03", lines: [{ accountId: cash, debit: "500" }, { accountId: shop, credit: "500" }] });
});
afterAll(() => t.close());

describe("scheduled backups", () => {
  it("starts switched off", async () => {
    expect(await get("/backups")).toMatchObject({ enabled: false, hasPassphrase: false, overdue: false, runs: [] });
  });

  it("will not switch on without somewhere to send it or a passphrase", async () => {
    expect((await put({ ...settings, recipients: [] })).body.error).toBe("recipients_required");
    expect((await put(settings)).body.error).toBe("passphrase_required");
    expect((await put({ ...settings, passphrase: "short" })).body.error).toBe("passphrase_short");
    expect((await put({ ...settings, recipients: ["not an email"], passphrase: PASS })).body.error).toBe("invalid_recipients");
  });

  it("saves the schedule, keeps the passphrase out of what it shows, and plans the next run", async () => {
    expect((await put({ ...settings, passphrase: PASS })).status).toBe(200);
    const s = await get("/backups");
    expect(s).toMatchObject({ enabled: true, frequency: "daily", hasPassphrase: true, recipients: ["owner@example.in"] });
    expect(JSON.stringify(s)).not.toContain(PASS);
    expect(JSON.stringify(s)).not.toContain("passphraseEnc");
    expect(new Date(s.nextRunAt).getTime()).toBeGreaterThan(Date.now());
    // Changing the times later keeps the saved passphrase.
    expect((await put({ ...settings, hour: 3 })).status).toBe(200);
  });

  it("makes a locked copy that opens with the passphrase and balances, and emails it", async () => {
    const before = t.mailer.sent.length;
    const r = await t.call(c, "POST", "/backups/run", {});
    expect(r.body).toMatchObject({ ok: true, error: null });
    const mail = t.mailer.sent.slice(before).find((m) => m.to === "owner@example.in")!;
    expect(mail.subject).toContain("backup");
    const att = mail.attachments![0]!;
    expect(att.encoding).toBe("base64");
    const check = verifyBackup(decryptBackup(Buffer.from(att.content, "base64"), PASS));
    expect(check.ok).toBe(true);
    expect(check.books).toMatchObject({ balanced: true });
    expect(check.books!.entries).toBeGreaterThan(0);
    expect(() => decryptBackup(Buffer.from(att.content, "base64"), "the wrong passphrase")).toThrow();
    const s = await get("/backups");
    expect(s.runs[0]).toMatchObject({ status: "ok", trigger: "manual", sentTo: ["owner@example.in"] });
    expect(s.runs[0].sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(s.lastOkAt).toBeTruthy();
  });

  it("runs by itself when it comes due, and not before", async () => {
    // The test database is shared by every suite: other businesses left due would be backed up too, and make this one slow and its counts wrong.
    await t.ownerDb.db.execute(sql`update backup_settings set next_run_at = now() + interval '1 day' where tenant_id <> ${tenantId}`);
    expect(await runDueBackups(t.appDb.db, t.mailer, new Date())).toBe(0);
    await t.ownerDb.db.execute(sql`update backup_settings set next_run_at = now() - interval '1 minute' where tenant_id = ${tenantId}`);
    const before = (await get("/backups")).runs.length;
    expect(await runDueBackups(t.appDb.db, t.mailer, new Date())).toBeGreaterThanOrEqual(1);
    const s = await get("/backups");
    expect(s.runs.length).toBe(before + 1);
    expect(s.runs[0].trigger).toBe("schedule");
    expect(new Date(s.nextRunAt).getTime()).toBeGreaterThan(Date.now());
  });

  it("records a failure, tells the people named, and flags a gap", async () => {
    const sent: string[] = [];
    let attachments = 0;
    const broken: Mailer = { async send(m) { if (m.attachments?.length) { attachments += 1; throw new Error("smtp_down"); } sent.push(m.subject); } };
    const r = await runBackup(t.appDb.db, tenantId, "schedule", broken);
    expect(r).toMatchObject({ ok: false, error: "smtp_down" });
    expect(attachments).toBe(1);
    expect(sent[0]).toContain("backup failed");
    const s = await get("/backups");
    expect(s.runs[0]).toMatchObject({ status: "failed", error: "smtp_down" });
    expect(s.lastError).toBe("smtp_down");
    // No good copy for more than two cycles reads as overdue.
    await t.ownerDb.db.execute(sql`update backup_settings set last_ok_at = now() - interval '5 days' where tenant_id = ${tenantId}`);
    expect((await get("/backups")).overdue).toBe(true);
  });

  it("is private to the business", async () => {
    const other = (await t.signup("backups-other")).cookie;
    expect((await t.call(other, "GET", "/backups")).body).toMatchObject({ enabled: false, runs: [] });
    expect((await t.call(other, "POST", "/backups/run", {})).body.error).toBe("backup_not_set_up");
  });
});
