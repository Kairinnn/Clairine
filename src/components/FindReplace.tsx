"use client";

import { useState, useCallback } from "react";

export default function FindReplace() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [flags, setFlags] = useState("g");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const doReplace = useCallback(() => {
    if (!find) {
      setResult(input);
      setMatchCount(0);
      setError("");
      return;
    }

    try {
      setError("");
      if (useRegex) {
        const regex = new RegExp(find, flags);
        const matches = input.match(regex);
        setMatchCount(matches ? matches.length : 0);
        setResult(input.replace(regex, replace));
      } else {
        // 纯文本模式：转义特殊字符后用正则实现全局替换
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "g");
        const matches = input.match(regex);
        setMatchCount(matches ? matches.length : 0);
        setResult(input.replace(regex, replace));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "正则写炸了！！";
      setError(msg);
      setResult("");
      setMatchCount(0);
    }
  }, [input, find, replace, useRegex, flags]);

  const copyResult = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fr-container">
      <div className="fr-field">
        <label>原始文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="把要处理的文本粘贴到这里:3…"
          rows={6}
        />
      </div>

      <div className="fr-row">
        <div className="fr-field fr-flex1">
          <label>查找</label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder={useRegex ? "正则表达式…" : "要找的文本…"}
          />
        </div>
        <div className="fr-field fr-flex1">
          <label>替换为</label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="替换成…"
          />
        </div>
      </div>

      <div className="fr-controls">
        <label className="fr-toggle">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
          />
          <span>正则模式</span>
        </label>

        {useRegex && (
          <div className="fr-flags">
            <label>flags：</label>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g"
              className="fr-flags-input"
            />
            <span className="fr-flags-hint">g=全局 i=忽略大小写 m=多行</span>
          </div>
        )}

        <button className="fr-btn" onClick={doReplace}>
          执行替换
        </button>
      </div>

      {error && <div className="fr-error">{error}</div>}

      {result !== "" && (
        <div className="fr-result">
          <div className="fr-result-header">
            <span className="fr-match-count">
              匹配 {matchCount} 处
            </span>
            <button
              className={`fr-copy ${copied ? "fr-copied" : ""}`}
              onClick={copyResult}
            >
              {copied ? "🩷 已复制" : "复制结果"}
            </button>
          </div>
          <pre className="fr-output">{result}</pre>
        </div>
      )}
    </div>
  );
}
