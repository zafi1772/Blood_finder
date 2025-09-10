"use client";

import { Users, Heart, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Overview() {
    const overviewData = useQuery(api.users.getAdminOverviewData);

    if (!overviewData) {
        return <div>Loading...</div>;
    }

    const {
        totalUsers,
        userSignupGrowth,
        activeDonors,
        totalDonationRequests,
        urgentRequests,
        totalDonationsMade,
        donationsToday,
        activeDonationRequests,
    } = overviewData;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="metric-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Users
                    </CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        {totalUsers}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-primary">
                            {userSignupGrowth.toFixed(2)}%
                        </span>{" "}
                        from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="metric-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Donors
                    </CardTitle>
                    <Heart className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        {activeDonors}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-chart-4">
                            {activeDonationRequests}
                        </span>{" "}
                        active requests
                    </p>
                </CardContent>
            </Card>

            <Card className="metric-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Blood Requests
                    </CardTitle>
                    <AlertTriangle className="h-5 w-5 text-chart-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        {totalDonationRequests}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-chart-4">{urgentRequests}</span>{" "}
                        urgent requests
                    </p>
                </CardContent>
            </Card>

            <Card className="metric-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Donations
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-chart-3" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        {totalDonationsMade}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-chart-3">{donationsToday}</span>{" "}
                        made today
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
