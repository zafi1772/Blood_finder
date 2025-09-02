"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexProvider client={convex}>{children}</ConvexProvider>
        </ClerkProvider>
    );
}
