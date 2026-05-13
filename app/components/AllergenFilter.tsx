"use client";

type Props = {
  items: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function AllergenFilter({ items, selected, onChange }: Props) {
  function toggle(item: string) {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    );
  }

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
        const active = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => toggle(item)}
            style={{
              flexShrink: 0,
              padding: "3px 8px",
              border: "1px solid var(--accent-2)",
              background: active ? "var(--accent-2)" : "transparent",
              color: active ? "var(--ink)" : "var(--mute)",
              fontSize: 11,
              fontFamily: "var(--font-sans)",
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
