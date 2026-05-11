"use client";

import { useEffect, useRef } from "react";

export default function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const blocks = ref.current.querySelectorAll("pre");
    blocks.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      // 给pre加上相对定位，让按钮能绝对定位在里面
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "复制";

      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code ? code.textContent || "" : pre.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          // 按钮变成已复制状态
          btn.innerHTML = "🩷 已复制";
          btn.style.background = "rgba(249,142,191,0.15)";
          btn.style.borderColor = "rgba(249,142,191,0.5)";
          btn.style.color = "#F98EBF";

          // 整个代码块闪粉
          pre.style.borderColor = "#F98EBF";
          pre.style.boxShadow = "0 0 12px rgba(249,142,191,0.3)";

          setTimeout(() => {
            btn.textContent = "复制";
            btn.style.background = "";
            btn.style.borderColor = "";
            btn.style.color = "";
            pre.style.borderColor = "";
            pre.style.boxShadow = "";
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
