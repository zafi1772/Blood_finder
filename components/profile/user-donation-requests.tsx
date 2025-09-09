"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

import { getUrgencyIcon } from "@/components/others/extras";
import { getFormattedDateTime, getStatusColor } from "@/lib/utils";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserDonationRequests() {
    const data = useQuery(api.donationRequests.getUserMadeDonationRequests);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Requests I Made ({data.requestsMade.length})
                </CardTitle>
                <CardDescription>
                    Blood requests you have submitted
                </CardDescription>
            </CardHeader>
            <CardContent>
                {data.requestsMade.length > 0 ? (
                    <div className="space-y-4">
                        {data.requestsMade.map((request) => (
                            <div
                                key={request._id}
                                className="p-4 border border-border rounded-lg glass"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {getUrgencyIcon(request.urgencyLevel)}
                                        <Badge className="bg-primary/10 text-primary border-primary/20">
                                            {request.bloodType}
                                        </Badge>
                                        <Badge className="bg-accent/10 text-accent border-accent/20">
                                            {request.amountNeeded}
                                        </Badge>
                                        <Badge
                                            className={getStatusColor(
                                                request.requestStatus
                                            )}
                                        >
                                            {request.requestStatus}
                                        </Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {getFormattedDateTime(
                                            request._creationTime,
                                            false
                                        )}
                                    </span>
                                </div>
                                <h4 className="font-semibold mb-2">
                                    {request.addressText}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {request.message}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Urgency: {request.urgencyLevel}
                                    </span>
                                    <span className="text-primary font-medium">
                                        {data.requestResponses[request._id]}{" "}
                                        responses
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No requests made yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
