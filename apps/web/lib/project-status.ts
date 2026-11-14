/** Badge tone for project and timesheet statuses (shared by server pages and client components). */
const TONE: Record<string, string> = { submitted: "partial", approved: "open", rejected: "cancelled", billed: "completed", active: "open", on_hold: "partial", completed: "completed", cancelled: "cancelled" };
export const statusTone = (s: string) => TONE[s] ?? "closed";
