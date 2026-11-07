"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { CITIES, COUNTRY_OUTLINE, MAP_H, MAP_W, REGION_PATHS } from "@/lib/uzmap";
import type { Region } from "@/lib/content";
import { Chevron } from "./Icons";

/** Yorqin halqa bilan ajratiladigan shaharlar va ularning radiusi (xarita birligida) */
const HALOS: Record<string, number> = { Toshkent: 66, "Fargʻona": 51, Samarqand: 48, Qarshi: 36 };

// Kichik ISO kodini oxiriga qoʻyamiz — Toshkent shahri boshqa hududlar ustida chizilsin
const ISO_ORDER = Object.keys(REGION_PATHS).sort((a, b) => (a === "UZ-TK" ? 1 : b === "UZ-TK" ? -1 : 0));

const countText = (r?: Region) => (r?.count != null ? `${r.count} nafar yosh siyosatchi` : "Roʻyxatni koʻrish");

type MapProps = {
  regions: Region[];
  variant: "home" | "full";
  hl: string | null;
  setHl: (iso: string | null) => void;
};

function UzMap({ regions, variant, hl, setHl }: MapProps) {
  const regionByIso = (iso: string) => regions.find((r) => r.iso === iso);
  const router = useRouter();
  const uid = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; iso: string } | null>(null);

  const open = (iso: string) => {
    const r = regionByIso(iso);
    if (r) router.push(`/yosh-siyosatchilar?hudud=${r.slug}`);
  };

  const showTip = (iso: string, e?: React.MouseEvent | React.FocusEvent) => {
    const box = wrap.current?.getBoundingClientRect();
    if (!box) return;
    let x: number, y: number;
    if (e && "clientX" in e) {
      x = e.clientX - box.left;
      y = e.clientY - box.top;
    } else {
      const bb = (e?.target as SVGGraphicsElement | undefined)?.getBoundingClientRect();
      x = bb ? bb.left + bb.width / 2 - box.left : box.width / 2;
      y = bb ? bb.top + bb.height / 2 - box.top : box.height / 2;
    }
    setTip({ x: Math.max(70, Math.min(box.width - 70, x)), y, iso });
    setHl(iso);
  };
  const hideTip = () => {
    setTip(null);
    setHl(null);
  };

  // Uy sahifasi: maketdagidek ikki qatlam (och "soya" nusxa + asosiy xarita)
  const home = variant === "home";
  const SM = 0.128, MX = 853, MY = 514; // asosiy xarita
  const SG = 0.105, GX = 776, GY = 542; // soya nusxa
  const k = home ? SM : 1;
  const P = (x: number, y: number, s = SM, ox = MX, oy = MY) => (home ? [ox + x * s, oy + y * s] : [x, y]);

  const regionPaths = (cls: string, interactive: boolean) =>
    ISO_ORDER.map((iso) => {
      const r = regionByIso(iso);
      if (!interactive) return <path key={iso} d={REGION_PATHS[iso]} vectorEffect="non-scaling-stroke" />;
      return (
        <path
          key={iso}
          className={`${cls}${hl === iso ? " hl" : ""}`}
          d={REGION_PATHS[iso]}
          vectorEffect="non-scaling-stroke"
          tabIndex={0}
          role="link"
          aria-label={`${r?.name}: ${countText(r)}`}
          onMouseMove={(e) => showTip(iso, e)}
          onMouseLeave={hideTip}
          onFocus={(e) => showTip(iso, e)}
          onBlur={hideTip}
          onClick={() => open(iso)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(iso))}
        />
      );
    });

  return (
    <div className="map" ref={wrap}>
      <svg viewBox={home ? "768 500 224 125" : `-20 -20 ${MAP_W + 40} ${MAP_H + 40}`} role="img" aria-label="Oʻzbekiston hududlari xaritasi">
        <defs>
          <radialGradient id={`halo-${uid}`}>
            <stop offset="0" style={{ stopColor: "var(--halo)" }} stopOpacity=".62" />
            <stop offset=".55" style={{ stopColor: "var(--halo)" }} stopOpacity=".3" />
            <stop offset="1" style={{ stopColor: "var(--halo)" }} stopOpacity="0" />
          </radialGradient>
        </defs>

        {home && (
          <>
            <g className="ghost" aria-hidden="true" transform={`translate(${GX} ${GY}) scale(${SG})`}>
              {regionPaths("", false)}
            </g>
            <g className="gdots" aria-hidden="true">
              {Object.entries(CITIES).map(([n, [x, y]]) => {
                const [cx, cy] = P(x, y, SG, GX, GY);
                return <circle key={n} className="gd" cx={cx} cy={cy} r={0.9} />;
              })}
              {(() => {
                const [cx, cy] = P(...CITIES.Toshkent, SG, GX, GY);
                return (
                  <>
                    <circle cx={cx} cy={cy} r={7} fill={`url(#halo-${uid})`} opacity={0.8} />
                    <circle className="cdot c" cx={cx} cy={cy} r={1.3} />
                  </>
                );
              })()}
            </g>
          </>
        )}

        <g transform={home ? `translate(${MX} ${MY}) scale(${SM})` : undefined}>{regionPaths("rg", true)}</g>
        {!home && <path d={COUNTRY_OUTLINE} fill="none" stroke="var(--navy)" strokeOpacity=".25" strokeWidth="1.5" pointerEvents="none" />}

        <g aria-hidden="true" pointerEvents="none">
          {Object.entries(CITIES).map(([n, [x, y]]) => {
            const [cx, cy] = P(x, y);
            const r = HALOS[n];
            if (r)
              return (
                <g key={n}>
                  <circle cx={cx} cy={cy} r={r * k} fill={`url(#halo-${uid})`} />
                  <circle className="ring" cx={cx} cy={cy} r={r * 0.7 * k} style={{ strokeWidth: home ? 0.5 : 4 }} />
                  <circle className="cdot c" cx={cx} cy={cy} r={home ? 1.7 : 11} />
                </g>
              );
            return <circle key={n} className="cdot" cx={cx} cy={cy} r={home ? 1.05 : 7} />;
          })}
        </g>
      </svg>
      {tip && (
        <div className="tip" style={{ left: tip.x, top: tip.y }} role="status">
          <b>{regionByIso(tip.iso)?.name}</b>
          <span>{countText(regionByIso(tip.iso))}</span>
        </div>
      )}
    </div>
  );
}

function RegionRow({ region, hl, setHl }: { region: Region; hl: string | null; setHl: (iso: string | null) => void }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`region${hl === region.iso ? " hl" : ""}`}
      onMouseEnter={() => setHl(region.iso)}
      onMouseLeave={() => setHl(null)}
      onFocus={() => setHl(region.iso)}
      onBlur={() => setHl(null)}
      onClick={() => router.push(`/yosh-siyosatchilar?hudud=${region.slug}`)}
    >
      {region.image ? (
        <Image src={region.image} alt="" width={144} height={96} />
      ) : (
        <span className="badge" aria-hidden="true">
          {region.count ?? "—"}
        </span>
      )}
      <div>
        <b>{region.name}</b>
        <span>{countText(region)}</span>
      </div>
      <Chevron className="chev" />
    </button>
  );
}

/** Bosh sahifadagi xarita + 3 ta hudud */
export function HomeRegions({ regions }: { regions: Region[] }) {
  const [hl, setHl] = useState<string | null>(null);
  return (
    <div className="map-wrap">
      <UzMap regions={regions} variant="home" hl={hl} setHl={setHl} />
      <div className="regions">
        {regions.slice(0, 3).map((r) => (
          <RegionRow key={r.slug} region={r} hl={hl} setHl={setHl} />
        ))}
      </div>
    </div>
  );
}

/** “Hududlar” sahifasi: katta xarita + barcha 14 hudud */
export function RegionsFull({ regions }: { regions: Region[] }) {
  const [hl, setHl] = useState<string | null>(null);
  return (
    <div className="regions-page">
      <div className="map-card">
        <UzMap regions={regions} variant="full" hl={hl} setHl={setHl} />
        <div className="map-legend">
          <span>
            <i />
            Yosh siyosatchilar faol boʻlgan markazlar
          </span>
          <span>Hududni bosing — roʻyxat ochiladi</span>
        </div>
      </div>
      <div className="region-list">
        {regions.map((r) => (
          <RegionRow key={r.slug} region={r} hl={hl} setHl={setHl} />
        ))}
      </div>
    </div>
  );
}
