import Image from "next/image";
import { fieldBySlug } from "@/lib/data";
import type { Idea } from "@/lib/content";
import { QuoteMark } from "./Icons";

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <figure className="idea">
      <QuoteMark className="q" />
      <blockquote>“{idea.text}”</blockquote>
      <footer>
        <Image src={idea.avatar || "/images/placeholder-person.svg"} alt="" width={84} height={92} />
        <div>
          <b>{idea.author}</b>
          <span>{fieldBySlug(idea.field)?.name}</span>
        </div>
      </footer>
    </figure>
  );
}
