import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    Heart,
    Users,
} from "lucide-react";

export default function RecentActivity() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>
                            Latest system activities and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-chart-3/10 to-chart-3/5 border border-chart-3/20">
                            <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    New donor registered
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Sarah Johnson - O+ blood type
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                2 min ago
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-chart-4/10 to-chart-4/5 border border-chart-4/20">
                            <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    Urgent blood request
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    AB- needed at City Hospital
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                5 min ago
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    Donation completed
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Michael Chen donated 450ml
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                12 min ago
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-chart-2/10 to-chart-2/5 border border-chart-2/20">
                            <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    Request matched
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Donor found for emergency case
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                18 min ago
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-chart-4" />
                            System Alerts
                        </CardTitle>
                        <CardDescription>
                            Issues requiring immediate attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-chart-2/10 to-chart-2/5 border border-chart-2/20">
                            <AlertTriangle className="w-5 h-5 text-chart-2" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    Pending verifications
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    15 donor applications awaiting review
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="shrink-0 bg-transparent"
                            >
                                Review
                            </Button>
                        </div>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-chart-4/10 to-chart-4/5 border border-chart-4/20">
                            <AlertTriangle className="w-5 h-5 text-chart-4" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    High priority requests
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    3 urgent blood requests need attention
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="shrink-0"
                            >
                                Handle
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-chart-3" />
                            Quick Stats
                        </CardTitle>
                        <CardDescription>
                            Today&apos;s performance overview
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-chart-3/10 to-chart-3/5 border border-chart-3/20">
                            <div>
                                <p className="text-sm font-medium">
                                    New Registrations
                                </p>
                                <p className="text-2xl font-bold text-chart-3">
                                    12
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-chart-3" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                            <div>
                                <p className="text-sm font-medium">
                                    Donations Today
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    8
                                </p>
                            </div>
                            <Heart className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-chart-4/10 to-chart-4/5 border border-chart-4/20">
                            <div>
                                <p className="text-sm font-medium">
                                    Active Requests
                                </p>
                                <p className="text-2xl font-bold text-chart-4">
                                    23
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-chart-4" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
