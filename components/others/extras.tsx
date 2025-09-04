import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

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
