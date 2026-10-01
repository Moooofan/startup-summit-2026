import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { notes, getNote, formatNoteDate, noteEditionLabel } from "@/data/notes";
import { isPublicRoute } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { BackLink } from "@/components/site/BackLink";
import { PrevNextNav } from "@/components/site/PrevNextNav";
import { NoteBody } from "@/components/notes/NoteBody";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/site/JsonLd";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return {};

  // 標題帶作者：三篇的標題是中性描述，沒有作者名在搜尋結果裡分不出誰寫的
  const title = `${n.title}｜${n.author}`;

  return {
    title,
    description: n.summary,
    alternates: { canonical: `/notes/${n.slug}` },
    openGraph: {
      type: "article",
      title,
      description: n.summary,
      url: `/notes/${n.slug}`,
      publishedTime: n.date,
      ...(n.cover ? { images: [{ url: n.cover.src, alt: n.cover.alt }] } : {}),
    },
    ...(isPublicRoute("/notes") ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) notFound();

  // notes 是新到舊：前一筆是較新的文章
  const idx = notes.findIndex((x) => x.slug === slug);
  const newer = idx > 0 ? notes[idx - 1] : null;
  const older = idx < notes.length - 1 ? notes[idx + 1] : null;

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: "首頁", path: "/" },
          { name: "精華筆記", path: "/notes" },
          { name: n.title, path: `/notes/${n.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={n.title}
        summary={n.summary}
        slug={n.slug}
        date={n.date}
        author={n.author}
        sourceUrl={n.sourceUrl}
        image={n.cover?.src}
      />

      <article className="grain relative pb-24 pt-[112px] md:pt-[148px]">
        <div className="shell relative">
          <div className="mx-auto max-w-3xl">
            <Reveal y={12}>
              <BackLink
                fallbackHref="/notes"
                className="inline-flex items-center gap-2 text-[17px] text-ink-3 transition-colors hover:text-ink"
              >
                <ArrowLeft size={14} />
                回到精華筆記
              </BackLink>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="mt-10 text-[16px] font-medium tracking-[0.16em] text-accent">
                {noteEditionLabel(n.edition)}年會筆記
              </p>
              <h1 className="mt-4 text-[clamp(1.9rem,4.6vw,2.75rem)] font-black leading-tight text-ink">
                {n.title}
              </h1>
              {/* summary 是內文開頭的原句，內頁不再印一次（只給列表卡與 meta description） */}
              {/* 作者名連到原文（業主 2026/10）。原本整頁不放原文連結，現在改成掛在作者名上 ——
                  不是獨立一行的「原文連結」，而是署名本身就是出處。

                  只有內頁能這樣做：列表卡（NoteCard）整張卡是一個 <Link>，在裡面再放 <a>
                  會變成巢狀連結，HTML 不允許、瀏覽器解析時會把它拆開。那裡維持純文字。

                  用原生 <a> 而非 next/link：站外網址沒有預先載入可言，與 Hero 的地圖連結、
                  Footer 的社團連結同一個慣例。aria-label 說明去向 ——
                  只念「詹益鑑」螢幕閱讀器使用者不會知道那是一個往站外的連結。 */}
              <p className="mt-5 text-[18px] text-ink-2">
                <a
                  href={n.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`在 Facebook 閱讀 ${n.author} 的原文`}
                  className="font-medium text-orbit-sky underline-offset-4 transition-colors hover:text-brand-lift hover:underline"
                >
                  {n.author}
                </a>
                <span className="mx-2 text-ink-4">・</span>
                <span className="font-display tracking-wide text-ink-3">{formatNoteDate(n.date)}</span>
              </p>
            </Reveal>

            {/* 封面若已出現在內文圖片中，頁首不再印一次 */}
            {n.cover && !n.blocks.some((b) => b.type === "image" && b.src === n.cover?.src) && (
              <Reveal delay={0.1}>
                {/* w-fit：貼文照片解析度有限（寬 590–960px），不硬放大到欄寬 */}
                <div className="relative mt-10 w-fit max-w-full overflow-hidden rounded-card border border-line-soft">
                  <Image
                    src={n.cover.src}
                    alt={n.cover.alt}
                    width={n.cover.width}
                    height={n.cover.height}
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="h-auto max-w-full"
                  />
                  <span aria-hidden className="photo-sink" />
                </div>
              </Reveal>
            )}

            <Reveal delay={0.14}>
              <div className="mt-10 border-t border-line-soft pt-10">
                <NoteBody blocks={n.blocks} />
              </div>
            </Reveal>

            {(newer || older) && (
              <Reveal delay={0.1}>
                <PrevNextNav
                  ariaLabel="其他筆記"
                  prevLabel="上一篇"
                  nextLabel="下一篇"
                  prev={newer && { href: `/notes/${newer.slug}`, title: newer.title }}
                  next={older && { href: `/notes/${older.slug}`, title: older.title }}
                />
              </Reveal>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
