"use client";

import { useState } from "react";
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
import { BLOOD_TYPES, URGENCY_LEVELS } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewDonationRequest() {
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        bloodType: "",
        urgency: "",
        location: "",
        amount: "",
        message: "",
    });

    const handleNewRequestChange = (field: string, value: string) => {
        setNewRequest((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitRequest = () => {
        const request = {
            id: Date.now(),
            ...newRequest,
            status: "Active",
            createdAt: new Date().toISOString().split("T")[0],
            responses: 0,
        };
        setNewRequest({
            bloodType: "",
            urgency: "",
            location: "",
            amount: "",
            message: "",
        });
        setIsNewRequestOpen(false);
        console.log("New request submitted:", request);
    };

    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">
                Blood Donation Requests
            </h2>
            <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
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
                                    handleNewRequestChange("bloodType", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BLOOD_TYPES.map((type) => (
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
                                    {URGENCY_LEVELS.map((level) => (
                                        <SelectItem key={level} value={level}>
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
    );
}
