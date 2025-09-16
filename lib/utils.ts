import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFormattedDateTime(
    dateTime: string | number | undefined | null,
    short: boolean = true
) {
    if (dateTime === undefined || dateTime === null) {
        return "Unknown";
    }

    if (short) {
        return new Date(dateTime).toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });
    }
    return new Date(dateTime).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case "Active":
        case "Pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Fulfilled":
        case "Accepted":
        case "Responded":
        case "Completed":
            return "bg-green-100 text-green-800 border-green-200";
        case "Cancelled":
        case "Declined":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

export function renameObjectKey<T extends Record<string, unknown>>(
    obj: T,
    key: keyof T,
    newKey: string
): T {
    if (key !== newKey && obj.hasOwnProperty(key)) {
        Object.defineProperty(
            obj,
            newKey,
            Object.getOwnPropertyDescriptor(obj, key)!
        );
        delete obj[key];
    }

    return obj;
}

export function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function getDistanceFromLonLatInKm(
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

export const getInitials = (name: string) =>
    name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

export function timeSince(dateIso: string) {
    const seconds = Math.floor(
        (Date.now() - new Date(dateIso).getTime()) / 1000
    );
    const intervals: [number, string][] = [
        [60, "s"],
        [60, "m"],
        [24, "h"],
        [7, "d"],
        [4.34524, "w"],
        [12, "mo"],
    ];

    let value = seconds;
    let unit = "s";
    for (let i = 0; i < intervals.length; i++) {
        const [div, u] = intervals[i];
        if (value < div) {
            unit = unit;
            break;
        }
        value = Math.floor(value / div);
        unit = u;
    }
    return `${value}${unit} ago`;
}

export function formatAddress(address: {
    house?: string;
    road?: string;
    block?: string;
    area?: string;
    zip: string;
    district: string;
    division: string;
}) {
    const parts = [];
    if (address.house) parts.push(address.house);
    if (address.road) parts.push(address.road);
    if (address.block) parts.push(address.block);
    if (address.area) parts.push(address.area);
    if (address.district) parts.push(address.district);
    if (address.division) parts.push(address.division);
    if (address.zip) parts.push(address.zip);
    return parts.join(", ");
}
