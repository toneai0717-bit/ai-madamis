"use client";
import { useState } from "react";
import { SUSPECTS_PUBLIC } from "@/lib/game/scenario-public";
import { PortraitById } from "./CharacterPortrait";

export function EavesdropModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  }

  async function execute() {
    if (selected.length !== 2 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/eavesdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idA: selected[0], idB: selected[1] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "盗み聞きに失敗しました。");
      setResult(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "盗み聞きに失敗しました。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="scroll-soft flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-xl border border-lodge-border bg-lodge-panel p-6 shadow-xl">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-lodge-ember">
          — 盗み聞き —
        </div>
        <h2 className="mb-1 text-lg font-bold">2人の会話を覗く</h2>
        <p className="mb-4 text-xs text-lodge-muted">
          {result ? "会話の内容" : "盗み聞きする2人を選んでください（1回限り）"}
        </p>

        {!result ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {SUSPECTS_PUBLIC.map((s) => {
                const sel = selected.includes(s.id);
                const disabled = !sel && selected.length >= 2;
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    disabled={disabled}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${
                      sel
                        ? "border-lodge-ember bg-lodge-panel2"
                        : "border-lodge-border bg-lodge-panel opacity-" + (disabled ? "30" : "100")
                    } disabled:opacity-30`}
                  >
                    <PortraitById id={s.id} size={48} />
                    <span className="text-xs font-semibold">{s.name}</span>
                  </button>
                );
              })}
            </div>
            {error && <p className="mb-3 text-xs text-lodge-danger">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-lodge-border px-4 py-2 text-sm text-lodge-muted hover:border-lodge-muted"
              >
                キャンセル
              </button>
              <button
                onClick={execute}
                disabled={selected.length !== 2 || loading}
                className="flex-1 rounded-lg bg-lodge-ember py-2 text-sm font-semibold text-lodge-bg disabled:opacity-40"
              >
                {loading ? "聞き耳を立てている…" : "盗み聞きする"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-lg border border-lodge-border bg-lodge-panel2 p-4 mb-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-lodge-muted">{result}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-lodge-ember py-2.5 text-sm font-semibold text-lodge-bg"
            >
              捜査を続ける
            </button>
          </>
        )}
      </div>
    </div>
  );
}
