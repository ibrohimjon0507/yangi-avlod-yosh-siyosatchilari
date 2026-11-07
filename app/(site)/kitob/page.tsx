import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { Doc, QuoteMark } from "@/components/Icons";
import { getContent } from "@/lib/store";

export const metadata: Metadata = { title: "Kitob", description: "“Yangi Avlod: Yosh siyosatchilar” albom-kitobi." };

export default async function BookPage() {
  const { book: BOOK } = await getContent();
  return (
    <>
      <PageHero crumbs={[{ label: "Kitob" }]} kicker="Albom-kitob" title="Yangi Avlod: Yosh siyosatchilar" lead={BOOK.lead} />
      <div className="wrap page">
        <div className="book-page" id="batafsil">
          <div className="book-img">
            <Image src="/images/book.jpg" alt="“Yangi Avlod: Yosh siyosatchilar” albom-kitobi" width={1304} height={368} sizes="(max-width: 980px) 100vw, 60vw" priority />
            <div className="ctitle" aria-hidden="true">
              YANGI
              <br />
              AVLOD
              <small>Yosh siyosatchilar</small>
            </div>
          </div>
          <div className="album">
            <small>Albom-kitob</small>
            <h3>
              YANGI AVLOD:
              <em>Yosh siyosatchilar</em>
            </h3>
            <p>{BOOK.description}</p>
            {BOOK.pdfUrl ? (
              <div className="btns">
                <a className="btn btn-primary" href={BOOK.pdfUrl} target="_blank" rel="noopener">
                  <Doc /> PDF koʻrinishida oʻqish
                </a>
              </div>
            ) : (
              <span className="soon">
                <Doc width={18} height={18} /> Kitobning elektron nusxasi tez orada joylashtiriladi.
              </span>
            )}
          </div>
        </div>
        <div className="book-page">
          <div className="book-quote">
            <div className="orn" aria-hidden="true" />
            <QuoteMark className="qm" />
            <p>“{BOOK.quote}”</p>
            <hr />
          </div>
        </div>
      </div>
    </>
  );
}
