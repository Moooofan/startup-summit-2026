import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Item = { href: string; title: string };

const pill =
  "glass group inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[16px] text-ink-2 transition-colors hover:border-white/22 hover:text-ink";

/** 內頁底部的上下筆切換（筆記與講者內頁共用，兩處樣式必須一致）。
 *  業主 2026/10：原本是兩張半寬卡片，改成左右兩顆小按鈕 ——
 *  去向的標題不再印在畫面上，改放 aria-label 與 title。 */
export function PrevNextNav({
  ariaLabel,
  prevLabel,
  nextLabel,
  prev,
  next,
}: {
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
  prev: Item | null;
  next: Item | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-20 flex items-center justify-between gap-3 border-t border-line-soft pt-10"
    >
      {/* replace：瀏覽器返回一次就回到列表，不必逐筆倒退 */}
      {prev ? (
        <Link
          href={prev.href}
          replace
          aria-label={`${prevLabel}：${prev.title}`}
          title={prev.title}
          className={pill}
        >
          <ArrowLeft size={14} aria-hidden className="shrink-0 text-ink-4" />
          {prevLabel}
        </Link>
      ) : (
        // 佔位：沒有上一筆時讓下一筆仍靠右
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          replace
          aria-label={`${nextLabel}：${next.title}`}
          title={next.title}
          className={pill}
        >
          {nextLabel}
          <ArrowRight size={14} aria-hidden className="shrink-0 text-ink-4" />
        </Link>
      )}
    </nav>
  );
}
