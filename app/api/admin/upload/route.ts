import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-guard";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];

/** Admin paneldan rasm/PDF yuklash uchun vaqtinchalik token beradi (fayl brauzerdan toʻgʻridan-toʻgʻri Blob'ga yuklanadi) */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Ruxsat yoʻq");
        if (!pathname.startsWith("uploads/")) throw new Error("Notoʻgʻri yoʻl");
        return { allowedContentTypes: ALLOWED, maximumSizeInBytes: 30 * 1024 * 1024, addRandomSuffix: true };
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Yuklashda xato" }, { status: 400 });
  }
}
