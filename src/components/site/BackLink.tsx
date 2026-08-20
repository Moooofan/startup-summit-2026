"use client";

import { useRouter } from "next/navigation";

/**
 * 「回上一頁」按鈕：優先用瀏覽器返回（會還原原本的捲動位置 → 回到剛剛看的那位講者附近），
 * 若沒有可返回的歷史（例如直接開講者頁），才退回 fallbackHref。
 */
export function BackLink({
  fallbackHref,
  className,
  children,
}: {
  fallbackHref: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
    >
      {children}
    </button>
  );
}
