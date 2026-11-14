"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input } from "../ui";

export interface Member { phone: string; name: string | null; points: number; lifetimePoints: number; birthday: string | null; anniversary: string | null }

/** The member list with a search box and a small form to set a member's name, birthday and anniversary. */
export function LoyaltyMembers({ members, q, canEdit }: { members: Member[]; q: string; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function edit(m: Member) {
    setEditing(m.phone); setName(m.name ?? ""); setBirthday(m.birthday ?? ""); setAnniversary(m.anniversary ?? "");
  }
  async function save(phone: string) {
    setBusy(true);
    setError(null);
    try {
      await api(`/loyalty/members/${phone}`, { method: "PATCH", body: { name: name || null, birthday: birthday || null, anniversary: anniversary || null } });
      setEditing(null);
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["loyalty.errors"])); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-3">
      <form method="get" className="flex items-end gap-3">
        <Field label={t("loyalty.search")} htmlFor="lm-q"><Input id="lm-q" name="q" defaultValue={q} className="w-64" /></Field>
        <Button type="submit" variant="outline">{t("loyalty.find")}</Button>
      </form>
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        {members.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-4 py-2 font-medium">{t("loyalty.member")}</th><th className="px-4 py-2 text-right font-medium">{t("loyalty.points")}</th><th className="px-4 py-2 text-right font-medium">{t("loyalty.lifetime")}</th>
                <th className="px-4 py-2 font-medium">{t("loyalty.birthday")}</th><th className="px-4 py-2 font-medium">{t("loyalty.anniversary")}</th><th className="px-4 py-2" />
              </tr></thead>
              <tbody>
                {members.map((m) => editing === m.phone ? (
                  <tr key={m.phone} className="border-b border-border bg-surface-2/60">
                    <td className="px-4 py-2"><Input aria-label={t("loyalty.name")} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /><span className="font-mono text-xs text-muted">{m.phone}</span></td>
                    <td className="num px-4 py-2 text-right">{m.points}</td><td className="num px-4 py-2 text-right">{m.lifetimePoints}</td>
                    <td className="px-4 py-2"><Input aria-label={t("loyalty.birthday")} type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} /></td>
                    <td className="px-4 py-2"><Input aria-label={t("loyalty.anniversary")} type="date" value={anniversary} onChange={(e) => setAnniversary(e.target.value)} /></td>
                    <td className="px-4 py-2 whitespace-nowrap"><Button type="button" disabled={busy} onClick={() => save(m.phone)}>{t("common.save")}</Button> <Button type="button" variant="ghost" onClick={() => setEditing(null)}>{t("common.cancel")}</Button></td>
                  </tr>
                ) : (
                  <tr key={m.phone} className="border-b border-border last:border-0">
                    <td className="px-4 py-2"><span className="font-medium">{m.name ?? ""}</span> <span className="font-mono text-xs text-muted">{m.phone}</span></td>
                    <td className="num px-4 py-2 text-right">{m.points}</td><td className="num px-4 py-2 text-right">{m.lifetimePoints}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{m.birthday ?? ""}</td><td className="px-4 py-2 whitespace-nowrap">{m.anniversary ?? ""}</td>
                    <td className="px-4 py-2 text-right">{canEdit ? <button type="button" onClick={() => edit(m)} className="text-primary hover:underline">{t("loyalty.edit")}</button> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-8 text-center text-muted">{t("loyalty.empty")}</p>}
      </Card>
    </div>
  );
}
