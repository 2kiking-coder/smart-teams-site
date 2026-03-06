import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "contact-submissions.jsonl");

type Item = {
  id: string;
  createdAt: string;import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "contact-submissions.jsonl");

type Item = {
  id: string;
  createdAt: string;
  status?: "pending" | "done";
  [k: string]: any;
};

async function readAll(): Promise<Item[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

async function writeAll(items: Item[]) {
  const body = items.map((x) => JSON.stringify(x)).join("\n") + (items.length ? "\n" : "");
  await fs.writeFile(DATA_FILE, body, "utf-8");
}

function normalizeStatus(v: any): "pending" | "done" | null {
  const s = String(v || "").toLowerCase();
  if (s === "pending") return "pending";
  if (s === "done") return "done";
  // 프론트가 PENDING/DONE을 보낼 수도 있으니 허용
  if (s === "p" || s === "pending") return "pending";
  if (s === "d" || s === "done") return "done";
  if (s === "pending".toLowerCase()) return "pending";
  if (s === "done".toLowerCase()) return "done";
  // "PENDING"/"DONE"
  if (String(v) === "PENDING") return "pending";
  if (String(v) === "DONE") return "done";
  return null;
}

// ✅ 프론트가 보내는 { updates: { [id]: "PENDING"|"DONE" } } 처리
export async function PATCH(req: Request) {
  const { updates } = await req.json();

  if (!updates || typeof updates !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const items = await readAll();
  const map = new Map(items.map((x) => [x.id, x]));

  for (const [id, st] of Object.entries(updates)) {
    const it = map.get(id);
    const ns = normalizeStatus(st);
    if (it && ns) map.set(id, { ...it, status: ns });
  }

  await writeAll(Array.from(map.values()));

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

  status?: "pending" | "done";
  [k: string]: any;
};

async function readAll(): Promise<Item[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

async function writeAll(items: Item[]) {
  const body = items.map((x) => JSON.stringify(x)).join("\n") + (items.length ? "\n" : "");
  await fs.writeFile(DATA_FILE, body, "utf-8");
}

export async function POST(req: Request) {
  const { id, status } = await req.json();

  if (!id || (status !== "pending" && status !== "done")) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const items = await readAll();
  const idx = items.findIndex((x) => x.id === id);
  if (idx < 0) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  items[idx] = { ...items[idx], status };
  await writeAll(items);

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
