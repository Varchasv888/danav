import { AsyncLocalStorage } from "node:async_hooks";

/** What is known about the request being served, available anywhere below it without passing it down. */
export const requestContext = new AsyncLocalStorage<{ requestId: string }>();
