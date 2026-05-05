"use client";

type Props = {
  items: string[];
  value: string;
  onChange: (val: string) => void;
};

export default function TagFilter({ items, value, onChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "0 16px 10px",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {items.map((item) => {
        const active = item === value;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            style={{
              flexShrink: 0,
              padding: "3px 8px",
              border: `1px solid ${active ? "var(--line)" : "var(--line-soft)"}`,
              background: active ? "var(--line)" : "transparent",
              color: active ? "var(--paper)" : "var(--mute)",
              fontSize: 11,
              fontFamily: "'IBM Plex Sans KR', sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
