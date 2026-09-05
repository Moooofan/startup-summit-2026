/**
 * 講者照片的裁切焦點修正。
 *
 * 簡報裡有幾位講者放的不是標準人像，而是活動背板、節目截圖或現場照，
 * 直接用 object-top 裁切會把人切掉。這裡以 object-position 校正焦點。
 *
 * TODO: 這是權宜措施 —— 向講者取得正式頭像後，應刪除對應項目。
 * 本檔為手寫，不會被 gen_speakers.py 覆蓋。
 */
const overrides: Record<string, string> = {
  "adams-chung": "85% 26%", // 簡報用的是演講投影片，人在右緣
  "fang-junjie": "25% 20%", // AVA Angels 辦公室招牌照，人在左側
  "wu-you-xun": "82% 50%", // 東聯互動辦公室橫幅照，人在右側、招牌在左（3:4 裁切只留一半寬）
  "li-lun-jia": "62% 48%", // PRO360 上櫃背板照，人像偏小
};

/** 預設略高於中心，符合人像構圖 */
export const DEFAULT_FOCUS = "50% 18%";

export function photoFocus(slug: string): string {
  return overrides[slug] ?? DEFAULT_FOCUS;
}

/** 需要替換為正式頭像的講者 */
export const needsBetterPhoto = Object.keys(overrides);
