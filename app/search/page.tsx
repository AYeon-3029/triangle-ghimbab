"use client";

export const dynamic = 'force-dynamic'

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../lib/supabase";
import type { Product } from "../lib/data";

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const results = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <SearchBar initialValue={q} />

      <main style={{ flex: 1, padding: "0 16px 80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "4px 0 8px",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.015em" }}>
            &ldquo;{q}&rdquo; 검색 결과
          </span>
          {!loading && (
            <span style={{ ...LABEL }}>{results.length}건</span>
          )}
        </div>

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

        {loading ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--mute)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            로딩 중...
          </div>
        ) : results.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--mute)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          results.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              rank={i + 1}
              maxReviews={Math.max(...results.map((p) => p.reviewCount))}
            />
          ))
        )}
      </main>
    </div>
  );
}
