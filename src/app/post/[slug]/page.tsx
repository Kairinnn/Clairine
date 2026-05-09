import { notFound } from "next/navigation";
import Tag from "@/components/Tag";
import PostContent from "@/components/PostContent";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";

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

  return (
    <main
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "1.5rem 1.25rem 0",
        animation: "pageIn 0.5s ease",
      }}
    >
      {/* 文章头 */}
      <div
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
            src="https://i.postimg.cc/nhRJSnZ5/Screenshot-2026-04-27-14-13-16-681-com-miui-gallery-edit.jpg"
            alt="头像"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              objectFit: "cover",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <img
            src="https://i.postimg.cc/KcMJTcrf/2ed19fc5-45cb-45a7-b5ef-a72344271acd.png"
            alt=""

            style={{
              width: "40px",
              height: "40px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>小灰</span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
              {post.date}
            </span>
          </div>
          {/* 字数 + 阅读时长 */}
          <div
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-text-secondary)",
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>🍓 {post.wordCount} 字</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>约 {post.readingTime} 分钟</span>
          </div>
        </div>
      </div>

      {/* 标题 */}
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: "0.5rem",
        }}
      >
        {post.title}
      </h1>

      {/* 标签 */}
      {post.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "0.375rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          {post.tags.map((tag, i) => (
            <Tag key={tag} label={tag} color={i % 2 === 0 ? "pink" : "green"} />
          ))}
        </div>
      )}

      {/* 正文（带复制按钮） */}
      <PostContent html={post.contentHtml} />

      <div style={{ height: "4rem" }} />
    </main>
  );
}
