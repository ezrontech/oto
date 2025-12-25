import { NextResponse } from "next/server";
import { listAgents } from "@/lib/agents-store";

export async function GET() {
  try {
    const agents = listAgents();
    return NextResponse.json({ agents });
  } catch (e) {
    return NextResponse.json({ error: "server_error", details: String(e) }, { status: 500 });
  }
}
