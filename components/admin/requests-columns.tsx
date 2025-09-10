"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MapPin,
    Calendar,
    Heart,
    Activity,
    Zap,
    MoreHorizontal,
    ArrowUpDown,
    Droplets,
} from "lucide-react";
import { getFormattedDateTime } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import {
    getStatusColorVariant,
    getUrgencyColorVariant,
} from "@/components/others/extras";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export type DonationRequest = {
    _id: Id<"donationRequests">;
    _creationTime: number;
    receiverId: string;
    bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    amountNeeded: string;
    urgencyLevel: "Low" | "Medium" | "High" | "Critical";
    addressText: string;
    addressLatitude: number;
    addressLongitude: number;
    requestStatus: "Active" | "Cancelled" | "Fulfilled";
    message: string;
    userName: string;
    email: string;
    phoneNumber: string;
    totalResponses: number;
};

export const columns: ColumnDef<DonationRequest>[] = [
    {
        accessorKey: "userName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Requester
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const request = row.original;
            return (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                            {request.userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium">{request.userName}</p>
                        <p className="text-sm text-muted-foreground">
                            {request.email}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "bloodType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Droplets className="mr-2 h-4 w-4" />
                    Blood Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="font-mono">
                    {row.getValue("bloodType")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amountNeeded",
        header: "Amount",
        cell: ({ row }) => {
            const amount = row.getValue("amountNeeded") as string;
            return <div className="font-medium">{amount}</div>;
        },
    },
    {
        accessorKey: "urgencyLevel",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Zap className="mr-2 h-4 w-4" />
                    Urgency
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const urgency = row.getValue("urgencyLevel") as string;
            return (
                <Badge variant={getUrgencyColorVariant(urgency)}>
                    {urgency}
                </Badge>
            );
        },
    },
    {
        accessorKey: "requestStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Activity className="mr-2 h-4 w-4" />
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue("requestStatus") as string;
            return (
                <Badge variant={getStatusColorVariant(status)}>{status}</Badge>
            );
        },
    },
    {
        accessorKey: "addressText",
        header: "Location",
        cell: ({ row }) => {
            const location = row.getValue("addressText") as string;
            return (
                <div className="flex items-center text-sm max-w-[200px] truncate">
                    <MapPin className="w-3 h-3 mr-2 text-muted-foreground flex-shrink-0" />
                    <span title={location}>{location}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "_creationTime",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    Requested
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const creationTime = row.getValue("_creationTime") as number;
            return (
                <div className="text-sm">
                    {getFormattedDateTime(creationTime, false)}
                </div>
            );
        },
    },
    {
        accessorKey: "totalResponses",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <Heart className="mr-2 h-4 w-4" />
                    Responses
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const responses = row.getValue("totalResponses") as number;
            return (
                <div className="flex items-center">
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        <Heart className="w-3 h-3" />
                        {responses}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <Actions request={row.original} />,
    },
];

const Actions = ({ request }: { request: DonationRequest }) => {
    const updateRequestStatus = useMutation(
        api.donationRequests.updateDonationRequestStatus
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(request._id)}
                >
                    Copy request ID
                </DropdownMenuItem>
                {request.requestStatus === "Active" && (
                    <DropdownMenuItem
                        onClick={() =>
                            updateRequestStatus({
                                requestId: request._id,
                                newStatus: "Fulfilled",
                            })
                        }
                    >
                        Mark as fulfilled
                    </DropdownMenuItem>
                )}
                {request.requestStatus === "Fulfilled" && (
                    <DropdownMenuItem
                        onClick={() =>
                            updateRequestStatus({
                                requestId: request._id,
                                newStatus: "Active",
                            })
                        }
                    >
                        Mark as active
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={() =>
                        updateRequestStatus({
                            requestId: request._id,
                            newStatus: "Cancelled",
                        })
                    }
                >
                    Mark as cancelled
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
