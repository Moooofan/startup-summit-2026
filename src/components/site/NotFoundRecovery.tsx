"use client";

import { useEffect } from "react";

/**
 * 404 自動修正：把網址尾巴黏到的標點、零寬字元清掉後導回正確的頁。
 *
 * 為什麼需要：中文貼文常寫「報名請見 https://www.tsic.tw。」，Facebook／LINE
 * 自動加連結時會把「。」「）」「，」一起吃進網址，點進去路徑變成 `/。` 而 404。
 * 業主 2026/9 回報「手機 Facebook 打開是 404」，線上實測 `/?fbclid=…` 正常、
 * `/%E3%80%82`（/。）與 `/tickets%E3%80%82` 都是 404，與截圖吻合。
 *
 * 為什麼放在 not-found 而不是 middleware：只有真的 404 才會跑，正常流量零成本，
 * 也不必在每個請求前多一層 edge function。
 *
 * 不會無限轉址：清理是冪等的 —— 清完若與原路徑相同就什麼都不做；
 * 導過去的新路徑若仍是 404，再清一次也會得到同一條路徑而停下。
 */

// 零寬字元：可能出現在路徑任何位置，整條清掉
const ZERO_WIDTH = /[​-‍⁠﻿]/g;

// 只清「尾巴」的字元：全形與中文標點、半形標點、空白
// 用 \u 跳脫而非字面值，避免被誤判成圖形符號，也避免編輯器靜默換字
const TRAILING_JUNK =
  /[\s、。，！？；：）」』】〉》…—～.,!?;:)\]}'">]+$/;

function cleanPath(raw: string): string {
  let path: string;
  try {
    path = decodeURIComponent(raw);
  } catch {
    // 不合法的百分比編碼（例如被截斷成 `%E3%80`）：直接用原字串處理
    path = raw;
  }

  path = path.replace(ZERO_WIDTH, "").replace(TRAILING_JUNK, "");
  path = path.replace(/\/index\.html?$/i, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path.startsWith("/") ? path : `/${path}`;
}

export function NotFoundRecovery() {
  useEffect(() => {
    const { pathname, search, hash } = window.location;

    let current: string;
    try {
      current = decodeURIComponent(pathname);
    } catch {
      current = pathname;
    }

    const cleaned = cleanPath(pathname);
    if (cleaned === current) return;

    // replace 而非 assign：不留下這筆 404 在瀏覽紀錄裡，按返回鍵才不會又掉回來
    window.location.replace(`${cleaned}${search}${hash}`);
  }, []);

  return null;
}
