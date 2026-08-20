// 台灣新創投資年會 — 歷屆回顧資料
// 資料來源：《第四屆新創投資年會企劃 新增贊助方案.pptx》（投影片 3、34–44）
//           + 第三屆年會公開資訊（主題／日期／地點／規模）
// 由 gen_review.py 自簡報 XML 產生，議程與媒體連結逐字保留。

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

export interface Edition {
  no: number;
  year: number;
  theme?: string;
  dateLabel: string;
  venue: string;
  venueAddress?: string;
  stats: { label: string; value: string }[];
  highlights: string[];
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

/** 第三屆（2025）社群露出，共 26 則（僅列公開帳號）。 */
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
    title: "【台灣新創投資年會小小心得💼投資人篇】身為長期在創投與新創之間飄移的局...",
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
    title: "【台灣新創投資年會小小心得💡創業家篇】這兩天的年會，資訊量大到我週末還在...",
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
    title: "📊【台灣新創投資年會Day 2：臺灣的TechCrunch Disrupt?...",
    author: "startup.venture.outsider",
  },
  {
    platform: "Facebook關鍵意見領袖",
    url: "https://www.facebook.com/1788235857/posts/10224581482283027",
    title: "一早就來學習前輩們的經驗與無私分享😌 Venture + Roy：VC=...",
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
    title: "班哥我還是趕到了😌 AAMA10期一條心🔥(Abner就是帥）第三屆台灣新創...",
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
    title: "#布爾喬亞在工作🔥恭喜台灣新創投資社團與創辦人林文欽，2025 #第三屆台...",
    author: "布爾喬亞公關顧問",
  },
  {
    platform: "Threads",
    url: "https://www.threads.com/@startup.venture.outsider/post/DPQegj8jY0d",
    views: "1,115",
    shares: "2",
    title: "📣【今日最夯打卡地點：台灣新創投資年會Day1】 「台灣新創投資年會」登場...",
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

export const editions: Edition[] = [
  {
    no: 3,
    year: 2025,
    theme: "贏在不確定的年代",
    dateLabel: "2025年10月1日（三）－10月2日（四）　09:00－17:00",
    venue: "政大公企中心 A 棟 2 樓國際會議廳",
    venueAddress: "台北市大安區金華街 187 號",
    stats: [
      { label: "投資機構", value: "18 家" },
      { label: "跨世代創業家", value: "8 位" },
      { label: "生態系組織領袖", value: "7 位" },
      { label: "專業顧問", value: "3 位" },
      { label: "兩天報名參與", value: "近 800 人" },
      { label: "議程場次", value: "35 場" },
      { label: "媒體露出", value: "64 則" },
      { label: "社群露出", value: "26 則" },
    ],
    highlights: [
      "以「贏在不確定的年代」為題，分創辦人論壇與投資人論壇兩日舉行，兩天合計 35 場演講與對談。",
      "匯聚 18 家投資機構、8 位跨世代創業家、7 位生態系組織領袖與 3 位專業顧問同台。",
      "兩天近 800 人報名參與，維持台灣新創投資圈唯一售票大型論壇的滿座紀錄。",
      "會後累積 64 則媒體露出，涵蓋中央社、經濟日報、工商時報、中時新聞網等主流財經媒體。",
      "26 則公開社群貼文分享年會內容，可監測到 146 次分享。",
    ],
    forums: [
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
          title: "From MAGA to MTGA",
          speaker: "Taiwan Global Angels 創辦人詹益鑑",
          format: "keynote",
        },
        {
          time: "16:00–16:25",
          duration: "25 min",
          title: "台灣新創軟體投資的百倍奇蹟之旅",
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
    ],
    photos: [
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
    dateLabel: "2024年10月16日（三）　09:00－17:00",
    venue: "台大集思會議中心 蘇格拉底廳",
    stats: [
      { label: "論壇天數", value: "1 天" },
      { label: "票價", value: "NT$750" },
      { label: "報名方式", value: "審核制" },
      { label: "專業投資機構／個人投資人", value: "80%" },
      { label: "天使輪後至成長期創辦人", value: "20%" },
    ],
    highlights: [
      "單日論壇，於台大集思會議中心蘇格拉底廳舉行，全天 09:00 至 17:00。",
      "採審核制報名、票價 NT$750，閉門不直播，確保現場交流品質。",
      "出席結構為 80% 專業投資機構與個人投資人、20% 天使輪後至成長期創辦人。",
    ],
    dataComplete: true,
  },
  {
    no: 1,
    year: 2023,
    dateLabel: "2023年（確切日期待補）",
    venue: "待補",
    stats: [],
    highlights: [
      "首屆台灣新創投資年會於 2023 年舉辦，是台灣新創投資年會系列的起點。",
      "現存公開資料不全，議程、講者、規模與媒體露出待補。",
    ],
    dataComplete: false,
  },
];

