# Yangi Avlod — Yosh siyosatchilar

Rasmiy veb-sayt. Next.js 15 (App Router) + React 19 + TypeScript.
Yorugʻ rejim maket bilan 1:1, tungi rejim — alohida ishlangan kechki dizayn.

## Ishga tushirish

```bash
npm install
npm run dev          # http://localhost:3000
```

## Admin panel

Manzil: **`/admin`** — parol bilan kiriladi.

Paneldan boshqariladi: yosh siyosatchilar (surat, soha, hudud, tarjimai hol, bosh sahifada koʻrsatish),
tashabbuslar, Prezident fikrlari, “Mening Oʻzbekistonim” gʻoyalari, boʻlimlarni yashirish (xarita, kitob), sayt yaratuvchisi, hududlardagi sonlar va rasmlar, statistika, kitob (PDF bilan),
email, ijtimoiy tarmoqlar va bosh sahifadagi iqtibos.

- Maʼlumotlar **Vercel Blob** omborida JSON koʻrinishida saqlanadi, rasmlar va PDF ham shu yerda.
- Har bir saqlash — alohida versiya. Oxirgi 30 tasi “Saqlash tarixi” boʻlimida, istalganini tiklash mumkin.
- Saqlangandan keyin sayt bir necha soniyada yangilanadi (qayta joylash shart emas).
- Ombor ulanmagan boʻlsa sayt `lib/content.ts` dagi standart kontent bilan ishlaydi.

### Muhit oʻzgaruvchilari

| Nomi | Vazifasi |
|---|---|
| `ADMIN_PASSWORD` | Admin paneliga kirish paroli |
| `SESSION_SECRET` | Sessiya cookie imzosi uchun maxfiy kalit |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob ombori (omborni loyihaga ulaganda avtomatik qoʻshiladi) |
| `NEXT_PUBLIC_SITE_URL` | Saytning asosiy domeni, masalan `https://yangiavlod.uz` |

Parolni almashtirish: Vercel → loyiha → **Settings → Environment Variables** → `ADMIN_PASSWORD` → tahrirlash,
soʻng **Deployments → Redeploy**.

## Vercel'ga joylash

Loyiha GitHub bilan bogʻlangan: `main` tarmogʻiga har bir push avtomatik joylanadi.
Yangi Vercel loyihasida: Storage → Blob omborini yarating va loyihaga ulang, keyin yuqoridagi
oʻzgaruvchilarni qoʻshing.

## Oʻz serveringizda (DigitalOcean droplet)

Node.js 20.9+ kerak. Admin panel ishlashi uchun Vercel Blob tokeni (`BLOB_READ_WRITE_TOKEN`) shu yerda ham kerak.

```bash
npm ci
npm run build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
PORT=3000 node .next/standalone/server.js
```

## Tuzilma

```
app/
  layout.tsx            umumiy qobiq, shriftlar, rejim skripti, SEO
  page.tsx              bosh sahifa (maket 1:1)
  site.css              maketga moslangan asosiy stillar + rejim tokenlari
  extra.css             tungi rejim tafsilotlari, ichki sahifalar
  yosh-siyosatchilar/   roʻyxat (URL filtrlari: ?soha= &hudud= &q=) va profil
  sohalar/ tashabbuslar/ mening-ozbekistonim/ hududlar/ kitob/ loyiha-haqida/
  fonts/                Noto Serif Display, Noto Sans (oʻz serverimizda, woff2)
components/             Header, Footer, qidiruv (Ctrl+K), xarita, kartochkalar
lib/content.ts          kontent sxemasi va standart qiymatlar
lib/store.ts            Vercel Blob ombori (oʻqish, saqlash, tarix)
lib/auth.ts             admin sessiyasi (imzolangan cookie)
app/admin/              admin panel
lib/data.ts             menyu, sohalar, hududlar
lib/uzmap.ts            Oʻzbekiston hududlari chegaralari (Natural Earth, public domain)
```

## Imkoniyatlar

- Yorugʻ / tungi rejim (tanlov saqlanadi, sahifa yuklanishida miltillamaydi)
- Sayt boʻyicha qidiruv: `Ctrl + K` yoki lupa tugmasi
- Interaktiv xarita: hudud bosilsa, shu hududdagi yosh siyosatchilar roʻyxati ochiladi
- Roʻyxat filtrlari URL bilan sinxron — natijani havola orqali ulashish mumkin
- Moslashuvchan: kompyuter, planshet, telefon
- SEO: metadata, Open Graph rasmi, `sitemap.xml`, `robots.txt`
- Xavfsizlik sarlavhalari (`next.config.ts`)
- Shriftlar oʻz serverimizda — tashqi xizmatga bogʻliq emas

## Masshtab haqida

Maketga 1:1 moslik uchun oʻlchamlar ekran kengligiga proporsional (`--u = 100vw / 1280`).
~1660 px va kengroq ekranlarda maket aynan takrorlanadi; tor ekranlarda mayda matnlar
oʻqiladigan minimal oʻlchamdan kichraymaydi.
