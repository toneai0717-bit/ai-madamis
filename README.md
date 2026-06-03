# AIマダミス（MVP）

1人で、いつでも、何度でも遊べる AI生成型の本格マーダーミステリー。
このMVPは固定シナリオ「**霧ヶ峰山荘の惨劇**」（容疑者3人・チャット20回・約15分）を、
Gemini無料枠で動かす最小構成。

## セットアップ

1. Gemini APIキーを取得（無料枠）: https://aistudio.google.com/apikey
2. `.env.local` の `GEMINI_API_KEY=` にキーを貼る
3. 起動:

```bash
npm install
npm run dev
```

→ http://localhost:3000 （プレビュー用は 3030）

## 遊び方

- 容疑者3人をタブで切り替え、自由に尋問（合計20回まで）
- 矛盾を突いて犯人・凶器・動機を絞り込む
- 「推理する（投票）」で犯人・凶器・動機の三択を提出
- 全問正解で勝利。回数を使い切ると強制ラストチャンス投票

## アーキテクチャ（3層プロンプト制御）

```
GM（真相）= サーバー専用定数 lib/game/scenario-truth.ts（クライアントに渡さない）
   ├─ 容疑者AI: app/api/chat   … Gemini が各容疑者のハンドアウトで演技
   └─ 採点AI:   app/api/verdict … 正誤はサーバーで確定 + 解説をGeminiが生成
```

| 層 | 技術 |
|---|---|
| フロント | Next.js 15 (App Router) / React 19 / Tailwind CSS |
| API | Next.js Route Handlers（サーバー側のみでGemini呼び出し） |
| AI | `@google/genai` / `gemini-2.5-flash`（無料枠） |
| 真相の保護 | `scenario-truth.ts` を `server-only` で隔離。固定シナリオのためDB不要＝固定費ゼロ |

### ディレクトリ

```
app/
  page.tsx                # ゲーム画面
  api/chat/route.ts       # 容疑者チャット
  api/verdict/route.ts    # 推理採点
components/               # SceneBoard / SuspectTabs / ChatTimeline / ChatInput / ChatCounter / VerdictModal
lib/
  game/scenario-public.ts # 公開情報（クライアント可）
  game/scenario-truth.ts  # 真相（サーバー専用・server-only）
  ai/gemini.ts            # Geminiクライアント
  ai/prompts.ts           # 容疑者 / 採点プロンプト
```

## 次の拡張（毎回生成版へ）

- `app/api/new-game` を追加し、GMプロンプトで真相プロットをJSON生成
- 生成した真相はサーバー秘密鍵で暗号化したトークンにしてクライアント保持（DBレスのまま固定費ゼロ）
- 世界観・人数・難易度の選択、シナリオのバリエーション追加
