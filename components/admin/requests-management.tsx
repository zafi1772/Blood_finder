"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Filter,
    Eye,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageSquare,
    User,
    Heart,
    Activity,
    CheckCircle,
    Zap,
} from "lucide-react";
import {
    getRequestStatusBadge,
    getUrgencyBadge,
} from "@/components/others/extras";

import { getFormattedDateTime } from "@/lib/utils";

interface DonationRequest {
    id: number;
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    bloodType: string;
    amount: string;
    urgency: string;
    status: string;
    location: string;
    hospital: string;
    requestDate: string;
    neededBy: string;
    description: string;
    responses: number;
    avatar: string;
}

export default function RequestsManagement({
    donationRequests,
}: {
    donationRequests: DonationRequest[];
}) {
    const [requestSearchTerm, setRequestSearchTerm] = useState("");
    const [requestFilterStatus, setRequestFilterStatus] = useState("all");
    const [requestFilterUrgency, setRequestFilterUrgency] = useState("all");

    const filteredRequests = donationRequests.filter((request) => {
        const matchesSearch =
            request.requesterName
                .toLowerCase()
                .includes(requestSearchTerm.toLowerCase()) ||
            request.bloodType
                .toLowerCase()
                .includes(requestSearchTerm.toLowerCase()) ||
            request.hospital
                .toLowerCase()
                .includes(requestSearchTerm.toLowerCase());
        const matchesStatus =
            requestFilterStatus === "all" ||
            request.status === requestFilterStatus;
        const matchesUrgency =
            requestFilterUrgency === "all" ||
            request.urgency === requestFilterUrgency;
        return matchesSearch && matchesStatus && matchesUrgency;
    });

    return (
        <Card className="admin-card border-0 shadow-lg">
            <CardHeader>
                <CardTitle>Donation Requests</CardTitle>
                <CardDescription>
                    Monitor and manage blood donation requests
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search requests by name, blood type, or hospital..."
                            value={requestSearchTerm}
                            onChange={(e) =>
                                setRequestSearchTerm(e.target.value)
                            }
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={requestFilterStatus}
                        onValueChange={setRequestFilterStatus}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={requestFilterUrgency}
                        onValueChange={setRequestFilterUrgency}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
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
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Requester</TableHead>
                                <TableHead>Blood Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Urgency</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Hospital</TableHead>
                                <TableHead>Needed By</TableHead>
                                <TableHead>Responses</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-primary font-semibold text-sm">
                                                    {request.avatar}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {request.requesterName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {request.location}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-lg px-3 py-1"
                                        >
                                            {request.bloodType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold">
                                            {request.amount}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {getUrgencyBadge(request.urgency)}
                                    </TableCell>
                                    <TableCell>
                                        {getRequestStatusBadge(request.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            <MapPin className="w-3 h-3 mr-2 text-muted-foreground" />
                                            {request.hospital}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                                            {getFormattedDateTime(
                                                request.neededBy
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-semibold">
                                                {request.responses}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                                <span className="text-primary font-semibold">
                                                                    {
                                                                        request.avatar
                                                                    }
                                                                </span>
                                                            </div>
                                                            Blood Request
                                                            Details
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Complete information
                                                            about this blood
                                                            donation request
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-6 py-4">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Requester
                                                                    Information
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex items-center">
                                                                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            request.requesterName
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            request.requesterEmail
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            request.requesterPhone
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            request.location
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Medical
                                                                    Details
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Blood
                                                                            Type:
                                                                        </span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="font-mono"
                                                                        >
                                                                            {
                                                                                request.bloodType
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Amount
                                                                            Needed:
                                                                        </span>
                                                                        <span className="font-semibold">
                                                                            {
                                                                                request.amount
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Hospital:
                                                                        </span>
                                                                        <span className="text-sm">
                                                                            {
                                                                                request.hospital
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Urgency:
                                                                        </span>
                                                                        {getUrgencyBadge(
                                                                            request.urgency
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Request
                                                                    Timeline
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">
                                                                            Requested:
                                                                        </span>
                                                                        <span>
                                                                            {getFormattedDateTime(
                                                                                request.requestDate
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">
                                                                            Needed
                                                                            By:
                                                                        </span>
                                                                        <span className="font-semibold">
                                                                            {getFormattedDateTime(
                                                                                request.neededBy
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">
                                                                            Status:
                                                                        </span>
                                                                        {getRequestStatusBadge(
                                                                            request.status
                                                                        )}
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">
                                                                            Responses:
                                                                        </span>
                                                                        <span className="font-semibold">
                                                                            {
                                                                                request.responses
                                                                            }{" "}
                                                                            donors
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Description
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                                    {
                                                                        request.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Actions
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {request.status ===
                                                                        "active" && (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                className="w-full"
                                                                            >
                                                                                <Heart className="w-4 h-4 mr-2" />
                                                                                Find
                                                                                Matching
                                                                                Donors
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="w-full bg-transparent"
                                                                            >
                                                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                                                Contact
                                                                                Requester
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    {request.status ===
                                                                        "fulfilled" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="w-full bg-transparent"
                                                                            disabled
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Request
                                                                            Completed
                                                                        </Button>
                                                                    )}
                                                                    {request.status ===
                                                                        "expired" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="w-full bg-transparent"
                                                                        >
                                                                            <Activity className="w-4 h-4 mr-2" />
                                                                            Reactivate
                                                                            Request
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            {request.status === "active" &&
                                                request.urgency ===
                                                    "critical" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        <Zap className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            {request.status === "active" &&
                                                request.urgency !==
                                                    "critical" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90"
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                    </Button>
                                                )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>
                        Showing {filteredRequests.length} of{" "}
                        {donationRequests.length} requests
                    </span>
                    <div className="flex items-center space-x-4">
                        <span>
                            Active:{" "}
                            {
                                donationRequests.filter(
                                    (r) => r.status === "active"
                                ).length
                            }
                        </span>
                        <span>
                            Critical:{" "}
                            {
                                donationRequests.filter(
                                    (r) => r.urgency === "critical"
                                ).length
                            }
                        </span>
                        <span>
                            Fulfilled:{" "}
                            {
                                donationRequests.filter(
                                    (r) => r.status === "fulfilled"
                                ).length
                            }
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
