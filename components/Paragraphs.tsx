/** Oddiy matnni (boʻsh qator bilan ajratilgan) xavfsiz paragraflarga aylantiradi */
export default function Paragraphs({ text }: { text: string }) {
  return (
    <div className="prose">
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}
