import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 「這一疊卡片可以左右滑」的提示。
 *
 * 為什麼需要它：牌堆的側卡必須糊掉（`blur-[5px]`）—— 卡面是玻璃、幾乎透明，
 * 不糊的話後卡的字會穿過前卡與前卡的字疊在一起。但糊掉之後，側卡從「露出一角的另一張卡」
 * 變成「邊上的一團陰影」，可滑動這件事就沒有任何線索了（2026/9 使用者回報：
 * 論壇卡與票卡都看不出可以滑）。blur 不能拿掉，所以改成把提示講出來。
 *
 * 下方那排頁籤按鈕不能取代這個提示：它們讀起來是「分頁標籤」，
 * 傳達的是「有兩個東西」，不是「這一疊可以用手指撥」。
 *
 * `aria-hidden` 是刻意的：滑動是指標裝置的操作，螢幕閱讀器使用者走的是
 * 側卡上那顆有 aria-label 的覆蓋鈕與下方頁籤，對他們念出「左右滑動」只是雜訊。
 *
 * 箭頭用 globals.css 既有的 nudge 動畫（那組 keyframes 本來就是為這件事寫的，
 * 一直沒有呼叫點）。兩端關鍵影格相同 → prefers-reduced-motion 會停在原位，
 * 不會卡在偏移最大的地方。
 */
export function SwipeHint({ className }: { className?: string }) {
  return (
    <p
      aria-hidden
      className={cn(
        "pointer-events-none flex items-center justify-center gap-2 text-[15px] text-ink-4",
        className
      )}
    >
      <ChevronLeft className="animate-nudge-l h-4 w-4" strokeWidth={2} />
      左右滑動切換
      <ChevronRight className="animate-nudge-r h-4 w-4" strokeWidth={2} />
    </p>
  );
}
