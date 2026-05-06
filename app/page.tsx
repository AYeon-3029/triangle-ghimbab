"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import ProductCard from "./components/ProductCard";
import { PRODUCTS } from "./lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FILTER_TAGS = ["전체", "매운맛", "든든한", "가성비", "클래식", "고소한"];

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

export default function HomePage() {
  const [period, setPeriod] = useState("주간");
  const [activeFilter, setActiveFilter] = useState("전체");

  const filtered = PRODUCTS.filter((p) => {
    if (activeFilter === "전체") return true;
    return p.tags.includes(activeFilter);
  });
  const sorted = [...filtered].sort((a, b) => b.rating - a.rating);
  const maxReviews = Math.max(...PRODUCTS.map((p) => p.reviewCount));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <SearchBar />
      <TagFilter items={FILTER_TAGS} value={activeFilter} onChange={setActiveFilter} />

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
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.015em" }}>
            삼각김밥 티어리스트
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--mute)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {period} ▾
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={period}
                onValueChange={(v) => v && setPeriod(v as string)}
              >
                <DropdownMenuRadioItem value="주간">주간</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="월간">월간</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="전체">전체</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </div>
  );
}
