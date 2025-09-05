import { query } from "./_generated/server";

export const getUserDonationHistory = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();

        if (!user) {
            return null;
        }

        const records = await ctx.db
            .query("donationRequestsToDonors")
            .withIndex("indexDonorId", (q) => q.eq("donorId", user._id))
            .collect();

        const donationRecords = [];
        for (const record of records) {
            const originalRequest = await ctx.db
                .query("donationRequests")
                .withIndex("by_id", (q) => q.eq("_id", record.requestId))
                .first();
            if (originalRequest) {
                donationRecords.push({
                    id: record._id,
                    bloodType: originalRequest.bloodType,
                    donationStatus: record.donationStatus,
                    donationDate: record.donationTime,
                    addressText: originalRequest.addressText,
                    amountNeeded: originalRequest.amountNeeded,
                    message: originalRequest.message,
                });
            }
        }

        return donationRecords;
    },
});
