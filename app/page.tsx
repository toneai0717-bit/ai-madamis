"use client";
import { useMemo, useState } from "react";
import { IntroScreen } from "@/components/IntroScreen";
import { SuspectRoom } from "@/components/SuspectRoom";
import { ChatTimeline } from "@/components/ChatTimeline";
import { ChatInput } from "@/components/ChatInput";
import { ChatCounter } from "@/components/ChatCounter";
import { VerdictModal } from "@/components/VerdictModal";
import { EventModal } from "@/components/EventModal";
import { EavesdropModal } from "@/components/EavesdropModal";
import { ArrowLeftIcon, GavelIcon } from "@/components/icons";
import { PortraitById } from "@/components/CharacterPortrait";
import { MAX_TURNS, SUSPECTS_PUBLIC, suspectName } from "@/lib/game/scenario-public";
import { GM_EVENTS, type SceneLocation } from "@/lib/game/events";
import type { Msg } from "@/lib/game/types";
import type { GmEvent } from "@/lib/game/events";

const FIRST_MEETING: Record<string, string> = {
  a: "「何ですか。まさか私を疑ってるんじゃないでしょうね」——開口一番、警戒心をむき出しにした。",
  b: "「ああ、探偵さんでしたね。どうぞ、何でも聞いてください」——先手を打つように、慇懃な笑みを浮かべた。",
  c: "白石医師はゆっくりとあなたに向き直った。「……遺体を発見したのは、私です。最初にお伝えしておくべきでしょう」",
};

type GamePhase = "intro" | "playing";
type Histories = Record<string, Msg[]>;
const emptyHistories: Histories = { a: [], b: [], c: [] };

export default function Home() {
  const [phase, setPhase]       = useState<GamePhase>("intro");
  const [chatWith, setChatWith] = useState<string | null>(null);
  const [histories, setHistories] = useState<Histories>(emptyHistories);
  const [remaining, setRemaining] = useState(MAX_TURNS);
  const [loading, setLoading]   = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // 投票
  const [showVerdict, setShowVerdict]     = useState(false);
  const [forced, setForced]               = useState(false);
  const [showForcedBanner, setShowForcedBanner] = useState(false);

  // 現場捜査
  const [scenesDone, setScenesDone]       = useState<Set<string>>(new Set());
  const [sceneModal, setSceneModal]       = useState<SceneLocation | null>(null);

  // 盗み聞き
  const [eavesdropUsed, setEavesdropUsed] = useState(false);
  const [showEavesdrop, setShowEavesdrop] = useState(false);

  // GMイベント
  const [firedEvents, setFiredEvents]     = useState<Set<string>>(new Set());
  const [pendingEvent, setPendingEvent]   = useState<GmEvent | null>(null);

  const activeName = useMemo(() => (chatWith ? suspectName(chatWith) : ""), [chatWith]);
  const messages   = chatWith ? (histories[chatWith] ?? []) : [];

  // チャット送信（ストリーミング）
  async function send(text: string) {
    if (!chatWith || loading || remaining <= 0) return;
    setError(null);
    const suspectId = chatWith;
    const history = histories[suspectId] ?? [];
    const nextHistory = [...history, { role: "user" as const, text }];

    setHistories((h) => ({ ...h, [suspectId]: [...nextHistory, { role: "model" as const, text: "" }] }));
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspectId, history, message: text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "応答の取得に失敗しました。");
      }

      // ── タイプライター付きストリーミング ──────────────────
      // receivedRef に全受信テキストを蓄積し、インターバルで
      // 30ms/2文字ずつ表示することで「人が話す速度」を再現する。
      const received = { text: "" };
      let displayedLen = 0;

      const typewriter = setInterval(() => {
        if (displayedLen < received.text.length) {
          displayedLen = Math.min(displayedLen + 2, received.text.length);
          const shown = received.text.slice(0, displayedLen);
          setHistories((h) => ({
            ...h,
            [suspectId]: [...nextHistory, { role: "model" as const, text: shown }],
          }));
        }
      }, 30);

      try {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            received.text += decoder.decode(value, { stream: true });
          }
        }
        // ストリーム完了後、タイプライターが追いつくまで待機
        await new Promise<void>((resolve) => {
          const wait = setInterval(() => {
            if (displayedLen >= received.text.length) {
              clearInterval(wait);
              resolve();
            }
          }, 30);
        });
      } finally {
        clearInterval(typewriter);
        // 必ず全文を反映
        setHistories((h) => ({
          ...h,
          [suspectId]: [...nextHistory, { role: "model" as const, text: received.text }],
        }));
      }

      const left = remaining - 1;
      setRemaining(left);

      // GMイベント判定
      const event = GM_EVENTS.find((e) => e.triggerAt === left && !firedEvents.has(e.id));
      if (event) {
        setFiredEvents((s) => new Set(s).add(event.id));
        setPendingEvent(event);
      }

      if (left <= 0) { setForced(true); setShowForcedBanner(true); }
    } catch (e) {
      setError(e instanceof Error ? e.message : "応答の取得に失敗しました。");
      setHistories((h) => ({ ...h, [suspectId]: history }));
    } finally {
      setLoading(false);
    }
  }

  async function aiSuggest() {
    if (!chatWith || loading || suggesting || remaining <= 0) return;
    setSuggesting(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: histories[chatWith] ?? [] }),
      });
      const data = await res.json();
      if (!res.ok || !data.question) throw new Error(data.error ?? "提案の生成に失敗しました。");
      await send(data.question);
    } catch (e) {
      setError(e instanceof Error ? e.message : "提案の生成に失敗しました。");
    } finally {
      setSuggesting(false);
    }
  }

  function examineScene(loc: SceneLocation) {
    setScenesDone((s) => new Set(s).add(loc.id));
    setSceneModal(loc);
  }

  // ── イントロ ──────────────────────────────────────────────
  if (phase === "intro") return <IntroScreen onStart={() => setPhase("playing")} />;

  // ── 尋問画面 ──────────────────────────────────────────────
  if (chatWith) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-4 py-5">
        <header className="flex items-center justify-between">
          <button onClick={() => { setChatWith(null); setError(null); }}
            className="flex items-center gap-1.5 text-sm text-lodge-muted hover:text-lodge-text">
            <ArrowLeftIcon className="h-4 w-4" />捜査場面に戻る
          </button>
          <ChatCounter remaining={remaining} />
        </header>

        <div className="flex items-center gap-3">
          <PortraitById id={chatWith} size={48} className="shrink-0 rounded-full" />
          <div>
            <h2 className="text-base font-bold leading-tight">{activeName}</h2>
            <span className="text-xs text-lodge-muted">{SUSPECTS_PUBLIC.find((s) => s.id === chatWith)?.title}</span>
          </div>
        </div>

        <section className="flex min-h-[52vh] flex-1 flex-col rounded-lg border border-lodge-border bg-lodge-panel p-3">
          {messages.length === 0 && (
            <div className="mb-3 rounded-lg border border-lodge-ember/30 bg-lodge-panel2 px-4 py-3">
              <p className="text-xs italic leading-relaxed text-lodge-muted">{FIRST_MEETING[chatWith]}</p>
            </div>
          )}
          <ChatTimeline messages={messages} suspectName={activeName} loading={loading} />
          {error && <p className="px-1 pb-1 text-xs text-lodge-danger">{error}</p>}
          <ChatInput onSend={send} onAiSuggest={aiSuggest}
            disabled={loading || suggesting || remaining <= 0}
            placeholder={remaining <= 0 ? "尋問は終了しました" : `${activeName} に質問する…`}
            suggesting={suggesting} />
        </section>

        {showForcedBanner && !showVerdict ? (
          <div className="rounded-lg border border-lodge-danger/50 bg-lodge-danger/10 px-4 py-3">
            <p className="text-sm font-semibold text-lodge-danger">尋問回数を使い切りました</p>
            <p className="mt-0.5 text-xs text-lodge-muted">最後の返答を確認して、推理を提出してください。</p>
            <button onClick={() => setShowVerdict(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-lodge-danger py-2 text-sm font-semibold text-white">
              <GavelIcon className="h-4 w-4" />ラストチャンス — 推理を提出する
            </button>
          </div>
        ) : !showForcedBanner && (
          <button onClick={() => { setForced(false); setShowVerdict(true); }}
            className="flex items-center justify-center gap-2 rounded-lg border border-lodge-ember bg-lodge-panel py-3 text-sm font-semibold text-lodge-ember hover:bg-lodge-panel2 transition-colors">
            <GavelIcon className="h-4 w-4" />推理する（投票）
          </button>
        )}

        {showVerdict && <VerdictModal forced={forced} onClose={() => setShowVerdict(false)} />}
        {pendingEvent && <EventModal event={pendingEvent} onClose={() => setPendingEvent(null)} />}
      </main>
    );
  }

  // ── 捜査場面（部屋）────────────────────────────────────────
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-4 py-5">
      <header className="flex items-center justify-between">
        <h1 className="text-base font-bold tracking-wide">AIマダミス</h1>
        <ChatCounter remaining={remaining} />
      </header>

      <SuspectRoom
        histories={histories}
        scenesDone={scenesDone}
        eavesdropUsed={eavesdropUsed}
        onSelect={setChatWith}
        onExamine={examineScene}
        onEavesdrop={() => setShowEavesdrop(true)}
      />

      {showForcedBanner && !showVerdict ? (
        <div className="rounded-lg border border-lodge-danger/50 bg-lodge-danger/10 px-4 py-3">
          <p className="text-sm font-semibold text-lodge-danger">尋問回数を使い切りました</p>
          <p className="mt-0.5 text-xs text-lodge-muted">推理を提出してください。</p>
          <button onClick={() => setShowVerdict(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-lodge-danger py-2 text-sm font-semibold text-white">
            <GavelIcon className="h-4 w-4" />ラストチャンス — 推理を提出する
          </button>
        </div>
      ) : !showForcedBanner && (
        <button onClick={() => { setForced(false); setShowVerdict(true); }}
          className="flex items-center justify-center gap-2 rounded-lg border border-lodge-ember bg-lodge-panel py-3 text-sm font-semibold text-lodge-ember hover:bg-lodge-panel2 transition-colors">
          <GavelIcon className="h-4 w-4" />推理する（投票）
        </button>
      )}

      {/* 現場手がかりモーダル */}
      {sceneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-sm rounded-xl border border-lodge-border bg-lodge-panel p-6">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-lodge-ember">— 発見 —</div>
            <h2 className="mb-3 text-lg font-bold">{sceneModal.name}</h2>
            <p className="text-sm leading-relaxed text-lodge-muted">{sceneModal.clue}</p>
            <button onClick={() => setSceneModal(null)}
              className="mt-5 w-full rounded-lg bg-lodge-ember py-2.5 text-sm font-semibold text-lodge-bg">
              記録した
            </button>
          </div>
        </div>
      )}

      {showEavesdrop && (
        <EavesdropModal onClose={() => { setEavesdropUsed(true); setShowEavesdrop(false); }} />
      )}

      {showVerdict && <VerdictModal forced={forced} onClose={() => setShowVerdict(false)} />}
      {pendingEvent && <EventModal event={pendingEvent} onClose={() => setPendingEvent(null)} />}
    </main>
  );
}
