"use client";

import { OtoChatDesktop } from "@/components/chat/OtoChatDesktop";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <OtoChatDesktop />
    </main>
  );
}
