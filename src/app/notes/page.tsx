import type { Metadata } from "next";
import { notes, noteEditionLabel, type Note } from "@/data/notes";
import { editions } from "@/data/review";
import { isPublicRoute } from "@/lib/config";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { NoteCard } from "@/components/notes/NoteCard";
import { BreadcrumbJsonLd, NoteListJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  title: "精華筆記",
  description: "台灣新創投資年會精華筆記：歷屆與會者寫下的現場筆記與心得，經作者授權轉載。",
  alternates: { canonical: "/notes" },
  // 不在 PUBLIC_ROUTES 時不給索引（同 /about 等隱藏頁），開關一改自動切換
  ...(isPublicRoute("/notes") ? {} : { robots: { index: false, follow: true } }),
};

/** 依屆別分組，新屆在前；組內維持 notes 的新到舊順序 */
const groups = ([3, 2, 1] as const)
  .map((no) => ({
    no,
    year: editions.find((e) => e.no === no)?.year,
    items: notes.filter((n: Note) => n.edition === no),
  }))
  .filter((g) => g.items.length > 0);

export default function NotesPage() {
  return (
    <>
      <NoteListJsonLd items={notes.map((n) => ({ title: n.title, slug: n.slug }))} />
      <BreadcrumbJsonLd
        trail={[
          { name: "首頁", path: "/" },
          { name: "精華筆記", path: "/notes" },
        ]}
      />

      {/* overflow-x-clip 而非 overflow-hidden：光暈比頁首高，理由見 app/review/page.tsx */}
      <section className="grain relative overflow-x-clip pb-12 pt-[132px] md:pb-16 md:pt-[176px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[12%] -top-[20%] h-[64vw] max-h-[880px] w-[64vw] max-w-[880px] rounded-full bg-[radial-gradient(circle,rgb(95_137_255/0.07)_0%,rgb(95_137_255/0.025)_40%,transparent_72%)]"
        />
        <div className="shell relative">
          <Reveal>
            <SectionHead
              as="h1"
              eyebrow="NOTES"
              ghost="NOTES"
              title="精華筆記"
              lead="歷屆與會者寫下的現場筆記與心得，看他們從年會帶走了什麼。"
            />
          </Reveal>
        </div>
      </section>

      <section className="relative pb-24 pt-6 md:pb-28 md:pt-10">
        <div className="shell space-y-16">
          {groups.length === 0 && <p className="text-[18px] text-ink-3">精華筆記將於近期公布。</p>}
          {groups.map((g, gi) => (
            <div key={g.no}>
              <Reveal>
                <header className="flex items-baseline gap-x-4 border-b border-line-soft pb-5">
                  <h2 className="text-xl font-bold text-ink md:text-2xl">{noteEditionLabel(g.no)}</h2>
                  {g.year && <span className="font-display text-sm text-ink-4">{g.year}</span>}                </header>
              </Reveal>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((n, i) => (
                  <li key={n.slug}>
                    <Reveal delay={Math.min(i, 5) * 0.06} className="h-full">
                      <NoteCard note={n} priority={gi === 0 && i < 3} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
