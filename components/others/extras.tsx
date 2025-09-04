import { AlertCircle, CheckCircle, Clock } from "lucide-react";

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
