/** 站台設定。上線前需替換的外部連結集中在此。 */
export const site = {
  url: "https://startup-summit-2026.vercel.app", // TODO: 接上正式網域後改這裡
  name: "2026 第四屆台灣新創投資年會",
  description:
    "2026 第四屆台灣新創投資年會・雙峰論壇。10/14 創辦人論壇、10/15 投資人論壇，38 位創業家與機構投資人齊聚華南金控國際會議中心。",
};

/**
 * 報名去向（2026/9 業主提供 Accupass 活動頁後接上，先前是佔位錨點 "#tickets"）。
 *
 * 這兩支常數是全站報名的單一開關，改值不必動任何呼叫端：
 * - `REGISTER_URL`：Hero、導覽列（含手機選單）、首頁票卡、/tickets 票卡都吃它。
 *   值是外部網址時，Cta 與導覽列會自動加 target="_blank"（見 isExternalHref）。
 * - `REGISTER_READY`：同時控制三件事 —— 導覽列報名鈕是否出現（Nav 的 showRegisterCta）、
 *   票卡按鈕文字（「立即報名」／「報名即將開放」）、以及 Event JSON-LD 的
 *   offers.availability（InStock／PreOrder）與 offers.url。
 *
 * 兩支要一起改：只把 READY 打開而 URL 還是錨點，JSON-LD 的 offers[].url 會變成
 * "#tickets" 這種非絕對網址的非法值。
 */
export const REGISTER_URL = "https://www.accupass.com/event/2608171137481477207040";
export const REGISTER_READY = true;

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

/**
 * 是否為站外網址（決定要不要開新分頁）。
 *
 * 只認 http(s)：mailto: 開新分頁沒有意義（/sponsor 的贊助洽談鈕就是把 mailto 丟給 Cta），
 * 站內路徑與 #錨點更不該開新分頁。
 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export const SPONSOR_CONTACT = "mailto:2026tsic@gmail.com?subject=2026%20台灣新創投資年會%20贊助洽談";
