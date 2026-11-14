"use client";

import { ArrowUpToLine, Camera, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { fileUrl, uploadPhoto } from "@/lib/images";
import { Alert, Card, Field, Select } from "../ui";

export interface StyleImage { id: string; color: string | null; view: string; fileId: string; thumbFileId: string }
const VIEWS = ["front", "back", "detail", "model", "other"] as const;

/** Photos of a style by colour: upload (shrunk in the browser), choose the first one shown, take one off. */
export function StylePhotos({ styleId, colors, images, canEdit }: { styleId: string; colors: string[]; images: StyleImage[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [color, setColor] = useState(colors[0] ?? "");
  const [view, setView] = useState<(typeof VIEWS)[number]>("front");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      setError(t.has(`catalogue.errors.${code}`) ? t(`catalogue.errors.${code}`) : t("auth.errors.generic"));
    }
    setBusy(false);
  };
  const upload = (files: FileList | null) => run(async () => {
    for (const file of Array.from(files ?? [])) {
      const ids = await uploadPhoto(file);
      await api(`/styles/${styleId}/images`, { body: { ...ids, color: color || null, view } });
    }
  });
  const groups = [...colors.map((c) => ({ key: c, label: c })), { key: "", label: t("catalogue.allColours") }]
    .map((g) => ({ ...g, list: images.filter((i) => (i.color ?? "") === g.key) })).filter((g) => g.list.length);

  return (
    <Card className="p-0">
      <h2 className="border-b border-border px-5 py-3 font-semibold">{t("catalogue.photos")}</h2>
      <div className="flex flex-col gap-4 px-5 py-4">
        {error ? <Alert>{error}</Alert> : null}
        {canEdit ? (
          <div className="flex flex-wrap items-end gap-3">
            <Field label={t("styles.color")} htmlFor="ph-color">
              <Select id="ph-color" value={color} onChange={(e) => setColor(e.target.value)} className="w-44">
                {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="">{t("catalogue.allColours")}</option>
              </Select>
            </Field>
            <Field label={t("catalogue.view")} htmlFor="ph-view">
              <Select id="ph-view" value={view} onChange={(e) => setView(e.target.value as typeof view)} className="w-36">
                {VIEWS.map((v) => <option key={v} value={v}>{t(`catalogue.views.${v}`)}</option>)}
              </Select>
            </Field>
            <label className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-medium text-on-primary hover:bg-primary-hover ${busy ? "pointer-events-none opacity-60" : ""}`}>
              <Camera className="size-4" aria-hidden />{busy ? t("catalogue.uploading") : t("catalogue.addPhotos")}
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} />
            </label>
            <p className="basis-full text-xs text-muted">{t("catalogue.photoHint")}</p>
          </div>
        ) : null}
        {groups.map((g) => (
          <div key={g.key} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{g.label}</h3>
            <ul className="flex flex-wrap gap-3">
              {g.list.map((img, i) => (
                <li key={img.id} className="flex w-32 flex-col gap-1">
                  <a href={fileUrl(img.fileId)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-md border border-border bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fileUrl(img.thumbFileId)} alt={`${g.label} ${t(`catalogue.views.${img.view}`)}`} className="aspect-[3/4] w-full object-cover" loading="lazy" />
                  </a>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{i === 0 ? t("catalogue.shownFirst") : t(`catalogue.views.${img.view}`)}</span>
                    {canEdit ? (
                      <span className="flex gap-1">
                        {i > 0 ? <button type="button" disabled={busy} onClick={() => run(() => api(`/style-images/${img.id}`, { method: "PATCH", body: { first: true } }))} className="rounded p-1 hover:text-primary" title={t("catalogue.showFirst")}><ArrowUpToLine className="size-3.5" aria-hidden /><span className="sr-only">{t("catalogue.showFirst")}</span></button> : null}
                        <button type="button" disabled={busy} onClick={() => run(() => api(`/style-images/${img.id}`, { method: "PATCH", body: { archived: true } }))} className="rounded p-1 hover:text-danger" title={t("common.remove")}><Trash2 className="size-3.5" aria-hidden /><span className="sr-only">{t("common.remove")}</span></button>
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!groups.length ? <p className="text-sm text-muted">{t("catalogue.noPhotos")}</p> : null}
      </div>
    </Card>
  );
}
