import Image from "next/image";
import Link from "next/link";
import { FIELDS } from "@/lib/data";
import { DEFAULT_HERO_IMAGE, regionsOf, type SiteContent } from "@/lib/content";
import { getContent } from "@/lib/store";
import { COUNTRY_OUTLINE } from "@/lib/uzmap";
import { ArrowRight, Chevron, FieldGlyph, Play, QuoteMark, StatIcon } from "@/components/Icons";
import IdeaCard from "@/components/IdeaCard";
import PeopleSection from "@/components/home/PeopleSection";
import { HomeRegions } from "@/components/UzMap";

function Hero({ c }: { c: SiteContent }) {
  const h = c.hero;
  const desktop = h.image || DEFAULT_HERO_IMAGE;
  return (
    <section className="hero" aria-labelledby="h-hero">
      <Image className={`hero-bg${h.imageMobile ? " hero-bg-d" : ""}`} src={desktop} alt="" fill priority quality={85} sizes="100vw" />
      {h.imageMobile && <Image className="hero-bg hero-bg-m" src={h.imageMobile} alt="" fill priority quality={85} sizes="100vw" />}
      <div className="wrap">
        <div className="hero-text">
          {h.eyebrow && <p className="eyebrow">{h.eyebrow}</p>}
          <h1 id="h-hero">{h.title}</h1>
          {h.subtitle && <p className="sub">{h.subtitle}</p>}
          {h.motto.length > 0 && (
            <p className="values">
              {h.motto.map((m, i) => (
                <span key={i}>
                  {i > 0 && <i aria-hidden="true">•</i>}
                  {m}
                </span>
              ))}
            </p>
          )}
          <div className="cta">
            <Link className="btn btn-primary" href={h.primaryHref}>
              {h.primaryLabel} <ArrowRight className="arrow" />
            </Link>
            {h.secondaryLabel && (
              <Link className="btn btn-ghost" href={h.secondaryHref}>
                {h.secondaryLabel} <Play className="play" />
              </Link>
            )}
          </div>
        </div>
        <blockquote className="hero-quote">
          {c.site.quoteText}”<cite>{c.site.quoteAuthor}</cite>
        </blockquote>
      </div>
    </section>
  );
}

const STAT_ICONS = ["people", "layers", "bulb", "map"];

function Stats({ c }: { c: SiteContent }) {
  return (
    <div className="stats">
      <div className="wrap">
        <div className="stats-card">
          {c.stats.map((s, i) => (
            <div className="stat" key={i}>
              <StatIcon name={STAT_ICONS[i]} outline={COUNTRY_OUTLINE} />
              <div className="num">
                {s.value}
                {s.suffix ? <sup>{s.suffix}</sup> : null}
              </div>
              <div className="lbl">
                <b>{s.label}</b>
                <span>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecHead({ id, title, sub, href, more, inline = false }: { id: string; title: string; sub: string; href: string; more: string; inline?: boolean }) {
  const link = (
    <Link className="more" href={href}>
      {more} <ArrowRight />
    </Link>
  );
  return (
    <div className="sec-head">
      <div>
        {inline ? (
          <div className="ttl">
            <h2 id={id}>{title}</h2>
            {link}
          </div>
        ) : (
          <h2 id={id}>{title}</h2>
        )}
        <p>{sub}</p>
      </div>
      {!inline && link}
    </div>
  );
}

export default async function HomePage() {
  const c = await getContent();
  const regions = regionsOf(c);
  return (
    <>
      <Hero c={c} />
      <Stats c={c} />

      <PeopleSection people={c.people} regions={regions} />

      <div className="wrap row grid-2">
        <section id="sohalar" aria-labelledby="h-fields">
          <SecHead id="h-fields" title="Sohalar" sub="Yosh siyosatchilarning asosiy faoliyat yoʻnalishlari" href="/sohalar" more="Barcha sohalar" inline />
          <div className="fields">
            {FIELDS.map((f) => (
              <Link key={f.slug} className="field-tile" href={`/yosh-siyosatchilar?soha=${f.slug}`}>
                <FieldGlyph icon={f.icon} />
                <span>{f.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="g-oyalar-2030" aria-labelledby="h-ideas">
          <SecHead id="h-ideas" title="2030 — Mening Oʻzbekistonim" sub="Yosh siyosatchilarning kelajak haqidagi gʻoyalari" href="/2030" more="Barcha gʻoyalar" />
          <div className="ideas">
            {c.ideas.slice(0, 3).map((idea) => (
              <IdeaCard key={idea.author} idea={idea} />
            ))}
          </div>
        </section>
      </div>

      <div className="wrap row grid-2">
        <section id="tashabbuslar" aria-labelledby="h-inits">
          <SecHead id="h-inits" title="Tashabbuslar banki" sub="Yosh siyosatchilar tomonidan ilgari surilayotgan amaliy loyihalar" href="/tashabbuslar" more="Barcha tashabbuslar" />
          <div className="inits">
            {c.initiatives.slice(0, 3).map((it) => (
              <Link key={it.slug} className="init" href={`/tashabbuslar/${it.slug}`}>
                <Image src={it.image || "/images/placeholder-person.svg"} alt="" width={240} height={232} sizes="(max-width: 980px) 30vw, 8vw" />
                <div className="body">
                  <span className={`chip${it.tone === "green" ? " green" : ""}`}>{it.tag}</span>
                  <h3>{it.title}</h3>
                  <p>{it.summary}</p>
                </div>
                <span className="circle-arrow" aria-hidden="true">
                  <Chevron />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="hududlar" aria-labelledby="h-regions">
          <SecHead id="h-regions" title="Hududlar xaritasi" sub="Butun Oʻzbekiston boʻylab yosh siyosatchilar" href="/hududlar" more="Barcha hududlar" />
          <HomeRegions regions={regions} />
        </section>
      </div>

      <section className="wrap row book-row" id="kitob" aria-labelledby="h-book">
        <div className="intro">
          <h2 id="h-book">Kitob</h2>
          <p className="lead">{c.book.lead}</p>
        </div>
        <div className="book-img">
          <Image src="/images/book.jpg" alt="“Yangi Avlod: Yosh siyosatchilar” albom-kitobi" width={1304} height={368} sizes="(max-width: 980px) 100vw, 26vw" />
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
            <em>
              Yosh siyos<span>atch</span>ilar
            </em>
          </h3>
          <p>{c.book.description}</p>
          <div className="btns">
            <Link className="btn btn-primary" href="/kitob">
              Kitobni koʻrish <ArrowRight className="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/kitob#batafsil">
              Batafsil
            </Link>
          </div>
        </div>
        <div className="book-quote">
          <div className="orn" aria-hidden="true" />
          <QuoteMark className="qm" />
          <svg className="bld" viewBox="0 0 160 80" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
            <path d="M4 79h152M10 75h140M14 71h132M18 34h124v37M14 34l66-16 66 16M80 18V4" />
            <path d="M26 37v34M38 37v34M50 37v34M62 37v34M74 37v34M86 37v34M98 37v34M110 37v34M122 37v34M134 37v34" />
          </svg>
          <p>
            {(() => {
              // Maketdagi qator boʻlinishini saqlash: "...katta" dan keyin yangi qator
              const q = c.book.quote;
              const i = q.indexOf(" katta ");
              return i > 0 ? (
                <>
                  “{q.slice(0, i + 6)}
                  <br />
                  {q.slice(i + 7)}”
                </>
              ) : (
                <>“{q}”</>
              );
            })()}
          </p>
          <hr />
        </div>
      </section>
    </>
  );
}
