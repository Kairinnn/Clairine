import { getAllPosts } from "@/lib/posts";

export default function sitemap() {
  const posts = getAllPosts();

  const postUrls = posts.map((post) => ({
    url: `https://kairin.cc/posts/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    { url: "https://kairin.cc", lastModified: new Date() },
    { url: "https://kairin.cc/tools", lastModified: new Date() },
    { url: "https://kairin.cc/about", lastModified: new Date() },
    ...postUrls,
  ];
}
