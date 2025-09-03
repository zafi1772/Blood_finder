"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart, Loader2 } from "lucide-react";

import { z } from "zod";

const formSchema = z.object({
    email: z.email({ pattern: z.regexes.html5Email }),
});

const verificationSchema = z.object({
    code: z.string().min(6, "Verification code must be 6 digits").max(6),
});

type FormData = z.infer<typeof formSchema>;
type VerificationData = z.infer<typeof verificationSchema>;

export default function UserAuth() {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [verificationStep, setVerificationStep] = useState<
        "email" | "verification"
    >("email");
    const [error, setError] = useState<string>("");
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

    const { signIn, setActive } = useSignIn();
    const { signUp } = useSignUp();

    const { isSignedIn, signOut } = useClerk();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const verificationForm = useForm<VerificationData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!signIn || !signUp) return;

        setIsSigningIn(true);
        setError("");

        try {
            if (authMode === "signin") {
                try {
                    const signInResult = await signIn.create({
                        identifier: data.email,
                    });

                    const emailFactor =
                        signInResult.supportedFirstFactors?.find(
                            (factor) => factor.strategy === "email_code"
                        );

                    if (emailFactor && "emailAddressId" in emailFactor) {
                        await signInResult.prepareFirstFactor({
                            strategy: "email_code",
                            emailAddressId: emailFactor.emailAddressId,
                        });
                        setVerificationStep("verification");
                    } else {
                        throw new Error("Email verification not supported");
                    }
                } catch (signInError: unknown) {
                    if (
                        signInError &&
                        typeof signInError === "object" &&
                        "errors" in signInError
                    ) {
                        const errorObj = signInError as {
                            errors?: Array<{ code?: string }>;
                        };
                        if (
                            errorObj.errors?.[0]?.code ===
                            "form_identifier_not_found"
                        ) {
                            setAuthMode("signup");
                            const signUpResult = await signUp.create({
                                emailAddress: data.email,
                            });

                            await signUpResult.prepareEmailAddressVerification({
                                strategy: "email_code",
                            });
                            setVerificationStep("verification");
                        } else {
                            throw signInError;
                        }
                    } else {
                        throw signInError;
                    }
                }
            } else {
                const signUpResult = await signUp.create({
                    emailAddress: data.email,
                });

                await signUpResult.prepareEmailAddressVerification({
                    strategy: "email_code",
                });
                setVerificationStep("verification");
            }
        } catch (error: unknown) {
            console.error("Auth error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to send verification email";
            setError(errorMessage);
        } finally {
            setIsSigningIn(false);
        }
    };

    const onVerificationSubmit = async (data: VerificationData) => {
        if (!signIn || !signUp) return;

        setIsSigningIn(true);
        setError("");

        try {
            if (authMode === "signin") {
                const result = await signIn.attemptFirstFactor({
                    strategy: "email_code",
                    code: data.code,
                });

                if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId });
                    setIsSignInOpen(false);
                    setVerificationStep("email");
                    setAuthMode("signin");
                    verificationForm.reset();
                }
            } else {
                const result = await signUp.attemptEmailAddressVerification({
                    code: data.code,
                });

                if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId });
                    setIsSignInOpen(false);
                    setVerificationStep("email");
                    setAuthMode("signin");
                    verificationForm.reset();
                }
            }
            form.reset();
        } catch (error: unknown) {
            console.error("Verification error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Invalid verification code";
            setError(errorMessage);
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleDialogChange = (open: boolean) => {
        setIsSignInOpen(open);
        if (!open) {
            setVerificationStep("email");
            setAuthMode("signin");
            setError("");
            form.reset();
            verificationForm.reset();
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    if (isSignedIn) {
        return (
            <Button
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform bg-transparent"
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
        );
    }

    return (
        <Dialog open={isSignInOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:scale-105 transition-transform bg-transparent"
                >
                    Sign In
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        {verificationStep === "email"
                            ? `${authMode === "signin" ? "Sign In" : "Sign Up"} to BloodFinder`
                            : "Verify Your Email"}
                    </DialogTitle>
                    <DialogDescription>
                        {verificationStep === "email"
                            ? `Enter your email to ${authMode === "signin" ? "sign in or we'll help you create an account" : "create your account"}.`
                            : "Enter the 6-digit code sent to your email address."}
                    </DialogDescription>
                </DialogHeader>
                <div id="clerk-captcha" />
                <div className="space-y-6 py-4">
                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {verificationStep === "email" ? (
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Enter your email"
                                    {...form.register("email")}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isSigningIn || !form.formState.isValid
                                    }
                                >
                                    {isSigningIn ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="mr-2 h-4 w-4" />
                                            {authMode === "signin"
                                                ? "Send Verification Code"
                                                : "Create Account"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form
                            onSubmit={verificationForm.handleSubmit(
                                onVerificationSubmit
                            )}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    {...verificationForm.register("code")}
                                />
                                {verificationForm.formState.errors.code && (
                                    <p className="text-sm text-red-500">
                                        {
                                            verificationForm.formState.errors
                                                .code.message
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isSigningIn ||
                                        !verificationForm.formState.isValid
                                    }
                                >
                                    {isSigningIn ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="mr-2 h-4 w-4" />
                                            {authMode === "signin"
                                                ? "Verify & Sign In"
                                                : "Verify & Create Account"}
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setVerificationStep("email");
                                        setAuthMode("signin");
                                        setError("");
                                        verificationForm.reset();
                                    }}
                                    disabled={isSigningIn}
                                >
                                    Back to Email
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
