"use client";

import { useMemo, useState } from "react";
import { api, ApiError } from "@/lib/client-api";
import { Alert, Button, Card, Select } from "../ui";

interface AccountChoice { id: string; name: string; key: string | null; system: boolean }
export interface LedgerRole {
  key: string;
  groupKey: string;
  groupName: string;
  currentAccountId: string;
  currentAccountName: string;
  templateAccountId: string;
  templateAccountName: string;
  isCustomized: boolean;
  compatibleAccounts: AccountChoice[];
}
interface LedgerCompany { id: string; name: string }
export interface LedgerParametersResponse { companyId: string; companies: LedgerCompany[]; roles: LedgerRole[] }

const errorMessage = (error: unknown) => {
  const code = error instanceof ApiError ? error.code : "";
  const messages: Record<string, string> = {
    unsupported_posting_role: "This posting role is not supported.",
    duplicate_posting_role: "A posting role was included more than once.",
    unknown_account: "An account could not be found. Refresh the page and try again.",
    account_company_mismatch: "Choose an account from this company.",
    account_archived: "Archived or merged accounts cannot be used.",
    incompatible_account: "Choose an account from the same account group.",
  };
  return messages[code] ?? "The ledger defaults could not be saved. Please try again.";
};

export function LedgerParameters({ companyId, companies, roles, canEdit }: { companyId: string; companies: LedgerCompany[]; roles: LedgerRole[]; canEdit: boolean }) {
  const [savedRoles, setSavedRoles] = useState(roles);
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId);
  const [companyOptions, setCompanyOptions] = useState(companies);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [reviewing, setReviewing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const changes = useMemo(() => savedRoles.filter((role) => draft[role.key] && draft[role.key] !== role.currentAccountId), [savedRoles, draft]);
  const groups = useMemo(() => [...new Set(savedRoles.map((role) => role.groupKey))].map((key) => ({
    key,
    name: savedRoles.find((role) => role.groupKey === key)!.groupName,
    roles: savedRoles.filter((role) => role.groupKey === key),
  })), [savedRoles]);

  const discardChanges = () => {
    setDraft({});
    setReviewing(false);
    setError("");
    setNotice("");
  };

  const changeCompany = async (nextCompanyId: string) => {
    if (changes.length) {
      setError("Save or discard pending changes before switching companies.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const updated = await api<LedgerParametersResponse>(`/accounts/ledger-parameters?companyId=${nextCompanyId}`);
      setSavedRoles(updated.roles);
      setCompanyOptions(updated.companies);
      setSelectedCompanyId(updated.companyId);
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
      await api(`/accounts/ledger-parameters?companyId=${selectedCompanyId}`, {
        method: "PUT",
        body: { defaults: changes.map((role) => ({ key: role.key, accountId: draft[role.key]! })) },
      });
      const updated = await api<LedgerParametersResponse>(`/accounts/ledger-parameters?companyId=${selectedCompanyId}`);
      setSavedRoles(updated.roles);
      setCompanyOptions(updated.companies);
      setDraft({});
      setReviewing(false);
      setNotice("Ledger defaults saved. New postings will use these ledgers; existing vouchers are unchanged.");
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
      {!canEdit ? <div role="note" className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted">You can view these defaults, but your role does not allow changes.</div> : null}

      {companyOptions.length > 1 ? (
        <div className="max-w-md">
          <label htmlFor="ledger-company" className="mb-1 block text-sm font-medium">Company</label>
          <Select id="ledger-company" value={selectedCompanyId} disabled={busy || reviewing || changes.length > 0} onChange={(event) => void changeCompany(event.target.value)}>
            {companyOptions.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </Select>
          {changes.length ? <p className="mt-1 text-xs text-muted">Save or discard pending changes before switching companies.</p> : null}
        </div>
      ) : null}

      {groups.map((group) => (
        <Card key={group.key} className="p-0">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">{group.name}</h2>
          <div className="divide-y divide-rule">
            {group.roles.map((role) => {
              const value = draft[role.key] ?? role.currentAccountId;
              const selected = role.compatibleAccounts.find((account) => account.id === value);
              return (
                <div key={role.key} className="grid gap-2 px-4 py-3 md:grid-cols-[minmax(12rem,1fr)_minmax(14rem,1.3fr)] md:items-center">
                  <div className="min-w-0">
                    <div className="font-medium">{role.templateAccountName}</div>
                    <div className="text-xs text-muted">Current ledger: {selected?.name ?? role.currentAccountName}{!role.isCustomized && value === role.currentAccountId ? " · template default" : ""}</div>
                  </div>
                  {canEdit ? (
                    <label className="sr-only" htmlFor={`ledger-${role.key}`}>Ledger for {role.templateAccountName}</label>
                  ) : null}
                  {canEdit ? (
                    <Select id={`ledger-${role.key}`} value={value} disabled={busy || reviewing} onChange={(event) => { setNotice(""); setDraft((current) => ({ ...current, [role.key]: event.target.value })); }}>
                      {role.compatibleAccounts.map((account) => <option key={account.id} value={account.id}>{account.name}{account.id === role.templateAccountId ? " · template default" : ""}</option>)}
                    </Select>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {canEdit ? (
        <div className="flex flex-wrap items-center gap-3">
          {!reviewing ? (
            <>
              <Button disabled={!changes.length || busy} onClick={() => { setError(""); setReviewing(true); }}>Review changes ({changes.length})</Button>
              {changes.length ? <Button variant="outline" disabled={busy} onClick={discardChanges}>Discard changes</Button> : null}
            </>
          ) : (
            <Card className="w-full">
              <h2 className="mb-3 font-semibold">Review ledger changes</h2>
              <div className="flex flex-col gap-2 text-sm">
                {changes.map((role) => {
                  const nextName = role.compatibleAccounts.find((account) => account.id === draft[role.key])?.name ?? role.templateAccountName;
                  return <div key={role.key} className="grid gap-1 sm:grid-cols-[1fr_1fr]"><span>{role.templateAccountName}: {role.currentAccountName}</span><span className="font-medium">→ {nextName}</span></div>;
                })}
              </div>
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
