import type { ForumKey } from "./event";

export type TrackSlot = "morning" | "afternoon" | "evening";
export type TrackFormat = "keynote" | "panel" | "session" | "social";

export interface Track {
  key: string;
  day: ForumKey;
  order: number;
  no: string;
  slot: TrackSlot;
  format: TrackFormat;
  title: string;
  titleEn: string;
  summary: string;
}

/**
 * 本屆議程目前只到「Session 分類 + 講者歸屬」層級，
 * 簡報中尚未提供逐時段時間表 —— 因此網站以主題軌呈現，不虛構時間。
 */
export const tracks: Track[] = [
  {
    key: "opening",
    day: "founder",
    order: 1,
    no: "01",
    slot: "morning",
    format: "keynote",
    title: "國際開幕演講",
    titleEn: "Opening Keynote",
    summary: "由國際知名創辦人揭開兩日論壇序幕。講者陣容確認中，敬請期待。",
  },
  {
    key: "founder-keynote",
    day: "founder",
    order: 2,
    no: "02",
    slot: "morning",
    format: "keynote",
    title: "創業家 Keynote",
    titleEn: "Founder Keynotes",
    summary: "從 0 到 1 之後的第二曲線：規模化、國際化與技術護城河的真實取捨。",
  },
  {
    key: "ecosystem",
    day: "founder",
    order: 3,
    no: "03",
    slot: "morning",
    format: "keynote",
    title: "焦點新創生態機構",
    titleEn: "Ecosystem Leaders",
    summary: "加速器、共創平台與資本市場端的觀點，看台灣新創生態系的下一步。",
  },
  {
    key: "new-ipo",
    day: "founder",
    order: 4,
    no: "04",
    slot: "morning",
    format: "panel",
    title: "新 IPO 創業家",
    titleEn: "Newly Listed Founders",
    summary: "剛敲鐘的創辦人現身說法：從募資、法遵到掛牌，一條路走完的經驗值。",
  },
  {
    key: "ma-global",
    day: "founder",
    order: 5,
    no: "05",
    slot: "afternoon",
    format: "session",
    title: "併購與國際擴張",
    titleEn: "M&A and Global Expansion",
    summary: "把公司賣掉，或把市場買下來 —— 併購作為成長策略的實務拆解。",
  },
  {
    key: "edge-ai",
    day: "founder",
    order: 6,
    no: "06",
    slot: "afternoon",
    format: "session",
    title: "Edge AI",
    titleEn: "Edge AI",
    summary: "當推論從雲端走回裝置端，硬體、模型與供應鏈重新洗牌的機會在哪裡。",
  },
  {
    key: "ai-software",
    day: "founder",
    order: 7,
    no: "07",
    slot: "afternoon",
    format: "session",
    title: "AI 軟體",
    titleEn: "AI Software",
    summary: "從對話式 AI 到垂直應用，台灣 AI 軟體團隊如何做出可收費的產品。",
  },
  {
    key: "deep-tech",
    day: "founder",
    order: 8,
    no: "08",
    slot: "afternoon",
    format: "session",
    title: "半導體與硬科技新創",
    titleEn: "Semiconductor & Deep Tech",
    summary: "資本密集、週期漫長的硬科技創業，如何找到對的投資人與對的節奏。",
  },
  {
    key: "early-fund",
    day: "founder",
    order: 9,
    no: "09",
    slot: "afternoon",
    format: "session",
    title: "早期基金介紹",
    titleEn: "Early-Stage Funds",
    summary: "天使俱樂部與早期基金直接說明投資邏輯、階段與遞案方式。",
  },
  {
    key: "institutional",
    day: "investor",
    order: 1,
    no: "01",
    slot: "morning",
    format: "panel",
    title: "焦點機構投資人",
    titleEn: "Institutional Investors",
    summary: "硬科技與 CVC 主場：企業投資、國家隊基金與跨境資本的配置策略。",
  },
  {
    key: "ai-investment",
    day: "investor",
    order: 2,
    no: "02",
    slot: "afternoon",
    format: "session",
    title: "AI 投資",
    titleEn: "AI Investment",
    summary: "矽谷與台灣的 AI 投資標準對照：估值、里程碑與退出路徑。",
  },
  {
    key: "biotech-investment",
    day: "investor",
    order: 3,
    no: "03",
    slot: "afternoon",
    format: "session",
    title: "生醫投資",
    titleEn: "Biotech Investment",
    summary: "臨床、法規與資本三重門檻下，生醫新創的投資判準與國際布局。",
  },
];

export const trackMap = Object.fromEntries(tracks.map((t) => [t.key, t])) as Record<string, Track>;

export function tracksByDay(day: ForumKey) {
  return tracks.filter((t) => t.day === day).sort((a, b) => a.order - b.order);
}
