"use client";

import { useEffect } from "react";

export default function InlineCmdScript() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>(".icmd-block");

    blocks.forEach((block) => {
      const template = block.dataset.template || "";
      const name = block.dataset.name || "";
      const preview = block.querySelector(".icmd-preview code");
      const inputs = block.querySelectorAll<HTMLInputElement>(".icmd-input");
      const copyBtn = block.querySelector<HTMLButtonElement>(".icmd-copy");

      const update = () => {
        let result = template;
        inputs.forEach((input) => {
          const varName = input.dataset.var || "";
          const val = input.value.trim();
          if (val) {
            result = result.replaceAll(
              `{${varName}}`,
              `<span class="cmd-var-filled">${val}</span>`
            );
          }
        });
        // 未填写的变量加 .cmd-var 高亮
        result = result.replace(/\{([^}]+)\}/g, '<span class="cmd-var">{$1}</span>');
        if (preview) preview.innerHTML = result;
      };

      inputs.forEach((input) => input.addEventListener("input", update));

      // 初始化时执行一次，让变量高亮立即生效
      update();

      copyBtn?.addEventListener("click", () => {
        let result = template;
        inputs.forEach((input) => {
          const varName = input.dataset.var || "";
          result = result.replaceAll(
            `{${varName}}`,
            input.value.trim() || `{${varName}}`
          );
        });
        
        update();
        navigator.clipboard.writeText(result).then(() => {
          if (copyBtn) {
            copyBtn.textContent = "🩷 已复制";
            setTimeout(() => (copyBtn.textContent = "📋 复制"), 2000);
          }
        });
      });
    });
  }, []);

  return null;
}
