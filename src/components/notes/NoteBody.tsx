import { Fragment } from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import type { NoteBlock } from "@/data/notes";

/* 原文裡的「→」不直接印：不在 Montserrat 與 Noto Sans TC 內，會掉到系統備援字型
   （見 CLAUDE.md 鐵則）。資料照原文留著，這裡換成圖示，做法同 Hero 的日期箭頭。 */
function Text({ text }: { text: string }) {
  const parts = text.split("→");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <MoveRight
                aria-hidden
                strokeWidth={1.5}
                className="inline h-[1em] w-[1em] align-[-0.12em]"
              />
              <span className="sr-only">至</span>
            </>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

type ImageBlock = Extract<NoteBlock, { type: "image" }>;
type Row = Exclude<NoteBlock, ImageBlock> | { type: "images"; items: ImageBlock[] };

/** 相鄰的圖片併成一組（相鄰保序，同 PastSpeakerRoster 的 groupByTopic）——
 *  多張照片各佔一列會拉出一長串，成組後才能左右並排。 */
function groupImages(blocks: NoteBlock[]): Row[] {
  const rows: Row[] = [];
  for (const b of blocks) {
    const last = rows[rows.length - 1];
    if (b.type !== "image") rows.push(b);
    else if (last?.type === "images") last.items.push(b);
    else rows.push({ type: "images", items: [b] });
  }
  return rows;
}

/** 文章內文：依區塊型別輸出。樣式沿用站內既有寫法（講者 bio、FounderNote 的條列與引言）。 */
export function NoteBody({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <div className="space-y-6">
      {groupImages(blocks).map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              // whitespace-pre-line：原文的編號列與 hashtag 列靠 "\n" 分行
              <p key={i} className="whitespace-pre-line text-[18px] leading-[2] text-ink-2">
                <Text text={b.text} />
              </p>
            );
          case "h2":
            return (
              // 小標上方多留一段，才讀得出是新的一節而不是上一段的延續
              <h2 key={i} className="pt-6 text-2xl font-bold leading-snug text-ink">
                <Text text={b.text} />
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-2 text-xl font-bold leading-snug text-ink">
                <Text text={b.text} />
              </h3>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2.5">
                {b.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[18px] leading-[1.9] text-ink-2">
                    <span aria-hidden className="mt-[0.85em] h-1 w-1 shrink-0 rounded-full bg-orbit-sky" />
                    <span>
                      <Text text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-brand-lift/60 pl-6">
                <p className="text-[clamp(1.15rem,2.6vw,1.4rem)] font-medium leading-[1.75] text-ink">
                  <Text text={b.text} />
                </p>
                {b.source && <footer className="mt-3 text-[17px] text-ink-4">— {b.source}</footer>}
              </blockquote>
            );
          case "images": {
            // 單張維持原寸（w-fit，貼文照片解析度有限不硬放大）；多張兩欄並排、保留原比例不裁切
            const multi = b.items.length > 1;
            return (
              <div key={i} className={multi ? "grid grid-cols-2 items-start gap-3 sm:gap-4" : undefined}>
                {b.items.map((img) => (
                  <figure key={img.src}>
                    <div
                      className={`relative overflow-hidden rounded-card border border-line-soft ${
                        multi ? "" : "w-fit max-w-full"
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes={multi ? "(max-width: 768px) 50vw, 384px" : "(max-width: 768px) 100vw, 768px"}
                        className={multi ? "h-auto w-full" : "h-auto max-w-full"}
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="mt-3 text-[16px] leading-relaxed text-ink-4">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            );
          }
        }
      })}
    </div>
  );
}
