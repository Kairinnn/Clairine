"use client";

import { useRouter } from "next/navigation";

interface TopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["命令匣", "记录/文章", "合集"];

export default function TopTabs({ activeTab, onTabChange }: TopTabsProps) {
  const router = useRouter();

  const handleTab = (tab: string) => {
    if (tab === "命令匣") {
      router.push("/tools");
      return;
    }
    onTabChange(tab);
  };

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
            onClick={() => handleTab(tab)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem 1.25rem",
              fontSize: "1rem",
              fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab
                ? "var(--color-text-secondary)"
                : "var(--color-text)",
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
                  background: "var(--color-green-light-xl)",
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
                background: "rgba(255,255,255,0.4)",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
