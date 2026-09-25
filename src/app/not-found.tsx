import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { Cta } from "@/components/ui/Cta";

/**
 * 全站 404。
 *
 * 在此之前沒有這支檔案，Next.js 會用內建的英文黑底 404，頁面上除了導覽列
 * 沒有任何出路 —— 從 Facebook 內建瀏覽器點進來的人連返回鍵都不一定看得到。
 * 這裡至少給中文說明與回到主要頁面的連結。
 *
 * 「網址尾巴黏到標點或隱形字元」那種 404 由 src/middleware.ts 在伺服器端直接轉址修掉，
 * 不會走到這裡；會看到這頁的是真正不存在的網址（打錯字、已下架的講者頁）。
 *
 * Next.js 會自動替 404 回應加上 noindex，這裡不必再設 metadata。
 */
export default function NotFound() {
  return (
    <section className="grain relative overflow-x-clip pb-24 pt-[132px] md:pb-32 md:pt-[176px]">
      <div className="shell relative">
        <SectionHead
          as="h1"
          align="center"
          eyebrow="404"
          title="找不到這個頁面"
          lead="網址可能打錯了，或這個頁面已經不在了。可以從下面的連結回到年會的主要頁面。"
        />

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Cta href="/" variant="gradient" size="lg">
            回到首頁
          </Cta>
          <Cta href="/tickets" variant="ghost" size="lg">
            報名資訊
          </Cta>
        </div>

        <nav aria-label="主要頁面" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[15px] text-ink-3">
            <li>
              <Link href="/speakers" className="transition-colors hover:text-ink">
                講者陣容
              </Link>
            </li>
            <li>
              <Link href="/agenda" className="transition-colors hover:text-ink">
                議程
              </Link>
            </li>
            <li>
              <Link href="/sponsor" className="transition-colors hover:text-ink">
                贊助方案
              </Link>
            </li>
            <li>
              <Link href="/review" className="transition-colors hover:text-ink">
                歷屆回顧
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
