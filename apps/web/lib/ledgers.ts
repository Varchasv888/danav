import "server-only";
import { serverApi } from "./server-api";

interface Group { id: string; key: string | null; parentId: string | null }
interface Account { id: string; key: string | null; name: string; nameHi: string | null; groupId: string; archived: boolean }

/** All live ledgers, and helpers to pick those under given groups (or their sub-groups). */
export async function ledgers() {
  const [accounts, groups] = await Promise.all([serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups")]);
  const live = accounts.filter((a) => !a.archived);
  const under = (...keys: string[]) => {
    const ids = new Set(groups.filter((g) => keys.includes(g.key ?? "") || keys.includes(groups.find((p) => p.id === g.parentId)?.key ?? "")).map((g) => g.id));
    return live.filter((a) => ids.has(a.groupId)).map(({ id, name, nameHi, key }) => ({ id, name, nameHi, key }));
  };
  return { all: live.map(({ id, name, nameHi, key }) => ({ id, name, nameHi, key })), under };
}
