interface BottomNavProps {
  prevPost?: { title: string; slug: string } | null;
  nextPost?: { title: string; slug: string } | null;
}

export default function BottomNav({ prevPost, nextPost }: BottomNavProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.75rem",
        margin: "2.5rem auto 1.5rem",
        padding: "0 1rem",
        maxWidth: "600px",
      }}
    >
      {/* 上一篇 */}
      {prevPost ? (
        <a
          href={`/posts/${prevPost.slug}`}
          style={{
            flex: 1,
            padding: "0.625rem 1rem",
            borderRadius: "20px",
            background: "#fff",
            border: "1.5px solid rgba(199,244,149,0.6)",
            color: "var(--color-green)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            textAlign: "center",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(199,244,149,0.15)",
            transition: "all 0.2s ease",
          }}
        >
          ← 上一篇
        </a>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {/* 返回主页 */}
      <a
        href="/"
        style={{
          flex: 1,
          padding: "0.625rem 1rem",
          borderRadius: "20px",
          background: "#fff",
          border: "1.5px solid rgba(255,171,215,0.5)",
          color: "var(--color-pink)",
          fontSize: "0.8125rem",
          fontWeight: 500,
          textAlign: "center",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(255,171,215,0.12)",
          transition: "all 0.2s ease",
        }}
      >
        ☘️ 返回主页
      </a>

      {/* 下一篇 */}
      {nextPost ? (
        <a
          href={`/posts/${nextPost.slug}`}
          style={{
            flex: 1,
            padding: "0.625rem 1rem",
            borderRadius: "20px",
            background: "#fff",
            border: "1.5px solid rgba(199,244,149,0.6)",
            color: "var(--color-green)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            textAlign: "center",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(199,244,149,0.15)",
            transition: "all 0.2s ease",
          }}
        >
          下一篇 →
        </a>
      ) : (
        <div style={{ flex: 1 }} />
      )}
    </div>
  );
}
