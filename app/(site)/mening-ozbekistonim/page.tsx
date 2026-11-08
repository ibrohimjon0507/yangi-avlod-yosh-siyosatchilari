import type { Metadata } from "next";
import IdeaCard from "@/components/IdeaCard";
import PageHero from "@/components/PageHero";
import PresidentQuotes from "@/components/PresidentQuotes";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Mening Oʻzbekistonim", description: "Yosh siyosatchilarning kelajak haqidagi gʻoyalari." };

export default async function IdeasPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "Mening Oʻzbekistonim" }]} kicker="Kelajak haqida" title="Mening Oʻzbekistonim" lead="Prezident fikrlari hamda yosh siyosatchilarning Oʻzbekiston kelajagi haqidagi gʻoyalari va orzulari." />
      <div className="wrap page">
        <PresidentQuotes president={c.president} />
        {c.ideas.length > 0 && <h2 className="sub-head">Yosh siyosatchilar gʻoyalari</h2>}
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
