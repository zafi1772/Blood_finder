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
import Link from "next/link";

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
    const updateDonationStatus = useMutation(
        api.donationRequestsToDonors.updateDonationStatus
    );

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

    async function handleDonationStatusUpdate(
        newStatus: "Fulfilled" | "Cancelled" | "Pending",
        donationRequestToDonorId?: Id<"donationRequestsToDonors">
    ) {
        setIsLoading(true);

        if (donationRequestToDonorId) {
            const res = await updateDonationStatus({
                donationRequestToDonorId,
                newStatus,
            });
            if (res) {
                showToast({ title: `Donation Status Updated to ${newStatus}` });
            } else {
                showToast({
                    title: "Failed to Update Donation Status",
                    isWarning: true,
                });
            }
        } else {
            showToast({
                title: "Failed to Update Donation Status",
                isWarning: true,
            });
        }

        setIsLoading(false);
    }

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
                                        <div className="flex max-sm:flex-col gap-2">
                                            <Link
                                                className="flex-1"
                                                href={`profile/conversation/${request._id}/${request.receiverId}`}
                                            >
                                                <div className="w-full inline-flex justify-center items-center h-8 rounded-md gap-1.5 px-3 text-sm border border-primary hover:bg-accent/10 text-primary transition-colors">
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    Chat
                                                </div>
                                            </Link>
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                onClick={() =>
                                                    handleDonationStatusUpdate(
                                                        "Cancelled",
                                                        requestResponseStatus.find(
                                                            (res) =>
                                                                res.requestId ===
                                                                request._id
                                                        )?._id
                                                    )
                                                }
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                onClick={() =>
                                                    handleDonationStatusUpdate(
                                                        "Fulfilled",
                                                        requestResponseStatus.find(
                                                            (res) =>
                                                                res.requestId ===
                                                                request._id
                                                        )?._id
                                                    )
                                                }
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Mark Fulfilled
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
