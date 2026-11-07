import type { ReactElement, SVGProps } from "react";
import type { FieldIcon } from "@/lib/data";

type P = SVGProps<SVGSVGElement>;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Chevron = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const ChevronDown = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);
export const Globe = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" />
  </svg>
);
export const Menu = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const Close = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Sun = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
  </svg>
);
export const Moon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
  </svg>
);
export const Pin = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M10 8.5v7l6-3.5z" fill="currentColor" />
  </svg>
);
export const Mail = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const QuoteMark = (p: P) => (
  <svg viewBox="0 0 34 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M0 24V14C0 6 4 1.5 12 0l1.5 3C9 4.5 7 7.5 7 11h6v13zm19 0V14c0-8 4-12.5 12-14l1.5 3C28 4.5 26 7.5 26 11h6v13z" />
  </svg>
);
export const Doc = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);

/** Parlament binosi — logotip belgisi */
export const Emblem = ({ gradientId = "lg", ...p }: P & { gradientId?: string }) => (
  <svg viewBox="0 0 64 24" fill="none" aria-hidden="true" {...p}>
    <defs>
      <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#d5b26f" />
        <stop offset="1" stopColor="#a27936" />
      </linearGradient>
    </defs>
    <g stroke={`url(#${gradientId})`} strokeWidth={1.2}>
      <path d="M1 23h62M3 21h58M5 19h54M7 8.5h50V19M5 8.5l27-5 27 5M32 3.5V.6" />
      <path d="M11 10v8M15.5 10v8M20 10v8M24.5 10v8M29 10v8M35 10v8M39.5 10v8M44 10v8M48.5 10v8M53 10v8" />
    </g>
    <rect x="25" y="5.2" width="14" height="2" fill={`url(#${gradientId})`} />
  </svg>
);

const FIELD_PATHS: Record<FieldIcon, ReactElement> = {
  parl: (
    <>
      <path d="M12 2 2 7h20z" fill="currentColor" />
      <path d="M4 9h16M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18M2 22h20" fill="none" stroke="currentColor" strokeWidth={1.9} />
    </>
  ),
  gov: (
    <g fill="currentColor">
      <circle cx="12" cy="7" r="3.2" />
      <circle cx="5" cy="9" r="2.4" />
      <circle cx="19" cy="9" r="2.4" />
      <path d="M6.5 21v-2.5a5.5 5.5 0 0 1 11 0V21zM1 19.5v-1.6A4 4 0 0 1 7.3 14.6 7 7 0 0 0 5.2 19.5zM23 19.5v-1.6a4 4 0 0 0-6.3-3.3 7 7 0 0 1 2.1 4.9z" />
    </g>
  ),
  dip: (
    <g fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 2.5v19M2.5 12h19M5 6c4 2 10 2 14 0M5 18c4-2 10-2 14 0" />
    </g>
  ),
  eco: (
    <g fill="currentColor">
      <rect x="3.5" y="13" width="4.2" height="8" rx=".6" />
      <rect x="10" y="8.5" width="4.2" height="12.5" rx=".6" />
      <rect x="16.5" y="3.5" width="4.2" height="17.5" rx=".6" />
    </g>
  ),
  edu: (
    <g fill="currentColor">
      <path d="M12 3 1 8.5 12 14l11-5.5z" />
      <path d="M5.5 11.5v4.8c2.5 2.6 10.5 2.6 13 0v-4.8L12 15z" />
      <rect x="21" y="9" width="1.6" height="6.5" rx=".8" />
    </g>
  ),
  civ: (
    <g fill="currentColor">
      <circle cx="12" cy="6" r="3" />
      <circle cx="4.8" cy="8" r="2.4" />
      <circle cx="19.2" cy="8" r="2.4" />
      <path d="M7.5 21v-4.5a4.5 4.5 0 0 1 9 0V21zM1 20v-3.5a3.8 3.8 0 0 1 5.5-3.4A6 6 0 0 0 6 16v4zM23 20v-3.5a3.8 3.8 0 0 0-5.5-3.4A6 6 0 0 1 18 16v4z" />
    </g>
  ),
  leaf: <path fill="currentColor" d="M20 3C10 3 4 8 4 15c0 2 .6 3.8 1.5 5 0 0 1-6 7.5-10-5 4-6.6 8-6.8 10.5C8 21.5 9.8 22 12 22c6 0 9-6 8-19z" />,
};

export const FieldGlyph = ({ icon, ...p }: P & { icon: FieldIcon }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    {FIELD_PATHS[icon]}
  </svg>
);

export const SocialIcon = ({ name, ...p }: P & { name: string }) => {
  switch (name) {
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
          <path d="M21.5 3.6 2.9 10.8c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8L23 4.9c.3-1.3-.5-1.8-1.5-1.3zM9.6 14.5l8.9-5.6c.4-.3.8-.1.5.2l-7.3 6.6-.3 3.1z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" {...p}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
          <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12c0 1.3.1 2.6.4 3.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15.3V8.7l5.6 3.3z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
          <path d="M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z" />
        </svg>
      );
  }
};

/** Statistika ikonalari (oltin gradient) */
export const StatIcon = ({ name, outline }: { name: string; outline: string }) => {
  const fill = "url(#gg)";
  switch (name) {
    case "people":
      return (
        <svg viewBox="0 0 40 32" aria-hidden="true">
          <defs>
            <linearGradient id="gg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ddbf86" />
              <stop offset="1" stopColor="#b48a46" />
            </linearGradient>
          </defs>
          <g fill={fill}>
            <circle cx="8.5" cy="10" r="3.6" />
            <circle cx="31.5" cy="10" r="3.6" />
            <circle cx="20" cy="8.5" r="4.6" />
            <path d="M2 27v-5c0-3 2.8-5.5 6.5-5.5 1.6 0 3 .5 4 1.3A8 8 0 0 0 11 22.5V27zM38 27v-5c0-3-2.8-5.5-6.5-5.5-1.6 0-3 .5-4 1.3A8 8 0 0 1 29 22.5V27zM12 30v-7.5c0-4 3.6-7 8-7s8 3 8 7V30z" />
          </g>
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <g fill={fill}>
            <path d="M16 4 30 10.5 16 17 2 10.5z" />
            <path d="M5.2 14.4 16 19.4l10.8-5L30 16l-14 6.5L2 16z" opacity=".85" />
            <path d="M5.2 19.9 16 24.9l10.8-5L30 21.5 16 28 2 21.5z" opacity=".7" />
          </g>
        </svg>
      );
    case "bulb":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <g fill={fill}>
            <path d="M16 2.5a8.8 8.8 0 0 0-5.3 15.8c1 .8 1.4 1.8 1.4 3v.8h7.8v-.8c0-1.2.5-2.2 1.4-3A8.8 8.8 0 0 0 16 2.5z" />
            <rect x="12.1" y="23.5" width="7.8" height="2.2" rx="1" />
            <path d="M13.2 27.2h5.6a2.8 2.8 0 0 1-5.6 0z" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 1020 669" aria-hidden="true">
          <path d={outline} fill={fill} />
        </svg>
      );
  }
};
