/**
 * 按鈕 hover 掃光：寬亮帶中夾一條窄鏡面線 —— 兩段亮度一起掠過，像光掃過玻璃曲面。
 *
 * 抽成元件是因為它有四個使用者（ui/Cta 的 gradient 與 solid 兩個分支、
 * 導覽列桌機與手機選單的兩顆報名鈕），而這條漸層字串長到一旦複製就不會有人再對齊。
 *
 * 呼叫端要負責三件事，缺一道效果就不會出現：
 * 1. 外層要有 `group` —— 動畫是 group-hover 觸發的。
 * 2. 外層要 position:relative + overflow:hidden，亮帶才裁得住。`.btn-glass` 兩者都給了。
 * 3. 按鈕的文字內容要包一層 `relative` —— 這是絕對定位元素，會畫在靜態內容之上，
 *    文字不提到定位堆疊就會被亮帶蓋住。
 *
 * 堆疊層次：`.btn-glass` 的 ::before / ::after 已用 z-index:-1 壓到內容層之下，
 * 所以這層維持預設堆疊即可蓋在其上。
 */
export function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 [background-image:linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.16)_34%,rgb(255_255_255/0.55)_50%,rgb(255_255_255/0.16)_66%,transparent_100%)] [transform:translateX(-250%)_skewX(-12deg)] group-hover:[animation:sheen_0.85s_ease-out]"
    />
  );
}
