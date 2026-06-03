"use client";
import { SUSPECTS_PUBLIC } from "@/lib/game/scenario-public";

export function SuspectTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="容疑者">
      {SUSPECTS_PUBLIC.map((s) => {
        const selected = s.id === active;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(s.id)}
            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
              selected
                ? "border-lodge-ember bg-lodge-panel2"
                : "border-lodge-border bg-lodge-panel hover:border-lodge-muted"
            }`}
          >
            <div className="text-sm font-semibold">{s.name}</div>
            <div className="text-xs text-lodge-muted">{s.title}</div>
          </button>
        );
      })}
    </div>
  );
}
