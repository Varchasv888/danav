"use client";

import { Pencil, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { GST_STATES, devanagari } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { drCr, fyStart, localName, todayIso } from "@/lib/format";
import { Drawer } from "../Drawer";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Group { id: string; key: string | null; name: string; nameHi: string | null; nature: string; parentId: string | null }
export interface Account {
  id: string; key: string | null; name: string; nameHi: string | null; groupId: string; groupName?: string; groupNameHi?: string | null;
  balance: string; openingBalance: string; gstin: string | null; stateCode: string | null; phone: string | null;
  bank: { accountNumber?: string; ifsc?: string } | null; archived: boolean; system: boolean;
  address?: { line1?: string; city?: string; pincode?: string } | null; creditLimit?: string | null; creditDays?: number | null; udyamNumber?: string | null; msmeClass?: string | null;
  creditControl?: "warn" | "block"; blockOverdueDays?: number | null; interestRate?: string | null; priceListId?: string | null;
  isAgent?: boolean; commissionPct?: string | null; agentId?: string | null; salesmanId?: string | null;
}

type Choice = { id: string; name: string; archived?: boolean };

const PARTY_GROUPS = ["sundry_debtors", "sundry_creditors"];
const BANK_GROUPS = ["bank_accounts", "bank_od"];

/**
 * The ledgers, or with `only` just the customers or just the suppliers (the same accounts, in the sundry debtors or sundry
 * creditors group, shown the way a shop thinks of them). Adding and editing happen in a side drawer so the list stays in view.
 */
export function ChartOfAccounts({ accounts, groups, canCreate, canEdit, only }: { accounts: Account[]; groups: Group[]; canCreate: boolean; canEdit: boolean; only?: "customer" | "supplier" }) {
  const t = useTranslations();
  const locale = useLocale();
  const partyGroup = only ? groups.find((g) => g.key === (only === "customer" ? "sundry_debtors" : "sundry_creditors")) : undefined;
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState(partyGroup?.id ?? "");
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Account | "new" | null>(null);
  const [dirty, setDirty] = useState(false);
  const labels = { dr: t("common.dr"), cr: t("common.cr") };
  const closeDrawer = () => { setEditing(null); setDirty(false); };

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => localName(a, locale).localeCompare(localName(b, locale))), [groups, locale]);
  const visible = accounts
    .filter((a) => {
      if (a.archived && !showArchived) return false;
      if (groupFilter && a.groupId !== groupFilter) return false;
      const q = query.trim().toLowerCase();
      return !q || a.name.toLowerCase().includes(q) || (a.nameHi ?? "").includes(q) || (a.gstin ?? "").toLowerCase().includes(q) || (a.phone ?? "").includes(q) || (a.address?.city ?? "").toLowerCase().includes(q);
    })
    .sort((a, b) => localName(a, locale).localeCompare(localName(b, locale), locale));
  const groupCount = (groupId: string) => accounts.filter((account) => (!account.archived || showArchived) && (!groupId || account.groupId === groupId)).length;

  const from = fyStart(todayIso());
  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <Drawer title={editing === "new" ? t(only ? `accounts.new.${only}` : "accounts.newAccount") : editing.name} subtitle={editing === "new" ? undefined : editing.groupName} dirty={dirty} onClose={closeDrawer}>
          <AccountForm key={editing === "new" ? "new" : editing.id} account={editing === "new" ? null : editing} groups={sortedGroups} presetGroupId={editing === "new" ? partyGroup?.id : undefined} onDirty={() => setDirty(true)} onDone={closeDrawer} />
        </Drawer>
      ) : null}
      <div className={only ? "grid items-start gap-4" : "grid items-start gap-4 xl:grid-cols-[15rem_minmax(0,1fr)]"}>
        {only ? null : <Card className="surface-raised p-3">
          <div className="mb-2 px-2">
            <h2 className="text-sm font-semibold">{t("accounts.group")}</h2>
            <p className="mt-0.5 text-xs text-muted">Browse accounts by category</p>
          </div>
          <nav aria-label={t("accounts.group")} className="flex flex-col gap-1">
            <button type="button" onClick={() => setGroupFilter("")} aria-pressed={!groupFilter}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm ${!groupFilter ? "bg-primary-soft font-semibold text-primary" : "text-muted hover:bg-surface-2 hover:text-text"}`}>
              <span>{t("accounts.allGroups")}</span><span className="num rounded-full bg-surface px-2 py-0.5 text-xs">{groupCount("")}</span>
            </button>
            {sortedGroups.map((g) => (
              <button key={g.id} type="button" onClick={() => setGroupFilter(g.id)} aria-pressed={groupFilter === g.id}
                className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${groupFilter === g.id ? "bg-primary-soft font-semibold text-primary" : "text-muted hover:bg-surface-2 hover:text-text"}`}>
                <span className="truncate">{localName(g, locale)}</span><span className="num rounded-full bg-surface px-2 py-0.5 text-xs">{groupCount(g.id)}</span>
              </button>
            ))}
          </nav>
        </Card>}
        <div className="flex min-w-0 flex-col gap-3">
          <Card className="surface-raised p-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-56 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("common.search")} className="pl-9" aria-label={t("common.search")} />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="size-4 accent-[var(--primary)]" />
                {t("common.archived")}
              </label>
              {canCreate && !editing ? <Button onClick={() => setEditing("new")}><Plus className="size-4" aria-hidden />{t(only ? `accounts.new.${only}` : "accounts.newAccount")}</Button> : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
              <p className="font-semibold">{groupFilter ? localName(sortedGroups.find((g) => g.id === groupFilter) ?? { name: "", nameHi: null }, locale) : t("accounts.allGroups")}</p>
              <p className="text-muted">{visible.length} accounts shown</p>
            </div>
          </Card>
          <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("accounts.name")}</th>
                {only ? (
                  <>
                    <th className="px-5 py-3 font-medium">{t("accounts.phone")}</th>
                    <th className="px-5 py-3 font-medium">{t("company.city")}</th>
                  </>
                ) : <th className="px-5 py-3 font-medium">{t("accounts.group")}</th>}
                <th className="px-5 py-3 font-medium">{t("auth.gstin")}</th>
                {only ? <th className="px-5 py-3 text-right font-medium">{t("accounts.creditLimit")}</th> : null}
                <th className="px-5 py-3 text-right font-medium">{t("accounts.balance")}</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5">
                    <Link href={`/reports/ledger/${a.id}?from=${from}&to=${todayIso()}`} className="font-medium hover:text-primary hover:underline">{localName(a, locale)}</Link>
                    {a.archived ? <span className="ml-2 text-xs text-muted">({t("common.archived")})</span> : null}
                  </td>
                  {only ? (
                    <>
                      <td className="px-5 py-2.5 text-muted">{a.phone ?? ""}</td>
                      <td className="px-5 py-2.5 text-muted">{a.address?.city ?? ""}</td>
                    </>
                  ) : <td className="px-5 py-2.5 text-muted">{a.groupName ? localName({ name: a.groupName, nameHi: a.groupNameHi }, locale) : ""}</td>}
                  <td className="px-5 py-2.5 font-mono text-xs">{a.gstin ?? ""}</td>
                  {only ? <td className="num px-5 py-2.5 text-right text-muted">{a.creditLimit && Number(a.creditLimit) ? Number(a.creditLimit).toLocaleString("en-IN") : ""}</td> : null}
                  <td className="num px-5 py-2.5 text-right">{drCr(a.balance, labels)}</td>
                  <td className="pr-3 text-right">
                    {canEdit ? (
                      <button onClick={() => setEditing(a)} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text" title={t("common.edit")}>
                        <Pencil className="size-4" aria-hidden /><span className="sr-only">{t("common.edit")} {a.name}</span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!visible.length ? <tr><td colSpan={only ? 7 : 5} className="px-5 py-8 text-center text-muted">{t("accounts.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AccountForm({ account, groups, presetGroupId, onDirty, onDone }: { account: Account | null; groups: Group[]; presetGroupId?: string | undefined; onDirty: () => void; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [groupId, setGroupId] = useState(account?.groupId ?? presetGroupId ?? "");
  const [error, setError] = useState<string | null>(null);
  const groupKey = groups.find((g) => g.id === groupId)?.key ?? "";
  const debtor = groupKey === "sundry_debtors";
  const creditor = groupKey === "sundry_creditors";
  const [priceListId, setPriceListId] = useState(account?.priceListId ?? "");
  const [priceLists, setPriceLists] = useState<{ id: string; name: string; archived: boolean }[]>([]);
  const [agentId, setAgentId] = useState(account?.agentId ?? "");
  const [salesmanId, setSalesmanId] = useState(account?.salesmanId ?? "");
  const [isAgent, setIsAgent] = useState(!!account?.isAgent);
  const [agents, setAgents] = useState<Choice[]>([]);
  const [salesmen, setSalesmen] = useState<Choice[]>([]);
  useEffect(() => {
    if (!debtor) return;
    api<{ id: string; name: string; archived: boolean }[]>("/price-lists").then(setPriceLists).catch(() => setPriceLists([]));
    api<Choice[]>("/agents").then(setAgents).catch(() => setAgents([]));
    api<Choice[]>("/salesmen").then(setSalesmen).catch(() => setSalesmen([]));
  }, [debtor]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    const opt = (k: string) => s(k) || null;
    const body = {
      name: s("name"), nameHi: opt("nameHi"), openingBalance: s("openingBalance") || "0",
      ...(account?.system ? {} : { groupId }),
      ...(PARTY_GROUPS.includes(groupKey) ? {
        gstin: opt("gstin"), stateCode: opt("stateCode"), phone: opt("phone"),
        address: s("line1") || s("city") || s("pincode") ? { line1: s("line1") || undefined, city: s("city") || undefined, pincode: s("pincode") || undefined } : null,
        creditLimit: opt("creditLimit"), creditDays: s("creditDays") ? Number(s("creditDays")) : null,
      } : {}),
      ...(creditor ? { udyamNumber: opt("udyamNumber"), msmeClass: opt("msmeClass") } : {}),
      ...(debtor ? {
        creditControl: s("creditControl") || "warn", blockOverdueDays: s("blockOverdueDays") ? Number(s("blockOverdueDays")) : null,
        interestRate: opt("interestRate"), priceListId: opt("priceListId"), agentId: agentId || null, salesmanId: salesmanId || null,
      } : {}),
      ...(PARTY_GROUPS.includes(groupKey) ? { isAgent, commissionPct: isAgent ? opt("commissionPct") : null } : {}),
      ...(BANK_GROUPS.includes(groupKey) ? { bank: { accountNumber: s("accountNumber") || undefined, ifsc: s("ifsc").toUpperCase() || undefined } } : {}),
      ...(account ? { archived: f.get("archived") === "on" } : {}),
    };
    setError(null);
    try {
      if (account) await api(`/accounts/${account.id}`, { method: "PATCH", body });
      else await api("/accounts", { body });
      onDone();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`accounts.errors.${code}`, `auth.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
  }

  return (
      <form onSubmit={save} onChange={onDirty} className="grid gap-4 sm:grid-cols-2">
        {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}
        <Field label={t("accounts.name")} htmlFor="acc-name"><Input id="acc-name" name="name" defaultValue={account?.name} required autoFocus /></Field>
        <Field label={t("accounts.group")} htmlFor="acc-group">
          <Select id="acc-group" value={groupId} onChange={(e) => setGroupId(e.target.value)} required disabled={account?.system || (!!presetGroupId && !account)}>
            <option value="" disabled>-</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{localName(g, locale)}</option>)}
          </Select>
        </Field>
        <Field label={t("accounts.openingBalance")} htmlFor="acc-ob" hint={t("accounts.openingHint")}>
          <Input id="acc-ob" name="openingBalance" defaultValue={account && Number(account.openingBalance) ? account.openingBalance : ""} inputMode="decimal" pattern="-?\d+(\.\d{1,2})?" className="num" />
        </Field>
        <Field label={<>{t("accounts.nameHi")} <span className="font-normal text-muted">({t("common.optional")})</span></>} htmlFor="acc-hi"><Input id="acc-hi" name="nameHi" defaultValue={account?.nameHi ?? ""} lang="hi" /></Field>
        {PARTY_GROUPS.includes(groupKey) ? (
          <>
            <Field label={t("auth.gstin")} htmlFor="acc-gstin"><Input id="acc-gstin" name="gstin" defaultValue={account?.gstin ?? ""} maxLength={15} className="uppercase tracking-wider" /></Field>
            <Field label={t("auth.state")} htmlFor="acc-state">
              <Select id="acc-state" name="stateCode" defaultValue={account?.stateCode ?? ""}>
                <option value="">-</option>
                {GST_STATES.map((st) => <option key={st.code} value={st.code}>{st.code} · {devanagari(locale) ? st.nameHi : st.name}</option>)}
              </Select>
            </Field>
            <Field label={t("accounts.phone")} htmlFor="acc-phone"><Input id="acc-phone" name="phone" defaultValue={account?.phone ?? ""} inputMode="tel" maxLength={15} /></Field>
            <div className="md:col-span-2"><Field label={t("print.billTo")} htmlFor="acc-line1"><Input id="acc-line1" name="line1" defaultValue={account?.address?.line1 ?? ""} maxLength={200} /></Field></div>
            <Field label={t("company.city")} htmlFor="acc-city"><Input id="acc-city" name="city" defaultValue={account?.address?.city ?? ""} maxLength={100} /></Field>
            <Field label={t("company.pincode")} htmlFor="acc-pin"><Input id="acc-pin" name="pincode" defaultValue={account?.address?.pincode ?? ""} inputMode="numeric" maxLength={6} pattern="[1-9][0-9]{5}" /></Field>
            <Field label={t("accounts.creditLimit")} htmlFor="acc-cl"><Input id="acc-cl" name="creditLimit" defaultValue={account?.creditLimit ? Number(account.creditLimit) : ""} inputMode="decimal" className="num" /></Field>
            <Field label={t("accounts.creditDays")} htmlFor="acc-cd"><Input id="acc-cd" name="creditDays" defaultValue={account?.creditDays ?? ""} inputMode="numeric" maxLength={3} className="num" /></Field>
            {creditor ? (
              <>
                <Field label={t("accounts.udyam")} htmlFor="acc-udyam"><Input id="acc-udyam" name="udyamNumber" defaultValue={account?.udyamNumber ?? ""} placeholder="UDYAM-MH-00-0000000" maxLength={19} className="font-mono uppercase" /></Field>
                <Field label={t("accounts.msmeClass")} htmlFor="acc-msme"><Select id="acc-msme" name="msmeClass" defaultValue={account?.msmeClass ?? ""}><option value="">{t("accounts.notMsme")}</option>{["micro", "small", "medium"].map((k) => <option key={k} value={k}>{t(`accounts.msme.${k}`)}</option>)}</Select></Field>
              </>
            ) : null}
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm">
              <input type="checkbox" checked={isAgent} onChange={(e) => setIsAgent(e.target.checked)} className="size-4 accent-[var(--primary)]" />
              {t("agents.isAgent")}
            </label>
            {isAgent ? (
              <Field label={t("agents.commissionPct")} htmlFor="acc-comm" hint={t("agents.commissionHint")}>
                <Input id="acc-comm" name="commissionPct" defaultValue={account?.commissionPct ? Number(account.commissionPct) : ""} inputMode="decimal" maxLength={5} className="num" />
              </Field>
            ) : null}
          </>
        ) : null}
        {debtor ? (
          <>
            <Field label={t("accounts.creditControl")} htmlFor="acc-cc" hint={t("accounts.creditControlHint")}>
              <Select id="acc-cc" name="creditControl" defaultValue={account?.creditControl ?? "warn"}>
                <option value="warn">{t("accounts.creditWarn")}</option>
                <option value="block">{t("accounts.creditBlock")}</option>
              </Select>
            </Field>
            <Field label={t("accounts.blockOverdueDays")} htmlFor="acc-bod"><Input id="acc-bod" name="blockOverdueDays" defaultValue={account?.blockOverdueDays ?? ""} inputMode="numeric" maxLength={4} className="num" /></Field>
            <Field label={t("accounts.interestRate")} htmlFor="acc-int"><Input id="acc-int" name="interestRate" defaultValue={account?.interestRate ? Number(account.interestRate) : ""} inputMode="decimal" maxLength={5} className="num" /></Field>
            <Field label={t("priceLists.one")} htmlFor="acc-pl">
              <Select id="acc-pl" name="priceListId" value={priceListId} onChange={(e) => setPriceListId(e.target.value)}>
                <option value="">{t("priceLists.none")}</option>
                {priceLists.filter((l) => !l.archived || l.id === account?.priceListId).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </Select>
            </Field>
            <Field label={t("agents.agent")} htmlFor="acc-agent">
              <Select id="acc-agent" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                <option value="">{t("agents.noAgent")}</option>
                {agents.filter((a) => (!a.archived || a.id === account?.agentId) && a.id !== account?.id).map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </Field>
            <Field label={t("agents.salesman")} htmlFor="acc-salesman">
              <Select id="acc-salesman" value={salesmanId} onChange={(e) => setSalesmanId(e.target.value)}>
                <option value="">{t("agents.noSalesman")}</option>
                {salesmen.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </Select>
            </Field>
          </>
        ) : null}
        {BANK_GROUPS.includes(groupKey) ? (
          <>
            <Field label={t("accounts.accountNumber")} htmlFor="acc-no"><Input id="acc-no" name="accountNumber" defaultValue={account?.bank?.accountNumber ?? ""} inputMode="numeric" maxLength={30} /></Field>
            <Field label={t("accounts.ifsc")} htmlFor="acc-ifsc"><Input id="acc-ifsc" name="ifsc" defaultValue={account?.bank?.ifsc ?? ""} maxLength={11} className="uppercase" /></Field>
          </>
        ) : null}
        <div className="sticky bottom-0 -mx-5 -mb-4 flex flex-wrap items-center gap-3 border-t border-border bg-surface px-5 py-3 sm:col-span-2">
          <Button type="submit">{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
          {account && !account.system ? (
            <label className="ml-auto flex items-center gap-2 text-sm">
              <input type="checkbox" name="archived" defaultChecked={account.archived} className="size-4 accent-[var(--primary)]" />
              {t("common.archived")}
            </label>
          ) : null}
        </div>
      </form>
  );
}
