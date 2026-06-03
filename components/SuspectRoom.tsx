"use client";
import { PortraitById } from "./CharacterPortrait";
import { SCENE_LOCATIONS, type SceneLocation } from "@/lib/game/events";
import type { Msg } from "@/lib/game/types";

interface Props {
  histories: Record<string, Msg[]>;
  scenesDone: Set<string>;
  eavesdropUsed: boolean;
  onSelect: (id: string) => void;
  onExamine: (scene: SceneLocation) => void;
  onEavesdrop: () => void;
}

const SUSPECT_CARDS = [
  { id: "a", name: "黒岩 美咲", title: "被害者の姪",    location: "窓際",     atmosphere: "吹雪の外を見つめ、腕を固く組んでいる。あなたの気配に気づき、鋭い目を向けた。" },
  { id: "b", name: "三上 健司", title: "被害者の秘書",  location: "ソファ",   atmosphere: "薄い書類に目を落とし、穏やかな表情で座っている。どこか上の空のようにも見える。" },
  { id: "c", name: "白石 涼子", title: "賓客・医師",    location: "暖炉のそば", atmosphere: "紅茶のカップを手に、炎をじっと見つめている。遺体を発見した直後とは思えない静けさだ。" },
];

export function SuspectRoom({ histories, scenesDone, eavesdropUsed, onSelect, onExamine, onEavesdrop }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-lodge-muted">
        あなたは一階のサロンに戻った。吹雪の音が窓を叩いている。
        三人の容疑者が、思い思いの場所に散らばっている。
      </p>

      {/* 容疑者カード */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SUSPECT_CARDS.map((c) => {
          const msgs = histories[c.id] ?? [];
          const talked = msgs.length > 0;
          const exchanges = Math.floor(msgs.length / 2);
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-lg border border-lodge-border bg-lodge-panel p-4">
              <div className="flex items-center gap-3">
                <PortraitById id={c.id} size={56} className="shrink-0 rounded-full" />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold truncate">{c.name}</span>
                    <span className="text-xs text-lodge-muted shrink-0">{c.location}</span>
                  </div>
                  <div className="text-xs text-lodge-ember">{c.title}</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-lodge-muted">{c.atmosphere}</p>
              <div className="flex items-center justify-between">
                {talked
                  ? <span className="rounded-full border border-lodge-ember/40 px-2 py-0.5 text-xs text-lodge-ember">聴取済み</span>
                  : <span className="rounded-full border border-lodge-border px-2 py-0.5 text-xs text-lodge-muted">未接触</span>
                }
                <button
                  onClick={() => onSelect(c.id)}
                  className="rounded-lg border border-lodge-ember px-3 py-1.5 text-xs font-semibold text-lodge-ember hover:bg-lodge-ember hover:text-lodge-bg transition-colors"
                >
                  {talked ? "続けて話す" : "話しかける"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 現場捜査 */}
      <div className="rounded-lg border border-lodge-border bg-lodge-panel p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-lodge-muted">
          現場を調べる
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SCENE_LOCATIONS.map((loc) => {
            const done = scenesDone.has(loc.id);
            return (
              <div key={loc.id} className="flex flex-col gap-1.5">
                <button
                  onClick={() => !done && onExamine(loc)}
                  disabled={done}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                    done
                      ? loc.hasClue
                        ? "border-lodge-ember/40 bg-lodge-panel2 text-lodge-ember cursor-default"
                        : "border-lodge-border/40 bg-lodge-panel2 text-lodge-border cursor-default"
                      : "border-lodge-border bg-lodge-panel hover:border-lodge-ember hover:text-lodge-text text-lodge-muted"
                  }`}
                >
                  <div className="font-semibold">{loc.name}</div>
                  <div className="mt-0.5 text-[10px] opacity-70">{loc.desc}</div>
                  {done && (
                    <div className={`mt-1 text-[10px] font-semibold ${loc.hasClue ? "text-lodge-ember" : "text-lodge-border"}`}>
                      {loc.hasClue ? "手がかりあり" : "収穫なし"}
                    </div>
                  )}
                </button>
                {done && (
                  <div className={`rounded border px-2 py-1.5 text-[11px] leading-relaxed ${
                    loc.hasClue
                      ? "border-lodge-ember/20 bg-lodge-panel2 text-lodge-muted"
                      : "border-lodge-border/30 bg-lodge-panel2 text-lodge-border"
                  }`}>
                    {loc.clue}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 盗み聞き */}
      <button
        onClick={onEavesdrop}
        disabled={eavesdropUsed}
        className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
          eavesdropUsed
            ? "border-lodge-border text-lodge-border cursor-default"
            : "border-lodge-muted text-lodge-muted hover:border-lodge-text hover:text-lodge-text"
        }`}
      >
        {eavesdropUsed ? "盗み聞き：使用済み" : "盗み聞きする（残り 1 回）"}
      </button>
    </section>
  );
}
