/** 站台設定。上線前需替換的外部連結集中在此。 */
export const site = {
  url: "https://startup-summit-2026.vercel.app", // TODO: 接上正式網域後改這裡
  name: "2026 第四屆台灣新創投資年會",
  description:
    "2026 第四屆台灣新創投資年會・雙峰論壇。10/14 創辦人論壇、10/15 投資人論壇，38 位創業家與機構投資人齊聚華南金控國際會議中心。",
};

/** TODO: 尚未取得 Accupass 活動連結，先導向報名區塊。 */
export const REGISTER_URL = "#tickets";
export const REGISTER_READY = false;

/**
 * 暫時只對外開放的分頁（2026/8 業主指示）。
 *
 * 其餘分頁（/about、/agenda、/tickets、/sponsor）的**程式碼與路由全部保留**，
 * 只是從導覽列、頁尾、sitemap 與站內連結中隱藏，讓使用者點不到、搜尋引擎不收錄。
 * 直接輸入網址仍然打得開 —— 這是刻意的，方便後續繼續施工與內部預覽。
 *
 * 要恢復完整站台：把 PUBLIC_ROUTES 改回包含全部路徑即可，不需要改任何元件。
 */
export const PUBLIC_ROUTES = ["/", "/speakers", "/review"] as const;

/** 某條路徑目前是否對外可見（供導覽列／頁尾／sitemap 過濾用）。 */
export function isPublicRoute(href: string): boolean {
  // 只看路徑本身，忽略 #錨點與 ?query（例如 /about#faq 也算 /about）
  const path = href.split("#")[0].split("?")[0];
  if (!path.startsWith("/")) return true; // 外部連結／mailto 不受限
  return (PUBLIC_ROUTES as readonly string[]).includes(path);
}

export const SPONSOR_CONTACT = "mailto:hm8827@gmail.com?subject=2026%20台灣新創投資年會%20贊助洽談";
