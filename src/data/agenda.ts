import { forums, type ForumKey } from "./event";

/**
 * 2026 第四屆年會的逐時段議程表。
 *
 * 事實來源：《第四屆臺灣新創年會_議程總表_0902.xlsx》（業主 2026/9/5 提供）工作表 1。
 * 這一版是真正的 Excel 表格 —— 前一版 0817 的議程在簡報裡是**圖片**、只能肉眼判讀；
 * 0902 改由儲存格逐格讀出，時間與人名的轉錄風險小得多。原表的「分段主持人」欄是
 * 跨列合併的（例如 E4:E11 一格同時涵蓋《焦點創業家分享》與《焦點創業生態機構分享》兩段），
 * 攤平時要看合併範圍決定該掛在哪幾段，不能只看該分段標題那一列。
 *
 * 轉錄原則（同 data/review.ts）：
 * - 講題、單位、職稱一律逐字保留原表寫法，不潤飾、不補字。
 * - 原表留白的欄位就留白（`time` / `topic` 省略），版面顯示「陸續揭曉，敬請期待」，**不要猜**。
 * - 時間統一改寫成 24 小時制（原表下午場寫「1:30-1:50」這種 12 小時制、且有
 *   「9:55:-10:15」「4:35:4:55」這類冒號筆誤）。這是同一個時刻的等值改寫，不是改事實。
 * - `duration` 保留原表印的數字，即使與起訖時間對不上（0902 只剩 14:10–14:40 那一列
 *   印 20min）—— 那是原表自己的出入，等業主校對，我們不擅自更正。
 * - **留白的時間欄有一個例外（業主 2026/9 指示）**：當上下兩列的時間把空格夾死、
 *   且推算結果與原表自己印的長度吻合時，直接補上推算值 —— 那種空格是漏填、不是未定。
 *   目前三處都在 10/15：早上中場休息 10:45–10:55、午餐休息 12:10–13:30、年會結束 17:05
 *   （最後一列只有上界，故寫成單一時刻）。三處各自的算式寫在該列上方。
 *   這個例外只給時間欄 —— 講者與講題沒有「夾死」這回事，仍然一律不猜。
 *
 * `slug` 對應 data/speakers.ts 的講者內頁；**只有 `speakers` 陣列裡真的有的人才填**。
 * 林文欽是 `hostSpeaker`、不在 `speakers` 陣列裡（沒有靜態頁），所以刻意不給 slug。
 * TODO: 0902 表上有六個人沒有介紹與照片、因此不在 speakers.ts，
 * 只顯示文字不連內頁：田建中、金東昊、陳怡蓉、韓宗憲，以及兩位分段主持人劉宥彤、張提提。
 */

export interface AgendaSpeaker {
  /** 姓名（原表寫法） */
  name: string;
  /** 單位與職稱，原表 "／" 之後那一整串 */
  org?: string;
  /** 對得上 data/speakers.ts 才填，用來連講者內頁 */
  slug?: string;
  /** 原表標了 Moderator */
  moderator?: boolean;
}

export type AgendaItem =
  /** 分段標題列（原表的《…》整列橫幅），host = 該段的分段主持人 */
  | { type: "group"; title: string; host?: string }
  /** 休息／用餐／結束這類流程列 */
  | { type: "break"; time?: string; duration?: string; label: string }
  | {
      type: "talk";
      time?: string;
      duration?: string;
      topic?: string;
      speakers: AgendaSpeaker[];
    };

export interface AgendaDay {
  day: ForumKey;
  items: AgendaItem[];
}

/** 10/14 創辦人論壇（0902 議程總表 A1:E33） */
const founderDay: AgendaItem[] = [
  {
    type: "talk",
    time: "09:00–09:05",
    duration: "5min",
    topic: "主辦人致歡迎辭",
    speakers: [{ name: "林文欽", org: "台大創創中心執行長" }],
  },

  // E4:E11 這一格的合併範圍同時蓋住本段與下一段 ——《焦點創業生態機構分享》的分段主持人
  // 不是原表漏填，是與這一段共用同一位。
  {
    type: "group",
    title: "《焦點創業家分享》",
    host: "劉宥彤 Amanda Liu／Startup Taiwan Island 計畫負責人",
  },
  {
    type: "talk",
    time: "09:05–09:30",
    duration: "25min",
    topic: "韓國獨角獸案例 1",
    speakers: [{ name: "Ryan Lee 李昇圭", org: "Pinkfong 聯合創辦人", slug: "ryan-lee" }],
  },
  {
    type: "talk",
    time: "09:30–09:55",
    duration: "25min",
    topic: "韓國獨角獸案例 2",
    speakers: [
      { name: "Kelvin Dongho Kim 金東昊", org: "Korea Credit Data 創辦人兼執行長" },
    ],
  },
  {
    type: "talk",
    time: "09:55–10:15",
    duration: "20min",
    speakers: [{ name: "沈書緯", org: "犀動智能創辦人兼執行長", slug: "shen-shu-wei" }],
  },

  {
    type: "group",
    title: "《焦點創業生態機構分享》",
    host: "劉宥彤 Amanda Liu／Startup Taiwan Island 計畫負責人",
  },
  {
    type: "talk",
    time: "10:15–10:35",
    duration: "20min",
    speakers: [{ name: "吳貴融（KJ Wu）", org: "Google Cloud 大中華區新創技術副總", slug: "kj-wu" }],
  },
  {
    type: "talk",
    time: "10:35–10:55",
    duration: "20min",
    speakers: [{ name: "林志垚", org: "AAMA 台北搖籃計劃董事長", slug: "lin-zhi-yao" }],
  },
  {
    type: "talk",
    time: "10:55–11:15",
    duration: "20min",
    speakers: [{ name: "程九如", org: "AppWorks 之初創投合夥人", slug: "cheng-jiu-ru" }],
  },

  { type: "break", time: "11:15–11:25", duration: "10min", label: "早上中場休息時間" },

  {
    type: "group",
    title: "《走向資本市場》",
    host: "沈立平 Robin／益鼎創投副總經理",
  },
  {
    type: "talk",
    time: "11:25–11:45",
    duration: "20min",
    speakers: [{ name: "田建中", org: "台灣證券交易所上市二部經理" }],
  },
  {
    type: "talk",
    time: "11:45–12:25",
    duration: "40min",
    topic: "《新 IPO 創業家 Panel 對談》",
    speakers: [
      { name: "沈立平", org: "益鼎創投副總經理", slug: "shen-li-ping", moderator: true },
      { name: "吳侑勳", org: "東聯互動（7738）創辦人兼董事長", slug: "wu-you-xun" },
      { name: "吳明蔚", org: "奧義智慧（7823）創辦人兼執行長", slug: "wu-ming-wei" },
      { name: "李倫家", org: "PRO360 達人網（7839）創辦人兼董事長", slug: "li-lun-jia" },
    ],
  },

  { type: "break", time: "12:25–13:30", duration: "65min", label: "午餐休息時間" },

  { type: "group", title: "《併購與擴張》", host: "張提提／中華開發資本協理" },
  {
    type: "talk",
    time: "13:30–13:50",
    duration: "20min",
    speakers: [{ name: "黃懷恩", org: "欣新網執行長兼總經理", slug: "huang-huai-en" }],
  },
  {
    type: "talk",
    time: "13:50–14:10",
    duration: "20min",
    speakers: [{ name: "許郁婷", org: "股感媒體集團共同創辦人暨執行長", slug: "xu-yu-ting" }],
  },
  // 原表這一列印 20min，但起訖是 30min —— 照印不改（見檔頭轉錄原則），待業主校對
  {
    type: "talk",
    time: "14:10–14:40",
    duration: "20min",
    speakers: [{ name: "宋捷仁", org: "USPACE 創辦人兼執行長", slug: "song-jie-ren" }],
  },

  // 本段的分段主持人欄（E23:E25）只落在 Panel 那三列上，人就是 Panel 的 Moderator 楊本豫
  {
    type: "group",
    title: "《Edge AI 趨勢對談》",
    host: "楊本豫／友達光電集團董事長室顧問",
  },
  {
    type: "talk",
    time: "14:40–15:00",
    duration: "20min",
    topic: "AI 生態演化的新・賣鏟人／CVC 視角下的 AI 產業價值共創願景",
    speakers: [{ name: "楊本豫", org: "友達光電集團董事長室顧問", slug: "yang-ben-yu" }],
  },
  {
    type: "talk",
    time: "15:00–15:40",
    duration: "40min",
    topic: "《Edge AI 企業家 Panel 對談》",
    speakers: [
      { name: "楊本豫", org: "友達光電集團董事長室顧問", slug: "yang-ben-yu", moderator: true },
      { name: "丘立全", org: "啟雲科技共同創辦人兼執行長", slug: "qiu-li-quan" },
      { name: "鄒大智", org: "ADLink 凌華科技財務長", slug: "zou-da-zhi" },
      { name: "趙新民", org: "宇沛永續智慧製造服務處資深總監", slug: "zhao-xin-min" },
    ],
  },

  { type: "break", time: "15:40–15:55", duration: "15min", label: "下午中場休息時間" },

  // E27:E33 的合併範圍蓋住本段與《年度新基金》，兩段共用同一位分段主持人
  { type: "group", title: "《AI 軟體創業家分享》", host: "張提提／中華開發資本協理" },
  {
    type: "talk",
    time: "15:55–16:15",
    duration: "20min",
    speakers: [{ name: "鍾哲民", org: "Mobagel 行動貝果創辦人兼執行長", slug: "adams-chung" }],
  },
  {
    type: "talk",
    time: "16:15–16:35",
    duration: "20min",
    speakers: [{ name: "薛覲", org: "漸強實驗室共同創辦人暨執行長", slug: "xue-jin" }],
  },
  {
    type: "talk",
    time: "16:35–16:55",
    duration: "20min",
    speakers: [
      { name: "李信宜", org: "愛比科技總經理兼 Vurbo.ai 共同創辦人", slug: "li-xin-yi" },
    ],
  },

  { type: "group", title: "《年度新基金》", host: "張提提／中華開發資本協理" },
  {
    type: "talk",
    time: "16:55–17:15",
    duration: "20min",
    topic: "宏齊永續與氣候基金",
    speakers: [
      { name: "程淑芬", org: "宏齊永續與氣候基金合夥人，前國泰金控投資長", slug: "sophia-cheng" },
    ],
  },
  {
    type: "talk",
    time: "17:15–17:35",
    duration: "20min",
    topic: "台大校友創投",
    speakers: [{ name: "江旻峻", org: "台大校友創投總經理", slug: "jiang-minjun" }],
  },
];

/** 10/15 投資人論壇（0902 議程總表 A36:E65）。這一天只有最後的 Panel 有分段主持人。 */
const investorDay: AgendaItem[] = [
  {
    type: "talk",
    time: "09:00–09:05",
    duration: "5min",
    topic: "主辦人致歡迎辭",
    speakers: [{ name: "林文欽", org: "台大創創中心執行長" }],
  },

  { type: "group", title: "《焦點創投 / CVC 分享》" },
  {
    type: "talk",
    time: "09:05–09:30",
    duration: "25min",
    speakers: [{ name: "吳思本", org: "緯創資通企業投資辦公室副總經理", slug: "eric-wu" }],
  },
  {
    type: "talk",
    time: "09:30–09:55",
    duration: "25min",
    speakers: [
      { name: "彭志強", org: "UMC Capital 宏誠創投總經理", slug: "peng-zhiqiang" },
    ],
  },
  {
    type: "talk",
    time: "09:55–10:20",
    duration: "25min",
    speakers: [{ name: "李一平", org: "台杉投資科技基金執行合夥人", slug: "li-yiping" }],
  },
  {
    type: "talk",
    time: "10:20–10:45",
    duration: "25min",
    speakers: [{ name: "彭適辰", org: "美商中經合集團資深合夥人", slug: "sean-peng" }],
  },
  // 原表這一列的時間欄是空的，只印了長度。時間由前後兩場推算：彭適辰 10:45 結束、
  // 黃峻樑 10:55 開始，中間正好 10 分鐘，與原表印的 10min 吻合（見檔頭的推算例外說明）。
  { type: "break", time: "10:45–10:55", duration: "10min", label: "早上中場休息時間" },
  {
    type: "talk",
    time: "10:55–11:20",
    duration: "25min",
    speakers: [{ name: "黃峻樑", org: "峻盛資本創辦人暨管理合夥人", slug: "huang-junliang" }],
  },
  {
    type: "talk",
    time: "11:20–11:45",
    duration: "25min",
    speakers: [{ name: "高誌廷", org: "普訊創新總經理", slug: "allen-kao" }],
  },
  {
    type: "talk",
    time: "11:45–12:10",
    duration: "25min",
    speakers: [
      { name: "Poseidon Ho", org: "Outliers Fund 創始合夥人暨 CEO", slug: "poseidon-ho" },
    ],
  },
  // 同上：Poseidon Ho 12:10 結束、前田南 13:30 開始，中間 80 分鐘，與原表印的 80min 吻合
  { type: "break", time: "12:10–13:30", duration: "80min", label: "午餐休息" },

  { type: "group", title: "《生醫投資趨勢》" },
  {
    type: "talk",
    time: "13:30–14:00",
    duration: "30min",
    speakers: [
      {
        name: "前田南 Minami Maeda",
        org: "樂天醫藥 Rakuten Medical 總裁暨副會長",
        slug: "minami-maeda",
      },
    ],
  },
  // 這兩列原表只寫單位、沒寫姓名
  {
    type: "talk",
    time: "14:00–14:25",
    duration: "25min",
    speakers: [{ name: "台杉投資生技基金主管" }],
  },
  {
    type: "talk",
    time: "14:25–14:50",
    duration: "25min",
    speakers: [{ name: "中華開發資本生技基金主管" }],
  },

  { type: "break", time: "14:50–15:05", duration: "15min", label: "下午中場休息時間" },

  { type: "group", title: "《蛻變中的早期投資機構》" },
  {
    type: "talk",
    time: "15:05–15:25",
    duration: "20min",
    speakers: [{ name: "方俊傑", org: "AVA Angels 創辦人暨執行長", slug: "fang-junjie" }],
  },
  {
    type: "talk",
    time: "15:25–15:45",
    duration: "20min",
    speakers: [{ name: "簡丹", org: "台安傑天使俱樂部董事長暨合夥人", slug: "jian-dan" }],
  },
  {
    type: "talk",
    time: "15:45–16:05",
    duration: "20min",
    speakers: [{ name: "陳怡蓉", org: "識富天使會執行長" }],
  },
  {
    type: "talk",
    time: "16:05–16:25",
    duration: "20min",
    speakers: [{ name: "林伯翰", org: "一春資本創辦人", slug: "lin-bo-han" }],
  },

  // 瞿志豪在原表同時出現在「演講嘉賓」與「分段主持人」兩欄，但嘉賓欄沒有 Moderator 前綴
  // （同一份表的另外兩個 Panel 都有寫）—— 因此主持身分只掛在 host，不加 moderator 旗標。
  {
    type: "group",
    title: "《半導體硬科技投資趨勢 Panel》",
    host: "瞿志豪／橡子園台灣區合夥人",
  },
  {
    type: "talk",
    time: "16:25–17:05",
    duration: "40min",
    topic: "半導體投資 Panel 對談",
    speakers: [
      {
        name: "瞿志豪",
        org: "橡子園台灣區合夥人，前 ITIC 創新工業技術移轉總經理",
        slug: "qu-zhi-hao",
      },
      { name: "韓宗憲", org: "ITIC 創投副總經理" },
      { name: "潘逸凡", org: "豐新資本合夥人", slug: "pan-yi-fan" },
      { name: "鞠志遠", org: "歐姆佳科技創辦人兼 CEO", slug: "ju-zhi-yuan" },
    ],
  },

  // 只有上界可推：最後一場半導體 Panel 17:05 結束。這是一個時刻不是一段議程，故不寫成區間
  { type: "break", time: "17:05", label: "年會結束" },
];

export const agenda: AgendaDay[] = [
  { day: "founder", items: founderDay },
  { day: "investor", items: investorDay },
];

export function agendaByDay(day: ForumKey): AgendaItem[] {
  return agenda.find((d) => d.day === day)?.items ?? [];
}

/** 某位講者在議程裡的場次，給講者內頁的場次膠囊用。 */
export interface SpeakerSlot {
  day: ForumKey;
  /** 所屬分段，如「《焦點創業家分享》」。原表沒有分段的列（致歡迎辭）就沒有 */
  group?: string;
  time?: string;
  topic?: string;
  moderator?: boolean;
}

/**
 * 依 slug 找出該講者的場次。找不到 = 還沒排進議程（speakers.ts 有幾位是這種情況）。
 *
 * 同一人可能在議程裡出現兩次 —— 楊本豫既是 Edge AI 那段的 keynote 講者，
 * 也是同一段 Panel 的 Moderator。這裡只回傳**第一筆**：講者內頁那顆膠囊只放得下一個場次，
 * 而第一筆就是他最早登台的那場，資訊上不會誤導。要列全部場次得改成回傳陣列。
 */
export function findSpeakerSlot(slug: string): SpeakerSlot | undefined {
  for (const d of agenda) {
    let group: string | undefined;
    for (const item of d.items) {
      if (item.type === "group") {
        group = item.title;
        continue;
      }
      if (item.type !== "talk") continue;
      const hit = item.speakers.find((s) => s.slug === slug);
      if (hit) {
        return { day: d.day, group, time: item.time, topic: item.topic, moderator: hit.moderator };
      }
    }
  }
  return undefined;
}

/** 該日實際的演講場次數（不含分段標題與休息列），供標題列顯示。 */
export function talkCount(items: AgendaItem[]): number {
  return items.filter((i) => i.type === "talk").length;
}

/**
 * 議程的純文字版，給 app/llms.txt 用。
 *
 * 放在資料檔而不是 route 裡：llms.txt 的內容是一整條樣板字串，
 * 把這種帶條件分支的迴圈塞進去會變得沒人看得懂。
 * 這也符合 CLAUDE.md 的提醒 —— 資料的下游有三處，改資料時 llms.txt 要一起想。
 */
export function agendaMarkdown(): string {
  return agenda
    .map((d) => {
      const f = forums.find((x) => x.key === d.day)!;
      const head = `### ${f.dateLabel.replace(/ /g, "")}（${f.weekday}）${f.name}`;
      const rows = d.items.map((i) => {
        if (i.type === "group") {
          return `**${i.title}**${i.host ? `（主持：${i.host}）` : ""}`;
        }
        const time = i.time ?? "時間待定";
        if (i.type === "break") return `- ${time}：${i.label}`;
        const who = i.speakers.length
          ? i.speakers
              .map((s) => `${s.moderator ? "Moderator: " : ""}${s.name}${s.org ? `（${s.org}）` : ""}`)
              .join("、")
          : "講者待公布";
        return `- ${time}${i.topic ? ` ${i.topic}` : ""}：${who}`;
      });
      return [head, ...rows].join("\n");
    })
    .join("\n\n");
}
