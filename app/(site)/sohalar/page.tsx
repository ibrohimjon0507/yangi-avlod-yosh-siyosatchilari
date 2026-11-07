import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { ArrowRight, FieldGlyph } from "@/components/Icons";
import { FIELDS } from "@/lib/data";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Sohalar", description: "Yosh siyosatchilarning asosiy faoliyat yoʻnalishlari." };

export default async function FieldsPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "Sohalar" }]} kicker="Faoliyat yoʻnalishlari" title="Sohalar" lead="Yosh siyosatchilarning asosiy faoliyat yoʻnalishlari. Sohani tanlang — shu yoʻnalishdagi yosh siyosatchilar roʻyxati ochiladi." />
      <div className="wrap page">
        <div className="fields-page">
          {FIELDS.map((f) => {
            const n = c.people.filter((p) => p.field === f.slug).length;
            return (
              <Link key={f.slug} href={`/yosh-siyosatchilar?soha=${f.slug}`} className="field-card">
                <span className="fi">
                  <FieldGlyph icon={f.icon} />
                </span>
                <h3>{f.name}</h3>
                <p>{n > 0 ? `${n} nafar yosh siyosatchi` : "Roʻyxat shakllantirilmoqda"}</p>
                <span className="go">
                  Roʻyxatni koʻrish <ArrowRight />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
