# 上線前待補清單

## 必須向主辦方取得

- [ ] **場地完整地址與交通指引** — `data/event.ts` 的 `venue.address` / `venue.mapUrl`，
      同時會補進 `JsonLd.tsx` 的 `streetAddress`（目前只有「臺北市」）
- [ ] **Accupass 報名連結** — `lib/config.ts` 的 `REGISTER_URL`，並把 `REGISTER_READY` 改 `true`
- [ ] **正式網域** — `lib/config.ts` 的 `site.url`（目前是佔位的 startup-summit.tw）
- [ ] **官方聯絡信箱** — 目前用主辦人個人 Gmail `hm8827@gmail.com`
- [ ] **票種細節** — 單日票與四段團報級距已於 2026/9 由業主提供價目表（見 `data/event.ts`
      的 `tickets.groupTiers`）。仍待確認：早鳥截止日、兩天合購是否另有優惠、是否有 VIP 票
- [ ] **退票與轉讓規定** — `data/faq.ts` 最後一題目前寫「將隨報名開放公布」
- [ ] **是否直播／錄影** — `data/faq.ts` 同上
- [ ] **小型展位價格** — 簡報總覽頁寫 NT$18,000、細項頁寫 NT$50,000，**互相矛盾**。
      網站目前顯示「洽詢」，見 `data/sponsors.ts` 的 `boothPricingConflict`
- [ ] **主辦／協辦／指導單位正式名稱與 logo**
- [ ] **VVIP 晚宴的時間、地點、入場規則**

## 需要確認的內容

- [ ] **趙新民 / 鄒大智 的照片是否對調** — 這兩張是唯一無法從簡報獨立驗證的對應
      （`public/speakers/zhao-xin-min.png` 與 `zou-da-zhi.png`）
- [ ] **本屆贊助商 logo 是否已簽約** — `public/review/logos-2026/` 有 29 個 logo，
      **目前刻意沒有放上網站**。未簽約就展示對方 logo 有風險，確認後再啟用
- [ ] **`image79.png`（紅色摺紙風「TA」標誌）是哪家單位** — 尚未辨識，暫存為
      `logos-2026/sponsor-4th-partner-06.png`
- [ ] **創辦人的話** — 目前用林文欽公開發言當引言 + 簡報原文的第三人稱介紹。
      若他願意親筆寫一段，填進 `data/founder.ts` 的 `founderLetter` 即可自動替換

## 素材品質

- [ ] **四位講者的「照片」根本不是人像** —— 簡報放的是活動背板或節目宣傳圖：
      - 鍾哲民（adams-chung）：MoBagel 演講投影片，人在畫面右緣
      - 陳俊嘉（chen-jun-jia）：「科技解密」節目宣傳圖
      - 方俊傑（fang-junjie）：AVA Angels 辦公室招牌照
      - 李倫家（li-lun-jia）：PRO360 上櫃背板照
      目前已用 `data/speakerPhotoFocus.ts` 的 object-position 校正裁切焦點勉強可用，
      **取得正式頭像後請刪掉該檔對應項目**
- [ ] **講者照片解析度偏低**（最小僅 183×275，多數 200×200～600×600，簡報內嵌原圖）。
      3:4 卡片放大後偏軟，建議向講者索取高解析照
- [ ] **社團 Logo 向 VM 索取 SVG** — 目前 `public/logo-mark.png` 是從 KV 去背的點陣圖
- [ ] **去文字版 KV 原始檔（≥2400px PNG/PSD）** — 目前光軌是從 1047px 的截圖去背

## 內容擴充（可選）

- [ ] 逐時段議程表 — 現在只有主題軌，資料結構已在 `data/tracks.ts`，
      補時間欄位即可（可參考 `data/review.ts` 的 `PastSession` 形狀）
- [ ] 兩位講者的講題已知但未上站：楊本豫「Edge AI-empowered innovations in vertical
      domains」、丘立全「edge AI collaboration with Qualcomm」
- [ ] 第一屆（2023）資料幾乎空白，`data/review.ts` 標了 `dataComplete: false`
- [ ] 第三屆現場照只有 7 張，若有完整相簿可擴充回顧頁
