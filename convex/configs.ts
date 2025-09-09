import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDonorSearchRadiusInKm = query({
    handler: async (ctx) => {
        const config = await ctx.db
            .query("configs")
            .withIndex("by_creation_time")
            .order("desc")
            .first();

        return config ? config.donorSearchRadiusInKm : 5;
    },
});

export const updateSearchRadius = mutation({
    args: {
        radiusInKm: v.number(),
    },
    handler: async (ctx, { radiusInKm }) => {
        if (radiusInKm < 1 || radiusInKm > 20000) {
            return false;
        }

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return false;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();
        if (!user || !user.isAdmin) {
            return false;
        }

        const config = await ctx.db
            .query("configs")
            .withIndex("by_creation_time")
            .order("desc")
            .first();
        if (!config) {
            return false;
        }

        try {
            await ctx.db.patch(config._id, {
                donorSearchRadiusInKm: radiusInKm,
            });
            return true;
        } catch (error) {
            console.error("[Error updating search radius]", error);
            return false;
        }
    },
});
