import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-4 max-w-8xl h-[calc(100vh-4rem)] flex flex-col">
            <Card className="mb-4 p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
            </Card>

            <Card className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="flex justify-start">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-10 w-52 rounded-lg" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-40 rounded-lg" />
                    </div>
                    <div className="flex justify-start">
                        <Skeleton className="h-16 w-64 rounded-lg" />
                    </div>
                    <div className="flex justify-end">
                        <Skeleton className="h-12 w-44 rounded-lg" />
                    </div>
                </div>

                <div className="border-t p-3">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 flex-1 rounded-md" />
                        <Skeleton className="h-10 w-20 rounded-md" />
                    </div>
                </div>
            </Card>
        </div>
    );
}
