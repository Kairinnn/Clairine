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
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 100,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "2px solid rgba(129,197,32,0.35)",
        background: "rgba(255,255,255,0.85)",
        color: "#81C520",
        fontSize: "1.1rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transform: show ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 12px rgba(129,197,32,0.1)",
      }}
    >
      ↑
    </button>
  );
}
