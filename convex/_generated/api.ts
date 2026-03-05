import { makeFunctionReference } from "convex/server";

// Manually generated function references for Convex API
// Run `npx convex dev` or `npx convex deploy` to regenerate

export const api = {
  rooms: {
    get: makeFunctionReference("rooms:get") as any,
    join: makeFunctionReference("rooms:join") as any,
    update: makeFunctionReference("rooms:update") as any,
  },
};
