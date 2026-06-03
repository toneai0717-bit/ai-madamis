import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Msg } from "@/lib/game/types";

export const MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY が未設定です。.env.local に設定してください。");
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

// Msg（内部形式）→ Anthropic messages 形式に変換
export function toAnthropicMessages(
  history: Msg[],
  userText: string
): Anthropic.MessageParam[] {
  const msgs: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.text,
  }));
  msgs.push({ role: "user", content: userText });
  return msgs;
}

// 非ストリーミング（suggest / verdict / eavesdrop 用）
export async function claudeText(opts: {
  system: string;
  messages: Anthropic.MessageParam[];
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const ai = getClient();
  const res = await ai.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 1024,
    system: opts.system,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.9,
  });
  const block = res.content[0];
  return block.type === "text" ? block.text : "";
}

// ストリーミング（chat 用）→ ReadableStream を返す
export function claudeStream(opts: {
  system: string;
  messages: Anthropic.MessageParam[];
  temperature?: number;
}): ReadableStream<Uint8Array> {
  const ai = getClient();
  const enc = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = ai.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: opts.system,
          messages: opts.messages,
          temperature: opts.temperature ?? 0.9,
        });
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[claudeStream]", err);
      } finally {
        controller.close();
      }
    },
  });
}
