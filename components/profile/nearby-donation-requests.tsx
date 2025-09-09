"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, CheckCircle, XCircle } from "lucide-react";

import { getUrgencyIcon, showToast } from "@/components/others/extras";
import {
    getDistanceFromLonLatInKm,
    getFormattedDateTime,
    getStatusColor,
} from "@/lib/utils";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { getNearbyDonationRequests } from "@/lib/actions";

export default function NearbyDonationRequests() {
    const user = useQuery(api.users.getUserProfileData);
    const searchRadius = useQuery(api.configs.getDonorSearchRadiusInKm);
    const [nearbyRequestIds, setNearbyRequestIds] = useState<
        Id<"donationRequests">[]
    >([]);
    const nearbyRequestData = useQuery(
        api.donationRequests.getDonationRequestsByIds,
        { requestIds: nearbyRequestIds }
    );

    const [isLoading, setIsLoading] = useState(false);
    const createNewDonationRequestToDonor = useMutation(
        api.donationRequestsToDonors.createDonationRequestToDonor
    );

    async function handleAcceptRequest(
        requestId: Id<"donationRequests">,
        responseStatus: "Accepted" | "Declined"
    ) {
        setIsLoading(true);

        const res = await createNewDonationRequestToDonor({
            requestId,
            requestResponseStatus: responseStatus,
        });
        if (res) {
            showToast({ title: `Donation Request ${responseStatus}` });
        } else {
            showToast({
                title: "Failed to Respond to Donation Request",
                isWarning: true,
            });
        }

        setIsLoading(false);
    }

    useEffect(() => {
        const fetchNearbyRequests = async (
            longitude: number,
            latitude: number,
            radius: number
        ) => {
            const newNearbyRequests = await getNearbyDonationRequests(
                longitude,
                latitude,
                radius,
                "km"
            );
            if (newNearbyRequests.length > 0) {
                setNearbyRequestIds(newNearbyRequests);
            }
        };

        if (user && user.isDonating && user.addressCoordinate && searchRadius) {
            fetchNearbyRequests(
                user.addressCoordinate.longitude,
                user.addressCoordinate.latitude,
                searchRadius
            );
        }
    }, [user, searchRadius]);

    if (!nearbyRequestData || !user || !searchRadius) {
        return <div>Loading...</div>;
    }

    const { requests, userNames, requestResponseStatus } = nearbyRequestData;

    return (
        <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="text-accent flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Nearby Donation Requests ({requests.length})
                </CardTitle>
                <CardDescription>
                    Blood requests nearby {searchRadius} km to you
                </CardDescription>
            </CardHeader>
            <CardContent>
                {requests.length > 0 ? (
                    <div className="space-y-4">
                        {requests.map((request, idx) => (
                            <div
                                key={request._id}
                                className="p-4 border border-border rounded-lg glass"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {getUrgencyIcon(request.urgencyLevel)}
                                        <Badge className="bg-accent/10 text-accent border-accent/20">
                                            {request.bloodType}
                                        </Badge>
                                        <Badge className="bg-primary/10 text-primary border-primary/20">
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
                                <h4 className="font-semibold mb-1">
                                    {userNames[idx].fullName}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {request.addressText} -{" "}
                                    {user?.addressCoordinate
                                        ? getDistanceFromLonLatInKm(
                                              request.addressLongitude,
                                              request.addressLatitude,
                                              user.addressCoordinate.longitude,
                                              user.addressCoordinate.latitude
                                          ).toFixed(2) + " km away"
                                        : "Distance unknown"}
                                </p>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {request.message}
                                </p>
                                {request.requestStatus === "Active" &&
                                    (requestResponseStatus &&
                                    requestResponseStatus.some(
                                        (res) => res.requestId === request._id
                                    ) ? (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                variant="secondary"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                Chat
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAcceptRequest(
                                                        request._id,
                                                        "Accepted"
                                                    )
                                                }
                                                disabled={isLoading}
                                                className="flex-1"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleAcceptRequest(
                                                        request._id,
                                                        "Declined"
                                                    )
                                                }
                                                disabled={isLoading}
                                                className="flex-1 bg-transparent"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Decline
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No requests received yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
