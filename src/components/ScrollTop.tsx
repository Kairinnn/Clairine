"use client";

import { useState, useEffect } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="回顶o(*≧▽≦)"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "2.75rem",
        right: "1.5rem",
        zIndex: 100,
        width: "44px",
        height: "44px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease",
        filter: "drop-shadow(0 2px 6px rgba(255,173,209,0.25)) drop-shadow(0 1px 3px rgba(129,197,32,0.1))",
        padding: 0,
      }}
    >
      <img
        src="https://i.postimg.cc/FHCCfKQd/cake.png"
        alt="回顶"
        style={{
          width: "38px",
          height: "38px",
          objectFit: "contain",
          transition: "transform 0.25s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      />
    </button>
  );
}
