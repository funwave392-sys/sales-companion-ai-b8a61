import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      provider: process.env.AI_PROVIDER || "mock",
    });
  } catch {
    return NextResponse.json(
      { status: "error", reason: "database_unavailable" },
      { status: 503 },
    );
  }
}
