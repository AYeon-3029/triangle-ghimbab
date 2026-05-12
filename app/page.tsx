"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import ProductCard from "./components/ProductCard";
import { TAG_LABEL, type Tag, type Product } from "./lib/data";
import { fetchProducts } from "./lib/supabase";

const FILTER_TAGS: Array<{ value: Tag | "전체"; label: string }> = [
  { value: "전체", label: "전체" },
  ...(Object.entries(TAG_LABEL) as [Tag, string][]).map(([value, label]) => ({ value, label })),
];

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<Tag | "전체">("전체");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    if (activeFilter === "전체") return true;
    return p.tags.includes(activeFilter as Tag);
  });
  const sorted = [...filtered].sort((a, b) => b.avgRating - a.avgRating);
  const maxReviews = products.length > 0 ? Math.max(...products.map((p) => p.reviewCount)) : 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ position: "sticky", top: 48, zIndex: 30, background: "var(--paper)" }}>
        <SearchBar />
        <TagFilter
        items={FILTER_TAGS.map((f) => f.label)}
        value={FILTER_TAGS.find((f) => f.value === activeFilter)?.label ?? "전체"}
        onChange={(label) => {
          const found = FILTER_TAGS.find((f) => f.label === label);
          setActiveFilter(found?.value ?? "전체");
        }}
      />
      </div>

      <main style={{ flex: 1, padding: "0 16px 80px" }}>
        {/* 섹션 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "4px 0 8px",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>
            삼각김밥 티어리스트
          </span>
        </div>

        {/* 테이블 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20px 28px 1fr 70px 56px",
            gap: 8,
            padding: "6px 0",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <span style={LABEL}>#</span>
          <span style={LABEL}>티어</span>
          <span style={LABEL}>제품</span>
          <span style={LABEL}>픽률</span>
          <span style={{ ...LABEL, textAlign: "right" }}>평점</span>
        </div>

        {/* 랭킹 행 */}
        {loading ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--mute)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            로딩 중...
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--mute)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            제품이 없습니다.
          </div>
        ) : (
          sorted.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              rank={i + 1}
              maxReviews={maxReviews}
            />
          ))
        )}
      </main>
    </div>
  );
}
