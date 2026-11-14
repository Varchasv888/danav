"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { PREFS, type PrefTab } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Card } from "../ui";

type Prefs = Record<string, boolean | string>;

/** The check boxes of a settings tab, drawn from the preference registry in sections; each change is saved as it is made. */
export function PrefControls({ tab, initial, canEdit }: { tab: PrefTab; initial: Prefs; canEdit: boolean }) {
  const t = useTranslations();
  const s = useTranslations("settingsUi");
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [error, setError] = useState<string | null>(null);
  const defs = PREFS.filter((d) => d.tab === tab);
  const sections = [...new Set(defs.map((d) => d.section))];

  async function set(key: string, value: boolean | string) {
    const before = prefs;
    setPrefs({ ...prefs, [key]: value });
    setError(null);
    try { setPrefs(await api<Prefs>("/settings/preferences", { method: "PUT", body: { [key]: value } })); }
    catch (err) { setPrefs(before); setError(errorText(t, err, ["settingsUi.errors"])); }
  }

  return (
    <Card className="mb-4 flex flex-col gap-4 p-4">
      {error ? <Alert>{error}</Alert> : null}
      {!canEdit ? <p className="text-sm text-muted">{s("readOnly")}</p> : null}
      {sections.map((sec) => (
        <fieldset key={sec} disabled={!canEdit} className="min-w-0">
          <legend className="mb-2 w-full border-b border-border pb-1.5 text-[1rem] font-semibold">{s(`section.${sec}`)}</legend>
          <div className="flex flex-col gap-3">
            {defs.filter((d) => d.section === sec).map((d) => {
              const name = d.key.split(".")[1]!;
              if (d.type === "enum") {
                return (
                  <label key={d.key} className="flex items-start justify-between gap-3 text-sm">
                    <span>{s(`pref.${name}`)}{s.has(`prefHint.${name}`) ? <span className="block text-xs text-muted">{s(`prefHint.${name}`)}</span> : null}</span>
                    <select value={String(prefs[d.key])} onChange={(e) => void set(d.key, e.target.value)} className="h-9 shrink-0 rounded-md border border-border bg-surface px-2">
                      {d.options!.map((o) => <option key={o} value={o}>{s(`opt.${name}.${o}`)}</option>)}
                    </select>
                  </label>
                );
              }
              return (
                <label key={d.key} className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <input type="checkbox" checked={prefs[d.key] === true} onChange={(e) => void set(d.key, e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-primary)]" />
                  <span>{s(`pref.${name}`)}{s.has(`prefHint.${name}`) ? <span className="block text-xs text-muted">{s(`prefHint.${name}`)}</span> : null}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </Card>
  );
}
