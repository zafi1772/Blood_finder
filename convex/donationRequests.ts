import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getDonationRequests = query({
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

        if (user) {
            const requestsMade = await ctx.db
                .query("donationRequests")
                .withSearchIndex("searchReceiverId", (q) =>
                    q.search("receiverId", user._id)
                )
                .collect();
            const requestResponses: Record<string, number> = {};
            for (const request of requestsMade) {
                const responses = await ctx.db
                    .query("donationRequestsToDonors")
                    .withSearchIndex("searchRequestId", (q) =>
                        q.search("requestId", request._id)
                    )
                    .filter(
                        (q) =>
                            q.eq(
                                q.field("requestResponseStatus"),
                                "Accepted"
                            ) ||
                            q.eq(q.field("requestResponseStatus"), "Rejected")
                    )
                    .collect();
                requestResponses[request._id.toString()] = responses.length;
            }

            const requestReceived = await ctx.db
                .query("donationRequestsToDonors")
                .withSearchIndex("searchDonorId", (q) =>
                    q.search("donorId", user._id)
                )
                .collect();
            const detailedRequestsReceived = [];
            for (const request of requestReceived) {
                const originalRequest = await ctx.db
                    .query("donationRequests")
                    .withIndex("by_id", (q) => q.eq("_id", request.requestId))
                    .first();
                if (originalRequest) {
                    detailedRequestsReceived.push(originalRequest);
                }
            }

            return {
                requestsMade,
                requestResponses,
                requestReceived,
                detailedRequestsReceived,
            };
        }

        return null;
    },
});

export const createDonationRequest = mutation({
    args: {
        bloodType: v.union(
            v.literal("A+"),
            v.literal("A-"),
            v.literal("B+"),
            v.literal("B-"),
            v.literal("AB+"),
            v.literal("AB-"),
            v.literal("O+"),
            v.literal("O-")
        ),
        amountNeeded: v.string(),
        urgencyLevel: v.union(
            v.literal("Low"),
            v.literal("Medium"),
            v.literal("High"),
            v.literal("Critical")
        ),
        addressText: v.string(),
        addressLatitude: v.number(),
        addressLongitude: v.number(),
        requestStatus: v.union(
            v.literal("Active"),
            v.literal("Cancelled"),
            v.literal("Fulfilled")
        ),
        message: v.string(),
    },
    handler: async (
        ctx,
        {
            bloodType,
            amountNeeded,
            urgencyLevel,
            addressText,
            addressLatitude,
            addressLongitude,
            requestStatus,
            message,
        }
    ) => {
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
        if (user === null) {
            return false;
        }

        try {
            await ctx.db.insert("donationRequests", {
                receiverId: user._id,
                bloodType,
                amountNeeded,
                urgencyLevel,
                addressText,
                addressLatitude,
                addressLongitude,
                requestStatus,
                message,
            });
            return true;
        } catch (error) {
            console.error("[Create Donation Request Error]", error);
            return false;
        }
    },
});
