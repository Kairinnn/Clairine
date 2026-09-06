import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  author: string;
  wordCount: number;
  readingTime: number;
  hidden?: boolean;
}

export interface Post extends PostMeta {
  contentHtml: string;
  signature?: string; // 版本号落款，如 "Claude Fable 5"
}

function ensureDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function getStats(text: string) {
  const clean = text.replace(/[#*`>\-\[\]()!~|]/g, " ").trim();
  const cjk = (clean.match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g) || []).length;
  const eng = (clean.match(/[a-zA-Z]+/g) || []).length;
  const total = cjk + eng;
  return {
    wordCount: total,
    readingTime: Math.max(1, Math.ceil(total / 400)),
  };
}

export function getAllPosts(): PostMeta[] {
  ensureDir();

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"));

  const posts: PostMeta[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const plainText = content.replace(/[#*`>\-\[\]()!]/g, " ").trim();
    const excerpt =
      data.excerpt || plainText.slice(0, 120) + (plainText.length > 120 ? "..." : "");
    const stats = getStats(content);

    return {
      slug,
      title: data.title || slug,
      date: data.date || "未知日期",
      excerpt,
      tags: data.tags || [],
      category: data.category || "未分类",
      author: data.author || "kairin",
      hidden: data.hidden || false,
      ...stats,
    };
  });

  return posts
  .filter((p) => !p.hidden).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const cats = new Set(posts.map((p) => p.category));
  return Array.from(cats).sort();
}

export function getAllPostSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, slug + ".md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(gfm).use(html, { sanitize: false }).process(content);
  const contentHtml = processedContent.toString()
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    .replace(/\+\+(.+?)\+\+/g, "<u>$1</u>")
    .replace(/\u201C([^\u201D]*?)\u201D/g, '<span class="quote-green">\u201C$1\u201D</span>')
    .replace(/【([^】]*?)】/g, '<span class="quote-green">【$1】</span>')
    .replace(/\u300E([^\u300F]*?)\u300F/g, '<span class="quote-green">\u300E$1\u300F</span>')
    .replace(
      /<div\s+class="inline-cmd"\s+data-cmd="([^"]*)"(?:\s+data-tool="([^"]*)")?\s*(?:\/>|><\/div>)/g,
      (_, cmdRaw, tool) => {
        const cmd = (cmdRaw as string).replace(/&#10;/g, '\n');
        const vars = (cmd as string).match(/\{(.+?)\}/g) || [];
        const uniqueVars = [...new Set(vars)];
        const inputsHtml = uniqueVars
          .map((v: string) => {
        const name = v.slice(1, -1);
          return `<label class="icmd-label">${name}<input type="text" class="icmd-input" data-var="${name}" placeholder="${name}" /></label>`;
          })
          .join("");
        const toolLink = tool
          ? `<a href="/tools" class="icmd-toollink">🧀 在命令匣中查看</a>`
          : "";
        return `
  <div class="icmd-block" data-template="${(cmd as string).replace(/"/g, '"')}" data-name="${tool || ''}">
    ${tool ? `<div class="icmd-title">${tool}</div>` : ""}
    <pre class="icmd-preview"><code>${cmd}</code></pre>
    ${inputsHtml ? `<div class="icmd-inputs">${inputsHtml}</div>` : ""}
    <div class="icmd-actions">
      <button class="icmd-copy">🩷 复制</button>
      ${tool ? `<a href="/tools" class="icmd-toollink">🧀 在命令匣中查看</a>` : ""}
    </div>
  </div>`;
      }
    )
    .replace(
      /<pre><code(?:\s+class="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,
      (_, lang, code) => {
        const decoded = (code as string).replace(/</g, "<").replace(/>/g, ">").replace(/&/g, "&");
        const lines = decoded.trim().split("\n");
        const numbered = lines
          .map((line: string, i: number) =>
            `<span class="code-line" data-line="${i + 1}"><span class="line-content">${line || " "}</span></span>`
          )
          .join("");
        return `<pre><code${lang ? ` class="${lang}"` : ""}>${numbered}</code></pre>`;
      }
    );

  const plainText = content.replace(/[#*`>\-\[\]()!]/g, " ").trim();
  const excerpt =
    data.excerpt || plainText.slice(0, 120) + (plainText.length > 120 ? "..." : "");
  const stats = getStats(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || "未知日期",
    excerpt,
    tags: data.tags || [],
    category: data.category || "未分类",
    author: data.author || "kairin",
    signature: data.signature || undefined,
    contentHtml,
    ...stats,
  };
}
