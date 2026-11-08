/**
 * Kontent ombori (faqat serverda).
 *
 * Kontent Vercel Blob'da JSON fayl sifatida saqlanadi: har bir saqlash —
 * yangi fayl `content/<vaqt>.json`. Eng soʻnggisi amaldagi versiya hisoblanadi,
 * oldingilari tarix sifatida qoladi (oxirgi 30 tasi) va admin paneldan tiklanishi mumkin.
 *
 * BLOB_READ_WRITE_TOKEN boʻlmasa (masalan, lokal ishlab chiqishda) standart kontent ishlatiladi.
 */
import { del, list, put } from "@vercel/blob";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { ContentSchema, DEFAULT_CONTENT, migrate, type SiteContent } from "./content";

const PREFIX = "content/";
const KEEP = 30;
export const CONTENT_TAG = "site-content";

export const storeEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export type Version = { url: string; uploadedAt: string; size: number };

async function listVersions(): Promise<Version[]> {
  if (!storeEnabled()) return [];
  const out: Version[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const b of res.blobs) out.push({ url: b.url, uploadedAt: new Date(b.uploadedAt).toISOString(), size: b.size });
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
}

async function readVersion(url: string): Promise<SiteContent> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Kontent oʻqilmadi (${res.status})`);
  return migrate(await res.json());
}

async function loadLatest(): Promise<SiteContent> {
  if (!storeEnabled()) return DEFAULT_CONTENT;
  try {
    const [latest] = await listVersions();
    return latest ? await readVersion(latest.url) : DEFAULT_CONTENT;
  } catch (e) {
    console.error("[store] kontentni oʻqishda xato, standart kontent ishlatiladi:", e);
    return DEFAULT_CONTENT;
  }
}

/** Saytdagi barcha sahifalar uchun kontent (kesh bilan; saqlanganda yangilanadi) */
const cachedLatest = unstable_cache(loadLatest, ["site-content-v3"], { tags: [CONTENT_TAG], revalidate: 3600 });
// Keshda eski sxemadagi obyekt qolgan boʻlsa ham (yangi joylashdan keyin), har doim joriy sxemaga moslashtiriladi
export const getContent = async (): Promise<SiteContent> => migrate(await cachedLatest());

/** Admin panel uchun: keshsiz, eng soʻnggi holat */
export const getContentFresh = loadLatest;

export async function getVersions(): Promise<Version[]> {
  return (await listVersions()).slice(0, KEEP);
}

export async function saveContent(input: unknown): Promise<{ ok: true; savedAt: string } | { ok: false; error: string }> {
  if (!storeEnabled()) return { ok: false, error: "Ombor ulanmagan: BLOB_READ_WRITE_TOKEN topilmadi." };
  const parsed = ContentSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const where = first.path.length ? ` (${first.path.join(" › ")})` : "";
    return { ok: false, error: `${first.message}${where}` };
  }
  const savedAt = new Date().toISOString();
  await put(`${PREFIX}${savedAt.replace(/[:.]/g, "-")}.json`, JSON.stringify(parsed.data), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    cacheControlMaxAge: 31536000, // har bir versiya oʻzgarmas
  });
  // Eski versiyalarni tozalash
  const all = await listVersions();
  const old = all.slice(KEEP).map((v) => v.url);
  if (old.length) await del(old);
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: true, savedAt };
}

export async function restoreVersion(url: string) {
  const versions = await listVersions();
  if (!versions.some((v) => v.url === url)) return { ok: false as const, error: "Versiya topilmadi." };
  return saveContent(await readVersion(url));
}
