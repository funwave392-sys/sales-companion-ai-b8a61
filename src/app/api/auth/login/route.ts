import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  isAuthEnabled,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

function safeEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  if (!isAuthEnabled()) {
    return NextResponse.json({ ok: true });
  }

  const expectedUsername = process.env.APP_USERNAME;
  const expectedPassword = process.env.APP_PASSWORD;
  if (!expectedUsername || !expectedPassword || !process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "ログイン設定が完了していません。" },
      { status: 503 },
    );
  }

  const parsed = loginSchema.safeParse(await request.json());
  if (
    !parsed.success ||
    !safeEqual(parsed.data.username, expectedUsername) ||
    !safeEqual(parsed.data.password, expectedPassword)
  ) {
    return NextResponse.json(
      { error: "ユーザー名またはパスワードが違います。" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
