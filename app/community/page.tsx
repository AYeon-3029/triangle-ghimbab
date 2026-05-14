"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import type { CommunityPost, User } from "../lib/data";
import { fetchMe, uploadCommunityImage } from "../lib/supabase";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetchMe().then((me) => {
      if (active) setUser(me);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      const res = await fetch(`/api/community${params}`);
      if (!active) return;
      setPosts(res.ok ? await res.json() : []);
      setLoading(false);
    }, 200);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const imageUrls: string[] = [];
    for (const file of photos) {
      const url = await uploadCommunityImage(file);
      if (url) imageUrls.push(url);
    }

    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, imageUrls }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      toast.error(data.error ?? "글 작성에 실패했습니다.");
      return;
    }

    setPosts((prev) => [data, ...prev]);
    setTitle("");
    setContent("");
    setPhotos([]);
    toast.success("커뮤니티에 글을 올렸습니다.");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700}}>커뮤니티</h1>
            <p style={{ margin: "6px 0 0", color: "var(--mute)" }}>삼각김밥 추천, 신상 정보, 조합 이야기를 나누는 공간</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--line)",
            padding: "8px 10px",
            background: "var(--paper)",
            marginBottom: 14,
          }}
        >
          <div style={{ position: "relative", width: 12, height: 12, flexShrink: 0, color: "var(--mute)" }}>
            <div style={{ width: 10, height: 10, border: "1.5px solid currentColor", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 6, height: 1.5, background: "currentColor", bottom: -2, right: -2, transform: "rotate(45deg)", transformOrigin: "right center" }} />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="게시글 검색"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 12,
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
            }}
          />
        </div>

        {user ? (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "14px 0", marginBottom: 18 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 80))} placeholder="제목" style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", padding: 10, outline: "none" }} required />
            <textarea value={content} onChange={(e) => setContent(e.target.value.slice(0, 600))} placeholder="내용" style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", padding: 10, minHeight: 90, resize: "vertical", outline: "none" }} required />

            {/* 사진 첨부 */}
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 6 }}>
                사진 (최대 3장)
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {photos.map((file, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      style={{ width: 64, height: 64, objectFit: "cover", border: "1px solid var(--line-soft)", display: "block" }}
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                      style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, background: "var(--line)", color: "var(--paper)", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{ width: 64, height: 64, border: "1px dashed var(--line-soft)", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer" }}
                  >
                    <span style={{ fontSize: 16, color: "var(--mute)", lineHeight: 1 }}>＋</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--mute)", letterSpacing: "0.05em" }}>사진 추가</span>
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPhotos((prev) => [...prev, file].slice(0, 3));
                  e.target.value = "";
                }}
              />
            </div>

            <button disabled={submitting} style={{ border: 0, background: "var(--ink)", color: "var(--paper)", padding: "10px 0", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "올리는 중..." : `${user.nickname}으로 글쓰기`}
            </button>
          </form>
        ) : (
          <div style={{ border: "1px solid var(--line-soft)", padding: 14, marginBottom: 18, background: "var(--paper)" }}>
            커뮤니티 글 작성은 로그인이 필요합니다. <Link href="/login" style={{ color: "var(--accent)" }}>로그인하기</Link>
          </div>
        )}

        {loading ? (
          <div style={{ color: "var(--mute)", padding: "24px 0" }}>불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div style={{ color: "var(--mute)", padding: "24px 0" }}>검색 결과가 없습니다.</div>
        ) : (
          <div style={{ display: "grid" }}>
            {posts.map((post) => (
              <article key={post.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <Link href={`/community/${post.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    <h2 style={{ margin: 0, fontSize: 17 }}>{post.title}</h2>
                  </Link>
                  <span style={{ color: "var(--mute)", fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(post.createdAt)}</span>
                </div>
                <div style={{ color: "var(--mute)", fontSize: 12, marginTop: 4 }}>{post.authorName}</div>
                <Link href={`/community/${post.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, margin: "10px 0 0" }}>
                    {post.content.length > 140 ? `${post.content.slice(0, 140)}...` : post.content}
                  </p>
                </Link>
                <div style={{ display: "flex", gap: 12, marginTop: 10, color: "var(--mute)", fontSize: 12 }}>
                  <span>좋아요 {post.likeCount}</span>
                  <span>댓글 {post.commentCount}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
