"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  QUESTIONS,
  PARTS,
  DIMENSIONS,
  DESCRIPTIONS,
  TIER_LABEL,
  TOTAL_COUNT,
  computeResult,
  type DimKey,
} from "@/data/quiz";

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[index];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_COUNT) * 100);

  const result = useMemo(
    () => (done ? computeResult(answers) : null),
    [done, answers]
  );

  const choose = (qid: string, key: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: key }));
    // 选完短暂停顿后自动进入下一题；最后一题则出结果
    setTimeout(() => {
      if (index < QUESTIONS.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 220);
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== 结果页 =====
  if (done && result) {
    const q44 = QUESTIONS.find((x) => x.id === "Q44");
    const q44choice = q44?.options.find((o) => o.key === answers["Q44"]);

    return (
      <main
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "4.5rem 1.25rem 4rem",
          animation: "pageIn 0.5s ease",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>你的结果 🫧</h1>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--color-text-secondary)",
            margin: "0.25rem 0 1.5rem",
          }}
        >
          六个维度，各自的样子。这是你怎么爱的——以及那意味着什么。
        </p>

        {/* 六维度 */}
        {DIMENSIONS.map((dim, i) => {
          const score = result.scores[dim.key];
          const tier = result.tiers[dim.key];
          return (
            <section
              key={dim.key}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "16px",
                border: "2px solid rgba(179,218,83,0.3)",
                background: "var(--color-card)",
                animation: `cardIn 0.45s cubic-bezier(.34,1.3,.64,1) ${i * 0.08}s backwards`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                  {dim.name}
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      marginLeft: "0.5rem",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "6px",
                      background: "rgba(244,114,182,0.16)",
                      color: "var(--color-pink-dark)",
                    }}
                  >
                    {TIER_LABEL[tier]}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--color-green-dark)",
                  }}
                >
                  {score.toFixed(1)}
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {" "}
                    / 10
                  </span>
                </span>
              </div>

              {/* 进度条 */}
              <div
                style={{
                  height: "8px",
                  borderRadius: "4px",
                  background: "rgba(179,218,83,0.15)",
                  overflow: "hidden",
                  marginBottom: "0.625rem",
                }}
              >
                <div
                  style={{
                    width: `${(score / 10) * 100}%`,
                    height: "100%",
                    borderRadius: "4px",
                    background:
                      "linear-gradient(90deg, #E1FFC5, #FFD7ED, #FF99C3)",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                {dim.blurb}
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
                {DESCRIPTIONS[dim.key as DimKey][tier]}
              </p>
            </section>
          );
        })}

        {/* 组合触发：备注 */}
        {result.triggers.length > 0 && (
          <section
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.25rem",
              borderRadius: "16px",
              border: "2px dashed rgba(244,114,182,0.4)",
              background: "rgba(255,240,248,0.5)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-pink-dark)",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              备注
            </p>
            {result.triggers.map((line) => (
              <p
                key={line}
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  marginBottom: "0.5rem",
                }}
              >
                {line}
              </p>
            ))}
          </section>
        )}

        {/* Q44 原样放在最底 */}
        {q44 && (
          <section style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.5rem",
              }}
            >
              {q44.text}
            </p>
            {q44choice && (
              <p style={{ fontSize: "1rem", fontWeight: 600 }}>
                「{q44choice.label}」
              </p>
            )}
          </section>
        )}

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={restart}
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "12px",
              border: "2px solid rgba(179,218,83,0.5)",
              background: "var(--color-card)",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            🔄 重新测
          </button>
          <Link
            href="/collection"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "12px",
              border: "2px solid rgba(244,114,182,0.4)",
              background: "var(--color-card)",
              fontSize: "0.875rem",
            }}
          >
            🧺 回合集
          </Link>
        </div>
      </main>
    );
  }

  // ===== 答题页（一次一题）=====
  const part = PARTS[q.part];
  const selected = answers[q.id];

  return (
    <main
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "4.5rem 1.25rem 4rem",
        animation: "pageIn 0.5s ease",
      }}
    >
      {/* 顶部：返回 + 进度 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <Link
          href="/collection"
          style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}
        >
          ← 退出
        </Link>
        <span
          style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}
        >
          {index + 1} / {TOTAL_COUNT}
        </span>
      </div>

      {/* 进度条 */}
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          background: "rgba(179,218,83,0.15)",
          overflow: "hidden",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "3px",
            background: "linear-gradient(90deg, #E1FFC5, #FFD7ED, #FF99C3)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Part 标签 */}
      <p
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.05em",
          color: "var(--color-pink-dark)",
          fontWeight: 600,
          marginBottom: "0.25rem",
        }}
      >
        {part.title}
      </p>

      {/* 题干 */}
      <h2
        key={q.id}
        style={{
          fontSize: "1.1875rem",
          fontWeight: 700,
          lineHeight: 1.5,
          marginBottom: "1.25rem",
          animation: "cardIn 0.35s ease",
        }}
      >
        {q.text}
      </h2>

      {/* 选项：整屏铺开，所有选项一次可见 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {q.options.map((opt) => {
          const isSel = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => choose(q.id, opt.key)}
              style={{
                display: "flex",
                gap: "0.625rem",
                alignItems: "flex-start",
                textAlign: "left",
                padding: "0.875rem 1rem",
                borderRadius: "14px",
                border: `2px solid ${isSel ? "var(--color-pink)" : "rgba(179,218,83,0.3)"}`,
                background: isSel ? "rgba(255,215,237,0.35)" : "var(--color-card)",
                cursor: "pointer",
                fontSize: "0.9375rem",
                lineHeight: 1.55,
                transition: "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSel)
                  e.currentTarget.style.borderColor = "rgba(244,114,182,0.5)";
              }}
              onMouseLeave={(e) => {
                if (!isSel)
                  e.currentTarget.style.borderColor = "rgba(179,218,83,0.3)";
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  fontWeight: 700,
                  color: isSel ? "var(--color-pink-dark)" : "var(--color-green-dark)",
                }}
              >
                {opt.key}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* 底部：上一题 */}
      <div style={{ marginTop: "1.5rem" }}>
        {index > 0 && (
          <button
            onClick={() => setIndex((i) => i - 1)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.8125rem",
              color: "var(--color-text-secondary)",
            }}
          >
            ← 上一题
          </button>
        )}
      </div>
    </main>
  );
}
