/* eslint-disable @next/next/no-img-element */
/** Yoshlar Parlamenti belgisi: yorugʻ rejimda toʻq koʻk, tungi rejimda oq (CSS orqali almashadi) */
export default function BrandMark({ full = false, className = "" }: { full?: boolean; className?: string }) {
  const base = full ? "/images/brand/yoshlar-parlamenti" : "/images/brand/building";
  const [w, h] = full ? [854, 570] : [524, 240];
  return (
    <span className={`bmark${full ? " bmark-full" : ""} ${className}`.trim()}>
      <img className="bm-light" src={`${base}-navy.png`} alt="" width={w} height={h} decoding="async" />
      <img className="bm-dark" src={`${base}-white.png`} alt="" width={w} height={h} decoding="async" />
    </span>
  );
}
