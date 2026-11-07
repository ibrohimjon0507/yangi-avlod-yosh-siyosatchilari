import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PeopleExplorer from "@/components/PeopleExplorer";
import { FIELDS, REGION_DEFS } from "@/lib/data";
import { regionsOf } from "@/lib/content";
import { getContent } from "@/lib/store";

export const metadata: Metadata = {
  title: "Yosh siyosatchilar",
  description: "Yangi Oʻzbekistonni shakllantirayotgan faol va tashabbuskor yosh siyosatchilar roʻyxati.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function PeoplePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const soha = FIELDS.some((f) => f.slug === one(sp.soha)) ? one(sp.soha) : "";
  const hudud = REGION_DEFS.some((r) => r.slug === one(sp.hudud)) ? one(sp.hudud) : "";
  const c = await getContent();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Yosh siyosatchilar" }]}
        kicker="Yangi avlod yetakchilari"
        title="Yosh siyosatchilar"
        lead="Yangi Oʻzbekistonni shakllantirayotgan faol va tashabbuskor yoshlar. Soha, hudud yoki ism boʻyicha saralang."
      />
      <div className="wrap page">
        <PeopleExplorer people={c.people} regions={regionsOf(c)} initial={{ soha, hudud, q: one(sp.q).slice(0, 80) }} />
      </div>
    </>
  );
}
