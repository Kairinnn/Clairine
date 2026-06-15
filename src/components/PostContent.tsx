"use client";

import { useEffect, useRef } from "react";

export default function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const blocks = ref.current.querySelectorAll("pre");
    blocks.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "复制";

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        // 用 textContent 取原始文本，保留代码块里的换行；只去掉首尾多余空行
        const raw = (code ?? pre).textContent ?? "";
        const text = raw.replace(/^\n+/, "").replace(/\n+$/, "");
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "✓ 已复制";
          btn.style.color = "#4ade80";
          btn.style.borderColor = "rgba(74,222,128,0.5)";
          setTimeout(() => {
            btn.textContent = "复制";
            btn.style.color = "";
            btn.style.borderColor = "";
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="post-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
