/**
 * Saytning oʻzgarmas tuzilmasi: menyu, sohalar, hududlar roʻyxati.
 * Tahrirlanadigan kontent (yosh siyosatchilar, tashabbuslar va h.k.) — lib/content.ts
 * va admin panel (/admin) orqali boshqariladi.
 */

export type FieldIcon = "parl" | "gov" | "dip" | "eco" | "edu" | "civ" | "leaf";

export type Field = {
  slug: string;
  name: string;
  /** Kartochkada ikki qatorga boʻlish uchun (\n bilan) */
  label: string;
  icon: FieldIcon;
};

export type RegionDef = { slug: string; iso: string; name: string };

export const SITE = {
  name: "Yangi Avlod — Yosh siyosatchilar",
  shortName: "Yangi Avlod",
  description: "Yangi Oʻzbekistonni shakllantirayotgan faol va tashabbuskor yosh siyosatchilar haqida rasmiy platforma.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  motto: ["Gʻoya", "Masʼuliyat", "Kelajak"],
  eyebrow: "Yangi Oʻzbekiston — Yangi avlod",
  partner: "Oliy Majlis Qonunchilik palatasi Matbuot xizmati",
} as const;

export const NAV = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/yosh-siyosatchilar", label: "Yosh siyosatchilar" },
  { href: "/sohalar", label: "Sohalar" },
  { href: "/tashabbuslar", label: "Tashabbuslar" },
  { href: "/2030", label: "2030" },
  { href: "/hududlar", label: "Hududlar" },
  { href: "/kitob", label: "Kitob" },
  { href: "/loyiha-haqida", label: "Loyiha haqida" },
] as const;

export const FIELDS: Field[] = [
  { slug: "parlament-va-qonunchilik", name: "Parlament va qonunchilik", label: "Parlament va\nqonunchilik", icon: "parl" },
  { slug: "davlat-boshqaruvi", name: "Davlat boshqaruvi", label: "Davlat\nboshqaruvi", icon: "gov" },
  { slug: "diplomatiya", name: "Diplomatiya", label: "Diplomatiya", icon: "dip" },
  { slug: "iqtisodiyot", name: "Iqtisodiyot", label: "Iqtisodiyot", icon: "eco" },
  { slug: "talim-va-innovatsiya", name: "Taʼlim va innovatsiya", label: "Taʼlim va\ninnovatsiya", icon: "edu" },
  { slug: "fuqarolik-jamiyati", name: "Fuqarolik jamiyati", label: "Fuqarolik\njamiyati", icon: "civ" },
  { slug: "ekologiya", name: "Ekologiya", label: "Ekologiya", icon: "leaf" },
];

/** 14 hudud — tartib maketdagidek (birinchi uchtasi bosh sahifada) */
export const REGION_DEFS: RegionDef[] = [
  { slug: "toshkent-shahri", iso: "UZ-TK", name: "Toshkent shahri" },
  { slug: "samarqand-viloyati", iso: "UZ-SA", name: "Samarqand viloyati" },
  { slug: "buxoro-viloyati", iso: "UZ-BU", name: "Buxoro viloyati" },
  { slug: "toshkent-viloyati", iso: "UZ-TO", name: "Toshkent viloyati" },
  { slug: "andijon-viloyati", iso: "UZ-AN", name: "Andijon viloyati" },
  { slug: "fargona-viloyati", iso: "UZ-FA", name: "Fargʻona viloyati" },
  { slug: "namangan-viloyati", iso: "UZ-NG", name: "Namangan viloyati" },
  { slug: "jizzax-viloyati", iso: "UZ-JI", name: "Jizzax viloyati" },
  { slug: "sirdaryo-viloyati", iso: "UZ-SI", name: "Sirdaryo viloyati" },
  { slug: "qashqadaryo-viloyati", iso: "UZ-QA", name: "Qashqadaryo viloyati" },
  { slug: "surxondaryo-viloyati", iso: "UZ-SU", name: "Surxondaryo viloyati" },
  { slug: "navoiy-viloyati", iso: "UZ-NW", name: "Navoiy viloyati" },
  { slug: "xorazm-viloyati", iso: "UZ-XO", name: "Xorazm viloyati" },
  { slug: "qoraqalpogiston-respublikasi", iso: "UZ-QR", name: "Qoraqalpogʻiston Respublikasi" },
];

/** Alifbo tartibida (server va brauzerda bir xil natija beradigan oddiy taqqoslash) */
export const REGION_DEFS_ALPHA: RegionDef[] = [...REGION_DEFS].sort((a, b) => {
  const x = a.name.replace(/[ʻʼ']/g, ""),
    y = b.name.replace(/[ʻʼ']/g, "");
  return x < y ? -1 : x > y ? 1 : 0;
});

export const fieldBySlug = (slug: string) => FIELDS.find((f) => f.slug === slug);
export const regionDef = (slug: string) => REGION_DEFS.find((r) => r.slug === slug);

/** Oʻzbek apostroflarini hisobga olgan holda qidiruv uchun normallashtirish */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ʻʼ'‘’`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Lotin yozuvidagi matndan URL uchun qisqa nom (slug) yasash */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ʻʼ'‘’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
