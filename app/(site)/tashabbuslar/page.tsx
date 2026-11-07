import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "@/components/Icons";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Tashabbuslar banki", description: "Yosh siyosatchilar tomonidan ilgari surilayotgan amaliy loyihalar." };

export default async function InitiativesPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "Tashabbuslar" }]} kicker="Amaliy loyihalar" title="Tashabbuslar banki" lead="Yosh siyosatchilar tomonidan ilgari surilayotgan amaliy loyihalar." />
      <div className="wrap page">
        <div className="inits-page">
          {c.initiatives.map((it) => (
            <Link key={it.slug} href={`/tashabbuslar/${it.slug}`} className="init-card">
              <span className="im">
                <Image src={it.image || "/images/placeholder-person.svg"} alt="" width={640} height={360} sizes="(max-width: 640px) 100vw, 33vw" />
                <span className={`chip${it.tone === "green" ? " green" : ""}`}>{it.tag}</span>
              </span>
              <span className="bd">
                <h3>{it.title}</h3>
                <p>{it.summary}</p>
                <span className="go">
                  Batafsil <ArrowRight />
                </span>
              </span>
            </Link>
          ))}
        </div>
        {c.initiatives.length === 0 && <p className="note">Tashabbuslar tez orada joylashtiriladi.</p>}
      </div>
    </>
  );
}
