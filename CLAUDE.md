# 2026 第四屆台灣新創投資年會 官網

Next.js 15 App Router + TypeScript + Tailwind v4 + motion。純繁體中文，無 i18n。

## ⚠️ 鐵則（使用者定案，勿違反）

- **部署一律由使用者本人執行**。Claude **不得自行部署**（不觸發 Vercel、不 push 上線）。
- **Claude 不要自己跑 `npm run dev`、`npm run build` 或 `next start`／起任何 server**。build／執行／部署都由使用者做。
- Claude 只做：改程式 + 靜態檢查 `npx tsc --noEmit`、`npm run lint`。
- **需要看畫面（截圖驗證）時，開口請使用者截圖給你**，不要自己 build＋起 server 截圖。
- 若不慎跑了 build／server，**用完立刻清乾淨**：停 server → `Remove-Item -Recurse -Force .next`。

## 指令（給使用者參考；Claude 只用 tsc/lint）

```bash
npm run build   # 正式建置（會預先渲染 34 個講者頁）— 由「使用者」執行
npm run lint    # Claude 可用
npx tsc --noEmit # Claude 可用
# npm run dev / next start ← Claude 不要用
```

## 資料流

**所有內容都是靜態資料檔，沒有 CMS。** 改內容 = 改 `src/data/`。

| 檔案 | 內容 | 來源 |
|---|---|---|
| `data/event.ts` | 日期／地點／票價／主辦單位／首頁數據 | 企劃 pptx |
| `data/speakers.ts` | 34 位講者 + 主辦人 | **自動產生，勿手改** |
| `data/tracks.ts` | 12 條主題軌 | 企劃 pptx（人工整理） |
| `data/sponsors.ts` | 五級贊助方案與權益 | 企劃 pptx |
| `data/review.ts` | 歷屆回顧（第三屆 35 場議程／64 則媒體） | 企劃 pptx + 網路查證 |
| `data/founder.ts` | 林文欽介紹與引言 | 企劃 pptx + 公開發言 |
| `data/faq.ts` | 常見問題 | 人工撰寫 |
| `lib/config.ts` | 網域、Accupass 連結、贊助信箱 | **上線前必改** |

### speakers.ts 是產生的

由 `scratchpad/gen_speakers.py` 從 `speakers-day1.json` / `speakers-day2.json` 產生，
同時把簡報內嵌照片複製到 `public/speakers/<slug>.<ext>`。要改講者請改 JSON 後重跑產生器，
或直接改 .ts 但要記得下次重跑會被覆蓋。

⚠️ 重跑產生器後**要重新壓一次圖**：簡報原圖有幾張是 2MB 以上的 PNG，已手動轉成
JPEG 並更新引用。產生器本身不做壓縮，重跑會把原始 PNG 複製回來。

## 設計系統

深色主題，色票取自主視覺方案 C（VM｜布爾喬亞提案，2026/8/17）。
所有 token 定義在 `src/app/globals.css` 的 `@theme` 區塊 —— 改色只改那裡。

- 主色 `--color-brand: #324997`（KV 靛藍），深底上用 `brand-lift` / `brand-bright`
- 光軌色系 `orbit-blue / orbit-sky / orbit-violet / orbit-lilac / orbit-rose`
- 工具類：`.glass`、`.text-orbit`、`.ghost-head`、`.grain`、`.shell`

### KV 素材是加工過的

`public/kv/orbit-glow-v2.png` 與 `orbit-bloom-v2.png` 是把方案 C 的光軌從淺色底
**去背並轉成發光體**（`scratchpad/unmultiply.py` 的白底乘積反解）。原稿是點陣圖、
文字燒在圖上，網站的標題全部是真實 HTML 文字。

`public/logo-mark.png` 同樣是從 KV 去背取出的，解析度有限 —— **應向 VM 索取 SVG**。

## 慣例

- 事實一律以簡報為準；簡報沒寫的**不要編**，寫成「將於⋯⋯公布」並留 `// TODO`
- 講者 bio 逐字保留簡報原文，不潤飾
- 動效一律尊重 `prefers-reduced-motion`（`Reveal` 與 `Hero` 已處理）
- 圖片換檔請一併換檔名（加 `-v2` 之類），否則會撞 next/image 快取
