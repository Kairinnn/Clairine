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
    <Link href={`/post/${slug}`} style={{ display: "block" }}>
      <article
        style={{
          padding: "1.25rem",
          borderBottom: "1px dashed rgba(179,218,83,0.35)",
          cursor: "pointer",
          transition:
            "background-color 0.3s ease, transform 0.35s cubic-bezier(.34,1.3,.64,1), box-shadow 0.35s ease",
          animation: `cardIn 0.45s cubic-bezier(.34,1.3,.64,1) ${index * 0.08}s backwards`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255,215,237,0.15)";
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow =
            "0 8px 24px rgba(251,168,215,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {/* ========= 🩷头像 ========= */}
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
              <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                Kairin
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                {date}
              </span>
            </div>

            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.375rem",
                lineHeight: 1.4,
              }}
            >
              {title}
            </h2>

            <p
              style={{
                fontSize: "0.875rem",
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
                {tags.map((tag, i) => (
                  <Tag
                    key={tag}
                    label={tag}
                    color={i % 2 === 0 ? "pink" : "green"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
