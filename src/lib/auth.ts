export const SESSION_COOKIE_NAME = "sales_companion_session";
const SESSION_VALUE = "sales-companion:v1";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function isAuthEnabled(): boolean {
  return process.env.APP_AUTH_ENABLED === "true";
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRETが設定されていません。");
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(SESSION_VALUE),
  );

  return `${SESSION_VALUE}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  try {
    const expected = await createSessionToken();
    if (token.length !== expected.length) return false;

    let difference = 0;
    for (let index = 0; index < token.length; index += 1) {
      difference |= token.charCodeAt(index) ^ expected.charCodeAt(index);
    }
    return difference === 0;
  } catch {
    return false;
  }
}
