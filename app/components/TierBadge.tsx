import type { Tier } from "../lib/data";

const STYLES: Record<Tier, { bg: string; color: string; border: string }> = {
  S: { bg: "var(--accent)",  color: "#fff",          border: "var(--accent)"    },
  A: { bg: "var(--paper)",   color: "var(--ink)",    border: "var(--line)"      },
  B: { bg: "var(--fill)",    color: "var(--ink)",    border: "var(--line)"      },
  C: { bg: "var(--fill-2)",  color: "var(--mute)",   border: "var(--line-soft)" },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const s = STYLES[tier];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 700,
        fontSize: 13,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {tier}
    </span>
  );
}
