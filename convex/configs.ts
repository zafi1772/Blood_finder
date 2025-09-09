import { query } from "./_generated/server";

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
