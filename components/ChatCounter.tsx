"use client";
import { TimerIcon } from "./icons";
import { MAX_TURNS } from "@/lib/game/scenario-public";

export function ChatCounter({ remaining }: { remaining: number }) {
  const low = remaining <= 5;
  const used = MAX_TURNS - remaining;
  return (
    <div className="flex items-center gap-2 text-sm">
      <TimerIcon className={low ? "text-lodge-danger" : "text-lodge-muted"} />
      <span className="hidden sm:flex items-center gap-1" aria-hidden>
        {Array.from({ length: MAX_TURNS }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i < used ? "bg-lodge-border" : low ? "bg-lodge-danger" : "bg-lodge-ember"
            }`}
          />
        ))}
      </span>
      <span className={`tabular-nums font-semibold ${low ? "text-lodge-danger" : "text-lodge-text"}`}>
        残り {remaining}
      </span>
    </div>
  );
}
