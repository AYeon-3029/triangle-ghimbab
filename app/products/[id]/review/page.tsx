"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, StarHalf } from "lucide-react";
import { TAG_LABEL, type Tag, type Product, type User } from "../../../lib/data";
import { TAG_ICON } from "../../../lib/tag-icons";
import { fetchMe, fetchProducts, insertReview, uploadReviewImage } from "../../../lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const TAG_GROUPS: { group: string; items: Tag[] }[] = [
  { group: "맛",   items: ["Spicy", "Salty", "Sweety", "Mild", "Normal", "Fishy"] },
  { group: "식감", items: ["Heavy", "Dry", "Chewy"] },
  { group: "기타", items: ["withDrink", "withRamyeon"] },
];

const MONO: React.CSSProperties = { fontFamily: "var(--font-mono)" };
const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--line-soft)", margin: "16px 0" }} />;
}

export default function ReviewWritePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isBlank = id === "_";

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>(isBlank ? "" : id);
  const product = products.find((p) => p.id === selectedId);

  useEffect(() => {
    fetchMe().then(setUser);
    fetchProducts().then((data) => {
      setProducts(data);
      if (!isBlank && data.length > 0 && !data.some((p) => p.id === id)) {
        setSelectedId(data[0].id);
      }
    });
  }, [id, isBlank]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [body, setBody] = useState("");
  const [isPurchase, setIsPurchase] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  function ratingFromX(clientX: number): number {
    const el = starsRef.current;
    if (!el) return 0;
    const { left, width } = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - left, width));
    return Math.max(0.5, Math.min(5, Math.round((x / width) * 10) / 2));
  }

  if (!isBlank && !product && products.length > 0) {
    return <div style={{ padding: 32 }}>제품을 찾을 수 없습니다.</div>;
  }

  const displayRating = hoverRating || rating;

  function toggleTag(tag: Tag) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 5
        ? [...prev, tag]
        : prev
    );
  }

  async function handleSubmit() {
    if (!selectedId) {
      toast.error("제품을 선택해주세요.");
      return;
    }
    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    setSubmitting(true);
    let imageUrl: string | null = null;
    if (photos[0]) {
      imageUrl = await uploadReviewImage(photos[0]);
    }
    const result = await insertReview({
      productId: selectedId,
      rating,
      tags: selectedTags,
      comment: body.trim() || null,
      isPurchase: isPurchase ?? false,
      imageUrl,
    });
    setSubmitting(false);
    if (!result.ok) {
      toast.error("리뷰 제출에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    toast.success(user ? `${user.nickname} 닉네임으로 리뷰를 등록했습니다.` : "익명 리뷰를 등록했습니다.");
    router.back();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* 헤더 */}
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
          style={{ fontFamily: "var(--font-sans)", fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--mute)" }}
        >
          ✕ 취소
        </button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>리뷰 작성</span>
        <button
          onClick={handleSubmit}
          style={{ fontFamily: "var(--font-sans)", fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--accent)" }}
        >
          제출
        </button>
      </div>

      {/* 제품 선택 */}
      <DropdownMenu>
        <DropdownMenuTrigger
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderBottom: "1px solid var(--line-soft)",
            background: "var(--fill-2)",
            width: "100%",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--line-soft)",
              background: "var(--fill-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {product?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--mute)" }}>{product?.name[0] ?? "?"}</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={LABEL}>리뷰 작성 중 (탭하여 변경)</div>
            {product ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{product.name}</span>
                <span style={{ ...LABEL, fontSize: 10 }}>{product.price.toLocaleString()}원</span>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 2 }}>제품을 선택해주세요</div>
            )}
          </div>
          <span style={{ color: "var(--mute)", fontSize: 12 }}>▾</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}>
          {[...products].sort((a, b) => a.name.localeCompare(b.name, "ko")).map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: p.id === selectedId ? "var(--fill)" : undefined,
              }}
            >
              <div style={{ width: 28, height: 28, flexShrink: 0, border: "1px solid var(--line-soft)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--fill-2)" }}>
                {p.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)" }}>{p.name[0]}</span>
                }
              </div>
              <span style={{ flex: 1 }}>{p.name}</span>
              <span style={{ ...LABEL, fontSize: 10 }}>{p.price.toLocaleString()}원</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 폼 */}
      <div style={{ flex: 1, padding: "14px 16px 24px", overflowY: "auto" }}>

        {/* 1. 별점 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={LABEL}>별점 *</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 26, fontWeight: 600, ...MONO }}>
                {displayRating > 0 ? displayRating.toFixed(1) : "—"}
              </span>
              <span style={{ ...LABEL, fontSize: 11 }}>/ 5.0</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "12px 0 4px" }}>
          <div
            ref={starsRef}
            style={{ display: "flex", gap: 2, touchAction: "none" }}
            onTouchStart={(e) => setHoverRating(ratingFromX(e.touches[0].clientX))}
            onTouchMove={(e) => setHoverRating(ratingFromX(e.touches[0].clientX))}
            onTouchEnd={() => { if (hoverRating > 0) setRating(hoverRating); setHoverRating(0); }}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFull = displayRating >= star;
              const isHalf = !isFull && displayRating >= star - 0.5;
              return (
                <div key={star} style={{ position: "relative", width: 40, height: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", pointerEvents: "none" }}>
                    {isFull
                      ? <Star size={32} fill="var(--accent)" stroke="none" />
                      : isHalf
                      ? <div style={{ position: "relative", width: 32, height: 32 }}>
                          <Star size={32} fill="var(--line-soft)" stroke="none" style={{ position: "absolute", top: 0, left: 0 }} />
                          <StarHalf size={32} fill="var(--accent)" stroke="none" style={{ position: "absolute", top: 0, left: 0 }} />
                        </div>
                      : <Star size={32} fill="var(--line-soft)" stroke="none" />}
                  </div>
                  <button
                    onMouseEnter={() => setHoverRating(star - 0.5)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star - 0.5)}
                    style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", opacity: 0, cursor: "pointer", border: "none", background: "none" }}
                  />
                  <button
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", opacity: 0, cursor: "pointer", border: "none", background: "none" }}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </div>

        <Divider />

        {/* 2. 사진 */}
        <div>
          <div style={{ ...LABEL, marginBottom: 6 }}>사진 (선택, 최대 1장)</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            {photos[0] ? (
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(photos[0])}
                  alt=""
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid var(--line-soft)",
                    display: "block",
                  }}
                />
                <button
                  onClick={() => setPhotos([])}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    background: "var(--line)",
                    color: "var(--paper)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 80,
                  height: 80,
                  border: "1px dashed var(--line-soft)",
                  background: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 18, color: "var(--mute)", lineHeight: 1 }}>＋</span>
                <span style={LABEL}>사진 추가</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPhotos([f]);
              e.target.value = "";
            }}
          />
        </div>

        <Divider />

        {/* 3. 태그 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={LABEL}>태그 (선택, 최대 5개)</span>
            <span style={LABEL}>{selectedTags.length} / 5</span>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {TAG_GROUPS.map((g) => (
              <div key={g.group}>
                <div style={{ ...LABEL, marginBottom: 5 }}>{g.group}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {g.items.map((t) => {
                    const on = selectedTags.includes(t);
                    const Icon = TAG_ICON[t];
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTag(t)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 8px",
                          border: "1px solid var(--mute)",
                          background: on ? "var(--line)" : "var(--paper)",
                          color: on ? "var(--paper)" : "var(--mute)",
                          fontSize: 11,
                          cursor: "pointer",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        <Icon size={13} />
                        {on ? "✓ " : ""}{TAG_LABEL[t]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* 4. 본문 */}
        <div>
          <div style={{ ...LABEL, marginBottom: 6 }}>한 줄 평 (선택, 최대 200자)</div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 200))}
            placeholder="맛에 대한 평가, 맛있게 먹는 꿀팁 등 뭐든 좋아요!"
            style={{
              width: "100%",
              border: "1px solid var(--line-soft)",
              padding: 10,
              minHeight: 70,
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--ink)",
              background: "var(--paper)",
              resize: "none",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <span style={LABEL}>{body.length}/200</span>
          </div>
        </div>

        <Divider />

        {/* 5. 재구매 */}
        <div>
          <div style={{ ...LABEL, marginBottom: 6 }}>다시 살 의향이 있나요?</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => setIsPurchase(val)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: isPurchase === val ? "1px solid var(--accent)": "1px solid var(--line)",
                  background: isPurchase === val ? "var(--accent)" : "var(--paper)",
                  color: isPurchase === val ? "var(--paper)" : "var(--ink)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {val ? "네, 또 먹고 싶어요!" : "그 정도는 아니에요.."}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        <div style={{ color: "var(--mute)", fontSize: 12, lineHeight: 1.5 }}>
          {user ? `로그인 상태라 리뷰 작성자는 ${user.nickname}으로 표시됩니다.` : "로그인하지 않아도 리뷰 작성이 가능하며, 작성자는 익명으로 표시됩니다."}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid var(--line)",
          background: "var(--paper)",
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px 0",
            background: submitting ? "var(--fill)" : "var(--ink)",
            color: "var(--paper)",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-sans)",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "제출 중..." : "리뷰 제출하기"}
        </button>
      </div>
    </div>
  );
}
