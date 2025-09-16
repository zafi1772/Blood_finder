"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "./loading";

import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatAddress, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
    const { requestId }: { requestId: Id<"donationRequests"> } = useParams();
    const router = useRouter();
    const acceptedDonors = useQuery(
        api.donationRequestsToDonors.getAcceptedDonors,
        { requestId }
    );

    if (acceptedDonors === undefined || acceptedDonors === null) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-4 max-w-8xl">
            <div className="mb-6 flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Go back"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Conversations
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        All your chat threads in one place.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {acceptedDonors.map((d) => (
                    <Link
                        key={d.donorId}
                        href={`${requestId}/${d.donorId}`}
                        className="block"
                    >
                        <Card className="p-4 hover:bg-accent/10 transition-colors">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar>
                                        <AvatarImage
                                            src={d.avatarUrl}
                                            alt={d.fullName}
                                        />
                                        <AvatarFallback>
                                            {getInitials(d.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <p className="font-medium truncate">
                                                {d.fullName}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {`+880${d.phoneNumber} • ${formatAddress(d.addressText)}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
