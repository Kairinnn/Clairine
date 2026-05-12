import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  wordCount: number;
  readingTime: number;
}

export interface Post extends PostMeta {
  contentHtml: string;
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
      ...stats,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
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

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString()
  .replace(/~~(.+?)~~/g, "<del>$1</del>")
  .replace(/==(.+?)==/g, "<mark>$1</mark>");

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
    contentHtml,
    ...stats,
  };
}
