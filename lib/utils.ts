import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
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
