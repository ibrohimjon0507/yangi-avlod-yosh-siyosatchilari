"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { normalize } from "@/lib/data";
import type { SearchItem as Item } from "@/lib/search";
import { Doc, FieldGlyph, Pin, SearchIcon } from "./Icons";

export default function SearchDialog({ onClose, items }: { onClose: () => void; items: Item[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const n = normalize(q);
    if (!n) return items.filter((i) => i.group === "Yosh siyosatchilar" || i.group === "Sahifalar");
    return items.filter((i) => normalize(`${i.title} ${i.sub}`).includes(n)).slice(0, 24);
  }, [q, items]);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item?: Item) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  let lastGroup = "";
  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Sayt boʻyicha qidiruv" onKeyDown={onKey}>
        <div className="search-field">
          <SearchIcon />
          <input
            ref={inputRef}
            id="site-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ism, soha, hudud yoki tashabbus…"
            aria-label="Qidiruv soʻzi"
            aria-controls="search-results"
            autoComplete="off"
          />
          <kbd>Esc</kbd>
        </div>
        <div className="search-results" id="search-results" role="listbox" ref={listRef}>
          {results.length === 0 && <div className="search-empty">“{q}” boʻyicha hech narsa topilmadi. Boshqa soʻz bilan urinib koʻring.</div>}
          {results.map((item, idx) => {
            const head = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <div key={item.key}>
                {head && <div className="search-group">{head}</div>}
                <button
                  type="button"
                  role="option"
                  aria-selected={idx === active}
                  className="search-item"
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => go(item)}
                >
                  <span className="si">{item.img ? <img src={item.img} alt="" /> : item.kind === "field" && item.icon ? <FieldGlyph icon={item.icon} /> : item.kind === "region" ? <Pin /> : <Doc />}</span>
                  <span>
                    <b>{item.title}</b>
                    <span>{item.sub}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="search-foot">
          <span>↑ ↓ — tanlash</span>
          <span>Enter — ochish</span>
          <span>Ctrl + K — qidiruvni ochish</span>
        </div>
      </div>
    </div>
  );
}
