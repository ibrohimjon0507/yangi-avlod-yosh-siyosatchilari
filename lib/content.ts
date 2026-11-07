/**
 * Tahrirlanadigan kontent: sxema (tekshiruv), standart qiymatlar va yordamchilar.
 * Bu fayl ham serverda, ham brauzerda (admin panel) ishlatiladi.
 */
import { z } from "zod";
import { FIELDS, REGION_DEFS, type RegionDef } from "./data";

const fieldSlugs = FIELDS.map((f) => f.slug) as [string, ...string[]];
const regionSlugs = REGION_DEFS.map((r) => r.slug) as [string, ...string[]];

const slug = z
  .string()
  .trim()
  .min(2, "Havola nomi kamida 2 belgi")
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Havola nomida faqat lotin kichik harflari, raqam va chiziqcha boʻlishi mumkin");
/** Rasm/fayl: saytdagi yoʻl (/images/...) yoki https manzil */
const asset = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || v.startsWith("https://"), "Fayl manzili notoʻgʻri");
const text = (max: number, min = 1, label = "Maydon") => z.string().trim().min(min, `${label} toʻldirilmagan`).max(max, `${label} juda uzun`);
const url = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Havola https:// bilan boshlanishi kerak");

export const PersonSchema = z.object({
  slug,
  name: text(80, 2, "Ism"),
  field: z.enum(fieldSlugs),
  region: z.enum(regionSlugs),
  photo: asset,
  /** Ixtiyoriy: oʻzingiz tayyorlagan toʻliq karta dizayni (kartani butunlay qoplaydi) */
  cardImage: asset,
  featured: z.boolean(),
  bio: z.string().trim().max(4000),
});

export const IdeaSchema = z.object({
  text: text(400, 5, "Gʻoya matni"),
  author: text(80, 2, "Muallif"),
  field: z.enum(fieldSlugs),
  avatar: asset,
});

export const InitiativeSchema = z.object({
  slug,
  title: text(140, 3, "Sarlavha"),
  summary: text(400, 5, "Qisqa tavsif"),
  body: z.string().trim().max(8000),
  field: z.enum(fieldSlugs),
  tag: text(40, 1, "Teg"),
  tone: z.enum(["blue", "green"]),
  image: asset,
});

export const RegionDataSchema = z.object({
  slug: z.enum(regionSlugs),
  count: z.number().int().min(0).max(100000).nullable(),
  image: asset,
});

/** Bosh sahifaning yuqori qismi (hero) — rasm, sarlavhalar, shiorlar va tugmalar */
const link = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v.startsWith("/") || v.startsWith("#") || /^https:\/\/[^\s]+$/.test(v), "Havola “/” yoki https:// bilan boshlanishi kerak");

export const HeroSchema = z.object({
  /** Kompyuter uchun fon rasmi (boʻsh boʻlsa — standart rasm) */
  image: asset,
  /** Telefon uchun alohida fon rasmi (ixtiyoriy) */
  imageMobile: asset,
  eyebrow: z.string().trim().max(80),
  title: text(40, 2, "Katta sarlavha"),
  subtitle: z.string().trim().max(60),
  motto: z.array(z.string().trim().min(1, "Shior boʻsh boʻlmasin").max(30, "Shior juda uzun")).max(5),
  primaryLabel: text(40, 2, "1-tugma matni"),
  primaryHref: link,
  secondaryLabel: z.string().trim().max(40),
  secondaryHref: link,
});

export const StatSchema = z.object({
  value: text(10, 1, "Qiymat"),
  suffix: z.string().trim().max(3),
  label: text(40, 1, "Nomi"),
  sub: z.string().trim().max(60),
});

export const ContentSchema = z
  .object({
    version: z.literal(1),
    site: z.object({
      email: z.string().trim().max(120),
      quoteText: text(300, 5, "Iqtibos"),
      quoteAuthor: text(80, 2, "Iqtibos muallifi"),
      telegram: url,
      instagram: url,
      youtube: url,
      facebook: url,
    }),
    hero: HeroSchema,
    stats: z.array(StatSchema).length(4),
    people: z.array(PersonSchema).max(1000),
    ideas: z.array(IdeaSchema).max(500),
    initiatives: z.array(InitiativeSchema).max(1000),
    regions: z.array(RegionDataSchema).length(REGION_DEFS.length),
    book: z.object({
      lead: text(200, 5, "Kitob — qisqa matn"),
      description: text(600, 5, "Kitob tavsifi"),
      quote: text(300, 5, "Kitob iqtibosi"),
      pdfUrl: asset,
    }),
  })
  .superRefine((c, ctx) => {
    const dup = (arr: string[]) => arr.find((s, i) => arr.indexOf(s) !== i);
    const p = dup(c.people.map((x) => x.slug));
    if (p) ctx.addIssue({ code: "custom", path: ["people"], message: `“${p}” havola nomi takrorlangan (yosh siyosatchilar)` });
    const i = dup(c.initiatives.map((x) => x.slug));
    if (i) ctx.addIssue({ code: "custom", path: ["initiatives"], message: `“${i}” havola nomi takrorlangan (tashabbuslar)` });
  });

export type SiteContent = z.infer<typeof ContentSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Idea = z.infer<typeof IdeaSchema>;
export type Initiative = z.infer<typeof InitiativeSchema>;
export type Stat = z.infer<typeof StatSchema>;
export type Hero = z.infer<typeof HeroSchema>;

/** Hero standart rasmi (public/images/hero.jpg, 2560 × 428 px) */
export const DEFAULT_HERO_IMAGE = "/images/hero.jpg";
export type Region = RegionDef & { count: number | null; image: string };

/** Birinchi ishga tushirish uchun standart kontent (maketdagi namunalar) */
export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  site: {
    email: "info@yangiavlod.uz",
    quoteText: "Faol, bilimli va tashabbuskor yoshlar — Yangi Oʻzbekistonning eng katta boyligi.",
    quoteAuthor: "Shavkat Mirziyoyev",
    telegram: "",
    instagram: "",
    youtube: "",
    facebook: "",
  },
  hero: {
    image: "",
    imageMobile: "",
    eyebrow: "Yangi Oʻzbekiston — Yangi avlod",
    title: "YANGI AVLOD",
    subtitle: "Yosh siyosatchilar",
    motto: ["Gʻoya", "Masʼuliyat", "Kelajak"],
    primaryLabel: "Shaxslarni koʻrish",
    primaryHref: "/yosh-siyosatchilar",
    secondaryLabel: "Loyiha haqida",
    secondaryHref: "/loyiha-haqida",
  },
  stats: [
    { value: "100", suffix: "", label: "yosh siyosatchi", sub: "Yangi avlod yetakchilari" },
    { value: "8", suffix: "", label: "yoʻnalish", sub: "Asosiy faoliyat sohalari" },
    { value: "100", suffix: "+", label: "tashabbus", sub: "Amaliy gʻoyalar va loyihalar" },
    { value: "14", suffix: "", label: "hudud", sub: "Butun Oʻzbekiston boʻylab" },
  ],
  people: [
    { slug: "jasur-bekmurodov", name: "Jasur Bekmurodov", field: "parlament-va-qonunchilik", region: "toshkent-shahri", photo: "/images/people/jasur-bekmurodov.jpg", featured: true, bio: "", cardImage: "" },
    { slug: "nilufar-abduqodirova", name: "Nilufar Abduqodirova", field: "talim-va-innovatsiya", region: "samarqand-viloyati", photo: "/images/people/nilufar-abduqodirova.jpg", featured: true, bio: "", cardImage: "" },
    { slug: "alisher-karimov", name: "Alisher Karimov", field: "davlat-boshqaruvi", region: "buxoro-viloyati", photo: "/images/people/alisher-karimov.jpg", featured: true, bio: "", cardImage: "" },
    { slug: "sevara-ismoilova", name: "Sevara Ismoilova", field: "ekologiya", region: "toshkent-viloyati", photo: "/images/people/sevara-ismoilova.jpg", featured: true, bio: "", cardImage: "" },
  ],
  ideas: [
    { text: "2030-yilga borib Oʻzbekiston Markaziy Osiyoda yoshlar imkoniyatlari boʻyicha eng yetakchi davlatga aylanadi.", author: "Javohir Rahimov", field: "diplomatiya", avatar: "/images/people/javohir-rahimov.jpg" },
    { text: "Har bir hududda yoshlar uchun teng imkoniyatlar — adolatli va farovon jamiyat asosi.", author: "Mohinur Karimova", field: "talim-va-innovatsiya", avatar: "/images/people/mohinur-karimova.jpg" },
    { text: "Yashil iqtisodiyot — kelajak avlodlarga qoldiradigan eng katta masʼuliyatimiz.", author: "Azizbek Tursunov", field: "ekologiya", avatar: "/images/people/azizbek-tursunov.jpg" },
  ],
  initiatives: [
    { slug: "raqamli-konikmalar-platformasi", title: "Yoshlar uchun raqamli koʻnikmalar platformasi", summary: "Hududlardagi yoshlar uchun zamonaviy kasblar boʻyicha bepul onlayn taʼlim imkoniyatlari.", body: "", field: "talim-va-innovatsiya", tag: "Taʼlim", tone: "blue", image: "/images/initiatives/raqamli-konikmalar.jpg" },
    { slug: "yashil-hududlar-toza-kelajak", title: "Yashil hududlar – Toza kelajak", summary: "Har bir tumanda 100 gektar yangi yashil hududlarni tashkil etish tashabbusi.", body: "", field: "ekologiya", tag: "Ekologiya", tone: "green", image: "/images/initiatives/yashil-hududlar.jpg" },
    { slug: "yoshlar-parlamenti-maktabi", title: "Yoshlar parlamenti maktabi", summary: "Yosh liderlar uchun amaliy siyosiy taʼlim va mentorlik dasturi.", body: "", field: "fuqarolik-jamiyati", tag: "Fuqarolik jamiyati", tone: "blue", image: "/images/initiatives/yoshlar-parlamenti-maktabi.jpg" },
  ],
  regions: REGION_DEFS.map((r) => ({
    slug: r.slug,
    count: ({ "toshkent-shahri": 12, "samarqand-viloyati": 8, "buxoro-viloyati": 7 } as Record<string, number>)[r.slug] ?? null,
    image: ({ "toshkent-shahri": "/images/regions/toshkent-shahri.jpg", "samarqand-viloyati": "/images/regions/samarqand.jpg", "buxoro-viloyati": "/images/regions/buxoro.jpg" } as Record<string, string>)[r.slug] ?? "",
  })),
  book: {
    lead: "Yangi avlod haqida ilhomlantiruvchi hikoyalar, gʻoyalar va tashabbuslar",
    description: "Oʻzbekistonning yangi avlod yetakchilari haqidagi ilhomlantiruvchi hikoyalar, gʻoyalar va tashabbuslar toʻplami.",
    quote: "Bu kitob — bugungi yoshlarning katta orzulari va amaliy ishlarining haqiqiy ifodasidir.",
    pdfUrl: "",
  },
};

/** Hudud roʻyxati: oʻzgarmas nom/ISO + tahrirlanadigan son/rasm */
export const regionsOf = (c: SiteContent): Region[] =>
  REGION_DEFS.map((d) => {
    const r = c.regions.find((x) => x.slug === d.slug);
    return { ...d, count: r?.count ?? null, image: r?.image ?? "" };
  });

export const socialsOf = (c: SiteContent) =>
  (
    [
      { name: "Telegram", icon: "telegram", href: c.site.telegram },
      { name: "Instagram", icon: "instagram", href: c.site.instagram },
      { name: "YouTube", icon: "youtube", href: c.site.youtube },
      { name: "Facebook", icon: "facebook", href: c.site.facebook },
    ] as const
  ).filter((s) => s.href);

/** Eski yoki qisman saqlangan kontentni joriy sxemaga moslashtirish */
export function migrate(raw: unknown): SiteContent {
  const r = (raw ?? {}) as Partial<SiteContent>;
  const merged = {
    ...DEFAULT_CONTENT,
    ...r,
    site: { ...DEFAULT_CONTENT.site, ...(r.site ?? {}) },
    hero: { ...DEFAULT_CONTENT.hero, ...(r.hero ?? {}) },
    book: { ...DEFAULT_CONTENT.book, ...(r.book ?? {}) },
    people: ((r.people ?? DEFAULT_CONTENT.people) as Partial<Person>[]).map((p) => ({ bio: "", featured: false, cardImage: "", ...p })),
    initiatives: ((r.initiatives ?? DEFAULT_CONTENT.initiatives) as Partial<Initiative>[]).map((i) => ({ body: "", ...i })),
    regions: REGION_DEFS.map((d) => {
      const x = (r.regions ?? DEFAULT_CONTENT.regions).find((y) => y.slug === d.slug);
      return { slug: d.slug, count: x?.count ?? null, image: x?.image ?? "" };
    }),
  };
  const parsed = ContentSchema.safeParse(merged);
  return parsed.success ? parsed.data : DEFAULT_CONTENT;
}
