/**
 * Admin sessiyasi: imzolangan cookie (HMAC-SHA256). Edge (middleware) va Node'da ishlaydi.
 *
 * Muhit oʻzgaruvchilari:
 *   ADMIN_PASSWORD  — admin paneliga kirish paroli (majburiy)
 *   SESSION_SECRET  — cookie imzosi uchun maxfiy kalit (tavsiya etiladi; boʻlmasa paroldan hosil qilinadi)
 */
export const SESSION_COOKIE = "ya_admin";
export const SESSION_TTL = 60 * 60 * 12; // 12 soat

const enc = new TextEncoder();

function secret() {
  const s = process.env.SESSION_SECRET || (process.env.ADMIN_PASSWORD ? `pw:${process.env.ADMIN_PASSWORD}` : "");
  return s;
}

async function hmac(data: string, key = secret()) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const authConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

/** Parolni vaqtga bogʻliq boʻlmagan usulda tekshirish */
export async function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const key = "pw-compare";
  return safeEqual(await hmac(input, key), await hmac(pw, key));
}

export async function createSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const nonce = crypto.randomUUID();
  const payload = `${exp}.${nonce}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(`${exp}.${nonce}`));
}
