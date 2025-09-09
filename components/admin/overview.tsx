import { Users, Heart, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="metric-card admin-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Users
                    </CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        2,847
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-primary">+12%</span> from last
                        month
                    </p>
                </CardContent>
            </Card>

            <Card className="metric-card admin-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Donors
                    </CardTitle>
                    <Heart className="h-5 w-5 text-secondary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        1,234
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-secondary">+8%</span> from last
                        month
                    </p>
                </CardContent>
            </Card>

            <Card className="metric-card admin-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Blood Requests
                    </CardTitle>
                    <AlertTriangle className="h-5 w-5 text-chart-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">89</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-chart-4">23 urgent</span> requests
                        pending
                    </p>
                </CardContent>
            </Card>

            <Card className="metric-card admin-card border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Donations Today
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-chart-3" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">47</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-chart-3">+15%</span> above average
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
