"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FIELDS, REGION_DEFS_ALPHA, normalize } from "@/lib/data";
import type { Person, Region } from "@/lib/content";
import PersonCard from "./PersonCard";
import { SearchIcon } from "./Icons";

type Init = { soha: string; hudud: string; q: string };

/** Toʻliq roʻyxat: filtrlar URL bilan sinxron (?soha=&hudud=&q=) — havolani ulashish mumkin */
export default function PeopleExplorer({ initial, people, regions }: { initial: Init; people: Person[]; regions: Region[] }) {
  const rName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "";
  const router = useRouter();
  const pathname = usePathname();
  const [soha, setSoha] = useState(initial.soha);
  const [hudud, setHudud] = useState(initial.hudud);
  const [q, setQ] = useState(initial.q);

  useEffect(() => {
    const p = new URLSearchParams();
    if (soha) p.set("soha", soha);
    if (hudud) p.set("hudud", hudud);
    if (q.trim()) p.set("q", q.trim());
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [soha, hudud, q, pathname, router]);

  const list = useMemo(() => {
    const n = normalize(q);
    return people.filter((p) => (!soha || p.field === soha) && (!hudud || p.region === hudud) && (!n || normalize(p.name).includes(n)));
  }, [soha, hudud, q, people]);

  const dirty = Boolean(soha || hudud || q);
  const reset = () => (setSoha(""), setHudud(""), setQ(""));

  return (
    <>
      <form className="filter-bar" role="search" aria-label="Yosh siyosatchilarni saralash" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="xSoha">Soha</label>
          <div className="select">
            <select id="xSoha" value={soha} onChange={(e) => setSoha(e.target.value)}>
              <option value="">Barchasi</option>
              {FIELDS.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="xHudud">Hudud</label>
          <div className="select">
            <select id="xHudud" value={hudud} onChange={(e) => setHudud(e.target.value)}>
              <option value="">Barchasi</option>
              {REGION_DEFS_ALPHA.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="search">
          <label htmlFor="xIsm">Ism</label>
          <div style={{ position: "relative" }}>
            <input id="xIsm" type="search" placeholder="Ism yoki familiya…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
            <SearchIcon />
          </div>
        </div>
        <button type="button" className="btn-reset" onClick={reset} disabled={!dirty}>
          Tozalash
        </button>
      </form>
      <p className="count-note" aria-live="polite">
        Topildi: <b>{list.length}</b> nafar
      </p>
      <div className="people-grid">
        {list.map((p) => (
          <PersonCard key={p.slug} person={p} regionName={rName(p.region)} />
        ))}
        {list.length === 0 && (
          <div className="empty">
            <div>
              Tanlangan mezonlar boʻyicha yosh siyosatchi topilmadi.
              <br />
              <button type="button" onClick={reset}>
                Filtrlarni tozalash
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
