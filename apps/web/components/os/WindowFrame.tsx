"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus } from "lucide-react";
import { Button } from "@oto/ui";
import { useWindowManager } from "@/context/window-manager";
import { cn } from "@oto/ui";

interface WindowFrameProps {
    id: string;
    title: string;
    children: ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
}

export function WindowFrame({ id, title, children, isOpen, isMinimized, zIndex }: WindowFrameProps) {
    const { closeWindow, minimizeWindow, focusWindow } = useWindowManager();

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        closeWindow(id);
    };

    return (
        <AnimatePresence>
            {isOpen && !isMinimized && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    // FULL SCREEN MODAL STYLE ("Tab" behavior) but with Floating "Glass" Aesthetics
                    className={cn(
                        "fixed z-50 flex flex-col pointer-events-auto",
                        // Mobile: Full screen mostly
                        "inset-2 rounded-2xl",
                        // Desktop: Floating window with margin
                        "md:inset-8 md:rounded-[32px]",
                        // Glass Effect
                        "bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
                    )}
                    style={{ zIndex }}
                    onMouseDown={() => focusWindow(id)}
                >
                    {/* Window Header / Tab Bar */}
                    <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 gap-2 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                onClick={handleClose}
                                type="button" // Ensure it's not submitting forms
                            >
                                <span className="text-xs uppercase font-bold tracking-wider">Close</span>
                                <div className="h-6 w-6 rounded-full bg-current flex items-center justify-center opacity-20">
                                    <X className="h-3 w-3 text-background" />
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Window Content */}
                    <div className="flex-1 overflow-auto bg-background/50 relative">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
