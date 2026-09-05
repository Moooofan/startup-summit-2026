/**
 * 活動核心資料。
 * 事實來源：《第四屆新創投資年會企劃 新增贊助方案.pptx》(2026/8/3)
 * 標記 TODO 者為簡報未載明、需主辦方提供的欄位。
 */

export const event = {
  edition: 4,
  editionLabel: "第四屆",
  name: "台灣新創投資年會",
  fullName: "2026 第四屆台灣新創投資年會",
  subtitle: "雙峰論壇",
  nameEn: "Taiwan Startup Investment Annual Conference",
  year: 2026,

  tagline: "資本連結創新",
  taglineSub: "讓每一次連結，成為新價值的起點",

  /** 本屆主軸（業主 2026/9 提供）。與 tagline「資本連結創新」分工：
   *  tagline 是年會這個品牌的長期定位，theme 是「今年這一屆」要談的題目，每屆會換。
   *  下游：首頁 About 的區塊大標與內文各引用一次、llms.txt 的活動事實區段。
   *  中間的「 · 」前後各留一個半形空格 —— 大標與內文吃的是同一個字串，
   *  不要在呼叫端各自補標點，否則兩處的寫法會慢慢分岔。 */
  theme: "等待黎明 · 擁抱變革",

  /** ISO 8601（台北時間）— 給倒數計時與 Event JSON-LD 用 */
  startDate: "2026-10-14T09:00:00+08:00",
  endDate: "2026-10-15T17:00:00+08:00",
  dateLabel: "10.14 ⟶ 10.15",
  dateLabelLong: "2026 年 10 月 14 日（三）— 10 月 15 日（四）",
  timeLabel: "09:00 – 17:00",

  venue: {
    name: "華南金控國際會議中心",
    detail: "2F 國際會議廳 A / B / C",
    // TODO: 簡報未載明完整文字地址與交通資訊，需主辦方提供（地圖連結由主辦提供）
    address: "",
    mapUrl: "https://share.google/ZpR8ISQOa1v8tthaV",
  },

  capacity: {
    seats: "600–700",
    attendance: "單日近 1,500 人次",
  },

  tickets: {
    /** 1 人單價（＝團報級距第一段）。JSON-LD 與各處摘要都取這兩個數字。 */
    full: 3000,
    earlyBird: 2500,
    currency: "NT$",
    /**
     * 團報級距：人數越多每人單價越低。（業主 2026/9 提供的票價表）
     * 這是「單日票」的價目 —— 10/14 與 10/15 各自售票，兩天都要參加要買兩張。
     * 業主給的兩張表（創辦人論壇／投資人論壇）數字完全相同，故只列一份，
     * 不依 ForumKey 拆開；日後若兩天價格分歧，才需要改成 Record<ForumKey, …>。
     */
    groupTiers: [
      { people: 1, label: "1 人", earlyBird: 2500, full: 3000 },
      { people: 2, label: "2 人", earlyBird: 2200, full: 2700 },
      { people: 5, label: "5 人", earlyBird: 2000, full: 2500 },
      { people: 10, label: "10 人", earlyBird: 1500, full: 2000 },
    ],
    // 報名連結見 lib/config.ts 的 REGISTER_URL（2026/9 已接上 Accupass 活動頁）
    note: "早鳥票數量有限，售完為止",
  },

  organizer: {
    name: "台灣新創投資社團",
    members: "5 萬名成員",
    host: "林文欽 Vincent",
    hostTitle: "台大創創中心執行長",
  },

  contact: {
    email: "2026tsic@gmail.com",
    sponsorEmail: "2026tsic@gmail.com",
  },

  /** 會後場次 */
  dinner: {
    name: "VVIP 交流晚宴",
    note: "年會落幕後舉行，席次隨贊助方案配置",
  },
} as const;

/** 團報最低單價（級距最末段）。票卡摘要指向這裡，改級距時不必兩邊對數字。 */
export const lowestGroupPrice =
  event.tickets.groupTiers[event.tickets.groupTiers.length - 1];

export const forums = [
  {
    key: "founder" as const,
    order: 1,
    label: "Day 1",
    name: "創辦人論壇",
    nameEn: "Founders Forum",
    date: "2026-10-14",
    dateLabel: "10 / 14",
    weekday: "三",
    time: "09:00 – 17:00",
    audience: "新創創辦人",
    description:
      "議程分為 Edge AI、AI 軟體、半導體硬科技三條路線。談論當公司從草創走向資本市場，或是到了考慮併購或海外擴張的節點，該如何進行關鍵決策。",
    accent: "sky" as const,
  },
  {
    key: "investor" as const,
    order: 2,
    label: "Day 2",
    name: "投資人論壇",
    nameEn: "Investors Forum",
    date: "2026-10-15",
    dateLabel: "10 / 15",
    weekday: "四",
    time: "09:00 – 17:00",
    audience: "創投 / CVC / 基金 LP / 高資產投資人",
    description:
      "談論在硬科技、AI 與生醫領域中，正在經歷哪些市場變化，投資人又該如何辨別機會與風險，做出長期有利的決斷，展望未來的資本動態。",
    // "violet" 現在解析到 --color-day2（#977ef2），不再是舊的 #6d47c4。
    // 這個 key 是「日別色的名字」不是色值本身，深色改版刻意不動它。
    accent: "violet" as const,
  },
];

export type ForumKey = (typeof forums)[number]["key"];

/** 首頁數據條 — 全部可從簡報與公開資料佐證 */
export const stats = [
  { value: "38", label: "已公布講者" },
  { value: "2", label: "天雙峰論壇" },
  { value: "600+", label: "現場席次" },
  { value: "5 萬", label: "社團成員" },
];
