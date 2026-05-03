/**
 * Resume tokens for re-engagement emails.
 *
 * Mints + verifies signed JWT-like tokens. Token format:
 *   base64url(payloadJson) + "." + base64url(hmacSha256(payloadJson, secret))
 *
 * Payload: { qsid: string, exp: number }
 *
 * Used to drop a user back into their plan reveal or checkout from an email
 * link, even if their localStorage is gone (different device, cleared cache).
 *
 * Server-side only.
 */

const DEFAULT_TTL_DAYS = 90;

type ResumePayload = {
  qsid: string; // quiz_session_id
  exp: number; // unix seconds
};

function bufToB64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlToBuf(s: string): ArrayBuffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function strToBuf(s: string): ArrayBuffer {
  return new TextEncoder().encode(s).buffer as ArrayBuffer;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    strToBuf(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, strToBuf(payload));
  return bufToB64Url(sig);
}

async function verify(payload: string, signature: string, secret: string): Promise<boolean> {
  const key = await importKey(secret);
  const sigBuf = b64UrlToBuf(signature);
  return crypto.subtle.verify("HMAC", key, sigBuf, strToBuf(payload));
}

/** Mint a resume token for a quiz_session_id. */
export async function mintResumeToken(
  qsid: string,
  ttlDays: number = DEFAULT_TTL_DAYS,
): Promise<string | null> {
  const secret = process.env.EMAIL_TOKEN_SECRET;
  if (!secret) {
    console.warn("[email/tokens] EMAIL_TOKEN_SECRET not set");
    return null;
  }
  const payload: ResumePayload = {
    qsid,
    exp: Math.floor(Date.now() / 1000) + ttlDays * 86400,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = bufToB64Url(strToBuf(payloadJson));
  const signature = await sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

/** Verify a resume token; returns the qsid if valid, null otherwise. */
export async function verifyResumeToken(token: string): Promise<string | null> {
  const secret = process.env.EMAIL_TOKEN_SECRET;
  if (!secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  const valid = await verify(payloadB64, signature, secret);
  if (!valid) return null;
  try {
    const payloadJson = new TextDecoder().decode(b64UrlToBuf(payloadB64));
    const payload = JSON.parse(payloadJson) as ResumePayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof payload.qsid !== "string") return null;
    return payload.qsid;
  } catch {
    return null;
  }
}
