"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    Heart,
    MessageSquare,
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
} from "lucide-react";

interface RequestMade {
    id: number;
    bloodType: string;
    urgency: string;
    location: string;
    amount: string;
    message: string;
    status: string;
    createdAt: string;
    responses: number;
}

interface RequestReceived {
    id: number;
    requesterName: string;
    bloodType: string;
    urgency: string;
    location: string;
    amount: string;
    message: string;
    status: string;
    createdAt: string;
    distance: string;
}

interface NewRequest {
    bloodType: string;
    urgency: string;
    location: string;
    amount: string;
    message: string;
}

interface RequestsTabProps {
    isNewRequestOpen: boolean;
    setIsNewRequestOpen: (open: boolean) => void;
    requestsMade: RequestMade[];
    requestsReceived: RequestReceived[];
    newRequest: NewRequest;
    bloodTypes: string[];
    urgencyLevels: string[];
    handleNewRequestChange: (field: string, value: string) => void;
    handleSubmitRequest: () => void;
    handleRespondToRequest: (id: number, action: "accept" | "decline") => void;
}

export default function RequestsTab({
    isNewRequestOpen,
    setIsNewRequestOpen,
    requestsMade,
    requestsReceived,
    newRequest,
    bloodTypes,
    urgencyLevels,
    handleNewRequestChange,
    handleSubmitRequest,
    handleRespondToRequest,
}: RequestsTabProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
            case "Pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Fulfilled":
            case "Accepted":
            case "Responded":
            case "Completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "Declined":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case "Critical":
            case "High":
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case "Medium":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "Low":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">
                    Blood Donation Requests
                </h2>
                <Dialog
                    open={isNewRequestOpen}
                    onOpenChange={setIsNewRequestOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="hover:scale-105 transition-transform">
                            <Plus className="h-4 w-4 mr-2" />
                            New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Blood Request</DialogTitle>
                            <DialogDescription>
                                Submit a new blood donation request to find
                                compatible donors in your area.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="request-blood-type">
                                    Blood Type Needed
                                </Label>
                                <Select
                                    value={newRequest.bloodType}
                                    onValueChange={(value) =>
                                        handleNewRequestChange(
                                            "bloodType",
                                            value
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select blood type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="request-amount">
                                    Amount Needed
                                </Label>
                                <Input
                                    id="request-amount"
                                    value={newRequest.amount}
                                    onChange={(e) =>
                                        handleNewRequestChange(
                                            "amount",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., 200ml, 450ml"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="request-urgency">
                                    Urgency Level
                                </Label>
                                <Select
                                    value={newRequest.urgency}
                                    onValueChange={(value) =>
                                        handleNewRequestChange("urgency", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select urgency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {urgencyLevels.map((level) => (
                                            <SelectItem
                                                key={level}
                                                value={level}
                                            >
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="request-location">
                                    Hospital/Location
                                </Label>
                                <Input
                                    id="request-location"
                                    value={newRequest.location}
                                    onChange={(e) =>
                                        handleNewRequestChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter hospital or location"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="request-message">Message</Label>
                                <Textarea
                                    id="request-message"
                                    value={newRequest.message}
                                    onChange={(e) =>
                                        handleNewRequestChange(
                                            "message",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Provide details about the blood need..."
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={handleSubmitRequest}
                                className="w-full"
                                disabled={
                                    !newRequest.bloodType ||
                                    !newRequest.urgency ||
                                    !newRequest.location ||
                                    !newRequest.amount
                                }
                            >
                                Submit Request
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requests I Made */}
                <Card className="glass-card border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Requests I Made ({requestsMade.length})
                        </CardTitle>
                        <CardDescription>
                            Blood requests you have submitted
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requestsMade.length > 0 ? (
                            <div className="space-y-4">
                                {requestsMade.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-4 border border-border rounded-lg glass"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {getUrgencyIcon(
                                                    request.urgency
                                                )}
                                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                                    {request.bloodType}
                                                </Badge>
                                                <Badge className="bg-accent/10 text-accent border-accent/20">
                                                    {request.amount}
                                                </Badge>
                                                <Badge
                                                    className={getStatusColor(
                                                        request.status
                                                    )}
                                                >
                                                    {request.status}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {request.createdAt}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold mb-2">
                                            {request.location}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {request.message}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Urgency: {request.urgency}
                                            </span>
                                            <span className="text-primary font-medium">
                                                {request.responses} responses
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

                {/* Requests I Received */}
                <Card className="glass-card border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-accent flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Requests I Received ({requestsReceived.length})
                        </CardTitle>
                        <CardDescription>
                            Blood requests sent to you
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requestsReceived.length > 0 ? (
                            <div className="space-y-4">
                                {requestsReceived.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-4 border border-border rounded-lg glass"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {getUrgencyIcon(
                                                    request.urgency
                                                )}
                                                <Badge className="bg-accent/10 text-accent border-accent/20">
                                                    {request.bloodType}
                                                </Badge>
                                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                                    {request.amount}
                                                </Badge>
                                                <Badge
                                                    className={getStatusColor(
                                                        request.status
                                                    )}
                                                >
                                                    {request.status}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {request.createdAt}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold mb-1">
                                            {request.requesterName}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {request.location} •{" "}
                                            {request.distance}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {request.message}
                                        </p>
                                        {request.status === "Pending" && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleRespondToRequest(
                                                            request.id,
                                                            "accept"
                                                        )
                                                    }
                                                    className="flex-1"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleRespondToRequest(
                                                            request.id,
                                                            "decline"
                                                        )
                                                    }
                                                    className="flex-1 bg-transparent"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Decline
                                                </Button>
                                            </div>
                                        )}
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
            </div>
        </div>
    );
}
