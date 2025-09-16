import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-4 max-w-8xl">
            <div className="mb-6">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>

            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Skeleton className="size-8 rounded-full" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-10" />
                                    </div>
                                    <Skeleton className="h-3 w-64" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                            </div>
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
