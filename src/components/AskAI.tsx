"use client";

import { useEffect, useState } from "react";

/* ========= 🩷转给 AI 看 =========
   技术文章写给人看常常看不懂，不如整篇丢给自己的 AI 让它讲、让它照着做。
   复制的是原始 markdown（代码块、表格都原样），只带标题和原文链接。
   不垫提示词（2026-11-26 小灰「一般大家已经跟家机有沟通基础了」）：怎么问由读者自己跟家机说。 */

function buildPrompt(title: string, url: string, raw: string) {
  return [`# ${title}`, "", `原文：${url}`, "", raw].join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 有的 WebView / 老 Safari 不给 clipboard API，退回 textarea + execCommand
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

export default function AskAI({ title, raw }: { title: string; raw: string }) {
  const [state, setState] = useState<"" | "copied" | "fail">("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const prompt = () => buildPrompt(title, location.href.split("#")[0], raw);

  const onCopy = async () => {
    setState((await copyText(prompt())) ? "copied" : "fail");
    setTimeout(() => setState(""), 2500);
  };

  const onShare = async () => {
    try {
      await navigator.share({ title, text: prompt() });
    } catch {
      /* 她自己点了取消 */
    }
  };

  return (
    <div className="ask-ai">
      <button className={"ask-ai-btn" + (state ? " " + state : "")} onClick={onCopy} type="button">
        {state === "copied" ? "🩷 已复制，去粘贴吧" : state === "fail" ? "😿 复制失败了" : "🤖 转给 AI 看"}
      </button>
      {canShare && (
        <button className="ask-ai-btn" onClick={onShare} type="button">
          📤 分享到 App
        </button>
      )}
      <span className="ask-ai-tip">看不懂就整篇丢给 AI，让它讲给你听</span>
    </div>
  );
}
