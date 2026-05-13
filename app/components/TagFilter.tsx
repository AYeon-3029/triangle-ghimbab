"use client";

import type { IconType } from "react-icons/lib";

type FilterItem = {
  label: string;
  Icon?: IconType;
};

type Props = {
  items: FilterItem[];
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
        const active = item.label === value;
        return (
          <button
            key={item.label}
            onClick={() => onChange(item.label)}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              border: `1px solid ${active ? "var(--line)" : "var(--line-soft)"}`,
              background: active ? "var(--line)" : "transparent",
              color: active ? "var(--paper)" : "var(--mute)",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {item.Icon && <item.Icon size={13} />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
