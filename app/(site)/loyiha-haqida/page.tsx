import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "@/components/Icons";
import { SITE } from "@/lib/data";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Loyiha haqida", description: SITE.description };

const VALUES = [
  { title: "Gʻoya", text: "Yoshlarning kelajak haqidagi tashabbus va takliflari." },
  { title: "Masʼuliyat", text: "Jamiyat va davlat oldidagi faol fuqarolik pozitsiyasi." },
  { title: "Kelajak", text: "Yangi Oʻzbekistonni birgalikda barpo etish." },
];

export default async function AboutPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "Loyiha haqida" }]} kicker={SITE.eyebrow} title="Loyiha haqida" lead={SITE.description} />
      <div className="wrap page">
        <div className="about">
          <div className="prose">
            <p>
              “Yangi Avlod — Yosh siyosatchilar” loyihasi Oʻzbekistonning turli hududlaridan boʻlgan faol, bilimli va tashabbuskor yoshlarni bir platformada jamlaydi. Platformada yosh siyosatchilar, ularning faoliyat sohalari, amaliy
              tashabbuslari va kelajak haqidagi gʻoyalari bilan tanishish mumkin.
            </p>
            <p>
              Loyiha doirasida {c.stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join(", ")} haqidagi maʼlumotlar jamlanadi. Shuningdek, yangi avlod yetakchilari haqidagi hikoyalar “Yangi Avlod: Yosh siyosatchilar” albom-kitobida toʻplangan.
            </p>
            <blockquote className="hero-quote" style={{ width: "auto", margin: "28px 0 0 22px", color: "var(--ink)", textShadow: "none" }}>
              {c.site.quoteText}”<cite>{c.site.quoteAuthor}</cite>
            </blockquote>
            <Link className="back" href="/yosh-siyosatchilar">
              Yosh siyosatchilar bilan tanishish <ArrowRight />
            </Link>
          </div>
          <div>
            <div className="values-grid">
              {VALUES.map((v, i) => (
                <div className="value" key={v.title}>
                  <span className="vn">0{i + 1}</span>
                  <b>{v.title}</b>
                  <span>{v.text}</span>
                </div>
              ))}
            </div>
            <div className="contact-card">
              <b>Biz bilan bogʻlaning</b>
              Taklif va murojaatlar uchun: <span className="em">{c.site.email}</span>
              <br />
              {SITE.partner}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
