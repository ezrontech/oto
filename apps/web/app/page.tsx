import Link from "next/link";
import { Button } from "@oto/ui";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Oto</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Your personalized AI agent platform. Phase 2 Scaffolding Complete.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/chat">
            <Button size="lg">Enter Chat App</Button>
          </Link>
          <Button variant="outline" size="lg">Documentation</Button>
        </div>
      </main>
    </div>
  );
}
