import { Star, StarHalf } from "lucide-react";

export default function Stars({ value, size = 10 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full";
    if (i === full && half) return "half";
    return "empty";
  });
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {stars.map((type, i) => {
        if (type === "full") return <Star key={i} size={size} fill="#000000" stroke="#000000" />;
        if (type === "half") return <StarHalf key={i} size={size} fill="#000000" stroke="#000000" />;
        return <Star key={i} size={size} fill="none" stroke="var(--bg)" />;
      })}
    </span>
  );
}
