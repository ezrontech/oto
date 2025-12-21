"use client";

import React from "react";
import { cn } from "../lib/utils";
import { User, Briefcase, Link as LinkIcon, Share2, MessageSquare, UserPlus, Shield, Globe, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { Badge } from "./Badge";
import { Card, CardContent, CardFooter, CardHeader } from "./Card";
import { Button } from "./Button";
import { getPlatformInfo } from "../utils/platformIcons";

export interface ContactCardProps {
    user: {
        name: string;
        avatar?: string;
        title?: string;
        company?: string;
        bio?: string;
        connections?: number;
        tags?: string[];
        links?: { platform: string; url: string }[];
        settings?: {
            receiveMessagesFromAnyone: boolean;
        };
    };
    visibility: "public" | "private" | "professional";
    isOwnCard?: boolean;
    onConnect?: () => void;
    onMessage?: () => void;
    onShare?: () => void;
    onEdit?: () => void;
    className?: string;
}

export function ContactCard({
    user,
    visibility,
    isOwnCard,
    onConnect,
    onMessage,
    onShare,
    onEdit,
    className
}: ContactCardProps) {
    const isPrivate = visibility === "private" && !isOwnCard;

    if (isPrivate) {
        return (
            <Card className={cn("w-full max-w-sm overflow-hidden border-dashed bg-muted/20", className)}>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Private Profile</h3>
                    <p className="text-sm text-muted-foreground">This user has set their contact card to private.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("w-full max-w-sm overflow-hidden", className)}>
            <div className={cn(
                "h-24 w-full",
                visibility === "professional" ? "bg-gradient-to-r from-blue-600 to-indigo-700" :
                    visibility === "public" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                        "bg-muted"
            )} />

            <CardHeader className="relative pt-0 pb-2 px-6">
                <div className="absolute -top-12 left-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                        <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="mt-14 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{user.title}</p>
                    </div>
                    <Badge variant={visibility === "professional" ? "default" : "secondary"} className="capitalize">
                        {visibility}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="px-6 py-2 space-y-4">
                {user.bio && (
                    <p className="text-sm text-foreground/80 italic leading-relaxed">
                        "{user.bio}"
                    </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                    {user.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="space-y-2 pt-2">
                    {user.company && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Briefcase className="h-3 w-3" />
                            <span>{user.company}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{user.connections || 0} connections</span>
                    </div>
                    {visibility !== "private" && user.links && user.links.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {user.links.map(link => (
                                <a
                                    key={link.platform + link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                    title={link.platform}
                                >
                                    {getPlatformIcon(link.platform)}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="px-6 py-4 bg-muted/10 border-t border-border mt-2 gap-2">
                {isOwnCard ? (
                    <Button variant="outline" className="w-full gap-2 rounded-xl" onClick={onEdit}>
                        Edit Card
                    </Button>
                ) : (
                    <>
                        <Button className="flex-1 gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={onConnect}>
                            <UserPlus className="h-4 w-4" /> Connect
                        </Button>
                        {user.settings?.receiveMessagesFromAnyone && (
                            <Button variant="outline" className="flex-1 gap-2 rounded-xl" onClick={onMessage}>
                                <MessageSquare className="h-4 w-4" /> Message
                            </Button>
                        )}
                    </>
                )}
                <Button variant="ghost" size="icon" className="shrink-0 rounded-xl" onClick={onShare}>
                    <Share2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

function getPlatformIcon(platform: string) {
    const platformInfo = getPlatformInfo(platform);
    const IconComponent = platformInfo.icon;
    return <IconComponent className="h-3.5 w-3.5" color={platformInfo.color} />;
}
