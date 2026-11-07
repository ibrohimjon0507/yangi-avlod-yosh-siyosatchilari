import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { RegionsFull } from "@/components/UzMap";
import { regionsOf } from "@/lib/content";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Hududlar xaritasi", description: "Butun Oʻzbekiston boʻylab yosh siyosatchilar — 14 hudud." };

export default async function RegionsPage() {
  const c = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "Hududlar" }]} kicker="14 hudud" title="Hududlar xaritasi" lead="Butun Oʻzbekiston boʻylab yosh siyosatchilar. Xaritadagi yoki roʻyxatdagi hududni tanlang." />
      <div className="wrap page">
        <RegionsFull regions={regionsOf(c)} />
      </div>
    </>
  );
}
