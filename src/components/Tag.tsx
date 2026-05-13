interface TagProps {
  label: string;
  color?: "pink" | "green";
}

export default function Tag({ label, color = "pink" }: TagProps) {
  const styles =
    color === "pink"
      ? {
          background: "var(--color-pink-light)",
          color: "var(--color-pink-dark)",
        }
      : {
          background: "var(--color-green-light)",
          color: "var(--color-green-dark)",
        };

  return (
    <span
      style={{
        ...styles,
        padding: "0.15rem 0.5rem",
        borderRadius: "9999px",
        fontSize: "0.85rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
