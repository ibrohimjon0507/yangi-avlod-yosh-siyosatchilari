"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { logoutAction, restoreAction, saveAction } from "@/app/admin/actions";
import { FIELDS, REGION_DEFS, REGION_DEFS_ALPHA, fieldBySlug, regionDef, slugify } from "@/lib/data";
import { DEFAULT_HERO_IMAGE, HeroSchema, IdeaSchema, InitiativeSchema, PersonSchema, QuoteSchema, type Hero, type Idea, type Initiative, type Person, type Quote, type SiteContent } from "@/lib/content";
import type { Version } from "@/lib/store";
import BrandMark from "../BrandMark";

type Tab = "hero" | "sections" | "people" | "initiatives" | "president" | "ideas" | "regions" | "stats" | "book" | "settings" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Bosh qism (Hero)" },
  { id: "sections", label: "Boʻlimlar (koʻrsatish)" },
  { id: "people", label: "Yosh siyosatchilar" },
  { id: "initiatives", label: "Tashabbuslar" },
  { id: "president", label: "Prezident fikrlari" },
  { id: "ideas", label: "Mening Oʻzbekistonim" },
  { id: "regions", label: "Hududlar" },
  { id: "stats", label: "Statistika" },
  { id: "book", label: "Kitob" },
  { id: "settings", label: "Sayt sozlamalari" },
  { id: "history", label: "Saqlash tarixi" },
];

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/* ---------------- Kichik yordamchi komponentlar ---------------- */

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className={`adm-field${error ? " has-error" : ""}`}>
      <span className="adm-label">{label}</span>
      {children}
      {hint && !error && <small className="adm-hint">{hint}</small>}
      {error && <small className="adm-ferr">{error}</small>}
    </div>
  );
}

function Upload({ value, onChange, accept = "image/jpeg,image/png,image/webp,image/avif", kind = "image", disabled }: { value: string; onChange: (v: string) => void; accept?: string; kind?: "image" | "pdf"; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const pick = async (file?: File) => {
    if (!file) return;
    setErr("");
    if (file.size > 30 * 1024 * 1024) return setErr("Fayl 30 MB dan katta boʻlmasligi kerak.");
    const ext = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "fayl";
    try {
      setProgress(0);
      const res = await upload(`uploads/${base}.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      });
      onChange(res.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Yuklab boʻlmadi");
    } finally {
      setProgress(null);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <div className="adm-upload">
      {kind === "image" ? (
        <div className="adm-thumb">{value ? <img src={value} alt="" /> : <span>Rasm yoʻq</span>}</div>
      ) : (
        <div className="adm-file">{value ? <a href={value} target="_blank" rel="noopener">PDF faylni ochish ↗</a> : <span>Fayl yuklanmagan</span>}</div>
      )}
      <div className="adm-upload-actions">
        <input ref={ref} type="file" accept={accept} hidden onChange={(e) => pick(e.target.files?.[0])} />
        <button type="button" className="adm-btn" disabled={disabled || progress !== null} onClick={() => ref.current?.click()}>
          {progress !== null ? `Yuklanmoqda… ${progress}%` : value ? "Almashtirish" : kind === "pdf" ? "PDF yuklash" : "Rasm yuklash"}
        </button>
        {value && (
          <button type="button" className="adm-btn ghost" onClick={() => onChange("")}>
            Olib tashlash
          </button>
        )}
        {err && <small className="adm-ferr">{err}</small>}
        {disabled && <small className="adm-hint">Fayl yuklash uchun ombor ulangan boʻlishi kerak.</small>}
      </div>
    </div>
  );
}

function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    if (!ask) return;
    const t = setTimeout(() => setAsk(false), 4000);
    return () => clearTimeout(t);
  }, [ask]);
  return ask ? (
    <button type="button" className="adm-btn danger" onClick={onConfirm}>
      Tasdiqlash
    </button>
  ) : (
    <button type="button" className="adm-icon" title="Oʻchirish" aria-label="Oʻchirish" onClick={() => setAsk(true)}>
      ✕
    </button>
  );
}

function issuesOf(schema: { safeParse: (v: unknown) => { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } } }, v: unknown) {
  const r = schema.safeParse(v);
  const out: Record<string, string> = {};
  if (!r.success) for (const i of r.error!.issues) out[String(i.path[0] ?? "_")] ??= i.message;
  return out;
}

function move<T>(arr: T[], i: number, d: -1 | 1) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

/* ---------------- Asosiy tahrirlovchi ---------------- */

export default function AdminEditor({ initial, versions, storeReady }: { initial: SiteContent; versions: Version[]; storeReady: boolean }) {
  const [c, setC] = useState<SiteContent>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState<Tab>("hero");
  const [open, setOpen] = useState<number | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(c) !== saved;

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.kind === "ok" ? 3500 : 8000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => setOpen(null), [tab]);

  const save = () =>
    start(async () => {
      const r = await saveAction(c);
      if (r.ok) {
        setSaved(JSON.stringify(c));
        setToast({ kind: "ok", text: "Saqlandi. Saytda bir necha soniyada yangilanadi." });
      } else setToast({ kind: "err", text: r.error });
    });

  const set = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => setC((p) => ({ ...p, [k]: v }));

  const counts: Partial<Record<Tab, number>> = { people: c.people.length, initiatives: c.initiatives.length, ideas: c.ideas.length, president: c.president.quotes.length };

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <Link href="/admin" className="adm-brand">
          <BrandMark />
          <span>
            <b>YANGI AVLOD</b>
            <small>Admin panel</small>
          </span>
        </Link>
        <div className="adm-status" aria-live="polite">
          {dirty ? <span className="dot warn">Saqlanmagan oʻzgarishlar bor</span> : <span className="dot ok">Barcha oʻzgarishlar saqlangan</span>}
        </div>
        <div className="adm-top-actions">
          <a className="adm-btn ghost" href="/" target="_blank" rel="noopener">
            Saytni koʻrish ↗
          </a>
          <button className="adm-btn primary" type="button" onClick={save} disabled={!dirty || pending || !storeReady}>
            {pending ? "Saqlanmoqda…" : "Saqlash"}
          </button>
          <form action={logoutAction}>
            <button className="adm-btn ghost" type="submit">
              Chiqish
            </button>
          </form>
        </div>
      </header>

      {!storeReady && (
        <div className="adm-banner">
          Maʼlumotlar ombori ulanmagan (<code>BLOB_READ_WRITE_TOKEN</code> yoʻq). Panelni koʻrish mumkin, lekin saqlash va fayl yuklash ishlamaydi. Vercel loyihasiga Blob omborini ulang.
        </div>
      )}

      <div className="adm-body">
        <nav className="adm-side" aria-label="Boʻlimlar">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? "on" : ""} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.label}
              {counts[t.id] != null && <span className="cnt">{counts[t.id]}</span>}
            </button>
          ))}
        </nav>

        <section className="adm-main">
          {tab === "hero" && <HeroEditor hero={c.hero} onChange={(v) => set("hero", v)} site={c.site} onSite={(v) => set("site", v)} storeReady={storeReady} goStats={() => setTab("stats")} />}

          {tab === "sections" && (
            <div className="adm-panel narrow">
              <h2>Boʻlimlar</h2>
              <p className="adm-sub">Oʻchirilgan boʻlim bosh sahifadan, menyudan, qidiruvdan va sayt xaritasidan yashiriladi; uning alohida sahifasi ham ochilmaydi. Maʼlumotlar oʻchmaydi — qayta yoqsangiz, hammasi joyida qaytadi.</p>
              {(
                [
                  ["map", "Hududlar xaritasi", "Bosh sahifadagi katta xarita va “Hududlar” sahifasi"],
                  ["book", "Kitob", "Bosh sahifadagi kitob boʻlimi va “Kitob” sahifasi"],
                ] as const
              ).map(([k, label, sub]) => (
                <label className="adm-toggle" key={k}>
                  <input type="checkbox" role="switch" checked={c.sections[k]} onChange={(e) => set("sections", { ...c.sections, [k]: e.target.checked })} />
                  <span className="adm-switch" aria-hidden="true" />
                  <span>
                    <b>{label}</b>
                    <small>{c.sections[k] ? "Saytda koʻrinadi" : "Yashirilgan"} · {sub}</small>
                  </span>
                </label>
              ))}
            </div>
          )}

          {tab === "president" && (
            <>
              <div className="adm-panel narrow">
                <h2>Prezident fikrlari</h2>
                <p className="adm-sub">Bosh sahifadagi “Mening Oʻzbekistonim” boʻlimida chiqadi. Birinchi fikr katta koʻrinishda, qolganlari yonida roʻyxat boʻlib turadi. Faqat rasmiy manbada aynan aytilgan soʻzlarni kiriting va manbasini yozing.</p>
                <div className="adm-grid2">
                  <Field label="Ism">
                    <input value={c.president.name} onChange={(e) => set("president", { ...c.president, name: e.target.value })} />
                  </Field>
                  <Field label="Lavozimi">
                    <input value={c.president.title} onChange={(e) => set("president", { ...c.president, title: e.target.value })} />
                  </Field>
                </div>
              </div>
              <ListEditor<Quote>
                title="Iqtiboslar"
                hint="Tartibni ↑ ↓ tugmalari bilan oʻzgartiring. Qoʻshtirnoqlarsiz yozing."
                items={c.president.quotes}
                onChange={(v) => set("president", { ...c.president, quotes: v })}
                open={open}
                setOpen={setOpen}
                make={() => ({ text: "", source: "" })}
                thumb={() => ""}
                primary={(q) => (q.text ? (q.text.length > 90 ? `${q.text.slice(0, 90)}…` : q.text) : "Yangi iqtibos")}
                secondary={(q) => q.source || "Manba koʻrsatilmagan"}
                validate={(q) => issuesOf(QuoteSchema, q)}
                form={(q, up, err) => (
                  <>
                    <Field label="Iqtibos matni" error={err.text}>
                      <textarea rows={4} value={q.text} onChange={(e) => up({ text: e.target.value })} />
                    </Field>
                    <Field label="Manba" hint="Masalan: Yoshlar bilan muloqot, 2026-yil 24-fevral" error={err.source}>
                      <input value={q.source} onChange={(e) => up({ source: e.target.value })} />
                    </Field>
                  </>
                )}
              />
            </>
          )}

          {tab === "people" && (
            <ListEditor<Person>
              title="Yosh siyosatchilar"
              hint="Bosh sahifada “Bosh sahifada koʻrsatish” belgilangan birinchi 4 kishi chiqadi."
              items={c.people}
              onChange={(v) => set("people", v)}
              open={open}
              setOpen={setOpen}
              make={() => ({ slug: "", name: "", field: FIELDS[0].slug, region: REGION_DEFS[0].slug, photo: "", cardImage: "", featured: false, bio: "" })}
              thumb={(p) => p.photo || p.cardImage}
              primary={(p) => p.name || "Yangi yosh siyosatchi"}
              secondary={(p) => `${fieldBySlug(p.field)?.name ?? ""} · ${regionDef(p.region)?.name ?? ""}${p.featured ? " · ★ bosh sahifada" : ""}`}
              validate={(p) => issuesOf(PersonSchema, p)}
              form={(p, up, err, isNew) => (
                <>
                  <Field label="Ism va familiya" error={err.name}>
                    <input value={p.name} onChange={(e) => up({ name: e.target.value, ...(isNew ? { slug: slugify(e.target.value) } : {}) })} placeholder="Masalan: Jasur Bekmurodov" />
                  </Field>
                  <Field label="Havola nomi (URL)" hint={`Sahifa manzili: /yosh-siyosatchilar/${p.slug || "…"}`} error={err.slug}>
                    <input value={p.slug} onChange={(e) => up({ slug: slugify(e.target.value) })} />
                  </Field>
                  <div className="adm-grid2">
                    <Field label="Soha" error={err.field}>
                      <select value={p.field} onChange={(e) => up({ field: e.target.value })}>
                        {FIELDS.map((f) => (
                          <option key={f.slug} value={f.slug}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Hudud" error={err.region}>
                      <select value={p.region} onChange={(e) => up({ region: e.target.value })}>
                        {REGION_DEFS_ALPHA.map((r) => (
                          <option key={r.slug} value={r.slug}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Surat" hint="Tavsiya: 4:3 nisbat, kamida 800 px kenglik." error={err.photo}>
                    <Upload value={p.photo} onChange={(v) => up({ photo: v })} disabled={!storeReady} />
                  </Field>
                  <Field
                    label="Toʻliq karta rasmi (ixtiyoriy)"
                    hint="Yuklansa, karta butunlay shu rasm bilan chiqadi: ism, soha va hudud rasmning oʻzida boʻlishi kerak, sayt faqat oʻng pastdagi tugmani qoʻshadi. Tavsiya etilgan oʻlcham: 868 × 252 px (nisbat 3,44 : 1). Tugma uchun oʻng pastki burchakda ~70 × 70 px boʻsh joy qoldiring."
                    error={err.cardImage}
                  >
                    <Upload value={p.cardImage} onChange={(v) => up({ cardImage: v })} disabled={!storeReady} />
                  </Field>
                  <label className="adm-check">
                    <input type="checkbox" checked={p.featured} onChange={(e) => up({ featured: e.target.checked })} /> Bosh sahifada koʻrsatish
                  </label>
                  <Field label="Tarjimai hol" hint="Paragraflarni boʻsh qator bilan ajrating." error={err.bio}>
                    <textarea rows={7} value={p.bio} onChange={(e) => up({ bio: e.target.value })} />
                  </Field>
                </>
              )}
            />
          )}

          {tab === "initiatives" && (
            <ListEditor<Initiative>
              title="Tashabbuslar"
              hint="Bosh sahifada roʻyxatdagi birinchi 3 tasi chiqadi."
              items={c.initiatives}
              onChange={(v) => set("initiatives", v)}
              open={open}
              setOpen={setOpen}
              make={() => ({ slug: "", title: "", summary: "", body: "", field: FIELDS[0].slug, tag: "", tone: "blue", image: "" })}
              thumb={(i) => i.image}
              primary={(i) => i.title || "Yangi tashabbus"}
              secondary={(i) => `${i.tag} · ${fieldBySlug(i.field)?.name ?? ""}`}
              validate={(i) => issuesOf(InitiativeSchema, i)}
              form={(i, up, err, isNew) => (
                <>
                  <Field label="Sarlavha" error={err.title}>
                    <input value={i.title} onChange={(e) => up({ title: e.target.value, ...(isNew ? { slug: slugify(e.target.value) } : {}) })} />
                  </Field>
                  <Field label="Havola nomi (URL)" hint={`Sahifa manzili: /tashabbuslar/${i.slug || "…"}`} error={err.slug}>
                    <input value={i.slug} onChange={(e) => up({ slug: slugify(e.target.value) })} />
                  </Field>
                  <Field label="Qisqa tavsif" hint="Kartochkada chiqadigan 1–2 jumla." error={err.summary}>
                    <textarea rows={3} value={i.summary} onChange={(e) => up({ summary: e.target.value })} />
                  </Field>
                  <div className="adm-grid3">
                    <Field label="Soha" error={err.field}>
                      <select value={i.field} onChange={(e) => up({ field: e.target.value })}>
                        {FIELDS.map((f) => (
                          <option key={f.slug} value={f.slug}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Teg" hint="Masalan: Taʼlim" error={err.tag}>
                      <input value={i.tag} onChange={(e) => up({ tag: e.target.value })} />
                    </Field>
                    <Field label="Teg rangi">
                      <select value={i.tone} onChange={(e) => up({ tone: e.target.value as Initiative["tone"] })}>
                        <option value="blue">Koʻk</option>
                        <option value="green">Yashil</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Rasm" error={err.image}>
                    <Upload value={i.image} onChange={(v) => up({ image: v })} disabled={!storeReady} />
                  </Field>
                  <Field label="Batafsil matn" hint="Paragraflarni boʻsh qator bilan ajrating." error={err.body}>
                    <textarea rows={8} value={i.body} onChange={(e) => up({ body: e.target.value })} />
                  </Field>
                </>
              )}
            />
          )}

          {tab === "ideas" && (
            <ListEditor<Idea>
              title="Mening Oʻzbekistonim — yoshlar gʻoyalari"
              hint="Bosh sahifada Prezident fikrlari ostida birinchi 3 tasi chiqadi."
              items={c.ideas}
              onChange={(v) => set("ideas", v)}
              open={open}
              setOpen={setOpen}
              make={() => ({ text: "", author: "", field: FIELDS[0].slug, avatar: "" })}
              thumb={(i) => i.avatar}
              primary={(i) => i.author || "Yangi gʻoya"}
              secondary={(i) => (i.text.length > 90 ? `${i.text.slice(0, 90)}…` : i.text)}
              validate={(i) => issuesOf(IdeaSchema, i)}
              form={(i, up, err) => (
                <>
                  <Field label="Gʻoya matni" hint="Qoʻshtirnoqlarsiz yozing — sayt oʻzi qoʻyadi." error={err.text}>
                    <textarea rows={4} value={i.text} onChange={(e) => up({ text: e.target.value })} />
                  </Field>
                  <div className="adm-grid2">
                    <Field label="Muallif" error={err.author}>
                      <input value={i.author} onChange={(e) => up({ author: e.target.value })} />
                    </Field>
                    <Field label="Soha" error={err.field}>
                      <select value={i.field} onChange={(e) => up({ field: e.target.value })}>
                        {FIELDS.map((f) => (
                          <option key={f.slug} value={f.slug}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Muallif surati" hint="Kvadrat rasm tavsiya etiladi." error={err.avatar}>
                    <Upload value={i.avatar} onChange={(v) => up({ avatar: v })} disabled={!storeReady} />
                  </Field>
                </>
              )}
            />
          )}

          {tab === "regions" && (
            <div className="adm-panel">
              <h2>Hududlar</h2>
              <p className="adm-sub">Har bir hududdagi yosh siyosatchilar soni. Boʻsh qoldirilsa, saytda “Roʻyxatni koʻrish” yoziladi. Bosh sahifada birinchi 3 ta hudud (rasmi bilan) chiqadi.</p>
              <div className="adm-table">
                {c.regions.map((r, idx) => (
                  <div className="adm-row" key={r.slug}>
                    <b className="adm-rname">{REGION_DEFS[idx].name}</b>
                    <input
                      className="adm-num"
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder="—"
                      aria-label={`${REGION_DEFS[idx].name}: soni`}
                      value={r.count ?? ""}
                      onChange={(e) => {
                        const v = e.target.value === "" ? null : Math.max(0, Math.floor(Number(e.target.value)));
                        set("regions", c.regions.map((x, j) => (j === idx ? { ...x, count: Number.isFinite(v as number) || v === null ? v : null } : x)));
                      }}
                    />
                    {idx < 3 ? <Upload value={r.image} onChange={(v) => set("regions", c.regions.map((x, j) => (j === idx ? { ...x, image: v } : x)))} disabled={!storeReady} /> : <span className="adm-muted">—</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "stats" && (
            <div className="adm-panel">
              <h2>Statistika</h2>
              <p className="adm-sub">Hero ostidagi toʻrtta koʻrsatkich. Ikonalar tartibi: odamlar, yoʻnalishlar, gʻoya (lampa), xarita.</p>
              <div className="adm-stats">
                {c.stats.map((s, i) => (
                  <div className="adm-card" key={i}>
                    <div className="adm-grid2">
                      <Field label="Qiymat">
                        <input value={s.value} onChange={(e) => set("stats", c.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                      </Field>
                      <Field label="Qoʻshimcha belgi" hint="Masalan: +">
                        <input value={s.suffix} maxLength={3} onChange={(e) => set("stats", c.stats.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)))} />
                      </Field>
                    </div>
                    <Field label="Nomi">
                      <input value={s.label} onChange={(e) => set("stats", c.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                    </Field>
                    <Field label="Izoh">
                      <input value={s.sub} onChange={(e) => set("stats", c.stats.map((x, j) => (j === i ? { ...x, sub: e.target.value } : x)))} />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "book" && (
            <div className="adm-panel narrow">
              <h2>Kitob</h2>
              <Field label="Qisqa matn (sarlavha ostida)">
                <textarea rows={2} value={c.book.lead} onChange={(e) => set("book", { ...c.book, lead: e.target.value })} />
              </Field>
              <Field label="Tavsif">
                <textarea rows={3} value={c.book.description} onChange={(e) => set("book", { ...c.book, description: e.target.value })} />
              </Field>
              <Field label="Iqtibos" hint="Qoʻshtirnoqlarsiz yozing.">
                <textarea rows={2} value={c.book.quote} onChange={(e) => set("book", { ...c.book, quote: e.target.value })} />
              </Field>
              <Field label="Kitobning PDF nusxasi" hint="Yuklansa, “Kitob” sahifasida “PDF koʻrinishida oʻqish” tugmasi paydo boʻladi.">
                <Upload kind="pdf" accept="application/pdf" value={c.book.pdfUrl} onChange={(v) => set("book", { ...c.book, pdfUrl: v })} disabled={!storeReady} />
              </Field>
            </div>
          )}

          {tab === "settings" && (
            <div className="adm-panel narrow">
              <h2>Sayt sozlamalari</h2>
              <Field label="Aloqa uchun email">
                <input type="email" value={c.site.email} onChange={(e) => set("site", { ...c.site, email: e.target.value })} />
              </Field>
              <p className="adm-sub">Bosh sahifadagi iqtibos “Bosh qism (Hero)” boʻlimiga koʻchirildi.</p>
              <h3>Sayt yaratuvchisi</h3>
              <p className="adm-sub">Sayt pastki qismida “Sayt yaratuvchisi: …” deb chiqadi.</p>
              <div className="adm-grid2">
                <Field label="Ism familiya">
                  <input value={c.site.creatorName} onChange={(e) => set("site", { ...c.site, creatorName: e.target.value })} />
                </Field>
                <Field label="Havola (ixtiyoriy)" hint="Masalan: Telegram yoki portfolio, https:// bilan">
                  <input type="url" placeholder="https://…" value={c.site.creatorUrl} onChange={(e) => set("site", { ...c.site, creatorUrl: e.target.value })} />
                </Field>
              </div>
              <h3>Ijtimoiy tarmoqlar</h3>
              <p className="adm-sub">Toʻliq havolani kiriting (https:// bilan). Boʻsh qolganlari saytda faol boʻlmaydi.</p>
              {(["telegram", "instagram", "youtube", "facebook"] as const).map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                  <input type="url" placeholder={`https://…`} value={c.site[k]} onChange={(e) => set("site", { ...c.site, [k]: e.target.value })} />
                </Field>
              ))}
            </div>
          )}

          {tab === "history" && (
            <History
              versions={versions}
              disabled={dirty}
              onRestore={(url) =>
                start(async () => {
                  const r = await restoreAction(url);
                  if (r.ok) window.location.reload();
                  else setToast({ kind: "err", text: r.error });
                })
              }
            />
          )}
        </section>
      </div>

      {toast && (
        <div className={`adm-toast ${toast.kind}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}

/* ---------------- Bosh qism (Hero) ---------------- */

function SizeNote({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="adm-size">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function HeroEditor({ hero: h, onChange, site, onSite, storeReady, goStats }: { hero: Hero; onChange: (v: Hero) => void; site: SiteContent["site"]; onSite: (v: SiteContent["site"]) => void; storeReady: boolean; goStats: () => void }) {
  const up = (patch: Partial<Hero>) => onChange({ ...h, ...patch });
  const err = issuesOf(HeroSchema, h);
  const desktop = h.image || DEFAULT_HERO_IMAGE;
  return (
    <div className="adm-panel narrow">
      <h2>Bosh qism (Hero)</h2>
      <p className="adm-sub">
        Bosh sahifaning eng yuqorisidagi katta blok: fon rasmi, sarlavhalar, shiorlar, tugmalar va iqtibos. Ostidagi toʻrtta raqam —{" "}
        <button type="button" className="adm-linkbtn" onClick={goStats}>
          “Statistika”
        </button>{" "}
        boʻlimida.
      </p>

      <h3>Jonli koʻrinish</h3>
      <div className="adm-hero-prev" style={{ backgroundImage: `url("${desktop}")` }}>
        <div className="adm-hero-safe" aria-hidden="true" />
        <div className="adm-hero-txt">
          {h.eyebrow && <small>{h.eyebrow}</small>}
          <b>{h.title || "…"}</b>
          {h.subtitle && <em>{h.subtitle}</em>}
          {h.motto.length > 0 && <span className="m">{h.motto.join(" • ")}</span>}
          <span className="btns">
            <i className="p">{h.primaryLabel || "…"} →</i>
            {h.secondaryLabel && <i>{h.secondaryLabel} ▷</i>}
          </span>
        </div>
        <div className="adm-hero-q">“{site.quoteText}”</div>
      </div>
      <p className="adm-hint">Kompyuterda rasm 6 : 1 nisbatli tasma koʻrinishida chiqadi. Chap tomondagi xira maydonda matn turadi, oʻng tomonda iqtibos.</p>

      <h3>Fon rasmi — kompyuter</h3>
      <SizeNote
        rows={[
          ["Oʻlcham", "2560 × 428 px (eng yaxshi sifat)"],
          ["Eng kami", "1920 × 321 px"],
          ["Nisbat", "≈ 6 : 1 (kenglik balandlikdan 6 marta katta)"],
          ["Format", "JPG yoki WEBP, 600 KB gacha tavsiya, 30 MB gacha qabul qilinadi"],
          ["Muhim joy", "Asosiy obyekt (bino, odam) rasmning oʻrtasi va oʻng qismida boʻlsin. Chap 45% matn ostida qoladi — u yer ochiq, osoyishta fon boʻlsin."],
          ["Kesilish", "Rasm ekranga “cover” usulida joylanadi: tepasi saqlanadi, ortiqcha pastki qismi kesilishi mumkin."],
        ]}
      />
      <Field label="Kompyuter rasmi" hint={h.image ? "" : "Hozir standart rasm ishlatilmoqda (2560 × 428 px). Yangisini yuklasangiz, u almashtiriladi."} error={err.image}>
        <Upload value={h.image} onChange={(v) => up({ image: v })} disabled={!storeReady} />
      </Field>

      <h3>Fon rasmi — telefon (ixtiyoriy)</h3>
      <SizeNote
        rows={[
          ["Oʻlcham", "1080 × 1350 px (tik, 4 : 5)"],
          ["Eng kami", "750 × 940 px"],
          ["Qachon chiqadi", "Ekran kengligi 980 px va undan kichik boʻlganda (telefon, planshet)"],
          ["Muhim joy", "Asosiy obyektni markazga va yuqori yarmiga joylang — pastki qismida tugmalar turadi."],
          ["Yuklanmasa", "Telefonda ham kompyuter rasmi ishlatiladi (oʻrta-oʻng qismi koʻrinadi)."],
        ]}
      />
      <Field label="Telefon rasmi" error={err.imageMobile}>
        <Upload value={h.imageMobile} onChange={(v) => up({ imageMobile: v })} disabled={!storeReady} />
      </Field>

      <h3>Matnlar</h3>
      <Field label="Kichik sarlavha (yuqorida)" hint="Masalan: Yangi Oʻzbekiston — Yangi avlod. Boʻsh qoldirilsa chiqmaydi." error={err.eyebrow}>
        <input value={h.eyebrow} maxLength={80} onChange={(e) => up({ eyebrow: e.target.value })} />
      </Field>
      <Field label="Katta sarlavha" hint="Tavsiya: 14 belgigacha — bir qatorga sigʻadi." error={err.title}>
        <input value={h.title} maxLength={40} onChange={(e) => up({ title: e.target.value })} />
      </Field>
      <Field label="Ostki sarlavha (oltin rang)" hint="Boʻsh qoldirilsa chiqmaydi." error={err.subtitle}>
        <input value={h.subtitle} maxLength={60} onChange={(e) => up({ subtitle: e.target.value })} />
      </Field>
      <Field label="Shiorlar" hint="Har bir shior alohida qatorda. 5 tagacha. Oralariga • belgisi oʻzi qoʻyiladi." error={err.motto}>
        <textarea
          rows={3}
          value={h.motto.join("\n")}
          onChange={(e) =>
            up({
              motto: e.target.value
                .split("\n")
                .map((x) => x.trimStart())
                .slice(0, 5),
            })
          }
          onBlur={() => up({ motto: h.motto.map((x) => x.trim()).filter(Boolean) })}
        />
      </Field>

      <h3>Tugmalar</h3>
      <div className="adm-grid2">
        <Field label="1-tugma (koʻk) matni" error={err.primaryLabel}>
          <input value={h.primaryLabel} maxLength={40} onChange={(e) => up({ primaryLabel: e.target.value })} />
        </Field>
        <Field label="1-tugma havolasi" hint="Masalan: /yosh-siyosatchilar" error={err.primaryHref}>
          <input value={h.primaryHref} onChange={(e) => up({ primaryHref: e.target.value })} />
        </Field>
        <Field label="2-tugma (oq) matni" hint="Boʻsh qoldirilsa tugma chiqmaydi." error={err.secondaryLabel}>
          <input value={h.secondaryLabel} maxLength={40} onChange={(e) => up({ secondaryLabel: e.target.value })} />
        </Field>
        <Field label="2-tugma havolasi" hint="Masalan: /loyiha-haqida" error={err.secondaryHref}>
          <input value={h.secondaryHref} onChange={(e) => up({ secondaryHref: e.target.value })} />
        </Field>
      </div>

      <h3>Iqtibos (oʻng tomonda)</h3>
      <Field label="Iqtibos matni" hint="Qoʻshtirnoqlarsiz yozing. Tavsiya: 110 belgigacha — 3 qatorga sigʻadi.">
        <textarea rows={3} value={site.quoteText} onChange={(e) => onSite({ ...site, quoteText: e.target.value })} />
      </Field>
      <Field label="Iqtibos muallifi">
        <input value={site.quoteAuthor} onChange={(e) => onSite({ ...site, quoteAuthor: e.target.value })} />
      </Field>
    </div>
  );
}

/* ---------------- Roʻyxat tahrirlovchisi (umumiy) ---------------- */

type ListProps<T> = {
  title: string;
  hint: string;
  items: T[];
  onChange: (v: T[]) => void;
  open: number | null;
  setOpen: (i: number | null) => void;
  make: () => T;
  thumb: (t: T) => string;
  primary: (t: T) => string;
  secondary: (t: T) => string;
  validate: (t: T) => Record<string, string>;
  form: (t: T, up: (patch: Partial<T>) => void, err: Record<string, string>, isNew: boolean) => React.ReactNode;
};

function ListEditor<T>({ title, hint, items, onChange, open, setOpen, make, thumb, primary, secondary, validate, form }: ListProps<T>) {
  const [fresh, setFresh] = useState<number | null>(null);
  const errors = useMemo(() => items.map(validate), [items, validate]);
  const bad = errors.filter((e) => Object.keys(e).length).length;
  const up = (i: number) => (patch: Partial<T>) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <div>
          <h2>{title}</h2>
          <p className="adm-sub">{hint}</p>
        </div>
        <button
          type="button"
          className="adm-btn primary"
          onClick={() => {
            onChange([make(), ...items]);
            setOpen(0);
            setFresh(0);
          }}
        >
          + Qoʻshish
        </button>
      </div>
      {bad > 0 && <p className="adm-alert">{bad} ta yozuvda toʻldirilmagan yoki notoʻgʻri maydon bor — saqlashdan oldin tuzating.</p>}
      {items.length === 0 && <p className="adm-empty">Hozircha yozuv yoʻq. “+ Qoʻshish” tugmasini bosing.</p>}
      <ul className="adm-list">
        {items.map((it, i) => {
          const err = errors[i];
          const isOpen = open === i;
          return (
            <li key={i} className={`${isOpen ? "open" : ""}${Object.keys(err).length ? " invalid" : ""}`}>
              <div className="adm-item">
                <span className="adm-item-thumb">{thumb(it) ? <img src={thumb(it)} alt="" /> : null}</span>
                <button type="button" className="adm-item-main" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <b>{primary(it)}</b>
                  <span>{secondary(it)}</span>
                </button>
                <div className="adm-item-actions">
                  <button type="button" className="adm-icon" title="Yuqoriga" aria-label="Yuqoriga" disabled={i === 0} onClick={() => (onChange(move(items, i, -1)), setOpen(null), setFresh(null))}>
                    ↑
                  </button>
                  <button type="button" className="adm-icon" title="Pastga" aria-label="Pastga" disabled={i === items.length - 1} onClick={() => (onChange(move(items, i, 1)), setOpen(null), setFresh(null))}>
                    ↓
                  </button>
                  <button type="button" className="adm-btn" onClick={() => setOpen(isOpen ? null : i)}>
                    {isOpen ? "Yopish" : "Tahrirlash"}
                  </button>
                  <ConfirmDelete
                    onConfirm={() => {
                      onChange(items.filter((_, j) => j !== i));
                      setOpen(null);
                      setFresh(null);
                    }}
                  />
                </div>
              </div>
              {isOpen && <div className="adm-form">{form(it, up(i), err, fresh === i)}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function History({ versions, onRestore, disabled }: { versions: Version[]; onRestore: (url: string) => void; disabled: boolean }) {
  const [ask, setAsk] = useState<string | null>(null);
  return (
    <div className="adm-panel narrow">
      <h2>Saqlash tarixi</h2>
      <p className="adm-sub">Oxirgi 30 ta saqlangan holat. Avvalgi holatni tiklasangiz, u yangi versiya sifatida saqlanadi — hozirgi holat ham tarixda qoladi.</p>
      {disabled && <p className="adm-alert">Avval joriy oʻzgarishlarni saqlang yoki sahifani yangilang.</p>}
      {versions.length === 0 && <p className="adm-empty">Hali saqlangan versiya yoʻq. Birinchi saqlashdan keyin bu yerda paydo boʻladi.</p>}
      <ul className="adm-versions">
        {versions.map((v, i) => (
          <li key={v.url}>
            <span>
              <b>{fmtDate(v.uploadedAt)}</b>
              {i === 0 && <em>joriy</em>}
            </span>
            {i > 0 &&
              (ask === v.url ? (
                <button type="button" className="adm-btn danger" disabled={disabled} onClick={() => onRestore(v.url)}>
                  Tiklashni tasdiqlash
                </button>
              ) : (
                <button type="button" className="adm-btn" disabled={disabled} onClick={() => setAsk(v.url)}>
                  Tiklash
                </button>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
