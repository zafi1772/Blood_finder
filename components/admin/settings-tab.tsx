"use client";

import { useState, useEffect } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { showToast } from "@/components/others/extras";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { syncLocations } from "@/lib/actions";

export default function SettingsTab() {
    const existingSearchRadius = useQuery(api.configs.getDonorSearchRadiusInKm);
    const updateSearchRadius = useMutation(api.configs.updateSearchRadius);

    const [isUpdating, setIsUpdating] = useState(false);
    const [searchRadius, setSearchRadius] = useState(0);

    useEffect(() => {
        if (
            existingSearchRadius !== undefined ||
            existingSearchRadius !== null
        ) {
            setSearchRadius(existingSearchRadius!);
        }
    }, [existingSearchRadius]);

    async function handleUpdateClick() {
        setIsUpdating(true);

        const res = await updateSearchRadius({
            radiusInKm: searchRadius!,
        });
        if (res) {
            showToast({ title: "Search radius updated successfully" });
        } else {
            showToast({
                title: "Failed to update search radius",
                isWarning: true,
            });
        }

        setIsUpdating(false);
    }

    async function handleSyncClick() {
        setIsUpdating(true);

        const res = await syncLocations();
        if (res) {
            showToast({ title: "Location data synchronized successfully" });
        } else {
            showToast({
                title: "Failed to synchronize location data",
                isWarning: true,
            });
        }

        setIsUpdating(false);
    }

    return (
        <div className="space-y-8">
            <Card className="admin-card border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Location Settings</CardTitle>
                            <CardDescription>
                                Manage donor search and data synchronization.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label
                            htmlFor="searchRadius"
                            className="text-base font-semibold"
                        >
                            Donor Search Radius
                        </Label>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Set the maximum distance (in kilometers) to search
                            for donors.
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={searchRadius}
                                    onChange={(e) =>
                                        setSearchRadius(Number(e.target.value))
                                    }
                                    className="max-w-xs"
                                />
                                <span className="text-sm text-muted-foreground">
                                    km
                                </span>
                            </div>
                            <Button
                                className="w-36"
                                disabled={isUpdating}
                                onClick={handleUpdateClick}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Update
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Label
                            htmlFor="location-sync"
                            className="text-base font-semibold"
                        >
                            Location Data Synchronization
                        </Label>
                        <div className="mt-4 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/30">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-semibold">Manual Sync</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-36"
                                    disabled={isUpdating}
                                    onClick={handleSyncClick}
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sync Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
