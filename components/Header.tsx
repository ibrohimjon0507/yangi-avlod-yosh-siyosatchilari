"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/data";
import { ChevronDown, Close, Emblem, Globe, Menu, Moon, SearchIcon, Sun } from "./Icons";
import SearchDialog from "./SearchDialog";
import type { SearchItem } from "@/lib/search";

const LANGS = [
  { code: "UZ", label: "Oʻzbekcha", ready: true },
  { code: "RU", label: "Русский", ready: false },
  { code: "EN", label: "English", ready: false },
];

function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button className="icon-btn theme-btn" type="button" onClick={toggle} aria-label="Yorugʻ yoki tungi rejimni almashtirish" title="Rejimni almashtirish">
      <Moon className="i-moon" />
      <Sun className="i-sun" />
    </button>
  );
}

function LangMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div className="lang-wrap" ref={ref}>
      <button className="lang" type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Tilni tanlash: oʻzbekcha" onClick={() => setOpen((o) => !o)}>
        <Globe />
        <span>UZ</span>
        <ChevronDown className="chev" />
      </button>
      {open && (
        <div className="menu" role="menu">
          {LANGS.map((l) => (
            <button key={l.code} role="menuitem" type="button" disabled={!l.ready} onClick={() => setOpen(false)}>
              {l.label}
              {l.ready ? <span className="ok">✓</span> : <small>tez orada</small>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ searchItems }: { searchItems: SearchItem[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div className="edge" aria-hidden="true" />
      <header className="top">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="Yangi Avlod — bosh sahifa">
            <Emblem gradientId="lg-h" />
            <span>
              <b>YANGI AVLOD</b>
              <small>YOSH SIYOSATCHILAR</small>
            </span>
          </Link>
          <nav className={`main${menuOpen ? " open" : ""}`} id="mainNav" aria-label="Asosiy menyu">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={isActive(n.href) ? "active" : undefined} aria-current={isActive(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="tools">
            <button className="icon-btn" type="button" onClick={() => setSearchOpen(true)} aria-label="Qidirish (Ctrl+K)" title="Qidirish (Ctrl+K)">
              <SearchIcon />
            </button>
            <ThemeToggle />
            <span className="sep" aria-hidden="true" />
            <LangMenu />
            <button className="icon-btn burger" type="button" aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"} aria-expanded={menuOpen} aria-controls="mainNav" onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {searchOpen && <SearchDialog items={searchItems} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
