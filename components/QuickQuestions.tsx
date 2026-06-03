"use client";

const QUESTIONS = [
  "昨夜どこに？",
  "被害者との関係は？",
  "誰か見た？",
  "他に怪しい人は？",
  "凶器を知っている？",
  "何か隠してる？",
  "発見時の状況は？",
];

export function QuickQuestions({
  onSelect,
  disabled,
}: {
  onSelect: (q: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative pt-2 pb-1">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="shrink-0 rounded-full border border-lodge-border bg-lodge-panel2 px-3 py-1.5 text-xs text-lodge-muted transition-colors hover:border-lodge-ember hover:text-lodge-text disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>
      {/* 右端フェード：スクロール可能であることを示す */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-lodge-panel to-transparent" />
    </div>
  );
}
