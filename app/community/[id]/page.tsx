"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { CommunityComment, CommunityPost, User } from "../../lib/data";
import { fetchMe } from "../../lib/supabase";
import { toast } from "sonner";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchMe(), fetch(`/api/community/${id}`)]).then(async ([me, postRes]) => {
      if (!active) return;
      setUser(me);
      setPost(postRes.ok ? await postRes.json() : null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleLike() {
    if (!user) {
      toast.error("좋아요는 로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setLiking(true);
    const res = await fetch(`/api/community/${id}/like`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLiking(false);

    if (!res.ok) {
      toast.error(data.error ?? "좋아요 처리에 실패했습니다.");
      return;
    }

    setPost((prev) => prev ? {
      ...prev,
      likeCount: data.likeCount,
      viewerHasLiked: data.viewerHasLiked,
    } : prev);
  }

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      toast.error("댓글 작성은 로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setSubmittingComment(true);
    const res = await fetch(`/api/community/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmittingComment(false);

    if (!res.ok) {
      toast.error(data.error ?? "댓글 작성에 실패했습니다.");
      return;
    }

    setPost((prev) => prev ? {
      ...prev,
      commentCount: prev.commentCount + 1,
      comments: [...prev.comments, data as CommunityComment],
    } : prev);
    setComment("");
    toast.success("댓글을 남겼습니다.");
  }

  if (loading) {
    return <div style={{ padding: 32, textAlign: "center", color: "var(--mute)" }}>불러오는 중...</div>;
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Navbar />
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px" }}>
          <p style={{ color: "var(--mute)" }}>게시글을 찾을 수 없습니다.</p>
          <Link href="/community" style={{ color: "var(--accent)", textDecoration: "none" }}>커뮤니티로 돌아가기</Link>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 80px" }}>
        <button onClick={() => router.back()} style={{ border: 0, background: "transparent", padding: 0, marginBottom: 18, color: "var(--mute)", cursor: "pointer" }}>
          뒤로
        </button>

        <article style={{ borderBottom: "1px solid var(--line)", paddingBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, lineHeight: 1.35 }}>{post.title}</h1>
              <div style={{ color: "var(--mute)", fontSize: 12, marginTop: 6 }}>{post.authorName} · {formatDate(post.createdAt)}</div>
            </div>
            <button
              onClick={handleLike}
              disabled={liking}
              aria-label="좋아요"
              title="좋아요"
              style={{
                border: "1px solid var(--line-soft)",
                background: post.viewerHasLiked ? "var(--ink)" : "var(--paper)",
                color: post.viewerHasLiked ? "var(--paper)" : "var(--ink)",
                width: 42,
                height: 42,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: liking ? "not-allowed" : "pointer",
              }}
            >
              <Heart size={18} fill={post.viewerHasLiked ? "currentColor" : "none"} />
            </button>
          </div>

          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, margin: "18px 0 0" }}>{post.content}</p>

          {post.imageUrls.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {post.imageUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" style={{ width: 120, height: 120, objectFit: "cover", border: "1px solid var(--line-soft)" }} />
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 16, color: "var(--mute)", fontSize: 12 }}>
            <span>좋아요 {post.likeCount}</span>
            <span>댓글 {post.commentCount}</span>
          </div>
        </article>

        <section style={{ paddingTop: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>댓글</h2>

          <form onSubmit={handleCommentSubmit} style={{ display: "grid", gap: 8, marginBottom: 18 }}>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value.slice(0, 300))}
              placeholder={user ? "댓글을 입력하세요" : "댓글은 로그인 후 작성할 수 있습니다"}
              disabled={!user}
              style={{ border: "1px solid var(--line-soft)", background: "var(--paper)", minHeight: 74, resize: "vertical", padding: 10, outline: "none" }}
              required
            />
            <button disabled={!user || submittingComment} style={{ border: 0, background: !user || submittingComment ? "var(--fill)" : "var(--ink)", color: "var(--paper)", padding: "10px 0", fontWeight: 700, cursor: !user || submittingComment ? "not-allowed" : "pointer" }}>
              {submittingComment ? "작성 중..." : "댓글 작성"}
            </button>
          </form>

          {post.comments.length === 0 ? (
            <div style={{ color: "var(--mute)", padding: "16px 0" }}>아직 댓글이 없습니다.</div>
          ) : (
            <div style={{ display: "grid" }}>
              {post.comments.map((item) => (
                <article key={item.id} style={{ borderTop: "1px solid var(--line-soft)", padding: "12px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <strong style={{ fontSize: 13 }}>{item.authorName}</strong>
                    <span style={{ color: "var(--mute)", fontSize: 12 }}>{formatDate(item.createdAt)}</span>
                  </div>
                  <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{item.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
