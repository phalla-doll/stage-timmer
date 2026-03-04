import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    roomId: v.string(),
    mode: v.union(v.literal('countdown'), v.literal('countup'), v.literal('clock')),
    duration: v.number(),
    status: v.union(v.literal('running'), v.literal('paused')),
    referenceTime: v.number(),
    pausedRemaining: v.number(),
    message: v.string(),
    messageColor: v.string(),
    flash: v.boolean(),
    invertColors: v.boolean(),
    showAnimation: v.boolean(),
    signalColors: v.object({
      speedUp: v.string(),
      wrapUp: v.string(),
      timesUp: v.string(),
    }),
  }).index("by_roomId", ["roomId"]),
});
