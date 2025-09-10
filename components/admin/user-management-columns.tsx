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
    Mail,
    Phone,
    MapPin,
    Calendar,
    MoreHorizontal,
    ArrowUpDown,
} from "lucide-react";

import { getFormattedDateTime } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const columns: ColumnDef<Doc<"users">>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    User
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                            {user.fullName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="space-y-1">
                    <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                        {user.email}
                    </div>
                    <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                        +880{user.phoneNumber}
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
        accessorKey: "isDonating",
        header: "Type",
        cell: ({ row }) => {
            const isDonating = row.getValue("isDonating") as boolean;

            return (
                <div className="space-x-1">
                    <Badge variant="secondary">Receiver</Badge>
                    {isDonating && <Badge variant="secondary">Donor</Badge>}
                </div>
            );
        },
    },
    {
        accessorKey: "accountStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const accountStatus = row.getValue("accountStatus") as boolean;
            return (
                <Badge variant={accountStatus ? "default" : "destructive"}>
                    {accountStatus ? "Active" : "Suspended"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "addressText",
        header: "Location",
        cell: ({ row }) => {
            const addressText = row.getValue("addressText") as {
                division: string;
                district: string;
            };
            return (
                <div className="flex items-center text-sm">
                    <MapPin className="w-3 h-3 mr-2 text-muted-foreground" />
                    {addressText.district}, {addressText.division}
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
                    Joined
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const creationTime = row.getValue("_creationTime") as number;
            return (
                <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                    {getFormattedDateTime(creationTime)}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <Actions user={row.original} />,
    },
];

const Actions = ({ user }: { user: Doc<"users"> }) => {
    const updateUserAdminStatus = useMutation(api.users.updateUserAdminStatus);
    const updateUserAccountStatus = useMutation(
        api.users.updateUserAccountStatus
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
                    onClick={() => navigator.clipboard.writeText(user._id)}
                >
                    Copy user ID
                </DropdownMenuItem>
                {!user.accountStatus && (
                    <DropdownMenuItem
                        onClick={() =>
                            updateUserAccountStatus({
                                userId: user._id,
                                suspend: false,
                            })
                        }
                    >
                        Reactivate user
                    </DropdownMenuItem>
                )}
                {user.accountStatus && (
                    <DropdownMenuItem
                        onClick={() =>
                            updateUserAccountStatus({
                                userId: user._id,
                                suspend: true,
                            })
                        }
                    >
                        Suspend user
                    </DropdownMenuItem>
                )}
                {user.accountStatus && !user.isAdmin && (
                    <DropdownMenuItem
                        onClick={() =>
                            updateUserAdminStatus({
                                userId: user._id,
                                makeAdmin: true,
                            })
                        }
                    >
                        Make admin
                    </DropdownMenuItem>
                )}
                {user.accountStatus && user.isAdmin && (
                    <DropdownMenuItem
                        onClick={() =>
                            updateUserAdminStatus({
                                userId: user._id,
                                makeAdmin: false,
                            })
                        }
                    >
                        Remove admin
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
