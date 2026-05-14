"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import AllergenFilter from "../components/AllergenFilter";
import ProductCard from "../components/ProductCard";
import { Switch } from "@/components/ui/switch";
import { sortAllergens, type Product, type Allergen } from "../lib/data";

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const initialAllergens = useMemo(() => {
    const raw = searchParams.get("allergens");
    return raw ? (raw.split(",").map((s) => s.trim()).filter(Boolean) as Allergen[]) : [];
  }, [searchParams]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allergenFilterOn, setAllergenFilterOn] = useState(initialAllergens.length > 0);
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(initialAllergens);

  useEffect(() => {
    sessionStorage.setItem("allergen_filter_on", String(allergenFilterOn));
    sessionStorage.setItem("allergen_selected", JSON.stringify(selectedAllergens));
  }, [allergenFilterOn, selectedAllergens]);

  useEffect(() => {
    setLoading(true);
    const url = q.trim() ? `/api/products?q=${encodeURIComponent(q.trim())}` : "/api/products";
    fetch(url)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, [q]);

  const allAllergens = useMemo(() => {
    const set = new Set<Allergen>();
    products.forEach((p) => p.allergens.forEach((a) => set.add(a)));
    return sortAllergens(Array.from(set));
  }, [products]);

  const results = products.filter((product) => {
    if (selectedAllergens.length > 0 && selectedAllergens.some((a) => product.allergens.includes(a))) return false;
    return true;
  });
  const maxReviews = results.length > 0 ? Math.max(...results.map((p) => p.reviewCount)) : 1;

  return (
    <>
      <div style={{ position: "sticky", top: 48, zIndex: 30, background: "var(--paper)" }}>
        <SearchBar
          initialValue={q}
          allergens={allergenFilterOn ? selectedAllergens : []}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0 8px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>&ldquo;{q}&rdquo; 검색 결과</span>
            {!loading && <span style={LABEL}>{results.length}건</span>}
          </div>
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

        <div style={{ display: "grid", gridTemplateColumns: "20px 28px 1fr 70px 56px", gap: 8, padding: "6px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <span style={LABEL}>#</span>
          <span style={LABEL}>티어</span>
          <span style={LABEL}>상품</span>
          <span style={LABEL}>리뷰</span>
          <span style={{ ...LABEL, textAlign: "right" }}>평점</span>
        </div>

        {loading ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--mute)", fontSize: 12 }}>불러오는 중...</div>
        ) : results.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--mute)", fontSize: 12 }}>검색 결과가 없습니다.</div>
        ) : (
          results.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} maxReviews={maxReviews} />
          ))
        )}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Suspense fallback={<div style={{ padding: 32, color: "var(--mute)" }}>검색 준비 중...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
