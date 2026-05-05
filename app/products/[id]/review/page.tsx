"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { PRODUCTS } from "../../../lib/data";

const TAG_GROUPS = [
  { group: "맛",       items: ["매운맛", "짠맛", "단맛", "고소한", "담백한"] },
  { group: "식감",     items: ["든든한", "촉촉한", "바삭", "쫄깃"] },
  { group: "가격",     items: ["가성비", "가격대비아쉬움"] },
  { group: "식사 적합", items: ["아침", "점심", "야식", "술안주"] },
];

const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const LABEL: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--mute)",
};

export default function ReviewWritePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const product = PRODUCTS.find((p) => p.id === id);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [repurchase, setRepurchase] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!product) {
    return <div style={{ padding: 32 }}>제품을 찾을 수 없습니다.</div>;
  }

  const displayRating = hoverRating || rating;

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 5
        ? [...prev, tag]
        : prev
    );
  }

  function handleSubmit() {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    alert("리뷰가 제출되었습니다! (Supabase 연결 후 실제 저장 예정)");
    router.back();
  }

  const Divider = () => (
    <hr style={{ border: "none", borderTop: "1px solid var(--line-soft)", margin: "16px 0" }} />
  );

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
          style={{ ...MONO, fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--mute)" }}
        >
          ✕ 취소
        </button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>리뷰 작성</span>
        <button
          onClick={handleSubmit}
          style={{ ...MONO, fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "var(--accent)" }}
        >
          제출
        </button>
      </div>

      {/* 제품 미니 카드 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderBottom: "1px solid var(--line-soft)",
          background: "var(--fill-2)",
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
            fontSize: 24,
          }}
        >
          {product.emoji}
        </div>
        <div>
          <div style={LABEL}>리뷰 작성 중</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{product.name}</div>
        </div>
      </div>

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
          <div style={{ display: "flex", gap: 4, margin: "12px 0 4px", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                style={{
                  fontSize: 36,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: star <= displayRating ? "var(--accent)" : "var(--fill)",
                  padding: "0 2px",
                  lineHeight: 1,
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* 2. 사진 */}
        <div>
          <div style={{ ...LABEL, marginBottom: 6 }}>사진 (선택, 최대 2장)</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            {[0, 1].map((i) => {
              const file = photos[i];
              return file ? (
                <div key={i} style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
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
                    onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
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
                  key={i}
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
              );
            })}
            <span style={{ ...LABEL, paddingBottom: 4 }}>{photos.length}/2</span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && photos.length < 2) setPhotos((prev) => [...prev, f]);
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
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTag(t)}
                        style={{
                          padding: "3px 8px",
                          border: "1px solid var(--line)",
                          background: on ? "var(--line)" : "var(--paper)",
                          color: on ? "var(--paper)" : "var(--ink)",
                          fontSize: 11,
                          cursor: "pointer",
                          fontFamily: "'IBM Plex Sans KR', sans-serif",
                        }}
                      >
                        {on ? "✓ " : ""}{t}
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
            placeholder="솔직한 후기를 남겨주세요"
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
                onClick={() => setRepurchase(val)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "1px solid var(--line)",
                  background: repurchase === val ? "var(--line)" : "var(--paper)",
                  color: repurchase === val ? "var(--paper)" : "var(--ink)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans KR', sans-serif",
                }}
              >
                {val ? "예 다시 살래요" : "아니요"}
              </button>
            ))}
          </div>
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
          style={{
            width: "100%",
            padding: "12px 0",
            background: "var(--line)",
            color: "var(--paper)",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'IBM Plex Sans KR', sans-serif",
            cursor: "pointer",
          }}
        >
          리뷰 제출하기
        </button>
      </div>
    </div>
  );
}
