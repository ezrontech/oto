"use client";

import { Button } from "@oto/ui";
import { MessageSquare } from "lucide-react";
import { cn } from "@oto/ui";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export function GlobalChat() {
    const router = useRouter();
    const pathname = usePathname();

    // Hide FAB on chat and oto pages
    if (pathname === '/chat' || pathname === '/oto') {
        return null;
    }

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90"
                )}
                onClick={() => router.push('/oto')}
            >
                <MessageSquare className="h-6 w-6" />
            </Button>
        </motion.div>
    );
}
