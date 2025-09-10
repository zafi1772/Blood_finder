"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, Droplets } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./user-management-columns";

export default function UsersManagement() {
    const users = useQuery(api.users.getAllUsers);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [filterBloodType, setFilterBloodType] = useState("all");

    if (users === undefined) {
        return (
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Loading users...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-pulse">
                                Loading users...
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!users || users.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>No users found</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center text-muted-foreground">
                            No users available to display.
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const filteredUsers = users.filter((user) => {
        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && user.accountStatus) ||
            (filterStatus === "suspended" && !user.accountStatus);
        const matchesType =
            filterType === "all" ||
            (filterType === "receiver" && !user.isDonating) ||
            (filterType === "donor" && user.isDonating) ||
            (filterType === "admin" && user.isAdmin);
        const matchesBloodType =
            filterBloodType === "all" || user.bloodType === filterBloodType;
        return matchesStatus && matchesType && matchesBloodType;
    });

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                    Manage donors, recipients, and system users
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="receiver">Receiver</SelectItem>
                            <SelectItem value="donor">Donor</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filterBloodType}
                        onValueChange={setFilterBloodType}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Droplets className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by blood type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Blood Types</SelectItem>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    searchKey="fullName"
                    searchPlaceholder="Search users by name..."
                />

                {/* Results Summary */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Showing {filteredUsers.length} of {users.length}{" "}
                            users
                        </span>
                        <div className="flex items-center space-x-4">
                            <span>
                                Active:{" "}
                                {users.filter((u) => u.accountStatus).length}
                            </span>
                            <span>
                                Suspended:{" "}
                                {users.filter((u) => !u.accountStatus).length}
                            </span>
                            <span>
                                Admins: {users.filter((u) => u.isAdmin).length}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
