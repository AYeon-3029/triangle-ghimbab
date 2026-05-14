"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { toast } from "sonner";

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line-soft)",
  background: "var(--paper)",
  padding: "12px 10px",
  fontSize: 14,
  outline: "none",
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nickname, password }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok) {
      toast.error(data.error ?? "다시 시도해주세요.");
      return;
    }

    toast.success(mode === "login" ? "로그인했습니다." : "가입하고 로그인했습니다.");
    router.push("/community");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: 420, margin: "0 auto", padding: "36px 16px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 20px" }}>{mode === "login" ? "로그인" : "회원가입"}</h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="이메일" style={inputStyle} required />
          {mode === "register" && (
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" style={inputStyle} required />
          )}
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" style={inputStyle} required />
          <button
            disabled={submitting}
            style={{
              border: "none",
              background: submitting ? "var(--fill)" : "var(--ink)",
              color: "var(--paper)",
              padding: "12px 0",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ marginTop: 14, border: 0, background: "transparent", color: "var(--accent)", cursor: "pointer", padding: 0 }}
        >
          {mode === "login" ? "계정이 없으면 회원가입" : "이미 계정이 있으면 로그인"}
        </button>
      </main>
    </div>
  );
}
