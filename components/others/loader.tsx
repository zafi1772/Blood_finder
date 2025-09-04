import { Loader2 } from "lucide-react";

export default function Loader({
    title,
    subtitle,
}: {
    title?: string;
    subtitle?: string;
}) {
    return (
        <div className="flex items-center justify-center h-full min-h-[300px] bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {title || "Loading..."}
                </h2>
                <p className="text-gray-600">
                    {subtitle || "Please wait while we fetch your information."}
                </p>
            </div>
        </div>
    );
}
