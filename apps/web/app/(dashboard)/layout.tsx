import { Sidebar } from "@/components/Sidebar";
import { GlobalChat } from "@/components/GlobalChat";
import AuthGuard from "@/components/auth-guard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen w-full bg-background overflow-hidden">
                <Sidebar className="hidden md:flex flex-shrink-0" />
                <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                    {children}
                </main>
                <GlobalChat />
            </div>
        </AuthGuard>
    );
}
