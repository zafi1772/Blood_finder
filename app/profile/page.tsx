"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    History,
    MessageSquare,
    MapPin,
    Calendar,
    Heart,
    User,
    Edit,
} from "lucide-react";
import ProfileTab from "@/components/profile/profile-tab";
import RequestsTab from "@/components/profile/requests-tab";
import HistoryTab from "@/components/profile/history-tab";
import SettingsTab from "@/components/profile/settings-tab";
import Loader from "@/components/others/loader";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getFormattedDateTime } from "@/lib/utils";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const user = useQuery(api.users.getUserProfileData);

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

    if (user === null) {
        redirect("/");
    }

    if (user && !user.exists) {
        redirect("/onboard");
    }

    if (user === undefined) {
        return <Loader title="Loading Profile..." />;
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-8xl">
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
                                                {user?.fullName
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                {/* User Info Section */}
                                <div className="flex-1 text-center lg:text-left space-y-3">
                                    <h1 className="text-4xl font-bold">
                                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                            {user?.fullName || "Unnamed User"}
                                        </span>
                                    </h1>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">
                                                {user.addressText
                                                    ? user.addressText
                                                          .district +
                                                      ", " +
                                                      user.addressText.division
                                                    : "Location not set"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">
                                                Since{" "}
                                                {getFormattedDateTime(
                                                    user._creationTime
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:flex lg:flex-row lg:gap-8">
                                    {/* Donations Made */}
                                    <div className="group relative w-64 h-32 flex items-center justify-center">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                                        <div className="relative w-full h-full flex items-center justify-center p-4 bg-card/50 backdrop-blur-sm border border-primary/10 rounded-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                                            <div className="flex items-center gap-4 w-full h-full">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                                                    <Heart className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                        {user.totalDonations}
                                                    </div>
                                                    <div className="text-xs font-medium tracking-wider text-muted-foreground">
                                                        DONATIONS MADE
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Donations Received */}
                                    <div className="group relative w-64 h-32 flex items-center justify-center">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent/50 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                                        <div className="relative w-full h-full flex items-center justify-center p-4 bg-card/50 backdrop-blur-sm border border-accent/10 rounded-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                                            <div className="flex items-center gap-4 w-full h-full">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 group-hover:scale-110 transition-transform duration-300">
                                                    <MessageSquare className="h-6 w-6 text-accent" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                                                        {
                                                            user.totalDonationsReceived
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
                                    <div className="group relative w-64 h-32 flex items-center justify-center">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-foreground/60 to-foreground/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                        <div className="relative w-full h-full flex items-center justify-center p-4 bg-card/50 backdrop-blur-sm border border-foreground/10 rounded-xl transition-all duration-300 group-hover:translate-y-[-2px]">
                                            <div className="flex items-center gap-4 w-full h-full">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/10 group-hover:scale-110 transition-transform duration-300">
                                                    <History className="h-6 w-6 text-foreground/80" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <div className="text-2xl font-bold text-foreground/90">
                                                        {getFormattedDateTime(
                                                            user.lastDonated
                                                        )}
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
                        <ProfileTab user={user && user.exists ? user : null} />
                    </TabsContent>

                    {/* Requests Tab Content */}
                    <TabsContent value="requests" className="space-y-6">
                        <RequestsTab />
                    </TabsContent>

                    {/* History Tab Content */}
                    <TabsContent value="history" className="space-y-6">
                        <HistoryTab donationHistory={donationHistory} />
                    </TabsContent>

                    {/* Settings Tab Content - Placeholder */}
                    <TabsContent value="settings" className="space-y-6">
                        <SettingsTab
                            donationStatus={
                                user && user.exists && user.isDonating === true
                            }
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
