import { Sidebar } from "@/components/Sidebar";
import { GlobalChat } from "@/components/GlobalChat";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar className="hidden md:flex flex-shrink-0" />
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {children}
            </main>
            <GlobalChat />
        </div>
    );
}
