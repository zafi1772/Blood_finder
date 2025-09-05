"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { getFormattedDateTime, getStatusColor } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "../others/loader";

export default function HistoryTab() {
    const donationHistory = useQuery(
        api.donationRequestsToDonors.getUserDonationHistory
    );

    if (donationHistory === undefined) {
        return <Loader title="Loading donation history..." />;
    }

    return (
        <div className="space-y-6">
            {donationHistory && donationHistory.length > 0 ? (
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
                                                    donation.donationStatus
                                                )}
                                            >
                                                {donation.donationStatus}
                                            </Badge>
                                        </div>

                                        <div className="text-sm">
                                            <span className="font-medium">
                                                {getFormattedDateTime(
                                                    donation.donationDate
                                                )}
                                            </span>
                                        </div>

                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                {donation.addressText}
                                            </span>
                                        </div>

                                        <div className="text-sm">
                                            <span className="font-medium text-primary">
                                                {donation.amountNeeded}
                                            </span>
                                        </div>

                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                {donation.message}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No donations were made yet</p>
                </div>
            )}
        </div>
    );
}
