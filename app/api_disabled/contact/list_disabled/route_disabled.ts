import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const take = Math.min(parseInt(url.searchParams.get("take") || "100", 10), 200);
    const skip = Math.max(parseInt(url.searchParams.get("skip") || "0", 10), 0);

    const [rows, total] = await Promise.all([
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take,
        skip,
        select: {
          id: true,
          company: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          ip: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.contact.count(),
    ]);

    return NextResponse.json(
      { ok: true, total, rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "조회 실패" },
      { status: 500 }
    );
  }
}