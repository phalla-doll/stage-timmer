import type { QueryCtx, MutationCtx } from "convex/server";

export const query: <T>(func: (ctx: QueryCtx, args: T) => any) => any = () => {};
export const mutation: <T>(func: (ctx: MutationCtx, args: T) => any) => any = () => {};
