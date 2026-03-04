// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const DEFAULT_ROOM = {
  mode: 'countdown' as const,
  duration: 300,
  status: 'paused' as const,
  referenceTime: Date.now(),
  pausedRemaining: 300,
  message: '',
  messageColor: '#ffffff',
  flash: false,
  invertColors: false,
  showAnimation: false,
  signalColors: {
    speedUp: '#fbbf24',
    wrapUp: '#f97316',
    timesUp: '#ef4444',
  },
};

export const get = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
  },
});

export const join = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!existing) {
      await ctx.db.insert("rooms", {
        roomId: args.roomId,
        ...DEFAULT_ROOM,
      });
    }
  },
});

export const update = mutation({
  args: {
    roomId: v.string(),
    mode: v.optional(v.union(v.literal('countdown'), v.literal('countup'), v.literal('clock'))),
    duration: v.optional(v.number()),
    status: v.optional(v.union(v.literal('running'), v.literal('paused'))),
    referenceTime: v.optional(v.number()),
    pausedRemaining: v.optional(v.number()),
    message: v.optional(v.string()),
    messageColor: v.optional(v.string()),
    flash: v.optional(v.boolean()),
    invertColors: v.optional(v.boolean()),
    showAnimation: v.optional(v.boolean()),
    signalColors: v.optional(v.object({
      speedUp: v.string(),
      wrapUp: v.string(),
      timesUp: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { roomId, ...updates } = args;
    const existing = await ctx.db
      .query("rooms")
      .withIndex("by_roomId", (q) => q.eq("roomId", roomId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, updates);
    }
  },
});
