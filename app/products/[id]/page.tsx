"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TierBadge from "../../components/TierBadge";
import Stars from "../../components/Stars";
import { TAG_LABEL, type Tag, type Product } from "../../lib/data";
import { fetchProduct, fetchReviews, type ReviewRow } from "../../lib/supabase";

function formatDate(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "오늘";
  if (d < 7) return `${d}일 전`;
  if (d < 30) return `${Math.floor(d / 7)}주 전`;
  return `${Math.floor(d / 30)}달 전`;
}

function computeRepurchasePct(reviews: ReviewRow[]): number | null {
  if (reviews.length === 0) return null;
  const count = reviews.filter((r) => r.isPurchase).length;
  return Math.round((count / reviews.length) * 100);
}

function computeTagAggregate(reviews: ReviewRow[]): { tag: Tag; pct: number }[] {
  if (reviews.length === 0) return [];
  const counts: Partial<Record<Tag, number>> = {};
  for (const r of reviews)
    for (const t of (r.tags ?? []))
      counts[t] = (counts[t] ?? 0) + 1;
  return (Object.entries(counts) as [Tag, number][])
    .map(([tag, count]) => ({ tag, pct: Math.round((count / reviews.length) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);
}

const SORT_OPTS = ["최신", "별점↑", "별점↓"];

const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };
const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

function sortReviews(reviews: ReviewRow[], sort: string) {
  return [...reviews].sort((a, b) => {
    if (sort === "별점↑") return b.rating - a.rating;
    if (sort === "별점↓") return a.rating - b.rating;
    return 0;
  });
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("최신");

  useEffect(() => {
    fetchProduct(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
    fetchReviews(id).then(setReviews);
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--mute)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
        로딩 중...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--mute)" }}>제품을 찾을 수 없습니다.</p>
        <Link href="/" style={{ ...MONO, fontSize: 11, color: "var(--accent)", textDecoration: "none" }}>
          ← 돌아가기
        </Link>
      </div>
    );
  }

  const tagAggregate = computeTagAggregate(reviews);
  const repurchasePct = computeRepurchasePct(reviews);
  const sorted = sortReviews(reviews, sort);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 앱바 */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "var(--paper)",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 48,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{ ...MONO, fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--mute)" }}
        >
          ◂ 뒤로
        </button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>리뷰</span>
        <Link
          href={`/products/${id}/review`}
          style={{ ...MONO, fontSize: 11, color: "var(--accent)", textDecoration: "none" }}
        >
          ＋ 작성
        </Link>
      </div>

      <main style={{ flex: 1, paddingBottom: 80 }}>
        {/* 히어로 */}
        <div
          style={{
            padding: "20px 16px 12px",
            textAlign: "center",
            borderBottom: "1px solid var(--line-soft)",
          }}
        >
          <div
            style={{
              width: 160,
              height: 120,
              margin: "0 auto",
              border: "1px solid var(--line-soft)",
              background: "var(--fill-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, color: "var(--mute)" }}>
                {product.name[0]}
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <TierBadge tier={product.tier} />
            <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
              {product.name}
            </span>
            <span style={{ ...LABEL, fontSize: 11 }}>{product.price.toLocaleString()}원</span>
          </div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Stars value={product.avgRating} size={14} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{product.avgRating.toFixed(1)}</span>
            <span style={{ ...LABEL, fontSize: 11 }}>· 리뷰 {product.reviewCount.toLocaleString()}</span>
            {repurchasePct !== null && (
              <span style={{ ...LABEL, fontSize: 11 }}>· 재구매 {repurchasePct}%</span>
            )}
          </div>
        </div>

        {/* 키워드 집계 */}
        <div style={{ padding: "12px 16px" }}>
          <div style={LABEL}>이 제품의 키워드</div>
          <div style={{ display: "grid", gap: 5, marginTop: 8 }}>
            {tagAggregate.map((t) => (
              <div
                key={t.tag}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 36px",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 11 }}>#{TAG_LABEL[t.tag]}</span>
                <div style={{ height: 5, background: "var(--fill)", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${t.pct}%`,
                      background: "var(--line)",
                    }}
                  />
                </div>
                <span style={{ ...LABEL, textAlign: "right" }}>{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 정렬 바 */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          {SORT_OPTS.map((o, i) => (
            <button
              key={o}
              onClick={() => setSort(o)}
              style={{
                flex: 1,
                padding: "8px 0",
                textAlign: "center",
                textTransform: "uppercase",
                background: o === sort ? "var(--line)" : "transparent",
                color: o === sort ? "var(--paper)" : "var(--ink)",
                border: "none",
                borderLeft: i > 0 ? "1px solid var(--line-soft)" : undefined,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.04em",
              }}
            >
              {o}
            </button>
          ))}
        </div>

        {/* 리뷰 목록 */}
        <div style={{ padding: "0 16px 24px" }}>
          {sorted.map((r) => (
            <div
              key={r.id}
              style={{ padding: "14px 0", borderBottom: "1px solid var(--line-soft)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...MONO, fontSize: 10 }}>익명</span>
                <span style={LABEL}>{formatDate(r.createdAt)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Stars value={r.rating} size={11} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>{r.rating.toFixed(1)}</span>
                {r.isPurchase && (
                  <span style={{ ...MONO, fontSize: 9, color: "var(--accent)", border: "1px solid var(--accent)", padding: "1px 4px" }}>재구매</span>
                )}
              </div>
              {r.tags.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {r.tags.map((t) => (
                    <span key={t} style={{ ...LABEL, fontSize: 10 }}>#{TAG_LABEL[t]}</span>
                  ))}
                </div>
              )}
              {r.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.imageUrl}
                  alt=""
                  style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, border: "1px solid var(--line-soft)", display: "block" }}
                />
              )}
              {r.comment && (
                <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>{r.comment}</div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
