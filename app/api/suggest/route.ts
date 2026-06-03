import { NextResponse } from "next/server";
import { claudeText } from "@/lib/ai/claude";
import type { Msg } from "@/lib/game/types";

export const runtime = "nodejs";

const SYSTEM = `あなたは腕利きの名探偵の助手。
探偵が今から容疑者に送る「次の1つの質問」を考える役割だ。

ルール:
- 会話履歴を読み、まだ聞けていない重要な点を突く質問を1つだけ生成する。
- アリバイ・目撃情報・凶器・他の容疑者との関係など、推理に直結する質問を優先する。
- 質問文のみを出力する。前置き・説明・「質問:」などのラベルは一切不要。
- 日本語で20文字以内の短い質問にする。`;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { history?: Msg[] };
    const history = body.history ?? [];

    const summary = history.length === 0
      ? "まだ会話はありません。最初の質問をしてください。"
      : history.map((m) => `${m.role === "user" ? "探偵" : "容疑者"}: ${m.text}`).join("\n");

    const question = await claudeText({
      system: SYSTEM,
      messages: [{ role: "user", content: summary }],
      temperature: 0.95,
      maxTokens: 64,
    });

    return NextResponse.json({ question: question.trim() });
  } catch (err) {
    console.error("[suggest]", err);
    const msg = err instanceof Error ? err.message : "提案の生成に失敗しました。";
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
