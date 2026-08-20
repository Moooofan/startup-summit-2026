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

  /** ISO 8601（台北時間）— 給倒數計時與 Event JSON-LD 用 */
  startDate: "2026-10-14T09:00:00+08:00",
  endDate: "2026-10-15T17:00:00+08:00",
  dateLabel: "10.14 ⟶ 15",
  dateLabelLong: "2026 年 10 月 14 日（三）— 10 月 15 日（四）",
  timeLabel: "09:00 – 17:00",

  venue: {
    name: "華南金控國際會議中心",
    detail: "2F 國際會議廳 A / B / C（三廳打通）",
    // TODO: 簡報未載明完整地址與交通資訊，需主辦方提供
    address: "",
    mapUrl: "",
  },

  capacity: {
    seats: "600–700",
    attendance: "單日近 1,500 人次",
  },

  tickets: {
    full: 3300,
    earlyBird: 2200,
    currency: "NT$",
    // TODO: Accupass 連結未定，先以 # 佔位（見 lib/config.ts）
    note: "早鳥票數量有限，售完為止",
  },

  organizer: {
    name: "台灣新創投資社團",
    members: "5 萬名成員",
    host: "林文欽 Vincent",
    hostTitle: "台大創創中心執行長",
  },

  contact: {
    // TODO: 建議改為官方信箱，目前為主辦人個人信箱
    email: "hm8827@gmail.com",
    sponsorEmail: "hm8827@gmail.com",
  },

  /** 會後場次 */
  dinner: {
    name: "VVIP 交流晚宴",
    note: "年會落幕後舉行，席次隨贊助方案配置",
  },
} as const;

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
      "從 Keynote、新 IPO 創業家對談，到 Edge AI、AI 軟體、半導體硬科技三條分軌，一天內看完台灣創業現場的縱深。",
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
      "焦點機構投資人齊聚主論壇，下午分為 AI 投資與生醫投資兩軌，聚焦真實的資本動態與交易邏輯。",
    accent: "violet" as const,
  },
];

export type ForumKey = (typeof forums)[number]["key"];

/** 首頁數據條 — 全部可從簡報與公開資料佐證 */
export const stats = [
  { value: "34", label: "已公布講者" },
  { value: "2", label: "天雙峰論壇" },
  { value: "600+", label: "現場席次" },
  { value: "5 萬", label: "社團成員" },
];
