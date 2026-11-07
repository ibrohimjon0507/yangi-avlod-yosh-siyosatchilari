import Link from "next/link";
import { NAV, SITE } from "@/lib/data";
import { Emblem, Mail, SocialIcon } from "./Icons";

type Social = { name: string; icon: string; href: string };

export default function Footer({ email, socials }: { email: string; socials: readonly Social[] }) {
  return (
    <footer className="site">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Yangi Avlod — bosh sahifa">
          <Emblem gradientId="lg-f" />
          <span>
            <b>YANGI AVLOD</b>
            <small>YOSH SIYOSATCHILAR</small>
          </span>
        </Link>
        <nav aria-label="Pastki menyu">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="foot-right">
          {email && (
            <div className="mail">
              <b>Biz bilan bogʻlaning</b>
              <span>
                <Mail />
                {email}
              </span>
            </div>
          )}
          <div className="social">
            {(socials.length ? socials : [{ name: "Telegram", icon: "telegram", href: "" }, { name: "Instagram", icon: "instagram", href: "" }, { name: "YouTube", icon: "youtube", href: "" }, { name: "Facebook", icon: "facebook", href: "" }]).map((s) =>
              s.href ? (
                <a key={s.name} href={s.href} aria-label={s.name} target="_blank" rel="noopener noreferrer">
                  <SocialIcon name={s.icon} />
                </a>
              ) : (
                <span key={s.name} className="soc-off" aria-hidden="true" title={`${s.name} — havola hali kiritilmagan`}>
                  <SocialIcon name={s.icon} />
                </span>
              ),
            )}
          </div>
          <div className="om" aria-label={SITE.partner}>
            <svg viewBox="0 0 72 20" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
              <path d="M2 19h68M6 17h60M8 7h56v10M5 7l31-5 31 5M36 2V0" />
              <path d="M13 8v9M19 8v9M25 8v9M31 8v9M41 8v9M47 8v9M53 8v9M59 8v9" />
            </svg>
            <span>
              Oliy Majlis Qonunchilik palatasi
              <br />
              Matbuot xizmati
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
