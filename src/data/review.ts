// 台灣新創投資年會 — 歷屆回顧資料
// 資料來源：《第四屆新創投資年會企劃 新增贊助方案.pptx》（投影片 3、34–44）
//           + 第三屆年會公開資訊（主題／日期／地點／規模）
//           + 《第二屆新創投資年會講者名單與主題.pptx》（業主 2026/9 提供，兩天議程各一張投影片）
//           + 第一屆當年議程表圖片（業主 2026/9 提供）
// 由 gen_review.py 自簡報 XML 產生，議程與媒體連結逐字保留。
// 第一、二屆的講者名單是手動輸入，不在 gen_review.py 的輸出範圍內（見各自的常數註解）。

export interface PastSession {
  time: string;        // "09:30–10:00"
  duration?: string;   // "30 min"
  title: string;
  speaker?: string;
  format?: "keynote" | "panel" | "fireside" | "break" | "networking";
}

export interface PastForum {
  day: 1 | 2;
  date: string;        // "2025-10-01"
  name: string;        // "創辦人論壇"
  sessions: PastSession[];
}

export interface MediaItem {
  title: string;
  outlet: string;
  date?: string;
  url: string;
}

export interface SocialItem {
  platform: string;
  url: string;
  views?: string;
  /** 分享／轉貼數（簡報原欄位「分享/轉貼數/評級」） */
  shares?: string;
  title?: string;
  author?: string;
}

export interface SponsorLogo {
  name: string;
  logo: string;
  tier: string;
}

/** 時間軸重點數字。業主指定主打「參與人次」與「講者數量」，另兩項為次要補充。
 *  值為 null = 尚未取得資料 → 版面顯示「—」，不開天窗。 */
export interface EditionGrowth {
  /** 參與人次（業主指定主打指標） */
  attendees: number | null;
  /** 講者數量（業主指定主打指標） */
  speakers: number | null;
  /** 投資機構家數（次要） */
  institutions: number | null;
  /** 論壇天數（次要） */
  days: number | null;
}

/** 歷屆講者（區塊 3：點擊屆數展開的議程表用）。 */
export interface PastSpeaker {
  name: string;
  /** 服務單位 */
  org: string;
  /** 職稱 */
  title?: string;
  /** 講題 */
  topic?: string;
  /** 第幾天（單日場免填） */
  day?: 1 | 2;
}

/** 過往參與者好評留言。資料未到位前整個區塊不渲染。 */
export interface Testimonial {
  quote: string;
  name: string;
  title?: string;
  org?: string;
  /** 出自哪一屆 */
  edition: number;
  /** 是否已取得具名公開引用同意；false → 顯示為匿名 */
  consent: boolean;
}

export interface Edition {
  no: number;
  year: number;
  theme?: string;
  dateLabel: string;
  venue: string;
  venueAddress?: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  /** 時間軸右半邊的重點數字 */
  growth?: EditionGrowth;
  /** 時間軸右半邊的「精選一張」照片（業主：過去三屆各挑一張） */
  heroPhoto?: string;
  /** 一句話定調這一屆 */
  oneLiner?: string;
  /** 歷屆講者名單（區塊 3） */
  pastSpeakers?: PastSpeaker[];
  /** 這一屆哪些欄位是暫用填充料、待業主補件 */
  pending?: string[];
  forums?: PastForum[];
  photos?: string[];
  sponsors?: SponsorLogo[];
  media?: MediaItem[];
  social?: SocialItem[];
  /** 資料是否完整（第一屆公開資料不全 → false） */
  dataComplete: boolean;
}

/** 第三屆（2025）媒體露出，共 64 則，方便單獨做媒體牆。 */
export const mediaCoverage: MediaItem[] = [
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共",
    outlet: "蕃新聞",
    date: "2025/10/08 15:35:58",
    url: "https://n.yam.com/Article/20251008593690",
  },
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共",
    outlet: "LINE TODAY",
    date: "2025/10/08 15:30:00",
    url: "https://today.line.me/tw/article/9m7vvlE",
  },
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共",
    outlet: "Yahoo新聞",
    date: "2025/10/08 15:30:00",
    url: "https://tw.news.yahoo.com/%E6%9E%97%E6%96%87%E6%AC%BD-%E6%89%93%E9%80%A0%E5%9C%8B%E9%9A%9B%E7%AB%B6%E7%88%AD%E5%8A%9B%E7%9A%84%E5%A5%91%E6%A9%9F-2025%E5%8F%B0%E7%81%A3%E6%96%B0%E5%89%B5%E6%8A%95%E8%B3%87%E5%B9%B4%E6%9C%83%E7%99%BB%E5%A0%B4-%E6%B5%B7%E5%85%A7%E5%A4%9618%E5%AE%B6%E6%8A%95%E8%B3%87%E6%A9%9F%E6%A7%8B%E8%88%878%E4%BD%8D%E5%89%B5%E6%A5%AD%E5%AE%B6%E5%85%B1-073000667.html",
  },
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共",
    outlet: "pchome新聞",
    date: "2025/10/08 15:30:00",
    url: "http://news.pchome.com.tw/healthcare/uho/20251008/index-17599086008263859012.html",
  },
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共榮",
    outlet: "pchome新聞",
    date: "2025/10/08 15:30:00",
    url: "http://news.pchome.com.tw/healthcare/uho/20251008/index-17599086009087559012.html",
  },
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共",
    outlet: "LIFE生活網",
    date: "2025/10/08 15:30:00",
    url: "https://life.tw/?app=view&no=2845238",
  },
  {
    title: "林文欽：打造國際競爭力的契機2025台灣新創投資年會登場！海內外18家投資機構與8位創業家共榮",
    outlet: "LIFE生活網",
    date: "2025/10/08 15:30:00",
    url: "https://life.tw/?app=view&no=2845754",
  },
  {
    title: "台灣創投市場逆勢崛起前騰訊副總揭露資金流向",
    outlet: "DIGITIMES-科技網",
    date: "2025/10/03 00:00:00",
    url: "https://www.digitimes.com.tw/tech/dt/n/shwnws.asp?id=0000734222_JC815A2F3NVF4A1RFHL4S",
  },
  {
    title: "台灣新聞通訊社-台灣新創黃金時代啟動證交所出手瞄準下一隻獨角獸！",
    outlet: "Taiwan News Agency 台灣新聞通訊社",
    date: "2025/10/02 16:04:00",
    url: "https://twkeypoint.com/index.php/2025/10/02/%e5%8f%b0%e7%81%a3%e6%96%b0%e8%81%9e%e9%80%9a%e8%a8%8a%e7%a4%be-%e5%8f%b0%e7%81%a3%e6%96%b0%e5%89%b5%e9%bb%83%e9%87%91%e6%99%82%e4%bb%a3%e5%95%9f%e5%8b%95%e3%80%80%e8%ad%89%e4%ba%a4%e6%89%80-2/",
  },
  {
    title: "台灣新創黃金時代啟動證交所出手瞄準下一隻獨角獸！",
    outlet: "Yahoo新聞",
    date: "2025/10/02 16:02:00",
    url: "https://tw.news.yahoo.com/%E5%8F%B0%E7%81%A3%E6%96%B0%E5%89%B5%E9%BB%83%E9%87%91%E6%99%82%E4%BB%A3%E5%95%9F%E5%8B%95-%E8%AD%89%E4%BA%A4%E6%89%80%E5%87%BA%E6%89%8B%E7%9E%84%E6%BA%96%E4%B8%8B-%E9%9A%BB%E7%8D%A8%E8%A7%92%E7%8D%B8-080200665.html",
  },
  {
    title: "台灣新聞通訊社-台灣新創黃金時代啟動證交所出手瞄準下一隻獨角獸！",
    outlet: "Taiwan News Agency 台灣新聞通訊社",
    date: "2025/10/02 15:58:13",
    url: "https://twkeypoint.com/index.php/2025/10/02/%e5%8f%b0%e7%81%a3%e6%96%b0%e8%81%9e%e9%80%9a%e8%a8%8a%e7%a4%be-%e5%8f%b0%e7%81%a3%e6%96%b0%e5%89%b5%e9%bb%83%e9%87%91%e6%99%82%e4%bb%a3%e5%95%9f%e5%8b%95%e3%80%80%e8%ad%89%e4%ba%a4%e6%89%80%e5%87%ba/",
  },
  {
    title: "台灣新創黃金時代啟動證交所出手瞄準下一隻獨角獸！",
    outlet: "三立iNEWS",
    date: "2025/10/02 15:57:00",
    url: "https://inews.setn.com/news/1730018",
  },
  {
    title: "台灣新創黃金時代啟動證交所出手瞄準下一隻獨角獸！",
    outlet: "三立新聞",
    date: "2025/10/02 15:57:00",
    url: "https://www.setn.com/News.aspx?NewsID=1730018&utm_campaign=viewallnews",
  },
  {
    title: "台灣新創黃金時代啟動證交所出手瞄準下一隻獨角獸！",
    outlet: "MSN新聞",
    date: "2025/10/02 15:57:00",
    url: "https://www.msn.com/zh-tw/money/topstories/台灣新創黃金時代啟動-證交所出手瞄準下一隻獨角獸/ar-AA1NILFx",
  },
  {
    title: "新創時代啟動證交所瞄準下一隻獨角獸！",
    outlet: "鏡週刊",
    date: "2025/10/02 15:57:00",
    url: "https://www.mirrormedia.mg/external/setn_1730018",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "中華新聞雲/中華日報",
    date: "2025/10/02 12:18:03",
    url: "https://www.cdns.com.tw/articles/1295486",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "臺灣時報Taiwan Times",
    date: "2025/10/02 11:52:46",
    url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-3defd667-aa18-4770-999f-093e9ce153f7",
  },
  {
    title: "2025台灣新創投資年會登場探討AI浪潮與資本緊縮突圍路徑",
    outlet: "經濟日報",
    date: "2025/10/02 10:57:00",
    url: "https://money.udn.com/money/story/11799/9044855",
  },
  {
    title: "國內財經：證交所參與台灣新創投資年會，推動創新板助力新創企業成長",
    outlet: "東森財經新聞",
    date: "2025/10/02 10:06:00",
    url: "https://fnc.ebc.net.tw/fncnews/content/198477",
  },
  {
    title: "證交所參與台灣新創投資年會，推動創新板助力新創企業成長",
    outlet: "Yahoo新聞",
    date: "2025/10/02 08:41:22",
    url: "https://tw.stock.yahoo.com/news/%E8%AD%89%E4%BA%A4%E6%89%80%E5%8F%83%E8%88%87%E5%8F%B0%E7%81%A3%E6%96%B0%E5%89%B5%E6%8A%95%E8%B3%87%E5%B9%B4%E6%9C%83-%E6%8E%A8%E5%8B%95%E5%89%B5%E6%96%B0%E6%9D%BF%E5%8A%A9%E5%8A%9B%E6%96%B0%E5%89%B5%E4%BC%81%E6%A5%AD%E6%88%90%E9%95%B7-004122460.html",
  },
  {
    title: "國內財經：證交所參與台灣新創投資年會，推動創新板助力新創企業成長",
    outlet: "富聯網",
    date: "2025/10/02 08:41:00",
    url: "http://ww2.money-link.com.tw/RealtimeNews/NewsContent.aspx?SN=2267048002&PU=0010",
  },
  {
    title: "證交所參與台灣新創投資年會，推動創新板助力新創企業成長",
    outlet: "MoneyDJ理財網",
    date: "2025/10/02 08:23:00",
    url: "https://www.moneydj.com/kmdj/news/newsviewer.aspx?a=a441eae0-69a6-421e-8dfd-3db21ca6d62e",
  },
  {
    title: "《證交所》創新板鬆綁將提三優化",
    outlet: "豐雲學堂",
    date: "2025/10/02 08:20:32",
    url: "https://www.sinotrade.com.tw/richclub/news/68ddc7c58ff59b56a6fa9b98",
  },
  {
    title: "《證交所》創新板鬆綁將提三優化",
    outlet: "富聯網",
    date: "2025/10/02 08:20:00",
    url: "http://ww2.money-link.com.tw/RealtimeNews/NewsContent.aspx?SN=5956505001&PU=0010",
  },
  {
    title: "《證交所》證交所參與台灣新創投資年會助新創企業進入資本市場",
    outlet: "中時新聞網",
    date: "2025/10/02 08:08:00",
    url: "https://www.chinatimes.com/realtimenews/20251002001069-260410",
  },
  {
    title: "《證交所》證交所參與台灣新創投資年會助新創企業進入資本市場",
    outlet: "翻爆",
    date: "2025/10/02 08:08:00",
    url: "https://turnnewsapp.com/livenews/finance/20251002001069-260410",
  },
  {
    title: "《證交所》證交所參與台灣新創投資年會助新創企業進入資本市場",
    outlet: "豐雲學堂",
    date: "2025/10/02 07:58:28",
    url: "https://www.sinotrade.com.tw/richclub/news/68ddc7c58ff59b56a6fa9ce4",
  },
  {
    title: "《證交所》證交所參與台灣新創投資年會助新創企業進入資本市場",
    outlet: "旺得富理財網",
    date: "2025/10/02 07:58:00",
    url: "https://wantrich.chinatimes.com/news/20251002900102-420501",
  },
  {
    title: "《證交所》證交所參與台灣新創投資年會助新創企業進入資本市場",
    outlet: "工商時報",
    date: "2025/10/02 07:58:00",
    url: "https://www.ctee.com.tw/news/20251002700554-430201",
  },
  {
    title: "《證交所》證交所參與台灣新創投資年會助新創企業進入資本市場",
    outlet: "富聯網",
    date: "2025/10/02 07:58:00",
    url: "http://ww2.money-link.com.tw/RealtimeNews/NewsContent.aspx?SN=5956452001&PU=0010",
  },
  {
    title: "創新板鬆綁將提三優化",
    outlet: "IEK產業情報網",
    date: "2025/10/02 04:40:00",
    url: "https://ieknet.iek.org.tw/ieknews/news_more.aspx?actiontype=ieknews&nsl_id=c7ffdf38adaf4be8b1d6b53a4f103168",
  },
  {
    title: "創新板鬆綁將提三優化",
    outlet: "中時新聞網",
    date: "2025/10/02 04:10:00",
    url: "https://www.chinatimes.com/newspapers/20251002000343-260206",
  },
  {
    title: "創新板鬆綁將提三優化",
    outlet: "Yahoo新聞",
    date: "2025/10/02 04:10:00",
    url: "https://tw.stock.yahoo.com/news/%E5%89%B5%E6%96%B0%E6%9D%BF%E9%AC%86%E7%B6%81-%E5%B0%87%E6%8F%90%E4%B8%89%E5%84%AA%E5%8C%96-201000040.html",
  },
  {
    title: "創新板鬆綁將提三優化",
    outlet: "工商時報",
    date: "2025/10/02 03:00:00",
    url: "https://www.ctee.com.tw/news/20251002700247-439901",
  },
  {
    title: "創新板鬆綁將提三優化",
    outlet: "工商時報",
    date: "2025/10/02 03:00:00",
    url: "https://www.ctee.com.tw/news/20251002700247-430201",
  },
  {
    title: "證交所挖掘新創獨角獸",
    outlet: "豐雲學堂",
    date: "2025/10/02 00:17:39",
    url: "https://www.sinotrade.com.tw/richclub/news/68dd5e158ff59b56a69c3e94",
  },
  {
    title: "創新板鬆綁將提三優化",
    outlet: "工商時報",
    date: "2025/10/02 00:00:00",
    url: "https://readers.ctee.com.tw/cm/20251002/a29ab5/1366490",
  },
  {
    title: "證交所挖掘新創獨角獸",
    outlet: "聯合新聞網",
    date: "2025/10/01 23:47:00",
    url: "https://udn.com/news/story/7251/9044028",
  },
  {
    title: "證交所挖掘新創獨角獸",
    outlet: "經濟日報",
    date: "2025/10/01 23:47:00",
    url: "https://money.udn.com/money/story/5607/9044028",
  },
  {
    title: "證交所李愛玲：支持新經濟開啟下一輪成長(圖)",
    outlet: "LINE TODAY",
    date: "2025/10/01 18:54:50",
    url: "https://today.line.me/tw/article/NvwVpxO",
  },
  {
    title: "證交所李愛玲：支持新經濟開啟下一輪成長(圖)",
    outlet: "Yahoo新聞",
    date: "2025/10/01 18:54:50",
    url: "https://tw.news.yahoo.com/%E8%AD%89%E4%BA%A4%E6%89%80%E6%9D%8E%E6%84%9B%E7%8E%B2-%E6%94%AF%E6%8C%81%E6%96%B0%E7%B6%93%E6%BF%9F%E9%96%8B%E5%95%9F%E4%B8%8B-%E8%BC%AA%E6%88%90%E9%95%B7-%E5%9C%96-105450383.html",
  },
  {
    title: "證交所參與台灣新創投資年會助力新創企業成長",
    outlet: "旺得富理財網",
    date: "2025/10/01 18:52:00",
    url: "https://wantrich.chinatimes.com/news/20251001900668-420101",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "豐雲學堂",
    date: "2025/10/01 18:47:46",
    url: "https://www.sinotrade.com.tw/richclub/news/68dd10c48ff59b56a60d3e81",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "經濟日報",
    date: "2025/10/01 18:30:00",
    url: "https://money.udn.com/money/story/5607/9043865",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "IEK產業情報網",
    date: "2025/10/01 18:20:00",
    url: "https://ieknet.iek.org.tw/ieknews/news_more.aspx?actiontype=ieknews&nsl_id=93c639e06efa465382424b00bb54b38c",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "豐雲學堂",
    date: "2025/10/01 18:19:34",
    url: "https://www.sinotrade.com.tw/richclub/news/68dd02ab8ff59b56a6fa779b",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "MSN新聞",
    date: "2025/10/01 18:19:34",
    url: "https://www.msn.com/zh-tw/money/topstories/李愛玲-創新板為提升台灣競爭力關鍵引擎/ar-AA1NEIjy",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "LINE TODAY",
    date: "2025/10/01 18:19:34",
    url: "https://today.line.me/tw/article/gzr5nlN",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "Yahoo新聞",
    date: "2025/10/01 18:19:34",
    url: "https://tw.news.yahoo.com/%E6%9D%8E%E6%84%9B%E7%8E%B2-%E5%89%B5%E6%96%B0%E6%9D%BF%E7%82%BA%E6%8F%90%E5%8D%87%E5%8F%B0%E7%81%A3%E7%AB%B6%E7%88%AD%E5%8A%9B%E9%97%9C%E9%8D%B5%E5%BC%95%E6%93%8E-101934560.html",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "pchome新聞",
    date: "2025/10/01 18:19:34",
    url: "http://news.pchome.com.tw/finance/cna/20251001/index-17593139745511318003.html",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "PChome股市",
    date: "2025/10/01 18:19:34",
    url: "http://pchome.megatime.com.tw/news/cat2/20251001/17593139745511318003.html",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "PChome股市",
    date: "2025/10/01 18:19:34",
    url: "http://pchome.megatime.com.tw/news/cat3/20251001/17593139745511318003.html",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "中央社",
    date: "2025/10/01 18:19:00",
    url: "https://www.cna.com.tw/news/afe/202510010327.aspx",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "華視新聞",
    date: "2025/10/01 18:19:00",
    url: "https://news.cts.com.tw/cna/money/202510/202510012519142.html",
  },
  {
    title: "李愛玲：創新板為提升台灣競爭力關鍵引擎",
    outlet: "好新聞",
    date: "2025/10/01 18:19:00",
    url: "https://www.wellnewss.com/post/895222.html",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "豐雲學堂",
    date: "2025/10/01 18:18:41",
    url: "https://www.sinotrade.com.tw/richclub/news/68dd09b98ff59b56a603ecc4",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "聯合新聞網",
    date: "2025/10/01 18:18:00",
    url: "https://udn.com/news/story/7251/9043841",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "經濟日報",
    date: "2025/10/01 18:17:00",
    url: "https://money.udn.com/money/story/5607/9043841",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "聯合新聞網",
    date: "2025/10/01 17:48:00",
    url: "https://udn.com/news/story/7251/9043746",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "聚財網-財經新聞",
    date: "2025/10/01 17:48:00",
    url: "https://news.wearn.com/c1829742.html",
  },
  {
    title: "證交所參與台灣新創投資年會推動創新板助力新創企業成長",
    outlet: "經濟日報",
    date: "2025/10/01 17:48:00",
    url: "https://money.udn.com/money/story/5607/9043746",
  },
  {
    title: "證交所參與台灣新創投資年會助力新創企業成長",
    outlet: "Yahoo新聞",
    date: "2025/10/01 17:41:21",
    url: "https://tw.stock.yahoo.com/news/%E8%AD%89%E4%BA%A4%E6%89%80%E5%8F%83%E8%88%87%E5%8F%B0%E7%81%A3%E6%96%B0%E5%89%B5%E6%8A%95%E8%B3%87%E5%B9%B4%E6%9C%83-%E5%8A%A9%E5%8A%9B%E6%96%B0%E5%89%B5%E4%BC%81%E6%A5%AD%E6%88%90%E9%95%B7-094121140.html",
  },
  {
    title: "證交所參與台灣新創投資年會助力新創企業成長",
    outlet: "工商時報",
    date: "2025/10/01 17:36:00",
    url: "https://www.ctee.com.tw/news/20251001701639-430201",
  },
  {
    title: "2025台灣新創投資年會登場探討AI浪潮與資本緊縮突圍路徑",
    outlet: "經濟日報",
    date: "2025/10/01 17:34:00",
    url: "https://money.udn.com/money/story/5635/9043705",
  },
];

/** /review 露出的四則（業主 2026/9：媒體報導不用全放）。
 *  64 則多為同一篇稿的轉載，故挑四家財經主媒、各自標題不同的版本。 */
const FEATURED_MEDIA_URLS = [
  "https://money.udn.com/money/story/11799/9044855", // 經濟日報 10/02
  "https://www.ctee.com.tw/news/20251002700554-430201", // 工商時報 10/02
  "https://www.chinatimes.com/newspapers/20251002000343-260206", // 中時新聞網 10/02
  "https://udn.com/news/story/7251/9044028", // 聯合新聞網 10/01
];

/** 用 filter 而非 find + non-null assertion：url 日後失準只會少一張卡，不會整頁爆掉。 */
export const featuredMedia: MediaItem[] = FEATURED_MEDIA_URLS.flatMap((u) =>
  mediaCoverage.filter((m) => m.url === u)
);

/** 第三屆（2025）社群露出，共 26 則（僅列公開帳號）。
 *  title 為貼文原標題，其中的表情符號已依鐵則（全站禁用 emoji）移除，其餘逐字保留 ——
 *  看起來像漏字的地方是原文就有符號，不要「訂正」回去。 */
export const socialCoverage: SocialItem[] = [
  {
    platform: "Threads",
    url: "https://www.threads.com/@lin.wenching/post/DPoCPt_gZAW",
    views: "489",
    title: "距離台灣新創投資年會的落幕已經一禮拜了。我也剛從日本EMBA畢業旅行回來，期間看...",
    author: "lin.wenching",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@innopractice/post/DPlqdtzkRPP",
    views: "110",
    title: "每天學習創新創業，直到成為業內人士Day 112 ：第三屆《台灣新創投資年會》...",
    author: "innopractice",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@innopractice/post/DPj0yglj5f2",
    views: "812",
    shares: "2",
    title: "每天學習創新創業，直到成為業內人士Day 111 ：第三屆《台灣新創投資年會》...",
    author: "innopractice",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@innopractice/post/DPefneGj7qo",
    views: "104",
    shares: "1",
    title: "每天學習創新創業，直到成為業內人士Day 109 ：第三屆《台灣新創投資年會》...",
    author: "innopractice",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@startup.venture.outsider/post/DPbrV8ziTbq",
    views: "478",
    shares: "2",
    title: "【台灣新創投資年會小小心得投資人篇】身為長期在創投與新創之間飄移的局...",
    author: "startup.venture.outsider",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@innopractice/post/DPZofkXj0z2",
    views: "1,107",
    shares: "3",
    title: "每天學習創新創業，直到成為業內人士Day 107 ：第三屆《台灣新創投資年會》...",
    author: "innopractice",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@startup.venture.outsider/post/DPZJX4pki-a",
    views: "527",
    shares: "1",
    title: "【台灣新創投資年會小小心得創業家篇】這兩天的年會，資訊量大到我週末還在...",
    author: "startup.venture.outsider",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163432962860535",
    shares: "8",
    title: "台灣新創投資年會分享- From MAGA to MTGA最後，小弟摘要一...",
    author: "詹益鑑",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163432946730535",
    shares: "14",
    title: "台灣新創投資年會筆記-不是創投，而是VC by VENTURE+創辦人...",
    author: "詹益鑑",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163432931710535",
    shares: "1",
    title: "台灣新創投資年會筆記-我的創業人生by何飛鵬社長---創業的起...",
    author: "詹益鑑",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@icjan/post/DPYRgsPDREH",
    views: "741",
    shares: "6",
    title: "年會筆記-如何系統性地投出獨角獸前天落幕的第三屆台灣新創投資年會，我全程...",
    author: "icjan",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163432677860535",
    shares: "15",
    title: "台灣新創投資年會筆記-贏在不確定的年代by Terry Hsiao蕭一白...",
    author: "詹益鑑",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163432664380535",
    shares: "7",
    title: "台灣新創投資年會筆記-台灣新創投資洞察by台經院Eric Fan范秉...",
    author: "詹益鑑",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163432643655535",
    shares: "60",
    title: "台灣新創投資年會筆記-如何系統性地投出獨角獸今年為期兩天的第三屆台灣新創...",
    author: "詹益鑑",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@lin.wenching/post/DPWT3g3gV7K",
    views: "1,760",
    shares: "1",
    title: "我還幾天沒看Threads了，今天上來看，原來台灣新創投資年會在Threads上...",
    author: "lin.wenching",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@innopractice/post/DPUP5RrEiGs",
    views: "393",
    title: "每天學習創新創業，直到成為業內人士Day 105：第三屆《台灣新創投資年會》投...",
    author: "innopractice",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@startup.venture.outsider/post/DPTpiKTErjl",
    views: "1,946",
    shares: "2",
    title: "【台灣新創投資年會Day 2：臺灣的TechCrunch Disrupt?...",
    author: "startup.venture.outsider",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/1788235857/posts/10224581482283027",
    title: "一早就來學習前輩們的經驗與無私分享 Venture + Roy：VC=...",
    author: "温宏駿",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@allenyao22/post/DPRQ4hkE94k",
    views: "1,112",
    title: "感謝Vincent特邀台灣新創投資年會一直希望年會有更多產品化的分享這次就特...",
    author: "allenyao22",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/1788235857/posts/10224576177990423",
    title: "班哥我還是趕到了 AAMA10期一條心(Abner就是帥）第三屆台灣新創...",
    author: "温宏駿",
  },
  {
    platform: "Facebook粉絲團",
    url: "https://www.facebook.com/233140110222019/posts/1146121814285144",
    shares: "20",
    title: "今天下午，我受「台灣新創投資年會」邀請，對數百位創業者與投資人演講。我以...",
    author: "簡榮宗",
  },
  {
    platform: "Facebook粉絲團",
    url: "https://www.facebook.com/234748703319896/posts/1299635408842882",
    shares: "1",
    title: "#布爾喬亞在工作恭喜台灣新創投資社團與創辦人林文欽，2025 #第三屆台...",
    author: "布爾喬亞公關顧問",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@startup.venture.outsider/post/DPQegj8jY0d",
    views: "1,115",
    shares: "2",
    title: "【今日最夯打卡地點：台灣新創投資年會Day1】 「台灣新創投資年會」登場...",
    author: "startup.venture.outsider",
  },
  {
    platform: "Facebook不公開社團",
    url: "https://www.facebook.com/178266799227418/posts/2524828297904578",
    title: "台灣新創投資年會今天盛大展開、歡迎大家可以到其社團觀看資訊！《10/2台灣新創投...",
    author: "Chen Terry",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@angel_liu868/post/DPP9GCfFPTq",
    views: "83",
    title: "城邦出版集團何鵬飛社長，從19歲開始創業，他不是創業中就是正在創業的路上⋯一直...",
    author: "angel_liu868",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/675035534/posts/10163418710710535",
    title: "台灣新創投資年會，第三屆，開始了！",
    author: "詹益鑑",
  },
];

/** 第三屆（2025）贊助單位 logo（簡報 P39／P40，同一單位只列最高層級）。 */
export const thirdEditionSponsors: SponsorLogo[] = [
  { name: "Qualcomm", logo: "/review/logos/qualcomm.png", tier: "首席贊助" },
  { name: "臺灣證券交易所", logo: "/review/logos/taiwan-stock-exchange.png", tier: "首席贊助" },
  { name: "SIC 永續影響力投資", logo: "/review/logos/sic-sustainable-impact-capital.png", tier: "贊助商" },
  { name: "AVA Angels", logo: "/review/logos/ava-angels.png", tier: "贊助商" },
  { name: "AppWorks 之初創投", logo: "/review/logos/appworks.png", tier: "贊助商" },
  { name: "SparkLabs Taiwan", logo: "/review/logos/sparklabs-taiwan.png", tier: "贊助商" },
  { name: "好食好事基金會 HAOSHI", logo: "/review/logos/haoshi.png", tier: "贊助商" },
  { name: "Taiwan Global Angels", logo: "/review/logos/taiwan-global-angels.png", tier: "贊助商" },
  { name: "臺大創創中心", logo: "/review/logos/ntu-entrepreneurship-center.png", tier: "贊助商" },
  { name: "CIEA 跨境創新創業交流協會", logo: "/review/logos/ciea.png", tier: "新創生態贊助商" },
  { name: "EDA 新創企業發展學院", logo: "/review/logos/eda-academy.png", tier: "新創生態贊助商" },
  { name: "Slasify", logo: "/review/logos/slasify.png", tier: "新創生態贊助商" },
  { name: "查理的創業化合物", logo: "/review/logos/charlie-startup-compound.png", tier: "新創生態贊助商" },
  { name: "Amazon Web Services", logo: "/review/logos/aws.png", tier: "新創生態贊助商" },
  { name: "布爾喬亞公關顧問 Vocal Middle", logo: "/review/logos/vocal-middle.png", tier: "新創生態贊助商" },
  { name: "ben 應援科技", logo: "/review/logos/ben-tech.png", tier: "新創生態贊助商" },
  { name: "CYBERBIZ 順立智慧", logo: "/review/logos/cyberbiz.png", tier: "新創生態贊助商" },
  { name: "Why-Not Universal", logo: "/review/logos/why-not-universal.png", tier: "新創生態贊助商" },
  { name: "立勤國際法律事務所", logo: "/review/logos/taipeilaw.png", tier: "新創生態贊助商" },
  { name: "TEC 臺大創創中心", logo: "/review/logos/ntu-tec.png", tier: "新創生態贊助商" },
  { name: "TVCA 台灣創業投資商業同業公會", logo: "/review/logos/tvca.png", tier: "新創生態贊助商" },
];

/** 第三屆兩日議程 —— 抽成具名常數，供講者名單推導與版面共用。
 *  內容逐字保留當年議程，未改寫。 */
const editionThreeForums: PastForum[] = [
  {
    day: 1,
    date: "2025-10-01",
    name: "創辦人論壇",
    sessions: [
      {
        time: "09:00–09:05",
        duration: "5 min",
        title: "主辦人致歡迎辭",
        speaker: "台灣新創投資年會主辦人林文欽",
        format: "keynote",
      },
      {
        time: "09:05–09:30",
        duration: "25 min",
        title: "開幕演講：我的創業人生",
        speaker: "商周集團城邦集團聯合創辦人何飛鵬",
        format: "keynote",
      },
      {
        time: "09:30–09:55",
        duration: "25 min",
        title: "台灣軟體公司的全球化佈局，以KDAN為例",
        speaker: "Kdan凱鈿創辦人兼執行長蘇柏州",
        format: "keynote",
      },
      {
        time: "09:55–10:35",
        duration: "40 min",
        title: "特約演講嘉賓：贏在不確定的年代",
        speaker: "連續創業家美國 BonHope創投基金經營合夥人蕭一白",
        format: "keynote",
      },
      {
        time: "10:35–10:45",
        duration: "10 min",
        title: "早上場休息時間",
        format: "break",
      },
      {
        time: "10:45–11:05",
        duration: "20 min",
        title: "臺灣IPO新趨勢—創新板助力新創企業成長",
        speaker: "台灣證交所總經理李愛玲",
        format: "keynote",
      },
      {
        time: "11:05–11:25",
        duration: "20 min",
        title: "Driving Innovation in the AI Era",
        speaker: "高通業務開發總監暨亞太生態系發展計畫負責人戴郁文",
        format: "keynote",
      },
      {
        time: "11:25–12:00",
        duration: "35 min",
        title: "《新創圈的小欣欣之約》 Panel",
        speaker: "Panel主持人Addin Venture合夥人蘇祐立 Meet創業小聚執行長AAMA搖籃計劃董事陳素蘭 時代基金會Garage+執行長趙如媛",
        format: "panel",
      },
      {
        time: "12:00–13:00",
        duration: "60 min",
        title: "中午場休息時間",
        format: "break",
      },
      {
        time: "13:00–13:25",
        duration: "25 min",
        title: "投資企業與新創的賦能及協同",
        speaker: "新光三越創投董事長王楠淵William",
        format: "keynote",
      },
      {
        time: "13:25–13:50",
        duration: "25 min",
        title: "Lessons I Learned from Startup Founders",
        speaker: "基石創投總經理林子樸TP Lin",
        format: "keynote",
      },
      {
        time: "13:50–14:15",
        duration: "25 min",
        title: "台灣創業者的成長挑戰",
        speaker: "SIC永續影響力投資共同創辦人黃俊傑Amos",
        format: "keynote",
      },
      {
        time: "14:15–14:40",
        duration: "25 min",
        title: "用股權規劃守住創辦人的權力與尊嚴",
        speaker: "新創律師CIEA跨境創新創業交流協會理事長簡榮宗",
        format: "keynote",
      },
      {
        time: "14:40–15:05",
        duration: "25 min",
        title: "新創出海：不是Plus，是Must",
        speaker: "LANDED赴美加速器負責人黃聖安Bryan Huang",
        format: "keynote",
      },
      {
        time: "15:05–15:20",
        duration: "15 min",
        title: "下午場休息",
        format: "break",
      },
      {
        time: "15:20–15:45",
        duration: "25 min",
        title: "第三次AI浪潮下，台灣團隊如何勇敢Pivot產品找到PMF？",
        speaker: "云思維商業模式產品化顧問史耀云",
        format: "keynote",
      },
      {
        time: "15:45–16:10",
        duration: "25 min",
        title: "從硬體思維到智慧零售生態圈",
        speaker: "CYBERBIZ順立智慧創辦人兼執行長蘇基明",
        format: "keynote",
      },
      {
        time: "16:10–16:35",
        duration: "25 min",
        title: "走向第四次創業：數位健康",
        speaker: "Flowgreens創辦人海外創業連續成功創業家許晴晏博士",
        format: "keynote",
      },
      {
        time: "16:35–17:10",
        duration: "35 min",
        title: "amazing talker：從0到18億，正往750億邁進",
        speaker: "Amazing Talker創辦人兼執行長趙捷平Abner",
        format: "keynote",
      },
    ],
  },
  {
    day: 2,
    date: "2025-10-02",
    name: "投資人論壇",
    sessions: [
      {
        time: "09:00–09:05",
        duration: "5 min",
        title: "年會主辦人致歡迎詞",
        speaker: "台灣新創投資年會主辦人林文欽Vincent",
        format: "keynote",
      },
      {
        time: "09:05–09:35",
        duration: "30 min",
        title: "不是創投，是VC",
        speaker: "Venture+管理合夥人莊豐賓Roy",
        format: "keynote",
      },
      {
        time: "09:35–10:05",
        duration: "30 min",
        title: "解鎖雙島新動能：台日新創投資報告",
        speaker: "中華開發資本創新投資事業群主管董事總經理郭大經",
        format: "keynote",
      },
      {
        time: "10:05–10:35",
        duration: "30 min",
        title: "資本的羅盤：引領新創穿越不確定年代",
        speaker: "H&Q漢鼎創投董事總經理張英信",
        format: "keynote",
      },
      {
        time: "10:35–10:45",
        duration: "10 min",
        title: "上午場休息時間",
        format: "break",
      },
      {
        time: "10:45–11:15",
        duration: "30 min",
        title: "臺灣新創投資洞察：資本熱潮下的反思",
        speaker: "台灣經濟研究院研究六所副所長范秉航",
        format: "keynote",
      },
      {
        time: "11:15–11:55",
        duration: "40 min",
        title: "GenAI Investment Trends",
        speaker: "靖亞資本Eminence Capital創始管理合夥人鄭靖偉Peter",
        format: "keynote",
      },
      {
        time: "13:00–13:30",
        duration: "30 min",
        title: "以永續型創投打造連結產業與資本的創投新路徑",
        speaker: "能率亞洲資本總經理游智元",
        format: "keynote",
      },
      {
        time: "13:30–14:00",
        duration: "30 min",
        title: "新創投資與其他森林裡有數條過於喧囂的孤獨之路",
        speaker: "和鼎創投副董事長暨總經理劉奕成IC",
        format: "keynote",
      },
      {
        time: "14:00–14:30",
        duration: "30 min",
        title: "全民資本-成就企業新動能",
        speaker: "資本圈天使會創辦人李豐源Dennis",
        format: "keynote",
      },
      {
        time: "14:30–14:45",
        duration: "15 min",
        title: "下午場休息時間",
        format: "break",
      },
      {
        time: "14:45–15:10",
        duration: "25 min",
        title: "科絡達：SDV與SDX產業視角與機會",
        speaker: "Carota科絡達創辦人兼執行長 吳柏儀 Paul Wu",
        format: "keynote",
      },
      {
        time: "15:10–15:35",
        duration: "25 min",
        title: "募資四千萬美金創業者的三個真實故事",
        speaker: "WeMo執行長劉于遜Davidd",
        format: "keynote",
      },
      {
        time: "15:35–16:00",
        duration: "25 min",
        title: "台灣新創軟體投資的百倍奇蹟之旅",
        speaker: "Taiwan Global Angels 創辦人詹益鑑",
        format: "keynote",
      },
      {
        time: "16:00–16:25",
        duration: "25 min",
        title: "From MAGA to MTGA",
        speaker: "新經濟創投NEV管理合夥人溫宏駿",
        format: "keynote",
      },
      {
        time: "16:25–16:50",
        duration: "25 min",
        title: "可以被複製的天使投資方法論",
        speaker: "DNA Fund創始合伙人 / 大數碼集團董事長王俊傑博士",
        format: "keynote",
      },
      {
        time: "16:50–17:15",
        duration: "25 min",
        title: "Fintech x AI：東南亞SaaS的新商業典範",
        speaker: "Hive Venture 李彥樞Yanlee",
        format: "keynote",
      },
    ],
  },
];

/** 第一屆（2023）講者名單 —— 業主提供的當年議程表圖片，2026/9 手動輸入。
 *  不在 gen_review.py 的輸出範圍內（那支只讀簡報 XML），重跑產生器不會覆寫這裡。
 *
 *  只存講者與講題，不存時間表：業主指示不需要時間欄，且 Edition.forums 目前
 *  沒有任何頁面在讀（components/review/Timeline.tsx 未被掛上），存了也不會顯示。
 *
 *  原表 9 列裡有 4 列沒有收進來：
 *  - 「報到」「大合照 & 中場休息」不是議程（比照第三屆排除 format: "break"）
 *  - 林文欽（主辦方致歡迎詞）、李鴻基（開場嘉賓致辭）—— 業主指示這類場次標籤不進資料，
 *    這兩列拿掉標籤後就沒有講題可放，整列不收。同理，陳俊秀那列的「特邀嘉賓演講：」
 *    前綴也去掉，只留真正的講題。
 *
 *  姓名逐字保留原表寫法（「李鴻基Alex」無空格、「林志垚 Steve」有空格），不做潤飾。 */
const firstEditionSpeakers: PastSpeaker[] = [
  {
    name: "陳俊秀",
    org: "交大校友總會",
    title: "執行長、交大天使會發起人",
    topic: "我的天使之路",
  },
  {
    name: "成之璇Tina",
    org: "心元資本",
    title: "執行合夥人",
    topic: "心元資本：從天使到機構基金，如何在10年投出10家獨角獸企業",
  },
  {
    name: "李彥樞Yan",
    org: "Hive Venture",
    title: "聯合創辦人",
    topic: "台灣AI創投與新創的成長路程",
  },
  {
    name: "林志垚 Steve",
    org: "SIC 永續影響力投資",
    title: "共同創辦人、AAMA學院院長",
    topic: "如何與天使合作，落實影響力投資",
  },
  {
    name: "方俊傑",
    org: "AVA天使組織",
    title: "創辦人兼CEO",
    topic: "AVA天使組織的運營經驗揭秘",
  },
];

/** 第二屆（2024）講者名單 —— 業主提供的《第二屆新創投資年會講者名單與主題.pptx》，2026/9 手動輸入。
 *  同 firstEditionSpeakers，不在 gen_review.py 的輸出範圍內。
 *
 *  day 1 ＝ 10/16（三）投資人專場、day 2 ＝ 10/18（五）主會場 —— 這一屆是兩天，
 *  與《第四屆企劃 pptx》記載的「單日」不符，已依本檔一併修正該屆的日期／天數欄位。
 *
 *  收錄規則同第一屆：排除午餐與 Coffee break，排除兩場主辦人致歡迎辭／詞（去掉場次
 *  標籤後無講題可放），並去掉「專題演講：」「連續創業家分享：」「創業家分享：」這類
 *  場次性質前綴。《天使代表》是當年的節目單元名、不是場次標籤，故保留。
 *
 *  其餘一律逐字保留 pptx 原文（半形冒號、以 / 分隔的複合職稱、中英夾雜的姓名寫法都不潤飾），
 *  比照第三屆議程的處理原則。 */
const secondEditionSpeakers: PastSpeaker[] = [
  // Day 1｜10/16 投資人專場
  {
    name: "林桂光 Kay",
    org: "達盈創投",
    title: "總經理",
    topic: "創投的人工/工人智慧",
    day: 1,
  },
  {
    name: "沈立平Robin",
    org: "益鼎創投",
    title: "資深協理",
    topic: "台灣新創的挑戰",
    day: 1,
  },
  {
    name: "王永達 William",
    org: "中華開發資本管顧",
    title: "資深協理",
    topic: "新創賦能-財務投資人的策略投資",
    day: 1,
  },
  {
    name: "鄭靖偉Peter",
    org: "靖亞資本Eminence Capital",
    title: "創始管理合夥人",
    topic: "AI Cloud賽道投資新趨勢",
    day: 1,
  },
  {
    name: "陳明明 Ming",
    org: "KKday",
    title: "創辦人兼CEO",
    topic: "領導KKday走過疫情，乘風破浪的故事",
    day: 1,
  },
  {
    name: "林靖德Mark",
    org: "Rybit運點科技",
    title: "創辦人兼執行長",
    topic: "騎向國際的Rybit E-Bike（Moovo）",
    day: 1,
  },
  {
    name: "邱彥錡",
    org: "SparkLabs Taiwan",
    title: "共同創辦人暨管理合夥人",
    topic: "加速器創投基金投資策略：打造新創與創投之間的成功合作模式",
    day: 1,
  },
  {
    name: "方俊傑",
    org: "AVA Angels",
    title: "創辦人兼CEO",
    topic: "從天使投資的視角探索另類創業投資：創新機遇與挑戰",
    day: 1,
  },
  {
    name: "黃沛聲律師",
    org: "立勤國際法律事務所/TGA Angels",
    title: "共同創辦人",
    topic: "台灣投資人在美國的機會與挑戰：TGA 三年來的經驗與成果",
    day: 1,
  },
  {
    name: "林家振",
    org: "安卓樂資本Andra Capital",
    title: "合夥人",
    topic: "美國AI的價值鏈發展與投資趨勢",
    day: 1,
  },
  {
    name: "邱敬媛",
    org: "AppWorks",
    title: "Principal",
    topic: "AppWorks的生態以及基金投資策略介紹",
    day: 1,
  },
  {
    name: "吳敏哲",
    org: "Upstream Ventures上游創投",
    title: "合夥人",
    topic: "《天使代表》從穩健到創新：上市櫃投資者的創投新征途",
    day: 1,
  },

  // Day 2｜10/18 主會場
  {
    name: "林束珊Susan",
    org: "中華開發資本管顧",
    title: "資深副總經理",
    topic: "中華開發創投策略及分享",
    day: 2,
  },
  {
    name: "林宇聲Vincent",
    org: "台新創投",
    title: "總經理/創投公會副理事長",
    topic: "Spotlight on Startups - 新創競賽剖析",
    day: 2,
  },
  {
    name: "范秉航",
    org: "台灣經濟研究院研究六所",
    title: "副所長",
    topic: "臺灣早期投資趨勢觀察與解讀",
    day: 2,
  },
  {
    name: "鄭靖偉Peter",
    org: "靖亞資本Eminence Capital",
    title: "創始管理合夥人",
    topic: "創業、創投20年：給台灣創業者的成長建議",
    day: 2,
  },
  {
    name: "劉榮太Terence",
    org: "Txone 睿控網安",
    title: "創辦人兼執行長",
    topic: "25年創業之路：經營、募資、與國際化的心得分享",
    day: 2,
  },
  {
    name: "黃俊傑Amos",
    org: "SIC永續影響力投資",
    title: "共同創辦人",
    topic: "影響力投資的趨勢與實踐",
    day: 2,
  },
  {
    name: "藍兆君",
    org: "台灣大哥大",
    title: "策略與投資總監",
    topic: "Telco+Tech: 台灣大哥大戰略投資分享",
    day: 2,
  },
  {
    name: "林薇真Amber",
    org: "好食好事基金會",
    title: "副執行長",
    topic: "東南亞食農新創發展及構建台灣生態圈",
    day: 2,
  },
  {
    name: "楊曜陽Denny",
    org: "紅樓資本",
    title: "共同創辦人",
    topic: "Web3 科技創業如何反轉台灣在海外的新創地位及創造財富效應",
    day: 2,
  },
  {
    name: "江旻峻Brandon",
    org: "Addin Capital富旌創投",
    title: "合夥人/布蘭登觀點作者",
    topic: "AI / LLM 時代，數位軟體新創的下一波機會",
    day: 2,
  },
  {
    name: "余常任 Jonathan Yu",
    org: "杰倫智能科技",
    title: "全球業務總經理",
    topic: "AI驅動的製造業高效轉型:Profet AI的全球足跡與增長策略",
    day: 2,
  },
  {
    name: "詹益鑑",
    org: "Taiwan Global Angels",
    title: "創辦人",
    topic: "獨角獸與捕鯨人",
    day: 2,
  },
  {
    name: "吳德威David",
    org: "Acorn Pacific Ventures",
    title: "合夥人/天使投資人",
    topic: "美國與台灣初創團隊的思維差異",
    day: 2,
  },
  {
    name: "李明哲",
    org: "Visionary Capital",
    title: "董事長/前文策院院長/前Kkbox總裁",
    topic: "《天使代表》從寫 BUG 到抓獨角獸：鬼才知道の新創投資鬼才之道",
    day: 2,
  },
];

/** 第三屆（2025）講者名單 —— 2026/9 依 editionThreeForums 逐筆人工拆解。
 *
 *  原本是用 flatMap 從議程推導：org 塞整串簡報原文（「Kdan凱鈿創辦人兼執行長蘇柏州」）、
 *  name 留空字串。那樣三屆的名單長得不一樣，故改為與第一、二屆同一形狀的手寫陣列。
 *  拆解無法自動化（原文沒有分隔符），所以這份不再由 editionThreeForums 推導 ——
 *  日後改議程要記得兩邊都改。editionThreeForums 保留為逐字的原始議程紀錄。
 *
 *  收錄規則同第一、二屆：排除 5 場休息、排除兩場主辦人致歡迎辭／詞，
 *  去掉「開幕演講：」「特約演講嘉賓：」與 Panel 那列尾端的「 Panel」等場次標籤；
 *  《新創圈的小欣欣之約》是單元名（同《天使代表》）、「amazing talker：」「科絡達：」
 *  是公司名前綴，都屬講題的一部分故保留。
 *
 *  Panel 一列原文塞了三個人，拆成三列共用同一講題，主持人身分寫進職稱。 */
const thirdEditionSpeakers: PastSpeaker[] = [
  // Day 1｜創辦人論壇
  {
    name: "何飛鵬",
    org: "商周集團城邦集團",
    title: "聯合創辦人",
    topic: "我的創業人生",
    day: 1,
  },
  {
    name: "蘇柏州",
    org: "Kdan凱鈿",
    title: "創辦人兼執行長",
    topic: "台灣軟體公司的全球化佈局，以KDAN為例",
    day: 1,
  },
  {
    name: "蕭一白",
    org: "美國 BonHope創投基金",
    title: "連續創業家、經營合夥人",
    topic: "贏在不確定的年代",
    day: 1,
  },
  {
    name: "李愛玲",
    org: "台灣證交所",
    title: "總經理",
    topic: "臺灣IPO新趨勢—創新板助力新創企業成長",
    day: 1,
  },
  {
    name: "戴郁文",
    org: "高通",
    title: "業務開發總監暨亞太生態系發展計畫負責人",
    topic: "Driving Innovation in the AI Era",
    day: 1,
  },
  {
    name: "蘇祐立",
    org: "Addin Venture",
    title: "合夥人、主持人",
    topic: "《新創圈的小欣欣之約》",
    day: 1,
  },
  {
    name: "陳素蘭",
    org: "Meet創業小聚",
    title: "執行長、AAMA搖籃計劃董事",
    topic: "《新創圈的小欣欣之約》",
    day: 1,
  },
  {
    name: "趙如媛",
    org: "時代基金會Garage+",
    title: "執行長",
    topic: "《新創圈的小欣欣之約》",
    day: 1,
  },
  {
    name: "王楠淵William",
    org: "新光三越創投",
    title: "董事長",
    topic: "投資企業與新創的賦能及協同",
    day: 1,
  },
  {
    name: "林子樸TP Lin",
    org: "基石創投",
    title: "總經理",
    topic: "Lessons I Learned from Startup Founders",
    day: 1,
  },
  {
    name: "黃俊傑Amos",
    org: "SIC永續影響力投資",
    title: "共同創辦人",
    topic: "台灣創業者的成長挑戰",
    day: 1,
  },
  {
    name: "簡榮宗",
    org: "CIEA跨境創新創業交流協會",
    title: "新創律師、理事長",
    topic: "用股權規劃守住創辦人的權力與尊嚴",
    day: 1,
  },
  {
    name: "黃聖安Bryan Huang",
    org: "LANDED赴美加速器",
    title: "負責人",
    topic: "新創出海：不是Plus，是Must",
    day: 1,
  },
  {
    name: "史耀云",
    org: "云思維",
    title: "商業模式產品化顧問",
    topic: "第三次AI浪潮下，台灣團隊如何勇敢Pivot產品找到PMF？",
    day: 1,
  },
  {
    name: "蘇基明",
    org: "CYBERBIZ順立智慧",
    title: "創辦人兼執行長",
    topic: "從硬體思維到智慧零售生態圈",
    day: 1,
  },
  {
    name: "許晴晏博士",
    org: "Flowgreens",
    title: "創辦人、海外創業連續成功創業家",
    topic: "走向第四次創業：數位健康",
    day: 1,
  },
  {
    name: "趙捷平Abner",
    org: "Amazing Talker",
    title: "創辦人兼執行長",
    topic: "amazing talker：從0到18億，正往750億邁進",
    day: 1,
  },

  // Day 2｜投資人論壇
  {
    name: "莊豐賓Roy",
    org: "Venture+",
    title: "管理合夥人",
    topic: "不是創投，是VC",
    day: 2,
  },
  {
    name: "郭大經",
    org: "中華開發資本",
    title: "創新投資事業群主管、董事總經理",
    topic: "解鎖雙島新動能：台日新創投資報告",
    day: 2,
  },
  {
    name: "張英信",
    org: "H&Q漢鼎創投",
    title: "董事總經理",
    topic: "資本的羅盤：引領新創穿越不確定年代",
    day: 2,
  },
  {
    name: "范秉航",
    org: "台灣經濟研究院研究六所",
    title: "副所長",
    topic: "臺灣新創投資洞察：資本熱潮下的反思",
    day: 2,
  },
  {
    name: "鄭靖偉Peter",
    org: "靖亞資本Eminence Capital",
    title: "創始管理合夥人",
    topic: "GenAI Investment Trends",
    day: 2,
  },
  {
    name: "游智元",
    org: "能率亞洲資本",
    title: "總經理",
    topic: "以永續型創投打造連結產業與資本的創投新路徑",
    day: 2,
  },
  {
    name: "劉奕成IC",
    org: "和鼎創投",
    title: "副董事長暨總經理",
    topic: "新創投資與其他森林裡有數條過於喧囂的孤獨之路",
    day: 2,
  },
  {
    name: "李豐源Dennis",
    org: "資本圈天使會",
    title: "創辦人",
    topic: "全民資本-成就企業新動能",
    day: 2,
  },
  {
    name: "吳柏儀 Paul Wu",
    org: "Carota科絡達",
    title: "創辦人兼執行長",
    topic: "科絡達：SDV與SDX產業視角與機會",
    day: 2,
  },
  {
    name: "劉于遜Davidd",
    org: "WeMo",
    title: "執行長",
    topic: "募資四千萬美金創業者的三個真實故事",
    day: 2,
  },
  {
    name: "詹益鑑",
    org: "Taiwan Global Angels",
    title: "創辦人",
    topic: "台灣新創軟體投資的百倍奇蹟之旅",
    day: 2,
  },
  {
    name: "溫宏駿",
    org: "新經濟創投NEV",
    title: "管理合夥人",
    topic: "From MAGA to MTGA",
    day: 2,
  },
  {
    name: "王俊傑博士",
    org: "DNA Fund / 大數碼集團",
    title: "創始合伙人、董事長",
    topic: "可以被複製的天使投資方法論",
    day: 2,
  },
  {
    // 議程原文只寫「Hive Venture 李彥樞Yanlee」，未載職稱 → title 省略，不臆造
    name: "李彥樞Yanlee",
    org: "Hive Venture",
    topic: "Fintech x AI：東南亞SaaS的新商業典範",
    day: 2,
  },
];

/** 過往參與者好評留言 —— 版位已保留，待 Vincent 撈取後填入。
 *  空陣列 → 該區塊整個不渲染。
 *  每則需要：留言內容、姓名、職稱、公司、哪一屆、是否同意具名引用。 */
export const testimonials: Testimonial[] = [
  // TODO: 待業主提供。建議每屆 3–5 則、總共 10–15 則。
];

export const editions: Edition[] = [
  {
    no: 3,
    year: 2025,
    dateLabel: "2025年10月1日（三）－10月2日（四）　09:00－17:10",
    venue: "政大公企中心 A 棟 2 樓國際會議廳",
    venueAddress: "台北市大安區金華街 187 號",
    stats: [
      { label: "投資機構", value: "18 家" },
      { label: "跨世代創業家", value: "8 位" },
      { label: "生態系組織領袖", value: "7 位" },
      { label: "專業顧問", value: "3 位" },
      { label: "兩天報名參與", value: "1,000 人" },
      { label: "議程場次", value: "35 場" },
      { label: "媒體露出", value: "64 則" },
      { label: "社群露出", value: "26 則" },
    ],
    highlights: [
      "分創辦人論壇與投資人論壇兩日舉行，兩天合計 35 場演講與對談。",
      "匯聚 18 家投資機構、8 位跨世代創業家、7 位生態系組織領袖與 3 位專業顧問同台。",
      "兩天 1,000 人報名參與，維持台灣新創投資圈唯一售票大型論壇的滿座紀錄。",
      "會後累積 64 則媒體露出，涵蓋中央社、經濟日報、工商時報、中時新聞網等主流財經媒體。",
      "26 則公開社群貼文分享年會內容，可監測到 146 次分享。",
    ],
    forums: editionThreeForums,
    oneLiner: "首度擴大為雙日雙論壇，兩天 1,000 人到場。",
    heroPhoto: "/review/third-edition-keynote-hofeipeng.jpg",
    growth: {
      attendees: 1000,
      speakers: 32,
      institutions: 18,
      days: 2,
    },
    pastSpeakers: thirdEditionSpeakers,
    photos: [
      "/review/third-edition-keynote-hofeipeng.jpg",
      "/review/stage-keynote-from-physics-to-vc.jpg",
      "/review/stage-speaker-sponsor-wall.jpg",
      "/review/group-photo.jpg",
      "/review/stage-keynote-venture-plus.jpg",
      "/review/panel-xiaoxinxin.jpg",
      "/review/audience-and-stage.jpg",
      "/review/stage-keynote-amazingtalker.jpg",
    ],
    sponsors: thirdEditionSponsors,
    media: mediaCoverage,
    social: socialCoverage,
    dataComplete: true,
  },
  {
    no: 2,
    year: 2024,
    // 這一屆是「非連續的兩天」，故用「、」而非「－」。時間為兩天的涵蓋區間
    // （10/16 場 08:30－17:30、10/18 場 08:30－17:20，見第二屆議程 pptx）。
    // 先前依《第四屆企劃 pptx》寫成「單日 10/16 09:00－17:00」，2026/9 依當屆議程更正。
    dateLabel: "2024年10月16日（三）、10月18日（五）　08:30－17:30",
    venue: "台大集思會議中心 蘇格拉底廳",
    venueAddress: "台北市羅斯福路四段 85 號 B1",
    stats: [
      { label: "論壇天數", value: "2 天" },
      { label: "投資機構", value: "20 家" },
      { label: "票價", value: "NT$750" },
      { label: "報名方式", value: "審核制" },
      { label: "專業投資機構／個人投資人", value: "80%" },
      { label: "天使輪後至成長期創辦人", value: "20%" },
    ],
    highlights: [
      "分兩日舉行：10 月 16 日投資人專場、10 月 18 日主會場，皆於台大集思會議中心蘇格拉底廳，兩天合計 26 場演講。",
      "採審核制報名、票價 NT$750，閉門不直播，確保現場交流品質。",
      "出席結構為 80% 專業投資機構與個人投資人、20% 天使輪後至成長期創辦人。",
    ],
    oneLiner: "分投資人專場與主會場兩日，26 場演講。",
    heroPhoto: "/review/second-edition-audience.jpg",
    growth: {
      attendees: 120,
      // 業主提供的官方數字，刻意與下方 pastSpeakers 的列數不同（名單 26 場、25 位）——
      // 名單只收「有講題的場次」，官方數字算的是另一套口徑。別為了對齊而改任一邊。
      speakers: 10,
      institutions: 20,
      days: 2,
    },
    pastSpeakers: secondEditionSpeakers,
    dataComplete: true,
  },
  {
    no: 1,
    year: 2023,
    dateLabel: "2023年11月11日（六）　13:00－17:30",
    venue: "南山 Plaza（AWS 會議廳）",
    venueAddress: "台北市信義區松仁路 100 號",
    stats: [
      { label: "論壇天數", value: "1 天" },
      { label: "投資機構", value: "8 家" },
    ],
    highlights: [
      "首屆台灣新創投資年會於 2023 年舉辦，是台灣新創投資年會系列的起點。",
      "2023 年 11 月 11 日下午於南山 Plaza AWS 會議廳舉行的半日場，5 場演講、8 家投資機構參與。",
    ],
    // oneLiner 的每個元素都能從本檔既有欄位驗證：半日場（dateLabel 13:00－17:30、
    // growth.days）、8 家（stats／growth.institutions）、100 人（growth.attendees）。
    // 業主 2026/9 定案，取代原本「（待補）一切的起點。」的暫用文案。
    oneLiner: "南山 Plaza 的半日場，8 家投資機構、100 人到場。",
    heroPhoto: "/review/first-edition-audience.jpg",
    growth: {
      attendees: 100,
      // 同第二屆：業主官方數字，與 firstEditionSpeakers 的 5 列不同（名單不收報到、
      // 中場休息與兩場開場致詞）。兩個數字口徑不同，不要互相對齊。
      speakers: 10,
      institutions: 8,
      days: 1,
    },
    pastSpeakers: firstEditionSpeakers,
    dataComplete: true,
  },
];

