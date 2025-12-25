import { NextResponse } from "next/server";
import { upsertAgent } from "@/lib/agents-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const agent = body?.agent;
    if (!agent?.id) return NextResponse.json({ error: "missing_agent" }, { status: 400 });

    const saved = upsertAgent(agent);
    return NextResponse.json({ ok: true, agent: saved });
  } catch (e) {
    return NextResponse.json({ error: "server_error", details: String(e) }, { status: 500 });
  }
}
