import Link from "next/link";
import type { ReactNode } from "react";

export default function Navbar({ right }: { right?: ReactNode }) {
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
        height: 48,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          ▲
        </div>
        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          삼각편대
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {right ?? (
          <Link
            href="/login"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: "var(--mute)",
              textDecoration: "none",
            }}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
