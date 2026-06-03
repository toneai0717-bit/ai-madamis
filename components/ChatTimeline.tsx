"use client";
import { useEffect, useRef } from "react";
import type { Msg } from "@/lib/game/types";

export function ChatTimeline({
  messages,
  suspectName,
  loading,
}: {
  messages: Msg[];
  suspectName: string;
  loading: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="scroll-soft flex-1 space-y-3 overflow-y-auto px-1 py-2">
      {messages.length === 0 && (
        <p className="py-8 text-center text-sm text-lodge-muted">
          {suspectName} への尋問を始めましょう。
        </p>
      )}
      {messages.map((m, i) => {
        const mine = m.role === "user";
        return (
          <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                mine
                  ? "bg-lodge-ember text-lodge-bg"
                  : "border border-lodge-border bg-lodge-panel2 text-lodge-text"
              }`}
            >
              {!mine && <div className="mb-0.5 text-xs font-semibold text-lodge-ember">{suspectName}</div>}
              <div className="whitespace-pre-line">{m.text}</div>
            </div>
          </div>
        );
      })}
      {loading && (
        <div className="flex justify-start">
          <div className="rounded-2xl border border-lodge-border bg-lodge-panel2 px-4 py-2 text-sm text-lodge-muted">
            {suspectName} は考えている…
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
