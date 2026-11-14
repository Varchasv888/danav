import "server-only";
import type { Category } from "@/components/expenses/Claims";
import { serverApi } from "./server-api";

/** What the claim form needs: active employees, categories and active projects (if the user may see them). */
export async function claimFormData(canSeeProjects: boolean) {
  const [employees, categories, projects] = await Promise.all([
    serverApi<{ id: string; code: string; name: string; status: string }[]>("/expenses/people"),
    serverApi<Category[]>("/expenses/categories"),
    canSeeProjects ? serverApi<{ id: string; code: string; name: string; status: string }[]>("/projects") : Promise.resolve([]),
  ]);
  return {
    employees: employees.filter((e) => e.status === "active").map(({ id, code, name }) => ({ id, code, name })),
    categories,
    projects: projects.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: `${p.code} ${p.name}` })),
  };
}
