import type { Module } from "./permissions.js";

/**
 * Small named lists a business keeps for itself (G-Retail's masters): brands, fabrics, regions, return
 * reasons and so on. Each kind is one list; the module decides who may see and edit it. The kind names
 * are the menu keys (menu.i.<kind>) so the menu, the screen and the API share one word.
 */
export const LOOKUP_KINDS = {
  accountCategory: "sales", regionMaster: "sales", countryMaster: "sales", customerSubCategory: "sales", remarksMaster: "sales",
  sourceMaster: "sales", salesReturnReason: "sales", orderType: "sales",
  departmentMaster: "inventory", manufactureCompany: "inventory", brandMaster: "inventory", productMaster: "inventory", itemGroup: "inventory",
  fabric: "inventory", sleeves: "inventory", neck: "inventory", fit: "inventory", season: "inventory", styleAttr: "inventory",
  gender: "inventory", typeMaster: "inventory", subCategory9: "inventory", subCategory10: "inventory", materialMaster: "inventory",
  processMaster: "inventory", seasonMaster: "inventory",
  designation: "hr", employeeDepartment: "hr",
  transporterMaster: "sales",
} as const satisfies Record<string, Module>;

export type LookupKind = keyof typeof LOOKUP_KINDS;
export const LOOKUP_KIND_NAMES = Object.keys(LOOKUP_KINDS) as LookupKind[];

/** Kinds whose entries run between two dates (a selling season with its start and end). */
export const DATED_LOOKUPS: readonly LookupKind[] = ["seasonMaster"];

export const isLookupKind = (k: string): k is LookupKind => k in LOOKUP_KINDS;

/**
 * The ten attributes a style can carry (each is one of the lists above): fabric, sleeves, neck, fit, style,
 * gender, type, two spare sub-categories and material. A style stores one value of each at most.
 */
export const STYLE_ATTRIBUTES = ["fabric", "sleeves", "neck", "fit", "styleAttr", "gender", "typeMaster", "subCategory9", "subCategory10", "materialMaster"] as const satisfies readonly LookupKind[];
export type StyleAttribute = (typeof STYLE_ATTRIBUTES)[number];
