"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FIELDS, REGION_DEFS_ALPHA, normalize } from "@/lib/data";
import type { Person, Region } from "@/lib/content";
import PersonCard from "../PersonCard";
import { ArrowRight, SearchIcon } from "../Icons";

/** Bosh sahifa: tanlangan yosh siyosatchilar + tezkor filtr (maketdagidek) */
export default function PeopleSection({ people, regions }: { people: Person[]; regions: Region[] }) {
  const rName = (s: string) => regions.find((r) => r.slug === s)?.name ?? "";
  const [soha, setSoha] = useState("");
  const [hudud, setHudud] = useState("");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const n = normalize(q);
    return people.filter((p) => p.featured)
      .filter((p) => (!soha || p.field === soha) && (!hudud || p.region === hudud) && (!n || normalize(p.name).includes(n)))
      .slice(0, 4);
  }, [soha, hudud, q, people]);

  const params = new URLSearchParams();
  if (soha) params.set("soha", soha);
  if (hudud) params.set("hudud", hudud);
  if (q) params.set("q", q);
  const allHref = `/yosh-siyosatchilar${params.size ? `?${params}` : ""}`;

  return (
    <section className="wrap" id="yosh-siyosatchilar" aria-labelledby="h-people">
      <div className="sec-head">
        <div>
          <h2 id="h-people">Yosh siyosatchilar</h2>
          <p>Yangi Oʻzbekistonni shakllantirayotgan faol va tashabbuskor yoshlar</p>
        </div>
        <Link className="more" href={allHref}>
          Barcha yosh siyosatchilar <ArrowRight />
        </Link>
      </div>
      <div className="people">
        {list.map((p, i) => (
          <PersonCard key={p.slug} person={p} regionName={rName(p.region)} priority={i < 4} />
        ))}
        {list.length === 0 && (
          <div className="empty">
            <div>
              Tanlangan mezonlar boʻyicha topilmadi.{" "}
              <button type="button" onClick={() => (setSoha(""), setHudud(""), setQ(""))}>
                Filtrlarni tozalash
              </button>
            </div>
          </div>
        )}
        <form className="filter" role="search" aria-label="Yosh siyosatchilarni saralash" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fSoha">Soha</label>
            <div className="select">
              <select id="fSoha" value={soha} onChange={(e) => setSoha(e.target.value)}>
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
            <label htmlFor="fHudud">Hudud</label>
            <div className="select">
              <select id="fHudud" value={hudud} onChange={(e) => setHudud(e.target.value)}>
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
            <label htmlFor="fIsm">Ism</label>
            <div style={{ position: "relative" }}>
              <input id="fIsm" type="search" placeholder="Qidirish..." autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
              <SearchIcon />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
