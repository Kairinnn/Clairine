"use client";

import { useState, useMemo } from "react";
import { commands } from "@/data/commands";
import FindReplace from "@/components/FindReplace";

export default function ToolsPage() {
  const [tab, setTab] = useState<"cmd" | "fr">("cmd");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const categories = useMemo(
    () => [...new Set(commands.map((c) => c.category))],
    []
  );

  const filtered = useMemo(() => {
    let list = commands;
    if (activeCategory) {
      list = list.filter((c) => c.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.cmd.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  const copyCmd = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <main className="tools-page">
      <div className="tools-header">
        <h1>🍥 工具箱</h1>
        <p className="tools-subtitle">命令速查 & 查找替换</p>
      </div>

      <div className="tools-tabs">
        <button
          className={`tools-tab ${tab === "cmd" ? "active" : ""}`}
          onClick={() => setTab("cmd")}
        >
          📋 命令速查
        </button>
        <button
          className={`tools-tab ${tab === "fr" ? "active" : ""}`}
          onClick={() => setTab("fr")}
        >
          🔍 查找替换
        </button>
      </div>

      {tab === "cmd" && (
        <section className="cmd-section">
          <input
            type="text"
            className="cmd-search"
            placeholder="搜索命令…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="cmd-categories">
            <button
              className={`cmd-cat ${!activeCategory ? "active" : ""}`}
              onClick={() => setActiveCategory(null)}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cmd-cat ${activeCategory === cat ? "active" : ""}`}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="cmd-list">
            {filtered.map((c, i) => (
              <div
                key={i}
                className={`cmd-card ${copiedIdx === i ? "cmd-card-copied" : ""}`}
              >
                <div className="cmd-card-top">
                  <span className="cmd-title">{c.title}</span>
                  <span className="cmd-cat-tag">{c.category}</span>
                </div>
                <div className="cmd-code-row">
                  <code className="cmd-code">{c.cmd}</code>
                  <button
                    className={`cmd-copy ${copiedIdx === i ? "copied" : ""}`}
                    onClick={() => copyCmd(c.cmd, i)}
                  >
                    {copiedIdx === i ? "🩷" : "复制"}
                  </button>
                </div>
                <p className="cmd-desc">{c.desc}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="cmd-empty">没找到誒…换个说法嘛( ´▽` )？</div>
            )}
          </div>
        </section>
      )}

      {tab === "fr" && (
        <section className="fr-section">
          <FindReplace />
        </section>
      )}
    </main>
  );
}
