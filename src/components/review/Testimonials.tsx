import type { Testimonial } from "@/data/review";

/**
 * 過往參與者好評留言 —— 版位已保留，資料由 Vincent 撈取後填入。
 *
 * 目前 `testimonials` 為空陣列 → 整個區塊不渲染（不會留一個空標題在頁面上）。
 * 待補欄位見 data/review.ts 的 Testimonial 介面：
 * 留言內容／姓名／職稱／公司／哪一屆／是否同意具名引用。
 *
 * consent 為 false 時顯示為「第 N 屆與會者」，不揭露姓名。
 */

const CN_NO = ["一", "二", "三", "四"] as const;

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t, i) => (
        <li key={i} className="glass flex flex-col rounded-card p-7">
          <blockquote className="flex-1">
            <p className="text-[18px] leading-[1.95] text-ink-2">
              <span aria-hidden className="mr-1 text-orbit-sky">
                「
              </span>
              {t.quote}
              <span aria-hidden className="ml-0.5 text-orbit-sky">
                」
              </span>
            </p>
          </blockquote>
          <footer className="mt-6 border-t border-line-soft pt-5">
            {t.consent ? (
              <>
                <p className="text-[18px] font-medium text-ink">{t.name}</p>
                <p className="mt-1 text-[17px] leading-relaxed text-ink-4">
                  {t.org}
                  {t.title && `　${t.title}`}
                </p>
              </>
            ) : (
              /* 未取得具名同意 → 匿名呈現 */
              <p className="text-[17px] text-ink-4">
                第{CN_NO[t.edition - 1]}屆與會者
              </p>
            )}
          </footer>
        </li>
      ))}
    </ul>
  );
}
