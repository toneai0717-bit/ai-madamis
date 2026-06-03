import { suspectSystemPrompt } from "@/lib/ai/prompts";
import { TRUTH } from "@/lib/game/scenario-truth";
import { claudeStream, toAnthropicMessages } from "@/lib/ai/claude";
import type { Msg } from "@/lib/game/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { suspectId?: string; history?: Msg[]; message?: string };
    const { suspectId, history = [], message } = body;

    if (!suspectId || !message?.trim()) {
      return new Response(JSON.stringify({ error: "suspectId と message は必須です。" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const handout = TRUTH.suspects.find((s) => s.id === suspectId);
    if (!handout) {
      return new Response(JSON.stringify({ error: "不明な容疑者です。" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const system = suspectSystemPrompt(handout, TRUTH);
    const messages = toAnthropicMessages(history, message);
    const stream = claudeStream({ system, messages });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[chat]", err);
    const msg = err instanceof Error ? err.message : "サーバーエラーが発生しました。";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
