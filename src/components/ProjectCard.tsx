"use client";

import type { Project } from "@/data/projects";

// 三套配色：图标底色 + 边框
const ACCENTS: Record<
  Project["accent"],
  { bg: string; border: string; fg: string }
> = {
  pink: {
    bg: "linear-gradient(135deg, rgba(255,215,237,0.9), rgba(255,240,248,0.9))",
    border: "rgba(244,114,182,0.35)",
    fg: "var(--color-pink-dark)",
  },
  green: {
    bg: "linear-gradient(135deg, rgba(225,255,197,0.9), rgba(240,255,225,0.9))",
    border: "rgba(74,222,128,0.35)",
    fg: "var(--color-green-dark)",
  },
  yellow: {
    bg: "linear-gradient(135deg, rgba(255,247,163,0.9), rgba(255,252,225,0.9))",
    border: "rgba(234,179,8,0.35)",
    fg: "#b8860b",
  },
};

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const accent = ACCENTS[project.accent];
  // 已上线且填了地址才可点
  const isLive = project.status === "online" && project.url.trim() !== "";
  // 站内路由（以 / 开头）走同标签页，外链才新开
  const isInternal = project.url.startsWith("/");

  const card = (
    <article
      style={{
        position: "relative",
        display: "flex",
        gap: "0.875rem",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "16px",
        border: `2px ${isLive ? "solid" : "dashed"} ${accent.border}`,
        background: "var(--color-card)",
        opacity: isLive ? 1 : 0.7,
        cursor: isLive ? "pointer" : "default",
        transition:
          "transform 0.35s cubic-bezier(.34,1.3,.64,1), box-shadow 0.35s ease",
        animation: `cardIn 0.45s cubic-bezier(.34,1.3,.64,1) ${index * 0.08}s backwards`,
      }}
      onMouseEnter={(e) => {
        if (!isLive) return;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(251,168,215,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* 外链角标 */}
      {isLive && !isInternal && (
        <span
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.625rem",
            fontSize: "0.875rem",
            color: accent.fg,
            opacity: 0.7,
          }}
        >
          ↗
        </span>
      )}

      {/* emoji 图标块 */}
      <div
        style={{
          flexShrink: 0,
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          background: accent.bg,
        }}
      >
        {project.emoji}
      </div>

      {/* 文字 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
            {project.title}
          </h2>
          {project.status === "wip" && (
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                padding: "0.1rem 0.4rem",
                borderRadius: "6px",
                background: "rgba(234,179,8,0.18)",
                color: "#b8860b",
              }}
            >
              施工中 🚧
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {project.desc}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.375rem",
              marginTop: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.6875rem",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "6px",
                  background: "rgba(179,218,83,0.18)",
                  color: "var(--color-green-dark)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  if (isLive) {
    return (
      <a
        href={project.url}
        target={isInternal ? undefined : "_blank"}
        rel={isInternal ? undefined : "noopener noreferrer"}
        style={{ display: "block" }}
      >
        {card}
      </a>
    );
  }
  return card;
}
