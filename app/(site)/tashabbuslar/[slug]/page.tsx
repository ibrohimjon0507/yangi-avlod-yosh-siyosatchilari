import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Paragraphs from "@/components/Paragraphs";
import { ArrowLeft } from "@/components/Icons";
import { fieldBySlug } from "@/lib/data";
import { getContent } from "@/lib/store";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getContent()).initiatives.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const it = (await getContent()).initiatives.find((i) => i.slug === slug);
  return it ? { title: it.title, description: it.summary, openGraph: it.image ? { images: [it.image] } : undefined } : {};
}

export default async function InitiativePage({ params }: { params: Params }) {
  const { slug } = await params;
  const it = (await getContent()).initiatives.find((i) => i.slug === slug);
  if (!it) notFound();
  const field = fieldBySlug(it.field);
  return (
    <>
      <PageHero crumbs={[{ href: "/tashabbuslar", label: "Tashabbuslar" }, { label: it.title }]} kicker={it.tag} title={it.title} />
      <div className="wrap page">
        <article className="article">
          <div className="article-img">
            <Image src={it.image || "/images/placeholder-person.svg"} alt="" width={1200} height={750} sizes="(max-width: 980px) 100vw, 55vw" priority />
          </div>
          <div>
            <span className={`chip${it.tone === "green" ? " green" : ""}`}>{it.tag}</span>
            <p className="lead2">{it.summary}</p>
            {field && (
              <dl className="facts">
                <div className="fact">
                  <dt>Soha</dt>
                  <dd>
                    <Link href={`/yosh-siyosatchilar?soha=${field.slug}`}>{field.name}</Link>
                  </dd>
                </div>
              </dl>
            )}
            {it.body ? <Paragraphs text={it.body} /> : <p className="note">Tashabbusning maqsadi, bosqichlari va natijalari haqidagi batafsil maʼlumot tez orada joylashtiriladi.</p>}
            <Link className="back" href="/tashabbuslar">
              <ArrowLeft /> Barcha tashabbuslar
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
