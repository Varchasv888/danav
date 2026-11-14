import "server-only";
import { customers, items } from "./masters";
import { serverApi } from "./server-api";

/** Customers, service items (to invoice as) and people, for project forms. */
export async function projectMasters() {
  const [custs, list, people] = await Promise.all([
    customers(), items<{ id: string; name: string; nameHi: string | null; kind: string; archived: boolean }>(),
    serverApi<{ id: string; code: string; name: string; status: string }[]>("/projects/people"),
  ]);
  return {
    customers: custs.map(({ id, name, nameHi }) => ({ id, name, nameHi })),
    services: list.filter((i) => i.kind === "service" && !i.archived).map(({ id, name, nameHi }) => ({ id, name, nameHi })),
    people: people.filter((p) => p.status === "active").map(({ id, code, name }) => ({ id, code, name })),
  };
}
