"use client";

interface TopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["工具", "记录/文章", "合集"];

export default function TopTabs({ activeTab, onTabChange }: TopTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.75rem 1.25rem",
        gap: "0",
      }}
    >
      {tabs.map((tab, i) => (
        <div key={tab} style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => onTabChange(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem 1.25rem",
              fontSize: "1rem",
              fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab
                ? "var(--color-pink)"
                : "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              position: "relative",
            }}
          >
            {tab}
            {activeTab === tab && (
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60%",
                  height: "2.5px",
                  borderRadius: "2px",
                  background: "var(--color-pink)",
                  transition: "all 0.3s ease",
                }}
              />
            )}
          </button>
          {i < tabs.length - 1 && (
            <div
              style={{
                width: "2px",
                height: "1rem",
                borderRadius: "1px",
                background: "rgba(255,171,215,0.4)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
