"use client";

import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BLOOD_TYPES, cn, URGENCY_LEVELS } from "@/lib/utils";
import { Navigation, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { showToast } from "../others/extras";

const donationRequestSchema = z.object({
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        message: "Please select a valid blood type",
    }),
    urgency: z.enum(["Low", "Medium", "High", "Critical"], {
        message: "Urgency must be one of Low, Medium, High, Critical",
    }),
    location: z.string().min(1, "Location is required"),
    addressCoordinate: z.object({
        latitude: z
            .number()
            .min(-90, "Invalid latitude")
            .max(90, "Invalid latitude")
            .refine((val) => val !== 0, "Please get your current location"),
        longitude: z
            .number()
            .min(-180, "Invalid longitude")
            .max(180, "Invalid longitude")
            .refine((val) => val !== 0, "Please get your current location"),
    }),
    amount: z.string().min(1, "Amount is required"),
    message: z.string().optional(),
});
type DonationRequestForm = z.infer<typeof donationRequestSchema>;

export default function NewDonationRequest() {
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const createDonationRequest = useMutation(
        api.donationRequests.createDonationRequest
    );

    const form = useForm<DonationRequestForm>({
        resolver: zodResolver(donationRequestSchema),
        defaultValues: {
            bloodType: "A+",
            urgency: undefined,
            location: "",
            amount: "",
            message: "",
            addressCoordinate: { latitude: 0, longitude: 0 },
        },
    });

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                form.setValue("addressCoordinate", {
                    latitude: parseFloat(latitude.toFixed(6)),
                    longitude: parseFloat(longitude.toFixed(6)),
                });
                setIsGettingLocation(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                let errorMessage = "Unable to get your location.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied by user.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                }
                alert(errorMessage);
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    };

    const onSubmit = async (data: DonationRequestForm) => {
        const res = await createDonationRequest({
            bloodType: data.bloodType,
            amountNeeded: data.amount,
            urgencyLevel: data.urgency,
            addressText: data.location,
            addressLatitude: data.addressCoordinate.latitude,
            addressLongitude: data.addressCoordinate.longitude,
            requestStatus: "Active",
            message: data.message || "",
        });

        if (res) {
            showToast({ title: "Donation request created successfully" });
            form.reset();
            setIsNewRequestOpen(false);
        } else {
            showToast({
                title: "Failed to create donation request. Please try again.",
            });
        }
    };

    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">
                Blood Donation Requests
            </h2>
            <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
                <DialogTrigger asChild>
                    <Button className="hover:scale-105 transition-transform">
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Blood Request</DialogTitle>
                        <DialogDescription>
                            Submit a new blood donation request to find
                            compatible donors in your area.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            className="flex flex-col gap-4 py-4"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="bloodType"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Blood Type Needed</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    className={cn("w-full", {
                                                        "border-red-500":
                                                            fieldState.error,
                                                    })}
                                                >
                                                    <SelectValue placeholder="Select blood type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BLOOD_TYPES.map((type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount Needed</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., 200ml, 450ml"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="urgency"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Urgency Level</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    className={cn("w-full", {
                                                        "border-red-500":
                                                            fieldState.error,
                                                    })}
                                                >
                                                    <SelectValue placeholder="Select urgency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {URGENCY_LEVELS.map(
                                                        (level) => (
                                                            <SelectItem
                                                                key={level}
                                                                value={level}
                                                            >
                                                                {level}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Hospital/Location</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                <Input
                                                    className={cn({
                                                        "border-red-500":
                                                            fieldState.error,
                                                    })}
                                                    placeholder="Enter hospital or location"
                                                    autoComplete="off"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        form.clearErrors(
                                                            "addressCoordinate"
                                                        );
                                                        getCurrentLocation();
                                                    }}
                                                    disabled={isGettingLocation}
                                                    className={cn(
                                                        "w-full sm:w-auto",
                                                        {
                                                            "border-red-500":
                                                                !!(
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .addressCoordinate
                                                                        ?.latitude ||
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .addressCoordinate
                                                                        ?.longitude
                                                                ),
                                                        }
                                                    )}
                                                >
                                                    <Navigation className="h-5 w-5" />
                                                    {isGettingLocation
                                                        ? "Getting Location..."
                                                        : "Detect Location"}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        {form.formState.errors
                                            .addressCoordinate &&
                                            (form.formState.errors
                                                .addressCoordinate.latitude ||
                                                form.formState.errors
                                                    .addressCoordinate
                                                    .longitude) && (
                                                <div className="text-sm font-medium text-destructive mt-1">
                                                    {form.formState.errors
                                                        .addressCoordinate
                                                        .latitude?.message ||
                                                        form.formState.errors
                                                            .addressCoordinate
                                                            .longitude?.message}
                                                </div>
                                            )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide details about the blood need..."
                                                rows={3}
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Submit Request
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
