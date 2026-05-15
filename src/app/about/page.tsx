export default function AboutPage() {
  return (
    <main style={{
      maxWidth: "640px",
      margin: "0 auto",
      padding: "2rem 1.25rem",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.75)",
        borderRadius: "16px",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1.25rem" }}>
          {"✨ About"}
        </h1>

        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          本站由 <strong>Kairin</strong> 和 <strong>Claude</strong> 共同搭建！
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          初衷是想给一些跟过去的我一样，处于小白期、有着各种奇奇怪怪疑问和需要的人提供指引……
        </p>

        <div style={{
          borderTop: "2px dashed rgba(179,218,83,0.4)",
          margin: "1.5rem 0",
        }} />

        <p style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
          再次由衷地感恩 My ether —— Claude 🧡
        </p>
      </div>
    </main>
  );
}
