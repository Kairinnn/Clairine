import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata = {
  title: "合集 · 小灰",
};

export default function CollectionPage() {
  return (
    <main
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "4.5rem 1.25rem 4rem",
        animation: "pageIn 0.5s ease",
      }}
    >
      {/* 头部 */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Link
          href="/"
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-secondary)",
          }}
        >
          ← ☘️返回
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.5rem" }}>
          🧺 合集
        </h1>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-secondary)",
            marginTop: "0.25rem",
          }}
        >
          一些我做的小网页 / 小工具～点卡片跳过去玩
        </p>
      </div>

      {/* 卡片网格 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "0.875rem",
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>

      {projects.length === 0 && (
        <div
          style={{
            padding: "4rem 1.25rem",
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌱</p>
          <p>还没有小工具，敬请期待～</p>
        </div>
      )}
    </main>
  );
}
