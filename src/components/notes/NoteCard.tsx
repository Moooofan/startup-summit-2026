import Image from "next/image";
import Link from "next/link";
import { formatNoteDate, type Note } from "@/data/notes";

/* 玻璃邊：左上青白亮邊，中段近乎消失，右下一段較弱的藍 —— 邊緣受光不均才讀得出是玻璃。
   太亮或太淡只調這兩組 alpha；hover 版是同形、整體提亮一階。 */
const EDGE =
  "bg-[linear-gradient(135deg,rgb(160_236_255/0.55)_0%,rgb(150_178_255/0.1)_38%,rgb(150_178_255/0.06)_62%,rgb(90_140_255/0.3)_100%)]";
const EDGE_HOVER =
  "bg-[linear-gradient(135deg,rgb(190_244_255/0.9)_0%,rgb(150_178_255/0.24)_38%,rgb(150_178_255/0.16)_62%,rgb(110_160_255/0.6)_100%)]";

/** 列表卡。外層是 1px 的漸層框，內層才是卡面。 */
export function NoteCard({ note, priority = false }: { note: Note; priority?: boolean }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className={`group relative block h-full rounded-card p-px transition-shadow duration-500 hover:shadow-[0_0_36px_-10px_rgb(77_159_240/0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-glow ${EDGE}`}
    >
      {/* hover 提亮疊一層淡入：只動 opacity，漸層本身不能做 transition */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-card opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${EDGE_HOVER}`}
      />

      {/* 卡面要不透光（.card-solid 是 0.92）：否則外層的漸層會整片透進來，而不是只剩 1px 的邊 */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-[rgb(9_16_58)]">
        {/* 沒有封面就不留空框，卡片直接從文字開始 */}
        {note.cover && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={note.cover.src}
              alt={note.cover.alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span aria-hidden className="photo-sink" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <p className="text-[16px] text-ink-4">
            <span className="font-medium text-orbit-sky">{note.author}</span>
            <span className="mx-1.5">・</span>
            <span className="font-display tracking-wide">{formatNoteDate(note.date)}</span>
          </p>
          <h3 className="mt-3 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-brand-lift">
            {note.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-[17px] leading-[1.8] text-ink-2">{note.summary}</p>
        </div>

        {/* 上緣鏡面高光。獨立一層疊在最上面：inset 陰影掛在卡面自己身上會被照片蓋掉 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[15px] shadow-[inset_0_1px_0_rgb(255_255_255/0.14)]"
        />
      </div>
    </Link>
  );
}
