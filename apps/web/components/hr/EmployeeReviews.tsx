"use client";

import { Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Review { id: string; period: string; reviewedOn: string; rating: number; strengths: string | null; improvements: string | null }

/** Performance reviews for one employee: a rating with notes, kept as a history. */
export function EmployeeReviews({ employeeId, average, reviews, canEdit }: { employeeId: string; average: string | null; reviews: Review[]; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState("");
  const [reviewedOn, setReviewedOn] = useState(todayIso());
  const [rating, setRating] = useState("3");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function call(fn: () => Promise<unknown>, done?: () => void) {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, ["reviews.errors"])); } finally { setBusy(false); }
  }
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    void call(() => api(`/employees/${employeeId}/reviews`, { body: { period, reviewedOn, rating: Number(rating), strengths: strengths || undefined, improvements: improvements || undefined } }), () => { setOpen(false); setPeriod(""); setStrengths(""); setImprovements(""); });
  };
  const stars = (n: number) => <span className="inline-flex" aria-label={t("reviews.outOf", { n })}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`size-4 ${i <= n ? "fill-accent text-accent" : "text-muted"}`} aria-hidden />)}</span>;

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="font-semibold">{t("reviews.title")}{average ? <span className="ml-3 text-sm font-normal text-muted">{t("reviews.average", { n: average })}</span> : null}</h2>
        {canEdit && !open ? <Button variant="outline" onClick={() => setOpen(true)}>{t("reviews.add")}</Button> : null}
      </div>
      {open ? (
        <form onSubmit={save} method="post" className="grid gap-4 border-b border-border p-5 md:grid-cols-3">
          <Field label={t("reviews.period")} htmlFor="rv-period"><Input id="rv-period" value={period} onChange={(e) => setPeriod(e.target.value)} maxLength={20} placeholder="2026-H1" required /></Field>
          <Field label={t("reviews.date")} htmlFor="rv-date"><Input id="rv-date" type="date" value={reviewedOn} onChange={(e) => setReviewedOn(e.target.value)} required /></Field>
          <Field label={t("reviews.rating")} htmlFor="rv-rating"><Select id="rv-rating" value={rating} onChange={(e) => setRating(e.target.value)}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} {t(`reviews.scale.${n}`)}</option>)}</Select></Field>
          <div className="md:col-span-3"><Field label={t("reviews.strengths")} htmlFor="rv-str"><Input id="rv-str" value={strengths} onChange={(e) => setStrengths(e.target.value)} maxLength={500} /></Field></div>
          <div className="md:col-span-3"><Field label={t("reviews.improvements")} htmlFor="rv-imp"><Input id="rv-imp" value={improvements} onChange={(e) => setImprovements(e.target.value)} maxLength={500} /></Field></div>
          <div className="flex gap-3 md:col-span-3"><Button type="submit" disabled={busy}>{t("reviews.save")}</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("common.close")}</Button></div>
        </form>
      ) : null}
      {error ? <div className="px-5 pt-3"><Alert>{error}</Alert></div> : null}
      {reviews.length ? (
        <ul>
          {reviews.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 border-b border-border px-5 py-3 text-sm last:border-0">
              <div>
                <div className="flex flex-wrap items-center gap-3"><span className="font-medium">{r.period}</span>{stars(r.rating)}<span className="text-xs text-muted">{format.dateTime(new Date(`${r.reviewedOn}T00:00:00`), { dateStyle: "medium" })}</span></div>
                {r.strengths ? <p className="mt-1 text-muted">{t("reviews.strengthsLabel")}: {r.strengths}</p> : null}
                {r.improvements ? <p className="text-muted">{t("reviews.improvementsLabel")}: {r.improvements}</p> : null}
              </div>
              {canEdit ? <button type="button" aria-label={t("reviews.remove")} disabled={busy} onClick={() => call(() => api(`/employees/${employeeId}/reviews/${r.id}`, { method: "DELETE" }))} className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2"><Trash2 className="size-4" aria-hidden /></button> : null}
            </li>
          ))}
        </ul>
      ) : <p className="px-5 py-6 text-center text-sm text-muted">{t("reviews.none")}</p>}
    </Card>
  );
}
