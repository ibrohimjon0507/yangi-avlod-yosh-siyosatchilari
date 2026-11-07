import type { Metadata } from "next";
import IdeaCard from "@/components/IdeaCard";
import PageHero from "@/components/PageHero";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "2030 — Mening Oʻzbekistonim", description: "Yosh siyosatchilarning kelajak haqidagi gʻoyalari." };

export default async function IdeasPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "2030" }]} kicker="Kelajak haqida" title="2030 — Mening Oʻzbekistonim" lead="Yosh siyosatchilarning 2030-yilgacha boʻlgan Oʻzbekiston haqidagi gʻoyalari va orzulari." />
      <div className="wrap page">
        <div className="ideas-page">
          {c.ideas.map((i, k) => (
            <IdeaCard key={`${i.author}-${k}`} idea={i} />
          ))}
        </div>
        {c.ideas.length === 0 && <p className="note">Gʻoyalar tez orada joylashtiriladi.</p>}
      </div>
    </>
  );
}
