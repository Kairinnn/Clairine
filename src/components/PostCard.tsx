"use client";

import Link from "next/link";
import Tag from "./Tag";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
  index?: number;
}

export default function PostCard({
  slug,
  title,
  excerpt,
  date,
  tags = [],
  index = 0,
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        style={{
          padding: "1.25rem",
          margin: "0.75rem 1rem 0",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "14px",
          cursor: "pointer",
          transition:
            "transform 0.35s cubic-bezier(.34,1.3,.64,1), box-shadow 0.35s ease",
          animation: `cardIn 0.45s cubic-bezier(.34,1.3,.64,1) ${index * 0.08}s backwards`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow =
            "0 8px 24px rgba(251,168,215,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {/* ========= 🩷头像 ========= */}
          <div
            style={{
              position: "relative",
              width: "42px",
              height: "42px",
              flexShrink: 0,
            }}
          >
            <img
              src="https://i.postimg.cc/mrN8jDgh/rinn.jpg"
              alt="头像"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                objectFit: "cover",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* ========= 🩷内容 ========= */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                Kairin
              </span>
              <span
                style={{
                  fontSize: "0.90rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                {date}
              </span>
            </div>

            <h2
              style={{
                fontSize: "1.0rem",
                fontWeight: 600,
                marginBottom: "0.375rem",
                lineHeight: 1.4,
              }}
            >
              {title}
            </h2>

            <p
              style={{
                fontSize: "0.873rem",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {excerpt}
            </p>

                        {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.375rem",
                  marginTop: "0.625rem",
                  flexWrap: "wrap",
                }}
              >
                {tags.map((tag, i) => {
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
          </div>
        </div>
      </article>
    </Link>
  );
}
