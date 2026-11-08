import type { SiteContent } from "@/lib/content";
import { QuoteMark } from "./Icons";

/** “Mening Oʻzbekistonim”: Davlat rahbarining yoshlar haqidagi fikrlari (admin paneldan tahrirlanadi) */
export default function PresidentQuotes({ president }: { president: SiteContent["president"] }) {
  const [main, ...rest] = president.quotes;
  if (!main) return null;
  return (
    <div className={`pres${rest.length ? "" : " solo"}`}>
      <figure className="pres-main">
        <span className="pres-kicker">Prezident fikrlari</span>
        <QuoteMark className="pres-qm" />
        <blockquote>{main.text}</blockquote>
        <figcaption>
          <b>{president.name}</b>
          {president.title && <span>{president.title}</span>}
          {main.source && <small>{main.source}</small>}
        </figcaption>
      </figure>
      {rest.length > 0 && (
        <ul className="pres-list">
          {rest.map((q, i) => (
            <li key={i}>
              <blockquote>“{q.text}”</blockquote>
              {q.source && <small>{q.source}</small>}
            </li>
          ))}
        </ul>
      )}
      <span className="pres-bld" aria-hidden="true" />
    </div>
  );
}
