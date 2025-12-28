"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import AuthGuard from "@/components/auth-guard";
import { WindowManagerProvider, useWindowManager } from "@/context/window-manager";
import { WindowManager } from "@/components/os/WindowManager";
import { OtoChatDesktop } from "@/components/chat/OtoChatDesktop";

// Lazy load views for routing
import dynamic from "next/dynamic";
const SettingsView = dynamic(() => import("@/components/views/SettingsView"), { loading: () => null });
const ContactsView = dynamic(() => import("@/components/views/ContactsView"), { loading: () => null });

function OSLayoutLogic({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { openWindow } = useWindowManager();

    useEffect(() => {
        // Simple routing logic to open windows based on URL
        // In a real app, this would be more robust
        if (pathname.includes("/settings")) {
            openWindow("settings", "Settings", <SettingsView />);
        } else if (pathname.includes("/contacts")) {
            openWindow("contacts", "Contacts", <ContactsView />);
        }
        // Add other route handlers
    }, [pathname, openWindow]);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            {/* Layer 0: Desktop / Chat Wallpaper */}
            <div className="absolute inset-0 z-0">
                <OtoChatDesktop />
            </div>

            {/* Layer 1: Window Manager (Overlay) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Pointer events none allows clicking through to chat, but Windows enable pointer-events-auto */}
                <WindowManager />
            </div>

            {/* Hidden Children (to preserve Next.js data fetching if any, though we are moving to client-side views mostly) */}
            <div className="hidden">
                {children}
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <WindowManagerProvider>
                <OSLayoutLogic>
                    {children}
                </OSLayoutLogic>
            </WindowManagerProvider>
        </AuthGuard>
    );
}
