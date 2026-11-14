import { getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Account { name: string; phone: string | null; address: { line1?: string; line2?: string; city?: string; pincode?: string } | null }

export async function generateMetadata() {
  return { title: { absolute: "Envelope" } };
}

/** A party's name and address on a DL envelope (220 by 110 mm), placed where the post expects it. */
export default async function EnvelopePage({ params }: { params: Promise<{ id: string }> }) {
  const a = await serverApi<Account>(`/accounts/${(await params).id}`);
  const t = await getTranslations("envelopePrint");
  const ad = a.address ?? {};
  return (
    <main className="mx-auto bg-white p-6 text-black print:p-0"><PrintSetup size="220mm 110mm" margin="0" />
      <div className="mb-4 print:hidden"><PrintButton /><p className="mt-2 text-sm text-gray-600">{t("help")}</p></div>
      <div className="relative border border-dashed border-gray-300 print:border-0" style={{ width: "220mm", height: "110mm" }}>
        <div className="absolute text-[15px] leading-6" style={{ left: "95mm", top: "45mm", width: "110mm" }}>
          <p className="font-semibold">{a.name}</p>
          {ad.line1 ? <p>{ad.line1}</p> : null}
          {ad.line2 ? <p>{ad.line2}</p> : null}
          {ad.city || ad.pincode ? <p>{[ad.city, ad.pincode].filter(Boolean).join(" - ")}</p> : null}
          {a.phone ? <p className="text-[13px]">{t("phone")}: {a.phone}</p> : null}
        </div>
      </div>
    </main>
  );
}
