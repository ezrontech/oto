"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@oto/ui";
import { MessageSquare, Settings, User, Bot, FolderOpen, Box, ChevronLeft, ChevronRight, PanelLeft, LayoutDashboard, Briefcase, Layers, FlaskConical, FileText } from "lucide-react";
import { Button } from "@oto/ui";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Auto-collapse on small screens logic could go here, or handled by CSS media queries hiding it entirely

    const mainLinks = [
        { href: "/myhub", label: "MyHub", icon: LayoutDashboard },
        { href: "/contacts", label: "Contacts", icon: User },
        { href: "/spaces", label: "Spaces", icon: Layers },
        { href: "/articles", label: "Articles", icon: FileText },
        { href: "/chat", label: "Conversations", icon: Bot },
        { href: "/agents", label: "Agents", icon: Briefcase },
        { href: "/tools", label: "Labs", icon: FlaskConical },
        { href: "/knowledge", label: "Knowledge", icon: FolderOpen },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 64 : 256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "flex flex-col h-full bg-sidebar border-r border-sidebar-border z-20 relative transition-colors",
                className
            )}
        >
            {/* Header */}
            <div className={cn("flex items-center h-14 border-b border-sidebar-border px-3", collapsed ? "justify-center" : "justify-between")}>
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-lg font-bold tracking-tight px-1 whitespace-nowrap overflow-hidden text-sidebar-foreground"
                        >
                            Oto
                        </motion.h1>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <PanelLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
                <nav className="space-y-1 px-2">
                    {!collapsed && (
                        <p className="px-2 text-xs font-semibold text-sidebar-foreground/50 mb-2 uppercase tracking-wider animate-in fade-in duration-300">
                            Platform
                        </p>
                    )}

                    {mainLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group flex items-center relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                                    collapsed && "justify-center px-0"
                                )}
                                title={collapsed ? link.label : undefined}
                            >
                                <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", !collapsed && "mr-3")} />

                                {!collapsed && (
                                    <span className="truncate">{link.label}</span>
                                )}

                                {isActive && collapsed && (
                                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer / Profile */}
            <div className="p-3 border-t border-sidebar-border">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer",
                    collapsed && "justify-center px-0"
                )}
                >
                    <div className="w-8 h-8 rounded-full bg-sidebar-primary/10 flex items-center justify-center border border-sidebar-border shrink-0">
                        <User className="w-4 h-4 text-sidebar-primary" />
                    </div>

                    {!collapsed && (
                        <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                            <p className="text-sm font-medium truncate text-sidebar-foreground">Ezron</p>
                            <p className="text-xs text-sidebar-foreground/60 truncate">Pro Plan</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
