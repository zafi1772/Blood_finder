import {
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    Heart,
    Users,
    XCircle,
    Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const getUrgencyIcon = (urgency: string) => {
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

export const getStatusBadge = (status: string) => {
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

export const getTypeBadge = (type: string) => {
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

export const getUrgencyBadge = (urgency: string) => {
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

export const getRequestStatusBadge = (status: string) => {
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

export const showToast = ({
    title,
    description,
    isWarning,
    position = "top-center",
}: {
    title: string;
    description?: string;
    isWarning?: boolean;
    position?:
        | "top-left"
        | "top-right"
        | "bottom-left"
        | "bottom-right"
        | "top-center"
        | "bottom-center";
}) =>
    toast(title, {
        position,
        description,
        style: isWarning
            ? {
                  background: "var(--destructive)",
                  color: "var(--destructive-foreground)",
                  border: "1px solid var(--destructive)",
                  backdropFilter: "blur(8px)",
              }
            : {
                  border: "1px solid var(--accent)",
                  backdropFilter: "blur(8px)",
              },
    });
