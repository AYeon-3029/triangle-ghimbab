"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { fetchMe, logout } from "../lib/supabase";
import type { User } from "../lib/data";

export default function Navbar({ right }: { right?: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchMe().then(setUser);
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  const navLink: React.CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: 11,
    color: "var(--mute)",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <header
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
        height: 52,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", flexShrink: 0 }}>
        <Image src="/logo.png" alt="삼각편대" width={45} height={45} style={{ objectFit: "contain" }} />
        <span style={{ fontWeight: 700, fontSize: 17, color: "var(--ink)", marginTop: 5 }}>삼각편대</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/community" style={navLink}>커뮤니티</Link>
        {user ? (
          <>
            <span style={{ ...navLink, color: "var(--ink)" }}>{user.nickname}</span>
            <button onClick={handleLogout} style={{ ...navLink, border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>
              로그아웃
            </button>
          </>
        ) : (
          <Link href="/login" style={navLink}>로그인</Link>
        )}
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSfVXJyGy1t7MJv4pgHsI4Iv__ICUiiRz9mtCYThLwlC2LDXPQ/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            color: "var(--mute)",
            textDecoration: "none",
          }}
        >
          피드백
        </Link>
        {right ?? (
          <Link href="/products/_/review" style={{ ...navLink, color: "var(--accent)" }}>
            리뷰 작성
          </Link>
        )}
      </div>
    </header>
  );
}
