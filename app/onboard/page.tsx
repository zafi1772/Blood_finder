"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MapPin,
    User,
    Mail,
    Phone,
    MapPinIcon,
    Droplets,
    CreditCard,
    Loader2,
} from "lucide-react";

import { redirect } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const onboardSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters"),
    email: z.string().optional(), 
    phoneNumber: z
        .string()
        .min(10, "Phone number must be exactly 10 digits")
        .max(10, "Phone number must be exactly 10 digits")
        .refine((val) => {
            const cleaned = val.replace(/\D/g, "");
            const pattern = /^1[3-9]\d{8}$/;
            return pattern.test(cleaned);
        }, "Please enter a valid Bangladeshi mobile number (10 digits starting with 13, 14, 15, 16, 17, 18, or 19)"),
    addressText: z.object({
        house: z.string().optional(),
        road: z.string().optional(),
        block: z.string().optional(),
        area: z.string().optional(),
        zip: z
            .string()
            .min(1, "ZIP code is required")
            .refine(
                (val) => /^\d{4,6}$/.test(val),
                "ZIP code should be 4-6 digits"
            ),
        district: z.string().min(1, "District is required"),
        division: z.string().min(1, "Division is required"),
    }),
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
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        message: "Please select a valid blood type",
    }),
    nid: z
        .string()
        .min(10, "NID must be at least 10 characters")
        .max(20, "NID must not exceed 20 characters")
        .regex(/^[\d\w]+$/, "NID should only contain letters and numbers"),
});

type OnboardFormData = z.infer<typeof onboardSchema>;

export default function OnboardPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const user = useQuery(api.users.getUserExistence);
    const createUser = useMutation(api.users.createUser);

    const form = useForm<OnboardFormData>({
        resolver: zodResolver(onboardSchema),
        defaultValues: {
            fullName: "",
            email: user?.email || "",
            phoneNumber: "",
            addressText: {
                house: "",
                road: "",
                block: "",
                area: "",
                zip: "",
                district: "",
                division: "",
            },
            addressCoordinate: {
                latitude: 0,
                longitude: 0,
            },
            bloodType: "A+",
            nid: "",
        },
    });

    if (user && user.exists) {
        redirect("/profile");
    }

    if (user === null) {
        redirect("/");
    }

    const {
        setValue,
        watch,
        formState: { errors },
    } = form;
    const formData = watch();

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const handleInputChange = (field: string, value: string) => {
        if (field === "phoneNumber") {
            const cleaned = value.replace(/\D/g, "");
            const limited = cleaned.slice(0, 10);
            setValue("phoneNumber", limited);
            return;
        }

        if (field.startsWith("addressText.")) {
            const addressField = field.split(
                "."
            )[1] as keyof OnboardFormData["addressText"];
            setValue(`addressText.${addressField}`, value);
        } else {
            setValue(field as keyof OnboardFormData, value);
        }
    };

    const isFormReadyForSubmission = () => {
        const userEmail = user?.email;
        return (
            formData.fullName.trim().length >= 2 &&
            userEmail &&
            userEmail.length > 0 &&
            formData.phoneNumber.length === 10 &&
            /^1[3-9]\d{8}$/.test(formData.phoneNumber) &&
            formData.bloodType.trim().length > 0 &&
            formData.nid.trim().length >= 10 &&
            formData.addressText.zip.trim().length > 0 &&
            /^\d{4,6}$/.test(formData.addressText.zip) &&
            formData.addressText.district.trim().length > 0 &&
            formData.addressText.division.trim().length > 0 &&
            formData.addressCoordinate.latitude !== 0 &&
            formData.addressCoordinate.longitude !== 0
        );
    };

    const getCurrentLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setValue(
                        "addressCoordinate.latitude",
                        position.coords.latitude
                    );
                    setValue(
                        "addressCoordinate.longitude",
                        position.coords.longitude
                    );
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationLoading(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLocationLoading(false);
        }
    };

    const handleSubmit = async (data: OnboardFormData) => {
        setIsLoading(true);

        try {
            const userEmail = user?.email;
            if (!userEmail) {
                console.error("User email not available");
                setIsLoading(false);
                return;
            }

            await createUser({
                userData: {
                    ...data,
                    email: userEmail,
                    isAdmin: false,
                    isDonating: false,
                    isActive: true,
                    accountStatus: true,
                },
            });
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (user == undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Loading your profile...
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we prepare your onboarding experience.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary to-primary/80 bg-clip-text text-transparent mb-4">
                        Join BloodFinder
                    </h1>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
                        Complete your profile to start saving lives in your
                        community. Your information helps us connect donors with
                        those in need.
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl shadow-primary/5 p-8 md:p-12">
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8"
                    >
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Personal Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Tell us about yourself
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="group">
                                    <Label
                                        htmlFor="fullName"
                                        className="text-sm font-medium text-gray-700 mb-2 block"
                                    >
                                        Full Name *
                                    </Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "fullName",
                                                e.target.value
                                            )
                                        }
                                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 group-hover:border-gray-300"
                                        required
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="group">
                                    <Label
                                        htmlFor="nid"
                                        className="text-sm font-medium text-gray-700 mb-2 block"
                                    >
                                        National ID Number *
                                    </Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="nid"
                                            type="text"
                                            placeholder="Enter your NID"
                                            value={formData.nid}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "nid",
                                                    e.target.value
                                                )
                                            }
                                            className="h-12 pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 group-hover:border-gray-300"
                                            required
                                        />
                                    </div>
                                    {errors.nid && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            {errors.nid.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium"
                                    >
                                        Email Address *
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <div className="glass-input pl-10 bg-gray-50 text-gray-700 cursor-not-allowed h-10 flex items-center">
                                            {user.email || "No email available"}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Email is verified from your account
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phoneNumber"
                                        className="text-sm font-medium"
                                    >
                                        Phone Number *
                                    </Label>
                                    <div className="relative">
                                        <div className="flex items-center border border-gray-300 rounded-md transition-colors focus-within:border-primary focus-within:shadow-sm">
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                                <span className="inline-flex items-center px-3 py-2 pl-10 bg-gray-50 text-sm text-gray-500 rounded-l-md border-r border-gray-300">
                                                    +880
                                                </span>
                                            </div>
                                            <Input
                                                id="phoneNumber"
                                                type="tel"
                                                placeholder="1712345678"
                                                value={formData.phoneNumber}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "phoneNumber",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-0 rounded-l-none focus:ring-0 focus:outline-none bg-transparent"
                                                required
                                                maxLength={10}
                                            />
                                        </div>
                                        {!errors.phoneNumber && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Enter 10 digits starting with
                                                13, 14, 15, 16, 17, 18, or 19
                                            </p>
                                        )}
                                        {errors.phoneNumber && (
                                            <p className="text-sm text-red-500">
                                                {errors.phoneNumber.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="bloodType"
                                    className="text-sm font-medium"
                                >
                                    Blood Type *
                                </Label>
                                <Select
                                    value={formData.bloodType}
                                    onValueChange={(value) =>
                                        handleInputChange("bloodType", value)
                                    }
                                >
                                    <SelectTrigger className="glass-input">
                                        <div className="flex items-center gap-2">
                                            <Droplets className="h-4 w-4 text-primary" />
                                            <SelectValue placeholder="Select your blood type" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                <div className="flex items-center gap-2">
                                                    {type}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.bloodType && (
                                    <p className="text-sm text-red-500">
                                        {errors.bloodType.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pt-4 border-t">
                                <MapPin className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                    Address Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="house"
                                        className="text-sm font-medium"
                                    >
                                        House/Building
                                    </Label>
                                    <Input
                                        id="house"
                                        type="text"
                                        placeholder="Enter house/building number"
                                        value={formData.addressText.house}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.house",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="road"
                                        className="text-sm font-medium"
                                    >
                                        Road/Street
                                    </Label>
                                    <Input
                                        id="road"
                                        type="text"
                                        placeholder="Enter road/street"
                                        value={formData.addressText.road}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.road",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="block"
                                        className="text-sm font-medium"
                                    >
                                        Block
                                    </Label>
                                    <Input
                                        id="block"
                                        type="text"
                                        placeholder="Enter block/house"
                                        value={formData.addressText.block}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.block",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="area"
                                        className="text-sm font-medium"
                                    >
                                        Area/Locality
                                    </Label>
                                    <Input
                                        id="area"
                                        type="text"
                                        placeholder="Enter area/locality"
                                        value={formData.addressText.area}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.area",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="zip"
                                        className="text-sm font-medium"
                                    >
                                        ZIP/Postal Code *
                                    </Label>
                                    <Input
                                        id="zip"
                                        type="text"
                                        placeholder="Enter ZIP code"
                                        value={formData.addressText.zip}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.zip",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="district"
                                        className="text-sm font-medium"
                                    >
                                        District *
                                    </Label>
                                    <Input
                                        id="district"
                                        type="text"
                                        placeholder="Enter district"
                                        value={formData.addressText.district}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.district",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="division"
                                        className="text-sm font-medium"
                                    >
                                        Division *
                                    </Label>
                                    <Input
                                        id="division"
                                        type="text"
                                        placeholder="Enter division"
                                        value={formData.addressText.division}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "addressText.division",
                                                e.target.value
                                            )
                                        }
                                        className="glass-input"
                                    />
                                </div>
                            </div>

                            {/* Location Coordinates */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        Current Location *
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={getCurrentLocation}
                                        disabled={locationLoading}
                                        className="glass-button bg-transparent"
                                    >
                                        {locationLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <MapPinIcon className="h-4 w-4 mr-2" />
                                        )}
                                        Get Location
                                    </Button>
                                </div>

                                {formData.addressCoordinate.latitude !== 0 && (
                                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                        <p className="text-sm text-muted-foreground">
                                            Location:{" "}
                                            {formData.addressCoordinate.latitude.toFixed(
                                                6
                                            )}
                                            ,{" "}
                                            {formData.addressCoordinate.longitude.toFixed(
                                                6
                                            )}
                                        </p>
                                    </div>
                                )}

                                {(errors.addressCoordinate?.latitude ||
                                    errors.addressCoordinate?.longitude) && (
                                    <p className="text-sm text-red-500">
                                        {errors.addressCoordinate?.latitude
                                            ?.message ||
                                            errors.addressCoordinate?.longitude
                                                ?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-100">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-primary/25"
                                disabled={
                                    isLoading || !isFormReadyForSubmission()
                                }
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <User className="h-5 w-5" />
                                        <span>Complete Registration</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
