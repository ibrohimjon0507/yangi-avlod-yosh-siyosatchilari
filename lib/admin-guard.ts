import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Har bir admin amali (server action / API) boshida chaqiriladi — middleware'ga qoʻshimcha himoya */
export async function isAdmin() {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Ruxsat yoʻq: qayta kiring.");
}
