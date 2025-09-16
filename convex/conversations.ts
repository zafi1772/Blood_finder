import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Conversation } from "./schema";

export const getConversations = query({
    args: {
        requestId: v.id("donationRequests"),
        userId: v.id("users"),
    },
    handler: async (ctx, { requestId, userId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const [sender, receiver] = await Promise.all([
            ctx.db
                .query("users")
                .withIndex("indexEmail", (q) => q.eq("email", identity.email!))
                .first(),
            ctx.db.get(userId),
        ]);

        if (!sender || !receiver) {
            return null;
        }

        const donationRequest = await ctx.db.get(requestId);
        if (!donationRequest) {
            return null;
        }

        try {
            const conversations = await ctx.db
                .query("conversations")
                .withIndex("indexRequestId", (q) =>
                    q.eq("requestId", requestId)
                )
                .filter((q) =>
                    q.or(
                        q.and(
                            q.eq(q.field("senderId"), sender._id),
                            q.eq(q.field("receiverId"), receiver._id)
                        ),
                        q.and(
                            q.eq(q.field("senderId"), receiver._id),
                            q.eq(q.field("receiverId"), sender._id)
                        )
                    )
                )
                .order("asc")
                .collect();

            return {
                messages: conversations,
                sender: {
                    _id: sender._id,
                },
                receiver: {
                    _id: receiver._id,
                    avatarUrl: undefined,
                    fullName: receiver.fullName,
                    email: receiver.email,
                    phone: receiver.phoneNumber,
                    addressText: receiver.addressText,
                },
            };
        } catch (error) {
            console.error("[Error fetching conversations]", error);
            return null;
        }
    },
});

export const createConversation = mutation({
    args: Conversation,
    handler: async (
        ctx,
        { requestId, message, status, senderId, receiverId }
    ) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return false;
        }

        try {
            await ctx.db.insert("conversations", {
                requestId,
                message,
                status,
                senderId,
                receiverId,
            });
            return true;
        } catch (error) {
            console.error("[Error creating conversation]", error);
            return false;
        }
    },
});
