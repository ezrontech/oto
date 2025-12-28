"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // We are now allowing "Guest" access to the main layout.
    // Specific protections will be handled by the UI components (e.g., ControlPanel).
    return <>{children}</>;
}

