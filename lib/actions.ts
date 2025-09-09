"use server";

import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import redisClient from "@/lib/redis-client";
import { api } from "@/convex/_generated/api";

export async function addUserLocation(
    userId: string,
    longitude: number,
    latitude: number
) {
    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        await redisClient.geoAdd("user_locations", {
            longitude,
            latitude,
            member: userId,
        });
        return true;
    } catch (error) {
        console.error("Error adding user location to Redis:", error);
        return false;
    }
}

export async function getNearbyUsers(
    longitude: number,
    latitude: number,
    radius: number,
    unit: "m" | "km" | "mi" | "ft" = "km"
) {
    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        const users = await redisClient.GEORADIUS(
            "user_locations",
            { longitude, latitude },
            radius,
            unit
        );
        return users;
    } catch (error) {
        console.error("Error fetching nearby users from Redis:", error);
        return [];
    }
}

export async function addDonationRequestLocation(
    donationRequestId: string,
    longitude: number,
    latitude: number
) {
    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        await redisClient.geoAdd("donation_request_locations", {
            longitude,
            latitude,
            member: donationRequestId,
        });
        return true;
    } catch (error) {
        console.error(
            "Error adding donation request location to Redis:",
            error
        );
        return false;
    }
}

export async function getNearbyDonationRequests(
    longitude: number,
    latitude: number,
    radius: number,
    unit: "m" | "km" | "mi" | "ft" = "km"
) {
    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        return (await redisClient.GEORADIUS(
            "donation_request_locations",
            { longitude, latitude },
            radius,
            unit
        )) as Id<"donationRequests">[];
    } catch (error) {
        console.error(
            "Error fetching nearby donation requests from Redis:",
            error
        );
        return [];
    }
}
