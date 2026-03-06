// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendContactEmail } from "@/app/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));

  const company = String(body.company ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();

  // ✅ 필수값 체크
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "필수값 누락 (name/email/message)" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // ✅ IP / UA
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";

  const ua = req.headers.get("user-agent") || "";

  const createdAt = new Date();

  // ✅ 서버 최후 방어막: 30초 내 동일 email+message 중복 차단
  const since = new Date(createdAt.getTime() - 30_000);

  const dup = await prisma.contact.findFirst({
    where: {
      email,
      message,
      createdAt: { gte: since },
    },
    select: { id: true },
  });

  if (dup) {
    return NextResponse.json(
      { ok: false, error: "중복 문의로 판단되어 차단되었습니다(30초 이내 동일 내용)." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 1) DB 저장 (메일 실패해도 기록 남김)
  let saved: any;
  try {
    saved = await prisma.contact.create({
      data: {
        company,
        name,
        email,
        phone,
        message,
        createdAt,
        ip,
        userAgent: ua,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "DB 저장 실패" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  // 2) 메일 발송 (실패해도 ok=true 유지, mailOk=false로 반환)
  let mailOk = false;
  let mailError = "";

  try {
    await sendContactEmail({
      company,
      name,
      email,
      phone,
      message,
      createdAt: createdAt.toISOString(),
      ip,
      ua,
    });
    mailOk = true;
  } catch (e: any) {
    mailError = e?.message || String(e);
  }

  return NextResponse.json(
    {
      ok: true,
      id: String(saved.id),
      createdAt: createdAt.toISOString(),
      mailOk,
      mailError,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}