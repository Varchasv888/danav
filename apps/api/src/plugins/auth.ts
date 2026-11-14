import type { FastifyReply, FastifyRequest } from "fastify";
import type { Permission } from "@varchasv/domain";
import { forbidden, unauthorized } from "../lib/errors.js";
import type { AuthContext } from "../lib/session.js";

declare module "fastify" {
  interface FastifyRequest {
    auth: AuthContext | null;
  }
}

export interface TenantAuth extends AuthContext {
  tenantId: string;
}

/** The signed-in user with an active tenant, or a 401/403. */
export function requireTenant(req: FastifyRequest): TenantAuth {
  if (!req.auth) throw unauthorized();
  if (!req.auth.tenantId) throw forbidden("no_tenant");
  return req.auth as TenantAuth;
}

type Guard = ((req: FastifyRequest, reply: FastifyReply) => Promise<void>) & { permissions: Permission[] };

/** Route guard: `{ preHandler: can("company.edit") }`. */
export function can(permission: Permission): Guard {
  const guard = async (req: FastifyRequest, _reply: FastifyReply) => {
    const auth = requireTenant(req);
    if (!auth.permissions.has(permission)) throw forbidden("missing_permission");
  };
  return Object.assign(guard, { permissions: [permission] });
}

/** Allowed only if the user has every one of the permissions. */
export function canAll(...permissions: Permission[]): Guard {
  const guard = async (req: FastifyRequest, _reply: FastifyReply) => {
    const auth = requireTenant(req);
    if (!permissions.every((p) => auth.permissions.has(p))) throw forbidden("missing_permission");
  };
  return Object.assign(guard, { permissions });
}

/** Allowed if the user has any one of the permissions. */
export function canAny(...permissions: Permission[]): Guard {
  const guard = async (req: FastifyRequest, _reply: FastifyReply) => {
    const auth = requireTenant(req);
    if (!permissions.some((p) => auth.permissions.has(p))) throw forbidden("missing_permission");
  };
  return Object.assign(guard, { permissions });
}

/** The permissions a route's preHandler guards demand (empty when it only needs a signed-in user, or none). */
export function guardPermissions(preHandler: unknown): Permission[] {
  const list = Array.isArray(preHandler) ? preHandler : preHandler ? [preHandler] : [];
  return list.flatMap((h) => (h as Partial<Guard>).permissions ?? []);
}
