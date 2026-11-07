import Image from "next/image";
import Link from "next/link";
import { fieldBySlug } from "@/lib/data";
import type { Person } from "@/lib/content";
import { Chevron, Pin } from "./Icons";

export const PLACEHOLDER = "/images/placeholder-person.svg";

export default function PersonCard({ person, regionName, priority = false }: { person: Person; regionName: string; priority?: boolean }) {
  const field = fieldBySlug(person.field)?.name ?? "";
  const [a, b] = field.split(" va ");

  // Toʻliq karta dizayni yuklangan boʻlsa: rasm butun kartani qoplaydi, faqat tugma qoʻshiladi
  if (person.cardImage) {
    return (
      <Link className="person person-full" href={`/yosh-siyosatchilar/${person.slug}`}>
        <Image src={person.cardImage} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 18vw" priority={priority} />
        <span className="sr-only">
          {person.name} — {field}, {regionName}
        </span>
        <span className="circle-arrow" aria-hidden="true">
          <Chevron />
        </span>
      </Link>
    );
  }

  return (
    <Link className="person" href={`/yosh-siyosatchilar/${person.slug}`}>
      <span className="ph">
        <Image src={person.photo || PLACEHOLDER} alt={person.name} width={312} height={244} sizes="(max-width: 640px) 40vw, 12vw" priority={priority} />
      </span>
      <div className="info">
        <h3>{person.name}</h3>
        <p className="field">
          {b ? (
            <>
              {a} va <b>{b}</b>
            </>
          ) : (
            field
          )}
        </p>
        <span className="loc">
          <Pin />
          <span>{regionName}</span>
        </span>
      </div>
      <span className="circle-arrow" aria-hidden="true">
        <Chevron />
      </span>
    </Link>
  );
}
