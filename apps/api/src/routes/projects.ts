import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { asc } from "drizzle-orm";
import { tables, withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import {
  billMilestone, billTime, createProject, decideTime, deleteMilestone, deleteTask, deleteTime, getProject, listProjects, listTime, logTime, removeMember,
  saveMember, saveMilestone, saveTask, updateProject,
} from "../services/projects.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Hours = z.union([z.string().regex(/^\d{1,5}(\.\d{1,2})?$/, "invalid_hours"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const ChildParam = z.object({ id: z.uuid(), childId: z.uuid() });
const today = () => businessDate();

export async function projectRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };
  const ok = { ok: true };

  const Project = z.object({
    name: z.string().trim().min(2).max(120), customerId: z.uuid().nullish(), status: z.enum(["active", "on_hold", "completed", "cancelled"]).optional(),
    billing: z.enum(["fixed", "time_material", "non_billable"]).optional(), contractValue: Money.nullish(), budgetCost: Money.nullish(), budgetHours: Hours.nullish(),
    billRate: Money.nullish(), billingItemId: z.uuid().nullish(), startOn: IsoDate.nullish(), endOn: IsoDate.nullish(), notes: z.string().max(1000).nullish(),
  });
  app.get("/projects", { preHandler: can("projects.view") }, async (req) => run(req, (tx) => listProjects(tx)));
  app.get("/projects/:id", { preHandler: can("projects.view") }, async (req) => run(req, (tx) => getProject(tx, IdParam.parse(req.params).id)));
  app.post("/projects", { preHandler: can("projects.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => createProject(tx, a, Project.parse(req.body)))));
  app.put("/projects/:id", { preHandler: can("projects.edit") }, async (req) => run(req, (tx, a) => updateProject(tx, a, IdParam.parse(req.params).id, Project.parse(req.body))));

  const Task = z.object({
    name: z.string().trim().min(2).max(120), status: z.enum(["todo", "doing", "done"]).optional(), assigneeId: z.uuid().nullish(), estimatedHours: Hours.nullish(),
    dueOn: IsoDate.nullish(), sortOrder: z.number().int().min(0).max(100000).optional(),
  });
  app.post("/projects/:id/tasks", { preHandler: can("projects.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveTask(tx, a, IdParam.parse(req.params).id, Task.parse(req.body)))));
  app.put("/projects/:id/tasks/:childId", { preHandler: can("projects.edit") }, async (req) => {
    const p = ChildParam.parse(req.params);
    return run(req, (tx, a) => saveTask(tx, a, p.id, Task.parse(req.body), p.childId));
  });
  app.delete("/projects/:id/tasks/:childId", { preHandler: can("projects.edit") }, async (req) => {
    const p = ChildParam.parse(req.params);
    await run(req, (tx) => deleteTask(tx, p.id, p.childId));
    return ok;
  });

  app.put("/projects/:id/members", { preHandler: can("projects.edit") }, async (req) => {
    const body = z.object({ employeeId: z.uuid(), billRate: Money.nullish() }).parse(req.body);
    await run(req, (tx, a) => saveMember(tx, a, IdParam.parse(req.params).id, body));
    return ok;
  });
  app.delete("/projects/:id/members/:childId", { preHandler: can("projects.edit") }, async (req) => {
    const p = ChildParam.parse(req.params);
    await run(req, (tx) => removeMember(tx, p.id, p.childId));
    return ok;
  });

  const Milestone = z.object({ name: z.string().trim().min(2).max(120), amount: Money, dueOn: IsoDate.nullish(), sortOrder: z.number().int().min(0).max(100000).optional() });
  app.post("/projects/:id/milestones", { preHandler: can("projects.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveMilestone(tx, a, IdParam.parse(req.params).id, Milestone.parse(req.body)))));
  app.put("/projects/:id/milestones/:childId", { preHandler: can("projects.edit") }, async (req) => {
    const p = ChildParam.parse(req.params);
    return run(req, (tx, a) => saveMilestone(tx, a, p.id, Milestone.parse(req.body), p.childId));
  });
  app.delete("/projects/:id/milestones/:childId", { preHandler: can("projects.edit") }, async (req) => {
    const p = ChildParam.parse(req.params);
    await run(req, (tx) => deleteMilestone(tx, p.id, p.childId));
    return ok;
  });
  app.post("/projects/:id/milestones/:childId/bill", { preHandler: can("sales.create") }, async (req, reply) => {
    const p = ChildParam.parse(req.params);
    const { date } = z.object({ date: IsoDate.default(today) }).parse(req.body ?? {});
    const r = await run(req, (tx, a) => billMilestone(tx, a, p.id, p.childId, { date }));
    return reply.code(201).send({ id: r.invoice.id, number: r.invoice.number, total: r.invoice.total, warnings: r.warnings });
  });
  app.post("/projects/:id/bill-time", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({ date: IsoDate.default(today), upTo: IsoDate.default(today) }).parse(req.body ?? {});
    const r = await run(req, (tx, a) => billTime(tx, a, IdParam.parse(req.params).id, body));
    return reply.code(201).send({ id: r.invoice.id, number: r.invoice.number, total: r.invoice.total, warnings: r.warnings });
  });

  // Who can claim or log time (without needing HR access).
  app.get("/projects/people", { preHandler: can("projects.view") }, async (req) => run(req, async (tx) => {
    const rows = await tx.select({ id: tables.employees.id, code: tables.employees.code, name: tables.employees.name, nameHi: tables.employees.nameHi, status: tables.employees.status }).from(tables.employees).orderBy(asc(tables.employees.code));
    return rows;
  }));

  // ---- timesheets ------------------------------------------------------------------------------------
  app.get("/timesheets", { preHandler: can("projects.view") }, async (req) => {
    const q = z.object({
      projectId: z.uuid().optional(), employeeId: z.uuid().optional(), from: IsoDate.optional(), to: IsoDate.optional(),
      status: z.enum(["submitted", "approved", "rejected", "billed"]).optional(),
    }).parse(req.query);
    return run(req, async (tx) => (await listTime(tx, q)).map((r) => ({ ...r.t, employee: r.employee, code: r.code, project: r.project, projectCode: r.projectCode, task: r.task })));
  });
  app.post("/timesheets", { preHandler: can("projects.create") }, async (req, reply) => {
    const body = z.object({
      projectId: z.uuid(), taskId: z.uuid().nullish(), employeeId: z.uuid(), date: IsoDate, hours: Hours, billable: z.boolean().optional(), note: z.string().trim().max(200).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => logTime(tx, a, body)));
  });
  app.delete("/timesheets/:id", { preHandler: can("projects.create") }, async (req) => { await run(req, (tx, a) => deleteTime(tx, a, IdParam.parse(req.params).id)); return ok; });
  app.post("/timesheets/decide", { preHandler: can("projects.approve") }, async (req) => {
    const body = z.object({ ids: z.array(z.uuid()).min(1).max(500), decision: z.enum(["approved", "rejected"]) }).parse(req.body);
    await run(req, (tx, a) => decideTime(tx, a, body.ids, body.decision));
    return ok;
  });
}
