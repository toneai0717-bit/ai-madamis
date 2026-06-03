"use client";
import type { GmEvent } from "@/lib/game/events";

export function EventModal({ event, onClose }: { event: GmEvent; onClose: () => void }) {
  const isNote = event.id === "note";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-md rounded-xl border border-lodge-border bg-lodge-panel p-6 shadow-xl">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-lodge-ember">
          {isNote ? "— 密告 —" : "— 新たな動き —"}
        </div>
        <h2 className="mb-4 text-lg font-bold">{event.title}</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-lodge-muted">{event.text}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-lodge-ember py-2.5 text-sm font-semibold text-lodge-bg"
        >
          捜査を続ける
        </button>
      </div>
    </div>
  );
}
