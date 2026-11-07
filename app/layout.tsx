import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/data";
import "./site.css";
import "./extra.css";

const serif = localFont({
  src: [
    { path: "./fonts/serif-display.woff2", weight: "400 800", style: "normal" },
    { path: "./fonts/serif-display-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "87.5% 100%" }],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: [{ path: "./fonts/sans.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s — ${SITE.shortName}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Oliy Majlis binosi — Yangi Avlod" }],
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description, images: ["/images/og.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#081022" },
  ],
};

/**
 * Rejimni sahifa chizilishidan oldin oʻrnatadi (miltillashsiz).
 * Standart — yorugʻ rejim (maket). Foydalanuvchi tanlovi localStorage'da saqlanadi.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark')t='light';var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" data-theme="light" suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
