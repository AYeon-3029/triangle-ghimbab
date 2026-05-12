"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, StarHalf } from "lucide-react";
import { TAG_LABEL, type Product, type Tag, type User } from "../../../lib/data";
import { fetchMe, fetchProducts, insertReview, uploadReviewImage } from "../../../lib/supabase";
import { toast } from "sonner";

const TAG_GROUPS: { group: string; items: Tag[] }[] = [
  { group: "맛", items: ["Spicy", "Salty", "Sweety", "Mild", "Normal", "Fishy"] },
  { group: "식감", items: ["Heavy", "Dry", "Chewy"] },
  { group: "조합", items: ["withDrink", "withRamyeon"] },
];

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  color: "var(--mute)",
};

export default function ReviewWritePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isBlank = id === "_";
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState(isBlank ? "" : id);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [body, setBody] = useState("");
  const [isPurchase, setIsPurchase] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const product = products.find((p) => p.id === selectedId);
  const displayRating = hoverRating || rating;

  useEffect(() => {
    fetchMe().then(setUser);
    fetchProducts().then((data) => {
      setProducts(data);
      if (!isBlank && data.length > 0 && !data.some((p) => p.id === id)) setSelectedId(data[0].id);
    });
  }, [id, isBlank]);

  function toggleTag(tag: Tag) {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((item) => item !== tag);
      if (prev.length >= 5) return prev;
      return [...prev, tag];
    });
  }

  async function handleSubmit() {
    if (!selectedId) {
      toast.error("상품을 선택해주세요.");
      return;
    }
    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    setSubmitting(true);
    let imageUrl: string | null = null;
    if (photos[0]) imageUrl = await uploadReviewImage(photos[0]);
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
    router.push(`/products/${selectedId}`);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--paper)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 48 }}>
        <button onClick={() => router.back()} style={{ ...LABEL, background: "transparent", border: 0, cursor: "pointer" }}>취소</button>
        <span style={{ fontSize: 14, fontWeight: 700 }}>리뷰 작성</span>
        <button onClick={handleSubmit} disabled={submitting} style={{ ...LABEL, color: "var(--accent)", background: "transparent", border: 0, cursor: submitting ? "not-allowed" : "pointer" }}>
          제출
        </button>
      </header>

      <main style={{ flex: 1, padding: "14px 16px 24px", display: "grid", gap: 18 }}>
        <section>
          <label style={LABEL}>상품 선택</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={{ marginTop: 6, width: "100%", border: "1px solid var(--line-soft)", background: "var(--paper)", padding: 10, fontSize: 13 }}>
            <option value="">상품을 선택해주세요</option>
            {products.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.price.toLocaleString()}원</option>)}
          </select>
          {product && <div style={{ marginTop: 6, color: "var(--mute)", fontSize: 12 }}>{product.name}에 리뷰를 남깁니다.</div>}
        </section>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={LABEL}>별점 *</span>
            <strong style={{ fontSize: 24 }}>{displayRating > 0 ? displayRating.toFixed(1) : "0.0"}</strong>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 10, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const isFull = displayRating >= star;
              const isHalf = !isFull && displayRating >= star - 0.5;
              return (
                <div key={star} style={{ position: "relative", width: 40, height: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", pointerEvents: "none" }}>
                    {isFull ? <Star size={32} fill="var(--accent)" stroke="none" /> : isHalf ? (
                      <div style={{ position: "relative", width: 32, height: 32 }}>
                        <Star size={32} fill="var(--line-soft)" stroke="none" style={{ position: "absolute", top: 0, left: 0 }} />
                        <StarHalf size={32} fill="var(--accent)" stroke="none" style={{ position: "absolute", top: 0, left: 0 }} />
                      </div>
                    ) : <Star size={32} fill="var(--line-soft)" stroke="none" />}
                  </div>
                  <button onMouseEnter={() => setHoverRating(star - 0.5)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star - 0.5)} style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", opacity: 0, cursor: "pointer", border: 0 }} />
                  <button onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)} style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", opacity: 0, cursor: "pointer", border: 0 }} />
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div style={LABEL}>사진 선택, 최대 1장</div>
          {photos[0] ? (
            <div style={{ marginTop: 8, display: "flex", alignItems: "end", gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(photos[0])} alt="" style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid var(--line-soft)" }} />
              <button onClick={() => setPhotos([])} style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", padding: "6px 10px", cursor: "pointer" }}>삭제</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{ marginTop: 8, width: 88, height: 80, border: "1px dashed var(--line-soft)", background: "transparent", cursor: "pointer" }}>사진 추가</button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPhotos([file]);
            e.target.value = "";
          }} />
        </section>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={LABEL}>태그, 최대 5개</span>
            <span style={LABEL}>{selectedTags.length} / 5</span>
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {TAG_GROUPS.map((group) => (
              <div key={group.group}>
                <div style={{ ...LABEL, marginBottom: 5 }}>{group.group}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {group.items.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "5px 9px", border: "1px solid var(--line)", background: active ? "var(--line)" : "var(--paper)", color: active ? "var(--paper)" : "var(--ink)", fontSize: 12, cursor: "pointer" }}>
                        {TAG_LABEL[tag]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div style={LABEL}>한줄평, 선택</div>
          <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, 200))} placeholder="맛, 양, 조합을 자유롭게 남겨주세요." style={{ marginTop: 6, width: "100%", border: "1px solid var(--line-soft)", padding: 10, minHeight: 80, background: "var(--paper)", resize: "vertical", outline: "none" }} />
          <div style={{ textAlign: "right", ...LABEL }}>{body.length}/200</div>
        </section>

        <section>
          <div style={LABEL}>다시 사 먹을 의향이 있나요?</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {[true, false].map((value) => (
              <button key={String(value)} onClick={() => setIsPurchase(value)} style={{ flex: 1, padding: "10px 0", border: isPurchase === value ? "1px solid var(--accent)" : "1px solid var(--line)", background: isPurchase === value ? "var(--accent)" : "var(--paper)", color: isPurchase === value ? "var(--paper)" : "var(--ink)", cursor: "pointer" }}>
                {value ? "네, 또 먹을래요" : "아니요"}
              </button>
            ))}
          </div>
        </section>

        <section style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 14, color: "var(--mute)", fontSize: 12 }}>
          {user ? `로그인 상태라 리뷰 작성자는 ${user.nickname}으로 표시됩니다.` : "로그인하지 않아도 리뷰 작성이 가능하며, 작성자는 익명으로 표시됩니다."}
        </section>
      </main>

      <div style={{ padding: 12, borderTop: "1px solid var(--line)", background: "var(--paper)" }}>
        <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", padding: "12px 0", background: submitting ? "var(--fill-2)" : "var(--ink)", color: submitting ? "var(--line-soft)" : "var(--paper)", border: 0, fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
          {submitting ? "제출 중..." : "리뷰 제출하기"}
        </button>
      </div>
    </div>
  );
}
