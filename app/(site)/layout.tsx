import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { navOf, socialsOf } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search";
import { getContent } from "@/lib/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  return (
    <>
      <a className="skip-link" href="#content">
        Asosiy mazmunga oʻtish
      </a>
      <Header searchItems={buildSearchIndex(c)} nav={navOf(c)} />
      <main id="content">{children}</main>
      <Footer email={c.site.email} socials={socialsOf(c)} nav={navOf(c)} creatorName={c.site.creatorName} creatorUrl={c.site.creatorUrl} />
    </>
  );
}
