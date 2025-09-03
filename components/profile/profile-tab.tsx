"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    User,
    Edit,
    MapPin,
    Phone,
    Mail,
    Save,
    X,
    Navigation,
} from "lucide-react";
import { toast } from "sonner";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AddressText {
    house?: string;
    road?: string;
    block?: string;
    area?: string;
    zip: string;
    district: string;
    division: string;
}

interface AddressCoordinate {
    latitude: number;
    longitude: number;
}

interface UserData {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    addressText?: AddressText;
    addressCoordinate?: AddressCoordinate;
    bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    nid?: string;
}

interface ProfileTabProps {
    user: UserData | null;
}

const addressTextSchema = z.object({
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
});

const addressCoordinateSchema = z.object({
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
});

const profileFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email({ pattern: z.regexes.html5Email }),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be exactly 10 digits")
        .max(10, "Phone number must be exactly 10 digits")
        .refine((val) => {
            const cleaned = val.replace(/\D/g, "");
            const pattern = /^1[3-9]\d{8}$/;
            return pattern.test(cleaned);
        }, "Please enter a valid Bangladeshi mobile number (10 digits starting with 13, 14, 15, 16, 17, 18, or 19)"),
    addressText: addressTextSchema,
    addressCoordinate: addressCoordinateSchema,
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        message: "Please select a valid blood type",
    }),
    nid: z
        .string()
        .min(10, "NID must be at least 10 characters")
        .max(20, "NID must not exceed 20 characters")
        .regex(/^[\d\w]+$/, "NID should only contain letters and numbers"),
});

export default function ProfileTab({ user }: ProfileTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [formData, setFormData] = useState<UserData>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateUserProfileData = useMutation(api.users.updateUserProfileData);

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData((prev) => ({
                    ...prev,
                    addressCoordinate: {
                        latitude: parseFloat(latitude.toFixed(6)),
                        longitude: parseFloat(longitude.toFixed(6)),
                    },
                }));
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

    const handleEditClick = () => {
        setFormData({
            fullName: user?.fullName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            addressText: user?.addressText || {
                house: "",
                road: "",
                block: "",
                area: "",
                zip: "",
                district: "",
                division: "",
            },
            addressCoordinate: user?.addressCoordinate || {
                latitude: 0,
                longitude: 0,
            },
            bloodType: user?.bloodType || "O+",
            nid: user?.nid || "",
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setErrors({});

        try {
            const { phoneNumber, addressText, addressCoordinate, bloodType } =
                profileFormSchema.parse(formData);
            const updated = await updateUserProfileData({
                phoneNumber,
                addressText,
                addressCoordinate,
                bloodType,
            });

            if (updated) {
                toast("Profile updated successfully", {
                    position: "top-center",
                    style: {
                        border: "1px solid var(--accent)",
                        backdropFilter: "blur(8px)",
                    },
                });
            } else {
                toast("Failed to update profile", {
                    position: "top-center",
                    style: {
                        background: "var(--destructive)",
                        color: "var(--destructive-foreground)",
                        border: "1px solid var(--destructive)",
                        backdropFilter: "blur(8px)",
                    },
                });
            }

            setIsEditing(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    const field = issue.path.join(".");
                    formErrors[field] = issue.message;
                });
                setErrors(formErrors);
            }
            console.log({ formData });
            console.error("Unexpected error:", error);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            addressText: user?.addressText || {
                house: "",
                road: "",
                block: "",
                area: "",
                zip: "",
                district: "",
                division: "",
            },
            addressCoordinate: user?.addressCoordinate || {
                latitude: 0,
                longitude: 0,
            },
            bloodType: user?.bloodType || "O+",
            nid: user?.nid || "",
        });
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        if (field.startsWith("addressText.")) {
            const addressField = field.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                addressText: {
                    house: prev.addressText?.house || "",
                    road: prev.addressText?.road || "",
                    block: prev.addressText?.block || "",
                    area: prev.addressText?.area || "",
                    zip: prev.addressText?.zip || "",
                    district: prev.addressText?.district || "",
                    division: prev.addressText?.division || "",
                    ...prev.addressText,
                    [addressField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const getFieldError = (fieldPath: string) => {
        return errors[fieldPath];
    };

    return (
        <div className="space-y-6">
            <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>
                        {isEditing
                            ? "Update your profile information"
                            : "Your basic profile information and contact details"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        // Edit Mode
                        <div className="space-y-6">
                            {Object.keys(errors).length > 0 && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800 font-medium mb-2">
                                        Please fix the following errors:
                                    </p>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        {Object.entries(errors).map(
                                            ([field, error]) => (
                                                <li
                                                    key={field}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="text-red-500 mt-0.5">
                                                        •
                                                    </span>
                                                    <span>{error}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.fullName}
                                        disabled
                                        className="bg-muted/50 cursor-not-allowed"
                                        placeholder="Enter your full name"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Name cannot be changed
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bloodType">
                                        Blood Type
                                    </Label>
                                    <Select
                                        value={formData.bloodType}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                "bloodType",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={`w-full ${getFieldError("bloodType") ? "border-red-500" : ""}`}
                                        >
                                            <SelectValue placeholder="Select blood type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bloodTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {getFieldError("bloodType") && (
                                        <p className="text-xs text-red-500">
                                            {getFieldError("bloodType")}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="bg-muted/50 cursor-not-allowed"
                                        placeholder="Email address"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "phoneNumber",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your phone number"
                                        className={
                                            getFieldError("phoneNumber")
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {getFieldError("phoneNumber") && (
                                        <p className="text-xs text-red-500">
                                            {getFieldError("phoneNumber")}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4">
                                <Label className="text-sm font-medium">
                                    Address
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="house">
                                            House (Optional)
                                        </Label>
                                        <Input
                                            id="house"
                                            value={
                                                formData.addressText?.house ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.house",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="House number/name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="road">
                                            Road (Optional)
                                        </Label>
                                        <Input
                                            id="road"
                                            value={
                                                formData.addressText?.road || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.road",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Road name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="block">
                                            Block (Optional)
                                        </Label>
                                        <Input
                                            id="block"
                                            value={
                                                formData.addressText?.block ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.block",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Block"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="area">
                                            Area (Optional)
                                        </Label>
                                        <Input
                                            id="area"
                                            value={
                                                formData.addressText?.area || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.area",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Area/Locality"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code *</Label>
                                        <Input
                                            id="zip"
                                            value={
                                                formData.addressText?.zip || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.zip",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="ZIP/Postal code"
                                            required
                                            className={
                                                getFieldError("addressText.zip")
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {getFieldError("addressText.zip") && (
                                            <p className="text-xs text-red-500">
                                                {getFieldError(
                                                    "addressText.zip"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">
                                            District *
                                        </Label>
                                        <Input
                                            id="district"
                                            value={
                                                formData.addressText
                                                    ?.district || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.district",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="District"
                                            required
                                            className={
                                                getFieldError(
                                                    "addressText.district"
                                                )
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {getFieldError(
                                            "addressText.district"
                                        ) && (
                                            <p className="text-xs text-red-500">
                                                {getFieldError(
                                                    "addressText.district"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="division">
                                            Division *
                                        </Label>
                                        <Input
                                            id="division"
                                            value={
                                                formData.addressText
                                                    ?.division || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "addressText.division",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Division"
                                            required
                                            className={
                                                getFieldError(
                                                    "addressText.division"
                                                )
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {getFieldError(
                                            "addressText.division"
                                        ) && (
                                            <p className="text-xs text-red-500">
                                                {getFieldError(
                                                    "addressText.division"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Coordinates Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    <Label className="text-base font-semibold text-primary">
                                        Location Coordinates
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Your location helps us match you with
                                        nearby blood requests. Coordinates are
                                        detected automatically.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="p-4 bg-muted/30 rounded-xl border flex flex-col gap-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground">
                                                Current Location
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={getCurrentLocation}
                                                disabled={isGettingLocation}
                                                className="w-full sm:w-auto mt-2 sm:mt-0 gap-2"
                                            >
                                                <Navigation className="h-5 w-5" />
                                                {isGettingLocation
                                                    ? "Getting Location..."
                                                    : "Detect Location"}
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    Latitude
                                                </span>
                                                <span className="bg-muted/50 rounded px-2 py-1 mt-1">
                                                    {formData.addressCoordinate
                                                        ?.latitude || "Not set"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    Longitude
                                                </span>
                                                <span className="bg-muted/50 rounded px-2 py-1 mt-1">
                                                    {formData.addressCoordinate
                                                        ?.longitude ||
                                                        "Not set"}
                                                </span>
                                            </div>
                                        </div>
                                        {(getFieldError(
                                            "addressCoordinate.latitude"
                                        ) ||
                                            getFieldError(
                                                "addressCoordinate.longitude"
                                            )) && (
                                            <div className="mt-2">
                                                {getFieldError(
                                                    "addressCoordinate.latitude"
                                                ) && (
                                                    <p className="text-xs text-red-500">
                                                        {getFieldError(
                                                            "addressCoordinate.latitude"
                                                        )}
                                                    </p>
                                                )}
                                                {getFieldError(
                                                    "addressCoordinate.longitude"
                                                ) && (
                                                    <p className="text-xs text-red-500">
                                                        {getFieldError(
                                                            "addressCoordinate.longitude"
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nid">
                                        NID (National Identity Number)
                                    </Label>
                                    <Input
                                        id="nid"
                                        value={formData.nid}
                                        disabled
                                        className="bg-muted/50 cursor-not-allowed"
                                        placeholder="National Identity Number"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        NID cannot be changed
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button
                                    onClick={handleSave}
                                    className="hover:scale-105 transition-transform"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="hover:scale-105 transition-transform bg-transparent"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // View Mode
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Full Name
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        {user?.fullName || "Not provided"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Blood Type
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        {user?.bloodType || "Not provided"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {user?.email || "Not provided"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {user?.phoneNumber || "Not provided"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Address
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {user?.addressText
                                            ? `${user.addressText.area ? user.addressText.area + ", " : ""}${user.addressText.district}, ${user.addressText.division}`
                                            : "Address not provided"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Location Coordinates
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {user?.addressCoordinate
                                            ? `${user.addressCoordinate.latitude}, ${user.addressCoordinate.longitude}`
                                            : "Coordinates not provided"}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        NID (National Identity Number)
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        {user?.nid || "Not provided"}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button
                                    onClick={handleEditClick}
                                    className="hover:scale-105 transition-transform"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
