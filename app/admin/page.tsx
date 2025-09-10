"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivity from "@/components/admin/recent-activity";
import UsersManagement from "@/components/admin/users-management";
import RequestsManagement from "@/components/admin/requests-management";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import SettingsTab from "@/components/admin/settings-tab";
import Overview from "@/components/admin/overview";
import {
    Users,
    Activity,
    AlertTriangle,
    BarChart3,
    Settings,
} from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div>
            <div className="container mx-auto px-6 py-8">
                {/* Dashboard Overview Cards */}
                <Overview />

                {/* Main Content Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-5 bg-card">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger
                            value="requests"
                            className="flex items-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Requests
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="flex items-center gap-2"
                        >
                            <Activity className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <RecentActivity />
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <UsersManagement />
                    </TabsContent>

                    {/* Requests Tab */}
                    <TabsContent value="requests">
                        <RequestsManagement />
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <AnalyticsDashboard />
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <SettingsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
