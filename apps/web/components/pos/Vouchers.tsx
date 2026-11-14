"use client";

import { Gift, Pencil, Plus, Ticket, Trophy, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface GiftVoucher { id: string; code: string; value: string; balance: string; issuedOn: string; expiresOn: string; status: string; customerName: string | null; customerPhone: string | null }
export interface Coupon { id: string; code: string; kind: "percent" | "amount"; value: string; maxDiscount: string | null; minBill: string | null; startsOn: string | null; endsOn: string | null; maxUses: number | null; used: number; active: boolean }
export interface DiscountCard { id: string; number: string; holder: string; phone: string | null; pct: string; validUntil: string | null; active: boolean }
export interface LuckyDraw { id: string; name: string; fromDate: string; toDate: string; minBill: string | null; entries: number; winners: { billId: string; number: string; phone: string; name: string | null; total: string }[]; createdAt: string }

const AMOUNT = /^\d+(\.\d{1,2})?$/;
const plusYear = (iso: string) => `${Number(iso.slice(0, 4)) + 1}${iso.slice(4)}`;
const maskPhone = (p: string) => `${p.slice(0, 2)}XXXXXX${p.slice(8)}`;

function useSave() {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<unknown>, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      after?.();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      setError(t.has(`promos.errors.${code}`) ? t(`promos.errors.${code}`) : t.has(`pos.promo.errors.${code}`) ? t(`pos.promo.errors.${code}`) : t("auth.errors.generic"));
    }
    setBusy(false);
  };
  return { error, setError, busy, run };
}

const Section = ({ icon: Icon, title, children }: { icon: typeof Gift; title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="flex items-center gap-2 font-semibold"><Icon className="size-4 text-primary" aria-hidden />{title}</h2>
    {children}
  </section>
);

/** Gift vouchers, coupons, discount cards and lucky draws on one page. */
export function Vouchers({ vouchers, coupons, cards, draws, canEdit, canExpire, canDraw }: {
  vouchers: GiftVoucher[]; coupons: Coupon[]; cards: DiscountCard[]; draws: LuckyDraw[]; canEdit: boolean; canExpire: boolean; canDraw: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const outstanding = vouchers.filter((v) => v.status === "active").reduce((s, v) => s + Number(v.balance), 0);
  return (
    <div className="flex flex-col gap-10">
      <Section icon={Gift} title={t("promos.gift.title")}>
        <p className="text-sm text-muted">{t("promos.gift.hint", { amount: rupees(outstanding) })}</p>
        {canEdit ? <IssueForm /> : null}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="text-left text-muted">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium">{t("promos.gift.code")}</th>
                  <th className="px-5 py-3 font-medium">{t("promos.gift.for")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("promos.gift.value")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("promos.gift.balance")}</th>
                  <th className="px-5 py-3 font-medium">{t("promos.gift.expires")}</th>
                  <th className="px-5 py-3 font-medium">{t("promos.status")}</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.id} className={`border-b border-border last:border-0 ${v.status === "active" ? "" : "text-muted"}`}>
                    <td className="px-5 py-2.5 font-mono">{v.code}</td>
                    <td className="px-5 py-2.5">{v.customerName ?? ""}{v.customerPhone ? <span className="block text-xs text-muted">{maskPhone(v.customerPhone)}</span> : null}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(v.value)}</td>
                    <td className="num px-5 py-2.5 text-right font-medium">{rupees(v.balance)}</td>
                    <td className="px-5 py-2.5">{d(v.expiresOn)}</td>
                    <td className="px-5 py-2.5">{t(`promos.statuses.${v.status}`)}</td>
                  </tr>
                ))}
                {!vouchers.length ? <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">{t("promos.gift.empty")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
        {canExpire ? <ExpireButton /> : null}
      </Section>

      <Section icon={Ticket} title={t("promos.coupons.title")}>
        <CouponList coupons={coupons} canEdit={canEdit} d={d} />
      </Section>

      <Section icon={WalletCards} title={t("promos.cards.title")}>
        <CardList cards={cards} canEdit={canEdit} d={d} />
      </Section>

      <Section icon={Trophy} title={t("promos.draw.title")}>
        {canDraw ? <DrawForm /> : null}
        {draws.map((dr) => (
          <Card key={dr.id}>
            <p className="font-medium">{dr.name}</p>
            <p className="text-sm text-muted">{t("promos.draw.summary", { from: d(dr.fromDate), to: d(dr.toDate), entries: dr.entries })}</p>
            <ol className="mt-2 list-decimal pl-5 text-sm">
              {dr.winners.map((w) => <li key={w.billId}><span className="font-medium">{w.name ?? maskPhone(w.phone)}</span> · {maskPhone(w.phone)} · <span className="font-mono">{w.number}</span> · <span className="num">{rupees(w.total)}</span></li>)}
            </ol>
          </Card>
        ))}
        {!draws.length ? <p className="text-sm text-muted">{t("promos.draw.empty")}</p> : null}
      </Section>
    </div>
  );
}

function IssueForm() {
  const t = useTranslations();
  const { error, setError, busy, run } = useSave();
  const [issued, setIssued] = useState<string[]>([]);
  async function issue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    if (!AMOUNT.test(s("value"))) { setError(t("promos.errors.invalid_amount")); return; }
    await run(async () => {
      const rows = await api<{ code: string }[]>("/gift-vouchers", {
        body: { value: s("value"), count: Number(s("count") || 1), expiresOn: s("expiresOn"), paidBy: s("paidBy"), ...(s("phone") ? { customerPhone: s("phone") } : {}), ...(s("name") ? { customerName: s("name") } : {}) },
      });
      setIssued(rows.map((r) => r.code));
      form.reset();
    });
  }
  return (
    <Card>
      <form onSubmit={issue} className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {error ? <div className="md:col-span-3 xl:col-span-6"><Alert>{error}</Alert></div> : null}
        {issued.length ? <p className="rounded-lg bg-success-soft p-3 text-sm text-success md:col-span-3 xl:col-span-6">{t("promos.gift.issued")} <span className="font-mono">{issued.join(", ")}</span></p> : null}
        <Field label={t("promos.gift.value")} htmlFor="gv-value"><Input id="gv-value" name="value" inputMode="decimal" className="num" required /></Field>
        <Field label={t("promos.gift.count")} htmlFor="gv-count"><Input id="gv-count" name="count" type="number" min={1} max={200} defaultValue={1} className="num" /></Field>
        <Field label={t("promos.gift.expires")} htmlFor="gv-exp"><Input id="gv-exp" name="expiresOn" type="date" defaultValue={plusYear(todayIso())} required /></Field>
        <Field label={t("promos.gift.paidBy")} htmlFor="gv-paid">
          <Select id="gv-paid" name="paidBy" defaultValue="cash">{(["cash", "upi", "card"] as const).map((m) => <option key={m} value={m}>{t(`pos.billing.modes.${m}`)}</option>)}</Select>
        </Field>
        <Field label={t("pos.billing.customerName")} htmlFor="gv-name"><Input id="gv-name" name="name" maxLength={80} /></Field>
        <Field label={t("pos.billing.customer")} htmlFor="gv-phone"><Input id="gv-phone" name="phone" inputMode="tel" maxLength={10} pattern="[6-9][0-9]{9}" className="num" /></Field>
        <div className="md:col-span-3 xl:col-span-6"><Button type="submit" disabled={busy}><Plus className="size-4" aria-hidden />{t("promos.gift.sell")}</Button></div>
      </form>
    </Card>
  );
}

function ExpireButton() {
  const t = useTranslations();
  const { error, busy, run } = useSave();
  const [done, setDone] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" disabled={busy} onClick={() => run(async () => {
          const r = await api<{ expired: number; amount: string }>("/gift-vouchers/expire", { body: { asOf: todayIso() } });
          setDone(t("promos.gift.expiredDone", { n: r.expired, amount: rupees(r.amount) }));
        })}>{t("promos.gift.expire")}</Button>
        <span className="text-sm text-muted">{done ?? t("promos.gift.expireHint")}</span>
      </div>
    </div>
  );
}

function CouponList({ coupons, canEdit, d }: { coupons: Coupon[]; canEdit: boolean; d: (iso: string) => string }) {
  const t = useTranslations();
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);
  return (
    <>
      {canEdit && !editing ? <div><Button variant="outline" onClick={() => setEditing("new")}><Plus className="size-4" aria-hidden />{t("promos.coupons.new")}</Button></div> : null}
      {editing ? <CouponForm key={editing === "new" ? "new" : editing.id} coupon={editing === "new" ? null : editing} onDone={() => setEditing(null)} /> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("promos.coupons.code")}</th>
                <th className="px-5 py-3 font-medium">{t("promos.coupons.off")}</th>
                <th className="px-5 py-3 font-medium">{t("promos.coupons.valid")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("promos.coupons.used")}</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className={`border-b border-border last:border-0 ${c.active ? "" : "text-muted"}`}>
                  <td className="px-5 py-2.5 font-mono">{c.code}</td>
                  <td className="px-5 py-2.5">
                    {c.kind === "percent" ? `${Number(c.value)}%` : rupees(c.value)}
                    {c.maxDiscount ? ` · ${t("promos.coupons.upTo", { amount: rupees(c.maxDiscount) })}` : ""}
                    {c.minBill ? ` · ${t("schemes.sum.min", { amount: rupees(c.minBill) })}` : ""}
                  </td>
                  <td className="px-5 py-2.5 text-muted">{c.startsOn || c.endsOn ? t("schemes.range", { from: c.startsOn ? d(c.startsOn) : t("schemes.now"), to: c.endsOn ? d(c.endsOn) : t("schemes.noEnd") }) : t("schemes.always")}</td>
                  <td className="num px-5 py-2.5 text-right">{c.used}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                  <td className="px-3 py-2.5 text-right">
                    {canEdit ? <button type="button" onClick={() => setEditing(c)} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text" title={t("common.edit")}><Pencil className="size-4" aria-hidden /><span className="sr-only">{t("common.edit")}</span></button> : null}
                  </td>
                </tr>
              ))}
              {!coupons.length ? <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">{t("promos.coupons.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function CouponForm({ coupon, onDone }: { coupon: Coupon | null; onDone: () => void }) {
  const t = useTranslations();
  const { error, setError, busy, run } = useSave();
  const [kind, setKind] = useState<"percent" | "amount">(coupon?.kind ?? "percent");
  const n = (v: string | null | undefined) => (v ? String(Number(v)) : "");
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    for (const k of ["value", "maxDiscount", "minBill"]) if (s(k) && !AMOUNT.test(s(k))) { setError(t("promos.errors.invalid_amount")); return; }
    const body = {
      code: s("code"), kind, value: s("value"), maxDiscount: kind === "percent" ? s("maxDiscount") || null : null, minBill: s("minBill") || null,
      startsOn: s("startsOn") || null, endsOn: s("endsOn") || null, maxUses: s("maxUses") ? Number(s("maxUses")) : null, active: f.get("active") === "on",
    };
    void run(() => (coupon ? api(`/coupons/${coupon.id}`, { method: "PUT", body }) : api("/coupons", { body })), onDone);
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {error ? <div className="md:col-span-3 xl:col-span-4"><Alert>{error}</Alert></div> : null}
        <Field label={t("promos.coupons.code")} htmlFor="cp-code"><Input id="cp-code" name="code" defaultValue={coupon?.code} required minLength={3} maxLength={20} pattern="[A-Za-z0-9-]+" className="uppercase" autoFocus /></Field>
        <Field label={t("schemes.kind")} htmlFor="cp-kind">
          <Select id="cp-kind" value={kind} onChange={(e) => setKind(e.target.value as "percent" | "amount")}>
            <option value="percent">{t("schemes.kinds.percent")}</option>
            <option value="amount">{t("schemes.kinds.amount_off")}</option>
          </Select>
        </Field>
        <Field label={kind === "percent" ? t("schemes.pct") : t("schemes.amount")} htmlFor="cp-value"><Input id="cp-value" name="value" defaultValue={n(coupon?.value)} inputMode="decimal" className="num" required /></Field>
        {kind === "percent" ? <Field label={t("promos.coupons.maxDiscount")} htmlFor="cp-max"><Input id="cp-max" name="maxDiscount" defaultValue={n(coupon?.maxDiscount)} inputMode="decimal" className="num" /></Field> : <div className="hidden xl:block" />}
        <Field label={t("promos.coupons.minBill")} htmlFor="cp-min"><Input id="cp-min" name="minBill" defaultValue={n(coupon?.minBill)} inputMode="decimal" className="num" /></Field>
        <Field label={t("schemes.startsOn")} htmlFor="cp-from"><Input id="cp-from" name="startsOn" type="date" defaultValue={coupon?.startsOn ?? ""} /></Field>
        <Field label={t("schemes.endsOn")} htmlFor="cp-to"><Input id="cp-to" name="endsOn" type="date" defaultValue={coupon?.endsOn ?? ""} /></Field>
        <Field label={t("promos.coupons.maxUses")} htmlFor="cp-uses" hint={t("promos.coupons.maxUsesHint")}><Input id="cp-uses" name="maxUses" type="number" min={1} defaultValue={coupon?.maxUses ?? ""} className="num" /></Field>
        <div className="flex flex-wrap items-center gap-3 md:col-span-3 xl:col-span-4">
          <Button type="submit" disabled={busy}>{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
          <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} className="size-4 accent-[var(--primary)]" />{t("schemes.active")}</label>
        </div>
      </form>
    </Card>
  );
}

function CardList({ cards, canEdit, d }: { cards: DiscountCard[]; canEdit: boolean; d: (iso: string) => string }) {
  const t = useTranslations();
  const [editing, setEditing] = useState<DiscountCard | "new" | null>(null);
  return (
    <>
      {canEdit && !editing ? <div><Button variant="outline" onClick={() => setEditing("new")}><Plus className="size-4" aria-hidden />{t("promos.cards.new")}</Button></div> : null}
      {editing ? <CardForm key={editing === "new" ? "new" : editing.id} card={editing === "new" ? null : editing} onDone={() => setEditing(null)} /> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("promos.cards.number")}</th>
                <th className="px-5 py-3 font-medium">{t("promos.cards.holder")}</th>
                <th className="px-5 py-3 text-right font-medium">%</th>
                <th className="px-5 py-3 font-medium">{t("promos.cards.validUntil")}</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className={`border-b border-border last:border-0 ${c.active ? "" : "text-muted"}`}>
                  <td className="px-5 py-2.5 font-mono">{c.number}</td>
                  <td className="px-5 py-2.5">{c.holder}{c.phone ? <span className="block text-xs text-muted">{maskPhone(c.phone)}</span> : null}</td>
                  <td className="num px-5 py-2.5 text-right">{Number(c.pct)}%</td>
                  <td className="px-5 py-2.5 text-muted">{c.validUntil ? d(c.validUntil) : t("schemes.noEnd")}</td>
                  <td className="px-3 py-2.5 text-right">
                    {canEdit ? <button type="button" onClick={() => setEditing(c)} className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-text" title={t("common.edit")}><Pencil className="size-4" aria-hidden /><span className="sr-only">{t("common.edit")}</span></button> : null}
                  </td>
                </tr>
              ))}
              {!cards.length ? <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">{t("promos.cards.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function CardForm({ card, onDone }: { card: DiscountCard | null; onDone: () => void }) {
  const t = useTranslations();
  const { error, setError, busy, run } = useSave();
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    if (!AMOUNT.test(s("pct"))) { setError(t("promos.errors.invalid_percent")); return; }
    const body = { number: s("number"), holder: s("holder"), phone: s("phone") || null, pct: s("pct"), validUntil: s("validUntil") || null, active: f.get("active") === "on" };
    void run(() => (card ? api(`/discount-cards/${card.id}`, { method: "PUT", body }) : api("/discount-cards", { body })), onDone);
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {error ? <div className="md:col-span-3 xl:col-span-5"><Alert>{error}</Alert></div> : null}
        <Field label={t("promos.cards.number")} htmlFor="dc-no"><Input id="dc-no" name="number" defaultValue={card?.number} required minLength={3} maxLength={20} pattern="[A-Za-z0-9-]+" className="uppercase" autoFocus /></Field>
        <Field label={t("promos.cards.holder")} htmlFor="dc-holder"><Input id="dc-holder" name="holder" defaultValue={card?.holder} required maxLength={80} /></Field>
        <Field label={t("pos.billing.customer")} htmlFor="dc-phone"><Input id="dc-phone" name="phone" defaultValue={card?.phone ?? ""} inputMode="tel" maxLength={10} pattern="[6-9][0-9]{9}" className="num" /></Field>
        <Field label={t("schemes.pct")} htmlFor="dc-pct"><Input id="dc-pct" name="pct" defaultValue={card ? Number(card.pct) : ""} inputMode="decimal" className="num" required /></Field>
        <Field label={t("promos.cards.validUntil")} htmlFor="dc-until"><Input id="dc-until" name="validUntil" type="date" defaultValue={card?.validUntil ?? ""} /></Field>
        <div className="flex flex-wrap items-center gap-3 md:col-span-3 xl:col-span-5">
          <Button type="submit" disabled={busy}>{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
          <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={card?.active ?? true} className="size-4 accent-[var(--primary)]" />{t("schemes.active")}</label>
        </div>
      </form>
    </Card>
  );
}

function DrawForm() {
  const t = useTranslations();
  const { error, setError, busy, run } = useSave();
  function draw(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    if (s("minBill") && !AMOUNT.test(s("minBill"))) { setError(t("promos.errors.invalid_amount")); return; }
    void run(() => api("/lucky-draws", { body: { name: s("name"), fromDate: s("fromDate"), toDate: s("toDate"), winners: Number(s("winners") || 1), ...(s("minBill") ? { minBill: s("minBill") } : {}) } }), () => form.reset());
  }
  const month = `${todayIso().slice(0, 7)}-01`;
  return (
    <Card>
      <form onSubmit={draw} className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {error ? <div className="md:col-span-3 xl:col-span-6"><Alert>{error}</Alert></div> : null}
        <div className="md:col-span-2"><Field label={t("schemes.name")} htmlFor="ld-name"><Input id="ld-name" name="name" required maxLength={80} /></Field></div>
        <Field label={t("schemes.startsOn")} htmlFor="ld-from"><Input id="ld-from" name="fromDate" type="date" defaultValue={month} required /></Field>
        <Field label={t("schemes.endsOn")} htmlFor="ld-to"><Input id="ld-to" name="toDate" type="date" defaultValue={todayIso()} required /></Field>
        <Field label={t("promos.coupons.minBill")} htmlFor="ld-min"><Input id="ld-min" name="minBill" inputMode="decimal" className="num" /></Field>
        <Field label={t("promos.draw.winners")} htmlFor="ld-win"><Input id="ld-win" name="winners" type="number" min={1} max={100} defaultValue={3} className="num" /></Field>
        <p className="text-sm text-muted md:col-span-3 xl:col-span-6">{t("promos.draw.hint")}</p>
        <div className="md:col-span-3 xl:col-span-6"><Button type="submit" disabled={busy}><Trophy className="size-4" aria-hidden />{t("promos.draw.run")}</Button></div>
      </form>
    </Card>
  );
}
