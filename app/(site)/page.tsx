import Image from "next/image";
import Link from "next/link";
import { FIELDS, fieldBySlug } from "@/lib/data";
import { DEFAULT_HERO_IMAGE, regionsOf, type SiteContent } from "@/lib/content";
import { getContent } from "@/lib/store";
import { COUNTRY_OUTLINE } from "@/lib/uzmap";
import { ArrowRight, FieldGlyph, Play, QuoteMark, StatIcon } from "@/components/Icons";
import PresidentQuotes from "@/components/PresidentQuotes";
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

function Initiatives({ c }: { c: SiteContent }) {
  const [lead, ...rest] = c.initiatives.slice(0, 3);
  if (!lead) return null;
  const chip = (tone: string, tag: string) => <span className={`chip${tone === "green" ? " green" : ""}`}>{tag}</span>;
  return (
    <section className="wrap row" id="tashabbuslar" aria-labelledby="h-inits">
      <SecHead id="h-inits" title="Tashabbuslar banki" sub="Yosh siyosatchilar tomonidan ilgari surilayotgan amaliy loyihalar" href="/tashabbuslar" more="Barcha tashabbuslar" />
      <div className={`ib${rest.length ? "" : " solo"}`}>
        <Link className="ib-lead" href={`/tashabbuslar/${lead.slug}`}>
          <span className="ib-lead-img">
            <Image src={lead.image || "/images/pattern.jpg"} alt="" fill sizes="(max-width: 980px) 100vw, 30vw" />
            <span className="ib-badge">Tanlangan tashabbus</span>
          </span>
          <div className="ib-lead-body">
            <div className="ib-meta">
              {chip(lead.tone, lead.tag)}
              <span>{fieldBySlug(lead.field)?.name}</span>
            </div>
            <h3>{lead.title}</h3>
            <p>{lead.summary}</p>
            <span className="ib-go">
              Batafsil <ArrowRight />
            </span>
          </div>
        </Link>
        {rest.length > 0 && (
          <div className="ib-side">
            {rest.map((it, k) => (
              <Link key={it.slug} className="ib-card" href={`/tashabbuslar/${it.slug}`}>
                <span className="ib-img">
                  <Image src={it.image || "/images/pattern.jpg"} alt="" fill sizes="(max-width: 640px) 40vw, 16vw" />
                </span>
                <div className="ib-body">
                  <span className="ib-num" aria-hidden="true">
                    {String(k + 2).padStart(2, "0")}
                  </span>
                  {chip(it.tone, it.tag)}
                  <h3>{it.title}</h3>
                  <p>{it.summary}</p>
                  <span className="ib-go">
                    Batafsil <ArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Book({ c }: { c: SiteContent }) {
  const q = c.book.quote;
  return (
    <section className="wrap row" id="kitob" aria-labelledby="h-book">
      <SecHead id="h-book" title="Kitob" sub={c.book.lead} href="/kitob" more="Kitob sahifasi" />
      <div className="bk">
        <div className="bk-stage">
          <div className="book-img">
            <Image src="/images/book.jpg" alt="“Yangi Avlod: Yosh siyosatchilar” albom-kitobi" width={1304} height={368} sizes="(max-width: 980px) 100vw, 50vw" />
            <div className="ctitle" aria-hidden="true">
              YANGI
              <br />
              AVLOD
              <small>Yosh siyosatchilar</small>
            </div>
          </div>
        </div>
        <div className="bk-text">
          <small className="bk-kicker">Albom-kitob</small>
          <h3>
            YANGI AVLOD:
            <em>
              Yosh siyos<span>atch</span>ilar
            </em>
          </h3>
          <p>{c.book.description}</p>
          <blockquote className="bk-quote">
            <QuoteMark className="qm" />“{q}”
          </blockquote>
          <div className="btns">
            <Link className="btn btn-primary" href="/kitob">
              Kitobni koʻrish <ArrowRight className="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/kitob#batafsil">
              Batafsil
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const c = await getContent();
  const regions = regionsOf(c);
  return (
    <>
      <Hero c={c} />
      <Stats c={c} />

      <section className="wrap row" id="sohalar" aria-labelledby="h-fields">
        <SecHead id="h-fields" title="Sohalar" sub="Yosh siyosatchilarning asosiy faoliyat yoʻnalishlari" href="/sohalar" more="Barcha sohalar" inline />
        <div className="fields fields-wide">
          {FIELDS.map((f) => (
            <Link key={f.slug} className="field-tile" href={`/yosh-siyosatchilar?soha=${f.slug}`}>
              <FieldGlyph icon={f.icon} />
              <span>{f.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap row" id="mening-ozbekistonim" aria-labelledby="h-ideas">
        <SecHead id="h-ideas" title="Mening Oʻzbekistonim" sub="Davlat rahbarining fikrlari va yosh siyosatchilarning kelajak haqidagi gʻoyalari" href="/mening-ozbekistonim" more="Barcha gʻoyalar" />
        <PresidentQuotes president={c.president} />
        {c.ideas.length > 0 && (
          <>
            <h3 className="sub-head">Yosh siyosatchilar gʻoyalari</h3>
            <div className="ideas ideas-wide">
              {c.ideas.slice(0, 3).map((idea, k) => (
                <IdeaCard key={`${idea.author}-${k}`} idea={idea} />
              ))}
            </div>
          </>
        )}
      </section>

      <PeopleSection people={c.people} regions={regions} />

      <Initiatives c={c} />

      {c.sections.map && (
        <section className="row regions-band" id="hududlar" aria-labelledby="h-regions">
          <div className="wrap">
            <SecHead id="h-regions" title="Hududlar xaritasi" sub="Butun Oʻzbekiston boʻylab yosh siyosatchilar" href="/hududlar" more="Barcha hududlar" />
            <HomeRegions regions={regions} />
          </div>
        </section>
      )}

      {c.sections.book && <Book c={c} />}
    </>
  );
}
