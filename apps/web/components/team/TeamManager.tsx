"use client";

import { Check, Copy, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ACTIONS, MODULES, SPECIAL_RIGHTS } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Member { id: string; name: string; email: string; roleId: string; roleKey: string; roleName: string; status: string; isYou: boolean; warehouseScope?: string[] | null }
export interface Store { id: string; name: string }
export interface Invitation { id: string; email: string; roleName: string; expiresAt: string }
export interface Role { id: string; key: string; name: string; permissions: string[]; system: boolean; members: number }

export function TeamManager({ members, invitations, roles, myRole, permissions, stores = [] }: { members: Member[]; invitations: Invitation[]; roles: Role[]; myRole: string; permissions: string[]; stores?: Store[] }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | "new" | null>(null);
  const [editingStores, setEditingStores] = useState<string | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const can = (p: string) => permissions.includes(p);
  const assignable = roles.filter((r) => r.key !== "owner" || myRole === "owner");

  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`team.errors.${code}`, `auth.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
  };

  async function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    await run(async () => {
      const r = await api<{ inviteUrl: string }>("/invitations", { body: { email: f.get("email"), roleId: f.get("roleId") } });
      setInviteUrl(r.inviteUrl);
      setCopied(false);
      form.reset();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? <Alert>{error}</Alert> : null}

      {can("users.create") ? (
        <Card>
          <h2 className="font-semibold">{t("team.inviteTitle")}</h2>
          <form onSubmit={invite} className="mt-4 grid items-end gap-4 md:grid-cols-[1fr_240px_auto]">
            <Field label={t("team.email")} htmlFor="inv-email"><Input id="inv-email" name="email" type="email" required /></Field>
            <Field label={t("team.role")} htmlFor="inv-role">
              <Select id="inv-role" name="roleId" defaultValue={roles.find((r) => r.key === "accountant")?.id}>
                {assignable.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </Field>
            <Button type="submit">{t("team.invite")}</Button>
          </form>
          {inviteUrl ? (
            <div className="mt-4 rounded-lg bg-accent-soft p-3 text-sm">
              <p className="font-medium">{t("team.inviteLink")}</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-surface px-2 py-1 font-mono text-xs">{inviteUrl}</code>
                <Button type="button" variant="outline" onClick={async () => { await navigator.clipboard.writeText(inviteUrl); setCopied(true); }}>
                  {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  {copied ? t("common.copied") : t("common.copy")}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted">{t("team.inviteLinkHint")}</p>
            </div>
          ) : null}
        </Card>
      ) : null}

      <Card className="p-0">
        <h2 className="border-b border-border px-5 py-3 font-semibold">{t("team.members")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-2 font-medium">{t("auth.name")}</th>
                <th className="px-5 py-2 font-medium">{t("team.role")}</th>
                <th className="px-5 py-2 font-medium">{t("team.status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5">
                    <span className="font-medium">{m.name}</span>{m.isYou ? <span className="ml-1 text-muted">({t("team.you")})</span> : null}
                    <span className="block text-xs text-muted">{m.email}</span>
                    {stores.length > 1 && m.roleKey !== "owner" ? (
                      <span className="block text-xs text-muted">
                        {m.warehouseScope?.length ? stores.filter((s) => m.warehouseScope!.includes(s.id)).map((s) => s.name).join(", ") : t("team.allStores")}
                        {can("users.edit") && !m.isYou ? <button type="button" className="ml-2 text-primary hover:underline" onClick={() => { setEditingStores(m.id); setPicked(new Set(m.warehouseScope ?? [])); }}>{t("team.limitStores")}</button> : null}
                      </span>
                    ) : null}
                    {editingStores === m.id ? (
                      <span className="mt-2 flex flex-col gap-1 rounded-md border border-border bg-surface-2 p-2 text-sm">
                        <span className="text-xs text-muted">{t("team.storesHelp")}</span>
                        {stores.map((s) => <label key={s.id} className="flex items-center gap-2"><input type="checkbox" checked={picked.has(s.id)} onChange={() => { const n = new Set(picked); if (n.has(s.id)) n.delete(s.id); else n.add(s.id); setPicked(n); }} className="accent-[var(--primary)]" />{s.name}</label>)}
                        <span className="flex gap-2">
                          <Button onClick={() => run(async () => { await api(`/members/${m.id}`, { method: "PATCH", body: { warehouseScope: [...picked] } }); setEditingStores(null); })}>{t("team.saveStores")}</Button>
                          <Button variant="ghost" onClick={() => setEditingStores(null)}>{t("common.cancel")}</Button>
                        </span>
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-2.5">
                    {can("users.edit") && !m.isYou && (m.roleKey !== "owner" || myRole === "owner") ? (
                      <Select value={m.roleId} onChange={(e) => run(() => api(`/members/${m.id}`, { method: "PATCH", body: { roleId: e.target.value } }))} className="w-48" aria-label={t("team.role")}>
                        {assignable.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </Select>
                    ) : m.roleName}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.status === "active" ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger"}`}>{t(`team.${m.status}`)}</span>
                  </td>
                  <td className="px-5 py-2.5 text-right whitespace-nowrap">
                    {can("users.edit") && !m.isYou ? (
                      <Button variant="ghost" onClick={() => run(() => api(`/members/${m.id}`, { method: "PATCH", body: { status: m.status === "active" ? "suspended" : "active" } }))}>
                        {m.status === "active" ? t("team.suspend") : t("team.reactivate")}
                      </Button>
                    ) : null}
                    {can("users.delete") && !m.isYou ? (
                      <Button variant="ghost" className="hover:text-danger" onClick={() => run(() => api(`/members/${m.id}`, { method: "DELETE" }))}>{t("team.remove")}</Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {invitations.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-5 py-3 font-semibold">{t("team.pendingInvites")}</h2>
          <ul>
            {invitations.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-2.5 text-sm last:border-0">
                <span className="flex-1 font-medium">{i.email}</span>
                <span className="text-muted">{i.roleName}</span>
                <span className="text-muted">{t("team.expires")} {format.relativeTime(new Date(i.expiresAt))}</span>
                {can("users.create") ? <Button variant="ghost" onClick={() => run(() => api(`/invitations/${i.id}`, { method: "DELETE" }))}>{t("team.revoke")}</Button> : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-semibold">{t("team.roles")}</h2>
          {can("users.edit") && !editingRole ? <Button variant="outline" onClick={() => setEditingRole("new")}><Plus className="size-4" aria-hidden />{t("team.newRole")}</Button> : null}
        </div>
        {editingRole ? (
          <RoleEditor
            role={editingRole === "new" ? null : editingRole}
            grantable={permissions}
            onCancel={() => setEditingRole(null)}
            onSave={(name, perms) => run(async () => {
              if (editingRole === "new") await api("/roles", { body: { name, permissions: perms } });
              else await api(`/roles/${editingRole.id}`, { method: "PATCH", body: { name, permissions: perms } });
              setEditingRole(null);
            })}
          />
        ) : null}
        <ul>
          {roles.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-2.5 text-sm last:border-0">
              <span className="font-medium">{r.name}</span>
              {r.system ? <span className="rounded bg-surface-2 px-1.5 text-xs text-muted">{t("team.systemRole")}</span> : null}
              <span className="flex-1 text-muted">{t("team.membersCount", { count: r.members })}</span>
              <span className="text-xs text-muted">{r.permissions.length} {t("team.permissions").toLowerCase()}</span>
              {!r.system && can("users.edit") ? (
                <>
                  <Button variant="ghost" onClick={() => setEditingRole(r)}>{t("common.edit")}</Button>
                  <Button variant="ghost" className="hover:text-danger" onClick={() => run(() => api(`/roles/${r.id}`, { method: "DELETE" }))}>{t("common.remove")}</Button>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/** Module × action grid. Only permissions the current user holds can be ticked. */
function RoleEditor({ role, grantable, onSave, onCancel }: { role: Role | null; grantable: string[]; onSave: (name: string, perms: string[]) => void; onCancel: () => void }) {
  const t = useTranslations();
  const [name, setName] = useState(role?.name ?? "");
  const [perms, setPerms] = useState(new Set(role?.permissions ?? []));
  const toggle = (p: string) => setPerms((s) => {
    const n = new Set(s);
    if (n.has(p)) n.delete(p);
    else n.add(p);
    return n;
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(name, [...perms]); }} className="border-b border-border p-5">
      <Field label={t("team.roleName")} htmlFor="role-name"><Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={60} className="max-w-sm" /></Field>
      <div className="mt-4 overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr className="text-muted">
              <th />
              {ACTIONS.map((a) => <th key={a} className="px-2 py-1 text-xs font-medium">{t(`team.perm.${a}`)}</th>)}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => (
              <tr key={m} className="border-t border-border">
                <td className="py-1.5 pr-4 font-medium">{t(`team.modules.${m}`)}</td>
                {ACTIONS.map((a) => {
                  const p = `${m}.${a}`;
                  return (
                    <td key={a} className="px-2 py-1.5 text-center">
                      <input type="checkbox" checked={perms.has(p)} disabled={!grantable.includes(p)} onChange={() => toggle(p)} aria-label={`${t(`team.modules.${m}`)} ${t(`team.perm.${a}`)}`} className="size-4 accent-[var(--primary)]" />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <fieldset className="mt-5">
        <legend className="font-medium">{t("team.special.title")}</legend>
        <p className="mt-0.5 mb-2 max-w-[70ch] text-[0.9286rem] text-muted">{t("team.special.help")}</p>
        <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {SPECIAL_RIGHTS.map((r) => {
            const p = `special.${r}`;
            return (
              <label key={r} className="flex items-center gap-2 text-[0.9286rem]">
                <input type="checkbox" checked={perms.has(p)} disabled={!grantable.includes(p)} onChange={() => toggle(p)} className="size-4 accent-[var(--primary)]" />
                {t(`team.special.${r}`)}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-4 flex gap-3">
        <Button type="submit">{t("common.save")}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>{t("common.cancel")}</Button>
      </div>
    </form>
  );
}
