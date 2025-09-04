"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { showToast } from "@/components/others/extras";

export default function SettingsTab({
    donationStatus,
}: {
    donationStatus: boolean;
}) {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateDonationStatus = useMutation(api.users.updateDonationStatus);

    async function handleDonationStatusUpdate(newStatus: boolean) {
        setIsUpdating(true);

        const res = await updateDonationStatus({ isDonating: newStatus });
        if (res) {
            showToast({ title: "Donation status updated successfully" });
        } else {
            showToast({ title: "Failed to update donation status" });
        }

        setIsUpdating(false);
    }

    return (
        <div className="space-y-6">
            <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5 text-primary" />
                        Account Settings
                    </CardTitle>
                    <CardDescription>
                        Manage your account preferences and settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg glass">
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold">
                                Donation Availability
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Toggle your availability for blood donation
                                requests. When enabled, other users can send you
                                donation requests.
                            </p>
                        </div>
                        <Switch
                            checked={donationStatus}
                            disabled={isUpdating}
                            onCheckedChange={handleDonationStatusUpdate}
                            className="ml-4 data-[state=unchecked]:bg-primary"
                        />
                    </div>

                    <div className="p-4 border border-border rounded-lg glass">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`w-3 h-3 rounded-full ${donationStatus ? "bg-green-500" : "bg-destructive"}`}
                            ></div>
                            <span className="font-medium">
                                Status:{" "}
                                {donationStatus
                                    ? "Available for Donation"
                                    : "Not Available"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {donationStatus
                                ? "You are currently visible to users looking for blood donors in your area."
                                : "You will not receive new donation requests while this is disabled."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
