"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import ProductCard from "./components/ProductCard";
import TabBar from "./components/TabBar";
import { PRODUCTS } from "./lib/data";

const FILTER_TAGS = ["전체", "인기", "매운맛", "든든한", "가성비", "클래식", "고소한"];
const PERIOD_OPTS = ["주간", "월간", "전체"];

const LABEL: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

function PeriodToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        border: "1px solid var(--line)",
        flexShrink: 0,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9,
      }}
    >
      {PERIOD_OPTS.map((o, i) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            padding: "4px 7px",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
            background: o === value ? "var(--line)" : "transparent",
            color: o === value ? "var(--paper)" : "var(--ink)",
            border: "none",
            borderLeft: i > 0 ? "1px solid var(--line)" : undefined,
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [period, setPeriod] = useState("주간");
  const [activeFilter, setActiveFilter] = useState("전체");

  const filtered = PRODUCTS.filter((p) => {
    if (activeFilter === "전체" || activeFilter === "인기") return true;
    return p.tags.includes(activeFilter);
  });
  const sorted = [...filtered].sort((a, b) => b.rating - a.rating);
  const maxReviews = Math.max(...PRODUCTS.map((p) => p.reviewCount));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar right={<PeriodToggle value={period} onChange={setPeriod} />} />
      <SearchBar />
      <TagFilter items={FILTER_TAGS} value={activeFilter} onChange={setActiveFilter} />

      <main style={{ flex: 1, padding: "0 16px 80px" }}>
        {/* 섹션 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            margin: "4px 0 8px",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.015em" }}>
            이번 주 랭킹
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: "var(--mute)",
            }}
          >
            전체 ▸
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
        {sorted.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            rank={i + 1}
            maxReviews={maxReviews}
          />
        ))}
      </main>

      <TabBar />
    </div>
  );
}
