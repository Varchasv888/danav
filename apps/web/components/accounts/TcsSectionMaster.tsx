"use client";

import { useMemo, useState } from "react";
import { api, ApiError } from "@/lib/client-api";
import { Alert, Button, Card, Select } from "../ui";

export interface TcsSectionSetting {
  code: string;
  nature: string;
  rate: string;
  noPanRate: string;
  note?: string;
  enabled: boolean;
}
export interface TcsSectionSettingsResponse { companyId: string; companies: Company[]; sections: TcsSectionSetting[] }
interface Company { id: string; name: string }

function errorMessage(error: unknown) {
  const code = error instanceof ApiError ? error.code : "";
  if (code === "unknown_section") return "One of the selected sections is no longer available. Refresh and try again.";
  if (code === "duplicate_section") return "A section was included more than once. Refresh and try again.";
  if (code === "company_not_found") return "That company could not be found.";
  return "TCS applicability could not be saved. Please try again.";
}

export function TcsSectionMaster({ initial, canEdit }: {
  initial: TcsSectionSettingsResponse;
  canEdit: boolean;
}) {
  const [companyId, setCompanyId] = useState(initial.companyId);
  const [sections, setSections] = useState(initial.sections);
  const [draft, setDraft] = useState<Record<string, boolean>>({});
  const [reviewing, setReviewing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const changes = useMemo(() => sections.filter((section) => draft[section.code] !== undefined && draft[section.code] !== section.enabled), [sections, draft]);
  const enabledSections = sections.filter((section) => draft[section.code] ?? section.enabled).map((section) => section.code);

  const discardChanges = () => {
    setDraft({});
    setReviewing(false);
    setError("");
    setNotice("");
  };

  const switchCompany = async (nextCompanyId: string) => {
    if (changes.length) {
      setError("Save or discard pending changes before switching companies.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const next = await api<TcsSectionSettingsResponse>(`/tcs/section-settings?companyId=${nextCompanyId}`);
      setCompanyId(next.companyId);
      setSections(next.sections);
      setDraft({});
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      await api(`/tcs/section-settings?companyId=${companyId}`, { method: "PUT", body: { enabledSections } });
      const saved = await api<TcsSectionSettingsResponse>(`/tcs/section-settings?companyId=${companyId}`);
      setSections(saved.sections);
      setDraft({});
      setReviewing(false);
      setNotice("TCS section applicability saved. Existing collections and Form 27EQ records are unchanged.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {notice ? <div role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">{notice}</div> : null}
      {!canEdit ? <div role="note" className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted">You can view these sections, but your role does not allow changes.</div> : null}
      {initial.companies.length > 1 ? (
        <div className="max-w-md">
          <label htmlFor="tcs-company" className="mb-1 block text-sm font-medium">Company</label>
          <Select id="tcs-company" value={companyId} disabled={busy || reviewing || changes.length > 0} onChange={(event) => void switchCompany(event.target.value)}>
            {initial.companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </Select>
          {changes.length ? <p className="mt-1 text-xs text-muted">Save or discard pending changes before switching companies.</p> : null}
        </div>
      ) : null}
      <p className="text-sm text-muted">Statutory rates are read-only. New TCS collection entry uses enabled sections; saved collections remain in reports.</p>
      <Card className="p-0">
        <ul className="divide-y divide-rule">
          {sections.map((section) => {
            const enabled = draft[section.code] ?? section.enabled;
            return (
              <li key={section.code} className="flex flex-wrap items-start gap-x-6 gap-y-3 px-4 py-3">
                <div className="min-w-0 flex-1 basis-56">
                  <h2 className="font-semibold">{section.code}</h2>
                  <p className="mt-0.5 text-sm text-muted">{section.nature}</p>
                  {section.note ? <p className="mt-1 text-xs text-muted">{section.note}</p> : null}
                </div>
                <div className="grid min-w-40 gap-1 text-sm sm:min-w-48">
                  <span>Rate: <b>{section.rate}%</b></span>
                  <span>No-PAN rate: <b>{section.noPanRate}%</b></span>
                </div>
                <label className="flex min-h-8 items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={enabled}
                    disabled={!canEdit || busy || reviewing}
                    onChange={(event) => { setNotice(""); setDraft((current) => ({ ...current, [section.code]: event.target.checked })); }}
                  />
                  Applicable
                </label>
              </li>
            );
          })}
        </ul>
      </Card>
      {canEdit ? (
        <div className="flex flex-wrap items-center gap-3">
          {!reviewing ? (
            <>
              <Button disabled={!changes.length || busy} onClick={() => { setError(""); setReviewing(true); }}>Review changes ({changes.length})</Button>
              {changes.length ? <Button variant="outline" disabled={busy} onClick={discardChanges}>Discard changes</Button> : null}
            </>
          ) : (
            <Card className="w-full">
              <h2 className="mb-3 font-semibold">Review TCS applicability changes</h2>
              <ul className="space-y-2 text-sm">
                {changes.map((section) => (
                  <li key={section.code} className="grid gap-1 sm:grid-cols-[1fr_1fr]">
                    <span>{section.code}: {section.enabled ? "Applicable" : "Not applicable"}</span>
                    <span className="font-medium">→ {draft[section.code] ? "Applicable" : "Not applicable"}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button disabled={busy} onClick={() => void save()}>{busy ? "Saving…" : "Save changes"}</Button>
                <Button variant="outline" disabled={busy} onClick={() => setReviewing(false)}>Keep editing</Button>
                <Button variant="ghost" disabled={busy} onClick={discardChanges}>Discard changes</Button>
              </div>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
