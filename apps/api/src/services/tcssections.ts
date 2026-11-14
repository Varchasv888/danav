import { and, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { TCS_SECTIONS } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const sectionCodes = new Set(TCS_SECTIONS.map((section) => section.code));

export async function listTcsSectionSettings(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const companies = await tx.select({ id: tables.companies.id, name: tables.companies.name })
    .from(tables.companies).orderBy(tables.companies.createdAt);
  const rows = await tx.select({ section: tables.tcsSectionSettings.section, enabled: tables.tcsSectionSettings.enabled })
    .from(tables.tcsSectionSettings).where(eq(tables.tcsSectionSettings.companyId, company.id));
  const enabledBySection = new Map(rows.map((row) => [row.section, row.enabled]));
  return {
    companyId: company.id,
    companies,
    sections: TCS_SECTIONS.map((section) => ({ ...section, enabled: enabledBySection.get(section.code) ?? true })),
  };
}

export async function listEnabledTcsSections(tx: Tx, companyId?: string) {
  const settings = await listTcsSectionSettings(tx, companyId);
  return settings.sections.filter((section) => section.enabled).map(({ enabled: _enabled, ...section }) => section);
}

export async function assertTcsSectionEnabled(tx: Tx, companyId: string, section: string) {
  const [setting] = await tx.select({ enabled: tables.tcsSectionSettings.enabled }).from(tables.tcsSectionSettings)
    .where(and(eq(tables.tcsSectionSettings.companyId, companyId), eq(tables.tcsSectionSettings.section, section)));
  if (setting && !setting.enabled) throw badRequest("section_disabled");
}

export async function saveTcsSectionSettings(
  tx: Tx,
  actor: Actor,
  companyId: string | undefined,
  enabledSections: string[],
) {
  const company = await resolveCompany(tx, companyId);
  if (enabledSections.some((section) => !sectionCodes.has(section))) throw badRequest("unknown_section");
  if (new Set(enabledSections).size !== enabledSections.length) throw badRequest("duplicate_section");

  const old = await listTcsSectionSettings(tx, company.id);
  const enabled = new Set(enabledSections);
  const next = TCS_SECTIONS.map((section) => ({ section: section.code, enabled: enabled.has(section.code) }));
  const oldBySection = new Map(old.sections.map((section) => [section.code, section.enabled]));
  const changed = next.filter((row) => oldBySection.get(row.section) !== row.enabled);

  for (const row of next) {
    await tx.insert(tables.tcsSectionSettings).values({
      tenantId: actor.tenantId,
      companyId: company.id,
      section: row.section,
      enabled: row.enabled,
      updatedBy: actor.userId,
    }).onConflictDoUpdate({
      target: [tables.tcsSectionSettings.companyId, tables.tcsSectionSettings.section],
      set: { enabled: row.enabled, updatedBy: actor.userId, updatedAt: new Date() },
    });
  }

  if (changed.length) await audit(tx, {
    tenantId: actor.tenantId,
    userId: actor.userId,
    action: "update",
    entity: "tcs_section_settings",
    entityId: company.id,
    before: changed.map(({ section }) => ({ section, enabled: oldBySection.get(section) ?? true })),
    after: changed,
    ip: actor.ip,
  });

  return { companyId: company.id, updated: changed.length, enabledSections: next.filter((row) => row.enabled).map((row) => row.section) };
}
