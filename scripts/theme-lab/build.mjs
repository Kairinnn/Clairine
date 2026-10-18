// 生成 public/theme-lab.html（调色盘 + 贴纸小工具）
// 把站点 globals.css 和全站字体塞进模板，产物是一个能单独下载带走的 html
// 改过 globals.css 之后跑一次：npm run theme-lab
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p, enc) => readFileSync(join(root, p), enc);

const template = read("scripts/theme-lab/template.html", "utf8");
const css = read("src/app/globals.css", "utf8").replace(/@import\s+["']tailwindcss["'];?/, "");
const font = read("src/app/fonts/Moyuan.woff2").toString("base64");

if (css.includes("</script")) throw new Error("globals.css 里出现了 </script，没法内嵌");

const out = template
  .replace("/*__SITE_CSS__*/", () => css)
  .replace("__FONT_B64__", () => font)
  .replace("__BUILT_AT__", () => new Date().toISOString().slice(0, 10));

writeFileSync(join(root, "public/theme-lab.html"), out);
console.log(`public/theme-lab.html  ${(out.length / 1024 / 1024).toFixed(2)} MB`);
