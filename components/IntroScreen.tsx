"use client";
import { GavelIcon, SnowIcon } from "./icons";

const CLUES = [
  "暖炉の灰に、葉巻の吸い殻が1本（遺体発見者の白石医師が目撃）",
  "凶器となった鈍器が書斎から消えている（持ち去られた可能性）",
  "書斎の扉に鍵はかかっておらず、昨夜は誰でも出入りできた",
  "死亡推定時刻：昨夜 21:00〜23:00",
];

const SUSPECTS_INTRO = [
  { name: "黒岩 美咲", title: "被害者の姪", desc: "剛三の唯一の肉親。遺産の相続人にあたる。" },
  { name: "三上 健司", title: "被害者の秘書", desc: "10年来の腹心。館の財務管理も一手に担っていた。" },
  { name: "白石 涼子", title: "賓客・医師", desc: "剛三に招かれた旧知の医師。遺体の第一発見者。" },
];

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8">

      {/* タイトル */}
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-lodge-ember">
          <SnowIcon className="h-5 w-5" />
          <span className="text-xs tracking-widest uppercase">Murder Mystery</span>
          <SnowIcon className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">霧ヶ峰山荘の惨劇</h1>
      </div>

      {/* プロローグ本文 */}
      <section className="mb-6 rounded-lg border border-lodge-border bg-lodge-panel p-5">
        <p className="text-sm leading-8 text-lodge-muted">
          明け方の4時過ぎ、<span className="text-lodge-text">霧ヶ峰山荘</span>に悲鳴が響いた。
        </p>
        <p className="mt-3 text-sm leading-8 text-lodge-muted">
          二階の書斎——館主・<span className="text-lodge-text">黒岩剛三（享年62歳）</span>が遺体で発見された。
          頭部に鈍器による陥没骨折。抵抗の痕跡はなく、就寝前に背後から一撃を受けたと思われる。
        </p>
        <p className="mt-3 text-sm leading-8 text-lodge-muted">
          麓へ続く山道は前夜からの吹雪で完全に閉ざされ、警察の到着は早くて<span className="text-lodge-text">翌朝</span>。
          山荘に残る者たちは、元刑事であるあなたに臨時の捜査を委ねることに合意した。
        </p>
        <p className="mt-3 text-sm leading-8 text-lodge-text font-medium">
          夜明け前に、この山荘にいる犯人を特定しなければならない。
        </p>
      </section>

      {/* 現場の手がかり */}
      <section className="mb-6 rounded-lg border border-lodge-ember/30 bg-lodge-panel p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-lodge-ember">
          <GavelIcon className="h-4 w-4" />
          現場で確認した手がかり
        </h2>
        <ul className="space-y-2">
          {CLUES.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-lodge-muted">
              <span className="mt-0.5 shrink-0 text-lodge-ember">—</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* 容疑者紹介 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-lodge-muted">
          容疑者
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {SUSPECTS_INTRO.map((s) => (
            <div key={s.name} className="rounded-lg border border-lodge-border bg-lodge-panel p-3">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="mt-0.5 text-xs text-lodge-ember">{s.title}</div>
              <div className="mt-1.5 text-xs leading-relaxed text-lodge-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 開始ボタン */}
      <button
        onClick={onStart}
        className="w-full rounded-lg bg-lodge-ember py-4 text-sm font-bold text-lodge-bg transition-opacity hover:opacity-90"
      >
        捜査を開始する
      </button>

      <p className="mt-4 text-center text-xs text-lodge-border">
        尋問は合計 20 回まで　—　犯人・凶器・動機の三択で解決
      </p>
    </main>
  );
}
