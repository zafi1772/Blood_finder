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

interface DonationHistory {
    id: number;
    date: string;
    location: string;
    bloodType: string;
    amount: string;
    recipient: string;
    status: string;
    impact: string;
    certificateId: string;
    nextEligible: string;
}

interface HistoryTabProps {
    donationHistory: DonationHistory[];
}

export default function HistoryTab({ donationHistory }: HistoryTabProps) {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6">
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
                                            {formatDate(donation.date)}
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
        </div>
    );
}
