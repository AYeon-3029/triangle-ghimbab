import Link from "next/link";
import Image from "next/image";
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
        <Image src="/logo.png" alt="삼각편대" width={45} height={45} style={{ objectFit: "contain" }} />
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: "var(--ink)", marginTop: 5 }}>
          삼각편대
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          href="https://forms.gle/placeholder"
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
          <Link
            href="/products/_/review"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            리뷰 작성 →
          </Link>
        )}
      </div>
    </header>
  );
}
