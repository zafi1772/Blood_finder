"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";

export default function SettingsTab() {
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
                    <div className="text-center py-12 text-muted-foreground">
                        <Edit className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Settings coming soon</p>
                        <p className="text-sm">
                            Profile customization options will be available here
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
