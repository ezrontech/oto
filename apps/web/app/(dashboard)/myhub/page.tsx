"use client";

import { MOCK_PRODUCTIVITY } from "@/data/mock";

export default function MyHubPage() {
    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">Debug Page</h1>
            <p>Hours Saved: {MOCK_PRODUCTIVITY.hoursSaved}</p>
            <p>If you see this, the imports are working.</p>
        </div>
    );
}
