"use client";

import { useState, useEffect } from "react"; // Added useEffect for mount check
import { createPortal } from "react-dom"; // Added portal
import { Button, cn } from "@oto/ui";
import { LayoutGrid, X } from "lucide-react";
import { useWindowManager } from "@/context/window-manager";
import dynamic from 'next/dynamic';
import { useAuth } from "@/components/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
    SpacesWidget, ConversationsWidget, ContactsWidget,
    LabsWidget, SettingsWidget, AgentsWidget
} from "./LaunchpadCards";

// Dynamic imports for views
const SettingsView = dynamic(() => import('../views/SettingsView'), { loading: () => null });
const ContactsView = dynamic(() => import('../views/ContactsView'), { loading: () => null });
const SpacesView = dynamic(() => import('../views/SpacesView'), { loading: () => null });
const ConversationsView = dynamic(() => import('../views/ConversationsView'), { loading: () => null });
const ArticlesView = dynamic(() => import('../views/ArticlesView'), { loading: () => null });
const LoginView = dynamic(() => import('../views/auth/LoginView'), { loading: () => null });
const LabsView = dynamic(() => import('../views/LabsView'), { loading: () => null });
const AgentsView = dynamic(() => import('../views/AgentsView'), { loading: () => null });

export function ControlPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { openWindow } = useWindowManager();
    const { user } = useAuth();

    const handleOpenApp = (id: string, label: string, component: React.ReactNode) => {
        // Protected Apps Logic
        const protectedApps = ["spaces", "conversations", "contacts", "agents"];
        if (!user && protectedApps.includes(id)) {
            openWindow("login", "Sign In Required", <LoginView />);
            setIsOpen(false);
            return;
        }

        openWindow(id, label, component);
        setIsOpen(false);
    };

    const handleCreateAgent = (mode: 'chat' | 'builder') => {
        // Logic to create agent
        console.log("Create agent mode:", mode);
        // For now just open the main window or trigger chat
        // Ideally 'chat' mode would close launchpad and insert a system prompt into the main chat
        setIsOpen(false);
        // TODO: Signal to OtoChatDesktop to start agent creation flow
    };

    // Ensure we only render the portal on the client
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const overlay = (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "fixed z-[60] flex flex-col pointer-events-auto",
                        "inset-2 rounded-2xl",
                        "md:inset-8 md:rounded-[32px]",
                        "bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
                    )}
                >
                    {/* Header */}
                    <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold tracking-tight">Launchpad</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 gap-2 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-xs uppercase font-bold tracking-wider">Close</span>
                            <div className="h-6 w-6 rounded-full bg-current flex items-center justify-center opacity-20">
                                <X className="h-3 w-3 text-background" />
                            </div>
                        </Button>
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto bg-background/50 relative p-4 md:p-8">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">

                            {/* Card 1: Spaces */}
                            <SpacesWidget onOpen={() => handleOpenApp("spaces", "Spaces", <SpacesView />)} />

                            {/* Card 2: Conversations */}
                            <ConversationsWidget onOpen={() => handleOpenApp("conversations", "Conversations", <ConversationsView />)} />

                            {/* Card 3: Contacts */}
                            <ContactsWidget onOpen={() => handleOpenApp("contacts", "Contacts", <ContactsView />)} />

                            {/* Card 4: Labs */}
                            <LabsWidget onOpen={() => handleOpenApp("labs", "Labs", <LabsView />)} />

                            {/* Card 5: Settings (Small) */}
                            <SettingsWidget onOpen={() => handleOpenApp("settings", "Settings", <SettingsView />)} />

                            {/* Card 6: Agents */}
                            <AgentsWidget
                                onOpen={() => handleOpenApp("agents", "Agents Intelligence", <AgentsView />)}
                                onCreate={handleCreateAgent}
                            />

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* Trigger Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    if (!user) {
                        openWindow("login", "Sign In", <LoginView />);
                    } else {
                        setIsOpen(true);
                    }
                }}
                className="rounded-xl h-10 w-10 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
                <LayoutGrid className="h-5 w-5" />
            </Button>

            {/* Portal for Full Screen Overlay */}
            {mounted && typeof document !== "undefined" && createPortal(overlay, document.body)}
        </>
    );
}
