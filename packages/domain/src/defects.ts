/** Why goods were received damaged: the code a supplier claim is raised under, so a recurring fault shows up by supplier. */
export const DEFECT_CODES = ["stitching", "fabric", "colour", "size", "print", "packing", "other"] as const;
export type DefectCode = (typeof DEFECT_CODES)[number];
