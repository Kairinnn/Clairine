import InlineCmdScript from "@/components/InlineCmdScript";
import { notFound } from "next/navigation";
import PostContent from "@/components/PostContent";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/lib/posts";
import BottomNav from "@/components/BottomNav";

export const dynamic = "force-static";
export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }
{/* ========= 🩷获取前后文章 ========= */}
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex < allPosts.length - 1
      ? { title: allPosts[currentIndex + 1].title, slug: allPosts[currentIndex + 1].slug }
      : null;
  const nextPost =
    currentIndex > 0
      ? { title: allPosts[currentIndex - 1].title, slug: allPosts[currentIndex - 1].slug }
      : null;

  return (
    <main
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "1.5rem 1.25rem 0",
        animation: "pageIn 0.5s ease",
      }}
    >
  {/* ========= 🩷文章头 ========= */}
      <div
        className="post-author-card"
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "40px",
            height: "40px",
            flexShrink: 0,
          }}
        >
          <img
            src="https://i.postimg.cc/mrN8jDgh/rinn.jpg"
            alt="头像"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600, fontSize: "1.1375rem" }}>Kairin</span>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              {post.date}
            </span>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>🩷 About {post.wordCount} words</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>约吃 {post.readingTime} 只 🍊</span>
          </div>
        </div>
      </div>
  {/* ========= 🩷标题 ========= */}
      <h1
        style={{
          fontSize: "1.6rem",
          fontWeight: 600,
          lineHeight: 1.4,
          marginBottom: "0.5rem",
        }}
      >
        {post.title}
      </h1>
  {/* ========= 🩷标签 ========= */}
      {post.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "0.375rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {post.tags.map((tag, i) => {
            const colorIndex = i % 3;
            const bg = [
              "rgba(255, 147, 208, 0.45)",
              "rgba(156, 212, 45, 0.45)",
              "rgba(255, 247, 163, 0.45)",
            ][colorIndex];
            const fg = [
              "#a3e449",
              "#ff86b8",
              "#FF99C3",
            ][colorIndex];

            return (
              <span
                key={tag}
                className="article-tag"
                style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  background: bg,
                  color: fg,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
    {/* ========= 🩷正文 ========= */}
      <PostContent html={post.contentHtml} />
      <InlineCmdScript />

    {/* ========= 🩷底部导航 ========= */}
      <BottomNav prevPost={prevPost} nextPost={nextPost} />
        </main>
       );
     }
