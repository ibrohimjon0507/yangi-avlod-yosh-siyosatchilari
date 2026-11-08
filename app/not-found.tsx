import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "@/components/Icons";
import { navOf, socialsOf } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search";
import { getContent } from "@/lib/store";

export default async function NotFound() {
  const c = await getContent();
  return (
    <>
      <Header searchItems={buildSearchIndex(c)} nav={navOf(c)} />
      <main id="content" className="nf">
        <div>
          <div className="code" aria-hidden="true">404</div>
          <h1>Sahifa topilmadi</h1>
          <p>Siz qidirgan sahifa mavjud emas yoki boshqa manzilga koʻchirilgan.</p>
          <Link className="btn btn-primary" href="/">
            <ArrowLeft /> Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
      <Footer email={c.site.email} socials={socialsOf(c)} nav={navOf(c)} creatorName={c.site.creatorName} creatorUrl={c.site.creatorUrl} />
    </>
  );
}
