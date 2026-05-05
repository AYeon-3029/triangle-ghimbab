import Link from "next/link";
import TierBadge from "./TierBadge";
import Stars from "./Stars";
import type { Product } from "../lib/data";

export type { Product } from "../lib/data";

type Props = {
  product: Product;
  rank: number;
  maxReviews: number;
};

export default function ProductCard({ product, rank, maxReviews }: Props) {
  const pickPct = Math.round((product.reviewCount / maxReviews) * 100);
  const isTop3 = rank <= 3;

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "20px 28px 1fr 70px 56px",
          gap: 8,
          alignItems: "center",
          padding: "8px 0",
          borderBottom: "1px solid var(--line-soft)",
        }}
      >
        {/* 순위 */}
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: isTop3 ? "var(--accent)" : "var(--mute)",
          }}
        >
          {String(rank).padStart(2, "0")}
        </span>

        {/* 티어 배지 */}
        <TierBadge tier={product.tier} />

        {/* 제품 정보 */}
        <div style={{ minWidth: 0, display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              border: "1px solid var(--line-soft)",
              background: "var(--fill-2)",
            }}
          >
            {product.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.name}
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
              {product.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: "var(--mute)",
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 픽률 */}
        <div>
          <div style={{ height: 4, background: "var(--fill)", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${pickPct}%`,
                background: "var(--line)",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 3,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              color: "var(--mute)",
            }}
          >
            {product.reviewCount.toLocaleString()}
          </div>
        </div>

        {/* 평점 */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{product.rating.toFixed(1)}</div>
          <div style={{ marginTop: 2 }}>
            <Stars value={product.rating} size={9} />
          </div>
        </div>
      </div>
    </Link>
  );
}
