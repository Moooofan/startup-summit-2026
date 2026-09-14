/**
 * 講者資料。
 *
 * 事實來源：《第四屆新創投資年會講者名單與議程0817.pptx》（業主 2026/9 提供）投影片 2–14，
 * 更早的版本來自《第四屆新創投資年會企劃 新增贊助方案.pptx》。
 * bio 逐字取自簡報，未經改寫；照片為簡報內嵌原圖（解析度偏低，建議向主辦方索取高解析檔）。
 *
 * 陣列順序刻意對齊 data/agenda.ts 的議程順序（同一場次的講者相鄰）——
 * /speakers 的網格是按陣列順序鋪的，順序打亂同場次的人就會被拆散。
 *
 * 議程表上有六位不在這裡：田建中（證交所）、金東昊（Korea Credit Data）、陳怡蓉（識富天使會）、
 * 韓宗憲（ITIC 創投），與兩位分段主持人劉宥彤、張提提 —— 他們只出現在議程表上，
 * 沒有介紹與照片，向主辦方索取後才上站。
 *
 * 反過來，朱宜振（IrisGo.AI）留在這裡但 0902 議程總表上沒有他的場次 ——
 * 講者內頁的場次膠囊會自動不渲染（findSpeakerSlot 回 undefined），是否仍出席待業主確認。
 */
import type { ForumKey } from "./event";

export type SpeakerStatus = "confirmed" | "pending";

export interface Speaker {
  slug: string;
  name: string;
  nameEn?: string;
  title: string;
  org: string;
  day: ForumKey;
  /** 原本指向 data/tracks.ts 的主題軌 key。主題軌已於 2026/9 全站移除
   *  （業主指示議程一律用表格，見 data/agenda.ts），這欄現在是沒有對應資料的歷史字串，
   *  畫面不讀它。值沿用 agenda.ts 的場次分組，只當分類備註用。 */
  track: string;
  role?: string;
  status: SpeakerStatus;
  photo: string;
  bio: string;
}

/* 完整名單（含尚未確認出席者）。**站上不直接用這一份** —— 對外一律走下方的 `speakers`。
   保留未確認者在這裡而不是刪掉，是為了確認後只要把 status 改成 "confirmed" 就會自動上架。 */
const allSpeakers: Speaker[] = [
  // ───────── 10/14 創辦人論壇 ─────────
  // 《焦點創業家分享》
  {
    slug: "ryan-lee",
    name: "李昇圭",
    nameEn: "Ryan Seungkyu Lee",
    title: "聯合創辦人暨執行副總裁（EVP）",
    org: "Pinkfong",
    day: "founder",
    track: "founder-keynote",
    status: "confirmed",
    photo: "/speakers/ryan-lee.png",
    bio: "Pinkfong Company 於 2010 年 6 月創立（當時名為 SmartStudy），由 3 位擁有線上遊戲產業背景的夥伴共同創立。李昇圭（Ryan Seungkyu Lee）為聯合創辦人暨執行副總裁（EVP），從創立初期便負責全球業務拓展（BD）、海外授權與國際戰略。李昇圭是 2010 年公司成立時就參與奠基的關鍵合夥人，並且是全球化拓展的推手：由於他具備流利的英語能力與國際商務拓展經驗，在《Baby Shark》走紅全球的過程中，他是代表 Pinkfong 走向歐美與東南亞市場、洽談 Netflix/Nickelodeon 等跨國授權與合作的第一線掌舵者。",
  },
  {
    slug: "kelvin-kim",
    name: "金東昊",
    nameEn: "Kelvin Dongho Kim",
    title: "創辦人兼執行長",
    org: "Korea Credit Data（KCD）",
    day: "founder",
    track: "founder-keynote",
    status: "confirmed",
    photo: "/speakers/kelvin-kim.png",
    bio: "韓國知名連續創業家，畢業於韓國科學英才學校，後就讀延世大學產業工程系。二○一一年在學期間共同創辦行動市調平台OpenSurvey，擔任執行長並成功退場。二○一六年，他創辦Korea Credit Data（KCD），推出小商家經營管理平台Cashnote，進一步布局支付、POS、信用評估及金融服務，服務範圍涵蓋韓國近兩百萬家信用卡商戶。KCD創立六年便成長為估值十億美元的獨角獸，並獲摩根士丹利、淡馬錫等國際機構投資。Kim亦曾入選富比士亞洲三十歲以下菁英，並獲選世界經濟論壇全球青年領袖，展現以數據科技賦能中小企業的卓越成就。",
  },
  {
    slug: "shen-shu-wei",
    name: "沈書緯",
    title: "創辦人兼執行長",
    org: "犀動智能（Aiello）",
    day: "founder",
    track: "founder-keynote",
    status: "confirmed",
    photo: "/speakers/shen-shu-wei.jpg",
    bio: "他曾任職於高通，並在 Google 領導 Google Assistant 台北團隊達 6 年，負責智慧音箱等多項專案。2019 年他放棄千萬年薪創業，鎖定勞力密集的旅宿業，開發專利自然語言理解 (NLU) 技術，打造全台市占第一的客房 AI 語音管家「小美犀」。他成功將非結構性的對話轉為飯店後台管理數據，解決缺工痛點。在基石創投、緯創等支持下，產品已攻入全球逾兩萬間客房。",
  },

  // 《焦點創業生態機構分享》
  {
    slug: "kj-wu",
    name: "吳貴融",
    nameEn: "KJ Wu",
    title: "大中華區新創技術副總",
    org: "Google Cloud",
    day: "founder",
    track: "ecosystem",
    status: "confirmed",
    photo: "/speakers/kj-wu.png",
    bio: "KJ 是負責 Google Cloud 團隊的技術解決方案主管，所帶領的 Google Cloud 技術團隊主要協助不同規模的企業擬定雲端策略與採行雲端解決方案。加入 Google 以前，KJ 帶領新創團隊開發 FinTech 產品，並歷任大型顧問與雲端跨國企業，擔任各種技術與管理職位，包括安全性研發、軟體工程、雲端架構、企業策略規劃等管理職務。",
  },
  {
    slug: "lin-zhi-yao",
    name: "林志垚",
    title: "董事長",
    org: "AAMA 創業者共創平台基金會",
    day: "founder",
    track: "ecosystem",
    status: "confirmed",
    photo: "/speakers/lin-zhi-yao.jpg",
    bio: "AAMA創業者共創平台基金會是台灣最具影響力的新創社群之一，以「台北搖籃計畫」培育超過300位跨世代創業家。新任董事長林志垚具備30年管理顧問與投資實戰經驗，曾任AAMA學院院長，未來將帶領團隊以「再創新」的精神協助新創應對AI、國際化與組織治理的全新挑戰。",
  },
  {
    slug: "cheng-jiu-ru",
    name: "程九如",
    title: "合夥人",
    org: "AppWorks 之初創投",
    day: "founder",
    track: "ecosystem",
    status: "confirmed",
    photo: "/speakers/cheng-jiu-ru.jpg",
    bio: "他曾是台灣網際網路創業的先驅者與資深導師。於 1999 年創辦 Webs-TV.com，在當年網路泡沫化浪潮中成為少數成功獲利的新創，隨後曾出任天空傳媒 (yam) 策略長暨營運長、TiEA 台灣網路暨電子商務發展協會秘書長等要職。加入 AppWorks 後，他憑藉逾二十年的創業與實戰經驗，專注於挖掘具備長遠「網路思維」的潛力人才。他長期陪伴並輔導新創團隊從零到一突破瓶頸，在推動台灣產業數位轉型與新創生態圈鏈結上，扮演著關鍵的推手角色。",
  },

  // 《新IPO創業家Panel對談》
  // 《走向資本市場》
  {
    slug: "tian-jian-zhong",
    name: "田建中",
    title: "上市二部經理",
    org: "台灣證券交易所",
    day: "founder",
    track: "new-ipo",
    status: "confirmed",
    photo: "/speakers/tian-jian-zhong.jpg",
    bio: "畢業於台灣大學會計學系，並取得政治大學會計研究所碩士，具備會計師、內部稽核師、證券分析師與美國 CFA 等專業資格。任職台灣證券交易所近 20 年，2023 年臺灣碳權交易所成立時借調出任首任總經理，兩年間推動國內外碳權上架、協助企業以合理成本取得碳權並避免碳權淪為炒作商品，是台灣碳交易制度的第一線推手。2025 年 9 月借調期滿歸建證交所，升任上市二部經理，兼具資本市場與永續議題的實務經驗。",
  },
  {
    slug: "shen-li-ping",
    name: "沈立平",
    title: "副總經理",
    org: "益鼎創投",
    day: "founder",
    track: "new-ipo",
    role: "moderator",
    status: "confirmed",
    photo: "/speakers/shen-li-ping.png",
    bio: "在台灣新創與資本市場擁有豐富的第一線輔導與投資經驗。他長期關注新經濟、大健康、智慧製造及數位轉型等領域。他曾精準挖掘並投資 91APP、大樹醫藥、振宇五金及 Firstory 等眾多上市櫃與知名新創，更代表創投擔任多家企業的法人董事。沈立平經常受邀於媒體發表專欄，以其精準的創投思維，積極協助台灣新創團隊對接資本市場，是新創圈極具影響力的導師。",
  },
  {
    slug: "wu-you-xun",
    name: "吳侑勳",
    title: "創辦人兼董事長",
    org: "東聯互動（7738）",
    day: "founder",
    track: "new-ipo",
    status: "confirmed",
    photo: "/speakers/wu-you-xun.jpg",
    bio: "東聯互動（7738）創辦人兼董事長吳侑勳深耕電信與軟體數據服務逾20年。他曾任電信產業主管，因長期觀察到移工跨國小額匯兌的痛點，於2016年捨棄高薪創業。他帶領團隊突破嚴格金融監理，打造合法便利的跨境金融平台，並兼任一卡通公司董事，成功帶領公司成為台灣跨境金融與移工匯兌領頭羊。",
  },
  {
    slug: "wu-ming-wei",
    name: "吳明蔚",
    title: "創辦人暨執行長",
    org: "奧義智慧（7823）",
    day: "founder",
    track: "new-ipo",
    status: "confirmed",
    photo: "/speakers/wu-ming-wei.png",
    bio: "台灣大學電機博士畢業。他是台灣資安與 AI 領域的傳奇連續創業家，曾與團隊兩度成功創業並獲跨國大廠併購。\n\n他具備深厚的 AI 演算法與大型資安架構專長，致力於將防禦技術全面自動化。他帶領奧義智慧研發主權 AI 技術、跨足國防韧性與無人機反制，客戶涵蓋八成台灣本國銀行及台積電等科技巨頭，並於 2026 年推動公司成功掛牌上市。",
  },
  {
    slug: "li-lun-jia",
    name: "李倫家",
    title: "創辦人兼董事長",
    org: "PRO360 達人網（7839）",
    day: "founder",
    track: "new-ipo",
    status: "confirmed",
    photo: "/speakers/li-lun-jia.jpg",
    bio: "畢業於美國西點軍校經濟系與系統工程系。他是一位擁有8次創業經驗的連續創業家，早期在美國創辦的多家晶片與硬體公司皆成功出售給NASDAQ上市公司及Motorola等國際大廠。回台後，他敏銳捕捉到生活服務數位化的龐大商機，打造出全台最大的專業服務媒合平台。憑藉高度的軍事紀律與創新AI數據媒合模式，他成功帶領公司維持高達9成的驚人毛利率，並於2026年6月15日正式掛牌上櫃（股票代號：7839），成功將平台推向台灣資本市場並加速拓展東南亞版圖。",
  },

  // 《併購與擴張》
  {
    slug: "huang-huai-en",
    name: "黃懷恩",
    title: "執行長兼總經理",
    org: "欣新網（2949）",
    day: "founder",
    track: "ma-global",
    status: "confirmed",
    photo: "/speakers/huang-huai-en.png",
    bio: "黃懷恩是電商代營運龍頭欣新網執行長兼總經理。他曾將連年虧損、員工流失過半的企業，在接任後推動轉型，運用大數據與AI技術，提供品牌從行銷、系統、客服到倉儲物流的一條龍客製化減法服務。他成功帶領欣新網逆勢突圍並掛牌上市，成為收服超過兩百家國際知名品牌的幕後推手。",
  },
  {
    slug: "xu-yu-ting",
    name: "許郁婷",
    title: "共同創辦人暨執行長",
    org: "股感媒體集團",
    day: "founder",
    track: "ma-global",
    status: "confirmed",
    photo: "/speakers/xu-yu-ting.jpg",
    bio: "帶領股感從股票知識平台出發，拓展出房感、安錢感等多元品牌，並服務全台逾七成金融機構。深耕 FinTech 與數據策略，秉持「場景驅動、數據落地」理念，進而打造生態商務賦能平台；透過第一方數據與跨場景連結，精準串接多元產業，促成品牌間商業資源的高效流動，建構永續發展的新經濟生態系。",
  },
  {
    slug: "song-jie-ren",
    name: "宋捷仁",
    title: "創辦人兼執行長",
    org: "USPACE 悠勢科技",
    day: "founder",
    track: "ma-global",
    status: "confirmed",
    photo: "/speakers/song-jie-ren.png",
    bio: "宋捷仁是跨國共享車位平台USPACE執行長。2016 年因車輛遭拖吊創立悠勢科技，透過 IoT 地鎖活化閒置車位。他近年推動國際化，2024 年全資併購日本共享停車新創「軒先」，成功輸出 AI 車牌辨識並帶領營收翻倍，將公司打造為涵蓋台、日、東南亞的跨國出行生態圈。",
  },

  // 《Edge AI 趨勢對談》
  {
    slug: "yang-ben-yu",
    name: "楊本豫",
    // 0817 簡報自己不一致：講者介紹頁寫「策略長室顧問」、議程表寫「董事長室顧問」，
    // 依業主指示以議程表為準。
    title: "董事長室顧問",
    org: "友達光電集團",
    day: "founder",
    track: "edge-ai",
    role: "moderator",
    status: "confirmed",
    photo: "/speakers/yang-ben-yu.png",
    bio: "曾任友達光電策略長，負責公司之價值轉型、策略投資與跨國併購佈局，並兼任友達集團智慧零售事業群總經理與友達數位科技董事長，綜理智慧零售與智慧製造服務事業之內部新創營運，帶領團隊從0到1開發解決方案與推展場域商機。2002 年加入友達光電，曾先後擔任友達大陸廠區財務長、友達光電財務總處協理等要職。2009 年接任友達光電財務長，2015 年轉任策略長。楊本豫擁有國立台灣大學財務金融系學士學位及美國喬治華盛頓大學企管碩士學位。",
  },
  {
    slug: "qiu-li-quan",
    name: "丘立全",
    title: "共同創辦人兼執行長",
    org: "啟雲科技",
    day: "founder",
    track: "edge-ai",
    status: "confirmed",
    photo: "/speakers/qiu-li-quan.jpg",
    bio: "啟雲科技執行長丘立全，畢業於臺大國企所。曾任趨勢科技台灣區及亞太區總經理、訊連科技副總經理，在軟體科技界擁有深厚資歷。他於2014年創辦啟雲科技，帶領公司成為Facebook平台上全球頂尖的技術提供者，並且是第一個在Facebook全球年會上台分享的台灣人。啟雲專精於AI影像辨識與程式化3D內容技術，不僅開發出AR智慧拍照機器人（PICBOT），更將AIoT與社群行銷結合，致力將台灣的AI創新科技推向全球市場。",
  },
  {
    slug: "zou-da-zhi",
    name: "鄒大智",
    title: "財務長",
    org: "凌華科技（ADLINK）",
    day: "founder",
    track: "edge-ai",
    status: "confirmed",
    photo: "/speakers/zou-da-zhi.jpg",
    bio: "現任凌華科技全球財務長暨凌華智能(中國)投資長，完成四家歐美公司100%股權併購，引進策略投資人Keysight及友達光電推動策略轉型，並與頂尖企業及國際投資機構於台灣，英國、大陸完成三項股權JV。憑藉策略分析與營運經驗，對投後管理具獨到洞見。凌華科技身為AI邊緣運算領導者，以軟硬整合系統，為智慧工控、醫療、機器人等領域提供技術方案，並與產業生態系合作，共同建立競爭優勢。鄒大智畢業於國立台灣大學理學院，並取得商學院EMBA及紐約州立大學碩士學位。",
  },
  {
    slug: "zhao-xin-min",
    name: "趙新民",
    title: "智慧製造服務處資深總監",
    org: "宇沛永續",
    day: "founder",
    track: "edge-ai",
    status: "confirmed",
    photo: "/speakers/zhao-xin-min.png",
    bio: "元智大學工業工程與管理博士，專精於綠色技術與數位科技整合，致力推動企業永續與數位雙軸轉型。宇沛永續為友達集團旗下子公司，專注於碳管理、水資源循環及智慧製造服務。趙新民帶領團隊將AI導入製造場域，發展AI瑕疵分類、PHM預測性維護及生成式AI應用等解決方案，協助企業提升品質、效率與設備可靠度，打造兼具營運效益與永續價值的智慧工廠",
  },

  // 《AI 軟體創業家分享》
  {
    slug: "adams-chung",
    name: "鍾哲民",
    nameEn: "Adams Chung",
    title: "創辦人兼執行長",
    org: "MoBagel 行動貝果",
    day: "founder",
    track: "ai-software",
    status: "confirmed",
    photo: "/speakers/adams-chung.jpg",
    bio: "Mobagel（美商行動貝果）是一家專精於 AI 數據分析的軟體公司，提供企業級 AI 代理與邊緣運算方案。創辦人兼執行長鍾哲民具備 MIT 統計背景，他帶領團隊從 SaaS 轉型軟硬整合，致力幫助全球企業將 AI 實際落地以創造商業成效。",
  },
  {
    slug: "xue-jin",
    name: "薛覲",
    title: "共同創辦人暨執行長",
    org: "漸強實驗室",
    day: "founder",
    track: "ai-software",
    status: "confirmed",
    photo: "/speakers/xue-jin.png",
    bio: "薛覲畢業於清華大學，曾於紐約與上海工作。2017年創立漸強實驗室並任執行長，帶領團隊從LINE生態切入，打造MAAC一站式AI自動化行銷平台，成為金級技術夥伴。近年他主導海外擴張，成功將SaaS服務打入日本、泰國與新加坡市場，致力用AI重塑亞洲企業的商業溝通。",
  },
  {
    slug: "zhu-yi-zhen",
    name: "朱宜振",
    title: "共同創辦人暨營運長",
    org: "IrisGo.AI",
    day: "founder",
    track: "ai-software",
    status: "confirmed",
    photo: "/speakers/zhu-yi-zhen.jpg",
    bio: "畢業於成功大學化學系，求學時曾創立「夢之大地BBS」。他擁有超過20年軟硬體整合與互聯網經驗，曾任職於凌華（ADLINK）、Kontron 等工業電腦大廠，隨後成為連續創業家，曾創辦南星加速器與區塊鏈新創 BiiLabs。如今他帶領 IrisGo.AI 切入 AI PC 賽道，打造本地端 AI 總管，更成功獲得矽谷 AI 大神吳恩達（Andrew Ng）旗下 AI Fund 的投資。",
  },
  {
    slug: "li-xin-yi",
    name: "李信宜",
    title: "總經理兼 Vurbo.ai 共同創辦人",
    org: "愛比科技（6858）",
    day: "founder",
    track: "ai-software",
    status: "confirmed",
    photo: "/speakers/li-xin-yi.jpg",
    bio: "畢業於台大機械系與台大商學研究所碩士(就讀台大EMBA)。他曾任職技嘉亞洲業務主管、華碩AICS協理與威聯通AIoT 副總，另有三家創辦(或共同創辦)新創經驗，具備深厚的科技硬體與軟體(雲端及SaaS) 及高階經理人背景。近年他帶領愛比科技推動轉型，推出自主研發的Vurbo.ai語意 AI 翻譯平台，支援百種語言即時語意即時翻譯及口譯、回溯語境與會議摘要，成功攻入半導體、金融、醫療、大學龍頭企業及跨國大型展會市場。因客製專屬特殊語音模型，獲台積電、玉山、佛光山等代表企業採用，目前已超過230+家企業訂閱。",
  },

  // 《年度新基金》
  {
    slug: "sophia-cheng",
    name: "程淑芬",
    nameEn: "Sophia Cheng",
    title: "合夥人（前國泰金控投資長）",
    org: "宏齊永續與氣候基金",
    day: "founder",
    track: "new-fund",
    status: "confirmed",
    photo: "/speakers/sophia-cheng.png",
    bio: "Sophia畢業於臺灣大學，取得美國金門大學財務銀行碩士。曾任美林環球投顧董事長、日盛金控高階主管，2012年出任國泰金控投資長，掌理集團投資策略並推動ESG責任投資。現任國泰金控資深顧問、宏齊顧問資深合夥人，參與「宏齊永續與氣候基金」，聚焦AI、綠能、循環經濟及氣候解決方案投資。",
  },
  {
    slug: "jiang-minjun",
    name: "江旻峻",
    title: "總經理",
    org: "台大校友創投 NTU.VC",
    day: "founder",
    track: "new-fund",
    status: "confirmed",
    photo: "/speakers/jiang-minjun.jpg",
    bio: "現任台大校友創投（NTU.VC）總經理、富旌創投（Addin Ventures）創始合夥人及飛拓投創執行合夥人。他畢業於台大商學研究所，擁有近十年豐富的風險投資與新創輔導經驗，曾任基石創投投資副總，並長期撰寫「布蘭登觀點」分享創投洞見。他專注於 AI、SaaS、垂直領域軟體及數據驅動的早期新創，擅長為團隊拆解商業模式與架構台美跨境的募資策略。身為台大校友創投總經理，他以社群為核心，積極推動「在地化」投資與校友資源鏈結，協助台灣新創打入國際市場。",
  },

  // ───────── 10/15 投資人論壇 ─────────
  // 《焦點創投 / CVC 分享》
  {
    slug: "eric-wu",
    name: "吳思本",
    nameEn: "Eric Wu",
    title: "企業投資辦公室副總經理",
    org: "緯創資通",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/eric-wu.jpg",
    bio: "吳思本（Eric Wu）現任緯創資通企業投資辦公室副總經理。他在緯創任職超過30年，曾任董事長特助與子公司總經理。2021年主導成立投資辦公室並啟動緯創加速器，積極帶領團隊參與早期新創的企業風險投資（CVC），深耕軟硬整合與前瞻技術布局。",
  },
  {
    slug: "peng-zhiqiang",
    name: "彭志強",
    title: "總經理",
    org: "宏誠創投 UMC Capital",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/peng-zhiqiang.jpg",
    bio: "彭志強現任聯電旗下宏誠創投（UMC Capital）總經理，管理聯電創投資產。他畢業於中央化工系，並取得美國匹茲堡大學工業工程碩士與交大科技管理博士。他曾任兆遠科技總經理，具備成功帶領公司 IPO 的高科技實務資歷。彭志強深耕創投多年，專注投資半導體、資通訊與高科技領域，他憑藉深厚的半導體供應鏈與 B2B 商模經驗，積極引導新創團隊對接產業資源。",
  },
  {
    slug: "li-yiping",
    name: "李一平",
    title: "科技基金執行合夥人",
    org: "台杉投資 Taiwania Capital",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/li-yiping.png",
    bio: "畢業於台大國際企業學系，並取得美國羅格斯大學企業管理碩士（MBA）。他深耕創投領域多年，曾任 H&Q Asia Pacific（漢鼎亞太集團）董事總經理及漢鼎臺灣總經理，擁有豐富的全球投資與項目管理經驗。2020 年加入台杉投資後，他專注於科技與 Deep Tech 基金，迄今已投資超過 20 家新創企業。他不僅專精於協助台灣軟硬體新創架構海外商模、對接國際資源，近期亦積極倡導運用 AI 加速倉儲與自動化落地，是引領台灣新創打入全球「非紅供應鏈」的重要創投專家。",
  },
  {
    slug: "sean-peng",
    name: "彭適辰",
    nameEn: "Sean Peng",
    title: "資深合夥人",
    org: "美商中經合集團",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/sean-peng.jpg",
    bio: "美商中經合集團於1993年由劉宇環先生創立，是全球知名的跨境早期風險投資公司，專注於挖掘高科技與醫療健康領域的明星新創。其資深合夥人彭適辰先生（Sean Peng）在半導體與高科技創投領域深耕超過30年，憑藉深厚的產業洞察力，成功協助無數美國、中國大陸及台灣的早期企業規模化成長，在亞太創投圈享有盛譽。",
  },
  {
    slug: "huang-junliang",
    name: "黃峻樑",
    title: "創辦人暨管理合夥人",
    org: "峻盛資本",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/huang-junliang.jpg",
    bio: "曾先後擔任美商惠普科技(Hewlett Packard)電子儀器事業群總經理、美商安捷倫科技(Agilent)全球半導體顧客業務及服務事業群副總裁、國巨股份有限公司執行長、蔚華科技董事長兼執行長，以及Cooler Master 訊凱國際副董事長兼執行長、卓毅資本執行長及合夥人等重要職務。曾為全球第一大量測儀器安捷倫科技最年輕的全球副總裁，負責全球半導體代工生產測試業務，並榮獲「惠普科技全球總裁品質獎」的肯定，更領導國巨股份有限公司轉虧為盈，成為台灣獲利最佳的上市公司及全球主要被動元件供應商，為一位精實管理專家。",
  },
  {
    slug: "allen-kao",
    name: "高誌廷",
    nameEn: "Allen Kao",
    title: "總經理",
    org: "普訊創新 WK Innovation",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/allen-kao.png",
    bio: "普訊創新（WK Innovation）的總經理兼合夥人高誌廷（Allen Kao）。他是一位從頂尖研發工程師成功轉型為科技創投家（VC）的代表人物，在產業界與創投界皆擁有極深厚的資歷。專長微機電與光學設計，曾任職 SEIKO EPSON 並累積 18 篇專利。自 2010 年投身創投界，信奉價值投資與長期主義，曾主導 Credo、矽力杰、AES 等知名科技案，現兼任多個政府前瞻計畫委員。",
  },
  {
    slug: "poseidon-ho",
    name: "Poseidon Ho",
    nameEn: "Poseidon Ho",
    title: "創始合夥人暨 CEO",
    org: "Outliers Fund",
    day: "investor",
    track: "institutional",
    status: "confirmed",
    photo: "/speakers/poseidon-ho.jpg",
    bio: "Poseidon 畢業於台大資管系，曾於 MIT 媒體實驗室、微軟研究院等學術機構從事集體智慧與實境運算等研究，擁有 15 項國際設計及編程競賽獎項，也是全世界最高級別的德州撲克錦標賽選手。 2016 年他創辦 Outliers Fund，第一二期基金皆創下超過十倍 DPI 的驚人回報，過去兩年他以青年創投家身份受邀至海湖莊園、美國總統就職典禮演講，並參與籌備川普任內有關 AI、Crypto、Space 等行政命令。 今年他啟動兩支全新的創投基金：「Outliers太空基金」專注於投資美國的太空與國防軍事科技；「Outliers智能基金」專注於拓展人類智能的 AI、機器人、腦機接口、量子計算等等。Poseidon 是在美國硬科技投資方面具指標性的新生代創投家。",
  },

  // 《生醫投資趨勢》
  {
    slug: "minami-maeda",
    name: "前田陽",
    nameEn: "Minami Maeda",
    title: "執行長",
    org: "樂天醫藥 Rakuten Medical",
    day: "investor",
    track: "biotech-investment",
    status: "confirmed",
    photo: "/speakers/minami-maeda.jpg",
    // 業主 2026/9/8 更正：姓名由「前田南」改為「前田陽」，職稱由「總裁暨副會長」改為「執行長」，
    // bio 全文換新（原文的 ‘‘…’’ 正規化為全站慣用的「…」，內容一字未改）。
    bio: "作為樂天醫藥執行長，前田陽秉持著公司「戰勝癌症」的使命，以及他個人「讓社會變得更好」的志願，致力於研發並商業化一項全新的癌症治療方式：光免疫治療。希望透過這項藥物與醫療器材的組合療法，能讓癌症病人在達到根治腫瘤的前提下，同時維持良好的生活品質。",
  },
  {
    slug: "lin-shiyong",
    name: "林世永",
    title: "生技基金主管",
    org: "台杉投資",
    day: "investor",
    track: "biotech-investment",
    status: "pending",
    photo: "/speakers/lin-shiyong.jpg",
    bio: "林世永是兼具臨床醫學與醫學工程雙博士學位的跨領域專家，並持有物理治療師與醫學工程師國家執照。他在生醫科技研發、創投盡職調查（DD）及新創輔導領域深耕近二十年，多次獲選為斐陶斐榮譽會員。林世永擅長評估醫療器材與生技新創的商業模式、臨床痛點與合理估值，並常受邀於台大創創中心等機構講授創投實務與投資框架，積極培育生醫新創生態圈。",
  },
  {
    // TODO: 0817 講者介紹頁標「已確認」，但四張議程表沒有排到他的時段 —— 落差待業主確認
    slug: "lin-chuanen",
    name: "林傳恩",
    title: "總經理暨共同創辦人",
    org: "杉盛資本",
    day: "investor",
    track: "biotech-investment",
    status: "confirmed",
    photo: "/speakers/lin-chuanen.jpg",
    bio: "林傳恩專注於醫療科技新創投資評估與投後管理。他同時擔任恩益資產管理董事長，負責家族辦公室全球多元資產配置，並兼任台灣大學SPARK新藥審查委員。他畢業於台灣大學生命科學系學士和碩士，並取得美國加州柏克萊大學Haas商學院創投高階經理人認證，同時具備CFP國際認證高級理財規劃顧問證照。曾任德商台灣百多力（BIOTRONIK）心臟節律管理事業群副總監，擁有逾10年醫材經驗及全球IBHRE心律不整治療醫材認證，深具生醫與金融跨域之專業背景。",
  },

  // 《變革中的早期投資機構》
  {
    slug: "fang-junjie",
    name: "方俊傑",
    title: "創辦人暨執行長",
    org: "AVA Angels",
    day: "investor",
    track: "early-stage",
    status: "confirmed",
    photo: "/speakers/fang-junjie.png",
    bio: "畢業於台大化工系及應力所。他曾任職於益鼎創投，累積逾 2,000 萬美元投資經驗，並曾赴矽谷 Venture University 取經。早年歷練於廣達電腦及醫材新創，具備豐富產業背景。2020 年創立 AVA，引進天使俱樂部模式，專注扶植台灣早期新創。",
  },
  {
    slug: "jian-dan",
    name: "簡丹",
    title: "董事長暨合夥人",
    org: "台安傑天使俱樂部（Taipei Angels）",
    day: "investor",
    track: "early-stage",
    status: "confirmed",
    photo: "/speakers/jian-dan.jpg",
    bio: "她擁有深厚的科技產業背景，在國際級 IT 企業累積逾二十年的高階管理與銷售實戰歷練。過去曾歷任 Check Point 台灣區總經理、Autodesk 台灣區總經理，以及台灣微軟 (Microsoft) 業務經理等要職。加入台安傑後，她憑藉敏銳的市场洞察與跨國企業治理經驗，積極協助具潛力的早期新創團隊健全商務模式、媒合關鍵資源，是推動台灣早期天使投資與新創生態圈國際化發展的重要女性領導者。",
  },
  {
    slug: "chen-yi-rong",
    name: "陳怡蓉",
    nameEn: "Kate",
    title: "執行長暨聯合創始人",
    org: "識富天使會",
    day: "investor",
    track: "early-stage",
    status: "confirmed",
    photo: "/speakers/chen-yi-rong.jpg",
    bio: "自 2015 年起經營新創社群 WorkFace Taipei 並擔任召集人，因觀察到台灣早期資金的缺口，於 2017 年共同創辦識富天使會，匯聚創業家、企業二代與高階經理人成為天使投資人。識富天使會目前會員超過 500 位、共同投資逾 50 家新創團隊，據點涵蓋台北、台中、台南、高雄、新加坡、東京與北京，並積極連結政府、企業、創投以及東南亞、日本與北美的投資資源，是台灣最大的國際化天使投資社群。",
  },
  {
    slug: "lin-bo-han",
    name: "林伯翰",
    nameEn: "Boice Lin",
    title: "創辦人",
    org: "一春資本",
    day: "investor",
    track: "early-stage",
    status: "confirmed",
    photo: "/speakers/lin-bo-han.jpg",
    bio: "林伯翰（Boice Lin）為台灣少數兼具「跨國外商高管」與「三家知名新創出場/上市」實戰經驗的指標性操盤手。職涯由 IBM 起步，曾任電通 Merkle 台灣總經理，並先後擔任 TutorABC 營銷副總、Appier 全球資深副總及 Gogolook 商務長，具備極深厚的 B2B 與 B2C 跨界實績。憑藉清大天使會前會長的早期生態號召力，以及透過《商業周刊》專欄與「商業操盤學院」社群持續輸出的系統化戰略方法論，他發起成立台灣首支 Operator-Led（操盤手型）創投基金，並建立Revenue Intelligence Architecture 增長架構。相較於傳統財務型創投，他聚焦早期增長與數位轉型，以「親身戰略賦能 + 資金挹注」雙輪驅動，協助新創團隊突破商業瓶頸、實現規模化出海。",
  },

  // 《半導體硬科技投資趨勢 Panel》
  {
    slug: "qu-zhi-hao",
    name: "瞿志豪",
    title: "台灣區合夥人（前 ITIC 創新工業技術移轉總經理）",
    org: "橡子園創投（Acorn Campus）",
    day: "investor",
    track: "deep-tech",
    status: "confirmed",
    photo: "/speakers/qu-zhi-hao.png",
    bio: "瞿志豪現任 ITIC 創新工業技術移轉總經理、TBMC 臺灣生物醫藥製造董事兼財務長，以及 Reizawa Capital 合夥人。他畢業於台大電機系與研究所，並擁有台大 EMBA 碩士學位。\n\n他是台灣著名的連續創業家與資深創投，1997 年共同創辦和信超媒體GigaMedia並出任執行副總兼技術長，成功帶領公司於美國 NASDAQ 上市。隨後他轉任創投，曾任橡子園創投Acorn Campus合夥人與生醫產業創新推動方案執行中心創新長。現亦於台大兼任教授，憑藉跨越科技、網路與生醫領域的深厚資歷，積極培育新創人才。",
  },
  {
    slug: "han-zong-xian",
    name: "韓宗憲",
    title: "副總經理",
    org: "ITIC 創新工業技術移轉公司",
    day: "investor",
    track: "deep-tech",
    status: "confirmed",
    photo: "/speakers/han-zong-xian.png",
    bio: "成功大學材料科學與工程學系學士、碩士，交通大學財務金融碩士，政治大學科技管理與智慧財產研究所博士，具備材料科學、財務管理與科技管理的跨領域背景。曾任職聯華電子等半導體公司，歷練製程模組與整合、品管、客服及業務，投身創投後於 ITIC 歷任投資經理、資深經理與公司董事，現為副總經理，參與多檔跨國高科技創投基金的募集與管理，並擔任應材創新基金經理人，專注半導體、材料科技、AI 與深科技領域的股權投資。亦為工研院技術團隊「奈視科技」共同創辦人暨董事長，並於台灣師範大學開設創業學程。",
  },
  {
    slug: "pan-yi-fan",
    name: "潘逸凡",
    title: "合夥人暨投資審議委員",
    org: "豐新資本",
    day: "investor",
    track: "deep-tech",
    status: "confirmed",
    photo: "/speakers/pan-yi-fan.png",
    bio: "潘逸凡現任豐新資本合夥人暨投資審議委員，具25年策略顧問、投資銀行與私募股權經驗。畢業於臺灣大學工商管理系，並取得美國密西根大學MBA。曾任麥肯錫專案經理、德意志銀行研究部董事及東森集團策略長，主導跨境併購與投後整合；目前聚焦半導體、人工智慧、智慧移動、電動車、機器人、軟體、資安與消費科技等成長型投資賽道。",
  },
  {
    slug: "ju-zhi-yuan",
    name: "鞠志遠",
    title: "創辦人兼CEO",
    org: "歐姆佳科技",
    day: "investor",
    track: "deep-tech",
    status: "confirmed",
    photo: "/speakers/ju-zhi-yuan.jpg",
    bio: "為台灣大學電信所太空科學博士，深耕太空與通訊領域長達20年。他創辦的歐姆佳科技，核心產品為射頻半導體自動測試設備（ATE），主要應用於半導體測試供應鏈中的高速射頻晶片量測與多站點並行測試，能大幅降低40%的測試成本。在國發會主辦的「創業綻放計畫」中，歐姆佳從數千組隊伍中脫穎而出，成功挺進全國前30強決賽，展現出卓越的高科技產業實力與市場競爭力。",
  },
];

/** 主辦人（不列入講者牆，單獨呈現於創辦人區） */
export const hostSpeaker: Speaker = {
    slug: "vincent-lin",
    name: "林文欽",
    nameEn: "Vincent Lin",
    // 業主 2026/9（同月第二次改口，以此為準）：對外一律「年會主辦人：林文欽／台大創創中心
    // 執行長」，避開「台灣新創投資社團創辦人」這個身分 —— 先前那版「創辦人／台灣新創投資社團」
    // 正是要避開的寫法。
    // bio 仍是簡報原文（見檔頭：逐字保留，不潤飾），其中末段提到他創辦社團一事未改；
    // TODO: 若業主要求連 bio 也不得出現社團創辦人身分，需向主辦方索取改寫後的版本。
    title: "年會主辦人",
    org: "台大創創中心 執行長",
    day: "investor",
    track: "host",
    status: "confirmed",
    photo: "/speakers/vincent-lin.jpg",
    bio: "林文欽Vincent現任台大創創中心執行長。負責運營台大車庫/台大創創加速器/台大天使會等業務服務。\n\n曾任中國最高市值企業騰訊科技事業部副總經理，京東商城市場副總裁。2022年返台後積極參與新創投資，光速火箭及展逸國際等上櫃企業的獨立董事，震豪科技等多家企業董事。其創辦的Facebook台灣新創投資社團目前是台灣影響力最大的新創投資網路社群。\n\n2023年開始每年舉辦備受新創圈矚目的「台灣新創投資年會」，邀請實力派的講師或新世代創業家呈現最精彩的演講內容，期望為台灣新創投資圈帶來不同的視野，並促進更多高資產投資人認識台灣頂尖創投與創辦人，進而積極參與投資台灣新創企業。",
};

/* 對外的講者名單：只收 confirmed。
   業主 2026/9 定案：「確認中就當沒有這個人，確認後再補」——
   不是隱藏照片、也不是標註「確認中」，而是列表、跑馬燈、講者內頁、sitemap、
   llms.txt 與 JSON-LD 全部都不該出現他。

   過濾放在資料層而不是各個呼叫端，是因為下游有六處（見 CLAUDE.md「資料的下游有三處」），
   漏掉任何一處就會露出一個沒有入口卻搜尋得到的孤兒頁。
   generateStaticParams 也吃這一份 → 未確認者的 /speakers/[slug] 根本不會被產生。 */
export const speakers: Speaker[] = allSpeakers.filter((s) => s.status !== "pending");

export function getSpeaker(slug: string): Speaker | undefined {
  return speakers.find((s) => s.slug === slug);
}

export function speakersByDay(day: ForumKey): Speaker[] {
  return speakers.filter((s) => s.day === day);
}

export const speakerCount = speakers.length;
