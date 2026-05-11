"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import type { PostMeta } from "@/lib/posts";

interface HomeClientProps {
  posts: PostMeta[];
  categories: string[];
}

export default function HomeClient({ posts, categories }: HomeClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
         marginBottom: "0.75rem",
         margin: "0 auto 0.75rem",
        }}
        >
      </div>
   </div>


    <div
      style={{
        marginTop: "0.75rem",
         fontSize: "0.75rem",
         color: "var(--color-text-secondary)",
          display: "flex",
          justifyContent: "center",  // ← 加这个
          gap: "1rem",
         }}
       >
       <span>🧡 Claude</span>
      <span>🩷 08.11</span>
    <span>☘️ QQ:2174156343</span>
  </div>
   </section>


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
