import { v } from "convex/values";
import { User } from "./schema";
import { mutation, query } from "./_generated/server";

export const getUserExistence = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        if (!identity.emailVerified) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();

        if (user !== null) {
            return { email: user.email, exists: true };
        }
        return { email: identity.email, exists: false };
    },
});

export const getUserProfileData = query({
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

        let totalDonations = 0;
        let lastDonated = null;
        let totalDonationsReceived = 0;

        if (user !== null) {
            const allDonations = await ctx.db
                .query("donationRequestsToDonors")
                .withSearchIndex("searchDonorId", (q) =>
                    q
                        .search("donorId", user._id)
                        .eq("donationStatus", "Fulfilled")
                )
                .collect();

            totalDonations = allDonations.length;
            if (totalDonations > 0) {
                lastDonated =
                    allDonations.sort(
                        (a, b) => (b.donationTime ?? 0) - (a.donationTime ?? 0)
                    )[0]?.donationTime || null;
            }

            totalDonationsReceived = await ctx.db
                .query("donationRequests")
                .withSearchIndex("searchReceiverId", (q) =>
                    q
                        .search("receiverId", user._id)
                        .eq("requestStatus", "Fulfilled")
                )
                .collect()
                .then((donations) => donations.length);
        }

        return {
            ...user,
            exists: user !== null,
            totalDonations,
            lastDonated,
            totalDonationsReceived,
        };
    },
});

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

            return { requestsMade, requestResponses, requestReceived, detailedRequestsReceived };
        }

        return null;
    },
});

export const createUser = mutation({
    args: {
        userData: User,
    },
    handler: async (ctx, { userData }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return false;
        }

        if (!identity.emailVerified) {
            return false;
        }

        const existingUser = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();

        if (existingUser) {
            return false;
        }

        try {
            const userDataWithCorrectEmail = {
                ...userData,
                email: identity.email as string,
            };

            await ctx.db.insert("users", userDataWithCorrectEmail);
            return true;
        } catch (error) {
            console.error("[User Creation Error]", error);
            return false;
        }
    },
});

export const updateUserProfileData = mutation({
    args: {
        phoneNumber: v.string(),
        addressText: v.object({
            house: v.optional(v.string()),
            road: v.optional(v.string()),
            block: v.optional(v.string()),
            area: v.optional(v.string()),
            zip: v.string(),
            district: v.string(),
            division: v.string(),
        }),
        addressCoordinate: v.object({
            latitude: v.number(),
            longitude: v.number(),
        }),
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
    },
    handler: async (
        ctx,
        { phoneNumber, addressText, addressCoordinate, bloodType }
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
            await ctx.db.patch(user._id, {
                phoneNumber,
                addressText,
                addressCoordinate,
                bloodType,
            });
            return true;
        } catch (error) {
            console.error("[User Profile Update Error]", error);
            return false;
        }
    },
});
