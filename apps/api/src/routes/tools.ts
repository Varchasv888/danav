import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { GST_STATES, amountInWords, computeInvoiceTax, isValidStateCode, validateGstin } from "@varchasv/domain";

const Amount = z.union([z.string().regex(/^-?\d+(\.\d+)?$/), z.number()]).transform(String);

/** Stateless helpers the UI calls; no tenant data involved. */
export async function toolRoutes(app: FastifyInstance) {
  app.get("/meta/states", async () => GST_STATES);

  app.post("/tools/gstin", async (req) => {
    const { gstin } = z.object({ gstin: z.string().max(20) }).parse(req.body);
    return validateGstin(gstin);
  });

  app.post("/tools/gst", async (req) => {
    const body = z.object({
      ctx: z.object({
        supplierState: z.string().refine(isValidStateCode),
        placeOfSupply: z.string().refine(isValidStateCode),
        sez: z.boolean().optional(),
        lut: z.boolean().optional(),
        reverseCharge: z.boolean().optional(),
        roundOff: z.boolean().optional(),
      }),
      lines: z.array(z.object({
        qty: Amount, rate: Amount, discount: Amount.optional(), gstRate: Amount, cessRate: Amount.optional(),
      })).min(1).max(500),
      lang: z.enum(["en", "hi"]).default("en"),
    }).parse(req.body);
    const tax = computeInvoiceTax(body.lines, body.ctx);
    return { ...tax, inWords: amountInWords(tax.grandTotal, body.lang) };
  });
}
