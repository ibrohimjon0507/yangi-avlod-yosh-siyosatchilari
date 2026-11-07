"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL, authConfigured, checkPassword, createSessionToken } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-guard";
import { restoreVersion, saveContent } from "@/lib/store";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!authConfigured()) return { error: "Admin paroli oʻrnatilmagan (ADMIN_PASSWORD)." };
  const password = String(form.get("password") ?? "");
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 700)); // parol tanlashni sekinlashtirish
    return { error: "Parol notoʻgʻri." };
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function saveAction(content: unknown) {
  await requireAdmin();
  try {
    return await saveContent(content);
  } catch (e) {
    console.error("[admin] saqlashda xato:", e);
    return { ok: false as const, error: "Saqlashda kutilmagan xato yuz berdi. Qayta urinib koʻring." };
  }
}

export async function restoreAction(url: string) {
  await requireAdmin();
  try {
    return await restoreVersion(url);
  } catch (e) {
    console.error("[admin] tiklashda xato:", e);
    return { ok: false as const, error: "Versiyani tiklab boʻlmadi." };
  }
}
