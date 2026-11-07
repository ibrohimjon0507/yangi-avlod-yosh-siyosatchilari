import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Paragraphs from "@/components/Paragraphs";
import { ArrowLeft } from "@/components/Icons";
import { fieldBySlug, regionDef } from "@/lib/data";
import { getContent } from "@/lib/store";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getContent()).people.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).people.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.name, description: `${p.name} — ${fieldBySlug(p.field)?.name}, ${regionDef(p.region)?.name}.`, openGraph: p.photo ? { images: [p.photo] } : undefined };
}

export default async function PersonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.people.find((x) => x.slug === slug);
  if (!p) notFound();
  const field = fieldBySlug(p.field);
  const region = regionDef(p.region);
  return (
    <>
      <PageHero crumbs={[{ href: "/yosh-siyosatchilar", label: "Yosh siyosatchilar" }, { label: p.name }]} kicker={field?.name} title={p.name} />
      <div className="wrap page">
        <div className="profile">
          <div className="profile-photo">
            <Image src={p.photo || "/images/placeholder-person.svg"} alt={p.name} width={600} height={660} sizes="300px" priority />
          </div>
          <div>
            <dl className="facts">
              <div className="fact">
                <dt>Soha</dt>
                <dd>{field && <Link href={`/yosh-siyosatchilar?soha=${field.slug}`}>{field.name}</Link>}</dd>
              </div>
              <div className="fact">
                <dt>Hudud</dt>
                <dd>{region && <Link href={`/yosh-siyosatchilar?hudud=${region.slug}`}>{region.name}</Link>}</dd>
              </div>
            </dl>
            {p.bio ? <Paragraphs text={p.bio} /> : <p className="note">Tarjimai hol, faoliyat va tashabbuslar haqidagi maʼlumotlar tez orada joylashtiriladi.</p>}
            <Link className="back" href="/yosh-siyosatchilar">
              <ArrowLeft /> Barcha yosh siyosatchilar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
