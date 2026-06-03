"use client";
import { useState } from "react";
import { GavelIcon } from "./icons";
import {
  SUSPECTS_PUBLIC,
  WEAPON_OPTIONS,
  MOTIVE_OPTIONS,
} from "@/lib/game/scenario-public";
import type { Option, VerdictResult } from "@/lib/game/types";

function ChoiceGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Option[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-sm font-semibold text-lodge-muted">{title}</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
              value === o.id
                ? "border-lodge-ember bg-lodge-panel2 text-lodge-text"
                : "border-lodge-border bg-lodge-panel text-lodge-muted hover:border-lodge-muted"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function VerdictModal({
  forced,
  onClose,
}: {
  forced: boolean;
  onClose: () => void;
}) {
  const [culprit, setCulprit] = useState<string | null>(null);
  const [weapon, setWeapon] = useState<string | null>(null);
  const [motive, setMotive] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ready = culprit && weapon && motive;

  async function submit() {
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ culpritId: culprit, weapon, motive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "採点に失敗しました。");
      setResult(data as VerdictResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "採点に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-lodge-border bg-lodge-panel p-6 shadow-xl">
        {!result ? (
          <>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <GavelIcon className="text-lodge-ember" />
              推理を提出する
            </h2>
            {forced && (
              <p className="mt-2 rounded-md border border-lodge-danger/40 bg-lodge-danger/10 px-3 py-2 text-sm text-lodge-danger">
                チャット回数を使い切りました。これが最後の推理です。
              </p>
            )}
            <p className="mt-2 text-sm text-lodge-muted">犯人・凶器・動機を選んでください。</p>

            <div className="mt-5 space-y-5">
              <ChoiceGroup
                title="犯人は誰か"
                options={SUSPECTS_PUBLIC.map((s) => ({ id: s.id, label: s.name }))}
                value={culprit}
                onChange={setCulprit}
              />
              <ChoiceGroup title="凶器は何か" options={WEAPON_OPTIONS} value={weapon} onChange={setWeapon} />
              <ChoiceGroup title="動機は何か" options={MOTIVE_OPTIONS} value={motive} onChange={setMotive} />
            </div>

            {error && <p className="mt-4 text-sm text-lodge-danger">{error}</p>}

            <div className="mt-6 flex gap-2">
              {!forced && (
                <button
                  onClick={onClose}
                  className="rounded-lg border border-lodge-border px-4 py-2 text-sm text-lodge-muted hover:border-lodge-muted"
                >
                  尋問に戻る
                </button>
              )}
              <button
                onClick={submit}
                disabled={!ready || submitting}
                className="flex-1 rounded-lg bg-lodge-ember px-4 py-2 text-sm font-semibold text-lodge-bg disabled:opacity-40"
              >
                {submitting ? "判定中…" : "この推理で確定する"}
              </button>
            </div>
          </>
        ) : (
          <ResultView result={result} />
        )}
      </div>
    </div>
  );
}

function ResultView({ result }: { result: VerdictResult }) {
  const hits = [result.correct.culprit, result.correct.weapon, result.correct.motive].filter(Boolean).length;
  return (
    <div>
      <h2 className={`text-2xl font-bold ${result.win ? "text-lodge-ember" : "text-lodge-danger"}`}>
        {result.win ? "事件解決" : hits >= 1 ? "推理は届かなかった" : "迷宮入り"}
      </h2>
      <div className="mt-3 flex gap-2 text-xs">
        <Badge ok={result.correct.culprit} label="犯人" />
        <Badge ok={result.correct.weapon} label="凶器" />
        <Badge ok={result.correct.motive} label="動機" />
      </div>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-lodge-text">{result.text}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 w-full rounded-lg bg-lodge-ember px-4 py-2 text-sm font-semibold text-lodge-bg"
      >
        もう一度挑む
      </button>
    </div>
  );
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 ${
        ok ? "border-lodge-ember text-lodge-ember" : "border-lodge-border text-lodge-muted"
      }`}
    >
      {label} {ok ? "○" : "×"}
    </span>
  );
}
