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
    if (val) {
      result = result.replaceAll(`{${key}}`, `<span class="cmd-var-filled">${val}</span>`);
    }
  }
  // 未填写的变量加 .cmd-var 高亮
  result = result.replace(/\{([^}]+)\}/g, '<span class="cmd-var">{$1}</span>');
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
  const [favs, setFavs] = useState<Set<string>>(() => {
    // lazy initialization：只在首次渲染时从 localStorage 读取
    try {
      const saved = localStorage.getItem("cmd-favs");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [showChain, setShowChain] = useState<string | null>(null);
  // 记住点击关联命令前所在的卡片，方便误触后滚回来
  const [scrollReturnId, setScrollReturnId] = useState<string | null>(null);
  // 跳转后高亮的目标卡片（粉色悬浮），随导航移动
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // 滑动到目标命令卡片：先清掉过滤确保目标渲染出来，再平滑滚过去
  const scrollToCmd = (targetTitle: string, fromTitle: string) => {
    setScrollReturnId(fromTitle);
    // 清掉所有过滤，避免目标命令被 tag/搜索筛掉而不在列表里
    setSearch("");
    setActiveCategory(null);
    setActiveSystem(null);
    setShowFavOnly(false);
    // 等下一帧渲染完成后再滚动，并把高亮落到目标卡片
    setTimeout(() => {
      document
        .getElementById(`cmd-${targetTitle}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightId(targetTitle);
    }, 50);
  };


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

  const systems = useMemo(
    () => [...new Set(commands.map((c) => c.system).filter(Boolean))] as string[],
    []
  );

  // 根据chain获取关联命令
  const getChainCommands = (chainId: string, currentTitle: string) => {
    return commands.filter((c) => c.chain === chainId && c.title !== currentTitle);
  };

  const filtered = useMemo(() => {
    let list = commands;
    if (showFavOnly) {
      list = list.filter((c) => favs.has(c.title));
    }
    if (activeSystem) {
      list = list.filter((c) => c.system === activeSystem);
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
  }, [search, activeCategory, activeSystem, showFavOnly, favs]);

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
    const finalHtml =
      expandedTitle === c.title
        ? fillCommand(c.cmd, inputValues)
        : c.cmd;
    // 去掉 HTML 标签，只复制纯文本
    const final = finalHtml.replace(/<[^>]*>/g, "");
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
        <h1>🧀 命令匣</h1>
        <p className="tools-subtitle">Ps:部分卡片左上角有个“▼”,
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

          {/* 系统大分类 */}
          <div className="cmd-systems">
            <button
              className={`cmd-sys ${!activeSystem ? "active" : ""}`}
              onClick={() => setActiveSystem(null)}
            >
              🌐 全平台
            </button>
            {systems.map((sys) => (
              <button
                key={sys}
                className={`cmd-sys ${activeSystem === sys ? "active" : ""}`}
                onClick={() => setActiveSystem(activeSystem === sys ? null : sys)}
              >
                {sys === "Linux" ? "🐧" : sys === "Windows" ? "🪟" : "🔄"} {sys}
              </button>
            ))}
          </div>

          {/* 功能分类 */}
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
                  id={`cmd-${c.title}`}
                  className={`cmd-card ${isCopied ? "cmd-card-copied" : ""} ${isExpanded ? "cmd-card-expanded" : ""} ${highlightId === c.title ? "cmd-card-highlight" : ""}`}
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
                    <code className="cmd-code" dangerouslySetInnerHTML={{ __html: finalCmd }} />
                    <button
                      className={`cmd-copy ${isCopied ? "copied" : ""}`}
                      onClick={() => copyCmd(c)}
                    >
                      {isCopied ? "🩷" : "复制"}
                    </button>
                  </div>

                  <div className="cmd-meta-row">
                    <p className="cmd-desc">{c.desc}</p>
                    {c.system && (
                      <span className={`cmd-sys-badge cmd-sys-badge-${c.system === "Linux" ? "linux" : c.system === "Windows" ? "win" : "all"}`}>
                        {c.system}
                      </span>
                    )}
                  </div>

                  {/* 关联命令 */}
                  {c.chain && (
                    <div className="cmd-chain">
                      <button
                        className="cmd-chain-toggle"
                        onClick={() => setShowChain(showChain === c.title ? null : c.title)}
                      >
                        🔗 关联命令 ({getChainCommands(c.chain, c.title).length})
                      </button>
                      {showChain === c.title && (
                        <div className="cmd-chain-list">
                          {getChainCommands(c.chain, c.title).map((rc) => (
                            <div
                              key={rc.title}
                              className="cmd-chain-item cmd-chain-item-clickable"
                              onClick={() => scrollToCmd(rc.title, c.title)}
                              title="点击跳到该命令"
                            >
                              <span className="cmd-chain-item-title">🔗 {rc.title}</span>
                              <code className="cmd-chain-item-code">{rc.cmd}</code>
                            </div>
                          ))}

                        </div>
                      )}
                    </div>
                  )}

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

      {/* 误触关联命令后，一键滚回原来的卡片 */}
      {tab === "cmd" && scrollReturnId && (
        <button
          className="cmd-return-btn"
          onClick={() => {
            const back = scrollReturnId;
            document
              .getElementById(`cmd-${back}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
            // 取消目标卡片高亮，把粉色悬浮移回刚刚来时的卡片
            setHighlightId(back);
            setScrollReturnId(null);
          }}
        >
          ↩ 返回「{scrollReturnId}」
        </button>
      )}
    </main>

  );
}
