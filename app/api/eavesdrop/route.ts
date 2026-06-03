import { NextResponse } from "next/server";
import { claudeText } from "@/lib/ai/claude";
import { TRUTH } from "@/lib/game/scenario-truth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { idA?: string; idB?: string };
    const { idA, idB } = body;

    if (!idA || !idB || idA === idB) {
      return NextResponse.json({ error: "2人の容疑者を選択してください。" }, { status: 400 });
    }

    const suspectA = TRUTH.suspects.find((s) => s.id === idA);
    const suspectB = TRUTH.suspects.find((s) => s.id === idB);
    if (!suspectA || !suspectB) {
      return NextResponse.json({ error: "不明な容疑者です。" }, { status: 400 });
    }

    const system = `あなたは本格ミステリーのゲームマスター。
探偵が部屋の陰からこっそり盗み聞きした「容疑者2人の会話」を書く。

【${suspectA.name}の設定】
性格: ${suspectA.persona}
秘密: ${suspectA.secret}
知っている事実: ${suspectA.knownFacts.join(" / ")}
${suspectA.isCulprit ? "※この人物は真犯人。" : ""}

【${suspectB.name}の設定】
性格: ${suspectB.persona}
秘密: ${suspectB.secret}
知っている事実: ${suspectB.knownFacts.join(" / ")}
${suspectB.isCulprit ? "※この人物は真犯人。" : ""}

# ルール
- 探偵には直接言わない本音や警戒心が滲む会話を書く。
- 各キャラ3〜4セリフずつ、計8文程度。
- 自白はしない。ただし探偵が聞いたら「これは怪しい」と思える言葉は出てよい。
- 「${suspectA.name}：セリフ」の形式で書く。情景描写を1〜2行挟んでもよい。
- 日本語のみ。`;

    const text = await claudeText({
      system,
      messages: [{ role: "user", content: "盗み聞きシーンを生成してください。" }],
      temperature: 0.95,
    });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[eavesdrop]", err);
    const msg = err instanceof Error ? err.message : "サーバーエラーが発生しました。";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
