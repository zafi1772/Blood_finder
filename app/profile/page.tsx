"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, MessageSquare, User, Edit } from "lucide-react";
import ProfileTab from "@/components/profile/profile-tab";
import RequestsTab from "@/components/profile/requests-tab";
import HistoryTab from "@/components/profile/history-tab";
import SettingsTab from "@/components/profile/settings-tab";
import Loader from "@/components/others/loader";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/profile/profile-header";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const user = useQuery(api.users.getUserProfileData);

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
                <ProfileHeader user={user} />

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
                        <HistoryTab />
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
