import { FaCrown } from "react-icons/fa6";
import { TbTriangleFilled } from "react-icons/tb";
import type { Tier } from "../lib/data";

const STYLES: Record<Tier, { bg: string; color: string; border: string }> = {
  S:       { bg: "var(--accent)",   color: "var(--ink)",  border: "var(--line)"      },
  A:       { bg: "var(--accent-2)", color: "var(--ink)",  border: "var(--line)"      },
  B:       { bg: "var(--accent-3)", color: "var(--ink)",  border: "var(--line)"      },
  C:       { bg: "var(--accent-4)",   color: "var(--ink)",  border: "var(--line)"    },
  Unknown: { bg: "var(--fill-2)",   color: "var(--mute)", border: "var(--line-soft)" },
};

export default function TierBadge({ tier, size = 28 }: { tier: Tier; size?: number }) {
  const s = STYLES[tier];
  const fontSize = Math.round(size * 0.39);
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        color: s.color,
      }}
    >
      {tier === "S"
        ? <FaCrown size={size} color={s.bg} style={{ position: "absolute", top: -3 }} />
        : <TbTriangleFilled size={size} color={s.bg} style={{ position: "absolute" }} />
      }
      <span style={{ position: "relative", fontFamily: "var(--font-accent)", fontWeight: 700, fontSize, lineHeight: 1, marginTop: Math.round(size * (tier === "S" ? 0.23 : 0.14)) }}>
        {tier === "Unknown" ? "?" : tier}
      </span>
    </span>
  );
}
