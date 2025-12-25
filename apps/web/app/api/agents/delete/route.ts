import { NextResponse } from "next/server";
import { deleteAgent } from "@/lib/agents-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

    deleteAgent(String(id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "server_error", details: String(e) }, { status: 500 });
  }
}
