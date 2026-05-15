"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { commands } from "@/data/commands";
import FindReplace from "@/components/FindReplace";
import { useRouter } from "next/navigation";

function getCats(c: { category: string | string[] }): string[] {
  return Array.isArray(c.category) ? c.category : [c.category];
}

function parsePlaceholders(cmd: string): string[] {
  const matches = cmd.match(/\{([^}]+)\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

function fillCommand(cmd: string, values: Record<string, string>): string {
  let result = cmd;
  for (const [key, val] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, val || `{${key}}`);
  }
  return result;
}

export default function ToolsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"cmd" | "fr">("cmd");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cmd-favs");
      if (saved) setFavs(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleFav = useCallback((title: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      localStorage.setItem("cmd-favs", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const categories = useMemo(
  () => [...new Set(commands.flatMap((c) => getCats(c)))],
  []
);

  const filtered = useMemo(() => {
    let list = commands;
    if (showFavOnly) {
      list = list.filter((c) => favs.has(c.title));
    }
    if (activeCategory) {
      list = list.filter((c) => getCats(c).includes(activeCategory!));
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
  }, [search, activeCategory, showFavOnly, favs]);

  const handleExpand = (title: string) => {
    if (expandedTitle === title) {
      setExpandedTitle(null);
      setInputValues({});
    } else {
      setExpandedTitle(title);
      setInputValues({});
    }
  };

  const updateInput = (key: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [key]: val }));
  };

  const copyCmd = (c: { title: string; cmd: string }) => {
    const final =
      expandedTitle === c.title
        ? fillCommand(c.cmd, inputValues)
        : c.cmd;
    navigator.clipboard.writeText(final).then(() => {
      setCopiedTitle(c.title);
      setTimeout(() => setCopiedTitle(null), 2000);
    });
  };

  return (
    <main className="tools-page">
      <div className="tools-header">
        <button className="tools-back" onClick={() => router.push("/")}>
          ← ☘️返回
        </button>
        <h1>🍮 命令匣</h1>
        <p className="tools-subtitle">（ps：部分卡片左上角有个'▼'，
          点它有惊喜(´▽`ʃƪ)ෆ！）</p>
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
              className={`cmd-cat ${!activeCategory && !showFavOnly ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(null);
                setShowFavOnly(false);
              }}
            >
              全部
            </button>
            <button
              className={`cmd-cat cmd-cat-fav ${showFavOnly ? "active" : ""}`}
              onClick={() => {
                setShowFavOnly(!showFavOnly);
                setActiveCategory(null);
              }}
            >
              🍏 收藏
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cmd-cat ${activeCategory === cat && !showFavOnly ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(activeCategory === cat ? null : cat);
                  setShowFavOnly(false);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="cmd-list">
            {filtered.map((c) => {
              const placeholders = parsePlaceholders(c.cmd);
              const isExpanded = expandedTitle === c.title;
              const hasPH = placeholders.length > 0;
              const isCopied = copiedTitle === c.title;
              const finalCmd = isExpanded
                ? fillCommand(c.cmd, inputValues)
                : c.cmd;

              return (
                <div
                  key={c.title}
                  className={`cmd-card ${isCopied ? "cmd-card-copied" : ""} ${isExpanded ? "cmd-card-expanded" : ""}`}
                >
                  <div className="cmd-card-top">
                    <span
                      className={`cmd-title ${hasPH ? "cmd-title-clickable" : ""}`}
                      onClick={() => hasPH && handleExpand(c.title)}
                    >
                      {hasPH && (
                        <span className="cmd-expand-icon">
                          {isExpanded ? "▾" : "▸"}
                        </span>
                      )}
                      {c.title}
                    </span>
                    <div className="cmd-card-actions">
                      <button
                        className={`cmd-fav ${favs.has(c.title) ? "cmd-fav-active" : ""}`}
                        onClick={() => toggleFav(c.title)}
                        title="收藏"
                      >
                        🍏
                      </button>
                      {getCats(c).map((cat) => (
  <span key={cat} className="cmd-cat-tag">{cat}</span>
))}
                    </div>
                  </div>

                  <div className="cmd-code-row">
                    <code className="cmd-code">{finalCmd}</code>
                    <button
                      className={`cmd-copy ${isCopied ? "copied" : ""}`}
                      onClick={() => copyCmd(c)}
                    >
                      {isCopied ? "🩷" : "复制"}
                    </button>
                  </div>

                  <p className="cmd-desc">{c.desc}</p>

                  {isExpanded && hasPH && (
                    <div className="cmd-inputs">
                      {placeholders.map((ph) => (
                        <div key={ph} className="cmd-input-row">
                          <label className="cmd-input-label">{ph}</label>
                          <input
                            type="text"
                            className="cmd-input-field"
                            placeholder={`填写${ph}…`}
                            value={inputValues[ph] || ""}
                            onChange={(e) => updateInput(ph, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="cmd-empty">
                {showFavOnly
                  ? "还没有收藏的命令欸…🍏"
                  : "没找到…换个说法嘛？"}
              </div>
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
