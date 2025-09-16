"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "./loading";
import { showToast } from "@/components/others/extras";
import { ArrowLeft, SendHorizonal } from "lucide-react";

import { useLayoutEffect, useRef, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { formatAddress, getInitials } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Message = {
    id: string;
    authorId: string;
    authorName: string;
    text: string;
    createdAt: number;
};

export default function Page() {
    const { requestId, userId } = useParams<{
        requestId: Id<"donationRequests">;
        userId: Id<"users">;
    }>();
    const router = useRouter();
    const conversations = useQuery(api.conversations.getConversations, {
        requestId,
        userId,
    });

    const createConversation = useMutation(
        api.conversations.createConversation
    );

    const [input, setInput] = useState("");
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = (smooth = true) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: smooth ? "smooth" : "auto",
        });
        bottomRef.current?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "end",
        });
    };

    useLayoutEffect(() => {
        scrollToBottom(false);
    }, []);

    useLayoutEffect(() => {
        scrollToBottom(true);
    }, [conversations?.messages?.length]);

    if (!requestId || !userId) return notFound();

    const handleSend = async (senderId: Id<"users">) => {
        const text = input.trim();
        if (!text) return;

        const res = await createConversation({
            requestId,
            message: text,
            status: true,
            senderId: senderId,
            receiverId: userId,
        });

        if (!res) {
            showToast({ title: "Failed to send message", isWarning: true });
        } else {
            setInput("");
            requestAnimationFrame(() => scrollToBottom(true));
        }
    };

    if (!conversations) {
        return <Loading />;
    }

    const { messages, sender, receiver } = conversations;

    return (
        <div className="container mx-auto px-4 py-4 max-w-8xl h-[calc(100vh-4rem)] flex flex-col">
            <Card className="mb-4 p-4">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Go back"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar>
                        <AvatarImage
                            src={receiver.avatarUrl}
                            alt={receiver.fullName}
                        />
                        <AvatarFallback>
                            {getInitials(receiver.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                            <p className="font-medium truncate">
                                {receiver.fullName}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                            {`${receiver.email} • +880${receiver.phone}`}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {formatAddress(receiver.addressText)}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="flex-1 overflow-hidden flex flex-col">
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3 better-scrollbar"
                >
                    {messages.map((m) => (
                        <ChatBubble
                            key={m._id}
                            message={{
                                id: m._id,
                                authorId: m.senderId,
                                authorName:
                                    m.senderId === sender._id
                                        ? "You"
                                        : receiver.fullName,
                                text: m.message,
                                createdAt: m._creationTime,
                            }}
                            isMe={m.senderId === sender._id}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="border-t p-3">
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend(sender._id);
                        }}
                    >
                        <Input
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            className="bg-primary text-primary-foreground"
                            type="submit"
                        >
                            <SendHorizonal className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}

function ChatBubble({ message, isMe }: { message: Message; isMe: boolean }) {
    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm border ${
                    isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                }`}
            >
                {!isMe && (
                    <p className="text-[10px] mb-1 opacity-70">
                        {message.authorName}
                    </p>
                )}
                <p className="whitespace-pre-wrap break-words">
                    {message.text}
                </p>
                <p
                    className={`mt-1 text-[10px] opacity-70 ${isMe ? "text-primary-foreground/80" : ""}`}
                >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
}
