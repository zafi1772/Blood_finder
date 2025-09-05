"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
    Users,
    Heart,
    Activity,
    AlertTriangle,
    TrendingUp,
    BarChart3,
    Clock,
    Search,
    Filter,
    Eye,
    UserX,
    CheckCircle,
    XCircle,
    MapPin,
    Calendar,
    Phone,
    Mail,
    Zap,
    User,
    MessageSquare,
    PieChart,
    FileText,
    Package,
    Download,
    Target,
} from "lucide-react";
import { getFormattedDateTime } from "@/lib/utils";

const users = [
    {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        bloodType: "O+",
        type: "donor",
        status: "verified",
        location: "New York, NY",
        joinDate: "2024-01-15",
        lastDonation: "2024-02-20",
        totalDonations: 5,
        avatar: "SJ",
    },
    {
        id: 2,
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "+1 (555) 234-5678",
        bloodType: "AB-",
        type: "donor",
        status: "pending",
        location: "Los Angeles, CA",
        joinDate: "2024-02-10",
        lastDonation: null,
        totalDonations: 0,
        avatar: "MC",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        email: "emily.rodriguez@email.com",
        phone: "+1 (555) 345-6789",
        bloodType: "A+",
        type: "recipient",
        status: "verified",
        location: "Chicago, IL",
        joinDate: "2024-01-20",
        lastDonation: null,
        totalDonations: 0,
        avatar: "ER",
    },
    {
        id: 4,
        name: "David Wilson",
        email: "david.wilson@email.com",
        phone: "+1 (555) 456-7890",
        bloodType: "B+",
        type: "donor",
        status: "suspended",
        location: "Houston, TX",
        joinDate: "2023-12-05",
        lastDonation: "2024-01-10",
        totalDonations: 3,
        avatar: "DW",
    },
    {
        id: 5,
        name: "Lisa Thompson",
        email: "lisa.thompson@email.com",
        phone: "+1 (555) 567-8901",
        bloodType: "O-",
        type: "donor",
        status: "verified",
        location: "Phoenix, AZ",
        joinDate: "2024-02-01",
        lastDonation: "2024-02-25",
        totalDonations: 2,
        avatar: "LT",
    },
];

const donationRequests = [
    {
        id: 1,
        requesterName: "Emily Rodriguez",
        requesterEmail: "emily.rodriguez@email.com",
        requesterPhone: "+1 (555) 345-6789",
        bloodType: "A+",
        amount: "450ml",
        urgency: "critical",
        status: "active",
        location: "Chicago, IL",
        hospital: "Chicago General Hospital",
        requestDate: "2024-02-28",
        neededBy: "2024-03-01",
        description:
            "Emergency surgery required due to accident. Patient has lost significant blood.",
        responses: 3,
        avatar: "ER",
    },
    {
        id: 2,
        requesterName: "David Wilson",
        requesterEmail: "david.wilson@email.com",
        requesterPhone: "+1 (555) 456-7890",
        bloodType: "B+",
        amount: "200ml",
        urgency: "high",
        status: "active",
        location: "Houston, TX",
        hospital: "Houston Medical Center",
        requestDate: "2024-02-27",
        neededBy: "2024-03-02",
        description:
            "Scheduled surgery for cancer treatment. Need blood for transfusion.",
        responses: 1,
        avatar: "DW",
    },
    {
        id: 3,
        requesterName: "Sarah Johnson",
        requesterEmail: "sarah.johnson@email.com",
        requesterPhone: "+1 (555) 123-4567",
        bloodType: "O-",
        amount: "300ml",
        urgency: "medium",
        status: "fulfilled",
        location: "New York, NY",
        hospital: "Mount Sinai Hospital",
        requestDate: "2024-02-25",
        neededBy: "2024-02-28",
        description: "Blood needed for elderly patient with chronic anemia.",
        responses: 5,
        avatar: "SJ",
    },
    {
        id: 4,
        requesterName: "Michael Chen",
        requesterEmail: "michael.chen@email.com",
        requesterPhone: "+1 (555) 234-5678",
        bloodType: "AB-",
        amount: "500ml",
        urgency: "critical",
        status: "expired",
        location: "Los Angeles, CA",
        hospital: "UCLA Medical Center",
        requestDate: "2024-02-20",
        neededBy: "2024-02-22",
        description: "Emergency blood transfusion needed for trauma patient.",
        responses: 0,
        avatar: "MC",
    },
    {
        id: 5,
        requesterName: "Lisa Thompson",
        requesterEmail: "lisa.thompson@email.com",
        requesterPhone: "+1 (555) 567-8901",
        bloodType: "O+",
        amount: "250ml",
        urgency: "low",
        status: "active",
        location: "Phoenix, AZ",
        hospital: "Phoenix Children's Hospital",
        requestDate: "2024-02-26",
        neededBy: "2024-03-05",
        description: "Routine blood transfusion for child with thalassemia.",
        responses: 2,
        avatar: "LT",
    },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [requestSearchTerm, setRequestSearchTerm] = useState("");
    const [requestFilterStatus, setRequestFilterStatus] = useState("all");
    const [requestFilterUrgency, setRequestFilterUrgency] = useState("all");

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return (
                    <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            case "suspended":
                return (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        <XCircle className="w-3 h-3 mr-1" />
                        Suspended
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        return type === "donor" ? (
            <Badge className="bg-primary/10 text-primary border-primary/20">
                <Heart className="w-3 h-3 mr-1" />
                Donor
            </Badge>
        ) : (
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                <Users className="w-3 h-3 mr-1" />
                Recipient
            </Badge>
        );
    };

    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case "critical":
                return (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        <Zap className="w-3 h-3 mr-1" />
                        Critical
                    </Badge>
                );
            case "high":
                return (
                    <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High
                    </Badge>
                );
            case "medium":
                return (
                    <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Medium
                    </Badge>
                );
            case "low":
                return (
                    <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Low
                    </Badge>
                );
            default:
                return <Badge variant="outline">{urgency}</Badge>;
        }
    };

    const getRequestStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Activity className="w-3 h-3 mr-1" />
                        Active
                    </Badge>
                );
            case "fulfilled":
                return (
                    <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Fulfilled
                    </Badge>
                );
            case "expired":
                return (
                    <Badge className="bg-muted/10 text-muted-foreground border-muted/20">
                        <XCircle className="w-3 h-3 mr-1" />
                        Expired
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div>
            <div className="container mx-auto px-6 py-8">
                {/* Dashboard Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="metric-card admin-card border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Users
                            </CardTitle>
                            <Users className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                2,847
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-primary">+12%</span> from
                                last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="metric-card admin-card border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Donors
                            </CardTitle>
                            <Heart className="h-5 w-5 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                1,234
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-secondary">+8%</span> from
                                last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="metric-card admin-card border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Blood Requests
                            </CardTitle>
                            <AlertTriangle className="h-5 w-5 text-chart-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                89
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-chart-4">23 urgent</span>{" "}
                                requests pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="metric-card admin-card border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Donations Today
                            </CardTitle>
                            <TrendingUp className="h-5 w-5 text-chart-3" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                47
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-chart-3">+15%</span> above
                                average
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-5 bg-card">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger
                            value="requests"
                            className="flex items-center gap-2"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Requests
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="flex items-center gap-2"
                        >
                            <Activity className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <Card className="admin-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>
                                        Latest system activities and updates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-chart-3/10 to-chart-3/5 border border-chart-3/20">
                                        <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                New donor registered
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Sarah Johnson - O+ blood type
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            2 min ago
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-chart-4/10 to-chart-4/5 border border-chart-4/20">
                                        <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Urgent blood request
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                AB- needed at City Hospital
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            5 min ago
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Donation completed
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Michael Chen donated 450ml
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            12 min ago
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-chart-2/10 to-chart-2/5 border border-chart-2/20">
                                        <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Request matched
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Donor found for emergency case
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            18 min ago
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="admin-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-chart-4" />
                                        System Alerts
                                    </CardTitle>
                                    <CardDescription>
                                        Issues requiring immediate attention
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-chart-2/10 to-chart-2/5 border border-chart-2/20">
                                        <Clock className="w-5 h-5 text-chart-2" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Pending verifications
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                15 donor applications awaiting
                                                review
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="shrink-0 bg-transparent"
                                        >
                                            Review
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-chart-4/10 to-chart-4/5 border border-chart-4/20">
                                        <AlertTriangle className="w-5 h-5 text-chart-4" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                High priority requests
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                3 urgent blood requests need
                                                attention
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="shrink-0"
                                        >
                                            Handle
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="admin-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-chart-3" />
                                        Quick Stats
                                    </CardTitle>
                                    <CardDescription>
                                        Today&apos;s performance overview
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-chart-3/10 to-chart-3/5 border border-chart-3/20">
                                        <div>
                                            <p className="text-sm font-medium">
                                                New Registrations
                                            </p>
                                            <p className="text-2xl font-bold text-chart-3">
                                                12
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-chart-3" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                                        <div>
                                            <p className="text-sm font-medium">
                                                Donations Today
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                8
                                            </p>
                                        </div>
                                        <Heart className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-chart-4/10 to-chart-4/5 border border-chart-4/20">
                                        <div>
                                            <p className="text-sm font-medium">
                                                Active Requests
                                            </p>
                                            <p className="text-2xl font-bold text-chart-4">
                                                23
                                            </p>
                                        </div>
                                        <Users className="w-8 h-8 text-chart-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
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
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
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
                                            <SelectItem value="all">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="verified">
                                                Verified
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="suspended">
                                                Suspended
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={filterType}
                                        onValueChange={setFilterType}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <Filter className="w-4 h-4 mr-2" />
                                            <SelectValue placeholder="Filter by type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Types
                                            </SelectItem>
                                            <SelectItem value="donor">
                                                Donors
                                            </SelectItem>
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
                                                <TableHead>
                                                    Blood Type
                                                </TableHead>
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
                                                                    {
                                                                        user.avatar
                                                                    }
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
                                                        {getTypeBadge(
                                                            user.type
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            user.status
                                                        )}
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
                                                                <DialogTrigger
                                                                    asChild
                                                                >
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
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Detailed
                                                                            user
                                                                            information
                                                                            and
                                                                            management
                                                                            options
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
                                                            {user.status ===
                                                                "pending" && (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-chart-3 hover:bg-chart-3/90"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            {user.status ===
                                                                "verified" && (
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
                                        Showing {filteredUsers.length} of{" "}
                                        {users.length} users
                                    </span>
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            Verified:{" "}
                                            {
                                                users.filter(
                                                    (u) =>
                                                        u.status === "verified"
                                                ).length
                                            }
                                        </span>
                                        <span>
                                            Pending:{" "}
                                            {
                                                users.filter(
                                                    (u) =>
                                                        u.status === "pending"
                                                ).length
                                            }
                                        </span>
                                        <span>
                                            Suspended:{" "}
                                            {
                                                users.filter(
                                                    (u) =>
                                                        u.status === "suspended"
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Requests Tab */}
                    <TabsContent value="requests" className="space-y-6">
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
                                                setRequestSearchTerm(
                                                    e.target.value
                                                )
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
                                            <SelectItem value="all">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="fulfilled">
                                                Fulfilled
                                            </SelectItem>
                                            <SelectItem value="expired">
                                                Expired
                                            </SelectItem>
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
                                            <SelectItem value="all">
                                                All Urgency
                                            </SelectItem>
                                            <SelectItem value="critical">
                                                Critical
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Requester</TableHead>
                                                <TableHead>
                                                    Blood Type
                                                </TableHead>
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
                                                                    {
                                                                        request.avatar
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        request.requesterName
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        request.location
                                                                    }
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
                                                        {getUrgencyBadge(
                                                            request.urgency
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getRequestStatusBadge(
                                                            request.status
                                                        )}
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
                                                                {
                                                                    request.responses
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Dialog>
                                                                <DialogTrigger
                                                                    asChild
                                                                >
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
                                                                            Blood
                                                                            Request
                                                                            Details
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            Complete
                                                                            information
                                                                            about
                                                                            this
                                                                            blood
                                                                            donation
                                                                            request
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
                                                            {request.status ===
                                                                "active" &&
                                                                request.urgency ===
                                                                    "critical" && (
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-destructive hover:bg-destructive/90"
                                                                    >
                                                                        <Zap className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                            {request.status ===
                                                                "active" &&
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
                                                    (r) =>
                                                        r.urgency === "critical"
                                                ).length
                                            }
                                        </span>
                                        <span>
                                            Fulfilled:{" "}
                                            {
                                                donationRequests.filter(
                                                    (r) =>
                                                        r.status === "fulfilled"
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="admin-card border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Monthly Growth
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                +24%
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="admin-card border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Success Rate
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                87%
                                            </p>
                                        </div>
                                        <Target className="w-8 h-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="admin-card border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Avg Response Time
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                2.4h
                                            </p>
                                        </div>
                                        <Clock className="w-8 h-8 text-orange-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="admin-card border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Active Regions
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                12
                                            </p>
                                        </div>
                                        <MapPin className="w-8 h-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Donation Trends Chart */}
                            <Card className="admin-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Donation Trends
                                    </CardTitle>
                                    <CardDescription>
                                        Monthly donation statistics over the
                                        past year
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                                        <div className="text-center">
                                            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-primary/50" />
                                            <p className="text-sm text-muted-foreground">
                                                Interactive chart showing
                                                donation trends
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Blood Type Distribution */}
                            <Card className="admin-card border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5" />
                                        Blood Type Distribution
                                    </CardTitle>
                                    <CardDescription>
                                        Current distribution of blood types in
                                        inventory
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                type: "O+",
                                                percentage: 38,
                                                color: "bg-red-500",
                                            },
                                            {
                                                type: "A+",
                                                percentage: 34,
                                                color: "bg-blue-500",
                                            },
                                            {
                                                type: "B+",
                                                percentage: 9,
                                                color: "bg-green-500",
                                            },
                                            {
                                                type: "AB+",
                                                percentage: 3,
                                                color: "bg-purple-500",
                                            },
                                            {
                                                type: "O-",
                                                percentage: 7,
                                                color: "bg-orange-500",
                                            },
                                            {
                                                type: "A-",
                                                percentage: 6,
                                                color: "bg-cyan-500",
                                            },
                                            {
                                                type: "B-",
                                                percentage: 2,
                                                color: "bg-pink-500",
                                            },
                                            {
                                                type: "AB-",
                                                percentage: 1,
                                                color: "bg-yellow-500",
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.type}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${item.color}`}
                                                    />
                                                    <span className="font-medium">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 bg-muted rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${item.color}`}
                                                            style={{
                                                                width: `${item.percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium w-8">
                                                        {item.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Geographic Distribution */}
                        <Card className="admin-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Geographic Distribution
                                </CardTitle>
                                <CardDescription>
                                    Donor and recipient distribution across
                                    regions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            region: "Dhaka Division",
                                            donors: 1247,
                                            recipients: 89,
                                            growth: "+12%",
                                        },
                                        {
                                            region: "Chittagong Division",
                                            donors: 892,
                                            recipients: 67,
                                            growth: "+8%",
                                        },
                                        {
                                            region: "Sylhet Division",
                                            donors: 634,
                                            recipients: 45,
                                            growth: "+15%",
                                        },
                                        {
                                            region: "Rajshahi Division",
                                            donors: 567,
                                            recipients: 34,
                                            growth: "+6%",
                                        },
                                        {
                                            region: "Khulna Division",
                                            donors: 445,
                                            recipients: 28,
                                            growth: "+9%",
                                        },
                                        {
                                            region: "Barisal Division",
                                            donors: 323,
                                            recipients: 19,
                                            growth: "+11%",
                                        },
                                    ].map((region) => (
                                        <div
                                            key={region.region}
                                            className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg"
                                        >
                                            <h4 className="font-semibold mb-2">
                                                {region.region}
                                            </h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Donors:
                                                    </span>
                                                    <span className="font-medium">
                                                        {region.donors.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Recipients:
                                                    </span>
                                                    <span className="font-medium">
                                                        {region.recipients}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Growth:
                                                    </span>
                                                    <span className="font-medium text-green-600">
                                                        {region.growth}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reports Section */}
                        <Card className="admin-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Generate Reports
                                </CardTitle>
                                <CardDescription>
                                    Export detailed reports for analysis and
                                    compliance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        {
                                            title: "Monthly Summary",
                                            description:
                                                "Complete monthly donation report",
                                            icon: Calendar,
                                        },
                                        {
                                            title: "User Analytics",
                                            description:
                                                "Detailed user behavior analysis",
                                            icon: Users,
                                        },
                                        {
                                            title: "Inventory Report",
                                            description:
                                                "Current blood inventory status",
                                            icon: Package,
                                        },
                                        {
                                            title: "Performance Metrics",
                                            description:
                                                "System performance indicators",
                                            icon: Activity,
                                        },
                                    ].map((report) => (
                                        <div
                                            key={report.title}
                                            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <report.icon className="w-5 h-5 text-primary" />
                                                <h4 className="font-semibold">
                                                    {report.title}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {report.description}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full bg-transparent"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Export
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="admin-card border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Recent System Activity
                                </CardTitle>
                                <CardDescription>
                                    Latest system events and notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        {
                                            time: "2 minutes ago",
                                            event: "New blood request submitted",
                                            type: "request",
                                            severity: "high",
                                        },
                                        {
                                            time: "15 minutes ago",
                                            event: "Donor verification completed",
                                            type: "verification",
                                            severity: "medium",
                                        },
                                        {
                                            time: "1 hour ago",
                                            event: "Blood inventory updated",
                                            type: "inventory",
                                            severity: "low",
                                        },
                                        {
                                            time: "2 hours ago",
                                            event: "System backup completed",
                                            type: "system",
                                            severity: "low",
                                        },
                                        {
                                            time: "3 hours ago",
                                            event: "New user registration",
                                            type: "user",
                                            severity: "medium",
                                        },
                                    ].map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-3 bg-gradient-to-r from-muted/50 to-transparent rounded-lg"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    activity.severity === "high"
                                                        ? "bg-red-500"
                                                        : activity.severity ===
                                                            "medium"
                                                          ? "bg-yellow-500"
                                                          : "bg-green-500"
                                                }`}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {activity.event}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.time}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    activity.severity === "high"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                            >
                                                {activity.type}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
