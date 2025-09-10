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
import { Droplets, Zap, Activity } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DataTable } from "@/components/ui/data-table";
import { columns, type DonationRequest } from "./requests-columns";

export default function RequestsManagement() {
    const donationRequests = useQuery(
        api.donationRequests.getAllDonationRequests
    ) as DonationRequest[] | undefined;
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterUrgency, setFilterUrgency] = useState("all");
    const [filterBloodType, setFilterBloodType] = useState("all");

    // Show loading state while data is being fetched
    if (donationRequests === undefined) {
        return (
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Donation Requests</CardTitle>
                    <CardDescription>
                        Loading donation requests...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-pulse">
                                Loading donation requests...
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Handle empty requests array
    if (!donationRequests || donationRequests.length === 0) {
        return (
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Donation Requests</CardTitle>
                    <CardDescription>
                        No donation requests found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center text-muted-foreground">
                            No donation requests available to display.
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Filter requests based on status, urgency, and blood type
    const filteredRequests = donationRequests.filter((request) => {
        const matchesStatus =
            filterStatus === "all" ||
            request.requestStatus.toLowerCase() === filterStatus.toLowerCase();
        const matchesUrgency =
            filterUrgency === "all" ||
            request.urgencyLevel.toLowerCase() === filterUrgency.toLowerCase();
        const matchesBloodType =
            filterBloodType === "all" || request.bloodType === filterBloodType;
        return matchesStatus && matchesUrgency && matchesBloodType;
    });

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle>Donation Requests</CardTitle>
                <CardDescription>
                    Monitor and manage blood donation requests
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
                            <Activity className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filterUrgency}
                        onValueChange={setFilterUrgency}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Zap className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by urgency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Urgency</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
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
                    data={filteredRequests}
                    searchKey="requesterName"
                    searchPlaceholder="Search by requester name..."
                />

                {/* Results Summary */}
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Showing {filteredRequests.length} of{" "}
                            {donationRequests.length} requests
                        </span>
                        <div className="flex items-center space-x-4">
                            <span>
                                Active:{" "}
                                {
                                    donationRequests.filter(
                                        (r) => r.requestStatus === "Active"
                                    ).length
                                }
                            </span>
                            <span>
                                Fulfilled:{" "}
                                {
                                    donationRequests.filter(
                                        (r) => r.requestStatus === "Fulfilled"
                                    ).length
                                }
                            </span>
                            <span>
                                Critical:{" "}
                                {
                                    donationRequests.filter(
                                        (r) => r.urgencyLevel === "Critical"
                                    ).length
                                }
                            </span>
                        </div>
                    </div>

                    {/* Urgency Level Distribution */}
                    {filterUrgency === "all" && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {["Critical", "High", "Medium", "Low"].map(
                                (urgency) => {
                                    const count = donationRequests.filter(
                                        (r) => r.urgencyLevel === urgency
                                    ).length;
                                    const colorClass = {
                                        Critical:
                                            "bg-red-100 text-red-800 border-red-200",
                                        High: "bg-orange-100 text-orange-800 border-orange-200",
                                        Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
                                        Low: "bg-green-100 text-green-800 border-green-200",
                                    }[urgency];
                                    return (
                                        <div
                                            key={urgency}
                                            className={`text-center p-3 rounded border ${colorClass}`}
                                        >
                                            <div className="font-semibold">
                                                {urgency}
                                            </div>
                                            <div className="text-lg font-bold">
                                                {count}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}

                    {/* Blood Type Distribution */}
                    {filterBloodType === "all" && (
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-xs">
                            {[
                                "A+",
                                "A-",
                                "B+",
                                "B-",
                                "AB+",
                                "AB-",
                                "O+",
                                "O-",
                            ].map((type) => {
                                const count = donationRequests.filter(
                                    (r) => r.bloodType === type
                                ).length;
                                return (
                                    <div
                                        key={type}
                                        className="text-center p-2 bg-muted/50 rounded"
                                    >
                                        <div className="font-mono font-semibold text-primary">
                                            {type}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
