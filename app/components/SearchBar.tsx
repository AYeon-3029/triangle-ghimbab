"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  placeholder = "삼각김밥 이름·재료 검색",
}: {
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: "10px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--line)",
          padding: "8px 10px",
          background: "var(--paper)",
        }}
      >
        {/* 돋보기 아이콘 */}
        <div
          style={{
            position: "relative",
            width: 12,
            height: 12,
            flexShrink: 0,
            color: "var(--mute)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              border: "1.5px solid currentColor",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 6,
              height: 1.5,
              background: "currentColor",
              bottom: -2,
              right: -2,
              transform: "rotate(45deg)",
              transformOrigin: "right center",
            }}
          />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 12,
            color: "var(--ink)",
            fontFamily: "'IBM Plex Sans KR', sans-serif",
          }}
        />
      </div>
    </form>
  );
}
