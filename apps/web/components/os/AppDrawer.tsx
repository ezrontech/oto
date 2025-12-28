"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutGrid,
    Settings,
    User,
    Bot,
    Layers,
    FileText,
    Briefcase,
    FlaskConical,
    FolderOpen,
    X
} from "lucide-react";
import { Button } from "@oto/ui";
import { useWindowManager } from "@/context/window-manager";

// Import Views (We will create these next, placeholders for now)
// Ideally we lazy load these
import dynamic from 'next/dynamic';

const SettingsView = dynamic(() => import('@/components/views/SettingsView'), { loading: () => <p>Loading...</p> });
const ContactsView = dynamic(() => import('@/components/views/ContactsView'), { loading: () => <p>Loading...</p> });

interface AppItem {
    id: string;
    label: string;
    icon: any;
    component: React.ReactNode;
}

export function AppDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const { openWindow } = useWindowManager();

    const apps: AppItem[] = [
        { id: "settings", label: "Settings", icon: Settings, component: <SettingsView /> },
        { id: "contacts", label: "Contacts", icon: User, component: <ContactsView /> },
        // Add placeholders for others
        { id: "spaces", label: "Spaces", icon: Layers, component: <div className="p-4">Spaces Content Coming Soon</div> },
        { id: "knowledge", label: "Knowledge", icon: FolderOpen, component: <div className="p-4">Knowledge Base Coming Soon</div> },
        { id: "labs", label: "Labs", icon: FlaskConical, component: <div className="p-4">Labs Content Coming Soon</div> },
    ];

    const handleAppClick = (app: AppItem) => {
        openWindow(app.id, app.label, app.component);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(!isOpen)}
                title="Open App Drawer"
            >
                <LayoutGrid className="h-5 w-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 h-[60vh] bg-card border-t border-border z-50 rounded-t-3xl shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Apps</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                                {apps.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => handleAppClick(app)}
                                        className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <app.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium text-center">{app.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
