"use client";
import { useState } from "react";
import { SnowIcon } from "./icons";
import { SCENE_INTRO } from "@/lib/game/scenario-public";

export function SceneBoard() {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-lg border border-lodge-border bg-lodge-panel">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-semibold">
          <SnowIcon className="text-lodge-ember" />
          霧ヶ峰山荘の惨劇
        </span>
        <span className="text-xs text-lodge-muted">{open ? "閉じる" : "状況を見る"}</span>
      </button>
      {open && (
        <p className="whitespace-pre-line border-t border-lodge-border px-4 py-3 text-sm leading-relaxed text-lodge-muted">
          {SCENE_INTRO}
        </p>
      )}
    </section>
  );
}
