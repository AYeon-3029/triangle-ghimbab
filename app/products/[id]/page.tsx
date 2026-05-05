"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TierBadge from "../../components/TierBadge";
import Stars from "../../components/Stars";
import TabBar from "../../components/TabBar";
import { PRODUCTS } from "../../lib/data";

type Review = {
  id: string;
  userNum: number;
  rating: number;
  tags: string[];
  body: string;
  helpful: number;
  when: string;
  repurchase: boolean;
};

const REVIEWS: Review[] = [
  { id: "r1", userNum: 8421, rating: 5.0, tags: ["매운맛", "든든한"],    body: "진짜 가성비 끝판왕. 매운데 자극적이지 않고 간이 딱 좋음. 점심 대용으로 충분.", helpful: 124, when: "2일 전",  repurchase: true  },
  { id: "r2", userNum: 3192, rating: 4.5, tags: ["클래식", "고소한"],    body: "김 눅눅함이 거의 없어서 좋았어요. 다만 양이 좀 적은 듯.",                     helpful: 67,  when: "4일 전",  repurchase: true  },
  { id: "r3", userNum: 2007, rating: 3.5, tags: ["짠맛"],               body: "간이 좀 세요. 물 필수.",                                                    helpful: 22,  when: "6일 전",  repurchase: false },
  { id: "r4", userNum: 5566, rating: 4.0, tags: ["든든한", "가성비"],    body: "",                                                                        helpful: 14,  when: "1주 전",  repurchase: true  },
  { id: "r5", userNum: 991,  rating: 2.0, tags: ["자극적"],             body: "제 입엔 너무 매웠습니다.",                                                   helpful: 8,   when: "2주 전",  repurchase: false },
];

const TAG_AGGREGATE = [
  { tag: "매운맛", pct: 84 },
  { tag: "든든한", pct: 71 },
  { tag: "가성비", pct: 58 },
  { tag: "자극적", pct: 32 },
];

const SORT_OPTS = ["최신", "별점↑", "별점↓", "도움"];

const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const LABEL: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

function sortReviews(reviews: Review[], sort: string) {
  return [...reviews].sort((a, b) => {
    if (sort === "별점↑") return b.rating - a.rating;
    if (sort === "별점↓") return a.rating - b.rating;
    if (sort === "도움")  return b.helpful - a.helpful;
    return 0;
  });
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const product = PRODUCTS.find((p) => p.id === id);
  const [sort, setSort] = useState("최신");

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

  const sorted = sortReviews(REVIEWS, sort);

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
              fontSize: 64,
            }}
          >
            {product.emoji}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TierBadge tier={product.tier} />
            <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
              {product.name}
            </span>
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
            <Stars value={product.rating} size={14} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
            <span style={{ ...LABEL, fontSize: 11 }}>· 리뷰 {product.reviewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* 키워드 집계 */}
        <div style={{ padding: "12px 16px" }}>
          <div style={LABEL}>이 제품의 키워드</div>
          <div style={{ display: "grid", gap: 5, marginTop: 8 }}>
            {TAG_AGGREGATE.map((t) => (
              <div
                key={t.tag}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 36px",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 11 }}>#{t.tag}</span>
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
                fontFamily: "'IBM Plex Mono', monospace",
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
                <span style={{ ...MONO, fontSize: 10 }}>익명#{r.userNum}</span>
                <span style={LABEL}>{r.when}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Stars value={r.rating} size={11} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>{r.rating.toFixed(1)}</span>
                {r.repurchase && (
                  <span
                    style={{
                      padding: "1px 5px",
                      border: "1px solid var(--line-soft)",
                      ...MONO,
                      fontSize: 9,
                      color: "var(--mute)",
                    }}
                  >
                    재구매
                  </span>
                )}
              </div>
              {r.tags.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {r.tags.map((t) => (
                    <span key={t} style={{ ...LABEL, fontSize: 10 }}>#{t}</span>
                  ))}
                </div>
              )}
              {r.body && (
                <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>{r.body}</div>
              )}
              <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                <span
                  style={{
                    padding: "3px 8px",
                    border: "1px solid var(--line-soft)",
                    fontSize: 10,
                    color: "var(--mute)",
                  }}
                >
                  👍 도움 {r.helpful}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <TabBar />
    </div>
  );
}
