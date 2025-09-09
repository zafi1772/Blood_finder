import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserMadeDonationRequests = query({
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
                .withIndex("indexReceiverId", (q) =>
                    q.eq("receiverId", user._id)
                )
                .collect();
            const requestResponses: Record<string, number> = {};
            for (const request of requestsMade) {
                const responses = await ctx.db
                    .query("donationRequestsToDonors")
                    .withIndex("indexRequestId", (q) =>
                        q.eq("requestId", request._id)
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

            return {
                requestsMade,
                requestResponses,
            };
        }

        return null;
    },
});

export const getDonationRequestsByIds = query({
    args: {
        requestIds: v.array(v.id("donationRequests")),
    },
    handler: async (ctx, { requestIds }) => {
        if (!requestIds) {
            return { requests: [], userNames: [] };
        }

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return { requests: [], userNames: [] };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();
        if (!user || !user.isDonating) {
            return { requests: [], userNames: [] };
        }
        const userId = user._id;

        const declinedRequests = await ctx.db
            .query("donationRequestsToDonors")
            .withIndex("indexDonorId", (q) => q.eq("donorId", userId))
            .filter((q) => q.eq(q.field("requestResponseStatus"), "Declined"))
            .collect();

        const requests = (
            await Promise.all(
                requestIds.map((id) =>
                    ctx.db
                        .query("donationRequests")
                        .withIndex("by_id", (q) => q.eq("_id", id))
                        .filter((q) => q.neq(q.field("receiverId"), userId))
                        .filter((q) => q.eq(q.field("requestStatus"), "Active"))
                        .first()
                )
            )
        )
            .filter((req) => req !== null)
            .filter(
                (req) =>
                    !declinedRequests.some((dr) => dr.requestId === req._id)
            );

        const userNames = (
            await Promise.all(requests.map((req) => ctx.db.get(req.receiverId)))
        )
            .filter((user) => user !== null)
            .map(({ fullName }) => ({ fullName }));

        const requestResponseStatus = (
            await Promise.all(
                requests.map((req) =>
                    ctx.db
                        .query("donationRequestsToDonors")
                        .withIndex("indexRequestId", (q) =>
                            q.eq("requestId", req._id)
                        )
                        .first()
                )
            )
        )
            .filter((res) => res !== null)
            .map((res) => ({
                requestId: res.requestId,
                requestResponseStatus: res.requestResponseStatus,
            }));

        return { requests, userNames, requestResponseStatus };
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
            return { id: null, success: false };
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();
        if (user === null) {
            return { id: null, success: false };
        }

        try {
            const id = await ctx.db.insert("donationRequests", {
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
            return { id, success: true };
        } catch (error) {
            console.error("[Create Donation Request Error]", error);
            return { id: null, success: false };
        }
    },
});
