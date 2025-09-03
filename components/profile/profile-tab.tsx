"use client";

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
import { User, Edit, MapPin, Phone, Mail, Save, X } from "lucide-react";

interface ProfileTabProps {
    isEditing: boolean;
    userData: {
        name: string;
        email: string;
        phone: string;
        bloodType: string;
        location: string;
        nid: string;
    };
    formData: {
        name: string;
        email: string;
        phone: string;
        bloodType: string;
        location: string;
        nid: string;
    };
    bloodTypes: string[];
    handleInputChange: (field: string, value: string) => void;
    handleEditClick: () => void;
    handleSave: () => void;
    handleCancel: () => void;
}

export default function ProfileTab({
    isEditing,
    userData,
    formData,
    bloodTypes,
    handleInputChange,
    handleEditClick,
    handleSave,
    handleCancel,
}: ProfileTabProps) {
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
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
                                        <SelectTrigger className="w-full">
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
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "location",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your location"
                                    />
                                </div>
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
                                        {userData.name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Blood Type
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        {userData.bloodType}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        {userData.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {userData.phone}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Location
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {userData.location}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        NID (National Identity Number)
                                    </label>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        {userData.nid}
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
