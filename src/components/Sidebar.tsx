"use client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onCategorySelect,
}: SidebarProps) {
  const handleCategoryClick = (cat: string | null) => {
    onCategorySelect(cat);
    onClose();
  };

  return (
    <>
      {/* ========= 🩷毛玻璃遮罩 ========= */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          backgroundColor: "rgba(255,240,248,0.4)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ========= 🩷侧边栏本体 ========= */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "min(260px, 65vw)",
          height: "100dvh",
          zIndex: 200,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,245,250,0.96) 100%)",
          borderRight: "2px solid rgba(222,255,163,0.4)",
          boxShadow: isOpen
            ? "4px 0 24px rgba(251,168,215,0.15)"
            : "none",
          boxSizing: "border-box",
          padding: "2rem 1.25rem",
          overflowY: "auto",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s cubic-bezier(.34,1.3,.64,1), box-shadow 0.3s ease",
        }}
      >
        {/* ========= 🩷头像区 ========= */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              marginBottom: "0.625rem",
            }}
          >
            <img
              src="https://i.postimg.cc/WbP0Vvr5/IMG-20260511-074333.png"
              alt="头像"
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "50%",
                objectFit: "cover",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
             }}
           />
          </div>

          <span style={{ fontSize: "1rem", fontWeight: 700 }}>小灰</span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              marginTop: "2px",
            }}
          >
            Ring Our Love.⊹⁺˚
          </span>
        </div>

        {/* ========= 🩷虚线分隔 ========= */}
        <div
          style={{
            borderTop: "2px dashed rgba(179,218,83,0.4)",
            margin: "0.5rem 0 0.75rem",
          }}
        />

        {/* ========= 🩷导航列表 ========= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <SidebarItem
            icon="https://i.postimg.cc/C1MHtKwQ/cao-mei.png"
            label="全部"
            active={activeCategory === null}
            onClick={() => handleCategoryClick(null)}
          />
          {categories.map((cat) => (
            <SidebarItem
              key={cat}
              icon="https://i.postimg.cc/Dwsg4DCr/mao-zhao.png"
              label={cat}
              active={activeCategory === cat}
              onClick={() => handleCategoryClick(cat)}
            />
          ))}
        </div>

        {/* ========= 🩷底部 ========= */}
        <div
          style={{
            borderTop: "2px dashed rgba(179,218,83,0.4)",
            marginTop: "1.5rem",
            paddingTop: "0.875rem",
            textAlign: "center",
            fontSize: "0.6875rem",
            color: "var(--color-text-secondary)",
            opacity: 0.6,
          }}
        >
          ☘️ Kairin's Nest
        </div>
      </nav>
    </>
  );
}

/* ========= 🩷侧边栏按钮小组件 ========= */
function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        padding: "0.625rem 0.75rem",
        borderRadius: "10px",
        border: "none",
        background: active
          ? "linear-gradient(90deg, rgba(225,255,197,0.5), rgba(255,215,237,0.3))"
          : "transparent",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: active ? 600 : 400,
        color: "var(--color-text)",
        transition: "all 0.2s ease",
        textAlign: "left",
        width: "100%",
      }}
    >
      <img
        src={icon}
        alt=""

        style={{ width: "18px", height: "18px", imageRendering: "pixelated" }}
      />
      {label}
    </button>
  );
}
