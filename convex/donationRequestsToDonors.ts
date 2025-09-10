import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const createDonationRequestToDonor = mutation({
    args: {
        requestId: v.id("donationRequests"),
        requestResponseStatus: v.union(
            v.literal("Accepted"),
            v.literal("Declined")
        ),
    },
    handler: async (ctx, { requestId, requestResponseStatus }) => {
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
        if (!user) {
            return false;
        }

        const existingRequest = await ctx.db
            .query("donationRequestsToDonors")
            .withIndex("indexRequestId", (q) => q.eq("requestId", requestId))
            .filter((q) => q.eq(q.field("donorId"), user._id))
            .first();
        if (existingRequest) {
            return false;
        }

        try {
            await ctx.db.insert("donationRequestsToDonors", {
                requestId,
                donorId: user._id,
                donationStatus: "Pending",
                requestResponseStatus,
            });
            return true;
        } catch (error) {
            console.error("[Error creating donation request to donor]", error);
            return false;
        }
    },
});

export const updateDonationStatus = mutation({
    args: {
        donationRequestToDonorId: v.id("donationRequestsToDonors"),
        newStatus: v.union(
            v.literal("Fulfilled"),
            v.literal("Cancelled"),
            v.literal("Pending")
        ),
    },
    handler: async (ctx, { donationRequestToDonorId, newStatus }) => {
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
        if (!user) {
            return false;
        }

        const donationRequestToDonor = await ctx.db
            .query("donationRequestsToDonors")
            .withIndex("by_id", (q) => q.eq("_id", donationRequestToDonorId))
            .first();
        if (!donationRequestToDonor) {
            return false;
        }
        if (donationRequestToDonor.donorId !== user._id && !user.isAdmin) {
            return false;
        }

        try {
            if (newStatus === "Fulfilled") {
                await ctx.db.patch(donationRequestToDonorId, {
                    donationStatus: newStatus,
                    donationTime: Date.now(),
                });

                await ctx.db.patch(donationRequestToDonor.requestId, {
                    requestStatus: newStatus,
                });
            } else {
                await ctx.db.patch(donationRequestToDonorId, {
                    donationStatus: newStatus,
                });
            }

            return true;
        } catch (error) {
            console.error("[Error updating donation status]", error);
            return false;
        }
    },
});
