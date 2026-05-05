"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "home",   label: "둘러보기", href: "/" },
  { id: "tier",   label: "티어",     href: "/tier" },
  { id: "search", label: "검색",     href: "/search" },
  { id: "me",     label: "MY",       href: "/me" },
];

export default function TabBar() {
  const pathname = usePathname();
  const activeId =
    pathname === "/"
      ? "home"
      : (TABS.find((t) => t.href !== "/" && pathname.startsWith(t.href))?.id ?? "home");

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--paper)",
        borderTop: "1px solid var(--line)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {TABS.map((tab) => {
        const active = tab.id === activeId;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "8px 0 6px",
              textDecoration: "none",
              color: active ? "var(--ink)" : "var(--mute)",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                border: `1px solid ${active ? "var(--line)" : "currentColor"}`,
                background: active ? "var(--line)" : "transparent",
              }}
            />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
