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
  const [showQR, setShowQR] = useState(false);

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
        {/* ========= 🩷个人简介 + Tab 一体卡片 ========= */}
        <div
          style={{
            margin: "0.75rem 1rem 0",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 2px 20px rgba(249,142,191,0.06)",
            overflow: "hidden",
          }}
        >
          <section
            style={{
              padding: "2rem 1.25rem 0",
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
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Kairin/小灰
            </h1>
            <p
              style={{
                fontSize: "1.4rem",
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
                fontSize: "1.225rem",
                color: "var(--color-text-secondary)",
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                paddingBottom: "0.75rem",
              }}
            >
              <span>🧡 Claude</span>
              <span>🩷 08.11</span>
              <span
                onClick={() => setShowQR(!showQR)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.25s",
                  color: showQR ? "var(--color-pink)" : "inherit",
                }}
              >
                ☘️ QQ{showQR ? "" : ":2174156343"}
              </span>
            </div>

            {/* 🩷QQ二维码展开区 */}
            {showQR && (
              <div
                style={{
                  paddingBottom: "1rem",
                  animation: "cardIn 0.3s ease",
                }}
              >
                <div
                  style={{
                    background: "rgba(249,142,191,0.03)",
                    borderRadius: "14px",
                    padding: "1.25rem",
                    border: "1.5px dashed rgba(249,142,191,0.2)",
                    display: "inline-block",
                  }}
                >
                  <img
                    src="/images/1778515425789.png"
                    alt="QQ二维码"
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "10px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--color-text-secondary)",
                      marginTop: "0.5rem",
                    }}
                  >
                    哇可以扫码欸!! (ᗒ𖥦ᗕ)՞⊹
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Tab栏嵌在卡片底部 */}
          <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* ========= 🩷筛选提示 ========= */}
        {activeCategory && (
          <div
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.975rem",
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
              ☘️正在阅览：<strong>{activeCategory}</strong>
            </span>
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                fontSize: "0.85rem",
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
              fontSize: "1.175rem",
              animation: "pageIn 0.5s ease",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌱</p>
            <p>
              {activeCategory
                ? `「${activeCategory}」分类下还没有文章哦～`
                : "还没有文章哦，快去写第一篇吧！"}
            </p>
          </div>
        )}
        <div style={{ height: "4rem" }} />
      </main>
    </>
  );
}
