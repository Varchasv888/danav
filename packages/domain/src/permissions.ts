/**
 * Permission catalogue shared by the API, the web app and the Flutter app.
 * A permission is "<module>.<action>". Roles are sets of permissions; each tenant gets the
 * system roles below and may create its own.
 */
export const MODULES = [
  "company", "users", "accounts", "sales", "purchase", "inventory", "gst", "hr", "payroll", "reports", "settings",
  "banking", "assets", "expenses", "projects", "crm",
] as const;
export type Module = (typeof MODULES)[number];

export const ACTIONS = ["view", "create", "edit", "submit", "cancel", "delete", "export", "approve", "print", "reprint"] as const;
export type Action = (typeof ACTIONS)[number];

/**
 * Special rights: single powers that sit outside the module and action grid, because a person can be allowed
 * to enter bills yet not to back-date them, or to sell below cost. They are granted per role like any permission.
 */
export const SPECIAL_RIGHTS = ["changeDate", "futureDate", "sellBelowCost", "seeAgentCommission", "importData", "approveBankChange", "changeSaleRate"] as const;
export type SpecialRight = (typeof SPECIAL_RIGHTS)[number];
export type SpecialPermission = `special.${SpecialRight}`;
export const SPECIAL_PERMISSIONS: SpecialPermission[] = SPECIAL_RIGHTS.map((r) => `special.${r}` as SpecialPermission);

export type Permission = `${Module}.${Action}` | SpecialPermission;

export const ALL_PERMISSIONS: Permission[] = [...MODULES.flatMap((m) => ACTIONS.map((a) => `${m}.${a}` as Permission)), ...SPECIAL_PERMISSIONS];

const all = (m: Module): Permission[] => ACTIONS.map((a) => `${m}.${a}` as Permission);
const view = (...ms: Module[]): Permission[] => ms.map((m) => `${m}.view` as Permission);
const work = (m: Module): Permission[] => (["view", "create", "edit", "submit", "export", "print"] as const).map((a) => `${m}.${a}` as Permission);

export const SYSTEM_ROLES = {
  owner: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS.filter((p) => p !== "company.delete"),
  accountant: [...all("accounts"), ...all("gst"), ...work("sales"), ...work("purchase"), ...view("inventory", "company"), "reports.view", "reports.export",
    ...all("banking"), ...all("assets"), ...work("expenses"), "expenses.approve", ...view("projects", "crm"),
    "special.changeDate", "special.futureDate", "special.seeAgentCommission", "special.importData", "special.changeSaleRate"],
  sales: [...work("sales"), "sales.reprint", ...view("inventory", "company", "reports"), ...work("projects"), ...work("crm"), "special.changeSaleRate"],
  purchase: [...work("purchase"), ...view("inventory", "company", "reports"), "special.changeDate"],
  storekeeper: [...work("inventory"), ...view("sales", "purchase", "company")],
  hr: [...all("hr"), ...work("payroll"), ...view("company"), ...work("expenses")],
  viewer: MODULES.map((m) => `${m}.view` as Permission),
} satisfies Record<string, Permission[]>;

export type SystemRole = keyof typeof SYSTEM_ROLES;

export function hasPermission(granted: Iterable<string>, needed: Permission): boolean {
  for (const p of granted) if (p === needed) return true;
  return false;
}

/** The identity and compliance documents kept for an employee, with an optional expiry (licence, passport, medical fitness). */
export const EMPLOYEE_DOCUMENT_KINDS = ["aadhaar", "pan", "passport", "drivingLicence", "voterId", "bankProof", "policeVerification", "medicalFitness", "contract", "other"] as const;
export type EmployeeDocumentKind = (typeof EMPLOYEE_DOCUMENT_KINDS)[number];
