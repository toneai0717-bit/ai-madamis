import "server-only";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

// 無料枠。混雑時は順に試す(先頭が本命、後続はフォールバック)。
export const MODELS = [
  "gemini-2.5-flash",  // 本命
  "gemini-2.0-flash",  // フォールバック
];

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が未設定です。.env.local に設定してください。");
  }
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

export interface GeminiTurn {
  role: "user" | "model";
  parts: { text: string }[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isTransient(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("500") ||
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("resource_exhausted") ||
    msg.includes("quota") ||
    msg.includes("overload") ||
    msg.includes("high demand") ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("busy")
  );
}

export async function genText(opts: {
  system: string;
  contents: GeminiTurn[];
  temperature?: number;
}): Promise<string> {
  const ai = getClient();
  let lastErr: unknown = null;

  // モデルを順に、各モデルで最大2回リトライ(指数バックオフ)。
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: opts.contents,
          config: {
            systemInstruction: opts.system,
            temperature: opts.temperature ?? 0.9,
          },
        });
        const text = res.text;
        if (text) return text;
        lastErr = new Error("空の応答が返りました。");
      } catch (err) {
        lastErr = err;
        if (!isTransient(err)) break; // 恒久的エラーは次モデルへ即移行
        await sleep(600 * (attempt + 1));
      }
    }
  }

  if (isTransient(lastErr)) {
    throw new Error("AIが混み合っています。少し待ってもう一度お試しください。");
  }
  throw new Error(lastErr instanceof Error ? lastErr.message : "AIの応答取得に失敗しました。");
}
