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
    UserX,
    CheckCircle,
    Mail,
    Phone,
    MapPin,
    Calendar,
} from "lucide-react";
import { getStatusBadge, getTypeBadge } from "@/components/others/extras";

import { getFormattedDateTime } from "@/lib/utils";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    bloodType: string;
    type: string;
    status: string;
    location: string;
    joinDate: string;
    lastDonation: string | null;
    totalDonations: number;
    avatar: string;
}

export default function UsersManagement({ users }: { users: User[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            filterStatus === "all" || user.status === filterStatus;
        const matchesType = filterType === "all" || user.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    return (
        <Card className="admin-card border-0 shadow-lg">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                    Manage donors, recipients, and system users
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search users by name, email, or blood type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
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
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
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
                            <SelectItem value="donor">Donors</SelectItem>
                            <SelectItem value="recipient">
                                Recipients
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Blood Type</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-primary font-semibold text-sm">
                                                    {user.avatar}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm">
                                                <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="font-mono"
                                        >
                                            {user.bloodType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getTypeBadge(user.type)}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(user.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            <MapPin className="w-3 h-3 mr-2 text-muted-foreground" />
                                            {user.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                                            {getFormattedDateTime(
                                                user.joinDate
                                            )}
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
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                                <span className="text-primary font-semibold">
                                                                    {
                                                                        user.avatar
                                                                    }
                                                                </span>
                                                            </div>
                                                            {user.name}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Detailed user
                                                            information and
                                                            management options
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-6 py-4">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Contact
                                                                    Information
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex items-center">
                                                                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            user.phone
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        {
                                                                            user.location
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Account
                                                                    Details
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Status:
                                                                        </span>
                                                                        {getStatusBadge(
                                                                            user.status
                                                                        )}
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Type:
                                                                        </span>
                                                                        {getTypeBadge(
                                                                            user.type
                                                                        )}
                                                                    </div>
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
                                                                                user.bloodType
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Activity
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">
                                                                            Joined:
                                                                        </span>
                                                                        <span>
                                                                            {getFormattedDateTime(
                                                                                user.joinDate
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {user.type ===
                                                                        "donor" && (
                                                                        <>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">
                                                                                    Total
                                                                                    Donations:
                                                                                </span>
                                                                                <span className="font-semibold">
                                                                                    {
                                                                                        user.totalDonations
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-muted-foreground">
                                                                                    Last
                                                                                    Donation:
                                                                                </span>
                                                                                <span>
                                                                                    {user.lastDonation
                                                                                        ? getFormattedDateTime(
                                                                                              user.lastDonation
                                                                                          )
                                                                                        : "Never"}
                                                                                </span>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Actions
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {user.status ===
                                                                        "pending" && (
                                                                        <Button
                                                                            size="sm"
                                                                            className="w-full"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Approve
                                                                            User
                                                                        </Button>
                                                                    )}
                                                                    {user.status ===
                                                                        "verified" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="w-full bg-transparent"
                                                                        >
                                                                            <UserX className="w-4 h-4 mr-2" />
                                                                            Suspend
                                                                            User
                                                                        </Button>
                                                                    )}
                                                                    {user.status ===
                                                                        "suspended" && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="w-full bg-transparent"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Reactivate
                                                                            User
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            {user.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-chart-3 hover:bg-chart-3/90"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {user.status === "verified" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive hover:text-destructive bg-transparent"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>
                        Showing {filteredUsers.length} of {users.length} users
                    </span>
                    <div className="flex items-center space-x-4">
                        <span>
                            Verified:{" "}
                            {
                                users.filter((u) => u.status === "verified")
                                    .length
                            }
                        </span>
                        <span>
                            Pending:{" "}
                            {users.filter((u) => u.status === "pending").length}
                        </span>
                        <span>
                            Suspended:{" "}
                            {
                                users.filter((u) => u.status === "suspended")
                                    .length
                            }
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
