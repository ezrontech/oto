import fs from "fs";
import path from "path";
import { MOCK_AGENTS } from "@/data/mock";

const DATA_PATH = path.join(process.cwd(), "apps", "web", ".data");
const STORE_FILE = path.join(DATA_PATH, "agents.json");

function ensureDir() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
}

function seedIfMissing() {
  ensureDir();
  if (!fs.existsSync(STORE_FILE)) {
    const seeded = (MOCK_AGENTS || []).map((a: any) => ({ ...a }));
    fs.writeFileSync(STORE_FILE, JSON.stringify(seeded, null, 2));
  }
}

export function listAgents() {
  seedIfMissing();
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAgents(agents: any[]) {
  ensureDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(agents, null, 2));
}

export function upsertAgent(agent: any) {
  if (!agent?.id) throw new Error("missing_agent_id");
  const agents = listAgents();
  const idx = agents.findIndex((a: any) => a.id === agent.id);
  if (idx === -1) {
    agents.unshift(agent);
  } else {
    agents[idx] = { ...agents[idx], ...agent };
  }
  writeAgents(agents);
  return agent;
}

export function deleteAgent(id: string) {
  const agents = listAgents();
  const next = agents.filter((a: any) => a.id !== id);
  writeAgents(next);
  return true;
}
