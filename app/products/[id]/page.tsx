"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TierBadge from "../../components/TierBadge";
import Stars from "../../components/Stars";
import { TAG_LABEL, type Product, type Tag } from "../../lib/data";
import { fetchProduct, fetchReviews, type ReviewRow } from "../../lib/supabase";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

function computeRepurchasePct(reviews: ReviewRow[]): number | null {
  if (reviews.length === 0) return null;
  return Math.round((reviews.filter((r) => r.isPurchase).length / reviews.length) * 100);
}

function computeTagAggregate(reviews: ReviewRow[]): { tag: Tag; pct: number }[] {
  if (reviews.length === 0) return [];
  const counts: Partial<Record<Tag, number>> = {};
  for (const review of reviews) {
    for (const tag of review.tags ?? []) counts[tag] = (counts[tag] ?? 0) + 1;
  }
  return (Object.entries(counts) as [Tag, number][])
    .map(([tag, count]) => ({ tag, pct: Math.round((count / reviews.length) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);
}

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  color: "var(--mute)",
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    fetchProduct(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
    fetchReviews(id).then(setReviews);
  }, [id]);

  if (loading) return <div style={{ padding: 32, textAlign: "center", color: "var(--mute)" }}>불러오는 중...</div>;

  if (!product) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--mute)" }}>상품을 찾을 수 없습니다.</p>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>홈으로 돌아가기</Link>
      </div>
    );
  }

  const sorted = [...reviews].sort((a, b) => {
    if (sort === "high") return b.rating - a.rating;
    if (sort === "low") return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const tagAggregate = computeTagAggregate(reviews);
  const repurchasePct = computeRepurchasePct(reviews);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--paper)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 48 }}>
        <button onClick={() => router.back()} style={{ ...LABEL, border: 0, background: "transparent", cursor: "pointer" }}>뒤로</button>
        <span style={{ fontSize: 14, fontWeight: 700 }}>리뷰</span>
        <Link href={`/products/${id}/review`} style={{ ...LABEL, color: "var(--accent)", textDecoration: "none" }}>작성</Link>
      </header>

      <main style={{ paddingBottom: 80 }}>
        <section style={{ padding: "20px 16px 14px", borderBottom: "1px solid var(--line-soft)", textAlign: "center" }}>
          <div style={{ width: 160, height: 120, margin: "0 auto", border: "1px solid var(--line-soft)", background: "var(--fill-2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 32, color: "var(--mute)" }}>{product.name[0]}</span>
            )}
          </div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <TierBadge tier={product.tier} size={44} />
            <h1 style={{ margin: 0, fontSize: 22 }}>{product.name}</h1>
            <span style={LABEL}>{product.price.toLocaleString()}원</span>
          </div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
            <Stars value={product.avgRating} size={14} />
            <strong>{product.avgRating.toFixed(1)}</strong>
            <span style={LABEL}>리뷰 {product.reviewCount.toLocaleString()}</span>
            {repurchasePct !== null && <span style={LABEL}>재구매 {repurchasePct}%</span>}
          </div>
        </section>

        <section style={{ padding: "14px 16px", borderBottom: "1px solid var(--line-soft)" }}>
          <div style={LABEL}>이 상품의 키워드</div>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {tagAggregate.length === 0 ? (
              <div style={{ color: "var(--mute)", fontSize: 12 }}>아직 태그가 없습니다.</div>
            ) : tagAggregate.map((item) => (
              <div key={item.tag} style={{ display: "grid", gridTemplateColumns: "90px 1fr 40px", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12 }}>#{TAG_LABEL[item.tag]}</span>
                <div style={{ height: 5, background: "var(--fill)" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: "var(--line)" }} />
                </div>
                <span style={{ ...LABEL, textAlign: "right" }}>{item.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--line)" }}>
          <span style={{ fontSize: 12 }}>리뷰 {reviews.length}건</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", padding: "4px 8px", fontSize: 12 }}>
            <option value="latest">최신순</option>
            <option value="high">별점 높은순</option>
            <option value="low">별점 낮은순</option>
          </select>
        </section>

        <section style={{ padding: "0 16px 24px" }}>
          {sorted.map((review) => (
            <article key={review.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 12 }}>{review.authorName || "익명"}</strong>
                <span style={LABEL}>{formatDate(review.createdAt)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Stars value={review.rating} size={11} />
                <strong style={{ fontSize: 11 }}>{review.rating.toFixed(1)}</strong>
                {review.isPurchase && <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-auto border-[var(--accent)] text-[var(--accent)] rounded-none">재구매</Badge>}
              </div>
              {review.tags.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {review.tags.map((tag) => <span key={tag} style={LABEL}>#{TAG_LABEL[tag]}</span>)}
                </div>
              )}
              {review.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={review.imageUrl} alt="" style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, border: "1px solid var(--line-soft)", display: "block" }} />
              )}
              {review.comment && <p style={{ fontSize: 13, margin: "8px 0 0", lineHeight: 1.6 }}>{review.comment}</p>}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
