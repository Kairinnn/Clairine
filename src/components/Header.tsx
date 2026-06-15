"use client";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 100,
        padding: "1rem 1.25rem",
      }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMenuToggle();
        }}
        aria-label="菜单"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          border: "2px solid rgba(222,255,163,0.55)",
          background: isMenuOpen
            ? "rgba(255,230,243,0.9)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: isMenuOpen
            ? "0 6px 20px rgba(251,168,215,0.3)"
            : "0 4px 12px rgba(251,168,215,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "box-shadow 0.3s ease, transform 0.35s cubic-bezier(.34,1.3,.64,1), background 0.3s ease",
          transform: isMenuOpen ? "scale(0.9) rotate(-8deg)" : "scale(1)",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          if (!isMenuOpen) {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(251,168,215,0.3)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isMenuOpen) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(251,168,215,0.15)";
          }
        }}
      >
        <img
          src="https://i.postimg.cc/Dwsg4DCr/mao-zhao.png"
          alt="菜单"
          style={{
            width: "24px",
            height: "24px",
            imageRendering: "pixelated",
            transition: "transform 0.35s cubic-bezier(.34,1.3,.64,1)",transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
            pointerEvents: "none",
          }}
        />
      </button>
    </header>
  );
}
