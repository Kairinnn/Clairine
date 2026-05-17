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
      const update = () => {
       let result = template;
        inputs.forEach((input) => {
         const varName = input.dataset.var || "";
           const val = input.value.trim();
          result = result.replaceAll(
         `{${varName}}`,
        val || `{${varName}}`
       );
      });
     if (preview) {
      preview.innerHTML = result.replace(
       /\{([^}]+)\}/g,
       '<span class="icmd-var">$&</span>'
       );
      }
     };

      inputs.forEach((input) => input.addEventListener("input", update));

      copyBtn?.addEventListener("click", () => {
        let result = template;
        inputs.forEach((input) => {
          const varName = input.dataset.var || "";
          result = result.replaceAll(
            `{${varName}}`,
            input.value.trim() || `{${varName}}`
          );
        });
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
