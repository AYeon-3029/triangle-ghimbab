"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import AllergenFilter from "./components/AllergenFilter";
import ProductCard from "./components/ProductCard";
import { Switch } from "@/components/ui/switch";
import { TAG_LABEL, type Tag, type Product } from "./lib/data";
import { TAG_ICON } from "./lib/tag-icons";
import { fetchProducts } from "./lib/supabase";

const FILTER_TAGS = [
  { value: "전체" as Tag | "전체", label: "전체", Icon: undefined },
  ...(Object.entries(TAG_LABEL) as [Tag, string][]).map(([value, label]) => ({
    value,
    label,
    Icon: TAG_ICON[value],
  })),
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
  const [allergenFilterOn, setAllergenFilterOn] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("allergen_filter_on") === "true";
  });
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const s = sessionStorage.getItem("allergen_selected");
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => {
    sessionStorage.setItem("allergen_filter_on", String(allergenFilterOn));
    sessionStorage.setItem("allergen_selected", JSON.stringify(selectedAllergens));
  }, [allergenFilterOn, selectedAllergens]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const allAllergens = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.allergens.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [products]);

  const filtered = products.filter((p) => {
    if (activeFilter !== "전체" && !p.tags.includes(activeFilter as Tag)) return false;
    if (selectedAllergens.length > 0 && selectedAllergens.some((a) => p.allergens.includes(a))) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => b.avgRating - a.avgRating);
  const maxReviews = products.length > 0 ? Math.max(...products.map((p) => p.reviewCount)) : 1;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ position: "sticky", top: 48, zIndex: 30, background: "var(--paper)" }}>
        <SearchBar allergens={allergenFilterOn ? selectedAllergens : []} />
        <TagFilter
          items={FILTER_TAGS.map((f) => ({ label: f.label, Icon: f.Icon }))}
          value={FILTER_TAGS.find((f) => f.value === activeFilter)?.label ?? "전체"}
          onChange={(label) => {
            const found = FILTER_TAGS.find((f) => f.label === label);
            setActiveFilter(found?.value ?? "전체");
          }}
        />
        {allergenFilterOn && allAllergens.length > 0 && (
          <AllergenFilter
            items={allAllergens}
            selected={selectedAllergens}
            onChange={setSelectedAllergens}
          />
        )}
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
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...LABEL, fontFamily: "var(--font-sans)", fontSize: 10 }}>알레르기 필터</span>
            <Switch
              checked={allergenFilterOn}
              onCheckedChange={(v) => {
                setAllergenFilterOn(v);
                if (!v) setSelectedAllergens([]);
              }}
            />
          </div>
        </div>

        {/* 테이블 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20px 28px 1fr 50px 40px",
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
