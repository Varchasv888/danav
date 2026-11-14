import { createHash, createHmac, randomInt, randomUUID } from "node:crypto";
import { HttpError } from "../lib/errors.js";

/**
 * GST Suvidha Provider (GSP) adapter: e-invoice (IRP), e-way bill (NIC) and GST returns (GSTN).
 *
 * `SimulatorGsp` follows the real rules so the whole flow works end to end before a GSP contract is
 * signed: the IRN is SHA-256 of (seller GSTIN + financial year + document type + document number),
 * duplicates are refused, an IRN or e-way bill can only be cancelled within 24 hours, an e-way bill
 * can only be extended from 8 hours before to 8 hours after it expires, and the GST portal accepts
 * the sandbox's fixed OTP. A real provider plugs in by implementing `Gsp`.
 */
export interface IrnRequest {
  sellerGstin: string;
  fyLabel: string; // "2026-27"
  docType: "INV" | "CRN" | "DBN";
  docNumber: string;
  payload: Record<string, unknown>;
}
export interface IrnResult { irn: string; ackNo: string; ackDate: Date; signedQrCode: string }
export interface EwbRequest {
  sellerGstin: string; docNumber: string; docDate: string; value: string; distanceKm: number; vehicleNo: string; fromPincode: string; toPincode: string;
}
export interface EwbResult { ewbNo: string; ewbDate: Date; validUpto: Date }
/** NIC reason codes. Cancel: 1 duplicate, 2 order cancelled, 3 data entry mistake, 4 others. */
export type EwbCancelReason = "1" | "2" | "3" | "4";
/** Vehicle change (Part-B): 1 breakdown, 2 transshipment, 3 others, 4 first time. */
export type EwbVehicleReason = "1" | "2" | "3" | "4";
/** Extension: 1 natural calamity, 2 law and order, 4 transshipment, 5 accident, 99 others. */
export type EwbExtendReason = "1" | "2" | "4" | "5" | "99";
export interface EwbRef { sellerGstin: string; ewbNo: string; ewbDate: Date; validUpto: Date }

export type GstReturnType = "GSTR1" | "GSTR3B";
export interface PortalSession { gstin: string; username: string; token: string }

export interface Gsp {
  readonly name: string;
  generateIrn(req: IrnRequest): Promise<IrnResult>;
  cancelIrn(req: { sellerGstin: string; irn: string; ackDate: Date; reason: "1" | "2" | "3" | "4"; remark: string }): Promise<{ cancelledAt: Date }>;
  generateEwb(req: EwbRequest): Promise<EwbResult>;
  updateEwbVehicle(req: EwbRef & { vehicleNo: string; fromPlace: string; fromState: string; reason: EwbVehicleReason; remark: string }): Promise<{ updatedAt: Date }>;
  extendEwb(req: EwbRef & { vehicleNo: string; fromPlace: string; fromState: string; fromPincode: string; remainingKm: number; reason: EwbExtendReason; remark: string }): Promise<{ validUpto: Date }>;
  cancelEwb(req: EwbRef & { reason: EwbCancelReason; remark: string }): Promise<{ cancelledAt: Date }>;

  // GST returns: the taxpayer allows API access on the GST portal, then logs in here with their
  // portal username and an OTP. Filing is signed with an EVC (OTP to the authorised signatory).
  requestPortalOtp(req: { gstin: string; username: string }): Promise<void>;
  authenticatePortal(req: { gstin: string; username: string; otp: string }): Promise<{ token: string; expiresAt: Date }>;
  saveReturn(req: PortalSession & { returnType: GstReturnType; period: string; payload: unknown }): Promise<{ referenceId: string }>;
  requestEvcOtp(req: PortalSession & { pan: string; returnType: GstReturnType; period: string }): Promise<void>;
  fileReturn(req: PortalSession & { pan: string; returnType: GstReturnType; period: string; otp: string }): Promise<{ arn: string; filedAt: Date }>;
}

export class GspError extends HttpError {
  constructor(code: string, message?: string) {
    super(422, code, message);
  }
}

export const irnFor = (gstin: string, fyLabel: string, docType: string, docNumber: string) =>
  createHash("sha256").update(`${gstin}${fyLabel}${docType}${docNumber}`).digest("hex");

const b64url = (s: string) => Buffer.from(s).toString("base64url");
const HOUR = 3600_000;
const IST_OFFSET_MS = 330 * 60_000;
/** The GST sandbox accepts this fixed OTP; the simulator does the same. */
export const SIMULATOR_OTP = "575757";

/**
 * E-way bill validity (Rule 138(10)): 1 day for up to 200 km of normal cargo, one more day per further
 * 200 km; each "day" ends at midnight after the date of generation (Indian time).
 */
export function ewbValidUpto(generatedAt: Date, distanceKm: number): Date {
  const days = Math.max(1, Math.ceil(distanceKm / 200));
  const ist = new Date(generatedAt.getTime() + IST_OFFSET_MS);
  const endIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + days, 23, 59, 59);
  return new Date(endIst - IST_OFFSET_MS);
}

export class SimulatorGsp implements Gsp {
  readonly name = "simulator";
  private readonly issued = new Set<string>();
  constructor(private readonly secret = "varchasv-simulator") {}

  async generateIrn(req: IrnRequest): Promise<IrnResult> {
    const irn = irnFor(req.sellerGstin, req.fyLabel, req.docType, req.docNumber);
    if (this.issued.has(irn)) throw new GspError("duplicate_irn", "2150: Duplicate IRN");
    this.issued.add(irn);
    const ackDate = new Date();
    const ackNo = `${ackDate.getUTCFullYear() % 100}${String(randomInt(10 ** 12, 10 ** 13 - 1))}`; // 15 digits, like the IRP
    const p = req.payload as { BuyerDtls?: { Gstin?: string }; DocDtls?: { Dt?: string }; ValDtls?: { TotInvVal?: number }; ItemList?: { HsnCd: string }[] };
    // Same claims the IRP puts in its signed QR code. Signed with HMAC here; the IRP uses its RSA key.
    const claims = {
      SellerGstin: req.sellerGstin, BuyerGstin: p.BuyerDtls?.Gstin ?? "URP", DocNo: req.docNumber, DocTyp: req.docType, DocDt: p.DocDtls?.Dt,
      TotInvVal: p.ValDtls?.TotInvVal, ItemCnt: p.ItemList?.length ?? 0, MainHsnCode: p.ItemList?.[0]?.HsnCd, Irn: irn, IrnDt: ackDate.toISOString(),
      iss: "NIC-SIMULATOR",
    };
    const head = b64url(JSON.stringify({ alg: "HS256", typ: "JWT", kid: "simulator" }));
    const body = b64url(JSON.stringify({ data: JSON.stringify(claims) }));
    const sig = createHmac("sha256", this.secret).update(`${head}.${body}`).digest("base64url");
    return { irn, ackNo, ackDate, signedQrCode: `${head}.${body}.${sig}` };
  }

  async cancelIrn(req: { irn: string; ackDate: Date }) {
    if (Date.now() - req.ackDate.getTime() > 24 * HOUR) throw new GspError("irn_cancel_window_passed", "IRN can be cancelled only within 24 hours");
    return { cancelledAt: new Date() };
  }

  private checkVehicle(vehicleNo: string) {
    if (!/^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(vehicleNo.replace(/[\s-]/g, "").toUpperCase())) throw new GspError("invalid_vehicle_no");
  }

  async generateEwb(req: EwbRequest): Promise<EwbResult> {
    this.checkVehicle(req.vehicleNo);
    if (req.distanceKm < 1 || req.distanceKm > 4000) throw new GspError("invalid_distance");
    const ewbDate = new Date();
    return { ewbNo: String(randomInt(10 ** 11, 10 ** 12 - 1)), ewbDate, validUpto: ewbValidUpto(ewbDate, req.distanceKm) };
  }

  async updateEwbVehicle(req: EwbRef & { vehicleNo: string }) {
    this.checkVehicle(req.vehicleNo);
    if (Date.now() > req.validUpto.getTime()) throw new GspError("ewb_expired", "The e-way bill has expired; extend it instead");
    return { updatedAt: new Date() };
  }

  async extendEwb(req: EwbRef & { vehicleNo: string; remainingKm: number }) {
    this.checkVehicle(req.vehicleNo);
    const now = Date.now();
    // Rule 138(10) proviso: extension only within 8 hours before or after expiry.
    if (now < req.validUpto.getTime() - 8 * HOUR || now > req.validUpto.getTime() + 8 * HOUR) {
      throw new GspError("ewb_extension_window", "An e-way bill can be extended only from 8 hours before to 8 hours after it expires");
    }
    if (req.remainingKm < 1 || req.remainingKm > 4000) throw new GspError("invalid_distance");
    return { validUpto: ewbValidUpto(new Date(now), req.remainingKm) };
  }

  async cancelEwb(req: EwbRef) {
    if (Date.now() - req.ewbDate.getTime() > 24 * HOUR) throw new GspError("ewb_cancel_window_passed", "An e-way bill can be cancelled only within 24 hours");
    return { cancelledAt: new Date() };
  }

  // Portal tokens check themselves (expiry + HMAC), so they survive an API restart like real ones.
  private sign(s: string) { return createHmac("sha256", this.secret).update(s).digest("base64url"); }
  private checkToken(req: PortalSession) {
    const [exp, sig] = req.token.split(".");
    if (!exp || !sig || sig !== this.sign(`${req.gstin}|${req.username}|${exp}`) || Date.now() > Number(exp)) throw new GspError("gst_session_expired");
  }

  async requestPortalOtp(req: { gstin: string; username: string }) {
    if (!/^[A-Za-z0-9._-]{3,60}$/.test(req.username)) throw new GspError("invalid_portal_username");
  }

  async authenticatePortal(req: { gstin: string; username: string; otp: string }) {
    if (req.otp !== SIMULATOR_OTP) throw new GspError("invalid_otp");
    const expiresAt = new Date(Date.now() + 6 * HOUR);
    const exp = String(expiresAt.getTime());
    return { token: `${exp}.${this.sign(`${req.gstin}|${req.username}|${exp}`)}`, expiresAt };
  }

  async saveReturn(req: PortalSession & { payload: unknown }) {
    this.checkToken(req);
    if (!req.payload || typeof req.payload !== "object") throw new GspError("invalid_return_payload");
    return { referenceId: randomUUID().replaceAll("-", "").slice(0, 20) };
  }

  async requestEvcOtp(req: PortalSession & { pan: string }) {
    this.checkToken(req);
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(req.pan)) throw new GspError("invalid_pan");
  }

  async fileReturn(req: PortalSession & { period: string; otp: string }) {
    this.checkToken(req);
    if (req.otp !== SIMULATOR_OTP) throw new GspError("invalid_otp");
    // ARN: AA + state code + MMYY + 6 digits + a check letter, like the portal's.
    const serial = String(randomInt(0, 999_999)).padStart(6, "0");
    const arn = `AA${req.gstin.slice(0, 2)}${req.period.slice(0, 2)}${req.period.slice(4, 6)}${serial}${String.fromCharCode(65 + randomInt(0, 26))}`;
    return { arn, filedAt: new Date() };
  }
}

let current: Gsp = new SimulatorGsp();
export const gsp = () => current;
/** Tests and future provider wiring swap the implementation here. */
export const useGsp = (g: Gsp) => { current = g; };
