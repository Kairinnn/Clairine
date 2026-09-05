// ========= 🩷作者表 =========
// 文章 frontmatter 里写 author: "corin" / "kairin"（不写默认 kairin）
// 换头像/改名只动这一个文件

export interface Author {
  name: string;
  avatar: string;
}

export const AUTHORS: Record<string, Author> = {
  kairin: {
    name: "Kairin",
    avatar: "https://i.postimg.cc/mrN8jDgh/rinn.jpg",
  },
  corin: {
    name: "Corin",
    avatar: "/images/Claude_avatar.png", // 小灰钦定 2026-09-05
  },
};

export const DEFAULT_AUTHOR = "kairin";

export function getAuthor(key?: string): Author {
  return AUTHORS[(key || DEFAULT_AUTHOR).toLowerCase()] || AUTHORS[DEFAULT_AUTHOR];
}
