"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import type { CommunityPost, User } from "../lib/data";
import { fetchMe } from "../lib/supabase";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchMe(), fetch("/api/community")]).then(async ([me, postRes]) => {
      if (!active) return;
      setUser(me);
      setPosts(postRes.ok ? await postRes.json() : []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
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
    toast.success("커뮤니티에 글을 올렸습니다.");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>커뮤니티</h1>
            <p style={{ margin: "6px 0 0", color: "var(--mute)" }}>삼각김밥 추천, 신상 제보, 조합 이야기를 나누는 공간</p>
          </div>
          <Link href="/products/_/review" style={{ color: "var(--accent)", textDecoration: "none", whiteSpace: "nowrap" }}>리뷰 쓰기</Link>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "14px 0", marginBottom: 18 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 80))} placeholder="제목" style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", padding: 10, outline: "none" }} required />
            <textarea value={content} onChange={(e) => setContent(e.target.value.slice(0, 600))} placeholder="내용" style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", padding: 10, minHeight: 90, resize: "vertical", outline: "none" }} required />
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
          <div style={{ color: "var(--mute)", padding: "24px 0" }}>아직 커뮤니티 글이 없습니다.</div>
        ) : (
          <div style={{ display: "grid" }}>
            {posts.map((post) => (
              <article key={post.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 17 }}>{post.title}</h2>
                  <span style={{ color: "var(--mute)", fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(post.createdAt)}</span>
                </div>
                <div style={{ color: "var(--mute)", fontSize: 12, marginTop: 4 }}>{post.authorName}</div>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, margin: "10px 0 0" }}>{post.content}</p>
                {post.imageUrls.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {post.imageUrls.map((url) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={url}
                        src={url}
                        alt=""
                        style={{ width: 88, height: 88, objectFit: "cover", border: "1px solid var(--line-soft)" }}
                      />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
