import { FIELDS, NAV, type FieldIcon, fieldBySlug } from "./data";
import { regionsOf, type SiteContent } from "./content";

export type SearchItem = {
  key: string;
  group: string;
  title: string;
  sub: string;
  href: string;
  img?: string;
  kind: "person" | "field" | "initiative" | "region" | "page";
  icon?: FieldIcon;
};

export function buildSearchIndex(c: SiteContent): SearchItem[] {
  const regions = regionsOf(c);
  const rName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "";
  return [
    ...c.people.map((p) => ({ key: `p-${p.slug}`, group: "Yosh siyosatchilar", title: p.name, sub: `${fieldBySlug(p.field)?.name ?? ""} · ${rName(p.region)}`, href: `/yosh-siyosatchilar/${p.slug}`, img: p.photo || undefined, kind: "person" as const })),
    ...FIELDS.map((f) => ({ key: `f-${f.slug}`, group: "Sohalar", title: f.name, sub: "Shu sohadagi yosh siyosatchilar", href: `/yosh-siyosatchilar?soha=${f.slug}`, kind: "field" as const, icon: f.icon })),
    ...c.initiatives.map((i) => ({ key: `i-${i.slug}`, group: "Tashabbuslar", title: i.title, sub: i.tag, href: `/tashabbuslar/${i.slug}`, img: i.image || undefined, kind: "initiative" as const })),
    ...regions.map((r) => ({ key: `r-${r.slug}`, group: "Hududlar", title: r.name, sub: r.count != null ? `${r.count} nafar yosh siyosatchi` : "Hudud boʻyicha roʻyxat", href: `/yosh-siyosatchilar?hudud=${r.slug}`, kind: "region" as const })),
    ...NAV.filter((n) => n.href !== "/").map((n) => ({ key: `n-${n.href}`, group: "Sahifalar", title: n.label, sub: n.href, href: n.href, kind: "page" as const })),
  ];
}
