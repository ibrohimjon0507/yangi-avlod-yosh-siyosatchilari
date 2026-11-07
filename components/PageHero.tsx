import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { href?: string; label: string };

export default function PageHero({ kicker, title, lead, crumbs }: { kicker?: string; title: ReactNode; lead?: ReactNode; crumbs: Crumb[] }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <nav aria-label="Navigatsiya zanjiri">
          <ol className="crumbs">
            <li>
              <Link href="/">Bosh sahifa</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
        {kicker && <span className="kicker">{kicker}</span>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        <span className="rule" aria-hidden="true" />
      </div>
    </section>
  );
}
