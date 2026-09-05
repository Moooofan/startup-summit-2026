# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 2026 第四屆台灣新創投資年會 官網

Next.js 15 App Router + React 19 + TypeScript + Tailwind v4 + motion + three。純繁體中文，無 i18n、無測試、無 CMS。

## 鐵則（使用者定案，勿違反）

- **部署一律由使用者本人執行**。Claude **不得自行部署**（不觸發 Vercel、不 push 上線）。
- **Claude 不要自己跑 `npm run dev`、`npm run build` 或 `next start`／起任何 server**。build／執行／部署都由使用者做。
- Claude 只做：改程式 + 靜態檢查 `npx tsc --noEmit`、`npm run lint`。
- **需要看畫面（截圖驗證）時，開口請使用者截圖給你**，不要自己 build＋起 server 截圖。
- 若不慎跑了 build／server，**用完立刻清乾淨**：停 server → `rm -rf .next`。
- **全站禁用 emoji**：程式碼、註解、畫面文字、資料檔、commit 訊息一律不出現圖形化符號
  （警告三角、打勾、火焰、表情臉那類）。要強調就用文字或 `**粗體**`，不要用符號。
  排版標點不在此限，可以繼續用：`—` `·` `・` `｜` `※` `→` `⟶` `©` `®`。
  自我檢查（應無輸出）：
  `rg --pcre2 '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B00}-\x{2BFF}\x{FE0F}]' src CLAUDE.md`

## 指令

```bash
npx tsc --noEmit  # Claude 可用（型別檢查）
npm run lint      # Claude 可用（eslint，flat config + next/core-web-vitals）
npm run build     # 由「使用者」執行；會預先渲染 35 個講者頁
npm run dev       # 由「使用者」執行（--turbopack）
```

沒有測試框架，`npm test` 不存在。驗證只有 tsc + lint + 使用者的目視確認。

## 架構

### 內容 = 靜態資料檔

**所有內容都是 `src/data/` 的 TypeScript 常數，沒有 CMS、沒有 fetch、沒有資料庫。**
改內容 = 改 `src/data/`。頁面元件只負責排版，事實都從資料檔 import。

| 檔案 | 內容 | 來源 |
|---|---|---|
| `data/event.ts` | 日期／地點／票價／主辦單位／`forums`／`stats` | 企劃 pptx |
| `data/speakers.ts` | 35 位講者 + `hostSpeaker` | **自簡報產生，見下方警告** |
| `data/tracks.ts` | 12 條主題軌 + `trackMap` | 企劃 pptx（人工整理） |
| `data/sponsors.ts` | 五級贊助方案、展位、`benefitRows` | 企劃 pptx |
| `data/review.ts` | 歷屆回顧（第三屆 35 場議程／64 則媒體／贊助 logo） | 企劃 pptx + 網路查證 |
| `data/founder.ts` | 林文欽介紹與引言 | 企劃 pptx + 公開發言 |
| `data/faq.ts` | 常見問題 | 人工撰寫 |
| `data/speakerPhotoFocus.ts` | 少數爛照片的 `object-position` 校正 | 人工 |
| `lib/config.ts` | 網域、Accupass 連結、贊助信箱 | **上線前必改** |

`event.ts` 的 `forums` 陣列導出 `ForumKey` 型別（`founder` / `investor`），
講者、主題軌都用它綁定日別 —— 改 forums 的 key 會連鎖影響整個型別系統。

「簡報沒寫、需向主辦方索取」的缺口記在各資料檔自己的 `// TODO` 註解裡，改資料前先掃過。

### 資料的下游有三處，改資料要一起想

1. **頁面**：`src/app/*/page.tsx`
2. **結構化資料**：`components/site/JsonLd.tsx`（Event / Person / FAQ / Organization schema.org）
3. **機器可讀出口**：`app/llms.txt/route.ts`（`force-static`，整份活動事實由資料檔字串拼出）
   與 `app/sitemap.ts`（靜態路由 + 逐一展開講者頁）

### 路由與渲染

全站 **Server Component 為預設**，`"use client"` 只出現在需要瀏覽器 API 的葉節點
（Nav、Reveal、FlipClock、三個 three.js 元件、ScrollSnapController…）。

- `/`（`app/page.tsx`）**只有 JsonLd + `<Hero />`** —— 首頁其餘內容住在 `components/home/`，
  是歷史分頁改版留下的；找首頁區塊請看 `components/home/`，別在 `app/page.tsx` 找。
- `/about` `/speakers` `/agenda` `/tickets` `/sponsor` `/review`：各自獨立頁
- `/speakers/[slug]`：`generateStaticParams()` 從 `speakers` 產生 35 頁靜態頁，
  各自有 `generateMetadata` 與 PersonJsonLd，含上下位講者導覽

### 中文字型走 CDN，不是 next/font（重要）

`layout.tsx` 用 `next/font` 載 Montserrat（拉丁 300–700），但 **Noto Sans TC 是 `<link>` 到 Google Fonts**。
理由寫在檔案註解：Noto Sans TC 的 CSS 含上百段 unicode-range，next/font 會在建置期把所有
字重的所有分片全部下載 → **build 卡死**。不要「順手優化」把它改回 next/font。

字重清單是 `300;400;500;700;900`。**300 不能拿掉** —— 主視覺的中文標題是細筆畫、大字距，
Hero 主標與日別大標都吃 `font-light`；少了 300 瀏覽器會用 400 硬頂，字面立刻粗一級。

### three.js 是漸進增強，且刻意延後掛載

`OrbitRing` 是入口：SSR 與首幀只顯示光暈 → 決策後桌機 + 支援 WebGL + 未關動效才動態
`import()` `OrbitGlass`（`ssr:false`）；手機／關動效／不支援 → 純 CSS 的 `OrbitRingCss`。
掛載刻意延到 Hero 進場動畫跑完（~1.1s）之後，否則造幾何會搶主執行緒把進場動畫卡住。
`TicketGlass` / `TicketSheen` 同樣是 canvas。**動這些檔案時保留那些時序註解裡的理由。**

### 首頁捲動由 JS 獨佔，不是 CSS scroll-snap

`ScrollSnapController` 用滾輪／鍵盤事件 + `scrollIntoView` 接管節點跳轉；
CSS 的 `scroll-snap-type` **刻意沒開**（會和 JS 打架，也會吃掉「回上一頁」的位置還原）。
`.snap-start` / `.snap-panel` 只是給 JS 查詢節點的標記。手機與觸控裝置整個不接管。

## 設計系統

**深色主題**（2026/9 換版，原為淺色）：全站底層是 `layout.tsx` 掛的 `<SiteBackdrop />` ——
深靛漸層 + SVG 線構圖 + 青色高光 + 顆粒，固定不隨捲動；區塊本身不自帶底色
（`--color-bg-soft: transparent`），所以整站色調統一。
原本的「`/bg.jpg` 水墨圖 + `blur(26px)` + 深藍霧」已停用 —— 水墨與新 KV 的幾何線條語彙無關。

色票**逐點取樣自 `source/背景.jpg`**（2026 主視覺原稿，深藍夜空 + 電光藍 + 青色高光）。
所有 token 定義在 `src/app/globals.css` 的 `@theme` 區塊 —— **改色只改那裡**。
取樣值也寫在該檔檔頭，要調色**先看那組數字，不要憑印象**。

- 底色 `--color-bg: #050a2b`（只給導覽列／遮罩用的實色；區塊一律透明）
- 主色 `--color-brand: #2b56f0`（KV 電光藍）。另有 `brand-fill`（`#1e40cc`，按鈕實底，
  白字 7.4:1）/ `brand-lift`（連結）/ `brand-bright` / `brand-glow`。
  **brand 本身只當大面積色塊底，不要拿來寫字**
- 強調色 `--color-aqua: #6fe3ff`（KV 的青色高光）—— **取代舊版的 `--color-gold`**，
  新主視覺整張圖沒有任何暖色。`--color-accent` 是它的別名，兩支值必須永遠相同：
  站上 36 處眉標／強調點沿用 `accent`（語意上的「本站強調色」），
  `aqua` 留給明確要「KV 那支青」的地方。要換強調色**兩支一起換**
- 光構圖色系 `orbit-blue / orbit-sky / orbit-violet / orbit-lilac / orbit-rose` + `coral` / `magenta`
- 日別（業主定案兩色制）：Day 1 走 `orbit-sky`（同時是全站泛用次要藍，刻意不另開 `day1` token），
  Day 2 走 `--color-day2: #a98bff`
- 文字階 `ink / ink-2 / ink-3 / ink-4`（近白 → 藍灰）。對 `--color-bg` 的對比：
  17:1 / 11:1 / 7.2:1 / 4.8:1 —— **`ink-4` 已經貼著 AA 的線，別再往暗調**
- 工具類：`.glass`、`.glass-strong`、`.text-orbit`、`.ghost-head`、`.grain`、`.hairline`、
  `.photo-sink`、`.btn-gradient-primary`、`.kv-hatch`、`.shell`
- `.kv-hatch` 是 KV 的等距水平細線填充，線距 9px，與 `SiteBackdrop` 裡的 SVG `<pattern>`
  同值 —— **兩邊要一起改**，否則同一種材質會出現兩種線距
- `.text-kv`（近白→淡藍漸層 + 藍光暈）與 `.text-fade` 目前**全站沒有呼叫點**，備而未用
- `.glass` 的 blur 半徑是**捲動效能主因**，已從 14 調到 8，不要調回去
- **玻璃卡的「玻璃感」不要靠邊框或亮帶去做**（試過漸層邊框＋鏡面稜線＋斜向亮帶，業主評為「生硬」）。
  站上認可的做法是論壇卡那套：`.glass` + `overflow-hidden` + 卡外角落一顆
  `h-64 w-64 rounded-full blur-3xl` 的彩色光暈被裁進來（見 `ForumCards.tsx` 的 `ForumCard`
  與 `FounderNote.tsx` 的引言卡）。理由是背景那層深藍霧幾乎不透光，`backdrop-filter`
  沒東西可折射，光只能由卡片自己帶進來
- 深色版換色的兩條規則方向相反：**有顏色的填色 alpha 要上調**（疊色在近黑上幾乎沒變化）、
  **白色描邊與 inset 高光要下調**（白線在深底會變成刺眼線框）。
  黑白疊層互換時 alpha 不能 1:1 照搬 —— 依 ΔL* 對齊，`bg-black/[0.03]` 對應的是 `bg-white/[0.025]`
- `.marquee-viewport` 與 `HomeBackdrop` 的 `#000`／`#fff` 是**亮度遮罩不是塗色**，改了整層會消失
- **區塊光暈是一整套，共 9 顆**（Hero ×2、Tickets ×2、Speakers 開場、review、sponsor、
  speakers 內頁、TicketsGallery）：尺寸統一在 58–70vw / 上限 800–900px，
  峰值 alpha 統一 `0.07`、中間停 `0.025`，收邊一律 `transparent 72%`。
  光暈高達 880px，**放它的容器若比它矮（例如 /review、/sponsor 的頁首）不能用
  `overflow-hidden`**，否則會在區塊底部切出一條水平硬邊 —— 要用 `overflow-x-clip`
  （`overflow-x-hidden` 不行，會連帶讓 y 軸變成 auto 而生出捲動容器）
  **要調就整組一起調** —— 它們原本從 34vw/440px 到 70vw/900px 漂移了兩倍多，
  小的那幾顆在深底上會讀成「黏在邊上的一團」而不是環境光。
  置中在大字報後方的節點光暈（`Agenda.tsx` / `Speakers.tsx` 的 `left-1/2 top-1/2`）
  不屬於這一套，別一起改
- `OrbitGlass` 的折射底色（`new THREE.Color("#071a72")`）是「玻璃眼中的背景」，
  WebGL 取樣不到 DOM —— 動到 layout 的霧色時必須連它一起改，否則玻璃環會變成不透明色盤

### 深色版特有的坑（換版時逐一踩過）

- **不能把淺色值直接反相**。`bg-black/8` 這種「白底上壓暗線」翻成深色版時，亮度階要略微
  提高（→ `border-white/10`）：人眼在暗底上對低對比亮線比在亮底上對低對比暗線更不敏感。
- **WebGL 的 `background` 是「透過玻璃看到的世界」，不是卡片底色**。`OrbitGlass` 與
  `TicketGlass` 若沿用淺色版的淡藍折射底，會變成深底上兩塊死白的板，且蓋掉上層白字。
  現在都改成深藍量體，亮度改由 `Lightformer` 的高光提供。
- **暖色一律撤掉**。舊版的洋紅光暈、蜜桃／橘色玻璃碎塊、金色眉標在深靛底上都會變成
  一團與主視覺無關的暖光。改色時若看到 `#ff…` 開頭的暖色停，那是漏改的。
- **遮罩要壓暗而非提亮**。Hero 標題後方那片擋住玻璃環的霧面片，淺色版是提亮，
  深色版照抄會變成一塊發光橢圓，比它要遮的東西還搶眼。

### 素材是加工過的，且產生器不在 repo 裡

`public/og-v2.png`（1200×630）與 `public/logo-mark-v2.png` 都是從主視覺原稿加工而來，
加工腳本沒有進版控（一次性、用 Pillow 做的）：
- `og-v2.png` = `source/背景.jpg` 置中裁切成 1.905:1 再縮到 1200×630。標題、日期、logo 都在裁切範圍內。
  （合併兩條分支時另一版 `og-2026.jpg` 是同一張圖的 JPEG 輸出，已刪，別再各存一份）
- `logo-mark-v2.png` = `logo-mark.png` 2 倍放大 + 彩度 ×1.42 + 亮度 ×1.20。Nav 與 Footer 共用。
  原檔偏灰（#905090／#8060a0／#60a0d0），深底上會混濁；加亮後貼近 KV 取樣值。
  解析度仍有限 —— **應向 VM 索取 SVG**。

**已停用但保留在 repo 的舊素材**：`public/bg.jpg`（淺色水墨底，SiteBackdrop 上線後不再引用）、`public/og.png`、`public/logo-mark.png`、
`public/kv/*`（方案 C 的淺色 KV 與光軌去背圖）。全部已無程式引用，
留著是為了萬一要回頭比對；要清就整批清，別只刪一半。

**`scratchpad/`（`gen_speakers.py`、`unmultiply.py`）從未進版控，目前不存在**。
`speakers.ts` 檔頭仍寫「由 gen_speakers.py 產生」，但那個腳本已無法取得 ——
**現在改講者就是直接改 `speakers.ts`**。若日後重建產生器，記得它不做圖片壓縮：
簡報原圖有幾張是 2MB 以上 PNG，已手動轉 JPEG 並更新引用，重跑會把原始 PNG 蓋回來。

## 慣例

- 事實一律以簡報為準；簡報沒寫的**不要編**，寫成「將於⋯⋯公布」並在該處留 `// TODO`
- 講者 bio 逐字保留簡報原文，不潤飾
- 動效一律尊重 `prefers-reduced-motion`（`Reveal`、`Hero`、`OrbitRing`、globals.css 都已處理）
- 圖片換檔請一併換檔名（加 `-v2` 之類），否則會撞 next/image 快取
- 註解用繁體中文，且**寫「為什麼」而非「做什麼」** —— 這個 codebase 的註解大量記錄踩過的坑，
  改動相關程式時要保留或更新那些理由，別刪掉
