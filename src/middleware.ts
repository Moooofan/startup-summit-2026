import { NextResponse, type NextRequest } from "next/server";
import { cleanPath, safeDecode } from "@/lib/cleanPath";

/**
 * 修正「網址尾巴黏到標點或隱形字元」的連結，直接轉到乾淨的網址。
 * 規則與實際案例見 lib/cleanPath.ts。
 *
 * 為什麼在伺服器端轉，而不是在 404 頁用 JS 補救（初版做法）：
 * - Facebook 抓連結預覽卡時不執行 JS，只會看到 404，預覽卡出不來
 * - JS 補救要先載入 404 頁才跳轉，使用者會先看到一閃而過的 404
 *
 * 用 307 而非 308：永久轉址會被瀏覽器長期快取，萬一清理規則誤判某條正常路徑，
 * 修好程式也救不回已快取的使用者。這些髒網址本來就不需要被搜尋引擎收錄，暫時轉址沒有損失。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cleaned = cleanPath(pathname);

  // 絕大多數請求走這條：路徑本來就乾淨，原樣放行
  if (cleaned === safeDecode(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = cleaned; // 查詢字串（例如 Facebook 的 fbclid）原樣保留
  return NextResponse.redirect(url, 307);
}

export const config = {
  // 排除 Next.js 內部資源：建置產物與 next/image 最佳化請求量大，且路徑不會有這類問題
  matcher: ["/((?!_next/).*)"],
};
