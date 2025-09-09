"use server";

import redisClient from "@/lib/redis-client";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/auth";

const USER_LOCATIONS_KEY = "user_locations";
const DONATION_REQUEST_LOCATIONS_KEY = "donation_request_locations";

export async function addUserLocations(
    userLocations: { _id: string; longitude: number; latitude: number }[]
) {
    const token = await getAuthToken();
    if (!token) {
        return false;
    }

    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        await redisClient.geoAdd(
            USER_LOCATIONS_KEY,
            userLocations.map((loc) => ({
                longitude: loc.longitude,
                latitude: loc.latitude,
                member: loc._id,
            }))
        );
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
    const token = await getAuthToken();
    if (!token) {
        return false;
    }

    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        const users = await redisClient.GEORADIUS(
            USER_LOCATIONS_KEY,
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

export async function addDonationRequestLocations(
    donationRequestLocations: {
        _id: string;
        longitude: number;
        latitude: number;
    }[]
) {
    const token = await getAuthToken();
    if (!token) {
        return false;
    }

    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        await redisClient.geoAdd(
            DONATION_REQUEST_LOCATIONS_KEY,
            donationRequestLocations.map((loc) => ({
                longitude: loc.longitude,
                latitude: loc.latitude,
                member: loc._id,
            }))
        );
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
    const token = await getAuthToken();
    if (!token) {
        return false;
    }

    if (redisClient.isOpen === false) {
        await redisClient.connect();
    }

    try {
        return (await redisClient.GEORADIUS(
            DONATION_REQUEST_LOCATIONS_KEY,
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

export async function syncLocations() {
    const token = await getAuthToken();
    if (!token) {
        return false;
    }

    try {
        const [userLocations, donationRequestLocations] = await Promise.all([
            fetchQuery(
                api.users.getAddressCoordinatesOfAllUsers,
                {},
                { token }
            ),
            fetchQuery(
                api.donationRequests.getAllDonationRequestCoordinates,
                {},
                { token }
            ),
        ]);

        return (
            await Promise.all([
                addUserLocations(userLocations),
                addDonationRequestLocations(donationRequestLocations),
            ])
        ).every((res) => res);
    } catch (error) {
        console.error("[Error syncing locations to Redis]", error);
        return false;
    }
}
