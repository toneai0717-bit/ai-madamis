import { NextResponse } from "next/server";
import { claudeText } from "@/lib/ai/claude";
import { verdictSystemPrompt } from "@/lib/ai/prompts";
import { TRUTH } from "@/lib/game/scenario-truth";
import { suspectName, weaponLabel, motiveLabel } from "@/lib/game/scenario-public";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { culpritId?: string; weapon?: string; motive?: string };
    const { culpritId, weapon, motive } = body;

    if (!culpritId || !weapon || !motive) {
      return NextResponse.json({ error: "犯人・凶器・動機をすべて選択してください。" }, { status: 400 });
    }

    const correct = {
      culprit: culpritId === TRUTH.culpritId,
      weapon: weapon === TRUTH.trueWeapon,
      motive: motive === TRUTH.trueMotive,
    };
    const win = correct.culprit && correct.weapon && correct.motive;

    const userText = `プレイヤーの最終推理:
- 犯人: ${suspectName(culpritId)} (${correct.culprit ? "正解" : "不正解"})
- 凶器: ${weaponLabel(weapon)} (${correct.weapon ? "正解" : "不正解"})
- 動機: ${motiveLabel(motive)} (${correct.motive ? "正解" : "不正解"})
この結果を踏まえ、解説を書いてください。`;

    let text: string;
    try {
      text = await claudeText({
        system: verdictSystemPrompt(TRUTH),
        messages: [{ role: "user", content: userText }],
        temperature: 0.7,
      });
    } catch {
      // LLM不通時のフォールバック(採点自体はサーバーで確定済み)
      text = win
        ? "見事な推理だ。真犯人は秘書・三上健司。横領の発覚を恐れ、書斎でブロンズ像により館主を手にかけた。"
        : `事件は解決しなかった。真犯人は秘書・三上健司、凶器はブロンズ像、動機は横領の隠蔽だった。葉巻の吸い殻と21:40の目撃証言が決め手だった。`;
    }

    return NextResponse.json({ correct, win, text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "サーバーエラーが発生しました。";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
