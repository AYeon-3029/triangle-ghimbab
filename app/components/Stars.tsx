export default function Stars({ value, size = 10 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "◐";
    return "☆";
  });
  return (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        display: "inline-flex",
        gap: 1,
        letterSpacing: 0.5,
      }}
    >
      {stars.join("")}
    </span>
  );
}
