import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Target,
    Clock,
    MapPin,
    BarChart3,
    PieChart,
    FileText,
    Download,
    Activity,
    Users,
    Calendar,
    Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsDashboard() {
    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="admin-card border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Monthly Growth
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    +24%
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="admin-card border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Success Rate
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    87%
                                </p>
                            </div>
                            <Target className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="admin-card border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Avg Response Time
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    2.4h
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="admin-card border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Regions
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    12
                                </p>
                            </div>
                            <MapPin className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donation Trends Chart */}
                <Card className="admin-card border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Donation Trends
                        </CardTitle>
                        <CardDescription>
                            Monthly donation statistics over the past year
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-primary/50" />
                                <p className="text-sm text-muted-foreground">
                                    Interactive chart showing donation trends
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Blood Type Distribution */}
                <Card className="admin-card border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Blood Type Distribution
                        </CardTitle>
                        <CardDescription>
                            Current distribution of blood types in inventory
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    type: "O+",
                                    percentage: 38,
                                    color: "bg-red-500",
                                },
                                {
                                    type: "A+",
                                    percentage: 34,
                                    color: "bg-blue-500",
                                },
                                {
                                    type: "B+",
                                    percentage: 9,
                                    color: "bg-green-500",
                                },
                                {
                                    type: "AB+",
                                    percentage: 3,
                                    color: "bg-purple-500",
                                },
                                {
                                    type: "O-",
                                    percentage: 7,
                                    color: "bg-orange-500",
                                },
                                {
                                    type: "A-",
                                    percentage: 6,
                                    color: "bg-cyan-500",
                                },
                                {
                                    type: "B-",
                                    percentage: 2,
                                    color: "bg-pink-500",
                                },
                                {
                                    type: "AB-",
                                    percentage: 1,
                                    color: "bg-yellow-500",
                                },
                            ].map((item) => (
                                <div
                                    key={item.type}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${item.color}`}
                                        />
                                        <span className="font-medium">
                                            {item.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-muted rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${item.color}`}
                                                style={{
                                                    width: `${item.percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium w-8">
                                            {item.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Geographic Distribution */}
            <Card className="admin-card border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Geographic Distribution
                    </CardTitle>
                    <CardDescription>
                        Donor and recipient distribution across regions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                region: "Dhaka Division",
                                donors: 1247,
                                recipients: 89,
                                growth: "+12%",
                            },
                            {
                                region: "Chittagong Division",
                                donors: 892,
                                recipients: 67,
                                growth: "+8%",
                            },
                            {
                                region: "Sylhet Division",
                                donors: 634,
                                recipients: 45,
                                growth: "+15%",
                            },
                            {
                                region: "Rajshahi Division",
                                donors: 567,
                                recipients: 34,
                                growth: "+6%",
                            },
                            {
                                region: "Khulna Division",
                                donors: 445,
                                recipients: 28,
                                growth: "+9%",
                            },
                            {
                                region: "Barisal Division",
                                donors: 323,
                                recipients: 19,
                                growth: "+11%",
                            },
                        ].map((region) => (
                            <div
                                key={region.region}
                                className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg"
                            >
                                <h4 className="font-semibold mb-2">
                                    {region.region}
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Donors:
                                        </span>
                                        <span className="font-medium">
                                            {region.donors.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Recipients:
                                        </span>
                                        <span className="font-medium">
                                            {region.recipients}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Growth:
                                        </span>
                                        <span className="font-medium text-green-600">
                                            {region.growth}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Reports Section */}
            <Card className="admin-card border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Generate Reports
                    </CardTitle>
                    <CardDescription>
                        Export detailed reports for analysis and compliance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                title: "Monthly Summary",
                                description: "Complete monthly donation report",
                                icon: Calendar,
                            },
                            {
                                title: "User Analytics",
                                description: "Detailed user behavior analysis",
                                icon: Users,
                            },
                            {
                                title: "Inventory Report",
                                description: "Current blood inventory status",
                                icon: Package,
                            },
                            {
                                title: "Performance Metrics",
                                description: "System performance indicators",
                                icon: Activity,
                            },
                        ].map((report) => (
                            <div
                                key={report.title}
                                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <report.icon className="w-5 h-5 text-primary" />
                                    <h4 className="font-semibold">
                                        {report.title}
                                    </h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {report.description}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full bg-transparent"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="admin-card border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent System Activity
                    </CardTitle>
                    <CardDescription>
                        Latest system events and notifications
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            {
                                time: "2 minutes ago",
                                event: "New blood request submitted",
                                type: "request",
                                severity: "high",
                            },
                            {
                                time: "15 minutes ago",
                                event: "Donor verification completed",
                                type: "verification",
                                severity: "medium",
                            },
                            {
                                time: "1 hour ago",
                                event: "Blood inventory updated",
                                type: "inventory",
                                severity: "low",
                            },
                            {
                                time: "2 hours ago",
                                event: "System backup completed",
                                type: "system",
                                severity: "low",
                            },
                            {
                                time: "3 hours ago",
                                event: "New user registration",
                                type: "user",
                                severity: "medium",
                            },
                        ].map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-3 bg-gradient-to-r from-muted/50 to-transparent rounded-lg"
                            >
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        activity.severity === "high"
                                            ? "bg-red-500"
                                            : activity.severity === "medium"
                                              ? "bg-yellow-500"
                                              : "bg-green-500"
                                    }`}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {activity.event}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.time}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        activity.severity === "high"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                >
                                    {activity.type}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
