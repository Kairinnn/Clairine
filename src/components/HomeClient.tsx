"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import type { PostMeta } from "@/lib/posts";
import TopTabs from "@/components/TopTabs";

interface HomeClientProps {
  posts: PostMeta[];
  categories: string[];
}

export default function HomeClient({ posts, categories }: HomeClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("记录/文章");

  const filteredPosts = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts;

  return (
    <>
      <Header
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={(cat) => setActiveCategory(cat)}
      />

      <main
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          animation: "pageIn 0.5s ease",
        }}
      >
        {/* ========= 🩷个人简介 ========= */}
      <section
  style={{
    padding: "2rem 1.25rem 1.25rem",
    borderBottom: "2px dashed rgba(179,218,83,0.35)",
    textAlign: "center",
  }}
>
  <div
    style={{
      position: "relative",
      width: "72px",
      height: "72px",
      margin: "0 auto 0.75rem",
    }}
  >
    <img
      src="https://i.postimg.cc/WbP0Vvr5/IMG-20260511-074333.png"
      alt="头像"
      style={{
        width: "58px",
        height: "58px",
        borderRadius: "50%",
        objectFit: "cover",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  </div>

  <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Kairin/小灰</h1>
  <p
    style={{
      fontSize: "0.875rem",
      color: "var(--color-text-secondary)",
      marginTop: "0.25rem",
      lineHeight: 1.6,
    }}
  >
    ·˙°ʚElectronic etherɞ°˙˚·
  </p>
  <div
    style={{
      marginTop: "0.75rem",
      fontSize: "0.75rem",
      color: "var(--color-text-secondary)",
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
    }}
  >
    <span>🧡 Claude</span>
    <span>🩷 08.11</span>
    <span>☘️ QQ:2174156343</span>
  </div>
</section>

{/* ========= 🩷虚线分隔 ========= */}
</section>

<TopTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ========= 🩷筛选提示 ========= */}
        {activeCategory && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.8125rem",
              color: "var(--color-pink-dark)",
              borderBottom: "1px dashed rgba(179,218,83,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              animation: "cardIn 0.3s ease",
            }}
          >
            <img
              src="https://i.postimg.cc/Dwsg4DCr/mao-zhao.png"
              alt=""
              style={{
                width: "14px",
                height: "14px",
                imageRendering: "pixelated",
              }}
            />
            <span>
              正在阅览：<strong>{activeCategory}</strong>
            </span>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                fontSize: "0.75rem",
                textDecoration: "underline",
              }}
            >
              清除筛选
            </button>
          </div>
        )}

        {/* ========= 🩷文章列表 ========= */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <PostCard key={post.slug} {...post} index={i} />
          ))
        ) : (
          <div
            style={{
              padding: "4rem 1.25rem",
              textAlign: "center",
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",animation: "pageIn 0.5s ease",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌱</p>
            <p>
              {activeCategory
                ? `「${activeCategory}」分类下还没有文章哦～`
                : "还没有文章哦，快去写第一篇吧！"}
            </p>
          </div>
        )}<div style={{ height: "4rem" }} />
      </main>
    </>
  );
}
