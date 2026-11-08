import type { MetadataRoute } from "next";
import { SITE } from "@/lib/data";
import { navOf } from "@/lib/content";
import { getContent } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const now = new Date();
  return [
    ...navOf(c).map((n) => ({ url: `${SITE.url}${n.href === "/" ? "" : n.href}`, lastModified: now })),
    ...c.people.map((p) => ({ url: `${SITE.url}/yosh-siyosatchilar/${p.slug}`, lastModified: now })),
    ...c.initiatives.map((i) => ({ url: `${SITE.url}/tashabbuslar/${i.slug}`, lastModified: now })),
  ];
}
