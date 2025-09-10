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
            .filter((q) =>
                q.or(
                    q.eq(q.field("requestResponseStatus"), "Declined"),
                    q.eq(q.field("donationStatus"), "Cancelled")
                )
            )
            .collect();

        const requests = (
            await Promise.all(
                requestIds.map((id) =>
                    ctx.db
                        .query("donationRequests")
                        .withIndex("by_id", (q) => q.eq("_id", id))
                        .filter((q) =>
                            q.and(
                                q.neq(q.field("receiverId"), userId),
                                q.eq(q.field("requestStatus"), "Active")
                            )
                        )
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
                        .filter((q) => q.eq(q.field("donorId"), userId))
                        .first()
                )
            )
        )
            .filter((res) => res !== null)
            .map(({ _id, requestId, requestResponseStatus }) => ({
                _id,
                requestId,
                requestResponseStatus,
            }));

        return { requests, userNames, requestResponseStatus };
    },
});

export const getAllDonationRequestCoordinates = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();
        if (user === null || !user.isAdmin) {
            return [];
        }

        const requests = await ctx.db.query("donationRequests").collect();

        return requests.map((req) => ({
            _id: req._id,
            longitude: req.addressLongitude,
            latitude: req.addressLatitude,
        }));
    },
});

export const getAllDonationRequests = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();
        if (user === null || !user.isAdmin) {
            return [];
        }

        const requests = await ctx.db.query("donationRequests").collect();
        const userNames = (
            await Promise.all(requests.map((req) => ctx.db.get(req.receiverId)))
        ).filter((user) => user !== null);
        const responses = await Promise.all(
            requests.map((req) =>
                ctx.db
                    .query("donationRequestsToDonors")
                    .withIndex("indexRequestId", (q) =>
                        q.eq("requestId", req._id)
                    )
                    .filter((q) =>
                        q.neq(q.field("requestResponseStatus"), "Declined")
                    )
                    .collect()
                    .then((res) => res.length)
            )
        );

        return requests.map((req, index) => ({
            ...req,
            userName: userNames[index]?.fullName || "Unknown",
            email: userNames[index]?.email || "Unknown",
            phoneNumber: userNames[index]?.phoneNumber || "Unknown",
            totalResponses: responses[index],
        }));
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

export const updateDonationRequestStatus = mutation({
    args: {
        requestId: v.id("donationRequests"),
        newStatus: v.union(
            v.literal("Active"),
            v.literal("Cancelled"),
            v.literal("Fulfilled")
        ),
    },
    handler: async (ctx, { requestId, newStatus }) => {
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

        const request = await ctx.db.get(requestId);
        if (!request || (!user.isAdmin && request.receiverId !== user._id)) {
            return false;
        }

        if (request.requestStatus === "Fulfilled" && !user.isAdmin) {
            return false;
        }

        try {
            await ctx.db.patch(requestId, { requestStatus: newStatus });
            return true;
        } catch (error) {
            console.error("[Update Donation Request Status Error]", error);
            return false;
        }
    },
});
