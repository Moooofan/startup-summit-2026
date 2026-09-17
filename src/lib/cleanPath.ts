/**
 * 把「網址尾巴黏到標點、夾帶隱形字元」的路徑清成乾淨路徑。
 * 由 src/middleware.ts 使用：清完與原路徑不同就直接轉址。
 *
 * 為什麼需要：業主 2026/9 回報從 Facebook 點「https://www.tsic.tw/review」
 * 開出 404。複製該連結實測是 `/review` + U+FFFC（線上 404）。另外中文貼文常把網址與
 * 「。」「）」「，」連寫，Facebook／LINE 自動加連結會把標點一起吃進網址，同樣 404。
 *
 * 清理是冪等的：清兩次與清一次結果相同，所以轉過去的網址不會再被轉一次，不會無限轉址。
 */

// 隱形字元：可能出現在路徑任何位置，整條清掉（站內路徑與講者 slug 全是 ASCII，清掉不會誤傷）
//
// U+FFFC 是 Apple 備忘錄／訊息／Pages 裡「嵌入物件」（圖片、連結預覽卡）的佔位字元，
// 文案從那裡複製到 Facebook 就會夾帶。它不是零寬字元也不算空白，初版只列零寬字元時漏掉，
// 所以這裡改成整類列舉。
//
// 不用 \p{Cf}：tsconfig target 是 ES2017，Unicode 屬性跳脫要 ES2018；
// 而且 U+FFFC／U+FFFD 的分類是 So 不是 Cf，用屬性寫法本來就抓不到。
//   U+00AD 軟連字號 · U+200B–U+200F 零寬字元與方向標記 · U+202A–U+202E 雙向嵌入
//   U+2060–U+2064 字詞接合與隱形運算子 · U+FEFF BOM
//   U+FFFC 物件替代字元 · U+FFFD 替代字元（編碼錯誤時出現）
//
// 一律寫成 \uXXXX 跳脫而非字面字元：字面的隱形字元在原始碼裡看不見，
// 很容易被編輯器或格式化工具靜默吃掉（初版就發生過）。
const INVISIBLE = /[\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\uFFFC\uFFFD]/g;

// 只清「尾巴」的字元：全形與中文標點、半形標點、空白（\s 已涵蓋不換行空格與全形空格）
const TRAILING_JUNK =
  /[\s\u3001\u3002\uFF0C\uFF01\uFF1F\uFF1B\uFF1A\uFF09\u300D\u300F\u3011\u3009\u300B\u2026\u2014\uFF5E.,!?;:)\]}'">]+$/;

/** 不合法的百分比編碼（例如被截斷成 `%E3%80`）時 decodeURIComponent 會丟錯，退回原字串 */
export function safeDecode(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function cleanPath(raw: string): string {
  let path = safeDecode(raw).replace(INVISIBLE, "").replace(TRAILING_JUNK, "");
  path = path.replace(/\/index\.html?$/i, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path.startsWith("/") ? path : `/${path}`;
}
