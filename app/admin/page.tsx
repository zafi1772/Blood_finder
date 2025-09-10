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

const donationRequests = [
    {
        id: 1,
        requesterName: "Emily Rodriguez",
        requesterEmail: "emily.rodriguez@email.com",
        requesterPhone: "+1 (555) 345-6789",
        bloodType: "A+",
        amount: "450ml",
        urgency: "critical",
        status: "active",
        location: "Chicago, IL",
        hospital: "Chicago General Hospital",
        requestDate: "2024-02-28",
        neededBy: "2024-03-01",
        description:
            "Emergency surgery required due to accident. Patient has lost significant blood.",
        responses: 3,
        avatar: "ER",
    },
    {
        id: 2,
        requesterName: "David Wilson",
        requesterEmail: "david.wilson@email.com",
        requesterPhone: "+1 (555) 456-7890",
        bloodType: "B+",
        amount: "200ml",
        urgency: "high",
        status: "active",
        location: "Houston, TX",
        hospital: "Houston Medical Center",
        requestDate: "2024-02-27",
        neededBy: "2024-03-02",
        description:
            "Scheduled surgery for cancer treatment. Need blood for transfusion.",
        responses: 1,
        avatar: "DW",
    },
    {
        id: 3,
        requesterName: "Sarah Johnson",
        requesterEmail: "sarah.johnson@email.com",
        requesterPhone: "+1 (555) 123-4567",
        bloodType: "O-",
        amount: "300ml",
        urgency: "medium",
        status: "fulfilled",
        location: "New York, NY",
        hospital: "Mount Sinai Hospital",
        requestDate: "2024-02-25",
        neededBy: "2024-02-28",
        description: "Blood needed for elderly patient with chronic anemia.",
        responses: 5,
        avatar: "SJ",
    },
    {
        id: 4,
        requesterName: "Michael Chen",
        requesterEmail: "michael.chen@email.com",
        requesterPhone: "+1 (555) 234-5678",
        bloodType: "AB-",
        amount: "500ml",
        urgency: "critical",
        status: "expired",
        location: "Los Angeles, CA",
        hospital: "UCLA Medical Center",
        requestDate: "2024-02-20",
        neededBy: "2024-02-22",
        description: "Emergency blood transfusion needed for trauma patient.",
        responses: 0,
        avatar: "MC",
    },
    {
        id: 5,
        requesterName: "Lisa Thompson",
        requesterEmail: "lisa.thompson@email.com",
        requesterPhone: "+1 (555) 567-8901",
        bloodType: "O+",
        amount: "250ml",
        urgency: "low",
        status: "active",
        location: "Phoenix, AZ",
        hospital: "Phoenix Children's Hospital",
        requestDate: "2024-02-26",
        neededBy: "2024-03-05",
        description: "Routine blood transfusion for child with thalassemia.",
        responses: 2,
        avatar: "LT",
    },
];

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
                        <RequestsManagement
                            donationRequests={donationRequests}
                        />
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
