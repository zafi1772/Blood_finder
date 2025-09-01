import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        fullName: v.string(),
        email: v.string(),
        phoneNumber: v.string(),
        addressText: v.object({
            road: v.optional(v.string()),
            block: v.optional(v.string()),
            area: v.optional(v.string()),
            zip: v.optional(v.string()),
            district: v.optional(v.string()),
            division: v.optional(v.string()),
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
        nid: v.string(),
        profilePictureObjectId: v.optional(v.id("_storage")),
        nidObjectId: v.optional(v.id("_storage")),
        isAdmin: v.boolean(),
        isDonating: v.boolean(),
        isActive: v.boolean(),
        accountStatus: v.boolean(),
    }),
    donationRequests: defineTable({
        receiverId: v.id("users"),
        donatorId: v.id("users"),
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
        amountNeeded: v.number(),
        urgencyLevel: v.union(
            v.literal("Low"),
            v.literal("Medium"),
            v.literal("High"),
            v.literal("Critical"),
        ),
        address: v.object({
            addressText: v.string(),
            latitude: v.number(),
            longitude: v.number(),
        }),
        requestStatus: v.boolean(),
        donationStatus: v.boolean(),
    }),
    conversations: defineTable({
        requestId: v.id("donationRequests"),
        message: v.string(),
        status: v.boolean(),
        senderId: v.id("users"),
        receiverId: v.id("users")
    })
});