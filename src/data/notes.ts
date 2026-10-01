/**
 * 精華筆記：歷屆與會者發表在 Facebook 的年會筆記與心得，經作者授權全文轉載。
 *
 * 來源：《VM_新創年會精華筆記人選_20260930.xlsx》（VM 整理，六位皆已連繫並同意轉載）。
 * Max Legaldrug 的授權備註是「可以，但上架後須確認」，上架後由業主請他過目。
 *
 * 轉錄原則：
 * - 內文逐字取自貼文原始文字，錯字與用語照原文（「60多加公司」「Qualcoom」等都不訂正）。
 * - 只做版面對應：分節標題對成 h2／h3、「- 」條列對成 list、「引言＋—— 出處」對成 quote；
 *   貼文首行若是標題就移作 title，內文不重複。
 * - 依鐵則不放 emoji。內文裡的「→」照原文留著，由 NoteBody 換成圖示輸出（字型缺字，見 CLAUDE.md）。
 * - `date` 是貼文發布日（台北時間）；`summary` 取貼文開頭原句，不另外撰寫。
 * - 照片是貼文附圖，存在 public/notes/<slug>/。Facebook 只給得到縮圖尺寸（寬 590–960px），
 *   TODO: 向作者索取原檔後換檔並改檔名。
 *
 * 內文用區塊陣列而非 Markdown：專案沒有 Markdown 套件，不為這一頁加依賴。
 */

export type NoteBlock =
  /** text 內的 "\n" 會照樣換行（原文的編號列與 hashtag 列） */
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; source?: string }
  | { type: "image"; src: string; alt: string; width: number; height: number; caption?: string };

export interface NoteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Note {
  slug: string;
  title: string;
  /** 原表「發布人」寫法，不改寫 */
  author: string;
  /** 這篇寫的是哪一屆 */
  edition: 1 | 2 | 3;
  /** ISO 日期，如 "2025-10-04"。排序、sitemap 與 Article JSON-LD 都吃它 */
  date: string;
  /** Facebook 原文連結（原表所列） */
  sourceUrl: string;
  /** 列表卡與 meta description 共用 */
  summary: string;
  cover?: NoteImage;
  status: "published" | "draft";
  blocks: NoteBlock[];
}

const allNotes: Note[] = [
  // ───────── 第三屆 2025 ─────────
  {
    slug: "ic-jan-2025",
    title: "台灣新創投資年會筆記 - 不是創投，而是 VC",
    author: "詹益鑑",
    edition: 3,
    date: "2025-10-04",
    sourceUrl: "https://www.facebook.com/share/p/1FRimdWLdZ/",
    summary:
      "莊豐賓過去 20 年跨足 產業經營、創業、企業投資與創投基金管理：曾任捷運局數據分析師、貿易公司、上市公司財務長。",
    cover: {
      src: "/notes/ic-jan-2025/01.jpg",
      alt: "講者站在「2025 台灣新創投資年會」與 VENTURE+ 標誌的投影幕前演講",
      width: 810,
      height: 540,
    },
    status: "published",
    blocks: [
      { type: "p", text: "by VENTURE+ 創辦人 Roy Chuang" },
      { type: "h2", text: "一、自我介紹與背景" },
      { type: "p", text: "莊豐賓過去 20 年跨足 產業經營、創業、企業投資與創投基金管理：" },
      { type: "p", text: "曾任捷運局數據分析師、貿易公司、上市公司財務長。" },
      {
        type: "p",
        text: "30 歲後原本決定不再創業，但因緣際會加入新事業單位，最後 spun off 成新公司並成功上市。",
      },
      {
        type: "p",
        text: "在 91APP 任職財務長六年後，創業成立 Venture Plus，定位為「新型態的創投基金」。",
      },
      { type: "h2", text: "二、三頂帽子：不同角色的視角" },
      { type: "p", text: "莊豐賓以「帽子」來比喻三種角色的思維差異：" },
      {
        type: "p",
        text: "1. 經營者：注重產業與組織營運的穩健。\n2. 投資人 / 創投：更看重回報率與資本循環。\n3. 創業家：追求事業成長與價值創造，承受最大風險。",
      },
      {
        type: "p",
        text: "→ 他強調：對「新創成功」的定義，每個角色都有不同標準（營收成長、募資成功、IPO、回報率…），但對創投來說，真正的成功是能帶來 正向循環的資本回報。",
      },
      { type: "h2", text: "三、數據觀察與趨勢" },
      { type: "h3", text: "1. 台灣新創投資" },
      {
        type: "p",
        text: "近十年投資案件數量增加，但資金增速更快 → 平均單案募資額提升至 2.4 倍。",
      },
      {
        type: "p",
        text: "台灣市場上 CVC（企業創投）參與度提升，占比從 66% 上升至 71%；專業 VC 占比則下降。",
      },
      { type: "p", text: "顯示資金多但「案源集中」，專業創投壓力升高。" },
      { type: "h3", text: "2. 國際對比" },
      { type: "p", text: "以 Tesla 案例 說明美國投資回報的極端差異：" },
      { type: "p", text: "A 輪投資人 IPO 時約 20 倍回報，但若持有至今可達 250 倍以上。" },
      { type: "p", text: "說明 退出時點與耐心持有 影響巨大。" },
      { type: "p", text: "台灣創投平均回報倍數（1.3 倍）明顯落後全球（1.84 倍）。" },
      { type: "h3", text: "3. 台灣退出困境" },
      { type: "p", text: "2000 多家獲投資的新創，真正 IPO 或 M&A 出場者不到 40 家（<2%）。" },
      { type: "p", text: "與美國新創退出率約 4.5% 相比仍有落差。" },
      { type: "p", text: "主因：台灣資本市場規模小，上市公司平均市值僅美國的 1/20。" },
      { type: "h2", text: "四、Venture Plus 的做法：主動價值創造" },
      { type: "p", text: "與其只是「被動等待退出」，Venture Plus 採取 主動駕駛式創投：" },
      {
        type: "p",
        text: "1. 策略共創：與新創團隊討論市場與成長策略。\n2. 體質健檢：每月追蹤公司營運，找出 bottleneck 並修正。\n3. 價值加速：針對關鍵風險補強，對優勢資源加碼投入。",
      },
      { type: "p", text: "與傳統創投只「投錢」不同，他們強調「投後協助」。" },
      {
        type: "p",
        text: "已經完成 4 家 IPO、1 家 FBO（外部併購）、1 家獨角獸投資，並持續布局 AI、數位轉型與硬體新創。",
      },
      { type: "h2", text: "五、給台灣新創與投資人的啟示" },
      { type: "p", text: "不能只看募資成功，而要聚焦價值創造。" },
      { type: "p", text: "台灣新創要更快、更健康地成長，必須結合 資本、市場與企業資源。" },
      { type: "p", text: "創投需要更多「主動協助」，而非僅扮演金主角色。" },
      {
        type: "p",
        text: "台灣雖然市場較小，但若能建立 正向資本循環，依然有機會培育出不輸 Tesla 的案例。",
      },
    ],
  },
  {
    slug: "eugene-wang-2025",
    title: "《台灣新創投資年會心得》",
    author: "Eugene Wang",
    edition: 3,
    date: "2025-10-03",
    // 原表給的是林文欽轉貼到社團的那一則，內文取自其中 Eugene 的原貼文
    sourceUrl: "https://www.facebook.com/share/p/1EbfPUf4sc/",
    summary:
      "這兩天參加台灣新創投資年會，收穫很多。台上有許多認識的創業家與投資人朋友，無私地分享對市場、創業與投資的觀點；一方面大開眼界，一方面也提醒我：創業多年，很多時候其實還待在自己的舒適圈裡，應該要定期走出去看看別人怎麼做、怎麼思考與決策。",
    cover: {
      src: "/notes/eugene-wang-2025/01.jpg",
      alt: "年會講台上的講者與投影幕，投影片為王俊傑 Jawin Wang 的講者介紹",
      width: 590,
      height: 443,
    },
    status: "published",
    blocks: [
      {
        type: "p",
        text: "這兩天參加台灣新創投資年會，收穫很多。台上有許多認識的創業家與投資人朋友，無私地分享對市場、創業與投資的觀點；一方面大開眼界，一方面也提醒我：創業多年，很多時候其實還待在自己的舒適圈裡，應該要定期走出去看看別人怎麼做、怎麼思考與決策。",
      },
      {
        type: "p",
        text: "很多大神和朋友們分享都非常精采、台風、演講氛圍和節奏都掌把握的很棒，真的是不愧是創業家。如果要把這二天心得寫完可能要好幾篇。我想簡單分享最讓我有感觸的 王俊傑 Jawin Wang博士的演講。",
      },
      {
        type: "p",
        text: "他曾任大潤發／飛牛網首席技術官，也是天使投資人；在人生事業高峰時罹患罕見淋巴癌、後來康復的經歷，本身的故事就像一部小說(而且他還真的是一個得獎小說家)。",
      },
      {
        type: "p",
        text: "他談到自己投資常常命中，朋友都笑他是運氣，他也承認有運氣的成分，但更重要的是他很努力的想辦法把「做對了什麼」整理成可複製的方法論，也就是他今天的演講主題：《複製成功：如何系統性地投出獨角獸》。",
      },
      {
        type: "p",
        text: "我特別有共鳴，是因為這和我自己去分享時的心情很像：十幾年創業的跌跌撞撞，總想著能不能把經驗整理成方法論，讓別人拿了就能用，那才有價值。",
      },
      {
        type: "p",
        text: "該怎麼去形容我當下聽講的感覺呢？我在滿 40 歲那篇分享文裡曾感嘆，在創業、人生路上能問路的人變少了。但這次參加年會，我才發現能問路的人其實沒有少，只是他們不在我的圈子裡，需要自己走出去找。很多創投、創業前輩的來分享主要目的並不只是賺錢，而是真心想回饋年輕人和社會。尤其像王博士，能把投資的成功經驗整理成可複製的方法論，非常難得。",
      },
      { type: "p", text: "以下是我記下幾個印象最深的重點：" },
      {
        type: "p",
        text: "Timing\n透過大量一線訪談，提早捕捉典範轉移（Paradigm Shift）正在發生的時刻。",
      },
      {
        type: "p",
        text: "風險／非對稱報酬\n優先選擇「下行風險有限、上行空間極大」的題目：小成本也能做實驗，成功時回報可放大，失敗成本可承受。",
      },
      {
        type: "p",
        text: "四層漏斗（美團創辦人王興的分享）\n賽道（市場）→ 賽車手（團隊）→ 賽車（產品／商業模式）→ 時機（Timing）。\n評估時由上而下思考：先看市場與趨勢，再看人與執行力，接著是產品與模式，最後才是入場時點。",
      },
      {
        type: "p",
        text: "這次年會讓我重新思考，投資人的決策背後，其實就是對團隊、產品、公司價值的另一種檢驗。創業者如果能理解這些判斷邏輯，就能在選題和方向上更精準地切入資本世界，撬動更多資源，去做出真正能影響世界的事。",
      },
      {
        type: "p",
        text: "如果投資人能用系統化的方法投出獨角獸，那創業者或許也能從中找到規律，打造出成功的事業。",
      },
      // 封面也放進內文，與第二張並排：兩張場景幾乎相同，一張在頁首一張在文末會讀成重複
      {
        type: "image",
        src: "/notes/eugene-wang-2025/01.jpg",
        alt: "年會講台上的講者與投影幕，投影片為王俊傑 Jawin Wang 的講者介紹",
        width: 590,
        height: 443,
      },
      {
        type: "image",
        src: "/notes/eugene-wang-2025/02.jpg",
        alt: "年會講台上的講者與投影幕，投影片標題為「複製成功：如何系統性地投出獨角獸」",
        width: 590,
        height: 443,
      },
    ],
  },
  {
    slug: "max-legaldrug-2025",
    title: "《台灣新創投資年會》day2",
    author: "Max Legaldrug",
    edition: 3,
    date: "2025-10-03",
    sourceUrl: "https://www.facebook.com/share/p/19nWhbzAYy/",
    summary: "年會的第二天，投資人專場，很符合主題「贏在不確定的年代」。",
    cover: {
      // 原文註明「借了文欽哥的圖來發文」
      src: "/notes/max-legaldrug-2025/01.jpg",
      alt: "講者在「台美資本市場、新創及創投本質差異」投影片前演講",
      width: 960,
      height: 540,
    },
    status: "published",
    blocks: [
      { type: "p", text: "年會的第二天，投資人專場，很符合主題「贏在不確定的年代」。" },
      {
        type: "p",
        text: "很值得聽的內容是不同領域的投資人分別分析了日本、美國等創投和市場環境的觀察，包括獨角獸數量、創投單案投資金額、回收、IPO的組成等；",
      },
      {
        type: "p",
        text: "像是自己以為近年來台灣的創投環境相對日本活絡，確實台灣的創投投資相對於其他國家而言受影響較小，但其實進一步看會發現日本的新創投資生態系是更完整的，台灣相對規模小、投資階段早，以及欠缺新創到IPO的案件，但日本相對和台灣相反，猶記得一組數字2024年日本IPO的132家公司裡面，新創占了48家；台灣則是60多加公司裡面，新創只佔了10%左右，這似乎也顯示台灣的後期市場/公眾市場對於新創的興趣相對低。",
      },
      {
        type: "p",
        text: "今日講者的內容相對於昨日偏重觀念式的闡述，有著更多的參考數據及資料，可能也是投資人的緣故，而其中也包括了Findit資料庫的整理，這些都是很珍貴的資訊，\n在整個創業環境中，能有這些服務提供者，真的是要致上最大的感謝。",
      },
      {
        type: "p",
        text: "最後，兩天聽下來，即便只是當個聽眾，資訊量也是大的讓人精神力耗盡。",
      },
      { type: "p", text: "（不過我現在還在加班就是）" },
      { type: "p", text: "然後也有不少朋友有來提到法律兵工廠節目，感人。" },
      {
        type: "p",
        text: "再次感謝林文欽前輩及相關團隊的辛苦籌備付出，能有這樣精彩的論壇，實在不容易。也謝謝在場碰到的各位朋友、夥伴！",
      },
      // 原文此處有一行「（借了文欽哥的圖來發文）」，業主 2026/10 指示站上不放
      { type: "p", text: "#台灣新創投資年會\n#法律兵工廠\n#創業打怪生存攻略" },
    ],
  },
  {
    slug: "guo-ren-yu-2025",
    // 貼文沒有標題，用中性描述，不替作者下標
    title: "第三屆台灣新創投資年會心得",
    author: "郭仁宇",
    edition: 3,
    date: "2025-10-01",
    // 原表給的是林文欽轉貼到社團的那一則，內文取自其中郭仁宇的原貼文
    sourceUrl: "https://www.facebook.com/share/p/1EdpcJxnsg/",
    summary:
      "感謝 林文欽 舉辦的第三屆台灣新創投資年會。好久沒有全心投入在學習線下的活動，每次參與線下的活動，我堅信只要我成功從分享者身上帶走一句影響我最深的話，今天所投入的時間與精力一切都值得了！",
    status: "published",
    blocks: [
      {
        type: "p",
        text: "感謝 林文欽 舉辦的第三屆台灣新創投資年會。好久沒有全心投入在學習線下的活動，每次參與線下的活動，我堅信只要我成功從分享者身上帶走一句影響我最深的話，今天所投入的時間與精力一切都值得了！",
      },
      {
        type: "p",
        text: "接下來會陸續整理從我深耕 B2B 銷售這個賽道對於每一個講者分享的摘要。",
      },
      { type: "p", text: "先從分享 16 位講者讓我印象最深刻的一句話開始這段學習旅程：" },
      {
        type: "quote",
        text: "與其讓別人顛覆我，不如我先顛覆我自己",
        source: "商業周刊城邦集團聯合創辦人何飛鵬先生",
      },
      {
        type: "quote",
        text: "前端處理非常重要，前面錯了後面就全都錯了。",
        source: "Kdan凱鈿創辦人蘇柏州Kenny",
      },
      {
        type: "quote",
        text: "贏不是賺錢，贏是產生價值。",
        source: "美國連續成功創業家、美國BonHope創投基金經營合夥人蕭一白Terry",
      },
      { type: "quote", text: "掛牌了之後才是考驗的開始。", source: "台灣證交所總經理李愛玲" },
      {
        type: "quote",
        text: "Take some risks, open to new ideas, talk to your customers… and keep going.",
        source: "高通業務開發總監暨亞太生態發展計劃負責人戴郁文播放 Qualcoom Founder",
      },
      {
        type: "quote",
        // 原文在「創造」後有一個句中換行，是貼文的折行不是分段，這裡接回同一句
        text: "需求優先於商模（Need-First Principle） ：在思考如何賺錢之前，先專注於創造不可或缺的價值。當你成為必需品時，商業模式會自然浮現！",
        source: "巨思集團/數位時代/創業小聚執行長陳素蘭",
      },
      {
        type: "quote",
        text: "我們是一粒種子，不是要長成一棵樹，是要長成一片森林。",
        source: "時代基金會Garage+執行長趙如媛",
      },
      {
        type: "quote",
        text: "當你作為創辦人跟這些投資方談的時候，想一想它（基金）成立的理由跟它的目的。",
        source: "新光三越創投董事長王楠淵William",
      },
      {
        type: "quote",
        text: "在你們決定創業的第一天，就先把要怎麼分手講清楚。",
        source: "基石創投總經理林子樸TP Lin",
      },
      {
        type: "quote",
        text: "永遠不要想說所有事情都要自己做，因為來不及了，真的來不及了。",
        source: "SIC永續影響力投資共同創辦人黃俊傑Amos",
      },
      {
        type: "quote",
        text: "你創辦的公司是不是還是你的？",
        source: "知名新創律師、CIEA跨境創新創業交流協會理事長簡榮宗",
      },
      { type: "quote", text: "最好的出海時機就是現在。", source: "LANDED赴美加速器負責人黃聖安Bryan" },
      {
        type: "quote",
        text: "Pivot 不可怕，關鍵是用最快的速度、足夠的決心，證明新的方向有價值。",
        source: "云思維商業模式產品化顧問史耀云Allen史大俠",
      },
      {
        type: "quote",
        text: "創業之後，才是挑戰你相信的開始。",
        source: "CYBERBIZ順立智慧創辦人兼執行長蘇基明",
      },
      {
        type: "quote",
        text: "Your Mindset Shows Your End Journey.（你的心態，決定了你創業旅程的終點。）",
        source: "Flowgreens創辦人、海外連續成功創業家許晴晏博士",
      },
      {
        type: "quote",
        text: "做對的一兩件事，然後把油門踩下去。",
        source: "Amazing Talker創辦人兼執行長趙捷平Abner",
      },
    ],
  },

  // ───────── 第二屆 2024 ─────────
  {
    slug: "anderson-yu-2024",
    // 貼文沒有標題，用中性描述，不替作者下標
    title: "第二屆台灣新創投資年會心得",
    author: "Anderson Yu",
    edition: 2,
    /* 貼文發布於 2024/10/16，內文寫「今天是投資人專場」；data/review.ts 記載第二屆只有 10/18 一天
       （業主 2026/9 更正）。兩邊各照來源，不互相對齊 —— 要統一請先向主辦方確認。 */
    date: "2024-10-16",
    sourceUrl: "https://www.facebook.com/share/p/1JLxGXxRto/",
    summary:
      "這陣子真的忙到連喘口氣的時間都沒有，但我還是排除萬難，專程來給自己充電，參加了第二屆台灣新創投資年會。今天是投資人專場，上午連續的講者分享，真的是乾貨滿滿，讓人聽得過癮。",
    cover: {
      src: "/notes/anderson-yu-2024/01.jpg",
      alt: "會場舞台與座位，投影幕上是「第二屆台灣新創投資年會 投資人專場」",
      width: 720,
      height: 540,
    },
    status: "published",
    blocks: [
      {
        type: "p",
        text: "這陣子真的忙到連喘口氣的時間都沒有，但我還是排除萬難，專程來給自己充電，參加了第二屆台灣新創投資年會。今天是投資人專場，上午連續的講者分享，真的是乾貨滿滿，讓人聽得過癮。",
      },
      {
        type: "p",
        text: "回想起我從2014年開始接觸投資事業，到現在竟然已經過了10年的時間。大部分投資標的的退場方式都是被併購或策略性整併。今天上午的分享中，最讓我觸動的一句話就是：「Go Big or Go Home？」沒想到現在我也親自跳下來打造EMJ.LIFE！除了幾位投資界大佬（Kay、Robin、William、Peter）的精闢見解外，還有KKDay創辦人以及RyBit創辦人的親身經驗分享。他們不約而同地提到了這幾年因COVID-19疫情對消費習慣造成的重大改變，讓人深有感觸（我也被消失了三年）。",
      },
      {
        type: "p",
        text: "在大佬們的分享中，我對全球投資趨勢和投資賽道的分配有了更深入的了解。這對於我們即將在新加坡發行具有CVC性質的傘型基金（EMJ.LIFE Global Participation Impact VCC FUND）具有極高的參考價值。想想為了趕來這裡，我從內湖出發，結果塞車多耽誤了20分鐘，還差點在車上睡著，但一切都是值得的！",
      },
      {
        type: "p",
        text: "說到這個場地，不禁讓我回想起2007年在台大EMBA修學分的時光。當時的學生證，可真是帥得讓人驕傲啊！今天，RyBit創辦人Mark分享了他從場外觀察到親自進場創建並執行商業模式的過程，讓我深刻體會到「知易行難」的真諦。這也讓我想起當年在北京麥肯錫工作的四年，那些被訓練得極具大局觀，並學會如何融合集體智慧與人情世故的日子，真是難得的經歷，可能在全球其他地方的麥肯錫都體會不到。",
      },
      {
        type: "p",
        text: "我被訓練的專業技能在於風險控管與創新商業模式，這兩個看似不相關的能力，卻在我投資的這10年中，在不同的階段發揮了巨大的作用。還沒回台灣前，我完全不知道台灣的投資環境竟然這麼「內捲」！幸好有Vincent打造了這個社團，聚集了許多厲害的國際投資人與投資團隊，讓我感受到不一樣的投資氛圍。為Vincent鼓掌！",
      },
      {
        type: "p",
        text: "現在是中午休息時間，期待下午的講者帶來更多精彩的分享！今天的充電日，真是既充實又滿足！Nice play！",
      },
    ],
  },

  // ───────── 第一屆 2023 ─────────
  {
    slug: "steve-lin-2023",
    // 貼文沒有標題，用中性描述，不替作者下標
    title: "第一屆台灣新創投資年會心得",
    author: "Steve Lin",
    edition: 1,
    date: "2023-11-11",
    sourceUrl: "https://www.facebook.com/share/p/1F8Nno7Fg3/",
    summary:
      "想不到一個多月前 Amos Huang Kevin Shih 與我在跟 林文欽 的閒聊中發想的一個想法，有著超強人脈資源與執行力的Vincent ，竟然在今天就讓第一屆 ＃台灣新創投資年會 投資人專場發生了",
    cover: {
      src: "/notes/steve-lin-2023/01.jpg",
      alt: "第一屆台灣新創投資年會投資人專場的全體與會者大合照",
      width: 590,
      height: 332,
    },
    status: "published",
    blocks: [
      {
        type: "p",
        text: "想不到一個多月前 Amos Huang Kevin Shih 與我在跟 林文欽 的閒聊中發想的一個想法，有著超強人脈資源與執行力的Vincent ，竟然在今天就讓第一屆 ＃台灣新創投資年會 投資人專場發生了，還邀集了台灣投入早期投資多年的大神前來分享，讓我在現場與七八十位來賓得以一窺這些成功的組織與個人背後的思維脈落：",
      },
      {
        type: "list",
        items: [
          "從開場 QIC Alex Lee 的分享中看到台灣新經濟公司在國際資本市場的價值位居高位，深信他所提出台灣新經濟公司在2031年前會至少有100家在全世界資本市場上市的預測會實現；",
          "在交大天使投資俱樂部陳俊秀身上看到他對鼓勵創業、創造就業的使命感與熱情，以及創辦人誠信的要求與堅持對早期投資的重要性；",
          "在心元資本 Tina Cheng 的分享中了解他們怎麼設定投資準則以及早期投資的正確觀念，造就心元在過去十年投出十個獨角獸如此了不起的成就；",
          "在 Hive Venture 李彥樞 Yan 的分享中，我看到了專注投資的紀律、佈局、以及作法，在每個領域只挑選一家all in 的支持，三年下來0 failure對早期投資來說更是個了不起的成就；",
          "作為一個資深策略家與菜鳥專業投資人，我也代表 SIC 永續影響力天使投資 分享我們的理念與運作模式、＃影響力投資 的趨勢與未來、以及我們第一年的成績與學習，希望能讓更多人願意投入，幫助更多團隊做好事也能賺錢！",
          "最後在 AVA Chun-Chieh Fang JJ的分享中提到天使俱樂部運作的困難特別心有戚戚焉，而他們幾年下來在天使投資與天使基金雙模式下走出了一條自己的路，覺得厲害。",
        ],
      },
      {
        type: "p",
        text: "各家對於投資領域與投資哲學也許各有偏好，對於投後管理的哲學也不盡相同，但可以歸納出許多早期投資的共通點：需要（許多）耐心與信心，要在吵雜的市場訊號中不FOMO但懂得借東風（聽起來矛盾嗎？），還要會識人。",
      },
      {
        type: "p",
        text: "最後也是最重要的是，有心投入早期投資的人可以有這個機會交流與學習，一起努力讓台灣的新創環境從荒漠變雨林！再一次感謝Vincent 與籌備團隊～ 期望明年再聚！",
      },
      // 原貼文共 13 張照片，公開頁面只取得到前 5 張
      {
        type: "image",
        src: "/notes/steve-lin-2023/02.jpg",
        alt: "會場入口的活動立牌，印有「台灣新創投資年會 投資人專場」與當日議程表",
        width: 443,
        height: 590,
      },
      {
        type: "image",
        src: "/notes/steve-lin-2023/03.jpg",
        alt: "兩位與會者在 SIC 永續影響力加速器的立牌旁合影",
        width: 442,
        height: 590,
      },
      {
        type: "image",
        src: "/notes/steve-lin-2023/04.jpg",
        alt: "多位與會者在 SIC 永續影響力加速器的立牌旁合影",
        width: 590,
        height: 442,
      },
      {
        type: "image",
        src: "/notes/steve-lin-2023/05.jpg",
        alt: "三位與會者在會場座位區的自拍合照",
        width: 590,
        height: 442,
      },
    ],
  },
];

/* 對外名單：只收 published，新到舊。過濾放資料層的理由同 speakers.ts ——
   下游有列表、內頁、sitemap、llms.txt、JSON-LD，漏一處就露出孤兒頁。 */
export const notes: Note[] = allNotes
  .filter((n) => n.status === "published")
  .sort((a, b) => b.date.localeCompare(a.date));

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

/** "2026-10-01" 轉成畫面用的 "2026.10.01" */
export function formatNoteDate(date: string): string {
  return date.replace(/-/g, ".");
}

/** 3 轉成「第三屆」 */
export function noteEditionLabel(edition: Note["edition"]): string {
  return `第${["一", "二", "三"][edition - 1]}屆`;
}
