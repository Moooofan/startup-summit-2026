/**
 * 贊助方案。來源：《第四屆新創投資年會企劃 新增贊助方案.pptx》
 * 已知矛盾：總覽頁的「攤位贊助 NT$18,000」與攤位細項頁的「小型展位 NT$50,000」
 * 數字不一致，已於 boothPricingConflict 標記，上線前需主辦方確認。
 */

export interface Tier {
  key: string;
  name: string;
  nameEn: string;
  price: number | null;
  priceLabel: string;
  tagline: string;
  featured?: boolean;
  limited?: string;
  benefits: Record<string, string | boolean>;
}

export const benefitRows = [
  { key: "social", label: "社群宣傳貼文" },
  { key: "feature", label: "專屬報導" },
  { key: "backdrop", label: "活動背板 Logo" },
  { key: "handbook", label: "紀念手冊篇幅" },
  { key: "thanks", label: "主席口頭致謝" },
  { key: "booth", label: "實體展位" },
  { key: "dinner", label: "VVIP 晚宴席次" },
  { key: "attendees", label: "參與者名單", note: "需經參與者授權" },
  { key: "passes", label: "兩日通行券" },
  { key: "postThanks", label: "會後感謝名單" },
] as const;

export const tiers: Tier[] = [
  {
    key: "flagship",
    name: "旗艦贊助",
    nameEn: "Flagship",
    price: 500000,
    priceLabel: "NT$500,000",
    tagline: "最高曝光層級，含專屬報導與參與者名單。",
    featured: true,
    benefits: {
      social: "3 篇",
      feature: true,
      backdrop: "核心位置",
      handbook: "全頁",
      thanks: true,
      booth: "大型展位",
      dinner: "4 位",
      attendees: true,
      passes: "10 張（價值 NT$56,000）",
      postThanks: true,
    },
  },
  {
    key: "navigator",
    name: "領航贊助",
    nameEn: "Navigator",
    price: 200000,
    priceLabel: "NT$200,000",
    tagline: "大型展位與晚宴席次，兼顧品牌與商務接觸。",
    benefits: {
      social: "2 篇",
      feature: false,
      backdrop: true,
      handbook: "半頁",
      thanks: true,
      booth: "大型展位",
      dinner: "2 位",
      attendees: false,
      passes: "6 張（價值 NT$33,600）",
      postThanks: true,
    },
  },
  {
    key: "voyager",
    name: "同航贊助",
    nameEn: "Voyager",
    price: 100000,
    priceLabel: "NT$100,000",
    tagline: "入門主贊助層級，含中型展位與晚宴席次。",
    benefits: {
      social: "1 篇",
      feature: false,
      backdrop: true,
      handbook: "贊助名單",
      thanks: true,
      booth: "中型展位",
      dinner: "1 位",
      attendees: false,
      passes: "2 張（價值 NT$11,200）",
      postThanks: true,
    },
  },
  {
    key: "booth",
    name: "攤位贊助",
    nameEn: "Booth",
    price: null,
    priceLabel: "洽詢",
    tagline: "純展位方案，不含演講權與 VVIP 晚宴席次。",
    limited: "全場 8–10 攤，審核制",
    benefits: {
      social: "1 篇",
      feature: false,
      backdrop: true,
      handbook: "贊助名單",
      thanks: false,
      booth: "大／中／小型",
      dinner: false,
      attendees: false,
      passes: "0–1 張",
      postThanks: true,
    },
  },
  {
    key: "friend",
    name: "友情贊助",
    nameEn: "Friend",
    price: 15000,
    priceLabel: "NT$15,000 起",
    tagline: "以現金或等值物資支持，適合小型團隊與個人。",
    benefits: {
      social: false,
      feature: false,
      backdrop: true,
      handbook: "贊助名單",
      thanks: false,
      booth: false,
      dinner: false,
      attendees: false,
      passes: "0–1 張",
      postThanks: true,
    },
  },
];

/** 上線前需主辦方確認的價格衝突 */
export const boothPricingConflict = {
  overviewPrice: "NT$18,000",
  detailPrice: "NT$50,000",
  note: "簡報總覽頁與細項頁的小型展位價格不一致，網站暫以「洽詢」呈現。",
};

export const boothTypes = [
  {
    name: "大型展位",
    size: "約 2m × 2m",
    quota: "上限 2 個",
    access: "旗艦／領航贊助專屬",
  },
  {
    name: "中型展位",
    size: "約 1.5m × 1.5m",
    quota: "上限 3 個",
    access: "同航贊助專屬",
  },
  {
    name: "小型展位",
    size: "180cm 長桌",
    quota: "3–5 個",
    access: "審核制，含 2 張通行券",
  },
];

export const friendModes = [
  {
    key: "cash",
    name: "模式 A・現金贊助",
    detail: "每組 NT$20,000",
  },
  {
    key: "kind",
    name: "模式 B・物資等值",
    detail: "VIP 兩日午餐 NT$80,000／兩日咖啡 NT$50,000／報到伴手禮 NT$50,000／印製品 NT$30,000／其他另議",
  },
];

/** 展場規劃 */
export const venueZones = [
  { zone: "A / B / C", name: "演講廳", detail: "三廳打通，600–700 席" },
  { zone: "D", name: "交誼與餐飲區", detail: "茶敘、午餐與自由交流" },
  { zone: "E", name: "品牌攤位區", detail: "8–10 個贊助商展位" },
];
