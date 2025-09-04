"use client";

import { Heart } from "lucide-react";
import UserAuth from "@/components/home/user-auth";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const pathname = usePathname();
    const { isSignedIn } = useClerk();

    return (
        <header className="border-b glass-card sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="relative">
                        <Heart className="h-8 w-8 text-primary fill-primary" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        BloodFinder
                    </span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    {pathname === "/" && (
                        <>
                            <a
                                href="#how-it-works"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                How It Works
                            </a>
                            <a
                                href="#features"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                Features
                            </a>
                            <a
                                href="#about"
                                className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                                About
                            </a>
                        </>
                    )}

                    {isSignedIn && (
                        <Link
                            href="/profile"
                            className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                            Profile
                        </Link>
                    )}

                    <UserAuth />
                </nav>
            </div>
        </header>
    );
}
