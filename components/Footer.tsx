import Link from "next/link";
import { Mail, SocialIcon } from "./Icons";
import BrandMark from "./BrandMark";

type Social = { name: string; icon: string; href: string };
type NavItem = { href: string; label: string };

export default function Footer({ email, socials, nav, creatorName, creatorUrl }: { email: string; socials: readonly Social[]; nav: readonly NavItem[]; creatorName: string; creatorUrl: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Yangi Avlod — bosh sahifa">
          <BrandMark />
          <span>
            <b>YANGI AVLOD</b>
            <small>YOSH SIYOSATCHILAR</small>
          </span>
        </Link>
        <nav aria-label="Pastki menyu">
          {nav.map((n) => (
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
          <div className="om" role="img" aria-label="Yoshlar Parlamenti — Oʻzbekiston Respublikasi Oliy Majlisi Qonunchilik palatasi">
            <BrandMark full />
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="wrap">
          <span>© {year} Yangi Avlod — Yosh siyosatchilar. Barcha huquqlar himoyalangan.</span>
          {creatorName && (
            <span className="creator">
              Sayt yaratuvchisi:{" "}
              {creatorUrl ? (
                <a href={creatorUrl} target="_blank" rel="noopener">
                  {creatorName}
                </a>
              ) : (
                <b>{creatorName}</b>
              )}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
