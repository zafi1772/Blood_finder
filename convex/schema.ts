import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = v.object({
    fullName: v.string(),
    email: v.string(),
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
    nid: v.string(),
    profilePictureObjectId: v.optional(v.id("_storage")),
    nidObjectId: v.optional(v.id("_storage")),
    isAdmin: v.boolean(),
    isDonating: v.boolean(),
    isActive: v.boolean(),
    accountStatus: v.boolean(),
});

export const DonationRequest = {
    receiverId: v.id("users"),
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
};

export const DonationRequestToDonor = {
    requestId: v.id("donationRequests"),
    donorId: v.id("users"),
    requestResponseStatus: v.union(
        v.literal("Accepted"),
        v.literal("Rejected")
    ),
    donationStatus: v.union(v.literal("Fulfilled"), v.literal("Pending")),
    donationTime: v.optional(v.number()),
};

export const Conversation = {
    requestId: v.id("donationRequests"),
    message: v.string(),
    status: v.boolean(),
    senderId: v.id("users"),
    receiverId: v.id("users"),
};

export default defineSchema({
    users: defineTable(User).index("indexEmail", ["email"]),
    donationRequests: defineTable(DonationRequest).searchIndex(
        "searchReceiverId",
        {
            searchField: "receiverId",
            filterFields: ["requestStatus"],
        }
    ),
    donationRequestsToDonors: defineTable(DonationRequestToDonor)
        .searchIndex("searchRequestId", {
            searchField: "requestId",
            filterFields: [
                "donorId",
                "requestResponseStatus",
                "donationStatus",
            ],
        })
        .searchIndex("searchDonorId", {
            searchField: "donorId",
            filterFields: [
                "requestId",
                "requestResponseStatus",
                "donationStatus",
            ],
        })
        .searchIndex("searchRequestResponseStatus", {
            searchField: "requestResponseStatus",
            filterFields: ["requestId", "donorId", "donationStatus"],
        })
        .searchIndex("searchDonationStatus", {
            searchField: "donationStatus",
            filterFields: ["requestId", "donorId", "requestResponseStatus"],
        }),
    conversations: defineTable(Conversation),
});
