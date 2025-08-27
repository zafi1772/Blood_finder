"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    Heart,
    User,
    History,
    MessageSquare,
    ArrowLeft,
    Edit,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Save,
    X,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

    const [userData, setUserData] = useState({
        name: "Sarah Martinez",
        email: "sarah.martinez@email.com",
        phone: "+1 (555) 123-4567",
        bloodType: "O+",
        location: "San Francisco, CA",
        nid: "1234567890123", // National Identity Number
        joinDate: "March 2024",
        totalDonations: 12,
        totalDonationsReceived: 8,
        lastDonation: "January 10, 2024",
    });

    const [formData, setFormData] = useState(userData);

    const [donationHistory] = useState([
        {
            id: 1,
            date: "2024-01-10",
            location: "UCSF Medical Center",
            bloodType: "O+",
            amount: "450ml",
            recipient: "Emergency Surgery Patient",
            status: "Completed",
            impact: "Helped save 3 lives",
            certificateId: "CERT-2024-001",
            nextEligible: "2024-03-10",
        },
        {
            id: 2,
            date: "2023-12-15",
            location: "Stanford Blood Center",
            bloodType: "O+",
            amount: "450ml",
            recipient: "Cancer Treatment Patient",
            status: "Completed",
            impact: "Supported ongoing treatment",
            certificateId: "CERT-2023-012",
            nextEligible: "2024-02-15",
        },
        {
            id: 3,
            date: "2023-11-20",
            location: "SF General Hospital",
            bloodType: "O+",
            amount: "450ml",
            recipient: "Trauma Patient",
            status: "Completed",
            impact: "Critical emergency support",
            certificateId: "CERT-2023-011",
            nextEligible: "2024-01-20",
        },
        {
            id: 4,
            date: "2023-10-25",
            location: "Kaiser Permanente",
            bloodType: "O+",
            amount: "450ml",
            recipient: "Surgical Patient",
            status: "Completed",
            impact: "Enabled successful surgery",
            certificateId: "CERT-2023-010",
            nextEligible: "2023-12-25",
        },
        {
            id: 5,
            date: "2023-09-30",
            location: "UCSF Medical Center",
            bloodType: "O+",
            amount: "450ml",
            recipient: "Pediatric Patient",
            status: "Completed",
            impact: "Helped child recover",
            certificateId: "CERT-2023-009",
            nextEligible: "2023-11-30",
        },
    ]);

    const [requestsMade, setRequestsMade] = useState([
        {
            id: 1,
            bloodType: "O+",
            urgency: "High",
            location: "UCSF Medical Center",
            amount: "450ml",
            message:
                "Needed for emergency surgery. Patient is stable but requires immediate transfusion.",
            status: "Active",
            createdAt: "2024-01-15",
            responses: 3,
        },
        {
            id: 2,
            bloodType: "O+",
            urgency: "Medium",
            location: "Stanford Hospital",
            amount: "200ml",
            message:
                "Scheduled surgery next week. Looking for compatible donors in the area.",
            status: "Fulfilled",
            createdAt: "2024-01-10",
            responses: 5,
        },
    ]);

    const [requestsReceived, setRequestsReceived] = useState([
        {
            id: 3,
            requesterName: "Michael Chen",
            bloodType: "O+",
            urgency: "High",
            location: "SF General Hospital",
            amount: "300ml",
            message:
                "My daughter needs O+ blood for her surgery tomorrow. Please help if you can.",
            status: "Pending",
            createdAt: "2024-01-16",
            distance: "2.3 miles",
        },
        {
            id: 4,
            requesterName: "Lisa Rodriguez",
            bloodType: "O+",
            urgency: "Medium",
            location: "Kaiser Permanente",
            amount: "150ml",
            message:
                "Looking for O+ donors for a patient in need. Non-urgent but appreciated.",
            status: "Responded",
            createdAt: "2024-01-14",
            distance: "4.1 miles",
        },
    ]);

    const [newRequest, setNewRequest] = useState({
        bloodType: "",
        urgency: "",
        location: "",
        amount: "",
        message: "",
    });

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const urgencyLevels = ["Low", "Medium", "High", "Critical"];

    const handleEditClick = () => {
        setFormData(userData);
        setIsEditing(true);
    };

    const handleSave = () => {
        setUserData(formData);
        setIsEditing(false);
        console.log("[v0] Profile updated:", formData);
    };

    const handleCancel = () => {
        setFormData(userData);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNewRequestChange = (field: string, value: string) => {
        setNewRequest((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitRequest = () => {
        const request = {
            id: Date.now(),
            ...newRequest,
            status: "Active",
            createdAt: new Date().toISOString().split("T")[0],
            responses: 0,
        };
        setRequestsMade((prev) => [request, ...prev]);
        setNewRequest({
            bloodType: "",
            urgency: "",
            location: "",
            amount: "",
            message: "",
        });
        setIsNewRequestOpen(false);
        console.log("[v0] New request submitted:", request);
    };

    const handleRespondToRequest = (
        requestId: number,
        response: "accept" | "decline"
    ) => {
        setRequestsReceived((prev) =>
            prev.map((req) =>
                req.id === requestId
                    ? {
                          ...req,
                          status:
                              response === "accept" ? "Accepted" : "Declined",
                      }
                    : req
            )
        );
        console.log("[v0] Responded to request:", requestId, response);
    };

    const getStatusColor = (status: string) => {
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

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case "Critical":
            case "High":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case "Medium":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "Low":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b glass-card sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Heart className="h-8 w-8 text-primary fill-primary" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            BloodFinder
                        </span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Profile Header */}
                <div className="mb-8">
                    <Card className="glass-card border-0 shadow-lg overflow-hidden">
                        <CardContent className="p-8 relative">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
                                {/* Profile Image Section */}
                                <div className="flex-shrink-0">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                                        <Avatar className="h-32 w-32 ring-2 ring-background shadow-2xl relative transition-all duration-300 group-hover:scale-105">
                                            <AvatarImage
                                                src="/professional-profile.png"
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-primary to-accent text-white">
                                                {userData.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                {/* User Info Section */}
                                <div className="flex-1 text-center lg:text-left space-y-3">
                                    <h1 className="text-4xl font-bold">
                                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                            {userData.name}
                                        </span>
                                    </h1>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">
                                                {userData.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">
                                                Since {userData.joinDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:flex lg:flex-row lg:gap-8">
                                    {/* Donations Made */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                                        <div className="relative p-4 bg-card/50 backdrop-blur-sm border border-primary/10 rounded-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                                                    <Heart className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                        {
                                                            userData.totalDonations
                                                        }
                                                    </div>
                                                    <div className="text-xs font-medium tracking-wider text-muted-foreground">
                                                        DONATIONS MADE
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Donations Received */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                                        <div className="relative p-4 bg-card/50 backdrop-blur-sm border border-accent/10 rounded-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 group-hover:scale-110 transition-transform duration-300">
                                                    <MessageSquare className="h-6 w-6 text-accent" />
                                                </div>
                                                <div>
                                                    <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                                                        {
                                                            userData.totalDonationsReceived
                                                        }
                                                    </div>
                                                    <div className="text-xs font-medium tracking-wider text-muted-foreground">
                                                        DONATIONS RECEIVED
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Last Donation */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-foreground/60 to-foreground/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                        <div className="relative p-4 bg-card/50 backdrop-blur-sm border border-foreground/10 rounded-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/10 group-hover:scale-110 transition-transform duration-300">
                                                    <History className="h-6 w-6 text-foreground/80" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-foreground/90">
                                                        {userData.lastDonation}
                                                    </div>
                                                    <div className="text-xs font-medium tracking-wider text-muted-foreground">
                                                        LAST DONATION
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-4 glass-card border-0 p-2">
                        <TabsTrigger
                            value="profile"
                            className="flex items-center gap-2"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="requests"
                            className="flex items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">Requests</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2"
                        >
                            <History className="h-4 w-4" />
                            <span className="hidden sm:inline">History</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab Content */}
                    <TabsContent value="profile" className="space-y-6">
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
                                                <Label htmlFor="name">
                                                    Full Name
                                                </Label>
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
                                                        {bloodTypes.map(
                                                            (type) => (
                                                                <SelectItem
                                                                    key={type}
                                                                    value={type}
                                                                >
                                                                    {type}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
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
                                                <Label htmlFor="phone">
                                                    Phone
                                                </Label>
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
                                                <Label htmlFor="location">
                                                    Location
                                                </Label>
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
                                                    NID (National Identity
                                                    Number)
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
                                                    NID (National Identity
                                                    Number)
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
                    </TabsContent>

                    {/* Requests Tab Content */}
                    <TabsContent value="requests" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-foreground">
                                Blood Donation Requests
                            </h2>
                            <Dialog
                                open={isNewRequestOpen}
                                onOpenChange={setIsNewRequestOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="hover:scale-105 transition-transform">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Request
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create Blood Request
                                        </DialogTitle>
                                        <DialogDescription>
                                            Submit a new blood donation request
                                            to find compatible donors in your
                                            area.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="request-blood-type">
                                                Blood Type Needed
                                            </Label>
                                            <Select
                                                value={newRequest.bloodType}
                                                onValueChange={(value) =>
                                                    handleNewRequestChange(
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
                                            <Label htmlFor="request-amount">
                                                Amount Needed
                                            </Label>
                                            <Input
                                                id="request-amount"
                                                value={newRequest.amount}
                                                onChange={(e) =>
                                                    handleNewRequestChange(
                                                        "amount",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., 200ml, 450ml"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="request-urgency">
                                                Urgency Level
                                            </Label>
                                            <Select
                                                value={newRequest.urgency}
                                                onValueChange={(value) =>
                                                    handleNewRequestChange(
                                                        "urgency",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select urgency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {urgencyLevels.map(
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
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="request-location">
                                                Hospital/Location
                                            </Label>
                                            <Input
                                                id="request-location"
                                                value={newRequest.location}
                                                onChange={(e) =>
                                                    handleNewRequestChange(
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter hospital or location"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="request-message">
                                                Message
                                            </Label>
                                            <Textarea
                                                id="request-message"
                                                value={newRequest.message}
                                                onChange={(e) =>
                                                    handleNewRequestChange(
                                                        "message",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Provide details about the blood need..."
                                                rows={3}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSubmitRequest}
                                            className="w-full"
                                            disabled={
                                                !newRequest.bloodType ||
                                                !newRequest.urgency ||
                                                !newRequest.location ||
                                                !newRequest.amount
                                            }
                                        >
                                            Submit Request
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Requests I Made */}
                            <Card className="glass-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-primary flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Requests I Made ({requestsMade.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Blood requests you have submitted
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {requestsMade.length > 0 ? (
                                        <div className="space-y-4">
                                            {requestsMade.map((request) => (
                                                <div
                                                    key={request.id}
                                                    className="p-4 border border-border rounded-lg glass"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            {getUrgencyIcon(
                                                                request.urgency
                                                            )}
                                                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                                                {
                                                                    request.bloodType
                                                                }
                                                            </Badge>
                                                            <Badge className="bg-accent/10 text-accent border-accent/20">
                                                                {request.amount}
                                                            </Badge>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    request.status
                                                                )}
                                                            >
                                                                {request.status}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {request.createdAt}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-semibold mb-2">
                                                        {request.location}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {request.message}
                                                    </p>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Urgency:{" "}
                                                            {request.urgency}
                                                        </span>
                                                        <span className="text-primary font-medium">
                                                            {request.responses}{" "}
                                                            responses
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No requests made yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Requests I Received */}
                            <Card className="glass-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-accent flex items-center gap-2">
                                        <Heart className="h-5 w-5" />
                                        Requests I Received (
                                        {requestsReceived.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Blood requests sent to you
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {requestsReceived.length > 0 ? (
                                        <div className="space-y-4">
                                            {requestsReceived.map((request) => (
                                                <div
                                                    key={request.id}
                                                    className="p-4 border border-border rounded-lg glass"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            {getUrgencyIcon(
                                                                request.urgency
                                                            )}
                                                            <Badge className="bg-accent/10 text-accent border-accent/20">
                                                                {
                                                                    request.bloodType
                                                                }
                                                            </Badge>
                                                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                                                {request.amount}
                                                            </Badge>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    request.status
                                                                )}
                                                            >
                                                                {request.status}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {request.createdAt}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-semibold mb-1">
                                                        {request.requesterName}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {request.location} •{" "}
                                                        {request.distance}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {request.message}
                                                    </p>
                                                    {request.status ===
                                                        "Pending" && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleRespondToRequest(
                                                                        request.id,
                                                                        "accept"
                                                                    )
                                                                }
                                                                className="flex-1"
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleRespondToRequest(
                                                                        request.id,
                                                                        "decline"
                                                                    )
                                                                }
                                                                className="flex-1 bg-transparent"
                                                            >
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                Decline
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No requests received yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* History Tab Content */}
                    <TabsContent value="history" className="space-y-6">
                        <Card className="glass-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" />
                                    Donation History
                                </CardTitle>
                                <CardDescription>
                                    Your blood donation history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {donationHistory.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="p-4 border border-border rounded-lg glass hover:shadow-md transition-shadow"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                                        {donation.bloodType}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={getStatusColor(
                                                            donation.status
                                                        )}
                                                    >
                                                        {donation.status}
                                                    </Badge>
                                                </div>

                                                <div className="text-sm">
                                                    <span className="font-medium">
                                                        {formatDate(
                                                            donation.date
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">
                                                        {donation.location}
                                                    </span>
                                                </div>

                                                <div className="text-sm">
                                                    <span className="font-medium text-primary">
                                                        {donation.amount}
                                                    </span>
                                                </div>

                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">
                                                        {donation.recipient}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab Content - Placeholder */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card className="glass-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="h-5 w-5 text-primary" />
                                    Account Settings
                                </CardTitle>
                                <CardDescription>
                                    Manage your account preferences and settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-muted-foreground">
                                    <Edit className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg mb-2">
                                        Settings coming soon
                                    </p>
                                    <p className="text-sm">
                                        Profile customization options will be
                                        available here
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
