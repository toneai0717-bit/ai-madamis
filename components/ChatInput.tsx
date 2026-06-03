"use client";
import { useState } from "react";
import { SendIcon } from "./icons";

function BotIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

export function ChatInput({
  onSend,
  onAiSuggest,
  disabled,
  placeholder,
  suggesting,
}: {
  onSend: (text: string) => void;
  onAiSuggest: () => void;
  disabled: boolean;
  placeholder: string;
  suggesting: boolean;
}) {
  const [text, setText] = useState("");

  function submit() {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  }

  return (
    <div className="flex flex-col gap-2 border-t border-lodge-border pt-3">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-lg border border-lodge-border bg-lodge-panel px-3 py-2 text-sm outline-none focus:border-lodge-ember disabled:opacity-50"
        />
        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="flex h-11 items-center gap-1.5 rounded-lg bg-lodge-ember px-4 text-sm font-semibold text-lodge-bg transition-opacity disabled:opacity-40"
        >
          <SendIcon className="h-4 w-4" />
          送信
        </button>
      </div>
      {/* AI質問ボタン */}
      {!disabled && (
        <button
          onClick={onAiSuggest}
          disabled={disabled || suggesting}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-lodge-border bg-lodge-panel2 py-1.5 text-xs text-lodge-muted transition-colors hover:border-lodge-muted hover:text-lodge-text disabled:opacity-40"
        >
          <BotIcon />
          {suggesting ? "AIが考えています…" : "AIに質問を考えてもらう"}
        </button>
      )}
    </div>
  );
}
