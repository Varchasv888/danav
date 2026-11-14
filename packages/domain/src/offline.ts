/**
 * What the offline app may do for each action. "allowed": done on the device and sent later (the server checks it again and
 * applies it once). "read_only": the device shows its last copy but cannot change it. "online_only": needs the server at
 * the time, so the device refuses it while offline rather than guessing.
 */
export type OfflineMode = "allowed" | "read_only" | "online_only";

export const OFFLINE_ACTIONS: Record<string, { mode: OfflineMode; note: string }> = {
  "account.upsert": { mode: "allowed", note: "Add or edit a customer or supplier." },
  "voucher.create": { mode: "allowed", note: "Receipts, payments, journals and contras." },
  "voucher.cancel": { mode: "allowed", note: "Cancel a voucher; the server reverses it once." },
  "attendance.mark": { mode: "allowed", note: "Mark attendance." },
  "leave.request": { mode: "allowed", note: "Ask for leave." },
  "pos.bill": { mode: "allowed", note: "Counter bills, with the numbers the device was given." },
  "expense.claim": { mode: "allowed", note: "Submit an expense claim." },
  "sales.order": { mode: "allowed", note: "Take a sales order." },
  "stock.count": { mode: "allowed", note: "Count stock by scanning, as a spot check." },
  "masters.items": { mode: "read_only", note: "Items, prices and stock as of the last sync." },
  "masters.parties": { mode: "read_only", note: "Customers and their balances as of the last sync." },
  "pos.coupon": { mode: "online_only", note: "Discount cards and coupons are checked against the server." },
  "pos.giftVoucher": { mode: "online_only", note: "Gift voucher balances must be checked and spent on the server." },
  "gst.einvoice": { mode: "online_only", note: "E-invoice and e-way bill calls go to the tax portal." },
  "team.admin": { mode: "online_only", note: "Inviting people and changing roles." },
  "settings.locks": { mode: "online_only", note: "Period locks and numbering." },
  "settings.backup": { mode: "online_only", note: "Exporting or restoring the business's data." },
};
