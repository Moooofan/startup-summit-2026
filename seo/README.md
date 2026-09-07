# SEO baseline

`/seo drift baseline` 在這台機器上跑不起來：公司網路只允許經 HTTP proxy 出去
（直連 20 秒逾時），而 claude-seo 的 fetch 管線內建 SSRF 防護，會拒絕解析 proxy
的私有 IP（`10.1.229.229`）。兩邊互斥，且該防護沒有開關，skill 文件也明寫
「Never bypass」—— 故不繞過，改用 curl（走 proxy 正常，HTTP 200）自行擷取。

## 用法

```bash
node seo/capture-baseline.mjs      # 覆寫 seo/baselines/latest.json
git diff seo/baselines/latest.json # 這就是 drift compare
```

擷取欄位與 claude-seo drift 對齊：title、meta description、canonical、
meta robots、h1/h2/h3、JSON-LD、Open Graph、html_hash、schema_hash。
不含 Core Web Vitals（需 PageSpeed API 金鑰，且同樣受 proxy 限制）。

部署前後各跑一次，`git diff` 就能看出哪個 meta 或 schema 被改動。
