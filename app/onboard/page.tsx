"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
import { showToast } from "@/components/others/extras";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { addUserLocations } from "@/lib/actions";

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
    const router = useRouter();
    const user = useQuery(api.users.getUserExistence);
    const createUser = useMutation(api.users.createUser);

    useEffect(() => {
        if (user && user.exists) {
            router.push("/profile");
            return;
        }

        if (user === null) {
            router.push("/");
            return;
        }
    }, [user, router]);

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

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const getCurrentLocation = () => {
        setLocationLoading(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    form.setValue(
                        "addressCoordinate.latitude",
                        position.coords.latitude
                    );
                    form.setValue(
                        "addressCoordinate.longitude",
                        position.coords.longitude
                    );
                    setLocationLoading(false);
                    form.clearErrors("addressCoordinate");
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationLoading(false);
                }
            );
        } else {
            showToast({
                title: "Geolocation is not supported by this browser",
                isWarning: true,
            });
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

            const res = await createUser({
                userData: {
                    ...data,
                    email: userEmail,
                    isAdmin: false,
                    isDonating: false,
                    isActive: true,
                    accountStatus: true,
                },
            });

            if (res.success && res.id) {
                showToast({ title: "Account created successfully" });
                if (
                    !(await addUserLocations([
                        {
                            _id: res.id,
                            latitude: data.addressCoordinate.latitude,
                            longitude: data.addressCoordinate.longitude,
                        },
                    ]))
                ) {
                    showToast({
                        title: "Failed to add user location",
                        isWarning: true,
                    });
                }
                router.push("/profile");
            } else {
                showToast({
                    title: "Account creation failed",
                    isWarning: true,
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            showToast({
                title: "An error occurred during registration",
                isWarning: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (user === undefined) {
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

    if (user === null || (user && user.exists)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Redirecting...
                    </h2>
                    <p className="text-gray-600">
                        Please wait while we redirect you.
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
                    <Form {...form}>
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem className="group">
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Full Name *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your full name"
                                                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 group-hover:border-gray-300"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nid"
                                        render={({ field }) => (
                                            <FormItem className="group">
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    National ID Number *
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <Input
                                                            placeholder="Enter your NID"
                                                            className="h-12 pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-200 group-hover:border-gray-300"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                {user.email ||
                                                    "No email available"}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Email is verified from your
                                                account
                                            </p>
                                        </div>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Phone Number *
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="flex items-center border border-gray-300 rounded-md transition-colors focus-within:border-primary focus-within:shadow-sm">
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                                                <span className="inline-flex items-center px-3 py-2 pl-10 bg-gray-50 text-sm text-gray-500 rounded-l-md border-r border-gray-300">
                                                                    +880
                                                                </span>
                                                            </div>
                                                            <Input
                                                                placeholder="1712345678"
                                                                className="border-0 rounded-l-none focus:ring-0 focus:outline-none bg-transparent"
                                                                maxLength={10}
                                                                {...field}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const cleaned =
                                                                        e.target.value.replace(
                                                                            /\D/g,
                                                                            ""
                                                                        );
                                                                    const limited =
                                                                        cleaned.slice(
                                                                            0,
                                                                            10
                                                                        );
                                                                    field.onChange(
                                                                        limited
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs text-gray-500">
                                                    Enter 10 digits starting
                                                    with 13, 14, 15, 16, 17, 18,
                                                    or 19
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="bloodType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Blood Type *
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="glass-input">
                                                        <div className="flex items-center gap-2">
                                                            <Droplets className="h-4 w-4 text-primary" />
                                                            <SelectValue placeholder="Select your blood type" />
                                                        </div>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {bloodTypes.map((type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {type}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                    <FormField
                                        control={form.control}
                                        name="addressText.house"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    House/Building
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter house/building number"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="addressText.road"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Road/Street
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter road/street"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="addressText.block"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Block
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter block/house"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="addressText.area"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Area/Locality
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter area/locality"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="addressText.zip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    ZIP/Postal Code *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter ZIP code"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <FormField
                                        control={form.control}
                                        name="addressText.district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    District *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter district"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="addressText.division"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium">
                                                    Division *
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter division"
                                                        className="glass-input"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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

                                    {(form.formState.errors.addressCoordinate
                                        ?.latitude ||
                                        form.formState.errors.addressCoordinate
                                            ?.longitude) && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors
                                                .addressCoordinate?.latitude
                                                ?.message ||
                                                form.formState.errors
                                                    .addressCoordinate
                                                    ?.longitude?.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-gray-100">
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-primary/25"
                                    disabled={isLoading}
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
                    </Form>
                </div>
            </div>
        </div>
    );
}
